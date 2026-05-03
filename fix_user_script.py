import os
import sys

file_path = r'C:\Users\danny\Downloads\run_tts.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the edge_tts temp file
content = content.replace('temp_filename = f"temp_chunk_{i}.mp3"', 'import tempfile\n        temp_filename = os.path.join(tempfile.gettempdir(), f"temp_chunk_{i}.mp3")')
content = content.replace('combined.export(output_filename, format="mp3")', 'output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), output_filename)\n    combined.export(output_path, format="mp3")\n    output_filename = output_path')

# Fix the gemini temp file
content = content.replace('temp_filename = f"temp_chunk_{i}.wav"', 'import tempfile\n        temp_filename = os.path.join(tempfile.gettempdir(), f"temp_chunk_{i}.wav")')
content = content.replace('combined.export(output_filename, format="wav")', 'output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), output_filename)\n    combined.export(output_path, format="wav")\n    output_filename = output_path')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('File fixed successfully!')
