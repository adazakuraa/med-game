// 肩関節周囲炎（いわゆる五十肩）
// 出典: 日本整形外科学会『凍結肩 診療ガイドライン』, 日本肩関節学会
import { outpatient } from './common.js';
export default outpatient({
  id: 'frozen_shoulder', name: '肩関節周囲炎（五十肩）', dept: '整形外科', weight: 4,
  demo: { age: [45, 70], ageMode: 'uniform', male: 0.45 },
  comorb: { extra: { dm2: 0.25 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']), mo: rng.int(1, 4) }),
  cc: () => '肩が痛くて上がらない', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '{mo}か月前から、特にきっかけもなく{side}肩が痛くなりました。' },
    character: { p: 1, text: '腕を上げたり、後ろに回したりすると痛いです。夜、寝返りで痛くて目が覚めます。' },
    location: { p: 1, text: '{side}肩です。' },
    joint: { p: 1, text: '{side}肩が痛く、髪を結ぶ・エプロンのひもを結ぶ動作ができません。' },
    aggravating: { p: 1, text: '腕を上げるとき、夜寝ているとき。' },
    trigger: { p: 0.3, text: 'けがはしていません。' },
    fever: { p: 0, text: '' }, stiffness: { p: 0, text: '' }, chestpain: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}肩関節の可動域制限（自動・他動とも屈曲・外旋・結帯動作が制限）。腫脹・熱感なし。' } },
  tests: { joint_xr: [] },
  natural: -0.02,
  therapies: [{ id: 'pain', label: '鎮痛（NSAIDs）と、痛みに応じたストレッチ・リハビリの指導', req: { anyTag: ['analgesic', 'nsaid'] }, effect: -0.3, lagH: 1, required: true, deadlineH: [24, 24, 24] }],
  useful: ['joint_xr', 'ecg', 'cbc', 'crp'], key: [['joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '肩関節周囲炎：鎮痛とリハビリで外来治療（多くは1〜2年で改善）' }),
  teaching: [
    '中高年で、きっかけなく始まる肩の痛みと、自動・他動ともに全方向の可動域制限（特に外旋・結帯）は肩関節周囲炎（凍結肩）。夜間痛が特徴。糖尿病で多い。',
    '腱板断裂は他動では動く（自分では上げられない）。石灰沈着性腱板炎は急な激痛（X線で石灰化）。',
    '左肩の痛みでは狭心症・心筋梗塞の関連痛も考える（労作との関係・心電図）。',
    '治療はNSAIDs、関節内注射、痛みに応じたストレッチ・リハビリ。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「五十肩（肩関節周囲炎）」'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 14 }],
});
