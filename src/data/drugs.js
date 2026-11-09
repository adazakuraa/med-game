// 薬剤データ（成人）。用量は各薬剤の添付文書（PMDA掲載）および国内ガイドラインを要約したもの。
// 本ゲームは教育・娯楽目的であり、実際の処方には必ず最新の添付文書を参照すること。
//
// routes[経路] = { unit, min, max, freqs, maxDaily }  min/max は1回量（持続投与は速度）
// covers: 抗菌スペクトラム（ゲーム内で使用する病原体キー）
//   spn=肺炎球菌, hinf=インフルエンザ菌, ecoli=感受性大腸菌, esbl=ESBL産生菌にも有効, anaerobe=嫌気性菌, atypical=非定型
//   pseudo=緑膿菌, legionella=レジオネラ, tp=梅毒トレポネーマ, bordetella=百日咳菌
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

export const ROUTE_LABEL = { top: '外用', iv: '静注/点滴', po: '内服', im: '筋注', sl: '舌下/噴霧', sc: '皮下注', inh: '吸入' };

export const DRUGS = [
  // ===== 抗菌薬 =====
  {
    id: 'ctrx', generic: 'セフトリアキソン', brands: ['ロセフィン'], cls: '抗菌薬（第3世代セフェム）', allergy: 'cephem', abx: true,
    routes: { iv: { unit: 'mg', min: 1000, max: 2000, freqs: ['q24h', 'q12h'], maxDaily: 4000 } },
    covers: ['spn', 'hinf', 'ecoli', 'gpc', 'gc'],
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
    covers: ['spn', 'hinf', 'ecoli', 'esbl', 'anaerobe', 'gpc', 'pseudo'],
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
    id: 'lvfx', generic: 'レボフロキサシン', brands: ['クラビット'], cls: '抗菌薬（ニューキノロン系）', allergy: 'quinolone', abx: true, tags: ['fq'],
    routes: { po: { unit: 'mg', min: 250, max: 500, freqs: ['q24h'], maxDaily: 500 }, iv: { unit: 'mg', min: 500, max: 500, freqs: ['q24h'], maxDaily: 500 } },
    covers: ['spn', 'hinf', 'ecoli', 'atypical', 'chlamydia', 'legionella'], resistKey: 'fqR',
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
    covers: ['spn', 'hinf', 'gpc', 'tp'],
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
    id: 'amox_clav', generic: 'アモキシシリン・クラブラン酸', brands: ['オーグメンチン'], cls: '抗菌薬（β-ラクタマーゼ阻害薬配合ペニシリン・経口）', allergy: 'penicillin', abx: true,
    routes: { po: { unit: 'mg', min: 375, max: 375, freqs: ['q8h', 'q6h'], maxDaily: 1500 } },
    covers: ['spn', 'hinf', 'ecoli', 'anaerobe', 'gpc'], resistKey: 'sbtR',
    renal: [{ crclBelow: 30, maxDaily: 750, text: 'CrCl<30: 投与間隔を延長' }],
    info: '1錠375mg（アモキシシリン250mg＋クラブラン酸125mg）を1日3〜4回。嫌気性菌もカバーし、軽症の腹腔内感染・動物咬傷・副鼻腔炎などに。下痢に注意（国内ではアモキシシリンを追加して高用量にすることも）。',
  },
  {
    id: 'azm', generic: 'アジスロマイシン', brands: ['ジスロマック'], cls: '抗菌薬（マクロライド系）', allergy: 'macrolide', abx: true,
    routes: { po: { unit: 'mg', min: 500, max: 500, freqs: ['q24h'], maxDaily: 500 } },
    covers: ['atypical', 'chlamydia', 'legionella', 'bordetella'],
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
    covers: ['spn', 'listeria', 'gpc'], tags: ['listeria_cover'],
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
    id: 'atp', generic: 'ATP（アデノシン三リン酸）注', brands: ['アデホス-L'], cls: '抗不整脈薬（発作性上室頻拍の停止）', tags: ['svt_terminate'],
    routes: { iv: { unit: 'mg', min: 10, max: 20, freqs: ['once'], maxDaily: 40 } },
    contra: ['asthma_atp'], effectHours: 0.5,
    info: '発作性上室頻拍の停止に10mgを急速静注し、生理食塩水で後押しする（効かなければ20mg）。一時的な胸部不快感・顔面紅潮・数秒の心停止が起こることを事前に説明。気管支喘息には禁忌。',
  },
  {
    id: 'betahistine', generic: 'ベタヒスチン', brands: ['メリスロン'], cls: '抗めまい薬', tags: ['antivertigo'],
    routes: { po: { unit: 'mg', min: 6, max: 12, freqs: ['q8h'], maxDaily: 36 } },
    info: 'メニエール病・めまい症に1回6〜12mgを1日3回。',
  },
  {
    id: 'dienogest', generic: 'ジエノゲスト', brands: ['ディナゲスト'], cls: '子宮内膜症治療薬（黄体ホルモン）', tags: ['gyn_hormone'],
    routes: { po: { unit: 'mg', min: 1, max: 1, freqs: ['q12h'], maxDaily: 2 } },
    contra: ['pregnancy'],
    info: '子宮内膜症に1回1mgを1日2回、月経周期2〜5日目から。不正出血が多い。妊娠中は禁忌。',
  },
  {
    id: 'zoledronic', generic: 'ゾレドロン酸', brands: ['ゾメタ'], cls: '高カルシウム血症治療薬（ビスホスホネート）', tags: ['bisphosphonate'],
    routes: { iv: { unit: 'mg', min: 4, max: 4, freqs: ['once'], maxDaily: 4 } },
    renal: [{ crclBelow: 30, maxDaily: 0, text: '重度の腎機能障害では投与を避ける' }], effectHours: 400,
    info: '悪性腫瘍による高カルシウム血症に4mgを15分以上かけて点滴。効果は2〜4日で現れ、数週間続く。腎機能障害・顎骨壊死に注意。',
  },
  {
    id: 'elcatonin', generic: 'エルカトニン', brands: ['エルシトニン'], cls: '高カルシウム血症治療薬（カルシトニン）', tags: ['calcitonin'],
    routes: { im: { unit: '単位', min: 40, max: 40, freqs: ['q12h'], maxDaily: 80 } },
    info: '高カルシウム血症に1回40単位を1日2回筋注・点滴。数時間で効くが効果は弱く、数日で効かなくなる（ビスホスホネートが効くまでのつなぎ）。',
  },
  {
    id: 'sertraline', generic: 'セルトラリン', brands: ['ジェイゾロフト'], cls: '抗うつ薬（SSRI）', tags: ['ssri'],
    routes: { po: { unit: 'mg', min: 25, max: 100, freqs: ['q24h'], maxDaily: 100 } },
    info: 'うつ病・パニック症に25mgから開始し、100mgまで。効果は2〜4週後。開始直後の吐き気、若年者の賦活症候群（焦燥・希死念慮）に注意。',
  },
  {
    id: 'acotiamide', generic: 'アコチアミド', brands: ['アコファイド'], cls: '消化管運動改善薬', tags: ['prokinetic'],
    routes: { po: { unit: 'mg', min: 100, max: 100, freqs: ['q8h'], maxDaily: 300 } },
    info: '機能性ディスペプシアの食後膨満感・早期飽満感に1回100mgを1日3回食前。',
  },
  {
    id: 'kamishoyosan', generic: '加味逍遙散（漢方）', brands: ['ツムラ加味逍遙散'], cls: '漢方薬', tags: ['kampo_meno'],
    routes: { po: { unit: 'g', min: 2.5, max: 2.5, freqs: ['q8h'], maxDaily: 7.5 } },
    info: '更年期障害（ほてり・イライラ・不眠など）に1回2.5gを1日3回。',
  },
  {
    id: 'estradiol_gel', generic: 'エストラジオール（ゲル）', brands: ['ル・エストロジェル'], cls: 'ホルモン補充療法（エストロゲン）', tags: ['hrt'],
    routes: { top: { unit: 'プッシュ', min: 1, max: 2, freqs: ['q24h'], maxDaily: 2 } },
    contra: ['pregnancy'],
    info: '更年期障害に1日1〜2プッシュを腕に塗布。子宮がある人は黄体ホルモンを併用する（子宮体がん予防）。乳がん・血栓症・脳卒中の既往では禁忌。',
  },
  {
    id: 'hemorrhoid_oint', generic: '大腸菌死菌・ヒドロコルチゾン軟膏', brands: ['強力ポステリザン'], cls: '痔核治療薬（外用）', tags: ['hemorrhoid_topical'],
    routes: { top: { unit: 'g', min: 2, max: 2, freqs: ['q12h', 'q8h'], maxDaily: 6 } },
    info: '痔核の出血・痛みに1回約2gを1日2〜3回注入・塗布。便秘の改善（食物繊維・水分・緩下薬）とあわせて。',
  },
  {
    id: 'atorvastatin_rx', generic: 'アトルバスタチン', brands: ['リピトール'], cls: '脂質異常症治療薬（スタチン）', tags: ['statin'],
    routes: { po: { unit: 'mg', min: 5, max: 20, freqs: ['q24h'], maxDaily: 40 } },
    info: '脂質異常症・冠動脈疾患の二次予防に10mg 1日1回から。筋肉痛・CK上昇・肝障害に注意。',
  },
  {
    id: 'vcm_po', generic: 'バンコマイシン（内服）', brands: ['塩酸バンコマイシン散'], cls: '抗菌薬（C. difficile感染症）', tags: ['cdiff_tx'],
    routes: { po: { unit: 'mg', min: 125, max: 500, freqs: ['q6h'], maxDaily: 2000 } },
    info: 'C. difficile感染症に1回125mgを1日4回、10日間。内服では腸管からほとんど吸収されない（点滴では腸に届かない）。',
  },
  {
    id: 'clopidogrel', generic: 'クロピドグレル', brands: ['プラビックス'], cls: '抗血小板薬', tags: ['antiplatelet'],
    routes: { po: { unit: 'mg', min: 75, max: 300, freqs: ['once', 'q24h'], maxDaily: 300 } },
    info: '脳梗塞・TIAの再発予防に75mg 1日1回（急性期は初回300mg）。軽症脳梗塞・高リスクTIAではアスピリンと3週間程度併用（DAPT）。',
  },
  {
    id: 'mannitol', generic: 'D-マンニトール', brands: ['マンニットール'], cls: '浸透圧利尿薬', tags: ['osmotic'],
    routes: { iv: { unit: 'g/kg', min: 0.5, max: 1.5, freqs: ['once'], maxDaily: 2 } },
    info: '急性緑内障発作・脳浮腫に0.5〜1.5g/kgを30〜60分で点滴。心不全・脱水・腎不全に注意。',
  },
  {
    id: 'acetazolamide', generic: 'アセタゾラミド', brands: ['ダイアモックス'], cls: '炭酸脱水酵素阻害薬', tags: ['cai'],
    routes: { iv: { unit: 'mg', min: 250, max: 500, freqs: ['once', 'q12h'], maxDaily: 1000 } },
    info: '緑内障発作で眼圧を下げる（房水産生を抑える）。250〜500mgを静注。',
  },
  {
    id: 'pilocarpine', generic: 'ピロカルピン点眼', brands: ['サンピロ'], cls: '縮瞳薬（点眼）', tags: ['miotic'],
    routes: { top: { unit: '滴', min: 1, max: 1, freqs: ['once', 'q6h', 'q4h'], maxDaily: 6 } },
    info: '急性閉塞隅角緑内障で縮瞳させて隅角を開く。1%を1回1滴。',
  },
  {
    id: 'acyclovir', generic: 'アシクロビル（注）', brands: ['ゾビラックス'], cls: '抗ヘルペスウイルス薬', tags: ['antiviral_hsv', 'antiviral_hsv_iv'],
    routes: { iv: { unit: 'mg/kg', min: 5, max: 10, freqs: ['q8h'], maxDaily: 30 } },
    renal: [{ crclBelow: 50, maxDaily: 20, text: 'CrCl 25〜50: 10mg/kg 12時間毎' }, { crclBelow: 25, maxDaily: 10, text: 'CrCl 10〜25: 10mg/kg 24時間毎' }],
    info: '単純ヘルペス脳炎に10mg/kgを8時間毎に1時間以上かけて点滴、14〜21日間。疑った時点で開始する。腎障害（結晶尿）予防に十分な補液。',
  },
  {
    id: 'amiodarone', generic: 'アミオダロン（注）', brands: ['アンカロン'], cls: '抗不整脈薬', tags: ['antiarrhythmic'],
    routes: { iv: { unit: 'mg', min: 125, max: 300, freqs: ['once'], maxDaily: 1250 } },
    info: '血行動態が安定した心室頻拍に125mgを10分かけて静注し、持続投与へ。心停止（VF/無脈性VT）では300mg静注。低血圧・徐脈・QT延長に注意。',
  },
  {
    id: 'vasopressin_like', generic: 'テルリプレシン類（門脈圧低下薬）', brands: ['（国内ではバソプレシン等）'], cls: '門脈圧低下薬', tags: ['portal'],
    routes: { iv: { unit: '単位/分', min: 0.1, max: 0.4, freqs: ['cont'] } },
    contra: ['coronary'],
    info: '食道静脈瘤破裂で門脈圧を下げて出血を減らす。虚血性心疾患に注意。',
  },
  {
    id: 'limaprost', generic: 'リマプロスト', brands: ['オパルモン'], cls: '血管拡張薬（プロスタグランジンE1）', tags: ['lss_tx'],
    routes: { po: { unit: 'μg', min: 5, max: 5, freqs: ['q8h'], maxDaily: 15 } },
    info: '腰部脊柱管狭窄症の下肢のしびれ・間欠性跛行に1回5μgを1日3回。出血傾向に注意。',
  },
  {
    id: 'silodosin', generic: 'シロドシン', brands: ['ユリーフ'], cls: '前立腺肥大症治療薬（α1遮断薬）', tags: ['alpha1'],
    routes: { po: { unit: 'mg', min: 4, max: 4, freqs: ['q12h'], maxDaily: 8 } },
    info: '前立腺肥大症の排尿障害に1回4mgを1日2回。射精障害・起立性低血圧に注意。',
  },
  {
    id: 'relugolix', generic: 'レルゴリクス', brands: ['レルミナ'], cls: '子宮筋腫治療薬（GnRHアンタゴニスト）', tags: ['fibroid_tx'],
    routes: { po: { unit: 'mg', min: 40, max: 40, freqs: ['q24h'], maxDaily: 40 } },
    contra: ['pregnancy'],
    info: '子宮筋腫の過多月経・貧血・疼痛に40mg 1日1回（最長6か月：骨量減少）。更年期様症状に注意。',
  },
  {
    id: 'clotrimazole_vag', generic: 'クロトリマゾール腟錠', brands: ['エンペシド腟錠'], cls: '抗真菌薬（腟錠）', tags: ['antifungal_vag'],
    routes: { top: { unit: 'mg', min: 100, max: 100, freqs: ['q24h'], maxDaily: 100 } },
    info: '外陰腟カンジダ症に1日1回100mgを腟内に6日間。外陰部にはクリームを併用。',
  },
  {
    id: 'steroid_oint', generic: 'ベタメタゾン吉草酸エステル軟膏', brands: ['リンデロンV軟膏'], cls: 'ステロイド外用薬（strong）', tags: ['topical_steroid'],
    routes: { top: { unit: 'g', min: 0.5, max: 5, freqs: ['q12h', 'q24h'], maxDaily: 10 } },
    info: '湿疹・皮膚炎に1日1〜2回塗布。顔面・陰部は弱めのランクを。真菌感染・疥癬には悪化させるので使わない。',
  },
  {
    id: 'terbinafine_cream', generic: 'テルビナフィンクリーム', brands: ['ラミシールクリーム'], cls: '抗真菌薬（外用）', tags: ['topical_antifungal'],
    routes: { top: { unit: 'g', min: 0.5, max: 2, freqs: ['q24h'], maxDaily: 2 } },
    info: '足白癬に1日1回、症状がない部分も含めて足全体に塗る。治っても1〜2か月続ける。',
  },
  {
    id: 'ivermectin', generic: 'イベルメクチン', brands: ['ストロメクトール'], cls: '駆虫薬（疥癬）', tags: ['scabicide'],
    routes: { po: { unit: 'μg/kg', min: 200, max: 200, freqs: ['once'], maxDaily: 200 } }, effectHours: 336,
    info: '疥癬に約200μg/kgを空腹時に1回内服し、1週間後にもう1回。フェノトリンローションも有効。',
  },
  {
    id: 'eye_abx', generic: 'レボフロキサシン点眼', brands: ['クラビット点眼液'], cls: '抗菌点眼薬', tags: ['eye_abx'],
    routes: { top: { unit: '滴', min: 1, max: 1, freqs: ['q8h', 'q6h'], maxDaily: 4 } },
    info: '細菌性結膜炎に1回1滴を1日3回。',
  },
  {
    id: 'eye_antiallergy', generic: 'オロパタジン点眼', brands: ['パタノール点眼液'], cls: '抗アレルギー点眼薬', tags: ['eye_antiallergy'],
    routes: { top: { unit: '滴', min: 1, max: 2, freqs: ['q6h'], maxDaily: 8 } },
    info: 'アレルギー性結膜炎に1回1〜2滴を1日4回。',
  },
  {
    id: 'levodopa', generic: 'レボドパ・カルビドパ', brands: ['ネオドパストン', 'メネシット'], cls: '抗パーキンソン病薬', tags: ['levodopa'],
    routes: { po: { unit: 'mg', min: 100, max: 200, freqs: ['q8h'], maxDaily: 600 } },
    info: 'パーキンソン病に1回100mgを1日3回から。吐き気・起立性低血圧・幻覚、長期ではジスキネジア・wearing-offに注意。急な中止は悪性症候群の危険。',
  },
  {
    id: 'donepezil_rx', generic: 'ドネペジル', brands: ['アリセプト'], cls: '認知症治療薬（コリンエステラーゼ阻害薬）', tags: ['achei'],
    routes: { po: { unit: 'mg', min: 3, max: 10, freqs: ['q24h'], maxDaily: 10 } },
    info: 'アルツハイマー型認知症に3mgから開始し、1〜2週後に5mg。吐き気・下痢・徐脈に注意。',
  },
  {
    id: 'mecobalamin', generic: 'メコバラミン（注・内服）', brands: ['メチコバール'], cls: 'ビタミンB12製剤', tags: ['b12'],
    routes: { im: { unit: 'μg', min: 500, max: 1000, freqs: ['q24h', 'once'], maxDaily: 1000 }, po: { unit: 'μg', min: 500, max: 500, freqs: ['q8h'], maxDaily: 1500 } },
    info: 'ビタミンB12欠乏症に500〜1000μgを筋注（週3回など）、その後維持。胃切除後は吸収されないので注射が基本だが、大量内服でも補える。',
  },
  {
    id: 'dapagliflozin', generic: 'ダパグリフロジン', brands: ['フォシーガ'], cls: 'SGLT2阻害薬', tags: ['sglt2'],
    routes: { po: { unit: 'mg', min: 10, max: 10, freqs: ['q24h'], maxDaily: 10 } },
    info: '慢性腎臓病・心不全・2型糖尿病に10mg 1日1回。脱水・尿路/性器感染・正常血糖ケトアシドーシス（シックデイは休薬）に注意。',
  },
  {
    id: 'telmisartan', generic: 'テルミサルタン', brands: ['ミカルディス'], cls: '降圧薬（ARB）', tags: ['arb'],
    routes: { po: { unit: 'mg', min: 20, max: 80, freqs: ['q24h'], maxDaily: 80 } },
    contra: ['pregnancy', 'hyperk'],
    info: '高血圧・蛋白尿のある慢性腎臓病に20〜40mg 1日1回。開始後に腎機能とKを確認。妊婦には禁忌。',
  },
  {
    id: 'mesalazine', generic: 'メサラジン', brands: ['リアルダ', 'ペンタサ'], cls: '潰瘍性大腸炎治療薬（5-ASA）', tags: ['5asa'],
    routes: { po: { unit: 'mg', min: 2400, max: 4800, freqs: ['q24h'], maxDaily: 4800 } },
    info: '潰瘍性大腸炎の寛解導入・維持に2400〜4800mg 1日1回（リアルダ）。まれに5-ASA不耐（発熱・下痢の悪化）。',
  },
  {
    id: 'nac', generic: 'アセチルシステイン（内服液）', brands: ['アセチルシステイン内用液'], cls: '解毒薬（アセトアミノフェン中毒）', tags: ['nac'],
    routes: { po: { unit: 'mg/kg', min: 70, max: 140, freqs: ['q4h', 'once'], maxDaily: 560 } },
    info: 'アセトアミノフェン中毒に初回140mg/kg、以後70mg/kgを4時間毎に17回。服用後8時間以内の開始で肝障害を防げる（遅れても投与）。',
  },
  {
    id: 'carbamazepine', generic: 'カルバマゼピン', brands: ['テグレトール'], cls: '抗てんかん薬（三叉神経痛）', tags: ['tn_tx'],
    routes: { po: { unit: 'mg', min: 100, max: 400, freqs: ['q12h', 'q24h'], maxDaily: 800 } },
    info: '三叉神経痛に1日200〜400mgから。眠気・ふらつき・低Na血症、重症薬疹（HLA-A*31:01）・血球減少に注意。',
  },
  {
    id: 'mgso4', generic: '硫酸マグネシウム（注）', brands: ['マグセント'], cls: '子癇予防薬', tags: ['mgso4'],
    routes: { iv: { unit: 'g/時', min: 1, max: 2, freqs: ['cont'] } },
    info: '重症妊娠高血圧腎症で子癇（けいれん）を予防する。初回4gを20分かけて静注し、1〜2g/時で持続。呼吸抑制・腱反射消失（Mg中毒）に注意。',
  },
  {
    id: 'tetanus', generic: '破傷風トキソイド', brands: ['沈降破傷風トキソイド'], cls: 'ワクチン（破傷風予防）', tags: ['tetanus'],
    routes: { im: { unit: 'mL', min: 0.5, max: 0.5, freqs: ['once'], maxDaily: 0.5 } }, effectHours: 720,
    info: '汚染創・咬傷で、破傷風の予防接種歴が不明・10年以上前なら0.5mL筋注（深い汚染創で未接種なら破傷風免疫グロブリンも）。',
  },
  {
    id: 'ics_laba', generic: 'ブデソニド・ホルモテロール吸入', brands: ['シムビコート'], cls: '吸入ステロイド・長時間作用性β2刺激薬', tags: ['ics'],
    routes: { inh: { unit: '吸入', min: 1, max: 4, freqs: ['q12h'], maxDaily: 8 } },
    info: '喘息（咳喘息を含む）の長期管理に1回1〜2吸入を1日2回。吸入後はうがい（口腔カンジダ予防）。',
  },
  {
    id: 'mgo_rx', generic: '酸化マグネシウム', brands: ['マグミット'], cls: '緩下薬（浸透圧性）', tags: ['laxative'],
    routes: { po: { unit: 'mg', min: 330, max: 660, freqs: ['q8h', 'q12h'], maxDaily: 2000 } },
    info: '便秘に1日1〜2gを分割。腎機能低下・高齢者では高Mg血症に注意（定期的に血清Mg）。',
  },
  {
    id: 'mirabegron', generic: 'ミラベグロン', brands: ['ベタニス'], cls: '過活動膀胱治療薬（β3作動薬）', tags: ['beta3'],
    routes: { po: { unit: 'mg', min: 25, max: 50, freqs: ['q24h'], maxDaily: 50 } },
    info: '過活動膀胱に50mg 1日1回（高齢者・腎機能低下は25mg）。抗コリン薬と違い認知機能・口渇・便秘への影響が少ない。',
  },
  {
    id: 'heparinoid', generic: 'ヘパリン類似物質（保湿剤）', brands: ['ヒルドイド'], cls: '保湿剤', tags: ['emollient'],
    routes: { top: { unit: 'g', min: 1, max: 10, freqs: ['q12h', 'q24h'], maxDaily: 25 } },
    info: 'アトピー性皮膚炎・乾燥肌に1日1〜数回塗布。入浴後すぐに塗ると効果的。',
  },
  {
    id: 'alendronate', generic: 'アレンドロン酸', brands: ['フォサマック', 'ボナロン'], cls: '骨粗鬆症治療薬（ビスホスホネート）', tags: ['bisphosphonate_po'],
    routes: { po: { unit: 'mg', min: 35, max: 35, freqs: ['once'], maxDaily: 35 } }, effectHours: 168,
    info: '骨粗鬆症に週1回35mg。起床時に水180mLで内服し、30分は横にならず飲食しない（食道潰瘍予防）。顎骨壊死に注意（歯科治療前に相談）。',
  },
  {
    id: 'febuxostat', generic: 'フェブキソスタット', brands: ['フェブリク'], cls: '尿酸降下薬', tags: ['urate_lowering'],
    routes: { po: { unit: 'mg', min: 10, max: 60, freqs: ['q24h'], maxDaily: 60 } },
    info: '高尿酸血症・痛風に10mgから開始し、尿酸値を見ながら40mgまで増量（急に下げると痛風発作）。',
  },
  {
    id: 'cfpm', generic: 'セフェピム', brands: ['マキシピーム'], cls: '抗菌薬（第4世代セフェム・抗緑膿菌）', allergy: 'cephem', abx: true,
    routes: { iv: { unit: 'mg', min: 1000, max: 2000, freqs: ['q12h', 'q8h'], maxDaily: 6000 } },
    covers: ['spn', 'hinf', 'ecoli', 'gpc', 'pseudo'],
    renal: [{ crclBelow: 50, maxDaily: 4000, text: 'CrCl 30〜50: 2g 12時間毎' }, { crclBelow: 30, maxDaily: 2000, text: 'CrCl 10〜29: 2g 24時間毎（脳症に注意）' }],
    info: '発熱性好中球減少症・院内感染など緑膿菌をカバーしたいときに1回2gを8〜12時間毎。腎機能低下で減量しないと脳症（意識障害・けいれん）。',
  },
  {
    id: 'bpg', generic: 'ベンジルペニシリンベンザチン（筋注）', brands: ['ステルイズ'], cls: '抗菌薬（持続性ペニシリン）', allergy: 'penicillin', abx: true,
    routes: { im: { unit: '万単位', min: 240, max: 240, freqs: ['once'], maxDaily: 240 } }, effectHours: 336,
    covers: ['tp'],
    info: '早期梅毒に240万単位を1回筋注。治療後数時間で発熱などのJarisch-Herxheimer反応が起こることがある。',
  },
  {
    id: 'hydrocortisone', generic: 'ヒドロコルチゾン（注）', brands: ['ソル・コーテフ'], cls: '副腎皮質ステロイド', tags: ['hydrocortisone', 'steroid_sys'],
    routes: { iv: { unit: 'mg', min: 50, max: 100, freqs: ['once', 'q6h', 'q8h'], maxDaily: 300 } },
    info: '副腎クリーゼに100mgを静注し、以後50mgを6時間毎（または200mg/日持続）。甲状腺クリーゼ・敗血症性ショックでも使う。',
  },
  {
    id: 'kI', generic: 'ヨウ化カリウム', brands: ['ヨウ化カリウム丸'], cls: '抗甲状腺薬（無機ヨウ素）', tags: ['iodine'],
    routes: { po: { unit: 'mg', min: 50, max: 200, freqs: ['q24h', 'q8h'], maxDaily: 300 } },
    info: '甲状腺クリーゼで甲状腺ホルモンの放出を抑える。チアマゾールの投与後（1時間以上あけて）に開始する。',
  },
  {
    id: 'artemether', generic: 'アルテメテル・ルメファントリン', brands: ['リアメット'], cls: '抗マラリア薬', tags: ['antimalarial'],
    routes: { po: { unit: '錠', min: 4, max: 4, freqs: ['q12h'], maxDaily: 8 } },
    info: '合併症のない熱帯熱マラリアに1回4錠を3日間で計6回、食後に。重症マラリアはアーテスネート静注（国内では限られた施設）。',
  },
  {
    id: 'dantrolene', generic: 'ダントロレン（注）', brands: ['ダントリウム'], cls: '筋弛緩薬（悪性症候群・悪性高熱症）', tags: ['dantrolene'],
    routes: { iv: { unit: 'mg/kg', min: 1, max: 2.5, freqs: ['once', 'q6h'], maxDaily: 10 } },
    info: '悪性症候群・悪性高熱症に1〜2.5mg/kgを静注。肝障害に注意。',
  },
  {
    id: 'mtx', generic: 'メトトレキサート', brands: ['リウマトレックス'], cls: '抗リウマチ薬（csDMARD）', tags: ['dmard'],
    routes: { po: { unit: 'mg', min: 6, max: 16, freqs: ['once'], maxDaily: 16 } }, effectHours: 168,
    contra: ['pregnancy', 'severe_renal'],
    info: '関節リウマチの第一選択。週1回（1〜2日に分割）6〜8mgから。葉酸を併用。間質性肺炎・骨髄抑制・肝障害、腎機能低下で減量。妊娠中は禁忌。',
  },
  {
    id: 'hcq', generic: 'ヒドロキシクロロキン', brands: ['プラケニル'], cls: '抗マラリア薬（SLE治療）', tags: ['hcq'],
    routes: { po: { unit: 'mg', min: 200, max: 400, freqs: ['q24h'], maxDaily: 400 } },
    info: 'SLEの皮膚・関節症状や再燃予防に。網膜症に注意して定期的な眼科検査。',
  },
  {
    id: 'spironolactone', generic: 'スピロノラクトン', brands: ['アルダクトンA'], cls: 'ミネラルコルチコイド受容体拮抗薬', tags: ['mra'],
    contra: ['hyperk'],
    routes: { po: { unit: 'mg', min: 25, max: 100, freqs: ['q24h'], maxDaily: 100 } },
    info: '原発性アルドステロン症（片側性でなければ）・心不全・肝硬変の腹水に。高K血症・女性化乳房に注意。',
  },
  {
    id: 'ear_drop', generic: 'オフロキサシン点耳液', brands: ['タリビッド耳科用液'], cls: '抗菌点耳薬', tags: ['ear_abx'],
    routes: { top: { unit: '滴', min: 6, max: 10, freqs: ['q12h'], maxDaily: 20 } },
    info: '外耳炎・中耳炎（鼓膜穿孔）に1回6〜10滴を点耳し、約10分間耳浴。',
  },
  {
    id: 'eye_steroid', generic: 'ベタメタゾン点眼', brands: ['リンデロン点眼液'], cls: 'ステロイド点眼薬', tags: ['eye_steroid'],
    routes: { top: { unit: '滴', min: 1, max: 1, freqs: ['q6h', 'q4h'], maxDaily: 6 } },
    info: 'ぶどう膜炎などに。眼科医の管理下で使う（眼圧上昇・感染症の悪化・角膜ヘルペスの増悪に注意）。',
  },
  {
    id: 'vitd_oint', generic: 'カルシポトリオール・ベタメタゾン配合（外用）', brands: ['ドボベット'], cls: '尋常性乾癬治療薬（外用）', tags: ['psoriasis_topical', 'topical_steroid'],
    routes: { top: { unit: 'g', min: 1, max: 10, freqs: ['q24h'], maxDaily: 15 } },
    info: '尋常性乾癬に1日1回塗布。広範囲・大量使用で高Ca血症に注意。',
  },
  {
    id: 'ketoconazole_cream', generic: 'ケトコナゾールクリーム', brands: ['ニゾラールクリーム'], cls: '抗真菌薬（外用）', tags: ['topical_antifungal'],
    routes: { top: { unit: 'g', min: 0.5, max: 3, freqs: ['q24h', 'q12h'], maxDaily: 5 } },
    info: '脂漏性皮膚炎（マラセチア）・白癬に1日1〜2回塗布。',
  },
  {
    id: 'adapalene', generic: 'アダパレン・過酸化ベンゾイル配合ゲル', brands: ['エピデュオゲル'], cls: '尋常性ざ瘡治療薬（外用）', tags: ['acne_topical'],
    routes: { top: { unit: 'g', min: 0.5, max: 1, freqs: ['q24h'], maxDaily: 1 } },
    contra: ['pregnancy'],
    info: 'ニキビに1日1回就寝前に洗顔後、顔全体に塗布。乾燥・刺激感が最初の2週間に出やすい。妊婦には使わない。',
  },
  {
    id: 'olanzapine', generic: 'オランザピン', brands: ['ジプレキサ'], cls: '抗精神病薬（非定型）', tags: ['antipsychotic'],
    routes: { po: { unit: 'mg', min: 5, max: 20, freqs: ['q24h'], maxDaily: 20 } },
    contra: ['dm_olz'],
    info: '統合失調症・双極性障害の躁状態に5〜10mg 1日1回。糖尿病には禁忌（高血糖）。体重増加・眠気・まれに悪性症候群。',
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
    id: 'diltiazem', generic: 'ジルチアゼム（注）', brands: ['ヘルベッサー注射用'], cls: 'Ca拮抗薬（心拍数調節）', tags: ['rate_ccb'],
    routes: { iv: { unit: 'mg', min: 5, max: 15, freqs: ['once', 'prn'], maxDaily: 60 } },
    contra: ['sbp90', 'hfref'], effectHours: 4,
    info: '頻脈性心房細動の心拍数調節に10mg程度を3分かけて静注、必要なら持続静注へ。心機能低下（収縮不全）・低血圧には禁忌。',
  },
  {
    id: 'apixaban', generic: 'アピキサバン', brands: ['エリキュース'], cls: '抗凝固薬（DOAC）', tags: ['anticoag'],
    routes: { po: { unit: 'mg', min: 2.5, max: 10, freqs: ['q12h'], maxDaily: 20 } },
    renal: [{ crclBelow: 15, maxDaily: 0, text: 'CrCl<15: 禁忌' }],
    info: '心房細動の脳梗塞予防に5mg 1日2回（80歳以上・体重60kg以下・Cr1.5以上のうち2つ以上で2.5mg 1日2回）。深部静脈血栓症・肺塞栓症は10mg 1日2回を7日間、その後5mg 1日2回。出血に注意。',
  },
  {
    id: 'calcium', generic: 'グルコン酸カルシウム', brands: ['カルチコール注射液8.5%'], cls: '電解質補正（心筋保護）', tags: ['calcium'],
    routes: { iv: { unit: 'mL', min: 10, max: 30, freqs: ['once'], maxDaily: 60 } },
    effectHours: 1,
    info: '高K血症で心電図変化があるとき、心筋を保護するため10〜20mLを数分かけて静注（効果は30〜60分）。Kは下がらないので、インスリン＋ブドウ糖などと併用する。',
  },
  {
    id: 'insulin_bolus', generic: '速効型インスリン（静注・単回）', brands: ['ヒューマリンR'], cls: 'インスリン', tags: ['insulin', 'k_shift'],
    routes: { iv: { unit: '単位', min: 4, max: 10, freqs: ['once'], maxDaily: 20 } },
    effectHours: 4,
    info: '高K血症にKを細胞内へ移動させる目的で10単位を静注（ブドウ糖25gと併用：50%ブドウ糖50mL）。低血糖に注意し血糖を頻回に確認。',
  },
  {
    id: 'szc', generic: 'ジルコニウムシクロケイ酸ナトリウム', brands: ['ロケルマ'], cls: 'カリウム吸着薬', tags: ['k_binder'],
    routes: { po: { unit: 'g', min: 5, max: 10, freqs: ['q8h', 'q24h'], maxDaily: 30 } },
    info: '高K血症に1回10gを1日3回（最長3日間）、その後は維持量5g 1日1回。腸管でKを吸着して体外へ排泄する。',
  },
  {
    id: 'bisoprolol', generic: 'ビソプロロール', brands: ['メインテート'], cls: 'β遮断薬（内服）', tags: ['betablocker'],
    routes: { po: { unit: 'mg', min: 0.625, max: 5, freqs: ['q24h'], maxDaily: 5 } },
    contra: ['sbp90', 'asthma_bb'],
    info: '心房細動の心拍数調節に0.625〜5mg 1日1回。喘息・高度徐脈・低血圧には注意。',
  },
  {
    id: 'doxy', generic: 'ドキシサイクリン', brands: ['ビブラマイシン'], cls: '抗菌薬（テトラサイクリン系）', allergy: 'tetracycline', abx: true,
    routes: { po: { unit: 'mg', min: 100, max: 100, freqs: ['q12h', 'q24h'], maxDaily: 200 } },
    covers: ['chlamydia', 'atypical', 'tp'],
    contra: ['pregnancy'],
    interact: [{ tag: 'mgo', level: 'warn', msg: 'Mg・Al含有製剤で吸収低下', reduceRoute: 'po' }],
    info: '骨盤内炎症性疾患ではクラミジアをカバーするため100mg 1日2回14日間（セフトリアキソンと併用）。妊婦・8歳未満には禁忌。',
  },
  {
    id: 'atropine', generic: 'アトロピン硫酸塩', brands: ['アトロピン注'], cls: '抗コリン薬（徐脈治療）', tags: ['atropine'],
    routes: { iv: { unit: 'mg', min: 0.5, max: 1, freqs: ['once', 'prn'], maxDaily: 3 } },
    contra: ['glaucoma'], effectHours: 1,
    info: '症候性徐脈に0.5mgを静注、3〜5分ごとに反復（最大3mg）。完全房室ブロックでは効かないことが多く、ペーシングの準備を。',
  },
  {
    id: 'valacyclovir', generic: 'バラシクロビル', brands: ['バルトレックス'], cls: '抗ヘルペスウイルス薬', tags: ['antiviral_hsv'],
    routes: { po: { unit: 'mg', min: 500, max: 1000, freqs: ['q8h', 'q12h', 'q24h'], maxDaily: 3000 } },
    renal: [{ crclBelow: 50, maxDaily: 2000, text: 'CrCl 30〜49: 1000mg 12時間毎' }, { crclBelow: 30, maxDaily: 1000, text: 'CrCl 10〜29: 1000mg 24時間毎' }],
    info: '帯状疱疹に1000mg 1日3回7日間（発疹出現72時間以内が望ましい）。腎機能低下で減量しないと精神神経症状（せん妄など）を起こす。',
  },
  {
    id: 'colchicine', generic: 'コルヒチン', brands: ['コルヒチン錠'], cls: '痛風発作治療薬', tags: ['colchicine', 'analgesic'],
    routes: { po: { unit: 'mg', min: 0.5, max: 1, freqs: ['once', 'q12h', 'q24h'], maxDaily: 1.8 } },
    contra: ['severe_renal'],
    info: '痛風発作の前兆期〜初期に0.5mgを1回（必要に応じて追加、少量で）。腎・肝障害、CYP3A4阻害薬との併用に注意。',
  },
  {
    id: 'ferrous', generic: 'クエン酸第一鉄', brands: ['フェロミア'], cls: '鉄剤（経口）', tags: ['iron'],
    routes: { po: { unit: 'mg', min: 50, max: 100, freqs: ['q24h', 'q12h'], maxDaily: 200 } },
    info: '鉄欠乏性貧血に50〜100mg/日。悪心・便秘・黒色便が出る。原因（月経過多・消化管出血）の検索が必須。',
  },
  {
    id: 'levothyroxine', generic: 'レボチロキシン', brands: ['チラーヂンS'], cls: '甲状腺ホルモン薬', tags: ['thyroxine'],
    routes: { po: { unit: 'μg', min: 12.5, max: 100, freqs: ['q24h'], maxDaily: 200 } },
    info: '甲状腺機能低下症に少量（高齢者・心疾患では12.5〜25μg）から開始し、TSHを見ながら増量する。',
  },
  {
    id: 'thiamazole', generic: 'チアマゾール', brands: ['メルカゾール'], cls: '抗甲状腺薬', tags: ['antithyroid'],
    routes: { po: { unit: 'mg', min: 5, max: 30, freqs: ['q24h', 'q12h'], maxDaily: 30 } },
    contra: ['pregnancy'],
    info: 'バセドウ病に15mg/日（重症30mg）。無顆粒球症（発熱・咽頭痛で受診するよう説明）・肝障害に注意。妊娠初期は避ける。',
  },
  {
    id: 'vonoprazan', generic: 'ボノプラザン', brands: ['タケキャブ'], cls: '胃酸分泌抑制薬（P-CAB）', tags: ['ppi'],
    routes: { po: { unit: 'mg', min: 10, max: 20, freqs: ['q24h'], maxDaily: 20 } },
    info: '逆流性食道炎に20mg 1日1回4週間（維持は10mg）。胃・十二指腸潰瘍にも使う。',
  },
  {
    id: 'diazepam', generic: 'ジアゼパム', brands: ['セルシン', 'ホリゾン'], cls: 'ベンゾジアゼピン系', tags: ['benzo'],
    routes: { iv: { unit: 'mg', min: 5, max: 10, freqs: ['once', 'prn'], maxDaily: 40 }, po: { unit: 'mg', min: 2, max: 10, freqs: ['q8h', 'q6h', 'prn'], maxDaily: 40 } },
    contra: ['resp_failure'], effectHours: 8,
    info: 'アルコール離脱症候群の第一選択（症状に応じて投与：CIWA-Arに基づく）。けいれん重積には5〜10mgを緩徐に静注。呼吸抑制・過鎮静に注意（高齢者・肝障害では少量）。',
  },
  {
    id: 'amlodipine_rx', generic: 'アムロジピン', brands: ['アムロジン', 'ノルバスク'], cls: '降圧薬（Ca拮抗薬）', tags: ['antihtn'],
    routes: { po: { unit: 'mg', min: 2.5, max: 10, freqs: ['q24h'], maxDaily: 10 } },
    info: '高血圧に2.5〜5mg 1日1回から。下腿浮腫・歯肉増殖・頭痛に注意。',
  },
  {
    id: 'metformin_rx', generic: 'メトホルミン', brands: ['メトグルコ'], cls: '糖尿病治療薬（ビグアナイド）', tags: ['metformin_rx'],
    routes: { po: { unit: 'mg', min: 250, max: 1000, freqs: ['q12h', 'q8h'], maxDaily: 2250 } },
    contra: ['severe_renal', 'dehydration_aki'],
    renal: [{ crclBelow: 45, maxDaily: 1500, text: 'eGFR 30〜45: 最大1500mg/日（慎重投与）' }],
    info: '2型糖尿病の第一選択薬の一つ。500mg/日から開始。eGFR<30・脱水・ヨード造影剤の前後・大量飲酒では乳酸アシドーシスに注意（中止）。',
  },
  {
    id: 'fexofenadine', generic: 'フェキソフェナジン', brands: ['アレグラ'], cls: '抗ヒスタミン薬（第2世代）', tags: ['antihistamine'],
    routes: { po: { unit: 'mg', min: 60, max: 60, freqs: ['q12h'], maxDaily: 120 } },
    info: 'アレルギー性鼻炎・じんましんに60mg 1日2回。眠気が少ない第2世代。',
  },
  {
    id: 'lactulose', generic: 'ラクツロース', brands: ['モニラック'], cls: '肝性脳症治療薬・下剤', tags: ['lactulose'],
    routes: { po: { unit: 'mL', min: 10, max: 30, freqs: ['q8h', 'q12h'], maxDaily: 90 } },
    info: '肝性脳症に1回10〜30mLを1日2〜3回。1日2〜3回の軟便を目標に調整し、腸管でのアンモニア産生・吸収を減らす。',
  },
  {
    id: 'flumazenil', generic: 'フルマゼニル', brands: ['アネキセート'], cls: 'ベンゾジアゼピン拮抗薬', tags: ['flumazenil'],
    routes: { iv: { unit: 'mg', min: 0.2, max: 1, freqs: ['once', 'prn'], maxDaily: 2 } },
    contra: ['seizure_risk'], effectHours: 1,
    info: 'ベンゾジアゼピンによる呼吸抑制に0.2mgずつ静注。作用時間が短く再鎮静に注意。ベンゾジアゼピン常用者・三環系抗うつ薬併用・けいれんの既往ではけいれんを誘発するため原則使わない。',
  },
  {
    id: 'charcoal', generic: '活性炭', brands: ['薬用炭'], cls: '吸着剤（中毒）', tags: ['charcoal'],
    routes: { po: { unit: 'g', min: 25, max: 50, freqs: ['once'], maxDaily: 100 } },
    info: '服薬から1時間以内で、吸着される薬物の中毒に50g程度。意識障害で誤嚥のリスクがある場合は気道確保が前提。ルーチンには行わない。',
  },
  {
    id: 'trimebutine', generic: 'トリメブチン', brands: ['セレキノン'], cls: '消化管運動調整薬', tags: ['ibs'],
    routes: { po: { unit: 'mg', min: 100, max: 200, freqs: ['q8h'], maxDaily: 600 } },
    info: '過敏性腸症候群に1回100〜200mgを1日3回。',
  },
  {
    id: 'clinda', generic: 'クリンダマイシン', brands: ['ダラシンS'], cls: '抗菌薬（リンコマイシン系）', allergy: 'lincosamide', abx: true,
    routes: { iv: { unit: 'mg', min: 600, max: 900, freqs: ['q8h'], maxDaily: 2700 } },
    covers: ['gpc', 'anaerobe'], tags: ['toxin_suppress'],
    info: '壊死性筋膜炎（A群溶連菌）では毒素産生を抑えるため、ペニシリン系などと併用して600〜900mgを8時間毎。C. difficile腸炎に注意。',
  },
  {
    id: 'kcl_po', generic: '塩化カリウム（内服）', brands: ['スローケー'], cls: '電解質補正', tags: ['potassium_po'],
    routes: { po: { unit: 'mg', min: 600, max: 1200, freqs: ['q8h', 'q12h'], maxDaily: 3600 } },
    contra: ['hyperk'],
    info: '低K血症に1回600〜1200mg（K 8〜16mEq）を1日2〜3回。消化管の刺激に注意。',
  },
  {
    id: 'lemborexant', generic: 'レンボレキサント', brands: ['デエビゴ'], cls: '睡眠薬（オレキシン受容体拮抗薬）', tags: ['hypnotic'],
    routes: { po: { unit: 'mg', min: 2.5, max: 10, freqs: ['q24h'], maxDaily: 10 } },
    info: '不眠症に5mg（高齢者・肝障害は2.5mg〜）を就寝直前に。ベンゾジアゼピン系より転倒・依存のリスクが少ないとされる。',
  },
  {
    id: 'brotizolam', generic: 'ブロチゾラム', brands: ['レンドルミン'], cls: '睡眠薬（ベンゾジアゼピン系）', tags: ['benzo', 'hypnotic'],
    routes: { po: { unit: 'mg', min: 0.125, max: 0.25, freqs: ['q24h'], maxDaily: 0.25 } },
    contra: ['elderly_benzo'],
    info: '0.25mgを就寝前。高齢者では転倒・骨折・せん妄・依存のリスクが高く、できるだけ避ける（Beers基準・高齢者の安全な薬物療法ガイドライン）。',
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
  { id: 'd5w', name: '5%ブドウ糖液', brands: ['大塚糖液5%'], na: 0, k: 0, glucose: 50, vol: 0.6 },
  { id: 'ns3', name: '3%食塩水', brands: ['10%食塩水を生理食塩液で希釈'], na: 513, k: 0, glucose: 0, vol: 1 },
  { id: 'rbc', name: '赤血球液（輸血）', brands: ['赤血球液-LR「日赤」'], na: 0, k: 0, glucose: 0, vol: 1, blood: true },
  { id: 'sol3', name: '3号維持液', brands: ['ソリタ-T3号'], na: 35, k: 20, glucose: 43, vol: 0.9 },
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
  thiazide: { name: 'トリクロルメチアジド 2mg 1日1回（サイアザイド系利尿薬）', tags: ['thiazide'] },
  donepezil: { name: 'ドネペジル 5mg 1日1回（認知症）', tags: [] },
  antichol: { name: '市販の総合感冒薬（抗コリン成分を含む）', tags: ['anticholinergic'] },
  benzo_home: { name: 'ブロチゾラム 0.25mg 就寝前（睡眠薬）', tags: ['benzo_home'] },
  aspirin_home: { name: 'アスピリン 100mg 1日1回（抗血小板薬）', tags: ['antiplatelet_home'] },
  doxazosin: { name: 'ドキサゾシン 2mg 1日1回（α遮断薬・最近開始）', tags: ['alpha_blocker'] },
  glimepiride: { name: 'グリメピリド 2mg 1日1回（スルホニル尿素薬）', tags: ['su'] },
};
