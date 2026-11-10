// 鼠径ヘルニア（還納可能）
// 出典: 日本ヘルニア学会『鼠径部ヘルニア診療ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'inguinal_hernia', name: '鼠径ヘルニア', dept: '外科', weight: 4,
  demo: { age: [45, 85], ageMode: 'old', male: 0.85 },
  comorb: { extra: { bph: 0.3, copd: 0.1 } },
  vars: (rng) => ({ side: rng.pick(['右', '右', '左']) }),
  cc: () => '足の付け根がふくらむ', ccKey: 'scrotal',
  history: {
    onset: { p: 1, text: '数か月前から、立ったり力んだりすると{side}の足の付け根がふくらみます。' },
    character: { p: 1, text: '横になると引っ込みます。少し違和感がありますが、強い痛みはありません。' },
    location: { p: 1, text: '{side}の足の付け根から陰嚢のほうです。' },
    nausea: { p: 0, text: '吐き気はありません。' }, fever: { p: 0, text: '熱はありません。' },
    trigger: { p: 1, text: '重い物を持つ仕事をしています。便秘がちで、トイレでいきみます。' },
    dysuria: { p: 0, text: '' },
  },
  exam: { inguinal: { p: 1, text: '{side}鼠径部に立位で鶏卵大の柔らかい膨隆。咳で膨隆し、臥位で用手的に容易に還納できる。圧痛はない。' }, scrotum: { p: 1, text: '精巣に腫大・圧痛はない。' }, abd_palp: { p: 1, text: '腹部は平坦・軟。' } },
  tests: { abd_us: [{ p: 1, persist: true, text: '{side}鼠径部に腹圧で脱出する腸管と脂肪（鼠径ヘルニア）。' }] },
  natural: -0.001,
  therapies: [{ id: 'surg', label: '外科へ紹介：待機的手術（メッシュ修復・腹腔鏡下手術）、嵌頓の症状を説明', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'surgery') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { surgery: '外科：還納可能な右鼠径ヘルニアです。自然には治らず、嵌頓の危険もあるので、待機的に腹腔鏡下またはメッシュによる修復術を予定します。戻らなくなって痛む・吐く場合はすぐに受診するよう伝えてください。' },
  useful: ['abd_us', 'cbc'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '還納可能な鼠径ヘルニア：外科外来で待機的手術（嵌頓のサインがあればすぐ受診）' }),
  teaching: [
    '立位や腹圧でふくらみ、横になると戻る鼠径部の膨隆は鼠径ヘルニア。中高年男性に多い。',
    '自然には治らず、根本治療は手術。戻らなくなる・痛む・吐く（嵌頓）は緊急手術。',
    '陰嚢の腫れでは、精巣捻転・精巣上体炎・陰嚢水腫・精巣腫瘍と区別する。',
  ],
  sources: ['鼠径部ヘルニア診療ガイドライン2024（日本ヘルニア学会）'],
  ideal: () => [{ a: 'consult', dept: 'surgery', delayMin: 1 }, { a: 'wait', min: 70 }],
});
