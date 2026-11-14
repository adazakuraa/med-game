// レベルアップの報酬：称号とローテーション（研修先）
import { DISEASES } from './diseases/index.js';

export const TITLES = [
  [1, '研修医1年目'], [2, '研修医2年目'], [3, '専攻医1年目'], [4, '専攻医2年目'], [5, '専攻医3年目'],
  [6, '専門医'], [8, '指導医'], [10, '医長'], [13, '部長'], [16, '副院長'], [20, '院長'],
];
export function titleOf(lv) {
  let t = TITLES[0][1];
  for (const [l, name] of TITLES) if (lv >= l) t = name;
  return t;
}

const D = (...depts) => (d) => depts.includes(d.dept);
const severe = (d) => (d.sev?.p?.[2] ?? 0) >= 0.15 && d.untreatedFatal !== false;

// match: その研修先で出会う疾患 / sevBoost: 重症の出やすさ
export const ROTATIONS = [
  { id: 'all', icon: '🏥', name: '総合（全科）', minLv: 1, desc: 'すべての科の患者がやってくる。' },
  { id: 'internal', icon: '🩺', name: '内科', minLv: 2, desc: '内科・循環器・呼吸器・消化器・腎臓・内分泌・血液・膠原病・感染症の患者が中心。',
    match: D('内科', '循環器内科', '呼吸器内科', '消化器内科', '腎臓内科', '内分泌代謝内科', '内分泌内科', '血液内科', '膠原病内科', '感染症内科') },
  { id: 'surgery', icon: '🔪', name: '外科・整形外科', minLv: 3, desc: '外科・消化器外科・心臓血管外科・脳神経外科・整形外科・形成外科の患者が中心。',
    match: D('外科', '消化器外科', '心臓血管外科', '呼吸器外科', '脳神経外科', '整形外科', '形成外科', '乳腺外科') },
  { id: 'obgyn', icon: '🤰', name: '産婦人科', minLv: 4, desc: '産婦人科・乳腺の患者が中心（女性の患者のみ）。', match: D('産婦人科', '乳腺外科') },
  { id: 'er', icon: '🚑', name: '救命救急', minLv: 4, desc: '命に関わる重症の患者が多い。時間との勝負。', match: severe, sevBoost: 3 },
  { id: 'senses', icon: '👁', name: '眼科・耳鼻科・皮膚科・歯科', minLv: 5, desc: '感覚器・皮膚・口の患者が中心。外来で多い病気を素早く見分けよう。', match: D('眼科', '耳鼻咽喉科', '皮膚科', '歯科口腔外科') },
  { id: 'neuro', icon: '🧠', name: '脳神経・精神科', minLv: 6, desc: '脳神経内科・脳神経外科・精神科の患者が中心。', match: D('脳神経内科', '脳神経外科', '精神科') },
  { id: 'uro', icon: '🚻', name: '泌尿器科・腎臓内科', minLv: 6, desc: '泌尿器科・腎臓内科の患者が中心。', match: D('泌尿器科', '腎臓内科') },
  { id: 'geri', icon: '👴', name: '高齢者医療', minLv: 7, desc: '高齢者に多い病気が中心。多病・多剤・非典型的な症状に注意。', match: (d) => d.demo?.ageMode === 'old' },
];
export const ROTATION_BY_ID = Object.fromEntries(ROTATIONS.map((r) => [r.id, r]));
for (const r of ROTATIONS) r.count = r.match ? DISEASES.filter(r.match).length : DISEASES.length;

/** レベル a → b に上がったときに解禁されたもの */
export function unlocksBetween(a, b) {
  const out = [];
  for (let lv = a + 1; lv <= b; lv++) {
    const t = TITLES.find(([l]) => l === lv);
    if (t) out.push({ icon: '🎓', text: `称号「${t[1]}」` });
    for (const r of ROTATIONS) if (r.minLv === lv) out.push({ icon: r.icon, text: `ローテーション「${r.name}」（${r.count}疾患）` });
    const n = DISEASES.filter((d) => d.minLevel === lv).length;
    if (n) out.push({ icon: '🆕', text: `新しい疾患 ${n}種類が出現するように` });
    if (lv === 3) out.push({ icon: '⚠', text: '重症の患者が来るように' });
  }
  return out;
}

/** 次に解禁されるもの（タイトル画面の「次のごほうび」） */
export function nextUnlock(lv) {
  for (let l = lv + 1; l <= lv + 20; l++) {
    const u = unlocksBetween(l - 1, l);
    if (u.length) return { lv: l, items: u };
  }
  return null;
}
