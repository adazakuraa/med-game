// 急性期脳梗塞
// 出典: 日本脳卒中学会『脳卒中治療ガイドライン2021（改訂2023）』『静注血栓溶解（rt-PA）療法 適正治療指針 第三版』, 各薬剤添付文書
export default {
  id: 'stroke', name: '急性期脳梗塞', dept: '脳神経内科',
  weight: 6, season: { winter: 1.2 }, minLevel: 2,
  demo: { age: [55, 92], ageMode: 'old', male: 0.55 },
  sev: { p: [0.35, 0.4, 0.25], burden: [[20, 30], [35, 50], [55, 68]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { htn: 0.7, af: 0.35, dm2: 0.3, dyslip: 0.4, ckd: 0.15 } },
  smokeP: 0.3,
  organisms: [],
  untreatedFatal: false,
  vars: (rng, sev, pt) => {
    const leftHemi = rng.chance(0.55);
    const lvo = rng.chance([0.15, 0.5, 0.8][sev]);
    const lastNormalH = Math.round((rng.chance(0.65) ? rng.range(0.6, 3.2) : rng.range(5, 12)) * 10) / 10;
    return {
      leftHemi, lvo, lastNormalH, paresis: leftHemi ? '右' : '左', hemi: leftHemi ? '左' : '右',
      mmt: [4, 3, 1][sev], aphasia: leftHemi,
      lnText: lastNormalH < 4 ? `${lastNormalH}時間ほど前までは普通に話していました。` : `昨晩寝る前（${Math.round(lastNormalH)}時間ほど前）は普段通りでした。朝起きたらこうなっていました。`,
    };
  },
  cc: (v) => (v.aphasia ? '右半身が動かない・言葉が出ない' : '左半身が動かない'),
  ccKey: 'neuro_deficit',
  arrival: () => 'ambulance',
  history: {
    lastnormal: { p: 1, text: '（家族）{lnText}' },
    onset: { p: 1, text: '（家族）{lnText}' },
    character: { p: 1, text: '（家族）急に{paresis}の手足が動かなくなって、{speechText}' },
    weakness: { p: 1, text: '{paresis}の手と足に力が入りません。' },
    speechq: { p: 1, text: '{speechAns}' },
    headache: { p: 0.1, text: '少し頭が重いです。' },
    nausea: { p: 0.1, text: '少し気持ち悪いです。' },
    palpitation: { p: 0.2, text: '以前から時々脈が乱れると言われています。' },
    seizure: { p: 0, text: '' },
  },
  postVars: (v) => {
    v.speechText = v.aphasia ? '言葉がうまく出なくなりました。' : 'ろれつが回らなくなりました。';
    v.speechFinding = v.aphasia ? '運動性失語（言葉が出ない）と、指示の理解も不十分。' : '構音障害（ろれつが回らない）。左半側空間無視あり。';
    v.speechAns = v.aphasia ? '（言葉がうまく出ない）……あの……その……（家族：言いたいことが言えないようです）' : 'ろれつが回りにくいです。';
  },
  exam: {
    gen_appear: { p: 1, bySev: ['不安そうだが、呼びかけに応じる。', '{paresis}半身の麻痺があり、ぐったりしている。', '{paresis}半身の完全麻痺。呼びかけへの反応が鈍い。'] },
    facial: { p: 0.95, text: '{paresis}の顔面下部の麻痺（口角が下がっている）。' },
    motor: { p: 1, text: '{paresis}上下肢の麻痺（Barré徴候・Mingazzini徴候陽性、徒手筋力 {mmt}/5）。' },
    speech: { p: 1, text: '{speechFinding}' },
    pupils: { p: [0, 0.2, 0.6], text: '両眼が{hemi}を向いている（共同偏視）。瞳孔は同大。' },
  },
  vitals: { SBP: { to: [175, 205], k: 0.3 }, HR: { to: [80, 95], k: 1 } },
  labs: { GLU: { add: [10, 40], k: 1 } },
  tests: {
    head_ct: [{ p: [0.1, 0.3, 0.5], text: '{hemi}中大脳動脈領域にわずかな早期虚血変化（皮髄境界の不明瞭化）。出血なし。' }],
    head_mri: [{ p: 0.97, persist: true, text: '拡散強調像で{hemi}中大脳動脈領域に高信号（急性期脳梗塞）。' }, { p: 1, ifVar: 'lvo', unlessProc: 'thrombectomy', text: 'MRAで{hemi}中大脳動脈（M1）の閉塞。' }],
    echo: [{ p: 0.3, text: '左房拡大。左心耳の観察は困難。' }],
  },
  ecg: [],
  natural: 0,
  therapies: [
    { id: 'tpa', label: '発症4.5時間以内の血栓溶解療法（rt-PA）', req: { tag: 'thrombolytic' }, required: (enc) => enc.patient.vars.lastNormalH < 3.3 && !enc.patient.homeMeds.some((m) => ['warfarin', 'apixaban'].includes(m)), deadlineH: [1, 1, 1] },
    { id: 'thrombectomy', label: '主幹動脈閉塞：脳神経内科（脳神経外科）コンサルト→血栓回収療法', req: { procDone: 'thrombectomy' }, required: (enc) => enc.patient.vars.lvo && enc.patient.vars.lastNormalH < 16, deadlineH: [3, 3, 3] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, v = enc.patient.vars;
    const hrs = v.lastNormalH + enc.t / 60;
    if (eff.tags.thrombolytic && st.reperfusedAt == null && hrs < 4.5 && !st.comp.ich) st.reperfusedAt = hrs + (v.lvo ? 3 : 0);
    if (st.procDone?.thrombectomy && (st.reperfusedAt == null || st.reperfusedAt > hrs)) st.reperfusedAt = hrs;
    if (st.reperfusedAt != null) {
      const floor = 4 + st.reperfusedAt * 4 + (enc.patient.sev * 4);
      return st.burden > floor ? -2.5 : -0.03;
    }
    if (hrs < 8) return 0.35 * (v.lvo ? 1.6 : 1);
    return v.lvo && st.burden > 65 ? 0.25 : -0.03; // 大梗塞は脳浮腫で悪化しうる
  },
  procedures: [{
    id: 'thrombectomy', depts: ['neuro', 'nsurg'], label: '血栓回収療法', delay: 40, duration: 60, after: 'icu',
    decide: (enc) => {
      const mri = enc.tests.some((t) => t.id === 'head_mri' && t.done);
      const ct = enc.tests.some((t) => t.id === 'head_ct' && t.done);
      const v = enc.patient.vars;
      if (!ct && !mri) return { accept: false, text: 'まず頭部CTで出血を除外してください。主幹動脈閉塞の評価にMRI（MRA）もお願いします。' };
      if (!mri) return { accept: false, reveal: true, text: '脳梗塞の可能性が高いです。血栓回収の適応を判断するためMRI（拡散強調像・MRA）をお願いします。rt-PAの適応があれば先に開始してください。' };
      if (v.lvo && v.lastNormalH + enc.t / 60 < 24) return { accept: true, reveal: true, text: '{hemi}中大脳動脈閉塞の急性期脳梗塞です。血栓回収療法を行います（約40分後に開始）。' };
      return { accept: false, reveal: true, text: '主幹動脈の閉塞はなく、血栓回収の適応はありません。脳卒中ケアユニットで管理し、抗血小板療法などの内科治療を行います。' };
    },
    onDone: () => {},
    doneText: '脳神経内科：血栓回収療法で{hemi}中大脳動脈が再開通しました。SCU（ICU）で管理します。',
  }],
  harmTags: {},
  residualAbove: 15,
  residualText: '片麻痺・言語障害などの後遺症が残り、リハビリテーションを継続しています。',
  dispo: (enc) => ({ ok: ['icu', 'admit'], best: 'icu', why: '急性期脳梗塞：脳卒中ケアユニット（SCU/ICU）で管理' }),
  useful: ['bs_poct', 'lab_GLU', 'head_ct', 'head_mri', 'cbc', 'chem', 'coag', 'ecg', 'cxr', 'echo', 'vbg', 'tnt'],
  key: [['bs_poct', 'lab_GLU', 'chem', 'vbg'], ['head_ct', 'head_mri'], ['ecg']],
  extrasOk: () => [],
  teaching: [
    '突然の片麻痺・顔面麻痺・言語障害は脳卒中を疑う（FAST）。最も重要な情報は「最後に普段通りだった時刻（最終健常確認時刻）」。',
    'まず血糖を測る（低血糖は脳卒中とそっくりの症状を起こす）。頭部CTで出血を除外する。',
    '発症4.5時間以内で禁忌がなければrt-PA（アルテプラーゼ0.6mg/kg）。来院から投与まで60分以内が目標。',
    '主幹動脈閉塞があれば血栓回収療法（発症24時間以内まで適応がありうる）。MRAやCTAで評価する。',
    '血栓溶解をしない場合、急性期の降圧は収縮期220mmHg超などに限る（下げすぎると梗塞が広がる）。rt-PAを行う場合は185/110未満に下げる。',
    '心房細動（抗凝固薬内服中）の確認は必須。抗凝固薬内服中はrt-PAが原則禁忌になる。',
  ],
  sources: ['脳卒中治療ガイドライン2021〔改訂2023〕（日本脳卒中学会）', '静注血栓溶解（rt-PA）療法 適正治療指針 第三版', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['bs_poct', 'head_ct', 'cbc', 'chem', 'coag', 'ecg'] },
    { a: 'wait', min: 25 },
    { a: 'rx', drugId: 'alteplase', route: 'iv', dose: Math.min(60, Math.round(p.weight * 0.6)), freq: 'once', days: 1, when: 'tpa_ok' },
    { a: 'test', ids: ['head_mri'] },
    { a: 'consult', dept: 'neuro', delayMin: 60 },
  ],
};
