import json
from io import StringIO
from contextlib import redirect_stdout

def executeCode(event, context):
    event_body = event["body"]
    code = event_body["code"]

    output = run(code)

    response = {
        "statusCode": 200,
        "body": json.dumps({
            "output": output
        })
    }

    return response

def run(code):
    f = StringIO()
    with redirect_stdout(f):
        try:
            exec(code, {}, {})
        except Exception as e:
            print(e)

    return f.getvalue()
