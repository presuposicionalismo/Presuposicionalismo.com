const be = {},
  m = Symbol(),
  Fe = !1;
var Lt = Array.isArray,
  $t = Array.prototype.indexOf,
  le = Array.prototype.includes,
  Ht = Array.from,
  jt = Object.defineProperty,
  ae = Object.getOwnPropertyDescriptor,
  qt = Object.prototype,
  Bt = Array.prototype,
  Ut = Object.getPrototypeOf,
  We = Object.isExtensible;
function Vt(e) {
  for (var t = 0; t < e.length; t++) e[t]();
}
function Kt() {
  var e,
    t,
    n = new Promise((i, r) => {
      (e = i), (t = r);
    });
  return { promise: n, resolve: e, reject: t };
}
const b = 2,
  Ce = 4,
  $e = 8,
  tt = 1 << 24,
  L = 16,
  K = 32,
  ee = 64,
  He = 128,
  k = 512,
  y = 1024,
  R = 2048,
  $ = 4096,
  j = 8192,
  J = 16384,
  nt = 32768,
  Te = 65536,
  ze = 1 << 17,
  rt = 1 << 18,
  Se = 1 << 19,
  Wt = 1 << 20,
  X = 32768,
  Ie = 1 << 21,
  it = 1 << 22,
  he = 1 << 23,
  Oe = Symbol("$state"),
  st = new (class extends Error {
    name = "StaleReactionError";
    message =
      "The reaction that called `getAbortSignal()` was re-run or destroyed";
  })(),
  ke = 8;
function zt() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Gt() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function Zt() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Jt() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Qt() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Xt() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
function lt(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function en() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let C = !1;
function pe(e) {
  C = e;
}
let A;
function _e(e) {
  if (e === null) throw (lt(), be);
  return (A = e);
}
function ft() {
  return _e(ue(A));
}
function tn(e = 1) {
  if (C) {
    for (var t = e, n = A; t--; ) n = ue(n);
    A = n;
  }
}
function nn(e = !0) {
  for (var t = 0, n = A; ; ) {
    if (n.nodeType === ke) {
      var i = n.data;
      if (i === "]") {
        if (t === 0) return n;
        t -= 1;
      } else (i === "[" || i === "[!") && (t += 1);
    }
    var r = ue(n);
    e && n.remove(), (n = r);
  }
}
function rn(e) {
  return e === this.v;
}
let sn = !1,
  Y = null;
function xe(e) {
  Y = e;
}
function ln(e, t = !1, n) {
  Y = { p: Y, i: !1, c: null, e: null, s: e, x: null, l: null };
}
function fn(e) {
  var t = Y,
    n = t.e;
  if (n !== null) {
    t.e = null;
    for (var i of n) mn(i);
  }
  return (t.i = !0), (Y = t.p), {};
}
function ut() {
  return !0;
}
let ne = [];
function un() {
  var e = ne;
  (ne = []), Vt(e);
}
function se(e) {
  if (ne.length === 0) {
    var t = ne;
    queueMicrotask(() => {
      t === ne && un();
    });
  }
  ne.push(e);
}
function ot(e) {
  var t = p;
  if (t === null) return (v.f |= he), e;
  if ((t.f & nt) === 0) {
    if ((t.f & He) === 0) throw e;
    t.b.error(e);
  } else Ae(e, t);
}
function Ae(e, t) {
  for (; t !== null; ) {
    if ((t.f & He) !== 0)
      try {
        t.b.error(e);
        return;
      } catch (n) {
        e = n;
      }
    t = t.parent;
  }
  throw e;
}
const on = -7169;
function g(e, t) {
  e.f = (e.f & on) | t;
}
function je(e) {
  (e.f & k) !== 0 || e.deps === null ? g(e, y) : g(e, $);
}
function at(e) {
  if (e !== null)
    for (const t of e)
      (t.f & b) === 0 || (t.f & X) === 0 || ((t.f ^= X), at(t.deps));
}
function ct(e, t, n) {
  (e.f & R) !== 0 ? t.add(e) : (e.f & $) !== 0 && n.add(e), at(e.deps), g(e, y);
}
const ge = new Set();
let w = null,
  D = null,
  O = [],
  qe = null,
  Pe = !1;
class q {
  committed = !1;
  current = new Map();
  previous = new Map();
  #t = new Set();
  #o = new Set();
  #n = 0;
  #f = 0;
  #s = null;
  #r = new Set();
  #e = new Set();
  skipped_effects = new Set();
  is_fork = !1;
  #i = !1;
  is_deferred() {
    return this.is_fork || this.#f > 0;
  }
  process(t) {
    (O = []), this.apply();
    var n = [],
      i = [];
    for (const r of t) this.#l(r, n, i);
    if (this.is_deferred()) {
      this.#u(i), this.#u(n);
      for (const r of this.skipped_effects) dt(r);
    } else {
      for (const r of this.#t) r();
      this.#t.clear(),
        this.#n === 0 && this.#a(),
        (w = null),
        Ge(i),
        Ge(n),
        this.#s?.resolve();
    }
    D = null;
  }
  #l(t, n, i) {
    t.f ^= y;
    for (var r = t.first, s = null; r !== null; ) {
      var f = r.f,
        l = (f & (K | ee)) !== 0,
        u = l && (f & y) !== 0,
        o = u || (f & j) !== 0 || this.skipped_effects.has(r);
      if (!o && r.fn !== null) {
        l
          ? (r.f ^= y)
          : s !== null && (f & (Ce | $e | tt)) !== 0
            ? s.b.defer_effect(r)
            : (f & Ce) !== 0
              ? n.push(r)
              : ve(r) && ((f & L) !== 0 && this.#e.add(r), de(r));
        var c = r.first;
        if (c !== null) {
          r = c;
          continue;
        }
      }
      var h = r.parent;
      for (r = r.next; r === null && h !== null; )
        h === s && (s = null), (r = h.next), (h = h.parent);
    }
  }
  #u(t) {
    for (var n = 0; n < t.length; n += 1) ct(t[n], this.#r, this.#e);
  }
  capture(t, n) {
    n !== m && !this.previous.has(t) && this.previous.set(t, n),
      (t.f & he) === 0 && (this.current.set(t, t.v), D?.set(t, t.v));
  }
  activate() {
    (w = this), this.apply();
  }
  deactivate() {
    w === this && ((w = null), (D = null));
  }
  flush() {
    if ((this.activate(), O.length > 0)) {
      if ((an(), w !== null && w !== this)) return;
    } else this.#n === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#o) t(this);
    this.#o.clear();
  }
  #a() {
    if (ge.size > 1) {
      this.previous.clear();
      var t = D,
        n = !0;
      for (const r of ge) {
        if (r === this) {
          n = !1;
          continue;
        }
        const s = [];
        for (const [l, u] of this.current) {
          if (r.current.has(l))
            if (n && u !== r.current.get(l)) r.current.set(l, u);
            else continue;
          s.push(l);
        }
        if (s.length === 0) continue;
        const f = [...r.current.keys()].filter((l) => !this.current.has(l));
        if (f.length > 0) {
          var i = O;
          O = [];
          const l = new Set(),
            u = new Map();
          for (const o of s) ht(o, f, l, u);
          if (O.length > 0) {
            (w = r), r.apply();
            for (const o of O) r.#l(o, [], []);
            r.deactivate();
          }
          O = i;
        }
      }
      (w = null), (D = t);
    }
    (this.committed = !0), ge.delete(this);
  }
  increment(t) {
    (this.#n += 1), t && (this.#f += 1);
  }
  decrement(t) {
    (this.#n -= 1),
      t && (this.#f -= 1),
      !this.#i &&
        ((this.#i = !0),
        se(() => {
          (this.#i = !1),
            this.is_deferred() ? O.length > 0 && this.flush() : this.revive();
        }));
  }
  revive() {
    for (const t of this.#r) this.#e.delete(t), g(t, R), U(t);
    for (const t of this.#e) g(t, $), U(t);
    this.flush();
  }
  oncommit(t) {
    this.#t.add(t);
  }
  ondiscard(t) {
    this.#o.add(t);
  }
  settled() {
    return (this.#s ??= Kt()).promise;
  }
  static ensure() {
    if (w === null) {
      const t = (w = new q());
      ge.add(w),
        se(() => {
          w === t && t.flush();
        });
    }
    return w;
  }
  apply() {}
}
function an() {
  Pe = !0;
  var e = null;
  try {
    for (var t = 0; O.length > 0; ) {
      var n = q.ensure();
      if (t++ > 1e3) {
        var i, r;
        cn();
      }
      n.process(O), B.clear();
    }
  } finally {
    (Pe = !1), (qe = null);
  }
}
function cn() {
  try {
    zt();
  } catch (e) {
    Ae(e, qe);
  }
}
let M = null;
function Ge(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var i = e[n++];
      if (
        (i.f & (J | j)) === 0 &&
        ve(i) &&
        ((M = new Set()),
        de(i),
        i.deps === null &&
          i.first === null &&
          i.nodes === null &&
          (i.teardown === null && i.ac === null ? St(i) : (i.fn = null)),
        M?.size > 0)
      ) {
        B.clear();
        for (const r of M) {
          if ((r.f & (J | j)) !== 0) continue;
          const s = [r];
          let f = r.parent;
          for (; f !== null; )
            M.has(f) && (M.delete(f), s.push(f)), (f = f.parent);
          for (let l = s.length - 1; l >= 0; l--) {
            const u = s[l];
            (u.f & (J | j)) === 0 && de(u);
          }
        }
        M.clear();
      }
    }
    M = null;
  }
}
function ht(e, t, n, i) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const r of e.reactions) {
      const s = r.f;
      (s & b) !== 0
        ? ht(r, t, n, i)
        : (s & (it | L)) !== 0 &&
          (s & R) === 0 &&
          _t(r, t, i) &&
          (g(r, R), U(r));
    }
}
function _t(e, t, n) {
  const i = n.get(e);
  if (i !== void 0) return i;
  if (e.deps !== null)
    for (const r of e.deps) {
      if (le.call(t, r)) return !0;
      if ((r.f & b) !== 0 && _t(r, t, n)) return n.set(r, !0), !0;
    }
  return n.set(e, !1), !1;
}
function U(e) {
  for (var t = (qe = e); t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (Pe && t === p && (n & L) !== 0 && (n & rt) === 0) return;
    if ((n & (ee | K)) !== 0) {
      if ((n & y) === 0) return;
      t.f ^= y;
    }
  }
  O.push(t);
}
function dt(e) {
  if (!((e.f & K) !== 0 && (e.f & y) !== 0)) {
    g(e, y);
    for (var t = e.first; t !== null; ) dt(t), (t = t.next);
  }
}
function hn(e) {
  let t = 0,
    n = Ue(0),
    i;
  return () => {
    Ve() &&
      (ie(n),
      Tn(
        () => (
          t === 0 && (i = Dn(() => e(() => ce(n)))),
          (t += 1),
          () => {
            se(() => {
              (t -= 1), t === 0 && (i?.(), (i = void 0), ce(n));
            });
          }
        ),
      ));
  };
}
var _n = Te | Se | He;
function dn(e, t, n) {
  new vn(e, t, n);
}
class vn {
  parent;
  is_pending = !1;
  #t;
  #o = C ? A : null;
  #n;
  #f;
  #s;
  #r = null;
  #e = null;
  #i = null;
  #l = null;
  #u = null;
  #a = 0;
  #c = 0;
  #d = !1;
  #_ = !1;
  #v = new Set();
  #p = new Set();
  #h = null;
  #m = hn(
    () => (
      (this.#h = Ue(this.#a)),
      () => {
        this.#h = null;
      }
    ),
  );
  constructor(t, n, i) {
    (this.#t = t),
      (this.#n = n),
      (this.#f = i),
      (this.parent = p.b),
      (this.is_pending = !!this.#n.pending),
      (this.#s = xn(() => {
        if (((p.b = this), C)) {
          const s = this.#o;
          ft(),
            s.nodeType === ke && s.data === "[!"
              ? this.#T()
              : (this.#b(), this.#c === 0 && (this.is_pending = !1));
        } else {
          var r = this.#w();
          try {
            this.#r = z(() => i(r));
          } catch (s) {
            this.error(s);
          }
          this.#c > 0 ? this.#y() : (this.is_pending = !1);
        }
        return () => {
          this.#u?.remove();
        };
      }, _n)),
      C && (this.#t = A);
  }
  #b() {
    try {
      this.#r = z(() => this.#f(this.#t));
    } catch (t) {
      this.error(t);
    }
  }
  #T() {
    const t = this.#n.pending;
    t &&
      ((this.#e = z(() => t(this.#t))),
      se(() => {
        var n = this.#w();
        (this.#r = this.#g(() => (q.ensure(), z(() => this.#f(n))))),
          this.#c > 0
            ? this.#y()
            : (Ee(this.#e, () => {
                this.#e = null;
              }),
              (this.is_pending = !1));
      }));
  }
  #w() {
    var t = this.#t;
    return (
      this.is_pending &&
        ((this.#u = bt()), this.#t.before(this.#u), (t = this.#u)),
      t
    );
  }
  defer_effect(t) {
    ct(t, this.#v, this.#p);
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#n.pending;
  }
  #g(t) {
    var n = p,
      i = v,
      r = Y;
    V(this.#s), P(this.#s), xe(this.#s.ctx);
    try {
      return t();
    } catch (s) {
      return ot(s), null;
    } finally {
      V(n), P(i), xe(r);
    }
  }
  #y() {
    const t = this.#n.pending;
    this.#r !== null &&
      ((this.#l = document.createDocumentFragment()),
      this.#l.append(this.#u),
      Sn(this.#r, this.#l)),
      this.#e === null && (this.#e = z(() => t(this.#t)));
  }
  #E(t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#E(t);
      return;
    }
    if (((this.#c += t), this.#c === 0)) {
      this.is_pending = !1;
      for (const n of this.#v) g(n, R), U(n);
      for (const n of this.#p) g(n, $), U(n);
      this.#v.clear(),
        this.#p.clear(),
        this.#e &&
          Ee(this.#e, () => {
            this.#e = null;
          }),
        this.#l && (this.#t.before(this.#l), (this.#l = null));
    }
  }
  update_pending_count(t) {
    this.#E(t),
      (this.#a += t),
      !(!this.#h || this.#d) &&
        ((this.#d = !0),
        se(() => {
          (this.#d = !1), this.#h && yt(this.#h, this.#a);
        }));
  }
  get_effect_pending() {
    return this.#m(), ie(this.#h);
  }
  error(t) {
    var n = this.#n.onerror;
    let i = this.#n.failed;
    if (this.#_ || (!n && !i)) throw t;
    this.#r && (I(this.#r), (this.#r = null)),
      this.#e && (I(this.#e), (this.#e = null)),
      this.#i && (I(this.#i), (this.#i = null)),
      C && (_e(this.#o), tn(), _e(nn()));
    var r = !1,
      s = !1;
    const f = () => {
      if (r) {
        en();
        return;
      }
      (r = !0),
        s && Xt(),
        q.ensure(),
        (this.#a = 0),
        this.#i !== null &&
          Ee(this.#i, () => {
            this.#i = null;
          }),
        (this.is_pending = this.has_pending_snippet()),
        (this.#r = this.#g(() => ((this.#_ = !1), z(() => this.#f(this.#t))))),
        this.#c > 0 ? this.#y() : (this.is_pending = !1);
    };
    se(() => {
      try {
        (s = !0), n?.(t, f), (s = !1);
      } catch (l) {
        Ae(l, this.#s && this.#s.parent);
      }
      i &&
        (this.#i = this.#g(() => {
          q.ensure(), (this.#_ = !0);
          try {
            return z(() => {
              i(
                this.#t,
                () => t,
                () => f,
              );
            });
          } catch (l) {
            return Ae(l, this.#s.parent), null;
          } finally {
            this.#_ = !1;
          }
        }));
    });
  }
}
function vt(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1) I(t[n]);
  }
}
function pn(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & b) === 0) return (t.f & J) === 0 ? t : null;
    t = t.parent;
  }
  return null;
}
function Be(e) {
  var t,
    n = p;
  V(pn(e));
  try {
    (e.f &= ~X), vt(e), (t = Ft(e));
  } finally {
    V(n);
  }
  return t;
}
function pt(e) {
  var t = Be(e);
  if (
    !e.equals(t) &&
    ((e.wv = Ot()),
    (!w?.is_fork || e.deps === null) && ((e.v = t), e.deps === null))
  ) {
    g(e, y);
    return;
  }
  fe || (D !== null ? (Ve() || w?.is_fork) && D.set(e, t) : je(e));
}
let Me = new Set();
const B = new Map();
let gt = !1;
function Ue(e, t) {
  var n = { f: 0, v: e, reactions: null, equals: rn, rv: 0, wv: 0 };
  return n;
}
function H(e, t) {
  const n = Ue(e);
  return kn(n), n;
}
function G(e, t, n = !1) {
  v !== null &&
    (!F || (v.f & ze) !== 0) &&
    ut() &&
    (v.f & (b | L | it | ze)) !== 0 &&
    (N === null || !le.call(N, e)) &&
    Qt();
  let i = n ? re(t) : t;
  return yt(e, i);
}
function yt(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    fe ? B.set(e, t) : B.set(e, n), (e.v = t);
    var i = q.ensure();
    if ((i.capture(e, n), (e.f & b) !== 0)) {
      const r = e;
      (e.f & R) !== 0 && Be(r), je(r);
    }
    (e.wv = Ot()),
      wt(e, R),
      p !== null &&
        (p.f & y) !== 0 &&
        (p.f & (K | ee)) === 0 &&
        (S === null ? Nn([e]) : S.push(e)),
      !i.is_fork && Me.size > 0 && !gt && gn();
  }
  return t;
}
function gn() {
  gt = !1;
  for (const e of Me) (e.f & y) !== 0 && g(e, $), ve(e) && de(e);
  Me.clear();
}
function ce(e) {
  G(e, e.v + 1);
}
function wt(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var i = n.length, r = 0; r < i; r++) {
      var s = n[r],
        f = s.f,
        l = (f & R) === 0;
      if ((l && g(s, t), (f & b) !== 0)) {
        var u = s;
        D?.delete(u), (f & X) === 0 && (f & k && (s.f |= X), wt(u, $));
      } else l && ((f & L) !== 0 && M !== null && M.add(s), U(s));
    }
}
function re(e) {
  if (typeof e != "object" || e === null || Oe in e) return e;
  const t = Ut(e);
  if (t !== qt && t !== Bt) return e;
  var n = new Map(),
    i = Lt(e),
    r = H(0),
    s = Q,
    f = (l) => {
      if (Q === s) return l();
      var u = v,
        o = Q;
      P(null), Qe(s);
      var c = l();
      return P(u), Qe(o), c;
    };
  return (
    i && n.set("length", H(e.length)),
    new Proxy(e, {
      defineProperty(l, u, o) {
        (!("value" in o) ||
          o.configurable === !1 ||
          o.enumerable === !1 ||
          o.writable === !1) &&
          Zt();
        var c = n.get(u);
        return (
          c === void 0
            ? (c = f(() => {
                var h = H(o.value);
                return n.set(u, h), h;
              }))
            : G(c, o.value, !0),
          !0
        );
      },
      deleteProperty(l, u) {
        var o = n.get(u);
        if (o === void 0) {
          if (u in l) {
            const c = f(() => H(m));
            n.set(u, c), ce(r);
          }
        } else G(o, m), ce(r);
        return !0;
      },
      get(l, u, o) {
        if (u === Oe) return e;
        var c = n.get(u),
          h = u in l;
        if (
          (c === void 0 &&
            (!h || ae(l, u)?.writable) &&
            ((c = f(() => {
              var _ = re(h ? l[u] : m),
                d = H(_);
              return d;
            })),
            n.set(u, c)),
          c !== void 0)
        ) {
          var a = ie(c);
          return a === m ? void 0 : a;
        }
        return Reflect.get(l, u, o);
      },
      getOwnPropertyDescriptor(l, u) {
        var o = Reflect.getOwnPropertyDescriptor(l, u);
        if (o && "value" in o) {
          var c = n.get(u);
          c && (o.value = ie(c));
        } else if (o === void 0) {
          var h = n.get(u),
            a = h?.v;
          if (h !== void 0 && a !== m)
            return { enumerable: !0, configurable: !0, value: a, writable: !0 };
        }
        return o;
      },
      has(l, u) {
        if (u === Oe) return !0;
        var o = n.get(u),
          c = (o !== void 0 && o.v !== m) || Reflect.has(l, u);
        if (o !== void 0 || (p !== null && (!c || ae(l, u)?.writable))) {
          o === void 0 &&
            ((o = f(() => {
              var a = c ? re(l[u]) : m,
                _ = H(a);
              return _;
            })),
            n.set(u, o));
          var h = ie(o);
          if (h === m) return !1;
        }
        return c;
      },
      set(l, u, o, c) {
        var h = n.get(u),
          a = u in l;
        if (i && u === "length")
          for (var _ = o; _ < h.v; _ += 1) {
            var d = n.get(_ + "");
            d !== void 0
              ? G(d, m)
              : _ in l && ((d = f(() => H(m))), n.set(_ + "", d));
          }
        if (h === void 0)
          (!a || ae(l, u)?.writable) &&
            ((h = f(() => H(void 0))), G(h, re(o)), n.set(u, h));
        else {
          a = h.v !== m;
          var E = f(() => re(o));
          G(h, E);
        }
        var W = Reflect.getOwnPropertyDescriptor(l, u);
        if ((W?.set && W.set.call(c, o), !a)) {
          if (i && typeof u == "string") {
            var Ke = n.get("length"),
              Ne = Number(u);
            Number.isInteger(Ne) && Ne >= Ke.v && G(Ke, Ne + 1);
          }
          ce(r);
        }
        return !0;
      },
      ownKeys(l) {
        ie(r);
        var u = Reflect.ownKeys(l).filter((h) => {
          var a = n.get(h);
          return a === void 0 || a.v !== m;
        });
        for (var [o, c] of n) c.v !== m && !(o in l) && u.push(o);
        return u;
      },
      setPrototypeOf() {
        Jt();
      },
    })
  );
}
var Ze, Et, mt;
function Ye() {
  if (Ze === void 0) {
    Ze = window;
    var e = Element.prototype,
      t = Node.prototype,
      n = Text.prototype;
    (Et = ae(t, "firstChild").get),
      (mt = ae(t, "nextSibling").get),
      We(e) &&
        ((e.__click = void 0),
        (e.__className = void 0),
        (e.__attributes = null),
        (e.__style = void 0),
        (e.__e = void 0)),
      We(n) && (n.__t = void 0);
  }
}
function bt(e = "") {
  return document.createTextNode(e);
}
function Tt(e) {
  return Et.call(e);
}
function ue(e) {
  return mt.call(e);
}
function yn(e) {
  e.textContent = "";
}
function xt(e) {
  var t = v,
    n = p;
  P(null), V(null);
  try {
    return e();
  } finally {
    P(t), V(n);
  }
}
function wn(e, t) {
  var n = t.last;
  n === null
    ? (t.last = t.first = e)
    : ((n.next = e), (e.prev = n), (t.last = e));
}
function oe(e, t, n) {
  var i = p;
  i !== null && (i.f & j) !== 0 && (e |= j);
  var r = {
    ctx: Y,
    deps: null,
    nodes: null,
    f: e | R | k,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: i,
    b: i && i.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null,
  };
  if (n)
    try {
      de(r), (r.f |= nt);
    } catch (l) {
      throw (I(r), l);
    }
  else t !== null && U(r);
  var s = r;
  if (
    (n &&
      s.deps === null &&
      s.teardown === null &&
      s.nodes === null &&
      s.first === s.last &&
      (s.f & Se) === 0 &&
      ((s = s.first),
      (e & L) !== 0 && (e & Te) !== 0 && s !== null && (s.f |= Te)),
    s !== null &&
      ((s.parent = i),
      i !== null && wn(s, i),
      v !== null && (v.f & b) !== 0 && (e & ee) === 0))
  ) {
    var f = v;
    (f.effects ??= []).push(s);
  }
  return r;
}
function Ve() {
  return v !== null && !F;
}
function En(e) {
  const t = oe($e, null, !1);
  return g(t, y), (t.teardown = e), t;
}
function mn(e) {
  return oe(Ce | Wt, e, !1);
}
function bn(e) {
  q.ensure();
  const t = oe(ee | Se, e, !0);
  return (n = {}) =>
    new Promise((i) => {
      n.outro
        ? Ee(t, () => {
            I(t), i(void 0);
          })
        : (I(t), i(void 0));
    });
}
function Tn(e, t = 0) {
  return oe($e | t, e, !0);
}
function xn(e, t = 0) {
  var n = oe(L | t, e, !0);
  return n;
}
function z(e) {
  return oe(K | Se, e, !0);
}
function At(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = fe,
      i = v;
    Je(!0), P(null);
    try {
      t.call(null);
    } finally {
      Je(n), P(i);
    }
  }
}
function Rt(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const r = n.ac;
    r !== null &&
      xt(() => {
        r.abort(st);
      });
    var i = n.next;
    (n.f & ee) !== 0 ? (n.parent = null) : I(n, t), (n = i);
  }
}
function An(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & K) === 0 && I(t), (t = n);
  }
}
function I(e, t = !0) {
  var n = !1;
  (t || (e.f & rt) !== 0) &&
    e.nodes !== null &&
    e.nodes.end !== null &&
    (Rn(e.nodes.start, e.nodes.end), (n = !0)),
    Rt(e, t && !n),
    Re(e, 0),
    g(e, J);
  var i = e.nodes && e.nodes.t;
  if (i !== null) for (const s of i) s.stop();
  At(e);
  var r = e.parent;
  r !== null && r.first !== null && St(e),
    (e.next =
      e.prev =
      e.teardown =
      e.ctx =
      e.deps =
      e.fn =
      e.nodes =
      e.ac =
        null);
}
function Rn(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : ue(e);
    e.remove(), (e = n);
  }
}
function St(e) {
  var t = e.parent,
    n = e.prev,
    i = e.next;
  n !== null && (n.next = i),
    i !== null && (i.prev = n),
    t !== null &&
      (t.first === e && (t.first = i), t.last === e && (t.last = n));
}
function Ee(e, t, n = !0) {
  var i = [];
  kt(e, i, !0);
  var r = () => {
      n && I(e), t && t();
    },
    s = i.length;
  if (s > 0) {
    var f = () => --s || r();
    for (var l of i) l.out(f);
  } else r();
}
function kt(e, t, n) {
  if ((e.f & j) === 0) {
    e.f ^= j;
    var i = e.nodes && e.nodes.t;
    if (i !== null) for (const l of i) (l.is_global || n) && t.push(l);
    for (var r = e.first; r !== null; ) {
      var s = r.next,
        f = (r.f & Te) !== 0 || ((r.f & K) !== 0 && (e.f & L) !== 0);
      kt(r, t, f ? n : !1), (r = s);
    }
  }
}
function Sn(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, i = e.nodes.end; n !== null; ) {
      var r = n === i ? null : ue(n);
      t.append(n), (n = r);
    }
}
let me = !1,
  fe = !1;
function Je(e) {
  fe = e;
}
let v = null,
  F = !1;
function P(e) {
  v = e;
}
let p = null;
function V(e) {
  p = e;
}
let N = null;
function kn(e) {
  v !== null && (N === null ? (N = [e]) : N.push(e));
}
let T = null,
  x = 0,
  S = null;
function Nn(e) {
  S = e;
}
let Nt = 1,
  Z = 0,
  Q = Z;
function Qe(e) {
  Q = e;
}
function Ot() {
  return ++Nt;
}
function ve(e) {
  var t = e.f;
  if ((t & R) !== 0) return !0;
  if ((t & b && (e.f &= ~X), (t & $) !== 0)) {
    for (var n = e.deps, i = n.length, r = 0; r < i; r++) {
      var s = n[r];
      if ((ve(s) && pt(s), s.wv > e.wv)) return !0;
    }
    (t & k) !== 0 && D === null && g(e, y);
  }
  return !1;
}
function Dt(e, t, n = !0) {
  var i = e.reactions;
  if (i !== null && !(N !== null && le.call(N, e)))
    for (var r = 0; r < i.length; r++) {
      var s = i[r];
      (s.f & b) !== 0
        ? Dt(s, t, !1)
        : t === s && (n ? g(s, R) : (s.f & y) !== 0 && g(s, $), U(s));
    }
}
function Ft(e) {
  var t = T,
    n = x,
    i = S,
    r = v,
    s = N,
    f = Y,
    l = F,
    u = Q,
    o = e.f;
  (T = null),
    (x = 0),
    (S = null),
    (v = (o & (K | ee)) === 0 ? e : null),
    (N = null),
    xe(e.ctx),
    (F = !1),
    (Q = ++Z),
    e.ac !== null &&
      (xt(() => {
        e.ac.abort(st);
      }),
      (e.ac = null));
  try {
    e.f |= Ie;
    var c = e.fn,
      h = c(),
      a = e.deps,
      _ = w?.is_fork;
    if (T !== null) {
      var d;
      if ((_ || Re(e, x), a !== null && x > 0))
        for (a.length = x + T.length, d = 0; d < T.length; d++) a[x + d] = T[d];
      else e.deps = a = T;
      if (Ve() && (e.f & k) !== 0)
        for (d = x; d < a.length; d++) (a[d].reactions ??= []).push(e);
    } else !_ && a !== null && x < a.length && (Re(e, x), (a.length = x));
    if (ut() && S !== null && !F && a !== null && (e.f & (b | $ | R)) === 0)
      for (d = 0; d < S.length; d++) Dt(S[d], e);
    if (r !== null && r !== e) {
      if ((Z++, r.deps !== null))
        for (let E = 0; E < n; E += 1) r.deps[E].rv = Z;
      if (t !== null) for (const E of t) E.rv = Z;
      S !== null && (i === null ? (i = S) : i.push(...S));
    }
    return (e.f & he) !== 0 && (e.f ^= he), h;
  } catch (E) {
    return ot(E);
  } finally {
    (e.f ^= Ie),
      (T = t),
      (x = n),
      (S = i),
      (v = r),
      (N = s),
      xe(f),
      (F = l),
      (Q = u);
  }
}
function On(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var i = $t.call(n, e);
    if (i !== -1) {
      var r = n.length - 1;
      r === 0 ? (n = t.reactions = null) : ((n[i] = n[r]), n.pop());
    }
  }
  if (n === null && (t.f & b) !== 0 && (T === null || !le.call(T, t))) {
    var s = t;
    (s.f & k) !== 0 && ((s.f ^= k), (s.f &= ~X)), je(s), vt(s), Re(s, 0);
  }
}
function Re(e, t) {
  var n = e.deps;
  if (n !== null) for (var i = t; i < n.length; i++) On(e, n[i]);
}
function de(e) {
  var t = e.f;
  if ((t & J) === 0) {
    g(e, y);
    var n = p,
      i = me;
    (p = e), (me = !0);
    try {
      (t & (L | tt)) !== 0 ? An(e) : Rt(e), At(e);
      var r = Ft(e);
      (e.teardown = typeof r == "function" ? r : null), (e.wv = Nt);
      var s;
      Fe && sn && (e.f & R) !== 0 && e.deps;
    } finally {
      (me = i), (p = n);
    }
  }
}
function ie(e) {
  var t = e.f,
    n = (t & b) !== 0;
  if (v !== null && !F) {
    var i = p !== null && (p.f & J) !== 0;
    if (!i && (N === null || !le.call(N, e))) {
      var r = v.deps;
      if ((v.f & Ie) !== 0)
        e.rv < Z &&
          ((e.rv = Z),
          T === null && r !== null && r[x] === e
            ? x++
            : T === null
              ? (T = [e])
              : T.push(e));
      else {
        (v.deps ??= []).push(e);
        var s = e.reactions;
        s === null ? (e.reactions = [v]) : le.call(s, v) || s.push(v);
      }
    }
  }
  if (fe && B.has(e)) return B.get(e);
  if (n) {
    var f = e;
    if (fe) {
      var l = f.v;
      return (
        (((f.f & y) === 0 && f.reactions !== null) || It(f)) && (l = Be(f)),
        B.set(f, l),
        l
      );
    }
    var u = (f.f & k) === 0 && !F && v !== null && (me || (v.f & k) !== 0),
      o = f.deps === null;
    ve(f) && (u && (f.f |= k), pt(f)), u && !o && Ct(f);
  }
  if (D?.has(e)) return D.get(e);
  if ((e.f & he) !== 0) throw e.v;
  return e.v;
}
function Ct(e) {
  if (e.deps !== null) {
    e.f |= k;
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & b) !== 0 && (t.f & k) === 0 && Ct(t);
  }
}
function It(e) {
  if (e.v === m) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps) if (B.has(t) || ((t.f & b) !== 0 && It(t))) return !0;
  return !1;
}
function Dn(e) {
  var t = F;
  try {
    return (F = !0), e();
  } finally {
    F = t;
  }
}
const Fn = new Set(),
  Xe = new Set();
let et = null;
function ye(e) {
  var t = this,
    n = t.ownerDocument,
    i = e.type,
    r = e.composedPath?.() || [],
    s = r[0] || e.target;
  et = e;
  var f = 0,
    l = et === e && e.__root;
  if (l) {
    var u = r.indexOf(l);
    if (u !== -1 && (t === document || t === window)) {
      e.__root = t;
      return;
    }
    var o = r.indexOf(t);
    if (o === -1) return;
    u <= o && (f = u);
  }
  if (((s = r[f] || e.target), s !== t)) {
    jt(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || n;
      },
    });
    var c = v,
      h = p;
    P(null), V(null);
    try {
      for (var a, _ = []; s !== null; ) {
        var d = s.assignedSlot || s.parentNode || s.host || null;
        try {
          var E = s["__" + i];
          E != null && (!s.disabled || e.target === s) && E.call(s, e);
        } catch (W) {
          a ? _.push(W) : (a = W);
        }
        if (e.cancelBubble || d === t || d === null) break;
        s = d;
      }
      if (a) {
        for (let W of _)
          queueMicrotask(() => {
            throw W;
          });
        throw a;
      }
    } finally {
      (e.__root = t), delete e.currentTarget, P(c), V(h);
    }
  }
}
function Cn(e) {
  var t = document.createElement("template");
  return (t.innerHTML = e.replaceAll("<!>", "<!---->")), t.content;
}
function Pt(e, t) {
  var n = p;
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
const In = ["touchstart", "touchmove"];
function Pn(e) {
  return In.includes(e);
}
function Mt(e, t) {
  return Yt(e, t);
}
function Mn(e, t) {
  Ye(), (t.intro = t.intro ?? !1);
  const n = t.target,
    i = C,
    r = A;
  try {
    for (var s = Tt(n); s && (s.nodeType !== ke || s.data !== "["); ) s = ue(s);
    if (!s) throw be;
    pe(!0), _e(s);
    const f = Yt(e, { ...t, anchor: s });
    return pe(!1), f;
  } catch (f) {
    if (
      f instanceof Error &&
      f.message
        .split(
          `
`,
        )
        .some((l) => l.startsWith("https://svelte.dev/e/"))
    )
      throw f;
    return (
      f !== be && console.warn("Failed to hydrate: ", f),
      t.recover === !1 && Gt(),
      Ye(),
      yn(n),
      pe(!1),
      Mt(e, t)
    );
  } finally {
    pe(i), _e(r);
  }
}
const te = new Map();
function Yt(
  e,
  { target: t, anchor: n, props: i = {}, events: r, context: s, intro: f = !0 },
) {
  Ye();
  var l = new Set(),
    u = (h) => {
      for (var a = 0; a < h.length; a++) {
        var _ = h[a];
        if (!l.has(_)) {
          l.add(_);
          var d = Pn(_);
          t.addEventListener(_, ye, { passive: d });
          var E = te.get(_);
          E === void 0
            ? (document.addEventListener(_, ye, { passive: d }), te.set(_, 1))
            : te.set(_, E + 1);
        }
      }
    };
  u(Ht(Fn)), Xe.add(u);
  var o = void 0,
    c = bn(() => {
      var h = n ?? t.appendChild(bt());
      return (
        dn(h, { pending: () => {} }, (a) => {
          if (s) {
            ln({});
            var _ = Y;
            _.c = s;
          }
          if (
            (r && (i.$$events = r),
            C && Pt(a, null),
            (o = e(a, i) || {}),
            C &&
              ((p.nodes.end = A),
              A === null || A.nodeType !== ke || A.data !== "]"))
          )
            throw (lt(), be);
          s && fn();
        }),
        () => {
          for (var a of l) {
            t.removeEventListener(a, ye);
            var _ = te.get(a);
            --_ === 0
              ? (document.removeEventListener(a, ye), te.delete(a))
              : te.set(a, _);
          }
          Xe.delete(u), h !== n && h.parentNode?.removeChild(h);
        }
      );
    });
  return Le.set(o, c), o;
}
let Le = new WeakMap();
function Yn(e, t) {
  const n = Le.get(e);
  return n ? (Le.delete(e), n(t)) : Promise.resolve();
}
function we(e) {
  return (t, ...n) => {
    var i = e(...n),
      r;
    if (C) (r = A), ft();
    else {
      var s = i.render().trim(),
        f = Cn(s);
      (r = Tt(f)), t.before(r);
    }
    const l = i.setup?.(r);
    Pt(r, r), typeof l == "function" && En(l);
  };
}
const De = new WeakMap();
var Hn =
  (e) =>
  async (t, n, i, { client: r }) => {
    if (!e.hasAttribute("ssr")) return;
    let s,
      f,
      l = {};
    for (const [o, c] of Object.entries(i))
      (f ??= {}),
        o === "default"
          ? ((f.default = !0),
            (s = we(() => ({ render: () => `<astro-slot>${c}</astro-slot>` }))))
          : (f[o] = we(() => ({
              render: () => `<astro-slot name="${o}">${c}</astro-slot>`,
            }))),
        o === "default"
          ? (l.children = we(() => ({
              render: () => `<astro-slot>${c}</astro-slot>`,
            })))
          : (l[o] = we(() => ({
              render: () => `<astro-slot name="${o}">${c}</astro-slot>`,
            })));
    const u = { ...n, children: s, $$slots: f, ...l };
    if (De.has(e)) De.get(e).setProps(u);
    else {
      const o = Ln(t, e, u, r !== "only");
      De.set(e, o),
        e.addEventListener("astro:unmount", () => o.destroy(), { once: !0 });
    }
  };
function Ln(e, t, n, i) {
  let r = re(n);
  const s = i ? Mn : Mt;
  i || (t.innerHTML = "");
  const f = s(e, { target: t, props: r });
  return {
    setProps(l) {
      Object.assign(r, l);
      for (const u in r) u in l || delete r[u];
    },
    destroy() {
      Yn(f);
    },
  };
}
export { Hn as default };
