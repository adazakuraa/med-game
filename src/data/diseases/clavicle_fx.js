// 鎖骨骨折
// 出典: 日本整形外科学会 症状・病気をしらべる「鎖骨骨折」
import { outpatient } from './common.js';
export default outpatient({
  id: 'clavicle_fx', name: '鎖骨骨折', dept: '整形外科', weight: 3,
  demo: { age: [15, 45], ageMode: 'young', male: 0.75 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['自転車で転んで肩から落ちた', 'ラグビーで肩から地面にぶつかった', 'スノーボードで転んで手をついた']) }),
  cc: (v) => `${v.side}鎖骨を打って痛い`, ccKey: 'injury',
  history: {
    onset: { p: 1, text: '2時間前、{how}ときに{side}肩を打ちました。' },
    character: { p: 1, text: '鎖骨のあたりが痛くて、腕を上げられません。腕を反対の手で支えています。' },
    location: { p: 1, text: '{side}鎖骨の真ん中あたりです。' },
    aggravating: { p: 1, text: '腕を動かすと痛いです。' },
    trigger: { p: 1, text: '{how}ときです。頭は打っていません。' },
    syncope: { p: 0, text: '' }, numbness: { p: 0, text: '指のしびれはありません。' }, pmh: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}鎖骨中央部の変形・腫脹と強い圧痛、骨折部の轢音。皮膚の突き上げ・開放創はない。手指の運動・感覚、橈骨動脈は正常。' }, chest_palp: { p: 0, text: '肋骨の圧痛なし。' }, lung_ausc: { p: 0, text: '呼吸音の左右差なし。' } },
  tests: { joint_xr: [{ p: 1, persist: true, text: '{side}鎖骨中央1/3の骨折、軽い転位。' }], cxr: [{ p: 1, text: '気胸なし。', normal: true }] },
  natural: -0.01,
  therapies: [
    { id: 'tx', label: '三角巾（鎖骨バンド）固定と鎮痛', req: { fn: (enc, eff) => !!enc.state.procs?.splint && ((eff.tags.analgesic || 0) + (eff.tags.nsaid || 0)) > 0 }, effect: -0.3, lagH: 1, required: true, deadlineH: [6, 6, 6] },
    { id: 'ortho', label: '整形外科外来でフォロー（転位が大きい・皮膚を突き上げる・開放骨折は手術）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ortho') }, effect: -0.1, lagH: 6, required: true, deadlineH: [48, 48, 48] },
  ],
  consult: { ortho: '整形外科：転位の少ない鎖骨骨幹部骨折です。三角巾（または鎖骨バンド）で固定し、1週間後に外来でX線を確認します。短縮・転位が大きい場合や、早期のスポーツ復帰を希望する場合は手術も検討します。' },
  useful: ['joint_xr', 'cxr'], key: [['joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '鎖骨骨折：三角巾固定・鎮痛で帰宅し、整形外科外来でフォロー' }),
  teaching: [
    '肩から転ぶ・手をつく外傷の後の鎖骨の変形・圧痛・轢音は鎖骨骨折。中央1/3に多い。',
    '開放骨折・皮膚の突き上げ、神経血管損傷、気胸を確認する。',
    '多くは三角巾・鎖骨バンドで保存的に治る。転位・短縮が大きい場合は手術。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「鎖骨骨折」'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'proc', id: 'splint' }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }, { a: 'consult', dept: 'ortho', delayMin: 1 }, { a: 'wait', min: 70 }],
});
