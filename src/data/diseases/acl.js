// 前十字靱帯損傷
// 出典: 日本整形外科学会『前十字靱帯（ACL）損傷診療ガイドライン2019（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'acl', name: '前十字靱帯損傷', dept: '整形外科', weight: 2,
  demo: { age: [15, 35], ageMode: 'young', male: 0.45 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['バスケットボールでジャンプの着地', 'スキーで転倒', 'サッカーで急停止して方向転換']) }),
  cc: (v) => `${v.side}膝をけがして腫れた`, ccKey: 'injury',
  history: {
    onset: { p: 1, text: '昨日、{how}したときに{side}膝がガクッとずれて、「ブチッ」と音がしました。' },
    character: { p: 1, text: '数時間で膝がパンパンに腫れて、体重をかけると膝がガクッと崩れそうになります。' },
    location: { p: 1, text: '{side}膝全体です。' },
    aggravating: { p: 1, text: '体重をかけたり、ひねったりすると痛いです。' },
    trigger: { p: 1, text: '{how}したときです。人とはぶつかっていません。' },
    syncope: { p: 0, text: '' }, numbness: { p: 0, text: 'しびれはありません。' }, pmh: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}膝の著明な関節水腫（膝蓋跳動陽性）。Lachmanテスト陽性（脛骨の前方移動が大きく終末点がはっきりしない）、前方引き出しテスト陽性。' } },
  tests: { joint_xr: [{ p: 1, persist: true, text: '{side}膝：骨折なし。関節水腫。', normal: true }], joint_tap: [{ p: 1, text: '血性の関節液（関節血症）。脂肪滴なし。結晶・細菌なし。' }] },
  natural: -0.01,
  therapies: [
    { id: 'tx', label: 'RICE（安静・冷却・圧迫・挙上）・固定・松葉杖・鎮痛', req: { fn: (enc, eff) => !!enc.state.procs?.splint || (eff.tags.nsaid || 0) > 0 }, effect: -0.2, lagH: 1, required: true, deadlineH: [6, 6, 6] },
    { id: 'ortho', label: '整形外科へ紹介：MRIで評価し、スポーツを続けるなら靱帯再建術', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ortho') }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 72] },
  ],
  consult: { ortho: '整形外科：受傷時の断裂音・すぐに出た関節血症・Lachmanテスト陽性で、前十字靱帯断裂です。MRIで半月板損傷の合併も確認します。スポーツ復帰を希望するなら靱帯再建術を勧めます。膝くずれを繰り返すと半月板・軟骨が傷むので注意してください。' },
  useful: ['joint_xr', 'joint_tap'], key: [['joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '前十字靱帯損傷：RICE・松葉杖で帰宅し、整形外科でMRIと手術の相談' }),
  teaching: [
    'ジャンプの着地・急停止・方向転換で膝をひねり、「ブチッ」という音とすぐに膝が腫れる（関節血症）、膝くずれ → 前十字靱帯損傷。接触のない受傷が多く、若い女性アスリートに多い。',
    'Lachmanテストが最も感度が高い。X線で骨折（Segond骨折）を除外し、MRIで確定。',
    'スポーツを続けるなら靱帯再建術。半月板損傷を合併しやすい。',
  ],
  sources: ['前十字靱帯（ACL）損傷診療ガイドライン2019（日本整形外科学会）'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'proc', id: 'splint' }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }, { a: 'consult', dept: 'ortho', delayMin: 1 }, { a: 'wait', min: 70 }],
});
