// 手湿疹（主婦湿疹）
// 出典: 日本皮膚科学会『手湿疹診療ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hand_eczema', name: '手湿疹', dept: '皮膚科', weight: 4,
  demo: { age: [20, 55], ageMode: 'uniform', male: 0.25 },
  season: { winter: 1.8, autumn: 1.2 },
  comorb: { extra: {} },
  vars: (rng) => ({ job: rng.pick(['美容師', '調理師', '看護師', '育児中の主婦']) }),
  cc: () => '手が荒れてかゆい', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '3か月前から両手の指先や手のひらが荒れてひび割れ、かゆいです。' },
    character: { p: 1, text: '指先がカサカサしてひび割れ、赤くなってかゆみがあります。水仕事のあとにしみます。' },
    location: { p: 1, text: '両手の指先と手のひら、指の間です。足は大丈夫です。' },
    itch: { p: 1, text: 'かゆいです。' },
    trigger: { p: 1, text: '{job}で、一日に何十回も手を洗ったり、水仕事をしたりします。' },
    sickcontact: { p: 0, text: '家族に同じ症状の人はいません。' }, meds: { p: 0, text: '' }, fever: { p: 0, text: '熱はありません。' },
    pmh: { p: 0.4, text: '子どもの頃にアトピー性皮膚炎がありました。' }, family: { p: 0, text: '' }, dyspnea: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '両手の指腹・手掌に乾燥・落屑・亀裂と紅斑。指間に小水疱はなく、足に皮疹なし。爪の変化なし。' } },
  tests: { koh: [{ p: 1, text: '真菌を認めない。', normal: true }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: 'ステロイド外用と保湿、手袋（綿手袋の上にゴム手袋）・手洗い後の保湿などの生活指導', req: { anyTag: ['topical_steroid', 'emollient'] }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['koh'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '手湿疹：ステロイド外用・保湿・手の保護で外来' }),
  teaching: [
    '水仕事・頻回の手洗い・洗剤の刺激で起こる、指先・手のひらの乾燥・ひび割れ・紅斑は手湿疹（主婦湿疹）。美容師・調理師・医療従事者に多い。アトピー素因で起こりやすい。',
    '片手だけ・指の間の小水疱・爪の変化があれば手白癬（KOH鏡検）、ゴム手袋などによる接触皮膚炎も考える。',
    '治療はステロイド外用と保湿、手袋での保護。',
  ],
  sources: ['手湿疹診療ガイドライン（日本皮膚科学会）'],
  ideal: () => [{ a: 'test', ids: ['koh'] }, { a: 'rx', drugId: 'steroid_oint', route: 'top', dose: 1, freq: 'q12h', days: 14 }, { a: 'rx', drugId: 'heparinoid', route: 'top', dose: 2, freq: 'q12h', days: 28 }],
});
