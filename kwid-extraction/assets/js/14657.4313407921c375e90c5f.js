/*! For license information please see 14657.4313407921c375e90c5f.js.LICENSE.txt */
(window.webpackChunk = window.webpackChunk || []).push([
  [14657, 52657], {
    162262: (e, t, n) => {
      var i, o, s, r;
      r = function(e) {
        var t, n = {
          mixins: {},
          mixin: function(t) {
            var i = e.chain(arguments).toArray().slice(1).flatten().value(),
              o = t.prototype || t,
              s = {};
            return e.each(i, (function(t) {
              e.isString(t) && (t = n.mixins[t]), e.each(t, (function(t, n) {
                if (e.isFunction(t)) {
                  if (o[n] === t) return;
                  o[n] && (s[n] = s.hasOwnProperty(n) ? s[n] : [o[n]], s[n].push(t)), o[n] = t
                } else e.isArray(t) ? o[n] = e.union(t, o[n] || []) : e.isObject(t) ? o[n] = e.extend({}, t, o[n] || {}) : n in o || (o[n] = t)
              }))
            })), e.each(s, (function(t, n) {
              o[n] = function() {
                var n, i = this,
                  o = arguments;
                return e.each(t, (function(t) {
                  var s = e.isFunction(t) ? t.apply(i, o) : t;
                  n = void 0 === s ? n : s
                })), n
              }
            })), t
          },
          patch: function(i, o) {
            var s = [i.Model, i.Collection, i.Router, i.View].concat(o || []);
            t = i.Model.extend;
            var r = function(e, i) {
              var o = t.call(this, e, i),
                s = o.prototype.mixins;
              return s && o.prototype.hasOwnProperty("mixins") && n.mixin(o, s), o
            };
            e.each(s, (function(t) {
              t.mixin = function() {
                n.mixin(this, e.toArray(arguments))
              }, t.extend = r
            }))
          },
          unpatch: function(n) {
            e.each([n.Model, n.Collection, n.Router, n.View], (function(e) {
              e.mixin = void 0, e.extend = t
            }))
          }
        };
        return n
      }, e.exports ? e.exports = r(n(629133)) : (o = [n(629133)], void 0 === (s = "function" == typeof(i = r) ? i.apply(t, o) : i) || (e.exports = s));
      var a = "cocktail";
      window.define(a, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof s === t ? typeof e === t ? void 0 : e.exports : s : __webpack_exports__;
        return n && n.default || n
      })), window.require([a])
    },
    259913: function(e) {
      e.exports = function() {
        "use strict";
        var e = Object.assign || function(e) {
            for (var t, n = 1, i = arguments.length; n < i; n++)
              for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            return e
          },
          t = [
            ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
            ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
            ["opera", /OPR\/([0-9\.]+)(:?\s|$)$/],
            ["edge", /Edge\/([0-9\._]+)/],
            ["ie", /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
            ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
            ["ie", /MSIE\s(7\.0)/],
            ["safari", /Version\/([0-9\._]+).*Safari/],
            ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
            ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
            ["android", /Android\s([0-9\.]+)/],
            ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
            ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
            ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/]
          ],
          n = ["Windows Phone", "Android", "CentOS", {
            name: "Chrome OS",
            pattern: "CrOS"
          }, "Debian", "Fedora", "FreeBSD", "Gentoo", "Haiku", "Kubuntu", "Linux Mint", "OpenBSD", "Red Hat", "SuSE", "Ubuntu", "Xubuntu", "Cygwin", "Symbian OS", "hpwOS", "webOS ", "webOS", "Tablet OS", "Tizen", "Linux", "Mac OS X", "Macintosh", "Mac", "Windows 98;", "Windows "],
          i = {
            "10.0": "10",
            6.4: "10 Technical Preview",
            6.3: "8.1",
            6.2: "8",
            6.1: "Server 2008 R2 / 7",
            "6.0": "Server 2008 / Vista",
            5.2: "Server 2003 / XP 64-bit",
            5.1: "XP",
            5.01: "2000 SP1",
            "5.0": "2000",
            "4.0": "NT",
            "4.90": "ME"
          },
          o = new RegExp(["(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|", "compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|", "midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)", "\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|", "wap|windows ce|xda|xiino"].join(""), "i"),
          s = new RegExp(["1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|", "ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|", "avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|", "cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|", "ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|", "g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|", "hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|", "i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|", "kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])", "|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|", "mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|", "n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|", "op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|", "po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|", "raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|", "se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|k\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|", "so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|", "tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|", "veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|", "w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-"].join(""), "i"),
          r = function() {
            function r(e, t, n) {
              this.navigator = t, this.process = n, this.userAgent = e || (this.navigator ? t.userAgent || t.vendor : "")
            }
            return r.prototype.detect = function() {
              if (this.process && !this.userAgent) {
                var t = this.process.version.slice(1).split(".").slice(0, 3),
                  n = Array.prototype.slice.call(t, 1).join("") || "0";
                return {
                  name: "node",
                  version: t.join("."),
                  versionNumber: parseFloat(t[0] + "." + n),
                  mobile: !1,
                  os: this.process.platform
                }
              }
              return this.userAgent || this.handleMissingError(), e({}, this.checkBrowser(), this.checkMobile(), this.checkOs())
            }, r.prototype.checkBrowser = function() {
              var e = this;
              return t.filter((function(t) {
                return t[1].test(e.userAgent)
              })).map((function(t) {
                var n = t[1].exec(e.userAgent),
                  i = n && n[1].split(/[._]/).slice(0, 3),
                  o = Array.prototype.slice.call(i, 1).join("") || "0";
                return i && i.length < 3 && Array.prototype.push.apply(i, 1 === i.length ? [0, 0] : [0]), {
                  name: String(t[0]),
                  version: i.join("."),
                  versionNumber: Number(i[0] + "." + o)
                }
              })).shift()
            }, r.prototype.checkMobile = function() {
              var e = this.userAgent.substr(0, 4);
              return {
                mobile: o.test(this.userAgent) || s.test(e)
              }
            }, r.prototype.checkOs = function() {
              var e = this;
              return n.map((function(t) {
                var n = t.name || t,
                  i = e.getOsPattern(t);
                return {
                  name: n,
                  pattern: i,
                  value: RegExp("\\b" + i.replace(/([ -])(?!$)/g, "$1?") + "(?:x?[\\d._]+|[ \\w.]*)", "i").exec(e.userAgent)
                }
              })).filter((function(e) {
                return e.value
              })).map((function(e) {
                var t, n = e.value[0] || "";
                return e.pattern && e.name && /^Win/i.test(n) && !/^Windows Phone /i.test(n) && (t = i[n.replace(/[^\d.]/g, "")]) && (n = "Windows " + t), e.pattern && e.name && (n = n.replace(RegExp(e.pattern, "i"), e.name)), n = n.replace(/ ce$/i, " CE").replace(/\bhpw/i, "web").replace(/\bMacintosh\b/, "Mac OS").replace(/_PowerPC\b/i, " OS").replace(/\b(OS X) [^ \d]+/i, "$1").replace(/\bMac (OS X)\b/, "$1").replace(/\/(\d)/, " $1").replace(/_/g, ".").replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, "").replace(/\bx86\.64\b/gi, "x86_64").replace(/\b(Windows Phone) OS\b/, "$1").replace(/\b(Chrome OS \w+) [\d.]+\b/, "$1").split(" on ")[0].trim(), {
                  os: n = /^(?:webOS|i(?:OS|P))/.test(n) ? n : n.charAt(0).toUpperCase() + n.slice(1)
                }
              })).shift()
            }, r.prototype.getOsPattern = function(e) {
              var t = e;
              return ("string" == typeof e ? e : void 0) || t.pattern || t.name
            }, r.prototype.handleMissingError = function() {
              throw new Error("Please give user-agent.\n> browser(navigator.userAgent or res.headers['user-agent']).")
            }, r
          }();

        function a(e, t) {
          return e(t = {
            exports: {}
          }, t.exports), t.exports
        }
        var l = a((function(e) {
            var t = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
            "number" == typeof __g && (__g = t)
          })),
          c = a((function(e) {
            var t = e.exports = {
              version: "2.5.7"
            };
            "number" == typeof __e && (__e = t)
          })),
          u = (c.version, function(e) {
            return "object" == typeof e ? null !== e : "function" == typeof e
          }),
          d = function(e) {
            if (!u(e)) throw TypeError(e + " is not an object!");
            return e
          },
          h = function(e) {
            try {
              return !!e()
            } catch (e) {
              return !0
            }
          },
          p = !h((function() {
            return 7 != Object.defineProperty({}, "a", {
              get: function() {
                return 7
              }
            }).a
          })),
          f = l.document,
          _ = u(f) && u(f.createElement),
          g = !p && !h((function() {
            return 7 != Object.defineProperty((e = "div", _ ? f.createElement(e) : {}), "a", {
              get: function() {
                return 7
              }
            }).a;
            var e
          })),
          m = Object.defineProperty,
          v = {
            f: p ? Object.defineProperty : function(e, t, n) {
              if (d(e), t = function(e, t) {
                  if (!u(e)) return e;
                  var n, i;
                  if (t && "function" == typeof(n = e.toString) && !u(i = n.call(e))) return i;
                  if ("function" == typeof(n = e.valueOf) && !u(i = n.call(e))) return i;
                  if (!t && "function" == typeof(n = e.toString) && !u(i = n.call(e))) return i;
                  throw TypeError("Can't convert object to primitive value")
                }(t, !0), d(n), g) try {
                return m(e, t, n)
              } catch (e) {}
              if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
              return "value" in n && (e[t] = n.value), e
            }
          },
          y = p ? function(e, t, n) {
            return v.f(e, t, function(e, t) {
              return {
                enumerable: !(1 & e),
                configurable: !(2 & e),
                writable: !(4 & e),
                value: t
              }
            }(1, n))
          } : function(e, t, n) {
            return e[t] = n, e
          },
          b = {}.hasOwnProperty,
          w = function(e, t) {
            return b.call(e, t)
          },
          P = 0,
          E = Math.random(),
          C = function(e) {
            return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++P + E).toString(36))
          },
          k = a((function(e) {
            var t = C("src"),
              n = "toString",
              i = Function[n],
              o = ("" + i).split(n);
            c.inspectSource = function(e) {
              return i.call(e)
            }, (e.exports = function(e, n, i, s) {
              var r = "function" == typeof i;
              r && (w(i, "name") || y(i, "name", n)), e[n] !== i && (r && (w(i, t) || y(i, t, e[n] ? "" + e[n] : o.join(String(n)))), e === l ? e[n] = i : s ? e[n] ? e[n] = i : y(e, n, i) : (delete e[n], y(e, n, i)))
            })(Function.prototype, n, (function() {
              return "function" == typeof this && this[t] || i.call(this)
            }))
          })),
          I = function(e, t, n) {
            if (function(e) {
                if ("function" != typeof e) throw TypeError(e + " is not a function!")
              }(e), void 0 === t) return e;
            switch (n) {
              case 1:
                return function(n) {
                  return e.call(t, n)
                };
              case 2:
                return function(n, i) {
                  return e.call(t, n, i)
                };
              case 3:
                return function(n, i, o) {
                  return e.call(t, n, i, o)
                }
            }
            return function() {
              return e.apply(t, arguments)
            }
          },
          A = "prototype",
          T = function(e, t, n) {
            var i, o, s, r, a = e & T.F,
              u = e & T.G,
              d = e & T.S,
              h = e & T.P,
              p = e & T.B,
              f = u ? l : d ? l[t] || (l[t] = {}) : (l[t] || {})[A],
              _ = u ? c : c[t] || (c[t] = {}),
              g = _[A] || (_[A] = {});
            for (i in u && (n = t), n) s = ((o = !a && f && void 0 !== f[i]) ? f : n)[i], r = p && o ? I(s, l) : h && "function" == typeof s ? I(Function.call, s) : s, f && k(f, i, s, e & T.U), _[i] != s && y(_, i, r), h && g[i] != s && (g[i] = s)
          };
        l.core = c, T.F = 1, T.G = 2, T.S = 4, T.P = 8, T.B = 16, T.W = 32, T.U = 64, T.R = 128;
        var S = T,
          x = {}.toString,
          D = function(e) {
            return x.call(e).slice(8, -1)
          },
          O = Object("z").propertyIsEnumerable(0) ? Object : function(e) {
            return "String" == D(e) ? e.split("") : Object(e)
          },
          M = function(e) {
            if (null == e) throw TypeError("Can't call method on  " + e);
            return e
          },
          N = Math.ceil,
          R = Math.floor,
          L = Math.min,
          j = function(e) {
            return e > 0 ? L(function(e) {
              return isNaN(e = +e) ? 0 : (e > 0 ? R : N)(e)
            }(e), 9007199254740991) : 0
          },
          z = Array.isArray || function(e) {
            return "Array" == D(e)
          },
          F = a((function(e) {
            var t = "__core-js_shared__",
              n = l[t] || (l[t] = {});
            (e.exports = function(e, t) {
              return n[e] || (n[e] = void 0 !== t ? t : {})
            })("versions", []).push({
              version: c.version,
              mode: "global",
              copyright: "© 2018 Denis Pushkarev (zloirock.ru)"
            })
          })),
          B = a((function(e) {
            var t = F("wks"),
              n = l.Symbol,
              i = "function" == typeof n;
            (e.exports = function(e) {
              return t[e] || (t[e] = i && n[e] || (i ? n : C)("Symbol." + e))
            }).store = t
          })),
          $ = B("species"),
          H = function(e, t) {
            return new(function(e) {
              var t;
              return z(e) && ("function" != typeof(t = e.constructor) || t !== Array && !z(t.prototype) || (t = void 0), u(t) && null === (t = t[$]) && (t = void 0)), void 0 === t ? Array : t
            }(e))(t)
          },
          W = function(e, t) {
            var n = 1 == e,
              i = 2 == e,
              o = 3 == e,
              s = 4 == e,
              r = 6 == e,
              a = 5 == e || r,
              l = t || H;
            return function(t, c, u) {
              for (var d, h, p = Object(M(t)), f = O(p), _ = I(c, u, 3), g = j(f.length), m = 0, v = n ? l(t, g) : i ? l(t, 0) : void 0; g > m; m++)
                if ((a || m in f) && (h = _(d = f[m], m, p), e))
                  if (n) v[m] = h;
                  else if (h) switch (e) {
                case 3:
                  return !0;
                case 5:
                  return d;
                case 6:
                  return m;
                case 2:
                  v.push(d)
              } else if (s) return !1;
              return r ? -1 : o || s ? s : v
            }
          },
          U = function(e, t) {
            return !!e && h((function() {
              t ? e.call(null, (function() {}), 1) : e.call(null)
            }))
          },
          V = W(2);
        S(S.P + S.F * !U([].filter, !0), "Array", {
          filter: function(e) {
            return V(this, e, arguments[1])
          }
        }), c.Array.filter;
        var K = W(1);
        S(S.P + S.F * !U([].map, !0), "Array", {
          map: function(e) {
            return K(this, e, arguments[1])
          }
        }), c.Array.map;
        var q = "\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff",
          Y = "[" + q + "]",
          G = RegExp("^" + Y + Y + "*"),
          X = RegExp(Y + Y + "*$"),
          J = function(e, t, n) {
            var i = {},
              o = h((function() {
                return !!q[e]() || "​" != "​" [e]()
              })),
              s = i[e] = o ? t(Z) : q[e];
            n && (i[n] = s), S(S.P + S.F * o, "String", i)
          },
          Z = J.trim = function(e, t) {
            return e = String(M(e)), 1 & t && (e = e.replace(G, "")), 2 & t && (e = e.replace(X, "")), e
          };
        J("trim", (function(e) {
          return function() {
            return e(this, 3)
          }
        })), c.String.trim;
        var Q = "undefined" != typeof window ? window.navigator : void 0,
          ee = "undefined" != typeof process ? process : void 0;
        return function(e) {
          return new r(e, Q, ee).detect()
        }
      }();
      var t = "browser-detect";
      window.define(t, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof e === t ? void 0 : e.exports : __WEBPACK_AMD_DEFINE_RESULT__ : __webpack_exports__;
        return n && n.default || n
      })), window.require([t])
    },
    397738: function(e, t, n) {
      var i, o, s, r;
      o = this, s = function(e) {
        "use strict";

        function t(e, t) {
          for (var n = 0, i = e.length; n < i && !1 !== t(e[n], n); n++);
        }

        function n(e) {
          this.options = e, !e.deferSetup && this.setup()
        }

        function i(t, n) {
          this.query = t, this.isUnconditional = n, this.handlers = [], this.mql = e(t);
          var i = this;
          this.listener = function(e) {
            i.mql = e, i.assess()
          }, this.mql.addListener(this.listener)
        }

        function o() {
          if (!e) throw new Error("matchMedia not present, legacy browsers require a polyfill");
          this.queries = {}, this.browserIsIncapable = !e("only all").matches
        }
        return n.prototype = {
          setup: function() {
            this.options.setup && this.options.setup(), this.initialised = !0
          },
          on: function() {
            !this.initialised && this.setup(), this.options.match && this.options.match()
          },
          off: function() {
            this.options.unmatch && this.options.unmatch()
          },
          destroy: function() {
            this.options.destroy ? this.options.destroy() : this.off()
          },
          equals: function(e) {
            return this.options === e || this.options.match === e
          }
        }, i.prototype = {
          addHandler: function(e) {
            var t = new n(e);
            this.handlers.push(t), this.matches() && t.on()
          },
          removeHandler: function(e) {
            var n = this.handlers;
            t(n, (function(t, i) {
              if (t.equals(e)) return t.destroy(), !n.splice(i, 1)
            }))
          },
          matches: function() {
            return this.mql.matches || this.isUnconditional
          },
          clear: function() {
            t(this.handlers, (function(e) {
              e.destroy()
            })), this.mql.removeListener(this.listener), this.handlers.length = 0
          },
          assess: function() {
            var e = this.matches() ? "on" : "off";
            t(this.handlers, (function(t) {
              t[e]()
            }))
          }
        }, o.prototype = {
          register: function(e, n, o) {
            var s, r = this.queries,
              a = o && this.browserIsIncapable;
            return r[e] || (r[e] = new i(e, a)), "function" == typeof n && (n = {
              match: n
            }), s = n, "[object Array]" === Object.prototype.toString.apply(s) || (n = [n]), t(n, (function(t) {
              r[e].addHandler(t)
            })), this
          },
          unregister: function(e, t) {
            var n = this.queries[e];
            return n && (t ? n.removeHandler(t) : (n.clear(), delete this.queries[e])), this
          }
        }, new o
      }, r = window.matchMedia, e.exports ? e.exports = s(r) : void 0 === (i = function() {
        return o.enquire = s(r)
      }.call(t, n, t, e)) || (e.exports = i);
      var a = "enquire";
      window.define(a, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof i === t ? typeof e === t ? void 0 : e.exports : i : __webpack_exports__;
        return n && n.default || n
      })), window.require([a])
    },
    95871: (e, t, n) => {
      var i, o, s;
      o = [n(661533)], void 0 === (s = "function" == typeof(i = function(e) {
        var t, n, i = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
          o = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
          s = Array.prototype.slice;
        if (e.event.fixHooks)
          for (var r = i.length; r;) e.event.fixHooks[i[--r]] = e.event.mouseHooks;
        var a = e.event.special.mousewheel = {
          version: "3.1.12",
          setup: function() {
            if (this.addEventListener)
              for (var t = o.length; t;) this.addEventListener(o[--t], l, !1);
            else this.onmousewheel = l;
            e.data(this, "mousewheel-line-height", a.getLineHeight(this)), e.data(this, "mousewheel-page-height", a.getPageHeight(this))
          },
          teardown: function() {
            if (this.removeEventListener)
              for (var t = o.length; t;) this.removeEventListener(o[--t], l, !1);
            else this.onmousewheel = null;
            e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
          },
          getLineHeight: function(t) {
            var n = e(t),
              i = n["offsetParent" in e.fn ? "offsetParent" : "parent"]();
            return i.length || (i = e("body")), parseInt(i.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
          },
          getPageHeight: function(t) {
            return e(t).height()
          },
          settings: {
            adjustOldDeltas: !0,
            normalizeOffset: !0
          }
        };

        function l(i) {
          var o = i || window.event,
            r = s.call(arguments, 1),
            l = 0,
            d = 0,
            h = 0,
            p = 0,
            f = 0,
            _ = 0;
          if ((i = e.event.fix(o)).type = "mousewheel", "detail" in o && (h = -1 * o.detail), "wheelDelta" in o && (h = o.wheelDelta), "wheelDeltaY" in o && (h = o.wheelDeltaY), "wheelDeltaX" in o && (d = -1 * o.wheelDeltaX), "axis" in o && o.axis === o.HORIZONTAL_AXIS && (d = -1 * h, h = 0), l = 0 === h ? d : h, "deltaY" in o && (l = h = -1 * o.deltaY), "deltaX" in o && (d = o.deltaX, 0 === h && (l = -1 * d)), 0 !== h || 0 !== d) {
            if (1 === o.deltaMode) {
              var g = e.data(this, "mousewheel-line-height");
              l *= g, h *= g, d *= g
            } else if (2 === o.deltaMode) {
              var m = e.data(this, "mousewheel-page-height");
              l *= m, h *= m, d *= m
            }
            if (p = Math.max(Math.abs(h), Math.abs(d)), (!n || p < n) && (n = p, u(o, p) && (n /= 40)), u(o, p) && (l /= 40, d /= 40, h /= 40), l = Math[l >= 1 ? "floor" : "ceil"](l / n), d = Math[d >= 1 ? "floor" : "ceil"](d / n), h = Math[h >= 1 ? "floor" : "ceil"](h / n), a.settings.normalizeOffset && this.getBoundingClientRect) {
              var v = this.getBoundingClientRect();
              f = i.clientX - v.left, _ = i.clientY - v.top
            }
            return i.deltaX = d, i.deltaY = h, i.deltaFactor = n, i.offsetX = f, i.offsetY = _, i.deltaMode = 0, r.unshift(i, l, d, h), t && clearTimeout(t), t = setTimeout(c, 200), (e.event.dispatch || e.event.handle).apply(this, r)
          }
        }

        function c() {
          n = null
        }

        function u(e, t) {
          return a.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0
        }
        e.fn.extend({
          mousewheel: function(e) {
            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
          },
          unmousewheel: function(e) {
            return this.unbind("mousewheel", e)
          }
        })
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    876901: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(145027)], void 0 === (s = "function" == typeof(i = function(e) {
        var t, n = {},
          i = function(e) {
            var t, n = document.createElement("div");
            for (t = 0; t < e.length; t++)
              if (null != n.style[e[t]]) return e[t];
            return ""
          };
        n.transform = i(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"]), n.transition = i(["transition", "WebkitTransition", "MozTransition", "OTransition", "msTransition"]), t = n.transform && n.transition, e.widget("ui.sortable", e.ui.sortable, {
          options: {
            animation: 0
          },
          _rearrange: function(i, o) {
            var s, r, a = {},
              l = {},
              c = e.trim(this.options.axis);
            if (!parseInt(this.currentContainer.options.animation) || !c) return this._superApply(arguments);
            s = e(o.item[0]), r = ("up" == this.direction ? "" : "-") + s["x" == c ? "width" : "height"]() + "px", this._superApply(arguments), t ? a[n.transform] = ("x" == c ? "translateX" : "translateY") + "(" + r + ")" : (a = {
              position: "relative"
            })["x" == c ? "left" : "top"] = r, s.css(a), t ? (a[n.transition] = n.transform + " " + this.options.animation + "ms", a[n.transform] = "", l[n.transform] = "", l[n.transition] = "", setTimeout((function() {
              s.css(a)
            }), 0)) : (l.top = "", l.position = "", s.animate({
              top: "",
              position: ""
            }, this.options.animation)), setTimeout((function() {
              s.css(l)
            }), this.options.animation)
          }
        })
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    259085: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.extend(e.expr[":"], {
          data: e.expr.createPseudo ? e.expr.createPseudo((function(t) {
            return function(n) {
              return !!e.data(n, t)
            }
          })) : function(t, n, i) {
            return !!e.data(t, i[3])
          }
        })
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    256547: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.fn.extend({
          disableSelection: (t = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown", function() {
            return this.on(t + ".ui-disableSelection", (function(e) {
              e.preventDefault()
            }))
          }),
          enableSelection: function() {
            return this.off(".ui-disableSelection")
          }
        });
        var t
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    316936: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase())
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    866484: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], i = function(e) {
        return e.ui.plugin = {
          add: function(t, n, i) {
            var o, s = e.ui[t].prototype;
            for (o in i) s.plugins[o] = s.plugins[o] || [], s.plugins[o].push([n, i[o]])
          },
          call: function(e, t, n, i) {
            var o, s = e.plugins[t];
            if (s && (i || e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType))
              for (o = 0; o < s.length; o++) e.options[s[o][0]] && s[o][1].apply(e.element, n)
          }
        }
      }, void 0 === (s = i.apply(t, o)) || (e.exports = s)
    },
    382915: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.ui.safeActiveElement = function(e) {
          var t;
          try {
            t = e.activeElement
          } catch (n) {
            t = e.body
          }
          return t || (t = e.body), t.nodeName || (t = e.body), t
        }
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    976552: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.ui.safeBlur = function(t) {
          t && "body" !== t.nodeName.toLowerCase() && e(t).trigger("blur")
        }
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    317626: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.fn.scrollParent = function(t) {
          var n = this.css("position"),
            i = "absolute" === n,
            o = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
            s = this.parents().filter((function() {
              var t = e(this);
              return (!i || "static" !== t.css("position")) && o.test(t.css("overflow") + t.css("overflow-y") + t.css("overflow-x"))
            })).eq(0);
          return "fixed" !== n && s.length ? s : e(this[0].ownerDocument || document)
        }
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    948220: (e, t, n) => {
      var i, o, s;
      o = [n(661533)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.ui = e.ui || {}, e.ui.version = "1.12.1"
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    528803: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(948220)], void 0 === (s = "function" == typeof(i = function(e) {
        var t, n = 0,
          i = Array.prototype.slice;
        return e.cleanData = (t = e.cleanData, function(n) {
          var i, o, s;
          for (s = 0; null != (o = n[s]); s++) try {
            (i = e._data(o, "events")) && i.remove && e(o).triggerHandler("remove")
          } catch (e) {}
          t(n)
        }), e.widget = function(t, n, i) {
          var o, s, r, a = {},
            l = t.split(".")[0],
            c = l + "-" + (t = t.split(".")[1]);
          return i || (i = n, n = e.Widget), e.isArray(i) && (i = e.extend.apply(null, [{}].concat(i))), e.expr[":"][c.toLowerCase()] = function(t) {
            return !!e.data(t, c)
          }, e[l] = e[l] || {}, o = e[l][t], s = e[l][t] = function(e, t) {
            if (!this._createWidget) return new s(e, t);
            arguments.length && this._createWidget(e, t)
          }, e.extend(s, o, {
            version: i.version,
            _proto: e.extend({}, i),
            _childConstructors: []
          }), (r = new n).options = e.widget.extend({}, r.options), e.each(i, (function(t, i) {
            e.isFunction(i) ? a[t] = function() {
              function e() {
                return n.prototype[t].apply(this, arguments)
              }

              function o(e) {
                return n.prototype[t].apply(this, e)
              }
              return function() {
                var t, n = this._super,
                  s = this._superApply;
                return this._super = e, this._superApply = o, t = i.apply(this, arguments), this._super = n, this._superApply = s, t
              }
            }() : a[t] = i
          })), s.prototype = e.widget.extend(r, {
            widgetEventPrefix: o && r.widgetEventPrefix || t
          }, a, {
            constructor: s,
            namespace: l,
            widgetName: t,
            widgetFullName: c
          }), o ? (e.each(o._childConstructors, (function(t, n) {
            var i = n.prototype;
            e.widget(i.namespace + "." + i.widgetName, s, n._proto)
          })), delete o._childConstructors) : n._childConstructors.push(s), e.widget.bridge(t, s), s
        }, e.widget.extend = function(t) {
          for (var n, o, s = i.call(arguments, 1), r = 0, a = s.length; r < a; r++)
            for (n in s[r]) o = s[r][n], s[r].hasOwnProperty(n) && void 0 !== o && (e.isPlainObject(o) ? t[n] = e.isPlainObject(t[n]) ? e.widget.extend({}, t[n], o) : e.widget.extend({}, o) : t[n] = o);
          return t
        }, e.widget.bridge = function(t, n) {
          var o = n.prototype.widgetFullName || t;
          e.fn[t] = function(s) {
            var r = "string" == typeof s,
              a = i.call(arguments, 1),
              l = this;
            return r ? this.length || "instance" !== s ? this.each((function() {
              var n, i = e.data(this, o);
              return "instance" === s ? (l = i, !1) : i ? e.isFunction(i[s]) && "_" !== s.charAt(0) ? (n = i[s].apply(i, a)) !== i && void 0 !== n ? (l = n && n.jquery ? l.pushStack(n.get()) : n, !1) : void 0 : e.error("no such method '" + s + "' for " + t + " widget instance") : e.error("cannot call methods on " + t + " prior to initialization; attempted to call method '" + s + "'")
            })) : l = void 0 : (a.length && (s = e.widget.extend.apply(null, [s].concat(a))), this.each((function() {
              var t = e.data(this, o);
              t ? (t.option(s || {}), t._init && t._init()) : e.data(this, o, new n(s, this))
            }))), l
          }
        }, e.Widget = function() {}, e.Widget._childConstructors = [], e.Widget.prototype = {
          widgetName: "widget",
          widgetEventPrefix: "",
          defaultElement: "<div>",
          options: {
            classes: {},
            disabled: !1,
            create: null
          },
          _createWidget: function(t, i) {
            i = e(i || this.defaultElement || this)[0], this.element = e(i), this.uuid = n++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = e(), this.hoverable = e(), this.focusable = e(), this.classesElementLookup = {}, i !== this && (e.data(i, this.widgetFullName, this), this._on(!0, this.element, {
              remove: function(e) {
                e.target === i && this.destroy()
              }
            }), this.document = e(i.style ? i.ownerDocument : i.document || i), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this._create(), this.options.disabled && this._setOptionDisabled(this.options.disabled), this._trigger("create", null, this._getCreateEventData()), this._init()
          },
          _getCreateOptions: function() {
            return {}
          },
          _getCreateEventData: e.noop,
          _create: e.noop,
          _init: e.noop,
          destroy: function() {
            var t = this;
            this._destroy(), e.each(this.classesElementLookup, (function(e, n) {
              t._removeClass(n, e)
            })), this.element.off(this.eventNamespace).removeData(this.widgetFullName), this.widget().off(this.eventNamespace).removeAttr("aria-disabled"), this.bindings.off(this.eventNamespace)
          },
          _destroy: e.noop,
          widget: function() {
            return this.element
          },
          option: function(t, n) {
            var i, o, s, r = t;
            if (0 === arguments.length) return e.widget.extend({}, this.options);
            if ("string" == typeof t)
              if (r = {}, i = t.split("."), t = i.shift(), i.length) {
                for (o = r[t] = e.widget.extend({}, this.options[t]), s = 0; s < i.length - 1; s++) o[i[s]] = o[i[s]] || {}, o = o[i[s]];
                if (t = i.pop(), 1 === arguments.length) return void 0 === o[t] ? null : o[t];
                o[t] = n
              } else {
                if (1 === arguments.length) return void 0 === this.options[t] ? null : this.options[t];
                r[t] = n
              } return this._setOptions(r), this
          },
          _setOptions: function(e) {
            var t;
            for (t in e) this._setOption(t, e[t]);
            return this
          },
          _setOption: function(e, t) {
            return "classes" === e && this._setOptionClasses(t), this.options[e] = t, "disabled" === e && this._setOptionDisabled(t), this
          },
          _setOptionClasses: function(t) {
            var n, i, o;
            for (n in t) o = this.classesElementLookup[n], t[n] !== this.options.classes[n] && o && o.length && (i = e(o.get()), this._removeClass(o, n), i.addClass(this._classes({
              element: i,
              keys: n,
              classes: t,
              add: !0
            })))
          },
          _setOptionDisabled: function(e) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!e), e && (this._removeClass(this.hoverable, null, "ui-state-hover"), this._removeClass(this.focusable, null, "ui-state-focus"))
          },
          enable: function() {
            return this._setOptions({
              disabled: !1
            })
          },
          disable: function() {
            return this._setOptions({
              disabled: !0
            })
          },
          _classes: function(t) {
            var n = [],
              i = this;

            function o(o, s) {
              var r, a;
              for (a = 0; a < o.length; a++) r = i.classesElementLookup[o[a]] || e(), r = t.add ? e(e.unique(r.get().concat(t.element.get()))) : e(r.not(t.element).get()), i.classesElementLookup[o[a]] = r, n.push(o[a]), s && t.classes[o[a]] && n.push(t.classes[o[a]])
            }
            return t = e.extend({
              element: this.element,
              classes: this.options.classes || {}
            }, t), this._on(t.element, {
              remove: "_untrackClassesElement"
            }), t.keys && o(t.keys.match(/\S+/g) || [], !0), t.extra && o(t.extra.match(/\S+/g) || []), n.join(" ")
          },
          _untrackClassesElement: function(t) {
            var n = this;
            e.each(n.classesElementLookup, (function(i, o) {
              -1 !== e.inArray(t.target, o) && (n.classesElementLookup[i] = e(o.not(t.target).get()))
            }))
          },
          _removeClass: function(e, t, n) {
            return this._toggleClass(e, t, n, !1)
          },
          _addClass: function(e, t, n) {
            return this._toggleClass(e, t, n, !0)
          },
          _toggleClass: function(e, t, n, i) {
            i = "boolean" == typeof i ? i : n;
            var o = "string" == typeof e || null === e,
              s = {
                extra: o ? t : n,
                keys: o ? e : t,
                element: o ? this.element : e,
                add: i
              };
            return s.element.toggleClass(this._classes(s), i), this
          },
          _on: function(t, n, i) {
            var o, s = this;
            "boolean" != typeof t && (i = n, n = t, t = !1), i ? (n = o = e(n), this.bindings = this.bindings.add(n)) : (i = n, n = this.element, o = this.widget()), e.each(i, (function(i, r) {
              function a() {
                if (t || !0 !== s.options.disabled && !e(this).hasClass("ui-state-disabled")) return ("string" == typeof r ? s[r] : r).apply(s, arguments)
              }
              "string" != typeof r && (a.guid = r.guid = r.guid || a.guid || e.guid++);
              var l = i.match(/^([\w:-]*)\s*(.*)$/),
                c = l[1] + s.eventNamespace,
                u = l[2];
              u ? o.on(c, u, a) : n.on(c, a)
            }))
          },
          _off: function(t, n) {
            n = (n || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.off(n).off(n), this.bindings = e(this.bindings.not(t).get()), this.focusable = e(this.focusable.not(t).get()), this.hoverable = e(this.hoverable.not(t).get())
          },
          _delay: function(e, t) {
            var n = this;
            return setTimeout((function() {
              return ("string" == typeof e ? n[e] : e).apply(n, arguments)
            }), t || 0)
          },
          _hoverable: function(t) {
            this.hoverable = this.hoverable.add(t), this._on(t, {
              mouseenter: function(t) {
                this._addClass(e(t.currentTarget), null, "ui-state-hover")
              },
              mouseleave: function(t) {
                this._removeClass(e(t.currentTarget), null, "ui-state-hover")
              }
            })
          },
          _focusable: function(t) {
            this.focusable = this.focusable.add(t), this._on(t, {
              focusin: function(t) {
                this._addClass(e(t.currentTarget), null, "ui-state-focus")
              },
              focusout: function(t) {
                this._removeClass(e(t.currentTarget), null, "ui-state-focus")
              }
            })
          },
          _trigger: function(t, n, i) {
            var o, s, r = this.options[t];
            if (i = i || {}, (n = e.Event(n)).type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], s = n.originalEvent)
              for (o in s) o in n || (n[o] = s[o]);
            return this.element.trigger(n, i), !(e.isFunction(r) && !1 === r.apply(this.element[0], [n].concat(i)) || n.isDefaultPrevented())
          }
        }, e.each({
          show: "fadeIn",
          hide: "fadeOut"
        }, (function(t, n) {
          e.Widget.prototype["_" + t] = function(i, o, s) {
            var r;
            "string" == typeof o && (o = {
              effect: o
            });
            var a = o ? !0 === o || "number" == typeof o ? n : o.effect || n : t;
            "number" == typeof(o = o || {}) && (o = {
              duration: o
            }), r = !e.isEmptyObject(o), o.complete = s, o.delay && i.delay(o.delay), r && e.effects && e.effects.effect[a] ? i[t](o) : a !== t && i[a] ? i[a](o.duration, o.easing, s) : i.queue((function(n) {
              e(this)[t](), s && s.call(i[0]), n()
            }))
          }
        })), e.widget
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    659642: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(462106), n(259085), n(866484), n(382915), n(976552), n(317626), n(948220), n(528803)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.widget("ui.draggable", e.ui.mouse, {
          version: "1.12.1",
          widgetEventPrefix: "drag",
          options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
          },
          _create: function() {
            "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this._addClass("ui-draggable"), this._setHandleClassName(), this._mouseInit()
          },
          _setOption: function(e, t) {
            this._super(e, t), "handle" === e && (this._removeHandleClassName(), this._setHandleClassName())
          },
          _destroy: function() {
            (this.helper || this.element).is(".ui-draggable-dragging") ? this.destroyOnClear = !0 : (this._removeHandleClassName(), this._mouseDestroy())
          },
          _mouseCapture: function(t) {
            var n = this.options;
            return !(this.helper || n.disabled || e(t.target).closest(".ui-resizable-handle").length > 0 || (this.handle = this._getHandle(t), !this.handle || (this._blurActiveElement(t), this._blockFrames(!0 === n.iframeFix ? "iframe" : n.iframeFix), 0)))
          },
          _blockFrames: function(t) {
            this.iframeBlocks = this.document.find(t).map((function() {
              var t = e(this);
              return e("<div>").css("position", "absolute").appendTo(t.parent()).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()).offset(t.offset())[0]
            }))
          },
          _unblockFrames: function() {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
          },
          _blurActiveElement: function(t) {
            var n = e.ui.safeActiveElement(this.document[0]);
            e(t.target).closest(n).length || e.ui.safeBlur(n)
          },
          _mouseStart: function(t) {
            var n = this.options;
            return this.helper = this._createHelper(t), this._addClass(this.helper, "ui-draggable-dragging"), this._cacheHelperProportions(), e.ui.ddmanager && (e.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter((function() {
              return "fixed" === e(this).css("position")
            })).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(t), this.originalPosition = this.position = this._generatePosition(t, !1), this.originalPageX = t.pageX, this.originalPageY = t.pageY, n.cursorAt && this._adjustOffsetFromHelper(n.cursorAt), this._setContainment(), !1 === this._trigger("start", t) ? (this._clear(), !1) : (this._cacheHelperProportions(), e.ui.ddmanager && !n.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this._mouseDrag(t, !0), e.ui.ddmanager && e.ui.ddmanager.dragStart(this, t), !0)
          },
          _refreshOffsets: function(e) {
            this.offset = {
              top: this.positionAbs.top - this.margins.top,
              left: this.positionAbs.left - this.margins.left,
              scroll: !1,
              parent: this._getParentOffset(),
              relative: this._getRelativeOffset()
            }, this.offset.click = {
              left: e.pageX - this.offset.left,
              top: e.pageY - this.offset.top
            }
          },
          _mouseDrag: function(t, n) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(t, !0), this.positionAbs = this._convertPositionTo("absolute"), !n) {
              var i = this._uiHash();
              if (!1 === this._trigger("drag", t, i)) return this._mouseUp(new e.Event("mouseup", t)), !1;
              this.position = i.position
            }
            return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", e.ui.ddmanager && e.ui.ddmanager.drag(this, t), !1
          },
          _mouseStop: function(t) {
            var n = this,
              i = !1;
            return e.ui.ddmanager && !this.options.dropBehaviour && (i = e.ui.ddmanager.drop(this, t)), this.dropped && (i = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !i || "valid" === this.options.revert && i || !0 === this.options.revert || e.isFunction(this.options.revert) && this.options.revert.call(this.element, i) ? e(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), (function() {
              !1 !== n._trigger("stop", t) && n._clear()
            })) : !1 !== this._trigger("stop", t) && this._clear(), !1
          },
          _mouseUp: function(t) {
            return this._unblockFrames(), e.ui.ddmanager && e.ui.ddmanager.dragStop(this, t), this.handleElement.is(t.target) && this.element.trigger("focus"), e.ui.mouse.prototype._mouseUp.call(this, t)
          },
          cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new e.Event("mouseup", {
              target: this.element[0]
            })) : this._clear(), this
          },
          _getHandle: function(t) {
            return !this.options.handle || !!e(t.target).closest(this.element.find(this.options.handle)).length
          },
          _setHandleClassName: function() {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this._addClass(this.handleElement, "ui-draggable-handle")
          },
          _removeHandleClassName: function() {
            this._removeClass(this.handleElement, "ui-draggable-handle")
          },
          _createHelper: function(t) {
            var n = this.options,
              i = e.isFunction(n.helper),
              o = i ? e(n.helper.apply(this.element[0], [t])) : "clone" === n.helper ? this.element.clone().removeAttr("id") : this.element;
            return o.parents("body").length || o.appendTo("parent" === n.appendTo ? this.element[0].parentNode : n.appendTo), i && o[0] === this.element[0] && this._setPositionRelative(), o[0] === this.element[0] || /(fixed|absolute)/.test(o.css("position")) || o.css("position", "absolute"), o
          },
          _setPositionRelative: function() {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
          },
          _adjustOffsetFromHelper: function(t) {
            "string" == typeof t && (t = t.split(" ")), e.isArray(t) && (t = {
              left: +t[0],
              top: +t[1] || 0
            }), "left" in t && (this.offset.click.left = t.left + this.margins.left), "right" in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top" in t && (this.offset.click.top = t.top + this.margins.top), "bottom" in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
          },
          _isRootNode: function(e) {
            return /(html|body)/i.test(e.tagName) || e === this.document[0]
          },
          _getParentOffset: function() {
            var t = this.offsetParent.offset(),
              n = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== n && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (t = {
              top: 0,
              left: 0
            }), {
              top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
              left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
          },
          _getRelativeOffset: function() {
            if ("relative" !== this.cssPosition) return {
              top: 0,
              left: 0
            };
            var e = this.element.position(),
              t = this._isRootNode(this.scrollParent[0]);
            return {
              top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + (t ? 0 : this.scrollParent.scrollTop()),
              left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + (t ? 0 : this.scrollParent.scrollLeft())
            }
          },
          _cacheMargins: function() {
            this.margins = {
              left: parseInt(this.element.css("marginLeft"), 10) || 0,
              top: parseInt(this.element.css("marginTop"), 10) || 0,
              right: parseInt(this.element.css("marginRight"), 10) || 0,
              bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
          },
          _cacheHelperProportions: function() {
            this.helperProportions = {
              width: this.helper.outerWidth(),
              height: this.helper.outerHeight()
            }
          },
          _setContainment: function() {
            var t, n, i, o = this.options,
              s = this.document[0];
            this.relativeContainer = null, o.containment ? "window" !== o.containment ? "document" !== o.containment ? o.containment.constructor !== Array ? ("parent" === o.containment && (o.containment = this.helper[0].parentNode), (i = (n = e(o.containment))[0]) && (t = /(scroll|auto)/.test(n.css("overflow")), this.containment = [(parseInt(n.css("borderLeftWidth"), 10) || 0) + (parseInt(n.css("paddingLeft"), 10) || 0), (parseInt(n.css("borderTopWidth"), 10) || 0) + (parseInt(n.css("paddingTop"), 10) || 0), (t ? Math.max(i.scrollWidth, i.offsetWidth) : i.offsetWidth) - (parseInt(n.css("borderRightWidth"), 10) || 0) - (parseInt(n.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (t ? Math.max(i.scrollHeight, i.offsetHeight) : i.offsetHeight) - (parseInt(n.css("borderBottomWidth"), 10) || 0) - (parseInt(n.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = n)) : this.containment = o.containment : this.containment = [0, 0, e(s).width() - this.helperProportions.width - this.margins.left, (e(s).height() || s.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top] : this.containment = [e(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, e(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, e(window).scrollLeft() + e(window).width() - this.helperProportions.width - this.margins.left, e(window).scrollTop() + (e(window).height() || s.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top] : this.containment = null
          },
          _convertPositionTo: function(e, t) {
            t || (t = this.position);
            var n = "absolute" === e ? 1 : -1,
              i = this._isRootNode(this.scrollParent[0]);
            return {
              top: t.top + this.offset.relative.top * n + this.offset.parent.top * n - ("fixed" === this.cssPosition ? -this.offset.scroll.top : i ? 0 : this.offset.scroll.top) * n,
              left: t.left + this.offset.relative.left * n + this.offset.parent.left * n - ("fixed" === this.cssPosition ? -this.offset.scroll.left : i ? 0 : this.offset.scroll.left) * n
            }
          },
          _generatePosition: function(e, t) {
            var n, i, o, s, r = this.options,
              a = this._isRootNode(this.scrollParent[0]),
              l = e.pageX,
              c = e.pageY;
            return a && this.offset.scroll || (this.offset.scroll = {
              top: this.scrollParent.scrollTop(),
              left: this.scrollParent.scrollLeft()
            }), t && (this.containment && (this.relativeContainer ? (i = this.relativeContainer.offset(), n = [this.containment[0] + i.left, this.containment[1] + i.top, this.containment[2] + i.left, this.containment[3] + i.top]) : n = this.containment, e.pageX - this.offset.click.left < n[0] && (l = n[0] + this.offset.click.left), e.pageY - this.offset.click.top < n[1] && (c = n[1] + this.offset.click.top), e.pageX - this.offset.click.left > n[2] && (l = n[2] + this.offset.click.left), e.pageY - this.offset.click.top > n[3] && (c = n[3] + this.offset.click.top)), r.grid && (o = r.grid[1] ? this.originalPageY + Math.round((c - this.originalPageY) / r.grid[1]) * r.grid[1] : this.originalPageY, c = n ? o - this.offset.click.top >= n[1] || o - this.offset.click.top > n[3] ? o : o - this.offset.click.top >= n[1] ? o - r.grid[1] : o + r.grid[1] : o, s = r.grid[0] ? this.originalPageX + Math.round((l - this.originalPageX) / r.grid[0]) * r.grid[0] : this.originalPageX, l = n ? s - this.offset.click.left >= n[0] || s - this.offset.click.left > n[2] ? s : s - this.offset.click.left >= n[0] ? s - r.grid[0] : s + r.grid[0] : s), "y" === r.axis && (l = this.originalPageX), "x" === r.axis && (c = this.originalPageY)), {
              top: c - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : a ? 0 : this.offset.scroll.top),
              left: l - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : a ? 0 : this.offset.scroll.left)
            }
          },
          _clear: function() {
            this._removeClass(this.helper, "ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
          },
          _trigger: function(t, n, i) {
            return i = i || this._uiHash(), e.ui.plugin.call(this, t, [n, i, this], !0), /^(drag|start|stop)/.test(t) && (this.positionAbs = this._convertPositionTo("absolute"), i.offset = this.positionAbs), e.Widget.prototype._trigger.call(this, t, n, i)
          },
          plugins: {},
          _uiHash: function() {
            return {
              helper: this.helper,
              position: this.position,
              originalPosition: this.originalPosition,
              offset: this.positionAbs
            }
          }
        }), e.ui.plugin.add("draggable", "connectToSortable", {
          start: function(t, n, i) {
            var o = e.extend({}, n, {
              item: i.element
            });
            i.sortables = [], e(i.options.connectToSortable).each((function() {
              var n = e(this).sortable("instance");
              n && !n.options.disabled && (i.sortables.push(n), n.refreshPositions(), n._trigger("activate", t, o))
            }))
          },
          stop: function(t, n, i) {
            var o = e.extend({}, n, {
              item: i.element
            });
            i.cancelHelperRemoval = !1, e.each(i.sortables, (function() {
              var e = this;
              e.isOver ? (e.isOver = 0, i.cancelHelperRemoval = !0, e.cancelHelperRemoval = !1, e._storedCSS = {
                position: e.placeholder.css("position"),
                top: e.placeholder.css("top"),
                left: e.placeholder.css("left")
              }, e._mouseStop(t), e.options.helper = e.options._helper) : (e.cancelHelperRemoval = !0, e._trigger("deactivate", t, o))
            }))
          },
          drag: function(t, n, i) {
            e.each(i.sortables, (function() {
              var o = !1,
                s = this;
              s.positionAbs = i.positionAbs, s.helperProportions = i.helperProportions, s.offset.click = i.offset.click, s._intersectsWith(s.containerCache) && (o = !0, e.each(i.sortables, (function() {
                return this.positionAbs = i.positionAbs, this.helperProportions = i.helperProportions, this.offset.click = i.offset.click, this !== s && this._intersectsWith(this.containerCache) && e.contains(s.element[0], this.element[0]) && (o = !1), o
              }))), o ? (s.isOver || (s.isOver = 1, i._parent = n.helper.parent(), s.currentItem = n.helper.appendTo(s.element).data("ui-sortable-item", !0), s.options._helper = s.options.helper, s.options.helper = function() {
                return n.helper[0]
              }, t.target = s.currentItem[0], s._mouseCapture(t, !0), s._mouseStart(t, !0, !0), s.offset.click.top = i.offset.click.top, s.offset.click.left = i.offset.click.left, s.offset.parent.left -= i.offset.parent.left - s.offset.parent.left, s.offset.parent.top -= i.offset.parent.top - s.offset.parent.top, i._trigger("toSortable", t), i.dropped = s.element, e.each(i.sortables, (function() {
                this.refreshPositions()
              })), i.currentItem = i.element, s.fromOutside = i), s.currentItem && (s._mouseDrag(t), n.position = s.position)) : s.isOver && (s.isOver = 0, s.cancelHelperRemoval = !0, s.options._revert = s.options.revert, s.options.revert = !1, s._trigger("out", t, s._uiHash(s)), s._mouseStop(t, !0), s.options.revert = s.options._revert, s.options.helper = s.options._helper, s.placeholder && s.placeholder.remove(), n.helper.appendTo(i._parent), i._refreshOffsets(t), n.position = i._generatePosition(t, !0), i._trigger("fromSortable", t), i.dropped = !1, e.each(i.sortables, (function() {
                this.refreshPositions()
              })))
            }))
          }
        }), e.ui.plugin.add("draggable", "cursor", {
          start: function(t, n, i) {
            var o = e("body"),
              s = i.options;
            o.css("cursor") && (s._cursor = o.css("cursor")), o.css("cursor", s.cursor)
          },
          stop: function(t, n, i) {
            var o = i.options;
            o._cursor && e("body").css("cursor", o._cursor)
          }
        }), e.ui.plugin.add("draggable", "opacity", {
          start: function(t, n, i) {
            var o = e(n.helper),
              s = i.options;
            o.css("opacity") && (s._opacity = o.css("opacity")), o.css("opacity", s.opacity)
          },
          stop: function(t, n, i) {
            var o = i.options;
            o._opacity && e(n.helper).css("opacity", o._opacity)
          }
        }), e.ui.plugin.add("draggable", "scroll", {
          start: function(e, t, n) {
            n.scrollParentNotHidden || (n.scrollParentNotHidden = n.helper.scrollParent(!1)), n.scrollParentNotHidden[0] !== n.document[0] && "HTML" !== n.scrollParentNotHidden[0].tagName && (n.overflowOffset = n.scrollParentNotHidden.offset())
          },
          drag: function(t, n, i) {
            var o = i.options,
              s = !1,
              r = i.scrollParentNotHidden[0],
              a = i.document[0];
            r !== a && "HTML" !== r.tagName ? (o.axis && "x" === o.axis || (i.overflowOffset.top + r.offsetHeight - t.pageY < o.scrollSensitivity ? r.scrollTop = s = r.scrollTop + o.scrollSpeed : t.pageY - i.overflowOffset.top < o.scrollSensitivity && (r.scrollTop = s = r.scrollTop - o.scrollSpeed)), o.axis && "y" === o.axis || (i.overflowOffset.left + r.offsetWidth - t.pageX < o.scrollSensitivity ? r.scrollLeft = s = r.scrollLeft + o.scrollSpeed : t.pageX - i.overflowOffset.left < o.scrollSensitivity && (r.scrollLeft = s = r.scrollLeft - o.scrollSpeed))) : (o.axis && "x" === o.axis || (t.pageY - e(a).scrollTop() < o.scrollSensitivity ? s = e(a).scrollTop(e(a).scrollTop() - o.scrollSpeed) : e(window).height() - (t.pageY - e(a).scrollTop()) < o.scrollSensitivity && (s = e(a).scrollTop(e(a).scrollTop() + o.scrollSpeed))), o.axis && "y" === o.axis || (t.pageX - e(a).scrollLeft() < o.scrollSensitivity ? s = e(a).scrollLeft(e(a).scrollLeft() - o.scrollSpeed) : e(window).width() - (t.pageX - e(a).scrollLeft()) < o.scrollSensitivity && (s = e(a).scrollLeft(e(a).scrollLeft() + o.scrollSpeed)))), !1 !== s && e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(i, t)
          }
        }), e.ui.plugin.add("draggable", "snap", {
          start: function(t, n, i) {
            var o = i.options;
            i.snapElements = [], e(o.snap.constructor !== String ? o.snap.items || ":data(ui-draggable)" : o.snap).each((function() {
              var t = e(this),
                n = t.offset();
              this !== i.element[0] && i.snapElements.push({
                item: this,
                width: t.outerWidth(),
                height: t.outerHeight(),
                top: n.top,
                left: n.left
              })
            }))
          },
          drag: function(t, n, i) {
            var o, s, r, a, l, c, u, d, h, p, f = i.options,
              _ = f.snapTolerance,
              g = n.offset.left,
              m = g + i.helperProportions.width,
              v = n.offset.top,
              y = v + i.helperProportions.height;
            for (h = i.snapElements.length - 1; h >= 0; h--) c = (l = i.snapElements[h].left - i.margins.left) + i.snapElements[h].width, d = (u = i.snapElements[h].top - i.margins.top) + i.snapElements[h].height, m < l - _ || g > c + _ || y < u - _ || v > d + _ || !e.contains(i.snapElements[h].item.ownerDocument, i.snapElements[h].item) ? (i.snapElements[h].snapping && i.options.snap.release && i.options.snap.release.call(i.element, t, e.extend(i._uiHash(), {
              snapItem: i.snapElements[h].item
            })), i.snapElements[h].snapping = !1) : ("inner" !== f.snapMode && (o = Math.abs(u - y) <= _, s = Math.abs(d - v) <= _, r = Math.abs(l - m) <= _, a = Math.abs(c - g) <= _, o && (n.position.top = i._convertPositionTo("relative", {
              top: u - i.helperProportions.height,
              left: 0
            }).top), s && (n.position.top = i._convertPositionTo("relative", {
              top: d,
              left: 0
            }).top), r && (n.position.left = i._convertPositionTo("relative", {
              top: 0,
              left: l - i.helperProportions.width
            }).left), a && (n.position.left = i._convertPositionTo("relative", {
              top: 0,
              left: c
            }).left)), p = o || s || r || a, "outer" !== f.snapMode && (o = Math.abs(u - v) <= _, s = Math.abs(d - y) <= _, r = Math.abs(l - g) <= _, a = Math.abs(c - m) <= _, o && (n.position.top = i._convertPositionTo("relative", {
              top: u,
              left: 0
            }).top), s && (n.position.top = i._convertPositionTo("relative", {
              top: d - i.helperProportions.height,
              left: 0
            }).top), r && (n.position.left = i._convertPositionTo("relative", {
              top: 0,
              left: l
            }).left), a && (n.position.left = i._convertPositionTo("relative", {
              top: 0,
              left: c - i.helperProportions.width
            }).left)), !i.snapElements[h].snapping && (o || s || r || a || p) && i.options.snap.snap && i.options.snap.snap.call(i.element, t, e.extend(i._uiHash(), {
              snapItem: i.snapElements[h].item
            })), i.snapElements[h].snapping = o || s || r || a || p)
          }
        }), e.ui.plugin.add("draggable", "stack", {
          start: function(t, n, i) {
            var o, s = i.options,
              r = e.makeArray(e(s.stack)).sort((function(t, n) {
                return (parseInt(e(t).css("zIndex"), 10) || 0) - (parseInt(e(n).css("zIndex"), 10) || 0)
              }));
            r.length && (o = parseInt(e(r[0]).css("zIndex"), 10) || 0, e(r).each((function(t) {
              e(this).css("zIndex", o + t)
            })), this.css("zIndex", o + r.length))
          }
        }), e.ui.plugin.add("draggable", "zIndex", {
          start: function(t, n, i) {
            var o = e(n.helper),
              s = i.options;
            o.css("zIndex") && (s._zIndex = o.css("zIndex")), o.css("zIndex", s.zIndex)
          },
          stop: function(t, n, i) {
            var o = i.options;
            o._zIndex && e(n.helper).css("zIndex", o._zIndex)
          }
        }), e.ui.draggable
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    517430: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(659642), n(462106), n(948220), n(528803)], void 0 === (s = "function" == typeof(i = function(e) {
        e.widget("ui.droppable", {
          version: "1.12.1",
          widgetEventPrefix: "drop",
          options: {
            accept: "*",
            addClasses: !0,
            greedy: !1,
            scope: "default",
            tolerance: "intersect",
            activate: null,
            deactivate: null,
            drop: null,
            out: null,
            over: null
          },
          _create: function() {
            var t, n = this.options,
              i = n.accept;
            this.isover = !1, this.isout = !0, this.accept = e.isFunction(i) ? i : function(e) {
              return e.is(i)
            }, this.proportions = function() {
              if (!arguments.length) return t || (t = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
              });
              t = arguments[0]
            }, this._addToManager(n.scope), n.addClasses && this._addClass("ui-droppable")
          },
          _addToManager: function(t) {
            e.ui.ddmanager.droppables[t] = e.ui.ddmanager.droppables[t] || [], e.ui.ddmanager.droppables[t].push(this)
          },
          _splice: function(e) {
            for (var t = 0; t < e.length; t++) e[t] === this && e.splice(t, 1)
          },
          _destroy: function() {
            var t = e.ui.ddmanager.droppables[this.options.scope];
            this._splice(t)
          },
          _setOption: function(t, n) {
            if ("accept" === t) this.accept = e.isFunction(n) ? n : function(e) {
              return e.is(n)
            };
            else if ("scope" === t) {
              var i = e.ui.ddmanager.droppables[this.options.scope];
              this._splice(i), this._addToManager(n)
            }
            this._super(t, n)
          },
          _activate: function(t) {
            var n = e.ui.ddmanager.current;
            this._addActiveClass(), n && this._trigger("activate", t, this.ui(n))
          },
          _deactivate: function(t) {
            var n = e.ui.ddmanager.current;
            this._removeActiveClass(), n && this._trigger("deactivate", t, this.ui(n))
          },
          _over: function(t) {
            var n = e.ui.ddmanager.current;
            n && (n.currentItem || n.element)[0] !== this.element[0] && this.accept.call(this.element[0], n.currentItem || n.element) && (this._addHoverClass(), this._trigger("over", t, this.ui(n)))
          },
          _out: function(t) {
            var n = e.ui.ddmanager.current;
            n && (n.currentItem || n.element)[0] !== this.element[0] && this.accept.call(this.element[0], n.currentItem || n.element) && (this._removeHoverClass(), this._trigger("out", t, this.ui(n)))
          },
          _drop: function(n, i) {
            var o = i || e.ui.ddmanager.current,
              s = !1;
            return !(!o || (o.currentItem || o.element)[0] === this.element[0]) && (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each((function() {
              var i = e(this).droppable("instance");
              if (i.options.greedy && !i.options.disabled && i.options.scope === o.options.scope && i.accept.call(i.element[0], o.currentItem || o.element) && t(o, e.extend(i, {
                  offset: i.element.offset()
                }), i.options.tolerance, n)) return s = !0, !1
            })), !s && !!this.accept.call(this.element[0], o.currentItem || o.element) && (this._removeActiveClass(), this._removeHoverClass(), this._trigger("drop", n, this.ui(o)), this.element))
          },
          ui: function(e) {
            return {
              draggable: e.currentItem || e.element,
              helper: e.helper,
              position: e.position,
              offset: e.positionAbs
            }
          },
          _addHoverClass: function() {
            this._addClass("ui-droppable-hover")
          },
          _removeHoverClass: function() {
            this._removeClass("ui-droppable-hover")
          },
          _addActiveClass: function() {
            this._addClass("ui-droppable-active")
          },
          _removeActiveClass: function() {
            this._removeClass("ui-droppable-active")
          }
        });
        var t = e.ui.intersect = function() {
          function e(e, t, n) {
            return e >= t && e < t + n
          }
          return function(t, n, i, o) {
            if (!n.offset) return !1;
            var s = (t.positionAbs || t.position.absolute).left + t.margins.left,
              r = (t.positionAbs || t.position.absolute).top + t.margins.top,
              a = s + t.helperProportions.width,
              l = r + t.helperProportions.height,
              c = n.offset.left,
              u = n.offset.top,
              d = c + n.proportions().width,
              h = u + n.proportions().height;
            switch (i) {
              case "fit":
                return c <= s && a <= d && u <= r && l <= h;
              case "intersect":
                return c < s + t.helperProportions.width / 2 && a - t.helperProportions.width / 2 < d && u < r + t.helperProportions.height / 2 && l - t.helperProportions.height / 2 < h;
              case "pointer":
                return e(o.pageY, u, n.proportions().height) && e(o.pageX, c, n.proportions().width);
              case "touch":
                return (r >= u && r <= h || l >= u && l <= h || r < u && l > h) && (s >= c && s <= d || a >= c && a <= d || s < c && a > d);
              default:
                return !1
            }
          }
        }();
        return e.ui.ddmanager = {
          current: null,
          droppables: {
            default: []
          },
          prepareOffsets: function(t, n) {
            var i, o, s = e.ui.ddmanager.droppables[t.options.scope] || [],
              r = n ? n.type : null,
              a = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
            e: for (i = 0; i < s.length; i++)
              if (!(s[i].options.disabled || t && !s[i].accept.call(s[i].element[0], t.currentItem || t.element))) {
                for (o = 0; o < a.length; o++)
                  if (a[o] === s[i].element[0]) {
                    s[i].proportions().height = 0;
                    continue e
                  } s[i].visible = "none" !== s[i].element.css("display"), s[i].visible && ("mousedown" === r && s[i]._activate.call(s[i], n), s[i].offset = s[i].element.offset(), s[i].proportions({
                  width: s[i].element[0].offsetWidth,
                  height: s[i].element[0].offsetHeight
                }))
              }
          },
          drop: function(n, i) {
            var o = !1;
            return e.each((e.ui.ddmanager.droppables[n.options.scope] || []).slice(), (function() {
              this.options && (!this.options.disabled && this.visible && t(n, this, this.options.tolerance, i) && (o = this._drop.call(this, i) || o), !this.options.disabled && this.visible && this.accept.call(this.element[0], n.currentItem || n.element) && (this.isout = !0, this.isover = !1, this._deactivate.call(this, i)))
            })), o
          },
          dragStart: function(t, n) {
            t.element.parentsUntil("body").on("scroll.droppable", (function() {
              t.options.refreshPositions || e.ui.ddmanager.prepareOffsets(t, n)
            }))
          },
          drag: function(n, i) {
            n.options.refreshPositions && e.ui.ddmanager.prepareOffsets(n, i), e.each(e.ui.ddmanager.droppables[n.options.scope] || [], (function() {
              if (!this.options.disabled && !this.greedyChild && this.visible) {
                var o, s, r, a = t(n, this, this.options.tolerance, i),
                  l = !a && this.isover ? "isout" : a && !this.isover ? "isover" : null;
                l && (this.options.greedy && (s = this.options.scope, (r = this.element.parents(":data(ui-droppable)").filter((function() {
                  return e(this).droppable("instance").options.scope === s
                }))).length && ((o = e(r[0]).droppable("instance")).greedyChild = "isover" === l)), o && "isover" === l && (o.isover = !1, o.isout = !0, o._out.call(o, i)), this[l] = !0, this["isout" === l ? "isover" : "isout"] = !1, this["isover" === l ? "_over" : "_out"].call(this, i), o && "isout" === l && (o.isout = !1, o.isover = !0, o._over.call(o, i)))
              }
            }))
          },
          dragStop: function(t, n) {
            t.element.parentsUntil("body").off("scroll.droppable"), t.options.refreshPositions || e.ui.ddmanager.prepareOffsets(t, n)
          }
        }, !1 !== e.uiBackCompat && e.widget("ui.droppable", e.ui.droppable, {
          options: {
            hoverClass: !1,
            activeClass: !1
          },
          _addActiveClass: function() {
            this._super(), this.options.activeClass && this.element.addClass(this.options.activeClass)
          },
          _removeActiveClass: function() {
            this._super(), this.options.activeClass && this.element.removeClass(this.options.activeClass)
          },
          _addHoverClass: function() {
            this._super(), this.options.hoverClass && this.element.addClass(this.options.hoverClass)
          },
          _removeHoverClass: function() {
            this._super(), this.options.hoverClass && this.element.removeClass(this.options.hoverClass)
          }
        }), e.ui.droppable
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    462106: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(316936), n(948220), n(528803)], void 0 === (s = "function" == typeof(i = function(e) {
        var t = !1;
        return e(document).on("mouseup", (function() {
          t = !1
        })), e.widget("ui.mouse", {
          version: "1.12.1",
          options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
          },
          _mouseInit: function() {
            var t = this;
            this.element.on("mousedown." + this.widgetName, (function(e) {
              return t._mouseDown(e)
            })).on("click." + this.widgetName, (function(n) {
              if (!0 === e.data(n.target, t.widgetName + ".preventClickEvent")) return e.removeData(n.target, t.widgetName + ".preventClickEvent"), n.stopImmediatePropagation(), !1
            })), this.started = !1
          },
          _mouseDestroy: function() {
            this.element.off("." + this.widgetName), this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
          },
          _mouseDown: function(n) {
            if (!t) {
              this._mouseMoved = !1, this._mouseStarted && this._mouseUp(n), this._mouseDownEvent = n;
              var i = this,
                o = 1 === n.which,
                s = !("string" != typeof this.options.cancel || !n.target.nodeName) && e(n.target).closest(this.options.cancel).length;
              return !(o && !s && this._mouseCapture(n) && (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout((function() {
                i.mouseDelayMet = !0
              }), this.options.delay)), this._mouseDistanceMet(n) && this._mouseDelayMet(n) && (this._mouseStarted = !1 !== this._mouseStart(n), !this._mouseStarted) ? (n.preventDefault(), 0) : (!0 === e.data(n.target, this.widgetName + ".preventClickEvent") && e.removeData(n.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(e) {
                return i._mouseMove(e)
              }, this._mouseUpDelegate = function(e) {
                return i._mouseUp(e)
              }, this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate), n.preventDefault(), t = !0, 0)))
            }
          },
          _mouseMove: function(t) {
            if (this._mouseMoved) {
              if (e.ui.ie && (!document.documentMode || document.documentMode < 9) && !t.button) return this._mouseUp(t);
              if (!t.which)
                if (t.originalEvent.altKey || t.originalEvent.ctrlKey || t.originalEvent.metaKey || t.originalEvent.shiftKey) this.ignoreMissingWhich = !0;
                else if (!this.ignoreMissingWhich) return this._mouseUp(t)
            }
            return (t.which || t.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, t), this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted)
          },
          _mouseUp: function(n) {
            this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, n.target === this._mouseDownEvent.target && e.data(n.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(n)), this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer), this.ignoreMissingWhich = !1, t = !1, n.preventDefault()
          },
          _mouseDistanceMet: function(e) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
          },
          _mouseDelayMet: function() {
            return this.mouseDelayMet
          },
          _mouseStart: function() {},
          _mouseDrag: function() {},
          _mouseStop: function() {},
          _mouseCapture: function() {
            return !0
          }
        })
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    772362: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(462106), n(256547), n(866484), n(948220), n(528803)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.widget("ui.resizable", e.ui.mouse, {
          version: "1.12.1",
          widgetEventPrefix: "resize",
          options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            classes: {
              "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
            },
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 90,
            resize: null,
            start: null,
            stop: null
          },
          _num: function(e) {
            return parseFloat(e) || 0
          },
          _isNumber: function(e) {
            return !isNaN(parseFloat(e))
          },
          _hasScroll: function(t, n) {
            if ("hidden" === e(t).css("overflow")) return !1;
            var i = n && "left" === n ? "scrollLeft" : "scrollTop",
              o = !1;
            return t[i] > 0 || (t[i] = 1, o = t[i] > 0, t[i] = 0, o)
          },
          _create: function() {
            var t, n = this.options,
              i = this;
            this._addClass("ui-resizable"), e.extend(this, {
              _aspectRatio: !!n.aspectRatio,
              aspectRatio: n.aspectRatio,
              originalElement: this.element,
              _proportionallyResizeElements: [],
              _helper: n.helper || n.ghost || n.animate ? n.helper || "ui-resizable-helper" : null
            }), this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i) && (this.element.wrap(e("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
              position: this.element.css("position"),
              width: this.element.outerWidth(),
              height: this.element.outerHeight(),
              top: this.element.css("top"),
              left: this.element.css("left")
            })), this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")), this.elementIsWrapper = !0, t = {
              marginTop: this.originalElement.css("marginTop"),
              marginRight: this.originalElement.css("marginRight"),
              marginBottom: this.originalElement.css("marginBottom"),
              marginLeft: this.originalElement.css("marginLeft")
            }, this.element.css(t), this.originalElement.css("margin", 0), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
              position: "static",
              zoom: 1,
              display: "block"
            })), this.originalElement.css(t), this._proportionallyResize()), this._setupHandles(), n.autoHide && e(this.element).on("mouseenter", (function() {
              n.disabled || (i._removeClass("ui-resizable-autohide"), i._handles.show())
            })).on("mouseleave", (function() {
              n.disabled || i.resizing || (i._addClass("ui-resizable-autohide"), i._handles.hide())
            })), this._mouseInit()
          },
          _destroy: function() {
            this._mouseDestroy();
            var t, n = function(t) {
              e(t).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()
            };
            return this.elementIsWrapper && (n(this.element), t = this.element, this.originalElement.css({
              position: t.css("position"),
              width: t.outerWidth(),
              height: t.outerHeight(),
              top: t.css("top"),
              left: t.css("left")
            }).insertAfter(t), t.remove()), this.originalElement.css("resize", this.originalResizeStyle), n(this.originalElement), this
          },
          _setOption: function(e, t) {
            this._super(e, t), "handles" === e && (this._removeHandles(), this._setupHandles())
          },
          _setupHandles: function() {
            var t, n, i, o, s, r = this.options,
              a = this;
            if (this.handles = r.handles || (e(".ui-resizable-handle", this.element).length ? {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
              } : "e,s,se"), this._handles = e(), this.handles.constructor === String)
              for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), i = this.handles.split(","), this.handles = {}, n = 0; n < i.length; n++) o = "ui-resizable-" + (t = e.trim(i[n])), s = e("<div>"), this._addClass(s, "ui-resizable-handle " + o), s.css({
                zIndex: r.zIndex
              }), this.handles[t] = ".ui-resizable-" + t, this.element.append(s);
            this._renderAxis = function(t) {
              var n, i, o, s;
              for (n in t = t || this.element, this.handles) this.handles[n].constructor === String ? this.handles[n] = this.element.children(this.handles[n]).first().show() : (this.handles[n].jquery || this.handles[n].nodeType) && (this.handles[n] = e(this.handles[n]), this._on(this.handles[n], {
                mousedown: a._mouseDown
              })), this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i) && (i = e(this.handles[n], this.element), s = /sw|ne|nw|se|n|s/.test(n) ? i.outerHeight() : i.outerWidth(), o = ["padding", /ne|nw|n/.test(n) ? "Top" : /se|sw|s/.test(n) ? "Bottom" : /^e$/.test(n) ? "Right" : "Left"].join(""), t.css(o, s), this._proportionallyResize()), this._handles = this._handles.add(this.handles[n])
            }, this._renderAxis(this.element), this._handles = this._handles.add(this.element.find(".ui-resizable-handle")), this._handles.disableSelection(), this._handles.on("mouseover", (function() {
              a.resizing || (this.className && (s = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)), a.axis = s && s[1] ? s[1] : "se")
            })), r.autoHide && (this._handles.hide(), this._addClass("ui-resizable-autohide"))
          },
          _removeHandles: function() {
            this._handles.remove()
          },
          _mouseCapture: function(t) {
            var n, i, o = !1;
            for (n in this.handles)((i = e(this.handles[n])[0]) === t.target || e.contains(i, t.target)) && (o = !0);
            return !this.options.disabled && o
          },
          _mouseStart: function(t) {
            var n, i, o, s = this.options,
              r = this.element;
            return this.resizing = !0, this._renderProxy(), n = this._num(this.helper.css("left")), i = this._num(this.helper.css("top")), s.containment && (n += e(s.containment).scrollLeft() || 0, i += e(s.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
              left: n,
              top: i
            }, this.size = this._helper ? {
              width: this.helper.width(),
              height: this.helper.height()
            } : {
              width: r.width(),
              height: r.height()
            }, this.originalSize = this._helper ? {
              width: r.outerWidth(),
              height: r.outerHeight()
            } : {
              width: r.width(),
              height: r.height()
            }, this.sizeDiff = {
              width: r.outerWidth() - r.width(),
              height: r.outerHeight() - r.height()
            }, this.originalPosition = {
              left: n,
              top: i
            }, this.originalMousePosition = {
              left: t.pageX,
              top: t.pageY
            }, this.aspectRatio = "number" == typeof s.aspectRatio ? s.aspectRatio : this.originalSize.width / this.originalSize.height || 1, o = e(".ui-resizable-" + this.axis).css("cursor"), e("body").css("cursor", "auto" === o ? this.axis + "-resize" : o), this._addClass("ui-resizable-resizing"), this._propagate("start", t), !0
          },
          _mouseDrag: function(t) {
            var n, i, o = this.originalMousePosition,
              s = this.axis,
              r = t.pageX - o.left || 0,
              a = t.pageY - o.top || 0,
              l = this._change[s];
            return this._updatePrevProperties(), !!l && (n = l.apply(this, [t, r, a]), this._updateVirtualBoundaries(t.shiftKey), (this._aspectRatio || t.shiftKey) && (n = this._updateRatio(n, t)), n = this._respectSize(n, t), this._updateCache(n), this._propagate("resize", t), i = this._applyChanges(), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), e.isEmptyObject(i) || (this._updatePrevProperties(), this._trigger("resize", t, this.ui()), this._applyChanges()), !1)
          },
          _mouseStop: function(t) {
            this.resizing = !1;
            var n, i, o, s, r, a, l, c = this.options,
              u = this;
            return this._helper && (o = (i = (n = this._proportionallyResizeElements).length && /textarea/i.test(n[0].nodeName)) && this._hasScroll(n[0], "left") ? 0 : u.sizeDiff.height, s = i ? 0 : u.sizeDiff.width, r = {
              width: u.helper.width() - s,
              height: u.helper.height() - o
            }, a = parseFloat(u.element.css("left")) + (u.position.left - u.originalPosition.left) || null, l = parseFloat(u.element.css("top")) + (u.position.top - u.originalPosition.top) || null, c.animate || this.element.css(e.extend(r, {
              top: l,
              left: a
            })), u.helper.height(u.size.height), u.helper.width(u.size.width), this._helper && !c.animate && this._proportionallyResize()), e("body").css("cursor", "auto"), this._removeClass("ui-resizable-resizing"), this._propagate("stop", t), this._helper && this.helper.remove(), !1
          },
          _updatePrevProperties: function() {
            this.prevPosition = {
              top: this.position.top,
              left: this.position.left
            }, this.prevSize = {
              width: this.size.width,
              height: this.size.height
            }
          },
          _applyChanges: function() {
            var e = {};
            return this.position.top !== this.prevPosition.top && (e.top = this.position.top + "px"), this.position.left !== this.prevPosition.left && (e.left = this.position.left + "px"), this.size.width !== this.prevSize.width && (e.width = this.size.width + "px"), this.size.height !== this.prevSize.height && (e.height = this.size.height + "px"), this.helper.css(e), e
          },
          _updateVirtualBoundaries: function(e) {
            var t, n, i, o, s, r = this.options;
            s = {
              minWidth: this._isNumber(r.minWidth) ? r.minWidth : 0,
              maxWidth: this._isNumber(r.maxWidth) ? r.maxWidth : 1 / 0,
              minHeight: this._isNumber(r.minHeight) ? r.minHeight : 0,
              maxHeight: this._isNumber(r.maxHeight) ? r.maxHeight : 1 / 0
            }, (this._aspectRatio || e) && (t = s.minHeight * this.aspectRatio, i = s.minWidth / this.aspectRatio, n = s.maxHeight * this.aspectRatio, o = s.maxWidth / this.aspectRatio, t > s.minWidth && (s.minWidth = t), i > s.minHeight && (s.minHeight = i), n < s.maxWidth && (s.maxWidth = n), o < s.maxHeight && (s.maxHeight = o)), this._vBoundaries = s
          },
          _updateCache: function(e) {
            this.offset = this.helper.offset(), this._isNumber(e.left) && (this.position.left = e.left), this._isNumber(e.top) && (this.position.top = e.top), this._isNumber(e.height) && (this.size.height = e.height), this._isNumber(e.width) && (this.size.width = e.width)
          },
          _updateRatio: function(e) {
            var t = this.position,
              n = this.size,
              i = this.axis;
            return this._isNumber(e.height) ? e.width = e.height * this.aspectRatio : this._isNumber(e.width) && (e.height = e.width / this.aspectRatio), "sw" === i && (e.left = t.left + (n.width - e.width), e.top = null), "nw" === i && (e.top = t.top + (n.height - e.height), e.left = t.left + (n.width - e.width)), e
          },
          _respectSize: function(e) {
            var t = this._vBoundaries,
              n = this.axis,
              i = this._isNumber(e.width) && t.maxWidth && t.maxWidth < e.width,
              o = this._isNumber(e.height) && t.maxHeight && t.maxHeight < e.height,
              s = this._isNumber(e.width) && t.minWidth && t.minWidth > e.width,
              r = this._isNumber(e.height) && t.minHeight && t.minHeight > e.height,
              a = this.originalPosition.left + this.originalSize.width,
              l = this.originalPosition.top + this.originalSize.height,
              c = /sw|nw|w/.test(n),
              u = /nw|ne|n/.test(n);
            return s && (e.width = t.minWidth), r && (e.height = t.minHeight), i && (e.width = t.maxWidth), o && (e.height = t.maxHeight), s && c && (e.left = a - t.minWidth), i && c && (e.left = a - t.maxWidth), r && u && (e.top = l - t.minHeight), o && u && (e.top = l - t.maxHeight), e.width || e.height || e.left || !e.top ? e.width || e.height || e.top || !e.left || (e.left = null) : e.top = null, e
          },
          _getPaddingPlusBorderDimensions: function(e) {
            for (var t = 0, n = [], i = [e.css("borderTopWidth"), e.css("borderRightWidth"), e.css("borderBottomWidth"), e.css("borderLeftWidth")], o = [e.css("paddingTop"), e.css("paddingRight"), e.css("paddingBottom"), e.css("paddingLeft")]; t < 4; t++) n[t] = parseFloat(i[t]) || 0, n[t] += parseFloat(o[t]) || 0;
            return {
              height: n[0] + n[2],
              width: n[1] + n[3]
            }
          },
          _proportionallyResize: function() {
            if (this._proportionallyResizeElements.length)
              for (var e, t = 0, n = this.helper || this.element; t < this._proportionallyResizeElements.length; t++) e = this._proportionallyResizeElements[t], this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(e)), e.css({
                height: n.height() - this.outerDimensions.height || 0,
                width: n.width() - this.outerDimensions.width || 0
              })
          },
          _renderProxy: function() {
            var t = this.element,
              n = this.options;
            this.elementOffset = t.offset(), this._helper ? (this.helper = this.helper || e("<div style='overflow:hidden;'></div>"), this._addClass(this.helper, this._helper), this.helper.css({
              width: this.element.outerWidth(),
              height: this.element.outerHeight(),
              position: "absolute",
              left: this.elementOffset.left + "px",
              top: this.elementOffset.top + "px",
              zIndex: ++n.zIndex
            }), this.helper.appendTo("body").disableSelection()) : this.helper = this.element
          },
          _change: {
            e: function(e, t) {
              return {
                width: this.originalSize.width + t
              }
            },
            w: function(e, t) {
              var n = this.originalSize;
              return {
                left: this.originalPosition.left + t,
                width: n.width - t
              }
            },
            n: function(e, t, n) {
              var i = this.originalSize;
              return {
                top: this.originalPosition.top + n,
                height: i.height - n
              }
            },
            s: function(e, t, n) {
              return {
                height: this.originalSize.height + n
              }
            },
            se: function(t, n, i) {
              return e.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [t, n, i]))
            },
            sw: function(t, n, i) {
              return e.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [t, n, i]))
            },
            ne: function(t, n, i) {
              return e.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [t, n, i]))
            },
            nw: function(t, n, i) {
              return e.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [t, n, i]))
            }
          },
          _propagate: function(t, n) {
            e.ui.plugin.call(this, t, [n, this.ui()]), "resize" !== t && this._trigger(t, n, this.ui())
          },
          plugins: {},
          ui: function() {
            return {
              originalElement: this.originalElement,
              element: this.element,
              helper: this.helper,
              position: this.position,
              size: this.size,
              originalSize: this.originalSize,
              originalPosition: this.originalPosition
            }
          }
        }), e.ui.plugin.add("resizable", "animate", {
          stop: function(t) {
            var n = e(this).resizable("instance"),
              i = n.options,
              o = n._proportionallyResizeElements,
              s = o.length && /textarea/i.test(o[0].nodeName),
              r = s && n._hasScroll(o[0], "left") ? 0 : n.sizeDiff.height,
              a = s ? 0 : n.sizeDiff.width,
              l = {
                width: n.size.width - a,
                height: n.size.height - r
              },
              c = parseFloat(n.element.css("left")) + (n.position.left - n.originalPosition.left) || null,
              u = parseFloat(n.element.css("top")) + (n.position.top - n.originalPosition.top) || null;
            n.element.animate(e.extend(l, u && c ? {
              top: u,
              left: c
            } : {}), {
              duration: i.animateDuration,
              easing: i.animateEasing,
              step: function() {
                var i = {
                  width: parseFloat(n.element.css("width")),
                  height: parseFloat(n.element.css("height")),
                  top: parseFloat(n.element.css("top")),
                  left: parseFloat(n.element.css("left"))
                };
                o && o.length && e(o[0]).css({
                  width: i.width,
                  height: i.height
                }), n._updateCache(i), n._propagate("resize", t)
              }
            })
          }
        }), e.ui.plugin.add("resizable", "containment", {
          start: function() {
            var t, n, i, o, s, r, a, l = e(this).resizable("instance"),
              c = l.options,
              u = l.element,
              d = c.containment,
              h = d instanceof e ? d.get(0) : /parent/.test(d) ? u.parent().get(0) : d;
            h && (l.containerElement = e(h), /document/.test(d) || d === document ? (l.containerOffset = {
              left: 0,
              top: 0
            }, l.containerPosition = {
              left: 0,
              top: 0
            }, l.parentData = {
              element: e(document),
              left: 0,
              top: 0,
              width: e(document).width(),
              height: e(document).height() || document.body.parentNode.scrollHeight
            }) : (t = e(h), n = [], e(["Top", "Right", "Left", "Bottom"]).each((function(e, i) {
              n[e] = l._num(t.css("padding" + i))
            })), l.containerOffset = t.offset(), l.containerPosition = t.position(), l.containerSize = {
              height: t.innerHeight() - n[3],
              width: t.innerWidth() - n[1]
            }, i = l.containerOffset, o = l.containerSize.height, s = l.containerSize.width, r = l._hasScroll(h, "left") ? h.scrollWidth : s, a = l._hasScroll(h) ? h.scrollHeight : o, l.parentData = {
              element: h,
              left: i.left,
              top: i.top,
              width: r,
              height: a
            }))
          },
          resize: function(t) {
            var n, i, o, s, r = e(this).resizable("instance"),
              a = r.options,
              l = r.containerOffset,
              c = r.position,
              u = r._aspectRatio || t.shiftKey,
              d = {
                top: 0,
                left: 0
              },
              h = r.containerElement,
              p = !0;
            h[0] !== document && /static/.test(h.css("position")) && (d = l), c.left < (r._helper ? l.left : 0) && (r.size.width = r.size.width + (r._helper ? r.position.left - l.left : r.position.left - d.left), u && (r.size.height = r.size.width / r.aspectRatio, p = !1), r.position.left = a.helper ? l.left : 0), c.top < (r._helper ? l.top : 0) && (r.size.height = r.size.height + (r._helper ? r.position.top - l.top : r.position.top), u && (r.size.width = r.size.height * r.aspectRatio, p = !1), r.position.top = r._helper ? l.top : 0), o = r.containerElement.get(0) === r.element.parent().get(0), s = /relative|absolute/.test(r.containerElement.css("position")), o && s ? (r.offset.left = r.parentData.left + r.position.left, r.offset.top = r.parentData.top + r.position.top) : (r.offset.left = r.element.offset().left, r.offset.top = r.element.offset().top), n = Math.abs(r.sizeDiff.width + (r._helper ? r.offset.left - d.left : r.offset.left - l.left)), i = Math.abs(r.sizeDiff.height + (r._helper ? r.offset.top - d.top : r.offset.top - l.top)), n + r.size.width >= r.parentData.width && (r.size.width = r.parentData.width - n, u && (r.size.height = r.size.width / r.aspectRatio, p = !1)), i + r.size.height >= r.parentData.height && (r.size.height = r.parentData.height - i, u && (r.size.width = r.size.height * r.aspectRatio, p = !1)), p || (r.position.left = r.prevPosition.left, r.position.top = r.prevPosition.top, r.size.width = r.prevSize.width, r.size.height = r.prevSize.height)
          },
          stop: function() {
            var t = e(this).resizable("instance"),
              n = t.options,
              i = t.containerOffset,
              o = t.containerPosition,
              s = t.containerElement,
              r = e(t.helper),
              a = r.offset(),
              l = r.outerWidth() - t.sizeDiff.width,
              c = r.outerHeight() - t.sizeDiff.height;
            t._helper && !n.animate && /relative/.test(s.css("position")) && e(this).css({
              left: a.left - o.left - i.left,
              width: l,
              height: c
            }), t._helper && !n.animate && /static/.test(s.css("position")) && e(this).css({
              left: a.left - o.left - i.left,
              width: l,
              height: c
            })
          }
        }), e.ui.plugin.add("resizable", "alsoResize", {
          start: function() {
            var t = e(this).resizable("instance").options;
            e(t.alsoResize).each((function() {
              var t = e(this);
              t.data("ui-resizable-alsoresize", {
                width: parseFloat(t.width()),
                height: parseFloat(t.height()),
                left: parseFloat(t.css("left")),
                top: parseFloat(t.css("top"))
              })
            }))
          },
          resize: function(t, n) {
            var i = e(this).resizable("instance"),
              o = i.options,
              s = i.originalSize,
              r = i.originalPosition,
              a = {
                height: i.size.height - s.height || 0,
                width: i.size.width - s.width || 0,
                top: i.position.top - r.top || 0,
                left: i.position.left - r.left || 0
              };
            e(o.alsoResize).each((function() {
              var t = e(this),
                i = e(this).data("ui-resizable-alsoresize"),
                o = {},
                s = t.parents(n.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
              e.each(s, (function(e, t) {
                var n = (i[t] || 0) + (a[t] || 0);
                n && n >= 0 && (o[t] = n || null)
              })), t.css(o)
            }))
          },
          stop: function() {
            e(this).removeData("ui-resizable-alsoresize")
          }
        }), e.ui.plugin.add("resizable", "ghost", {
          start: function() {
            var t = e(this).resizable("instance"),
              n = t.size;
            t.ghost = t.originalElement.clone(), t.ghost.css({
              opacity: .25,
              display: "block",
              position: "relative",
              height: n.height,
              width: n.width,
              margin: 0,
              left: 0,
              top: 0
            }), t._addClass(t.ghost, "ui-resizable-ghost"), !1 !== e.uiBackCompat && "string" == typeof t.options.ghost && t.ghost.addClass(this.options.ghost), t.ghost.appendTo(t.helper)
          },
          resize: function() {
            var t = e(this).resizable("instance");
            t.ghost && t.ghost.css({
              position: "relative",
              height: t.size.height,
              width: t.size.width
            })
          },
          stop: function() {
            var t = e(this).resizable("instance");
            t.ghost && t.helper && t.helper.get(0).removeChild(t.ghost.get(0))
          }
        }), e.ui.plugin.add("resizable", "grid", {
          resize: function() {
            var t, n = e(this).resizable("instance"),
              i = n.options,
              o = n.size,
              s = n.originalSize,
              r = n.originalPosition,
              a = n.axis,
              l = "number" == typeof i.grid ? [i.grid, i.grid] : i.grid,
              c = l[0] || 1,
              u = l[1] || 1,
              d = Math.round((o.width - s.width) / c) * c,
              h = Math.round((o.height - s.height) / u) * u,
              p = s.width + d,
              f = s.height + h,
              _ = i.maxWidth && i.maxWidth < p,
              g = i.maxHeight && i.maxHeight < f,
              m = i.minWidth && i.minWidth > p,
              v = i.minHeight && i.minHeight > f;
            i.grid = l, m && (p += c), v && (f += u), _ && (p -= c), g && (f -= u), /^(se|s|e)$/.test(a) ? (n.size.width = p, n.size.height = f) : /^(ne)$/.test(a) ? (n.size.width = p, n.size.height = f, n.position.top = r.top - h) : /^(sw)$/.test(a) ? (n.size.width = p, n.size.height = f, n.position.left = r.left - d) : ((f - u <= 0 || p - c <= 0) && (t = n._getPaddingPlusBorderDimensions(this)), f - u > 0 ? (n.size.height = f, n.position.top = r.top - h) : (f = u - t.height, n.size.height = f, n.position.top = r.top + s.height - f), p - c > 0 ? (n.size.width = p, n.position.left = r.left - d) : (p = c - t.width, n.size.width = p, n.position.left = r.left + s.width - p))
          }
        }), e.ui.resizable
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    963880: (e, t, n) => {
      var i, o, s;
      o = [n(661533), n(462106), n(259085), n(316936), n(317626), n(948220), n(528803)], void 0 === (s = "function" == typeof(i = function(e) {
        return e.widget("ui.sortable", e.ui.mouse, {
          version: "1.12.1",
          widgetEventPrefix: "sort",
          ready: !1,
          options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1e3,
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
          },
          _isOverAxis: function(e, t, n) {
            return e >= t && e < t + n
          },
          _isFloating: function(e) {
            return /left|right/.test(e.css("float")) || /inline|table-cell/.test(e.css("display"))
          },
          _create: function() {
            this.containerCache = {}, this._addClass("ui-sortable"), this.refresh(), this.offset = this.element.offset(), this._mouseInit(), this._setHandleClassName(), this.ready = !0
          },
          _setOption: function(e, t) {
            this._super(e, t), "handle" === e && this._setHandleClassName()
          },
          _setHandleClassName: function() {
            var t = this;
            this._removeClass(this.element.find(".ui-sortable-handle"), "ui-sortable-handle"), e.each(this.items, (function() {
              t._addClass(this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item, "ui-sortable-handle")
            }))
          },
          _destroy: function() {
            this._mouseDestroy();
            for (var e = this.items.length - 1; e >= 0; e--) this.items[e].item.removeData(this.widgetName + "-item");
            return this
          },
          _mouseCapture: function(t, n) {
            var i = null,
              o = !1,
              s = this;
            return !(this.reverting || this.options.disabled || "static" === this.options.type || (this._refreshItems(t), e(t.target).parents().each((function() {
              if (e.data(this, s.widgetName + "-item") === s) return i = e(this), !1
            })), e.data(t.target, s.widgetName + "-item") === s && (i = e(t.target)), !i || this.options.handle && !n && (e(this.options.handle, i).find("*").addBack().each((function() {
              this === t.target && (o = !0)
            })), !o) || (this.currentItem = i, this._removeCurrentsFromItems(), 0)))
          },
          _mouseStart: function(t, n, i) {
            var o, s, r = this.options;
            if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
              }, e.extend(this.offset, {
                click: {
                  left: t.pageX - this.offset.left,
                  top: t.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
              }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, r.cursorAt && this._adjustOffsetFromHelper(r.cursorAt), this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
              }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), r.containment && this._setContainment(), r.cursor && "auto" !== r.cursor && (s = this.document.find("body"), this.storedCursor = s.css("cursor"), s.css("cursor", r.cursor), this.storedStylesheet = e("<style>*{ cursor: " + r.cursor + " !important; }</style>").appendTo(s)), r.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", r.opacity)), r.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", r.zIndex)), this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !i)
              for (o = this.containers.length - 1; o >= 0; o--) this.containers[o]._trigger("activate", t, this._uiHash(this));
            return e.ui.ddmanager && (e.ui.ddmanager.current = this), e.ui.ddmanager && !r.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this.dragging = !0, this._addClass(this.helper, "ui-sortable-helper"), this._mouseDrag(t), !0
          },
          _mouseDrag: function(t) {
            var n, i, o, s, r = this.options,
              a = !1;
            for (this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < r.scrollSensitivity ? this.scrollParent[0].scrollTop = a = this.scrollParent[0].scrollTop + r.scrollSpeed : t.pageY - this.overflowOffset.top < r.scrollSensitivity && (this.scrollParent[0].scrollTop = a = this.scrollParent[0].scrollTop - r.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < r.scrollSensitivity ? this.scrollParent[0].scrollLeft = a = this.scrollParent[0].scrollLeft + r.scrollSpeed : t.pageX - this.overflowOffset.left < r.scrollSensitivity && (this.scrollParent[0].scrollLeft = a = this.scrollParent[0].scrollLeft - r.scrollSpeed)) : (t.pageY - this.document.scrollTop() < r.scrollSensitivity ? a = this.document.scrollTop(this.document.scrollTop() - r.scrollSpeed) : this.window.height() - (t.pageY - this.document.scrollTop()) < r.scrollSensitivity && (a = this.document.scrollTop(this.document.scrollTop() + r.scrollSpeed)), t.pageX - this.document.scrollLeft() < r.scrollSensitivity ? a = this.document.scrollLeft(this.document.scrollLeft() - r.scrollSpeed) : this.window.width() - (t.pageX - this.document.scrollLeft()) < r.scrollSensitivity && (a = this.document.scrollLeft(this.document.scrollLeft() + r.scrollSpeed))), !1 !== a && e.ui.ddmanager && !r.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), n = this.items.length - 1; n >= 0; n--)
              if (o = (i = this.items[n]).item[0], (s = this._intersectsWithPointer(i)) && i.instance === this.currentContainer && !(o === this.currentItem[0] || this.placeholder[1 === s ? "next" : "prev"]()[0] === o || e.contains(this.placeholder[0], o) || "semi-dynamic" === this.options.type && e.contains(this.element[0], o))) {
                if (this.direction = 1 === s ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(i)) break;
                this._rearrange(t, i), this._trigger("change", t, this._uiHash());
                break
              } return this._contactContainers(t), e.ui.ddmanager && e.ui.ddmanager.drag(this, t), this._trigger("sort", t, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
          },
          _mouseStop: function(t, n) {
            if (t) {
              if (e.ui.ddmanager && !this.options.dropBehaviour && e.ui.ddmanager.drop(this, t), this.options.revert) {
                var i = this,
                  o = this.placeholder.offset(),
                  s = this.options.axis,
                  r = {};
                s && "x" !== s || (r.left = o.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft)), s && "y" !== s || (r.top = o.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop)), this.reverting = !0, e(this.helper).animate(r, parseInt(this.options.revert, 10) || 500, (function() {
                  i._clear(t)
                }))
              } else this._clear(t, n);
              return !1
            }
          },
          cancel: function() {
            if (this.dragging) {
              this._mouseUp(new e.Event("mouseup", {
                target: null
              })), "original" === this.options.helper ? (this.currentItem.css(this._storedCSS), this._removeClass(this.currentItem, "ui-sortable-helper")) : this.currentItem.show();
              for (var t = this.containers.length - 1; t >= 0; t--) this.containers[t]._trigger("deactivate", null, this._uiHash(this)), this.containers[t].containerCache.over && (this.containers[t]._trigger("out", null, this._uiHash(this)), this.containers[t].containerCache.over = 0)
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), e.extend(this, {
              helper: null,
              dragging: !1,
              reverting: !1,
              _noFinalSort: null
            }), this.domPosition.prev ? e(this.domPosition.prev).after(this.currentItem) : e(this.domPosition.parent).prepend(this.currentItem)), this
          },
          serialize: function(t) {
            var n = this._getItemsAsjQuery(t && t.connected),
              i = [];
            return t = t || {}, e(n).each((function() {
              var n = (e(t.item || this).attr(t.attribute || "id") || "").match(t.expression || /(.+)[\-=_](.+)/);
              n && i.push((t.key || n[1] + "[]") + "=" + (t.key && t.expression ? n[1] : n[2]))
            })), !i.length && t.key && i.push(t.key + "="), i.join("&")
          },
          toArray: function(t) {
            var n = this._getItemsAsjQuery(t && t.connected),
              i = [];
            return t = t || {}, n.each((function() {
              i.push(e(t.item || this).attr(t.attribute || "id") || "")
            })), i
          },
          _intersectsWith: function(e) {
            var t = this.positionAbs.left,
              n = t + this.helperProportions.width,
              i = this.positionAbs.top,
              o = i + this.helperProportions.height,
              s = e.left,
              r = s + e.width,
              a = e.top,
              l = a + e.height,
              c = this.offset.click.top,
              u = this.offset.click.left,
              d = "x" === this.options.axis || i + c > a && i + c < l,
              h = "y" === this.options.axis || t + u > s && t + u < r,
              p = d && h;
            return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > e[this.floating ? "width" : "height"] ? p : s < t + this.helperProportions.width / 2 && n - this.helperProportions.width / 2 < r && a < i + this.helperProportions.height / 2 && o - this.helperProportions.height / 2 < l
          },
          _intersectsWithPointer: function(e) {
            var t, n, i = "x" === this.options.axis || this._isOverAxis(this.positionAbs.top + this.offset.click.top, e.top, e.height),
              o = "y" === this.options.axis || this._isOverAxis(this.positionAbs.left + this.offset.click.left, e.left, e.width);
            return !(!i || !o) && (t = this._getDragVerticalDirection(), n = this._getDragHorizontalDirection(), this.floating ? "right" === n || "down" === t ? 2 : 1 : t && ("down" === t ? 2 : 1))
          },
          _intersectsWithSides: function(e) {
            var t = this._isOverAxis(this.positionAbs.top + this.offset.click.top, e.top + e.height / 2, e.height),
              n = this._isOverAxis(this.positionAbs.left + this.offset.click.left, e.left + e.width / 2, e.width),
              i = this._getDragVerticalDirection(),
              o = this._getDragHorizontalDirection();
            return this.floating && o ? "right" === o && n || "left" === o && !n : i && ("down" === i && t || "up" === i && !t)
          },
          _getDragVerticalDirection: function() {
            var e = this.positionAbs.top - this.lastPositionAbs.top;
            return 0 !== e && (e > 0 ? "down" : "up")
          },
          _getDragHorizontalDirection: function() {
            var e = this.positionAbs.left - this.lastPositionAbs.left;
            return 0 !== e && (e > 0 ? "right" : "left")
          },
          refresh: function(e) {
            return this._refreshItems(e), this._setHandleClassName(), this.refreshPositions(), this
          },
          _connectWith: function() {
            var e = this.options;
            return e.connectWith.constructor === String ? [e.connectWith] : e.connectWith
          },
          _getItemsAsjQuery: function(t) {
            var n, i, o, s, r = [],
              a = [],
              l = this._connectWith();
            if (l && t)
              for (n = l.length - 1; n >= 0; n--)
                for (i = (o = e(l[n], this.document[0])).length - 1; i >= 0; i--)(s = e.data(o[i], this.widgetFullName)) && s !== this && !s.options.disabled && a.push([e.isFunction(s.options.items) ? s.options.items.call(s.element) : e(s.options.items, s.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), s]);

            function c() {
              r.push(this)
            }
            for (a.push([e.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
              }) : e(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]), n = a.length - 1; n >= 0; n--) a[n][0].each(c);
            return e(r)
          },
          _removeCurrentsFromItems: function() {
            var t = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = e.grep(this.items, (function(e) {
              for (var n = 0; n < t.length; n++)
                if (t[n] === e.item[0]) return !1;
              return !0
            }))
          },
          _refreshItems: function(t) {
            this.items = [], this.containers = [this];
            var n, i, o, s, r, a, l, c, u = this.items,
              d = [
                [e.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, {
                  item: this.currentItem
                }) : e(this.options.items, this.element), this]
              ],
              h = this._connectWith();
            if (h && this.ready)
              for (n = h.length - 1; n >= 0; n--)
                for (i = (o = e(h[n], this.document[0])).length - 1; i >= 0; i--)(s = e.data(o[i], this.widgetFullName)) && s !== this && !s.options.disabled && (d.push([e.isFunction(s.options.items) ? s.options.items.call(s.element[0], t, {
                  item: this.currentItem
                }) : e(s.options.items, s.element), s]), this.containers.push(s));
            for (n = d.length - 1; n >= 0; n--)
              for (r = d[n][1], i = 0, c = (a = d[n][0]).length; i < c; i++)(l = e(a[i])).data(this.widgetName + "-item", r), u.push({
                item: l,
                instance: r,
                width: 0,
                height: 0,
                left: 0,
                top: 0
              })
          },
          refreshPositions: function(t) {
            var n, i, o, s;
            for (this.floating = !!this.items.length && ("x" === this.options.axis || this._isFloating(this.items[0].item)), this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset()), n = this.items.length - 1; n >= 0; n--)(i = this.items[n]).instance !== this.currentContainer && this.currentContainer && i.item[0] !== this.currentItem[0] || (o = this.options.toleranceElement ? e(this.options.toleranceElement, i.item) : i.item, t || (i.width = o.outerWidth(), i.height = o.outerHeight()), s = o.offset(), i.left = s.left, i.top = s.top);
            if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this);
            else
              for (n = this.containers.length - 1; n >= 0; n--) s = this.containers[n].element.offset(), this.containers[n].containerCache.left = s.left, this.containers[n].containerCache.top = s.top, this.containers[n].containerCache.width = this.containers[n].element.outerWidth(), this.containers[n].containerCache.height = this.containers[n].element.outerHeight();
            return this
          },
          _createPlaceholder: function(t) {
            var n, i = (t = t || this).options;
            i.placeholder && i.placeholder.constructor !== String || (n = i.placeholder, i.placeholder = {
              element: function() {
                var i = t.currentItem[0].nodeName.toLowerCase(),
                  o = e("<" + i + ">", t.document[0]);
                return t._addClass(o, "ui-sortable-placeholder", n || t.currentItem[0].className)._removeClass(o, "ui-sortable-helper"), "tbody" === i ? t._createTrPlaceholder(t.currentItem.find("tr").eq(0), e("<tr>", t.document[0]).appendTo(o)) : "tr" === i ? t._createTrPlaceholder(t.currentItem, o) : "img" === i && o.attr("src", t.currentItem.attr("src")), n || o.css("visibility", "hidden"), o
              },
              update: function(e, o) {
                n && !i.forcePlaceholderSize || (o.height() || o.height(t.currentItem.innerHeight() - parseInt(t.currentItem.css("paddingTop") || 0, 10) - parseInt(t.currentItem.css("paddingBottom") || 0, 10)), o.width() || o.width(t.currentItem.innerWidth() - parseInt(t.currentItem.css("paddingLeft") || 0, 10) - parseInt(t.currentItem.css("paddingRight") || 0, 10)))
              }
            }), t.placeholder = e(i.placeholder.element.call(t.element, t.currentItem)), t.currentItem.after(t.placeholder), i.placeholder.update(t, t.placeholder)
          },
          _createTrPlaceholder: function(t, n) {
            var i = this;
            t.children().each((function() {
              e("<td>&#160;</td>", i.document[0]).attr("colspan", e(this).attr("colspan") || 1).appendTo(n)
            }))
          },
          _contactContainers: function(t) {
            var n, i, o, s, r, a, l, c, u, d, h = null,
              p = null;
            for (n = this.containers.length - 1; n >= 0; n--)
              if (!e.contains(this.currentItem[0], this.containers[n].element[0]))
                if (this._intersectsWith(this.containers[n].containerCache)) {
                  if (h && e.contains(this.containers[n].element[0], h.element[0])) continue;
                  h = this.containers[n], p = n
                } else this.containers[n].containerCache.over && (this.containers[n]._trigger("out", t, this._uiHash(this)), this.containers[n].containerCache.over = 0);
            if (h)
              if (1 === this.containers.length) this.containers[p].containerCache.over || (this.containers[p]._trigger("over", t, this._uiHash(this)), this.containers[p].containerCache.over = 1);
              else {
                for (o = 1e4, s = null, r = (u = h.floating || this._isFloating(this.currentItem)) ? "left" : "top", a = u ? "width" : "height", d = u ? "pageX" : "pageY", i = this.items.length - 1; i >= 0; i--) e.contains(this.containers[p].element[0], this.items[i].item[0]) && this.items[i].item[0] !== this.currentItem[0] && (l = this.items[i].item.offset()[r], c = !1, t[d] - l > this.items[i][a] / 2 && (c = !0), Math.abs(t[d] - l) < o && (o = Math.abs(t[d] - l), s = this.items[i], this.direction = c ? "up" : "down"));
                if (!s && !this.options.dropOnEmpty) return;
                if (this.currentContainer === this.containers[p]) return void(this.currentContainer.containerCache.over || (this.containers[p]._trigger("over", t, this._uiHash()), this.currentContainer.containerCache.over = 1));
                s ? this._rearrange(t, s, null, !0) : this._rearrange(t, null, this.containers[p].element, !0), this._trigger("change", t, this._uiHash()), this.containers[p]._trigger("change", t, this._uiHash(this)), this.currentContainer = this.containers[p], this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[p]._trigger("over", t, this._uiHash(this)), this.containers[p].containerCache.over = 1
              }
          },
          _createHelper: function(t) {
            var n = this.options,
              i = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [t, this.currentItem])) : "clone" === n.helper ? this.currentItem.clone() : this.currentItem;
            return i.parents("body").length || e("parent" !== n.appendTo ? n.appendTo : this.currentItem[0].parentNode)[0].appendChild(i[0]), i[0] === this.currentItem[0] && (this._storedCSS = {
              width: this.currentItem[0].style.width,
              height: this.currentItem[0].style.height,
              position: this.currentItem.css("position"),
              top: this.currentItem.css("top"),
              left: this.currentItem.css("left")
            }), i[0].style.width && !n.forceHelperSize || i.width(this.currentItem.width()), i[0].style.height && !n.forceHelperSize || i.height(this.currentItem.height()), i
          },
          _adjustOffsetFromHelper: function(t) {
            "string" == typeof t && (t = t.split(" ")), e.isArray(t) && (t = {
              left: +t[0],
              top: +t[1] || 0
            }), "left" in t && (this.offset.click.left = t.left + this.margins.left), "right" in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top" in t && (this.offset.click.top = t.top + this.margins.top), "bottom" in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
          },
          _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var t = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && e.ui.ie) && (t = {
              top: 0,
              left: 0
            }), {
              top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
              left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
            }
          },
          _getRelativeOffset: function() {
            if ("relative" === this.cssPosition) {
              var e = this.currentItem.position();
              return {
                top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
              }
            }
            return {
              top: 0,
              left: 0
            }
          },
          _cacheMargins: function() {
            this.margins = {
              left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
              top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
          },
          _cacheHelperProportions: function() {
            this.helperProportions = {
              width: this.helper.outerWidth(),
              height: this.helper.outerHeight()
            }
          },
          _setContainment: function() {
            var t, n, i, o = this.options;
            "parent" === o.containment && (o.containment = this.helper[0].parentNode), "document" !== o.containment && "window" !== o.containment || (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, "document" === o.containment ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left, ("document" === o.containment ? this.document.height() || document.body.parentNode.scrollHeight : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]), /^(document|window|parent)$/.test(o.containment) || (t = e(o.containment)[0], n = e(o.containment).offset(), i = "hidden" !== e(t).css("overflow"), this.containment = [n.left + (parseInt(e(t).css("borderLeftWidth"), 10) || 0) + (parseInt(e(t).css("paddingLeft"), 10) || 0) - this.margins.left, n.top + (parseInt(e(t).css("borderTopWidth"), 10) || 0) + (parseInt(e(t).css("paddingTop"), 10) || 0) - this.margins.top, n.left + (i ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) - (parseInt(e(t).css("borderLeftWidth"), 10) || 0) - (parseInt(e(t).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, n.top + (i ? Math.max(t.scrollHeight, t.offsetHeight) : t.offsetHeight) - (parseInt(e(t).css("borderTopWidth"), 10) || 0) - (parseInt(e(t).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
          },
          _convertPositionTo: function(t, n) {
            n || (n = this.position);
            var i = "absolute" === t ? 1 : -1,
              o = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
              s = /(html|body)/i.test(o[0].tagName);
            return {
              top: n.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : s ? 0 : o.scrollTop()) * i,
              left: n.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : s ? 0 : o.scrollLeft()) * i
            }
          },
          _generatePosition: function(t) {
            var n, i, o = this.options,
              s = t.pageX,
              r = t.pageY,
              a = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
              l = /(html|body)/i.test(a[0].tagName);
            return "relative" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (s = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (r = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (s = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (r = this.containment[3] + this.offset.click.top)), o.grid && (n = this.originalPageY + Math.round((r - this.originalPageY) / o.grid[1]) * o.grid[1], r = this.containment ? n - this.offset.click.top >= this.containment[1] && n - this.offset.click.top <= this.containment[3] ? n : n - this.offset.click.top >= this.containment[1] ? n - o.grid[1] : n + o.grid[1] : n, i = this.originalPageX + Math.round((s - this.originalPageX) / o.grid[0]) * o.grid[0], s = this.containment ? i - this.offset.click.left >= this.containment[0] && i - this.offset.click.left <= this.containment[2] ? i : i - this.offset.click.left >= this.containment[0] ? i - o.grid[0] : i + o.grid[0] : i)), {
              top: r - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : l ? 0 : a.scrollTop()),
              left: s - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : l ? 0 : a.scrollLeft())
            }
          },
          _rearrange: function(e, t, n, i) {
            n ? n[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? t.item[0] : t.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
            var o = this.counter;
            this._delay((function() {
              o === this.counter && this.refreshPositions(!i)
            }))
          },
          _clear: function(e, t) {
            this.reverting = !1;
            var n, i = [];
            if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
              for (n in this._storedCSS) "auto" !== this._storedCSS[n] && "static" !== this._storedCSS[n] || (this._storedCSS[n] = "");
              this.currentItem.css(this._storedCSS), this._removeClass(this.currentItem, "ui-sortable-helper")
            } else this.currentItem.show();

            function o(e, t, n) {
              return function(i) {
                n._trigger(e, i, t._uiHash(t))
              }
            }
            for (this.fromOutside && !t && i.push((function(e) {
                this._trigger("receive", e, this._uiHash(this.fromOutside))
              })), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || t || i.push((function(e) {
                this._trigger("update", e, this._uiHash())
              })), this !== this.currentContainer && (t || (i.push((function(e) {
                this._trigger("remove", e, this._uiHash())
              })), i.push(function(e) {
                return function(t) {
                  e._trigger("receive", t, this._uiHash(this))
                }
              }.call(this, this.currentContainer)), i.push(function(e) {
                return function(t) {
                  e._trigger("update", t, this._uiHash(this))
                }
              }.call(this, this.currentContainer)))), n = this.containers.length - 1; n >= 0; n--) t || i.push(o("deactivate", this, this.containers[n])), this.containers[n].containerCache.over && (i.push(o("out", this, this.containers[n])), this.containers[n].containerCache.over = 0);
            if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, t || this._trigger("beforeStop", e, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.cancelHelperRemoval || (this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null), !t) {
              for (n = 0; n < i.length; n++) i[n].call(this, e);
              this._trigger("stop", e, this._uiHash())
            }
            return this.fromOutside = !1, !this.cancelHelperRemoval
          },
          _trigger: function() {
            !1 === e.Widget.prototype._trigger.apply(this, arguments) && this.cancel()
          },
          _uiHash: function(t) {
            var n = t || this;
            return {
              helper: n.helper,
              placeholder: n.placeholder || e([]),
              position: n.position,
              originalPosition: n.originalPosition,
              offset: n.positionAbs,
              item: n.currentItem,
              sender: t ? t.element : null
            }
          }
        })
      }) ? i.apply(t, o) : i) || (e.exports = s)
    },
    245522: (e, t, n) => {
      var i, o = n(661533);
      (i = o).fn.visible = function(e, t, n, o) {
        if (!(this.length < 1)) {
          var s = this.length > 1 ? this.eq(0) : this,
            r = null != o,
            a = i(r ? o : window),
            l = r ? a.position() : 0,
            c = s.get(0),
            u = a.outerWidth(),
            d = a.outerHeight(),
            h = (n = n || "both", !0 !== t || c.offsetWidth * c.offsetHeight);
          if ("function" == typeof c.getBoundingClientRect) {
            var p = c.getBoundingClientRect(),
              f = r ? p.top - l.top >= 0 && p.top < d + l.top : p.top >= 0 && p.top < d,
              _ = r ? p.bottom - l.top > 0 && p.bottom <= d + l.top : p.bottom > 0 && p.bottom <= d,
              g = r ? p.left - l.left >= 0 && p.left < u + l.left : p.left >= 0 && p.left < u,
              m = r ? p.right - l.left > 0 && p.right < u + l.left : p.right > 0 && p.right <= u,
              v = e ? f || _ : f && _,
              y = e ? g || m : g && m;
            if ("both" === n) return h && v && y;
            if ("vertical" === n) return h && v;
            if ("horizontal" === n) return h && y
          } else {
            var b = r ? 0 : l,
              w = b + d,
              P = a.scrollLeft(),
              E = P + u,
              C = s.position(),
              k = C.top,
              I = k + s.height(),
              A = C.left,
              T = A + s.width(),
              S = !0 === e ? I : k,
              x = !0 === e ? k : I,
              D = !0 === e ? T : A,
              O = !0 === e ? A : T;
            if ("both" === n) return !!h && x <= w && S >= b && O <= E && D >= P;
            if ("vertical" === n) return !!h && x <= w && S >= b;
            if ("horizontal" === n) return !!h && O <= E && D >= P
          }
        }
      }
    },
    241817: (e, t, n) => {
      var i, o;
      i = [n(661533)], void 0 === (o = function(e) {
        ! function(e, t, n, i) {
          "use strict";
          var o = "intlTelInput",
            s = 1,
            r = {
              autoFormat: !0,
              autoHideDialCode: !0,
              defaultCountry: "",
              ipinfoToken: "",
              nationalMode: !1,
              numberType: "MOBILE",
              onlyCountries: [],
              preferredCountries: ["us", "gb"],
              responsiveDropdown: !1,
              utilsScript: ""
            },
            a = 38,
            l = 40,
            c = 13,
            u = 27,
            d = 43,
            h = 65,
            p = 90,
            f = 48,
            _ = 57,
            g = 32,
            m = 8,
            v = 46,
            y = 17,
            b = 91,
            w = 224,
            P = !1,
            E = !0;

          function C(t, n) {
            this.element = t, this.options = e.extend({}, r, n), this._defaults = r, this.ns = "." + o + s++, this.isGoodBrowser = Boolean(t.setSelectionRange), this.hadInitialPlaceholder = Boolean(e(t).attr("placeholder")), this._name = o, this.init()
          }
          e(t).load((function() {
            P = !0
          })), C.prototype = {
            init: function() {
              var t = this;
              if ("auto" == this.options.defaultCountry) {
                this.options.defaultCountry = "";
                var n = "//ipinfo.io";
                this.options.ipinfoToken && (n += "?token=" + this.options.ipinfoToken), e.get(n, (function(e) {
                  e && e.country && (t.options.defaultCountry = e.country.toLowerCase())
                }), "jsonp").always((function() {
                  t._ready()
                }))
              } else this._ready()
            },
            _ready: function() {
              this.options.nationalMode && (this.options.autoHideDialCode = !1), navigator.userAgent.match(/IEMobile/i) && (this.options.autoFormat = !1), t.innerWidth < 500 && (this.options.responsiveDropdown = !0), this._processCountryData(), this._generateMarkup(), this._setInitialState(), this._initListeners()
            },
            _processCountryData: function() {
              this._setInstanceCountryData(), this._setPreferredCountries()
            },
            _addCountryCode: function(e, t, n) {
              t in this.countryCodes || (this.countryCodes[t] = []);
              var i = n || 0;
              this.countryCodes[t][i] = e
            },
            _setInstanceCountryData: function() {
              var t;
              if (this.options.onlyCountries.length)
                for (this.countries = [], t = 0; t < k.length; t++) - 1 != e.inArray(k[t].iso2, this.options.onlyCountries) && this.countries.push(k[t]);
              else this.countries = k;
              for (this.countryCodes = {}, t = 0; t < this.countries.length; t++) {
                var n = this.countries[t];
                if (this._addCountryCode(n.iso2, n.dialCode, n.priority), n.areaCodes)
                  for (var i = 0; i < n.areaCodes.length; i++) this._addCountryCode(n.iso2, n.dialCode + n.areaCodes[i])
              }
            },
            _setPreferredCountries: function() {
              this.preferredCountries = [];
              for (var e = 0; e < this.options.preferredCountries.length; e++) {
                var t = this.options.preferredCountries[e],
                  n = this._getCountryData(t, !1, !0);
                n && this.preferredCountries.push(n)
              }
            },
            _generateMarkup: function() {
              this.telInput = e(this.element), this.telInput.wrap(e("<div>", {
                class: "intl-tel-input"
              }));
              var t = e("<div>", {
                  class: "flag-dropdown"
                }).insertAfter(this.telInput),
                n = e("<div>", {
                  class: "selected-flag"
                }).appendTo(t);
              this.selectedFlagInner = e("<div>", {
                class: "flag"
              }).appendTo(n), e("<div>", {
                class: "arrow"
              }).appendTo(this.selectedFlagInner), this.countryList = e("<ul>", {
                class: "country-list v-hide"
              }).appendTo(t), this.preferredCountries.length && (this._appendListItems(this.preferredCountries, "preferred"), e("<li>", {
                class: "divider"
              }).appendTo(this.countryList)), this._appendListItems(this.countries, ""), this.dropdownHeight = this.countryList.outerHeight(), this.countryList.removeClass("v-hide").addClass("hide"), this.options.responsiveDropdown && this.countryList.outerWidth(this.telInput.outerWidth()), this.countryListItems = this.countryList.children(".country")
            },
            _appendListItems: function(e, t) {
              for (var n = "", i = 0; i < e.length; i++) {
                var o = e[i];
                n += "<li class='country " + t + "' data-dial-code='" + o.dialCode + "' data-country-code='" + o.iso2 + "'>", n += "<div class='flag " + o.iso2 + "'></div>", n += "<span class='country-name'>" + o.name + "</span>", n += "<span class='dial-code'>+" + o.dialCode + "</span>", n += "</li>"
              }
              this.countryList.append(n)
            },
            _setInitialState: function() {
              var e, t = this.telInput.val();
              this._getDialCode(t) ? this._updateFlagFromNumber(t) : (e = this.options.defaultCountry ? this._getCountryData(this.options.defaultCountry, !1, !1) : this.preferredCountries.length ? this.preferredCountries[0] : this.countries[0], this._selectFlag(e.iso2), t || this._updateDialCode(e.dialCode, !1)), t && this._updateVal(t, !1)
            },
            _initListeners: function() {
              var n = this;
              this._initKeyListeners(), (this.options.autoHideDialCode || this.options.autoFormat) && this._initFocusListeners();
              var i = this.telInput.closest("label");
              i.length && i.on("click" + this.ns, (function(e) {
                n.countryList.hasClass("hide") ? n.telInput.focus() : e.preventDefault()
              })), this.selectedFlagInner.parent().on("click" + this.ns, (function(e) {
                n.countryList.hasClass("hide") && !n.telInput.prop("disabled") && n._showDropdown()
              })), this.options.utilsScript && (P ? this.loadUtils() : e(t).load((function() {
                n.loadUtils()
              })))
            },
            _initKeyListeners: function() {
              var e = this;
              this.options.autoFormat && (e.telInput.on("change", (function() {
                var t = e.telInput.val();
                e._updateFlagFromNumber(t)
              })), this.telInput.on("keypress" + this.ns, (function(n) {
                if (n.which >= g && !n.metaKey && t.intlTelInputUtils) {
                  n.preventDefault();
                  var i = n.which >= f && n.which <= _ || n.which == d,
                    o = e.telInput[0],
                    s = e.isGoodBrowser && o.selectionStart == o.selectionEnd,
                    r = e.telInput.attr("maxlength");
                  if ((!r || e.telInput.val().length < r) && (i || s)) {
                    var a = i ? String.fromCharCode(n.which) : null;
                    e._handleInputKey(a, !0)
                  }
                  i || e.telInput.trigger("invalidkey")
                }
              }))), this.telInput.on("keyup" + this.ns, (function(n) {
                if (n.which == c);
                else if (e.options.autoFormat && t.intlTelInputUtils) {
                  var i = n.which == y || n.which == b || n.which == w,
                    o = e.telInput[0],
                    s = e.isGoodBrowser && o.selectionStart == o.selectionEnd,
                    r = e.isGoodBrowser && o.selectionStart == e.telInput.val().length;
                  if ((n.which == v && !r || n.which == m || i && s) && e._handleInputKey(null, i && r), !e.options.nationalMode) {
                    var a = e.telInput.val();
                    if ("+" != a.substr(0, 1)) {
                      var l = e.isGoodBrowser ? o.selectionStart + 1 : 0;
                      e.telInput.val("+" + a), e.isGoodBrowser && o.setSelectionRange(l, l)
                    }
                  }
                } else e._updateFlagFromNumber(e.telInput.val())
              }))
            },
            _handleInputKey: function(e, t) {
              var n = this.telInput.val(),
                i = null,
                o = !1,
                s = this.telInput[0];
              if (this.isGoodBrowser) {
                var r = s.selectionEnd,
                  a = n.length;
                o = r == a, e ? (n = n.substr(0, s.selectionStart) + e + n.substring(r, a), o || (i = r + (n.length - a))) : i = s.selectionStart
              } else e && (n += e);
              this.setNumber(n, t), this.isGoodBrowser && (o && (i = this.telInput.val().length), s.setSelectionRange(i, i))
            },
            _initFocusListeners: function() {
              var e = this;
              this.options.autoHideDialCode && this.telInput.on("mousedown" + this.ns, (function(t) {
                e.telInput.is(":focus") || e.telInput.val() || (t.preventDefault(), e.telInput.focus())
              })), this.telInput.on("focus" + this.ns, (function() {
                var n = e.telInput.val();
                e.telInput.data("focusVal", n), e.options.autoHideDialCode && (n || (E ? e._updateVal("+" + e.selectedCountryData.dialCode, !0) : e._updateVal("+", !0), e.telInput.one("keypress.plus" + e.ns, (function(n) {
                  if (n.which == d) {
                    var i = e.options.autoFormat && t.intlTelInputUtils ? "+" : "";
                    e.telInput.val(i)
                  }
                })), setTimeout((function() {
                  var t = e.telInput[0];
                  if (e.isGoodBrowser) {
                    var n = e.telInput.val().length;
                    t.setSelectionRange(n, n)
                  }
                }))))
              })), this.telInput.on("blur" + this.ns, (function() {
                if (e.options.autoHideDialCode) {
                  var n = e.telInput.val();
                  if ("+" == n.substr(0, 1)) {
                    var i = e._getNumeric(n);
                    i && e.selectedCountryData.dialCode != i || e.telInput.val("+" + i)
                  }
                  e.telInput.off("keypress.plus" + e.ns)
                }
                e.options.autoFormat && t.intlTelInputUtils && e.telInput.val() != e.telInput.data("focusVal") && e.telInput.trigger("change")
              }))
            },
            _getNumeric: function(e) {
              return e.replace(/\D/g, "")
            },
            _showDropdown: function() {
              this._setDropdownPosition();
              var e = this.countryList.children(".active");
              this._highlightListItem(e), this.countryList.removeClass("hide"), this._scrollTo(e), this._bindDropdownListeners(), this.selectedFlagInner.children(".arrow").addClass("up")
            },
            _setDropdownPosition: function() {
              var n = this.telInput.offset().top,
                i = e(t).scrollTop(),
                o = n + this.telInput.outerHeight() + this.dropdownHeight < i + e(t).height(),
                s = n - this.dropdownHeight > i,
                r = !o && s ? "-" + (this.dropdownHeight - 1) + "px" : "";
              this.countryList.css("top", r)
            },
            _bindDropdownListeners: function() {
              var t = this;
              this.countryList.on("mouseover" + this.ns, ".country", (function(n) {
                t._highlightListItem(e(this))
              })), this.countryList.on("click" + this.ns, ".country", (function(n) {
                E = !0, t._selectListItem(e(this))
              }));
              var i = !0;
              e("html").on("click" + this.ns, (function(e) {
                i || t._closeDropdown(), i = !1
              }));
              var o = "",
                s = null;
              e(n).on("keydown" + this.ns, (function(e) {
                e.preventDefault(), e.which == a || e.which == l ? t._handleUpDownKey(e.which) : e.which == c ? t._handleEnterKey() : e.which == u ? t._closeDropdown() : (e.which >= h && e.which <= p || e.which == g) && (s && clearTimeout(s), o += String.fromCharCode(e.which), t._searchForCountry(o), s = setTimeout((function() {
                  o = ""
                }), 1e3))
              }))
            },
            _handleUpDownKey: function(e) {
              var t = this.countryList.children(".highlight").first(),
                n = e == a ? t.prev() : t.next();
              n.length && (n.hasClass("divider") && (n = e == a ? n.prev() : n.next()), this._highlightListItem(n), this._scrollTo(n))
            },
            _handleEnterKey: function() {
              var e = this.countryList.children(".highlight").first();
              e.length && this._selectListItem(e)
            },
            _searchForCountry: function(e) {
              for (var t = 0; t < this.countries.length; t++)
                if (this._startsWith(this.countries[t].name, e)) {
                  var n = this.countryList.children("[data-country-code=" + this.countries[t].iso2 + "]").not(".preferred");
                  this._highlightListItem(n), this._scrollTo(n, !0);
                  break
                }
            },
            _startsWith: function(e, t) {
              return e.substr(0, t.length).toUpperCase() == t
            },
            _updateVal: function(e, n) {
              var i;
              if (this.options.autoFormat && t.intlTelInputUtils) {
                i = intlTelInputUtils.formatNumber(e, this.selectedCountryData.iso2, n);
                var o = this.telInput.attr("maxlength");
                o && i.length > o && (i = i.substr(0, o))
              } else i = e;
              E = "+" != i, this.telInput.val(i)
            },
            _updateFlagFromNumber: function(e) {
              this.options.nationalMode && this.selectedCountryData && "1" == this.selectedCountryData.dialCode && "+" != e.substr(0, 1) && (e = "+1" + e);
              var t = this._getDialCode(e);
              if (t) {
                var n = this.countryCodes[this._getNumeric(t)],
                  i = !1;
                if (this.selectedCountryData)
                  for (var o = 0; o < n.length; o++) n[o] == this.selectedCountryData.iso2 && (i = !0);
                if (!i || this._isUnknownNanp(e, t))
                  for (var s = 0; s < n.length; s++)
                    if (n[s]) {
                      this._selectFlag(n[s]);
                      break
                    }
              }
            },
            _isUnknownNanp: function(e, t) {
              return "+1" == t && this._getNumeric(e).length >= 4
            },
            _highlightListItem: function(e) {
              this.countryListItems.removeClass("highlight"), e.addClass("highlight")
            },
            _getCountryData: function(e, t, n) {
              for (var i = t ? k : this.countries, o = 0; o < i.length; o++)
                if (i[o].iso2 == e) return i[o];
              if (n) return null;
              throw new Error("No country data for '" + e + "'")
            },
            _selectFlag: function(e) {
              this.selectedCountryData = this._getCountryData(e, !1, !1), this.selectedFlagInner.attr("class", "flag " + e);
              var t = this.selectedCountryData.name + ": +" + this.selectedCountryData.dialCode;
              this.selectedFlagInner.parent().attr("title", t), this._updatePlaceholder();
              var n = this.countryListItems.children(".flag." + e).first().parent();
              this.countryListItems.removeClass("active"), n.addClass("active")
            },
            _updatePlaceholder: function() {
              if (t.intlTelInputUtils && !this.hadInitialPlaceholder) {
                var e = this.selectedCountryData.iso2,
                  n = intlTelInputUtils.numberType[this.options.numberType || "FIXED_LINE"],
                  i = intlTelInputUtils.getExampleNumber(e, this.options.nationalMode, n);
                this.telInput.attr("placeholder", i)
              }
            },
            _selectListItem: function(e) {
              var t = e.attr("data-country-code");
              this._selectFlag(t), this._closeDropdown(), this._updateDialCode(e.attr("data-dial-code"), !0), this.telInput.trigger("change"), this.telInput.focus()
            },
            _closeDropdown: function() {
              this.countryList.addClass("hide"), this.selectedFlagInner.children(".arrow").removeClass("up"), e(n).off(this.ns), e("html").off(this.ns), this.countryList.off(this.ns)
            },
            _scrollTo: function(e, t) {
              var n = this.countryList,
                i = n.height(),
                o = n.offset().top,
                s = o + i,
                r = e.outerHeight(),
                a = e.offset().top,
                l = a + r,
                c = a - o + n.scrollTop(),
                u = i / 2 - r / 2;
              if (a < o) t && (c -= u), n.scrollTop(c);
              else if (l > s) {
                t && (c += u);
                var d = i - r;
                n.scrollTop(c - d)
              }
            },
            _updateDialCode: function(t, n) {
              var i, o = this.telInput.val();
              if (t = "+" + t, this.options.nationalMode && "+" != o.substr(0, 1)) i = o;
              else if (o) {
                var s = this._getDialCode(o);
                i = s.length > 1 ? o.replace(s, t) : t + ("+" != o.substr(0, 1) ? e.trim(o) : "")
              } else i = !this.options.autoHideDialCode || n ? t : "";
              this._updateVal(i, n)
            },
            _getDialCode: function(t) {
              var n = "";
              if ("+" == t.charAt(0))
                for (var i = "", o = 0; o < t.length; o++) {
                  var s = t.charAt(o);
                  if (e.isNumeric(s) && (i += s, this.countryCodes[i] && (n = t.substr(0, o + 1)), 4 == i.length)) break
                }
              return n
            },
            destroy: function() {
              this._closeDropdown(), this.telInput.off(this.ns), this.selectedFlagInner.parent().off(this.ns), this.telInput.closest("label").off(this.ns), this.telInput.parent().before(this.telInput).remove()
            },
            getCleanNumber: function() {
              return t.intlTelInputUtils ? intlTelInputUtils.formatNumberE164(this.telInput.val(), this.selectedCountryData.iso2) : ""
            },
            getNumberType: function() {
              return t.intlTelInputUtils ? intlTelInputUtils.getNumberType(this.telInput.val(), this.selectedCountryData.iso2) : -99
            },
            getSelectedCountryData: function() {
              return this.selectedCountryData || {}
            },
            getValidationError: function() {
              return t.intlTelInputUtils ? intlTelInputUtils.getValidationError(this.telInput.val(), this.selectedCountryData.iso2) : -99
            },
            isValidNumber: function() {
              var n = e.trim(this.telInput.val()),
                i = this.options.nationalMode ? this.selectedCountryData.iso2 : "";
              return !(/[a-zA-Z]/.test(n) || !t.intlTelInputUtils) && intlTelInputUtils.isValidNumber(n, i)
            },
            loadUtils: function(n) {
              var i = n || this.options.utilsScript;
              !e.fn[o].loadedUtilsScript && i && (e.fn[o].loadedUtilsScript = !0, i.indexOf("vendor/intl-tel-input/lib/libphonenumber/build/utils") > -1 ? t.require(["intl-tel-input-utils"], (function() {
                e(".intl-tel-input input").intlTelInput("utilsLoaded")
              })) : e.ajax({
                url: i,
                success: function() {
                  e(".intl-tel-input input").intlTelInput("utilsLoaded")
                },
                dataType: "script",
                cache: !0
              }))
            },
            selectCountry: function(e) {
              this.selectedFlagInner.hasClass(e) || (this._selectFlag(e), this._updateDialCode(this.selectedCountryData.dialCode, !1))
            },
            setNumber: function(e, t) {
              this.options.nationalMode || "+" == e.substr(0, 1) || (e = "+" + e), this._updateFlagFromNumber(e), this._updateVal(e, t)
            },
            utilsLoaded: function() {
              this.options.autoFormat && this.telInput.val() && this._updateVal(this.telInput.val()), this._updatePlaceholder()
            }
          }, e.fn[o] = function(t) {
            var n, s = arguments;
            return t === i || "object" == typeof t ? this.each((function() {
              e.data(this, "plugin_" + o) || e.data(this, "plugin_" + o, new C(this, t))
            })) : "string" == typeof t && "_" !== t[0] && "init" !== t ? (this.each((function() {
              var i, r, a = e.data(this, "plugin_" + o);
              i = a, (null != (r = C) && "undefined" != typeof Symbol && r[Symbol.hasInstance] ? r[Symbol.hasInstance](i) : i instanceof r) && "function" == typeof a[t] && (n = a[t].apply(a, Array.prototype.slice.call(s, 1))), "destroy" === t && e.data(this, "plugin_" + o, null)
            })), n !== i ? n : this) : void 0
          }, e.fn[o].getCountryData = function() {
            return k
          }, e.fn[o].setCountryData = function(e) {
            k = e
          };
          for (var k = [
              ["Afghanistan (‫افغانستان‬‎)", "af", "93"],
              ["Albania (Shqipëri)", "al", "355"],
              ["Algeria (‫الجزائر‬‎)", "dz", "213"],
              ["American Samoa", "as", "1684"],
              ["Andorra", "ad", "376"],
              ["Angola", "ao", "244"],
              ["Anguilla", "ai", "1264"],
              ["Antigua and Barbuda", "ag", "1268"],
              ["Argentina", "ar", "54"],
              ["Armenia (Հայաստան)", "am", "374"],
              ["Aruba", "aw", "297"],
              ["Australia", "au", "61"],
              ["Austria (Österreich)", "at", "43"],
              ["Azerbaijan (Azərbaycan)", "az", "994"],
              ["Bahamas", "bs", "1242"],
              ["Bahrain (‫البحرين‬‎)", "bh", "973"],
              ["Bangladesh (বাংলাদেশ)", "bd", "880"],
              ["Barbados", "bb", "1246"],
              ["Belarus (Беларусь)", "by", "375"],
              ["Belgium (België)", "be", "32"],
              ["Belize", "bz", "501"],
              ["Benin (Bénin)", "bj", "229"],
              ["Bermuda", "bm", "1441"],
              ["Bhutan (འབྲུག)", "bt", "975"],
              ["Bolivia", "bo", "591"],
              ["Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387"],
              ["Botswana", "bw", "267"],
              ["Brazil (Brasil)", "br", "55"],
              ["British Indian Ocean Territory", "io", "246"],
              ["British Virgin Islands", "vg", "1284"],
              ["Brunei", "bn", "673"],
              ["Bulgaria (България)", "bg", "359"],
              ["Burkina Faso", "bf", "226"],
              ["Burundi (Uburundi)", "bi", "257"],
              ["Cambodia (កម្ពុជា)", "kh", "855"],
              ["Cameroon (Cameroun)", "cm", "237"],
              ["Canada", "ca", "1", 1, ["204", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]],
              ["Cape Verde (Kabu Verdi)", "cv", "238"],
              ["Caribbean Netherlands", "bq", "599", 1],
              ["Cayman Islands", "ky", "1345"],
              ["Central African Republic (République centrafricaine)", "cf", "236"],
              ["Chad (Tchad)", "td", "235"],
              ["Chile", "cl", "56"],
              ["China (中国)", "cn", "86"],
              ["Colombia", "co", "57"],
              ["Comoros (‫جزر القمر‬‎)", "km", "269"],
              ["Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243"],
              ["Congo (Republic) (Congo-Brazzaville)", "cg", "242"],
              ["Cook Islands", "ck", "682"],
              ["Costa Rica", "cr", "506"],
              ["Côte d’Ivoire", "ci", "225"],
              ["Croatia (Hrvatska)", "hr", "385"],
              ["Cuba", "cu", "53"],
              ["Curaçao", "cw", "599", 0],
              ["Cyprus (Κύπρος)", "cy", "357"],
              ["Czech Republic (Česká republika)", "cz", "420"],
              ["Denmark (Danmark)", "dk", "45"],
              ["Djibouti", "dj", "253"],
              ["Dominica", "dm", "1767"],
              ["Dominican Republic (República Dominicana)", "do", "1", 2, ["809", "829", "849"]],
              ["Ecuador", "ec", "593"],
              ["Egypt (‫مصر‬‎)", "eg", "20"],
              ["El Salvador", "sv", "503"],
              ["Equatorial Guinea (Guinea Ecuatorial)", "gq", "240"],
              ["Eritrea", "er", "291"],
              ["Estonia (Eesti)", "ee", "372"],
              ["Ethiopia", "et", "251"],
              ["Falkland Islands (Islas Malvinas)", "fk", "500"],
              ["Faroe Islands (Føroyar)", "fo", "298"],
              ["Fiji", "fj", "679"],
              ["Finland (Suomi)", "fi", "358"],
              ["France", "fr", "33"],
              ["French Guiana (Guyane française)", "gf", "594"],
              ["French Polynesia (Polynésie française)", "pf", "689"],
              ["Gabon", "ga", "241"],
              ["Gambia", "gm", "220"],
              ["Georgia (საქართველო)", "ge", "995"],
              ["Germany (Deutschland)", "de", "49"],
              ["Ghana (Gaana)", "gh", "233"],
              ["Gibraltar", "gi", "350"],
              ["Greece (Ελλάδα)", "gr", "30"],
              ["Greenland (Kalaallit Nunaat)", "gl", "299"],
              ["Grenada", "gd", "1473"],
              ["Guadeloupe", "gp", "590", 0],
              ["Guam", "gu", "1671"],
              ["Guatemala", "gt", "502"],
              ["Guinea (Guinée)", "gn", "224"],
              ["Guinea-Bissau (Guiné Bissau)", "gw", "245"],
              ["Guyana", "gy", "592"],
              ["Haiti", "ht", "509"],
              ["Honduras", "hn", "504"],
              ["Hong Kong (香港)", "hk", "852"],
              ["Hungary (Magyarország)", "hu", "36"],
              ["Iceland (Ísland)", "is", "354"],
              ["India (भारत)", "in", "91"],
              ["Indonesia", "id", "62"],
              ["Iran (‫ایران‬‎)", "ir", "98"],
              ["Iraq (‫العراق‬‎)", "iq", "964"],
              ["Ireland", "ie", "353"],
              ["Israel (‫ישראל‬‎)", "il", "972"],
              ["Italy (Italia)", "it", "39", 0],
              ["Jamaica", "jm", "1876"],
              ["Japan (日本)", "jp", "81"],
              ["Jordan (‫الأردن‬‎)", "jo", "962"],
              ["Kazakhstan (Казахстан)", "kz", "7", 1],
              ["Kenya", "ke", "254"],
              ["Kiribati", "ki", "686"],
              ["Kuwait (‫الكويت‬‎)", "kw", "965"],
              ["Kyrgyzstan (Кыргызстан)", "kg", "996"],
              ["Laos (ລາວ)", "la", "856"],
              ["Latvia (Latvija)", "lv", "371"],
              ["Lebanon (‫لبنان‬‎)", "lb", "961"],
              ["Lesotho", "ls", "266"],
              ["Liberia", "lr", "231"],
              ["Libya (‫ليبيا‬‎)", "ly", "218"],
              ["Liechtenstein", "li", "423"],
              ["Lithuania (Lietuva)", "lt", "370"],
              ["Luxembourg", "lu", "352"],
              ["Macau (澳門)", "mo", "853"],
              ["Macedonia (FYROM) (Македонија)", "mk", "389"],
              ["Madagascar (Madagasikara)", "mg", "261"],
              ["Malawi", "mw", "265"],
              ["Malaysia", "my", "60"],
              ["Maldives", "mv", "960"],
              ["Mali", "ml", "223"],
              ["Malta", "mt", "356"],
              ["Marshall Islands", "mh", "692"],
              ["Martinique", "mq", "596"],
              ["Mauritania (‫موريتانيا‬‎)", "mr", "222"],
              ["Mauritius (Moris)", "mu", "230"],
              ["Mexico (México)", "mx", "52"],
              ["Micronesia", "fm", "691"],
              ["Moldova (Republica Moldova)", "md", "373"],
              ["Monaco", "mc", "377"],
              ["Mongolia (Монгол)", "mn", "976"],
              ["Montenegro (Crna Gora)", "me", "382"],
              ["Montserrat", "ms", "1664"],
              ["Morocco (‫المغرب‬‎)", "ma", "212"],
              ["Mozambique (Moçambique)", "mz", "258"],
              ["Myanmar (Burma) (မြန်မာ)", "mm", "95"],
              ["Namibia (Namibië)", "na", "264"],
              ["Nauru", "nr", "674"],
              ["Nepal (नेपाल)", "np", "977"],
              ["Netherlands (Nederland)", "nl", "31"],
              ["New Caledonia (Nouvelle-Calédonie)", "nc", "687"],
              ["New Zealand", "nz", "64"],
              ["Nicaragua", "ni", "505"],
              ["Niger (Nijar)", "ne", "227"],
              ["Nigeria", "ng", "234"],
              ["Niue", "nu", "683"],
              ["Norfolk Island", "nf", "672"],
              ["North Korea (조선 민주주의 인민 공화국)", "kp", "850"],
              ["Northern Mariana Islands", "mp", "1670"],
              ["Norway (Norge)", "no", "47"],
              ["Oman (‫عُمان‬‎)", "om", "968"],
              ["Pakistan (‫پاکستان‬‎)", "pk", "92"],
              ["Palau", "pw", "680"],
              ["Palestine (‫فلسطين‬‎)", "ps", "970"],
              ["Panama (Panamá)", "pa", "507"],
              ["Papua New Guinea", "pg", "675"],
              ["Paraguay", "py", "595"],
              ["Peru (Perú)", "pe", "51"],
              ["Philippines", "ph", "63"],
              ["Poland (Polska)", "pl", "48"],
              ["Portugal", "pt", "351"],
              ["Puerto Rico", "pr", "1", 3, ["787", "939"]],
              ["Qatar (‫قطر‬‎)", "qa", "974"],
              ["Réunion (La Réunion)", "re", "262"],
              ["Romania (România)", "ro", "40"],
              ["Russia (Россия)", "ru", "7", 0],
              ["Rwanda", "rw", "250"],
              ["Saint Barthélemy (Saint-Barthélemy)", "bl", "590", 1],
              ["Saint Helena", "sh", "290"],
              ["Saint Kitts and Nevis", "kn", "1869"],
              ["Saint Lucia", "lc", "1758"],
              ["Saint Martin (Saint-Martin (partie française))", "mf", "590", 2],
              ["Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508"],
              ["Saint Vincent and the Grenadines", "vc", "1784"],
              ["Samoa", "ws", "685"],
              ["San Marino", "sm", "378"],
              ["São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239"],
              ["Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966"],
              ["Senegal (Sénégal)", "sn", "221"],
              ["Serbia (Србија)", "rs", "381"],
              ["Seychelles", "sc", "248"],
              ["Sierra Leone", "sl", "232"],
              ["Singapore", "sg", "65"],
              ["Sint Maarten", "sx", "1721"],
              ["Slovakia (Slovensko)", "sk", "421"],
              ["Slovenia (Slovenija)", "si", "386"],
              ["Solomon Islands", "sb", "677"],
              ["Somalia (Soomaaliya)", "so", "252"],
              ["South Africa", "za", "27"],
              ["South Korea (대한민국)", "kr", "82"],
              ["South Sudan (‫جنوب السودان‬‎)", "ss", "211"],
              ["Spain (España)", "es", "34"],
              ["Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94"],
              ["Sudan (‫السودان‬‎)", "sd", "249"],
              ["Suriname", "sr", "597"],
              ["Swaziland", "sz", "268"],
              ["Sweden (Sverige)", "se", "46"],
              ["Switzerland (Schweiz)", "ch", "41"],
              ["Syria (‫سوريا‬‎)", "sy", "963"],
              ["Taiwan (台灣)", "tw", "886"],
              ["Tajikistan", "tj", "992"],
              ["Tanzania", "tz", "255"],
              ["Thailand (ไทย)", "th", "66"],
              ["Timor-Leste", "tl", "670"],
              ["Togo", "tg", "228"],
              ["Tokelau", "tk", "690"],
              ["Tonga", "to", "676"],
              ["Trinidad and Tobago", "tt", "1868"],
              ["Tunisia (‫تونس‬‎)", "tn", "216"],
              ["Turkey (Türkiye)", "tr", "90"],
              ["Turkmenistan", "tm", "993"],
              ["Turks and Caicos Islands", "tc", "1649"],
              ["Tuvalu", "tv", "688"],
              ["U.S. Virgin Islands", "vi", "1340"],
              ["Uganda", "ug", "256"],
              ["Ukraine (Україна)", "ua", "380"],
              ["United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971"],
              ["United Kingdom", "gb", "44"],
              ["United States", "us", "1", 0],
              ["Uruguay", "uy", "598"],
              ["Uzbekistan (Oʻzbekiston)", "uz", "998"],
              ["Vanuatu", "vu", "678"],
              ["Vatican City (Città del Vaticano)", "va", "39", 1],
              ["Venezuela", "ve", "58"],
              ["Vietnam (Việt Nam)", "vn", "84"],
              ["Wallis and Futuna", "wf", "681"],
              ["Yemen (‫اليمن‬‎)", "ye", "967"],
              ["Zambia", "zm", "260"],
              ["Zimbabwe", "zw", "263"]
            ], I = 0; I < k.length; I++) {
            var A = k[I];
            k[I] = {
              name: A[0],
              iso2: A[1],
              dialCode: A[2],
              priority: A[3] || 0,
              areaCodes: A[4] || null
            }
          }
        }(e, window, document)
      }.apply(t, i)) || (e.exports = o);
      var s = "intl-tel-input";
      window.define(s, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof o === t ? typeof e === t ? void 0 : e.exports : o : __webpack_exports__;
        return n && n.default || n
      })), window.require([s])
    },
    181743: (e, t, n) => {
      var i, o, s, r, a, l, c = n(661533);
      o = c || window.$, r = {
        className: "autosizejs",
        id: "autosizejs",
        append: "\n",
        callback: !1,
        resizeDelay: 10,
        placeholder: !0
      }, a = ["fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "textTransform", "wordSpacing", "textIndent", "whiteSpace"], (l = o('<textarea tabindex="-1"/>').data("autosize", !0)[0]).style.cssText = "position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;", l.style.lineHeight = "99px", "99px" === o(l).css("lineHeight") && a.push("lineHeight"), l.style.lineHeight = "", o.fn.autosize = function(e) {
        return this.length ? (e = o.extend({}, r, e || {}), l.parentNode !== document.body && o(document.body).append(l), this.each((function() {
          var t, n, i, r = this,
            c = o(r),
            u = 0,
            d = o.isFunction(e.callback),
            h = {
              height: r.style.height,
              overflow: r.style.overflow,
              overflowY: r.style.overflowY,
              wordWrap: r.style.wordWrap,
              resize: r.style.resize
            },
            p = c.width(),
            f = c.css("resize");

          function _() {
            var e, t = window.getComputedStyle ? window.getComputedStyle(r, null) : null;
            t ? (e = parseFloat(t.width), "border-box" !== t.boxSizing && "border-box" !== t.webkitBoxSizing && "border-box" !== t.mozBoxSizing || o.each(["paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"], (function(n, i) {
              e -= parseFloat(t[i])
            }))) : e = c.width(), l.style.width = Math.max(e, 0) + "px"
          }

          function g() {
            var i, h;
            s !== r ? function() {
              var n = {};
              if (s = r, l.className = e.className, l.id = e.id, l.setAttribute("rows", r.getAttribute("rows") || 1), t = parseFloat(c.css("maxHeight")), o.each(a, (function(e, t) {
                  n[t] = c.css(t)
                })), o(l).css(n).attr("wrap", c.attr("wrap")), _(), window.chrome) {
                var i = r.style.width;
                r.style.width = "0px", r.offsetWidth, r.style.width = i
              }
            }() : _(), !r.value && e.placeholder ? l.value = c.attr("placeholder") || "" : l.value = r.value, l.value += e.append || "", l.style.overflowY = r.style.overflowY, h = parseFloat(r.style.height) || 0, l.scrollTop = 0, l.scrollTop = 9e4, i = l.scrollTop, t && i > t ? (r.style.overflowY = "scroll", i = t) : (r.style.overflowY = "hidden", i < n && (i = n)), i += u, Math.abs(h - i) > .01 && (r.style.height = i + "px", l.className = l.className, d && e.callback.call(r, r), c.trigger("autosize.resized"))
          }

          function m() {
            clearTimeout(i), i = setTimeout((function() {
              var e = c.width();
              e !== p && (p = e, g())
            }), parseInt(e.resizeDelay, 10))
          }
          c.data("autosize") || (c.data("autosize", !0), e.noBoxOffset || "border-box" !== c.css("box-sizing") && "border-box" !== c.css("-moz-box-sizing") && "border-box" !== c.css("-webkit-box-sizing") || (u = c.outerHeight() - c.height()), n = Math.max(parseFloat(c.css("minHeight")) - u || 0, c.height()), c.css({
            overflow: "hidden",
            overflowY: "hidden",
            wordWrap: "break-word"
          }), "vertical" === f ? c.css("resize", "none") : "both" === f && c.css("resize", "horizontal"), "onpropertychange" in r ? "oninput" in r ? c.on("input.autosize keyup.autosize", g) : c.on("propertychange.autosize", (function() {
            "value" === event.propertyName && g()
          })) : c.on("input.autosize", g), !1 !== e.resizeDelay && o(window).on("resize.autosize", m), c.on("autosize.resize", g), c.on("autosize.resizeIncludeStyle", (function() {
            s = null, g()
          })), c.on("autosize.destroy", (function() {
            s = null, clearTimeout(i), o(window).off("resize", m), c.off("autosize").off(".autosize").css(h).removeData("autosize")
          })), g())
        }))) : this
      }, o.fn.autosizeInput = function(e) {
        return e = o.extend({
          maxWidth: 1e3,
          minWidth: 0,
          comfortZone: 5,
          appendValue: function() {}
        }, e), this.filter('input:text, input[type="number"]').each((function() {
          var t = e.minWidth,
            n = "",
            i = o(this),
            s = o("<tester/>").css({
              position: "absolute",
              top: -9999,
              left: -9999,
              width: "auto",
              fontSize: i.css("fontSize"),
              fontFamily: "Roboto" === i.css("fontFamily") ? "Arial" : i.css("fontFamily"),
              fontWeight: i.css("fontWeight"),
              fontStyle: i.css("fontStyle"),
              letterSpacing: i.css("letterSpacing"),
              textTransform: i.css("textTransform"),
              whiteSpace: "pre"
            }),
            r = function(o) {
              var r, a, l;
              n === (n = i.val()) && n && !1 !== o || (n ? n += e.appendValue.call(i.get(0)) || "" : n = i.attr("placeholder") || "", r = n.replace(/&/g, "&amp;").replace(/\s/g, " ").replace(/</g, "&lt;").replace(/>/g, "&gt;"), s.html(r), ((l = (a = s.width()) + e.comfortZone >= t ? a + e.comfortZone : t) < i.width() && l >= t || l > t) && i.width(l))
            };
          s.insertAfter(i), o(this).on("autosize:important", r.bind(this, !1)).on("autosize", r).on("input", r).on("autosize.destroy", (function() {
            s.remove(), o(this).off("autosize:important").off("autosize", r).off("input", r)
          })), r()
        })), this
      }, void 0 === (i = function() {}.call(t, n, t, e)) || (e.exports = i);
      var u = "vendor/jquery-plugins/jquery.autosize";
      window.define(u, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof i === t ? typeof e === t ? void 0 : e.exports : i : __webpack_exports__;
        return n && n.default || n
      })), window.require([u])
    },
    200123: (e, t, n) => {
      var i, o, s = n(661533);
      (o = s || window.Zepto).event.special.swipe = {
        setup: function() {
          o(this).on("touchstart", o.event.special.swipe.handler)
        },
        teardown: function() {
          o(this).off("touchstart", o.event.special.swipe.handler)
        },
        handler: function(e) {
          var t, n, i = [].slice.call(arguments, 1),
            s = e.originalEvent.touches,
            r = 0,
            a = 0,
            l = this;

          function c() {
            l.removeEventListener("touchmove", u), l.removeEventListener("touchend", c), t = n = null
          }

          function u(s) {
            var u = t - s.touches[0].pageX,
              d = n - s.touches[0].pageY,
              h = Math.abs(u) >= 20,
              p = Math.abs(d) >= 20;
            return (h || p) && (c(), r = h ? u > 0 ? -1 : 1 : 0, a = p ? d > 0 ? 1 : -1 : 0), 0 !== r && o(l).hasClass("js-swipe-prevent-x") && s.preventDefault(), e.type = "swipe", i.unshift(e, r, a, s.touches.length), (o.event.dispatch || o.event.handle).apply(l, i)
          }
          e = o.event.fix(e), 1 == s.length && (t = s[0].pageX, n = s[0].pageY, this.addEventListener("touchmove", u, !1), this.addEventListener("touchend", c, !1))
        }
      }, void 0 === (i = function() {}.call(t, n, t, e)) || (e.exports = i);
      var r = "vendor/jquery-plugins/jquery.swipe";
      window.define(r, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof i === t ? typeof e === t ? void 0 : e.exports : i : __webpack_exports__;
        return n && n.default || n
      })), window.require([r])
    },
    145027: (e, t, n) => {
      var i;
      void 0 === (i = function(e) {
        var t = n(661533);
        return n(528803), n(462106), n(963880), n(659642), n(772362), n(517430), t
      }.call(t, n, t, e)) || (e.exports = i)
    },
    695763: (e, t, n) => {
      ! function() {
        "use strict";
        var e, t, i = n(161320);
        switch (APP.lang_id) {
          case "ru":
            return function() {
              function e(e, t, n) {
                var i, o;
                return "m" === n ? t ? "минута" : "минуту" : e + " " + (i = +e, o = {
                  mm: "минута_минуты_минут",
                  hh: "час_часа_часов",
                  dd: "день_дня_дней",
                  MM: "месяц_месяца_месяцев",
                  yy: "год_года_лет"
                } [n].split("_"), i % 10 == 1 && i % 100 != 11 ? o[0] : i % 10 >= 2 && i % 10 <= 4 && (i % 100 < 10 || i % 100 >= 20) ? o[1] : o[2])
              }
              i.locale("ru", {
                months: function(e, t) {
                  return {
                    nominative: "Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь".split("_"),
                    accusative: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")
                  } [/D[oD]? *MMMM?/.test(t) ? "accusative" : "nominative"][e.month()]
                },
                monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
                weekdays: function(e, t) {
                  return {
                    nominative: "Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота".split("_"),
                    accusative: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")
                  } [/\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/.test(t) ? "accusative" : "nominative"][e.day()]
                },
                weekdaysShort: "Вск_Пнд_Втр_Срд_Чтв_Птн_Сбт".split("_"),
                weekdaysMin: "Вс_Пн_Вт_Ср_Чт_Пт_Сб".split("_"),
                previousMonth: "Предыдущий месяц",
                nextMonth: "Следующий месяц",
                longDateFormat: {
                  LT: APP.system.format.date.time,
                  L: "DD.MM.YYYY",
                  LL: "D MMMM YYYY г.",
                  LLL: "D MMMM YYYY г., LT",
                  LLLL: "dddd, D MMMM YYYY г., LT"
                },
                calendar: {
                  sameDay: "[Сегодня,] LT",
                  nextDay: "[Завтра,] LT",
                  lastDay: "[Вчера,] LT",
                  today: "[Сегодня]",
                  yesterday: "[Вчера]",
                  tomorrow: "[Завтра]",
                  nextWeek: APP.system.format.date.full,
                  lastWeek: APP.system.format.date.full,
                  sameElse: APP.system.format.date.full
                },
                relativeTime: {
                  future: "через %s",
                  past: "%s назад",
                  s: "несколько секунд",
                  m: e,
                  mm: e,
                  h: "час",
                  hh: e,
                  d: "день",
                  dd: e,
                  M: "месяц",
                  MM: e,
                  y: "год",
                  yy: e
                },
                ordinal: "%d.",
                week: {
                  dow: 1,
                  doy: 7
                }
              })
            }();
          case "es":
            return e = "Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_"), t = "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"), void i.locale("es", {
              months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
              monthsShort: function(n, i) {
                return /-MMM-/.test(i) ? t[n.month()] : e[n.month()]
              },
              weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
              weekdaysShort: "Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),
              weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
              longDateFormat: {
                LT: APP.system.format.date.time,
                L: "DD/MM/YYYY",
                LL: "D [de] MMMM [del] YYYY",
                LLL: "D [de] MMMM [del] YYYY LT",
                LLLL: "dddd, D [de] MMMM [del] YYYY LT"
              },
              calendar: {
                today: "[Hoy]",
                yesterday: "[Ayer]",
                tomorrow: "[Mañana]",
                sameDay: function() {
                  return "[Hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextDay: function() {
                  return "[Mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                nextWeek: APP.system.format.date.full,
                lastDay: function() {
                  return "[Ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
                },
                lastWeek: APP.system.format.date.full,
                sameElse: APP.system.format.date.full
              },
              relativeTime: {
                future: "en %s",
                past: "hace %s",
                s: "unos segundos",
                m: "un minuto",
                mm: "%d minutos",
                h: "una hora",
                hh: "%d horas",
                d: "un día",
                dd: "%d días",
                M: "un mes",
                MM: "%d meses",
                y: "un año",
                yy: "%d años"
              },
              ordinal: "%dº",
              week: {
                dow: 1,
                doy: 4
              }
            });
          case "pt":
            return function() {
              var e = "Jan._Fev._Mar._Abr._Mai._Jun._Jul._Ago._Set._Out._Nov._Dez.".split("_"),
                t = "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_");
              i.locale("pt", {
                months: "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
                monthsShort: function(n, i) {
                  return /-MMM-/.test(i) ? t[n.month()] : e[n.month()]
                },
                weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
                weekdaysShort: "Dom._Seg._Ter._Qua._Qui._Sex._Sáb.".split("_"),
                weekdaysMin: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
                longDateFormat: {
                  LT: APP.system.format.date.time,
                  L: "DD/MM/YYYY",
                  LL: "D [de] MMMM [de] YYYY",
                  LLL: "D [de] MMMM [de] YYYY LT",
                  LLLL: "dddd, D [de] MMMM [de] YYYY LT"
                },
                calendar: {
                  today: "[Hoje]",
                  tomorrow: "[Amanhã]",
                  yesterday: "[Ontem]",
                  sameDay: "[Hoje às] LT",
                  nextDay: "[Amanhã às] LT",
                  nextWeek: "dddd [às] LT",
                  lastDay: "[Ontem às] LT",
                  lastWeek: function() {
                    return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
                  },
                  sameElse: "L"
                },
                relativeTime: {
                  future: "en %s",
                  past: "hace %s",
                  s: "unos segundos",
                  m: "un minuto",
                  mm: "%d minutos",
                  h: "una hora",
                  hh: "%d horas",
                  d: "un día",
                  dd: "%d días",
                  M: "un mes",
                  MM: "%d meses",
                  y: "un año",
                  yy: "%d años"
                },
                ordinal: "%dº",
                week: {
                  dow: 1,
                  doy: 4
                }
              })
            }();
          case "id":
            return void i.locale("id", {
              months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),
              monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agu_Sep_Okt_Nov_Des".split("_"),
              weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
              weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
              weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
              longDateFormat: {
                LT: APP.system.format.date.time,
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY [pukul] LT",
                LLLL: "dddd, D MMMM YYYY [pukul] LT"
              },
              calendar: {
                today: "[Hari ini]",
                yesterday: "[Kemarin]",
                tomorrow: "[Besok]",
                sameDay: "[Hari ini,] LT",
                lastDay: "[Kemarin,] LT",
                nextDay: "[Besok,] LT",
                nextWeek: APP.system.format.date.full,
                lastWeek: APP.system.format.date.full,
                sameElse: APP.system.format.date.full
              },
              relativeTime: {
                future: "dalam %s",
                past: "%s yang lalu",
                s: "beberapa detik",
                ss: "%d detik",
                m: "semenit",
                mm: "%d menit",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: "%d hari",
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
              },
              week: {
                dow: 1,
                doy: 7
              }
            });
          case "tr":
            var o = {
              1: "'inci",
              5: "'inci",
              8: "'inci",
              70: "'inci",
              80: "'inci",
              2: "'nci",
              7: "'nci",
              20: "'nci",
              50: "'nci",
              3: "'üncü",
              4: "'üncü",
              100: "'üncü",
              6: "'ncı",
              9: "'uncu",
              10: "'uncu",
              30: "'uncu",
              60: "'ıncı",
              90: "'ıncı"
            };
            return void i.locale("tr", {
              months: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
              monthsShort: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
              weekdays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
              weekdaysShort: "Paz_Pzt_Sal_Çar_Per_Cum_Cts".split("_"),
              weekdaysMin: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
              longDateFormat: {
                LT: APP.system.format.date.time,
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
              },
              calendar: {
                today: "[Bugün]",
                yesterday: "[Dün]",
                tomorrow: "[Yarın]",
                sameDay: "[Bugün,] LT",
                lastDay: "[Dün,] LT",
                nextDay: "[Yarın,] LT",
                nextWeek: APP.system.format.date.full,
                lastWeek: APP.system.format.date.full,
                sameElse: APP.system.format.date.full
              },
              relativeTime: {
                future: "%s sonra",
                past: "%s önce",
                s: "birkaç saniye",
                ss: "%d saniye",
                m: "bir dakika",
                mm: "%d dakika",
                h: "bir saat",
                hh: "%d saat",
                d: "bir gün",
                dd: "%d gün",
                M: "bir ay",
                MM: "%d ay",
                y: "bir yıl",
                yy: "%d yıl"
              },
              ordinal: function(e, t) {
                switch (t) {
                  case "d":
                  case "D":
                  case "Do":
                  case "DD":
                    return e;
                  default:
                    if (0 === e) return e + "'ıncı";
                    var n = e % 10;
                    return e + (o[n] || o[e % 100 - n] || o[e >= 100 ? 100 : null])
                }
              },
              week: {
                dow: 1,
                doy: 7
              }
            });
          case "ch":
            return function() {
              var e = "一月_二月_游行_四月_可能_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
                t = "一月_二月_游行_四月_可能_六月_七月_八月_九月_十月_十一月_十二月".split("_");
              i.locale("ch", {
                months: "一月_二月_游行_四月_可能_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
                monthsShort: function(n, i) {
                  return /-MMM-/.test(i) ? t[n.month()] : e[n.month()]
                },
                weekdays: "日_一_二_三_四_五_六".split("_"),
                weekdaysShort: "日_一_二_三_四_五_六".split("_"),
                weekdaysMin: "日_一_二_三_四_五_六".split("_"),
                longDateFormat: {
                  LT: APP.system.format.date.time,
                  L: "YYYY/MM/DD",
                  LL: "YYYY MMMM D",
                  LLL: "YYYY MMMM D LT",
                  LLLL: "dddd, YYYY  MMMM D LT"
                },
                calendar: {
                  today: "[今天]",
                  yesterday: "[昨天]",
                  tomorrow: "[明天]",
                  sameDay: "[今天,] LT",
                  nextDay: "[明天,] LT",
                  nextWeek: APP.system.format.date.full,
                  lastDay: "[昨天,] LT",
                  lastWeek: APP.system.format.date.full,
                  sameElse: APP.system.format.date.full
                },
                relativeTime: {
                  future: "在 %s",
                  past: "%s 前",
                  s: "几秒钟",
                  m: "分钟",
                  mm: "%d 分钟",
                  h: "小时",
                  hh: "%d 小时",
                  d: "天",
                  dd: "%d 天",
                  M: "月",
                  MM: "%d 个月",
                  y: "年",
                  yy: "%d 年份"
                },
                ordinal: "%d",
                week: {
                  dow: 1,
                  doy: 4
                }
              })
            }();
          default:
            i.updateLocale("en", {
              months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
              monthsShort: "Jan_Feb_Mar_Apr_May_June_July_Aug_Sept_Oct_Nov_Dec".split("_"),
              weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
              weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
              weekdaysMin: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
              previousMonth: "Previous Month",
              nextMonth: "Next Month",
              longDateFormat: {
                LT: APP.system.format.date.time,
                L: "DD/MM/YYYY",
                LL: "D MMMM YYYY",
                LLL: "D MMMM YYYY LT",
                LLLL: "dddd, D MMMM YYYY LT"
              },
              calendar: {
                sameDay: "[Today,] LT",
                nextDay: "[Tomorrow,] LT",
                lastDay: "[Yesterday,] LT",
                today: "[Today]",
                yesterday: "[Yesterday]",
                tomorrow: "[Tomorrow]",
                nextWeek: APP.system.format.date.full,
                lastWeek: APP.system.format.date.full,
                sameElse: APP.system.format.date.full
              },
              relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
              },
              ordinal: function(e) {
                var t = e % 10;
                return e + (1 == ~~(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
              },
              week: {
                dow: 0,
                doy: 4
              }
            })
        }
      }()
    },
    213882: (e, t, n) => {
      ! function(e) {
        if (e.support.touch = "ontouchend" in document, e.support.touch && e.ui && e.ui.mouse) {
          var t, n, i, o, s, r, a = e.ui.mouse.prototype,
            l = a._mouseInit,
            c = a._mouseDestroy;
          a._touchStart = function(t) {
            var n = this,
              o = e(this.element);
            if (this.is_sortable = !!o.hasClass("ui-sortable") && o.data("ui-sortable"), this.is_draggable = !!o.hasClass("ui-draggable") && o.data("ui-draggable"), !i) {
              r = this.element.get(0).style[Modernizr.prefixed("transition")], clearTimeout(s);
              var a, l = e(".js-scroll-x-container"),
                c = d(window, l);
              s = setTimeout((function() {
                l.length ? (a = d(window, l), Math.abs(c.y - a.y) < 3 && Math.abs(c.x - a.x) < 3 && h.call(n, t)) : h.call(n, t)
              }), 200)
            }
          }, a._touchMove = function(e) {
            if (i) {
              var s = e.originalEvent.touches[0].screenX,
                r = e.originalEvent.touches[0].screenY;
              t >= s - 4 && t <= s + 4 && n >= r - 4 && n <= r + 4 ? o = !1 : (o = !0, u(e, "mousemove"))
            }
          }, a._touchEnd = function(t) {
            var n = !(!this.currentItem || !this.currentItem.parents("body").length) && this.currentItem;
            clearTimeout(s), i && (u(t, "mouseup"), u(t, "mouseout"), n || (n = this.element), n && (n[0].style[Modernizr.prefixed("transition")] = r, n[0].style[Modernizr.prefixed("transform")] = n[0].style[Modernizr.prefixed("transform")].replace(/,?\s?scale\(\d*.\d*\),?\s?/gi, ""), r = ""), o || u(t, "click"), i = !1, this.currentItem = e("<div/>"))
          }, a._mouseInit = function() {
            var t = this;
            t.element.bind({
              touchstart: e.proxy(t, "_touchStart"),
              touchmove: e.proxy(t, "_touchMove"),
              touchend: e.proxy(t, "_touchEnd")
            }), l.call(t)
          }, a._mouseDestroy = function() {
            var t = this;
            t.element.unbind({
              touchstart: e.proxy(t, "_touchStart"),
              touchmove: e.proxy(t, "_touchMove"),
              touchend: e.proxy(t, "_touchEnd")
            }), c.call(t)
          }
        }

        function u(e, t) {
          if (!(e.originalEvent.touches.length > 1)) {
            e.preventDefault();
            var n = e.originalEvent.changedTouches[0],
              i = document.createEvent("MouseEvents");
            i.initMouseEvent(t, !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null), e.target.dispatchEvent(i)
          }
        }

        function d(e, t) {
          return {
            x: t.scrollLeft(),
            y: e.pageYOffset
          }
        }

        function h(e) {
          var s;
          i = !0, o = !1, t = e.originalEvent.touches[0].screenX, n = e.originalEvent.touches[0].screenY, this.is_sortable || this.is_draggable ? (p(e), s = !(!this.currentItem || !this.currentItem.length) && this.currentItem, this.is_draggable && (s = this.element), this.element.addClass("ui-started"), s && (s.prepareTransition(), s[0].style[Modernizr.prefixed("transition")] = r + (r ? ", " : "") + Modernizr.prefixed("transform") + " .2s", s[0].style[Modernizr.prefixed("transform")] = s[0].style[Modernizr.prefixed("transform")] + (s[0].style[Modernizr.prefixed("transform")] ? ", " : "") + "scale(1.04)")) : p(e)
        }

        function p(e) {
          u(e, "mouseover"), u(e, "mousemove"), u(e, "mousedown")
        }
      }(n(661533))
    },
    80968: (e, t, n) => {
      var i;
      (function() {
        window.Modernizr = function(e, t, n) {
            function i(e) {
              _.cssText = e
            }

            function o(e, t) {
              return (void 0 === e ? "undefined" : (n = e) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) === t;
              var n
            }

            function s(e, t) {
              return !!~("" + e).indexOf(t)
            }

            function r(e, t) {
              for (var i in e) {
                var o = e[i];
                if (!s(o, "-") && _[o] !== n) return "pfx" != t || o
              }
              return !1
            }

            function a(e, t, i) {
              for (var s in e) {
                var r = t[e[s]];
                if (r !== n) return !1 === i ? e[s] : o(r, "function") ? r.bind(i || t) : r
              }
              return !1
            }

            function l(e, t, n) {
              var i = e.charAt(0).toUpperCase() + e.slice(1),
                s = (e + " " + w.join(i + " ") + i).split(" ");
              return o(t, "string") || o(t, "undefined") ? r(s, t) : a(s = (e + " " + P.join(i + " ") + i).split(" "), t, n)
            }
            var c, u, d = {},
              h = t.documentElement,
              p = "modernizr",
              f = t.createElement(p),
              _ = f.style,
              g = t.createElement("input"),
              m = ":)",
              v = {}.toString,
              y = " -webkit- -moz- -o- -ms- ".split(" "),
              b = "Webkit Moz O ms",
              w = b.split(" "),
              P = b.toLowerCase().split(" "),
              E = "http://www.w3.org/2000/svg",
              C = {},
              k = {},
              I = {},
              A = [],
              T = A.slice,
              S = function(e, n, i, o) {
                var s, r, a, l, c = t.createElement("div"),
                  u = t.body,
                  d = u || t.createElement("body");
                if (parseInt(i, 10))
                  for (; i--;)(a = t.createElement("div")).id = o ? o[i] : p + (i + 1), c.appendChild(a);
                return s = ["&#173;", '<style id="s', p, '">', e, "</style>"].join(""), c.id = p, (u ? c : d).innerHTML += s, d.appendChild(c), u || (d.style.background = "", d.style.overflow = "hidden", l = h.style.overflow, h.style.overflow = "hidden", h.appendChild(d)), r = n(c, e), u ? c.parentNode.removeChild(c) : (d.parentNode.removeChild(d), h.style.overflow = l), !!r
              },
              x = function() {
                var e = {
                  select: "input",
                  change: "input",
                  submit: "form",
                  reset: "form",
                  error: "img",
                  load: "img",
                  abort: "img"
                };
                return function(i, s) {
                  s = s || t.createElement(e[i] || "div");
                  var r = (i = "on" + i) in s;
                  return r || (s.setAttribute || (s = t.createElement("div")), s.setAttribute && s.removeAttribute && (s.setAttribute(i, ""), r = o(s[i], "function"), o(s[i], "undefined") || (s[i] = n), s.removeAttribute(i))), s = null, r
                }
              }(),
              D = {}.hasOwnProperty;
            for (var O in u = o(D, "undefined") || o(D.call, "undefined") ? function(e, t) {
                return t in e && o(e.constructor.prototype[t], "undefined")
              } : function(e, t) {
                return D.call(e, t)
              }, Function.prototype.bind || (Function.prototype.bind = function(e) {
                var t = this;
                if ("function" != typeof t) throw new TypeError;
                var n = T.call(arguments, 1),
                  i = function() {
                    if (this, null != (a = i) && "undefined" != typeof Symbol && a[Symbol.hasInstance] ? a[Symbol.hasInstance](this) : this instanceof a) {
                      var o = function() {};
                      o.prototype = t.prototype;
                      var s = new o,
                        r = t.apply(s, n.concat(T.call(arguments)));
                      return Object(r) === r ? r : s
                    }
                    var a;
                    return t.apply(e, n.concat(T.call(arguments)))
                  };
                return i
              }), C.flexbox = function() {
                return l("flexWrap")
              }, C.flexboxlegacy = function() {
                return l("boxDirection")
              }, C.canvas = function() {
                var e = t.createElement("canvas");
                return !!e.getContext && !!e.getContext("2d")
              }, C.canvastext = function() {
                return !!d.canvas && !!o(t.createElement("canvas").getContext("2d").fillText, "function")
              }, C.webgl = function() {
                return !!e.WebGLRenderingContext
              }, C.geolocation = function() {
                return "geolocation" in navigator
              }, C.postmessage = function() {
                return !!e.postMessage
              }, C.websqldatabase = function() {
                return !!e.openDatabase
              }, C.indexedDB = function() {
                return !!l("indexedDB", e)
              }, C.hashchange = function() {
                return x("hashchange", e) && (t.documentMode === n || t.documentMode > 7)
              }, C.history = function() {
                return !!e.history && !!history.pushState
              }, C.draganddrop = function() {
                var e = t.createElement("div");
                return "draggable" in e || "ondragstart" in e && "ondrop" in e
              }, C.websockets = function() {
                return "WebSocket" in e || "MozWebSocket" in e
              }, C.rgba = function() {
                return i("background-color:rgba(150,255,150,.5)"), s(_.backgroundColor, "rgba")
              }, C.hsla = function() {
                return i("background-color:hsla(120,40%,100%,.5)"), s(_.backgroundColor, "rgba") || s(_.backgroundColor, "hsla")
              }, C.multiplebgs = function() {
                return i("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(_.background)
              }, C.backgroundsize = function() {
                return l("backgroundSize")
              }, C.borderimage = function() {
                return l("borderImage")
              }, C.borderradius = function() {
                return l("borderRadius")
              }, C.boxshadow = function() {
                return l("boxShadow")
              }, C.textshadow = function() {
                return "" === t.createElement("div").style.textShadow
              }, C.opacity = function() {
                return i(y.join("opacity:.55;") + ""), /^0.55$/.test(_.opacity)
              }, C.cssanimations = function() {
                return l("animationName")
              }, C.csscolumns = function() {
                return l("columnCount")
              }, C.cssgradients = function() {
                var e = "background-image:";
                return i((e + "-webkit- ".split(" ").join("gradient(linear,left top,right bottom,from(#9f9),to(white));" + e) + y.join("linear-gradient(left top,#9f9, white);" + e)).slice(0, -17)), s(_.backgroundImage, "gradient")
              }, C.cssreflections = function() {
                return l("boxReflect")
              }, C.csstransforms = function() {
                return !!l("transform")
              }, C.csstransforms3d = function() {
                var e = !!l("perspective");
                return e && "webkitPerspective" in h.style && S("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", (function(t, n) {
                  e = 9 === t.offsetLeft && 3 === t.offsetHeight
                })), e
              }, C.csstransitions = function() {
                return l("transition")
              }, C.fontface = function() {
                var e;
                return S('@font-face {font-family:"font";src:url("https://")}', (function(n, i) {
                  var o = t.getElementById("smodernizr"),
                    s = o.sheet || o.styleSheet,
                    r = s ? s.cssRules && s.cssRules[0] ? s.cssRules[0].cssText : s.cssText || "" : "";
                  e = /src/i.test(r) && 0 === r.indexOf(i.split(" ")[0])
                })), e
              }, C.generatedcontent = function() {
                var e;
                return S(["#", p, "{font:0/0 a}#", p, ':after{content:"', m, '";visibility:hidden;font:3px/1 a}'].join(""), (function(t) {
                  e = t.offsetHeight >= 3
                })), e
              }, C.video = function() {
                var e = t.createElement("video"),
                  n = !1;
                try {
                  (n = !!e.canPlayType) && ((n = new Boolean(n)).ogg = e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), n.h264 = e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), n.webm = e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ""))
                } catch (e) {}
                return n
              }, C.audio = function() {
                var e = t.createElement("audio"),
                  n = !1;
                try {
                  (n = !!e.canPlayType) && ((n = new Boolean(n)).ogg = e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), n.mp3 = e.canPlayType("audio/mpeg;").replace(/^no$/, ""), n.wav = e.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), n.m4a = (e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/aac;")).replace(/^no$/, ""))
                } catch (e) {}
                return n
              }, C.localstorage = function() {
                try {
                  return localStorage.setItem(p, p), localStorage.removeItem(p), !0
                } catch (e) {
                  return !1
                }
              }, C.sessionstorage = function() {
                try {
                  return sessionStorage.setItem(p, p), sessionStorage.removeItem(p), !0
                } catch (e) {
                  return !1
                }
              }, C.webworkers = function() {
                return !!e.Worker
              }, C.applicationcache = function() {
                return !!e.applicationCache
              }, C.svg = function() {
                return !!t.createElementNS && !!t.createElementNS(E, "svg").createSVGRect
              }, C.inlinesvg = function() {
                var e = t.createElement("div");
                return e.innerHTML = "<svg/>", (e.firstChild && e.firstChild.namespaceURI) == E
              }, C.smil = function() {
                return !!t.createElementNS && /SVGAnimate/.test(v.call(t.createElementNS(E, "animate")))
              }, C.svgclippaths = function() {
                return !!t.createElementNS && /SVGClipPath/.test(v.call(t.createElementNS(E, "clipPath")))
              }, C) u(C, O) && (c = O.toLowerCase(), d[c] = C[O](), A.push((d[c] ? "" : "no-") + c));
            return d.input || (d.input = function(n) {
                for (var i = 0, o = n.length; i < o; i++) I[n[i]] = n[i] in g;
                return I.list && (I.list = !!t.createElement("datalist") && !!e.HTMLDataListElement), I
              }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), d.inputtypes = function(e) {
                for (var i, o, s, r = 0, a = e.length; r < a; r++) g.setAttribute("type", o = e[r]), (i = "text" !== g.type) && (g.value = m, g.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(o) && g.style.WebkitAppearance !== n ? (h.appendChild(g), i = (s = t.defaultView).getComputedStyle && "textfield" !== s.getComputedStyle(g, null).WebkitAppearance && 0 !== g.offsetHeight, h.removeChild(g)) : /^(search|tel)$/.test(o) || (i = /^(url|email)$/.test(o) ? g.checkValidity && !1 === g.checkValidity() : g.value != m)), k[e[r]] = !!i;
                return k
              }("search tel url email datetime date month week time datetime-local number range color".split(" "))), d.addTest = function(e, t) {
                if ("object" == typeof e)
                  for (var i in e) u(e, i) && d.addTest(i, e[i]);
                else {
                  if (e = e.toLowerCase(), d[e] !== n) return d;
                  t = "function" == typeof t ? t() : t, h.className += " " + (t ? "" : "no-") + e, d[e] = t
                }
                return d
              }, i(""), f = g = null,
              function(e, t) {
                function n() {
                  var e = f.elements;
                  return "string" == typeof e ? e.split(" ") : e
                }

                function i(e) {
                  var t = p[e[d]];
                  return t || (t = {}, h++, e[d] = h, p[h] = t), t
                }

                function o(e, n, o) {
                  return n || (n = t), a ? n.createElement(e) : (o || (o = i(n)), (s = o.cache[e] ? o.cache[e].cloneNode() : u.test(e) ? (o.cache[e] = o.createElem(e)).cloneNode() : o.createElem(e)).canHaveChildren && !c.test(e) ? o.frag.appendChild(s) : s);
                  var s
                }

                function s(e) {
                  e || (e = t);
                  var s = i(e);
                  return f.shivCSS && !r && !s.hasCSS && (s.hasCSS = !! function(e, t) {
                    var n = e.createElement("p"),
                      i = e.getElementsByTagName("head")[0] || e.documentElement;
                    return n.innerHTML = "x<style>article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}</style>", i.insertBefore(n.lastChild, i.firstChild)
                  }(e)), a || function(e, t) {
                    t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function(n) {
                      return f.shivMethods ? o(n, e, t) : t.createElem(n)
                    }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + n().join().replace(/\w+/g, (function(e) {
                      return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
                    })) + ");return n}")(f, t.frag)
                  }(e, s), e
                }
                var r, a, l = e.html5 || {},
                  c = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
                  u = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
                  d = "_html5shiv",
                  h = 0,
                  p = {};
                ! function() {
                  try {
                    var e = t.createElement("a");
                    e.innerHTML = "<xyz></xyz>", r = "hidden" in e, a = 1 == e.childNodes.length || function() {
                      t.createElement("a");
                      var e = t.createDocumentFragment();
                      return void 0 === e.cloneNode || void 0 === e.createDocumentFragment || void 0 === e.createElement
                    }()
                  } catch (e) {
                    r = !0, a = !0
                  }
                }();
                var f = {
                  elements: l.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
                  shivCSS: !1 !== l.shivCSS,
                  supportsUnknownElements: a,
                  shivMethods: !1 !== l.shivMethods,
                  type: "default",
                  shivDocument: s,
                  createElement: o,
                  createDocumentFragment: function(e, o) {
                    if (e || (e = t), a) return e.createDocumentFragment();
                    for (var s = (o = o || i(e)).frag.cloneNode(), r = 0, l = n(), c = l.length; r < c; r++) s.createElement(l[r]);
                    return s
                  }
                };
                e.html5 = f, s(t)
              }(this, t), d._version = "2.6.2", d._prefixes = y, d._domPrefixes = P, d._cssomPrefixes = w, d.hasEvent = x, d.testProp = function(e) {
                return r([e])
              }, d.testAllProps = l, d.testStyles = S, d.prefixed = function(e, t, n) {
                return t ? l(e, t, n) : l(e, "pfx")
              }, h.className = h.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + " js " + A.join(" "), d
          }(this, this.document),
          function(e, t, n) {
            function i(e) {
              return "[object Function]" == g.call(e)
            }

            function o(e) {
              return "string" == typeof e
            }

            function s() {}

            function r(e) {
              return !e || "loaded" == e || "complete" == e || "uninitialized" == e
            }

            function a() {
              var e = m.shift();
              v = 1, e ? e.t ? f((function() {
                ("c" == e.t ? h.injectCss : h.injectJs)(e.s, 0, e.a, e.x, e.e, 1)
              }), 0) : (e(), a()) : v = 0
            }

            function l(e, n, i, o, s, l, c) {
              function u(t) {
                if (!p && r(d.readyState) && (y.r = p = 1, !v && a(), d.onload = d.onreadystatechange = null, t))
                  for (var i in "img" != e && f((function() {
                      w.removeChild(d)
                    }), 50), I[n]) I[n].hasOwnProperty(i) && I[n][i].onload()
              }
              c = c || h.errorTimeout;
              var d = t.createElement(e),
                p = 0,
                g = 0,
                y = {
                  t: i,
                  s: n,
                  e: s,
                  a: l,
                  x: c
                };
              1 === I[n] && (g = 1, I[n] = []), "object" == e ? d.data = n : (d.src = n, d.type = e), d.width = d.height = "0", d.onerror = d.onload = d.onreadystatechange = function() {
                u.call(this, g)
              }, m.splice(o, 0, y), "img" != e && (g || 2 === I[n] ? (w.insertBefore(d, b ? null : _), f(u, c)) : I[n].push(d))
            }

            function c(e, t, n, i, s) {
              return v = 0, t = t || "j", o(e) ? l("c" == t ? E : P, e, t, this.i++, n, i, s) : (m.splice(this.i++, 0, e), 1 == m.length && a()), this
            }

            function u() {
              var e = h;
              return e.loader = {
                load: c,
                i: 0
              }, e
            }
            var d, h, p = t.documentElement,
              f = e.setTimeout,
              _ = t.getElementsByTagName("script")[0],
              g = {}.toString,
              m = [],
              v = 0,
              y = "MozAppearance" in p.style,
              b = y && !!t.createRange().compareNode,
              w = b ? p : _.parentNode,
              P = (p = e.opera && "[object Opera]" == g.call(e.opera), p = !!t.attachEvent && !p, y ? "object" : p ? "script" : "img"),
              E = p ? "script" : P,
              C = Array.isArray || function(e) {
                return "[object Array]" == g.call(e)
              },
              k = [],
              I = {},
              A = {
                timeout: function(e, t) {
                  return t.length && (e.timeout = t[0]), e
                }
              };
            h = function(e) {
              function t(e, t, n, o, s) {
                var r = function(e) {
                    e = e.split("!");
                    var t, n, i, o = k.length,
                      s = e.pop(),
                      r = e.length;
                    for (s = {
                        url: s,
                        origUrl: s,
                        prefixes: e
                      }, n = 0; n < r; n++) i = e[n].split("="), (t = A[i.shift()]) && (s = t(s, i));
                    for (n = 0; n < o; n++) s = k[n](s);
                    return s
                  }(e),
                  a = r.autoCallback;
                r.url.split(".").pop().split("?").shift(), r.bypass || (t && (t = i(t) ? t : t[e] || t[o] || t[e.split("/").pop().split("?")[0]]), r.instead ? r.instead(e, t, n, o, s) : (I[r.url] ? r.noexec = !0 : I[r.url] = 1, n.load(r.url, r.forceCSS || !r.forceJS && "css" == r.url.split(".").pop().split("?").shift() ? "c" : void 0, r.noexec, r.attrs, r.timeout), (i(t) || i(a)) && n.load((function() {
                  u(), t && t(r.origUrl, s, o), a && a(r.origUrl, s, o), I[r.url] = 2
                }))))
              }

              function n(e, n) {
                function r(e, s) {
                  if (e) {
                    if (o(e)) s || (d = function() {
                      var e = [].slice.call(arguments);
                      h.apply(this, e), p()
                    }), t(e, d, n, 0, c);
                    else if (Object(e) === e)
                      for (l in a = function() {
                          var t, n = 0;
                          for (t in e) e.hasOwnProperty(t) && n++;
                          return n
                        }(), e) e.hasOwnProperty(l) && (!s && !--a && (i(d) ? d = function() {
                        var e = [].slice.call(arguments);
                        h.apply(this, e), p()
                      } : d[l] = function(e) {
                        return function() {
                          var t = [].slice.call(arguments);
                          e && e.apply(this, t), p()
                        }
                      }(h[l])), t(e[l], d, n, l, c))
                  } else !s && p()
                }
                var a, l, c = !!e.test,
                  u = e.load || e.both,
                  d = e.callback || s,
                  h = d,
                  p = e.complete || s;
                r(c ? e.yep : e.nope, !!u), u && r(u)
              }
              var r, a, l = this.yepnope.loader;
              if (o(e)) t(e, 0, l, 0);
              else if (C(e))
                for (r = 0; r < e.length; r++) o(a = e[r]) ? t(a, 0, l, 0) : C(a) ? h(a) : Object(a) === a && n(a, l);
              else Object(e) === e && n(e, l)
            }, h.addPrefix = function(e, t) {
              A[e] = t
            }, h.addFilter = function(e) {
              k.push(e)
            }, h.errorTimeout = 1e4, null == t.readyState && t.addEventListener && (t.readyState = "loading", t.addEventListener("DOMContentLoaded", d = function() {
              t.removeEventListener("DOMContentLoaded", d, 0), t.readyState = "complete"
            }, 0)), e.yepnope = u(), e.yepnope.executeStack = a, e.yepnope.injectJs = function(e, n, i, o, l, c) {
              var u, d, p = t.createElement("script");
              for (d in o = o || h.errorTimeout, p.src = e, i) p.setAttribute(d, i[d]);
              n = c ? a : n || s, p.onreadystatechange = p.onload = function() {
                !u && r(p.readyState) && (u = 1, n(), p.onload = p.onreadystatechange = null)
              }, f((function() {
                u || (u = 1, n(1))
              }), o), l ? p.onload() : _.parentNode.insertBefore(p, _)
            }, e.yepnope.injectCss = function(e, n, i, o, r, l) {
              var c;
              for (c in n = l ? a : n || s, (o = t.createElement("link")).href = e, o.rel = "stylesheet", o.type = "text/css", i) o.setAttribute(c, i[c]);
              r || (_.parentNode.insertBefore(o, _), f(n, 0))
            }
          }(this, document), Modernizr.load = function() {
            yepnope.apply(window, [].slice.call(arguments, 0))
          }, void 0 === (i = function() {}.call(t, n, t, e)) || (e.exports = i)
      }).call(window);
      var o = "vendor/modernizr";
      window.define(o, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof i === t ? typeof e === t ? void 0 : e.exports : i : __webpack_exports__;
        return n && n.default || n
      })), window.require([o])
    },
    306843: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => h
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(259913),
        l = n.n(a),
        c = [{
          string: navigator.platform,
          sub_string: "Win",
          identity: "windows"
        }, {
          string: navigator.platform,
          sub_string: "Mac",
          identity: "mac"
        }, {
          string: navigator.userAgent,
          sub_string: "iPhone",
          identity: "iphone/ipod"
        }, {
          string: navigator.platform,
          sub_string: "Linux",
          identity: "linux"
        }],
        u = function() {
          var e = l()();
          return this.os = this._getOS(), this.browser = this._getBrowser(e.name), this.version = e.versionNumber, this
        };
      r().extend(u.prototype, {
        _getBrowser: function(e) {
          switch (e) {
            case "ios":
              return "safari";
            case "ie":
              return "explorer";
            default:
              return e || ""
          }
        },
        _getOS: function() {
          return function(e) {
            for (var t = 0; t < e.length; t++) {
              var n = e[t].string,
                i = e[t].prop;
              if (n) {
                if (-1 !== n.indexOf(e[t].sub_string)) return e[t].identity
              } else if (i) return e[t].identity
            }
          }(c) || ""
        }
      });
      var d = new u;
      o()((function() {
        o()("html").addClass("".concat(d.browser.toString(), " ").concat(d.os.toString()))
      }));
      const h = d;
      var p = "../build/transpiled/common/browserdetect";
      window.define(p, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([p])
    },
    146911: (e, t, n) => {
      "use strict";
      n.r(t);
      var i = n(661533),
        o = n.n(i),
        s = n(445368),
        r = n(845043);
      o()(document).one("page:construct", (function() {
        APP.constant("user").settings.is_current_account_data_deleted && new r.default({
          text: (0, s.i18n)("Data created during the trial period has been deleted"),
          no_cancel: !0,
          accept: function() {
            o().ajax({
              url: "/ajax/v4/users/me/modal_deleted_data",
              type: "PATCH",
              contentType: "application/json",
              dataType: "json",
              data: JSON.stringify({
                is_show_modal_after_delete_data: !1
              })
            }), this.modal.destroy()
          }
        })
      }));
      var a = "../build/transpiled/common/modal_deleted_data";
      window.define(a, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([a])
    },
    143273: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => g
      });
      var i = n(629133),
        o = n.n(i),
        s = n(345839),
        r = n.n(s),
        a = n(845043),
        l = n(661533),
        c = {
          message: APP.lang.page_leave_has_changes,
          accept_text: "OK",
          decline_text: APP.lang.button_cancel,
          accept: null,
          decline: null
        },
        u = !1,
        d = !1,
        h = {},
        p = {},
        f = l(document),
        _ = {
          getPreventFlag: function() {
            return u
          },
          getTrackChanges: function(e) {
            return o().isUndefined(e) ? _.getChanges() : h[e]
          },
          preventPageChange: function(e, t) {
            var n = !!o().isUndefined(e) || e;
            return t = _.checkCode(t), n ? p[t] && (h[t] = l.extend({}, c, p[t])) : delete h[t], u = o().keys(h).length > 0, this
          },
          registerPreventConfig: function(e, t) {
            p[_.checkCode(t)] = e
          },
          removePreventConfig: function(e) {
            e = _.checkCode(e), p[e] && (_.preventPageChange(!1, e), delete h[e], delete p[e])
          },
          confirmPageChange: function(e, t) {
            var n = o().bind(this.confirmPageChange, this);
            (null == e ? void 0 : e.onlyBeforeUnload) ? t(): (e = o().isString(e) ? p[e] : e, t = o().isFunction(t) ? t : o().noop, f.trigger("menu:icon:restore").trigger("page:change:stop"), APP.router.prevent_page_confirm || (this.declined = !1, APP.router.prevent_page_confirm = !0, new a.default({
              class_name: "modal-list modal-leave-confirm",
              decline_text: e.decline_text,
              accept_text: e.accept_text,
              button_class: e.gray_button ? "" : "button-input_blue",
              text: e.title || e.message || APP.lang.card_page_leave_has_changes,
              message: e.description,
              no_cancel: e.no_cancel,
              init: function() {
                "function" == typeof e.init && e.init((function() {
                  t()
                }))
              },
              accept: function() {
                "function" == typeof e.accept ? e.accept.call(this.modal, (function(e) {
                  t(e)
                })) : t(), this.modal.destroy()
              },
              destroy: function() {
                !1 !== this.accepted || this.declined || (this.declined = !0, "function" == typeof e.decline ? e.decline.call(this.modal, (function(e) {
                  t(e)
                }), this.accepted) : t()), "function" == typeof e.destroy && e.destroy(), o().keys(h).length <= 1 ? APP.router.prevent_page_confirm = !1 : (delete h[o().first(o().keys(h))], n())
              }
            })))
          },
          checkCode: function(e) {
            return e || APP.data.current_entity
          },
          getChanges: function() {
            return o().first(o().values(h)) || {}
          }
        };
      r().History.prototype.navigate = o().wrap(r().History.prototype.navigate, (function(e, t, n) {
        var i = this,
          o = _.getChanges(),
          s = function(o) {
            APP.router.preventPageChange(!1, o), e.call(i, t, n)
          };
        u && n.trigger && !o.onlyBeforeUnload ? APP.router.confirmPageChange(o, s) : s()
      })), l(window).on("page-preventer:disable-unload", (function() {
        d = !0
      })).on("page-preventer:enable-unload", (function() {
        d = !1
      })).on("beforeunload", (function() {
        if (u && !d) return APP.lang.page_leave_has_changes
      }));
      const g = _;
      var m = "../build/transpiled/common/page_preventer";
      window.define(m, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([m])
    },
    176243: (e, t, n) => {
      "use strict";
      n.r(t);
      var i = n(661533),
        o = n.n(i),
        s = n(397738),
        r = n.n(s),
        a = n(998798);
      o()((function() {
        var e = function() {
          var e = o()("#page").width();
          APP.notSmall = (0, a.isImboxSection)() ? e > 1594 : e > 1230, APP.is_widgets_maximized = (0, a.isImboxSection)() ? e > 1864 : e > 1500, o()("html").toggleClass("h-widgets-closed", !1 === APP.notSmall).toggleClass("h-widgets-maximized", APP.is_widgets_maximized), APP.is_widgets_maximized && o()(document).trigger("openWidgetPanel")
        };
        o()(document).on("page:changed", e), e()
      })), r().register("screen and (max-width: ".concat(1230, "px)"), {
        match: function() {
          (0, a.isImboxSection)() || (APP.notSmall = !1, o()("html").addClass("h-widgets-closed"), o()(document).trigger("closeWidgetPanel").trigger("widgets:card-minimized"))
        },
        unmatch: function() {
          (0, a.isImboxSection)() || (APP.notSmall = !0, o()("html").removeClass("h-widgets-closed"), o()(document).trigger("widgets:card-maximized"))
        }
      }), r().register("screen and (min-width: ".concat(1500, "px)"), {
        match: function() {
          (0, a.isImboxSection)() || (APP.is_widgets_maximized = !0, o()("html").addClass("h-widgets-maximized"), o()(document).trigger("openWidgetPanel"))
        },
        unmatch: function() {
          (0, a.isImboxSection)() || (APP.is_widgets_maximized = !1, o()("html").removeClass("h-widgets-maximized"))
        }
      }), r().register("screen and (max-width: ".concat(1594, "px)"), {
        match: function() {
          (0, a.isImboxSection)() && (APP.notSmall = !1, o()("html").addClass("h-widgets-closed"), o()(document).trigger("closeWidgetPanel").trigger("widgets:card-minimized"))
        },
        unmatch: function() {
          (0, a.isImboxSection)() && (APP.notSmall = !0, o()("html").removeClass("h-widgets-closed"), o()(document).trigger("widgets:card-maximized"))
        }
      }), r().register("screen and (min-width: ".concat(1864, "px)"), {
        match: function() {
          (0, a.isImboxSection)() && (APP.is_widgets_maximized = !0, o()("html").addClass("h-widgets-maximized"), o()(document).trigger("openWidgetPanel"))
        },
        unmatch: function() {
          (0, a.isImboxSection)() && (o()("html").removeClass("h-widgets-maximized"), APP.is_widgets_maximized = !1)
        }
      }), r().register("screen and (max-device-width: 640px)", {
        match: function() {
          APP.is_phone = !0, window.location.pathname.includes("/mobile/") || o()('meta[name="viewport"]').attr("content", "")
        }
      });
      var l = "../build/transpiled/common/windowWidthController";
      window.define(l, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([l])
    },
    845043: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => d
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(460159),
        l = n.n(a),
        c = n(304483),
        u = function(e) {
          var t = this;
          this.options = r().extend({}, e), this.modal = new c.default({
            can_centrify: !0,
            class_name: "".concat(r().isUndefined(this.options.class_name) ? "modal-list" : this.options.class_name, " js-modal-confirm"),
            disable_overlay_click: this.options.disable_overlay_click,
            init: l()._preload([t.options.template || "/tmpl/common/modal/confirm.twig"], (function(e) {
              t.$modal_body = e, e.trigger("modal:loaded").html(l()({
                ref: t.options.template || "/tmpl/common/modal/confirm.twig"
              }).render(o().extend({
                decline_text: t.options.decline_text,
                accept_text: t.options.accept_text,
                button_class: t.options.button_class,
                no_cancel: t.options.no_cancel
              }, t.options, r().result(t.options, "getRenderParams", {})))).trigger("modal:centrify"), r().isFunction(t.options.init) && t.options.init.call(t), e.on("click", (function(e) {
                o()(e.target).is(".button-input") || e.stopPropagation()
              })).on("click", ".button-cancel", (function(e) {
                e.stopPropagation(), t.accepted = !1, t.destroy()
              })).on("click", ".modal-body__close", (function(e) {
                e.stopPropagation(), t.destroy()
              })).on("click", ".js-modal-accept", (function(e) {
                t.accepted = !0, "function" == typeof t.options.accept ? (t.options.accept.call(t), t.options.close_on_accept && t.destroy()) : t.destroy(), e.stopPropagation()
              }))
            })),
            destroy: function() {
              return !(t.xhr && 4 !== t.xhr.readyState || (t.modal.$modal.find(".modal-body").off(), "function" == typeof t.options.destroy && t.options.destroy.call(t), 0))
            },
            onBeforeInit: t.options.onBeforeInit,
            tryAgain: t.options.tryAgain
          }), this.modal.$el.on("click", ".modal-scroller", r().bind((function(e) {
            e.stopPropagation()
          })))
        };
      u.prototype.requestStart = function() {
        return this.modal ? this.modal.requestStart() : this.$modal_body.hide(), this
      }, u.prototype.requestSuccess = function(e, t) {
        this.$modal_body.show(), this.modal.showSuccess(e, t)
      }, u.prototype.requestFail = function(e, t) {
        this.$modal_body.show(), this.modal.showError(e, t)
      }, u.prototype.destroy = function() {
        this._destroyed || this.modal.destroy(), this._destroyed = !0
      };
      const d = u;
      var h = "../build/transpiled/components/base/confirm";
      window.define(h, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([h])
    },
    604206: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => v
      });
      var i, o, s = n(661533),
        r = n.n(s),
        a = n(629133),
        l = n.n(a),
        c = n(987081),
        u = n(128508),
        d = n(334254),
        h = n.n(d),
        p = n(797078),
        f = n(955026),
        _ = n(214558),
        g = new c.Subscription,
        m = {
          init: function() {
            "visible" === h().state() && p.default.send([{
              method: "activity"
            }]), p.default.send([{
              method: "get_online"
            }]), g.add(this.initStream().subscribe(l().bind(this.initStatus, this)))
          },
          initStream: function() {
            return p.default.subscribe("get_online").pipe(u.filter((function(e) {
              return "get_online" === e.method && (0, f.hasKeys)(e, ["body"])
            })), u.map((function(e) {
              return e.body.users
            })), u.share())
          },
          initStatus: function(e) {
            (0, _.updateOnline)(e, !0)
          },
          refresh: function() {
            g.add(this.refreshStream().subscribe(l().bind(this.refreshStateUser, this)))
          },
          refreshSend: function() {
            return setInterval((function() {
              p.default.send([{
                method: "activity"
              }])
            }), 5e3)
          },
          refreshStream: function() {
            return p.default.subscribe("activity").pipe(u.filter((function(e) {
              return "activity" === e.method && (0, f.hasKeys)(e, ["body"])
            })), u.map((function(e) {
              return {
                user_id: e.body.user_id,
                event: "user_online" === e.body.event
              }
            })), u.share())
          },
          refreshStateUser: function(e) {
            (0, _.updateOnline)([e.user_id], e.event)
          }
        };
      p.default.subscribe("activity").pipe(u.filter((function(e) {
        return "activity" === (l().propertyOf(e)(["body", "channel"]) || "").replace(/[^A-Za-zА]/g, "")
      }))).subscribe((function() {
        var e = !0,
          t = h().state();
        clearInterval(i), h().unbind(o), m.init(), m.refresh(), "visible" === t && !0 === e && (i = m.refreshSend()), o = h().change((function() {
          h().hidden() ? clearInterval(i) : !0 === e && (clearInterval(i), i = m.refreshSend())
        })), r()(window).on("online", (function() {
          clearInterval(i), e = !0
        })), r()(window).on("offline", (function() {
          clearInterval(i), e = !1
        }))
      }));
      const v = m;
      var y = "../build/transpiled/components/base/inbox/chats/status_chat";
      window.define(y, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([y])
    },
    316222: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        ACCESS_TOKEN_EXPIRATION_TIMESTAMP_KEY: () => a,
        AUTH_TOKENS_UPDATING_ACTIVITY_ID: () => l,
        AUTH_TOKENS_UPDATING_ACTIVITY_ID_TIMEOUT: () => r,
        IS_AUTH_LOST: () => c,
        IS_AUTH_RESTORED: () => u,
        SHOULD_STOP_REQUESTS: () => d,
        UPDATE_AUTH_TOKENS_TIMER_MAX_JITTER: () => s,
        UPDATE_AUTH_TOKENS_TIMER_SAVE_OFFSET: () => o
      });
      var i = n(909599),
        o = 15 * i.MINUTE,
        s = 10 * i.MINUTE,
        r = 50,
        a = "access_token_expires_at",
        l = "auth_tokens_updating_activity_id",
        c = "is_auth_lost",
        u = "is_auth_restored",
        d = "should_stop_requests"
    },
    429913: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        IS_NEW_AUTH_ENABLED: () => x,
        checkTimerTokens: () => j,
        getAccessTokenExpirationTimestamp: () => L,
        initCoreAuthManager: () => G,
        isRequestAllowedToBeSent: () => q,
        restoreAuth: () => B,
        setCookie: () => O,
        updateAuthTokens: () => H
      });
      var i = n(629133),
        o = n.n(i),
        s = n(334254),
        r = n.n(s),
        a = n(130860),
        l = n.n(a),
        c = n(694615),
        u = n(367180),
        d = n(643095),
        h = n(744741),
        p = n(509372),
        f = n(778618),
        _ = n(695195),
        g = n(403889),
        m = n(601236),
        v = n(909599),
        y = n(316222),
        b = n(661533);

      function w(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function P(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              w(s, i, o, r, a, "next", e)
            }

            function a(e) {
              w(s, i, o, r, a, "throw", e)
            }
            r(void 0)
          }))
        }
      }

      function E(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function C(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            i = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), i.forEach((function(t) {
            E(e, t, n[t])
          }))
        }
        return e
      }

      function k(e, t) {
        var n, i, o, s, r = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return s = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this
        }), s;

        function a(s) {
          return function(a) {
            return function(s) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; r;) try {
                if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                  case 0:
                  case 1:
                    o = s;
                    break;
                  case 4:
                    return r.label++, {
                      value: s[1],
                      done: !1
                    };
                  case 5:
                    r.label++, i = s[1], s = [0];
                    continue;
                  case 7:
                    s = r.ops.pop(), r.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                      r = 0;
                      continue
                    }
                    if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                      r.label = s[1];
                      break
                    }
                    if (6 === s[0] && r.label < o[1]) {
                      r.label = o[1], o = s;
                      break
                    }
                    if (o && r.label < o[2]) {
                      r.label = o[2], r.ops.push(s);
                      break
                    }
                    o[2] && r.ops.pop(), r.trys.pop();
                    continue
                }
                s = t.call(e, r)
              } catch (e) {
                s = [6, e], i = 0
              } finally {
                n = o = 0
              }
              if (5 & s[0]) throw s[1];
              return {
                value: s[0] ? s[1] : void 0,
                done: !0
              }
            }([s, a])
          }
        }
      }
      var I, A = function(e) {
          return e
        },
        T = [],
        S = {
          path: "/",
          session: !0,
          domain: ".".concat((0, g.getDomain)())
        },
        x = !1,
        D = null,
        O = function(e, t) {
          (0, p.set)(C({
            name: e,
            value: t
          }, S))
        },
        M = function(e) {
          (0, p.remove)(C({
            name: e
          }, S))
        },
        N = function() {
          T.forEach((function(e) {
            e()
          })), T = []
        },
        R = function() {
          return Boolean((0, p.get)(y.IS_AUTH_LOST) || APP.auth_modal)
        },
        L = function() {
          return (0, p.get)(y.ACCESS_TOKEN_EXPIRATION_TIMESTAMP_KEY)
        },
        j = function() {
          var e = (0, v.getServerTime)(),
            t = L();
          e && t || function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            (0, d.captureException)(new Error("AuthManagerError: required cookies are missing."), e)
          }({
            serverTime: e,
            accessTokenExpirationTimestamp: t
          })
        },
        z = o().throttle((function(e) {
          A(["[runUpdateActivity]: ", e])
        }), 2e3),
        F = function() {
          A(["[isUpdatingTabActive]: check is tab updating tokens"]);
          var e = 0;
          return new Promise((function(t, n) {
            var i = function(o) {
              (0, f.setWorkerTimeout)((function() {
                if (null === o && t(void 0), A(["[isUpdatingTabActive]: activityId: ", (0, p.get)(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID), "tab lifetime:", performance.now().toFixed(0), "lostAttempts: ", e]), o === (0, p.get)(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID) && ++e > 3) return M(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID), n();
                i((0, p.get)(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID))
              }), 2 * y.AUTH_TOKENS_UPDATING_ACTIVITY_ID_TIMEOUT)
            };
            i((0, p.get)(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID))
          }))
        },
        B = function() {
          A(["[restoreAuth] remove all cookies: ", y.IS_AUTH_LOST, y.IS_AUTH_RESTORED, y.AUTH_TOKENS_UPDATING_ACTIVITY_ID, y.SHOULD_STOP_REQUESTS]), M(y.IS_AUTH_LOST), O(y.IS_AUTH_RESTORED, "y"), (0, f.setWorkerTimeout)((function() {
            M(y.IS_AUTH_RESTORED)
          }), 2 * p.COOKIE_LISTENER_INTERVAL_DELAY), M(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID), M(y.SHOULD_STOP_REQUESTS)
        },
        $ = function() {
          return A(["[showAuthModal] start modal initialize"]), D && (0, f.clearWorkerTimeout)(D), new Promise((function(e) {
            APP.auth_modal ? APP.auth_modal.subscribeOnSuccess((function() {
              e(void 0)
            })) : (new u.default({
              success: function() {
                A(["[showAuthModal][success] auth restore"]), B(), j(), e(void 0)
              }
            }), A(["[showAuthModal] modal showed"]))
          }))
        },
        H = (I = P((function(e) {
          var t, n, i;
          return k(this, (function(s) {
            switch (s.label) {
              case 0:
                if (!x) return [2];
                if (t = e.shouldStopRequests, A(["[updateAuthTokens] start token updating, shouldStopRequests: ", t]), t && O(y.SHOULD_STOP_REQUESTS, "y"), !(0, p.get)(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID)) return [3, 5];
                A(["[updateAuthTokens] tokens already updating (AUTH_TOKENS_UPDATING_ACTIVITY_ID), try isUpdatingTabActive"]), s.label = 1;
              case 1:
                return s.trys.push([1, 3, , 4]), [4, F()];
              case 2:
                return s.sent(), A(["[updateAuthTokens] tokens AUTH_TOKENS_UPDATING_ACTIVITY_ID removed on another tab"]), [3, 4];
              case 3:
                return s.sent(), A(["[updateAuthTokens] tokens updating stucked, try updateAuthTokens again"]), H({
                  shouldStopRequests: t
                }), [3, 4];
              case 4:
                return [2];
              case 5:
                n = o().noop, A(["[updateAuthTokens] start update activity"]), s.label = 6;
              case 6:
                if (s.trys.push([6, 8, 11, 12]), r = 0, (a = function() {
                    var e = l()();
                    z(e), A(["[runUpdateActivity] generate new activityId: ", e, "tab lifetime:", performance.now().toFixed(0)]), O(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID, e), r = setTimeout(a, y.AUTH_TOKENS_UPDATING_ACTIVITY_ID_TIMEOUT)
                  })(), n = function() {
                    clearTimeout(r)
                  }, R()) throw new Error("Auth already lost, we should not try update tokens");
                return [4, (0, _.promiseWithExponentialRetry)(c.updateAuthTokens, {
                  isRetryable: function(e) {
                    var t = e.status;
                    return t >= h.HttpStatusCode.INTERNAL_SERVER_ERROR && t <= h.HttpStatusCode.NETWORK_CONNECT_TIMEOUT_ERROR
                  }
                })];
              case 7:
                return i = s.sent().serverTime, O(v.SERVER_TIME_COOKIE_KEY, i), A(["[updateAuthTokens] tokens updated successfully"]), [3, 12];
              case 8:
                return s.sent().status !== h.HttpStatusCode.UNAUTHORIZED ? [3, 10] : (A(["[updateAuthTokens] tokens updated with error, show authModal"]), O(y.IS_AUTH_LOST, "y"), [4, $()]);
              case 9:
                s.sent(), s.label = 10;
              case 10:
                return [3, 12];
              case 11:
                return A(["[updateAuthTokens] stop update activity"]), M(y.AUTH_TOKENS_UPDATING_ACTIVITY_ID), M(y.SHOULD_STOP_REQUESTS), n(), [7];
              case 12:
                return [2]
            }
            var r, a
          }))
        })), function(e) {
          return I.apply(this, arguments)
        }),
        W = performance.now(),
        U = (0, m.getRandom)({
          max: y.UPDATE_AUTH_TOKENS_TIMER_MAX_JITTER
        }),
        V = function() {
          var e = Number(L()),
            t = Number((0, v.getServerTime)());
          if (!e || !t) return A(["[getTokenLifetime]: exp. at: ", e, "[getTokenLifetime]: server_time: ", t]), 0;
          var n = performance.now() - W,
            i = (e - t) * v.SECOND - y.UPDATE_AUTH_TOKENS_TIMER_SAVE_OFFSET - n;
          return i > 0 ? i + U : 0
        },
        K = function() {
          var e;
          x && (A(["remaining update tokens timer time: \n".toLocaleUpperCase(), "".concat((V() / 1e3 / 60).toFixed(2), " minutes \n"), "".concat((V() / 1e3).toFixed(2), " seconds \n"), "jitter: \n".toLocaleUpperCase(), "".concat((U / 1e3 / 60).toFixed(2), " minutes \n"), "".concat((U / 1e3).toFixed(2), " seconds")]), A(["[verifyAuthFallback] checking token lifetime: ", V()]), V() ? null === (e = APP.auth_modal) || void 0 === e || e.destroy() : H({
            shouldStopRequests: R()
          }))
        },
        q = function() {
          if (!x) return !0;
          if (e = !(0, p.get)(y.SHOULD_STOP_REQUESTS) && !R(), A(["[_isRequestAllowedToBeSent]: ", e]), e) return K(), !1;
          var e;
          (0, p.get)(y.IS_AUTH_LOST) && !APP.auth_modal && $();
          var t = b.Deferred();
          return T.push(t.resolve), t.promise()
        },
        Y = function() {
          var e, t = V();
          A(["set tokens timer time: \n".toLocaleUpperCase(), "".concat((t / 1e3 / 60).toFixed(2), " minutes \n"), "".concat((t / 1e3).toFixed(2), " seconds")]), A(["[runTimer] should set new timer, token lifetime: ", t]), D && (0, f.clearWorkerTimeout)(D), t && (null === (e = APP.auth_modal) || void 0 === e || e.destroy()), D = (0, f.setWorkerTimeout)((function() {
            H({
              shouldStopRequests: !1
            })
          }), t || 2 * v.MINUTE)
        },
        G = function() {
          var e = P((function(e) {
            var t, n;
            return k(this, (function(i) {
              switch (i.label) {
                case 0:
                  if (!x) return [2];
                  t = e.onLogsCollect, n = void 0 === t ? o().noop : t, A = n, r().change((function() {
                    r().hidden() || R() || (A(["[listener] visibility, should run verify fallback"]), K())
                  })), (0, p.listenCookie)({
                    name: v.SERVER_TIME_COOKIE_KEY,
                    listener: function(e) {
                      if (e.newValue) return A(["[listener] server_time, should set new timer"]), W = performance.now(), Y()
                    }
                  }), (0, p.listenCookie)({
                    name: y.IS_AUTH_RESTORED,
                    listener: function(e) {
                      var t;
                      "y" === e.newValue && L() && (M(y.IS_AUTH_RESTORED), A(["[listener] auth_restored, should destroy auth modal"]), N(), null === (t = APP.auth_modal) || void 0 === t || t.destroy())
                    }
                  }), (0, p.listenCookie)({
                    name: y.IS_AUTH_LOST,
                    listener: function(e) {
                      "y" !== e.newValue || APP.auth_modal || (A(["[listener] auth_lost, should show auth modal"]), $())
                    }
                  }), (0, p.listenCookie)({
                    name: y.SHOULD_STOP_REQUESTS,
                    listener: function(e) {
                      var t;
                      null === e.newValue && L() && (A(["[listener] SHOULD_STOP_REQUESTS: run callbacks", T]), N(), null === (t = APP.auth_modal) || void 0 === t || t.destroy())
                    }
                  }), i.label = 1;
                case 1:
                  return i.trys.push([1, 3, , 4]), [4, F()];
                case 2:
                  return i.sent(), Y(), [3, 4];
                case 3:
                  return i.sent(), R() || H({
                    shouldStopRequests: !1
                  }), [3, 4];
                case 4:
                  return [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    104691: (e, t, n) => {
      "use strict";
      n.r(t)
    },
    715394: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        IS_NEW_AUTH_ENABLED: () => i.IS_NEW_AUTH_ENABLED,
        UpdateAuthTokensResponse: () => o.UpdateAuthTokensResponse,
        getAccessTokenExpirationTimestamp: () => i.getAccessTokenExpirationTimestamp,
        initCoreAuthManager: () => i.initCoreAuthManager,
        isRequestAllowedToBeSent: () => i.isRequestAllowedToBeSent,
        restoreAuth: () => i.restoreAuth,
        updateAuthTokens: () => i.updateAuthTokens
      });
      var i = n(429913),
        o = n(104691)
    },
    792707: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        sentryLogAuth: () => b
      });
      var i = n(629133),
        o = n.n(i),
        s = n(334254),
        r = n.n(s),
        a = n(130860),
        l = n.n(a),
        c = n(955026),
        u = n(306843),
        d = n(909599),
        h = n(226218);

      function p() {
        var e, t, n = (e = ["Date: ", " Referrer: ", " Info: ", ""], t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
          raw: {
            value: Object.freeze(t)
          }
        })));
        return p = function() {
          return n
        }, n
      }
      var f = Number((0, d.getServerTime)()) * d.SECOND,
        _ = [],
        g = [],
        m = function() {
          var e, t = performance.now();
          return e = f ? new Date(f + t) : null, {
            lifetime: "".concat((t / d.SECOND).toFixed(1), "s"),
            lastVisibilityChangeAt: e,
            serverTime: (0, d.getServerTime)(),
            isVisible: (0, h.isTabVisible)()
          }
        };
      _.push(m()), r().change((function() {
        _.push(m())
      }));
      var v = {
          meta: {
            account_id: APP.constant("account").id,
            user_id: APP.constant("user").id,
            top_level_domain: APP.constant("account").top_level_domain,
            account_language: APP.constant("account").language,
            country: APP.constant("geoip_country") || "",
            user_language: APP.lang_id,
            browser: {
              name: u.default.browser,
              version: String(u.default.version),
              tab: {
                id: l().v4(),
                lastTimeReload: f ? new Date(f) : null
              }
            },
            os: u.default.os
          }
        },
        y = function() {
          var e = JSON.parse(JSON.stringify(v)),
            t = e.meta.browser,
            n = m(),
            i = n.lifetime,
            s = n.serverTime,
            r = n.isVisible;
          return t.tab = o().extend({}, t.tab, {
            lifetime: i,
            isVisible: r,
            serverTime: s,
            activity: _,
            time: new Date
          }), e
        };

      function b(e) {
        if ((0, c.isDev)()) console.error("Error log", e);
        else {
          var t, n = window.Sentry;
          if (n && navigator.onLine) {
            g.length && (t = JSON.parse(JSON.stringify(g)), g = [], o().each(t, (function(e) {
              b(e)
            })));
            var i = y(),
              s = o().extend({}, e, i),
              r = n.logger,
              a = btoa(unescape(encodeURIComponent(JSON.stringify(s))));
            r.error(r.fmt(p(), e.logDate, window.location.href, a))
          } else g.push(e)
        }
      }
    },
    255328: (e, t, n) => {
      "use strict";
      n.r(t);
      var i = n(629133),
        o = n.n(i),
        s = n(661533),
        r = n.n(s),
        a = n(700897),
        l = n(744741),
        c = n(694615),
        u = n(805163),
        d = n(335745),
        h = n(695195),
        p = n(539213),
        f = n(909599),
        _ = n(130303),
        g = n(715394),
        m = n(792707);

      function v(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function y(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function b(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              y(s, i, o, r, a, "next", e)
            }

            function a(e) {
              y(s, i, o, r, a, "throw", e)
            }
            r(void 0)
          }))
        }
      }
      var w = void 0,
        P = [],
        E = function() {
          var e, t, n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
          P.push(n), (0, _.isDebugModeEnabled)() && (e = console).warn.apply(e, function(e) {
            if (Array.isArray(e)) return v(e)
          }(t = n) || function(e) {
            if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
          }(t) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return v(e, t);
              var n = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? v(e, t) : void 0
            }
          }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }())
        };
      (0, g.initCoreAuthManager)({
        onLogsCollect: E
      });
      var C = r().ajax,
        k = new p.RequestsBufferManager,
        I = APP.constant("user").sso_auth,
        A = null,
        T = function() {
          return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "") !== c.ACCESS_TOKEN_URL && (0, g.isRequestAllowedToBeSent)()
        };
      r().ajax = function() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
        var i = t[0] || {},
          s = i.url,
          r = i.success,
          l = void 0 === r ? o().noop : r,
          c = i.error,
          u = void 0 === c ? o().noop : c,
          d = i.complete,
          p = void 0 === d ? o().noop : d;
        return (0, h.awaitedPromiseCall)({
          promise: function() {
            return o().isObject(t[0]) && a.INTERNAL_URL_REGEX.test(s) ? (t[0] = o().omit(t[0], "success", "error", "complete"), C.apply(w, t).done(l).fail(u).always(p)) : C.apply(w, t)
          },
          condition: T(s)
        })
      }, r().ajaxPromisify = function() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
        return new Promise((function(e, n) {
          var i;
          (0, h.awaitedPromiseCall)({
            condition: T(null === (i = t[0]) || void 0 === i ? void 0 : i.url),
            promise: function() {
              return C.apply(w, t).then(e, n)
            }
          })
        }))
      }, r().ajaxPrefilter((function(e, t, n) {
        var i = e.url,
          o = void 0 === i ? "" : i,
          s = e.headers;
        if ((0, p.isRequestUsingCoreAuth)({
            headers: s,
            url: o
          })) {
          var h = r().Deferred(),
            _ = (0, g.getAccessTokenExpirationTimestamp)();
          return n.fail(b((function() {
            var t, i, s, r, p, v, y = arguments;
            return function(e, t) {
              var n, i, o, s, r = {
                label: 0,
                sent: function() {
                  if (1 & o[0]) throw o[1];
                  return o[1]
                },
                trys: [],
                ops: []
              };
              return s = {
                next: a(0),
                throw: a(1),
                return: a(2)
              }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
                return this
              }), s;

              function a(s) {
                return function(a) {
                  return function(s) {
                    if (n) throw new TypeError("Generator is already executing.");
                    for (; r;) try {
                      if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                      switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return r.label++, {
                            value: s[1],
                            done: !1
                          };
                        case 5:
                          r.label++, i = s[1], s = [0];
                          continue;
                        case 7:
                          s = r.ops.pop(), r.trys.pop();
                          continue;
                        default:
                          if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                            r = 0;
                            continue
                          }
                          if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                            r.label = s[1];
                            break
                          }
                          if (6 === s[0] && r.label < o[1]) {
                            r.label = o[1], o = s;
                            break
                          }
                          if (o && r.label < o[2]) {
                            r.label = o[2], r.ops.push(s);
                            break
                          }
                          o[2] && r.ops.pop(), r.trys.pop();
                          continue
                      }
                      s = t.call(e, r)
                    } catch (e) {
                      s = [6, e], i = 0
                    } finally {
                      n = o = 0
                    }
                    if (5 & s[0]) throw s[1];
                    return {
                      value: s[0] ? s[1] : void 0,
                      done: !0
                    }
                  }([s, a])
                }
              }
            }(this, (function(b) {
              switch (b.label) {
                case 0:
                  for (t = y.length, i = new Array(t), s = 0; s < t; s++) i[s] = y[s];
                  switch (r = n.responseJSON, n.status) {
                    case l.HttpStatusCode.BAD_REQUEST:
                    case l.HttpStatusCode.PAYMENT_REQUIRED:
                      return [3, 1];
                    case l.HttpStatusCode.UNAUTHORIZED:
                      return [3, 2]
                  }
                  return [3, 9];
                case 1:
                  return a.INTERNAL_URL_REGEX.test(o) && (null == r || null === (p = r.response) || void 0 === p ? void 0 : p.redirect) && APP.router.navigate(r.response.redirect, {
                    trigger: !0,
                    replace: !0
                  }), h.rejectWith(n, i), [3, 10];
                case 2:
                  return o === c.ACCESS_TOKEN_URL ? (E(["[intrcptr HttpStatusCode.UNAUTHORIZED] UPDATE_AUTH_TOKENS_URL fail, show modal"]), v = {
                    content: {
                      code: n.status,
                      response: n.responseJSON || "No response data",
                      serverTime: (0, f.getServerTime)() || null,
                      accessTokenExpiresAt: (0, g.getAccessTokenExpirationTimestamp)() || null,
                      logs: P
                    },
                    tags: ["auth-tokens-update"],
                    logDate: (new Date).toISOString()
                  }, (0, d.logError)([v]), (0, m.sentryLogAuth)(v), P = [], h.rejectWith(n, i), [2]) : ((I || g.IS_NEW_AUTH_ENABLED) && k.add(e, h), I ? (A || (A = new u.default), A.is_refresh_token_window_due_to_401_opened ? [3, 4] : [4, A.setExpireTokenOverlay(!0)]) : [3, 5]);
                case 3:
                  b.sent(), k.fire(), b.label = 4;
                case 4:
                  return [3, 8];
                case 5:
                  return g.IS_NEW_AUTH_ENABLED && _ && _ !== (0, g.getAccessTokenExpirationTimestamp)() ? (E(["[intrcptr HttpStatusCode.UNAUTHORIZED] expires at updated, should fire requests buffer: ", _, (0, g.getAccessTokenExpirationTimestamp)()]), k.fire(), [3, 8]) : [3, 6];
                case 6:
                  return g.IS_NEW_AUTH_ENABLED ? (E(["[intrcptr HttpStatusCode.UNAUTHORIZED] should update tokens: ", _, (0, g.getAccessTokenExpirationTimestamp)()]), [4, (0, g.updateAuthTokens)({
                    shouldStopRequests: !0
                  })]) : [3, 8];
                case 7:
                  b.sent(), E(["[intrcptr HttpStatusCode.UNAUTHORIZED] firebuffer after success modal: ", _, (0, g.getAccessTokenExpirationTimestamp)()]), k.fire(), b.label = 8;
                case 8:
                  return [3, 10];
                case 9:
                  h.rejectWith(n, i), b.label = 10;
                case 10:
                  return [2]
              }
            }))
          }))), n.done(h.resolve), h.promise(n)
        }
      }));
      var S = "../build/transpiled/core/auth/interceptor";
      window.define(S, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([S])
    },
    367180: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => r
      });
      var i = n(661533),
        o = n.n(i),
        s = n(313981);
      const r = s.default.extend({
        subscribeOnSuccess: function(e) {
          this.successCallbacks || (this.successCallbacks = []), this.successCallbacks.push(e)
        },
        initialize: function(e) {
          s.default.prototype.initialize.apply(this, arguments), this.options = e, this._$body.css("overflow", "hidden").prepend(['<div id="session_end_modal" class="session_end_modal" style="position:fixed; top:0; height:100%; width:100%; z-index:var(--session-end-modal-z-index); left:0">', '<iframe name="session_end_frame" style="width:100%; height:100%; position:fixed; z-index:9999999;" src="/private/account/restore_session.php"></iframe>', "</div>"].join("")), this.setElement(o()("#session_end_modal")), APP.auth_modal = this
        },
        destroy: function() {
          var e;
          this._$body.css("overflow", ""), s.default.prototype.destroy.call(this, !0), delete APP.auth_modal, this.options.success(), null === (e = this.successCallbacks) || void 0 === e || e.forEach((function(e) {
            return e()
          }))
        }
      });
      var a = "../build/transpiled/core/auth/modal";
      window.define(a, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([a])
    },
    805163: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => p
      });
      var i = n(334254),
        o = n.n(i),
        s = n(661533),
        r = n.n(s),
        a = n(629133),
        l = n.n(a),
        c = n(560399);

      function u(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function d(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var h = 3e5,
        p = function() {
          function e() {
            ! function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), d(this, "$body", void 0), d(this, "$sso_auth_overlay", void 0), d(this, "is_refresh_overlay_timer_clicked", void 0), d(this, "is_refresh_token_window_due_to_401_opened", void 0), d(this, "sso_auth_token_expiration", void 0), d(this, "refresh_auth_timer", void 0), d(this, "click_element", void 0), d(this, "onHandleReauth", void 0), d(this, "unsubscribeFromSsoRefreshTokenMessage", void 0), this.$body = r()("body"), this.$sso_auth_overlay = r()('<div style="position: absolute; width: 100%; height: 100%; padding-left: 65px; margin-left: -65px; z-index: 10000;"></div>'), this.is_refresh_overlay_timer_clicked = !Number(APP.constant("sso_auth_token_expiration")), this.is_refresh_token_window_due_to_401_opened = !1;
            var t = 1e3 * Number(APP.constant("sso_auth_token_expiration"));
            try {
              localStorage.setItem("sso_auth_token_expiration", String(t)), this.sso_auth_token_expiration = t
            } catch (e) {
              this.sso_auth_token_expiration = t
            }
            this.handlePostMessage = l().bind(this.handlePostMessage, this), window.addEventListener("message", this.handlePostMessage), this.setExpireTokenOverlay = l().bind(this.setExpireTokenOverlay, this), this.updateTimestampLS = l().bind(this.updateTimestampLS, this), window.addEventListener("storage", this.updateTimestampLS), this.initVisibility(t)
          }
          var t, n;
          return t = e, n = [{
            key: "initVisibility",
            value: function(e) {
              var t = this;
              o().hidden() || this.updateRefreshAuthTimer(e), o().change((function() {
                if (o().hidden()) clearTimeout(t.refresh_auth_timer), t.$sso_auth_overlay.remove();
                else if (!t.is_refresh_overlay_timer_clicked) try {
                  t.updateRefreshAuthTimer(Number(localStorage.getItem("sso_auth_token_expiration")))
                } catch (e) {
                  t.updateRefreshAuthTimer(t.sso_auth_token_expiration)
                }
              }))
            }
          }, {
            key: "updateTimestampLS",
            value: function(e) {
              "sso_auth_token_expiration" === e.key && (this.is_refresh_overlay_timer_clicked = !1, this.is_refresh_token_window_due_to_401_opened = !1, o().hidden() || (clearTimeout(this.refresh_auth_timer), this.$sso_auth_overlay.remove(), this.updateRefreshAuthTimer(Number(e.newValue))))
            }
          }, {
            key: "refreshSsoTokenByMessage",
            value: function(e) {
              var t = e.data;
              try {
                var n = JSON.parse(t);
                if ("SSOTokenTimestamp" !== n.message_type) return;
                if (l().isFunction(this.unsubscribeFromSsoRefreshTokenMessage) && this.unsubscribeFromSsoRefreshTokenMessage(), n.success) {
                  var i, s = 1e3 * Number(n.expires_in) + Date.now();
                  this.is_refresh_token_window_due_to_401_opened && (null === (i = this.onHandleReauth) || void 0 === i || i.resolve()), this.clickOnNode(this.click_element), this.click_element = null;
                  try {
                    localStorage.setItem("sso_auth_token_expiration", String(s)), this.sso_auth_token_expiration = s
                  } catch (e) {
                    this.sso_auth_token_expiration = s
                  }
                  this.is_refresh_overlay_timer_clicked = !1, this.is_refresh_token_window_due_to_401_opened = !1, o().hidden() || this.updateRefreshAuthTimer(s)
                } else if (this.is_refresh_token_window_due_to_401_opened) {
                  var r;
                  null === (r = this.onHandleReauth) || void 0 === r || r.reject()
                }
              } catch (e) {}
            }
          }, {
            key: "handlePostMessage",
            value: function(e) {
              window.location.origin === e.origin && this.refreshSsoTokenByMessage({
                data: e.data
              })
            }
          }, {
            key: "subscribeToSsoRefreshTokenMessage",
            value: function() {
              var e = this;
              window.addEventListener("message", this.handlePostMessage);
              var t = (0, c.subscribeToTabsBroadcast)("ssoMessage", (function(t) {
                e.refreshSsoTokenByMessage({
                  data: t
                })
              }));
              return function() {
                t(), window.removeEventListener("message", e.handlePostMessage)
              }
            }
          }, {
            key: "updateRefreshAuthTimer",
            value: function(e) {
              var t = this;
              e - Date.now() > h ? this.refresh_auth_timer = setTimeout((function() {
                t.setExpireTokenOverlay()
              }), e - Date.now() - h) : this.setExpireTokenOverlay()
            }
          }, {
            key: "clickOnNode",
            value: function(e) {
              e.click ? e.click() : this.clickOnNode(e.parentNode)
            }
          }, {
            key: "setExpireTokenOverlay",
            value: function() {
              var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
              return this.$body.append(this.$sso_auth_overlay), this.$sso_auth_overlay.on("click", l().bind(this.handleOverlayClick, this)), e ? (this.is_refresh_overlay_timer_clicked = !0, this.onHandleReauth = r().Deferred(), this.onHandleReauth.promise()) : r().Deferred().resolve()
            }
          }, {
            key: "handleOverlayClick",
            value: function(e) {
              var t = e.clientX,
                n = e.clientY;
              this.$sso_auth_overlay.remove(), this.is_refresh_overlay_timer_clicked ? this.is_refresh_token_window_due_to_401_opened = !0 : this.is_refresh_overlay_timer_clicked = !0, window.open("/oauth2/sso/saml/reauth/" + APP.constant("user").id) && (this.click_element = document.elementFromPoint(t, n)), this.unsubscribeFromSsoRefreshTokenMessage = this.subscribeToSsoRefreshTokenMessage()
            }
          }], n && u(t.prototype, n), e
        }(),
        f = "../build/transpiled/core/auth/sso_auth";
      window.define(f, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([f])
    },
    545098: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => S
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(345839),
        l = n.n(a),
        c = n(162262),
        u = n.n(c),
        d = n(993595),
        h = n(288410),
        p = n(156040),
        f = n(500034),
        _ = n(323344),
        g = n(168807),
        m = n(509372),
        v = n(143273),
        y = n(258471);

      function b(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }
      n(255328);
      var w = o()(document),
        P = function() {
          return APP.data.current_view && r().isFunction(APP.data.current_view._getInstance) ? APP.data.current_view._getInstance() : APP.data.current_view
        },
        E = l().Router.prototype._bindRoutes,
        C = function() {
          var e = (0, _.getQueryString)();
          return window.location.pathname + (e ? "?".concat(e) : "")
        },
        k = !1,
        I = !1,
        A = C();
      (0, f.isFeatureAvailable)(f.Features.SYSTEM_NAVIGATION_V2) ? Promise.all([n.e(95882), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(3473), n.e(28422), n.e(47287), n.e(34385), n.e(43323), n.e(35370), n.e(84330), n.e(81904)]).then(n.bind(n, 343377)): n.e(37107).then(n.bind(n, 537107));
      var T = l().Router.extend({
        base_entities: ["leads", "contacts", "todo", "companies", "customers"],
        all_entities: [],
        paths: [],
        routes: r().extend(d.default, {
          ":entity(/)": "rememberedEntity",
          "*notFound": "notFound"
        }),
        initialize: function() {
          o()(document).on("page:reload list:reload", r().bind((function(e, t) {
            this.reload(t)
          }), this))
        },
        _bindRoutes: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var i = [];
          this.routes && (this.routes = r().chain(r().result(this, "routes")).reduce((function(e, t, n) {
            return r().isString(t) ? e[n] = t : (i.push([n, t[0], t[1], t[2] || {}]), this.all_entities = r().chain(this.all_entities).union([t[0]]).uniq().value()), e
          }), {}, this).value(), E.apply(this, t), r().reject(i, (function(e) {
            return e[3].internal = !0, this.addRoute.apply(this, function(e) {
              if (Array.isArray(e)) return b(e)
            }(t = e) || function(e) {
              if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(t) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return b(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? b(e, t) : void 0
              }
            }(t) || function() {
              throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()), !0;
            var t
          }), this))
        },
        notFound: function() {
          this.routeWrap("page404")
        },
        rememberedEntity: function(e) {
          var t = {
              leads: "pipeline",
              whatsapp: "whatsapp",
              mobile: "mobile",
              customers: APP.constant("periodicity_enabled") ? "pipeline" : "list",
              stats: "pipeline",
              todo: "line",
              contacts: "list",
              calendar: "month",
              catalogs: ""
            },
            n = (0, m.get)({
              leads: "LAST_PLACE_DEALS",
              whatsapp: "LAST_PLACE_WHATSAPP",
              mobile: "LAST_PLACE_MOBILE",
              customers: "LAST_PLACE_CUSTOMERS",
              stats: "LAST_PLACE_REPORTS",
              todo: "LAST_PLACE_TODO",
              contacts: "LAST_PLACE_CONTACTS",
              catalogs: "LAST_PLACE_CATALOGS",
              month: "LAST_PLACE_CALENDAR"
            } [e]);
          "stats" === e && "events/list" === n && (e = "events", n = "list"), n && -1 === n.indexOf("undefined") && -1 === n.indexOf("null") || (n = t[e]), "customers" !== e || "pipeline" !== n || APP.constant("periodicity_enabled") || (n = "list"), n || this.notFound(), APP.router.navigate("/".concat(e, "/").concat(n, "/"), {
            trigger: !0,
            replace: !0
          })
        },
        reload: function(e) {
          var t;
          !0 === e && (APP.data.current_entity = "no_entity"), APP.router.navigate((0, _.setQueryParam)({
            reload: (0, g.randHex)()
          }), {
            trigger: !0,
            replace: !0
          }), t = (0, _.removeQueryParam)("reload"), APP.router.navigate(window.location.pathname + (t ? "?".concat(t) : ""), {
            trigger: !1,
            replace: !0
          })
        },
        back: function(e) {
          var t, n = APP.getBaseEntity(),
            i = "",
            o = "/_support/".concat(n, "/list/").concat(i);
          if (I && !0 !== e) v.default.getPreventFlag() ? this.confirmPageChange(v.default.getTrackChanges(), (function() {
            l().history.history.back()
          })) : l().history.history.back();
          else if (r().contains(["leads", "companies", "whatsapp", "mobile", "contacts", "todo", "mail", "customers", "unsorted", "accounts", "users", "orders", "unban_account"], APP.getBaseEntity())) {
            switch ("companies" === n && (n = "contacts", i = "companies/"), APP.getBaseEntity()) {
              case "customers":
                t = APP.constant("periodicity_enabled") ? "/customers/pipeline/" : "/customers/list/";
                break;
              case "unsorted":
              case "leads":
                t = "/leads/";
                break;
              case "whatsapp":
                t = "/whatsapp/";
                break;
              case "mobile":
                t = "/mobile/";
                break;
              case "mail":
                t = "/".concat(n, "/inbox/");
                break;
              case "accounts":
              case "users":
              case "orders":
              case "unban_account":
                t = o;
                break;
              default:
                t = "/".concat(n, "/list/").concat(i)
            }
            this.navigate(t, {
              trigger: !0
            })
          }
        },
        addRoute: function(e, t, n, i) {
          return this.route(e, r().bind((function() {
            var e = (0, _.getQueryString)(),
              o = Array.prototype.slice.call(arguments);
            e && o.pop(), this.routeWrap(t, r().extend({
              handler: n,
              args: o
            }, i || {}))
          }), this)), this
        },
        routeWrap: function(e) {
          var t = this,
            n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
              querystring: ""
            };
          (0, h.clearWidgetsBlock)(), (0, y.setDefaultMetricNamespace)(null), k ? (APP.first_load = !1, "imbox" !== k.replace("/", "") && APP.constant("load_from_server", !1)) : n.first_load = !0, I === l().history.fragment && (n.is_back = !0), I = k, k && (n.path_changed = !0), n.is_card || this.paths.unshift(l().history.fragment), APP.getBaseEntity() === APP.getBaseEntity(e) ? APP.data.entity_changed = !1 : (n.entity_changed = !0, APP.data.entity_changed = !0), APP.data.page_changed = APP.data.current_entity !== e, APP.data.current_entity = e, APP.data.is_card = !!n.is_card, APP.data.from_card = !!APP.data.card_page, APP.data.entity_changed ? w.triggerHandler("page:entity_changed", [r().extend({}, n)]) : w.triggerHandler("page:sub_entity_changed", [r().extend({}, n)]), n.internal ? (APP.data.is_card || (this._show_overlay_delay = setTimeout((function() {
            w.trigger("page:overlay:show")
          }), 100)), n.handler({
            pageType: (0, y.getDefaultMetricNamespace)(),
            args: n.args || []
          }).then((function(e) {
            t.routeLoadedThenTrigger(n, e.default)
          }), (function(e) {
            console && console.error && console.error(e), APP.router.navigate(A, {
              replace: !0,
              trigger: !1
            }), w.trigger("page:overlay:hide")
          })), APP.first_load || APP.metricTracker.setCustomTime()) : r().isFunction(n.handler) && this.routeLoadedThenTrigger(n, n.handler), k = l().history.fragment
        },
        routeLoadedThenTrigger: function(e, t) {
          e.PageHandler = t, new Promise(r().bind(this.routeCheckCardBack, this, e)).then(r().bind(this.routeHandlerInit, this), r().noop), A = C()
        },
        routeHandlerInit: function(e) {
          var t = P();
          APP.data.card_page && (APP.data.card_page.destroy(), APP.data.card_page = !1), t && !e.is_card && (t.destroy(), APP.data.current_view = !1), (0, p.restartPageLoadHandling)();
          var n = new e.PageHandler({
            route_args: e.args,
            route_params: e.params || {}
          });
          e.is_card ? APP.data.card_page = n : APP.data.current_view = n
        },
        routeCheckCardBack: function(e, t, n) {
          var i, s = !1;
          clearTimeout(this._show_overlay_delay), w.trigger("page:overlay:hide"), !APP.data.is_card && APP.data.card_page && APP.data.current_view && this.paths[0] === this.paths[1] ? APP.data.card_page.cardBack(r().bind((function(n) {
            var i, r, a;
            r = P(), a = e.PageHandler, s = !(null != a && "undefined" != typeof Symbol && a[Symbol.hasInstance] ? a[Symbol.hasInstance](r) : r instanceof a), n || s ? (s && (APP.data.entity_changed = !0), t(e)) : ("none" !== o()("#search-suggest-drop-down-menu").css("display") && (i = ["search_input_focus"]), w.triggerHandler("page:changed", i))
          }), this)) : APP.data.current_view && APP.data.current_view.catalog && (i = APP.router.paths[0].split("/"))[1] === APP.data.current_view.catalog.id ? APP.data.current_view.browserNavigateHandler(i[2], e.args[1]) ? t(e) : n() : t(e)
        },
        navigate: function(e, t) {
          var n = l().history.getFragment(e || "");
          return !(t = t || {}).replace || t.trigger || APP.data.is_card || (this.paths[0] = decodeURIComponent(e.substring(1))), t.important && l().history.fragment === n.replace(/#.*$/, "") ? this.reload() : l().Router.prototype.navigate.apply(this, arguments)
        },
        _extractParameters: function(e, t) {
          var n = e.exec(t).slice(1);
          return r().map(n, (function(e, t) {
            return n.length, e || null
          }))
        }
      });
      u().mixin(T, v.default), APP.router = new T, l().history.start({
        pushState: !0
      });
      const S = APP.router;
      var x = "../build/transpiled/core/router";
      window.define(x, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([x])
    },
    487770: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => i
      });
      const i = {
        SALESBOT_CACHE_CODE: "amojo_salesbots",
        SALESBOT_NEXT_PAGE_LINK: "amojo_bot_next_page_link",
        SALESBOT_CACHE_LIFETIME: 3e5
      };
      var o = "../build/transpiled/interface/amojo/salesbots_constants";
      window.define(o, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([o])
    },
    954883: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => i
      });
      const i = {
        templates_cache_code: "amojo_templates",
        templates_next_page_link: "amojo_next_page_link",
        templates_cache_lifetime: 3e5
      };
      var o = "../build/transpiled/interface/amojo/templates/constants";
      window.define(o, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([o])
    },
    438173: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => _
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(460159),
        l = n.n(a),
        c = n(809228),
        u = n.n(c),
        d = n(304483),
        h = (n(19980), n(242284), n(181743), n(200123), n(241817), n(245522), n(95871), n(771205), n(709984), n(313445), n(105512), n(266569), n(990108), n(857185), n(397051), n(351532), n(985543), n(727526), n(792105), n(610102), n(384188), n(696677), n(282140), n(404382), n(461431), n(13745), n(447366), n(74956), n(333720), n(430647), n(962683), n(23032), n(749495), n(220555), n(125522), n(123241), n(830666), n(644760), n(51623), n(656536), n(521238), n(55310), n(217416), n(668108), n(863329), n(129976), n(225826), n(118973), n(967134), n(433264), n(305093), n(891941), n(319071), n(369500), n(661533)),
        p = !1,
        f = o()(document);
      document.addEventListener("click", (function(e) {
        e.target.closest(".button-input-loading") && e.stopPropagation()
      }), !0), f.on("controls:textarea:autosize", "textarea", (function() {
        var e = o()(this);
        e.is(":visible") && (e.autosize({
          callback: function() {
            e.trigger("controls:textarea:resized")
          }
        }), e.trigger("autosize.resize"))
      })), f.on("custom_radio_change", '.control-radio input[type="radio"]', (function() {
        var e = o()(this),
          t = o()(this.parentNode),
          n = this.type,
          i = o()(this).attr("name"),
          s = !!i && o()('[name="'.concat(i, '"]'));
        s && (s.not(this).prop("checked", !1).parent().removeClass("icon-".concat(n, "-checked")), s.filter(this).prop("checked", !0).parent().addClass("icon-".concat(n, "-checked"))), t.addClass("icon-".concat(n)), e.trigger("controls:change").change(), e.trigger("controls:change:visual")
      })).on("click", ".control-radio__label:not(.js-react-control)", (function() {
        var e = o()(this).find(".control-radio__helper").parent().find(":input");
        e.prop("disabled") || e.trigger("custom_radio_change", [!e.prop("checked")])
      })).on("controls:disable", '.control-radio input[type="radio"]', (function(e, t) {
        this.disabled = !!r().isUndefined(t) || t, o()(this).closest(".control-radio__label").toggleClass("control-radio__label_disabled", this.disabled).find(".control-radio__helper").toggleClass("control-radio__helper-disabled", this.disabled)
      })).on("controls:disable", ".button-input", (function(e, t) {
        t = !!r().isUndefined(t) || t, o()(this)[t ? "addClass" : "removeClass"]("button-input-disabled")
      })).on("controls:disable", ".switcher__checkbox", (function(e, t) {
        var n = o()("label[for='".concat(o()(this).attr("id"), "']"));
        t = !!r().isUndefined(t) || t, o()(this).prop("disabled", t), o()(this)[t ? "addClass" : "removeClass"]("js-disabled"), n[t ? "addClass" : "removeClass"]("js-disabled")
      })).on("click", ".js-note-expander", (function() {
        return o()(this).parent().hide().parent().find(".note--body--content-not-sliced").show(), o()(this).trigger("click:note_expander"), !1
      })), f.on("click.hide_controls controls:hide controls:hide:only", (function(e, t) {
        if (r().indexOf([1, 2], e.button) >= 0) return !0;
        var n, i;
        if ("string" != typeof t && (t = !1), "controls:hide:only" !== e.type && f.trigger({
            type: "controls:hide:private",
            target: (n = e.target, i = h, (null != i && "undefined" != typeof Symbol && i[Symbol.hasInstance] ? i[Symbol.hasInstance](n) : n instanceof i) ? e.target.get(0) : e.target)
          }, [t]), p && (!t || "btn_menu" === t)) {
          if (p.removeClass("button-input-pressed").parent().removeClass("button-input-wrapper-pressed"), p.attr("data-context-menu")) return;
          p = !1
        }
        e.stopPropagation()
      })).on("keydown", (function(e) {
        27 === e.keyCode && f.trigger("controls:hide").trigger("escape:keydown")
      })), f.on("button:saved", ".button-input", (function(e, t, n) {
        var i, s = o()(this);
        n = n || APP.lang.button_saved, s.children(".button-input__saved").length || (s.trigger("button:load:stop").trigger("button:save:enable").append('<div class="button-input__saved">'.concat(n, "</div>")).addClass("button-input-saved").children(".button-input-inner").hide(), i = setTimeout((function() {
          clearTimeout(i), s.children(".button-input__saved").remove(), s.removeClass("button-input-saved").children(".button-input-inner").show(), s.trigger("button:save:disable"), "function" == typeof t && t()
        }), 1500))
      })).on("button:enable", ".button-input", (function() {
        o()(this).removeClass("button-input-disabled")
      })).on("button:disable", ".button-input", (function() {
        o()(this).addClass("button-input-disabled")
      })).on("button:save:enable", ".button-input", (function() {
        o()(this).removeClass("button-input-disabled").addClass("button-input_blue")
      })).on("button:save:disable", ".button-input", (function() {
        o()(this).removeClass("button-input_blue").addClass("button-input-disabled")
      })).on("button:save:error button:load:error", ".button-input, .js-button-input", (function() {
        var e = o()(this);
        e.trigger("button:load:stop").addClass("animated shake"), r().delay((function() {
          e.removeClass("animated shake")
        }), 300)
      })).on("button:save:start button:load:start", ".button-input:not(.button-cancel):not(.button-input-saved)", (function(e, t) {
        var n = o()(this),
          i = o()('<div class="button-input__spinner"><span class="button-input__spinner__icon spinner-icon"></span></div>');
        "Y" !== n.attr("data-loading") && ((n.hasClass("button-input_blue") && !n.hasClass("button-input-disabled") || "white" === t) && i.children(".spinner-icon").addClass("spinner-icon-white"), n.addClass("button-input-loading").attr("data-loading", "Y").append(i).children(".button-input-inner").hide())
      })).on("button:load:stop button:save:stop", ".button-input:not(.button-cancel):not(.button-input-saved)", (function() {
        var e = o()(this);
        e.removeClass("button-input-loading").removeAttr("data-loading").children(".button-input__spinner").remove(), e.children(".button-input-inner").show()
      })), f.on("click", "[data-context-menu]", (function(e) {
        e.stopPropagation()
      })).on("click button:menu:toggle", ".button-input-with-menu", (function(e, t) {
        var n = o()(this),
          i = n.attr("data-context-menu"),
          s = i ? o()(n.attr("data-context-menu")) : n.parent().find(".button-input__context-menu"),
          a = !!n.attr("data-context-container") && o()(n.attr("data-context-container"));
        t = t || {}, (r().isUndefined(t.visible) ? n.hasClass("button-input-pressed") : t.visible) ? (n.removeClass("button-input-pressed").parent().removeClass("button-input-wrapper-pressed"), i && s.hide(), p = !1) : (t.no_trigger || f.trigger("keyboard:hide").trigger({
          type: "controls:hide",
          target: this
        }), i && (a && (a.append(s), n.removeAttr("data-context-container")), s.show()), n.addClass("button-input-pressed").parent().addClass("button-input-wrapper-pressed"), p = n);
        var l = new(u())(".js-context-menu-copy");
        l.on("success", r().bind((function(e) {
          var t = o()(e.trigger),
            n = t.find(".button-input__context-menu__item__text"),
            i = n.text();
          n.hasClass("button-input__context-menu__item__text-copied") || (n.text(t.data("copied")), n.addClass("button-input__context-menu__item__text-copied"), setTimeout((function() {
            n.text(i), n.removeClass("button-input__context-menu__item__text-copied"), o()(document).trigger("controls:hide"), l.destroy()
          }), 1e3))
        }), this)), s.visible(!n.attr("data-part-visible")) || s.addClass("button-open-left-side"), e.stopPropagation()
      })).on("context-menu:checkable:toggle", ".button-input__context-menu__item-checkable", (function(e) {
        var t = o()(e.currentTarget);
        t.is("[data-checkable-checked]") ? t.removeAttr("data-checkable-checked") : t.attr("data-checkable-checked", "")
      })).on("click", ".button-input__context-menu__item", (function(e) {
        o()(this).hasClass("js-context-menu-copy") ? e.stopPropagation() : f.trigger({
          type: "controls:hide",
          target: this
        }, ["btn_menu"])
      })), f.on("controls:change", "#task_edit_type", (function() {
        var e = o()(this);
        "custom" === e.val() && (e.closest(".task-types-holder").addClass("task-types-holder-custom-active").find(".task-types-holder__custom__input").focus(), e.val(0).trigger("controls:change"))
      })).on("click", ".task-types-holder__custom__cancel", (function() {
        o()(this).closest(".task-types-holder").removeClass("task-types-holder-custom-active").find(".task-types-holder__custom__input").val("")
      })), f.on("click", ".button-input-disabled", (function() {
        return !1
      })), f.on(APP.transition_event, ".js-animation-remove", (function(e) {
        o()(e.target).hasClass("js-animation-remove") && this.parentNode.removeChild(this)
      })).on("click", ".js-list-print", (function() {
        window.print()
      })).on("click", ".js-more-widgets", (function(e) {
        var t = o()(this).attr("data-widget");
        e.preventDefault(), new d.default({
          class_name: "modal-list more_widget_modal",
          init: l()._preload(["/tmpl/settings/widgets/more_widget_modal.twig"], (function(e) {
            e.trigger("modal:loaded").html(l()({
              ref: "/tmpl/settings/widgets/more_widget_modal.twig"
            }).render({
              has_add_rights: APP.constant("user_rights") && APP.constant("user_rights").is_admin,
              widget: t
            })).trigger("modal:centrify")
          }))
        })
      })).on("click", ".js-list-caption-link", (function() {
        o()(this).parent().find(".js-list-caption-link").removeClass("content__top__preset__caption__list__item-active"), o()(this).addClass("content__top__preset__caption__list__item-active")
      })).on("click", ".switcher:not(.js-disabled):not(.js-react-control)", (function() {
        o()(this).toggleClass("switcher__on switcher__off")
      })).on("change", ".switcher__checkbox:not(.js-disabled):not(.js-react-control)", (function() {
        o()(this).closest(".switcher_wrapper").find("label").toggleClass("switcher__on", this.checked).toggleClass("switcher__off", !this.checked)
      })).on("click", ".control-toggler__item:not(.control-toggler__item-selected)", (function() {
        var e = o()(this);
        e.closest(".control-toggler").find(".control-toggler__item-selected").removeClass("control-toggler__item-selected"), e.addClass("control-toggler__item-selected")
      })).on("animate:callback", ".js-animate", (function(e, t) {
        Modernizr.csstransitions ? (o()(this).offset(), o()(this).data("js-animate-callback", t).one(APP.transition_event, (function(e) {
          var t = o()(this).data("js-animate-callback");
          o()(this).data("js-animate-callback", !1), this === e.target && "function" == typeof t && t.call(this), e.stopPropagation()
        }))) : "function" == typeof t && t.call(this)
      }));
      const _ = o();
      var g = "../build/transpiled/interface/controls";
      window.define(g, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([g])
    },
    55310: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => o
      });
      var i = n(210734);
      const o = i.default.extend({
        controlClassName: "js-control-autosized_input",
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          i.default.prototype.initialize.apply(this, t), this.$el.autosizeInput({
            comfortZone: this.$el.data("comfort-zone")
          })
        },
        destroy: function() {
          this.$el.trigger("autosize.destroy")
        }
      });
      var s = "../build/transpiled/interface/controls/autosized_input";
      window.define(s, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([s])
    },
    282140: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => p
      });
      var i = n(629133),
        o = n.n(i),
        s = n(445368),
        r = n(577486);

      function a(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function l(e, t, n) {
        return l = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = c(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, l(e, t, n || e)
      }

      function c(e) {
        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, c(e)
      }

      function u(e, t) {
        return u = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, u(e, t)
      }

      function d(e) {
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
          var n, i = c(e);
          if (t) {
            var o = c(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var h = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && u(e, t)
        }(p, e);
        var t, n, i, h = d(p);

        function p() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, p), h.apply(this, arguments)
        }
        return t = p, n = [{
          key: "_classes",
          value: function() {
            return {
              input: "js-control-pretty-price",
              raw: "js-control-raw-price",
              autosized: "control-price_autosized"
            }
          }
        }, {
          key: "events",
          value: function() {
            return {
              "keydown .js-control-pretty-price": "_fixCursorPosOnKeydown",
              "input .js-control-pretty-price": "_formatOnInput",
              "controls:change .js-control-raw-price": "_onRawChangedOutside"
            }
          }
        }, {
          key: "initialize",
          value: function() {
            var e;
            l(c(p.prototype), "initialize", this).call(this, arguments), this._ignore_next_cursor_setting = !0, this._currency = this.$el.attr("data-currency"), this._allow_zero = !o().isUndefined(this._elem("input").attr("data-allow-zero")), e = this._getSymbolOffset(), "y" === this._elem("input").data("autosized") && this._elem("input").autosizeInput(e.has_space ? {} : {
              comfortZone: 0
            }).trigger("autosize:important"), this._addClass("autosized"), e.symbol_first && e.has_space && this._elem("input").css("margin-left", 5)
          }
        }, {
          key: "destroy",
          value: function() {
            this._elem("input").off(), l(c(p.prototype), "destroy", this).apply(this, arguments)
          }
        }, {
          key: "_onRawChangedOutside",
          value: function() {
            var e = this._elem("raw").val();
            this._elem("input").val(e), this._formatOnInput({
              allow_fraction: e % 1 != 0,
              allow_negative: !0
            })
          }
        }, {
          key: "_fixCursorPosOnKeydown",
          value: function(e) {
            var t = this._elem("input").get(0),
              n = t.value || "";
            this._end_pos = n.length - t.selectionEnd, this._onKeyDown(e)
          }
        }, {
          key: "_onKeyDown",
          value: function(e) {
            var t = this._elem("input").get(0),
              n = t.value || "",
              i = t.selectionStart;
            if (this._ignore_next_cursor_setting = !1, " " === n[i - 1] && 8 === e.keyCode) return t.value = n.slice(0, i - 2) + n.slice(i - 1), this._elem("input").trigger("input"), !1
          }
        }, {
          key: "_formatOnInput",
          value: function(e) {
            var t = o().propertyOf(e),
              n = this._elem("input").val(),
              i = new r.UnsafeRegExp("[^0-9" + (t("allow_fraction") ? "." : "") + (t("allow_negative") ? "-" : "") + "]+", "g"),
              a = n.replace(i, ""),
              l = (0, s.currency)(a, !0, t("allow_fraction") ? 2 : 0, this._currency).trim();
            a.length && (this._allow_zero || 0 !== parseInt(l)) || (l = ""), this._elem("raw").val(a).trigger("change"), this._elem("input").val(l).trigger("autosize:important"), this._setCursorPos()
          }
        }, {
          key: "_getSymbolOffset",
          value: function() {
            var e = o().propertyOf(APP.constant("currencies_used"))([this._currency, "currency_pattern"]) || APP.system.locale.currency_pattern;
            return {
              has_space: e.indexOf(" ") > -1,
              symbol_first: 0 === e.indexOf("%s")
            }
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "control-price"
          }
        }], n && a(t.prototype, n), i && a(t, i), p
      }(n(930184).default);
      h.extend(h);
      const p = h;
      var f = "../build/transpiled/interface/controls/budget/budget";
      window.define(f, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([f])
    },
    129976: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => y
      });
      var i = n(629133),
        o = n.n(i),
        s = n(974839),
        r = n.n(s),
        a = n(727406),
        l = n(834834),
        c = n(445368),
        u = n(926168),
        d = n(210734),
        h = n(661533);

      function p(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function f(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              p(s, i, o, r, a, "next", e)
            }

            function a(e) {
              p(s, i, o, r, a, "throw", e)
            }
            r(void 0)
          }))
        }
      }

      function _(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function g(e, t) {
        var n, i, o, s, r = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return s = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this
        }), s;

        function a(s) {
          return function(a) {
            return function(s) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; r;) try {
                if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                  case 0:
                  case 1:
                    o = s;
                    break;
                  case 4:
                    return r.label++, {
                      value: s[1],
                      done: !1
                    };
                  case 5:
                    r.label++, i = s[1], s = [0];
                    continue;
                  case 7:
                    s = r.ops.pop(), r.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                      r = 0;
                      continue
                    }
                    if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                      r.label = s[1];
                      break
                    }
                    if (6 === s[0] && r.label < o[1]) {
                      r.label = o[1], o = s;
                      break
                    }
                    if (o && r.label < o[2]) {
                      r.label = o[2], r.ops.push(s);
                      break
                    }
                    o[2] && r.ops.pop(), r.trys.pop();
                    continue
                }
                s = t.call(e, r)
              } catch (e) {
                s = [6, e], i = 0
              } finally {
                n = o = 0
              }
              if (5 & s[0]) throw s[1];
              return {
                value: s[0] ? s[1] : void 0,
                done: !0
              }
            }([s, a])
          }
        }
      }
      var m = "control-chained-list__suggest",
        v = (0, a.wrapCacheCollection)(r().Collection.extend({
          itemRel: "elements",
          url: function(e) {
            return "/ajax/v4/catalogs/".concat(e, "/elements")
          },
          getCacheId: function(e) {
            var t = e.url,
              n = e.data;
            return JSON.stringify({
              url: t,
              data: n
            })
          }
        }));
      const y = d.default.extend({
        controlClassName: "js-control-chained-list",
        _classes: function() {
          return {
            suggest: m,
            suggest_empty: "".concat(m, "_empty"),
            suggest_input: "control--suggest--input",
            suggest_item: "control--suggest--list--item",
            suggest_list: "js-control--suggest--list",
            chain_value: "js-control-changed-list-chain-value"
          }
        },
        _selectors: function() {
          return {
            suggest_by_id: ".".concat(m, '[data-catalog-id="%s"]'),
            chain_value_by_id: '.js-control-changed-list-chain-value[data-catalog-id="%s"]'
          }
        },
        events: function() {
          var e;
          return _(e = {}, "controls:change ".concat(this._selector("chain_value")), "onInputChangeOutside"), _(e, "focus ".concat(this._selector("suggest_input")), "onSuggestFocused"), _(e, "input ".concat(this._selector("suggest_input")), "onSuggestInputLoadDebounced"), _(e, "change ".concat(this._selector("suggest_input")), "onSuggestBlur"), _(e, "click ".concat(this._selector("suggest_item")), "onSuggestItemClick"), _(e, "suggest:loaded ".concat(this._selector("suggest_input")), "onSuggestLoaded"), _(e, "suggest:changed ".concat(this._selector("suggest_input")), "onSuggestChanged"), _(e, "chained-list:get-element-name ".concat(this._selector("chain_value")), "proxyElementNameToDataAttrs"), e
        },
        document_events: function() {
          return {
            "page:changed": "onPageChangedClearCollectionCache"
          }
        },
        initialize: function() {
          var e = this;
          d.default.prototype.initialize.apply(this, arguments);
          var t = this.$("script");
          this._suggests_inited = {}, this._cache = {}, this._elements_collection = new v, this._settings = JSON.parse(t.html()), this.onSuggestInputLoadDebounced = o().debounce(this.onSuggestInputLoad, 700), this._values = o().reduce(this._settings, (function(t, n) {
            var i = e._elem("suggest_by_id", n.catalog_id),
              o = e._elem("chain_value_by_id", n.catalog_id),
              s = parseInt(o.val());
            return s && (t[n.catalog_id] = {
              id: s,
              text: i.find(e._selector("suggest_input")).val()
            }), t
          }), {}), h(document.activeElement).hasClass(this._class("suggest_input")) && h.contains(this.el, document.activeElement) && this.onSuggestFocused({
            currentTarget: document.activeElement
          })
        },
        onPageChangedClearCollectionCache: function() {
          this._elements_collection.clearCache({
            namespace_full: !0
          })
        },
        onInputChangeOutside: function(e) {
          var t = h(e.currentTarget),
            n = parseInt(t.attr("data-catalog-id")),
            i = parseInt(t.val());
          this._values[n] = {}, i ? this.syncInputValueText(n, i) : (this._elem("suggest_by_id", n).find(this._selector("suggest_input")).val(""), this.toggleSuggest(n, !0), this.setChainValue(n, ""))
        },
        onSuggestFocused: function(e) {
          var t = h(e.currentTarget),
            n = parseInt(t.attr("data-catalog-id"));
          if (!this._suggests_inited[n]) {
            var i = o().findWhere(this._settings, {
              catalog_id: n
            });
            this.loadSuggestData({
              catalog_id: n,
              field_id: i.field_id,
              parent_element_id: parseInt(t.closest(this._selector("suggest")).attr("data-parent-element-id"))
            }), this._suggests_inited[n] = !0
          }
        },
        onSuggestInputLoad: function(e) {
          var t = this,
            n = h(e.currentTarget),
            i = parseInt(n.attr("data-catalog-id")),
            s = n.val().trim(),
            r = parseInt(n.parent().attr("data-parent-element-id")),
            a = parseInt(n.parent().attr("data-parent-catalog-id")),
            l = {},
            c = o().findWhere(this._settings, {
              parent_catalog_id: a
            });
          if (r && c && (l.custom_fields = _({}, "".concat(c.field_id), r)), s.length > 2) {
            var u = this.makeCatalogElementsRequest({
              catalog_id: i,
              term: s,
              filter: l
            });
            u && (n.trigger("suggest:loader"), u.then((function(e) {
              t.resetItems(e), n.trigger("focus")
            }), (function(e) {
              return t.resetItems(e)
            })))
          }
        },
        onSuggestLoaded: function(e, t) {
          h(e.currentTarget).closest(this._selector("suggest")).find(this._selector("suggest_list")).trigger("suggest:reset", [o().map(t.result, (function(e) {
            return {
              id: e.id,
              text: e.name
            }
          }))])
        },
        onSuggestItemClick: function(e) {
          this._$document.trigger({
            type: "controls:hide",
            target: this.el
          }), e.stopPropagation(), h(e.currentTarget).trigger("suggest:item:click")
        },
        onSuggestChanged: function(e, t) {
          var n = this,
            i = h(e.currentTarget),
            s = parseInt(t.data("value-id")),
            r = parseInt(i.attr("data-catalog-id"));
          s > 0 && r > 0 && (this.setChainValue(r, s), setTimeout((function() {
            var e = o().findWhere(n._settings, {
              parent_catalog_id: r
            });
            e && i.is(":focus") && !APP.is_touch_device && n._elem("suggest_by_id", e.catalog_id).find(n._selector("suggest_input")).focus()
          })))
        },
        onSuggestBlur: function(e) {
          var t = h(e.currentTarget),
            n = parseInt(t.attr("data-catalog-id"));
          t.val() !== o().propertyOf(this._values)([n, "text"]) && (t.val(""), this.toggleSuggest(n, !0), this.setChainValue(n, ""))
        },
        makeCatalogElementsRequest: function(e) {
          var t = this,
            n = e.catalog_id,
            i = e.term,
            s = e.filter,
            r = h.Deferred();
          return this._cache["".concat(n).concat(i)] ? r.resolve(this._cache["".concat(n).concat(i)]) : l.default.searchElements(n, i, s).then((function(e) {
            var s = o().map(e, (function(e) {
              var t = (0, c.catalogElementName)(e.name, e.id, e.catalog_id);
              return {
                id: e.id,
                element_type: APP.element_types.catalog_elements,
                catalog_id: n,
                name: t
              }
            }));
            t._cache["".concat(n).concat(i)] = s, r.resolve(s)
          }), r.reject), r.promise()
        },
        resetItems: function() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
            t = this._findElem("suggest_list"),
            n = o().map(e, (function(e) {
              return {
                id: e.id,
                additional_data: ['data-name="'.concat(o().escape(e.name), '"'), 'data-entity-id="'.concat(e.id, '"'), 'data-entity-type="'.concat((0, u.convertElementType)(e.element_type, "string"), '"'), 'data-catalog-id="'.concat(e.catalog_id, '"')].join(" "),
                text: e.name
              }
            }));
          t.trigger("suggest:reset", [n, ""])
        },
        toggleSuggest: function(e, t) {
          var n = this._elem("suggest_by_id", e);
          n.toggleClass("hidden", !t), t && (n.find(this._selector("suggest_input")).val() ? n.removeClass(this._class("suggest_empty")) : (this._elem("suggest").removeClass(this._class("suggest_empty")), n.addClass(this._class("suggest_empty"))))
        },
        setChainValue: function(e, t) {
          var n = o().findWhere(this._settings, {
            parent_catalog_id: e
          });
          if (this._elem("chain_value_by_id", e).val(t).trigger("change"), this._values[e] = {
              id: t,
              text: this._elem("suggest_by_id", e).find(this._selector("suggest_input")).val()
            }, n) {
            var i = this._elem("suggest_by_id", n.catalog_id),
              s = i.find(this._selector("suggest_input"));
            t && !s.val() ? this.toggleSuggest(n.catalog_id, !0) : t && i.attr("data-parent-element-id") === String(t) || (s.val(""), this.toggleSuggest(n.catalog_id, String(t || "").length > 0), this.setChainValue(n.catalog_id, "")), t && this.loadSuggestData({
              catalog_id: n.catalog_id,
              field_id: n.field_id,
              parent_element_id: t
            })
          }
        },
        loadSuggestData: function(e) {
          var t = e.catalog_id,
            n = e.field_id,
            i = e.parent_element_id;
          return f((function() {
            var e, o, s, r, a;
            return g(this, (function(l) {
              switch (l.label) {
                case 0:
                  return e = this._elem("suggest_by_id", t), o = e.find(this._selector("suggest_input")), (s = e.find(this._selector("suggest_list"))).length ? (o.attr("placeholder", o.attr("data-placeholder")), e.attr("data-parent-element-id", i), s.trigger("suggest:reset", [
                    []
                  ]), e.find(this._selector("suggest_input")).trigger("suggest:loader", [!0]), r = {}, n && (r.custom_fields = _({}, "".concat(n), parseInt(i))), [4, this._elements_collection.fetch({
                    url: this._elements_collection.url(t),
                    data: {
                      limit: 500,
                      filter: r
                    }
                  })]) : [2];
                case 1:
                  return l.sent(), a = [], this._elements_collection.length ? a = this._elements_collection.map((function(e) {
                    return {
                      id: e.get("id"),
                      text: e.get("name")
                    }
                  })) : o.attr("placeholder", "".concat(o.attr("data-placeholder"), ": ").concat((0, c.i18n)("All").toLowerCase())), s.trigger("suggest:reset", [a, '<li data-value-id="<%= data.id %>" class="control--suggest--list--item <%= data.custom_class %>" <%= data.additional_data %>><span class="control--suggest--list--item-inner" title="<%= _.escape(data.title) %>"><%= data.text %></span></li>']), o.trigger("suggest:loader", [!1]), [2]
              }
            }))
          })).apply(this)
        },
        syncInputValueText: function(e, t) {
          return f((function() {
            var n, i;
            return g(this, (function(s) {
              switch (s.label) {
                case 0:
                  return [4, l.default.getElementsByIds(e, [t])];
                case 1:
                  return (n = s.sent()).length && (i = o().findWhere(this._settings, {
                    parent_catalog_id: e
                  }), this._elem("suggest_by_id", e).find(this._selector("suggest_input")).val(o().propertyOf(n)([0, "name"])), this.toggleSuggest(e, !0), i && (this.toggleSuggest(i.catalog_id, !0), this._elem("suggest_by_id", i.catalog_id).attr("data-parent-element-id", o().propertyOf(n)([0, "id"])))), [2]
              }
            }))
          })).apply(this)
        },
        proxyElementNameToDataAttrs: function(e) {
          var t = h(e.currentTarget),
            n = t.next(this._selector("suggest"));
          t.data("element-name", n.find(this._selector("suggest_input")).val())
        }
      });
      var b = "../build/transpiled/interface/controls/chained_list";
      window.define(b, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([b])
    },
    430647: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => l
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(447366);
      const l = a.default.extend({
        controlClassName: "js-control-checkboxes_dropdown-huge",
        _selectors: function() {
          return o().extend({
            inner: ".checkboxes_dropdown__list__wrapper__inner"
          }, a.default.prototype._selectors())
        },
        initialize: function() {
          this.is_rendered_on_client = !1, this.$fake_script = this.$el.find("script");
          try {
            this.checkboxes_dropdown_data = JSON.parse(this.$fake_script.html())
          } catch (e) {}
          a.default.prototype.initialize.apply(this, arguments)
        },
        _updateMasterCheckboxesOnInit: function() {
          if (this.is_rendered_on_client) a.default.prototype._updateMasterMinus.apply(this);
          else {
            var e = this.checkboxes_dropdown_data.items,
              t = o().filter(e, (function(e) {
                return e.is_checked
              }));
            a.default.prototype._updateMasterMinus.apply(this, [t, e])
          }
        },
        _getCheckboxesChecked: function() {
          if (!this.is_rendered_on_client) {
            var e = o().filter(this.checkboxes_dropdown_data.items, (function(e) {
              return e.is_checked
            }));
            return o().map(e, (function(e) {
              return o().escape(e.option)
            }))
          }
          return a.default.prototype._getCheckboxesChecked.apply(this, arguments)
        },
        setTitle: function() {
          if (!this.is_rendered_on_client) {
            var e = this.checkboxes_dropdown_data.items,
              t = o().filter(e, (function(e) {
                return e.is_checked
              }));
            return a.default.prototype._updateMasterMinus.apply(this, [t, e]), void a.default.prototype._setTitle.apply(this, [t, e])
          }
          a.default.prototype.setTitle.apply(this, arguments)
        },
        onClickTitle: function() {
          this.is_rendered_on_client || (this.$el.find(this._selector("inner")).replaceWith(r()({
            ref: "/tmpl/controls/checkboxes_dropdown/inner.twig"
          }).render(this.checkboxes_dropdown_data)), this._dropElemCache("checkboxes_list"), this._dropElemCache("master_checkbox"), this.$fake_script.remove(), this.is_rendered_on_client = !0), a.default.prototype.onClickTitle.apply(this, arguments)
        },
        getCheckedItemsForFormModel: function() {
          return o().reduce(this.checkboxes_dropdown_data.items, (function(e, t) {
            return t.is_checked && (e[t.name] = String(t.id)), e
          }), {})
        }
      });
      var c = "../build/transpiled/interface/controls/checkboxes_dropdown/checkboxes_dropdown_huge";
      window.define(c, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([c])
    },
    333720: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => s
      });
      var i = n(445368),
        o = n(447366);
      n(368439);
      const s = o.default.extend({
        controlClassName: "js-control-checkboxes_dropdown_values",
        _setTitle: function(e, t) {
          var n = this._elem("title").attr("data-title-empty"),
            o = this._elem("title").attr("data-numeral");
          e.length && e.length !== t.length ? this._updateTitle("".concat(e.length, " ").concat((0, i.numeralWord)(e.length, this._elem("title").attr("data-numeral")))) : !e.length && n ? this._updateTitle(n) : this._updateTitle("".concat((0, i.i18n)("all"), " ").concat((0, i.numeralWord)("all", o) || ""))
        },
        _updateTitle: function(e) {
          var t = this._elem("title").attr("data-title-before") || "",
            n = e ? 'data-title-before="'.concat(t, '"') : "";
          this._elem("title").html('<div class="checkboxes_dropdown__title-item" '.concat(n, ">").concat(e, "</div>"))
        }
      });
      var r = "../build/transpiled/interface/controls/checkboxes_dropdown/values_title";
      window.define(r, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([r])
    },
    23032: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => d
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(445368),
        l = n(210734),
        c = n(555989),
        u = n(661533);
      const d = l.default.extend({
        controlClassName: "js-control-checkboxes-search",
        events: {
          "click :not(.js-filter-field-clear)": "open",
          "change input:checkbox": "updateMainInput"
        },
        template_input: "/tmpl/controls/checkboxes_search/input.twig",
        is_first_load: !0,
        _selectors: function() {
          return {
            list: ".checkboxes-search__opening-list",
            cb_inputs: ".checkboxes-search__opening-list input:checkbox",
            cb_ch_inputs: ".checkboxes-search__opening-list input:checked",
            title_wrapper: ".checkboxes-search__title-wrapper"
          }
        },
        _getOpenWindowComponent: function() {
          return c.default
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          l.default.prototype.initialize.apply(this, t), this.name = this.$el.data("name"), this.title = this.$el.attr("title"), this.$list = this._findElem("list"), this.open_window = this._addComponent(this._getOpenWindowComponent(), {
            el: this.$list,
            name: this.name,
            parrentClose: o().bind(this._toggleBodyOverlay, this, !1),
            callbackHide: o().bind(this.updateMainInput, this)
          })
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return this.$list.off(), this._destroyComponent(this.open_window), l.default.prototype.destroy.apply(this, t)
        },
        updateMainInput: function() {
          this._updateMainInput || (this._updateMainInput = o().throttle(o().bind((function() {
            var e = this._findElem("cb_inputs"),
              t = this._findElem("cb_ch_inputs"),
              n = t.length,
              i = [];
            n > 0 && (!this._isEmptyEqualsFilled() || n !== e.length) && o().find(t, (function(e, t) {
              return 4 === t ? i.push((0, a.i18n)("N more").replace("%s", n - 4)) : i.push(u(e).data("value")), 4 === t
            })), this.renderInput({
              items: i
            })
          }), this), 400)), o().isFunction(this._updateMainInput) && this._updateMainInput()
        },
        renderInput: function(e) {
          e = o().extend({
            items: [],
            title: this.title
          }, e || {}), r()._preload([this.template_input])().then(o().bind((function() {
            this._findElem("title_wrapper").replaceWith(r()({
              ref: this.template_input
            }).render(e))
          }), this))
        },
        open: function(e) {
          var t, n;
          e.stopPropagation(), this._$document.trigger({
            type: "controls:hide",
            target: e.target
          }), this.$list.removeClass("hidden").find("input:checkbox"), this._isEmptyEqualsFilled() && 0 === this._findElem("cb_ch_inputs").length && this._findElem("cb_inputs").prop("checked", this._isCheckedElement()), this._toggleBodyOverlay(this.$list, o().bind(this.open_window.hide, this.open_window));
          var i = this.$el.offset(),
            s = this._getPositionOffset();
          this.$list.css({
            width: this.$el.width(),
            left: i.left - s.left,
            top: i.top - s.top
          }), this.$list.data("view-upper") && (t = window.innerHeight + u(document).scrollTop()) < (n = this.$list.offset().top + this.$list.innerHeight()) && this.$list.css("top", i.top - s.top + -1 * (n - t + 20))
        },
        _isEmptyEqualsFilled: function() {
          return !0
        },
        _isCheckedElement: function() {
          return !0
        },
        _getPositionOffset: function() {
          return {
            top: 36,
            left: 16
          }
        }
      });
      var h = "../build/transpiled/interface/controls/checkboxes_search/index";
      window.define(h, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([h])
    },
    962683: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => s
      });
      var i = n(210734),
        o = n(661533);
      const s = i.default.extend({
        controlClassName: "js-control-checkboxes_string",
        _classes: function() {
          return {
            checked: "checkboxes_string__item_checked",
            choose_border: "checkboxes_string__choose_border"
          }
        },
        _selectors: function() {
          return {
            item_container: ".checkboxes_string__item_container",
            choose: ".checkboxes_string__choose",
            choose_border: ".checkboxes_string__choose_border"
          }
        },
        events: {
          "click .checkboxes_string__item_container": "toggleCheckbox"
        },
        initialize: function() {
          i.default.prototype.initialize.apply(this, arguments), this.render()
        },
        toggleCheckbox: function(e) {
          var t = o(e.currentTarget),
            n = t.closest(this._selector("choose"));
          e.target.checked ? (t.removeClass(this._class("checked")), n.addClass(this._class("choose_border"))) : (t.addClass(this._class("checked")), n.removeClass(this._class("choose_border")))
        }
      });
      var r = "../build/transpiled/interface/controls/checkboxes_string";
      window.define(r, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([r])
    },
    521238: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => P
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(460159),
        l = n.n(a),
        c = n(267651),
        u = n.n(c),
        d = n(344103),
        h = n(214558),
        p = n(445368),
        f = n(168807),
        _ = n(500034),
        g = n(577486),
        m = n(210734),
        v = n(954883),
        y = n(487770),
        b = n(147562),
        w = n(353256);
      const P = m.default.extend({
        controlClassName: "js-control-contenteditable",
        suggestions: [],
        _suggestions_exists: !1,
        _selectors: function() {
          return {
            editable: "[contenteditable]"
          }
        },
        _classes: function() {
          return {
            input: "js-control-contenteditable-input",
            clearer: "js-control-contenteditable-clearer",
            interactive_placeholder: "js-control-contenteditable-interactive-placeholder",
            suggested: "control-contenteditable_suggested",
            suggestions: "js-control-contenteditable-suggestions",
            suggest_item: "js-suggestion-item",
            suggestion_item_disabled: "control-contenteditable__suggestions-item_disabled",
            suggestions_at_top: "control-contenteditable__suggestions_at-top",
            suggestions_style: "control-contenteditable__suggestions",
            suggestions_item: "js-control-contenteditable-suggestions-item",
            suggestions_item_hovered: "tips-item_hovered",
            suggestions_hint: "control-contenteditable__suggestions-hint"
          }
        },
        events: function() {
          var e = {
            click: "_onContainerClick"
          };
          return e["click ".concat(this._selector("editable"))] = "focusContentEditableOnMobile", e["focus ".concat(this._selector("editable"))] = "focusContentEditable", e["input ".concat(this._selector("editable"))] = "onInput", e["paste ".concat(this._selector("editable"))] = "onPasteContent", e["keydown ".concat(this._selector("editable"))] = "onKeyDown", e["indent:check ".concat(this._selector("editable"))] = "_checkMessageIndent", e["contenteditable:focus-if-unfocused ".concat(this._selector("editable"))] = "_focusIfUnfocused", e["contenteditable:show-validation-error ".concat(this._selector("editable"))] = "_showValidationError", e["focus ".concat(this._selector("editable"), ".validate-has-error")] = "_hideValidationError", e["controls:disable ".concat(this._selector("editable"))] = "onEditableDisable", e["suggestions:open ".concat(this._selector("editable"))] = "_openSuggestList", e["suggestions:set ".concat(this._selector("editable"))] = "onSetSuggestions", e["cache-suggestions:set ".concat(this._selector("editable"))] = "onSetСacheSuggestions", e["contenteditable:preset-text:insert"] = "onPresetTextInsert", e
        },
        document_events: function() {
          var e = {
            "controls:hide:private": "_handleControlClicks",
            "click .js-suggestions-favorites": "toggleFavoriteState"
          };
          return e["click ".concat(this._selector("suggestions_item"))] = "onSuggestionClick", e
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          m.default.prototype.initialize.apply(this, t), this.wrapper_class_name = "", this.templateCacheData = [], this.salesbotCacheData = [], this._elem("editable").length || this.destroy(!1), this._elem("editable").is(":focus") && this._checkMessageIndent()
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this._removeSuggestionsList(), m.default.prototype.destroy.apply(this, t)
        },
        _focusIfUnfocused: function() {
          var e = window.getSelection(),
            t = this._findElem("editable").get(0);
          t.contains(e.anchorNode) && e.anchorNode !== t || (this.focusContentEditable(), this._putCursorToEnd())
        },
        _showValidationError: function() {
          this._elem("editable").addClass("validate-has-error")
        },
        _hideValidationError: function() {
          this._elem("editable").removeClass("validate-has-error")
        },
        _onContainerClick: function(e) {
          e.target.classList.contains("js-control-contenteditable") && this._focusIfUnfocused()
        },
        focusContentEditableOnMobile: function(e) {
          APP.is_touch_device && o()(e.currentTarget).focus()
        },
        focusContentEditable: function() {
          this._findElem("editable").get(0) && this._checkMessageIndent()
        },
        getTipData: function(e) {
          return {
            text: e.text,
            value: e.value || e.text,
            favorite: e.favorite || e.favorite_for_users && r().contains(e.favorite_for_users, (0, h.current)("id")),
            suggestion_type: e.suggestion_type,
            id: e.id,
            class_name: e.sticky_header && "add_voice_message" !== e.value ? this._class("suggestion_item_disabled") : [e.class_name, this._class("suggestions_item")].join(" "),
            sticky_header: e.sticky_header,
            svg_icon: e.svg_icon,
            without_favorite: e.without_favorite
          }
        },
        onInput: function() {
          var e = this._getValue(!1).replace(/[\r\n]+$/, "");
          this._checkMessageIndent(), ((0, _.isFeatureAvailable)("airewriter") || (0, _.isFeatureAvailable)("kommo_ai_trial_started") && !(0, _.isFeatureAvailable)("kommo_ai_trial_ended")) && !e.startsWith("/") && u().publish(w.FEED_COMPOSE_INPUT_CHANGE, e), e ? this._openSuggestList({}, {
            value: e
          }) : (this._elem("editable").html(""), this._checkMessageIndent(), this._removeSuggestionsList())
        },
        getCurrentFavorites: function() {
          return r().filter(this._suggestions, (function(e) {
            return e.favorite || e.favorite_for_users && r().contains(e.favorite_for_users, (0, h.current)("id"))
          }))
        },
        toggleFavoriteState: function(e) {
          var t = o()(e.currentTarget).parent().data("id"),
            n = o()(e.currentTarget).parent().data("suggestion-type"),
            i = e.currentTarget.classList.contains("tips-item__favorites-icon--checked");
          if (e.stopPropagation(), t && n) {
            var s = r().find(this._suggestions, (function(e) {
              return e.id === t && e.suggestion_type === n
            }));
            s && (i ? this.removeFromFavorites(s) : this.setFavorite(s), this._removeSuggestionsList(), this._openSuggestList({}, this.suggest_options))
          }
        },
        updateFavoriteSalesbot: function(e) {
          var t = e.selectedSuggestion,
            n = e.isFavorite,
            i = f.storeWithExpiration.get(y.default.SALESBOT_CACHE_CODE),
            o = i || this.salesbotCacheData,
            s = r().map(o, (function(e) {
              return e.id === t.id && (e.favorite = n), e
            })) || [];
          if (i) {
            var a = f.storeWithExpiration.get_created_at(y.default.SALESBOT_CACHE_LIFETIME),
              l = a ? y.default.SALESBOT_CACHE_LIFETIME - (new Date).getTime() + a : y.default.SALESBOT_CACHE_LIFETIME;
            f.storeWithExpiration.set(y.default.SALESBOT_CACHE_CODE, s, l)
          }
        },
        updateFavoriteTemplate: function(e) {
          var t = e.selectedSuggestion,
            n = e.isFavorite,
            i = f.storeWithExpiration.get(v.default.templates_cache_code),
            o = i || this.templateCacheData,
            s = r().find(o, (function(e) {
              return e.id === t.id
            })) || {};
          if (s.favorite_for_users && (s.favorite_for_users = n ? r().union(s.favorite_for_users, [(0, h.current)("id")]) : r().without(s.favorite_for_users, (0, h.current)("id"))), i) {
            var a = f.storeWithExpiration.get_created_at(v.default.templates_cache_code),
              l = a ? v.default.templates_cache_lifetime - (new Date).getTime() + a : v.default.templates_cache_lifetime;
            f.storeWithExpiration.set(v.default.templates_cache_code, o, l)
          }
        },
        setFavorite: function(e) {
          r().each(this._suggestions, (function(t) {
            t.id === e.id && t.suggestion_type === e.suggestion_type && (r().isUndefined(t.favorite) || (t.favorite = !0), r().isUndefined(t.favorite_for_users) || (t.favorite_for_users = r().union(t.favorite_for_users, [(0, h.current)("id")])))
          })), 1 === e.suggestion_type ? (d.default.addBotToFavorites(e.id), this.updateFavoriteSalesbot({
            selectedSuggestion: e,
            isFavorite: !0
          })) : 2 === e.suggestion_type && (d.default.addTemplateToFavorites(e.id), this.updateFavoriteTemplate({
            selectedSuggestion: e,
            isFavorite: !0
          }))
        },
        removeFromFavorites: function(e) {
          r().each(this._suggestions, (function(t) {
            t.id === e.id && t.suggestion_type === e.suggestion_type && (r().isUndefined(t.favorite) || (t.favorite = !1), r().isUndefined(t.favorite_for_users) || (t.favorite_for_users = r().without(t.favorite_for_users, (0, h.current)("id"))))
          })), 1 === e.suggestion_type ? (d.default.removeBotFromFavorites(e.id), this.updateFavoriteSalesbot({
            selectedSuggestion: e,
            isFavorite: !1
          })) : 2 === e.suggestion_type && (d.default.removeTemplateFromFavorites(e.id), this.updateFavoriteTemplate({
            selectedSuggestion: e,
            isFavorite: !1
          }))
        },
        extendWithFavorites: function(e) {
          var t, n = this.getCurrentFavorites(),
            i = [];
          return r().each(n, (function(n) {
            (t = r().find(e, (function(e) {
              return e.id === n.id && e.suggestion_type === n.suggestion_type && e.text === n.text
            }))) && i.push(r().extend({}, t, {
              favorite: !0
            }))
          })), i.length && (e = [{
            class_name: "control-contenteditable__suggestions-item_disabled",
            sticky_header: !0,
            text: (0, p.i18n)("Starred"),
            value: "Favorites"
          }].concat(i, e)), e
        },
        _sortFavorites: function(e, t) {
          return e.favorite && !t.favorite ? -1 : !e.favorite && t.favorite ? 1 : 0
        },
        _openSuggestList: function(e, t) {
          var n, i, s, a, c, u = t.value,
            d = o()("#contenteditable_suggestions"),
            h = "",
            p = 0,
            f = 0;
          if (this.suggest_options = t, this._findElem("suggestions_hint").remove(), (n = r().chain(this._suggestions || []).filter((function(e) {
              return 0 === (e.text || "").toLowerCase().indexOf(u.toLowerCase())
            }), this).sort(this._sortFavorites).groupBy("suggestion_type").reduce((function(e, t) {
              var n = t[0].header_title,
                i = t[0].without_favorite;
              return n && e.push({
                text: n,
                value: n,
                sticky_header: !0,
                without_favorite: i
              }), e.concat(t)
            }), [], this).map((function(e) {
              return this.getTipData(e)
            }), this).value()).length) {
            this.sticky_headers && this.sticky_headers.destroy(), n = this.extendWithFavorites(n), (i = r().find(this._suggestions, (function(e) {
              return "add_voice_message" === e.value
            }))) && t.nohint && (n = r().union([this.getTipData(i)], n));
            var _ = n.slice(0, 500);
            h = l()({
              ref: "/tmpl/common/sticky_headers_tip.twig"
            }).render({
              id: "contenteditable_suggestions",
              class_name: [this._class("suggestions"), this._class("suggestions_style"), this.wrapper_class_name].join(" "),
              items: _,
              favorites_available: !0,
              is_custom_tip_holder: !0
            }), d.length ? (d.replaceWith(h), d = o()("#contenteditable_suggestions")) : (d = o()(h), this._$body.append(d)), t.nohint || this.$el.append('<span class="'.concat(this._class("suggestions_hint"), '" style="left: ').concat(this._findElem("clearer").width() + 5, 'px"></span>')), s = this._findElem("clearer"), (a = this._findElem("editable")).hasClass("feed-compose__message-attach") ? (c = o()(this).find("feed-amojo__attaches"), p = a.offset().top + c.height() + 18, f = a.offset().left + 5) : (p = s.offset().top + s.height(), f = s.offset().left + s.width() + 5), d.css({
              left: r().isUndefined(t.left) ? f : t.left,
              top: r().isUndefined(t.top) ? p : t.top
            }).trigger("tip:show"), d.hasClass("tips-at-top") && d.removeClass("tips-at-top").addClass(this._class("suggestions_at_top")), t.nohint || this.$el.addClass(this._class("suggested")), this._suggestionSetIndex(1), this.sticky_headers = this._addComponent(b.default, {
              el: this._$body.find(".control-contenteditable__suggestions_template").find(".js-tip-items"),
              selector: ".control-contenteditable__suggestions-item_disabled",
              exclude_scrollbar: !1,
              max_sticky_count: 4
            }), this.sticky_headers.refresh()
          } else this._removeSuggestionsList()
        },
        onPasteContent: function(e) {
          e.preventDefault();
          var t = (e.originalEvent || e).clipboardData,
            n = null == t ? void 0 : t.getData("text/plain");
          n && document.execCommand("insertText", !1, this._normalizeLineEndings(n))
        },
        onSetSuggestions: function(e, t, n) {
          var i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
          this.wrapper_class_name = n, this._elem("editable").is(":focus") && this._checkMessageIndent(), this._setSuggestions(t), !0 === i && this._openSuggestList({}, this.suggest_options)
        },
        onSetСacheSuggestions: function(e, t, n) {
          this.templateCacheData = t, this.salesbotCacheData = n
        },
        onSuggestionClick: function(e) {
          this._suggestionChoose({
            value: e.currentTarget.getAttribute("data-value"),
            type: e.currentTarget.getAttribute("data-suggestion-type"),
            id: e.currentTarget.getAttribute("data-id")
          })
        },
        onEditableDisable: function(e, t) {
          t = !r().isBoolean(t) || t, this._elem("editable").attr("contenteditable", !t)
        },
        onKeyDown: function(e) {
          var t;
          if (this._suggestions_exists) switch (e.keyCode) {
            case 40:
              e.preventDefault(), this._suggestionSetIndex(1);
              break;
            case 38:
              e.preventDefault(), this._suggestionSetIndex(-1);
              break;
            case 13:
            case 9:
              (t = o()("#contenteditable_suggestions").find(this._selector("suggestions_item_hovered"))).length && (e.preventDefault(), this._suggestionChoose({
                value: t.attr("data-value"),
                type: t.attr("data-suggestion-type"),
                id: t.attr("data-id")
              }))
          }
        },
        _checkMessageIndent: function() {
          var e, t = "",
            n = this._findElem("clearer"),
            i = this._findElem("editable"),
            o = i.children(),
            s = 1 === o.length && o.hasClass(this._class("interactive_placeholder"));
          n.is(":empty") || (!i.is(":empty") && !s || i.hasClass("feed-compose__message-attach") || i.hasClass("feed-compose__message-area") || i.hasClass("feed-compose__message-quotation") || (t = (e = n.width()) > 0 ? e + 5 : ""), this._findElem("editable").css("padding-left", t), this._findElem("input").val(this._getValue()).trigger("change"))
        },
        _putCursorToEnd: function() {
          var e = this._findElem("editable").get(0),
            t = document.createRange();
          t.selectNodeContents(e), t.collapse(!1);
          var n = window.getSelection();
          n.removeAllRanges(), n.addRange(t), e.scrollTop = "".concat(99999, "px"), this.el.scrollTop = "".concat(99999, "px")
        },
        _getValue: function(e) {
          var t = this._getInnerText(this._findElem("editable").get(0));
          return !1 === e ? t : t.trim()
        },
        _getInnerText: function(e) {
          for (var t = window.getSelection(), n = [], i = 0; i < t.rangeCount; i++) n[i] = t.getRangeAt(i);
          t.removeAllRanges(), t.selectAllChildren(e);
          var o = t.toString();
          t.removeAllRanges();
          for (var s = 0; s < n.length; s++) t.addRange(n[s]);
          return o || ""
        },
        _setSuggestions: function(e) {
          this._suggestions = e
        },
        _handleControlClicks: function(e) {
          var t = o()("#contenteditable_suggestions").get(0);
          t && !o().contains(t, e.target) && this._removeSuggestionsList()
        },
        _removeSuggestionsList: function() {
          this._suggestions_exists = !1, this._findElem("suggestions_hint").remove(), this.$el.removeClass(this._class("suggested")), o()("#contenteditable_suggestions").remove()
        },
        _suggestionChoose: function(e) {
          this._setText(e.value), this._checkMessageIndent(), this._findElem("input").trigger("suggestions:chose", {
            value: e.value,
            type: e.type,
            id: e.id
          }), this._removeSuggestionsList(), this._putCursorToEnd()
        },
        onPresetTextInsert: function(e, t) {
          this._setText(t)
        },
        _setText: function(e) {
          var t = this._findElem("editable");
          t.html(t.text(e).html().split("\n").join("<br/>"))
        },
        _suggestionSetIndex: function(e) {
          var t = o()("#contenteditable_suggestions").find(".custom-scroll"),
            n = t.find(this._selector("suggestions_item")),
            i = n.filter(r().bind((function(e, t) {
              return t.classList.contains(this._class("suggestions_item_hovered"))
            }), this)),
            s = n.index(i) + e;
          switch (s) {
            case -2:
            case -1:
              s = n.length - 1;
              break;
            case n.length:
              s = 0
          }
          o()(i).removeClass(this._class("suggestions_item_hovered")), n.eq(s).addClass(this._class("suggestions_item_hovered")), this._findElem("suggestions_hint").text(this._getSuggestionsHint(n.eq(s).text())), t.scrollTop(t.scrollTop() + n.eq(s).position().top + n.eq(s).height() - t.get(0).offsetHeight / 2), this._suggestions_exists = !0
        },
        _getSuggestionsHint: function(e) {
          var t = this._getValue(),
            n = new g.EscapedRegExp("(^|\\s)(${value}(.+)?)($|\\s)", {
              value: t
            }, "i"),
            i = e.match(n);
          return i ? [o().trim(i[0].replace(new g.EscapedRegExp("${value}", {
            value: t
          }, "i"), t)), e.replace(n, "")].join(" ") : ""
        },
        _normalizeLineEndings: function(e) {
          return e.replace(/\r\n?/g, "\n")
        }
      });
      var E = "../build/transpiled/interface/controls/contenteditable";
      window.define(E, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([E])
    },
    369500: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => l
      });
      var i = n(809228),
        o = n.n(i),
        s = n(210734),
        r = n(661533);

      function a(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }
      const l = s.default.extend({
        controlClassName: "js-control-copy-btn",
        _classes: function() {
          return {
            copy_btn: "js-copy-btn"
          }
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return (i = function() {
            return function(e, t) {
              var n, i, o, s, r = {
                label: 0,
                sent: function() {
                  if (1 & o[0]) throw o[1];
                  return o[1]
                },
                trys: [],
                ops: []
              };
              return s = {
                next: a(0),
                throw: a(1),
                return: a(2)
              }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
                return this
              }), s;

              function a(s) {
                return function(a) {
                  return function(s) {
                    if (n) throw new TypeError("Generator is already executing.");
                    for (; r;) try {
                      if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                      switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                        case 0:
                        case 1:
                          o = s;
                          break;
                        case 4:
                          return r.label++, {
                            value: s[1],
                            done: !1
                          };
                        case 5:
                          r.label++, i = s[1], s = [0];
                          continue;
                        case 7:
                          s = r.ops.pop(), r.trys.pop();
                          continue;
                        default:
                          if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                            r = 0;
                            continue
                          }
                          if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                            r.label = s[1];
                            break
                          }
                          if (6 === s[0] && r.label < o[1]) {
                            r.label = o[1], o = s;
                            break
                          }
                          if (o && r.label < o[2]) {
                            r.label = o[2], r.ops.push(s);
                            break
                          }
                          o[2] && r.ops.pop(), r.trys.pop();
                          continue
                      }
                      s = t.call(e, r)
                    } catch (e) {
                      s = [6, e], i = 0
                    } finally {
                      n = o = 0
                    }
                    if (5 & s[0]) throw s[1];
                    return {
                      value: s[0] ? s[1] : void 0,
                      done: !0
                    }
                  }([s, a])
                }
              }
            }(this, (function(e) {
              return s.default.prototype.initialize.apply(this, t), this._addComponent(o(), this._selector("copy_btn")).on("success", (function(e) {
                r(e.trigger).addClass("js-copied"), setTimeout((function() {
                  r(e.trigger).removeClass("js-copied")
                }), 800)
              })).on("error", (function(e) {
                r(e.trigger).addClass("animated shake"), setTimeout((function() {
                  r(e.trigger).removeClass("animated shake")
                }), 200)
              })), [2]
            }))
          }, function() {
            var e = this,
              t = arguments;
            return new Promise((function(n, o) {
              var s = i.apply(e, t);

              function r(e) {
                a(s, n, o, r, l, "next", e)
              }

              function l(e) {
                a(s, n, o, r, l, "throw", e)
              }
              r(void 0)
            }))
          }).apply(this);
          var i
        }
      });
      var c = "../build/transpiled/interface/controls/copy_button";
      window.define(c, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([c])
    },
    419982: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => i
      });
      const i = {
        "United States": "US",
        USA: "US",
        US: "US",
        Afghanistan: "AF",
        "Aland Islands": "AX",
        Albania: "AL",
        Algeria: "DZ",
        "American Samoa": "AS",
        Andorra: "AD",
        Angola: "AO",
        Anguilla: "AI",
        Antarctica: "AQ",
        "Antigua and Barbuda": "AG",
        Argentina: "AR",
        Armenia: "AM",
        Aruba: "AW",
        Australia: "AU",
        Austria: "AT",
        Azerbaijan: "AZ",
        Bahamas: "BS",
        Bahrain: "BH",
        Bangladesh: "BD",
        Barbados: "BB",
        Belarus: "BY",
        Belgium: "BE",
        Belize: "BZ",
        Benin: "BJ",
        Bermuda: "BM",
        Bhutan: "BT",
        Bolivia: "BO",
        "Bosnia and Herzegovina": "BA",
        Botswana: "BW",
        "Bouvet Island": "BV",
        Brazil: "BR",
        "British Antarctic Territory": "BQ",
        "British Indian Ocean Territory": "IO",
        "Brunei Darussalam": "BN",
        Bulgaria: "BG",
        "Burkina Faso": "BF",
        Burundi: "BI",
        Cambodia: "KH",
        Cameroon: "CM",
        Canada: "CA",
        "Canton and Enderbury Islands": "CT",
        "Cape Verde": "CV",
        "Cayman Islands": "KY",
        "Central African Republic": "CF",
        Chad: "TD",
        Chile: "CL",
        China: "CN",
        "Christmas Island": "CX",
        "Cocos [Keeling] Islands": "CC",
        Colombia: "CO",
        Comoros: "KM",
        Congo: "CG",
        "Congo, the Democratic Republic of the": "CD",
        "Cook Islands": "CK",
        "Costa Rica": "CR",
        Croatia: "HR",
        Cuba: "CU",
        Curacao: "CW",
        Cyprus: "CY",
        "Czech Republic": "CZ",
        "Cote d`Ivoire": "CI",
        Denmark: "DK",
        Djibouti: "DJ",
        Dominica: "DM",
        "Dominican Republic": "DO",
        "Dronning Maud Land": "NQ",
        "East Germany": "DD",
        Ecuador: "EC",
        Egypt: "EG",
        "El Salvador": "SV",
        "Equatorial Guinea": "GQ",
        Eritrea: "ER",
        Estonia: "EE",
        Ethiopia: "ET",
        "Falkland Islands (Malvinas)": "FK",
        "Faroe Islands": "FO",
        Fiji: "FJ",
        Finland: "FI",
        France: "FR",
        "French Guiana": "GF",
        "French Polynesia": "PF",
        "French Southern Territories": "TF",
        "French Southern and Antarctic Territories": "FQ",
        Gabon: "GA",
        Gambia: "GM",
        Georgia: "GE",
        Germany: "DE",
        Ghana: "GH",
        Gibraltar: "GI",
        Greece: "GR",
        Greenland: "GL",
        Grenada: "GD",
        Guadeloupe: "GP",
        Guam: "GU",
        Guatemala: "GT",
        Guernsey: "GG",
        Guinea: "GN",
        "Guinea-Bissau": "GW",
        Guyana: "GY",
        Haiti: "HT",
        "Heard Island and McDonald Islands": "HM",
        Honduras: "HN",
        "Hong Kong SAR China": "HK",
        Hungary: "HU",
        Iceland: "IS",
        India: "IN",
        Indonesia: "ID",
        "Iran, Islamic Republic of": "IR",
        Iraq: "IQ",
        Ireland: "IE",
        "Isle of Man": "IM",
        Israel: "IL",
        Italy: "IT",
        Jamaica: "JM",
        Japan: "JP",
        Jersey: "JE",
        "Johnston Island": "JT",
        Jordan: "JO",
        Kazakhstan: "KZ",
        Kenya: "KE",
        Kiribati: "KI",
        "Korea, Republic of": "KR",
        "Korea, Democratic People`s Republic of": "KP",
        Kuwait: "KW",
        Kyrgyzstan: "KG",
        "Lao People`s Democratic Republic": "LA",
        Latvia: "LV",
        Lebanon: "LB",
        Lesotho: "LS",
        Liberia: "LR",
        "Libyan Arab Jamahiriya": "LY",
        Liechtenstein: "LI",
        Lithuania: "LT",
        Luxembourg: "LU",
        "Macau SAR China": "MO",
        "Macedonia, The Former Yugoslav Republic Of": "MK",
        Madagascar: "MG",
        Malawi: "MW",
        Malaysia: "MY",
        Maldives: "MV",
        Mali: "ML",
        Malta: "MT",
        "Marshall Islands": "MH",
        Martinique: "MQ",
        Mauritania: "MR",
        Mauritius: "MU",
        Mayotte: "YT",
        "Metropolitan France": "FX",
        Mexico: "MX",
        "Micronesia, Federated States of": "FM",
        "Midway Islands": "MI",
        "Moldova, Republic of": "MD",
        Monaco: "MC",
        Mongolia: "MN",
        Montenegro: "ME",
        Montserrat: "MS",
        Morocco: "MA",
        Mozambique: "MZ",
        "Myanmar [Burma]": "MM",
        Namibia: "NA",
        Nauru: "NR",
        Nepal: "NP",
        Netherlands: "NL",
        "Netherlands Antilles": "AN",
        "Neutral Zone": "NT",
        "New Caledonia": "NC",
        "New Zealand": "NZ",
        Nicaragua: "NI",
        Niger: "NE",
        Nigeria: "NG",
        Niue: "NU",
        "Norfolk Island": "NF",
        "North Vietnam": "VD",
        "Northern Mariana Islands": "MP",
        Norway: "NO",
        Oman: "OM",
        "Pacific Islands Trust Territory": "PC",
        Pakistan: "PK",
        Palau: "PW",
        "Palestinian Territory, Occupied": "PS",
        Panama: "PA",
        "Panama Canal Zone": "PZ",
        "Papua New Guinea": "PG",
        Paraguay: "PY",
        "People`s Democratic Republic of Yemen": "YD",
        Peru: "PE",
        Philippines: "PH",
        "Pitcairn Islands": "PN",
        Poland: "PL",
        Portugal: "PT",
        "Puerto Rico": "PR",
        Qatar: "QA",
        Romania: "RO",
        Russia: "RU",
        Rwanda: "RW",
        Reunion: "RE",
        "Saint Barthelemy": "BL",
        "Saint Helena": "SH",
        "Saint Kitts and Nevis": "KN",
        "Saint Lucia": "LC",
        "Saint Martin": "MF",
        "Saint Pierre and Miquelon": "PM",
        "Saint Vincent and the Grenadines": "VC",
        Samoa: "WS",
        "San Marino": "SM",
        "Saudi Arabia": "SA",
        Senegal: "SN",
        Serbia: "RS",
        "Serbia and Montenegro": "CS",
        Seychelles: "SC",
        "Sierra Leone": "SL",
        Singapore: "SG",
        Slovakia: "SK",
        Slovenia: "SI",
        "Solomon Islands": "SB",
        Somalia: "SO",
        "South Africa": "ZA",
        "South Georgia and the South Sandwich Islands": "GS",
        Spain: "ES",
        "Sri Lanka": "LK",
        Sudan: "SD",
        Suriname: "SR",
        "Svalbard and Jan Mayen": "SJ",
        Swaziland: "SZ",
        Sweden: "SE",
        Switzerland: "CH",
        "Syrian Arab Republic": "SY",
        "Sao Tome and Principe": "ST",
        Taiwan: "TW",
        Tajikistan: "TJ",
        "Tanzania, United Republic of": "TZ",
        Thailand: "TH",
        "Timor-Leste": "TL",
        Togo: "TG",
        Tokelau: "TK",
        Tonga: "TO",
        "Trinidad and Tobago": "TT",
        Tunisia: "TN",
        Turkey: "TR",
        Turkmenistan: "TM",
        "Turks and Caicos Islands": "TC",
        Tuvalu: "TV",
        "United States Minor Outlying Islands": "UM",
        "U.S. Miscellaneous Pacific Islands": "PU",
        Uganda: "UG",
        Ukraine: "UA",
        "Union of Soviet Socialist Republics": "SU",
        "United Arab Emirates": "AE",
        "United Kingdom": "GB",
        "Unknown or Invalid Region": "ZZ",
        Uruguay: "UY",
        Uzbekistan: "UZ",
        Vanuatu: "VU",
        "Holy See (Vatican City State)": "VA",
        Venezuela: "VE",
        "Viet Nam": "VN",
        "Virgin Islands, British": "VG",
        "Virgin Islands, U.S.": "VI",
        "Wake Island": "WK",
        "Wallis and Futuna": "WF",
        "Western Sahara": "EH",
        Yemen: "YE",
        Zambia: "ZM",
        Zimbabwe: "ZW"
      };
      var o = "../build/transpiled/interface/controls/country_map";
      window.define(o, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([o])
    },
    872200: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => f
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(161320),
        l = n.n(a),
        c = n(49987),
        u = n(727526),
        d = n(403474),
        h = n(661533),
        p = !1;
      const f = u.default.extend({
        controlClassName: "js-control-date-customers",
        _getDefaults: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return o().extend({}, u.default.prototype._getDefaults.apply(this, t), {
            selected: this._findElem("input").val()
          })
        },
        _preloadMonthsTemplate: function() {
          return p ? new Promise((function(e) {
            e()
          })) : (p = !0, r()._preload(["/tmpl/controls/select.twig"])())
        },
        _monthsTemplate: function(e) {
          var t, n = r()({
              ref: "/tmpl/controls/select.twig"
            }),
            i = 0,
            s = [];
          (e = e || this.kalendae.getSelectedRaw()[0]) && (i = e.startOf("month").diff(l()().startOf("month"), "months")), i < 0 ? s = o().union([i], o().range(0, 58)) : (t = i - 30 > 0 ? i - 30 : 0, s = o().range(t, t + 59)), this._findElem("months_wrapper").remove(), this._findElem("input").after(o().template('<div class="'.concat(this._class("months_wrapper"), '">').concat(n.render({
            class_name: "customers-date__months-select",
            input_special_class: "js-form-changes-skip js-customers-date-months",
            selected: i,
            items: o().map(s, (function(e) {
              return {
                id: e,
                option: l()().add(e, "month").format("MMMM YYYY")
              }
            }))
          }), "</div>")))
        },
        _getKalendaeHandler: function() {
          return d
        },
        _classes: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return o().extend({}, u.default.prototype._classes.apply(this, t), {
            input: "js-customers-date-date-input",
            input_not_valid: "date_field_not-valid",
            months_wrapper: "customers-date__months",
            months_input: "js-customers-date-months"
          })
        },
        events: function() {
          var e = o().extend({}, o().result(u.default.prototype, "events", {}));
          return e["input ".concat(this._selector("input"))] = "_onDateInput", e["blur ".concat(this._selector("input"))] = "reformatOnBlur", e["controls:change ".concat(this._selector("months_input"))] = "_setCalendarMonthOnSelectChange", e["keyup ".concat(this._selector("input"))] = "_hideCalendarOnEnterKey", e
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          u.default.prototype.initialize.apply(this, t), this.container()
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          u.default.prototype.destroy.apply(this, t), this.$container && (this._findElem("months_wrapper").remove(), this.$container.remove())
        },
        container: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var i, s = this;
          return this.$container || (u.default.prototype.container.apply(this, t), i = this.kalendae.draw, this.kalendae.draw = function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            var o = i.apply(this, t);
            return s._addTwoWeeks(), o
          }, this._preloadMonthsTemplate().then(o().bind((function() {
            var e = this._findElem("input").val();
            e && this.kalendae.setSelected(e), this._monthsTemplate(), this._addTwoWeeks()
          }), this))), this.$container
        },
        _hideCalendarOnEnterKey: function(e) {
          13 !== e.keyCode || this._findElem("input").hasClass(this._class("input_not_valid")) || (this._findElem("input").val(this._findElem("input").val()).trigger("controls:change", [this._findElem("input").val()]), this.$el.trigger("control:date:selected"))
        },
        _setCalendarMonthOnSelectChange: function() {
          var e = this._findElem("months_input");
          this.updateCalendarView(l()().add(e.val(), "months")), this._monthsTemplate(this.kalendae.viewStartDate)
        },
        _onDateInput: function() {
          var e = this._findElem("input").val();
          this.validateSelected() && e.length > 5 && (e = l()(e, (0, c.format)("parse")).format((0, c.format)("date")), this.kalendae.setSelected(e)), this._findElem("input").trigger("controls:change", [e])
        },
        onDateClickedSingle: function(e) {
          u.default.prototype.onDateClickedSingle.apply(this, arguments), this._findElem("input").trigger("controls:change", [e.format(APP.system.format.date.date)]), this.$el.trigger("control:date:selected")
        },
        onChangeSingle: function() {
          this.kalendae && (this.validateSelected(), this._monthsTemplate())
        },
        updateCalendarView: function(e) {
          this.kalendae.viewStartDate = e, this.kalendae.draw()
        },
        validateSelected: function() {
          var e = !0,
            t = l()(this._findElem("input").val(), (0, c.format)("parse"));
          return this._findElem("input").removeClass(this._class("input_not_valid")), (!t.isValid() || t.format("X") < 0) && (e = !1, this._findElem("input").addClass(this._class("input_not_valid"))), e
        },
        _addTwoWeeks: function() {
          var e = h(this.kalendae.container),
            t = {
              prepend: o().range(1, 8, 1).reverse(),
              append: o().range(1, 8, 1)
            };
          e.find(".k-fake-date").remove();
          var n = e.find(".k-days span"),
            i = "YYYY-MM-DD",
            s = l()(n.first().attr("data-date"), i);
          s.month() === this.kalendae.viewStartDate.month() && (s.subtract(1, "month").endOf("month"), t.append = !1);
          var r = l()(n.last().attr("data-date"), i);
          r.month() === this.kalendae.viewStartDate.month() && (s.add(1, "month").startOf("month"), t.prepend = !1), o().each(t, (function(t, a) {
            t && e.find(".k-days")[a](o().map(t, (function(e) {
              var t = ("prepend" === a ? s : r).clone()["prepend" === a ? "subtract" : "add"](e, "days");
              return n.first().clone().removeClass("k-in-month k-selected").addClass("k-out-of-month k-fake-date").attr("data-date", t.format(i)).text(t.format("D")).get(0).outerHTML
            })).join(""))
          }), this)
        }
      });
      var _ = "../build/transpiled/interface/controls/customers/date";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
    },
    610102: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => h
      });
      var i = n(629133),
        o = n.n(i),
        s = n(661533),
        r = n.n(s),
        a = n(161320),
        l = n.n(a),
        c = n(49987),
        u = n(445368),
        d = n(210734);
      n(872200);
      const h = d.default.extend({
        controlClassName: "js-control-purchase",
        _classes: function() {
          return {
            customers_date_control: "js-control-date-customers",
            caption: "customers-date__caption",
            value: "customers-date__caption-value",
            title: "customers-date__caption-title",
            focuser: "customers-date__caption-focuser",
            not_valid: "customers-date__caption-value_not-valid",
            date_input: "js-customers-date-date-input",
            list: "customers-date__list",
            purchase_button: "js-purchase-button"
          }
        },
        document_events: function() {
          return {
            "controls:hide:private": "_hideOnClickOutside"
          }
        },
        events: function() {
          var e = {};
          return e["click ".concat(this._selector("caption"))] = "_openOnClick", e["keyup ".concat(this._selector("focuser"))] = "_openWhenFocused", e
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          d.default.prototype.initialize.apply(this, t), this._$body_control = this._elem("list"), this._$body_control.on("controls:change", this._selector("date_input"), o().bind(this._onDateInputChange, this)).on("control:date:selected", this._selector("customers_date_control"), o().bind(this._hide, this)).on("click", this._selector("purchase_button"), o().bind(this._hide, this)), this._onDateInputChange({}, this._elem("date_input").val()), this._$window.on("resize".concat(this.ns), o().bind(this._setPositions, this))
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this._$body_control.off(), d.default.prototype.destroy.apply(this, t)
        },
        _onDateInputChange: function(e, t) {
          var n, i = l()(t, (0, c.format)("parse")),
            s = t && i.isBefore(l()().startOf("day")),
            r = (0, u.i18n)("Next purchase");
          i.isValid() && (t = i.format(APP.system.format.date.date)), o().each({
            yesterday: -1,
            today: 0,
            tomorrow: 1
          }, (function(e, n) {
            i.startOf("day").isSame(l()().startOf("day").add(e, "days")) && (t = l()().format(l()().localeData().calendar(n)))
          })), s && (r = (0, u.i18n)("Did not purchase"), (n = Math.abs(l()().startOf("day").diff(i.startOf("day"), "days"))) < 5e3 && (t += " (".concat((0, u.numeralWord)(n, (0, u.i18n)("day,days,days,days"), !0), ")"))), this._elem("title").text(r), this._elem("value").toggleClass(this._class("not_valid"), s).text(t || "")
        },
        _openWhenFocused: function(e) {
          var t = null === e.which ? e.keyCode : e.which,
            n = t < 32 ? null : String.fromCharCode(t);
          (-1 !== o().indexOf([13, 8], e.keyCode) || /[0-9/.]/.test(n)) && this._openOnClick(e)
        },
        _openOnClick: function(e) {
          this._$body_control.hasClass("expanded") || this._$document.trigger({
            type: "controls:hide",
            target: this.el
          }), this._$body_control.hasClass("expanded") ? this._hide() : this._show(), e.stopPropagation()
        },
        _hideOnClickOutside: function(e) {
          this._$body_control.hasClass("expanded") && !r().contains(this._$body_control.get(0), e.target) && this._hide()
        },
        _show: function() {
          var e;
          this._$body_control.addClass("expanded"), this._toggleBodyOverlay(this._$body_control, this._hide), this._setPositions(), APP.is_touch_device || (e = this._$body_control.find(this._selector("date_input"))).val(e.val()).focus()
        },
        _hide: function() {
          this._toggleBodyOverlay(!1), this._$body_control.removeClass("expanded");
          var e = this._findElem("date_input"),
            t = l()(e.val(), (0, c.format)("parse"));
          t.isValid() && e.val(t.format(APP.system.format.date.date)), this.$el.find(":input").trigger("change"), this._findElem("focuser").focus()
        },
        _setPositions: function() {
          var e = this.$el.offset();
          this._$body_control.removeClass("h-at-top").css({
            top: e.top,
            left: e.left,
            zIndex: this._maxControlBodyZIndex
          }), !APP.data.current_list || APP.data.is_card || this._$body_control.visible() || this._$body_control.addClass("h-at-top")
        }
      });
      var p = "../build/transpiled/interface/controls/customers/purchase";
      window.define(p, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([p])
    },
    397051: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => w
      });
      var i = n(661533),
        o = n.n(i),
        s = n(161320),
        r = n.n(s),
        a = n(629133),
        l = n.n(a),
        c = n(926168),
        u = n(445368),
        d = n(210734);

      function h(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function p(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function f(e, t, n) {
        return f = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = _(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, f(e, t, n || e)
      }

      function _(e) {
        return _ = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, _(e)
      }

      function g(e, t) {
        return g = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, g(e, t)
      }

      function m(e) {
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
          var n, i = _(e);
          if (t) {
            var o = _(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var v = {
          start: -1,
          end: 5
        },
        y = {
          start: 0,
          end: 6
        },
        b = function(e) {
          ! function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && g(e, t)
          }(a, e);
          var t, n, i, s = m(a);

          function a() {
            return function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, a), s.apply(this, arguments)
          }
          return t = a, n = [{
            key: "initialize",
            value: function() {
              this._opened = !1, this.save_overflow = this.$el.data("save-overflow"), this.$el_in_body = o()(), f(_(a.prototype), "initialize", this).apply(this, arguments)
            }
          }, {
            key: "destroy",
            value: function() {
              this.save_overflow && this._findElem("main_dropdown").off(), this._$document.off("controls:hide:private.".concat(this.ns)), f(_(a.prototype), "destroy", this).apply(this, arguments)
            }
          }, {
            key: "events",
            value: function() {
              var e;
              return p(e = {
                "click .date_filter__head": "open",
                'change .date_filter__param__toggler input[type="radio"]': "onSwitcherChange",
                "controls:change [class^=date_field__range_]": "onChangeRange",
                "controls:change .date_field__preset": "fillPreset",
                "date-filter:clear": "onRangeClear",
                "click .date_filter__period_range__options": "onClickStopPropagation"
              }, "click ".concat(this._selector("preset_item")), "choosePreset"), p(e, "click ".concat(this._selector("past_x_days_wrapper")), "onClickStopPropagation"), p(e, "input ".concat(this._selector("past_x_days_input")), "inputDaysPastXDays"), p(e, "date-filter:date-change ".concat(this._selector("range_wrapper")), "onAbsoluteDateValueChange"), p(e, "click ".concat(this._selector("switcher_item")), "onSwitcherClick"), p(e, "focus ".concat(this._selector("main_range")), "onMainDateInputFocus"), p(e, "blur ".concat(this._selector("main_range")), "onMainDateInputBlur"), p(e, "controls:date:done ".concat(this._selector("main_range")), "onMainDateInputDone"), p(e, "click ".concat(this._selector("custom_period_value")), "onClickStopPropagation"), p(e, "input ".concat(this._selector("custom_period_value")), "inputDays"), p(e, "keydown ".concat(this._selector("custom_period_value")), "inputDaysKeydown"), p(e, "focus ".concat(this._selector("custom_period_value")), "inputDaysFocus"), p(e, "blur ".concat(this._selector("custom_period_value")), "inputDaysBlur"), e
            }
          }, {
            key: "document_events",
            value: function() {
              return {
                "controls:hide:private": "documentTriggerHide"
              }
            }
          }, {
            key: "delegateEvents",
            value: function() {
              var e = this,
                t = this.save_overflow ? this._findElem("main_dropdown") : this.$el;
              return this._$document.on("controls:hide:private.".concat(this.ns), l().bind(this.documentTriggerHide, this)), l().each(l().result(this, "events"), (function(n, i) {
                var o = i.match(/^(\S+)\s*(.*)$/),
                  s = "".concat(o[1], ".delegateEvents").concat(e.cid),
                  r = o[2];
                t.find(r).length ? t.on(s, r, l().bind(e[n], e)) : e.$el.on(s, r, l().bind(e[n], e))
              })), this
            }
          }, {
            key: "_findElem",
            value: function(e) {
              var t = d.default.prototype._findElem.apply(this, arguments);
              return !t.length && this.save_overflow && this.$el_in_body.length ? this.$el_in_body.find(this._selector(e)) : t
            }
          }, {
            key: "_selectors",
            value: function() {
              return {
                main_dropdown: ".date_filter__dropdown",
                main_input: ".js-date-filter-input",
                period: ".date_filter__period",
                custom_period_value: ".js-date_filter__period_item",
                first_switcher_input: ".control-toggler__item.first input",
                range_wrapper: ".date_field_wrapper",
                main_range: ".date_field",
                range_clear: ".date_field--clear",
                checked_switcher_input: '.control-toggler__item input[type="radio"]:checked',
                range_fields: "[class ^= date_field__range_]",
                preset: ".date_field__preset",
                preset_item_by_id: '.date_filter__period_item[data-period="%s"]',
                dropdown_icon: ".date_filter__head__dropdown_icon",
                past_x_days_wrapper: ".date_filter__period_item-past_x_days-wrapper",
                past_x_days_input: ".date_filter__period_item-past_x_days-input",
                past_x_days_period: ".past_x_days-period"
              }
            }
          }, {
            key: "_classes",
            value: function() {
              return {
                selected_switcher: "control-toggler__item-selected",
                save_overflow: "date_filter__save-overflow",
                filter_item: "filter__custom_settings__item",
                to_top: "date_filter__dropdown_to-top",
                preset_item: "date_filter__period_item",
                preset_item_selected: "date_filter__period_item_selected",
                switcher_item: "control-toggler__item",
                dropdown_icon_up: "date_filter__head__dropdown_icon--up"
              }
            }
          }, {
            key: "onAbsoluteDateValueChange",
            value: function(e, t) {
              (this._findElem("preset").length ? this._findElem("preset") : this.$el_in_body.find(this._selector("preset"))).val("").trigger("change"), this.clearPresetAndDateTitle(t)
            }
          }, {
            key: "documentTriggerHide",
            value: function(e) {
              if (this._opened) {
                var t = o()(e.target);
                o().contains(this.save_overflow && this.$el_in_body.length ? this.$el_in_body.get(0) : this._findElem("main_dropdown").get(0), e.target) || t.closest(".kalendae").length || this.hide()
              }
            }
          }, {
            key: "onClickStopPropagation",
            value: function(e) {
              e.stopPropagation()
            }
          }, {
            key: "clear",
            value: function() {
              this._findElem("preset").val("").trigger("controls:change")
            }
          }, {
            key: "open",
            value: function(e) {
              e.stopPropagation(), this._$document.trigger({
                type: "controls:hide",
                target: e.currentTarget
              }), this._opened || (this._opened = !0, this._findElem("main_dropdown").toggle(), this._elem("custom_period_value").trigger("autosize:important"), this.toggleDropdownIcon(!0), this.save_overflow && this.openInBody())
            }
          }, {
            key: "onSwitcherChange",
            value: function(e) {
              var t = o()(e.currentTarget).closest("label"),
                n = t.text().trim() || t.attr("data-label");
              e.currentTarget.checked ? (this._findElem("selected_switcher").removeClass(this._class("selected_switcher")), t.addClass(this._class("selected_switcher")), t.hasClass("first") ? this._findElem("period").removeAttr("data-switcher-text") : this._findElem("period").attr("data-switcher-text", n)) : t.hasClass("first") || this._findElem("first_switcher_input").prop("checked", !0).trigger("change")
            }
          }, {
            key: "onSwitcherClick",
            value: function(e) {
              e.stopPropagation()
            }
          }, {
            key: "onChangeRange",
            value: function(e) {
              var t = o()(e.currentTarget),
                n = t.val();
              this._elem("main_range").trigger("controls:date").data("kalendae") ? this.selectedKalendaeOptions(t, n) : this._elem("range_wrapper").one("controls:view:init", l().bind((function() {
                this.selectedKalendaeOptions(t, n)
              }), this))
            }
          }, {
            key: "onMainDateInputFocus",
            value: function() {
              this._kalendae_showed || (this.toggleKalendaeInputOverlay(!0), this._kalendae_showed = !0)
            }
          }, {
            key: "onMainDateInputDone",
            value: function() {
              this._kalendae_showed = !1, this.toggleKalendaeInputOverlay(!1), this.hide()
            }
          }, {
            key: "onMainDateInputBlur",
            value: function() {
              var e = this;
              setTimeout((function() {
                e._kalendae_showed = !1, e.toggleKalendaeInputOverlay(!1)
              }), 200)
            }
          }, {
            key: "toggleKalendaeInputOverlay",
            value: function(e) {
              var t = this;
              if (e) {
                var n = this._findElem("main_range"),
                  i = n.offset(),
                  s = n.trigger("controls:date").data("kalendae"),
                  r = s ? o()(s.container).css("z-index") : this._maxControlBodyZIndex;
                this._$kalendae_overlays = o()(), l().each(["before", "after"], (function(e) {
                  var n = o()('<div class="default-overlay date_filter__overlay default-overlay-visible" style="background: none; z-index: '.concat(r, ';"></div>'));
                  "before" === e ? n.css({
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: "auto",
                    height: i.top
                  }) : n.css({
                    top: i.top + t._findElem("range_wrapper").height(),
                    right: 0,
                    bottom: 0,
                    left: 0
                  }), document.body.insertBefore(n.get(0), s ? s.container : null), t._$kalendae_overlays = t._$kalendae_overlays.add(n)
                }))
              } else this._$kalendae_overlays && (this._$kalendae_overlays.remove(), this._$kalendae_overlays = null)
            }
          }, {
            key: "clearPresetAndDateTitle",
            value: function(e) {
              this._findElem("preset_item").removeClass(this._class("preset_item_selected")), this._findElem("period").text(e || this._findElem("period").attr("data-before"))
            }
          }, {
            key: "inputDaysPastXDays",
            value: function(e) {
              var t = o()(e.currentTarget),
                n = Number(t.val()),
                i = Number(t.attr("max"));
              switch (!0) {
                case n < 0:
                  n = 0;
                  break;
                case n > i:
                  n = i
              }
              t.val(n), t.trigger("autosize:important"), this._findElem("range_fields").first().val(""), this._findElem("range_fields").last().val(""), this._findElem("preset").val("previous_days_" + n).trigger("change");
              var s = APP.system.timezone,
                a = n > 365 ? APP.system.format.date.date : APP.system.format.date.date_short,
                l = [r()().tz(s).subtract(n, "days").format(a), (0, u.i18n)("Today")].join(" - ");
              this._findElem("past_x_days_period").text("(".concat(l, ")"))
            }
          }, {
            key: "inputDays",
            value: function(e) {
              var t = o()(e.currentTarget),
                n = Number(t.val()),
                i = Number(t.attr("max"));
              switch (!0) {
                case n < 0:
                  n = 0;
                  break;
                case n > i:
                  n = i
              }
              t.val(n), t.trigger("autosize:important")
            }
          }, {
            key: "inputDaysKeydown",
            value: function(e) {
              13 === e.keyCode && o()(e.currentTarget).closest(".date_filter__period_item").trigger("click")
            }
          }, {
            key: "inputDaysFocus",
            value: function() {
              this._days_x_focused = !0
            }
          }, {
            key: "inputDaysBlur",
            value: function() {
              var e = this;
              setTimeout((function() {
                e._days_x_focused = !1
              }), 200)
            }
          }, {
            key: "inputDaysApply",
            value: function() {
              this._days_x_focused = !1, this._elem("custom_period_value").closest(".date_filter__period_item").click()
            }
          }, {
            key: "inputDaysFill",
            value: function(e) {
              if (0 === e) this.choosePreset({
                currentTarget: this._findElem("preset_item_by_id", "today")
              });
              else if (1 === e) this.choosePreset({
                currentTarget: this._findElem("preset_item_by_id", "yesterday")
              });
              else if (e > 1) {
                var t = APP.system.timezone,
                  n = e > 365 ? APP.system.format.date.date : APP.system.format.date.date_short,
                  i = [r()().tz(t).subtract(e, "days").format(n), (0, u.i18n)("Today")].join(" - ");
                this._findElem("preset_item_by_id", "past_x_days").addClass(this._class("preset_item_selected")), this.hide(), this._findElem("range_fields").first().val(""), this._findElem("range_fields").last().val(""), this._findElem("preset").val("previous_days_" + e).trigger("change"), this._findElem("range_fields").trigger("change");
                var s = (0, u.numeralWord)(e, (0, u.i18n)("Last %s days (numeral)")).split("%s");
                this._findElem("period").text("").prepend(o()('<span class="date_filter__period__past_x_days-wrapper">' + "<p>".concat(s[0], "</p>") + '<div class="date_filter__period_item-input-days-wrapper date_filter__period_item-past_x_days-wrapper">' + '<input class="date_filter__period_item-input-days date_filter__period_item-past_x_days-input js-date_filter__period_item js-control-autosized_input" data-comfort-zone="1" type="number" value="'.concat(e, '" max="999" />') + " </div>" + "<p>".concat(s[1], '</p> <p class="past_x_days-period">(').concat(i, ")</p>") + "</span>")), this._findElem("main_input").val("")
              }
            }
          }, {
            key: "findPresetElem",
            value: function(e) {
              return this._findElem("preset_item_by_id", e)
            }
          }, {
            key: "fillPreset",
            value: function(e) {
              var t = o()(e.currentTarget).val(),
                n = parseInt(t.replace("previous_days_", ""));
              n >= 0 ? (this._elem("custom_period_value").val(n), this.inputDaysFill(n)) : t ? this.choosePreset(l().extend(e, {
                currentTarget: this.findPresetElem(t)
              })) : this.clearPresetAndDateTitle()
            }
          }, {
            key: "choosePreset",
            value: function(e) {
              var t = o()(e.currentTarget),
                n = APP.system.timezone,
                i = parseInt(r()().tz(n).quarter()),
                s = APP.system.format.date.date_short,
                a = "pt" === (0, c.getLangId)() ? v : y,
                l = t.attr("data-period") || this._findElem("preset").val(),
                d = this._findElem("period").attr("data-before");
              switch (this._findElem("preset_item").removeClass(this._class("preset_item_selected")), l) {
                case "tomorrow":
                  d = r()().tz(n).add("days", 1).format(s), d += " - " + (0, u.i18n)("Tomorrow");
                  break;
                case "today":
                case "day":
                case "current_day":
                  l = "current_day", d = r()().tz(n).format(s);
                  break;
                case "yesterday":
                  l = "yesterday", d = r()().tz(n).subtract(1, "day").format(s);
                  break;
                case "week":
                case "this_week":
                case "current_week":
                  l = "current_week", d = [r()().tz(n).weekday(a.start).format(s), r()().tz(n).weekday(a.end).format(s)].join(" - ");
                  break;
                case "month":
                case "this_month":
                case "current_month":
                  l = "current_month", d = [r()().tz(n).startOf("month").format(s), r()().tz(n).endOf("month").format(s)].join(" - ");
                  break;
                case "quarter":
                case "this_quarter":
                case "current_quarter":
                  l = "current_quarter", d = [r()().tz(n).month(3 * i - 3).startOf("month").format(s), r()().tz(n).month(3 * i - 1).endOf("month").format(s)].join(" - ");
                  break;
                case "last_6_months":
                  d = [r()().tz(n).subtract(5, "months").startOf("month").format(s), r()().tz(n).endOf("month").format(s)].join(" - ");
                  break;
                case "year":
                case "current_year":
                  l = "current_year", d = [r()().tz(n).startOf("year").format(s), r()().tz(n).endOf("year").format(s)].join(" - ");
                  break;
                case "previous_week":
                  l = "previous_week", d = [r()().tz(n).subtract(1, "week").weekday(a.start).format(s), r()().tz(n).subtract(1, "week").weekday(a.end).format(s)].join(" - ");
                  break;
                case "previous_month":
                  l = "previous_month", d = [r()().tz(n).subtract(1, "month").startOf("month").format(s), r()().tz(n).subtract(1, "month").endOf("month").format(s)].join(" - ");
                  break;
                case "previous_quarter":
                  d = [r()().tz(n).subtract(1, "quarter").startOf("quarter").format(s), r()().tz(n).subtract(1, "quarter").endOf("quarter").format(s)].join(" - ");
                  break;
                case "previous_year":
                  d = [r()().tz(n).subtract(1, "year").startOf("year").format(s), r()().tz(n).subtract(1, "year").endOf("year").format(s)].join(" - ");
                  break;
                case "next_3_days":
                  d = [r()().tz(n).format(s), r()().tz(n).add("days", 3).format(s)].join(" - ");
                  break;
                case "next_week":
                  d = [r()().tz(n).add("week", 1).weekday(a.start).format(s), r()().tz(n).add("week", 1).weekday(a.end).format(s)].join(" - ");
                  break;
                case "next_month":
                  d = [r()().tz(n).add("month", 1).startOf("month").format(s), r()().tz(n).add("month", 1).endOf("month").format(s)].join(" - ");
                  break;
                case "next_quarter":
                  d = [r()().tz(n).add("quarter", 1).startOf("quarter").format(s), r()().tz(n).add("quarter", 1).endOf("quarter").format(s)].join(" - ");
                  break;
                case "any_time":
                case "ignore":
                  l = "any_time", d = t.find("span").attr("title"), this._findElem("range_fields").val(""), this._findElem("period").text(d);
                  break;
                case "last_3_days":
                case "past_3_days":
                  l = "last_3_days", d = [r()().tz(n).subtract(2, "days").format(s), r()().tz(n).format(s)].join(" - ");
                  break;
                case "past_x_days":
                  return void this.inputDaysFill(Number(t.find(".js-date_filter__period_item").val()))
              }
              this.hide(), t.addClass(this._class("preset_item_selected")), this._findElem("preset").val(l).trigger("change"), this._findElem("range_fields").val("").trigger("change"), this._findElem("period").text("".concat(t.text(), " (").concat(d, ")")), this._findElem("main_input").val("")
            }
          }, {
            key: "onRangeClear",
            value: function() {
              this._findElem("main_range").val("").trigger("controls:change"), this._findElem("preset").val("").trigger("change"), this._findElem("range_fields").val("").trigger("controls:change").trigger("change"), this.clearPresetAndDateTitle()
            }
          }, {
            key: "openInBody",
            value: function() {
              var e = this.$el.offset(),
                t = this._findElem("main_dropdown"),
                n = t.width(),
                i = this.$el.width();
              this.$el_in_body = t.css({
                top: e.top + this.$el.height(),
                left: e.left,
                width: Math.max(n, i),
                marginTop: ""
              }).removeClass(this._class("to_top")).addClass(this.class_list), this._toggleBodyOverlay(t, this.hide), this.$el_in_body.visible() || t.css("margin-top", -this.$el.height()).addClass(this._class("to_top"))
            }
          }, {
            key: "class_list",
            get: function() {
              return [this._class("save_overflow"), this._class("filter_item"), this._findElem("main_dropdown").data("class-to-body")].join(" ")
            }
          }, {
            key: "hide",
            value: function() {
              if (!this._opened || this._kalendae_showed) return !1;
              this._days_x_focused ? this.inputDaysApply() : (this.save_overflow && (this.$el_in_body = o()(), this._toggleBodyOverlay(!1), this._findElem("main_dropdown").css({
                top: "",
                left: "",
                width: ""
              }), this._findElem("main_dropdown").removeClass(this.class_list), this._findElem("selected_switcher").find("input").trigger("change"), this._findElem("preset").trigger("change"), this._findElem("range_fields").trigger("change"), this._findElem("main_range").trigger("change")), this.toggleKalendaeInputOverlay(!1), this.toggleDropdownIcon(!1), this._findElem("main_dropdown").hide(), this._opened = !1)
            }
          }, {
            key: "toggleDropdownIcon",
            value: function(e) {
              this._elem("dropdown_icon").toggleClass(this._class("dropdown_icon_up"), e)
            }
          }, {
            key: "selectedKalendaeOptions",
            value: function(e, t) {
              var n = this._elem("main_range").trigger("controls:date").data("kalendae");
              n && (e.val(t), t ? n.addSelected(t) : (n.setSelected(""), e.val() && e.val("")), n.getSelected().toString().length ? this._elem("range_clear").show() : this._elem("range_clear").hide(), this._findElem("preset_item").removeClass("preset_item_selected"), o()(n.input).trigger("controls:change", [n.getSelected()]), this._elem("checked_switcher_input").trigger("change"))
            }
          }, {
            key: "getDateString",
            value: function(e) {
              var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : APP.system.format.date.date,
                n = e.getSelectedRaw(),
                i = "";
              return l().isUndefined(n) || (1 === n.length ? i = n[0].isBefore(r()().tz(APP.system.timezone)) ? "".concat(n[0].format(t), " - ").concat((0, u.i18n)("Today")) : n[0].format(t) : 2 === n.length && (i = n[0].format(t) === r()([1, 0, 1]).format(t) ? "".concat((0, u.i18n)("deals to").charAt(0).toUpperCase()).concat((0, u.i18n)("deals to").substr(1), " ").concat(n[1].format(t)) : e.getSelectedAsText().join(" - "))), i
            }
          }, {
            key: "getKalendae",
            value: function() {
              return this._findElem("main_input").data("kalendae")
            }
          }], i = [{
            key: "controlClassName",
            get: function() {
              return "js-control-date-filter"
            }
          }], n && h(t.prototype, n), i && h(t, i), a
        }(d.default);
      b.extend(b);
      const w = b;
      var P = "../build/transpiled/interface/controls/date_range";
      window.define(P, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([P])
    },
    351532: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => g
      });
      var i = n(629133),
        o = n.n(i),
        s = n(161320),
        r = n.n(s),
        a = n(397051),
        l = n(661533);

      function c(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
      }

      function u(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function d(e, t, n) {
        return d = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = h(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, d(e, t, n || e)
      }

      function h(e) {
        return h = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, h(e)
      }

      function p(e, t) {
        return p = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, p(e, t)
      }

      function f(e) {
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
          var n, i = h(e);
          if (t) {
            var o = h(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? c(e) : t;
            var n
          }(this, n)
        }
      }
      var _ = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && p(e, t)
        }(a, e);
        var t, n, i, s = f(a);

        function a() {
          var e, t, n, i;
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, a), t = c(e = s.apply(this, arguments)), n = "systemDateFormat", i = APP.system.format.date.full, n in t ? Object.defineProperty(t, n, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : t[n] = i, e
        }
        return t = a, n = [{
          key: "events",
          value: function() {
            var e = d(h(a.prototype), "events", this).apply(this, arguments);
            return e["date-time-filter:date-change ".concat(this._selector("range_wrapper"))] = "onAbsoluteDateValueChange", e["controls:change ".concat(this._selector("date_time_input_first"))] = "onAbsoluteDateValueChange", e["controls:change ".concat(this._selector("date_time_input_second"))] = "onAbsoluteDateValueChange", e
          }
        }, {
          key: "_selectors",
          value: function() {
            return o().extend({}, d(h(a.prototype), "_selectors", this).call(this), {
              filter_head: ".date_filter__head",
              filter_period_control: ".date_filter__period_range__options",
              date_time_input_first: ".date_field_with-time_range-input_first",
              date_time_input_second: ".date_field_with-time_range-input_second",
              date_time_input_overlay: ".filter__custom_settings__item__value-wrapper",
              dateFilterDropdown: ".date_filter__dropdown"
            })
          }
        }, {
          key: "_classes",
          value: function() {
            return o().extend({}, d(h(a.prototype), "_classes", this).call(this), {
              second_calendar_box: "date_field_with-time_range-box_second"
            })
          }
        }, {
          key: "changeStyleTopDropdown",
          value: function(e) {
            var t = this._findElem("dateFilterDropdown");
            t.hasClass("date_filter__dropdown_to-top") || t.css({
              top: e
            })
          }
        }, {
          key: "onAbsoluteDateValueChange",
          value: function() {
            if ((this._findElem("preset").length ? this._findElem("preset") : this.$el_in_body.find(this._selector("preset"))).val("").trigger("change"), this._findElem("main_range").length) {
              var e = this._findElem("main_range")[0].value,
                t = this._findElem("main_range")[1].value,
                n = r()(e, this.systemDateFormat),
                i = r()(t, this.systemDateFormat);
              if (e && t && n.isAfter(i)) {
                var o, s = this._findElem("main_range");
                s.eq(0).val(t).focus().trigger("change controls:change autosize:important"), s.eq(1).val(e).focus().trigger("change controls:change autosize:important"), e = (o = [t, e])[0], t = o[1]
              }
              var a = this._findElem("filter_head"),
                l = a.offset();
              "" !== e && "" !== t ? (this.period = e + " - " + t, this.changeStyleTopDropdown(l.top + a.outerHeight())) : this.period = "" === e && "" !== t ? t : "" !== e && "" === t ? e : this._findElem("period").attr("data-before"), this.clearPresetAndDateTitle(this.period)
            }
          }
        }, {
          key: "choosePreset",
          value: function() {
            d(h(a.prototype), "choosePreset", this).apply(this, arguments), this._findElem("period").css("white-space", "nowrap")
          }
        }, {
          key: "hide",
          value: function() {
            return this._findElem("date_time_input_first").trigger("autosize.destroy"), this._findElem("date_time_input_second").trigger("autosize.destroy"), d(h(a.prototype), "hide", this).apply(this, arguments), !1
          }
        }, {
          key: "toggleKalendaeInputOverlay",
          value: function(e) {
            var t = this;
            if (e) {
              if (!this._findElem("main_range").length) return;
              var n = this._findElem("main_range"),
                i = n.offset(),
                s = n.trigger("controls:date").data("kalendae");
              this._$kalendae_overlays = l(), o().each(["before", "after"], (function(e) {
                var n = l('<div class="default-overlay date_filter__overlay default-overlay-visible" style="background: none;"></div>');
                "before" === e ? n.css({
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: "auto",
                  height: i.top
                }) : n.css({
                  top: i.top + t._findElem("date_time_input_overlay").height(),
                  right: 0,
                  bottom: 0,
                  left: 0
                }), document.body.insertBefore(n.get(0), s ? s.container : null), t._$kalendae_overlays = t._$kalendae_overlays.add(n)
              }))
            } else this._$kalendae_overlays && (this._$kalendae_overlays.remove(), this._$kalendae_overlays = null)
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "js-control-date_time_filter"
          }
        }], n && u(t.prototype, n), i && u(t, i), a
      }(a.default);
      _.extend(_);
      const g = _;
      var m = "../build/transpiled/interface/controls/date_time_range";
      window.define(m, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([m])
    },
    967134: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => h
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(982862),
        l = n(210734),
        c = {},
        u = {};

      function d() {
        u = {}, c = {}
      }
      o()(window).on("resize", r().debounce(d, 50)), o()(document).on("list:reload", r().debounce(d, 50));
      const h = l.default.extend({
        controlClassName: "js-control-file-name",
        _classes: function() {
          return {
            size: "drive-field__size",
            download_btn: "js-drive-field__download-btn",
            control_drive_field: "js-control-drive-field",
            elements_container: "drive-field__controls",
            file_name_parent: "js-file-name-cache-width",
            aligned_controls: "drive-field__controls_aligned"
          }
        },
        document_events: function() {
          return {
            "card:overlay:hide": "_hideCardHandler"
          }
        },
        events: function() {
          return {
            "file-name:change": "_changeFileName"
          }
        },
        initialize: function() {
          l.default.prototype.initialize.apply(this, arguments);
          var e = this.$el.data();
          this.type = e.fileNameType, this._$window.on("resize" + this.ns, r().debounce(r().bind(this._nameWidthHandler, this), 200)), this._changeFileName()
        },
        _switchingChangeByType: function(e) {
          switch (e) {
            case "file-name-list":
              this._changeFileNameList();
              break;
            case "file-name-card":
              this._changeFileNameDriveField(e);
              break;
            case "files-list":
              this._changeFilesList(e);
              break;
            default:
              this._defaultChangeFileName(e)
          }
        },
        _changeFileNameList: function() {
          var e = this.$el.closest(this._selector("control_drive_field")).attr("data-field-id");
          this._changeFileNameDriveField(e)
        },
        _changeFileNameDriveField: function(e) {
          this._widthCaching(e);
          var t = this._getWidthDriveField(e),
            n = Math.round((0, a.getTextWidth)(this.file_name_text)) - 1;
          this._toggleControlClass(t, n), t < n ? this._changeCorrectName(t) : this.$el.text(this.file_name_text)
        },
        _changeFilesList: function(e) {
          this._widthCaching(e);
          var t = c[e];
          this._changeCorrectName(t)
        },
        _defaultChangeFileName: function() {
          this.$el.text(this.file_name_text);
          var e = this.$el.width();
          e < Math.round((0, a.getTextWidth)(this.file_name_text)) - 3 && this._changeCorrectName(e)
        },
        _changeFileName: function() {
          this.file_name_text = this.$el.attr("title").trim(), this.file_name_text && this._switchingChangeByType(this.type)
        },
        _nameWidthHandler: function() {
          this.file_name_text && this._switchingChangeByType(this.type)
        },
        _hideCardHandler: function() {
          this._switchingChangeByType(this.type)
        },
        _widthCaching: function(e) {
          if (!c[e] || u[e]) {
            var t = c[e];
            c[e] = this.$el.closest(this._selector("file_name_parent")).width(), t === c[e] ? u[e] = !1 : u[e] = !0
          }
        },
        _getWidthDriveField: function(e) {
          var t = this.$el.parent().find(this._selector("size")).width(),
            n = this.$el.closest(this._selector("elements_container")).find(this._selector("download_btn")).width();
          return c[e] - t - n - 22
        },
        _toggleControlClass: function(e, t) {
          e < t ? this.$el.closest(this._selector("elements_container")).toggleClass(this._class("aligned_controls"), !0) : this.$el.closest(this._selector("elements_container")).toggleClass(this._class("aligned_controls"), !1)
        },
        _changeCorrectName: function(e) {
          var t = e < 15 ? 15 : e,
            n = (0, a.getShortText)(this.file_name_text, t);
          this.$el.text(n)
        }
      });
      var p = "../build/transpiled/interface/controls/file_name";
      window.define(p, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([p])
    },
    930184: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => u
      });
      var i = n(629133),
        o = n.n(i);

      function s(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function r(e, t, n) {
        return r = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = a(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, r(e, t, n || e)
      }

      function a(e) {
        return a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, a(e)
      }

      function l(e, t) {
        return l = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, l(e, t)
      }

      function c(e) {
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
          var n, i = a(e);
          if (t) {
            var o = a(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      const u = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && l(e, t)
        }(u, e);
        var t, n, i = c(u);

        function u() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, u), i.apply(this, arguments)
        }
        return t = u, n = [{
          key: "initialize",
          value: function() {
            r(a(u.prototype), "initialize", this).call(this, arguments)
          }
        }, {
          key: "_getCursorPosAfterFormat",
          value: function(e) {
            var t, n = this._getInputValue(),
              i = n.length,
              o = 0,
              s = 0;
            if (e === this._value.length) return i;
            for (t = i - 1; t >= 0; t--)
              if (s++, t === i - 1 || "-" !== n[t] && " " !== n[t]) {
                if (e === o) break;
                o++
              } return s - 1
          }
        }, {
          key: "_getFormattingCharsCount",
          value: function(e) {
            var t = this._getInputValue(),
              n = t.slice(t.length - e, t.length).match(this._getFormattingCharsRegex());
            return n && n.length || 0
          }
        }, {
          key: "_getFormattingCharsRegex",
          value: function() {
            throw new Error("_getFormattingCharsRegex must be overrided")
          }
        }, {
          key: "_fixCursorPosOnKeydown",
          value: function(e) {
            var t = this._getInputEl(),
              n = t.value,
              i = e.keyCode;
            this._end_pos = n.length - t.selectionEnd, this._start_pos = n.length - t.selectionStart, this._ignore_next_cursor_setting = !1, this._proxyInputEvent(e), !this._isRawValueValid() || t.disabled || t.readOnly || (e.ctrlKey || e.metaKey) && 65 === i || 67 === i || 82 === i || (i > 47 && i < 58 || 32 === i || i > 64 && i < 91 || i > 95 && i < 112 || i > 185 && i < 193 || i > 218 && i < 223 || 8 === i && n.length !== this._end_pos) && (this._end_pos -= this._getFormattingCharsCount(this._end_pos), this._start_pos -= this._getFormattingCharsCount(this._start_pos), this._setInputValue(this._value), this._setCursorPos(this._end_pos, this._start_pos), this._ignore_next_cursor_setting = !1)
          }
        }, {
          key: "_setCursorPos",
          value: function(e, t) {
            if (!this._ignore_next_cursor_setting) {
              var n = this._getInputEl(),
                i = n.value;
              if (e = i.length - (e || this._end_pos), t = o().isUndefined(t) ? e : i.length - t, n.createTextRange) {
                var s = n.createTextRange();
                t === e ? s.move("character", e) : (s.moveStart("character", t), s.moveEnd("character", e)), s.select()
              } else n.setSelectionRange && n.setSelectionRange(t, e)
            }
            this._ignore_next_cursor_setting = !0
          }
        }, {
          key: "_proxyInputEvent",
          value: function() {}
        }, {
          key: "_getInputEl",
          value: function() {
            return this._elem("input").get(0)
          }
        }, {
          key: "_getInputValue",
          value: function() {
            return this._elem("input").val()
          }
        }, {
          key: "_getRawValue",
          value: function() {
            return this._elem("raw").val()
          }
        }, {
          key: "_setInputValue",
          value: function(e) {
            this._elem("input").val(e)
          }
        }, {
          key: "_setRawValue",
          value: function(e) {
            this._elem("raw").val(e)
          }
        }], n && s(t.prototype, n), u
      }(n(210734).default);
      var d = "../build/transpiled/interface/controls/formatters/format_control_interface";
      window.define(d, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([d])
    },
    220555: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => f
      });
      var i = n(629133),
        o = n.n(i),
        s = n(445368),
        r = n(955026),
        a = n(390788);

      function l(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function c(e, t, n) {
        return c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = u(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, c(e, t, n || e)
      }

      function u(e) {
        return u = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, u(e)
      }

      function d(e, t) {
        return d = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, d(e, t)
      }

      function h(e) {
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
          var n, i = u(e);
          if (t) {
            var o = u(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var p = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && d(e, t)
        }(f, e);
        var t, n, i, p = h(f);

        function f() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, f), p.apply(this, arguments)
        }
        return t = f, n = [{
          key: "_classes",
          value: function() {
            return {}
          }
        }, {
          key: "_selectors",
          value: function() {
            return {
              raw: 'input[type="hidden"]',
              input: 'input[type="text"]',
              is_suggest_needed: ".js-control--suggest--list .control--suggest--list--item"
            }
          }
        }, {
          key: "events",
          value: function() {
            var e = {
              'click input[type="text"]': "_stopPropagationOnClick",
              'change input[type="hidden"]': "_onRawInputOutsideChange",
              'change input[type="text"]': "_proxyInputEvent",
              'focus input[type="text"]': "_proxyInputEvent",
              'blur input[type="text"]': "_proxyInputEvent"
            };
            return APP.is_touch_device ? o().extend(e, {
              'focus input[type="text"]': "_setRawValueOnFocusIpad",
              'blur input[type="text"]': "_setFormattedValueOnBlurIpad",
              'input input[type="text"]': "_setValueOnInputIpad"
            }) : o().extend(e, {
              'copy input[type="text"]': "_setRawClipboardOnCopy",
              'keydown input[type="text"]': "_fixCursorPosOnKeydown",
              'input input[type="text"]': "_formatOnInput"
            }), e
          }
        }, {
          key: "initialize",
          value: function() {
            c(u(f.prototype), "initialize", this).apply(this, arguments), this._value = this._getRawValue() || "", this._value && !this._getInputValue() && this._onRawInputOutsideChange()
          }
        }, {
          key: "_setRawValueOnFocusIpad",
          value: function(e) {
            this._setInputValue(this._value), this._proxyInputEvent(e)
          }
        }, {
          key: "_setFormattedValueOnBlurIpad",
          value: function(e) {
            this._onRawInputOutsideChange(), this._proxyInputEvent(e)
          }
        }, {
          key: "_setValueOnInputIpad",
          value: function(e) {
            this._value = this._getInputValue(), this._setRawValue(this._value), this._proxyInputEvent(e)
          }
        }, {
          key: "_stopPropagationOnClick",
          value: function(e) {
            this._findElem("is_suggest_needed").length && e.stopPropagation()
          }
        }, {
          key: "_onRawInputOutsideChange",
          value: function() {
            var e = this._getRawValue();
            this._value = e, this._setInputValue(e), this._format(e)
          }
        }, {
          key: "_setRawClipboardOnCopy",
          value: function(e) {
            var t = this._getInputEl();
            t.value === t.value.substring(t.selectionStart, t.selectionEnd) && (0, a.copyToClipboard)(e, this._value)
          }
        }, {
          key: "_getFormattingCharsRegex",
          value: function() {
            return /[\s-()]/g
          }
        }, {
          key: "_isRawValueValid",
          value: function() {
            return (0, r.isPhoneValid)(this._value)
          }
        }, {
          key: "_format",
          value: function(e) {
            var t;
            return !!this._isRawValueValid() && (e !== (t = (0, s.phone)(e)) && this._setInputValue(t), !0)
          }
        }, {
          key: "_formatOnInput",
          value: function() {
            var e = this._getInputEl().value;
            this._value = e, this._format(e) && (this._end_pos = this._getCursorPosAfterFormat(this._end_pos)), this._setCursorPos(this._end_pos), this._elem("raw").val(this._value).trigger("input")
          }
        }, {
          key: "_proxyInputEvent",
          value: function(e) {
            this._elem("raw").trigger(o().pick(e, "type", "keyCode", "which"))
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "js-control-phone"
          }
        }], n && l(t.prototype, n), i && l(t, i), f
      }(n(930184).default);
      p.extend(p);
      const f = p;
      var _ = "../build/transpiled/interface/controls/formatters/phone";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
    },
    891941: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => c
      });
      var i = n(629133),
        o = n.n(i),
        s = n(161320),
        r = n.n(s),
        a = n(749495),
        l = 12 === APP.system.format.time ? 125 : 85;
      const c = a.Numeric.extend({
        controlClassName: "js-control-format-time",
        check_regex: /^([0-9][0-9]?:?[0-5]?[0-9]?)\s?(AM?|PM?)?\s?-?\s?([0-9]?[0-9]?:?[0-5]?[0-9]?)?\s?(AM?|PM?)?$/,
        time_regex: /^([0-9][0-9]:?[0-5][0-9])\s?(AM?|PM?)?$/,
        events: o().extend({}, o().result(a.Numeric.prototype, "events", {}), {
          focus: "rememberValueOnFocus",
          blur: "validateValueOnBlur",
          "controls:ajust": "_ajustWidth"
        }),
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          a.Numeric.prototype.initialize.apply(this, t), this._original_value = this.$el.val(), this._ajustWidth()
        },
        rememberValueOnFocus: function() {
          this._original_value = this.$el.val()
        },
        validateValueOnBlur: function() {
          var e, t, n = APP.system.format.date.time,
            i = this.$el.val() || "",
            o = i.split(/\s?-\s?/),
            s = !1,
            a = [];
          i && (e = o[0] && r()(o[0], n), t = o[1] && r()(o[1], n), e && e.isValid() ? a.push(e.format(n)) : s = !0, t && (t.isValid() && e.isBefore(t) ? a.push(t.format(n)) : s = !0), this.$el.val(!0 === s ? this._original_value : a.join(" - ")).trigger("input")), this._ajustWidth()
        },
        _prepareValue: function(e) {
          var t, n, i, o = APP.system.format.date.time,
            s = e;
          return e.length >= 4 && (n = (t = e.split(/\s?-\s?/))[0] && this.time_regex.test(t[0]) && r()(t[0], o), i = t[1] && this.time_regex.test(t[1]) && r()(t[1], o), n && n.isValid() && ((e = n.format(o)) !== t[0].trim() || i ? e += " - " : e = s), i && i.isValid() && (n && n.isValid() && n.isBefore(i) ? e += i.format(o) : e = s.trim()), e === this._prev_value && (e = s.trim())), this._ajustWidth(), a.Numeric.prototype._prepareValue.call(this, e.split(/\s?-\s?/).join(" - "))
        },
        _ajustWidth: function() {
          var e = this.$el.val(),
            t = e.split(/\s?-\s?/),
            n = t[0] && this.time_regex.test(t[0]) && r()(t[0], APP.system.format.date.time);
          e.length ? e.length >= 4 || n && n.isValid() ? this.$el.css("width", l) : this.$el.css("width", 38) : this.$el.css("width", 64)
        }
      });
      var u = "../build/transpiled/interface/controls/formatters/time";
      window.define(u, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([u])
    },
    319071: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => w
      });
      var i = n(629133),
        o = n.n(i),
        s = n(306843),
        r = n(955026),
        a = n(577486),
        l = n(210734);

      function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function u(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function d(e, t, n) {
        return d = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = h(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, d(e, t, n || e)
      }

      function h(e) {
        return h = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, h(e)
      }

      function p(e, t) {
        return p = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, p(e, t)
      }

      function f(e, t) {
        return function(e) {
          if (Array.isArray(e)) return e
        }(e) || function(e, t) {
          var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != n) {
            var i, o, s = [],
              r = !0,
              a = !1;
            try {
              for (n = n.call(e); !(r = (i = n.next()).done) && (s.push(i.value), !t || s.length !== t); r = !0);
            } catch (e) {
              a = !0, o = e
            } finally {
              try {
                r || null == n.return || n.return()
              } finally {
                if (a) throw o
              }
            }
            return s
          }
        }(e, t) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return c(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? c(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function _(e) {
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
          var n, i = h(e);
          if (t) {
            var o = h(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var g = "mac" === s.default.os ? 117 : 46,
        m = new a.UnsafeRegExp("^".concat(/(([0-2]?[0-3])|((0|1)?[0-9]))?/.source, ":").concat(/([0-5]?[0-9])?/.source).concat(/(AM|PM|P|A|M)?/gi.source, "$"), "i"),
        v = function(e) {
          return (0, r.getDigitsOnly)(e).length
        },
        y = function(e) {
          switch (v(e)) {
            case 0:
              return "00" + e;
            case 1:
              return "0" + e;
            default:
              return e
          }
        },
        b = function(e) {
          ! function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && p(e, t)
          }(r, e);
          var t, n, i, s = _(r);

          function r() {
            return function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, r), s.apply(this, arguments)
          }
          return t = r, n = [{
            key: "_classes",
            value: function() {
              return {}
            }
          }, {
            key: "_selectors",
            value: function() {
              return {}
            }
          }, {
            key: "events",
            value: function() {
              return {
                keydown: "handleKeyDown",
                blur: "handleBlur",
                input: "handleInput",
                "controls:change": "handleInput"
              }
            }
          }, {
            key: "initialize",
            value: function() {
              d(h(r.prototype), "initialize", this).call(this, arguments), this._value = this._getInputValue()
            }
          }, {
            key: "destroy",
            value: function() {
              this.$el.off(), d(h(r.prototype), "destroy", this).call(this, arguments)
            }
          }, {
            key: "_format",
            value: function(e) {
              var t = function(e) {
                  return e.replace(/:/gi, "")
                }(e),
                n = v(t);
              if (n > 4) this.resetValue();
              else {
                var i = f(e.split(":"), 2),
                  o = i[0],
                  s = i[1],
                  r = void 0 === s ? "" : s,
                  a = 2,
                  l = v(o),
                  c = v(r);
                switch (!0) {
                  case 1 === n && 1 === l:
                  case 2 === n && 1 === l:
                  case 3 === n && 1 === l:
                  case 3 === n && 0 === l:
                    a = 1;
                    break;
                  case 0 === n:
                  case 1 === n && 1 === c:
                  case 2 === n && 2 === c:
                    a = 0
                }
                var u = [t.slice(0, a), t.slice(a)].join(":");
                if (this._isTimeValid(u)) {
                  var d = this.cursorPosition - 1,
                    h = e.indexOf(":"),
                    p = d === u.indexOf(":") ? h : d;
                  this.setValue(u);
                  var _ = p + 1;
                  _ !== this.cursorPosition && this._setCursorPosition(_)
                } else this.resetValue()
              }
            }
          }, {
            key: "resetValue",
            value: function() {
              var e = this.cursorPosition;
              this.setValue(this._prevValue), this._setCursorPosition(e - 1)
            }
          }, {
            key: "setValue",
            value: function(e) {
              this._value = e, this._setInputValue(e)
            }
          }, {
            key: "handleInput",
            value: function() {
              var e = this._getInputValue();
              this._prevValue = this._value, this._value = e, o().isEmpty(e) || this._format(e)
            }
          }, {
            key: "handleKeyDown",
            value: function(e) {
              var t = e.keyCode,
                n = this._getInputValue().indexOf(":");
              switch (!0) {
                case 8 === t && n === this.cursorPosition - 1:
                  this._moveCursorPos(-1);
                  break;
                case t === g && n === this.cursorPosition:
                  this._moveCursorPos(1)
              }
            }
          }, {
            key: "handleBlur",
            value: function() {
              var e = this._getInputValue();
              if (4 !== v(e)) {
                var t = f(e.split(":"), 2),
                  n = t[0],
                  i = t[1],
                  o = void 0 === i ? "" : i,
                  s = [n = y(n), o = y(o)].join(":");
                this.setValue(s)
              }
            }
          }, {
            key: "cursorPosition",
            get: function() {
              return this._getInputEl().selectionStart
            }
          }, {
            key: "_moveCursorPos",
            value: function(e) {
              var t = this.cursorPosition + e;
              this._setCursorPosition(t)
            }
          }, {
            key: "_setCursorPosition",
            value: function(e) {
              var t = this._getInputEl();
              if (t.createTextRange) {
                var n = t.createTextRange();
                n.move("character", e), n.select()
              } else t.setSelectionRange && t.setSelectionRange(e, e)
            }
          }, {
            key: "_getInputEl",
            value: function() {
              return this.el
            }
          }, {
            key: "_getInputValue",
            value: function() {
              return this.$el.val()
            }
          }, {
            key: "_setInputValue",
            value: function(e) {
              this.$el.val(e)
            }
          }, {
            key: "_isTimeValid",
            value: function(e) {
              return m.test(e)
            }
          }], i = [{
            key: "controlClassName",
            get: function() {
              return "js-control-time-formatter"
            }
          }], n && u(t.prototype, n), i && u(t, i), r
        }(l.default);
      b.extend(b);
      const w = b;
      var P = "../build/transpiled/interface/controls/formatters/time_formatter";
      window.define(P, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([P])
    },
    668108: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => f
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(445368),
        l = n(982862),
        c = n(210734),
        u = n(661533);

      function d(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }
      var h = !1,
        p = ["font-weight", "font-size", "font-family", "line-height", "word-break", "letter-spacing", "padding", "padding-left", "border", "border-top", "border-right", "border-bottom", "border-left", "box-sizing"];
      n(181743), u(document).on("mouseup", (function() {
        h = !1
      }));
      const f = c.default.extend({
        controlClassName: "js-control-fullname",
        lastNamePostfix: "plus",
        _selectors: function() {
          return {
            fullname: ".control-fullname__single",
            placeholder: ".control-fullname__placeholder"
          }
        },
        _classes: function() {
          return {
            autosized: "control-fullname_autosized",
            focused: "control-fullname_focused",
            placeholdered: "control-fullname_placeholdered",
            separated: "control-fullname__separated",
            separated_firstname: "control-fullname__separated_firstname",
            separated_lastname: "control-fullname__separated_lastname",
            separated_nomargin: "control-fullname__separated_nomargin",
            separated_empty: "control-fullname__separated_empty"
          }
        },
        events: function() {
          var e = {
            click: "_onMainWrapperClick"
          };
          return e["input ".concat(this._selector("fullname"))] = "_onInputUpdatePlaceholder", e["change ".concat(this._selector("fullname"))] = "_onInputUpdatePlaceholder", e["controls:change ".concat(this._selector("fullname"))] = "_onInputUpdatePlaceholder", e["input ".concat(this._selector("separated"))] = "_onSeparatedInputClear", e["mousedown ".concat(this._selector("separated"))] = "_onSeparatedInputMouseDown", e["keydown ".concat(this._selector("separated"))] = "_onSeparatedInputKeyDown", e["focus .text-input"] = "_onInputFocus", e["blur .text-input"] = "_onInputBlur", e
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var i = this.$(":input:focus");
          c.default.prototype.initialize.apply(this, t), this._focused = i.length, this._autosized = this._hasClass("autosized"), this._is_fullname = this._elem("fullname").length, this._is_fullname ? this._initSingleFullName() : this._initSeparatedFullName(), this._focused && this._onInputFocus({
            currentTarget: i.get(0)
          })
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this._elem("fullname").trigger("autosize.destroy"), c.default.prototype.destroy.apply(this, t)
        },
        _onMainWrapperClick: function(e) {
          u(e.target).is(":input") || u(e.target).is(":has(:focus)") || this.$(":input:visible:first").focus()
        },
        _onInputUpdatePlaceholder: function() {
          var e = [],
            t = this._elem("fullname").val();
          t.trim() && (e = 1 === t.trim().split(" ").length ? ['<span style="visibility: hidden">'.concat(o().escape(t), "</span>"), APP.constant("account").is_contact_name_display_order_first ? (0, a.i18n)("Last name") : (0, a.i18n)("First name")] : []), this._elem("placeholder").html(e.join(t.indexOf(" ") > 0 ? "" : "&nbsp;")), this._toggleClass("placeholdered", e.length > 0)
        },
        _onSeparatedInputClear: function(e) {
          var t, n = u(e.currentTarget),
            i = o().compact(this._elem("separated").map((function(e, t) {
              return (t.value || "").trim()
            })).toArray());
          n.index() > 0 && this._updateFirstInputMargin(), i.length || (t = u(r()({
            ref: "/tmpl/controls/fullname/index.twig"
          }).render(this._getRenderParams())), n.trigger("change"), this.$el.replaceWith(t), t.find(":input").focus())
        },
        _getRenderParams: function() {
          return {
            input_type: this.$el.attr("data-rerender-input-type"),
            name: this.$el.attr("data-rerender-name"),
            input_class_name: this.$el.attr("data-rerender-input-class"),
            placeholder: this.$el.attr("data-rerender-placeholder"),
            placeholder_color: this.$el.attr("data-rerender-placeholder-color"),
            autosized: this.$el.attr("data-rerender-autosized")
          }
        },
        _onInputFocus: function(e) {
          this._focused = !0, this._addClass("focused"), this._updateFirstInputMargin(), this._autosized && u(e.currentTarget).trigger("autosize:important")
        },
        _onInputBlur: function(e) {
          var t = u(e.currentTarget),
            n = h;
          h = !1, this._is_fullname || t.toggleClass(this._class("separated_empty"), !t.val()), n || (this._focused = !1, this._removeClass("focused"), this._is_fullname || this._updateFirstInputMargin(), this._autosized && t.parent().find(":input").trigger("autosize:important"))
        },
        _onSeparatedInputMouseDown: function() {
          h = !0
        },
        _onSeparatedInputKeyDown: function(e) {
          9 !== e.keyCode || e.shiftKey || 0 !== u(e.currentTarget).index() || (h = !0)
        },
        _initSeparatedFullName: function() {
          var e, t = this;
          o().isNaN(parseInt(this.$el.attr("data-comfort-zone"))) || (e = parseInt(this.$el.attr("data-comfort-zone"))), this._elem("separated").autosizeInput({
            appendValue: function() {
              return u(this).index() > 0 && t._focused ? t.lastNamePostfix : ""
            },
            comfortZone: e
          })
        },
        _initSingleFullName: function() {
          var e, t = this;
          o().isNaN(parseInt(this.$el.attr("data-comfort-zone"))) || (e = parseInt(this.$el.attr("data-comfort-zone"))), this._elem("fullname").is("textarea") ? (this._elem("fullname").addClass("autosized").css("width", "calc(100% + ".concat(l.scrollBarWidth + 1, "px)")), this._elem("fullname").autosize({
            noBoxOffset: !0
          })) : this._autosized && this._elem("fullname").autosizeInput({
            appendValue: function() {
              var e = o().compact(t._elem("fullname").val().split(" "));
              return t._focused ? 1 === e.length ? " ".concat((0, a.i18n)("Last name")) : t.lastNamePostfix : ""
            },
            comfortZone: e
          }), this._initPlaceholder()
        },
        _initPlaceholder: function() {
          var e, t, n = this._elem("fullname").get(0),
            i = window.getComputedStyle(n);
          this._elem("placeholder").css("opacity", 1).css((e = o()).pick.apply(e, (t = [i].concat(p), function(e) {
            if (Array.isArray(e)) return d(e)
          }(t) || function(e) {
            if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
          }(t) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return d(e, t);
              var n = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? d(e, t) : void 0
            }
          }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }()))).css("border-color", "transparent"), this._onInputUpdatePlaceholder()
        },
        _updateFirstInputMargin: function() {
          this.$("".concat(this._selector("separated"), ":first")).toggleClass(this._class("separated_nomargin"), !this._focused && !this.$("".concat(this._selector("separated"), ":last")).val())
        }
      });
      var _ = "../build/transpiled/interface/controls/fullname/index";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
    },
    210734: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => C
      });
      var i, o = n(661533),
        s = n.n(o),
        r = n(629133),
        a = n.n(r),
        l = n(313981),
        c = {},
        u = [],
        d = "__directives__",
        h = "",
        p = !0,
        f = {
          childList: !0,
          subtree: !0,
          attributes: !0,
          attributeFilter: ["class"]
        };

      function _(e, t) {
        return (e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector).call(e, t)
      }

      function g(e) {
        if (e) return function() {
          for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
          try {
            e.apply(this, n)
          } catch (e) {
            console.error(e, {
              arguments: n
            }), setTimeout((function() {
              throw e
            }), 0)
          }
        }
      }

      function m(e, t, n) {
        var i = t[d][e.name];
        return i || (i = t[d][e.name] = {
          type: n,
          directive: e,
          scope: {}
        }), i
      }

      function v(e, t, n) {
        if (t[d]) {
          if (t[d][e.name]) return
        } else Object.defineProperty(t, d, {
          value: {}
        });
        var i = m(e, t, n);
        e.onload && e.onload.call(i.scope, t)
      }

      function y(e, t) {
        var n = m(e, t);
        t[d] && t[d][e.name] && (e.onunload && e.onunload.call(n.scope, t), delete t[d][e.name])
      }

      function b(e) {
        var t = [];
        e && e.tagName && (t = Array.prototype.slice.call(e.querySelectorAll(h)), _(e, h) && t.unshift(e), a().each(t, (function(e) {
          ! function(e) {
            e[d] && a().each(e[d], (function(t) {
              y(t.directive, e)
            }))
          }(e)
        })))
      }

      function w(e) {
        var t, n = [];
        e.tagName && ((t = e) === document.body || document.body.contains(t)) && h && (n = Array.prototype.slice.call(e.querySelectorAll(h)), _(e, h) && n.unshift(e), a().each(n, (function(e) {
          a().each(u, (function(t) {
            e.classList && e.classList.contains(t.name) && v(t, e, "class")
          }))
        })))
      }

      function P() {
        p && (w(document.body), i.observe(document.body, f), p = !1)
      }
      s()((function() {
        i = new MutationObserver((function(e) {
          a().each(e, (function(e) {
            var t, n, i;
            switch (e.type) {
              case "childList":
                a().each(e.addedNodes, w), a().each(e.removedNodes, b);
                break;
              case "attributes":
                t = e.target, "class" === e.attributeName && (n = (e.oldValue || "").toLowerCase().split(" "), i = (t.getAttribute("class") || "").toLowerCase().split(" "), a().chain(n).filter((function(e) {
                  return -1 === i.indexOf(e)
                })).each((function(e) {
                  c[e] && y(c[e], t)
                })), a().chain(i).filter((function(e) {
                  return -1 === n.indexOf(e)
                })).each((function(e) {
                  c[e] && v(c[e], t, "class")
                })))
            }
          }))
        })), P(), s()(document).on("controls:check-loaded", (function(e, t) {
          w(t)
        }))
      }));
      var E = l.default.extend({
        controlClassName: "",
        _maxControlBodyZIndex: 1e3,
        _$body_control: null,
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this.$el.data("view", this), l.default.prototype.initialize.apply(this, t)
        },
        delegateEvents: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var i = l.default.prototype.delegateEvents.apply(this, t);
          return this.$el.trigger("controls:view:init"), i
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return this.$el.trigger("controls:view:destroy"), l.default.prototype.destroy.apply(this, t)
        },
        _toggleBodyOverlay: function(e, t, n) {
          var i = s()('<div class="default-overlay control-body-overlay" id="control_overlay"></div>');
          if (n = n || {}, !1 !== e) return this.__overlay_hide = a().bind((function(n) {
            var i = s()("#control_overlay");
            if (!1 !== n && !1 === (t || a().noop).call(this)) return !1;
            i.length && (s()("#control_overlay").off().trigger("overlay:hide", [{
              instantly: !0
            }]), this.$el.append(e))
          }), this), this._$body.append(i), this._$body.append(e), n.class_name && i.addClass(n.class_name), i.on("click", a().bind((function(e) {
            e.stopPropagation(), !1 !== this.__overlay_hide() && delete this.__overlay_hide
          }), this)).trigger("overlay:show"), this.__overlay_hide;
          a().isFunction(this.__overlay_hide) && (this.__overlay_hide(!1), delete this.__overlay_hide)
        }
      });
      E.extend = function(e) {
        var t, n, i, o = l.default.extend.apply(this, arguments);
        return e.controlClassName && (n = {
          load: function(e) {
            this.view = new o({
              el: e
            })
          },
          unload: function() {
            this.view.destroy()
          }
        }, (i = (t = e.controlClassName).toLowerCase()) in c || (c[i] = {
          name: i,
          originalName: t,
          onload: g(n.load),
          onunload: g(n.unload)
        }, u.push(c[i]), h += "".concat(h ? "," : "", ".").concat(t), document.body && w(document.body))), o
      }, E.pause = function() {
        i && !p && (i.disconnect(), p = !0)
      }, E.resume = P, E.forceDirectiveLoad = function(e, t) {
        var n = c[e];
        n && v(n, t, "class")
      };
      const C = E;
      var k = "../build/transpiled/interface/controls/index";
      window.define(k, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([k])
    },
    644760: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => l
      });
      var i = n(629133),
        o = n.n(i),
        s = n(834834),
        r = n(210734),
        a = n(661533);
      const l = r.default.extend({
        controlClassName: "js-control-legal-entity",
        events: function() {
          var e = {
            "input input": "stopPropagationOnDefaultSuggest",
            "focus input": "_onFocused",
            "blur input": "_onBlurred"
          };
          return e["input ".concat(this._selector("name"))] = "_onValueChanged", e["input ".concat(this._selector("vat"))] = "_onValueChanged", e["input ".concat(this._selector("kpp"))] = "_onValueChanged", e["input ".concat(this._selector("ogrn"))] = "_onValueChanged", e["input ".concat(this._selector("mfo"))] = "_onValueChanged", e["input ".concat(this._selector("oked"))] = "_onValueChanged", e["input ".concat(this._selector("director"))] = "_onValueChanged", e["input ".concat(this._selector("bank_account_number"))] = "_onValueChanged", e["input ".concat(this._selector("address"))] = "_onValueChanged", e["input ".concat(this._selector("real_address"))] = "_onValueChanged", e["suggest:changed ".concat(this._selector("name"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("vat"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("kpp"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("ogrn"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("mfo"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("oked"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("director"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("bank_account_number"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("address"))] = "_onItemChoosed", e["suggest:changed ".concat(this._selector("real_address"))] = "_onItemChoosed", o().extend({}, o().result(r.default.prototype, "events", {}), e)
        },
        _classes: function() {
          return {
            name: "js-legal-entity-name",
            vat: "js-legal-entity-vat",
            kpp: "js-legal-entity-kpp",
            ogrn: "js-legal-entity-ogrn",
            mfo: "js-legal-entity-mfo",
            oked: "js-legal-entity-oked",
            director: "js-legal-entity-director",
            bank_account_number: "js-legal-entity-bank_account_number",
            bank_code: "js-legal-entity-bank_code",
            type: "js-legal-entity-type",
            address: "js-legal-entity-address",
            real_address: "js-legal-entity-real_address"
          }
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          r.default.prototype.initialize.apply(this, t), this._cache = {}, this.$("input:focus").length && this._onFocused()
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this._cache = {}, r.default.prototype.destroy.apply(this, t)
        },
        stopPropagationOnDefaultSuggest: function(e) {
          e.stopPropagation()
        },
        _onValueChanged: o().debounce((function(e) {
          var t = a(e.currentTarget),
            n = t.closest(".control--suggest").find(".js-control--suggest--list"),
            i = t.val().trim(),
            s = this.$el.attr("data-search-in"),
            r = !1;
          !s && t.hasClass(this._class("name")) || (t.attr("data-val", i), parseInt(s) > 0 ? r = this.makeCatalogRequest({
            catalog_id: s,
            term: i,
            force: !i && "focus" === e.type
          }) : i && i.length > 2 && "ru" === APP.lang_id && (r = this.makeRequest({
            query: i,
            query_type: t.attr("data-query-type")
          })), r ? r.then(o().bind((function(e) {
            var t = o().map(e, (function(e) {
              return {
                id: e.inn,
                additional_data: ['data-name="'.concat(o().escape(e.name), '"'), 'data-vat="'.concat(o().escape(e.inn), '"'), 'data-kpp="'.concat(o().escape(e.kpp), '"'), 'data-ogrn="'.concat(o().escape(e.ogrn), '"'), 'data-mfo="'.concat(o().escape(e.mfo), '"'), 'data-oked="'.concat(o().escape(e.oked), '"'), 'data-director="'.concat(o().escape(e.director), '"'), 'data-bank_account_number="'.concat(o().escape(e.bank_account_number), '"'), 'data-bank_code="'.concat(o().escape(e.bank_code), '"'), 'data-type="'.concat(o().escape(e.type), '"'), 'data-address="'.concat(o().escape(e.address), '"'), 'data-real_address="'.concat(o().escape(e.real_address), '"')].join(" "),
                text: e.name
              }
            }));
            n.trigger("suggest:reset", [t, ""])
          }), this)) : n.trigger("suggest:reset", [
            [], ""
          ]))
        }), 500),
        _onItemChoosed: function(e, t) {
          this._elem("name").val(t.attr("data-name")).trigger("change"), this._elem("vat").val(t.attr("data-vat")).trigger("change"), this._elem("kpp").val(t.attr("data-kpp")).trigger("change"), this._elem("ogrn").val(t.attr("data-ogrn")).trigger("change"), this._elem("mfo").val(t.attr("data-mfo")).trigger("change"), this._elem("oked").val(t.attr("data-oked")).trigger("change"), this._elem("director").val(t.attr("data-director")).trigger("change"), this._elem("bank_account_number").val(t.attr("data-bank_account_number")).trigger("change"), this._elem("bank_code").val(t.attr("data-bank_code")).trigger("change"), this._elem("type").val(t.attr("data-type")).trigger("change"), this._elem("address").val(t.attr("data-address")).trigger("change"), this._elem("real_address").val(t.attr("data-real_address")).trigger("change")
        },
        _onFocused: function(e) {
          var t = this.$el.height();
          clearTimeout(this.blur_timeout), this.$el.addClass("legal-entity_focused");
          var n = this.$el.height();
          t !== n && this.$el.css("margin-bottom", "".concat(-n + t, "px")), this._onValueChanged(e)
        },
        _onBlurred: function(e) {
          var t = a(e.target).closest(".control--suggest").find(".js-control--suggest--list li");
          e.target.value.trim() && 1 === t.length && t.trigger("suggest:item:click-silent"), this.blur_timeout = setTimeout(o().bind((function() {
            this.$el.removeClass("legal-entity_focused"), this.$el.css("margin-bottom", 0)
          }), this), 100)
        },
        makeCatalogRequest: function(e) {
          var t = this,
            n = a.Deferred(),
            i = e.catalog_id + e.term;
          return this._cache[i] ? n.resolve(this._cache[i]) : s.default.searchElements(e.catalog_id, e.term).then((function(e) {
            var s = o().map(e, (function(e) {
              return o().reduce(e.custom_fields, (function(e, t) {
                var n = "";
                switch (t.code) {
                  case "SUPPLIER_VAT_ID":
                    n = "inn";
                    break;
                  case "SUPPLIER_TAX_REGISTRATION_REASON_CODE":
                    n = "kpp";
                    break;
                  case "SUPPLIER_PRIMARY_STATE_REGISTRATION_NUMBER":
                    n = "ogrn";
                    break;
                  case "SUPPLIER_BANK_IDENTIFICATION_CODE":
                    n = "bank_code";
                    break;
                  case "SUPPLIER_LEGAL_ADDRESS":
                    n = "address"
                }
                return n && (e[n] = o().propertyOf(t)(["values", 0, "value"]) || ""), e
              }), {
                name: e.name
              })
            }));
            t._cache[i] = s, n.resolve(t._cache[i])
          }), n.reject), n.promise()
        },
        makeRequest: function(e) {
          var t = a.Deferred();
          return APP.widgets.legal_handlers && APP.widgets.legal_handlers.length && o().isFunction(APP.widgets.legal_handlers[0]) ? APP.widgets.legal_handlers[0](e) : (a.ajax({
            type: "POST",
            headers: {
              Authorization: "Token 608b368be2b4caceef05d83b16bd85305d3d4cc8",
              Accept: "application/json, text/javascript",
              "Content-Type": "application/json"
            },
            url: "https://dadata.ru/api/v2/suggest/party",
            dataType: "json",
            data: JSON.stringify(e)
          }).done(o().bind((function(e) {
            var t;
            !o().isUndefined(e.suggestions) && e.suggestions.length && (t = o().map(e.suggestions, (function(e) {
              var t = e.value,
                n = e.data,
                i = n.inn,
                o = n.kpp,
                s = n.ogrn,
                r = n.address;
              return {
                name: t,
                inn: i,
                kpp: o,
                ogrn: s,
                type: "INDIVIDUAL" === e.type ? 1 : 2,
                address: r.unrestricted_value || r.value
              }
            }))), this.resolve(t)
          }), t)).fail(o().bind(t.reject, t, [])), t.promise())
        }
      });
      var c = "../build/transpiled/interface/controls/legal_entity";
      window.define(c, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([c])
    },
    656536: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => g
      });
      var i = n(629133),
        o = n.n(i),
        s = n(834834),
        r = n(445368),
        a = n(926168),
        l = n(210734),
        c = n(661533);

      function u(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function d(e, t, n) {
        return d = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = h(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, d(e, t, n || e)
      }

      function h(e) {
        return h = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, h(e)
      }

      function p(e, t) {
        return p = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, p(e, t)
      }

      function f(e) {
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
          var n, i = h(e);
          if (t) {
            var o = h(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var _ = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && p(e, t)
        }(g, e);
        var t, n, i, _ = f(g);

        function g() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, g), _.apply(this, arguments)
        }
        return t = g, n = [{
          key: "events",
          value: function() {
            var e = {
              "input input": "stopPropagationOnDefaultSuggest"
            };
            return e["input " + this._selector("name")] = "_onValueChangedDebounced", e["focus " + this._selector("name")] = "_onNameInputFocused", e["blur " + this._selector("name")] = "_onNameInputBlurred", e["suggest:changed " + this._selector("name")] = "_onItemChoosed", e["linked-entity:autoselect-first " + this._selector("name")] = "_autoSelectFirstItem", e["linked-entity:set-defaults " + this._selector("name")] = "_onDefaultItemsSet", o().extend({}, o().result(l.default.prototype, "events", {}), e)
          }
        }, {
          key: "_classes",
          value: function() {
            return {
              name: "js-linked-entity-name",
              entity_id: "js-linked-entity-id",
              entity_type: "js-linked-entity-type",
              catalog_id: "js-linked-entity-catalog-id",
              select_icon: "control--suggest--down-btn",
              suggest_list: "js-control--suggest--list"
            }
          }
        }, {
          key: "initialize",
          value: function() {
            d(h(g.prototype), "initialize", this).apply(this, arguments), this._default_items = [], this._cache = {}, this._onValueChangedDebounced = o().debounce(o().bind(this._onValueChanged, this), 500)
          }
        }, {
          key: "stopPropagationOnDefaultSuggest",
          value: function(e) {
            e.stopPropagation()
          }
        }, {
          key: "_autoSelectFirstItem",
          value: function() {
            this._elem("name").trigger("suggest:changed", [this._findElem("suggest_list").find("li:first")])
          }
        }, {
          key: "_getElementsToSet",
          value: function(e) {
            switch (this._data.searchIn) {
              case "companies":
                return o().filter(e, (function(e) {
                  return parseInt(e.element_type) === APP.element_types.companies
                }));
              case "contacts":
                return o().filter(e, (function(e) {
                  return parseInt(e.element_type) === APP.element_types.contacts
                }));
              case "contacts_and_companies":
                return o().filter(e, (function(e) {
                  return o().includes([APP.element_types.companies, APP.element_types.contacts], parseInt(e.element_type))
                }));
              default:
                return []
            }
          }
        }, {
          key: "_onDefaultItemsSet",
          value: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
              n = arguments.length > 2 ? arguments[2] : void 0;
            this._default_items = this._getElementsToSet(t), this._default_items.length && !this._elem("select_icon").get(0) && n && (this._elem("name").after('<b class="'.concat(this._class("select_icon"), '"></b>')), this._dropElemCache("select_icon")), this.resetItems(this._default_items)
          }
        }, {
          key: "_onNameInputFocused",
          value: function(e) {
            this._current_name_value = c(e.currentTarget).val(), this._current_name_value && !this._elem("select_icon").get(0) || (this._default_items.length ? this.resetItems(this._default_items) : this._onValueChanged(e)), this._elem("select_icon").hide()
          }
        }, {
          key: "_onNameInputBlurred",
          value: function(e) {
            var t = e.currentTarget,
              n = c(t).val();
            n !== this._current_name_value && (this._elem("entity_id").val("").trigger("change"), this._elem("entity_type").val("").trigger("change"), this._elem("catalog_id").val("").trigger("change"), this._current_name_value = n), this._elem("select_icon").show()
          }
        }, {
          key: "_onValueChanged",
          value: function(e) {
            var t = this,
              n = c(e.currentTarget),
              i = n.val().trim(),
              s = this.$el.attr("data-search-in"),
              r = !1;
            n.is(":focus") && (n.attr("data-val", i), o().contains(["contacts_and_companies", "contacts", "companies"], s) ? r = this.makeContactsRequest({
              entity: s,
              term: i
            }) : o().isNaN(parseInt(s)) || (r = this.makeCatalogElementsRequest({
              catalog_id: s,
              term: i
            })), r ? (n.trigger("suggest:loader"), r.then((function(e) {
              return t.resetItems(e)
            }), (function(e) {
              return t.resetItems(e)
            }))) : this.resetItems(this._default_items))
          }
        }, {
          key: "_onItemChoosed",
          value: function(e, t) {
            var n = parseInt(t.attr("data-entity-id") || 0),
              i = parseInt(t.attr("data-catalog-id") || 0);
            this._elem("name").val(t.attr("data-name")).trigger("change"), this._elem("entity_id").val(n || "").trigger("change"), this._elem("entity_type").val(n > 0 ? t.attr("data-entity-type") : "").trigger("change"), this._elem("catalog_id").val(i || "").trigger("change")
          }
        }, {
          key: "resetItems",
          value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
              t = this._findElem("suggest_list"),
              n = o().map(e, (function(e) {
                return {
                  id: e.id,
                  additional_data: ['data-name="'.concat(o().escape(e.name), '"'), 'data-entity-id="'.concat(e.id, '"'), 'data-entity-type="'.concat((0, a.convertElementType)(e.element_type, "string"), '"'), 'data-catalog-id="'.concat(e.catalog_id, '"')].join(" "),
                  text: e.name
                }
              }));
            t.trigger("suggest:reset", [n, ""])
          }
        }, {
          key: "makeContactsRequest",
          value: function(e) {
            var t = e.entity,
              n = e.term,
              i = void 0 === n ? "" : n,
              s = c.Deferred();
            if (i.length < 3) s.reject(this._default_items);
            else {
              var r = "?type=".concat(t);
              "contacts_and_companies" === t && (r = "?type=contacts&contacts=all"), c.ajax({
                url: "/ajax/search/".concat(r, "&query_type=name&q=").concat(i || "")
              }).then((function(e) {
                var n = e.status,
                  i = e.result;
                "ok" === n ? s.resolve(o().map(i || [], (function(e) {
                  var n = e.element_type;
                  return n || (n = "contacts" === t ? APP.element_types.contacts : APP.element_types.companies), o().extend({}, e, {
                    element_type: n
                  })
                }))) : s.reject(i)
              }), s.reject)
            }
            return s.promise()
          }
        }, {
          key: "makeCatalogElementsRequest",
          value: function(e) {
            var t = this,
              n = e.catalog_id,
              i = e.term,
              a = c.Deferred();
            return i.length > 0 && i.length < 3 || !n ? a.reject(this._default_items) : this._cache["".concat(n).concat(i)] ? a.resolve(this._cache["".concat(n).concat(i)]) : s.default.searchElements(n, i).then((function(e) {
              var s = o().map(e, (function(e) {
                var t = (0, r.catalogElementName)(e.name, e.id, e.catalog_id);
                return {
                  id: e.id,
                  element_type: APP.element_types.catalog_elements,
                  catalog_id: n,
                  name: t
                }
              }));
              t._cache["".concat(n).concat(i)] = s, a.resolve(s)
            }), a.reject), a.promise()
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "js-control-linked-entity"
          }
        }], n && u(t.prototype, n), i && u(t, i), g
      }(l.default);
      const g = _.extend(_);
      var m = "../build/transpiled/interface/controls/linked_entity";
      window.define(m, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([m])
    },
    790857: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => u
      });
      var i = n(629133),
        o = n.n(i),
        s = n(210734);

      function r(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function a(e) {
        return a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, a(e)
      }

      function l(e, t) {
        return l = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, l(e, t)
      }

      function c(e) {
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
          var n, i = a(e);
          if (t) {
            var o = a(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var u = function(e) {
          ! function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && l(e, t)
          }(a, e);
          var t, n, i = c(a);

          function a() {
            return function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, a), i.apply(this, arguments)
          }
          return t = a, n = [{
            key: "events",
            value: function() {
              return o().extend({}, o().result(s.default.prototype, "events", {}), {
                "input input": "stopPropagationOnDefaultSuggest"
              })
            }
          }, {
            key: "_classes",
            value: function() {
              return {
                suggest_item: "control--suggest--list--item",
                suggest_list: "js-control--suggest--list"
              }
            }
          }, {
            key: "initialize",
            value: function() {
              s.default.prototype.initialize.apply(this, arguments), this._cache = {}, this._onValueChangedDebounced = o().debounce(o().bind(this._onValueChanged, this), 500)
            }
          }, {
            key: "destroy",
            value: function() {
              this._cache = {}, s.default.prototype.destroy.apply(this, arguments)
            }
          }, {
            key: "stopPropagationOnDefaultSuggest",
            value: function(e) {
              e.stopPropagation()
            }
          }, {
            key: "autoSelectFirstItem",
            value: function() {
              this._elem("name").trigger("suggest:changed", [this._findElem("suggest_list").find("li:first")])
            }
          }, {
            key: "getElementsToSet",
            value: function(e) {
              switch (this._data.searchIn) {
                case "companies":
                  return o().filter(e, (function(e) {
                    return parseInt(e.element_type) === APP.element_types.companies
                  }));
                case "contacts":
                  return o().filter(e, (function(e) {
                    return parseInt(e.element_type) === APP.element_types.contacts
                  }));
                case "contacts_and_companies":
                  return o().filter(e, (function(e) {
                    return o().includes([APP.element_types.companies, APP.element_types.contacts], parseInt(e.element_type))
                  }));
                default:
                  return []
              }
            }
          }, {
            key: "_onValueChanged",
            value: function() {}
          }], n && r(t.prototype, n), a
        }(s.default),
        d = "../build/transpiled/interface/controls/linked_entity_base";
      window.define(d, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([d])
    },
    830666: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => h
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(161320),
        l = n.n(a),
        c = n(859200),
        u = n(123241),
        d = n(661533);
      const h = u.default.extend({
        controlClassName: "js-control-loss-reason-dropdown_list",
        _classes: function() {
          return o().extend({}, o().result(u.default.prototype, "_classes", {}), {
            name: "note-lead__loss-reason"
          })
        },
        events: function() {
          return o().extend({}, o().result(u.default.prototype, "events", {}), {
            mouseenter: "_onMouseEnter",
            mouseleave: "_onMouseLeave",
            "click .cell-edit-buttons__loss-reason": "_onEditButtonClick",
            click: "",
            'change input[type="radio"]': ""
          })
        },
        delegateEvents: function() {
          if ((0, c.getRights)("leads", "edit")) return r()._preload(["/tmpl/list/cells_edit/buttons.twig"])().then(o().bind(u.default.prototype.delegateEvents, this))
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          u.default.prototype.initialize.apply(this, t), this._$window.on("resize".concat(this.ns), o().bind(this._onWindowResize, this))
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this.$list && this.$list.remove(), u.default.prototype.destroy.apply(this, t)
        },
        _onEditButtonClick: function(e) {
          e.stopPropagation(), this._$document.trigger({
            type: "controls:hide",
            target: this.$el
          }), this._initList()
        },
        _onReasonChange: function() {
          var e = this.$el.closest(".js-list-row");
          u.default.prototype._onReasonChange.apply(this, arguments), d.ajax({
            url: "/ajax/v1/leads/set",
            type: "POST",
            dataType: "json",
            headers: {
              "Content-Type": "application/json"
            },
            data: JSON.stringify({
              request: {
                leads: {
                  update: [{
                    id: e.attr("data-id"),
                    last_modified: l()().unix(),
                    loss_reason_id: this._id
                  }]
                }
              }
            })
          })
        },
        _onMouseEnter: function() {
          var e = this.$el.closest(".list-row__cell-status");
          e.length && (e.addClass("list-row__cell-template-status_loss-reason-active"), this.$edit_button || this.$el.append(this.$edit_button = d(r()({
            ref: "/tmpl/list/cells_edit/buttons.twig"
          }).render({
            class_name: "cell-edit-buttons__loss-reason"
          }))), this._positionEditButton())
        },
        _onMouseLeave: function() {
          var e = this.$el.closest(".list-row__cell-status");
          e.length && (this.$edit_button && (this.$edit_button.remove(), delete this.$edit_button), e.removeClass("list-row__cell-template-status_loss-reason-active"))
        },
        _onWindowResize: function() {
          this.$list && this.$list.css({
            top: this.$el.offset().top + 39,
            left: this.$el.offset().left - this._getListHolder().offset().left + 1,
            maxWidth: this._getListHolder().width() - (this.$el.offset().left + 32)
          })
        },
        _positionEditButton: function() {
          var e = this.$el.closest(".content-table__item__inner"),
            t = e.width(),
            n = e.find(".leads__status-label").outerWidth() || e.find(".note-lead__container").outerWidth();
          n + this.$el.find(".note-lead__loss-reason").width() + this.$edit_button.outerWidth() + 29 < t ? this.$edit_button.css("left", "".concat(this.$el.find(".note-lead__loss-reason").width() + 3, "px")) : this.$edit_button.css("left", "".concat(t - n - 27, "px"))
        },
        _onLoad: function() {
          this._renderList(this._getListHolder()), this.$el.addClass("note-lead__pipe-container_loss-reason_in-select"), this._onWindowResize(), this.$list.css({
            top: this.$el.offset().top + 39,
            left: this.$el.offset().left - this._getListHolder().offset().left
          }).on("change", 'input[type="radio"]', o().bind(this._onReasonChange, this))
        },
        _getListHolder: function() {
          return this._$list_holder || (this._$list_holder = d(".list__body-right")), this._$list_holder
        },
        _onHide: function() {
          this.$el.removeClass("note-lead__pipe-container_loss-reason_in-select"), this._getListHolder().find(".list-row__cell-edit-buttons").remove()
        }
      });
      var p = "../build/transpiled/interface/controls/loss_reason/in_list";
      window.define(p, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([p])
    },
    123241: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => h
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(460159),
        l = n.n(a),
        c = n(656580),
        u = n(445368),
        d = n(210734);
      const h = d.default.extend({
        controlClassName: "js-control-loss-reason-dropdown",
        _classes: function() {
          return {
            name: "pipeline-select-view__loss-reason-name"
          }
        },
        document_events: {
          "controls:hide:private": "_onOutsideClick"
        },
        events: {
          "click .pipeline-select-view__loss-reason-name": "_onListOpenClick",
          "controls:loss-reason:init": "_initList",
          'change input[type="radio"]': "_onReasonChange"
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          d.default.prototype.initialize.apply(this, t), this._reasons = null, this._setId(this.$el.attr("data-id") || 0, {
            silent: !0
          })
        },
        _onListOpenClick: function(e) {
          var t = !this._opened;
          e.stopPropagation(), this._$document.trigger({
            type: "controls:hide",
            target: this.el
          }), t && this._initList()
        },
        _onReasonChange: function(e) {
          var t = o()(e.currentTarget).val(),
            n = r().find(this._reasons, (function(e) {
              return e.id === parseInt(t)
            }));
          this._findElem("name").text(n ? n.name : (0, u.i18n)("No reason")), this._$document.trigger({
            type: "controls:hide",
            target: this.$el
          }), this._setId(t)
        },
        _onOutsideClick: function() {
          this.$list && this._opened && (this.$list.remove(), this.$list = null, this._onHide(), this._opened = !1)
        },
        _setId: function(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          this._id = e, this.$el.attr("data-id", this._id), t.silent || this.$('input[type="hidden"]').val(this._id).trigger("change")
        },
        _initList: function() {
          var e = this;
          e._loading || (this._opened = !0, this._reasons ? this._onLoad() : (e._loading = !0, Promise.all([c.default.getLossReasons(), l()._preload(["/tmpl/leads/loss_reason/items.twig"])()]).then((function(t) {
            e._reasons = r().sortBy(t[0]._embedded.items, "sort"), e._onLoad(), e._loading = !1
          }), (function() {
            e._loading = !1
          }))))
        },
        _onLoad: function() {
          var e = this.$el.closest(".pipeline-select-view").width();
          this._renderList(this.$el), e < 350 ? this.$list.css("max-width", e) : this.$list.css("max-width", 350)
        },
        _renderList: function(e) {
          this.$list || (this.$list = o()(l()({
            ref: "/tmpl/leads/loss_reason/items.twig"
          }).render({
            selected: this._id,
            items: this._reasons,
            is_enabled: APP.constant("loss_reason_enabled")
          })), this.$list.on("click", (function(e) {
            e.stopPropagation()
          })), e.prepend(this.$list))
        },
        _onHide: r().noop
      });
      var p = "../build/transpiled/interface/controls/loss_reason/index";
      window.define(p, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([p])
    },
    749495: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        Numeric: () => r,
        NumericFloat: () => a,
        NumericFloatNegative: () => u,
        NumericFloatPrice: () => l,
        NumericFloatQuantity: () => c,
        Percentage: () => h,
        Zip: () => d
      });
      var i = n(629133),
        o = n.n(i),
        s = n(282140),
        r = s.default.extend({
          controlClassName: "js-control-allow-numeric",
          check_regex: /^[\d]+$/,
          _elem: function(e) {
            return "input" === e ? this.$el : s.default.prototype._elem.apply(this, arguments)
          },
          events: {
            keydown: "_fixCursorPosOnKeydown",
            input: "_formatOnInput"
          },
          initialize: function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            s.default.prototype.initialize.apply(this, t), this._allow_zero = !o().isUndefined(this.$el.attr("data-allow-zero")), this._setPrevValue()
          },
          _setPrevValue: function() {
            this._prev_value = this.$el.val()
          },
          _getPrevValue: function() {
            return this._prev_value
          },
          _prepareValue: function(e) {
            var t = e;
            return t && !this.check_regex.test(t) ? this._getPrevValue() : (this._allow_zero && t.match(/^[0]{2,}$/) && (t = t.replace(/[0]{2,}/, "0")), t)
          },
          _formatOnInput: function() {
            var e = this.$el.val(),
              t = this._prepareValue(e);
            t !== e && this.$el.val(t).trigger("change"), this._setPrevValue(), this._setCursorPos()
          }
        }),
        a = r.extend({
          controlClassName: "js-control-allow-numeric-float",
          check_regex: /^([1-9][0-9]*|0)?([.,/])?([\d]+)?$/,
          _prepareValue: function(e) {
            var t;
            return e = e.replace(/[,/]/g, "."), o().contains([".", "-."], e) && ((t = e.split("")).splice(-1, 0, "0"), e = t.join("")), r.prototype._prepareValue.call(this, e)
          }
        }),
        l = a.extend({
          controlClassName: "js-control-allow-numeric-float-price",
          check_regex: /^([1-9][0-9]*|0)?([.,/])?([\d]{0,2})?$/,
          _prepareValue: function(e) {
            var t = e.replace(/^0+(\d{1,})/, "$1");
            return a.prototype._prepareValue.call(this, t)
          }
        }),
        c = a.extend({
          controlClassName: "js-control-allow-numeric-float-quantity",
          check_regex: /^([1-9][0-9]*|0)?([.,/])?([\d]{0,3})?$/
        }),
        u = a.extend({
          controlClassName: "js-control-allow-numeric-negative",
          check_regex: /^-?([1-9][0-9]*|0)?([.,/])?([\d]+)?$/,
          events: function() {
            var e = r.prototype.events;
            return o().extend(e, {
              blur: "_formatOnBlur"
            })
          },
          _formatOnBlur: function() {
            "-" === this.$el.val() && this.$el.val("-1").trigger("change")
          }
        }),
        d = r.extend({
          controlClassName: "js-control-allow-zip",
          check_regex: /^[a-zA-Z0-9]+$/
        }),
        h = r.extend({
          controlClassName: "js-control-allow-percentage",
          check_regex: /^((100)|([1-9]\d)|(\d))$/
        }),
        p = "../build/transpiled/interface/controls/numeric";
      window.define(p, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([p])
    },
    51623: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => l
      });
      var i = n(629133),
        o = n.n(i),
        s = n(210734),
        r = n(419982),
        a = n(661533);
      const l = s.default.extend({
        controlClassName: "js-control-org-legal-name",
        events: function() {
          var e = {
            "input input": "stopPropagationOnDefaultSuggest",
            "focus input": "_onFocused",
            "blur input": "_onBlurred"
          };
          return e["input ".concat(this._selector("name"))] = "_onValueChanged", e["suggest:changed ".concat(this._selector("name"))] = "_onItemChoosed", o().extend({}, o().result(s.default.prototype, "events", {}), e)
        },
        _selectors: function() {
          return {
            name: ".js-org-legal-name-name",
            line1: ".js-org-legal-name-line1",
            line2: ".js-org-legal-name-line2",
            city: ".js-org-legal-name-city",
            state: ".js-org-legal-name-state",
            zip: ".js-org-legal-name-zip",
            country: ".js-org-legal-name-country",
            external_id: ".js-org-legal-name-external"
          }
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          s.default.prototype.initialize.apply(this, t), this.$("input:focus").length && this._onFocused()
        },
        stopPropagationOnDefaultSuggest: function(e) {
          e.stopPropagation()
        },
        _onValueChanged: o().debounce((function(e) {
          var t = a(e.currentTarget),
            n = t.closest(".control--suggest").find(".js-control--suggest--list"),
            i = t.val().trim();
          this._elem("external_id").val("").trigger("change"), t.attr("data-val", i), i ? this.makeRequest({
            query: i,
            query_type: t.attr("data-query-type")
          }).then(o().bind((function(e) {
            var t = [];
            e && e.length && (t = o().map(e, (function(e) {
              return {
                id: e.inn,
                additional_data: ['data-name="'.concat(o().escape(e.name), '"'), 'data-line1="'.concat(o().escape(e.line1), '"'), 'data-line2="'.concat(o().escape(e.line2), '"'), 'data-city="'.concat(o().escape(e.city), '"'), 'data-state="'.concat(o().escape(e.state), '"'), 'data-zip="'.concat(o().escape(e.zip), '"'), 'data-country="'.concat(o().escape(e.country), '"'), 'data-external="'.concat(o().escape(e.external_id), '"')].join(" "),
                text: e.name
              }
            }))), n.trigger("suggest:reset", [t, ""])
          }), this)) : n.trigger("suggest:reset", [
            [], ""
          ])
        }), 500),
        _onItemChoosed: function(e, t) {
          this._elem("name").val(t.attr("data-name")).trigger("change"), this._elem("line1").val(t.attr("data-line1")).trigger("change"), this._elem("line2").val(t.attr("data-line2")).trigger("change"), this._elem("city").val(t.attr("data-city")).trigger("change"), this._elem("state").val(t.attr("data-state")).trigger("change"), this._elem("zip").val(t.attr("data-zip")).trigger("change"), this._elem("country").val(t.attr("data-country")).trigger("change"), this._elem("external_id").val(t.attr("data-external")).trigger("change"), "null" === t.attr("data-line1") && t.attr("data-line1", "..."), "null" === t.attr("data-line2") && t.attr("data-line2", "..."), "null" === t.attr("data-city") && t.attr("data-city", "..."), "null" === t.attr("data-state") && t.attr("data-state", "..."), "null" === t.attr("data-zip") && t.attr("data-zip", "..."), "null" === t.attr("data-country") && t.attr("data-country", "...");
          var n = a(".linked-form__field-smart_address").children(".linked-form__field__value").children(".control-address__wrapper"),
            i = n.find('[data-field-type="address_line_1"] input')[0],
            o = n.find('[data-field-type="address_line_2"] input')[0],
            s = n.find('[data-field-type="city"] input')[0],
            l = n.find('[data-field-type="state"] input')[0],
            c = n.find('[data-field-type="zip"] input')[0],
            u = n.find('[data-field-type="country"]').children(".control-address__select").children(".control--select--input")[0];
          a(i).val(t.attr("data-line1")).trigger("change").trigger("controls:change:visual"), a(o).val(t.attr("data-line2")).trigger("change").trigger("controls:change:visual"), a(s).val(t.attr("data-city")).trigger("change").trigger("controls:change:visual"), a(l).val(t.attr("data-state")).trigger("change").trigger("controls:change:visual"), a(c).val(t.attr("data-zip")).trigger("change").trigger("controls:change:visual");
          var d = r.default,
            h = "".concat(t.attr("data-country"));
          a(u).val(d[h]).trigger("change").trigger("controls:change:visual")
        },
        _onFocused: function() {
          clearTimeout(this.blur_timeout)
        },
        _onBlurred: function(e) {
          var t = a(e.target).closest(".control--suggest").find(".js-control--suggest--list li");
          e.target.value.trim() && 1 === t.length && t.trigger("suggest:item:click-silent"), this.blur_timeout = setTimeout(o().bind((function() {
            this.$el.removeClass("org-legal-name_focused")
          }), this), 100)
        },
        makeRequest: function(e) {
          var t = a.Deferred();
          return APP.widgets.legal_handlers && APP.widgets.legal_handlers.length && o().isFunction(APP.widgets.legal_handlers[0]) ? APP.widgets.legal_handlers[0](e) : (t.reject([]), t.promise())
        }
      });
      var c = "../build/transpiled/interface/controls/org_legal_name";
      window.define(c, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([c])
    },
    433264: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => v
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(926168),
        l = n(790857);

      function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function u(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function d(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function h(e, t, n) {
        return h = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = p(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, h(e, t, n || e)
      }

      function p(e) {
        return p = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, p(e)
      }

      function f(e, t) {
        return f = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, f(e, t)
      }

      function _(e) {
        return function(e) {
          if (Array.isArray(e)) return c(e)
        }(e) || function(e) {
          if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
        }(e) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return c(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? c(e, t) : void 0
          }
        }(e) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function g(e) {
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
          var n, i = p(e);
          if (t) {
            var o = p(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var m = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && f(e, t)
        }(c, e);
        var t, n, i, s = g(c);

        function c() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, c), s.apply(this, arguments)
        }
        return t = c, n = [{
          key: "events",
          value: function() {
            var e;
            return r().extend({}, h(p(c.prototype), "events", this).call(this), (d(e = {
              "focus input": "_onFocused",
              "blur input": "_onBlurred"
            }, "input ".concat(this._selector("name")), "_onValueChanged"), d(e, "input ".concat(this._selector("address")), "_onValueChanged"), d(e, "input ".concat(this._selector("email")), "_onValueChanged"), d(e, "input ".concat(this._selector("phone")), "_onValueChanged"), d(e, "input ".concat(this._selector("input")), "_onValueChanged"), d(e, "suggest:changed ".concat(this._selector("name")), "_onItemChosen"), d(e, "suggest:changed ".concat(this._selector("address")), "_onItemChosen"), d(e, "suggest:changed ".concat(this._selector("input")), "_onItemChosen"), d(e, "mousedown ".concat(this._selector("suggest_item")), "_onSuggestItemMouseDown"), d(e, "payer:set-defaults ".concat(this._selector("name")), "_onDefaultItemsSet"), d(e, "payer:autoselect-first ".concat(this._selector("name")), (function() {
              l.default.prototype.autoSelectFirstItem.call(this)
            })), e))
          }
        }, {
          key: "_classes",
          value: function() {
            return r().extend({}, h(p(c.prototype), "_classes", this).call(this), {
              name: "js-payer-name",
              input: "js-payer-input",
              address: "js-payer-address",
              phone: "js-payer-phone",
              email: "js-payer-email",
              vat_id: "js-payer-vat_id",
              kpp: "js-payer-kpp",
              tax_registration_reason_code: "js-payer-tax_registration_reason_code",
              entity_id: "js-payer-id",
              entity_type: "js-payer-entity-type"
            })
          }
        }, {
          key: "initialize",
          value: function() {
            h(p(c.prototype), "initialize", this).apply(this, arguments), this._default_items = [], this.$("input:focus").length && this._onFocused()
          }
        }, {
          key: "destroy",
          value: function() {
            this._default_items = [], h(p(c.prototype), "destroy", this).apply(this, arguments)
          }
        }, {
          key: "_onDefaultItemsSet",
          value: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
            this._default_items = h(p(c.prototype), "getElementsToSet", this).call(this, t), this._resetItems(this._default_items)
          }
        }, {
          key: "_resetItems",
          value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
              t = this._findElem("suggest_list"),
              n = r().map(e, (function(e) {
                var t = e.id,
                  n = e.element_type,
                  i = e.name,
                  o = e.address,
                  s = e.company_name,
                  l = r().escape(i),
                  c = r().escape(o),
                  u = r().escape(s),
                  d = ['data-entity-id="'.concat(t, '"'), 'data-entity-type="'.concat((0, a.convertElementType)(n, "string"), '"')],
                  h = ['data-name="'.concat(l, '"'), 'data-address="'.concat(c, '"')].concat(_(d));
                switch (Number(n)) {
                  case APP.element_types.companies:
                    var p = e.legal_entity,
                      f = p.name,
                      g = p.address,
                      m = p.vat_id,
                      v = p.kpp,
                      y = p.tax_registration_reason_code;
                    h = ['data-name="'.concat(f ? r().escape(f) : l, '"'), 'data-address="'.concat(g ? r().escape(g) : c, '"'), 'data-vat_id="'.concat(r().escape(m), '"'), 'data-kpp="'.concat(r().escape(v), '"'), 'data-tax_registration_reason_code="'.concat(r().escape(y), '"')].concat(_(d));
                    break;
                  case APP.element_types.contacts:
                    var b = e.contact_info,
                      w = b.phone,
                      P = b.email;
                    h = _(h).concat(['data-phone="'.concat(r().escape(w), '"'), 'data-email="'.concat(r().escape(P), '"')])
                }
                return {
                  id: t,
                  additional_data: h.join(" "),
                  text: [l, u ? ', <span class="u-text-secondary">'.concat(u, "</span>") : ""].join(""),
                  raw_highlight: !0
                }
              }));
            t.trigger("suggest:reset", [n, ""])
          }
        }, {
          key: "_onFocused",
          value: function(e) {
            var t = this.$el.height();
            clearTimeout(this.blur_timeout), this.$el.addClass("payer_focused");
            var n = this.$el.height();
            t !== n && this.$el.css("margin-bottom", -n + t + "px"), this._current_value = o()(e.currentTarget).val(), this._current_value.length || this._onValueChanged(e)
          }
        }, {
          key: "_onBlurred",
          value: function(e) {
            var t = this,
              n = o()(e.currentTarget),
              i = n.attr("data-query-type"),
              s = this._elem("entity_type").val();
            n.val() !== this._current_value && r().contains(["contacts_and_companies", "contacts", "companies"], s) && ("name" === i && 0 === n.val().length && this._current_value.length > 0 && this._elem("input").val("").trigger("change"), "contacts" === s && this._elem("input").closest(".payer__item").addClass("hidden"), this._elem("entity_id").val("").trigger("change"), this._elem("entity_type").val("").trigger("change")), this.blur_timeout = setTimeout((function() {
              t.$el.removeClass("payer_focused"), t.$el.css("margin-bottom", 0)
            }), 100)
          }
        }, {
          key: "_onValueChanged",
          value: function(e) {
            var t = o()(e.currentTarget),
              n = t.closest(".control--suggest").find(".js-control--suggest--list"),
              i = t.val().trim(),
              s = this.$el.attr("data-search-in");
            if (s || !t.hasClass(this._class("name"))) {
              t.attr("data-val", i);
              var a = !1;
              r().contains(["contacts_and_companies", "contacts", "companies"], s) && t.hasClass(this._class("name")) && (a = this._makeContactsRequest({
                entity: s,
                term: i
              })), a ? a.then((function(e) {
                var t = r().map(e, (function(e) {
                  var t = r().escape(e.id),
                    n = r().escape(e.name),
                    i = r().escape(e.address),
                    o = r().escape(e.type),
                    s = r().escape(e.company_name);
                  return {
                    id: e.id,
                    additional_data: ['data-name="'.concat(n, '"'), 'data-address="'.concat(i, '"'), 'data-entity-id="'.concat(t, '"'), 'data-entity-type="'.concat(o, '"')].join(" "),
                    text: [n, s ? ', <span class="u-text-secondary">' + s + "</span>" : ""].join(""),
                    raw_highlight: !0
                  }
                }));
                n.trigger("suggest:reset", [t, ""])
              })) : (n.trigger("suggest:reset", [
                [], ""
              ]), this._elem("input").closest(".payer__item").removeClass("hidden"))
            }
          }
        }, {
          key: "_makeContactsRequest",
          value: function(e) {
            var t = this,
              n = e.entity,
              i = e.term,
              s = void 0 === i ? "" : i,
              a = o().Deferred();
            if (s.length >= 3 || 0 === s.length) {
              var l = n + "_" + s,
                c = "?type=".concat(n);
              "contacts_and_companies" === n && (c = "?type=contacts&contacts=all"), this._cache[l] ? a.resolve(this._cache[l]) : o().ajax({
                url: "/ajax/search/".concat(c, "&query_type=name").concat(s ? "&q=" + s : "")
              }).then((function(e) {
                var i = e.status,
                  o = e.result;
                if ("ok" !== i) return a.reject(o), void("companies" === n && t._elem("input").closest(".payer__item").removeClass("hidden"));
                t._cache[l] = r().map(o || [], (function(e) {
                  return {
                    id: e.id,
                    type: e.element_type === APP.element_types.contacts ? "contacts" : "companies",
                    name: e.name,
                    address: e.address || "",
                    company_name: e.company_name
                  }
                })), a.resolve(t._cache[l])
              }), a.reject)
            } else a.reject([]), "companies" === n && this._elem("input").closest(".payer__item").removeClass("hidden");
            return a.promise()
          }
        }, {
          key: "_onItemChosen",
          value: function(e, t) {
            var n = t.attr("data-entity-type");
            this._elem("input").closest(".payer__item").toggleClass("hidden", "contacts" === n), this._elem("vat_id").closest(".payer__item").toggleClass("hidden", "contacts" === n), this._elem("kpp").closest(".payer__item").toggleClass("hidden", "contacts" === n), this._elem("tax_registration_reason_code").closest(".payer__item").toggleClass("hidden", "contacts" === n), this._elem("name").val(t.attr("data-name")).trigger("change"), this._elem("address").val(t.attr("data-address")).trigger("change"), this._elem("phone").val(t.attr("data-phone")).trigger("change"), this._elem("email").val(t.attr("data-email")).trigger("change"), this._elem("vat_id").val(t.attr("data-vat_id") || "").trigger("change"), this._elem("kpp").val(t.attr("data-kpp") || "").trigger("change"), this._elem("tax_registration_reason_code").val(t.attr("data-tax_registration_reason_code") || "").trigger("change"), this._elem("input").val("").trigger("change"), this._elem("entity_id").val(t.attr("data-entity-id")).trigger("change"), this._elem("entity_type").val(n).trigger("change")
          }
        }, {
          key: "_onSuggestItemMouseDown",
          value: function(e) {
            o()(e.currentTarget).trigger("suggest:item:click-silent")
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "js-control-payer"
          }
        }], n && u(t.prototype, n), i && u(t, i), c
      }(l.default);
      const v = m.extend(m);
      var y = "../build/transpiled/interface/controls/payer";
      window.define(y, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([y])
    },
    105512: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => h
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(162262),
        l = n.n(a),
        c = n(445368),
        u = n(313445),
        d = n(89758);
      const h = u.default.extend({
        controlClassName: "js-control-pipeline-select_multiple-default",
        document_events: function() {
          var e = {};
          return e["change ".concat(this._selector("inner"), " ").concat(this._selector("pipeline_checkbox"))] = "onCheckAllPipelineStatuses", e["change ".concat(this._selector("inner"), " ").concat(this._selector("status_checkbox"))] = "onStatusCheckboxChange", r().extend({}, r().result(u.default.prototype, "document_events", {}), e)
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this.empty_caption = !0, u.default.prototype.initialize.apply(this, t), l().mixin(this, d.default)
        },
        updateFoldedCaption: function(e, t) {
          var n = (this._$inner || this.$el.children(this._selector("inner"))).find(this._selector("holder")).find(this._selector("pipeline_caption_text"));
          this.empty_caption = r().isUndefined(t) ? this.empty_caption : t, this.empty_caption && n.attr("data-folded-title", (0, c.i18n)("Active stages"))
        },
        onStatusCheckboxChange: function(e) {
          var t = o()(e.currentTarget).closest(this._selector("pipeline")),
            n = t.find(this._selector("status_checkbox")),
            i = t.find(this._selector("pipeline_checkbox")),
            s = o().makeArray(this.$('input:checked[name="filter[status_id][]"], input:checked[name^="filter[pipe]"]')).filter((function(e) {
              return e.checked
            })).map((function(e) {
              return {
                name: e.name,
                value: e.value
              }
            }));
          switch (i.trigger("controls:checkbox:minus", [!1]), n.filter((function() {
              return this.checked
            })).length) {
            case n.length:
              i[0].checked = !0;
              break;
            case 0:
              i[0].checked = !1;
              break;
            default:
              i.trigger("controls:checkbox:minus", [!0])
          }
          r().isEqual(s, this.getFilterStatuses()) ? this.updateFoldedCaption({}, !0) : this._updateFoldedCaption()
        }
      });
      var p = "../build/transpiled/interface/controls/pipeline_select/multiple_default";
      window.define(p, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([p])
    },
    266569: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => c
      });
      var i = n(629133),
        o = n.n(i),
        s = n(445368),
        r = n(105512),
        a = n(661533);
      n(368439);
      var l = {
        "filter[pipe][-1]": (0, s.i18n)("No active leads linked"),
        "filter[pipe][-2]": (0, s.i18n)("No leads linked")
      };
      const c = r.default.extend({
        controlClassName: "js-control-pipeline-select-without-leads",
        _selectors: function() {
          return o().extend({}, o().result(r.default.prototype, "_selectors", {}), {
            wo_leads_checkbox: ".js-without-leads-filter-checkbox input",
            wo_leads_holder: ".pipeline-select__without-leads-filter"
          })
        },
        document_events: function() {
          var e = o().extend({}, o().result(r.default.prototype, "document_events", {}));
          return e["change ".concat(this._selector("wo_leads_checkbox"))] = "_onWOLeadsCheckboxChange", e
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this._checked_wo_leads = [], r.default.prototype.initialize.apply(this, t)
        },
        _onWOLeadsCheckboxChange: function(e) {
          var t = this,
            n = a(e.currentTarget).closest(this._selector("wo_leads_holder"));
          this._checked_wo_leads = [], n.find(this._selector("wo_leads_checkbox")).each((function(e, n) {
            n.checked && t._checked_wo_leads.push(l[n.name])
          })), this._updateFoldedCaptionThrottled()
        },
        _captionCentrify: function() {
          r.default.prototype._captionCentrify.apply(this, arguments), this._$inner.scrollTop(this._$inner.scrollTop() + 29)
        },
        _getLeadsPseudoPipelineTitle: function(e, t) {
          var n = [e];
          return this._checked_wo_leads.length && (n = t ? o().union(this._checked_wo_leads, n) : this._checked_wo_leads), (0, s.capitalize)(n.join(", ").toLowerCase())
        },
        _getDefaultMultipleTitle: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return this._getLeadsPseudoPipelineTitle(r.default.prototype._getDefaultMultipleTitle.apply(this, t), !1)
        },
        _getFilledMultipleTitle: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return this._getLeadsPseudoPipelineTitle(r.default.prototype._getFilledMultipleTitle.apply(this, t), !0)
        },
        _afterHide: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          r.default.prototype._afterHide.apply(this, t), this._elem("wo_leads_checkbox").trigger("change")
        }
      });
      var u = "../build/transpiled/interface/controls/pipeline_select/without_leads_filter";
      window.define(u, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([u])
    },
    771205: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => c
      });
      var i = n(210734),
        o = n(7107),
        s = n(349384),
        r = n(652101),
        a = n(736478),
        l = n(285304);
      const c = i.default.extend({
        controlClassName: "control--select",
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var c = !this.$el.hasClass("control--select_react"),
            u = o.default;
          i.default.prototype.initialize.apply(this, t), c && (this.$el.attr("data-save-overflow") && (u = s.default), this.$el.hasClass("control--select-with-subtext") && (u = r.default), this.$el.hasClass("js-select-without-blur") && (u = a.SelectWithoutBlur), this.$el.hasClass("control--select-huge") && (u = l.default), this._addComponent(u, {
            el: this.el
          }))
        }
      });
      var u = "../build/transpiled/interface/controls/select/index";
      window.define(u, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([u])
    },
    285304: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => a
      });
      var i = n(460159),
        o = n.n(i),
        s = n(7107);

      function r(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      const a = s.default.extend({
        open: function() {
          if (!this.$fake_script) {
            this.$fake_script = this.$el.find("script");
            try {
              var e = JSON.parse(this.$fake_script.html());
              this.$el.find("ul").replaceWith(o()({
                ref: "/tmpl/controls/select/inner.twig"
              }).render((t = function(e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = null != arguments[t] ? arguments[t] : {},
                    i = Object.keys(n);
                  "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                    return Object.getOwnPropertyDescriptor(n, e).enumerable
                  })))), i.forEach((function(t) {
                    r(e, t, n[t])
                  }))
                }
                return e
              }({}, e), n = null != (n = {
                exclude_button_input: !0
              }) ? n : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : function(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(e);
                  n.push.apply(n, i)
                }
                return n
              }(Object(n)).forEach((function(e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
              })), t))), this._dropElemCache("list"), this.$fake_script.remove()
            } catch (e) {}
          }
          var t, n;
          s.default.prototype.open.apply(this, arguments)
        }
      })
    },
    652101: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => a
      });
      var i = n(629133),
        o = n.n(i),
        s = n(7107),
        r = n(661533);
      const a = s.default.extend({
        onInputChange: function(e) {
          var t, n = (this._elem("input").val() || "").toString(),
            i = this._elem("list").find(this._selector("item_by_value", n));
          i.length || (i = this._elem("list").find(this._selector("item_by_value", n.replace("+", " ")))), this._elem("list").find(this._selector("item_selected")).removeClass(this._class("item_selected")), i.length ? t = i : ((t = this._elem("list").find(this._selector("item_default"))).length || (t = this._elem("list").find("".concat(this._selector("item"), ":first"))), this._elem("input").val(t.attr("data-value"))), t.addClass(this._class("item_selected"));
          var s = t.attr("data-bg-color"),
            a = this._elem("button").css("background", s || "").toggleClass("control--select--button-colored", !!s).attr("data-value", t.attr("data-value")).children();
          o().each(a, (function(e) {
            var n = r(e);
            n.hasClass("control--select--button-inner") && n.text(t.find(".control--select--list--item-inner").text()), n.hasClass("control--select--button-inner-small") && n.text(t.attr("data-small-text"))
          })), "controls:change:visual" !== e.type && this._elem("input").change()
        }
      })
    },
    736478: (e, t, n) => {
      "use strict";

      function i(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function o(e, t, n) {
        return o = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = s(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, o(e, t, n || e)
      }

      function s(e) {
        return s = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, s(e)
      }

      function r(e, t) {
        return r = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, r(e, t)
      }

      function a(e) {
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
          var n, i = s(e);
          if (t) {
            var o = s(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      n.r(t), n.d(t, {
        SelectWithoutBlur: () => l
      });
      var l = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && r(e, t)
        }(c, e);
        var t, n, l = a(c);

        function c() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, c), l.apply(this, arguments)
        }
        return t = c, (n = [{
          key: "initialize",
          value: function(e) {
            o(s(c.prototype), "initialize", this).call(this, e || {})
          }
        }, {
          key: "onButtonOpenerBlur",
          value: function(e) {
            e.stopPropagation()
          }
        }]) && i(t.prototype, n), c
      }(n(7107).default)
    },
    13745: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => r
      });
      var i = n(661533),
        o = n.n(i),
        s = n(210734);
      const r = s.default.extend({
        controlClassName: "control-address",
        _in_edit: null,
        _classes: function() {
          return {
            focused: "control-address__wrapper_focused",
            blurred: "control-address__wrapper"
          }
        },
        _selectors: function() {
          return {
            field_with_input: ".control-address__field input",
            field_by_type: '.control-address__field[data-field-type="%s"]'
          }
        },
        events: {
          click: "startEdit",
          "focus :input": "startEdit",
          "address:edit": "startEdit",
          'change .control-address__field[data-field-type="country"] input': "checkChosenCountry"
        },
        document_events: {
          "controls:hide:private": "onHideControls",
          "escape:keydown": "onHideControls",
          "blur .control-address__wrapper_focused": "onHideControls"
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          s.default.prototype.initialize.apply(this, t), this.checkChosenCountry()
        },
        onHideControls: function(e, t) {
          var n, i = o()(e.target);
          if (n = "focusout" === e.type ? e.relatedTarget ? o()(e.relatedTarget).closest(".control-address") : this.$el : i.closest(".control-address"), "suggest" !== t) return !n.length || n.length && !n.get(0).isSameNode(this.el) ? this.stopEdit() : void 0
        },
        startEdit: function() {
          this._in_edit || (this._in_edit = !0, this.checkChosenCountry().changePlaceholders({
            num: 1
          }), this.$el.removeClass(this._classes().blurred).addClass(this._classes().focused))
        },
        stopEdit: function() {
          this._in_edit = !1, this.checkChosenCountry().changePlaceholders({
            num: 2
          }), this.$el.removeClass(this._classes().focused).addClass(this._classes().blurred)
        },
        changePlaceholders: function() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          return this._findElem("field_with_input").each((function(t, n) {
            var i = o()(n);
            i.attr("placeholder", i.attr("data-placeholder-".concat(e.num)))
          })), this
        },
        checkChosenCountry: function() {
          var e = this._findElem("field_by_type", "country"),
            t = e.find(".control--select"),
            n = e.find("input");
          return t.toggleClass("not_empty", !!n.val()), this
        }
      });
      var a = "../build/transpiled/interface/controls/smart_address";
      window.define(a, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([a])
    },
    74956: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => d
      });
      var i = n(629133),
        o = n.n(i),
        s = n(162262),
        r = n.n(s),
        a = n(445368),
        l = n(447366),
        c = n(89758),
        u = n(661533);
      n(368439), n(997150);
      const d = l.default.extend({
        controlClassName: "js-control-checkboxes_dropdown-statuses",
        initialize: function() {
          r().mixin(this, c.default), l.default.prototype.initialize.apply(this, arguments), this.setTitle({})
        },
        setTitle: function() {
          var e = this._findElem("checkboxes"),
            t = this._findElem("checkboxes_checked"),
            n = u.makeArray(this.$('input:checked[name="filter[status_id][]"], input:checked[name^="filter[pipe]"]')).filter((function(e) {
              return e.checked
            })).map((function(e) {
              return {
                name: e.name,
                value: e.value
              }
            }));
          o().isEqual(n, this.getFilterStatuses()) ? this._updateTitle([(0, a.i18n)("Active stages")]) : (this._updateMasterMinus(t, e), this._setTitle(t, e))
        }
      });
      var h = "../build/transpiled/interface/controls/statuses_select";
      window.define(h, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([h])
    },
    990108: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => P
      });
      var i, o, s, r, a = n(661533),
        l = n.n(a),
        c = n(629133),
        u = n.n(c),
        d = n(250202),
        h = n.n(d),
        p = n(445368),
        f = n(577486),
        _ = h().PhoneNumberFormat,
        g = h().PhoneNumberUtil.getInstance(),
        m = {
          cache: {}
        },
        v = {},
        y = l()(document),
        b = !1,
        w = /[^\d]/gi;
      m.filterData = function(e) {
        var t = [],
          n = !0,
          i = e.val,
          s = m.cache[e.cache_id],
          r = "n" === e.$this.attr("data-enable-filter");
        return s ? (o = s, n = !1, s.expire < (new Date).getTime() && (m.cache[e.cache_id] = void 0, s = void 0)) : o && o.cache_type_id === e.cache_type_id && i.indexOf(o.val) >= 0 && (s = o, u().keys(s.result).length || (n = !1)), s && s.result && (t = r ? s.result : u().filter(s.result, (function(t) {
          var n = (0, p.stripTags)(t.name || "").replace(/ё/gi, "е").toLowerCase(),
            o = u().compact(i.toLowerCase().split(" ")),
            s = [];
          switch (e.type) {
            case "email":
              return (n = t.email ? ((0, p.stripTags)(u().isArray(t.email) ? t.email.join(",") : t.email) || "").toString().toLowerCase() : "").indexOf(i.toLowerCase()) >= 0;
            case "phone":
              return (n = t.phone ? (0, p.stripTags)(u().isArray(t.phone) ? t.phone.join(",") : t.phone).replace(/[^\d]/gi, "") : "").indexOf(i.toLowerCase()) >= 0;
            case "leads_concat":
              return (s = u().filter(o, (function(e) {
                return t.text !== t.text.replace(new f.UnsafeRegExp("(\\s|[\\>\\@\\.\\)]|^)([^a-zа-яё0-9]*)(".concat(e, ")"), "gi"), "")
              }))).length === o.length;
            case "sku":
              return (t = u().find(t.custom_fields, (function(e) {
                return "SKU" === e.code
              }))) && (n = t.values[0].value, s = u().filter(o, (function(e) {
                return e = (0, p.escapeRegExp)(e), n !== n.replace(new f.UnsafeRegExp("(\\s|^)*([^a-zа-яё0-9]*)(".concat(e, ")"), "gi"), "")
              }))), s.length === o.length;
            default:
              return (s = u().filter(o, (function(e) {
                return e = (0, p.escapeRegExp)(e), n !== n.replace(new f.UnsafeRegExp("(\\s|^)*([^a-zа-яё0-9]*)(".concat(e, ")"), "gi"), "")
              }))).length === o.length
          }
        }))).length && (n = !1, m.last_ajax && m.last_ajax.abort()), {
          need_ajax: n,
          result: t.slice(0, 50),
          status: "ok"
        }
      }, m.highlight = function(e, t, n) {
        if (!e || !t) return t;
        var i = u().compact(e.trim().split(" ")),
          o = "";
        switch (n) {
          case "phone":
            o = e.replace(/([+*?)(=\-_&^:;%$#!{}|'"/.,@\\])/gi, ""), o = e.length < 50 ? o.replace(/(.)/gi, "$1[^\\d]*?").slice(0, -7) : o, t = t.replace(new f.UnsafeRegExp("(".concat(o.toLowerCase(), ")"), "gi"), "<b>$1</b>");
            break;
          case "email":
            o = e.replace(/(\\)/gi, ""), t = t.replace(new f.UnsafeRegExp("(".concat(o.toLowerCase(), ")"), "gi"), "<b>$1</b>");
            break;
          default:
            u().each(i, (function(e) {
              e = (0, p.escapeRegExp)(e), t = t.replace(new f.UnsafeRegExp("(?![^<]*?>|[^&]\\w+;)(?![^<]*?>)(".concat(e.toLowerCase(), ")(?![^<]*?>)"), "gi"), "<b>$1</b>")
            }))
        }
        return t
      }, m.getSuggests = function(e) {
        var t = m.filterData({
          cache_id: m.generateCacheId(e.$this, e.val),
          cache_type_id: m.generateCacheId(e.$this),
          val: e.val,
          type: e.type,
          $this: e.$this
        });
        t.need_ajax && !t.result.length || m.processData(t, e), t.need_ajax && m.throttledRequest(e)
      }, m.processData = function(e, t) {
        return (t.skip_val || m.getVal(t.$this)) && (m.hideLoader(t.$parent), t.$this.trigger("suggest:loaded", [e, t.$list])), e
      }, m.showLoader = function(e) {
        e.length && (e.hasClass("control--suggest-loading") || e.addClass("control--suggest-loading").append('<span class="control--suggest--loader spinner-icon"></span>'))
      }, m.hideLoader = function(e) {
        e.length && e.removeClass("control--suggest-loading").children(".control--suggest--loader").remove()
      }, m.sendRequest = function(e) {
        var t;
        m.last_ajax && u().isUndefined(m.last_ajax.status) && m.last_ajax.abort(), r && (m.showLoader(e.$parent), e.$this.attr("data-widget") ? (t = e.$this.attr("data-widget"), u().isFunction(APP.widgets.list[t].callbacks.searchDataInCard) && APP.widgets.list[t].callbacks.searchDataInCard(e.val, APP.data.current_card.element_type, APP.data.current_card.id).then(u().bind((function(t) {
          m.prepareData(e, {
            result: t || ""
          })
        }), this)).catch(u().bind((function(e) {
          console.error(e)
        }), this))) : m.last_ajax = l().ajax(u().extend({
          url: e.$this.attr("data-url"),
          data: e.$this.attr("data-params").toString().replace("#q#", encodeURIComponent(e.val)),
          val: e.val,
          dataType: "json"
        }, e.$this.attr("data-headers") ? {
          headers: JSON.parse(e.$this.attr("data-headers"))
        } : {})).done((function(t, n) {
          t && t.response && t.response.catalog_elements && (t = {
            result: t.response.catalog_elements
          }), t && t._embedded && t._embedded.elements && (t = {
            result: t._embedded.elements
          }), t || "nocontent" !== n || (t = {}), m.prepareData(e, t)
        })).fail((function() {
          m.hideLoader(e.$parent)
        })))
      }, m.prepareData = function(e, t) {
        var n = m.generateCacheId(e.$this, e.val),
          i = m.generateCacheId(e.$this),
          o = m.getVal(e.$this);
        e.no_filter ? m.processData(t, e) : (m.cache[n] = u().extend(t, {
          val: e.val,
          expire: (new Date).getTime() + 3e5
        }), m.processData(m.filterData({
          cache_id: n,
          cache_type_id: i,
          val: o,
          type: e.type,
          $this: e.$this
        }), e))
      }, m.generateCacheId = function(e, t) {
        return e.attr("data-url") + e.attr("data-params") + (t || "")
      }, m.keyboardHide = function() {
        APP.is_touch_device && document.activeElement && document.activeElement.blur()
      }, m.hideSuggest = function(e) {
        var t, n = !e;
        return !(!(e = e || r) || e.hasClass("catalog-fields__search")) && (t = e.find(".control--suggest--list-opened").length > 0, e.find(".control--suggest--list-opened").removeClass("control--suggest--list-opened").addClass("control--suggest--list").css("display", ""), e.css("z-index", "").trigger("suggest:hidden"), m.hideLoader(e), n && (r = !1), t)
      }, m.getVal = function(e) {
        var t, n = l().trim(e.val()) || "";
        if ("phone" === e.attr("data-type"))
          if ((n = [0 === n.indexOf("+") ? "+" : "", n.replace(w, "")].join("")).length <= 15 && h().PhoneNumberUtil.isViablePhoneNumber(n)) {
            var i = function(e) {
              try {
                return g.parseAndKeepRawInput(e)
              } catch (t) {
                try {
                  return g.parseAndKeepRawInput(e, APP.constant("account").country)
                } catch (e) {
                  return null
                }
              }
            }(n);
            i && (t = i, n = g.format(t, _.E164).toString().replace("+".concat(t.getCountryCode()), ""))
          } else n.replace(w, "").toString();
        return n.toLowerCase().replace(/ё/gi, "е")
      }, m.reset = function(e, t, n, i) {
        var o, s = t.closest(".control--suggest"),
          a = s.find(".control--suggest--input"),
          c = a.val(),
          d = "";
        u().isFunction(i) ? l().each(n, (function(e, t) {
          d += i(t)
        })) : (o = u().template(i || '<li data-value-id="<%= data.id %>" company-id ="<%= data.company_id %>" data-contact-id="<%= data.contact_id %>" class="control--suggest--list--item <%= data.custom_class %>" <%= data.additional_data %>><span class="control--suggest--list--item-inner" title="<%= _.escape(data.title) %>"><%= data.highlighted_text %></span></li>'), l().each(n, (function(e, t) {
          var n = (t.text || "").replace(/<\/?b>/gi, "").replace(/ё/gi, "е");
          t.raw_highlight || (n = u().escape(n)), d += o({
            data: u().extend({}, t, {
              highlighted_text: m.highlight(c, n, s.find(".control--suggest--input").attr("data-type")),
              title: (0, p.stripTags)(t.title ? t.title : t.text)
            })
          })
        }))), t.html(d), d.length && (a.is(":focus") || "hidden" === a.attr("type")) ? (t.removeClass("control--suggest--list").addClass("control--suggest--list-opened"), s.css("z-index", parseInt(s.css("z-index")) + 2), m.hideLoader(s), r = s) : m.hideSuggest(s)
      }, m.throttledRequest = u().throttle((function(e) {
        m.sendRequest({
          type: e.type,
          no_filter: e.no_filter,
          $this: e.$this,
          $parent: e.$parent,
          $list: e.$list,
          skip_val: e.skip_val,
          val: e.val
        })
      }), 700), v[40] = function(e) {
        var t, n, i;
        e.$selected.length ? (e.$selected.is(":last-child") || (t = e.$selected.siblings(".".concat(e.item_class, ":visible")).andSelf().index(e.$selected)) < e.$list.find(".".concat(e.item_class, ":visible")).length - 1 && (i = e.$list.find(".".concat(e.item_class, ":visible:eq(").concat(t + 1, ")")), e.$selected.removeClass("".concat(e.item_class, "-selected")), i.hasClass("js--suggest-item--not-selectable") ? e.$selected = i.nextUntil(".".concat(e.item_class, ":visible:first:not(.js--suggest-item--not-selectable)")).addClass("".concat(e.item_class, "-selected")) : e.$selected = e.$list.find(".".concat(e.item_class, ":visible:eq(").concat(t + 1, ")")).addClass("".concat(e.item_class, "-selected"))), e.$selected.position().top + e.$selected.outerHeight() > e.$list.height() && (n = e.$selected.position().top - e.$list.height() + e.$selected.outerHeight() + e.$list.scrollTop())) : (i = e.$list.find(".".concat(e.item_class, ":visible:first"))).hasClass("js--suggest-item--not-selectable") ? i.next(".".concat(e.item_class, ":visible:first:not(.js--suggest-item--not-selectable)")).addClass("".concat(e.item_class, "-selected")) : i.addClass("".concat(e.item_class, "-selected")), e.$list.scrollTop(n)
      }, v[38] = function(e) {
        var t, n, i = e.$list.scrollTop();
        if (!e.$selected.length) return !1;
        e.$selected.is(":first-child") || (t = e.$selected.siblings(".".concat(e.item_class, ":visible")).andSelf().index(e.$selected), n = e.$list.find(".".concat(e.item_class, ":visible:eq(").concat(t - 1, ")")), t > 0 && (e.$selected.removeClass("".concat(e.item_class, "-selected")), n.hasClass("js--suggest-item--not-selectable") && n.prev(".".concat(e.item_class, ":visible:not(.js--suggest-item--not-selectable)")).length ? e.$selected = n.prev(".".concat(e.item_class, ":visible:not(.js--suggest-item--not-selectable)")).addClass("".concat(e.item_class, "-selected")) : e.$selected = n.addClass("".concat(e.item_class, "-selected"))), e.$selected.position().top - e.$selected.outerHeight() < 0 && 0 !== e.$list.scrollTop() && (i += e.$selected.position().top)), e.$list.scrollTop(i)
      }, v[13] = function(e) {
        if (e.$selected.length) return e.$selected.trigger("suggest:item:click"), !1
      }, v[27] = function(e) {
        m.processData({
          result: []
        }, e)
      }, y.on("page:changed", (function() {
        m.cache = {}
      })).on("keyboard:hide", m.keyboardHide).on("controls:hide:private", (function(e) {
        r && r.get(0) !== e.target && m.hideSuggest() && m.keyboardHide()
      })).on("click focus", ".control--suggest--input", (function(e) {
        var t, n, i, o = l()(this),
          s = o.closest(".control--suggest");
        APP.is_touch_device && "focus" !== e.type || l()(document).trigger({
          type: "controls:hide",
          target: s
        }), r = s, s.find(".control--suggest--list--item").length && !o.hasClass("js-control--suggest--input-ajax") && (s.css("z-index", parseInt(s.css("z-index")) + 1), (t = s.find(".control--suggest--list, .control--suggest--list-opened").removeClass("at-top control--suggest--list").addClass("control--suggest--list-opened").css("display", "")).visible() || t.addClass("at-top"), i = (n = t.find(".control--suggest--list--item-selected").index()) >= 0 && t.find(".control--suggest--list--item:first").outerHeight(), s.find(".control--suggest--list--item").each((function() {
          l()(this).show()
        })), i && n >= 0 && t.scrollTop(i * n - 4 * i)), o.trigger("controls:suggest:focus"), e.stopPropagation()
      })).on("input", ".js-control--suggest--input", (function() {
        var e = l()(this),
          t = e.closest(".control--suggest"),
          n = t.find(".control--suggest--list--item"),
          i = t.find(".js-control--suggest--list"),
          o = m.getVal(e),
          s = !0;
        e.is(":focus") && (i.show().removeClass("control--suggest--list").addClass("control--suggest--list-opened"), o ? (n.each((function() {
          var e = l()(this),
            n = (l().trim(e.text()) || "").toLowerCase(),
            i = n.indexOf(o);
          0 === i || 0 === n.indexOf("0".concat(o)) || t.hasClass("js-substr-search") && -1 !== i ? (s = !1, e.show()) : (e.hide(), e.hasClass("control--suggest--list--item-selected") && e.removeClass("control--suggest--list--item-selected"))
        })), s && i.hide()) : n.length ? n.show() : i.hide())
      })).on("suggest:reset", ".js-control--suggest--list", (function(e, t, n) {
        m.reset(e, l()(this), t, n)
      })).on("mousedown", ".control--suggest--list--item", (function() {
        s = !0
      })).on("blur", ".js-control--suggest--input-ajax", (function() {
        var e = this,
          t = l()(this).closest(".control--suggest");
        m.hideLoader(t), s || setTimeout((function() {
          m.hideSuggest(t), l()(e).trigger("controls:suggest:blur")
        }), 100)
      })).on("suggest:loader", ".js-control--suggest--input, .js-control--suggest--input-ajax", (function(e, t) {
        var n = l()(e.currentTarget).closest(".control--suggest");
        !1 === t ? m.hideLoader(n) : m.showLoader(n)
      })).on("input suggest:load-empty", ".js-control--suggest--input-ajax", (function(e) {
        var t = l()(this),
          n = t.closest(".control--suggest"),
          i = n.find(".js-control--suggest--list"),
          o = m.getVal(t);
        s = !1, o.length >= 3 || "suggest:load-empty" === e.type ? (r = n, i.html("").removeClass("control--suggest--list-opened").addClass("control--suggest--list"), t.attr("data-val", o), m.getSuggests({
          type: t.attr("data-type"),
          no_filter: Boolean(t.attr("data-no-filter")) || !1,
          $this: t,
          $parent: n,
          $list: i,
          val: o,
          skip_val: "suggest:load-empty" === e.type
        })) : l()(document).trigger({
          type: "controls:hide",
          target: n
        })
      })).on("click suggest:item:click suggest:item:click-silent", ".control--suggest--list--item", (function(e) {
        var t = l()(this),
          n = t.closest(".control--suggest"),
          i = n.find(".control--suggest--input");
        if (t.hasClass("js--suggest-item--not-selectable")) return !1;
        e.stopPropagation(), n.find(".control--suggest--list--item-selected").removeClass("control--suggest--list--item-selected"), t.addClass("control--suggest--list--item-selected"), i.val(l().trim(t.text())).attr("data-value-id", t.attr("data-value-id")).trigger("controls:change").trigger("suggest:changed", [t.clone()]), "suggest:item:click-silent" !== e.type && i.trigger("focus"), t.trigger("suggest:click", [t]), m.hideSuggest(), s = !1
      })), y.on("mousemove", ".control--suggest--list-opened", (function() {
        var e = l()(this);
        b || e.removeClass("control--suggest--list-navigate-by-key").find(".control--suggest--list--item-selected").removeClass("control--suggest--list--item-selected")
      })).on("keyup", ".control--suggest--input", (function() {
        i = setTimeout((function() {
          b = !1
        }), 100)
      })).on("keydown", ".control--suggest--input", (function(e) {
        var t, n, o = l()(this),
          s = !o.hasClass("control--suggest--input"),
          r = s ? o.closest(".multisuggest").find(".multisuggest__suggest") : o.closest(".control--suggest").find(".control--suggest--list-opened"),
          a = s ? "multisuggest__suggest__item" : "control--suggest--list--item";
        if (r.length && r.is(":visible") && u().isFunction(v[e.keyCode])) return clearTimeout(i), b = !0, n = r.find(".".concat(a, ":hover")), (t = r.find(".".concat(a, "-selected"))).length || (t = n), r.addClass("control--suggest--list-navigate-by-key"), v[e.keyCode]({
          $this: o,
          $parent: o.closest("control--suggest"),
          $selected: t,
          $list: r,
          item_class: a
        }), !1
      }));
      const P = m;
      var E = "../build/transpiled/interface/controls/suggest";
      window.define(E, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([E])
    },
    305093: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => P
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(445368),
        l = n(862430),
        c = n(771205),
        u = n(661533);

      function d(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
      }

      function h(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function p(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              h(s, i, o, r, a, "next", e)
            }

            function a(e) {
              h(s, i, o, r, a, "throw", e)
            }
            r(void 0)
          }))
        }
      }

      function f(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function _(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function g(e, t, n) {
        return g = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = m(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, g(e, t, n || e)
      }

      function m(e) {
        return m = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, m(e)
      }

      function v(e, t) {
        return v = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, v(e, t)
      }

      function y(e) {
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
          var n, i = m(e);
          if (t) {
            var o = m(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? d(e) : t;
            var n
          }(this, n)
        }
      }

      function b(e, t) {
        var n, i, o, s, r = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return s = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this
        }), s;

        function a(s) {
          return function(a) {
            return function(s) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; r;) try {
                if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                  case 0:
                  case 1:
                    o = s;
                    break;
                  case 4:
                    return r.label++, {
                      value: s[1],
                      done: !1
                    };
                  case 5:
                    r.label++, i = s[1], s = [0];
                    continue;
                  case 7:
                    s = r.ops.pop(), r.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                      r = 0;
                      continue
                    }
                    if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                      r.label = s[1];
                      break
                    }
                    if (6 === s[0] && r.label < o[1]) {
                      r.label = o[1], o = s;
                      break
                    }
                    if (o && r.label < o[2]) {
                      r.label = o[2], r.ops.push(s);
                      break
                    }
                    o[2] && r.ops.pop(), r.trys.pop();
                    continue
                }
                s = t.call(e, r)
              } catch (e) {
                s = [6, e], i = 0
              } finally {
                n = o = 0
              }
              if (5 & s[0]) throw s[1];
              return {
                value: s[0] ? s[1] : void 0,
                done: !0
              }
            }([s, a])
          }
        }
      }
      var w = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && v(e, t)
        }(c, e);
        var t, n, i, s = y(c);

        function c() {
          var e;
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, c), _(d(e = s.apply(this, arguments)), "_is_new_element", void 0), _(d(e), "_is_disabled", void 0), e
        }
        return t = c, n = [{
          key: "template",
          get: function() {
            return "/tmpl/controls/select.twig"
          }
        }, {
          key: "events",
          value: function() {
            var e;
            return _(e = {}, "supplier:set-is-new-element ".concat(this._selector("special_select_input")), "_setIsNewElement"), _(e, "supplier:set-is-supplier-disabled ".concat(this._selector("special_select_input")), "_setIsSelectDisabled"), _(e, "controls:change ".concat(this._selector("special_select_input")), "handleSelectChange"), e
          }
        }, {
          key: "_classes",
          value: function() {
            return o().extend({}, g(m(c.prototype), "_classes", this).call(this), {
              supplier_form: "linked-form__field-supplier",
              list_item: "control--select--list--item",
              list_item_selected: "control--select--list--item-selected",
              select_button: "control--select--button",
              select_input: "control--select--input",
              special_select_input: "js-supplier-input"
            })
          }
        }, {
          key: "_preload",
          value: function() {
            return r()._preload([this.template])()
          }
        }, {
          key: "initialize",
          value: function() {
            g(m(c.prototype), "initialize", this).apply(this, arguments), this._suppliers_collection = this._addComponent(l.default), this.render()
          }
        }, {
          key: "render",
          value: function() {
            var e = this;
            return p((function() {
              return b(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return [4, e._preload()];
                  case 1:
                    return t.sent(), e.$el.trigger("supplier:controls:view:init"), e._render(), [2]
                }
              }))
            }))()
          }
        }, {
          key: "_render",
          value: function() {
            this._setSuppliersSelect(APP.constant("account").suppliers.catalog_id)
          }
        }, {
          key: "destroy",
          value: function() {
            g(m(c.prototype), "destroy", this).apply(this, arguments)
          }
        }, {
          key: "_setSuppliersSelect",
          value: function(e) {
            var t = this;
            return p((function() {
              return b(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return [4, t._suppliers_collection.fetch({
                      url: t._suppliers_collection.url(e),
                      data: {
                        limit: 50
                      }
                    })];
                  case 1:
                    return n.sent(), t._suppliers_collection.length && t._rerenderSuppliersSelectField(), [2]
                }
              }))
            }))()
          }
        }, {
          key: "handleSelectChange",
          value: function() {
            this._setSuppliersSelect(APP.constant("account").suppliers.catalog_id)
          }
        }, {
          key: "_setIsNewElement",
          value: function(e, t) {
            this._is_new_element = t
          }
        }, {
          key: "_setIsSelectDisabled",
          value: function(e, t) {
            this._is_disabled = t
          }
        }, {
          key: "_rerenderSuppliersSelectField",
          value: function() {
            var e = this._elem("select_input"),
              t = this._suppliers_collection.map((function(e) {
                return {
                  id: parseInt(e.get("id")),
                  option: e.get("name")
                }
              })),
              n = e.val();
            t.unshift({
              id: "",
              option: (0, a.i18n)("Select")
            }), e.val().length || (n = this._is_new_element ? t[1].id : "");
            var i = u(r()({
              ref: this.template
            }).render({
              name: e.attr("name"),
              class_name: "linked-form__select",
              items: t,
              selected: n,
              disabled: this._is_disabled || !1,
              input_special_class: this._class("special_select_input")
            }));
            this.$el.html(i), this.setElement(this.$el), this._dropElemCache(), this._elem("select_input").trigger("change")
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "js-control-supplier"
          }
        }], n && f(t.prototype, n), i && f(t, i), c
      }(c.default);
      const P = w.extend(w);
      var E = "../build/transpiled/interface/controls/supplier";
      window.define(E, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([E])
    },
    862430: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => s
      });
      var i = n(974839),
        o = n.n(i);
      const s = (0, n(727406).wrapCacheCollection)(o().Collection.extend({
        itemRel: "elements",
        url: function(e) {
          return "/ajax/v4/catalogs/".concat(e, "/elements")
        }
      }));
      var r = "../build/transpiled/interface/controls/suppliers_collection";
      window.define(r, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([r])
    },
    97418: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => d
      });
      var i = n(629133),
        o = n.n(i),
        s = n(161320),
        r = n.n(s),
        a = n(49987),
        l = n(727526),
        c = n(661533),
        u = n(403474);
      const d = l.default.extend({
        controlClassName: "js-control-date-tasks-date",
        _getDefaults: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var i = this.$el.attr("data-calendar-id"),
            s = c("#tasks_date_calendar_".concat(i));
          return s || (s = this.$el), o().extend({}, l.default.prototype._getDefaults.apply(this, t), {
            selected: this._findElem("input").val(),
            attachTo: s.get(0)
          })
        },
        _getKalendaeHandler: function() {
          return u
        },
        _classes: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          return o().extend({}, l.default.prototype._classes.apply(this, t), {
            date_field: "tasks-date__controls-date-input",
            input: "tasks-date__controls-date-input",
            input_not_valid: "date_field_not-valid"
          })
        },
        events: function() {
          var e = o().extend({}, o().result(l.default.prototype, "events", {}));
          return e["input ".concat(this._selector("input"))] = "_onDateInput", e["blur ".concat(this._selector("input"))] = "reformatOnBlur", e["keyup ".concat(this._selector("input"))] = "_hideCalendarOnEnterKey", e
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          l.default.prototype.initialize.apply(this, t), this.container()
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          l.default.prototype.destroy.apply(this, t), this.$container && this.$container.remove()
        },
        _hideCalendarOnEnterKey: function(e) {
          13 !== e.keyCode || this._findElem("input").hasClass(this._class("input_not_valid")) || (this._findElem("input").val(this._findElem("input").val()).trigger("controls:change", [this._findElem("input").val()]), this.$el.trigger("control:date:selected"))
        },
        _onDateInput: function() {
          var e = this._findElem("input").val();
          this.validateSelected() && e.length > 5 && (e = r()(e, (0, a.format)("parse")).format((0, a.format)("date")), this.kalendae.setSelected(e)), this._findElem("input").trigger("controls:change", [e])
        },
        container: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var i, o = this;
          return this.$container || (l.default.prototype.container.apply(this, t), i = this.kalendae.draw, this.kalendae.draw = function() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            var s = i.apply(this, t);
            return o._addTwoWeeks(), s
          }, this._addTwoWeeks()), this.$container
        },
        onChangeSingle: function() {
          this.kalendae && this._elem("date_field").trigger("controls:change", [this.kalendae.getSelected()])
        },
        validateSelected: function() {
          var e = !0,
            t = r()(this._findElem("input").val(), (0, a.format)("parse"));
          return this._findElem("input").removeClass(this._class("input_not_valid")), (!t.isValid() || t.format("X") < 0) && (e = !1, this._findElem("input").addClass(this._class("input_not_valid"))), e
        },
        _addTwoWeeks: function() {
          var e = c(this.kalendae.container),
            t = {
              append: o().range(1, 15, 1)
            };
          e.find(".k-fake-date").remove();
          var n = e.find(".k-days span"),
            i = "YYYY-MM-DD",
            s = r()(n.first().attr("data-date"), i);
          s.month() === this.kalendae.viewStartDate.month() && (s.subtract(1, "month").endOf("month"), t.append = !1);
          var a = r()(n.last().attr("data-date"), i);
          a.month() === this.kalendae.viewStartDate.month() && (s.add(1, "month").startOf("month"), t.prepend = !1), o().each(t, (function(t, r) {
            t && e.find(".k-days")[r](o().map(t, (function(e) {
              var t = ("prepend" === r ? s : a).clone()["prepend" === r ? "subtract" : "add"](e, "days");
              return n.first().clone().removeClass("k-in-month k-selected k-today").addClass("k-out-of-month k-fake-date").attr("data-date", t.format(i)).text(t.format("D")).get(0).outerHTML
            })).join(""))
          }), this), e.find(".k-days").children("span").each((function(e, t) {
            var n = c(t);
            n.toggleClass("k-before-today", r()(n.attr("data-date")).isBefore(r()().startOf("day")))
          }))
        }
      });
      var h = "../build/transpiled/interface/controls/tasks_date/date";
      window.define(h, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([h])
    },
    461431: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => _
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(161320),
        l = n.n(a),
        c = n(180137),
        u = n(214558),
        d = n(982862),
        h = n(210734),
        p = n(893381),
        f = n(661533);
      n(97418);
      const _ = h.default.extend({
        controlClassName: "tasks-date",
        _classes: function() {
          return {
            time: "tasks-date__controls-time",
            time_input: "tasks-date__controls-time-input",
            date: "js-control-date-tasks-date",
            date_input: "tasks-date__controls-date-input",
            preset: "js-tasks-date-preset",
            wrapper: "tasks-date__wrapper",
            wrapper_inner: "tasks-date__wrapper-inner",
            list: "tasks-date__list",
            caption: "tasks-date__caption",
            caption_date: "tasks-date__caption-date",
            caption_time: "tasks-date__caption-time"
          }
        },
        _selectors: function() {
          return {
            timeline_scroller_wrapper: ".fc-agenda-view .fc-body > tr > .fc-widget-content"
          }
        },
        events: {
          "click .tasks-date__caption-date": "onCaptionClick",
          "click .tasks-date__caption-time": "onCaptionClick"
        },
        document_events: {
          toggleWidgetPanel: "_setPositions",
          "controls:hide:private": "onDocumentClickHide"
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          h.default.prototype.initialize.apply(this, t), this._cached_tasks = {}, this._$body_control = this._elem("wrapper"), this._$body_control.on("click", ".tasks-date__controls, .tasks-date__wrapper-inner", o().bind((function(e) {
            e.stopPropagation()
          }), this)).on("click", o().bind((function(e) {
            e.stopPropagation(), this._$document.trigger({
              type: "controls:hide",
              target: this._$body_control
            })
          }), this)).on("focus", [this._selector("time_input"), this._selector("date_input")].join(","), o().bind(this.onInputFocusPlaceCursorToEnd)).on("input", this._selector("time_input"), o().bind(this.onTimeInputChange, this)).on("controls:ajust", this._selector("time_input"), o().bind(this.onTimeInputAjust, this)).on("controls:change", this._selector("date_input"), o().bind(this.onDateInputChange, this)).on("click", this._selector("preset"), o().bind(this.onDatePresetClick, this))
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this._$body_control.off(), this.$overlay && this.$overlay.off(), h.default.prototype.destroy.apply(this, t)
        },
        onDateInputChange: function(e) {
          var t = e.currentTarget.value,
            n = l()(t, APP.system.format.date.date),
            i = this._getFullCalendarEl();
          n.isSame(l()().tz(APP.system.timezone), "day") ? t = n.format(l()().localeData().calendar("today")) : n.isSame(l()().tz(APP.system.timezone).add(1, "days"), "day") ? t = n.format(l()().localeData().calendar("tomorrow")) : n.isSame(l()().tz(APP.system.timezone).subtract(1, "days"), "day") ? t = n.format(l()().localeData().calendar("yesterday")) : n.isSame(l()().add(1, "week")) ? t = APP.lang.tasks_period_next_week : n.isSame(l()().add(1, "month")) && (t = APP.lang.tasks_period_next_month), this._elem("caption_date").text(t), i && i.fullCalendar("gotoDate", n)
        },
        onInputFocusPlaceCursorToEnd: function(e) {
          (0, d.setCursorPosition)(e.currentTarget)
        },
        onTimeInputChange: function() {
          this.onTimeInputAjust(), this._updateNewEvent(), this._updateScrollTop()
        },
        onTimeInputAjust: function() {
          var e = this._$body_control.find(this._selector("time_input")).val();
          this._elem("caption_time").attr("data-hide-time", e ? 0 : 1).text(e), this._syncTimeWidth()
        },
        onDatePresetClick: function(e) {
          var t = f(e.currentTarget),
            n = this._$body_control.find(this._selector("date_input")).trigger("controls:date").data("kalendae"),
            i = t.attr("data-period"),
            s = o().contains(["after_15_minutes", "after_30_minutes", "in_an_hour"], i),
            r = (0, p.default)(i);
          e.stopPropagation(), (0, c.saveLastPreset)(i), n.setSelected(r), s && this._getFullCalendarEl().fullCalendar("select", r, r.clone().add(30, "minutes")), this._$body_control.find(this._selector("date_input")).val(r.format(APP.system.format.date.date)).trigger("controls:change", [n.getSelected()]), this.hide()
        },
        onCaptionClick: function(e) {
          var t = f(e.currentTarget);
          t.hasClass("tasks-date__caption__disabled") || (this._expanded ? this._$document.trigger({
            type: "controls:hide",
            target: this.el
          }) : this.show(), (t.hasClass(this._class("caption_date")) ? this._$body_control.find(this._selector("date_input")) : this._$body_control.find(this._selector("time_input"))).focus()), e.stopPropagation()
        },
        onDocumentClickHide: function(e) {
          this._$body_control.length && !f.contains(this._$body_control.get(0), e.target) && this.hide()
        },
        show: function() {
          this._$document.trigger({
            type: "controls:hide",
            target: this.el
          }), this._expanded = !0, this.$el.addClass("expanded"), this._$body_control.addClass("expanded"), this._setPositions(), this._$window.on("resize".concat(this.ns), o().bind(o().debounce(this._setPositions, 100), this)), this._$body_control.find(".js-tasks-date-input-bg").css("background", this._findElem("caption_date").css("background-color")), this._$body_control.one("controls:view:init", this._selector("time_input"), o().bind(this._syncTimeWidth, this)), this._syncTimeWidth(), n.e(48089).then(function() {
            var e = [n(248089)];
            o().bind(this._initTimeplanner, this).apply(null, e)
          }.bind(this)).catch(n.oe), this._toggleBodyOverlay(this._$body_control, this.hide)
        },
        hide: function() {
          var e = this._getFullCalendarEl();
          this._expanded && (e && e.fullCalendar("destroy"), this._toggleBodyOverlay(!1), this._expanded = !1, this.$el.removeClass("expanded"), this._updateInputValues(), this._$window.off("resize".concat(this.ns)), this._$body_control.removeClass("expanded").css({
            width: "",
            top: "",
            left: "",
            zIndex: ""
          }))
        },
        _getCalendarHeight: function() {
          var e = 349,
            t = this._$body_control.get(0).getBoundingClientRect();
          return t.y < 0 && (e += t.y - 10), e
        },
        _setPositions: function() {
          var e = this.$el.offset().top,
            t = this._getFullCalendarEl(),
            n = "";
          this._$body_control.removeClass("at-top").find(this._selector("wrapper_inner")).css("margin-left", ""), t && t.fullCalendar("option", "contentHeight", 349);
          var i = this._$body_control.get(0).getBoundingClientRect();
          i.bottom > this._$window.height() && (this._$body_control.addClass("at-top"), e += this._$body_control.find(".tasks-date__controls").height()), i.x < 0 ? n = Math.abs(i.x) : this._$window.width() - i.right < 0 && (n = this._$window.width() - i.right - 15), this._$body_control.css({
            width: this._$body_control.get(0).offsetWidth,
            top: e,
            left: this.$el.offset().left,
            zIndex: this._maxControlBodyZIndex
          }).find(this._selector("wrapper_inner")).css("margin-left", n), t && t.fullCalendar("option", "contentHeight", this._getCalendarHeight())
        },
        _getFullCalendarEl: function() {
          return f.fn.fullCalendar ? this._$body_control.find(".js-tasks-date-timeplanner") : null
        },
        _initTimeplanner: function() {
          this._expanded && (this._$body_control.find(".js-tasks-date-timeplanner").fullCalendar({
            header: !1,
            defaultView: "agendaDay",
            contentHeight: this._getCalendarHeight(),
            handleWindowResize: !0,
            eventStartEditable: !0,
            allDayText: APP.lang.tasks_all_day,
            axisFormat: 24 === APP.system.format.time ? "HH:mm" : "h:mmA",
            selectable: !0,
            draggable: !0,
            forceEventDuration: !0,
            dragRevertDuration: 100,
            timeFormat: APP.system.format.date.time,
            defaultTimedEventDuration: "00:30:00",
            defaultDate: l()(this._$body_control.find(this._selector("date_input")).val(), APP.system.format.date.date),
            scrollTime: "08:00:00",
            events: o().bind(this._fetchTasks, this),
            eventDrop: o().bind(this._handleTimelineEventChange, this),
            eventResize: o().bind(this._handleTimelineEventChange, this),
            select: o().bind(this._handleTimelineSelect, this)
          }), this._setPositions(), this._$body_control.find(this._selector("time_input")).val() && this._updateScrollTop())
        },
        _handleTimelineEventChange: function(e, t, n) {
          var i = APP.system.format.date.date,
            o = [e.start.format(APP.system.format.date.time)],
            s = "";
          if (n && e.end && e.start.format(i) !== e.end.format(i)) return n();
          e.allDay ? o = [] : e.end && o.push(e.end.format(APP.system.format.date.time)), o.length && (s = o.join(" - ")), this._$body_control.find(this._selector("time_input")).val(s).trigger("controls:ajust")
        },
        _handleTimelineSelect: function(e, t) {
          this._handleTimelineEventChange({
            allDay: "00:00" === e.format("HH:mm") && "00:00" === t.format("HH:mm"),
            start: e,
            end: t
          }), this._updateNewEvent(), this._getFullCalendarEl().fullCalendar("unselect")
        },
        _fetchTasks: function(e, t, n, i) {
          var s = e.startOf("day").format(APP.system.format.date.date),
            r = e.endOf("day").format(APP.system.format.date.date),
            a = this.$el.attr("data-responsible") || (0, u.get)("current").id,
            c = s + r + a;
          this._cached_tasks[c] ? i(this._cached_tasks[c]) : f.ajax({
            url: "/ajax/todo/calendar/day/",
            dataType: "json",
            data: {
              dont_save: 1,
              filter_date_from: s,
              filter_date_to: r,
              filter: {
                main_user: [a]
              }
            }
          }).done(o().bind((function(e) {
            var t = e && e.response || {},
              n = parseInt(this.$el.attr("data-id"));
            this._cached_tasks[c] = o().reduce(t.items, (function(e, t) {
              var i, o, s, r = null;
              return parseInt(t.id) !== n && (i = t.date.split(" "), o = this._validateTime(i[1]), s = l()(i[0], APP.system.format.date.date), o.length && s.hours(o[0].hours()).minutes(o[0].minutes()), t.duration && (r = s.clone().add(t.duration, "seconds")), e.push({
                id: t.id,
                title: this._getTaskTypeNameWithComment(t.params.type, t.params.text),
                allDay: 23 === s.hours() && 59 === s.minutes(),
                start: s,
                end: r,
                startEditable: !1,
                expired: !1,
                draggable: !1,
                durationEditable: !1,
                backgroundColor: "#f7f7f7",
                borderColor: "#f1f1f1"
              })), e
            }), [], this), i(this._cached_tasks[c])
          }), this)), this._updateNewEvent()
        },
        _updateInputValues: function() {
          var e = this._validateTime(this._findElem("time_input").val());
          switch (this._findElem("date_input").trigger("controls:change"), e.length) {
            case 2:
              this.$('[name="duration"]').val(e[1].diff(e[0], "seconds")), this.$('[name="time"]').val(e[0].format(APP.system.format.date.time));
              break;
            case 1:
              this.$('[name="duration"]').val(""), this.$('[name="time"]').val(e[0].format(APP.system.format.date.time));
              break;
            default:
              this.$('[name="duration"]').val(""), this.$('[name="time"]').val(l()("23:59", "HH:mm").format(APP.system.format.date.time))
          }
          this.$('[name="duration"], [name="time"]').trigger("controls:change")
        },
        _updateScrollTop: function() {
          var e, t, n = this._getFullCalendarEl();
          n && (e = n.find(".fc-scroller"), (t = n.fullCalendar("clientEvents", ["new"])[0]) && setTimeout((function() {
            e.get(0) && e.scrollTop(e.get(0).scrollHeight * (t.start.hours() - .5) / 24)
          })))
        },
        _updateNewEvent: function() {
          var e = this._getFullCalendarEl(),
            t = this._$body_control.find(this._selector("date_input")).val(),
            n = t ? l()(t, APP.system.format.date.date) : l()(),
            i = this._validateTime(this._$body_control.find(this._selector("time_input")).val()),
            s = null,
            r = {};
          n.isValid() && (i.length && (n.set("hour", i[0].hours()).set("minute", i[0].minutes()), i[1] && (s = n.clone().set("hour", i[1].hours()).set("minute", i[1].minutes()))), o().extend(r, {
            allDay: !i[0],
            end: s || n,
            start: n
          })), e && (e.fullCalendar("removeEvents", "new"), e.fullCalendar("renderEvent", o().extend({
            id: "new",
            title: this._getTaskTypeNameWithComment(this.$el.attr("data-type"), this.$el.attr("data-title"), this.$el.attr("data-type-name")),
            expired: !1,
            draggable: !0,
            durationEditable: !0,
            backgroundColor: "#e9f1ff",
            borderColor: "#dce8ff"
          }, r))), this.$el.trigger("tasks-date:date-changed", [n]).trigger("tasks-date:time-changed", [i])
        },
        _syncTimeWidth: function() {
          this._findElem("caption_time").css({
            width: this._$body_control.find(this._selector("time")).get(0).offsetWidth
          })
        },
        _validateTime: function(e) {
          var t = (e || "").split(/\s?-\s?/),
            n = APP.system.format.date.time,
            i = [];
          if (!t.length) return i;
          var o = t[0] && l()(t[0], n),
            s = t[1] && l()(t[1], n);
          return o && o.isValid() && i.push(o), s && s.isValid() && o.isBefore(s) && i.push(s), i
        },
        _getTaskTypeNameWithComment: function(e, t, n) {
          var i, s = [];
          return (i = "custom" === (e = e || 1) && o().isString(n) && !o().isEmpty(n) ? n : APP.todo_types[e] ? APP.todo_types[e] : (APP.constant("task_types")["key_".concat(e)] || {}).option) && s.push(i), t && s.push(r()._twig.filter("task_text", t)), s.join(": ")
        }
      });
      var g = "../build/transpiled/interface/controls/tasks_date/index";
      window.define(g, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([g])
    },
    404382: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => p
      });
      var i = n(629133),
        o = n.n(i),
        s = n(210734);

      function r(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function a(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function l(e, t, n) {
        return l = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = c(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, l(e, t, n || e)
      }

      function c(e) {
        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, c(e)
      }

      function u(e, t) {
        return u = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, u(e, t)
      }

      function d(e) {
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
          var n, i = c(e);
          if (t) {
            var o = c(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var h = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && u(e, t)
        }(f, e);
        var t, i, h, p = d(f);

        function f() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, f), p.apply(this, arguments)
        }
        return t = f, i = [{
          key: "_selectors",
          value: function() {
            return {
              input: ".js-control-time-field-input"
            }
          }
        }, {
          key: "events",
          value: function() {
            var e, t, n, i = (e = {}, n = "_onInputTime", (t = "input ".concat(this._selector("input"))) in e ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0
            }) : e[t] = n, e);
            return o().extend({}, o().result(s.default.prototype, "events", {}), i)
          }
        }, {
          key: "initialize",
          value: function() {
            l(c(f.prototype), "initialize", this).apply(this, arguments), this.time_format = Number(this.$el.attr("data-time-format")) || APP.system.format.time, this.useMask()
          }
        }, {
          key: "useMask",
          value: function() {
            var e, t = this;
            return (e = function() {
              return function(e, t) {
                var n, i, o, s, r = {
                  label: 0,
                  sent: function() {
                    if (1 & o[0]) throw o[1];
                    return o[1]
                  },
                  trys: [],
                  ops: []
                };
                return s = {
                  next: a(0),
                  throw: a(1),
                  return: a(2)
                }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
                  return this
                }), s;

                function a(s) {
                  return function(a) {
                    return function(s) {
                      if (n) throw new TypeError("Generator is already executing.");
                      for (; r;) try {
                        if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                        switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                          case 0:
                          case 1:
                            o = s;
                            break;
                          case 4:
                            return r.label++, {
                              value: s[1],
                              done: !1
                            };
                          case 5:
                            r.label++, i = s[1], s = [0];
                            continue;
                          case 7:
                            s = r.ops.pop(), r.trys.pop();
                            continue;
                          default:
                            if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                              r = 0;
                              continue
                            }
                            if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                              r.label = s[1];
                              break
                            }
                            if (6 === s[0] && r.label < o[1]) {
                              r.label = o[1], o = s;
                              break
                            }
                            if (o && r.label < o[2]) {
                              r.label = o[2], r.ops.push(s);
                              break
                            }
                            o[2] && r.ops.pop(), r.trys.pop();
                            continue
                        }
                        s = t.call(e, r)
                      } catch (e) {
                        s = [6, e], i = 0
                      } finally {
                        n = o = 0
                      }
                      if (5 & s[0]) throw s[1];
                      return {
                        value: s[0] ? s[1] : void 0,
                        done: !0
                      }
                    }([s, a])
                  }
                }
              }(this, (function(e) {
                switch (e.label) {
                  case 0:
                    return [4, n.e(23419).then(n.t.bind(n, 23419, 23))];
                  case 1:
                    return (0, e.sent().default)({
                      regex: 12 === APP.system.format.time ? "^(([0-9]|0[0-9]|1[0-2]):[0-5][0-9])([AaPp][Mm])?$" : "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
                      positionCaretOnClick: "radixFocus",
                      placeholder: "",
                      showMaskOnHover: !1,
                      showMaskOnFocus: !1,
                      keepStatic: !0
                    }).mask(t._elem("input").get(0)), [2]
                }
              }))
            }, function() {
              var t = this,
                n = arguments;
              return new Promise((function(i, o) {
                var s = e.apply(t, n);

                function a(e) {
                  r(s, i, o, a, l, "next", e)
                }

                function l(e) {
                  r(s, i, o, a, l, "throw", e)
                }
                a(void 0)
              }))
            })()
          }
        }, {
          key: "_onInputTime",
          value: function(e) {
            0 === e.target.value.toLocaleUpperCase().replace(/[^0-9]/g, "").length && this._elem("input").val("").trigger("change")
          }
        }, {
          key: "destroy",
          value: function() {
            var e = this._elem("input").get(0).inputmask;
            e && e.remove(), s.default.prototype.destroy.apply(this, arguments)
          }
        }], h = [{
          key: "controlClassName",
          get: function() {
            return "time-field"
          }
        }], i && a(t.prototype, i), h && a(t, h), f
      }(s.default);
      const p = h.extend(h);
      var f = "../build/transpiled/interface/controls/time_field";
      window.define(f, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([f])
    },
    384188: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => P
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(210734);

      function l(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function c(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function u(e, t, n) {
        return u = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = d(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, u(e, t, n || e)
      }

      function d(e) {
        return d = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, d(e)
      }

      function h(e, t) {
        return h = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, h(e, t)
      }

      function p(e) {
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
          var n, i = d(e);
          if (t) {
            var o = d(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var f, _ = ".js-tip",
        g = !1,
        m = function(e) {
          e.$tip.hasClass("tips_keyboard") ? e.$key_selected.trigger("click").trigger("tip:select") : e.$tip.find(".js-tips-item:hover").trigger("click").trigger("tip:select")
        },
        v = function(e, t) {
          var n = t.$items.index(t.$key_selected) + ("up" === e ? -1 : 1);
          n < 0 && (n = t.$items.length - 1), n > t.$items.length - 1 && (n = 0), t.$key_selected.removeClass("tips-item_selected-keyboard"), t.$items[n].classList.add("tips-item_selected-keyboard"), g.addClass("tips_keyboard").removeClass("tips_mouse")
        },
        y = new Map,
        b = !1;
      y.set(38, r().bind(v, {}, "up")), y.set(40, r().bind(v, {}, "down")), y.set(13, m), y.set(9, m);
      var w = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && h(e, t)
        }(m, e);
        var t, n, i, s = p(m);

        function m() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, m), s.apply(this, arguments)
        }
        return t = m, n = [{
          key: "document_events",
          value: function() {
            return {
              "tip:remove": "_remove",
              "controls:hide:private": "_hide"
            }
          }
        }, {
          key: "events",
          value: function() {
            var e, t = (c(e = {}, "mousemove ".concat(_), "_mousemove"), c(e, "keydown", "_keydown"), c(e, "click", "_click"), c(e, "tip:select .js-tips-item", "_select"), e);
            return r().extend({}, r().result(a.default.prototype, "events", {}), t)
          }
        }, {
          key: "_selectors",
          value: function() {
            return {
              tip: _,
              container: ".js-tip-holder",
              overflowed_tip_holder: '.js-overflowed-tip-holder[data-value="%s"]',
              tip_holder: '.js-tip-holder[data-value="%s"]'
            }
          }
        }, {
          key: "initTipShowEvent",
          value: function() {
            b || (b = !0, o()(document).on("tip:show", "".concat(_), (function(e, t) {
              var n = o()(e.target).closest(".".concat(m.controlClassName));
              n.get(0) ? n.data("view")._showTip(e, t) : m.prototype._showTip(e, t)
            })))
          }
        }, {
          key: "initDocumentEvents",
          value: function() {
            this.initTipShowEvent()
          }
        }, {
          key: "initialize",
          value: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            u(d(m.prototype), "initialize", this).apply(this, arguments);
            var t = e.toggleBodyOverlay,
              n = void 0 === t ? r().noop : t;
            n && (this.toggleBodyOverlay = n), this.initDocumentEvents()
          }
        }, {
          key: "_hide",
          value: function(e, t) {
            g && ("force" !== t && (o().contains(g.get(0), e.target) || t && "tip" !== t) || (g.trigger("tip:show", [!1]).trigger("tip:hidden"), g = !1))
          }
        }, {
          key: "_remove",
          value: function(e, t) {
            if (g) {
              var n = t.$tip;
              n.trigger("controls:hide:private"), n.get(0) && o()(document).trigger("linked:tip:remove")
            }
          }
        }, {
          key: "_showTip",
          value: function(e, t) {
            var n, i, s, r = o()(e.currentTarget);
            r.is(":visible") || !1 === t ? (f && (f.append(r), f = null), r.hide().trigger("tip:hidden"), r.find(".tips-item_selected-keyboard").removeClass("tips-item_selected-keyboard"), g = !1, this.toggleBodyOverlay && this.toggleBodyOverlay(!1)) : (r.show(), (g = r).find(".tips-item_selected").addClass("tips-item_selected-keyboard"), r.removeClass("tips-at-top"), r.removeClass("tips-to-left"), r.removeClass("tips-to-right"), n = r.offset().left, i = r.outerWidth(), s = o()(window).width(), n < 0 ? r.addClass("tips-to-right") : n + i > s && r.addClass("tips-to-left"), r.hasClass("tips-at-bottom") || r.visible() || r.addClass("tips-at-top"), r.is("[data-append-to-body]") && this.appendToBody(r)), r.trigger("tip:showed")
          }
        }, {
          key: "appendToBody",
          value: function(e) {
            var t = e.closest(this._selector("container")),
              n = t.offset();
            f = e.parent(), o()(document.body).append(e), e.removeClass("tips-to-left").removeClass("tips-to-right").removeClass("tips-at-top").css({
              position: "absolute",
              top: n.top + t.height() + 5,
              left: n.left
            }), e.visible() || e.css({
              top: n.top - e.height() - 5
            })
          }
        }, {
          key: "_select",
          value: function(e) {
            var t = o()(e.currentTarget),
              n = t.closest(this._selector("tip"));
            n.find(".tips-item_selected").removeClass("tips-item_selected"), t.addClass("tips-item_selected").trigger("tip:selected"), n.hide().trigger("tip:hidden")
          }
        }, {
          key: "_click",
          value: function(e) {
            var t = o()(e.target),
              n = this.$el,
              i = n.find(this._selector("tip"));
            if (o()(e.target).closest(".js-tips-item").length) o()(e.target).trigger("tip:select");
            else if (e.stopPropagation(), o()(document).trigger({
                type: "controls:hide",
                target: e.currentTarget
              }), !t.hasClass("date_field")) return i.trigger("tip:show"), !!n.hasClass("js-tip-holder-links") && void 0
          }
        }, {
          key: "_mousemove",
          value: function(e) {
            var t = o()(e.currentTarget);
            t.hasClass("tips_mouse") || t.removeClass("tips_keyboard").addClass("tips_mouse")
          }
        }, {
          key: "_keydown",
          value: function(e) {
            var t;
            if (g && g.is(":visible") && g.find(".tips-item_selected").length && r().isFunction(y.get(e.keyCode))) return t = g.find(".js-tips-item:not(.hidden)"), y.get(e.keyCode)({
              $tip: g,
              $items: t,
              $key_selected: t.filter((function() {
                return o()(this).hasClass("tips-item_selected-keyboard")
              }))
            }), !1
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "js-tip-holder"
          }
        }], n && l(t.prototype, n), i && l(t, i), m
      }(a.default);
      const P = w.extend(w);
      var E = "../build/transpiled/interface/controls/tip/index";
      window.define(E, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([E])
    },
    696677: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => g
      });
      var i = n(629133),
        o = n.n(i),
        s = n(384188),
        r = n(661533);

      function a(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function l(e, t, n) {
        return l = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = c(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, l(e, t, n || e)
      }

      function c(e) {
        return c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, c(e)
      }

      function u(e, t) {
        return u = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, u(e, t)
      }

      function d(e) {
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
          var n, i = c(e);
          if (t) {
            var o = c(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }
      var h, p = ".js-tip-overflowed",
        f = !1,
        _ = function(e) {
          ! function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && u(e, t)
          }(g, e);
          var t, n, i, _ = d(g);

          function g() {
            return function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, g), _.apply(this, arguments)
          }
          return t = g, n = [{
            key: "_selectors",
            value: function() {
              return o().extend({}, l(c(g.prototype), "_selectors", this).apply(this, arguments), {
                tip: p,
                container: ".js-overflowed-tip-holder"
              })
            }
          }, {
            key: "initTipShowEvent",
            value: function() {
              f || (f = !0, r(document).on("tip:show", "".concat(p), (function(e, t) {
                var n = r(e.target).closest(".".concat(g.controlClassName));
                n.get(0) ? (h = n.data("view"))._showTip(e, t) : h._showTip(e, t)
              })))
            }
          }, {
            key: "initDocumentEvents",
            value: function() {
              this.initTipShowEvent()
            }
          }, {
            key: "initialize",
            value: function() {
              this.initDocumentEvents(), this.$el.data("view", this), l(c(g.prototype), "initialize", this).call(this, {
                initDocumentEvents: this.initDocumentEvents,
                toggleBodyOverlay: this.toggleBodyOverlay
              })
            }
          }, {
            key: "toggleBodyOverlay",
            value: function(e, t) {
              l(c(g.prototype), "_toggleBodyOverlay", this).call(this, e, t)
            }
          }, {
            key: "_hide",
            value: function(e) {
              var t = e ? null : "force";
              l(c(g.prototype), "_hide", this).call(this, e, t)
            }
          }, {
            key: "appendToBody",
            value: function(e) {
              s.default.prototype.appendToBody.apply(this, arguments), this.toggleBodyOverlay(e, this._hide)
            }
          }], i = [{
            key: "controlClassName",
            get: function() {
              return "js-overflowed-tip-holder"
            }
          }], n && a(t.prototype, n), i && a(t, i), g
        }(s.default);
      const g = _.extend(_);
      var m = "../build/transpiled/interface/controls/tip/overflowed";
      window.define(m, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([m])
    },
    125522: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => c
      });
      var i = n(629133),
        o = n.n(i),
        s = n(128508),
        r = n(214558),
        a = n(210734),
        l = n(604206);
      const c = a.default.extend({
        controlClassName: "control-user_state",
        _classes: function() {
          return {
            online: "control-user_state_online"
          }
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var i = this;
          a.default.prototype.initialize.apply(this, t), this.id = this.getId();
          var o = (0, r.get)(this.id);
          o && (o.online && this.toggleOnline(this.id, o.online), this.refresh_stream = l.default.refreshStream().pipe(s.filter((function(e) {
            return e.user_id === i.id
          }))).subscribe((function(e) {
            i.toggleOnline(e.user_id, e.event)
          })))
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          this.refresh_stream && this.refresh_stream.unsubscribe(), a.default.prototype.destroy.apply(this, t)
        },
        getId: function() {
          var e, t = parseInt(this.$el.data("id"));
          return o().isNaN(t) && (e = (0, r.getByAmoJoId)()[t], o().isUndefined(e) || (t = e ? parseInt(e.id) : 0)), t
        },
        toggleOnline: function(e, t) {
          this.$el.toggleClass(this._class("online"), !0 === t)
        }
      });
      var u = "../build/transpiled/interface/controls/user_state";
      window.define(u, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([u])
    },
    225826: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => y
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(210734),
        l = n(661533);

      function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function u(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function d(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              u(s, i, o, r, a, "next", e)
            }

            function a(e) {
              u(s, i, o, r, a, "throw", e)
            }
            r(void 0)
          }))
        }
      }

      function h(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function p(e, t, n) {
        return p = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = f(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, p(e, t, n || e)
      }

      function f(e) {
        return f = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, f(e)
      }

      function _(e, t) {
        return _ = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, _(e, t)
      }

      function g(e) {
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
          var n, i = f(e);
          if (t) {
            var o = f(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }

      function m(e, t) {
        var n, i, o, s, r = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return s = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this
        }), s;

        function a(s) {
          return function(a) {
            return function(s) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; r;) try {
                if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                  case 0:
                  case 1:
                    o = s;
                    break;
                  case 4:
                    return r.label++, {
                      value: s[1],
                      done: !1
                    };
                  case 5:
                    r.label++, i = s[1], s = [0];
                    continue;
                  case 7:
                    s = r.ops.pop(), r.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                      r = 0;
                      continue
                    }
                    if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                      r.label = s[1];
                      break
                    }
                    if (6 === s[0] && r.label < o[1]) {
                      r.label = o[1], o = s;
                      break
                    }
                    if (o && r.label < o[2]) {
                      r.label = o[2], r.ops.push(s);
                      break
                    }
                    o[2] && r.ops.pop(), r.trys.pop();
                    continue
                }
                s = t.call(e, r)
              } catch (e) {
                s = [6, e], i = 0
              } finally {
                n = o = 0
              }
              if (5 & s[0]) throw s[1];
              return {
                value: s[0] ? s[1] : void 0,
                done: !0
              }
            }([s, a])
          }
        }
      }
      var v = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && _(e, t)
        }(a, e);
        var t, n, i, s = g(a);

        function a() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, a), s.apply(this, arguments)
        }
        return t = a, n = [{
          key: "preload",
          get: function() {
            return [this.hoverTemplate]
          }
        }, {
          key: "hoverTemplate",
          get: function() {
            return "/tmpl/controls/widget_creator/widget_creator_hover.twig"
          }
        }, {
          key: "events",
          value: function() {
            return {
              mouseenter: "onMouseEnter",
              mouseleave: "onMouseLeave"
            }
          }
        }, {
          key: "_classes",
          value: function() {
            return {
              widget_creator_active: "widget-creator--hover",
              widget_creator_onboarding: "js-widget-creator",
              hover_el: "js-widget-creator-hover",
              hover_el_close: "js-widget-creator-hover-close",
              hover_el_onboarding: "widget-creator-hover-onboarding"
            }
          }
        }, {
          key: "_selectors",
          value: function() {
            return {
              widget_creator: ".js-widget-creator",
              hover_el: ".js-widget-creator-hover",
              hover_el_fake: ".js-widget-creator-hover-fake",
              hover_el_close: ".js-widget-creator-hover-close",
              hover_el_onboarding: ".widget-creator-hover-onboarding"
            }
          }
        }, {
          key: "_preload",
          value: function() {
            var e = this;
            return d((function() {
              return m(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return [4, r()._preload(e.preload)()];
                  case 1:
                    return t.sent(), [2]
                }
              }))
            }))()
          }
        }, {
          key: "initialize",
          value: function() {
            p(f(a.prototype), "initialize", this).apply(this, arguments), this.initHover()
          }
        }, {
          key: "destroy",
          value: function() {
            this.$hoverEl.remove(), p(f(a.prototype), "destroy", this).apply(this, arguments)
          }
        }, {
          key: "initHover",
          value: function() {
            var e = this;
            return d((function() {
              return m(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return [4, e.renderWidgetCreatorHover()];
                  case 1:
                    return t.sent(), e.$hoverEl.on("mouseenter", o().bind(e.onMouseEnter, e)).on("mouseleave", o().bind(e.onMouseLeave, e)).on("click", o().bind(e.onHoverClick, e)).on("click", e._selector("hover_el_close"), (function() {
                      for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
                      var o;
                      e.onCloseHoverAsOnboarding.apply(e, function(e) {
                        if (Array.isArray(e)) return c(e)
                      }(o = n) || function(e) {
                        if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
                      }(o) || function(e, t) {
                        if (e) {
                          if ("string" == typeof e) return c(e, t);
                          var n = Object.prototype.toString.call(e).slice(8, -1);
                          return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? c(e, t) : void 0
                        }
                      }(o) || function() {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                      }())
                    })), [2]
                }
              }))
            }))()
          }
        }, {
          key: "renderWidgetCreatorHover",
          value: function() {
            var e = this;
            return d((function() {
              var t;
              return m(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return [4, e._preload()];
                  case 1:
                    return n.sent(), t = r()({
                      ref: e.hoverTemplate
                    }).render(), e.$hoverEl = l(t), e.$fakeHoverEl = e.$hoverEl.find(e._selector("hover_el_fake")), e._$body.append(e.$hoverEl), [2]
                }
              }))
            }))()
          }
        }, {
          key: "onMouseEnter",
          value: function() {
            this.$hoverEl && this.showHoverEl()
          }
        }, {
          key: "onMouseLeave",
          value: function() {
            this.$hoverEl && this.hideHover()
          }
        }, {
          key: "onHoverClick",
          value: function(e) {
            e.target === e.currentTarget && this.$el.trigger("js-widget-creator:create-widget")
          }
        }, {
          key: "showHoverElAsOnboarding",
          value: function() {
            this.$hoverEl.addClass(this._class("hover_el_onboarding")), this.showHoverEl()
          }
        }, {
          key: "onCloseHoverAsOnboarding",
          value: function() {
            this.$hoverEl.removeClass(this._class("hover_el_onboarding")), this.hideHover()
          }
        }, {
          key: "showHoverEl",
          value: function() {
            this.$el.addClass(this._class("widget_creator_active"));
            var e = this.el.getBoundingClientRect();
            this.$hoverEl.css({
              top: e.height + e.top,
              left: e.left
            }), this.$hoverEl.show();
            var t = this.$hoverEl[0].getBoundingClientRect();
            this.$fakeHoverEl.css({
              top: -(t.top - e.top),
              width: e.width,
              height: t.top - e.top
            })
          }
        }, {
          key: "hideHover",
          value: function() {
            this.isOpenedAsOnboarding() || (this.$el.removeClass(this._class("widget_creator_active")), this.$hoverEl.hide())
          }
        }, {
          key: "isOpenedAsOnboarding",
          value: function() {
            return this.$hoverEl.hasClass(this._class("hover_el_onboarding"))
          }
        }], i = [{
          key: "controlClassName",
          get: function() {
            return "widget-creator"
          }
        }], n && h(t.prototype, n), i && h(t, i), a
      }(a.default);
      v.extend(v);
      const y = v;
      var b = "../build/transpiled/interface/controls/widget_creator";
      window.define(b, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([b])
    },
    217416: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => d
      });
      var i = n(661533),
        o = n.n(i),
        s = n(629133),
        r = n.n(s),
        a = n(210734);

      function l(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function c(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              l(s, i, o, r, a, "next", e)
            }

            function a(e) {
              l(s, i, o, r, a, "throw", e)
            }
            r(void 0)
          }))
        }
      }

      function u(e, t) {
        var n, i, o, s, r = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return s = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this
        }), s;

        function a(s) {
          return function(a) {
            return function(s) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; r;) try {
                if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                  case 0:
                  case 1:
                    o = s;
                    break;
                  case 4:
                    return r.label++, {
                      value: s[1],
                      done: !1
                    };
                  case 5:
                    r.label++, i = s[1], s = [0];
                    continue;
                  case 7:
                    s = r.ops.pop(), r.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                      r = 0;
                      continue
                    }
                    if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                      r.label = s[1];
                      break
                    }
                    if (6 === s[0] && r.label < o[1]) {
                      r.label = o[1], o = s;
                      break
                    }
                    if (o && r.label < o[2]) {
                      r.label = o[2], r.ops.push(s);
                      break
                    }
                    o[2] && r.ops.pop(), r.trys.pop();
                    continue
                }
                s = t.call(e, r)
              } catch (e) {
                s = [6, e], i = 0
              } finally {
                n = o = 0
              }
              if (5 & s[0]) throw s[1];
              return {
                value: s[0] ? s[1] : void 0,
                done: !0
              }
            }([s, a])
          }
        }
      }
      const d = a.default.extend({
        controlClassName: "js-control-wysiwyg",
        _classes: function() {
          return {
            toolbar: "control-wysiwyg__toolbar",
            editable_area: "control-wysiwyg__area"
          }
        },
        events: {
          "input .ql-editor[contenteditable]": "_updateInput",
          "paste .ql-editor[contenteditable]": "_updateInput",
          "keydown .ql-editor[contenteditable]": "alignCheck",
          "input .js-wysiwyg-input": "_initInput",
          "click .control-wysiwyg__toolbar--item": "_updateInput",
          "click .ql-custom-align .ql-picker-item": "setCustomStyle",
          "click .ql-custom-size .ql-picker-item": "setCustomStyle",
          "click .ql-custom-font .ql-picker-item": "setCustomStyle",
          "click .ql-custom-color .ql-picker-item": "setCustomStyle",
          "click .ql-custom-clean": "cleanFormatting",
          "control:input:change": "onChange"
        },
        _selectors: function() {
          return {
            toolbar: ".control-wysiwyg__toolbar",
            toolbar_item: ".control-wysiwyg__toolbar--item",
            editable_area: ".control-wysiwyg__area",
            editable_input: ".js-wysiwyg-input",
            textarea: ".ql-editor[contenteditable]",
            tips: ".js-tip",
            tip_holder: ".js-tip-holder",
            tips_item: ".js-tips-item",
            font_size_tip_item: ".ql-custom-size .js-tips-item",
            font_family_tip_item: ".ql-custom-font .js-tips-item",
            ql_action: ".ql-custom-link .ql-action"
          }
        },
        initialize: function() {
          return c((function() {
            var e, t, i, s = arguments;
            return u(this, (function(l) {
              switch (l.label) {
                case 0:
                  return this._init_def = o().Deferred(), [4, n.e(59810).then(n.t.bind(n, 759810, 23))];
                case 1:
                  return e = l.sent(), t = e.default, a.default.prototype.initialize.apply(this, s), (i = t.import("blots/block")).tagName = "DIV", t.register(i, !0), this.$el.find(this._selector("editable_area")).addClass("".concat(this._class("editable_area"), "_").concat(this.cid)), this.$el.find(this._selector("toolbar")).addClass("".concat(this._class("toolbar"), "_").concat(this.cid)), this._updateQuill(t), this.quill = new t("".concat(this._selector("editable_area"), "_").concat(this.cid), {
                    modules: {
                      toolbar: {
                        container: "".concat(this._selector("toolbar"), "_").concat(this.cid)
                      }
                    }
                  }), this._init_def.resolve(), this._initInput(), this.quill.on("editor-change".concat(this.ns), r().bind(this.updateToolbarActivity, this)), this._findElem("ql_action").on("click", r().bind(this.setCustomLink, this)), [2]
              }
            }))
          })).apply(this)
        },
        _initInput: function() {
          return c((function() {
            var e;
            return u(this, (function(t) {
              switch (t.label) {
                case 0:
                  return e = this._findElem("editable_input").val(), [4, this._init_def];
                case 1:
                  return t.sent(), this.quill.clipboard.dangerouslyPasteHTML(e), [2]
              }
            }))
          })).apply(this)
        },
        onChange: function(e, t) {
          this._elem("editable_input").val(t), this._initInput()
        },
        updateToolbarActivity: function(e) {
          var t, n, i;
          if (("selection-change" !== e || arguments[1]) && ("text-change" !== e || this.quill.getSelection())) {
            var o = this.quill.getLine(this.quill.getSelection().index)[1];
            if (("selection-change" !== e || o || 0 === arguments[1].index) && ("text-change" !== e || o)) {
              "text-change" === e ? t = this.quill.getSelection() : "selection-change" === e && (t = arguments[1]);
              var s = this.quill.getFormat(t);
              this.$el.find(this._selector("tip_holder")).removeClass("ql-active").removeAttr("style"), this.$el.find(this._selector("tips_item")).removeClass("tips-item-selected"), r().each(r().keys(s), r().bind((function(e) {
                i = s[e], "color" === e || "background" === e ? ((n = this.$el.find('.ql-custom-color[data-type="'.concat(e, '"]'))).find('.tips-item[data-value="'.concat(i.toUpperCase(), '"]')).addClass("tips-item-selected"), n.css("stroke", s[e])) : (n = this.$el.find(".ql-custom-".concat(e))).find('.tips-item[data-value="'.concat(i, '"]')).addClass("tips-item-selected"), n.addClass("ql-active")
              }), this))
            }
          }
        },
        setCustomStyle: function(e) {
          var t = o()(e.target).closest(this._selector("tips_item")),
            n = t.closest(this._selector("tip_holder")),
            i = t.data("value"),
            s = n.data("type");
          i.toString() && s.toString() && (this.quill.format(s, i, "user"), this.closeTips(), n.removeClass("ql-active").find(".tips-item-selected").removeClass("tips-item-selected"), ("align" !== s || i) && (t.addClass("tips-item-selected"), t.closest(this._selector("tip_holder")).addClass("ql-active"), "color" !== s && "background" !== s || t.closest(this._selector("tip_holder")).css("stroke", i)))
        },
        setCustomLink: function(e) {
          var t = o()(e.target).closest(".ql-tooltip").find(".ql-tooltip-input"),
            n = t.val();
          e.stopPropagation(), n && (t.val(""), this.quill.format("link", n), this._updateInput(), this.closeTips())
        },
        cleanFormatting: function() {
          this.quill.removeFormat(0, this.quill.getLength() + 1)
        },
        alignCheck: function(e) {
          var t = this.quill.getLine(this.quill.getSelection().index)[1],
            n = this.quill.getFormat();
          8 === e.keyCode && (!t && n.align && (e.preventDefault(), this.$el.find('.ql-custom-align .ql-picker-item[data-value="false"]').click()), this._updateInput()), 46 !== e.keyCode && 13 !== e.keyCode || this._updateInput()
        },
        closeTips: function() {
          this._elem("tips").hide()
        },
        _updateQuill: function(e) {
          var t = this._getSizesArray(),
            n = this._getFontsArray(),
            i = e.import("attributors/style/align"),
            o = e.import("attributors/style/size"),
            s = e.import("attributors/style/font"),
            r = e.import("attributors/style/color"),
            a = e.import("formats/link"),
            l = e.import("attributors/style/background");
          o.whitelist = t, s.whitelist = n, e.register(o, !0), e.register(s, !0), e.register(i, !0), e.register(r, !0), e.register(l, !0), e.register(a, !0), e.debug(!1)
        },
        _getSizesArray: function() {
          return r().map(this._elem("font_size_tip_item"), (function(e) {
            return o()(e).data("value")
          }))
        },
        _getFontsArray: function() {
          return r().map(this._elem("font_family_tip_item"), (function(e) {
            return o()(e).data("value")
          }))
        },
        _updateInput: r().debounce((function() {
          var e = this._elem("textarea").html();
          "<p></p>" !== e && "<p><br></p>" !== e || (e = ""), this._elem("editable_input").val(e).trigger("change")
        }), 100)
      });
      var h = "../build/transpiled/interface/controls/wysiwyg";
      window.define(h, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([h])
    },
    641762: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        hhmmToSeconds: () => f,
        parseTimestamp: () => _,
        renderTimer: () => g,
        secondsToHHMM: () => p
      });
      var i = n(629133),
        o = n.n(i),
        s = n(460159),
        r = n.n(s),
        a = n(161320),
        l = n.n(a),
        c = n(661533);

      function u(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }
      var d, h, p = function(e, t) {
          if (!o().isNumber(e)) return "00:00";
          var n = Math.abs(e),
            i = Math.floor(n / 3600),
            s = Math.floor(n % 3600 / 60);
          return i = i < 10 ? "0".concat(String(i)) : String(i), s = s < 10 ? "0".concat(String(s)) : String(s), t ? "".concat(e < 0 ? "-" : "").concat(i, ":").concat(s) : "".concat(i, ":").concat(s)
        },
        f = function(e) {
          return !!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(e) && o().reduce(e.split(":"), (function(e, t, n) {
            return (0 === n ? 3600 * t : 60 * t) + e
          }), 0)
        },
        _ = function(e) {
          var t = l().unix(e).utc().format(APP.system.format.date.date);
          return {
            date: t,
            time: l().unix(e).utc().format(APP.system.format.date.time),
            full_date: "".concat(l().unix(e).utc().format("dd"), " ").concat(t)
          }
        },
        g = (d = function() {
          var e, t;
          return function(e, t) {
            var n, i, o, s, r = {
              label: 0,
              sent: function() {
                if (1 & o[0]) throw o[1];
                return o[1]
              },
              trys: [],
              ops: []
            };
            return s = {
              next: a(0),
              throw: a(1),
              return: a(2)
            }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
              return this
            }), s;

            function a(s) {
              return function(a) {
                return function(s) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; r;) try {
                    if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                    switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                      case 0:
                      case 1:
                        o = s;
                        break;
                      case 4:
                        return r.label++, {
                          value: s[1],
                          done: !1
                        };
                      case 5:
                        r.label++, i = s[1], s = [0];
                        continue;
                      case 7:
                        s = r.ops.pop(), r.trys.pop();
                        continue;
                      default:
                        if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                          r = 0;
                          continue
                        }
                        if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                          r.label = s[1];
                          break
                        }
                        if (6 === s[0] && r.label < o[1]) {
                          r.label = o[1], o = s;
                          break
                        }
                        if (o && r.label < o[2]) {
                          r.label = o[2], r.ops.push(s);
                          break
                        }
                        o[2] && r.ops.pop(), r.trys.pop();
                        continue
                    }
                    s = t.call(e, r)
                  } catch (e) {
                    s = [6, e], i = 0
                  } finally {
                    n = o = 0
                  }
                  if (5 & s[0]) throw s[1];
                  return {
                    value: s[0] ? s[1] : void 0,
                    done: !0
                  }
                }([s, a])
              }
            }
          }(this, (function(n) {
            switch (n.label) {
              case 0:
                return e = "/tmpl/operday/controls/timer.twig", t = c(".card-widgets__elements"), [4, r()._preload([e])()];
              case 1:
                return n.sent(), t.addClass("operday-timer__holder"), t.prepend(r()({
                  ref: e
                }).render({
                  entity_id: APP.data.current_card.id,
                  entity_type: APP.data.current_entity
                })), [2]
            }
          }))
        }, h = function() {
          var e = this,
            t = arguments;
          return new Promise((function(n, i) {
            var o = d.apply(e, t);

            function s(e) {
              u(o, n, i, s, r, "next", e)
            }

            function r(e) {
              u(o, n, i, s, r, "throw", e)
            }
            s(void 0)
          }))
        }, function() {
          return h.apply(this, arguments)
        }),
        m = "../build/transpiled/interface/operday/utils";
      window.define(m, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([m])
    },
    344103: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => s
      });
      var i = n(661533),
        o = n.n(i);
      const s = {
        addBotToFavorites: function(e) {
          return o().ajax({
            url: "/ajax/v4/bots/".concat(e, "/star"),
            method: "POST",
            dataType: "json"
          })
        },
        addTemplateToFavorites: function(e) {
          return o().ajax({
            url: "/ajax/v4/chats/templates/".concat(e, "/star"),
            method: "POST",
            dataType: "json"
          })
        },
        removeBotFromFavorites: function(e) {
          return o().ajax({
            url: "/ajax/v4/bots/".concat(e, "/star"),
            method: "DELETE",
            dataType: "json"
          })
        },
        removeTemplateFromFavorites: function(e) {
          return o().ajax({
            url: "/ajax/v4/chats/templates/".concat(e, "/star"),
            method: "DELETE",
            dataType: "json"
          })
        }
      };
      var r = "../build/transpiled/network/favorites/api";
      window.define(r, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([r])
    },
    410432: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => o
      });
      var i = n(661533);
      const o = {
        startOperday: function(e) {
          return i.ajax({
            url: "/ajax/v4/operday/open",
            method: "POST",
            dataType: "JSON",
            data: JSON.stringify({
              started_at: e
            })
          })
        },
        reopenOperday: function() {
          return i.ajax({
            url: "/ajax/v4/operday/open",
            method: "POST",
            dataType: "JSON",
            data: JSON.stringify({
              reopen: !0
            })
          })
        },
        closeOperday: function(e) {
          return i.ajax({
            url: "/ajax/v4/operday/close",
            method: "POST",
            dataType: "JSON",
            data: JSON.stringify({
              ended_at: e
            })
          })
        },
        getTimer: function(e, t) {
          return i.ajax({
            url: "/ajax/v4/operday/".concat(t, "/").concat(e, "/timer/state"),
            method: "GET",
            dataType: "JSON"
          })
        },
        sendTimerState: function(e) {
          var t = e.entity_type,
            n = e.id,
            o = e.body;
          return i.ajax({
            url: "/ajax/v4/operday/".concat(t, "/").concat(n, "/timer/state"),
            method: "PUT",
            dataType: "JSON",
            data: JSON.stringify(o)
          })
        },
        getDetailByEntity: function(e) {
          return i.ajax({
            url: "/ajax/v4/operday/timer/".concat(e, "/detail"),
            method: "GET",
            dataType: "JSON"
          })
        },
        getStatsOnCard: function(e, t) {
          return i.ajax({
            url: "/ajax/v4/operday/".concat(e, "/").concat(t, "/stats"),
            method: "GET",
            dataType: "JSON"
          })
        }
      };
      var s = "../build/transpiled/network/operday/api";
      window.define(s, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([s])
    },
    993595: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => _
      });
      var i = n(643095),
        o = n(500034),
        s = n(258471),
        r = n(397927);

      function a(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function l(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function c(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              l(s, i, o, r, a, "next", e)
            }

            function a(e) {
              l(s, i, o, r, a, "throw", e)
            }
            r(void 0)
          }))
        }
      }

      function u(e, t) {
        return function(e) {
          if (Array.isArray(e)) return e
        }(e) || function(e, t) {
          var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != n) {
            var i, o, s = [],
              r = !0,
              a = !1;
            try {
              for (n = n.call(e); !(r = (i = n.next()).done) && (s.push(i.value), !t || s.length !== t); r = !0);
            } catch (e) {
              a = !0, o = e
            } finally {
              try {
                r || null == n.return || n.return()
              } finally {
                if (a) throw o
              }
            }
            return s
          }
        }(e, t) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return a(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? a(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function d(e, t) {
        var n, i, o, s, r = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return s = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this
        }), s;

        function a(s) {
          return function(a) {
            return function(s) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; r;) try {
                if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                  case 0:
                  case 1:
                    o = s;
                    break;
                  case 4:
                    return r.label++, {
                      value: s[1],
                      done: !1
                    };
                  case 5:
                    r.label++, i = s[1], s = [0];
                    continue;
                  case 7:
                    s = r.ops.pop(), r.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                      r = 0;
                      continue
                    }
                    if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                      r.label = s[1];
                      break
                    }
                    if (6 === s[0] && r.label < o[1]) {
                      r.label = o[1], o = s;
                      break
                    }
                    if (o && r.label < o[2]) {
                      r.label = o[2], r.ops.push(s);
                      break
                    }
                    o[2] && r.ops.pop(), r.trys.pop();
                    continue
                }
                s = t.call(e, r)
              } catch (e) {
                s = [6, e], i = 0
              } finally {
                n = o = 0
              }
              if (5 & s[0]) throw s[1];
              return {
                value: s[0] ? s[1] : void 0,
                done: !0
              }
            }([s, a])
          }
        }
      }
      var h = function() {
          return (0, o.isFeatureAvailable)("single_timeline") ? Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(58551), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(32177), n.e(75206), n.e(10878), n.e(94850)]).then(n.bind(n, 310878)) : Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(58551), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(32177), n.e(75206), n.e(66613)]).then(n.bind(n, 182025))
        },
        p = function() {
          return (0, o.isFeatureAvailable)("single_timeline") ? Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(85067), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(58551), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(78636), n.e(9983), n.e(32177), n.e(75206), n.e(93430), n.e(10878), n.e(57901), n.e(45846)]).then(n.bind(n, 606144)) : Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(85067), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(58551), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(78636), n.e(9983), n.e(32177), n.e(75206), n.e(93430), n.e(10878), n.e(57901), n.e(7259), n.e(16361)]).then(n.bind(n, 7259))
        },
        f = function() {
          return (0, o.isFeatureAvailable)("single_timeline") ? Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(85067), n.e(7007), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(58551), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(78636), n.e(9983), n.e(32177), n.e(75206), n.e(93430), n.e(10878), n.e(57901), n.e(44448)]).then(n.bind(n, 310580)) : Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(85067), n.e(7007), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(58551), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(78636), n.e(9983), n.e(32177), n.e(75206), n.e(93430), n.e(10878), n.e(57901), n.e(7259), n.e(74051)]).then(n.bind(n, 574104))
        };
      const _ = {
        "dashboard(/)": ["dashboard", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.DASHBOARD), Promise.all([n.e(56740), n.e(59966), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(39970), n.e(72209), n.e(48008), n.e(73806), n.e(67547)]).then(n.bind(n, 189865))
        }],
        "leads/list/pipeline(/)(:id)(/)(page/:page/)": ["leads", function(e) {
          try {
            var t = u(e.args, 1)[0];
            (0, r.setActiveItemId)("".concat(r.KnownNavigationItemIdV2.LEADS, "_").concat(t))
          } catch (e) {
            (0, i.captureException)(e, {
              tags: {
                text: "Error in 'leads/list/pipeline(/)(:id)(/)(page/:page/)' route while setting active item id"
              }
            })
          }
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.LEADS_LIST : s.TrackedMetricType.LEADS_LIST_NAVIGATION), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(30256), n.e(74785), n.e(86567)]).then(n.bind(n, 340745))
        }],
        "leads/list(/)(page/:page/)": ["leads", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.LEADS_LIST : s.TrackedMetricType.LEADS_LIST_NAVIGATION), (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.ALL_LEADS), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(30256), n.e(74785), n.e(34441)]).then(n.bind(n, 832328))
        }],
        "leads/trash(/)(page/:page/)": ["leads-trash", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.LEADS_LIST : s.TrackedMetricType.LEADS_LIST_NAVIGATION), (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.ALL_LEADS), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(30256), n.e(74785), n.e(34441)]).then(n.bind(n, 832328))
        }],
        "leads/pipeline(/)(:id)(/)(?*qs)": ["leads-pipeline", function(e) {
          try {
            var t = u(e.args, 1)[0];
            (0, r.setActiveItemId)("".concat(r.KnownNavigationItemIdV2.LEADS, "_").concat(t))
          } catch (e) {
            (0, i.captureException)(e, {
              tags: {
                text: "Error in 'leads/pipeline(/)(:id)(/)(?*qs)' route while setting active item id"
              }
            })
          }
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.LEADS_PIPELINE : s.TrackedMetricType.LEADS_PIPELINE_NAVIGATION), Promise.all([n.e(49458), n.e(52383), n.e(36237), n.e(75222), n.e(6295), n.e(7871)]).then(n.bind(n, 913767))
        }],
        "leads/detail/:id(/)": ["leads", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.LEAD_CARD : s.TrackedMetricType.LEAD_CARD_NAVIGATION), h()
        }, {
          is_card: !0
        }],
        "leads/add(/)": ["leads", h, {
          is_card: !0
        }],
        "imbox(/)": ["chats", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NO_SELECTED : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NO_SELECTED_NAVIGATION), Promise.all([n.e(85067), n.e(78636), n.e(9983), n.e(93430), n.e(92099)]).then(n.bind(n, 763149))
        }],
        "imbox/:talk_id/leads/detail/:id(/)": ["leads", function(e) {
          var t = e.pageType;
          return t === s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NO_SELECTED || t === s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NO_SELECTED_NAVIGATION || (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "imbox/leads/detail/:id(/)": ["leads", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "imbox/:talk_id/customers/detail/:id(/)": ["customers", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), f()
        }, {
          is_card: !0
        }],
        "imbox/:talk_id/contacts/detail/:id(/)": ["contacts", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "chats(/)": ["chats", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_DIALOGS : s.TrackedMetricType.INBOX_DIALOGS_NAVIGATION), (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CHATS_INBOX), Promise.all([n.e(85067), n.e(78636), n.e(9983), n.e(93430), n.e(92099)]).then(n.bind(n, 763149))
        }],
        "chats/mentions/:user_id(/)": ["leads", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TEAM_INBOX), Promise.all([n.e(85067), n.e(78636), n.e(9983), n.e(93430), n.e(92099)]).then(n.bind(n, 763149))
        }],
        "teams/mentions/:user_id(/)": ["leads", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TEAM_INBOX), Promise.all([n.e(85067), n.e(78636), n.e(9983), n.e(93430), n.e(92099)]).then(n.bind(n, 763149))
        }],
        "chats/tools/:tool(/)": ["chats", (g = c((function(e) {
          var t, i, a, l;
          return d(this, (function(c) {
            if ((0, o.isFeatureAvailable)(o.Features.SYSTEM_NAVIGATION_V2)) {
              if (t = e.args, i = u(t, 1), !(a = i[0])) return [2];
              if ((l = {
                  broadcasting: function() {
                    return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.BROADCASTING), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(58551), n.e(39970), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(69314), n.e(35838), n.e(61723), n.e(94222)]).then(n.bind(n, 61723)).then((function(e) {
                      return {
                        default: e.BroadcastingPage
                      }
                    }))
                  },
                  templates: function() {
                    return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CHAT_TEMPLATES), Promise.all([n.e(3473), n.e(35412), n.e(68942), n.e(6641), n.e(39356), n.e(87062), n.e(68166), n.e(17040), n.e(83273), n.e(75062), n.e(452), n.e(48814)]).then(n.bind(n, 252143))
                  },
                  bots: function() {
                    return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.BOTS), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(58551), n.e(39970), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(58432), n.e(12651), n.e(25050), n.e(87822), n.e(42518), n.e(11291), n.e(87868), n.e(38873), n.e(60930), n.e(287), n.e(27340)]).then(n.bind(n, 638044))
                  }
                })[a]) return [2, l[a]()]
            }
            return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_DIALOGS : s.TrackedMetricType.INBOX_DIALOGS_NAVIGATION), [2, Promise.all([n.e(85067), n.e(78636), n.e(9983), n.e(93430), n.e(92099)]).then(n.bind(n, 763149))]
          }))
        })), function(e) {
          return g.apply(this, arguments)
        })],
        "chats/:talk_id/leads/detail/:id(/)": ["leads", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CHATS_INBOX), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "chats/leads/detail/:id(/)": ["leads", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CHATS_INBOX), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "chats/:talk_id/customers/detail/:id(/)": ["customers", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CHATS_INBOX), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_CUSTOMERS_CARD : s.TrackedMetricType.INBOX_WITH_CUSTOMERS_CARD_NAVIGATION), f()
        }, {
          is_card: !0
        }],
        "chats/:talk_id/contacts/detail/:id(/)": ["contacts", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CHATS_INBOX), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_CONTACT_CARD : s.TrackedMetricType.INBOX_WITH_CONTACT_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "teams(/)": ["chats", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TEAM_INBOX), Promise.all([n.e(85067), n.e(78636), n.e(9983), n.e(93430), n.e(92099)]).then(n.bind(n, 763149))
        }],
        "teams/mentions/leads/detail/:id(/)": ["leads", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TEAM_INBOX), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "teams/mentions/customers/detail/:id(/)": ["customers", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TEAM_INBOX), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), f()
        }, {
          is_card: !0
        }],
        "teams/mentions/contacts/detail/:id(/)": ["contacts", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TEAM_INBOX), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.INBOX_WITH_LEAD_CARD : s.TrackedMetricType.INBOX_WITH_LEAD_CARD_NAVIGATION), p()
        }, {
          is_card: !0
        }],
        "whatsapp/features(/)": ["whatsapp", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.WHATSAPP_FEATURES), n.e(46504).then(n.bind(n, 546504))
        }],
        "whatsapp/broadcasting(/)": ["whatsapp", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.WHATSAPP_BROADCASTING), n.e(46504).then(n.bind(n, 546504))
        }],
        "whatsapp/templates-and-bots(/)": ["whatsapp", function() {
          return n.e(46504).then(n.bind(n, 546504))
        }],
        "whatsapp/ai-agent(/)": ["whatsapp", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.WHATSAPP_AI_AGENT), n.e(46504).then(n.bind(n, 546504))
        }],
        "whatsapp/templates(/)": ["whatsapp", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.WHATSAPP_TEMPLATES), Promise.all([n.e(3473), n.e(35412), n.e(68942), n.e(6641), n.e(39356), n.e(87062), n.e(68166), n.e(17040), n.e(83273), n.e(75062), n.e(452), n.e(21967)]).then(n.bind(n, 637714))
        }],
        "whatsapp/bots(/)": ["whatsapp", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.WHATSAPP_BOTS), n.e(46504).then(n.bind(n, 546504))
        }],
        "customers/list(/page/:page)(/)": ["customers", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CUSTOMERS), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(16848)]).then(n.bind(n, 720348))
        }],
        "customers/pipeline(*plug)": ["customers-pipeline", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CUSTOMERS), Promise.all([n.e(49458), n.e(52383), n.e(36237), n.e(75222), n.e(6295), n.e(47010)]).then(n.bind(n, 246923))
        }],
        "customers/trash(/)(page/:page/)": ["customers-trash", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CUSTOMERS), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(16848)]).then(n.bind(n, 720348))
        }],
        "customers/detail/:id(/)": ["customers", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CUSTOMERS), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.CUSTOMERS_CARD : s.TrackedMetricType.CUSTOMERS_CARD_NAVIGATION), h()
        }, {
          is_card: !0
        }],
        "customers/add(/)": ["customers", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CUSTOMERS), h()
        }, {
          is_card: !0
        }],
        "customers/segments(/)": ["customers-dp", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CUSTOMERS), Promise.all([n.e(95882), n.e(41203), n.e(58551), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(58432), n.e(12651), n.e(25050), n.e(68963), n.e(87822), n.e(79461), n.e(60291), n.e(81406)]).then(n.bind(n, 976591))
        }],
        "contacts/list(/)(:element_type)(/)(page/:page)(/)": ["contacts", function() {
          var e = c((function(e) {
            var t, o, s;
            return d(this, (function(a) {
              try {
                t = e.args, o = u(t, 1), s = o[0], (0, r.setActiveItemId)(s ? "".concat(r.KnownNavigationItemIdV2.CATALOGS, "_").concat(s) : r.KnownNavigationItemIdV2.CONTACTS_ALL)
              } catch (e) {
                (0, i.captureException)(e, {
                  tags: {
                    text: "Error in 'contacts/list(/)(:element_type)(/)(page/:page)(/)' route while setting active item id"
                  }
                })
              }
              return [2, Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(46719)]).then(n.bind(n, 79829))]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()],
        "contacts/trash(/)(page/:page/)": ["contacts-trash", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CONTACTS_ALL), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(46719)]).then(n.bind(n, 79829))
        }],
        "contacts/detail/:id(/)": ["contacts", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CONTACTS), (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.CONTACTS_CARD : s.TrackedMetricType.CONTACTS_CARD_NAVIGATION), h()
        }, {
          is_card: !0
        }],
        "contacts/add(/)": ["contacts", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CONTACTS), h()
        }, {
          is_card: !0
        }],
        "companies/detail/:id(/)": ["companies", function() {
          return (0, s.setDefaultMetricNamespace)(APP.first_load ? s.TrackedMetricType.COMPANIES_CARD : s.TrackedMetricType.COMPANIES_CARD_NAVIGATION), (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.COMPANIES), h()
        }, {
          is_card: !0
        }],
        "companies/add(/)": ["companies", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.COMPANIES), h()
        }, {
          is_card: !0
        }],
        "files/list(/)(page/:page)(/)": ["files", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.FILES), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(15180), n.e(71220), n.e(69126)]).then(n.bind(n, 628573))
        }],
        "files/trash(/)(page/:page)(/)": ["files-trash", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.FILES), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(15180), n.e(71220), n.e(69126)]).then(n.bind(n, 628573))
        }],
        "files/detail/:id(/)": ["files", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.FILES), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(15180), n.e(71220), n.e(69126)]).then(n.bind(n, 628573))
        }, {
          is_card: !0
        }],
        "mail/:folder(/:box)(/page/:page)(/)": ["mail", function(e) {
          try {
            var t = u(e.args, 2),
              o = t[0],
              s = t[1],
              a = "";
            if (s) a = "".concat(r.KnownNavigationItemIdV2.EMAIL_INBOX, "_").concat(s);
            else switch (o) {
              case "sent":
                a = r.KnownNavigationItemIdV2.EMAIL_SENT;
                break;
              case "inbox":
                a = r.KnownNavigationItemIdV2.EMAIL_RECEIVED;
                break;
              case "deleted":
                a = r.KnownNavigationItemIdV2.EMAIL_DELETED
            }(0, r.setActiveItemId)(a, r.KnownNavigationItemIdV2.EMAIL_INBOX)
          } catch (e) {
            (0, i.captureException)(e, {
              tags: {
                text: "Error in 'mail/:folder(/:box)(/page/:page)(/)' route while setting active item id"
              }
            })
          }
          return Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(79409)]).then(n.bind(n, 174833))
        }],
        "mail/settings(/)": ["mail", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.SETTINGS_EMAIL, r.KnownNavigationItemIdV2.EMAIL_INBOX), Promise.all([n.e(95882), n.e(35071), n.e(70293)]).then(n.bind(n, 794901))
        }],
        "mail/templates(/)": ["mail", function() {
          return (0, r.setActiveItemId)("", r.KnownNavigationItemIdV2.EMAIL_TEMPLATES), Promise.all([n.e(95882), n.e(35071), n.e(16038)]).then(n.bind(n, 192501))
        }],
        "mail/thread/:id(/)": ["mail", function() {
          return APP.first_load && (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.EMAIL_RECEIVED, r.KnownNavigationItemIdV2.EMAIL_INBOX), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(32177), n.e(17262)]).then(n.bind(n, 366584))
        }, {
          is_card: !0
        }],
        "mail/thread/new(/)": ["mail", function() {
          return APP.first_load && (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.EMAIL_RECEIVED, r.KnownNavigationItemIdV2.EMAIL_INBOX), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(32177), n.e(17262)]).then(n.bind(n, 366584))
        }, {
          is_card: !0
        }],
        "todo/list(/)(page/:page/)": ["todo", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TASKS), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(21584)]).then(n.bind(n, 202945))
        }],
        "todo/trash(/)(page/:page/)": ["todo-trash", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TASKS), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(36237), n.e(75222), n.e(21584)]).then(n.bind(n, 202945))
        }],
        "todo/line(/)": ["todo-line", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TASKS), Promise.all([n.e(76012), n.e(20983), n.e(39700), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(75222), n.e(22671)]).then(n.bind(n, 238811))
        }],
        "todo/calendar(/)(:view)(/)": ["todo-calendar", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.TASKS), Promise.all([n.e(76012), n.e(20983), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(75222), n.e(37174)]).then(n.bind(n, 379681))
        }],
        "events/list(/)(page/:page/)": ["events", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.ACTIVITY_LOG), Promise.all([n.e(56740), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(39970), n.e(36237), n.e(73806), n.e(58339)]).then(n.bind(n, 146132))
        }],
        "authlog/list(/)(page/:page/)": ["authlog", function() {
          return Promise.all([n.e(56740), n.e(81142), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(36237), n.e(73357)]).then(n.bind(n, 422766))
        }],
        "stats/pipeline(/)": ["stats", function() {
          return (0, r.setActiveItemId)(""), Promise.all([n.e(49458), n.e(72209), n.e(48008), n.e(70519), n.e(1291)]).then(n.bind(n, 916398))
        }],
        "stats/by_activities(/)(:id)(/)": ["stats-human", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.REPORT_BY_ACTIVITIES), Promise.all([n.e(56740), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(39970), n.e(73806), n.e(94717)]).then(n.bind(n, 143500))
        }],
        "stats/by_activities(/)": ["stats-human", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.REPORT_BY_ACTIVITIES), Promise.all([n.e(56740), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(39970), n.e(36237), n.e(73806), n.e(91695)]).then(n.bind(n, 932248))
        }],
        "stats/customers(/)": ["stats", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.REPORT_BY_CUSTOMERS), Promise.all([n.e(49458), n.e(72209), n.e(48008), n.e(36870)]).then(n.bind(n, 10946))
        }],
        "stats/consolidated(/)(:report/)": ["stats", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CONSOLIDATED_REPORT), Promise.all([n.e(49458), n.e(72209), n.e(48008), n.e(51923)]).then(n.bind(n, 344359))
        }],
        "stats/calls(/)(:report/)": ["statsCalls", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CALL_REPORT), Promise.all([n.e(49458), n.e(70519), n.e(93053)]).then(n.bind(n, 593053))
        }],
        "stats/operday(/)": ["statsOperday", function() {
          return Promise.all([n.e(56740), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(27386), n.e(85663), n.e(15549)]).then(n.bind(n, 215549))
        }],
        "stats/goals(/)": ["stats", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.GOAL_REPORT), Promise.all([n.e(49458), n.e(78887)]).then(n.bind(n, 408949))
        }],
        "stats/goals/leads_price(/)": ["stats", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.GOAL_REPORT), Promise.all([n.e(49458), n.e(78887)]).then(n.bind(n, 408949))
        }],
        "stats/goals/leads_count(/)": ["stats", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.GOAL_REPORT), Promise.all([n.e(49458), n.e(78887)]).then(n.bind(n, 408949))
        }],
        "stats/goals/settings(/)": ["stats", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.GOAL_REPORT), n.e(79666).then(n.bind(n, 279666))
        }],
        "stats/widgets/(:widget_code)(/)(:subitem_code)(/)": ["widget-page", function() {
          return (0, r.setActiveItemId)(""), n.e(91300).then(n.bind(n, 191300))
        }, {
          params: {
            entity: "stats"
          },
          is_card: !1
        }],
        "stats/widgets/(:widget_code)(/)": ["advanced-stats", function() {
          return (0, r.setActiveItemId)(""), n.e(96777).then(n.bind(n, 296777))
        }, {
          params: {
            entity: "advanced-stats"
          },
          is_card: !1
        }],
        "settings/profile(/)": ["settings", function() {
          return (0, r.setActiveItemId)(""), Promise.all([n.e(95882), n.e(35412), n.e(54955)]).then(n.bind(n, 136544))
        }],
        "settings(/)": ["settings", function() {
          return (0, r.setActiveItemId)(""), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(69637)]).then(n.bind(n, 740849))
        }],
        "settings/new_version(/)": ["settings", function() {
          return n.e(27272).then(n.bind(n, 127272))
        }],
        "backup(/)(:key/)": ["settings", function() {
          return Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(69637)]).then(n.bind(n, 740849))
        }],
        "settings/custom_fields(/)": ["settings", function() {
          return n.e(40969).then(n.bind(n, 540969))
        }],
        "settings/scoring(/)": ["settings", function() {
          return n.e(53606).then(n.bind(n, 653606))
        }],
        "settings/widgets(/)(:widget_code)(/)(:subitem_code)(/)": ["widget-page", function() {
          return (0, r.setActiveItemId)(""), n.e(91300).then(n.bind(n, 191300))
        }, {
          params: {
            entity: "settings"
          },
          is_card: !1
        }],
        "settings/widgets(/)(:widget_code)(/)": ["advanced-settings", function() {
          return (0, r.setActiveItemId)(""), n.e(91300).then(n.bind(n, 191300))
        }, {
          params: {
            entity: "advanced"
          },
          is_card: !1
        }],
        "settings/widgets(/)": ["widgetsSettings", function() {
          return (0, r.setActiveItemId)(""), (0, o.isFeatureAvailable)("global_marketplace") ? Promise.all([n.e(95882), n.e(21483), n.e(58551), n.e(15899), n.e(42714), n.e(64044), n.e(6476), n.e(72209), n.e(48008), n.e(90443), n.e(57399), n.e(96851), n.e(92926), n.e(17506), n.e(94400), n.e(95473)]).then(n.bind(n, 291190)) : Promise.all([n.e(95882), n.e(21483), n.e(6476), n.e(17506), n.e(84131)]).then(n.bind(n, 817713))
        }],
        "amo-market(/)": ["widgetsSettings", function() {
          return Promise.all([n.e(95882), n.e(21483), n.e(6476), n.e(17506), n.e(84131)]).then(n.bind(n, 817713))
        }],
        "amo-market/application(/)": ["widgetsSettings", function() {
          return Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(72209), n.e(48008), n.e(90443), n.e(57399), n.e(96851), n.e(92926), n.e(95310)]).then(n.bind(n, 465143))
        }],
        "amo-market/sales(/)": ["widgetsSettings", function() {
          return Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(39970), n.e(19396)]).then(n.bind(n, 32182))
        }],
        "settings/dev(/)(page/:page/)": ["dev", function() {
          return Promise.all([n.e(35571), n.e(76921)]).then(n.bind(n, 676921))
        }],
        "settings/users(/)": ["settings-users", function() {
          return (0, r.setActiveItemId)(""), Promise.all([n.e(56740), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(36237), n.e(63905)]).then(n.bind(n, 716165))
        }],
        "settings/pipeline/leads(/)(:id)(/)": ["leads-dp", function(e) {
          try {
            var t = u(e.args, 1)[0];
            (0, r.setActiveItemId)("".concat(r.KnownNavigationItemIdV2.LEADS, "_").concat(t))
          } catch (e) {
            (0, i.captureException)(e, {
              tags: {
                text: "Error in 'settings/pipeline/leads(/)(:id)(/)' route while setting active item id"
              }
            })
          }
          return Promise.all([n.e(46014), n.e(77202), n.e(95882), n.e(58551), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(15899), n.e(42714), n.e(64044), n.e(58432), n.e(12651), n.e(68963), n.e(17433), n.e(74687), n.e(89060), n.e(61494), n.e(47731), n.e(66815), n.e(45942), n.e(81048), n.e(79461), n.e(20050)]).then(n.bind(n, 718964))
        }],
        "settings/pipeline/customers(/)(:id)(/)": ["customers-dp", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.CUSTOMERS), Promise.all([n.e(46014), n.e(77202), n.e(95882), n.e(58551), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(15899), n.e(42714), n.e(64044), n.e(58432), n.e(12651), n.e(68963), n.e(17433), n.e(74687), n.e(89060), n.e(61494), n.e(47731), n.e(66815), n.e(45942), n.e(81048), n.e(79461), n.e(20050)]).then(n.bind(n, 718964))
        }],
        "settings/communications(/)": ["settings-communications", function() {
          return (0, r.setActiveItemId)(""), Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(58551), n.e(39970), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(58432), n.e(12651), n.e(25050), n.e(87822), n.e(42518), n.e(11291), n.e(87868), n.e(38873), n.e(60930), n.e(287), n.e(67395)]).then(n.bind(n, 528446)).then((function(e) {
            return {
              default: e.default.Page
            }
          }))
        }],
        "settings/ai(/)": ["settings-ai", c((function() {
          return d(this, (function(e) {
            switch (e.label) {
              case 0:
                return (0, r.setActiveItemId)(""), [4, Promise.all([n.e(95882), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(35412), n.e(25583), n.e(59722), n.e(68848), n.e(38110)]).then(n.bind(n, 524217))];
              case 1:
                return [2, {
                  default: e.sent().default
                }]
            }
          }))
        }))],
        "settings/ai-agent(/)": ["settings", c((function() {
          return d(this, (function(e) {
            switch (e.label) {
              case 0:
                return (0, r.setActiveItemId)(""), [4, Promise.all([n.e(95882), n.e(35412), n.e(25583), n.e(59722), n.e(89953), n.e(82233), n.e(65248), n.e(96540), n.e(95709), n.e(94193), n.e(88311)]).then(n.bind(n, 717403))];
              case 1:
                return [2, {
                  default: e.sent().AiAgentPage
                }]
            }
          }))
        }))],
        "settings/ai-knowledge-sources(/)": ["settings", c((function() {
          return d(this, (function(e) {
            switch (e.label) {
              case 0:
                return (0, r.setActiveItemId)(""), [4, Promise.all([n.e(95882), n.e(35412), n.e(25583), n.e(59722), n.e(68848), n.e(88326)]).then(n.bind(n, 409282))];
              case 1:
                return [2, {
                  default: e.sent().AiKnowledgeSourcesPage
                }]
            }
          }))
        }))],
        "settings/templates(/)": ["settings", function() {
          return (0, r.setActiveItemId)(""), Promise.all([n.e(3473), n.e(35412), n.e(68942), n.e(6641), n.e(39356), n.e(87062), n.e(68166), n.e(17040), n.e(83273), n.e(75062), n.e(452), n.e(48814)]).then(n.bind(n, 252143))
        }],
        "settings/pay(/)(orders)(/)(page/:page/)(/)": ["settings", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.SETTINGS_BILLING), Promise.all([n.e(56740), n.e(95882), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(39970), n.e(41087)]).then(n.bind(n, 769586))
        }, {
          params: {
            orders: !0
          }
        }],
        "settings/pay(/)": ["settings", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.SETTINGS_BILLING), (0, o.isFeatureAvailable)("billing_global") ? Promise.all([n.e(95882), n.e(97600)]).then(n.bind(n, 997600)) : Promise.all([n.e(56740), n.e(95882), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(39970), n.e(41087)]).then(n.bind(n, 769586))
        }],
        "help(/)": ["help", function() {
          return (0, r.setActiveItemId)(r.KnownNavigationItemIdV2.HELP_CENTER), Promise.all([n.e(95882), n.e(15899), n.e(42714), n.e(64044), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(54581), n.e(58101), n.e(99076)]).then(n.bind(n, 794155))
        }],
        "catalogs(/)(:id)(/)(page/:page/)(/)": ["catalogs", function(e) {
          try {
            var t = u(e.args, 1)[0];
            (0, r.setActiveItemId)("".concat(r.KnownNavigationItemIdV2.CATALOGS, "_").concat(t))
          } catch (e) {
            (0, i.captureException)(e, {
              tags: {
                text: "Error in 'catalogs(/)(:id)(/)(page/:page/)(/)' route while setting active item id"
              }
            })
          }
          return Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(58551), n.e(39970), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(36237), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(75222), n.e(15180), n.e(71220), n.e(79310), n.e(43378)]).then(n.bind(n, 804066))
        }],
        "catalogs/(:id)/detail/(:element_id)(/)": ["catalogs", function(e) {
          try {
            var t = u(e.args, 1)[0];
            (0, r.setActiveItemId)("".concat(r.KnownNavigationItemIdV2.CATALOGS, "_").concat(t))
          } catch (e) {
            (0, i.captureException)(e, {
              tags: {
                text: "Error in 'catalogs/(:id)/detail/(:element_id)(/)' route while setting active item id"
              }
            })
          }
          return Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(58551), n.e(39970), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(71928), n.e(25050), n.e(36237), n.e(53081), n.e(56127), n.e(26901), n.e(14929), n.e(19202), n.e(60297), n.e(75222), n.e(15180), n.e(71220), n.e(79310), n.e(43378)]).then(n.bind(n, 804066))
        }],
        "amo-market/ads-manager(/)": ["widgetsSettings", function() {
          return Promise.all([n.e(56740), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(24653)]).then(n.bind(n, 542223))
        }],
        "mobile/onboarding(/)": ["mobile", function() {
          return Promise.all([n.e(15899), n.e(73264)]).then(n.bind(n, 486735))
        }],
        "_support/:entity/list(/)(page/:page)(/)": ["support", function() {
          return Promise.all([n.e(1160), n.e(48672)]).then(n.bind(n, 401160))
        }],
        "_support/:entity/detail/:id(/)": ["support", function() {
          return Promise.all([n.e(98551), n.e(43103), n.e(42281)]).then(n.bind(n, 343103))
        }],
        "_support/unban_account(/)(page/:page)(/)": ["support", function() {
          return Promise.all([n.e(1160), n.e(48672)]).then(n.bind(n, 401160))
        }, {
          params: {
            entity: "unban_account"
          }
        }],
        "_support/search_wbs(/)(page/:page)(/)": ["support", function() {
          return Promise.all([n.e(1160), n.e(48672)]).then(n.bind(n, 401160))
        }, {
          params: {
            entity: "search_wbs"
          }
        }],
        "_support/accounts/detail/:id(/)(page/:page)(/)": ["support", function() {
          return Promise.all([n.e(98551), n.e(43103), n.e(8709)]).then(n.bind(n, 984350))
        }, {
          params: {
            entity: "accounts"
          }
        }],
        "_support/users/detail/:id(/)(page/:page)(/)": ["support", function() {
          return n.e(96893).then(n.bind(n, 96893))
        }, {
          params: {
            entity: "users"
          }
        }],
        "_support/trial_coupons/detail/:id(/)(page/:page)(/)": ["support", function() {
          return n.e(57111).then(n.bind(n, 257111))
        }, {
          params: {
            entity: "trial_coupons"
          }
        }],
        "_support/trial_coupons/add(/)": ["support", function() {
          return n.e(57111).then(n.bind(n, 257111))
        }, {
          params: {
            entity: "trial_coupons"
          }
        }],
        "_support/test_mail_connection(/)": ["support", function() {
          return Promise.all([n.e(98551), n.e(43103), n.e(58420)]).then(n.bind(n, 605797))
        }],
        "_support/authorization(/)": ["support", function() {
          return n.e(88280).then(n.bind(n, 788280))
        }],
        "_support/orders/create(/)": ["support", function() {
          return n.e(86499).then(n.bind(n, 986499))
        }],
        "_support/orders/list(/)": ["support", function() {
          return Promise.all([n.e(76012), n.e(20983), n.e(95882), n.e(41203), n.e(15656), n.e(56973), n.e(41136), n.e(52853), n.e(1160), n.e(79217)]).then(n.bind(n, 184132))
        }],
        "_support/amomail/:accountId/mailbox/:id(/)": ["support", function() {
          return Promise.all([n.e(98551), n.e(43103), n.e(63080)]).then(n.bind(n, 982393))
        }],
        "_support/calls_info(/)": ["support", function() {
          return n.e(93199).then(n.bind(n, 93199))
        }],
        "_support/airewriter_global(/)": ["support", function() {
          return n.e(21705).then(n.bind(n, 221705))
        }],
        "_support/waca_landing(/)": ["support", function() {
          return n.e(39009).then(n.bind(n, 739009))
        }],
        "_support/doubles_properties(/)": ["support", function() {
          return n.e(63961).then(n.bind(n, 963961))
        }],
        "_sales/accounts(/)(:page)": ["support", function() {
          return n.e(36865).then(n.bind(n, 136865))
        }],
        "_support/employee_control(/)": ["support", function() {
          return n.e(78258).then(n.bind(n, 378258))
        }],
        "_support/widgets/design_exceptions(/)(page/:page)(/)(:widget_code)(/)": ["support", function() {
          return n.e(57847).then(n.bind(n, 257847))
        }],
        "_support/widgets/recommended(/)(page/:page)(/)(:widget_code)(/)": ["support", function() {
          return n.e(86394).then(n.bind(n, 186394))
        }],
        "_support/blocked_registration_emails(/)(page/:page)(/)": ["support", function() {
          return n.e(34926).then(n.bind(n, 134926))
        }],
        "_support/chat_channels(/)": ["support", function() {
          return n.e(91993).then(n.bind(n, 791993))
        }],
        "_support/integrations_banners/detail/:id(/)": ["support", function() {
          return n.e(25955).then(n.bind(n, 925955))
        }],
        "_support/users/statuses/monitoring": ["support", function() {
          return n.e(71594).then(n.bind(n, 371594))
        }],
        "_support/widgets_moderation/detail/:client_uuid/:version_id(/)": ["support", function() {
          return Promise.all([n.e(35571), n.e(33833)]).then(n.bind(n, 133833))
        }],
        "_support/partners/employees(/)": ["support", function() {
          return n.e(55756).then(n.bind(n, 155756))
        }],
        "_support/first_line_algorithm(/)": ["support", function() {
          return n.e(77351).then(n.bind(n, 677351))
        }],
        "_support/widgets/change_owner(/)": ["support", function() {
          return n.e(218).then(n.bind(n, 100218))
        }],
        "_support/widgets/secret_key_validation(/)": ["support", function() {
          return n.e(36911).then(n.bind(n, 36911))
        }],
        "_support/triggers(/)": ["support", function() {
          return n.e(90010).then(n.bind(n, 90010))
        }],
        "widget_page/(:widget_code)(/)(:item_code)(/)(:subitem_code)(/)": ["widget-page", function() {
          var e = c((function(e) {
            var t, o, s, a, l, c;
            return d(this, (function(d) {
              try {
                t = e.args, o = u(t, 3), s = o[0], a = o[1], l = o[2], c = "widget_page", s && (c += "_".concat(s)), a && (c += "_".concat(a)), l && (c += "_".concat(l)), (0, r.setActiveItemId)(c)
              } catch (e) {
                (0, i.captureException)(e, {
                  tags: {
                    text: "Error in 'widget_page/(:widget_code)(/)(:item_code)(/)(:subitem_code)(/)' route while setting active item id"
                  }
                })
              }
              return [2, n.e(91300).then(n.bind(n, 191300))]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(), {
          params: {
            entity: "widget_page"
          },
          is_card: !1
        }],
        "_support/questionnaire_moderation/list(/)": ["support", function() {
          return Promise.all([n.e(35571), n.e(51607)]).then(n.bind(n, 151607))
        }],
        "_support/questionnaire_moderation/detail/:questionnaire_uuid(/)": ["support", function() {
          return Promise.all([n.e(35571), n.e(41338)]).then(n.bind(n, 941338))
        }],
        "_support/users/mfa(/)": ["support", function() {
          return n.e(78158).then(n.bind(n, 878158))
        }],
        "_support/waca/waca_accounts_info(/)": ["support", function() {
          return n.e(36791).then(n.bind(n, 136791))
        }],
        "_support/waba/wa_lite_disabled(/)": ["support", function() {
          return n.e(14385).then(n.bind(n, 414385))
        }],
        "_support/waca/waca_sandbox(/)": ["support", function() {
          return n.e(33823).then(n.bind(n, 933823))
        }]
      };
      var g
    },
    944783: (e, t, n) => {
      "use strict";

      function i(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function o(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(o, s) {
            var r = e.apply(t, n);

            function a(e) {
              i(r, o, s, a, l, "next", e)
            }

            function l(e) {
              i(r, o, s, a, l, "throw", e)
            }
            a(void 0)
          }))
        }
      }
      n.r(t), n.d(t, {
        default: () => s
      });
      const s = o((function() {
        return function(e, t) {
          var n, i, o, s, r = {
            label: 0,
            sent: function() {
              if (1 & o[0]) throw o[1];
              return o[1]
            },
            trys: [],
            ops: []
          };
          return s = {
            next: a(0),
            throw: a(1),
            return: a(2)
          }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
            return this
          }), s;

          function a(s) {
            return function(a) {
              return function(s) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; r;) try {
                  if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                  switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                    case 0:
                    case 1:
                      o = s;
                      break;
                    case 4:
                      return r.label++, {
                        value: s[1],
                        done: !1
                      };
                    case 5:
                      r.label++, i = s[1], s = [0];
                      continue;
                    case 7:
                      s = r.ops.pop(), r.trys.pop();
                      continue;
                    default:
                      if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                        r = 0;
                        continue
                      }
                      if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                        r.label = s[1];
                        break
                      }
                      if (6 === s[0] && r.label < o[1]) {
                        r.label = o[1], o = s;
                        break
                      }
                      if (o && r.label < o[2]) {
                        r.label = o[2], r.ops.push(s);
                        break
                      }
                      o[2] && r.ops.pop(), r.trys.pop();
                      continue
                  }
                  s = t.call(e, r)
                } catch (e) {
                  s = [6, e], i = 0
                } finally {
                  n = o = 0
                }
                if (5 & s[0]) throw s[1];
                return {
                  value: s[0] ? s[1] : void 0,
                  done: !0
                }
              }([s, a])
            }
          }
        }(this, (function(e) {
          return [2, Promise.all([n.e(95882), n.e(21483), n.e(15899), n.e(42714), n.e(64044), n.e(6073), n.e(16092)]).then(n.bind(n, 983583))]
        }))
      }));
      var r = "../build/transpiled/tour/com/loader";
      window.define(r, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([r])
    },
    854840: (e, t, n) => {
      "use strict";
      var i;
      n.r(t), n.d(t, {
          HttpHeaders: () => i
        }),
        function(e) {
          e.X_AUTH_TOKEN = "X-Auth-Token", e.AUTHORIZATION = "Authorization"
        }(i || (i = {}))
    },
    700897: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        INTERNAL_URL_REGEX: () => o,
        URL_WITH_PROTOCOL_REGEX: () => i
      });
      var i = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        o = /^\/[^/]/
    },
    130303: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        isDebugModeEnabled: () => i.isDebugModeEnabled
      });
      var i = n(513158)
    },
    513158: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        isDebugModeEnabled: () => i
      });
      var i = function() {
        return Boolean(localStorage.getItem("debug_mode_enabled"))
      }
    },
    432708: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        awaitedPromiseCall: () => i
      });
      var i = function(e) {
        var t = e.promise,
          n = e.condition;
        return n && "boolean" != typeof n ? n.then(t) : t()
      }
    },
    695195: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        awaitedPromiseCall: () => o.awaitedPromiseCall,
        promiseWithExponentialRetry: () => i.promiseWithExponentialRetry
      });
      var i = n(593868),
        o = n(432708)
    },
    656569: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        makeBackoff: () => c
      });
      var i = n(629133),
        o = n.n(i),
        s = n(601236);

      function r(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function a(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var l = {
          numOfAttempts: 4,
          startingDelay: 100,
          maxDelay: 1 / 0,
          timeMultiple: 2,
          isRetryable: o().constant(!0)
        },
        c = function(e) {
          var t, n, i, o = (i = function(e) {
              for (var t = 1; t < arguments.length; t++) {
                var n = null != arguments[t] ? arguments[t] : {},
                  i = Object.keys(n);
                "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                  return Object.getOwnPropertyDescriptor(n, e).enumerable
                })))), i.forEach((function(t) {
                  a(e, t, n[t])
                }))
              }
              return e
            }({}, l, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : l), i.numOfAttempts < 1 && (i.numOfAttempts = 1), i),
            c = o.numOfAttempts,
            u = o.isRetryable,
            d = o.maxDelay,
            h = o.startingDelay,
            p = o.timeMultiple,
            f = 0,
            _ = function() {
              return f >= c
            },
            g = (t = function() {
              var t;
              return function(e, t) {
                var n, i, o, s, r = {
                  label: 0,
                  sent: function() {
                    if (1 & o[0]) throw o[1];
                    return o[1]
                  },
                  trys: [],
                  ops: []
                };
                return s = {
                  next: a(0),
                  throw: a(1),
                  return: a(2)
                }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
                  return this
                }), s;

                function a(s) {
                  return function(a) {
                    return function(s) {
                      if (n) throw new TypeError("Generator is already executing.");
                      for (; r;) try {
                        if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                        switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                          case 0:
                          case 1:
                            o = s;
                            break;
                          case 4:
                            return r.label++, {
                              value: s[1],
                              done: !1
                            };
                          case 5:
                            r.label++, i = s[1], s = [0];
                            continue;
                          case 7:
                            s = r.ops.pop(), r.trys.pop();
                            continue;
                          default:
                            if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                              r = 0;
                              continue
                            }
                            if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                              r.label = s[1];
                              break
                            }
                            if (6 === s[0] && r.label < o[1]) {
                              r.label = o[1], o = s;
                              break
                            }
                            if (o && r.label < o[2]) {
                              r.label = o[2], r.ops.push(s);
                              break
                            }
                            o[2] && r.ops.pop(), r.trys.pop();
                            continue
                        }
                        s = t.call(e, r)
                      } catch (e) {
                        s = [6, e], i = 0
                      } finally {
                        n = o = 0
                      }
                      if (5 & s[0]) throw s[1];
                      return {
                        value: s[0] ? s[1] : void 0,
                        done: !0
                      }
                    }([s, a])
                  }
                }
              }(this, (function(n) {
                switch (n.label) {
                  case 0:
                    if (_()) return [3, 5];
                    n.label = 1;
                  case 1:
                    return n.trys.push([1, 4, , 5]), [4, (i = function(e) {
                      var t = e.attemptNumber,
                        n = e.maxDelay,
                        i = e.startingDelay,
                        o = e.timeMultiple,
                        r = function() {
                          var e = o,
                            s = t,
                            r = i * Math.pow(e, s);
                          return Math.min(r, n)
                        };
                      return {
                        getJitteredDelay: function() {
                          return r() + (0, s.getRandom)({
                            max: 1e4
                          })
                        },
                        getDelay: r
                      }
                    }({
                      attemptNumber: f,
                      maxDelay: d,
                      startingDelay: h,
                      timeMultiple: p
                    }).getJitteredDelay, o = i(), f || (o = 0), new Promise((function(e) {
                      setTimeout(e, o)
                    })))];
                  case 2:
                    return n.sent(), [4, e()];
                  case 3:
                    return [2, n.sent()];
                  case 4:
                    if (t = n.sent(), f += 1, u(t) && !_()) return [2, g()];
                    throw t;
                  case 5:
                    return [2]
                }
                var i, o
              }))
            }, n = function() {
              var e = this,
                n = arguments;
              return new Promise((function(i, o) {
                var s = t.apply(e, n);

                function a(e) {
                  r(s, i, o, a, l, "next", e)
                }

                function l(e) {
                  r(s, i, o, a, l, "throw", e)
                }
                a(void 0)
              }))
            }, function() {
              return n.apply(this, arguments)
            });
          return g()
        }
    },
    103634: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        MakeRetryOptions: () => i.MakeRetryOptions,
        backOff: () => i.makeBackoff
      });
      var i = n(656569)
    },
    593868: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        promiseWithExponentialRetry: () => r
      });
      var i = n(629133),
        o = n(103634);

      function s(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }
      var r = function(e, t) {
        var n = t.numOfAttempts,
          r = void 0 === n ? 4 : n,
          a = t.startingDelay,
          l = void 0 === a ? 100 : a,
          c = t.isRetryable;
        return function(e, t) {
          var n = t.numOfAttempts,
            r = void 0 === n ? 4 : n,
            a = t.startingDelay,
            l = void 0 === a ? 100 : a,
            c = t.isRetryable,
            u = void 0 === c ? (0, i.constant)(!0) : c,
            d = -1;
          return (0, o.backOff)((function() {
            for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
            return d += 1, e.apply(void 0, (o = n, function(e) {
              if (Array.isArray(e)) return s(e)
            }(o) || function(e) {
              if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(o) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return s(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? s(e, t) : void 0
              }
            }(o) || function() {
              throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()).concat([d]));
            var o
          }), {
            numOfAttempts: r,
            startingDelay: l,
            isRetryable: u
          })
        }(e, {
          numOfAttempts: r,
          startingDelay: l,
          isRetryable: void 0 === c ? (0, i.constant)(!0) : c
        })
      }
    },
    63653: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        getRandom: () => i
      });
      var i = function(e) {
        var t = e.max,
          n = e.min,
          i = void 0 === n ? 0 : n;
        return Math.round(i + Math.random() * (t - i))
      }
    },
    601236: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        getRandom: () => i.getRandom
      });
      var i = n(63653)
    },
    796453: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        fetchWithChunkQuery: () => f
      });
      var i = n(629133),
        o = n.n(i),
        s = n(661533);

      function r(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function a(e, t, n, i, o, s, r) {
        try {
          var a = e[s](r),
            l = a.value
        } catch (e) {
          return void n(e)
        }
        a.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function l(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var s = e.apply(t, n);

            function r(e) {
              a(s, i, o, r, l, "next", e)
            }

            function l(e) {
              a(s, i, o, r, l, "throw", e)
            }
            r(void 0)
          }))
        }
      }

      function c(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function u(e) {
        return function(e) {
          if (Array.isArray(e)) return r(e)
        }(e) || function(e) {
          if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
        }(e) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return r(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? r(e, t) : void 0
          }
        }(e) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function d(e, t) {
        var n, i, o, s, r = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return s = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
          return this
        }), s;

        function a(s) {
          return function(a) {
            return function(s) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; r;) try {
                if (n = 1, i && (o = 2 & s[0] ? i.return : s[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, s[1])).done) return o;
                switch (i = 0, o && (s = [2 & s[0], o.value]), s[0]) {
                  case 0:
                  case 1:
                    o = s;
                    break;
                  case 4:
                    return r.label++, {
                      value: s[1],
                      done: !1
                    };
                  case 5:
                    r.label++, i = s[1], s = [0];
                    continue;
                  case 7:
                    s = r.ops.pop(), r.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                      r = 0;
                      continue
                    }
                    if (3 === s[0] && (!o || s[1] > o[0] && s[1] < o[3])) {
                      r.label = s[1];
                      break
                    }
                    if (6 === s[0] && r.label < o[1]) {
                      r.label = o[1], o = s;
                      break
                    }
                    if (o && r.label < o[2]) {
                      r.label = o[2], r.ops.push(s);
                      break
                    }
                    o[2] && r.ops.pop(), r.trys.pop();
                    continue
                }
                s = t.call(e, r)
              } catch (e) {
                s = [6, e], i = 0
              } finally {
                n = o = 0
              }
              if (5 & s[0]) throw s[1];
              return {
                value: s[0] ? s[1] : void 0,
                done: !0
              }
            }([s, a])
          }
        }
      }

      function h(e, t) {
        var n = function(e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = null != arguments[t] ? arguments[t] : {},
                i = Object.keys(n);
              "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                return Object.getOwnPropertyDescriptor(n, e).enumerable
              })))), i.forEach((function(t) {
                c(e, t, n[t])
              }))
            }
            return e
          }({}, t),
          i = !0,
          o = !1,
          r = void 0;
        try {
          for (var a, l = e[Symbol.iterator](); !(i = (a = l.next()).done); i = !0) {
            var u = a.value,
              d = u.key,
              h = u.value;
            n[d] ? Array.isArray(n[d]) ? n[d].push(h) : n[d] = [n[d], h] : n[d] = h
          }
        } catch (e) {
          o = !0, r = e
        } finally {
          try {
            i || null == l.return || l.return()
          } finally {
            if (o) throw r
          }
        }
        return s.param(n)
      }
      var p, f = (p = l((function(e) {
        var t, n, i, s, r, a, c, p, _, g, m, v, y;
        return d(this, (function(b) {
          switch (b.label) {
            case 0:
              return t = e.fetchFunction, n = e.maxChunkSize, i = e.queryParamsToChunk, s = e.requiredQueryParams, n ? [3, 2] : (r = h(i, s), [4, t(r)]);
            case 1:
              return [2, [b.sent()]];
            case 2:
              if (!(i.length <= n)) return [3, 8];
              a = h(i, s), b.label = 3;
            case 3:
              return b.trys.push([3, 5, , 8]), [4, t(a)];
            case 4:
              return [2, [b.sent()]];
            case 5:
              if (c = b.sent(), 1 === i.length) throw c;
              return p = Math.ceil(i.length / 2), _ = i.slice(0, p), g = i.slice(p), [4, f({
                fetchFunction: t,
                maxChunkSize: n,
                queryParamsToChunk: _,
                requiredQueryParams: s
              })];
            case 6:
              return m = b.sent(), [4, f({
                fetchFunction: t,
                maxChunkSize: n,
                queryParamsToChunk: g,
                requiredQueryParams: s
              })];
            case 7:
              return v = b.sent(), [2, u(m).concat(u(v))];
            case 8:
              return y = o().chunk(i, n), [4, Promise.all(y.map(function() {
                var e = l((function(e) {
                  return d(this, (function(i) {
                    return [2, f({
                      fetchFunction: t,
                      maxChunkSize: n,
                      queryParamsToChunk: e,
                      requiredQueryParams: s
                    })]
                  }))
                }));
                return function(t) {
                  return e.apply(this, arguments)
                }
              }()))];
            case 9:
              return [2, b.sent().flat()]
          }
        }))
      })), function(e) {
        return p.apply(this, arguments)
      })
    },
    539213: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        RequestsBufferManager: () => i.RequestsBufferManager,
        fetchWithChunkQuery: () => s.fetchWithChunkQuery,
        isRequestUsingCoreAuth: () => o.isRequestUsingCoreAuth
      });
      var i = n(69244),
        o = n(234742),
        s = n(796453)
    },
    234742: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        isRequestUsingCoreAuth: () => r
      });
      var i = n(854840),
        o = n(700897),
        s = n(326785),
        r = function(e) {
          var t = e.headers,
            n = void 0 === t ? {} : t,
            r = e.url,
            a = o.INTERNAL_URL_REGEX.test(r) || (0, s.getDomain)({
              url: r
            }) === (0, s.getDomain)(),
            l = n[i.HttpHeaders.AUTHORIZATION] || n[i.HttpHeaders.X_AUTH_TOKEN];
          return a && !l
        }
    },
    69244: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        RequestsBufferManager: () => a
      });
      var i = n(629133),
        o = n.n(i),
        s = n(661533);

      function r(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }
      var a = function() {
        function e() {
          var t, n;
          ! function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, e), n = void 0, (t = "buffer") in this ? Object.defineProperty(this, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : this[t] = n, this.buffer = []
        }
        var t, n;
        return t = e, (n = [{
          key: "clearAll",
          value: function() {
            this.buffer = []
          }
        }, {
          key: "add",
          value: function(e, t) {
            this.buffer.push({
              deferred: t,
              settings: e
            })
          }
        }, {
          key: "fire",
          value: function() {
            var e = [];
            o().each(this.buffer, (function(t) {
              e.push(s.ajax(t.settings).then(t.deferred.resolve, t.deferred.reject))
            })), this.clearAll()
          }
        }]) && r(t.prototype, n), e
      }()
    },
    560399: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        subscribeToTabsBroadcast: () => i.subscribeToTabsBroadcast
      });
      var i = n(519598)
    },
    519598: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        subscribeToTabsBroadcast: () => i.subscribeToTabsBroadcast
      });
      var i = n(764869)
    },
    764869: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        subscribeToTabsBroadcast: () => s
      });
      var i = n(629133),
        o = n.n(i),
        s = function(e, t) {
          return window.BroadcastChannel && o().isFunction(window.BroadcastChannel) ? function(e, t) {
            var n = new BroadcastChannel(e);
            return n.addEventListener("message", (function(e) {
                t(e.data)
              })),
              function() {
                n.close()
              }
          }(e, t) : function(e, t) {
            localStorage.removeItem(e);
            var n = function(n) {
              var i;
              n.storageArea === localStorage && n.key === e && (t(null !== (i = n.newValue) && void 0 !== i ? i : ""), localStorage.removeItem(e))
            };
            return window.addEventListener("storage", n),
              function() {
                window.removeEventListener("storage", n)
              }
          }(e, t)
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "070c0769-bcff-4b92-af5d-63ee7f90b5f6", e._sentryDebugIdIdentifier = "sentry-dbid-070c0769-bcff-4b92-af5d-63ee7f90b5f6")
    } catch (e) {}
  }();
//# sourceMappingURL=14657.4313407921c375e90c5f.js.map