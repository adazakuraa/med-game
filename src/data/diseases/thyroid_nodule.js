// 甲状腺乳頭がん（甲状腺結節）
// 出典: 日本内分泌外科学会『甲状腺腫瘍診療ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'thyroid_nodule', name: '甲状腺がん（乳頭がん）', dept: '内分泌代謝内科', weight: 2,
  demo: { age: [30, 70], ageMode: 'uniform', male: 0.2 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '首の前にしこりがある', ccKey: 'lymph',
  history: {
    onset: { p: 1, text: '1か月前、鏡を見て首の前の{side}側にしこりがあるのに気づきました。' },
    character: { p: 1, text: '痛みはなく、硬いしこりです。飲み込むと一緒に動きます。' },
    fever: { p: 0, text: '熱はありません。' }, sorethroat: { p: 0, text: 'のどの痛みはありません。' }, cough: { p: 0, text: '' },
    weightloss: { p: 0, text: '体重は変わりません。' }, nightsweat: { p: 0, text: '寝汗はありません。' }, sickcontact: { p: 0, text: '' },
    pmh: { p: 0, text: '首に放射線を当てたことはありません。' }, hoarse: { p: 0, text: '声のかすれはありません。' },
  },
  exam: { thyroid_palp: { p: 1, text: '甲状腺{side}葉に2cmの硬い結節、表面不整、嚥下で可動、圧痛なし。' }, neck_ln: { p: 0.4, text: '{side}頸部に小さな硬いリンパ節。' }, pharynx: { p: 0, text: '咽頭に異常なし。' } },
  tests: { neck_us: [{ p: 1, persist: true, text: '甲状腺{side}葉に1.8cmの境界不整な低エコー結節、内部に微細な石灰化（乳頭がんを疑う）。' }], thyroid: [{ p: 1, text: 'TSH・FT4 正常。', normal: true }] },
  natural: -0.001,
  therapies: [{ id: 'refer', label: '内分泌内科/甲状腺外科へ紹介：穿刺吸引細胞診で確定し、手術（甲状腺切除）', req: { fn: (enc) => enc.consults.some((c) => ['endo', 'ent', 'surgery'].includes(c.dept)) }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 72] }],
  consult: { endo: '内分泌内科：エコーで微細石灰化を伴う境界不整な低エコー結節があり、甲状腺乳頭がんを強く疑います。穿刺吸引細胞診で確定し、甲状腺外科で手術を予定します。乳頭がんは進行がゆっくりで、予後は良好です。' },
  useful: ['neck_us', 'thyroid', 'cbc', 'chem', 'chest_ct'], key: [['neck_us']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '甲状腺がん疑い：外来で細胞診と手術の予定' }),
  teaching: [
    '首の前の嚥下で動くしこりは甲状腺結節。多くは良性（腺腫様甲状腺腫）だが、硬い・不整・リンパ節腫脹・声のかすれ・増大はがんを疑う。',
    'まずTSHと頸部エコー。エコーで低エコー・境界不整・微細石灰化があれば穿刺吸引細胞診。',
    '日本の甲状腺がんの約9割は乳頭がんで、予後は良い。治療は手術。',
  ],
  sources: ['甲状腺腫瘍診療ガイドライン2024（日本内分泌外科学会）'],
  ideal: () => [{ a: 'test', ids: ['neck_us', 'thyroid'] }, { a: 'consult', dept: 'endo', delayMin: 1 }, { a: 'wait', min: 70 }],
});
