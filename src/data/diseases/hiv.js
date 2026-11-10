// 急性HIV感染症
// 出典: 日本エイズ学会『HIV感染症「治療の手引き」第27版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hiv', name: '急性HIV感染症', dept: '感染症内科', weight: 1.5, minLevel: 3,
  demo: { age: [20, 45], ageMode: 'young', male: 0.85 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '熱と発疹、リンパ節の腫れ', ccKey: 'lymph',
  history: {
    onset: { p: 1, text: '10日前から38度の熱、喉の痛み、体に赤い発疹が出ています。' },
    character: { p: 1, text: 'だるくて、筋肉や関節も痛いです。下痢もあります。' },
    fever: { p: 1, text: '38度台です。' },
    sorethroat: { p: 1, text: '喉が痛いです。' },
    sickcontact: { p: 1, text: '1か月前に、コンドームを使わない性交渉がありました。' },
    pmh: { p: 1, text: '半年前に梅毒の治療を受けたことがあります。' },
    nightsweat: { p: 0.3, text: '少し寝汗をかきます。' },
    weightloss: { p: 0, text: '' }, cough: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { neck_ln: { p: 1, text: '頸部・腋窩の全身性リンパ節腫脹（軽い圧痛）。' }, skin: { p: 1, text: '体幹に小さな紅斑・丘疹。' }, oral_mucosa: { p: 0.5, text: '口腔内のアフタ性潰瘍。' }, pharynx: { p: 1, text: '咽頭の発赤（白苔はない）。' } },
  vitals: { T: { to: [37.8, 38.6], k: 0 } },
  labs: { WBC: { to: [2800, 3500], k: 0 }, PLT: { mul: [0.6, 0.85], k: 0 }, AST: { add: [10, 60], k: 0 } },
  tests: { hiv: { p: 1 }, syphilis: [{ p: 0.3, text: 'RPR 2倍、TPHA 陽性（治療後の既感染）。' }] },
  natural: -0.01,
  therapies: [{ id: 'id', label: 'HIV検査（同意を得て）→エイズ治療拠点病院・感染症内科へ紹介（早期の抗HIV療法）', req: { fn: (enc) => enc.tests.some((t) => t.id === 'hiv') && enc.consults.some((c) => c.dept === 'infect') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { infect: '感染症内科：HIV抗原抗体検査が陽性で、経過から急性HIV感染症と考えます。確認検査（ウエスタンブロット・HIV-RNA）とCD4数を調べ、早期に抗HIV療法を開始します。パートナーへの説明と、他の性感染症の検査も行います。' },
  useful: ['hiv', 'cbc', 'chem', 'syphilis', 'ebv', 'sti_pcr', 'hep_virus'], key: [['hiv']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '急性HIV感染症の疑い：感染症内科（エイズ治療拠点病院）で確認検査と治療開始' }),
  teaching: [
    '感染後2〜6週の発熱・咽頭痛・発疹・リンパ節腫脹・下痢・口腔潰瘍は急性HIV感染症（伝染性単核球症に似る）。リスクのある性交渉・性感染症の既往で疑う。',
    '同意を得て第4世代のHIV抗原抗体検査。ウインドウ期があるので、早期に陰性でも疑えば再検査やPCR。',
    '現在は抗HIV療法で長期予後が良好。治療で検出限界未満なら性交渉で他人にうつさない（U=U）。早期の診断・治療が大切。',
    '梅毒・B型肝炎など他の性感染症も調べる。5類感染症（全数届出）。',
  ],
  sources: ['HIV感染症「治療の手引き」第27版（日本エイズ学会）'],
  ideal: () => [{ a: 'test', ids: ['hiv', 'cbc', 'chem', 'syphilis'] }, { a: 'wait', min: 70 }, { a: 'consult', dept: 'infect', delayMin: 1 }, { a: 'wait', min: 70 }],
});
