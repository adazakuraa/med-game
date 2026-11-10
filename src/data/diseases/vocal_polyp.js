// 声帯ポリープ（嗄声）
// 出典: 日本喉頭科学会 資料, AAO-HNS Clinical Practice Guideline: Hoarseness (Dysphonia) (2018)
import { outpatient } from './common.js';
export default outpatient({
  id: 'vocal_polyp', name: '声帯ポリープ', dept: '耳鼻咽喉科', weight: 3,
  demo: { age: [30, 65], ageMode: 'uniform', male: 0.5 },
  smokeP: 0.4,
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '声がかれて治らない', ccKey: 'throat',
  history: {
    onset: { p: 1, text: '2か月前、カラオケで大声を出した後から声がかれて、治りません。' },
    character: { p: 1, text: 'かすれた声で、高い声が出にくいです。' },
    hoarse: { p: 1, text: '2か月間ずっと声がかれています。' },
    dyspnea: { p: 0, text: '息苦しさはありません。' },
    weightloss: { p: 0, text: '体重は減っていません。' },
    fever: { p: 0, text: '' }, heartburn: { p: 0.3, text: '時々胸やけがします。' },
    smoking: { p: 1, text: '1日10本吸います。' },
    occupation: { p: 1, text: '保育士で、仕事で大きな声を出します。' },
    location: { p: 0, text: '' },
  },
  exam: { pharynx: { p: 1, text: '咽頭・扁桃に異常なし。' }, neck_ln: { p: 1, text: '頸部リンパ節は触れない。' } },
  tests: { laryngoscope: [{ p: 1, persist: true, text: '右声帯の前1/3に表面平滑な広基性のポリープ。声帯の動きは正常。悪性を疑う不整な病変はない。' }] },
  natural: -0.002,
  therapies: [{ id: 'ent', label: '耳鼻咽喉科で喉頭の観察：声の安静・禁煙、改善しなければ手術', req: { fn: (enc) => enc.tests.some((t) => t.id === 'laryngoscope') || enc.consults.some((c) => c.dept === 'ent') }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  useful: ['laryngoscope', 'cxr', 'neck_us'], key: [['laryngoscope']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '声帯ポリープ：声の安静・禁煙で経過をみて、改善しなければ喉頭微細手術' }),
  teaching: [
    '4週間以上続く嗄声（声がれ）は、喉頭ファイバーで声帯を必ず観察する（喫煙者は喉頭がんを除外）。',
    '声の酷使の後の嗄声で、声帯に平滑なポリープ・結節があれば良性。声の安静・禁煙・逆流性食道炎の治療。改善しなければ手術。',
    '声帯の動きが悪い（反回神経麻痺）なら、肺がん・食道がん・甲状腺がん・大動脈瘤などを胸部CTで探す。',
  ],
  sources: ['AAO-HNS Clinical Practice Guideline: Hoarseness (Dysphonia) (2018)'],
  ideal: () => [{ a: 'test', ids: ['laryngoscope'] }],
});
