#!/usr/bin/env python
import urllib.request, json, getpass

cloudinary_cloud = input('Cloudinary cloud (zilabrand): ') or 'zilabrand'

cloudinary_api_key = input('Cloudinary API Key: ')
assert cloudinary_api_key, "Requires API Key"

cloudinary_api_secret = getpass.getpass('Cloudinary API Secret: ')
assert cloudinary_api_secret, "Requires API Key"


url = 'https://api.cloudinary.com/v1_1/{}/resources/image?max_results=500'.format(cloudinary_cloud)

# Basic auth: https://docs.python.org/3.6/howto/urllib2.html
password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()
password_mgr.add_password(None, url, cloudinary_api_key, cloudinary_api_secret)
handler = urllib.request.HTTPBasicAuthHandler(password_mgr)
opener = urllib.request.build_opener(handler)
urllib.request.install_opener(opener)

res = urllib.request.urlopen(url)
res_body = res.read()
data = json.loads(res_body)

for image in data['resources']:
    print('- src: {}.{}'.format(image['public_id'], image['format']))
