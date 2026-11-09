// 顎関節症
// 出典: 日本顎関節学会『顎関節症治療の指針2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'tmj', name: '顎関節症', dept: '歯科口腔外科', weight: 3,
  demo: { age: [18, 45], ageMode: 'young', male: 0.25 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '口を開けるとあごが痛い', ccKey: 'oral',
  history: {
    onset: { p: 1, text: '1か月前から、口を大きく開けたり硬いものをかむと、{side}あごの関節が痛みます。' },
    character: { p: 1, text: '口を開けるとカクッと音がします。口が開きにくいことがあります。' },
    trigger: { p: 1, text: '仕事中に歯を食いしばっていると言われます。寝ているときの歯ぎしりも指摘されています。' },
    fever: { p: 0, text: '熱はありません。' },
    dyspnea: { p: 0, text: '' },
  },
  exam: { oral_mucosa: { p: 1, text: '歯肉・口腔内に腫脹や排膿はない。歯の摩耗がある。' }, neck_ln: { p: 1, text: '頸部リンパ節の腫脹はない。' }, temporal: { p: 1, text: '{side}顎関節部と咬筋に圧痛。開口時にクリック音、開口量は3横指弱。側頭動脈は正常。' } },
  natural: -0.01,
  therapies: [{ id: 'tx', label: 'セルフケア（硬い物を避ける・食いしばりに気づく・開口訓練）と鎮痛薬、歯科でスプリント', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['crp'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '顎関節症：セルフケアと鎮痛、歯科口腔外科でスプリント療法' }),
  teaching: [
    '顎関節や咀嚼筋の痛み・開口障害・関節音（クリック）は顎関節症。若い女性に多く、食いしばり・歯ぎしり・ストレスが関わる。',
    '多くはセルフケア（硬い物を避ける・食いしばりの自覚・開口訓練）と鎮痛薬・スプリントで改善する。',
    '高齢者の新しい顎の痛み（咀嚼で悪化）は巨細胞性動脈炎の顎跛行、急な開口障害と発熱は智歯周囲炎・深頸部膿瘍、狭心症の放散痛も考える。',
  ],
  sources: ['顎関節症治療の指針2020（日本顎関節学会）'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
