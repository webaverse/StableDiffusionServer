<h1>Webaverse StableDiffusion</h1>

<h3>GET Request:</h3>
<code>http://&lthostname&gt;/image?s=&lt;YOUR_PROMPT&gt;&model=&lt;YOUR_MODEL&gt;</code>

<h3>POST Request (full SD parameters):</h3>
<code>http://&lthostname&gt;/api</code>
<ul>
  <li>
    model <code>stable-diffusion-1.5</code>
  </li>
  <li>
    prompt <code>default: "an astronaut riding a horse"</code>
  </li>
  <li>
    iterations <code>default: 50</code>
  </li>
  <li>
    steps <code>default: 1</code>
  </li>
  <li>
    seed <code>default: random()</code>
  </li>
  <li>
    cfg_scale <code>default: 7.5</code>
  </li>
  <li>
    seamless <code>makes output tileable. default: False</code>
  </li>
  <li>
    init_img  <code>for img2img.</code>
  </li>
  <li>
    init_mask <code>for inpainting</code>
  </li>
  <li>
    strength <code>default: 0.75</code>
  </li>
</ul>

<h3>Adding a model</h3>

<ol><li><code>cp &lt;YOUR_MODEL&gt;.ckpt models/ldm/stable-diffusion-v1/&lt;YOUR_MODEL&gt;.ckpt</code></li>

<li>Update configs/models.yaml:<br>
<pre>
&lt;YOUR_MODEL&gt;:
    config: configs/stable-diffusion/v1-inference.yaml
    weights: models/ldm/stable-diffusion-v1/&lt;YOUR_MODEL&gt;.ckpt
    width: 512
    height: 512
</pre></li>
<li>
The model can then be called in the API using the name specified in models.yaml.
</li>
</ol>
