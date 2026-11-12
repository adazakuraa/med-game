// 適応障害
// 出典: DSM-5-TR, 日本うつ病学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'adjustment', name: '適応障害', dept: '精神科', weight: 4,
  demo: { age: [22, 50], ageMode: 'young', male: 0.45 },
  comorb: { extra: {} },
  vars: (rng) => ({ ev: rng.pick(['4月に異動した部署で上司から毎日強く叱責される', '昇進して責任の重い仕事を任された', '新しい職場の人間関係がうまくいかない']) }),
  cc: () => '仕事に行こうとすると気分が悪くなる', ccKey: 'psych',
  history: {
    onset: { p: 1, text: '2か月前、{ev}ようになってから、朝になると動悸がして気分が悪くなり、会社に行けない日が増えました。' },
    character: { p: 1, text: '仕事のことを考えると涙が出て、不安で落ち着きません。休みの日は比較的楽に過ごせて、趣味も楽しめます。' },
    mood: { p: 1, text: '仕事の日は落ち込みますが、休日は気分がましです。死にたいとは思いません。' },
    sleep: { p: 1, text: '日曜の夜は眠れません。' },
    hallucination: { p: 0, text: '幻聴や被害妄想はありません。' }, weightloss: { p: 0, text: '体重は変わりません。' }, alcohol: { p: 0, text: 'お酒は増えていません。' },
    meds: { p: 0, text: '薬は飲んでいません。' }, pmh: { p: 0, text: '以前にうつ病と言われたことはありません。' }, menses: { p: 0, text: '' }, heatcold: { p: 0, text: '暑がり・寒がりはありません。' },
  },
  exam: { gen_appear: { p: 1, text: '疲れた表情で、話すうちに涙ぐむ。' }, gen_consc: { p: 0, text: '意識清明。' }, tremor: { p: 0, text: '振戦なし。' } },
  tests: { thyroid: [{ p: 1, text: 'TSH・FT4 正常。', normal: true }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: 'ストレス因の調整（休養・職場との相談・産業医）と精神療法、自殺念慮の確認。症状が強ければ精神科', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'psych') || enc.tests.some((t) => t.id === 'thyroid' && t.done) }, effect: -0.3, lagH: 6, required: true, deadlineH: [72, 72, 72] }],
  consult: { psych: '精神科：明確なストレス因（職場）の後に始まり、ストレス因から離れると軽くなる抑うつ・不安で、うつ病の基準は満たさず、適応障害です。休職や部署の調整など環境調整を優先し、カウンセリングを行います。2〜3か月で改善しなければうつ病への移行も考えます。' },
  useful: ['thyroid', 'cbc', 'chem', 'bs_poct'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '適応障害：環境調整と精神療法で外来' }),
  teaching: [
    'はっきりしたストレス因（異動・人間関係）の後に始まり、ストレス因から離れると軽くなる抑うつ・不安・身体症状 → 適応障害。',
    '休日も楽しめない・2週間以上ほぼ毎日の抑うつ・興味の喪失・希死念慮があればうつ病を考える。甲状腺機能も確認。',
    '治療はストレス因の調整（休養・職場の配慮・産業医との連携）と精神療法。薬物療法は補助的。',
  ],
  sources: ['DSM-5-TR 精神疾患の診断・統計マニュアル'],
  ideal: () => [{ a: 'test', ids: ['thyroid'] }, { a: 'consult', dept: 'psych', delayMin: 1 }, { a: 'wait', min: 70 }],
});
