// 咳喘息
// 出典: 日本呼吸器学会『咳嗽・喀痰の診療ガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'cva_cough', name: '咳喘息', dept: '呼吸器内科', weight: 5,
  demo: { age: [20, 60], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: {} },
  vars: (rng) => ({ wk: rng.int(4, 10) }),
  cc: () => '咳が長く続く', ccKey: 'chronic_cough',
  history: {
    onset: { p: 1, text: '{wk}週間前にかぜをひいてから、咳だけがずっと続いています。' },
    cough: { p: 1, text: '乾いた咳で、夜中から明け方にひどくなり、目が覚めます。' },
    sputum: { p: 0.1, text: '痰はほとんど出ません。' },
    character: { p: 1, text: '冷たい空気を吸ったり、話したり笑ったりすると咳き込みます。' },
    fever: { p: 0, text: '熱はありません。' },
    dyspnea: { p: 0.2, text: 'ゼーゼーはしません。' },
    pmh: { p: 0.7, text: '花粉症があります。子どものころ小児喘息でした。' },
    smoking: { p: 1, text: 'たばこは吸いません。' },
    meds: { p: 1, text: '血圧の薬（ACE阻害薬）は飲んでいません。かぜ薬や咳止めは効きませんでした。' },
    heartburn: { p: 0.1, text: '胸やけはありません。' },
    weightloss: { p: 0, text: '' }, nightsweat: { p: 0, text: '' }, sickcontact: { p: 0, text: '' },
  },
  exam: { lung_ausc: { p: 0.1, text: '強制呼気でわずかにwheezes。' }, pharynx: { p: 0.3, text: '咽頭に軽い発赤。' } },
  tests: { spirometry: [{ p: 1, persist: true, text: '1秒率 78%（正常）、気道可逆性は軽度。呼気NO 45ppb（上昇：好酸球性の気道炎症）。' }] },
  natural: -0.003,
  therapies: [{ id: 'ics', label: '吸入ステロイド（＋長時間作用性β2刺激薬）', req: { tag: 'ics' }, effect: -0.5, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cxr', 'spirometry', 'cbc', 'chest_ct', 'afb'], key: [['cxr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '咳喘息：外来で吸入ステロイド（約3割が喘息に移行するので症状がなくなっても続ける）' }),
  teaching: [
    '3〜8週の遷延性咳嗽・8週以上の慢性咳嗽では、まず胸部X線で肺がん・結核・間質性肺炎などを除外する。',
    '夜間〜明け方に悪化する乾いた咳で、冷気・会話・季節で誘発され、喘鳴がないのは咳喘息。呼気NO上昇、気管支拡張薬が効く。',
    'ほかの原因：アトピー咳嗽、副鼻腔気管支症候群（後鼻漏）、逆流性食道炎、ACE阻害薬、百日咳、喫煙（COPD）。',
    '治療は吸入ステロイド。約3割が典型的な喘息に移行する。',
  ],
  sources: ['咳嗽・喀痰の診療ガイドライン2019（日本呼吸器学会）'],
  ideal: () => [{ a: 'test', ids: ['cxr', 'spirometry'] }, { a: 'rx', drugId: 'ics_laba', route: 'inh', dose: 2, freq: 'q12h', days: 28 }],
});
