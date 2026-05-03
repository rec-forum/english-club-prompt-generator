import os

file_path = r'C:\Users\danny\Downloads\run_tts.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('voice="en-US-AriaNeural"', 'voice="zh-TW-HsiaoChenNeural"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Voice fixed successfully!')
