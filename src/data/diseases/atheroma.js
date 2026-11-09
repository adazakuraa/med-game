// 感染性粉瘤（炎症性表皮嚢腫）
// 出典: 日本皮膚科学会 資料, 日本形成外科学会
import { outpatient } from './common.js';
export default outpatient({
  id: 'atheroma', name: '感染性粉瘤', dept: '皮膚科', weight: 4,
  demo: { age: [20, 65], ageMode: 'uniform', male: 0.6 },
  comorb: { extra: {} },
  vars: (rng) => ({ where: rng.pick(['背中', 'お尻', '首の後ろ', '耳たぶの後ろ']) }),
  cc: () => 'しこりが赤く腫れて痛い', ccKey: 'skin_lesion',
  history: {
    onset: { p: 1, text: '何年も前から{where}に小さなしこりがありましたが、3日前から急に赤く腫れて痛くなりました。' },
    character: { p: 1, text: 'ズキズキ痛く、押すとくさいにおいのものが出たことがあります。' },
    location: { p: 1, text: '{where}です。' },
    fever: { p: 0, text: '熱はありません。' },
    itch: { p: 0, text: '' }, sickcontact: { p: 0, text: '' }, meds: { p: 0, text: '' }, family: { p: 0, text: '' },
    trigger: { p: 0.5, text: '気になって自分でつぶそうとしました。' },
    pmh: { p: 1, text: '糖尿病はありません。' },
  },
  exam: { skin: { p: 1, text: '{where}に3cm大の発赤・熱感・圧痛を伴う腫瘤。中央に黒い点（開口部）があり、波動を触れる。周囲の発赤の広がりは軽い。' } },
  labs: { WBC: { to: [9500, 12500], k: 0 }, CRP: { to: [2, 6], k: 0 } },
  natural: 0.02,
  therapies: [{ id: 'tx', label: '切開排膿（膿瘍化していれば抗菌薬だけでは治りにくい）、炎症が治まってから摘出', req: { fn: (enc) => !!enc.state.procs?.incision }, effect: -1.2, lagH: 0.5, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc', 'crp'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '感染性粉瘤：切開排膿して帰宅（毎日洗浄、落ち着いたら摘出術）' }),
  teaching: [
    '粉瘤は皮膚の下にできる袋（表皮嚢腫）で、中央に開口部（黒点）がある。細菌感染すると急に赤く腫れて痛む。',
    '波動（中に膿がある）を触れれば切開排膿。抗菌薬だけでは治りにくい。周囲に発赤が広がる・発熱・糖尿病があれば抗菌薬も。',
    '再発を防ぐには、炎症が治まってから袋ごと摘出する。',
  ],
  sources: ['日本皮膚科学会 資料'],
  ideal: () => [{ a: 'proc', id: 'incision' }],
});
