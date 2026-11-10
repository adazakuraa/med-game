// 男性尿道炎（淋菌・クラミジア）
// 出典: 日本性感染症学会『性感染症 診断・治療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'urethritis', name: '尿道炎（淋菌・クラミジア）', dept: '泌尿器科', weight: 4,
  demo: { age: [18, 45], ageMode: 'young', male: 1 },
  comorb: { extra: {} },
  organisms: ['gc', 'chlamydia'], minAbxDays: 0,
  vars: (rng) => ({ d: rng.int(2, 7) }),
  cc: () => '排尿時の痛みと尿道から膿が出る', ccKey: 'urinary_sx',
  history: {
    onset: { p: 1, text: '{d}日前から、おしっこのときに尿道が痛みます。' },
    dysuria: { p: 1, text: '排尿のときに焼けるように痛みます。' },
    character: { p: 1, text: '朝、尿道の先から黄色い膿が出ています。' },
    frequency: { p: 0.3, text: '少しトイレが近いです。' },
    fever: { p: 0, text: '熱はありません。' },
    trigger: { p: 1, text: '1〜2週間前に、新しい相手と性交渉がありました（コンドームなし）。' },
    hematuria: { p: 0, text: '' }, flankpain: { p: 0, text: '' }, retention: { p: 0, text: '' },
    allergy: { p: 1, text: '薬のアレルギーはありません。' },
  },
  exam: { rectal: { p: 0.3, text: '前立腺に圧痛なし。' }, scrotum: { p: 0.3, text: '精巣・精巣上体に腫大・圧痛なし。' } },
  labs: { U_LEU: { to: [2, 3], k: 0 }, U_WBC: { to: [20, 50], k: 0 } },
  tests: { sti_pcr: [{ p: 1, persist: true, text: '淋菌PCR 陽性、クラミジアPCR 陽性（重複感染）。' }], urine_gram: [{ p: 0.9, text: '多数の好中球と、その中にグラム陰性双球菌（淋菌を疑う）。' }] },
  natural: 0,
  dynamics: (enc) => (enc.thStart?.abx != null && enc.t - enc.thStart.abx > 6 * 60 ? -0.8 : 0), // 単回注射＋内服で治癒に向かう
  therapies: [
    { id: 'abx', label: '淋菌（セフトリアキソン注）とクラミジア（アジスロマイシン・ドキシサイクリン）の両方を治療', req: { coverage: ['gc', 'chlamydia'] }, effect: -1, lagH: 12, required: true, deadlineH: [24, 24, 24] },
  ],
  useful: ['ua', 'sti_pcr', 'urine_gram', 'ucx'], key: [['ua'], ['sti_pcr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '尿道炎：外来で治療。パートナーの検査・治療と、HIV・梅毒の検査も勧める' }),
  teaching: [
    '若い男性の排尿時痛・尿道分泌物は尿道炎（淋菌・クラミジア）がほとんど。性交渉歴を聞く。',
    '淋菌は膿性の分泌物で潜伏期が短く（2〜7日）、クラミジアは症状が軽い（1〜3週）。重複感染が多いので両方を治療する。',
    '淋菌は耐性化が進んでおり、セフトリアキソン注射を使う。クラミジアはアジスロマイシンかドキシサイクリン。',
    'パートナーの同時治療（ピンポン感染の予防）、HIV・梅毒の検査、コンドームの指導。',
  ],
  sources: ['性感染症 診断・治療ガイドライン2020（日本性感染症学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'sti_pcr', 'urine_gram'] }, { a: 'rx', drugId: 'ctrx', route: 'iv', dose: 1000, freq: 'q24h', days: 1 }, { a: 'rx', drugId: 'doxy', route: 'po', dose: 100, freq: 'q12h', days: 7 }],
});
