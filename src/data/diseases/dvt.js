// 深部静脈血栓症
// 出典: 肺血栓塞栓症および深部静脈血栓症の診断、治療、予防に関するガイドライン（2017年改訂版）, 各薬剤添付文書
export default {
  id: 'dvt', name: '深部静脈血栓症', dept: '循環器内科',
  weight: 3, season: {}, minLevel: 1,
  demo: { age: [30, 85], ageMode: 'uniform', male: 0.45 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[18, 26], [26, 36], [36, 46]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { htn: 0.3, cancer: 0.15, dyslip: 0.2 } },
  organisms: [],
  untreatedFatal: false,
  vars: (rng, sev, pt) => {
    let risk = rng.pick(['postop', 'flight', 'bedrest']);
    if (pt.comorb.includes('cancer')) risk = 'cancer';
    else if (pt.sex === 'F' && pt.age < 50 && rng.chance(0.6)) risk = 'ocp';
    if (risk === 'ocp') pt.homeMeds.push('ocp');
    return {
      side: rng.pick(['右', '左']), days: rng.int(2, 5),
      riskText: { postop: '3週間前に股関節の手術を受けて、あまり歩いていません。', flight: '1週間前に海外から長時間の飛行機で帰ってきました。', bedrest: 'ぎっくり腰で1週間ほど寝たきりでした。', cancer: '大腸がんで抗がん剤の治療中です。', ocp: '避妊のためにピルを飲んでいます。' }[risk],
    };
  },
  cc: () => '片足のむくみと痛み',
  ccKey: 'leg_red',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '{days}日前から{side}足がむくんで、ふくらはぎが痛くなりました。' },
    course: { p: 1, text: 'だんだん腫れがひどくなっています。' },
    character: { p: 1, text: 'ふくらはぎが張って重く、歩くと痛いです。' },
    location: { p: 1, text: '{side}のふくらはぎから足首です。' },
    edema: { p: 1, text: '{side}足だけむくんでいます。' },
    immobility: { p: 1, text: '{riskText}' },
    trigger: { p: 1, text: '{riskText}' },
    fever: { p: 0.1, text: '37度台の微熱が少し。' },
    dyspnea: { p: 0, text: '' },
    chestpain: { p: 0, text: '' },
  },
  exam: {
    calf: { p: 1, text: '{side}下腿の腫脹と圧痛（ふくらはぎの周径差 3cm）。発赤・熱感は軽度。' },
    leg_edema: { p: 1, text: '{side}下腿のみ圧痕性浮腫。' },
    skin: { p: 0.4, text: '{side}下腿にわずかな色調変化（うっ血）。明らかな発赤・水疱なし。' },
  },
  vitals: { HR: { to: [80, 92], k: 1 } },
  labs: { DDIMER: { to: [4, 15], k: 0.2 }, CRP: { to: [0.5, 2], k: 1 } },
  tests: { leg_us: [{ p: 0.97, persist: true, text: '{side}膝窩静脈〜大腿静脈に血栓。プローブで圧迫しても静脈が潰れない。' }] },
  natural: 0.1,
  therapies: [
    { id: 'anticoag', label: '抗凝固療法（DOACやヘパリン）', req: { tag: 'anticoag' }, effect: -0.8, lagH: 2, required: true, deadlineH: [12, 8, 6] },
  ],
  harmTags: { abx: '深部静脈血栓症に抗菌薬は不要（蜂窩織炎との区別を）' },
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['admit'], best: 'admit', why: '広範な血栓・強い症状：入院でヘパリン' } : { ok: ['home', 'admit'], best: 'home', why: '肺塞栓の症状がなく安定していれば外来でDOAC（アピキサバン 10mg 1日2回7日間→5mg 1日2回）' }),
  useful: ['leg_us', 'coag', 'lab_DDIMER', 'cbc', 'chem', 'crp', 'chest_cta', 'ecg', 'uhcg'],
  key: [['leg_us'], ['chem', 'cbc']],
  extrasOk: () => [],
  teaching: [
    '片側の下腿の腫脹・圧痛（周径差）で、手術後・長時間の移動・寝たきり・がん・ピルなどのリスクがあれば深部静脈血栓症を疑う（Wellsスコア）。',
    '可能性が低ければDダイマー陰性で除外、高ければ下肢静脈エコー（圧迫しても潰れない静脈）で診断する。',
    '治療は抗凝固薬（DOAC：アピキサバン 10mg 1日2回を7日間、その後5mg 1日2回 など）。安定していれば外来治療も可能。',
    '息切れ・胸痛があれば肺塞栓症の合併を考える。',
    '蜂窩織炎と見分ける：発赤・熱感・発熱が乏しく、腫脹が主体。',
  ],
  sources: ['肺血栓塞栓症および深部静脈血栓症の診断、治療、予防に関するガイドライン（2017年改訂版）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['leg_us', 'cbc', 'chem', 'coag'] },
    { a: 'rx', drugId: 'apixaban', route: 'po', dose: 10, freq: 'q12h', days: 14 },
  ],
};
