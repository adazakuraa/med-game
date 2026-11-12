// アフタ性口内炎
// 出典: 日本口腔内科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'aphthous', name: 'アフタ性口内炎', dept: '歯科口腔外科', weight: 4,
  demo: { age: [15, 50], ageMode: 'young', male: 0.4 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '口内炎が痛くて食べにくい', ccKey: 'oral',
  history: {
    onset: { p: 1, text: '3日前から下唇の内側と舌の横に口内炎ができて、しみて痛いです。' },
    character: { p: 1, text: '丸くて白い口内炎で、周りが赤いです。食べ物がしみます。' },
    trigger: { p: 1, text: '仕事が忙しくて寝不足が続いています。年に何回かできます。' },
    fever: { p: 0, text: '熱はありません。' }, dyspnea: { p: 0, text: '' },
    pmh: { p: 0, text: '陰部の潰瘍、目の炎症、下痢が続くことはありません。' },
  },
  exam: { oral_mucosa: { p: 1, text: '下口唇粘膜と舌縁に5mmの円形の浅い潰瘍、白い偽膜と周囲の紅暈が2個。小水疱はない。' }, neck_ln: { p: 0, text: '頸部リンパ節腫脹なし。' } },
  tests: {},
  natural: -0.08,
  therapies: [{ id: 'tx', label: 'ステロイド口腔用軟膏・含嗽、休養（2週以上治らなければ生検）', req: { tag: 'oral_steroid' }, effect: -0.2, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'アフタ性口内炎：口腔用ステロイドで外来（1〜2週で治る）' }),
  teaching: [
    '円形の浅い潰瘍に白い偽膜と赤い縁取りがあり、1〜2週で治ることを繰り返す → アフタ性口内炎。疲れ・寝不足で出やすい。',
    '繰り返す口内炎に陰部潰瘍・ぶどう膜炎・皮膚症状があればベーチェット病、下痢・体重減少ならクローン病、貧血ならビタミンB12・鉄欠乏を考える。',
    '2週以上治らない潰瘍・硬い潰瘍は口腔がんを疑い生検。',
  ],
  sources: ['日本口腔内科学会「アフタ性口内炎」'],
  ideal: () => [{ a: 'rx', drugId: 'triamcinolone_oral', route: 'top', dose: 0.2, freq: 'q8h', days: 7 }],
});
