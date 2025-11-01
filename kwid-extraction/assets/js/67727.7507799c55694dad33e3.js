/*! For license information please see 67727.7507799c55694dad33e3.js.LICENSE.txt */
(window.webpackChunk = window.webpackChunk || []).push([
  [67727, 37634], {
    292554: (e, t) => {
      var n;
      ! function() {
        "use strict";
        var o = {}.hasOwnProperty;

        function r() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var a = typeof n;
              if ("string" === a || "number" === a) e.push(this && this[n] || n);
              else if (Array.isArray(n)) e.push(r.apply(this, n));
              else if ("object" === a)
                if (n.toString === Object.prototype.toString)
                  for (var i in n) o.call(n, i) && n[i] && e.push(this && this[i] || i);
                else e.push(n.toString())
            }
          }
          return e.join(" ")
        }
        e.exports ? (r.default = r, e.exports = r) : void 0 === (n = function() {
          return r
        }.apply(t, [])) || (e.exports = n)
      }()
    },
    60042: (e, t) => {
      var n;
      ! function() {
        "use strict";
        var o = {}.hasOwnProperty;

        function r() {
          for (var e = [], t = 0; t < arguments.length; t++) {
            var n = arguments[t];
            if (n) {
              var a = typeof n;
              if ("string" === a || "number" === a) e.push(n);
              else if (Array.isArray(n)) {
                if (n.length) {
                  var i = r.apply(null, n);
                  i && e.push(i)
                }
              } else if ("object" === a)
                if (n.toString === Object.prototype.toString)
                  for (var s in n) o.call(n, s) && n[s] && e.push(s);
                else e.push(n.toString())
            }
          }
          return e.join(" ")
        }
        e.exports ? (r.default = r, e.exports = r) : void 0 === (n = function() {
          return r
        }.apply(t, [])) || (e.exports = n)
      }()
    },
    597052: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => o
      });
      const o = {
        button: "a116d0ed7",
        icon: "a782bc95e",
        "content-wrapper": "a432e158c",
        contents: "eac22502",
        state: "e43c5768"
      }
    },
    937634: (e, t, n) => {
      "use strict";
      var o = n(331542);
      t.createRoot = o.createRoot, t.hydrateRoot = o.hydrateRoot
    },
    541535: (e, t) => {
      "use strict";
      var n = Symbol.for("react.element"),
        o = Symbol.for("react.portal"),
        r = Symbol.for("react.fragment"),
        a = Symbol.for("react.strict_mode"),
        i = Symbol.for("react.profiler"),
        s = Symbol.for("react.provider"),
        c = Symbol.for("react.context"),
        l = Symbol.for("react.forward_ref"),
        d = Symbol.for("react.suspense"),
        u = Symbol.for("react.memo"),
        f = Symbol.for("react.lazy"),
        _ = Symbol.iterator,
        p = {
          isMounted: function() {
            return !1
          },
          enqueueForceUpdate: function() {},
          enqueueReplaceState: function() {},
          enqueueSetState: function() {}
        },
        h = Object.assign,
        m = {};

      function y(e, t, n) {
        this.props = e, this.context = t, this.refs = m, this.updater = n || p
      }

      function g() {}

      function v(e, t, n) {
        this.props = e, this.context = t, this.refs = m, this.updater = n || p
      }
      y.prototype.isReactComponent = {}, y.prototype.setState = function(e, t) {
        if ("object" != typeof e && "function" != typeof e && null != e) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, e, t, "setState")
      }, y.prototype.forceUpdate = function(e) {
        this.updater.enqueueForceUpdate(this, e, "forceUpdate")
      }, g.prototype = y.prototype;
      var b = v.prototype = new g;
      b.constructor = v, h(b, y.prototype), b.isPureReactComponent = !0;
      var w = Array.isArray,
        S = Object.prototype.hasOwnProperty,
        E = {
          current: null
        },
        A = {
          key: !0,
          ref: !0,
          __self: !0,
          __source: !0
        };

      function T(e, t, o) {
        var r, a = {},
          i = null,
          s = null;
        if (null != t)
          for (r in void 0 !== t.ref && (s = t.ref), void 0 !== t.key && (i = "" + t.key), t) S.call(t, r) && !A.hasOwnProperty(r) && (a[r] = t[r]);
        var c = arguments.length - 2;
        if (1 === c) a.children = o;
        else if (1 < c) {
          for (var l = Array(c), d = 0; d < c; d++) l[d] = arguments[d + 2];
          a.children = l
        }
        if (e && e.defaultProps)
          for (r in c = e.defaultProps) void 0 === a[r] && (a[r] = c[r]);
        return {
          $$typeof: n,
          type: e,
          key: i,
          ref: s,
          props: a,
          _owner: E.current
        }
      }

      function C(e) {
        return "object" == typeof e && null !== e && e.$$typeof === n
      }
      var I = /\/+/g;

      function P(e, t) {
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

      function k(e, t, r, a, i) {
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
              case n:
              case o:
                c = !0
            }
        }
        if (c) return i = i(c = e), e = "" === a ? "." + P(c, 0) : a, w(i) ? (r = "", null != e && (r = e.replace(I, "$&/") + "/"), k(i, t, r, "", (function(e) {
          return e
        }))) : null != i && (C(i) && (i = function(e, t) {
          return {
            $$typeof: n,
            type: e.type,
            key: t,
            ref: e.ref,
            props: e.props,
            _owner: e._owner
          }
        }(i, r + (!i.key || c && c.key === i.key ? "" : ("" + i.key).replace(I, "$&/") + "/") + e)), t.push(i)), 1;
        if (c = 0, a = "" === a ? "." : a + ":", w(e))
          for (var l = 0; l < e.length; l++) {
            var d = a + P(s = e[l], l);
            c += k(s, t, r, d, i)
          } else if (d = function(e) {
              return null === e || "object" != typeof e ? null : "function" == typeof(e = _ && e[_] || e["@@iterator"]) ? e : null
            }(e), "function" == typeof d)
            for (e = d.call(e), l = 0; !(s = e.next()).done;) c += k(s = s.value, t, r, d = a + P(s, l++), i);
          else if ("object" === s) throw t = String(e), Error("Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
        return c
      }

      function O(e, t, n) {
        if (null == e) return e;
        var o = [],
          r = 0;
        return k(e, o, "", "", (function(e) {
          return t.call(n, e, r++)
        })), o
      }

      function R(e) {
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
      var j = {
          current: null
        },
        M = {
          transition: null
        },
        N = {
          ReactCurrentDispatcher: j,
          ReactCurrentBatchConfig: M,
          ReactCurrentOwner: E
        };
      t.Children = {
        map: O,
        forEach: function(e, t, n) {
          O(e, (function() {
            t.apply(this, arguments)
          }), n)
        },
        count: function(e) {
          var t = 0;
          return O(e, (function() {
            t++
          })), t
        },
        toArray: function(e) {
          return O(e, (function(e) {
            return e
          })) || []
        },
        only: function(e) {
          if (!C(e)) throw Error("React.Children.only expected to receive a single React element child.");
          return e
        }
      }, t.Component = y, t.Fragment = r, t.Profiler = i, t.PureComponent = v, t.StrictMode = a, t.Suspense = d, t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = N, t.cloneElement = function(e, t, o) {
        if (null == e) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
        var r = h({}, e.props),
          a = e.key,
          i = e.ref,
          s = e._owner;
        if (null != t) {
          if (void 0 !== t.ref && (i = t.ref, s = E.current), void 0 !== t.key && (a = "" + t.key), e.type && e.type.defaultProps) var c = e.type.defaultProps;
          for (l in t) S.call(t, l) && !A.hasOwnProperty(l) && (r[l] = void 0 === t[l] && void 0 !== c ? c[l] : t[l])
        }
        var l = arguments.length - 2;
        if (1 === l) r.children = o;
        else if (1 < l) {
          c = Array(l);
          for (var d = 0; d < l; d++) c[d] = arguments[d + 2];
          r.children = c
        }
        return {
          $$typeof: n,
          type: e.type,
          key: a,
          ref: i,
          props: r,
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
      }, t.createElement = T, t.createFactory = function(e) {
        var t = T.bind(null, e);
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
      }, t.isValidElement = C, t.lazy = function(e) {
        return {
          $$typeof: f,
          _payload: {
            _status: -1,
            _result: e
          },
          _init: R
        }
      }, t.memo = function(e, t) {
        return {
          $$typeof: u,
          type: e,
          compare: void 0 === t ? null : t
        }
      }, t.startTransition = function(e) {
        var t = M.transition;
        M.transition = {};
        try {
          e()
        } finally {
          M.transition = t
        }
      }, t.unstable_act = function() {
        throw Error("act(...) is not supported in production builds of React.")
      }, t.useCallback = function(e, t) {
        return j.current.useCallback(e, t)
      }, t.useContext = function(e) {
        return j.current.useContext(e)
      }, t.useDebugValue = function() {}, t.useDeferredValue = function(e) {
        return j.current.useDeferredValue(e)
      }, t.useEffect = function(e, t) {
        return j.current.useEffect(e, t)
      }, t.useId = function() {
        return j.current.useId()
      }, t.useImperativeHandle = function(e, t, n) {
        return j.current.useImperativeHandle(e, t, n)
      }, t.useInsertionEffect = function(e, t) {
        return j.current.useInsertionEffect(e, t)
      }, t.useLayoutEffect = function(e, t) {
        return j.current.useLayoutEffect(e, t)
      }, t.useMemo = function(e, t) {
        return j.current.useMemo(e, t)
      }, t.useReducer = function(e, t, n) {
        return j.current.useReducer(e, t, n)
      }, t.useRef = function(e) {
        return j.current.useRef(e)
      }, t.useState = function(e) {
        return j.current.useState(e)
      }, t.useSyncExternalStore = function(e, t, n) {
        return j.current.useSyncExternalStore(e, t, n)
      }, t.useTransition = function() {
        return j.current.useTransition()
      }, t.version = "18.2.0"
    },
    827378: (e, t, n) => {
      "use strict";
      e.exports = n(541535)
    },
    323344: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        QStoJSON: () => u,
        getParam: () => _,
        getQueryParam: () => m,
        getQueryString: () => f,
        removeQueryParam: () => h,
        setParam: () => p,
        setQueryParam: () => y
      });
      var o = n(661533),
        r = n.n(o),
        a = n(629133),
        i = n.n(a),
        s = n(577486);

      function c(e, t) {
        return null != t && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? !!t[Symbol.hasInstance](e) : e instanceof t
      }

      function l(e) {
        return e.indexOf("?") >= 0 ? e.split("?")[1] : e
      }

      function d(e) {
        try {
          e = decodeURIComponent(e.toString().replace(/\+/gi, " "))
        } catch (t) {
          e = ""
        }
        return e.toString()
      }

      function u(e) {
        var t, n, o = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return "string" == typeof e ? o ? function(e, t) {
          var n, o = {},
            a = l(e);
          return i().isObject(t) || (t = {
            to_arrays: !1
          }), a ? (r().each(a.split("&"), (function(e, r) {
            var a;
            r = r.split("=");
            try {
              r[0] = decodeURIComponent(r[0])
            } catch (e) {
              return console.error(e), o
            }
            if (void 0 !== o[r[0]]) c(o[r[0]], Array) ? o[r[0]].push(d(r[1] || "")) : (n = o[r[0]].toString(), o[r[0]] = [n, d(r[1] || "")]);
            else if (r[0].indexOf("[", 1) > 0) {
              (a = r[0].split("["))[a.length] = d(r[1]);
              var i = 0,
                s = function(e, n) {
                  if (i < n.length - 1)
                    if (n[i] = n[i].replace("]", ""), "" === n[i]) Object.keys(e).length ? e[Object.keys(e).length] = n[n.length - 1] : e[0] = n[n.length - 1];
                    else {
                      e[n[i]] = e[n[i]] || (t.to_arrays && "]" === n[i + 1] ? [] : {});
                      var o = e[n[i]];
                      ++i == n.length - 1 ? e[n[i - 1]] = n[i] : s(o, n)
                    }
                };
              s(o, a)
            } else o[r[0]] = function(e) {
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
            }(r[1] || "")
          })), o) : o
        }(e, o) : function(e) {
          var t, n = {},
            o = l(e);
          if (!o) return n;
          try {
            r().each(o.split("&"), (function(e, o) {
              (o = o.split("="))[0] = decodeURIComponent(o[0]), void 0 === n[o[0]] ? n[o[0]] = d(o[1] || "") : c(n[o[0]], Array) ? n[o[0]].push(d(o[1] || "")) : (t = n[o[0]].toString(), n[o[0]] = [t, d(o[1] || "")])
            }))
          } catch (e) {
            return console.error(e), {}
          }
          return n
        }(e) : (t = e, n = [], i().each(t, (function(e, t) {
          "object" == typeof e ? i().each(e, (function(e, o) {
            n.push("".concat(t, "[").concat(isNaN(o, 10) ? o : "", "]=").concat(encodeURIComponent(e)))
          })) : n.push("".concat(t, "=").concat(encodeURIComponent(e)))
        })), n.join("&"))
      }

      function f() {
        var e = window.location.href.replace(/.*\?/, "").toString();
        return e === window.location.href && (e = ""), e || ""
      }

      function _(e) {
        var t, n = window.location.pathname || "",
          o = new s.UnsafeRegExp("".concat(e.toString(), "/([^\\/]+)"), "i");
        return !(!n.length || !(t = n.match(o)) || 2 !== t.length) && 0 | (t[1] || 1)
      }

      function p(e, t) {
        var n = window.location.pathname,
          o = f();
        return t = t || {}, i().each(e, (function(e, t) {
          _(t) ? n = n.replace(new s.UnsafeRegExp("(".concat(t, ")/([^/]?)+(/)?(.*)")), e && e.toString().length ? "$1/".concat(e, "/$4") : "$4") : e && e.toString().length && ("/" !== n.charAt(n.length - 1) && (n += "/"), n += "".concat(t, "/").concat(e, "/"))
        })), n + (!0 !== t.only_path && o.length ? "?".concat(o) : "")
      }

      function h(e, t) {
        var n, o = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).shouldDecodeValues,
          r = void 0 === o || o,
          a = ((i().isUndefined(t) ? f() : t.replace(/^\?/, "")).replace(/\+/g, " ") || "").split(/[&;]/g);
        i().isArray(e) || (e = [e]);
        try {
          i().each(e, (function(e, t) {
            for (n = "".concat(decodeURIComponent(e), "="), t = a.length; t-- > 0;) - 1 !== (r ? decodeURIComponent(a[t]) : a[t]).lastIndexOf(n, 0) && a.splice(t, 1)
          }))
        } catch (e) {
          console.error(e)
        }
        return t && 0 === t.indexOf("?") ? "?".concat(a.join("&")) : a.join("&")
      }

      function m(e) {
        var t = "?".concat(f().replace(/\[/g, "%5B").replace(/\]/g, "%5D"));
        e = e.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
        var n, o = "[\\?&]".concat(e, "=([^&#]*)"),
          r = new s.UnsafeRegExp(o).exec(t);
        if (i().isNull(r)) return !1;
        n = "phone" === e ? r[1] : r[1].replace(/\+/g, " ");
        try {
          n = decodeURIComponent(n)
        } catch (e) {
          return console.error(e), !1
        }
        return n
      }

      function y(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = window.location.pathname,
          o = i().isString(t.query_string) ? t.query_string : f();
        return 0 !== o.indexOf("?") && (o = "?".concat(o)), i().each(e, (function(e, t) {
          var n = "";
          if ("?" !== o && (n = -1 === o.indexOf("?") ? "?" : "&"), o = h(t, o), "object" == typeof e) o = "".concat(o + n + t, "=").concat(e.join("&".concat(t, "=")));
          else {
            e = encodeURIComponent(e);
            var r = new s.UnsafeRegExp("([?|&])".concat(t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "=.*?(&|$)"), "ig"),
              a = o.match(r);
            if (a)
              if (e) o = o.replace(r, "$1".concat(t, "=").concat(e, "$2"));
              else {
                var i = a[0],
                  c = i[0],
                  l = "";
                "&" === i[i.length - 1] && (l = c), o = o.replace(r, l)
              }
            else o += e ? "".concat(n + t, "=").concat(e) : ""
          }
        })), 0 !== o.indexOf("?") && (o = "?".concat(o)), !1 === t.question_mark && (o = o.replace(/^\?/, "")), (!0 === t.only_query_string ? "" : n) + ("?" === o ? "" : o.replace(/^\?&=?/, "?"))
      }
      var g = "../build/transpiled/common/urlparams";
      window.define(g, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([g])
    },
    304483: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => m
      });
      var o = n(661533),
        r = n.n(o),
        a = n(629133),
        i = n.n(a),
        s = n(460159),
        c = n.n(s),
        l = n(643095),
        d = n(313981),
        u = n(564638),
        f = n(500034),
        _ = i().template('<div <% if (scrollerId) { %>id="<%= scrollerId %>"<% } %> class="modal-scroller custom-scroll"><div class="modal-body modal-body-loading <% if (float_animation) { %>modal-body-float-animation<% } %>"></div></div>'),
        p = i().template('<div class="default-overlay modal-overlay <% if (!default_overlay) { %> modal-overlay--filled <% } %>"><span class="modal-overlay__spinner spinner-icon spinner-icon-abs-center"></span></div>'),
        h = (0, f.isFeatureAvailable)(f.Features.SYSTEM_NAVIGATION_V2);
      n(247267);
      const m = d.default.extend({
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
          var e = i().result(d.default.prototype, "events", {});
          return e["click ".concat(this._selector("try_again_button"))] = "onModalTryAgainClick", e["click ".concat(this._selector("accept_button"))] = "onModalAcceptClick", e["click ".concat(this._selector("close_button"))] = "onModalCloseClick", e["click ".concat(this._selector("cancel_button"))] = "onModalCancelClick", e["click ".concat(this._selector("scroller"))] = "onModalScrollerClick", e["mousedown ".concat(this._selector("scroller"))] = "onModalScrollerMouseDown", e["modal:loaded ".concat(this._selector("body"))] = "onModalLoaded", e["modal:centrify ".concat(this._selector("body"))] = "onModalCentrify", e["modal:need-page-reload ".concat(this._selector("body"))] = "onPageReloadAfterModalClose", e
        },
        document_events: function() {
          return i().result(d.default.prototype, "document_events", {
            "page:changed": "onPageChanged",
            keydown: "onModalKeydown"
          })
        },
        _setOptions: function(e) {
          return this.options = r().extend({
            class_name: "modal-list",
            can_centrify: !1,
            init: i().noop,
            destroy: i().noop,
            tryAgain: i().noop,
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
          d.default.prototype.initialize.call(this), this._setOptions(e).render(), APP.is_touch_device && this.options.can_centrify && i().delay(i().bind(this.onModalCentrify, this), 500), this.options.disable_resize || this._$window.on("resize".concat(this.ns), i().throttle(i().bind(this.onModalCentrify, this), u.WINDOW_RESIZE_THROTTLE_DELAY)), this.delegateEvents();
          var n = i().bind(this.options.init, this, this._elem("body"));
          return this.options.preload_templates.length && t.push(c()._preload(this.options.preload_templates)()), this.options.onBeforeInit && t.push(this.options.onBeforeInit()), t.length ? Promise.all(t).then((function() {
            n()
          })) : n(), this
        },
        destroy: function() {
          if (this.$overlay.hasClass("permanent-overlay") || !1 === this.options.destroy() || this._destroyed) return !1;
          this._destroyed = !0, this.$overlay.trigger("overlay:hide", {
            callback: i().bind(d.default.prototype.destroy, this, !0)
          }), this._elem("body").remove(), this.options.need_page_reload && this._$document.trigger("page:reload")
        },
        setNS: function() {
          this.ns = ".modal:core.".concat(i().uniqueId("modal_"))
        },
        render: function() {
          return this.$el.addClass(this.options.class_name), h && this.$el.addClass("modal-list--over-nav"), this.$el.html(_({
            float_animation: this.options.init_animation,
            scrollerId: this.options.scrollerId || ""
          })), this.$modal = this.$el, this.$overlay = r()(p({
            default_overlay: this.options.default_overlay
          })), this.$el.append(this.$overlay), r()(this.options.container).append(this.$el), r()(".modal").length > 1 && this.$overlay.css(Modernizr.prefixed("transition"), "none"), this.options.disable_overlay || this.$overlay.trigger("overlay:show"), this.$el.find(this.options.focus_element).focus(), this.$el.prepareTransition(), this
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
          var t = r()(".modal:visible", document.body),
            n = r()(e.target);
          if (t.length && i().findIndex(t, (function(e) {
              return e.isSameNode(this.el)
            }), this) === t.length - 1) switch (e.keyCode) {
            case 13:
              if (this.options.disable_enter_keydown) return;
              n.closest(".modal").length && n.is(":input, [contenteditable]") && !t.hasClass("js-modal-confirm") || (n.blur(), e.stopImmediatePropagation(), this._findElem("accept_button").trigger("click"));
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
          var t = r()(e.target);
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
              n = t.get(0),
              o = n ? n.offsetHeight : 0,
              r = n ? n.parentNode.offsetHeight : 0,
              a = this.options.without_offsets_on_centify ? 0 : 130;
            if (i().isFunction(this.options.onModalPosition)) this.options.onModalPosition(t);
            else if (o < r - a) {
              var s = n.offsetWidth;
              t.css({
                marginTop: Math.ceil(-1 * (r / 2 - o / 2 + o)) + parseFloat(t.css("top")) % 1
              }).css({
                marginLeft: Math.floor(s / 2 * -1) + parseFloat(t.css("left")) % 1
              }).removeClass("modal-body-relative").removeClass("modal-body-relative--small-screen")
            } else t.addClass("modal-body-relative").css({
              marginTop: "",
              marginLeft: ""
            }), n && n.offsetWidth + 130 > e ? t.addClass("modal-body-relative--small-screen") : t.removeClass("modal-body-relative--small-screen");
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
          this._orig_class_name_before_error_success = this._elem("body").attr("class"), this.disable_overlay_click = this._orig_disable_overlay_click, t = !i().isBoolean(t) || t, this.centrifyAnimation(!1), this._elem("overlay_spinner").hide(), this._findElem("body_inner").hide(), this._elem("body").attr("class", this._class("body")).first().show().width(500).append(c()({
            ref: "/tmpl/common/modal/error.twig"
          }).render({
            text: e || !1,
            no_retry: !t
          })).trigger("modal:loaded").trigger("modal:centrify"), (0, l.sentryLogErrorModal)(e)
        },
        showSuccess: c()._preload(["/tmpl/common/modal/success.twig"], "_showSuccess"),
        _showSuccess: function(e, t, n) {
          this._orig_class_name_before_error_success = this._elem("body").attr("class"), this.disable_overlay_click = this._orig_disable_overlay_click, this.centrifyAnimation(!1), this._elem("overlay_spinner").hide(), this._findElem("body_inner").hide(), this._elem("body").first().attr("class", this._class("body")).show().width(500).append(c()({
            ref: "/tmpl/common/modal/success.twig"
          }).render({
            msg: e || !1
          })).trigger("modal:loaded").trigger("modal:centrify"), i().delay(i().bind((function() {
            this._elem("body").attr("class", this._orig_class_name_before_error_success), this._orig_class_name_before_error_success = "", this.destroy(), i().isFunction(t) && t()
          }), this), n || 500)
        },
        requestStart: function() {
          return this.disable_overlay_click = !0, this._elem("overlay_spinner").show(), this._elem("body").hide(), this
        },
        shakeError: function() {
          this.disable_overlay_click = this._orig_disable_overlay_click, this._elem("overlay_spinner").hide(), this._elem("body").one(APP.animation_event, i().bind((function(e) {
            r()(e.currentTarget).removeClass("animated shake")
          }), this)).addClass("animated shake")
        },
        onPageReloadAfterModalClose: function() {
          this.options.need_page_reload = !0
        }
      });
      var y = "../build/transpiled/components/base/modal";
      window.define(y, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([y])
    },
    928441: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => y
      });
      var o = n(661533),
        r = n.n(o),
        a = n(629133),
        i = n.n(a),
        s = n(460159),
        c = n.n(s),
        l = n(937634),
        d = n(313981),
        u = n(445368),
        f = n(304483),
        _ = n(339095),
        p = n(827378),
        h = "/ajax/sync/calendars/",
        m = ["google_calendar"];
      const y = d.default.extend({
        events: {
          "click .js-calendar-sync-toggler": "_onStateToggle",
          "click .js-calendar-sync-setup": "_onCalendarWidgetSetup"
        },
        _classes: function() {
          return {
            calendar_status: "js-calendar-sync-status",
            calendar_status_custom_enable: "js-calendar-sync-status-custom-enable",
            calendar_status_custom_enabled: "js-calendar-sync-status-custom-enabled",
            calendar_item: "js-calendar-sync-item",
            calendar_error: "js-calendar-error"
          }
        },
        _selectors: function() {
          return {
            googleButtonContainer: "#google-button-container"
          }
        },
        initialize: function() {
          d.default.prototype.initialize.apply(this, arguments)
        },
        _requestSystemCalendars: function() {
          return r().ajax({
            url: "".concat(h, "info/?source=v3"),
            type: "GET",
            dataType: "json"
          })
        },
        showModal: function() {
          this.modal = new f.default({
            class_name: "modal-list modal-calendar-sync",
            preload_templates: ["/tmpl/todo/calendar/modal_sync.twig"],
            init: i().bind((function(e) {
              this._requestSystemCalendars().done(i().bind((function(t) {
                this.system_calendars = t._embedded, this.widget_calendars = this._getWidgetCalendars(), this.setElement(e), e.trigger("modal:loaded").html(c()({
                  ref: "/tmpl/todo/calendar/modal_sync.twig"
                }).render({
                  system_calendars: this.system_calendars,
                  widget_calendars: this._prepareWidgetsRender(this.widget_calendars),
                  lang: APP.lang
                })).trigger("modal:centrify"), this._initGoogleButton()
              }), this))
            }), this)
          })
        },
        _initGoogleButton: function() {
          var e = this._findElem("googleButtonContainer")[0];
          if (e) {
            this.googleButtonRoot = l.createRoot(e);
            var t = p.createElement(_.default, {
              buttonContent: (0, u.i18n)("Continue with Google")
            });
            this.googleButtonRoot.render(t)
          }
        },
        destroy: function() {
          this.googleButtonRoot && (this.googleButtonRoot.unmount(), this.googleButtonRoot = null), d.default.prototype.destroy.apply(this, arguments)
        },
        _getWidgetCalendars: function() {
          var e = APP.widgets.list;
          return i().reduce(i().keys(e), (function(t, n) {
            var o = e[n],
              r = o.callbacks && o.callbacks.calendarSync;
            return r && (t[n] = r()), t
          }), {})
        },
        _onSuccessWidgetLoading: function(e, t) {
          var n = this.$el.find('[data-calendar-id="'.concat(e, '"]'));
          t ? this._setEnabledStatus(n) : this._setDisabledStatus(n), n.removeClass("js-loading")
        },
        _onFailedWidgetLoading: function(e, t) {
          var n = this.$el.find('[data-calendar-id="'.concat(e, '"]')),
            o = n.find(this._selector("calendar_error"));
          n.addClass("js-error"), o.text(t || APP.lang.error)
        },
        _prepareWidgetsRender: function(e) {
          var t = this;
          return i().reduce(i().keys(e), (function(n, o) {
            var r = e[o],
              a = APP.widgets.list[o].params,
              s = i().isFunction(r.onSetup),
              c = !i().isBoolean(r.enabled),
              l = !c && r.enabled;
            return c && r.enabled.then((function(e) {
              t._onSuccessWidgetLoading(o, e)
            }), (function(e) {
              t._onFailedWidgetLoading(o, e)
            })), n[o] = i().extend({
              is_setup_possible: s,
              is_loading: c,
              is_enabled: l,
              icon: "".concat(a.path, "/images/logo_small.png?v=").concat(a.version)
            }, i().pick(r, "name", "description")), n
          }), {})
        },
        _showErrorModal: function(e) {
          this._error_modal || (this._error_modal = this._addComponent(f.default, {
            destroy: i().bind((function() {
              delete this._error_modal
            }), this)
          }).showError(e, !1))
        },
        _enableCalendar: function(e) {
          var t = e.data("calendar-id");
          switch (e.data("calendar-origin")) {
            case "system":
              return window.open(this.system_calendars[t]._links.href), r().Deferred().resolve().promise();
            case "widget":
              return this.widget_calendars[t].onEnable();
            default:
              throw new Error("Unknown calendar origin.")
          }
        },
        _disableCalendar: function(e) {
          var t = e.data("calendar-id");
          switch (e.data("calendar-origin")) {
            case "system":
              return r().ajax({
                url: "".concat(h, "disable/"),
                type: "POST",
                data: {
                  calendar_type: t,
                  current_auth_email: this.system_calendars[t].current_auth_email
                },
                dataType: "json"
              });
            case "widget":
              return this.widget_calendars[t].onDisable();
            default:
              throw new Error("Unknown calendar origin.")
          }
        },
        _setEnabledStatus: function(e) {
          var t = e.attr("data-calendar-id"),
            n = i().includes(m, t),
            o = e.find(this._selector("calendar_status"));
          n || o.html(APP.lang["Fully on"]), e.addClass("js-active")
        },
        _setDisabledStatus: function(e) {
          var t = e.attr("data-calendar-id"),
            n = i().includes(m, t),
            o = e.find(this._selector("calendar_status"));
          n || o.html(APP.lang.enable), e.removeClass("js-active")
        },
        _onStateToggle: function(e) {
          var t = this,
            n = r()(e.currentTarget).closest(this._selector("calendar_item"));
          n.hasClass("js-active") ? this._disableCalendar(n).then((function() {
            t._setDisabledStatus(n)
          }), (function(e) {
            t._showErrorModal(e)
          })) : this._enableCalendar(n).then((function() {
            t._setEnabledStatus(n)
          }), (function(e) {
            t._showErrorModal(e)
          }))
        },
        _onCalendarWidgetSetup: function(e) {
          var t = r()(e.currentTarget).closest(this._selector("calendar_item")).data("calendar-id");
          this.widget_calendars[t].onSetup()
        }
      });
      var g = "../build/transpiled/components/base/todo_sync";
      window.define(g, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([g])
    },
    366302: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        disallowedWidgetsRegExp: () => c
      });
      var o = n(971588),
        r = n(577486),
        a = ["amo_mailchimp", "mailchimp_kommo", "t57c8mssj0hf4lyfyefawyicehiykduabll1w3gt", "amo_1c_fresh", "amo_unf", "amo_tinkoffbacq", "amo_yakassa", "amo_sberbacq", "amo_alfabacq", "amo_twilio6", "mercado_libre", "linkedin_kommo", "wix_kommo", "lazada", "nuvemshop", "woocom", "shopify", "gotoconnect", "amo_rd_station", "amo_googledocsgenv2", "amo_docsgenv2_com", "paypal", "mercado_pago", "amo_dropbox", "amo_zoom", "amo_zapier", "dlzsz9jezzn3yicnojvtwddrip6anomozhrybv72", "amo_intercom", "amo_activecampaign", "amo_stripe", "amo_typeform", "lzawrqwjjathddycg8griw0lwx1bfaodscd4wfwh", "amo_jotform", "amo_ringcentral_vol2", "zenvia_voip", "nvoip", "amo_smsc", "amo_yametrika", "amo_new_moysklad", "avito_work", "amo_evotor", "amo_eskiz", "amo_lead_scraper", "amo_tranzaptorcom", "amo_asterisk", "amo_zendesk", "amo_ofd", "google_translator", "cloudtalk", "xf2tnprxxab1iax0sclmvrsbwcyazdoxywdgaj1b", "tokopedia", "api4com", "amo_aircall", o.default.WHATSAPP, o.default.WHATSAPP_WHITE, o.default.TIKTOK],
        i = "(".concat(a.join("|"), ")"),
        s = "\\/(upl|widgets)\\/(?!(".concat(i, ")\\/).*"),
        c = new r.UnsafeRegExp("".concat("https?:\\/\\/([^.]+\\.)?([^.]+\\.)?(amocrm2?\\.(saas|ru)|kommo2?\\.com)").concat(s))
    },
    643095: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        captureException: () => v,
        isDisallowedWidgetTraceDetected: () => m,
        sentryLogBrokenFeed: () => C,
        sentryLogErrorHandler: () => E,
        sentryLogErrorModal: () => w,
        sentryLogFailedGetAmojoToken: () => A,
        sentryLogSocketDisconnect: () => T,
        sentryLogSpaceError: () => S,
        sentryLogUserflowUpdateUserError: () => I,
        startBrowserTracingSpan: () => y
      });
      var o = n(661533),
        r = n.n(o),
        a = n(629133),
        i = n.n(a),
        s = n(998798),
        c = n(955026),
        l = n(366302);

      function d(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, o = new Array(t); n < t; n++) o[n] = e[n];
        return o
      }

      function u(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function f(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            o = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (o = o.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), o.forEach((function(t) {
            u(e, t, n[t])
          }))
        }
        return e
      }
      var _ = [],
        p = [],
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
        t && i().isFunction(window.sentryStartBrowserTracingSpan) && window.sentryStartBrowserTracingSpan({
          isPageLoad: APP.first_load,
          entity: t
        })
      }

      function g() {
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
          n = window.Sentry;
        n && navigator.onLine ? (_.length && b(), t.tags = i().defaults(t.tags || {}, {
          "manually-logged": !0
        }), n.captureException(e, t)) : (_.push([e, t]), (0, c.isDev)() && console.error("Sentry is offline, error pushed to queue:", e, t))
      }

      function b() {
        var e = _.slice(0);
        _ = [], i().each(e, (function(e) {
          var t;
          v.apply(void 0, function(e) {
            if (Array.isArray(e)) return d(e)
          }(t = e) || function(e) {
            if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
          }(t) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return d(e, t);
              var n = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? d(e, t) : void 0
            }
          }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }())
        }))
      }

      function w(e) {
        var t = g(),
          n = new Error("Error modal showed - ".concat(t));
        n.stack && m(n.stack) || setTimeout((function() {
          v(n, {
            tags: {
              "oops-error.entity": t,
              "navigator.online": navigator.onLine,
              "message.empty": i().isEmpty(e)
            },
            extra: {
              "Error Message": e,
              "Last Ajaxes": p
            }
          }), p = []
        }))
      }

      function S(e) {
        var t = e.errXHR,
          n = e.extra,
          o = void 0 === n ? {} : n;
        if (t) {
          var r = t.getResponseHeader("X-Request-Id"),
            a = t.status,
            i = t.responseText,
            s = g();
          v(new Error("Space error - ".concat(s)), {
            tags: {
              "space-error.entity": s,
              "navigator.online": navigator.onLine
            },
            extra: f({
              "Request Id": r,
              "Status Code": a,
              "Response Message": i
            }, o)
          })
        }
      }

      function E(e) {
        var t = e.errXHR,
          n = e.variant,
          o = e.extra,
          r = void 0 === o ? {} : o;
        if (t) {
          var a = t.status,
            i = t.responseText,
            s = t.getResponseHeader("X-Request-Id"),
            c = g();
          v(new Error("Error handler - ".concat(c)), {
            tags: {
              "error-handler.entity": c,
              "navigator.online": navigator.onLine,
              "handle.variant": n
            },
            extra: f({
              "Request Id": s,
              "Status Code": a,
              "Response Message": i
            }, r)
          })
        }
      }

      function A(e) {
        var t = e.responseJSON,
          n = void 0 === t ? {} : t,
          o = e.isNetworkError,
          r = void 0 !== o && o,
          a = APP.constant("account").subdomain,
          i = (n.response || {}).error,
          s = void 0 === i ? {
            error: ""
          } : i;
        v(new Error("Failed to receive amojo token"), {
          tags: {
            subdomain: a
          },
          extra: {
            "Error reason": r ? "Network error" : s
          }
        })
      }

      function T() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.reason,
          n = void 0 === t ? {} : t,
          o = e.socketName,
          r = void 0 === o ? "" : o,
          a = e.code,
          i = APP.constant("account").subdomain;
        v("Socket disconnected - ".concat(r), {
          tags: {
            subdomain: i,
            socket: r,
            "socket.error-code": a
          },
          extra: {
            "Disconnected reason": JSON.stringify(n),
            level: h.info
          }
        })
      }

      function C() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = g();
        v(new Error("Broken feed - ".concat(t, " ")), {
          tags: {
            "broken-feed.entity": t
          },
          extra: {
            Options: e
          }
        })
      }

      function I(e) {
        var t = e.responseJSON,
          n = APP.constant("account").subdomain,
          o = t.status,
          r = t.title;
        v(new Error("Userflow Update User Error"), {
          tags: {
            subdomain: n
          },
          extra: {
            "Response JSON": {
              status: o,
              title: r
            }
          }
        })
      }
      r()(document).on("ajaxError ajaxComplete", (function(e, t, n) {
        ! function(e, t) {
          var n = {
              url: t.url,
              requestId: e.getResponseHeader("X-Request-Id"),
              status: e.status
            },
            o = e.responseText;
          i().isString(o) && o.length && i().extend(n, {
            responseMessage: o
          }), p.push(n), p.length > 5 && p.shift()
        }(t, n)
      })), r()(window).on("online", b)
    },
    397927: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        BUTTON_LIKE_ITEMS_IDS: () => u,
        CounterId: () => d,
        KnownNavigationItemIdV1: () => o,
        KnownNavigationItemIdV2: () => r,
        addItem: () => b,
        removeItem: () => w,
        setActiveItemId: () => y,
        setTelephonyState: () => v,
        updateItemCounter: () => g
      });
      var o, r, a = n(500034);

      function i(e, t, n, o, r, a, i) {
        try {
          var s = e[a](i),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(o, r)
      }

      function s(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(o, r) {
            var a = e.apply(t, n);

            function s(e) {
              i(a, o, r, s, c, "next", e)
            }

            function c(e) {
              i(a, o, r, s, c, "throw", e)
            }
            s(void 0)
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

      function l(e, t) {
        var n, o, r, a, i = {
          label: 0,
          sent: function() {
            if (1 & r[0]) throw r[1];
            return r[1]
          },
          trys: [],
          ops: []
        };
        return a = {
          next: s(0),
          throw: s(1),
          return: s(2)
        }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this
        }), a;

        function s(a) {
          return function(s) {
            return function(a) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; i;) try {
                if (n = 1, o && (r = 2 & a[0] ? o.return : a[0] ? o.throw || ((r = o.return) && r.call(o), 0) : o.next) && !(r = r.call(o, a[1])).done) return r;
                switch (o = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                  case 0:
                  case 1:
                    r = a;
                    break;
                  case 4:
                    return i.label++, {
                      value: a[1],
                      done: !1
                    };
                  case 5:
                    i.label++, o = a[1], a = [0];
                    continue;
                  case 7:
                    a = i.ops.pop(), i.trys.pop();
                    continue;
                  default:
                    if (!((r = (r = i.trys).length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                      i = 0;
                      continue
                    }
                    if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                      i.label = a[1];
                      break
                    }
                    if (6 === a[0] && i.label < r[1]) {
                      i.label = r[1], r = a;
                      break
                    }
                    if (r && i.label < r[2]) {
                      i.label = r[2], i.ops.push(a);
                      break
                    }
                    r[2] && i.ops.pop(), i.trys.pop();
                    continue
                }
                a = t.call(e, i)
              } catch (e) {
                a = [6, e], o = 0
              } finally {
                n = r = 0
              }
              if (5 & a[0]) throw a[1];
              return {
                value: a[0] ? a[1] : void 0,
                done: !0
              }
            }([a, s])
          }
        }
      }! function(e) {
        e.CHATS = "chats", e.MAIL = "mail", e.TODO = "todo"
      }(o || (o = {})),
      function(e) {
        e.CHATS_INBOX = "chats", e.EMAIL_INBOX = "mail", e.EMAIL_RECEIVED = "email_received", e.TEAM_INBOX = "team_inbox", e.NOTIFICATIONS = "notifications", e.TASKS = "tasks", e.SETTINGS = "settings", e.FEEDBACK = "feedback", e.LEADS = "leads", e.CUSTOMERS = "customers", e.CHATS = "communications", e.CATALOGS = "catalogs", e.AI_AUTOMATION = "ai-automation", e.STATS = "stats", e.HELP = "help-center", e.WHATSAPP = "whatsapp", e.SETTINGS_WORKSPACE = "settings_workspace", e.SETTINGS_BILLING = "settings_billing", e.SETTINGS_NOTIFICATIONS = "settings_notifications", e.CONTACT_SUPPORT = "contact_support", e.AI_COPILOT = "ai_copilot", e.HELP_CENTER = "help_center", e.ADMINISTRATION = "support", e.DASHBOARD = "dashboard", e.ALL_LEADS = "all_leads", e.BROADCASTING = "broadcasting", e.TEMPLATES = "templates", e.CHAT_TEMPLATES = "chat_templates", e.WHATSAPP_FEATURES = "whatsapp_features", e.WHATSAPP_BROADCASTING = "whatsapp_broadcasting", e.WHATSAPP_AI_AGENT = "whatsapp_ai-agent", e.WHATSAPP_TEMPLATES = "whatsapp_templates", e.WHATSAPP_BOTS = "whatsapp_bots", e.CONTACTS_ALL = "catalogs_contacts_and_companies", e.CONTACTS = "catalogs_contacts", e.COMPANIES = "catalogs_companies", e.FILES = "catalogs_files", e.EMAIL_SENT = "email_sent", e.EMAIL_DELETED = "email_deleted", e.EMAIL_TEMPLATES = "email_templates", e.SETTINGS_EMAIL = "settings_email", e.REPORT_BY_ACTIVITIES = "report_by_activities", e.CONSOLIDATED_REPORT = "consolidated_report", e.GOAL_REPORT = "goal_report", e.CALL_REPORT = "call_report", e.ACTIVITY_LOG = "activity_log", e.REPORT_BY_CUSTOMERS = "report_by_customers", e.BOTS = "bots", e.ARCHIVED_PIPELINES = "archived_pipelines"
      }(r || (r = {}));
      var d, u = new Set(["notifications", "ai_copilot", "help-center", "contact_support"]);
      ! function(e) {
        e.MAIL = "mail", e.TODO = "todo", e.CHATS = "chats", e.NOTIFICATIONS = "notifications", e.CHATS_INBOX = "chats", e.TEAM_INBOX = "team_inbox"
      }(d || (d = {}));
      var f, _, p = (f = s((function() {
          return l(this, (function(e) {
            switch (e.label) {
              case 0:
                return [4, Promise.all([n.e(68592), n.e(95882), n.e(60190), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(31542), n.e(3473), n.e(32760), n.e(94046), n.e(14558), n.e(73197), n.e(28422), n.e(47287), n.e(34385), n.e(43323), n.e(35370), n.e(84330), n.e(61926)]).then(n.bind(n, 343377))];
              case 1:
                return [2, e.sent().navigationBarView]
            }
          }))
        })), function() {
          return f.apply(this, arguments)
        }),
        h = function() {
          var e = s((function() {
            return l(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, Promise.all([n.e(14558), n.e(73197), n.e(52963)]).then(n.bind(n, 537107))];
                case 1:
                  return [2, e.sent().default]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        m = (c(_ = {}, "mail", "mail"), c(_, "todo", "tasks"), _),
        y = function() {
          var e = s((function(e, t) {
            return l(this, (function(n) {
              switch (n.label) {
                case 0:
                  return (0, a.isFeatureAvailable)(a.Features.SYSTEM_NAVIGATION_V2) ? [4, p()] : [2];
                case 1:
                  return n.sent().setActiveItemId(e, t), [2]
              }
            }))
          }));
          return function(t, n) {
            return e.apply(this, arguments)
          }
        }(),
        g = function() {
          var e = s((function(e) {
            var t;
            return l(this, (function(n) {
              switch (n.label) {
                case 0:
                  return (0, a.isFeatureAvailable)(a.Features.SYSTEM_NAVIGATION_V2) ? (t = "id" in e && m[e.id] ? (o = function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                      var n = null != arguments[t] ? arguments[t] : {},
                        o = Object.keys(n);
                      "function" == typeof Object.getOwnPropertySymbols && (o = o.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                        return Object.getOwnPropertyDescriptor(n, e).enumerable
                      })))), o.forEach((function(t) {
                        c(e, t, n[t])
                      }))
                    }
                    return e
                  }({}, e), r = null != (r = {
                    id: m[e.id]
                  }) ? r : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(o, Object.getOwnPropertyDescriptors(r)) : function(e, t) {
                    var n = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                      var o = Object.getOwnPropertySymbols(e);
                      n.push.apply(n, o)
                    }
                    return n
                  }(Object(r)).forEach((function(e) {
                    Object.defineProperty(o, e, Object.getOwnPropertyDescriptor(r, e))
                  })), o) : e, [4, p()]) : [3, 2];
                case 1:
                  return n.sent().updateItemCounter(t), [2];
                case 2:
                  return [4, h()];
                case 3:
                  return n.sent().updateItemCounter(e), [2]
              }
              var o, r
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        v = function() {
          var e = s((function(e) {
            return l(this, (function(t) {
              switch (t.label) {
                case 0:
                  return (0, a.isFeatureAvailable)(a.Features.SYSTEM_NAVIGATION_V2) ? [4, p()] : [3, 2];
                case 1:
                  return t.sent().setTelephonyState((null == e ? void 0 : e.isEnabled) ? {
                    isEnabled: !0,
                    onClick: function(t, n) {
                      t.stopPropagation(), e.onClick && e.onClick.call(n)
                    }
                  } : {
                    isEnabled: !1
                  }), [2];
                case 2:
                  return [4, h()];
                case 3:
                  return t.sent().setTelephonyState(e), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        b = function() {
          var e = s((function(e) {
            var t, n, o;
            return l(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.id, n = e.title, o = e.path, (0, a.isFeatureAvailable)(a.Features.SYSTEM_NAVIGATION_V2) && "groupId" in e ? [4, p()] : [3, 2];
                case 1:
                  return [2, r.sent().addItem({
                    groupId: e.groupId,
                    pinnedSectionEntity: e.pinnedSectionEntity,
                    id: t,
                    title: n,
                    path: o,
                    icon: e.icon
                  })];
                case 2:
                  return "description" in e ? [4, h()] : [3, 4];
                case 3:
                  return [2, r.sent().addMenuItem({
                    item_name: t,
                    item_label: n,
                    item_description: e.description,
                    item_code: o
                  })];
                case 4:
                  return [2, !1]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        w = function() {
          var e = s((function(e) {
            return l(this, (function(t) {
              switch (t.label) {
                case 0:
                  return (0, a.isFeatureAvailable)(a.Features.SYSTEM_NAVIGATION_V2) ? [4, p()] : [3, 2];
                case 1:
                  return [2, t.sent().removeItem(e)];
                case 2:
                  return [4, h()];
                case 3:
                  return [2, t.sent().removeMenuItem(e)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        S = "../build/transpiled/interface/left_menu/utils";
      window.define(S, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([S])
    },
    367727: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => f
      });
      var o = n(661533),
        r = n.n(o),
        a = n(629133),
        i = n.n(a),
        s = n(323344),
        c = n(509372),
        l = n(397927),
        d = n(928441);
      r()(document).ajaxComplete((function(e, t) {
        t.getResponseHeader("X-Core-Server") && t.getResponseHeader("X-Core-Tasks") && (0, l.updateItemCounter)({
          id: l.CounterId.TODO,
          count: t.getResponseHeader("X-Core-Tasks") || ""
        })
      }));
      var u = function(e) {
        this.view = e, this.sync = new d.default, e.$el.on("click".concat(this.ns), ".js-list-caption-link", (function() {
          var t = r()(this),
            n = (0, s.getQueryString)(),
            o = t.attr("data-calendar-view"),
            a = (o || "").replace("agenda", "").toLowerCase();
          return e.$el.find(".list__top__preset .list-top-nav__text-button_active").not(this).removeClass("list-top-nav__text-button_active"), t.addClass("list-top-nav__text-button_active"), e.$calendar && e.$calendar.length && o ? (e.search.filter.setUrl("/todo/calendar/".concat(a, "/")), e.search.filter.$(".filter__list__item a").each((function() {
            r()(this).attr("href", r()(this).attr("href").replace(/\/todo\/calendar\/(\w+)\//, "/todo/calendar/".concat(a, "/")))
          })), (0, c.set)({
            name: "LAST_PLACE_TODO",
            value: "calendar/".concat(a)
          }), APP.router.navigate(t.attr("href") + (n ? "?".concat(n) : ""), {
            trigger: !1,
            replace: !1
          }), e.$calendar.fullCalendar("changeView", o)) : APP.router.navigate(t.attr("href") + (n ? "?".concat(n) : ""), {
            trigger: !0
          }), !1
        })).on("click".concat(this.ns), ".js-modal-custom-types", (function() {
          Promise.all([n.e(14558), n.e(84989)]).then(n.bind(n, 284989)).then((function(e) {
            new(0, e.default)
          }))
        })).on("click".concat(this.ns), ".js-todos-sync:not(.js-disabled)", i().bind((function() {
          this.sync.showModal()
        }), this)), "#sync_calendars" === window.location.hash && this.sync.showModal()
      };
      u.prototype.ns = ".todos:page:common", u.prototype.destroy = function() {
        this.view && this.view.$el.off(this.ns), this.sync && this.sync.destroy()
      };
      const f = u;
      var _ = "../build/transpiled/interface/todos/common";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
    },
    339095: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => f
      });
      var o = n(629133),
        r = n.n(o),
        a = n(292554),
        i = n.n(a),
        s = n(491967),
        c = n(445368),
        l = n(597052),
        d = n(827378),
        u = i().bind(l.default);
      const f = function(e) {
        var t = e.onClick,
          n = void 0 === t ? r().noop : t,
          o = e.buttonContent,
          a = void 0 === o ? (0, c.i18n)("Sign in with Google") : o;
        return d.createElement("button", {
          onClick: n,
          className: u("button")
        }, d.createElement("div", {
          className: u("state")
        }), d.createElement("div", {
          className: u("content-wrapper")
        }, d.createElement(s.default, {
          type: "svg",
          name: "common--google-sm",
          className: u("icon")
        }), d.createElement("span", {
          className: u("contents")
        }, a)))
      }
    },
    971588: (e, t, n) => {
      "use strict";
      var o;
      n.r(t), n.d(t, {
          default: () => r
        }),
        function(e) {
          e.FACEBOOK = "facebook", e.MESSENGER = "messenger", e.INSTAGRAM_BUSINESS = "instagram_business", e.INSTAGRAM = "instagram", e.WHATSAPP = "amocrm_whatsapp", e.WHATSAPP_WHITE = "whatsapp_cloud_api", e.TELEGRAM = "telegram", e.TIKTOK = "tiktok_kommo"
        }(o || (o = {}));
      const r = o
    },
    564638: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        WINDOW_RESIZE_THROTTLE_DELAY: () => o
      });
      var o = 10
    },
    491967: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => i
      });
      var o = n(60042),
        r = n.n(o),
        a = n(827378);
      const i = function(e) {
        var t = e.name,
          n = e.className,
          o = void 0 === n ? "" : n;
        return "png" === e.type ? a.createElement("span", {
          className: r()("icon", t, o, {
            "icon-inline": e.isInline
          })
        }) : a.createElement("svg", {
          className: "svg-icon svg-".concat(t, "-dims ").concat(o)
        }, a.createElement("use", {
          xlinkHref: "#".concat(t)
        }))
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "2b743863-c310-4b7d-90f2-5da63d2c3337", e._sentryDebugIdIdentifier = "sentry-dbid-2b743863-c310-4b7d-90f2-5da63d2c3337")
    } catch (e) {}
  }();
//# sourceMappingURL=67727.7507799c55694dad33e3.js.map