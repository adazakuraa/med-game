// 急性冠症候群（急性心筋梗塞：STEMI / NSTEMI）
// 出典: 日本循環器学会『2018年改訂版 急性冠症候群ガイドライン』（2022年 JCS ガイドライン フォーカスアップデート版 冠動脈疾患患者における薬物療法）, 各薬剤添付文書
import { clamp } from '../../engine/rng.js';

export default {
  id: 'acs', name: '急性冠症候群（急性心筋梗塞）', dept: '循環器内科',
  weight: 6, season: { winter: 1.3, summer: 0.8 }, minLevel: 2,
  demo: { age: [42, 88], ageMode: 'old', male: 0.72 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[25, 38], [40, 55], [62, 76]] },
  refractoryP: [0, 0.02, 0.12],
  comorb: { extra: { htn: 0.6, dm2: 0.35, dyslip: 0.5, ckd: 0.12, bph: 0.1, ed: 0.1 } },
  smokeP: 0.45,
  organisms: [],
  vars: (rng, sev) => {
    const stemi = rng.chance([0.35, 0.65, 0.85][sev]);
    const inferior = rng.chance(0.45);
    const rvInfarct = stemi && inferior && rng.chance(0.3);
    const ecgText = !stemi ? 'V4〜V6でST低下（1〜2mm）と陰性T波。ST上昇なし。'
      : inferior ? `II・III・aVFでST上昇（2〜4mm）、I・aVLで対側性のST低下。${rvInfarct ? '右側胸部誘導V4RでもST上昇。' : ''}`
        : 'V1〜V4でST上昇（3〜5mm）。';
    return {
      stemi, inferior, rvInfarct, ecgText, onsetH: Math.round(rng.range(1, 5) * 10) / 10,
      activity: rng.pick(['朝の散歩中', '階段を上っているとき', '寝ているとき', '仕事中']),
      peakTnt: stemi ? rng.range(2.5, 8) : rng.range(0.08, 0.6), peakCk: stemi ? rng.range(1500, 4500) : rng.range(150, 500),
      ef: stemi ? (inferior ? rng.int(45, 55) : rng.int(30, 45)) : rng.int(50, 60),
      wall: stemi ? (inferior ? '左室下壁' : '左室前壁中隔〜心尖部') : '左室側壁',
      vessel: stemi ? (inferior ? '右冠動脈' : '左前下行枝') : '左回旋枝',
    };
  },
  cc: () => '胸痛',
  ccKey: 'chest_pain',
  arrival: (sev) => (sev >= 1 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{onsetH}時間ほど前、{activity}に急に胸が苦しくなりました。' },
    course: { p: 1, text: '安静にしていても全然良くならず、ずっと続いています。' },
    character: { p: 1, text: '胸の真ん中が締め付けられるような、重苦しい痛みです。' },
    location: { p: 1, text: '胸の真ん中全体です。指1本では示せません。' },
    radiation: { p: 0.6, text: '左の肩から腕、あと顎のほうにも響きます。' },
    severity: { p: 1, bySev: ['6くらいです。', '8くらいです。', '10です。'] },
    chestpain: { p: 1, text: '胸が締め付けられるように痛いです。' },
    sweating: { p: [0.5, 0.7, 0.9], text: '冷や汗がびっしょり出ました。' },
    nausea: { p: 0.4, text: '少し吐き気があります。' },
    dyspnea: { p: [0.2, 0.45, 0.85], text: '息も苦しいです。' },
    aggravating: { p: 0.3, text: '体を動かすとさらに苦しくなります。' },
    relieving: { p: 1, text: '何をしても楽になりません。' },
    trigger: { p: 0.4, text: '寒い中、重い荷物を運んだ後でした。' },
    palpitation: { p: 0.1, text: '少しドキドキします。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['胸を押さえて苦しそう。', '冷汗を伴い苦悶様。', '顔面蒼白で冷汗著明。ぐったりしている。'] },
    heart_ausc: { p: 0.3, text: 'IV音を聴取。' },
    lung_ausc: { p: [0, 0.35, 0.85], text: '両側下肺野でcrackles（肺うっ血）。' },
    jvd: { p: 1, ifVar: 'rvInfarct', text: '頸静脈怒張あり（肺野はきれい）。' },
    periph: { p: [0, 0.2, 0.85], text: '四肢冷感・湿潤。CRT 3秒以上。' },
  },
  vitals: { HR: { to: [100, 118], k: 1 }, RR: { to: [24, 30], k: 1 }, SpO2: { drop: [8, 14], k: 1.8 }, SBP: { to: [68, 82], k: 2.6 } },
  labs: {
    WBC: { to: [9500, 13500], k: 1 }, GLU: { add: [20, 60], k: 1 }, BNP: { to: [150, 900], k: 1.5 }, LAC: { to: [3, 6], k: 3 },
  },
  labHook: (enc, id, v) => {
    if (id !== 'TNT' && id !== 'CK') return v;
    const pv = enc.patient.vars;
    const hrs = pv.onsetH + enc.t / 60;
    if (id === 'TNT') return v + pv.peakTnt * (1 - Math.exp(-Math.max(0, hrs - 1.5) / 6));
    return v + pv.peakCk * clamp(1 - Math.exp(-Math.max(0, hrs - 3.5) / 8), 0, 1);
  },
  tests: {
    cxr: [{ p: [0, 0.35, 0.85], text: '両側肺門部優位の肺うっ血。' }],
    echo: [{ p: 0.95, persist: true, text: '{wall}の壁運動低下。LVEF 約{ef}%。' }],
    chest_cta: [],
  },
  ecg: [
    { p: 1, unlessProc: 'pci', text: '{ecgText}' },
    { p: 1, ifProc: 'pci', text: '再灌流後：ST変化は改善傾向。' },
  ],
  natural: 0.6,
  curedBy: 'pci',
  therapies: [
    { id: 'antiplatelet', label: 'アスピリン（抗血小板薬）の投与', req: { tag: 'antiplatelet' }, effect: -0.15, lagH: 0, required: true, deadlineH: [1, 1, 0.5] },
    { id: 'pci', label: '循環器内科コンサルト→緊急カテーテル治療（PCI）', req: { procDone: 'pci' }, required: true, deadlineH: (enc) => (enc.patient.vars.stemi ? [2, 2, 2] : [24, 12, 3]) },
    { id: 'o2', label: '酸素投与（SpO2<90%）', req: { o2: true }, when: (c) => c.rawSpO2 < 90, required: true, deadlineH: [0.5, 0.5, 0.25] },
  ],
  procedures: [{
    id: 'pci', depts: ['cardio'], label: '緊急カテーテル治療', delay: 45, duration: 60, after: 'icu',
    decide: (enc) => {
      const ecg = enc.tests.some((t) => t.id === 'ecg' && t.done);
      const tnt = enc.tests.some((t) => t.done && t.result.items?.some((i) => i.id === 'TNT' && i.flag === 'H'));
      const v = enc.patient.vars;
      if (!ecg) return { accept: false, text: 'まず12誘導心電図を見せてください。' };
      if (v.stemi) return { accept: true, reveal: true, text: '{ecgText}STEMIです。カテ室を準備して緊急冠動脈造影・PCIを行います（約45分後に入室）。アスピリンの投与をお願いします。' };
      if (tnt || enc.patient.sev === 2) return { accept: true, reveal: true, text: 'トロポニン上昇を伴うNSTEMIです。早期の冠動脈造影・PCIを行います（約45分後に入室）。抗血小板薬の投与をお願いします。' };
      return { accept: false, text: '心電図ではST上昇はありません。トロポニンを（発症から時間をおいて）再検し、上昇があれば再度ご連絡ください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, enc.patient.vars.stemi ? 32 : 22); },
    doneText: '循環器内科：{vessel}の閉塞（狭窄）に対してステントを留置し、血流が再開しました。CCUで管理します。',
  }],
  harmTags: {},
  dispo: (enc) => (enc.patient.vars.stemi || enc.patient.sev >= 1 ? { ok: ['icu'], best: 'icu', why: '急性心筋梗塞：CCU（ICU）で管理' } : { ok: ['icu', 'admit'], best: 'icu', why: 'NSTEMI：CCUまたは循環器病棟で管理' }),
  useful: ['ecg', 'tnt', 'lab_TNT', 'cbc', 'chem', 'coag', 'cxr', 'echo', 'vbg', 'bnp', 'lab_K', 'lab_CK', 'chest_cta', 'lab_DDIMER'],
  key: [['ecg'], ['tnt', 'lab_TNT'], ['cxr', 'echo']],
  extrasOk: (enc, ctx) => (ctx.initVit.SBP < 90 ? ['adhf'] : []),
  teaching: [
    '胸痛ではまず10分以内に12誘導心電図。ST上昇型（STEMI）は一刻を争い、来院から再灌流（PCI）まで90分以内が目標。',
    '発症早期はトロポニンがまだ上がっていないことがある。正常でも時間をおいて再検する。',
    'アスピリン（162〜330mgを噛み砕く）は大動脈解離が否定的なら速やかに投与する。',
    '下壁梗塞では右室梗塞の合併に注意。硝酸薬やモルヒネで著明な低血圧を起こしうる（V4Rを確認）。',
    'SpO2が保たれている患者への酸素のルーチン投与は推奨されない。',
  ],
  sources: ['日本循環器学会 急性冠症候群ガイドライン（2018年改訂版）', '2022年JCSガイドライン フォーカスアップデート版 冠動脈疾患患者における薬物療法', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['ecg', 'tnt', 'cbc', 'chem', 'cxr'] },
    { a: 'rx', drugId: 'aspirin', route: 'po', dose: 200, freq: 'once', days: 1 },
    { a: 'o2', device: 'nc', flow: 3, when: 'spo2<92' },
    { a: 'consult', dept: 'cardio', delayMin: 30 },
  ],
};
