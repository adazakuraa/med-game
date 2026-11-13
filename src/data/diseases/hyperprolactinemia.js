// 高プロラクチン血症（プロラクチノーマ）
// 出典: 日本内分泌学会『間脳下垂体機能障害の診断と治療の手引き（令和5年度改訂）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hyperprolactinemia', name: '高プロラクチン血症（プロラクチノーマ）', dept: '内分泌内科', weight: 2,
  demo: { age: [20, 40], ageMode: 'young', male: 0 },
  comorb: { extra: {} },
  vars: (rng) => ({ mo: rng.int(4, 9) }),
  cc: () => '生理が来なくなった', ccKey: 'menstrual',
  history: {
    onset: { p: 1, text: '{mo}か月前から生理が来ていません。それまでは28日周期で順調でした。' },
    menses: { p: 1, text: '{mo}か月来ていません。' },
    lmp: { p: 1, text: '最終月経は{mo}か月前です。避妊しているので妊娠はないと思います。' },
    character: { p: 1, text: '妊娠していないのに、胸を押すと乳首から白い液が出ます。' },
    headache: { p: 0.4, text: '時々、軽い頭痛があります。' },
    vision: { p: 0, text: '見え方は普段どおりです。' },
    meds: { p: 0, text: '飲んでいる薬はありません（吐き気止めや精神科の薬も飲んでいません）。' },
    pmh: { p: 0, text: '持病はありません。' },
    weightgain: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, heatcold: { p: 0, text: '暑がり・寒がりはありません。' }, mood: { p: 0, text: '' }, fatigue: { p: 0, text: '' },
  },
  exam: { breast: { p: 1, text: '両側乳頭を圧迫すると乳白色の分泌物（乳汁漏出）。乳房にしこりはない。' }, eye: { p: 1, text: '対座法で視野欠損なし。' } },
  tests: { hormone: [{ p: 1, persist: true, text: 'プロラクチン 120ng/mL（高値）、LH・FSH低値、テストステロン正常。' }], head_mri: [{ p: 1, persist: true, text: '下垂体に約7mmの腫瘤（下垂体微小腺腫）。視交叉の圧迫なし。' }], thyroid: [], tvus: [{ p: 1, text: '子宮内膜は薄い。卵巣に多数の小卵胞はない。子宮内に胎嚢なし。', normal: true }] },
  natural: -0.001,
  therapies: [
    { id: 'tx', label: 'ドパミン作動薬（カベルゴリン）', req: { tag: 'dopamine_agonist' }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] },
    { id: 'endo', label: '内分泌内科へ紹介（下垂体機能・視野の評価）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'endo') }, effect: -0.1, lagH: 12, required: false, deadlineH: [48, 48, 48] },
  ],
  consult: { endo: '内分泌内科：薬剤性・甲状腺機能低下症・妊娠を除外したプロラクチン高値と下垂体微小腺腫で、プロラクチノーマです。カベルゴリン週1回0.25mgから始め、プロラクチン・MRIでフォローします。手術はまれです。' },
  useful: ['uhcg', 'hormone', 'thyroid', 'head_mri', 'tvus', 'chem'], key: [['uhcg'], ['hormone']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'プロラクチノーマ：外来でカベルゴリン（内分泌内科でフォロー）' }),
  teaching: [
    '若い女性の無月経＋乳汁漏出は高プロラクチン血症。まず妊娠を否定（妊娠・授乳でもプロラクチンは上がる）。',
    '原因：薬剤（スルピリド・メトクロプラミド・抗精神病薬）、甲状腺機能低下症（TRH↑）、プロラクチノーマ。薬歴と甲状腺機能を確認し、頭部MRIで下垂体を見る。',
    '治療はドパミン作動薬（カベルゴリン）で、腫瘍も縮小することが多い。大きな腫瘍は視野障害（両耳側半盲）に注意。',
  ],
  sources: ['間脳下垂体機能障害の診断と治療の手引き（日本内分泌学会）'],
  ideal: () => [{ a: 'test', ids: ['uhcg', 'hormone', 'thyroid', 'head_mri'] }, { a: 'rx', drugId: 'cabergoline', route: 'po', dose: 0.25, freq: 'once', days: 1 }, { a: 'consult', dept: 'endo', delayMin: 1 }, { a: 'wait', min: 70 }],
});
