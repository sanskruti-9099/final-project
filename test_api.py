import urllib.request
import urllib.error

try:
    req = urllib.request.Request("https://final-project-pkau.onrender.com/api/v1/dashboard")
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code} {e.reason}")
    print("Response body:", e.read().decode('utf-8'))
except urllib.error.URLError as e:
    print(f"URLError: {e.reason}")
except Exception as e:
    print(f"Exception: {e}")
