// 決定論的乱数。患者シード＋キーから毎回同じ値を得られるので、乱数状態を保存しなくてよい。
export function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** seed と任意のキー列から [0,1) の値を返す */
export function hashRand(seed, ...keys) {
  return mulberry32(hashStr(seed + ':' + keys.join(':')))();
}

export function makeRng(seed) {
  const next = mulberry32(typeof seed === 'number' ? seed : hashStr(String(seed)));
  const rng = {
    next,
    range: (lo, hi) => lo + (hi - lo) * next(),
    int: (lo, hi) => Math.floor(lo + (hi - lo + 1) * next()),
    chance: (p) => next() < p,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    normal: (m = 0, s = 1) => {
      let u = 0, v = 0;
      while (u === 0) u = next();
      while (v === 0) v = next();
      return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    weighted: (items, weightFn) => {
      const ws = items.map(weightFn);
      const total = ws.reduce((a, b) => a + b, 0);
      let r = next() * total;
      for (let i = 0; i < items.length; i++) {
        r -= ws[i];
        if (r <= 0) return items[i];
      }
      return items[items.length - 1];
    },
  };
  /** [lo,hi] 配列なら一様乱数、数値ならそのまま */
  rng.val = (x) => (Array.isArray(x) ? rng.range(x[0], x[1]) : x);
  return rng;
}

export const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
