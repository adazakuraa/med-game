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
