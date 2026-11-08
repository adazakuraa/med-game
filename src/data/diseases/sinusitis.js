// 急性副鼻腔炎
// 出典: 急性鼻副鼻腔炎診療ガイドライン2010年版（追補版）, 抗微生物薬適正使用の手引き 第三版
import { outpatient } from './common.js';
export default outpatient({
  id: 'sinusitis', name: '急性副鼻腔炎', dept: '耳鼻咽喉科', weight: 5, season: { winter: 1.3 },
  demo: { age: [18, 70], ageMode: 'uniform', male: 0.5 },
  vars: (rng, sev) => ({ days: [6, 10, 12][sev] + rng.int(0, 3), side: rng.pick(['右', '左']) }),
  cc: () => '鼻づまりと頬の痛み', ccKey: 'nasal',
  history: {
    onset: { p: 1, text: '{days}日前にかぜをひいて、鼻水がなかなか治りません。' },
    course: { p: 1, text: '一度良くなりかけたのに、また悪くなってきました。' },
    character: { p: 1, text: '黄色いドロッとした鼻水が出て、{side}の頬が重く痛みます。' },
    sorethroat: { p: 1, text: '黄色い鼻水と鼻づまりがあります。' },
    location: { p: 1, text: '{side}の頬から目の下あたりです。' },
    aggravating: { p: 0.8, text: '下を向くと頬の痛みが強くなります。' },
    fever: { p: [0.2, 0.4, 0.7], text: '37度台後半の熱があります。' },
    headache: { p: 0.5, text: '頭が重いです。' },
  },
  exam: { pharynx: { p: 0.6, text: '後鼻漏（喉の奥に膿性の鼻汁が流れている）。' }, skin: { p: 0.4, text: '{side}頬部に圧痛（上顎洞）。' } },
  organisms: ['spn'], minAbxDays: 5,
  natural: -0.08,
  therapies: [{ id: 'abx', label: '中等症以上：アモキシシリン（軽症は対症療法で経過観察）', req: { coverage: ['spn'] }, effect: -0.5, lagH: 12, required: (enc) => enc.patient.sev >= 1, deadlineH: [99, 48, 24] }],
  useful: [], key: [],
  teaching: [
    'かぜの後に膿性鼻汁・顔面痛（頬・前頭部）・後鼻漏が続く。多くはウイルス性で自然に治る。',
    '症状が10日以上続く、いったん良くなってから悪化（二峰性）、高熱と顔面痛が強いときは細菌性を考え、アモキシシリン。',
    '目の周りの腫れ・視力障害・複視・強い頭痛・意識障害は眼窩・頭蓋内への波及を疑い緊急。',
  ],
  sources: ['急性鼻副鼻腔炎診療ガイドライン（日本鼻科学会）', '抗微生物薬適正使用の手引き 第三版（厚生労働省 2023）'],
  ideal: () => [{ a: 'rx', drugId: 'ampc', route: 'po', dose: 500, freq: 'q8h', days: 7, when: 'sev>=1' }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'prn', days: 3 }],
});
