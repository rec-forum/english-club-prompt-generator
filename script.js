document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const hostInput = document.getElementById('hostInput');
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const btnCurrentEvents = document.getElementById('btnCurrentEvents');
    const btnFunTopics = document.getElementById('btnFunTopics');
    const eventTypeRadios = document.getElementsByName('eventType');
    const hostInputGroup = document.querySelector('.host-input-group');

    // New Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const mainTitle = document.getElementById('mainTitle');
    const mainDesc = document.getElementById('mainDesc');
    const generateDecoderBtn = document.getElementById('generateDecoderBtn');
    const aiAgendaInput = document.getElementById('aiAgendaInput');
    const generatePodcastBtn = document.getElementById('generatePodcastBtn');

    // Tab Data
    const tabInfo = {
        'tab-generator': { title: '📚 讀書會文章製造機', desc: 'Step 1：輸入主題，自動生成尋找文章的 AI 指令' },
        'tab-decoder': { title: '🔍 讀書會文章解讀機', desc: 'Step 2：輸入網址與問題，讓 AI 幫您精準分析並準備高分解答' },
        'tab-podcast': { title: '🎙️ 雙人廣播稿轉換', desc: 'Step 3：將解讀完的知識轉換為生動的雙人對話 Podcast' },
        'tab-audio': { title: '🎧 語音化指引', desc: 'Step 4：免費將廣播稿變成真實語音的技巧' }
    };

    // Tab switching logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            mainTitle.innerText = tabInfo[targetId].title;
            mainDesc.innerText = tabInfo[targetId].desc;
            
            // Hide output section for audio guide tab since it doesn't generate prompts
            const outputSection = document.querySelector('.output-section');
            if (targetId === 'tab-audio') {
                outputSection.style.display = 'none';
            } else {
                outputSection.style.display = 'flex';
            }
            
            outputArea.value = '';
            copyBtn.disabled = true;
        });
    });

    // Topic pools (Expanded for better randomness)
    const currentEvents = [
        "四週工作制的全球實驗 (Four-Day Workweek Experiments)",
        "無現金社會帶來的影響 (Impact of a Cashless Society)",
        "遠距工作對人際關係的改變 (Remote Work and Relationships)",
        "微型住宅與極簡生活趨勢 (Tiny Homes and Minimalism)",
        "AI 時代下的隱私挑戰 (Privacy in the AI Era)",
        "太空旅遊的商業化 (Commercial Space Tourism)",
        "現代人的睡眠科學與危機 (The Science of Sleep)",
        "全球暖化對日常餐桌的影響 (Climate Change and Our Diet)",
        "社群媒體與容貌焦慮 (Social Media and Body Image)",
        "數位遊牧民族的崛起 (The Rise of Digital Nomads)",
        "快時尚的退潮與二手經濟 (Decline of Fast Fashion)",
        "高齡化社會的新型態養老 (New Concepts of Aging)",
        "無人車與未來交通 (Self-Driving Cars and Future Transport)",
        "現代人的孤獨感與心理健康 (Modern Loneliness and Mental Health)",
        "人造肉與未來食物 (Fake Meat and Future Food)",
        "串流平台的訂閱疲勞 (Subscription Fatigue in Streaming)",
        "元宇宙在教育上的應用 (Metaverse in Education)",
        "城市農業與垂直農場 (Urban and Vertical Farming)",
        "基因編輯技術的倫理爭議 (Ethics of Gene Editing)",
        "遠距醫療的普及與挑戰 (Telemedicine Trends)"
    ];

    const funTopics = [
        "世界各地的奇特節慶 (Bizarre Festivals Around the World)",
        "動物界的驚人智慧 (Amazing Animal Intelligence)",
        "咖啡文化的歷史與發展 (History of Coffee Culture)",
        "未解的歷史謎團 (Unsolved Historical Mysteries)",
        "各國有趣的迷信與禁忌 (Interesting Superstitions)",
        "那些改變世界的偶然發明 (Accidental Inventions that Changed the World)",
        "深海探索的奇妙生物 (Weird Creatures of the Deep Sea)",
        "金氏世界紀錄的荒謬挑戰 (Absurd Guinness World Records)",
        "顏色的心理學與行銷 (Psychology of Colors)",
        "史上最著名的藝術品失竊案 (Famous Art Heists)",
        "各地奇葩的法律與規定 (Weird Laws Around the World)",
        "笑的科學：我們為什麼會笑？ (The Science of Laughter)",
        "人類收集物品的奇妙心理 (The Psychology of Collecting)",
        "世界上最偏遠的有人居住地 (Most Isolated Places on Earth)",
        "巧克力的黑歷史與進化 (The History of Chocolate)",
        "錯覺藝術與大腦的欺騙 (Optical Illusions)",
        "植物會溝通嗎？ (Do Plants Communicate?)",
        "外星人接觸的各種陰謀論 (Alien Contact Conspiracy Theories)",
        "世界上最昂貴的奇葩食物 (World's Most Expensive Bizarre Foods)",
        "古代人的超前科技發明 (Ancient High-Tech Inventions)"
    ];

    // Helper to get random item
    function getRandomTopic(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Event listeners for suggestion buttons
    btnCurrentEvents.addEventListener('click', () => {
        topicInput.value = getRandomTopic(currentEvents);
        generateBtn.click(); // Auto-generate
    });

    btnFunTopics.addEventListener('click', () => {
        topicInput.value = getRandomTopic(funTopics);
        generateBtn.click(); // Auto-generate
    });

    eventTypeRadios.forEach(radio => {
        // No longer need to hide/show Host input, it's always visible
    });

    // Calculate next specific day of week (4 = Thursday, 6 = Saturday)
    function getNextDate(targetDayOfWeek) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        let daysToAdd = targetDayOfWeek - dayOfWeek;
        
        // If today is the target day or past the target day this week, get next week's
        if (daysToAdd <= 0) {
            daysToAdd += 7;
        }

        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysToAdd);

        const year = nextDate.getFullYear();
        const month = nextDate.getMonth() + 1; // Used for Thursday format
        const paddedMonth = String(month).padStart(2, '0'); // Used for Saturday format
        const date = nextDate.getDate(); // Used for Thursday format
        const paddedDate = String(date).padStart(2, '0'); // Used for Saturday format

        return {
            saturdayFormat: `${year}/${paddedMonth}/${paddedDate}`,
            thursdayFormat: `${month}/${date}`
        };
    }

    // Generate the prompt template
    function generatePrompt(topic, eventType, hostName) {
        const dates = getNextDate(eventType === 'saturday' ? 6 : 4);
        const topicString = topic ? `本次的指定關鍵字是：「${topic}」。請確保至少有一篇文章與此關鍵字相關。\n\n` : '';
        const displayHost = hostName ? hostName : '[請填入主持人姓名]';
        
        let headerString = '';
        
        if (eventType === 'saturday') {
            headerString = `Zoom meeting of Royal English Club

Date: ${dates.saturdayFormat}, Saturday, 7-9pm
Host: ${displayHost}

Zoom meeting: Please click the link below
https://zoomtw.zoom.us/j/92987266213?pw

ID: 929 8726 6213
Password: 112233`;
        } else {
            headerString = `Date: ${dates.thursdayFormat}(Thursday) 
Host: ${displayHost}`;
        }

        const commonAgendaString = `Agenda:
7:00-7:10 pm Opening Remarks
7:10-7:40 pm Session 1: Group Discussion
7:40-8:00 pm Individual Presentation
8:00-8:35 pm Group Discussion
8:35-9:00 pm Individual Presentation

---

Session 1: [第一篇文章的標題]
Link: [第一篇文章的真實網址]
Summary: [用英文寫 20 字以內的文章簡介]

Discussion 1:
1. [針對文章內容的開放式討論題 - English]
2. [與個人經驗相關的延伸題 - English]
3. [與個人經驗相關的延伸題 - English]
4. [與個人經驗相關的延伸題 - English]
5. [深度思考題 - English]

---

Session 2: [第二篇文章的標題]
Link: [第二篇文章的真實網址]
Summary:[用英文寫 20 字以內的文章簡介]

Discussion 2:
1. [針對文章內容的開放式討論題 - English]
2. [與個人經驗相關的延伸題 - English]
3. [與個人經驗相關的延伸題 - English]
4. [與個人經驗相關的延伸題 - English]
5. [深度思考題 - English]`;

        return `你是一個專業的英語讀書會內容產生器，專門為 35~70 歲、對英語學習有興趣的退休或半退休族群服務。

${topicString}請執行以下任務：

1. **使用網頁搜尋尋找真實文章 (絕不可憑空捏造)：** 請務必啟動您的「網頁搜尋功能 (Web Search/Browse)」，上網尋找兩篇真實存在、適合該年齡層閱讀的英語文章。**警告：請絕對不要憑空捏造 (hallucinate) 文章網址，您提供的 Link 必須是真實存在且可被點擊開啟的有效網頁連結！**
2. **兩篇文章主題必須完全不同：** 確保這兩篇文章的主題與領域完全不同且互不相關，以增加會議討論的多樣性。
3. **文章品質與條件約束：**
   - **高度可討論性：** 文章內容必須能夠引發不同的觀點，適合用來進行開放式的深度討論與經驗分享。
   - **時效性限制：** 發表時間必須在 **最近 3 個月內**。
   - **來源公信力：** 來源必須是 **知名度高、具公信力或主流的熱門網站** (例如主流媒體、知名雜誌、權威部落格等)，請絕對不要使用冷門、不知名的鄉野文章。
   - **長度限制：** 必須在 5 分鐘內可以閱讀完畢，也不能太短 (大於 200 字)。
4. **避免的主題：** 避免過於艱澀的科技、政治或青少年流行語、避免老人相關話題(因為這已經重複太多)。難易度需維持在中等 (Intermediate)，用字遣詞優美但不晦澀。
5. **產出格式：** 請嚴格遵守以下格式輸出。討論問題請使用「英文」撰寫。

---

${headerString}

${commonAgendaString}

---

P.S.
1. 可參加三次(含實體及線上會議)體驗後，繳交1,000元(學生500元)，即可成為ROYAL正式會員，可終身自由參加本社會議與活動，並享受本社會員的福利！
2. 請帶著開放的心與熱情來參加全英文會話聚會！

---`;
    }

    generateBtn.addEventListener('click', () => {
        const topic = topicInput.value.trim();
        const eventType = document.querySelector('input[name="eventType"]:checked').value;
        const hostName = hostInput.value.trim();
        
        const promptText = generatePrompt(topic, eventType, hostName);
        
        outputArea.value = promptText;
        copyBtn.disabled = false;
        
        outputArea.style.transform = 'scale(0.99)';
        setTimeout(() => {
            outputArea.style.transform = 'scale(1)';
        }, 150);
    });

    // Generate Decoder Prompt
    generateDecoderBtn.addEventListener('click', () => {
        const agenda = aiAgendaInput.value.trim() || '[請貼上完整議程內容]';

        const decoderPrompt = `你現在是一位擁有 20 年教學經驗的「頂級專業英文補習班名師」。
請協助我為以下這份議程中的【每一篇文章】，製作一份極度專業、詳盡的「讀書會大師級詳解講義」。

以下是本次讀書會的完整議程（包含文章網址與討論問題）：
---
${agenda}
---

請你針對上方議程中出現的「每一篇文章」，分別產出以下四大區塊的講義內容：

【第一部分：英文原文全文】
請使用網頁搜尋讀取該文章網址內的內容，並在這裡「一字不漏地完整呈現」該文章的英文原文（請不要做任何刪減、摘要或片段擷取，必須是全文）。

【第二部分：專業完整譯文】
請為整篇文章提供一份精準、通順、且具備信達雅水準的「繁體中文全文翻譯」（請翻譯整篇文章，幫助學生完全掌握文章脈絡）。

【第三部分：名師字彙與句型解析】
這是一份給學生的專業詳解，請從文章中挑選出最值得學習的重點：
- 5~10 個核心單字或進階片語，必須包含：英文單字/片語、詞性、KK音標、中文精準解釋、以及一個實用且道地的英文例句。
- 1~2 句複雜句型或經典句構分析（拆解文法結構，教導學生如何看懂長難句）。

【第四部分：討論問題解答與高分思維】
針對該篇文章對應的所有討論問題，請逐一給出：
1. 一個結構完整、用字精確的高分「英文參考解答」。
2. 【名師解題指導】：用中文詳細解釋「如何回答這個問題可以更有深度」，並指導學生如何帶入個人經驗，或是運用剛才學到的進階單字，讓回答更具層次。`;

        outputArea.value = decoderPrompt;
        copyBtn.disabled = false;
        
        outputArea.style.transform = 'scale(0.99)';
        setTimeout(() => {
            outputArea.style.transform = 'scale(1)';
        }, 150);
    });

    // Generate Podcast Prompt
    generatePodcastBtn.addEventListener('click', () => {
        const podcastPrompt = `你現在是一個專業的 Podcast 雙語英語教學節目製作人兼編劇。
請根據我們先前解讀的「文章原文、翻譯、單字與問題解答」等所有講義內容，幫我寫成一份「超詳盡」的中英雙語廣播節目對話稿 (Podcast Script)。

【主持人設定】
- 男主持人 (Speaker 1)：知性、專業，負責標準朗讀「英文原文」以及提供道地的英文用法。
- 女主持人 (Speaker 2)：活潑、充滿好奇心，負責用「中文」進行解釋、提問，並引導聽眾學習。
（兩位主持人將以中英雙語交錯進行自然對話。）

【腳本核心要求：逐字精讀】
1. **100% 文章涵蓋率：** 這是一檔精讀教學節目。廣播稿必須包含【整篇文章的每一個英文字】，絕對不能省略或隨便總結。
2. **段落交替解析：** 請嚴格採取以下結構進行：
   - Speaker 1 朗讀一小段英文原文。
   - Speaker 2 用中文進行翻譯，並用中文詳細解釋該段落的重點單字（包含詞性、音標、例句）與經典句構。
   - 兩人用中英雙語互動，分享對這段內容的看法。
   - 接著進入下一段，直到「整篇文章的每一個字」都被讀完與解釋完為止。

【排版與輸出格式（極度重要！這是為了語音合成準備的稿子）】
1. **絕對禁止 Markdown 符號：** 請絕對不要在稿子中出現任何米字號 (* 或 **)、井字號 (#)、或是任何特殊排版符號，這會干擾語音合成軟體的朗讀。請只輸出純文字。
2. **明確的角色標示：** 每一句台詞開頭請直接寫出角色名字加冒號，例如 \`Speaker 1: \` 或 \`Speaker 2: \`。
3. **生動的情緒提示詞：** 請在台詞中加入 (laughs), (sighs), (excitedly) 等圓括號的英文提示詞，這樣語音 AI 才能讀懂並表演出情緒。
4. **篇幅必須極長：** 為了確保每一句原文都被唸到並附上中文解說，這份腳本的篇幅必須非常詳盡。在文章逐字精讀完畢後，兩位主持人要一起用中英雙語回顧講義上的「討論問題」，並分享如何給出高分解答。`;

        outputArea.value = podcastPrompt;
        copyBtn.disabled = false;
        
        outputArea.style.transform = 'scale(0.99)';
        setTimeout(() => {
            outputArea.style.transform = 'scale(1)';
        }, 150);
    });

    // Enter key support
    topicInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(outputArea.value);
            
            // Visual feedback
            const originalHTML = copyBtn.innerHTML;
            copyBtn.classList.add('success');
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>複製成功！</span>
            `;
            
            setTimeout(() => {
                copyBtn.classList.remove('success');
                copyBtn.innerHTML = originalHTML;
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('複製失敗，請手動複製！');
        }
    });
});
