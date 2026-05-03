from google import genai
from google.genai import types

client = genai.Client(api_key="fake")
try:
    response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents="測試",
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Puck")))
        )
    )
    print("Success")
except Exception as e:
    print(f"Failed: {e}")
    import traceback
    traceback.print_exc()
