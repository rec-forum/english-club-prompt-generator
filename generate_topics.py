import json

categories = {
    "currentEvents": {
        "subjects": [
            ("全球暖化", "Global Warming"),
            ("自動化與AI", "Automation and AI"),
            ("高齡化社會", "Aging Society"),
            ("遠距工作", "Remote Work"),
            ("社群媒體", "Social Media"),
            ("假新聞", "Fake News"),
            ("通貨膨脹", "Inflation"),
            ("地緣政治", "Geopolitics"),
            ("再生能源", "Renewable Energy"),
            ("電動車", "Electric Vehicles"),
            ("都市化", "Urbanization"),
            ("水資源危機", "Water Scarcity"),
            ("性別平權", "Gender Equality"),
            ("心理健康意識", "Mental Health Awareness"),
            ("加密貨幣", "Cryptocurrency")
        ],
        "angles": [
            ("對全球經濟的影響", "Economic Impact of"),
            ("未來的發展趨勢", "Future Trends of"),
            ("帶來的社會挑戰", "Social Challenges of"),
            ("各國的應對策略", "Global Strategies for"),
            ("對年輕世代的影響", "Impact on Younger Generations from"),
            ("在後疫情時代的變化", "Post-Pandemic Changes in"),
            ("引發的倫理爭議", "Ethical Controversies Surrounding"),
            ("對弱勢群體的打擊", "Impact on Vulnerable Groups from"),
            ("媒體如何報導", "Media Representation of"),
            ("潛在的解決方案", "Potential Solutions for"),
            ("對日常生活的改變", "Everyday Life Changes Due to"),
            ("企業該如何適應", "How Businesses Adapt to"),
            ("教育體系的應變", "Educational System Responses to"),
            ("帶來的心理壓力", "Psychological Stress from")
        ]
    },
    "tech": {
        "subjects": [
            ("人工智慧", "Artificial Intelligence"),
            ("虛擬實境", "Virtual Reality"),
            ("區塊鏈", "Blockchain"),
            ("量子運算", "Quantum Computing"),
            ("物聯網", "Internet of Things"),
            ("機器人技術", "Robotics"),
            ("無人機", "Drones"),
            ("3D 列印", "3D Printing"),
            ("智慧家庭", "Smart Homes"),
            ("自駕車", "Autonomous Vehicles"),
            ("網路安全", "Cybersecurity"),
            ("生物科技", "Biotechnology"),
            ("奈米科技", "Nanotechnology"),
            ("綠色科技", "Green Tech"),
            ("邊緣運算", "Edge Computing")
        ],
        "angles": [
            ("的未來發展", "The Future of"),
            ("的倫理挑戰", "Ethical Challenges of"),
            ("的經濟影響", "Economic Impact of"),
            ("在日常生活的應用", "Everyday Uses of"),
            ("的歷史演進", "Historical Evolution of"),
            ("的投資趨勢", "Investment Trends in"),
            ("的監管問題", "Regulatory Issues in"),
            ("的環境影響", "Environmental Impact of"),
            ("的社會影響", "Social Implications of"),
            ("如何克服技術限制", "Overcoming Limitations in"),
            ("的全球競爭", "Global Race for"),
            ("帶來的隱私隱憂", "Privacy Concerns in"),
            ("帶來的就業衝擊", "Job Disruption from"),
            ("的教育契機", "Educational Opportunities in")
        ]
    },
    "business": {
        "subjects": [
            ("電子商務", "E-commerce"),
            ("零工經濟", "Gig Economy"),
            ("新創企業", "Startups"),
            ("企業社會責任", "Corporate Social Responsibility"),
            ("數位行銷", "Digital Marketing"),
            ("全球供應鏈", "Global Supply Chains"),
            ("訂閱制經濟", "Subscription Economy"),
            ("個人品牌", "Personal Branding"),
            ("敏捷管理", "Agile Management"),
            ("遠距團隊", "Remote Teams"),
            ("跨國企業", "Multinational Corporations"),
            ("創投基金", "Venture Capital"),
            ("消費者行為", "Consumer Behavior"),
            ("網紅經濟", "Influencer Economy"),
            ("房地產市場", "Real Estate Market")
        ],
        "angles": [
            ("的成功關鍵", "Keys to Success in"),
            ("面臨的挑戰與危機", "Challenges and Crises in"),
            ("的創新商業模式", "Innovative Business Models of"),
            ("對傳統產業的顛覆", "Disruption of Traditional Industries by"),
            ("在亞洲市場的發展", "Development in Asian Markets for"),
            ("的未來五年預測", "Five-Year Forecast for"),
            ("的轉型策略", "Transformation Strategies for"),
            ("對勞工權益的影響", "Impact on Labor Rights in"),
            ("如何提升顧客忠誠度", "Improving Customer Loyalty in"),
            ("的數據驅動決策", "Data-Driven Decision Making in"),
            ("的跨文化管理", "Cross-Cultural Management in"),
            ("的永續發展", "Sustainability Practices in"),
            ("如何吸引Z世代", "Attracting Gen Z in"),
            ("的危機處理", "Crisis Management in")
        ]
    },
    "life": {
        "subjects": [
            ("極簡主義", "Minimalism"),
            ("正念冥想", "Mindfulness and Meditation"),
            ("時間管理", "Time Management"),
            ("情緒智商", "Emotional Intelligence"),
            ("終身學習", "Lifelong Learning"),
            ("數位排毒", "Digital Detox"),
            ("拖延症", "Procrastination"),
            ("完美主義", "Perfectionism"),
            ("習慣養成", "Habit Formation"),
            ("財務自由", "Financial Independence"),
            ("獨處的藝術", "The Art of Solitude"),
            ("冒名頂替症候群", "Imposter Syndrome"),
            ("慢活哲學", "Slow Living Philosophy"),
            ("人際界線", "Interpersonal Boundaries"),
            ("斯多葛學派", "Stoicism")
        ],
        "angles": [
            ("對心理健康的益處", "Mental Health Benefits of"),
            ("在現代社會的實踐", "Practicing in Modern Society:"),
            ("背後的科學原理", "The Science Behind"),
            ("如何從零開始培養", "How to Start Cultivating"),
            ("常見的誤區與迷思", "Common Myths About"),
            ("對提升工作效率的幫助", "Boosting Productivity through"),
            ("對人際關係的影響", "Impact on Relationships from"),
            ("如何教導給下一代", "Teaching the Next Generation About"),
            ("的名人實踐案例", "Celebrity Case Studies on"),
            ("與快樂的關聯", "The Link to Happiness:"),
            ("在面對挫折時的作用", "Its Role in Overcoming Setbacks:"),
            ("的歷史淵源", "Historical Origins of"),
            ("如何克服實行上的困難", "Overcoming Implementation Difficulties in"),
            ("與個人成長的關係", "The Relationship with Personal Growth:")
        ]
    },
    "fun": {
        "subjects": [
            ("世界奇特節慶", "Bizarre Global Festivals"),
            ("動物的驚人智慧", "Amazing Animal Intelligence"),
            ("日常事物的歷史", "History of Common Items"),
            ("錯覺藝術", "Optical Illusions"),
            ("未解的歷史謎團", "Unsolved Historical Mysteries"),
            ("各國的迷信", "Superstitions Around the World"),
            ("意外的偉大發明", "Accidental Great Inventions"),
            ("深海的奇妙生物", "Weird Deep Sea Creatures"),
            ("金氏世界紀錄", "Guinness World Records"),
            ("顏色的心理學", "Psychology of Colors"),
            ("著名的藝術竊案", "Famous Art Heists"),
            ("奇葩的法律", "Weird Laws"),
            ("笑的科學", "The Science of Laughter"),
            ("收集物品的心理", "The Psychology of Collecting"),
            ("巧克力的演進", "The Evolution of Chocolate")
        ],
        "angles": [
            ("背後不為人知的故事", "Untold Stories Behind"),
            ("對現代文化的影響", "Impact on Modern Culture from"),
            ("最令人驚訝的 5 個事實", "Top 5 Surprising Facts About"),
            ("的演變與發展", "Evolution and Development of"),
            ("科學家如何解釋", "How Scientists Explain"),
            ("在流行文化中的呈現", "Representation in Pop Culture of"),
            ("的經濟價值", "Economic Value of"),
            ("各國的不同觀點", "Different Global Perspectives on"),
            ("如何改變了世界", "How it Changed the World:"),
            ("未來的可能樣貌", "What the Future Looks Like for"),
            ("引發的有趣爭議", "Interesting Controversies Sparked by"),
            ("如何啟發了藝術家", "How it Inspired Artists:"),
            ("的保護與傳承", "Preservation and Heritage of"),
            ("與人類心理的奇妙連結", "Fascinating Links to Human Psychology:")
        ]
    },
    "science": {
        "subjects": [
            ("黑洞與宇宙學", "Black Holes and Cosmology"),
            ("基因編輯技術", "Gene Editing Technology"),
            ("氣候變遷科學", "The Science of Climate Change"),
            ("量子力學", "Quantum Mechanics"),
            ("神經科學", "Neuroscience"),
            ("進化生物學", "Evolutionary Biology"),
            ("海洋生態系統", "Marine Ecosystems"),
            ("地質學與板塊", "Geology and Tectonics"),
            ("粒子物理學", "Particle Physics"),
            ("傳染病學", "Epidemiology"),
            ("合成生物學", "Synthetic Biology"),
            ("天體生物學", "Astrobiology"),
            ("材料科學", "Materials Science"),
            ("大腦記憶機制", "Brain Memory Mechanisms"),
            ("免疫系統", "The Immune System")
        ],
        "angles": [
            ("的最新突破", "Latest Breakthroughs in"),
            ("尚未解開的謎團", "Unsolved Mysteries in"),
            ("對人類未來的意義", "Implications for Human Future in"),
            ("的歷史里程碑", "Historical Milestones in"),
            ("如何改變我們對世界的認知", "How It Changes Our Worldview:"),
            ("在日常生活中的隱藏應用", "Hidden Everyday Applications of"),
            ("面臨的研究瓶頸", "Research Bottlenecks in"),
            ("引發的倫理探討", "Ethical Discussions Triggered by"),
            ("與其他科學領域的交叉", "Intersections with Other Sciences:"),
            ("的大眾科普迷思", "Popular Science Myths About"),
            ("所需的昂貴設備與投資", "Expensive Equipment and Investment in"),
            ("如何啟發科幻小說", "How It Inspired Sci-Fi:"),
            ("對地球環境的啟示", "Lessons for Earth's Environment from"),
            ("下一個十年的預測", "Predictions for the Next Decade in")
        ]
    },
    "health": {
        "subjects": [
            ("睡眠品質", "Sleep Quality"),
            ("腸道微生態", "Gut Microbiome"),
            ("間歇性斷食", "Intermittent Fasting"),
            ("心理諮商", "Psychological Counseling"),
            ("運動與健身", "Exercise and Fitness"),
            ("抗老化醫學", "Anti-Aging Medicine"),
            ("疫苗發展", "Vaccine Development"),
            ("營養補充品", "Nutritional Supplements"),
            ("壓力管理", "Stress Management"),
            ("遠距醫療", "Telemedicine"),
            ("基因檢測", "Genetic Testing"),
            ("替代醫學", "Alternative Medicine"),
            ("植物性飲食", "Plant-Based Diets"),
            ("成癮問題", "Addiction Issues"),
            ("心血管健康", "Cardiovascular Health")
        ],
        "angles": [
            ("的最新科學研究", "Latest Scientific Research on"),
            ("常見的錯誤觀念", "Common Misconceptions About"),
            ("對壽命的影響", "Impact on Longevity from"),
            ("在不同年齡層的差異", "Differences Across Age Groups in"),
            ("如何融入忙碌的生活", "Incorporating into a Busy Life:"),
            ("的潛在風險與副作用", "Potential Risks and Side Effects of"),
            ("全球各地的不同做法", "Different Global Approaches to"),
            ("科技如何介入", "How Technology is Intervening in"),
            ("的經濟成本", "The Economic Cost of"),
            ("與心理健康的雙向關係", "Two-Way Relationship with Mental Health:"),
            ("未來的個人化趨勢", "Future Trends of Personalization in"),
            ("政策與法規的影響", "Impact of Policies and Regulations on"),
            ("的名人效應", "The Celebrity Effect on"),
            ("的歷史演變", "Historical Evolution of")
        ]
    },
    "art": {
        "subjects": [
            ("現代藝術", "Modern Art"),
            ("極簡主義設計", "Minimalist Design"),
            ("街頭藝術", "Street Art"),
            ("電影攝影", "Cinematography"),
            ("建築美學", "Architectural Aesthetics"),
            ("古典音樂", "Classical Music"),
            ("服裝設計", "Fashion Design"),
            ("平面設計", "Graphic Design"),
            ("數位藝術與NFT", "Digital Art and NFTs"),
            ("攝影紀實", "Documentary Photography"),
            ("室內設計", "Interior Design"),
            ("工業設計", "Industrial Design"),
            ("字體排版", "Typography"),
            ("電玩美術", "Video Game Art"),
            ("舞台劇設計", "Theater Design")
        ],
        "angles": [
            ("的歷史演變", "Historical Evolution of"),
            ("對社會運動的影響", "Impact on Social Movements by"),
            ("科技帶來的革命", "The Tech Revolution in"),
            ("如何表達當代焦慮", "Expressing Contemporary Anxiety through"),
            ("的商業化爭議", "Commercialization Controversies in"),
            ("跨界合作的火花", "Sparks of Cross-Disciplinary Collaboration in"),
            ("如何塑造城市形象", "Shaping City Identities through"),
            ("在不同文化中的解讀", "Interpretations in Different Cultures:"),
            ("的大師級人物解析", "Analysis of Master Figures in"),
            ("如何影響消費心理", "How It Influences Consumer Psychology:"),
            ("永續與環保概念在", "Sustainability and Eco-Concepts in"),
            ("的未來趨勢預測", "Forecasting Future Trends in"),
            ("如何反映時代精神", "Reflecting the Zeitgeist through"),
            ("的心理療癒作用", "Psychological Healing Effects of")
        ]
    },
    "society": {
        "subjects": [
            ("少子化問題", "Declining Birth Rates"),
            ("移民政策", "Immigration Policies"),
            ("居住正義", "Housing Justice"),
            ("教育不平等", "Educational Inequality"),
            ("動物權益", "Animal Rights"),
            ("死刑存廢", "Abolition of the Death Penalty"),
            ("安樂死合法化", "Legalization of Euthanasia"),
            ("網路霸凌", "Cyberbullying"),
            ("長照體系", "Long-Term Care Systems"),
            ("全民基本收入", "Universal Basic Income"),
            ("同性婚姻", "Same-Sex Marriage"),
            ("勞工罷工權", "Labor Strike Rights"),
            ("青少年犯罪", "Juvenile Delinquency"),
            ("族群歧視", "Racial Discrimination"),
            ("身心障礙者權益", "Disability Rights")
        ],
        "angles": [
            ("的全球現況比較", "Global Comparison of"),
            ("背後的歷史根源", "Historical Roots Behind"),
            ("引發的世代對立", "Generational Conflict Triggered by"),
            ("經濟層面的影響", "Economic Implications of"),
            ("社群媒體推波助瀾的角色", "The Role of Social Media in Fueling"),
            ("各國政府的應對措施", "Government Measures Around the World for"),
            ("相關的道德與哲學爭議", "Moral and Philosophical Debates on"),
            ("對國家競爭力的影響", "Impact on National Competitiveness from"),
            ("非政府組織(NGO)的努力", "NGO Efforts in"),
            ("未來可能的走向", "Possible Future Directions for"),
            ("影視作品中的呈現", "Representation in Film and Television of"),
            ("如何透過教育改善", "How to Improve through Education:"),
            ("法律層面的改革", "Legal Reforms for"),
            ("對社會凝聚力的挑戰", "Challenges to Social Cohesion from")
        ]
    },
    "history": {
        "subjects": [
            ("古羅馬帝國", "The Ancient Roman Empire"),
            ("工業革命", "The Industrial Revolution"),
            ("文藝復興", "The Renaissance"),
            ("冷戰時期", "The Cold War Era"),
            ("大航海時代", "The Age of Discovery"),
            ("古埃及文明", "Ancient Egyptian Civilization"),
            ("絲路貿易", "Silk Road Trade"),
            ("兩次世界大戰", "The Two World Wars"),
            ("啟蒙運動", "The Enlightenment"),
            ("法國大革命", "The French Revolution"),
            ("美洲原住民歷史", "Native American History"),
            ("維京人擴張", "Viking Expansion"),
            ("十字軍東征", "The Crusades"),
            ("古代奧林匹克", "The Ancient Olympics"),
            ("馬雅文明", "Mayan Civilization")
        ],
        "angles": [
            ("對現代社會的深遠影響", "Profound Impact on Modern Society from"),
            ("鮮為人知的歷史細節", "Little-Known Historical Details of"),
            ("當時的科技與發明", "Technology and Inventions During"),
            ("平民百姓的生活樣貌", "Everyday Life of Commoners in"),
            ("女性在其中的角色", "The Role of Women in"),
            ("導致其衰亡的原因", "Reasons for the Decline of"),
            ("當時的飲食與文化", "Diet and Culture During"),
            ("如何被後世誤解", "How It Was Misunderstood by Later Generations:"),
            ("重要的歷史轉捩點", "Key Turning Points in"),
            ("當時的醫學與疾病", "Medicine and Diseases During"),
            ("藝術與建築的成就", "Art and Architectural Achievements of"),
            ("對後世政治制度的啟發", "Inspirations for Later Political Systems from"),
            ("相關的著名神話與傳說", "Famous Myths and Legends Associated with"),
            ("考古學的新發現", "New Archaeological Discoveries Regarding")
        ]
    }
}

output = "const topicPools = {\n"

for category, data in categories.items():
    output += f'    "{category}": [\n'
    topics = []
    # 15 subjects * 14 angles = 210 topics per category. We just take the first 200.
    count = 0
    for subj_zh, subj_en in data["subjects"]:
        for ang_zh, ang_en in data["angles"]:
            if count >= 200:
                break
            
            # Format: Subject + Angle (English Angle + English Subject)
            # Actually, sometimes Angle is a prefix, sometimes a suffix in English.
            # To make it simpler, we just use format: 中文 (English)
            
            # For Chinese: usually Angle goes before or after Subject.
            if ang_zh.startswith("的") or ang_zh.startswith("對") or ang_zh.startswith("在") or ang_zh.startswith("如何") or ang_zh.startswith("與") or ang_zh.startswith("帶來的") or ang_zh.startswith("引發的") or ang_zh.startswith("背後的"):
                zh_topic = subj_zh + ang_zh
            else:
                zh_topic = ang_zh + subj_zh
                
            # For English:
            if ang_en.endswith("of") or ang_en.endswith("in") or ang_en.endswith("from") or ang_en.endswith("by") or ang_en.endswith("on") or ang_en.endswith("to") or ang_en.endswith("for") or ang_en.endswith("with"):
                en_topic = f"{ang_en} {subj_en}"
            elif ang_en.endswith(":"):
                en_topic = f"{ang_en} {subj_en}"
            else:
                en_topic = f"{subj_en}: {ang_en}"
                
            topics.append(f'        "{zh_topic} ({en_topic})"');
            count += 1
            
    output += ",\n".join(topics)
    output += '\n    ],\n'

output += "};\n"

with open("topics.js", "w", encoding="utf-8") as f:
    f.write(output)

print("Generated topics.js with 2000 topics successfully.")
