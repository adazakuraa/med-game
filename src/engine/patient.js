// 疾患モデルからルールベースで患者を生成する
import { makeRng, clamp, hashRand } from './rng.js';
import { DISEASES, DISEASE_BY_ID } from '../data/diseases/index.js';
import { LABS } from '../data/labs.js';
import { SURNAMES, GIVEN_M, GIVEN_F, OCCUPATIONS } from '../data/names.js';

export const COMORB = {
  htn: { name: '高血圧症', meds: ['amlodipine'], minAge: 35 },
  dm2: { name: '2型糖尿病', meds: ['metformin', 'sitagliptin'], minAge: 35 },
  t1dm: { name: '1型糖尿病', meds: ['glargine', 'lispro'] },
  chf: { name: '慢性心不全', meds: ['furosemide_po', 'carvedilol', 'enalapril'] },
  af: { name: '心房細動', meds: ['__anticoag'], minAge: 50 },
  ckd: { name: '慢性腎臓病', meds: [], minAge: 40 },
  dyslip: { name: '脂質異常症', meds: ['atorvastatin'], minAge: 35 },
  bph: { name: '前立腺肥大症', meds: ['tamsulosin'], sex: 'M', minAge: 55 },
  glaucoma: { name: '緑内障（閉塞隅角）', meds: ['latanoprost'], minAge: 50 },
  pud: { name: '胃潰瘍（治療中）', meds: ['famotidine'] },
  asthma_nsaid: { name: '気管支喘息（解熱鎮痛薬で発作の既往）', meds: ['montelukast'] },
  constip: { name: '便秘症', meds: ['mgo'] },
  ed: { name: '勃起不全', meds: ['sildenafil'], sex: 'M', minAge: 45, hidden: true },
  epilepsy: { name: 'てんかん', meds: ['valproate'] },
  cancer: { name: '大腸がん（化学療法中）', meds: [], minAge: 40 },
  asthma: { name: '気管支喘息', meds: ['ics'] },
  cirrhosis: { name: '肝硬変（アルコール性）', meds: [], minAge: 40 },
  insomnia: { name: '不眠症', meds: ['benzo_home'] },
  dementia: { name: '認知症', meds: ['donepezil'], minAge: 65 },
  old_stroke: { name: '脳梗塞後遺症', meds: [], minAge: 55 },
  copd: { name: 'COPD（慢性閉塞性肺疾患）', meds: ['lama'], minAge: 50 },
};

// 一般的な背景疾患の付与確率（年齢で補正）
const GENERIC_COMORB = { pud: 0.04, glaucoma: 0.03, asthma_nsaid: 0.02, epilepsy: 0.01, ed: 0.05 };

const ALLERGIES = [
  { id: 'penicillin', name: 'ペニシリン系抗菌薬', reaction: '全身にじんましんが出ました', p: 0.07 },
  { id: 'cephem', name: 'セフェム系抗菌薬', reaction: '発疹が出ました', p: 0.03 },
  { id: 'quinolone', name: 'ニューキノロン系抗菌薬（レボフロキサシン）', reaction: '発疹が出ました', p: 0.02 },
  { id: 'nsaid', name: '解熱鎮痛薬（ロキソニン）', reaction: '息苦しくなりました', p: 0.03 },
  { id: 'contrast', name: '造影剤', reaction: 'CTのときにじんましんが出ました', p: 0.03 },
];

const SURGERY_HX = ['胆嚢摘出術（腹腔鏡）', '帝王切開', '鼠径ヘルニア手術', '虫垂切除術', '白内障手術'];

function seasonOf(month) {
  if ([12, 1, 2].includes(month)) return 'winter';
  if ([6, 7, 8].includes(month)) return 'summer';
  return 'other';
}

export function diseaseWeight(d, month, level) {
  if (level < d.minLevel) return 0;
  const s = seasonOf(month);
  return d.weight * (d.season?.[s] ?? 1);
}

export function pickDisease(rng, month, level) {
  return rng.weighted(DISEASES, (d) => diseaseWeight(d, month, level));
}

const pv = (p, sev) => (Array.isArray(p) ? p[sev] : p);

/**
 * @param {object} o { seed, diseaseId?, sev?, month, level }
 */
export function generatePatient(o) {
  const seed = o.seed >>> 0;
  const rng = makeRng(seed);
  const level = o.level ?? 1;
  const d = o.diseaseId ? DISEASE_BY_ID[o.diseaseId] : pickDisease(rng, o.month ?? 1, level);

  // 重症度（重症はレベル3以上で出現）
  let sev = o.sev ?? rng.weighted([0, 1, 2], (i) => d.sev.p[i]);
  if (o.sev == null && sev === 2 && level < 3) sev = 1;

  // 年齢・性別
  const [a0, a1] = d.demo.age;
  let u = rng.next();
  if (d.demo.ageMode === 'old') u = Math.sqrt(u);
  if (d.demo.ageMode === 'young') u = 1 - Math.sqrt(1 - u);
  const age = Math.round(a0 + (a1 - a0) * u);
  const sex = rng.chance(d.demo.male) ? 'M' : 'F';

  // 背景疾患
  const comorb = [...(d.comorb.forced || [])];
  const ageF = clamp((age - 30) / 50, 0.2, 1.4);
  for (const [id, p] of Object.entries({ ...GENERIC_COMORB, ...(d.comorb.extra || {}) })) {
    const c = COMORB[id];
    if (comorb.includes(id)) continue;
    if (c.sex && c.sex !== sex) continue;
    if (c.minAge && age < c.minAge) continue;
    if (id === 'dm2' && comorb.includes('t1dm')) continue;
    if (rng.chance(p * ageF)) comorb.push(id);
  }

  // 常用薬
  const homeMeds = [];
  for (const id of comorb) {
    for (const m of COMORB[id].meds) {
      if (m === '__anticoag') homeMeds.push(rng.chance(0.4) ? 'warfarin' : 'apixaban');
      else if (id === 'dm2' && m === 'sitagliptin' && rng.chance(0.5)) continue;
      else homeMeds.push(m);
    }
  }

  // アレルギー
  const allergies = [];
  for (const a of ALLERGIES) if (rng.chance(a.p)) allergies.push(a.id);

  // 体格
  const weight = Math.max(36, Math.round(
    (sex === 'M' ? rng.normal(age > 75 ? 58 : 67, 8) : rng.normal(age > 75 ? 47 : 54, 7)) + (d.weightAdj || 0)
  ));
  const pregnant = d.forcePregnant || (sex === 'F' && age >= 18 && age <= 42 && !d.noPregnancy && rng.chance(d.id === 'pyelo' ? 0.1 : 0.04));

  // 検査の個体差（zスコア・反応性）
  const z = {}, r = {};
  // 検査項目ごとに独立した乱数（項目を追加しても他の患者の値が変わらないように）
  for (const id of Object.keys(LABS)) {
    const u1 = Math.max(1e-9, hashRand(seed, 'z1', id)), u2 = hashRand(seed, 'z2', id);
    z[id] = clamp(Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2), -1.8, 1.8);
    r[id] = 0.75 + 0.45 * hashRand(seed, 'r', id);
  }
  let crBase = LABS.CR.base[sex].m + z.CR * LABS.CR.base[sex].sd;
  if (comorb.includes('ckd')) crBase = rng.range(1.3, 2.3) * (sex === 'F' ? 0.8 : 1);
  if (age >= 75) crBase *= 1.12;
  const hba1cBase = comorb.includes('t1dm') ? rng.range(8.5, 11.5) : comorb.includes('dm2') ? rng.range(6.8, 8.6) : 5.5 + z.HBA1C * 0.25;

  // 疾患固有の変数
  const vars = d.vars ? d.vars(rng, sev, { age, sex, comorb, homeMeds }) : {};
  if (d.postVars) d.postVars(vars, sev);

  // 病状の重さ（burden）
  const [b0, b1] = d.sev.burden[sev];
  const burden0 = rng.range(b0, b1);
  const refractory = rng.chance(d.refractoryP?.[sev] ?? 0);

  // 所見のロール（患者ごとに固定）
  const rolls = { history: {}, exam: {}, tests: {}, labs: {}, ecg: [] };
  for (const [qid, h] of Object.entries(d.history || {})) {
    rolls.history[qid] = { on: rng.chance(pv(h.p, sev)), idx: rng.int(0, 9) };
  }
  for (const [eid, e] of Object.entries(d.exam || {})) {
    const arr = Array.isArray(e) ? e : [e];
    rolls.exam[eid] = arr.map((f) => (f.ifVar ? !!vars[f.ifVar] : true) && rng.chance(pv(f.p, sev)));
  }
  for (const [tid, t] of Object.entries(d.tests || {})) {
    if (Array.isArray(t)) rolls.tests[tid] = t.map((f) => (f.fecalith ? !!vars.fecalith : true) && (f.ifVar ? !!vars[f.ifVar] : true) && rng.chance(pv(f.p, sev)));
    else rolls.tests[tid] = rng.chance(pv(t.p, sev));
  }
  for (const [lid, l] of Object.entries(d.labs || {})) {
    rolls.labs[lid] = {
      on: rng.chance(l.p ?? 1),
      v: l.to ? rng.val(l.to) : l.add ? rng.val(l.add) : l.mul ? rng.val(l.mul) : 0,
      g: l.ord ? rng.int(l.ord[0], l.ord[1]) : 0,
    };
  }
  rolls.ecg = (d.ecg || []).map((f) => (f.ifVar ? !!vars[f.ifVar] : true) && rng.chance(pv(f.p, sev)));

  // バイタルの基礎値・疾患の目標値
  const baseVitals = {
    T: rng.range(36.3, 36.9),
    HR: rng.range(64, 82) + (comorb.includes('af') ? 10 : 0),
    RR: rng.range(12, 16),
    SBP: rng.range(112, 132) + (comorb.includes('htn') ? 12 : 0) + Math.max(0, age - 50) * 0.3,
    SpO2: age >= 75 ? rng.range(95, 97) : rng.range(97, 99),
  };
  const vitalTargets = {};
  for (const [k, v] of Object.entries(d.vitals || {})) {
    vitalTargets[k] = { to: v.to ? rng.val(v.to) : undefined, drop: v.drop ? rng.val(v.drop) : undefined, k: v.k ?? 1 };
  }

  const initVolume = d.initVolume ? rng.val(d.initVolume[sev]) : sev >= 1 ? rng.range(300, 1500) * sev : rng.range(0, 400);
  const initGlu = d.initGlu ? rng.val(d.initGlu[sev]) : null;

  // プロフィール
  const surgeryHx = vars.forceSurgery ? [vars.forceSurgery] : rng.chance(0.2) ? [rng.pick(SURGERY_HX.filter((s) => !(s === '帝王切開' && sex === 'M') && !(s === '虫垂切除術' && d.id === 'appendicitis')))] : [];
  const cur = d.smokeP ?? (sex === 'M' ? 0.3 : 0.1);
  const smoking = rng.weighted(['never', 'former', 'current'], (x) => ({ never: (1 - cur) * 0.7, former: (1 - cur) * 0.3, current: cur }[x]));
  let alcohol = rng.weighted(['none', 'social', 'daily'], (x) => ({ none: 0.4, social: 0.45, daily: 0.15 }[x]));
  if (vars.forceAlcohol) alcohol = 'daily';
  const occupation = rng.pick(age < 30 ? OCCUPATIONS.young : age < 65 ? OCCUPATIONS.mid : OCCUPATIONS.old);
  const family = rng.pick(['父が高血圧、母が糖尿病です。', '特にありません。', '父が脳梗塞をしています。', '母が高血圧です。', '父が胃がんでした。']);
  const name = rng.pick(SURNAMES) + ' ' + rng.pick(sex === 'M' ? GIVEN_M : GIVEN_F);
  const arrival = d.arrival(sev);
  const sevExtra = d.cc(vars, sev);

  return {
    seed, diseaseId: d.id, sev, refractory, name, age, sex, weight, pregnant,
    comorb, homeMeds, allergies, surgeryHx, smoking, alcohol, occupation, family,
    vars, burden0, rolls, z, r, baseVitals, vitalTargets, crBase, hba1cBase,
    initVolume, initGlu, arrival, cc: sevExtra,
    adherenceOk: !(d.id === 'adhf' && vars.trigger === 'nonadherence') && d.id !== 'dka',
    startHour: arrival === 'ambulance' ? rng.int(0, 23) : rng.int(9, 16), startMin: rng.int(0, 59),
  };
}

export const ALLERGY_BY_ID = Object.fromEntries(ALLERGIES.map((a) => [a.id, a]));
