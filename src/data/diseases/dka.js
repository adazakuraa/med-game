// 糖尿病性ケトアシドーシス（1型糖尿病・インスリン中断）
// 出典: 日本糖尿病学会『糖尿病診療ガイドライン2024』, ADA Hyperglycemic Crises in Adults with Diabetes (Consensus Report 2024), 各薬剤添付文書
export default {
  id: 'dka', name: '糖尿病性ケトアシドーシス', dept: '内科',
  weight: 4, season: {}, minLevel: 2,
  demo: { age: [16, 45], ageMode: 'young', male: 0.5 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[28, 36], [42, 56], [64, 76]] },
  refractoryP: [0, 0, 0.03],
  comorb: { forced: ['t1dm'], extra: {} },
  organisms: [],
  vars: (rng) => {
    const trigger = rng.chance(0.65) ? 'omission' : 'infection';
    return {
      trigger, dmYears: rng.int(2, 15), days: rng.int(1, 3),
      triggerText: trigger === 'omission' ? '食欲がなくてご飯を食べていなかったので、インスリンを打っていませんでした。' : '数日前から風邪気味で、食事がとれずインスリンも減らしていました。',
    };
  },
  cc: () => '嘔吐と倦怠感',
  ccKey: 'vomit_malaise',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  initVolume: [[2500, 3500], [3500, 5000], [4500, 6500]],
  initGlu: [[300, 450], [400, 600], [500, 800]],
  history: {
    onset: { p: 1, text: '{days}日前から吐き気があって、昨日から何度も吐いています。' },
    course: { p: 1, bySev: ['だるさがだんだん強くなっています。', 'どんどんだるくなって、息も苦しい感じがします。', '朝から意識がぼんやりしていると家族に言われました。'] },
    character: { p: 1, text: '体がとにかくだるくて、吐き気が止まりません。' },
    polyuria: { p: 0.95, text: 'この数日、とても喉が渇いて水をたくさん飲み、トイレも頻繁です。' },
    nausea: { p: 0.9, text: '何度も吐いています。' },
    abdpain: { p: 0.6, text: 'お腹全体が痛いです。' },
    location: { p: 1, text: 'お腹全体が痛くて、全身がだるいです。' },
    dyspnea: { p: [0.2, 0.45, 0.7], text: '深く息をしないと苦しい感じがします。' },
    weightloss: { p: 0.5, text: 'この1週間で2〜3kg減りました。' },
    anorexia: { p: 0.9, text: '食欲は全くありません。' },
    fever: { p: 0.15, text: '少し熱っぽいです。' },
    sorethroat: { p: 0.2, text: '数日前に喉が痛かったです。' },
    trigger: { p: 0.9, text: '{triggerText}' },
    adherence: { p: 1, text: '{triggerText}' },
    dizziness: { p: 0.5, text: '立つとふらふらします。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['倦怠感が強い様子。', 'ぐったりして、深く速い呼吸をしている。', '傾眠傾向で、深く大きな呼吸をしている。'] },
    gen_breath_odor: { p: 0.75, text: '呼気に甘酸っぱい果物様の臭い（アセトン臭）。' },
    chest_insp: { p: [0.4, 0.8, 0.97], text: '深く速い呼吸（Kussmaul呼吸）。' },
    abd_palp: { p: 0.5, text: '腹部全体に軽度の圧痛。反跳痛・筋性防御なし。' },
  },
  vitals: { RR: { to: [28, 36], k: 1 }, HR: { to: [95, 105], k: 1 }, T: { to: [36.6, 37.4], k: 1 } },
  labs: {
    WBC: { to: [16000, 26000], k: 0.7 }, NEUT: { to: [80, 90], k: 0.7 }, AMY: { add: [30, 150], k: 1, p: 0.4 },
    BHB: { to: [5500, 9000], k: 0.25 }, K: { add: [1.0, 1.6], k: 1 }, CL: { add: [-8, -4], k: 1 }, LAC: { to: [2.0, 3.5], k: 1.5 },
    CRP: { to: [0.3, 1.5], k: 1 }, HBA1C: { add: [0, 0], k: 1 },
    U_PRO: { ord: [1, 2], p: 0.4 },
  },
  hco3Fn: (b) => 24 - 0.25 * b,
  pco2Extra: [2, 6],
  tests: {
    abd_us: [{ p: 0.3, text: '腸管ガス多め。下大静脈は虚脱。その他明らかな異常なし。' }],
    abd_ct_plain: [{ p: 0.2, text: '明らかな異常所見なし。' }],
    cxr: [],
  },
  natural: 0.8,
  fluidLoss: (b, eff, enc) => (enc.state.glu > 250 ? 160 : 40),
  canDrink: () => false,
  therapies: [
    { id: 'fluid', label: '初期輸液（細胞外液の大量補液）', req: { fluidTotal: 1000 }, required: true, deadlineH: [2, 1, 1] },
    { id: 'insulin', label: 'インスリン持続静注', req: { tag: 'insulin', min: 0.5 }, required: true, deadlineH: [4, 3, 2] },
    { id: 'potassium', label: 'カリウム補充（K<5.0で開始）', req: { anyTag: ['potassium'], orFluidK: true }, when: (c) => c.lab('K') < 5.0 && c.eff.tags.insulin > 0, required: true, deadlineH: [2, 2, 2], startFromNeed: true },
    { id: 'dextrose', label: 'ブドウ糖を含む輸液（血糖<250）', req: { dextrose: true }, when: (c) => c.state.glu < 250 && c.eff.tags.insulin > 0, required: true, deadlineH: [2, 2, 2], startFromNeed: true },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state;
    let d = 0;
    const ins = eff.tags.insulin || 0;
    if (ins > 0) d -= 5.0 * Math.min(ins, 1.2) * (st.volume > 3000 ? 0.5 : 1);
    return d;
  },
  gluSetpointDrift: 15,
  kNoRegulate: true, // 未治療時の血糖上昇（mg/dL/時）
  harmTags: { bicarbonate: 'DKAでの重炭酸投与は pH<6.9（ADA 2009。2024年コンセンサスでは pH<7.0）以外では推奨されない（低K血症・脳浮腫のリスク）' },
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['admit', 'icu'], best: 'admit', why: '軽症DKA：入院でインスリン持続静注' } : { ok: ['icu'], best: 'icu', why: '中等症以上のDKA：ICU/HCUで頻回モニタリング' }),
  useful: ['cbc', 'chem', 'vbg', 'bhb', 'ua', 'hba1c', 'ecg', 'crp', 'cxr', 'uhcg', 'lab_K', 'lab_GLU', 'lab_NA', 'lab_CR', 'lab_BUN', 'amy', 'lab_AMY', 'bcx', 'ucx'],
  key: [['vbg'], ['chem'], ['ua', 'bhb'], ['ecg']],
  extrasOk: (enc, ctx) => {
    const out = ['dehydration'];
    if (ctx.initLab('CR') >= enc.patient.crBase * 1.5) out.push('aki');
    if (ctx.initLab('K') > 5.5) out.push('hyperk');
    return out;
  },
  consult: { endo: '内分泌代謝内科：血液ガスと尿ケトンからDKAとして矛盾しません。細胞外液の大量輸液、インスリン0.1単位/kg/時の持続静注、K<5.0でK補充、血糖250未満でブドウ糖を追加してください。誘因検索も。' },
  teaching: [
    'DKAは「高血糖・ケトーシス・アニオンギャップ開大性代謝性アシドーシス」の3徴。血液ガスと電解質でAGを計算する。',
    '治療の柱は ①大量輸液 ②インスリン持続静注 ③K補充。血清Kが正常〜高値でも体内総Kは欠乏しており、インスリン投与でKは急低下する。',
    'K<3.3mEq/Lではインスリンを開始せずK補充を優先する（致死的不整脈の予防）。',
    '血糖が250mg/dL未満になったらブドウ糖を含む輸液を追加し、アシドーシスが改善するまでインスリンを継続する。',
    '重炭酸投与は原則不要。誘因（インスリン中断・感染症など）を必ず確認する。',
  ],
  sources: ['日本糖尿病学会 糖尿病診療ガイドライン2024', 'ADA Hyperglycemic Crises in Adults with Diabetes: A Consensus Report (2024)', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['vbg', 'chem', 'cbc', 'ua', 'ecg'] },
    { a: 'fluid', fluidId: 'ns', mode: 'bolus', volume: 1000 },
    { a: 'fluid', fluidId: 'ns', mode: 'cont', rate: 250 },
    { a: 'rx', drugId: 'insulin_r', route: 'iv', dose: Math.round(p.weight * 0.1 * 10) / 10, freq: 'cont', days: 2 },
    { a: 'rx', drugId: 'kcl', route: 'iv', dose: 10, freq: 'cont', days: 2, when: 'k<5' },
    { a: 'fluid', fluidId: 'd5w', mode: 'cont', rate: 100, when: 'glu<250' },
  ],
};
