// 肺がん（非小細胞肺がん）
// 出典: 日本肺癌学会『肺癌診療ガイドライン2024年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'lung_ca', name: '肺がん', dept: '呼吸器内科', weight: 3, minLevel: 2,
  demo: { age: [60, 85], ageMode: 'old', male: 0.7 },
  smokeP: 0.85,
  comorb: { extra: { copd: 0.3, htn: 0.4 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']), cm: rng.int(3, 5) }),
  cc: () => '咳と血痰が続く', ccKey: 'fever_cough',
  history: {
    onset: { p: 1, text: '2か月前から咳が続き、最近痰に血が混じるようになりました。' },
    cough: { p: 1, text: '咳がずっと続いています。' },
    sputum: { p: 1, text: '痰に血が筋状に混じります。' },
    weightloss: { p: 0.8, text: '3か月で5kgやせました。' },
    fever: { p: 0.1, text: '熱はありません。' },
    chestpain: { p: 0.3, text: '{side}の胸が少し痛みます。' },
    smoking: { p: 1, text: '1日30本を45年間吸っています。' },
    occupation: { p: 0.5, text: '若いころ、建設現場で働いていました（アスベスト）。' },
    nightsweat: { p: 0.2, text: '少し寝汗をかきます。' },
    sickcontact: { p: 1, text: '周りに結核の人はいません。' },
    dyspnea: { p: 0.4, text: '少し息切れがします。' },
    chills: { p: 0, text: '' }, myalgia: { p: 0, text: '' }, sorethroat: { p: 0, text: '' },
  },
  exam: { lung_ausc: { p: 0.4, text: '{side}上肺野の呼吸音がやや減弱。' }, neck_ln: { p: 0.4, text: '{side}鎖骨上窩に硬いリンパ節を触れる。' }, skin: { p: 0.3, text: 'ばち指。' } },
  labs: { CA: { add: [0, 0.6], k: 1 } },
  tests: {
    cxr: [{ p: 0.9, persist: true, text: '{side}上肺野に約{cm}cmの辺縁不整な腫瘤影。' }],
    chest_ct: [{ p: 1, persist: true, text: '{side}上葉に{cm}cmの辺縁がスピキュラを伴う腫瘤と、同側の肺門・縦隔リンパ節の腫大（肺がんを疑う）。' }],
  },
  natural: -0.002,
  therapies: [{ id: 'resp', label: '呼吸器内科コンサルト→気管支鏡などで組織診断・病期診断（遺伝子検査を含む）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'resp') }, required: true, deadlineH: [48, 24, 24], effect: -0.2, lagH: 6 }],
  consult: { resp: '呼吸器内科：画像から肺がんを強く疑います。気管支鏡で組織を採取し、PET-CT・頭部MRIで病期を評価します。組織型と遺伝子変異（EGFR・ALKなど）・PD-L1を調べて、手術・放射線・薬物療法を決めます。禁煙も大切です。' },
  useful: ['cxr', 'chest_ct', 'cbc', 'chem', 'afb', 'sputum_gram', 'crp', 'coag'], key: [['cxr'], ['chest_ct']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '肺がんの疑い：呼吸器内科外来で速やかに精査（大量喀血・呼吸不全・高Ca血症などがあれば入院）' }),
  teaching: [
    '喫煙者の2週間以上続く咳・血痰・体重減少は肺がんを考え、胸部X線・CTを。結核（抗酸菌検査）との区別も大切。',
    '確定診断は気管支鏡などで組織を採取。病期診断（PET-CT・頭部MRI）と遺伝子検査（EGFR・ALKなど）で治療が決まる。',
    '腫瘍随伴症候群（高Ca血症・低Na血症）、上大静脈症候群、脳転移による症状にも注意。',
    '禁煙はどの段階でも有益。',
  ],
  sources: ['肺癌診療ガイドライン2024年版（日本肺癌学会）'],
  ideal: () => [{ a: 'test', ids: ['cxr', 'chest_ct', 'cbc', 'chem', 'afb'] }, { a: 'consult', dept: 'resp', delayMin: 1 }, { a: 'wait', min: 70 }],
});
