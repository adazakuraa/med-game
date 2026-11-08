// 甲状腺機能亢進症（バセドウ病）
// 出典: 日本甲状腺学会『バセドウ病治療ガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hyperthyroid', name: '甲状腺機能亢進症（バセドウ病）', weight: 4,
  demo: { age: [20, 55], ageMode: 'young', male: 0.2 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[22, 30], [30, 38], [38, 46]] },
  noPregnancy: true,
  cc: () => '動悸と体重減少', ccKey: 'palpitation',
  history: {
    onset: { p: 1, text: '2か月くらい前から、動悸と汗が増えました。' },
    character: { p: 1, text: 'ドキドキして、暑がりになって、よく食べるのに痩せてきました。' },
    palpitation: { p: 1, text: '安静にしていてもドキドキします。' },
    weightloss: { p: 0.9, text: '食欲はあるのに2か月で4kg痩せました。' },
    heatcold: { p: 0.9, text: '暑がりになって、汗をたくさんかきます。' },
    fatigue: { p: 0.7, text: '疲れやすく、手が震えます。' },
    diarrhea: { p: 0.4, text: '便がゆるくなりました。' },
    menses: { p: 0.4, text: '生理の量が減りました。' },
    family: { p: 0.3, text: '叔母がバセドウ病です。' },
  },
  exam: { thyroid_palp: { p: 0.9, text: '甲状腺はびまん性に腫大し、軟らかい。血管雑音を聴取。' }, tremor: { p: 0.85, text: '手指の細かい振戦。腱反射の亢進。' }, conjunctiva: { p: 0.4, text: '眼球突出・眼瞼後退。' }, skin: { p: 0.6, text: '皮膚は温かく湿潤。' } },
  vitals: { HR: { to: [110, 125], k: 0.5 }, SBP: { to: [140, 150], k: 1 } },
  labs: { TSH: { to: [0.005, 0.01], k: 0.1 }, FT4: { to: [3.5, 6.5], k: 0.4 }, ALT: { add: [5, 30], k: 1, p: 0.4 } },
  natural: 0,
  therapies: [{ id: 'antithyroid', label: '抗甲状腺薬（チアマゾール）', req: { tag: 'antithyroid' }, effect: -0.12, lagH: 24, required: true, deadlineH: [72, 72, 48] }, { id: 'bb', label: '動悸にβ遮断薬', req: { tag: 'betablocker' }, effect: -0.1, lagH: 1, required: false, deadlineH: [24, 24, 24] }],
  useful: ['thyroid', 'cbc', 'chem', 'ecg', 'uhcg'], key: [['thyroid'], ['ecg']],
  teaching: [
    '動悸・体重減少（食欲はある）・暑がり・発汗・手指振戦・甲状腺腫大はバセドウ病を考える。',
    'TSH低値・FT4高値で診断（TRAb陽性でバセドウ病）。心房細動の合併に注意し心電図を。',
    '治療は抗甲状腺薬（チアマゾール）。無顆粒球症（発熱・咽頭痛が出たらすぐ受診）を必ず説明する。動悸にはβ遮断薬。',
    '妊娠の可能性があれば薬の選択が変わる。',
  ],
  sources: ['バセドウ病治療ガイドライン2019（日本甲状腺学会）'],
  ideal: () => [{ a: 'test', ids: ['thyroid', 'ecg', 'cbc', 'chem'] }, { a: 'wait', min: 70 }, { a: 'rx', drugId: 'thiamazole', route: 'po', dose: 15, freq: 'q24h', days: 14 }, { a: 'rx', drugId: 'bisoprolol', route: 'po', dose: 2.5, freq: 'q24h', days: 14 }],
});
