// 疥癬
// 出典: 日本皮膚科学会『疥癬診療ガイドライン（第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'scabies', name: '疥癬', dept: '皮膚科', weight: 3,
  demo: { age: [70, 95], ageMode: 'old', male: 0.45 },
  comorb: { extra: { dementia: 0.5 } },
  vars: (rng) => ({ wk: rng.int(3, 8) }),
  cc: () => '全身のかゆみ（施設入所中）', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '（施設職員）{wk}週間前から体をかゆがって、かきむしっています。' },
    character: { p: 1, text: '（施設職員）お腹や脇、手のひらに赤いブツブツがあります。' },
    itch: { p: 1, text: '（施設職員）特に夜にひどくかゆがって眠れないようです。' },
    sickcontact: { p: 1, text: '（施設職員）同じ階の入所者や職員にも、かゆがっている人がいます。' },
    meds: { p: 1, text: '（施設職員）湿疹と言われてステロイドの塗り薬を塗っていますが、良くなりません。' },
    location: { p: 1, text: '（施設職員）お腹・脇の下・手の指の間・陰部です。' },
    trigger: { p: 0, text: '' }, fever: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '指間・手掌・腋窩・腹部・陰部に紅色丘疹と掻破痕。指間に灰白色の線状の皮疹（疥癬トンネル）。陰部に小結節。' } },
  tests: { koh: [{ p: 0.85, persist: true, text: '疥癬トンネルの鏡検でヒゼンダニの虫体と虫卵を認める。' }] },
  natural: -0.005,
  therapies: [
    { id: 'tx', label: 'イベルメクチン内服（またはフェノトリン外用）と施設内の感染対策・同時治療', req: { tag: 'scabicide' }, effect: -0.6, lagH: 6, required: true, deadlineH: [24, 24, 24] },
  ],
  harmTags: { topical_steroid: '疥癬にステロイド外用（ダニが増えて悪化・角化型疥癬の誘因）' },
  useful: ['koh', 'cbc'], key: [['koh']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '疥癬：イベルメクチン内服（1週間後に再投与）と施設内の接触者の同時治療・感染対策' }),
  teaching: [
    '高齢者施設・病棟で広がる、夜間に強いかゆみと指間・手掌・腋窩・陰部の丘疹・疥癬トンネルは疥癬（ヒゼンダニ）。',
    '「湿疹」としてステロイドを塗り続けて悪化している例が多い。鏡検でヒゼンダニ・虫卵を確認する。',
    '治療はイベルメクチン内服（1週間後に2回目）またはフェノトリン外用。同居者・施設内の接触者も同時に治療し、寝具・衣類の対策を。',
    '角化型疥癬（ノルウェー疥癬）は感染力が非常に強く、個室で厳重に対策する。',
  ],
  sources: ['疥癬診療ガイドライン（第3版）（日本皮膚科学会）'],
  ideal: (p) => [{ a: 'test', ids: ['koh'] }, { a: 'rx', drugId: 'ivermectin', route: 'po', dose: 200, freq: 'once', days: 14 }],
});
