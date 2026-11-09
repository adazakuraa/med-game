// 更年期障害
// 出典: 日本産科婦人科学会/日本女性医学学会『ホルモン補充療法ガイドライン2017年度版』, 『産婦人科診療ガイドライン 婦人科外来編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'menopause', name: '更年期障害', dept: '産婦人科', weight: 5,
  demo: { age: [45, 55], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  comorb: { extra: {} },
  vars: (rng) => ({ mo: rng.int(3, 12) }),
  cc: () => 'ほてりと疲れやすさ', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '{mo}か月前から、急に顔がカーッとほてって汗が出ることが1日に何回もあります。' },
    character: { p: 1, text: '疲れやすく、肩こりや頭が重い感じもあります。' },
    fatigue: { p: 1, text: '疲れやすいです。' },
    heatcold: { p: 1, text: '急に顔や上半身がほてって、汗がどっと出ます。そのあと寒くなることもあります。' },
    menses: { p: 1, text: '1年くらい前から生理が不規則になり、この半年は来ていません。' },
    mood: { p: 0.7, text: 'イライラしやすく、少し落ち込むこともあります。でも楽しめることはあります。' },
    sleep: { p: 0.7, text: '夜中に汗で目が覚めることがあります。' },
    palpitation: { p: 0.5, text: 'ほてるときに動悸がします。' },
    weightloss: { p: 0, text: '' }, weightgain: { p: 0.3, text: '少し体重が増えました。' }, bloodystool: { p: 0, text: '' },
    meds: { p: 1, text: '特に飲んでいません。' },
  },
  exam: {},
  natural: -0.01,
  therapies: [{ id: 'tx', label: 'ホルモン補充療法・漢方薬（加味逍遙散など）と生活指導', req: { anyTag: ['hrt', 'kampo_meno', 'ssri'] }, effect: -0.2, lagH: 24, required: true, deadlineH: [24, 24, 24] }],
  useful: ['thyroid', 'cbc', 'chem', 'uhcg', 'ecg'], key: [['thyroid']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '更年期障害：甲状腺疾患などを除外して外来治療（婦人科でホルモン補充療法の適応を判断）' }),
  teaching: [
    '閉経前後の約10年（45〜55歳ごろ）に、ほてり・発汗（ホットフラッシュ）・動悸・不眠・イライラ・抑うつ・肩こりなどが出るのが更年期障害。',
    '似た症状の甲状腺機能亢進症（TSH）、うつ病、貧血などを除外する。月経が不規則なら妊娠の可能性も確認。',
    '治療：生活指導、ホルモン補充療法（子宮があれば黄体ホルモン併用、乳がん・血栓症の既往では禁忌）、漢方薬（加味逍遙散・当帰芍薬散・桂枝茯苓丸）。',
    '閉経後は骨粗鬆症・脂質異常症が増えるので、骨密度や脂質も評価する。',
  ],
  sources: ['ホルモン補充療法ガイドライン2017年度版（日本産科婦人科学会/日本女性医学学会）'],
  ideal: () => [{ a: 'test', ids: ['thyroid', 'cbc'] }, { a: 'rx', drugId: 'kamishoyosan', route: 'po', dose: 2.5, freq: 'q8h', days: 14 }],
});
