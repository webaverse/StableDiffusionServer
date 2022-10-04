export PATH="/home/ubuntu/anaconda3/bin:$PATH"
PYTORCH_CUDA_ALLOC_CONF=garbage_collection_threshold:0.6,max_split_size_mb:128
FLASK_APP=app
eval "$(conda shell.bash hook)"
conda activate ldm
flask run --host=216.153.51.112
