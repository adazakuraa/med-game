// 子宮筋腫（過多月経による鉄欠乏性貧血）
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'fibroid', name: '子宮筋腫（過多月経）', dept: '産婦人科', weight: 5,
  demo: { age: [35, 50], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  comorb: { extra: {} },
  vars: (rng) => ({ cm: rng.int(6, 9) }),
  cc: () => '生理の量が多く、疲れやすい', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '1年くらい前から生理の量が増えて、夜用ナプキンでも1時間もたないことがあります。' },
    character: { p: 1, text: '階段で息切れがして、疲れやすいです。' },
    fatigue: { p: 1, text: 'だるいです。' },
    menses: { p: 1, text: '生理の量が多く、レバーのような塊が出ます。期間も8日くらい続きます。生理痛も強くなりました。' },
    palpitation: { p: 0.7, text: '動悸がします。' },
    frequency: { p: 0.4, text: 'トイレが近くなりました。' },
    heatcold: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, bloodystool: { p: 0, text: '' }, mood: { p: 0, text: '' }, sleep: { p: 0, text: '' },
    meds: { p: 1, text: '市販の鉄のサプリを時々飲んでいます。' },
  },
  exam: { conjunctiva: { p: 1, text: '眼瞼結膜が蒼白。' }, abd_palp: { p: 0.6, text: '下腹部に手拳大の硬い腫瘤を触れる。圧痛なし。' }, pelvic: { p: 0.9, text: '子宮は手拳大に腫大し、凹凸がある。可動性良好。' } },
  labs: { HB: { add: [-5, -3.5], k: 0 }, MCV: { add: [-18, -12], k: 0 }, FER: { mul: [0.05, 0.15], k: 0 } },
  tests: { tvus: [{ p: 1, persist: true, text: '子宮に約{cm}cmの筋層内筋腫と、内腔に突出する粘膜下筋腫。両側卵巣は正常。' }] },
  natural: -0.01,
  therapies: [
    { id: 'iron', label: '鉄剤', req: { tag: 'iron' }, effect: -0.2, lagH: 24, required: true, deadlineH: [24, 24, 24] },
    { id: 'gyn', label: '婦人科での治療（GnRHアンタゴニスト・手術など）', req: { fn: (enc, eff) => (eff.tags.fibroid_tx || 0) > 0 || enc.consults.some((c) => c.dept === 'obgyn') }, required: true, deadlineH: [24, 24, 24] },
  ],
  consult: { obgyn: '産婦人科：粘膜下筋腫を含む子宮筋腫による過多月経と鉄欠乏性貧血です。鉄剤で貧血を改善しながら、レルゴリクスで月経を止め、手術（子宮鏡下筋腫切除術・筋腫核出術など）を相談します。' },
  useful: ['cbc', 'ferritin', 'uhcg', 'tvus', 'chem', 'thyroid'], key: [['cbc'], ['tvus']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '子宮筋腫による貧血：Hb 7以上で症状が強くなければ外来で鉄剤と婦人科治療' }),
  teaching: [
    '過多月経（レバー状の塊・夜用ナプキンが1〜2時間ももたない）と鉄欠乏性貧血は、子宮筋腫（特に粘膜下筋腫）・子宮腺筋症を考える。',
    '経腟超音波で筋腫の位置と大きさを確認。妊娠反応も確認。',
    '治療：鉄剤で貧血を補正。GnRHアンタゴニスト（レルゴリクス）・低用量ピル・黄体ホルモン子宮内システム、手術（子宮鏡下切除・核出術・子宮全摘）。',
    '閉経後に大きくなる・急に大きくなる場合は子宮肉腫に注意。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'ferritin', 'uhcg', 'tvus'] }, { a: 'rx', drugId: 'ferrous', route: 'po', dose: 100, freq: 'q24h', days: 30 }, { a: 'consult', dept: 'obgyn', delayMin: 1 }, { a: 'wait', min: 70 }],
});
