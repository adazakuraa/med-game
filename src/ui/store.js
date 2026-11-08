// セーブデータ（端末のブラウザ保存領域 localStorage）
const KEY = 'medrot_save_v1';

const fresh = () => ({ v: 1, profile: { xp: 0, cases: [], seen: {}, mastery: {}, tutorialSeen: false }, settings: { realtime: true, mode: 'resident' }, enc: null });

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const g = JSON.parse(raw);
    if (!g || g.v !== 1) return fresh();
    const f = fresh();
    return { ...f, ...g, profile: { ...f.profile, ...g.profile }, settings: { ...f.settings, ...g.settings } };
  } catch {
    return fresh();
  }
}

export function save(g) {
  try { localStorage.setItem(KEY, JSON.stringify(g)); } catch { /* 保存できない環境（プライベートモード等） */ }
}

export function resetSave() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
  return fresh();
}

// レベル: 必要XPは 60, 180, 360, 600, ...
export function levelOf(xp) {
  let lv = 1;
  while (xp >= 30 * lv * (lv + 1)) lv++;
  return lv;
}
export function levelProgress(xp) {
  const lv = levelOf(xp);
  const lo = 30 * (lv - 1) * lv, hi = 30 * lv * (lv + 1);
  return (xp - lo) / (hi - lo);
}
