echo "Setting up the environment for the project"

echo "IMPORTANT NOTE!!!"

echo "You need to have Huggingface CLI installed and you need to log in with your token to download the SD 1.5 weights"

wget https://repo.anaconda.com/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
bash ~/miniconda.sh -b -u -p ~/miniconda3

mkdir -p models/ldm/stable-diffusion-v1
conda env create
conda activate invokeai

PYTHON_STRING='import shutil
from huggingface_hub import hf_hub_download
downloaded_model_path=hf_hub_download(repo_id="runwayml/stable-diffusion-v1-5", filename="v1-5-pruned-emaonly.ckpt", use_auth_token=True)
print(downloaded_model_path)
import os
os.symlink(downloaded_model_path, "models/ldm/stable-diffusion-v1/sd-v1-5.ckpt")'

python -c "$PYTHON_STRING"

python scripts/preload_models.py
