/* 道诡异仙：诳语双界 — engine
 * 状态机 + 场景/动作/诳语/结局渲染。内容由 content.js 提供。
 */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const ACT_TIME = { 1: 3, 2: 5, 3: 3 };
  const CARRY_CAP = 3;
  const ACT_NAME = ['一', '二', '三'];

  const Game = {
    content: null,
    state: null,
    panel: null,

    init(content) {
      this.content = content;
      this.state = this.freshState();
      this.bind();
      this.render();
    },

    freshState() {
      return {
        v: 2,
        act: 1,
        scene: 'ward',
        time: ACT_TIME[1],
        daoyun: 0,
        suspicion: { zhang: 0, doctor: 0, danyang: 0, xuanyang: 0 },
        belief: { zhang: 1, doctor: 2, danyang: 2, xuanyang: 0 },
        inventory: [],
        knowledge: [],
        said: [],
        flags: {},
        counters: {},
        log: [{ kind: 'start', text: '熄灯之后。你听见隔壁床在磨牙。' }],
        ending: null,
        finalLie: null,
        crosses: 0,
        turn: 0
      };
    },

    // ---------- 查询 ----------
    hasItem(id) { return this.state.inventory.includes(id); },
    hasKnowledge(id) { return this.state.knowledge.includes(id); },
    hasFlag(k) { return !!this.state.flags[k]; },
    item(id) { return this.content.items[id] || { name: id, desc: '' }; },
    know(id) { return this.content.knowledge[id] || { name: id, desc: '' }; },
    npc(id) { return this.content.npcs[id] || { name: id }; },
    scene() { return this.content.scenes[this.state.scene] || this.content.scenes.ward; },
    loc() { return this.content.locations[this.scene().location] || { name: '', world: 'real' }; },

    // ---------- 变更 ----------
    addItem(id, silent) {
      const it = this.item(id);
      if (this.state.inventory.length >= CARRY_CAP) {
        const dropped = this.state.inventory.shift();
        this.state.daoyun += 2;
        this.log(`怀里的${this.item(dropped).name}滑脱了，落回原处。你眼前黑了一瞬。`, 'cost');
      }
      this.state.inventory.push(id);
      if (!silent) this.log(`你把${it.name}带在身上。`, 'gain');
    },
    removeItem(id) {
      const i = this.state.inventory.indexOf(id);
      if (i >= 0) this.state.inventory.splice(i, 1);
    },
    addKnowledge(id, silent) {
      if (this.state.knowledge.includes(id)) return;
      this.state.knowledge.push(id);
      if (!silent) this.log(`你记住了：${this.know(id).name}`, 'know');
    },
    setFlag(k, v) { this.state.flags[k] = v === undefined ? true : v; },
    log(text, kind) {
      this.state.log.push({ kind: kind || 'narr', text });
      if (this.state.log.length > 60) this.state.log.shift();
      this.renderLog();
    },
    toast(text, ms) {
      const el = $('#toast');
      el.textContent = text;
      el.classList.add('show');
      clearTimeout(this._toastT);
      this._toastT = setTimeout(() => el.classList.remove('show'), ms || 2400);
    },

    // ---------- 条件 ----------
    check(cond) {
      if (!cond) return true;
      if (cond.item && !this.hasItem(cond.item)) return false;
      if (cond.noItem && this.hasItem(cond.noItem)) return false;
      if (cond.knowledge && !this.hasKnowledge(cond.knowledge)) return false;
      if (cond.noKnowledge && this.hasKnowledge(cond.noKnowledge)) return false;
      if (cond.flag && !this.hasFlag(cond.flag)) return false;
      if (cond.noFlag && this.hasFlag(cond.noFlag)) return false;
      if (cond.act && this.state.act !== cond.act) return false;
      if (cond.minDaoyun != null && this.state.daoyun < cond.minDaoyun) return false;
      if (cond.maxDaoyun != null && this.state.daoyun > cond.maxDaoyun) return false;
      if (cond.minTime != null && this.state.time < cond.minTime) return false;
      if (cond.belief) for (const k in cond.belief) if ((this.state.belief[k] || 0) < cond.belief[k]) return false;
      return true;
    },
    visibleActions() { return (this.scene().actions || []).filter(a => this.check(a.cond)); },
    visibleExits() { return (this.scene().exits || []).filter(e => this.check(e.cond)); },

    // ---------- 行动 ----------
    chooseAction(a) {
      if (this.state.ending) return;
      const cost = a.cost || {};
      if (cost.time && this.state.time < cost.time) { this.toast('这一夜已经不够了。'); return; }
      if (a.confirm && !window.confirm(a.confirm)) return;
      this.applyAction(a);
    },

    applyAction(a) {
      const cost = a.cost || {};
      this.state.time -= cost.time || 0;
      if (cost.daoyun) this.state.daoyun += cost.daoyun;
      this.state.turn++;
      if (a.effect) a.effect(this);
      if (a.result) this.applyResult(a.result);
      if (a.goto) this.state.scene = a.goto;
      this.afterAction();
    },

    applyResult(res) {
      if (res.text) this.log(res.text, 'result');
      if (res.daoyun) this.state.daoyun += res.daoyun;
      if (res.suspicion) for (const k in res.suspicion) this.state.suspicion[k] = (this.state.suspicion[k] || 0) + res.suspicion[k];
      if (res.belief) for (const k in res.belief) this.state.belief[k] = Math.max(0, Math.min(3, (this.state.belief[k] || 0) + res.belief[k]));
      if (res.knowledge) res.knowledge.forEach(k => this.addKnowledge(k));
      if (res.flag) for (const k in res.flag) this.setFlag(k, res.flag[k]);
      if (res.goto) this.state.scene = res.goto;
    },

    afterAction() {
      if (this.state.ending) { this.render(); return; }
      this.state.daoyun = Math.max(0, Math.min(10, this.state.daoyun));
      if (this.state.daoyun >= 10) return this.setEnding('end_delirium');
      if (this.state.suspicion.zhang >= 3 && this.state.act === 1) return this.setEnding('fail_zhang');
      if (this.state.suspicion.doctor >= 3) return this.setEnding('fail_doctor');
      if (this.state.time <= 0) return this.endAct();
      this.render();
    },

    // ---------- 跨界 ----------
    crossTo(sceneId, opts) {
      const o = opts || {};
      const pair = this.content.pairs;
      const changed = [];
      this.state.inventory = this.state.inventory.map(id => {
        if (pair[id]) { changed.push([id, pair[id]]); return pair[id]; }
        return id;
      });
      const cost = o.cost != null ? o.cost : 1;
      this.state.daoyun += cost;
      this.state.crosses++;
      this.state.scene = sceneId;
      this.state.turn++;
      const target = this.content.locations[this.content.scenes[sceneId].location] || {};
      const toWorld = target.world;
      if (changed.length) {
        this.log('你睁开眼。' + changed.map(([a, b]) => `怀里的${this.item(a).name}变成了${this.item(b).name}`).join('，') + '。', 'cross');
      } else {
        this.log(toWorld === 'real' ? '你睁开眼，回到这边。' : '你闭上眼，那边亮了起来。', 'cross');
      }
      this.afterAction();
    },

    // ---------- 幕 ----------
    endAct() {
      const h = this.content.actEnd[this.state.act];
      if (h) return h(this);
      this.gotoAct(this.state.act + 1);
    },
    gotoAct(n) {
      if (n > 3) return this.resolveEnding();
      this.state.act = n;
      this.state.time = ACT_TIME[n];
      this.state.scene = this.content.actStart[n];
      this.state.ending = null;
      this.state.finalLie = null;
      this.log(`第${ACT_NAME[n - 1]}幕 · ${this.content.actTitles[n]}`, 'act');
      this.render();
      if (this.panel) this.renderPanel();
      this.toast(`第${ACT_NAME[n - 1]}幕：${this.content.actTitles[n]}`);
    },

    finalLie(who) {
      this.state.finalLie = who;
      if (who === 'doctor') this.log('“都是幻觉。”你听见自己说。李医生的笔在纸上顿了一下。', 'said');
      if (who === 'bailing') this.log('“跟我走。”你握紧了她的手。', 'said');
      if (who === 'self') this.log('“两边都有鬼。”你说。', 'said');
      if (who === 'yang') this.log('“我没病。”你说。杨娜抬起头。', 'said');
      this.resolveEnding();
    },

    resolveEnding() {
      const id = this.content.resolve(this);
      this.setEnding(id);
    },

    setEnding(id) {
      this.state.ending = { id, kind: (this.content.endings[id] || {}).kind || 'ending' };
      this.render();
    },

    // ---------- 诳语 ----------
    openKuangyu(targetId) {
      const sc = this.scene();
      const k = (sc.kuangyu || []).find(x => x.target === targetId);
      if (!k) { this.toast('现在不是说这话的时候。'); return; }
      this.panel = {
        targetId,
        target: this.npc(targetId),
        k,
        claims: k.claims.filter(c => this.check(c.cond)),
        evidence: this.evidenceList(),
        choice: { claim: null, evidence: null }
      };
      this.renderPanel();
    },

    evidenceList() {
      const list = [];
      this.state.inventory.forEach(id => list.push({ id, name: this.item(id).name, kind: 'item', desc: this.item(id).desc }));
      this.state.knowledge.forEach(id => list.push({ id, name: this.know(id).name, kind: 'knowledge', desc: this.know(id).desc }));
      ['tianshu_tablet', 'jade_lost'].forEach(f => { if (this.hasFlag(f) && !list.find(x => x.id === f)) list.push({ id: f, name: f === 'tianshu_tablet' ? '天书石板' : '那块不在了的玉', kind: 'flag', desc: '' }); });
      return list;
    },

    resolveKuangyu() {
      const p = this.panel;
      if (!p) return;
      if (!p.choice.claim) { this.toast('先挑一句要说的话。'); return; }
      const claim = p.claims.find(c => c.id === p.choice.claim);
      const ev = p.choice.evidence ? p.evidence.find(e => e.id === p.choice.evidence) : null;
      const tid = p.targetId;
      const key = tid + ':' + claim.id;
      const used = this.state.counters[key] || 0;
      let score = (claim.weight || 1)
        + (ev ? (claim.likes && claim.likes.includes(ev.id) ? 2 : 0.5) : 0)
        + (this.state.belief[tid] || 0)
        - (this.state.suspicion[tid] || 0) * 1.5
        - Math.floor(this.state.daoyun / 3)
        - used * 1.5;
      let tier = score >= 3 ? 'believe' : score >= 1 ? 'half' : 'reject';
      if (claim.contradicts) {
        for (const c of claim.contradicts) if (this.hasKnowledge(c) || this.hasFlag(c)) { tier = 'caught'; break; }
      }
      if (tier === 'caught' && !claim.outcomes.caught) tier = 'reject';
      const outcome = claim.outcomes[tier] || claim.outcomes.half || claim.outcomes.reject || {};
      this.state.counters[key] = used + 1;
      this.state.said.push({ target: tid, claim: claim.id, label: claim.label, evidence: ev ? ev.name : null, tier, at: this.state.turn });
      if (outcome.text) this.log(outcome.text, 'said');
      if (outcome.belief) this.state.belief[tid] = Math.max(0, Math.min(3, (this.state.belief[tid] || 0) + outcome.belief));
      if (outcome.suspicion) this.state.suspicion[tid] = Math.max(0, (this.state.suspicion[tid] || 0) + outcome.suspicion);
      if (outcome.flag) for (const k in outcome.flag) this.setFlag(k, outcome.flag[k]);
      if (outcome.knowledge) outcome.knowledge.forEach(k => this.addKnowledge(k));
      if (outcome.daoyun) this.state.daoyun += outcome.daoyun;
      if (claim.consume) this.removeItem(claim.consume);
      if (tid === 'zhang' && this.state.act === 1) this.setFlag('zhang_done');
      this.state.time -= 1;
      this.panel = null;
      const succeeded = tid === 'danyang' && this.hasFlag('danyang_ate');
      if (!succeeded && this.state.time > 0) {
        // 没骗过、但还没到时辰：留在原地，可以换一句话再说
        const sc = this.scene();
        this.panel = { targetId: tid, target: p.target, k: p.k, claims: p.claims.filter(c => this.check(c.cond)), evidence: this.evidenceList(), choice: { claim: null, evidence: null } };
      }
      this.render();
      this.renderPanel();
      this.showResult(tier, claim.label, ev, outcome.text);
      this.afterAction();
      if (this.state.act === 2 && succeeded && !this.state.ending) this.endAct();
    },

    showResult(tier, label, ev, text) {
      const box = $('#result');
      const tierText = { believe: '他信了', half: '他将信将疑', reject: '他不信', caught: '他识破了' }[tier] || '';
      box.className = 'result show ' + tier;
      box.innerHTML = `<div class="res-tier">${tierText}</div>
        <div class="res-title">「${label}」${ev ? `<em>（出示：${ev.name}）</em>` : ''}</div>
        <p>${text || '……'}</p>
        <button class="btn" data-close-result>继续</button>`;
    },

    // ---------- 渲染 ----------
    render() {
      if (this.state.ending && this.content.endings[this.state.ending.id]) return this.renderEnding(this.state.ending.id);
      const st = this.state;
      const sc = this.scene();
      const loc = this.loc();
      document.body.dataset.world = loc.world || 'real';
      $('#act-label').textContent = `第${ACT_NAME[st.act - 1]}幕 · ${this.content.actTitles[st.act] || ''}`;
      $('#scene-loc').textContent = loc.name || '';
      $('#scene-title').textContent = sc.title || '';
      $('#scene-objective').textContent = sc.objective || '';
      $('#scene-text').innerHTML = this.sceneText(sc);
      $('#hud-time').textContent = st.time;
      $('#hud-daoyun').textContent = st.daoyun;
      const bar = $('#hud-daoyun-bar');
      bar.style.width = (st.daoyun * 10) + '%';
      bar.dataset.level = st.daoyun >= 8 ? 'high' : st.daoyun >= 5 ? 'mid' : 'low';
      this.renderActions();
      this.renderInventory();
      this.renderNpcs();
      this.renderSaid();
      this.renderLog();
      this.renderArt(sc);
      $('#ending').className = 'ending';
      $('#ending').innerHTML = '';
    },

    sceneText(sc) {
      let t = sc.text || '';
      if (this.state.daoyun >= 5) t += '<p class="whisper">你听见有人在很近的地方叫你的名字。可能是幻听。</p>';
      if (this.state.daoyun >= 8) t += '<p class="whisper">墙上的光斑拼成两个字。你不敢看清。</p>';
      return t;
    },

    renderActions() {
      const box = $('#actions');
      box.innerHTML = '';
      this.visibleActions().forEach((a, i) => {
        const b = document.createElement('button');
        b.className = 'action';
        b.innerHTML = `<span class="key">${i + 1}</span><span class="label">${a.label}</span>${a.hint ? `<span class="hint">${a.hint}</span>` : ''}`;
        b.addEventListener('click', () => this.chooseAction(a));
        box.appendChild(b);
      });
      this.visibleExits().forEach(e => {
        const b = document.createElement('button');
        b.className = 'action exit';
        b.innerHTML = `<span class="key">→</span><span class="label">${e.label}</span>`;
        b.addEventListener('click', () => this.travel(e));
        box.appendChild(b);
      });
    },

    travel(e) {
      if (e.cost && e.cost.time && this.state.time < e.cost.time) { this.toast('这一夜已经不够了。'); return; }
      if (e.cost) {
        this.state.time -= (e.cost.time || 0);
        this.state.daoyun += (e.cost.daoyun || 0);
      }
      if (e.effect) e.effect(this);
      if (e.result) this.applyResult(e.result);
      this.state.scene = e.to;
      this.render();
      this.afterAction();
    },

    renderInventory() {
      const box = $('#inventory');
      if (!this.state.inventory.length) box.innerHTML = '<div class="empty">怀里空着</div>';
      else box.innerHTML = this.state.inventory.map(id => {
        const it = this.item(id);
        return `<div class="inv-item"><div class="inv-name">${it.name}</div><div class="inv-desc">${it.desc || ''}</div></div>`;
      }).join('');
      $('#known').innerHTML = this.state.knowledge.slice(-5).map(id => `<div class="known-item" title="${this.know(id).desc}">${this.know(id).name}</div>`).join('') || '<div class="empty">你还没记住什么。</div>';
    },

    renderNpcs() {
      const names = { zhang: '张护士', doctor: '李医生', danyang: '丹阳子', xuanyang: '玄阳' };
      $('#suspicion').innerHTML = Object.keys(names).map(k => {
        const v = this.state.suspicion[k] || 0, b = this.state.belief[k] || 0;
        return `<div class="npc-row"><span class="npc-name">${names[k]}</span><span class="pips" title="怀疑 ${v}/3">${'●'.repeat(v)}${'○'.repeat(Math.max(0, 3 - v))}</span><span class="belief" title="信任 ${b}/3">${'▮'.repeat(b)}</span></div>`;
      }).join('');
    },

    renderSaid() {
      const box = $('#said');
      if (!this.state.said.length) { box.innerHTML = '<div class="empty">你还没说过什么。</div>'; return; }
      box.innerHTML = this.state.said.slice(-6).map(s => `<div class="said-item"><b>${this.npc(s.target).name}</b>${s.evidence ? `（${s.evidence}）` : ''}：${s.label}</div>`).join('');
    },

    renderLog() {
      const box = $('#log');
      if (!box) return;
      box.innerHTML = this.state.log.slice(-10).map(l => `<div class="log-line ${l.kind || ''}">${l.text}</div>`).join('');
      box.scrollTop = box.scrollHeight;
    },

    renderArt(sc) {
      const art = $('#scene-art');
      const loc = this.loc();
      art.dataset.art = sc.art || loc.art || 'ward';
      art.dataset.world = loc.world || 'real';
      $('#art-caption').textContent = loc.caption || '';
    },

    renderPanel() {
      const wrap = $('#panel');
      const p = this.panel;
      if (!p) { wrap.className = 'panel'; wrap.innerHTML = ''; return; }
      wrap.className = 'panel show';
      wrap.innerHTML = `
        <div class="panel-inner">
        <div class="panel-head">
          <div class="panel-kicker">诳语 · 对 ${p.target.name}</div>
          <button class="x" data-close aria-label="关闭">×</button>
        </div>
        <p class="panel-question">${p.k.line}</p>
        <div class="claims">${p.claims.map(c => `<button class="claim ${p.choice.claim === c.id ? 'sel' : ''}" data-claim="${c.id}">${c.label}</button>`).join('') || '<div class="empty">你现在说不出像样的话。</div>'}</div>
        <div class="ev-head">要不要拿点什么给他看？</div>
        <div class="evidence">${p.evidence.length ? p.evidence.map(e => `<button class="ev ${p.choice.evidence === e.id ? 'sel' : ''}" data-ev="${e.id}"><b>${e.name}</b><span>${e.kind === 'item' ? '物' : e.kind === 'knowledge' ? '记' : '事'}</span></button>`).join('') : '<span class="empty">你身上没有能拿出来的东西。</span>'}</div>
        <div class="panel-foot"><button class="btn primary" data-submit>说出口</button><span class="warn">说出去的话，会被记住。</span></div>
        </div>`;
      $$('[data-claim]', wrap).forEach(b => b.addEventListener('click', () => { p.choice.claim = b.dataset.claim; this.renderPanel(); }));
      $$('[data-ev]', wrap).forEach(b => b.addEventListener('click', () => { p.choice.evidence = p.choice.evidence === b.dataset.ev ? null : b.dataset.ev; this.renderPanel(); }));
      $('[data-submit]', wrap).addEventListener('click', () => this.resolveKuangyu());
      $('[data-close]', wrap).addEventListener('click', () => { this.panel = null; this.renderPanel(); });
    },

    renderEnding(id) {
      const e = this.content.endings[id];
      const fail = e.kind === 'fail';
      const box = $('#ending');
      box.className = 'ending show' + (fail ? ' fail' : '');
      box.innerHTML = `
        <div class="ending-inner">
        <div class="end-kicker">${fail ? '这一夜到此为止' : '结局'}</div>
        <h2>${e.title}</h2>
        <div class="end-body">${e.text}</div>
        <div class="end-stats">道韵 ${this.state.daoyun} · 跨界 ${this.state.crosses} 次 · 说过 ${this.state.said.length} 句话</div>
        <div class="end-actions"><button class="btn primary" data-restart>重新来过</button></div>
        </div>`;
      $('[data-restart]', box).addEventListener('click', () => this.restart());
    },

    restart() {
      this.state = this.freshState();
      this.panel = null;
      this.renderPanel();
      this.render();
      this.toast('又回到了熄灯后的那一刻。');
    },

    // ---------- 输入 ----------
    bind() {
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          this.panel = null; this.renderPanel();
          $('#result').classList.remove('show');
          return;
        }
        if (e.key === ' ' || e.key === 'Enter') {
          const r = $('#result');
          if (r.classList.contains('show')) { r.classList.remove('show'); e.preventDefault(); return; }
        }
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 9) {
          const list = $$('#actions .action');
          if (list[n - 1]) list[n - 1].click();
        }
      });
      document.addEventListener('click', e => {
        if (e.target.closest('[data-close-result]')) $('#result').classList.remove('show');
      });
      const s = $('#btn-save'); if (s) s.addEventListener('click', () => this.save());
      const l = $('#btn-load'); if (l) l.addEventListener('click', () => this.load());
      const h = $('#btn-help'); if (h) h.addEventListener('click', () => $('#help').classList.toggle('show'));
      const hx = $('#help-close'); if (hx) hx.addEventListener('click', () => $('#help').classList.remove('show'));
    },

    save() {
      try {
        localStorage.setItem('dg_kuangyu_save', JSON.stringify(this.state));
        this.toast('已存在这台浏览器里。');
      } catch (err) { this.toast('存不了。'); }
    },
    load() {
      try {
        const raw = localStorage.getItem('dg_kuangyu_save');
        if (!raw) return this.toast('没有存档。');
        this.state = JSON.parse(raw);
        this.panel = null;
        this.render();
        this.renderPanel();
        this.toast('读回来了。');
      } catch (err) { this.toast('存档坏了。'); }
    }
  };

  window.Game = Game;
})();
