// 熱中症（Ⅰ〜Ⅱ度：熱疲労）
// 出典: 日本救急医学会『熱中症診療ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'heat_exhaustion', name: '熱中症（Ⅱ度・熱疲労）', dept: '救急科', weight: 4,
  season: { summer: 4, winter: 0.05, spring: 0.3, autumn: 0.4 },
  demo: { age: [18, 70], ageMode: 'uniform', male: 0.65 },
  sev: { p: [0.5, 0.45, 0.05], burden: [[20, 28], [28, 36], [36, 44]] },
  comorb: { extra: {} },
  vars: (rng) => ({ where: rng.pick(['炎天下の工事現場で作業', '部活動の指導で屋外に', '冷房のない倉庫で作業']), hrs: rng.int(3, 6) }),
  cc: () => '暑い中で作業した後、頭痛と吐き気', ccKey: 'vomit_malaise',
  initVolume: [[600, 1000], [1000, 1500], [1400, 1900]],
  history: {
    onset: { p: 1, text: '今日、{where}{hrs}時間いて、だんだん頭が痛くなり、吐き気とだるさが出ました。' },
    character: { p: 1, text: '体がだるくて力が入りません。足がつりました。' },
    nausea: { p: 1, text: '吐き気があり、1回吐きました。' },
    dizziness: { p: 0.8, text: '立ちくらみがします。' },
    polyuria: { p: 1, text: 'おしっこが少なく、色が濃いです。' },
    fever: { p: 0.3, text: '体が熱い感じがします。' },
    abdpain: { p: 0, text: '' }, diarrhea: { p: 0, text: '' }, alcohol: { p: 1, text: '昨晩はお酒を飲みました。今日は水をあまり飲んでいません。' },
    pmh: { p: 1, text: '持病はありません。' },
  },
  exam: { gen_consc: { p: 1, text: '意識清明で受け答えはしっかりしている。' }, skin: { p: 1, text: '大量に発汗している。' }, oral_mucosa: { p: 1, text: '口腔内が乾燥している。' } },
  vitals: { T: { to: [37.6, 38.4], k: 1 }, HR: { to: [105, 120], k: 1 } },
  labs: { BUN: { add: [5, 15], k: 1 }, CR: { add: [0.2, 0.6], k: 1 }, CK: { add: [100, 600], k: 1 } },
  natural: -0.2,
  dynamics: (enc) => (enc.state.volume > 600 ? 0.2 : -0.6),
  therapies: [{ id: 'fluid', label: '涼しい場所で安静・冷却、補液（経口が難しければ点滴）', req: { fluidTotal: 1000 }, when: (c) => c.state.volume > 700, required: true, deadlineH: [3, 2, 1.5], startFromNeed: true }],
  useful: ['chem', 'cbc', 'vbg', 'ua', 'lab_CK', 'bs_poct'], key: [['chem']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: 'Ⅱ度熱中症：補液と冷却で症状が改善し、腎機能などに異常がなければ帰宅（当日は休む・水分と塩分）' }),
  teaching: [
    '熱中症の重症度：Ⅰ度（めまい・こむら返り・大量発汗）、Ⅱ度（頭痛・嘔吐・倦怠感：医療機関へ）、Ⅲ度（意識障害・けいれん・臓器障害：入院）。',
    'Ⅱ度は涼しい場所で冷却し、水分と塩分を補う。口から飲めなければ点滴。',
    '意識障害・40℃近い高体温・発汗の停止があればⅢ度（熱射病）として積極的な冷却とICU管理。',
    '腎機能・CK・肝機能を確認し、帰宅時に再発予防（水分・塩分・休憩）を指導する。',
  ],
  sources: ['熱中症診療ガイドライン2024（日本救急医学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'cbc'] }, { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 }, { a: 'wait', min: 60 }],
});
