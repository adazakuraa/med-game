// 半月板損傷
// 出典: 日本整形外科学会 症状・病気をしらべる「半月板損傷」
import { outpatient } from './common.js';
export default outpatient({
  id: 'meniscus', name: '半月板損傷', dept: '整形外科', weight: 3,
  demo: { age: [20, 60], ageMode: 'uniform', male: 0.65 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['サッカーで体をひねった', 'しゃがんだ姿勢から立ち上がった', 'バスケットボールで方向転換した']) }),
  cc: (v) => `${v.side}膝をひねって痛い`, ccKey: 'injury',
  history: {
    onset: { p: 1, text: '3日前、{how}ときに{side}膝をひねりました。' },
    character: { p: 1, text: '膝の内側が痛く、曲げ伸ばしの途中で引っかかる感じがします。時々、膝が伸びなくなります（ロッキング）。' },
    location: { p: 1, text: '{side}膝の内側です。' },
    aggravating: { p: 1, text: 'しゃがむ・階段を下りる・体をひねると痛みます。' },
    trigger: { p: 1, text: '{how}ときです。' },
    syncope: { p: 0, text: '' }, numbness: { p: 0, text: 'しびれはありません。' }, pmh: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}膝の内側関節裂隙に圧痛、軽い関節水腫。McMurrayテスト陽性（膝を曲げて回旋させるとクリックと痛み）。前方引き出しテスト・Lachmanテストは陰性。' } },
  tests: { joint_xr: [{ p: 1, text: '骨折なし。関節裂隙は保たれている。', normal: true }] },
  natural: -0.02,
  therapies: [
    { id: 'tx', label: '安静・冷却・鎮痛', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.2, lagH: 2, required: true, deadlineH: [24, 24, 24] },
    { id: 'ortho', label: '整形外科へ紹介：MRIで評価、ロッキングを繰り返すなら関節鏡手術', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ortho') }, effect: -0.1, lagH: 12, required: true, deadlineH: [72, 72, 72] },
  ],
  consult: { ortho: '整形外科：McMurrayテスト陽性で、内側半月板損傷を疑います。外来でMRIを撮り、ロッキングを繰り返す・痛みが続く場合は関節鏡で縫合または部分切除を行います。' },
  useful: ['joint_xr'], key: [['joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '半月板損傷：鎮痛と整形外科外来（MRI）' }),
  teaching: [
    '膝をひねった後の関節裂隙の痛み・引っかかり感・ロッキング（膝が伸びなくなる）・McMurrayテスト陽性は半月板損傷。中高年はしゃがむなどの小さな動作でも損傷する（変性断裂）。',
    'X線は骨折の除外。確定はMRI。',
    '前十字靭帯損傷（受傷時の断裂音・すぐ腫れる・膝くずれ、Lachman陽性）を合併することがある。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「半月板損傷」'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }, { a: 'consult', dept: 'ortho', delayMin: 1 }, { a: 'wait', min: 70 }],
});
