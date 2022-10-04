cd /home/ubuntu/GitHub/InvokeAI/
PYTORCH_CUDA_ALLOC_CONF=garbage_collection_threshold:0.6,max_split_size_mb:128
FLASK_APP=/home/ubuntu/GitHub/InvokeAI/app
APPLICATION_ROOT=/home/ubuntu/GitHub/InvokeAI/
/home/ubuntu/anaconda3/envs/ldm/bin/python -m flask run --host=216.153.51.112