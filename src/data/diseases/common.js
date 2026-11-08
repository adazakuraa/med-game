// 疾患データ共通のヘルパー（重症度スコア等）

/** A-DROP（日本呼吸器学会）: 来院時の値で評価 */
export function adrop(enc, ctx) {
  const p = enc.patient;
  const v = ctx.initVit;
  let s = 0;
  if ((p.sex === 'M' && p.age >= 70) || (p.sex === 'F' && p.age >= 75)) s++;
  if (ctx.initLab('BUN') >= 21 || enc.patient.initVolume > 1500) s++;
  if (v.SpO2 <= 90) s++;
  if (v.JCS > 0) s++;
  if (v.SBP <= 90) s++;
  return s;
}

/** qSOFA */
export function qsofa(v) {
  return (v.RR >= 22 ? 1 : 0) + (v.SBP <= 100 ? 1 : 0) + (v.JCS > 0 ? 1 : 0);
}

/** 感染症で「敗血症」「敗血症性ショック」を併記しても減点しない条件 */
export function sepsisExtras(enc, ctx) {
  const v = ctx.initVit;
  const out = [];
  if (qsofa(v) >= 2 || ctx.initLab('LAC') > 2 || v.SBP < 90) out.push('sepsis');
  if (v.SBP < 90) out.push('septic_shock');
  if (ctx.initLab('CR') >= enc.patient.crBase * 1.5) out.push('aki');
  if (enc.patient.initVolume > 1500) out.push('dehydration');
  return out;
}

// ===== 疾患データを短く書くための部品 =====
export const T = {
  /** 抗菌薬（原因菌のカバー） */
  abx: (keys, label, deadlineH = [8, 4, 1], effect = -1.2, lagH = 5) => ({ id: 'abx', label, req: { coverage: keys }, effect, lagH, required: true, deadlineH }),
  /** 初期輸液（条件つき） */
  fluid: (total = 1000, label = '細胞外液の補液', when = (c) => c.vit.SBP < 90 || c.state.volume > 1500, deadlineH = [3, 2, 1]) => ({ id: 'fluid', label, req: { fluidTotal: total }, when, required: true, deadlineH, startFromNeed: true }),
  /** 酸素（SpO2<90%） */
  o2: () => ({ id: 'o2', label: '酸素投与（SpO2<90%）', req: { o2: true }, when: (c) => c.rawSpO2 < 90, required: true, deadlineH: [0.5, 0.5, 0.25] }),
  /** 鎮痛 */
  pain: (deadlineH = [2, 1, 1], effect = 0) => ({ id: 'pain', label: '鎮痛', req: { anyTag: ['analgesic', 'opioid'] }, required: true, deadlineH, effect, lagH: 0.3 }),
  /** タグの薬 */
  tag: (id, label, tag, deadlineH, effect = 0, lagH = 0.5, required = true) => ({ id, label, req: { tag }, effect, lagH, required, deadlineH }),
  /** コンサルトで行う処置 */
  proc: (id, label, deadlineH, required = true) => ({ id, label, req: { procDone: id }, required, deadlineH }),
};

/** 重症度ごとの方針（例: ['home','admit','icu']） */
export function dispoBySev(list, whys) {
  const name = { home: '帰宅（外来）', admit: '入院', icu: 'ICU' };
  return (enc) => {
    const best = list[enc.patient.sev];
    const ok = [best];
    if (best === 'home') ok.push('admit');
    if (best === 'icu') ok.push('admit');
    return { ok, best, why: whys?.[enc.patient.sev] || `${name[best]}が妥当` };
  };
}

/** コンサルトで画像などの所見を確認してから処置を受ける、という典型的な判断 */
export function procByImaging({ id, depts, label, tests, delay = 90, duration = 120, after = 'ward', acceptText, needText, doneText, onDone, onlyIf }) {
  return {
    id, depts, label, delay, duration, after, doneText,
    decide: (enc) => {
      const ok = enc.tests.some((t) => tests.includes(t.id) && t.done && t.result.abnormal);
      if (!ok) return { accept: false, text: needText };
      if (onlyIf && !onlyIf(enc)) return { accept: false, reveal: true, text: onlyIf.noText || '現時点では処置の適応はありません。保存的に治療してください。' };
      return { accept: true, reveal: true, text: acceptText };
    },
    onDone: onDone || ((enc) => { enc.state.burden = Math.min(enc.state.burden, 22); }),
  };
}

/** 外来でよく見る軽症疾患の既定値（必要な項目だけ上書きする） */
export function outpatient(o) {
  return {
    dept: '内科', weight: 6, season: {}, minLevel: 1,
    sev: { p: [0.6, 0.35, 0.05], burden: [[15, 22], [22, 30], [30, 38]] },
    refractoryP: [0, 0, 0], comorb: { extra: { htn: 0.2, dyslip: 0.15 } }, organisms: [], untreatedFatal: false,
    arrival: () => 'walk', vitals: {}, labs: {}, tests: {}, natural: -0.2, therapies: [],
    dispo: () => ({ ok: ['home'], best: 'home', why: '外来で治療・経過観察' }),
    useful: [], key: [], extrasOk: () => [],
    ...o,
  };
}
