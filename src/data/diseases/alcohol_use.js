// アルコール使用障害
// 出典: 日本アルコール・アディクション医学会ほか『新アルコール・薬物使用障害の診断治療ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'alcohol_use', name: 'アルコール使用障害', dept: '精神科', weight: 3,
  demo: { age: [35, 65], ageMode: 'uniform', male: 0.8 },
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({ forceAlcohol: true }),
  cc: () => 'お酒をやめられない（家族に言われて受診）', ccKey: 'psych',
  history: {
    onset: { p: 1, text: '（家族）毎日朝から飲むようになり、仕事も休みがちです。' },
    character: { p: 1, text: '飲む量を減らそうとしてもやめられません。飲まないと手が震えて汗が出ます。' },
    alcohol: { p: 1, text: '毎日、焼酎を4〜5合飲みます。朝起きてすぐ迎え酒をします。' },
    mood: { p: 0.5, text: '気分が落ち込むことがあります。' },
    sleep: { p: 1, text: '飲まないと眠れません。' },
    meds: { p: 1, text: '特に飲んでいません。' },
    hallucination: { p: 0, text: '' }, pmh: { p: 1, text: '健診で肝臓が悪いと言われています。' },
    heatcold: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, palpitation: { p: 0, text: '' },
  },
  exam: { tremor: { p: 0.6, text: '軽い手指振戦。' }, skin: { p: 0.4, text: 'くも状血管腫。' }, gen_appear: { p: 1, text: '顔色が赤く、アルコール臭がする。' } },
  labs: { GGT: { add: [100, 400], k: 0 }, AST: { add: [30, 80], k: 0 }, MCV: { add: [4, 10], k: 0 } },
  natural: -0.002,
  therapies: [
    { id: 'b1', label: 'ビタミンB1の補充', req: { tag: 'thiamine' }, required: true, deadlineH: [24, 24, 24] },
    { id: 'psych', label: '動機づけ面接と専門治療（精神科・依存症外来、断酒または減酒、自助グループ）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'psych') }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] },
  ],
  consult: { psych: '精神科：アルコール依存症です。本人に治療の意思が少しあるので、依存症の専門外来で断酒（難しければ減酒）を目指した治療と自助グループを紹介します。離脱症状が強ければ入院で解毒治療を行います。' },
  useful: ['chem', 'lipid', 'cbc', 'coag', 'abd_us', 'nh3'], key: [['chem', 'lipid'], ['cbc']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: 'アルコール使用障害：離脱の危険が高くなければ外来で専門治療へつなぐ' }),
  teaching: [
    '飲酒のコントロールができない・離脱症状（手の震え・発汗・不眠）・迎え酒・社会生活への支障はアルコール依存症。AUDITでスクリーニング。',
    '責めずに動機づけ面接で治療意欲を高め、専門治療（断酒・減酒、自助グループ）へつなぐ。',
    'ビタミンB1の補充（Wernicke脳症予防）、肝障害・膵炎・うつ病・自殺リスクの評価。急な断酒では離脱症状（けいれん・振戦せん妄）に注意。',
  ],
  sources: ['新アルコール・薬物使用障害の診断治療ガイドライン'],
  ideal: () => [{ a: 'test', ids: ['chem', 'lipid', 'cbc'] }, { a: 'rx', drugId: 'thiamine', route: 'iv', dose: 100, freq: 'once', days: 1 }, { a: 'consult', dept: 'psych', delayMin: 1 }, { a: 'wait', min: 70 }],
});
