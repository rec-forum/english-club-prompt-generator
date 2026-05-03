import os

file_path = r'C:\Users\danny\Downloads\run_tts.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('model="gemini-2.5-flash"', 'model="gemini-2.0-flash"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Model fixed successfully!')
