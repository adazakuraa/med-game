// 接触皮膚炎（湿疹）
// 出典: 日本皮膚科学会『接触皮膚炎診療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'contact_derm', name: '接触皮膚炎', dept: '皮膚科', weight: 5,
  demo: { age: [18, 75], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: {} },
  vars: (rng) => rng.pick([{ where: '両手の甲', cause: '新しい洗剤を使い始めてから' }, { where: '耳たぶ', cause: '新しいピアスをつけてから' }, { where: '腰のまわり（ベルトのバックルの位置）', cause: '新しいベルトを使い始めてから' }]),
  cc: () => 'かゆい赤い発疹', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '1週間前、{cause}、{where}が赤くかゆくなりました。' },
    character: { p: 1, text: '赤くブツブツして、小さな水ぶくれもあります。' },
    location: { p: 1, text: '{where}だけです。' },
    itch: { p: 1, text: 'とてもかゆいです。夜も同じくらいです。' },
    trigger: { p: 1, text: '{cause}です。' },
    sickcontact: { p: 1, text: '家族に同じ症状の人はいません。' },
    fever: { p: 0, text: '' }, dyspnea: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{where}に境界明瞭な紅斑と小水疱・丘疹。接触した部位に一致している。' } },
  tests: {},
  natural: -0.03,
  therapies: [{ id: 'tx', label: '原因物質の回避とステロイド外用薬', req: { tag: 'topical_steroid' }, effect: -0.6, lagH: 4, required: true, deadlineH: [24, 24, 24] }],
  useful: ['koh'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '接触皮膚炎：原因の回避とステロイド外用で外来治療（必要ならパッチテスト）' }),
  teaching: [
    '原因物質が触れた部位に一致する、境界明瞭なかゆい紅斑・丘疹・小水疱は接触皮膚炎。金属・洗剤・化粧品・植物・外用薬が多い。',
    '真菌（白癬）でも似た皮疹になるため、疑わしければKOH鏡検で確認してからステロイドを塗る。',
    '治療は原因の除去とステロイド外用。原因がはっきりしなければパッチテスト。',
  ],
  sources: ['接触皮膚炎診療ガイドライン2020（日本皮膚科学会）'],
  ideal: () => [{ a: 'rx', drugId: 'steroid_oint', route: 'top', dose: 1, freq: 'q12h', days: 7 }],
});
