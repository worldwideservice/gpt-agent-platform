"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [52044, 78939, 83534], {
    924039: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        wrapper: "a9852f15e",
        button: "a243ad4b4",
        badge: "a2e5943e"
      }
    },
    511528: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        overlay: "a0ac01c76",
        text: "a1357cec7"
      }
    },
    612739: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        link: "efead0f0"
      }
    },
    699206: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        disabled: "a5b9fa94c"
      }
    },
    656015: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        header: "a306efe95",
        title: "c1bb3560",
        description: "acd8a618",
        "upgrade-plan": "ae160b7c",
        "upgrade-text": "ae129774",
        "upgrade-title": "a75e1965f",
        beta: "a4860d810"
      }
    },
    247922: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        overlay: "a8ec5399c",
        content: "a3260535b",
        closeIconWrapper: "a13fc17c0",
        closeIcon: "a1715c0f3",
        image: "a53c218bd",
        counter: "a32c074de",
        arrowWrapper: "a9cf2cab0",
        left: "a2c228736",
        right: "a543f317e",
        arrow: "a5353e36b"
      }
    },
    485347: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        element: "a9c589646",
        popup: "a26e5ea66",
        "popup--tablet": "a5d970c5a",
        "popup--top": "a546b0508",
        "popup--bottom": "a996a54d0",
        "popup--left": "a38f1d2b4",
        "popup--right": "a34c235e2",
        arrow: "a2889e3ac",
        "arrow--top": "a5f3993cb",
        "arrow--bottom": "a4ea22bf5",
        "arrow--left": "f015c75e",
        "arrow--right": "a7704cf12"
      }
    },
    370169: (e, t, r) => {
      r.r(t), r.d(t, {
        SvgSprite: () => n.default
      });
      var n = r(387725)
    },
    472151: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => v
      });
      var n = r(292554),
        a = r.n(n),
        o = r(629133),
        i = r.n(o),
        c = r(916569),
        u = r(529062),
        s = r(701106),
        l = r(445368),
        f = r(924039),
        d = r(827378),
        p = a().bind(f.default);
      const v = function(e) {
        var t = e.description,
          r = e.onClick,
          n = e.title,
          a = void 0 === n ? "" : n,
          o = e.buttonTitle,
          f = void 0 === o ? (0, l.i18n)("PLUG_TOOLTIP_BUTTON") : o,
          v = e.wrapperClassName,
          h = void 0 === v ? "" : v,
          m = e.buttonClassName,
          b = void 0 === m ? "" : m,
          y = e.textClassName,
          g = void 0 === y ? "" : y,
          w = e.titleClassName,
          S = void 0 === w ? "" : w,
          E = e.badgeTitle,
          C = void 0 === E ? (0, l.i18n)("PLUG_TOOLTIP_RIBBON") : E;
        return d.createElement("div", {
          className: "".concat(p("wrapper"), " ").concat(h)
        }, a && d.createElement(s.default, {
          className: S,
          type: "h2",
          size: "xl"
        }, a), d.createElement(c.Text, {
          theme: c.TextPrimaryTheme,
          className: g,
          size: "l"
        }, t), d.createElement(u.Button, {
          className: "".concat(p("button"), " ").concat(b),
          onClick: function() {
            i().isFunction(r) ? r() : APP.router.navigate("/settings/pay/", {
              trigger: !0
            })
          },
          theme: u.ButtonPrimaryTheme
        }, f), d.createElement("div", {
          className: p("badge")
        }, C))
      }
    },
    106776: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = r(472151).default
    },
    178939: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = "kommo:ai:limits:reached:modal:show"
    },
    404926: (e, t, r) => {
      r.r(t), r.d(t, {
        AiSourcesNotEditableOverlay: () => n.AiSourcesNotEditableOverlay,
        AnimatedStars: () => n.AnimatedStars,
        LimitCallout: () => n.LimitCallout,
        SectionBody: () => n.SectionBody,
        SectionHeader: () => n.SectionHeader,
        useIsAiSourcesEditable: () => a.useIsAiSourcesEditable
      });
      var n = r(237299),
        a = r(299177)
    },
    299177: (e, t, r) => {
      r.r(t), r.d(t, {
        useIsAiSourcesEditable: () => n.useIsAiSourcesEditable
      });
      var n = r(362624)
    },
    362624: (e, t, r) => {
      r.r(t), r.d(t, {
        useIsAiSourcesEditable: () => n.useIsAiSourcesEditable
      });
      var n = r(420803)
    },
    420803: (e, t, r) => {
      r.r(t), r.d(t, {
        useIsAiSourcesEditable: () => s
      });
      var n = r(827378),
        a = r(500034),
        o = r(960190);

      function i(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }

      function c(e, t, r, n, a, o, i) {
        try {
          var c = e[o](i),
            u = c.value
        } catch (e) {
          return void r(e)
        }
        c.done ? t(u) : Promise.resolve(u).then(n, a)
      }

      function u(e) {
        return function() {
          var t = this,
            r = arguments;
          return new Promise((function(n, a) {
            var o = e.apply(t, r);

            function i(e) {
              c(o, n, a, i, u, "next", e)
            }

            function u(e) {
              c(o, n, a, i, u, "throw", e)
            }
            i(void 0)
          }))
        }
      }
      var s = function() {
        var e, t, r = (e = (0, n.useState)(!0), t = 2, function(e) {
            if (Array.isArray(e)) return e
          }(e) || function(e, t) {
            var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != r) {
              var n, a, o = [],
                i = !0,
                c = !1;
              try {
                for (r = r.call(e); !(i = (n = r.next()).done) && (o.push(n.value), !t || o.length !== t); i = !0);
              } catch (e) {
                c = !0, a = e
              } finally {
                try {
                  i || null == r.return || r.return()
                } finally {
                  if (c) throw a
                }
              }
              return o
            }
          }(e, t) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return i(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? i(e, t) : void 0
            }
          }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }()),
          c = r[0],
          s = r[1],
          l = (0, n.useCallback)(u((function() {
            var e, t;
            return function(e, t) {
              var r, n, a, o, i = {
                label: 0,
                sent: function() {
                  if (1 & a[0]) throw a[1];
                  return a[1]
                },
                trys: [],
                ops: []
              };
              return o = {
                next: c(0),
                throw: c(1),
                return: c(2)
              }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
              }), o;

              function c(o) {
                return function(c) {
                  return function(o) {
                    if (r) throw new TypeError("Generator is already executing.");
                    for (; i;) try {
                      if (r = 1, n && (a = 2 & o[0] ? n.return : o[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, o[1])).done) return a;
                      switch (n = 0, a && (o = [2 & o[0], a.value]), o[0]) {
                        case 0:
                        case 1:
                          a = o;
                          break;
                        case 4:
                          return i.label++, {
                            value: o[1],
                            done: !1
                          };
                        case 5:
                          i.label++, n = o[1], o = [0];
                          continue;
                        case 7:
                          o = i.ops.pop(), i.trys.pop();
                          continue;
                        default:
                          if (!((a = (a = i.trys).length > 0 && a[a.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                            i = 0;
                            continue
                          }
                          if (3 === o[0] && (!a || o[1] > a[0] && o[1] < a[3])) {
                            i.label = o[1];
                            break
                          }
                          if (6 === o[0] && i.label < a[1]) {
                            i.label = a[1], a = o;
                            break
                          }
                          if (a && i.label < a[2]) {
                            i.label = a[2], i.ops.push(o);
                            break
                          }
                          a[2] && i.ops.pop(), i.trys.pop();
                          continue
                      }
                      o = t.call(e, i)
                    } catch (e) {
                      o = [6, e], n = 0
                    } finally {
                      r = a = 0
                    }
                    if (5 & o[0]) throw o[1];
                    return {
                      value: o[0] ? o[1] : void 0,
                      done: !0
                    }
                  }([o, c])
                }
              }
            }(this, (function(r) {
              switch (r.label) {
                case 0:
                  return r.trys.push([0, 2, , 3]), (0, a.isFeatureAvailable)(a.Features.IS_CUSTOMIZATION_FOR_GLOBAL) ? [4, (0, o.getIsAgentSourcesEditable)()] : [2];
                case 1:
                  return (e = r.sent()).sources ? (s(Boolean(e.sources.length)), [3, 3]) : [2];
                case 2:
                  return t = r.sent(), console.error(t), [3, 3];
                case 3:
                  return [2]
              }
            }))
          })), []);
        return (0, n.useEffect)((function() {
          l()
        }), []), {
          isEditable: c
        }
      }
    },
    754732: (e, t, r) => {
      r.r(t), r.d(t, {
        AiSourcesNotEditableOverlay: () => u
      });
      var n = r(916569),
        a = r(445368),
        o = r(299177),
        i = r(511528),
        c = r(827378),
        u = function() {
          var e = (0, o.useIsAiSourcesEditable)().isEditable;
          return c.createElement(c.Fragment, null, !e && c.createElement("div", {
            className: i.default.overlay
          }, c.createElement(n.Text, {
            size: "l",
            theme: n.TextPrimaryTheme,
            className: i.default.text
          }, (0, a.i18n)("AI features are temporarily unavailable. Please try again later."))))
        }
    },
    555963: (e, t, r) => {
      r.r(t), r.d(t, {
        AiSourcesNotEditableOverlay: () => n.AiSourcesNotEditableOverlay
      });
      var n = r(754732)
    },
    297679: (e, t, r) => {
      r.r(t), r.d(t, {
        AnimatedStars: () => l
      });
      var n = r(827378),
        a = r(60042),
        o = r.n(a),
        i = r(882622),
        c = r(827378);

      function u(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }
      var s = 7e3,
        l = function(e) {
          var t, r, a = e.className,
            l = e.resetAnimationRef,
            f = (t = (0, n.useState)(!1), r = 2, function(e) {
              if (Array.isArray(e)) return e
            }(t) || function(e, t) {
              var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
              if (null != r) {
                var n, a, o = [],
                  i = !0,
                  c = !1;
                try {
                  for (r = r.call(e); !(i = (n = r.next()).done) && (o.push(n.value), !t || o.length !== t); i = !0);
                } catch (e) {
                  c = !0, a = e
                } finally {
                  try {
                    i || null == r.return || r.return()
                  } finally {
                    if (c) throw a
                  }
                }
                return o
              }
            }(t, r) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return u(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? u(e, t) : void 0
              }
            }(t, r) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()),
            d = f[0],
            p = f[1],
            v = (0, n.useRef)(!1),
            h = function() {
              var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : s;
              p(!1), setTimeout((function() {
                p(!0)
              }), e)
            };
          return (0, n.useEffect)((function() {
            l && (l.current = function() {
              return h(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 50)
            })
          }), [l]), (0, n.useEffect)((function() {
            var e = function() {
              "visible" === document.visibilityState ? h(800) : p(!1)
            };
            return document.addEventListener("visibilitychange", e),
              function() {
                document.removeEventListener("visibilitychange", e)
              }
          }), []), (0, n.useEffect)((function() {
            if (!v.current) {
              var e = setTimeout((function() {
                p(!0), v.current = !0
              }), s);
              return function() {
                return clearTimeout(e)
              }
            }
          }), []), c.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "21",
            height: "21",
            fill: "none",
            className: o()(a)
          }, c.createElement(i.Star, {
            type: "center",
            isAnimationEnabled: d,
            interval: s
          }), c.createElement(i.Star, {
            type: "left",
            isAnimationEnabled: d,
            interval: s
          }), c.createElement(i.Star, {
            type: "right",
            isAnimationEnabled: d,
            interval: s
          }))
        }
    },
    279569: (e, t, r) => {
      r.r(t), r.d(t, {
        Star: () => l
      });
      var n = r(827378),
        a = r(827378);

      function o(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }

      function i(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function c(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {},
            n = Object.keys(r);
          "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
          })))), n.forEach((function(t) {
            i(e, t, r[t])
          }))
        }
        return e
      }
      var u = {
          center: {
            y: -12,
            scale: .4,
            delay: 200
          },
          left: {
            y: -6,
            scale: .4,
            delay: 100
          },
          right: {
            y: -8,
            scale: .5,
            delay: 0
          }
        },
        s = {
          center: {
            stroke: "#ffffff",
            strokeWidth: "1.25",
            d: "M10.024 9.412c.185-.437.343-.9.476-1.35.133.45.29.913.476 1.35.311.733.732 1.474 1.308 1.935.707.566 1.74.97 2.7 1.252-.96.282-1.993.686-2.7 1.251-.576.461-.997 1.202-1.308 1.935-.185.437-.343.9-.476 1.35a12.68 12.68 0 0 0-.476-1.35c-.31-.733-.732-1.474-1.308-1.935-.707-.565-1.74-.97-2.7-1.251.96-.283 1.993-.687 2.7-1.252.576-.46.997-1.202 1.308-1.935Z"
          },
          left: {
            fill: "#ffffff",
            d: "M4.45 3.215c.092-.279.758-.279.85 0 .198.606.474 1.199.843 1.494.298.238.724.427 1.165.575.28.094.28.786 0 .88-.441.147-.867.337-1.165.574-.369.295-.645.888-.844 1.495-.09.278-.757.278-.848 0-.2-.607-.475-1.2-.844-1.495-.298-.237-.724-.427-1.165-.575-.28-.093-.28-.785 0-.879.441-.148.867-.337 1.165-.575.369-.295.645-.888.844-1.494Z"
          },
          right: {
            stroke: "#ffffff",
            strokeWidth: "1.25",
            d: "M15.224 3.383c.103-.206.194-.424.276-.645.082.22.173.439.276.645.19.383.444.772.783 1.044.354.283.811.502 1.267.672-.456.169-.913.388-1.267.671-.34.272-.592.662-.783 1.044a6.504 6.504 0 0 0-.276.645 6.504 6.504 0 0 0-.276-.645c-.19-.382-.444-.772-.783-1.044-.354-.283-.811-.502-1.267-.671.456-.17.913-.389 1.267-.672.34-.272.592-.661.783-1.044Z"
          }
        },
        l = function(e) {
          var t, r, i, l, f = e.type,
            d = e.isAnimationEnabled,
            p = e.interval,
            v = u[f],
            h = (t = (0, n.useState)({
              transform: "translateY(0px) scale(1)",
              opacity: 1,
              transition: "none"
            }), r = 2, function(e) {
              if (Array.isArray(e)) return e
            }(t) || function(e, t) {
              var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
              if (null != r) {
                var n, a, o = [],
                  i = !0,
                  c = !1;
                try {
                  for (r = r.call(e); !(i = (n = r.next()).done) && (o.push(n.value), !t || o.length !== t); i = !0);
                } catch (e) {
                  c = !0, a = e
                } finally {
                  try {
                    i || null == r.return || r.return()
                  } finally {
                    if (c) throw a
                  }
                }
                return o
              }
            }(t, r) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return o(e, t);
                var r = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? o(e, t) : void 0
              }
            }(t, r) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()),
            m = h[0],
            b = h[1],
            y = (0, n.useRef)(null),
            g = (0, n.useRef)(void 0),
            w = (0, n.useRef)(!0),
            S = function(e) {
              if (w.current && d) switch (e) {
                case 1:
                  b({
                    transform: "translateY(".concat(v.y, "px) scale(").concat(v.scale, ")"),
                    opacity: 0,
                    transition: "all ".concat(400, "ms cubic-bezier(0, 0, 0.58, 1)")
                  }), g.current = setTimeout((function() {
                    return S(2)
                  }), 400);
                  break;
                case 2:
                  b({
                    transform: "translateY(".concat(-v.y, "px) scale(").concat(v.scale, ")"),
                    opacity: 0,
                    transition: "none"
                  }), y.current = requestAnimationFrame((function() {
                    g.current = setTimeout((function() {
                      return S(3)
                    }), 16)
                  }));
                  break;
                case 3:
                  b({
                    transform: "translateY(0px) scale(1)",
                    opacity: 1,
                    transition: "all ".concat(200, "ms cubic-bezier(0.33, 1, 0.68, 1)")
                  }), g.current = setTimeout((function() {
                    return S(1)
                  }), p + 400)
              }
            };
          return (0, n.useEffect)((function() {
            var e;
            return w.current = !0, d && (e = setTimeout((function() {
                S(1)
              }), v.delay)),
              function() {
                w.current = !1, clearTimeout(e), clearTimeout(g.current), y.current && cancelAnimationFrame(y.current)
              }
          }), [d, v.delay]), a.createElement("path", c({
            style: (i = c({}, m), l = {
              transformOrigin: "center",
              willChange: "transform, opacity"
            }, l = null != l ? l : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(l)) : function(e, t) {
              var r = Object.keys(e);
              if (Object.getOwnPropertySymbols) {
                var n = Object.getOwnPropertySymbols(e);
                r.push.apply(r, n)
              }
              return r
            }(Object(l)).forEach((function(e) {
              Object.defineProperty(i, e, Object.getOwnPropertyDescriptor(l, e))
            })), i)
          }, s[f]))
        }
    },
    855963: (e, t, r) => {
      r.r(t), r.d(t, {
        Star: () => n.Star
      });
      var n = r(279569)
    },
    882622: (e, t, r) => {
      r.r(t), r.d(t, {
        Star: () => n.Star
      });
      var n = r(855963)
    },
    412721: (e, t, r) => {
      r.r(t), r.d(t, {
        AnimatedStars: () => n.AnimatedStars
      });
      var n = r(297679)
    },
    662297: (e, t, r) => {
      r.r(t), r.d(t, {
        LimitCallout: () => m
      });
      var n = r(292554),
        a = r.n(n),
        o = r(588435),
        i = r(352467),
        c = r(916569),
        u = r(926168),
        s = r(445368),
        l = r(612739),
        f = r(827378),
        d = a().bind(l.default),
        p = (0, u.isTrial)(),
        v = (0, u.isExpired)(),
        h = p || v,
        m = function(e) {
          var t = e.className,
            r = e.onClick,
            n = function() {
              h ? APP.router.navigate("/settings/pay/", {
                trigger: !0
              }) : r()
            };
          return f.createElement(o.Callout, {
            theme: o.CalloutErrorTheme,
            className: t
          }, f.createElement(c.Text, {
            size: "l",
            theme: c.TextPrimaryTheme
          }, h ? (0, s.i18n)("You’ve reached your AI limit for the Kommo trial. To continue using Kommo AI,") : (0, s.i18n)("You've reached your monthly limit for AI. You can reset your limit by"), " ", h ? f.createElement(i.Link, {
            theme: i.LinkPrimaryTheme,
            onClick: n,
            className: d("link")
          }, (0, s.i18n)("subscribe to a paid plan.")) : f.createElement(f.Fragment, null, f.createElement(i.Link, {
            theme: i.LinkPrimaryTheme,
            onClick: n,
            className: d("link")
          }, (0, s.i18n)("sharing feedback")), " ", (0, s.i18n)("about Kommo AI."))))
        }
    },
    962127: (e, t, r) => {
      r.r(t), r.d(t, {
        LimitCallout: () => n.LimitCallout
      });
      var n = r(662297)
    },
    933863: (e, t, r) => {
      r.r(t), r.d(t, {
        SectionBody: () => u
      });
      var n = r(292554),
        a = r.n(n),
        o = r(699206),
        i = r(827378),
        c = a().bind(o.default),
        u = function(e) {
          var t = e.children,
            r = e.isDisabled,
            n = void 0 !== r && r,
            a = e.isHidden,
            o = void 0 !== a && a,
            u = e.className,
            s = void 0 === u ? "" : u;
          return o ? null : i.createElement("div", {
            className: c({
              disabled: n
            }, s)
          }, t)
        }
    },
    672257: (e, t, r) => {
      r.r(t), r.d(t, {
        SectionBody: () => n.SectionBody
      });
      var n = r(933863)
    },
    485359: (e, t, r) => {
      r.r(t), r.d(t, {
        SectionHeader: () => b
      });
      var n = r(292554),
        a = r.n(n),
        o = r(629133),
        i = r.n(o),
        c = r(916569),
        u = r(701106),
        s = r(926168),
        l = r(445368),
        f = r(317954),
        d = r(106776),
        p = r(656015),
        v = r(827378),
        h = a().bind(p.default),
        m = (0, s.isTrialExpired)(),
        b = function(e) {
          var t = e.className,
            r = e.title,
            n = e.description,
            a = e.children,
            o = e.isPaymentRequired,
            s = void 0 !== o && o,
            p = e.isBeta,
            b = void 0 !== p && p,
            y = e.onUpgradeTarifClick,
            g = void 0 === y ? i().noop : y;
          return s ? v.createElement("div", {
            className: h("upgrade-plan")
          }, v.createElement(d.default, {
            title: v.createElement("div", {
              className: h("header")
            }, v.createElement(u.default, {
              type: "h2",
              size: "xl",
              className: h("title")
            }, r), b && v.createElement(f.MetaBadge, {
              title: (0, l.i18n)("Beta"),
              theme: "purple",
              className: h("beta")
            })),
            description: n,
            textClassName: h("upgrade-text"),
            titleClassName: h("upgrade-title"),
            badgeTitle: m ? (0, l.i18n)("Subscribe") : (0, l.i18n)("Resubscribe"),
            buttonTitle: m ? (0, l.i18n)("Subscribe") : (0, l.i18n)("Resubscribe"),
            onClick: g
          })) : v.createElement("div", {
            className: h("wrapper", t)
          }, v.createElement("div", {
            className: h("header")
          }, v.createElement(u.default, {
            type: "h2",
            size: "xl",
            className: h("title")
          }, r), b && v.createElement(f.MetaBadge, {
            title: (0, l.i18n)("Beta"),
            theme: "purple",
            className: h("beta")
          }), a), n && v.createElement(c.Text, {
            theme: c.TextSecondaryLightTheme,
            className: h("description"),
            size: "l"
          }, n))
        }
    },
    450148: (e, t, r) => {
      r.r(t), r.d(t, {
        SectionHeader: () => n.SectionHeader
      });
      var n = r(485359)
    },
    237299: (e, t, r) => {
      r.r(t), r.d(t, {
        AiSourcesNotEditableOverlay: () => c.AiSourcesNotEditableOverlay,
        AnimatedStars: () => n.AnimatedStars,
        LimitCallout: () => a.LimitCallout,
        SectionBody: () => o.SectionBody,
        SectionHeader: () => i.SectionHeader
      });
      var n = r(412721),
        a = r(962127),
        o = r(672257),
        i = r(450148),
        c = r(555963)
    },
    580789: (e, t, r) => {
      r.r(t), r.d(t, {
        ImagePreview: () => v
      });
      var n = r(629133),
        a = r.n(n),
        o = r(827378),
        i = r(60042),
        c = r.n(i),
        u = r(491967),
        s = r(445368),
        l = r(958186),
        f = r(247922),
        d = r(827378);

      function p(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }
      var v = function(e) {
        var t, r, n = e.images,
          i = e.startIndex,
          v = void 0 === i ? 0 : i,
          h = e.onCloseRequest,
          m = void 0 === h ? a().noop : h,
          b = (t = (0, o.useState)(v), r = 2, function(e) {
            if (Array.isArray(e)) return e
          }(t) || function(e, t) {
            var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != r) {
              var n, a, o = [],
                i = !0,
                c = !1;
              try {
                for (r = r.call(e); !(i = (n = r.next()).done) && (o.push(n.value), !t || o.length !== t); i = !0);
              } catch (e) {
                c = !0, a = e
              } finally {
                try {
                  i || null == r.return || r.return()
                } finally {
                  if (c) throw a
                }
              }
              return o
            }
          }(t, r) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return p(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? p(e, t) : void 0
            }
          }(t, r) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }()),
          y = b[0],
          g = b[1],
          w = n.length,
          S = w > 1;
        (0, l.usePreventBodyScroll)({
          shouldPrevent: !0
        });
        var E = function() {
            S && g((function(e) {
              return (e - 1 + w) % w
            }))
          },
          C = function() {
            S && g((function(e) {
              return (e + 1) % w
            }))
          },
          P = function(e) {
            e.stopPropagation(), C()
          },
          O = P,
          A = P;
        return (0, o.useEffect)((function() {
          var e = function(e) {
            "Escape" === e.key && m(), "ArrowLeft" === e.key && E(), "ArrowRight" === e.key && C()
          };
          return document.addEventListener("keydown", e),
            function() {
              document.removeEventListener("keydown", e)
            }
        }), []), d.createElement("div", {
          className: f.default.overlay,
          onClick: m
        }, d.createElement("button", {
          className: f.default.closeIconWrapper,
          onClick: function(e) {
            e.stopPropagation(), m()
          }
        }, d.createElement(u.default, {
          type: "svg",
          name: "common--cross-close",
          className: f.default.closeIcon
        })), d.createElement("div", {
          className: c()(f.default.content),
          onClick: A
        }, d.createElement("img", {
          src: n[y],
          className: c()(f.default.image)
        }), S && d.createElement("div", {
          className: c()(f.default.counter)
        }, y + 1, " ", (0, s.i18n)("of"), " ", w)), S && d.createElement(d.Fragment, null, d.createElement("button", {
          className: c()(f.default.arrowWrapper, f.default.left),
          onClick: function(e) {
            e.stopPropagation(), E()
          }
        }, d.createElement(u.default, {
          type: "svg",
          name: "ai_copilot--swipe-arrow",
          className: c()(f.default.arrow, f.default.left)
        })), d.createElement("button", {
          className: c()(f.default.arrowWrapper, f.default.right),
          onClick: O
        }, d.createElement(u.default, {
          type: "svg",
          name: "ai_copilot--swipe-arrow",
          className: c()(f.default.arrow, f.default.right)
        }))))
      }
    },
    962130: (e, t, r) => {
      r.r(t), r.d(t, {
        useImagePreview: () => n.useImagePreview
      });
      var n = r(464931)
    },
    464931: (e, t, r) => {
      r.r(t), r.d(t, {
        useImagePreview: () => n.useImagePreview
      });
      var n = r(753666)
    },
    753666: (e, t, r) => {
      r.r(t), r.d(t, {
        useImagePreview: () => n.useImagePreview
      });
      var n = r(400602)
    },
    400602: (e, t, r) => {
      r.r(t), r.d(t, {
        useImagePreview: () => u
      });
      var n = r(629133),
        a = r.n(n),
        o = r(817790),
        i = r(438089),
        c = r(580789),
        u = function(e) {
          var t = e.imageSrcs,
            r = void 0 === t ? [] : t,
            n = e.startIndex,
            u = void 0 === n ? 0 : n,
            s = e.onCloseRequest,
            l = void 0 === s ? a().noop : s,
            f = (0, i.default)(c.ImagePreview, {
              images: r,
              startIndex: u,
              onCloseRequest: function() {
                return l(), (0, o.setAboveAsideZIndex)(), !0
              }
            });
          return {
            imagePreview: f.modalElement,
            openImagePreview: f.showModal
          }
        }
    },
    582002: (e, t, r) => {
      r.r(t), r.d(t, {
        useClipboard: () => n.useClipboard
      });
      var n = r(802487)
    },
    802487: (e, t, r) => {
      r.r(t), r.d(t, {
        useClipboard: () => f
      });
      var n = r(629133),
        a = r.n(n),
        o = r(827378),
        i = r(809228),
        c = r.n(i);

      function u(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }

      function s(e, t, r, n, a, o, i) {
        try {
          var c = e[o](i),
            u = c.value
        } catch (e) {
          return void r(e)
        }
        c.done ? t(u) : Promise.resolve(u).then(n, a)
      }
      var l = 1e3;

      function f(e) {
        var t, r, n, i, f = e.textToCopy,
          d = e.delay,
          p = void 0 === d ? l : d,
          v = e.onSuccess,
          h = void 0 === v ? a().noop : v,
          m = e.onError,
          b = void 0 === m ? a().noop : m,
          y = (n = (0, o.useState)(!1), i = 2, function(e) {
            if (Array.isArray(e)) return e
          }(n) || function(e, t) {
            var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != r) {
              var n, a, o = [],
                i = !0,
                c = !1;
              try {
                for (r = r.call(e); !(i = (n = r.next()).done) && (o.push(n.value), !t || o.length !== t); i = !0);
              } catch (e) {
                c = !0, a = e
              } finally {
                try {
                  i || null == r.return || r.return()
                } finally {
                  if (c) throw a
                }
              }
              return o
            }
          }(n, i) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return u(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? u(e, t) : void 0
            }
          }(n, i) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }()),
          g = y[0],
          w = y[1],
          S = (0, o.useRef)(null),
          E = (0, o.useRef)(),
          C = (0, o.useRef)(null),
          P = function() {
            w(!0), h(), E.current && clearTimeout(E.current), E.current = setTimeout((function() {
              w(!1)
            }), p)
          },
          O = function() {
            return a().isFunction(f) ? f() : f
          },
          A = (t = function() {
            var e, t, r;
            return function(e, t) {
              var r, n, a, o, i = {
                label: 0,
                sent: function() {
                  if (1 & a[0]) throw a[1];
                  return a[1]
                },
                trys: [],
                ops: []
              };
              return o = {
                next: c(0),
                throw: c(1),
                return: c(2)
              }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                return this
              }), o;

              function c(o) {
                return function(c) {
                  return function(o) {
                    if (r) throw new TypeError("Generator is already executing.");
                    for (; i;) try {
                      if (r = 1, n && (a = 2 & o[0] ? n.return : o[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, o[1])).done) return a;
                      switch (n = 0, a && (o = [2 & o[0], a.value]), o[0]) {
                        case 0:
                        case 1:
                          a = o;
                          break;
                        case 4:
                          return i.label++, {
                            value: o[1],
                            done: !1
                          };
                        case 5:
                          i.label++, n = o[1], o = [0];
                          continue;
                        case 7:
                          o = i.ops.pop(), i.trys.pop();
                          continue;
                        default:
                          if (!((a = (a = i.trys).length > 0 && a[a.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                            i = 0;
                            continue
                          }
                          if (3 === o[0] && (!a || o[1] > a[0] && o[1] < a[3])) {
                            i.label = o[1];
                            break
                          }
                          if (6 === o[0] && i.label < a[1]) {
                            i.label = a[1], a = o;
                            break
                          }
                          if (a && i.label < a[2]) {
                            i.label = a[2], i.ops.push(o);
                            break
                          }
                          a[2] && i.ops.pop(), i.trys.pop();
                          continue
                      }
                      o = t.call(e, i)
                    } catch (e) {
                      o = [6, e], n = 0
                    } finally {
                      r = a = 0
                    }
                    if (5 & o[0]) throw o[1];
                    return {
                      value: o[0] ? o[1] : void 0,
                      done: !0
                    }
                  }([o, c])
                }
              }
            }(this, (function(n) {
              switch (n.label) {
                case 0:
                  if (e = O(), !navigator.clipboard || !navigator.clipboard.writeText) return [3, 5];
                  n.label = 1;
                case 1:
                  return n.trys.push([1, 3, , 4]), [4, navigator.clipboard.writeText(e)];
                case 2:
                  return n.sent(), P(), [3, 4];
                case 3:
                  return t = n.sent(), b(t), [3, 4];
                case 4:
                  return [3, 6];
                case 5:
                  null === (r = S.current) || void 0 === r || r.click(), n.label = 6;
                case 6:
                  return [2]
              }
            }))
          }, r = function() {
            var e = this,
              r = arguments;
            return new Promise((function(n, a) {
              var o = t.apply(e, r);

              function i(e) {
                s(o, n, a, i, c, "next", e)
              }

              function c(e) {
                s(o, n, a, i, c, "throw", e)
              }
              i(void 0)
            }))
          }, function() {
            return r.apply(this, arguments)
          }),
          T = function() {
            C.current && ("destroy" in C.current && a().isFunction(C.current.destroy) && C.current.destroy(), C.current = null), E.current && clearTimeout(E.current)
          };
        return (0, o.useEffect)((function() {
          T();
          var e = S.current;
          if (e) {
            var t = new(c())(e, {
              text: O
            });
            return t.on("success", P), C.current = t, T
          }
        }), [f, p, h]), {
          isCopied: g,
          clipboardRef: S,
          copy: A,
          reset: function() {
            w(!1), E.current && clearTimeout(E.current)
          }
        }
      }
    },
    958186: (e, t, r) => {
      r.r(t), r.d(t, {
        usePreventBodyScroll: () => n.usePreventBodyScroll
      });
      var n = r(743201)
    },
    743201: (e, t, r) => {
      r.r(t), r.d(t, {
        usePreventBodyScroll: () => n.usePreventBodyScroll
      });
      var n = r(158634)
    },
    158634: (e, t, r) => {
      r.r(t), r.d(t, {
        usePreventBodyScroll: () => i
      });
      var n = r(827378),
        a = 0,
        o = null;

      function i(e) {
        var t = e.shouldPrevent;
        (0, n.useEffect)((function() {
          var e = !1;
          return t && (0 === a && (o = document.body.style.overflow, document.body.style.overflow = "hidden"), a += 1, e = !0),
            function() {
              e && 0 == (a -= 1) && null !== o && (document.body.style.overflow = o, o = null)
            }
        }), [t])
      }
    },
    683534: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => o
      });
      var n = r(827378),
        a = r.n(n);
      const o = function(e) {
        var t = e.className,
          r = e.height,
          n = e.width,
          o = e.isAnimationEnabled,
          i = void 0 !== o && o,
          c = e.children;
        return a().createElement("div", {
          className: "".concat(i ? "card-plug__animation-enabled" : "card-plug__animation", " ").concat(t),
          style: {
            width: n,
            height: r
          }
        }, c)
      }
    },
    227498: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => b
      });
      var n = r(827378),
        a = r.n(n),
        o = r(629133),
        i = r.n(o),
        c = r(970013),
        u = r(597027),
        s = r(292554),
        l = r.n(s),
        f = r(724329),
        d = r(485347);

      function p(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }

      function v(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function h(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {},
            n = Object.keys(r);
          "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
          })))), n.forEach((function(t) {
            v(e, t, r[t])
          }))
        }
        return e
      }
      var m = l().bind(d.default);
      const b = function(e) {
        var t, r, o = e.children,
          s = e.content,
          l = e.className,
          d = void 0 === l ? "" : l,
          v = e.popupClassName,
          b = void 0 === v ? "" : v,
          y = e.arrowClassName,
          g = void 0 === y ? "" : y,
          w = e.containerStyles,
          S = void 0 === w ? {} : w,
          E = e.onMouseEnter,
          C = void 0 === E ? i().noop : E,
          P = e.onMouseLeave,
          O = void 0 === P ? i().noop : P,
          A = e.onPopupOutsideClick,
          T = void 0 === A ? i().noop : A,
          I = e.isOpen,
          k = void 0 !== I && I,
          x = e.isControlled,
          N = void 0 !== x && x,
          _ = e.parentElement,
          M = void 0 === _ ? document.body : _,
          B = e.padding,
          j = void 0 === B ? 4 : B,
          R = e.boundaryElement,
          L = e.positions,
          U = void 0 === L ? ["top", "bottom", "left", "right"] : L,
          D = e.align,
          F = void 0 === D ? "center" : D,
          q = e.isRepositionEnabled,
          z = void 0 === q || q,
          G = e.onArrowStyleCalculate,
          H = void 0 === G ? function(e) {
            switch (e) {
              case "top":
                return {
                  left: "50%", bottom: "-1.5px", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "5px solid var(--palette-background-primary)"
                };
              case "bottom":
                return {
                  left: "50%", top: "2.5px", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "5px solid var(--palette-background-primary)"
                };
              case "left":
                return {
                  top: "50%", right: "0px", transform: "translateY(-50%)", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "5px solid var(--palette-border-default)"
                };
              case "right":
                return {
                  top: "50%", transform: "translateY(-50%)", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "5px solid var(--palette-border-default)"
                };
              default:
                throw new Error("Unknown position – ".concat(e, "!"))
            }
          } : G,
          W = e.arrowSize,
          Y = void 0 === W ? 11 : W,
          V = e.isDisabled,
          $ = void 0 !== V && V,
          Z = (t = (0, n.useState)(k), r = 2, function(e) {
            if (Array.isArray(e)) return e
          }(t) || function(e, t) {
            var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != r) {
              var n, a, o = [],
                i = !0,
                c = !1;
              try {
                for (r = r.call(e); !(i = (n = r.next()).done) && (o.push(n.value), !t || o.length !== t); i = !0);
              } catch (e) {
                c = !0, a = e
              } finally {
                try {
                  i || null == r.return || r.return()
                } finally {
                  if (c) throw a
                }
              }
              return o
            }
          }(t, r) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return p(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? p(e, t) : void 0
            }
          }(t, r) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }()),
          K = Z[0],
          J = Z[1],
          Q = (0, n.useRef)(null);
        (0, f.useOnOutsideClick)({
          ref: Q,
          handler: T
        });
        var X = N ? k : K,
          ee = u.default.tablet();
        return (0, n.useEffect)((function() {
          $ && J(!1)
        }), [$]), a().createElement(c.Popover, {
          isOpen: X,
          positions: U,
          align: F,
          reposition: z,
          padding: j,
          containerStyle: h({
            zIndex: "calc(var(--modal-z-index) + 1)"
          }, S),
          boundaryElement: R,
          parentElement: M,
          content: function(e) {
            var t = e.position,
              r = e.childRect,
              n = e.popoverRect,
              o = H(t);
            return a().createElement(c.ArrowContainer, {
              position: t,
              childRect: r,
              popoverRect: n,
              arrowStyle: o,
              arrowClassName: "".concat(m("arrow", "arrow--".concat(t)), " ").concat(g),
              arrowSize: Y,
              arrowColor: "initial"
            }, a().createElement("div", {
              className: "".concat(m("popup", "popup--".concat(t), {
                "popup--tablet": ee
              }), " ").concat(b),
              ref: Q
            }, s))
          }
        }, a().createElement("div", {
          className: "".concat(m("element"), " ").concat(d),
          onMouseEnter: function() {
            $ || (N ? C() : J(!0))
          },
          onMouseLeave: function() {
            $ || (N ? O() : J(!1))
          }
        }, o))
      }
    },
    154459: (e, t, r) => {
      r.r(t), r.d(t, {
        sendComplaintMessage: () => u
      });
      var n = r(104737);

      function a(e, t, r, n, a, o, i) {
        try {
          var c = e[o](i),
            u = c.value
        } catch (e) {
          return void r(e)
        }
        c.done ? t(u) : Promise.resolve(u).then(n, a)
      }
      var o, i, c = "".concat("/ajax/v4/copilot", "/message_complaint"),
        u = (o = function(e) {
          return function(e, t) {
            var r, n, a, o, i = {
              label: 0,
              sent: function() {
                if (1 & a[0]) throw a[1];
                return a[1]
              },
              trys: [],
              ops: []
            };
            return o = {
              next: c(0),
              throw: c(1),
              return: c(2)
            }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
              return this
            }), o;

            function c(o) {
              return function(c) {
                return function(o) {
                  if (r) throw new TypeError("Generator is already executing.");
                  for (; i;) try {
                    if (r = 1, n && (a = 2 & o[0] ? n.return : o[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, o[1])).done) return a;
                    switch (n = 0, a && (o = [2 & o[0], a.value]), o[0]) {
                      case 0:
                      case 1:
                        a = o;
                        break;
                      case 4:
                        return i.label++, {
                          value: o[1],
                          done: !1
                        };
                      case 5:
                        i.label++, n = o[1], o = [0];
                        continue;
                      case 7:
                        o = i.ops.pop(), i.trys.pop();
                        continue;
                      default:
                        if (!((a = (a = i.trys).length > 0 && a[a.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                          i = 0;
                          continue
                        }
                        if (3 === o[0] && (!a || o[1] > a[0] && o[1] < a[3])) {
                          i.label = o[1];
                          break
                        }
                        if (6 === o[0] && i.label < a[1]) {
                          i.label = a[1], a = o;
                          break
                        }
                        if (a && i.label < a[2]) {
                          i.label = a[2], i.ops.push(o);
                          break
                        }
                        a[2] && i.ops.pop(), i.trys.pop();
                        continue
                    }
                    o = t.call(e, i)
                  } catch (e) {
                    o = [6, e], n = 0
                  } finally {
                    r = a = 0
                  }
                  if (5 & o[0]) throw o[1];
                  return {
                    value: o[0] ? o[1] : void 0,
                    done: !0
                  }
                }([o, c])
              }
            }
          }(this, (function(t) {
            switch (t.label) {
              case 0:
                return [4, n.default.request({
                  url: c,
                  method: "POST",
                  data: e,
                  contentType: "application/json"
                })];
              case 1:
                return t.sent(), [2]
            }
          }))
        }, i = function() {
          var e = this,
            t = arguments;
          return new Promise((function(r, n) {
            var i = o.apply(e, t);

            function c(e) {
              a(i, r, n, c, u, "next", e)
            }

            function u(e) {
              a(i, r, n, c, u, "throw", e)
            }
            c(void 0)
          }))
        }, function(e) {
          return i.apply(this, arguments)
        })
    },
    296972: (e, t, r) => {
      r.r(t), r.d(t, {
        sendComplaintMessage: () => n.sendComplaintMessage
      });
      var n = r(154459)
    },
    368398: (e, t, r) => {
      r.r(t), r.d(t, {
        toggleAiCopilot: () => l
      });
      var n = r(267651),
        a = r.n(n),
        o = r(157885),
        i = r(941146),
        c = r(500034),
        u = r(817790),
        s = !1;
      a().subscribe(o.ASIDE_OPEN_PUBSUB_EVENT, (function() {
        s = !0
      })), a().subscribe(i.ASIDE_CLOSE_PUBSUB_EVENT, (function() {
        s = !1
      }));
      var l = function() {
        (0, c.isFeatureAvailable)(c.Features.IS_AI_COPILOT_VIEWABLE) && (s ? (a().publish(i.ASIDE_CLOSE_PUBSUB_EVENT, !0), (0, u.toggleAside)(!1)) : (a().publish(o.ASIDE_OPEN_PUBSUB_EVENT, !0), (0, u.toggleAside)(!0)))
      }
    },
    888394: (e, t, r) => {
      r.r(t), r.d(t, {
        toggleAiCopilot: () => n.toggleAiCopilot
      });
      var n = r(368398)
    },
    781052: (e, t, r) => {
      r.r(t), r.d(t, {
        queries: () => a
      });
      var n = "aiCopilot",
        a = {
          messages: function(e) {
            return [n, "messages", e]
          },
          chats: function() {
            return [n, "chats"]
          },
          settings: function() {
            return [n, "settings"]
          }
        }
    },
    315823: (e, t, r) => {
      r.r(t), r.d(t, {
        createChat: () => y,
        deleteChat: () => g,
        getChats: () => b,
        getMessages: () => S,
        getSettings: () => m,
        markInteracted: () => k,
        markMessageAsClickedOnSupport: () => O,
        saveTogglerPosition: () => x,
        sendMessage: () => E,
        sendMetric: () => I,
        sendPreprocessedMessage: () => C,
        sendReaction: () => P,
        turnOffCopilot: () => T,
        turnOnCopilot: () => A,
        updateChat: () => w
      });
      var n = r(933072);

      function a(e, t, r, n, a, o, i) {
        try {
          var c = e[o](i),
            u = c.value
        } catch (e) {
          return void r(e)
        }
        c.done ? t(u) : Promise.resolve(u).then(n, a)
      }

      function o(e) {
        return function() {
          var t = this,
            r = arguments;
          return new Promise((function(n, o) {
            var i = e.apply(t, r);

            function c(e) {
              a(i, n, o, c, u, "next", e)
            }

            function u(e) {
              a(i, n, o, c, u, "throw", e)
            }
            c(void 0)
          }))
        }
      }

      function i(e, t) {
        var r, n, a, o, i = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return o = {
          next: c(0),
          throw: c(1),
          return: c(2)
        }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
          return this
        }), o;

        function c(o) {
          return function(c) {
            return function(o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; i;) try {
                if (r = 1, n && (a = 2 & o[0] ? n.return : o[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, o[1])).done) return a;
                switch (n = 0, a && (o = [2 & o[0], a.value]), o[0]) {
                  case 0:
                  case 1:
                    a = o;
                    break;
                  case 4:
                    return i.label++, {
                      value: o[1],
                      done: !1
                    };
                  case 5:
                    i.label++, n = o[1], o = [0];
                    continue;
                  case 7:
                    o = i.ops.pop(), i.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = i.trys).length > 0 && a[a.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                      i = 0;
                      continue
                    }
                    if (3 === o[0] && (!a || o[1] > a[0] && o[1] < a[3])) {
                      i.label = o[1];
                      break
                    }
                    if (6 === o[0] && i.label < a[1]) {
                      i.label = a[1], a = o;
                      break
                    }
                    if (a && i.label < a[2]) {
                      i.label = a[2], i.ops.push(o);
                      break
                    }
                    a[2] && i.ops.pop(), i.trys.pop();
                    continue
                }
                o = t.call(e, i)
              } catch (e) {
                o = [6, e], n = 0
              } finally {
                r = a = 0
              }
              if (5 & o[0]) throw o[1];
              return {
                value: o[0] ? o[1] : void 0,
                done: !0
              }
            }([o, c])
          }
        }
      }
      var c, u = "/api/v1/copilot",
        s = "".concat(u, "/accounts/").concat(APP.constant("account").id),
        l = "".concat(s, "/users/").concat(APP.constant("user").id),
        f = "".concat(l, "/chats"),
        d = "".concat(s, "/settings"),
        p = "".concat(u, "/metric"),
        v = "".concat(d, "/interaction"),
        h = "".concat(l, "/bookmark_position"),
        m = (c = o((function() {
          return i(this, (function(e) {
            switch (e.label) {
              case 0:
                return [4, (0, n.post)({
                  url: "".concat(d),
                  data: {
                    accountId: APP.constant("account").id,
                    userId: APP.constant("user").id,
                    tariff: APP.constant("account").tariffName,
                    userLanguage: APP.lang_id
                  }
                })];
              case 1:
                return [2, e.sent()]
            }
          }))
        })), function() {
          return c.apply(this, arguments)
        }),
        b = function() {
          var e = o((function() {
            return i(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, (0, n.get)({
                    url: "".concat(f)
                  })];
                case 1:
                  return [2, e.sent().chats]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        y = function() {
          var e = o((function() {
            return i(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, (0, n.post)({
                    url: "".concat(f),
                    data: {
                      userId: APP.constant("user").id
                    }
                  })];
                case 1:
                  return [2, e.sent()]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        g = function() {
          var e = o((function(e) {
            return i(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, n.remove)({
                    url: "".concat(f, "/").concat(e)
                  })];
                case 1:
                  return t.sent(), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        w = function() {
          var e = o((function(e) {
            return i(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, n.patch)({
                    url: f,
                    data: e
                  })];
                case 1:
                  return t.sent(), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        S = function() {
          var e = o((function(e) {
            var t;
            return i(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.chatId, [4, (0, n.get)({
                    url: "".concat(f, "/").concat(t, "/messages")
                  })];
                case 1:
                  return [2, r.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        E = function() {
          var e = o((function(e) {
            var t, r;
            return i(this, (function(a) {
              switch (a.label) {
                case 0:
                  return t = e.data, r = t.chatId, [4, (0, n.post)({
                    url: "".concat(f, "/").concat(r, "/messages"),
                    data: t
                  })];
                case 1:
                  return [2, a.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        C = function() {
          var e = o((function(e) {
            var t, r;
            return i(this, (function(a) {
              switch (a.label) {
                case 0:
                  return t = e.data, r = t.chatId, [4, (0, n.post)({
                    url: "".concat(f, "/").concat(r, "/messages/preprocessed"),
                    data: t
                  })];
                case 1:
                  return [2, a.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        P = function() {
          var e = o((function(e) {
            var t, r, a;
            return i(this, (function(o) {
              switch (o.label) {
                case 0:
                  return t = e.chatId, r = e.messageId, a = e.reaction, [4, (0, n.post)({
                    url: "".concat(f, "/").concat(t, "/messages/").concat(r, "/").concat(a)
                  })];
                case 1:
                  return o.sent(), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        O = function() {
          var e = o((function(e) {
            var t, r;
            return i(this, (function(a) {
              switch (a.label) {
                case 0:
                  return t = e.chatId, r = e.messageId, [4, (0, n.post)({
                    url: "".concat(f, "/").concat(t, "/messages/").concat(r, "/support_click")
                  })];
                case 1:
                  return a.sent(), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        A = function() {
          var e = o((function() {
            return i(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, (0, n.post)({
                    url: "".concat(d, "_copilot_on")
                  })];
                case 1:
                  return e.sent(), [2]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        T = function() {
          var e = o((function() {
            return i(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, (0, n.post)({
                    url: "".concat(d, "_copilot_off")
                  })];
                case 1:
                  return e.sent(), [2]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        I = function() {
          var e = o((function(e) {
            var t;
            return i(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.data, [4, (0, n.post)({
                    url: p,
                    data: t
                  })];
                case 1:
                  return r.sent(), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        k = function() {
          var e = o((function() {
            return i(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, (0, n.post)({
                    url: v,
                    data: {
                      accountId: APP.constant("account").id,
                      userId: APP.constant("user").id
                    }
                  })];
                case 1:
                  return e.sent(), [2]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        x = function() {
          var e = o((function(e) {
            return i(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, n.patch)({
                    url: h,
                    data: {
                      bookmark_position_height: e
                    }
                  })];
                case 1:
                  return t.sent(), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    648726: (e, t, r) => {
      r.r(t), r.d(t, {
        createChat: () => n.createChat,
        deleteChat: () => n.deleteChat,
        getChats: () => n.getChats,
        getMessages: () => n.getMessages,
        getSettings: () => n.getSettings,
        markInteracted: () => n.markInteracted,
        markMessageAsClickedOnSupport: () => n.markMessageAsClickedOnSupport,
        queries: () => a.queries,
        saveTogglerPosition: () => n.saveTogglerPosition,
        sendMessage: () => n.sendMessage,
        sendMetric: () => n.sendMetric,
        sendPreprocessedMessage: () => n.sendPreprocessedMessage,
        sendReaction: () => n.sendReaction,
        turnOffCopilot: () => n.turnOffCopilot,
        turnOnCopilot: () => n.turnOnCopilot,
        updateChat: () => n.updateChat
      });
      var n = r(315823),
        a = r(781052)
    },
    487431: (e, t, r) => {
      r.r(t), r.d(t, {
        get: () => O,
        patch: () => T,
        post: () => A,
        remove: () => I
      });
      var n = r(629133),
        a = r.n(n),
        o = r(567952),
        i = r.n(o),
        c = r(623967),
        u = r.n(c),
        s = r(926168),
        l = r(286340),
        f = r(104737),
        d = r(661533);

      function p(e, t, r, n, a, o, i) {
        try {
          var c = e[o](i),
            u = c.value
        } catch (e) {
          return void r(e)
        }
        c.done ? t(u) : Promise.resolve(u).then(n, a)
      }

      function v(e) {
        return function() {
          var t = this,
            r = arguments;
          return new Promise((function(n, a) {
            var o = e.apply(t, r);

            function i(e) {
              p(o, n, a, i, c, "next", e)
            }

            function c(e) {
              p(o, n, a, i, c, "throw", e)
            }
            i(void 0)
          }))
        }
      }

      function h(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function m(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {},
            n = Object.keys(r);
          "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
          })))), n.forEach((function(t) {
            h(e, t, r[t])
          }))
        }
        return e
      }

      function b(e, t) {
        if (null == e) return {};
        var r, n, a = function(e, t) {
          if (null == e) return {};
          var r, n, a = {},
            o = Object.keys(e);
          for (n = 0; n < o.length; n++) r = o[n], t.indexOf(r) >= 0 || (a[r] = e[r]);
          return a
        }(e, t);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          for (n = 0; n < o.length; n++) r = o[n], t.indexOf(r) >= 0 || Object.prototype.propertyIsEnumerable.call(e, r) && (a[r] = e[r])
        }
        return a
      }

      function y(e, t) {
        var r, n, a, o, i = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return o = {
          next: c(0),
          throw: c(1),
          return: c(2)
        }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
          return this
        }), o;

        function c(o) {
          return function(c) {
            return function(o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; i;) try {
                if (r = 1, n && (a = 2 & o[0] ? n.return : o[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, o[1])).done) return a;
                switch (n = 0, a && (o = [2 & o[0], a.value]), o[0]) {
                  case 0:
                  case 1:
                    a = o;
                    break;
                  case 4:
                    return i.label++, {
                      value: o[1],
                      done: !1
                    };
                  case 5:
                    i.label++, n = o[1], o = [0];
                    continue;
                  case 7:
                    o = i.ops.pop(), i.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = i.trys).length > 0 && a[a.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                      i = 0;
                      continue
                    }
                    if (3 === o[0] && (!a || o[1] > a[0] && o[1] < a[3])) {
                      i.label = o[1];
                      break
                    }
                    if (6 === o[0] && i.label < a[1]) {
                      i.label = a[1], a = o;
                      break
                    }
                    if (a && i.label < a[2]) {
                      i.label = a[2], i.ops.push(o);
                      break
                    }
                    a[2] && i.ops.pop(), i.trys.pop();
                    continue
                }
                o = t.call(e, i)
              } catch (e) {
                o = [6, e], n = 0
              } finally {
                r = a = 0
              }
              if (5 & o[0]) throw o[1];
              return {
                value: o[0] ? o[1] : void 0,
                done: !0
              }
            }([o, c])
          }
        }
      }
      var g, w = APP.constant("aicopilot").url,
        S = "",
        E = null,
        C = function() {
          return E || (E = v((function() {
            var e, t;
            return y(this, (function(r) {
              switch (r.label) {
                case 0:
                  return r.trys.push([0, 2, 3, 4]), [4, f.default.request({
                    url: "/ajax/v4/airewriter/issue_token",
                    method: "POST"
                  })];
                case 1:
                  return e = r.sent().token, S = e, [2, e];
                case 2:
                  throw t = r.sent(), E = null, t;
                case 3:
                  return S && (E = null), [7];
                case 4:
                  return [2]
              }
            }))
          }))())
        },
        P = (g = v((function(e) {
          var t, r, n;
          return y(this, (function(o) {
            switch (o.label) {
              case 0:
                t = function(t) {
                  return d.ajax(d.extend(!0, {}, e, {
                    url: e.url,
                    headers: {
                      "x-language": (0, s.isCustomers)() && a().includes(["leads", "customers"], APP.getBaseEntity()) ? (0, l.getEntityLangInCustomers)(APP.getBaseEntity()) : (0, s.getLangId)(),
                      Authorization: "Bearer ".concat(t)
                    },
                    contentType: "application/json"
                  }))
                }, o.label = 1;
              case 1:
                return o.trys.push([1, 6, , 9]), S ? [4, t(S)] : [3, 3];
              case 2:
                return [2, o.sent()];
              case 3:
                return [4, C()];
              case 4:
                return r = o.sent(), [4, t(r)];
              case 5:
                return [2, o.sent()];
              case 6:
                return 403 !== (n = o.sent()).status && 401 !== n.status ? [3, 8] : [4, C()];
              case 7:
                return o.sent(), [2, t(S)];
              case 8:
                throw n;
              case 9:
                return [2]
            }
          }))
        })), function(e) {
          return g.apply(this, arguments)
        }),
        O = function() {
          var e = v((function(e) {
            var t, r, n;
            return y(this, (function(a) {
              switch (a.label) {
                case 0:
                  return t = e.url, r = b(e, ["url"]), [4, P(m({
                    url: "".concat(w).concat(t)
                  }, r))];
                case 1:
                  return n = a.sent(), [2, i()(n)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        A = function() {
          var e = v((function(e) {
            var t, r, n, a;
            return y(this, (function(o) {
              switch (o.label) {
                case 0:
                  return t = e.url, r = e.data, n = b(e, ["url", "data"]), [4, P(m({
                    url: "".concat(w).concat(t),
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(m({}, u()(r)))
                  }, n))];
                case 1:
                  return a = o.sent(), [2, i()(a)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        T = function() {
          var e = v((function(e) {
            var t, r, n, a;
            return y(this, (function(o) {
              switch (o.label) {
                case 0:
                  return t = e.url, r = e.data, n = b(e, ["url", "data"]), [4, P(m({
                    url: "".concat(w).concat(t),
                    method: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(m({}, u()(r)))
                  }, n))];
                case 1:
                  return a = o.sent(), [2, i()(a)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        I = function() {
          var e = v((function(e) {
            var t, r, n;
            return y(this, (function(a) {
              switch (a.label) {
                case 0:
                  return t = e.url, r = b(e, ["url"]), [4, P(m({
                    url: "".concat(w).concat(t),
                    method: "DELETE"
                  }, r))];
                case 1:
                  return n = a.sent(), [2, i()(n)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    933072: (e, t, r) => {
      r.r(t), r.d(t, {
        get: () => n.get,
        patch: () => n.patch,
        post: () => n.post,
        remove: () => n.remove
      });
      var n = r(487431)
    },
    678272: (e, t, r) => {
      r.r(t), r.d(t, {
        getCachedSettings: () => p
      });
      var n = r(267651),
        a = r.n(n),
        o = r(82693),
        i = r(340348),
        c = r(315823);

      function u(e, t, r, n, a, o, i) {
        try {
          var c = e[o](i),
            u = c.value
        } catch (e) {
          return void r(e)
        }
        c.done ? t(u) : Promise.resolve(u).then(n, a)
      }
      var s = null,
        l = function() {
          s = null
        };
      a().subscribe(o.INIT_AI_COPILOT_PUBSUB_EVENT, (function() {
        l()
      })), a().subscribe(i.DESTROY_AI_COPILOT_PUBSUB_EVENT, (function() {
        l()
      }));
      var f, d, p = (f = function() {
        return function(e, t) {
          var r, n, a, o, i = {
            label: 0,
            sent: function() {
              if (1 & a[0]) throw a[1];
              return a[1]
            },
            trys: [],
            ops: []
          };
          return o = {
            next: c(0),
            throw: c(1),
            return: c(2)
          }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
            return this
          }), o;

          function c(o) {
            return function(c) {
              return function(o) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; i;) try {
                  if (r = 1, n && (a = 2 & o[0] ? n.return : o[0] ? n.throw || ((a = n.return) && a.call(n), 0) : n.next) && !(a = a.call(n, o[1])).done) return a;
                  switch (n = 0, a && (o = [2 & o[0], a.value]), o[0]) {
                    case 0:
                    case 1:
                      a = o;
                      break;
                    case 4:
                      return i.label++, {
                        value: o[1],
                        done: !1
                      };
                    case 5:
                      i.label++, n = o[1], o = [0];
                      continue;
                    case 7:
                      o = i.ops.pop(), i.trys.pop();
                      continue;
                    default:
                      if (!((a = (a = i.trys).length > 0 && a[a.length - 1]) || 6 !== o[0] && 2 !== o[0])) {
                        i = 0;
                        continue
                      }
                      if (3 === o[0] && (!a || o[1] > a[0] && o[1] < a[3])) {
                        i.label = o[1];
                        break
                      }
                      if (6 === o[0] && i.label < a[1]) {
                        i.label = a[1], a = o;
                        break
                      }
                      if (a && i.label < a[2]) {
                        i.label = a[2], i.ops.push(o);
                        break
                      }
                      a[2] && i.ops.pop(), i.trys.pop();
                      continue
                  }
                  o = t.call(e, i)
                } catch (e) {
                  o = [6, e], n = 0
                } finally {
                  r = a = 0
                }
                if (5 & o[0]) throw o[1];
                return {
                  value: o[0] ? o[1] : void 0,
                  done: !0
                }
              }([o, c])
            }
          }
        }(this, (function(e) {
          switch (e.label) {
            case 0:
              return e.trys.push([0, 2, , 3]), s || (s = (0, c.getSettings)()), [4, s];
            case 1:
              return [2, e.sent()];
            case 2:
              return e.sent(), l(), [2, null];
            case 3:
              return [2]
          }
        }))
      }, d = function() {
        var e = this,
          t = arguments;
        return new Promise((function(r, n) {
          var a = f.apply(e, t);

          function o(e) {
            u(a, r, n, o, i, "next", e)
          }

          function i(e) {
            u(a, r, n, o, i, "throw", e)
          }
          o(void 0)
        }))
      }, function() {
        return d.apply(this, arguments)
      })
    },
    531009: (e, t, r) => {
      r.r(t), r.d(t, {
        getCachedSettings: () => n.getCachedSettings
      });
      var n = r(678272)
    },
    471817: (e, t, r) => {
      r.r(t), r.d(t, {
        getCachedSettings: () => n.getCachedSettings
      });
      var n = r(531009)
    },
    702258: (e, t, r) => {
      r.r(t), r.d(t, {
        createChat: () => n.createChat,
        deleteChat: () => n.deleteChat,
        getCachedSettings: () => a.getCachedSettings,
        getChats: () => n.getChats,
        getMessages: () => n.getMessages,
        getSettings: () => n.getSettings,
        markInteracted: () => n.markInteracted,
        markMessageAsClickedOnSupport: () => n.markMessageAsClickedOnSupport,
        queries: () => n.queries,
        saveTogglerPosition: () => n.saveTogglerPosition,
        sendMessage: () => n.sendMessage,
        sendMetric: () => n.sendMetric,
        sendPreprocessedMessage: () => n.sendPreprocessedMessage,
        sendReaction: () => n.sendReaction,
        turnOffCopilot: () => n.turnOffCopilot,
        turnOnCopilot: () => n.turnOnCopilot,
        updateChat: () => n.updateChat
      });
      var n = r(648726),
        a = r(471817)
    },
    246799: (e, t, r) => {
      r.r(t), r.d(t, {
        createChat: () => a.createChat,
        deleteChat: () => a.deleteChat,
        getCachedSettings: () => a.getCachedSettings,
        getChats: () => a.getChats,
        getMessages: () => a.getMessages,
        getSettings: () => a.getSettings,
        markInteracted: () => a.markInteracted,
        markMessageAsClickedOnSupport: () => a.markMessageAsClickedOnSupport,
        queries: () => a.queries,
        sendComplaintMessage: () => n.sendComplaintMessage,
        sendMessage: () => a.sendMessage,
        sendMetric: () => a.sendMetric,
        sendPreprocessedMessage: () => a.sendPreprocessedMessage,
        sendReaction: () => a.sendReaction,
        toggleAiCopilot: () => o.toggleAiCopilot,
        turnOffCopilot: () => a.turnOffCopilot,
        turnOnCopilot: () => a.turnOnCopilot,
        updateChat: () => a.updateChat
      });
      var n = r(296972),
        a = r(702258),
        o = r(888394)
    },
    503711: (e, t, r) => {
      var n;
      r.r(t), r.d(t, {
          COPILOT_SEND_MESSAGE_PUBSUB_EVENT: () => o,
          CustomButtonTypes: () => n,
          SUPPORT_BUTTONS: () => a
        }),
        function(e) {
          e.TRANSFER_CHAT = "transferChat", e.GO_TO_CHAT_WITHOUT_TRANSFER = "goToChatWithoutTransfer"
        }(n || (n = {}));
      var a = [{
          text: "Share thread with support",
          id: "transferChat"
        }, {
          text: "Don't share thread with support",
          id: "goToChatWithoutTransfer"
        }],
        o = "copilot:sendMessage"
    },
    444715: (e, t, r) => {
      r.r(t), r.d(t, {
        COPILOT_SEND_MESSAGE_PUBSUB_EVENT: () => n.COPILOT_SEND_MESSAGE_PUBSUB_EVENT,
        CustomButtonTypes: () => n.CustomButtonTypes,
        SUPPORT_BUTTONS: () => n.SUPPORT_BUTTONS
      });
      var n = r(503711)
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "dee810b6-daa5-4356-843c-d352e74880a7", e._sentryDebugIdIdentifier = "sentry-dbid-dee810b6-daa5-4356-843c-d352e74880a7")
    } catch (e) {}
  }();
//# sourceMappingURL=52044.a52bb336fc4717106477.js.map