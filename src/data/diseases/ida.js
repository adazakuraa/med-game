// 鉄欠乏性貧血
// 出典: 日本鉄バイオサイエンス学会『鉄剤の適正使用による貧血治療指針 第3版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ida', name: '鉄欠乏性貧血', weight: 6,
  demo: { age: [20, 50], ageMode: 'young', male: 0.1 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[20, 28], [28, 36], [36, 44]] },
  vars: (rng, sev) => ({ hbDrop: [3, 5, 7][sev] + rng.range(0, 1) }),
  initHbLoss: (p) => p.vars.hbDrop,
  cc: () => 'だるさと動悸', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '数か月前から、だんだん疲れやすくなりました。' },
    character: { p: 1, text: '階段を上ると息が切れて、ドキドキします。' },
    fatigue: { p: 1, text: 'とにかくだるくて、疲れやすいです。' },
    palpitation: { p: 0.8, text: '階段で動悸がします。' },
    dyspnea: { p: 0.6, text: '少し動くと息が切れます。' },
    dizziness: { p: 0.5, text: '立ちくらみがします。' },
    menses: { p: 1, text: '生理の量がとても多くて、レバーのような塊も出ます。' },
    bloodystool: { p: 0, text: '' },
    weightloss: { p: 0, text: '' },
    diet: { p: 0.6, text: 'ダイエット中で、食事を減らしています。' },
    trigger: { p: 0.4, text: '最近、氷をよくかじりたくなります。' },
  },
  exam: { conjunctiva: { p: 0.9, text: '眼瞼結膜は蒼白。' }, skin: { p: 0.3, text: '爪がスプーン状に反っている（匙状爪）。' }, heart_ausc: { p: 0.4, text: '胸骨左縁に収縮期雑音（機能性）。' } },
  vitals: { HR: { to: [95, 110], k: 1 } },
  labs: { MCV: { add: [-22, -14], k: 0.2 }, FER: { to: [2, 6], k: 0.1 }, PLT: { mul: [1.2, 1.5], k: 0.5 } },
  natural: 0,
  therapies: [{ id: 'iron', label: '鉄剤の内服', req: { tag: 'iron' }, effect: -0.2, lagH: 24, required: true, deadlineH: [48, 48, 24] }],
  dynamics: (enc, eff) => { if (eff.tags.iron && enc.state.hbLoss > 0) enc.state.hbLoss -= 0.015 / 6; return 0; },
  useful: ['cbc', 'ferritin', 'chem', 'uhcg', 'fobt', 'thyroid', 'tvus'], key: [['cbc'], ['ferritin']],
  teaching: [
    '若い女性の疲れやすさ・動悸・息切れは貧血を考える。小球性（MCV低値）＋フェリチン低値なら鉄欠乏性貧血。',
    '原因を必ず探す：女性は過多月経（子宮筋腫など）、男性や閉経後女性は消化管出血（がん）を疑い内視鏡を。',
    '治療は鉄剤の内服（Hbが正常化した後もフェリチンが回復するまで続ける）。氷食症・匙状爪も鉄欠乏の手がかり。',
  ],
  sources: ['鉄剤の適正使用による貧血治療指針 第3版（日本鉄バイオサイエンス学会）'],
  ideal: (p) => [{ a: 'test', ids: ['cbc', 'ferritin', 'chem'] }, { a: 'rx', drugId: 'ferrous', route: 'po', dose: 100, freq: 'q24h', days: 14 }],
});
