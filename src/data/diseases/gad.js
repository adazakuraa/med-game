// 全般不安症
// 出典: 日本不安症学会 資料, NICE guideline CG113
import { outpatient } from './common.js';
export default outpatient({
  id: 'gad', name: '全般不安症', dept: '精神科', weight: 3,
  demo: { age: [20, 55], ageMode: 'uniform', male: 0.35 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '不安で落ち着かず、眠れない', ccKey: 'psych',
  history: {
    onset: { p: 1, text: '半年以上前から、仕事・家族・健康のことなど、いろいろなことが心配でたまりません。' },
    character: { p: 1, text: '心配しすぎだとわかっていても止められず、いつも緊張して落ち着きません。肩こりと頭痛もあります。' },
    mood: { p: 0.3, text: '落ち込むというより、不安が強いです。楽しめることはあります。' },
    sleep: { p: 1, text: '寝つきが悪く、何度も目が覚めます。' },
    palpitation: { p: 0.5, text: '時々動悸がします。' },
    hallucination: { p: 0, text: '' },
    meds: { p: 1, text: '特に飲んでいません。カフェインはコーヒーを1日5杯飲みます。' },
    alcohol: { p: 1, text: '眠れないので寝酒をしています。' },
    heatcold: { p: 0, text: '暑がりや体重の変化はありません。' }, weightloss: { p: 0, text: '' },
  },
  exam: { gen_appear: { p: 1, text: '緊張した表情で、そわそわしている。' }, tremor: { p: 0.2, text: '軽い手指振戦（緊張による）。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '身体疾患の除外、精神療法（認知行動療法）とSSRI、カフェイン・寝酒を控える', req: { fn: (enc, eff) => (eff.tags.ssri || 0) > 0 || enc.consults.some((c) => c.dept === 'psych') }, effect: -0.3, lagH: 24, required: true, deadlineH: [48, 48, 48] }],
  harmTags: { benzo: '全般不安症にベンゾジアゼピンの長期使用（依存）' },
  useful: ['thyroid', 'cbc', 'chem', 'ecg', 'bs_poct'], key: [['thyroid']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '全般不安症：外来で精神療法とSSRI' }),
  teaching: [
    '6か月以上続く、さまざまなことへの過剰で制御できない心配に、緊張・疲れやすさ・集中困難・イライラ・筋緊張・不眠を伴うのが全般不安症。',
    '甲状腺機能亢進症・カフェイン・アルコール・薬剤・不整脈などの身体的な原因を除外する。うつ病の合併も多い。',
    '治療は認知行動療法とSSRI。ベンゾジアゼピンは依存があり長期使用を避ける。',
  ],
  sources: ['NICE guideline CG113: Generalised anxiety disorder and panic disorder in adults'],
  ideal: () => [{ a: 'test', ids: ['thyroid', 'ecg'] }, { a: 'rx', drugId: 'sertraline', route: 'po', dose: 25, freq: 'q24h', days: 28 }],
});
