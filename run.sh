# check for python3, if it doesnt exist, use python
COMMAND="python3"
if ! command -v $COMMAND &> /dev/null
then
    COMMAND="python"
fi

$COMMAND scripts/invoke.py --web