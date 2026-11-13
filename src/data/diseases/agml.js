// 急性胃粘膜病変（NSAIDs・ストレス）
// 出典: 日本消化器病学会『消化性潰瘍診療ガイドライン2020（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'agml', name: '急性胃粘膜病変（AGML）', dept: '消化器内科', weight: 3,
  demo: { age: [25, 75], ageMode: 'uniform', male: 0.55 },
  sev: { p: [0.55, 0.4, 0.05], burden: [[20, 28], [28, 36], [36, 44]] },
  comorb: { extra: {} },
  vars: (rng) => ({ trig: rng.pick(['腰痛で痛み止め（ロキソプロフェン）を1日4〜5回飲んでいた', '昨夜、宴会で大量にお酒を飲んだ', '仕事の大きなトラブルで3日ほど眠れていない']) }),
  cc: () => '急にみぞおちが痛くなった', ccKey: 'epigastric',
  history: {
    onset: { p: 1, text: '今朝から急にみぞおちが強く痛みます。' },
    character: { p: 1, text: 'キリキリと焼けるように痛く、吐き気があります。' },
    trigger: { p: 1, text: '{trig}です。' },
    meds: { p: 0.6, text: '腰痛で痛み止め（ロキソプロフェン）を飲んでいました。' },
    nausea: { p: 1, text: '吐き気があり、1回吐きました。少し茶色いものが混じっていました。' },
    heartburn: { p: 0.4, text: '胸やけもあります。' },
    bloodystool: { p: 0, text: '黒い便は出ていません。' }, weightloss: { p: 0, text: '体重は変わりません。' },
    chestpain: { p: 0, text: '胸の痛みはありません。' }, food: { p: 0, text: '生魚は食べていません。' }, pmh: { p: 0, text: '胃潰瘍と言われたことはありません。' },
    aggravating: { p: 0.5, text: '食べると痛みます。' },
  },
  exam: { abd_palp: { p: 1, text: '心窩部の圧痛。筋性防御・反跳痛なし。' }, gen_appear: { p: 1, text: '痛みで顔をしかめているが、全身状態は保たれている。' }, conjunctiva: { p: 0, text: '貧血なし。' } },
  labs: { BUN: { add: [0, 6], k: 1 } },
  tests: { abd_us: [{ p: 1, text: '胆石・胆嚢炎なし。膵臓に異常なし。', normal: true }], hp: [{ p: 0.3, text: 'ピロリ菌 陽性。' }] },
  natural: -0.1,
  therapies: [{ id: 'ppi', label: 'PPI（または P-CAB）と原因の除去（NSAIDsの中止・禁酒・休養）', req: { tag: 'ppi' }, effect: -0.6, lagH: 1, required: true, deadlineH: [6, 6, 4] }],
  useful: ['cbc', 'chem', 'ecg', 'abd_us', 'hp', 'lab_AMY', 'uhcg'], key: [['ecg'], ['cbc']],
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['admit', 'home'], best: 'admit', why: '吐血・貧血を伴う急性胃粘膜病変：入院で内視鏡' } : { ok: ['home', 'admit'], best: 'home', why: '急性胃粘膜病変：PPIと原因の除去で外来（吐血・黒色便があればすぐ受診）' }),
  teaching: [
    'NSAIDs・大量飲酒・強いストレスなどのきっかけの後に急に起こる心窩部痛・嘔気・時に吐血は急性胃粘膜病変（AGML）。',
    'まず心電図で心筋梗塞を、エコーや採血で胆道・膵臓の病気を除外。アニサキス（生魚）も鑑別。',
    '治療はPPIと原因の除去。吐血・黒色便・貧血があれば内視鏡で止血を考える。',
  ],
  sources: ['消化性潰瘍診療ガイドライン2020（日本消化器病学会）'],
  ideal: () => [{ a: 'test', ids: ['ecg', 'cbc', 'chem'] }, { a: 'rx', drugId: 'vonoprazan', route: 'po', dose: 20, freq: 'q24h', days: 14 }],
});
