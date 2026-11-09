// 腰部脊柱管狭窄症
// 出典: 日本整形外科学会/日本脊椎脊髄病学会『腰部脊柱管狭窄症診療ガイドライン2021（改訂第2版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'lss', name: '腰部脊柱管狭窄症', dept: '整形外科', weight: 6,
  demo: { age: [60, 88], ageMode: 'old', male: 0.55 },
  comorb: { extra: { htn: 0.5, dm2: 0.25 } },
  vars: (rng) => ({ m: rng.pick([50, 100, 200]), mo: rng.int(3, 12) }),
  cc: () => '歩くと足がしびれて痛くなる', ccKey: 'back_pain',
  history: {
    onset: { p: 1, text: '{mo}か月前から、歩いていると両足がしびれて痛くなります。' },
    character: { p: 1, text: '{m}mくらい歩くと、お尻から足にかけてしびれて歩けなくなりますが、少しかがんで休むとまた歩けます。' },
    aggravating: { p: 1, text: '長く立っていたり、背中を反らすと悪くなります。自転車は平気でこげます。' },
    radiation: { p: 1, text: 'お尻から太ももの裏、ふくらはぎにかけてしびれます。' },
    location: { p: 1, text: '腰とお尻、両足です。' },
    weakness: { p: 0.2, text: '少し足に力が入りにくい気がします。' },
    retention: { p: 0.05, text: 'おしっこは普通に出ます。' },
    fever: { p: 0, text: '' }, rash: { p: 0, text: '' },
    pmh: { p: 0.4, text: '高血圧の薬を飲んでいます。' },
  },
  exam: { spine: { p: 0.6, text: '腰椎の後屈で下肢のしびれが誘発される（Kemp徴候陽性）。叩打痛なし。' }, slr: { p: 0.1, text: 'SLRテストは陰性。' } },
  tests: { spine_mri: [{ p: 1, persist: true, text: 'L4/5で黄色靱帯の肥厚と椎間板の膨隆により脊柱管が高度に狭窄。' }], spine_xr: [{ p: 0.9, text: '腰椎の変性（骨棘・椎間板腔の狭小化）、L4の軽度すべり。' }] },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '薬物療法（リマプロスト・NSAIDsなど）と運動療法・生活指導', req: { anyTag: ['lss_tx', 'nsaid', 'analgesic'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['spine_xr', 'spine_mri', 'cbc', 'crp'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '腰部脊柱管狭窄症：外来で薬物療法・運動療法。膀胱直腸障害・進行する麻痺があれば手術を相談' }),
  teaching: [
    '高齢者の「歩くと足がしびれて歩けなくなり、前かがみで休むとまた歩ける」（神経性間欠性跛行）は腰部脊柱管狭窄症。自転車はこげるのが特徴。',
    '閉塞性動脈硬化症（血管性間欠性跛行）は立ち止まるだけで楽になり、足の脈が弱い。必ず足背動脈を触れて区別する。',
    'MRIで脊柱管の狭窄を確認。膀胱直腸障害・進行する筋力低下は手術の適応。',
    '治療はリマプロスト・NSAIDs・運動療法。効果が不十分なら手術（除圧術）。',
  ],
  sources: ['腰部脊柱管狭窄症診療ガイドライン2021（日本整形外科学会/日本脊椎脊髄病学会）'],
  ideal: () => [{ a: 'test', ids: ['spine_xr'] }, { a: 'rx', drugId: 'limaprost', route: 'po', dose: 5, freq: 'q8h', days: 28 }],
});
