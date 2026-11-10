// 梅毒（第2期）
// 出典: 日本性感染症学会『梅毒診療ガイド』, 感染症法（5類全数把握）
import { outpatient } from './common.js';
export default outpatient({
  id: 'syphilis', name: '梅毒（第2期）', dept: '皮膚科', weight: 3,
  demo: { age: [20, 50], ageMode: 'young', male: 0.6 },
  organisms: ['tp'], minAbxDays: 0, untreatedFatal: false,
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '手のひらや体に発疹が出た', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '2週間前から、体や手のひら・足の裏に赤い発疹が出ています。' },
    character: { p: 1, text: '赤茶色の発疹で、かゆみはほとんどありません。' },
    location: { p: 1, text: '体と、手のひら・足の裏です。' },
    itch: { p: 0, text: 'かゆみはありません。' },
    pmh: { p: 1, text: '2か月くらい前に陰部に痛くないしこりができましたが、自然に治りました。' },
    trigger: { p: 1, text: '3か月前に、新しい相手と性交渉がありました。' },
    fever: { p: 0.4, text: '微熱とだるさがあります。' },
    meds: { p: 0, text: '' }, sickcontact: { p: 0, text: '' }, family: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '体幹に淡い紅斑（バラ疹）、手掌・足底に赤褐色の丘疹と鱗屑（梅毒性乾癬）。' }, neck_ln: { p: 0.7, text: '全身のリンパ節が軽く腫れている。' } },
  tests: { syphilis: [{ p: 1, persist: true, text: 'RPR 64倍（陽性）、TPHA 陽性（活動性梅毒）。' }] },
  natural: 0,
  dynamics: (enc) => (enc.thStart?.abx != null && enc.t - enc.thStart.abx > 6 * 60 ? -0.5 : 0),
  therapies: [{ id: 'abx', label: 'ペニシリン系（ベンジルペニシリンベンザチン筋注、またはアモキシシリン内服4週間）', req: { coverage: ['tp'] }, required: true, deadlineH: [24, 24, 24] }],
  useful: ['syphilis', 'cbc', 'chem', 'sti_pcr', 'koh'], key: [['syphilis']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '梅毒：外来で治療（全数届出）。パートナーの検査・治療、HIVの検査、RPRで治療効果を確認' }),
  teaching: [
    '梅毒は近年日本で急増している。第1期は痛みのない陰部の潰瘍（硬性下疳）、第2期（数か月後）は手掌・足底を含む全身の発疹（バラ疹）・リンパ節腫脹。',
    '「手のひら・足の裏の発疹」「かゆくない発疹」「性交渉歴」で疑い、梅毒血清反応（RPR・TPHA）を調べる。',
    '治療はペニシリン（ベンジルペニシリンベンザチン筋注1回、またはアモキシシリン内服）。治療後のJarisch-Herxheimer反応（発熱）を説明する。',
    '5類感染症（全数届出）。パートナーの治療、HIV・ほかの性感染症の検査、妊婦では先天梅毒の予防が重要。',
  ],
  sources: ['梅毒診療ガイド（日本性感染症学会）'],
  ideal: () => [{ a: 'test', ids: ['syphilis'] }, { a: 'wait', min: 60 }, { a: 'rx', drugId: 'bpg', route: 'im', dose: 240, freq: 'once', days: 1 }],
});
