// 肋骨骨折
// 出典: 日本外傷学会『外傷初期診療ガイドライン JATEC 第6版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'rib_fx', name: '肋骨骨折', dept: '整形外科', weight: 4,
  demo: { age: [50, 85], ageMode: 'old', male: 0.55 },
  comorb: { extra: { htn: 0.4 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['風呂場で滑って浴槽のふちに胸をぶつけ', '脚立から落ちて', 'ゴルフのスイングの後から']) }),
  cc: () => '胸を打って痛い', ccKey: 'injury',
  history: {
    onset: { p: 1, text: '昨日、{how}、{side}の胸が痛くなりました。' },
    character: { p: 1, text: '{side}の脇腹が、深呼吸・咳・寝返りで強く痛みます。' },
    location: { p: 1, text: '{side}の脇の下から背中寄りです。' },
    aggravating: { p: 1, text: '咳やくしゃみで響きます。' },
    trigger: { p: 1, text: '{how}ました。' },
    syncope: { p: 1, text: '気を失ってはいません。' },
    dyspnea: { p: 0.2, text: '痛くて深く息が吸えませんが、息苦しくはありません。' },
    hematuria: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { chest_palp: { p: 1, text: '{side}第7〜8肋骨の側胸部に限局した強い圧痛。胸郭を圧迫すると痛みが増す（介達痛）。皮下気腫なし。' }, lung_ausc: { p: 1, text: '呼吸音は左右差なし。' }, joint: { p: 0, text: '' } },
  tests: { cxr: [{ p: 0.6, persist: true, text: '{side}第7・8肋骨の側方に骨折線。気胸・血胸はない。' }] },
  natural: -0.03,
  therapies: [{ id: 'pain', label: '十分な鎮痛（深呼吸・咳ができるように、肺炎予防）', req: { anyTag: ['analgesic', 'nsaid'] }, effect: -0.3, lagH: 1, required: true, deadlineH: [3, 3, 3] }],
  useful: ['cxr', 'chest_ct', 'ecg'], key: [['cxr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '単純な肋骨骨折：鎮痛して帰宅（息苦しさ・血痰が出たら再診）。多発骨折・高齢・呼吸機能低下は入院も' }),
  teaching: [
    '胸部打撲後の、深呼吸・咳・体動で増強する限局した圧痛と介達痛は肋骨骨折。X線で見えないことも多いが、診断は臨床的でよい。',
    '胸部X線の目的は合併症（気胸・血胸・肺挫傷）の確認。下位肋骨の骨折では肝・脾・腎の損傷にも注意。',
    '治療は十分な鎮痛（痛みで呼吸が浅くなると無気肺・肺炎になる）。バストバンドは補助的。',
    '高齢者・3本以上の多発骨折・フレイルチェスト（奇異性呼吸）は入院を考える。',
  ],
  sources: ['外傷初期診療ガイドライン JATEC 第6版（日本外傷学会）'],
  ideal: () => [{ a: 'test', ids: ['cxr'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
