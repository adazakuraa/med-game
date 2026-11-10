// 閉塞性動脈硬化症（末梢動脈疾患、間欠性跛行）
// 出典: 日本循環器学会/日本血管外科学会『2022年改訂版 末梢動脈疾患ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pad', name: '閉塞性動脈硬化症', dept: '循環器内科', weight: 4,
  demo: { age: [60, 85], ageMode: 'old', male: 0.8 },
  comorb: { extra: { htn: 0.7, dm2: 0.45, dyslip: 0.5 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']), m: rng.pick([100, 200, 300]), mo: rng.int(3, 12) }),
  cc: () => '歩くと足が痛くなる', ccKey: 'back_pain',
  history: {
    onset: { p: 1, text: '{mo}か月前から、歩いていると{side}のふくらはぎが痛くなります。' },
    character: { p: 1, text: '{m}mくらい歩くとふくらはぎが締めつけられるように痛くなって、立ち止まって少し休むと治ります。' },
    aggravating: { p: 1, text: '坂道や早歩きで早く痛くなります。前かがみにならなくても、立ち止まるだけで楽になります。' },
    location: { p: 1, text: '{side}のふくらはぎです。腰は痛くありません。' },
    relieving: { p: 1, text: '立ち止まって1〜2分休むだけで治ります。座ったりかがんだりする必要はありません。' },
    radiation: { p: 0, text: 'お尻や太ももにしびれが広がることはありません。' },
    pmh: { p: 1, text: '高血圧と糖尿病、コレステロールで薬を飲んでいます。' },
    smoking: { p: 1, text: '1日20本、40年吸っています。' },
    weakness: { p: 0, text: '' }, retention: { p: 0, text: '' }, fever: { p: 0, text: '' }, rash: { p: 0, text: '' },
  },
  exam: { leg_pulse: { p: 1, text: '{side}足背動脈・後脛骨動脈の拍動が微弱。足先がやや冷たく、皮膚は薄くつやがある。潰瘍はない。' }, spine: { p: 1, text: '腰椎の後屈で症状は誘発されない（Kemp徴候陰性）。叩打痛なし。' }, slr: { p: 1, text: 'SLRテストは陰性。' } },
  tests: { abi: [{ p: 1, persist: true, text: 'ABI {side}0.62（低下）・反対側0.95。' }], leg_us: [{ p: 0.8, text: '{side}浅大腿動脈に石灰化と高度狭窄。深部静脈に血栓なし。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '抗血小板薬（シロスタゾールなど）、禁煙、監視下運動療法、動脈硬化の危険因子の管理', req: { tag: 'antiplatelet' }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['abi', 'leg_us', 'ecg', 'lipid', 'hba1c', 'chem', 'spine_xr'], key: [['abi']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '閉塞性動脈硬化症（間欠性跛行）：外来で抗血小板薬・禁煙・運動療法。安静時痛・潰瘍があれば血行再建を相談' }),
  teaching: [
    '歩くとふくらはぎが痛くなり、立ち止まるだけで治まる（血管性間欠性跛行）。喫煙・糖尿病・高血圧の高齢男性に多い。足背動脈の拍動を必ず触れる。',
    '腰部脊柱管狭窄症（神経性間欠性跛行）は前かがみで休まないと治らず、自転車はこげる。足の脈は正常。',
    'ABI 0.9以下で診断。冠動脈・脳血管の動脈硬化も合併しやすい（心電図・危険因子の評価）。',
    '治療は禁煙、運動療法、抗血小板薬（シロスタゾール・アスピリン）、スタチン。安静時痛・潰瘍（包括的高度慢性下肢虚血）は血行再建。',
  ],
  sources: ['2022年改訂版 末梢動脈疾患ガイドライン（日本循環器学会/日本血管外科学会）'],
  ideal: () => [{ a: 'test', ids: ['abi', 'ecg'] }, { a: 'rx', drugId: 'cilostazol', route: 'po', dose: 100, freq: 'q12h', days: 28 }],
});
