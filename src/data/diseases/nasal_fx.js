// 鼻骨骨折
// 出典: 日本耳鼻咽喉科頭頸部外科学会 資料, 日本形成外科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'nasal_fx', name: '鼻骨骨折', dept: '耳鼻咽喉科', weight: 2.5,
  demo: { age: [16, 50], ageMode: 'young', male: 0.8 },
  comorb: { extra: {} },
  vars: (rng) => ({ how: rng.pick(['バスケットボールで相手のひじが鼻に当たった', 'けんかで顔を殴られた', '自転車で転んで顔を打った']) }),
  cc: () => '鼻を打って、鼻血が出て曲がった', ccKey: 'injury',
  history: {
    onset: { p: 1, text: '2時間前、{how}。' },
    character: { p: 1, text: '鼻血が出て、鼻が腫れて少し曲がった気がします。鼻が詰まります。鼻血は今は止まっています。' },
    location: { p: 1, text: '鼻です。' },
    trigger: { p: 1, text: '{how}。頭は打っていません。気も失っていません。' },
    syncope: { p: 0, text: '気は失っていません。' }, numbness: { p: 0, text: '頬や歯のしびれはありません。' },
    pmh: { p: 0, text: '' }, meds: { p: 0, text: '' }, aggravating: { p: 0, text: '' },
  },
  exam: { nose: { p: 1, text: '鼻背の腫脹・圧痛と右への偏位、轢音。鼻中隔血腫はない（鼻中隔の膨隆なし）。鼻出血は止血している。' }, skin: { p: 1, text: '鼻根部の腫脹と皮下出血。' }, eye: { p: 0, text: '眼球運動は正常、複視なし。' }, gen_consc: { p: 0, text: '意識清明。' } },
  tests: { joint_xr: [{ p: 1, persist: true, text: '鼻骨側面像：鼻骨の骨折線と軽い陥凹。' }], head_ct: [{ p: 1, text: '鼻骨骨折。眼窩・上顎骨の骨折なし、頭蓋内出血なし。' }] },
  natural: -0.02,
  therapies: [
    { id: 'pain', label: '冷却・鎮痛', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.2, lagH: 1, required: true, deadlineH: [6, 6, 6] },
    { id: 'ent', label: '耳鼻咽喉科/形成外科へ紹介：腫れが引いた1週間前後に整復（2週以内）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ent') }, effect: -0.1, lagH: 6, required: true, deadlineH: [72, 72, 72] },
  ],
  consult: { ent: '耳鼻咽喉科：鼻骨骨折で、鼻中隔血腫はありません。腫れが引く1週間後くらいに外来で徒手整復を行います（2週以内）。それまで鼻を強くかまないでください。' },
  useful: ['joint_xr', 'head_ct'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '鼻骨骨折：冷却・鎮痛で帰宅し、1週間前後に耳鼻咽喉科で整復' }),
  teaching: [
    '顔面の打撲後の鼻出血・鼻背の腫れ・変形・轢音は鼻骨骨折。最も多い顔面骨骨折。',
    '鼻中隔血腫（鼻中隔の膨隆）は放置すると鼻中隔穿孔・鞍鼻になるので緊急で切開排膿。複視・頬のしびれ・咬合異常があれば眼窩・上顎骨骨折をCTで調べる。',
    '変形があれば腫れが引いた1週間前後（2週以内）に整復。',
  ],
  sources: ['日本形成外科学会「鼻骨骨折」'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 5 }, { a: 'consult', dept: 'ent', delayMin: 1 }, { a: 'wait', min: 70 }],
});
