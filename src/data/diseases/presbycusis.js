// 加齢性難聴
// 出典: 日本聴覚医学会 資料, 日本耳鼻咽喉科頭頸部外科学会「補聴器相談医」資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'presbycusis', name: '加齢性難聴', dept: '耳鼻咽喉科', weight: 4,
  demo: { age: [68, 90], ageMode: 'old', male: 0.55 },
  comorb: { extra: { htn: 0.4, dm2: 0.2 } },
  vars: () => ({}),
  cc: () => '耳が遠くなった', ccKey: 'hearing',
  history: {
    onset: { p: 1, text: '（妻）ここ数年でだんだん耳が遠くなりました。テレビの音が大きいと言われます。' },
    hearing: { p: 1, text: '両耳とも聞こえにくいです。特に、人が多い所での会話や、高い声が聞き取りにくいです。' },
    course: { p: 1, text: '何年もかけてゆっくり悪くなっています。急に悪くなったことはありません。' },
    character: { p: 0.6, text: '両耳でジーという耳鳴りがします。' },
    vertigo: { p: 0, text: 'めまいはありません。' }, fever: { p: 0, text: '' }, headache: { p: 0, text: '' }, weakness: { p: 0, text: '' },
    trigger: { p: 0, text: '大きな音の仕事はしていません。' },
  },
  exam: { ear: { p: 0, text: '両側の外耳道・鼓膜は正常。耳垢栓塞なし。' }, nystagmus: { p: 0, text: '眼振なし。' }, facial: { p: 0, text: '顔面神経麻痺なし。' } },
  tests: { audiometry: [{ p: 1, persist: true, text: '両側対称性の感音難聴（高音域ほど低下、平均聴力 右45dB・左48dB）。語音明瞭度の低下。' }] },
  natural: -0.005,
  therapies: [{ id: 'ent', label: '耳鼻咽喉科へ紹介：補聴器の適合（補聴器相談医）と、聞き取りやすい話し方の指導', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ent') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { ent: '耳鼻咽喉科：両側対称性の高音障害型の感音難聴で、加齢性難聴です。平均聴力が40dBを超えており、補聴器の適応です。補聴器外来で試聴し、調整しながら慣れていきましょう。片側だけの急な難聴は突発性難聴として急ぎで受診してください。' },
  useful: ['audiometry'], key: [['audiometry']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '加齢性難聴：耳鼻咽喉科で補聴器の適合' }),
  teaching: [
    '両耳が左右対称にゆっくり聞こえにくくなる、高い音・騒がしい場所での会話が聞き取りにくい → 加齢性難聴。',
    'まず耳垢栓塞・中耳炎を診察で除外。片側性・急性・めまいを伴う場合は別の病気（突発性難聴・聴神経腫瘍・メニエール病）を考える。',
    '難聴は認知症・うつ・社会的孤立の危険因子。補聴器を早めに。ゆっくり・低めの声で正面から話す。',
  ],
  sources: ['日本耳鼻咽喉科頭頸部外科学会「難聴と補聴器」'],
  ideal: () => [{ a: 'test', ids: ['audiometry'] }, { a: 'consult', dept: 'ent', delayMin: 1 }, { a: 'wait', min: 70 }],
});
