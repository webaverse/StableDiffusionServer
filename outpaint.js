(async () => {
  const canvasSize = 2048;
  const tileSize = 512;
  const prompt = `2D overhead view, full color fantasy height map, mysterious sakura forest, trending on artstation, pinterest, studio ghibli`;

  const genImg = async prompt => {
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
    const i = new Image();
    i.src = URL.createObjectURL(b);
    await new Promise((accept, reject) => {
      i.onload = accept;
      i.onerror = reject;
    });
    return i;
  };

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
})().then(console.log);