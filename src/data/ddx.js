// 鑑別診断として選べる疾患名リスト（ゲームに実装済みでない疾患も含む）
export const DDX_CATS = [
  { id: 'resp', name: '呼吸器' }, { id: 'cv', name: '循環器' }, { id: 'gi', name: '消化器' },
  { id: 'uro', name: '腎・泌尿器' }, { id: 'endo', name: '内分泌・代謝' }, { id: 'inf', name: '感染症・全身' },
  { id: 'gyn', name: '婦人科' }, { id: 'neuro', name: '神経' }, { id: 'other', name: 'その他' },
];
export const DDX = [
  ['cap', '市中肺炎', 'resp'], ['aspiration', '誤嚥性肺炎', 'resp'], ['bronchitis', '急性気管支炎', 'resp'],
  ['uri', '上気道炎（かぜ症候群）', 'resp'], ['influenza', 'インフルエンザ', 'resp'], ['covid', 'COVID-19', 'resp'],
  ['pe', '肺塞栓症', 'resp'], ['ptx', '気胸', 'resp'], ['copd', 'COPD増悪', 'resp'], ['asthma', '気管支喘息発作', 'resp'], ['tb', '肺結核', 'resp'],
  ['adhf', '急性心不全', 'cv'], ['acs', '急性冠症候群', 'cv'], ['myocarditis', '急性心筋炎', 'cv'], ['af_rvr', '頻脈性心房細動', 'cv'], ['pericarditis', '急性心膜炎', 'cv'], ['aortic_dissection', '急性大動脈解離', 'cv'],
  ['gastro', '急性胃腸炎（ウイルス性）', 'gi'], ['bact_enteritis', '細菌性腸炎', 'gi'], ['appendicitis', '急性虫垂炎', 'gi'],
  ['cholecystitis', '急性胆嚢炎', 'gi'], ['cholangitis', '急性胆管炎', 'gi'], ['pancreatitis', '急性膵炎', 'gi'], ['diverticulitis', '大腸憩室炎', 'gi'],
  ['sbo', '腸閉塞', 'gi'], ['perforation', '消化管穿孔', 'gi'], ['mesenteric', '腸間膜虚血', 'gi'], ['pud', '消化性潰瘍', 'gi'],
  ['pyelo', '急性腎盂腎炎', 'uro'], ['cystitis', '急性膀胱炎', 'uro'], ['prostatitis', '急性前立腺炎', 'uro'], ['ureteral', '尿管結石', 'uro'],
  ['obst_pyelo', '閉塞性腎盂腎炎', 'uro'], ['aki', '急性腎障害', 'uro'],
  ['dka', '糖尿病性ケトアシドーシス', 'endo'], ['hhs', '高浸透圧高血糖状態', 'endo'], ['aka', 'アルコール性ケトアシドーシス', 'endo'],
  ['hypoglycemia', '低血糖', 'endo'], ['thyroid_storm', '甲状腺クリーゼ', 'endo'], ['hyperk', '高カリウム血症', 'endo'],
  ['sepsis', '敗血症', 'inf'], ['septic_shock', '敗血症性ショック', 'inf'], ['dehydration', '脱水症', 'inf'], ['anaphylaxis', 'アナフィラキシー', 'inf'],
  ['ectopic', '異所性妊娠', 'gyn'], ['pid', '骨盤内炎症性疾患', 'gyn'], ['ovarian_torsion', '卵巣捻転', 'gyn'],
  ['meningitis', '細菌性髄膜炎', 'neuro'], ['stroke', '脳梗塞', 'neuro'], ['ich', '脳出血', 'neuro'], ['sah', 'くも膜下出血', 'neuro'], ['tia', '一過性脳虚血発作（TIA）', 'neuro'],
  ['migraine', '片頭痛', 'neuro'], ['tension_ha', '緊張型頭痛', 'neuro'], ['cluster', '群発頭痛', 'neuro'], ['encephalitis', '脳炎', 'neuro'], ['epilepsy_sz', 'てんかん発作', 'neuro'],
  ['wernicke', 'Wernicke脳症', 'neuro'], ['hepatic_enc', '肝性脳症', 'gi'], ['intox', '薬物・アルコール中毒', 'other'], ['sinusitis', '急性副鼻腔炎', 'resp'], ['aaa', '腹部大動脈瘤破裂', 'cv'], ['lumbago', '腰痛症（筋骨格系）', 'other'],
  ['gerd', '逆流性食道炎', 'gi'], ['musculoskeletal', '筋骨格系の胸痛（肋軟骨炎など）', 'other'], ['panic', 'パニック発作', 'other'],
].map(([id, name, cat]) => ({ id, name, cat }));
export const DDX_BY_ID = Object.fromEntries(DDX.map((d) => [d.id, d]));
