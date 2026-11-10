// 特発性正常圧水頭症
// 出典: 日本正常圧水頭症学会『特発性正常圧水頭症診療ガイドライン第3版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'nph', name: '特発性正常圧水頭症', dept: '脳神経外科', weight: 2, minLevel: 2,
  demo: { age: [68, 88], ageMode: 'old', male: 0.6 },
  comorb: { extra: { htn: 0.5 } },
  vars: () => ({}),
  cc: () => '物忘れと歩き方の変化（家族が心配）', ccKey: 'memory',
  history: {
    onset: { p: 1, text: '（家族）1年くらい前から歩くのが遅くなり、最近は物忘れと尿漏れが出てきました。' },
    course: { p: 1, text: '（家族）ゆっくり進んでいます。' },
    memory: { p: 1, text: '（家族）ぼんやりして、反応が遅くなりました。同じことを何度も聞くほどではありません。' },
    character: { p: 1, text: '（家族）すり足で小股で、足を開いて歩きます。方向転換でふらつきます。' },
    trigger: { p: 1, text: '（家族）頭を打ったことはありません。' },
    mood: { p: 0.4, text: '（家族）意欲が落ちています。' },
    adl: { p: 1, text: '（家族）トイレに間に合わず漏らすことがあります。' },
    meds: { p: 1, text: '（家族）血圧の薬だけです。' },
    alcohol: { p: 0, text: '' },
  },
  exam: { gen_consc: { p: 1, text: '意識は清明だが、反応が遅い。' }, rigidity: { p: 1, text: '開脚・小刻み・すり足歩行（磁性歩行）。筋強剛や安静時振戦はない。' }, motor: { p: 1, text: '明らかな麻痺はない。' } },
  tests: { head_ct: [{ p: 1, persist: true, text: '脳室の拡大、シルビウス裂の開大と、高位円蓋部の脳溝の狭小化（DESH所見）。硬膜下血腫はない。' }], head_mri: [{ p: 1, persist: true, text: '脳室拡大とDESH所見（正常圧水頭症に特徴的）。' }], hdsr: [{ p: 1, persist: true, text: '改訂長谷川式 22/30点（注意・遂行機能の低下が目立つ）。' }] },
  natural: -0.002,
  therapies: [{ id: 'nsurg', label: '脳神経外科へ：髄液排除試験（タップテスト）で改善すればシャント手術', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'nsurg') }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { nsurg: '脳神経外科：歩行障害・認知機能低下・尿失禁の3徴とDESH所見から特発性正常圧水頭症を疑います。タップテストで改善すれば、シャント手術で症状の改善が期待できます（治る認知症）。' },
  useful: ['head_ct', 'head_mri', 'hdsr', 'thyroid', 'b12', 'chem'], key: [['head_ct', 'head_mri'], ['hdsr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '正常圧水頭症の疑い：脳神経外科外来でタップテスト' }),
  teaching: [
    '高齢者の歩行障害（小刻み・すり足・開脚）・認知機能低下・尿失禁（3徴）は正常圧水頭症。歩行障害が最初に出ることが多い。',
    '頭部CT/MRIで脳室拡大とDESH所見。タップテストで改善すればシャント手術で治る（治る認知症）。',
    'パーキンソン病（安静時振戦・筋強剛）、アルツハイマー型認知症、慢性硬膜下血腫との区別。',
  ],
  sources: ['特発性正常圧水頭症診療ガイドライン第3版'],
  ideal: () => [{ a: 'test', ids: ['head_ct', 'hdsr', 'thyroid', 'b12'] }, { a: 'consult', dept: 'nsurg', delayMin: 1 }, { a: 'wait', min: 70 }],
});
