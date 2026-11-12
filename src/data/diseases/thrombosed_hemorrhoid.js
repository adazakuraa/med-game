// 血栓性外痔核
// 出典: 日本大腸肛門病学会『肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'thrombosed_hemorrhoid', name: '血栓性外痔核', dept: '消化器外科', weight: 4,
  demo: { age: [25, 65], ageMode: 'uniform', male: 0.6 },
  comorb: { extra: {} },
  vars: (rng) => ({ trig: rng.pick(['長時間の運転の後', 'ゴルフの後', '飲み会の翌日', 'ひどい便秘でいきんだ後']) }),
  cc: () => '肛門にしこりができて痛い', ccKey: 'anal_pain',
  history: {
    onset: { p: 1, text: '昨日、{trig}から、肛門に急にしこりができて痛くなりました。' },
    character: { p: 1, text: '肛門のふちに豆のような硬いしこりがあって、座ると痛いです。' },
    location: { p: 1, text: '肛門のふちです。' },
    trigger: { p: 1, text: '{trig}です。' },
    bloodystool: { p: 0.2, text: '少し血が付きました。' }, fever: { p: 0, text: '熱はありません。' },
    constipation: { p: 0.5, text: '便秘がちです。' }, pmh: { p: 0, text: '' }, diarrhea: { p: 0, text: '' },
  },
  exam: { rectal: { p: 1, text: '肛門縁に1cmの暗紫色の硬い腫瘤（血栓）、圧痛あり。周囲の発赤・波動はない。' }, skin: { p: 1, text: '肛門縁の青紫色の腫瘤。' } },
  natural: -0.08,
  therapies: [{ id: 'tx', label: '外用薬（坐剤・軟膏）・鎮痛・入浴で温める（痛みが強ければ血栓除去）', req: { anyTag: ['hemorrhoid_topical', 'nsaid', 'analgesic'] }, effect: -0.3, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '血栓性外痔核：外用薬・鎮痛で外来（多くは数週で吸収）' }),
  teaching: [
    '長時間の座位・飲酒・いきみの後に、肛門縁に急にできる痛い暗紫色の硬いしこりは血栓性外痔核。',
    '多くは外用薬・鎮痛・入浴で数週かけて吸収される。痛みが強いときは局所麻酔で血栓を除去する。',
    '発熱・発赤・持続する拍動痛があれば肛門周囲膿瘍を考える。',
  ],
  sources: ['肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版（日本大腸肛門病学会）'],
  ideal: () => [{ a: 'rx', drugId: 'hemorrhoid_oint', route: 'top', dose: 2, freq: 'q12h', days: 14 }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 5 }],
});
