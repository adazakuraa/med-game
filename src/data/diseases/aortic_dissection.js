// 急性大動脈解離
// 出典: 日本循環器学会/日本心臓血管外科学会ほか『2020年改訂版 大動脈瘤・大動脈解離診療ガイドライン』, 各薬剤添付文書
export default {
  id: 'aortic_dissection', name: '急性大動脈解離', dept: '心臓血管外科',
  weight: 2, season: { winter: 1.4, summer: 0.8 }, minLevel: 3,
  demo: { age: [45, 88], ageMode: 'old', male: 0.65 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[25, 35], [40, 55], [60, 72]] },
  refractoryP: [0, 0.05, 0.2],
  comorb: { forced: ['htn'], extra: { dyslip: 0.3, ckd: 0.15, dm2: 0.1, af: 0.05 } },
  smokeP: 0.4,
  organisms: [],
  vars: (rng, sev) => {
    const typeA = rng.chance(0.6);
    return {
      typeA, onsetH: Math.round(rng.range(0.5, 3) * 10) / 10, bpDiff: rng.int(22, 40), med: rng.int(85, 110),
      ctText: typeA
        ? '上行大動脈から下行大動脈に及ぶ内膜フラップと偽腔（偽腔開存型）。Stanford A型。少量の心嚢液。'
        : '左鎖骨下動脈分岐部より末梢の下行大動脈から腹部大動脈に内膜フラップと偽腔。上行大動脈に解離なし。Stanford B型。',
      typeText: typeA ? 'Stanford A型' : 'Stanford B型',
    };
  },
  cc: () => '胸痛',
  ccKey: 'chest_pain',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '{onsetH}時間ほど前、突然、胸から背中にかけて激痛が走りました。' },
    course: { p: 1, text: '痛みは一瞬で最高になって、ずっと続いています。' },
    character: { p: 1, text: '今まで経験したことのない、引き裂かれるような痛みです。' },
    location: { p: 1, text: '胸と背中です。' },
    migration: { p: 0.5, text: '最初は胸でしたが、だんだん背中から腰のほうに移ってきています。' },
    radiation: { p: 0.6, text: '背中に突き抜けるようです。' },
    severity: { p: 1, text: '10です。今までで一番の痛みです。' },
    chestpain: { p: 1, text: '胸と背中がものすごく痛いです。' },
    flankpain: { p: 0.4, text: '背中から腰にかけて痛いです。' },
    sweating: { p: 0.6, text: '冷や汗が出ました。' },
    nausea: { p: 0.2, text: '少し吐き気があります。' },
    dizziness: { p: 0.25, ifVar: 'typeA', text: '一瞬、目の前が暗くなりました。' },
    adherence: { p: 0.5, text: '血圧の薬を時々飲み忘れていました。' },
    relieving: { p: 1, text: 'どんな姿勢でも楽になりません。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['激しい痛みで苦悶様。', '冷汗を伴い苦悶様。', '顔面蒼白で冷汗著明。'] },
    bp_lr: { p: 0.35, text: '上肢血圧の左右差あり（右 {SBP} / 左 {SBPL}mmHg）。左橈骨動脈の拍動が弱い。' },
    heart_ausc: { p: 0.4, ifVar: 'typeA', text: '胸骨左縁に拡張期雑音（大動脈弁逆流）。' },
    neuro_basic: { p: 0.12, ifVar: 'typeA', text: '左上下肢に軽度の筋力低下。' },
    periph: { p: [0, 0.2, 0.7], text: '四肢冷感。' },
    jvd: { p: [0, 0.2, 0.6], ifVar: 'typeA', text: '頸静脈怒張（心タンポナーデを疑う）。' },
  },
  vitals: { HR: { to: [100, 120], k: 1 }, RR: { to: [22, 28], k: 1 }, SBP: { to: [0, 0], custom: true } },
  customVitals: (enc, f) => {
    const v = enc.patient.vars;
    // B型は高血圧、A型の重症は心タンポナーデ・破裂で低血圧
    if (v.typeA && f > 0.55) return { SBP: 165 - 160 * (f - 0.55) * 2 };
    return { SBP: 158 + 30 * Math.pow(f, 0.5) };
  },
  labs: {
    DDIMER: { to: [6, 40], k: 0.25 }, CRP: { to: [1, 4], k: 1 }, WBC: { to: [10000, 14000], k: 1 },
    CR: { add: [0.3, 1.2], k: 1, p: 0.2 }, HB: { add: [-2, -0.8], k: 1, p: 0.3 }, LAC: { to: [3, 7], k: 3 }, TNT: { add: [0.02, 0.2], k: 1, p: 0.1 },
  },
  tests: {
    cxr: [{ p: 0.6, text: '上縦隔の拡大（縦隔幅 約{med}mm）。' }, { p: 0.2, text: '左胸水。' }],
    chest_cta: [{ p: 0.99, persist: true, text: '{ctText}' }],
    echo: [{ p: 0.7, ifVar: 'typeA', persist: true, text: '上行大動脈の拡大とフラップ様のエコー。中等度の大動脈弁逆流。少量の心嚢液。' }],
  },
  ecg: [{ p: 0.4, text: '左室肥大所見。急性のST上昇なし。' }],
  natural: 0.3,
  curedBy: 'aortic_surgery',
  therapies: [
    { id: 'bp', label: '降圧と心拍数コントロール（β遮断薬→Ca拮抗薬など）', req: { anyTag: ['betablocker', 'bp_lower', 'nitrate'] }, when: (c) => c.vit.SBP >= 100, required: true, deadlineH: [1, 1, 0.5], startFromNeed: true, effect: -0.8, lagH: 0.5 },
    { id: 'pain', label: '鎮痛（モルヒネなど）', req: { tag: 'opioid' }, required: false, deadlineH: [1, 1, 1] },
    { id: 'surgery', label: '心臓血管外科コンサルト→緊急手術（A型）', req: { procDone: 'aortic_surgery' }, required: (enc) => enc.patient.vars.typeA, deadlineH: [6, 4, 2] },
  ],
  dynamics: (enc, eff) => {
    let d = enc.patient.vars.typeA ? 0.6 : 0;
    if (eff.tags.antiplatelet || eff.tags.anticoag || eff.tags.anticoag_bolus) d += 3;
    return d;
  },
  procedures: [{
    id: 'aortic_surgery', depts: ['cvs', 'surgery'], label: '緊急手術', delay: 90, duration: 240, after: 'icu',
    decide: (enc) => {
      const ct = enc.tests.some((t) => ['chest_cta'].includes(t.id) && t.done && t.result.abnormal);
      if (!ct) return { accept: false, text: '大動脈解離を疑うなら、胸腹部の造影CTで確認してください。降圧・鎮痛を先行してください。' };
      if (enc.patient.vars.typeA) return { accept: true, reveal: true, text: 'Stanford A型の急性大動脈解離です。緊急で上行大動脈置換術を行います（約90分後に手術室へ）。降圧・鎮痛を続け、抗血小板薬・抗凝固薬は使わないでください。' };
      return { accept: false, reveal: true, text: 'Stanford B型で、臓器虚血などの合併症はありません。降圧（収縮期血圧100〜120mmHg）・心拍数コントロール・鎮痛・安静による内科治療をICUでお願いします。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 35); },
    doneText: '心臓血管外科：上行大動脈置換術を終えました。ICUで術後管理を行います。',
  }],
  harmTags: {
    antiplatelet: '大動脈解離に抗血小板薬（解離の進展・破裂・出血のリスク）',
    anticoag: '大動脈解離に抗凝固薬（解離の進展・破裂・出血のリスク）',
    anticoag_bolus: '大動脈解離に抗凝固薬（解離の進展・破裂・出血のリスク）',
  },
  dispo: () => ({ ok: ['icu'], best: 'icu', why: '急性大動脈解離：ICUで厳重な降圧・モニタリング（A型は緊急手術）' }),
  useful: ['ecg', 'tnt', 'lab_TNT', 'cbc', 'chem', 'coag', 'lab_DDIMER', 'cxr', 'chest_cta', 'echo', 'vbg', 'lab_CR', 'lab_HB'],
  key: [['chest_cta'], ['ecg'], ['cxr', 'echo']],
  extrasOk: () => [],
  teaching: [
    '突然発症の「引き裂かれるような」胸背部痛、痛みの移動、上肢血圧の左右差、縦隔拡大は大動脈解離を疑う手がかり。',
    '確定診断は造影CT。上行大動脈に解離があればStanford A型で緊急手術、なければB型で降圧を中心とした内科治療が基本。',
    'まずβ遮断薬で心拍数を下げ、収縮期血圧100〜120mmHgを目標に降圧する。痛みはモルヒネなどで十分にとる。',
    '心筋梗塞と間違えて抗血小板薬・抗凝固薬を投与すると致命的になりうる。胸痛では解離を除外してから使う。',
    'Dダイマーが正常なら解離の可能性はかなり低い（除外に役立つ）。',
  ],
  sources: ['2020年改訂版 大動脈瘤・大動脈解離診療ガイドライン（日本循環器学会ほか）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['ecg', 'cbc', 'chem', 'coag', 'cxr', 'chest_cta'] },
    { a: 'rx', drugId: 'morphine', route: 'iv', dose: 3, freq: 'once', days: 1, when: 'sbp>=100' },
    { a: 'rx', drugId: 'landiolol', route: 'iv', dose: 3, freq: 'cont', days: 7, when: 'sbp>=100' },
    { a: 'rx', drugId: 'nicardipine', route: 'iv', dose: 2, freq: 'cont', days: 7, when: 'sbp>=100' },
    { a: 'consult', dept: 'cvs', delayMin: 50 },
  ],
};
