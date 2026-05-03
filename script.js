document.addEventListener('DOMContentLoaded', () => {
    const topicInput1 = document.getElementById('topicInput1');
    const topicInput2 = document.getElementById('topicInput2');
    const hostInput = document.getElementById('hostInput');
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');
    const btnSlot1 = document.getElementById('btnSlot1');
    const btnSlot2 = document.getElementById('btnSlot2');
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

    // Topic pools are now loaded from topics.js

    let topicHistory = [];
    let usedTopics = new Set(); // Track used topics to prevent recent repeats

    // Helper to get random item
    function getRandomTopic(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Helper to get random item that hasn't been used recently
    function getUniqueRandomTopic(pool) {
        let available = pool.filter(t => !usedTopics.has(t));
        
        // If all topics in this pool have been used, reset the used history
        // for this specific pool to keep the slot machine working
        if (available.length === 0) {
            pool.forEach(t => usedTopics.delete(t));
            available = pool;
        }
        
        const topic = getRandomTopic(available);
        usedTopics.add(topic);
        
        // Keep the set from growing infinitely (e.g. max 50 remembered)
        if (usedTopics.size > 50) {
            const iterator = usedTopics.values();
            usedTopics.delete(iterator.next().value);
        }
        
        return topic;
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
        
        let jumps = 2;
        inputEl.classList.add('slot-spinning');
        
        return new Promise(resolve => {
            function tick() {
                if (jumps > 0) {
                    inputEl.value = getRandomTopic(pool);
                    jumps--;
                    setTimeout(tick, 150);
                } else {
                    inputEl.classList.remove('slot-spinning');
                    // For the final result, pick a completely unique topic that hasn't been used recently
                    const finalTopic = getUniqueRandomTopic(pool);
                    inputEl.value = finalTopic;
                    resolve(finalTopic);
                }
            }
            tick();
        });
    }

    async function handleSlotClick(inputEl, btnEl) {
        // Save history
        if (topicInput1.value || topicInput2.value) {
            topicHistory.push({ t1: topicInput1.value, t2: topicInput2.value });
            btnUndo.disabled = false;
        }

        const category = topicCategory.value;
        const originalText = btnEl.querySelector('span:last-child').innerText;
        
        btnEl.disabled = true;
        btnEl.innerHTML = `<span class="icon">🎰</span><span>抽題中...</span>`;
        
        await slotMachineEffect(inputEl, category);

        // Fix duplicate topics between the two inputs
        if (topicInput1.value === topicInput2.value && topicInput1.value !== "") {
            const pool = category === 'all' ? Object.values(topicPools).flat() : topicPools[category];
            // Ensure the new topic hasn't been used recently either
            let newTopic = getUniqueRandomTopic(pool);
            while (newTopic === (inputEl === topicInput1 ? topicInput2.value : topicInput1.value) && pool.length > 1) {
                newTopic = getUniqueRandomTopic(pool);
            }
            inputEl.value = newTopic;
        }

        btnEl.disabled = false;
        btnEl.innerHTML = `<span class="icon">🎰</span><span>${originalText}</span>`;
    }

    btnSlot1.addEventListener('click', () => handleSlotClick(topicInput1, btnSlot1));
    btnSlot2.addEventListener('click', () => handleSlotClick(topicInput2, btnSlot2));

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
            topicString = `本次讀書會的參考主題方向如下：\n`;
            if (topic1) topicString += `- 第一篇文章請尋找與「${topic1}」相關的廣泛領域 (不需完全侷限於特定字眼，符合該大方向即可)。\n`;
            if (topic2) topicString += `- 第二篇文章請尋找與「${topic2}」相關的廣泛領域 (不需完全侷限於特定字眼，符合該大方向即可)。\n`;
            topicString += `\n`;
        }

        const displayHost = hostName ? hostName : 'Danny';
        
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

1. **絕對禁止憑空捏造網址 (No Hallucination)：** 請務必啟動您的「網頁搜尋功能 (Web Search/Browse)」。您提供的 Link 必須是「您當下搜尋並點擊確認過」的有效網址。為確保您沒有捏造連結，在產出結果前，請務必親自點進網頁閱讀確認。但請注意：**最終輸出的文本中不需要印出任何驗證或擷取內文的段落，保持版面乾淨。**
2. **文章來源限制 (白名單)：** 您**只能**從以下指定的網站清單中搜尋文章，**絕對禁止**使用此清單以外的任何來源：
   - Reuters: https://www.reuters.com/
   - Associated Press (AP): https://apnews.com/
   - Agence France-Presse (AFP): https://www.afp.com/en
   - BBC News: https://www.bbc.com/news
   - The New York Times: https://www.nytimes.com/
   - The Guardian: https://www.theguardian.com/
   - The Wall Street Journal: https://www.wsj.com/
   - CNN: https://edition.cnn.com/
   - The Washington Post: https://www.washingtonpost.com/
   - The Independent: https://www.independent.co.uk/
   - NPR: https://www.npr.org/
   - Bloomberg: https://www.bloomberg.com/
   - CNBC: https://www.cnbc.com/
   - Nature: https://www.nature.com/
   - ScienceDaily: https://www.sciencedaily.com/
   - Medical News Today: https://www.medicalnewstoday.com/
   - National Geographic: https://www.nationalgeographic.com/
   - The Verge: https://www.theverge.com/
   - TechCrunch: https://techcrunch.com/
   - The Japan Times: https://www.japantimes.co.jp/
   - Financial Times: https://www.ft.com/
   - The Telegraph: https://www.telegraph.co.uk/
   - The Times: https://www.thetimes.co.uk/
   - USA Today: https://www.usatoday.com/
   - Los Angeles Times: https://www.latimes.com/
   - Al Jazeera English: https://www.aljazeera.com/
   - DW: https://www.dw.com/en/
   - France 24: https://www.france24.com/en/
   - Sky News: https://news.sky.com/
   - ABC News: https://abcnews.go.com/
   - CBS News: https://www.cbsnews.com/
   - NBC News: https://www.nbcnews.com/
   - The Economist: https://www.economist.com/
   - Time: https://time.com/
   - Newsweek: https://www.newsweek.com/
   - Forbes: https://www.forbes.com/
   - Fortune: https://fortune.com/
   - Business Insider: https://www.businessinsider.com/
   - The Atlantic: https://www.theatlantic.com/
   - Harvard Business Review: https://hbr.org/
   - Wired: https://www.wired.com/
   - Scientific American: https://www.scientificamerican.com/
   - MIT Technology Review: https://www.technologyreview.com/
   - New Scientist: https://www.newscientist.com/
   - Psychology Today: https://www.psychologytoday.com/
   - WebMD: https://www.webmd.com/
   - South China Morning Post: https://www.scmp.com/
   - The Straits Times: https://www.straitstimes.com/
   - Focus Taiwan: https://focustaiwan.tw/
   - UPI: https://www.upi.com/
   - The Sydney Morning Herald: https://www.smh.com.au/
   - The Globe and Mail: https://www.theglobeandmail.com/
   - Toronto Star: https://www.thestar.com/
   - The New Zealand Herald: https://www.nzherald.co.nz/
   - The Times of India: https://timesofindia.indiatimes.com/
   - The Hindu: https://www.thehindu.com/
   - The Korea Herald: https://www.koreaherald.com/
   - The Korea Times: https://www.koreatimes.co.kr/
   - Taipei Times: https://www.taipeitimes.com/
   - The Jakarta Post: https://www.thejakartapost.com/
   - Bangkok Post: https://www.bangkokpost.com/
   - CNA: https://www.channelnewsasia.com/
   - Kyodo News: https://english.kyodonews.net/
   - Mainichi Daily News: https://mainichi.jp/english/
   - Asahi Shimbun: https://www.asahi.com/ajw/
   - The Japan News: https://japannews.yomiuri.co.jp/
   - The Daily Telegraph: https://www.dailytelegraph.com.au/
   - The Irish Times: https://www.irishtimes.com/
   - The Scotsman: https://www.scotsman.com/
   - The Boston Globe: https://www.bostonglobe.com/
   - Chicago Tribune: https://www.chicagotribune.com/
   - New York Post: https://nypost.com/
   - HuffPost: https://www.huffpost.com/
   - Vox: https://www.vox.com/
   - Vice: https://www.vice.com/
   - Axios: https://www.axios.com/
   - Politico: https://www.politico.com/
   - The Hill: https://thehill.com/
   - CNET: https://www.cnet.com/
   - Engadget: https://www.engadget.com/
   - Ars Technica: https://arstechnica.com/
   - Mashable: https://mashable.com/
   - Gizmodo: https://gizmodo.com/
   - Space.com: https://www.space.com/
   - Smithsonian Magazine: https://www.smithsonianmag.com/
   - Popular Science: https://www.popsci.com/
   - Popular Mechanics: https://www.popularmechanics.com/
   - Discover Magazine: https://www.discovermagazine.com/
   - Live Science: https://www.livescience.com/
   - Entertainment Weekly: https://ew.com/
   - Variety: https://variety.com/
   - The Hollywood Reporter: https://www.hollywoodreporter.com/
   - Rolling Stone: https://www.rollingstone.com/
   - Vogue: https://www.vogue.com/
   - GQ: https://www.gq.com/
   - ESPN: https://www.espn.com/
   - Sports Illustrated: https://www.si.com/
   - Lonely Planet: https://www.lonelyplanet.com/
   - Travel + Leisure: https://www.travelandleisure.com/
   - Fast Company: https://www.fastcompany.com/
3. **兩篇文章主題必須完全不同：** 確保這兩篇文章的主題與領域完全不同且互不相關，以增加會議討論的多樣性。
4. **文章品質與條件約束：**
   - **高度可討論性：** 文章內容必須能夠引發不同的觀點，適合用來進行開放式的深度討論與經驗分享。
   - **時效性限制：** 發表時間必須在 **最近 3 個月內**。
   - **長度限制：** 必須在 5 分鐘內可以閱讀完畢，也不能太短 (大於 200 字)。
5. **避免的主題：** 避免過於艱澀的科技、政治或青少年流行語、避免老人相關話題(因為這已經重複太多)。難易度需維持在中等 (Intermediate)，用字遣詞優美但不晦澀。
6. **產出格式：** 請嚴格遵守以下格式輸出。討論問題請使用「英文」撰寫。

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
        let hostName = hostInput.value.trim();
        
        if (!hostName) {
            hostName = 'Danny';
            hostInput.value = hostName; // Update UI to show the generated name
        }
        
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

請你針對上方議程中出現的「每一篇文章」，分別產出以下三大區塊的講義內容：

【第一部分：中英對照完整文章】
請使用網頁搜尋讀取該文章網址內的內容，並在這裡「一字不漏地完整呈現」該文章的英文原文（請不要做任何刪減、摘要或片段擷取，必須是全文）。
排版請採用「一段英文原文，接著一段繁體中文翻譯」的段落交錯對照格式，讓學生能輕易對照閱讀。中文翻譯請保持精準、通順，且具備信達雅水準。

【第二部分：名師字彙與句型解析】
這是一份給學生的專業詳解，請從文章中挑選出最值得學習的重點：
- 5~10 個核心單字或進階片語，必須包含：英文單字/片語、詞性、KK音標、中文精準解釋、以及一個實用且道地的英文例句。
- 1~2 句複雜句型或經典句構分析（拆解文法結構，教導學生如何看懂長難句）。

【第三部分：討論問題解答與高分思維】
針對該篇文章對應的所有討論問題，請逐一給出：
1. 【問題中文翻譯】：請先提供該討論問題的精準中文翻譯。
2. 一個結構完整、用字精確的高分「英文參考解答」。
3. 【名師解題指導】：用中文詳細解釋「如何回答這個問題可以更有深度」，並指導學生如何帶入個人經驗，或是運用剛才學到的進階單字，讓回答更具層次。`;

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
    const COST_PER_CHAR_TWD = 0.0004; // 每字約 0.0004 元台幣 (SiliconFlow 費率)

    if (audioTextInput && charCount && twdCost) {
        const updateCostEstimator = () => {
            const length = audioTextInput.value.length;
            charCount.textContent = length;
            // 計算費用並保留小數點後兩位
            twdCost.textContent = (length * COST_PER_CHAR_TWD).toFixed(2);
        };
        
        audioTextInput.addEventListener('input', updateCostEstimator);
        
        // 頁面載入時若已有內容 (例如瀏覽器自動還原)，則立即更新一次
        updateCostEstimator();
    }

    if (ttsMethod) {
        ttsMethod.addEventListener('change', (e) => {
            if (e.target.value === 'siliconflow') {
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
            const apiKey = geminiApiKey ? geminiApiKey.value.trim().replace(/[\u200B-\u200D\uFEFF]/g, '') : '';

            if (method === 'siliconflow') {
                if (!apiKey) {
                    alert('請輸入您的 SiliconFlow API Key！');
                    return;
                }
                // 檢查 API Key 是否包含非 ASCII 字元 (例如中文或全形字元)
                if (!/^[\x00-\x7F]+$/.test(apiKey)) {
                    alert('❌ 錯誤：API Key 只能包含英文、數字與基本符號，您似乎不小心貼到了中文或其他特殊字元！請重新確認。');
                    return;
                }
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
    voice_spk1 = "zh-CN-YunxiNeural"
    voice_spk2 = "zh-CN-XiaoxiaoNeural"
    
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
# 方案 B：使用 SiliconFlow API (CosyVoice2 雙語模型)
# ---------------------------------------------------------------------------
def generate_siliconflow_tts(segments, output_filename="podcast_full_siliconflow.mp3", api_key="YOUR_API_KEY"):
    import requests
    temp_files = []
    print(f"總共分為 {len(segments)} 個對話段落，開始生成 SiliconFlow TTS...")
    
    url = "https://api.siliconflow.com/v1/audio/speech"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    for i, (voice, chunk) in enumerate(segments):
        if not chunk.strip(): continue
        temp_filename = os.path.join(tempfile.gettempdir(), f"tts_chunk_{i}.mp3")
        temp_files.append(temp_filename)
        
        # Map edge voice names to SiliconFlow CosyVoice2 voice names
        sf_voice = "FunAudioLLM/CosyVoice2-0.5B:anna" if voice == "zh-CN-XiaoxiaoNeural" else "FunAudioLLM/CosyVoice2-0.5B:alex"
        print(f"正在生成第 {i+1}/{len(segments)} 段 (語音: {sf_voice.split(':')[-1]})...")
        
        payload = {
            "model": "FunAudioLLM/CosyVoice2-0.5B",
            "input": chunk,
            "voice": sf_voice,
            "response_format": "mp3"
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                with open(temp_filename, "wb") as f:
                    f.write(response.content)
            else:
                print(f"第 {i+1} 段生成失敗: API 錯誤 {response.status_code} - {response.text}")
        except Exception as e:
            print(f"第 {i+1} 段生成失敗: {e}")
            
    print("所有段落生成完畢，正在進行無縫拼接...")
    combined = AudioSegment.empty()
    for temp_file in temp_files:
        if os.path.exists(temp_file):
            try:
                audio = AudioSegment.from_mp3(temp_file)
                combined += audio
                os.remove(temp_file)
            except Exception as e:
                print(f"拼接失敗: {e}")
                
    output_path = os.path.join(BASE_DIR, output_filename)
    combined.export(output_path, format="mp3")
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
                : `generate_siliconflow_tts(segments, output_filename="podcast_full.mp3", api_key="${apiKey}")`}
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
