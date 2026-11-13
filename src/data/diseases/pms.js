// 月経前症候群（PMS）
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pms', name: '月経前症候群', dept: '産婦人科', weight: 4,
  demo: { age: [20, 45], ageMode: 'uniform', male: 0 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '生理の前になるとイライラして体調が悪い', ccKey: 'menstrual',
  history: {
    onset: { p: 1, text: 'ここ1年くらい、毎月、生理の1週間くらい前からイライラ・気分の落ち込み・頭痛・お腹の張りがあります。' },
    menses: { p: 1, text: '生理は28日周期で順調です。生理が始まると数日で症状がすっと消えます。' },
    lmp: { p: 1, text: '最終月経は3週間前です。妊娠の可能性はありません。' },
    character: { p: 1, text: '家族にきつく当たってしまい、仕事に集中できません。胸が張って、むくみます。' },
    mood: { p: 1, text: '生理前だけ落ち込みますが、生理の後は普段どおりです。' },
    weightgain: { p: 0.5, text: '生理前に1〜2kg体重が増えます。' },
    weightloss: { p: 0, text: '' }, heatcold: { p: 0, text: '' }, meds: { p: 0, text: '飲んでいる薬はありません。' }, pmh: { p: 0, text: '持病はありません。' },
  },
  exam: { skin: { p: 0, text: '特記所見なし。' }, thyroid_palp: { p: 0, text: '甲状腺腫なし。' } },
  tests: { uhcg: [{ p: 1, text: '陰性。', normal: true }], thyroid: [{ p: 1, text: 'TSH・FT4 正常。', normal: true }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '症状日記・生活指導と、低用量ピル（LEP）またはSSRI', req: { anyTag: ['ocp', 'ssri'] }, effect: -0.2, lagH: 24, required: true, deadlineH: [48, 48, 48] }],
  useful: ['uhcg', 'thyroid', 'cbc'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '月経前症候群：外来で治療（症状日記で月経周期との関係を確認）' }),
  teaching: [
    '月経の3〜10日前から始まり、月経が来ると消える心身の症状（イライラ・抑うつ・頭痛・乳房の張り・むくみ）は月経前症候群。精神症状が強いものは月経前不快気分障害（PMDD）。',
    '症状日記で月経周期との関係を確かめる。月経後も続く場合はうつ病・不安障害・甲状腺疾患を考える。',
    '治療は生活指導、低用量ピル（LEP）、SSRI、漢方薬など。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['uhcg', 'thyroid'] }, { a: 'rx', drugId: 'ocp', route: 'po', dose: 1, freq: 'q24h', days: 28 }],
});
