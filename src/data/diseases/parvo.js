// 伝染性紅斑（成人のパルボウイルスB19感染症）
// 出典: 国立感染症研究所 IDWR「伝染性紅斑」
import { outpatient } from './common.js';
export default outpatient({
  id: 'parvo', name: 'パルボウイルスB19感染症（成人）', dept: '内科', weight: 2.5,
  demo: { age: [25, 45], ageMode: 'uniform', male: 0.2 },
  season: { spring: 1.5, summer: 1.3 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '両手の指や膝の関節が痛い', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '3日前から両手の指や手首、膝の関節が痛くて、朝こわばります。' },
    character: { p: 1, text: '両方の手指・手首・膝が左右対称に痛みます。足もむくんでいます。' },
    location: { p: 1, text: '両手の指・手首・膝です。' },
    joint: { p: 1, text: '両手の指の関節が少し腫れています。' },
    stiffness: { p: 1, text: '朝30分くらいこわばります。' },
    trigger: { p: 1, text: '2週間前、5歳の子どもがりんごのように頬が赤くなり、保育園でも流行っていました。' },
    fever: { p: 0.5, text: '1週間前に微熱がありました。' },
    pmh: { p: 0, text: '関節の病気は言われたことがありません。' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '両側の手指PIP関節・手関節・膝関節に軽い腫脹と圧痛。' }, skin: { p: 0.5, text: '四肢にレース状の淡い紅斑。' }, leg_edema: { p: 0.5, text: '両下腿の軽い浮腫。' } },
  labs: { WBC: { to: [3000, 4000], k: 0 }, PLT: { mul: [0.7, 0.85], k: 0 }, CRP: { to: [0.3, 1.0], k: 0 } },
  tests: { parvo: [{ p: 1, persist: true, text: 'パルボウイルスB19 IgM抗体 陽性。' }], rf_ccp: [{ p: 1, text: 'RF 弱陽性、抗CCP抗体 陰性。' }], ana: [{ p: 0.3, text: '抗核抗体 80倍。' }], uhcg: [{ p: 1, text: '陰性。', normal: true }] },
  natural: -0.05,
  therapies: [{ id: 'tx', label: '対症療法（NSAIDs）で数週以内に自然に治ることを説明、妊婦への接触に注意', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.2, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  useful: ['parvo', 'cbc', 'crp', 'rf_ccp', 'ana', 'uhcg', 'chem'], key: [['parvo']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'パルボウイルスB19感染症：対症療法で外来（数週で自然に改善）' }),
  teaching: [
    '子どものりんご病（伝染性紅斑）の流行後に、成人（特に母親）が左右対称の手指・手首・膝の関節炎とむくみを起こす → パルボウイルスB19感染症。関節リウマチと間違えやすい。',
    'IgM抗体で診断。RF弱陽性・抗核抗体陽性・白血球/血小板の減少がみられることもある。数週で自然に治る。',
    '妊婦が感染すると胎児水腫を起こすことがある。溶血性貧血の患者では無形成発作に注意。',
  ],
  sources: ['国立感染症研究所「伝染性紅斑とは」'],
  ideal: () => [{ a: 'test', ids: ['parvo', 'cbc', 'crp', 'rf_ccp'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
