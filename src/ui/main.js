// メディカル・ローテーション UI（スマートフォン向け）
import * as S from '../engine/sim.js';
import { scoreCase, OUTCOME_LABEL } from '../engine/scoring.js';
import { labValue, crcl } from '../engine/physiology.js';
import { Q_CATS, QUESTIONS } from '../data/questions.js';
import { EXAM_REGIONS, EXAMS } from '../data/exams.js';
import { TEST_CATS, TESTS, TEST_BY_ID } from '../data/tests.js';
import { LABS, refFor } from '../data/labs.js';
import { DDX, DDX_CATS, DDX_BY_ID } from '../data/ddx.js';
import { DRUGS, DRUG_BY_ID, FLUIDS, FREQS, ROUTE_LABEL, O2_DEVICES } from '../data/drugs.js';
import { DISEASE_BY_ID } from '../data/diseases/index.js';
import { COMORB } from '../engine/patient.js';
import { load, save, resetSave, levelOf, levelProgress } from './store.js';
import { MODES, recommended, nextSteps, ddxReasoning, treatmentThinking, attendingAnswer, approachOf } from '../engine/hints.js';
import { PROC_ROLE, QUESTION_WHY, EXAM_WHY, TEST_WHY, LAB_MEANING, DRUG_ROLE, FLUID_ROLE, O2_ROLE, DEPT_ROLE, APPROACHES, DISEASE_NOTES } from '../data/teaching.js';
import { evaluateRx, evaluateFluid } from '../engine/pharm.js';
import { DISEASES } from '../data/diseases/index.js';

const $app = document.getElementById('app');
const $modal = document.getElementById('modal-root');

let game = load();
const ui = { libTab: 'dz', screen: game.enc ? (game.enc.ended ? 'debrief' : 'encounter') : 'title', tab: 'q', qcat: 'hpi', region: 'general', tcat: 'blood', sel: new Set(), modal: null, paused: false };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');

function clockOf(enc, t = enc.t) {
  const m = enc.patient.startHour * 60 + enc.patient.startMin + t;
  const day = Math.floor(m / 1440) + 1;
  return `Day${day} ${pad(Math.floor((m % 1440) / 60))}:${pad(m % 60)}`;
}
function elapsed(min) {
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  return h >= 24 ? `${Math.floor(h / 24)}日${h % 24}時間` : `${h}:${pad(m)}`;
}
const sexJ = (s) => (s === 'M' ? '男性' : '女性');

function persist() { save(game); }
const modeOf = () => game.enc?.mode || 'expert';
const isRes = () => modeOf() === 'resident';
const hintsOn = () => modeOf() !== 'expert';
const star = (on) => (on ? '<span class="star">★</span>' : '');

// ========== 描画 ==========
function render() {
  const y = window.scrollY;
  const key = ui.screen + ui.tab;
  let html = '';
  if (ui.screen === 'title') html = viewTitle();
  else if (ui.screen === 'arrival') html = viewArrival();
  else if (ui.screen === 'encounter') html = viewEncounter();
  else if (ui.screen === 'debrief') html = viewDebrief();
  else if (ui.screen === 'records') html = viewRecords();
  else if (ui.screen === 'help') html = viewHelp();
  else if (ui.screen === 'library') html = viewLibrary();
  $app.innerHTML = html;
  renderModal();
  if (render.lastKey === key) window.scrollTo(0, y); else window.scrollTo(0, 0);
  render.lastKey = key;
  const tb = document.querySelector('.topbar');
  if (tb) document.documentElement.style.setProperty('--topbar-h', tb.offsetHeight + 'px');
  setupRealtime();
}

function viewTitle() {
  const lv = levelOf(game.profile.xp);
  const pr = levelProgress(game.profile.xp);
  const enc = game.enc;
  return `<div class="screen">
    <div class="hero"><div class="logo">🩺</div><h1>メディカル・ローテーション</h1>
    <div class="sub">救急外来に来た患者を、あなたの臨床推論で救え</div></div>
    <div class="card">
      <div class="row"><b class="grow">研修医 レベル ${lv}</b><span class="sub">${game.profile.xp} XP</span></div>
      <div class="xpbar"><i style="width:${Math.round(pr * 100)}%"></i></div>
      <div class="sub small">ローテーション：内科（救急外来）｜診療した患者 ${game.profile.cases.length}人</div>
    </div>
    ${enc && !enc.ended ? `<button class="btn primary block" data-a="resume">▶ 診療を再開（${esc(enc.patient.name)}さん）</button>` : ''}
    <button class="btn ${enc && !enc.ended ? '' : 'primary'} block" data-a="newcase">🚑 次の患者を呼ぶ</button>
    <div class="card"><b>難易度</b>
      <div class="row wrap" style="margin-top:6px">${Object.entries(MODES).map(([k, m]) => `<button class="chip ${game.settings.mode === k ? 'on' : ''}" data-a="mode" data-v="${k}">${m.short}</button>`).join('')}</div>
      <div class="sub small" style="margin-top:4px">${esc(MODES[game.settings.mode].desc)}</div>
      ${enc && !enc.ended ? '<div class="sub small">※ 変更は次の患者から反映されます。</div>' : ''}
    </div>
    <div class="grid3"><button class="btn" data-a="library">📚 医学ノート</button><button class="btn" data-a="records">📋 記録</button><button class="btn" data-a="help">📖 遊び方</button></div>
    <div class="card">
      <div class="toggle"><div><b>緊迫モード</b><div class="sub small">重症の救急搬送ではリアルタイムで時間が進む</div></div><button class="switch ${game.settings.realtime ? 'on' : ''}" data-a="toggle-rt" aria-label="緊迫モード"></button></div>
    </div>
    <button class="btn block danger" data-a="reset">セーブデータを消去</button>
    <p class="disclaimer">本ゲームは医療教育・エンターテインメントを目的としたシミュレーションです。実在の患者の診断・治療には使用しないでください。薬剤情報は添付文書等を要約したものであり、実際の処方には必ず最新の添付文書を確認してください。</p>
  </div>`;
}

function viewArrival() {
  const enc = game.enc, p = enc.patient, v = enc.lastVitals.v;
  return `<div class="screen">
    <h2>${p.arrival === 'ambulance' ? '🚑 救急車が到着しました' : '🚶 外来に患者が来ました'}</h2>
    <div class="ptcard">
      <div class="nm">${esc(p.name)} さん</div>
      <div>${p.age}歳 ${sexJ(p.sex)}・体重 ${p.weight}kg</div>
      <dl class="kv"><dt>来院</dt><dd>${clockOf(enc, 0)}（${p.arrival === 'ambulance' ? '救急搬送' : '独歩'}）</dd>
      <dt>主訴</dt><dd><b>${esc(p.cc)}</b></dd>
      <dt>トリアージ</dt><dd>T ${v.T}℃ / HR ${v.HR} / BP ${v.SBP}/${v.DBP} / RR ${v.RR} / SpO2 ${v.SpO2}%（室内気）/ JCS ${v.JCS}</dd></dl>
    </div>
    ${enc.urgent && game.settings.realtime ? '<div class="card" style="border-color:var(--bad)"><b>⚠ 緊迫モード</b><div class="sub">重症患者です。診察中もリアルタイムで時間が進みます（4秒でゲーム内1分）。</div></div>' : ''}
    <button class="btn primary block" data-a="start">診察を開始する</button>
    <button class="btn block" data-a="title">タイトルへ</button>
  </div>`;
}

// ---------- 診療画面 ----------
function vitClass(k, v) {
  if (k === 'SpO2' && v < 92) return 'alarm';
  if (k === 'SBP' && v < 90) return 'alarm';
  if (k === 'HR' && (v > 120 || v < 45)) return 'alarm';
  if (k === 'RR' && v >= 25) return 'alarm';
  if (k === 'T' && v >= 38.5) return 'alarm';
  if (k === 'JCS' && v > 0) return 'alarm';
  return '';
}

function topbar() {
  const enc = game.enc, p = enc.patient, lv = enc.lastVitals;
  const v = lv.v;
  const pend = enc.tests.filter((x) => !x.done).length;
  const act = enc.orders.filter((o) => S.isOrderActive(enc, o)).length;
  const disc = Math.min(5, Math.round(enc.discomfort / 2));
  return `<header class="topbar" id="topbar">
    <div class="l1">
      <button class="iconbtn" data-a="menu" aria-label="メニュー">≡</button>
      <div class="pt"><b>${esc(p.name)}</b> ${p.age}歳 ${sexJ(p.sex)} ${p.weight}kg</div>
      <div class="clock">${clockOf(enc)}<small>経過 ${elapsed(enc.t)}</small></div>
      <button class="iconbtn" data-a="skip" aria-label="時間を進める">⏩</button>
    </div>
    <div class="vitals" data-a="vitals" role="button" aria-label="バイタル再測定">
      <div class="vit ${vitClass('T', v.T)}"><b>${v.T}</b><span>体温</span></div>
      <div class="vit ${vitClass('HR', v.HR)}"><b>${v.HR}</b><span>脈拍</span></div>
      <div class="vit ${vitClass('SBP', v.SBP)}"><b>${v.SBP}/${v.DBP}</b><span>血圧</span></div>
      <div class="vit ${vitClass('RR', v.RR)}"><b>${v.RR}</b><span>呼吸数</span></div>
      <div class="vit ${vitClass('SpO2', v.SpO2)}"><b>${v.SpO2}</b><span>SpO2</span></div>
      <div class="vit ${vitClass('JCS', v.JCS)}"><b>${v.JCS}</b><span>JCS</span></div>
    </div>
    <div class="statusline">
      <span>📍${S.LOCATION[enc.phase]}</span><span>🧪待ち ${pend}</span><span>💊 ${act}</span>
      <span>負担 ${'●'.repeat(disc)}${'○'.repeat(5 - disc)}</span>
      <span>${lv.by} ${clockOf(enc, lv.t).slice(-5)}（${esc(v.o2)}）</span>
      ${enc.urgent && game.settings.realtime && enc.phase === 'er' ? `<span class="urgent">${ui.paused ? '⏸ 一時停止中' : '⏱ 緊迫モード'}</span>` : ''}
    </div>
  </header>`;
}

function alertsView() {
  const enc = game.enc;
  const un = enc.alerts.filter((a) => !a.seen);
  if (!un.length) return '';
  return `<div class="alerts">${un.slice(-4).map((a, i) => `<button class="alert ${a.kind}" data-a="seen" data-i="${enc.alerts.indexOf(a)}">${a.kind === 'nurse' ? '🚨' : a.kind === 'result' ? '🧪' : '📞'} ${esc(a.text)} <span class="sub small">（${clockOf(enc, a.t).slice(-5)}・タップで閉じる）</span></button>`).join('')}
  ${un.length > 1 ? '<button class="btn block" data-a="seenall" style="min-height:36px;padding:6px">通知をすべて閉じる</button>' : ''}</div>`;
}

function viewEncounter() {
  const enc = game.enc;
  let body = '';
  switch (ui.tab) {
    case 'q': body = tabQuestions(); break;
    case 'e': body = tabExam(); break;
    case 't': body = tabTests(); break;
    case 'd': body = tabDdx(); break;
    case 'r': body = tabTreat(); break;
    case 'l': body = tabLog(); break;
  }
  const newRes = enc.tests.filter((x) => x.done && !x.viewed).length;
  const tabs = [['q', '💬', '問診'], ['e', '🩺', '診察'], ['t', '🧪', '検査', newRes], ['d', '🧠', '鑑別'], ['r', '💊', '治療'], ['l', '📋', 'カルテ']];
  const fab = hintsOn() && !(ui.tab === 't' && ui.sel.size) ? `<button class="fab" data-a="hint">🧑‍⚕️ 指導医</button>` : '';
  return `${topbar()}<div class="screen" style="padding-top:8px">${alertsView()}${body}</div>${fab}
  <nav class="tabbar"><div class="inner">${tabs.map(([id, ic, name, n]) => `<button class="tab ${ui.tab === id ? 'on' : ''}" data-a="tab" data-v="${id}"><span class="ic">${ic}</span>${name}${n ? `<span class="dot">${n}</span>` : ''}</button>`).join('')}</div></nav>`;
}

function tabQuestions() {
  const enc = game.enc, p = enc.patient;
  const qs = QUESTIONS.filter((q) => q.cat === ui.qcat && (!q.female || p.sex === 'F'));
  const rec = isRes() ? recommended(enc) : null;
  return `<div class="chips">${Q_CATS.map((c) => `<button class="chip ${ui.qcat === c.id ? 'on' : ''}" data-a="qcat" data-v="${c.id}">${c.name}</button>`).join('')}</div>
  <div class="sub small">質問をタップすると患者が答えます（1問1分）。${isRes() ? '★はこの主訴で特に重要な質問です。' : ''}</div>
  ${qs.map((q) => {
    const a = enc.asked[q.id];
    return `<button class="q ${a ? 'asked' : ''}" data-a="ask" data-v="${q.id}" ${a ? 'disabled' : ''}><div class="qt">${star(rec?.q.has(q.id))}${esc(q.text)}</div>${rec ? `<div class="why">${esc(QUESTION_WHY[q.id])}</div>` : ''}${a ? `<div class="bubble ${a.positive ? 'pos' : ''}">${esc(a.text)}</div>` : ''}</button>`;
  }).join('')}`;
}

function tabExam() {
  const enc = game.enc;
  const ex = EXAMS.filter((e) => e.region === ui.region && (!e.female || enc.patient.sex === 'F') && (!e.male || enc.patient.sex === 'M'));
  const rec = isRes() ? recommended(enc) : null;
  const regStar = (r) => rec && EXAMS.some((e) => e.region === r && rec.e.has(e.id) && !enc.examined[e.id]) ? '★' : '';
  return `<div class="chips">${EXAM_REGIONS.map((r) => `<button class="chip ${ui.region === r.id ? 'on' : ''}" data-a="region" data-v="${r.id}">${regStar(r.id)}${r.name}</button>`).join('')}</div>
  <div class="sub small">⚠のついた診察は患者に痛みを伴います。</div>
  ${ex.map((e) => {
    const f = enc.examined[e.id];
    return `<button class="ex ${f ? 'done' : ''}" data-a="exam" data-v="${e.id}"><span class="badge m">${e.method[0]}</span><div class="grow"><div class="name">${star(rec?.e.has(e.id))}${esc(e.name)} ${e.pain ? '⚠' : ''}</div>${rec ? `<div class="why">${esc(EXAM_WHY[e.id])}</div>` : ''}${f ? `<div class="finding ${f.abnormal ? 'abn' : ''}">${esc(f.text)} <span class="sub small">${clockOf(enc, f.t).slice(-5)}</span></div>` : ''}</div></button>`;
  }).join('')}
  <button class="btn block" data-a="vitals">📈 バイタルサインを測定（2分）</button>`;
}

function tabTests() {
  const enc = game.enc;
  const done = enc.tests.filter((x) => x.done);
  const pend = enc.tests.filter((x) => !x.done);
  const list = TESTS.filter((t) => t.cat === ui.tcat && (!t.female || enc.patient.sex === 'F'));
  const rec = isRes() ? recommended(enc) : null;
  const catStar = (c) => rec && TESTS.some((t) => t.cat === c && rec.t.has(t.id) && !enc.tests.some((x) => x.id === t.id)) ? '★' : '';
  const selCost = [...ui.sel].reduce((a, id) => a + TEST_BY_ID[id].cost, 0);
  const nt = S.nextResultT(enc);
  return `${done.length ? `<h3>結果（${done.length}）</h3>${done.slice().reverse().map((x) => `<button class="trow" data-a="result" data-v="${enc.tests.indexOf(x)}"><div class="grow"><b>${esc(TEST_BY_ID[x.id].name)}</b> ${x.viewed ? '' : '<span class="badge new">NEW</span>'} ${resultAbn(x) ? '<span class="badge bad">異常あり</span>' : ''}<div class="meta">採取 ${clockOf(enc, x.orderT).slice(-5)}</div></div><span>›</span></button>`).join('')}` : ''}
  ${pend.length ? `<h3>結果待ち（${pend.length}）</h3>${pend.map((x) => `<div class="trow pending"><div class="grow">${esc(TEST_BY_ID[x.id].name)}<div class="meta">結果予定 ${clockOf(enc, x.dueT)}（あと${elapsed(x.dueT - enc.t)}）</div></div></div>`).join('')}` : ''}
  ${nt ? `<button class="btn block" data-a="waitnext">⏳ 次の結果・返信まで待つ（${elapsed(nt - enc.t)}）</button>` : ''}
  <h3>オーダー</h3>
  <div class="chips">${TEST_CATS.map((c) => `<button class="chip ${ui.tcat === c.id ? 'on' : ''}" data-a="tcat" data-v="${c.id}">${catStar(c.id)}${c.name}</button>`).join('')}</div>
  ${list.map((t) => {
    const isPend = pend.some((x) => x.id === t.id);
    const sel = ui.sel.has(t.id);
    return `<button class="trow ${sel ? 'sel' : ''} ${isPend ? 'pending' : ''}" data-a="tsel" data-v="${t.id}" ${isPend ? 'disabled' : ''}><span class="chk">${sel ? '✓' : ''}</span><div class="grow"><b>${star(rec?.t.has(t.id))}${esc(t.name)}</b>${rec ? `<div class="why">${esc(TEST_WHY[t.id] || (t.items ? t.items.map((i) => LABS[i].name).join('・') + 'を測定' : ''))}</div>` : ''}<div class="meta">¥${t.cost.toLocaleString()} · ⏱${t.timeMin >= 1440 ? Math.round(t.timeMin / 1440) + '日' : t.timeMin + '分'} · 侵襲${'💉'.repeat(t.inv) || 'なし'}${t.radiation ? ' · ☢被ばく' : ''}${t.contrast ? ' · 造影剤' : ''}${t.items && t.items.length > 1 ? ' · ' + t.items.length + '項目' : ''}</div></div></button>`;
  }).join('')}
  <div style="height:70px"></div>
  ${ui.sel.size ? `<div class="orderbar"><div class="inner"><div class="grow small">${ui.sel.size}件 ¥${selCost.toLocaleString()}</div><button class="btn" data-a="tclear">解除</button><button class="btn primary" data-a="torder">オーダー</button></div></div>` : ''}`;
}

function resultAbn(x) {
  if (x.result.items) return x.result.items.some((i) => i.flag);
  return x.result.abnormal;
}

function findingsList(enc) {
  const out = [];
  for (const e of enc.log) {
    if (e.type === 'q') out.push({ key: 'q:' + e.qid, label: '問診', text: e.text, pos: e.positive });
    if (e.type === 'exam') out.push({ key: 'e:' + e.eid, label: e.label, text: e.text, pos: e.positive });
    if (e.type === 'vitals') out.push({ key: 'v:' + e.id, label: 'バイタル', text: e.text, pos: true });
  }
  enc.tests.forEach((x, i) => {
    if (!x.done) return;
    const T = TEST_BY_ID[x.id];
    if (x.result.items) x.result.items.forEach((it) => { if (it.flag) out.push({ key: `l:${i}:${it.id}`, label: T.name, text: `${LABS[it.id].name} ${it.s}${LABS[it.id].unit ? ' ' + LABS[it.id].unit : ''} (${it.flag})`, pos: true }); });
    else out.push({ key: 't:' + i, label: T.name, text: x.result.text, pos: x.result.abnormal });
  });
  const seen = new Set();
  return out.filter((f) => (seen.has(f.key) ? false : seen.add(f.key)));
}

function tabDdx() {
  const enc = game.enc;
  const fmap = Object.fromEntries(findingsList(enc).map((f) => [f.key, f]));
  const tagText = (k) => { const f = fmap[k]; return f ? (f.text.length > 26 ? f.text.slice(0, 26) + '…' : f.text) : k; };
  const fd = enc.finalDx;
  return `<div class="sub small">疑わしい疾患を自分で挙げ、所見を「支持（＋）」「否定（−）」に紐づけて確信度を管理しましょう。</div>
  ${enc.ddx.length ? '' : '<div class="empty">まだ鑑別診断がありません。</div>'}
  ${enc.ddx.slice().sort((a, b) => b.conf - a.conf).map((x) => `<div class="dx">
    <div class="row"><b class="grow">${esc(DDX_BY_ID[x.id].name)}</b><button class="sub small" data-a="ddxdel" data-v="${x.id}">削除</button></div>
    <div class="conf"><button class="mini" data-a="conf" data-v="${x.id}" data-d="-10">−</button><div class="bar"><i style="width:${x.conf}%"></i></div><button class="mini" data-a="conf" data-v="${x.id}" data-d="10">＋</button><span style="width:44px;text-align:right">${x.conf}%</span></div>
    <div>${x.pro.map((k) => `<span class="tag pro">＋ ${esc(tagText(k))}</span>`).join('')}${x.con.map((k) => `<span class="tag con">− ${esc(tagText(k))}</span>`).join('')}</div>
    <button class="btn block" style="min-height:38px;padding:6px" data-a="link" data-v="${x.id}">🔗 所見を紐づける</button>
  </div>`).join('')}
  <button class="btn block" data-a="ddxadd">＋ 鑑別診断を追加</button>
  <div class="card"><b>最終診断</b>
  ${fd ? `<div style="margin:6px 0">${fd.undetermined ? '確定診断に至らず' : ''}${fd.ids.map((i) => `<span class="badge good">${esc(DDX_BY_ID[i].name)}</span>`).join(' ')}</div>` : '<div class="sub small">治療方針（帰宅・入院）を決める前に最終診断を記載してください。</div>'}
  <button class="btn primary block" data-a="finaldx">${fd ? '最終診断を修正' : '最終診断を確定する'}</button></div>`;
}

function tabTreat() {
  const enc = game.enc;
  const act = enc.orders.filter((o) => S.isOrderActive(enc, o));
  const ward = enc.phase === 'ward' || enc.phase === 'icu';
  const ready = ward && S.dischargeReady(enc);
  const pendC = enc.consults.filter((c) => !c.replied);
  return `<h3>実施中の指示（${act.length}）</h3><div class="card tight">${act.length ? act.map((o) => `<div class="order"><div class="grow">${esc(S.orderLabel(o))}${o.end ? `<div class="sub small">〜${clockOf(enc, o.end)}</div>` : ''}${o.start > enc.t ? '<div class="sub small">準備中</div>' : ''}</div><button class="x" data-a="stop" data-v="${o.oid}">中止</button></div>`).join('') : '<div class="sub">なし</div>'}</div>
  ${pendC.length ? `<div class="sub small">コンサルト返信待ち：${pendC.map((c) => S.DEPTS[c.dept]).join('、')}</div>` : ''}
  <div class="actgrid" style="margin-top:12px">
    <button class="act" data-a="rx"><span class="ic">💊</span>薬剤処方</button>
    <button class="act" data-a="fluid"><span class="ic">💧</span>輸液</button>
    <button class="act" data-a="o2"><span class="ic">🫁</span>酸素</button>
    <button class="act" data-a="npo"><span class="ic">🍽</span>${enc.orders.some((o) => o.kind === 'npo' && S.isOrderActive(enc, o)) ? '絶飲食解除' : '絶飲食'}</button>
    <button class="act" data-a="consult"><span class="ic">📞</span>コンサルト</button>
    <button class="act" data-a="proc"><span class="ic">🔧</span>処置</button>
    <button class="act" data-a="dispo"><span class="ic">🏥</span>${ward ? '退院' : '方針決定'}</button>
  </div>
  ${ward ? `<div class="card"><b>${enc.phase === 'icu' ? 'ICU' : '病棟'}管理</b> ${ready ? '<span class="badge good">退院可能</span>' : ''}
    <div class="sub small">時間を進めて経過を観察しましょう。急変時は看護師から連絡が入り、自動的に停止します。</div>
    <div class="grid3" style="margin-top:8px"><button class="btn" data-a="adv" data-v="240">+4時間</button><button class="btn" data-a="adv" data-v="morning">翌朝へ</button><button class="btn" data-a="auto">自動経過</button></div></div>` : ''}
  <div class="sub small" style="margin-top:12px">💡 処方前に問診（アレルギー・常用薬）と腎機能を確認しましょう。</div>`;
}

function tabLog() {
  const enc = game.enc, p = enc.patient;
  return `<div class="card"><b>患者情報</b><dl class="kv"><dt>氏名</dt><dd>${esc(p.name)}（${p.age}歳 ${sexJ(p.sex)}）</dd><dt>体重</dt><dd>${p.weight}kg</dd><dt>主訴</dt><dd>${esc(p.cc)}</dd><dt>場所</dt><dd>${S.LOCATION[enc.phase]}</dd><dt>検査費用</dt><dd>¥${enc.cost.toLocaleString()}</dd></dl></div>
  <h3>カルテ（経過記録）</h3><div class="log">${enc.log.slice().reverse().map((e) => `<div class="e"><div class="tm">${clockOf(enc, e.t)} ${e.label ? '· ' + esc(e.label) : ''}</div>${esc(e.text)}</div>`).join('')}</div>`;
}

// ---------- 振り返り ----------
function viewDebrief() {
  const enc = game.enc;
  const sc = enc.score;
  if (!sc) return '<div class="screen">集計中…</div>';
  const P = sc.parts;
  const part = (name, x) => `<div class="part"><span style="width:56px">${name}</span><div class="bar grow"><i style="width:${(x.score / x.max) * 100}%"></i></div><span class="pts">${x.score}/${x.max}</span></div>`;
  const st = { ontime: '<span class="ok">◎ 適切</span>', late: '<span class="late">△ 遅れ</span>', verylate: '<span class="late">▲ 大幅な遅れ</span>', missing: '<span class="ng">✕ 未実施</span>' };
  const tr = sc.truth;
  return `<div class="screen">
    <h2>診療の振り返り</h2>
    <div class="card" style="text-align:center"><div class="sub">転帰</div><div style="font-size:22px;font-weight:800">${OUTCOME_LABEL[sc.outcome.kind]}</div>
      ${sc.outcome.notes?.length ? `<div class="sub small">${sc.outcome.notes.map(esc).join('／')}</div>` : ''}
      <div class="grade ${sc.grade}">${sc.grade}</div><div>${sc.total}点 <span class="sub">（+${sc.xp} XP）</span></div>
      <div class="sub small">${MODES[enc.mode || 'expert'].name}${enc.hintUse && (enc.hintUse.l1 + enc.hintUse.l2 + enc.hintUse.l3) ? `・ヒント ${enc.hintUse.l1 + enc.hintUse.l2 + enc.hintUse.l3}回${enc.hintUse.answer ? '（答えを見た）' : ''}` : ''}${enc.pharmCalls ? `・疑義照会 ${enc.pharmCalls}回` : ''}・経験値×${sc.xpMult ?? 1}</div>
      ${modeSuggestion()}
      ${sc.deathText ? `<div class="card tight" style="text-align:left;border-color:${sc.deathType === 'unavoidable' ? 'var(--line)' : 'var(--bad)'}">${esc(sc.deathText)}</div>` : ''}
    </div>
    <div class="card"><b>正解</b><div style="font-size:18px;margin:4px 0">${esc(tr.name)}（${tr.sev}）</div>
      ${tr.organism ? `<div class="sub small">原因菌：${esc(tr.organism)}</div>` : ''}${tr.pregnant ? '<div class="sub small">※ 妊娠中の患者でした</div>' : ''}${tr.refractory ? '<div class="sub small">※ 治療抵抗性の重症例でした</div>' : ''}
      <div class="sub small">あなたの診断：${P.dx.chosen.length ? P.dx.chosen.map(esc).join('、') : '未記載'} — ${esc(P.dx.note)}</div></div>
    <div class="card"><b>採点</b>${part('診断', P.dx)}${part('治療', P.tx)}${part('検査', P.test)}${part('方針', P.dispo)}${part('転帰', P.outcome)}
      ${sc.notes.map((n) => `<div class="sub small">・${esc(n)}</div>`).join('')}</div>
    <div class="card"><b>必要な治療</b>${P.tx.therapies.length ? `<ul class="clean">${P.tx.therapies.map((t) => `<li>${st[t.status]} ${esc(t.label)}<div class="sub small">開始まで ${t.delay ?? '—'}（目標 ${t.deadline}以内）</div></li>`).join('')}</ul>` : '<div class="sub">—</div>'}
      ${P.tx.harms.length ? `<b class="ng">有害・禁忌</b><ul class="clean">${P.tx.harms.map((h) => `<li>${esc(h.msg)}${h.context ? `（${esc(h.context)}）` : ''}</li>`).join('')}</ul>` : ''}
      ${P.tx.warns.length ? `<b class="late">注意が必要だった点</b><ul class="clean">${P.tx.warns.map((h) => `<li>${esc(h.msg)}${h.context ? `（${esc(h.context)}）` : ''}</li>`).join('')}</ul>` : ''}
      ${P.tx.infos.length ? `<b>参考</b><ul class="clean">${P.tx.infos.map((h) => `<li>${esc(h.msg)}</li>`).join('')}</ul>` : ''}</div>
    <div class="card"><b>方針</b><div class="sub small">あなた：${esc(P.dispo.chosen)} ／ 推奨：${esc(P.dispo.best)}</div><div class="sub small">${esc(P.dispo.why)}</div></div>
    <div class="card"><b>検査</b><div class="sub small">検査費用 合計 ¥${P.test.totalCost.toLocaleString()}</div>
      ${P.test.missingKeys.length ? `<div class="small">不足していた重要検査：${P.test.missingKeys.map(esc).join('、')}</div>` : ''}
      ${P.test.wasted.length ? `<div class="small">必要性の低い検査：${P.test.wasted.map(esc).join('、')}（¥${P.test.wasteCost.toLocaleString()}）</div>` : ''}</div>
    ${sc.missed.length ? `<div class="card"><b>聞き逃し・見逃した所見</b><ul class="clean">${sc.missed.map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
    ${DISEASE_NOTES[enc.patient.diseaseId] ? `<div class="card"><b>🧭 模範的な流れ</b><div class="small" style="margin-top:4px">${esc(DISEASE_NOTES[enc.patient.diseaseId].flow)}</div><b style="display:block;margin-top:8px">💊 治療のポイント</b><ul class="clean">${DISEASE_NOTES[enc.patient.diseaseId].treatment.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
    <div class="card"><b>📚 学習ポイント</b><ul class="clean">${sc.teaching.map((t) => `<li>${esc(t)}</li>`).join('')}</ul><div class="sub small">参考：${sc.sources.map(esc).join('／')}</div></div>
    <button class="btn block" data-a="tab-log-debrief">📋 カルテを見る</button>
    <button class="btn primary block" data-a="newcase">🚑 次の患者へ</button>
    <button class="btn block" data-a="title">タイトルへ</button>
  </div>`;
}

function modeSuggestion() {
  const cs = game.profile.cases.slice(-3);
  const mode = game.settings.mode;
  if (cs.length < 3 || !cs.every((c) => c.mode === mode && c.score >= 75)) return '';
  if (mode === 'resident') return '<div class="card tight" style="border-color:var(--accent)">🎓 3回連続で75点以上！ そろそろ<b>専攻医モード</b>（★や解説なし）に挑戦してみよう。タイトル画面で変更できます。</div>';
  if (mode === 'senior') return '<div class="card tight" style="border-color:var(--accent)">🎓 3回連続で75点以上！ <b>専門医モード</b>（ヒントなし・経験値1.5倍）に挑戦してみよう。</div>';
  return '';
}

function viewLibrary() {
  const seen = game.profile.seen || {};
  const mastery = game.profile.mastery || {};
  const tabs = [['dz', '疾患'], ['cc', '主訴'], ['test', '検査'], ['drug', '薬']];
  let body = '';
  if (ui.libTab === 'dz') {
    body = DISEASES.map((d) => {
      const ms = mastery[d.id];
      const stars = '★'.repeat(ms?.stars || 0) + '☆'.repeat(3 - (ms?.stars || 0));
      if (!seen[d.id]) return `<div class="card tight"><b>？？？</b> <span class="sub small">（まだ出会っていない疾患）</span></div>`;
      const n = DISEASE_NOTES[d.id];
      return `<details class="card tight"><summary><b>${esc(d.name)}</b> <span class="star">${stars}</span> <span class="sub small">${ms.n}回・最高${ms.best}点</span></summary><div class="small" style="margin-top:6px">${esc(n.overview)}<b style="display:block;margin-top:6px">治療</b><ul class="clean">${n.treatment.map((t) => `<li>${esc(t)}</li>`).join('')}</ul><b>流れ</b><div>${esc(n.flow)}</div><b style="display:block;margin-top:6px">ポイント</b><ul class="clean">${d.teaching.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></details>`;
    }).join('') + '<div class="sub small">★1：65点以上 ★2：専攻医以上で80点以上 ★3：専門医で80点以上（答えを見ずに）</div>';
  } else if (ui.libTab === 'cc') {
    body = Object.values(APPROACHES).map((a) => `<details class="card tight"><summary><b>${esc(a.title)}</b></summary><div class="small" style="margin-top:6px">${esc(a.intro)}<b style="display:block;margin-top:6px">危険なサイン</b><ul class="clean">${a.redflags.map((r) => `<li>${esc(r)}</li>`).join('')}</ul><b>鑑別</b><ul class="clean">${a.ddx.map((d) => `<li><b>${esc(DDX_BY_ID[d.id].name)}</b>：${esc(d.point)}${d.tests ? `<br><span class="sub">→ 疑ったら：${d.tests.map((t) => esc(TEST_BY_ID[t].name)).join('、')}</span>` : ''}</li>`).join('')}</ul><b>重要な問診</b><div>${a.keyQ.map((q) => esc(QUESTIONS.find((x) => x.id === q).text)).join(' / ')}</div><b style="display:block;margin-top:6px">重要な診察</b><div>${a.keyE.map((e) => esc(EXAMS.find((x) => x.id === e).name)).join(' / ')}</div><b style="display:block;margin-top:6px">基本の検査</b><div>${a.keyT.map((t) => esc(TEST_BY_ID[t].name)).join(' / ')}</div></div></details>`).join('');
  } else if (ui.libTab === 'test') {
    body = TESTS.filter((t) => t.cat !== 'single').map((t) => `<details class="card tight"><summary><b>${esc(t.name)}</b> <span class="sub small">¥${t.cost.toLocaleString()}・${t.timeMin >= 1440 ? Math.round(t.timeMin / 1440) + '日' : t.timeMin + '分'}</span></summary><div class="small" style="margin-top:6px">${esc(TEST_WHY[t.id] || '')}${t.items ? `<ul class="clean">${t.items.map((i) => { const L = LABS[i]; const mm = LAB_MEANING[i] || {}; const r = refFor(L, 'M'); return `<li><b>${esc(L.name)}</b>${L.ord ? '' : ` <span class="sub">基準 ${r[0]}–${r[1]} ${L.unit || ''}</span>`}${mm.H ? `<br>↑ ${esc(mm.H)}` : ''}${mm.L ? `<br>↓ ${esc(mm.L)}` : ''}</li>`; }).join('')}</ul>` : ''}</div></details>`).join('');
  } else {
    body = DRUGS.map((d) => `<details class="card tight"><summary><b>${esc(d.generic)}</b> <span class="sub small">${esc(d.brands.join('・'))}</span></summary><div class="small" style="margin-top:6px"><div>${esc(DRUG_ROLE[d.id])}</div><div class="sub" style="margin-top:4px">${esc(d.cls)}</div><div style="margin-top:4px">${esc(d.info)}</div>${d.renal ? `<div style="margin-top:4px"><b>腎機能による調節</b><br>${d.renal.map((x) => esc(x.text)).join('<br>')}</div>` : ''}</div></details>`).join('');
  }
  return `<div class="screen"><h2>📚 医学ノート</h2><div class="chips">${tabs.map(([k, n]) => `<button class="chip ${ui.libTab === k ? 'on' : ''}" data-a="libtab" data-v="${k}">${n}</button>`).join('')}</div>${body}<button class="btn block" data-a="${game.enc && !game.enc.ended && ui.prevScreen === 'encounter' ? 'resume' : 'title'}">戻る</button></div>`;
}

function viewRecords() {
  const cs = game.profile.cases.slice().reverse();
  return `<div class="screen"><h2>診療記録</h2>${cs.length ? cs.map((c) => `<div class="card tight"><div class="row"><b class="grow">${esc(c.dx)}</b><span class="grade ${c.grade}" style="font-size:22px;margin:0">${c.grade}</span></div><div class="sub small">${esc(c.date)}・${c.age}歳${sexJ(c.sex)}・${esc(OUTCOME_LABEL[c.outcome])}・${c.score}点</div></div>`).join('') : '<div class="empty">まだ記録がありません。</div>'}
  <button class="btn block" data-a="title">戻る</button></div>`;
}

function viewHelp() {
  return `<div class="screen"><h2>遊び方</h2>
  <div class="card"><b>診療の流れ</b><ul class="clean">
  <li>💬 <b>問診</b>：質問を選ぶと患者が答えます。聞かなかったことは分かりません。</li>
  <li>🩺 <b>診察</b>：部位と方法（視・触・打・聴）を選んで所見をとります。痛みを伴う診察は患者の負担になります。</li>
  <li>🧪 <b>検査</b>：セットや個別項目を選んでオーダー。費用・時間・侵襲があり、結果が出るまで時間がかかります。</li>
  <li>🧠 <b>鑑別</b>：疑う疾患を自分で追加し、所見を紐づけて確信度を管理。最後に最終診断を確定します。</li>
  <li>💊 <b>治療</b>：薬剤（用量・経路・頻度・期間）、輸液、酸素、コンサルト、帰宅・入院の方針を決めます。</li>
  </ul></div>
  <div class="card"><b>難易度</b><div class="small">研修医モード：★印（重要な質問・診察・検査）と「なぜそれをするか」の解説を表示。右下の「🧑‍⚕️ 指導医」でヒント、処方ミスは薬剤師が教えてくれます。<br>専攻医モード：解説なし。指導医への相談は経験値が減ります。<br>専門医モード：ヒントなし・経験値1.5倍。<br>📚医学ノートで、出会った疾患・主訴ごとの考え方・検査・薬をいつでも復習できます。</div></div>
  <div class="card"><b>時間</b><div class="small">行動するたびにゲーム内の時間が進みます。⏩ボタンで時間を進められます。病棟では「翌朝へ」「自動経過」で経過を観察できます。重症の救急搬送では緊迫モード（リアルタイム）になります。</div></div>
  <div class="card"><b>評価</b><div class="small">診断・治療・検査・方針・転帰の5項目で採点します。適切な診療でも救命できない場合があり、その場合は「不可避な死亡」として区別して評価します。</div></div>
  <div class="card"><b>ヒント</b><ul class="clean"><li>処方前にアレルギー・常用薬・腎機能（Cr, eGFR）を確認</li><li>妊娠可能年齢の女性には妊娠の可能性を確認</li><li>培養は抗菌薬を始める前に</li><li>治療に反応しないときは診断や薬剤を見直す</li></ul></div>
  <button class="btn block" data-a="title">戻る</button></div>`;
}

// ========== モーダル ==========
function openModal(m) { ui.modal = m; renderModal(); setupRealtime(); }
function closeModal() { ui.modal = null; renderModal(); setupRealtime(); }

function renderModal() {
  const m = ui.modal;
  if (!m) { $modal.innerHTML = ''; return; }
  let inner = '';
  const hd = (title) => `<div class="hd"><h2>${title}</h2><button class="iconbtn" data-a="close">✕</button></div>`;
  const enc = game.enc;
  switch (m.type) {
    case 'result': {
      const x = enc.tests[m.i];
      const T = TEST_BY_ID[x.id];
      inner = hd(esc(T.name)) + `<div class="sub small">採取 ${clockOf(enc, x.orderT)} ／ 結果 ${clockOf(enc, x.dueT)}</div>` +
        (x.result.items ? `<table class="lab">${x.result.items.map((it) => { const L = LABS[it.id]; const r = refFor(L, enc.patient.sex); const mean = hintsOn() && it.flag ? LAB_MEANING[it.id]?.[it.flag] : null; return `<tr><td>${esc(L.name)}${mean ? `<div class="why">${esc(mean)}</div>` : ''}</td><td class="v ${it.flag}">${it.s} ${it.flag}</td><td class="sub small">${L.unit || ''}<br>${L.ord ? (r[1] === 0 ? '(−)' : '(−〜±)') : `${r[0]}–${r[1]}`}</td></tr>`; }).join('')}</table>` : `<div class="report">${esc(x.result.text)}</div>${hintsOn() && TEST_WHY[x.id] ? `<div class="why" style="margin-top:8px">この検査でわかること：${esc(TEST_WHY[x.id])}</div>` : ''}`);
      break;
    }
    case 'skip': {
      const ward = enc.phase !== 'er';
      inner = hd('時間を進める') + `<div class="sub small">結果待ちや経過観察に。重要なイベントがあると途中で止まります。</div>
      <div class="grid3" style="margin-top:8px">${[10, 30, 60, 120, 240].map((v) => `<button class="btn" data-a="adv" data-v="${v}">+${v < 60 ? v + '分' : v / 60 + '時間'}</button>`).join('')}${ward ? '<button class="btn" data-a="adv" data-v="morning">翌朝8時</button>' : ''}</div>
      ${S.nextResultT(enc) ? `<button class="btn block" data-a="waitnext">⏳ 次の結果・返信まで</button>` : ''}
      ${enc.urgent && game.settings.realtime && enc.phase === 'er' ? `<button class="btn block" data-a="pause">${ui.paused ? '▶ 再開' : '⏸ 一時停止'}</button>` : ''}`;
      break;
    }
    case 'menu':
      inner = hd('メニュー') + `<button class="btn block" data-a="title">タイトルへ（自動保存されます）</button><button class="btn block" data-a="libraryenc">📚 医学ノート</button><button class="btn block" data-a="help">遊び方</button>`;
      break;
    case 'ddxadd': {
      const q = (m.q || '').trim();
      const list = DDX.filter((d) => !enc.ddx.some((x) => x.id === d.id) && (!q || d.name.includes(q)));
      inner = hd('鑑別診断を追加') + `<input class="input" id="ddxq" placeholder="疾患名で検索" value="${esc(q)}" data-input="ddxq">` +
        DDX_CATS.map((c) => { const it = list.filter((d) => d.cat === c.id); return it.length ? `<h3>${c.name}</h3><div class="row wrap">${it.map((d) => `<button class="chip" data-a="ddxpick" data-v="${d.id}">${esc(d.name)}</button>`).join('')}</div>` : ''; }).join('');
      break;
    }
    case 'link': {
      const x = enc.ddx.find((d) => d.id === m.id);
      const fs = findingsList(enc).filter((f) => f.pos || m.all);
      inner = hd(`所見を紐づけ：${esc(DDX_BY_ID[m.id].name)}`) + `<div class="sub small">＋は支持する所見、−は否定的な所見。</div>
      <button class="chip ${m.all ? 'on' : ''}" data-a="linkall">陰性所見も表示</button>` +
        (fs.length ? fs.map((f) => `<div class="card tight"><div class="sub small">${esc(f.label)}</div><div class="small">${esc(f.text)}</div><div class="row" style="margin-top:6px"><button class="chip ${x.pro.includes(f.key) ? 'on' : ''}" data-a="linkset" data-k="${f.key}" data-s="pro">＋ 支持</button><button class="chip ${x.con.includes(f.key) ? 'on' : ''}" data-a="linkset" data-k="${f.key}" data-s="con">− 否定</button></div></div>`).join('') : '<div class="empty">まだ所見がありません。問診・診察・検査を進めましょう。</div>');
      break;
    }
    case 'finaldx': {
      const sel = m.sel;
      inner = hd('最終診断') + `<div class="sub small">鑑別リストから選択（複数可：併存疾患など）。</div>` +
        (enc.ddx.length ? enc.ddx.map((x) => `<button class="trow ${sel.has(x.id) ? 'sel' : ''}" data-a="fdpick" data-v="${x.id}"><span class="chk">${sel.has(x.id) ? '✓' : ''}</span><div class="grow">${esc(DDX_BY_ID[x.id].name)} <span class="sub small">${x.conf}%</span></div></button>`).join('') : '<div class="empty">先に鑑別診断を追加してください。</div>') +
        `<div class="toggle"><span>確定診断に至らない（疑い診断として扱う）</span><button class="switch ${m.und ? 'on' : ''}" data-a="fdund"></button></div>
        <button class="btn primary block" data-a="fdok" ${sel.size || m.und ? '' : 'disabled'}>確定</button>`;
      break;
    }
    case 'rx': inner = modalRx(m, hd); break;
    case 'fluid': {
      inner = hd('輸液') + `<div class="field"><label>輸液製剤</label><div class="row wrap">${FLUIDS.map((f) => `<button class="chip ${m.fluidId === f.id ? 'on' : ''}" data-a="fset" data-k="fluidId" data-v="${f.id}">${esc(f.name)}</button>`).join('')}</div></div>
      <div class="field"><label>投与方法</label><div class="row"><button class="chip ${m.mode === 'bolus' ? 'on' : ''}" data-a="fset" data-k="mode" data-v="bolus">急速投与（ボーラス）</button><button class="chip ${m.mode === 'cont' ? 'on' : ''}" data-a="fset" data-k="mode" data-v="cont">持続投与</button></div></div>
      ${m.mode === 'bolus' ? `<div class="field"><label>投与量（1L/時で投与）</label><div class="row wrap">${(m.fluidId === 'rbc' ? [140, 280, 560] : [250, 500, 1000, 2000]).map((v) => `<button class="chip ${m.volume === v ? 'on' : ''}" data-a="fset" data-k="volume" data-v="${v}">${m.fluidId === 'rbc' ? v / 140 + '単位（' + v + 'mL）' : v + 'mL'}</button>`).join('')}</div></div>`
        : `<div class="field"><label>速度（mL/時）</label><div class="row wrap">${[20, 40, 80, 100, 150, 250, 500].map((v) => `<button class="chip ${m.rate === v ? 'on' : ''}" data-a="fset" data-k="rate" data-v="${v}">${v}</button>`).join('')}</div></div>`}
      ${isRes() ? `<div class="why">${esc(FLUID_ROLE[m.fluidId])}</div>` : ''}<div class="sub small">${esc(FLUIDS.find((f) => f.id === m.fluidId).name)}：Na ${FLUIDS.find((f) => f.id === m.fluidId).na} / K ${FLUIDS.find((f) => f.id === m.fluidId).k} mEq/L、糖 ${FLUIDS.find((f) => f.id === m.fluidId).glucose} g/L</div>
      <button class="btn primary block" data-a="fok">指示する</button>`;
      break;
    }
    case 'o2': {
      const cur = enc.orders.find((o) => o.kind === 'o2' && S.isOrderActive(enc, o));
      const D = O2_DEVICES.find((d) => d.id === m.device);
      inner = hd('酸素投与') + `${cur ? `<div class="sub small">現在：${esc(S.orderLabel(cur))}</div>` : ''}
      <div class="field"><label>デバイス</label><div class="row wrap">${O2_DEVICES.map((d) => `<button class="chip ${m.device === d.id ? 'on' : ''}" data-a="oset" data-k="device" data-v="${d.id}">${esc(d.name)}</button>`).join('')}</div></div>
      ${isRes() ? `<div class="why">${esc(O2_ROLE[m.device])}</div>` : ''}${D.flow[1] ? `<div class="field"><label>流量（L/分）</label><div class="row wrap">${range(D.flow[0], D.flow[1]).map((v) => `<button class="chip ${m.flow === v ? 'on' : ''}" data-a="oset" data-k="flow" data-v="${v}">${v}</button>`).join('')}</div></div>` : ''}
      <button class="btn primary block" data-a="ook">開始・変更</button>${cur ? '<button class="btn block danger" data-a="ostop">酸素を中止</button>' : ''}`;
      break;
    }
    case 'proc':
      inner = hd('処置') + `<div class="sub small">自分で行う処置です（約20分）。必要性と部位をよく確認しましょう。</div>` + S.PROCEDURES.map((x) => `<button class="drug" data-a="ppick" data-v="${x.id}"><b>${esc(x.name)}</b>${isRes() ? `<div class="why">${esc(PROC_ROLE[x.id])}</div>` : ''}</button>`).join('');
      break;
    case 'consult':
      inner = hd('コンサルト') + `<div class="sub small">専門医に相談します。返信まで30〜60分かかります。</div>` + Object.entries(S.DEPTS).map(([k, v]) => `<button class="drug" data-a="cpick" data-v="${k}"><b>${v}</b>${isRes() ? `<div class="why">${esc(DEPT_ROLE[k])}</div>` : ''}</button>`).join('');
      break;
    case 'dispo': {
      const ward = enc.phase !== 'er';
      inner = hd(ward ? '退院' : '方針決定') + (enc.finalDx ? '' : '<div class="card tight" style="border-color:var(--warn)">先に「鑑別」タブで最終診断を確定してください。</div>') +
        (ward ? `<div class="small">${S.dischargeReady(enc) ? '✅ 全身状態は安定しています。' : '⚠ まだ状態が安定していない可能性があります。'}</div><div class="sub small">退院後も続ける内服薬があれば、先に処方してください（点滴・酸素は終了します）。</div><button class="btn primary block" data-a="dpick" data-v="home" ${enc.finalDx ? '' : 'disabled'}>退院させる</button>`
          : `<div class="sub small">帰宅の場合、内服薬を処方してから選んでください（点滴・酸素は終了します）。</div>
          <button class="btn block" data-a="dpick" data-v="home" ${enc.finalDx ? '' : 'disabled'}>🏠 帰宅（外来治療）</button>
          <button class="btn block" data-a="dpick" data-v="admit" ${enc.finalDx ? '' : 'disabled'}>🛏 一般病棟に入院</button>
          <button class="btn block" data-a="dpick" data-v="icu" ${enc.finalDx ? '' : 'disabled'}>🏥 ICUに入院</button>`);
      break;
    }
    case 'hint': inner = modalHint(m, hd); break;
    case 'pharm':
      inner = hd(m.who === 'radio' ? '📞 放射線技師から確認' : '📞 薬剤師から疑義照会') +
        `<div class="sub small">${m.who === 'radio' ? '検査の前に確認させてください。' : '処方内容について確認させてください。'}</div>` +
        m.issues.map((i) => `<div class="card tight" style="border-color:${i.level === 'harm' ? 'var(--bad)' : 'var(--warn)'}">${i.level === 'harm' ? '⛔' : '⚠'} ${esc(i.msg)}</div>`).join('') +
        `<button class="btn primary block" data-a="pharmback">${m.who === 'radio' ? 'オーダーを見直す' : '処方を見直す'}</button><button class="btn block" data-a="pharmgo">このまま${m.who === 'radio' ? 'オーダー' : '処方'}する</button>`;
      break;
    case 'info':
      inner = hd(esc(m.title)) + `<div class="small">${m.html}</div><button class="btn primary block" data-a="${m.tut ? 'tut-ok' : 'close'}">OK</button>`;
      break;
  }
  $modal.innerHTML = `<div class="overlay" data-a="overlay"><div class="sheet" role="dialog">${inner}</div></div>`;
  if (m.type === 'ddxadd' && m.focus) { const el = document.getElementById('ddxq'); el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

function modalHint(m, hd) {
  const enc = game.enc;
  const a = approachOf(enc);
  const res = isRes();
  const open = m.open;
  const cost = (lv) => (res ? (lv === 1 ? '無料' : lv === 2 ? '経験値 −5%' : '経験値 −15%') : (lv === 1 ? '経験値 −5%' : lv === 2 ? '経験値 −10%' : '経験値 −25%'));
  const sec = (key, lv, title, body) => `<div class="card tight"><div class="row"><b class="grow">${title}</b>${open[key] ? '' : `<button class="chip" data-a="hintopen" data-k="${key}" data-l="${lv}">見る（${cost(lv)}）</button>`}</div>${open[key] ? `<div class="small" style="margin-top:6px">${body()}</div>` : ''}</div>`;
  const steps = () => { const n = nextSteps(enc); return n.length ? `<ul class="clean">${n.map((x) => `<li>${esc(x.text)}</li>`).join('')}</ul>` : '今の流れで大丈夫。焦らず進めよう。'; };
  const appr = () => a ? `<div>${esc(a.intro)}</div><b>危険なサイン</b><ul class="clean">${a.redflags.map((r) => `<li>${esc(r)}</li>`).join('')}</ul><b>主な鑑別</b><ul class="clean">${a.ddx.map((d) => `<li><b>${esc(DDX_BY_ID[d.id].name)}</b>：${esc(d.point)}${d.tests ? `<br><span class="sub">→ 疑ったら：${d.tests.map((t) => esc(TEST_BY_ID[t].name)).join('、')}</span>` : ''}</li>`).join('')}</ul>` : '';
  const reason = () => `<div class="sub small">主訴「${esc(a.title)}」の鑑別に、あなたが集めた所見を当てはめました。</div>` + ddxReasoning(enc).map((x) => `<div style="margin:8px 0"><b>${esc(x.name)}</b> <span class="sub small">${esc(x.point)}</span><div>${x.pro.map((t) => `<span class="tag pro">＋ ${esc(t)}</span>`).join('')}${x.con.map((t) => `<span class="tag con">− ${esc(t)}</span>`).join('')}</div>${x.unknown.length ? `<div class="sub small">未確認：${x.unknown.slice(0, 4).map(esc).join('、')}</div>` : ''}</div>`).join('');
  const tx = () => { const t = treatmentThinking(enc); return `${t.id ? `<div class="sub small">あなたの考える診断「${esc(DDX_BY_ID[t.id].name)}」の場合：</div>` : ''}<ul class="clean">${t.text.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`; };
  const ans = () => { const x = attendingAnswer(enc); return `<div style="font-size:16px"><b>${esc(x.name)}</b> だと思う。</div>${x.reasons.length ? `<div>根拠：${x.reasons.map(esc).join('、')}</div>` : ''}${x.look.length ? `<div class="sub small">確認するとよい所見：${x.look.map(esc).join('、')}</div>` : ''}<div style="margin-top:6px">${esc(x.overview || '')}</div><b>治療</b><ul class="clean">${x.treatment.map((t) => `<li>${esc(t)}</li>`).join('')}</ul><div>方針：${esc(x.dispo)}</div>`; };
  return hd('🧑‍⚕️ 指導医に相談') + `<div class="sub small">${res ? '「次にやること」と「主訴の考え方」は何度見ても無料です。' : '専攻医モードでは相談するたびに経験値が減ります。'}</div>` +
    sec('steps', 1, '① 次にやること', steps) +
    (a ? sec('appr', 1, `② 主訴「${esc(a.title)}」の考え方`, appr) : '') +
    (a ? sec('reason', 2, '③ 所見から考える（鑑別の整理）', reason) : '') +
    sec('tx', 2, '④ 治療の考え方', tx) +
    sec('ans', 3, '⑤ 指導医の答え（診断と治療）', ans);
}

function modalRx(m, hd) {
  const enc = game.enc;
  if (!m.drugId) {
    const q = (m.q || '').trim();
    const list = DRUGS.filter((d) => !q || d.generic.includes(q) || d.brands.some((b) => b.includes(q)) || d.cls.includes(q));
    const groups = [...new Set(list.map((d) => d.cls.split('（')[0]))];
    return hd('薬剤処方') + `<input class="input" id="rxq" placeholder="一般名・商品名で検索" value="${esc(q)}" data-input="rxq">` +
      groups.map((g) => `<h3>${esc(g)}</h3>${list.filter((d) => d.cls.startsWith(g)).map((d) => `<button class="drug" data-a="rxpick" data-v="${d.id}"><b>${esc(d.generic)}</b><span>${esc(d.brands.join('・'))}｜${Object.keys(d.routes).map((r) => ROUTE_LABEL[r]).join('・')}</span>${isRes() ? `<div class="why">${esc(DRUG_ROLE[d.id])}</div>` : ''}</button>`).join('')}`).join('');
  }
  const d = DRUG_BY_ID[m.drugId];
  const r = d.routes[m.route];
  const cc = crcl(enc, {});
  const knowsCr = enc.tests.some((x) => x.done && x.result.items?.some((i) => i.id === 'CR'));
  const doseChips = isRes() ? (d.id === 'insulin_r' ? [Math.round(enc.patient.weight * 0.1 * 10) / 10] : [...new Set([r.min, r.max])]) : [];
  return hd(esc(d.generic)) + `<div class="sub small">${esc(d.brands.join('・'))}｜${esc(d.cls)}</div>${isRes() ? `<div class="why">${esc(DRUG_ROLE[d.id])}</div>` : ''}
    <div class="field"><label>投与経路</label><div class="row wrap">${Object.keys(d.routes).map((k) => `<button class="chip ${m.route === k ? 'on' : ''}" data-a="rset" data-k="route" data-v="${k}">${ROUTE_LABEL[k]}</button>`).join('')}</div></div>
    <div class="field"><label>${r.freqs.includes('cont') ? '投与速度' : '1回量'}（${r.unit}）</label><input class="input" type="number" inputmode="decimal" step="any" id="rxdose" value="${m.dose ?? ''}" data-input="rxdose" placeholder="数値を入力">${doseChips.length ? `<div class="row wrap" style="margin-top:6px"><span class="sub small">通常量：</span>${doseChips.map((v) => `<button class="chip" data-a="dosechip" data-v="${v}">${v}${r.unit}${d.id === 'insulin_r' ? '（0.1単位/kg/時）' : ''}</button>`).join('')}</div>` : ''}</div>
    <div class="field"><label>投与頻度</label><div class="row wrap">${Object.entries(FREQS).filter(([k]) => (r.freqs.includes('cont') ? k === 'cont' : k !== 'cont')).map(([k, f]) => `<button class="chip ${m.freq === k ? 'on' : ''}" data-a="rset" data-k="freq" data-v="${k}">${f.label}</button>`).join('')}</div></div>
    ${m.freq !== 'once' && m.freq !== 'prn' ? `<div class="field"><label>投与期間</label><div class="row wrap">${[1, 2, 3, 5, 7, 10, 14].map((v) => `<button class="chip ${m.days === v ? 'on' : ''}" data-a="rset" data-k="days" data-v="${v}">${v}日</button>`).join('')}</div></div>` : ''}
    <details><summary>📄 添付文書情報（要約）</summary><div class="small" style="margin-top:6px">${esc(d.info)}
    ${d.renal ? `<div style="margin-top:6px"><b>腎機能による調節</b><br>${d.renal.map((x) => esc(x.text)).join('<br>')}</div>` : ''}
    <div class="sub small" style="margin-top:6px">${knowsCr ? `参考：この患者の推定CrCl 約${Math.round(cc)}mL/分（Cockcroft-Gault）` : '腎機能は生化学検査で確認できます。'}</div></div></details>
    <button class="btn primary block" data-a="rxok">処方する</button><button class="btn block" data-a="rxback">薬剤を選び直す</button>`;
}

// ========== 行動 ==========
function act(fn) {
  fn();
  afterAction();
}

function afterAction() {
  const enc = game.enc;
  if (enc && enc.ended && !enc.score) finishEncounter();
  persist();
  render();
}

function finishEncounter() {
  const enc = game.enc;
  enc.score = scoreCase(enc);
  const mode = enc.mode || 'expert';
  const hu = enc.hintUse || { l1: 0, l2: 0, l3: 0 };
  const hintPen = mode === 'resident' ? 0.05 * hu.l2 + 0.15 * hu.l3 : mode === 'senior' ? 0.05 * hu.l1 + 0.1 * hu.l2 + 0.25 * hu.l3 : 0;
  enc.score.xpMult = Math.round(MODES[mode].xp * Math.max(0.3, 1 - hintPen) * 100) / 100;
  enc.score.xp = Math.round(enc.score.total * enc.score.xpMult);
  game.profile.xp += enc.score.xp;
  const d = DISEASE_BY_ID[enc.patient.diseaseId];
  game.profile.seen = game.profile.seen || {};
  game.profile.seen[d.id] = true;
  game.profile.mastery = game.profile.mastery || {};
  const ms = game.profile.mastery[d.id] || { n: 0, best: 0, stars: 0 };
  const sc = enc.score.total;
  const st = sc >= 65 ? (mode === 'expert' && sc >= 80 && !hu.answer ? 3 : mode !== 'resident' && sc >= 80 && !hu.answer ? 2 : 1) : 0;
  game.profile.mastery[d.id] = { n: ms.n + 1, best: Math.max(ms.best, sc), stars: Math.max(ms.stars, st) };
  game.profile.cases.push({ date: new Date().toLocaleDateString('ja-JP'), dx: d.name, grade: enc.score.grade, score: enc.score.total, outcome: enc.score.outcome.kind, age: enc.patient.age, sex: enc.patient.sex, mode });
  if (game.profile.cases.length > 100) game.profile.cases.shift();
  ui.screen = 'debrief';
  ui.modal = null;
}

function newCase() {
  const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
  game.enc = S.newEncounter({ seed, month: new Date().getMonth() + 1, level: levelOf(game.profile.xp) });
  game.enc.mode = game.settings.mode;
  game.enc.hintUse = { l1: 0, l2: 0, l3: 0 };
  ui.tab = 'q'; ui.qcat = 'hpi'; ui.region = 'general'; ui.tcat = 'blood'; ui.sel.clear(); ui.paused = false;
  ui.screen = 'arrival';
  persist();
  render();
}

function advanceTo(minutes) {
  const enc = game.enc;
  S.advance(enc, minutes, { stopOnAlert: true });
}

const handlers = {
  newcase: newCase,
  resume: () => { ui.screen = 'encounter'; ui.paused = false; render(); },
  start: () => {
    ui.screen = 'encounter'; render();
    if (isRes() && !game.profile.tutorialSeen) openModal({ type: 'info', title: '🧑‍⚕️ 指導医より', tut: true, html: `ようこそ、研修医の先生。最初は私がそばについているから安心して。<ul class="clean"><li><b>★印</b>はこの主訴で特に大事な質問・診察・検査。小さい字の説明は「なぜそれをするか」。</li><li>迷ったら右下の<b>「🧑‍⚕️ 指導医」</b>ボタン。次にやること・考え方を教えるよ。答えも見られるけど、経験値が減るからできるだけ自分で考えてみて。</li><li>処方に問題があれば<b>薬剤師</b>が電話してくれる。なぜダメなのか読んで覚えよう。</li><li>終わったら振り返りで「模範的な流れ」を確認。慣れてきたら専攻医モード→専門医モードへ！</li></ul>` });
  },
  title: () => { ui.screen = 'title'; ui.modal = null; render(); },
  records: () => { ui.screen = 'records'; render(); },
  help: () => { ui.screen = 'help'; ui.modal = null; render(); },
  'toggle-rt': () => { game.settings.realtime = !game.settings.realtime; persist(); render(); },
  reset: () => { if (confirm('セーブデータ（レベル・記録・診療中の患者）をすべて消去しますか？')) { game = resetSave(); ui.screen = 'title'; render(); } },
  tab: (el) => { ui.tab = el.dataset.v; if (ui.tab !== 't') ui.sel.clear(); render(); },
  qcat: (el) => { ui.qcat = el.dataset.v; render(); },
  region: (el) => { ui.region = el.dataset.v; render(); },
  tcat: (el) => { ui.tcat = el.dataset.v; render(); },
  ask: (el) => act(() => S.ask(game.enc, el.dataset.v)),
  exam: (el) => { if (game.enc.examined[el.dataset.v] && !confirm('もう一度診察しますか？（時間が進みます）')) return; act(() => S.examine(game.enc, el.dataset.v)); },
  vitals: () => act(() => S.measureVitals(game.enc)),
  tsel: (el) => { const v = el.dataset.v; ui.sel.has(v) ? ui.sel.delete(v) : ui.sel.add(v); render(); },
  tclear: () => { ui.sel.clear(); render(); },
  torder: () => {
    const enc = game.enc, p = enc.patient;
    const ids = [...ui.sel];
    const go = () => { ui.sel.clear(); S.orderTests(enc, ids); };
    if (hintsOn()) {
      const iss = [];
      const rad = ids.filter((id) => TEST_BY_ID[id].radiation);
      const pregKnown = enc.asked.lmp || enc.tests.some((t) => t.id === 'uhcg' && t.done);
      if (rad.length && p.sex === 'F' && p.age >= 12 && p.age <= 55 && !pregKnown) iss.push({ level: 'warn', msg: '妊娠の可能性は確認しましたか？（被ばくを伴う検査です。問診で最終月経を聞くか、妊娠反応を）' });
      if (ids.some((id) => TEST_BY_ID[id].contrast)) {
        if (p.allergies.includes('contrast')) iss.push({ level: 'harm', msg: '患者さんに造影剤アレルギーの既往があります（本人に確認しました）。' });
        const crKnown = enc.tests.some((t) => t.done && t.result.items?.some((i) => i.id === 'CR'));
        if (!crKnown) iss.push({ level: 'warn', msg: '造影剤を使う前に腎機能（Cr・eGFR）を確認していますか？' });
      }
      const show = iss.filter((i) => (isRes() ? true : i.level === 'harm'));
      if (show.length) { openModal({ type: 'pharm', who: 'radio', issues: show, back: null, go }); return; }
    }
    act(go);
  },
  result: (el) => { const x = game.enc.tests[+el.dataset.v]; x.viewed = true; persist(); openModal({ type: 'result', i: +el.dataset.v }); render(); },
  waitnext: () => { const enc = game.enc; const nt = S.nextResultT(enc); closeModal(); if (nt) act(() => S.advance(enc, nt - enc.t, { stopOnAlert: false })); },
  seen: (el) => { game.enc.alerts[+el.dataset.i].seen = true; persist(); render(); },
  seenall: () => { game.enc.alerts.forEach((a) => (a.seen = true)); persist(); render(); },
  skip: () => openModal({ type: 'skip' }),
  menu: () => openModal({ type: 'menu' }),
  pause: () => { ui.paused = !ui.paused; closeModal(); render(); },
  adv: (el) => {
    const enc = game.enc;
    let m = el.dataset.v;
    if (m === 'morning') {
      const cur = (enc.patient.startHour * 60 + enc.patient.startMin + enc.t) % 1440;
      m = (1440 - cur + 480) % 1440 || 1440;
    }
    closeModal();
    act(() => advanceTo(+m));
  },
  auto: () => {
    const r = S.autoProgress(game.enc);
    afterAction();
    if (!game.enc.ended) openModal({ type: 'info', title: '経過観察', html: r === 'ready' ? '全身状態が安定し、退院可能な状態になりました。退院時の内服薬を処方してから「退院」を選んでください。' : r === 'alert' ? '状態の変化があり、経過観察を中断しました。通知とバイタルを確認してください。' : '入院が長期化しています。治療内容を見直してください。' });
  },
  // 鑑別
  ddxadd: () => openModal({ type: 'ddxadd', q: '' }),
  ddxpick: (el) => { S.addDdx(game.enc, el.dataset.v); persist(); closeModal(); render(); },
  ddxdel: (el) => { S.removeDdx(game.enc, el.dataset.v); persist(); render(); },
  conf: (el) => { const x = game.enc.ddx.find((d) => d.id === el.dataset.v); x.conf = Math.max(0, Math.min(100, x.conf + +el.dataset.d)); persist(); render(); },
  link: (el) => openModal({ type: 'link', id: el.dataset.v, all: false }),
  linkall: () => { ui.modal.all = !ui.modal.all; renderModal(); },
  linkset: (el) => {
    const x = game.enc.ddx.find((d) => d.id === ui.modal.id);
    const k = el.dataset.k, s = el.dataset.s, o = s === 'pro' ? 'con' : 'pro';
    x[o] = x[o].filter((y) => y !== k);
    x[s] = x[s].includes(k) ? x[s].filter((y) => y !== k) : x[s].concat(k);
    persist(); renderModal(); render();
  },
  finaldx: () => openModal({ type: 'finaldx', sel: new Set(game.enc.finalDx?.ids || []), und: game.enc.finalDx?.undetermined || false }),
  fdpick: (el) => { const s = ui.modal.sel; s.has(el.dataset.v) ? s.delete(el.dataset.v) : s.add(el.dataset.v); renderModal(); },
  fdund: () => { ui.modal.und = !ui.modal.und; renderModal(); },
  fdok: () => { S.setFinalDx(game.enc, [...ui.modal.sel], ui.modal.und); closeModal(); afterAction(); },
  // 治療
  rx: () => openModal({ type: 'rx', q: '' }),
  rxpick: (el) => {
    const d = DRUG_BY_ID[el.dataset.v];
    const route = Object.keys(d.routes)[0];
    const r = d.routes[route];
    openModal({ type: 'rx', drugId: d.id, route, freq: r.freqs[0], days: r.freqs.includes('cont') ? 2 : 5, dose: null });
  },
  rxback: () => openModal({ type: 'rx', q: '' }),
  rset: (el) => {
    const m = ui.modal;
    const k = el.dataset.k;
    m[k] = k === 'days' ? +el.dataset.v : el.dataset.v;
    if (k === 'route') { const r = DRUG_BY_ID[m.drugId].routes[m.route]; m.freq = r.freqs[0]; }
    const di = document.getElementById('rxdose'); if (di && di.value !== '') m.dose = di.value;
    renderModal();
  },
  rxok: () => {
    const m = ui.modal;
    const dose = parseFloat(document.getElementById('rxdose').value);
    if (!(dose > 0)) { alert('用量を入力してください'); return; }
    const order = { drugId: m.drugId, route: m.route, dose, freq: m.freq, days: m.days };
    const go = () => S.prescribe(game.enc, order);
    if (hintsOn()) {
      const enc = game.enc;
      const ev = evaluateRx(enc, order, S.currentVitals(enc), enc.orders.filter((o) => S.isOrderActive(enc, o)));
      const iss = ev.issues.filter((i) => (isRes() ? i.level !== 'info' : i.level === 'harm'));
      if (iss.length) { enc.pharmCalls = (enc.pharmCalls || 0) + 1; openModal({ type: 'pharm', issues: iss, back: { ...m, dose }, go }); return; }
    }
    closeModal();
    act(go);
  },
  fluid: () => openModal({ type: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 500, rate: 80 }),
  fset: (el) => { const k = el.dataset.k; ui.modal[k] = ['volume', 'rate'].includes(k) ? +el.dataset.v : el.dataset.v; renderModal(); },
  fok: () => {
    const m = ui.modal;
    const order = { fluidId: m.fluidId, mode: m.mode, volume: m.volume, rate: m.rate };
    const go = () => S.addFluid(game.enc, order);
    if (hintsOn()) {
      const iss = evaluateFluid(game.enc, order).issues.filter((i) => (isRes() ? i.level !== 'info' : i.level === 'harm'));
      if (iss.length) { openModal({ type: 'pharm', issues: iss, back: { ...m }, go }); return; }
    }
    closeModal(); act(go);
  },
  o2: () => openModal({ type: 'o2', device: 'nc', flow: 2 }),
  oset: (el) => { const k = el.dataset.k; ui.modal[k] = k === 'flow' ? +el.dataset.v : el.dataset.v; if (k === 'device') { const D = O2_DEVICES.find((d) => d.id === ui.modal.device); ui.modal.flow = D.flow[0]; } renderModal(); },
  ook: () => { const m = ui.modal; closeModal(); act(() => S.setO2(game.enc, m.device, m.flow)); },
  ostop: () => { closeModal(); act(() => S.setO2(game.enc, null)); },
  npo: () => act(() => S.setNPO(game.enc, !game.enc.orders.some((o) => o.kind === 'npo' && S.isOrderActive(game.enc, o)))),
  stop: (el) => { if (confirm('この指示を中止しますか？')) act(() => S.stopOrder(game.enc, +el.dataset.v)); },
  consult: () => openModal({ type: 'consult' }),
  proc: () => openModal({ type: 'proc' }),
  ppick: (el) => { const P = S.PROCEDURES.find((x) => x.id === el.dataset.v); if (!confirm(`${P.name}を行いますか？`)) return; closeModal(); act(() => S.procedure(game.enc, P.id)); },
  cpick: (el) => { closeModal(); act(() => S.consult(game.enc, el.dataset.v)); },
  dispo: () => openModal({ type: 'dispo' }),
  dpick: (el) => { const v = el.dataset.v; closeModal(); act(() => (v === 'home' ? S.discharge(game.enc) : S.dispose(game.enc, v))); },
  'tab-log-debrief': () => openModal({ type: 'info', title: 'カルテ', html: `<div class="log">${game.enc.log.map((e) => `<div class="e"><div class="tm">${clockOf(game.enc, e.t)} ${e.label ? '· ' + esc(e.label) : ''}</div>${esc(e.text)}</div>`).join('')}</div>` }),
  close: closeModal,
  mode: (el) => { game.settings.mode = el.dataset.v; persist(); render(); },
  library: () => { ui.prevScreen = ui.screen; ui.screen = 'library'; ui.modal = null; render(); },
  libraryenc: () => { ui.prevScreen = 'encounter'; ui.screen = 'library'; ui.modal = null; ui.paused = true; render(); },
  libtab: (el) => { ui.libTab = el.dataset.v; render(); },
  hint: () => { const res = isRes(); openModal({ type: 'hint', open: res ? { steps: true } : {} }); },
  hintopen: (el) => {
    const enc = game.enc;
    const k = el.dataset.k, lv = +el.dataset.l;
    if (lv === 3 && !confirm('答えを見ますか？（経験値が減ります）')) return;
    ui.modal.open[k] = true;
    const free = isRes() && lv === 1;
    if (!free) { enc.hintUse = enc.hintUse || { l1: 0, l2: 0, l3: 0 }; enc.hintUse['l' + lv]++; }
    if (lv === 3) enc.hintUse.answer = true;
    persist(); renderModal();
  },
  dosechip: (el) => { const i = document.getElementById('rxdose'); i.value = el.dataset.v; ui.modal.dose = el.dataset.v; },
  pharmback: () => { const m = ui.modal; if (m.back) openModal(m.back); else closeModal(); },
  pharmgo: () => { const m = ui.modal; closeModal(); game.enc.pharmOverride = (game.enc.pharmOverride || 0) + 1; act(m.go); },
  'tut-ok': () => { game.profile.tutorialSeen = true; persist(); closeModal(); },
  overlay: (el, ev) => { if (ev.target === el) closeModal(); },
};

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-a]');
  if (!el) return;
  const h = handlers[el.dataset.a];
  if (!h) return;
  if (el.dataset.a !== 'overlay') ev.stopPropagation();
  h(el, ev);
});

document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (!el.dataset.input || !ui.modal) return;
  if (el.dataset.input === 'ddxq' || el.dataset.input === 'rxq') { ui.modal.q = el.value; ui.modal.focus = true; renderModal(); const i = document.getElementById(el.id); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
  if (el.dataset.input === 'rxdose') ui.modal.dose = el.value;
});

// ========== 緊迫モード（リアルタイム進行） ==========
let rtTimer = null;
function setupRealtime() {
  const enc = game.enc;
  const on = ui.screen === 'encounter' && enc && !enc.ended && enc.urgent && game.settings.realtime && enc.phase === 'er' && !ui.paused && !document.hidden && !(enc.mode === 'resident' && ui.modal);
  if (on && !rtTimer) {
    rtTimer = setInterval(() => {
      const e = game.enc;
      if (!e || e.ended || e.phase !== 'er' || ui.paused || document.hidden || ui.screen !== 'encounter' || (e.mode === 'resident' && ui.modal)) { clearInterval(rtTimer); rtTimer = null; return; }
      const before = e.alerts.length;
      S.advance(e, 1);
      if (e.ended) { afterAction(); return; }
      persist();
      if (e.alerts.length !== before || !ui.modal) render();
      else { const tb = document.getElementById('topbar'); if (tb) tb.outerHTML = topbar(); }
    }, 4000);
  } else if (!on && rtTimer) { clearInterval(rtTimer); rtTimer = null; }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) ui.paused = ui.paused || (game.enc?.urgent ?? false); setupRealtime(); });

render();
