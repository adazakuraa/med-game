// 市中肺炎（肺炎球菌性）
// 出典: 日本呼吸器学会『成人肺炎診療ガイドライン2024』, JAID/JSC感染症治療ガイド2023, 各薬剤添付文書
import { adrop, sepsisExtras } from './common.js';

export default {
  id: 'cap', name: '市中肺炎（肺炎球菌性）', dept: '内科',
  weight: 10, season: { winter: 1.5, summer: 0.7 }, minLevel: 1,
  demo: { age: [25, 92], ageMode: 'old', male: 0.55 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[22, 38], [42, 58], [64, 78]] },
  refractoryP: [0, 0.03, 0.15],
  comorb: { extra: { htn: 0.35, dm2: 0.2, ckd: 0.12, af: 0.08, constip: 0.15, dyslip: 0.2, bph: 0.15 } },
  organisms: ['spn'],
  minAbxDays: 5,
  vars: (rng) => ({ side: rng.pick(['右', '左']), days: rng.int(2, 5) }),
  cc: () => '発熱と咳',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{days}日前から熱と咳が出始めました。' },
    course: { p: 1, bySev: ['少しずつ悪くなっている気がします。', 'だんだんひどくなって、昨日からは食事もあまりとれません。', '昨日から急に息が苦しくなって、動けなくなりました。'] },
    character: { p: 1, text: '咳がひどくて、黄色っぽい痰が出ます。熱でだるいです。' },
    location: { p: 1, text: '咳と熱がつらいです。{side}の胸のあたりも少し痛い気がします。' },
    fever: { p: [0.85, 0.9, 0.95], texts: ['38度台の熱が続いています。', '昨日は39度まで上がりました。'] },
    chills: { p: [0.5, 0.6, 0.7], text: '熱が上がるときにガタガタ震えました。' },
    cough: { p: [0.95, 0.95, 0.9], text: 'はい、咳がよく出ます。' },
    sputum: { p: [0.7, 0.8, 0.8], texts: ['黄色い痰が出ます。', '錆びたような茶色っぽい痰が出ます。'] },
    dyspnea: { p: [0.3, 0.75, 0.97], bySev: ['階段を上ると少し息が切れます。', '少し動くだけで息が切れます。', 'じっとしていても息が苦しいです。'] },
    chestpain: { p: [0.3, 0.35, 0.4], text: '深呼吸や咳をすると{side}の胸がズキッと痛みます。' },
    aggravating: { p: 0.4, text: '咳をすると胸に響きます。' },
    anorexia: { p: [0.5, 0.7, 0.9], text: '食欲はほとんどありません。' },
    myalgia: { p: 0.35, text: '体がだるくて、節々も痛いです。' },
    nausea: { p: 0.1, text: '少し吐き気があります。' },
    sorethroat: { p: 0.25, text: '最初は喉が少し痛かったです。' },
    trigger: { p: 0.4, text: '最初は風邪だと思って市販薬を飲んでいました。' },
    sickcontact: { p: 0.15, text: '孫が少し前に風邪をひいていました。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['やや倦怠感があるが、会話は可能。', 'ぐったりしており、呼吸がやや速い。', '苦悶様顔貌で肩呼吸。会話は途切れがち。'] },
    chest_insp: { p: [0.2, 0.6, 1], bySev: ['呼吸はやや速い。', '頻呼吸あり。呼吸補助筋の使用は軽度。', '著明な頻呼吸。呼吸補助筋を使用している。'] },
    chest_palp: { p: 0.45, text: '{side}下肺野で声音振盪の増強。' },
    chest_perc: { p: [0.35, 0.5, 0.6], text: '{side}下肺野で濁音。' },
    lung_ausc: [
      { p: [0.8, 0.85, 0.9], text: '{side}下肺野でcoarse crackles（水泡音）を聴取。' },
      { p: 0.4, text: '同部位で気管支呼吸音化あり。' },
    ],
  },
  vitals: { T: { to: [38.8, 40.0], k: 0.45 }, HR: { to: [115, 135], k: 0.8 }, RR: { to: [30, 38], k: 1 }, SBP: { to: [70, 85], k: 2.2 }, SpO2: { drop: [17, 23], k: 1.4 } },
  labs: {
    WBC: { to: [17000, 26000], k: 0.6 }, NEUT: { to: [84, 92], k: 0.5 }, CRP: { to: [24, 35], k: 0.55 }, PCT: { to: [4, 20], k: 1.8 },
    BUN: { add: [12, 25], k: 1.5 }, CR: { add: [0.4, 1.2], k: 2.2 }, PLT: { mul: [0.45, 0.7], k: 2 }, LAC: { to: [3.5, 6.5], k: 2.5 },
    NA: { add: [-7, -3], k: 1.3 }, ALB: { add: [-1.2, -0.6], k: 1 }, AST: { add: [10, 40], k: 2, p: 0.5 }, DDIMER: { to: [2, 6], k: 1.5 },
    PT_INR: { add: [0.1, 0.4], k: 2.2 }, U_PRO: { ord: [2, 2], p: 0.4 },
  },
  tests: {
    cxr: [{ p: [0.85, 0.9, 0.95], text: '{side}下肺野に浸潤影（コンソリデーション）。エアブロンコグラムを伴う。' }, { p: [0.1, 0.2, 0.35], text: '{side}肋骨横隔膜角の鈍化（少量胸水）。' }],
    chest_ct: [{ p: [0.97, 0.98, 0.99], text: '{side}下葉に気管支透亮像を伴う浸潤影。' }, { p: [0.15, 0.25, 0.4], text: '{side}少量胸水。' }],
    sputum_gram: [{ p: [0.55, 0.6, 0.65], text: 'グラム陽性双球菌（莢膜を伴う）を多数認め、好中球による貪食像あり。Geckler分類5群。' }],
    sputum_cx: [{ p: [0.5, 0.55, 0.6], text: 'Streptococcus pneumoniae 3+。感受性: PCG S, CTRX S, LVFX S, EM R。' }],
    u_pneumo_ag: { p: [0.65, 0.72, 0.8] },
    bcx: [{ p: [0.05, 0.12, 0.25], text: '2セット中2セットからグラム陽性双球菌。同定: Streptococcus pneumoniae（PCG S, CTRX S）。' }],
  },
  ecg: [],
  natural: 0.5,
  therapies: [
    { id: 'abx', label: '肺炎球菌をカバーする抗菌薬', req: { coverage: ['spn'] }, effect: -1.3, lagH: 4, required: true, deadlineH: [8, 4, 1] },
    { id: 'o2', label: '酸素投与（SpO2<90%）', req: { o2: true }, when: (c) => c.rawSpO2 < 90, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'fluid', label: '初期輸液（敗血症性低血圧/高乳酸）', req: { fluidTotal: 1000 }, when: (c) => c.vit.SBP < 90 || c.lab('LAC') >= 4, required: true, deadlineH: [3, 3, 3], startFromNeed: true },
  ],
  dispo: (enc, ctx) => {
    const s = adrop(enc, ctx);
    if (s >= 4 || ctx.initVit.SBP < 90) return { ok: ['icu'], best: 'icu', why: `A-DROP ${s}点${ctx.initVit.SBP < 90 ? '・ショック' : ''}：ICU管理` };
    if (s === 3) return { ok: ['admit', 'icu'], best: 'admit', why: 'A-DROP 3点：入院治療' };
    if (s >= 1) return { ok: ['home', 'admit'], best: 'admit', why: `A-DROP ${s}点：外来または入院` };
    return { ok: ['home', 'admit'], best: 'home', why: 'A-DROP 0点：外来治療' };
  },
  useful: ['cbc', 'chem', 'crp', 'pct', 'vbg', 'cxr', 'chest_ct', 'sputum_gram', 'sputum_cx', 'u_pneumo_ag', 'u_legion_ag', 'bcx', 'flu_ag', 'covid_ag', 'ecg', 'lab_LAC', 'coag', 'ua'],
  key: [['cxr', 'chest_ct'], ['cbc'], ['chem']],
  extrasOk: sepsisExtras,
  consult: { resp: '呼吸器内科：画像は{side}下葉の肺炎像です。喀痰グラム染色・尿中抗原を確認のうえ、肺炎球菌を標的とした治療を。重症度はA-DROPで評価してください。' },
  teaching: [
    '市中肺炎の重症度はA-DROP（Age, Dehydration, Respiration, Orientation, Pressure）で評価し、外来・入院・ICUを判断する。',
    '喀痰グラム染色でグラム陽性双球菌（肺炎球菌）が見えれば、ペニシリン系やセフトリアキソンなど狭域〜中域での治療が可能。',
    '国内の肺炎球菌はマクロライド耐性率が高く、マクロライド単剤では治療失敗のリスクがある。',
    '敗血症性ショックを伴う場合は、抗菌薬を1時間以内に開始し、30mL/kgを目安とした初期輸液を行う。',
  ],
  sources: ['日本呼吸器学会 成人肺炎診療ガイドライン2024', 'JAID/JSC感染症治療ガイド2023', '日本版敗血症診療ガイドライン2024（J-SSCG2024）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'crp', 'cxr', 'sputum_gram', 'u_pneumo_ag', 'bcx', 'vbg'] },
    { a: 'o2', device: 'nc', flow: 3, when: 'spo2<92' },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev2' },
    { a: 'rx', drugId: 'ctrx', route: 'iv', dose: 2000, freq: 'q24h', days: 7 },
    { a: 'rx', drugId: 'norad', route: 'iv', dose: 0.1, freq: 'cont', days: 3, when: 'sbp<90' },
  ],
};
