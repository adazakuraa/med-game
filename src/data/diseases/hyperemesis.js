// 妊娠悪阻
// 出典: 産婦人科診療ガイドライン 産科編2023
import { outpatient } from './common.js';
export default outpatient({
  id: 'hyperemesis', name: '妊娠悪阻', dept: '産婦人科', weight: 2,
  demo: { age: [22, 40], ageMode: 'uniform', male: 0 },
  forcePregnant: true,
  sev: { p: [0.4, 0.45, 0.15], burden: [[25, 32], [32, 42], [42, 52]] },
  initVolume: [[800, 1400], [1400, 2200], [2200, 3000]],
  cc: () => '吐き気が強く食べられない', ccKey: 'vomit_malaise',
  history: {
    onset: { p: 1, text: '2週間ほど前からつわりがひどく、この3日はほとんど何も食べられません。' },
    character: { p: 1, text: '水を飲んでも吐いてしまいます。' },
    nausea: { p: 1, text: '1日に何度も吐きます。水も吐いてしまいます。' },
    weightloss: { p: 1, text: '妊娠前より4kg痩せました。' },
    dizziness: { p: 0.7, text: '立つとふらふらします。' },
    lmp: { p: 1, text: '最終月経から9週くらいです。産婦人科で妊娠と言われています。' },
    abdpain: { p: 0, text: '' },
    fever: { p: 0, text: '' },
    diarrhea: { p: 0, text: '' },
  },
  exam: { oral_mucosa: { p: 1, text: '口腔粘膜・舌は乾燥。' }, skin_turgor: { p: 0.6, text: 'ツルゴール低下。' }, abd_palp: { p: 0, text: '' } },
  vitals: { HR: { to: [100, 115], k: 1 } },
  labs: { K: { add: [-1.0, -0.5], k: 1 }, CL: { add: [-8, -4], k: 1 }, HCO3: { add: [2, 5], k: 1 }, BHB: { to: [800, 2500], k: 1 }, U_KET: { ord: [3, 4], p: 1 } },
  natural: -0.05,
  canDrink: (b, eff) => !!eff.tags.antiemetic && b < 35,
  fluidLoss: (b) => 40 * (b / 40),
  therapies: [
    { id: 'fluid', label: '補液（細胞外液＋ブドウ糖）', req: { fluidTotal: 1000 }, required: true, deadlineH: [4, 3, 2] },
    { id: 'thiamine', label: 'ビタミンB1（Wernicke脳症の予防）', req: { tag: 'thiamine' }, required: true, deadlineH: [6, 6, 4] },
  ],
  dynamics: (enc, eff) => (enc.state.ivCryst > 800 && eff.tags.thiamine ? -0.6 : enc.state.ivCryst > 800 ? -0.4 : 0),
  harmTags: { nsaid: '妊娠中のNSAIDsは避ける' },
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'admit', why: '脱水・ケトン尿：入院で補液（軽症は外来点滴も）' } : { ok: ['admit'], best: 'admit', why: '妊娠悪阻：入院で補液とビタミンB1' }),
  useful: ['uhcg', 'ua', 'chem', 'cbc', 'tvus', 'thyroid', 'vbg'], key: [['ua'], ['chem', 'vbg']],
  teaching: [
    '妊娠初期の悪心・嘔吐が強く、体重減少・脱水・尿ケトン陽性になれば妊娠悪阻。',
    '治療は補液。ブドウ糖を含む輸液の前にビタミンB1を補充してWernicke脳症を防ぐ（ビタミンB1欠乏で意識障害・眼球運動障害・失調）。',
    '電解質（低K）を補正する。胞状奇胎・多胎・甲状腺機能亢進・ほかの原因（胃腸炎・虫垂炎など）も考える。',
  ],
  sources: ['産婦人科診療ガイドライン 産科編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'chem'] }, { a: 'rx', drugId: 'thiamine', route: 'iv', dose: 100, freq: 'q24h', days: 3 }, { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 }, { a: 'fluid', fluidId: 'sol3', mode: 'cont', rate: 100 }, { a: 'rx', drugId: 'mcp', route: 'iv', dose: 10, freq: 'q12h', days: 3 }],
});
