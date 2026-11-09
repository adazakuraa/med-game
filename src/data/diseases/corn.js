// 鶏眼・胼胝（うおのめ・たこ）
// 出典: 日本皮膚科学会 資料, 日本フットケア・足病医学会
import { outpatient } from './common.js';
export default outpatient({
  id: 'corn', name: '鶏眼・胼胝（うおのめ・たこ）', dept: '皮膚科', weight: 3,
  demo: { age: [30, 80], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '足の裏が歩くと痛い', ccKey: 'skin_lesion',
  history: {
    onset: { p: 1, text: '数か月前から、{side}足の裏の指の付け根が歩くと痛いです。' },
    character: { p: 1, text: '硬くなっていて、押すと刺すように痛みます。' },
    location: { p: 1, text: '{side}足の第2指の付け根の足の裏です。' },
    trigger: { p: 1, text: '先の細いヒールの靴をよく履きます。' },
    itch: { p: 0, text: '' }, sickcontact: { p: 0, text: '' }, meds: { p: 0, text: '' }, family: { p: 0, text: '' },
    pmh: { p: 1, text: '糖尿病はありません。' },
  },
  exam: { skin: { p: 1, text: '{side}第2中足骨頭の足底に、中心に半透明の硬い芯を持つ角質の肥厚（鶏眼）。周囲に胼胝。皮膚をそぐと点状出血はない（ウイルス性疣贅ではない）。' }, leg_pulse: { p: 1, text: '足背動脈は良好に触知する。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '角質の削り（芯の除去）と、靴・インソールの見直し', req: { fn: (enc) => !!enc.state.procs?.paring }, effect: -1, lagH: 0.2, required: true, deadlineH: [24, 24, 24] }],
  useful: ['hba1c'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '鶏眼：処置して帰宅（足に合った靴・インソールで再発予防）' }),
  teaching: [
    '鶏眼（うおのめ）は芯があり押すと痛い、胼胝（たこ）は芯がなく痛みは少ない。いずれも靴などの圧迫・摩擦が原因。',
    'ウイルス性疣贅（いぼ）は削ると点状出血があり、皮膚紋理が途切れる（液体窒素で治療）。',
    '治療は削り・スピール膏。原因となる靴・歩き方・足の変形への対処が大切。',
    '糖尿病の人の胼胝の下には潰瘍ができやすいので、自分で削らない。',
  ],
  sources: ['日本皮膚科学会 資料'],
  ideal: () => [{ a: 'proc', id: 'paring' }],
});
