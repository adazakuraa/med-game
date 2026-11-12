// 原発開放隅角緑内障（正常眼圧緑内障を含む）
// 出典: 日本緑内障学会『緑内障診療ガイドライン（第5版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'poag', name: '開放隅角緑内障', dept: '眼科', weight: 4,
  demo: { age: [50, 85], ageMode: 'old', male: 0.5 },
  comorb: { extra: { htn: 0.3, dm2: 0.2 } },
  vars: () => ({}),
  cc: () => '視野が欠けている気がする', ccKey: 'vision',
  history: {
    onset: { p: 1, text: '最近、車の運転中に横から来る自転車に気づくのが遅れることがあります。健診の眼底写真で「視神経乳頭陥凹拡大」と言われました。' },
    character: { p: 1, text: '痛みや充血はありません。見たい所ははっきり見えます。' },
    vision: { p: 1, text: '視力は落ちていませんが、片方の目を隠すと見えにくい部分がある気がします。' },
    headache: { p: 0, text: '頭痛・目の痛みはありません。' }, jaw: { p: 0, text: '' }, weakness: { p: 0, text: '' }, speechq: { p: 0, text: '' },
    pmh: { p: 0, text: '' }, meds: { p: 0, text: 'ステロイドは使っていません。' }, trigger: { p: 0, text: '' },
  },
  exam: { eye: { p: 0, text: '結膜充血なし。前房は深い。' }, pupils: { p: 0, text: '瞳孔・対光反射は正常。' }, motor: { p: 0, text: '' } },
  tests: { acuity: [{ p: 1, text: '両眼 1.0（正常）。', normal: true }], iop: [{ p: 1, text: '眼圧 右16mmHg・左17mmHg（正常範囲：正常眼圧緑内障）。', normal: true }], fundus: [{ p: 1, persist: true, text: '両側の視神経乳頭陥凹拡大（C/D比 0.8）とリムの菲薄化、網膜神経線維層欠損。' }], perimetry: [{ p: 1, persist: true, text: '両眼に鼻側階段と弓状暗点（緑内障性視野障害）。' }], oct: [{ p: 1, persist: true, text: '視神経乳頭周囲の網膜神経線維層の菲薄化。' }] },
  natural: 0.005,
  therapies: [{ id: 'tx', label: '眼圧下降点眼（ラタノプロスト）と眼科での定期的な視野検査', req: { tag: 'glaucoma_drop' }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 72] }],
  useful: ['acuity', 'iop', 'fundus', 'perimetry', 'oct', 'slit'], key: [['fundus', 'perimetry', 'oct']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '開放隅角緑内障：点眼で眼圧を下げ、眼科で生涯フォロー' }),
  teaching: [
    '開放隅角緑内障は自覚症状がなくゆっくり視野が欠け、気づいたときには進行している。日本の中途失明原因の第1位。日本人は眼圧が正常の「正常眼圧緑内障」が多い。',
    '眼底の視神経乳頭陥凹拡大、視野検査（鼻側階段・弓状暗点）、OCTで診断。',
    '失った視野は戻らない。眼圧を下げる点眼（プロスタグランジン関連薬が第一選択）で進行を遅らせる。40歳以上は検診を。',
    '急な眼痛・頭痛・嘔吐・充血は閉塞隅角緑内障の発作で、別の緊急疾患。',
  ],
  sources: ['緑内障診療ガイドライン（第5版）（日本緑内障学会）'],
  ideal: () => [{ a: 'test', ids: ['acuity', 'iop', 'fundus', 'perimetry'] }, { a: 'rx', drugId: 'latanoprost', route: 'top', dose: 1, freq: 'q24h', days: 28 }],
});
