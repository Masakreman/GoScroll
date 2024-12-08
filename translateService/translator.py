import requests
import uuid
import json

# Add your key and endpoint
key = "Ej0XDTAEwYwvi3oFzFzVb8bpCleZdGM2jGlfCBFKtgG6CMks0uH5JQQJ99ALACYeBjFXJ3w3AAAbACOGSVr2"  # "<your-translator-key>"
endpoint = "https://api.cognitive.microsofttranslator.com/"  # <Your endpoint>

# location, also known as region.
# required if you're using a multi-service or regional (not global) resource.
# It can be found in the Azure portal on the Keys and Endpoint page.
location = "eastus"  # "<YOUR-RESOURCE-LOCATION>"

path = '/translate'
constructed_url = endpoint + path

params = {
    'api-version': '3.0',
    'from': 'en',
    'to': ['fr', 'pl']
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    # location required if you're using a multi-service or regional (not global) resource.
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# You can pass more than one object in body.
body = [{
    'text': 'I would really like to drive your car around the block a few times!'
}]

request = requests.post(constructed_url, params=params, headers=headers, json=body)
response = request.json()

print(json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': ')))