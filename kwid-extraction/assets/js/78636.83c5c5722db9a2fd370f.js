"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [78636], {
    466072: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => l
      });
      var n = i(629133),
        o = i.n(n),
        a = i(398457),
        s = i.n(a),
        r = [],
        c = function() {
          for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
          return s().apply(this, e)
        };
      (c.prototype = Object.create(s().prototype)).throttle = o().throttle;
      var d = function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        this.steady_loader = new c({
          scrollElement: t.element || window,
          conditions: t.conditions || {
            "max-bottom": 100
          },
          throttle: t.throttle || 100,
          handler: function(e, i) {
            var n = t.onLoadMore();
            n && n.then ? n.then(i) : i()
          }
        }), r.push(this.steady_loader)
      };
      d.prototype.destroy = function() {
        var t = o().indexOf(r, this.steady_loader);
        this.steady_loader && this.steady_loader.stop(), r.splice(t, 1)
      };
      const l = d;
      var u = "../build/transpiled/components/base/autoload";
      window.define(u, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([u])
    },
    621448: (t, e, i) => {
      i.r(e), i.d(e, {
        InboxBadgeId: () => n,
        get: () => I,
        listen: () => P,
        set: () => D,
        update: () => S
      });
      var n, o, a = i(629133),
        s = i.n(a),
        r = i(987081),
        c = i(128508),
        d = i(12615),
        l = i(797078),
        u = i(156040),
        f = i(214558),
        _ = i(859200),
        h = i(126608),
        p = i(661533);

      function b(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
        return n
      }

      function m(t, e, i, n, o, a, s) {
        try {
          var r = t[a](s),
            c = r.value
        } catch (t) {
          return void i(t)
        }
        r.done ? e(c) : Promise.resolve(c).then(n, o)
      }

      function g(t, e, i) {
        return e in t ? Object.defineProperty(t, e, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = i, t
      }

      function v(t, e) {
        return function(t) {
          if (Array.isArray(t)) return t
        }(t) || function(t, e) {
          var i = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
          if (null != i) {
            var n, o, a = [],
              s = !0,
              r = !1;
            try {
              for (i = i.call(t); !(s = (n = i.next()).done) && (a.push(n.value), !e || a.length !== e); s = !0);
            } catch (t) {
              r = !0, o = t
            } finally {
              try {
                s || null == i.return || i.return()
              } finally {
                if (r) throw o
              }
            }
            return a
          }
        }(t, e) || function(t, e) {
          if (t) {
            if ("string" == typeof t) return b(t, e);
            var i = Object.prototype.toString.call(t).slice(8, -1);
            return "Object" === i && t.constructor && (i = t.constructor.name), "Map" === i || "Set" === i ? Array.from(i) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? b(t, e) : void 0
          }
        }(t, e) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }! function(t) {
        t.BADGE = "badge", t.BADGE_BRIEF = "badge_brief", t.BADGE_NO_CHATS = "badge_no_chats", t.BADGE_NO_CHAT_BRIEF = "badge_no_chat_brief", t.BADGE_NO_EXTERNAL_CHAT = "badge_no_external_chat", t.BADGE_NO_EXTERNAL_CHAT_BRIEF = "badge_no_external_chat_brief", t.BADGE_INBOX = "badge_inbox", t.BADGE_TEAM_UNION = "badge_team_union", t.BADGE_TEAM_UNION_BRIEF = "badge_team_union_brief"
      }(n || (n = {}));
      var y, w = (g(o = {}, "badge", 0), g(o, "badge_brief", "0"), g(o, "badge_no_chats", 0), g(o, "badge_no_chat_brief", "0"), g(o, "badge_no_external_chat", 0), g(o, "badge_no_external_chat_brief", "0"), g(o, "badge_inbox", 0), g(o, "badge_team_union", 0), g(o, "badge_team_union_brief", "0"), o),
        E = [119, 126],
        k = [125],
        x = APP.constant("account").id,
        A = (0, f.current)("id"),
        T = "inbox:talks:".concat(x),
        C = "notifications:".concat(x, ":").concat(A),
        N = APP.constant("account").is_chats_inbox_enabled,
        O = new h.default;

      function S() {
        if (!y) {
          var t = (e = function() {
            var t, e, i;
            return function(t, e) {
              var i, n, o, a, s = {
                label: 0,
                sent: function() {
                  if (1 & o[0]) throw o[1];
                  return o[1]
                },
                trys: [],
                ops: []
              };
              return a = {
                next: r(0),
                throw: r(1),
                return: r(2)
              }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                return this
              }), a;

              function r(a) {
                return function(r) {
                  return function(a) {
                    if (i) throw new TypeError("Generator is already executing.");
                    for (; s;) try {
                      if (i = 1, n && (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) && !(o = o.call(n, a[1])).done) return o;
                      switch (n = 0, o && (a = [2 & a[0], o.value]), a[0]) {
                        case 0:
                        case 1:
                          o = a;
                          break;
                        case 4:
                          return s.label++, {
                            value: a[1],
                            done: !1
                          };
                        case 5:
                          s.label++, n = a[1], a = [0];
                          continue;
                        case 7:
                          a = s.ops.pop(), s.trys.pop();
                          continue;
                        default:
                          if (!((o = (o = s.trys).length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                            s = 0;
                            continue
                          }
                          if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                            s.label = a[1];
                            break
                          }
                          if (6 === a[0] && s.label < o[1]) {
                            s.label = o[1], o = a;
                            break
                          }
                          if (o && s.label < o[2]) {
                            s.label = o[2], s.ops.push(a);
                            break
                          }
                          o[2] && s.ops.pop(), s.trys.pop();
                          continue
                      }
                      a = e.call(t, s)
                    } catch (t) {
                      a = [6, t], n = 0
                    } finally {
                      i = o = 0
                    }
                    if (5 & a[0]) throw a[1];
                    return {
                      value: a[0] ? a[1] : void 0,
                      done: !0
                    }
                  }([a, r])
                }
              }
            }(this, (function(n) {
              switch (n.label) {
                case 0:
                  return n.trys.push([0, 2, 3, 4]), [4, d.default.checkAuth((function() {
                    return Promise.all(s().compact([p.ajax({
                      url: "/v3/inbox/badge",
                      dataType: "json"
                    }), N && !(0, _.getRights)("is_free_user") && p.ajax({
                      url: "/ajax/v4/inbox/badge",
                      dataType: "json"
                    })]))
                  }))];
                case 1:
                  return t = v.apply(void 0, [n.sent(), 2]), e = t[0], i = t[1], O.next(e), i && O.next({
                    badge_inbox: i.count
                  }), [3, 4];
                case 2:
                  return n.sent(), [3, 4];
                case 3:
                  return y = null, [7];
                case 4:
                  return [2]
              }
            }))
          }, i = function() {
            var t = this,
              i = arguments;
            return new Promise((function(n, o) {
              var a = e.apply(t, i);

              function s(t) {
                m(a, n, o, s, r, "next", t)
              }

              function r(t) {
                m(a, n, o, s, r, "throw", t)
              }
              s(void 0)
            }))
          }, function() {
            return i.apply(this, arguments)
          });
          y = t()
        }
        var e, i;
        return y
      }

      function P(t) {
        return new r.Observable((function(e) {
          var i = s().isArray(t) ? t : [t],
            n = O.pipe(c.map((function(t) {
              return s().extend(w, s().pick(t, i)), s().pick(w, i)
            })), c.tap({
              next: s().bind(e.next, e)
            })).subscribe(s().noop);
          return O.next(w),
            function() {
              return n.unsubscribe()
            }
        }))
      }

      function I(t) {
        var e = s().clone(w);
        return t ? e[t] || 0 : e
      }

      function D(t) {
        s().extend(w, s().pick(t, s().keys(w)));
        var e = s().pick(w, s().keys(t));
        return s().isEmpty(e) || O.next(e), !s().isEmpty(e)
      }
      l.default.subscribe([C]).pipe(c.filter((function(t) {
        return s().propertyOf(t)(["body", "channel"]) === C
      })), c.map((function(t) {
        return s().propertyOf(t)(["body", "payload"]) || {}
      }))).subscribe(O), N && (l.default.status.subscribe((function(t) {
        t.state === WebSocket.OPEN && l.default.send([{
          method: "subscribe",
          params: {
            channel: T
          }
        }])
      })), l.default.subscribe([T]).pipe(c.filter((function(t) {
        return s().propertyOf(t)(["body", "channel"]) === T && s().contains(s().union(E, k), s().propertyOf(t)(["body", "payload", "type"]))
      })), c.map((function(t) {
        var e = 119 !== s().propertyOf(t)(["body", "payload", "type"]) || 119 === s().propertyOf(t)(["body", "payload", "type"]) && !1 === s().propertyOf(t)(["body", "payload", "model", "is_read"]),
          i = s().contains(E, s().propertyOf(t)(["body", "payload", "type"])) ? 1 : -1,
          n = "badge_inbox";
        return D(g({}, n, I(n) + (e ? i : 0))), !0
      }))).subscribe(O)), (0, u.onPageFullyLoaded)(S)
    },
    778636: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => ct
      });
      var n = i(162262),
        o = i.n(n),
        a = i(661533),
        s = i.n(a),
        r = i(161320),
        c = i.n(r),
        d = i(267651),
        l = i.n(d),
        u = i(987081),
        f = i(128508),
        _ = i(460159),
        h = i.n(_),
        p = i(629133),
        b = i.n(p),
        m = i(334254),
        g = i.n(m),
        v = i(156040),
        y = i(12615),
        w = i(313981),
        E = i(335745),
        k = i(811149),
        x = i(49091),
        A = i(797078),
        T = i(180137),
        C = i(833496),
        N = i(500034),
        O = i(214558),
        S = i(445368),
        P = i(955026),
        I = i(926168),
        D = i(258471),
        R = i(474564),
        M = i(761634),
        L = i(537107),
        F = i(466072),
        B = i(845043),
        U = i(567042),
        j = i(641228),
        W = i(472450),
        H = i(963154),
        V = i(46018),
        q = i(341302),
        K = i(382646),
        G = i(621448),
        X = i(371596);

      function z(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
        return n
      }

      function Y(t, e, i, n, o, a, s) {
        try {
          var r = t[a](s),
            c = r.value
        } catch (t) {
          return void i(t)
        }
        r.done ? e(c) : Promise.resolve(c).then(n, o)
      }

      function $(t) {
        return function() {
          var e = this,
            i = arguments;
          return new Promise((function(n, o) {
            var a = t.apply(e, i);

            function s(t) {
              Y(a, n, o, s, r, "next", t)
            }

            function r(t) {
              Y(a, n, o, s, r, "throw", t)
            }
            s(void 0)
          }))
        }
      }

      function J(t, e, i) {
        return e in t ? Object.defineProperty(t, e, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = i, t
      }

      function Z(t, e) {
        return function(t) {
          if (Array.isArray(t)) return t
        }(t) || function(t, e) {
          var i = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
          if (null != i) {
            var n, o, a = [],
              s = !0,
              r = !1;
            try {
              for (i = i.call(t); !(s = (n = i.next()).done) && (a.push(n.value), !e || a.length !== e); s = !0);
            } catch (t) {
              r = !0, o = t
            } finally {
              try {
                s || null == i.return || i.return()
              } finally {
                if (r) throw o
              }
            }
            return a
          }
        }(t, e) || function(t, e) {
          if (t) {
            if ("string" == typeof t) return z(t, e);
            var i = Object.prototype.toString.call(t).slice(8, -1);
            return "Object" === i && t.constructor && (i = t.constructor.name), "Map" === i || "Set" === i ? Array.from(i) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? z(t, e) : void 0
          }
        }(t, e) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function Q(t, e) {
        var i, n, o, a, s = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return a = {
          next: r(0),
          throw: r(1),
          return: r(2)
        }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this
        }), a;

        function r(a) {
          return function(r) {
            return function(a) {
              if (i) throw new TypeError("Generator is already executing.");
              for (; s;) try {
                if (i = 1, n && (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n), 0) : n.next) && !(o = o.call(n, a[1])).done) return o;
                switch (n = 0, o && (a = [2 & a[0], o.value]), a[0]) {
                  case 0:
                  case 1:
                    o = a;
                    break;
                  case 4:
                    return s.label++, {
                      value: a[1],
                      done: !1
                    };
                  case 5:
                    s.label++, n = a[1], a = [0];
                    continue;
                  case 7:
                    a = s.ops.pop(), s.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = s.trys).length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                      s = 0;
                      continue
                    }
                    if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                      s.label = a[1];
                      break
                    }
                    if (6 === a[0] && s.label < o[1]) {
                      s.label = o[1], o = a;
                      break
                    }
                    if (o && s.label < o[2]) {
                      s.label = o[2], s.ops.push(a);
                      break
                    }
                    o[2] && s.ops.pop(), s.trys.pop();
                    continue
                }
                a = e.call(t, s)
              } catch (t) {
                a = [6, t], n = 0
              } finally {
                i = o = 0
              }
              if (5 & a[0]) throw a[1];
              return {
                value: a[0] ? a[1] : void 0,
                done: !0
              }
            }([a, r])
          }
        }
      }
      i.e(22589).then(i.bind(i, 579594)), i.e(92504).then(i.bind(i, 392504));
      var tt, et = APP.constant("account").is_chats_inbox_enabled,
        it = !1,
        nt = null,
        ot = et ? "?filter[exclude][external_chats]=true" : "",
        at = (0, N.isFeatureAvailable)("global_inbox") ? G.InboxBadgeId.BADGE_NO_CHAT_BRIEF : G.InboxBadgeId.BADGE_NO_EXTERNAL_CHAT_BRIEF,
        st = "/v3/inbox/list".concat(et && (0, N.isFeatureAvailable)("global_inbox") ? "?filter[exclude][chats]=true" : ot),
        rt = w.default.extend({
          el: "#notification-wrapper",
          data: [],
          error: null,
          badge_id: et ? at : G.InboxBadgeId.BADGE_BRIEF,
          sound_id: "amo_inbox_sound",
          api: {
            list: st,
            read: "/v3/inbox/read",
            task: "/ajax/todo/multiple/close/"
          },
          collection: j.Collection,
          current_state: U.default.STATE_UNINITIALIZED,
          current_mode: U.default.MODE_NORMAL,
          no_content: !1,
          no_content_text: (0, S.i18n)("No notifications found"),
          filters: [],
          opened_direct_chat: null,
          push_hide_timers: {},
          directChatOpening: !1,
          inbox_fully_opened: !1,
          readable_ids: [],
          readers: {},
          presets: null,
          _selectors: function() {
            return {
              inbox: "#notification-aside",
              inbox_container: "#inbox-container",
              search_container: ".search-container",
              inbox__spiner: ".inbox__spiner",
              aside_inner: ".aside__inner",
              direct_chat_container: ".inbox-direct-chat-container",
              inbox_toggle_button: ".nav__notifications",
              toast_container: "#popups_inbox",
              navigation: ".js-navigate-link",
              unread_item: ".notification__item__unread",
              cancel_search: ".aside-clear-button",
              search_input: "input.js-input-search",
              chat_create_cross: ".add_icon-userpic_is-add",
              button_scroll: ".button-scroll",
              sound_toggler: ".js-inbox-mute",
              notification_emotion: '.js-notification_emotion[data-id="%s"]'
            }
          },
          _classes: function() {
            return {
              item: "notification__item",
              active: "inbox-expanded",
              enable_animation: "animated",
              hide_animation: "slide-out",
              show_animation: "slide-in",
              loading: "loading-full",
              direct_chat_enabled: "direct-chat__opened",
              chat_create_active: "active"
            }
          },
          events: {
            "click .js-inbox-multiactions": "openMultiaction",
            "click .js-create_group_chat:not(.chat_create-button--disabled)": "createGroupChat",
            "click .notification__item:not(.notification__item-plug)": "onSelectItemClick",
            "click .notification-inner__button_show-more": "onShowMoreClick",
            "click .js-notification-favorites": "chooseFavorite",
            "mouseenter .notification__item:not(.notification__item-plug)": "onNotificationMouseEnter",
            "mouseleave .notification__item:not(.notification__item-plug)": "onNotificationMouseLeave"
          },
          document_events: {
            "amo:task:complete": "completeTask"
          },
          addReader: function(t, e) {
            return this.readers[e] = t, e
          },
          chooseFavorite: function(t) {
            var e = s()(t.currentTarget).closest(".notification-inner").data("id"),
              i = this.notifications.get(e),
              n = !i.get(this.getLabelParamName());
            t.stopPropagation(), t.preventDefault(), i && (i.set(this.getLabelParamName(), n), s().ajax({
              url: "/v3/inbox/notifications/".concat(i.get("notification_id"), "/label"),
              type: n ? "POST" : "DELETE"
            }))
          },
          onNotificationMouseEnter: function(t) {
            var e = this.notifications.get(t.currentTarget.dataset.id);
            this.destroyQuickActionMenu(), e && this.initQuickActionMenu({
              el: s()(t.currentTarget).find(".js-notification-quick-action"),
              model: e
            })
          },
          onNotificationMouseLeave: function() {
            this.notification_quick_action && !this.notification_quick_action.is_active && this.destroyQuickActionMenu()
          },
          removeReader: function(t) {
            delete this.readers[t]
          },
          initialize: function(t) {
            var e = this.source || H.default;
            this.options = t || {}, this.apply_deferred = s().Deferred(), this.filter_deferred = s().Deferred(), w.default.prototype.initialize.apply(this, arguments), this.$el.length && (this._managers = (0, O.get)(), this.source_loader = new e(U.default.PAGE_COUNT, this.api.list), this.notifications = this._addComponent(this.collection, {
              order_by: this.getInitialSortOrder().unread_first ? "read_state" : ""
            }), this.listenTo(this.notifications, "change:selected", this.onItemSelected), this.unmountNotFoundNotificationHandler = this.initNotFoundNotificationHandler(), this.socket = new u.Subscription, this.initSound(), this.initAllPromises())
          },
          destroy: function() {
            for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
            return this.badge && this.badge.unsubscribe(), this.socket && this.socket.unsubscribe(), this.unmountNotFoundNotificationHandler && this.unmountNotFoundNotificationHandler(), w.default.prototype.destroy.apply(this, e)
          },
          initAllPromises: function() {
            return this.promise_all_init = Promise.all([this.requestBadge().then(b().bind(this.requestPresets, this)), this.requestPushPermission(), this.connect(), this.initSource()]), this.promise_all_init
          },
          initMultiaction: function() {
            return $((function() {
              var t, e;
              return Q(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return this.multiaction ? [2] : [4, i.e(59068).then(i.bind(i, 59068))];
                  case 1:
                    return t = n.sent(), e = t.default, this.multiaction = this._addComponent(e, {
                      el: this._elem("aside_inner").get(0),
                      notifications: this.notifications,
                      closeChat: b().bind(this.closeDirectChat, this),
                      onButtonClick: b().bind(this.processMultiaction, this)
                    }), [2]
                }
              }))
            })).apply(this)
          },
          addUsersInBuffer: function(t) {
            this.source_loader.addUsersBuffer(t) && this.getAddModelDirect(t)
          },
          multiactionClose: function() {
            this.multiaction && this.multiaction.close()
          },
          canMultiactionsBeShown: function() {
            return !(1 === this.notifications.length && "fake" === this.notifications.first().get("id"))
          },
          openMultiaction: function() {
            this.multiaction && this.canMultiactionsBeShown() && this.multiaction.show((0, P.hasKeys)(this.search, ["filter"]) && this.search.filter.super_change)
          },
          addNotification: function(t) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            this.filterEntryCheck(t) ? this.notifications.add(t, e) : this.rejectExistingModelOnAdd(t)
          },
          getInitialSortOrder: function() {
            return (0, W.getInitialSortOrder)()
          },
          initNotFoundNotificationHandler: function() {
            var t = this,
              e = function() {
                t.canNotFoundNotificationBeShown() ? t.addNotFoundNotification() : t.canNotFoundNotificationBeRemoved() && t.removeNotFoundNotification()
              };
            return this.notifications.on("add remove", e),
              function() {
                t.notifications.off("add remove", e)
              }
          },
          rejectExistingModelOnAdd: function(t) {
            var e = t.id,
              i = [];
            return this.notifications.get(e) ? (this.notifications.remove(e), i = [e]) : i
          },
          excludeTypeEntryCheck: function(t) {
            return b().contains(this.options.exclude_click_types, b().propertyOf(t.get("click"))(["type"]))
          },
          filterEntryCheck: function(t) {
            var e = this.getFilterSource(),
              i = b().reduce(this.getFilterOptions(), (function(t, i, n) {
                if (b().isEmpty(i)) return t;
                switch (n) {
                  case "provider[]":
                    t.sources = {}, !b().isEmpty(i) && b().isString(i) && (i = [i]), i = b().filter(b().toArray(i), (function(i) {
                      return !b().contains(b().pluck(e, "id"), i) || (t.sources.chat_source = [i].concat(t.sources.chat_source || []), !1)
                    }), this), b().isArray(t.sources.provider) ? t.sources.provider = t.sources.provider.concat(b().isArray(i) ? i : [i]) : t.sources.provider = b().isArray(i) ? i : [i];
                    break;
                  case "updated_at_to":
                    t.updated_at || (t.updated_at = {}), t.updated_at.to = i;
                    break;
                  case "updated_at_from":
                    t.updated_at || (t.updated_at = {}), t.updated_at.from = i;
                    break;
                  case "label[]":
                  case "is_read[]":
                    t.statuses = t.statuses || {}, t.statuses[n.replace("[]", "")] = b().isArray(i) ? i : [i];
                    break;
                  default:
                    t[n] = b().isArray(i) ? i : [i]
                }
                return t
              }), {}, this),
              n = !0;
            return n = b().every(i, (function(e, i) {
              var n = i.replace("[]", "");
              switch (i) {
                case "filter[date_preset]":
                  return this.checkPresetNotification(t.get("updated_at"), e[0]);
                case "updated_at":
                  return this.checkTimeNotification(t.get(n), e);
                case "sources":
                case "statuses":
                  return b().some(e, (function(e, i) {
                    return !b().isUndefined(t.get(i)) && t.get(i).toString() && -1 !== e.indexOf(t.get(i).toString())
                  }));
                default:
                  return !b().isUndefined(t.get(n)) && t.get(n).toString() && -1 !== e.indexOf(t.get(n).toString())
              }
            }), this), this.excludeTypeEntryCheck(t) && (n = !1), n
          },
          checkPresetNotification: function(t, e) {
            var i = (0, K.default)(e);
            return t >= parseInt(i.from) && t <= parseInt(i.to)
          },
          checkTimeNotification: function(t, e) {
            var i = c()(e.from, APP.system.format.date.date).format("X"),
              n = c()(e.to, APP.system.format.date.date).set({
                hours: 23,
                minutes: 59,
                second: 59
              }).format("X");
            return t >= i && t <= n
          },
          canNotFoundNotificationBeShown: function() {
            return 0 === this.notifications.length
          },
          canNotFoundNotificationBeRemoved: function() {
            return !(1 === this.notifications.length && "fake" === this.notifications.at(0).get("id"))
          },
          initSource: function() {
            this.source_loader.init(b().bind((function(t, e) {
              var i = this.notifications.model;
              t.error && (this.current_state = U.default.STATE_SHOW_ERROR, this.showError(), this.hideLoading(), e.resolve()), t.items && b().each(t.items, b().bind((function(t) {
                var e = new i(t);
                this.excludeTypeEntryCheck(e) || this.createNotificationModel(t)
              }), this)), this.canNotFoundNotificationBeShown() && this.addNotFoundNotification(), this.readable_ids.length > 0 && this.read({
                id: this.readable_ids
              }), this.notifications.sort(), this.current_state = U.default.STATE_SHOW_CONTENT, this.hideLoading(), e.resolve()
            }), this))
          },
          addNotFoundNotification: function() {
            this.notifications.add({
              id: "fake",
              type: "user_not_found"
            })
          },
          removeNotFoundNotification: function() {
            this.notifications.remove("fake")
          },
          scrollToTop: b().noop,
          onVirtualizedListScroll: function() {},
          onSelectItemClick: function(t) {
            var e, i = s()(t.currentTarget),
              n = i.attr("data-custom-action-hash"),
              o = Boolean(null === (e = this.multiaction) || void 0 === e ? void 0 : e.is_show);
            if (n) this.fulfillItemCustomAction(n);
            else if (o && (t.stopPropagation(), t.preventDefault()), !(t.metaKey || t.ctrlKey || o)) {
              var a = this.notifications.get(i.attr("data-id"));
              (null == a ? void 0 : a.get("click")) && a.set("selected", !0)
            }
          },
          onShowMoreClick: function(t) {
            var e = this.notifications.get(s()(t.currentTarget).closest(this._selector("item")).attr("data-id"));
            t.stopPropagation(), t.preventDefault(), e && e.set("opened", !e.get("opened"))
          },
          onItemSelected: function(t) {
            if (t.get("selected")) {
              var e = b().propertyOf(APP.constant("account"))(["amo_messenger", "direct_migrated"]),
                i = t.get("click").type;
              if (t.get("is_native_link")) t.set("selected", !1);
              else {
                if (e) {
                  if (t.get("amo_link")) return this._redirectToAmo({
                    id: t.get("id"),
                    amo_link: t.get("amo_link")
                  }), void t.set("selected", !1);
                  if (b().contains(["chat_group_create"], i)) return void t.set("selected", !1)
                }
                switch (!0) {
                  case "chat_group" === i:
                  case "chat_group_create" === i:
                  case "chat_direct" === i:
                    this.openChat(t.toJSON());
                    break;
                  case !b().isUndefined(t.get("web_link")):
                    t.set("selected", !1)
                }
              }
            }
          },
          _redirectToAmo: function(t) {
            var e = t.amo_link;
            q.amo_window.open(e)
          },
          onWindowKeyDown: function(t) {
            this.directChatOpening || (t === U.default.ENTER && this.notifications.select(), t === U.default.ARROW_DOWN && this.notifications.preselect(1), t === U.default.ARROW_UP && this.notifications.preselect(-1), b().contains([U.default.ENTER, U.default.ARROW_DOWN, U.default.ARROW_UP], t) && this.hide())
          },
          hide: function() {
            var t = b().propertyOf(this)(["search", "filter"]);
            t && b().isFunction(t.hide) && t.hide(), this.current_mode === U.default.MODE_ONLY_SUPPORT && (this.current_mode = U.default.MODE_NORMAL, L.default.toggleLeftMenu(), this.search && this.search.enableSearch(), this.resetFilter()), this.multiactionClose()
          },
          initSearch: function(t) {
            return $((function() {
              var e, n;
              return Q(this, (function(o) {
                switch (o.label) {
                  case 0:
                    return this.search ? [2] : [4, Promise.all([i.e(69148), i.e(15921)]).then(i.bind(i, 115921))];
                  case 1:
                    return e = o.sent(), n = e.default, this.search = this._addComponent(n, b().extend({
                      el: this.el.querySelector(".search-container-wrapper"),
                      getPresets: b().bind(this.requestPresets, this),
                      onCloseChat: b().bind((function() {
                        this.opened_direct_chat && "create_group" === this.opened_direct_chat.id && this.opened_direct_chat.trigger("onClosed")
                      }), this),
                      onFilterItems: b().bind((function(t) {
                        this.data = [], this.showLoading(), this.multiactionClose(), this.loadData(t)
                      }), this),
                      onTermIsValid: b().bind((function() {
                        this.loader && this._destroyComponent(this.loader)
                      }), this),
                      onTermIsInvalid: b().bind((function() {
                        this.autoloadContent()
                      }), this),
                      startClickDown: b().bind(this.onWindowKeyDown, this),
                      onFilterToggle: b().bind((function(t) {
                        this.$el.toggleClass("inbox-filter_open", t)
                      }), this)
                    }, t || {})), [2]
                }
              }))
            })).apply(this)
          },
          getFilterOptions: function() {
            if (this.search) return this.search.getFilterOptions()
          },
          getFilterSource: function() {
            if (this.search) return this.search.getFilterSource()
          },
          fulfillItemCustomAction: function(t) {
            return $((function() {
              var e, n, o, a, s, r, c, d, u, f, _, h, p, b;
              return Q(this, (function(m) {
                switch (m.label) {
                  case 0:
                    return [4, Promise.all([i.e(93204).then(i.bind(i, 893204)), i.e(82994).then(i.bind(i, 382994)), i.e(69494).then(i.bind(i, 369494)), i.e(71629).then(i.bind(i, 671629)), i.e(61954).then(i.bind(i, 361954)), i.e(78939).then(i.bind(i, 178939))])];
                  case 1:
                    switch (e = Z.apply(void 0, [m.sent(), 6]), n = e[0], o = n.default, a = e[1], s = a.default, r = e[2], c = r.default, d = e[3], u = d.default, f = e[4], _ = f.default, h = e[5], p = h.default, b = (0, I.isExpired)(), t) {
                      case s:
                        l().publish(o, !0), this.hide();
                        break;
                      case u:
                        l().publish(c, !0), this.hide();
                        break;
                      case _:
                        if (b) {
                          APP.router.navigate("/settings/pay/", {
                            trigger: !0
                          });
                          break
                        }
                        l().publish(p, !0), this.hide()
                    }
                    return [2]
                }
              }))
            })).apply(this)
          },
          firstApply: function() {
            var t = b().min(this.presets, "sort").payload,
              e = {};
            this.current_mode === U.default.MODE_ONLY_SUPPORT ? e.provider = [(0, M.getSupportBotId)()] : b().each(t, b().bind(this.firstApplyMutator, this, e)), this.apply({
              is_first: !0,
              first_preset_data: e
            })
          },
          firstApplyMutator: function(t, e, i) {
            switch (i) {
              case "is_read[]":
                if (b().isArray(e)) return;
                break;
              case "filter[date_preset]":
                return void(b().isEmpty(e) || (t.updated_at || (t.updated_at = {}), t.updated_at = (0, K.default)(e)));
              case "updated_at_from":
              case "updated_at_to":
                return void(b().isEmpty(e) || (t.updated_at || (t.updated_at = {}), "updated_at_from" === i ? t.updated_at.from = c()(e, APP.system.format.date.date).format("X") : t.updated_at.to = c()(e, APP.system.format.date.date).set({
                  hours: 23,
                  minutes: 59,
                  second: 59
                }).format("X")))
            }
            b().isEmpty(e) || (t[i.replace("[]", "")] = e)
          },
          show: function() {
            return $((function() {
              return Q(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return [4, Promise.all([this.initSearch(), this.initMultiaction()])];
                  case 1:
                    return t.sent(), this.firstApply(), this.search ? [4, this.search.initFilter()] : [3, 3];
                  case 2:
                    t.sent(), t.label = 3;
                  case 3:
                    return this.filter_deferred.resolve(), [2]
                }
              }))
            })).apply(this)
          },
          initSound: function() {
            return $((function() {
              var t, e;
              return Q(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return this.sound ? [2] : [4, i.e(20155).then(i.bind(i, 320155))];
                  case 1:
                    return t = n.sent(), e = t.default, this.sound = this._addComponent(e, {
                      el: this._elem("sound_toggler").get(0),
                      storage_id: this.sound_id
                    }), [2]
                }
              }))
            })).apply(this)
          },
          onSocketReconnectSynchronize: function() {
            if ((arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).status === x.SOCKET_STATE.CONNECTED) {
              var t = this._elem("search_input").val(),
                e = this.notifications.findWhere({
                  selected: !0
                });
              e && this.reconnectOpenedChat(e), t ? this.search.filter.filterItems(t) : this.resetFilter(), G.update()
            }
          },
          resetFilter: function() {
            var t;
            this.data = [], this.showLoading(), (null === (t = this.search) || void 0 === t ? void 0 : t.filter) && this.loadData({
              reset: !0
            })
          },
          reconnectOpenedChat: function(t) {
            return $((function() {
              var e;
              return Q(this, (function(i) {
                switch (i.label) {
                  case 0:
                    return [4, this._getChatView(t.attributes)];
                  case 1:
                    return e = i.sent(), this.opened_direct_chat = this._addComponent(e, this._getChatViewParams(t.attributes)), this.opened_direct_chat.render(), [2]
                }
              }))
            })).apply(this)
          },
          completeTask: function(t, e) {
            return $((function() {
              return Q(this, (function(n) {
                switch (n.label) {
                  case 0:
                    t.preventDefault(), n.label = 1;
                  case 1:
                    return n.trys.push([1, 5, , 6]), [4, (0, T.completeTask)(e)];
                  case 2:
                    return "success" !== n.sent().status ? [3, 4] : [4, i.e(28313).then(i.bind(i, 728313))];
                  case 3:
                    new(0, n.sent().default)({
                      id: e.id,
                      noreload: !0
                    }), n.label = 4;
                  case 4:
                    return [3, 6];
                  case 5:
                    return n.sent(), [3, 6];
                  case 6:
                    return [2]
                }
              }))
            }))()
          },
          processNotificationFetch: function(t, e) {
            return k.default.fetchAction(t, e).then(b().bind((function(t) {
              t._embedded && t._embedded.clear && this.resetFilter()
            }), this))
          },
          processNotificationDelete: function(t) {
            var e = b().reduce(t.ids, (function(t, e) {
              var i = this.getModelByNotificationId(e);
              return "chat_direct" === (i.get("entity") && i.get("entity").type) ? t.concat(i.get("id")) : t
            }), [], this);
            this.processNotificationFetch("delete", t).then(b().bind((function() {
              b().each(e, (function(t) {
                this.addUsersInBuffer(t)
              }), this)
            }), this))
          },
          processMultiaction: function(t, e) {
            "read" === t ? this.readNotification(e) : "delete" === t && this.deleteNotification(e)
          },
          readNotification: function(t) {
            (this.notifications.findWhere({
              notification_id: b().propertyOf(t)(["ids", 0])
            }) || t.choose_all) && this.processNotificationFetch("read", t)
          },
          deleteNotification: function(t) {
            (this.notifications.findWhere({
              notification_id: b().propertyOf(t)(["ids", 0])
            }) || t.choose_all) && (this.confirm_modal = this._addComponent(B.default, {
              class_name: "modal-list",
              decline_text: (0, S.i18n)("No"),
              accept_text: (0, S.i18n)("Yes"),
              button_class: "button-input_blue",
              text: (0, S.i18n)("Are you sure you want to delete?").replace(" #PLACEHOLDER#", ""),
              accept: b().bind((function() {
                this.processNotificationDelete(t), this.confirm_modal.destroy()
              }), this)
            }))
          },
          connect: function() {
            var t = A.default.subscribe(["notifications:".concat(APP.constant("account").id, ":").concat(APP.constant("user").id)]).pipe(f.filter((function(t) {
                return (0, P.hasKeys)(t, ["body", "payload"])
              })), f.map((function(t) {
                return t.body.payload
              })), f.tap({
                next: b().bind((function(t) {
                  this.refreshCounter(t)
                }), this)
              }), f.share()),
              e = t.pipe(f.filter((function(t) {
                return "update" === t.action
              })), f.map((function(t) {
                return t.notifications
              }))),
              i = t.pipe(f.filter((function(t) {
                return "read" === t.action
              })), f.map((function(t) {
                return t.ids
              }))),
              n = t.pipe(f.filter(b().bind((function(t) {
                return t.action === this.getLabelParamName()
              }), this)), f.map((function(t) {
                return {
                  ids: t.ids,
                  label: t.label
                }
              }))),
              o = t.pipe(f.filter((function(t) {
                return "delete" === t.action
              })), f.map((function(t) {
                return t.ids
              })));
            this.socket.add(e.subscribe(b().bind(this.onMessageReceived, this))), this.socket.add(i.subscribe(b().bind(this.onMessageRead, this))), this.socket.add(n.subscribe(b().bind(this.onMessageLabel, this))), this.socket.add(o.subscribe(b().bind(this.onMessageRemove, this))), A.default.onConnectionChange(b().bind(this.onSocketReconnectSynchronize, this))
          },
          read: function(t) {
            var e = this,
              i = (0, O.current)("id"),
              n = b().propertyOf((0, O.get)(i))("group"),
              o = n ? Number(n.split("_")[1]) : null;
            return !b().isNull(this.readable_ids) && this.readable_ids.length > 0 && (this.readable_ids = []), u.from(y.default.checkAuth((function() {
              var i = s().Deferred(),
                n = [s().ajax({
                  type: "POST",
                  url: e.api.read,
                  contentType: "application/json",
                  data: JSON.stringify(b().omit(t, "chat_ids"))
                })];
              return t.chat_ids && t.chat_ids.length && n.push((0, R.readChat)(t.chat_ids, o).toPromise()), Promise.all(n).then((function(t) {
                i.resolve(t[0])
              })), i
            }))).pipe(f.filter((function(t) {
              return (0, P.hasKeys)(t, ["_embedded", "ids"])
            })), f.map(b().bind((function(t) {
              return this.reAskNotification(t._embedded.ids), t._embedded.ids
            }), this)))
          },
          getModelByNotificationId: function(t) {
            return this.notifications.find((function(e) {
              return e.get("notification_id") === t
            }))
          },
          onMessageRead: function(t) {
            var e = [],
              i = [];
            return b().each(t, (function(t) {
              var n = this.getModelByNotificationId(t);
              n ? (n.set("is_read", !0, {
                sort: !1
              }), n.set("first_unanswered_message_at", null, {
                sort: !1
              }), this.filterEntryCheck(n) || (this.notifications.remove(n.id), i.push(t))) : e.push(t)
            }), this), e.length && this.reAskNotification(e), this.notifications.sort(), i
          },
          onMessageLabel: function(t) {
            var e = t.ids,
              i = t.label,
              n = [];
            b().each(e, (function(t) {
              var e = this.getModelByNotificationId(t);
              e ? (e.set(this.getLabelParamName(), i, {
                sort: !1
              }), this.filterEntryCheck(e) || this.notifications.remove(e.id)) : n.push(t)
            }), this), n.length && this.reAskNotification(n), this.notifications.sort()
          },
          reAskNotification: function(t) {
            return s().ajax({
              url: this.api.list,
              data: {
                filter: {
                  id: t
                }
              }
            }).then(b().bind((function(t) {
              b().propertyOf(t)(["_embedded", "items"]) && b().each(t._embedded.items, b().bind((function(t) {
                var e;
                "chat_direct" === b().propertyOf(t)(["entity", "type"]) ? (e = this.notifications.get(t.id), this.notifications.remove(e ? t.id : t.entity.id)) : this.notifications.remove(t.id), this.createNotificationModel(t), this.notifications.sort()
              }), this))
            }), this))
          },
          onMessageRemove: function(t) {
            var e = this;
            return b().reduce(t, (function(t, i) {
              var n = e.getModelByNotificationId(i);
              return n ? (e.notifications.remove(n.get("id")), t.concat(i)) : t
            }), [])
          },
          onMessageReceived: function(t) {
            var e;
            b().each(t, b().bind((function(t) {
              var i = new(0, this.notifications.model)(t);
              !1 === (t = i.toJSON()).is_read && (this.readTypes(t), this.readable_ids.length > 0 && this.inbox_fully_opened && this.read({
                id: this.readable_ids
              }), e = b().reduce(this.readers, (function(e, i) {
                return b().extend(e, i(t))
              }), {}), b().isEmpty(e) || this.read(e)), this.current_state !== U.default.STATE_SHOW_CONTENT || this.search.filter_is_active || this.addNotification(i, {
                merge: !0
              }), t.silent || this.disableNotificationEntryCheck(i) || this.showNotification(t), this._checkChatCreated(t)
            }), this))
          },
          disableNotificationEntryCheck: function(t) {
            return this.excludeTypeEntryCheck(t)
          },
          showNotification: function(t) {
            return $((function() {
              return Q(this, (function(e) {
                switch (e.label) {
                  case 0:
                    return [4, this.initSound()];
                  case 1:
                    return e.sent(), this.sound.playSoundMessage(), g().hidden() ? this.showPushNotification(t) : this.didNotifyAllowed(t) && this.showInternalNotification(t), [2]
                }
              }))
            })).apply(this)
          },
          showInternalNotification: b().debounce((tt = $((function(t) {
            var e, n, o, a, r, c;
            return Q(this, (function(d) {
              switch (d.label) {
                case 0:
                  e = this.notifications.model, n = new e(t), (t = n.toJSON()).notification = !0, d.label = 1;
                case 1:
                  return d.trys.push([1, 3, , 4]), [4, Promise.all([i.e(14570).then(i.bind(i, 14570)), h()._preload(["/tmpl/inbox/message.twig"])()])];
                case 2:
                  return o = Z.apply(void 0, [d.sent(), 1]), a = o[0], (r = a.default).subscribe((function() {
                    C.default.execCallbacks(t)
                  })), r.create(h()({
                    ref: "/tmpl/inbox/message.twig"
                  }).render(t), function(t) {
                    for (var e = 1; e < arguments.length; e++) {
                      var i = null != arguments[e] ? arguments[e] : {},
                        n = Object.keys(i);
                      "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(i).filter((function(t) {
                        return Object.getOwnPropertyDescriptor(i, t).enumerable
                      })))), n.forEach((function(e) {
                        J(t, e, i[e])
                      }))
                    }
                    return t
                  }({
                    containerId: this._selector("toast_container"),
                    toastClass: "popup-inbox",
                    closeHtml: '<img class="popup-inbox__close" src="/frontend/images/interface/inbox/close_notification.svg">',
                    closeButton: !0,
                    onclick: b().bind((function(t) {
                      this.addNotification(n, {
                        merge: !0
                      }), t.currentTarget = s()(t.currentTarget).children(this._selector("item")).get(0), this.onSelectItemClick(t, {
                        trigger: !0
                      })
                    }), this)
                  }, t.toast_options)), [3, 4];
                case 3:
                  throw c = d.sent(), new Error(c);
                case 4:
                  return [2]
              }
            }))
          })), function(t) {
            return tt.apply(this, arguments)
          }), 100),
          _isPushSupported: function() {
            return "Notification" in window
          },
          _isPushAllowed: function() {
            return "granted" === nt
          },
          requestPushPermission: function() {
            !it && this._isPushSupported() && Notification && Notification.requestPermission && (Notification.requestPermission(b().bind((function(t) {
              nt = t, this._$document.trigger("notification:request:permission", t)
            }), this)), it = !0)
          },
          showPushNotification: function(t) {
            var e, i = "";
            if (this._isPushSupported() && this._isPushAllowed()) {
              var n;
              t.body && (t.body.preview ? i = t.body.preview : b().each(t.body.rows, (function(t) {
                i += t.text
              })));
              var o = null !== (n = null === (e = t.click) || void 0 === e ? void 0 : e.value) && void 0 !== n ? n : "".concat(t.notification_id, ": ").concat(t.created_at),
                a = new Notification((0, S.stripTags)(t.body.title), {
                  lang: APP.lang_id,
                  body: (0, S.stripTags)(i),
                  icon: (0, P.hasKeys)(t, ["body", "icon", "value"]) ? t.body.icon.value : "",
                  tag: o
                });
              a.onclick = b().bind((function() {
                this.focusWindow(), this.onPushNotificationClick(t), a.close()
              }), this), a.onshow = b().bind((function() {
                this.push_hide_timers[o] && clearTimeout(this.push_hide_timers[o]), this.push_hide_timers[o] = b().delay((function() {
                  a.close()
                }), 1e4)
              }), this), a.onerror = b().noop, a.onclose = b().bind((function() {
                this.push_hide_timers[o] && clearTimeout(this.push_hide_timers[o])
              }), this)
            }
          },
          onPushNotificationClick: function(t) {
            var e, i = (t.click || {}).type;
            if (!t.is_native_link)
              if (t.amo_link) this._redirectToAmo({
                id: t.id,
                amo_link: t.amo_link
              });
              else switch (i) {
                case "chat_direct":
                case "chat_group":
                  this.openChat(t), this.scrollToTop();
                  break;
                default:
                  t.web_link && (this.focusWindow(), "/" === t.web_link[0] || /^(https?:\/\/)?([0-9a-z\-.]{1,})(\.amocrm\.(ru|com)|\.amocrm2\.saas).*/i.test(t.web_link) ? APP.router.navigate(t.web_link, {
                    trigger: !0
                  }) : ((e = window.open()).opener = null, e.location = t.web_link))
              }
          },
          focusWindow: function() {
            window.focus()
          },
          afterFirstLoad: function() {
            return this.apply_deferred
          },
          afterFilterInit: function() {
            return this.filter_deferred
          },
          apply: function(t) {
            var e = s().Deferred(),
              i = this;
            switch (this.no_content && this.loadData({
                reset: !0
              }).then((function() {
                for (var t = arguments.length, n = new Array(t), o = 0; o < t; o++) n[o] = arguments[o];
                e.resolve.apply(null, n), i.apply_deferred.resolve.apply(null, n)
              })), this.current_state) {
              case U.default.STATE_ONLY_SUPPORT:
              case U.default.STATE_UNINITIALIZED:
              case U.default.STATE_SHOW_ERROR:
                this.loadData({
                  reset: !0,
                  is_init: t.is_first,
                  init_data: t.first_preset_data
                }).then((function() {
                  e.resolve(), i.apply_deferred.resolve()
                }));
                break;
              default:
                e.resolve(), this.apply_deferred.resolve()
            }
            return e
          },
          showError: b().noop,
          showContent: function(t) {
            this.current_state = U.default.STATE_SHOW_CONTENT, t.length > 0 && b().each(t, (function(t) {
              this.addNotification(t)
            }), this)
          },
          loadData: function(t) {
            var e = this;
            return new Promise((function(i, n) {
              h()._preload(["/tmpl/inbox/direct_chat/item.twig", "stylesheets/_chunks/cards.css"])().then((function() {
                e._loadData(t).then(i, n)
              }))
            }))
          },
          _loadData: function(t) {
            var e = this,
              i = s().Deferred();
            return t = t || {}, this.search && (t = b().extend(t, this.search.fetch_options), this.notifications.setOrder(this.search.order), t.is_init ? t.filter = t.init_data : t.filter = this.search.filter.getFilterState(), t.order = this.search.order), !t.reset && (this.current_state === U.default.STATE_SHOW_LOADING || this.source_loader.isFinished() && b().isEmpty(t.filter) && !t.from_create) ? i.resolve() : (t.onFetchResponse || (t.onFetchResponse = function(t) {
              e.refreshCounter(t)
            }), this.current_state = U.default.STATE_SHOW_LOADING, t.reset && (this.showLoading(), this.notifications.reset()), this.source_loader.onNewOption(t, b().bind((function(t) {
              this.no_content = t
            }), this), i), this.opened_direct_chat && t.from_create && this.opened_direct_chat.trigger("chatsFetched"), i.promise())
          },
          readTypes: function(t) {
            !1 !== t.is_read || t.body.actions && t.body.actions.click && !t.body.actions.read_on_show || this.readable_ids.push(t.notification_id)
          },
          createNotificationModel: function(t) {
            var e = new(0, this.notifications.model)(t);
            this.readTypes(e.attributes), this.opened_direct_chat && this.opened_direct_chat.model && e.id.toString() === this.opened_direct_chat.model.id.toString() && (e.set({
              selected: !0
            }, {
              silent: !0
            }), this.opened_direct_chat.model = e), e.get("entity") && parseInt(b().propertyOf(e.get("entity"))("id")) === (0, O.current)("id") || this.addNotification(e, {
              sort: !1
            })
          },
          autoloadContent: function() {
            this.loader = this._addComponent(F.default, {
              element: this._findElem("inbox_container").get(0),
              throttle: 300,
              conditions: {
                "max-bottom": 1168
              },
              onLoadMore: b().bind(this.loadData, this)
            })
          },
          requestBadge: function() {
            var t = this;
            return this.badge = G.listen(this.badge_id).subscribe((function(e) {
              t.refreshCounter(e)
            })), s().Deferred().resolve()
          },
          getCounterEl: function() {
            return s()(".inbox-counter")
          },
          refreshCounter: function(t) {
            var e = t[this.badge_id],
              i = this.getCounterEl();
            b().isUndefined(e) || (parseInt(e) > 0 ? i.text(e).removeClass("hidden") : i.text(0).addClass("hidden"))
          },
          requestPresets: function() {
            var t = s().Deferred();
            return null === this.presets ? (0, v.onPageFullyLoaded)(b().bind((function() {
              s().ajax("/v3/inbox/filter/presets").done(b().bind((function(e) {
                var i = e || {};
                return this.presets = i.presets || [], t.resolve(this.presets), this.presets
              }), this)).fail(t.reject)
            }), this)) : t.resolve(this.presets), t.promise()
          },
          showLoading: function() {
            this._toggleClass("loading", "search_container", !0), this._toggleClass("loading", "inbox__spiner", !0), APP.first_load && ((0, E.logPerformanceMetric)({
              type: (0, E.getRealCardPageType)(),
              name: "chatFcp"
            }), (0, D.trackPerformanceMetric)({
              group: D.TrackedMetricGroupName.FCP,
              name: D.TrackedMetricName.CHAT_FCP
            }))
          },
          hideLoading: function() {
            this._toggleClass("loading", "search_container", !1), this._toggleClass("loading", "inbox__spiner", !1), this.trigger("inbox:loaded:fully"), (0, D.trackPerformanceMetric)({
              group: D.TrackedMetricGroupName.TTI,
              name: D.TrackedMetricName.CHAT_TTI
            }), APP.first_load && (0, E.logPerformanceMetric)({
              type: (0, E.getRealCardPageType)(),
              name: "chatTti"
            })
          },
          addNotifyFilter: function(t) {
            var e = this;
            return this.filters.push(t), {
              remove: function() {
                var i = b().indexOf(e.filters, t);
                i > -1 && e.filters.splice(i, 1)
              }
            }
          },
          didNotifyAllowed: function(t) {
            var e = !0;
            return this.filters.forEach((function(i) {
              i(t) || (e = !1)
            })), e
          },
          _isChatAlreadyOpened: function(t) {
            return null !== this.opened_direct_chat && this.opened_direct_chat.getId() === t.toString()
          },
          _getChatView: function(t) {
            return $((function() {
              return Q(this, (function(e) {
                switch (e.label) {
                  case 0:
                    switch (b().propertyOf(t)(["click", "type"])) {
                      case "chat_group":
                        return [3, 1];
                      case "chat_group_create":
                        return [3, 3];
                      case "chat_direct":
                        return [3, 5]
                    }
                    return [3, 5];
                  case 1:
                    return [4, Promise.all([i.e(95882), i.e(41203), i.e(15656), i.e(71928), i.e(35969), i.e(90256), i.e(45701)]).then(i.bind(i, 775416))];
                  case 2:
                    return [2, e.sent().default];
                  case 3:
                    return [4, Promise.all([i.e(95882), i.e(41203), i.e(15656), i.e(71928), i.e(35969), i.e(90256), i.e(58835)]).then(i.bind(i, 586271))];
                  case 4:
                    return [2, e.sent().default];
                  case 5:
                    return [4, Promise.all([i.e(95882), i.e(41203), i.e(15656), i.e(71928), i.e(35969), i.e(90256), i.e(54581), i.e(17014)]).then(i.bind(i, 472033))];
                  case 6:
                    return [2, e.sent().default];
                  case 7:
                    return [2]
                }
              }))
            }))()
          },
          _getChatViewParams: function(t) {
            return {
              id: t.id,
              model: t.notification_id ? this.getModelByNotificationId(t.notification_id) : this.notifications.get(t.id),
              $container: this._getDirectChatContainer()
            }
          },
          _getDirectChatContainer: function() {
            return this._elem("direct_chat_container")
          },
          _toggleDirectChatOpenedState: function(t) {
            this._toggleClass("direct_chat_enabled", this.$el, t)
          },
          _checkChatCreated: function(t) {
            (0, P.hasKeys)(t, ["click", "type"]) && t.click.type === U.default.TYPE_GROUP && null !== this.opened_direct_chat && this.opened_direct_chat.trigger("chatCreated", t)
          },
          openChat: function(t) {
            return $((function() {
              var e, i, n, o, a;
              return Q(this, (function(s) {
                switch (s.label) {
                  case 0:
                    return this.multiactionClose(), this._isChatAlreadyOpened(t.id) ? [2, Promise.reject()] : (this.directChatOpening = !0, [4, this._getChatView(t)]);
                  case 1:
                    return i = s.sent(), n = this._addComponent(i, this._getChatViewParams(t)), o = this.closeDirectChat({
                      is_before_opening: !0
                    }).then(b().bind((function() {
                      return this.opened_direct_chat = n, this.opened_direct_chat.on("onClosed", b().bind(this.closeDirectChat, this)), t.click && "chat_group_create" === t.click.type && (this.opened_direct_chat.on("openChat", b().bind(this.openChat, this)), this.opened_direct_chat.on("fetchData", b().bind(this.loadData, this))), this.directChatOpening = !1, Promise.resolve()
                    }), this)), this._toggleDirectChatOpenedState(!0), e = t.notification_id ? this.getModelByNotificationId(t.notification_id) : this.notifications.get(t.id), a = n.render().then(b().bind((function() {
                      return n.showAnimation(), n.$el.show(), e && e.set({
                        selected: !0
                      }), Promise.resolve()
                    }), this)), [2, Promise.all([a, o])]
                }
              }))
            })).apply(this)
          },
          closeDirectChat: function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              e = s().Deferred();
            return b().isNull(this.opened_direct_chat) || b().isUndefined(this.opened_direct_chat) || (this.opened_direct_chat.trigger("closeDirectChat"), this._toggleDirectChatOpenedState(!1, t), this._toggleClass("chat_create_active", this._elem("chat_create_cross"), !1), this.opened_direct_chat.model && this.opened_direct_chat.model.set({
              selected: !1
            }), this._destroyComponent(this.opened_direct_chat), this._getDirectChatContainer().empty(), this.opened_direct_chat = null), e.resolve(), e.promise()
          },
          destroyQuickActionMenu: function() {
            this.notification_quick_action && (this._destroyComponent(this.notification_quick_action), this.notification_quick_action = null)
          },
          initQuickActionMenu: function(t) {
            return $((function() {
              var e, n;
              return Q(this, (function(o) {
                switch (o.label) {
                  case 0:
                    return [4, i.e(45611).then(i.bind(i, 245611))];
                  case 1:
                    return e = o.sent(), n = e.default, this.notification_quick_action = this._addComponent(n, b().extend({
                      onButtonClick: b().bind(this.processMultiaction, this)
                    }, t)), [2]
                }
              }))
            })).apply(this)
          },
          createGroupChat: function() {
            this.openChat({
              click: {
                type: "chat_group_create"
              },
              id: "create_group",
              entity: {
                id: "create_group"
              }
            })
          },
          getAddModelDirect: function(t) {
            var e, i, n, o = this.notifications.model,
              a = V.default.getRecipient(t);
            return !!a && (a.is_bot ? (i = {
              bot: a.id,
              sub: "chat_direct"
            }, n = {
              chat_bot: a.id
            }) : (i = {
              profile: a.id,
              sub: "chat_direct"
            }, n = {
              chat_direct: a.id
            }), e = new o({
              id: a.id,
              body: {
                title: a.title,
                icon: i,
                actions: {
                  click: n
                }
              },
              last_message: {
                id: 0
              },
              is_read: !0,
              is_bot: !0 === a.is_bot,
              entity: {
                type: "chat_direct",
                id: a.id
              },
              created_at: 0,
              updated_at: 0
            }), this.addNotification(e, {
              merge: !0
            }), e)
          },
          openDirectChat: function(t) {
            var e = this.notifications.get(t);
            this.current_state !== U.default.STATE_UNINITIALIZED && this.current_state !== U.default.STATE_ONLY_SUPPORT ? (e || (e = this.getAddModelDirect(t)), this.openChat(e.attributes)) : this.show().then(b().bind((function() {
              this.openDirectChat(t)
            }), this))
          },
          showOnlySupport: function(t) {
            this.inbox_fully_opened && this.hide(), this.current_mode = U.default.MODE_ONLY_SUPPORT, this.current_state = U.default.STATE_ONLY_SUPPORT, this.search && this.search.disableSearch(), this.openDirectChat(t)
          },
          getLabelParamName: function() {
            return "label"
          }
        });
      o().mixin(rt, X.default);
      const ct = rt;
      var dt = "../build/transpiled/components/base/inbox/base";
      window.define(dt, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([dt])
    },
    567042: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => o
      });
      var n = ["845275ac-22e4-4778-9e9a-3b5d06e9e914", "45e0ff46-eef9-463f-a725-8b97dfd1cca0", "27850382-d297-47ab-a74c-544ee8cc895d", "7da05ed4-4a9d-48a9-a92f-efc81aff9e31", "eed2daac-a9fe-4b47-ab9f-d0ca5c0f17a6", "7691f5d1-d4f7-4466-9ac3-8a316b1557ae", "66396ad3-95f7-477d-bd4e-a596a94087c5", "966d8f59-55bc-4961-be32-f319c176a295", "49ae13e7-b75a-4fc0-9f39-c5c2812dcb34", "da877054-c483-4da2-91f7-2e5aeacbaedf", "b83b697f-1f6c-4726-b36b-a57b6593173b", "be2d1c42-351b-40d0-97b7-5d2e1314b079", "f6cb24c9-8d27-4a96-9720-9efd6af539c1", "de4475bb-73ad-4fe6-a2df-3d2b7cb7cb84"];
      (0, i(500034).isFeatureAvailable)("global_inbox") && n.push("3c9022fd-ac7d-48f4-ad24-7b5121417aa3");
      const o = {
        STATE_UNINITIALIZED: -1,
        STATE_SHOW_CONTENT: 1,
        STATE_SHOW_LOADING: 2,
        STATE_SHOW_ERROR: 3,
        STATE_ONLY_SUPPORT: 4,
        MODE_NORMAL: 1,
        MODE_ONLY_SUPPORT: 2,
        EVENT_READ: "read",
        EVENT_DELETE: "delete",
        EVENT_NEW: "new",
        LOCAL_STORAGE_KEY: "_amojo_direct",
        PAGE_COUNT: 50,
        ENTER: 13,
        ESC_KEY: 27,
        ENTER_KEY: 13,
        ARROW_DOWN: 40,
        ARROW_UP: 38,
        LEFT_MENU_WIDTH: 65,
        TYPE_DIRECT: "chat_direct",
        TYPE_GROUP: "chat_group",
        SYSTEM_CREATE_GROUP: "group_chat_create",
        AMO_CHATS_GROUP_TYPE: 18,
        FIXED_CORE_PROVIDERS: n,
        EMOTION_FILTER_NAME: "emotion",
        EMOTIONS: {
          NEUTRAL: "NEUTRAL",
          NEGATIVE: "NEGATIVE",
          POSITIVE: "POSITIVE"
        }
      };
      var a = "../build/transpiled/components/base/inbox/constants";
      window.define(a, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([a])
    },
    628193: (t, e, i) => {
      i.r(e), i.d(e, {
        getMessagePreviewFromInboxData: () => o
      });
      var n = i(445368),
        o = function(t) {
          var e, i = t.data,
            o = t.currentUser;
          if (!i || !o || !i.last_message) return "";
          var a = i.last_message,
            s = a.id,
            r = a.author,
            c = a.text,
            d = o.id === s,
            l = (0, n.i18n)("You"),
            u = r === (null === (e = i.contact) || void 0 === e ? void 0 : e.name);
          return d ? "".concat(l || "", ": ").concat(c) : u ? c : r ? "".concat(r, ": ").concat(c) : "...:".concat(c)
        }
    },
    216105: (t, e, i) => {
      i.r(e), i.d(e, {
        getMessagePreviewFromInboxData: () => n.getMessagePreviewFromInboxData
      });
      var n = i(628193)
    },
    371596: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => j
      });
      var n = i(629133),
        o = i.n(n),
        a = i(949137),
        s = i.n(a),
        r = i(460159),
        c = i.n(r),
        d = i(331542),
        l = i.n(d),
        u = i(827378),
        f = i.n(u),
        _ = i(567952),
        h = i.n(_),
        p = i(564638),
        b = i(445368),
        m = i(214558),
        g = i(500034),
        v = i(204141),
        y = i(230774),
        w = i(231102),
        E = i(504783),
        k = i(981837),
        x = i(590717),
        A = i(567042),
        T = i(937585),
        C = i(141963),
        N = i(216105),
        O = i(661533),
        S = {},
        P = [],
        I = {},
        D = [],
        R = {},
        M = [],
        L = function() {
          return s().apply(this, arguments)
        };
      (L.prototype = Object.create(s().prototype)).getRowOffset = function() {
        var t;
        try {
          t = s().prototype.getRowOffset.apply(this, arguments)
        } catch (e) {
          t = 0
        }
        return t
      }, L.prototype.destroy = function(t) {
        this.container.removeEventListener("scroll", this.handleScroll), t && (this.container.innerHTML = ""), R = {}, M = []
      };
      var F = (0, g.isFeatureAvailable)(g.Features.B2C_INBOX_CARD) && (0, g.isFeatureAvailable)(g.Features.GLOBAL_INBOX),
        B = function(t) {
          var e = this.notifications.at(t);
          return e && this._items_heights_cached[e.id] ? this._items_heights_cached[e.id] : 64
        },
        U = function(t) {
          var e, i = this.notifications.at(t),
            n = document.createElement("DIV");
          if (!i || !i.id) return n;
          var a, s, r = i.toJSON();
          r.label = i.get(this.getLabelParamName()), (0, g.isFeatureAvailable)(g.Features.EMOTION_DETECTOR_AVAILABLE) && (0, g.isFeatureAvailable)(g.Features.IS_EMOTION_DETECTOR_ENABLED) && (r.is_emotion_detector_enabled = !0, r.emotionDisplay = r.emotion === A.default.EMOTIONS.NEUTRAL ? (null === (a = R[i.id]) || void 0 === a ? void 0 : a.toLowerCase()) || A.default.EMOTIONS.NEGATIVE : null === (s = r.emotion) || void 0 === s ? void 0 : s.toLowerCase());
          var d, u, _, p, M, L = 0,
            B = "",
            U = {
              data: r,
              twig: c(),
              isUserOnline: (0, m.isUserOnline)(i.id)
            },
            j = o().isUndefined(null === (e = i.attributes) || void 0 === e ? void 0 : e.type),
            W = F && !j;
          switch (!0) {
            case !i:
            case !i.id:
              return n;
            case "amochats_connect_sources" === i.id:
              n.innerHTML = (0, x.default)();
              break;
            case "fake" === i.id && "user_not_found" === i.get("type"):
              n.innerHTML = (0, w.default)(this.no_content_text);
              break;
            case "go-to-add-channel" === i.id:
              n.innerHTML = (0, E.default)({
                id: i.id,
                title: (0, b.i18n)("Add channels"),
                text: (0, b.i18n)("Capture leads from WhatsApp & more!")
              });
              break;
            case "go-to-invite-a-user" === i.id:
              n.innerHTML = (0, E.default)({
                id: i.id,
                title: (0, b.i18n)("Invite team members (Conversation)"),
                text: (0, b.i18n)("Collaborate & sell together")
              });
              break;
            case "files-notification" === i.get("type"):
              n.innerHTML = (0, k.default)(i.attributes);
              break;
            case W:
              var H, V, q, K, G = APP.constant("user"),
                X = h()({
                  data: r,
                  message: (0, N.getMessagePreviewFromInboxData)({
                    data: r,
                    currentUser: G
                  })
                }),
                z = f().createElement(T.B2CNotificationInboxCard, {
                  displayMode: C.CardDisplayMode.CHAT,
                  isNativeLink: Boolean(null === (H = X.data) || void 0 === H ? void 0 : H.isNativeLink),
                  id: X.data.id,
                  isProvider: Boolean(X.data.provider),
                  isTalk: null === (V = X.data.body) || void 0 === V ? void 0 : V.isTalk,
                  isPreselected: Boolean(X.data.preselected),
                  isSelected: Boolean(X.data.selected),
                  isChecked: Boolean(X.data.checked),
                  isRead: Boolean(X.data.isRead),
                  isFavorite: Boolean(X.data.label),
                  amoLink: X.data.amoLink,
                  customActionHash: X.data.customActionHash,
                  webLink: X.data.webLink,
                  absoluteLink: X.data.absoluteLink,
                  typeContact: null === (q = X.data.entity) || void 0 === q ? void 0 : q.type,
                  message: X.message || "",
                  body: X.data.body,
                  contact: X.data.contact,
                  status: X.data.status,
                  updatedAt: X.data.updatedAt,
                  emotion: X.data.emotion,
                  avatar: null === (K = X.data.contact) || void 0 === K ? void 0 : K.profileAvatar
                });
              l().render(z, n);
              break;
            default:
              L = r.id;
              try {
                d = S[L].data === JSON.stringify(r)
              } catch (t) {
                d = !1
              }
              if (o().isUndefined(S[L]) || !d) {
                u = this.is_chats_notification_item_enabled ? (0, y.createChatsNotificationItemTemplate)(U) : (0, v.createNotificationItemTemplate)(U), p = (_ = O(u)).find(".notification-inner__avatar");
                var Y = c()._twig.filter("avatar", r.body.icon.avatar_id);
                B = r.body.icon.value || Y, o().isUndefined(I[B]) && ((M = new Image).onerror = function() {
                  this.onerror = null, this.src = Y, S[L].html = _[0].outerHTML
                }, M.src = B, I[B] = M, D.push(B)), p.append(I[B]), o().isUndefined(S[L]) && P.push(L), S[L] = {
                  html: _[0].outerHTML,
                  data: JSON.stringify(r)
                }
              }(0, g.isFeatureAvailable)(g.Features.IS_EMOTION_DETECTOR_ENABLED) && (S[L].html = this._addEmotionStateClass(S[L].html, i)), n.innerHTML = S[L].html
          }
          return P.length >= 200 && (delete S[P[0]], P.shift()), D.length >= 200 && (delete I[D[0]], D.shift()), n.children[0]
        };
      const j = {
        initialize: function() {
          if (this.$el.length) {
            this.$el.on("click" + this.ns, ".button-scroll", o().bind(this.clickButtonScroll, this));
            var t = this._elem("inbox_container").get(0);
            this._items_heights_cached = {}, this.checkVisibilityOpenChat = o().throttle(o().bind(this._checkVisibilityOpenChat, this), 1e3), this.updateListView = o().throttle(o().bind(this._updateListView, this), 100, {
              leading: !1
            }), this.listView = this._addComponent(L, t, {
              height: t.offsetHeight,
              rowCount: this.notifications.length,
              overscanCount: 3,
              rowHeight: o().bind(B, this),
              renderRow: o().bind(U, this),
              onScroll: o().bind(this.onVirtualizedScroll, this),
              onRowsRendered: o().bind(this.onRowsRendered, this)
            }), this.listenTo(this.notifications, "add", this.onInboxListModify), this.listenTo(this.notifications, "remove", this.onInboxListModify), this.listenTo(this.notifications, "sort", this.onInboxListModify), this.listenTo(this.notifications, "change", this.onInboxListModify), this.listenTo(this.notifications, "reset", this.updateListView), this.listenTo(this.notifications, "change", this.onChangeUpdateItemHeight), this.listenTo(this.notifications, "change:selected", this.checkVisibilityOpenChat), this.listenTo(this.notifications, "change:preselected", o().bind(this.scrollToActiveItem, this, {
              preselected: !0
            })), this._$window.on("resize" + this.ns, o().throttle(o().bind(this.onVirtualizedResize, this), p.WINDOW_RESIZE_THROTTLE_DELAY))
          }
        },
        onVirtualizedResize: function() {
          this.listView && this._elem("inbox_container").is(":visible") && this.listView.resize(this._elem("inbox_container").get(0).offsetHeight)
        },
        onVirtualizedScroll: function() {
          this.onVirtualizedListScroll.apply(this, arguments), this.checkVisibilityOpenChat()
        },
        clickButtonScroll: function() {
          this.scrollToActiveItem({
            selected: !0
          }), this.checkVisibilityOpenChat()
        },
        _checkVisibilityOpenChat: function() {
          var t = this.notifications.indexOf(this.notifications.findWhere({
              selected: !0
            })),
            e = !1,
            i = this.listView._sizeAndPositionManager.getVisibleRange({
              containerSize: this.listView.state.height,
              offset: this.listView.state.offset,
              overscanCount: 0
            }),
            n = t > i.stop;
          t > -1 && (e = !0, i.start <= t && i.stop >= t && (e = !1)), this._findElem("button_scroll").toggleClass("button-scroll_to-bottom", n).toggle(e)
        },
        _updateListView: function() {
          this.listView.setRowCount(this.notifications.length)
        },
        _addEmotionStateClass: function(t, e) {
          var i = O(t),
            n = i.find(".js-notification_emotion");
          if (n) {
            var o = e.get("id"),
              a = e.get("emotion"),
              s = a === A.default.EMOTIONS.NEUTRAL;
            switch (!0) {
              case !s && Boolean(R[o]):
                n.addClass("shown"), n.removeClass("emotion-appear");
                break;
              case !s && Boolean(!R[o]):
                if (n.addClass("emotion-appear"), R[o] = a, M.push(o), M.length > 200) {
                  var r = M.shift();
                  r && delete R[r]
                }
                break;
              case s && Boolean(R[o]):
                n.addClass("emotion-disappear"), delete R[o]
            }
            return i[0].outerHTML
          }
        },
        onInboxListModify: function(t) {
          var e = this.notifications.indexOf(t);
          (!this._visible_start || !this._visible_stop || -1 === e || e >= this._visible_start && e <= this._visible_stop) && this.updateListView()
        },
        onChangeUpdateItemHeight: function(t) {
          o().isEmpty(o().omit(t.changed, "selected", "preselected")) || this.updateItemMeasuredHeight(t)
        },
        updateItemMeasuredHeight: function(t) {
          var e = !1,
            i = document.getElementById("inbox-notification-" + t.id);
          return i && i.offsetHeight && (this._items_heights_cached[t.id] = i.offsetHeight, e = !0), e
        },
        onRowsRendered: function(t) {
          this._visible_stop = t.stopIndex, this._visible_start = t.startIndex, this.setItemsHeights(t)
        },
        setItemsHeights: o().debounce((function(t) {
          for (var e, i = !1, n = t.startIndex; n <= t.stopIndex; n++) {
            var o = this.notifications.at(n);
            o && !this._items_heights_cached[o.id] && (e = this.updateItemMeasuredHeight(o), i || (i = e))
          }
          i && this.updateListView()
        }), 300),
        scrollToActiveItem: function(t) {
          var e = this.notifications.findWhere(t || {
            preselected: !0
          });
          e && this.listView.scrollToIndex(this.notifications.indexOf(e), "center")
        },
        scrollToTop: function() {
          this.listView.scrollToIndex(0)
        }
      }
    },
    590717: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => o
      });
      var n = i(445368);
      const o = function() {
        return '\n    <div class="amochats-connect-sources connect-sources" id="inbox-notification-amochats_connect_sources">\n      <div class="connect-sources__inner">\n        <div class="connect-sources__image"></div>\n\n        <div class="connect-sources__text">\n          '.concat((0, n.i18n)("Connect your channels and pages in social networks as sources and chats from customers will get into imBox in the form of talks"), '\n        </div>\n\n        <div class="connect-sources__list-wrapper">\n          <ul class="connect-sources__list">\n            <li class="connect-sources__item">\n              <button class="connect-sources__btn js-connect-sources-add-base" data-name="telegram" type="button">\n                <svg class="svg-icon svg-inbox--social--telegram-dims">\n                  <use xlink:href="#inbox--social--telegram"></use>\n                </svg>\n                <span>').concat((0, n.i18n)("Connect"), ' Telegram</span>\n              </button>\n            </li>\n            <li class="connect-sources__item">\n              <button class="connect-sources__btn js-connect-sources-add-base" data-name="vk" type="button">\n                <svg class="svg-icon svg-inbox--social--vk-dims">\n                  <use xlink:href="#inbox--social--vk"></use>\n                </svg>\n                <span>').concat((0, n.i18n)("Connect"), ' Vkontakte</span>\n              </button>\n            </li>\n            <li class="connect-sources__item">\n              <button class="connect-sources__btn js-connect-sources-add-widget" data-code="amochats_whatsapp" type="button">\n                <svg class="svg-icon svg-inbox--social--whatsapp-dims">\n                  <use xlink:href="#inbox--social--whatsapp"></use>\n                </svg>\n                <span>').concat((0, n.i18n)("Connect"), ' WhatsApp</span>\n              </button>\n            </li>\n            <li class="connect-sources__item">\n              <button class="connect-sources__btn connect-sources__btn--viber js-connect-sources-add-base" data-name="viber" type="button">\n                <svg class="svg-icon svg-inbox--social--viber-dims">\n                  <use xlink:href="#inbox--social--viber"></use>\n                </svg>\n                <span>').concat((0, n.i18n)("Connect"), " Viber</span>\n              </button>\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  ")
      };
      var a = "../build/transpiled/components/base/inbox/notification_templates/amochats_connect_sources";
      window.define(a, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([a])
    },
    230774: (t, e, i) => {
      i.r(e), i.d(e, {
        createChatsNotificationItemTemplate: () => a
      });
      var n = i(629133),
        o = i.n(n);

      function a(t) {
        var e = o().template('data-id="<%= data.id %>" id="inbox-notification-<%= data.id %>" class="notification notification--talk notification__item <%= data.label ? "notification__item_favirites" : "" %> <%= !data.provider && !data.body.is_talk ? "notification__item_not-multiaction" : "" %> <%= data.checked ? "notification_checked" : "" %> <% if (!data.preselected && !data.is_read) { print("notification__item__unread"); } %> notification-inner <% if (data.preselected) { print("notification-inner_preselected"); } else if (data.selected) { print("notification-inner_selected"); } %>"')(t),
          i = o().template('\n    <% if (data.web_link) { %><a href="<%= data.web_link %>" class="<% if (data.absolute_link) { %>notification-inner__link<% } else { %>notification-inner__navigate-link js-navigate-link<% } %>" <% if (data.absolute_link) { %>target="_blank"<% } %>><% } %>\n\n    <div class="notification-chat__non-select">\n      <div class="<% if (data.body.icon.robot) { %>notification-chat__container-img_bot<% } else { %>notification-chat__container-img<% } %>">\n        <div class="n-avatar notification-inner__avatar <%= data.body.icon.border ? "notification-inner__avatar__border__blue" : "" %>" <% if (!_.isEmpty(data.id)) { %>id="<%= data.id %>"<% } %>></div>\n\n        <% if (data.body.icon.sub == "chat_group") { %>\n          <% var icon_class_name = "group_chat" %>\n        <% } else if (data.body.icon.sub == "error" || data.body.icon.sub == "chat_direct") { %>\n          <% var icon_class_name = false %>\n        <% } else if (data.body.icon.sub == "chat") { %>\n          <% var icon_class_name = "chats" %>\n        <% } else { %>\n          <% var icon_class_name = data.body.icon.sub %>\n        <% } %>\n\n        <% if (icon_class_name) { %>\n          <div class="notification-chat__container-icon">\n            <% if (icon_class_name == "mail") { %>\n              <img class="notification-mail__icon" src="/frontend/images/interface/inbox/icon_notification_mail.png">\n            <% } else if (data.body.icon_origin) { %>\n              <img class="notification-<%= data.body.icon_origin %>__icon" src="<%= data.body.icon_origin %>">\n            <% } else { %>\n              <svg class="svg-icon svg-common--chats-dims"><use xlink:href="#common--<%= icon_class_name %>"></use></svg>\n            <% } %>\n          </div>\n        <% } %>\n      </div>\n    </div>\n\n    <div class="notification-inner__container_text <% if (!data.body.last_message_at && !data.updated_at) { %>notification-inner__container_text--center<% } %>">\n\n    <div class="notification-inner__info_message">\n      <div class="notification-inner__info">\n        <span class="notification-inner__title_message_talk-id <% if (data.status === \'closed\') { %>notification-inner__title_message_talk-id_closed<% } %>" title="A<%= data.id %>">A<%= data.id %></span>\n\n\n        <% if (data.provider || data.body.is_talk) { %>\n          <label class="notification-chat__checkbox control-checkbox">\n            <input type="checkbox" class="js-item-checkbox" name="notify_selected" id="cbx_drop_<%= data.id %>" value="<%= data.id %>" <%= data.checked ? "checked" : "" %>>\n            <span class="control-checkbox__helper"></span>\n          </label>\n\n          <div class="notification-inner__controllers">\n            <svg class="svg-icon js-notification-favorites notification-inner__favorites <% if (data.label) { %>notification-inner__favorites_selected <% } %>svg-inbox--outline-star-dims"><use xlink:href="#inbox--outline-star"></use></svg>\n            <svg class="svg-icon js-notification-quick-action notification-inner__quick-action svg-controls--button-more-dims" style="<%= data.is_quick_action_enabled ? \'\' : \'display: none;\' %>"><use xlink:href="#controls--button-more"></use></svg>\n          </div>\n        <% } %>\n\n        <span class="notification-inner__data_message"><%= twig._twig.filter("feed_date", data.body.last_message_at || data.updated_at) %></span>\n      </div>\n    </div>\n\n    <div class="notification-inner__info_message">\n      <h2 class="notification-inner__title_message">\n        <span class="notification-inner__title_message_title"><%= data.body.__old_type ? data.body.title : _.escape(data.body.title) %></span>\n      </h2>\n    </div>\n\n      <% if (data.body.subtitle) { %>\n        <div class="notification-inner__info_message">\n          <h3 class="notification-inner__title_message"><%= data.body.subtitle %></h3>\n        </div>\n      <% } %>\n\n      <div class="notification-inner__info_message">\n        <div class="notification-inner__info">\n          <span class="notification-inner__from__message <% if (data.opened) { %>notification-inner__from__message-fully-opened<% } %>">\n            <% _.each(data.body.rows, function(line, index) {%>\n              <span class="<%= line.style %> notification-inner__from__message_height-<%= line.class_height %>">\n                <%= data.body.__old_type ? line.text : _.escape(line.text) %>\n\n                <% if (!data.notification && index === data.body.rows.length -1 && _.contains(["h2", "h3"], line.class_height) && !data.disable_more_content_button) { %>\n                  <div class="notification-inner__button_show-more-container" <% if (line.text.length > 100) { %>style="display: block"<% } %>>\n                    <div class="notification-inner__button_show-more">\n                      &#8226;&#8226;&#8226;\n                    </div>\n                  </div>\n                <% } %>\n              </span>\n            <% }); %>\n          </span>\n        </div>\n      </div>\n\n    </div>\n\n    <% if (data.web_link) { %></a><% } %>\n  ')(t);
        return t.data.is_native_link ? '\n      <a href="'.concat(t.data.amo_link, '" ').concat(e, ">\n        ").concat(i, "\n      </a>\n    ") : "\n    <div ".concat(e, ">\n      ").concat(i, "\n    </div>\n  ")
      }
      var s = "../build/transpiled/components/base/inbox/notification_templates/chats_item_template";
      window.define(s, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([s])
    },
    981837: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => c
      });
      var n = i(460159),
        o = i.n(n),
        a = i(629133),
        s = i.n(a),
        r = i(445368);
      const c = function(t) {
        var e, i = t.id,
          n = t.file,
          a = t.extension,
          c = t.updated_at,
          d = t.entityType,
          l = t.entityId,
          u = t.progress,
          f = t.status;
        return e = 100 === u ? "100%" : "error" === f ? '<span style="color: #F37575;">'.concat(u, "</span>") : "".concat((0, r.i18n)("Uploading"), " ").concat(u, "%"), '\n  <div data-id="'.concat(i, '" class="notification__item notification-inner " id="files-notification-').concat(i, '" style="background: var(--palette-notification-unread-background);">\n    <a href="/').concat(d, "/detail/").concat(l, '?tab_id=files" class="notification-inner__navigate-link js-navigate-link">\n      <div class="notification-chat__non-select">\n        <div class="notification-chat__container-img ').concat(100 === u || "error" === f ? "" : "tab-file__item-img-loading", '">\n          ').concat(function(t) {
          return '\n    <svg\n      width="36"\n      height="40"\n      viewBox="0 0 36 40"\n      fill="none"\n      xmlns="http://www.w3.org/2000/svg"\n    >\n    <path\n      fill-rule="evenodd"\n      clip-rule="evenodd"\n      d="M26.2097 1H7C5.89543 1 5 1.89543 5 3V37C5 38.1046 5.89543 39 7 39H33C34.1046 39 35 38.1046 35 37L35 9.5H29.7097C27.7767 9.5 26.2097 7.933 26.2097 6L26.2097 1ZM36 9L36 37C36 38.6569 34.6569 40 33 40H7C5.34315 40 4 38.6569 4 37V3C4 1.34315 5.34315 0 7 0H26.7097L36 9ZM34.0467 8.5L27.2097 1.87667L27.2097 6C27.2097 7.38071 28.329 8.5 29.7097 8.5H34.0467Z"\n      fill="#979797"\n    />\n    />\n      <rect y="25" width="26" height="12" rx="3" fill="#979797" />\n      <text\n        fill="white"\n        xml:space="preserve"\n        font-size="9.5"\n        font-weight="bold"\n        letter-spacing="0.01em"\n        font-family="PT Sans"\n      >\n        <tspan x="3.3" y="34.7">'.concat(t, "</tspan>\n      </text>\n    </svg>\n  ")
        }(a.toUpperCase()), '\n        </div>\n      </div>\n      <div class="notification-inner__container_text ">\n          <div class="notification-inner__info_message">\n            <h2 class="notification-inner__title_message">\n              <span class="notification-inner__title_message_title">').concat(s().escape(n.name), '</span>\n            </h2>\n            <span class="notification-inner__data_message">').concat(o()._twig.filter("feed_date", c), '</span>\n          </div>\n        <span class="notification-inner__from__message ">\n          <span class="default notification-inner__from__message_height-h3">\n            ').concat(e, "\n          </span>\n        </span>\n      </div>\n    </a>\n  </div>\n  ")
      };
      var d = "../build/transpiled/components/base/inbox/notification_templates/file_template";
      window.define(d, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([d])
    },
    504783: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => n
      });
      const n = function(t) {
        var e = t.id,
          i = t.title,
          n = t.text;
        return '\n    <div class="'.concat(["notification-item-go-to-button", "notification-item--".concat(e), "notification__item"].join(" "), '"\n    >\n      <svg class="svg-icon svg-inbox--plus-in-circle-dashed-dims">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#inbox--plus-in-circle-dashed"></use>\n      </svg>\n\n      <div class="notification-item-go-to-button__content">\n        <span class="notification-item-go-to-button__title">\n          ').concat(i, '\n        </span>\n\n        <span class="notification-item-go-to-button__text">\n          ').concat(n, "\n        </span>\n      </div>\n    </div>\n  ")
      };
      var o = "../build/transpiled/components/base/inbox/notification_templates/go_to_add_notification";
      window.define(o, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([o])
    },
    204141: (t, e, i) => {
      i.r(e), i.d(e, {
        createNotificationItemTemplate: () => a
      });
      var n = i(629133),
        o = i.n(n);

      function a(t) {
        var e = o().template('data-id="<%= data.id %>" id="inbox-notification-<%= data.id %>" <% if (data.custom_action_hash) { %>data-custom-action-hash="<%= data.custom_action_hash %>"<% } %> class="notification__item <%= data.label ? "notification__item_favirites" : "" %> <%= !data.provider && !data.body.is_talk ? "notification__item_not-multiaction" : "" %> <%= data.checked ? "notification_checked" : "" %> <% if (!data.preselected && !data.is_read) { print("notification__item__unread"); } %> notification-inner <% if (data.preselected) { print("notification-inner_preselected"); } else if (data.selected) { print("notification-inner_selected"); } %>"')(t),
          i = o().template('\n    <% if (data.web_link) { %><a href="<%= data.web_link %>" class="<% if (data.absolute_link) { %>notification-inner__link<% } else { %>notification-inner__navigate-link js-navigate-link<% } %>" <% if (data.absolute_link) { %>target="_blank"<% } %>><% } %>\n\n    <% if (data.provider || data.body.is_talk) { %>\n      <label class="notification-chat__checkbox control-checkbox">\n        <input type="checkbox" class="js-item-checkbox" name="notify_selected" id="cbx_drop_<%= data.id %>" value="<%= data.id %>" <%= data.checked ? "checked" : "" %>>\n        <span class="control-checkbox__helper"></span>\n      </label>\n\n      <div class="notification-inner__controllers">\n        <svg class="svg-icon js-notification-quick-action notification-inner__quick-action svg-controls--button-more-dims" style="<%= data.is_quick_action_enabled ? \'\' : \'display: none;\' %>"><use xlink:href="#controls--button-more"></use></svg>\n        <svg class="svg-icon js-notification-favorites notification-inner__favorites <% if (data.label) { %>notification-inner__favorites_selected <% } %>svg-inbox--outline-star-dims"><use xlink:href="#inbox--outline-star"></use></svg>\n      </div>\n    <% } %>\n\n    <div class="notification-chat__non-select">\n      <div class="<% if (data.body.icon.robot) { %>notification-chat__container-img_bot<% } else { %>notification-chat__container-img<% } %>">\n        <div class="n-avatar notification-inner__avatar" <% if (!_.isEmpty(data.id)) { %>id="<%= data.id %>"<% } %>></div>\n\n        <% if (data.body.icon.sub == "chat_group") { %>\n          <% var icon_class_name = "group_chat" %>\n        <% } else if (data.body.icon.sub == "error" || data.body.icon.sub == "chat_direct") { %>\n          <% var icon_class_name = false %>\n        <% } else if (data.body.icon.sub == "chat") { %>\n          <% var icon_class_name = "chats" %>\n        <% } else { %>\n          <% var icon_class_name = data.body.icon.sub %>\n        <% } %>\n\n        <% if (icon_class_name) { %>\n          <div class="notification-chat__container-icon">\n            <% if (icon_class_name == "mail") { %>\n              <img class="notification-mail__icon" src="/frontend/images/interface/inbox/icon_notification_mail.png">\n            <% } else if (data.body.icon_origin) { %>\n              <img class="notification-<%= data.body.icon_origin %>__icon" src="<%= data.body.icon_origin %>">\n            <% } else { %>\n              <svg class="svg-icon svg-common--chats-dims"><use xlink:href="#common--<%= icon_class_name %>"></use></svg>\n            <% } %>\n          </div>\n        <% } %>\n      </div>\n    </div>\n\n    <div class="notification-inner__container_text <% if (!data.body.last_message_at && !data.updated_at) { %>notification-inner__container_text--center<% } %>">\n      <% if (data.body.title) { %>\n        <div class="notification-inner__info_message">\n          <h2 class="notification-inner__title_message">\n            <span class="notification-inner__title_message_title"><%= data.body.__old_type ? data.body.title : _.escape(data.body.title) %></span>\n            <% if (data.body.is_talk) { %><span class="notification-inner__title_message_talk-id" title="A<%= data.id %>">A<%= data.id %></span><% } %>\n            <span data-id="<%= data.id ? data.id : "" %>" class="control-user_state <%= isUserOnline ? "control-user_state_online" : "" %>" ></span>\n\n            <% if (data.is_emotion_detector_enabled && data.emotion) { %>\n              <div class="notification-inner__emotion js-notification_emotion" data-id="<%= data.id ? data.id : "" %>">\n                <svg class="notification-inner__emotion__svg">\n                  <use xlink:href="#common--<%= data.emotionDisplay %>"></use>\n                </svg>\n              </div>\n            <% } %>\n          </h2>\n          <span class="notification-inner__data_message"><%= twig._twig.filter("feed_date", data.body.last_message_at || data.updated_at) %></span>\n        </div>\n      <% } %>\n\n      <% if (data.body.subtitle) { %>\n        <div class="notification-inner__info_message">\n          <h3 class="notification-inner__title_message"><%= data.body.subtitle %></h3>\n        </div>\n      <% } %>\n\n      <span class="notification-inner__from__message <% if (data.opened) { %>notification-inner__from__message-fully-opened<% } %>">\n        <% _.each(data.body.rows, function(line, index) {%>\n          <span class="<%= line.style %> notification-inner__from__message_height-<%= line.class_height %>">\n            <%= data.body.__old_type ? line.text : _.escape(line.text) %>\n\n            <% if (!data.notification && index === data.body.rows.length -1 && _.contains(["h2", "h3"], line.class_height) && !data.disable_more_content_button) { %>\n              <div class="notification-inner__button_show-more-container" <% if (data.body.showMoreButton) { %>style="display: block"<% } %>>\n                <div class="notification-inner__button_show-more">\n                  &#8226;&#8226;&#8226;\n                </div>\n              </div>\n            <% } %>\n          </span>\n        <% }); %>\n      </span>\n    </div>\n\n    <% if (data.web_link) { %></a><% } %>\n  ')(t);
        return t.data.is_native_link ? '\n      <a href="'.concat(t.data.amo_link, '" ').concat(e, ">\n        ").concat(i, "\n      </a>\n    ") : "\n    <div ".concat(e, ">\n      ").concat(i, "\n    </div>\n  ")
      }
      var s = "../build/transpiled/components/base/inbox/notification_templates/item_template";
      window.define(s, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([s])
    },
    231102: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => n
      });
      const n = function(t) {
        return '\n    <div class="notification__item notification__user-not-found">\n      <div class="notification__user-not-found-inner">\n        <div class="notification__user-not-found-text">\n          '.concat(t, "\n        </div>\n      </div>\n    </div>\n  ")
      };
      var o = "../build/transpiled/components/base/inbox/notification_templates/user_not_found";
      window.define(o, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([o])
    },
    472450: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => g,
        getInitialSortOrder: () => v
      });
      var n = i(661533),
        o = i.n(n),
        a = i(629133),
        s = i.n(a),
        r = i(313981);

      function c(t, e) {
        for (var i = 0; i < e.length; i++) {
          var n = e[i];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
      }

      function d(t, e, i) {
        return e in t ? Object.defineProperty(t, e, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = i, t
      }

      function l(t, e, i) {
        return l = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, i) {
          var n = function(t, e) {
            for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = u(t)););
            return t
          }(t, e);
          if (n) {
            var o = Object.getOwnPropertyDescriptor(n, e);
            return o.get ? o.get.call(i || t) : o.value
          }
        }, l(t, e, i || t)
      }

      function u(t) {
        return u = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
          return t.__proto__ || Object.getPrototypeOf(t)
        }, u(t)
      }

      function f(t, e) {
        return f = Object.setPrototypeOf || function(t, e) {
          return t.__proto__ = e, t
        }, f(t, e)
      }

      function _(t) {
        var e = function() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
          } catch (t) {
            return !1
          }
        }();
        return function() {
          var i, n = u(t);
          if (e) {
            var o = u(this).constructor;
            i = Reflect.construct(n, arguments, o)
          } else i = n.apply(this, arguments);
          return function(t, e) {
            return !e || "object" != ((i = e) && "undefined" != typeof Symbol && i.constructor === Symbol ? "symbol" : typeof i) && "function" != typeof e ? function(t) {
              if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return t
            }(t) : e;
            var i
          }(this, i)
        }
      }
      var h = "amo_inbox_order",
        p = {
          sort_by: "unread_first",
          sort_type: "false"
        },
        b = {
          sort_by: "unread_first",
          sort_type: "true"
        };

      function m() {
        return "com" === APP.constant("account").top_level_domain ? p : b
      }
      var g = function(t) {
        ! function(t, e) {
          if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
          t.prototype = Object.create(e && e.prototype, {
            constructor: {
              value: t,
              writable: !0,
              configurable: !0
            }
          }), e && f(t, e)
        }(a, t);
        var e, i, n = _(a);

        function a() {
          return function(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
          }(this, a), n.apply(this, arguments)
        }
        return e = a, i = [{
          key: "_classes",
          value: function() {
            return {
              sort_buttons: "js-read-sort",
              selected_sort_option: "search-more__item_active"
            }
          }
        }, {
          key: "_selectors",
          value: function() {
            return {
              selected_sort_by: '.js-read-sort[data-sort-by="%s"][data-sort-type="%s"]'
            }
          }
        }, {
          key: "initialize",
          value: function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            l(u(a.prototype), "initialize", this).apply(this, arguments);
            var e = t.onSelect,
              i = void 0 === e ? s().noop : e,
              n = JSON.parse(localStorage.getItem(h));
            this.onSelect = i, this.order = s().isNull(n) || s().isUndefined(n) ? this._getDefaultSort() : n, s().isBoolean(this.order) && (this.order = this.order ? b : p), this._prepareSort()
          }
        }, {
          key: "events",
          value: function() {
            return {
              "click .js-read-sort": "onOrderChange",
              "click .search-more__item-header": "onSearchMoreItemHeaderClick"
            }
          }
        }, {
          key: "changeStateSort",
          value: function(t) {
            var e = o()(t.currentTarget);
            e.hasClass(this._class("selected_sort_option")) || (this._elem("sort_buttons").removeClass(this._class("selected_sort_option")), e.addClass(this._class("selected_sort_option")), this.order = {
              sort_by: e.attr("data-sort-by"),
              sort_type: e.attr("data-sort-type")
            }, localStorage.setItem(h, JSON.stringify(this.order)))
          }
        }, {
          key: "onOrderChange",
          value: function(t) {
            this.changeStateSort(t), this.onSelect(this.getQueryObject())
          }
        }, {
          key: "_prepareSort",
          value: function() {
            this._findElem("selected_sort_by", this.order.sort_by, this.order.sort_type).addClass(this._class("selected_sort_option"))
          }
        }, {
          key: "_getDefaultSort",
          value: function() {
            return m()
          }
        }, {
          key: "getQueryObject",
          value: function() {
            return d({}, this.order.sort_by, this.order.sort_type)
          }
        }, {
          key: "onSearchMoreItemHeaderClick",
          value: function(t) {
            t.stopPropagation()
          }
        }], i && c(e.prototype, i), a
      }(r.default);

      function v() {
        var t;
        try {
          if (!(t = JSON.parse(localStorage.getItem(h))) || !s().isObject(t)) throw new Error("No sort in LS")
        } catch (e) {
          t = m()
        }
        return d({}, t.sort_by, t.sort_type)
      }
      var y = "../build/transpiled/components/base/inbox/read_sort";
      window.define(y, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([y])
    },
    963154: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => g
      });
      var n = i(629133),
        o = i.n(n),
        a = i(987081),
        s = i(128508),
        r = i(214558),
        c = i(926168),
        d = i(450422),
        l = i(474564),
        u = i(761634),
        f = i(46018),
        _ = i(661533),
        h = (0, r.current)(),
        p = APP.constant("account").amojo_rights,
        b = "",
        m = {
          list: "/v3/inbox/list",
          default_list: "/v3/inbox/list"
        };

      function g(t, e) {
        var i, n, g = function(t, e) {
            return !e || (w = o().omit(w, t), !1)
          },
          v = function(t) {
            var e;
            if (e = (t = t || {}).fetch_local ? (0, r.get)(!0) : w, t.is_filter) return a.from([]);
            var i = a.concat(a.from(p.can_direct ? o().values(e) : []), a.from(o().values((0, u.get)())).pipe(s.filter((function(t) {
              return (0, d.isAmoChatsFullEnabled)() ? "amo.support" === t.code : t.is_direct && ("amo.support" !== t.code || !(0, c.isCustomers)())
            })))).pipe(s.filter((function(e) {
              switch (!0) {
                case t.fetch_local:
                  return t.fetch_local;
                case e.id === h.id:
                  return g(e.id, !0);
                default:
                  return !0
              }
            })), s.map((function(t) {
              var e, i;
              return t.bot ? (e = {
                url: t.avatar
              }, i = {
                chat_bot: t.id
              }) : (e = {
                profile: t.id
              }, i = {
                chat_direct: t.id
              }), {
                entity: {
                  type: "chat_direct",
                  id: t.id
                },
                preview: "text",
                id: t.id.toString(),
                login: t.login,
                created_at: 0,
                updated_at: 0,
                is_bot: !0 === t.bot,
                is_read: !0,
                body: {
                  icon: e,
                  title: t.title,
                  actions: {
                    click: i
                  }
                }
              }
            })));
            return n ? a.concat(i, x.pipe(s.filter((function(t) {
              return !o().isNull(t.entity_id)
            })), s.map((function(t) {
              return {
                entity: {
                  id: t.entity_id.toString(),
                  type: "chat_group"
                },
                is_read: !0,
                web_link: null,
                id: parseInt(t.entity_id),
                created_at: 0,
                updated_at: 0,
                body: {
                  title: t.title,
                  icon: {
                    profile: t.chat_id.toString(),
                    sub: "chat_group"
                  },
                  actions: {
                    click: {
                      chat_group: t.chat_id.toString()
                    }
                  }
                }
              }
            })))).pipe(s.map((function(e) {
              return o().isFunction(t.rate) ? t.rate(e) : e
            })), s.filter((function(t) {
              return t._sorting_rate > 0
            })), s.toArray(), s.map((function(t) {
              return o().sortBy(t, (function(t) {
                return -t._sorting_rate
              }))
            })), s.flatMap((function(t) {
              return a.from(t)
            }))) : i
          },
          y = !0,
          w = (0, r.get)(!0),
          E = {},
          k = e ? {
            list: e,
            default_list: e
          } : o().clone(m),
          x = a.defer((function() {
            return (0, l.getGroupChats)(l.CHAT_GROUP_TYPE)
          })).pipe(s.map((function(t) {
            return t ? t.response.chats.group_list : null
          })), s.shareReplay(1), s.flatMap((function(t) {
            return a.from(o().values(t))
          })));
        return {
          init: function(e) {
            var c;
            (i = new a.Subject).pipe(s.switchMap((function(e) {
              return c = e.deferred,
                function(e, i) {
                  var c;
                  n = (e = e || {}).term && e.term.length > 0;
                  var d = {
                    is_filter: !o().isEmpty(e.filter)
                  };
                  return n && o().extend(d, e, {
                    fetch_local: !0
                  }), e.reset && (y = !0, w = (0, r.get)(!0)), c = n ? v(d) : a.concat(function(e, i) {
                    return a.defer((function() {
                      var n;
                      return y ? ((k.list === k.default_list || e.reset) && (E = {
                        limit: t,
                        order: e.order,
                        filter: e.filter
                      }, p.can_direct || (E.filter || (E.filter = {}), E.filter.exclude = {
                        entity_type: ["chat_direct"]
                      })), n = _.ajaxPromisify({
                        url: e.reset ? k.default_list : k.list,
                        data: E
                      }), a.from(n).pipe(s.map((function(t) {
                        return o().isUndefined(t) ? (y = !1, []) : (o().isFunction(e.onFetchResponse) && e.onFetchResponse(t), k.list = t._links.next ? t._links.next.href : t._links.self.href, b || (b = t._links.next ? t._links.next.href : t._links.self.href), t._embedded.items)
                      })), s.flatMap((function(e) {
                        return e.length < t && (y = !1), a.from(e)
                      })), s.tap({
                        next: function() {
                          o().isFunction(i) && i(!1)
                        },
                        error: function() {
                          return o().isFunction(i) && i(!0), a.from([])
                        }
                      }))) : Promise.reject()
                    }))
                  }(e, i).pipe(s.filter((function(t) {
                    return !t.click || !t.click.type || "chat_direct" !== t.click.type || !!f.default.getRecipient(t.click.values)
                  }))), v(d)).pipe(s.take(t), s.tap({
                    next: function(t) {
                      g(t.id, t.entity && "chat_direct" === t.entity.type)
                    }
                  })), a.onErrorResumeNext(c).pipe(s.toArray())
                }(e.options, e.noContent)
            })), s.catchError((function(t) {
              e({
                error: t
              }, c)
            }))).subscribe((function(t) {
              e({
                items: t
              }, c)
            }))
          },
          onNewOption: function(t, e, n) {
            i.next({
              options: t,
              noContent: e,
              deferred: n
            })
          },
          isFinished: function() {
            return !y && 0 === o().keys(w).length
          },
          addUsersBuffer: function(t) {
            if (0 === o().keys(w).length) return !0;
            var e = (0, r.get)(t);
            return e && !o().isEqual(e, (0, r.get)()) && (w[t] = (0, r.get)(t)), !1
          }
        }
      }
      var v = "../build/transpiled/components/base/inbox/sources";
      window.define(v, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([v])
    },
    46018: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => a
      });
      var n = i(214558),
        o = APP.constant("amojo_bots");
      const a = {
        getRecipient: function(t) {
          var e, i = (0, n.get)(!0);
          return 1 == (parseInt(t).toString() === t.toString()) ? i[t] : {
            id: (e = o[t]).id,
            amojo_id: e.id,
            title: e.name,
            avatar: e.avatar,
            is_bot: !0
          }
        }
      };
      var s = "../build/transpiled/components/base/inbox/users";
      window.define(s, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([s])
    },
    341302: (t, e, i) => {
      i.r(e), i.d(e, {
        amo_window: () => o
      });
      var n = "persistentOpen",
        o = function() {
          var t = null,
            e = null;

          function i(e) {
            t = window.open(e.href)
          }

          function o(i) {
            if (i.source === t) switch (i.data && i.data.method) {
              case "".concat(n).concat(".").concat("resolved"):
                if (!e) break;
                clearTimeout(e), e = null, t && t.focus()
            }
          }
          return window.addEventListener("message", o), {
            open: function(o) {
              if (!e) {
                var a;
                try {
                  a = new URL(o)
                } catch (t) {
                  return void console.error("Can't parse provided url: ".concat(o))
                }
                t && !t.closed ? function(o) {
                  t.postMessage({
                    method: n,
                    payload: {
                      linkDetails: "".concat(o.pathname).concat(o.search)
                    }
                  }, o.origin);
                  var a = setTimeout((function() {
                    i(o), e = null
                  }), 600);
                  e = a
                }(a) : i(a)
              }
            },
            destroy: function() {
              window.removeEventListener("message", o), t = null, clearTimeout(e), e = null
            }
          }
        }(),
        a = "../build/transpiled/components/base/inbox/utils/persistent_window";
      window.define(a, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([a])
    },
    382646: (t, e, i) => {
      i.r(e), i.d(e, {
        default: () => a
      });
      var n = i(161320),
        o = i.n(n);

      function a() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          e = o()().tz(APP.system.timezone).set({
            hours: 0,
            minutes: 0,
            second: 0
          }),
          i = o()().tz(APP.system.timezone).set({
            hours: 23,
            minutes: 59,
            second: 59
          }),
          n = parseInt(o()().tz(APP.system.timezone).quarter()),
          a = parseInt(t.replace("previous_days_", ""));
        if (a > 0) return {
          from: e.subtract(a, "day").format("X"),
          to: i.format("X")
        };
        switch (t) {
          case "today":
          case "current_day":
            return {
              from: e.format("X"), to: i.format("X")
            };
          case "yesterday":
            return {
              from: e.subtract(1, "day").format("X"), to: i.subtract(1, "day").format("X")
            };
          case "current_week":
          case "week":
            return {
              from: e.weekday(0).format("X"), to: i.weekday(6).format("X")
            };
          case "previous_week":
            return {
              from: e.subtract(1, "week").weekday(0).format("X"), to: i.subtract(1, "week").weekday(6).format("X")
            };
          case "current_month":
          case "month":
            return {
              from: e.startOf("month").format("X"), to: i.endOf("month").format("X")
            };
          case "previous_month":
            return {
              from: e.subtract(1, "month").startOf("month").format("X"), to: i.subtract(1, "month").endOf("month").format("X")
            };
          case "current_quarter":
          case "quarter":
            return {
              from: e.startOf("month").month(3 * n - 3).format("X"), to: i.month(3 * n - 1).endOf("month").format("X")
            };
          case "current_year":
            return {
              from: e.startOf("year").format("X"), to: i.endOf("year").format("X")
            }
        }
      }
      var s = "../build/transpiled/components/base/inbox/utils/preset_to_timestamp";
      window.define(s, (function() {
        var t = "undefined",
          i = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return i && i.default || i
      })), window.require([s])
    }
  }
]);
var _global = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
_global.SENTRY_RELEASE = {
    id: "build_2025_10_27_13_57_15"
  },
  function() {
    try {
      var t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
        e = (new Error).stack;
      e && (t._sentryDebugIds = t._sentryDebugIds || {}, t._sentryDebugIds[e] = "a1d84da2-2830-4b0a-b6f3-a0769034c3fc", t._sentryDebugIdIdentifier = "sentry-dbid-a1d84da2-2830-4b0a-b6f3-a0769034c3fc")
    } catch (t) {}
  }();
//# sourceMappingURL=78636.83c5c5722db9a2fd370f.js.map