// 双極性障害（躁病エピソード）
// 出典: 日本うつ病学会『日本うつ病学会診療ガイドライン 双極症2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'bipolar', name: '双極性障害（躁状態）', dept: '精神科', weight: 2, minLevel: 2,
  demo: { age: [20, 50], ageMode: 'young', male: 0.5 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '眠らずに興奮している（家族が心配）', ccKey: 'psych',
  history: {
    onset: { p: 1, text: '（家族）1週間前から、ほとんど眠らずに夜中まで動き回り、とても多弁になりました。' },
    character: { p: 1, text: '（家族）大きな事業を始めると言って、高額な買い物を繰り返しています。注意すると怒り出します。' },
    mood: { p: 1, text: '最高の気分です！ 何でもできる気がします。（家族：2年前にうつ病で休職したことがあります）' },
    sleep: { p: 1, text: '（家族）1日2時間くらいしか寝ていませんが、本人は疲れていないと言います。' },
    hallucination: { p: 0.2, text: '自分には特別な才能があると気づきました。' },
    meds: { p: 1, text: '（家族）2か月前からうつ病の薬（SSRI）を飲み始めました。違法薬物は使っていません。' },
    pmh: { p: 1, text: '（家族）2年前にうつ病と言われました。' },
    alcohol: { p: 0.4, text: '（家族）最近お酒の量も増えました。' },
    heatcold: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, palpitation: { p: 0, text: '' },
  },
  exam: { gen_appear: { p: 1, text: '多弁で話が次々に飛ぶ（観念奔逸）。じっとしていられない。' }, gen_consc: { p: 1, text: '意識は清明、見当識は保たれている。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '精神科コンサルト：抗うつ薬の中止、気分安定薬・抗精神病薬、安全の確保（入院の検討）', req: { fn: (enc, eff) => enc.consults.some((c) => c.dept === 'psych') || (eff.tags.antipsychotic || 0) > 0 }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  consult: { psych: '精神科：抗うつ薬をきっかけにした躁病エピソードで、双極性障害と考えます。SSRIを中止し、気分安定薬（リチウム・バルプロ酸）や抗精神病薬で治療します。浪費・判断力の低下が強いので入院を勧めます。' },
  harmTags: { ssri: '双極性障害の躁状態に抗うつ薬（躁転の悪化）' },
  useful: ['thyroid', 'tox', 'chem', 'cbc', 'head_ct', 'bs_poct'], key: [['thyroid'], ['tox']],
  dispo: () => ({ ok: ['admit', 'home'], best: 'admit', why: '躁病エピソード：判断力の低下・浪費・危険行動があれば精神科入院' }),
  teaching: [
    '気分の高揚・誇大性・睡眠欲求の減少・多弁・観念奔逸・浪費などが1週間以上続くのは躁病エピソード。うつ病の既往があれば双極性障害。',
    '抗うつ薬で躁転することがある。うつ病と診断する前に躁・軽躁の既往を必ず聞く。',
    '甲状腺機能亢進症・覚醒剤などの薬物・ステロイド・脳の病気（前頭葉）を除外する。',
    '治療は気分安定薬（リチウム・バルプロ酸）・抗精神病薬。抗うつ薬単独は避ける。',
  ],
  sources: ['日本うつ病学会診療ガイドライン 双極症2023'],
  ideal: () => [{ a: 'test', ids: ['thyroid', 'tox', 'chem'] }, { a: 'consult', dept: 'psych', delayMin: 1 }, { a: 'wait', min: 70 }],
});
