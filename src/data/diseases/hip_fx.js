// 大腿骨近位部骨折（高齢者の転倒）
// 出典: 日本整形外科学会『大腿骨頚部/転子部骨折診療ガイドライン2021』
import { T } from './common.js';
export default {
  id: 'hip_fx', name: '大腿骨近位部骨折', dept: '整形外科',
  weight: 6, season: { winter: 1.3 }, minLevel: 1,
  demo: { age: [70, 98], ageMode: 'old', male: 0.25 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[20, 30], [30, 40], [40, 50]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { htn: 0.6, dementia: 0.3, ckd: 0.2, af: 0.12, dm2: 0.2 } },
  organisms: [],
  untreatedFatal: false,
  vars: (rng) => ({ side: rng.pick(['右', '左']), type: rng.pick(['頸部', '転子部']), how: rng.pick(['夜中にトイレに行こうとして', '玄関の段差につまずいて', '台所で足がもつれて']) }),
  cc: () => '転倒して足の付け根が痛い',
  ccKey: 'fall',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '今朝、{how}転んでしまいました。' },
    character: { p: 1, text: '{side}の足の付け根が痛くて、立てません。' },
    location: { p: 1, text: '{side}の足の付け根です。' },
    severity: { p: 1, text: '動かすと8くらい痛いです。' },
    dizziness: { p: 0.2, text: '転ぶ前に少しふらっとした気もします。' },
    chestpain: { p: 0, text: '' },
    lastnormal: { p: 1, text: '転ぶまでは普段通りでした。' },
    adl: { p: 1, text: '杖をついて自分で歩いていました。' },
    trigger: { p: 1, text: 'つまずいただけで、気を失ったわけではありません。' },
  },
  exam: {
    gen_appear: { p: 1, text: '痛みで動けない。意識は清明。' },
    hip: { p: 1, text: '{side}下肢が短縮し外旋している。{side}股関節に強い圧痛と運動時痛。' },
  },
  vitals: { HR: { to: [90, 105], k: 1 } },
  labs: { HB: { add: [-2, -0.8], k: 1 }, CK: { add: [100, 500], k: 1 } },
  tests: {
    hip_xr: [{ p: 0.92, persist: true, text: '{side}大腿骨{type}骨折（転位あり）。' }],
    abd_ct_plain: [{ p: 1, persist: true, text: '{side}大腿骨{type}骨折。腹腔内に明らかな異常なし。' }],
  },
  natural: 0,
  therapies: [
    T.pain([1, 1, 1], -0.2),
    T.proc('orif', '整形外科コンサルト→早期手術（48時間以内が目安）', [48, 48, 48]),
  ],
  dynamics: (enc) => (enc.state.procDone?.orif ? -1.2 : 0.05),
  curedBy: 'orif',
  procedures: [{
    id: 'orif', depts: ['ortho'], label: '手術', delay: 720, duration: 120, after: 'ward',
    decide: (enc) => {
      const xr = enc.tests.some((t) => ['hip_xr', 'abd_ct_plain'].includes(t.id) && t.done && t.result.abnormal);
      if (!xr) return { accept: false, text: '股関節のX線をお願いします。' };
      return { accept: true, reveal: true, text: '{side}大腿骨{type}骨折です。全身状態を評価し、明日の手術を予定します（術前に心電図・胸部X線・採血・抗凝固薬の確認を）。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 18); },
    doneText: '整形外科：{side}大腿骨{type}骨折の手術を行いました。翌日からリハビリを開始します。',
  }],
  harmTags: {},
  dispo: () => ({ ok: ['admit'], best: 'admit', why: '大腿骨近位部骨折：入院・早期手術・早期リハビリ' }),
  useful: ['hip_xr', 'abd_ct_plain', 'cbc', 'chem', 'coag', 'ecg', 'cxr', 'bs_poct', 'ua', 'head_ct'],
  key: [['hip_xr', 'abd_ct_plain']],
  extrasOk: () => [],
  teaching: [
    '高齢者の転倒後の股関節痛・歩行不能、患側下肢の短縮と外旋は大腿骨近位部骨折を疑う。',
    'X線で診断。見えにくい不顕性骨折もあり、疑わしければCT・MRI。',
    '鎮痛（アセトアミノフェン、腎機能に注意）を十分に行い、48時間以内の早期手術と早期リハビリが予後を改善する。',
    '「なぜ転んだか」も必ず評価する：失神・不整脈・低血糖・脳卒中・薬剤（降圧薬・睡眠薬）・脱水。',
    '骨粗鬆症の治療と転倒予防で次の骨折を防ぐ。',
  ],
  sources: ['大腿骨頚部/転子部骨折診療ガイドライン2021（日本整形外科学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['hip_xr', 'cbc', 'chem', 'coag', 'ecg'] },
    { a: 'rx', drugId: 'apap_iv', route: 'iv', dose: p.weight >= 50 ? 1000 : 600, freq: 'q6h', days: 3 },
    { a: 'consult', dept: 'ortho', delayMin: 25 },
  ],
};
