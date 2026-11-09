// うつ病
// 出典: 日本うつ病学会『日本うつ病学会治療ガイドライン II. うつ病（DSM-5）/大うつ病性障害2016』, DSM-5-TR
import { outpatient } from './common.js';
export default outpatient({
  id: 'depression', name: 'うつ病', dept: '精神科', weight: 5,
  demo: { age: [20, 70], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: {} },
  vars: (rng) => ({ wk: rng.int(3, 10), why: rng.pick(['部署が変わってから', '親の介護が始まってから', '昇進してから']) }),
  cc: () => 'だるくてやる気が出ない', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '{wk}週間前、{why}、体がだるくて何もする気が起きません。' },
    character: { p: 1, text: '朝が特につらく、会社に行けない日もあります。集中できず、仕事でミスが増えました。' },
    fatigue: { p: 1, text: '一日中だるいです。' },
    mood: { p: 1, text: '気分が沈んで、好きだった趣味も楽しめなくなりました。自分はだめな人間だと思ってしまいます。' },
    sleep: { p: 1, text: '夜中の3時ごろに目が覚めて、そのまま眠れません。' },
    anorexia: { p: 0.8, text: '食欲がなくて、何を食べてもおいしくないです。' },
    weightloss: { p: 0.6, text: 'この1か月で3kgやせました。' },
    trigger: { p: 1, text: '{why}、ストレスが続いています。' },
    heatcold: { p: 0, text: '' }, palpitation: { p: 0, text: '' }, bloodystool: { p: 0, text: '' }, menses: { p: 0, text: '' },
    meds: { p: 1, text: '特に飲んでいません。' },
  },
  exam: { gen_appear: { p: 1, text: '表情が乏しく、声が小さい。話すのに時間がかかる。' } },
  consult: { psych: '精神科：中等症のうつ病と考えます。希死念慮はありますが具体的な計画はなく、外来で治療可能です。休養（診断書）とSSRIの少量からの開始をお願いします。当科外来でフォローします。' },
  natural: -0.01,
  therapies: [
    { id: 'psych', label: '希死念慮の確認と、精神科（心療内科）での治療（休養・SSRIなど抗うつ薬・精神療法）', req: { fn: (enc, eff) => (eff.tags.ssri || 0) > 0 || enc.consults.some((c) => c.dept === 'psych') }, effect: -0.2, lagH: 24, required: true, deadlineH: [24, 24, 24] },
  ],
  useful: ['cbc', 'chem', 'thyroid', 'bs_poct', 'hba1c', 'ferritin'], key: [['cbc'], ['thyroid']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'うつ病：希死念慮が強くなければ、休養と抗うつ薬で外来治療（精神科・心療内科と連携）。自殺の危険が高ければ入院' }),
  teaching: [
    '2週間以上続く抑うつ気分・興味や喜びの喪失に、不眠（早朝覚醒）・食欲低下・倦怠感・集中力低下・自責感が加わればうつ病を考える（2質問法でスクリーニング）。',
    '必ず希死念慮（死にたい気持ち・計画）を確認する。聞くことで自殺を誘発することはない。',
    '甲状腺機能低下症・貧血・糖尿病・薬剤（ステロイドなど）・認知症などの身体疾患を採血で除外する。',
    '治療は休養・環境調整・抗うつ薬（SSRIなど、効果は2〜4週後）・精神療法。双極性障害（躁の既往）を見逃さない。',
  ],
  sources: ['日本うつ病学会治療ガイドライン II. うつ病（DSM-5）/大うつ病性障害2016', 'DSM-5-TR'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'thyroid'] }, { a: 'rx', drugId: 'sertraline', route: 'po', dose: 25, freq: 'q24h', days: 14 }],
});
