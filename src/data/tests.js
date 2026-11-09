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
  { id: 'cbc', cat: 'blood', name: '血算セット', kind: 'lab', items: ['WBC', 'NEUT', 'HB', 'MCV', 'PLT'], cost: 210, timeMin: 30, inv: 1, sample: 'blood' },
  { id: 'chem', cat: 'blood', name: '生化学セット', kind: 'lab', items: ['NA', 'K', 'CL', 'BUN', 'CR', 'EGFR', 'GLU', 'AST', 'ALT', 'TBIL', 'ALB', 'AMY', 'LIP', 'CK', 'URIC', 'CA'], cost: 1100, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'crp', cat: 'blood', name: 'CRP', kind: 'lab', items: ['CRP'], cost: 160, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'pct', cat: 'blood', name: 'プロカルシトニン', kind: 'lab', items: ['PCT'], cost: 2760, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'coag', cat: 'blood', name: '凝固セット', kind: 'lab', items: ['PT_INR', 'APTT', 'DDIMER'], cost: 640, timeMin: 45, inv: 1, sample: 'blood' },
  { id: 'vbg', cat: 'blood', name: '静脈血液ガス（POCT）', kind: 'lab', items: ['PH', 'PCO2', 'HCO3', 'LAC', 'NA', 'K', 'CL', 'AG', 'GLU', 'COHB'], cost: 1450, timeMin: 5, inv: 1, sample: 'blood' },
  { id: 'thyroid', cat: 'blood', name: '甲状腺機能（TSH・FT4）', kind: 'lab', items: ['TSH', 'FT4'], cost: 2700, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'ferritin', cat: 'blood', name: 'フェリチン（鉄の貯蔵）', kind: 'lab', items: ['FER'], cost: 1100, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'nh3', cat: 'blood', name: 'アンモニア', kind: 'lab', items: ['NH3'], cost: 500, timeMin: 30, inv: 1, sample: 'blood' },
  { id: 'tox', cat: 'urine', name: '尿中薬物スクリーニング', kind: 'qual', cost: 3000, timeMin: 15, inv: 0, sample: 'urine', pos: 'ベンゾジアゼピン類 陽性', neg: '陰性', spec: 0.97 },
  { id: 'esr', cat: 'blood', name: '赤沈', kind: 'lab', items: ['ESR'], cost: 90, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'bnp', cat: 'blood', name: 'BNP', kind: 'lab', items: ['BNP'], cost: 1300, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'tnt', cat: 'blood', name: '高感度トロポニンT', kind: 'lab', items: ['TNT'], cost: 1200, timeMin: 45, inv: 1, sample: 'blood' },
  { id: 'hba1c', cat: 'blood', name: 'HbA1c', kind: 'lab', items: ['HBA1C'], cost: 490, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'bhb', cat: 'blood', name: '血中ケトン体（β-HB）', kind: 'lab', items: ['BHB'], cost: 590, timeMin: 60, inv: 1, sample: 'blood' },
  { id: 'bs_poct', cat: 'blood', name: '簡易血糖測定（指先）', kind: 'lab', items: ['GLU'], cost: 100, timeMin: 1, inv: 1, sample: 'blood' },
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
  { id: 'strep_ag', cat: 'micro', name: '溶連菌迅速抗原', kind: 'qual', cost: 1360, timeMin: 10, inv: 0, pos: '陽性', neg: '陰性', spec: 0.95 },
  { id: 'fobt', cat: 'micro', name: '便潜血（2回法）', kind: 'qual', cost: 370, timeMin: 1440, inv: 0, pos: '陽性', neg: '陰性', spec: 0.93 },
  { id: 'myco_ag', cat: 'micro', name: 'マイコプラズマ迅速抗原', kind: 'qual', cost: 1500, timeMin: 15, inv: 1, pos: '陽性', neg: '陰性', spec: 0.95 },
  { id: 'afb', cat: 'micro', name: '喀痰抗酸菌検査（塗抹・PCR・培養）', kind: 'report', cost: 4500, timeMin: 120, inv: 0, normal: '抗酸菌塗抹陰性。結核菌PCR陰性（培養は結果待ち）。' },
  { id: 'igra', cat: 'micro', name: 'インターフェロンγ遊離試験（T-SPOT/QFT）', kind: 'qual', cost: 6000, timeMin: 1440, inv: 0, pos: '陽性', neg: '陰性', spec: 0.97 },
  { id: 'cdiff', cat: 'micro', name: 'CDトキシン・抗原（便）', kind: 'qual', cost: 1000, timeMin: 60, inv: 0, pos: '陽性（GDH抗原・トキシンとも陽性）', neg: '陰性', spec: 0.98 },
  { id: 'hp', cat: 'micro', name: 'ピロリ菌検査（尿素呼気試験）', kind: 'qual', cost: 1800, timeMin: 30, inv: 0, pos: '陽性', neg: '陰性', spec: 0.97 },
  { id: 'flu_ag', cat: 'micro', name: 'インフルエンザ迅速抗原', kind: 'qual', cost: 1430, timeMin: 15, inv: 1, pos: 'A型陽性', neg: 'A型・B型とも陰性', spec: 0.98 },
  { id: 'covid_ag', cat: 'micro', name: 'SARS-CoV-2抗原定性', kind: 'qual', cost: 1500, timeMin: 15, inv: 1, pos: '陽性', neg: '陰性', spec: 0.99 },
  { id: 'cxr', cat: 'image', name: '胸部X線', kind: 'report', cost: 2100, timeMin: 20, inv: 0, radiation: true, normal: '心胸郭比 48%。肺野に明らかな浸潤影なし。肋骨横隔膜角は鋭。' },
  { id: 'chest_ct', cat: 'image', name: '胸部単純CT', kind: 'report', cost: 14000, timeMin: 45, inv: 0, radiation: true, normal: '肺野に明らかな浸潤影・結節影なし。胸水なし。縦隔リンパ節腫大なし。' },
  { id: 'chest_cta', cat: 'image', name: '胸部造影CT（CTアンギオ）', kind: 'report', cost: 22000, timeMin: 45, inv: 2, radiation: true, contrast: true, normal: '大動脈に解離・瘤なし。肺動脈に造影欠損なし。肺野に明らかな異常なし。' },
  { id: 'axr', cat: 'image', name: '腹部X線', kind: 'report', cost: 2100, timeMin: 20, inv: 0, radiation: true, normal: '異常ガス像なし。ニボーなし。遊離ガスは指摘できない。' },
  { id: 'abd_us', cat: 'image', name: '腹部超音波', kind: 'report', cost: 5300, timeMin: 20, inv: 0, normal: '肝・胆・膵・腎に明らかな異常なし。水腎症なし。腹水なし。虫垂は同定できず。' },
  { id: 'tvus', cat: 'image', name: '経腟超音波', kind: 'report', cost: 5300, timeMin: 20, inv: 1, female: true, normal: '子宮・両側付属器に明らかな異常なし。ダグラス窩に液体貯留なし。' },
  { id: 'hip_xr', cat: 'image', name: '股関節・骨盤X線', kind: 'report', cost: 2600, timeMin: 20, inv: 0, radiation: true, normal: '骨折・脱臼なし。' },
  { id: 'abd_ct_plain', cat: 'image', name: '腹部単純CT', kind: 'report', cost: 14000, timeMin: 45, inv: 0, radiation: true, normal: '腹腔内に明らかな異常所見なし。遊離ガス・腹水なし。' },
  { id: 'abd_ct_contrast', cat: 'image', name: '腹部造影CT', kind: 'report', cost: 22000, timeMin: 60, inv: 2, radiation: true, contrast: true, normal: '腹腔内に明らかな異常所見なし。虫垂正常。腎の造影不良域なし。' },
  { id: 'leg_us', cat: 'physio', name: '下肢静脈エコー', kind: 'report', cost: 5300, timeMin: 30, inv: 0, normal: '両下肢の深部静脈に血栓なし。圧迫で良好に虚脱する。' },
  { id: 'head_ct', cat: 'image', name: '頭部単純CT', kind: 'report', cost: 14000, timeMin: 20, inv: 0, radiation: true, normal: '頭蓋内に出血・腫瘤・明らかな低吸収域なし。正中偏位なし。' },
  { id: 'head_mri', cat: 'image', name: '頭部MRI（拡散強調像・MRA）', kind: 'report', cost: 25000, timeMin: 60, inv: 0, normal: '拡散強調像で異常信号なし。MRAで主幹動脈の閉塞・狭窄・動脈瘤なし。' },
  { id: 'lp', cat: 'micro', name: '腰椎穿刺（髄液検査・グラム染色）', kind: 'report', cost: 3500, timeMin: 60, inv: 2, normal: '初圧 14cmH2O。無色透明。細胞数 2/μL、蛋白 30mg/dL、糖 65mg/dL（血糖比 0.6以上）。グラム染色で菌を認めない。' },
  { id: 'orthostatic', cat: 'physio', name: '起立試験（臥位→立位の血圧・脈拍）', kind: 'report', cost: 0, timeMin: 10, inv: 0, normal: '臥位→立位で血圧・脈拍に有意な変化なし。' },
  { id: 'joint_xr', cat: 'image', name: '関節X線（膝・肩など）', kind: 'report', cost: 2100, timeMin: 20, inv: 0, radiation: true, normal: '骨折・脱臼なし。関節裂隙は保たれている。' },
  { id: 'spine_xr', cat: 'image', name: '胸腰椎X線', kind: 'report', cost: 2600, timeMin: 20, inv: 0, radiation: true, normal: '明らかな骨折・すべりなし。' },
  { id: 'spine_mri', cat: 'image', name: '脊椎MRI', kind: 'report', cost: 25000, timeMin: 60, inv: 0, normal: '椎体・椎間板・硬膜外に明らかな異常信号なし。脊髄の圧迫なし。' },
  { id: 'joint_tap', cat: 'micro', name: '関節穿刺（関節液検査・グラム染色・結晶）', kind: 'report', cost: 2000, timeMin: 30, inv: 2, normal: '関節液は黄色透明。白血球 500/μL。結晶なし。グラム染色で菌を認めない。' },
  { id: 'ecg', cat: 'physio', name: '12誘導心電図', kind: 'ecg', cost: 1300, timeMin: 5, inv: 0 },
  { id: 'stress_ecg', cat: 'physio', name: '運動負荷心電図（トレッドミル）', kind: 'report', cost: 1600, timeMin: 30, inv: 1, normal: '目標心拍数まで負荷して、胸部症状なし。有意なST変化なし（陰性）。' },
  { id: 'ccta', cat: 'image', name: '冠動脈CT', kind: 'report', cost: 30000, timeMin: 60, inv: 2, radiation: true, contrast: true, normal: '冠動脈に有意な狭窄なし。' },
  { id: 'iop', cat: 'physio', name: '眼圧測定', kind: 'report', cost: 820, timeMin: 10, inv: 0, normal: '眼圧 右15mmHg・左14mmHg（正常）。' },
  { id: 'scrotal_us', cat: 'image', name: '陰嚢エコー（カラードプラ）', kind: 'report', cost: 5300, timeMin: 20, inv: 0, normal: '両側精巣の血流は良好。精巣上体の腫大なし。' },
  { id: 'leg_cta', cat: 'image', name: '下肢動脈造影CT', kind: 'report', cost: 22000, timeMin: 45, inv: 2, radiation: true, contrast: true, normal: '下肢動脈に閉塞・狭窄なし。' },
  { id: 'echo', cat: 'physio', name: '心エコー', kind: 'report', cost: 8800, timeMin: 30, inv: 0, normal: 'LVEF 約62%。壁運動異常なし。有意な弁膜症なし。下大静脈径 14mm、呼吸性変動良好。' },
];

// 個別項目（血算・生化学の単項目）を自動生成
const SINGLE_ITEMS = ['NA', 'K', 'CL', 'BUN', 'CR', 'GLU', 'AST', 'ALT', 'TBIL', 'ALB', 'AMY', 'CK', 'WBC', 'HB', 'PLT', 'LAC', 'TNT', 'DDIMER'];
import { LABS } from './labs.js';
for (const id of SINGLE_ITEMS) {
  TESTS.push({ id: 'lab_' + id, cat: 'single', name: LABS[id].name, kind: 'lab', items: id === 'CR' ? ['CR', 'EGFR'] : [id], cost: id === 'TNT' ? 1200 : id === 'DDIMER' ? 1300 : 110, timeMin: id === 'LAC' ? 15 : id === 'TNT' ? 20 : 45, inv: 1, sample: 'blood' });
}

export const TEST_BY_ID = Object.fromEntries(TESTS.map((t) => [t.id, t]));
