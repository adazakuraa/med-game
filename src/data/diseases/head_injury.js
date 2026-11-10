// 軽症頭部外傷（抗凝固薬内服中の高齢者）
// 出典: 日本脳神経外科学会ほか『重症頭部外傷治療・管理のガイドライン第4版』, NICE guideline NG232 Head injury (2023), Canadian CT Head Rule
import { outpatient } from './common.js';
export default outpatient({
  id: 'head_injury', name: '軽症頭部外傷', dept: '脳神経外科', weight: 6,
  demo: { age: [70, 90], ageMode: 'old', male: 0.5 },
  sev: { p: [0.6, 0.35, 0.05], burden: [[14, 20], [20, 26], [26, 32]] },
  comorb: { extra: { af: 1, htn: 0.6 } },
  vars: (rng) => ({ where: rng.pick(['玄関の段差でつまずいて', '夜中にトイレに行こうとして', '自転車で転んで']), part: rng.pick(['おでこ', '後頭部', '右のこめかみ']) }),
  cc: () => '転んで頭を打った', ccKey: 'injury',
  history: {
    onset: { p: 1, text: '2時間前、{where}転び、{part}を打ちました。' },
    trigger: { p: 1, text: 'つまずいて転びました。めまいや胸の痛みはありませんでした。' },
    syncope: { p: 1, text: '気を失ってはいません。打った前後のこともはっきり覚えています。' },
    character: { p: 1, text: '打ったところが少し痛いです。' },
    headache: { p: 0.4, text: '打ったところが少し痛む程度です。' },
    nausea: { p: 0.1, text: '吐き気はありません。' },
    meds: { p: 1, text: '心房細動で血液をサラサラにする薬（アピキサバン）を飲んでいます。' },
    pmh: { p: 1, text: '心房細動と高血圧があります。' },
    location: { p: 1, text: '{part}です。' }, aggravating: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{part}に3cmの皮下血腫と擦過傷。' }, gen_consc: { p: 1, text: '意識清明（GCS 15）。見当識は保たれている。' }, motor: { p: 0, text: '' }, joint: { p: 0, text: '' } },
  tests: {},
  natural: -0.3,
  therapies: [{ id: 'ct', label: '抗凝固薬内服中の頭部外傷：頭部CT（出血の除外）', req: { fn: (enc) => enc.tests.some((t) => t.id === 'head_ct') }, required: true, deadlineH: [4, 4, 4] }],
  harmTags: {},
  useful: ['head_ct', 'coag', 'cbc', 'ecg', 'bs_poct'], key: [['head_ct']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '頭部CTで出血がなく意識清明なら帰宅（家族の観察・頭痛や嘔吐・意識の変化があればすぐ再受診）。抗凝固薬の継続は主治医と相談' }),
  teaching: [
    '頭部外傷では「CTが必要か」を判断する（Canadian CT Head Rule：65歳以上、危険な受傷機転、2回以上の嘔吐、意識障害、頭蓋骨骨折の徴候など）。',
    '抗凝固薬・抗血小板薬を内服している高齢者は、軽い打撲でも頭蓋内出血を起こしやすいので頭部CTを撮る。',
    'CTで異常がなくても、遅れて出血・慢性硬膜下血腫になることがあるので、帰宅時に注意点（頭痛・嘔吐・意識の変化）を説明する。',
    '「なぜ転んだか」（失神・不整脈・低血糖）も評価する。',
  ],
  sources: ['NICE guideline NG232: Head injury (2023)', 'Stiell IG, et al. The Canadian CT Head Rule. Lancet 2001'],
  ideal: () => [{ a: 'test', ids: ['head_ct', 'ecg'] }, { a: 'wait', min: 30 }],
});
