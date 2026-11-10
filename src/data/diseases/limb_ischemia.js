// 急性下肢動脈閉塞（塞栓症）
// 出典: 日本循環器学会ほか『2022年改訂版 末梢動脈疾患ガイドライン』
export default {
  id: 'limb_ischemia', name: '急性下肢動脈閉塞', dept: '心臓血管外科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [60, 90], ageMode: 'old', male: 0.55 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[30, 40], [40, 50], [52, 62]] },
  refractoryP: [0, 0.03, 0.08],
  comorb: { extra: { htn: 0.7, af: 1, dyslip: 0.4 } },
  organisms: [],
  vars: (rng, sev, pt) => { const stopped = rng.chance(0.6); if (stopped) { for (let i = pt.homeMeds.length - 1; i >= 0; i--) if (['warfarin', 'apixaban'].includes(pt.homeMeds[i])) pt.homeMeds.splice(i, 1); } return { side: rng.pick(['右', '左']), hrs: rng.int(2, 6), stopped }; },
  cc: (v) => `急に${v.side}足が痛くて冷たい`, ccKey: 'leg_red',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '{hrs}時間前、急に{side}足が激しく痛くなりました。' },
    course: { p: 1, text: 'どんどん痛くなって、足がしびれて動かしにくいです。' },
    character: { p: 1, text: '{side}の膝から下が冷たくて、色が白っぽいです。' },
    pmh: { p: 1, text: '心房細動があります。' },
    meds: { p: 1, ifVar: 'stopped', text: '歯の治療のために、1週間前から血液をサラサラにする薬をやめていました。' },
    fever: { p: 0, text: '' }, trigger: { p: 0, text: '' }, chills: { p: 0, text: '' },
    immobility: { p: 0, text: '' },
  },
  exam: {
    leg_pulse: { p: 1, text: '{side}膝窩動脈・足背動脈が触知できない（大腿動脈は触知）。反対側は良好。' },
    calf: { p: 1, text: '{side}下腿が蒼白で冷たい。腫脹はない。' },
    skin: { p: 0.8, text: '{side}足の蒼白とまだらな皮膚色。発赤・熱感はない。' },
    motor: { p: [0.2, 0.6, 0.95], text: '{side}足趾の運動・感覚が低下。' },
    heart_ausc: { p: 1, text: '脈が不規則（心房細動）。' },
  },
  vitals: {},
  labs: { CK: { add: [100, 3000], k: 1.5 }, LAC: { to: [2, 4], k: 2 } },
  tests: {
    leg_cta: [{ p: 1, persist: true, text: '{side}浅大腿動脈〜膝窩動脈が途絶（塞栓性閉塞）。末梢の側副血行は乏しい。' }],
    leg_us: [{ p: 0.8, text: '{side}膝窩動脈に血流なし。深部静脈に血栓なし。' }],
    echo: [{ p: 0.3, text: '左房拡大。左心耳に血栓の疑い。' }],
  },
  natural: 0.45,
  curedBy: 'embolectomy',
  therapies: [
    { id: 'hep', label: 'ヘパリン静注（血栓の進展予防）', req: { anyTag: ['anticoag_bolus', 'anticoag'] }, required: true, deadlineH: [2, 1, 1], effect: -0.2, lagH: 0 },
    { id: 'embolectomy', label: '心臓血管外科コンサルト→血栓除去術（Fogartyカテーテル）', req: { procDone: 'embolectomy' }, required: true, deadlineH: [8, 6, 4] },
  ],
  procedures: [{
    id: 'embolectomy', depts: ['cvs'], label: '血栓除去術', delay: 60, duration: 90, after: 'ward',
    decide: (enc) => {
      const img = enc.tests.some((t) => ['leg_cta', 'leg_us'].includes(t.id) && t.done && t.result.abnormal);
      if (!img && enc.patient.sev < 2) return { accept: false, text: '下肢の脈が触れないなら急性動脈閉塞を疑います。閉塞部位の確認に下肢動脈造影CTをお願いします。ヘパリンはすぐに開始してください。' };
      return { accept: true, reveal: true, text: '心房細動による急性下肢動脈塞栓症です。緊急で血栓除去術を行います（約60分後）。ヘパリンを継続してください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 22); },
    doneText: '心臓血管外科：Fogartyカテーテルで血栓を除去し、末梢の拍動が回復しました。',
  }],
  residualAbove: 30, residualText: '下肢の壊死が進み、切断が必要になりました。',
  dispo: () => ({ ok: ['admit', 'icu'], best: 'admit', why: '急性下肢動脈閉塞：緊急手術・入院（再灌流障害に注意）' }),
  useful: ['leg_cta', 'leg_us', 'ecg', 'cbc', 'chem', 'coag', 'lab_CK', 'vbg', 'echo'],
  key: [['leg_cta', 'leg_us'], ['coag'], ['ecg']],
  extrasOk: () => ['af_rvr'],
  teaching: [
    '突然の下肢の激痛・冷感・蒼白・脈拍消失は急性動脈閉塞（6P：Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia）。深部静脈血栓症（腫れて赤い）と区別する。',
    '原因は心房細動による塞栓が多い（抗凝固薬の中断に注意）。',
    'すぐにヘパリンを静注し、心臓血管外科へ。6時間以内の血行再建が目標。知覚・運動障害は時間がない徴候。',
    '再灌流後は高K血症・横紋筋融解・コンパートメント症候群に注意。',
  ],
  sources: ['2022年改訂版 末梢動脈疾患ガイドライン（日本循環器学会ほか）'],
  ideal: (p) => [
    { a: 'test', ids: ['ecg', 'cbc', 'chem', 'coag', 'leg_cta'] },
    { a: 'rx', drugId: 'heparin_bolus', route: 'iv', dose: 5000, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'heparin', route: 'iv', dose: Math.round(p.weight * 15 / 100) * 100, freq: 'cont', days: 3 },
    { a: 'consult', dept: 'cvs', delayMin: 50 },
  ],
};
