// 英耀篇 (Ying Yao Pian) — personality assessment by age + gender + subtype
// Professional edition: 18 templates (3 subtypes × 3 age groups × 2 genders)
// Integrated with 六爻 hexagram readings

export type AgeGroup = "young" | "middle" | "senior";
export type YinyaoKey = `${AgeGroup}_${"male" | "female"}`;
export type YinyaoSubtype = "A" | "B" | "C";

export interface YinyaoTemplate {
  key: YinyaoKey;
  subtype: YinyaoSubtype;
  subtypeName: string;
  subtypeNameEn: string;
  ageGroup: AgeGroup;
  gender: "male" | "female";
  archetype: string;
  archetypeEn: string;
  description: string;
  descriptionEn: string;
  traits: string[];
  traitsEn: string[];
  strengths: string[];
  strengthsEn: string[];
  weaknesses: string[];
  weaknessesEn: string[];
  adviceStyle: string;
  adviceStyleEn: string;
}

const TEMPLATES: YinyaoTemplate[] = [
  // ===== MALE =====

  // --- Young Male (<30) ---
  {
    key: "young_male", subtype: "A",
    subtypeName: "进取型", subtypeNameEn: "Ambitious",
    ageGroup: "young", gender: "male",
    archetype: "潜龙在渊 · 进取", archetypeEn: "Hidden Dragon · Ambitious",
    description: "心高气傲、目标明确、执行力尚可、感情易冲动、早年助力少、善于抓住机会但易急躁。",
    descriptionEn: "Ambitious and goal-oriented, decent execution, emotionally impulsive, limited early support, good at seizing opportunities but prone to impatience.",
    traits: ["心高气傲", "目标明确", "感情易冲动", "善于抓住机会"],
    traitsEn: ["Ambitious", "Goal-oriented", "Emotionally impulsive", "Good at seizing opportunities"],
    strengths: ["执行力强", "目标明确", "不畏挑战", "善于捕捉机遇"],
    strengthsEn: ["Strong execution", "Clear goals", "Fearless in face of challenges", "Sharp at spotting opportunities"],
    weaknesses: ["缺乏耐心", "容易急于求成", "早年助力少", "感情易冲动误事"],
    weaknessesEn: ["Impatient", "Rushes for results", "Limited early support", "Emotions can derail plans"],
    adviceStyle: "引导其沉潜蓄力，厚积薄发。关键时刻需冷静三思，勿因急躁错失良机。",
    adviceStyleEn: "Guide toward patience and accumulation. Cool reflection before critical decisions. Don't let impatience cost you opportunities.",
  },
  {
    key: "young_male", subtype: "B",
    subtypeName: "内敛型", subtypeNameEn: "Introspective",
    ageGroup: "young", gender: "male",
    archetype: "潜龙在渊 · 内敛", archetypeEn: "Hidden Dragon · Introspective",
    description: "性格内敛、不善表达、心思细腻、感情被动、眼高手低、重面子、渴望认可但不愿主动争取。",
    descriptionEn: "Introverted, poor at expression, delicate in thought, emotionally passive, high aspirations but low action, values face, craves recognition but refuses to take initiative.",
    traits: ["性格内敛", "心思细腻", "眼高手低", "重面子"],
    traitsEn: ["Introverted", "Delicate in thought", "High aspirations but low action", "Values face"],
    strengths: ["心思细腻", "洞察力强", "不随波逐流", "内心坚韧"],
    strengthsEn: ["Delicate in thought", "Strong insight", "Doesn't follow the crowd", "Inner resilience"],
    weaknesses: ["不善表达", "感情被动", "渴望认可但不愿主动争取", "眼高手低难落地"],
    weaknessesEn: ["Poor at expression", "Emotionally passive", "Craves recognition but won't seek it", "Ideas exceed execution"],
    adviceStyle: "鼓励自信表达，勇敢争取机会。放下对面子的执着，行动胜于空想。",
    adviceStyleEn: "Encourage confident expression and bold pursuit of opportunities. Let go of face concerns; action beats daydreaming.",
  },
  {
    key: "young_male", subtype: "C",
    subtypeName: "务实型", subtypeNameEn: "Pragmatic",
    ageGroup: "young", gender: "male",
    archetype: "潜龙在渊 · 务实", archetypeEn: "Hidden Dragon · Pragmatic",
    description: "踏实肯干、执行力强、不慕虚名、感情专一、早年辛苦打拼、助力少但能稳步前行、不善钻营。",
    descriptionEn: "Down-to-earth and hardworking, strong execution, not chasing fame, emotionally loyal, works hard in early years, limited support but progresses steadily, not good at scheming.",
    traits: ["踏实肯干", "不慕虚名", "感情专一", "不善钻营"],
    traitsEn: ["Down-to-earth", "Not chasing fame", "Emotionally loyal", "Not good at scheming"],
    strengths: ["执行力强", "脚踏实地", "感情专一", "稳步前行"],
    strengthsEn: ["Strong execution", "Grounded approach", "Emotionally loyal", "Steady progress"],
    weaknesses: ["不善钻营", "早年助力少", "过于朴实易被忽视", "上升速度较慢"],
    weaknessesEn: ["Not good at networking", "Limited early support", "Too plain-spoken, easily overlooked", "Slower career advancement"],
    adviceStyle: "肯定其踏实品质，提醒适度展现自己。稳扎稳打终有回报，但也要学会展示价值。",
    adviceStyleEn: "Affirm their grounded nature while reminding them to showcase themselves. Steady effort pays off, but learn to demonstrate your value.",
  },

  // --- Middle Male (30-50) ---
  {
    key: "middle_male", subtype: "A",
    subtypeName: "担当型", subtypeNameEn: "Responsible",
    ageGroup: "middle", gender: "male",
    archetype: "飞龙在天 · 担当", archetypeEn: "Dragon Soaring · Responsible",
    description: "劳碌操心、嘴硬心软、重责任、财来财去、婚姻口舌难免、上有老下有小、默默扛下所有压力。",
    descriptionEn: "Hardworking and burdened, tough exterior but soft heart, responsible, income fluctuates, inevitable marital disputes, supporting elders and children, silently bears all pressure.",
    traits: ["劳碌操心", "嘴硬心软", "重责任", "默默扛压"],
    traitsEn: ["Hardworking and burdened", "Tough exterior, soft heart", "Responsible", "Silently bears all pressure"],
    strengths: ["责任感强", "抗压能力出众", "默默付出不抱怨", "家庭事业两头扛"],
    strengthsEn: ["Strong sense of duty", "Excellent stress tolerance", "Gives silently without complaint", "Carries both family and career"],
    weaknesses: ["嘴硬心软易吃亏", "财来财去留不住", "婚姻口舌难免", "忽略自身需求"],
    weaknessesEn: ["Tough talk but soft heart gets taken advantage of", "Income fluctuates, hard to save", "Marital disputes inevitable", "Neglects own needs"],
    adviceStyle: "提醒张弛有度，事业之外兼顾家庭与自我。柔能克刚，学会放下部分担子。",
    adviceStyleEn: "Remind to balance work with family and self-care. Softness overcomes hardness. Learn to share the burden.",
  },
  {
    key: "middle_male", subtype: "B",
    subtypeName: "迷茫型", subtypeNameEn: "Uncertain",
    ageGroup: "middle", gender: "male",
    archetype: "飞龙在天 · 迷茫", archetypeEn: "Dragon Soaring · Uncertain",
    description: "事业瓶颈、心态浮躁、财运转弱、婚姻平淡、缺乏方向、想突破但无从下手、易遇小人干扰。",
    descriptionEn: "Career bottleneck, impetuous mindset, declining fortune, plain marriage, lack of direction, wants to break through but doesn't know how, prone to villain interference.",
    traits: ["事业瓶颈", "心态浮躁", "缺乏方向", "易遇小人干扰"],
    traitsEn: ["Career bottleneck", "Impetuous mindset", "Lack of direction", "Prone to villain interference"],
    strengths: ["有突破意愿", "经验丰富", "仍有潜力可挖", "内心不甘平庸"],
    strengthsEn: ["Desire to break through", "Rich experience", "Untapped potential", "Refuses mediocrity"],
    weaknesses: ["心态浮躁", "无从下手", "财运转弱", "婚姻趋于平淡"],
    weaknessesEn: ["Impetuous mindset", "Doesn't know where to start", "Declining fortune", "Marriage becoming stale"],
    adviceStyle: "引导其沉心静气，理清方向再行动。当下之困是转机前兆，不宜焦躁。",
    adviceStyleEn: "Guide toward calm reflection and clarity before action. Current difficulty signals an impending turn; don't panic.",
  },
  {
    key: "middle_male", subtype: "C",
    subtypeName: "顺遂型", subtypeNameEn: "Flourishing",
    ageGroup: "middle", gender: "male",
    archetype: "飞龙在天 · 顺遂", archetypeEn: "Dragon Soaring · Flourishing",
    description: "事业稳步、财运尚可、婚姻和睦、嘴软心善、善于沟通、贵人相助、既能扛事也懂倾诉。",
    descriptionEn: "Steady career, decent fortune, harmonious marriage, gentle and kind, good at communication, supported by benefactors, able to take responsibility and express emotions.",
    traits: ["事业稳步", "婚姻和睦", "善于沟通", "贵人相助"],
    traitsEn: ["Steady career", "Harmonious marriage", "Good communicator", "Supported by benefactors"],
    strengths: ["嘴软心善人缘好", "沟通能力强", "贵人运旺", "善于平衡内外"],
    strengthsEn: ["Gentle and kind, good relationships", "Strong communication", "Strong benefactor luck", "Balances internal and external"],
    weaknesses: ["可能安于现状", "缺乏危机意识", "过于依赖贵人", "进取心可能减弱"],
    weaknessesEn: ["May be too comfortable", "Lacks crisis awareness", "Over-reliant on benefactors", "Drive may be waning"],
    adviceStyle: "肯定其成就，提醒居安思危。珍惜当下，但不忘持续精进。",
    adviceStyleEn: "Affirm their achievements while reminding them to stay vigilant. Cherish the present but keep improving.",
  },

  // --- Senior Male (>50) ---
  {
    key: "senior_male", subtype: "A",
    subtypeName: "安分型", subtypeNameEn: "Content",
    ageGroup: "senior", gender: "male",
    archetype: "亢龙有悔 · 安分", archetypeEn: "Dragon Retreating · Content",
    description: "重健康、操心子女、求安稳、早年吃苦、晚年享福、固执念旧、重情重义、不贪不躁。",
    descriptionEn: "Values health, worries about children, seeks stability, endured hardships early, enjoys later blessings, stubborn and nostalgic, loyal and sincere, not greedy or impetuous.",
    traits: ["重健康", "操心子女", "固执念旧", "重情重义"],
    traitsEn: ["Values health", "Worries about children", "Stubborn and nostalgic", "Loyal and sincere"],
    strengths: ["早年吃苦积累丰厚", "重情重义人缘好", "不贪不躁心态稳", "晚年享福有根基"],
    strengthsEn: ["Rich accumulation from early hardships", "Loyal, good relationships", "Calm mindset, not greedy", "Solid foundation for later blessings"],
    weaknesses: ["固执念旧难转弯", "过度操心子女", "身体有小疾", "难以接受新观念"],
    weaknessesEn: ["Stubborn and stuck in old ways", "Excessive worry about children", "Minor health issues", "Hard to accept new ideas"],
    adviceStyle: "肯定其人生智慧，引导以平常心对待变化。退一步海阔天空，儿孙自有儿孙福。",
    adviceStyleEn: "Affirm their life wisdom. Guide toward accepting change with equanimity. Step back to see the vast sky; children have their own fortunes.",
  },
  {
    key: "senior_male", subtype: "B",
    subtypeName: "操劳型", subtypeNameEn: "Industrious",
    ageGroup: "senior", gender: "male",
    archetype: "亢龙有悔 · 操劳", archetypeEn: "Dragon Retreating · Industrious",
    description: "闲不住、仍操持家事/事业、子女不让人省心、身体有小疾、心软重情、凡事亲力亲为、晚年仍有操劳。",
    descriptionEn: "Restless, still handles family/business affairs, children are worrying, minor health issues, soft-hearted and emotional, does everything personally, still busy in old age.",
    traits: ["闲不住", "心软重情", "凡事亲力亲为", "为子女操心"],
    traitsEn: ["Restless", "Soft-hearted and emotional", "Does everything personally", "Worries about children"],
    strengths: ["精力充沛", "责任心极强", "经验丰富仍能出力", "亲情浓厚"],
    strengthsEn: ["Energetic", "Extremely responsible", "Rich experience, still contributing", "Strong family bonds"],
    weaknesses: ["过度操劳伤身", "子女不让人省心", "身体已有小疾", "放不下执念"],
    weaknessesEn: ["Overwork damages health", "Children are worrying", "Already has minor health issues", "Can't let go of attachments"],
    adviceStyle: "温言劝慰其放下操心事，学会享福。身体健康才是对子女最好的礼物。",
    adviceStyleEn: "Gently persuade them to let go of burdens and learn to enjoy life. Good health is the best gift for your children.",
  },
  {
    key: "senior_male", subtype: "C",
    subtypeName: "通透型", subtypeNameEn: "Enlightened",
    ageGroup: "senior", gender: "male",
    archetype: "亢龙有悔 · 通透", archetypeEn: "Dragon Retreating · Enlightened",
    description: "心态平和、通透豁达、看淡得失、子女孝顺、身体康健、重情义但不执念、晚年安稳舒心。",
    descriptionEn: "Calm mindset, wise and open-minded, indifferent to gains and losses, filial children, healthy body, values friendship but not obsessive, stable and comfortable in old age.",
    traits: ["心态平和", "通透豁达", "看淡得失", "重情义不执念"],
    traitsEn: ["Calm mindset", "Wise and open-minded", "Indifferent to gains and losses", "Values friendship, not obsessive"],
    strengths: ["通透豁达智慧深", "子女孝顺有福气", "身体康健", "晚年安稳舒心"],
    strengthsEn: ["Deep wisdom and openness", "Blessed with filial children", "Healthy body", "Stable and comfortable later life"],
    weaknesses: ["可能过于超然", "对世事关注减少", "社交圈可能缩小", "偶尔感到孤寂"],
    weaknessesEn: ["May be overly detached", "Reduced engagement with world", "Social circle may shrink", "Occasional loneliness"],
    adviceStyle: "欣赏其通透智慧，鼓励分享人生经验。享受清闲，但保持适度社交。",
    adviceStyleEn: "Appreciate their enlightened wisdom and encourage sharing life lessons. Enjoy the quiet but maintain moderate social connection.",
  },

  // ===== FEMALE =====

  // --- Young Female (<30) ---
  {
    key: "young_female", subtype: "A",
    subtypeName: "感性型", subtypeNameEn: "Sensitive",
    ageGroup: "young", gender: "female",
    archetype: "含苞待放 · 感性", archetypeEn: "Blossom in Waiting · Sensitive",
    description: "心软重情、易动情也易受伤、感情波折多、心事重、敏感细腻、不善拒绝、求财不稳。",
    descriptionEn: "Soft-hearted and emotional, easily moved and hurt, turbulent relationships, overthinking, sensitive and delicate, struggles to refuse others, unstable wealth.",
    traits: ["心软重情", "敏感细腻", "心事重", "不善拒绝"],
    traitsEn: ["Soft-hearted and emotional", "Sensitive and delicate", "Overthinking", "Struggles to refuse others"],
    strengths: ["情感细腻丰富", "直觉敏锐", "善解人意", "富有创造力"],
    strengthsEn: ["Rich emotional depth", "Sharp intuition", "Empathetic", "Creative"],
    weaknesses: ["易动情也易受伤", "感情波折多", "不善拒绝易被利用", "求财不稳"],
    weaknessesEn: ["Easily moved and hurt", "Turbulent relationships", "Can't refuse, easily exploited", "Unstable wealth"],
    adviceStyle: "鼓励自信独立，学会为自己设立边界。善良是美德，但先要保护好自己。",
    adviceStyleEn: "Encourage confidence and independence. Learn to set boundaries. Kindness is a virtue, but protect yourself first.",
  },
  {
    key: "young_female", subtype: "B",
    subtypeName: "独立型", subtypeNameEn: "Independent",
    ageGroup: "young", gender: "female",
    archetype: "含苞待放 · 独立", archetypeEn: "Blossom in Waiting · Independent",
    description: "独立自强、执行力强、事业心重、感情被动、不依赖他人、嘴硬心软、易因强势错失缘分。",
    descriptionEn: "Independent and self-reliant, strong execution, career-oriented, emotionally passive, not dependent on others, tough exterior but soft heart, prone to losing relationships due to stubbornness.",
    traits: ["独立自强", "事业心重", "感情被动", "嘴硬心软"],
    traitsEn: ["Independent and self-reliant", "Career-oriented", "Emotionally passive", "Tough exterior, soft heart"],
    strengths: ["执行力强", "不依赖他人", "事业有成", "自律坚韧"],
    strengthsEn: ["Strong execution", "Not dependent on others", "Career success", "Disciplined and resilient"],
    weaknesses: ["感情被动易错失缘分", "嘴硬心软易被误解", "易因强势吓退他人", "不善示弱"],
    weaknessesEn: ["Passive in love, misses chances", "Tough exterior misunderstood", "Strong personality scares others off", "Can't show vulnerability"],
    adviceStyle: "提醒刚柔并济，适当展现柔软一面。独立是力量，但亲密关系需要彼此依靠。",
    adviceStyleEn: "Remind to balance strength with softness. Independence is power, but intimacy requires mutual reliance.",
  },
  {
    key: "young_female", subtype: "C",
    subtypeName: "务实型", subtypeNameEn: "Pragmatic",
    ageGroup: "young", gender: "female",
    archetype: "含苞待放 · 务实", archetypeEn: "Blossom in Waiting · Pragmatic",
    description: "踏实稳重、心思缜密、感情专一、不善交际、求财稳健、助力少但能稳步积累、重细节。",
    descriptionEn: "Steady and prudent, careful in thought, emotionally loyal, not good at socializing, stable wealth accumulation, limited support but progresses steadily, focuses on details.",
    traits: ["踏实稳重", "心思缜密", "感情专一", "重细节"],
    traitsEn: ["Steady and prudent", "Careful in thought", "Emotionally loyal", "Detail-oriented"],
    strengths: ["心思缜密做事靠谱", "感情专一值得信赖", "求财稳健不冒进", "稳步积累有成果"],
    strengthsEn: ["Careful and reliable", "Loyal and trustworthy", "Stable finances, no recklessness", "Steady accumulation yields results"],
    weaknesses: ["不善交际圈子小", "助力少需独自打拼", "过于注重细节可能错失大局", "过于保守可能错失机会"],
    weaknessesEn: ["Poor social skills, small network", "Limited support, works alone", "Over-focus on details misses big picture", "Too conservative may miss opportunities"],
    adviceStyle: "肯定其踏实品质，鼓励适度拓展人脉。稳扎稳打之余，也要敢于抓住机遇。",
    adviceStyleEn: "Affirm their grounded nature and encourage moderate networking. Steady progress is good, but also dare to seize opportunities.",
  },

  // --- Middle Female (30-50) ---
  {
    key: "middle_female", subtype: "A",
    subtypeName: "付出型", subtypeNameEn: "Devoted",
    ageGroup: "middle", gender: "female",
    archetype: "厚德载物 · 付出", archetypeEn: "Earth Nourishing · Devoted",
    description: "操心劳碌、为家庭付出多、忽略自我、婚姻委屈、留不住财、隐忍坚韧、重家庭轻个人。",
    descriptionEn: "Dedicated and hardworking, sacrifices much for family, neglects self, marital grievances, difficulty saving wealth, patient and resilient, prioritizes family over self.",
    traits: ["操心劳碌", "为家庭付出多", "隐忍坚韧", "重家庭轻个人"],
    traitsEn: ["Dedicated and hardworking", "Sacrifices for family", "Patient and resilient", "Prioritizes family over self"],
    strengths: ["家庭凝聚力强", "隐忍坚韧不放弃", "无私奉献", "承上启下的枢纽"],
    strengthsEn: ["Strong family cohesion", "Patient and resilient, never gives up", "Selfless dedication", "Bridge between generations"],
    weaknesses: ["过度牺牲自我", "婚姻委屈隐忍", "留不住财", "忽略自身需求"],
    weaknessesEn: ["Over-self-sacrifice", "Swallows marital grievances", "Hard to save money", "Neglects own needs"],
    adviceStyle: "提醒关爱自己，适度放手。你不是一个人的支柱。学会为自己留一份空间和积蓄。",
    adviceStyleEn: "Remind to care for yourself. Let go appropriately. You don't have to hold everything alone. Save some space and resources for yourself.",
  },
  {
    key: "middle_female", subtype: "B",
    subtypeName: "平衡型", subtypeNameEn: "Balanced",
    ageGroup: "middle", gender: "female",
    archetype: "厚德载物 · 平衡", archetypeEn: "Earth Nourishing · Balanced",
    description: "事业家庭兼顾、善于沟通、心态平和、财运尚可、婚姻和睦、懂得取舍、既重责任也懂爱自己。",
    descriptionEn: "Balances career and family, good at communication, calm mindset, decent fortune, harmonious marriage, knows how to choose, values responsibility and self-love.",
    traits: ["事业家庭兼顾", "善于沟通", "心态平和", "懂得取舍"],
    traitsEn: ["Balances career and family", "Good communicator", "Calm mindset", "Knows how to choose"],
    strengths: ["沟通能力出色", "心态平和情绪稳", "婚姻和睦家庭幸福", "懂得爱自己有智慧"],
    strengthsEn: ["Excellent communication", "Calm and emotionally stable", "Harmonious marriage, happy family", "Wise self-love"],
    weaknesses: ["追求平衡可能两边不讨好", "过于理想化", "取舍时可能犹豫", "外部压力仍存在"],
    weaknessesEn: ["Pursuing balance may please neither side", "Overly idealistic", "May hesitate when choosing", "External pressures still exist"],
    adviceStyle: "欣赏其平衡智慧，鼓励继续保持。平衡是一种艺术，你已经做得很好。",
    adviceStyleEn: "Appreciate their balancing wisdom and encourage continued effort. Balance is an art, and you're doing well.",
  },
  {
    key: "middle_female", subtype: "C",
    subtypeName: "迷茫型", subtypeNameEn: "Uncertain",
    ageGroup: "middle", gender: "female",
    archetype: "厚德载物 · 迷茫", archetypeEn: "Earth Nourishing · Uncertain",
    description: "家庭琐事缠身、事业无突破、心态浮躁、感情平淡、易焦虑、缺乏安全感、想改变但无力。",
    descriptionEn: "Burdened by family chores, no career breakthrough, impetuous mindset, plain marriage, prone to anxiety, lack of security, wants to change but feels powerless.",
    traits: ["家庭琐事缠身", "心态浮躁", "易焦虑", "缺乏安全感"],
    traitsEn: ["Burdened by family chores", "Impetuous mindset", "Prone to anxiety", "Lack of security"],
    strengths: ["有改变意愿", "重视家庭", "内心有追求", "韧性尚存"],
    strengthsEn: ["Desire to change", "Values family", "Has inner aspirations", "Still has resilience"],
    weaknesses: ["事业无突破", "感情平淡无味", "想改变但无力", "缺乏方向感"],
    weaknessesEn: ["No career breakthrough", "Stale relationship", "Wants change but feels powerless", "Lack of direction"],
    adviceStyle: "引导其从小事开始改变，逐步找回掌控感。不必一步到位，积少成多。",
    adviceStyleEn: "Guide toward small changes to regain a sense of control. No need to fix everything at once; small steps accumulate.",
  },

  // --- Senior Female (>50) ---
  {
    key: "senior_female", subtype: "A",
    subtypeName: "慈爱型", subtypeNameEn: "Nurturing",
    ageGroup: "senior", gender: "female",
    archetype: "慈母手中线 · 慈爱", archetypeEn: "Loving Mother · Nurturing",
    description: "重子女、心善、晚年安稳、身体有小疾、后福不浅、温和通透、少计较多包容、乐于付出。",
    descriptionEn: "Devoted to children, kind-hearted, stable later life, minor health issues, good fortune in old age, gentle and wise, tolerant and forgiving, willing to give.",
    traits: ["重子女", "心善包容", "温和通透", "乐于付出"],
    traitsEn: ["Devoted to children", "Kind and tolerant", "Gentle and wise", "Willing to give"],
    strengths: ["家庭凝聚力核心", "温和通透有智慧", "后福不浅", "少计较多包容"],
    strengthsEn: ["Core of family cohesion", "Gentle, wise, and perceptive", "Good fortune in later years", "Tolerant and forgiving"],
    weaknesses: ["身体有小疾", "过度操心子女", "过于包容可能被忽视", "不善于为自己争取"],
    weaknessesEn: ["Minor health issues", "Excessive worry about children", "Too tolerant, may be overlooked", "Not good at advocating for herself"],
    adviceStyle: "温言劝慰，引导其放宽心，享受当下。您已付出足够多，现在该为自己而活。",
    adviceStyleEn: "Gently reassure. Guide toward loosening worry and enjoying the present. You've given enough; now live for yourself.",
  },
  {
    key: "senior_female", subtype: "B",
    subtypeName: "坚韧型", subtypeNameEn: "Resilient",
    ageGroup: "senior", gender: "female",
    archetype: "慈母手中线 · 坚韧", archetypeEn: "Loving Mother · Resilient",
    description: "早年吃苦、性格坚韧、独自扛事、子女懂事、身体硬朗、重情义、不抱怨、晚年享福。",
    descriptionEn: "Endured hardships early, tough character, handles things alone, filial children, strong body, values friendship, no complaints, enjoys later blessings.",
    traits: ["早年吃苦", "性格坚韧", "独自扛事", "不抱怨"],
    traitsEn: ["Endured early hardships", "Tough character", "Handles things alone", "Never complains"],
    strengths: ["性格坚韧不拔", "子女懂事孝顺", "身体硬朗", "晚年享福有福报"],
    strengthsEn: ["Unwavering resilience", "Filial and sensible children", "Strong body", "Blessed later years as reward"],
    weaknesses: ["独自扛事太辛苦", "不抱怨但内心有苦", "早年吃苦落下的病根", "过于要强"],
    weaknessesEn: ["Carrying everything alone is exhausting", "No complaints but inner pain", "Lingering health issues from early hardship", "Too tough for her own good"],
    adviceStyle: "致敬其坚韧品格，提醒适当放下重担。苦尽甘来，现在该享受人生了。",
    adviceStyleEn: "Honor their resilient character while reminding them to set down the burden. Hardship is behind you; now enjoy life.",
  },
  {
    key: "senior_female", subtype: "C",
    subtypeName: "豁达型", subtypeNameEn: "Free-spirited",
    ageGroup: "senior", gender: "female",
    archetype: "慈母手中线 · 豁达", archetypeEn: "Loving Mother · Free-spirited",
    description: "看淡世事、心态豁达、不操闲心、子女独立、身体康健、喜欢清净、晚年舒心自在。",
    descriptionEn: "Indifferent to worldly affairs, open-minded, doesn't worry about trivial matters, independent children, healthy body, likes peace and quiet, comfortable and free in old age.",
    traits: ["看淡世事", "心态豁达", "喜欢清净", "不操闲心"],
    traitsEn: ["Indifferent to worldly affairs", "Open-minded", "Likes peace and quiet", "Doesn't worry about trifles"],
    strengths: ["心态豁达智慧深", "子女独立不操心", "身体康健", "晚年舒心自在"],
    strengthsEn: ["Deep wisdom and open-mindedness", "Independent children, no worries", "Healthy body", "Comfortable and free later life"],
    weaknesses: ["可能过于远离世事", "社交活动减少", "子女独立后可能孤单", "过于清净缺乏活力"],
    weaknessesEn: ["May be too detached from world", "Reduced social activity", "May feel lonely after children leave", "Too quiet, lacks vitality"],
    adviceStyle: "欣赏其豁达境界，鼓励适度参与社交。清净是福，但偶尔的热闹也是生活的滋味。",
    adviceStyleEn: "Appreciate their free-spirited nature and encourage moderate social engagement. Peace is a blessing, but occasional liveliness adds flavor to life.",
  },
];

export function getYinyaoTemplates(birthDate: Date, gender: "male" | "female"): YinyaoTemplate[] {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  let ageGroup: AgeGroup;
  // DOCX age ranges: <30 young, 30-50 middle, >50 senior
  if (age < 30) ageGroup = "young";
  else if (age <= 50) ageGroup = "middle";
  else ageGroup = "senior";

  const key: YinyaoKey = `${ageGroup}_${gender}`;
  return TEMPLATES.filter(t => t.key === key);
}

/** Returns a single template (subtype A) for backward compatibility. */
export function getYinyaoTemplate(birthDate: Date, gender: "male" | "female"): YinyaoTemplate {
  const templates = getYinyaoTemplates(birthDate, gender);
  return templates[0];
}

export function getAllYinyaoTemplates(): readonly YinyaoTemplate[] {
  return TEMPLATES;
}
