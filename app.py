from flask import Flask, request, send_file
app = Flask(__name__)
from ldm.generate import Generate
from omegaconf import OmegaConf
import random


@app.route("/")

def index():
    return "hello world"


@app.route("/api", methods=["GET", "POST"])
def api():

    args = request.args

    # Get models and configs
    model = args.get("model", default="stable-diffusion_1-4")
    models = OmegaConf.load("configs/models.yaml")
    width = models[model].width
    height = models[model].height
    config = models[model].config
    weights = models[model].weights

    arg_dict = {
        "prompt": args.get("prompt", default="an astronaut riding a horse"),
        "iterations": args.get("iterations", default=1),
        "steps": args.get("steps", default=50),
        "seed": args.get("seed", default=random.randint(1, 99999)),
        "cfg_scale": args.get("cfg_scale", default=7.5),
        "width": width,
        "height": height,
        "seamless": args.get("seamless", default=False),
        "init_img": args.get("init_img", default=None), # For img2img
        "init_mask": args.get("init_mask", default=None), # For inpainting
        "strength": args.get("strength", default=0.75)
    }

    generation = Generate(weights=weights, config=config)
    output = generation.prompt2png(**arg_dict, outdir="outputs/web_out")

    return send_file(output[0][0], mimetype="image/png")




    """
    init_params = {
        "iterations": request_json["iterations"] or 1,
        "steps": request_json["steps"] or 50,
        "cfg_scale": request_json["cfg_scale"] or 7.5,
        "weights": weights,
        "config": config,
        "width": width,
        "height": height,
        "strength": request_json["strength"] or 0.75,
        "seamless": request_json["seamless"] or False,
        "embedding_path": "embeddings/" + request_json["embeddings"] + ".pt" or None,
    }

    generate_params = {
        "prompt": request_json["prompt"] or "",
        "seed": request_json["seed"] or random.randint(1, 99999),
        "init_image": request_json["init_image"] or None,
        "mask_image": request_json["mask_image"] or None
    }

    generation = Generate(**init_params)
    result = generation.prompt2png(**generate_params)
    """


if __name__ == "__main__":
    app.run()