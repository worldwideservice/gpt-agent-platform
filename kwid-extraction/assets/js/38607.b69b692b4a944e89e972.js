/*! For license information please see 38607.b69b692b4a944e89e972.js.LICENSE.txt */
(window.webpackChunk = window.webpackChunk || []).push([
  [38607], {
    830516: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        Button: () => f
      });
      var n = r(824246),
        o = r(827378),
        i = r.n(o),
        a = r(22538),
        s = r(55436),
        c = r(847306),
        l = r(260391),
        u = r(303742),
        d = r(369757);
      r(939035);
      const f = (0, o.forwardRef)(((e, t) => {
        const {
          className: r = "",
          type: f = "button",
          onClick: p = c.noop,
          theme: _,
          isLoading: h,
          isDisabled: m,
          before: y,
          after: b,
          children: v,
          showInvalidAnimationRef: g,
          showSuccessfulStateRef: w,
          successfulStateText: k,
          isClickableWhileDisabled: x = !1,
          ...S
        } = e, E = (0, s.useThemeClassName)(_), P = (0, o.useMemo)((() => (e => {
          const t = {
            "--crm-ui-kit-spinner-border-color": e["--crm-ui-kit-button-spinner-border-color"],
            "--crm-ui-kit-spinner-border-width": e["--crm-ui-kit-button-spinner-border-width"],
            "--crm-ui-kit-spinner-circle-size": e["--crm-ui-kit-button-spinner-circle-size"],
            "--crm-ui-kit-spinner-border-style": e["--crm-ui-kit-button-spinner-border-style"]
          };
          return {
            defaultTheme: t,
            disabledTheme: {
              ...t,
              "--crm-ui-kit-spinner-border-color": e["--crm-ui-kit-button-spinner-disabled-border-color"]
            }
          }
        })(_)), [_]), T = (0, u.useShowInvalidAnimation)(g), O = (0, d.useShowSuccessfulState)(w);
        let A = null;
        switch (!0) {
          case O:
            A = (0, n.jsx)("span", {
              children: k || A
            });
            break;
          case h:
            A = (0, n.jsx)("span", {
              className: (0, a.c)("_spinner_container_5it8y_83"),
              children: (0, n.jsx)(l.Spinner, {
                theme: m ? P.disabledTheme : P.defaultTheme,
                isCentered: !0
              })
            });
            break;
          default:
            A = (0, n.jsxs)(i().Fragment, {
              children: [y && (0, n.jsx)("span", {
                className: (0, a.c)("_before_5it8y_73"),
                children: y
              }), (0, n.jsx)("span", {
                children: v
              }), b && (0, n.jsx)("span", {
                className: (0, a.c)("_after_5it8y_78"),
                children: b
              })]
            })
        }
        return (0, n.jsx)("button", {
          ...S,
          ref: t,
          type: f,
          onClick: e => {
            h || p(e)
          },
          className: (0, a.c)("_button_5it8y_17", E, r, {
            _invalid_5it8y_90: T,
            _success_5it8y_95: O,
            _disabled_5it8y_43: m
          }),
          disabled: m && !x,
          children: (0, n.jsx)("span", {
            className: (0, a.c)("_content_5it8y_65"),
            children: A
          })
        })
      }));
      f.displayName = "Button"
    },
    82442: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        ButtonNeutralTheme: () => o,
        ButtonPrimaryTheme: () => i,
        ButtonSecondaryTheme: () => a
      });
      const n = {
          "--crm-ui-kit-button-z-index": "1",
          "--crm-ui-kit-button-height": "36px",
          "--crm-ui-kit-button-elements-spacing": "4px",
          "--crm-ui-kit-button-font-size": "14px",
          "--crm-ui-kit-button-line-height": "14px",
          "--crm-ui-kit-button-font-weight": "bold",
          "--crm-ui-kit-button-sibling-element-spacing": "7px",
          "--crm-ui-kit-button-disabled-opacity": "var(--crm-ui-kit-disabled-opacity)",
          "--crm-ui-kit-button-padding": "0px 10px",
          "--crm-ui-kit-button-border-width": "1px",
          "--crm-ui-kit-button-border-style": "solid",
          "--crm-ui-kit-button-border-radius": "3px",
          "--crm-ui-kit-button-hover-border-width": "1px",
          "--crm-ui-kit-button-hover-border-style": "solid",
          "--crm-ui-kit-button-hover-border-radius": "3px",
          "--crm-ui-kit-button-success-color": "var(--crm-ui-kit-color-white)",
          "--crm-ui-kit-button-success-background-color": "var(--crm-ui-ki-color-mustard-yellow)",
          "--crm-ui-kit-button-success-hover-background-color": "var(--crm-ui-kit-color-amber)",
          "--crm-ui-kit-button-success-border-color": "var(--crm-ui-kit-color-goldenrod)",
          "--crm-ui-kit-button-spinner-border-color": "var(--crm-ui-kit-color-bright-blue)",
          "--crm-ui-kit-button-spinner-disabled-border-color": "var(--crm-ui-kit-color-bright-blue)",
          "--crm-ui-kit-button-spinner-border-width": "2px",
          "--crm-ui-kit-button-spinner-circle-size": "16px",
          "--crm-ui-kit-button-spinner-border-style": "solid"
        },
        o = {
          ...n,
          "--crm-ui-kit-button-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-button-border-color": "var(--crm-ui-kit-palette-border-primary)",
          "--crm-ui-kit-button-background-color": "var(--crm-ui-kit-palette-background-primary)",
          "--crm-ui-kit-button-disabled-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-button-disabled-background-color": "var(--crm-ui-kit-palette-background-primary)",
          "--crm-ui-kit-button-disabled-border-color": "var(--crm-ui-kit-palette-border-primary)",
          "--crm-ui-kit-button-hover-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-button-hover-background-color": "var(--crm-ui-kit-palette-button-classic-hover-background)",
          "--crm-ui-kit-button-hover-border-color": "var(--crm-ui-kit-palette-border-primary)"
        },
        i = {
          ...n,
          "--crm-ui-kit-button-color": "var(--crm-ui-kit-color-white)",
          "--crm-ui-kit-button-border-color": "var(--crm-ui-kit-color-cerulean-blue)",
          "--crm-ui-kit-button-disabled-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-button-disabled-background-color": "var(--crm-ui-kit-palette-background-primary)",
          "--crm-ui-kit-button-disabled-border-color": "var(--crm-ui-kit-palette-border-primary)",
          "--crm-ui-kit-button-background-color": "var(--crm-ui-kit-palette-active-element-900)",
          "--crm-ui-kit-button-hover-color": "var(--crm-ui-kit-color-white)",
          "--crm-ui-kit-button-hover-background-color": "var(--crm-ui-kit-color-azure-blue)",
          "--crm-ui-kit-button-hover-border-color": "var(--crm-ui-kit-color-cerulean-blue)",
          "--crm-ui-kit-button-spinner-border-color": "var(--crm-ui-kit-color-white)",
          "--crm-ui-kit-button-spinner-disabled-border-color": "var(--crm-ui-kit-color-bright-blue)"
        },
        a = {
          ...n,
          "--crm-ui-kit-button-height": "30px",
          "--crm-ui-kit-button-color": "var(--crm-ui-kit-palette-text-secondary-light)",
          "--crm-ui-kit-button-padding": "0px 8px",
          "--crm-ui-kit-button-border-color": "transparent",
          "--crm-ui-kit-button-background-color": "inherit",
          "--crm-ui-kit-button-disabled-color": "var(--crm-ui-kit-palette-text-secondary-light)",
          "--crm-ui-kit-button-disabled-background-color": "inherit",
          "--crm-ui-kit-button-disabled-border-color": "transparent",
          "--crm-ui-kit-button-hover-background-color": "inherit",
          "--crm-ui-kit-button-hover-border-color": "transparent",
          "--crm-ui-kit-button-hover-color": "var(--crm-ui-kit-palette-text-secondary-light)"
        }
    },
    303742: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        useShowInvalidAnimation: () => i
      });
      var n = r(827378),
        o = r(847306);
      const i = e => {
        const [t, r] = (0, n.useState)(!1);
        return (0, n.useEffect)((() => {
          e && (e.current = (e = o.noop) => {
            r(!0), setTimeout((() => {
              r(!1), e()
            }), 400)
          })
        }), [e]), t
      }
    },
    369757: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        useShowSuccessfulState: () => i
      });
      var n = r(827378),
        o = r(847306);
      const i = e => {
        const [t, r] = (0, n.useState)(!1);
        return (0, n.useEffect)((() => {
          e && (e.current = (e = o.noop) => {
            r(!0), setTimeout((() => {
              r(!1), e()
            }), 1500)
          })
        }), [e]), t
      }
    },
    529062: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        Button: () => n.Button,
        ButtonNeutralTheme: () => o.ButtonNeutralTheme,
        ButtonPrimaryTheme: () => o.ButtonPrimaryTheme,
        ButtonSecondaryTheme: () => o.ButtonSecondaryTheme
      });
      var n = r(830516),
        o = r(82442)
    },
    260391: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        Spinner: () => s
      });
      var n = r(824246),
        o = r(827378),
        i = r(22538),
        a = r(55436);
      r(865264);
      const s = (0, o.forwardRef)(((e, t) => {
        const {
          isCentered: r = !1,
          className: o = "",
          theme: s,
          ...c
        } = e, l = (0, a.useThemeClassName)(s);
        return (0, n.jsx)("span", {
          ref: t,
          className: (0, i.c)("_spinner_4ps24_11", {
            _centered_4ps24_29: r
          }, l, o),
          ...c
        })
      }));
      s.displayName = "Spinner"
    },
    901926: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        Text: () => c
      });
      var n = r(824246),
        o = r(827378),
        i = r(22538),
        a = r(55436);
      r(743760);
      const s = {
          s: "_s_1thgf_23",
          m: "_m_1thgf_28",
          ms: "_ms_1thgf_33",
          l: "_l_1thgf_13",
          xl: "_xl_1thgf_43"
        },
        c = (0, o.forwardRef)(((e, t) => {
          const {
            children: r,
            className: o = "",
            isEllipsis: c = !1,
            maxRows: l = 1,
            theme: u,
            style: d = {},
            size: f,
            ...p
          } = e, _ = (0, a.useThemeClassName)(u), h = l > 1;
          switch (f) {
            case "s":
            case "m":
            case "ms":
            case "l":
            case "xl":
              return (0, n.jsx)("span", {
                ref: t,
                style: {
                  ...h && {
                    WebkitLineClamp: l
                  },
                  ...d
                },
                className: (0, i.c)("_text_1thgf_1", s[f], _, o, {
                  _ellipsis_1thgf_7: c,
                  _line_clamp_1thgf_13: h
                }),
                ...p,
                children: r
              })
          }
          throw new Error("Unknown size was presented")
        }));
      c.displayName = "Text"
    },
    799591: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        TextBaseSizesTheme: () => n,
        TextErrorTheme: () => s,
        TextPrimaryTheme: () => o,
        TextSecondaryDarkTheme: () => a,
        TextSecondaryLightTheme: () => i
      });
      const n = {
          "--crm-ui-kit-text-size-s-font-size": "11px",
          "--crm-ui-kit-text-size-s-line-height": "15px",
          "--crm-ui-kit-text-size-m-font-size": "13px",
          "--crm-ui-kit-text-size-m-line-height": "20px",
          "--crm-ui-kit-text-size-ms-font-size": "13px",
          "--crm-ui-kit-text-size-ms-line-height": "15px",
          "--crm-ui-kit-text-size-l-font-size": "15px",
          "--crm-ui-kit-text-size-l-line-height": "20px",
          "--crm-ui-kit-text-size-xl-font-size": "18px",
          "--crm-ui-kit-text-size-xl-line-height": "24px"
        },
        o = {
          ...n,
          "--crm-ui-kit-text-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-text-font": "PT Sans"
        },
        i = {
          ...n,
          "--crm-ui-kit-text-color": "var(--crm-ui-kit-palette-text-secondary-light)",
          "--crm-ui-kit-text-font": "PT Sans"
        },
        a = {
          ...n,
          "--crm-ui-kit-text-color": "var(--crm-ui-kit-palette-text-secondary-dark)",
          "--crm-ui-kit-text-font": "PT Sans"
        },
        s = {
          ...n,
          "--crm-ui-kit-text-color": "var(--crm-ui-kit-color-error)",
          "--crm-ui-kit-text-font": "PT Sans"
        }
    },
    916569: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        Text: () => n.Text,
        TextErrorTheme: () => o.TextErrorTheme,
        TextPrimaryTheme: () => o.TextPrimaryTheme,
        TextSecondaryDarkTheme: () => o.TextSecondaryDarkTheme,
        TextSecondaryLightTheme: () => o.TextSecondaryLightTheme
      });
      var n = r(901926),
        o = r(799591)
    },
    55436: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        useThemeClassName: () => i
      });
      var n = r(827378);
      const o = new Map,
        i = e => {
          const [t, r] = (0, n.useState)("");
          return (0, n.useMemo)((() => {
            const t = o.get(e);
            if (t) r(t);
            else {
              const t = (e => {
                const t = `crm-ui-kit-theme-${((e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce(((e,t)=>e+((t&=63)<36?t.toString(36):t<62?(t-26).toString(36).toUpperCase():t>62?"-":"_")),""))(5)}`,
                  r = document.createElement("style"),
                  n = Object.entries(e).map((([e, t]) => `${e}: ${t};`)).join("\n  ");
                return r.textContent = `.${t} {\n  ${n}\n}`, document.head.appendChild(r), t
              })(e);
              o.set(e, t), r(t)
            }
          }), [e]), t
        }
    },
    847306: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        noop: () => n
      });
      const n = () => {}
    },
    567952: e => {
      function t(e) {
        return e && "object" == typeof e ? o(e) || i(e) ? e : n(e) ? function(e, t) {
          if (e.map) return e.map(t);
          for (var r = [], n = 0; n < e.length; n++) r.push(t(e[n], n));
          return r
        }(e, t) : function(e, t, r) {
          if (e.reduce) return e.reduce(t, r);
          for (var n = 0; n < e.length; n++) r = t(r, e[n]);
          return r
        }(s(e), (function(n, o) {
          return n[r(o)] = t(e[o]), n
        }), {}) : e
      }

      function r(e) {
        return e.replace(/[_.-](\w|$)/g, (function(e, t) {
          return t.toUpperCase()
        }))
      }
      e.exports = function(e) {
        return "string" == typeof e ? r(e) : t(e)
      };
      var n = Array.isArray || function(e) {
          return "[object Array]" === Object.prototype.toString.call(e)
        },
        o = function(e) {
          return "[object Date]" === Object.prototype.toString.call(e)
        },
        i = function(e) {
          return "[object RegExp]" === Object.prototype.toString.call(e)
        },
        a = Object.prototype.hasOwnProperty,
        s = Object.keys || function(e) {
          var t = [];
          for (var r in e) a.call(e, r) && t.push(r);
          return t
        }
    },
    292554: (e, t) => {
      var r;
      ! function() {
        "use strict";
        var n = {}.hasOwnProperty;

        function o() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var r = arguments[t];
            if (r) {
              var i = typeof r;
              if ("string" === i || "number" === i) e.push(this && this[r] || r);
              else if (Array.isArray(r)) e.push(o.apply(this, r));
              else if ("object" === i)
                if (r.toString === Object.prototype.toString)
                  for (var a in r) n.call(r, a) && r[a] && e.push(this && this[a] || a);
                else e.push(r.toString())
            }
          }
          return e.join(" ")
        }
        e.exports ? (o.default = o, e.exports = o) : void 0 === (r = function() {
          return o
        }.apply(t, [])) || (e.exports = r)
      }()
    },
    60042: (e, t) => {
      var r;
      ! function() {
        "use strict";
        var n = {}.hasOwnProperty;

        function o() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var r = arguments[t];
            if (r) {
              var i = typeof r;
              if ("string" === i || "number" === i) e.push(r);
              else if (Array.isArray(r)) {
                if (r.length) {
                  var a = o.apply(null, r);
                  a && e.push(a)
                }
              } else if ("object" === i)
                if (r.toString === Object.prototype.toString)
                  for (var s in r) n.call(r, s) && r[s] && e.push(s);
                else e.push(r.toString())
            }
          }
          return e.join(" ")
        }
        e.exports ? (o.default = o, e.exports = o) : void 0 === (r = function() {
          return o
        }.apply(t, [])) || (e.exports = r)
      }()
    },
    575049: e => {
      var t;
      window, t = function() {
        return function(e) {
          var t = {};

          function r(n) {
            if (t[n]) return t[n].exports;
            var o = t[n] = {
              i: n,
              l: !1,
              exports: {}
            };
            return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports
          }
          return r.m = e, r.c = t, r.d = function(e, t, n) {
            r.o(e, t) || Object.defineProperty(e, t, {
              enumerable: !0,
              get: n
            })
          }, r.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
              value: "Module"
            }), Object.defineProperty(e, "__esModule", {
              value: !0
            })
          }, r.t = function(e, t) {
            if (1 & t && (e = r(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var n = Object.create(null);
            if (r.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
              }), 2 & t && "string" != typeof e)
              for (var o in e) r.d(n, o, function(t) {
                return e[t]
              }.bind(null, o));
            return n
          }, r.n = function(e) {
            var t = e && e.__esModule ? function() {
              return e.default
            } : function() {
              return e
            };
            return r.d(t, "a", t), t
          }, r.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
          }, r.p = "", r(r.s = 0)
        }([function(e, t, r) {
          e.exports = r(1)
        }, function(e, t, r) {
          "use strict";
          r.r(t);
          var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
              return typeof e
            } : function(e) {
              return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = window.device,
            i = {},
            a = [];
          window.device = i;
          var s = window.document.documentElement,
            c = window.navigator.userAgent.toLowerCase(),
            l = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];

          function u(e) {
            return -1 !== c.indexOf(e)
          }

          function d(e) {
            return s.className.match(new RegExp(e, "i"))
          }

          function f(e) {
            var t = null;
            d(e) || (t = s.className.replace(/^\s+|\s+$/g, ""), s.className = t + " " + e)
          }

          function p(e) {
            d(e) && (s.className = s.className.replace(" " + e, ""))
          }

          function _() {
            i.landscape() ? (p("portrait"), f("landscape"), h("landscape")) : (p("landscape"), f("portrait"), h("portrait")), b()
          }

          function h(e) {
            for (var t in a) a[t](e)
          }
          i.macos = function() {
            return u("mac")
          }, i.ios = function() {
            return i.iphone() || i.ipod() || i.ipad()
          }, i.iphone = function() {
            return !i.windows() && u("iphone")
          }, i.ipod = function() {
            return u("ipod")
          }, i.ipad = function() {
            return u("ipad")
          }, i.android = function() {
            return !i.windows() && u("android")
          }, i.androidPhone = function() {
            return i.android() && u("mobile")
          }, i.androidTablet = function() {
            return i.android() && !u("mobile")
          }, i.blackberry = function() {
            return u("blackberry") || u("bb10") || u("rim")
          }, i.blackberryPhone = function() {
            return i.blackberry() && !u("tablet")
          }, i.blackberryTablet = function() {
            return i.blackberry() && u("tablet")
          }, i.windows = function() {
            return u("windows")
          }, i.windowsPhone = function() {
            return i.windows() && u("phone")
          }, i.windowsTablet = function() {
            return i.windows() && u("touch") && !i.windowsPhone()
          }, i.fxos = function() {
            return (u("(mobile") || u("(tablet")) && u(" rv:")
          }, i.fxosPhone = function() {
            return i.fxos() && u("mobile")
          }, i.fxosTablet = function() {
            return i.fxos() && u("tablet")
          }, i.meego = function() {
            return u("meego")
          }, i.cordova = function() {
            return window.cordova && "file:" === location.protocol
          }, i.nodeWebkit = function() {
            return "object" === n(window.process)
          }, i.mobile = function() {
            return i.androidPhone() || i.iphone() || i.ipod() || i.windowsPhone() || i.blackberryPhone() || i.fxosPhone() || i.meego()
          }, i.tablet = function() {
            return i.ipad() || i.androidTablet() || i.blackberryTablet() || i.windowsTablet() || i.fxosTablet()
          }, i.desktop = function() {
            return !i.tablet() && !i.mobile()
          }, i.television = function() {
            for (var e = 0; e < l.length;) {
              if (u(l[e])) return !0;
              e++
            }
            return !1
          }, i.portrait = function() {
            return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? screen.orientation.type.includes("portrait") : window.innerHeight / window.innerWidth > 1
          }, i.landscape = function() {
            return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? screen.orientation.type.includes("landscape") : window.innerHeight / window.innerWidth < 1
          }, i.noConflict = function() {
            return window.device = o, this
          }, i.ios() ? i.ipad() ? f("ios ipad tablet") : i.iphone() ? f("ios iphone mobile") : i.ipod() && f("ios ipod mobile") : i.macos() ? f("macos desktop") : i.android() ? i.androidTablet() ? f("android tablet") : f("android mobile") : i.blackberry() ? i.blackberryTablet() ? f("blackberry tablet") : f("blackberry mobile") : i.windows() ? i.windowsTablet() ? f("windows tablet") : i.windowsPhone() ? f("windows mobile") : f("windows desktop") : i.fxos() ? i.fxosTablet() ? f("fxos tablet") : f("fxos mobile") : i.meego() ? f("meego mobile") : i.nodeWebkit() ? f("node-webkit") : i.television() ? f("television") : i.desktop() && f("desktop"), i.cordova() && f("cordova"), i.onChangeOrientation = function(e) {
            "function" == typeof e && a.push(e)
          };
          var m = "resize";

          function y(e) {
            for (var t = 0; t < e.length; t++)
              if (i[e[t]]()) return e[t];
            return "unknown"
          }

          function b() {
            i.orientation = y(["portrait", "landscape"])
          }
          Object.prototype.hasOwnProperty.call(window, "onorientationchange") && (m = "orientationchange"), window.addEventListener ? window.addEventListener(m, _, !1) : window.attachEvent ? window.attachEvent(m, _) : window[m] = _, _(), i.type = y(["mobile", "tablet", "desktop"]), i.os = y(["ios", "iphone", "ipad", "ipod", "android", "blackberry", "windows", "fxos", "meego", "television"]), b(), t.default = i
        }]).default
      }, e.exports = t();
      var r = "device";
      window.define(r, (function() {
        var t = "undefined",
          r = typeof __webpack_exports__ === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof e === t ? void 0 : e.exports : __WEBPACK_AMD_DEFINE_RESULT__ : __webpack_exports__;
        return r && r.default || r
      })), window.require([r])
    },
    939035: (e, t, r) => {
      "use strict";
      r.r(t)
    },
    865264: (e, t, r) => {
      "use strict";
      r.r(t)
    },
    743760: (e, t, r) => {
      "use strict";
      r.r(t)
    },
    267651: function(e, t) {
      var r, n, o;
      ! function(i, a) {
        "use strict";
        n = [t], void 0 === (o = "function" == typeof(r = a) ? r.apply(t, n) : r) || (e.exports = o);
        var s = {};
        i.PubSub = s, a(s)
      }("object" == typeof window && window || this, (function(e) {
        "use strict";
        var t = {},
          r = -1;

        function n(e) {
          var t;
          for (t in e)
            if (e.hasOwnProperty(t)) return !0;
          return !1
        }

        function o(e, t, r) {
          try {
            e(t, r)
          } catch (e) {
            setTimeout(function(e) {
              return function() {
                throw e
              }
            }(e), 0)
          }
        }

        function i(e, t, r) {
          e(t, r)
        }

        function a(e, r, n, a) {
          var s, c = t[r],
            l = a ? i : o;
          if (t.hasOwnProperty(r))
            for (s in c) c.hasOwnProperty(s) && l(c[s], e, n)
        }

        function s(e, r, o, i) {
          var s = function(e, t, r) {
              return function() {
                var n = String(e),
                  o = n.lastIndexOf(".");
                for (a(e, e, t, r); - 1 !== o;) o = (n = n.substr(0, o)).lastIndexOf("."), a(e, n, t, r)
              }
            }(e, r, i),
            c = function(e) {
              for (var r = String(e), o = Boolean(t.hasOwnProperty(r) && n(t[r])), i = r.lastIndexOf("."); !o && -1 !== i;) i = (r = r.substr(0, i)).lastIndexOf("."), o = Boolean(t.hasOwnProperty(r) && n(t[r]));
              return o
            }(e);
          return !!c && (!0 === o ? s() : setTimeout(s, 0), !0)
        }
        e.publish = function(t, r) {
          return s(t, r, !1, e.immediateExceptions)
        }, e.publishSync = function(t, r) {
          return s(t, r, !0, e.immediateExceptions)
        }, e.subscribe = function(e, n) {
          if ("function" != typeof n) return !1;
          t.hasOwnProperty(e) || (t[e] = {});
          var o = "uid_" + String(++r);
          return t[e][o] = n, o
        }, e.clearAllSubscriptions = function() {
          t = {}
        }, e.clearSubscriptions = function(e) {
          var r;
          for (r in t) t.hasOwnProperty(r) && 0 === r.indexOf(e) && delete t[r]
        }, e.unsubscribe = function(e) {
          var r, n, o, i = "string" == typeof e && t.hasOwnProperty(e),
            a = !i && "string" == typeof e,
            s = "function" == typeof e,
            c = !1;
          if (!i) {
            for (r in t)
              if (t.hasOwnProperty(r)) {
                if (n = t[r], a && n[e]) {
                  delete n[e], c = e;
                  break
                }
                if (s)
                  for (o in n) n.hasOwnProperty(o) && n[o] === e && (delete n[o], c = !0)
              } return c
          }
          delete t[e]
        }
      }));
      var i = "pubsub";
      window.define(i, (function() {
        var t = "undefined",
          r = typeof __webpack_exports__ === t ? typeof o === t ? typeof e === t ? void 0 : e.exports : o : __webpack_exports__;
        return r && r.default || r
      })), window.require([i])
    },
    371426: (e, t, r) => {
      "use strict";
      var n = r(827378),
        o = Symbol.for("react.element"),
        i = Symbol.for("react.fragment"),
        a = Object.prototype.hasOwnProperty,
        s = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
        c = {
          key: !0,
          ref: !0,
          __self: !0,
          __source: !0
        };

      function l(e, t, r) {
        var n, i = {},
          l = null,
          u = null;
        for (n in void 0 !== r && (l = "" + r), void 0 !== t.key && (l = "" + t.key), void 0 !== t.ref && (u = t.ref), t) a.call(t, n) && !c.hasOwnProperty(n) && (i[n] = t[n]);
        if (e && e.defaultProps)
          for (n in t = e.defaultProps) void 0 === i[n] && (i[n] = t[n]);
        return {
          $$typeof: o,
          type: e,
          key: l,
          ref: u,
          props: i,
          _owner: s.current
        }
      }
      t.Fragment = i, t.jsx = l, t.jsxs = l
    },
    541535: (e, t) => {
      "use strict";
      var r = Symbol.for("react.element"),
        n = Symbol.for("react.portal"),
        o = Symbol.for("react.fragment"),
        i = Symbol.for("react.strict_mode"),
        a = Symbol.for("react.profiler"),
        s = Symbol.for("react.provider"),
        c = Symbol.for("react.context"),
        l = Symbol.for("react.forward_ref"),
        u = Symbol.for("react.suspense"),
        d = Symbol.for("react.memo"),
        f = Symbol.for("react.lazy"),
        p = Symbol.iterator,
        _ = {
          isMounted: function() {
            return !1
          },
          enqueueForceUpdate: function() {},
          enqueueReplaceState: function() {},
          enqueueSetState: function() {}
        },
        h = Object.assign,
        m = {};

      function y(e, t, r) {
        this.props = e, this.context = t, this.refs = m, this.updater = r || _
      }

      function b() {}

      function v(e, t, r) {
        this.props = e, this.context = t, this.refs = m, this.updater = r || _
      }
      y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
        if ("object" != typeof e && "function" != typeof e && null != e) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, e, t, "setState")
      }, y.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate")
      }, b.prototype = y.prototype;
      var g = v.prototype = new b;
      g.constructor = v, h(g, y.prototype), g.isPureReactComponent = !0;
      var w = Array.isArray,
        k = Object.prototype.hasOwnProperty,
        x = {
          current: null
        },
        S = {
          key: !0,
          ref: !0,
          __self: !0,
          __source: !0
        };

      function E(e, t, n) {
        var o, i = {},
          a = null,
          s = null;
        if (null != t)
          for (o in void 0 !== t.ref && (s = t.ref), void 0 !== t.key && (a = "" + t.key), t) k.call(t, o) && !S.hasOwnProperty(o) && (i[o] = t[o]);
        var c = arguments.length - 2;
        if (1 === c) i.children = n;
        else if (1 < c) {
          for (var l = Array(c), u = 0; u < c; u++) l[u] = arguments[u + 2];
          i.children = l
        }
        if (e && e.defaultProps)
          for (o in c = e.defaultProps) void 0 === i[o] && (i[o] = c[o]);
        return {
          $$typeof: r,
          type: e,
          key: a,
          ref: s,
          props: i,
          _owner: x.current
        }
      }

      function P(e) {
        return "object" == typeof e && null !== e && e.$$typeof === r
      }
      var T = /\/+/g;

      function O(e, t) {
        return "object" == typeof e && null !== e && null != e.key ? function(e) {
          var t = {
            "=": "=0",
            ":": "=2"
          };
          return "$" + e.replace(/[=:]/g, (function(e) {
            return t[e]
          }))
        }("" + e.key) : t.toString(36)
      }

      function A(e, t, o, i, a) {
        var s = typeof e;
        "undefined" !== s && "boolean" !== s || (e = null);
        var c = !1;
        if (null === e) c = !0;
        else switch (s) {
          case "string":
          case "number":
            c = !0;
            break;
          case "object":
            switch (e.$$typeof) {
              case r:
              case n:
                c = !0
            }
        }
        if (c) return a = a(c = e), e = "" === i ? "." + O(c, 0) : i, w(a) ? (o = "", null != e && (o = e.replace(T, "$&/") + "/"), A(a, t, o, "", (function(e) {
          return e
        }))) : null != a && (P(a) && (a = function(e, t) {
          return {
            $$typeof: r,
            type: e.type,
            key: t,
            ref: e.ref,
            props: e.props,
            _owner: e._owner
          }
        }(a, o + (!a.key || c && c.key === a.key ? "" : ("" + a.key).replace(T, "$&/") + "/") + e)), t.push(a)), 1;
        if (c = 0, i = "" === i ? "." : i + ":", w(e))
          for (var l = 0; l < e.length; l++) {
            var u = i + O(s = e[l], l);
            c += A(s, t, o, u, a)
          } else if (u = function(e) {
              return null === e || "object" != typeof e ? null : "function" == typeof(e = p && e[p] || e["@@iterator"]) ? e : null
            }(e), "function" == typeof u)
            for (e = u.call(e), l = 0; !(s = e.next()).done;) c += A(s = s.value, t, o, u = i + O(s, l++), a);
          else if ("object" === s) throw t = String(e), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
        return c
      }

      function j(e, t, r) {
        if (null == e) return e;
        var n = [],
          o = 0;
        return A(e, n, "", "", (function(e) {
          return t.call(r, e, o++)
        })), n
      }

      function C(e) {
        if (-1 === e._status) {
          var t = e._result;
          (t = t()).then((function(t) {
            0 !== e._status && -1 !== e._status || (e._status = 1, e._result = t)
          }), (function(t) {
            0 !== e._status && -1 !== e._status || (e._status = 2, e._result = t)
          })), -1 === e._status && (e._status = 0, e._result = t)
        }
        if (1 === e._status) return e._result.default;
        throw e._result
      }
      var R = {
          current: null
        },
        I = {
          transition: null
        },
        N = {
          ReactCurrentDispatcher: R,
          ReactCurrentBatchConfig: I,
          ReactCurrentOwner: x
        };
      t.Children = {
        map: j,
        forEach: function(e, t, r) {
          j(e, (function() {
            t.apply(this, arguments)
          }), r)
        },
        count: function(e) {
          var t = 0;
          return j(e, (function() {
            t++
          })), t
        },
        toArray: function(e) {
          return j(e, (function(e) {
            return e
          })) || []
        },
        only: function(e) {
          if (!P(e)) throw Error("React.Children.only expected to receive a single React element child.");
          return e
        }
      }, t.Component = y, t.Fragment = o, t.Profiler = a, t.PureComponent = v, t.StrictMode = i, t.Suspense = u, t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = N, t.cloneElement = function(e, t, n) {
        if (null == e) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
        var o = h({}, e.props),
          i = e.key,
          a = e.ref,
          s = e._owner;
        if (null != t) {
          if (void 0 !== t.ref && (a = t.ref, s = x.current), void 0 !== t.key && (i = "" + t.key), e.type && e.type.defaultProps) var c = e.type.defaultProps;
          for (l in t) k.call(t, l) && !S.hasOwnProperty(l) && (o[l] = void 0 === t[l] && void 0 !== c ? c[l] : t[l])
        }
        var l = arguments.length - 2;
        if (1 === l) o.children = n;
        else if (1 < l) {
          c = Array(l);
          for (var u = 0; u < l; u++) c[u] = arguments[u + 2];
          o.children = c
        }
        return {
          $$typeof: r,
          type: e.type,
          key: i,
          ref: a,
          props: o,
          _owner: s
        }
      }, t.createContext = function(e) {
        return (e = {
          $$typeof: c,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null
        }).Provider = {
          $$typeof: s,
          _context: e
        }, e.Consumer = e
      }, t.createElement = E, t.createFactory = function(e) {
        var t = E.bind(null, e);
        return t.type = e, t
      }, t.createRef = function() {
        return {
          current: null
        }
      }, t.forwardRef = function(e) {
        return {
          $$typeof: l,
          render: e
        }
      }, t.isValidElement = P, t.lazy = function(e) {
        return {
          $$typeof: f,
          _payload: {
            _status: -1,
            _result: e
          },
          _init: C
        }
      }, t.memo = function(e, t) {
        return {
          $$typeof: d,
          type: e,
          compare: void 0 === t ? null : t
        }
      }, t.startTransition = function(e) {
        var t = I.transition;
        I.transition = {};
        try {
          e()
        } finally {
          I.transition = t
        }
      }, t.unstable_act = function() {
        throw Error("act(...) is not supported in production builds of React.")
      }, t.useCallback = function(e, t) {
        return R.current.useCallback(e, t)
      }, t.useContext = function(e) {
        return R.current.useContext(e)
      }, t.useDebugValue = function() {}, t.useDeferredValue = function(e) {
        return R.current.useDeferredValue(e)
      }, t.useEffect = function(e, t) {
        return R.current.useEffect(e, t)
      }, t.useId = function() {
        return R.current.useId()
      }, t.useImperativeHandle = function(e, t, r) {
        return R.current.useImperativeHandle(e, t, r)
      }, t.useInsertionEffect = function(e, t) {
        return R.current.useInsertionEffect(e, t)
      }, t.useLayoutEffect = function(e, t) {
        return R.current.useLayoutEffect(e, t)
      }, t.useMemo = function(e, t) {
        return R.current.useMemo(e, t)
      }, t.useReducer = function(e, t, r) {
        return R.current.useReducer(e, t, r)
      }, t.useRef = function(e) {
        return R.current.useRef(e)
      }, t.useState = function(e) {
        return R.current.useState(e)
      }, t.useSyncExternalStore = function(e, t, r) {
        return R.current.useSyncExternalStore(e, t, r)
      }, t.useTransition = function() {
        return R.current.useTransition()
      }, t.version = "18.2.0"
    },
    827378: (e, t, r) => {
      "use strict";
      e.exports = r(541535)
    },
    824246: (e, t, r) => {
      "use strict";
      e.exports = r(371426)
    },
    623967: e => {
      e.exports = function e(n) {
        return n && "object" == typeof n ? t(n) || r(n) ? n : Array.isArray(n) ? n.map(e) : Object.keys(n).reduce((function(t, r) {
          return t[r[0].toLowerCase() + r.slice(1).replace(/([A-Z]+)/g, (function(e, t) {
            return "_" + t.toLowerCase()
          }))] = e(n[r]), t
        }), {}) : n
      };
      var t = function(e) {
          return "[object Date]" === Object.prototype.toString.call(e)
        },
        r = function(e) {
          return "[object RegExp]" === Object.prototype.toString.call(e)
        }
    },
    974839: function(e, t, r) {
      var n, o, i, a = r(629133);
      (function() {
        var s, c = {}.hasOwnProperty,
          l = function(e, t) {
            for (var r in t) c.call(t, r) && (e[r] = t[r]);

            function n() {
              this.constructor = e
            }
            return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
          };
        s = function(e, t) {
          return {
            Model: function(e) {
              function r(e, n) {
                r.__super__.constructor.call(this, this.parse(t.clone(e)), n)
              }
              return l(r, e), r.prototype.parse = function(e) {
                return null == e && (e = {}), this.links = e._links || {}, delete e._links, this.embedded = e._embedded || {}, delete e._embedded, e
              }, r.prototype.url = function() {
                var e, t;
                return (null != (e = this.links) && null != (t = e.self) ? t.href : void 0) || r.__super__.url.call(this)
              }, r.prototype.isNew = function() {
                var e;
                return !(null != (e = this.links) ? e.self : void 0)
              }, r
            }(e.Model),
            Collection: function(e) {
              function r(e, n) {
                t.isArray(e) || (e = this.parse(t.clone(e))), r.__super__.constructor.call(this, e, n)
              }
              return l(r, e), r.prototype.parse = function(e) {
                return null == e && (e = {}), this.links = e._links || {}, delete e._links, this.embedded = e._embedded || {}, delete e._embedded, this.attributes = e || {}, null != this.itemRel ? this.embedded[this.itemRel] : this.embedded.items
              }, r.prototype.reset = function(e, n) {
                return null == n && (n = {}), t.isArray(e) || (e = this.parse(t.clone(e))), n.parse = !1, r.__super__.reset.call(this, e, n)
              }, r.prototype.url = function() {
                var e, t;
                return null != (e = this.links) && null != (t = e.self) ? t.href : void 0
              }, r
            }(e.Collection)
          }
        }, (null !== r.amdD ? r.amdO : void 0) ? (o = [r(345839), r(629133)], void 0 === (i = "function" == typeof(n = s) ? n.apply(t, o) : n) || (e.exports = i)) : this.HAL = s(Backbone, a)
      }).call(this)
    },
    59372: (e, t, r) => {
      var n;
      ! function(e) {
        "use strict";
        if (!("ontouchstart" in window)) return !1;
        var t, r, n = [],
          o = {
            $these: [],
            touchstart_init: !1,
            touchmove_init: !1,
            class_name: ".custom-scroll:not(.js-nonbounce-skip)",
            event_name_space: ".custom-scroll:touch"
          },
          i = function(t, r, n) {
            return !!e(n).closest(t).length
          },
          a = function(e) {
            e = e.originalEvent || e, t = e.touches ? e.touches[0].screenY : e.screenY, r = e.touches ? e.touches[0].screenX : e.screenX
          },
          s = function(n) {
            n.originalEvent.touches && n.originalEvent.touches.length > 1 || (~e.inArray(!0, e.map(o.$these, i, n.target)) || n.preventDefault(), function(n) {
              var i = n.originalEvent.touches ? n.originalEvent.touches[0].screenY : n.originalEvent.screenY,
                a = n.originalEvent.touches ? n.originalEvent.touches[0].screenX : n.originalEvent.screenX,
                s = e(n.target).closest(o.class_name)[0];
              return !(s && ("y" == s.getAttribute("data-horizontal") ? !(Math.abs(t - i) < 10) || 0 === s.scrollLeft && r <= a || s.scrollWidth - s.offsetWidth === s.scrollLeft && r >= a : 0 === s.scrollTop && t <= i || s.scrollHeight - s.offsetHeight === s.scrollTop && t >= i))
            }(n) || n.preventDefault())
          },
          c = function(t) {
            o.$these.push(e(t))
          },
          l = new MutationObserver((function(t) {
            t.forEach((function(t) {
              "childList" === t.type && e.each(t.addedNodes, (function(e, t) {
                c(t)
              }))
            }))
          }));
        e.nonbounce = function(t, r) {
          var i;
          r = r || "default", "string" == typeof t && "destroy" === t ? (-1 !== (i = n.indexOf(r)) && n.splice(i, 1), n.length || (o = {
            $these: [],
            touchstart_init: !1,
            touchmove_init: !1,
            class_name: ".custom-scroll:not(.js-nonbounce-skip)",
            event_name_space: ".custom-scroll:touch"
          }, l.disconnect(), e(window).off(o.event_name_space))) : (n.push(r), 1 === n.length && (e.extend(o, t || {}), e(o.class_name).each((function() {
            c(this)
          })), l.observe(document.body, {
            childList: !0,
            subtree: !0
          }), o.touchstart_init || (o.touchstart_init = !0, e(window).on("touchstart" + o.event_name_space, a)), o.touchmove_init || (o.touchmove_init = !0, e(window).on("touchmove" + o.event_name_space, s))))
        }
      }(r(661533)), void 0 === (n = function() {}.call(t, r, t, e)) || (e.exports = n);
      var o = "vendor/nonbounce";
      window.define(o, (function() {
        var t = "undefined",
          r = typeof __webpack_exports__ === t ? typeof n === t ? typeof e === t ? void 0 : e.exports : n : __webpack_exports__;
        return r && r.default || r
      })), window.require([o])
    },
    323344: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        QStoJSON: () => d,
        getParam: () => p,
        getQueryParam: () => m,
        getQueryString: () => f,
        removeQueryParam: () => h,
        setParam: () => _,
        setQueryParam: () => y
      });
      var n = r(661533),
        o = r.n(n),
        i = r(629133),
        a = r.n(i),
        s = r(577486);

      function c(e, t) {
        return null != t && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? !!t[Symbol.hasInstance](e) : e instanceof t
      }

      function l(e) {
        return e.indexOf("?") >= 0 ? e.split("?")[1] : e
      }

      function u(e) {
        try {
          e = decodeURIComponent(e.toString().replace(/\+/gi, " "))
        } catch (t) {
          e = ""
        }
        return e.toString()
      }

      function d(e) {
        var t, r, n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return "string" == typeof e ? n ? function(e, t) {
          var r, n = {},
            i = l(e);
          return a().isObject(t) || (t = {
            to_arrays: !1
          }), i ? (o().each(i.split("&"), (function(e, o) {
            var i;
            o = o.split("=");
            try {
              o[0] = decodeURIComponent(o[0])
            } catch (e) {
              return console.error(e), n
            }
            if (void 0 !== n[o[0]]) c(n[o[0]], Array) ? n[o[0]].push(u(o[1] || "")) : (r = n[o[0]].toString(), n[o[0]] = [r, u(o[1] || "")]);
            else if (o[0].indexOf("[", 1) > 0) {
              (i = o[0].split("["))[i.length] = u(o[1]);
              var a = 0,
                s = function(e, r) {
                  if (a < r.length - 1)
                    if (r[a] = r[a].replace("]", ""), "" === r[a]) Object.keys(e).length ? e[Object.keys(e).length] = r[r.length - 1] : e[0] = r[r.length - 1];
                    else {
                      e[r[a]] = e[r[a]] || (t.to_arrays && "]" === r[a + 1] ? [] : {});
                      var n = e[r[a]];
                      ++a == r.length - 1 ? e[r[a - 1]] = r[a] : s(n, r)
                    }
                };
              s(n, i)
            } else n[o[0]] = function(e) {
              try {
                e = decodeURIComponent(e.toString().replace(/\+/gi, " "))
              } catch (t) {
                e = ""
              }
              try {
                return JSON.parse(e)
              } catch (t) {
                return e.toString()
              }
            }(o[1] || "")
          })), n) : n
        }(e, n) : function(e) {
          var t, r = {},
            n = l(e);
          if (!n) return r;
          try {
            o().each(n.split("&"), (function(e, n) {
              (n = n.split("="))[0] = decodeURIComponent(n[0]), void 0 === r[n[0]] ? r[n[0]] = u(n[1] || "") : c(r[n[0]], Array) ? r[n[0]].push(u(n[1] || "")) : (t = r[n[0]].toString(), r[n[0]] = [t, u(n[1] || "")])
            }))
          } catch (e) {
            return console.error(e), {}
          }
          return r
        }(e) : (t = e, r = [], a().each(t, (function(e, t) {
          "object" == typeof e ? a().each(e, (function(e, n) {
            r.push("".concat(t, "[").concat(isNaN(n, 10) ? n : "", "]=").concat(encodeURIComponent(e)))
          })) : r.push("".concat(t, "=").concat(encodeURIComponent(e)))
        })), r.join("&"))
      }

      function f() {
        var e = window.location.href.replace(/.*\?/, "").toString();
        return e === window.location.href && (e = ""), e || ""
      }

      function p(e) {
        var t, r = window.location.pathname || "",
          n = new s.UnsafeRegExp("".concat(e.toString(), "/([^\\/]+)"), "i");
        return !(!r.length || !(t = r.match(n)) || 2 !== t.length) && 0 | (t[1] || 1)
      }

      function _(e, t) {
        var r = window.location.pathname,
          n = f();
        return t = t || {}, a().each(e, (function(e, t) {
          p(t) ? r = r.replace(new s.UnsafeRegExp("(".concat(t, ")/([^/]?)+(/)?(.*)")), e && e.toString().length ? "$1/".concat(e, "/$4") : "$4") : e && e.toString().length && ("/" !== r.charAt(r.length - 1) && (r += "/"), r += "".concat(t, "/").concat(e, "/"))
        })), r + (!0 !== t.only_path && n.length ? "?".concat(n) : "")
      }

      function h(e, t) {
        var r, n = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).shouldDecodeValues,
          o = void 0 === n || n,
          i = ((a().isUndefined(t) ? f() : t.replace(/^\?/, "")).replace(/\+/g, " ") || "").split(/[&;]/g);
        a().isArray(e) || (e = [e]);
        try {
          a().each(e, (function(e, t) {
            for (r = "".concat(decodeURIComponent(e), "="), t = i.length; t-- > 0;) - 1 !== (o ? decodeURIComponent(i[t]) : i[t]).lastIndexOf(r, 0) && i.splice(t, 1)
          }))
        } catch (e) {
          console.error(e)
        }
        return t && 0 === t.indexOf("?") ? "?".concat(i.join("&")) : i.join("&")
      }

      function m(e) {
        var t = "?".concat(f().replace(/\[/g, "%5B").replace(/\]/g, "%5D"));
        e = e.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
        var r, n = "[\\?&]".concat(e, "=([^&#]*)"),
          o = new s.UnsafeRegExp(n).exec(t);
        if (a().isNull(o)) return !1;
        r = "phone" === e ? o[1] : o[1].replace(/\+/g, " ");
        try {
          r = decodeURIComponent(r)
        } catch (e) {
          return console.error(e), !1
        }
        return r
      }

      function y(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          r = window.location.pathname,
          n = a().isString(t.query_string) ? t.query_string : f();
        return 0 !== n.indexOf("?") && (n = "?".concat(n)), a().each(e, (function(e, t) {
          var r = "";
          if ("?" !== n && (r = -1 === n.indexOf("?") ? "?" : "&"), n = h(t, n), "object" == typeof e) n = "".concat(n + r + t, "=").concat(e.join("&".concat(t, "=")));
          else {
            e = encodeURIComponent(e);
            var o = new s.UnsafeRegExp("([?|&])".concat(t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "=.*?(&|$)"), "ig"),
              i = n.match(o);
            if (i)
              if (e) n = n.replace(o, "$1".concat(t, "=").concat(e, "$2"));
              else {
                var a = i[0],
                  c = a[0],
                  l = "";
                "&" === a[a.length - 1] && (l = c), n = n.replace(o, l)
              }
            else n += e ? "".concat(r + t, "=").concat(e) : ""
          }
        })), 0 !== n.indexOf("?") && (n = "?".concat(n)), !1 === t.question_mark && (n = n.replace(/^\?/, "")), (!0 === t.only_query_string ? "" : r) + ("?" === n ? "" : n.replace(/^\?&=?/, "?"))
      }
      var b = "../build/transpiled/common/urlparams";
      window.define(b, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([b])
    },
    304483: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        default: () => m
      });
      var n = r(661533),
        o = r.n(n),
        i = r(629133),
        a = r.n(i),
        s = r(460159),
        c = r.n(s),
        l = r(643095),
        u = r(313981),
        d = r(564638),
        f = r(500034),
        p = a().template('<div <% if (scrollerId) { %>id="<%= scrollerId %>"<% } %> class="modal-scroller custom-scroll"><div class="modal-body modal-body-loading <% if (float_animation) { %>modal-body-float-animation<% } %>"></div></div>'),
        _ = a().template('<div class="default-overlay modal-overlay <% if (!default_overlay) { %> modal-overlay--filled <% } %>"><span class="modal-overlay__spinner spinner-icon spinner-icon-abs-center"></span></div>'),
        h = (0, f.isFeatureAvailable)(f.Features.SYSTEM_NAVIGATION_V2);
      r(247267);
      const m = u.default.extend({
        className: "modal",
        _classes: function() {
          return {
            accept_button: "js-modal-accept",
            body: "modal-body",
            body_inner: "modal-body__inner",
            close_button: "modal-body__close",
            modal_error: "js-modal-error",
            overlay: "modal-overlay",
            scroller: "modal-scroller",
            try_again_button: "js-modal-try-again"
          }
        },
        _selectors: function() {
          return {
            cancel_button: ".modal-body__actions .button-cancel",
            overlay_spinner: ".modal-overlay .modal-overlay__spinner"
          }
        },
        events: function() {
          var e = a().result(u.default.prototype, "events", {});
          return e["click ".concat(this._selector("try_again_button"))] = "onModalTryAgainClick", e["click ".concat(this._selector("accept_button"))] = "onModalAcceptClick", e["click ".concat(this._selector("close_button"))] = "onModalCloseClick", e["click ".concat(this._selector("cancel_button"))] = "onModalCancelClick", e["click ".concat(this._selector("scroller"))] = "onModalScrollerClick", e["mousedown ".concat(this._selector("scroller"))] = "onModalScrollerMouseDown", e["modal:loaded ".concat(this._selector("body"))] = "onModalLoaded", e["modal:centrify ".concat(this._selector("body"))] = "onModalCentrify", e["modal:need-page-reload ".concat(this._selector("body"))] = "onPageReloadAfterModalClose", e
        },
        document_events: function() {
          return a().result(u.default.prototype, "document_events", {
            "page:changed": "onPageChanged",
            keydown: "onModalKeydown"
          })
        },
        _setOptions: function(e) {
          return this.options = o().extend({
            class_name: "modal-list",
            can_centrify: !1,
            init: a().noop,
            destroy: a().noop,
            tryAgain: a().noop,
            container: document.body,
            disable_overlay_click: !1,
            disable_escape_keydown: !1,
            disable_enter_keydown: !1,
            disable_overlay: !1,
            init_animation: !1,
            default_overlay: !1,
            preload_templates: [],
            focus_element: ".js-modal-accept",
            without_offsets_on_centify: !1,
            onBeforeInit: null,
            onModalPosition: null,
            scrollerId: null
          }, e || {}), this.disable_overlay_click = this.options.disable_overlay_click, this._orig_disable_overlay_click = this.disable_overlay_click, this
        },
        initialize: function(e) {
          var t = [];
          u.default.prototype.initialize.call(this), this._setOptions(e).render(), APP.is_touch_device && this.options.can_centrify && a().delay(a().bind(this.onModalCentrify, this), 500), this.options.disable_resize || this._$window.on("resize".concat(this.ns), a().throttle(a().bind(this.onModalCentrify, this), d.WINDOW_RESIZE_THROTTLE_DELAY)), this.delegateEvents();
          var r = a().bind(this.options.init, this, this._elem("body"));
          return this.options.preload_templates.length && t.push(c()._preload(this.options.preload_templates)()), this.options.onBeforeInit && t.push(this.options.onBeforeInit()), t.length ? Promise.all(t).then((function() {
            r()
          })) : r(), this
        },
        destroy: function() {
          if (this.$overlay.hasClass("permanent-overlay") || !1 === this.options.destroy() || this._destroyed) return !1;
          this._destroyed = !0, this.$overlay.trigger("overlay:hide", {
            callback: a().bind(u.default.prototype.destroy, this, !0)
          }), this._elem("body").remove(), this.options.need_page_reload && this._$document.trigger("page:reload")
        },
        setNS: function() {
          this.ns = ".modal:core.".concat(a().uniqueId("modal_"))
        },
        render: function() {
          return this.$el.addClass(this.options.class_name), h && this.$el.addClass("modal-list--over-nav"), this.$el.html(p({
            float_animation: this.options.init_animation,
            scrollerId: this.options.scrollerId || ""
          })), this.$modal = this.$el, this.$overlay = o()(_({
            default_overlay: this.options.default_overlay
          })), this.$el.append(this.$overlay), o()(this.options.container).append(this.$el), o()(".modal").length > 1 && this.$overlay.css(Modernizr.prefixed("transition"), "none"), this.options.disable_overlay || this.$overlay.trigger("overlay:show"), this.$el.find(this.options.focus_element).focus(), this.$el.prepareTransition(), this
        },
        onModalScrollerMouseDown: function(e) {
          e.target === this._elem("scroller").get(0) && (this._scroller_mousedown = !0, setTimeout((function() {
            self._scroller_mousedown = !1
          }), 100))
        },
        onModalAcceptClick: function() {
          this._elem("overlay_spinner").show()
        },
        onModalTryAgainClick: function() {
          this._elem("body").attr("class", this._orig_class_name_before_error_success).css("width", ""), this._orig_class_name_before_error_success = "", this._findElem("modal_error").remove(), this._findElem("body_inner").show(), this.onModalCentrify(), this.options.tryAgain.call(this)
        },
        onModalKeydown: function(e) {
          var t = o()(".modal:visible", document.body),
            r = o()(e.target);
          if (t.length && a().findIndex(t, (function(e) {
              return e.isSameNode(this.el)
            }), this) === t.length - 1) switch (e.keyCode) {
            case 13:
              if (this.options.disable_enter_keydown) return;
              r.closest(".modal").length && r.is(":input, [contenteditable]") && !t.hasClass("js-modal-confirm") || (r.blur(), e.stopImmediatePropagation(), this._findElem("accept_button").trigger("click"));
              break;
            case 27:
              this.disable_overlay_click || this.options.disable_escape_keydown || this.destroy()
          }
        },
        onModalCloseClick: function(e) {
          e.stopPropagation(), this.destroy()
        },
        onModalCancelClick: function(e) {
          this.options.disable_cancel_click || (this.destroy(), e.stopPropagation())
        },
        onModalScrollerClick: function(e) {
          var t = o()(e.target);
          (t.hasClass("modal-scroller") && this._scroller_mousedown && !this.disable_overlay_click || t.closest(".button-cancel").length && !this.options.disable_cancel_click) && this.destroy()
        },
        onPageChanged: function() {
          !1 !== this.options.can_destroy && this.destroy()
        },
        onModalLoaded: function() {
          this._elem("body").show().removeClass("modal-body-loading"), this._elem("overlay_spinner").hide()
        },
        onModalCentrify: function() {
          var e = this._$window.width() - 65;
          if (!this.$el.is(":hidden")) {
            this.onModalLoaded();
            var t = this._findElem("body"),
              r = t.get(0),
              n = r ? r.offsetHeight : 0,
              o = r ? r.parentNode.offsetHeight : 0,
              i = this.options.without_offsets_on_centify ? 0 : 130;
            if (a().isFunction(this.options.onModalPosition)) this.options.onModalPosition(t);
            else if (n < o - i) {
              var s = r.offsetWidth;
              t.css({
                marginTop: Math.ceil(-1 * (o / 2 - n / 2 + n)) + parseFloat(t.css("top")) % 1
              }).css({
                marginLeft: Math.floor(s / 2 * -1) + parseFloat(t.css("left")) % 1
              }).removeClass("modal-body-relative").removeClass("modal-body-relative--small-screen")
            } else t.addClass("modal-body-relative").css({
              marginTop: "",
              marginLeft: ""
            }), r && r.offsetWidth + 130 > e ? t.addClass("modal-body-relative--small-screen") : t.removeClass("modal-body-relative--small-screen");
            this.options.init_animation && t.prepareTransition().removeClass("modal-body-float-animation"), this.options.centrify_animation && this.centrifyAnimation()
          }
        },
        centrifyAnimation: function(e) {
          !1 === e ? this._elem("body").removeClass("modal-body-centrified") : (this._elem("body").offset(), this._elem("body").addClass("modal-body-centrified"))
        },
        show: function() {
          this.$el.show()
        },
        hide: function() {
          this.$el.hide()
        },
        getScroller: function() {
          return this._elem("scroller")
        },
        showError: c()._preload(["/tmpl/common/modal/error.twig"], "_showError"),
        _showError: function(e, t) {
          this._orig_class_name_before_error_success = this._elem("body").attr("class"), this.disable_overlay_click = this._orig_disable_overlay_click, t = !a().isBoolean(t) || t, this.centrifyAnimation(!1), this._elem("overlay_spinner").hide(), this._findElem("body_inner").hide(), this._elem("body").attr("class", this._class("body")).first().show().width(500).append(c()({
            ref: "/tmpl/common/modal/error.twig"
          }).render({
            text: e || !1,
            no_retry: !t
          })).trigger("modal:loaded").trigger("modal:centrify"), (0, l.sentryLogErrorModal)(e)
        },
        showSuccess: c()._preload(["/tmpl/common/modal/success.twig"], "_showSuccess"),
        _showSuccess: function(e, t, r) {
          this._orig_class_name_before_error_success = this._elem("body").attr("class"), this.disable_overlay_click = this._orig_disable_overlay_click, this.centrifyAnimation(!1), this._elem("overlay_spinner").hide(), this._findElem("body_inner").hide(), this._elem("body").first().attr("class", this._class("body")).show().width(500).append(c()({
            ref: "/tmpl/common/modal/success.twig"
          }).render({
            msg: e || !1
          })).trigger("modal:loaded").trigger("modal:centrify"), a().delay(a().bind((function() {
            this._elem("body").attr("class", this._orig_class_name_before_error_success), this._orig_class_name_before_error_success = "", this.destroy(), a().isFunction(t) && t()
          }), this), r || 500)
        },
        requestStart: function() {
          return this.disable_overlay_click = !0, this._elem("overlay_spinner").show(), this._elem("body").hide(), this
        },
        shakeError: function() {
          this.disable_overlay_click = this._orig_disable_overlay_click, this._elem("overlay_spinner").hide(), this._elem("body").one(APP.animation_event, a().bind((function(e) {
            o()(e.currentTarget).removeClass("animated shake")
          }), this)).addClass("animated shake")
        },
        onPageReloadAfterModalClose: function() {
          this.options.need_page_reload = !0
        }
      });
      var y = "../build/transpiled/components/base/modal";
      window.define(y, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([y])
    },
    366302: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        disallowedWidgetsRegExp: () => c
      });
      var n = r(971588),
        o = r(577486),
        i = ["amo_mailchimp", "mailchimp_kommo", "t57c8mssj0hf4lyfyefawyicehiykduabll1w3gt", "amo_1c_fresh", "amo_unf", "amo_tinkoffbacq", "amo_yakassa", "amo_sberbacq", "amo_alfabacq", "amo_twilio6", "mercado_libre", "linkedin_kommo", "wix_kommo", "lazada", "nuvemshop", "woocom", "shopify", "gotoconnect", "amo_rd_station", "amo_googledocsgenv2", "amo_docsgenv2_com", "paypal", "mercado_pago", "amo_dropbox", "amo_zoom", "amo_zapier", "dlzsz9jezzn3yicnojvtwddrip6anomozhrybv72", "amo_intercom", "amo_activecampaign", "amo_stripe", "amo_typeform", "lzawrqwjjathddycg8griw0lwx1bfaodscd4wfwh", "amo_jotform", "amo_ringcentral_vol2", "zenvia_voip", "nvoip", "amo_smsc", "amo_yametrika", "amo_new_moysklad", "avito_work", "amo_evotor", "amo_eskiz", "amo_lead_scraper", "amo_tranzaptorcom", "amo_asterisk", "amo_zendesk", "amo_ofd", "google_translator", "cloudtalk", "xf2tnprxxab1iax0sclmvrsbwcyazdoxywdgaj1b", "tokopedia", "api4com", "amo_aircall", n.default.WHATSAPP, n.default.WHATSAPP_WHITE, n.default.TIKTOK],
        a = "(".concat(i.join("|"), ")"),
        s = "\\/(upl|widgets)\\/(?!(".concat(a, ")\\/).*"),
        c = new o.UnsafeRegExp("".concat("https?:\\/\\/([^.]+\\.)?([^.]+\\.)?(amocrm2?\\.(saas|ru)|kommo2?\\.com)").concat(s))
    },
    643095: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        captureException: () => v,
        isDisallowedWidgetTraceDetected: () => m,
        sentryLogBrokenFeed: () => P,
        sentryLogErrorHandler: () => x,
        sentryLogErrorModal: () => w,
        sentryLogFailedGetAmojoToken: () => S,
        sentryLogSocketDisconnect: () => E,
        sentryLogSpaceError: () => k,
        sentryLogUserflowUpdateUserError: () => T,
        startBrowserTracingSpan: () => y
      });
      var n = r(661533),
        o = r.n(n),
        i = r(629133),
        a = r.n(i),
        s = r(998798),
        c = r(955026),
        l = r(366302);

      function u(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }

      function d(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function f(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {},
            n = Object.keys(r);
          "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
          })))), n.forEach((function(t) {
            d(e, t, r[t])
          }))
        }
        return e
      }
      var p = [],
        _ = [],
        h = {
          fatal: "fatal",
          error: "error",
          warning: "warning",
          log: "log",
          info: "info",
          debug: "debug"
        },
        m = function(e) {
          return l.disallowedWidgetsRegExp.test(e)
        };

      function y(e) {
        var t = e.entity;
        t && a().isFunction(window.sentryStartBrowserTracingSpan) && window.sentryStartBrowserTracingSpan({
          isPageLoad: APP.first_load,
          entity: t
        })
      }

      function b() {
        switch (!0) {
          case (0, s.isImboxSection)():
            return "imbox";
          case APP.isCard() && "leads" === APP.getBaseEntity():
            return "leads-card";
          case "leads-pipeline" === APP.data.current_entity:
            return "leads-pipeline";
          default:
            return "".concat(APP.getBaseEntity()).concat(APP.isCard() ? "-card" : "")
        }
      }

      function v(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          r = window.Sentry;
        r && navigator.onLine ? (p.length && g(), t.tags = a().defaults(t.tags || {}, {
          "manually-logged": !0
        }), r.captureException(e, t)) : (p.push([e, t]), (0, c.isDev)() && console.error("Sentry is offline, error pushed to queue:", e, t))
      }

      function g() {
        var e = p.slice(0);
        p = [], a().each(e, (function(e) {
          var t;
          v.apply(void 0, function(e) {
            if (Array.isArray(e)) return u(e)
          }(t = e) || function(e) {
            if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
          }(t) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return u(e, t);
              var r = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? u(e, t) : void 0
            }
          }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }())
        }))
      }

      function w(e) {
        var t = b(),
          r = new Error("Error modal showed - ".concat(t));
        r.stack && m(r.stack) || setTimeout((function() {
          v(r, {
            tags: {
              "oops-error.entity": t,
              "navigator.online": navigator.onLine,
              "message.empty": a().isEmpty(e)
            },
            extra: {
              "Error Message": e,
              "Last Ajaxes": _
            }
          }), _ = []
        }))
      }

      function k(e) {
        var t = e.errXHR,
          r = e.extra,
          n = void 0 === r ? {} : r;
        if (t) {
          var o = t.getResponseHeader("X-Request-Id"),
            i = t.status,
            a = t.responseText,
            s = b();
          v(new Error("Space error - ".concat(s)), {
            tags: {
              "space-error.entity": s,
              "navigator.online": navigator.onLine
            },
            extra: f({
              "Request Id": o,
              "Status Code": i,
              "Response Message": a
            }, n)
          })
        }
      }

      function x(e) {
        var t = e.errXHR,
          r = e.variant,
          n = e.extra,
          o = void 0 === n ? {} : n;
        if (t) {
          var i = t.status,
            a = t.responseText,
            s = t.getResponseHeader("X-Request-Id"),
            c = b();
          v(new Error("Error handler - ".concat(c)), {
            tags: {
              "error-handler.entity": c,
              "navigator.online": navigator.onLine,
              "handle.variant": r
            },
            extra: f({
              "Request Id": s,
              "Status Code": i,
              "Response Message": a
            }, o)
          })
        }
      }

      function S(e) {
        var t = e.responseJSON,
          r = void 0 === t ? {} : t,
          n = e.isNetworkError,
          o = void 0 !== n && n,
          i = APP.constant("account").subdomain,
          a = (r.response || {}).error,
          s = void 0 === a ? {
            error: ""
          } : a;
        v(new Error("Failed to receive amojo token"), {
          tags: {
            subdomain: i
          },
          extra: {
            "Error reason": o ? "Network error" : s
          }
        })
      }

      function E() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.reason,
          r = void 0 === t ? {} : t,
          n = e.socketName,
          o = void 0 === n ? "" : n,
          i = e.code,
          a = APP.constant("account").subdomain;
        v("Socket disconnected - ".concat(o), {
          tags: {
            subdomain: a,
            socket: o,
            "socket.error-code": i
          },
          extra: {
            "Disconnected reason": JSON.stringify(r),
            level: h.info
          }
        })
      }

      function P() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = b();
        v(new Error("Broken feed - ".concat(t, " ")), {
          tags: {
            "broken-feed.entity": t
          },
          extra: {
            Options: e
          }
        })
      }

      function T(e) {
        var t = e.responseJSON,
          r = APP.constant("account").subdomain,
          n = t.status,
          o = t.title;
        v(new Error("Userflow Update User Error"), {
          tags: {
            subdomain: r
          },
          extra: {
            "Response JSON": {
              status: n,
              title: o
            }
          }
        })
      }
      o()(document).on("ajaxError ajaxComplete", (function(e, t, r) {
        ! function(e, t) {
          var r = {
              url: t.url,
              requestId: e.getResponseHeader("X-Request-Id"),
              status: e.status
            },
            n = e.responseText;
          a().isString(n) && n.length && a().extend(r, {
            responseMessage: n
          }), _.push(r), _.length > 5 && _.shift()
        }(t, r)
      })), o()(window).on("online", g)
    },
    116028: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        default: () => l
      });
      var n, o, i = r(661533),
        a = r.n(i),
        s = (0, r(323344).getQueryParam)("beautifultimer");

      function c(e) {
        var t = e / 1e3,
          r = Math.abs(e % 1e3);
        return (t = t > 0 ? Math.floor(t) : Math.round(t)) < 10 && (t = (t < 0 ? "-" : "") + "0" + Math.abs(t)), r < 100 && "function" == typeof String(r).padStart && (r = String(r).padStart(3, "0")), t + "." + r
      }
      const l = {
        fix: function(e, t) {
          var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Date.now() - n;
          return s && null !== o && n && (a()("#mybeautifultimer").parent().append("<div>" + e + ": " + c(r) + "</div>"), t && t.append('<span class="animated tada" style="position:fixed;top:0;z-index:1000;background:#000;color:#fff;">' + c(r) + " " + e + "</span>")), this
        },
        start: function() {
          return s && (a()("#mybeautifultimer").parent().remove(), a()(document.body).append('\n        <div style="text-align:right;background:#000;color:#fff;position:fixed;top:0;right:0;z-index:110111010;padding:5px;">\n          <span id="mybeautifultimer"></span>\n        </div>\n      '), n = Date.now(), o = setInterval((function() {
            document.getElementById("mybeautifultimer").innerHTML = c(Date.now() - n)
          }), 1), this.fix("СТАРТ")), this
        },
        stop: function() {
          return s && null !== o && (clearInterval(o), a()("#mybeautifultimer").html(c(Date.now() - n)), o = null), this
        }
      };
      var u = "../build/transpiled/dev/timer";
      window.define(u, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([u])
    },
    19980: (e, t, r) => {
      "use strict";
      r.r(t);
      var n = r(661533),
        o = r.n(n),
        i = r(629133),
        a = r.n(i),
        s = r(575049),
        c = r.n(s),
        l = r(116028),
        u = r(323344),
        d = r(661533),
        f = document.documentElement,
        p = /^(https?:\/\/)?([0-9a-z\-.]{1,})(\.amocrm\.(ru|com)|\.amocrm2\.saas).*/i,
        _ = /^(https?:\/\/?[0-9a-z\-.]{1,}\.amocrm\.(ru|com)|\.amocrm2\.saas)?\/\w+\/(detail)\/.*/i;
      APP.controls = {}, APP.is_touch_device = c().tablet() && !c().windowsTablet() || c().mobile(), d.fn.reverse = [].reverse, d.fn.prepareTransition = function(e) {
        var t = o()(this);
        return a().isFunction(e) && t.length ? setTimeout((function() {
          e.call(t[0])
        }), 0) : d.contains(f, this) && t.offset(), t
      }, o()(document).on("page:back", (function() {
        APP.router.back()
      })).on("click", ".js-card-back-button, .js-back-button", (function(e) {
        e.preventDefault(), e.stopPropagation(), APP.router.back()
      })).on("click link:navigate", ".js-navigate-link", (function(e) {
        var t = o()(this).attr("href").toString().split("?");
        if (e.preventDefault(), e.stopPropagation(), l.default.start(), e.metaKey || e.ctrlKey) {
          var r = t[1] ? "?" + t[1] : "",
            n = t[0].match(_);
          n && "detail" === n[3] && (r = (0, u.setQueryParam)({
            compact: "yes"
          }, {
            only_query_string: !0,
            query_string: t[1] || ""
          }) || "");
          var i = window.open();
          i.opener = null, i.location = t[0] + r
        } else APP.router && APP.router.navigate(t.join("?"), {
          trigger: !0
        })
      })).on("click", 'a[target="_blank"]:not(.js-navigate-link)', (function() {
        var e = o()(this).attr("href");
        if ("/" !== e[0] && !p.test(e)) {
          var t = window.open();
          return t.opener = null, t.location = e, !1
        }
      })), o()((function() {
        o()("html").addClass("devicePixelRatio-" + window.devicePixelRatio).toggleClass("touch", APP.is_touch_device).toggleClass("no-touch", !APP.is_touch_device)
      }));
      var h = "../build/transpiled/interface/controls/common";
      window.define(h, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([h])
    },
    985543: (e, t, r) => {
      "use strict";
      r.r(t);
      var n = r(661533),
        o = r.n(n),
        i = r(629133),
        a = r.n(i),
        s = r(267651),
        c = r.n(s),
        l = r(982862),
        u = r(955026),
        d = r(661533);

      function f(e, t) {
        return null != t && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? !!t[Symbol.hasInstance](e) : e instanceof t
      }
      var p = o()(document),
        _ = {};

      function h() {
        var e = document.body;
        if (!parseInt(e.getAttribute("data-body-fixed")) && !APP.is_touch_device) {
          var t = _.getHolder();
          _.fixScroll(t, o()(e), !0)
        }
        e.setAttribute("data-body-fixed", ++_.overlay_stack), APP.is_touch_device ? (o().nonbounce("destroy"), o().nonbounce()) : e.style.overflow = "hidden"
      }

      function m() {
        var e = document.body;
        if (--_.overlay_stack, _.overlay_stack < 0 && (_.overlay_stack = 0), 0 === _.overlay_stack)
          if (APP.is_touch_device) o().nonbounce("destroy");
          else {
            var t = _.getHolder();
            e.style.overflow = "", _.fixScroll(t, o()(e))
          } e.setAttribute("data-body-fixed", _.overlay_stack), p.trigger("overlay:unfixed")
      }
      r(59372), r(19980), _.overlay_stack = 0, _.getHolder = function() {
        var e = o()("#page_holder");
        return "mail" === APP.getBaseEntity() && APP.data.is_card && (e = o()("#card_holder")), e.is(":hidden") ? {} : e
      }, _.show = function(e, t) {
        t && t.skip_fix || p.trigger("overlay:fix"), (e = f(e, d) ? e : o()(e)).prepareTransition().addClass("default-overlay-visible")
      }, _.hide = function(e, t) {
        t = t || {}, e = f(e, d) ? e : o()(e);
        var r = function() {
          a().isFunction(t.callback) && t.callback(), e.remove(), t && t.skip_fix || p.trigger("overlay:unfix")
        };
        t.instantly ? r() : (a().delay(r, 200), e.prepareTransition().addClass("default-overlay-fading"))
      }, _.checkScroll = function(e, t) {
        return e.outerHeight() > t.outerHeight()
      }, _.fixScroll = function(e, t, r) {
        var n = o()(".list__body-right__top"),
          i = n.length && (0, u.isV3Design)();
        if ("mail" === APP.getBaseEntity() && APP.data.is_card && (i = !0), e.length)
          if (r && _.checkScroll(e, t)) {
            var a = o()(window).scrollTop();
            e.css("overflow-y", "scroll").scrollTop(a), i && n.css("marginRight", l.scrollBarWidth + "px")
          } else e.css("overflow-y", "").scrollTop(0), i && n.css("marginRight", "")
      }, p.on("overlay:fix", h).on("overlay:unfix", m).on("touchmove", ".default-overlay", (function() {
        return !1
      })).on("overlay:show", ".default-overlay", (function(e, t) {
        _.show(this, t)
      })).on("overlay:hide", ".default-overlay", (function(e, t) {
        _.hide(this, t)
      })), c().subscribe("overlay:show", (function(e, t) {
        _.show(t.el, t.params)
      })), c().subscribe("overlay:hide", (function(e, t) {
        _.hide(t.el, t.params)
      })), c().subscribe("overlay:fix", h), c().subscribe("overlay:unfix", m);
      var y = "../build/transpiled/interface/controls/overlay";
      window.define(y, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([y])
    },
    27969: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        LeadSourceModel: () => d
      });
      var n = r(629133),
        o = r.n(n),
        i = r(345839),
        a = r(445368);

      function s(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
        }
      }

      function c(e) {
        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, c(e)
      }

      function l(e, t) {
        return l = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, l(e, t)
      }

      function u(e) {
        var t = function() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
          } catch (e) {
            return !1
          }
        }();
        return function() {
          var r, n = c(e);
          if (t) {
            var o = c(this).constructor;
            r = Reflect.construct(n, arguments, o)
          } else r = n.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((r = t) && "undefined" != typeof Symbol && r.constructor === Symbol ? "symbol" : typeof r) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var r
          }(this, r)
        }
      }
      var d = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && l(e, t)
        }(c, e);
        var t, r, n, i = u(c);

        function c() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, c), i.apply(this, arguments)
        }
        return t = c, n = [{
          key: "makeModelId",
          value: function(e) {
            var t = e.origin,
              r = e.source_id;
            return o().compact([t, r]).join(":")
          }
        }], (r = [{
          key: "getId",
          value: function() {
            return this.get("id")
          }
        }, {
          key: "getOrigin",
          value: function() {
            return this.get("_origin")
          }
        }, {
          key: "getOriginIconUrl",
          value: function() {
            return this.get("_origin_icon_url")
          }
        }, {
          key: "getSourceId",
          value: function() {
            return this.get("_source_id")
          }
        }, {
          key: "getOriginName",
          value: function() {
            return this.get("_origin_name")
          }
        }, {
          key: "getName",
          value: function() {
            return this.get("_source_name")
          }
        }, {
          key: "getWidgetName",
          value: function() {
            return this.get("_widget_name")
          }
        }, {
          key: "getScopeId",
          value: function() {
            return this.get("_scope_id")
          }
        }, {
          key: "getFormattedOriginName",
          value: function(e) {
            var t = e.with_widget_name,
              r = this.getOriginName() || (0, a.capitalize)(this.getOrigin()),
              n = this.getWidgetName();
            return n && t ? "".concat(r, " (").concat(n, ")") : r
          }
        }, {
          key: "getNameWithOrigin",
          value: function() {
            var e = this.getName(),
              t = this.getFormattedOriginName({
                with_widget_name: !1
              });
            return e ? "".concat(e, " (").concat(t, ")") : t
          }
        }]) && s(t.prototype, r), n && s(t, n), c
      }(i.Model)
    },
    656580: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        default: () => u
      });
      var n = r(629133),
        o = r.n(n),
        i = r(323344),
        a = r(661533),
        s = {},
        c = {};
      a(document).on("page:changed", (function() {
        s = {}, c = {}
      }));
      var l = function() {};
      o().extend(l.prototype, {
        getPipelines: function(e) {
          return !0 === e || o().isEmpty(s) ? (this._pipelines_xhr || (this._pipelines_xhr = a.ajax({
            url: "/ajax/v1/pipelines/list",
            type: "GET",
            dataType: "json"
          }).always(o().bind((function() {
            this._pipelines_xhr = null
          }), this)).then((function(e) {
            var t = e.response;
            return o().each(t.pipelines, (function(e) {
              e.statuses = o().sortBy(e.statuses, "sort")
            })), s = t, t
          }))), this._pipelines_xhr) : a.Deferred().resolve(s)
        },
        getPipelinesWithUnsorted: function(e) {
          return !0 === e || o().isEmpty(c) ? (this._pipelines_w_unsorted_xhr || (this._pipelines_w_unsorted_xhr = a.ajax({
            url: "/ajax/v1/pipelines/list?with_unsorted=true",
            type: "GET",
            dataType: "json"
          }).always(o().bind((function() {
            this._pipelines_w_unsorted_xhr = null
          }), this)).then((function(e) {
            var t = e.response;
            return o().each(t.pipelines, (function(e) {
              e.statuses = o().sortBy(e.statuses, "sort")
            })), c = t, t
          }))), this._pipelines_w_unsorted_xhr) : a.Deferred().resolve(c)
        },
        getLeadsByStatus: function(e, t) {
          var r = this;
          return e = e ? e + "/" : "", this._lbs_fetching = this._lbs_fetching || {}, t = t || (0, i.getQueryString)(), this._lbs_fetching[t] && 4 !== this._lbs_fetching[t].readyState || (this._lbs_fetching[t] = a.ajax({
            url: "/ajax/leads/sum/".concat(e),
            data: "leads_by_status=Y".concat((t.length ? "&" : "") + t),
            type: "POST"
          }).always((function() {
            delete r._lbs_fetching[t]
          }))), this._lbs_fetching[t]
        },
        getLossReasons: function() {
          return a.ajax({
            url: "/ajax/v3/loss_reasons"
          })
        },
        getLeadsCount: function(e) {
          return a.ajax({
            url: "/ajax/leads/sum/?pipeline_id=".concat(e),
            data: {
              leads_count: "Y"
            },
            type: "POST"
          })
        },
        getStatusesWithLeads: function(e, t) {
          return a.ajax({
            url: "/ajax/leads/sum/".concat(e),
            data: (r = {
              leads_by_status: "Y"
            }, n = "filter[pipe][".concat(e, "][]"), o = t, n in r ? Object.defineProperty(r, n, {
              value: o,
              enumerable: !0,
              configurable: !0,
              writable: !0
            }) : r[n] = o, r),
            type: "POST"
          });
          var r, n, o
        },
        getTriggersCount: function(e) {
          return a.ajax({
            url: "/ajax/leads/pipelines/".concat(e, "/triggers/count")
          })
        },
        getLeadDoubles: function(e) {
          return e ? a.ajax({
            url: "/ajax/v4/leads/doubles/".concat(e)
          }) : Promise.reject()
        },
        getListLeadsCount: function(e, t, r) {
          var n = "/ajax/leads/list/".concat(e ? "pipeline/".concat(e) : "", "?only_count=Y").concat(r ? "&".concat(r) : "").concat(t ? "&SHOW_DELETED=Y" : "");
          return a.ajax({
            url: n,
            type: "GET"
          })
        },
        saveStatuses: function(e, t) {
          return a.ajax({
            url: "/ajax/leads/pipelines/".concat(t, "/statuses"),
            type: "POST",
            dataType: "text",
            contentType: "application/json",
            data: JSON.stringify({
              statuses: e
            })
          })
        }
      });
      const u = new l;
      var d = "../build/transpiled/network/leads/api";
      window.define(d, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([d])
    },
    859200: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        RIGHTS_DENIED: () => p,
        RIGHTS_FULL: () => u,
        RIGHTS_GROUP: () => d,
        RIGHTS_LINKED: () => _,
        RIGHTS_MAIN: () => f,
        canCatalog: () => x,
        canDeleteCard: () => k,
        canEditCard: () => w,
        canImport: () => T,
        canTask: () => E,
        canViewLead: () => O,
        getContactsMergedRights: () => P,
        getRights: () => m,
        groupMatesIDs: () => v,
        hasRestrictedFieldAccess: () => S,
        isAdmin: () => y,
        isFromCard: () => g,
        refreshCache: () => h,
        userID: () => b
      });
      var n = r(629133),
        o = r.n(n),
        i = r(866633),
        a = r(926168),
        s = r(214558),
        c = null;

      function l(e, t) {
        var r = c;
        return null === r || o().isUndefined(e) || (r = o().has(r, e) ? r[e] : null, t && (r = o().has(r, t) ? r[t] : null)), r
      }
      var u = "A",
        d = "G",
        f = "M",
        p = "D",
        _ = "L",
        h = function() {
          var e, t = APP.constant("user_rights");
          if (t) {
            e = ["add", "add_company", "has_multi", "view_company", "merge", "view", "edit", "add_task", "change_status", "change_field", "reassign", "delete", "manage_tags", "import", "export", "can_save", "copy"], (c = c || {}).contacts = o().extend({}, c.contacts, t.contacts, t.contacts.CONTACT || {}), c.contacts = o().pick(c.contacts, e), e = ["add_company", "has_multi", "view_company", "merge", "view", "edit", "add_task", "change_status", "change_field", "reassign", "delete", "manage_tags", "add", "import", "export", "can_save", "copy"], c.companies = o().extend({}, c.companies, t.companies, t.contacts.COMPANY || {}), c.companies = o().pick(c.companies, e), o().each({
              leads: ["view", "edit", "change_status", "change_field", "reassign", "add_task", "delete", "manage_tags", "add", "import", "export", "has_multi", "merge", "can_save", "can_delete"],
              todo: ["delete", "open", "close", "reassign", "change_task_date", "change_task_type_in_list"],
              tasks: ["edit", "delete"],
              unsorted: ["accept", "decline", "denied"],
              customers: ["view", "export", "edit", "add", "delete", "reassign", "has_multi", "add_task", "change_field", "manage_tags"],
              tags: ["add"],
              files: ["view", "delete"],
              mail: ["add_contacts", "add_customers", "add_leads", "delete_thread", "mailing", "multi_read", "resend", "reply", "restore_thread"],
              "contacts-trash": ["restore"],
              "leads-trash": ["restore"],
              "todo-trash": ["restore"],
              "files-trash": ["restore"],
              users: ["change_group", "change_role", "deactivate", "activate", "delete", "email_confirm"],
              helpbot: ["delete", "activate", "deactivate"],
              helpbot_dataset: ["delete"],
              reply_templates: ["delete"],
              broadcasting_scheduled: ["delete", "copy"],
              broadcasting_in_progress: ["stop"],
              broadcasting_draft: ["delete"],
              broadcasting_completed: ["delete", "copy"],
              bots_list: ["delete", "copy", "deactivate_bot", "activate_bot", "stop_bot", "reset_bot", "export_bot"],
              onlinechats_list: ["delete"],
              bots_list_marketing: ["delete", "copy", "deactivate_bot", "activate_bot", "stop_bot", "reset_bot", "export_bot"],
              operday_report: ["delete"],
              cleaning_rules_list: ["delete"],
              restricted_fields: ["leads", "customers", "contacts", "companies"]
            }, (function(e, r) {
              c[r] = o().extend({}, c[r], t[r]), c[r] = o().pick(c[r], e)
            })), c.is_admin = !!t.is_admin, c.is_free_user = !!t.is_free_user, c.mail_admin = !!t.mail_admin, c.duplicate_search = !!t.duplicate_search, c.base_rights = t.base_rights || {}, c.status_rights = t.status_rights || {}, c.catalog_rights = t.catalog_rights || {}, c.catalogs = t.catalogs || {}, c.oper_day_user_tracking = t.oper_day_user_tracking, c.oper_day_reports_view_access = t.oper_day_reports_view_access;
            var r = APP.constant("user");
            e = ["id", "group_mates_ids"], c.user = o().extend({}, c.user, o().pick(r, e)), c.user.id = parseInt(c.user.id)
          }
        },
        m = function(e, t, r) {
          var n;
          return c && !0 !== r || h(), null === (n = l(e, t)) && (h(), n = l(e, t)), n
        },
        y = function() {
          return !!m("is_admin")
        },
        b = function() {
          return m("user", "id")
        },
        v = function() {
          return m("user", "group_mates_ids")
        },
        g = function() {
          return APP.data.current_card && APP.data.current_card.id > 0 && APP.data.current_card.element_type > 0
        },
        w = function() {
          return m(APP.data.current_entity, "can_save", !0) || "customers" === APP.data.current_entity && APP.constant("grant_edit")
        },
        k = function() {
          return m(APP.data.current_entity, "can_delete", !0) || "customers" === APP.data.current_entity && APP.constant("grant_delete")
        },
        x = function(e, t, r) {
          var n, a, s;
          return APP.constant("account").pay_type !== i.PayType.PAYMENT_TYPE_BLOCK && (y() ? s = !0 : (r = !!o().isUndefined(r) && g(), n = (m("catalog_rights")[t] || {})[e] || p, a = r ? [u, _] : [u], s = -1 !== o().indexOf(a, n), r && n === _ && ("edit" === e ? s = s && w() : "delete" === e && (s = s && k()))), s)
        },
        S = function(e, t, r) {
          var n = m("restricted_fields", t) || [];
          return r = r || "edit", !!n[e] && !1 === o().propertyOf(n)([e, r])
        },
        E = function(e, t, r) {
          var n, i, c, l, p, _, h = t.element_type || APP.element_types.todo,
            b = (0, a.convertElementType)(h, "string"),
            v = null,
            g = !1,
            w = (0, s.current)().id;
          if (r = r || {}, "todos" === b && (b = "tasks"), y()) g = !0;
          else switch (i = h === APP.element_types.todo ? Number(t.responsible_user_id) : Number(r.responsible_user_id), h === APP.element_types.leads && (n = m("status_rights"), p = r.pipeline_id || 0, _ = r.status_id || 0, v = o().propertyOf(n)([p, _]) || null), null === v && (v = m("base_rights", b)), v[e]) {
            case u:
              g = !0;
              break;
            case f:
              g = w && w === i;
              break;
            case d:
              c = (0, s.get)(!0)[w] || {}, l = (0, s.get)(!0)[i] || {}, g = !o().isEmpty(c) && !o().isEmpty(l) && c.group === l.group
          }
          return g
        },
        P = function() {
          var e = {};
          h();
          var t = m("contacts"),
            r = m("companies");
          return o().each(o().keys(t), (function(n) {
            e[n] = t[n] && r[n]
          })), e
        },
        T = function() {
          return m("leads", "import") || m("contacts", "import") || m("company", "import")
        },
        O = function(e, t) {
          if (y()) return !0;
          var r = m("status_rights");
          if (0 === t) {
            var n = o().keys(r);
            t = parseInt(o().first(n))
          }
          var i = o().propertyOf(r)([t, e, "view"]);
          return i === u || o().isUndefined(i)
        },
        A = "../build/transpiled/utils/account/rights";
      window.define(A, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([A])
    },
    464702: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        default: () => o,
        getCDNPath: () => n
      });
      var n = function(e) {
        return APP.static_build_domain + e
      };
      const o = {
        getCDNPath: n
      };
      var i = "../build/transpiled/utils/cdn";
      window.define(i, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([i])
    },
    982862: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        getImboxOverlayWidth: () => p,
        getScrollBarWidth: () => f,
        getShortText: () => d,
        getTextWidth: () => u,
        replaceHtml: () => _,
        scrollBarWidth: () => h,
        setCursorPosition: () => l
      });
      var n = r(629133),
        o = r.n(n),
        i = r(661533),
        a = r(661533),
        s = document.createElement("canvas"),
        c = {},
        l = function(e, t, r) {
          var n, o;
          if (n = e, (null != (o = i) && "undefined" != typeof Symbol && o[Symbol.hasInstance] ? o[Symbol.hasInstance](n) : n instanceof o) && (e = e.get(0)), e.setSelectionRange) t = t || 2 * (e.value || "").length, e.focus(), e.setSelectionRange(t, t);
          else if (e.getAttribute("contenteditable") && "false" !== e.contentEditable) {
            var a = document.createRange(),
              s = window.getSelection();
            if (t = t || e.innerText.length, r) a.setStart(r, t), a.setEnd(r, t);
            else {
              var c = function(e) {
                var t, r;
                for (r = 0; r < (e.childNodes || []).length; r++)
                  if (3 === e.childNodes[r].nodeType) {
                    t = e.childNodes[r];
                    break
                  } return t || e
              }(e);
              a.setStart(c, t), a.setEnd(c, t)
            }
            s.removeAllRanges(), s.addRange(a)
          }
        },
        u = function(e, t) {
          var r = s.getContext("2d");
          return t = t || 'normal 15px "PT Sans"', r.font = t, r.measureText(e).width
        },
        d = function(e, t) {
          var r = e.substring(0, e.length / 2),
            n = e.substring(e.length / 2, e.length),
            o = "".concat(r, "...").concat(n);
          if (u(o) <= t) return e;
          for (; u(o) > t;) r = r.substring(0, r.length - 1), n = n.substring(1, n.length), o = "".concat(r, "...").concat(n);
          return o
        },
        f = function(e) {
          var t, r, n, o;
          return c[e] || ((t = document.createElement("div")).style.visibility = "hidden", t.style.width = "100px", document.body.appendChild(t), r = t.offsetWidth, t.style.overflow = "scroll", t.className = e || "", (o = document.createElement("div")).style.width = "100%", t.appendChild(o), n = o.offsetWidth, t.parentNode.removeChild(t), c[e] = r - n), c[e]
        },
        p = function() {
          var e = a(window).width() - 65,
            t = o().propertyOf(APP.constant("user"))(["settings", "layout_width", "talks", "width"]) || 0,
            r = Math.round(e * (t / 100));
          return .3 * Math.max(r, 370)
        },
        _ = function(e, t) {
          var r, n = "string" == typeof e ? document.getElementById(e) : e;
          if (!n) return null;
          var o = n.cloneNode(!1);
          o.innerHTML = t;
          var i = n.querySelector("#search-options"),
            s = o.querySelector("#search-options");
          if (s && i && i.parentNode && a(i.parentNode).hasClass("list-top-search-options-showed") && window.location.search && s.parentNode) {
            var c = s.parentNode.querySelector("#search_clear_button");
            c && (c.style.display = "block"), a(s.parentNode).addClass("list-top-search-options-showed"), s.parentNode.replaceChild(i, s)
          }
          return null === (r = n.parentNode) || void 0 === r || r.replaceChild(o, n), o
        },
        h = f() || 0,
        m = "../build/transpiled/utils/dom_ops";
      window.define(m, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([m])
    },
    971588: (e, t, r) => {
      "use strict";
      var n;
      r.r(t), r.d(t, {
          default: () => o
        }),
        function(e) {
          e.FACEBOOK = "facebook", e.MESSENGER = "messenger", e.INSTAGRAM_BUSINESS = "instagram_business", e.INSTAGRAM = "instagram", e.WHATSAPP = "amocrm_whatsapp", e.WHATSAPP_WHITE = "whatsapp_cloud_api", e.TELEGRAM = "telegram", e.TIKTOK = "tiktok_kommo"
        }(n || (n = {}));
      const o = n
    },
    564638: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        WINDOW_RESIZE_THROTTLE_DELAY: () => n
      });
      var n = 10
    },
    770086: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        default: () => u
      });
      var n = r(827378),
        o = r(629133),
        i = r.n(o),
        a = r(438089),
        s = r(617861),
        c = r(827378),
        l = function(e) {
          var t = e.children,
            r = e.isTryAgainAvailable,
            o = e.onTryAgainClick,
            a = e.onCloseRequest,
            l = void 0 === a ? i().noop : a,
            u = (0, s.default)(),
            d = u.ModalProvider,
            f = u.showError;
          return (0, n.useEffect)((function() {
            f(t, r)
          }), []), c.createElement(d, {
            onTryAgainClick: function() {
              o()
            },
            onCloseRequest: function() {
              l()
            }
          }, c.createElement(c.Fragment, null))
        };
      const u = function(e) {
        var t = e.isOpened,
          r = e.children,
          o = e.onCloseRequest,
          s = e.isTryAgainAvailable,
          c = void 0 === s || s,
          u = e.onTryAgainClick,
          d = void 0 === u ? i().noop : u,
          f = (0, a.default)(l, {
            children: r,
            isTryAgainAvailable: c,
            onTryAgainClick: d,
            onCloseRequest: o
          }),
          p = f.showModal,
          _ = f.hideModal,
          h = f.modalElement;
        return (0, n.useEffect)((function() {
          t ? p() : _()
        }), [t]), h
      }
    },
    701106: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        default: () => l
      });
      var n = r(827378),
        o = r.n(n),
        i = r(60042),
        a = r.n(i);

      function s(e, t, r) {
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
            s(e, t, r[t])
          }))
        }
        return e
      }
      const l = function(e) {
        var t = e.children,
          r = e.type,
          n = e.size,
          i = e.className,
          s = void 0 === i ? "" : i,
          l = e.weight,
          u = e.isCaption,
          d = function(e, t) {
            if (null == e) return {};
            var r, n, o = function(e, t) {
              if (null == e) return {};
              var r, n, o = {},
                i = Object.keys(e);
              for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || (o[r] = e[r]);
              return o
            }(e, t);
            if (Object.getOwnPropertySymbols) {
              var i = Object.getOwnPropertySymbols(e);
              for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || Object.prototype.propertyIsEnumerable.call(e, r) && (o[r] = e[r])
            }
            return o
          }(e, ["children", "type", "size", "className", "weight", "isCaption"]),
          f = "".concat(a()("ui-title", "ui-title--".concat(n), {
            "ui-title--caption": u,
            "weight-normal": "normal" === l
          }), " ").concat(s);
        switch (r) {
          case "h1":
            return o().createElement("h1", c({
              className: f
            }, d), t);
          case "h2":
            return o().createElement("h2", c({
              className: f
            }, d), t);
          case "h3":
            return o().createElement("h3", c({
              className: f
            }, d), t);
          case "h4":
            return o().createElement("h4", c({
              className: f
            }, d), t)
        }
        throw new Error('Unknown type was presented - "'.concat(r, '".'))
      }
    },
    104737: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, {
        default: () => p
      });
      var n = r(661533),
        o = r.n(n),
        i = r(629133),
        a = r.n(i),
        s = r(623967),
        c = r.n(s),
        l = r(567952),
        u = r.n(l);

      function d(e, t, r, n, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value
        } catch (e) {
          return void r(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(n, o)
      }

      function f(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }
      const p = {
        request: function(e) {
          return (t = function() {
            var t, r, n;
            return function(e, t) {
              var r, n, o, i, a = {
                label: 0,
                sent: function() {
                  if (1 & o[0]) throw o[1];
                  return o[1]
                },
                trys: [],
                ops: []
              };
              return i = {
                next: s(0),
                throw: s(1),
                return: s(2)
              }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
                return this
              }), i;

              function s(i) {
                return function(s) {
                  return function(i) {
                    if (r) throw new TypeError("Generator is already executing.");
                    for (; a;) try {
                      if (r = 1, n && (o = 2 & i[0] ? n.return : i[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) && !(o = o.call(n, i[1])).done) return o;
                      switch (n = 0, o && (i = [2 & i[0], o.value]), i[0]) {
                        case 0:
                        case 1:
                          o = i;
                          break;
                        case 4:
                          return a.label++, {
                            value: i[1],
                            done: !1
                          };
                        case 5:
                          a.label++, n = i[1], i = [0];
                          continue;
                        case 7:
                          i = a.ops.pop(), a.trys.pop();
                          continue;
                        default:
                          if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                            a = 0;
                            continue
                          }
                          if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
                            a.label = i[1];
                            break
                          }
                          if (6 === i[0] && a.label < o[1]) {
                            a.label = o[1], o = i;
                            break
                          }
                          if (o && a.label < o[2]) {
                            a.label = o[2], a.ops.push(i);
                            break
                          }
                          o[2] && a.ops.pop(), a.trys.pop();
                          continue
                      }
                      i = t.call(e, a)
                    } catch (e) {
                      i = [6, e], n = 0
                    } finally {
                      r = o = 0
                    }
                    if (5 & i[0]) throw i[1];
                    return {
                      value: i[0] ? i[1] : void 0,
                      done: !0
                    }
                  }([i, s])
                }
              }
            }(this, (function(i) {
              switch (i.label) {
                case 0:
                  return t = function(e) {
                    var t = e.url,
                      r = e.data,
                      n = e.method,
                      o = void 0 === n ? "GET" : n,
                      i = e.contentType,
                      s = e.processData,
                      l = void 0 === s || s,
                      u = e.dataType,
                      d = e.isFormDataPayload,
                      f = e.isFilePayload,
                      p = e.shouldSnakeize,
                      _ = void 0 === p || p,
                      h = e.xhrFields,
                      m = e.crossDomain,
                      y = e.headers,
                      b = e.xhr,
                      v = e.beforeSend,
                      g = _ ? c()(r) : r,
                      w = f ? new FormData : null;
                    return w && a().each(g, (function(e, t) {
                      "files" === t ? a().each(e, (function(e, t) {
                        w.append(t, e)
                      })) : w.append(t, e)
                    })), d ? {
                      url: t,
                      data: f ? w : g,
                      contentType: i,
                      processData: l,
                      dataType: u,
                      xhrFields: h,
                      crossDomain: m,
                      xhr: b,
                      beforeSend: v,
                      headers: y,
                      method: o
                    } : {
                      url: t,
                      contentType: i || "application/json",
                      data: "GET" === o ? g : JSON.stringify(g),
                      processData: l,
                      dataType: u,
                      xhrFields: h,
                      crossDomain: m,
                      xhr: b,
                      beforeSend: v,
                      headers: y,
                      method: o
                    }
                  }((s = function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                      var r = null != arguments[t] ? arguments[t] : {},
                        n = Object.keys(r);
                      "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
                        return Object.getOwnPropertyDescriptor(r, e).enumerable
                      })))), n.forEach((function(t) {
                        f(e, t, r[t])
                      }))
                    }
                    return e
                  }({}, e), l = null != (l = {
                    shouldCamelizeResponse: void 0
                  }) ? l : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(l)) : function(e, t) {
                    var r = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                      var n = Object.getOwnPropertySymbols(e);
                      r.push.apply(r, n)
                    }
                    return r
                  }(Object(l)).forEach((function(e) {
                    Object.defineProperty(s, e, Object.getOwnPropertyDescriptor(l, e))
                  })), s)), [4, o().ajaxPromisify(t)];
                case 1:
                  return r = i.sent(), [2, void 0 === (n = e.shouldCamelizeResponse) || n ? u()(r) : r]
              }
              var s, l
            }))
          }, function() {
            var e = this,
              r = arguments;
            return new Promise((function(n, o) {
              var i = t.apply(e, r);

              function a(e) {
                d(i, n, o, a, s, "next", e)
              }

              function s(e) {
                d(i, n, o, a, s, "throw", e)
              }
              a(void 0)
            }))
          })();
          var t
        }
      }
    },
    22538: (e, t, r) => {
      "use strict";

      function n(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
      }
      r.r(t), r.d(t, {
        c: () => a
      });
      var o, i = {
        exports: {}
      };
      o = i,
        function() {
          var e = {}.hasOwnProperty;

          function t() {
            for (var e = "", t = 0; t < arguments.length; t++) {
              var o = arguments[t];
              o && (e = n(e, r(o)))
            }
            return e
          }

          function r(r) {
            if ("string" == typeof r || "number" == typeof r) return r;
            if ("object" != typeof r) return "";
            if (Array.isArray(r)) return t.apply(null, r);
            if (r.toString !== Object.prototype.toString && !r.toString.toString().includes("[native code]")) return r.toString();
            var o = "";
            for (var i in r) e.call(r, i) && r[i] && (o = n(o, i));
            return o
          }

          function n(e, t) {
            return t ? e ? e + " " + t : e + t : e
          }
          o.exports ? (t.default = t, o.exports = t) : window.classNames = t
        }();
      const a = n(i.exports)
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "ab6d50c5-aa9a-4a7b-bdc8-f45a1b081bf1", e._sentryDebugIdIdentifier = "sentry-dbid-ab6d50c5-aa9a-4a7b-bdc8-f45a1b081bf1")
    } catch (e) {}
  }();
//# sourceMappingURL=38607.b69b692b4a944e89e972.js.map