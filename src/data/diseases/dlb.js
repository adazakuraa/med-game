// レビー小体型認知症
// 出典: 日本神経学会『認知症疾患診療ガイドライン2017』, McKeith IG, et al. Neurology 2017（DLB臨床診断基準）
import { outpatient } from './common.js';
export default outpatient({
  id: 'dlb', name: 'レビー小体型認知症', dept: '脳神経内科', weight: 3,
  demo: { age: [70, 88], ageMode: 'old', male: 0.6 },
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => '物忘れと、いない人が見えると言う', ccKey: 'memory',
  history: {
    onset: { p: 1, text: '（妻）1年ほど前から物忘れが出てきて、最近「部屋に子どもが座っている」と言うようになりました。' },
    course: { p: 1, text: '（妻）日によって、時間によって、はっきりしているときとぼんやりしているときの差が大きいです。' },
    memory: { p: 1, text: '（妻）物忘れはありますが、アルツハイマーと言われた母ほどではありません。' },
    character: { p: 1, text: '（妻）夜中に大声で寝言を言ったり、手足をばたつかせたりします。最近、歩き方が小刻みになり、よく転びます。' },
    hallucination: { p: 1, text: '（本人）知らない子どもや小動物がはっきり見えます。' },
    meds: { p: 1, text: '（妻）以前、幻覚に対して別の病院で抗精神病薬をもらったら、体が固くなって歩けなくなりました。' },
    mood: { p: 0.3, text: '（妻）少し元気がありません。' }, trigger: { p: 0, text: '' }, adl: { p: 1, text: '（妻）身の回りのことは手伝えばできます。' }, alcohol: { p: 0, text: 'お酒は飲みません。' },
    dizziness: { p: 0.5, text: '（妻）立ち上がると血圧が下がって、ふらつきます。' }, constipation: { p: 0.7, text: '（妻）便秘がひどいです。' },
  },
  exam: { gen_consc: { p: 1, text: '意識清明だが注意力の低下。' }, rigidity: { p: 1, text: '両上肢に軽い歯車様固縮。' }, motor: { p: 1, text: '小刻み歩行、動作緩慢。麻痺なし。' }, tremor: { p: 0, text: '安静時振戦は目立たない。' } },
  tests: { hdsr: [{ p: 1, persist: true, text: 'HDS-R 20点。注意・視空間認知の低下（立方体の模写ができない）が目立ち、記憶は比較的保たれる。' }], head_mri: [{ p: 1, text: '海馬の萎縮は軽度。脳血管障害なし。', normal: true }], head_ct: [{ p: 1, text: '軽い脳萎縮。出血・梗塞なし。', normal: true }], orthostatic: [{ p: 0.6, text: '臥位132/78 → 立位3分 104/64（起立性低血圧）。' }] },
  natural: -0.005,
  therapies: [{ id: 'tx', label: 'コリンエステラーゼ阻害薬（ドネペジル）と、抗精神病薬を避ける（過敏性）、転倒・起立性低血圧への対策', req: { tag: 'achei' }, effect: -0.2, lagH: 24, required: true, deadlineH: [48, 48, 48] }],
  harmTags: { antipsychotic: 'レビー小体型認知症に抗精神病薬（重い過敏反応：パーキンソニズム・意識障害）' },
  useful: ['hdsr', 'head_mri', 'head_ct', 'thyroid', 'b12', 'chem', 'cbc', 'orthostatic'], key: [['hdsr'], ['head_ct', 'head_mri']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'レビー小体型認知症：外来で薬物療法と家族への説明（転倒・誤嚥に注意）' }),
  teaching: [
    '認知機能の変動・ありありとした幻視・レム睡眠行動異常症（夜中に叫ぶ・暴れる）・パーキンソニズムがあればレビー小体型認知症。記憶障害は初期に目立たないこともある。',
    '抗精神病薬に過敏（固縮・意識障害・悪性症候群）なので、幻覚に安易に使わない。',
    '起立性低血圧・便秘などの自律神経症状、転倒が多い。治療はドネペジル、パーキンソニズムにレボドパ。',
  ],
  sources: ['認知症疾患診療ガイドライン2017（日本神経学会）'],
  ideal: () => [{ a: 'test', ids: ['hdsr', 'head_ct', 'thyroid', 'b12'] }, { a: 'rx', drugId: 'donepezil_rx', route: 'po', dose: 3, freq: 'q24h', days: 14 }],
});
