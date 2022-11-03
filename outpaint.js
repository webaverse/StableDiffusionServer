huggingFaceKey = `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`;

//

(async () => {
  const canvasSize = 2048;
  const tileSize = 512;
  const prompt = `2D overhead view, full color fantasy height map, mysterious sakura forest, trending on artstation, pinterest, studio ghibli`;

  /* async function blobToDataURL(blob) {
    var a = new FileReader();
    const promise = new Promise((accept, reject) => {
      a.onload = function(e) {
        accept(e.target.result);
      };
      a.onerror = reject;
    });
    a.readAsDataURL(blob);
    return await promise;
  } */
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

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  const baseImg = await genImg(prompt, tileSize, tileSize);
  const baseImgPosition = [
    canvasSize / 2,
    canvasSize / 2,
  ];
  ctx.drawImage(baseImg, baseImgPosition[0], baseImgPosition[1]);

  const result = await getDepth(baseImg.blob);
  console.log('got depth', result, baseImg.blob);
  const image = await blob2img(result);
  ctx.drawImage(image, 0, 0);

  document.body.appendChild(canvas);
  canvas.style.cssText = `\
    position: fixed;
    top: 0;
    left: 0;
    max-width: 100vw;
    max-height: 100vh;
    object-fit: contain;
    z-index: 100;
  `;
  return canvas;
})().then(console.log, console.warn);