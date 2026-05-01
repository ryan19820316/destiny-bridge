// 六爻动态话术库 + 分测算类型建议库 + 英耀核心心法
// Professional bilingual copy library — AI reference material for hexagram interpretation

export interface DynamicScript {
  name: string;
  nameEn: string;
  text: string;
  textEn: string;
}

// ===== 通用卦象话术 (14 items) =====
export const GENERAL_SCRIPTS: DynamicScript[] = [
  // 1. 用神旺（吉）
  { name: "用神旺-基础", nameEn: "Strong Key Element - Basic", text: "卦象根基稳固，你自身气场足、能力在线，此事有天时地利，只要稳扎稳打，必能有成。", textEn: "Solid foundation in the hexagram, strong personal aura and competence. Timing and conditions favor you; steady effort ensures success." },
  { name: "用神旺-事业", nameEn: "Strong Key Element - Career", text: "用神旺相，事业根基扎实，能力匹配岗位，有贵人相助，晋升/成事几率极高，稳步推进即可。", textEn: "Strong key element, solid career foundation, competence matches the position, supported by benefactors, high chance of promotion/success, steady progress is sufficient." },
  { name: "用神旺-感情", nameEn: "Strong Key Element - Love", text: "用神旺相，感情根基深厚，对方真心待你，彼此契合，虽有小摩擦，终能和睦长久。", textEn: "Strong key element, deep emotional foundation, the other party treats you sincerely, mutual compatibility, minor frictions but eventual harmony and longevity." },

  // 2. 用神弱（凶）
  { name: "用神弱-基础", nameEn: "Weak Key Element - Basic", text: "卦中用神乏力，当下运势偏弱、阻力暗生，此事难一蹴而就，需隐忍蓄力、静待时机。", textEn: "Weak key element in the hexagram, current fortune low with hidden obstacles. Success won't come easily; bide your time and build strength." },
  { name: "用神弱-财运", nameEn: "Weak Key Element - Wealth", text: "用神偏弱，财运乏力，易有耗财、漏财之事，不可盲目投资，需稳健理财、守住财库。", textEn: "Weak key element, sluggish fortune, prone to financial losses and leaks. Avoid reckless investments; manage finances conservatively and protect wealth." },
  { name: "用神弱-健康", nameEn: "Weak Key Element - Health", text: "用神偏弱，身体气场不足，易有小疾缠身，需注意作息、调理身体，不可过度劳累。", textEn: "Weak key element, insufficient physical aura, prone to minor illnesses. Pay attention to work-rest balance, regulate the body, and avoid overwork." },

  // 3. 世应相生（助力）
  { name: "世应相生-基础", nameEn: "Self-Response Harmony - Basic", text: "世应相契、内外和谐，有贵人暗中相助，对方/环境对你友善，沟通顺畅、事半功倍。", textEn: "Harmony between self and situation, internal-external balance. Benefactors offer help; others/environment favor you, smooth communication, half the effort for double results." },
  { name: "世应相生-具体事", nameEn: "Self-Response Harmony - Specific", text: "世应相生，此事内外相助，阻力极小，只要把握时机、积极行动，必能顺利落地。", textEn: "Harmony between self and situation, internal and external support, minimal resistance. Seize the opportunity and take positive action for smooth realization." },

  // 4. 世应相克（阻力）
  { name: "世应相克-基础", nameEn: "Self-Response Conflict - Basic", text: "世应相冲、内外不协，易遇口舌小人、观念对立，此事多波折，需防争执、低调行事。", textEn: "Conflict between self and situation, internal-external disharmony. Risk of disputes and villains, opposing views. Expect twists; avoid conflict and stay low-key." },
  { name: "世应相克-婚姻", nameEn: "Self-Response Conflict - Marriage", text: "世应相克，夫妻观念不合、沟通不畅，易有冷战、争执，需多换位思考、互相包容。", textEn: "Conflict between self and situation, couple have different views and poor communication, prone to cold wars and disputes. Need more empathy and mutual tolerance." },

  // 5. 动爻生用神（转机）
  { name: "动爻生用神-基础", nameEn: "Moving Line Supports Key Element - Basic", text: "动爻生扶用神，中途有转机、绝处逢生，虽有波折但终能化解，坚持下去必有好结果。", textEn: "Changing line supports the key element, turning point amid difficulties. Obstacles resolve with persistence; good outcome awaits." },
  { name: "动爻生用神-困境", nameEn: "Moving Line Supports Key Element - Difficult", text: "动爻生助用神，当下虽处困境，但必有贵人出手相助，只要耐心等待，转机很快出现。", textEn: "Changing line supports the key element, currently in difficulty but benefactors will help soon. Be patient and the turning point will come quickly." },

  // 6. 动爻克用神（破局）
  { name: "动爻克用神-基础", nameEn: "Moving Line Restrains Key Element - Basic", text: "动爻克制用神，突发变故、阻力加剧，此事易生变数、中途受阻，需早做防备、灵活应变。", textEn: "Changing line restrains the key element, sudden setbacks and increased resistance. Expect uncertainties and delays; prepare early and adapt flexibly." },
  { name: "动爻克用神-求财", nameEn: "Moving Line Restrains Key Element - Wealth", text: "动爻克害用神，求财易遇阻碍、破财风险高，需谨慎行事、及时止损，不可贪多冒进。", textEn: "Changing line harms the key element, high risk of obstacles and financial losses in seeking wealth. Act cautiously, cut losses in time, and avoid greed and recklessness." },

  // 7. 空亡/伏藏（隐藏）
  { name: "空亡/伏藏-基础", nameEn: "Void/Hidden - Basic", text: "用神空伏、事有隐藏，真相未明、暂时难成，需等空亡出空、时机明朗，不可急于求成。", textEn: "Key element hidden/void, unclear truth and temporary stagnation. Wait for the void to clear and timing to align; avoid rushing." },
  { name: "空亡/伏藏-感情", nameEn: "Void/Hidden - Love", text: "用神空伏，感情有隐藏隐患，对方心思未明或有隐瞒，需耐心观察、不可盲目投入。", textEn: "Key element hidden/void, hidden risks in the relationship, the other party's thoughts are unclear or concealed. Observe patiently and avoid blind investment." },
];

// ===== 六亲专用话术 (28 items) =====
export const LIUQIN_SCRIPTS: DynamicScript[] = [
  // --- 妻财爻 (7) ---
  { name: "妻财旺-财运", nameEn: "Strong Wealth Line - Wealth", text: "妻财旺相，财运亨通，正财稳固、偏财可期，善于理财、财库充盈，近期有进财之机。", textEn: "Wealth line is strong, fortune is prosperous, stable positive income and promising windfall, good at financial management, abundant wealth reserve, opportunity to gain wealth recently." },
  { name: "妻财旺-感情", nameEn: "Strong Wealth Line - Love (M)", text: "妻财旺相，女友/妻子贤淑能干、真心待你，感情和睦，彼此扶持，家庭财运也随之兴旺。", textEn: "Wealth line is strong, girlfriend/wife is virtuous and capable, treats you sincerely, harmonious relationship, mutual support, family fortune also prospers." },
  { name: "妻财弱-财运", nameEn: "Weak Wealth Line - Wealth", text: "妻财偏弱，财运不佳，易有耗财、漏财，赚钱辛苦、难聚财，需稳健理财、避免浪费。", textEn: "Wealth line is weak, poor fortune, prone to financial losses and leaks, hard to earn money and accumulate wealth, need to manage finances conservatively and avoid waste." },
  { name: "妻财弱-感情", nameEn: "Weak Wealth Line - Love (M)", text: "妻财偏弱，感情基础不牢，对方对你付出有限，易有矛盾、沟通不畅，需多用心经营。", textEn: "Wealth line is weak, fragile emotional foundation, the other party gives you limited dedication, prone to conflicts and poor communication, need to invest more in management." },
  { name: "妻财动生世", nameEn: "Wealth Line Moves to Support Self", text: "妻财动而生世，财运自动上门，有意外进财、贵人送财之机，感情上对方主动付出、真心相待。", textEn: "Wealth line moves to support self line, wealth comes automatically, opportunity for unexpected income or benefactor gifts, emotionally the other party takes initiative and treats you sincerely." },
  { name: "妻财动克世", nameEn: "Wealth Line Moves to Restrain Self", text: "妻财动而克世，财运有隐患，易因钱财产生纠纷、破财，感情上易因金钱争吵、产生矛盾。", textEn: "Wealth line moves to restrain self line, hidden financial risks, prone to disputes and losses due to money, emotionally prone to quarrels and conflicts over money." },
  { name: "妻财空亡/伏藏", nameEn: "Wealth Line Void/Hidden", text: "妻财空伏，财运暂时低迷、无进财之机，感情上对方心思难测、有隐瞒，或暂时难遇良缘。", textEn: "Wealth line is hidden/void, temporary sluggish fortune with no opportunity to gain wealth, emotionally the other party's thoughts are unpredictable and concealed, or it's hard to meet a good relationship temporarily." },

  // --- 官鬼爻 (7) ---
  { name: "官鬼旺-事业", nameEn: "Strong Official Line - Career", text: "官鬼旺相，事业运势强劲，有职位提升、贵人相助，能力得到认可，职场发展顺利。", textEn: "Official line is strong, strong career fortune, opportunity for promotion, supported by benefactors, competence recognized, smooth career development." },
  { name: "官鬼旺-感情", nameEn: "Strong Official Line - Love (F)", text: "官鬼旺相，男友/丈夫有担当、能力强，对你真心，感情稳固，能给你依靠和安全感。", textEn: "Official line is strong, boyfriend/husband is responsible and capable, treats you sincerely, stable relationship, can give you reliance and a sense of security." },
  { name: "官鬼旺-官司", nameEn: "Strong Official Line - Legal", text: "官鬼旺相，官司缠身、是非不断，易有口舌纠纷、官非困扰，需谨慎应对、寻求助力。", textEn: "Official line is strong, entangled in lawsuits and constant disputes, prone to verbal conflicts and legal troubles, need to respond cautiously and seek help." },
  { name: "官鬼弱-事业", nameEn: "Weak Official Line - Career", text: "官鬼偏弱，事业瓶颈、晋升无望，能力难以施展，易遇小人打压，职场发展不顺。", textEn: "Official line is weak, career bottleneck with no promotion opportunity, difficult to exert competence, prone to villain suppression, smooth career development." },
  { name: "官鬼弱-感情", nameEn: "Weak Official Line - Love (F)", text: "官鬼偏弱，男友/丈夫担当不足、能力有限，感情平淡，缺乏依靠，需多沟通、互相扶持。", textEn: "Official line is weak, boyfriend/husband lacks responsibility and competence, plain relationship, lack of reliance, need more communication and mutual support." },
  { name: "官鬼动生世", nameEn: "Official Line Moves to Support Self", text: "官鬼动而生世，事业有转机、贵人提拔，感情上对方主动追求、真心相待，官司能顺利化解。", textEn: "Official line moves to support self line, career turning point and benefactor promotion, emotionally the other party takes initiative and treats you sincerely, lawsuit can be resolved smoothly." },
  { name: "官鬼动克世", nameEn: "Official Line Moves to Restrain Self", text: "官鬼动而克世，事业遇阻碍、小人刁难，感情上对方易发脾气、产生矛盾，官司对你不利。", textEn: "Official line moves to restrain self line, career obstacles and villain harassment, emotionally the other party is prone to anger and conflicts, lawsuit is unfavorable to you." },

  // --- 子孙爻 (7) ---
  { name: "子孙旺-健康", nameEn: "Strong Offspring Line - Health", text: "子孙旺相，身体健康、气场充足，无大疾困扰，即使有小疾也能快速痊愈，精力充沛。", textEn: "Offspring line is strong, healthy body and sufficient aura, no major illnesses, minor illnesses can recover quickly, full of energy." },
  { name: "子孙旺-子女", nameEn: "Strong Offspring Line - Children", text: "子孙旺相，子女懂事孝顺、有出息，身体健康、学业/事业顺利，能给你带来福气。", textEn: "Offspring line is strong, children are sensible and filial, promising, healthy body, smooth study/career, can bring you blessings." },
  { name: "子孙旺-解忧", nameEn: "Strong Offspring Line - Relief", text: "子孙旺相，能化解烦恼、驱散小人，遇事有转机，心态平和，能顺利度过困境。", textEn: "Offspring line is strong, can resolve troubles and drive away villains, turning point in difficulties, calm mindset, can get through difficulties smoothly." },
  { name: "子孙弱-健康", nameEn: "Weak Offspring Line - Health", text: "子孙偏弱，身体健康不佳，易有小疾缠身、精力不足，需注意调理、避免过度劳累。", textEn: "Offspring line is weak, poor health, prone to minor illnesses and lack of energy, need to pay attention to conditioning and avoid overwork." },
  { name: "子孙弱-子女", nameEn: "Weak Offspring Line - Children", text: "子孙偏弱，子女身体不佳、学业/事业不顺，易让你操心，需多引导、悉心照料。", textEn: "Offspring line is weak, children have poor health and smooth study/career, prone to worry you, need more guidance and careful care." },
  { name: "子孙动生世", nameEn: "Offspring Line Moves to Support Self", text: "子孙动而生世，健康好转、疾病痊愈，子女带来好运，能化解困境、迎来转机。", textEn: "Offspring line moves to support self line, health improves and illness recovers, children bring good luck, can resolve difficulties and usher in a turning point." },
  { name: "子孙动克世", nameEn: "Offspring Line Moves to Restrain Self", text: "子孙动而克世，健康出现隐患、易生疾病，子女让你操心劳累，甚至带来麻烦。", textEn: "Offspring line moves to restrain self line, hidden health risks and prone to illness, children make you worry and tired, even bring trouble." },

  // --- 父母爻 (7) ---
  { name: "父母旺-长辈", nameEn: "Strong Parent Line - Elders", text: "父母旺相，长辈身体健康、福寿绵长，能给你助力和支持，家庭根基稳固。", textEn: "Parent line is strong, elders are healthy and long-lived, can give you help and support, solid family foundation." },
  { name: "父母旺-文书/房子", nameEn: "Strong Parent Line - Documents/House", text: "父母旺相，文书、证件办理顺利，买房、建房顺利，事业/学业根基扎实。", textEn: "Parent line is strong, smooth handling of documents and certificates, smooth house purchase/construction, solid foundation for career/study." },
  { name: "父母弱-长辈", nameEn: "Weak Parent Line - Elders", text: "父母偏弱，长辈身体健康不佳、易生疾病，需多关心照料，难以给你助力。", textEn: "Parent line is weak, elders have poor health and are prone to illness, need more care and attention, difficult to give you help." },
  { name: "父母弱-文书/房子", nameEn: "Weak Parent Line - Documents/House", text: "父母偏弱，文书、证件办理不顺，买房、建房有阻碍，事业/学业根基不牢。", textEn: "Parent line is weak, difficult handling of documents and certificates, obstacles in house purchase/construction, unstable foundation for career/study." },
  { name: "父母动生世", nameEn: "Parent Line Moves to Support Self", text: "父母动而生世，长辈给予助力、文书顺利办成，买房/建房有转机，事业/学业得到扶持。", textEn: "Parent line moves to support self line, elders give help, documents are handled smoothly, turning point in house purchase/construction, career/study is supported." },
  { name: "父母动克世", nameEn: "Parent Line Moves to Restrain Self", text: "父母动而克世，长辈健康出现问题、给你带来负担，文书受阻、买房/建房有麻烦。", textEn: "Parent line moves to restrain self line, elders have health problems and bring you burden, documents are blocked, troubles in house purchase/construction." },
  { name: "父母空亡/伏藏", nameEn: "Parent Line Void/Hidden", text: "父母空伏，长辈健康有隐藏隐患，文书、证件暂时难以办成，买房/建房时机未到。", textEn: "Parent line is hidden/void, hidden health risks for elders, documents and certificates are temporarily difficult to handle, timing for house purchase/construction is not right." },
];

// ===== 分测算类型建议库 (36 items, 6 per calcType) =====
export interface CalcTypeAdvice {
  calcType: number;
  category: string;
  categoryEn: string;
  entries: { name: string; nameEn: string; text: string; textEn: string }[];
}

export const CALC_TYPE_ADVICE: CalcTypeAdvice[] = [
  {
    calcType: 1, category: "婚姻", categoryEn: "Marriage",
    entries: [
      { name: "核心建议", nameEn: "Core Advice", text: "忌冷战翻旧账，多示弱少争输赢；沟通温和、换位思考，珍惜缘分、化解口舌，感情自稳。", textEn: "Avoid cold wars and rehashing old issues; be vulnerable instead of arguing. Communicate gently, empathize, cherish the bond, resolve disputes—relationship stabilizes." },
      { name: "矛盾化解", nameEn: "Conflict Resolution", text: "夫妻之间，多听少说、多包容少指责，遇事不急躁、不冲动，坦诚沟通，方能长久和睦。", textEn: "Between husband and wife, listen more and speak less, tolerate more and blame less, stay calm and not impulsive when encountering problems, communicate frankly to achieve long-term harmony." },
      { name: "长久经营", nameEn: "Long-term Management", text: "婚姻需用心经营，少计较多付出，多陪伴少敷衍，尊重彼此、保留空间，方能携手一生。", textEn: "Marriage needs careful management, less calculation and more dedication, more companionship and less perfunctoriness, respect each other and retain space to walk hand in hand for a lifetime." },
      { name: "冷战应对", nameEn: "Cold War Response", text: "冷战最伤感情，遇事及时沟通，不憋在心里、不互相冷战，主动示弱、主动和解，化解隔阂。", textEn: "Cold war hurts feelings the most, communicate in time when encountering problems, don't hold back or fight cold wars, take initiative to show vulnerability and reconcile to resolve estrangement." },
      { name: "桃花规避", nameEn: "Avoiding Temptation", text: "婚姻中需守住本心，远离暧昧、拒绝诱惑，多顾及对方感受，忠诚相待，方能守住幸福。", textEn: "Keep your original intention in marriage, stay away from ambiguity and resist temptation, care more about the other party's feelings, and treat each other loyally to keep happiness." },
      { name: "晚年相伴", nameEn: "Later Years Together", text: "中年磨合，晚年相依，少些争执、多些珍惜，互相照料、彼此扶持，方能安享晚年。", textEn: "Run-in in middle age, dependence in old age, less disputes and more cherishing, take care of each other and support each other to enjoy old age in peace." },
    ],
  },
  {
    calcType: 2, category: "事业", categoryEn: "Career",
    entries: [
      { name: "核心建议", nameEn: "Core Advice", text: "防小人是非，收敛锋芒、低调做事；深耕能力、把握贵人机会，稳步晋升、勿急功近利。", textEn: "Beware of villains and gossip; tone down edge and work quietly. Hone skills, seize benefactor opportunities, advance steadily—avoid quick gains." },
      { name: "职场人际", nameEn: "Workplace Relations", text: "职场中，多做事少抱怨，多包容少计较，尊重领导、团结同事，方能积累人脉、稳步前行。", textEn: "In the workplace, do more and complain less, tolerate more and care less, respect leaders and unite colleagues to accumulate contacts and progress steadily." },
      { name: "瓶颈突破", nameEn: "Breaking Bottlenecks", text: "事业遇瓶颈，勿急躁、不放弃，深耕自身能力，寻求贵人相助，灵活调整方向，必有转机。", textEn: "When encountering a career bottleneck, don't be impatient or give up, deepen your abilities, seek help from benefactors, adjust direction flexibly, and there will be a turning point." },
      { name: "贵人把握", nameEn: "Seizing Benefactor Help", text: "贵人是事业的助力，待人真诚、懂得感恩，把握每一次机会，谦逊低调，方能得贵人扶持。", textEn: "Benefactors are the driving force of career, treat others sincerely, know how to be grateful, seize every opportunity, be humble and low-key to get support from benefactors." },
      { name: "小人规避", nameEn: "Avoiding Villains", text: "职场小人难防，少谈是非、不议他人，收敛锋芒、不抢功劳，专注自身，方能规避麻烦。", textEn: "Workplace villains are hard to guard against, talk less about right and wrong, don't discuss others, tone down edge and don't take credit, focus on yourself to avoid troubles." },
      { name: "长远发展", nameEn: "Long-term Development", text: "立足长远，不贪一时之利，深耕主业、提升能力，稳步推进，方能成就一番事业。", textEn: "Focus on the long term, don't be greedy for temporary gains, deepen the main business, improve abilities, and advance steadily to achieve a career." },
    ],
  },
  {
    calcType: 3, category: "财运", categoryEn: "Wealth",
    entries: [
      { name: "核心建议", nameEn: "Core Advice", text: "忌盲目投资、防朋友耗财；量入为出、稳健理财，深耕主业、少贪偏财，财库自聚。", textEn: "Avoid reckless investments and financial drains from friends; live within means, invest conservatively. Focus on main income, avoid risky gains—wealth accumulates." },
      { name: "正财积累", nameEn: "Positive Income", text: "正财是立身之本，踏实工作、深耕主业，提升能力、增加收入，稳步积累，方能守住财库。", textEn: "Positive income is the foundation of life, work steadily, deepen the main business, improve abilities, increase income, and accumulate steadily to protect wealth." },
      { name: "偏财规避", nameEn: "Avoiding Windfall Risks", text: "偏财易赚也易亏，忌贪多冒进、盲目跟风，谨慎对待偏财机会，见好就收，方能避免破财。", textEn: "Windfall is easy to earn and lose, avoid greed and recklessness, follow the trend blindly, treat windfall opportunities cautiously, and take profits when good to avoid financial losses." },
      { name: "财库守护", nameEn: "Protecting Wealth", text: "量入为出、合理规划，不铺张浪费、不盲目消费，积少成多，方能让财库充盈、财运稳固。", textEn: "Live within means, plan reasonably, don't be extravagant and wasteful, don't spend blindly, accumulate little by little to make wealth reserve abundant and fortune stable." },
      { name: "耗财规避", nameEn: "Avoiding Financial Drains", text: "防朋友借贷、防盲目投资、防意外耗财，谨慎处理钱财往来，方能避免财库漏损。", textEn: "Beware of friend loans, reckless investments, and unexpected financial losses, handle financial transactions cautiously to avoid wealth leakage." },
      { name: "财运提升", nameEn: "Improving Fortune", text: "待人真诚、积累人脉，把握贵人送财机会，深耕自身能力，方能让财运持续提升。", textEn: "Treat others sincerely, accumulate contacts, seize the opportunity of benefactors sending wealth, deepen your abilities to continuously improve fortune." },
    ],
  },
  {
    calcType: 4, category: "具体一事", categoryEn: "Specific Question",
    entries: [
      { name: "核心建议", nameEn: "Core Advice", text: "此事成败在时机与心态，稳守本心、少焦虑多行动；遇波折不放弃、灵活调整，终能落地。", textEn: "Success hinges on timing and mindset. Stay true to goals, act more than worry; persist through twists, adapt flexibly—eventual realization." },
      { name: "时机把握", nameEn: "Seizing Timing", text: "时机未到，宜隐忍蓄力、耐心等待；时机成熟，宜果断行动、把握机会，方能事半功倍。", textEn: "When the time is not right, bide your time and build strength; when the time is ripe, act decisively and seize the opportunity to get twice the result with half the effort." },
      { name: "波折应对", nameEn: "Handling Setbacks", text: "凡事难免有波折，遇困难不急躁、不退缩，冷静分析、灵活应对，方能化解危机、达成目标。", textEn: "Twists and turns are inevitable in everything, don't be impatient or flinch when encountering difficulties, analyze calmly and adapt flexibly to resolve crises and achieve goals." },
      { name: "心态调整", nameEn: "Mindset Adjustment", text: "心态决定成败，少焦虑、多从容，不贪多、不急躁，脚踏实地、稳步推进，方能如愿以偿。", textEn: "Mindset determines success or failure, less anxiety and more calmness, not greedy or impetuous, down-to-earth and steady progress to get what you want." },
      { name: "贵人借助", nameEn: "Leveraging Benefactors", text: "遇困境，多寻求贵人相助，待人真诚、懂得感恩，借助他人力量，方能快速化解难题。", textEn: "When in difficulty, seek help from benefactors more, treat others sincerely, know how to be grateful, and use the strength of others to quickly resolve problems." },
      { name: "及时止损", nameEn: "Cutting Losses", text: "若此事阻力过大、毫无转机，宜及时止损、另寻方向，不固执己见、不盲目坚持，方能减少损失。", textEn: "If there is too much resistance and no turning point in this matter, it is advisable to cut losses in time and find another direction, not be stubborn or insist blindly to reduce losses." },
    ],
  },
  {
    calcType: 5, category: "健康", categoryEn: "Health",
    entries: [
      { name: "核心建议", nameEn: "Core Advice", text: "作息规律、少熬夜，情绪平和、少焦虑；注意对应脏腑养护，适度运动、定期检查，体健心安。", textEn: "Maintain regular sleep, avoid late nights; keep emotions balanced, reduce anxiety. Nourish affected organs, exercise moderately, check regularly—healthy body and mind." },
      { name: "作息调理", nameEn: "Sleep Regulation", text: "熬夜伤气血、损脏腑，早睡早起、规律作息，让身体得到充分休息，方能保持健康活力。", textEn: "Staying up late damages qi and blood and impairs internal organs, go to bed early and get up early, maintain regular work and rest, and let the body get sufficient rest to keep healthy and energetic." },
      { name: "情绪调节", nameEn: "Emotional Regulation", text: "情绪影响健康，少生气、少焦虑，保持平和心态，学会释放压力，方能气血通畅、身体健康。", textEn: "Emotions affect health, get angry and anxious less, keep a calm mindset, learn to release pressure to ensure smooth qi and blood and healthy body." },
      { name: "饮食调理", nameEn: "Dietary Adjustment", text: "饮食清淡、少油腻，均衡营养、不挑食，少吃生冷辛辣，规律饮食，方能养护脏腑、增强体质。", textEn: "Light diet, less greasy, balanced nutrition, not picky eaters, eat less cold and spicy food, regular diet to nourish internal organs and enhance physical fitness." },
      { name: "适度运动", nameEn: "Moderate Exercise", text: "适度运动能增强体质、促进气血循环，避免久坐不动，选择适合自己的运动方式，循序渐进。", textEn: "Moderate exercise can enhance physical fitness and promote blood circulation, avoid sitting for a long time, choose a suitable exercise method and proceed step by step." },
      { name: "疾病预防", nameEn: "Disease Prevention", text: "定期体检、早发现早治疗，注意保暖、避免受凉，根据季节变化调理身体，预防疾病发生。", textEn: "Regular physical examination, early detection and early treatment, keep warm and avoid catching cold, adjust the body according to seasonal changes to prevent diseases." },
    ],
  },
  {
    calcType: 6, category: "子女", categoryEn: "Children",
    entries: [
      { name: "核心建议", nameEn: "Core Advice", text: "多陪伴少施压，尊重天性、因材施教；注重品德培养，少溺爱多引导，子女懂事成才。", textEn: "Prioritize presence over pressure, respect their nature and teach accordingly. Focus on character, avoid overindulgence, guide wisely—children thrive." },
      { name: "陪伴教育", nameEn: "Companionship Education", text: "陪伴是最好的教育，多花时间陪伴子女，倾听他们的心声，理解他们的需求，建立良好的亲子关系。", textEn: "Companionship is the best education, spend more time with children, listen to their voices, understand their needs, and establish a good parent-child relationship." },
      { name: "因材施教", nameEn: "Teaching by Aptitude", text: "每个孩子都有自己的天赋和性格，尊重天性、不盲目攀比，因材施教、发掘潜能，让子女发挥所长。", textEn: "Every child has their own talents and personality, respect their nature, don't compare blindly, teach according to their aptitude, tap potential, and let children give play to their strengths." },
      { name: "品德培养", nameEn: "Character Building", text: "品德是立身之本，注重培养子女的诚信、善良、孝顺，以身作则、言传身教，让子女成为正直的人。", textEn: "Character is the foundation of life, focus on cultivating children's honesty, kindness and filial piety, set an example, teach by words and deeds, and let children become upright people." },
      { name: "避免溺爱", nameEn: "Avoiding Overindulgence", text: "溺爱会毁了子女，少包办、多放手，让子女学会独立、学会承担责任，方能成长成才。", textEn: "Spoiling will ruin children, do less for them, let go more, let children learn to be independent and take responsibility to grow into talents." },
      { name: "学业/事业引导", nameEn: "Study/Career Guidance", text: "尊重子女的选择，不强迫、不施压，给予鼓励和支持，引导他们树立正确的目标，稳步前行。", textEn: "Respect children's choices, don't force or put pressure, give encouragement and support, guide them to set correct goals and progress steadily." },
    ],
  },
];

// ===== 英耀核心心法 (12 items, opening/transition/closing) =====
export const YINYAO_PRINCIPLES = {
  opening: [
    { name: "基础版", nameEn: "Basic", text: "入门先观来意，出言先要拿心；先千后隆，察言观色，直击要害。", textEn: "Observe intent before speaking, capture heart with words; warn then affirm, read cues, strike core truths." },
    { name: "专业版", nameEn: "Professional", text: "卦象显真机，人心藏玄机；观其色、听其言、察其行，方知吉凶祸福。", textEn: "Hexagram reveals truth, human heart hides mystery; observe appearance, listen to words, watch actions to know good and bad fortune." },
    { name: "温和版", nameEn: "Gentle", text: "心诚则灵，卦准则明；我言直述，不夸大、不隐瞒，愿为你趋吉避凶。", textEn: "Sincerity leads to spirit, accurate hexagram leads to clarity; I speak frankly, not exaggerating or concealing, willing to help you seek good and avoid harm." },
    { name: "简洁版", nameEn: "Concise", text: "卦定吉凶，言明祸福；顺势而为，方能趋吉避凶、安稳前行。", textEn: "Hexagram determines good and bad, words clarify fortune and misfortune; act according to the trend to seek good and avoid harm and move forward steadily." },
  ],
  transition: [
    { name: "转折版", nameEn: "Turning Point", text: "虽有波折，非为大灾；只要心正、行正，终能化解困境、迎来转机。", textEn: "Although there are twists and turns, it is not a major disaster; as long as the heart is upright and actions are upright, difficulties can be resolved and a turning point will come." },
    { name: "安抚版", nameEn: "Comforting", text: "命由天定，运由人为；当下的困境，皆是未来的铺垫，不必焦虑、不必急躁。", textEn: "Fate is ordained, fortune is shaped by man; the current difficulties are all foreshadowing for the future, no need to be anxious or impetuous." },
    { name: "警示版", nameEn: "Warning", text: "吉者慎守，凶者慎避；凡事有度、不贪不躁，方能守住福泽、规避灾祸。", textEn: "Those who are lucky should guard carefully, those who are unlucky should avoid carefully; everything has a degree, not greedy or impetuous, to keep blessings and avoid disasters." },
    { name: "衔接版", nameEn: "Bridging", text: "卦象所示，皆为天机；结合自身，顺势而为，方能不负机缘、收获圆满。", textEn: "What the hexagram shows is all heavenly secrets; combine with yourself, act according to the trend to live up to the opportunity and achieve completeness." },
  ],
  closing: [
    { name: "基础版", nameEn: "Basic", text: "命由天定、运由人为，福祸无门、唯人自召；趋吉避凶，贵在知行合一。", textEn: "Fate is ordained, fortune is shaped by man; blessings and calamities have no gate—we invite them. Seek good and avoid harm, know and act as one." },
    { name: "励志版", nameEn: "Encouraging", text: "前半生磨，后半生稳；熬过困境、守住本心，终能苦尽甘来、福泽绵长。", textEn: "Tempered in the first half of life, stable in the second half; get through difficulties and keep the original intention, and eventually get through hardships to enjoy long blessings." },
    { name: "务实版", nameEn: "Pragmatic", text: "福在己身，祸在己心；行善积德、谨言慎行，方能守住平安、收获幸福。", textEn: "Fortune lies in oneself, misfortune lies in one's heart; do good and accumulate virtue, speak carefully and act prudently, to keep peace and harvest happiness." },
    { name: "哲思版", nameEn: "Philosophical", text: "天地有节，人事有度；顺应天时、把握人心，方能在变幻中立于不败之地。", textEn: "Heaven and earth have their rhythms, human affairs have their limits; follow the timing of heaven, grasp the human heart, to stand firm amid change." },
  ],
};

/** Builds a condensed reference string of hexagram scripts for the AI system prompt. */
export function buildScriptReference(lang: "zh" | "en", calcType: number): string {
  const lines: string[] = [];

  // General scripts (subset)
  lines.push(lang === "zh" ? "=== 卦象参考话术 ===" : "=== Hexagram Reference Scripts ===");
  for (const s of GENERAL_SCRIPTS) {
    lines.push(`[${lang === "zh" ? s.name : s.nameEn}] ${lang === "zh" ? s.text : s.textEn}`);
  }

  // Liuqin scripts (subset - most relevant ones)
  lines.push("");
  lines.push(lang === "zh" ? "=== 六亲专用话术 ===" : "=== Liu Qin Reference Scripts ===");
  for (const s of LIUQIN_SCRIPTS) {
    lines.push(`[${lang === "zh" ? s.name : s.nameEn}] ${lang === "zh" ? s.text : s.textEn}`);
  }

  // CalcType advice
  const advice = CALC_TYPE_ADVICE.find(a => a.calcType === calcType);
  if (advice) {
    lines.push("");
    lines.push(lang === "zh" ? `=== ${advice.category}专项建议 ===` : `=== ${advice.categoryEn} Advice ===`);
    for (const e of advice.entries) {
      lines.push(`[${lang === "zh" ? e.name : e.nameEn}] ${lang === "zh" ? e.text : e.textEn}`);
    }
  }

  // Principles
  lines.push("");
  lines.push(lang === "zh" ? "=== 英耀心法参考 ===" : "=== Ying Yao Principles ===");
  lines.push(lang === "zh" ? "【开篇】" : "[Opening]");
  for (const p of YINYAO_PRINCIPLES.opening) {
    lines.push(lang === "zh" ? p.text : p.textEn);
  }
  lines.push(lang === "zh" ? "【收尾】" : "[Closing]");
  for (const p of YINYAO_PRINCIPLES.closing) {
    lines.push(lang === "zh" ? p.text : p.textEn);
  }

  return lines.join("\n");
}
