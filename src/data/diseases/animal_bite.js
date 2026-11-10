// 動物咬傷（猫・犬）
// 出典: JAID/JSC感染症治療ガイド2023（皮膚軟部組織感染症）, IDSA Practice Guidelines for SSTI (2014)
import { outpatient } from './common.js';
export default outpatient({
  id: 'animal_bite', name: '動物咬傷（猫・犬）', dept: '形成外科', weight: 3,
  demo: { age: [20, 80], ageMode: 'uniform', male: 0.45 },
  comorb: { extra: { dm2: 0.15 } },
  prophylaxis: ['gpc', 'anaerobe'],
  vars: (rng) => ({ animal: rng.pick(['飼い猫', '近所の犬', '飼い犬']), side: rng.pick(['右', '左']), hrs: rng.int(1, 6) }),
  cc: (v) => `${v.animal}にかまれた`, ccKey: 'injury',
  history: {
    onset: { p: 1, text: '{hrs}時間前、{animal}に{side}手をかまれました。' },
    character: { p: 1, text: '{side}手の甲に穴のような傷があって、少し腫れて痛みます。' },
    location: { p: 1, text: '{side}手の甲です。' },
    trigger: { p: 1, text: '{animal}をなでようとしたらかまれました。' },
    pmh: { p: 1, text: '破傷風の予防接種がいつだったか覚えていません。' },
    syncope: { p: 0, text: '' }, aggravating: { p: 0, text: '' },
    allergy: { p: 1, text: 'ペニシリンのアレルギーはありません。' },
  },
  exam: { skin: { p: 1, text: '{side}手背に深い刺創（牙の痕）が2か所。軽い発赤・腫脹。腱・関節への到達ははっきりしない。指の動き・感覚は正常。' }, joint: { p: 0, text: '' } },
  natural: 0.1,
  therapies: [
    { id: 'wound', label: '大量の水での洗浄（縫合はしない）', req: { fn: (enc) => !!enc.state.procs?.wound_care }, required: true, deadlineH: [3, 3, 3], effect: -0.3, lagH: 0.5 },
    { id: 'abx', label: '予防的抗菌薬（アモキシシリン・クラブラン酸）', req: { coverage: ['gpc', 'anaerobe'] }, required: true, deadlineH: [6, 6, 6], effect: -0.4, lagH: 2 },
    { id: 'tetanus', label: '破傷風トキソイド（接種歴が不明・10年以上前）', req: { tag: 'tetanus' }, required: true, deadlineH: [24, 24, 24] },
  ],
  useful: ['joint_xr', 'cbc', 'crp'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '動物咬傷：洗浄・予防的抗菌薬・破傷風予防をして帰宅（翌日に創を再確認）' }),
  teaching: [
    '猫の咬傷は小さくても深く、パスツレラ菌などで急速に感染する（手は特に危険）。犬の咬傷は組織の挫滅が強い。',
    '大量の水で洗浄し、手の咬傷は原則として縫合しない。腱・関節・骨への到達や異物（歯）があればX線・整形外科へ。',
    '手・顔・深い傷・猫咬傷・免疫低下では予防的抗菌薬（アモキシシリン・クラブラン酸）。',
    '破傷風の予防接種歴を確認し、必要ならトキソイド。日本では狂犬病はまずないが、海外での咬傷は暴露後ワクチンを検討。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023', 'IDSA Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections (2014)'],
  ideal: () => [{ a: 'proc', id: 'wound_care' }, { a: 'rx', drugId: 'amox_clav', route: 'po', dose: 375, freq: 'q8h', days: 5 }, { a: 'rx', drugId: 'tetanus', route: 'im', dose: 0.5, freq: 'once', days: 1 }],
});
