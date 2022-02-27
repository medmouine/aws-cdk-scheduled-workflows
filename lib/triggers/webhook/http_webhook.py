import json
import urllib.request
import os


def main(args):
    req = urllib.request.Request(url=os.environ['WEBHOOK_URL'],
                                 data=os.environ['WEBHOOK_PAYLOAD'].encode('utf8'),
                                 headers={
                                     'Content-type': 'application/json',
                                     **json.loads(os.environ['WEBHOOK_HEADERS'])
                                 },
                                 method=os.environ['WEBHOOK_METHOD'])
    response = urllib.request.urlopen(req)
    print(f'Sent {req.method} to {req.full_url}. Response: {response.read().decode("utf8")}')
