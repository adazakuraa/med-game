// 過換気症候群
// 出典: 日本呼吸器学会 資料, 一般的な救急診療の知識
import { outpatient } from './common.js';
export default outpatient({
  id: 'hyperventilation', name: '過換気症候群', dept: '救急科', weight: 4,
  demo: { age: [16, 40], ageMode: 'young', male: 0.25 },
  comorb: { extra: {} },
  vars: (rng) => ({ ev: rng.pick(['職場で上司に強く叱られたあと', '試験の直前に', '恋人と口論したあと']) }),
  cc: () => '息が苦しくて手足がしびれる', ccKey: 'dyspnea',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '30分前、{ev}、急に息が苦しくなりました。' },
    course: { p: 1, text: '少し落ち着いてきました。' },
    character: { p: 1, text: '息をいくら吸っても吸った気がしなくて、口の周りと手がしびれて、指が勝手に曲がります。' },
    trigger: { p: 1, text: '{ev}です。前にも同じようなことがありました。' },
    chestpain: { p: 0, text: '胸の痛みはありません。' }, palpitation: { p: 0.6, text: 'ドキドキします。' },
    fever: { p: 0, text: '熱はありません。' }, cough: { p: 0, text: '咳はありません。' }, sputum: { p: 0, text: '' },
    orthopnea: { p: 0, text: '' }, pnd: { p: 0, text: '' }, edema: { p: 0, text: '足のむくみはありません。' }, weightgain: { p: 0, text: '' },
    immobility: { p: 0, text: '最近、長時間の移動や手術はありません。' }, meds: { p: 0, text: '薬は飲んでいません。ピルも飲んでいません。' }, pmh: { p: 0, text: '持病はありません。' }, adherence: { p: 0, text: '' }, diet: { p: 0, text: '' },
  },
  exam: { gen_appear: { p: 1, text: '不安そうで、速く深い呼吸をしている。' }, periph: { p: 1, text: '両手の指が助産師の手位（テタニー）。末梢は温かい。' }, lung_ausc: { p: 1, text: '呼吸音は清、左右差なし。wheezeなし。' }, heart_ausc: { p: 1, text: '整、雑音なし。' }, leg_edema: { p: 1, text: '下腿浮腫・片側の腫脹なし。' } },
  vitals: { RR: { to: [28, 36], k: 0.5 }, HR: { to: [100, 115], k: 0.7 } },
  labs: { PH: { to: [7.52, 7.58], k: 0.5 }, PCO2: { to: [20, 26], k: 0.5 }, HCO3: { add: [-2, -1], k: 1 } },
  tests: {},
  natural: -0.5,
  therapies: [{ id: 'eval', label: '危険な疾患（肺塞栓・気胸・喘息・心疾患・低血糖）の除外と説明・ゆっくりした呼吸の指導', req: { fn: (enc) => enc.tests.some((t) => ['vbg', 'ecg'].includes(t.id) && t.done) }, effect: -0.3, lagH: 0.2, required: true, deadlineH: [2, 2, 2] }],
  useful: ['vbg', 'ecg', 'bs_poct', 'cxr', 'uhcg', 'chem'], key: [['vbg'], ['ecg']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '過換気症候群：危険な疾患を除外し、説明して帰宅（繰り返すなら不安障害の治療を相談）' }),
  teaching: [
    '若い女性が強いストレスの後に急な呼吸困難・口周囲や手のしびれ・テタニー（助産師の手）を起こし、SpO2は正常で血液ガスで呼吸性アルカローシス → 過換気症候群。',
    '診断は除外診断。肺塞栓（SpO2低下・頻脈・下肢腫脹・ピル）、気胸、喘息、ACS、低血糖、DKA（代謝性アシドーシスの代償）を見逃さない。',
    'ペーパーバッグ法は低酸素の危険があり推奨されない。安心させ、ゆっくり呼吸するよう促す。',
  ],
  sources: ['一般的な救急診療の知識'],
  ideal: () => [{ a: 'test', ids: ['vbg', 'ecg', 'bs_poct'] }, { a: 'wait', min: 30 }],
});
