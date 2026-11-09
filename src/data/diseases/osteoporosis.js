// 骨粗鬆症
// 出典: 日本骨粗鬆症学会ほか『骨粗鬆症の予防と治療ガイドライン2015年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'osteoporosis', name: '骨粗鬆症', dept: '整形外科', weight: 5,
  demo: { age: [65, 85], ageMode: 'old', male: 0.1 },
  noPregnancy: true,
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => '背が縮んだ・骨が心配', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '若いころより背が4cm縮み、背中が丸くなってきました。' },
    character: { p: 1, text: '特に痛みはありません。母が大腿骨を骨折して寝たきりになったので心配です。' },
    family: { p: 1, text: '母が大腿骨の付け根を骨折しました。' },
    pmh: { p: 1, text: '閉経は48歳です。2年前に転んで手首を骨折しました。' },
    meds: { p: 1, text: 'ステロイドは飲んでいません。' },
    diet: { p: 1, text: '牛乳や小魚はあまりとりません。' },
    smoking: { p: 0, text: '' }, alcohol: { p: 0, text: '' }, weightgain: { p: 0, text: '' },
  },
  exam: { spine: { p: 1, text: '胸椎後弯（円背）。棘突起の叩打痛はない。' }, gen_appear: { p: 1, text: 'やせ型。' } },
  tests: { dexa: [{ p: 1, persist: true, text: '腰椎の骨密度は若年成人平均の65%、大腿骨頸部は62%（骨粗鬆症）。' }], spine_xr: [{ p: 0.6, persist: true, text: '第12胸椎に古い軽度の圧迫骨折。' }] },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '骨粗鬆症の薬物療法（ビスホスホネートなど）と転倒予防・カルシウム/ビタミンD', req: { tag: 'bisphosphonate_po' }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['dexa', 'spine_xr', 'chem', 'cbc', 'thyroid'], key: [['dexa'], ['chem']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '骨粗鬆症：外来で薬物療法と転倒予防' }),
  teaching: [
    '閉経後女性・高齢者・ステロイド内服・喫煙・やせ・家族歴は骨粗鬆症のリスク。脆弱性骨折（手首・背骨・大腿骨）の既往があれば強く疑う。',
    '診断は骨密度（DXA）：若年成人平均の70%以下、または脆弱性骨折＋80%未満。身長の低下は椎体骨折のサイン。',
    '二次性（副甲状腺機能亢進症・甲状腺機能亢進症・ステロイド・性腺機能低下）を採血で確認。',
    '治療：ビスホスホネートなどの薬、カルシウム・ビタミンD、運動、転倒予防。次の骨折（特に大腿骨）を防ぐことが目的。',
  ],
  sources: ['骨粗鬆症の予防と治療ガイドライン2015年版'],
  ideal: () => [{ a: 'test', ids: ['dexa', 'chem', 'spine_xr'] }, { a: 'rx', drugId: 'alendronate', route: 'po', dose: 35, freq: 'once', days: 7 }],
});
