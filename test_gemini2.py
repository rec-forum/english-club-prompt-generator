from google import genai
from google.genai import types

client = genai.Client(api_key="這是一把鑰匙")
try:
    response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents="測試"
    )
    print("Success")
except Exception as e:
    print(f"Failed: {repr(e)}")
