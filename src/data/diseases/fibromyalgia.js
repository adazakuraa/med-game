// 線維筋痛症
// 出典: 日本線維筋痛症学会『線維筋痛症診療ガイドライン2017』, ACR 2016 fibromyalgia criteria
import { outpatient } from './common.js';
export default outpatient({
  id: 'fibromyalgia', name: '線維筋痛症', dept: '膠原病内科', weight: 2.5,
  demo: { age: [30, 60], ageMode: 'uniform', male: 0.15 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '全身のあちこちが痛い', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '半年以上前から、首・肩・背中・腰・腕・足と、全身のあちこちが痛みます。' },
    character: { p: 1, text: '筋肉がこわばってズキズキ痛み、触られるだけでも痛いことがあります。いくら寝ても疲れがとれず、物忘れも増えました。' },
    location: { p: 1, text: '全身です。日によって痛む場所が変わります。' },
    joint: { p: 0, text: '関節が腫れることはありません。' },
    stiffness: { p: 0.6, text: '朝はこわばりますが、時間ははっきりしません。' },
    trigger: { p: 0.5, text: '仕事のストレスが重なった頃から始まりました。' },
    fever: { p: 0, text: '熱はありません。' }, pmh: { p: 0.5, text: '片頭痛と過敏性腸症候群があります。' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 0, text: '関節の腫脹・熱感・変形なし。' }, skin: { p: 0, text: '皮疹なし。' }, oral_mucosa: { p: 0, text: '口内炎なし。' } },
  labs: {},
  tests: { esr: [{ p: 1, text: '赤沈・CRP 正常。', normal: true }], ana: [{ p: 1, text: '抗核抗体 40倍（陰性レベル）。', normal: true }], rf_ccp: [{ p: 1, text: 'RF・抗CCP抗体 陰性。', normal: true }], thyroid: [{ p: 1, text: 'TSH・FT4 正常。', normal: true }] },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '病気の説明と運動療法・睡眠の改善、薬物療法（デュロキセチン・プレガバリンなど）。NSAIDsはあまり効かない', req: { anyTag: ['snri', 'neuropathic'] }, effect: -0.2, lagH: 24, required: true, deadlineH: [72, 72, 72] }],
  useful: ['cbc', 'chem', 'crp', 'esr', 'ana', 'rf_ccp', 'thyroid', 'lab_CK'], key: [['crp', 'esr'], ['chem', 'lab_CK']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '線維筋痛症：外来で説明・運動療法・薬物療法' }),
  teaching: [
    '3か月以上続く全身の広範な痛みと、疲労感・睡眠障害・認知機能の不調（物忘れ）があり、関節の腫れや炎症反応がない → 線維筋痛症。中年女性に多い。',
    '関節リウマチ・リウマチ性多発筋痛症・甲状腺機能低下症・筋炎（CK）・SLEを血液検査で除外する（診断名をつけることで不要な検査を減らす）。',
    '治療は病気の説明、有酸素運動、睡眠の改善、デュロキセチン・プレガバリン。オピオイドは使わない。',
  ],
  sources: ['線維筋痛症診療ガイドライン2017（日本線維筋痛症学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'crp', 'esr', 'ana', 'rf_ccp', 'thyroid'] }, { a: 'rx', drugId: 'duloxetine', route: 'po', dose: 20, freq: 'q24h', days: 28 }],
});
