huggingFaceKey = `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`;

//

(async () => {
  const canvasSize = 2048;
  const tileSize = 512;
  const prompt = `2D overhead view, full color fantasy height map, mysterious sakura forest, trending on artstation, pinterest, studio ghibli`;

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
    const getFormData = (prompt, w, h) => {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('width', w);
      formData.append('height', h);
      return formData;
    };
    const fd = getFormData(prompt);
    const res = await fetch(`http://stable-diffusion-server.webaverse.com/api`, {method: 'POST', body: fd});
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

  const baseImg = await genImg(prompt, tileSize, tileSize);
  const baseImgPosition = [
    canvasSize / 2,
    canvasSize / 2,
  ];
  ctx.drawImage(baseImg, baseImgPosition[0], baseImgPosition[1]);

  const depthResult = await getDepth(baseImg.blob);
  const image = await blob2img(depthResult);
  depthCtx.drawImage(image, baseImgPosition[0], baseImgPosition[1]);

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