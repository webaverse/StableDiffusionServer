<h3>Send POST request to <code>http://&lthostname&gt;/api</code>, receive png.</h3>

<h3>Parameters:</h3>
<ul>
  <li>
    model <code>stable-diffusion_1-4 or waifu-diffusion_1-2 - default: stable-diffusion_1-4</code>
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

<code>cp &lt;YOUR_MODEL&gt;.ckpt models/ldm/stable-diffusion-v1/&lt;YOUR_MODEL&gt;.ckpt</code>

Update <code>configs/models.yaml</code>:<br>
<code>
&lt;YOUR_MODEL&gt;_0-1:
    config: configs/stable-diffusion/v1-inference.yaml
    weights: models/ldm/stable-diffusion-v1/&lt;YOUR_MODEL&gt;.ckpt
    width: 512
    height: 512
</code>

<h3>WaifuDiffusion Example Prompts</h3>

WaifuDiffusion was trained on sequentially-weighted tokens derived from tags/keywords in the danbooru dataset. As a result, the safety filter is often unable to recognize NSFW generations and outputs get through the safety filter. Adding the "safebooru" keyword to the beginning of the prompt greatly decreases the chances of a NSFW output.

Due to model decay in WaifuDiffusion, use danbooru-style keywords when prompting for best results:

````safebooru bag beret black_bow black_bowtie black_headwear bow bowtie curly_hair dress floating food green_eyes green_hair hair_between_eyes hat looking_at_viewer outdoors short_hair shoulder_cutout solo````

````safebooru animal_ears black_coat blonde_hair blue_shirt coat computer formal from_above full_body gauntlets necktie office shirt solo suit sword tail weapon wheat_field white_necktie````

````safebooru against_glass bald black_dress blush broken_glass comic crossed_arms dress glass green_eyes green_hair profile smile sweatdrop traditional_media````

````safebooru animal_costume antlers bald black_sclera box cape colored_sclera curly_hair cyborg dress earrings flipped_hair floating food gift gift_box gloves hat headband jewelry long_hair monochrome open_mouth red_gloves scar scar_across_eye scar_on_face short_hair simple_background smile telekinesis````

````safebooru artist_name baseball_cap black_headwear black_shorts green_eyes green_hair green_jacket hair_between_eyes hat jacket long_hair long_sleeves official_alternate_costume official_alternate_hairstyle one_eye_closed shirt shorts signature solo v white_shirt````

````safebooru blue_eyes blue_sky cloud cowboy_shot day drill_hair hair_ribbon japanese_clothes kimono one-hour_drawing_challenge ponytail red_ribbon ribbon shade short_hair sky solo umbrella white_kimono````