// 肥大型心筋症（閉塞性）
// 出典: 日本循環器学会『2018年改訂版 心筋症診療ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hcm', name: '肥大型心筋症', dept: '循環器内科', weight: 1.5,
  demo: { age: [18, 50], ageMode: 'young', male: 0.65 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[20, 28], [28, 36], [36, 44]] },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '運動中に気を失いかけた', ccKey: 'syncope',
  history: {
    syncope: { p: 1, text: 'サッカーの試合中に走っていたら、目の前が暗くなって倒れそうになりました。' },
    onset: { p: 1, text: '今日の午後です。少し座ったら治りました。' },
    character: { p: 1, text: '最近、運動すると胸が苦しくなったり、息が切れたりします。' },
    chestpain: { p: 0.6, text: '運動すると胸が締め付けられます。' }, dyspnea: { p: 0.7, text: '階段で息切れがします。' }, palpitation: { p: 0.4, text: '時々動悸がします。' },
    family: { p: 1, text: '父の兄が40歳で突然死しています。' },
    sweating: { p: 0, text: '前に冷や汗や吐き気はありませんでした。' }, nausea: { p: 0, text: '' }, seizure: { p: 0, text: 'けいれんはなかったそうです。' },
    meds: { p: 0, text: '薬は飲んでいません。' }, pmh: { p: 0, text: '健診で心電図の異常を言われたことがあります。' },
  },
  exam: { heart_ausc: { p: 1, text: '胸骨左縁に収縮期駆出性雑音（Valsalvaや立位で増強、しゃがむと減弱）。IV音。' }, gen_consc: { p: 0, text: '意識清明。' }, periph: { p: 0, text: '末梢は温かい。' } },
  tests: { echo: [{ p: 1, persist: true, text: '心室中隔の著明な非対称性肥厚（22mm）、僧帽弁の収縮期前方運動、左室流出路の圧較差 60mmHg（閉塞性肥大型心筋症）。左室収縮は保たれる。' }], holter: [{ p: 0.4, text: '非持続性心室頻拍（5連発）を1回認める。' }], orthostatic: [{ p: 1, text: '起立で血圧低下なし。', normal: true }] },
  ecg: [{ p: 1, text: '左室高電位、V4〜V6の深い陰性T波、異常Q波（II・III・aVF）。' }],
  natural: -0.01,
  therapies: [
    { id: 'bb', label: 'β遮断薬（流出路狭窄の軽減）と、激しい運動・脱水を避ける。硝酸薬・利尿薬・血管拡張薬は避ける', req: { tag: 'betablocker' }, effect: -0.2, lagH: 2, required: true, deadlineH: [48, 48, 48] },
    { id: 'cardio', label: '循環器内科で突然死の危険評価（ICDの適応）と家族のスクリーニング', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'cardio') }, effect: -0.1, lagH: 6, required: true, deadlineH: [48, 48, 48] },
  ],
  consult: { cardio: '循環器内科：心エコーで非対称性中隔肥厚と左室流出路狭窄があり、閉塞性肥大型心筋症です。運動中の失神前駆症状と若年突然死の家族歴があり、突然死の危険が高いので、ホルター・MRIで評価し、植込み型除細動器（ICD）を検討します。競技スポーツは控えてください。ご家族の検査も勧めます。' },
  harmTags: { nitrate: '閉塞性肥大型心筋症に硝酸薬（流出路狭窄の悪化）', diuretic: '閉塞性肥大型心筋症に利尿薬（前負荷低下で狭窄が悪化）', vasodilator: '閉塞性肥大型心筋症に血管拡張薬' },
  useful: ['ecg', 'echo', 'holter', 'chem', 'cbc', 'bnp', 'orthostatic', 'bs_poct'], key: [['ecg'], ['echo']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '肥大型心筋症：β遮断薬と運動制限、循環器内科で突然死の危険評価' }),
  teaching: [
    '若年者の運動中の失神（前駆症状）・胸痛・息切れ、若年突然死の家族歴、心雑音（立位・Valsalvaで増強）は肥大型心筋症を疑う。運動中の失神は不整脈・器質的心疾患を必ず考える。',
    '心電図で左室肥大・深い陰性T波・異常Q波、心エコーで非対称性中隔肥厚と流出路狭窄。',
    'β遮断薬、脱水・激しい運動を避ける。硝酸薬・利尿薬は狭窄を悪化させる。突然死予防にICD、家族のスクリーニング。',
  ],
  sources: ['2018年改訂版 心筋症診療ガイドライン（日本循環器学会）'],
  ideal: () => [{ a: 'test', ids: ['ecg', 'echo', 'chem', 'cbc'] }, { a: 'rx', drugId: 'bisoprolol', route: 'po', dose: 2.5, freq: 'q24h', days: 28 }, { a: 'consult', dept: 'cardio', delayMin: 1 }, { a: 'wait', min: 70 }],
});
