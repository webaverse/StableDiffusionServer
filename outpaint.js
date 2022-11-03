huggingFaceKey = `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`;

//

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
  async function getDepth(blob) {
    // console.log('send blob', blob);
    // const blobDataUrl = await blobToDataURL(blob);
    // console.log('got blob', blobDataUrl);
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
    const fd = getFormData(prompt);
    const res = await fetch(`http://stable-diffusion-server.webaverse.com/api`, {method: 'POST', body: fd});
    const b = await res.blob();
    const i = await blob2img(b);
    return i;
  }
  async function editImg(srcCanvas, prompt, maskCanvas) {
    const fd = getFormData(prompt);
    
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

    for (const tile of tiles) {
      const {img, position} = tile;
      console.log('draw tile', tile)
      
      // draw the image at the offset location within the viewport
      const dx1 = position[0] - x;
      const dy1 = position[1] - y;
      const dx2 = dx1 + img.width;
      const dy2 = dy1 + img.height;

      // draw the image at the offset location within the viewport
      srcCtx.drawImage(img, dx1, dy1);

      // draw red rectangle covering the tile area
      maskCtx.fillStyle = 'red';
      console.log('fill rect', dx1, dy1, dx2 - dx1, dy2 - dy1);
      maskCtx.fillRect(dx1, dy1, dx2 - dx1, dy2 - dy1);
    }

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