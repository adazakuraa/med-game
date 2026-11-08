// 問診の回答・身体所見・検査レポートの生成
import { DISEASE_BY_ID } from '../data/diseases/index.js';
import { QUESTION_BY_ID } from '../data/questions.js';
import { EXAM_BY_ID } from '../data/exams.js';
import { TEST_BY_ID } from '../data/tests.js';
import { HOME_MEDS } from '../data/drugs.js';
import { COMORB, ALLERGY_BY_ID } from './patient.js';
import { hashRand } from './rng.js';

export function fmt(s, vars) {
  return String(s).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`));
}

/** 処置・ドレナージの有無で表示を切り替える所見の判定 */
export function visibleNow(enc, f) {
  const st = enc.state, side = enc.patient.vars.side;
  if (f.ifProc && !st.procDone?.[f.ifProc]) return false;
  if (f.unlessProc && st.procDone?.[f.unlessProc]) return false;
  if (f.ifDrain && !st.drains?.[side]) return false;
  if (f.unlessDrain && st.drains?.[side]) return false;
  if (f.maxBurden != null && st.burden > f.maxBurden) return false;
  return true;
}

function pickText(entry, sev, idx) {
  if (entry.bySev) return entry.bySev[sev];
  if (entry.texts) return entry.texts[idx % entry.texts.length];
  return entry.text;
}

const PMH_SPEAK = {
  htn: '高血圧', dm2: '糖尿病（飲み薬で治療中）', chf: '心不全（以前入院したことがあります）', af: '不整脈（心房細動）',
  ckd: '腎臓の機能が悪いと言われています', dyslip: 'コレステロールが高いこと', bph: '前立腺肥大', glaucoma: '緑内障（眼科で治療中）',
  pud: '胃潰瘍（今も薬を飲んでいます）', cancer: '大腸がんで抗がん剤治療中です', asthma: '喘息で吸入薬を使っています', copd: 'COPD（肺気腫）と言われています', asthma_nsaid: '喘息（痛み止めで発作が出たことがあります）', constip: '便秘', epilepsy: 'てんかん',
};

function profileAnswer(enc, qid) {
  const p = enc.patient;
  switch (qid) {
    case 'pmh': {
      const items = [];
      if (p.comorb.includes('t1dm')) items.push(`${p.vars.dmYears ?? 5}年前から1型糖尿病でインスリンを使っています`);
      for (const c of p.comorb) if (PMH_SPEAK[c]) items.push(PMH_SPEAK[c]);
      return items.length ? items.join('、') + '。' : '特に大きな病気はしていません。';
    }
    case 'surgery':
      return p.surgeryHx.length ? `${p.surgeryHx.join('、')}を受けたことがあります。` : '手術は受けたことがありません。';
    case 'meds': {
      const meds = p.homeMeds.filter((m) => m !== 'sildenafil').map((m) => HOME_MEDS[m].name);
      let s = meds.length ? `${meds.join('、')}を使っています。` : '普段飲んでいる薬はありません。';
      if (p.homeMeds.includes('sildenafil')) s += '……あと、たまにシルデナフィル（バイアグラ）を使っています。';
      return s;
    }
    case 'adherence':
      if (!p.homeMeds.length) return '普段飲んでいる薬はありません。';
      return 'はい、きちんと飲んでいます。';
    case 'allergy':
      return p.allergies.length
        ? p.allergies.map((a) => `${ALLERGY_BY_ID[a].name}で${ALLERGY_BY_ID[a].reaction}`).join('。') + '。'
        : '特にアレルギーはありません。';
    case 'lmp':
      if (p.sex !== 'F') return '（男性のため該当なし）';
      if (p.age >= 52) return '閉経しています。';
      if (p.pregnant) return '最後の生理は7週間くらい前です。少し遅れています……。';
      return '2週間ほど前でした。妊娠の可能性はないと思います。';
    case 'smoking':
      return { never: '吸いません。', former: '以前は吸っていましたが、10年前にやめました。', current: '1日20本くらい吸っています。' }[p.smoking];
    case 'alcohol':
      return { none: '飲みません。', social: '付き合いで時々飲む程度です。', daily: '毎日ビールを2〜3缶飲みます。' }[p.alcohol];
    case 'occupation':
      return `${p.occupation}です。`;
    case 'family':
      return p.family;
    default:
      return '';
  }
}

/** 問診の回答 */
export function answer(enc, qid, jcs = 0) {
  const p = enc.patient, d = DISEASE_BY_ID[p.diseaseId];
  const q = QUESTION_BY_ID[qid];
  const h = d.history?.[qid];
  const roll = p.rolls.history[qid];
  let text;
  let positive = false;
  if (h && roll?.on && pickText(h, p.sev, roll.idx)) {
    text = fmt(pickText(h, p.sev, roll.idx), p.vars);
    positive = true;
  } else if (q.profile) {
    text = profileAnswer(enc, qid);
    positive = !/ありません|吸いません|飲みません|特に/.test(text);
  } else {
    text = q.no;
  }
  if (jcs >= 100) return { text: '（本人は応答できない。付き添いの家族）' + (q.profile ? text : 'そこまではわかりません。'), positive: q.profile ? positive : false };
  if (jcs >= 10) return { text: '（付き添いの家族）' + text, positive };
  return { text, positive };
}

/** 身体所見 */
export function examFinding(enc, eid, vit) {
  const p = enc.patient, d = DISEASE_BY_ID[p.diseaseId], st = enc.state;
  const ex = EXAM_BY_ID[eid];
  const out = [];
  const e = d.exam?.[eid];
  if (e) {
    const arr = Array.isArray(e) ? e : [e];
    arr.forEach((f, i) => {
      if (!p.rolls.exam[eid]?.[i]) return;
      if (!visibleNow(enc, f)) return;
      if (f.minBurden && st.burden < f.minBurden) return;
      if (!f.minBurden && st.burden < 8 && eid !== 'gen_appear') return; // 治癒後は所見消失
      const t = pickText(f, p.sev, i);
      if (t) out.push(fmt(t, { ...p.vars, SBP: vit.SBP, SBPL: vit.SBP - (p.vars.bpDiff || 0) }));
    });
  }
  // 治療・回復で全身状態の表現を変える
  if (eid === 'gen_appear' && st.burden < 15) out.length = 0;
  // 状態から導出される所見
  const derived = [];
  const vol = st.volume;
  switch (eid) {
    case 'gen_consc':
      out.length = 0;
      derived.push(vit.JCS === 0 ? '意識清明（JCS 0）。見当識良好。' : `意識障害あり（JCS ${vit.JCS}）。${vit.JCS >= 10 ? '呼びかけで開眼する。' : '見当識がやや曖昧。'}`);
      break;
    case 'oral_mucosa': if (vol > 1500) derived.push('口腔粘膜・舌は乾燥。'); break;
    case 'skin_turgor': if (vol > 2500) derived.push('皮膚ツルゴール低下（つまみ上げた皮膚の戻りが2秒以上）。'); break;
    case 'jvd':
      if (vol > 1500) derived.push('頸静脈は虚脱（臥位でも視認しにくい）。');
      else if (vol < -1200 && !out.length) derived.push('頸静脈怒張あり。');
      break;
    case 'periph':
      if (vit.SBP < 90 || vol > 3500) derived.push('四肢末梢冷感あり。CRT 3秒以上。');
      else if (vit.T >= 38.5 && !out.length) derived.push('四肢は温かい。CRT 2秒未満。');
      break;
    case 'chest_insp': if (!out.length && vit.RR >= 24) derived.push(`頻呼吸（呼吸数 ${vit.RR}回/分）。`); break;
    case 'heart_ausc':
      if (p.comorb.includes('af') || (d.id === 'af_rvr' && !st.procDone?.dcv)) derived.unshift(`心音不整（絶対性不整脈、${vit.HR}/分）。`);
      else if (vit.HR > 110) derived.push(`頻脈（${vit.HR}/分）。`);
      break;
    case 'abd_insp': if (p.surgeryHx.length) derived.push(`腹部平坦。${p.surgeryHx[0]}の手術痕あり。`); break;
    case 'gen_appear':
      if (!out.length && st.burden >= 15) derived.push('ややつらそうな様子。');
      if (!out.length && st.burden < 15) derived.push('表情は穏やかで、会話も楽にできる。');
      if (st.anaphylaxis && !st.anaphylaxis.resolved && enc.t >= st.anaphylaxis.t) derived.push('全身に膨疹・紅潮。喘鳴あり。');
      break;
    case 'leg_edema': if (p.homeMeds.includes('amlodipine') && hashRand(p.seed, 'amlo') < 0.15 && !out.length) derived.push('両足首に軽度の圧痕性浮腫。'); break;
    case 'bp_lr': if (!out.length) derived.push(`上肢血圧に明らかな左右差なし（右 ${vit.SBP} / 左 ${vit.SBP - 3}mmHg）。橈骨動脈の触知良好。`); break;
    case 'lung_ausc': if (st.anaphylaxis && !st.anaphylaxis.resolved && enc.t >= st.anaphylaxis.t) derived.push('両側で呼気性wheezes。'); break;
  }
  const all = out.concat(derived);
  return { text: all.length ? all.join(' ') : ex.normal, abnormal: all.length > 0 && eid !== 'gen_consc' ? true : vit.JCS > 0 && eid === 'gen_consc' };
}

/** 画像・培養・定性検査のレポート（オーダー時点の状態で確定） */
export function testReport(enc, tid, vit, k) {
  const p = enc.patient, d = DISEASE_BY_ID[p.diseaseId], st = enc.state;
  const T = TEST_BY_ID[tid];
  if (T.kind === 'qual') {
    let pos = false;
    if (tid === 'uhcg') pos = p.pregnant;
    else if (d.tests?.[tid] && !Array.isArray(d.tests[tid])) pos = p.rolls.tests[tid];
    if (!pos && tid !== 'uhcg') pos = hashRand(p.seed, 'fp', tid) > T.spec;
    if (tid === 'uhcg' && !p.pregnant) pos = false;
    if (tid === 'uhcg' && p.sex === 'M') return { text: '陰性', abnormal: false };
    return { text: pos ? T.pos : T.neg, abnormal: pos };
  }
  if (T.kind === 'ecg') {
    const parts = [];
    const af = p.comorb.includes('af') || (d.id === 'af_rvr' && !st.procDone?.dcv);
    parts.push(af ? `心房細動（心拍数 約${vit.HR}/分）。` : vit.HR > 100 ? `洞性頻脈（${vit.HR}/分）。` : `洞調律（${vit.HR}/分）。`);
    (d.ecg || []).forEach((f, i) => { if (p.rolls.ecg[i] && visibleNow(enc, f)) parts.push(fmt(f.text, p.vars)); });
    if (k >= 7.0) parts.push('テント状T波、P波の消失、QRS幅の拡大。');
    else if (k >= 6.0) parts.push('テント状T波。');
    else if (k < 3.0) parts.push('T波平低化、U波あり。QT延長傾向。');
    if (parts.length === 1) parts.push('明らかなST-T変化なし。');
    return { text: parts.join(' '), abnormal: parts.length > 1 && !parts[1].startsWith('明らか') || af || vit.HR > 100 };
  }
  // report
  const fs = d.tests?.[tid];
  const out = [];
  if (Array.isArray(fs)) {
    fs.forEach((f, i) => {
      if (!p.rolls.tests[tid]?.[i]) return;
      if (!visibleNow(enc, f)) return;
      if (f.minBurden && st.burden < f.minBurden) return;
      if (!f.minBurden && !f.persist && st.burden < 6 && !['ucx', 'bcx', 'sputum_cx'].includes(tid)) return;
      if (['ucx', 'bcx', 'sputum_cx', 'urine_gram', 'sputum_gram'].includes(tid) && enc.abxStartT != null && enc.t - enc.abxStartT > 360 && hashRand(p.seed, 'cxneg', tid) < 0.6) return; // 抗菌薬投与後の検体は陰性化しやすい
      out.push(fmt(f.text, p.vars));
    });
  }
  // 背景疾患による所見
  if (tid === 'cxr' && !out.length && p.comorb.includes('chf')) out.push('CTR 約55%の軽度心拡大。肺野に明らかな浸潤影なし。');
  if (tid === 'echo' && !out.length && p.comorb.includes('chf')) out.push('LVEF 約40%。びまん性の軽度壁運動低下。下大静脈径 15mm、呼吸性変動あり。');
  return { text: out.length ? out.join(' ') : T.normal, abnormal: out.length > 0 };
}
