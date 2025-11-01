"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [80815], {
    58544: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        "operday-timer": "operday-timer",
        "operday-timer__holder": "operday-timer__holder",
        "operday-timer__input": "operday-timer__input",
        "operday-timer__input--white": "operday-timer__input--white",
        "operday-timer__text": "operday-timer__text",
        "operday-timer__seconds-wrapper": "operday-timer__seconds-wrapper",
        "operday-timer__control-element": "operday-timer__control-element",
        "svg-analytics--play-dims": "svg-analytics--play-dims",
        "svg-analytics--pause-dims": "svg-analytics--pause-dims",
        "operday-timer__control-element--play": "operday-timer__control-element--play",
        "operday-timer__control-element--pause": "operday-timer__control-element--pause",
        "operday-timer__colon": "operday-timer__colon",
        "operday-timer__suggest": "operday-timer__suggest",
        blinking: "blinking",
        "operday-timer__suggest--active-blinker": "operday-timer__suggest--active-blinker",
        "operday-timer__content": "operday-timer__content",
        "operday-timer__plug": "operday-timer__plug",
        "control--suggest--down-btn": "control--suggest--down-btn",
        "control--suggest--list-opened": "control--suggest--list-opened",
        "control--suggest--list--item": "control--suggest--list--item",
        "card-widgets": "card-widgets",
        "js-widgets-active": "js-widgets-active",
        "operday-timer__show": "operday-timer__show"
      }
    },
    126608: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => l
      });
      var r = n(987081);

      function o(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
        }
      }

      function i(e, t, n) {
        return i = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var r = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = a(e)););
            return e
          }(e, t);
          if (r) {
            var o = Object.getOwnPropertyDescriptor(r, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, i(e, t, n || e)
      }

      function a(e) {
        return a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, a(e)
      }

      function s(e, t) {
        return s = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, s(e, t)
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
          var n, r = a(e);
          if (t) {
            var o = a(this).constructor;
            n = Reflect.construct(r, arguments, o)
          } else n = r.apply(this, arguments);
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
          }), t && s(e, t)
        }(l, e);
        var t, n, u = c(l);

        function l() {
          for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
          var r;
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, l), (r = u.call(this, t))._queuedValues = [], r
        }
        return t = l, (n = [{
          key: "next",
          value: function(e) {
            this.closed || this.observers.length ? i(a(l.prototype), "next", this).call(this, e) : this._queuedValues.push(e)
          }
        }, {
          key: "_subscribe",
          value: function(e) {
            var t = this,
              n = r.Subject.prototype._subscribe.call(this, e);
            return this._queuedValues.length && (this._queuedValues.forEach((function(e) {
              i(a(l.prototype), "next", t).call(t, e)
            })), this._queuedValues.splice(0)), n
          }
        }]) && o(t.prototype, n), l
      }(r.Subject);
      u.constructor = u;
      const l = u;
      var d = "../build/transpiled/common/rx/queueing_subject";
      window.define(d, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([d])
    },
    535571: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => u
      });
      var r = n(629133),
        o = n.n(r),
        i = n(987081),
        a = n(49091);

      function s(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var c = function(e, t) {
        return new WebSocket(e, t)
      };

      function u(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
          r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : c,
          u = new i.BehaviorSubject({
            state: 0,
            code: a.CONNECTION_CODES.DEFAULT
          }),
          l = new i.Observable((function(i) {
            var c = r(e, n),
              l = null,
              d = !1,
              f = 0,
              p = function(e) {
                var t, n;
                f++, u.next((t = function(e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {},
                      r = Object.keys(n);
                    "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                      return Object.getOwnPropertyDescriptor(n, e).enumerable
                    })))), r.forEach((function(t) {
                      s(e, t, n[t])
                    }))
                  }
                  return e
                }({}, e), n = null != (n = {
                  id: f
                }) ? n : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : function(e, t) {
                  var n = Object.keys(e);
                  if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    n.push.apply(n, r)
                  }
                  return n
                }(Object(n)).forEach((function(e) {
                  Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                })), t))
              },
              _ = function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                  t = e.code,
                  n = e.reason;
                p({
                  state: 0,
                  code: t,
                  reason: void 0 === n ? "" : n
                }), d && (d = !1)
              };
            c.onopen = function() {
              d = !0, p({
                state: 1,
                code: a.CONNECTION_CODES.DEFAULT
              }), t && (l = t.subscribe((function(e) {
                c.send(e)
              })))
            }, c.onmessage = function(e) {
              i.next(e.data)
            }, c.onerror = function(e) {
              i.error(e), _({
                code: a.CONNECTION_CODES.DEFAULT
              })
            }, c.onclose = function(e) {
              _({
                code: e.code,
                reason: e.reason
              }), e.wasClean ? i.complete() : i.error(new Error(e.reason))
            };
            var h = function() {
              o().contains([c.CLOSED, c.CLOSING], c.readyState) || (_({
                code: a.CONNECTION_CODES.OFFLINE
              }), c.close())
            };
            return window.addEventListener("offline", h),
              function() {
                l && l.unsubscribe(), window.removeEventListener("offline", h), c && c.close()
              }
          }));
        return {
          messages: l,
          connectionStatus: u
        }
      }
      var l = "../build/transpiled/common/rx/websockets";
      window.define(l, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([l])
    },
    111073: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => p
      });
      var r = n(629133),
        o = n.n(r),
        i = n(987081),
        a = n(128508),
        s = (n(643095), n(49091)),
        c = n(168807);

      function u(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var l = 1,
        d = [],
        f = function() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          ! function(e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = null != arguments[t] ? arguments[t] : {},
                r = Object.keys(n);
              "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                return Object.getOwnPropertyDescriptor(n, e).enumerable
              })))), r.forEach((function(t) {
                u(e, t, n[t])
              }))
            }
          }({
            socketName: s.SOCKET_NAMES.AMOJO
          }, e)
        };

      function p(e, t) {
        var n, r, u, p, _ = function() {
            d.length ? o().each(d, (function(e) {
              return e.closeHard()
            })) : m.next()
          },
          h = !1,
          y = 0,
          m = new i.Subject,
          g = m.pipe(a.switchMap((function() {
            return i.timer(0)
          }))),
          v = o().extend({}, {
            connect: i.of(e),
            onConnectionChange: o().noop
          }, t) || {},
          b = (p = [], n || (n = new i.Observable((function(e) {
            v.connect().subscribe((function(t) {
              var n = t.url,
                i = o().once((function() {
                  return v.onConnectionChange({
                    status: s.SOCKET_STATE.DISCONNECTED,
                    delay: 0
                  })
                }));
              (r = new WebSocket(n)).onmessage = function(t) {
                e.next(t)
              }, r.onerror = function(t) {
                e.error(t)
              }, r.onclose = function(t) {
                var n;
                if (o().contains(d, t.target)) {
                  var a = t.code;
                  if (i(), d = o().without(d, t.target), r = null, u = a === s.CONNECTION_CODES.UNAUTHORIZED, !h && (null === (n = window.navigator) || void 0 === n ? void 0 : n.onLine) && a !== s.CONNECTION_CODES.NORMAL_CLOSURE && f({
                      code: a,
                      reason: t.reason
                    }), h || !t.wasClean || a !== s.CONNECTION_CODES.NORMAL_CLOSURE) return e.error(t);
                  e.complete()
                }
              }, r.onopen = function() {
                y = 0, p.length && (o().each(p, r.send, r), p = []), v.onConnectionChange({
                  status: s.SOCKET_STATE.CONNECTED,
                  delay: 0
                })
              }, r.closeHard = function() {
                i(), r.readyState === WebSocket.CLOSED ? e.error({
                  force: !0
                }) : (r.close(), h = !0)
              }, d.push(r)
            }), e.error.bind(e))
          })).pipe(a.retryWhen((function(e) {
            return e.pipe(a.switchMap((function(e) {
              if (402 === e.status) throw new Error("Payment required");
              if (!u) {
                (y > 7 || e.force) && (y = 0);
                var t = (0, c.exponentialDelay)(y, {
                  with_jitter: !0
                });
                return y++, v.onConnectionChange({
                  status: s.SOCKET_STATE.CONNECTING,
                  delay: t,
                  reason: e.reason || "",
                  statusCode: e.code
                }), i.race(g, i.timer(t))
              }
              return i.from([])
            })))
          })), a.shareReplay())), {
            socket: n,
            send: function(e) {
              e = arguments.length > 1 && void 0 !== arguments[1] && !arguments[1] ? e : JSON.stringify(e), r && r.send && r.readyState === l ? r.send(e) : p.push(e)
            }
          });
        return window.addEventListener("online", _), {
          socket: b.socket,
          send: b.send,
          reconnect: _
        }
      }
      var _ = "../build/transpiled/components/base/sockets/socket2v";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
    },
    316348: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => d
      });
      var r = n(661533),
        o = n.n(r),
        i = n(629133),
        a = n.n(i),
        s = n(313981),
        c = n(509372),
        u = ["companies", "contacts", "leads", "customers"],
        l = ["leads", "contacts", "customers"];
      const d = new(s.default.extend({
        _state: null,
        $card: o()(),
        _classes: function() {
          return {
            active: "js-widgets-active",
            card: "content__card-holder-widgets",
            zindex: "with_overlay"
          }
        },
        _selectors: function() {
          return {
            top: ".card-widgets__top",
            body: "#nano-card-widgets",
            cap: ".js-card-widgets-cap",
            caption: ".card-widgets__widget__caption"
          }
        },
        events: {
          "click .js-widget-caption-block": "onWidgetCaptionClick"
        },
        document_events: {
          "widgets_body:change_state": "onWidgetsBodyChangeSize",
          openWidgetPanel: "onOpenWidgetPanel",
          "click #card_widgets_overlay": "closePanel"
        },
        _events_card: {
          "click .card-widgets__top": "onWidgetsBlockTopClick",
          "click .card-widgets__elements": "onWidgetsElementClick"
        },
        _getStateCode: function() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : APP.getBaseEntity();
          return "".concat(e, "_crd_wdgt")
        },
        resetStates: function() {
          this.setState(0), a().each(u, (function(e) {
            this.keepState(0, e)
          }), this)
        },
        keepState: function(e, t) {
          (this._isCard() || t) && (t = t || APP.getBaseEntity(), (0, c.set)({
            name: this._getStateCode(t),
            value: e
          }))
        },
        setState: function(e) {
          return this._state = e, this._state
        },
        getCurrentState: function() {
          return a().isNull(this._state) && (this.setState(parseInt((0, c.get)(this._getStateCode()) || 0)), APP.is_widgets_maximized && this.setState(1), APP.notSmall || 1 !== this._state || this.setState(0)), this._state
        },
        _isCard: function() {
          var e = APP.getWidgetsArea() || "";
          return e.indexOf("_card") > 0 && a().indexOf(u, e.replace("_card", "")) >= 0
        },
        destroy: function() {
          this.setState(null), this.undelegateEvents(), APP.data.is_card || this._checkRightColumnWidgets(!0), this.$card.removeClass(this._class("active")), this.$el.hide()
        },
        init: function() {
          var e = a().extend({}, this.events);
          "widgets_block" !== this.$el.attr("id") && (this.setElement(o()("#widgets_block")), this.$card = o()("#card_holder")), this._isCard() ? (a().extend(e, this._events_card), this._$document.on("widgets:card-maximized", a().bind(this.onWindowWidgetsResize, this)).on("widgets:card-minimized", a().bind(this.onWindowWidgetsResize, this)), this.$el.hasClass(this._class("active")) && a().delay(a().bind(this.toggleWidget, this, this.$(".card-widgets__widget:first"), !0), 500)) : this.$el.removeClass(this._class("active")), this.delegateEvents(e), this.checkBlockAction()
        },
        onWidgetsBodyChangeSize: function(e, t) {
          this.toggleWidget(t.$el, t.state)
        },
        onOpenWidgetPanel: function() {
          this.openPanel(null)
        },
        onWidgetsBlockTopClick: function(e) {
          var t = this.getCurrentState();
          !APP.is_widgets_maximized && this._isCard() && (t ? this.closePanel() : this.openPanel(), APP.notSmall && this.keepState(t ? 0 : 1), e.stopPropagation())
        },
        onWidgetsElementClick: function(e) {
          var t = o()(e.currentTarget),
            n = o()(e.target),
            r = t.closest(".card-widgets__widget");
          this.$card.hasClass(this._class("active")) || (r.length > 0 ? (this.openPanel(t.closest(".card-widgets__widget")), e.stopPropagation()) : n.closest(".js-operday-timer").length || this.openPanel())
        },
        onWindowWidgetsResize: function() {
          APP.notSmall ? (this.hideOverlay(), this.openPanel()) : (this.resetStates(), this.closePanel())
        },
        onWidgetCaptionClick: function(e) {
          var t, n;
          this.$el.hasClass(this._class("active")) && (n = "open", (t = o()(e.target).closest(".card-widgets__widget")).find(".card-widgets__widget__body").hasClass("js-body-hide") && (n = "close"), this["".concat(n, "Widget")](t), e.stopPropagation())
        },
        checkBlockAction: function() {
          this._checkRightColumnWidgets(), this._isCard() ? (1 === this.getCurrentState() ? this.$card.add(o()("#card_fake")).add(this.$el).addClass(this._class("active")) : this.$card.add(o()("#card_fake")).add(this.$el).removeClass(this._class("active")), this.$el.show(), this._findElem("top").show(), this._findElem("body").removeClass("in_list"), this._$document.trigger("widgets-in-card:show")) : (this.hideOverlay(), this.$el.hide())
        },
        _checkRightColumnWidgets: function(e) {
          var t = this.getCardWidgetsCount();
          APP.first_load || (parseInt(t) > 0 || e ? (this.$card.removeClass("js-widgets-hidden"), this.toggleCap(!1)) : (this.$card.addClass("js-widgets-hidden"), this.toggleCap(!0)))
        },
        getCardWidgetsCount: function() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : APP.getBaseEntity(),
            t = APP.widgets.system.displayed_count_by_area || {};
          return (t["".concat(e, "_card")] || 0) + (t.everywhere || 0)
        },
        toggleCap: function(e) {
          e ? (this.$el.removeClass("_with-scroll"), this._findElem("cap").removeClass("_with-widgets")) : (this.$el.addClass("_with-scroll"), this._findElem("cap").addClass("_with-widgets"))
        },
        toggleWidget: function(e, t) {
          t ? this.openWidget(e) : this.closeWidget(e)
        },
        openWidget: function(e) {
          e.find(".card-widgets__widget__caption__arrow").addClass("widgets__widget__caption__arrow_top").removeClass("widgets__widget__caption__arrow_bottom"), e.find(".card-widgets__widget__body").show().addClass("js-body-hide")
        },
        closeWidget: function(e) {
          e.find(".card-widgets__widget__caption__arrow").removeClass("widgets__widget__caption__arrow_top").addClass("widgets__widget__caption__arrow_bottom"), e.find(".card-widgets__widget__body").hide().removeClass("js-body-hide")
        },
        openPanel: function(e) {
          var t = this._findElem("caption");
          this.$card.addClass([this._class("card"), this._class("active")].join(" ")), this.$el.addClass(this._class("active")), t.find(".card-widgets__widget__caption__arrow, .card-widgets__widget__caption__logo").show(), e || (e = this.$el.find(".card-widgets__widget:first")), this.openWidget(e), t.find(".card-widgets__widget__caption__logo_min").hide(), this.setState(1), this.overlayStateTrigger(), this._$document.trigger("toggleWidgetPanel")
        },
        closePanel: function() {
          if (!a().includes(l, APP.getWidgetsArea())) {
            var e = this._findElem("caption");
            this.$el.removeClass([this._class("zindex"), this._class("active")].join(" ")), this.$card.removeClass(this._class("active")), e.find(".card-widgets__widget__caption__arrow, .card-widgets__widget__caption__logo").hide(), this.toggleWidget(this.$el.find(".card-widgets__widget"), !1), e.find(".card-widgets__widget__caption__logo_min").show(), this.setState(0), this.overlayStateTrigger(), this._$document.trigger("toggleWidgetPanel")
          }
        },
        overlayStateTrigger: function() {
          var e = this.getCurrentState();
          APP.notSmall || (e ? (this.$el.addClass(this._class("zindex")), this.showOverlay()) : (this.$el.removeClass(this._class("zindex")), this.hideOverlay()))
        },
        showOverlay: function() {
          var e = o()("#card_widgets_overlay");
          e.length || (e = o()('<div class="default-overlay" id="card_widgets_overlay" style="z-index:105"></div>'), this._$body.append(e)), e.trigger("overlay:show", {
            instantly: !0
          })
        },
        hideOverlay: function() {
          o()("#card_widgets_overlay").trigger("overlay:hide", {
            instantly: !0
          })
        }
      }, {
        el: o()("#widgets_block")
      }));
      var f = "../build/transpiled/components/widgets/block_actions";
      window.define(f, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([f])
    },
    12615: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => h
      });
      var r = n(661533),
        o = n.n(r),
        i = n(629133),
        a = n.n(i),
        s = n(910),
        c = n(168807),
        u = n(11024),
        l = APP.constant("version"),
        d = APP.constant("version_backend"),
        f = a().propertyOf(window)(["performance", "timing", "responseEnd"]) || 0,
        p = null;

      function _(e, t) {
        var n = Date.now() - f,
          r = o().Deferred();
        return n < (t = a().isNumber(t) ? t : 6e4) ? e().then(r.resolve, r.reject) : (f = Date.now(), p || (p = o().ajax({
          url: "/private/ping.php"
        }).always((function() {
          p = null
        }))), p.done((function() {
          e().then(r.resolve, r.reject)
        })).fail(r.reject)), r.promise()
      }
      "production" === APP.environment && o()(document).ajaxComplete((function(e, t, n) {
        var r = APP.constant("server"),
          i = t.getResponseHeader("X-Core-Version"),
          f = t.getResponseHeader("X-Core-Server"),
          p = t.getResponseHeader("X-Core-Version-Backend"),
          _ = t.getResponseHeader("X-Generation-Time"),
          h = t.getResponseHeader("X-Generation-Time-System"),
          y = t.getResponseHeader("X-Core-Session-Token"),
          m = t.getResponseHeader("X-Core-Widgets-Cache-Version"),
          g = {},
          v = 0,
          b = t === APP.page_xhr,
          w = (0, s.getCallingStatus)(),
          S = a().isNull(i) || l === i,
          E = a().isNull(p) || d === p;
        f && f !== r && APP.constant("server", f), y && y !== APP.constant("session_token") && APP.constant("session_token", y), (_ || h) && (v = _ || h, o()(document).find(".generation-time").append("<br>".concat(v, " - ").concat(n.url))), S && E || w || (E && b || !E) && (window.location.href = document.URL), a().isEmpty(m) || (g[APP.getWidgetsArea()] = m, a().extend(APP.constant("widgets_cache_version"), g), c.storeWithExpiration.remove(u.default.getCacheCode()))
      }));
      const h = {
        check: function() {
          var e = o().Deferred();
          return e.resolve(), _(e.promise, 0)
        },
        checkAuth: _
      };
      var y = "../build/transpiled/core/updater";
      window.define(y, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([y])
    },
    530657: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => w
      });
      var r = n(629133),
        o = n.n(r),
        i = n(661533),
        a = n.n(i),
        s = n(130860),
        c = n.n(s),
        u = n(334254),
        l = n.n(u),
        d = n(306843),
        f = n(226218),
        p = n(909599),
        _ = {
          token: "283c2980-b2ea-49fb-a03d-0125a8e35450",
          common_tags: ["core"]
        },
        h = Number((0, p.getServerTime)()) * p.SECOND,
        y = [],
        m = function() {
          var e, t = performance.now();
          return e = h ? new Date(h + t) : null, {
            lifetime: "".concat((t / p.SECOND).toFixed(1), "s"),
            lastVisibilityChangeAt: e,
            serverTime: (0, p.getServerTime)(),
            isVisible: (0, f.isTabVisible)()
          }
        };
      y.push(m()), l().change((function() {
        y.push(m())
      }));
      var g = {
          meta: {
            account_id: APP.constant("account").id,
            user_id: APP.constant("user").id,
            top_level_domain: APP.constant("account").top_level_domain,
            account_language: APP.constant("account").language,
            country: APP.constant("geoip_country") || "",
            user_language: APP.lang_id,
            browser: {
              name: d.default.browser,
              version: String(d.default.version),
              tab: {
                id: c().v4(),
                lastTimeReload: h ? new Date(h) : null
              }
            },
            os: d.default.os
          }
        },
        v = function() {
          var e = JSON.parse(JSON.stringify(g)),
            t = e.meta.browser,
            n = m(),
            r = n.lifetime,
            i = n.serverTime,
            a = n.isVisible;
          return t.tab = o().extend({}, t.tab, {
            lifetime: r,
            isVisible: a,
            serverTime: i,
            activity: y
          }), e
        },
        b = function(e, t) {
          return a().ajaxPromisify({
            url: "https://logs-01.loggly.com/inputs/".concat(_.token),
            headers: {
              "X-LOGGLY-TAG": t.join(",")
            },
            data: JSON.stringify(e),
            type: "POST",
            contentType: "application/json"
          })
        };

      function w(e) {
        var t = _.common_tags.concat(e.tags || []);
        return function(e, n) {
          var r = v(),
            i = e ? {
              additional_info: e
            } : {},
            a = o().extend({}, r, i, {
              referer: window.location.href
            }),
            s = t.concat(n || []);
          b(a, s)
        }
      }
      var S = "../build/transpiled/dev/loggly";
      window.define(S, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([S])
    },
    972492: (e, t, n) => {
      n.r(t), n.d(t, {
        DEFAULT_METRIC_DATA: () => r
      });
      var r = {
        country: APP.constant("geoip_country") || "",
        userId: APP.constant("user").id,
        accountId: APP.constant("account").id
      }
    },
    335745: (e, t, n) => {
      n.r(t), n.d(t, {
        getBackendPerformanceMetric: () => r.getBackendPerformanceMetric,
        getRealCardPageType: () => r.getRealCardPageType,
        getResourcesStats: () => r.getResourcesStats,
        logBrowser: () => o.logBrowser,
        logError: () => i.logError,
        logPerformanceMetric: () => r.logPerformanceMetric,
        setupPerformanceMetrics: () => r.setupPerformanceMetrics,
        unregisterPerformanceMetrics: () => r.unregisterPerformanceMetrics
      });
      var r = n(403563),
        o = n(640941),
        i = n(849101),
        a = "../build/transpiled/dev/meter";
      window.define(a, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([a])
    },
    640941: (e, t, n) => {
      n.r(t), n.d(t, {
        logBrowser: () => r.logBrowser
      });
      var r = n(210812)
    },
    210812: (e, t, n) => {
      n.r(t), n.d(t, {
        logBrowser: () => h
      });
      var r = n(955026),
        o = n(168807),
        i = n(909599),
        a = n(606836),
        s = n(972492),
        c = n(661533);

      function u(e, t, n, r, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, o)
      }

      function l(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function d(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            r = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), r.forEach((function(t) {
            l(e, t, n[t])
          }))
        }
        return e
      }
      var f, p, _ = "browser_log_v1",
        h = (f = function() {
          var e;
          return function(e, t) {
            var n, r, o, i, a = {
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
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; a;) try {
                    if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                    switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
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
                        a.label++, r = i[1], i = [0];
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
                    i = [6, e], r = 0
                  } finally {
                    n = o = 0
                  }
                  if (5 & i[0]) throw i[1];
                  return {
                    value: i[0] ? i[1] : void 0,
                    done: !0
                  }
                }([i, s])
              }
            }
          }(this, (function(t) {
            switch (t.label) {
              case 0:
                return o.storeWithExpiration.get(_) || (0, r.isDev)() ? [2] : (e = "/api/v1/metric/browser", [4, c.ajax({
                  url: (0, a.getEndpoint)(e),
                  type: "POST",
                  data: JSON.stringify({
                    url: e,
                    body: (n = d({}, s.DEFAULT_METRIC_DATA), u = {
                      screenWidth: window.screen.width,
                      screenHeight: window.screen.height,
                      clientWidth: document.documentElement.clientWidth,
                      clientHeight: document.documentElement.clientHeight
                    }, u = null != u ? u : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(u)) : function(e, t) {
                      var n = Object.keys(e);
                      if (Object.getOwnPropertySymbols) {
                        var r = Object.getOwnPropertySymbols(e);
                        n.push.apply(n, r)
                      }
                      return n
                    }(Object(u)).forEach((function(e) {
                      Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(u, e))
                    })), n)
                  }),
                  contentType: "application/json"
                })]);
              case 1:
                return t.sent(), o.storeWithExpiration.set(_, !0, 2 * i.WEEK), [2]
            }
            var n, u
          }))
        }, p = function() {
          var e = this,
            t = arguments;
          return new Promise((function(n, r) {
            var o = f.apply(e, t);

            function i(e) {
              u(o, n, r, i, a, "next", e)
            }

            function a(e) {
              u(o, n, r, i, a, "throw", e)
            }
            i(void 0)
          }))
        }, function() {
          return p.apply(this, arguments)
        })
    },
    849101: (e, t, n) => {
      n.r(t), n.d(t, {
        logError: () => r.logError
      });
      var r = n(898091)
    },
    898091: (e, t, n) => {
      n.r(t), n.d(t, {
        logError: () => c
      });
      var r = n(629133),
        o = n.n(r),
        i = n(530657),
        a = n(955026),
        s = n(378548),
        c = function(e) {
          if (!o().isEmpty(e))
            if ((0, a.isDev)()) console.error("Error log", e);
            else {
              var t, n = o().reduce(e, (function(e, t) {
                  var n = t.tags,
                    r = t.content;
                  return (0, s.append)({
                    targetArray: e.errorTags,
                    itemsToAppend: n
                  }), e.errorContents = r, e
                }), {
                  errorTags: [],
                  errorContents: {}
                }),
                r = n.errorTags,
                c = n.errorContents;
              (t = r, (0, i.default)({
                tags: t
              }))(c)
            }
        }
    },
    403563: (e, t, n) => {
      n.r(t), n.d(t, {
        getBackendPerformanceMetric: () => i.getBackendPerformanceMetric,
        getRealCardPageType: () => r.getRealCardPageType,
        getResourcesStats: () => o.getResourcesStats,
        logPerformanceMetric: () => a.logPerformanceMetric,
        setupPerformanceMetrics: () => a.setupPerformanceMetrics,
        unregisterPerformanceMetrics: () => a.unregisterPerformanceMetrics
      });
      var r = n(806667),
        o = n(366169),
        i = n(863328),
        a = n(292888)
    },
    292888: (e, t, n) => {
      n.r(t), n.d(t, {
        logPerformanceMetric: () => A,
        setupPerformanceMetrics: () => N,
        unregisterPerformanceMetrics: () => D
      });
      var r = n(661533),
        o = n.n(r),
        i = n(629133),
        a = n.n(i),
        s = n(334254),
        c = n.n(s),
        u = n(156040),
        l = n(955026),
        d = n(606836),
        f = n(972492),
        p = n(289815),
        _ = n(366169),
        h = n(219415),
        y = n(355736);

      function m(e, t, n, r, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, o)
      }

      function g(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var v = {},
        b = {},
        w = function(e) {
          var t;
          APP.metrics.remove(e);
          var n = null === (t = v[e]) || void 0 === t ? void 0 : t.onClear;
          delete v[e], null == n || n()
        },
        S = c().hidden(),
        E = function() {
          return S || APP.metrics.wasPageInactiveDuringPageLoad
        };
      c().change((function() {
        c().hidden() && a().each(v, (function(e, t) {
          w(t)
        })), S = S || c().hidden()
      })), APP.metrics.stopTrackingPageVisibility(15e3);
      var O, T, P = (O = function(e) {
          var t, n, r, i, s, c, u, _, m;
          return function(e, t) {
            var n, r, o, i, a = {
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
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; a;) try {
                    if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                    switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
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
                        a.label++, r = i[1], i = [0];
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
                    i = [6, e], r = 0
                  } finally {
                    n = o = 0
                  }
                  if (5 & i[0]) throw i[1];
                  return {
                    value: i[0] ? i[1] : void 0,
                    done: !0
                  }
                }([i, s])
              }
            }
          }(this, (function(S) {
            switch (S.label) {
              case 0:
                if (t = e.type, n = e.params, r = e.resourceStats, i = v[t], s = APP.metrics.get(t), !i || a().isEmpty(s)) return [2];
                if (i.isPageActivityDependant && E() || b[t]) return [2];
                c = i.metrics.reduce((function(e, t) {
                  return t in s && (e[t] = s[t]), e
                }), {}), O = function(e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {},
                      r = Object.keys(n);
                    "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                      return Object.getOwnPropertyDescriptor(n, e).enumerable
                    })))), r.forEach((function(t) {
                      g(e, t, n[t])
                    }))
                  }
                  return e
                }({}, f.DEFAULT_METRIC_DATA, c, n), T = null != (T = {
                  referrer: location.href,
                  type: t,
                  resourceStats: r,
                  experimentId: (0, p.getExperimentId)(),
                  staticDomain: APP.static_build_domain || window.location.origin.split(".").slice(-2).join("."),
                  navigationStats: (0, y.getNavigationStats)(),
                  constantStats: (0, h.getConstantStats)()
                }) ? T : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(O, Object.getOwnPropertyDescriptors(T)) : function(e, t) {
                  var n = Object.keys(e);
                  if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    n.push.apply(n, r)
                  }
                  return n
                }(Object(T)).forEach((function(e) {
                  Object.defineProperty(O, e, Object.getOwnPropertyDescriptor(T, e))
                })), u = O, S.label = 1;
              case 1:
                return S.trys.push([1, , 5, 6]), b[t] = !0, _ = "/api/v2/metric/".concat(t.toLowerCase(), "/add"), m = {
                  url: _,
                  body: u
                }, (0, l.isDev)() ? (console.warn("JSperf metric", m), [3, 4]) : [3, 2];
              case 2:
                return [4, o().ajax({
                  url: (0, d.getEndpoint)(_),
                  data: JSON.stringify(m),
                  type: "POST",
                  contentType: "application/json"
                })];
              case 3:
                S.sent(), S.label = 4;
              case 4:
                return [3, 6];
              case 5:
                return w(t), b[t] = !1, [7];
              case 6:
                return [2]
            }
            var O, T
          }))
        }, T = function() {
          var e = this,
            t = arguments;
          return new Promise((function(n, r) {
            var o = O.apply(e, t);

            function i(e) {
              m(o, n, r, i, a, "next", e)
            }

            function a(e) {
              m(o, n, r, i, a, "throw", e)
            }
            i(void 0)
          }))
        }, function(e) {
          return T.apply(this, arguments)
        }),
        C = function(e) {
          var t, n = e.type,
            r = e.resourceName,
            o = void 0 === r ? "" : r,
            i = e.params,
            a = APP.metrics.get(n),
            s = null === (t = v[n]) || void 0 === t ? void 0 : t.metrics;
          if (s && s.every((function(e) {
              return e in a
            }))) {
            var c = (0, _.getResourcesStats)({
              resourceName: o
            });
            if (!c.css.internal.uncachedCount && !c.js.internal.uncachedCount) return void w(n);
            (0, u.onPageFullyLoaded)((function() {
              return P({
                type: n,
                params: i,
                resourceStats: c
              })
            }))
          }
        },
        A = function(e) {
          var t = e.type,
            n = e.name,
            r = e.value,
            o = e.resourceName,
            i = void 0 === o ? "" : o,
            s = e.params,
            c = void 0 === s ? {} : s,
            u = e.isSync,
            l = function() {
              if (v[t]) {
                var e = a().isUndefined(r) ? Math.ceil(APP.metrics.getTimeFromStart()) : r;
                APP.metrics.set({
                  type: t,
                  name: n,
                  value: e
                }), v[t].onMetricCollect(n), u || C({
                  type: t,
                  resourceName: i,
                  params: c
                })
              }
            };
          u ? l() : setTimeout(l)
        },
        N = function(e) {
          var t, n, r = e.type,
            o = e.metrics,
            i = e.isPageActivityDependant,
            s = void 0 === i || i,
            c = e.onMetricCollect,
            u = void 0 === c ? a().noop : c,
            l = e.onClear,
            d = void 0 === l ? a().noop : l;
          return !(s && E() || (v[r] = {
            metrics: o,
            isPageActivityDependant: s,
            onMetricCollect: u,
            onClear: d
          }, (t = APP.constant("metrics"))[n = r] || (t[n] = {}), APP.metrics.get(r) && C({
            type: r
          }), 0))
        },
        D = function(e) {
          w(e)
        }
    },
    639615: (e, t, n) => {
      var r;
      n.r(t), n.d(t, {
          TrackedMetricType: () => r
        }),
        function(e) {
          e.CARD = "CARD", e.INBOX_DIALOGS = "INBOX_DIALOGS", e.INBOX_WITH_CARD = "INBOX_WITH_CARD", e.INBOX_WITH_CARD_NO_SELECTED = "INBOX_WITH_CARD_NO_SELECTED", e.DP = "DP", e.SALESBOT = "SALESBOT", e.SALESBOT_FPS = "SALESBOT_FPS", e.DASHBOARD_WITH_INDEXED_DB = "DASHBOARD_WITH_INDEXED_DB", e.DASHBOARD_WITHOUT_INDEXED_DB = "DASHBOARD_WITHOUT_INDEXED_DB"
        }(r || (r = {}))
    },
    214896: (e, t, n) => {
      function r(e, t, n) {
        return r = u() ? Reflect.construct : function(e, t, n) {
          var r = [null];
          r.push.apply(r, t);
          var o = new(Function.bind.apply(e, r));
          return n && s(o, n.prototype), o
        }, r.apply(null, arguments)
      }

      function o(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function i(e) {
        return i = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, i(e)
      }

      function a(e, t) {
        return null != t && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? !!t[Symbol.hasInstance](e) : e instanceof t
      }

      function s(e, t) {
        return s = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, s(e, t)
      }

      function c(e) {
        var t = "function" == typeof Map ? new Map : void 0;
        return c = function(e) {
          if (null === e || (n = e, -1 === Function.toString.call(n).indexOf("[native code]"))) return e;
          var n;
          if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
          if (void 0 !== t) {
            if (t.has(e)) return t.get(e);
            t.set(e, o)
          }

          function o() {
            return r(e, arguments, i(this).constructor)
          }
          return o.prototype = Object.create(e.prototype, {
            constructor: {
              value: o,
              enumerable: !1,
              writable: !0,
              configurable: !0
            }
          }), s(o, e)
        }, c(e)
      }

      function u() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
        } catch (e) {
          return !1
        }
      }
      n.r(t), n.d(t, {
        getBackendPerformanceMetric: () => d
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
            }), t && s(e, t)
          }(o, e);
          var t, n, r = (t = o, n = u(), function() {
            var e, r = i(t);
            if (n) {
              var o = i(this).constructor;
              e = Reflect.construct(r, arguments, o)
            } else e = r.apply(this, arguments);
            return function(e, t) {
              return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
              }(e) : t;
              var n
            }(this, e)
          });

          function o() {
            return function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, o), r.apply(this, arguments)
          }
          return o
        }(c(Error)),
        d = function(e) {
          var t, n, r = e.request,
            i = e.url;
          try {
            var s = function(e) {
              var t = performance.getEntriesByName(e);
              if (t.length > 1) throw new l;
              var n = t[0];
              return a(n, PerformanceResourceTiming) ? {
                nextHopProtocol: n.nextHopProtocol,
                startTime: n.startTime,
                duration: n.duration,
                fetchStart: n.fetchStart,
                domainLookupStart: n.domainLookupStart,
                domainLookupEnd: n.domainLookupEnd,
                connectStart: n.connectStart,
                secureConnectionStart: n.secureConnectionStart,
                connectEnd: n.connectEnd,
                requestStart: n.requestStart,
                responseStart: n.responseStart,
                responseEnd: n.responseEnd,
                transferSize: n.transferSize,
                encodedBodySize: n.encodedBodySize,
                decodedBodySize: n.decodedBodySize
              } : null
            }(i);
            if (r) {
              var c = r.getResponseHeader("x-runtime-generated"),
                u = c ? Math.ceil(1e3 * parseFloat(c)) : null;
              return t = function(e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = null != arguments[t] ? arguments[t] : {},
                    r = Object.keys(n);
                  "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                    return Object.getOwnPropertyDescriptor(n, e).enumerable
                  })))), r.forEach((function(t) {
                    o(e, t, n[t])
                  }))
                }
                return e
              }({}, s), n = null != (n = {
                runtimeGenerated: u
              }) ? n : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : function(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                  var r = Object.getOwnPropertySymbols(e);
                  n.push.apply(n, r)
                }
                return n
              }(Object(n)).forEach((function(e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
              })), t
            }
            return s
          } catch (e) {
            return a(e, l) ? "duplicated-metric-error" : "undefined-error"
          }
        }
    },
    614764: (e, t, n) => {
      n.r(t)
    },
    863328: (e, t, n) => {
      n.r(t), n.d(t, {
        BackendPerformanceMetric: () => o.BackendPerformanceMetric,
        getBackendPerformanceMetric: () => r.getBackendPerformanceMetric
      });
      var r = n(214896),
        o = n(614764)
    },
    111342: (e, t, n) => {
      n.r(t), n.d(t, {
        getConstantStats: () => u
      });
      var r = n(629133),
        o = n.n(r),
        i = n(500034),
        a = n(863328);

      function s(e, t, n, r, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, o)
      }
      var c = "".concat(window.location.origin, "/frontend/constants/"),
        u = function() {
          if ((0, i.isFeatureAvailable)(i.Features.ASYNC_CONSTANTS)) {
            var e, t, n = performance.getEntriesByType("resource"),
              r = {};
            return n.forEach((e = function(e) {
              var t;
              return function(e, t) {
                var n, r, o, i, a = {
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
                      if (n) throw new TypeError("Generator is already executing.");
                      for (; a;) try {
                        if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                        switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
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
                            a.label++, r = i[1], i = [0];
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
                        i = [6, e], r = 0
                      } finally {
                        n = o = 0
                      }
                      if (5 & i[0]) throw i[1];
                      return {
                        value: i[0] ? i[1] : void 0,
                        done: !0
                      }
                    }([i, s])
                  }
                }
              }(this, (function(n) {
                return o = e, (null != (i = PerformanceResourceTiming) && "undefined" != typeof Symbol && i[Symbol.hasInstance] ? i[Symbol.hasInstance](o) : o instanceof i) && e.name.includes(c) ? (t = e.name.replace(c, "").replace(/\//g, ""), r[t] = (0, a.getBackendPerformanceMetric)({
                  url: e.name
                }), [2]) : [2];
                var o, i
              }))
            }, t = function() {
              var t = this,
                n = arguments;
              return new Promise((function(r, o) {
                var i = e.apply(t, n);

                function a(e) {
                  s(i, r, o, a, c, "next", e)
                }

                function c(e) {
                  s(i, r, o, a, c, "throw", e)
                }
                a(void 0)
              }))
            }, function(e) {
              return t.apply(this, arguments)
            })), o().isEmpty(r) ? void 0 : r
          }
        }
    },
    219415: (e, t, n) => {
      n.r(t), n.d(t, {
        getConstantStats: () => r.getConstantStats
      });
      var r = n(111342)
    },
    455820: (e, t, n) => {
      n.r(t), n.d(t, {
        getExperimentId: () => o
      });
      var r = n(500034),
        o = function() {
          if (!0 === (0, r.isFeatureAvailable)(r.Features.ASYNC_CONSTANTS)) return "prod_".concat(r.Features.ASYNC_CONSTANTS, "_v1")
        }
    },
    289815: (e, t, n) => {
      n.r(t), n.d(t, {
        getExperimentId: () => r.getExperimentId
      });
      var r = n(455820)
    },
    146043: (e, t, n) => {
      function r(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }
      n.r(t), n.d(t, {
        getNavigationStats: () => o
      });
      var o = function() {
        var e, t, n, o, i = (n = performance.getEntriesByType("navigation"), o = 1, function(e) {
          if (Array.isArray(e)) return e
        }(n) || function(e, t) {
          var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != n) {
            var r, o, i = [],
              a = !0,
              s = !1;
            try {
              for (n = n.call(e); !(a = (r = n.next()).done) && (i.push(r.value), !t || i.length !== t); a = !0);
            } catch (e) {
              s = !0, o = e
            } finally {
              try {
                a || null == n.return || n.return()
              } finally {
                if (s) throw o
              }
            }
            return i
          }
        }(n, o) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return r(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? r(e, t) : void 0
          }
        }(n, o) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }())[0];
        return e = i, (null != (t = PerformanceNavigationTiming) && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? t[Symbol.hasInstance](e) : e instanceof t) ? {
          nextHopProtocol: i.nextHopProtocol,
          startTime: i.startTime,
          duration: i.duration,
          fetchStart: i.fetchStart,
          domainLookupStart: i.domainLookupStart,
          domainLookupEnd: i.domainLookupEnd,
          connectStart: i.connectStart,
          secureConnectionStart: i.secureConnectionStart,
          connectEnd: i.connectEnd,
          requestStart: i.requestStart,
          responseStart: i.responseStart,
          responseEnd: i.responseEnd,
          transferSize: i.transferSize,
          encodedBodySize: i.encodedBodySize,
          decodedBodySize: i.decodedBodySize
        } : null
      }
    },
    355736: (e, t, n) => {
      n.r(t), n.d(t, {
        getNavigationStats: () => r.getNavigationStats
      });
      var r = n(146043)
    },
    956222: (e, t, n) => {
      n.r(t), n.d(t, {
        getRealCardPageType: () => o
      });
      var r = n(639615),
        o = function() {
          var e = window.location.pathname.split("/")[1],
            t = APP.getBaseEntity();
          return APP.constant("metrics").INBOX_WITH_CARD_NO_SELECTED ? r.TrackedMetricType.INBOX_WITH_CARD_NO_SELECTED : "chats" === e || "imbox" === e ? "chats" === t ? r.TrackedMetricType.INBOX_DIALOGS : r.TrackedMetricType.INBOX_WITH_CARD : r.TrackedMetricType.CARD
        }
    },
    806667: (e, t, n) => {
      n.r(t), n.d(t, {
        getRealCardPageType: () => r.getRealCardPageType
      });
      var r = n(956222)
    },
    420415: (e, t, n) => {
      n.r(t), n.d(t, {
        getResourcesStats: () => c
      });
      var r = n(137233),
        o = ["script", "link"],
        i = function(e) {
          return e ? {
            name: e.name,
            duration: e.duration,
            transferSize: e.transferSize,
            encodedBodySize: e.encodedBodySize,
            decodedBodySize: e.decodedBodySize
          } : {
            name: "",
            duration: 0,
            transferSize: 0,
            encodedBodySize: 0,
            decodedBodySize: 0
          }
        },
        a = function() {
          return {
            firstAt: 0,
            max: i(),
            minUncached: null,
            count: 0,
            uncachedCount: 0,
            transferSize: {
              sum: 0,
              max: 0,
              min: null
            },
            encodedBodySize: {
              sum: 0,
              max: 0,
              min: null
            },
            decodedBodySize: {
              sum: 0,
              max: 0,
              min: null
            }
          }
        },
        s = function() {
          return {
            internal: a(),
            external: a()
          }
        },
        c = function(e) {
          var t = e.resourceName,
            n = void 0 === t ? "" : t,
            a = e.resourceIndexStart,
            c = void 0 === a ? 0 : a,
            u = performance.getEntriesByType("resource").slice(c),
            l = {
              stats: {
                js: s(),
                css: s()
              }
            };
          return u.reduce((function(e, t) {
            if (a = t, !(null != (s = PerformanceResourceTiming) && "undefined" != typeof Symbol && s[Symbol.hasInstance] ? s[Symbol.hasInstance](a) : a instanceof s)) return e;
            var a, s, c = t.initiatorType;
            if (!o.includes(c)) return e;
            var u = t.name,
              l = (0, r.getFileExtension)(u.split("?")[0]).slice(1);
            if ("css" !== l && "js" !== l || !u.includes(n)) return e;
            var d, f = u.includes(APP.static_build_path) ? "internal" : "external",
              p = e.stats[l][f];
            return p.count++, ("deliveryType" in (d = t) ? "cache" === d.deliveryType : "transferSize" in d ? !d.transferSize : d.duration < 25) || (p.uncachedCount++, (!p.minUncached || p.minUncached.duration > t.duration) && (p.minUncached = i(t))), p.firstAt || (p.firstAt = t.startTime), p.max.duration < t.duration && (p.max = i(t)), ["transferSize", "encodedBodySize", "decodedBodySize"].forEach((function(e) {
              var n = p[e];
              n.sum += t[e], n.max = Math.max(t[e], n.max), n.min = null === n.min ? t[e] : Math.min(t[e], n.min)
            })), e
          }), l).stats
        }
    },
    366169: (e, t, n) => {
      n.r(t), n.d(t, {
        ResourceStats: () => r.ResourceStats,
        getResourcesStats: () => r.getResourcesStats
      });
      var r = n(420415)
    },
    102431: (e, t, n) => {
      n.r(t), n.d(t, {
        getEndpoint: () => a
      });
      var r = n(629133),
        o = n.n(r)().last(location.origin.split("."), 2)[0],
        i = "https://jsperf.".concat(o, ".com"),
        a = function(e) {
          return "".concat(i, "?url=").concat(e)
        }
    },
    606836: (e, t, n) => {
      n.r(t), n.d(t, {
        getEndpoint: () => r.getEndpoint
      });
      var r = n(102431)
    },
    271311: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => v
      });
      var r, o = n(629133),
        i = n.n(o),
        a = n(987081),
        s = n(128508),
        c = n(334254),
        u = n.n(c),
        l = n(49091),
        d = n(474564),
        f = n(111073),
        p = n(661533),
        _ = APP.constant("account") || {},
        h = new a.Subject,
        y = [],
        m = [],
        g = !1;
      const v = function() {
        var e, t;
        if (!_.amojo_enabled) return {
          subscribe: i().noop,
          unsubscribe: i().noop,
          socket: a.empty()
        };

        function n() {
          return r.send("ping", !1), setInterval((function() {
            r.send("ping", !1)
          }), 25e3)
        }
        return (r = (0, f.default)(null, {
          connect: function() {
            var o;
            return r.send({
              action: "SET_LANG",
              data: {
                lang: APP.lang_id
              }
            }), o = !0, clearInterval(e), u().unbind(t), "visible" === u().state() && o && (e = n()), t = u().change((function() {
              u().hidden() ? clearInterval(e) : o && (clearInterval(e), e = n())
            })), p(window).on("online", (function() {
              clearInterval(e), o = !0
            })), p(window).on("offline", (function() {
              clearInterval(e), o = !1
            })), y.length && i().each(i().chunk(y, 5), (function(e) {
              r.send({
                action: "CHAT_ENTER",
                data: e
              })
            })), (0, d.rtmStart)().pipe(s.map((function(e) {
              var t, n, r;
              return _.is_need_proxy ? ((t = document.createElement("a")).href = e.url, (n = t.host.split("."))[0] += "-ua", t.host = n.join("."), r = t.href) : r = e.url, {
                url: r
              }
            })))
          },
          onConnectionChange: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              t = e.status;
            g ? i().each(m, (function(t) {
              return t(e)
            })) : t === l.SOCKET_STATE.CONNECTED && (g = !0)
          }
        })).socket.subscribe(h), i().extend(r, {
          subscribe: function(e) {
            e = i().filter(i().isArray(e) ? e : [e], (function(e) {
              return !i().findWhere(y, {
                chat_id: e.chat_id
              }) && (y.push(e), !0)
            })), i().each(e, (function(e) {
              r.send({
                action: "CHAT_ENTER",
                data: [e]
              })
            }))
          },
          unsubscribe: function(e) {
            e = i().filter(i().isArray(e) ? e : [e], (function(e) {
              return !!i().findWhere(y, {
                chat_id: e.chat_id
              })
            })), y = i().filter(y, (function(t) {
              return !i().findWhere(e, {
                chat_id: t.chat_id
              })
            })), i().each(e, (function(e) {
              r.send({
                action: "CHAT_LEAVE",
                data: [e]
              })
            }))
          },
          socket: h,
          onConnectionChange: function(e) {
            return m.push(e),
              function() {
                m = i().without(m, e)
              }
          }
        })
      }();
      var b = "../build/transpiled/interface/amojo/rtm";
      window.define(b, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([b])
    },
    11024: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => u
      });
      var r = n(629133),
        o = n.n(r),
        i = n(661586),
        a = n.n(i),
        s = n(926168),
        c = n(859200);
      const u = {
        getCacheCode: function() {
          var e = "".concat((0, s.getVersion)(), "_linked_types_cache_").concat(APP.lang_id, "_").concat((0, c.userID)()),
            t = (0, c.getRights)("catalog_rights") || {},
            n = o().map(t, (function(e, t) {
              var n = +(e.view !== c.RIGHTS_DENIED);
              return "".concat(t, ":").concat(n)
            }));
          return n.length && (e += "_".concat(a()(n.join("_")))), e
        },
        linked_types_cache_lifetime: 36e5
      };
      var l = "../build/transpiled/interface/card/linked/constants";
      window.define(l, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([l])
    },
    397927: (e, t, n) => {
      n.r(t), n.d(t, {
        BUTTON_LIKE_ITEMS_IDS: () => d,
        CounterId: () => l,
        KnownNavigationItemIdV1: () => r,
        KnownNavigationItemIdV2: () => o,
        addItem: () => b,
        removeItem: () => w,
        setActiveItemId: () => m,
        setTelephonyState: () => v,
        updateItemCounter: () => g
      });
      var r, o, i = n(500034);

      function a(e, t, n, r, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, o)
      }

      function s(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, o) {
            var i = e.apply(t, n);

            function s(e) {
              a(i, r, o, s, c, "next", e)
            }

            function c(e) {
              a(i, r, o, s, c, "throw", e)
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

      function u(e, t) {
        var n, r, o, i, a = {
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
              if (n) throw new TypeError("Generator is already executing.");
              for (; a;) try {
                if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
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
                    a.label++, r = i[1], i = [0];
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
                i = [6, e], r = 0
              } finally {
                n = o = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, s])
          }
        }
      }! function(e) {
        e.CHATS = "chats", e.MAIL = "mail", e.TODO = "todo"
      }(r || (r = {})),
      function(e) {
        e.CHATS_INBOX = "chats", e.EMAIL_INBOX = "mail", e.EMAIL_RECEIVED = "email_received", e.TEAM_INBOX = "team_inbox", e.NOTIFICATIONS = "notifications", e.TASKS = "tasks", e.SETTINGS = "settings", e.FEEDBACK = "feedback", e.LEADS = "leads", e.CUSTOMERS = "customers", e.CHATS = "communications", e.CATALOGS = "catalogs", e.AI_AUTOMATION = "ai-automation", e.STATS = "stats", e.HELP = "help-center", e.WHATSAPP = "whatsapp", e.SETTINGS_WORKSPACE = "settings_workspace", e.SETTINGS_BILLING = "settings_billing", e.SETTINGS_NOTIFICATIONS = "settings_notifications", e.CONTACT_SUPPORT = "contact_support", e.AI_COPILOT = "ai_copilot", e.HELP_CENTER = "help_center", e.ADMINISTRATION = "support", e.DASHBOARD = "dashboard", e.ALL_LEADS = "all_leads", e.BROADCASTING = "broadcasting", e.TEMPLATES = "templates", e.CHAT_TEMPLATES = "chat_templates", e.WHATSAPP_FEATURES = "whatsapp_features", e.WHATSAPP_BROADCASTING = "whatsapp_broadcasting", e.WHATSAPP_AI_AGENT = "whatsapp_ai-agent", e.WHATSAPP_TEMPLATES = "whatsapp_templates", e.WHATSAPP_BOTS = "whatsapp_bots", e.CONTACTS_ALL = "catalogs_contacts_and_companies", e.CONTACTS = "catalogs_contacts", e.COMPANIES = "catalogs_companies", e.FILES = "catalogs_files", e.EMAIL_SENT = "email_sent", e.EMAIL_DELETED = "email_deleted", e.EMAIL_TEMPLATES = "email_templates", e.SETTINGS_EMAIL = "settings_email", e.REPORT_BY_ACTIVITIES = "report_by_activities", e.CONSOLIDATED_REPORT = "consolidated_report", e.GOAL_REPORT = "goal_report", e.CALL_REPORT = "call_report", e.ACTIVITY_LOG = "activity_log", e.REPORT_BY_CUSTOMERS = "report_by_customers", e.BOTS = "bots", e.ARCHIVED_PIPELINES = "archived_pipelines"
      }(o || (o = {}));
      var l, d = new Set(["notifications", "ai_copilot", "help-center", "contact_support"]);
      ! function(e) {
        e.MAIL = "mail", e.TODO = "todo", e.CHATS = "chats", e.NOTIFICATIONS = "notifications", e.CHATS_INBOX = "chats", e.TEAM_INBOX = "team_inbox"
      }(l || (l = {}));
      var f, p, _ = (f = s((function() {
          return u(this, (function(e) {
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
            return u(this, (function(e) {
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
        y = (c(p = {}, "mail", "mail"), c(p, "todo", "tasks"), p),
        m = function() {
          var e = s((function(e, t) {
            return u(this, (function(n) {
              switch (n.label) {
                case 0:
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? [4, _()] : [2];
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
            return u(this, (function(n) {
              switch (n.label) {
                case 0:
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? (t = "id" in e && y[e.id] ? (r = function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                      var n = null != arguments[t] ? arguments[t] : {},
                        r = Object.keys(n);
                      "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                        return Object.getOwnPropertyDescriptor(n, e).enumerable
                      })))), r.forEach((function(t) {
                        c(e, t, n[t])
                      }))
                    }
                    return e
                  }({}, e), o = null != (o = {
                    id: y[e.id]
                  }) ? o : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(o)) : function(e, t) {
                    var n = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                      var r = Object.getOwnPropertySymbols(e);
                      n.push.apply(n, r)
                    }
                    return n
                  }(Object(o)).forEach((function(e) {
                    Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(o, e))
                  })), r) : e, [4, _()]) : [3, 2];
                case 1:
                  return n.sent().updateItemCounter(t), [2];
                case 2:
                  return [4, h()];
                case 3:
                  return n.sent().updateItemCounter(e), [2]
              }
              var r, o
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        v = function() {
          var e = s((function(e) {
            return u(this, (function(t) {
              switch (t.label) {
                case 0:
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? [4, _()] : [3, 2];
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
            var t, n, r;
            return u(this, (function(o) {
              switch (o.label) {
                case 0:
                  return t = e.id, n = e.title, r = e.path, (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) && "groupId" in e ? [4, _()] : [3, 2];
                case 1:
                  return [2, o.sent().addItem({
                    groupId: e.groupId,
                    pinnedSectionEntity: e.pinnedSectionEntity,
                    id: t,
                    title: n,
                    path: r,
                    icon: e.icon
                  })];
                case 2:
                  return "description" in e ? [4, h()] : [3, 4];
                case 3:
                  return [2, o.sent().addMenuItem({
                    item_name: t,
                    item_label: n,
                    item_description: e.description,
                    item_code: r
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
            return u(this, (function(t) {
              switch (t.label) {
                case 0:
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? [4, _()] : [3, 2];
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
    412325: (e, t, n) => {
      n.r(t);
      var r = n(629133),
        o = n.n(r),
        i = n(460159),
        a = n.n(i),
        s = n(345839),
        c = n(334254),
        u = n.n(c),
        l = n(128508),
        d = n(987081),
        f = n(797078),
        p = n(410432),
        _ = n(926168),
        h = n(214558),
        y = n(271311),
        m = n(210734),
        g = n(641762),
        v = (n(58544), n(661533));

      function b(e, t, n, r, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, o)
      }

      function w(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, o) {
            var i = e.apply(t, n);

            function a(e) {
              b(i, r, o, a, s, "next", e)
            }

            function s(e) {
              b(i, r, o, a, s, "throw", e)
            }
            a(void 0)
          }))
        }
      }

      function S(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
      }

      function E(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
        }
      }

      function O(e, t, n) {
        return t && E(e.prototype, t), n && E(e, n), e
      }

      function T(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function P(e, t, n) {
        return P = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var r = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = C(e)););
            return e
          }(e, t);
          if (r) {
            var o = Object.getOwnPropertyDescriptor(r, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, P(e, t, n || e)
      }

      function C(e) {
        return C = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, C(e)
      }

      function A(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
        e.prototype = Object.create(t && t.prototype, {
          constructor: {
            value: e,
            writable: !0,
            configurable: !0
          }
        }), t && I(e, t)
      }

      function N(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            r = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), r.forEach((function(t) {
            T(e, t, n[t])
          }))
        }
        return e
      }

      function D(e, t) {
        return t = null != t ? t : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : function(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            n.push.apply(n, r)
          }
          return n
        }(Object(t)).forEach((function(n) {
          Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(t, n))
        })), e
      }

      function I(e, t) {
        return I = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, I(e, t)
      }

      function k(e) {
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
          var n, r = C(e);
          if (t) {
            var o = C(this).constructor;
            n = Reflect.construct(r, arguments, o)
          } else n = r.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }

      function j(e, t) {
        var n, r, o, i, a = {
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
              if (n) throw new TypeError("Generator is already executing.");
              for (; a;) try {
                if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
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
                    a.label++, r = i[1], i = [0];
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
                i = [6, e], r = 0
              } finally {
                n = o = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, s])
          }
        }
      }
      var R = (0, h.current)("amojo_id"),
        L = (0, h.current)("id"),
        x = {
          TASK: 1,
          NOTE: 4,
          MAIL: 7,
          CALL_IN: 10,
          CALL_OUT: 11
        },
        M = function(e) {
          A(n, e);
          var t = k(n);

          function n() {
            return S(this, n), t.apply(this, arguments)
          }
          return O(n, [{
            key: "time_delta",
            get: function() {
              return this.get("time_delta")
            }
          }, {
            key: "spent_time",
            get: function() {
              return this.get("spent_time")
            }
          }, {
            key: "addTime",
            value: function(e) {
              this.set("spent_time", this.spent_time + e)
            }
          }, {
            key: "resetTimeDelta",
            value: function() {
              this.set("time_delta", 0)
            }
          }, {
            key: "addTimeToDelta",
            value: function(e) {
              this.set("time_delta", this.time_delta + e)
            }
          }, {
            key: "isAutoEventPossible",
            value: function() {
              return "pause" === this.get("timer_status") && "auto" === this.get("last_edit_method_status")
            }
          }]), n
        }(s.Model),
        B = function(e) {
          A(n, e);
          var t = k(n);

          function n() {
            return S(this, n), t.apply(this, arguments)
          }
          return O(n, [{
            key: "template",
            get: function() {
              return "/tmpl/operday/controls/content.twig"
            }
          }, {
            key: "_classes",
            value: function() {
              return {
                play: "operday-timer__control-element--play",
                pause: "operday-timer__control-element--pause",
                white: "operday-timer__input--white",
                show: "operday-timer__show",
                blinker_active: "operday-timer__suggest--active-blinker",
                holder: "operday-timer__holder"
              }
            }
          }, {
            key: "_selectors",
            value: function() {
              return {
                input: ".js-operday-timer-input",
                seconds: ".js-operday-timer-seconds",
                seconds_wrapper: ".js-operday-timer-seconds-wrapper",
                control_element: ".js-operday-timer-control-element",
                suggest: ".js-operday-timer-suggest",
                content: ".js-operday-timer-content"
              }
            }
          }, {
            key: "events",
            value: function() {
              var e;
              return T(e = {}, "click ".concat(this._selector("control_element")), "_toggleTimerStatus"), T(e, "click ".concat(this._selector("input")), "_onFocusInput"), T(e, "change ".concat(this._selector("input")), "_onManuallyChangeSpentTime"), T(e, "suggest:changed  ".concat(this._selector("suggest")), "_onManuallyChangeSpentTime"), e
            }
          }, {
            key: "initialize",
            value: function() {
              P(C(n.prototype), "initialize", this).apply(this, arguments), this.entity_type = this.$el.data("entity-type"), this.entity_id = this.$el.data("entity-id"), this.model = new M, this.$holder = this.$el.parent(), this.rxSubscriptions = new d.Subscription, this.model.resetTimeDelta(), this.listenTo(this.model, "change:spent_time", this._onChangeSpentTime), this.listenTo(this.model, "change:timer_status", this._onChangeTimerStatus), this.listenTo(this.model, "change:last_edit_method_status", this._onChangeLastEditMethodStatus), this.listenTo(this.model, "change:time_delta", this._onChangeTimeDelta), this.init()
            }
          }, {
            key: "destroy",
            value: function() {
              var e = this.model.time_delta;
              e > 0 && p.default.sendTimerState(this._prepareTimerConditionData("delta", e)), this._stopTimer(), this.rxSubscriptions.unsubscribe(), this.$holder.removeClass(this._class("holder")), P(C(n.prototype), "destroy", this).apply(this, arguments)
            }
          }, {
            key: "init",
            value: function() {
              var e = this;
              return w((function() {
                var t;
                return j(this, (function(n) {
                  switch (n.label) {
                    case 0:
                      return [4, p.default.getTimer(e.entity_id, e.entity_type)];
                    case 1:
                      return t = n.sent(), [4, a()._preload(e.template)()];
                    case 2:
                      return n.sent(), e._elem("content").html(a()({
                        ref: e.template
                      }).render({
                        selected: (0, g.secondsToHHMM)(t.spent_time)
                      })), e._socketSubscribe(), e.timer_id = t.id, e.model.set("spent_time", t.spent_time), e.model.set("timer_status", t.timer_status), e.model.set("last_edit_method_status", t.status), [2]
                  }
                }))
              }))()
            }
          }, {
            key: "_onFocusInput",
            value: function() {
              this._elem("seconds_wrapper").removeClass(this._class("show")), this._elem("suggest").removeClass(this._class("blinker_active")), "play" === this.model.get("timer_status") && this._toggleTimerStatus()
            }
          }, {
            key: "_onManuallyChangeSpentTime",
            value: function(e) {
              var t = v(e.target).val(),
                n = (0, g.hhmmToSeconds)(t);
              this.model.set("spent_time", n), this.model.set("last_edit_method_status", "manual"), p.default.sendTimerState(this._prepareTimerConditionData("manual", n))
            }
          }, {
            key: "_calculateSeconds",
            value: function(e) {
              var t = String(e % 60);
              return 1 === t.length ? "0".concat(t) : t
            }
          }, {
            key: "_onChangeLastEditMethodStatus",
            value: function() {
              switch (this.model.get("last_edit_method_status")) {
                case "auto":
                  this._elem("input").removeClass(this._class("white")), this._elem("seconds_wrapper").addClass(this._class("show"));
                  break;
                case "manual":
                  this._elem("input").addClass(this._class("white")), this._elem("seconds_wrapper").removeClass(this._class("show"))
              }
            }
          }, {
            key: "_onChangeTimerStatus",
            value: function() {
              "play" === this.model.get("timer_status") ? (this._startTimer(), this._elem("control_element").addClass(this._class("play")).removeClass(this._class("pause")), this._elem("seconds_wrapper").addClass(this._class("show")), this._elem("suggest").addClass(this._class("blinker_active")), this.model.set("last_edit_method_status", "auto")) : (this._stopTimer(), this._elem("suggest").removeClass(this._class("blinker_active")), this._elem("control_element").addClass(this._class("pause")).removeClass(this._class("play")))
            }
          }, {
            key: "_onChangeSpentTime",
            value: function() {
              var e = this;
              return w((function() {
                var t;
                return j(this, (function(n) {
                  return t = e.model.get("spent_time"), e._elem("seconds").html(e._calculateSeconds(t)), e._elem("input").val((0, g.secondsToHHMM)(t)), [2]
                }))
              }))()
            }
          }, {
            key: "_onChangeTimeDelta",
            value: function() {
              var e = this;
              return w((function() {
                return j(this, (function(t) {
                  switch (t.label) {
                    case 0:
                      if (!(e.model.time_delta >= 60)) return [3, 4];
                      t.label = 1;
                    case 1:
                      return t.trys.push([1, 3, , 4]), [4, p.default.sendTimerState(e._prepareTimerConditionData("delta", e.model.time_delta))];
                    case 2:
                      return t.sent(), e.model.resetTimeDelta(), [3, 4];
                    case 3:
                      return t.sent(), e._toggleTimerStatus(), [3, 4];
                    case 4:
                      return [2]
                  }
                }))
              }))()
            }
          }, {
            key: "_toggleTimerStatus",
            value: function() {
              var e = this.model.get("timer_status"),
                t = this.model.time_delta;
              switch (e) {
                case "play":
                  this.model.set("timer_status", "pause"), t > 0 && (p.default.sendTimerState(this._prepareTimerConditionData("pause", t)), this.model.resetTimeDelta());
                  break;
                case "pause":
                  this.model.set("timer_status", "play"), p.default.sendTimerState(this._prepareTimerConditionData("play"))
              }
            }
          }, {
            key: "_startTimer",
            value: function() {
              var e = this;
              this.timer_interval_id = u().every(1e3, (function() {
                e.model.addTime(1), e.model.addTimeToDelta(1)
              }))
            }
          }, {
            key: "_stopTimer",
            value: function() {
              u().stop(this.timer_interval_id)
            }
          }, {
            key: "_socketSubscribe",
            value: function() {
              var e = (0, _.convertElementType)(this.entity_type, "single"),
                t = "".concat(e, ":card:").concat(this.entity_id),
                n = f.default.subscribe([t]).pipe(l.filter((function(e) {
                  if ("message" !== e.method) return !1;
                  var t = o().values(x),
                    n = o().propertyOf(e)(["body", "payload"]);
                  if (!o().contains(t, n.type)) return !1;
                  switch (n.type) {
                    case x.TASK:
                      if (!n.status || n.responsible_user_id !== L) return !1;
                      break;
                    case x.NOTE:
                      if (!n.author_name || n.created_by !== L) return !1;
                      break;
                    case x.MAIL:
                    case x.CALL_IN:
                    case x.CALL_OUT:
                      if (n.created_by !== L) return !1;
                      break;
                    default:
                      return !1
                  }
                  return !0
                })), l.map((function(e) {
                  var t = o().propertyOf(e)(["body", "payload"]),
                    n = o().propertyOf(t)(["data", "params"]);
                  switch (t.type) {
                    case x.TASK:
                      return t.duration || 60;
                    case x.NOTE:
                    case x.MAIL:
                      return 60;
                    case x.CALL_OUT:
                    case x.CALL_IN:
                      return n.duration;
                    default:
                      return 0
                  }
                }))),
                r = y.default.socket.pipe(l.map((function(e) {
                  var t = e.data;
                  try {
                    return JSON.parse(t)
                  } catch (e) {
                    return t
                  }
                })), l.filter((function(e) {
                  var t = o().propertyOf(e)(["data", "message", "author", "id"]);
                  return "message_created" === e.type && t === R
                })), l.map((function() {
                  return 60
                })));
              this.rxSubscriptions.add(n.subscribe(o().bind(this._handleSocketEvent, this))), this.rxSubscriptions.add(r.subscribe(o().bind(this._handleSocketEvent, this)))
            }
          }, {
            key: "_handleSocketEvent",
            value: function(e) {
              this.model.isAutoEventPossible() && this.model.addTime(e)
            }
          }, {
            key: "_prepareTimerConditionData",
            value: function(e, t) {
              var n = {
                entity_type: this.entity_type,
                id: this.entity_id
              };
              switch (e) {
                case "delta":
                  return D(N({}, n), {
                    body: {
                      timer_id: this.timer_id,
                      delta_time: t
                    }
                  });
                case "play":
                  return D(N({}, n), {
                    body: {
                      timer_id: this.timer_id,
                      timer_status: "play"
                    }
                  });
                case "pause":
                  return D(N({}, n), {
                    body: {
                      timer_id: this.timer_id,
                      timer_status: "pause",
                      delta_time: t
                    }
                  });
                case "manual":
                  return D(N({}, n), {
                    body: {
                      timer_id: this.timer_id,
                      manual_time: t
                    }
                  });
                default:
                  return {}
              }
            }
          }], [{
            key: "controlClassName",
            get: function() {
              return "js-operday-timer"
            }
          }]), n
        }(m.default);
      B.extend(B);
      var W = "../build/transpiled/interface/operday/controls/timer";
      window.define(W, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([W])
    },
    49091: (e, t, n) => {
      n.r(t), n.d(t, {
        CONNECTION_CODES: () => r,
        SOCKET_NAMES: () => i,
        SOCKET_STATE: () => o
      });
      var r = {
          DEFAULT: 0,
          NORMAL_CLOSURE: 1e3,
          INTERNAL_ERROR: 1011,
          UNAUTHORIZED: 3401,
          OFFLINE: 4e3
        },
        o = {
          CONNECTED: "connected",
          CONNECTING: "connecting",
          DISCONNECTED: "disconnected",
          CONNECT_OPENED: "connect_opened"
        },
        i = {
          NOTIFICATIONS: "notifications",
          AMOJO: "amojo"
        },
        a = "../build/transpiled/network/socket/constant";
      window.define(a, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([a])
    },
    797078: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => M
      });
      var r = n(629133),
        o = n.n(r),
        i = n(987081),
        a = n(128508),
        s = n(643095),
        c = n(12615),
        u = n(49091),
        l = n(535571),
        d = n(126608),
        f = n(168807),
        p = n(778618);

      function _(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var h = APP.constant("notifications").url_ws_2,
        y = new d.default,
        m = (0, l.default)(h, y),
        g = new i.Subject,
        v = new i.Subject,
        b = m.messages.pipe(a.map((function(e) {
          return JSON.parse(e)
        }))),
        w = [u.CONNECTION_CODES.DEFAULT, u.CONNECTION_CODES.NORMAL_CLOSURE],
        S = !1,
        E = [],
        O = !1,
        T = null,
        P = null,
        C = 0,
        A = 0,
        N = null,
        D = null,
        I = !1,
        k = 0,
        j = {};

      function R() {
        A = 0, C = 0, O ? o().each(E, (function(e) {
          return e({
            status: u.SOCKET_STATE.CONNECTED
          })
        })) : O = !0
      }

      function L() {
        I = !1, x()
      }

      function x() {
        T && T.unsubscribe(), P && P.unsubscribe(), P = b.subscribe((function(e) {
          g.next(e)
        }), (function(e) {
          var t = m.connectionStatus.getValue();
          e.target && e.target.readyState !== WebSocket.OPEN && 0 === t.state && o().contains(w, t.code) && v.next({
            state: 0,
            code: u.CONNECTION_CODES.INTERNAL_ERROR
          })
        })), T = i.merge(m.connectionStatus, v).subscribe((function(e) {
          if (!o().isEqual(j, e))
            if (j = e, (0, p.clearWorkerTimeout)(N), (0, p.clearWorkerTimeout)(D), window.removeEventListener("online", L), 0 === e.state) {
              var t, n = (0, f.exponentialDelay)(A, {
                with_jitter: !0
              });
              switch (o().each(E, (function(t) {
                  return t({
                    status: o().contains(w, e.code) ? u.SOCKET_STATE.DISCONNECTED : u.SOCKET_STATE.CONNECTING,
                    delay: n,
                    statusCode: e.code,
                    reason: e.reason
                  })
                })), e.code) {
                case u.CONNECTION_CODES.DEFAULT:
                case u.CONNECTION_CODES.NORMAL_CLOSURE:
                  break;
                case u.CONNECTION_CODES.UNAUTHORIZED:
                  0 === C && (C++, c.default.check().done((function() {
                    x()
                  })));
                  break;
                default:
                  N = (0, p.setWorkerTimeout)(x, n), window.addEventListener("online", L), A < 5 ? A++ : A = 0
              }(null === (t = window.navigator) || void 0 === t ? void 0 : t.onLine) && !o().contains(w, e.code) && function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                  t = function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                      var n = null != arguments[t] ? arguments[t] : {},
                        r = Object.keys(n);
                      "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                        return Object.getOwnPropertyDescriptor(n, e).enumerable
                      })))), r.forEach((function(t) {
                        _(e, t, n[t])
                      }))
                    }
                    return e
                  }({
                    socketName: u.SOCKET_NAMES.NOTIFICATIONS
                  }, e);
                S && (0, s.sentryLogSocketDisconnect)(t)
              }({
                code: e.code,
                reason: e.reason
              })
            } else o().each(E, (function(e) {
              return e({
                status: u.SOCKET_STATE.CONNECT_OPENED
              })
            })), D = (0, p.setWorkerTimeout)(R, 2e3)
        }))
      }
      const M = {
        subscribe: function(e) {
          return e = o().isArray(e) ? e : [e], new i.Observable((function(t) {
            m.connectionStatus.getValue().state || !1 !== I || (x(), I = !0);
            var n = g.pipe(a.filter((function(t) {
              return o().isUndefined(t.channel) ? t : o().filter(e, (function(e) {
                return t.body.channel === e
              })).length
            })), a.tap({
              next: o().bind(t.next, t)
            })).subscribe(o().noop());
            return function() {
              n.unsubscribe()
            }
          }))
        },
        status: m.connectionStatus,
        onConnectionChange: function(e) {
          return E.push(e),
            function() {
              E = o().without(E, e)
            }
        },
        reconnect: L,
        send: function(e) {
          e = o().isArray(e) ? e : [e], y.next(JSON.stringify(o().map(e, (function(e) {
            return o().extend({
              uid: (++k).toString()
            }, e)
          }))))
        }
      };
      var B = "../build/transpiled/network/socket/index";
      window.define(B, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([B])
    },
    910: (e, t, n) => {
      n.r(t), n.d(t, {
        getCallingStatus: () => d,
        runMerge: () => p,
        setCallingStatus: () => l,
        showUserStatus: () => f
      });
      var r = n(629133),
        o = n.n(r),
        i = n(214558);

      function a(e, t, n, r, o, i, a) {
        try {
          var s = e[i](a),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, o)
      }
      var s, c, u = !1,
        l = function(e) {
          return "calling_status - " + (u = e)
        },
        d = function() {
          return u
        },
        f = function(e) {
          var t = {},
            n = (0, i.get)();
          switch (!0) {
            case "online" === e:
              t = [], o().each(n, (function(e) {
                !0 === e.online && t.push(e.id)
              }));
              break;
            case !o().isNaN(parseInt(e)) && !o().isUndefined((0, i.get)(e)):
              t = (0, i.get)(e).online || !1;
              break;
            default:
              o().each(n, (function(e, n) {
                t[n] = {}, t[n].id = e.id, t[n].online = e.online || !1
              }))
          }
          return t
        },
        p = (s = function(e) {
          return function(e, t) {
            var n, r, o, i, a = {
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
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; a;) try {
                    if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done) return o;
                    switch (r = 0, o && (i = [2 & i[0], o.value]), i[0]) {
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
                        a.label++, r = i[1], i = [0];
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
                    i = [6, e], r = 0
                  } finally {
                    n = o = 0
                  }
                  if (5 & i[0]) throw i[1];
                  return {
                    value: i[0] ? i[1] : void 0,
                    done: !0
                  }
                }([i, s])
              }
            }
          }(this, (function(t) {
            switch (t.label) {
              case 0:
                return [4, Promise.all([n.e(68592), n.e(50769), n.e(73197), n.e(85175)]).then(n.bind(n, 450769))];
              case 1:
                return [2, new(0, t.sent().default)(e)]
            }
          }))
        }, c = function() {
          var e = this,
            t = arguments;
          return new Promise((function(n, r) {
            var o = s.apply(e, t);

            function i(e) {
              a(o, n, r, i, c, "next", e)
            }

            function c(e) {
              a(o, n, r, i, c, "throw", e)
            }
            i(void 0)
          }))
        }, function(e) {
          return c.apply(this, arguments)
        }),
        _ = "../build/transpiled/sdk/index";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "89c19782-064d-4a78-a5bd-d56efec0ebc3", e._sentryDebugIdIdentifier = "sentry-dbid-89c19782-064d-4a78-a5bd-d56efec0ebc3")
    } catch (e) {}
  }();
//# sourceMappingURL=80815.8e13e5a1ceefd5aa1127.js.map