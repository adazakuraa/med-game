// 足白癬（水虫）
// 出典: 日本皮膚科学会『皮膚真菌症診療ガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'tinea', name: '足白癬（水虫）', dept: '皮膚科', weight: 5,
  demo: { age: [25, 80], ageMode: 'uniform', male: 0.65 },
  comorb: { extra: { dm2: 0.2 } },
  vars: (rng) => ({ mo: rng.int(1, 6) }),
  cc: () => '足の指の間がかゆい', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '{mo}か月前から、足の指の間がかゆくて皮がむけます。' },
    character: { p: 1, text: '指の間が白くふやけて、皮がむけたり小さな水ぶくれができたりします。' },
    location: { p: 1, text: '両足の薬指と小指の間、足の裏です。' },
    itch: { p: 1, text: 'かゆいです。夏にひどくなります。' },
    trigger: { p: 0.8, text: '仕事で一日中安全靴をはいています。家族も足がかゆいと言っています。' },
    meds: { p: 0.5, text: '家にあったステロイドの塗り薬を塗りましたが、かえってひどくなりました。' },
    fever: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '両足の第4趾間に浸軟・鱗屑・びらん、足底に小水疱と鱗屑。蜂窩織炎の所見はない。' } },
  tests: { koh: [{ p: 0.9, persist: true, text: '鱗屑のKOH直接鏡検で糸状菌（白癬菌）の菌糸を認める。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '抗真菌薬の外用（症状のない部分も含め、治っても1〜2か月継続）', req: { tag: 'topical_antifungal' }, effect: -0.6, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { topical_steroid: '白癬にステロイド外用（悪化させる）' },
  useful: ['koh', 'hba1c'], key: [['koh']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '足白癬：抗真菌薬の外用で外来治療' }),
  teaching: [
    '足趾間の浸軟・鱗屑・小水疱とかゆみは足白癬が多い。治療前にKOH直接鏡検で菌糸を確認する（見た目だけで決めない）。',
    'ステロイドを塗ると悪化する。湿疹と白癬の区別が大切。',
    '治療は抗真菌薬の外用を足全体に、症状が消えても1〜2か月続ける。爪白癬は内服薬が必要なことが多い。',
    '足白癬は蜂窩織炎の侵入門戸になる。糖尿病では特に足のケアを指導する。',
  ],
  sources: ['皮膚真菌症診療ガイドライン2019（日本皮膚科学会）'],
  ideal: () => [{ a: 'test', ids: ['koh'] }, { a: 'rx', drugId: 'terbinafine_cream', route: 'top', dose: 1, freq: 'q24h', days: 30 }],
});
