// 肺MAC症（肺非結核性抗酸菌症）
// 出典: 日本結核・非結核性抗酸菌症学会『成人肺非結核性抗酸菌症化学療法に関する見解2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ntm', name: '肺MAC症（非結核性抗酸菌症）', dept: '呼吸器内科', weight: 2, minLevel: 2,
  demo: { age: [55, 80], ageMode: 'uniform', male: 0.25 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '痰がからむ咳が何か月も続く', ccKey: 'chronic_cough',
  history: {
    onset: { p: 1, text: '半年以上前から、痰のからむ咳が続いています。' },
    cough: { p: 1, text: '朝に痰がよく出ます。' },
    sputum: { p: 1, text: '黄色い痰で、ときどき血が混じります。' },
    character: { p: 1, text: 'やせ型で、最近疲れやすいです。' },
    fever: { p: 0.2, text: '微熱が出ることがあります。' },
    weightloss: { p: 0.6, text: '少しやせました。' },
    nightsweat: { p: 0, text: '寝汗はありません。' },
    smoking: { p: 0, text: 'たばこは吸いません。' },
    sickcontact: { p: 0, text: '周りに結核の人はいません。' },
    meds: { p: 0, text: '' }, heartburn: { p: 0, text: '' }, pmh: { p: 0, text: '' }, dyspnea: { p: 0.2, text: '少し息切れします。' },
  },
  exam: { lung_ausc: { p: 0.6, text: '右中葉・左舌区の領域でcoarse crackles。' }, gen_appear: { p: 1, text: 'やせ型の中高年女性。' } },
  tests: { cxr: [{ p: 1, persist: true, text: '右中葉・左舌区に気管支拡張と小粒状影・浸潤影。' }], chest_ct: [{ p: 1, persist: true, text: '中葉・舌区の気管支拡張と小葉中心性粒状影（tree-in-bud）、小さな空洞（結節・気管支拡張型）。' }], afb: [{ p: 1, persist: true, text: '抗酸菌塗抹陽性（1+）。結核菌PCR陰性、MAC-PCR陽性（Mycobacterium avium complex）。' }], igra: { p: 0 } },
  natural: -0.002,
  therapies: [{ id: 'resp', label: '呼吸器内科へ紹介：診断基準（喀痰培養2回など）を満たせば多剤併用療法（クラリスロマイシンなど）を検討', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'resp') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { resp: '呼吸器内科：中高年女性の結節・気管支拡張型の肺MAC症と考えます。結核菌PCRは陰性で隔離は不要です。喀痰培養をもう一度確認し、症状と進行に応じてクラリスロマイシン・エタンブトール・リファンピシンの多剤併用療法を検討します。' },
  useful: ['cxr', 'chest_ct', 'afb', 'igra', 'cbc', 'chem', 'sputum_gram'], key: [['cxr'], ['afb']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '肺MAC症：呼吸器内科外来で治療を検討（人から人にはうつらないので隔離不要）' }),
  teaching: [
    '中高年のやせ型女性の、長く続く痰・咳・血痰と、中葉・舌区の気管支拡張・粒状影は肺MAC症（日本で増加中）。',
    '抗酸菌塗抹陽性なら、まず結核菌PCRで結核を除外する（結核なら隔離・届出）。MACは人から人にうつらない。',
    '治療は長期の多剤併用療法（クラリスロマイシンなど）。マクロライド単剤は耐性化を招くので使わない。',
  ],
  sources: ['成人肺非結核性抗酸菌症化学療法に関する見解2023（日本結核・非結核性抗酸菌症学会）'],
  ideal: () => [{ a: 'test', ids: ['cxr', 'chest_ct', 'afb'] }, { a: 'consult', dept: 'resp', delayMin: 1 }, { a: 'wait', min: 70 }],
});
