// 伝染性単核球症
// 出典: 日本感染症学会 資料, Luzuriaga K, Sullivan JL. N Engl J Med 2010
import { outpatient } from './common.js';
export default outpatient({
  id: 'mono', name: '伝染性単核球症', dept: '内科', weight: 3,
  demo: { age: [16, 30], ageMode: 'young', male: 0.5 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[24, 32], [32, 40], [40, 48]] },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '熱と喉の痛み、首のリンパ節が腫れた', ccKey: 'lymph',
  history: {
    onset: { p: 1, text: '1週間前から38度台の熱と喉の痛みがあり、首が腫れてきました。' },
    character: { p: 1, text: 'とにかくだるいです。' },
    fever: { p: 1, text: '38〜39度の熱が続いています。' },
    sorethroat: { p: 1, text: '喉がとても痛いです。' },
    sickcontact: { p: 0.5, text: '恋人も少し前に熱を出していました。' },
    nightsweat: { p: 0, text: '寝汗はありません。' },
    weightloss: { p: 0, text: '体重は変わりません。' },
    meds: { p: 1, text: '近所の医院でアモキシシリンをもらって飲んだら、全身に発疹が出ました。' },
    cough: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { neck_ln: { p: 1, text: '両側の後頸部リンパ節が腫大（圧痛は軽い）。' }, pharynx: { p: 1, text: '両側扁桃の腫大と白色の偽膜。' }, abd_palp: { p: 0.6, text: '肝脾腫（左季肋下に脾臓を触れる）。' }, skin: { p: 0.5, text: '体幹に紅斑性の発疹（アモキシシリン内服後）。' }, conjunctiva: { p: 0.3, text: 'まぶたのむくみ。' } },
  vitals: { T: { to: [38.2, 39], k: 0.5 } },
  labs: { AST: { add: [50, 200], k: 0.5 }, ALT: { add: [80, 300], k: 0.5 }, LDH: { add: [100, 300], k: 0.5 }, WBC: { to: [10000, 15000], k: 0 } },
  tests: { ebv: [{ p: 1, persist: true, text: 'VCA-IgM 陽性、EBNA 陰性（EBウイルス初感染）。' }], smear: [{ p: 1, persist: true, text: 'リンパ球の増加と異型リンパ球（15%）。' }], strep_ag: { p: 0 } },
  natural: -0.08,
  therapies: [{ id: 'sx', label: '対症療法（解熱鎮痛薬・安静）、脾破裂予防に数週間は激しい運動を控える', req: { anyTag: ['analgesic'] }, effect: -0.2, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  harmTags: {},
  useful: ['cbc', 'smear', 'chem', 'ebv', 'strep_ag', 'hiv', 'abd_us'], key: [['cbc', 'smear'], ['chem']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '伝染性単核球症：対症療法で外来（数週間はコンタクトスポーツ・激しい運動を避ける）' }),
  teaching: [
    '若年者の発熱・咽頭痛（扁桃の白苔）・後頸部リンパ節腫脹・肝脾腫・強い倦怠感は伝染性単核球症（EBウイルス）。唾液で感染する（kissing disease）。',
    '異型リンパ球の増加・肝機能障害。アモキシシリンなどで高頻度に発疹が出る（溶連菌と間違えて抗菌薬を出さない）。',
    '治療は対症療法。脾破裂を防ぐため数週間は激しい運動を避ける。',
    '似た症状：溶連菌咽頭炎、急性HIV感染症、サイトメガロウイルス。',
  ],
  sources: ['Luzuriaga K, Sullivan JL. Infectious mononucleosis. N Engl J Med 2010'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'smear', 'chem', 'ebv', 'strep_ag'] }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 5 }],
});
