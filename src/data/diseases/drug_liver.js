// 薬物性肝障害
// 出典: 日本肝臓学会『薬物性肝障害診療ガイドライン』（DDW-J 2004スコア）
import { outpatient } from './common.js';
export default outpatient({
  id: 'drug_liver', name: '薬物性肝障害', dept: '消化器内科', weight: 3,
  demo: { age: [40, 80], ageMode: 'uniform', male: 0.45 },
  comorb: { extra: {} },
  vars: (rng) => ({ drug: rng.pick(['健康食品（ウコン）', '漢方薬', '結核の薬（イソニアジド）', '抗菌薬（アモキシシリン・クラブラン酸）']) }),
  cc: () => 'だるくて食欲がない、肝臓の数値が高い', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '2週間前からだるくて食欲がなく、近くの医院で採血したら肝臓の数値が高いと言われました。' },
    meds: { p: 1, text: '1か月半前から{drug}を飲み始めました。' },
    character: { p: 0.5, text: '尿が少し濃い気がします。' },
    alcohol: { p: 0, text: 'お酒はほとんど飲みません。' },
    fever: { p: 0.2, text: '微熱がありました。' }, rash: { p: 0.2, text: '少し発疹が出ました。' },
    pmh: { p: 0, text: '肝臓の病気を言われたことはありません。' }, travel: { p: 0, text: '最近、生ものや海外旅行はありません。' }, weightloss: { p: 0, text: '' },
  },
  exam: { conjunctiva: { p: 0.3, text: '眼球結膜の軽い黄染。' }, abd_palp: { p: 1, text: '軽い肝腫大、圧痛は軽度。' }, skin: { p: 0.2, text: '体幹に淡い紅斑。' } },
  labs: { AST: { add: [150, 400], k: 0 }, ALT: { add: [250, 600], k: 0 }, ALP: { add: [30, 120], k: 0 }, GGT: { add: [60, 200], k: 0 }, TBIL: { add: [0.5, 2], k: 0 } },
  tests: { abd_us: [{ p: 1, text: '肝臓に腫瘤・脂肪肝なし。胆管の拡張なし。胆石なし。', normal: true }], hep_virus: [{ p: 1, text: 'HBs抗原・HCV抗体・IgM-HA抗体・IgM-HBc抗体 陰性。', normal: true }], ebv: [{ p: 1, text: '既感染パターン（急性感染なし）。', normal: true }] },
  natural: 0.02,
  therapies: [{ id: 'stop', label: '原因と思われる薬・健康食品の中止と、肝機能の経過観察（ウイルス・胆道疾患を除外）', req: { fn: (enc) => enc.tests.some((t) => t.id === 'hep_virus' && t.done) && enc.tests.some((t) => ['abd_us', 'abd_ct_contrast'].includes(t.id) && t.done) }, effect: -0.4, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['chem', 'cbc', 'coag', 'hep_virus', 'abd_us', 'ebv', 'ana'], key: [['chem'], ['hep_virus'], ['abd_us']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '黄疸・凝固異常のない薬物性肝障害：原因薬を中止して外来で肝機能を再検（PT低下・黄疸の悪化は入院）' }),
  teaching: [
    '新しい薬・漢方・サプリメント・健康食品を始めて数日〜数か月後の肝障害は薬物性肝障害を考える。必ず「市販薬・健康食品」まで聞く。',
    'ウイルス性肝炎・胆道疾患・アルコール・自己免疫性肝炎を除外し、原因薬を中止して改善を確認する（DDW-Jスコア）。',
    '黄疸＋PT低下は急性肝不全に進む危険があるので入院。',
  ],
  sources: ['薬物性肝障害診療ガイドライン（日本肝臓学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'cbc', 'coag', 'hep_virus', 'abd_us'] }, { a: 'wait', min: 70 }],
});
