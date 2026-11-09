// 変形性膝関節症
// 出典: 日本整形外科学会『変形性膝関節症診療ガイドライン2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'knee_oa', name: '変形性膝関節症', dept: '整形外科', weight: 6,
  demo: { age: [55, 88], ageMode: 'old', male: 0.3 },
  vars: (rng) => ({ side: rng.pick(['右', '左', '両']), yrs: rng.int(1, 5) }),
  cc: () => '膝が痛い', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '{yrs}年くらい前から{side}膝が痛くて、最近ひどくなってきました。' },
    character: { p: 1, text: '歩き始めや、階段の上り下りで膝の内側が痛みます。休むと楽になります。' },
    location: { p: 1, text: '{side}膝の内側です。' },
    joint: { p: 1, text: '{side}膝が痛み、正座ができなくなりました。ほかの関節は痛くありません。' },
    aggravating: { p: 1, text: '立ち上がるときや階段を下りるときに痛いです。' },
    stiffness: { p: 0.7, text: '朝起きたとき膝がこわばりますが、数分で治ります。' },
    fever: { p: 0, text: '' }, trigger: { p: 0, text: '' },
    pmh: { p: 0.4, text: '最近、体重が増えました。' },
  },
  exam: { joint: { p: 1, text: '{side}膝の内側に圧痛。軽度の内反変形（O脚）と、屈伸時の軋轢音。熱感・発赤はなく、軽い水腫。' } },
  tests: { joint_xr: [{ p: 0.95, persist: true, text: '{side}膝の内側関節裂隙の狭小化と骨棘形成（Kellgren-Lawrence分類グレード3）。' }], joint_tap: [{ p: 1, text: '関節液は淡黄色透明で粘稠。白血球 600/μL。結晶なし。グラム染色陰性。' }] },
  natural: -0.02,
  therapies: [{ id: 'pain', label: '鎮痛（NSAIDs・アセトアミノフェン）と運動療法・減量の指導', req: { anyTag: ['analgesic', 'nsaid'] }, effect: -0.3, lagH: 1, required: true, deadlineH: [24, 24, 24] }],
  useful: ['joint_xr', 'cbc', 'crp', 'chem', 'joint_tap'], key: [['joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '変形性膝関節症：鎮痛薬と大腿四頭筋の筋力訓練・減量で外来治療' }),
  teaching: [
    '中高年の歩き始め・階段で悪化し安静で軽快する膝の痛みは変形性膝関節症が多い。女性・肥満・O脚がリスク。',
    'X線で関節裂隙の狭小化・骨棘。朝のこわばりは短い（関節リウマチは1時間以上）。',
    '急な腫れ・熱感・発熱があれば化膿性関節炎・偽痛風を考えて関節穿刺を。',
    '治療の基本は運動療法（大腿四頭筋訓練）と減量。痛みにはNSAIDs（外用・内服、腎機能と胃に注意）・アセトアミノフェン、ヒアルロン酸注射。進行すれば人工膝関節置換術。',
  ],
  sources: ['変形性膝関節症診療ガイドライン2023（日本整形外科学会）'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q8h', days: 14 }],
});
