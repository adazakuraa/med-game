// 閉塞性睡眠時無呼吸症候群
// 出典: 日本呼吸器学会『睡眠時無呼吸症候群（SAS）の診療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'osa', name: '閉塞性睡眠時無呼吸症候群', dept: '呼吸器内科', weight: 5,
  demo: { age: [35, 70], ageMode: 'uniform', male: 0.8 },
  comorb: { extra: { htn: 0.7, dm2: 0.3, dyslip: 0.4 } },
  vars: (rng) => ({ bmi: rng.int(30, 36) }),
  cc: () => '日中の眠気がひどい', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '半年くらい前から、昼間の会議中や運転中に眠くなってしまいます。' },
    character: { p: 1, text: '夜は寝ているはずなのに、朝起きても熟睡感がなく、頭が重いです。' },
    fatigue: { p: 1, text: '一日中だるくて眠いです。' },
    snore: { p: 1, text: '妻から、いびきがすごくて、時々息が止まっていると言われます。' },
    sleep: { p: 1, text: '夜中に何度もトイレに起きます。寝つきは悪くありません。' },
    weightgain: { p: 1, text: 'この5年で10kg太りました（BMI {bmi}）。' },
    alcohol: { p: 0.7, text: '毎晩ビールを2缶飲みます。' },
    mood: { p: 0, text: '' }, heatcold: { p: 0, text: '' }, menses: { p: 0, text: '' },
    pmh: { p: 1, text: '高血圧で薬を飲んでいます。' },
  },
  exam: { pharynx: { p: 1, text: '扁桃は小さいが、軟口蓋が低く咽頭腔が狭い（Mallampati分類 4度）。' }, gen_appear: { p: 1, text: '肥満体型で、首が太い。' } },
  tests: { psg: [{ p: 1, persist: true, text: '無呼吸低呼吸指数（AHI）45回/時（重症）。最低SpO2 78%。' }] },
  natural: -0.005,
  therapies: [{ id: 'cpap', label: '簡易睡眠検査→呼吸器内科（睡眠外来）でCPAP導入、減量・飲酒を控える指導', req: { fn: (enc) => enc.tests.some((t) => t.id === 'psg') || enc.consults.some((c) => c.dept === 'resp') }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { benzo: '睡眠時無呼吸にベンゾジアゼピン系（無呼吸を悪化させる）', hypnotic: '未治療の睡眠時無呼吸に睡眠薬（無呼吸を悪化させうる）' },
  useful: ['psg', 'cbc', 'chem', 'thyroid', 'hba1c', 'ecg'], key: [['psg']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '睡眠時無呼吸症候群：外来で睡眠検査→CPAP。眠気が強い間は運転を控えるよう指導' }),
  teaching: [
    'いびき・睡眠中の無呼吸の指摘・日中の強い眠気・起床時の頭痛・夜間頻尿は閉塞性睡眠時無呼吸症候群。肥満・小顎・飲酒がリスク。',
    '高血圧（特に治療抵抗性）・心房細動・糖尿病・脳卒中のリスクになる。居眠り運転による事故も重大。',
    '簡易睡眠検査や終夜睡眠ポリグラフでAHIを評価。中等症以上はCPAP、軽症〜中等症は口腔内装置。減量・節酒・側臥位も。',
    '睡眠薬（特にベンゾジアゼピン系）や寝酒は無呼吸を悪化させる。甲状腺機能低下症も鑑別。',
  ],
  sources: ['睡眠時無呼吸症候群（SAS）の診療ガイドライン2020（日本呼吸器学会）'],
  ideal: () => [{ a: 'test', ids: ['psg', 'thyroid', 'cbc'] }],
});
