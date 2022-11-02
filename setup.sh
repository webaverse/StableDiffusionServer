mkdir -p models/ldm/stable-diffusion-v1
conda env create
conda activate invokeai

# check if a file called TOKEN exists in the current directory
# if it does, read it into the TOKEN variable
# if it doesnt, set token to True
if [ -f TOKEN ]; then
    TOKEN=$(cat TOKEN)
else
    TOKEN=True
fi

PYTHON_STRING='import shutil
from huggingface_hub import hf_hub_download
downloaded_model_path=hf_hub_download(repo_id="runwayml/stable-diffusion-v1-5", filename="v1-5-pruned-emaonly.ckpt", use_auth_token=True)
print(downloaded_model_path)
import os
os.symlink(downloaded_model_path, "models/ldm/stable-diffusion-v1/sd-v1-5.ckpt")'

# replace use_auth_token=True in pythonString with use_auth_token=$TOKEN
# if TOKEN is True, then use_auth_token=True
# otherwise, use_auth_token=$TOKEN
PYTHON_STRING=${PYTHON_STRING/use_auth_token=True/use_auth_token=$TOKEN}

python -c "$PYTHON_STRING"

python3 scripts/preload_models.py
