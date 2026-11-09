// 陥入爪・爪囲炎
// 出典: 日本皮膚科学会 資料, 日本フットケア・足病医学会資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'paronychia', name: '陥入爪・爪囲炎', dept: '皮膚科', weight: 4,
  demo: { age: [15, 60], ageMode: 'young', male: 0.55 },
  comorb: { extra: {} },
  organisms: ['gpc'], minAbxDays: 3, untreatedFatal: false,
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '足の親指の爪の横が腫れて痛い', ccKey: 'leg_red',
  history: {
    onset: { p: 1, text: '1週間前から{side}足の親指の爪の横が赤く腫れて、膿が出てきました。' },
    course: { p: 1, text: 'だんだん腫れが強くなっています。' },
    character: { p: 1, text: '靴を履くと痛いです。' },
    trigger: { p: 1, text: '爪を短く深爪に切っていて、サッカーをしています。' },
    fever: { p: 0, text: '熱はありません。' },
    pmh: { p: 1, text: '糖尿病はありません。' },
    chills: { p: 0, text: '' }, immobility: { p: 0, text: '' }, meds: { p: 1, text: '特に飲んでいません。' },
  },
  exam: { skin: { p: 1, text: '{side}母趾の爪の外側縁に爪が食い込み、周囲の発赤・腫脹と膿・肉芽。発赤は趾先にとどまる。' }, calf: { p: 0, text: '' } },
  natural: 0.02,
  therapies: [
    { id: 'abx', label: '抗菌薬（セファレキシンなど）と排膿・爪の処置（コットンパッキング・テーピング、必要なら部分抜爪）', req: { coverage: ['gpc'] }, effect: -0.5, lagH: 6, required: true, deadlineH: [24, 24, 24] },
  ],
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '陥入爪・爪囲炎：外来で抗菌薬と爪の処置、正しい爪の切り方（スクエアカット）を指導' }),
  teaching: [
    '深爪・きつい靴で爪の角が皮膚に食い込み（陥入爪）、細菌感染して爪囲炎になる。',
    '治療：感染があれば抗菌薬と排膿、コットンパッキング・テーピング・ワイヤー矯正、重症例は部分抜爪やフェノール法。',
    '予防：爪は指先と同じ長さでまっすぐ切る（スクエアカット）、足に合った靴。',
    '糖尿病・末梢動脈疾患がある人の足の感染は重症化しやすいので注意。',
  ],
  sources: ['日本皮膚科学会 資料'],
  ideal: () => [{ a: 'rx', drugId: 'cex', route: 'po', dose: 500, freq: 'q6h', days: 5 }, { a: 'proc', id: 'wound_care' }],
});
