// 頸椎症性神経根症
// 出典: 日本整形外科学会『頸椎症性脊髄症診療ガイドライン2020』, 日本脊椎脊髄病学会資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'cervical_rad', name: '頸椎症性神経根症', dept: '整形外科', weight: 4,
  demo: { age: [40, 75], ageMode: 'uniform', male: 0.6 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), wk: rng.int(2, 8) }),
  cc: () => '首から腕にかけての痛みとしびれ', ccKey: 'numbness',
  history: {
    onset: { p: 1, text: '{wk}週間前から、首の痛みと、{side}肩から腕・親指にかけての痛みとしびれがあります。' },
    numbness: { p: 1, text: '{side}の腕の外側から親指・人差し指にかけてしびれます。' },
    character: { p: 1, text: '首を後ろに反らしたり、{side}に傾けたりすると、腕に電気が走るように痛みます。' },
    aggravating: { p: 1, text: '上を向くと悪化します。' },
    location: { p: 1, text: '首から{side}腕、親指です。' },
    weakness: { p: 0.3, text: '{side}腕に少し力が入りにくいです。' },
    pmh: { p: 0.5, text: 'デスクワークで長時間パソコンを使います。' },
    speechq: { p: 0, text: '' }, alcohol: { p: 0, text: '' },
    meds: { p: 1, text: '特に飲んでいません。' },
  },
  exam: { motor: { p: 0.8, text: '{side}上腕二頭筋の筋力がやや低下、{side}上腕二頭筋腱反射・腕橈骨筋反射が低下（C6神経根）。Spurlingテスト陽性（首を患側に傾けて押すと腕に放散痛）。下肢の腱反射は正常。' }, phalen: { p: 1, text: 'Phalenテスト・Tinel徴候は陰性。' }, facial: { p: 0, text: '' }, speech: { p: 0, text: '' } },
  tests: { spine_mri: [{ p: 1, persist: true, text: '頸椎C5/6で骨棘と椎間板の膨隆により{side}椎間孔が狭窄し、神経根を圧迫。脊髄の圧迫は軽度。' }] },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '鎮痛（NSAIDs）・頸椎の安静（反らさない）・カラー、改善しなければブロック・手術', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.4, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['spine_mri', 'hba1c', 'b12'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '頸椎症性神経根症：鎮痛と安静で外来治療（多くは数か月で改善）。筋力低下が進む・脊髄症状（両手のしびれ・歩行障害）があれば整形外科へ' }),
  teaching: [
    '首の痛みから片側の腕に放散する痛み・しびれ（皮膚分節に沿う）で、首を反らすと悪化（Spurlingテスト陽性）するのは頸椎症性神経根症。',
    '神経根に対応する筋力低下・腱反射低下を確認（C6：上腕二頭筋、C7：上腕三頭筋）。',
    '両手のしびれ・巧緻運動障害・歩行障害・腱反射亢進は頸髄症（脊髄の圧迫）で手術が必要なことがある。',
    '多くは保存的治療（鎮痛・安静）で改善する。',
  ],
  sources: ['頸椎症性脊髄症診療ガイドライン2020（日本整形外科学会）'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 14 }],
});
