from flask import Flask, request, send_file
app = Flask(__name__)
from ldm.generate import Generate
from omegaconf import OmegaConf
import random
from multidict import MultiDict

DEFAULT_MODEL = "stable-diffusion_1-4"

def get_png(args):

    #args = request.args

    # Get models and configs
    model = args.get("model", default=DEFAULT_MODEL)
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


@app.route("/")
def index():
    return "<h1>HTTP Error 403: Forbidden</h1>", 403


@app.route("/image", methods=["GET"])
def image():
    s = request.args.get("s")
    modelName = request.args.get("modelName", default=DEFAULT_MODEL)
    args = MultiDict(prompt=s, model=modelName)

    return get_png(args)


@app.route("/api", methods=["POST"])
def api():
    return get_png(request.args)


if __name__ == "__main__":
    app.run()