// 一酸化炭素中毒
// 出典: 日本中毒学会 資料, 日本高気圧環境・潜水医学会『高気圧酸素治療の適応』, Weaver LK. N Engl J Med 2009
export default {
  id: 'co_poisoning', name: '一酸化炭素中毒', dept: '救急科',
  weight: 2, season: { winter: 2.5, summer: 0.2 }, minLevel: 2,
  demo: { age: [20, 85], ageMode: 'uniform', male: 0.55 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[24, 34], [36, 48], [52, 64]] },
  refractoryP: [0, 0, 0.05],
  comorb: { extra: {} },
  organisms: [],
  vars: (rng) => ({ src: rng.pick(['締め切った部屋で石油ストーブ', '換気の悪い部屋で練炭こたつ', '車庫で車のエンジンをかけたまま']) }),
  cc: () => '頭痛と吐き気（家族も同じ症状）', ccKey: 'headache',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  history: {
    onset: { p: 1, text: '今朝起きたら、頭がガンガンして吐き気がしました。' },
    course: { p: 1, text: '家にいると悪くなり、外に出ると少し楽になる気がします。' },
    character: { p: 1, text: '頭全体がズキズキ痛みます。' },
    location: { p: 1, text: '頭全体です。' },
    nausea: { p: 1, text: '吐き気があって、1回吐きました。' },
    trigger: { p: 1, text: '寒かったので、夜は{src}を使っていました。' },
    family: { p: 1, text: '一緒に住んでいる家族も、同じように頭痛と吐き気を訴えています。' },
    dizziness: { p: 0.8, text: 'ふらふらします。' },
    syncope: { p: [0, 0.3, 0.8], text: '一瞬、気が遠くなりました。' },
    fever: { p: 0, text: '' }, seizure: { p: [0, 0, 0.2], text: '（家族）手足がけいれんしました。' }, photophobia: { p: 0, text: '' },
  },
  exam: { gen_consc: { p: [0.1, 0.5, 1], bySev: ['意識清明。', 'ぼんやりしている（JCS 1）。', '呼びかけで開眼する（JCS 10）。'] }, gen_appear: { p: 1, text: '顔色は悪くない（チアノーゼはない）。' } },
  vitals: { HR: { to: [100, 115], k: 1 } },
  labs: { COHB: { to: [20, 40], k: 0.5 }, LAC: { to: [2.5, 5], k: 1.5 }, CK: { add: [0, 1500], k: 1.5 }, TNT: { to: [0.01, 0.08], k: 2 } },
  tests: {},
  natural: 0.15,
  dynamics: (enc) => (enc.thStart?.o2 != null && enc.t - enc.thStart.o2 > 150 ? -1.6 : 0), // COが洗い出されれば回復
  therapies: [
    { id: 'o2', label: '100%酸素（リザーバーマスク10〜15L/分、重症は高気圧酸素治療を検討）', req: { fn: (enc, eff) => eff.o2Device === 'reservoir' || eff.o2Device === 'nppv' || (eff.o2Device === 'mask' && (eff.o2Flow || 0) >= 10) }, required: true, deadlineH: [1, 1, 0.5], effect: -2.5, lagH: 0.2 },
  ],
  labHook: (enc, id, v) => {
    if (id !== 'COHB') return v;
    // 酸素投与で半減期が短縮
    const o2 = enc.thStart?.o2;
    return o2 != null ? v * Math.pow(0.5, (enc.t - o2) / 75) : v * Math.pow(0.5, enc.t / 300);
  },
  residualAbove: 22, residualText: '数週間後に物忘れや意欲低下（遅発性脳症）が出現しました。',
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'home', why: '軽症の一酸化炭素中毒：酸素投与で症状が消失し、COHbが正常化すれば帰宅（原因の除去・遅発性脳症の説明）' } : { ok: ['admit', 'icu'], best: 'admit', why: '意識障害・失神・COHb高値：入院で酸素投与（高気圧酸素治療の検討）' }),
  useful: ['vbg', 'ecg', 'tnt', 'cbc', 'chem', 'bs_poct', 'head_ct', 'lab_CK', 'lab_LAC'],
  key: [['vbg'], ['ecg']],
  extrasOk: () => [],
  teaching: [
    '冬の頭痛・嘔気・めまいで「家族も同じ症状」「家にいると悪化」なら一酸化炭素中毒を疑う。暖房器具・練炭・車の排気ガス・火災。',
    'パルスオキシメーターのSpO2は正常に見える（COHbを酸素化Hbと誤認する）。血液ガスでCOHbを測る。',
    'すぐに100%酸素（リザーバーマスク）。COの半減期は室内気で4〜5時間、100%酸素で約1時間。',
    '意識障害・失神・けいれん・妊婦・心筋障害などは高気圧酸素治療を検討。数週後の遅発性脳症に注意。同居者の安全確保も。',
  ],
  sources: ['Weaver LK. Carbon monoxide poisoning. N Engl J Med 2009', '日本中毒学会 資料'],
  ideal: () => [{ a: 'o2', device: 'reservoir', flow: 15 }, { a: 'test', ids: ['vbg', 'ecg', 'tnt', 'chem', 'cbc'] }, { a: 'wait', min: 120 }],
};
