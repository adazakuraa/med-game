// アルツハイマー型認知症
// 出典: 日本神経学会『認知症疾患診療ガイドライン2017』
import { outpatient } from './common.js';
export default outpatient({
  id: 'dementia', name: 'アルツハイマー型認知症', dept: '脳神経内科', weight: 5,
  demo: { age: [72, 92], ageMode: 'old', male: 0.35 },
  comorb: { extra: { htn: 0.5, dm2: 0.3 } },
  vars: (rng) => ({ y: rng.int(1, 3) }),
  cc: () => '物忘れがひどくなった（家族が心配）', ccKey: 'memory',
  history: {
    onset: { p: 1, text: '（家族）{y}年くらい前から物忘れが増えて、少しずつ進んでいます。' },
    memory: { p: 1, text: '（家族）同じことを何度も聞きます。財布をしまった場所を忘れて「盗まれた」と言います。料理の手順がわからなくなりました。' },
    course: { p: 1, text: '（家族）急に悪くなったわけではなく、ゆっくり進んでいます。' },
    character: { p: 1, text: '物忘れなんてしていません。（家族：本人は困っていないようです）' },
    trigger: { p: 1, text: '（家族）頭をぶつけたことはありません。' },
    mood: { p: 0.3, text: '（家族）元気はありますが、以前より意欲が落ちました。' },
    adl: { p: 1, text: '（家族）着替えや食事は一人でできますが、薬の管理や買い物は難しくなりました。' },
    meds: { p: 1, text: '（家族）血圧の薬だけです。睡眠薬や抗コリン薬は飲んでいません。' },
    weakness: { p: 0, text: '' }, headache: { p: 0, text: '' }, fever: { p: 0, text: '' }, sleep: { p: 0, text: '' },
  },
  exam: { gen_consc: { p: 1, text: '意識は清明。日付を聞くとはぐらかす（取り繕い）。' }, motor: { p: 0, text: '' } },
  tests: {
    hdsr: [{ p: 1, persist: true, text: '改訂長谷川式 17/30点、MMSE 19/30点（遅延再生・見当識で失点）。' }],
    head_mri: [{ p: 1, persist: true, text: '両側の海馬・側頭葉内側の萎縮。慢性硬膜下血腫・脳梗塞・水頭症はない。' }],
    head_ct: [{ p: 1, persist: true, text: 'びまん性の脳萎縮。慢性硬膜下血腫・水頭症はない。' }],
  },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '治る認知症の除外と、抗認知症薬・介護保険サービスの導入', req: { fn: (enc, eff) => (eff.tags.achei || 0) > 0 || enc.consults.some((c) => c.dept === 'neuro' || c.dept === 'psych') }, effect: -0.2, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { benzo: '認知症の高齢者にベンゾジアゼピン（せん妄・転倒）', antispasmodic: '認知症の高齢者に抗コリン薬（認知機能の悪化）' },
  useful: ['hdsr', 'head_mri', 'head_ct', 'thyroid', 'b12', 'chem', 'cbc', 'bs_poct'], key: [['hdsr'], ['head_mri', 'head_ct'], ['thyroid'], ['b12']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'アルツハイマー型認知症：外来で薬物療法と介護保険サービスの導入（家族支援）' }),
  teaching: [
    'ゆっくり進行する近時記憶障害（同じことを何度も聞く）・見当識障害・物盗られ妄想・取り繕いは、アルツハイマー型認知症の典型。',
    'まず「治る認知症」を除外：甲状腺機能低下症、ビタミンB12欠乏、慢性硬膜下血腫、正常圧水頭症、うつ病、薬剤（抗コリン薬・ベンゾジアゼピン）。',
    '認知機能検査（改訂長谷川式・MMSE）と頭部画像（海馬の萎縮）。',
    '治療はコリンエステラーゼ阻害薬など。介護保険・デイサービスの導入、家族の支援、運転の中止も大切。',
  ],
  sources: ['認知症疾患診療ガイドライン2017（日本神経学会）'],
  ideal: () => [{ a: 'test', ids: ['hdsr', 'head_ct', 'thyroid', 'b12', 'chem', 'cbc'] }, { a: 'rx', drugId: 'donepezil_rx', route: 'po', dose: 3, freq: 'q24h', days: 14 }],
});
