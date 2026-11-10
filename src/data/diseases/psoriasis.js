// 尋常性乾癬
// 出典: 日本皮膚科学会『乾癬診療ガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'psoriasis', name: '尋常性乾癬', dept: '皮膚科', weight: 3,
  demo: { age: [30, 65], ageMode: 'uniform', male: 0.65 },
  comorb: { extra: { dm2: 0.2, dyslip: 0.3 } },
  vars: () => ({}),
  cc: () => '肘や膝に赤い発疹とフケのようなもの', ccKey: 'skin_lesion',
  history: {
    onset: { p: 1, text: '1年前から、肘・膝・頭に赤く盛り上がった発疹ができ、白いフケのようなものがポロポロ落ちます。' },
    character: { p: 1, text: '境目がはっきりした赤い盛り上がりで、銀白色のかさぶたが付いています。' },
    location: { p: 1, text: '肘・膝・腰・頭です。' },
    itch: { p: 0.4, text: '少しかゆいです。' },
    joint: { p: 0.2, text: '指の関節が少し痛みます。' },
    trigger: { p: 0.6, text: 'こすれるところに出やすいです。' },
    pmh: { p: 1, text: '太り気味で、たばことお酒が好きです。' },
    sickcontact: { p: 0, text: '' }, meds: { p: 0, text: '' }, family: { p: 0.3, text: '父も同じような皮膚でした。' },
  },
  exam: { skin: { p: 1, text: '肘・膝の伸側、腰、頭皮に境界明瞭な紅斑と厚い銀白色の鱗屑（局面）。爪に点状の陥凹。' } },
  tests: {},
  natural: -0.003,
  therapies: [{ id: 'tx', label: '外用療法（活性型ビタミンD3・ステロイド）、生活習慣の改善', req: { tag: 'psoriasis_topical' }, effect: -0.4, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['koh', 'lipid', 'hba1c'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '尋常性乾癬：外来で外用療法（重症は光線療法・内服・生物学的製剤）' }),
  teaching: [
    '肘・膝・頭皮・腰など擦れる部位の、境界明瞭な紅斑と厚い銀白色の鱗屑は尋常性乾癬。うつる病気ではない。',
    '爪の変化・関節炎（乾癬性関節炎）を伴うことがある。肥満・メタボリック症候群・喫煙と関連。',
    '治療は外用（活性型ビタミンD3・ステロイド）、光線療法、内服、生物学的製剤。',
    '白癬・湿疹との区別にKOH鏡検も。',
  ],
  sources: ['乾癬診療ガイドライン2019（日本皮膚科学会）'],
  ideal: () => [{ a: 'rx', drugId: 'vitd_oint', route: 'top', dose: 2, freq: 'q24h', days: 28 }],
});
