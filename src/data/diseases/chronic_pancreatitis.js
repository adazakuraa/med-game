// 慢性膵炎（アルコール性）
// 出典: 日本消化器病学会『慢性膵炎診療ガイドライン2021（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'chronic_pancreatitis', name: '慢性膵炎', dept: '消化器内科', weight: 2.5,
  demo: { age: [40, 70], ageMode: 'uniform', male: 0.85 },
  comorb: { extra: { dm2: 0.3 } },
  vars: () => ({ forceAlcohol: true }),
  cc: () => 'みぞおちから背中が痛む、下痢でやせてきた', ccKey: 'epigastric',
  history: {
    onset: { p: 1, text: '数年前から、お酒を飲んだ後や脂っこいものを食べた後に、みぞおちから背中が痛みます。' },
    character: { p: 1, text: '鈍い痛みが数日続き、前かがみになると少し楽です。' },
    aggravating: { p: 1, text: '飲酒の後や脂っこい食事の後に悪化します。' },
    alcohol: { p: 1, text: '20年以上、毎日ビール3〜4缶と焼酎を飲んでいます。' },
    weightloss: { p: 1, text: 'この1年で6kgやせました。' },
    diarrhea: { p: 1, text: '白っぽい、油が浮くような下痢が出ます。' },
    smoking: { p: 1, text: '1日20本吸っています。' },
    heartburn: { p: 0, text: '胸やけはありません。' }, bloodystool: { p: 0, text: '黒い便や血便はありません。' },
    pmh: { p: 1, text: '何度か急性膵炎で入院しました。最近、血糖が高いと言われました。' }, meds: { p: 0, text: '' }, chestpain: { p: 0, text: '' },
  },
  exam: { abd_palp: { p: 1, text: '心窩部に軽い圧痛。腹膜刺激徴候なし。' }, gen_appear: { p: 1, text: 'やせ型。' }, conjunctiva: { p: 0, text: '黄疸・貧血なし。' } },
  labs: { AMY: { add: [-20, 30], k: 0 }, LIP: { add: [0, 30], k: 0 }, GLU: { add: [40, 90], k: 0 }, HBA1C: { add: [1, 2], k: 0 }, ALB: { add: [-0.6, -0.3], k: 0 } },
  tests: { abd_ct_plain: [{ p: 1, persist: true, text: '膵臓全体に多数の石灰化（膵石）、膵管の不整な拡張、膵実質の萎縮（慢性膵炎）。腫瘤なし。' }], abd_ct_contrast: [{ p: 1, persist: true, text: '膵石と膵管の不整な拡張、膵の萎縮（慢性膵炎）。腫瘤なし。' }], abd_us: [{ p: 0.7, text: '膵臓に音響陰影を伴う高エコー（膵石）、膵管の拡張。' }], axr: [{ p: 0.6, text: '上腹部（膵臓の位置）に散在する石灰化。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '禁酒・禁煙、消化酵素薬（脂肪便）、疼痛管理（カモスタット・鎮痛薬）、糖尿病の管理', req: { anyTag: ['pert', 'protease_inh'] }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['chem', 'cbc', 'hba1c', 'abd_ct_plain', 'abd_ct_contrast', 'abd_us', 'axr', 'ecg'], key: [['abd_ct_plain', 'abd_ct_contrast', 'abd_us']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '慢性膵炎：禁酒・消化酵素薬・疼痛管理で外来（急性増悪や膵がんの合併に注意）' }),
  teaching: [
    '長年の飲酒者の繰り返す心窩部〜背部痛、脂肪便（油の浮く白っぽい下痢）、体重減少、糖尿病の新規発症は慢性膵炎。',
    '進行すると膵酵素（アミラーゼ・リパーゼ）は上がらなくなる。CTで膵石・膵管拡張・萎縮を確認。',
    '治療は禁酒・禁煙が最も重要。消化酵素薬、疼痛管理、膵性糖尿病（低血糖を起こしやすい）の管理。',
    '膵がんの危険が高い。体重減少の加速・新たな黄疸は精査を。',
  ],
  sources: ['慢性膵炎診療ガイドライン2021（日本消化器病学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'cbc', 'hba1c', 'abd_ct_plain', 'ecg'] }, { a: 'rx', drugId: 'pancrelipase', route: 'po', dose: 600, freq: 'q8h', days: 28 }, { a: 'rx', drugId: 'camostat', route: 'po', dose: 200, freq: 'q8h', days: 14 }],
});
