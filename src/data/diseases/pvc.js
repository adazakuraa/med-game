// 心室期外収縮
// 出典: 日本循環器学会『2020年改訂版 不整脈薬物治療ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pvc', name: '心室期外収縮', dept: '循環器内科', weight: 5,
  demo: { age: [30, 70], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: { htn: 0.3 } },
  vars: () => ({}),
  cc: () => '脈が飛ぶ感じがする', ccKey: 'palpitation',
  history: {
    onset: { p: 1, text: '2週間前から、時々脈が飛ぶ感じがします。' },
    character: { p: 1, text: '胸がドクンとして、一瞬止まる感じがします。続くことはなく、数秒で治まります。' },
    palpitation: { p: 1, text: 'ドクンとする感じが1日に何回かあります。' },
    trigger: { p: 1, text: '寝不足のときや、コーヒーを飲んだ後、夜横になったときに多いです。' },
    dyspnea: { p: 0, text: '息苦しさはありません。' }, chestpain: { p: 0, text: '胸の痛みはありません。' }, dizziness: { p: 0, text: 'めまいや気を失ったことはありません。' },
    alcohol: { p: 0.4, text: '週末にお酒を飲みます。' }, pmh: { p: 0, text: '心臓の病気は言われていません。' }, meds: { p: 0, text: '' },
    weightloss: { p: 0, text: '体重は変わりません。' }, fever: { p: 0, text: '' }, heatcold: { p: 0, text: '暑がりではありません。' }, family: { p: 0, text: '家族に突然死した人はいません。' },
  },
  exam: { heart_ausc: { p: 1, text: '時々リズムが乱れる（期外収縮）。心雑音なし。' }, lung_ausc: { p: 0, text: '呼吸音は清。' }, thyroid_palp: { p: 0, text: '甲状腺腫なし。' }, leg_edema: { p: 0, text: '下腿浮腫なし。' } },
  tests: { holter: [{ p: 1, persist: true, text: '単形性の心室期外収縮 1日2500発（総心拍の2%）、連発なし。症状と期外収縮が一致。' }], echo: [{ p: 1, text: '左室の大きさ・収縮は正常。弁膜症・心筋症なし。', normal: true }], thyroid: [{ p: 1, text: 'TSH・FT4 正常。', normal: true }] },
  ecg: [{ p: 0.8, text: '幅の広いQRSの期外収縮が散発（単形性）。QT正常。' }],
  natural: -0.01,
  therapies: [{ id: 'eval', label: '心電図・心エコー・ホルターで基礎心疾患と頻度を評価し、カフェイン・寝不足を避けるよう説明（多くは治療不要）', req: { fn: (enc) => enc.tests.some((t) => t.id === 'ecg' && t.done) && enc.tests.some((t) => ['echo', 'holter'].includes(t.id) && t.done) }, effect: -0.3, lagH: 1, required: true, deadlineH: [72, 72, 72] }],
  useful: ['ecg', 'holter', 'echo', 'chem', 'thyroid', 'cbc'], key: [['ecg'], ['holter', 'echo']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '心室期外収縮（基礎心疾患なし）：経過観察（生活指導）' }),
  teaching: [
    '「脈が飛ぶ」「ドクンとする」は期外収縮が最も多い。カフェイン・飲酒・寝不足・ストレスで増える。',
    '心電図・心エコー・ホルター心電図で、基礎心疾患（心筋症・虚血）、頻度（1日1万発以上や総心拍の10〜20%以上）、連発・多形性を評価する。',
    '基礎心疾患がなく頻度が少なければ治療は不要。失神・家族の突然死・心機能低下があれば精査。',
  ],
  sources: ['2020年改訂版 不整脈薬物治療ガイドライン（日本循環器学会）'],
  ideal: () => [{ a: 'test', ids: ['ecg', 'echo', 'holter', 'chem', 'thyroid'] }, { a: 'wait', min: 60 }],
});
