// 高尿酸血症（痛風発作の既往）
// 出典: 日本痛風・尿酸核酸学会『高尿酸血症・痛風の治療ガイドライン第3版（2022年追補版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hyperuricemia', name: '高尿酸血症', dept: '内科', weight: 4,
  demo: { age: [35, 70], ageMode: 'uniform', male: 0.9 },
  comorb: { extra: { htn: 0.5, dyslip: 0.4 } },
  vars: () => ({}),
  cc: () => '健診で尿酸が高いと言われた', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '健診で尿酸値が9mg/dLと言われました。' },
    character: { p: 1, text: '今は痛いところはありません。' },
    pmh: { p: 1, text: '1年前と半年前に、足の親指の付け根が赤く腫れて歩けなくなりました（痛風と言われました）。' },
    alcohol: { p: 1, text: '毎晩ビールを500mL2本飲みます。' },
    diet: { p: 1, text: 'レバーや魚卵、甘いジュースが好きです。' },
    weightgain: { p: 1, text: '太り気味です。' },
    meds: { p: 1, text: '血圧の薬（サイアザイド系の利尿薬入り）を飲んでいます。' },
    family: { p: 0, text: '' }, smoking: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '今は関節の腫脹・発赤はない。痛風結節はない。' } },
  labs: { URIC: { add: [2, 3.5], k: 0 } },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '生活指導（節酒・肥満の改善・プリン体や果糖を控える）と尿酸降下薬（尿酸6mg/dL以下を目標）', req: { tag: 'urate_lowering' }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['chem', 'ua', 'lipid', 'hba1c'], key: [['chem'], ['ua']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '痛風発作を繰り返す高尿酸血症：外来で尿酸降下薬と生活指導' }),
  teaching: [
    '尿酸7.0mg/dL超が高尿酸血症。痛風発作の既往や痛風結節があれば、尿酸降下薬で6.0mg/dL以下を目指す。',
    '尿酸降下薬は発作が治まってから少量で開始する（急に下げると発作を誘発）。',
    '生活指導：節酒（特にビール）、肥満の改善、プリン体・果糖を控える、水分を十分に。',
    'サイアザイド・ループ利尿薬は尿酸を上げる。腎機能・尿路結石・メタボリック症候群も評価する。',
  ],
  sources: ['高尿酸血症・痛風の治療ガイドライン第3版（日本痛風・尿酸核酸学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'ua'] }, { a: 'rx', drugId: 'febuxostat', route: 'po', dose: 10, freq: 'q24h', days: 28 }],
});
