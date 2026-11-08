// 薬剤データ（成人）。用量は各薬剤の添付文書（PMDA掲載）および国内ガイドラインを要約したもの。
// 本ゲームは教育・娯楽目的であり、実際の処方には必ず最新の添付文書を参照すること。
//
// routes[経路] = { unit, min, max, freqs, maxDaily }  min/max は1回量（持続投与は速度）
// covers: 抗菌スペクトラム（ゲーム内で使用する病原体キー）
//   spn=肺炎球菌, hinf=インフルエンザ菌, ecoli=感受性大腸菌, esbl=ESBL産生菌にも有効, anaerobe=嫌気性菌, atypical=非定型
// contra: 禁忌・慎重投与ルールID（engine/pharm.js で判定）
// interact: 相互作用（患者の常用薬タグと照合）
export const FREQS = {
  once: { label: '単回', perDay: 1 },
  q24h: { label: '1日1回', perDay: 1 },
  q12h: { label: '1日2回', perDay: 2 },
  q8h: { label: '1日3回', perDay: 3 },
  q6h: { label: '1日4回', perDay: 4 },
  q4h: { label: '1日6回', perDay: 6 },
  prn: { label: '頓用', perDay: 3 },
  cont: { label: '持続投与', perDay: 24 },
};

export const ROUTE_LABEL = { iv: '静注/点滴', po: '内服', im: '筋注', sl: '舌下/噴霧', sc: '皮下注', inh: '吸入' };

export const DRUGS = [
  // ===== 抗菌薬 =====
  {
    id: 'ctrx', generic: 'セフトリアキソン', brands: ['ロセフィン'], cls: '抗菌薬（第3世代セフェム）', allergy: 'cephem', abx: true,
    routes: { iv: { unit: 'mg', min: 1000, max: 2000, freqs: ['q24h', 'q12h'], maxDaily: 4000 } },
    covers: ['spn', 'hinf', 'ecoli', 'gpc'],
    interact: [{ tag: 'warfarin', level: 'warn', msg: 'ワルファリンの作用増強（PT-INR上昇）に注意' }],
    info: '通常1日1〜2gを1〜2回に分割して静注・点滴。重症では1日4gまで。腎機能による調節は通常不要。',
  },
  {
    id: 'abpc_sbt', generic: 'アンピシリン・スルバクタム', brands: ['ユナシン-S'], cls: '抗菌薬（β-ラクタマーゼ阻害薬配合ペニシリン）', allergy: 'penicillin', abx: true,
    routes: { iv: { unit: 'mg', min: 1500, max: 3000, freqs: ['q12h', 'q8h', 'q6h'], maxDaily: 12000 } },
    covers: ['spn', 'hinf', 'ecoli', 'anaerobe', 'gpc'], resistKey: 'sbtR',
    renal: [{ crclBelow: 30, maxDaily: 6000, text: 'CrCl 15〜29: 3g 12時間毎' }, { crclBelow: 15, maxDaily: 3000, text: 'CrCl <15: 3g 24時間毎' }],
    info: '肺炎では1回3gを1日4回まで（添付文書）。腎機能低下時は投与間隔を延長。国内の大腸菌は耐性率が高い点に注意。',
  },
  {
    id: 'cmz', generic: 'セフメタゾール', brands: ['セフメタゾン'], cls: '抗菌薬（セファマイシン系）', allergy: 'cephem', abx: true,
    routes: { iv: { unit: 'mg', min: 1000, max: 2000, freqs: ['q12h', 'q8h', 'q6h'], maxDaily: 4000 } },
    covers: ['ecoli', 'esbl', 'anaerobe'],
    renal: [{ crclBelow: 30, maxDaily: 2000, text: 'CrCl <30: 1g 12〜24時間毎' }],
    interact: [{ tag: 'alcohol', level: 'warn', msg: '飲酒でジスルフィラム様作用' }],
    info: '通常1日1〜2gを2回に分割。重症では1日4gまで2〜4回に分割。ESBL産生菌にも活性を示す。肺炎球菌への第一選択ではない。',
  },
  {
    id: 'mepm', generic: 'メロペネム', brands: ['メロペン'], cls: '抗菌薬（カルバペネム系）', allergy: 'carbapenem', abx: true, broad: true,
    routes: { iv: { unit: 'mg', min: 500, max: 1000, freqs: ['q12h', 'q8h'], maxDaily: 3000 } },
    covers: ['spn', 'hinf', 'ecoli', 'esbl', 'anaerobe', 'gpc'],
    renal: [{ crclBelow: 50, maxDaily: 2000, text: 'CrCl 26〜50: 1g 12時間毎' }, { crclBelow: 26, maxDaily: 1000, text: 'CrCl 10〜25: 0.5g 12時間毎' }],
    interact: [{ tag: 'valproate', level: 'harm', msg: 'バルプロ酸の血中濃度低下（併用禁忌）' }],
    info: '通常1日1.5〜3gを3回に分割。広域抗菌薬であり、狭域薬で治療可能な場合は温存すべき。',
  },
  {
    id: 'mnz_iv', generic: 'メトロニダゾール', brands: ['アネメトロ'], cls: '抗菌薬（ニトロイミダゾール系）', abx: true,
    routes: { iv: { unit: 'mg', min: 500, max: 500, freqs: ['q8h', 'q6h'], maxDaily: 2000 } },
    covers: ['anaerobe'],
    interact: [{ tag: 'warfarin', level: 'warn', msg: 'ワルファリンの作用を著明に増強' }, { tag: 'alcohol', level: 'warn', msg: '飲酒でジスルフィラム様作用' }],
    info: '1回500mgを1日3回、難治性・重症では1日4回まで点滴。嫌気性菌のみをカバーするため、腹腔内感染では他剤と併用。',
  },
  {
    id: 'lvfx', generic: 'レボフロキサシン', brands: ['クラビット'], cls: '抗菌薬（ニューキノロン系）', allergy: 'quinolone', abx: true,
    routes: { po: { unit: 'mg', min: 250, max: 500, freqs: ['q24h'], maxDaily: 500 }, iv: { unit: 'mg', min: 500, max: 500, freqs: ['q24h'], maxDaily: 500 } },
    covers: ['spn', 'hinf', 'ecoli', 'atypical'], resistKey: 'fqR',
    renal: [{ crclBelow: 50, maxDaily: 250, text: 'CrCl 20〜49: 初日500mg、以後250mg 1日1回' }, { crclBelow: 20, maxDaily: 125, text: 'CrCl <20: 初日500mg、以後250mg 2日に1回' }],
    contra: ['pregnancy', 'quinolone_child'],
    interact: [
      { tag: 'mgo', level: 'warn', msg: 'Mg・Al含有製剤で吸収低下（内服時は投与間隔をあける）', reduceRoute: 'po' },
      { tag: 'nsaid', level: 'warn', msg: 'NSAIDs併用で痙攣誘発のおそれ' },
      { tag: 'warfarin', level: 'warn', msg: 'ワルファリンの作用増強' },
    ],
    info: '1回500mgを1日1回。腎機能低下時は減量。妊婦には禁忌。結核を隠蔽しうる点にも注意。',
  },
  {
    id: 'ampc', generic: 'アモキシシリン', brands: ['サワシリン', 'パセトシン'], cls: '抗菌薬（ペニシリン系・経口）', allergy: 'penicillin', abx: true,
    routes: { po: { unit: 'mg', min: 250, max: 500, freqs: ['q8h', 'q6h'], maxDaily: 2000 } },
    covers: ['spn', 'hinf'],
    renal: [{ crclBelow: 30, maxDaily: 1000, text: 'CrCl <30: 投与間隔を12時間毎に延長' }],
    info: '通常1回250mgを1日3〜4回。肺炎球菌性肺炎の外来治療では高用量（1回500mg 1日3〜4回）が推奨される。',
  },
  {
    id: 'cex', generic: 'セファレキシン', brands: ['ケフレックス'], cls: '抗菌薬（第1世代セフェム・経口）', allergy: 'cephem', abx: true,
    routes: { po: { unit: 'mg', min: 250, max: 500, freqs: ['q6h', 'q8h'], maxDaily: 2000 } },
    covers: ['ecoli', 'gpc'],
    renal: [{ crclBelow: 30, maxDaily: 1000, text: 'CrCl <30: 投与間隔を延長（8〜12時間毎）' }],
    info: '通常1回250mgを6時間毎、重症例では1回500mgを6時間毎。感受性のある大腸菌による尿路感染症の経口治療に用いる。',
  },
  {
    id: 'azm', generic: 'アジスロマイシン', brands: ['ジスロマック'], cls: '抗菌薬（マクロライド系）', allergy: 'macrolide', abx: true,
    routes: { po: { unit: 'mg', min: 500, max: 500, freqs: ['q24h'], maxDaily: 500 } },
    covers: ['atypical'],
    interact: [{ tag: 'qt', level: 'warn', msg: 'QT延長作用のある薬剤との併用に注意' }],
    info: '1回500mgを1日1回、3日間。国内の肺炎球菌はマクロライド耐性率が高く、単独での肺炎球菌治療は不適。',
  },
  // ===== 解熱鎮痛・消化器 =====
  {
    id: 'apap_po', generic: 'アセトアミノフェン（内服）', brands: ['カロナール'], cls: '解熱鎮痛薬', tags: ['antipyretic', 'analgesic'],
    routes: { po: { unit: 'mg', min: 300, max: 1000, freqs: ['q6h', 'q8h', 'prn', 'once'], maxDaily: 4000 } },
    contra: ['severe_liver'], effectHours: 6,
    info: '1回300〜1000mg、投与間隔4〜6時間以上。1日総量4000mgまで。重篤な肝障害には禁忌。',
  },
  {
    id: 'apap_iv', generic: 'アセトアミノフェン（静注）', brands: ['アセリオ'], cls: '解熱鎮痛薬', tags: ['antipyretic', 'analgesic'],
    routes: { iv: { unit: 'mg', min: 300, max: 1000, freqs: ['q6h', 'prn', 'once'], maxDaily: 4000, weightMaxPerKgDaily: 60 } },
    contra: ['severe_liver'], effectHours: 6,
    info: '体重50kg以上: 1回1000mg、15分かけて静注、投与間隔4〜6時間以上。50kg未満: 1回15mg/kg、1日60mg/kgまで。',
  },
  {
    id: 'loxo', generic: 'ロキソプロフェン', brands: ['ロキソニン'], cls: '解熱鎮痛薬（NSAIDs）', allergy: 'nsaid', tags: ['antipyretic', 'analgesic', 'nsaid'],
    routes: { po: { unit: 'mg', min: 60, max: 60, freqs: ['q8h', 'prn', 'once'], maxDaily: 180 } },
    contra: ['pud', 'severe_renal', 'severe_hf', 'aspirin_asthma', 'late_pregnancy', 'dehydration_aki'], effectHours: 6,
    interact: [{ tag: 'warfarin', level: 'warn', msg: '出血リスク増大' }, { tag: 'quinolone', level: 'warn', msg: 'ニューキノロン併用で痙攣誘発のおそれ' }],
    info: '1回60mg 1日3回、頓用は1回60〜120mg。消化性潰瘍・重篤な腎障害・重篤な心機能不全・アスピリン喘息には禁忌。',
  },
  {
    id: 'mcp', generic: 'メトクロプラミド', brands: ['プリンペラン'], cls: '制吐薬', tags: ['antiemetic'],
    routes: { iv: { unit: 'mg', min: 10, max: 10, freqs: ['q12h', 'prn', 'once'], maxDaily: 20 }, po: { unit: 'mg', min: 5, max: 10, freqs: ['q8h', 'prn'], maxDaily: 30 } },
    contra: ['gi_obstruction'], effectHours: 8,
    info: '注射は1回10mgを1日1〜2回。消化管出血・穿孔・器質的閉塞、褐色細胞腫には禁忌。',
  },
  {
    id: 'scopolamine', generic: 'ブチルスコポラミン', brands: ['ブスコパン'], cls: '鎮痙薬（抗コリン）', tags: ['antispasmodic'],
    routes: { iv: { unit: 'mg', min: 10, max: 20, freqs: ['once', 'prn'], maxDaily: 60 } },
    contra: ['glaucoma', 'bph', 'severe_heart', 'paralytic_ileus'], effectHours: 4,
    info: '1回10〜20mgを静注・筋注。緑内障、前立腺肥大による排尿障害、重篤な心疾患、麻痺性イレウスには禁忌。',
  },
  // ===== 循環器 =====
  {
    id: 'furosemide_iv', generic: 'フロセミド（注）', brands: ['ラシックス'], cls: 'ループ利尿薬', tags: ['diuretic'],
    routes: { iv: { unit: 'mg', min: 10, max: 200, freqs: ['once', 'q12h', 'q24h'], maxDaily: 400 } },
    contra: ['dehydration_aki', 'hypok_severe'], effectHours: 6,
    info: '通常1回20mgを静注、適宜増減。慢性的に内服している患者や腎機能低下例では内服量以上（例: 内服量の1〜2.5倍）が必要になることが多い。低K血症に注意。',
  },
  {
    id: 'ntg', generic: 'ニトログリセリン（注）', brands: ['ミリスロール'], cls: '硝酸薬（血管拡張薬）', tags: ['nitrate'],
    routes: { iv: { unit: 'μg/kg/分', min: 0.5, max: 5, freqs: ['cont'] } },
    contra: ['sbp90', 'pde5'],
    info: '0.5〜5μg/kg/分で持続静注。収縮期血圧90mmHg未満、PDE5阻害薬（シルデナフィル等）使用中は禁忌。',
  },
  {
    id: 'ntg_spray', generic: 'ニトログリセリン（舌下スプレー）', brands: ['ミオコールスプレー'], cls: '硝酸薬（血管拡張薬）', tags: ['nitrate'],
    routes: { sl: { unit: 'mg', min: 0.3, max: 0.6, freqs: ['once', 'prn'], maxDaily: 3 } },
    contra: ['sbp90', 'pde5'], effectHours: 1,
    info: '1回0.3mg（1噴霧）を舌下に噴霧。効果不十分なら追加。収縮期血圧90mmHg未満、PDE5阻害薬使用中は禁忌。',
  },
  {
    id: 'carperitide', generic: 'カルペリチド', brands: ['ハンプ'], cls: '心房性ナトリウム利尿ペプチド', tags: ['vasodilator'],
    routes: { iv: { unit: 'μg/kg/分', min: 0.0125, max: 0.2, freqs: ['cont'] } },
    contra: ['sbp90', 'dehydration_aki'],
    info: '0.1μg/kg/分で持続静注（実臨床では0.0125〜0.05μg/kg/分の低用量で開始することが多い）。重篤な低血圧・心原性ショック・脱水には禁忌。',
  },
  {
    id: 'norad', generic: 'ノルアドレナリン', brands: ['ノルアドリナリン'], cls: '昇圧薬（カテコラミン）', tags: ['vasopressor'],
    routes: { iv: { unit: 'μg/kg/分', min: 0.02, max: 0.5, freqs: ['cont'] } },
    info: '0.05〜0.3μg/kg/分程度で持続静注（敗血症性ショックの第一選択昇圧薬）。十分な輸液を先行させること。',
  },
  {
    id: 'adrenaline', generic: 'アドレナリン', brands: ['アドレナリン注0.1%シリンジ', 'ボスミン'], cls: 'カテコラミン（アナフィラキシー治療）', tags: ['epinephrine'],
    routes: { im: { unit: 'mg', min: 0.3, max: 0.5, freqs: ['once'], maxDaily: 2 } },
    effectHours: 1,
    info: 'アナフィラキシーでは0.01mg/kg（成人最大0.5mg）を大腿前外側に筋注。効果不十分なら5〜15分毎に反復。',
  },
  {
    id: 'chlorphen', generic: 'd-クロルフェニラミン', brands: ['ポララミン'], cls: '抗ヒスタミン薬', tags: ['antihistamine'],
    routes: { iv: { unit: 'mg', min: 5, max: 5, freqs: ['once', 'q12h'], maxDaily: 10 } },
    contra: ['glaucoma', 'bph'], effectHours: 6,
    info: '1回5mgを静注。アナフィラキシーでは補助薬（第一選択はアドレナリン筋注）。',
  },
  {
    id: 'aspirin', generic: 'アスピリン', brands: ['バイアスピリン'], cls: '抗血小板薬', allergy: 'nsaid', tags: ['antiplatelet'],
    routes: { po: { unit: 'mg', min: 100, max: 330, freqs: ['once', 'q24h'], maxDaily: 330 } },
    contra: ['aspirin_asthma', 'pud'],
    info: '急性冠症候群では初回162〜330mgを噛み砕いて服用し、以後100mg 1日1回。アスピリン喘息・消化性潰瘍・出血傾向には禁忌。大動脈解離では禁忌。',
  },
  {
    id: 'prasugrel', generic: 'プラスグレル', brands: ['エフィエント'], cls: '抗血小板薬（P2Y12阻害薬）', tags: ['antiplatelet'],
    routes: { po: { unit: 'mg', min: 3.75, max: 20, freqs: ['once', 'q24h'], maxDaily: 20 } },
    info: 'PCIを行う急性冠症候群で、初回20mg、以後3.75mg 1日1回。アスピリンと併用（DAPT）。出血に注意。',
  },
  {
    id: 'heparin_bolus', generic: 'ヘパリン（静注ボーラス）', brands: ['ヘパリンNa注'], cls: '抗凝固薬', tags: ['anticoag_bolus'],
    routes: { iv: { unit: '単位', min: 3000, max: 10000, freqs: ['once'], maxDaily: 10000 } },
    effectHours: 2,
    info: '肺塞栓症では80単位/kg（目安5000単位）を静注し、続けて持続静注を開始する。出血傾向・大動脈解離には禁忌。',
  },
  {
    id: 'heparin', generic: 'ヘパリン（持続静注）', brands: ['ヘパリンNa注'], cls: '抗凝固薬', tags: ['anticoag'],
    routes: { iv: { unit: '単位/時', min: 400, max: 2500, freqs: ['cont'], perKg: [12, 20] } },
    info: '肺塞栓症では18単位/kg/時（12〜20単位/kg/時）で持続静注し、APTTで調節する。出血傾向・大動脈解離には禁忌。',
  },
  {
    id: 'morphine', generic: 'モルヒネ塩酸塩（注）', brands: ['モルヒネ塩酸塩注射液'], cls: '麻薬性鎮痛薬', tags: ['analgesic', 'opioid'],
    routes: { iv: { unit: 'mg', min: 2, max: 10, freqs: ['once', 'prn'], maxDaily: 30 } },
    contra: ['sbp90'], effectHours: 3,
    info: '強い痛みに少量ずつ静注（例：2〜4mg）。呼吸抑制・血圧低下・嘔気に注意。',
  },
  {
    id: 'nicardipine', generic: 'ニカルジピン（注）', brands: ['ペルジピン'], cls: 'Ca拮抗薬（降圧薬）', tags: ['bp_lower'],
    routes: { iv: { unit: 'μg/kg/分', min: 0.5, max: 6, freqs: ['cont'] } },
    contra: ['sbp90'],
    info: '高血圧緊急症に0.5〜6μg/kg/分で持続静注。大動脈解離ではβ遮断薬と併用して収縮期血圧100〜120mmHgを目標にする。',
  },
  {
    id: 'landiolol', generic: 'ランジオロール', brands: ['オノアクト'], cls: 'β遮断薬（短時間作用型）', tags: ['betablocker'],
    routes: { iv: { unit: 'μg/kg/分', min: 1, max: 10, freqs: ['cont'] } },
    contra: ['sbp90', 'cardiogenic', 'asthma_bb'],
    info: '頻脈の心拍数コントロールに1〜10μg/kg/分で持続静注（心機能低下例の頻脈性不整脈など）。大動脈解離では心拍数60/分前後を目標に用いられる。心原性ショック・高度徐脈には禁忌。',
  },
  {
    id: 'alteplase', generic: 'アルテプラーゼ（rt-PA）', brands: ['グルトパ', 'アクチバシン'], cls: '血栓溶解薬', tags: ['thrombolytic'],
    routes: { iv: { unit: 'mg', min: 20, max: 60, freqs: ['once'], maxDaily: 60, perKgOnce: [0.55, 0.65] } },
    contra: ['tpa_bp', 'tpa_anticoag', 'tpa_glucose'], effectHours: 1,
    info: '虚血性脳卒中（発症4.5時間以内）に0.6mg/kg（最大60mg）：10%を急速静注、残りを1時間で点滴。血圧185/110mmHg超、抗凝固薬内服中（INR>1.7など）、頭蓋内出血、低血糖・高血糖などは禁忌・慎重投与。',
  },
  {
    id: 'glucose50', generic: '50%ブドウ糖液', brands: ['大塚糖液50%'], cls: '糖補給', tags: ['dextrose_bolus'],
    routes: { iv: { unit: 'mL', min: 20, max: 60, freqs: ['once'], maxDaily: 200 } },
    effectHours: 1,
    info: '低血糖に20〜40mL（ブドウ糖10〜20g）を静注。スルホニル尿素薬による低血糖は再発しやすく、ブドウ糖の持続点滴と入院観察が必要。栄養不良・アルコール多飲ではビタミンB1を先に（Wernicke脳症の予防）。',
  },
  {
    id: 'thiamine', generic: 'チアミン（ビタミンB1）', brands: ['アリナミンF', 'メタボリン'], cls: 'ビタミン製剤', tags: ['thiamine'],
    routes: { iv: { unit: 'mg', min: 50, max: 500, freqs: ['once', 'q8h', 'q24h'], maxDaily: 1500 } },
    effectHours: 24,
    info: 'アルコール多飲・低栄養の意識障害では、ブドウ糖の前（または同時）に100mg以上を静注しWernicke脳症を予防する。',
  },
  {
    id: 'vcm', generic: 'バンコマイシン', brands: ['塩酸バンコマイシン'], cls: '抗菌薬（グリコペプチド系）', allergy: 'glycopeptide', abx: true, broad: true,
    routes: { iv: { unit: 'mg', min: 500, max: 2000, freqs: ['q12h', 'q8h'], maxDaily: 4000, perKgOnce: [12, 22] } },
    covers: ['prsp', 'mrsa', 'gpc'],
    renal: [{ crclBelow: 50, maxDaily: 1500, text: 'CrCl<50: 投与間隔を延長し、血中濃度（TDM）で調節' }],
    info: '1回15〜20mg/kgを12時間毎（重症は負荷投与）。腎障害に注意し、トラフ値（TDM）で調節。細菌性髄膜炎ではペニシリン耐性肺炎球菌（PRSP）をカバーするためセフトリアキソンと併用する。',
  },
  {
    id: 'abpc', generic: 'アンピシリン', brands: ['ビクシリン'], cls: '抗菌薬（ペニシリン系）', allergy: 'penicillin', abx: true,
    routes: { iv: { unit: 'mg', min: 1000, max: 2000, freqs: ['q6h', 'q4h'], maxDaily: 12000 } },
    covers: ['spn', 'listeria'], tags: ['listeria_cover'],
    renal: [{ crclBelow: 30, maxDaily: 6000, text: 'CrCl<30: 投与間隔を延長' }],
    info: '細菌性髄膜炎では1回2gを4時間毎。50歳以上・免疫不全ではリステリアをカバーするため追加する。',
  },
  {
    id: 'dexa', generic: 'デキサメタゾン', brands: ['デカドロン'], cls: '副腎皮質ステロイド', tags: ['steroid'],
    routes: { iv: { unit: 'mg', min: 3.3, max: 13.2, freqs: ['q6h', 'q12h', 'q24h', 'once'], maxDaily: 40 } },
    info: '細菌性髄膜炎では0.15mg/kgを6時間毎、2〜4日間。抗菌薬の直前または同時に開始する（後遺症・死亡の減少）。',
  },
  {
    id: 'sumatriptan', generic: 'スマトリプタン', brands: ['イミグラン'], cls: '片頭痛治療薬（トリプタン）', tags: ['triptan', 'analgesic'],
    routes: { sc: { unit: 'mg', min: 3, max: 3, freqs: ['once', 'prn'], maxDaily: 6 }, po: { unit: 'mg', min: 50, max: 100, freqs: ['once', 'prn'], maxDaily: 200 } },
    contra: ['coronary', 'tpa_bp'], effectHours: 6,
    info: '片頭痛発作に皮下注3mgまたは内服50mg。虚血性心疾患・脳血管障害・コントロール不良の高血圧には禁忌。',
  },
  {
    id: 'levetiracetam', generic: 'レベチラセタム', brands: ['イーケプラ'], cls: '抗てんかん薬', tags: ['antiepileptic'],
    routes: { iv: { unit: 'mg', min: 500, max: 1500, freqs: ['q12h', 'once'], maxDaily: 3000 } },
    renal: [{ crclBelow: 50, maxDaily: 1500, text: 'CrCl<50: 減量' }],
    info: '1回500〜1500mgを1日2回点滴。けいれんの再発予防に。',
  },
  {
    id: 'ppi', generic: 'オメプラゾール（注）', brands: ['オメプラール注用'], cls: 'プロトンポンプ阻害薬（PPI）', tags: ['ppi'],
    routes: { iv: { unit: 'mg', min: 20, max: 40, freqs: ['q12h', 'q24h'], maxDaily: 80 } },
    info: '出血性胃・十二指腸潰瘍に1回20mgを1日2回静注。内視鏡的止血の前後に使用し再出血を減らす。',
  },
  {
    id: 'cez', generic: 'セファゾリン', brands: ['セファメジンα'], cls: '抗菌薬（第1世代セフェム）', allergy: 'cephem', abx: true,
    routes: { iv: { unit: 'mg', min: 1000, max: 2000, freqs: ['q8h', 'q12h'], maxDaily: 6000 } },
    covers: ['gpc', 'ecoli'], resistKey: 'sbtR',
    renal: [{ crclBelow: 35, maxDaily: 2000, text: 'CrCl<35: 投与間隔を延長（1g 12〜24時間毎）' }],
    info: '蜂窩織炎（溶連菌・黄色ブドウ球菌）の点滴治療に1〜2g 8時間毎。',
  },
  {
    id: 'oseltamivir', generic: 'オセルタミビル', brands: ['タミフル'], cls: '抗インフルエンザ薬', tags: ['antiviral_flu'],
    routes: { po: { unit: 'mg', min: 75, max: 75, freqs: ['q12h', 'q24h'], maxDaily: 150 } },
    renal: [{ crclBelow: 30, maxDaily: 75, text: 'CrCl 10〜30: 75mg 1日1回' }],
    info: '成人は75mgを1日2回、5日間。発症48時間以内の開始で効果が大きい。高齢者・基礎疾患・入院例では積極的に使う。',
  },
  {
    id: 'salbutamol', generic: 'サルブタモール（吸入）', brands: ['ベネトリン吸入液', 'サルタノールインヘラー'], cls: '短時間作用性β2刺激薬（SABA）', tags: ['bronchodilator'],
    routes: { inh: { unit: 'mg', min: 1.5, max: 5, freqs: ['once', 'prn', 'q6h', 'q4h'], maxDaily: 30 } },
    effectHours: 4,
    info: '喘息発作・COPD増悪の第一選択。ネブライザーで1回2.5〜5mg（ベネトリン吸入液0.3〜0.5mL）、発作時は20〜30分ごとに反復。動悸・低K血症に注意。',
  },
  {
    id: 'prednisolone', generic: 'プレドニゾロン', brands: ['プレドニン'], cls: '副腎皮質ステロイド（内服）', tags: ['steroid_sys'],
    routes: { po: { unit: 'mg', min: 20, max: 60, freqs: ['q24h'], maxDaily: 60 } },
    info: 'COPD増悪・喘息発作に30〜40mg 1日1回、5日間程度。高血糖・不眠などに注意。',
  },
  {
    id: 'mpsl', generic: 'メチルプレドニゾロン', brands: ['ソル・メドロール'], cls: '副腎皮質ステロイド（注射）', tags: ['steroid_sys'],
    routes: { iv: { unit: 'mg', min: 40, max: 125, freqs: ['q24h', 'q12h', 'q6h', 'once'], maxDaily: 500 } },
    info: '内服できない喘息発作・COPD増悪に40〜125mgを静注。',
  },
  // ===== 代謝・電解質 =====
  {
    id: 'insulin_r', generic: '速効型インスリン（静注持続）', brands: ['ヒューマリンR'], cls: 'インスリン', tags: ['insulin'],
    routes: { iv: { unit: '単位/時', min: 0.5, max: 20, freqs: ['cont'] } },
    info: 'DKAでは0.1単位/kg/時で持続静注（ボーラス0.1単位/kgを先行する方法もある）。血清K<3.3mEq/Lではインスリンを開始せずK補充を優先。血糖250mg/dL未満でブドウ糖を含む輸液を追加。',
  },
  {
    id: 'kcl', generic: '塩化カリウム（補正用）', brands: ['KCL補正液'], cls: '電解質補正', tags: ['potassium'],
    routes: { iv: { unit: 'mEq/時', min: 2, max: 20, freqs: ['cont'] } },
    contra: ['hyperk'],
    info: '必ず希釈して点滴（濃度40mEq/L以下、速度20mEq/時以下、1日100mEqまで）。高K血症・乏尿には禁忌。',
  },
  {
    id: 'bicarb', generic: '炭酸水素ナトリウム', brands: ['メイロン静注8.4%'], cls: 'アルカリ化剤', tags: ['bicarbonate'],
    routes: { iv: { unit: 'mL', min: 20, max: 250, freqs: ['once'], maxDaily: 500 } },
    info: '代謝性アシドーシスに使用。DKAでは pH<6.9（ADA 2009。2024年コンセンサスでは pH<7.0）を除き、ルーチン投与は推奨されない。',
  },
];

export const DRUG_BY_ID = Object.fromEntries(DRUGS.map((d) => [d.id, d]));

// 輸液
export const FLUIDS = [
  { id: 'ns', name: '生理食塩液', brands: ['生理食塩液'], na: 154, k: 0, glucose: 0, vol: 1 },
  { id: 'lr', name: '乳酸リンゲル液', brands: ['ラクテック'], na: 130, k: 4, glucose: 0, vol: 1 },
  { id: 'd5w', name: '5%ブドウ糖液', brands: ['大塚糖液5%'], na: 0, k: 0, glucose: 50, vol: 0.3 },
  { id: 'rbc', name: '赤血球液（輸血）', brands: ['赤血球液-LR「日赤」'], na: 0, k: 0, glucose: 0, vol: 1, blood: true },
  { id: 'sol3', name: '3号維持液', brands: ['ソリタ-T3号'], na: 35, k: 20, glucose: 43, vol: 0.5 },
];
export const FLUID_BY_ID = Object.fromEntries(FLUIDS.map((f) => [f.id, f]));

export const O2_DEVICES = [
  { id: 'nc', name: '鼻カニュラ', flow: [1, 5] },
  { id: 'mask', name: '簡易酸素マスク', flow: [5, 10] },
  { id: 'reservoir', name: 'リザーバー付マスク', flow: [10, 15] },
  { id: 'nppv', name: 'NPPV（非侵襲的陽圧換気）', flow: [0, 0] },
];

// 患者の常用薬（相互作用・禁忌判定用のタグ付き）
export const HOME_MEDS = {
  amlodipine: { name: 'アムロジピン 5mg 1日1回', tags: [] },
  metformin: { name: 'メトホルミン 500mg 1日2回', tags: ['metformin'] },
  sitagliptin: { name: 'シタグリプチン 50mg 1日1回', tags: [] },
  glargine: { name: 'インスリン グラルギン 1日1回（就寝前）', tags: ['insulin_home'] },
  lispro: { name: 'インスリン リスプロ 毎食直前', tags: ['insulin_home'] },
  furosemide_po: { name: 'フロセミド 20mg 1日1回', tags: ['loop'] },
  carvedilol: { name: 'カルベジロール 2.5mg 1日2回', tags: ['bb'] },
  enalapril: { name: 'エナラプリル 5mg 1日1回', tags: ['acei'] },
  warfarin: { name: 'ワルファリン 2mg 1日1回', tags: ['warfarin'] },
  apixaban: { name: 'アピキサバン 5mg 1日2回', tags: ['doac'] },
  atorvastatin: { name: 'アトルバスタチン 10mg 1日1回', tags: [] },
  tamsulosin: { name: 'タムスロシン 0.2mg 1日1回', tags: [] },
  famotidine: { name: 'ファモチジン 20mg 1日2回', tags: [] },
  mgo: { name: '酸化マグネシウム 330mg 1日3回', tags: ['mgo'] },
  sildenafil: { name: 'シルデナフィル 50mg（性行為の前に時々）', tags: ['pde5'] },
  montelukast: { name: 'モンテルカスト 10mg 1日1回', tags: [] },
  latanoprost: { name: '点眼薬（緑内障）', tags: [] },
  valproate: { name: 'バルプロ酸 200mg 1日2回', tags: ['valproate'] },
  ocp: { name: '低用量ピル（避妊目的）', tags: ['ocp'] },
  ics: { name: 'ブデソニド・ホルモテロール吸入（シムビコート）', tags: ['ics'] },
  lama: { name: 'チオトロピウム吸入（スピリーバ）', tags: [] },
  nsaid_home: { name: 'ロキソプロフェン 60mg（腰痛で毎日）', tags: ['nsaid'] },
  glimepiride: { name: 'グリメピリド 2mg 1日1回（スルホニル尿素薬）', tags: ['su'] },
};
