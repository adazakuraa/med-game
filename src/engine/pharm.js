// 処方の妥当性評価（用量・腎機能・アレルギー・禁忌・相互作用）
import { DRUG_BY_ID, FREQS, HOME_MEDS } from '../data/drugs.js';
import { DISEASE_BY_ID } from '../data/diseases/index.js';
import { labValue, crcl } from './physiology.js';

const CROSS = { penicillin: ['cephem', 'carbapenem'], cephem: ['penicillin'] };

// 禁忌・慎重投与ルール
export const CONTRA_RULES = {
  pregnancy: { level: 'harm', msg: '妊婦には禁忌', check: (c) => c.p.pregnant },
  quinolone_child: { level: 'harm', msg: '小児には原則禁忌', check: (c) => c.p.age < 15 },
  severe_liver: { level: 'harm', msg: '重篤な肝障害には禁忌', check: (c) => c.lab('AST') > 300 },
  pud: { level: 'harm', msg: '消化性潰瘍・消化管出血のある患者には禁忌', check: (c) => c.p.comorb.includes('pud') || c.p.diseaseId === 'ugib' },
  severe_renal: { level: 'harm', msg: '重篤な腎障害には禁忌', check: (c) => c.lab('EGFR') < 30 },
  severe_hf: { level: 'harm', msg: '重篤な心機能不全には禁忌', check: (c) => c.p.diseaseId === 'adhf' || c.p.comorb.includes('chf') },
  aspirin_asthma: { level: 'harm', msg: 'アスピリン喘息（NSAIDs過敏喘息）には禁忌', check: (c) => c.p.comorb.includes('asthma_nsaid') },
  late_pregnancy: { level: 'harm', msg: '妊娠後期には禁忌', check: (c) => c.p.pregnant },
  dehydration_aki: { level: 'warn', msg: '脱水状態では腎障害・低血圧のリスク', check: (c) => c.st.volume > 1500 },
  gi_obstruction: { level: 'harm', msg: '消化管の器質的閉塞・穿孔・出血には禁忌', check: (c) => c.st.perforated || ['sbo', 'ugib'].includes(c.p.diseaseId) },
  glaucoma: { level: 'harm', msg: '閉塞隅角緑内障には禁忌', check: (c) => c.p.comorb.includes('glaucoma') },
  bph: { level: 'harm', msg: '前立腺肥大による排尿障害には禁忌', check: (c) => c.p.comorb.includes('bph') },
  severe_heart: { level: 'harm', msg: '重篤な心疾患には禁忌', check: (c) => c.p.diseaseId === 'adhf' },
  paralytic_ileus: { level: 'harm', msg: '麻痺性イレウス・腸閉塞には禁忌', check: (c) => c.st.perforated || c.p.diseaseId === 'sbo' },
  sbp90: { level: 'harm', msg: '収縮期血圧90mmHg未満では禁忌', check: (c) => c.vit.SBP < 90 },
  pde5: { level: 'harm', msg: 'PDE5阻害薬（シルデナフィル等）使用中は併用禁忌：重篤な低血圧', check: (c) => c.p.homeMeds.includes('sildenafil'), event: 'hypotension' },
  hyperk: { level: 'harm', msg: '高カリウム血症（K≥5.0）では禁忌', check: (c) => c.lab('K') >= 5.0 },
  rv_infarct: { level: 'harm', msg: '右室梗塞の合併が疑われる下壁梗塞では硝酸薬で高度の低血圧を起こしうる', check: (c) => !!c.p.vars.rvInfarct, event: 'hypotension' },
  cardiogenic: { level: 'harm', msg: '心原性ショック・急性心不全ではβ遮断薬が心機能をさらに低下させる', check: (c) => c.vit.SBP < 90 || c.p.diseaseId === 'adhf' },
  tpa_bp: { level: 'harm', msg: '血圧185/110mmHg超（血栓溶解・トリプタンで脳出血などのリスク）', check: (c) => c.vit.SBP > 185 },
  tpa_anticoag: { level: 'harm', msg: '抗凝固薬内服中の血栓溶解療法（出血リスク）', check: (c) => c.p.homeMeds.some((m) => ['warfarin', 'apixaban'].includes(m)) },
  tpa_glucose: { level: 'harm', msg: '低血糖（<50mg/dL）は脳卒中と似た症状を起こす。血糖を確認・補正してから', check: (c) => c.lab('GLU') < 50 },
  coronary: { level: 'harm', msg: '虚血性心疾患・脳血管障害には禁忌', check: (c) => ['acs', 'stroke'].includes(c.p.diseaseId) },
  asthma_bb: { level: 'harm', msg: '気管支喘息・COPDの増悪にβ遮断薬（気管支攣縮の悪化）', check: (c) => c.p.comorb.includes('asthma') || c.p.comorb.includes('asthma_nsaid') || ['asthma', 'copd'].includes(c.p.diseaseId) },
  hfref: { level: 'harm', msg: '心機能低下（収縮不全・心不全）ではCa拮抗薬（ジルチアゼム）が心不全を悪化させる', check: (c) => c.p.comorb.includes('chf') || c.p.diseaseId === 'adhf' },
  resp_failure: { level: 'warn', msg: '呼吸不全・CO2貯留がある患者に鎮静薬（呼吸抑制）', check: (c) => c.p.diseaseId === 'copd' || c.vit.SpO2 < 90 },
  seizure_risk: { level: 'harm', msg: 'ベンゾジアゼピン常用者・けいれんの既往では拮抗薬でけいれんを誘発', check: (c) => c.p.comorb.includes('epilepsy') || c.p.diseaseId === 'intox' },
  elderly_benzo: { level: 'warn', msg: '高齢者へのベンゾジアゼピン系睡眠薬（転倒・骨折・せん妄・依存のリスク）', check: (c) => c.p.age >= 65 },
  asthma_atp: { level: 'harm', msg: '気管支喘息ではATP（アデノシン）が気管支攣縮を誘発するため禁忌', check: (c) => c.p.comorb.includes('asthma') || c.p.diseaseId === 'asthma' },
  hypok_severe: { level: 'warn', msg: '低カリウム血症を悪化させる', check: (c) => c.lab('K') < 3.0 },
};

function tagsOfHome(p) {
  const tags = new Set();
  for (const m of p.homeMeds) for (const t of HOME_MEDS[m].tags) tags.add(t);
  if (p.alcohol === 'daily') tags.add('alcohol');
  return tags;
}

/**
 * @returns {{issues: {level:'harm'|'warn'|'info', code:string, msg:string}[], doseFactor:number, events:string[]}}
 */
export function evaluateRx(enc, order, vit, activeOrders = []) {
  const d = DRUG_BY_ID[order.drugId];
  const p = enc.patient, st = enc.state;
  const cache = {};
  const c = { p, st, vit, lab: (id) => labValue(enc, id, cache) };
  const issues = [];
  const events = [];
  let doseFactor = 1;
  const r = d.routes[order.route];
  if (!r) return { issues: [{ level: 'harm', code: 'route', msg: 'この経路では投与できない' }], doseFactor: 0, events };

  // 用量
  const dose = Number(order.dose);
  const freq = FREQS[order.freq];
  let perKg = null;
  if (d.id === 'insulin_r') {
    perKg = dose / p.weight;
    if (perKg < 0.05) { doseFactor = 0.4; issues.push({ level: 'warn', code: 'underdose', msg: `インスリン ${perKg.toFixed(2)}単位/kg/時は少なすぎる（目安0.1単位/kg/時）` }); }
    else if (perKg > 0.16) issues.push({ level: 'harm', code: 'overdose', msg: `インスリン ${perKg.toFixed(2)}単位/kg/時は過量（低血糖・低K血症のリスク）` });
  } else if (r.perKgOnce) {
    perKg = dose / p.weight;
    if (perKg < r.perKgOnce[0] * 0.85) { doseFactor = 0.5; issues.push({ level: 'warn', code: 'underdose', msg: `${perKg.toFixed(2)}${r.unit}/kgは少ない（目安 ${r.perKgOnce[0]}〜${r.perKgOnce[1]}${r.unit}/kg）` }); }
    else if (perKg > r.perKgOnce[1] * 1.15 || dose > r.max * 1.001) issues.push({ level: 'harm', code: 'overdose', msg: `${perKg.toFixed(2)}${r.unit}/kgは過量（目安 ${r.perKgOnce[0]}〜${r.perKgOnce[1]}${r.unit}/kg、上限${r.max}${r.unit}）` });
  } else if (r.perKg) {
    perKg = dose / p.weight;
    if (perKg < r.perKg[0] * 0.8) { doseFactor = 0.45; issues.push({ level: 'warn', code: 'underdose', msg: `${perKg.toFixed(1)}${r.unit}/kgは少なすぎる（目安 ${r.perKg[0]}〜${r.perKg[1]}${r.unit}/kg）` }); }
    else if (perKg > r.perKg[1] * 1.25) issues.push({ level: 'harm', code: 'overdose', msg: `${perKg.toFixed(1)}${r.unit}/kgは過量（目安 ${r.perKg[0]}〜${r.perKg[1]}${r.unit}/kg）` });
  } else if (dose < r.min) {
    doseFactor = 0.45;
    issues.push({ level: 'warn', code: 'underdose', msg: `1回量が少ない（通常 ${r.min}〜${r.max}${r.unit}）` });
  } else if (dose > r.max * 1.001) {
    issues.push({ level: 'harm', code: 'overdose', msg: `1回量が多すぎる（上限 ${r.max}${r.unit}）` });
  }
  if (!r.freqs.includes(order.freq)) {
    doseFactor *= 0.6;
    issues.push({ level: 'warn', code: 'freq', msg: `投与頻度が不適切（推奨: ${r.freqs.map((f) => FREQS[f].label).join('・')}）` });
  }
  if (r.maxDaily && order.freq !== 'cont') {
    const daily = dose * (order.freq === 'once' ? 1 : freq.perDay);
    let max = r.maxDaily;
    if (r.weightMaxPerKgDaily && p.weight < 50) max = Math.min(max, r.weightMaxPerKgDaily * p.weight);
    const cc = crcl(enc, cache);
    let renalRule = null;
    for (const rr of d.renal || []) if (cc < rr.crclBelow) renalRule = rr;
    if (renalRule && daily > renalRule.maxDaily * 1.001) {
      issues.push({ level: 'warn', code: 'renal', msg: `腎機能（推定CrCl ${Math.round(cc)}mL/分）に対し過量：${renalRule.text}` });
    } else if (daily > max * 1.001) {
      issues.push({ level: 'harm', code: 'overdose', msg: `1日量 ${daily}${r.unit} は上限 ${max}${r.unit} を超える` });
    }
  }
  if (d.id === 'kcl' && dose > 20) issues.push({ level: 'harm', code: 'kcl_rate', msg: 'KCl 20mEq/時超は致死的不整脈のリスク' });

  // アレルギー
  if (d.allergy && p.allergies.includes(d.allergy)) {
    issues.push({ level: 'harm', code: 'allergy', msg: `アレルギー歴のある薬剤（${d.generic}）` });
    events.push('anaphylaxis');
  } else if (d.allergy) {
    for (const a of p.allergies) if (CROSS[a]?.includes(d.allergy)) issues.push({ level: 'info', code: 'cross', msg: '交差反応の可能性がある系統（アレルギー歴の詳細を確認）' });
  }
  if (d.allergy === 'nsaid' && p.comorb.includes('asthma_nsaid')) events.push('bronchospasm');

  // 禁忌
  for (const id of d.contra || []) {
    const rule = CONTRA_RULES[id];
    if (rule.check(c)) {
      issues.push({ level: rule.level, code: id, msg: rule.msg });
      if (rule.event) events.push(rule.event);
    }
  }
  // 相互作用
  const homeTags = tagsOfHome(p);
  for (const it of d.interact || []) {
    const activeTags = new Set(activeOrders.flatMap((o) => (o.kind === 'rx' ? DRUG_BY_ID[o.drugId].tags || [] : [])));
    const quin = activeOrders.some((o) => o.kind === 'rx' && DRUG_BY_ID[o.drugId].allergy === 'quinolone');
    if (homeTags.has(it.tag) || activeTags.has(it.tag) || (it.tag === 'quinolone' && quin)) {
      if (it.reduceRoute && it.reduceRoute !== order.route) continue;
      issues.push({ level: it.level, code: 'interact_' + it.tag, msg: it.msg });
      if (it.reduceRoute) doseFactor *= 0.5;
    }
  }
  // 疾患特異的な有害処方
  const dz = DISEASE_BY_ID[p.diseaseId];
  for (const t of d.tags || []) {
    if (dz.harmTags?.[t]) {
      if (t === 'bicarbonate' && labValue(enc, 'PH', cache) < 6.9) continue;
      issues.push({ level: 'harm', code: 'dz_' + t, msg: dz.harmTags[t] });
    }
  }
  if (d.abx && dz.harmTags?.abx) issues.push({ level: 'warn', code: 'dz_abx', msg: dz.harmTags.abx });
  if (d.abx && !dz.organisms.length && !dz.harmTags?.abx) issues.push({ level: 'warn', code: 'abx_unneeded', msg: '細菌感染症の根拠がない状況での抗菌薬投与' });
  if (d.broad && dz.organisms.length && !(p.vars.res?.esbl)) issues.push({ level: 'info', code: 'broad', msg: 'より狭域の抗菌薬で治療可能（広域抗菌薬の温存）' });
  if (d.tags?.includes('thrombolytic') && dz.id !== 'stroke') issues.push({ level: 'harm', code: 'tpa_wrong', msg: '脳梗塞ではない患者への血栓溶解薬（出血のリスク）' });
  if (d.tags?.includes('thrombolytic') && dz.id === 'stroke' && p.vars.lastNormalH + enc.t / 60 > 4.5) issues.push({ level: 'harm', code: 'tpa_window', msg: '発症（最終健常）から4.5時間を超えた血栓溶解療法（出血リスクが利益を上回る）' });
  if (d.id === 'glucose50' && p.alcohol === 'daily' && !activeOrders.some((o) => o.drugId === 'thiamine')) issues.push({ level: 'warn', code: 'no_thiamine', msg: 'アルコール多飲者にビタミンB1なしでブドウ糖（Wernicke脳症のリスク）' });
  if (d.id === 'insulin_r' && labValue(enc, 'K', cache) < 3.3) issues.push({ level: 'harm', code: 'insulin_lowk', msg: '血清K<3.3でのインスリン開始（致死的不整脈のリスク）' });
  if (d.id === 'insulin_r' && dz.id !== 'dka' && labValue(enc, 'GLU', cache) < 250) issues.push({ level: 'harm', code: 'insulin_unneeded', msg: '高血糖緊急症ではない患者へのインスリン持続静注（低血糖のリスク）' });
  if (d.id === 'norad' && st.volume > 1500) issues.push({ level: 'warn', code: 'pressor_novol', msg: '十分な輸液を行う前の昇圧薬' });
  if (d.tags?.includes('diuretic') && dz.id !== 'adhf' && st.volume > 500) issues.push({ level: 'harm', code: 'diuretic_dry', msg: '脱水状態での利尿薬（循環血液量減少・腎障害の悪化）' });
  if (d.tags?.includes('thrombolytic') && issues.some((i) => i.level === 'harm')) events.push('ich');
  return { issues, doseFactor, events };
}

/** 輸液オーダーの評価 */
export function evaluateFluid(enc, order) {
  const dz = DISEASE_BY_ID[enc.patient.diseaseId];
  const issues = [];
  if (dz.harmFluid && order.mode === 'bolus' && order.volume > dz.harmFluid.maxBolus) issues.push({ level: 'harm', code: 'fluid_hf', msg: dz.harmFluid.msg });
  if (dz.harmFluid && order.mode === 'cont' && order.rate > 80) issues.push({ level: 'warn', code: 'fluid_hf_cont', msg: '心不全患者への多量の維持輸液' });
  if (order.mode === 'cont' && order.rate > 500) issues.push({ level: 'warn', code: 'fluid_fast', msg: '持続輸液の速度が非常に速い' });
  if (order.fluidId === 'sol3' && labValue(enc, 'K', {}) >= 5.5) issues.push({ level: 'warn', code: 'sol3_k', msg: '高K血症の患者にK含有輸液' });
  return { issues };
}
