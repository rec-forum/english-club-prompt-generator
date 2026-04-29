import os
import re
import asyncio
from pydub import AudioSegment

# ---------------------------------------------------------------------------
# 方案 A：使用免費的 Edge TTS (微軟 Azure Neural Voices)
# 這是目前最推薦的「完全免費、無時間限制、無機器音」的解決方案。
# 安裝依賴：
# pip install edge-tts pydub
# (注意：pydub 需要系統安裝 ffmpeg)
# ---------------------------------------------------------------------------
import edge_tts

async def generate_edge_tts(text_chunks, output_filename="final_output_edge.mp3", voice="en-US-AriaNeural"):
    """使用 Edge TTS 生成語音並拼接"""
    temp_files = []
    
    print(f"總共分為 {len(text_chunks)} 個段落，開始生成 Edge TTS...")
    
    for i, chunk in enumerate(text_chunks):
        if not chunk.strip():
            continue
            
        temp_filename = f"temp_chunk_{i}.mp3"
        temp_files.append(temp_filename)
        print(f"正在生成第 {i+1}/{len(text_chunks)} 段...")
        
        communicate = edge_tts.Communicate(chunk, voice)
        await communicate.save(temp_filename)
        
    print("所有段落生成完畢，正在進行無縫拼接...")
    
    # 拼接所有音檔
    combined = AudioSegment.empty()
    for temp_file in temp_files:
        audio = AudioSegment.from_mp3(temp_file)
        combined += audio
        os.remove(temp_file)  # 清理暫存檔
        
    combined.export(output_filename, format="mp3")
    print(f"✅ 拼接完成！檔案已儲存為：{output_filename}")


# ---------------------------------------------------------------------------
# 方案 B：使用 Gemini API (Gemini 1.5 Flash / 2.5 Flash TTS)
# 注意：Google 目前沒有 "3.1"，最新的是 1.5/2.5 系列。
# Gemini 生成語音的限制較多，且輸出通常是 WAV 格式。
# 安裝依賴：
# pip install google-genai pydub
# ---------------------------------------------------------------------------
def generate_gemini_tts(text_chunks, output_filename="final_output_gemini.wav", api_key="YOUR_API_KEY"):
    """使用 Gemini API 生成語音並拼接"""
    from google import genai
    from google.genai import types
    import wave
    
    client = genai.Client(api_key=api_key)
    temp_files = []
    
    print(f"總共分為 {len(text_chunks)} 個段落，開始生成 Gemini TTS...")
    
    for i, chunk in enumerate(text_chunks):
        if not chunk.strip():
            continue
            
        temp_filename = f"temp_chunk_{i}.wav"
        temp_files.append(temp_filename)
        print(f"正在生成第 {i+1}/{len(text_chunks)} 段...")
        
        try:
            # 呼叫 Gemini 支援 TTS 的模型 (例如 gemini-2.5-flash 或 gemini-1.5-flash)
            response = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=chunk,
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Aoede"  # 可選的聲音有：Aoede, Puck, Charon, Kore, Fenrir, Leto
                            )
                        )
                    )
                )
            )
            
            # 提取二進位音訊資料 (PCM)
            audio_data = response.candidates[0].content.parts[0].inline_data.data
            
            # 儲存為 WAV 檔
            with wave.open(temp_filename, "wb") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2) # 16-bit
                wav_file.setframerate(24000)
                wav_file.writeframes(audio_data)
                
        except Exception as e:
            print(f"第 {i+1} 段生成失敗: {e}")
            
    print("所有段落生成完畢，正在進行無縫拼接...")
    
    # 拼接 WAV 音檔
    combined = AudioSegment.empty()
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            audio = AudioSegment.from_wav(temp_file)
            combined += audio
            os.remove(temp_file)  # 清理暫存檔
            
    combined.export(output_filename, format="wav")
    print(f"✅ 拼接完成！檔案已儲存為：{output_filename}")


# ---------------------------------------------------------------------------
# 通用工具：將長文本自動切片
# ---------------------------------------------------------------------------
def split_text_into_chunks(text, max_chars=800):
    """
    將長文本根據標點符號切分成多個小段落，確保每個段落不超過 max_chars 字數。
    800字元大約對應 1 分鐘左右的語音，能有效避開 2 分鐘長度限制。
    """
    # 根據句號、問號、驚嘆號等進行初步分割 (保留標點符號)
    sentences = re.split(r'(?<=[.!?。！？])\s+', text)
    
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_chars:
            current_chunk += sentence + " "
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence + " "
            
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks

# ---------------------------------------------------------------------------
# 執行範例
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # 這是您的長文本 (可以從檔案讀取)
    sample_text = """
    Welcome to our English reading club! Today we are going to explore a fascinating topic. 
    歡迎來到我們的英文讀書會！今天我們要來探討一個有趣的主題。
    Learning a new language opens up a world of opportunities. It allows you to connect with people from different cultures.
    學習新語言能開啟充滿機會的世界。它讓你能夠與來自不同文化的人建立連結。
    (請將您的完整長文本放在這裡，或者寫入一個 txt 檔並使用 open('file.txt').read() 來讀取)
    """ * 10  # 模擬超長文本
    
    # 1. 切割文本 (每次不超過 800 字元，確保小於 2 分鐘)
    chunks = split_text_into_chunks(sample_text, max_chars=800)
    
    # 2. 選擇你要的方案執行
    
    # 方案 A: 使用 Edge TTS (推薦，完全免費無限制)
    # asyncio.run(generate_edge_tts(chunks, output_filename="podcast_full.mp3"))
    
    # 方案 B: 使用 Gemini TTS
    # 請替換成您的 Gemini API Key
    # generate_gemini_tts(chunks, output_filename="podcast_full.wav", api_key="YOUR_GEMINI_API_KEY")
