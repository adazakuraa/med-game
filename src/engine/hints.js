// 研修医モードのヒント生成（指導医のアドバイス）
import { DISEASE_BY_ID } from '../data/diseases/index.js';
import { DDX_BY_ID } from '../data/ddx.js';
import { QUESTION_BY_ID } from '../data/questions.js';
import { EXAM_BY_ID } from '../data/exams.js';
import { TEST_BY_ID } from '../data/tests.js';
import { LABS } from '../data/labs.js';
import { APPROACHES, DISEASE_NOTES } from '../data/teaching.js';
import { effects, currentVitals, isOrderActive } from './sim.js';
import { labValue } from './physiology.js';

export const MODES = {
  resident: { name: '研修医モード', short: '研修医', desc: 'おすすめ（★）と解説を表示。指導医にいつでも相談でき、薬剤師が処方をチェックしてくれる。', xp: 0.6 },
  senior: { name: '専攻医モード', short: '専攻医', desc: '★や解説は非表示。指導医への相談は回数に応じて減点。薬剤師は危険な処方だけ指摘する。', xp: 1.0 },
  expert: { name: '専門医モード', short: '専門医', desc: 'ヒントなし。すべて自分の判断で。経験値1.5倍。', xp: 1.5 },
};

export const approachOf = (enc) => APPROACHES[DISEASE_BY_ID[enc.patient.diseaseId].ccKey];

export function recommended(enc) {
  const a = approachOf(enc);
  if (!a) return { q: new Set(), e: new Set(), t: new Set() };
  const female = enc.patient.sex === 'F' && enc.patient.age >= 12 && enc.patient.age <= 55;
  return {
    q: new Set(a.keyQ.filter((id) => id !== 'lmp' || female)),
    e: new Set(a.keyE.filter((id) => !(EXAM_BY_ID[id]?.male && enc.patient.sex !== 'M') && !(EXAM_BY_ID[id]?.female && enc.patient.sex !== 'F'))),
    t: new Set(a.keyT.filter((id) => id !== 'uhcg' || female)),
  };
}

// ---- 手がかりの評価 ----
function clueHit(enc, clue) {
  if (clue.startsWith('!')) return -clueHit(enc, clue.slice(1)); // 「〜がない・陰性」が支持所見
  const [type, id] = clue.split(':');
  if (type === 'q') return enc.asked[id]?.positive ? 1 : enc.asked[id] ? -1 : 0;
  if (type === 'e') return enc.examined[id]?.abnormal ? 1 : enc.examined[id] ? -1 : 0;
  if (type === 't') {
    const x = [...enc.tests].reverse().find((t) => t.id === id && t.done);
    return x ? (x.result.abnormal ? 1 : -1) : 0;
  }
  if (type === 'H' || type === 'L') {
    let found = 0;
    for (const t of enc.tests) {
      if (!t.done || !t.result.items) continue;
      const it = t.result.items.find((i) => i.id === id);
      if (it) found = it.flag === type ? 1 : -1;
    }
    return found;
  }
  return 0;
}

function clueLabel(clue) {
  if (clue.startsWith('!')) return `${clueLabel(clue.slice(1))}（なし・陰性）`;
  const [type, id] = clue.split(':');
  if (type === 'q') return QUESTION_BY_ID[id].text.replace(/[？?]$/, '');
  if (type === 'e') return EXAM_BY_ID[id].name;
  if (type === 't') return TEST_BY_ID[id].name;
  return `${LABS[id].name}${type === 'H' ? '高値' : '低値'}`;
}

/** 主訴の鑑別リストに、これまでに得た所見を当てはめる */
export function ddxReasoning(enc) {
  const a = approachOf(enc);
  if (!a) return [];
  return a.ddx.map((d) => {
    const pro = [], con = [], unknown = [];
    for (const c of d.clues || []) {
      const h = clueHit(enc, c);
      if (h > 0) pro.push(clueLabel(c));
      else if (h < 0) con.push(clueLabel(c));
      else unknown.push(clueLabel(c));
    }
    return { id: d.id, name: DDX_BY_ID[d.id].name, point: d.point, pro, con, unknown };
  }).sort((x, y) => score(y) - score(x));
}

// 支持所見がまったくない鑑別は下位に
function score(x) {
  return x.pro.length - 0.6 * x.con.length - (x.pro.length === 0 ? 0.5 : 0);
}

// ---- 次にやるべきこと ----
export function nextSteps(enc) {
  const out = [];
  const v = currentVitals(enc);
  const eff = effects(enc);
  const p = enc.patient;
  const rec = recommended(enc);
  const nAsked = Object.keys(enc.asked).length;
  const nExam = Object.keys(enc.examined).length;
  const orders = enc.orders.filter((o) => isOrderActive(enc, o));
  const anyRx = enc.orders.some((o) => o.kind === 'rx');
  const fever = ['fever_cough', 'fever_flank'].includes(DISEASE_BY_ID[p.diseaseId].ccKey);

  // 1. 緊急度の高いもの（ABC）
  if (v.SpO2 < 90 && !eff.o2Device) out.push({ pri: 0, text: `SpO2 ${v.SpO2}%：低酸素です。まず酸素を開始しよう（治療→酸素）。` });
  if (v.SBP < 90 && enc.state.ivCryst < 500 && !orders.some((o) => o.kind === 'fluid')) out.push({ pri: 0, text: `血圧 ${v.SBP}/${v.DBP}：ショックの可能性。細胞外液（乳酸リンゲルや生理食塩液）を急速投与しよう（治療→輸液）。` });
  if (v.JCS > 0 && !enc.tests.some((t) => ['vbg', 'chem', 'lab_GLU'].includes(t.id))) out.push({ pri: 0, text: '意識障害があります。低血糖などをすぐ除外するため、血液ガス（血糖も測れる）を出そう。' });
  if (enc.state.anaphylaxis && !enc.state.anaphylaxis.resolved && enc.t >= enc.state.anaphylaxis.t) out.push({ pri: 0, text: 'アナフィラキシーです！ 原因の薬を中止し、アドレナリン 0.5mg を筋注しよう。' });

  if (enc.phase === 'er') {
    if (nAsked < 4) out.push({ pri: 1, text: '問診から始めよう。★の質問がこの主訴で重要な質問です。いつから・どんな症状か（OPQRST）を聞こう。' });
    else {
      const missQ = [...rec.q].filter((id) => !enc.asked[id]);
      if (missQ.length > 3) out.push({ pri: 2, text: `まだ聞いていない重要な質問があります：${missQ.slice(0, 3).map((id) => '「' + QUESTION_BY_ID[id].text + '」').join('、')}` });
    }
    if (!enc.asked.allergy && nAsked >= 2) out.push({ pri: 2, text: '薬を使う前にアレルギーと内服薬を必ず確認しよう（問診→既往・薬）。' });
    if (p.sex === 'F' && p.age >= 12 && p.age <= 55 && !enc.asked.lmp && nAsked >= 3) out.push({ pri: 2, text: '妊娠可能年齢の女性です。妊娠の可能性を確認しよう（薬や検査の選び方が変わる）。' });
    if (nAsked >= 3 && nExam < 3) out.push({ pri: 2, text: '身体診察をしよう。★の診察がこの主訴で重要です。' });
    if (nAsked >= 3 && !enc.tests.length) out.push({ pri: 2, text: '検査をオーダーしよう。★の検査がこの主訴の基本セットです。結果が出るまで時間がかかるので早めに。' });
    if (enc.tests.some((t) => !t.done) && enc.ddx.length < 2) out.push({ pri: 3, text: '結果を待つ間に、鑑別タブで考えられる病気を挙げておこう（ヒントの「所見から考える」も参考に）。' });
    if (fever && !anyRx && !enc.tests.some((t) => ['bcx', 'ucx', 'sputum_cx'].includes(t.id)) && enc.tests.length) out.push({ pri: 2, text: '感染症を疑うなら、抗菌薬を始める前に培養（血液・尿・痰）を採っておこう。' });
    if (enc.tests.some((t) => t.done && !t.viewed)) out.push({ pri: 3, text: '新しい検査結果が出ています。検査タブで確認しよう。' });
    if (enc.tests.filter((t) => t.done).length >= 2 && enc.ddx.length && !enc.finalDx) out.push({ pri: 3, text: '情報がそろってきたら、鑑別タブで最も考えやすい病気を最終診断に決めよう。' });
    if (enc.finalDx && !anyRx && !orders.length) out.push({ pri: 2, text: '診断が決まったら治療を始めよう。迷ったらヒントの「治療の考え方」を見よう。' });
    if (enc.finalDx && (anyRx || orders.length) && !enc.dispo) out.push({ pri: 4, text: '治療を始めたら、方針（帰宅・一般病棟・ICU）を決めよう（治療→方針決定）。' });
  } else if (enc.phase === 'ward' || enc.phase === 'icu') {
    const insulin = (eff.tags.insulin || 0) > 0;
    if (insulin && !enc.tests.some((t) => ['vbg', 'chem', 'lab_K'].includes(t.id) && enc.t - t.orderT < 150)) out.push({ pri: 1, text: 'インスリン投与中は1〜2時間ごとに血液ガス（K・血糖）を確認しよう。' });
    if (insulin && labValue(enc, 'K', {}) < 5.0 && !eff.tags.potassium && !eff.kRate) out.push({ pri: 2, text: 'インスリンでKは下がっていきます。K<5.0ならKClの補充を考えよう（検査で確認してから）。' });
    if (insulin && enc.state.glu < 250 && eff.dextroseGph < 3) out.push({ pri: 2, text: '血糖が下がってきたら、インスリンは続けたまま5%ブドウ糖を追加しよう（低血糖の予防）。' });
    if (!enc.tests.some((t) => enc.t - t.orderT < 24 * 60)) out.push({ pri: 3, text: '1日1回くらいは採血（血算・生化学・CRPなど）で治療効果と副作用を確認しよう。' });
    out.push({ pri: 4, text: '「翌朝へ」や「自動経過」で時間を進めて、バイタルと検査の推移を見よう。悪化したら診断と治療を見直す。' });
    if (enc.state.burden < 12) out.push({ pri: 1, text: '状態が安定してきました。抗菌薬などを内服に切り替えて退院を考えよう（退院後も続ける薬を処方してから）。' });
  }
  return out.sort((a, b) => a.pri - b.pri).slice(0, 4);
}

/** 患者の重症度スコアなど方針決定の考え方（答えは言わない） */
export function treatmentThinking(enc) {
  const top = [...enc.ddx].sort((a, b) => b.conf - a.conf)[0];
  const fd = enc.finalDx?.ids?.[0];
  const id = fd || top?.id;
  if (!id) return { id: null, text: ['まず鑑別診断を挙げて、いちばん考えやすい病気を決めよう。治療は診断に基づいて選ぶ。'] };
  const notes = DISEASE_NOTES[id];
  if (!notes) return { id, text: [`「${DDX_BY_ID[id].name}」の治療ガイドはまだこのゲームに収録されていません。診断をもう一度見直してみよう。`] };
  return { id, text: notes.treatment };
}

/** 指導医の答え（正解） */
export function attendingAnswer(enc) {
  const d = DISEASE_BY_ID[enc.patient.diseaseId];
  const notes = DISEASE_NOTES[d.id];
  const ctx = { initVit: enc.initVit, initLab: (id) => enc.initLabs[id] };
  const dp = d.dispo(enc, ctx);
  const reasons = ddxReasoning(enc).find((x) => x.id === d.id);
  return {
    name: d.name,
    reasons: reasons ? reasons.pro : [],
    look: reasons ? reasons.unknown.slice(0, 5) : [],
    overview: notes?.overview,
    treatment: notes?.treatment || [],
    dispo: `${{ home: '帰宅（外来治療）', admit: '一般病棟に入院', icu: 'ICUに入院' }[dp.best]}：${dp.why}`,
  };
}
