// 原発性胆汁性胆管炎
// 出典: 厚生労働省 難治性の肝・胆道疾患に関する調査研究班『原発性胆汁性胆管炎（PBC）診療ガイドライン2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pbc', name: '原発性胆汁性胆管炎', dept: '消化器内科', weight: 2,
  demo: { age: [45, 70], ageMode: 'uniform', male: 0.1 },
  comorb: { extra: { dyslip: 0.3 } },
  vars: () => ({}),
  cc: () => '体がかゆい', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '半年前から、体のあちこちがかゆいです。特に夜にかゆくなります。' },
    character: { p: 1, text: '発疹は出ていないのに、かゆくてかいてしまいます。' },
    location: { p: 1, text: '手足と背中です。' },
    itch: { p: 1, text: '夜に強くなります。' },
    fatigue: { p: 0.7, text: '疲れやすいです。' },
    trigger: { p: 0, text: '新しい洗剤や薬は使っていません。' }, sickcontact: { p: 0, text: '家族にかゆい人はいません。' },
    meds: { p: 0, text: '飲んでいる薬はありません。' }, pmh: { p: 1, text: '健診で肝臓の数値（ALP・γ-GTP）が高いと言われていました。目と口が乾きやすいです。' },
    alcohol: { p: 0, text: 'お酒は飲みません。' },
  },
  exam: { skin: { p: 1, text: '発疹はなく、ひっかき傷のみ。眼瞼に黄色腫。' }, conjunctiva: { p: 0, text: '黄疸なし。' }, abd_palp: { p: 0.3, text: '軽い肝腫大。' } },
  labs: { ALP: { add: [200, 400], k: 0 }, GGT: { add: [150, 400], k: 0 }, AST: { add: [10, 40], k: 0 }, ALT: { add: [10, 40], k: 0 }, LDL: { add: [30, 70], k: 0 } },
  tests: { ama: [{ p: 1, persist: true, text: '抗ミトコンドリアM2抗体 陽性（高値）。' }], abd_us: [{ p: 1, text: '胆管の拡張なし。胆石なし。肝表面は平滑。' }], hep_virus: [{ p: 1, text: 'HBs抗原・HCV抗体 陰性。' }], koh: [{ p: 1, text: '真菌を認めない。' }] },
  natural: -0.005,
  therapies: [{ id: 'udca', label: 'ウルソデオキシコール酸と、消化器内科での経過観察（骨粗鬆症・脂溶性ビタミン欠乏にも注意）', req: { tag: 'udca' }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['chem', 'cbc', 'ama', 'abd_us', 'hep_virus', 'thyroid', 'lipid', 'koh', 'ana'], key: [['chem'], ['ama']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '原発性胆汁性胆管炎：ウルソデオキシコール酸で外来治療' }),
  teaching: [
    '中年女性の、発疹のないかゆみ（夜に強い）・疲労感と、ALP・γ-GTP上昇（胆汁うっ滞型の肝障害）は原発性胆汁性胆管炎。',
    '抗ミトコンドリア抗体（M2）が陽性。エコーで胆管の拡張（閉塞）がないことを確認する。',
    'シェーグレン症候群・橋本病を合併しやすい。治療はウルソデオキシコール酸で、早期に治療すれば予後は良い。',
    '発疹のないかゆみでは、肝胆道疾患・腎不全・甲状腺疾患・血液疾患（真性多血症など）・薬剤・乾皮症を考える。',
  ],
  sources: ['原発性胆汁性胆管炎（PBC）診療ガイドライン2023'],
  ideal: () => [{ a: 'test', ids: ['chem', 'cbc', 'abd_us', 'ama', 'hep_virus'] }, { a: 'rx', drugId: 'udca', route: 'po', dose: 200, freq: 'q8h', days: 28 }],
});
