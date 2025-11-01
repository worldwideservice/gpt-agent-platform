"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [92581], {
    681430: function(e, n, t) {
      var o = this && this.__assign || function() {
        return o = Object.assign || function(e) {
          for (var n, t = 1, o = arguments.length; t < o; t++)
            for (var l in n = arguments[t]) Object.prototype.hasOwnProperty.call(n, l) && (e[l] = n[l]);
          return e
        }, o.apply(this, arguments)
      };
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.ArrowContainer = void 0;
      var l = t(824246),
        r = t(827378),
        i = t(661985);
      n.ArrowContainer = function(e) {
        var n = e.childRect,
          t = e.popoverRect,
          a = e.position,
          u = e.arrowColor,
          s = e.arrowSize,
          c = e.arrowClassName,
          d = e.arrowStyle,
          p = e.className,
          f = e.children,
          h = e.style,
          m = (0, i.useArrowContainer)({
            childRect: n,
            popoverRect: t,
            position: a,
            arrowColor: u,
            arrowSize: s
          }),
          g = m.arrowContainerStyle,
          v = m.arrowStyle,
          b = (0, r.useMemo)((function() {
            return o(o({}, g), h)
          }), [g, h]),
          y = (0, r.useMemo)((function() {
            return o(o({}, v), d)
          }), [v, d]);
        return (0, l.jsxs)("div", {
          className: p,
          style: b,
          children: [(0, l.jsx)("div", {
            style: y,
            className: c
          }), f]
        })
      }
    },
    970013: function(e, n, t) {
      var o = this && this.__assign || function() {
        return o = Object.assign || function(e) {
          for (var n, t = 1, o = arguments.length; t < o; t++)
            for (var l in n = arguments[t]) Object.prototype.hasOwnProperty.call(n, l) && (e[l] = n[l]);
          return e
        }, o.apply(this, arguments)
      };
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.Popover = n.usePopover = n.ArrowContainer = n.useArrowContainer = void 0;
      var l = t(824246),
        r = t(827378),
        i = t(273192),
        a = t(503380),
        u = t(556063);
      Object.defineProperty(n, "usePopover", {
        enumerable: !0,
        get: function() {
          return u.usePopover
        }
      });
      var s = t(367255),
        c = t(867895),
        d = t(661985);
      Object.defineProperty(n, "useArrowContainer", {
        enumerable: !0,
        get: function() {
          return d.useArrowContainer
        }
      });
      var p = t(681430);
      Object.defineProperty(n, "ArrowContainer", {
        enumerable: !0,
        get: function() {
          return p.ArrowContainer
        }
      });
      var f = ["top", "left", "right", "bottom"],
        h = (0, r.forwardRef)((function(e, n) {
          var t = e.isOpen,
            o = e.children,
            d = e.content,
            p = e.positions,
            h = void 0 === p ? f : p,
            m = e.align,
            g = void 0 === m ? "center" : m,
            v = e.padding,
            b = void 0 === v ? 0 : v,
            y = e.reposition,
            k = void 0 === y || y,
            x = e.parentElement,
            w = void 0 === x ? window.document.body : x,
            S = e.boundaryElement,
            C = void 0 === S ? w : S,
            R = e.containerClassName,
            E = e.containerStyle,
            P = e.transform,
            T = e.transformMode,
            O = void 0 === T ? "absolute" : T,
            M = e.boundaryInset,
            L = void 0 === M ? 0 : M,
            I = e.onClickOutside,
            A = e.clickOutsideCapture,
            D = void 0 !== A && A,
            _ = (0, s.useMemoizedArray)(Array.isArray(h) ? h : [h]),
            z = (0, c.useHandlePrevValues)({
              positions: _,
              reposition: k,
              transformMode: O,
              transform: P,
              boundaryElement: C,
              boundaryInset: L
            }),
            F = z.prev,
            j = z.updatePrevValues,
            B = (0, r.useRef)(),
            U = (0, r.useState)({
              align: g,
              nudgedLeft: 0,
              nudgedTop: 0,
              position: _[0],
              padding: b,
              childRect: a.EMPTY_RECT,
              popoverRect: a.EMPTY_RECT,
              parentRect: a.EMPTY_RECT,
              boundaryRect: a.EMPTY_RECT,
              boundaryInset: L,
              violations: a.EMPTY_RECT,
              hasViolations: !1
            }),
            H = U[0],
            N = U[1],
            V = (0, r.useCallback)((function(e) {
              return N(e)
            }), []),
            q = (0, u.usePopover)({
              isOpen: t,
              childRef: B,
              containerClassName: R,
              parentElement: w,
              boundaryElement: C,
              transform: P,
              transformMode: O,
              positions: _,
              align: g,
              padding: b,
              boundaryInset: L,
              reposition: k,
              onPositionPopover: V
            }),
            Y = q.positionPopover,
            W = q.popoverRef,
            K = q.scoutRef;
          (0, r.useLayoutEffect)((function() {
            var e = !0,
              n = function() {
                var o, l;
                if (t && e) {
                  var r = null === (o = null == B ? void 0 : B.current) || void 0 === o ? void 0 : o.getBoundingClientRect(),
                    i = null === (l = null == W ? void 0 : W.current) || void 0 === l ? void 0 : l.getBoundingClientRect();
                  null == r || null == i || (0, a.rectsAreEqual)(r, H.childRect) && i.width === H.popoverRect.width && i.height === H.popoverRect.height && H.padding === b && H.align === g && _ === F.positions && k === F.reposition && O === F.transformMode && P === F.transform && C === F.boundaryElement && L === F.boundaryInset || Y(), j(), e && window.requestAnimationFrame(n)
                }
              };
            return n(),
              function() {
                e = !1
              }
          }), [g, C, L, t, b, W, H.align, H.childRect, H.padding, H.popoverRect.height, H.popoverRect.width, Y, _, F.boundaryElement, F.boundaryInset, F.positions, F.reposition, F.transform, F.transformMode, k, P, O, j]), (0, r.useEffect)((function() {
            var e = W.current;
            return Object.assign(e.style, E),
              function() {
                Object.keys(null != E ? E : {}).forEach((function(n) {
                  return delete e.style[n]
                }))
              }
          }), [E, t, W]);
          var X = (0, r.useCallback)((function(e) {
              var n, o;
              !t || (null === (n = W.current) || void 0 === n ? void 0 : n.contains(e.target)) || (null === (o = B.current) || void 0 === o ? void 0 : o.contains(e.target)) || null == I || I(e)
            }), [t, I, W]),
            $ = (0, r.useCallback)((function() {
              B.current && t && window.requestAnimationFrame((function() {
                return Y()
              }))
            }), [Y, t]);
          (0, r.useEffect)((function() {
            var e = w.ownerDocument.body;
            return e.addEventListener("click", X, D), e.addEventListener("contextmenu", X, D), window.addEventListener("resize", $),
              function() {
                e.removeEventListener("click", X, D), e.removeEventListener("contextmenu", X, D), window.removeEventListener("resize", $)
              }
          }), [D, X, $, w]);
          var Z = (0, r.useCallback)((function(e) {
            B.current = e, null != n && ("object" == typeof n ? n.current = e : "function" == typeof n && n(e))
          }), [n]);
          return (0, l.jsxs)(l.Fragment, {
            children: [(0, r.cloneElement)(o, {
              ref: Z
            }), t ? (0, l.jsx)(i.PopoverPortal, {
              element: W.current,
              scoutElement: K.current,
              container: w,
              children: "function" == typeof d ? d(H) : d
            }) : null]
          })
        }));
      n.Popover = (0, r.forwardRef)((function(e, n) {
        return "undefined" == typeof window ? e.children : (0, l.jsx)(h, o({}, e, {
          ref: n
        }))
      }))
    },
    273192: (e, n, t) => {
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.PopoverPortal = void 0;
      var o = t(827378),
        l = t(331542);
      n.PopoverPortal = function(e) {
        var n = e.container,
          t = e.element,
          r = e.scoutElement,
          i = e.children;
        return (0, o.useLayoutEffect)((function() {
          return n.appendChild(t), n.appendChild(r),
            function() {
              n.removeChild(t), n.removeChild(r)
            }
        }), [n, t, r]), (0, l.createPortal)(i, t)
      }
    },
    661985: function(e, n, t) {
      var o = this && this.__assign || function() {
        return o = Object.assign || function(e) {
          for (var n, t = 1, o = arguments.length; t < o; t++)
            for (var l in n = arguments[t]) Object.prototype.hasOwnProperty.call(n, l) && (e[l] = n[l]);
          return e
        }, o.apply(this, arguments)
      };
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.useArrowContainer = void 0;
      var l = t(827378);
      n.useArrowContainer = function(e) {
        var n = e.childRect,
          t = e.popoverRect,
          r = e.position,
          i = e.arrowSize,
          a = e.arrowColor;
        return {
          arrowContainerStyle: (0, l.useMemo)((function() {
            return {
              padding: i
            }
          }), [i]),
          arrowStyle: (0, l.useMemo)((function() {
            return o({
              position: "absolute"
            }, function() {
              var e = 2 * i,
                o = n.top - t.top + n.height / 2 - e / 2,
                l = n.left - t.left + n.width / 2 - e / 2,
                u = i,
                s = t.width - i,
                c = t.height - i;
              switch (l = (l = l < u ? u : l) + e > s ? s - e : l, o = (o = o < u ? u : o) + e > c ? c - e : o, o = Number.isNaN(o) ? 0 : o, l = Number.isNaN(l) ? 0 : l, r) {
                case "right":
                  return {
                    borderTop: "".concat(i, "px solid transparent"), borderBottom: "".concat(i, "px solid transparent"), borderRight: "".concat(i, "px solid ").concat(a), left: 0, top: o
                  };
                case "left":
                  return {
                    borderTop: "".concat(i, "px solid transparent"), borderBottom: "".concat(i, "px solid transparent"), borderLeft: "".concat(i, "px solid ").concat(a), right: 0, top: o
                  };
                case "bottom":
                  return {
                    borderLeft: "".concat(i, "px solid transparent"), borderRight: "".concat(i, "px solid transparent"), borderBottom: "".concat(i, "px solid ").concat(a), top: 0, left: l
                  };
                case "top":
                  return {
                    borderLeft: "".concat(i, "px solid transparent"), borderRight: "".concat(i, "px solid transparent"), borderTop: "".concat(i, "px solid ").concat(a), bottom: 0, left: l
                  };
                default:
                  return {
                    display: "hidden"
                  }
              }
            }())
          }), [a, i, n.height, n.left, n.top, n.width, t.height, t.left, t.top, t.width, r])
        }
      }
    },
    835719: (e, n, t) => {
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.useElementRef = void 0;
      var o = t(827378),
        l = t(503380);
      n.useElementRef = function(e) {
        var n = e.containerClassName,
          t = e.containerStyle,
          r = (0, o.useRef)(),
          i = (0, o.useState)((function() {
            return (0, l.createContainer)({
              containerStyle: t,
              containerClassName: n
            })
          }))[0];
        return (0, o.useLayoutEffect)((function() {
          i.className = n
        }), [n, i]), (0, o.useLayoutEffect)((function() {
          Object.assign(i.style, t)
        }), [t, i]), r.current = i, r
      }
    },
    867895: (e, n, t) => {
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.useHandlePrevValues = void 0;
      var o = t(827378);
      n.useHandlePrevValues = function(e) {
        var n = (0, o.useRef)(e.positions),
          t = (0, o.useRef)(e.reposition),
          l = (0, o.useRef)(e.transformMode),
          r = (0, o.useRef)(e.transform),
          i = (0, o.useRef)(e.boundaryElement),
          a = (0, o.useRef)(e.boundaryInset),
          u = (0, o.useCallback)((function() {
            n.current = e.positions, t.current = e.reposition, l.current = e.transformMode, r.current = e.transform, i.current = e.boundaryElement, a.current = e.boundaryInset
          }), [e.boundaryElement, e.boundaryInset, e.positions, e.reposition, e.transform, e.transformMode]);
        return {
          prev: {
            positions: n.current,
            reposition: t.current,
            transformMode: l.current,
            transform: r.current,
            boundaryElement: i.current,
            boundaryInset: a.current
          },
          updatePrevValues: u
        }
      }
    },
    367255: (e, n, t) => {
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.useMemoizedArray = void 0;
      var o = t(827378);
      n.useMemoizedArray = function(e) {
        var n = (0, o.useRef)(e);
        return (0, o.useMemo)((function() {
          if (n.current === e) return n.current;
          if (n.current.length !== e.length) return n.current = e, e;
          for (var t = 0; t < e.length; t += 1)
            if (e[t] !== n.current[t]) return n.current = e, e;
          return n.current
        }), [e])
      }
    },
    556063: (e, n, t) => {
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.usePopover = void 0;
      var o = t(827378),
        l = t(503380),
        r = t(835719),
        i = {
          position: "fixed",
          overflow: "visible",
          top: "0px",
          left: "0px"
        },
        a = {
          position: "fixed",
          top: "0px",
          left: "0px",
          width: "0px",
          height: "0px",
          visibility: "hidden"
        };
      n.usePopover = function(e) {
        var n = e.isOpen,
          t = e.childRef,
          u = e.positions,
          s = e.containerClassName,
          c = e.parentElement,
          d = e.transform,
          p = e.transformMode,
          f = e.align,
          h = e.padding,
          m = e.reposition,
          g = e.boundaryInset,
          v = e.boundaryElement,
          b = e.onPositionPopover,
          y = (0, r.useElementRef)({
            containerClassName: "react-tiny-popover-scout",
            containerStyle: a
          }),
          k = (0, r.useElementRef)({
            containerClassName: null != s && s.length > 0 && "react-tiny-popover-container" !== s ? "react-tiny-popover-container ".concat(s) : "react-tiny-popover-container",
            containerStyle: i
          }),
          x = (0, o.useCallback)((function(e) {
            var o, r, i = void 0 === e ? {} : e,
              a = i.positionIndex,
              s = void 0 === a ? 0 : a,
              w = i.parentRect,
              S = void 0 === w ? c.getBoundingClientRect() : w,
              C = i.childRect,
              R = void 0 === C ? null === (o = null == t ? void 0 : t.current) || void 0 === o ? void 0 : o.getBoundingClientRect() : C,
              E = i.scoutRect,
              P = void 0 === E ? null === (r = null == y ? void 0 : y.current) || void 0 === r ? void 0 : r.getBoundingClientRect() : E,
              T = i.popoverRect,
              O = void 0 === T ? k.current.getBoundingClientRect() : T,
              M = i.boundaryRect,
              L = void 0 === M ? v === c ? S : v.getBoundingClientRect() : M;
            if (R && S && n) {
              if (d && "absolute" === p) {
                var I = "function" == typeof d ? d({
                    childRect: R,
                    popoverRect: O,
                    parentRect: S,
                    boundaryRect: L,
                    padding: h,
                    align: f,
                    nudgedTop: 0,
                    nudgedLeft: 0,
                    boundaryInset: g,
                    violations: l.EMPTY_RECT,
                    hasViolations: !1
                  }) : d,
                  A = I.top,
                  D = I.left,
                  _ = Math.round(S.left + D - P.left),
                  z = Math.round(S.top + A - P.top);
                return k.current.style.transform = "translate(".concat(_, "px, ").concat(z, "px)"), void b({
                  childRect: R,
                  popoverRect: (0, l.createRect)({
                    left: _,
                    top: z,
                    width: O.width,
                    height: O.height
                  }),
                  parentRect: S,
                  boundaryRect: L,
                  padding: h,
                  align: f,
                  transform: {
                    top: A,
                    left: D
                  },
                  nudgedTop: 0,
                  nudgedLeft: 0,
                  boundaryInset: g,
                  violations: l.EMPTY_RECT,
                  hasViolations: !1
                })
              }
              var F = s === u.length,
                j = F ? u[0] : u[s],
                B = (0, l.getNewPopoverRect)({
                  childRect: R,
                  popoverRect: O,
                  boundaryRect: L,
                  position: j,
                  align: f,
                  padding: h,
                  reposition: m
                }, g),
                U = B.rect;
              if (B.boundaryViolation && m && !F) x({
                positionIndex: s + 1,
                childRect: R,
                popoverRect: O,
                parentRect: S,
                boundaryRect: L
              });
              else {
                var H = U.top,
                  N = U.left,
                  V = U.width,
                  q = U.height,
                  Y = m && !F,
                  W = (0, l.getNudgedPopoverRect)(U, L, g),
                  K = W.left,
                  X = W.top,
                  $ = H,
                  Z = N;
                Y && ($ = X, Z = K), $ = Math.round($ - P.top), Z = Math.round(Z - P.left), k.current.style.transform = "translate(".concat(Z, "px, ").concat($, "px)");
                var J = {
                    top: L.top + g - $,
                    left: L.left + g - Z,
                    right: Z + V - L.right + g,
                    bottom: $ + q - L.bottom + g
                  },
                  Q = {
                    childRect: R,
                    popoverRect: (0, l.createRect)({
                      left: Z,
                      top: $,
                      width: V,
                      height: q
                    }),
                    parentRect: S,
                    boundaryRect: L,
                    position: j,
                    align: f,
                    padding: h,
                    nudgedTop: X - H,
                    nudgedLeft: K - N,
                    boundaryInset: g,
                    violations: {
                      top: J.top <= 0 ? 0 : J.top,
                      left: J.left <= 0 ? 0 : J.left,
                      right: J.right <= 0 ? 0 : J.right,
                      bottom: J.bottom <= 0 ? 0 : J.bottom
                    },
                    hasViolations: J.top > 0 || J.left > 0 || J.right > 0 || J.bottom > 0
                  };
                if (d) {
                  b(Q);
                  var G = "function" == typeof d ? d(Q) : d,
                    ee = G.top,
                    ne = G.left;
                  k.current.style.transform = "translate(".concat(Math.round(Z + (null != ne ? ne : 0)), "px, ").concat(Math.round($ + (null != ee ? ee : 0)), "px)"), Q.nudgedLeft += null != ne ? ne : 0, Q.nudgedTop += null != ee ? ee : 0, Q.transform = {
                    top: ee,
                    left: ne
                  }
                }
                b(Q)
              }
            }
          }), [c, t, y, k, v, n, d, p, u, f, h, m, g, b]);
        return {
          positionPopover: x,
          popoverRef: k,
          scoutRef: y
        }
      }
    },
    503380: function(e, n) {
      var t = this && this.__assign || function() {
        return t = Object.assign || function(e) {
          for (var n, t = 1, o = arguments.length; t < o; t++)
            for (var l in n = arguments[t]) Object.prototype.hasOwnProperty.call(n, l) && (e[l] = n[l]);
          return e
        }, t.apply(this, arguments)
      };
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.getNudgedPopoverRect = n.getNewPopoverRect = n.popoverRectForPosition = n.createContainer = n.rectsAreEqual = n.createRect = n.EMPTY_RECT = void 0, n.EMPTY_RECT = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      }, n.createRect = function(e) {
        var n = e.top,
          t = e.left,
          o = e.width,
          l = e.height;
        return {
          top: n,
          left: t,
          width: o,
          height: l,
          right: t + o,
          bottom: n + l
        }
      }, n.rectsAreEqual = function(e, n) {
        return e === n || (null == e ? void 0 : e.bottom) === (null == n ? void 0 : n.bottom) && (null == e ? void 0 : e.height) === (null == n ? void 0 : n.height) && (null == e ? void 0 : e.left) === (null == n ? void 0 : n.left) && (null == e ? void 0 : e.right) === (null == n ? void 0 : n.right) && (null == e ? void 0 : e.top) === (null == n ? void 0 : n.top) && (null == e ? void 0 : e.width) === (null == n ? void 0 : n.width)
      }, n.createContainer = function(e) {
        var n = e.containerStyle,
          t = e.containerClassName,
          o = window.document.createElement("div");
        return t && (o.className = t), Object.assign(o.style, n), o
      }, n.popoverRectForPosition = function(e, t, o, l, r) {
        var i, a, u = t.left + t.width / 2,
          s = t.top + t.height / 2,
          c = o.width,
          d = o.height;
        switch (e) {
          case "left":
            i = s - d / 2, a = t.left - l - c, "start" === r && (i = t.top), "end" === r && (i = t.bottom - d);
            break;
          case "bottom":
            i = t.bottom + l, a = u - c / 2, "start" === r && (a = t.left), "end" === r && (a = t.right - c);
            break;
          case "right":
            i = s - d / 2, a = t.right + l, "start" === r && (i = t.top), "end" === r && (i = t.bottom - d);
            break;
          default:
            i = t.top - d - l, a = u - c / 2, "start" === r && (a = t.left), "end" === r && (a = t.right - c)
        }
        return (0, n.createRect)({
          left: a,
          top: i,
          width: c,
          height: d
        })
      }, n.getNewPopoverRect = function(e, t) {
        var o = e.position,
          l = e.align,
          r = e.childRect,
          i = e.popoverRect,
          a = e.boundaryRect,
          u = e.padding,
          s = e.reposition,
          c = (0, n.popoverRectForPosition)(o, r, i, u, l);
        return {
          rect: c,
          boundaryViolation: s && ("top" === o && c.top < a.top + t || "left" === o && c.left < a.left + t || "right" === o && c.right > a.right - t || "bottom" === o && c.bottom > a.bottom - t)
        }
      }, n.getNudgedPopoverRect = function(e, o, l) {
        var r = o.top + l,
          i = o.left + l,
          a = o.right - l,
          u = o.bottom - l,
          s = e.top < r ? r : e.top;
        s = s + e.height > u ? u - e.height : s;
        var c = e.left < i ? i : e.left;
        return c = c + e.width > a ? a - e.width : c, (0, n.createRect)(t(t({}, e), {
          top: s,
          left: c
        }))
      }
    },
    135623: function(e, n, t) {
      var o = (this && this.__importDefault || function(e) {
          return e && e.__esModule ? e : {
            default: e
          }
        })(t(35209)),
        l = t(639874);

      function r(e, n) {
        var t = {};
        return e && "string" == typeof e ? ((0, o.default)(e, (function(e, o) {
          e && o && (t[(0, l.camelCase)(e, n)] = o)
        })), t) : t
      }
      r.default = r, e.exports = r
    },
    639874: (e, n) => {
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.camelCase = void 0;
      var t = /^--[a-zA-Z0-9_-]+$/,
        o = /-([a-z])/g,
        l = /^[^-]+$/,
        r = /^-(webkit|moz|ms|o|khtml)-/,
        i = /^-(ms)-/,
        a = function(e, n) {
          return n.toUpperCase()
        },
        u = function(e, n) {
          return "".concat(n, "-")
        };
      n.camelCase = function(e, n) {
        return void 0 === n && (n = {}),
          function(e) {
            return !e || l.test(e) || t.test(e)
          }(e) ? e : (e = e.toLowerCase(), (e = n.reactCompat ? e.replace(i, u) : e.replace(r, u)).replace(o, a))
      }
    },
    35209: function(e, n, t) {
      var o = this && this.__importDefault || function(e) {
        return e && e.__esModule ? e : {
          default: e
        }
      };
      Object.defineProperty(n, "__esModule", {
        value: !0
      }), n.default = function(e, n) {
        var t = null;
        if (!e || "string" != typeof e) return t;
        var o = (0, l.default)(e),
          r = "function" == typeof n;
        return o.forEach((function(e) {
          if ("declaration" === e.type) {
            var o = e.property,
              l = e.value;
            r ? n(o, l, e) : l && ((t = t || {})[o] = l)
          }
        })), t
      };
      var l = o(t(903812))
    },
    79249: (e, n, t) => {
      t.r(n), t.d(n, {
        compile: () => o.compile,
        micromark: () => a,
        parse: () => l.parse,
        postprocess: () => r.postprocess,
        preprocess: () => i.preprocess
      });
      var o = t(808273),
        l = t(779589),
        r = t(766772),
        i = t(59114);

      function a(e, n, t) {
        return "string" != typeof n && (t = n, n = void 0), (0, o.compile)(t)((0, r.postprocess)((0, l.parse)(t).document().write((0, i.preprocess)()(e, n, !0))))
      }
    },
    808273: (e, n, t) => {
      t.r(n), t.d(n, {
        compile: () => f
      });
      var o = t(269477),
        l = t(158300),
        r = t(514666),
        i = t(48031),
        a = t(854856),
        u = t(262493),
        s = t(157130);
      const c = {}.hasOwnProperty,
        d = /^(https?|ircs?|mailto|xmpp)$/i,
        p = /^https?$/i;

      function f(e) {
        const n = e || {};
        let t = !0;
        const f = {},
          h = [
            []
          ],
          m = [],
          g = [],
          v = {
            enter: {
              blockQuote: function() {
                g.push(!1), M(), P("<blockquote>")
              },
              codeFenced: function() {
                M(), P("<pre><code"), S("fencesCount", 0)
              },
              codeFencedFenceInfo: R,
              codeFencedFenceMeta: R,
              codeIndented: function() {
                M(), P("<pre><code>")
              },
              codeText: function() {
                S("inCodeText", !0), P("<code>")
              },
              content: function() {
                S("slurpAllLineEndings", !0)
              },
              definition: function() {
                R(), m.push({})
              },
              definitionDestinationString: function() {
                R(), S("ignoreEncode", !0)
              },
              definitionLabelString: R,
              definitionTitleString: R,
              emphasis: function() {
                P("<em>")
              },
              htmlFlow: function() {
                M(), B()
              },
              htmlText: B,
              image: function() {
                m.push({
                  image: !0
                }), t = void 0
              },
              label: R,
              link: function() {
                m.push({})
              },
              listItemMarker: function() {
                C("expectFirstItem") ? P(">") : A(), M(), P("<li>"), S("expectFirstItem"), S("lastWasTag")
              },
              listItemValue: function(e) {
                if (C("expectFirstItem")) {
                  const n = Number.parseInt(this.sliceSerialize(e), 10);
                  1 !== n && P(' start="' + L(String(n)) + '"')
                }
              },
              listOrdered: function(e) {
                g.push(!e._loose), M(), P("<ol"), S("expectFirstItem", !0)
              },
              listUnordered: function(e) {
                g.push(!e._loose), M(), P("<ul"), S("expectFirstItem", !0)
              },
              paragraph: function() {
                g[g.length - 1] || (M(), P("<p>")), S("slurpAllLineEndings")
              },
              reference: R,
              resource: function() {
                R(), m[m.length - 1].destination = ""
              },
              resourceDestinationString: function() {
                R(), S("ignoreEncode", !0)
              },
              resourceTitleString: R,
              setextHeading: function() {
                R(), S("slurpAllLineEndings")
              },
              strong: function() {
                P("<strong>")
              }
            },
            exit: {
              atxHeading: function() {
                P("</h" + C("headingRank") + ">"), S("headingRank")
              },
              atxHeadingSequence: function(e) {
                C("headingRank") || (S("headingRank", this.sliceSerialize(e).length), M(), P("<h" + C("headingRank") + ">"))
              },
              autolinkEmail: function(e) {
                const n = this.sliceSerialize(e);
                P('<a href="' + (0, s.sanitizeUri)("mailto:" + n) + '">'), T(L(n)), P("</a>")
              },
              autolinkProtocol: function(e) {
                const t = this.sliceSerialize(e);
                P('<a href="' + (0, s.sanitizeUri)(t, n.allowDangerousProtocol ? void 0 : d) + '">'), T(L(t)), P("</a>")
              },
              blockQuote: function() {
                g.pop(), M(), P("</blockquote>"), S("slurpAllLineEndings")
              },
              characterEscapeValue: z,
              characterReferenceMarkerHexadecimal: U,
              characterReferenceMarkerNumeric: U,
              characterReferenceValue: function(e) {
                const n = this.sliceSerialize(e);
                T(L(C("characterReferenceType") ? (0, i.decodeNumericCharacterReference)(n, "characterReferenceMarkerNumeric" === C("characterReferenceType") ? 10 : 16) : (0, o.decodeNamedCharacterReference)(n))), S("characterReferenceType")
              },
              codeFenced: D,
              codeFencedFence: function() {
                const e = C("fencesCount") || 0;
                e || (P(">"), S("slurpOneLineEnding", !0)), S("fencesCount", e + 1)
              },
              codeFencedFenceInfo: function() {
                P(' class="language-' + E() + '"')
              },
              codeFencedFenceMeta: I,
              codeFlowValue: function(e) {
                T(L(this.sliceSerialize(e))), S("flowCodeSeenData", !0)
              },
              codeIndented: D,
              codeText: function() {
                S("inCodeText"), P("</code>")
              },
              codeTextData: z,
              data: z,
              definition: function() {
                const e = m[m.length - 1],
                  n = (0, u.normalizeIdentifier)(e.labelId);
                E(), c.call(f, n) || (f[n] = m[m.length - 1]), m.pop()
              },
              definitionDestinationString: function() {
                m[m.length - 1].destination = E(), S("ignoreEncode")
              },
              definitionLabelString: function(e) {
                E(), m[m.length - 1].labelId = this.sliceSerialize(e)
              },
              definitionTitleString: function() {
                m[m.length - 1].title = E()
              },
              emphasis: function() {
                P("</em>")
              },
              hardBreakEscape: F,
              hardBreakTrailing: F,
              htmlFlow: j,
              htmlFlowData: z,
              htmlText: j,
              htmlTextData: z,
              image: _,
              label: function() {
                m[m.length - 1].label = E()
              },
              labelText: function(e) {
                m[m.length - 1].labelId = this.sliceSerialize(e)
              },
              lineEnding: function(e) {
                C("slurpAllLineEndings") || (C("slurpOneLineEnding") ? S("slurpOneLineEnding") : C("inCodeText") ? T(" ") : T(L(this.sliceSerialize(e))))
              },
              link: _,
              listOrdered: function() {
                A(), g.pop(), O(), P("</ol>")
              },
              listUnordered: function() {
                A(), g.pop(), O(), P("</ul>")
              },
              paragraph: function() {
                g[g.length - 1] ? S("slurpAllLineEndings", !0) : P("</p>")
              },
              reference: I,
              referenceString: function(e) {
                m[m.length - 1].referenceId = this.sliceSerialize(e)
              },
              resource: I,
              resourceDestinationString: function() {
                m[m.length - 1].destination = E(), S("ignoreEncode")
              },
              resourceTitleString: function() {
                m[m.length - 1].title = E()
              },
              setextHeading: function() {
                const e = E();
                M(), P("<h" + C("headingRank") + ">"), T(e), P("</h" + C("headingRank") + ">"), S("slurpAllLineEndings"), S("headingRank")
              },
              setextHeadingLineSequence: function(e) {
                S("headingRank", 61 === this.sliceSerialize(e).charCodeAt(0) ? 1 : 2)
              },
              setextHeadingText: function() {
                S("slurpAllLineEndings", !0)
              },
              strong: function() {
                P("</strong>")
              },
              thematicBreak: function() {
                M(), P("<hr />")
              }
            }
          },
          b = (0, r.combineHtmlExtensions)([v, ...n.htmlExtensions || []]),
          y = {
            definitions: f,
            tightStack: g
          },
          k = {
            buffer: R,
            encode: L,
            getData: C,
            lineEndingIfNeeded: M,
            options: n,
            raw: T,
            resume: E,
            setData: S,
            tag: P
          };
        let x = n.defaultLineEnding;
        return function(e) {
          let n = -1,
            t = 0;
          const o = [];
          let r = [],
            i = [];
          for (; ++n < e.length;) x || "lineEnding" !== e[n][1].type && "lineEndingBlank" !== e[n][1].type || (x = e[n][2].sliceSerialize(e[n][1])), "listOrdered" !== e[n][1].type && "listUnordered" !== e[n][1].type || ("enter" === e[n][0] ? o.push(n) : w(e.slice(o.pop(), n))), "definition" === e[n][1].type && ("enter" === e[n][0] ? (i = (0, l.push)(i, e.slice(t, n)), t = n) : (r = (0, l.push)(r, e.slice(t, n + 1)), t = n + 1));
          r = (0, l.push)(r, i), r = (0, l.push)(r, e.slice(t)), n = -1;
          const a = r;
          for (b.enter.null && b.enter.null.call(k); ++n < e.length;) {
            const e = b[a[n][0]],
              t = a[n][1].type,
              o = e[t];
            c.call(e, t) && o && o.call({
              sliceSerialize: a[n][2].sliceSerialize,
              ...k
            }, a[n][1])
          }
          return b.exit.null && b.exit.null.call(k), h[0].join("")
        };

        function w(e) {
          const n = e.length;
          let t, o = 0,
            l = 0,
            r = !1;
          for (; ++o < n;) {
            const n = e[o];
            if (n[1]._container) t = void 0, "enter" === n[0] ? l++ : l--;
            else switch (n[1].type) {
              case "listItemPrefix":
                "exit" === n[0] && (t = !0);
                break;
              case "linePrefix":
                break;
              case "lineEndingBlank":
                "enter" !== n[0] || l || (t ? t = void 0 : r = !0);
                break;
              default:
                t = void 0
            }
          }
          e[0][1]._loose = r
        }

        function S(e, n) {
          y[e] = n
        }

        function C(e) {
          return y[e]
        }

        function R() {
          h.push([])
        }

        function E() {
          return h.pop().join("")
        }

        function P(e) {
          t && (S("lastWasTag", !0), h[h.length - 1].push(e))
        }

        function T(e) {
          S("lastWasTag"), h[h.length - 1].push(e)
        }

        function O() {
          T(x || "\n")
        }

        function M() {
          const e = h[h.length - 1],
            n = e[e.length - 1],
            t = n ? n.charCodeAt(n.length - 1) : null;
          10 !== t && 13 !== t && null !== t && O()
        }

        function L(e) {
          return C("ignoreEncode") ? e : (0, a.encode)(e)
        }

        function I() {
          E()
        }

        function A() {
          C("lastWasTag") && !C("slurpAllLineEndings") && M(), P("</li>"), S("slurpAllLineEndings")
        }

        function D() {
          const e = C("fencesCount");
          void 0 !== e && e < 2 && y.tightStack.length > 0 && !C("lastWasTag") && O(), C("flowCodeSeenData") && M(), P("</code></pre>"), void 0 !== e && e < 2 && M(), S("flowCodeSeenData"), S("fencesCount"), S("slurpOneLineEnding")
        }

        function _() {
          let e = m.length - 1;
          const o = m[e],
            l = o.referenceId || o.labelId,
            r = void 0 === o.destination ? f[(0, u.normalizeIdentifier)(l)] : o;
          for (t = !0; e--;)
            if (m[e].image) {
              t = void 0;
              break
            } o.image ? (P('<img src="' + (0, s.sanitizeUri)(r.destination, n.allowDangerousProtocol ? void 0 : p) + '" alt="'), T(o.label), P('"')) : P('<a href="' + (0, s.sanitizeUri)(r.destination, n.allowDangerousProtocol ? void 0 : d) + '"'), P(r.title ? ' title="' + r.title + '"' : ""), o.image ? P(" />") : (P(">"), T(o.label), P("</a>")), m.pop()
        }

        function z(e) {
          T(L(this.sliceSerialize(e)))
        }

        function F() {
          P("<br />")
        }

        function j() {
          S("ignoreEncode")
        }

        function B() {
          n.allowDangerousHtml && S("ignoreEncode", !0)
        }

        function U(e) {
          S("characterReferenceType", e.type)
        }
      }
    },
    907391: (e, n, t) => {
      t.r(n), t.d(n, {
        attentionMarkers: () => p,
        contentInitial: () => i,
        disable: () => f,
        document: () => r,
        flow: () => u,
        flowInitial: () => a,
        insideSpan: () => d,
        string: () => s,
        text: () => c
      });
      var o = t(589531),
        l = t(647607);
      const r = {
          42: o.list,
          43: o.list,
          45: o.list,
          48: o.list,
          49: o.list,
          50: o.list,
          51: o.list,
          52: o.list,
          53: o.list,
          54: o.list,
          55: o.list,
          56: o.list,
          57: o.list,
          62: o.blockQuote
        },
        i = {
          91: o.definition
        },
        a = {
          [-2]: o.codeIndented,
          [-1]: o.codeIndented,
          32: o.codeIndented
        },
        u = {
          35: o.headingAtx,
          42: o.thematicBreak,
          45: [o.setextUnderline, o.thematicBreak],
          60: o.htmlFlow,
          61: o.setextUnderline,
          95: o.thematicBreak,
          96: o.codeFenced,
          126: o.codeFenced
        },
        s = {
          38: o.characterReference,
          92: o.characterEscape
        },
        c = {
          [-5]: o.lineEnding,
          [-4]: o.lineEnding,
          [-3]: o.lineEnding,
          33: o.labelStartImage,
          38: o.characterReference,
          42: o.attention,
          60: [o.autolink, o.htmlText],
          91: o.labelStartLink,
          92: [o.hardBreakEscape, o.characterEscape],
          93: o.labelEnd,
          95: o.attention,
          96: o.codeText
        },
        d = {
          null: [o.attention, l.resolver]
        },
        p = {
          null: [42, 95]
        },
        f = {
          null: []
        }
    },
    783454: (e, n, t) => {
      t.r(n), t.d(n, {
        createTokenizer: () => i
      });
      var o = t(576781),
        l = t(158300),
        r = t(563879);

      function i(e, n, t) {
        let i = {
          _bufferIndex: -1,
          _index: 0,
          line: t && t.line || 1,
          column: t && t.column || 1,
          offset: t && t.offset || 0
        };
        const a = {},
          u = [];
        let s = [],
          c = [],
          d = !0;
        const p = {
            attempt: k((function(e, n) {
              x(e, n.from)
            })),
            check: k(y),
            consume: function(e) {
              (0, o.markdownLineEnding)(e) ? (i.line++, i.column = 1, i.offset += -3 === e ? 2 : 1, w()) : -1 !== e && (i.column++, i.offset++), i._bufferIndex < 0 ? i._index++ : (i._bufferIndex++, i._bufferIndex === s[i._index].length && (i._bufferIndex = -1, i._index++)), f.previous = e, d = !0
            },
            enter: function(e, n) {
              const t = n || {};
              return t.type = e, t.start = v(), f.events.push(["enter", t, f]), c.push(t), t
            },
            exit: function(e) {
              const n = c.pop();
              return n.end = v(), f.events.push(["exit", n, f]), n
            },
            interrupt: k(y, {
              interrupt: !0
            })
          },
          f = {
            code: null,
            containerState: {},
            defineSkip: function(e) {
              a[e.line] = e.column, w()
            },
            events: [],
            now: v,
            parser: e,
            previous: null,
            sliceSerialize: function(e, n) {
              return function(e, n) {
                let t = -1;
                const o = [];
                let l;
                for (; ++t < e.length;) {
                  const r = e[t];
                  let i;
                  if ("string" == typeof r) i = r;
                  else switch (r) {
                    case -5:
                      i = "\r";
                      break;
                    case -4:
                      i = "\n";
                      break;
                    case -3:
                      i = "\r\n";
                      break;
                    case -2:
                      i = n ? " " : "\t";
                      break;
                    case -1:
                      if (!n && l) continue;
                      i = " ";
                      break;
                    default:
                      i = String.fromCharCode(r)
                  }
                  l = -2 === r, o.push(i)
                }
                return o.join("")
              }(g(e), n)
            },
            sliceStream: g,
            write: function(e) {
              return s = (0, l.push)(s, e),
                function() {
                  let e;
                  for (; i._index < s.length;) {
                    const n = s[i._index];
                    if ("string" == typeof n)
                      for (e = i._index, i._bufferIndex < 0 && (i._bufferIndex = 0); i._index === e && i._bufferIndex < n.length;) b(n.charCodeAt(i._bufferIndex));
                    else b(n)
                  }
                }(), null !== s[s.length - 1] ? [] : (x(n, 0), f.events = (0, r.resolveAll)(u, f.events, f), f.events)
            }
          };
        let h, m = n.tokenize.call(f, p);
        return n.resolveAll && u.push(n), f;

        function g(e) {
          return function(e, n) {
            const t = n.start._index,
              o = n.start._bufferIndex,
              l = n.end._index,
              r = n.end._bufferIndex;
            let i;
            if (t === l) i = [e[t].slice(o, r)];
            else {
              if (i = e.slice(t, l), o > -1) {
                const e = i[0];
                "string" == typeof e ? i[0] = e.slice(o) : i.shift()
              }
              r > 0 && i.push(e[l].slice(0, r))
            }
            return i
          }(s, e)
        }

        function v() {
          const {
            _bufferIndex: e,
            _index: n,
            line: t,
            column: o,
            offset: l
          } = i;
          return {
            _bufferIndex: e,
            _index: n,
            line: t,
            column: o,
            offset: l
          }
        }

        function b(e) {
          d = void 0, h = e, m = m(e)
        }

        function y(e, n) {
          n.restore()
        }

        function k(e, n) {
          return function(t, o, l) {
            let r, a, u, s;
            return Array.isArray(t) ? m(t) : "tokenize" in t ? m([t]) : (h = t, function(e) {
              const n = null !== e && h[e],
                t = null !== e && h.null;
              return m([...Array.isArray(n) ? n : n ? [n] : [], ...Array.isArray(t) ? t : t ? [t] : []])(e)
            });
            var h;

            function m(e) {
              return r = e, a = 0, 0 === e.length ? l : g(e[a])
            }

            function g(e) {
              return function(t) {
                return s = function() {
                  const e = v(),
                    n = f.previous,
                    t = f.currentConstruct,
                    o = f.events.length,
                    l = Array.from(c);
                  return {
                    from: o,
                    restore: function() {
                      i = e, f.previous = n, f.currentConstruct = t, f.events.length = o, c = l, w()
                    }
                  }
                }(), u = e, e.partial || (f.currentConstruct = e), e.name && f.parser.constructs.disable.null.includes(e.name) ? y() : e.tokenize.call(n ? Object.assign(Object.create(f), n) : f, p, b, y)(t)
              }
            }

            function b(n) {
              return d = !0, e(u, s), o
            }

            function y(e) {
              return d = !0, s.restore(), ++a < r.length ? g(r[a]) : l
            }
          }
        }

        function x(e, n) {
          e.resolveAll && !u.includes(e) && u.push(e), e.resolve && (0, l.splice)(f.events, n, f.events.length - n, e.resolve(f.events.slice(n), f)), e.resolveTo && (f.events = e.resolveTo(f.events, f))
        }

        function w() {
          i.line in a && i.column < 2 && (i.column = a[i.line], i.offset += a[i.line] - 1)
        }
      }
    },
    760006: (e, n, t) => {
      t.r(n), t.d(n, {
        content: () => r
      });
      var o = t(474014),
        l = t(576781);
      const r = {
        tokenize: function(e) {
          const n = e.attempt(this.parser.constructs.contentInitial, (function(t) {
            if (null !== t) return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), (0, o.factorySpace)(e, n, "linePrefix");
            e.consume(t)
          }), (function(n) {
            return e.enter("paragraph"), r(n)
          }));
          let t;
          return n;

          function r(n) {
            const o = e.enter("chunkText", {
              contentType: "text",
              previous: t
            });
            return t && (t.next = o), t = o, i(n)
          }

          function i(n) {
            return null === n ? (e.exit("chunkText"), e.exit("paragraph"), void e.consume(n)) : (0, l.markdownLineEnding)(n) ? (e.consume(n), e.exit("chunkText"), r) : (e.consume(n), i)
          }
        }
      }
    },
    861886: (e, n, t) => {
      t.r(n), t.d(n, {
        document: () => i
      });
      var o = t(474014),
        l = t(576781),
        r = t(158300);
      const i = {
          tokenize: function(e) {
            const n = this,
              t = [];
            let o, i, u, s = 0;
            return c;

            function c(o) {
              if (s < t.length) {
                const l = t[s];
                return n.containerState = l[1], e.attempt(l[0].continuation, d, p)(o)
              }
              return p(o)
            }

            function d(e) {
              if (s++, n.containerState._closeFlow) {
                n.containerState._closeFlow = void 0, o && x();
                const t = n.events.length;
                let l, i = t;
                for (; i--;)
                  if ("exit" === n.events[i][0] && "chunkFlow" === n.events[i][1].type) {
                    l = n.events[i][1].end;
                    break
                  } k(s);
                let a = t;
                for (; a < n.events.length;) n.events[a][1].end = {
                  ...l
                }, a++;
                return (0, r.splice)(n.events, i + 1, 0, n.events.slice(t)), n.events.length = a, p(e)
              }
              return c(e)
            }

            function p(l) {
              if (s === t.length) {
                if (!o) return m(l);
                if (o.currentConstruct && o.currentConstruct.concrete) return v(l);
                n.interrupt = Boolean(o.currentConstruct && !o._gfmTableDynamicInterruptHack)
              }
              return n.containerState = {}, e.check(a, f, h)(l)
            }

            function f(e) {
              return o && x(), k(s), m(e)
            }

            function h(e) {
              return n.parser.lazy[n.now().line] = s !== t.length, u = n.now().offset, v(e)
            }

            function m(t) {
              return n.containerState = {}, e.attempt(a, g, v)(t)
            }

            function g(e) {
              return s++, t.push([n.currentConstruct, n.containerState]), m(e)
            }

            function v(t) {
              return null === t ? (o && x(), k(0), void e.consume(t)) : (o = o || n.parser.flow(n.now()), e.enter("chunkFlow", {
                _tokenizer: o,
                contentType: "flow",
                previous: i
              }), b(t))
            }

            function b(t) {
              return null === t ? (y(e.exit("chunkFlow"), !0), k(0), void e.consume(t)) : (0, l.markdownLineEnding)(t) ? (e.consume(t), y(e.exit("chunkFlow")), s = 0, n.interrupt = void 0, c) : (e.consume(t), b)
            }

            function y(e, t) {
              const l = n.sliceStream(e);
              if (t && l.push(null), e.previous = i, i && (i.next = e), i = e, o.defineSkip(e.start), o.write(l), n.parser.lazy[e.start.line]) {
                let e = o.events.length;
                for (; e--;)
                  if (o.events[e][1].start.offset < u && (!o.events[e][1].end || o.events[e][1].end.offset > u)) return;
                const t = n.events.length;
                let l, i, a = t;
                for (; a--;)
                  if ("exit" === n.events[a][0] && "chunkFlow" === n.events[a][1].type) {
                    if (l) {
                      i = n.events[a][1].end;
                      break
                    }
                    l = !0
                  } for (k(s), e = t; e < n.events.length;) n.events[e][1].end = {
                  ...i
                }, e++;
                (0, r.splice)(n.events, a + 1, 0, n.events.slice(t)), n.events.length = e
              }
            }

            function k(o) {
              let l = t.length;
              for (; l-- > o;) {
                const o = t[l];
                n.containerState = o[1], o[0].exit.call(n, e)
              }
              t.length = o
            }

            function x() {
              o.write([null]), i = void 0, o = void 0, n.containerState._closeFlow = void 0
            }
          }
        },
        a = {
          tokenize: function(e, n, t) {
            return (0, o.factorySpace)(e, e.attempt(this.parser.constructs.document, n, t), "linePrefix", this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)
          }
        }
    },
    976419: (e, n, t) => {
      t.r(n), t.d(n, {
        flow: () => r
      });
      var o = t(589531),
        l = t(474014);
      const r = {
        tokenize: function(e) {
          const n = this,
            t = e.attempt(o.blankLine, (function(o) {
              if (null !== o) return e.enter("lineEndingBlank"), e.consume(o), e.exit("lineEndingBlank"), n.currentConstruct = void 0, t;
              e.consume(o)
            }), e.attempt(this.parser.constructs.flowInitial, r, (0, l.factorySpace)(e, e.attempt(this.parser.constructs.flow, r, e.attempt(o.content, r)), "linePrefix")));
          return t;

          function r(o) {
            if (null !== o) return e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), n.currentConstruct = void 0, t;
            e.consume(o)
          }
        }
      }
    },
    647607: (e, n, t) => {
      t.r(n), t.d(n, {
        resolver: () => o,
        string: () => l,
        text: () => r
      });
      const o = {
          resolveAll: a()
        },
        l = i("string"),
        r = i("text");

      function i(e) {
        return {
          resolveAll: a("text" === e ? u : void 0),
          tokenize: function(n) {
            const t = this,
              o = this.parser.constructs[e],
              l = n.attempt(o, r, i);
            return r;

            function r(e) {
              return u(e) ? l(e) : i(e)
            }

            function i(e) {
              if (null !== e) return n.enter("data"), n.consume(e), a;
              n.consume(e)
            }

            function a(e) {
              return u(e) ? (n.exit("data"), l(e)) : (n.consume(e), a)
            }

            function u(e) {
              if (null === e) return !0;
              const n = o[e];
              let l = -1;
              if (n)
                for (; ++l < n.length;) {
                  const e = n[l];
                  if (!e.previous || e.previous.call(t, t.previous)) return !0
                }
              return !1
            }
          }
        }
      }

      function a(e) {
        return function(n, t) {
          let o, l = -1;
          for (; ++l <= n.length;) void 0 === o ? n[l] && "data" === n[l][1].type && (o = l, l++) : n[l] && "data" === n[l][1].type || (l !== o + 2 && (n[o][1].end = n[l - 1][1].end, n.splice(o + 2, l - o - 2), l = o + 2), o = void 0);
          return e ? e(n, t) : n
        }
      }

      function u(e, n) {
        let t = 0;
        for (; ++t <= e.length;)
          if ((t === e.length || "lineEnding" === e[t][1].type) && "data" === e[t - 1][1].type) {
            const o = e[t - 1][1],
              l = n.sliceStream(o);
            let r, i = l.length,
              a = -1,
              u = 0;
            for (; i--;) {
              const e = l[i];
              if ("string" == typeof e) {
                for (a = e.length; 32 === e.charCodeAt(a - 1);) u++, a--;
                if (a) break;
                a = -1
              } else if (-2 === e) r = !0, u++;
              else if (-1 !== e) {
                i++;
                break
              }
            }
            if (n._contentTypeTextTrailing && t === e.length && (u = 0), u) {
              const l = {
                type: t === e.length || r || u < 2 ? "lineSuffix" : "hardBreakTrailing",
                start: {
                  _bufferIndex: i ? a : o.start._bufferIndex + a,
                  _index: o.start._index + i,
                  line: o.end.line,
                  column: o.end.column - u,
                  offset: o.end.offset - u
                },
                end: {
                  ...o.end
                }
              };
              o.end = {
                ...l.start
              }, o.start.offset === o.end.offset ? Object.assign(o, l) : (e.splice(t, 0, ["enter", l, n], ["exit", l, n]), t += 2)
            }
            t++
          } return e
      }
    },
    779589: (e, n, t) => {
      t.r(n), t.d(n, {
        parse: () => c
      });
      var o = t(514666),
        l = t(760006),
        r = t(861886),
        i = t(976419),
        a = t(647607),
        u = t(907391),
        s = t(783454);

      function c(e) {
        const n = e || {},
          t = {
            constructs: (0, o.combineExtensions)([u, ...n.extensions || []]),
            content: c(l.content),
            defined: [],
            document: c(r.document),
            flow: c(i.flow),
            lazy: {},
            string: c(a.string),
            text: c(a.text)
          };
        return t;

        function c(e) {
          return function(n) {
            return (0, s.createTokenizer)(t, e, n)
          }
        }
      }
    },
    766772: (e, n, t) => {
      t.r(n), t.d(n, {
        postprocess: () => l
      });
      var o = t(172988);

      function l(e) {
        for (; !(0, o.subtokenize)(e););
        return e
      }
    },
    59114: (e, n, t) => {
      t.r(n), t.d(n, {
        preprocess: () => l
      });
      const o = /[\0\t\n\r]/g;

      function l() {
        let e, n = 1,
          t = "",
          l = !0;
        return function(r, i, a) {
          const u = [];
          let s, c, d, p, f;
          for (r = t + ("string" == typeof r ? r.toString() : new TextDecoder(i || void 0).decode(r)), d = 0, t = "", l && (65279 === r.charCodeAt(0) && d++, l = void 0); d < r.length;) {
            if (o.lastIndex = d, s = o.exec(r), p = s && void 0 !== s.index ? s.index : r.length, f = r.charCodeAt(p), !s) {
              t = r.slice(d);
              break
            }
            if (10 === f && d === p && e) u.push(-3), e = void 0;
            else switch (e && (u.push(-5), e = void 0), d < p && (u.push(r.slice(d, p)), n += p - d), f) {
              case 0:
                u.push(65533), n++;
                break;
              case 9:
                for (c = 4 * Math.ceil(n / 4), u.push(-2); n++ < c;) u.push(-1);
                break;
              case 10:
                u.push(-4), n = 1;
                break;
              default:
                e = !0, n = 1
            }
            d = p + 1
          }
          return a && (e && u.push(-5), t && u.push(t), u.push(null)), u
        }
      }
    },
    220725: (e, n, t) => {
      t.r(n), t.d(n, {
        find: () => d.find,
        hastToReact: () => c.hastToReact,
        html: () => f,
        normalize: () => p.normalize,
        svg: () => h
      });
      var o = t(839419),
        l = t(675758),
        r = t(124873),
        i = t(688685),
        a = t(163243),
        u = t(687411),
        s = t(73586),
        c = t(111852),
        d = t(301789),
        p = t(408672);
      const f = (0, o.merge)([l.aria, r.html, a.xlink, u.xmlns, s.xml], "html"),
        h = (0, o.merge)([l.aria, i.svg, a.xlink, u.xmlns, s.xml], "svg")
    },
    675758: (e, n, t) => {
      t.r(n), t.d(n, {
        aria: () => r
      });
      var o = t(668047),
        l = t(665471);
      const r = (0, o.create)({
        properties: {
          ariaActiveDescendant: null,
          ariaAtomic: l.booleanish,
          ariaAutoComplete: null,
          ariaBusy: l.booleanish,
          ariaChecked: l.booleanish,
          ariaColCount: l.number,
          ariaColIndex: l.number,
          ariaColSpan: l.number,
          ariaControls: l.spaceSeparated,
          ariaCurrent: null,
          ariaDescribedBy: l.spaceSeparated,
          ariaDetails: null,
          ariaDisabled: l.booleanish,
          ariaDropEffect: l.spaceSeparated,
          ariaErrorMessage: null,
          ariaExpanded: l.booleanish,
          ariaFlowTo: l.spaceSeparated,
          ariaGrabbed: l.booleanish,
          ariaHasPopup: null,
          ariaHidden: l.booleanish,
          ariaInvalid: null,
          ariaKeyShortcuts: null,
          ariaLabel: null,
          ariaLabelledBy: l.spaceSeparated,
          ariaLevel: l.number,
          ariaLive: null,
          ariaModal: l.booleanish,
          ariaMultiLine: l.booleanish,
          ariaMultiSelectable: l.booleanish,
          ariaOrientation: null,
          ariaOwns: l.spaceSeparated,
          ariaPlaceholder: null,
          ariaPosInSet: l.number,
          ariaPressed: l.booleanish,
          ariaReadOnly: l.booleanish,
          ariaRelevant: null,
          ariaRequired: l.booleanish,
          ariaRoleDescription: l.spaceSeparated,
          ariaRowCount: l.number,
          ariaRowIndex: l.number,
          ariaRowSpan: l.number,
          ariaSelected: l.booleanish,
          ariaSetSize: l.number,
          ariaSort: null,
          ariaValueMax: l.number,
          ariaValueMin: l.number,
          ariaValueNow: l.number,
          ariaValueText: null,
          role: null
        },
        transform: (e, n) => "role" === n ? n : "aria-" + n.slice(4).toLowerCase()
      })
    },
    301789: (e, n, t) => {
      t.r(n), t.d(n, {
        find: () => s
      });
      var o = t(542062),
        l = t(226054),
        r = t(408672);
      const i = /[A-Z]/g,
        a = /-[a-z]/g,
        u = /^data[-\w.:]+$/i;

      function s(e, n) {
        const t = (0, r.normalize)(n);
        let s = n,
          p = l.Info;
        if (t in e.normal) return e.property[e.normal[t]];
        if (t.length > 4 && "data" === t.slice(0, 4) && u.test(n)) {
          if ("-" === n.charAt(4)) {
            const e = n.slice(5).replace(a, d);
            s = "data" + e.charAt(0).toUpperCase() + e.slice(1)
          } else {
            const e = n.slice(4);
            if (!a.test(e)) {
              let t = e.replace(i, c);
              "-" !== t.charAt(0) && (t = "-" + t), n = "data" + t
            }
          }
          p = o.DefinedInfo
        }
        return new p(s, n)
      }

      function c(e) {
        return "-" + e.toLowerCase()
      }

      function d(e) {
        return e.charAt(1).toUpperCase()
      }
    },
    111852: (e, n, t) => {
      t.r(n), t.d(n, {
        hastToReact: () => o
      });
      const o = {
        classId: "classID",
        dataType: "datatype",
        itemId: "itemID",
        strokeDashArray: "strokeDasharray",
        strokeDashOffset: "strokeDashoffset",
        strokeLineCap: "strokeLinecap",
        strokeLineJoin: "strokeLinejoin",
        strokeMiterLimit: "strokeMiterlimit",
        typeOf: "typeof",
        xLinkActuate: "xlinkActuate",
        xLinkArcRole: "xlinkArcrole",
        xLinkHref: "xlinkHref",
        xLinkRole: "xlinkRole",
        xLinkShow: "xlinkShow",
        xLinkTitle: "xlinkTitle",
        xLinkType: "xlinkType",
        xmlnsXLink: "xmlnsXlink"
      }
    },
    124873: (e, n, t) => {
      t.r(n), t.d(n, {
        html: () => i
      });
      var o = t(609838),
        l = t(668047),
        r = t(665471);
      const i = (0, l.create)({
        attributes: {
          acceptcharset: "accept-charset",
          classname: "class",
          htmlfor: "for",
          httpequiv: "http-equiv"
        },
        mustUseProperty: ["checked", "multiple", "muted", "selected"],
        properties: {
          abbr: null,
          accept: r.commaSeparated,
          acceptCharset: r.spaceSeparated,
          accessKey: r.spaceSeparated,
          action: null,
          allow: null,
          allowFullScreen: r.boolean,
          allowPaymentRequest: r.boolean,
          allowUserMedia: r.boolean,
          alt: null,
          as: null,
          async: r.boolean,
          autoCapitalize: null,
          autoComplete: r.spaceSeparated,
          autoFocus: r.boolean,
          autoPlay: r.boolean,
          blocking: r.spaceSeparated,
          capture: null,
          charSet: null,
          checked: r.boolean,
          cite: null,
          className: r.spaceSeparated,
          cols: r.number,
          colSpan: null,
          content: null,
          contentEditable: r.booleanish,
          controls: r.boolean,
          controlsList: r.spaceSeparated,
          coords: r.number | r.commaSeparated,
          crossOrigin: null,
          data: null,
          dateTime: null,
          decoding: null,
          default: r.boolean,
          defer: r.boolean,
          dir: null,
          dirName: null,
          disabled: r.boolean,
          download: r.overloadedBoolean,
          draggable: r.booleanish,
          encType: null,
          enterKeyHint: null,
          fetchPriority: null,
          form: null,
          formAction: null,
          formEncType: null,
          formMethod: null,
          formNoValidate: r.boolean,
          formTarget: null,
          headers: r.spaceSeparated,
          height: r.number,
          hidden: r.boolean,
          high: r.number,
          href: null,
          hrefLang: null,
          htmlFor: r.spaceSeparated,
          httpEquiv: r.spaceSeparated,
          id: null,
          imageSizes: null,
          imageSrcSet: null,
          inert: r.boolean,
          inputMode: null,
          integrity: null,
          is: null,
          isMap: r.boolean,
          itemId: null,
          itemProp: r.spaceSeparated,
          itemRef: r.spaceSeparated,
          itemScope: r.boolean,
          itemType: r.spaceSeparated,
          kind: null,
          label: null,
          lang: null,
          language: null,
          list: null,
          loading: null,
          loop: r.boolean,
          low: r.number,
          manifest: null,
          max: null,
          maxLength: r.number,
          media: null,
          method: null,
          min: null,
          minLength: r.number,
          multiple: r.boolean,
          muted: r.boolean,
          name: null,
          nonce: null,
          noModule: r.boolean,
          noValidate: r.boolean,
          onAbort: null,
          onAfterPrint: null,
          onAuxClick: null,
          onBeforeMatch: null,
          onBeforePrint: null,
          onBeforeToggle: null,
          onBeforeUnload: null,
          onBlur: null,
          onCancel: null,
          onCanPlay: null,
          onCanPlayThrough: null,
          onChange: null,
          onClick: null,
          onClose: null,
          onContextLost: null,
          onContextMenu: null,
          onContextRestored: null,
          onCopy: null,
          onCueChange: null,
          onCut: null,
          onDblClick: null,
          onDrag: null,
          onDragEnd: null,
          onDragEnter: null,
          onDragExit: null,
          onDragLeave: null,
          onDragOver: null,
          onDragStart: null,
          onDrop: null,
          onDurationChange: null,
          onEmptied: null,
          onEnded: null,
          onError: null,
          onFocus: null,
          onFormData: null,
          onHashChange: null,
          onInput: null,
          onInvalid: null,
          onKeyDown: null,
          onKeyPress: null,
          onKeyUp: null,
          onLanguageChange: null,
          onLoad: null,
          onLoadedData: null,
          onLoadedMetadata: null,
          onLoadEnd: null,
          onLoadStart: null,
          onMessage: null,
          onMessageError: null,
          onMouseDown: null,
          onMouseEnter: null,
          onMouseLeave: null,
          onMouseMove: null,
          onMouseOut: null,
          onMouseOver: null,
          onMouseUp: null,
          onOffline: null,
          onOnline: null,
          onPageHide: null,
          onPageShow: null,
          onPaste: null,
          onPause: null,
          onPlay: null,
          onPlaying: null,
          onPopState: null,
          onProgress: null,
          onRateChange: null,
          onRejectionHandled: null,
          onReset: null,
          onResize: null,
          onScroll: null,
          onScrollEnd: null,
          onSecurityPolicyViolation: null,
          onSeeked: null,
          onSeeking: null,
          onSelect: null,
          onSlotChange: null,
          onStalled: null,
          onStorage: null,
          onSubmit: null,
          onSuspend: null,
          onTimeUpdate: null,
          onToggle: null,
          onUnhandledRejection: null,
          onUnload: null,
          onVolumeChange: null,
          onWaiting: null,
          onWheel: null,
          open: r.boolean,
          optimum: r.number,
          pattern: null,
          ping: r.spaceSeparated,
          placeholder: null,
          playsInline: r.boolean,
          popover: null,
          popoverTarget: null,
          popoverTargetAction: null,
          poster: null,
          preload: null,
          readOnly: r.boolean,
          referrerPolicy: null,
          rel: r.spaceSeparated,
          required: r.boolean,
          reversed: r.boolean,
          rows: r.number,
          rowSpan: r.number,
          sandbox: r.spaceSeparated,
          scope: null,
          scoped: r.boolean,
          seamless: r.boolean,
          selected: r.boolean,
          shadowRootClonable: r.boolean,
          shadowRootDelegatesFocus: r.boolean,
          shadowRootMode: null,
          shape: null,
          size: r.number,
          sizes: null,
          slot: null,
          span: r.number,
          spellCheck: r.booleanish,
          src: null,
          srcDoc: null,
          srcLang: null,
          srcSet: null,
          start: r.number,
          step: null,
          style: null,
          tabIndex: r.number,
          target: null,
          title: null,
          translate: null,
          type: null,
          typeMustMatch: r.boolean,
          useMap: null,
          value: r.booleanish,
          width: r.number,
          wrap: null,
          writingSuggestions: null,
          align: null,
          aLink: null,
          archive: r.spaceSeparated,
          axis: null,
          background: null,
          bgColor: null,
          border: r.number,
          borderColor: null,
          bottomMargin: r.number,
          cellPadding: null,
          cellSpacing: null,
          char: null,
          charOff: null,
          classId: null,
          clear: null,
          code: null,
          codeBase: null,
          codeType: null,
          color: null,
          compact: r.boolean,
          declare: r.boolean,
          event: null,
          face: null,
          frame: null,
          frameBorder: null,
          hSpace: r.number,
          leftMargin: r.number,
          link: null,
          longDesc: null,
          lowSrc: null,
          marginHeight: r.number,
          marginWidth: r.number,
          noResize: r.boolean,
          noHref: r.boolean,
          noShade: r.boolean,
          noWrap: r.boolean,
          object: null,
          profile: null,
          prompt: null,
          rev: null,
          rightMargin: r.number,
          rules: null,
          scheme: null,
          scrolling: r.booleanish,
          standby: null,
          summary: null,
          text: null,
          topMargin: r.number,
          valueType: null,
          version: null,
          vAlign: null,
          vLink: null,
          vSpace: r.number,
          allowTransparency: null,
          autoCorrect: null,
          autoSave: null,
          disablePictureInPicture: r.boolean,
          disableRemotePlayback: r.boolean,
          prefix: null,
          property: null,
          results: r.number,
          security: null,
          unselectable: null
        },
        space: "html",
        transform: o.caseInsensitiveTransform
      })
    },
    408672: (e, n, t) => {
      function o(e) {
        return e.toLowerCase()
      }
      t.r(n), t.d(n, {
        normalize: () => o
      })
    },
    688685: (e, n, t) => {
      t.r(n), t.d(n, {
        svg: () => i
      });
      var o = t(562460),
        l = t(668047),
        r = t(665471);
      const i = (0, l.create)({
        attributes: {
          accentHeight: "accent-height",
          alignmentBaseline: "alignment-baseline",
          arabicForm: "arabic-form",
          baselineShift: "baseline-shift",
          capHeight: "cap-height",
          className: "class",
          clipPath: "clip-path",
          clipRule: "clip-rule",
          colorInterpolation: "color-interpolation",
          colorInterpolationFilters: "color-interpolation-filters",
          colorProfile: "color-profile",
          colorRendering: "color-rendering",
          crossOrigin: "crossorigin",
          dataType: "datatype",
          dominantBaseline: "dominant-baseline",
          enableBackground: "enable-background",
          fillOpacity: "fill-opacity",
          fillRule: "fill-rule",
          floodColor: "flood-color",
          floodOpacity: "flood-opacity",
          fontFamily: "font-family",
          fontSize: "font-size",
          fontSizeAdjust: "font-size-adjust",
          fontStretch: "font-stretch",
          fontStyle: "font-style",
          fontVariant: "font-variant",
          fontWeight: "font-weight",
          glyphName: "glyph-name",
          glyphOrientationHorizontal: "glyph-orientation-horizontal",
          glyphOrientationVertical: "glyph-orientation-vertical",
          hrefLang: "hreflang",
          horizAdvX: "horiz-adv-x",
          horizOriginX: "horiz-origin-x",
          horizOriginY: "horiz-origin-y",
          imageRendering: "image-rendering",
          letterSpacing: "letter-spacing",
          lightingColor: "lighting-color",
          markerEnd: "marker-end",
          markerMid: "marker-mid",
          markerStart: "marker-start",
          navDown: "nav-down",
          navDownLeft: "nav-down-left",
          navDownRight: "nav-down-right",
          navLeft: "nav-left",
          navNext: "nav-next",
          navPrev: "nav-prev",
          navRight: "nav-right",
          navUp: "nav-up",
          navUpLeft: "nav-up-left",
          navUpRight: "nav-up-right",
          onAbort: "onabort",
          onActivate: "onactivate",
          onAfterPrint: "onafterprint",
          onBeforePrint: "onbeforeprint",
          onBegin: "onbegin",
          onCancel: "oncancel",
          onCanPlay: "oncanplay",
          onCanPlayThrough: "oncanplaythrough",
          onChange: "onchange",
          onClick: "onclick",
          onClose: "onclose",
          onCopy: "oncopy",
          onCueChange: "oncuechange",
          onCut: "oncut",
          onDblClick: "ondblclick",
          onDrag: "ondrag",
          onDragEnd: "ondragend",
          onDragEnter: "ondragenter",
          onDragExit: "ondragexit",
          onDragLeave: "ondragleave",
          onDragOver: "ondragover",
          onDragStart: "ondragstart",
          onDrop: "ondrop",
          onDurationChange: "ondurationchange",
          onEmptied: "onemptied",
          onEnd: "onend",
          onEnded: "onended",
          onError: "onerror",
          onFocus: "onfocus",
          onFocusIn: "onfocusin",
          onFocusOut: "onfocusout",
          onHashChange: "onhashchange",
          onInput: "oninput",
          onInvalid: "oninvalid",
          onKeyDown: "onkeydown",
          onKeyPress: "onkeypress",
          onKeyUp: "onkeyup",
          onLoad: "onload",
          onLoadedData: "onloadeddata",
          onLoadedMetadata: "onloadedmetadata",
          onLoadStart: "onloadstart",
          onMessage: "onmessage",
          onMouseDown: "onmousedown",
          onMouseEnter: "onmouseenter",
          onMouseLeave: "onmouseleave",
          onMouseMove: "onmousemove",
          onMouseOut: "onmouseout",
          onMouseOver: "onmouseover",
          onMouseUp: "onmouseup",
          onMouseWheel: "onmousewheel",
          onOffline: "onoffline",
          onOnline: "ononline",
          onPageHide: "onpagehide",
          onPageShow: "onpageshow",
          onPaste: "onpaste",
          onPause: "onpause",
          onPlay: "onplay",
          onPlaying: "onplaying",
          onPopState: "onpopstate",
          onProgress: "onprogress",
          onRateChange: "onratechange",
          onRepeat: "onrepeat",
          onReset: "onreset",
          onResize: "onresize",
          onScroll: "onscroll",
          onSeeked: "onseeked",
          onSeeking: "onseeking",
          onSelect: "onselect",
          onShow: "onshow",
          onStalled: "onstalled",
          onStorage: "onstorage",
          onSubmit: "onsubmit",
          onSuspend: "onsuspend",
          onTimeUpdate: "ontimeupdate",
          onToggle: "ontoggle",
          onUnload: "onunload",
          onVolumeChange: "onvolumechange",
          onWaiting: "onwaiting",
          onZoom: "onzoom",
          overlinePosition: "overline-position",
          overlineThickness: "overline-thickness",
          paintOrder: "paint-order",
          panose1: "panose-1",
          pointerEvents: "pointer-events",
          referrerPolicy: "referrerpolicy",
          renderingIntent: "rendering-intent",
          shapeRendering: "shape-rendering",
          stopColor: "stop-color",
          stopOpacity: "stop-opacity",
          strikethroughPosition: "strikethrough-position",
          strikethroughThickness: "strikethrough-thickness",
          strokeDashArray: "stroke-dasharray",
          strokeDashOffset: "stroke-dashoffset",
          strokeLineCap: "stroke-linecap",
          strokeLineJoin: "stroke-linejoin",
          strokeMiterLimit: "stroke-miterlimit",
          strokeOpacity: "stroke-opacity",
          strokeWidth: "stroke-width",
          tabIndex: "tabindex",
          textAnchor: "text-anchor",
          textDecoration: "text-decoration",
          textRendering: "text-rendering",
          transformOrigin: "transform-origin",
          typeOf: "typeof",
          underlinePosition: "underline-position",
          underlineThickness: "underline-thickness",
          unicodeBidi: "unicode-bidi",
          unicodeRange: "unicode-range",
          unitsPerEm: "units-per-em",
          vAlphabetic: "v-alphabetic",
          vHanging: "v-hanging",
          vIdeographic: "v-ideographic",
          vMathematical: "v-mathematical",
          vectorEffect: "vector-effect",
          vertAdvY: "vert-adv-y",
          vertOriginX: "vert-origin-x",
          vertOriginY: "vert-origin-y",
          wordSpacing: "word-spacing",
          writingMode: "writing-mode",
          xHeight: "x-height",
          playbackOrder: "playbackorder",
          timelineBegin: "timelinebegin"
        },
        properties: {
          about: r.commaOrSpaceSeparated,
          accentHeight: r.number,
          accumulate: null,
          additive: null,
          alignmentBaseline: null,
          alphabetic: r.number,
          amplitude: r.number,
          arabicForm: null,
          ascent: r.number,
          attributeName: null,
          attributeType: null,
          azimuth: r.number,
          bandwidth: null,
          baselineShift: null,
          baseFrequency: null,
          baseProfile: null,
          bbox: null,
          begin: null,
          bias: r.number,
          by: null,
          calcMode: null,
          capHeight: r.number,
          className: r.spaceSeparated,
          clip: null,
          clipPath: null,
          clipPathUnits: null,
          clipRule: null,
          color: null,
          colorInterpolation: null,
          colorInterpolationFilters: null,
          colorProfile: null,
          colorRendering: null,
          content: null,
          contentScriptType: null,
          contentStyleType: null,
          crossOrigin: null,
          cursor: null,
          cx: null,
          cy: null,
          d: null,
          dataType: null,
          defaultAction: null,
          descent: r.number,
          diffuseConstant: r.number,
          direction: null,
          display: null,
          dur: null,
          divisor: r.number,
          dominantBaseline: null,
          download: r.boolean,
          dx: null,
          dy: null,
          edgeMode: null,
          editable: null,
          elevation: r.number,
          enableBackground: null,
          end: null,
          event: null,
          exponent: r.number,
          externalResourcesRequired: null,
          fill: null,
          fillOpacity: r.number,
          fillRule: null,
          filter: null,
          filterRes: null,
          filterUnits: null,
          floodColor: null,
          floodOpacity: null,
          focusable: null,
          focusHighlight: null,
          fontFamily: null,
          fontSize: null,
          fontSizeAdjust: null,
          fontStretch: null,
          fontStyle: null,
          fontVariant: null,
          fontWeight: null,
          format: null,
          fr: null,
          from: null,
          fx: null,
          fy: null,
          g1: r.commaSeparated,
          g2: r.commaSeparated,
          glyphName: r.commaSeparated,
          glyphOrientationHorizontal: null,
          glyphOrientationVertical: null,
          glyphRef: null,
          gradientTransform: null,
          gradientUnits: null,
          handler: null,
          hanging: r.number,
          hatchContentUnits: null,
          hatchUnits: null,
          height: null,
          href: null,
          hrefLang: null,
          horizAdvX: r.number,
          horizOriginX: r.number,
          horizOriginY: r.number,
          id: null,
          ideographic: r.number,
          imageRendering: null,
          initialVisibility: null,
          in: null,
          in2: null,
          intercept: r.number,
          k: r.number,
          k1: r.number,
          k2: r.number,
          k3: r.number,
          k4: r.number,
          kernelMatrix: r.commaOrSpaceSeparated,
          kernelUnitLength: null,
          keyPoints: null,
          keySplines: null,
          keyTimes: null,
          kerning: null,
          lang: null,
          lengthAdjust: null,
          letterSpacing: null,
          lightingColor: null,
          limitingConeAngle: r.number,
          local: null,
          markerEnd: null,
          markerMid: null,
          markerStart: null,
          markerHeight: null,
          markerUnits: null,
          markerWidth: null,
          mask: null,
          maskContentUnits: null,
          maskUnits: null,
          mathematical: null,
          max: null,
          media: null,
          mediaCharacterEncoding: null,
          mediaContentEncodings: null,
          mediaSize: r.number,
          mediaTime: null,
          method: null,
          min: null,
          mode: null,
          name: null,
          navDown: null,
          navDownLeft: null,
          navDownRight: null,
          navLeft: null,
          navNext: null,
          navPrev: null,
          navRight: null,
          navUp: null,
          navUpLeft: null,
          navUpRight: null,
          numOctaves: null,
          observer: null,
          offset: null,
          onAbort: null,
          onActivate: null,
          onAfterPrint: null,
          onBeforePrint: null,
          onBegin: null,
          onCancel: null,
          onCanPlay: null,
          onCanPlayThrough: null,
          onChange: null,
          onClick: null,
          onClose: null,
          onCopy: null,
          onCueChange: null,
          onCut: null,
          onDblClick: null,
          onDrag: null,
          onDragEnd: null,
          onDragEnter: null,
          onDragExit: null,
          onDragLeave: null,
          onDragOver: null,
          onDragStart: null,
          onDrop: null,
          onDurationChange: null,
          onEmptied: null,
          onEnd: null,
          onEnded: null,
          onError: null,
          onFocus: null,
          onFocusIn: null,
          onFocusOut: null,
          onHashChange: null,
          onInput: null,
          onInvalid: null,
          onKeyDown: null,
          onKeyPress: null,
          onKeyUp: null,
          onLoad: null,
          onLoadedData: null,
          onLoadedMetadata: null,
          onLoadStart: null,
          onMessage: null,
          onMouseDown: null,
          onMouseEnter: null,
          onMouseLeave: null,
          onMouseMove: null,
          onMouseOut: null,
          onMouseOver: null,
          onMouseUp: null,
          onMouseWheel: null,
          onOffline: null,
          onOnline: null,
          onPageHide: null,
          onPageShow: null,
          onPaste: null,
          onPause: null,
          onPlay: null,
          onPlaying: null,
          onPopState: null,
          onProgress: null,
          onRateChange: null,
          onRepeat: null,
          onReset: null,
          onResize: null,
          onScroll: null,
          onSeeked: null,
          onSeeking: null,
          onSelect: null,
          onShow: null,
          onStalled: null,
          onStorage: null,
          onSubmit: null,
          onSuspend: null,
          onTimeUpdate: null,
          onToggle: null,
          onUnload: null,
          onVolumeChange: null,
          onWaiting: null,
          onZoom: null,
          opacity: null,
          operator: null,
          order: null,
          orient: null,
          orientation: null,
          origin: null,
          overflow: null,
          overlay: null,
          overlinePosition: r.number,
          overlineThickness: r.number,
          paintOrder: null,
          panose1: null,
          path: null,
          pathLength: r.number,
          patternContentUnits: null,
          patternTransform: null,
          patternUnits: null,
          phase: null,
          ping: r.spaceSeparated,
          pitch: null,
          playbackOrder: null,
          pointerEvents: null,
          points: null,
          pointsAtX: r.number,
          pointsAtY: r.number,
          pointsAtZ: r.number,
          preserveAlpha: null,
          preserveAspectRatio: null,
          primitiveUnits: null,
          propagate: null,
          property: r.commaOrSpaceSeparated,
          r: null,
          radius: null,
          referrerPolicy: null,
          refX: null,
          refY: null,
          rel: r.commaOrSpaceSeparated,
          rev: r.commaOrSpaceSeparated,
          renderingIntent: null,
          repeatCount: null,
          repeatDur: null,
          requiredExtensions: r.commaOrSpaceSeparated,
          requiredFeatures: r.commaOrSpaceSeparated,
          requiredFonts: r.commaOrSpaceSeparated,
          requiredFormats: r.commaOrSpaceSeparated,
          resource: null,
          restart: null,
          result: null,
          rotate: null,
          rx: null,
          ry: null,
          scale: null,
          seed: null,
          shapeRendering: null,
          side: null,
          slope: null,
          snapshotTime: null,
          specularConstant: r.number,
          specularExponent: r.number,
          spreadMethod: null,
          spacing: null,
          startOffset: null,
          stdDeviation: null,
          stemh: null,
          stemv: null,
          stitchTiles: null,
          stopColor: null,
          stopOpacity: null,
          strikethroughPosition: r.number,
          strikethroughThickness: r.number,
          string: null,
          stroke: null,
          strokeDashArray: r.commaOrSpaceSeparated,
          strokeDashOffset: null,
          strokeLineCap: null,
          strokeLineJoin: null,
          strokeMiterLimit: r.number,
          strokeOpacity: r.number,
          strokeWidth: null,
          style: null,
          surfaceScale: r.number,
          syncBehavior: null,
          syncBehaviorDefault: null,
          syncMaster: null,
          syncTolerance: null,
          syncToleranceDefault: null,
          systemLanguage: r.commaOrSpaceSeparated,
          tabIndex: r.number,
          tableValues: null,
          target: null,
          targetX: r.number,
          targetY: r.number,
          textAnchor: null,
          textDecoration: null,
          textRendering: null,
          textLength: null,
          timelineBegin: null,
          title: null,
          transformBehavior: null,
          type: null,
          typeOf: r.commaOrSpaceSeparated,
          to: null,
          transform: null,
          transformOrigin: null,
          u1: null,
          u2: null,
          underlinePosition: r.number,
          underlineThickness: r.number,
          unicode: null,
          unicodeBidi: null,
          unicodeRange: null,
          unitsPerEm: r.number,
          values: null,
          vAlphabetic: r.number,
          vMathematical: r.number,
          vectorEffect: null,
          vHanging: r.number,
          vIdeographic: r.number,
          version: null,
          vertAdvY: r.number,
          vertOriginX: r.number,
          vertOriginY: r.number,
          viewBox: null,
          viewTarget: null,
          visibility: null,
          width: null,
          widths: null,
          wordSpacing: null,
          writingMode: null,
          x: null,
          x1: null,
          x2: null,
          xChannelSelector: null,
          xHeight: r.number,
          y: null,
          y1: null,
          y2: null,
          yChannelSelector: null,
          z: null,
          zoomAndPan: null
        },
        space: "svg",
        transform: o.caseSensitiveTransform
      })
    },
    609838: (e, n, t) => {
      t.r(n), t.d(n, {
        caseInsensitiveTransform: () => l
      });
      var o = t(562460);

      function l(e, n) {
        return (0, o.caseSensitiveTransform)(e, n.toLowerCase())
      }
    },
    562460: (e, n, t) => {
      function o(e, n) {
        return n in e ? e[n] : n
      }
      t.r(n), t.d(n, {
        caseSensitiveTransform: () => o
      })
    },
    668047: (e, n, t) => {
      t.r(n), t.d(n, {
        create: () => i
      });
      var o = t(408672),
        l = t(542062),
        r = t(14169);

      function i(e) {
        const n = {},
          t = {};
        for (const [r, i] of Object.entries(e.properties)) {
          const a = new l.DefinedInfo(r, e.transform(e.attributes || {}, r), i, e.space);
          e.mustUseProperty && e.mustUseProperty.includes(r) && (a.mustUseProperty = !0), n[r] = a, t[(0, o.normalize)(r)] = r, t[(0, o.normalize)(a.attribute)] = r
        }
        return new r.Schema(n, t, e.space)
      }
    },
    542062: (e, n, t) => {
      t.r(n), t.d(n, {
        DefinedInfo: () => i
      });
      var o = t(226054),
        l = t(665471);
      const r = Object.keys(l);
      class i extends o.Info {
        constructor(e, n, t, o) {
          let i = -1;
          if (super(e, n), a(this, "space", o), "number" == typeof t)
            for (; ++i < r.length;) {
              const e = r[i];
              a(this, r[i], (t & l[e]) === l[e])
            }
        }
      }

      function a(e, n, t) {
        t && (e[n] = t)
      }
      i.prototype.defined = !0
    },
    226054: (e, n, t) => {
      t.r(n), t.d(n, {
        Info: () => o
      });
      class o {
        constructor(e, n) {
          this.attribute = n, this.property = e
        }
      }
      o.prototype.attribute = "", o.prototype.booleanish = !1, o.prototype.boolean = !1, o.prototype.commaOrSpaceSeparated = !1, o.prototype.commaSeparated = !1, o.prototype.defined = !1, o.prototype.mustUseProperty = !1, o.prototype.number = !1, o.prototype.overloadedBoolean = !1, o.prototype.property = "", o.prototype.spaceSeparated = !1, o.prototype.space = void 0
    },
    839419: (e, n, t) => {
      t.r(n), t.d(n, {
        merge: () => l
      });
      var o = t(14169);

      function l(e, n) {
        const t = {},
          l = {};
        for (const n of e) Object.assign(t, n.property), Object.assign(l, n.normal);
        return new o.Schema(t, l, n)
      }
    },
    14169: (e, n, t) => {
      t.r(n), t.d(n, {
        Schema: () => o
      });
      class o {
        constructor(e, n, t) {
          this.normal = n, this.property = e, t && (this.space = t)
        }
      }
      o.prototype.normal = {}, o.prototype.property = {}, o.prototype.space = void 0
    },
    665471: (e, n, t) => {
      t.r(n), t.d(n, {
        boolean: () => l,
        booleanish: () => r,
        commaOrSpaceSeparated: () => c,
        commaSeparated: () => s,
        number: () => a,
        overloadedBoolean: () => i,
        spaceSeparated: () => u
      });
      let o = 0;
      const l = d(),
        r = d(),
        i = d(),
        a = d(),
        u = d(),
        s = d(),
        c = d();

      function d() {
        return 2 ** ++o
      }
    },
    163243: (e, n, t) => {
      t.r(n), t.d(n, {
        xlink: () => o
      });
      const o = (0, t(668047).create)({
        properties: {
          xLinkActuate: null,
          xLinkArcRole: null,
          xLinkHref: null,
          xLinkRole: null,
          xLinkShow: null,
          xLinkTitle: null,
          xLinkType: null
        },
        space: "xlink",
        transform: (e, n) => "xlink:" + n.slice(5).toLowerCase()
      })
    },
    73586: (e, n, t) => {
      t.r(n), t.d(n, {
        xml: () => o
      });
      const o = (0, t(668047).create)({
        properties: {
          xmlBase: null,
          xmlLang: null,
          xmlSpace: null
        },
        space: "xml",
        transform: (e, n) => "xml:" + n.slice(3).toLowerCase()
      })
    },
    687411: (e, n, t) => {
      t.r(n), t.d(n, {
        xmlns: () => r
      });
      var o = t(668047),
        l = t(609838);
      const r = (0, o.create)({
        attributes: {
          xmlnsxlink: "xmlns:xlink"
        },
        properties: {
          xmlnsXLink: null,
          xmlns: null
        },
        space: "xmlns",
        transform: l.caseInsensitiveTransform
      })
    },
    210124: (e, n, t) => {
      t.r(n), t.d(n, {
        MarkdownAsync: () => o.MarkdownAsync,
        MarkdownHooks: () => o.MarkdownHooks,
        default: () => o.Markdown,
        defaultUrlTransform: () => o.defaultUrlTransform
      });
      var o = t(728191)
    },
    728191: (e, n, t) => {
      t.r(n), t.d(n, {
        Markdown: () => b,
        MarkdownAsync: () => y,
        MarkdownHooks: () => k,
        defaultUrlTransform: () => C
      });
      var o = t(763436),
        l = t(467308),
        r = t(544704),
        i = t(824246),
        a = t(827378),
        u = t(415365),
        s = t(889120),
        c = t(546305),
        d = t(683428),
        p = t(656826);
      const f = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md",
        h = [],
        m = {
          allowDangerousHtml: !0
        },
        g = /^(https?|ircs?|mailto|xmpp)$/i,
        v = [{
          from: "astPlugins",
          id: "remove-buggy-html-in-markdown-parser"
        }, {
          from: "allowDangerousHtml",
          id: "remove-buggy-html-in-markdown-parser"
        }, {
          from: "allowNode",
          id: "replace-allownode-allowedtypes-and-disallowedtypes",
          to: "allowElement"
        }, {
          from: "allowedTypes",
          id: "replace-allownode-allowedtypes-and-disallowedtypes",
          to: "allowedElements"
        }, {
          from: "className",
          id: "remove-classname"
        }, {
          from: "disallowedTypes",
          id: "replace-allownode-allowedtypes-and-disallowedtypes",
          to: "disallowedElements"
        }, {
          from: "escapeHtml",
          id: "remove-buggy-html-in-markdown-parser"
        }, {
          from: "includeElementIndex",
          id: "#remove-includeelementindex"
        }, {
          from: "includeNodeIndex",
          id: "change-includenodeindex-to-includeelementindex"
        }, {
          from: "linkTarget",
          id: "remove-linktarget"
        }, {
          from: "plugins",
          id: "change-plugins-to-remarkplugins",
          to: "remarkPlugins"
        }, {
          from: "rawSourcePos",
          id: "#remove-rawsourcepos"
        }, {
          from: "renderers",
          id: "change-renderers-to-components",
          to: "components"
        }, {
          from: "source",
          id: "change-source-to-children",
          to: "children"
        }, {
          from: "sourcePos",
          id: "#remove-sourcepos"
        }, {
          from: "transformImageUri",
          id: "#add-urltransform",
          to: "urlTransform"
        }, {
          from: "transformLinkUri",
          id: "#add-urltransform",
          to: "urlTransform"
        }];

      function b(e) {
        const n = x(e),
          t = w(e);
        return S(n.runSync(n.parse(t), t), e)
      }
      async function y(e) {
        const n = x(e),
          t = w(e);
        return S(await n.run(n.parse(t), t), e)
      }

      function k(e) {
        const n = x(e),
          [t, o] = (0, a.useState)(void 0),
          [l, r] = (0, a.useState)(void 0);
        if ((0, a.useEffect)((function() {
            let t = !1;
            const l = w(e);
            return n.run(n.parse(l), l, (function(e, n) {
                t || (o(e), r(n))
              })),
              function() {
                t = !0
              }
          }), [e.children, e.rehypePlugins, e.remarkPlugins, e.remarkRehypeOptions]), t) throw t;
        return l ? S(l, e) : e.fallback
      }

      function x(e) {
        const n = e.rehypePlugins || h,
          t = e.remarkPlugins || h,
          o = e.remarkRehypeOptions ? {
            ...e.remarkRehypeOptions,
            ...m
          } : m;
        return (0, c.unified)().use(u.default).use(t).use(s.default, o).use(n)
      }

      function w(e) {
        const n = e.children || "",
          t = new p.VFile;
        return "string" == typeof n ? t.value = n : (0, o.unreachable)("Unexpected value `" + n + "` for `children` prop, expected `string`"), t
      }

      function S(e, n) {
        const t = n.allowedElements,
          a = n.allowElement,
          u = n.components,
          s = n.disallowedElements,
          c = n.skipHtml,
          p = n.unwrapDisallowed,
          h = n.urlTransform || C;
        for (const e of v) Object.hasOwn(n, e.from) && (0, o.unreachable)("Unexpected `" + e.from + "` prop, " + (e.to ? "use `" + e.to + "` instead" : "remove it") + " (see <" + f + "#" + e.id + "> for more info)");
        return t && s && (0, o.unreachable)("Unexpected combined `allowedElements` and `disallowedElements`, expected one or the other"), (0, d.visit)(e, (function(e, n, o) {
          if ("raw" === e.type && o && "number" == typeof n) return c ? o.children.splice(n, 1) : o.children[n] = {
            type: "text",
            value: e.value
          }, n;
          if ("element" === e.type) {
            let n;
            for (n in r.urlAttributes)
              if (Object.hasOwn(r.urlAttributes, n) && Object.hasOwn(e.properties, n)) {
                const t = e.properties[n],
                  o = r.urlAttributes[n];
                (null === o || o.includes(e.tagName)) && (e.properties[n] = h(String(t || ""), n, e))
              }
          }
          if ("element" === e.type) {
            let l = t ? !t.includes(e.tagName) : !!s && s.includes(e.tagName);
            if (!l && a && "number" == typeof n && (l = !a(e, n, o)), l && o && "number" == typeof n) return p && e.children ? o.children.splice(n, 1, ...e.children) : o.children.splice(n, 1), n
          }
        })), (0, l.toJsxRuntime)(e, {
          Fragment: i.Fragment,
          components: u,
          ignoreInvalidStyle: !0,
          jsx: i.jsx,
          jsxs: i.jsxs,
          passKeys: !0,
          passNode: !0
        })
      }

      function C(e) {
        const n = e.indexOf(":"),
          t = e.indexOf("?"),
          o = e.indexOf("#"),
          l = e.indexOf("/");
        return -1 === n || -1 !== l && n > l || -1 !== t && n > t || -1 !== o && n > o || g.test(e.slice(0, n)) ? e : ""
      }
    },
    415365: (e, n, t) => {
      t.r(n), t.d(n, {
        default: () => o.default
      });
      var o = t(762614)
    },
    762614: (e, n, t) => {
      t.r(n), t.d(n, {
        default: () => l
      });
      var o = t(846461);

      function l(e) {
        const n = this;
        n.parser = function(t) {
          return (0, o.fromMarkdown)(t, {
            ...n.data("settings"),
            ...e,
            extensions: n.data("micromarkExtensions") || [],
            mdastExtensions: n.data("fromMarkdownExtensions") || []
          })
        }
      }
    },
    889120: (e, n, t) => {
      t.r(n), t.d(n, {
        default: () => l.default,
        defaultFootnoteBackContent: () => o.defaultFootnoteBackContent,
        defaultFootnoteBackLabel: () => o.defaultFootnoteBackLabel,
        defaultHandlers: () => o.defaultHandlers
      });
      var o = t(46875),
        l = t(869110)
    },
    869110: (e, n, t) => {
      t.r(n), t.d(n, {
        default: () => l
      });
      var o = t(46875);

      function l(e, n) {
        return e && "run" in e ? async function(t, l) {
          const r = (0, o.toHast)(t, {
            file: l,
            ...n
          });
          await e.run(r, l)
        }: function(t, l) {
          return (0, o.toHast)(t, {
            file: l,
            ...e || n
          })
        }
      }
    },
    843220: (e, n, t) => {
      function o(e) {
        const n = String(e || "").trim();
        return n ? n.split(/[ \t\n\r\f]+/g) : []
      }

      function l(e) {
        return e.join(" ").trim()
      }
      t.r(n), t.d(n, {
        parse: () => o,
        stringify: () => l
      })
    },
    403804: (e, n, t) => {
      t.r(n), t.d(n, {
        trimLines: () => r
      });
      const o = 9,
        l = 32;

      function r(e) {
        const n = String(e),
          t = /\r?\n|\r/g;
        let o = t.exec(n),
          l = 0;
        const r = [];
        for (; o;) r.push(i(n.slice(l, o.index), l > 0, !0), o[0]), l = o.index + o[0].length, o = t.exec(n);
        return r.push(i(n.slice(l), l > 0, !1)), r.join("")
      }

      function i(e, n, t) {
        let r = 0,
          i = e.length;
        if (n) {
          let n = e.codePointAt(r);
          for (; n === o || n === l;) r++, n = e.codePointAt(r)
        }
        if (t) {
          let n = e.codePointAt(i - 1);
          for (; n === o || n === l;) i--, n = e.codePointAt(i - 1)
        }
        return i > r ? e.slice(r, i) : ""
      }
    },
    134994: (e, n, t) => {
      t.r(n), t.d(n, {
        trough: () => o.trough,
        wrap: () => o.wrap
      });
      var o = t(481495)
    },
    481495: (e, n, t) => {
      function o() {
        const e = [],
          n = {
            run: function(...n) {
              let t = -1;
              const o = n.pop();
              if ("function" != typeof o) throw new TypeError("Expected function as last argument, not " + o);
              ! function r(i, ...a) {
                const u = e[++t];
                let s = -1;
                if (i) o(i);
                else {
                  for (; ++s < n.length;) null !== a[s] && void 0 !== a[s] || (a[s] = n[s]);
                  n = a, u ? l(u, r)(...a) : o(null, ...a)
                }
              }(null, ...n)
            },
            use: function(t) {
              if ("function" != typeof t) throw new TypeError("Expected `middelware` to be a function, not " + t);
              return e.push(t), n
            }
          };
        return n
      }

      function l(e, n) {
        let t;
        return function(...n) {
          const r = e.length > n.length;
          let i;
          r && n.push(o);
          try {
            i = e.apply(this, n)
          } catch (e) {
            if (r && t) throw e;
            return o(e)
          }
          r || (i && i.then && "function" == typeof i.then ? i.then(l, o) : i instanceof Error ? o(i) : l(i))
        };

        function o(e, ...o) {
          t || (t = !0, n(e, ...o))
        }

        function l(e) {
          o(null, e)
        }
      }
      t.r(n), t.d(n, {
        trough: () => o,
        wrap: () => l
      })
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
        n = (new Error).stack;
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "77e041d9-b751-48a3-b8ef-2a47ec1607e7", e._sentryDebugIdIdentifier = "sentry-dbid-77e041d9-b751-48a3-b8ef-2a47ec1607e7")
    } catch (e) {}
  }();
//# sourceMappingURL=92581.bf94ec16bdcc2404e82f.js.map