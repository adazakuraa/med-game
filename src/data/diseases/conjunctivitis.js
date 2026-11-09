// 流行性角結膜炎（アデノウイルス）
// 出典: 日本眼科学会『アデノウイルス結膜炎院内感染対策ガイドライン』, 学校保健安全法
import { outpatient } from './common.js';
export default outpatient({
  id: 'conjunctivitis', name: '流行性角結膜炎（はやり目）', dept: '眼科', weight: 4,
  demo: { age: [18, 60], ageMode: 'young', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), d: rng.int(2, 5) }),
  cc: () => '目が赤くてゴロゴロする', ccKey: 'red_eye',
  history: {
    onset: { p: 1, text: '{d}日前に{side}目が赤くなり、昨日から反対の目も赤くなりました。' },
    character: { p: 1, text: '目がゴロゴロして、涙と目やにが多いです。' },
    vision: { p: 0.2, text: '少しかすみますが、見えています。' },
    sickcontact: { p: 1, text: '職場で同じように目が赤い人がいます。' },
    itch: { p: 0.3, text: '少しかゆいです。' },
    sorethroat: { p: 0.3, text: '数日前に少し喉が痛かったです。' },
    headache: { p: 0, text: '' }, nausea: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '両眼の結膜充血（{side}に強い）、水様の眼脂、瞼結膜の濾胞。角膜は透明で瞳孔は正円・対光反射正常。' }, neck_ln: { p: 0.7, text: '耳前リンパ節の腫脹と圧痛。' } },
  tests: { adeno_ag: { p: 0.75 } },
  natural: -0.15,
  therapies: [],
  useful: ['adeno_ag', 'iop'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '流行性角結膜炎：特効薬はなく対症療法。感染力が強いので手洗い・タオルの共用禁止、出勤・登校は医師の許可まで控える' }),
  teaching: [
    '急な両眼（片眼から始まり反対側へ）の充血・流涙・眼脂・異物感と耳前リンパ節の腫脹は流行性角結膜炎（アデノウイルス）。',
    '感染力が非常に強い。手洗い・タオルの共用禁止・目を触らない。医療機関内での院内感染に注意（診察器具の消毒）。',
    '特効薬はなく、抗菌点眼は不要（細菌の混合感染予防に使うことはある）。角膜に混濁が残れば眼科でステロイド点眼。',
    '目の痛み・視力低下・角膜混濁・瞳孔異常があれば急性緑内障発作・角膜炎・ぶどう膜炎などを考えて眼科へ。',
  ],
  sources: ['アデノウイルス結膜炎院内感染対策ガイドライン（日本眼科学会）'],
  ideal: () => [{ a: 'test', ids: ['adeno_ag'] }],
});
