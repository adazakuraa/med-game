// 薬疹（播種状紅斑丘疹型）
// 出典: 日本皮膚科学会『重症多形滲出性紅斑 スティーヴンス・ジョンソン症候群・中毒性表皮壊死症 診療ガイドライン』, 薬疹の診療指針
import { outpatient } from './common.js';
export default outpatient({
  id: 'drug_eruption', name: '薬疹', dept: '皮膚科', weight: 3,
  demo: { age: [25, 80], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ drug: rng.pick(['抜歯の後に抗菌薬（アモキシシリン）', '膀胱炎で抗菌薬（レボフロキサシン）', '歯の痛みで痛み止め（ロキソプロフェン）']), d: rng.int(5, 10) }),
  cc: () => '全身に赤い発疹が出た', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '{d}日前から{drug}を飲み始め、昨日から体に赤いブツブツが出て広がっています。' },
    character: { p: 1, text: '胸やお腹、腕に赤い細かい発疹が広がっています。少しかゆいです。' },
    location: { p: 1, text: '体幹から手足に広がっています。' },
    itch: { p: 1, text: '少しかゆいです。' },
    meds: { p: 1, text: '{d}日前から{drug}を飲んでいます。' },
    trigger: { p: 1, text: '新しい薬はそれだけです。' },
    fever: { p: 0.3, text: '微熱があります。' },
    sickcontact: { p: 0, text: '' },
    dyspnea: { p: 0, text: '息苦しさはありません。' },
  },
  exam: { skin: { p: 1, text: '体幹・四肢に左右対称性の小さな紅斑・丘疹が多発し、一部融合。水疱・びらんはない。口唇・眼・陰部の粘膜疹はない。' } },
  natural: 0.05,
  therapies: [{ id: 'stop', label: '原因薬の中止と、抗ヒスタミン薬・ステロイド外用（重症薬疹のサインを確認）', req: { anyTag: ['antihistamine', 'topical_steroid', 'steroid_sys'] }, effect: -0.5, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc', 'chem', 'crp'], key: [['cbc'], ['chem']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '軽症の薬疹：原因薬を中止し外来で治療（お薬手帳に記録）。発熱・粘膜疹・水疱が出たらすぐ再診' }),
  teaching: [
    '新しい薬を飲み始めて数日〜2週間で出る、左右対称の小さな紅斑・丘疹が全身に広がるのは薬疹（播種状紅斑丘疹型）が多い。原因は抗菌薬・解熱鎮痛薬・抗てんかん薬など。',
    '高熱・粘膜疹（口唇・眼・陰部のただれ）・水疱・皮膚の剥離・皮膚の痛みはスティーブンス・ジョンソン症候群／中毒性表皮壊死症（SJS/TEN）の危険なサイン。好酸球増多・肝障害・リンパ節腫脹はDIHS（薬剤性過敏症症候群）。',
    '治療は原因薬の中止。軽症は抗ヒスタミン薬・ステロイド外用、重症は入院でステロイド全身投与など。',
    'お薬手帳に記録し、同じ系統の薬を避ける。',
  ],
  sources: ['重症多形滲出性紅斑 SJS/TEN 診療ガイドライン（日本皮膚科学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem'] }, { a: 'rx', drugId: 'fexofenadine', route: 'po', dose: 60, freq: 'q12h', days: 7 }, { a: 'rx', drugId: 'steroid_oint', route: 'top', dose: 1, freq: 'q12h', days: 7 }],
});
