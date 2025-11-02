(window.webpackChunk = window.webpackChunk || []).push([
  [12145], {
    609797: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        Callout: () => l
      });
      var r = n(824246),
        i = n(827378),
        o = n(22538),
        a = n(55436),
        s = n(111883);
      n(737064);
      const l = (0, i.forwardRef)(((e, t) => {
        const {
          className: n = "",
          isIconAvailable: l = !0,
          theme: c,
          children: u,
          ...p
        } = e, {
          Icon: d
        } = c, h = (0, i.useMemo)((() => (0, s.omit)(c, ["Icon"])), [c]), f = (0, a.useThemeClassName)(h);
        return (0, r.jsxs)("div", {
          ref: t,
          className: (0, o.c)("_wrapper_9bqqz_1", f, n),
          ...p,
          children: [l && (0, r.jsx)(d, {
            className: (0, o.c)("_icon_9bqqz_8")
          }), u]
        })
      }));
      l.displayName = "Callout"
    },
    588435: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        Callout: () => r.Callout,
        CalloutErrorTheme: () => o.CalloutErrorTheme,
        CalloutInfoTheme: () => s.CalloutInfoTheme,
        CalloutSuccessTheme: () => a.CalloutSuccessTheme,
        CalloutWarningTheme: () => i.CalloutWarningTheme
      });
      var r = n(609797),
        i = n(356059),
        o = n(944543),
        a = n(135265),
        s = n(893221)
    },
    188344: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        CalloutBaseValues: () => r
      });
      const r = {
        "--crm-ui-kit-callout-padding": "12px",
        "--crm-ui-kit-callout-border-radius": "var(--crm-ui-kit-palette-focus-visible-border-radius)",
        "--crm-ui-kit-callout-icon-color": "var(--crm-ui-kit-palette-text-primary);"
      }
    },
    944543: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        CalloutErrorTheme: () => i
      });
      var r = n(827378);
      const i = {
        ...n(188344).CalloutBaseValues,
        Icon: e => r.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: 20,
          height: 20,
          fill: "currentColor",
          ...e
        }, r.createElement("g", {
          clipPath: "url(#a)"
        }, r.createElement("path", {
          d: "M8.96 4.75h2.077v4.859l-.403 2.407H9.362L8.96 9.609V4.75Zm-.218 9.363c0-.345.114-.615.341-.812.228-.207.528-.31.9-.31.393 0 .703.103.93.31.227.197.341.467.341.812 0 .344-.114.62-.34.827-.228.207-.538.31-.931.31-.372 0-.672-.103-.9-.31-.227-.207-.34-.483-.34-.827Z"
        }), r.createElement("path", {
          fillRule: "evenodd",
          d: "M10 1.625a8.375 8.375 0 1 0 0 16.75 8.375 8.375 0 0 0 0-16.75ZM.375 10a9.625 9.625 0 1 1 19.25 0 9.625 9.625 0 0 1-19.25 0Z",
          clipRule: "evenodd"
        })), r.createElement("defs", null, r.createElement("clipPath", {
          id: "a"
        }, r.createElement("path", {
          d: "M0 0h20v20H0z"
        })))),
        "--crm-ui-kit-callout-background-color": "var(--crm-ui-kit-palette-callout-error-background-color)"
      }
    },
    893221: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        CalloutInfoTheme: () => i
      });
      var r = n(827378);
      const i = {
        ...n(188344).CalloutBaseValues,
        Icon: e => r.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: 20,
          height: 20,
          fill: "currentColor",
          ...e
        }, r.createElement("g", {
          clipPath: "url(#a)"
        }, r.createElement("path", {
          d: "M10.972 15.195H9.023V8.7h1.949v6.494ZM10.687 6.475a.956.956 0 0 1-.695.278.927.927 0 0 1-.69-.284.956.956 0 0 1-.279-.695c0-.275.095-.505.285-.69a.956.956 0 0 1 .695-.279c.274 0 .505.095.69.284.186.19.279.422.279.696a.927.927 0 0 1-.285.69Z"
        }), r.createElement("path", {
          fillRule: "evenodd",
          d: "M10 1.299A8.701 8.701 0 1 0 10 18.7 8.701 8.701 0 0 0 10 1.3ZM0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10Z",
          clipRule: "evenodd"
        })), r.createElement("defs", null, r.createElement("clipPath", {
          id: "a"
        }, r.createElement("path", {
          d: "M0 0h20v20H0z"
        })))),
        "--crm-ui-kit-callout-background-color": "var(--crm-ui-kit-palette-callout-info-background-color)"
      }
    },
    135265: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        CalloutSuccessTheme: () => i
      });
      var r = n(827378);
      const i = {
        ...n(188344).CalloutBaseValues,
        Icon: e => r.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: 20,
          height: 20,
          fill: "none",
          ...e
        }, r.createElement("g", {
          clipPath: "url(#a)"
        }, r.createElement("path", {
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.299,
          d: "M.65 10a9.35 9.35 0 1 1 18.7 0 9.35 9.35 0 0 1-18.7 0Z"
        }), r.createElement("path", {
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.299,
          d: "M.65 10a9.35 9.35 0 1 1 18.7 0 9.35 9.35 0 0 1-18.7 0Z"
        }), r.createElement("path", {
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.455,
          d: "m5.328 10 3.117 3.117 6.234-6.234"
        })), r.createElement("defs", null, r.createElement("clipPath", {
          id: "a"
        }, r.createElement("path", {
          d: "M0 0h20v20H0z"
        })))),
        "--crm-ui-kit-callout-background-color": "var(--crm-ui-kit-palette-callout-success-background-color)"
      }
    },
    356059: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        CalloutWarningTheme: () => i
      });
      var r = n(827378);
      const i = {
        ...n(188344).CalloutBaseValues,
        Icon: e => r.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          width: 20,
          height: 20,
          fill: "none",
          ...e
        }, r.createElement("g", {
          clipPath: "url(#a)"
        }, r.createElement("path", {
          fill: "currentColor",
          fillRule: "evenodd",
          d: "M9 15.207c0-.312.097-.565.292-.76.195-.194.468-.272.799-.272.35 0 .623.097.818.272.195.195.292.448.292.76s-.097.565-.292.76c-.195.195-.467.292-.818.292-.331 0-.585-.097-.799-.292-.195-.195-.292-.448-.292-.76Zm.195-8.688h1.831v4.5l-.35 2.22h-1.13l-.351-2.22v-4.5Z",
          clipRule: "evenodd"
        }), r.createElement("path", {
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.3,
          d: "M8.666 2.47a1.542 1.542 0 0 1 2.671 0l7.804 13.518a1.542 1.542 0 0 1-1.335 2.313H2.197a1.542 1.542 0 0 1-1.335-2.313L8.666 2.47Z"
        })), r.createElement("defs", null, r.createElement("clipPath", {
          id: "a"
        }, r.createElement("path", {
          fill: "currentColor",
          d: "M0 0h20v20H0z"
        })))),
        "--crm-ui-kit-callout-background-color": "var(--crm-ui-kit-palette-callout-warning-background-color)"
      }
    },
    111883: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        omit: () => r
      });
      const r = (e, t) => {
        const {
          ...n
        } = e;
        for (const e of t) delete n[e];
        return n
      }
    },
    597027: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => b
      });
      var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
          return typeof e
        } : function(e) {
          return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        i = window.device,
        o = {},
        a = [];
      window.device = o;
      var s = window.document.documentElement,
        l = window.navigator.userAgent.toLowerCase(),
        c = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];

      function u(e) {
        return -1 !== l.indexOf(e)
      }

      function p(e) {
        return s.className.match(new RegExp(e, "i"))
      }

      function d(e) {
        var t = null;
        p(e) || (t = s.className.replace(/^\s+|\s+$/g, ""), s.className = t + " " + e)
      }

      function h(e) {
        p(e) && (s.className = s.className.replace(" " + e, ""))
      }

      function f() {
        o.landscape() ? (h("portrait"), d("landscape"), m("landscape")) : (h("landscape"), d("portrait"), m("portrait")), v()
      }

      function m(e) {
        for (var t in a) a[t](e)
      }
      o.macos = function() {
        return u("mac")
      }, o.ios = function() {
        return o.iphone() || o.ipod() || o.ipad()
      }, o.iphone = function() {
        return !o.windows() && u("iphone")
      }, o.ipod = function() {
        return u("ipod")
      }, o.ipad = function() {
        return u("ipad")
      }, o.android = function() {
        return !o.windows() && u("android")
      }, o.androidPhone = function() {
        return o.android() && u("mobile")
      }, o.androidTablet = function() {
        return o.android() && !u("mobile")
      }, o.blackberry = function() {
        return u("blackberry") || u("bb10") || u("rim")
      }, o.blackberryPhone = function() {
        return o.blackberry() && !u("tablet")
      }, o.blackberryTablet = function() {
        return o.blackberry() && u("tablet")
      }, o.windows = function() {
        return u("windows")
      }, o.windowsPhone = function() {
        return o.windows() && u("phone")
      }, o.windowsTablet = function() {
        return o.windows() && u("touch") && !o.windowsPhone()
      }, o.fxos = function() {
        return (u("(mobile") || u("(tablet")) && u(" rv:")
      }, o.fxosPhone = function() {
        return o.fxos() && u("mobile")
      }, o.fxosTablet = function() {
        return o.fxos() && u("tablet")
      }, o.meego = function() {
        return u("meego")
      }, o.cordova = function() {
        return window.cordova && "file:" === location.protocol
      }, o.nodeWebkit = function() {
        return "object" === r(window.process)
      }, o.mobile = function() {
        return o.androidPhone() || o.iphone() || o.ipod() || o.windowsPhone() || o.blackberryPhone() || o.fxosPhone() || o.meego()
      }, o.tablet = function() {
        return o.ipad() || o.androidTablet() || o.blackberryTablet() || o.windowsTablet() || o.fxosTablet()
      }, o.desktop = function() {
        return !o.tablet() && !o.mobile()
      }, o.television = function() {
        for (var e = 0; e < c.length;) {
          if (u(c[e])) return !0;
          e++
        }
        return !1
      }, o.portrait = function() {
        return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? screen.orientation.type.includes("portrait") : window.innerHeight / window.innerWidth > 1
      }, o.landscape = function() {
        return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? screen.orientation.type.includes("landscape") : window.innerHeight / window.innerWidth < 1
      }, o.noConflict = function() {
        return window.device = i, this
      }, o.ios() ? o.ipad() ? d("ios ipad tablet") : o.iphone() ? d("ios iphone mobile") : o.ipod() && d("ios ipod mobile") : o.macos() ? d("macos desktop") : o.android() ? o.androidTablet() ? d("android tablet") : d("android mobile") : o.blackberry() ? o.blackberryTablet() ? d("blackberry tablet") : d("blackberry mobile") : o.windows() ? o.windowsTablet() ? d("windows tablet") : o.windowsPhone() ? d("windows mobile") : d("windows desktop") : o.fxos() ? o.fxosTablet() ? d("fxos tablet") : d("fxos mobile") : o.meego() ? d("meego mobile") : o.nodeWebkit() ? d("node-webkit") : o.television() ? d("television") : o.desktop() && d("desktop"), o.cordova() && d("cordova"), o.onChangeOrientation = function(e) {
        "function" == typeof e && a.push(e)
      };
      var y = "resize";

      function g(e) {
        for (var t = 0; t < e.length; t++)
          if (o[e[t]]()) return e[t];
        return "unknown"
      }

      function v() {
        o.orientation = g(["portrait", "landscape"])
      }
      Object.prototype.hasOwnProperty.call(window, "onorientationchange") && (y = "orientationchange"), window.addEventListener ? window.addEventListener(y, f, !1) : window.attachEvent ? window.attachEvent(y, f) : window[y] = f, f(), o.type = g(["mobile", "tablet", "desktop"]), o.os = g(["ios", "iphone", "ipad", "ipod", "android", "blackberry", "windows", "fxos", "meego", "television"]), v();
      const b = o
    },
    750229: e => {
      "use strict";
      var t = Object.prototype.hasOwnProperty,
        n = Object.prototype.toString,
        r = Object.defineProperty,
        i = Object.getOwnPropertyDescriptor,
        o = function(e) {
          return "function" == typeof Array.isArray ? Array.isArray(e) : "[object Array]" === n.call(e)
        },
        a = function(e) {
          if (!e || "[object Object]" !== n.call(e)) return !1;
          var r, i = t.call(e, "constructor"),
            o = e.constructor && e.constructor.prototype && t.call(e.constructor.prototype, "isPrototypeOf");
          if (e.constructor && !i && !o) return !1;
          for (r in e);
          return void 0 === r || t.call(e, r)
        },
        s = function(e, t) {
          r && "__proto__" === t.name ? r(e, t.name, {
            enumerable: !0,
            configurable: !0,
            value: t.newValue,
            writable: !0
          }) : e[t.name] = t.newValue
        },
        l = function(e, n) {
          if ("__proto__" === n) {
            if (!t.call(e, n)) return;
            if (i) return i(e, n).value
          }
          return e[n]
        };
      e.exports = function e() {
        var t, n, r, i, c, u, p = arguments[0],
          d = 1,
          h = arguments.length,
          f = !1;
        for ("boolean" == typeof p && (f = p, p = arguments[1] || {}, d = 2), (null == p || "object" != typeof p && "function" != typeof p) && (p = {}); d < h; ++d)
          if (null != (t = arguments[d]))
            for (n in t) r = l(p, n), p !== (i = l(t, n)) && (f && i && (a(i) || (c = o(i))) ? (c ? (c = !1, u = r && o(r) ? r : []) : u = r && a(r) ? r : {}, s(p, {
              name: n,
              newValue: e(f, u, i)
            })) : void 0 !== i && s(p, {
              name: n,
              newValue: i
            }));
        return p
      }
    },
    548469: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = n.p + "images/fb928619c13b30e1dc255bad9fd8243f.svg"
    },
    903812: e => {
      var t = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
        n = /\n/g,
        r = /^\s*/,
        i = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,
        o = /^:\s*/,
        a = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,
        s = /^[;\s]*/,
        l = /^\s+|\s+$/g,
        c = "";

      function u(e) {
        return e ? e.replace(l, c) : c
      }
      e.exports = function(e, l) {
        if ("string" != typeof e) throw new TypeError("First argument must be a string");
        if (!e) return [];
        l = l || {};
        var p = 1,
          d = 1;

        function h(e) {
          var t = e.match(n);
          t && (p += t.length);
          var r = e.lastIndexOf("\n");
          d = ~r ? e.length - r : d + e.length
        }

        function f() {
          var e = {
            line: p,
            column: d
          };
          return function(t) {
            return t.position = new m(e), b(), t
          }
        }

        function m(e) {
          this.start = e, this.end = {
            line: p,
            column: d
          }, this.source = l.source
        }
        m.prototype.content = e;
        var y = [];

        function g(t) {
          var n = new Error(l.source + ":" + p + ":" + d + ": " + t);
          if (n.reason = t, n.filename = l.source, n.line = p, n.column = d, n.source = e, !l.silent) throw n;
          y.push(n)
        }

        function v(t) {
          var n = t.exec(e);
          if (n) {
            var r = n[0];
            return h(r), e = e.slice(r.length), n
          }
        }

        function b() {
          v(r)
        }

        function k(e) {
          var t;
          for (e = e || []; t = w();) !1 !== t && e.push(t);
          return e
        }

        function w() {
          var t = f();
          if ("/" == e.charAt(0) && "*" == e.charAt(1)) {
            for (var n = 2; c != e.charAt(n) && ("*" != e.charAt(n) || "/" != e.charAt(n + 1));) ++n;
            if (n += 2, c === e.charAt(n - 1)) return g("End of comment missing");
            var r = e.slice(2, n - 2);
            return d += 2, h(r), e = e.slice(n), d += 2, t({
              type: "comment",
              comment: r
            })
          }
        }

        function x() {
          var e = f(),
            n = v(i);
          if (n) {
            if (w(), !v(o)) return g("property missing ':'");
            var r = v(a),
              l = e({
                type: "declaration",
                property: u(n[0].replace(t, c)),
                value: r ? u(r[0].replace(t, c)) : c
              });
            return v(s), l
          }
        }
        return b(),
          function() {
            var e, t = [];
            for (k(t); e = x();) !1 !== e && (t.push(e), k(t));
            return t
          }()
      }
    },
    197760: e => {
      "use strict";
      e.exports = e => {
        if ("[object Object]" !== Object.prototype.toString.call(e)) return !1;
        const t = Object.getPrototypeOf(e);
        return null === t || t === Object.prototype
      }
    },
    737064: (e, t, n) => {
      "use strict";
      n.r(t)
    },
    708356: (e, t, n) => {
      "use strict";

      function r(e) {
        if (e) throw e
      }
      n.r(t), n.d(t, {
        bail: () => r
      })
    },
    501119: (e, t, n) => {
      "use strict";

      function r(e) {
        const t = [],
          n = String(e || "");
        let r = n.indexOf(","),
          i = 0,
          o = !1;
        for (; !o;) {
          -1 === r && (r = n.length, o = !0);
          const e = n.slice(i, r).trim();
          !e && o || t.push(e), i = r + 1, r = n.indexOf(",", i)
        }
        return t
      }

      function i(e, t) {
        const n = t || {};
        return ("" === e[e.length - 1] ? [...e, ""] : e).join((n.padRight ? " " : "") + "," + (!1 === n.padLeft ? "" : " ")).trim()
      }
      n.r(t), n.d(t, {
        parse: () => r,
        stringify: () => i
      })
    },
    269477: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        decodeNamedCharacterReference: () => i
      });
      const r = document.createElement("i");

      function i(e) {
        const t = "&" + e + ";";
        r.innerHTML = t;
        const n = r.textContent;
        return (59 !== n.charCodeAt(n.length - 1) || "semi" === e) && n !== t && n
      }
    },
    763436: (e, t, n) => {
      "use strict";

      function r(e) {
        return e
      }

      function i() {}

      function o() {}

      function a() {}
      n.r(t), n.d(t, {
        deprecate: () => r,
        equal: () => i,
        ok: () => o,
        unreachable: () => a
      })
    },
    991859: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        cont: () => r.cont,
        name: () => r.name,
        start: () => r.start
      });
      var r = n(766442)
    },
    766442: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        cont: () => u,
        name: () => p,
        start: () => c
      });
      const r = /[$_\p{ID_Start}]/u,
        i = /[$_\u{200C}\u{200D}\p{ID_Continue}]/u,
        o = /[-$_\u{200C}\u{200D}\p{ID_Continue}]/u,
        a = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,
        s = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,
        l = {};

      function c(e) {
        return !!e && r.test(String.fromCodePoint(e))
      }

      function u(e, t) {
        const n = (t || l).jsx ? o : i;
        return !!e && n.test(String.fromCodePoint(e))
      }

      function p(e, t) {
        return ((t || l).jsx ? s : a).test(e)
      }
    },
    467308: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        toJsxRuntime: () => r.toJsxRuntime
      });
      var r = n(955665)
    },
    955665: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        toJsxRuntime: () => v
      });
      var r = n(501119),
        i = n(763436),
        o = n(991859),
        a = n(470121),
        s = n(220725),
        l = n(843220),
        c = n(135623),
        u = n(632831),
        p = n(171597);
      const d = {}.hasOwnProperty,
        h = new Map,
        f = /[A-Z]/g,
        m = new Set(["table", "tbody", "thead", "tfoot", "tr"]),
        y = new Set(["td", "th"]),
        g = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";

      function v(e, t) {
        if (!t || void 0 === t.Fragment) throw new TypeError("Expected `Fragment` in options");
        const n = t.filePath || void 0;
        let r;
        if (t.development) {
          if ("function" != typeof t.jsxDEV) throw new TypeError("Expected `jsxDEV` in options when `development: true`");
          r = function(e, t) {
            return function(n, r, i, o) {
              const a = Array.isArray(i.children),
                s = (0, u.pointStart)(n);
              return t(r, i, o, a, {
                columnNumber: s ? s.column - 1 : void 0,
                fileName: e,
                lineNumber: s ? s.line : void 0
              }, void 0)
            }
          }(n, t.jsxDEV)
        } else {
          if ("function" != typeof t.jsx) throw new TypeError("Expected `jsx` in production options");
          if ("function" != typeof t.jsxs) throw new TypeError("Expected `jsxs` in production options");
          i = t.jsx, o = t.jsxs, r = function(e, t, n, r) {
            const a = Array.isArray(n.children) ? o : i;
            return r ? a(t, n, r) : a(t, n)
          }
        }
        var i, o;
        const a = {
            Fragment: t.Fragment,
            ancestors: [],
            components: t.components || {},
            create: r,
            elementAttributeNameCase: t.elementAttributeNameCase || "react",
            evaluater: t.createEvaluater ? t.createEvaluater() : void 0,
            filePath: n,
            ignoreInvalidStyle: t.ignoreInvalidStyle || !1,
            passKeys: !1 !== t.passKeys,
            passNode: t.passNode || !1,
            schema: "svg" === t.space ? s.svg : s.html,
            stylePropertyNameCase: t.stylePropertyNameCase || "dom",
            tableCellAlignToStyle: !1 !== t.tableCellAlignToStyle
          },
          l = b(a, e, void 0);
        return l && "string" != typeof l ? l : a.create(e, a.Fragment, {
          children: l || void 0
        }, void 0)
      }

      function b(e, t, n) {
        return "element" === t.type ? function(e, t, n) {
          const r = e.schema;
          let i = r;
          "svg" === t.tagName.toLowerCase() && "html" === r.space && (i = s.svg, e.schema = i), e.ancestors.push(t);
          const o = E(e, t.tagName, !1),
            l = function(e, t) {
              const n = {};
              let r, i;
              for (i in t.properties)
                if ("children" !== i && d.call(t.properties, i)) {
                  const o = C(e, i, t.properties[i]);
                  if (o) {
                    const [i, a] = o;
                    e.tableCellAlignToStyle && "align" === i && "string" == typeof a && y.has(t.tagName) ? r = a : n[i] = a
                  }
                } return r && ((n.style || (n.style = {}))["css" === e.stylePropertyNameCase ? "text-align" : "textAlign"] = r), n
            }(e, t);
          let c = x(e, t);
          return m.has(t.tagName) && (c = c.filter((function(e) {
            return "string" != typeof e || !(0, a.whitespace)(e)
          }))), k(e, l, o, t), w(l, c), e.ancestors.pop(), e.schema = r, e.create(t, o, l, n)
        }(e, t, n) : "mdxFlowExpression" === t.type || "mdxTextExpression" === t.type ? function(e, t) {
          if (t.data && t.data.estree && e.evaluater) {
            const n = t.data.estree.body[0];
            return (0, i.ok)("ExpressionStatement" === n.type), e.evaluater.evaluateExpression(n.expression)
          }
          N(e, t.position)
        }(e, t) : "mdxJsxFlowElement" === t.type || "mdxJsxTextElement" === t.type ? function(e, t, n) {
          const r = e.schema;
          let o = r;
          "svg" === t.name && "html" === r.space && (o = s.svg, e.schema = o), e.ancestors.push(t);
          const a = null === t.name ? e.Fragment : E(e, t.name, !0),
            l = function(e, t) {
              const n = {};
              for (const r of t.attributes)
                if ("mdxJsxExpressionAttribute" === r.type)
                  if (r.data && r.data.estree && e.evaluater) {
                    const t = r.data.estree.body[0];
                    (0, i.ok)("ExpressionStatement" === t.type);
                    const o = t.expression;
                    (0, i.ok)("ObjectExpression" === o.type);
                    const a = o.properties[0];
                    (0, i.ok)("SpreadElement" === a.type), Object.assign(n, e.evaluater.evaluateExpression(a.argument))
                  } else N(e, t.position);
              else {
                const o = r.name;
                let a;
                if (r.value && "object" == typeof r.value)
                  if (r.value.data && r.value.data.estree && e.evaluater) {
                    const t = r.value.data.estree.body[0];
                    (0, i.ok)("ExpressionStatement" === t.type), a = e.evaluater.evaluateExpression(t.expression)
                  } else N(e, t.position);
                else a = null === r.value || r.value;
                n[o] = a
              }
              return n
            }(e, t),
            c = x(e, t);
          return k(e, l, a, t), w(l, c), e.ancestors.pop(), e.schema = r, e.create(t, a, l, n)
        }(e, t, n) : "mdxjsEsm" === t.type ? function(e, t) {
          if (t.data && t.data.estree && e.evaluater) return e.evaluater.evaluateProgram(t.data.estree);
          N(e, t.position)
        }(e, t) : "root" === t.type ? function(e, t, n) {
          const r = {};
          return w(r, x(e, t)), e.create(t, e.Fragment, r, n)
        }(e, t, n) : "text" === t.type ? function(e, t) {
          return t.value
        }(0, t) : void 0
      }

      function k(e, t, n, r) {
        "string" != typeof n && n !== e.Fragment && e.passNode && (t.node = r)
      }

      function w(e, t) {
        if (t.length > 0) {
          const n = t.length > 1 ? t : t[0];
          n && (e.children = n)
        }
      }

      function x(e, t) {
        const n = [];
        let r = -1;
        const i = e.passKeys ? new Map : h;
        for (; ++r < t.children.length;) {
          const o = t.children[r];
          let a;
          if (e.passKeys) {
            const e = "element" === o.type ? o.tagName : "mdxJsxFlowElement" === o.type || "mdxJsxTextElement" === o.type ? o.name : void 0;
            if (e) {
              const t = i.get(e) || 0;
              a = e + "-" + t, i.set(e, t + 1)
            }
          }
          const s = b(e, o, a);
          void 0 !== s && n.push(s)
        }
        return n
      }

      function C(e, t, n) {
        const i = (0, s.find)(e.schema, t);
        if (!(null == n || "number" == typeof n && Number.isNaN(n))) {
          if (Array.isArray(n) && (n = i.commaSeparated ? (0, r.stringify)(n) : (0, l.stringify)(n)), "style" === i.property) {
            let t = "object" == typeof n ? n : function(e, t) {
              try {
                return c(t, {
                  reactCompat: !0
                })
              } catch (t) {
                if (e.ignoreInvalidStyle) return {};
                const n = t,
                  r = new p.VFileMessage("Cannot parse `style` attribute", {
                    ancestors: e.ancestors,
                    cause: n,
                    ruleId: "style",
                    source: "hast-util-to-jsx-runtime"
                  });
                throw r.file = e.filePath || void 0, r.url = g + "#cannot-parse-style-attribute", r
              }
            }(e, String(n));
            return "css" === e.stylePropertyNameCase && (t = function(e) {
              const t = {};
              let n;
              for (n in e) d.call(e, n) && (t[S(n)] = e[n]);
              return t
            }(t)), ["style", t]
          }
          return ["react" === e.elementAttributeNameCase && i.space ? s.hastToReact[i.property] || i.property : i.attribute, n]
        }
      }

      function E(e, t, n) {
        let r;
        if (n)
          if (t.includes(".")) {
            const e = t.split(".");
            let n, a = -1;
            for (; ++a < e.length;) {
              const t = (0, o.name)(e[a]) ? {
                type: "Identifier",
                name: e[a]
              } : {
                type: "Literal",
                value: e[a]
              };
              n = n ? {
                type: "MemberExpression",
                object: n,
                property: t,
                computed: Boolean(a && "Literal" === t.type),
                optional: !1
              } : t
            }(0, i.ok)(n, "always a result"), r = n
          } else r = (0, o.name)(t) && !/^[a-z]/.test(t) ? {
            type: "Identifier",
            name: t
          } : {
            type: "Literal",
            value: t
          };
        else r = {
          type: "Literal",
          value: t
        };
        if ("Literal" === r.type) {
          const t = r.value;
          return d.call(e.components, t) ? e.components[t] : t
        }
        if (e.evaluater) return e.evaluater.evaluateExpression(r);
        N(e)
      }

      function N(e, t) {
        const n = new p.VFileMessage("Cannot handle MDX estrees without `createEvaluater`", {
          ancestors: e.ancestors,
          place: t,
          ruleId: "mdx-estree",
          source: "hast-util-to-jsx-runtime"
        });
        throw n.file = e.filePath || void 0, n.url = g + "#cannot-handle-mdx-estrees-without-createevaluater", n
      }

      function S(e) {
        let t = e.replace(f, T);
        return "ms-" === t.slice(0, 3) && (t = "-" + t), t
      }

      function T(e) {
        return "-" + e.toLowerCase()
      }
    },
    470121: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        whitespace: () => r.whitespace
      });
      var r = n(809080)
    },
    809080: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        whitespace: () => i
      });
      const r = /[ \t\n\f\r]/g;

      function i(e) {
        return "object" == typeof e ? "text" === e.type && o(e.value) : o(e)
      }

      function o(e) {
        return "" === e.replace(r, "")
      }
    },
    544704: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        urlAttributes: () => r.urlAttributes
      });
      var r = n(653561)
    },
    653561: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        urlAttributes: () => r
      });
      const r = {
        action: ["form"],
        cite: ["blockquote", "del", "ins", "q"],
        data: ["object"],
        formAction: ["button", "input"],
        href: ["a", "area", "base", "link"],
        icon: ["menuitem"],
        itemId: null,
        manifest: ["html"],
        ping: ["a", "area"],
        poster: ["video"],
        src: ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"]
      }
    },
    846461: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        fromMarkdown: () => r.fromMarkdown
      });
      var r = n(603008)
    },
    603008: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        fromMarkdown: () => p
      });
      var r = n(758717),
        i = n(79249),
        o = n(48031),
        a = n(812116),
        s = n(262493),
        l = n(269477),
        c = n(111513);
      const u = {}.hasOwnProperty;

      function p(e, t, n) {
        return "string" != typeof t && (n = t, t = void 0),
          function(e) {
            const t = {
              transforms: [],
              canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
              enter: {
                autolink: p(I),
                autolinkProtocol: k,
                autolinkEmail: k,
                atxHeading: p(N),
                blockQuote: p((function() {
                  return {
                    type: "blockquote",
                    children: []
                  }
                })),
                characterEscape: k,
                characterReference: k,
                codeFenced: p(E),
                codeFencedFenceInfo: f,
                codeFencedFenceMeta: f,
                codeIndented: p(E, f),
                codeText: p((function() {
                  return {
                    type: "inlineCode",
                    value: ""
                  }
                }), f),
                codeTextData: k,
                data: k,
                codeFlowValue: k,
                definition: p((function() {
                  return {
                    type: "definition",
                    identifier: "",
                    label: null,
                    title: null,
                    url: ""
                  }
                })),
                definitionDestinationString: f,
                definitionLabelString: f,
                definitionTitleString: f,
                emphasis: p((function() {
                  return {
                    type: "emphasis",
                    children: []
                  }
                })),
                hardBreakEscape: p(S),
                hardBreakTrailing: p(S),
                htmlFlow: p(T, f),
                htmlFlowData: k,
                htmlText: p(T, f),
                htmlTextData: k,
                image: p((function() {
                  return {
                    type: "image",
                    title: null,
                    url: "",
                    alt: null
                  }
                })),
                label: f,
                link: p(I),
                listItem: p((function(e) {
                  return {
                    type: "listItem",
                    spread: e._spread,
                    checked: null,
                    children: []
                  }
                })),
                listItemValue: function(e) {
                  this.data.expectingFirstListItemValue && (this.stack[this.stack.length - 2].start = Number.parseInt(this.sliceSerialize(e), 10), this.data.expectingFirstListItemValue = void 0)
                },
                listOrdered: p(P, (function() {
                  this.data.expectingFirstListItemValue = !0
                })),
                listUnordered: p(P),
                paragraph: p((function() {
                  return {
                    type: "paragraph",
                    children: []
                  }
                })),
                reference: function() {
                  this.data.referenceType = "collapsed"
                },
                referenceString: f,
                resourceDestinationString: f,
                resourceTitleString: f,
                setextHeading: p(N),
                strong: p((function() {
                  return {
                    type: "strong",
                    children: []
                  }
                })),
                thematicBreak: p((function() {
                  return {
                    type: "thematicBreak"
                  }
                }))
              },
              exit: {
                atxHeading: g(),
                atxHeadingSequence: function(e) {
                  const t = this.stack[this.stack.length - 1];
                  if (!t.depth) {
                    const n = this.sliceSerialize(e).length;
                    t.depth = n
                  }
                },
                autolink: g(),
                autolinkEmail: function(e) {
                  w.call(this, e), this.stack[this.stack.length - 1].url = "mailto:" + this.sliceSerialize(e)
                },
                autolinkProtocol: function(e) {
                  w.call(this, e), this.stack[this.stack.length - 1].url = this.sliceSerialize(e)
                },
                blockQuote: g(),
                characterEscapeValue: w,
                characterReferenceMarkerHexadecimal: C,
                characterReferenceMarkerNumeric: C,
                characterReferenceValue: function(e) {
                  const t = this.sliceSerialize(e),
                    n = this.data.characterReferenceType;
                  let r;
                  n ? (r = (0, o.decodeNumericCharacterReference)(t, "characterReferenceMarkerNumeric" === n ? 10 : 16), this.data.characterReferenceType = void 0) : r = (0, l.decodeNamedCharacterReference)(t);
                  this.stack[this.stack.length - 1].value += r
                },
                characterReference: function(e) {
                  this.stack.pop().position.end = d(e.end)
                },
                codeFenced: g((function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].value = e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), this.data.flowCodeInside = void 0
                })),
                codeFencedFence: function() {
                  this.data.flowCodeInside || (this.buffer(), this.data.flowCodeInside = !0)
                },
                codeFencedFenceInfo: function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].lang = e
                },
                codeFencedFenceMeta: function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].meta = e
                },
                codeFlowValue: w,
                codeIndented: g((function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].value = e.replace(/(\r?\n|\r)$/g, "")
                })),
                codeText: g((function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].value = e
                })),
                codeTextData: w,
                data: w,
                definition: g(),
                definitionDestinationString: function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].url = e
                },
                definitionLabelString: function(e) {
                  const t = this.resume(),
                    n = this.stack[this.stack.length - 1];
                  n.label = t, n.identifier = (0, s.normalizeIdentifier)(this.sliceSerialize(e)).toLowerCase()
                },
                definitionTitleString: function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].title = e
                },
                emphasis: g(),
                hardBreakEscape: g(x),
                hardBreakTrailing: g(x),
                htmlFlow: g((function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].value = e
                })),
                htmlFlowData: w,
                htmlText: g((function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].value = e
                })),
                htmlTextData: w,
                image: g((function() {
                  const e = this.stack[this.stack.length - 1];
                  if (this.data.inReference) {
                    const t = this.data.referenceType || "shortcut";
                    e.type += "Reference", e.referenceType = t, delete e.url, delete e.title
                  } else delete e.identifier, delete e.label;
                  this.data.referenceType = void 0
                })),
                label: function() {
                  const e = this.stack[this.stack.length - 1],
                    t = this.resume(),
                    n = this.stack[this.stack.length - 1];
                  if (this.data.inReference = !0, "link" === n.type) {
                    const t = e.children;
                    n.children = t
                  } else n.alt = t
                },
                labelText: function(e) {
                  const t = this.sliceSerialize(e),
                    n = this.stack[this.stack.length - 2];
                  n.label = (0, a.decodeString)(t), n.identifier = (0, s.normalizeIdentifier)(t).toLowerCase()
                },
                lineEnding: function(e) {
                  const n = this.stack[this.stack.length - 1];
                  if (this.data.atHardBreak) return n.children[n.children.length - 1].position.end = d(e.end), void(this.data.atHardBreak = void 0);
                  !this.data.setextHeadingSlurpLineEnding && t.canContainEols.includes(n.type) && (k.call(this, e), w.call(this, e))
                },
                link: g((function() {
                  const e = this.stack[this.stack.length - 1];
                  if (this.data.inReference) {
                    const t = this.data.referenceType || "shortcut";
                    e.type += "Reference", e.referenceType = t, delete e.url, delete e.title
                  } else delete e.identifier, delete e.label;
                  this.data.referenceType = void 0
                })),
                listItem: g(),
                listOrdered: g(),
                listUnordered: g(),
                paragraph: g(),
                referenceString: function(e) {
                  const t = this.resume(),
                    n = this.stack[this.stack.length - 1];
                  n.label = t, n.identifier = (0, s.normalizeIdentifier)(this.sliceSerialize(e)).toLowerCase(), this.data.referenceType = "full"
                },
                resourceDestinationString: function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].url = e
                },
                resourceTitleString: function() {
                  const e = this.resume();
                  this.stack[this.stack.length - 1].title = e
                },
                resource: function() {
                  this.data.inReference = void 0
                },
                setextHeading: g((function() {
                  this.data.setextHeadingSlurpLineEnding = void 0
                })),
                setextHeadingLineSequence: function(e) {
                  this.stack[this.stack.length - 1].depth = 61 === this.sliceSerialize(e).codePointAt(0) ? 1 : 2
                },
                setextHeadingText: function() {
                  this.data.setextHeadingSlurpLineEnding = !0
                },
                strong: g(),
                thematicBreak: g()
              }
            };
            h(t, (e || {}).mdastExtensions || []);
            const n = {};
            return function(e) {
              let r = {
                type: "root",
                children: []
              };
              const o = {
                  stack: [r],
                  tokenStack: [],
                  config: t,
                  enter: y,
                  exit: v,
                  buffer: f,
                  resume: b,
                  data: n
                },
                a = [];
              let s = -1;
              for (; ++s < e.length;) "listOrdered" !== e[s][1].type && "listUnordered" !== e[s][1].type || ("enter" === e[s][0] ? a.push(s) : s = i(e, a.pop(), s));
              for (s = -1; ++s < e.length;) {
                const n = t[e[s][0]];
                u.call(n, e[s][1].type) && n[e[s][1].type].call(Object.assign({
                  sliceSerialize: e[s][2].sliceSerialize
                }, o), e[s][1])
              }
              if (o.tokenStack.length > 0) {
                const e = o.tokenStack[o.tokenStack.length - 1];
                (e[1] || m).call(o, void 0, e[0])
              }
              for (r.position = {
                  start: d(e.length > 0 ? e[0][1].start : {
                    line: 1,
                    column: 1,
                    offset: 0
                  }),
                  end: d(e.length > 0 ? e[e.length - 2][1].end : {
                    line: 1,
                    column: 1,
                    offset: 0
                  })
                }, s = -1; ++s < t.transforms.length;) r = t.transforms[s](r) || r;
              return r
            };

            function i(e, t, n) {
              let r, i, o, a, s = t - 1,
                l = -1,
                c = !1;
              for (; ++s <= n;) {
                const t = e[s];
                switch (t[1].type) {
                  case "listUnordered":
                  case "listOrdered":
                  case "blockQuote":
                    "enter" === t[0] ? l++ : l--, a = void 0;
                    break;
                  case "lineEndingBlank":
                    "enter" === t[0] && (!r || a || l || o || (o = s), a = void 0);
                    break;
                  case "linePrefix":
                  case "listItemValue":
                  case "listItemMarker":
                  case "listItemPrefix":
                  case "listItemPrefixWhitespace":
                    break;
                  default:
                    a = void 0
                }
                if (!l && "enter" === t[0] && "listItemPrefix" === t[1].type || -1 === l && "exit" === t[0] && ("listUnordered" === t[1].type || "listOrdered" === t[1].type)) {
                  if (r) {
                    let a = s;
                    for (i = void 0; a--;) {
                      const t = e[a];
                      if ("lineEnding" === t[1].type || "lineEndingBlank" === t[1].type) {
                        if ("exit" === t[0]) continue;
                        i && (e[i][1].type = "lineEndingBlank", c = !0), t[1].type = "lineEnding", i = a
                      } else if ("linePrefix" !== t[1].type && "blockQuotePrefix" !== t[1].type && "blockQuotePrefixWhitespace" !== t[1].type && "blockQuoteMarker" !== t[1].type && "listItemIndent" !== t[1].type) break
                    }
                    o && (!i || o < i) && (r._spread = !0), r.end = Object.assign({}, i ? e[i][1].start : t[1].end), e.splice(i || s, 0, ["exit", r, t[2]]), s++, n++
                  }
                  if ("listItemPrefix" === t[1].type) {
                    const i = {
                      type: "listItem",
                      _spread: !1,
                      start: Object.assign({}, t[1].start),
                      end: void 0
                    };
                    r = i, e.splice(s, 0, ["enter", i, t[2]]), s++, n++, o = void 0, a = !0
                  }
                }
              }
              return e[t][1]._spread = c, n
            }

            function p(e, t) {
              return function(n) {
                y.call(this, e(n), n), t && t.call(this, n)
              }
            }

            function f() {
              this.stack.push({
                type: "fragment",
                children: []
              })
            }

            function y(e, t, n) {
              this.stack[this.stack.length - 1].children.push(e), this.stack.push(e), this.tokenStack.push([t, n || void 0]), e.position = {
                start: d(t.start),
                end: void 0
              }
            }

            function g(e) {
              return function(t) {
                e && e.call(this, t), v.call(this, t)
              }
            }

            function v(e, t) {
              const n = this.stack.pop(),
                r = this.tokenStack.pop();
              if (!r) throw new Error("Cannot close `" + e.type + "` (" + (0, c.stringifyPosition)({
                start: e.start,
                end: e.end
              }) + "): it’s not open");
              r[0].type !== e.type && (t ? t.call(this, e, r[0]) : (r[1] || m).call(this, e, r[0])), n.position.end = d(e.end)
            }

            function b() {
              return (0, r.toString)(this.stack.pop())
            }

            function k(e) {
              const t = this.stack[this.stack.length - 1].children;
              let n = t[t.length - 1];
              n && "text" === n.type || (n = {
                type: "text",
                value: ""
              }, n.position = {
                start: d(e.start),
                end: void 0
              }, t.push(n)), this.stack.push(n)
            }

            function w(e) {
              const t = this.stack.pop();
              t.value += this.sliceSerialize(e), t.position.end = d(e.end)
            }

            function x() {
              this.data.atHardBreak = !0
            }

            function C(e) {
              this.data.characterReferenceType = e.type
            }

            function E() {
              return {
                type: "code",
                lang: null,
                meta: null,
                value: ""
              }
            }

            function N() {
              return {
                type: "heading",
                depth: 0,
                children: []
              }
            }

            function S() {
              return {
                type: "break"
              }
            }

            function T() {
              return {
                type: "html",
                value: ""
              }
            }

            function I() {
              return {
                type: "link",
                title: null,
                url: "",
                children: []
              }
            }

            function P(e) {
              return {
                type: "list",
                ordered: "listOrdered" === e.type,
                start: null,
                spread: e._spread,
                children: []
              }
            }
          }(n)((0, i.postprocess)((0, i.parse)(n).document().write((0, i.preprocess)()(e, t, !0))))
      }

      function d(e) {
        return {
          line: e.line,
          column: e.column,
          offset: e.offset
        }
      }

      function h(e, t) {
        let n = -1;
        for (; ++n < t.length;) {
          const r = t[n];
          Array.isArray(r) ? h(e, r) : f(e, r)
        }
      }

      function f(e, t) {
        let n;
        for (n in t)
          if (u.call(t, n)) switch (n) {
            case "canContainEols": {
              const r = t[n];
              r && e[n].push(...r);
              break
            }
            case "transforms": {
              const r = t[n];
              r && e[n].push(...r);
              break
            }
            case "enter":
            case "exit": {
              const r = t[n];
              r && Object.assign(e[n], r);
              break
            }
          }
      }

      function m(e, t) {
        throw e ? new Error("Cannot close `" + e.type + "` (" + (0, c.stringifyPosition)({
          start: e.start,
          end: e.end
        }) + "): a different token (`" + t.type + "`, " + (0, c.stringifyPosition)({
          start: t.start,
          end: t.end
        }) + ") is open") : new Error("Cannot close document, a token (`" + t.type + "`, " + (0, c.stringifyPosition)({
          start: t.start,
          end: t.end
        }) + ") is still open")
      }
    },
    46875: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        defaultFootnoteBackContent: () => o.defaultFootnoteBackContent,
        defaultFootnoteBackLabel: () => o.defaultFootnoteBackLabel,
        defaultHandlers: () => r.handlers,
        toHast: () => i.toHast
      });
      var r = n(715142),
        i = n(983286),
        o = n(227191)
    },
    227191: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        defaultFootnoteBackContent: () => o,
        defaultFootnoteBackLabel: () => a,
        footer: () => s
      });
      var r = n(538484),
        i = n(157130);

      function o(e, t) {
        const n = [{
          type: "text",
          value: "↩"
        }];
        return t > 1 && n.push({
          type: "element",
          tagName: "sup",
          properties: {},
          children: [{
            type: "text",
            value: String(t)
          }]
        }), n
      }

      function a(e, t) {
        return "Back to reference " + (e + 1) + (t > 1 ? "-" + t : "")
      }

      function s(e) {
        const t = "string" == typeof e.options.clobberPrefix ? e.options.clobberPrefix : "user-content-",
          n = e.options.footnoteBackContent || o,
          s = e.options.footnoteBackLabel || a,
          l = e.options.footnoteLabel || "Footnotes",
          c = e.options.footnoteLabelTagName || "h2",
          u = e.options.footnoteLabelProperties || {
            className: ["sr-only"]
          },
          p = [];
        let d = -1;
        for (; ++d < e.footnoteOrder.length;) {
          const r = e.footnoteById.get(e.footnoteOrder[d]);
          if (!r) continue;
          const o = e.all(r),
            a = String(r.identifier).toUpperCase(),
            l = (0, i.normalizeUri)(a.toLowerCase());
          let c = 0;
          const u = [],
            h = e.footnoteCounts.get(a);
          for (; void 0 !== h && ++c <= h;) {
            u.length > 0 && u.push({
              type: "text",
              value: " "
            });
            let e = "string" == typeof n ? n : n(d, c);
            "string" == typeof e && (e = {
              type: "text",
              value: e
            }), u.push({
              type: "element",
              tagName: "a",
              properties: {
                href: "#" + t + "fnref-" + l + (c > 1 ? "-" + c : ""),
                dataFootnoteBackref: "",
                ariaLabel: "string" == typeof s ? s : s(d, c),
                className: ["data-footnote-backref"]
              },
              children: Array.isArray(e) ? e : [e]
            })
          }
          const f = o[o.length - 1];
          if (f && "element" === f.type && "p" === f.tagName) {
            const e = f.children[f.children.length - 1];
            e && "text" === e.type ? e.value += " " : f.children.push({
              type: "text",
              value: " "
            }), f.children.push(...u)
          } else o.push(...u);
          const m = {
            type: "element",
            tagName: "li",
            properties: {
              id: t + "fn-" + l
            },
            children: e.wrap(o, !0)
          };
          e.patch(r, m), p.push(m)
        }
        if (0 !== p.length) return {
          type: "element",
          tagName: "section",
          properties: {
            dataFootnotes: !0,
            className: ["footnotes"]
          },
          children: [{
            type: "element",
            tagName: c,
            properties: {
              ...(0, r.default)(u),
              id: "footnote-label"
            },
            children: [{
              type: "text",
              value: l
            }]
          }, {
            type: "text",
            value: "\n"
          }, {
            type: "element",
            tagName: "ol",
            properties: {},
            children: e.wrap(p, !0)
          }, {
            type: "text",
            value: "\n"
          }]
        }
      }
    },
    229671: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "blockquote",
          properties: {},
          children: e.wrap(e.all(t), !0)
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        blockquote: () => r
      })
    },
    617186: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "br",
          properties: {},
          children: []
        };
        return e.patch(t, n), [e.applyData(t, n), {
          type: "text",
          value: "\n"
        }]
      }
      n.r(t), n.d(t, {
        hardBreak: () => r
      })
    },
    50897: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = t.value ? t.value + "\n" : "",
          r = {};
        t.lang && (r.className = ["language-" + t.lang]);
        let i = {
          type: "element",
          tagName: "code",
          properties: r,
          children: [{
            type: "text",
            value: n
          }]
        };
        return t.meta && (i.data = {
          meta: t.meta
        }), e.patch(t, i), i = e.applyData(t, i), i = {
          type: "element",
          tagName: "pre",
          properties: {},
          children: [i]
        }, e.patch(t, i), i
      }
      n.r(t), n.d(t, {
        code: () => r
      })
    },
    478724: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "del",
          properties: {},
          children: e.all(t)
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        strikethrough: () => r
      })
    },
    204084: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "em",
          properties: {},
          children: e.all(t)
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        emphasis: () => r
      })
    },
    10679: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        footnoteReference: () => i
      });
      var r = n(157130);

      function i(e, t) {
        const n = "string" == typeof e.options.clobberPrefix ? e.options.clobberPrefix : "user-content-",
          i = String(t.identifier).toUpperCase(),
          o = (0, r.normalizeUri)(i.toLowerCase()),
          a = e.footnoteOrder.indexOf(i);
        let s, l = e.footnoteCounts.get(i);
        void 0 === l ? (l = 0, e.footnoteOrder.push(i), s = e.footnoteOrder.length) : s = a + 1, l += 1, e.footnoteCounts.set(i, l);
        const c = {
          type: "element",
          tagName: "a",
          properties: {
            href: "#" + n + "fn-" + o,
            id: n + "fnref-" + o + (l > 1 ? "-" + l : ""),
            dataFootnoteRef: !0,
            ariaDescribedBy: ["footnote-label"]
          },
          children: [{
            type: "text",
            value: String(s)
          }]
        };
        e.patch(t, c);
        const u = {
          type: "element",
          tagName: "sup",
          properties: {},
          children: [c]
        };
        return e.patch(t, u), e.applyData(t, u)
      }
    },
    192383: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "h" + t.depth,
          properties: {},
          children: e.all(t)
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        heading: () => r
      })
    },
    882493: (e, t, n) => {
      "use strict";

      function r(e, t) {
        if (e.options.allowDangerousHtml) {
          const n = {
            type: "raw",
            value: t.value
          };
          return e.patch(t, n), e.applyData(t, n)
        }
      }
      n.r(t), n.d(t, {
        html: () => r
      })
    },
    377818: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        imageReference: () => o
      });
      var r = n(157130),
        i = n(515820);

      function o(e, t) {
        const n = String(t.identifier).toUpperCase(),
          o = e.definitionById.get(n);
        if (!o) return (0, i.revert)(e, t);
        const a = {
          src: (0, r.normalizeUri)(o.url || ""),
          alt: t.alt
        };
        null !== o.title && void 0 !== o.title && (a.title = o.title);
        const s = {
          type: "element",
          tagName: "img",
          properties: a,
          children: []
        };
        return e.patch(t, s), e.applyData(t, s)
      }
    },
    705059: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        image: () => i
      });
      var r = n(157130);

      function i(e, t) {
        const n = {
          src: (0, r.normalizeUri)(t.url)
        };
        null !== t.alt && void 0 !== t.alt && (n.alt = t.alt), null !== t.title && void 0 !== t.title && (n.title = t.title);
        const i = {
          type: "element",
          tagName: "img",
          properties: n,
          children: []
        };
        return e.patch(t, i), e.applyData(t, i)
      }
    },
    715142: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        handlers: () => S
      });
      var r = n(229671),
        i = n(617186),
        o = n(50897),
        a = n(478724),
        s = n(204084),
        l = n(10679),
        c = n(192383),
        u = n(882493),
        p = n(377818),
        d = n(705059),
        h = n(48386),
        f = n(197181),
        m = n(57189),
        y = n(25534),
        g = n(905273),
        v = n(283111),
        b = n(552977),
        k = n(279078),
        w = n(278866),
        x = n(443402),
        C = n(963948),
        E = n(585387),
        N = n(166232);
      const S = {
        blockquote: r.blockquote,
        break: i.hardBreak,
        code: o.code,
        delete: a.strikethrough,
        emphasis: s.emphasis,
        footnoteReference: l.footnoteReference,
        heading: c.heading,
        html: u.html,
        imageReference: p.imageReference,
        image: d.image,
        inlineCode: h.inlineCode,
        linkReference: f.linkReference,
        link: m.link,
        listItem: y.listItem,
        list: g.list,
        paragraph: v.paragraph,
        root: b.root,
        strong: k.strong,
        table: w.table,
        tableCell: C.tableCell,
        tableRow: x.tableRow,
        text: E.text,
        thematicBreak: N.thematicBreak,
        toml: T,
        yaml: T,
        definition: T,
        footnoteDefinition: T
      };

      function T() {}
    },
    48386: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "text",
          value: t.value.replace(/\r?\n|\r/g, " ")
        };
        e.patch(t, n);
        const r = {
          type: "element",
          tagName: "code",
          properties: {},
          children: [n]
        };
        return e.patch(t, r), e.applyData(t, r)
      }
      n.r(t), n.d(t, {
        inlineCode: () => r
      })
    },
    197181: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        linkReference: () => o
      });
      var r = n(157130),
        i = n(515820);

      function o(e, t) {
        const n = String(t.identifier).toUpperCase(),
          o = e.definitionById.get(n);
        if (!o) return (0, i.revert)(e, t);
        const a = {
          href: (0, r.normalizeUri)(o.url || "")
        };
        null !== o.title && void 0 !== o.title && (a.title = o.title);
        const s = {
          type: "element",
          tagName: "a",
          properties: a,
          children: e.all(t)
        };
        return e.patch(t, s), e.applyData(t, s)
      }
    },
    57189: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        link: () => i
      });
      var r = n(157130);

      function i(e, t) {
        const n = {
          href: (0, r.normalizeUri)(t.url)
        };
        null !== t.title && void 0 !== t.title && (n.title = t.title);
        const i = {
          type: "element",
          tagName: "a",
          properties: n,
          children: e.all(t)
        };
        return e.patch(t, i), e.applyData(t, i)
      }
    },
    25534: (e, t, n) => {
      "use strict";

      function r(e, t, n) {
        const r = e.all(t),
          o = n ? function(e) {
            let t = !1;
            if ("list" === e.type) {
              t = e.spread || !1;
              const n = e.children;
              let r = -1;
              for (; !t && ++r < n.length;) t = i(n[r])
            }
            return t
          }(n) : i(t),
          a = {},
          s = [];
        if ("boolean" == typeof t.checked) {
          const e = r[0];
          let n;
          e && "element" === e.type && "p" === e.tagName ? n = e : (n = {
            type: "element",
            tagName: "p",
            properties: {},
            children: []
          }, r.unshift(n)), n.children.length > 0 && n.children.unshift({
            type: "text",
            value: " "
          }), n.children.unshift({
            type: "element",
            tagName: "input",
            properties: {
              type: "checkbox",
              checked: t.checked,
              disabled: !0
            },
            children: []
          }), a.className = ["task-list-item"]
        }
        let l = -1;
        for (; ++l < r.length;) {
          const e = r[l];
          (o || 0 !== l || "element" !== e.type || "p" !== e.tagName) && s.push({
            type: "text",
            value: "\n"
          }), "element" !== e.type || "p" !== e.tagName || o ? s.push(e) : s.push(...e.children)
        }
        const c = r[r.length - 1];
        c && (o || "element" !== c.type || "p" !== c.tagName) && s.push({
          type: "text",
          value: "\n"
        });
        const u = {
          type: "element",
          tagName: "li",
          properties: a,
          children: s
        };
        return e.patch(t, u), e.applyData(t, u)
      }

      function i(e) {
        const t = e.spread;
        return null == t ? e.children.length > 1 : t
      }
      n.r(t), n.d(t, {
        listItem: () => r
      })
    },
    905273: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {},
          r = e.all(t);
        let i = -1;
        for ("number" == typeof t.start && 1 !== t.start && (n.start = t.start); ++i < r.length;) {
          const e = r[i];
          if ("element" === e.type && "li" === e.tagName && e.properties && Array.isArray(e.properties.className) && e.properties.className.includes("task-list-item")) {
            n.className = ["contains-task-list"];
            break
          }
        }
        const o = {
          type: "element",
          tagName: t.ordered ? "ol" : "ul",
          properties: n,
          children: e.wrap(r, !0)
        };
        return e.patch(t, o), e.applyData(t, o)
      }
      n.r(t), n.d(t, {
        list: () => r
      })
    },
    283111: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "p",
          properties: {},
          children: e.all(t)
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        paragraph: () => r
      })
    },
    552977: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "root",
          children: e.wrap(e.all(t))
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        root: () => r
      })
    },
    279078: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "strong",
          properties: {},
          children: e.all(t)
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        strong: () => r
      })
    },
    963948: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "td",
          properties: {},
          children: e.all(t)
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        tableCell: () => r
      })
    },
    443402: (e, t, n) => {
      "use strict";

      function r(e, t, n) {
        const r = n ? n.children : void 0,
          i = 0 === (r ? r.indexOf(t) : 1) ? "th" : "td",
          o = n && "table" === n.type ? n.align : void 0,
          a = o ? o.length : t.children.length;
        let s = -1;
        const l = [];
        for (; ++s < a;) {
          const n = t.children[s],
            r = {},
            a = o ? o[s] : void 0;
          a && (r.align = a);
          let c = {
            type: "element",
            tagName: i,
            properties: r,
            children: []
          };
          n && (c.children = e.all(n), e.patch(n, c), c = e.applyData(n, c)), l.push(c)
        }
        const c = {
          type: "element",
          tagName: "tr",
          properties: {},
          children: e.wrap(l, !0)
        };
        return e.patch(t, c), e.applyData(t, c)
      }
      n.r(t), n.d(t, {
        tableRow: () => r
      })
    },
    278866: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        table: () => i
      });
      var r = n(632831);

      function i(e, t) {
        const n = e.all(t),
          i = n.shift(),
          o = [];
        if (i) {
          const n = {
            type: "element",
            tagName: "thead",
            properties: {},
            children: e.wrap([i], !0)
          };
          e.patch(t.children[0], n), o.push(n)
        }
        if (n.length > 0) {
          const i = {
              type: "element",
              tagName: "tbody",
              properties: {},
              children: e.wrap(n, !0)
            },
            a = (0, r.pointStart)(t.children[1]),
            s = (0, r.pointEnd)(t.children[t.children.length - 1]);
          a && s && (i.position = {
            start: a,
            end: s
          }), o.push(i)
        }
        const a = {
          type: "element",
          tagName: "table",
          properties: {},
          children: e.wrap(o, !0)
        };
        return e.patch(t, a), e.applyData(t, a)
      }
    },
    585387: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        text: () => i
      });
      var r = n(403804);

      function i(e, t) {
        const n = {
          type: "text",
          value: (0, r.trimLines)(String(t.value))
        };
        return e.patch(t, n), e.applyData(t, n)
      }
    },
    166232: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = {
          type: "element",
          tagName: "hr",
          properties: {},
          children: []
        };
        return e.patch(t, n), e.applyData(t, n)
      }
      n.r(t), n.d(t, {
        thematicBreak: () => r
      })
    },
    983286: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        toHast: () => a
      });
      var r = n(763436),
        i = n(227191),
        o = n(645355);

      function a(e, t) {
        const n = (0, o.createState)(e, t),
          a = n.one(e, void 0),
          s = (0, i.footer)(n),
          l = Array.isArray(a) ? {
            type: "root",
            children: a
          } : a || {
            type: "root",
            children: []
          };
        return s && ((0, r.ok)("children" in l), l.children.push({
          type: "text",
          value: "\n"
        }, s)), l
      }
    },
    515820: (e, t, n) => {
      "use strict";

      function r(e, t) {
        const n = t.referenceType;
        let r = "]";
        if ("collapsed" === n ? r += "[]" : "full" === n && (r += "[" + (t.label || t.identifier) + "]"), "imageReference" === t.type) return [{
          type: "text",
          value: "![" + t.alt + r
        }];
        const i = e.all(t),
          o = i[0];
        o && "text" === o.type ? o.value = "[" + o.value : i.unshift({
          type: "text",
          value: "["
        });
        const a = i[i.length - 1];
        return a && "text" === a.type ? a.value += r : i.push({
          type: "text",
          value: r
        }), i
      }
      n.r(t), n.d(t, {
        revert: () => r
      })
    },
    645355: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        createState: () => c,
        wrap: () => h
      });
      var r = n(538484),
        i = n(683428),
        o = n(632831),
        a = n(715142);
      const s = {}.hasOwnProperty,
        l = {};

      function c(e, t) {
        const n = t || l,
          o = new Map,
          c = new Map,
          m = new Map,
          y = {
            ...a.handlers,
            ...n.handlers
          },
          g = {
            all: function(e) {
              const t = [];
              if ("children" in e) {
                const n = e.children;
                let r = -1;
                for (; ++r < n.length;) {
                  const i = g.one(n[r], e);
                  if (i) {
                    if (r && "break" === n[r - 1].type && (Array.isArray(i) || "text" !== i.type || (i.value = f(i.value)), !Array.isArray(i) && "element" === i.type)) {
                      const e = i.children[0];
                      e && "text" === e.type && (e.value = f(e.value))
                    }
                    Array.isArray(i) ? t.push(...i) : t.push(i)
                  }
                }
              }
              return t
            },
            applyData: p,
            definitionById: o,
            footnoteById: c,
            footnoteCounts: m,
            footnoteOrder: [],
            handlers: y,
            one: function(e, t) {
              const n = e.type,
                i = g.handlers[n];
              if (s.call(g.handlers, n) && i) return i(g, e, t);
              if (g.options.passThrough && g.options.passThrough.includes(n)) {
                if ("children" in e) {
                  const {
                    children: t,
                    ...n
                  } = e, i = (0, r.default)(n);
                  return i.children = g.all(e), i
                }
                return (0, r.default)(e)
              }
              return (g.options.unknownHandler || d)(g, e, t)
            },
            options: n,
            patch: u,
            wrap: h
          };
        return (0, i.visit)(e, (function(e) {
          if ("definition" === e.type || "footnoteDefinition" === e.type) {
            const t = "definition" === e.type ? o : c,
              n = String(e.identifier).toUpperCase();
            t.has(n) || t.set(n, e)
          }
        })), g
      }

      function u(e, t) {
        e.position && (t.position = (0, o.position)(e))
      }

      function p(e, t) {
        let n = t;
        if (e && e.data) {
          const t = e.data.hName,
            i = e.data.hChildren,
            o = e.data.hProperties;
          "string" == typeof t && ("element" === n.type ? n.tagName = t : n = {
            type: "element",
            tagName: t,
            properties: {},
            children: "children" in n ? n.children : [n]
          }), "element" === n.type && o && Object.assign(n.properties, (0, r.default)(o)), "children" in n && n.children && null != i && (n.children = i)
        }
        return n
      }

      function d(e, t) {
        const n = t.data || {},
          r = !("value" in t) || s.call(n, "hProperties") || s.call(n, "hChildren") ? {
            type: "element",
            tagName: "div",
            properties: {},
            children: e.all(t)
          } : {
            type: "text",
            value: t.value
          };
        return e.patch(t, r), e.applyData(t, r)
      }

      function h(e, t) {
        const n = [];
        let r = -1;
        for (t && n.push({
            type: "text",
            value: "\n"
          }); ++r < e.length;) r && n.push({
          type: "text",
          value: "\n"
        }), n.push(e[r]);
        return t && e.length > 0 && n.push({
          type: "text",
          value: "\n"
        }), n
      }

      function f(e) {
        let t = 0,
          n = e.charCodeAt(t);
        for (; 9 === n || 32 === n;) t++, n = e.charCodeAt(t);
        return e.slice(t)
      }
    },
    758717: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        toString: () => r.toString
      });
      var r = n(529535)
    },
    529535: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        toString: () => i
      });
      const r = {};

      function i(e, t) {
        const n = t || r;
        return o(e, "boolean" != typeof n.includeImageAlt || n.includeImageAlt, "boolean" != typeof n.includeHtml || n.includeHtml)
      }

      function o(e, t, n) {
        if (function(e) {
            return Boolean(e && "object" == typeof e)
          }(e)) {
          if ("value" in e) return "html" !== e.type || n ? e.value : "";
          if (t && "alt" in e && e.alt) return e.alt;
          if ("children" in e) return a(e.children, t, n)
        }
        return Array.isArray(e) ? a(e, t, n) : ""
      }

      function a(e, t, n) {
        const r = [];
        let i = -1;
        for (; ++i < e.length;) r[i] = o(e[i], t, n);
        return r.join("")
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "024d3738-ba30-4718-9f01-bf5cfd914f5c", e._sentryDebugIdIdentifier = "sentry-dbid-024d3738-ba30-4718-9f01-bf5cfd914f5c")
    } catch (e) {}
  }();
//# sourceMappingURL=12145.5c34d9102bdfee4a1dcb.js.map