// クラミジア子宮頸管炎
// 出典: 日本性感染症学会『性感染症 診断・治療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'cervicitis', name: 'クラミジア子宮頸管炎', dept: '産婦人科', weight: 3,
  demo: { age: [18, 30], ageMode: 'young', male: 0 },
  comorb: { extra: {} }, organisms: ['chlamydia'],
  vars: () => ({}),
  cc: () => 'おりものが増えて、性交後に出血した', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '1か月前からおりものが増えて、性交渉の後に少し出血しました。' },
    character: { p: 1, text: '黄色っぽいおりものです。においはあまりありません。' },
    vagbleed: { p: 1, text: '性交渉の後に少し出血しました。' },
    lmp: { p: 1, text: '最終月経は2週間前です。最近パートナーが変わりました。避妊はしていません。' },
    itch: { p: 0, text: 'かゆみはありません。' }, fever: { p: 0, text: '熱はありません。' }, abdpain: { p: 0.2, text: '下腹部が少し重い感じがします。' },
    dysuria: { p: 0.3, text: '少しおしっこがしみます。' },
  },
  exam: { speculum: { p: 1, text: '子宮頸部の発赤・浮腫と易出血性、頸管から黄色の粘液膿性帯下。' }, pelvic: { p: 0, text: '子宮頸部の移動痛・付属器の圧痛なし。' } },
  tests: { sti_pcr: [{ p: 1, persist: true, text: 'クラミジア・トラコマティス陽性、淋菌陰性。' }], uhcg: [{ p: 1, text: '陰性。', normal: true }], koh: [{ p: 1, text: '真菌・clue cellなし。', normal: true }], syphilis: [{ p: 1, text: '陰性。', normal: true }], hiv: [{ p: 1, text: '陰性。', normal: true }], pap: [{ p: 1, text: 'NILM（陰性）、炎症性変化。', normal: true }] },
  natural: 0.01,
  dynamics: (enc, eff) => { if (eff.covers.chlamydia) enc.state.tx ??= enc.t; return enc.state.tx != null && enc.t - enc.state.tx > 360 ? -0.6 : 0; },
  therapies: [{ id: 'abx', label: 'アジスロマイシン（またはドキシサイクリン）、パートナーの同時治療', req: { coverage: ['chlamydia'] }, effect: 0, lagH: 0, required: true, deadlineH: [48, 48, 48] }],
  useful: ['sti_pcr', 'uhcg', 'koh', 'syphilis', 'hiv', 'pap', 'ua'], key: [['sti_pcr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'クラミジア子宮頸管炎：抗菌薬で外来治療（パートナーも治療、治癒判定を）' }),
  teaching: [
    'クラミジアは日本で最も多い性感染症。女性は無症状が多く、帯下の増加・性交後出血・軽い下腹部痛程度。',
    '放置すると骨盤内炎症性疾患・卵管性不妊・異所性妊娠・肝周囲炎（Fitz-Hugh-Curtis症候群）の原因になる。',
    '頸管の核酸増幅検査で診断。アジスロマイシン（またはドキシサイクリン）で治療し、パートナーも同時に治療。ほかの性感染症（梅毒・HIV・淋菌）も検査する。',
  ],
  sources: ['性感染症 診断・治療ガイドライン2020（日本性感染症学会）'],
  ideal: () => [{ a: 'test', ids: ['sti_pcr', 'uhcg', 'syphilis', 'hiv'] }, { a: 'rx', drugId: 'azm', route: 'po', dose: 500, freq: 'q24h', days: 2 }],
});
