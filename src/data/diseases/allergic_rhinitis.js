// アレルギー性鼻炎（花粉症）
// 出典: 鼻アレルギー診療ガイドライン2024（日本耳鼻咽喉科免疫アレルギー感染症学会）
import { outpatient } from './common.js';
export default outpatient({
  id: 'allergic_rhinitis', name: 'アレルギー性鼻炎（花粉症）', dept: '耳鼻咽喉科', weight: 6, season: { other: 2.5, winter: 0.6, summer: 0.4 },
  demo: { age: [16, 60], ageMode: 'young', male: 0.45 },
  cc: () => 'くしゃみと鼻水', ccKey: 'nasal',
  history: {
    onset: { p: 1, text: '2週間前から毎年この時期になると、くしゃみと鼻水が止まりません。' },
    character: { p: 1, text: 'くしゃみが連発して、水のような鼻水と鼻づまり、目のかゆみがあります。' },
    sorethroat: { p: 1, text: '透明でサラサラした鼻水が止まりません。喉は痛くありません。' },
    fever: { p: 0, text: '' }, cough: { p: 0.2, text: '少し咳が出ます。' },
    trigger: { p: 1, text: '毎年春になると同じ症状が出ます。外に出るとひどくなります。' },
    pmh: { p: 0.5, text: '子どもの頃にアトピー性皮膚炎がありました。' },
  },
  exam: { pharynx: { p: 0.3, text: '咽頭の発赤はない。鼻粘膜は蒼白で腫脹し、水様性の鼻汁。' }, conjunctiva: { p: 0.6, text: '眼球結膜の充血。' } },
  natural: -0.03,
  therapies: [{ id: 'antihistamine', label: '第2世代抗ヒスタミン薬（必要なら鼻噴霧用ステロイド）', req: { tag: 'antihistamine' }, effect: -0.5, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { abx: 'アレルギー性鼻炎に抗菌薬は無効' },
  useful: [], key: [],
  teaching: [
    '毎年同じ季節に、くしゃみ・水様性鼻汁・鼻閉・目のかゆみが出て、発熱や咽頭痛がなければアレルギー性鼻炎（花粉症）。',
    '治療は眠気の少ない第2世代抗ヒスタミン薬、鼻噴霧用ステロイド。抗菌薬は不要。',
    '膿性鼻汁・顔面痛・発熱が続けば急性副鼻腔炎を考える。',
  ],
  sources: ['鼻アレルギー診療ガイドライン2024'],
  ideal: () => [{ a: 'rx', drugId: 'fexofenadine', route: 'po', dose: 60, freq: 'q12h', days: 14 }],
});
