/*! For license information please see 3473.1c3292d4e4ce0c74a99d.js.LICENSE.txt */
"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [3473], {
    140565: (e, t, r) => {
      r.r(t), r.d(t, {
        calculateBox: () => p,
        createBox: () => l,
        expand: () => i,
        getBox: () => f,
        getRect: () => o,
        offset: () => s,
        shrink: () => a,
        withScroll: () => d
      });
      var n = r(92215),
        o = function(e) {
          var t = e.top,
            r = e.right,
            n = e.bottom,
            o = e.left;
          return {
            top: t,
            right: r,
            bottom: n,
            left: o,
            width: r - o,
            height: n - t,
            x: o,
            y: t,
            center: {
              x: (r + o) / 2,
              y: (n + t) / 2
            }
          }
        },
        i = function(e, t) {
          return {
            top: e.top - t.top,
            left: e.left - t.left,
            bottom: e.bottom + t.bottom,
            right: e.right + t.right
          }
        },
        a = function(e, t) {
          return {
            top: e.top + t.top,
            left: e.left + t.left,
            bottom: e.bottom - t.bottom,
            right: e.right - t.right
          }
        },
        u = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        l = function(e) {
          var t = e.borderBox,
            r = e.margin,
            n = void 0 === r ? u : r,
            l = e.border,
            c = void 0 === l ? u : l,
            s = e.padding,
            d = void 0 === s ? u : s,
            p = o(i(t, n)),
            f = o(a(t, c)),
            g = o(a(f, d));
          return {
            marginBox: p,
            borderBox: o(t),
            paddingBox: f,
            contentBox: g,
            margin: n,
            border: c,
            padding: d
          }
        },
        c = function(e) {
          var t = e.slice(0, -2);
          if ("px" !== e.slice(-2)) return 0;
          var r = Number(t);
          return isNaN(r) && (0, n.default)(!1), r
        },
        s = function(e, t) {
          var r, n, o = e.borderBox,
            i = e.border,
            a = e.margin,
            u = e.padding,
            c = (n = t, {
              top: (r = o).top + n.y,
              left: r.left + n.x,
              bottom: r.bottom + n.y,
              right: r.right + n.x
            });
          return l({
            borderBox: c,
            border: i,
            margin: a,
            padding: u
          })
        },
        d = function(e, t) {
          return void 0 === t && (t = {
            x: window.pageXOffset,
            y: window.pageYOffset
          }), s(e, t)
        },
        p = function(e, t) {
          var r = {
              top: c(t.marginTop),
              right: c(t.marginRight),
              bottom: c(t.marginBottom),
              left: c(t.marginLeft)
            },
            n = {
              top: c(t.paddingTop),
              right: c(t.paddingRight),
              bottom: c(t.paddingBottom),
              left: c(t.paddingLeft)
            },
            o = {
              top: c(t.borderTopWidth),
              right: c(t.borderRightWidth),
              bottom: c(t.borderBottomWidth),
              left: c(t.borderLeftWidth)
            };
          return l({
            borderBox: e,
            margin: r,
            padding: n,
            border: o
          })
        },
        f = function(e) {
          var t = e.getBoundingClientRect(),
            r = window.getComputedStyle(e);
          return p(t, r)
        }
    },
    655839: (e, t, r) => {
      var n = r(519185),
        o = {
          childContextTypes: !0,
          contextType: !0,
          contextTypes: !0,
          defaultProps: !0,
          displayName: !0,
          getDefaultProps: !0,
          getDerivedStateFromError: !0,
          getDerivedStateFromProps: !0,
          mixins: !0,
          propTypes: !0,
          type: !0
        },
        i = {
          name: !0,
          length: !0,
          prototype: !0,
          caller: !0,
          callee: !0,
          arguments: !0,
          arity: !0
        },
        a = {
          $$typeof: !0,
          compare: !0,
          defaultProps: !0,
          displayName: !0,
          propTypes: !0,
          type: !0
        },
        u = {};

      function l(e) {
        return n.isMemo(e) ? a : u[e.$$typeof] || o
      }
      u[n.ForwardRef] = {
        $$typeof: !0,
        render: !0,
        defaultProps: !0,
        displayName: !0,
        propTypes: !0
      }, u[n.Memo] = a;
      var c = Object.defineProperty,
        s = Object.getOwnPropertyNames,
        d = Object.getOwnPropertySymbols,
        p = Object.getOwnPropertyDescriptor,
        f = Object.getPrototypeOf,
        g = Object.prototype;
      e.exports = function e(t, r, n) {
        if ("string" != typeof r) {
          if (g) {
            var o = f(r);
            o && o !== g && e(t, o, n)
          }
          var a = s(r);
          d && (a = a.concat(d(r)));
          for (var u = l(t), v = l(r), m = 0; m < a.length; ++m) {
            var b = a[m];
            if (!(i[b] || n && n[b] || v && v[b] || u && u[b])) {
              var h = p(r, b);
              try {
                c(t, b, h)
              } catch (e) {}
            }
          }
        }
        return t
      }
    },
    556583: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => i
      });
      var n = Number.isNaN || function(e) {
        return "number" == typeof e && e != e
      };

      function o(e, t) {
        if (e.length !== t.length) return !1;
        for (var r = 0; r < e.length; r++)
          if (!((o = e[r]) === (i = t[r]) || n(o) && n(i))) return !1;
        var o, i;
        return !0
      }
      const i = function(e, t) {
        var r;
        void 0 === t && (t = o);
        var n, i = [],
          a = !1;
        return function() {
          for (var o = [], u = 0; u < arguments.length; u++) o[u] = arguments[u];
          return a && r === this && t(o, i) || (n = e.apply(this, o), a = !0, r = this, i = o), n
        }
      }
    },
    818726: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = function(e) {
        var t = [],
          r = null,
          n = function() {
            for (var n = arguments.length, o = new Array(n), i = 0; i < n; i++) o[i] = arguments[i];
            t = o, r || (r = requestAnimationFrame((function() {
              r = null, e.apply(void 0, t)
            })))
          };
        return n.cancel = function() {
          r && (cancelAnimationFrame(r), r = null)
        }, n
      }
    },
    203473: (e, t, r) => {
      r.r(t), r.d(t, {
        DragDropContext: () => gn,
        Draggable: () => qn,
        Droppable: () => Yn,
        resetServerContext: () => fn,
        useKeyboardSensor: () => Vr,
        useMouseSensor: () => jr,
        useTouchSensor: () => Jr
      });
      var n = r(827378),
        o = r.n(n),
        i = r(193219),
        a = r(925773),
        u = r(645106),
        l = r(177897),
        c = r(403495),
        s = r(140565),
        d = r(556583),
        p = r(818726),
        f = r(331542),
        g = r.n(f);

      function v(e, t) {}

      function m() {}

      function b(e, t, r) {
        var n = t.map((function(t) {
          var n, o, i = (n = r, o = t.options, (0, a.default)({}, n, {}, o));
          return e.addEventListener(t.eventName, t.fn, i),
            function() {
              e.removeEventListener(t.eventName, t.fn, i)
            }
        }));
        return function() {
          n.forEach((function(e) {
            e()
          }))
        }
      }
      v.bind(null, "warn"), v.bind(null, "error");
      var h = !0,
        y = "Invariant failed";

      function x(e) {
        this.message = e
      }

      function I(e, t) {
        if (!e) throw new x(h ? y : y + ": " + (t || ""))
      }
      x.prototype.toString = function() {
        return this.message
      };
      var D = function(e) {
          function t() {
            for (var t, r = arguments.length, n = new Array(r), o = 0; o < r; o++) n[o] = arguments[o];
            return (t = e.call.apply(e, [this].concat(n)) || this).callbacks = null, t.unbind = m, t.onWindowError = function(e) {
              var r = t.getCallbacks();
              r.isDragging() && r.tryAbort(), e.error instanceof x && e.preventDefault()
            }, t.getCallbacks = function() {
              if (!t.callbacks) throw new Error("Unable to find AppCallbacks in <ErrorBoundary/>");
              return t.callbacks
            }, t.setCallbacks = function(e) {
              t.callbacks = e
            }, t
          }(0, i.default)(t, e);
          var r = t.prototype;
          return r.componentDidMount = function() {
            this.unbind = b(window, [{
              eventName: "error",
              fn: this.onWindowError
            }])
          }, r.componentDidCatch = function(e) {
            if (!(e instanceof x)) throw e;
            this.setState({})
          }, r.componentWillUnmount = function() {
            this.unbind()
          }, r.render = function() {
            return this.props.children(this.setCallbacks)
          }, t
        }(o().Component),
        w = function(e) {
          return e + 1
        },
        C = function(e, t) {
          var r = e.droppableId === t.droppableId,
            n = w(e.index),
            o = w(t.index);
          return r ? "\n      You have moved the item from position " + n + "\n      to position " + o + "\n    " : "\n    You have moved the item from position " + n + "\n    in list " + e.droppableId + "\n    to list " + t.droppableId + "\n    in position " + o + "\n  "
        },
        E = function(e, t, r) {
          return t.droppableId === r.droppableId ? "\n      The item " + e + "\n      has been combined with " + r.draggableId : "\n      The item " + e + "\n      in list " + t.droppableId + "\n      has been combined with " + r.draggableId + "\n      in list " + r.droppableId + "\n    "
        },
        S = function(e) {
          return "\n  The item has returned to its starting position\n  of " + w(e.index) + "\n"
        },
        P = {
          dragHandleUsageInstructions: "\n  Press space bar to start a drag.\n  When dragging you can use the arrow keys to move the item around and escape to cancel.\n  Some screen readers may require you to be in focus mode or to use your pass through key\n",
          onDragStart: function(e) {
            return "\n  You have lifted an item in position " + w(e.source.index) + "\n"
          },
          onDragUpdate: function(e) {
            var t = e.destination;
            if (t) return C(e.source, t);
            var r = e.combine;
            return r ? E(e.draggableId, e.source, r) : "You are over an area that cannot be dropped on"
          },
          onDragEnd: function(e) {
            if ("CANCEL" === e.reason) return "\n      Movement cancelled.\n      " + S(e.source) + "\n    ";
            var t = e.destination,
              r = e.combine;
            return t ? "\n      You have dropped the item.\n      " + C(e.source, t) + "\n    " : r ? "\n      You have dropped the item.\n      " + E(e.draggableId, e.source, r) + "\n    " : "\n    The item has been dropped while not over a drop area.\n    " + S(e.source) + "\n  "
          }
        },
        R = {
          x: 0,
          y: 0
        },
        O = function(e, t) {
          return {
            x: e.x + t.x,
            y: e.y + t.y
          }
        },
        A = function(e, t) {
          return {
            x: e.x - t.x,
            y: e.y - t.y
          }
        },
        N = function(e, t) {
          return e.x === t.x && e.y === t.y
        },
        B = function(e) {
          return {
            x: 0 !== e.x ? -e.x : 0,
            y: 0 !== e.y ? -e.y : 0
          }
        },
        M = function(e, t, r) {
          var n;
          return void 0 === r && (r = 0), (n = {})[e] = t, n["x" === e ? "y" : "x"] = r, n
        },
        T = function(e, t) {
          return Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2))
        },
        L = function(e, t) {
          return Math.min.apply(Math, t.map((function(t) {
            return T(e, t)
          })))
        },
        G = function(e) {
          return function(t) {
            return {
              x: e(t.x),
              y: e(t.y)
            }
          }
        },
        k = function(e, t) {
          return {
            top: e.top + t.y,
            left: e.left + t.x,
            bottom: e.bottom + t.y,
            right: e.right + t.x
          }
        },
        _ = function(e) {
          return [{
            x: e.left,
            y: e.top
          }, {
            x: e.right,
            y: e.top
          }, {
            x: e.left,
            y: e.bottom
          }, {
            x: e.right,
            y: e.bottom
          }]
        },
        F = function(e, t) {
          return t && t.shouldClipSubject ? function(e, t) {
            var r = (0, s.getRect)({
              top: Math.max(t.top, e.top),
              right: Math.min(t.right, e.right),
              bottom: Math.min(t.bottom, e.bottom),
              left: Math.max(t.left, e.left)
            });
            return r.width <= 0 || r.height <= 0 ? null : r
          }(t.pageMarginBox, e) : (0, s.getRect)(e)
        },
        U = function(e) {
          var t = e.page,
            r = e.withPlaceholder,
            n = e.axis,
            o = e.frame,
            i = function(e, t) {
              return t ? k(e, t.scroll.diff.displacement) : e
            }(t.marginBox, o),
            u = function(e, t, r) {
              var n;
              return r && r.increasedBy ? (0, a.default)({}, e, ((n = {})[t.end] = e[t.end] + r.increasedBy[t.line], n)) : e
            }(i, n, r);
          return {
            page: t,
            withPlaceholder: r,
            active: F(u, o)
          }
        },
        W = function(e, t) {
          e.frame || I(!1);
          var r = e.frame,
            n = A(t, r.scroll.initial),
            o = B(n),
            i = (0, a.default)({}, r, {
              scroll: {
                initial: r.scroll.initial,
                current: t,
                diff: {
                  value: n,
                  displacement: o
                },
                max: r.scroll.max
              }
            }),
            u = U({
              page: e.subject.page,
              withPlaceholder: e.subject.withPlaceholder,
              axis: e.axis,
              frame: i
            });
          return (0, a.default)({}, e, {
            frame: i,
            subject: u
          })
        };

      function j(e) {
        return Object.values ? Object.values(e) : Object.keys(e).map((function(t) {
          return e[t]
        }))
      }

      function H(e, t) {
        if (e.findIndex) return e.findIndex(t);
        for (var r = 0; r < e.length; r++)
          if (t(e[r])) return r;
        return -1
      }

      function q(e, t) {
        if (e.find) return e.find(t);
        var r = H(e, t);
        return -1 !== r ? e[r] : void 0
      }

      function V(e) {
        return Array.prototype.slice.call(e)
      }
      var z = (0, d.default)((function(e) {
          return e.reduce((function(e, t) {
            return e[t.descriptor.id] = t, e
          }), {})
        })),
        $ = (0, d.default)((function(e) {
          return e.reduce((function(e, t) {
            return e[t.descriptor.id] = t, e
          }), {})
        })),
        Y = (0, d.default)((function(e) {
          return j(e)
        })),
        J = (0, d.default)((function(e) {
          return j(e)
        })),
        K = (0, d.default)((function(e, t) {
          var r = J(t).filter((function(t) {
            return e === t.descriptor.droppableId
          })).sort((function(e, t) {
            return e.descriptor.index - t.descriptor.index
          }));
          return r
        }));

      function X(e) {
        return e.at && "REORDER" === e.at.type ? e.at.destination : null
      }

      function Q(e) {
        return e.at && "COMBINE" === e.at.type ? e.at.combine : null
      }
      var Z = (0, d.default)((function(e, t) {
          return t.filter((function(t) {
            return t.descriptor.id !== e.descriptor.id
          }))
        })),
        ee = function(e, t) {
          return e.descriptor.droppableId === t.descriptor.id
        },
        te = {
          point: R,
          value: 0
        },
        re = {
          invisible: {},
          visible: {},
          all: []
        },
        ne = {
          displaced: re,
          displacedBy: te,
          at: null
        },
        oe = function(e, t) {
          return function(r) {
            return e <= r && r <= t
          }
        },
        ie = function(e) {
          var t = oe(e.top, e.bottom),
            r = oe(e.left, e.right);
          return function(n) {
            if (t(n.top) && t(n.bottom) && r(n.left) && r(n.right)) return !0;
            var o = t(n.top) || t(n.bottom),
              i = r(n.left) || r(n.right);
            if (o && i) return !0;
            var a = n.top < e.top && n.bottom > e.bottom,
              u = n.left < e.left && n.right > e.right;
            return !(!a || !u) || a && i || u && o
          }
        },
        ae = function(e) {
          var t = oe(e.top, e.bottom),
            r = oe(e.left, e.right);
          return function(e) {
            return t(e.top) && t(e.bottom) && r(e.left) && r(e.right)
          }
        },
        ue = {
          direction: "vertical",
          line: "y",
          crossAxisLine: "x",
          start: "top",
          end: "bottom",
          size: "height",
          crossAxisStart: "left",
          crossAxisEnd: "right",
          crossAxisSize: "width"
        },
        le = {
          direction: "horizontal",
          line: "x",
          crossAxisLine: "y",
          start: "left",
          end: "right",
          size: "width",
          crossAxisStart: "top",
          crossAxisEnd: "bottom",
          crossAxisSize: "height"
        },
        ce = function(e) {
          var t = e.target,
            r = e.destination,
            n = e.viewport,
            o = e.withDroppableDisplacement,
            i = e.isVisibleThroughFrameFn,
            a = o ? function(e, t) {
              var r = t.frame ? t.frame.scroll.diff.displacement : R;
              return k(e, r)
            }(t, r) : t;
          return function(e, t, r) {
            return !!t.subject.active && r(t.subject.active)(e)
          }(a, r, i) && function(e, t, r) {
            return r(t)(e)
          }(a, n, i)
        },
        se = function(e) {
          return ce((0, a.default)({}, e, {
            isVisibleThroughFrameFn: ie
          }))
        },
        de = function(e) {
          return ce((0, a.default)({}, e, {
            isVisibleThroughFrameFn: ae
          }))
        },
        pe = function(e, t, r) {
          if ("boolean" == typeof r) return r;
          if (!t) return !0;
          var n = t.invisible,
            o = t.visible;
          if (n[e]) return !1;
          var i = o[e];
          return !i || i.shouldAnimate
        };

      function fe(e) {
        var t = e.afterDragging,
          r = e.destination,
          n = e.displacedBy,
          o = e.viewport,
          i = e.forceShouldAnimate,
          a = e.last;
        return t.reduce((function(e, t) {
          var u = function(e, t) {
              var r = e.page.marginBox,
                n = {
                  top: t.point.y,
                  right: 0,
                  bottom: 0,
                  left: t.point.x
                };
              return (0, s.getRect)((0, s.expand)(r, n))
            }(t, n),
            l = t.descriptor.id;
          if (e.all.push(l), !se({
              target: u,
              destination: r,
              viewport: o,
              withDroppableDisplacement: !0
            })) return e.invisible[t.descriptor.id] = !0, e;
          var c = {
            draggableId: l,
            shouldAnimate: pe(l, a, i)
          };
          return e.visible[l] = c, e
        }), {
          all: [],
          visible: {},
          invisible: {}
        })
      }

      function ge(e) {
        var t = e.insideDestination,
          r = e.inHomeList,
          n = e.displacedBy,
          o = e.destination,
          i = function(e, t) {
            if (!e.length) return 0;
            var r = e[e.length - 1].descriptor.index;
            return t.inHomeList ? r : r + 1
          }(t, {
            inHomeList: r
          });
        return {
          displaced: re,
          displacedBy: n,
          at: {
            type: "REORDER",
            destination: {
              droppableId: o.descriptor.id,
              index: i
            }
          }
        }
      }

      function ve(e) {
        var t = e.draggable,
          r = e.insideDestination,
          n = e.destination,
          o = e.viewport,
          i = e.displacedBy,
          a = e.last,
          u = e.index,
          l = e.forceShouldAnimate,
          c = ee(t, n);
        if (null == u) return ge({
          insideDestination: r,
          inHomeList: c,
          displacedBy: i,
          destination: n
        });
        var s = q(r, (function(e) {
          return e.descriptor.index === u
        }));
        if (!s) return ge({
          insideDestination: r,
          inHomeList: c,
          displacedBy: i,
          destination: n
        });
        var d = Z(t, r),
          p = r.indexOf(s);
        return {
          displaced: fe({
            afterDragging: d.slice(p),
            destination: n,
            displacedBy: i,
            last: a,
            viewport: o.frame,
            forceShouldAnimate: l
          }),
          displacedBy: i,
          at: {
            type: "REORDER",
            destination: {
              droppableId: n.descriptor.id,
              index: u
            }
          }
        }
      }

      function me(e, t) {
        return Boolean(t.effected[e])
      }
      var be = function(e, t) {
          return t.margin[e.start] + t.borderBox[e.size] / 2
        },
        he = function(e, t, r) {
          return t[e.crossAxisStart] + r.margin[e.crossAxisStart] + r.borderBox[e.crossAxisSize] / 2
        },
        ye = function(e) {
          var t = e.axis,
            r = e.moveRelativeTo,
            n = e.isMoving;
          return M(t.line, r.marginBox[t.end] + be(t, n), he(t, r.marginBox, n))
        },
        xe = function(e) {
          var t = e.axis,
            r = e.moveRelativeTo,
            n = e.isMoving;
          return M(t.line, r.marginBox[t.start] - function(e, t) {
            return t.margin[e.end] + t.borderBox[e.size] / 2
          }(t, n), he(t, r.marginBox, n))
        },
        Ie = function(e, t) {
          var r = e.frame;
          return r ? O(t, r.scroll.diff.displacement) : t
        },
        De = function(e) {
          var t = function(e) {
              var t = e.impact,
                r = e.draggable,
                n = e.droppable,
                o = e.draggables,
                i = e.afterCritical,
                a = r.page.borderBox.center,
                u = t.at;
              return n && u ? "REORDER" === u.type ? function(e) {
                var t = e.impact,
                  r = e.draggable,
                  n = e.draggables,
                  o = e.droppable,
                  i = e.afterCritical,
                  a = K(o.descriptor.id, n),
                  u = r.page,
                  l = o.axis;
                if (!a.length) return function(e) {
                  var t = e.axis,
                    r = e.moveInto,
                    n = e.isMoving;
                  return M(t.line, r.contentBox[t.start] + be(t, n), he(t, r.contentBox, n))
                }({
                  axis: l,
                  moveInto: o.page,
                  isMoving: u
                });
                var c = t.displaced,
                  d = t.displacedBy,
                  p = c.all[0];
                if (p) {
                  var f = n[p];
                  if (me(p, i)) return xe({
                    axis: l,
                    moveRelativeTo: f.page,
                    isMoving: u
                  });
                  var g = (0, s.offset)(f.page, d.point);
                  return xe({
                    axis: l,
                    moveRelativeTo: g,
                    isMoving: u
                  })
                }
                var v = a[a.length - 1];
                if (v.descriptor.id === r.descriptor.id) return u.borderBox.center;
                if (me(v.descriptor.id, i)) {
                  var m = (0, s.offset)(v.page, B(i.displacedBy.point));
                  return ye({
                    axis: l,
                    moveRelativeTo: m,
                    isMoving: u
                  })
                }
                return ye({
                  axis: l,
                  moveRelativeTo: v.page,
                  isMoving: u
                })
              }({
                impact: t,
                draggable: r,
                draggables: o,
                droppable: n,
                afterCritical: i
              }) : function(e) {
                var t = e.afterCritical,
                  r = e.impact,
                  n = e.draggables,
                  o = Q(r);
                o || I(!1);
                var i = o.draggableId,
                  a = n[i].page.borderBox.center,
                  u = function(e) {
                    var t = e.displaced,
                      r = e.afterCritical,
                      n = e.combineWith,
                      o = e.displacedBy,
                      i = Boolean(t.visible[n] || t.invisible[n]);
                    return me(n, r) ? i ? R : B(o.point) : i ? o.point : R
                  }({
                    displaced: r.displaced,
                    afterCritical: t,
                    combineWith: i,
                    displacedBy: r.displacedBy
                  });
                return O(a, u)
              }({
                impact: t,
                draggables: o,
                afterCritical: i
              }) : a
            }(e),
            r = e.droppable;
          return r ? Ie(r, t) : t
        },
        we = function(e, t) {
          var r = A(t, e.scroll.initial),
            n = B(r);
          return {
            frame: (0, s.getRect)({
              top: t.y,
              bottom: t.y + e.frame.height,
              left: t.x,
              right: t.x + e.frame.width
            }),
            scroll: {
              initial: e.scroll.initial,
              max: e.scroll.max,
              current: t,
              diff: {
                value: r,
                displacement: n
              }
            }
          }
        };

      function Ce(e, t) {
        return e.map((function(e) {
          return t[e]
        }))
      }
      var Ee = function(e) {
          var t, r, n = e.pageBorderBoxCenter,
            o = e.draggable,
            i = (t = e.viewport, r = n, O(t.scroll.diff.displacement, r)),
            a = A(i, o.page.borderBox.center);
          return O(o.client.borderBox.center, a)
        },
        Se = function(e) {
          var t = e.draggable,
            r = e.destination,
            n = e.newPageBorderBoxCenter,
            o = e.viewport,
            i = e.withDroppableDisplacement,
            u = e.onlyOnMainAxis,
            l = void 0 !== u && u,
            c = A(n, t.page.borderBox.center),
            s = {
              target: k(t.page.borderBox, c),
              destination: r,
              withDroppableDisplacement: i,
              viewport: o
            };
          return l ? function(e) {
            return ce((0, a.default)({}, e, {
              isVisibleThroughFrameFn: (t = e.destination.axis, function(e) {
                var r = oe(e.top, e.bottom),
                  n = oe(e.left, e.right);
                return function(e) {
                  return t === ue ? r(e.top) && r(e.bottom) : n(e.left) && n(e.right)
                }
              })
            }));
            var t
          }(s) : de(s)
        },
        Pe = function(e) {
          var t = e.isMovingForward,
            r = e.draggable,
            n = e.destination,
            o = e.draggables,
            i = e.previousImpact,
            u = e.viewport,
            l = e.previousPageBorderBoxCenter,
            c = e.previousClientSelection,
            s = e.afterCritical;
          if (!n.isEnabled) return null;
          var d = K(n.descriptor.id, o),
            p = ee(r, n),
            f = function(e) {
              var t = e.isMovingForward,
                r = e.draggable,
                n = e.destination,
                o = e.insideDestination,
                i = e.previousImpact;
              if (!n.isCombineEnabled) return null;
              if (!X(i)) return null;

              function u(e) {
                var t = {
                  type: "COMBINE",
                  combine: {
                    draggableId: e,
                    droppableId: n.descriptor.id
                  }
                };
                return (0, a.default)({}, i, {
                  at: t
                })
              }
              var l = i.displaced.all,
                c = l.length ? l[0] : null;
              if (t) return c ? u(c) : null;
              var s = Z(r, o);
              if (!c) return s.length ? u(s[s.length - 1].descriptor.id) : null;
              var d = H(s, (function(e) {
                return e.descriptor.id === c
              })); - 1 === d && I(!1);
              var p = d - 1;
              return p < 0 ? null : u(s[p].descriptor.id)
            }({
              isMovingForward: t,
              draggable: r,
              destination: n,
              insideDestination: d,
              previousImpact: i
            }) || function(e) {
              var t = e.isMovingForward,
                r = e.isInHomeList,
                n = e.draggable,
                o = e.draggables,
                i = e.destination,
                a = e.insideDestination,
                u = e.previousImpact,
                l = e.viewport,
                c = e.afterCritical,
                s = u.at;
              if (s || I(!1), "REORDER" === s.type) {
                var d = function(e) {
                  var t = e.isMovingForward,
                    r = e.isInHomeList,
                    n = e.insideDestination,
                    o = e.location;
                  if (!n.length) return null;
                  var i = o.index,
                    a = t ? i + 1 : i - 1,
                    u = n[0].descriptor.index,
                    l = n[n.length - 1].descriptor.index;
                  return a < u || a > (r ? l : l + 1) ? null : a
                }({
                  isMovingForward: t,
                  isInHomeList: r,
                  location: s.destination,
                  insideDestination: a
                });
                return null == d ? null : ve({
                  draggable: n,
                  insideDestination: a,
                  destination: i,
                  viewport: l,
                  last: u.displaced,
                  displacedBy: u.displacedBy,
                  index: d
                })
              }
              var p = function(e) {
                var t = e.isMovingForward,
                  r = e.draggables,
                  n = e.combine,
                  o = e.afterCritical;
                if (!e.destination.isCombineEnabled) return null;
                var i = n.draggableId,
                  a = r[i].descriptor.index;
                return me(i, o) ? t ? a : a - 1 : t ? a + 1 : a
              }({
                isMovingForward: t,
                destination: i,
                displaced: u.displaced,
                draggables: o,
                combine: s.combine,
                afterCritical: c
              });
              return null == p ? null : ve({
                draggable: n,
                insideDestination: a,
                destination: i,
                viewport: l,
                last: u.displaced,
                displacedBy: u.displacedBy,
                index: p
              })
            }({
              isMovingForward: t,
              isInHomeList: p,
              draggable: r,
              draggables: o,
              destination: n,
              insideDestination: d,
              previousImpact: i,
              viewport: u,
              afterCritical: s
            });
          if (!f) return null;
          var g = De({
            impact: f,
            draggable: r,
            droppable: n,
            draggables: o,
            afterCritical: s
          });
          if (Se({
              draggable: r,
              destination: n,
              newPageBorderBoxCenter: g,
              viewport: u.frame,
              withDroppableDisplacement: !1,
              onlyOnMainAxis: !0
            })) return {
            clientSelection: Ee({
              pageBorderBoxCenter: g,
              draggable: r,
              viewport: u
            }),
            impact: f,
            scrollJumpRequest: null
          };
          var v = A(g, l),
            m = function(e) {
              var t = e.impact,
                r = e.viewport,
                n = e.destination,
                o = e.draggables,
                i = e.maxScrollChange,
                u = we(r, O(r.scroll.current, i)),
                l = n.frame ? W(n, O(n.frame.scroll.current, i)) : n,
                c = t.displaced,
                s = fe({
                  afterDragging: Ce(c.all, o),
                  destination: n,
                  displacedBy: t.displacedBy,
                  viewport: u.frame,
                  last: c,
                  forceShouldAnimate: !1
                }),
                d = fe({
                  afterDragging: Ce(c.all, o),
                  destination: l,
                  displacedBy: t.displacedBy,
                  viewport: r.frame,
                  last: c,
                  forceShouldAnimate: !1
                }),
                p = {},
                f = {},
                g = [c, s, d];
              return c.all.forEach((function(e) {
                var t = function(e, t) {
                  for (var r = 0; r < t.length; r++) {
                    var n = t[r].visible[e];
                    if (n) return n
                  }
                  return null
                }(e, g);
                t ? f[e] = t : p[e] = !0
              })), (0, a.default)({}, t, {
                displaced: {
                  all: c.all,
                  invisible: p,
                  visible: f
                }
              })
            }({
              impact: f,
              viewport: u,
              destination: n,
              draggables: o,
              maxScrollChange: v
            });
          return {
            clientSelection: c,
            impact: m,
            scrollJumpRequest: v
          }
        },
        Re = function(e) {
          var t = e.subject.active;
          return t || I(!1), t
        },
        Oe = function(e, t) {
          var r = e.page.borderBox.center;
          return me(e.descriptor.id, t) ? A(r, t.displacedBy.point) : r
        },
        Ae = function(e, t) {
          var r = e.page.borderBox;
          return me(e.descriptor.id, t) ? k(r, B(t.displacedBy.point)) : r
        },
        Ne = (0, d.default)((function(e, t) {
          var r = t[e.line];
          return {
            value: r,
            point: M(e.line, r)
          }
        })),
        Be = function(e, t) {
          return (0, a.default)({}, e, {
            scroll: (0, a.default)({}, e.scroll, {
              max: t
            })
          })
        },
        Me = function(e, t, r) {
          var n = e.frame;
          ee(t, e) && I(!1), e.subject.withPlaceholder && I(!1);
          var o = Ne(e.axis, t.displaceBy).point,
            i = function(e, t, r) {
              var n = e.axis;
              if ("virtual" === e.descriptor.mode) return M(n.line, t[n.line]);
              var o = e.subject.page.contentBox[n.size],
                i = K(e.descriptor.id, r).reduce((function(e, t) {
                  return e + t.client.marginBox[n.size]
                }), 0) + t[n.line] - o;
              return i <= 0 ? null : M(n.line, i)
            }(e, o, r),
            u = {
              placeholderSize: o,
              increasedBy: i,
              oldFrameMaxScroll: e.frame ? e.frame.scroll.max : null
            };
          if (!n) {
            var l = U({
              page: e.subject.page,
              withPlaceholder: u,
              axis: e.axis,
              frame: e.frame
            });
            return (0, a.default)({}, e, {
              subject: l
            })
          }
          var c = i ? O(n.scroll.max, i) : n.scroll.max,
            s = Be(n, c),
            d = U({
              page: e.subject.page,
              withPlaceholder: u,
              axis: e.axis,
              frame: s
            });
          return (0, a.default)({}, e, {
            subject: d,
            frame: s
          })
        },
        Te = function(e) {
          var t = e.at;
          return t ? "REORDER" === t.type ? t.destination.droppableId : t.combine.droppableId : null
        },
        Le = function(e) {
          var t = e.state,
            r = e.type,
            n = function(e, t) {
              var r = Te(e);
              return r ? t[r] : null
            }(t.impact, t.dimensions.droppables),
            o = Boolean(n),
            i = t.dimensions.droppables[t.critical.droppable.id],
            a = n || i,
            u = a.axis.direction,
            l = "vertical" === u && ("MOVE_UP" === r || "MOVE_DOWN" === r) || "horizontal" === u && ("MOVE_LEFT" === r || "MOVE_RIGHT" === r);
          if (l && !o) return null;
          var c = "MOVE_DOWN" === r || "MOVE_RIGHT" === r,
            s = t.dimensions.draggables[t.critical.draggable.id],
            d = t.current.page.borderBoxCenter,
            p = t.dimensions,
            f = p.draggables,
            g = p.droppables;
          return l ? Pe({
            isMovingForward: c,
            previousPageBorderBoxCenter: d,
            draggable: s,
            destination: a,
            draggables: f,
            viewport: t.viewport,
            previousClientSelection: t.current.client.selection,
            previousImpact: t.impact,
            afterCritical: t.afterCritical
          }) : function(e) {
            var t = e.isMovingForward,
              r = e.previousPageBorderBoxCenter,
              n = e.draggable,
              o = e.isOver,
              i = e.draggables,
              a = e.droppables,
              u = e.viewport,
              l = e.afterCritical,
              c = function(e) {
                var t = e.isMovingForward,
                  r = e.pageBorderBoxCenter,
                  n = e.source,
                  o = e.droppables,
                  i = e.viewport,
                  a = n.subject.active;
                if (!a) return null;
                var u = n.axis,
                  l = oe(a[u.start], a[u.end]),
                  c = Y(o).filter((function(e) {
                    return e !== n
                  })).filter((function(e) {
                    return e.isEnabled
                  })).filter((function(e) {
                    return Boolean(e.subject.active)
                  })).filter((function(e) {
                    return ie(i.frame)(Re(e))
                  })).filter((function(e) {
                    var r = Re(e);
                    return t ? a[u.crossAxisEnd] < r[u.crossAxisEnd] : r[u.crossAxisStart] < a[u.crossAxisStart]
                  })).filter((function(e) {
                    var t = Re(e),
                      r = oe(t[u.start], t[u.end]);
                    return l(t[u.start]) || l(t[u.end]) || r(a[u.start]) || r(a[u.end])
                  })).sort((function(e, r) {
                    var n = Re(e)[u.crossAxisStart],
                      o = Re(r)[u.crossAxisStart];
                    return t ? n - o : o - n
                  })).filter((function(e, t, r) {
                    return Re(e)[u.crossAxisStart] === Re(r[0])[u.crossAxisStart]
                  }));
                if (!c.length) return null;
                if (1 === c.length) return c[0];
                var s = c.filter((function(e) {
                  return oe(Re(e)[u.start], Re(e)[u.end])(r[u.line])
                }));
                return 1 === s.length ? s[0] : s.length > 1 ? s.sort((function(e, t) {
                  return Re(e)[u.start] - Re(t)[u.start]
                }))[0] : c.sort((function(e, t) {
                  var n = L(r, _(Re(e))),
                    o = L(r, _(Re(t)));
                  return n !== o ? n - o : Re(e)[u.start] - Re(t)[u.start]
                }))[0]
              }({
                isMovingForward: t,
                pageBorderBoxCenter: r,
                source: o,
                droppables: a,
                viewport: u
              });
            if (!c) return null;
            var s = K(c.descriptor.id, i),
              d = function(e) {
                var t = e.pageBorderBoxCenter,
                  r = e.viewport,
                  n = e.destination,
                  o = e.afterCritical,
                  i = e.insideDestination.filter((function(e) {
                    return de({
                      target: Ae(e, o),
                      destination: n,
                      viewport: r.frame,
                      withDroppableDisplacement: !0
                    })
                  })).sort((function(e, r) {
                    var i = T(t, Ie(n, Oe(e, o))),
                      a = T(t, Ie(n, Oe(r, o)));
                    return i < a ? -1 : a < i ? 1 : e.descriptor.index - r.descriptor.index
                  }));
                return i[0] || null
              }({
                pageBorderBoxCenter: r,
                viewport: u,
                destination: c,
                insideDestination: s,
                afterCritical: l
              }),
              p = function(e) {
                var t = e.previousPageBorderBoxCenter,
                  r = e.moveRelativeTo,
                  n = e.insideDestination,
                  o = e.draggable,
                  i = e.draggables,
                  a = e.destination,
                  u = e.viewport,
                  l = e.afterCritical;
                if (!r) {
                  if (n.length) return null;
                  var c = {
                      displaced: re,
                      displacedBy: te,
                      at: {
                        type: "REORDER",
                        destination: {
                          droppableId: a.descriptor.id,
                          index: 0
                        }
                      }
                    },
                    s = De({
                      impact: c,
                      draggable: o,
                      droppable: a,
                      draggables: i,
                      afterCritical: l
                    }),
                    d = ee(o, a) ? a : Me(a, o, i);
                  return Se({
                    draggable: o,
                    destination: d,
                    newPageBorderBoxCenter: s,
                    viewport: u.frame,
                    withDroppableDisplacement: !1,
                    onlyOnMainAxis: !0
                  }) ? c : null
                }
                var p, f = Boolean(t[a.axis.line] <= r.page.borderBox.center[a.axis.line]),
                  g = (p = r.descriptor.index, r.descriptor.id === o.descriptor.id || f ? p : p + 1);
                return ve({
                  draggable: o,
                  insideDestination: n,
                  destination: a,
                  viewport: u,
                  displacedBy: Ne(a.axis, o.displaceBy),
                  last: re,
                  index: g
                })
              }({
                previousPageBorderBoxCenter: r,
                destination: c,
                draggable: n,
                draggables: i,
                moveRelativeTo: d,
                insideDestination: s,
                viewport: u,
                afterCritical: l
              });
            if (!p) return null;
            var f = De({
              impact: p,
              draggable: n,
              droppable: c,
              draggables: i,
              afterCritical: l
            });
            return {
              clientSelection: Ee({
                pageBorderBoxCenter: f,
                draggable: n,
                viewport: u
              }),
              impact: p,
              scrollJumpRequest: null
            }
          }({
            isMovingForward: c,
            previousPageBorderBoxCenter: d,
            draggable: s,
            isOver: a,
            draggables: f,
            droppables: g,
            viewport: t.viewport,
            afterCritical: t.afterCritical
          })
        };

      function Ge(e) {
        return "DRAGGING" === e.phase || "COLLECTING" === e.phase
      }

      function ke(e) {
        var t = oe(e.top, e.bottom),
          r = oe(e.left, e.right);
        return function(e) {
          return t(e.y) && r(e.x)
        }
      }
      var _e = function(e, t) {
        return (0, s.getRect)(k(e, t))
      };

      function Fe(e) {
        var t = e.displaced,
          r = e.id;
        return Boolean(t.visible[r] || t.invisible[r])
      }
      var Ue = function(e) {
          var t = e.pageOffset,
            r = e.draggable,
            n = e.draggables,
            o = e.droppables,
            i = e.previousImpact,
            a = e.viewport,
            u = e.afterCritical,
            l = _e(r.page.borderBox, t),
            c = function(e) {
              var t = e.pageBorderBox,
                r = e.draggable,
                n = e.droppables,
                o = Y(n).filter((function(e) {
                  if (!e.isEnabled) return !1;
                  var r, n, o = e.subject.active;
                  if (!o) return !1;
                  if (n = o, !((r = t).left < n.right && r.right > n.left && r.top < n.bottom && r.bottom > n.top)) return !1;
                  if (ke(o)(t.center)) return !0;
                  var i = e.axis,
                    a = o.center[i.crossAxisLine],
                    u = t[i.crossAxisStart],
                    l = t[i.crossAxisEnd],
                    c = oe(o[i.crossAxisStart], o[i.crossAxisEnd]),
                    s = c(u),
                    d = c(l);
                  return !s && !d || (s ? u < a : l > a)
                }));
              return o.length ? 1 === o.length ? o[0].descriptor.id : function(e) {
                var t = e.pageBorderBox,
                  r = e.candidates,
                  n = e.draggable.page.borderBox.center,
                  o = r.map((function(e) {
                    var r = e.axis,
                      o = M(e.axis.line, t.center[r.line], e.page.borderBox.center[r.crossAxisLine]);
                    return {
                      id: e.descriptor.id,
                      distance: T(n, o)
                    }
                  })).sort((function(e, t) {
                    return t.distance - e.distance
                  }));
                return o[0] ? o[0].id : null
              }({
                pageBorderBox: t,
                draggable: r,
                candidates: o
              }) : null
            }({
              pageBorderBox: l,
              draggable: r,
              droppables: o
            });
          if (!c) return ne;
          var s = o[c],
            d = K(s.descriptor.id, n),
            p = function(e, t) {
              var r = e.frame;
              return r ? _e(t, r.scroll.diff.value) : t
            }(s, l);
          return function(e) {
            var t = e.draggable,
              r = e.pageBorderBoxWithDroppableScroll,
              n = e.previousImpact,
              o = e.destination,
              i = e.insideDestination,
              a = e.afterCritical;
            if (!o.isCombineEnabled) return null;
            var u = o.axis,
              l = Ne(o.axis, t.displaceBy),
              c = l.value,
              s = r[u.start],
              d = r[u.end],
              p = q(Z(t, i), (function(e) {
                var t = e.descriptor.id,
                  r = e.page.borderBox,
                  o = r[u.size] / 4,
                  i = me(t, a),
                  l = Fe({
                    displaced: n.displaced,
                    id: t
                  });
                return i ? l ? d > r[u.start] + o && d < r[u.end] - o : s > r[u.start] - c + o && s < r[u.end] - c - o : l ? d > r[u.start] + c + o && d < r[u.end] + c - o : s > r[u.start] + o && s < r[u.end] - o
              }));
            return p ? {
              displacedBy: l,
              displaced: n.displaced,
              at: {
                type: "COMBINE",
                combine: {
                  draggableId: p.descriptor.id,
                  droppableId: o.descriptor.id
                }
              }
            } : null
          }({
            pageBorderBoxWithDroppableScroll: p,
            draggable: r,
            previousImpact: i,
            destination: s,
            insideDestination: d,
            afterCritical: u
          }) || function(e) {
            var t = e.pageBorderBoxWithDroppableScroll,
              r = e.draggable,
              n = e.destination,
              o = e.insideDestination,
              i = e.last,
              a = e.viewport,
              u = e.afterCritical,
              l = n.axis,
              c = Ne(n.axis, r.displaceBy),
              s = c.value,
              d = t[l.start],
              p = t[l.end],
              f = function(e) {
                var t = e.draggable,
                  r = e.closest;
                return r ? e.inHomeList && r.descriptor.index > t.descriptor.index ? r.descriptor.index - 1 : r.descriptor.index : null
              }({
                draggable: r,
                closest: q(Z(r, o), (function(e) {
                  var t = e.descriptor.id,
                    r = e.page.borderBox.center[l.line],
                    n = me(t, u),
                    o = Fe({
                      displaced: i,
                      id: t
                    });
                  return n ? o ? p <= r : d < r - s : o ? p <= r + s : d < r
                })),
                inHomeList: ee(r, n)
              });
            return ve({
              draggable: r,
              insideDestination: o,
              destination: n,
              viewport: a,
              last: i,
              displacedBy: c,
              index: f
            })
          }({
            pageBorderBoxWithDroppableScroll: p,
            draggable: r,
            destination: s,
            insideDestination: d,
            last: i.displaced,
            viewport: a,
            afterCritical: u
          })
        },
        We = function(e, t) {
          var r;
          return (0, a.default)({}, e, ((r = {})[t.descriptor.id] = t, r))
        },
        je = function(e) {
          var t = e.state,
            r = e.clientSelection,
            n = e.dimensions,
            o = e.viewport,
            i = e.impact,
            u = e.scrollJumpRequest,
            l = o || t.viewport,
            c = n || t.dimensions,
            s = r || t.current.client.selection,
            d = A(s, t.initial.client.selection),
            p = {
              offset: d,
              selection: s,
              borderBoxCenter: O(t.initial.client.borderBoxCenter, d)
            },
            f = {
              selection: O(p.selection, l.scroll.current),
              borderBoxCenter: O(p.borderBoxCenter, l.scroll.current),
              offset: O(p.offset, l.scroll.diff.value)
            },
            g = {
              client: p,
              page: f
            };
          if ("COLLECTING" === t.phase) return (0, a.default)({
            phase: "COLLECTING"
          }, t, {
            dimensions: c,
            viewport: l,
            current: g
          });
          var v = c.draggables[t.critical.draggable.id],
            m = i || Ue({
              pageOffset: f.offset,
              draggable: v,
              draggables: c.draggables,
              droppables: c.droppables,
              previousImpact: t.impact,
              viewport: l,
              afterCritical: t.afterCritical
            }),
            b = function(e) {
              var t = e.draggable,
                r = e.draggables,
                n = e.droppables,
                o = e.impact,
                i = function(e) {
                  var t = e.previousImpact,
                    r = e.impact,
                    n = e.droppables,
                    o = Te(t),
                    i = Te(r);
                  if (!o) return n;
                  if (o === i) return n;
                  var u = n[o];
                  if (!u.subject.withPlaceholder) return n;
                  var l = function(e) {
                    var t = e.subject.withPlaceholder;
                    t || I(!1);
                    var r = e.frame;
                    if (!r) {
                      var n = U({
                        page: e.subject.page,
                        axis: e.axis,
                        frame: null,
                        withPlaceholder: null
                      });
                      return (0, a.default)({}, e, {
                        subject: n
                      })
                    }
                    var o = t.oldFrameMaxScroll;
                    o || I(!1);
                    var i = Be(r, o),
                      u = U({
                        page: e.subject.page,
                        axis: e.axis,
                        frame: i,
                        withPlaceholder: null
                      });
                    return (0, a.default)({}, e, {
                      subject: u,
                      frame: i
                    })
                  }(u);
                  return We(n, l)
                }({
                  previousImpact: e.previousImpact,
                  impact: o,
                  droppables: n
                }),
                u = Te(o);
              if (!u) return i;
              var l = n[u];
              if (ee(t, l)) return i;
              if (l.subject.withPlaceholder) return i;
              var c = Me(l, t, r);
              return We(i, c)
            }({
              draggable: v,
              impact: m,
              previousImpact: t.impact,
              draggables: c.draggables,
              droppables: c.droppables
            });
          return (0, a.default)({}, t, {
            current: g,
            dimensions: {
              draggables: c.draggables,
              droppables: b
            },
            impact: m,
            viewport: l,
            scrollJumpRequest: u || null,
            forceShouldAnimate: !u && null
          })
        },
        He = function(e) {
          var t = e.impact,
            r = e.viewport,
            n = e.draggables,
            o = e.destination,
            i = e.forceShouldAnimate,
            u = t.displaced,
            l = function(e, t) {
              return e.map((function(e) {
                return t[e]
              }))
            }(u.all, n),
            c = fe({
              afterDragging: l,
              destination: o,
              displacedBy: t.displacedBy,
              viewport: r.frame,
              forceShouldAnimate: i,
              last: u
            });
          return (0, a.default)({}, t, {
            displaced: c
          })
        },
        qe = function(e) {
          var t = e.impact,
            r = e.draggable,
            n = e.droppable,
            o = e.draggables,
            i = e.viewport,
            a = e.afterCritical,
            u = De({
              impact: t,
              draggable: r,
              draggables: o,
              droppable: n,
              afterCritical: a
            });
          return Ee({
            pageBorderBoxCenter: u,
            draggable: r,
            viewport: i
          })
        },
        Ve = function(e) {
          var t = e.state,
            r = e.dimensions,
            n = e.viewport;
          "SNAP" !== t.movementMode && I(!1);
          var o = t.impact,
            i = n || t.viewport,
            a = r || t.dimensions,
            u = a.draggables,
            l = a.droppables,
            c = u[t.critical.draggable.id],
            s = Te(o);
          s || I(!1);
          var d = l[s],
            p = He({
              impact: o,
              viewport: i,
              destination: d,
              draggables: u
            }),
            f = qe({
              impact: p,
              draggable: c,
              droppable: d,
              draggables: u,
              viewport: i,
              afterCritical: t.afterCritical
            });
          return je({
            impact: p,
            clientSelection: f,
            state: t,
            dimensions: a,
            viewport: i
          })
        },
        ze = function(e) {
          var t = e.draggable,
            r = e.home,
            n = e.draggables,
            o = e.viewport,
            i = Ne(r.axis, t.displaceBy),
            a = K(r.descriptor.id, n),
            u = a.indexOf(t); - 1 === u && I(!1);
          var l, c = a.slice(u + 1),
            s = c.reduce((function(e, t) {
              return e[t.descriptor.id] = !0, e
            }), {}),
            d = {
              inVirtualList: "virtual" === r.descriptor.mode,
              displacedBy: i,
              effected: s
            };
          return {
            impact: {
              displaced: fe({
                afterDragging: c,
                destination: r,
                displacedBy: i,
                last: null,
                viewport: o.frame,
                forceShouldAnimate: !1
              }),
              displacedBy: i,
              at: {
                type: "REORDER",
                destination: (l = t.descriptor, {
                  index: l.index,
                  droppableId: l.droppableId
                })
              }
            },
            afterCritical: d
          }
        },
        $e = function(e) {
          return "SNAP" === e.movementMode
        },
        Ye = function(e, t, r) {
          var n = function(e, t) {
            return {
              draggables: e.draggables,
              droppables: We(e.droppables, t)
            }
          }(e.dimensions, t);
          return !$e(e) || r ? je({
            state: e,
            dimensions: n
          }) : Ve({
            state: e,
            dimensions: n
          })
        };

      function Je(e) {
        return e.isDragging && "SNAP" === e.movementMode ? (0, a.default)({
          phase: "DRAGGING"
        }, e, {
          scrollJumpRequest: null
        }) : e
      }
      var Ke = {
          phase: "IDLE",
          completed: null,
          shouldFlush: !1
        },
        Xe = function(e, t) {
          if (void 0 === e && (e = Ke), "FLUSH" === t.type) return (0, a.default)({}, Ke, {
            shouldFlush: !0
          });
          if ("INITIAL_PUBLISH" === t.type) {
            "IDLE" !== e.phase && I(!1);
            var r = t.payload,
              n = r.critical,
              o = r.clientSelection,
              i = r.viewport,
              u = r.dimensions,
              l = r.movementMode,
              c = u.draggables[n.draggable.id],
              d = u.droppables[n.droppable.id],
              p = {
                selection: o,
                borderBoxCenter: c.client.borderBox.center,
                offset: R
              },
              f = {
                client: p,
                page: {
                  selection: O(p.selection, i.scroll.initial),
                  borderBoxCenter: O(p.selection, i.scroll.initial),
                  offset: O(p.selection, i.scroll.diff.value)
                }
              },
              g = Y(u.droppables).every((function(e) {
                return !e.isFixedOnPage
              })),
              v = ze({
                draggable: c,
                home: d,
                draggables: u.draggables,
                viewport: i
              }),
              m = v.impact;
            return {
              phase: "DRAGGING",
              isDragging: !0,
              critical: n,
              movementMode: l,
              dimensions: u,
              initial: f,
              current: f,
              isWindowScrollAllowed: g,
              impact: m,
              afterCritical: v.afterCritical,
              onLiftImpact: m,
              viewport: i,
              scrollJumpRequest: null,
              forceShouldAnimate: null
            }
          }
          if ("COLLECTION_STARTING" === t.type) return "COLLECTING" === e.phase || "DROP_PENDING" === e.phase ? e : ("DRAGGING" !== e.phase && I(!1), (0, a.default)({
            phase: "COLLECTING"
          }, e, {
            phase: "COLLECTING"
          }));
          if ("PUBLISH_WHILE_DRAGGING" === t.type) return "COLLECTING" !== e.phase && "DROP_PENDING" !== e.phase && I(!1),
            function(e) {
              var t = e.state,
                r = e.published,
                n = r.modified.map((function(e) {
                  var r = t.dimensions.droppables[e.droppableId];
                  return W(r, e.scroll)
                })),
                o = (0, a.default)({}, t.dimensions.droppables, {}, z(n)),
                i = $(function(e) {
                  var t = e.additions,
                    r = e.updatedDroppables,
                    n = e.viewport,
                    o = n.scroll.diff.value;
                  return t.map((function(e) {
                    var t = e.descriptor.droppableId,
                      i = function(e) {
                        var t = e.frame;
                        return t || I(!1), t
                      }(r[t]),
                      u = i.scroll.diff.value,
                      l = function(e) {
                        var t = e.draggable,
                          r = e.offset,
                          n = e.initialWindowScroll,
                          o = (0, s.offset)(t.client, r),
                          i = (0, s.withScroll)(o, n);
                        return (0, a.default)({}, t, {
                          placeholder: (0, a.default)({}, t.placeholder, {
                            client: o
                          }),
                          client: o,
                          page: i
                        })
                      }({
                        draggable: e,
                        offset: O(o, u),
                        initialWindowScroll: n.scroll.initial
                      });
                    return l
                  }))
                }({
                  additions: r.additions,
                  updatedDroppables: o,
                  viewport: t.viewport
                })),
                u = (0, a.default)({}, t.dimensions.draggables, {}, i);
              r.removals.forEach((function(e) {
                delete u[e]
              }));
              var l = {
                  droppables: o,
                  draggables: u
                },
                c = Te(t.impact),
                d = c ? l.droppables[c] : null,
                p = l.draggables[t.critical.draggable.id],
                f = l.droppables[t.critical.droppable.id],
                g = ze({
                  draggable: p,
                  home: f,
                  draggables: u,
                  viewport: t.viewport
                }),
                v = g.impact,
                m = g.afterCritical,
                b = d && d.isCombineEnabled ? t.impact : v,
                h = Ue({
                  pageOffset: t.current.page.offset,
                  draggable: l.draggables[t.critical.draggable.id],
                  draggables: l.draggables,
                  droppables: l.droppables,
                  previousImpact: b,
                  viewport: t.viewport,
                  afterCritical: m
                }),
                y = (0, a.default)({
                  phase: "DRAGGING"
                }, t, {
                  phase: "DRAGGING",
                  impact: h,
                  onLiftImpact: v,
                  dimensions: l,
                  afterCritical: m,
                  forceShouldAnimate: !1
                });
              return "COLLECTING" === t.phase ? y : (0, a.default)({
                phase: "DROP_PENDING"
              }, y, {
                phase: "DROP_PENDING",
                reason: t.reason,
                isWaiting: !1
              })
            }({
              state: e,
              published: t.payload
            });
          if ("MOVE" === t.type) {
            if ("DROP_PENDING" === e.phase) return e;
            Ge(e) || I(!1);
            var b = t.payload.client;
            return N(b, e.current.client.selection) ? e : je({
              state: e,
              clientSelection: b,
              impact: $e(e) ? e.impact : null
            })
          }
          if ("UPDATE_DROPPABLE_SCROLL" === t.type) {
            if ("DROP_PENDING" === e.phase) return Je(e);
            if ("COLLECTING" === e.phase) return Je(e);
            Ge(e) || I(!1);
            var h = t.payload,
              y = h.id,
              x = h.newScroll,
              D = e.dimensions.droppables[y];
            if (!D) return e;
            var w = W(D, x);
            return Ye(e, w, !1)
          }
          if ("UPDATE_DROPPABLE_IS_ENABLED" === t.type) {
            if ("DROP_PENDING" === e.phase) return e;
            Ge(e) || I(!1);
            var C = t.payload,
              E = C.id,
              S = C.isEnabled,
              P = e.dimensions.droppables[E];
            P || I(!1), P.isEnabled === S && I(!1);
            var A = (0, a.default)({}, P, {
              isEnabled: S
            });
            return Ye(e, A, !0)
          }
          if ("UPDATE_DROPPABLE_IS_COMBINE_ENABLED" === t.type) {
            if ("DROP_PENDING" === e.phase) return e;
            Ge(e) || I(!1);
            var B = t.payload,
              M = B.id,
              T = B.isCombineEnabled,
              L = e.dimensions.droppables[M];
            L || I(!1), L.isCombineEnabled === T && I(!1);
            var G = (0, a.default)({}, L, {
              isCombineEnabled: T
            });
            return Ye(e, G, !0)
          }
          if ("MOVE_BY_WINDOW_SCROLL" === t.type) {
            if ("DROP_PENDING" === e.phase || "DROP_ANIMATING" === e.phase) return e;
            Ge(e) || I(!1), e.isWindowScrollAllowed || I(!1);
            var k = t.payload.newScroll;
            if (N(e.viewport.scroll.current, k)) return Je(e);
            var _ = we(e.viewport, k);
            return $e(e) ? Ve({
              state: e,
              viewport: _
            }) : je({
              state: e,
              viewport: _
            })
          }
          if ("UPDATE_VIEWPORT_MAX_SCROLL" === t.type) {
            if (!Ge(e)) return e;
            var F = t.payload.maxScroll;
            if (N(F, e.viewport.scroll.max)) return e;
            var U = (0, a.default)({}, e.viewport, {
              scroll: (0, a.default)({}, e.viewport.scroll, {
                max: F
              })
            });
            return (0, a.default)({
              phase: "DRAGGING"
            }, e, {
              viewport: U
            })
          }
          if ("MOVE_UP" === t.type || "MOVE_DOWN" === t.type || "MOVE_LEFT" === t.type || "MOVE_RIGHT" === t.type) {
            if ("COLLECTING" === e.phase || "DROP_PENDING" === e.phase) return e;
            "DRAGGING" !== e.phase && I(!1);
            var j = Le({
              state: e,
              type: t.type
            });
            return j ? je({
              state: e,
              impact: j.impact,
              clientSelection: j.clientSelection,
              scrollJumpRequest: j.scrollJumpRequest
            }) : e
          }
          if ("DROP_PENDING" === t.type) {
            var H = t.payload.reason;
            return "COLLECTING" !== e.phase && I(!1), (0, a.default)({
              phase: "DROP_PENDING"
            }, e, {
              phase: "DROP_PENDING",
              isWaiting: !0,
              reason: H
            })
          }
          if ("DROP_ANIMATE" === t.type) {
            var q = t.payload,
              V = q.completed,
              J = q.dropDuration,
              K = q.newHomeClientOffset;
            return "DRAGGING" !== e.phase && "DROP_PENDING" !== e.phase && I(!1), {
              phase: "DROP_ANIMATING",
              completed: V,
              dropDuration: J,
              newHomeClientOffset: K,
              dimensions: e.dimensions
            }
          }
          return "DROP_COMPLETE" === t.type ? {
            phase: "IDLE",
            completed: t.payload.completed,
            shouldFlush: !1
          } : e
        },
        Qe = function(e) {
          return {
            type: "LIFT",
            payload: e
          }
        },
        Ze = function(e) {
          return {
            type: "PUBLISH_WHILE_DRAGGING",
            payload: e
          }
        },
        et = function() {
          return {
            type: "COLLECTION_STARTING",
            payload: null
          }
        },
        tt = function(e) {
          return {
            type: "UPDATE_DROPPABLE_SCROLL",
            payload: e
          }
        },
        rt = function(e) {
          return {
            type: "UPDATE_DROPPABLE_IS_ENABLED",
            payload: e
          }
        },
        nt = function(e) {
          return {
            type: "UPDATE_DROPPABLE_IS_COMBINE_ENABLED",
            payload: e
          }
        },
        ot = function(e) {
          return {
            type: "MOVE",
            payload: e
          }
        },
        it = function() {
          return {
            type: "MOVE_UP",
            payload: null
          }
        },
        at = function() {
          return {
            type: "MOVE_DOWN",
            payload: null
          }
        },
        ut = function() {
          return {
            type: "MOVE_RIGHT",
            payload: null
          }
        },
        lt = function() {
          return {
            type: "MOVE_LEFT",
            payload: null
          }
        },
        ct = function() {
          return {
            type: "FLUSH",
            payload: null
          }
        },
        st = function(e) {
          return {
            type: "DROP_COMPLETE",
            payload: e
          }
        },
        dt = function(e) {
          return {
            type: "DROP",
            payload: e
          }
        },
        pt = "cubic-bezier(.2,1,.1,1)",
        ft = 0,
        gt = .7,
        vt = .75,
        mt = "0.2s cubic-bezier(0.2, 0, 0, 1)",
        bt = {
          fluid: "opacity " + mt,
          snap: "transform " + mt + ", opacity " + mt,
          drop: function(e) {
            var t = e + "s " + pt;
            return "transform " + t + ", opacity " + t
          },
          outOfTheWay: "transform " + mt,
          placeholder: "height " + mt + ", width " + mt + ", margin " + mt
        },
        ht = function(e) {
          return N(e, R) ? null : "translate(" + e.x + "px, " + e.y + "px)"
        },
        yt = ht,
        xt = function(e, t) {
          var r = ht(e);
          return r ? t ? r + " scale(" + vt + ")" : r : null
        },
        It = .33,
        Dt = function(e) {
          var t = e.getState,
            r = e.dispatch;
          return function(e) {
            return function(n) {
              if ("DROP" === n.type) {
                var o = t(),
                  i = n.payload.reason;
                if ("COLLECTING" !== o.phase) {
                  if ("IDLE" !== o.phase) {
                    "DROP_PENDING" === o.phase && o.isWaiting && I(!1), "DRAGGING" !== o.phase && "DROP_PENDING" !== o.phase && I(!1);
                    var u = o.critical,
                      l = o.dimensions,
                      c = l.draggables[o.critical.draggable.id],
                      s = function(e) {
                        var t = e.draggables,
                          r = e.reason,
                          n = e.lastImpact,
                          o = e.home,
                          i = e.viewport,
                          u = e.onLiftImpact;
                        return n.at && "DROP" === r ? "REORDER" === n.at.type ? {
                          impact: n,
                          didDropInsideDroppable: !0
                        } : {
                          impact: (0, a.default)({}, n, {
                            displaced: re
                          }),
                          didDropInsideDroppable: !0
                        } : {
                          impact: He({
                            draggables: t,
                            impact: u,
                            destination: o,
                            viewport: i,
                            forceShouldAnimate: !0
                          }),
                          didDropInsideDroppable: !1
                        }
                      }({
                        reason: i,
                        lastImpact: o.impact,
                        afterCritical: o.afterCritical,
                        onLiftImpact: o.onLiftImpact,
                        home: o.dimensions.droppables[o.critical.droppable.id],
                        viewport: o.viewport,
                        draggables: o.dimensions.draggables
                      }),
                      d = s.impact,
                      p = s.didDropInsideDroppable,
                      f = p ? X(d) : null,
                      g = p ? Q(d) : null,
                      v = {
                        index: u.draggable.index,
                        droppableId: u.droppable.id
                      },
                      m = {
                        draggableId: c.descriptor.id,
                        type: c.descriptor.type,
                        source: v,
                        reason: i,
                        mode: o.movementMode,
                        destination: f,
                        combine: g
                      },
                      b = function(e) {
                        var t = e.impact,
                          r = e.draggable,
                          n = e.dimensions,
                          o = e.viewport,
                          i = e.afterCritical,
                          a = n.draggables,
                          u = n.droppables,
                          l = Te(t),
                          c = l ? u[l] : null,
                          s = u[r.descriptor.droppableId],
                          d = qe({
                            impact: t,
                            draggable: r,
                            draggables: a,
                            afterCritical: i,
                            droppable: c || s,
                            viewport: o
                          });
                        return A(d, r.client.borderBox.center)
                      }({
                        impact: d,
                        draggable: c,
                        dimensions: l,
                        viewport: o.viewport,
                        afterCritical: o.afterCritical
                      }),
                      h = {
                        critical: o.critical,
                        afterCritical: o.afterCritical,
                        result: m,
                        impact: d
                      };
                    if (!N(o.current.client.offset, b) || Boolean(m.combine)) {
                      var y = function(e) {
                        var t = e.reason,
                          r = T(e.current, e.destination);
                        if (r <= 0) return It;
                        if (r >= 1500) return .55;
                        var n = It + r / 1500 * .22000000000000003;
                        return Number(("CANCEL" === t ? .6 * n : n).toFixed(2))
                      }({
                        current: o.current.client.offset,
                        destination: b,
                        reason: i
                      });
                      r({
                        type: "DROP_ANIMATE",
                        payload: {
                          newHomeClientOffset: b,
                          dropDuration: y,
                          completed: h
                        }
                      })
                    } else r(st({
                      completed: h
                    }))
                  }
                } else r(function(e) {
                  return {
                    type: "DROP_PENDING",
                    payload: e
                  }
                }({
                  reason: i
                }))
              } else e(n)
            }
          }
        },
        wt = function() {
          return {
            x: window.pageXOffset,
            y: window.pageYOffset
          }
        };
      var Ct = function(e) {
          var t = function(e) {
            var t = e.onWindowScroll,
              r = (0, p.default)((function() {
                t(wt())
              })),
              n = function(e) {
                return {
                  eventName: "scroll",
                  options: {
                    passive: !0,
                    capture: !1
                  },
                  fn: function(t) {
                    t.target !== window && t.target !== window.document || e()
                  }
                }
              }(r),
              o = m;

            function i() {
              return o !== m
            }
            return {
              start: function() {
                i() && I(!1), o = b(window, [n])
              },
              stop: function() {
                i() || I(!1), r.cancel(), o(), o = m
              },
              isActive: i
            }
          }({
            onWindowScroll: function(t) {
              e.dispatch({
                type: "MOVE_BY_WINDOW_SCROLL",
                payload: {
                  newScroll: t
                }
              })
            }
          });
          return function(e) {
            return function(r) {
              t.isActive() || "INITIAL_PUBLISH" !== r.type || t.start(), t.isActive() && function(e) {
                return "DROP_COMPLETE" === e.type || "DROP_ANIMATE" === e.type || "FLUSH" === e.type
              }(r) && t.stop(), e(r)
            }
          }
        },
        Et = function(e, t) {
          t()
        },
        St = function(e, t) {
          return {
            draggableId: e.draggable.id,
            type: e.droppable.type,
            source: {
              droppableId: e.droppable.id,
              index: e.draggable.index
            },
            mode: t
          }
        },
        Pt = function(e, t, r, n) {
          if (e) {
            var o = function(e) {
              var t = !1,
                r = !1,
                n = setTimeout((function() {
                  r = !0
                })),
                o = function(o) {
                  t || r || (t = !0, e(o), clearTimeout(n))
                };
              return o.wasCalled = function() {
                return t
              }, o
            }(r);
            e(t, {
              announce: o
            }), o.wasCalled() || r(n(t))
          } else r(n(t))
        },
        Rt = function(e, t) {
          var r = function(e, t) {
            var r, n = (r = [], {
                add: function(e) {
                  var t = setTimeout((function() {
                      return function(e) {
                        var t = H(r, (function(t) {
                          return t.timerId === e
                        })); - 1 === t && I(!1), r.splice(t, 1)[0].callback()
                      }(t)
                    })),
                    n = {
                      timerId: t,
                      callback: e
                    };
                  r.push(n)
                },
                flush: function() {
                  if (r.length) {
                    var e = [].concat(r);
                    r.length = 0, e.forEach((function(e) {
                      clearTimeout(e.timerId), e.callback()
                    }))
                  }
                }
              }),
              o = null,
              i = function(r) {
                o || I(!1), o = null, Et(0, (function() {
                  return Pt(e().onDragEnd, r, t, P.onDragEnd)
                }))
              };
            return {
              beforeCapture: function(t, r) {
                o && I(!1), Et(0, (function() {
                  var n = e().onBeforeCapture;
                  n && n({
                    draggableId: t,
                    mode: r
                  })
                }))
              },
              beforeStart: function(t, r) {
                o && I(!1), Et(0, (function() {
                  var n = e().onBeforeDragStart;
                  n && n(St(t, r))
                }))
              },
              start: function(r, i) {
                o && I(!1);
                var a = St(r, i);
                o = {
                  mode: i,
                  lastCritical: r,
                  lastLocation: a.source,
                  lastCombine: null
                }, n.add((function() {
                  Et(0, (function() {
                    return Pt(e().onDragStart, a, t, P.onDragStart)
                  }))
                }))
              },
              update: function(r, i) {
                var u = X(i),
                  l = Q(i);
                o || I(!1);
                var c = ! function(e, t) {
                  if (e === t) return !0;
                  var r = e.draggable.id === t.draggable.id && e.draggable.droppableId === t.draggable.droppableId && e.draggable.type === t.draggable.type && e.draggable.index === t.draggable.index,
                    n = e.droppable.id === t.droppable.id && e.droppable.type === t.droppable.type;
                  return r && n
                }(r, o.lastCritical);
                c && (o.lastCritical = r);
                var s, d, p = (d = u, !(null == (s = o.lastLocation) && null == d || null != s && null != d && s.droppableId === d.droppableId && s.index === d.index));
                p && (o.lastLocation = u);
                var f = ! function(e, t) {
                  return null == e && null == t || null != e && null != t && e.draggableId === t.draggableId && e.droppableId === t.droppableId
                }(o.lastCombine, l);
                if (f && (o.lastCombine = l), c || p || f) {
                  var g = (0, a.default)({}, St(r, o.mode), {
                    combine: l,
                    destination: u
                  });
                  n.add((function() {
                    Et(0, (function() {
                      return Pt(e().onDragUpdate, g, t, P.onDragUpdate)
                    }))
                  }))
                }
              },
              flush: function() {
                o || I(!1), n.flush()
              },
              drop: i,
              abort: function() {
                if (o) {
                  var e = (0, a.default)({}, St(o.lastCritical, o.mode), {
                    combine: null,
                    destination: null,
                    reason: "CANCEL"
                  });
                  i(e)
                }
              }
            }
          }(e, t);
          return function(e) {
            return function(t) {
              return function(n) {
                if ("BEFORE_INITIAL_CAPTURE" !== n.type) {
                  if ("INITIAL_PUBLISH" === n.type) {
                    var o = n.payload.critical;
                    return r.beforeStart(o, n.payload.movementMode), t(n), void r.start(o, n.payload.movementMode)
                  }
                  if ("DROP_COMPLETE" === n.type) {
                    var i = n.payload.completed.result;
                    return r.flush(), t(n), void r.drop(i)
                  }
                  if (t(n), "FLUSH" !== n.type) {
                    var a = e.getState();
                    "DRAGGING" === a.phase && r.update(a.critical, a.impact)
                  } else r.abort()
                } else r.beforeCapture(n.payload.draggableId, n.payload.movementMode)
              }
            }
          }
        },
        Ot = function(e) {
          return function(t) {
            return function(r) {
              if ("DROP_ANIMATION_FINISHED" === r.type) {
                var n = e.getState();
                "DROP_ANIMATING" !== n.phase && I(!1), e.dispatch(st({
                  completed: n.completed
                }))
              } else t(r)
            }
          }
        },
        At = function(e) {
          var t = null,
            r = null;
          return function(n) {
            return function(o) {
              if ("FLUSH" !== o.type && "DROP_COMPLETE" !== o.type && "DROP_ANIMATION_FINISHED" !== o.type || (r && (cancelAnimationFrame(r), r = null), t && (t(), t = null)), n(o), "DROP_ANIMATE" === o.type) {
                var i = {
                  eventName: "scroll",
                  options: {
                    capture: !0,
                    passive: !1,
                    once: !0
                  },
                  fn: function() {
                    "DROP_ANIMATING" === e.getState().phase && e.dispatch({
                      type: "DROP_ANIMATION_FINISHED",
                      payload: null
                    })
                  }
                };
                r = requestAnimationFrame((function() {
                  r = null, t = b(window, [i])
                }))
              }
            }
          }
        },
        Nt = function(e) {
          return function(t) {
            return function(r) {
              if (t(r), "PUBLISH_WHILE_DRAGGING" === r.type) {
                var n = e.getState();
                "DROP_PENDING" === n.phase && (n.isWaiting || e.dispatch(dt({
                  reason: n.reason
                })))
              }
            }
          }
        },
        Bt = u.compose,
        Mt = function(e) {
          var t, r = e.dimensionMarshal,
            n = e.focusMarshal,
            o = e.styleMarshal,
            i = e.getResponders,
            a = e.announce,
            l = e.autoScroller;
          return (0, u.createStore)(Xe, Bt((0, u.applyMiddleware)((t = o, function() {
            return function(e) {
              return function(r) {
                "INITIAL_PUBLISH" === r.type && t.dragging(), "DROP_ANIMATE" === r.type && t.dropping(r.payload.completed.result.reason), "FLUSH" !== r.type && "DROP_COMPLETE" !== r.type || t.resting(), e(r)
              }
            }
          }), function(e) {
            return function() {
              return function(t) {
                return function(r) {
                  "DROP_COMPLETE" !== r.type && "FLUSH" !== r.type && "DROP_ANIMATE" !== r.type || e.stopPublishing(), t(r)
                }
              }
            }
          }(r), function(e) {
            return function(t) {
              var r = t.getState,
                n = t.dispatch;
              return function(t) {
                return function(o) {
                  if ("LIFT" === o.type) {
                    var i = o.payload,
                      a = i.id,
                      u = i.clientSelection,
                      l = i.movementMode,
                      c = r();
                    "DROP_ANIMATING" === c.phase && n(st({
                      completed: c.completed
                    })), "IDLE" !== r().phase && I(!1), n(ct()), n({
                      type: "BEFORE_INITIAL_CAPTURE",
                      payload: {
                        draggableId: a,
                        movementMode: l
                      }
                    });
                    var s = {
                        draggableId: a,
                        scrollOptions: {
                          shouldPublishImmediately: "SNAP" === l
                        }
                      },
                      d = e.startPublishing(s),
                      p = d.critical,
                      f = d.dimensions,
                      g = d.viewport;
                    n({
                      type: "INITIAL_PUBLISH",
                      payload: {
                        critical: p,
                        dimensions: f,
                        clientSelection: u,
                        movementMode: l,
                        viewport: g
                      }
                    })
                  } else t(o)
                }
              }
            }
          }(r), Dt, Ot, At, Nt, function(e) {
            return function(t) {
              return function(r) {
                return function(n) {
                  if (function(e) {
                      return "DROP_COMPLETE" === e.type || "DROP_ANIMATE" === e.type || "FLUSH" === e.type
                    }(n)) return e.stop(), void r(n);
                  if ("INITIAL_PUBLISH" === n.type) {
                    r(n);
                    var o = t.getState();
                    return "DRAGGING" !== o.phase && I(!1), void e.start(o)
                  }
                  r(n), e.scroll(t.getState())
                }
              }
            }
          }(l), Ct, function(e) {
            var t = !1;
            return function() {
              return function(r) {
                return function(n) {
                  if ("INITIAL_PUBLISH" === n.type) return t = !0, e.tryRecordFocus(n.payload.critical.draggable.id), r(n), void e.tryRestoreFocusRecorded();
                  if (r(n), t) {
                    if ("FLUSH" === n.type) return t = !1, void e.tryRestoreFocusRecorded();
                    if ("DROP_COMPLETE" === n.type) {
                      t = !1;
                      var o = n.payload.completed.result;
                      o.combine && e.tryShiftRecord(o.draggableId, o.combine.draggableId), e.tryRestoreFocusRecorded()
                    }
                  }
                }
              }
            }
          }(n), Rt(i, a))))
        },
        Tt = function(e) {
          var t = e.scrollHeight,
            r = e.scrollWidth,
            n = e.height,
            o = e.width,
            i = A({
              x: r,
              y: t
            }, {
              x: o,
              y: n
            });
          return {
            x: Math.max(0, i.x),
            y: Math.max(0, i.y)
          }
        },
        Lt = function() {
          var e = document.documentElement;
          return e || I(!1), e
        },
        Gt = function() {
          var e = Lt();
          return Tt({
            scrollHeight: e.scrollHeight,
            scrollWidth: e.scrollWidth,
            width: e.clientWidth,
            height: e.clientHeight
          })
        };

      function kt(e, t, r) {
        return r.descriptor.id !== t.id && r.descriptor.type === t.type && "virtual" === e.droppable.getById(r.descriptor.droppableId).descriptor.mode
      }
      var _t, Ft, Ut = function(e, t) {
          var r = null,
            n = function(e) {
              var t = e.registry,
                r = e.callbacks,
                n = {
                  additions: {},
                  removals: {},
                  modified: {}
                },
                o = null,
                i = function() {
                  o || (r.collectionStarting(), o = requestAnimationFrame((function() {
                    o = null;
                    var e = n,
                      i = e.additions,
                      a = e.removals,
                      u = e.modified,
                      l = Object.keys(i).map((function(e) {
                        return t.draggable.getById(e).getDimension(R)
                      })).sort((function(e, t) {
                        return e.descriptor.index - t.descriptor.index
                      })),
                      c = Object.keys(u).map((function(e) {
                        return {
                          droppableId: e,
                          scroll: t.droppable.getById(e).callbacks.getScrollWhileDragging()
                        }
                      })),
                      s = {
                        additions: l,
                        removals: Object.keys(a),
                        modified: c
                      };
                    n = {
                      additions: {},
                      removals: {},
                      modified: {}
                    }, r.publish(s)
                  })))
                };
              return {
                add: function(e) {
                  var t = e.descriptor.id;
                  n.additions[t] = e, n.modified[e.descriptor.droppableId] = !0, n.removals[t] && delete n.removals[t], i()
                },
                remove: function(e) {
                  var t = e.descriptor;
                  n.removals[t.id] = !0, n.modified[t.droppableId] = !0, n.additions[t.id] && delete n.additions[t.id], i()
                },
                stop: function() {
                  o && (cancelAnimationFrame(o), o = null, n = {
                    additions: {},
                    removals: {},
                    modified: {}
                  })
                }
              }
            }({
              callbacks: {
                publish: t.publishWhileDragging,
                collectionStarting: t.collectionStarting
              },
              registry: e
            }),
            o = function(t) {
              r || I(!1);
              var o = r.critical.draggable;
              "ADDITION" === t.type && kt(e, o, t.value) && n.add(t.value), "REMOVAL" === t.type && kt(e, o, t.value) && n.remove(t.value)
            };
          return {
            updateDroppableIsEnabled: function(n, o) {
              e.droppable.exists(n) || I(!1), r && t.updateDroppableIsEnabled({
                id: n,
                isEnabled: o
              })
            },
            updateDroppableIsCombineEnabled: function(n, o) {
              r && (e.droppable.exists(n) || I(!1), t.updateDroppableIsCombineEnabled({
                id: n,
                isCombineEnabled: o
              }))
            },
            scrollDroppable: function(t, n) {
              r && e.droppable.getById(t).callbacks.scroll(n)
            },
            updateDroppableScroll: function(n, o) {
              r && (e.droppable.exists(n) || I(!1), t.updateDroppableScroll({
                id: n,
                newScroll: o
              }))
            },
            startPublishing: function(t) {
              r && I(!1);
              var n = e.draggable.getById(t.draggableId),
                i = e.droppable.getById(n.descriptor.droppableId),
                a = {
                  draggable: n.descriptor,
                  droppable: i.descriptor
                },
                u = e.subscribe(o);
              return r = {
                  critical: a,
                  unsubscribe: u
                },
                function(e) {
                  var t, r, n, o, i, a, u, l = e.critical,
                    c = e.scrollOptions,
                    d = e.registry,
                    p = (t = wt(), r = Gt(), n = t.y, o = t.x, i = Lt(), a = o + i.clientWidth, u = n + i.clientHeight, {
                      frame: (0, s.getRect)({
                        top: n,
                        left: o,
                        right: a,
                        bottom: u
                      }),
                      scroll: {
                        initial: t,
                        current: t,
                        max: r,
                        diff: {
                          value: R,
                          displacement: R
                        }
                      }
                    }),
                    f = p.scroll.current,
                    g = l.droppable,
                    v = d.droppable.getAllByType(g.type).map((function(e) {
                      return e.callbacks.getDimensionAndWatchScroll(f, c)
                    })),
                    m = d.draggable.getAllByType(l.draggable.type).map((function(e) {
                      return e.getDimension(f)
                    }));
                  return {
                    dimensions: {
                      draggables: $(m),
                      droppables: z(v)
                    },
                    critical: l,
                    viewport: p
                  }
                }({
                  critical: a,
                  registry: e,
                  scrollOptions: t.scrollOptions
                })
            },
            stopPublishing: function() {
              if (r) {
                n.stop();
                var t = r.critical.droppable;
                e.droppable.getAllByType(t.type).forEach((function(e) {
                  return e.callbacks.dragStopped()
                })), r.unsubscribe(), r = null
              }
            }
          }
        },
        Wt = function(e, t) {
          return "IDLE" === e.phase || "DROP_ANIMATING" === e.phase && e.completed.result.draggableId !== t && "DROP" === e.completed.result.reason
        },
        jt = function(e) {
          window.scrollBy(e.x, e.y)
        },
        Ht = (0, d.default)((function(e) {
          return Y(e).filter((function(e) {
            return !!e.isEnabled && !!e.frame
          }))
        })),
        qt = function(e) {
          return Math.pow(e, 2)
        },
        Vt = function(e) {
          var t = e.startOfRange,
            r = e.endOfRange,
            n = e.current,
            o = r - t;
          return 0 === o ? 0 : (n - t) / o
        },
        zt = 360,
        $t = 1200,
        Yt = function(e) {
          var t = e.distanceToEdge,
            r = e.thresholds,
            n = e.dragStartTime,
            o = e.shouldUseTimeDampening,
            i = function(e, t) {
              if (e > t.startScrollingFrom) return 0;
              if (e <= t.maxScrollValueAt) return 28;
              if (e === t.startScrollingFrom) return 1;
              var r = Vt({
                  startOfRange: t.maxScrollValueAt,
                  endOfRange: t.startScrollingFrom,
                  current: e
                }),
                n = 28 * qt(1 - r);
              return Math.ceil(n)
            }(t, r);
          return 0 === i ? 0 : o ? Math.max(function(e, t) {
            var r = t,
              n = $t,
              o = Date.now() - r;
            if (o >= $t) return e;
            if (o < zt) return 1;
            var i = Vt({
                startOfRange: zt,
                endOfRange: n,
                current: o
              }),
              a = e * qt(i);
            return Math.ceil(a)
          }(i, n), 1) : i
        },
        Jt = function(e) {
          var t = e.container,
            r = e.distanceToEdges,
            n = e.dragStartTime,
            o = e.axis,
            i = e.shouldUseTimeDampening,
            a = function(e, t) {
              return {
                startScrollingFrom: .25 * e[t.size],
                maxScrollValueAt: .05 * e[t.size]
              }
            }(t, o);
          return r[o.end] < r[o.start] ? Yt({
            distanceToEdge: r[o.end],
            thresholds: a,
            dragStartTime: n,
            shouldUseTimeDampening: i
          }) : -1 * Yt({
            distanceToEdge: r[o.start],
            thresholds: a,
            dragStartTime: n,
            shouldUseTimeDampening: i
          })
        },
        Kt = G((function(e) {
          return 0 === e ? 0 : e
        })),
        Xt = function(e) {
          var t = e.dragStartTime,
            r = e.container,
            n = e.subject,
            o = e.center,
            i = e.shouldUseTimeDampening,
            a = {
              top: o.y - r.top,
              right: r.right - o.x,
              bottom: r.bottom - o.y,
              left: o.x - r.left
            },
            u = Jt({
              container: r,
              distanceToEdges: a,
              dragStartTime: t,
              axis: ue,
              shouldUseTimeDampening: i
            }),
            l = Jt({
              container: r,
              distanceToEdges: a,
              dragStartTime: t,
              axis: le,
              shouldUseTimeDampening: i
            }),
            c = Kt({
              x: l,
              y: u
            });
          if (N(c, R)) return null;
          var s = function(e) {
            var t = e.container,
              r = e.subject,
              n = e.proposedScroll,
              o = r.height > t.height,
              i = r.width > t.width;
            return i || o ? i && o ? null : {
              x: i ? 0 : n.x,
              y: o ? 0 : n.y
            } : n
          }({
            container: r,
            subject: n,
            proposedScroll: c
          });
          return s ? N(s, R) ? null : s : null
        },
        Qt = G((function(e) {
          return 0 === e ? 0 : e > 0 ? 1 : -1
        })),
        Zt = (_t = function(e, t) {
          return e < 0 ? e : e > t ? e - t : 0
        }, function(e) {
          var t = e.current,
            r = e.max,
            n = e.change,
            o = O(t, n),
            i = {
              x: _t(o.x, r.x),
              y: _t(o.y, r.y)
            };
          return N(i, R) ? null : i
        }),
        er = function(e) {
          var t = e.max,
            r = e.current,
            n = e.change,
            o = {
              x: Math.max(r.x, t.x),
              y: Math.max(r.y, t.y)
            },
            i = Qt(n),
            a = Zt({
              max: o,
              current: r,
              change: i
            });
          return !a || 0 !== i.x && 0 === a.x || 0 !== i.y && 0 === a.y
        },
        tr = function(e, t) {
          return er({
            current: e.scroll.current,
            max: e.scroll.max,
            change: t
          })
        },
        rr = function(e, t) {
          var r = e.frame;
          return !!r && er({
            current: r.scroll.current,
            max: r.scroll.max,
            change: t
          })
        },
        nr = function(e) {
          var t = e.state,
            r = e.dragStartTime,
            n = e.shouldUseTimeDampening,
            o = e.scrollWindow,
            i = e.scrollDroppable,
            a = t.current.page.borderBoxCenter,
            u = t.dimensions.draggables[t.critical.draggable.id].page.marginBox;
          if (t.isWindowScrollAllowed) {
            var l = function(e) {
              var t = e.viewport,
                r = e.subject,
                n = e.center,
                o = e.shouldUseTimeDampening,
                i = Xt({
                  dragStartTime: e.dragStartTime,
                  container: t.frame,
                  subject: r,
                  center: n,
                  shouldUseTimeDampening: o
                });
              return i && tr(t, i) ? i : null
            }({
              dragStartTime: r,
              viewport: t.viewport,
              subject: u,
              center: a,
              shouldUseTimeDampening: n
            });
            if (l) return void o(l)
          }
          var c = function(e) {
            var t = e.center,
              r = e.destination,
              n = e.droppables;
            if (r) {
              var o = n[r];
              return o.frame ? o : null
            }
            var i = function(e, t) {
              var r = q(Ht(t), (function(t) {
                return t.frame || I(!1), ke(t.frame.pageMarginBox)(e)
              }));
              return r
            }(t, n);
            return i
          }({
            center: a,
            destination: Te(t.impact),
            droppables: t.dimensions.droppables
          });
          if (c) {
            var s = function(e) {
              var t = e.droppable,
                r = e.subject,
                n = e.center,
                o = e.dragStartTime,
                i = e.shouldUseTimeDampening,
                a = t.frame;
              if (!a) return null;
              var u = Xt({
                dragStartTime: o,
                container: a.pageMarginBox,
                subject: r,
                center: n,
                shouldUseTimeDampening: i
              });
              return u && rr(t, u) ? u : null
            }({
              dragStartTime: r,
              droppable: c,
              subject: u,
              center: a,
              shouldUseTimeDampening: n
            });
            s && i(c.descriptor.id, s)
          }
        },
        or = function(e) {
          var t = e.move,
            r = e.scrollDroppable,
            n = e.scrollWindow;
          return function(e) {
            var o = e.scrollJumpRequest;
            if (o) {
              var i = Te(e.impact);
              i || I(!1);
              var a = function(e, t) {
                if (!rr(e, t)) return t;
                var n = function(e, t) {
                  var r = e.frame;
                  return r && rr(e, t) ? Zt({
                    current: r.scroll.current,
                    max: r.scroll.max,
                    change: t
                  }) : null
                }(e, t);
                if (!n) return r(e.descriptor.id, t), null;
                var o = A(t, n);
                return r(e.descriptor.id, o), A(t, o)
              }(e.dimensions.droppables[i], o);
              if (a) {
                var u = e.viewport,
                  l = function(e, t, r) {
                    if (!e) return r;
                    if (!tr(t, r)) return r;
                    var o = function(e, t) {
                      if (!tr(e, t)) return null;
                      var r = e.scroll.max,
                        n = e.scroll.current;
                      return Zt({
                        current: n,
                        max: r,
                        change: t
                      })
                    }(t, r);
                    if (!o) return n(r), null;
                    var i = A(r, o);
                    return n(i), A(r, i)
                  }(e.isWindowScrollAllowed, u, a);
                l && function(e, r) {
                  var n = O(e.current.client.selection, r);
                  t({
                    client: n
                  })
                }(e, l)
              }
            }
          }
        },
        ir = function(e) {
          var t = e.scrollDroppable,
            r = e.scrollWindow,
            n = e.move,
            o = function(e) {
              var t = e.scrollWindow,
                r = e.scrollDroppable,
                n = (0, p.default)(t),
                o = (0, p.default)(r),
                i = null,
                a = function(e) {
                  i || I(!1);
                  var t = i,
                    r = t.shouldUseTimeDampening,
                    a = t.dragStartTime;
                  nr({
                    state: e,
                    scrollWindow: n,
                    scrollDroppable: o,
                    dragStartTime: a,
                    shouldUseTimeDampening: r
                  })
                };
              return {
                start: function(e) {
                  i && I(!1);
                  var t = Date.now(),
                    r = !1,
                    n = function() {
                      r = !0
                    };
                  nr({
                    state: e,
                    dragStartTime: 0,
                    shouldUseTimeDampening: !1,
                    scrollWindow: n,
                    scrollDroppable: n
                  }), i = {
                    dragStartTime: t,
                    shouldUseTimeDampening: r
                  }, r && a(e)
                },
                stop: function() {
                  i && (n.cancel(), o.cancel(), i = null)
                },
                scroll: a
              }
            }({
              scrollWindow: r,
              scrollDroppable: t
            }),
            i = or({
              move: n,
              scrollWindow: r,
              scrollDroppable: t
            });
          return {
            scroll: function(e) {
              "DRAGGING" === e.phase && ("FLUID" !== e.movementMode ? e.scrollJumpRequest && i(e) : o.scroll(e))
            },
            start: o.start,
            stop: o.stop
          }
        },
        ar = "data-rbd",
        ur = {
          base: Ft = ar + "-drag-handle",
          draggableId: Ft + "-draggable-id",
          contextId: Ft + "-context-id"
        },
        lr = function() {
          var e = ar + "-draggable";
          return {
            base: e,
            contextId: e + "-context-id",
            id: e + "-id"
          }
        }(),
        cr = function() {
          var e = ar + "-droppable";
          return {
            base: e,
            contextId: e + "-context-id",
            id: e + "-id"
          }
        }(),
        sr = {
          contextId: ar + "-scroll-container-context-id"
        },
        dr = function(e, t) {
          return e.map((function(e) {
            var r = e.styles[t];
            return r ? e.selector + " { " + r + " }" : ""
          })).join(" ")
        },
        pr = function(e) {
          var t, r, n, o = (t = e, function(e) {
              return "[" + e + '="' + t + '"]'
            }),
            i = (r = "\n      cursor: -webkit-grab;\n      cursor: grab;\n    ", {
              selector: o(ur.contextId),
              styles: {
                always: "\n          -webkit-touch-callout: none;\n          -webkit-tap-highlight-color: rgba(0,0,0,0);\n          touch-action: manipulation;\n        ",
                resting: r,
                dragging: "pointer-events: none;",
                dropAnimating: r
              }
            }),
            a = [(n = "\n      transition: " + bt.outOfTheWay + ";\n    ", {
              selector: o(lr.contextId),
              styles: {
                dragging: n,
                dropAnimating: n,
                userCancel: n
              }
            }), i, {
              selector: o(cr.contextId),
              styles: {
                always: "overflow-anchor: none;"
              }
            }, {
              selector: "body",
              styles: {
                dragging: "\n        cursor: grabbing;\n        cursor: -webkit-grabbing;\n        user-select: none;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        overflow-anchor: none;\n      "
              }
            }];
          return {
            always: dr(a, "always"),
            resting: dr(a, "resting"),
            dragging: dr(a, "dragging"),
            dropAnimating: dr(a, "dropAnimating"),
            userCancel: dr(a, "userCancel")
          }
        },
        fr = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? n.useLayoutEffect : n.useEffect,
        gr = function() {
          var e = document.querySelector("head");
          return e || I(!1), e
        },
        vr = function(e) {
          var t = document.createElement("style");
          return e && t.setAttribute("nonce", e), t.type = "text/css", t
        },
        mr = function(e) {
          return e && e.ownerDocument ? e.ownerDocument.defaultView : window
        };

      function br(e) {
        return e instanceof mr(e).HTMLElement
      }

      function hr() {
        var e = {
            draggables: {},
            droppables: {}
          },
          t = [];

        function r(e) {
          t.length && t.forEach((function(t) {
            return t(e)
          }))
        }

        function n(t) {
          return e.draggables[t] || null
        }

        function o(t) {
          return e.droppables[t] || null
        }
        return {
          draggable: {
            register: function(t) {
              e.draggables[t.descriptor.id] = t, r({
                type: "ADDITION",
                value: t
              })
            },
            update: function(t, r) {
              var n = e.draggables[r.descriptor.id];
              n && n.uniqueId === t.uniqueId && (delete e.draggables[r.descriptor.id], e.draggables[t.descriptor.id] = t)
            },
            unregister: function(t) {
              var o = t.descriptor.id,
                i = n(o);
              i && t.uniqueId === i.uniqueId && (delete e.draggables[o], r({
                type: "REMOVAL",
                value: t
              }))
            },
            getById: function(e) {
              var t = n(e);
              return t || I(!1), t
            },
            findById: n,
            exists: function(e) {
              return Boolean(n(e))
            },
            getAllByType: function(t) {
              return j(e.draggables).filter((function(e) {
                return e.descriptor.type === t
              }))
            }
          },
          droppable: {
            register: function(t) {
              e.droppables[t.descriptor.id] = t
            },
            unregister: function(t) {
              var r = o(t.descriptor.id);
              r && t.uniqueId === r.uniqueId && delete e.droppables[t.descriptor.id]
            },
            getById: function(e) {
              var t = o(e);
              return t || I(!1), t
            },
            findById: o,
            exists: function(e) {
              return Boolean(o(e))
            },
            getAllByType: function(t) {
              return j(e.droppables).filter((function(e) {
                return e.descriptor.type === t
              }))
            }
          },
          subscribe: function(e) {
            return t.push(e),
              function() {
                var r = t.indexOf(e); - 1 !== r && t.splice(r, 1)
              }
          },
          clean: function() {
            e.draggables = {}, e.droppables = {}, t.length = 0
          }
        }
      }
      var yr = o().createContext(null),
        xr = function() {
          var e = document.body;
          return e || I(!1), e
        },
        Ir = {
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          border: "0",
          padding: "0",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          "clip-path": "inset(100%)"
        },
        Dr = function(e) {
          return "rbd-announcement-" + e
        },
        wr = 0,
        Cr = {
          separator: "::"
        };

      function Er(e, t) {
        return void 0 === t && (t = Cr), (0, c.useMemo)((function() {
          return "" + e + t.separator + wr++
        }), [t.separator, e])
      }
      var Sr = o().createContext(null);

      function Pr(e) {
        var t = (0, n.useRef)(e);
        return (0, n.useEffect)((function() {
          t.current = e
        })), t
      }
      var Rr, Or, Ar = 27,
        Nr = 32,
        Br = 37,
        Mr = 38,
        Tr = 39,
        Lr = 40,
        Gr = ((Rr = {})[13] = !0, Rr[9] = !0, Rr),
        kr = function(e) {
          Gr[e.keyCode] && e.preventDefault()
        },
        _r = function() {
          var e = "visibilitychange";
          return "undefined" == typeof document ? e : q([e, "ms" + e, "webkit" + e, "moz" + e, "o" + e], (function(e) {
            return "on" + e in document
          })) || e
        }(),
        Fr = 0,
        Ur = 5,
        Wr = {
          type: "IDLE"
        };

      function jr(e) {
        var t = (0, n.useRef)(Wr),
          r = (0, n.useRef)(m),
          o = (0, c.useMemo)((function() {
            return {
              eventName: "mousedown",
              fn: function(t) {
                if (!t.defaultPrevented && t.button === Fr && !(t.ctrlKey || t.metaKey || t.shiftKey || t.altKey)) {
                  var n = e.findClosestDraggableId(t);
                  if (n) {
                    var o = e.tryGetLock(n, u, {
                      sourceEvent: t
                    });
                    if (o) {
                      t.preventDefault();
                      var i = {
                        x: t.clientX,
                        y: t.clientY
                      };
                      r.current(), d(o, i)
                    }
                  }
                }
              }
            }
          }), [e]),
          i = (0, c.useMemo)((function() {
            return {
              eventName: "webkitmouseforcewillbegin",
              fn: function(t) {
                if (!t.defaultPrevented) {
                  var r = e.findClosestDraggableId(t);
                  if (r) {
                    var n = e.findOptionsForDraggable(r);
                    n && (n.shouldRespectForcePress || e.canGetLock(r) && t.preventDefault())
                  }
                }
              }
            }
          }), [e]),
          a = (0, c.useCallback)((function() {
            r.current = b(window, [i, o], {
              passive: !1,
              capture: !0
            })
          }), [i, o]),
          u = (0, c.useCallback)((function() {
            "IDLE" !== t.current.type && (t.current = Wr, r.current(), a())
          }), [a]),
          l = (0, c.useCallback)((function() {
            var e = t.current;
            u(), "DRAGGING" === e.type && e.actions.cancel({
              shouldBlockNextClick: !0
            }), "PENDING" === e.type && e.actions.abort()
          }), [u]),
          s = (0, c.useCallback)((function() {
            var e = function(e) {
              var t = e.cancel,
                r = e.completed,
                n = e.getPhase,
                o = e.setPhase;
              return [{
                eventName: "mousemove",
                fn: function(e) {
                  var t = e.button,
                    r = e.clientX,
                    i = e.clientY;
                  if (t === Fr) {
                    var a = {
                        x: r,
                        y: i
                      },
                      u = n();
                    if ("DRAGGING" === u.type) return e.preventDefault(), void u.actions.move(a);
                    if ("PENDING" !== u.type && I(!1), l = u.point, c = a, Math.abs(c.x - l.x) >= Ur || Math.abs(c.y - l.y) >= Ur) {
                      var l, c;
                      e.preventDefault();
                      var s = u.actions.fluidLift(a);
                      o({
                        type: "DRAGGING",
                        actions: s
                      })
                    }
                  }
                }
              }, {
                eventName: "mouseup",
                fn: function(e) {
                  var o = n();
                  "DRAGGING" === o.type ? (e.preventDefault(), o.actions.drop({
                    shouldBlockNextClick: !0
                  }), r()) : t()
                }
              }, {
                eventName: "mousedown",
                fn: function(e) {
                  "DRAGGING" === n().type && e.preventDefault(), t()
                }
              }, {
                eventName: "keydown",
                fn: function(e) {
                  if ("PENDING" !== n().type) return e.keyCode === Ar ? (e.preventDefault(), void t()) : void kr(e);
                  t()
                }
              }, {
                eventName: "resize",
                fn: t
              }, {
                eventName: "scroll",
                options: {
                  passive: !0,
                  capture: !1
                },
                fn: function() {
                  "PENDING" === n().type && t()
                }
              }, {
                eventName: "webkitmouseforcedown",
                fn: function(e) {
                  var r = n();
                  "IDLE" === r.type && I(!1), r.actions.shouldRespectForcePress() ? t() : e.preventDefault()
                }
              }, {
                eventName: _r,
                fn: t
              }]
            }({
              cancel: l,
              completed: u,
              getPhase: function() {
                return t.current
              },
              setPhase: function(e) {
                t.current = e
              }
            });
            r.current = b(window, e, {
              capture: !0,
              passive: !1
            })
          }), [l, u]),
          d = (0, c.useCallback)((function(e, r) {
            "IDLE" !== t.current.type && I(!1), t.current = {
              type: "PENDING",
              point: r,
              actions: e
            }, s()
          }), [s]);
        fr((function() {
          return a(),
            function() {
              r.current()
            }
        }), [a])
      }

      function Hr() {}
      var qr = ((Or = {})[34] = !0, Or[33] = !0, Or[36] = !0, Or[35] = !0, Or);

      function Vr(e) {
        var t = (0, n.useRef)(Hr),
          r = (0, c.useMemo)((function() {
            return {
              eventName: "keydown",
              fn: function(r) {
                if (!r.defaultPrevented && r.keyCode === Nr) {
                  var n = e.findClosestDraggableId(r);
                  if (n) {
                    var i = e.tryGetLock(n, l, {
                      sourceEvent: r
                    });
                    if (i) {
                      r.preventDefault();
                      var a = !0,
                        u = i.snapLift();
                      t.current(), t.current = b(window, function(e, t) {
                        function r() {
                          t(), e.cancel()
                        }
                        return [{
                          eventName: "keydown",
                          fn: function(n) {
                            return n.keyCode === Ar ? (n.preventDefault(), void r()) : n.keyCode === Nr ? (n.preventDefault(), t(), void e.drop()) : n.keyCode === Lr ? (n.preventDefault(), void e.moveDown()) : n.keyCode === Mr ? (n.preventDefault(), void e.moveUp()) : n.keyCode === Tr ? (n.preventDefault(), void e.moveRight()) : n.keyCode === Br ? (n.preventDefault(), void e.moveLeft()) : void(qr[n.keyCode] ? n.preventDefault() : kr(n))
                          }
                        }, {
                          eventName: "mousedown",
                          fn: r
                        }, {
                          eventName: "mouseup",
                          fn: r
                        }, {
                          eventName: "click",
                          fn: r
                        }, {
                          eventName: "touchstart",
                          fn: r
                        }, {
                          eventName: "resize",
                          fn: r
                        }, {
                          eventName: "wheel",
                          fn: r,
                          options: {
                            passive: !0
                          }
                        }, {
                          eventName: _r,
                          fn: r
                        }]
                      }(u, l), {
                        capture: !0,
                        passive: !1
                      })
                    }
                  }
                }

                function l() {
                  a || I(!1), a = !1, t.current(), o()
                }
              }
            }
          }), [e]),
          o = (0, c.useCallback)((function() {
            t.current = b(window, [r], {
              passive: !1,
              capture: !0
            })
          }), [r]);
        fr((function() {
          return o(),
            function() {
              t.current()
            }
        }), [o])
      }
      var zr = {
          type: "IDLE"
        },
        $r = 120,
        Yr = .15;

      function Jr(e) {
        var t = (0, n.useRef)(zr),
          r = (0, n.useRef)(m),
          o = (0, c.useCallback)((function() {
            return t.current
          }), []),
          i = (0, c.useCallback)((function(e) {
            t.current = e
          }), []),
          a = (0, c.useMemo)((function() {
            return {
              eventName: "touchstart",
              fn: function(t) {
                if (!t.defaultPrevented) {
                  var n = e.findClosestDraggableId(t);
                  if (n) {
                    var o = e.tryGetLock(n, l, {
                      sourceEvent: t
                    });
                    if (o) {
                      var i = t.touches[0],
                        a = {
                          x: i.clientX,
                          y: i.clientY
                        };
                      r.current(), f(o, a)
                    }
                  }
                }
              }
            }
          }), [e]),
          u = (0, c.useCallback)((function() {
            r.current = b(window, [a], {
              capture: !0,
              passive: !1
            })
          }), [a]),
          l = (0, c.useCallback)((function() {
            var e = t.current;
            "IDLE" !== e.type && ("PENDING" === e.type && clearTimeout(e.longPressTimerId), i(zr), r.current(), u())
          }), [u, i]),
          s = (0, c.useCallback)((function() {
            var e = t.current;
            l(), "DRAGGING" === e.type && e.actions.cancel({
              shouldBlockNextClick: !0
            }), "PENDING" === e.type && e.actions.abort()
          }), [l]),
          d = (0, c.useCallback)((function() {
            var e = {
                capture: !0,
                passive: !1
              },
              t = {
                cancel: s,
                completed: l,
                getPhase: o
              },
              n = b(window, function(e) {
                var t = e.cancel,
                  r = e.completed,
                  n = e.getPhase;
                return [{
                  eventName: "touchmove",
                  options: {
                    capture: !1
                  },
                  fn: function(e) {
                    var r = n();
                    if ("DRAGGING" === r.type) {
                      r.hasMoved = !0;
                      var o = e.touches[0],
                        i = {
                          x: o.clientX,
                          y: o.clientY
                        };
                      e.preventDefault(), r.actions.move(i)
                    } else t()
                  }
                }, {
                  eventName: "touchend",
                  fn: function(e) {
                    var o = n();
                    "DRAGGING" === o.type ? (e.preventDefault(), o.actions.drop({
                      shouldBlockNextClick: !0
                    }), r()) : t()
                  }
                }, {
                  eventName: "touchcancel",
                  fn: function(e) {
                    "DRAGGING" === n().type ? (e.preventDefault(), t()) : t()
                  }
                }, {
                  eventName: "touchforcechange",
                  fn: function(e) {
                    var r = n();
                    "IDLE" === r.type && I(!1);
                    var o = e.touches[0];
                    if (o && o.force >= Yr) {
                      var i = r.actions.shouldRespectForcePress();
                      if ("PENDING" !== r.type) return i ? r.hasMoved ? void e.preventDefault() : void t() : void e.preventDefault();
                      i && t()
                    }
                  }
                }, {
                  eventName: _r,
                  fn: t
                }]
              }(t), e),
              i = b(window, function(e) {
                var t = e.cancel,
                  r = e.getPhase;
                return [{
                  eventName: "orientationchange",
                  fn: t
                }, {
                  eventName: "resize",
                  fn: t
                }, {
                  eventName: "contextmenu",
                  fn: function(e) {
                    e.preventDefault()
                  }
                }, {
                  eventName: "keydown",
                  fn: function(e) {
                    "DRAGGING" === r().type ? (e.keyCode === Ar && e.preventDefault(), t()) : t()
                  }
                }, {
                  eventName: _r,
                  fn: t
                }]
              }(t), e);
            r.current = function() {
              n(), i()
            }
          }), [s, o, l]),
          p = (0, c.useCallback)((function() {
            var e = o();
            "PENDING" !== e.type && I(!1);
            var t = e.actions.fluidLift(e.point);
            i({
              type: "DRAGGING",
              actions: t,
              hasMoved: !1
            })
          }), [o, i]),
          f = (0, c.useCallback)((function(e, t) {
            "IDLE" !== o().type && I(!1);
            var r = setTimeout(p, $r);
            i({
              type: "PENDING",
              point: t,
              actions: e,
              longPressTimerId: r
            }), d()
          }), [d, o, i, p]);
        fr((function() {
          return u(),
            function() {
              r.current();
              var e = o();
              "PENDING" === e.type && (clearTimeout(e.longPressTimerId), i(zr))
            }
        }), [o, u, i]), fr((function() {
          return b(window, [{
            eventName: "touchmove",
            fn: function() {},
            options: {
              capture: !1,
              passive: !1
            }
          }])
        }), [])
      }
      var Kr = {
        input: !0,
        button: !0,
        textarea: !0,
        select: !0,
        option: !0,
        optgroup: !0,
        video: !0,
        audio: !0
      };

      function Xr(e, t) {
        if (null == t) return !1;
        if (Boolean(Kr[t.tagName.toLowerCase()])) return !0;
        var r = t.getAttribute("contenteditable");
        return "true" === r || "" === r || t !== e && Xr(e, t.parentElement)
      }

      function Qr(e, t) {
        var r = t.target;
        return !!br(r) && Xr(e, r)
      }
      var Zr = function(e) {
          return (0, s.getRect)(e.getBoundingClientRect()).center
        },
        en = function() {
          var e = "matches";
          return "undefined" == typeof document ? e : q([e, "msMatchesSelector", "webkitMatchesSelector"], (function(e) {
            return e in Element.prototype
          })) || e
        }();

      function tn(e, t) {
        return null == e ? null : e[en](t) ? e : tn(e.parentElement, t)
      }

      function rn(e, t) {
        return e.closest ? e.closest(t) : tn(e, t)
      }

      function nn(e) {
        e.preventDefault()
      }

      function on(e) {
        var t = e.expected,
          r = e.phase,
          n = e.isLockActive;
        return e.shouldWarn, !!n() && t === r
      }

      function an(e) {
        var t = e.lockAPI,
          r = e.store,
          n = e.registry,
          o = e.draggableId;
        if (t.isClaimed()) return !1;
        var i = n.draggable.findById(o);
        return !!i && !!i.options.isEnabled && !!Wt(r.getState(), o)
      }
      var un = [jr, Vr, Jr];

      function ln(e) {
        var t = e.contextId,
          r = e.store,
          o = e.registry,
          i = e.customSensors,
          u = e.enableDefaultSensors,
          l = [].concat(u ? un : [], i || []),
          s = (0, n.useState)((function() {
            return function() {
              var e = null;

              function t() {
                e || I(!1), e = null
              }
              return {
                isClaimed: function() {
                  return Boolean(e)
                },
                isActive: function(t) {
                  return t === e
                },
                claim: function(t) {
                  e && I(!1);
                  var r = {
                    abandon: t
                  };
                  return e = r, r
                },
                release: t,
                tryAbandon: function() {
                  e && (e.abandon(), t())
                }
              }
            }()
          }))[0],
          d = (0, c.useCallback)((function(e, t) {
            e.isDragging && !t.isDragging && s.tryAbandon()
          }), [s]);
        fr((function() {
          var e = r.getState();
          return r.subscribe((function() {
            var t = r.getState();
            d(e, t), e = t
          }))
        }), [s, r, d]), fr((function() {
          return s.tryAbandon
        }), [s.tryAbandon]);
        for (var f = (0, c.useCallback)((function(e) {
            return an({
              lockAPI: s,
              registry: o,
              store: r,
              draggableId: e
            })
          }), [s, o, r]), g = (0, c.useCallback)((function(e, n, i) {
            return function(e) {
              var t = e.lockAPI,
                r = e.contextId,
                n = e.store,
                o = e.registry,
                i = e.draggableId,
                u = e.forceSensorStop,
                l = e.sourceEvent;
              if (!an({
                  lockAPI: t,
                  store: n,
                  registry: o,
                  draggableId: i
                })) return null;
              var c = o.draggable.getById(i),
                s = function(e, t) {
                  var r = "[" + lr.contextId + '="' + e + '"]',
                    n = q(V(document.querySelectorAll(r)), (function(e) {
                      return e.getAttribute(lr.id) === t
                    }));
                  return n && br(n) ? n : null
                }(r, c.descriptor.id);
              if (!s) return null;
              if (l && !c.options.canDragInteractiveElements && Qr(s, l)) return null;
              var d = t.claim(u || m),
                f = "PRE_DRAG";

              function g() {
                return c.options.shouldRespectForcePress
              }

              function v() {
                return t.isActive(d)
              }
              var h = function(e, t) {
                on({
                  expected: e,
                  phase: f,
                  isLockActive: v,
                  shouldWarn: !0
                }) && n.dispatch(t())
              }.bind(null, "DRAGGING");

              function y(e) {
                function r() {
                  t.release(), f = "COMPLETED"
                }

                function o(t, o) {
                  if (void 0 === o && (o = {
                      shouldBlockNextClick: !1
                    }), e.cleanup(), o.shouldBlockNextClick) {
                    var i = b(window, [{
                      eventName: "click",
                      fn: nn,
                      options: {
                        once: !0,
                        passive: !1,
                        capture: !0
                      }
                    }]);
                    setTimeout(i)
                  }
                  r(), n.dispatch(dt({
                    reason: t
                  }))
                }
                return "PRE_DRAG" !== f && (r(), "PRE_DRAG" !== f && I(!1)), n.dispatch(Qe(e.liftActionArgs)), f = "DRAGGING", (0, a.default)({
                  isActive: function() {
                    return on({
                      expected: "DRAGGING",
                      phase: f,
                      isLockActive: v,
                      shouldWarn: !1
                    })
                  },
                  shouldRespectForcePress: g,
                  drop: function(e) {
                    return o("DROP", e)
                  },
                  cancel: function(e) {
                    return o("CANCEL", e)
                  }
                }, e.actions)
              }
              return {
                isActive: function() {
                  return on({
                    expected: "PRE_DRAG",
                    phase: f,
                    isLockActive: v,
                    shouldWarn: !1
                  })
                },
                shouldRespectForcePress: g,
                fluidLift: function(e) {
                  var t = (0, p.default)((function(e) {
                      h((function() {
                        return ot({
                          client: e
                        })
                      }))
                    })),
                    r = y({
                      liftActionArgs: {
                        id: i,
                        clientSelection: e,
                        movementMode: "FLUID"
                      },
                      cleanup: function() {
                        return t.cancel()
                      },
                      actions: {
                        move: t
                      }
                    });
                  return (0, a.default)({}, r, {
                    move: t
                  })
                },
                snapLift: function() {
                  var e = {
                    moveUp: function() {
                      return h(it)
                    },
                    moveRight: function() {
                      return h(ut)
                    },
                    moveDown: function() {
                      return h(at)
                    },
                    moveLeft: function() {
                      return h(lt)
                    }
                  };
                  return y({
                    liftActionArgs: {
                      id: i,
                      clientSelection: Zr(s),
                      movementMode: "SNAP"
                    },
                    cleanup: m,
                    actions: e
                  })
                },
                abort: function() {
                  on({
                    expected: "PRE_DRAG",
                    phase: f,
                    isLockActive: v,
                    shouldWarn: !0
                  }) && t.release()
                }
              }
            }({
              lockAPI: s,
              registry: o,
              contextId: t,
              store: r,
              draggableId: e,
              forceSensorStop: n,
              sourceEvent: i && i.sourceEvent ? i.sourceEvent : null
            })
          }), [t, s, o, r]), v = (0, c.useCallback)((function(e) {
            return function(e, t) {
              var r = function(e, t) {
                var r, n = t.target;
                if (!((r = n) instanceof mr(r).Element)) return null;
                var o = function(e) {
                    return "[" + ur.contextId + '="' + e + '"]'
                  }(e),
                  i = rn(n, o);
                return i && br(i) ? i : null
              }(e, t);
              return r ? r.getAttribute(ur.draggableId) : null
            }(t, e)
          }), [t]), h = (0, c.useCallback)((function(e) {
            var t = o.draggable.findById(e);
            return t ? t.options : null
          }), [o.draggable]), y = (0, c.useCallback)((function() {
            s.isClaimed() && (s.tryAbandon(), "IDLE" !== r.getState().phase && r.dispatch(ct()))
          }), [s, r]), x = (0, c.useCallback)(s.isClaimed, [s]), D = (0, c.useMemo)((function() {
            return {
              canGetLock: f,
              tryGetLock: g,
              findClosestDraggableId: v,
              findOptionsForDraggable: h,
              tryReleaseLock: y,
              isLockClaimed: x
            }
          }), [f, g, v, h, y, x]), w = 0; w < l.length; w++) l[w](D)
      }
      var cn = function(e) {
        return {
          onBeforeCapture: e.onBeforeCapture,
          onBeforeDragStart: e.onBeforeDragStart,
          onDragStart: e.onDragStart,
          onDragEnd: e.onDragEnd,
          onDragUpdate: e.onDragUpdate
        }
      };

      function sn(e) {
        return e.current || I(!1), e.current
      }

      function dn(e) {
        var t = e.contextId,
          r = e.setCallbacks,
          i = e.sensors,
          s = e.nonce,
          p = e.dragHandleUsageInstructions,
          f = (0, n.useRef)(null),
          g = Pr(e),
          v = (0, c.useCallback)((function() {
            return cn(g.current)
          }), [g]),
          m = function(e) {
            var t = (0, c.useMemo)((function() {
                return Dr(e)
              }), [e]),
              r = (0, n.useRef)(null);
            return (0, n.useEffect)((function() {
              var e = document.createElement("div");
              return r.current = e, e.id = t, e.setAttribute("aria-live", "assertive"), e.setAttribute("aria-atomic", "true"), (0, a.default)(e.style, Ir), xr().appendChild(e),
                function() {
                  setTimeout((function() {
                    var t = xr();
                    t.contains(e) && t.removeChild(e), e === r.current && (r.current = null)
                  }))
                }
            }), [t]), (0, c.useCallback)((function(e) {
              var t = r.current;
              t && (t.textContent = e)
            }), [])
          }(t),
          b = function(e) {
            var t = e.contextId,
              r = e.text,
              o = Er("hidden-text", {
                separator: "-"
              }),
              i = (0, c.useMemo)((function() {
                return "rbd-hidden-text-" + (e = {
                  contextId: t,
                  uniqueId: o
                }).contextId + "-" + e.uniqueId;
                var e
              }), [o, t]);
            return (0, n.useEffect)((function() {
              var e = document.createElement("div");
              return e.id = i, e.textContent = r, e.style.display = "none", xr().appendChild(e),
                function() {
                  var t = xr();
                  t.contains(e) && t.removeChild(e)
                }
            }), [i, r]), i
          }({
            contextId: t,
            text: p
          }),
          h = function(e, t) {
            var r = (0, c.useMemo)((function() {
                return pr(e)
              }), [e]),
              o = (0, n.useRef)(null),
              i = (0, n.useRef)(null),
              a = (0, c.useCallback)((0, d.default)((function(e) {
                var t = i.current;
                t || I(!1), t.textContent = e
              })), []),
              u = (0, c.useCallback)((function(e) {
                var t = o.current;
                t || I(!1), t.textContent = e
              }), []);
            fr((function() {
              (o.current || i.current) && I(!1);
              var n = vr(t),
                l = vr(t);
              return o.current = n, i.current = l, n.setAttribute(ar + "-always", e), l.setAttribute(ar + "-dynamic", e), gr().appendChild(n), gr().appendChild(l), u(r.always), a(r.resting),
                function() {
                  var e = function(e) {
                    var t = e.current;
                    t || I(!1), gr().removeChild(t), e.current = null
                  };
                  e(o), e(i)
                }
            }), [t, u, a, r.always, r.resting, e]);
            var l = (0, c.useCallback)((function() {
                return a(r.dragging)
              }), [a, r.dragging]),
              s = (0, c.useCallback)((function(e) {
                a("DROP" !== e ? r.userCancel : r.dropAnimating)
              }), [a, r.dropAnimating, r.userCancel]),
              p = (0, c.useCallback)((function() {
                i.current && a(r.resting)
              }), [a, r.resting]);
            return (0, c.useMemo)((function() {
              return {
                dragging: l,
                dropping: s,
                resting: p
              }
            }), [l, s, p])
          }(t, s),
          y = (0, c.useCallback)((function(e) {
            sn(f).dispatch(e)
          }), []),
          x = (0, c.useMemo)((function() {
            return (0, u.bindActionCreators)({
              publishWhileDragging: Ze,
              updateDroppableScroll: tt,
              updateDroppableIsEnabled: rt,
              updateDroppableIsCombineEnabled: nt,
              collectionStarting: et
            }, y)
          }), [y]),
          D = function() {
            var e = (0, c.useMemo)(hr, []);
            return (0, n.useEffect)((function() {
              return function() {
                requestAnimationFrame(e.clean)
              }
            }), [e]), e
          }(),
          w = (0, c.useMemo)((function() {
            return Ut(D, x)
          }), [D, x]),
          C = (0, c.useMemo)((function() {
            return ir((0, a.default)({
              scrollWindow: jt,
              scrollDroppable: w.scrollDroppable
            }, (0, u.bindActionCreators)({
              move: ot
            }, y)))
          }), [w.scrollDroppable, y]),
          E = function(e) {
            var t = (0, n.useRef)({}),
              r = (0, n.useRef)(null),
              o = (0, n.useRef)(null),
              i = (0, n.useRef)(!1),
              a = (0, c.useCallback)((function(e, r) {
                var n = {
                  id: e,
                  focus: r
                };
                return t.current[e] = n,
                  function() {
                    var r = t.current;
                    r[e] !== n && delete r[e]
                  }
              }), []),
              u = (0, c.useCallback)((function(t) {
                var r = function(e, t) {
                  var r = "[" + ur.contextId + '="' + e + '"]',
                    n = V(document.querySelectorAll(r));
                  if (!n.length) return null;
                  var o = q(n, (function(e) {
                    return e.getAttribute(ur.draggableId) === t
                  }));
                  return o && br(o) ? o : null
                }(e, t);
                r && r !== document.activeElement && r.focus()
              }), [e]),
              l = (0, c.useCallback)((function(e, t) {
                r.current === e && (r.current = t)
              }), []),
              s = (0, c.useCallback)((function() {
                o.current || i.current && (o.current = requestAnimationFrame((function() {
                  o.current = null;
                  var e = r.current;
                  e && u(e)
                })))
              }), [u]),
              d = (0, c.useCallback)((function(e) {
                r.current = null;
                var t = document.activeElement;
                t && t.getAttribute(ur.draggableId) === e && (r.current = e)
              }), []);
            return fr((function() {
              return i.current = !0,
                function() {
                  i.current = !1;
                  var e = o.current;
                  e && cancelAnimationFrame(e)
                }
            }), []), (0, c.useMemo)((function() {
              return {
                register: a,
                tryRecordFocus: d,
                tryRestoreFocusRecorded: s,
                tryShiftRecord: l
              }
            }), [a, d, s, l])
          }(t),
          S = (0, c.useMemo)((function() {
            return Mt({
              announce: m,
              autoScroller: C,
              dimensionMarshal: w,
              focusMarshal: E,
              getResponders: v,
              styleMarshal: h
            })
          }), [m, C, w, E, v, h]);
        f.current = S;
        var P = (0, c.useCallback)((function() {
            var e = sn(f);
            "IDLE" !== e.getState().phase && e.dispatch(ct())
          }), []),
          R = (0, c.useCallback)((function() {
            var e = sn(f).getState();
            return e.isDragging || "DROP_ANIMATING" === e.phase
          }), []);
        r((0, c.useMemo)((function() {
          return {
            isDragging: R,
            tryAbort: P
          }
        }), [R, P]));
        var O = (0, c.useCallback)((function(e) {
            return Wt(sn(f).getState(), e)
          }), []),
          A = (0, c.useCallback)((function() {
            return Ge(sn(f).getState())
          }), []),
          N = (0, c.useMemo)((function() {
            return {
              marshal: w,
              focus: E,
              contextId: t,
              canLift: O,
              isMovementAllowed: A,
              dragHandleUsageInstructionsId: b,
              registry: D
            }
          }), [t, w, b, E, O, A, D]);
        return ln({
          contextId: t,
          store: S,
          registry: D,
          customSensors: i,
          enableDefaultSensors: !1 !== e.enableDefaultSensors
        }), (0, n.useEffect)((function() {
          return P
        }), [P]), o().createElement(Sr.Provider, {
          value: N
        }, o().createElement(l.Provider, {
          context: yr,
          store: S
        }, e.children))
      }
      var pn = 0;

      function fn() {
        pn = 0, wr = 0
      }

      function gn(e) {
        var t = (0, c.useMemo)((function() {
            return "" + pn++
          }), []),
          r = e.dragHandleUsageInstructions || P.dragHandleUsageInstructions;
        return o().createElement(D, null, (function(n) {
          return o().createElement(dn, {
            nonce: e.nonce,
            contextId: t,
            setCallbacks: n,
            dragHandleUsageInstructions: r,
            enableDefaultSensors: e.enableDefaultSensors,
            sensors: e.sensors,
            onBeforeCapture: e.onBeforeCapture,
            onBeforeDragStart: e.onBeforeDragStart,
            onDragStart: e.onDragStart,
            onDragUpdate: e.onDragUpdate,
            onDragEnd: e.onDragEnd
          }, e.children)
        }))
      }
      var vn = function(e) {
          return function(t) {
            return e === t
          }
        },
        mn = vn("scroll"),
        bn = vn("auto"),
        hn = (vn("visible"), function(e, t) {
          return t(e.overflowX) || t(e.overflowY)
        }),
        yn = function e(t) {
          return null == t || t === document.body || t === document.documentElement ? null : function(e) {
            var t = window.getComputedStyle(e),
              r = {
                overflowX: t.overflowX,
                overflowY: t.overflowY
              };
            return hn(r, mn) || hn(r, bn)
          }(t) ? t : e(t.parentElement)
        },
        xn = function(e) {
          return {
            x: e.scrollLeft,
            y: e.scrollTop
          }
        },
        In = function e(t) {
          return !!t && ("fixed" === window.getComputedStyle(t).position || e(t.parentElement))
        },
        Dn = {
          passive: !1
        },
        wn = {
          passive: !0
        },
        Cn = function(e) {
          return e.shouldPublishImmediately ? Dn : wn
        };

      function En(e) {
        var t = (0, n.useContext)(e);
        return t || I(!1), t
      }
      var Sn = function(e) {
        return e && e.env.closestScrollable || null
      };

      function Pn() {}
      var Rn = {
          width: 0,
          height: 0,
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        },
        On = o().memo((function(e) {
          var t = (0, n.useRef)(null),
            r = (0, c.useCallback)((function() {
              t.current && (clearTimeout(t.current), t.current = null)
            }), []),
            i = e.animate,
            a = e.onTransitionEnd,
            u = e.onClose,
            l = e.contextId,
            s = (0, n.useState)("open" === e.animate),
            d = s[0],
            p = s[1];
          (0, n.useEffect)((function() {
            return d ? "open" !== i ? (r(), p(!1), Pn) : t.current ? Pn : (t.current = setTimeout((function() {
              t.current = null, p(!1)
            })), r) : Pn
          }), [i, d, r]);
          var f = (0, c.useCallback)((function(e) {
              "height" === e.propertyName && (a(), "close" === i && u())
            }), [i, u, a]),
            g = function(e) {
              var t = e.isAnimatingOpenOnMount,
                r = e.placeholder,
                n = e.animate,
                o = function(e) {
                  var t = e.placeholder;
                  return e.isAnimatingOpenOnMount || "close" === e.animate ? Rn : {
                    height: t.client.borderBox.height,
                    width: t.client.borderBox.width,
                    margin: t.client.margin
                  }
                }({
                  isAnimatingOpenOnMount: t,
                  placeholder: r,
                  animate: n
                });
              return {
                display: r.display,
                boxSizing: "border-box",
                width: o.width,
                height: o.height,
                marginTop: o.margin.top,
                marginRight: o.margin.right,
                marginBottom: o.margin.bottom,
                marginLeft: o.margin.left,
                flexShrink: "0",
                flexGrow: "0",
                pointerEvents: "none",
                transition: "none" !== n ? bt.placeholder : null
              }
            }({
              isAnimatingOpenOnMount: d,
              animate: e.animate,
              placeholder: e.placeholder
            });
          return o().createElement(e.placeholder.tagName, {
            style: g,
            "data-rbd-placeholder-context-id": l,
            onTransitionEnd: f,
            ref: e.innerRef
          })
        })),
        An = o().createContext(null),
        Nn = function(e) {
          function t() {
            for (var t, r = arguments.length, n = new Array(r), o = 0; o < r; o++) n[o] = arguments[o];
            return (t = e.call.apply(e, [this].concat(n)) || this).state = {
              isVisible: Boolean(t.props.on),
              data: t.props.on,
              animate: t.props.shouldAnimate && t.props.on ? "open" : "none"
            }, t.onClose = function() {
              "close" === t.state.animate && t.setState({
                isVisible: !1
              })
            }, t
          }
          return (0, i.default)(t, e), t.getDerivedStateFromProps = function(e, t) {
            return e.shouldAnimate ? e.on ? {
              isVisible: !0,
              data: e.on,
              animate: "open"
            } : t.isVisible ? {
              isVisible: !0,
              data: t.data,
              animate: "close"
            } : {
              isVisible: !1,
              animate: "close",
              data: null
            } : {
              isVisible: Boolean(e.on),
              data: e.on,
              animate: "none"
            }
          }, t.prototype.render = function() {
            if (!this.state.isVisible) return null;
            var e = {
              onClose: this.onClose,
              data: this.state.data,
              animate: this.state.animate
            };
            return this.props.children(e)
          }, t
        }(o().PureComponent),
        Bn = 5e3,
        Mn = 4500,
        Tn = function(e, t) {
          return t ? bt.drop(t.duration) : e ? bt.snap : bt.fluid
        },
        Ln = function(e, t) {
          return e ? t ? ft : gt : null
        };

      function Gn(e) {
        e.preventDefault()
      }
      var kn = function(e, t) {
          return e === t
        },
        _n = function(e) {
          var t = e.combine,
            r = e.destination;
          return r ? r.droppableId : t ? t.droppableId : null
        };

      function Fn(e) {
        return {
          isDragging: !1,
          isDropAnimating: !1,
          isClone: !1,
          dropAnimation: null,
          mode: null,
          draggingOver: null,
          combineTargetFor: e,
          combineWith: null
        }
      }
      var Un = {
          mapped: {
            type: "SECONDARY",
            offset: R,
            combineTargetFor: null,
            shouldAnimateDisplacement: !0,
            snapshot: Fn(null)
          }
        },
        Wn = {
          dropAnimationFinished: function() {
            return {
              type: "DROP_ANIMATION_FINISHED",
              payload: null
            }
          }
        },
        jn = (0, l.connect)((function() {
          var e, t, r, n = (e = (0, d.default)((function(e, t) {
              return {
                x: e,
                y: t
              }
            })), t = (0, d.default)((function(e, t, r, n, o) {
              return {
                isDragging: !0,
                isClone: t,
                isDropAnimating: Boolean(o),
                dropAnimation: o,
                mode: e,
                draggingOver: r,
                combineWith: n,
                combineTargetFor: null
              }
            })), r = (0, d.default)((function(e, r, n, o, i, a, u) {
              return {
                mapped: {
                  type: "DRAGGING",
                  dropping: null,
                  draggingOver: i,
                  combineWith: a,
                  mode: r,
                  offset: e,
                  dimension: n,
                  forceShouldAnimate: u,
                  snapshot: t(r, o, i, a, null)
                }
              }
            })), function(n, o) {
              if (n.isDragging) {
                if (n.critical.draggable.id !== o.draggableId) return null;
                var i = n.current.client.offset,
                  a = n.dimensions.draggables[o.draggableId],
                  u = Te(n.impact),
                  l = (s = n.impact).at && "COMBINE" === s.at.type ? s.at.combine.draggableId : null,
                  c = n.forceShouldAnimate;
                return r(e(i.x, i.y), n.movementMode, a, o.isClone, u, l, c)
              }
              var s;
              if ("DROP_ANIMATING" === n.phase) {
                var d = n.completed;
                if (d.result.draggableId !== o.draggableId) return null;
                var p = o.isClone,
                  f = n.dimensions.draggables[o.draggableId],
                  g = d.result,
                  v = g.mode,
                  m = _n(g),
                  b = function(e) {
                    return e.combine ? e.combine.draggableId : null
                  }(g),
                  h = {
                    duration: n.dropDuration,
                    curve: pt,
                    moveTo: n.newHomeClientOffset,
                    opacity: b ? ft : null,
                    scale: b ? vt : null
                  };
                return {
                  mapped: {
                    type: "DRAGGING",
                    offset: n.newHomeClientOffset,
                    dimension: f,
                    dropping: h,
                    draggingOver: m,
                    combineWith: b,
                    mode: v,
                    forceShouldAnimate: null,
                    snapshot: t(v, p, m, b, h)
                  }
                }
              }
              return null
            }),
            o = function() {
              var e = (0, d.default)((function(e, t) {
                  return {
                    x: e,
                    y: t
                  }
                })),
                t = (0, d.default)(Fn),
                r = (0, d.default)((function(e, r, n) {
                  return void 0 === r && (r = null), {
                    mapped: {
                      type: "SECONDARY",
                      offset: e,
                      combineTargetFor: r,
                      shouldAnimateDisplacement: n,
                      snapshot: t(r)
                    }
                  }
                })),
                n = function(e) {
                  return e ? r(R, e, !0) : null
                },
                o = function(t, o, i, a) {
                  var u = i.displaced.visible[t],
                    l = Boolean(a.inVirtualList && a.effected[t]),
                    c = Q(i),
                    s = c && c.draggableId === t ? o : null;
                  if (!u) {
                    if (!l) return n(s);
                    if (i.displaced.invisible[t]) return null;
                    var d = B(a.displacedBy.point),
                      p = e(d.x, d.y);
                    return r(p, s, !0)
                  }
                  if (l) return n(s);
                  var f = i.displacedBy.point,
                    g = e(f.x, f.y);
                  return r(g, s, u.shouldAnimate)
                };
              return function(e, t) {
                if (e.isDragging) return e.critical.draggable.id === t.draggableId ? null : o(t.draggableId, e.critical.draggable.id, e.impact, e.afterCritical);
                if ("DROP_ANIMATING" === e.phase) {
                  var r = e.completed;
                  return r.result.draggableId === t.draggableId ? null : o(t.draggableId, r.result.draggableId, r.impact, r.afterCritical)
                }
                return null
              }
            }();
          return function(e, t) {
            return n(e, t) || o(e, t) || Un
          }
        }), Wn, null, {
          context: yr,
          pure: !0,
          areStatePropsEqual: kn
        })((function(e) {
          var t = (0, n.useRef)(null),
            r = (0, c.useCallback)((function(e) {
              t.current = e
            }), []),
            o = (0, c.useCallback)((function() {
              return t.current
            }), []),
            i = En(Sr),
            a = i.contextId,
            u = i.dragHandleUsageInstructionsId,
            l = i.registry,
            d = En(An),
            p = d.type,
            f = d.droppableId,
            g = (0, c.useMemo)((function() {
              return {
                id: e.draggableId,
                index: e.index,
                type: p,
                droppableId: f
              }
            }), [e.draggableId, e.index, p, f]),
            v = e.children,
            m = e.draggableId,
            b = e.isEnabled,
            h = e.shouldRespectForcePress,
            y = e.canDragInteractiveElements,
            x = e.isClone,
            D = e.mapped,
            w = e.dropAnimationFinished;
          x || function(e) {
            var t = Er("draggable"),
              r = e.descriptor,
              o = e.registry,
              i = e.getDraggableRef,
              a = e.canDragInteractiveElements,
              u = e.shouldRespectForcePress,
              l = e.isEnabled,
              d = (0, c.useMemo)((function() {
                return {
                  canDragInteractiveElements: a,
                  shouldRespectForcePress: u,
                  isEnabled: l
                }
              }), [a, l, u]),
              p = (0, c.useCallback)((function(e) {
                var t = i();
                return t || I(!1),
                  function(e, t, r) {
                    void 0 === r && (r = R);
                    var n = window.getComputedStyle(t),
                      o = t.getBoundingClientRect(),
                      i = (0, s.calculateBox)(o, n),
                      a = (0, s.withScroll)(i, r);
                    return {
                      descriptor: e,
                      placeholder: {
                        client: i,
                        tagName: t.tagName.toLowerCase(),
                        display: n.display
                      },
                      displaceBy: {
                        x: i.marginBox.width,
                        y: i.marginBox.height
                      },
                      client: i,
                      page: a
                    }
                  }(r, t, e)
              }), [r, i]),
              f = (0, c.useMemo)((function() {
                return {
                  uniqueId: t,
                  descriptor: r,
                  options: d,
                  getDimension: p
                }
              }), [r, p, d, t]),
              g = (0, n.useRef)(f),
              v = (0, n.useRef)(!0);
            fr((function() {
              return o.draggable.register(g.current),
                function() {
                  return o.draggable.unregister(g.current)
                }
            }), [o.draggable]), fr((function() {
              if (v.current) v.current = !1;
              else {
                var e = g.current;
                g.current = f, o.draggable.update(f, e)
              }
            }), [f, o.draggable])
          }((0, c.useMemo)((function() {
            return {
              descriptor: g,
              registry: l,
              getDraggableRef: o,
              canDragInteractiveElements: y,
              shouldRespectForcePress: h,
              isEnabled: b
            }
          }), [g, l, o, y, h, b]));
          var C = (0, c.useMemo)((function() {
              return b ? {
                tabIndex: 0,
                role: "button",
                "aria-describedby": u,
                "data-rbd-drag-handle-draggable-id": m,
                "data-rbd-drag-handle-context-id": a,
                draggable: !1,
                onDragStart: Gn
              } : null
            }), [a, u, m, b]),
            E = (0, c.useCallback)((function(e) {
              "DRAGGING" === D.type && D.dropping && "transform" === e.propertyName && w()
            }), [w, D]),
            S = (0, c.useMemo)((function() {
              var e = function(e) {
                  return "DRAGGING" === e.type ? (n = (r = e).dimension.client, o = r.offset, i = r.combineWith, a = r.dropping, u = Boolean(i), l = function(e) {
                    return null != e.forceShouldAnimate ? e.forceShouldAnimate : "SNAP" === e.mode
                  }(r), s = (c = Boolean(a)) ? xt(o, u) : yt(o), {
                    position: "fixed",
                    top: n.marginBox.top,
                    left: n.marginBox.left,
                    boxSizing: "border-box",
                    width: n.borderBox.width,
                    height: n.borderBox.height,
                    transition: Tn(l, a),
                    transform: s,
                    opacity: Ln(u, c),
                    zIndex: c ? Mn : Bn,
                    pointerEvents: "none"
                  }) : {
                    transform: yt((t = e).offset),
                    transition: t.shouldAnimateDisplacement ? null : "none"
                  };
                  var t, r, n, o, i, a, u, l, c, s
                }(D),
                t = "DRAGGING" === D.type && D.dropping ? E : null;
              return {
                innerRef: r,
                draggableProps: {
                  "data-rbd-draggable-context-id": a,
                  "data-rbd-draggable-id": m,
                  style: e,
                  onTransitionEnd: t
                },
                dragHandleProps: C
              }
            }), [a, C, m, D, E, r]),
            P = (0, c.useMemo)((function() {
              return {
                draggableId: g.id,
                type: g.type,
                source: {
                  index: g.index,
                  droppableId: g.droppableId
                }
              }
            }), [g.droppableId, g.id, g.index, g.type]);
          return v(S, D.snapshot, P)
        }));

      function Hn(e) {
        return En(An).isUsingCloneFor !== e.draggableId || e.isClone ? o().createElement(jn, e) : null
      }

      function qn(e) {
        var t = "boolean" != typeof e.isDragDisabled || !e.isDragDisabled,
          r = Boolean(e.disableInteractiveElementBlocking),
          n = Boolean(e.shouldRespectForcePress);
        return o().createElement(Hn, (0, a.default)({}, e, {
          isClone: !1,
          isEnabled: t,
          canDragInteractiveElements: r,
          shouldRespectForcePress: n
        }))
      }
      var Vn = function(e, t) {
          return e === t.droppable.type
        },
        zn = function(e, t) {
          return t.draggables[e.draggable.id]
        },
        $n = {
          mode: "standard",
          type: "DEFAULT",
          direction: "vertical",
          isDropDisabled: !1,
          isCombineEnabled: !1,
          ignoreContainerClipping: !1,
          renderClone: null,
          getContainerForClone: function() {
            return document.body || I(!1), document.body
          }
        },
        Yn = (0, l.connect)((function() {
          var e = {
              placeholder: null,
              shouldAnimatePlaceholder: !0,
              snapshot: {
                isDraggingOver: !1,
                draggingOverWith: null,
                draggingFromThisWith: null,
                isUsingPlaceholder: !1
              },
              useClone: null
            },
            t = (0, a.default)({}, e, {
              shouldAnimatePlaceholder: !1
            }),
            r = (0, d.default)((function(e) {
              return {
                draggableId: e.id,
                type: e.type,
                source: {
                  index: e.index,
                  droppableId: e.droppableId
                }
              }
            })),
            n = (0, d.default)((function(n, o, i, a, u, l) {
              var c = u.descriptor.id;
              if (u.descriptor.droppableId === n) {
                var s = l ? {
                    render: l,
                    dragging: r(u.descriptor)
                  } : null,
                  d = {
                    isDraggingOver: i,
                    draggingOverWith: i ? c : null,
                    draggingFromThisWith: c,
                    isUsingPlaceholder: !0
                  };
                return {
                  placeholder: u.placeholder,
                  shouldAnimatePlaceholder: !1,
                  snapshot: d,
                  useClone: s
                }
              }
              if (!o) return t;
              if (!a) return e;
              var p = {
                isDraggingOver: i,
                draggingOverWith: c,
                draggingFromThisWith: null,
                isUsingPlaceholder: !0
              };
              return {
                placeholder: u.placeholder,
                shouldAnimatePlaceholder: !0,
                snapshot: p,
                useClone: null
              }
            }));
          return function(r, o) {
            var i = o.droppableId,
              a = o.type,
              u = !o.isDropDisabled,
              l = o.renderClone;
            if (r.isDragging) {
              var c = r.critical;
              if (!Vn(a, c)) return t;
              var s = zn(c, r.dimensions),
                d = Te(r.impact) === i;
              return n(i, u, d, d, s, l)
            }
            if ("DROP_ANIMATING" === r.phase) {
              var p = r.completed;
              if (!Vn(a, p.critical)) return t;
              var f = zn(p.critical, r.dimensions);
              return n(i, u, _n(p.result) === i, Te(p.impact) === i, f, l)
            }
            if ("IDLE" === r.phase && r.completed && !r.shouldFlush) {
              var g = r.completed;
              if (!Vn(a, g.critical)) return t;
              var v = Te(g.impact) === i,
                m = Boolean(g.impact.at && "COMBINE" === g.impact.at.type),
                b = g.critical.droppable.id === i;
              return v ? m ? e : t : b ? e : t
            }
            return t
          }
        }), {
          updateViewportMaxScroll: function(e) {
            return {
              type: "UPDATE_VIEWPORT_MAX_SCROLL",
              payload: e
            }
          }
        }, null, {
          context: yr,
          pure: !0,
          areStatePropsEqual: kn
        })((function(e) {
          var t = (0, n.useContext)(Sr);
          t || I(!1);
          var r = t.contextId,
            i = t.isMovementAllowed,
            a = (0, n.useRef)(null),
            u = (0, n.useRef)(null),
            l = e.children,
            f = e.droppableId,
            v = e.type,
            m = e.mode,
            b = e.direction,
            h = e.ignoreContainerClipping,
            y = e.isDropDisabled,
            x = e.isCombineEnabled,
            D = e.snapshot,
            w = e.useClone,
            C = e.updateViewportMaxScroll,
            E = e.getContainerForClone,
            S = (0, c.useCallback)((function() {
              return a.current
            }), []),
            P = (0, c.useCallback)((function(e) {
              a.current = e
            }), []),
            O = ((0, c.useCallback)((function() {
              return u.current
            }), []), (0, c.useCallback)((function(e) {
              u.current = e
            }), [])),
            A = (0, c.useCallback)((function() {
              i() && C({
                maxScroll: Gt()
              })
            }), [i, C]);
          ! function(e) {
            var t = (0, n.useRef)(null),
              r = En(Sr),
              o = Er("droppable"),
              i = r.registry,
              a = r.marshal,
              u = Pr(e),
              l = (0, c.useMemo)((function() {
                return {
                  id: e.droppableId,
                  type: e.type,
                  mode: e.mode
                }
              }), [e.droppableId, e.mode, e.type]),
              f = (0, n.useRef)(l),
              g = (0, c.useMemo)((function() {
                return (0, d.default)((function(e, r) {
                  t.current || I(!1);
                  var n = {
                    x: e,
                    y: r
                  };
                  a.updateDroppableScroll(l.id, n)
                }))
              }), [l.id, a]),
              v = (0, c.useCallback)((function() {
                var e = t.current;
                return e && e.env.closestScrollable ? xn(e.env.closestScrollable) : R
              }), []),
              m = (0, c.useCallback)((function() {
                var e = v();
                g(e.x, e.y)
              }), [v, g]),
              b = (0, c.useMemo)((function() {
                return (0, p.default)(m)
              }), [m]),
              h = (0, c.useCallback)((function() {
                var e = t.current,
                  r = Sn(e);
                e && r || I(!1), e.scrollOptions.shouldPublishImmediately ? m() : b()
              }), [b, m]),
              y = (0, c.useCallback)((function(e, n) {
                t.current && I(!1);
                var o = u.current,
                  i = o.getDroppableRef();
                i || I(!1);
                var a = function(e) {
                    return {
                      closestScrollable: yn(e),
                      isFixedOnPage: In(e)
                    }
                  }(i),
                  c = {
                    ref: i,
                    descriptor: l,
                    env: a,
                    scrollOptions: n
                  };
                t.current = c;
                var d = function(e) {
                    var t = e.ref,
                      r = e.descriptor,
                      n = e.env,
                      o = e.windowScroll,
                      i = e.direction,
                      a = e.isDropDisabled,
                      u = e.isCombineEnabled,
                      l = e.shouldClipSubject,
                      c = n.closestScrollable,
                      d = function(e, t) {
                        var r = (0, s.getBox)(e);
                        if (!t) return r;
                        if (e !== t) return r;
                        var n = r.paddingBox.top - t.scrollTop,
                          o = r.paddingBox.left - t.scrollLeft,
                          i = n + t.scrollHeight,
                          a = {
                            top: n,
                            right: o + t.scrollWidth,
                            bottom: i,
                            left: o
                          },
                          u = (0, s.expand)(a, r.border);
                        return (0, s.createBox)({
                          borderBox: u,
                          margin: r.margin,
                          border: r.border,
                          padding: r.padding
                        })
                      }(t, c),
                      p = (0, s.withScroll)(d, o),
                      f = function() {
                        if (!c) return null;
                        var e = (0, s.getBox)(c),
                          t = {
                            scrollHeight: c.scrollHeight,
                            scrollWidth: c.scrollWidth
                          };
                        return {
                          client: e,
                          page: (0, s.withScroll)(e, o),
                          scroll: xn(c),
                          scrollSize: t,
                          shouldClipSubject: l
                        }
                      }(),
                      g = function(e) {
                        var t = e.descriptor,
                          r = e.isEnabled,
                          n = e.isCombineEnabled,
                          o = e.isFixedOnPage,
                          i = e.direction,
                          a = e.client,
                          u = e.page,
                          l = e.closest,
                          c = function() {
                            if (!l) return null;
                            var e = l.scrollSize,
                              t = l.client,
                              r = Tt({
                                scrollHeight: e.scrollHeight,
                                scrollWidth: e.scrollWidth,
                                height: t.paddingBox.height,
                                width: t.paddingBox.width
                              });
                            return {
                              pageMarginBox: l.page.marginBox,
                              frameClient: t,
                              scrollSize: e,
                              shouldClipSubject: l.shouldClipSubject,
                              scroll: {
                                initial: l.scroll,
                                current: l.scroll,
                                max: r,
                                diff: {
                                  value: R,
                                  displacement: R
                                }
                              }
                            }
                          }(),
                          s = "vertical" === i ? ue : le;
                        return {
                          descriptor: t,
                          isCombineEnabled: n,
                          isFixedOnPage: o,
                          axis: s,
                          isEnabled: r,
                          client: a,
                          page: u,
                          frame: c,
                          subject: U({
                            page: u,
                            withPlaceholder: null,
                            axis: s,
                            frame: c
                          })
                        }
                      }({
                        descriptor: r,
                        isEnabled: !a,
                        isCombineEnabled: u,
                        isFixedOnPage: n.isFixedOnPage,
                        direction: i,
                        client: d,
                        page: p,
                        closest: f
                      });
                    return g
                  }({
                    ref: i,
                    descriptor: l,
                    env: a,
                    windowScroll: e,
                    direction: o.direction,
                    isDropDisabled: o.isDropDisabled,
                    isCombineEnabled: o.isCombineEnabled,
                    shouldClipSubject: !o.ignoreContainerClipping
                  }),
                  p = a.closestScrollable;
                return p && (p.setAttribute(sr.contextId, r.contextId), p.addEventListener("scroll", h, Cn(c.scrollOptions))), d
              }), [r.contextId, l, h, u]),
              x = (0, c.useCallback)((function() {
                var e = t.current,
                  r = Sn(e);
                return e && r || I(!1), xn(r)
              }), []),
              D = (0, c.useCallback)((function() {
                var e = t.current;
                e || I(!1);
                var r = Sn(e);
                t.current = null, r && (b.cancel(), r.removeAttribute(sr.contextId), r.removeEventListener("scroll", h, Cn(e.scrollOptions)))
              }), [h, b]),
              w = (0, c.useCallback)((function(e) {
                var r = t.current;
                r || I(!1);
                var n = Sn(r);
                n || I(!1), n.scrollTop += e.y, n.scrollLeft += e.x
              }), []),
              C = (0, c.useMemo)((function() {
                return {
                  getDimensionAndWatchScroll: y,
                  getScrollWhileDragging: x,
                  dragStopped: D,
                  scroll: w
                }
              }), [D, y, x, w]),
              E = (0, c.useMemo)((function() {
                return {
                  uniqueId: o,
                  descriptor: l,
                  callbacks: C
                }
              }), [C, l, o]);
            fr((function() {
              return f.current = E.descriptor, i.droppable.register(E),
                function() {
                  t.current && D(), i.droppable.unregister(E)
                }
            }), [C, l, D, E, a, i.droppable]), fr((function() {
              t.current && a.updateDroppableIsEnabled(f.current.id, !e.isDropDisabled)
            }), [e.isDropDisabled, a]), fr((function() {
              t.current && a.updateDroppableIsCombineEnabled(f.current.id, e.isCombineEnabled)
            }), [e.isCombineEnabled, a])
          }({
            droppableId: f,
            type: v,
            mode: m,
            direction: b,
            isDropDisabled: y,
            isCombineEnabled: x,
            ignoreContainerClipping: h,
            getDroppableRef: S
          });
          var N = o().createElement(Nn, {
              on: e.placeholder,
              shouldAnimate: e.shouldAnimatePlaceholder
            }, (function(e) {
              var t = e.onClose,
                n = e.data,
                i = e.animate;
              return o().createElement(On, {
                placeholder: n,
                onClose: t,
                innerRef: O,
                animate: i,
                contextId: r,
                onTransitionEnd: A
              })
            })),
            B = (0, c.useMemo)((function() {
              return {
                innerRef: P,
                placeholder: N,
                droppableProps: {
                  "data-rbd-droppable-id": f,
                  "data-rbd-droppable-context-id": r
                }
              }
            }), [r, f, N, P]),
            M = w ? w.dragging.draggableId : null,
            T = (0, c.useMemo)((function() {
              return {
                droppableId: f,
                type: v,
                isUsingCloneFor: M
              }
            }), [f, M, v]);
          return o().createElement(An.Provider, {
            value: T
          }, l(B, D), function() {
            if (!w) return null;
            var e = w.dragging,
              t = w.render,
              r = o().createElement(Hn, {
                draggableId: e.draggableId,
                index: e.source.index,
                isClone: !0,
                isEnabled: !0,
                shouldRespectForcePress: !1,
                canDragInteractiveElements: !0
              }, (function(r, n) {
                return t(r, n, e)
              }));
            return g().createPortal(r, E())
          }())
        }));
      Yn.defaultProps = $n
    },
    858702: (e, t) => {
      var r = "function" == typeof Symbol && Symbol.for,
        n = r ? Symbol.for("react.element") : 60103,
        o = r ? Symbol.for("react.portal") : 60106,
        i = r ? Symbol.for("react.fragment") : 60107,
        a = r ? Symbol.for("react.strict_mode") : 60108,
        u = r ? Symbol.for("react.profiler") : 60114,
        l = r ? Symbol.for("react.provider") : 60109,
        c = r ? Symbol.for("react.context") : 60110,
        s = r ? Symbol.for("react.async_mode") : 60111,
        d = r ? Symbol.for("react.concurrent_mode") : 60111,
        p = r ? Symbol.for("react.forward_ref") : 60112,
        f = r ? Symbol.for("react.suspense") : 60113,
        g = r ? Symbol.for("react.suspense_list") : 60120,
        v = r ? Symbol.for("react.memo") : 60115,
        m = r ? Symbol.for("react.lazy") : 60116,
        b = r ? Symbol.for("react.block") : 60121,
        h = r ? Symbol.for("react.fundamental") : 60117,
        y = r ? Symbol.for("react.responder") : 60118,
        x = r ? Symbol.for("react.scope") : 60119;

      function I(e) {
        if ("object" == typeof e && null !== e) {
          var t = e.$$typeof;
          switch (t) {
            case n:
              switch (e = e.type) {
                case s:
                case d:
                case i:
                case u:
                case a:
                case f:
                  return e;
                default:
                  switch (e = e && e.$$typeof) {
                    case c:
                    case p:
                    case m:
                    case v:
                    case l:
                      return e;
                    default:
                      return t
                  }
              }
            case o:
              return t
          }
        }
      }

      function D(e) {
        return I(e) === d
      }
      t.AsyncMode = s, t.ConcurrentMode = d, t.ContextConsumer = c, t.ContextProvider = l, t.Element = n, t.ForwardRef = p, t.Fragment = i, t.Lazy = m, t.Memo = v, t.Portal = o, t.Profiler = u, t.StrictMode = a, t.Suspense = f, t.isAsyncMode = function(e) {
        return D(e) || I(e) === s
      }, t.isConcurrentMode = D, t.isContextConsumer = function(e) {
        return I(e) === c
      }, t.isContextProvider = function(e) {
        return I(e) === l
      }, t.isElement = function(e) {
        return "object" == typeof e && null !== e && e.$$typeof === n
      }, t.isForwardRef = function(e) {
        return I(e) === p
      }, t.isFragment = function(e) {
        return I(e) === i
      }, t.isLazy = function(e) {
        return I(e) === m
      }, t.isMemo = function(e) {
        return I(e) === v
      }, t.isPortal = function(e) {
        return I(e) === o
      }, t.isProfiler = function(e) {
        return I(e) === u
      }, t.isStrictMode = function(e) {
        return I(e) === a
      }, t.isSuspense = function(e) {
        return I(e) === f
      }, t.isValidElementType = function(e) {
        return "string" == typeof e || "function" == typeof e || e === i || e === d || e === u || e === a || e === f || e === g || "object" == typeof e && null !== e && (e.$$typeof === m || e.$$typeof === v || e.$$typeof === l || e.$$typeof === c || e.$$typeof === p || e.$$typeof === h || e.$$typeof === y || e.$$typeof === x || e.$$typeof === b)
      }, t.typeOf = I
    },
    519185: (e, t, r) => {
      e.exports = r(858702)
    },
    15306: (e, t, r) => {
      r.r(t), r.d(t, {
        ReactReduxContext: () => o,
        default: () => i
      });
      var n = r(827378),
        o = r.n(n)().createContext(null);
      const i = o
    },
    853221: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => l
      });
      var n = r(827378),
        o = r.n(n),
        i = r(15306),
        a = r(883690),
        u = r(158846);
      const l = function(e) {
        var t = e.store,
          r = e.context,
          l = e.children,
          c = (0, n.useMemo)((function() {
            var e = (0, a.createSubscription)(t);
            return {
              store: t,
              subscription: e
            }
          }), [t]),
          s = (0, n.useMemo)((function() {
            return t.getState()
          }), [t]);
        (0, u.useIsomorphicLayoutEffect)((function() {
          var e = c.subscription;
          return e.onStateChange = e.notifyNestedSubs, e.trySubscribe(), s !== t.getState() && e.notifyNestedSubs(),
            function() {
              e.tryUnsubscribe(), e.onStateChange = null
            }
        }), [c, s]);
        var d = r || i.ReactReduxContext;
        return o().createElement(d.Provider, {
          value: c
        }, l)
      }
    },
    194569: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => D
      });
      var n = r(925773),
        o = r(630808),
        i = r(655839),
        a = r.n(i),
        u = r(827378),
        l = r.n(u),
        c = r(519185),
        s = r(883690),
        d = r(158846),
        p = r(15306),
        f = ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"],
        g = ["reactReduxForwardedRef"],
        v = [],
        m = [null, null];

      function b(e, t) {
        var r = e[1];
        return [t.payload, r + 1]
      }

      function h(e, t, r) {
        (0, d.useIsomorphicLayoutEffect)((function() {
          return e.apply(void 0, t)
        }), r)
      }

      function y(e, t, r, n, o, i, a) {
        e.current = n, t.current = o, r.current = !1, i.current && (i.current = null, a())
      }

      function x(e, t, r, n, o, i, a, u, l, c) {
        if (e) {
          var s = !1,
            d = null,
            p = function() {
              if (!s) {
                var e, r, p = t.getState();
                try {
                  e = n(p, o.current)
                } catch (e) {
                  r = e, d = e
                }
                r || (d = null), e === i.current ? a.current || l() : (i.current = e, u.current = e, a.current = !0, c({
                  type: "STORE_UPDATED",
                  payload: {
                    error: r
                  }
                }))
              }
            };
          return r.onStateChange = p, r.trySubscribe(), p(),
            function() {
              if (s = !0, r.tryUnsubscribe(), r.onStateChange = null, d) throw d
            }
        }
      }
      var I = function() {
        return [null, 0]
      };

      function D(e, t) {
        void 0 === t && (t = {});
        var r = t,
          i = r.getDisplayName,
          d = void 0 === i ? function(e) {
            return "ConnectAdvanced(" + e + ")"
          } : i,
          D = r.methodName,
          w = void 0 === D ? "connectAdvanced" : D,
          C = r.renderCountProp,
          E = void 0 === C ? void 0 : C,
          S = r.shouldHandleStateChanges,
          P = void 0 === S || S,
          R = r.storeKey,
          O = void 0 === R ? "store" : R,
          A = (r.withRef, r.forwardRef),
          N = void 0 !== A && A,
          B = r.context,
          M = void 0 === B ? p.ReactReduxContext : B,
          T = (0, o.default)(r, f),
          L = M;
        return function(t) {
          var r = t.displayName || t.name || "Component",
            i = d(r),
            p = (0, n.default)({}, T, {
              getDisplayName: d,
              methodName: w,
              renderCountProp: E,
              shouldHandleStateChanges: P,
              storeKey: O,
              displayName: i,
              wrappedComponentName: r,
              WrappedComponent: t
            }),
            f = T.pure,
            D = f ? u.useMemo : function(e) {
              return e()
            };

          function C(r) {
            var i = (0, u.useMemo)((function() {
                var e = r.reactReduxForwardedRef,
                  t = (0, o.default)(r, g);
                return [r.context, e, t]
              }), [r]),
              a = i[0],
              d = i[1],
              f = i[2],
              w = (0, u.useMemo)((function() {
                return a && a.Consumer && (0, c.isContextConsumer)(l().createElement(a.Consumer, null)) ? a : L
              }), [a, L]),
              C = (0, u.useContext)(w),
              E = Boolean(r.store) && Boolean(r.store.getState) && Boolean(r.store.dispatch);
            Boolean(C) && Boolean(C.store);
            var S = E ? r.store : C.store,
              R = (0, u.useMemo)((function() {
                return function(t) {
                  return e(t.dispatch, p)
                }(S)
              }), [S]),
              O = (0, u.useMemo)((function() {
                if (!P) return m;
                var e = (0, s.createSubscription)(S, E ? null : C.subscription),
                  t = e.notifyNestedSubs.bind(e);
                return [e, t]
              }), [S, E, C]),
              A = O[0],
              N = O[1],
              B = (0, u.useMemo)((function() {
                return E ? C : (0, n.default)({}, C, {
                  subscription: A
                })
              }), [E, C, A]),
              M = (0, u.useReducer)(b, v, I),
              T = M[0][0],
              G = M[1];
            if (T && T.error) throw T.error;
            var k = (0, u.useRef)(),
              _ = (0, u.useRef)(f),
              F = (0, u.useRef)(),
              U = (0, u.useRef)(!1),
              W = D((function() {
                return F.current && f === _.current ? F.current : R(S.getState(), f)
              }), [S, T, f]);
            h(y, [_, k, U, f, W, F, N]), h(x, [P, S, A, R, _, k, U, F, N, G], [S, A, R]);
            var j = (0, u.useMemo)((function() {
              return l().createElement(t, (0, n.default)({}, W, {
                ref: d
              }))
            }), [d, t, W]);
            return (0, u.useMemo)((function() {
              return P ? l().createElement(w.Provider, {
                value: B
              }, j) : j
            }), [w, j, B])
          }
          var S = f ? l().memo(C) : C;
          if (S.WrappedComponent = t, S.displayName = C.displayName = i, N) {
            var R = l().forwardRef((function(e, t) {
              return l().createElement(S, (0, n.default)({}, e, {
                reactReduxForwardedRef: t
              }))
            }));
            return R.displayName = i, R.WrappedComponent = t, a()(R, t)
          }
          return a()(S, t)
        }
      }
    },
    775046: (e, t, r) => {
      r.r(t), r.d(t, {
        createConnect: () => g,
        default: () => v
      });
      var n = r(925773),
        o = r(630808),
        i = r(194569),
        a = r(356305),
        u = r(160002),
        l = r(200879),
        c = r(772343),
        s = r(696684),
        d = ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"];

      function p(e, t, r) {
        for (var n = t.length - 1; n >= 0; n--) {
          var o = t[n](e);
          if (o) return o
        }
        return function(t, n) {
          throw new Error("Invalid value of type " + typeof e + " for " + r + " argument when connecting component " + n.wrappedComponentName + ".")
        }
      }

      function f(e, t) {
        return e === t
      }

      function g(e) {
        var t = void 0 === e ? {} : e,
          r = t.connectHOC,
          g = void 0 === r ? i.default : r,
          v = t.mapStateToPropsFactories,
          m = void 0 === v ? l.default : v,
          b = t.mapDispatchToPropsFactories,
          h = void 0 === b ? u.default : b,
          y = t.mergePropsFactories,
          x = void 0 === y ? c.default : y,
          I = t.selectorFactory,
          D = void 0 === I ? s.default : I;
        return function(e, t, r, i) {
          void 0 === i && (i = {});
          var u = i,
            l = u.pure,
            c = void 0 === l || l,
            s = u.areStatesEqual,
            v = void 0 === s ? f : s,
            b = u.areOwnPropsEqual,
            y = void 0 === b ? a.default : b,
            I = u.areStatePropsEqual,
            w = void 0 === I ? a.default : I,
            C = u.areMergedPropsEqual,
            E = void 0 === C ? a.default : C,
            S = (0, o.default)(u, d),
            P = p(e, m, "mapStateToProps"),
            R = p(t, h, "mapDispatchToProps"),
            O = p(r, x, "mergeProps");
          return g(D, (0, n.default)({
            methodName: "connect",
            getDisplayName: function(e) {
              return "Connect(" + e + ")"
            },
            shouldHandleStateChanges: Boolean(e),
            initMapStateToProps: P,
            initMapDispatchToProps: R,
            initMergeProps: O,
            pure: c,
            areStatesEqual: v,
            areOwnPropsEqual: y,
            areStatePropsEqual: w,
            areMergedPropsEqual: E
          }, S))
        }
      }
      const v = g()
    },
    160002: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => l,
        whenMapDispatchToPropsIsFunction: () => i,
        whenMapDispatchToPropsIsMissing: () => a,
        whenMapDispatchToPropsIsObject: () => u
      });
      var n = r(437031),
        o = r(829543);

      function i(e) {
        return "function" == typeof e ? (0, o.wrapMapToPropsFunc)(e, "mapDispatchToProps") : void 0
      }

      function a(e) {
        return e ? void 0 : (0, o.wrapMapToPropsConstant)((function(e) {
          return {
            dispatch: e
          }
        }))
      }

      function u(e) {
        return e && "object" == typeof e ? (0, o.wrapMapToPropsConstant)((function(t) {
          return (0, n.default)(e, t)
        })) : void 0
      }
      const l = [i, a, u]
    },
    200879: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => a,
        whenMapStateToPropsIsFunction: () => o,
        whenMapStateToPropsIsMissing: () => i
      });
      var n = r(829543);

      function o(e) {
        return "function" == typeof e ? (0, n.wrapMapToPropsFunc)(e, "mapStateToProps") : void 0
      }

      function i(e) {
        return e ? void 0 : (0, n.wrapMapToPropsConstant)((function() {
          return {}
        }))
      }
      const a = [o, i]
    },
    772343: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => l,
        defaultMergeProps: () => o,
        whenMergePropsIsFunction: () => a,
        whenMergePropsIsOmitted: () => u,
        wrapMergePropsFunc: () => i
      });
      var n = r(925773);

      function o(e, t, r) {
        return (0, n.default)({}, r, e, t)
      }

      function i(e) {
        return function(t, r) {
          r.displayName;
          var n, o = r.pure,
            i = r.areMergedPropsEqual,
            a = !1;
          return function(t, r, u) {
            var l = e(t, r, u);
            return a ? o && i(l, n) || (n = l) : (a = !0, n = l), n
          }
        }
      }

      function a(e) {
        return "function" == typeof e ? i(e) : void 0
      }

      function u(e) {
        return e ? void 0 : function() {
          return o
        }
      }
      const l = [a, u]
    },
    696684: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => u,
        impureFinalPropsSelectorFactory: () => i,
        pureFinalPropsSelectorFactory: () => a
      });
      var n = r(630808),
        o = ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"];

      function i(e, t, r, n) {
        return function(o, i) {
          return r(e(o, i), t(n, i), i)
        }
      }

      function a(e, t, r, n, o) {
        var i, a, u, l, c, s = o.areStatesEqual,
          d = o.areOwnPropsEqual,
          p = o.areStatePropsEqual,
          f = !1;
        return function(o, g) {
          return f ? function(o, f) {
            var g, v, m = !d(f, a),
              b = !s(o, i, f, a);
            return i = o, a = f, m && b ? (u = e(i, a), t.dependsOnOwnProps && (l = t(n, a)), c = r(u, l, a)) : m ? (e.dependsOnOwnProps && (u = e(i, a)), t.dependsOnOwnProps && (l = t(n, a)), c = r(u, l, a)) : b ? (g = e(i, a), v = !p(g, u), u = g, v && (c = r(u, l, a)), c) : c
          }(o, g) : (u = e(i = o, a = g), l = t(n, a), c = r(u, l, a), f = !0, c)
        }
      }

      function u(e, t) {
        var r = t.initMapStateToProps,
          u = t.initMapDispatchToProps,
          l = t.initMergeProps,
          c = (0, n.default)(t, o),
          s = r(e, c),
          d = u(e, c),
          p = l(e, c);
        return (c.pure ? a : i)(s, d, p, e, c)
      }
    },
    829543: (e, t, r) => {
      function n(e) {
        return function(t, r) {
          var n = e(t, r);

          function o() {
            return n
          }
          return o.dependsOnOwnProps = !1, o
        }
      }

      function o(e) {
        return null !== e.dependsOnOwnProps && void 0 !== e.dependsOnOwnProps ? Boolean(e.dependsOnOwnProps) : 1 !== e.length
      }

      function i(e, t) {
        return function(t, r) {
          r.displayName;
          var n = function(e, t) {
            return n.dependsOnOwnProps ? n.mapToProps(e, t) : n.mapToProps(e)
          };
          return n.dependsOnOwnProps = !0, n.mapToProps = function(t, r) {
            n.mapToProps = e, n.dependsOnOwnProps = o(e);
            var i = n(t, r);
            return "function" == typeof i && (n.mapToProps = i, n.dependsOnOwnProps = o(i), i = n(t, r)), i
          }, n
        }
      }
      r.r(t), r.d(t, {
        getDependsOnOwnProps: () => o,
        wrapMapToPropsConstant: () => n,
        wrapMapToPropsFunc: () => i
      })
    },
    471006: (e, t, r) => {
      r.r(t), r.d(t, {
        Provider: () => n.default,
        ReactReduxContext: () => i.ReactReduxContext,
        connect: () => a.default,
        connectAdvanced: () => o.default,
        createDispatchHook: () => u.createDispatchHook,
        createSelectorHook: () => l.createSelectorHook,
        createStoreHook: () => c.createStoreHook,
        shallowEqual: () => s.default,
        useDispatch: () => u.useDispatch,
        useSelector: () => l.useSelector,
        useStore: () => c.useStore
      });
      var n = r(853221),
        o = r(194569),
        i = r(15306),
        a = r(775046),
        u = r(977648),
        l = r(516969),
        c = r(980384),
        s = r(356305)
    },
    977648: (e, t, r) => {
      r.r(t), r.d(t, {
        createDispatchHook: () => i,
        useDispatch: () => a
      });
      var n = r(15306),
        o = r(980384);

      function i(e) {
        void 0 === e && (e = n.ReactReduxContext);
        var t = e === n.ReactReduxContext ? o.useStore : (0, o.createStoreHook)(e);
        return function() {
          return t().dispatch
        }
      }
      var a = i()
    },
    49480: (e, t, r) => {
      r.r(t), r.d(t, {
        useReduxContext: () => i
      });
      var n = r(827378),
        o = r(15306);

      function i() {
        return (0, n.useContext)(o.ReactReduxContext)
      }
    },
    516969: (e, t, r) => {
      r.r(t), r.d(t, {
        createSelectorHook: () => c,
        useSelector: () => s
      });
      var n = r(827378),
        o = r(49480),
        i = r(883690),
        a = r(158846),
        u = r(15306),
        l = function(e, t) {
          return e === t
        };

      function c(e) {
        void 0 === e && (e = u.ReactReduxContext);
        var t = e === u.ReactReduxContext ? o.useReduxContext : function() {
          return (0, n.useContext)(e)
        };
        return function(e, r) {
          void 0 === r && (r = l);
          var o = t(),
            u = function(e, t, r, o) {
              var u, l = (0, n.useReducer)((function(e) {
                  return e + 1
                }), 0)[1],
                c = (0, n.useMemo)((function() {
                  return (0, i.createSubscription)(r, o)
                }), [r, o]),
                s = (0, n.useRef)(),
                d = (0, n.useRef)(),
                p = (0, n.useRef)(),
                f = (0, n.useRef)(),
                g = r.getState();
              try {
                if (e !== d.current || g !== p.current || s.current) {
                  var v = e(g);
                  u = void 0 !== f.current && t(v, f.current) ? f.current : v
                } else u = f.current
              } catch (e) {
                throw s.current && (e.message += "\nThe error may be correlated with this previous error:\n" + s.current.stack + "\n\n"), e
              }
              return (0, a.useIsomorphicLayoutEffect)((function() {
                d.current = e, p.current = g, f.current = u, s.current = void 0
              })), (0, a.useIsomorphicLayoutEffect)((function() {
                function e() {
                  try {
                    var e = r.getState();
                    if (e === p.current) return;
                    var n = d.current(e);
                    if (t(n, f.current)) return;
                    f.current = n, p.current = e
                  } catch (e) {
                    s.current = e
                  }
                  l()
                }
                return c.onStateChange = e, c.trySubscribe(), e(),
                  function() {
                    return c.tryUnsubscribe()
                  }
              }), [r, c]), u
            }(e, r, o.store, o.subscription);
          return (0, n.useDebugValue)(u), u
        }
      }
      var s = c()
    },
    980384: (e, t, r) => {
      r.r(t), r.d(t, {
        createStoreHook: () => a,
        useStore: () => u
      });
      var n = r(827378),
        o = r(15306),
        i = r(49480);

      function a(e) {
        void 0 === e && (e = o.ReactReduxContext);
        var t = e === o.ReactReduxContext ? i.useReduxContext : function() {
          return (0, n.useContext)(e)
        };
        return function() {
          return t().store
        }
      }
      var u = a()
    },
    177897: (e, t, r) => {
      r.r(t), r.d(t, {
        batch: () => i.unstable_batchedUpdates
      });
      var n = r(471006),
        o = {};
      for (const e in n)["default", "batch"].indexOf(e) < 0 && (o[e] = () => n[e]);
      r.d(t, o);
      var i = r(767661);
      (0, r(686673).setBatch)(i.unstable_batchedUpdates)
    },
    883690: (e, t, r) => {
      r.r(t), r.d(t, {
        createSubscription: () => i
      });
      var n = r(686673),
        o = {
          notify: function() {},
          get: function() {
            return []
          }
        };

      function i(e, t) {
        var r, i = o;

        function a() {
          l.onStateChange && l.onStateChange()
        }

        function u() {
          var o, u, l;
          r || (r = t ? t.addNestedSub(a) : e.subscribe(a), o = (0, n.getBatch)(), u = null, l = null, i = {
            clear: function() {
              u = null, l = null
            },
            notify: function() {
              o((function() {
                for (var e = u; e;) e.callback(), e = e.next
              }))
            },
            get: function() {
              for (var e = [], t = u; t;) e.push(t), t = t.next;
              return e
            },
            subscribe: function(e) {
              var t = !0,
                r = l = {
                  callback: e,
                  next: null,
                  prev: l
                };
              return r.prev ? r.prev.next = r : u = r,
                function() {
                  t && null !== u && (t = !1, r.next ? r.next.prev = r.prev : l = r.prev, r.prev ? r.prev.next = r.next : u = r.next)
                }
            }
          })
        }
        var l = {
          addNestedSub: function(e) {
            return u(), i.subscribe(e)
          },
          notifyNestedSubs: function() {
            i.notify()
          },
          handleChangeWrapper: a,
          isSubscribed: function() {
            return Boolean(r)
          },
          trySubscribe: u,
          tryUnsubscribe: function() {
            r && (r(), r = void 0, i.clear(), i = o)
          },
          getListeners: function() {
            return i
          }
        };
        return l
      }
    },
    686673: (e, t, r) => {
      r.r(t), r.d(t, {
        getBatch: () => i,
        setBatch: () => o
      });
      var n = function(e) {
          e()
        },
        o = function(e) {
          return n = e
        },
        i = function() {
          return n
        }
    },
    437031: (e, t, r) => {
      function n(e, t) {
        var r = {},
          n = function(n) {
            var o = e[n];
            "function" == typeof o && (r[n] = function() {
              return t(o.apply(void 0, arguments))
            })
          };
        for (var o in e) n(o);
        return r
      }
      r.r(t), r.d(t, {
        default: () => n
      })
    },
    767661: (e, t, r) => {
      r.r(t), r.d(t, {
        unstable_batchedUpdates: () => n.unstable_batchedUpdates
      });
      var n = r(331542)
    },
    356305: (e, t, r) => {
      function n(e, t) {
        return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t
      }

      function o(e, t) {
        if (n(e, t)) return !0;
        if ("object" != typeof e || null === e || "object" != typeof t || null === t) return !1;
        var r = Object.keys(e),
          o = Object.keys(t);
        if (r.length !== o.length) return !1;
        for (var i = 0; i < r.length; i++)
          if (!Object.prototype.hasOwnProperty.call(t, r[i]) || !n(e[r[i]], t[r[i]])) return !1;
        return !0
      }
      r.r(t), r.d(t, {
        default: () => o
      })
    },
    158846: (e, t, r) => {
      r.r(t), r.d(t, {
        useIsomorphicLayoutEffect: () => o
      });
      var n = r(827378),
        o = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? n.useLayoutEffect : n.useEffect
    },
    645106: (e, t, r) => {
      r.r(t), r.d(t, {
        __DO_NOT_USE__ActionTypes: () => u,
        applyMiddleware: () => g,
        bindActionCreators: () => p,
        combineReducers: () => s,
        compose: () => f,
        createStore: () => l,
        legacy_createStore: () => c
      });
      var n = r(250189);

      function o(e) {
        return "Minified Redux error #" + e + "; visit https://redux.js.org/Errors?code=" + e + " for the full message or use the non-minified dev environment for full errors. "
      }
      var i = "function" == typeof Symbol && Symbol.observable || "@@observable",
        a = function() {
          return Math.random().toString(36).substring(7).split("").join(".")
        },
        u = {
          INIT: "@@redux/INIT" + a(),
          REPLACE: "@@redux/REPLACE" + a(),
          PROBE_UNKNOWN_ACTION: function() {
            return "@@redux/PROBE_UNKNOWN_ACTION" + a()
          }
        };

      function l(e, t, r) {
        var n;
        if ("function" == typeof t && "function" == typeof r || "function" == typeof r && "function" == typeof arguments[3]) throw new Error(o(0));
        if ("function" == typeof t && void 0 === r && (r = t, t = void 0), void 0 !== r) {
          if ("function" != typeof r) throw new Error(o(1));
          return r(l)(e, t)
        }
        if ("function" != typeof e) throw new Error(o(2));
        var a = e,
          c = t,
          s = [],
          d = s,
          p = !1;

        function f() {
          d === s && (d = s.slice())
        }

        function g() {
          if (p) throw new Error(o(3));
          return c
        }

        function v(e) {
          if ("function" != typeof e) throw new Error(o(4));
          if (p) throw new Error(o(5));
          var t = !0;
          return f(), d.push(e),
            function() {
              if (t) {
                if (p) throw new Error(o(6));
                t = !1, f();
                var r = d.indexOf(e);
                d.splice(r, 1), s = null
              }
            }
        }

        function m(e) {
          if (! function(e) {
              if ("object" != typeof e || null === e) return !1;
              for (var t = e; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
              return Object.getPrototypeOf(e) === t
            }(e)) throw new Error(o(7));
          if (void 0 === e.type) throw new Error(o(8));
          if (p) throw new Error(o(9));
          try {
            p = !0, c = a(c, e)
          } finally {
            p = !1
          }
          for (var t = s = d, r = 0; r < t.length; r++)(0, t[r])();
          return e
        }
        return m({
          type: u.INIT
        }), (n = {
          dispatch: m,
          subscribe: v,
          getState: g,
          replaceReducer: function(e) {
            if ("function" != typeof e) throw new Error(o(10));
            a = e, m({
              type: u.REPLACE
            })
          }
        })[i] = function() {
          var e, t = v;
          return (e = {
            subscribe: function(e) {
              if ("object" != typeof e || null === e) throw new Error(o(11));

              function r() {
                e.next && e.next(g())
              }
              return r(), {
                unsubscribe: t(r)
              }
            }
          })[i] = function() {
            return this
          }, e
        }, n
      }
      var c = l;

      function s(e) {
        for (var t = Object.keys(e), r = {}, n = 0; n < t.length; n++) {
          var i = t[n];
          "function" == typeof e[i] && (r[i] = e[i])
        }
        var a, l = Object.keys(r);
        try {
          ! function(e) {
            Object.keys(e).forEach((function(t) {
              var r = e[t];
              if (void 0 === r(void 0, {
                  type: u.INIT
                })) throw new Error(o(12));
              if (void 0 === r(void 0, {
                  type: u.PROBE_UNKNOWN_ACTION()
                })) throw new Error(o(13))
            }))
          }(r)
        } catch (e) {
          a = e
        }
        return function(e, t) {
          if (void 0 === e && (e = {}), a) throw a;
          for (var n = !1, i = {}, u = 0; u < l.length; u++) {
            var c = l[u],
              s = r[c],
              d = e[c],
              p = s(d, t);
            if (void 0 === p) throw t && t.type, new Error(o(14));
            i[c] = p, n = n || p !== d
          }
          return (n = n || l.length !== Object.keys(e).length) ? i : e
        }
      }

      function d(e, t) {
        return function() {
          return t(e.apply(this, arguments))
        }
      }

      function p(e, t) {
        if ("function" == typeof e) return d(e, t);
        if ("object" != typeof e || null === e) throw new Error(o(16));
        var r = {};
        for (var n in e) {
          var i = e[n];
          "function" == typeof i && (r[n] = d(i, t))
        }
        return r
      }

      function f() {
        for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        return 0 === t.length ? function(e) {
          return e
        } : 1 === t.length ? t[0] : t.reduce((function(e, t) {
          return function() {
            return e(t.apply(void 0, arguments))
          }
        }))
      }

      function g() {
        for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
        return function(e) {
          return function() {
            var r = e.apply(void 0, arguments),
              i = function() {
                throw new Error(o(15))
              },
              a = {
                getState: r.getState,
                dispatch: function() {
                  return i.apply(void 0, arguments)
                }
              },
              u = t.map((function(e) {
                return e(a)
              }));
            return i = f.apply(void 0, u)(r.dispatch), (0, n.default)((0, n.default)({}, r), {}, {
              dispatch: i
            })
          }
        }
      }
    },
    403495: (e, t, r) => {
      r.r(t), r.d(t, {
        useCallback: () => u,
        useCallbackOne: () => i,
        useMemo: () => a,
        useMemoOne: () => o
      });
      var n = r(827378);

      function o(e, t) {
        var r = (0, n.useState)((function() {
            return {
              inputs: t,
              result: e()
            }
          }))[0],
          o = (0, n.useRef)(!0),
          i = (0, n.useRef)(r),
          a = o.current || Boolean(t && i.current.inputs && function(e, t) {
            if (e.length !== t.length) return !1;
            for (var r = 0; r < e.length; r++)
              if (e[r] !== t[r]) return !1;
            return !0
          }(t, i.current.inputs)) ? i.current : {
            inputs: t,
            result: e()
          };
        return (0, n.useEffect)((function() {
          o.current = !1, i.current = a
        }), [a]), a.result
      }

      function i(e, t) {
        return o((function() {
          return e
        }), t)
      }
      var a = o,
        u = i
    },
    464649: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => o
      });
      var n = r(157543);

      function o(e, t, r) {
        return (t = (0, n.default)(t)) in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }
    },
    250189: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => i
      });
      var n = r(464649);

      function o(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t && (n = n.filter((function(t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable
          }))), r.push.apply(r, n)
        }
        return r
      }

      function i(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {};
          t % 2 ? o(Object(r), !0).forEach((function(t) {
            (0, n.default)(e, t, r[t])
          })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : o(Object(r)).forEach((function(t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
          }))
        }
        return e
      }
    },
    630808: (e, t, r) => {
      function n(e, t) {
        if (null == e) return {};
        var r, n, o = {},
          i = Object.keys(e);
        for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || (o[r] = e[r]);
        return o
      }
      r.r(t), r.d(t, {
        default: () => n
      })
    },
    494868: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => o
      });
      var n = r(733940);

      function o(e, t) {
        if ("object" !== (0, n.default)(e) || null === e) return e;
        var r = e[Symbol.toPrimitive];
        if (void 0 !== r) {
          var o = r.call(e, t || "default");
          if ("object" !== (0, n.default)(o)) return o;
          throw new TypeError("@@toPrimitive must return a primitive value.")
        }
        return ("string" === t ? String : Number)(e)
      }
    },
    157543: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => i
      });
      var n = r(733940),
        o = r(494868);

      function i(e) {
        var t = (0, o.default)(e, "string");
        return "symbol" === (0, n.default)(t) ? t : String(t)
      }
    },
    733940: (e, t, r) => {
      function n(e) {
        return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
          return typeof e
        } : function(e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }, n(e)
      }
      r.r(t), r.d(t, {
        default: () => n
      })
    },
    92215: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => i
      });
      var n = !0,
        o = "Invariant failed";

      function i(e, t) {
        if (!e) {
          if (n) throw new Error(o);
          var r = "function" == typeof t ? t() : t,
            i = r ? "".concat(o, ": ").concat(r) : o;
          throw new Error(i)
        }
      }
    }
  }
]);
var _global = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
_global.SENTRY_RELEASE = {
    id: "build_2025_10_27_13_57_15"
  },
  function() {
    try {
      var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
        t = (new Error).stack;
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "ecb35f64-313d-41e0-9bb3-249900e4f0bb", e._sentryDebugIdIdentifier = "sentry-dbid-ecb35f64-313d-41e0-9bb3-249900e4f0bb")
    } catch (e) {}
  }();
//# sourceMappingURL=3473.1c3292d4e4ce0c74a99d.js.map