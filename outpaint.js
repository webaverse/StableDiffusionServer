huggingFaceKey = `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`;

//

function blob2img(blob) {
  const img = new Image();
  const u = URL.createObjectURL(blob);
  const promise = new Promise((accept, reject) => {
    function cleanup() {
      URL.revokeObjectURL(u);
    }
    img.onload = () => {
      accept(img);
      cleanup();
    };
    img.onerror = err => {
      reject(err);
      cleanup();
    };
  });
  img.crossOrigin = 'Anonymous';
  img.src = u;
  img.blob = blob;
  return promise;
}
function canvas2blob(canvas) {
  return new Promise((accept, reject) => {
    canvas.toBlob(accept, 'image/png');
  });
}

(async () => {
  const canvasSize = 2048;
  const tileSize = 512;
  const prompt = `2D overhead view, full color fantasy height map, mysterious sakura forest, trending on artstation, pinterest, studio ghibli`;

  const getFormData = (prompt, w, h) => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('width', w);
    formData.append('height', h);
    return formData;
  };
  const fillNoise = (canvas, ctx) => {
    // fills a canvas with noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      data[i + 0] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  };
  const fillCanvasFromClips = (dstCanvas, dstCtx, srcCanvas) => {
    const numClips = 200;
    const minClipSize = 64;
    const maxClipSize = 256;
    // fill dstCtx with numClips rectangle clips from srcCanvas, placed randomly
    for (let i = 0; i < numClips; i++) {
      const clipW = Math.floor(Math.random() * (maxClipSize - minClipSize) + minClipSize);
      const clipH = Math.floor(Math.random() * (maxClipSize - minClipSize) + minClipSize);
      const clipX = Math.floor(Math.random() * (srcCanvas.width - clipW));
      const clipY = Math.floor(Math.random() * (srcCanvas.height - clipH));
      const dstX = Math.floor(Math.random() * (dstCanvas.width - clipW));
      const dstY = Math.floor(Math.random() * (dstCanvas.height - clipH));
      dstCtx.drawImage(srcCanvas, clipX, clipY, clipW, clipH, dstX, dstY, clipW, clipH);
      console.log('draw clip', srcCanvas, clipX, clipY, clipW, clipH, dstX, dstY, clipW, clipH);
    }
  };
  async function getDepth(blob) {
    const res = await fetch('https://depth.webaverse.com/depth', {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": "image/png",
      },
      mode: 'cors',
    });
    const result = await res.blob();
    return result;
  }
  async function genImg(prompt) {
    const fd = getFormData(prompt, tileSize, tileSize);
    const res = await fetch(`http://stable-diffusion-server.webaverse.com/api`, {method: 'POST', body: fd});
    const b = await res.blob();
    const i = await blob2img(b);
    return i;
  }
  async function editImg(srcCanvas, prompt, maskCanvas) {
    const fd = getFormData(prompt, tileSize, tileSize);
    
    // opt.prompt,
    // // seed        = orig_opt.seed,    # uncomment to make it deterministic
    // sampler     = self.generate.sampler,
    // steps       = opt.steps,
    // cfg_scale   = opt.cfg_scale,
    // ddim_eta    = self.generate.ddim_eta,
    // width       = extended_image.width,
    // height      = extended_image.height,
    // init_img    = extended_image,
    // init_mask    = opt.init_mask,
    // strength    = opt.strength,
    // image_callback = wrapped_callback,
    // inpaint_replace = opt.inpaint_replace,
    const srcCanvasBlob = await canvas2blob(srcCanvas);
    fd.append('init_img', srcCanvasBlob);
    const maskCanvasBlob = await canvas2blob(maskCanvas);
    fd.append('init_mask', maskCanvasBlob, 'init_mask.png');
    // fd.append('inpaint_replace', '1.0');
    
    console.log('edit form data', fd);
    const res = await fetch(`http://stable-diffusion-server.webaverse.com/api`, {
      method: 'POST',
      body: fd,
    });
    const b = await res.blob();
    const i = await blob2img(b);
    return i;
  }

  // canvases
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  const depthCanvas = document.createElement('canvas');
  depthCanvas.width = canvasSize;
  depthCanvas.height = canvasSize;
  const depthCtx = depthCanvas.getContext('2d');
  document.body.appendChild(depthCanvas);

  const tiles = [];
  const _initialTile = async () => {
    const baseImg = await genImg(prompt, tileSize, tileSize);
    const baseImgPosition = [
      canvasSize / 2,
      canvasSize / 2,
    ];
    ctx.drawImage(baseImg, baseImgPosition[0], baseImgPosition[1]);

    const depthResult = await getDepth(baseImg.blob);
    const image = await blob2img(depthResult);
    depthCtx.drawImage(image, baseImgPosition[0], baseImgPosition[1]);
    
    const tile = {
      img: baseImg,
      position: baseImgPosition,
    };
    tiles.push(tile);
  };
  await _initialTile();

  const _secondTile = async (tiles, viewport) => {
    const x = viewport[0];
    const y = viewport[1];
    const w = viewport[2] - viewport[0];
    const h = viewport[3] - viewport[1];

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = w;
    srcCanvas.height = h;
    srcCanvas.classList.add('srcCanvas');
    const srcCtx = srcCanvas.getContext('2d');
    document.body.appendChild(srcCanvas);

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = w;
    maskCanvas.height = h;
    maskCanvas.classList.add('maskCanvas');
    const maskCtx = maskCanvas.getContext('2d');
    document.body.appendChild(maskCanvas);

    const _drawMask = (srcCanvas, srcCtx, maskCanvas, maskCtx, tiles) => {
      for (const tile of tiles) {
        const {img, position} = tile;
        // console.log('draw tile', tile)
        
        // fillNoise(srcCanvas, srcCtx);
        fillCanvasFromClips(srcCanvas, srcCtx, img);
        
        // compute position within the viewport
        const x1 = position[0] - x;
        const y1 = position[1] - y;
        const x2 = x1 + img.width;
        const y2 = y1 + img.height;
        const w = x2 - x1;
        const h = y2 - y1;

        // draw the image at the offset location within the viewport
        srcCtx.drawImage(img, x1, y1);

        // the image data covering this mask area
        // note that x1 and y1 might be negative, so we need to offset the values a bit
        const imageData = maskCtx.createImageData(w, h);

        // fill the image data based on the distance to the center
        const cx = w / 2;
        const cy = h / 2;
        for (let x = 0; x < imageData.width; x++) {
          for (let y = 0; y < imageData.height; y++) {
            const d = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            const maxD = imageData.width / 2;
            const r = (1 - ((d / maxD) ** 3)) * 255;
            const g = r;
            const b = r;
            const a = r;
            
            const i = (y * imageData.width + x) * 4;
            imageData.data[i + 0] = r;
            imageData.data[i + 1] = g;
            imageData.data[i + 2] = b;
            imageData.data[i + 3] = a;
          }
        }
        // draw the image data back into the mask
        maskCtx.putImageData(imageData, x1, y1);

        // draw red rectangle covering the tile area
        // maskCtx.fillStyle = 'red';
        // maskCtx.fillRect(x1, y1, x2 - x1, y2 - y1);
      }
    };
    _drawMask(srcCanvas, srcCtx, maskCanvas, maskCtx, tiles);

    const baseImg = await editImg(srcCanvas, prompt, maskCanvas);
    const baseImgPosition = [
      x,
      y,
    ];
    ctx.drawImage(baseImg, baseImgPosition[0], baseImgPosition[1]);

    const depthResult = await getDepth(baseImg.blob);
    const image = await blob2img(depthResult);
    depthCtx.drawImage(image, baseImgPosition[0], baseImgPosition[1]);

    const tile = {
      img: baseImg,
      position: baseImgPosition,
    };
    tiles.push(tile);
  };
  await _secondTile(tiles.slice(), [
    canvasSize / 2 + tileSize / 2,
    canvasSize / 2 + tileSize / 2,
    canvasSize / 2 + tileSize / 2 + tileSize,
    canvasSize / 2 + tileSize / 2 + tileSize,
  ]);

  const cssText = `\
    position: fixed;
    top: 0;
    left: 0;
    max-width: 100vw;
    max-height: 100vh;
    object-fit: contain;
    z-index: 100;
    visibility: hidden;
  `;
  canvas.style.cssText = cssText;
  depthCanvas.style.cssText = cssText;

  canvas.style.visibility = 'visible';

  let currentHeight = 0;
  window.addEventListener('keydown', e => {
    if (!e.repeat) {
      if (e.code === 'PageDown') {
        currentHeight--;
      } else if (e.code === 'PageUp') {
        currentHeight++;
      }
    }

    const _updateVisibility = () => {
      canvas.style.visibility = 'hidden';
      depthCanvas.style.visibility = 'hidden';
      if (currentHeight === 0) {
        canvas.style.visibility = 'visible';
      } else if (currentHeight === -1) {
        depthCanvas.style.visibility = 'visible';
      }
    };
    _updateVisibility();
  });

  return canvas;
})().then(console.log, console.warn);