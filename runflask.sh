export PATH="/home/ubuntu/anaconda3/bin:$PATH"
PYTORCH_CUDA_ALLOC_CONF=garbage_collection_threshold:0.6,max_split_size_mb:128
FLASK_APP=app
eval "$(conda shell.bash hook)"
conda activate invokeai

# use curl to call https://myexternalip.com/raw and get the external IP address
# then set that to IP_ADDRESS
IP_ADDRESS=$(curl -q https://myexternalip.com/raw)

echo $IP_ADDRESS

flask run --host=$IP_ADDRESS
