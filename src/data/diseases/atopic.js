// アトピー性皮膚炎（成人）
// 出典: 日本皮膚科学会/日本アレルギー学会『アトピー性皮膚炎診療ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'atopic', name: 'アトピー性皮膚炎', dept: '皮膚科', weight: 4,
  demo: { age: [18, 40], ageMode: 'young', male: 0.5 },
  comorb: { extra: { asthma: 0.3 } },
  vars: () => ({}),
  cc: () => '湿疹がかゆくて悪化した', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '子どものころからアトピーがあり、仕事が忙しくなってから急に悪化しました。' },
    character: { p: 1, text: '首・ひじの内側・膝の裏がガサガサして赤く、とてもかゆいです。' },
    location: { p: 1, text: '首・顔・ひじの内側・膝の裏です。' },
    itch: { p: 1, text: '一日中かゆく、夜もかいてしまいます。' },
    pmh: { p: 1, text: '花粉症と、子どものころ喘息がありました。' },
    family: { p: 1, text: '母も花粉症です。' },
    meds: { p: 1, text: '市販のかゆみ止めを塗っていますが、効きません。保湿はあまりしていません。' },
    trigger: { p: 1, text: '寝不足と、汗をかいた後に悪化します。' },
    sickcontact: { p: 0, text: '' }, fever: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '頸部・肘窩・膝窩に左右対称の紅斑・苔癬化・掻破痕。全身の皮膚が乾燥。水疱・膿痂疹はない。' } },
  tests: {},
  natural: -0.005,
  therapies: [{ id: 'tx', label: 'ステロイド外用（部位に応じた強さ）と保湿剤によるスキンケア、悪化因子の対策', req: { anyTag: ['topical_steroid'] }, effect: -0.5, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['koh', 'cbc'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'アトピー性皮膚炎：外来で外用療法とスキンケア（寛解後も保湿とプロアクティブ療法）' }),
  teaching: [
    '慢性・反復性のかゆい湿疹が左右対称に（顔・首・肘窩・膝窩）出て、アレルギー疾患の既往・家族歴があればアトピー性皮膚炎。',
    '治療の3本柱：ステロイド外用（部位と重症度に合った強さを十分量）・保湿のスキンケア・悪化因子（汗・乾燥・ストレス・ひっかき）の対策。',
    '改善後も保湿と週2回程度の外用（プロアクティブ療法）で再燃を防ぐ。重症は生物学的製剤・JAK阻害薬。',
    'カポジ水痘様発疹症（ヘルペス）・伝染性膿痂疹の合併に注意。',
  ],
  sources: ['アトピー性皮膚炎診療ガイドライン2024（日本皮膚科学会/日本アレルギー学会）'],
  ideal: () => [{ a: 'rx', drugId: 'steroid_oint', route: 'top', dose: 2, freq: 'q12h', days: 14 }, { a: 'rx', drugId: 'heparinoid', route: 'top', dose: 5, freq: 'q12h', days: 28 }],
});
