// 橈骨遠位端骨折（Colles骨折）
// 出典: 日本整形外科学会『橈骨遠位端骨折診療ガイドライン2017（改訂第2版）』
export default {
  id: 'wrist_fx', name: '橈骨遠位端骨折', dept: '整形外科',
  weight: 4, season: { winter: 1.5 }, minLevel: 1,
  demo: { age: [55, 85], ageMode: 'old', male: 0.2 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[20, 28], [28, 36], [36, 44]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { htn: 0.4 } },
  organisms: [],
  untreatedFatal: false,
  noPregnancy: true,
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: (v) => `転んで${v.side}手首が痛い`, ccKey: 'injury',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '今朝、凍った道で滑って転び、{side}手をつきました。' },
    character: { p: 1, text: '手首が腫れてズキズキ痛み、動かせません。' },
    location: { p: 1, text: '{side}手首です。' },
    trigger: { p: 1, text: '滑って転んで手をつきました。頭は打っていません。意識もはっきりしていました。' },
    syncope: { p: 1, text: '気を失って転んだのではありません。' },
    dizziness: { p: 0, text: '' },
    pmh: { p: 0.5, text: '骨粗鬆症と言われたことがあります。' },
    aggravating: { p: 1, text: '少しでも動かすと痛いです。' },
  },
  exam: { joint: { p: 1, text: '{side}手関節の腫脹と変形（フォーク状変形）、橈骨遠位部に強い圧痛。手指のしびれ・循環障害はない。' } },
  vitals: {},
  labs: {},
  tests: { joint_xr: [{ p: 1, persist: true, text: '{side}橈骨遠位端に骨折、遠位骨片は背側に転位（Colles骨折）。' }] },
  natural: 0,
  curedBy: 'reduction',
  therapies: [
    { id: 'reduction', label: '整形外科コンサルト→徒手整復・ギプス（シーネ）固定、必要なら手術', req: { procDone: 'reduction' }, required: true, deadlineH: [24, 24, 24] },
    { id: 'pain', label: '鎮痛', req: { anyTag: ['analgesic', 'opioid'] }, required: true, deadlineH: [2, 2, 2] },
  ],
  procedures: [{
    id: 'reduction', depts: ['ortho'], label: '徒手整復・固定', delay: 30, duration: 30, after: 'er',
    decide: (enc) => {
      const xr = enc.tests.some((t) => t.id === 'joint_xr' && t.done);
      if (!xr) return { accept: false, text: 'まず手関節のX線（2方向）を撮ってください。' };
      return { accept: true, reveal: true, text: '転位のある橈骨遠位端骨折です。局所麻酔下に徒手整復してシーネ固定します（約30分後）。整復位が保てなければ後日手術（掌側ロッキングプレート）を考えます。骨粗鬆症の評価もお願いします。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 10); },
    doneText: '整形外科：徒手整復し、シーネで固定しました。1週間後に整形外科外来でX線を確認します。',
  }],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '整復・固定ができれば帰宅（腫脹時の挙上・手指の運動、しびれや強い痛みがあれば再診）' }),
  useful: ['joint_xr', 'hip_xr', 'ecg', 'bs_poct'],
  key: [['joint_xr']],
  extrasOk: () => [],
  teaching: [
    '転倒して手をついた高齢女性の手首の痛み・腫脹・フォーク状変形は橈骨遠位端骨折（Colles骨折）。骨粗鬆症による脆弱性骨折の代表。',
    'X線2方向で確認。正中神経障害（しびれ）・循環障害をチェック。',
    '転位があれば徒手整復とギプス固定、不安定なら手術。',
    '「なぜ転んだか」（失神・めまい・薬剤）と、骨粗鬆症の評価・治療（次の大腿骨骨折の予防）を忘れない。',
  ],
  sources: ['橈骨遠位端骨折診療ガイドライン2017（日本整形外科学会）'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 5 }, { a: 'consult', dept: 'ortho', delayMin: 20 }, { a: 'wait', min: 120 }],
};
