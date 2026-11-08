// オーダー可能な検査。cost: 概算の検査費用（円, 診療報酬点数×10を目安）
// timeMin: 結果が出るまでの時間（分）, inv: 侵襲度 0-2
// kind: lab=検体検査の数値, qual=定性検査（感度・特異度）, report=画像・培養などの所見レポート, ecg
export const TEST_CATS = [
  { id: 'blood', name: '血液' },
  { id: 'urine', name: '尿' },
  { id: 'micro', name: '微生物' },
  { id: 'image', name: '画像' },
  { id: 'physio', name: '生理' },
  { id: 'single', name: '個別項目' },
];

export const TESTS = [
  { id: 'cbc', cat: 'blood', name: '血算セット', kind: 'lab', items: ['WBC', 'NEUT', 'HB', 'PLT'], cost: 210, timeMin: 30, inv: 1, sample: 'blood' },
  { id: 'chem', cat: 'blood', name: '生化学セット', kind: 'lab', items: ['NA', 'K', 'CL', 'BUN', 'CR', 'EGFR', 'GLU', 'AST', 'ALT', 'TBIL', 'ALB', 'AMY', 'CK'], cost: 1100, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'crp', cat: 'blood', name: 'CRP', kind: 'lab', items: ['CRP'], cost: 160, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'pct', cat: 'blood', name: 'プロカルシトニン', kind: 'lab', items: ['PCT'], cost: 2760, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'coag', cat: 'blood', name: '凝固セット', kind: 'lab', items: ['PT_INR', 'APTT', 'DDIMER'], cost: 640, timeMin: 45, inv: 1, sample: 'blood' },
  { id: 'vbg', cat: 'blood', name: '静脈血液ガス（POCT）', kind: 'lab', items: ['PH', 'PCO2', 'HCO3', 'LAC', 'NA', 'K', 'CL', 'AG', 'GLU'], cost: 1450, timeMin: 5, inv: 1, sample: 'blood' },
  { id: 'bnp', cat: 'blood', name: 'BNP', kind: 'lab', items: ['BNP'], cost: 1300, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'tnt', cat: 'blood', name: '高感度トロポニンT', kind: 'lab', items: ['TNT'], cost: 1200, timeMin: 45, inv: 1, sample: 'blood' },
  { id: 'hba1c', cat: 'blood', name: 'HbA1c', kind: 'lab', items: ['HBA1C'], cost: 490, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'bhb', cat: 'blood', name: '血中ケトン体（β-HB）', kind: 'lab', items: ['BHB'], cost: 590, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'ua', cat: 'urine', name: '尿定性', kind: 'lab', items: ['U_PRO', 'U_GLU', 'U_KET', 'U_BLD', 'U_LEU', 'U_NIT'], cost: 260, timeMin: 15, inv: 0, sample: 'urine' },
  { id: 'used', cat: 'urine', name: '尿沈渣', kind: 'lab', items: ['U_WBC', 'U_RBC', 'U_BACT'], cost: 270, timeMin: 30, inv: 0, sample: 'urine' },
  { id: 'uhcg', cat: 'urine', name: '尿妊娠反応（hCG）', kind: 'qual', cost: 550, timeMin: 10, inv: 0, sample: 'urine', pos: '陽性', neg: '陰性', spec: 0.995 },
  { id: 'bcx', cat: 'micro', name: '血液培養 2セット', kind: 'report', cost: 4300, timeMin: 2160, inv: 1, sample: 'blood', normal: '2セットとも陰性（5日間培養）。' },
  { id: 'ucx', cat: 'micro', name: '尿培養', kind: 'report', cost: 1700, timeMin: 2880, inv: 0, sample: 'urine', normal: '有意な菌の発育なし。' },
  { id: 'urine_gram', cat: 'micro', name: '尿グラム染色', kind: 'report', cost: 640, timeMin: 20, inv: 0, sample: 'urine', normal: '細菌・白血球をほとんど認めない。' },
  { id: 'sputum_gram', cat: 'micro', name: '喀痰グラム染色', kind: 'report', cost: 640, timeMin: 30, inv: 0, normal: '有意な菌を認めない（扁平上皮が多く唾液成分主体）。' },
  { id: 'sputum_cx', cat: 'micro', name: '喀痰培養', kind: 'report', cost: 1700, timeMin: 4320, inv: 0, normal: '常在菌のみ。' },
  { id: 'stool_cx', cat: 'micro', name: '便培養', kind: 'report', cost: 1800, timeMin: 4320, inv: 0, normal: '病原菌は検出されず（常在菌のみ）。' },
  { id: 'u_pneumo_ag', cat: 'micro', name: '尿中肺炎球菌抗原', kind: 'qual', cost: 2050, timeMin: 20, inv: 0, sample: 'urine', pos: '陽性', neg: '陰性', spec: 0.95 },
  { id: 'u_legion_ag', cat: 'micro', name: '尿中レジオネラ抗原', kind: 'qual', cost: 2050, timeMin: 20, inv: 0, sample: 'urine', pos: '陽性', neg: '陰性', spec: 0.99 },
  { id: 'flu_ag', cat: 'micro', name: 'インフルエンザ迅速抗原', kind: 'qual', cost: 1430, timeMin: 15, inv: 1, pos: 'A型陽性', neg: 'A型・B型とも陰性', spec: 0.98 },
  { id: 'covid_ag', cat: 'micro', name: 'SARS-CoV-2抗原定性', kind: 'qual', cost: 1500, timeMin: 15, inv: 1, pos: '陽性', neg: '陰性', spec: 0.99 },
  { id: 'cxr', cat: 'image', name: '胸部X線', kind: 'report', cost: 2100, timeMin: 20, inv: 0, radiation: true, normal: '心胸郭比 48%。肺野に明らかな浸潤影なし。肋骨横隔膜角は鋭。' },
  { id: 'chest_ct', cat: 'image', name: '胸部単純CT', kind: 'report', cost: 14000, timeMin: 45, inv: 0, radiation: true, normal: '肺野に明らかな浸潤影・結節影なし。胸水なし。縦隔リンパ節腫大なし。' },
  { id: 'axr', cat: 'image', name: '腹部X線', kind: 'report', cost: 2100, timeMin: 20, inv: 0, radiation: true, normal: '異常ガス像なし。ニボーなし。遊離ガスは指摘できない。' },
  { id: 'abd_us', cat: 'image', name: '腹部超音波', kind: 'report', cost: 5300, timeMin: 20, inv: 0, normal: '肝・胆・膵・腎に明らかな異常なし。水腎症なし。腹水なし。虫垂は同定できず。' },
  { id: 'abd_ct_plain', cat: 'image', name: '腹部単純CT', kind: 'report', cost: 14000, timeMin: 45, inv: 0, radiation: true, normal: '腹腔内に明らかな異常所見なし。遊離ガス・腹水なし。' },
  { id: 'abd_ct_contrast', cat: 'image', name: '腹部造影CT', kind: 'report', cost: 22000, timeMin: 60, inv: 2, radiation: true, contrast: true, normal: '腹腔内に明らかな異常所見なし。虫垂正常。腎の造影不良域なし。' },
  { id: 'ecg', cat: 'physio', name: '12誘導心電図', kind: 'ecg', cost: 1300, timeMin: 5, inv: 0 },
  { id: 'echo', cat: 'physio', name: '心エコー', kind: 'report', cost: 8800, timeMin: 30, inv: 0, normal: 'LVEF 約62%。壁運動異常なし。有意な弁膜症なし。下大静脈径 14mm、呼吸性変動良好。' },
];

// 個別項目（血算・生化学の単項目）を自動生成
const SINGLE_ITEMS = ['NA', 'K', 'CL', 'BUN', 'CR', 'GLU', 'AST', 'ALT', 'TBIL', 'ALB', 'AMY', 'CK', 'WBC', 'HB', 'PLT', 'LAC'];
import { LABS } from './labs.js';
for (const id of SINGLE_ITEMS) {
  TESTS.push({ id: 'lab_' + id, cat: 'single', name: LABS[id].name, kind: 'lab', items: id === 'CR' ? ['CR', 'EGFR'] : [id], cost: 110, timeMin: id === 'LAC' ? 15 : 45, inv: 1, sample: 'blood' });
}

export const TEST_BY_ID = Object.fromEntries(TESTS.map((t) => [t.id, t]));
