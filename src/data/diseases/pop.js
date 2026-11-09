// 骨盤臓器脱（子宮脱・膀胱瘤）
// 出典: 日本女性骨盤底医学会/日本泌尿器科学会『女性下部尿路症状診療ガイドライン第2版（2019）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pop', name: '骨盤臓器脱（子宮脱・膀胱瘤）', dept: '産婦人科', weight: 4,
  demo: { age: [60, 88], ageMode: 'old', male: 0 },
  noPregnancy: true,
  comorb: { extra: { constip: 0.4 } },
  vars: (rng) => ({ mo: rng.int(3, 12) }),
  cc: () => '股の間に何かがはさまっている感じがする', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '{mo}か月前から、股の間にピンポン玉のようなものが触れます。' },
    character: { p: 1, text: '夕方や重いものを持った後に出てきて、横になると戻ります。' },
    aggravating: { p: 1, text: '長く立っていたり、いきんだりすると出てきます。' },
    retention: { p: 0.7, text: 'おしっこが出にくく、出し切れない感じがします。' },
    frequency: { p: 0.6, text: 'トイレが近いです。' },
    vagbleed: { p: 0.2, text: '下着に少し血が付くことがあります（こすれて）。' },
    pmh: { p: 1, text: '子どもを3人、経腟分娩で産みました。' },
    constipation: { p: 0.5, text: '便秘がちです。' },
    itch: { p: 0, text: '' }, fever: { p: 0, text: '' },
  },
  exam: { speculum: { p: 1, text: 'いきませると子宮頸部と前腟壁（膀胱）が腟口を越えて下垂（骨盤臓器脱 ステージ3）。' }, pelvic: { p: 0.3, text: '付属器に腫瘤・圧痛なし。' } },
  tests: { pvr: [{ p: 0.7, text: '排尿後残尿 120mL。' }] },
  natural: -0.01,
  therapies: [{ id: 'gyn', label: '婦人科でのペッサリー挿入または手術の相談、骨盤底筋訓練の指導', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'obgyn') }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  consult: { obgyn: '産婦人科：子宮脱・膀胱瘤（骨盤臓器脱 ステージ3）です。まずリングペッサリーを挿入して経過をみます。症状が強ければ手術（腟式手術・腹腔鏡下仙骨腟固定術）も相談しましょう。骨盤底筋訓練と、便秘・重い物の持ち上げを避けるよう指導してください。' },
  useful: ['ua', 'pvr', 'abd_us', 'uhcg'], key: [['ua']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '骨盤臓器脱：婦人科外来でペッサリー・手術を相談' }),
  teaching: [
    '高齢女性の「股に何かが挟まる・ピンポン玉のようなものが触れる」は骨盤臓器脱（子宮脱・膀胱瘤・直腸瘤）。経腟分娩・加齢・肥満・便秘・重労働がリスク。',
    '排尿困難・残尿・頻尿・尿路感染を伴うことが多い。尿検査と残尿測定を。',
    '治療は骨盤底筋訓練、リングペッサリー、手術。便秘・重い物の持ち上げを避ける。',
  ],
  sources: ['女性下部尿路症状診療ガイドライン第2版（日本女性骨盤底医学会/日本泌尿器科学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'pvr'] }, { a: 'consult', dept: 'obgyn', delayMin: 1 }, { a: 'wait', min: 70 }],
});
