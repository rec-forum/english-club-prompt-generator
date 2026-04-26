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
        
        // Add a small bounce animation to the output area
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
