document.addEventListener('DOMContentLoaded', () => {
    const topicInput1 = document.getElementById('topicInput1');
    const topicInput2 = document.getElementById('topicInput2');
    const hostInput = document.getElementById('hostInput');
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const btnSlotMachine = document.getElementById('btnSlotMachine');
    const btnUndo = document.getElementById('btnUndo');
    const topicCategory = document.getElementById('topicCategory');
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
    const topicPools = {
        currentEvents: [
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
        ],
        fun: [
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
        ],
        tech: [
            "人工智慧的道德界線 (AI Ethics)",
            "量子電腦的革命 (Quantum Computing)",
            "腦機介面技術 (Brain-Computer Interfaces)",
            "深偽技術與假新聞 (Deepfakes and Fake News)",
            "太空垃圾清理計畫 (Space Debris Cleanup)",
            "擴增實境在日常的應用 (AR in Daily Life)",
            "生物辨識技術的隱私 (Biometrics Privacy)",
            "自駕車的道德困境 (Self-Driving Car Dilemmas)",
            "3D列印器官的未來 (3D Printed Organs)",
            "無人機的商業應用 (Drone Commercialization)",
            "虛擬實境與心理治療 (VR in Therapy)",
            "區塊鏈與去中心化未來 (Blockchain Future)",
            "智慧城市的發展 (Smart City Development)",
            "新能源電池技術 (New Battery Tech)",
            "機器人伴侶的社會影響 (Robot Companions)"
        ],
        life: [
            "極簡主義的生活哲學 (Minimalism Philosophy)",
            "正念冥想的科學實證 (Mindfulness Science)",
            "延遲享樂的心理學 (Delayed Gratification)",
            "慢活運動的興起 (Slow Living Movement)",
            "大自然對心理健康的療癒 (Nature Therapy)",
            "數位排毒的挑戰 (Digital Detox Challenge)",
            "情緒智商的重要性 (Importance of EQ)",
            "習慣養成的科學 (Science of Habit Formation)",
            "完美主義的陷阱 (Trap of Perfectionism)",
            "跨世代的溝通代溝 (Generation Gap)",
            "中年危機與轉機 (Midlife Crisis and Opportunity)",
            "培養感恩習慣的力量 (Power of Gratitude)",
            "適應力與心理韌性 (Resilience and Adaptability)",
            "發展個人興趣的價值 (Value of Hobbies)",
            "如何在混亂中保持平靜 (Finding Peace in Chaos)"
        ],
        business: [
            "零工經濟的利與弊 (Gig Economy Pros & Cons)",
            "安靜離職的職場現象 (Quiet Quitting)",
            "遠距工作的溝通挑戰 (Remote Work Communication)",
            "ESG 企業永續發展 (ESG Sustainability)",
            "個人品牌的建立 (Personal Branding)",
            "影響力行銷的轉變 (Influencer Marketing)",
            "跨文化管理的挑戰 (Cross-Cultural Management)",
            "情緒勞動的隱形成本 (Hidden Cost of Emotional Labor)",
            "AI 時代的職場技能 (Workplace Skills in AI Era)",
            "綠色清洗與企業公關 (Greenwashing)",
            "平權與多元包容職場 (DEI in Workplace)",
            "微型創業的興起 (Rise of Micro-Entrepreneurship)",
            "知識付費時代的商業模式 (Knowledge Economy Business Models)",
            "職場上的冒名頂替症候群 (Imposter Syndrome)",
            "無國界企業的崛起 (Rise of Borderless Companies)"
        ]
    };

    let topicHistory = [];

    // Helper to get random item
    function getRandomTopic(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomTopicExclude(array, excludeTopic) {
        let available = array.filter(t => t !== excludeTopic);
        if (available.length === 0) available = array;
        return getRandomTopic(available);
    }

    async function slotMachineEffect(inputEl, category) {
        const pool = category === 'all' 
            ? Object.values(topicPools).flat() 
            : topicPools[category];
        
        let iterations = 20;
        let speed = 40;
        
        inputEl.classList.add('slot-spinning');

        return new Promise(resolve => {
            function tick() {
                inputEl.value = getRandomTopic(pool);
                iterations--;
                if (iterations > 0) {
                    speed *= 1.1; // gradually slow down
                    setTimeout(tick, speed);
                } else {
                    inputEl.classList.remove('slot-spinning');
                    resolve(inputEl.value);
                }
            }
            tick();
        });
    }

    btnSlotMachine.addEventListener('click', async () => {
        // Save history
        if (topicInput1.value || topicInput2.value) {
            topicHistory.push({ t1: topicInput1.value, t2: topicInput2.value });
            btnUndo.disabled = false;
        }

        const category = topicCategory.value;
        
        btnSlotMachine.disabled = true;
        btnSlotMachine.innerHTML = `<span class="icon">🎰</span><span>抽題中...</span>`;
        
        // Ensure both slots spin, but at the end, ensure they don't pick the exact same topic if possible
        await Promise.all([
            slotMachineEffect(topicInput1, category),
            slotMachineEffect(topicInput2, category)
        ]);

        // Fix duplicate topics
        if (topicInput1.value === topicInput2.value) {
            const pool = category === 'all' ? Object.values(topicPools).flat() : topicPools[category];
            topicInput2.value = getRandomTopicExclude(pool, topicInput1.value);
        }

        btnSlotMachine.disabled = false;
        btnSlotMachine.innerHTML = `<span class="icon">🎰</span><span>拉霸抽題</span>`;
    });

    btnUndo.addEventListener('click', () => {
        if (topicHistory.length > 0) {
            const lastState = topicHistory.pop();
            topicInput1.value = lastState.t1;
            topicInput2.value = lastState.t2;
            
            if (topicHistory.length === 0) {
                btnUndo.disabled = true;
            }
        }
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
    function generatePrompt(topic1, topic2, eventType, hostName) {
        const dates = getNextDate(eventType === 'saturday' ? 6 : 4);
        
        let topicString = '';
        if (topic1 || topic2) {
            topicString = `本次讀書會的指定主題如下，請嚴格遵守：\n`;
            if (topic1) topicString += `- 第一篇文章請務必尋找與「${topic1}」相關的主題。\n`;
            if (topic2) topicString += `- 第二篇文章請務必尋找與「${topic2}」相關的主題。\n`;
            topicString += `\n`;
        }

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
        const t1 = topicInput1.value.trim();
        const t2 = topicInput2.value.trim();
        const eventType = document.querySelector('input[name="eventType"]:checked').value;
        const hostName = hostInput.value.trim();
        
        const promptText = generatePrompt(t1, t2, eventType, hostName);
        
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
- 男主持人 (Speaker 1)：名字叫 John，知性、專業，負責標準朗讀「英文原文」以及提供道地的英文用法。
- 女主持人 (Speaker 2)：名字叫 Mary (瑪麗)，活潑、充滿好奇心，負責用「中文」進行解釋、提問，並引導聽眾學習。
（兩位主持人將以中英雙語交錯進行自然對話。請注意：在對話內容中互相稱呼時請使用名字 John 和 Mary，但每行台詞最前面的角色標籤必須保持 "Speaker 1:" 與 "Speaker 2:"。）

【腳本核心要求：逐字精讀與深度解析】
1. **100% 文章涵蓋率：** 這是一檔精讀教學節目。廣播稿必須包含【整篇文章的每一個英文字】，絕對不能省略或隨便總結。必須讀完一整篇文章，絕對不可以只念一小段就結束。
2. **逐句交替解析：** 請嚴格採取以下結構進行：
   - Speaker 1 朗讀「一句」英文原文。
   - Speaker 2 接著提供該句的「中文說明」與翻譯。
   - 在解析過程中，**必須穿插講解講義（解讀機）中提到的「核心單字、進階片語」以及「複雜句型與經典句構」**，兩位主持人需特別停下來詳細說明與互動。
   - 請重複以上步驟（一句英文、一句中文說明），直到「整篇文章的每一個字」都被完整讀完為止。
3. **回顧討論問題與高分解答：** 在文章逐句精讀完畢後，兩位主持人要一起用中英雙語回顧講義上的「討論問題」，並生動地分享講義中提供的「高分解答」與「名師解題指導」。
4. **結尾的發人深省問題：** 在節目的最後，請主持人提出一個與文章主題相關、發人深省的問題（Takeaway Question），讓聽眾帶回去思考，作為完美收尾。

【排版與輸出格式（極度重要！這是為了語音合成準備的稿子）】
1. **絕對禁止 Markdown 符號：** 請絕對不要在稿子中出現任何米字號 (* 或 **)、井字號 (#)、或是任何特殊排版符號，這會干擾語音合成軟體的朗讀。請只輸出純文字。
2. **明確的角色標示：** 每一句台詞開頭請直接寫出角色標籤加冒號，絕對不可更動，必須嚴格維持 \`Speaker 1: \` 或 \`Speaker 2: \`。但在冒號後的對話內容中，請使用他們的名字 (John / Mary) 互相稱呼。
3. **生動的情緒提示詞：** 請在台詞中加入 (laughs), (sighs), (excitedly) 等圓括號的英文提示詞，這樣語音 AI 才能讀懂並表演出情緒。
4. **篇幅必須極長：** 為了確保每一句原文都被唸到並附上中文解說，這份腳本的篇幅必須非常詳盡。`;

        outputArea.value = podcastPrompt;
        copyBtn.disabled = false;
        
        outputArea.style.transform = 'scale(0.99)';
        setTimeout(() => {
            outputArea.style.transform = 'scale(1)';
        }, 150);
    });

    // Enter key support
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    };
    topicInput1.addEventListener('keypress', handleEnter);
    topicInput2.addEventListener('keypress', handleEnter);

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

    // TTS Generator Logic
    const audioTextInput = document.getElementById('audioTextInput');
    const ttsMethod = document.getElementById('ttsMethod');
    const geminiKeyGroup = document.getElementById('geminiKeyGroup');
    const geminiApiKey = document.getElementById('geminiApiKey');
    const downloadPythonBtn = document.getElementById('downloadPythonBtn');
    
    // Cost Estimation Logic
    const charCount = document.getElementById('charCount');
    const twdCost = document.getElementById('twdCost');
    const geminiCostInfo = document.getElementById('geminiCostInfo');
    const COST_PER_CHAR_TWD = 0.002; // 每字約 0.002 元台幣

    if (audioTextInput && charCount && twdCost) {
        audioTextInput.addEventListener('input', () => {
            const length = audioTextInput.value.length;
            charCount.textContent = length;
            // 計算費用並保留小數點後兩位
            twdCost.textContent = (length * COST_PER_CHAR_TWD).toFixed(2);
        });
    }

    if (ttsMethod) {
        ttsMethod.addEventListener('change', (e) => {
            if (e.target.value === 'gemini') {
                geminiKeyGroup.style.display = 'block';
                if (geminiCostInfo) geminiCostInfo.style.display = 'inline';
            } else {
                geminiKeyGroup.style.display = 'none';
                if (geminiCostInfo) geminiCostInfo.style.display = 'none';
            }
        });
    }

    if (downloadPythonBtn) {
        downloadPythonBtn.addEventListener('click', () => {
            const text = audioTextInput.value.trim();
            if (!text) {
                alert('請先貼上要轉換的廣播稿內容！');
                return;
            }

            const method = ttsMethod.value;
            const apiKey = geminiApiKey ? geminiApiKey.value.trim() : '';

            if (method === 'gemini' && !apiKey) {
                alert('請輸入您的 Gemini API Key！');
                return;
            }

            // Generate python code
            const safeText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");
            
const pyCode = `import os
import re
import asyncio
import tempfile
from pydub import AudioSegment

print("初始化 TTS 環境中...")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# 方案 A：使用免費的 Edge TTS (支援多語者辨識)
# ---------------------------------------------------------------------------
import edge_tts

async def generate_edge_tts(segments, output_filename="podcast_full_edge.mp3"):
    temp_files = []
    print(f"總共分為 {len(segments)} 個對話段落，開始生成 Edge TTS...")
    for i, (voice, chunk) in enumerate(segments):
        if not chunk.strip(): continue
        temp_filename = os.path.join(tempfile.gettempdir(), f"tts_chunk_{i}.mp3")
        temp_files.append(temp_filename)
        print(f"正在生成第 {i+1}/{len(segments)} 段 (語音: {voice})...")
        communicate = edge_tts.Communicate(chunk, voice)
        await communicate.save(temp_filename)
        
    print("所有段落生成完畢，正在進行無縫拼接...")
    combined = AudioSegment.empty()
    for temp_file in temp_files:
        audio = AudioSegment.from_mp3(temp_file)
        combined += audio
        try:
            os.remove(temp_file)
        except:
            pass
    
    output_path = os.path.join(BASE_DIR, output_filename)
    combined.export(output_path, format="mp3")
    print(f"✅ 拼接完成！檔案已儲存為：{output_path}")

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# 文字切割、語者辨識與雜訊過濾邏輯
# ---------------------------------------------------------------------------
def clean_text_for_tts(text):
    # 移除 (laughs), (sighs) 等小括號內的文字，避免被 TTS 引擎唸出
    text = re.sub(r'\\([^)]*\\)', '', text)
    # 移除 [xxx] 等中括號文字 (如果有)
    text = re.sub(r'\\[[^]]*\\]', '', text)
    # 移除多餘的空白
    text = re.sub(r'\\s+', ' ', text)
    return text.strip()

def parse_text_by_speaker(text):
    # 設定雙主特人聲音 (Speaker 1 男聲, Speaker 2 女聲)
    voice_spk1 = "zh-TW-YunJheNeural"
    voice_spk2 = "zh-TW-HsiaoChenNeural"
    
    lines = text.split('\\n')
    segments = []
    current_voice = voice_spk1
    current_text = ""
    
    for line in lines:
        line_stripped = line.strip()
        lower_line = line_stripped.lower()
        
        # 判斷說話者 (不分大小寫)
        if lower_line.startswith("speaker 1:"):
            if current_text.strip():
                segments.append((current_voice, clean_text_for_tts(current_text)))
            current_voice = voice_spk1
            line_content = re.sub(r'(?i)^speaker 1:\\s*', '', line_stripped)
            current_text = line_content + " "
        elif lower_line.startswith("speaker 2:"):
            if current_text.strip():
                segments.append((current_voice, clean_text_for_tts(current_text)))
            current_voice = voice_spk2
            line_content = re.sub(r'(?i)^speaker 2:\\s*', '', line_stripped)
            current_text = line_content + " "
        else:
            current_text += line_stripped + " "
            
    if current_text.strip():
        segments.append((current_voice, clean_text_for_tts(current_text)))
        
    # 如果單一句對話太長(>800字)，還是需要切片以避開限制
    final_segments = []
    for voice, text_chunk in segments:
        if not text_chunk:
            continue
        if len(text_chunk) > 800:
            sentences = re.split(r'(?<=[.!?。！？])\\s+', text_chunk)
            sub_chunk = ""
            for sentence in sentences:
                if len(sub_chunk) + len(sentence) <= 800:
                    sub_chunk += sentence + " "
                else:
                    if sub_chunk: final_segments.append((voice, sub_chunk.strip()))
                    sub_chunk = sentence + " "
            if sub_chunk: final_segments.append((voice, sub_chunk.strip()))
        else:
            final_segments.append((voice, text_chunk))
            
    return final_segments
# ---------------------------------------------------------------------------
# 方案 B：使用 Gemini API
# ---------------------------------------------------------------------------
def generate_gemini_tts(segments, output_filename="podcast_full_gemini.wav", api_key="YOUR_API_KEY"):
    from google import genai
    from google.genai import types
    import wave
    client = genai.Client(api_key=api_key)
    temp_files = []
    print(f"總共分為 {len(segments)} 個對話段落，開始生成 Gemini TTS...")
    for i, (voice, chunk) in enumerate(segments):
        if not chunk.strip(): continue
        temp_filename = os.path.join(tempfile.gettempdir(), f"tts_chunk_{i}.wav")
        temp_files.append(temp_filename)
        # Gemini does not support selecting voice per chunk easily without changing the model config, but we can try
        # Map edge voice names to Gemini voice names
        gemini_voice = "Aoede" if voice == "zh-TW-HsiaoChenNeural" else "Puck"
        print(f"正在生成第 {i+1}/{len(segments)} 段 (Gemini 語音: {gemini_voice})...")
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash", 
                contents=chunk,
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=gemini_voice)))
                )
            )
            audio_data = response.candidates[0].content.parts[0].inline_data.data
            with wave.open(temp_filename, "wb") as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(24000)
                wav_file.writeframes(audio_data)
        except Exception as e:
            print(f"第 {i+1} 段生成失敗: {e}")
            
    print("所有段落生成完畢，正在進行無縫拼接...")
    combined = AudioSegment.empty()
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            audio = AudioSegment.from_wav(temp_file)
            combined += audio
            try:
                os.remove(temp_file)
            except:
                pass
                
    output_path = os.path.join(BASE_DIR, output_filename)
    combined.export(output_path, format="wav")
    print(f"✅ 拼接完成！檔案已儲存為：{output_path}")

if __name__ == "__main__":
    try:
        sample_text = """${safeText}"""
        
        if not sample_text.strip():
            print("❌ 錯誤：廣播稿內容為空，請確認您有貼上文字！")
        else:
            segments = parse_text_by_speaker(sample_text)
            
            ${method === 'edge' 
                ? `asyncio.run(generate_edge_tts(segments, output_filename="podcast_full.mp3"))`
                : `generate_gemini_tts(segments, output_filename="podcast_full.wav", api_key="${apiKey}")`}
    except Exception as e:
        import traceback
        print("\\n❌ 發生錯誤：")
        traceback.print_exc()
    
    print("\\n====================================")
    input("執行完畢！請按 Enter 鍵關閉此視窗...")
`;

            // trigger download
            const blob = new Blob([pyCode], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'run_tts.py';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Visual feedback
            const originalHTML = downloadPythonBtn.innerHTML;
            downloadPythonBtn.innerHTML = `<span>✅ 執行檔已下載！</span>`;
            setTimeout(() => {
                downloadPythonBtn.innerHTML = originalHTML;
            }, 2000);
        });
    }
});
