// リウマチ性多発筋痛症
// 出典: 日本リウマチ学会, 2015 EULAR/ACR Recommendations for the management of PMR
import { outpatient } from './common.js';
export default outpatient({
  id: 'pmr', name: 'リウマチ性多発筋痛症', dept: '膠原病内科', weight: 3, minLevel: 1,
  demo: { age: [60, 88], ageMode: 'old', male: 0.35 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[25, 32], [32, 40], [40, 48]] },
  cc: () => '両肩と腰の痛み', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '1か月ほど前から、両肩と太ももの付け根が痛くて、腕が上がりにくいです。' },
    character: { p: 1, text: '朝がとくにつらくて、起き上がるのに時間がかかります。' },
    stiffness: { p: 1, text: '朝のこわばりが1時間以上続きます。' },
    joint: { p: 1, text: '両肩と股関節のあたりが痛くて動かしにくいです。' },
    fatigue: { p: 0.6, text: 'だるくて、少し体重が減りました。' },
    fever: { p: 0.3, text: '微熱があります。' },
    jaw: { p: 0, text: '' }, vision: { p: 0, text: '' }, headache: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '両肩・両股関節の運動時痛と可動域制限。上腕・大腿近位の圧痛。明らかな関節腫脹なし。筋力は保たれている。' }, temporal: { p: 0, text: '' } },
  labs: { ESR: { to: [50, 90], k: 0.2 }, CRP: { to: [3, 8], k: 0.5 } },
  natural: 0,
  therapies: [{ id: 'steroid', label: '少量ステロイド（プレドニゾロン12.5〜25mg）', req: { anyTag: ['steroid_sys'] }, effect: -0.5, lagH: 12, required: true, deadlineH: [72, 72, 48] }],
  useful: ['esr', 'crp', 'cbc', 'chem', 'lab_CK', 'thyroid'], key: [['esr', 'crp']],
  teaching: [
    '高齢者の両肩・両股関節の痛みと朝のこわばり（1時間以上）、赤沈・CRPの上昇はリウマチ性多発筋痛症。',
    '少量のプレドニゾロンで劇的に改善するのが特徴。巨細胞性動脈炎の症状（頭痛・顎跛行・視力障害）がないか必ず確認する。',
    '関節リウマチ・甲状腺機能低下症・悪性腫瘍・薬剤性ミオパチー（CK）を鑑別する。',
  ],
  sources: ['2015 EULAR/ACR Recommendations for the management of polymyalgia rheumatica'],
  ideal: () => [{ a: 'test', ids: ['esr', 'crp', 'cbc'] }, { a: 'rx', drugId: 'prednisolone', route: 'po', dose: 20, freq: 'q24h', days: 14 }],
});
