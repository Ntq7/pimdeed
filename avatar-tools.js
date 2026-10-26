// ========================================================
// 🖼️ avatar-tools.js - ย่อรูปโปรไฟล์ / GIF ในเครื่อง (ใช้ทั้งหน้าเกมและหน้าแอดมิน)
// รูปที่ย่อแล้วเล็กพอจะเก็บใน Firebase ตรงๆ → ไม่ต้องรอที่ฝากรูปภายนอก อัปไว ทุกคนเห็นทันที
// ========================================================

window.AvatarTools = (function() {
    const STILL_SIZE = 256;               // รูปนิ่ง: กว้าง/สูง (px)
    const GIF_SIZES = [160, 120, 96];     // GIF: ลองย่อจากใหญ่ไปเล็กจนกว่าจะเล็กพอ
    const GIF_MAX_FRAMES = 50;            // GIF ยาวๆ ข้ามเฟรมให้เหลือไม่เกินนี้ (ความเร็วเท่าเดิม)
    const INLINE_MAX_BYTES = 350 * 1024;  // เล็กกว่านี้เก็บใน Firebase ได้ตรงๆ
    const GIF_MAX_BYTES = 15 * 1024 * 1024;

    function fileToDataUrl(blob) {
        return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = () => rej(r.error);
            r.readAsDataURL(blob);
        });
    }

    async function decodeImage(file) {
        try { return await createImageBitmap(file); }
        catch (e) {
            // บางเบราว์เซอร์ createImageBitmap ไม่รองรับ → ใช้ <img> แทน
            return await new Promise((res, rej) => {
                const img = new Image();
                img.onload = () => res(img);
                img.onerror = () => rej(new Error('decode'));
                img.src = URL.createObjectURL(file);
            });
        }
    }

    // ตัดกลางรูปเป็นจัตุรัส แล้วย่อเหลือ size px
    function squareResize(src, size) {
        const w = src.width, h = src.height, side = Math.min(w, h);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = Math.min(size, side);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(src, (w - side) / 2, (h - side) / 2, side, side, 0, 0, canvas.width, canvas.height);
        return canvas;
    }

    let gifLibs = null;
    function loadGifLibs() {
        // โหลดเฉพาะตอนมีคนเลือก GIF จะได้ไม่ถ่วงหน้าเว็บ
        gifLibs = gifLibs || Promise.all([
            import('https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm'),
            import('https://cdn.jsdelivr.net/npm/gifenc@1.0.3/+esm')
        ]).catch(err => { gifLibs = null; throw err; });
        return gifLibs;
    }

    // ถอด GIF ทีละเฟรม → ตัดจัตุรัส ย่อ → เข้ารหัสกลับเป็น GIF ที่ยังขยับได้
    async function shrinkGif(buffer, size) {
        const [{ parseGIF, decompressFrames }, { GIFEncoder, quantize, applyPalette }] = await loadGifLibs();
        const gif = parseGIF(buffer);
        const frames = decompressFrames(gif, true);
        if (!frames.length) throw new Error('empty gif');

        const W = gif.lsd.width, H = gif.lsd.height, side = Math.min(W, H);
        const out = Math.min(size, side);
        const full = makeCanvas(W, H), fctx = full.getContext('2d');
        const patch = makeCanvas(1, 1), pctx = patch.getContext('2d');
        const small = makeCanvas(out, out), sctx = small.getContext('2d', { willReadFrequently: true });
        sctx.imageSmoothingQuality = 'high';

        const step = Math.max(1, Math.ceil(frames.length / GIF_MAX_FRAMES));
        const enc = GIFEncoder();
        let pendingDelay = 0;

        for (let i = 0; i < frames.length; i++) {
            const f = frames[i];
            const before = f.disposalType === 3 ? fctx.getImageData(0, 0, W, H) : null;

            patch.width = f.dims.width; patch.height = f.dims.height;
            pctx.putImageData(new ImageData(f.patch, f.dims.width, f.dims.height), 0, 0);
            fctx.drawImage(patch, f.dims.left, f.dims.top);
            pendingDelay += Math.max(f.delay || 0, 20);

            if (i % step === step - 1 || i === frames.length - 1) {
                sctx.fillStyle = '#0f172a';
                sctx.fillRect(0, 0, out, out);
                sctx.drawImage(full, (W - side) / 2, (H - side) / 2, side, side, 0, 0, out, out);
                const rgba = sctx.getImageData(0, 0, out, out).data;
                const palette = quantize(rgba, 256);
                enc.writeFrame(applyPalette(rgba, palette), out, out, { palette, delay: pendingDelay });
                pendingDelay = 0;
            }

            if (f.disposalType === 2) fctx.clearRect(f.dims.left, f.dims.top, f.dims.width, f.dims.height);
            else if (before) fctx.putImageData(before, 0, 0);
        }
        enc.finish();
        return new Blob([enc.bytes()], { type: 'image/gif' });
    }

    function makeCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        return c;
    }

    // ผลลัพธ์:
    //   { inline: dataUrl }                       → เก็บใน Firebase ได้เลย
    //   { upload: blob, fallback: dataUrl(นิ่ง) } → GIF ยังใหญ่เกิน ต้องพึ่งที่ฝากรูป
    // พร้อม preview (ลิงก์ไว้โชว์) และ isGif
    async function prepare(file, onProgress) {
        const isGif = file.type === 'image/gif';
        if (!isGif && !file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) {
            throw new Error('ต้องเป็นไฟล์รูปภาพเท่านั้น');
        }
        if (isGif && file.size > GIF_MAX_BYTES) {
            throw new Error(`GIF ใหญ่ไป (${(file.size / 1048576).toFixed(1)}MB) เอาไม่เกิน 15MB`);
        }

        const src = await decodeImage(file);
        const still = squareResize(src, STILL_SIZE).toDataURL('image/jpeg', 0.82);
        if (!isGif) return { isGif, inline: still, preview: still, bytes: Math.round(still.length * 0.75) };

        // GIF เล็กอยู่แล้ว ไม่ต้องย่อ
        if (file.size <= INLINE_MAX_BYTES && Math.max(src.width, src.height) <= 200) {
            const url = await fileToDataUrl(file);
            return { isGif, inline: url, preview: url, bytes: file.size };
        }

        let best = null;
        try {
            const buffer = await file.arrayBuffer();
            for (const size of GIF_SIZES) {
                if (onProgress) onProgress(`กำลังย่อ GIF (${size}px)...`);
                best = await shrinkGif(buffer, size);
                if (best.size <= INLINE_MAX_BYTES) {
                    const url = await fileToDataUrl(best);
                    return { isGif, inline: url, preview: url, bytes: best.size, originalBytes: file.size };
                }
            }
        } catch (err) {
            console.warn("ย่อ GIF ไม่ได้ ใช้ไฟล์ต้นฉบับแทน:", err);
        }
        // ย่อแล้วยังใหญ่ (หรือย่อไม่ได้) → ส่งขึ้นที่ฝากรูป ถ้าล่มก็ใช้ภาพนิ่ง
        const upload = best && best.size < file.size ? best : file;
        return { isGif, upload, fallback: still, preview: URL.createObjectURL(upload), bytes: upload.size, originalBytes: file.size };
    }

    // อัปขึ้น ImgBB พร้อมบอกเปอร์เซ็นต์ (ใช้กับ GIF ที่ใหญ่เกินเก็บใน Firebase เท่านั้น)
    function uploadToImgBB(blob, apiKey, onPercent) {
        return new Promise((resolve, reject) => {
            if (!apiKey) return reject(new Error('no key'));
            const form = new FormData();
            form.append('image', blob, blob.type === 'image/gif' ? 'avatar.gif' : 'avatar.jpg');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.imgbb.com/1/upload?key=' + encodeURIComponent(apiKey));
            xhr.timeout = 60000;
            xhr.upload.onprogress = e => { if (e.lengthComputable && onPercent) onPercent(Math.round(e.loaded / e.total * 100)); };
            xhr.onload = () => {
                try {
                    const json = JSON.parse(xhr.responseText);
                    if (json.success) resolve(json.data.url); // url = ไฟล์ต้นฉบับ (display_url อาจเป็นตัวย่อที่ GIF ไม่ขยับ)
                    else reject(new Error((json.error && json.error.message) || 'ImgBB error'));
                } catch (e) { reject(new Error('ImgBB ตอบกลับแปลกๆ')); }
            };
            xhr.onerror = () => reject(new Error('network'));
            xhr.ontimeout = () => reject(new Error('timeout'));
            xhr.send(form);
        });
    }

    return { prepare, uploadToImgBB, shrinkGif, loadGifLibs, INLINE_MAX_BYTES };
})();
