// 尋常性ざ瘡（ニキビ）
// 出典: 日本皮膚科学会『尋常性痤瘡・酒皶治療ガイドライン2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'acne', name: '尋常性ざ瘡（ニキビ）', dept: '皮膚科', weight: 4,
  demo: { age: [16, 30], ageMode: 'young', male: 0.45 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => 'ニキビがひどい', ccKey: 'skin_lesion',
  history: {
    onset: { p: 1, text: '高校生のころからニキビがあり、最近ひどくなって跡が残るのが心配です。' },
    character: { p: 1, text: '白い・黒い小さなポツポツと、赤く腫れたニキビがあります。' },
    location: { p: 1, text: 'おでこ・頬・あごです。' },
    itch: { p: 0, text: '' },
    trigger: { p: 0.6, text: '生理前や寝不足で悪化します。' },
    meds: { p: 1, text: '市販のニキビ薬を使っています。ステロイドは使っていません。' },
    sickcontact: { p: 0, text: '' }, family: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '前額・頬・下顎に面皰（白ニキビ・黒ニキビ）と紅色丘疹・膿疱が多発。一部に萎縮性の瘢痕。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '外用（アダパレン・過酸化ベンゾイル）、炎症が強ければ抗菌薬の内服を短期間', req: { tag: 'acne_topical' }, effect: -0.4, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '尋常性ざ瘡：外来で外用療法（効果が出るまで2〜3か月、続けることが大切）' }),
  teaching: [
    'ニキビは毛穴の詰まり（面皰）から始まり、アクネ菌で炎症を起こす。',
    '治療の基本は面皰を治す外用（アダパレン・過酸化ベンゾイル）。炎症が強ければ短期間の抗菌薬。抗菌薬だけを長く使うと耐性菌が増える。',
    '急に悪化した・多毛や月経不順を伴う（多嚢胞性卵巣症候群）・ステロイドの使用は原因を考える。',
  ],
  sources: ['尋常性痤瘡・酒皶治療ガイドライン2023（日本皮膚科学会）'],
  ideal: () => [{ a: 'rx', drugId: 'adapalene', route: 'top', dose: 0.5, freq: 'q24h', days: 28 }],
});
