FLASK_APP=app
eval "$(conda shell.bash hook)"
conda activate ldm
flask run --host=216.153.51.112
