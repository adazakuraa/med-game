// 切迫流産・流産（妊娠初期の性器出血）
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 産科編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'miscarriage', name: '切迫流産', dept: '産婦人科', weight: 3,
  demo: { age: [22, 42], ageMode: 'uniform', male: 0 },
  forcePregnant: true,
  vars: (rng) => ({ weeks: rng.int(7, 10) }),
  cc: () => '妊娠中の性器出血', ccKey: 'lower_abd_f',
  history: {
    onset: { p: 1, text: '今朝から少量の出血があります。' },
    character: { p: 1, text: '生理の時のような軽い下腹部の痛みと、少量の出血です。' },
    vagbleed: { p: 1, text: '下着に少しつく程度の茶色っぽい出血です。' },
    lmp: { p: 1, text: '最終月経から{weeks}週くらいです。先週、産婦人科で妊娠と言われました（心拍も確認できました）。' },
    abdpain: { p: 0.6, text: '下腹部が少し重い感じがします。' },
    dizziness: { p: 0, text: '' },
    fever: { p: 0, text: '' },
  },
  exam: { abd_palp: { p: 0.3, text: '下腹部に軽い不快感。腹膜刺激徴候なし。' } },
  tests: { tvus: [{ p: 1, persist: true, text: '子宮内に胎嚢と胎児心拍を確認（妊娠{weeks}週相当）。付属器に異常なし。腹腔内出血なし。' }], abd_us: [{ p: 0.8, persist: true, text: '子宮内に胎嚢。腹水なし。' }] },
  natural: -0.2,
  harmTags: { nsaid: '妊娠中のNSAIDsは避ける', abx: '感染の根拠がない妊婦への抗菌薬は不要' },
  dispo: () => ({ ok: ['home'], best: 'home', why: '子宮内妊娠で胎児心拍あり・出血少量：安静と産婦人科外来でのフォロー' }),
  useful: ['uhcg', 'tvus', 'abd_us', 'cbc'], key: [['uhcg'], ['tvus', 'abd_us']],
  teaching: [
    '妊娠初期の性器出血では、異所性妊娠・流産・絨毛性疾患を鑑別する。まず子宮内に胎嚢があるかを超音波で確認。',
    '子宮内妊娠で胎児心拍が確認でき、出血が少量なら切迫流産として経過観察。初期流産の多くは染色体異常によるもので、安静や薬で防げるわけではないことも伝える。',
    '妊娠中は放射線検査・NSAIDsなどの薬に注意。出血が多い・強い腹痛・ふらつきがあれば再受診を。',
  ],
  sources: ['産婦人科診療ガイドライン 産科編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['uhcg', 'tvus'] }],
});
