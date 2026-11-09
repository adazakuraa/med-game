// 統合失調症（急性期）
// 出典: 日本神経精神薬理学会/日本臨床精神神経薬理学会『統合失調症薬物治療ガイドライン2022』
import { outpatient } from './common.js';
export default outpatient({
  id: 'schizophrenia', name: '統合失調症（急性期）', dept: '精神科', weight: 2, minLevel: 2,
  demo: { age: [18, 35], ageMode: 'young', male: 0.55 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '「誰かに見張られている」と言って部屋から出ない', ccKey: 'psych',
  history: {
    onset: { p: 1, text: '（家族）半年前から部屋にこもりがちで、1か月前から「盗聴されている」と言い始めました。' },
    character: { p: 1, text: '近所の人が自分の悪口を言っている声が、部屋にいても聞こえてきます。' },
    hallucination: { p: 1, text: '自分のことを命令する声が聞こえます。電磁波で監視されています。' },
    mood: { p: 0.4, text: '（家族）表情が乏しく、好きだったことにも関心がなくなりました。' },
    sleep: { p: 1, text: '（家族）昼夜逆転しています。' },
    meds: { p: 1, text: '（家族）薬は飲んでいません。違法薬物は使っていないと思います。' },
    alcohol: { p: 0, text: '（家族）お酒は飲みません。' },
    pmh: { p: 1, text: '（家族）大きな病気はありません。' },
    fever: { p: 0, text: '' }, heatcold: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, palpitation: { p: 0, text: '' },
  },
  exam: { gen_consc: { p: 1, text: '意識は清明、見当識は保たれている（せん妄ではない）。' }, gen_appear: { p: 1, text: '警戒的で、話にまとまりがない。' } },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '身体疾患の除外と、精神科での抗精神病薬治療（入院の検討）', req: { fn: (enc, eff) => enc.consults.some((c) => c.dept === 'psych') || (eff.tags.antipsychotic || 0) > 0 }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  consult: { psych: '精神科：幻聴・被害妄想・陰性症状が数か月続き、統合失調症の急性期と考えます。意識は清明で、身体疾患・薬物は否定的です。抗精神病薬で治療し、本人と家族の同意を得て入院を検討します。' },
  useful: ['tox', 'bs_poct', 'chem', 'cbc', 'thyroid', 'head_ct', 'head_mri'], key: [['tox'], ['bs_poct', 'chem']],
  dispo: () => ({ ok: ['admit', 'home'], best: 'admit', why: '統合失調症の急性期：精神科で治療（自傷他害の恐れ・生活が成り立たなければ入院）' }),
  teaching: [
    '若年者の幻聴（悪口・命令する声）・被害妄想・まとまりのない会話・陰性症状（意欲低下・感情の平板化）は統合失調症を考える。',
    '意識がはっきりしているか（せん妄との区別）を確認し、薬物（覚醒剤など）・脳炎・てんかん・甲状腺・SLEなどの身体疾患を除外する。',
    '治療は抗精神病薬と心理社会的支援。早期治療が予後を良くする。',
  ],
  sources: ['統合失調症薬物治療ガイドライン2022'],
  ideal: () => [{ a: 'test', ids: ['tox', 'bs_poct', 'chem', 'cbc', 'head_ct'] }, { a: 'consult', dept: 'psych', delayMin: 1 }, { a: 'wait', min: 70 }],
});
