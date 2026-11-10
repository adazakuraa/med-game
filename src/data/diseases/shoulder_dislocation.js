// 肩関節前方脱臼
// 出典: 日本整形外科学会 症状・病気をしらべる「肩関節脱臼」
export default {
  id: 'shoulder_dislocation', name: '肩関節脱臼', dept: '整形外科',
  weight: 2, season: { winter: 1.2 }, minLevel: 1,
  demo: { age: [17, 40], ageMode: 'young', male: 0.8 },
  sev: { p: [0.6, 0.35, 0.05], burden: [[22, 30], [30, 38], [38, 44]] },
  refractoryP: [0, 0, 0], comorb: { extra: {} }, organisms: [],
  untreatedFatal: false, noPregnancy: true,
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['ラグビーのタックルで腕を後ろに持っていかれて', 'スノーボードで転んで手をついて', '柔道で投げられて']) }),
  cc: (v) => `${v.side}肩が外れた`, ccKey: 'injury',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '1時間前、{how}、{side}肩が抜けた感じがしました。' },
    character: { p: 1, text: '肩がとても痛くて、腕を動かせません。反対の手で腕を支えています。' },
    location: { p: 1, text: '{side}肩です。' },
    trigger: { p: 1, text: '{how}。頭は打っていません。' },
    pmh: { p: 0.4, text: '前にも一度、同じ肩が外れたことがあります。' },
    numbness: { p: 0.3, text: '肩の外側の皮膚が少ししびれる感じがします。' },
    aggravating: { p: 1, text: '少しでも動かすと激痛です。' },
    syncope: { p: 0, text: '' }, dizziness: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}肩の三角筋の膨らみが消失し、肩峰が角ばって突出（肩峰下の空虚）。烏口突起下に骨頭を触れる。上肢は軽度外転・外旋位で固定（弾発性固定）。橈骨動脈は触知、手指の運動・感覚は保たれる。' } },
  vitals: { HR: { add: [5, 15], k: 1 } },
  labs: {},
  tests: { joint_xr: [{ p: 1, persist: true, text: '{side}肩：上腕骨頭が関節窩の前下方（烏口突起下）に脱臼。明らかな骨折なし。' }] },
  natural: 0,
  curedBy: 'reduction',
  therapies: [
    { id: 'reduction', label: '整形外科コンサルト→X線で骨折を確認してから整復（鎮痛・鎮静下）、三角巾固定', req: { procDone: 'reduction' }, required: true, deadlineH: [12, 8, 6] },
    { id: 'pain', label: '鎮痛', req: { anyTag: ['analgesic', 'opioid'] }, required: true, deadlineH: [2, 2, 2] },
  ],
  procedures: [{
    id: 'reduction', depts: ['ortho'], label: '徒手整復・固定', delay: 30, duration: 20, after: 'er',
    decide: (enc) => {
      const xr = enc.tests.some((t) => t.id === 'joint_xr' && t.done);
      if (!xr) return { accept: false, text: '整復の前に肩のX線で脱臼の方向と骨折の有無を確認してください。' };
      return { accept: true, reveal: true, text: '肩関節前方脱臼です。鎮痛下にゼロポジション法で整復します（約30分後）。整復後に神経・血管とX線を再確認します。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 10); },
    doneText: '整形外科：肩関節を整復し、三角巾で固定しました。腋窩神経の障害はありません。若い方は再脱臼しやすいので、整形外科外来でフォローします。',
  }],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '整復できれば三角巾固定で帰宅（整形外科外来で再脱臼の予防・手術を相談）' }),
  useful: ['joint_xr'],
  key: [['joint_xr']],
  extrasOk: () => [],
  teaching: [
    '転倒やタックルで腕を外転・外旋されて起こる肩の激痛・変形（三角筋の膨らみ消失）は肩関節前方脱臼。',
    '整復の前にX線で骨折（上腕骨大結節・頸部）を確認し、腋窩神経（肩外側の感覚）・橈骨動脈を診る。',
    '鎮痛（必要なら鎮静）下に愛護的に整復し、整復後に神経血管とX線を再確認。若年者は再脱臼しやすい。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「肩関節脱臼」'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 5 }, { a: 'consult', dept: 'ortho', delayMin: 20 }, { a: 'wait', min: 120 }],
};
