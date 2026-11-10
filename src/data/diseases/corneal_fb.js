// 角膜異物・角膜びらん
// 出典: 日本眼科学会 資料, AAO Corneal Abrasion
import { outpatient } from './common.js';
export default outpatient({
  id: 'corneal_fb', name: '角膜異物・角膜びらん', dept: '眼科', weight: 3,
  demo: { age: [20, 60], ageMode: 'uniform', male: 0.8 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), work: rng.pick(['グラインダーで鉄を削っていて', '草刈り機を使っていて', '強風の中を自転車で走っていて']) }),
  cc: () => '目に何か入って痛い', ccKey: 'red_eye',
  history: {
    onset: { p: 1, text: '2時間前、{work}{side}目に何か入りました。' },
    character: { p: 1, text: 'ゴロゴロしてとても痛く、涙が止まりません。まぶしくて目を開けられません。' },
    vision: { p: 0.3, text: '少しかすみます。' },
    itch: { p: 0, text: '' }, sickcontact: { p: 0, text: '' }, headache: { p: 0, text: '' }, nausea: { p: 0, text: '' },
    allergy: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '{side}眼の結膜充血・流涙。角膜の中央やや下方に黒い点状の異物。前房は清明。' } },
  tests: { slit: [{ p: 1, persist: true, text: '{side}角膜に鉄片の異物と周囲のさび（錆輪）、フルオレセインで染まる小さなびらん。前房は清明。' }] },
  natural: 0.02,
  curedBy: 'fb_removal',
  therapies: [{ id: 'fb_removal', label: '眼科で異物除去（細隙灯下）と抗菌点眼', req: { procDone: 'fb_removal' }, required: true, deadlineH: [24, 24, 24] }],
  procedures: [{ id: 'fb_removal', depts: ['eye'], label: '角膜異物除去', delay: 30, duration: 15, after: 'er', decide: () => ({ accept: true, reveal: true, text: '鉄片の角膜異物です。点眼麻酔で細隙灯下に異物と錆輪を除去します（約30分後）。抗菌点眼を処方してください。' }), onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 6); }, doneText: '眼科：角膜の鉄片と錆輪を除去しました。抗菌点眼・眼軟膏で翌日再診とします。' }],
  useful: ['slit', 'acuity'], key: [['slit']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '角膜異物：除去と抗菌点眼で帰宅（翌日に眼科で確認）' }),
  teaching: [
    '異物感・強い眼痛・流涙・まぶしさは角膜の傷や異物。まず視力を測り、フルオレセイン染色で角膜の傷を確認。上まぶたを裏返して異物を探す。',
    '鉄片は錆輪が残るので眼科で除去。高速で飛んできた異物（グラインダー・ハンマー）は眼内異物を疑い、CTも考える。',
    '治療は抗菌点眼。点眼麻酔薬を処方してはいけない（角膜障害）。コンタクトレンズ装用者は緑膿菌の角膜潰瘍に注意。',
    '予防は保護眼鏡。',
  ],
  sources: ['日本眼科学会 資料'],
  ideal: () => [{ a: 'test', ids: ['acuity', 'slit'] }, { a: 'consult', dept: 'eye', delayMin: 1 }, { a: 'rx', drugId: 'eye_abx', route: 'top', dose: 1, freq: 'q6h', days: 5 }, { a: 'wait', min: 120 }],
});
