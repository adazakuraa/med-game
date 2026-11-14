// 処方画面の薬剤グループ（目的別。1つの薬が複数のグループに入ってもよい）
export const DRUG_GROUPS = [
  { id: 'inf', kw: 'かんせんしょう こうきんやく こうせいぶっしつ ういるす かび しんきん わくちん', icon: '🦠', name: '感染症', subs: [
    ['抗菌薬（点滴・注射）', ['ctrx', 'abpc_sbt', 'abpc', 'cez', 'cmz', 'cfpm', 'mepm', 'vcm', 'clinda', 'mnz_iv', 'bpg']],
    ['抗菌薬（内服）', ['ampc', 'amox_clav', 'cex', 'lvfx', 'azm', 'doxy', 'mnz_po', 'vcm_po']],
    ['抗ウイルス・抗真菌・抗寄生虫', ['oseltamivir', 'acyclovir', 'valacyclovir', 'artemether', 'ivermectin', 'hcq']],
    ['ワクチン・免疫グロブリン', ['tetanus', 'tig', 'ivig']],
  ] },
  { id: 'pain', kw: 'いたみ ちんつう げねつ ねつ いたみどめ ずつう つうふう ちんせい すいみん ねむれない', icon: '🤕', name: '痛み・熱・鎮静', subs: [
    ['解熱鎮痛薬', ['apap_po', 'apap_iv', 'loxo']],
    ['強い痛み・神経の痛み', ['morphine', 'mirogabalin', 'duloxetine']],
    ['頭痛・痛風', ['sumatriptan', 'colchicine']],
    ['鎮静・睡眠', ['diazepam', 'brotizolam', 'lemborexant']],
  ] },
  { id: 'cv', kw: 'じゅんかんき しんぞう けつあつ こうあつ しんふぜん りにょう ふせいみゃく みゃく けっせん しけつ しょうあつ ひんけつ', icon: '❤️', name: '循環器・血液', subs: [
    ['血圧を下げる', ['nicardipine', 'amlodipine_rx', 'telmisartan']],
    ['心不全・利尿薬', ['furosemide_iv', 'carperitide', 'ntg', 'ntg_spray', 'spironolactone', 'dapagliflozin', 'tolvaptan']],
    ['不整脈・脈拍', ['landiolol', 'bisoprolol', 'diltiazem', 'amiodarone', 'atp', 'atropine']],
    ['抗血小板・抗凝固・血栓溶解', ['aspirin', 'prasugrel', 'clopidogrel', 'cilostazol', 'heparin_bolus', 'heparin', 'apixaban', 'alteplase']],
    ['止血・抗凝固の拮抗', ['vitk', 'txa']],
    ['昇圧薬', ['norad', 'adrenaline']],
    ['その他（血管・脂質・貧血）', ['limaprost', 'atorvastatin_rx', 'ferrous', 'mecobalamin']],
  ] },
  { id: 'resp', kw: 'こきゅう ぜんそく せき きゅうにゅう あれるぎー はいえん', icon: '🫁', name: '呼吸器・アレルギー', subs: [
    ['気管支拡張薬・吸入', ['salbutamol', 'ics_laba']],
    ['アレルギー', ['adrenaline', 'chlorphen', 'fexofenadine']],
    ['間質性肺炎', ['nintedanib']],
  ] },
  { id: 'gi', kw: 'しょうかき い いさん むねやけ はきけ おうと ふくつう べんぴ げり かんぞう すいぞう じ', icon: '🍽', name: '消化器', subs: [
    ['胃酸を抑える', ['ppi', 'vonoprazan']],
    ['吐き気・腹痛・胃腸の動き', ['mcp', 'scopolamine', 'acotiamide', 'trimebutine']],
    ['便秘・肝性脳症', ['mgo_rx', 'lactulose']],
    ['腸・肝胆膵', ['mesalazine', 'udca', 'pancrelipase', 'camostat', 'vasopressin_like']],
    ['肛門', ['hemorrhoid_oint']],
  ] },
  { id: 'endo', kw: 'とうにょうびょう いんすりん けっとう ていけっとう こうじょうせん ほるもん すてろいど でんかいしつ かりうむ ほね びたみん', icon: '🧪', name: '糖尿病・ホルモン・電解質', subs: [
    ['糖尿病・低血糖', ['insulin_r', 'insulin_bolus', 'insulin_basal', 'metformin_rx', 'dapagliflozin', 'glucose50']],
    ['甲状腺・下垂体', ['levothyroxine', 'thiamazole', 'kI', 'cabergoline']],
    ['ステロイド', ['hydrocortisone', 'prednisolone', 'mpsl', 'dexa']],
    ['電解質・酸塩基', ['kcl', 'kcl_po', 'calcium', 'bicarb', 'szc']],
    ['骨・カルシウム・尿酸', ['zoledronic', 'elcatonin', 'alendronate', 'febuxostat']],
    ['ビタミン', ['thiamine', 'mecobalamin', 'vitk']],
  ] },
  { id: 'neuro', kw: 'のう しんけい けいれん てんかん せいしん うつ にんちしょう めまい', icon: '🧠', name: '神経・精神', subs: [
    ['けいれん', ['diazepam', 'levetiracetam', 'carbamazepine']],
    ['脳・神経', ['mannitol', 'levodopa', 'donepezil_rx', 'pyridostigmine', 'betahistine', 'dantrolene']],
    ['精神科', ['sertraline', 'olanzapine', 'duloxetine', 'lemborexant']],
  ] },
  { id: 'rheum', kw: 'こうげんびょう めんえき じんぞう', icon: '🦴', name: '膠原病・免疫・腎', subs: [
    ['膠原病・免疫', ['prednisolone', 'mpsl', 'mtx', 'hcq', 'ivig']],
    ['腎臓', ['tolvaptan', 'szc', 'bicarb']],
  ] },
  { id: 'er', kw: 'きゅうきゅう そせい しょっく ちゅうどく げどく', icon: '🚑', name: '救急・中毒・解毒', subs: [
    ['蘇生・ショック', ['adrenaline', 'norad', 'atropine', 'glucose50', 'calcium']],
    ['中毒・解毒', ['flumazenil', 'charcoal', 'nac', 'pam', 'mamushi_av', 'thiamine']],
  ] },
  { id: 'gyn', kw: 'ふじんか せいり げっけい にんしん さんか ちつ ぼうこう ぜんりつせん', icon: '🤰', name: '婦人科・産科・泌尿器', subs: [
    ['女性ホルモン・月経', ['dienogest', 'relugolix', 'ocp', 'mpa', 'estradiol_gel', 'kamishoyosan', 'estriol_vag']],
    ['妊娠・産科', ['ritodrine', 'mgso4']],
    ['腟の感染', ['clotrimazole_vag', 'mnz_po']],
    ['泌尿器', ['silodosin', 'mirabegron', 'tadalafil']],
  ] },
  { id: 'topical', kw: 'がいよう ぬりぐすり なんこう ひふ めぐすり てんがん め みみ くち', icon: '🧴', name: '外用薬（皮膚・眼・耳・口）', subs: [
    ['皮膚', ['steroid_oint', 'heparinoid', 'terbinafine_cream', 'ketoconazole_cream', 'vitd_oint', 'adapalene', 'ivermectin']],
    ['点眼・眼', ['eye_abx', 'eye_antiallergy', 'eye_steroid', 'latanoprost', 'diquafosol', 'pilocarpine', 'acetazolamide']],
    ['耳・口', ['ear_drop', 'miconazole_gel', 'triamcinolone_oral', 'cevimeline']],
  ] },
];

/** 検索用の正規化：全角/半角・大文字小文字・カタカナ/ひらがなをそろえる */
export function normJa(s) {
  return (s || '').normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/[\s・（）()]/g, '');
}
