// 急性気管支炎
// 出典: 抗微生物薬適正使用の手引き 第三版（2023）, 咳嗽・喀痰の診療ガイドライン2019（日本呼吸器学会）
import { outpatient } from './common.js';
export default outpatient({
  id: 'bronchitis', name: '急性気管支炎', weight: 8, season: { winter: 1.5 },
  demo: { age: [18, 80], ageMode: 'uniform', male: 0.5 },
  vars: (rng) => ({ days: rng.int(5, 12) }),
  cc: () => '咳が続く', ccKey: 'fever_cough',
  history: {
    onset: { p: 1, text: '{days}日前にかぜをひいて、咳だけがずっと続いています。' },
    character: { p: 1, text: '咳がひどくて、夜も目が覚めます。痰は少し白っぽいです。' },
    cough: { p: 1, text: 'はい、咳がずっと出ます。' },
    sputum: { p: 0.6, text: '白っぽい痰が少し出ます。' },
    fever: { p: 0.2, text: '最初の数日だけ微熱がありました。今は熱はありません。' },
    sorethroat: { p: 0.5, text: '最初は喉が痛くて鼻水も出ていました。' },
    dyspnea: { p: 0, text: '' },
    smoking: { p: 0.3, text: 'タバコは吸いません。' },
  },
  exam: { lung_ausc: { p: 0.3, text: '咳をすると消える程度の軽いrhonchi。crackles・wheezesなし。' } },
  natural: -0.2,
  therapies: [{ id: 'symptom', label: '対症療法と経過の説明（咳は2〜3週間続くことがある）', req: { anyTag: ['analgesic'] }, required: false, deadlineH: [6, 6, 6] }],
  harmTags: { abx: '急性気管支炎（多くはウイルス性）に抗菌薬は不要' },
  useful: ['cxr'], key: [],
  teaching: [
    'かぜの後に咳が中心で続くのは急性気管支炎。多くはウイルス性で、咳は2〜3週間続くことがある。',
    'バイタルが正常で胸部の聴診所見がなければ肺炎の可能性は低く、胸部X線は必須ではない（高熱・頻呼吸・低酸素・高齢者なら撮る）。',
    '抗菌薬は不要。3週間以上続く咳は、咳喘息・後鼻漏・逆流性食道炎・百日咳・結核・肺がんなどを考える。',
  ],
  sources: ['抗微生物薬適正使用の手引き 第三版（厚生労働省 2023）', '咳嗽・喀痰の診療ガイドライン2019（日本呼吸器学会）'],
  ideal: () => [{ a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'prn', days: 3 }],
});
