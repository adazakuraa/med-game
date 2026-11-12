// 外傷性頸部症候群（むち打ち損傷）
// 出典: 日本整形外科学会 資料, Canadian C-spine rule (Stiell IG, et al. JAMA 2001)
import { outpatient } from './common.js';
export default outpatient({
  id: 'whiplash', name: '外傷性頸部症候群（むち打ち）', dept: '整形外科', weight: 4,
  demo: { age: [20, 60], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '追突事故の後から首が痛い', ccKey: 'injury',
  history: {
    onset: { p: 1, text: '昨日、信号待ちで後ろから追突されました。今朝起きたら首が痛くて回しにくいです。' },
    character: { p: 1, text: '首の後ろから肩にかけて重く痛み、首を動かすと痛みます。' },
    location: { p: 1, text: '首の後ろから両肩です。' },
    aggravating: { p: 1, text: '首を回したり、上を向いたりすると痛みます。' },
    trigger: { p: 1, text: '時速20kmくらいの追突です。事故の後は自分で車から降りて歩けました。頭は打っていません。' },
    numbness: { p: 0, text: '手のしびれや力が入らないことはありません。' }, syncope: { p: 0, text: '気は失っていません。' },
    pmh: { p: 0, text: '' }, meds: { p: 0, text: '' }, headache: { p: 0.4, text: '少し頭が重いです。' },
  },
  exam: { spine: { p: 1, text: '後頸部〜僧帽筋の筋の圧痛とこわばり。頸椎の正中（棘突起）の圧痛なし。左右に45°以上首を回せる。' }, motor: { p: 0, text: '上下肢の麻痺・感覚障害なし、腱反射正常。' }, gen_consc: { p: 0, text: '意識清明。' } },
  tests: { spine_xr: [{ p: 1, text: '頸椎に骨折・脱臼なし。生理的前弯の軽い減少。', normal: true }] },
  natural: -0.05,
  therapies: [{ id: 'tx', label: '鎮痛（NSAIDs・アセトアミノフェン）と、できる範囲で普段どおり動く（長期のカラー固定は避ける）', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.3, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  useful: ['spine_xr'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'むち打ち損傷：鎮痛と早期の活動再開で外来（しびれ・麻痺が出たらすぐ受診）' }),
  teaching: [
    '追突事故の翌日から出る首の痛み・こわばりは外傷性頸部症候群（むち打ち）。多くは数週〜数か月で改善する。',
    'Canadian C-spine rule：危険因子（65歳以上・危険な受傷機転・四肢のしびれ）がなく、低リスク所見があり首を左右45°回せればX線は不要。',
    '神経症状（しびれ・麻痺）・正中の圧痛があれば頸椎損傷を画像で除外。長期のカラー固定は回復を遅らせる。',
  ],
  sources: ['Stiell IG, et al. The Canadian C-spine rule for radiography in alert and stable trauma patients. JAMA 2001'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
