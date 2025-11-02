"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [32760], {
    695453: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => o
      });
      var r = n(345839),
        a = n.n(r),
        i = n(641228);
      const o = new(a().Collection)([], {
        model: i.Model
      })
    },
    641228: (e, t, n) => {
      n.r(t), n.d(t, {
        Collection: () => m,
        Model: () => g
      });
      var r = n(629133),
        a = n.n(r),
        i = n(345839),
        o = n.n(i),
        u = n(955026),
        s = n(214558),
        c = n(998798),
        l = n(500034),
        f = n(661533),
        d = (0, s.get)("all"),
        p = !a().isUndefined(window.safari);

      function h(e) {
        return d && d[e] && d[e].amo_profile_id || ""
      }
      var y = a().once((function() {
          var e = (0, u.isDev)() ? "https://web.dev.amo.tm" : "https://web.amo.tm",
            t = a().propertyOf(APP.constant("account"));
          if (!t(["amo_messenger", "direct_migrated"])) return a().constant("");
          var n, r = t(["amo_messenger", "amo_id"]),
            i = t(["id"]),
            o = (0, s.current)("id"),
            c = h(o),
            l = (n = o, d && d[n] && d[n].title || ""),
            f = [c, r, i, encodeURIComponent(l)];
          if (f.length !== a().compact(f).length) return a().constant("");
          var p = btoa(f.join("_"));
          return a().bind((function(t) {
            var n = a().propertyOf(t),
              r = n(["id"]),
              i = "",
              o = "";
            switch (n(["click", "type"])) {
              case "chat_direct":
                i = "direct", o = h(r);
                break;
              case "chat_group":
                i = "channel", o = r;
                break;
              default:
                return ""
            }
            return o ? [e, "/", i, "/", o, p ? "?".concat("p", "=").concat(p) : ""].join("") : ""
          }), this)
        })),
        b = o().Model.extend({
          view: null,
          allowed_tags: ["a"],
          constructor: function(e) {
            var t, n, r, i = ["lead", "customer", "contact", "company", "tasks"],
              u = this;
            if (e.notification_id || (e.notification_id = e.id), e.body) {
              if (a().each(e.body.actions, (function(t, n) {
                  a().each(t, (function(t, r, o) {
                    if ("click" === n) {
                      if (Object.keys(o).length > 1 && -1 === a().indexOf(i, r)) return;
                      e[n] = {
                        type: r,
                        value: t
                      }, a().extend(e, this.parseAttributes(e.body.actions[n], n))
                    } else a().isUndefined(e.buttons) && (e.buttons = []), e.buttons[r] || e.buttons.push(a().extend(t, this.parseAttributes(e.body.actions[n][r])))
                  }), this)
                }), this), e.body.icon) switch (!0) {
                case !a().isUndefined(e.body.icon.profile):
                  n = (0, s.get)("all")[e.body.icon.profile], e.body.icon.user_id = n ? n.id : "", e.body.icon.avatar_id = n ? n.id : "", e.body.icon.value = n ? n.avatar : "";
                  break;
                case !a().isUndefined(e.body.icon.bot):
                  n = APP.constant("amojo_bots")[e.body.icon.bot], e.body.icon.value = n ? n.avatar : "/frontend/images/interface/inbox/mesage_bot_avatar.png";
                  break;
                case !a().isUndefined(e.body.icon.robot):
                  t = "error" === e.body.icon.robot ? "error_" : "", e.body.icon.value = "/frontend/images/interface/inbox/".concat(t, "mesage_bot_avatar.png");
                  break;
                case !a().isUndefined(e.body.icon.url):
                  e.body.icon.value = e.body.icon.url;
                  break;
                case !a().isUndefined(e.body.icon.call):
                  e.body.icon.value = "/frontend/images/interface/inbox/notifications_call.svg";
                  break;
                case !a().isUndefined(e.body.icon.auto):
                  e.body.icon.avatar_id = parseInt(e.id, 16)
              }
              e.body.rows && (r = e.body.rows, this.getStyleMessage(r), e.body.__old_type && r.length && a().each(r, (function(e) {
                e.text = a().map(f.parseHTML(e.text), (function(e) {
                  return !e.tagName || a().contains(u.allowed_tags, e.tagName.toLowerCase()) ? e.outerHTML || e.textContent : ""
                })).join("")
              }))), !e.id && e.external_id && (e.id = e.external_id), this.getIconSub(e.body), this._getShowMoreButton(e.body)
            }
            e.amo_link = y()(e), e.is_native_link = Boolean(e.amo_link && p), o().Model.apply(this, arguments)
          },
          _getShowMoreButton: function(e) {
            var t = e.rows,
              n = "",
              r = {
                h3: 57
              };
            a().each(t, (function(i, o) {
              if (n += i.text, o === t.length - 1 && r[i.class_height]) {
                var u = f('<div style="width: 239px; opacity:0; position:absolute">'.concat(a().escape(n), "</div>")).get(0);
                if (u) {
                  document.body.appendChild(u);
                  var s = u.offsetHeight;
                  e.showMoreButton = s > r.h3, u.parentNode === document.body && document.body.removeChild(u)
                }
              }
            }))
          },
          parseAttributes: function(e, t) {
            var n, r = {};
            if ((0, l.isFeatureAvailable)("global_inbox") && (0, c.isChatsInboxEnabled)() && !e.task) switch (!0) {
              case Boolean(e.lead) && Boolean(e.talk_id):
                r.web_link = "/chats/".concat(e.talk_id, "/leads/detail/").concat(e.lead);
                break;
              case Boolean(e.lead):
                r.web_link = (0, c.getChatsMentionsResourceUrl)("leads", e.lead);
                break;
              case Boolean(e.contact) && Boolean(e.talk_id):
                r.web_link = "/chats/".concat(e.talk_id, "/contacts/detail/").concat(e.contact);
                break;
              case Boolean(e.customer) && Boolean(e.talk_id):
                r.web_link = "/chats/".concat(e.talk_id, "/customers/detail/").concat(e.customer);
                break;
              case Boolean(e.customer):
                r.web_link = (0, c.getChatsMentionsResourceUrl)("customers", e.customer);
                break;
              case Boolean(e.chat_direct):
                n = (0, s.get)("all")[e.chat_direct], (r = t ? {
                  click: {
                    type: "chat_direct"
                  }
                } : {
                  type: "chat_direct"
                }).login = n ? n.login : "", r.id = r.user_id = e.chat_direct.toString(), r.web_link = (0, c.getChatsMentionsResourceUrl)(e.chat_direct);
                break;
              case Boolean(e.chat_group):
                (r = t ? {
                  click: {
                    type: "chat_group"
                  }
                } : {
                  type: "chat_group"
                }).id = e.chat_group, r.web_link = (0, c.getChatsMentionsResourceUrl)(e.chat_group);
                break;
              case Boolean(e.url):
                r.web_link = e.url, r.absolute_link = (0, u.isValidUrl)(e.url);
                break;
              case Boolean(e.chat_bot):
                (r = t ? {
                  click: {
                    type: "chat_direct"
                  }
                } : {
                  type: "chat_direct"
                }).id = r.user_id = e.chat_bot.toString(), r.is_bot = !0;
                break;
              case Boolean(e.event):
                var i = e.event;
                "amo:js:action" === i.name && (r.custom_action_hash = a().first(a().values(i.data)))
            } else switch (!0) {
              case !a().isUndefined(e.event):
                r = t ? {
                  click: {
                    type: "event"
                  }
                } : {
                  type: "event"
                };
                break;
              case !a().isUndefined(e.company):
                r.web_link = "/companies/detail/".concat(e.company);
                break;
              case !a().isUndefined(e.customer):
                r.web_link = "/customers/detail/".concat(e.customer);
                break;
              case !a().isUndefined(e.contact):
                r.web_link = "/contacts/detail/".concat(e.contact);
                break;
              case !a().isUndefined(e.lead):
                r.web_link = "/leads/detail/".concat(e.lead);
                break;
              case !a().isUndefined(e.unsorted):
                r.web_link = "/unsorted/detail/".concat(e.unsorted);
                break;
              case !a().isUndefined(e.task):
              case !a().isUndefined(e.tasks):
                r.web_link = "/todo/line/";
                break;
              case !a().isUndefined(e.url):
                r.web_link = e.url, r.absolute_link = (0, u.isValidUrl)(e.url);
                break;
              case !a().isUndefined(e.chat_bot):
                (r = t ? {
                  click: {
                    type: "chat_direct"
                  }
                } : {
                  type: "chat_direct"
                }).id = r.user_id = e.chat_bot.toString(), r.is_bot = !0;
                break;
              case !a().isUndefined(e.chat_direct):
                n = (0, s.get)("all")[e.chat_direct], (r = t ? {
                  click: {
                    type: "chat_direct"
                  }
                } : {
                  type: "chat_direct"
                }).login = n ? n.login : "", r.id = r.user_id = e.chat_direct.toString();
                break;
              case !a().isUndefined(e.chat_group):
                (r = t ? {
                  click: {
                    type: "chat_group"
                  }
                } : {
                  type: "chat_group"
                }).id = e.chat_group
            }
            return r
          },
          getIconSub: function(e) {
            var t = !!e.icon && e.icon.sub;
            t && APP.constant("amojo_origins")[t] && (e.icon_origin = APP.constant("amojo_origins")[t].icon || !1)
          },
          getStyleMessage: function(e) {
            a().chain(e).sortBy((function(e) {
              return e.text.length
            })).reverse().each((function(t, n) {
              switch (e.length) {
                case 1:
                  t.class_height = "h3";
                  break;
                case 2:
                  t.class_height = 0 === n ? "h2" : "h1";
                  break;
                case 3:
                  e[n].class_height = 2 === n ? "h2" : "h1"
              }
            }))
          }
        }),
        v = o().Collection.extend({
          model: b,
          initialize: function() {
            this.listenTo(this, "change:selected", this.onChangeSelected), o().Collection.prototype.initialize.apply(this, arguments)
          },
          preselect: function(e) {
            var t, n = this.findWhere({
              preselected: !0
            });
            switch (n ? n.set("preselected", !1) : n = this.findWhere({
                selected: !0
              }), t = this.indexOf(n) + e, !0) {
              case -1 === t:
              case -2 === t:
                t = 0;
                break;
              case t === this.length:
                t = this.length - 1
            }
            this.at(t).set("preselected", !0)
          },
          select: function() {
            var e = this.findWhere({
              preselected: !0
            });
            e && e.set({
              preselected: !1,
              selected: !0
            })
          },
          setOrder: function(e) {
            this.order_by = e
          },
          sort: function(e) {
            var t, n = this.findWhere({
                selected: !0
              }),
              r = this.indexOf(n);
            return e = e = {}, this.models = this.sortBy(this.comparator, this), n && (t = a().indexOf(this.models, n)) !== r && (this.models.splice(t, 1), this.models.splice(r, 0, n)), e.silent || this.trigger("sort", this, e), this
          },
          comparator: function(e) {
            var t = 1,
              n = e.get("click") ? e.get("click").type : "";
            if (this.order_by) {
              var r = this.order_by.unread_first;
              switch (!0) {
                case !a().isUndefined(r):
                  t = "true" === r && e.get("is_read") ? 1 : 2;
                  break;
                case !a().isUndefined(this.order_by.starred_first):
                  t = e.get("label") ? 2 : 1
              }
            }
            return a().contains(["payment_expired", "payment_overflow", "payment_pay"], n) && (t = 3), -e.get("updated_at") * t
          },
          onChangeSelected: function(e) {
            if (e.get("selected")) {
              var t = a().find(this.without(e), (function(e) {
                  return e.get("selected")
                })),
                n = this.findWhere({
                  preselected: !0
                });
              t && t.set("selected", !1), n && n.set("preselected", !1), this.sort()
            }
          }
        }),
        m = v,
        g = b,
        _ = "../build/transpiled/components/base/inbox/notification_collection";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
    },
    694615: (e, t, n) => {
      n.r(t), n.d(t, {
        ACCESS_TOKEN_URL: () => c,
        default: () => y,
        updateAuthTokens: () => h
      });
      var r = n(629133),
        a = n.n(r),
        i = n(567952),
        o = n.n(i),
        u = n(661533);

      function s(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      var c = "/oauth2/access_token";

      function l(e, t) {
        if (t.responseJSON["invalid-params"]) {
          var n = u("#".concat(e)),
            r = n.children().length;
          a().each(t.responseJSON["invalid-params"], (function(t) {
            if ("captcha" === t.name)
              if (r) n.removeClass("hidden"), APP.recaptcha.reset(n.attr("data-recaptcha-id"));
              else {
                var a = APP.recaptcha.show(e, t.reason.site_key);
                n.attr("data-recaptcha-id", a)
              }
          }))
        }
      }

      function f(e) {
        return u.ajax(a().extend({
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          contentType: "application/json",
          dataType: "json"
        }, e, {
          data: JSON.stringify(e.data)
        }))
      }
      var d, p, h = (d = function() {
        var e;
        return function(e, t) {
          var n, r, a, i, o = {
            label: 0,
            sent: function() {
              if (1 & a[0]) throw a[1];
              return a[1]
            },
            trys: [],
            ops: []
          };
          return i = {
            next: u(0),
            throw: u(1),
            return: u(2)
          }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
            return this
          }), i;

          function u(i) {
            return function(u) {
              return function(i) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; o;) try {
                  if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                  switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                    case 0:
                    case 1:
                      a = i;
                      break;
                    case 4:
                      return o.label++, {
                        value: i[1],
                        done: !1
                      };
                    case 5:
                      o.label++, r = i[1], i = [0];
                      continue;
                    case 7:
                      i = o.ops.pop(), o.trys.pop();
                      continue;
                    default:
                      if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                        o = 0;
                        continue
                      }
                      if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                        o.label = i[1];
                        break
                      }
                      if (6 === i[0] && o.label < a[1]) {
                        o.label = a[1], a = i;
                        break
                      }
                      if (a && o.label < a[2]) {
                        o.label = a[2], o.ops.push(i);
                        break
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue
                  }
                  i = t.call(e, o)
                } catch (e) {
                  i = [6, e], r = 0
                } finally {
                  n = a = 0
                }
                if (5 & i[0]) throw i[1];
                return {
                  value: i[0] ? i[1] : void 0,
                  done: !0
                }
              }([i, u])
            }
          }
        }(this, (function(t) {
          switch (t.label) {
            case 0:
              return [4, u.ajax({
                url: c,
                method: "POST",
                data: {
                  grant_type: "implicit"
                }
              })];
            case 1:
              return e = t.sent(), [2, {
                serverTime: o()(e).serverTime
              }]
          }
        }))
      }, p = function() {
        var e = this,
          t = arguments;
        return new Promise((function(n, r) {
          var a = d.apply(e, t);

          function i(e) {
            s(a, n, r, i, o, "next", e)
          }

          function o(e) {
            s(a, n, r, i, o, "throw", e)
          }
          i(void 0)
        }))
      }, function() {
        return p.apply(this, arguments)
      });
      const y = {
        sendSsoEmail: function(e) {
          return f({
            url: e,
            method: "GET"
          })
        },
        auth: function(e) {
          return u("#error_auth").addClass("hidden"), f({
            url: "/oauth2/authorize",
            data: e
          }).error((function(e) {
            u("#error_auth").removeClass("hidden").text(e.responseJSON.detail), l("recaptcha", e)
          }))
        },
        logout: function() {
          return f({
            url: "/oauth2/revoke",
            method: "DELETE"
          })
        },
        resetPass: function(e) {
          var t = "recaptcha_reset",
            n = u("#".concat(t, " iframe"));
          return n = n.length && grecaptcha ? grecaptcha.getResponse() : "", u(".standart_help_box_na .auth__state").addClass("hidden"), f({
            url: "/ajax/v3/user/reset_password",
            data: {
              login: e,
              "g-recaptcha-response": n
            }
          }).error((function(e) {
            l(t, e)
          }))
        },
        resendCode: function(e) {
          return f({
            url: "/oauth2/otp/resend_code",
            data: e
          }).fail((function(e) {
            l("recaptcha_mfa", e)
          }))
        },
        sendVerificationCode: function(e) {
          return f({
            url: c,
            data: e
          }).fail((function(e) {
            l("recaptcha_mfa", e)
          }))
        },
        otp: function(e) {
          return f({
            url: "/oauth2/otp",
            data: e
          }).fail((function(e) {
            l("recaptcha_mfa", e)
          }))
        }
      };
      var b = "../build/transpiled/core/auth/network";
      window.define(b, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([b])
    },
    990703: (e, t, n) => {
      n.r(t), n.d(t, {
        updateCoreTokens: () => r.updateCoreTokens
      });
      var r = n(752310),
        a = "../build/transpiled/core/auth/updateCoreTokens";
      window.define(a, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([a])
    },
    752310: (e, t, n) => {
      n.r(t), n.d(t, {
        updateCoreTokens: () => s
      });
      var r = n(694615);

      function a(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      var i, o, u = null,
        s = (i = function() {
          return function(e, t) {
            var n, r, a, i, o = {
              label: 0,
              sent: function() {
                if (1 & a[0]) throw a[1];
                return a[1]
              },
              trys: [],
              ops: []
            };
            return i = {
              next: u(0),
              throw: u(1),
              return: u(2)
            }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
              return this
            }), i;

            function u(i) {
              return function(u) {
                return function(i) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; o;) try {
                    if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                    switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                      case 0:
                      case 1:
                        a = i;
                        break;
                      case 4:
                        return o.label++, {
                          value: i[1],
                          done: !1
                        };
                      case 5:
                        o.label++, r = i[1], i = [0];
                        continue;
                      case 7:
                        i = o.ops.pop(), o.trys.pop();
                        continue;
                      default:
                        if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                          o = 0;
                          continue
                        }
                        if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                          o.label = i[1];
                          break
                        }
                        if (6 === i[0] && o.label < a[1]) {
                          o.label = a[1], a = i;
                          break
                        }
                        if (a && o.label < a[2]) {
                          o.label = a[2], o.ops.push(i);
                          break
                        }
                        a[2] && o.ops.pop(), o.trys.pop();
                        continue
                    }
                    i = t.call(e, o)
                  } catch (e) {
                    i = [6, e], r = 0
                  } finally {
                    n = a = 0
                  }
                  if (5 & i[0]) throw i[1];
                  return {
                    value: i[0] ? i[1] : void 0,
                    done: !0
                  }
                }([i, u])
              }
            }
          }(this, (function(e) {
            switch (e.label) {
              case 0:
                return u ? [4, u] : [3, 2];
              case 1:
              case 3:
                return [2, e.sent()];
              case 2:
                return e.trys.push([2, , 4, 5]), [4, u = (0, r.updateAuthTokens)()];
              case 4:
                return u = null, [7];
              case 5:
                return [2]
            }
          }))
        }, o = function() {
          var e = this,
            t = arguments;
          return new Promise((function(n, r) {
            var o = i.apply(e, t);

            function u(e) {
              a(o, n, r, u, s, "next", e)
            }

            function s(e) {
              a(o, n, r, u, s, "throw", e)
            }
            u(void 0)
          }))
        }, function() {
          return o.apply(this, arguments)
        })
    },
    471435: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => i
      });
      var r = APP.constant("user");

      function a(e, t, n, r) {
        this.expiredAt = n || 0, this.refreshToken = t, this.token = e, this.user = r
      }
      a.fromJSON = function(e) {
        var t;
        try {
          t = JSON.parse(e)
        } catch (e) {
          t = {}
        }
        return new a(t.token, t.refreshToken, t.expiredAt, t.user)
      }, a.prototype = {
        expiredAt: 0,
        token: "",
        refreshToken: "",
        user: 0,
        expired: function() {
          return 1e3 * this.expiredAt < (new Date).getTime()
        },
        expiresInDays: function() {
          return (1e3 * this.expiredAt - (new Date).getTime()) / 864e5
        },
        getReasonInvalid: function() {
          return {
            isExpired: this.expired(),
            availableAccess: this.token.length > 0,
            availableRefresh: this.refreshToken.length > 0,
            user: this.user,
            isValidUser: this.user.toString() === r.id.toString()
          }
        },
        valid: function() {
          return this.expiredAt > 0 && !this.expired() && this.token.length > 0 && this.refreshToken.length > 0 && this.user.toString() === r.id.toString()
        },
        toString: function() {
          return JSON.stringify(this)
        }
      };
      const i = a;
      var o = "../build/transpiled/interface/amojo/access_token";
      window.define(o, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([o])
    },
    474564: (e, t, n) => {
      n.r(t), n.d(t, {
        CHAT_DIRECT: () => P,
        CHAT_EXTERNAL: () => E,
        CHAT_EXTERNAL_INT: () => S,
        CHAT_GROUP: () => k,
        CHAT_GROUP_TYPE: () => O,
        CHAT_INTERNAL: () => w,
        CHAT_INTERNAL_INT: () => T,
        CHAT_WRITE_FIRST: () => A,
        addUsersToChat: () => $,
        connectBot: () => Q,
        createChat: () => Y,
        deleteFile: () => D,
        disableChannel: () => le,
        downloadFile: () => N,
        fetchMessages: () => V,
        fetchMessagesById: () => X,
        getChat: () => ne,
        getChatsStat: () => H,
        getFile: () => F,
        getGroupChats: () => re,
        getLinks: () => K,
        getSalesbots: () => se,
        getTemplates: () => oe,
        initChannel: () => ce,
        readChat: () => z,
        removeUsersFromChat: () => Z,
        rtmStart: () => ee,
        sendFile: () => B,
        sendMessage: () => J,
        sendMessagev1: () => q,
        sendReaction: () => G,
        sendTyping: () => W,
        transcribeMessage: () => te,
        updateAutoClose: () => C,
        updateGroupChat: () => ae,
        uploadFile: () => R,
        uploadMessageFile: () => L,
        withToken: () => U
      });
      var r = n(661533),
        a = n.n(r),
        i = n(629133),
        o = n.n(i),
        u = n(987081),
        s = n(128508),
        c = n(623967),
        l = n.n(c),
        f = n(214558),
        d = n(445368),
        p = n(132788),
        h = n(364724);

      function y(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function b(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            r = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), r.forEach((function(t) {
            y(e, t, n[t])
          }))
        }
        return e
      }

      function v(e, t) {
        if (null == e) return {};
        var n, r, a = function(e, t) {
          if (null == e) return {};
          var n, r, a = {},
            i = Object.keys(e);
          for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || (a[n] = e[n]);
          return a
        }(e, t);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(e);
          for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (a[n] = e[n])
        }
        return a
      }
      var m = APP.constant("account") || {},
        g = m.amojo_server,
        _ = m.amojo_ws_server,
        w = "internal",
        E = "external",
        A = "write_first",
        T = 2,
        S = 1,
        P = "direct",
        k = "group",
        O = 4,
        x = 15e3,
        j = {
          sendMessage: function(e) {
            return "".concat(g, "/chats/").concat(m.amojo_id, "/").concat(e, "/messages?stand=").concat(m.stand)
          },
          sendMessagev1: function(e) {
            return "".concat(g, "/v1/chats/").concat(m.amojo_id, "/").concat(e, "/messages?with_video=true&stand=").concat(m.stand)
          },
          sendPhoto: function(e) {
            return "".concat(g, "/v2/").concat(e, "/sendPhoto?stand=").concat(m.stand)
          },
          sendVideo: function(e) {
            return "".concat(g, "/v2/").concat(e, "/sendVideo?stand=").concat(m.stand)
          },
          sendDocument: function(e) {
            return "".concat(g, "/v2/").concat(e, "/sendDocument?stand=").concat(m.stand)
          },
          sendMessageWithFiles: function(e) {
            return "".concat(g, "/v2/").concat(e, "/sendMessage?stand=").concat(m.stand)
          },
          sendReaction: function(e) {
            return "".concat(g, "/v2/messages/").concat(e, "/react")
          },
          sendTyping: function() {
            return "".concat(g, "/v2/typing?stand=").concat(m.stand)
          },
          fetchMessages: function(e) {
            return "".concat(g, "/chats/").concat(m.amojo_id, "/").concat(e, "/messages?stand=").concat(m.stand)
          },
          fetchMessagesMultiple: function() {
            return "".concat(g, "/messages/").concat(m.amojo_id, "/merge?stand=").concat(m.stand)
          },
          fetchMessagesById: function() {
            return "".concat(g, "/v2/messages")
          },
          uploadFile: function() {
            return "".concat(g, "/v2/attachment/?with_video=true&stand=").concat(m.stand)
          },
          getFile: function(e) {
            return "".concat(g, "/v2/attachment/").concat(e, "?stand=").concat(m.stand)
          },
          deleteFile: function() {
            return "".concat(g, "/v2/attachment/?stand=").concat(m.stand)
          },
          createChat: function() {
            return "/ajax/v1/chats/create"
          },
          readChat: function() {
            return "".concat(g, "/v2/read?stand=").concat(m.stand)
          },
          connectBot: function() {
            return "/ajax/v1/chats/bots/connect"
          },
          manageUsersInChat: function() {
            return "/ajax/v1/chats/users"
          },
          rtmStart: function() {
            return "".concat(_, "/rtm.start/").concat(m.amojo_id, "?stand=").concat(m.stand)
          },
          getChat: function(e) {
            return "/ajax/v1/chats/list?fields=users&short=y&filter[chat_id]=".concat(e)
          },
          getGroupChats: function(e, t) {
            return "/ajax/v1/chats/group_list?fields=".concat((t || []).join(","))
          },
          getChatsStat: function() {
            return "".concat(g, "/v2/stat/chats?stand=").concat(m.stand)
          },
          updateChat: function() {
            return "/ajax/v1/chats/update/"
          },
          initChannel: function() {
            return "/ajax/v1/chats/bots/channel_init"
          },
          disableChannel: function() {
            return "/ajax/v1/chats/bots/channel_disable"
          },
          getTemplates: function() {
            return "/ajax/v4/chats/templates?with=favorite"
          },
          getSalesbots: function() {
            return "/api/v4/bots?with=favorite"
          },
          updateAutoClose: function(e) {
            return "/ajax/v2/talks/".concat(e)
          },
          transcribeMessage: function(e) {
            return "".concat(g, "/v2/messages/").concat(e, "/transcribe?stand=").concat(m.stand, "&lang=").concat(APP.lang_id)
          },
          downloadFile: function(e) {
            return "".concat(g, "/v2/files/").concat(e, "/load")
          }
        };

      function I() {
        var e = (0, f.current)().id,
          t = (0, f.get)(e),
          n = window.location.origin.replace(/\w+(?=\.)/, "images") + (t.avatar || (0, d.getDefaultAvatar)(e));
        return {
          persona_name: t.title,
          persona_avatar: n
        }
      }

      function C(e, t) {
        var n = {
          auto_close: t
        };
        return a().ajax({
          method: "POST",
          url: j.updateAutoClose(e),
          data: JSON.stringify(n),
          dataType: "json",
          contentType: "application/json"
        })
      }

      function U(e) {
        return p.default.inject(e)
      }

      function D(e) {
        var t = new FormData;
        return t.append("file_id", e), U((function(e) {
          return u.from(a().ajaxPromisify({
            url: j.deleteFile(),
            data: t,
            headers: {
              "X-Auth-Token": e.token
            },
            type: "DELETE",
            processData: !1,
            contentType: !1
          }))
        }))
      }

      function R(e) {
        var t = new FormData;
        return t.append("attachment", e.file), U((function(e) {
          return u.from(a().ajaxPromisify({
            url: j.uploadFile(),
            headers: {
              "X-Auth-Token": e.token
            },
            type: "POST",
            data: t,
            processData: !1,
            contentType: !1
          }))
        }))
      }

      function F(e) {
        return U((function(t) {
          return u.from(a().ajaxPromisify({
            url: j.getFile(e.id),
            headers: {
              "X-Auth-Token": t.token
            },
            type: "GET",
            processData: !1,
            contentType: !1
          }))
        }))
      }

      function N(e, t) {
        return U((function(n) {
          return u.from(a().ajaxPromisify({
            url: j.downloadFile(e),
            headers: {
              "X-Auth-Token": n.token
            },
            error: function() {
              t()
            },
            type: "POST"
          }))
        }))
      }

      function M(e, t, n, r) {
        return new h.default(n).send(t, r, e).pipe(s.last(), s.map((function(n) {
          return o().extend({}, n, {
            file_type: e,
            file_name: t.name,
            file_index: t.file_index
          })
        })))
      }

      function B(e) {
        var t = o().extend({
          recipient_id: e.recipient_id,
          group_id: e.group_id,
          tag: e.tag,
          text: e.text,
          crm_dialog_id: e.crm_dialog_id,
          crm_contact_id: e.crm_contact_id,
          crm_account_id: e.crm_account_id,
          crm_entity: e.crm_entity || {},
          attachments: e.attachments,
          template: e.template,
          reply_markup: e.reply_markup,
          reply_to: e.reply_to,
          forwards: e.forwards
        }, I());
        return U((function(n) {
          return u.from(a().ajaxPromisify({
            url: j.sendMessageWithFiles(e.chat_id),
            data: JSON.stringify(t),
            headers: {
              "X-Auth-Token": n.token
            },
            type: "POST",
            dataType: "json",
            contentType: "application/json"
          }))
        }))
      }

      function L(e, t) {
        return U((function(n) {
          switch (!0) {
            case /^image\/(png|jpeg|bmp|webp)$/.test(e.mimeType):
              return M("picture", e, n, t);
            case /^video\/(mp4)$/.test(e.mimeType):
              return M("video", e, n, t);
            case /^audio\/(ogg)$/.test(e.mimeType):
              return M("voice", e, n, t);
            default:
              return M("file", e, n, t)
          }
        }))
      }

      function W(e, t) {
        return U((function(n) {
          var r = n.token,
            i = JSON.stringify(l()({
              chats: [{
                chatId: e,
                dialogId: t
              }]
            }));
          return u.from(a().ajaxPromisify({
            url: j.sendTyping(),
            headers: {
              "X-Auth-Token": r
            },
            data: i,
            contentType: "application/json",
            type: "POST"
          })).pipe(s.switchMap((function() {
            return u.of(!0)
          })))
        }))
      }

      function z(e, t) {
        return U((function(n) {
          return u.from(a().ajaxPromisify({
            url: j.readChat(),
            headers: {
              "X-Auth-Token": n.token
            },
            data: {
              chat_id: e,
              group_id: [t],
              timestamp: Date.now()
            },
            type: "POST"
          })).pipe(s.switchMap((function() {
            return u.of(!0)
          })))
        }))
      }

      function H(e) {
        return o().isArray(e) || (e = [e]), U((function(t) {
          return u.from(a().ajaxPromisify({
            url: j.getChatsStat(),
            data: {
              chat_id: e
            },
            headers: {
              "X-Auth-Token": t.token
            },
            type: "GET",
            dataType: "json"
          })).pipe(s.map((function(e) {
            return o().map(e.chats, (function(e, t) {
              return {
                id: t,
                count: e.total,
                users: o().values(e.users)
              }
            }))
          })))
        }))
      }

      function G(e, t) {
        var n = {
          emoji: t = t || ""
        };
        return U((function(t) {
          return u.from(a().ajaxPromisify({
            url: j.sendReaction(e),
            type: "POST",
            data: JSON.stringify(n),
            headers: {
              "X-Auth-Token": t.token
            },
            contentType: "application/json"
          }))
        }))
      }

      function q(e) {
        var t = o().extend({
          silent: !1,
          priority: "low",
          crm_entity: {}
        }, I(), o().pick(e, "crm_entity", "text", "recipient_id", "group_id", "file_id", "tag", "crm_dialog_id", "crm_contact_id", "crm_account_id", "skip_link_shortener", "reply_markup", "template", "reply_to", "forwards"));
        return U((function(n) {
          return u.from(a().ajaxPromisify({
            url: j.sendMessagev1(e.chat_id),
            data: JSON.stringify(t),
            headers: {
              "X-Auth-Token": n.token
            },
            type: "POST",
            dataType: "json",
            contentType: "application/json"
          }))
        }))
      }

      function J(e) {
        var t = o().extend({
          text: e.message,
          recipient_id: e.recipient_id,
          group_id: e.group_id,
          callback_data: e.callback_data,
          crm_entity: e.crm_entity || {}
        }, o().pick(e, "crm_contact_id", "crm_account_id", "reply_to"));
        return U((function(n) {
          return u.from(a().ajaxPromisify({
            url: j.sendMessage(e.chat_id),
            data: t,
            headers: {
              "X-Auth-Token": n.token
            },
            type: "POST",
            dataType: "json"
          }))
        }))
      }

      function V(e, t, n) {
        return U((function(r) {
          return u.from(a().ajaxPromisify({
            url: j.fetchMessages(e),
            data: {
              offset: t,
              limit: n
            },
            headers: {
              "X-Auth-Token": r.token
            },
            type: "GET",
            dataType: "json"
          })).pipe(s.map((function(e) {
            return o().isUndefined(e) ? [] : e
          })))
        }))
      }

      function X(e) {
        return U((function(t) {
          return u.from(a().ajaxPromisify({
            url: j.fetchMessagesById(),
            data: {
              id: e
            },
            headers: {
              "X-Auth-Token": t.token
            },
            type: "GET",
            dataType: "json"
          })).pipe(s.map((function(e) {
            return o().isUndefined(e) ? [] : e
          })))
        }))
      }

      function K() {
        return j
      }

      function Y(e, t, n, r, i, o, s, c) {
        switch (e) {
          case A:
            return function(e, t, n, r) {
              return u.from(a().ajaxPromisify({
                url: j.createChat(),
                type: "POST",
                data: {
                  request: {
                    chats: {
                      create: {
                        type: "external",
                        entity_id: e,
                        entity_type: t,
                        phone: n,
                        source: r
                      }
                    }
                  }
                },
                dataType: "json"
              }))
            }(t, n, s, c);
          case w:
            return function(e, t, n) {
              return u.from(a().ajaxPromisify({
                url: j.createChat(),
                type: "POST",
                data: {
                  request: {
                    chats: {
                      create: {
                        type: "internal",
                        entity_id: e,
                        entity_type: t,
                        users: n || []
                      }
                    }
                  }
                },
                dataType: "json"
              }))
            }(t, n, r);
          case P:
            return function(e) {
              return u.from(a().ajaxPromisify({
                url: j.createChat(),
                type: "POST",
                data: {
                  request: {
                    chats: {
                      create: {
                        type: "direct",
                        users: e || []
                      }
                    }
                  }
                },
                dataType: "json"
              }))
            }(r = arguments[1]);
          case k:
            return function(e, t, n) {
              return u.from(a().ajaxPromisify({
                url: j.createChat(),
                type: "POST",
                data: {
                  request: {
                    chats: {
                      create: {
                        type: "group",
                        users: t || [],
                        groups: n || [],
                        title: e
                      }
                    }
                  }
                },
                dataType: "json"
              }))
            }(i, r, o);
          default:
            return u.throwError(new Error("Unsupported chat type ".concat(e)))
        }
      }

      function Q(e) {
        return u.from(a().ajaxPromisify({
          url: j.connectBot(),
          type: "POST",
          data: {
            request: {
              chats: {
                bots: {
                  connect: {
                    bot_id: e
                  }
                }
              }
            }
          },
          dataType: "json"
        }))
      }

      function $(e, t) {
        return u.of(t).pipe(s.map((function(t) {
          var n = {};
          return n[e] = {
            users: t
          }, n
        })), s.switchMap((function(e) {
          return u.from(a().ajaxPromisify({
            url: j.manageUsersInChat(),
            type: "POST",
            data: {
              request: {
                chats: {
                  users: {
                    add: e
                  }
                }
              }
            },
            dataType: "json"
          }))
        })))
      }

      function Z(e, t) {
        return u.of(t).pipe(s.map((function(t) {
          var n = {};
          return n[e] = {
            users: t
          }, n
        })), s.switchMap((function(e) {
          return u.from(a().ajaxPromisify({
            url: j.manageUsersInChat(),
            type: "POST",
            data: {
              request: {
                chats: {
                  users: {
                    remove: e
                  }
                }
              }
            },
            dataType: "json"
          }))
        })))
      }

      function ee() {
        return U((function(e) {
          return u.from(a().ajaxPromisify({
            url: j.rtmStart(),
            headers: {
              "X-Auth-Token": e.token
            },
            type: "POST",
            dataType: "json",
            timeout: x
          }))
        }))
      }

      function te(e) {
        return U((function(t) {
          return u.from(a().ajaxPromisify({
            url: j.transcribeMessage(e),
            headers: {
              "X-Auth-Token": t.token
            },
            type: "POST",
            dataType: "json"
          }))
        }))
      }

      function ne(e) {
        return u.from(a().ajaxPromisify({
          url: j.getChat(e),
          type: "GET",
          dataType: "json"
        }))
      }

      function re(e, t) {
        return u.from(a().ajaxPromisify({
          url: j.getGroupChats(e, t),
          type: "GET",
          dataType: "json"
        }))
      }

      function ae(e, t) {
        return u.from(a().ajaxPromisify({
          url: j.updateChat(),
          type: "POST",
          data: {
            request: {
              chats: {
                update: {
                  type: "group",
                  chat_id: e,
                  title: t
                }
              }
            }
          },
          dataType: "json"
        }))
      }
      var ie = null;

      function oe() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.url,
          n = void 0 === t ? "" : t,
          r = v(e, ["url"]);
        return ie || (ie = a().ajaxPromisify(b({
          url: n || j.getTemplates(),
          type: "GET",
          dataType: "json"
        }, r)).finally((function(e) {
          return ie = null, e
        }))), u.from(ie)
      }
      var ue = null;

      function se() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.url,
          n = void 0 === t ? "" : t,
          r = v(e, ["url"]);
        return ue || (ue = a().ajaxPromisify(b({
          url: n || j.getSalesbots(),
          type: "GET",
          dataType: "json"
        }, r)).finally((function(e) {
          return ue = null, e
        }))), u.from(ue)
      }

      function ce(e, t) {
        var n = {
          request: {
            channel_init: {
              channel_name: e
            }
          }
        };
        return t = t || {}, a().ajax(o().extend({
          method: "POST",
          url: j.initChannel(),
          data: JSON.stringify(n),
          dataType: "json",
          contentType: "application/json"
        }, t))
      }

      function le(e, t) {
        var n = {
          request: {
            channel_disable: {
              channel_name: e
            }
          }
        };
        return t = t || {}, a().ajax(o().extend({
          method: "POST",
          url: j.disableChannel(),
          data: JSON.stringify(n),
          dataType: "json",
          contentType: "application/json"
        }, t))
      }
      var fe = "../build/transpiled/interface/amojo/api";
      window.define(fe, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([fe])
    },
    132788: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => O
      });
      var r = n(629133),
        a = n.n(r),
        i = n(987081),
        o = n(128508),
        u = n(643095),
        s = n(214558),
        c = n(168807),
        l = n(128476),
        f = n(471435),
        d = n(661533);

      function p(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }
      var h = 400,
        y = 401,
        b = 500,
        v = 0,
        m = APP.constant("account"),
        g = (0, s.current)(),
        _ = (0, s.get)(),
        w = (0, s.get)("free"),
        E = ("".concat(m.amojo_server, "/session/refresh_token?stand=").concat(m.stand), "/ajax/v1/chats/session"),
        A = null,
        T = !1,
        S = !1;

      function P() {
        l.default.set(null), A = null
      }

      function k(e) {
        var t = 0;
        return i.zip(i.range(1, 3), e).pipe(o.switchMap((function(e) {
          var n, r, u = (r = 2, function(e) {
              if (Array.isArray(e)) return e
            }(n = e) || function(e, t) {
              var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
              if (null != n) {
                var r, a, i = [],
                  o = !0,
                  u = !1;
                try {
                  for (n = n.call(e); !(o = (r = n.next()).done) && (i.push(r.value), !t || i.length !== t); o = !0);
                } catch (e) {
                  u = !0, a = e
                } finally {
                  try {
                    o || null == n.return || n.return()
                  } finally {
                    if (u) throw a
                  }
                }
                return i
              }
            }(n, r) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return p(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? p(e, t) : void 0
              }
            }(n, r) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()),
            s = u[0],
            l = u[1];
          if (t++, 3 === s) return i.throwError(l);
          if (l.status >= b) return m.amojo_enabled = 0, t = 5, i.of(l.status).pipe((0, c.exponentialDelay)(t, {
            with_jitter: !0
          }), o.mapTo(l));
          if (l.status >= h && l.status < b && l.status !== y) return i.throwError(l);
          if (a().isUndefined(l.responseJSON) && a().isUndefined(l.responseText) && 0 === l.readyState) {
            var f = (0, c.exponentialDelay)(t, {
              with_jitter: !0
            });
            return i.of(l.status).pipe(o.delay(f), o.mapTo(l))
          }
          return T || P(), i.of(l.status)
        })))
      }
      const O = {
        inject: function(e) {
          return i.defer((function() {
            var e;
            if (null === A) {
              if ((e = l.default.get()) && e.valid()) return i.of(e);
              T = !0, A = i.defer((function() {
                return i.from(d.ajaxPromisify({
                  url: E,
                  data: {
                    request: {
                      chats: {
                        session: {
                          action: "create"
                        }
                      }
                    }
                  },
                  method: "POST"
                }).finally((function(e) {
                  return T = !1, e
                }))).pipe(o.map((function(e) {
                  var t = e.response.chats.session;
                  ! function(e) {
                    m.amojo_enabled = 1, !m.amojo_id && e.account && e.account.id && (m.amojo_id = e.account.id), !g.amojo_id && e.user && e.user.id && (g.amojo_id = e.user.id), g.amojo_id && a().each([_, w], (function(e) {
                      e[g.id] && !e[g.id].amojo_id && (e[g.id].amojo_id = g.amojo_id)
                    }))
                  }(t);
                  var n = new f.default(t.access_token, t.refresh_token, t.expired_at, g.id);
                  return l.default.set(n), n
                })), o.catchError((function(e) {
                  return S || function(e) {
                    S = !0;
                    var t = e.responseJSON,
                      n = void 0 === t ? {} : t,
                      r = e.status;
                    (0, u.sentryLogFailedGetAmojoToken)({
                      responseJSON: n,
                      isNetworkError: r === v
                    })
                  }(e), P(), i.throwError(e)
                })))
              })).pipe(o.share({
                connector: function() {
                  return new i.AsyncSubject
                },
                resetOnError: !1,
                resetOnComplete: !1,
                resetOnRefCountZero: !1
              }))
            }
            return A
          })).pipe(o.switchMap(e), o.retryWhen(k))
        }
      };
      var x = "../build/transpiled/interface/amojo/token_manager";
      window.define(x, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([x])
    },
    128476: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => u
      });
      var r = n(509372),
        a = n(471435),
        i = "amojo_token";

      function o() {
        var e = "test";
        try {
          return localStorage.setItem(e, e), localStorage.removeItem(e), !0
        } catch (e) {
          return !1
        }
      }
      const u = {
        get: function() {
          var e;
          return o() && (e = localStorage.getItem(i)), e || (e = (0, r.get)(i)), e ? a.default.fromJSON(e) : null
        },
        set: function(e) {
          o() ? e ? localStorage.setItem("amojo_token", e) : localStorage.removeItem("amojo_token") : (0, r.set)({
            name: "amojo_token",
            value: e,
            expiredays: e.expiresInDays()
          })
        }
      };
      var s = "../build/transpiled/interface/amojo/token_storage";
      window.define(s, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([s])
    },
    364724: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => p
      });
      var r = n(629133),
        a = n.n(r),
        i = n(987081),
        o = n(128508),
        u = n(118860),
        s = n(500034),
        c = n(661533),
        l = APP.constant("account") || {},
        f = l.amojo_server,
        d = function(e) {
          this.file_id = this.guid(), this.token = e
        };
      a().extend(d.prototype, {
        agents: [],
        totalParts: 0,
        agentStream$: new i.Subject,
        partsStream$: new i.Subject,
        uploadSource$: null,
        send: function(e, t) {
          return new i.Observable(a().bind((function(n) {
            var r;
            return (0, s.isFeatureAvailable)("amocrm_drive") ? ((r = u.default.uploadFile(e.orig_file, {
              withPreview: !0,
              billable: t.billable,
              processing: t.processing
            })).then((function(e) {
              if (!e) return n.error();
              n.next({
                external_file_id: e.uuid,
                external_file_vers_id: e.version_uuid,
                type: "load",
                progress: 100
              }), n.complete()
            }), a().bind(n.error, n)), function() {
              r.abort()
            }) : (r = this.fileToStream(e.bytes).pipe(o.map(a().bind(this.sendPart(e), this)), o.concatAll()).subscribe(a().bind((function(e) {
              var t = {
                file_id: this.file_id,
                type: "process",
                progress: (e.num + 1) / e.total * 100
              };
              e.num + 1 === e.total ? (t.type = "load", n.next(t), n.complete()) : n.next(t)
            }), this), a().bind(n.error, n)), function() {
              r.unsubscribe()
            })
          }), this))
        },
        fileToStream: function(e) {
          var t, n = 524288,
            r = Math.ceil(e.byteLength / n);
          return e.byteLength % n == 0 && r++, new i.Observable((function(a) {
            for (t = 0; t < r; t++) a.next({
              num: t,
              bytes: new Uint8Array(e.slice(n * t, (t + 1) * n)),
              total: r
            });
            a.complete()
          }))
        },
        sendPart: function(e) {
          return function(t) {
            return i.defer(a().bind((function() {
              return i.from(c.ajaxPromisify({
                url: "".concat(f, "/v2/upload/saveFilePart?part=").concat(t.num, "&file_id=").concat(this.file_id, "&stand=").concat(l.stand),
                headers: {
                  "X-Auth-Token": this.token.token,
                  "Content-Disposition": "attachment; filename*=\"UTF-8''".concat(encodeURIComponent(e.name), '"')
                },
                type: "PUT",
                contentType: e.mimeType,
                data: t.bytes,
                processData: !1
              })).pipe(o.map((function() {
                return {
                  num: t.num,
                  total: t.total
                }
              })))
            }), this))
          }
        },
        guid: function() {
          function e() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
          }
          return "".concat(e() + e(), "-").concat(e(), "-").concat(e(), "-").concat(e(), "-").concat(e()).concat(e()).concat(e())
        }
      });
      const p = d;
      var h = "../build/transpiled/interface/amojo/uploader";
      window.define(h, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([h])
    },
    118860: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => m,
        getCorrectDataForDrive: () => y
      });
      var r = n(629133),
        a = n.n(r),
        i = n(161320),
        o = n.n(i),
        u = n(867993),
        s = n(352529);

      function c(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function l(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              c(i, r, a, o, u, "next", e)
            }

            function u(e) {
              c(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function f(e, t, n) {
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
            f(e, t, n[t])
          }))
        }
        return e
      }

      function p(e, t) {
        var n, r, a, i, o = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return i = {
          next: u(0),
          throw: u(1),
          return: u(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
          return this
        }), i;

        function u(i) {
          return function(u) {
            return function(i) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; o;) try {
                if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                  case 0:
                  case 1:
                    a = i;
                    break;
                  case 4:
                    return o.label++, {
                      value: i[1],
                      done: !1
                    };
                  case 5:
                    o.label++, r = i[1], i = [0];
                    continue;
                  case 7:
                    i = o.ops.pop(), o.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                      o = 0;
                      continue
                    }
                    if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                      o.label = i[1];
                      break
                    }
                    if (6 === i[0] && o.label < a[1]) {
                      o.label = a[1], a = i;
                      break
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2], o.ops.push(i);
                      break
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue
                }
                i = t.call(e, o)
              } catch (e) {
                i = [6, e], r = 0
              } finally {
                n = a = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, u])
          }
        }
      }

      function h(e) {
        return o()(e, AMOCRM.system.format.date.date)
      }

      function y(e) {
        var t = JSON.parse(JSON.stringify(e));
        if (a().isObject(null == t ? void 0 : t.filter)) {
          var n = t.filter;
          if (a().isObject(n.created_by) && (n.created_by = a().map(a().values(n.created_by), (function(e) {
              return Number(e)
            }))), a().isObject(n.updated_by) && (n.updated_by = a().map(a().values(n.updated_by), (function(e) {
              return Number(e)
            }))), a().property(["date", "from"])(n) && a().property(["date", "to"])(n)) {
            var r = h(n.date.from).unix(),
              i = h(n.date.to).add(1, "days").unix();
            n.date = {
              from: r,
              to: i
            }
          }
          if (a().has(n, "order_by")) switch (!0) {
            case "filesize" === n.order_by:
              n.order_by = "size";
              break;
            case "date" === n.order_by:
              n.order_by = "created_at";
              break;
            case "date_modified" === n.order_by:
              n.order_by = "updated_at"
          }
          return a().isObject(n.extensions) && (n.extensions = a().values(n.extensions), n.extensions[0] = "No type" === n.extensions[0] ? "" : n.extensions[0]), a().property(["source_id"])(n) && (n.source_id = Number(n.source_id)), a().property(["size"])(n) && (a().property(["size", "unit"])(n) && (n.size.unit = Number(n.size.unit)), a().property(["size", "from"])(n) && (n.size.from = Number(n.size.from)), a().property(["size", "to"])(n) && (n.size.to = Number(n.size.to))), t
        }
        return e
      }

      function b(e, t, n) {
        var r, i = (0, u.createRequestSender)(e, t, n),
          o = (r = l((function() {
            var e = arguments;
            return p(this, (function(t) {
              return [2, i({
                url: "/v1.0/files",
                data: e.length > 0 && void 0 !== e[0] ? e[0] : {}
              })]
            }))
          })), function() {
            return r.apply(this, arguments)
          }),
          s = function() {
            var e = l((function() {
              var e = arguments;
              return p(this, (function(t) {
                return [2, i({
                  url: "/v1.0/files/count",
                  data: e.length > 0 && void 0 !== e[0] ? e[0] : {}
                })]
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }(),
          c = function() {
            var e = l((function(e, t) {
              var n;
              return p(this, (function(r) {
                return n = {
                  processing_params: {
                    audio: {
                      transcode_to: t,
                      channels: 1
                    }
                  }
                }, [2, i({
                  url: "/v1.0/files/".concat(e, "/convert"),
                  type: "POST",
                  data: JSON.stringify(n)
                })]
              }))
            }));
            return function(t, n) {
              return e.apply(this, arguments)
            }
          }(),
          f = function() {
            var e = l((function(e) {
              return p(this, (function(t) {
                return [2, i({
                  url: "/v1.0/files/".concat(e)
                })]
              }))
            }));
            return function(t) {
              return e.apply(this, arguments)
            }
          }(),
          d = function() {
            var e = l((function(e) {
              return p(this, (function(t) {
                return [2, i({
                  url: "/v1.0/files/".concat(e, "/versions")
                }).then((function(e) {
                  return a().propertyOf(e)(["_embedded", "versions"]) || []
                }))]
              }))
            }));
            return function(t) {
              return e.apply(this, arguments)
            }
          }(),
          h = function() {
            var e = l((function(e, t) {
              return p(this, (function(n) {
                return [2, i({
                  url: "/v1.0/files/".concat(e),
                  type: "PATCH",
                  data: JSON.stringify({
                    version_uuid: t
                  })
                })]
              }))
            }));
            return function(t, n) {
              return e.apply(this, arguments)
            }
          }(),
          y = function() {
            var e = l((function() {
              var e = arguments;
              return p(this, (function(t) {
                return [2, i({
                  url: "/v1.0/files/stats",
                  data: e.length > 0 && void 0 !== e[0] ? e[0] : {}
                })]
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }(),
          b = function() {
            var e = l((function() {
              return p(this, (function(e) {
                return [2, i({
                  url: "/v1.0/files/extensions",
                  type: "GET"
                })]
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }(),
          v = function() {
            var e = l((function() {
              var e = arguments;
              return p(this, (function(t) {
                return [2, i({
                  url: "/v1.0/files/multiaction",
                  type: e.length > 1 && void 0 !== e[1] ? e[1] : "POST",
                  contentType: "application/json",
                  data: e.length > 0 && void 0 !== e[0] ? e[0] : {}
                })]
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }(),
          m = function() {
            var e = l((function() {
              return p(this, (function(e) {
                return [2, i({
                  url: "/v1.0/cleaning_rules",
                  type: "GET"
                })]
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }(),
          g = function() {
            var e = l((function(e) {
              return p(this, (function(t) {
                return [2, i({
                  url: "/v1.0/cleaning_rules/".concat(e),
                  type: "GET"
                })]
              }))
            }));
            return function(t) {
              return e.apply(this, arguments)
            }
          }(),
          _ = function() {
            var e = l((function() {
              var e, t = arguments;
              return p(this, (function(n) {
                return e = t.length > 0 && void 0 !== t[0] ? t[0] : {}, [2, i({
                  url: "/v1.0/cleaning_rules",
                  type: "POST",
                  contentType: "application/json",
                  data: JSON.stringify(e)
                })]
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }();
        return {
          updateFile: function(e, t) {
            return i({
              url: "/v1.0/files/".concat(e),
              type: "PATCH",
              data: JSON.stringify(t)
            })
          },
          deleteFile: function(e) {
            return i({
              url: "/v1.0/files/".concat(e),
              type: "DELETE"
            })
          },
          deleteFiles: function(e) {
            return i({
              url: "/v1.0/files",
              type: "DELETE",
              contentType: "application/json",
              dataType: "text",
              data: JSON.stringify(a().map(e, (function(e) {
                return {
                  uuid: e
                }
              })))
            })
          },
          restoreFiles: function(e) {
            return i({
              url: "/v1.0/files/restore",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(a().map(e, (function(e) {
                return {
                  uuid: e
                }
              })))
            })
          },
          getFilesList: o,
          getFilesCount: s,
          convertFile: c,
          getMetadata: f,
          getVersions: d,
          switchFileVersion: h,
          getUsedStats: y,
          getFilesExtensions: b,
          multiactionDelete: v,
          getFilesCleaningRulesList: m,
          getFilesCleaningRule: g,
          addFilesCleaningRule: _,
          updateFilesCleaningRule: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return i({
              url: "/v1.0/cleaning_rules/".concat(e),
              type: "PUT",
              data: JSON.stringify(t)
            })
          },
          deleteFilesCleaningRule: function(e) {
            return i({
              url: "/v1.0/cleaning_rules/".concat(e),
              type: "DELETE"
            })
          },
          deleteFilesCleaningRules: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
            return i({
              url: "/v1.0/cleaning_rules",
              type: "DELETE",
              data: JSON.stringify(e)
            })
          }
        }
      }
      var v = d({
        getUploadingByClientId: s.getUploadingByClientId,
        uploadFile: s.uploadFile,
        checkCleaningRules: s.checkCleaningRules
      }, b());
      const m = d({
        setContext: function(e, t, n) {
          return d({}, v, b(e, t, n))
        }
      }, v);
      var g = "../build/transpiled/network/files/drive";
      window.define(g, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([g])
    },
    867993: (e, t, n) => {
      n.r(t), n.d(t, {
        createRequestSender: () => b
      });
      var r = n(629133),
        a = n.n(r),
        i = n(926168),
        o = n(661533);

      function u(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function s(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              u(i, r, a, o, s, "next", e)
            }

            function s(e) {
              u(i, r, a, o, s, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function c(e, t) {
        var n, r, a, i, o = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return i = {
          next: u(0),
          throw: u(1),
          return: u(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
          return this
        }), i;

        function u(i) {
          return function(u) {
            return function(i) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; o;) try {
                if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                  case 0:
                  case 1:
                    a = i;
                    break;
                  case 4:
                    return o.label++, {
                      value: i[1],
                      done: !1
                    };
                  case 5:
                    o.label++, r = i[1], i = [0];
                    continue;
                  case 7:
                    i = o.ops.pop(), o.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                      o = 0;
                      continue
                    }
                    if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                      o.label = i[1];
                      break
                    }
                    if (6 === i[0] && o.label < a[1]) {
                      o.label = a[1], a = i;
                      break
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2], o.ops.push(i);
                      break
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue
                }
                i = t.call(e, o)
              } catch (e) {
                i = [6, e], r = 0
              } finally {
                n = a = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, u])
          }
        }
      }
      var l, f = APP.constant("amocrm_drive").url,
        d = new Map,
        p = {},
        h = (l = s((function(e) {
          return c(this, (function(t) {
            return p[e] || (p[e] = o.ajax({
              url: "/ajax/v4/files/issue_token",
              type: "POST",
              data: e
            }).always((function() {
              delete p[e]
            }))), [2, p[e]]
          }))
        })), function(e) {
          return l.apply(this, arguments)
        }),
        y = function() {
          var e = s((function() {
            var e, t, n, r, o, u, s, l, f = arguments;
            return c(this, (function(c) {
              switch (c.label) {
                case 0:
                  return t = f.length > 1 && void 0 !== f[1] ? f[1] : null, n = f.length > 2 && void 0 !== f[2] ? f[2] : null, r = f.length > 3 && void 0 !== f[3] && f[3], o = (e = f.length > 0 && void 0 !== f[0] ? f[0] : null) && t ? {
                    entity_id: e,
                    entity_type: a().find(AMOCRM.element_types, (function(e) {
                      return e === t
                    })) ? (0, i.convertElementType)(t, "string") : t
                  } : "", n && (o.parent = {
                    entity_id: n,
                    entity_type: "leads"
                  }), u = JSON.stringify(o), (s = !1 === r && d.get(u)) ? [2, s] : [4, h(u)];
                case 1:
                  return l = c.sent().token, d.set(u, l), [2, l]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        b = function(e, t, n) {
          var r = function() {
            var r = s((function(r) {
              var a, i, u, s;
              return c(this, (function(c) {
                switch (c.label) {
                  case 0:
                    a = function(e) {
                      return o.ajax(o.extend(!0, {}, r, {
                        url: "".concat(f).concat(r.url),
                        xhrFields: {
                          withCredentials: !0
                        },
                        crossDomain: !0,
                        headers: {
                          "X-Auth-Token": e
                        }
                      }))
                    }, c.label = 1;
                  case 1:
                    return c.trys.push([1, 4, , 7]), [4, y(e, t, n)];
                  case 2:
                    return i = c.sent(), [4, a(i)];
                  case 3:
                    return [2, c.sent()];
                  case 4:
                    return 403 !== (u = c.sent()).status ? [3, 6] : [4, y(e, t, n, !0)];
                  case 5:
                    return s = c.sent(), [2, a(s)];
                  case 6:
                    throw u;
                  case 7:
                    return [2]
                }
              }))
            }));
            return function(e) {
              return r.apply(this, arguments)
            }
          }();
          return r
        }
    },
    352529: (e, t, n) => {
      n.r(t), n.d(t, {
        checkCleaningRules: () => O,
        getUploadingByClientId: () => k,
        uploadFile: () => P
      });
      var r = n(629133),
        a = n.n(r),
        i = n(623967),
        o = n.n(i),
        u = n(156040),
        s = n(445368),
        c = n(628612),
        l = n(926969),
        f = n(695453),
        d = n(845043),
        p = n(867993),
        h = n(661533);

      function y(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function b(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              y(i, r, a, o, u, "next", e)
            }

            function u(e) {
              y(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function v(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function m(e, t) {
        var n, r, a, i, o = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return i = {
          next: u(0),
          throw: u(1),
          return: u(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
          return this
        }), i;

        function u(i) {
          return function(u) {
            return function(i) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; o;) try {
                if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                  case 0:
                  case 1:
                    a = i;
                    break;
                  case 4:
                    return o.label++, {
                      value: i[1],
                      done: !1
                    };
                  case 5:
                    o.label++, r = i[1], i = [0];
                    continue;
                  case 7:
                    i = o.ops.pop(), o.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                      o = 0;
                      continue
                    }
                    if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                      o.label = i[1];
                      break
                    }
                    if (6 === i[0] && o.label < a[1]) {
                      o.label = a[1], a = i;
                      break
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2], o.ops.push(i);
                      break
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue
                }
                i = t.call(e, o)
              } catch (e) {
                i = [6, e], r = 0
              } finally {
                n = a = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, u])
          }
        }
      }
      File.prototype.arrayBuffer = File.prototype.arrayBuffer || function() {
        var e = this;
        return new Promise((function(t) {
          var n = new FileReader;
          n.onload = function() {
            t(n.result)
          }, n.readAsArrayBuffer(e)
        }))
      };
      var g = {},
        _ = "file_uploading",
        w = (0, p.createRequestSender)();
      (0, u.onPageFullyLoaded)((function() {
        APP.router.registerPreventConfig({
          onlyBeforeUnload: !0
        }, _)
      }));
      var E, A = (E = b((function(e, t) {
          var n, r = arguments;
          return m(this, (function(i) {
            return n = r.length > 2 && void 0 !== r[2] ? r[2] : {}, [2, w({
              url: "/v1.0/sessions",
              type: "POST",
              data: JSON.stringify(a().extend(n, {
                file_name: e,
                file_size: t
              }))
            })]
          }))
        })), function(e, t) {
          return E.apply(this, arguments)
        }),
        T = function() {
          var e = b((function() {
            var e, t = arguments;
            return m(this, (function(n) {
              return e = t.length > 0 && void 0 !== t[0] ? t[0] : {}, [2, w({
                url: "/v1.0/cleaning_rules/check",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(e)
              })]
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        S = function() {
          var e = b((function(e) {
            var t, n, r, i, o, u, s, c = arguments;
            return m(this, (function(l) {
              switch (l.label) {
                case 0:
                  if (t = c.length > 1 && void 0 !== c[1] ? c[1] : 0, n = c.length > 2 && void 0 !== c[2] ? c[2] : {}, e.isAborted()) return [2, !1];
                  i = function() {
                    return h.ajax({
                      url: e.url,
                      type: "POST",
                      data: e.file_buffer.slice(e.part_size * t, (t + 1) * e.part_size),
                      processData: !1
                    })
                  }, l.label = 1;
                case 1:
                  return l.trys.push([1, 3, , 8]), [4, i()];
                case 2:
                  return r = l.sent(), [3, 8];
                case 3:
                  return 404 !== (o = l.sent()).status || n.session ? [3, 5] : [4, A(e.name, e.size)];
                case 4:
                  return u = l.sent(), n.session = !0, [2, S(a().extend(e, {
                    url: u.upload_url,
                    part_size: u.max_part_size
                  }), 0, n)];
                case 5:
                  return 500 === o.status && n.resends < 5 ? (n.resends += 1, [4, (f = 1e3 * n.resends, new Promise((function(e) {
                    return setTimeout(e, f)
                  })))]) : [3, 7];
                case 6:
                  return l.sent(), [2, i()];
                case 7:
                  throw Error("file upload failed");
                case 8:
                  return s = (t + 1) / Math.ceil(e.file_buffer.byteLength / e.part_size) * 100, e.isAborted() || e.onProgress(s), r.next_url ? [4, S(a().extend({}, e, {
                    url: r.next_url
                  }), ++t, n)] : [3, 10];
                case 9:
                  r = l.sent(), l.label = 10;
                case 10:
                  return [2, r]
              }
              var f
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        P = function(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = [],
            r = !1,
            i = function() {
              var i = b((function() {
                var i, u, s;
                return m(this, (function(f) {
                  switch (f.label) {
                    case 0:
                      if (!e) throw new Error("no file to upload");
                      return i = function(e, t) {
                        if (!(0, c.isHeicHeifImage)(e) && !(0, l.isVideo)(e)) return o()(t);
                        var n = a().clone(t);
                        return n.processing = function(e) {
                          for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {},
                              r = Object.keys(n);
                            "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                              return Object.getOwnPropertyDescriptor(n, e).enumerable
                            })))), r.forEach((function(t) {
                              v(e, t, n[t])
                            }))
                          }
                          return e
                        }({}, n.processing, (0, c.isHeicHeifImage)(e) && {
                          image: {
                            convertTo: "image/jpeg"
                          }
                        }, (0, l.isVideo)(e) && {
                          video: {
                            convertTo: "video/mp4"
                          }
                        }), o()(n)
                      }(e, t), [4, A(e.name, e.size, a().pick(i, "file_uuid", "only_auth", "with_preview", "billable", "processing"))];
                    case 1:
                      return u = f.sent(), [4, e.arrayBuffer()];
                    case 2:
                      return s = f.sent(), [2, S({
                        url: u.upload_url,
                        file_name: e.name,
                        file_size: e.size,
                        file_buffer: s,
                        part_size: u.max_part_size,
                        isAborted: function() {
                          return r
                        },
                        onProgress: function(e) {
                          a().each(n, (function(t) {
                            return t(e)
                          }))
                        }
                      })]
                  }
                }))
              }));
              return function() {
                return i.apply(this, arguments)
              }
            }(),
            u = i();
          return u.abort = function() {
              r = !0
            }, u.progress = function(e) {
              a().isFunction(e) && n.push(e)
            }, u.finally((function() {
              n = []
            })),
            function(e, t, n) {
              g[e] || (g[e] = []);
              var r = a().uniqueId("file-"),
                i = new(0, f.default.model)({
                  file: t,
                  id: r,
                  type: "files-notification",
                  extension: t.name.slice(t.name.lastIndexOf(".") + 1),
                  updated_at: new Date,
                  progress: 0
                });
              f.default.add(i.trigger("file-add"));
              var o = {
                file: t,
                notification: i,
                uploading: n
              };
              g[e].push(o), n.progress((function(e) {
                i.set("progress", Math.round(e))
              })), n.finally((function() {
                ! function(e, t) {
                  g[e] = a().filter(g[e], (function(e) {
                    var n = e.uploading === t;
                    return n && e.notification.collection.remove(e.notification), !n
                  })), APP.router.preventPageChange(a().flatten(g).length > 0, _)
                }(e, n)
              })), APP.router.preventPageChange(!0, _)
            }(t.client_id || "", e, u), u
        },
        k = function(e) {
          return a().map(g[e], (function(e) {
            return {
              file: e.file,
              progress: e.notification.get("progress"),
              uploading: e.uploading
            }
          }))
        },
        O = function() {
          var e = b((function(e) {
            var t, n, r, i, o;
            return m(this, (function(u) {
              switch (u.label) {
                case 0:
                  return t = a().map(e, (function(e) {
                    return {
                      filename: e.name,
                      size: e.size,
                      source_id: e.source_id,
                      created_by: e.created_by
                    }
                  })), [4, T(t)];
                case 1:
                  return n = u.sent(), r = [], a().each(n, (function(t, n) {
                    t.fits_rule && r.push({
                      text: e[n].name
                    })
                  })), r.length > 5 && r.splice(5, r.length, {
                    text: "..."
                  }), r.length ? (i = r.concat([{
                    text: "The media will be deleted immediately, as it matches the deletion rule set by the account administrator. You can restore media from the Deleted folder in the Media list within 30 days."
                  }, {
                    text: "Are you sure you want to upload this media?"
                  }]), o = new d.default({
                    class_name: "",
                    text: "".concat((0, s.i18n)("Upload media"), ":"),
                    decline_text: (0, s.i18n)("button_cancel"),
                    accept_text: (0, s.i18n)("Confirm"),
                    message: i,
                    no_close: !0,
                    accept: function() {
                      this.destroy()
                    }
                  }), [2, new Promise((function(e) {
                    o.destroy = function() {
                      this.modal.destroy(), e(o.accepted)
                    }
                  }))]) : [2, !0]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    245387: (e, t, n) => {
      n.r(t), n.d(t, {
        DRIVE_BASE_URL: () => r,
        VIDEO_EXTENSIONS: () => i,
        VIDEO_MIME_TYPES: () => a
      });
      var r = APP.constant("amocrm_drive").url,
        a = ["video/3gp", "video/3gpp", "video/avi", "video/mp4", "video/mpeg", "video/quicktime", "video/webm", "video/x-msvideo"],
        i = [".3gp", ".avi", ".mkv", ".mp4", ".mpeg", ".mov", ".webm"]
    },
    646472: (e, t, n) => {
      n.r(t), n.d(t, {
        checkCleaningRules: () => b,
        deleteFile: () => w,
        deleteFiles: () => E,
        getFileData: () => g,
        getFilesList: () => _,
        uploadFile: () => m
      });
      var r = n(629133),
        a = n.n(r),
        i = n(245387),
        o = n(535882),
        u = n(782579),
        s = n(286150);

      function c(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function l(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              c(i, r, a, o, u, "next", e)
            }

            function u(e) {
              c(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function f(e, t, n) {
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
            f(e, t, n[t])
          }))
        }
        return e
      }

      function p(e, t) {
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

      function h(e, t) {
        var n, r, a, i, o = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return i = {
          next: u(0),
          throw: u(1),
          return: u(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
          return this
        }), i;

        function u(i) {
          return function(u) {
            return function(i) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; o;) try {
                if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                  case 0:
                  case 1:
                    a = i;
                    break;
                  case 4:
                    return o.label++, {
                      value: i[1],
                      done: !1
                    };
                  case 5:
                    o.label++, r = i[1], i = [0];
                    continue;
                  case 7:
                    i = o.ops.pop(), o.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                      o = 0;
                      continue
                    }
                    if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                      o.label = i[1];
                      break
                    }
                    if (6 === i[0] && o.label < a[1]) {
                      o.label = a[1], a = i;
                      break
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2], o.ops.push(i);
                      break
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue
                }
                i = t.call(e, o)
              } catch (e) {
                i = [6, e], r = 0
              } finally {
                n = a = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, u])
          }
        }
      }
      var y, b = (y = l((function(e) {
          var t;
          return h(this, (function(n) {
            return t = e.data, [2, (0, u.authorizedRequest)({
              data: {
                url: "".concat(i.DRIVE_BASE_URL, "/v1.0/cleaning_rules/check"),
                method: "POST",
                data: t
              }
            })()]
          }))
        })), function(e) {
          return y.apply(this, arguments)
        }),
        v = function() {
          var e = l((function(e) {
            var t, n, r, i, s, c, l, f, y, b, m, g, _, w, E, A, T, S, P, k, O, x, j, I, C;
            return h(this, (function(h) {
              switch (h.label) {
                case 0:
                  if (t = e.settings, n = e.currentPart, r = void 0 === n ? 0 : n, i = e.errors, s = void 0 === i ? {
                      session: !1
                    } : i, c = t.url, l = t.arrayBuffer, f = t.fileName, y = t.fileSize, b = t.partSize, m = t.withPreview, g = t.onProgress, _ = void 0 === g ? a().noop : g, w = t.onLoadFinish, E = void 0 === w ? a().noop : w, (A = t.isCancelled)()) return [2, !1];
                  S = function() {
                    return (0, u.authorizedRequest)({
                      data: {
                        url: c,
                        method: "POST",
                        data: l.slice(b * r, b * (r + 1)),
                        processData: !1,
                        beforeSend: function(e) {
                          e.abort = function() {
                            A = function() {
                              return !0
                            }
                          }
                        },
                        isFormDataPayload: !0,
                        shouldSnakeize: !1
                      }
                    })()
                  }, h.label = 1;
                case 1:
                  return h.trys.push([1, 3, , 10]), [4, S()];
                case 2:
                  return T = h.sent(), [3, 10];
                case 3:
                  switch (P = h.sent(), k = (P || {}).status, !0) {
                    case 404 === k && !s.session:
                      return [3, 4];
                    case 500 === k && s.retries && s.retries < 5:
                      return [3, 6]
                  }
                  return [3, 8];
                case 4:
                  return [4, (0, o.initSession)({
                    data: {
                      fileName: f,
                      fileSize: y,
                      withPreview: m
                    }
                  })];
                case 5:
                  return O = h.sent(), x = O.uploadUrl, j = O.maxPartSize, s.session = !0, [2, v({
                    settings: p(d({}, t), {
                      url: x,
                      partSize: j
                    }),
                    currentPart: 0,
                    errors: s
                  })];
                case 6:
                  return s.retries += 1, [4, (U = 1e3 * s.retries, new Promise((function(e) {
                    return setTimeout(e, U)
                  })))];
                case 7:
                  return h.sent(), [2, S()];
                case 8:
                  throw Error("file upload failed");
                case 9:
                  return [3, 10];
                case 10:
                  return I = (r + 1) / Math.ceil(l.byteLength / b) * 100, A() || _(I), (C = T.nextUrl) ? [4, v({
                    settings: p(d({}, t), {
                      url: C
                    }),
                    currentPart: r + 1,
                    errors: s
                  })] : [3, 12];
                case 11:
                  T = h.sent(), h.label = 12;
                case 12:
                  return E(T), [2, T]
              }
              var U
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        m = function() {
          var e = l((function(e) {
            var t, n, r, a, i, u, c, l, f, d, p, y;
            return h(this, (function(h) {
              switch (h.label) {
                case 0:
                  return t = e.settings, n = t.onProgress, r = t.onLoadFinish, a = e.file, i = function(e, t) {
                    if (null == e) return {};
                    var n, r, a = function(e, t) {
                      if (null == e) return {};
                      var n, r, a = {},
                        i = Object.keys(e);
                      for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || (a[n] = e[n]);
                      return a
                    }(e, t);
                    if (Object.getOwnPropertySymbols) {
                      var i = Object.getOwnPropertySymbols(e);
                      for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (a[n] = e[n])
                    }
                    return a
                  }(e.settings, ["onProgress", "onLoadFinish"]), u = a.name, c = a.size, l = (0, s.prepareProcessingSessionOptions)(a, i), [4, (0, o.initSession)({
                    data: l
                  })];
                case 1:
                  return f = h.sent(), d = f.uploadUrl, p = f.maxPartSize, [4, a.arrayBuffer()];
                case 2:
                  return y = h.sent(), [2, v({
                    currentPart: 0,
                    settings: {
                      url: d,
                      partSize: p,
                      fileName: u,
                      fileSize: c,
                      arrayBuffer: y,
                      onProgress: n,
                      isCancelled: function() {
                        return !1
                      },
                      onLoadFinish: r,
                      withPreview: l.withPreview
                    }
                  })]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        g = function() {
          var e = l((function(e) {
            return h(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, u.authorizedRequest)({
                    data: {
                      url: "".concat(i.DRIVE_BASE_URL, "/v1.0/files/").concat(e)
                    }
                  })()];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        _ = function() {
          var e = l((function(e) {
            return h(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, u.authorizedRequest)({
                    data: {
                      url: "".concat(i.DRIVE_BASE_URL, "/v1.0/files"),
                      data: e
                    }
                  })()];
                case 1:
                  return [2, t.sent().Embedded.files]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        w = function() {
          var e = l((function(e) {
            return h(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, u.authorizedRequest)({
                    data: {
                      url: "".concat(i.DRIVE_BASE_URL, "/v1.0/files/").concat(e),
                      method: "DELETE"
                    }
                  })()];
                case 1:
                  return t.sent(), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        E = function() {
          var e = l((function(e) {
            return h(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, u.authorizedRequest)({
                    data: {
                      url: "".concat(i.DRIVE_BASE_URL, "/v1.0/files"),
                      method: "DELETE",
                      dataType: "text",
                      data: a().map(e, (function(e) {
                        return {
                          uuid: e
                        }
                      }))
                    }
                  })()];
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
    112609: (e, t, n) => {
      n.r(t), n.d(t, {
        checkRules: () => f
      });
      var r = n(629133),
        a = n.n(r),
        i = n(445368),
        o = n(845043),
        u = n(646472);

      function s(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      var c, l, f = (c = function(e) {
        var t, n, r, s, c, l, f = arguments;
        return function(e, t) {
          var n, r, a, i, o = {
            label: 0,
            sent: function() {
              if (1 & a[0]) throw a[1];
              return a[1]
            },
            trys: [],
            ops: []
          };
          return i = {
            next: u(0),
            throw: u(1),
            return: u(2)
          }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
            return this
          }), i;

          function u(i) {
            return function(u) {
              return function(i) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; o;) try {
                  if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                  switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                    case 0:
                    case 1:
                      a = i;
                      break;
                    case 4:
                      return o.label++, {
                        value: i[1],
                        done: !1
                      };
                    case 5:
                      o.label++, r = i[1], i = [0];
                      continue;
                    case 7:
                      i = o.ops.pop(), o.trys.pop();
                      continue;
                    default:
                      if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                        o = 0;
                        continue
                      }
                      if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                        o.label = i[1];
                        break
                      }
                      if (6 === i[0] && o.label < a[1]) {
                        o.label = a[1], a = i;
                        break
                      }
                      if (a && o.label < a[2]) {
                        o.label = a[2], o.ops.push(i);
                        break
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue
                  }
                  i = t.call(e, o)
                } catch (e) {
                  i = [6, e], r = 0
                } finally {
                  n = a = 0
                }
                if (5 & i[0]) throw i[1];
                return {
                  value: i[0] ? i[1] : void 0,
                  done: !0
                }
              }([i, u])
            }
          }
        }(this, (function(d) {
          switch (d.label) {
            case 0:
              return t = f.length > 1 && void 0 !== f[1] ? f[1] : a().noop, n = a().map(e, (function(e) {
                var t = e.size;
                return {
                  fileName: e.name,
                  size: t
                }
              })), [4, (0, u.checkCleaningRules)({
                data: n
              })];
            case 1:
              return r = d.sent(), s = [], c = [], a().each(r, (function(e, t) {
                var r = e.fitsRule;
                s.push(r), r && (c.push({
                  text: n[t].fileName
                }), c.length > 5 && c.splice(5, c.length, {
                  text: "..."
                }))
              })), c.length ? (l = c.concat([{
                text: "The media will be deleted immediately, as it matches the deletion rule set by the account administrator. You can restore media from the Deleted folder in the Media list within 30 days."
              }, {
                text: "Are you sure you want to upload this media?"
              }]), new o.default({
                class_name: "",
                text: "".concat((0, i.i18n)("Upload media"), ":"),
                decline_text: (0, i.i18n)("button_cancel"),
                accept_text: (0, i.i18n)("Confirm"),
                message: l,
                no_close: !0,
                destroy: function() {
                  return this.accepted || t(), !0
                }
              }), [2]) : [2]
          }
        }))
      }, l = function() {
        var e = this,
          t = arguments;
        return new Promise((function(n, r) {
          var a = c.apply(e, t);

          function i(e) {
            s(a, n, r, i, o, "next", e)
          }

          function o(e) {
            s(a, n, r, i, o, "throw", e)
          }
          i(void 0)
        }))
      }, function(e) {
        return l.apply(this, arguments)
      })
    },
    286150: (e, t, n) => {
      n.r(t), n.d(t, {
        prepareProcessingSessionOptions: () => o
      });
      var r = n(628612),
        a = n(926969);

      function i(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var o = function(e, t) {
        var n = t.withPreview,
          o = t.billable;
        return function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {},
              r = Object.keys(n);
            "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable
            })))), r.forEach((function(t) {
              i(e, t, n[t])
            }))
          }
          return e
        }({
          fileName: e.name,
          fileSize: e.size,
          withPreview: n,
          billable: o
        }, (0, r.isHeicHeifImage)(e) && {
          processing: {
            image: {
              convertTo: "image/jpeg"
            }
          }
        }, (0, a.isVideo)(e) && {
          processing: {
            video: {
              convertTo: "video/mp4"
            }
          }
        })
      }
    },
    807160: (e, t, n) => {
      n.r(t), n.d(t, {
        VIDEO_EXTENSIONS: () => r.VIDEO_EXTENSIONS,
        VIDEO_MIME_TYPES: () => r.VIDEO_MIME_TYPES,
        checkRules: () => i.checkRules,
        deleteFile: () => a.deleteFile,
        deleteFiles: () => a.deleteFiles,
        getFileData: () => a.getFileData,
        getFilesList: () => a.getFilesList,
        uploadFile: () => a.uploadFile
      });
      var r = n(245387),
        a = n(646472),
        i = n(112609)
    },
    535882: (e, t, n) => {
      n.r(t), n.d(t, {
        initSession: () => i
      });
      var r = n(245387),
        a = n(782579),
        i = function(e) {
          var t = e.data;
          return (0, a.authorizedRequest)({
            data: {
              url: "".concat(r.DRIVE_BASE_URL, "/v1.0/sessions"),
              data: t,
              method: "POST"
            }
          })()
        }
    },
    782579: (e, t, n) => {
      n.r(t), n.d(t, {
        authorizedRequest: () => v,
        updateDriveToken: () => b
      });
      var r = n(629133),
        a = n.n(r),
        i = n(926168),
        o = n(104737);

      function u(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function s(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              u(i, r, a, o, s, "next", e)
            }

            function s(e) {
              u(i, r, a, o, s, "throw", e)
            }
            o(void 0)
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

      function l(e) {
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
      }

      function f(e, t) {
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

      function d(e, t) {
        var n, r, a, i, o = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return i = {
          next: u(0),
          throw: u(1),
          return: u(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
          return this
        }), i;

        function u(i) {
          return function(u) {
            return function(i) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; o;) try {
                if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                  case 0:
                  case 1:
                    a = i;
                    break;
                  case 4:
                    return o.label++, {
                      value: i[1],
                      done: !1
                    };
                  case 5:
                    o.label++, r = i[1], i = [0];
                    continue;
                  case 7:
                    i = o.ops.pop(), o.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                      o = 0;
                      continue
                    }
                    if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                      o.label = i[1];
                      break
                    }
                    if (6 === i[0] && o.label < a[1]) {
                      o.label = a[1], a = i;
                      break
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2], o.ops.push(i);
                      break
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue
                }
                i = t.call(e, o)
              } catch (e) {
                i = [6, e], r = 0
              } finally {
                n = a = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, u])
          }
        }
      }
      var p, h = new Map,
        y = (p = s((function(e) {
          return d(this, (function(t) {
            return [2, o.default.request({
              url: "/ajax/v4/files/issue_token",
              method: "POST",
              data: e
            })]
          }))
        })), function(e) {
          return p.apply(this, arguments)
        }),
        b = function() {
          var e = s((function(e) {
            var t, n, r, o, u, s, c, l, f, p, b, v, m, g;
            return d(this, (function(d) {
              switch (d.label) {
                case 0:
                  return n = (t = e || {}).elementId, r = void 0 === n ? null : n, o = t.elementType, u = void 0 === o ? null : o, s = t.leadElementId, c = void 0 === s ? null : s, l = t.shouldForceUpdate, f = void 0 !== l && l, p = "", r && u && (b = a().some(APP.element_types, (function(e) {
                    return e === u
                  })), p = {
                    entityId: r,
                    entityType: b ? (0, i.convertElementType)(u, "string") : u
                  }, c && (p.parent = {
                    entityId: c,
                    entityType: "leads"
                  })), v = JSON.stringify(p), (m = h.get(v)) && !f ? [2, m] : [4, y(v)];
                case 1:
                  return g = d.sent().token, h.set(v, g), [2, g]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        v = function(e) {
          var t = e.data,
            n = function(e, t) {
              if (null == e) return {};
              var n, r, a = function(e, t) {
                if (null == e) return {};
                var n, r, a = {},
                  i = Object.keys(e);
                for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || (a[n] = e[n]);
                return a
              }(e, t);
              if (Object.getOwnPropertySymbols) {
                var i = Object.getOwnPropertySymbols(e);
                for (r = 0; r < i.length; r++) n = i[r], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (a[n] = e[n])
              }
              return a
            }(e, ["data"]),
            r = function() {
              var e = s((function() {
                var e, r, a;
                return d(this, (function(i) {
                  switch (i.label) {
                    case 0:
                      return i.trys.push([0, 2, , 5]), [4, b()];
                    case 1:
                      return e = i.sent(), [2, o.default.request(f(l({}, t), {
                        xhrFields: {
                          withCredentials: !0
                        },
                        crossDomain: !0,
                        headers: {
                          "X-Auth-Token": e
                        }
                      }))];
                    case 2:
                      return 403 !== ((r = i.sent()) || {}).status ? [3, 4] : [4, b(f(l({}, n), {
                        shouldForceUpdate: !0
                      }))];
                    case 3:
                      return a = i.sent(), [2, o.default.request(f(l({}, t), {
                        xhrFields: {
                          withCredentials: !0
                        },
                        crossDomain: !0,
                        headers: {
                          "X-Auth-Token": a
                        }
                      }))];
                    case 4:
                      throw Error(r);
                    case 5:
                      return [2]
                  }
                }))
              }));
              return function() {
                return e.apply(this, arguments)
              }
            }();
          return r
        }
    },
    744741: (e, t, n) => {
      var r;
      n.r(t), n.d(t, {
          HttpStatusCode: () => r
        }),
        function(e) {
          e[e.BAD_REQUEST = 400] = "BAD_REQUEST", e[e.UNAUTHORIZED = 401] = "UNAUTHORIZED", e[e.PAYMENT_REQUIRED = 402] = "PAYMENT_REQUIRED", e[e.FORBIDDEN = 403] = "FORBIDDEN", e[e.NOT_FOUND = 404] = "NOT_FOUND", e[e.INTERNAL_SERVER_ERROR = 500] = "INTERNAL_SERVER_ERROR", e[e.BAD_GATEWAY = 502] = "BAD_GATEWAY", e[e.SERVICE_UNAVAILABLE = 503] = "SERVICE_UNAVAILABLE", e[e.GATEWAY_TIMEOUT = 504] = "GATEWAY_TIMEOUT", e[e.NETWORK_CONNECT_TIMEOUT_ERROR = 599] = "NETWORK_CONNECT_TIMEOUT_ERROR"
        }(r || (r = {}))
    },
    656211: (e, t, n) => {
      n.r(t), n.d(t, {
        generateIifeBlob: () => r.generateIifeBlob
      });
      var r = n(526161)
    },
    577376: (e, t, n) => {
      n.r(t), n.d(t, {
        convertHeic: () => m
      });
      var r = n(629133),
        a = n.n(r),
        i = n(960956),
        o = n(717068),
        u = n(923345),
        s = n(520366);

      function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function l(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function f(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              l(i, r, a, o, u, "next", e)
            }

            function u(e) {
              l(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function d(e, t) {
        return function(e) {
          if (Array.isArray(e)) return e
        }(e) || function(e, t) {
          var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != n) {
            var r, a, i = [],
              o = !0,
              u = !1;
            try {
              for (n = n.call(e); !(o = (r = n.next()).done) && (i.push(r.value), !t || i.length !== t); o = !0);
            } catch (e) {
              u = !0, a = e
            } finally {
              try {
                o || null == n.return || n.return()
              } finally {
                if (u) throw a
              }
            }
            return i
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

      function p(e, t) {
        var n, r, a, i, o = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return i = {
          next: u(0),
          throw: u(1),
          return: u(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
          return this
        }), i;

        function u(i) {
          return function(u) {
            return function(i) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; o;) try {
                if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                  case 0:
                  case 1:
                    a = i;
                    break;
                  case 4:
                    return o.label++, {
                      value: i[1],
                      done: !1
                    };
                  case 5:
                    o.label++, r = i[1], i = [0];
                    continue;
                  case 7:
                    i = o.ops.pop(), o.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                      o = 0;
                      continue
                    }
                    if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                      o.label = i[1];
                      break
                    }
                    if (6 === i[0] && o.label < a[1]) {
                      o.label = a[1], a = i;
                      break
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2], o.ops.push(i);
                      break
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue
                }
                i = t.call(e, o)
              } catch (e) {
                i = [6, e], r = 0
              } finally {
                n = a = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, u])
          }
        }
      }
      var h, y = (h = f((function() {
          var e, t, n;
          return p(this, (function(r) {
            switch (r.label) {
              case 0:
                if (a().isUndefined(OffscreenCanvas)) throw new Error("OffscreenCanvas is not supported.");
                return [4, Promise.all([(0, u.isWebWorkerAvailable)(), (0, s.isWasmAvailable)()])];
              case 1:
                if (e = d.apply(void 0, [r.sent(), 2]), t = e[0], n = e[1], t !== u.WorkerSupportStatus.OK) throw new Error("Worker is not available: ".concat(t));
                if (n !== s.WasmSupportStatus.OK) throw new Error("WebAssembly not supported: ".concat(n));
                return [2]
            }
          }))
        })), function() {
          return h.apply(this, arguments)
        }),
        b = function() {
          var e = f((function(e) {
            var t, n, r, o, u, s;
            return p(this, (function(c) {
              switch (c.label) {
                case 0:
                  return [4, import(i)];
                case 1:
                  if (t = c.sent(), !(n = t.default)) throw new Error("libheif not available after loading");
                  return [4, e.arrayBuffer()];
                case 2:
                  return r = c.sent(), o = n(), u = new o.HeifDecoder, !(s = u.decode(new Uint8Array(r))) || a().isEmpty(s) ? [2, []] : [2, s]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        v = function() {
          var e = f((function(e) {
            var t, n, r, a, i, u;
            return p(this, (function(s) {
              switch (s.label) {
                case 0:
                  if (t = e.get_width(), n = e.get_height(), r = new OffscreenCanvas(t, n), !(a = r.getContext("2d"))) throw new Error("Failed to get canvas context");
                  return i = a.createImageData(t, n), u = new o.SplitPromise, e.display(i, (function(e) {
                    e ? (a.putImageData(e, 0, 0), u.resolve()) : u.reject(new Error("HEIF processing error"))
                  })), [4, u.promise];
                case 1:
                  return s.sent(), [2, r.convertToBlob({
                    type: "image/jpeg",
                    quality: 1
                  })]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        m = function() {
          var e = f((function(e) {
            var t, n, r, i;
            return p(this, (function(o) {
              switch (o.label) {
                case 0:
                  return o.trys.push([0, 4, , 5]), [4, y()];
                case 1:
                  return o.sent(), [4, b(e)];
                case 2:
                  return t = o.sent(), a().isEmpty(t) ? [2, e] : [4, Promise.all(t.map(v))];
                case 3:
                  return [2, 1 === (n = o.sent()).length ? n[0] : n];
                case 4:
                  throw u = r = o.sent(), s = Error, i = (null != s && "undefined" != typeof Symbol && s[Symbol.hasInstance] ? s[Symbol.hasInstance](u) : u instanceof s) ? r.message : JSON.stringify(r), new Error("Failed to convert HEIC image with libheif-js: ".concat(i));
                case 5:
                  return [2]
              }
              var u, s
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    805922: (e, t, n) => {
      function r(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      n.r(t), n.d(t, {
        generateBlobFromFile: () => u
      });
      var a, i, o = function(e) {
          return new Promise((function(t, n) {
            var r = new FileReader;
            r.onload = function(e) {
              var r, a = null === (r = e.target) || void 0 === r ? void 0 : r.result;
              a ? t(a) : n(new Error("Failed to read file data"))
            }, r.onerror = function() {
              n(new Error("Failed to read file"))
            }, r.readAsDataURL(e)
          }))
        },
        u = (a = function(e) {
          var t, n, r, a, i, u;
          return function(e, t) {
            var n, r, a, i, o = {
              label: 0,
              sent: function() {
                if (1 & a[0]) throw a[1];
                return a[1]
              },
              trys: [],
              ops: []
            };
            return i = {
              next: u(0),
              throw: u(1),
              return: u(2)
            }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
              return this
            }), i;

            function u(i) {
              return function(u) {
                return function(i) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; o;) try {
                    if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                    switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                      case 0:
                      case 1:
                        a = i;
                        break;
                      case 4:
                        return o.label++, {
                          value: i[1],
                          done: !1
                        };
                      case 5:
                        o.label++, r = i[1], i = [0];
                        continue;
                      case 7:
                        i = o.ops.pop(), o.trys.pop();
                        continue;
                      default:
                        if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                          o = 0;
                          continue
                        }
                        if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                          o.label = i[1];
                          break
                        }
                        if (6 === i[0] && o.label < a[1]) {
                          o.label = a[1], a = i;
                          break
                        }
                        if (a && o.label < a[2]) {
                          o.label = a[2], o.ops.push(i);
                          break
                        }
                        a[2] && o.ops.pop(), o.trys.pop();
                        continue
                    }
                    i = t.call(e, o)
                  } catch (e) {
                    i = [6, e], r = 0
                  } finally {
                    n = a = 0
                  }
                  if (5 & i[0]) throw i[1];
                  return {
                    value: i[0] ? i[1] : void 0,
                    done: !0
                  }
                }([i, u])
              }
            }
          }(this, (function(s) {
            switch (s.label) {
              case 0:
                return t = e.file, [4, o(t)];
              case 1:
                return n = s.sent(), r = atob(n.split(",")[1]), a = Array.from(r, (function(e) {
                  return e.charCodeAt(0)
                })), i = new Uint8Array(a), u = new Blob([i], {
                  type: t.type
                }), [2, {
                  blobUrl: URL.createObjectURL(u),
                  blob: u
                }]
            }
          }))
        }, i = function() {
          var e = this,
            t = arguments;
          return new Promise((function(n, i) {
            var o = a.apply(e, t);

            function u(e) {
              r(o, n, i, u, s, "next", e)
            }

            function s(e) {
              r(o, n, i, u, s, "throw", e)
            }
            u(void 0)
          }))
        }, function(e) {
          return i.apply(this, arguments)
        })
    },
    709827: (e, t, n) => {
      n.r(t), n.d(t, {
        getHeicImagePreview: () => c
      });
      var r = n(629133),
        a = n.n(r),
        i = n(577376);

      function o(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      var u, s, c = (u = function(e) {
        var t, n, r, o, u, s, c, l;
        return function(e, t) {
          var n, r, a, i, o = {
            label: 0,
            sent: function() {
              if (1 & a[0]) throw a[1];
              return a[1]
            },
            trys: [],
            ops: []
          };
          return i = {
            next: u(0),
            throw: u(1),
            return: u(2)
          }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
            return this
          }), i;

          function u(i) {
            return function(u) {
              return function(i) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; o;) try {
                  if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                  switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                    case 0:
                    case 1:
                      a = i;
                      break;
                    case 4:
                      return o.label++, {
                        value: i[1],
                        done: !1
                      };
                    case 5:
                      o.label++, r = i[1], i = [0];
                      continue;
                    case 7:
                      i = o.ops.pop(), o.trys.pop();
                      continue;
                    default:
                      if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                        o = 0;
                        continue
                      }
                      if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                        o.label = i[1];
                        break
                      }
                      if (6 === i[0] && o.label < a[1]) {
                        o.label = a[1], a = i;
                        break
                      }
                      if (a && o.label < a[2]) {
                        o.label = a[2], o.ops.push(i);
                        break
                      }
                      a[2] && o.ops.pop(), o.trys.pop();
                      continue
                  }
                  i = t.call(e, o)
                } catch (e) {
                  i = [6, e], r = 0
                } finally {
                  n = a = 0
                }
                if (5 & i[0]) throw i[1];
                return {
                  value: i[0] ? i[1] : void 0,
                  done: !0
                }
              }([i, u])
            }
          }
        }(this, (function(f) {
          switch (f.label) {
            case 0:
              return n = e.file, [4, (0, i.convertHeic)(n)];
            case 1:
              return r = f.sent(), o = a().isArray(r) ? r[0] : r, u = URL.createObjectURL(o), s = (null === (t = u.split("/").pop()) || void 0 === t ? void 0 : t.split("#")[0]) || n.lastModified, c = n.name.replace(/\.(heic|heif)$/i, "_".concat(s, ".jpg")), l = new File([o], c, {
                type: "image/jpeg"
              }), [2, {
                previewUrl: u,
                blob: o,
                convertedFile: l
              }]
          }
        }))
      }, s = function() {
        var e = this,
          t = arguments;
        return new Promise((function(n, r) {
          var a = u.apply(e, t);

          function i(e) {
            o(a, n, r, i, s, "next", e)
          }

          function s(e) {
            o(a, n, r, i, s, "throw", e)
          }
          i(void 0)
        }))
      }, function(e) {
        return s.apply(this, arguments)
      })
    },
    593723: (e, t, n) => {
      n.r(t), n.d(t, {
        getImagePreview: () => d
      });
      var r = n(629133),
        a = n.n(r),
        i = n(643095),
        o = n(169867),
        u = n(709827);

      function s(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      var c, l, f = function(e) {
          return new Promise((function(t, n) {
            var r = new FileReader;
            r.onload = function(e) {
              var r, i = null === (r = e.target) || void 0 === r ? void 0 : r.result;
              a().isString(i) ? t(i) : n(new Error("Failed to read file as data URL"))
            }, r.onerror = function() {
              return n(new Error("FileReader error"))
            }, r.readAsDataURL(e)
          }))
        },
        d = (c = function(e) {
          var t, n, r, s, c, l, d;
          return function(e, t) {
            var n, r, a, i, o = {
              label: 0,
              sent: function() {
                if (1 & a[0]) throw a[1];
                return a[1]
              },
              trys: [],
              ops: []
            };
            return i = {
              next: u(0),
              throw: u(1),
              return: u(2)
            }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
              return this
            }), i;

            function u(i) {
              return function(u) {
                return function(i) {
                  if (n) throw new TypeError("Generator is already executing.");
                  for (; o;) try {
                    if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                    switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                      case 0:
                      case 1:
                        a = i;
                        break;
                      case 4:
                        return o.label++, {
                          value: i[1],
                          done: !1
                        };
                      case 5:
                        o.label++, r = i[1], i = [0];
                        continue;
                      case 7:
                        i = o.ops.pop(), o.trys.pop();
                        continue;
                      default:
                        if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                          o = 0;
                          continue
                        }
                        if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                          o.label = i[1];
                          break
                        }
                        if (6 === i[0] && o.label < a[1]) {
                          o.label = a[1], a = i;
                          break
                        }
                        if (a && o.label < a[2]) {
                          o.label = a[2], o.ops.push(i);
                          break
                        }
                        a[2] && o.ops.pop(), o.trys.pop();
                        continue
                    }
                    i = t.call(e, o)
                  } catch (e) {
                    i = [6, e], r = 0
                  } finally {
                    n = a = 0
                  }
                  if (5 & i[0]) throw i[1];
                  return {
                    value: i[0] ? i[1] : void 0,
                    done: !0
                  }
                }([i, u])
              }
            }
          }(this, (function(p) {
            switch (p.label) {
              case 0:
                if (!(0, o.isHeicHeifImage)(e)) return [3, 5];
                p.label = 1;
              case 1:
                return p.trys.push([1, 3, , 5]), [4, (0, u.getHeicImagePreview)({
                  file: e
                })];
              case 2:
                return t = p.sent(), n = t.convertedFile, r = t.previewUrl, [2, {
                  file: n,
                  previewUrl: r,
                  type: "image"
                }];
              case 3:
                return s = p.sent(), (0, i.captureException)(s), [4, f(e)];
              case 4:
                return c = p.sent(), [2, {
                  file: e,
                  previewUrl: c,
                  type: "application"
                }];
              case 5:
                return [4, f(e)];
              case 6:
                return l = p.sent(), d = function(e) {
                  if ((0, o.isHeicHeifImage)(e)) return "image";
                  var t = e.type;
                  switch (a().first(t.split("/"))) {
                    case "image":
                      return "image";
                    case "video":
                      return "video";
                    case "document":
                      return "document";
                    default:
                      return "application"
                  }
                }(e), [2, {
                  file: e,
                  previewUrl: l,
                  type: d
                }]
            }
          }))
        }, l = function() {
          var e = this,
            t = arguments;
          return new Promise((function(n, r) {
            var a = c.apply(e, t);

            function i(e) {
              s(a, n, r, i, o, "next", e)
            }

            function o(e) {
              s(a, n, r, i, o, "throw", e)
            }
            i(void 0)
          }))
        }, function(e) {
          return l.apply(this, arguments)
        })
    },
    628612: (e, t, n) => {
      n.r(t), n.d(t, {
        HEIC_HEIF_MIME_TYPES: () => u.HEIC_HEIF_MIME_TYPES,
        generateBlobFromFile: () => r.generateBlobFromFile,
        getHeicImagePreview: () => s.getHeicImagePreview,
        getImagePreview: () => o.getImagePreview,
        isHeicHeifImage: () => u.isHeicHeifImage,
        setFallbackImage: () => a.setFallbackImage,
        svgToPng: () => i.svgToPng
      });
      var r = n(805922),
        a = n(925458),
        i = n(840307),
        o = n(593723),
        u = n(169867),
        s = n(709827)
    },
    169867: (e, t, n) => {
      n.r(t), n.d(t, {
        HEIC_HEIF_MIME_TYPES: () => i,
        isHeicHeifImage: () => u
      });
      var r = n(629133),
        a = n.n(r),
        i = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"],
        o = [".heic", ".heif"],
        u = function(e) {
          if (e.type) {
            var t = e.type.toLowerCase();
            if (a().contains(i, t)) return !0
          }
          if (e.name) {
            var n = e.name.toLowerCase();
            return a().some(o, (function(e) {
              return n.endsWith(e)
            }))
          }
          return !1
        }
    },
    925458: (e, t, n) => {
      n.r(t), n.d(t, {
        setFallbackImage: () => a
      }), n(827378);
      var r = n(445368),
        a = function(e) {
          var t = APP.constant("user").id;
          e.currentTarget.src = (0, r.getDefaultAvatar)(t)
        }
    },
    840307: (e, t, n) => {
      n.r(t), n.d(t, {
        svgToPng: () => r
      });
      var r = function(e) {
        var t = e.svgString,
          n = e.onLoad,
          r = e.width,
          a = void 0 === r ? 300 : r,
          i = e.height,
          o = void 0 === i ? 300 : i,
          u = new Image,
          s = new Blob([t], {
            type: "image/svg+xml;charset=utf-8"
          }),
          c = URL.createObjectURL(s);
        u.onload = function() {
          var e = document.createElement("canvas");
          e.width = a, e.height = o;
          var t = e.getContext("2d");
          null == t || t.drawImage(u, 0, 0, a, o);
          var r = e.toDataURL("image/png");
          URL.revokeObjectURL(c), n(r)
        }, u.src = c
      }
    },
    926969: (e, t, n) => {
      n.r(t), n.d(t, {
        isVideo: () => o
      });
      var r = n(629133),
        a = n.n(r),
        i = n(807160),
        o = function(e) {
          var t = e.type,
            n = e.name;
          if (i.VIDEO_MIME_TYPES.includes(t)) return !0;
          if (a().isString(n)) {
            var r = n.toLowerCase();
            return i.VIDEO_EXTENSIONS.some((function(e) {
              return r.endsWith(e)
            }))
          }
          return !1
        }
    },
    520366: (e, t, n) => {
      n.r(t), n.d(t, {
        WasmSupportStatus: () => r.WasmSupportStatus,
        isWasmAvailable: () => r.isWasmAvailable
      });
      var r = n(763143)
    },
    763143: (e, t, n) => {
      n.r(t), n.d(t, {
        WasmSupportStatus: () => r,
        isWasmAvailable: () => d
      });
      var r, a = n(629133),
        i = n.n(a),
        o = n(334016);

      function u(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function s(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              u(i, r, a, o, s, "next", e)
            }

            function s(e) {
              u(i, r, a, o, s, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function c(e, t) {
        var n, r, a, i, o = {
          label: 0,
          sent: function() {
            if (1 & a[0]) throw a[1];
            return a[1]
          },
          trys: [],
          ops: []
        };
        return i = {
          next: u(0),
          throw: u(1),
          return: u(2)
        }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
          return this
        }), i;

        function u(i) {
          return function(u) {
            return function(i) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; o;) try {
                if (n = 1, r && (a = 2 & i[0] ? r.return : i[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, i[1])).done) return a;
                switch (r = 0, a && (i = [2 & i[0], a.value]), i[0]) {
                  case 0:
                  case 1:
                    a = i;
                    break;
                  case 4:
                    return o.label++, {
                      value: i[1],
                      done: !1
                    };
                  case 5:
                    o.label++, r = i[1], i = [0];
                    continue;
                  case 7:
                    i = o.ops.pop(), o.trys.pop();
                    continue;
                  default:
                    if (!((a = (a = o.trys).length > 0 && a[a.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                      o = 0;
                      continue
                    }
                    if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
                      o.label = i[1];
                      break
                    }
                    if (6 === i[0] && o.label < a[1]) {
                      o.label = a[1], a = i;
                      break
                    }
                    if (a && o.label < a[2]) {
                      o.label = a[2], o.ops.push(i);
                      break
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue
                }
                i = t.call(e, o)
              } catch (e) {
                i = [6, e], r = 0
              } finally {
                n = a = 0
              }
              if (5 & i[0]) throw i[1];
              return {
                value: i[0] ? i[1] : void 0,
                done: !0
              }
            }([i, u])
          }
        }
      }

      function l() {
        return f.apply(this, arguments)
      }

      function f() {
        return (f = s((function() {
          return c(this, (function(e) {
            switch (e.label) {
              case 0:
                return [4, Promise.all([(0, o.bulkMemory)(), (0, o.simd)(), (0, o.referenceTypes)()])];
              case 1:
                return [2, e.sent().every((function(e) {
                  return e
                }))]
            }
          }))
        }))).apply(this, arguments)
      }

      function d() {
        return p.apply(this, arguments)
      }

      function p() {
        return (p = s((function() {
          return c(this, (function(e) {
            switch (e.label) {
              case 0:
                return e.trys.push([0, 2, , 3]), i().isObject(WebAssembly) && i().isFunction(WebAssembly.instantiate) && i().isFunction(WebAssembly.Module) ? [4, l()] : [2, "unsupported"];
              case 1:
                return e.sent() ? [2, "ok"] : [2, "partial"];
              case 2:
                return e.sent(), [2, "init-failed"];
              case 3:
                return [2]
            }
          }))
        }))).apply(this, arguments)
      }! function(e) {
        e.OK = "ok", e.PARTIAL = "partial", e.UNSUPPORTED = "unsupported", e.INIT_FAILED = "init-failed"
      }(r || (r = {}))
    },
    923345: (e, t, n) => {
      n.r(t), n.d(t, {
        WorkerSupportStatus: () => r.WorkerSupportStatus,
        isWebWorkerAvailable: () => r.isWebWorkerAvailable
      });
      var r = n(690335)
    },
    690335: (e, t, n) => {
      n.r(t), n.d(t, {
        WorkerSupportStatus: () => r,
        isWebWorkerAvailable: () => s
      });
      var r, a = n(629133),
        i = n.n(a),
        o = n(656211),
        u = 500;

      function s() {
        return new Promise((function(e) {
          if (!window.Worker) return e("unsupported");
          var t = null,
            n = null,
            r = function(t, r) {
              r && clearTimeout(r), n && n.terminate(), e(t)
            };
          try {
            var a = (0, o.generateIifeBlob)((function() {
              onmessage = function() {
                postMessage("pong")
              }
            }));
            if (i().isNull(a)) return r("init-failed");
            n = new Worker(a), t = setTimeout((function() {
              r("timeout", t)
            }), u), n.onmessage = function(e) {
              "pong" === e.data ? r("ok", t) : r("init-failed", t)
            }, n.onerror = function() {
              r("init-failed", t)
            }, n.postMessage("ping")
          } catch (e) {
            r("init-failed", t)
          }
        }))
      }! function(e) {
        e.OK = "ok", e.UNSUPPORTED = "unsupported", e.TIMEOUT = "timeout", e.INIT_FAILED = "init-failed"
      }(r || (r = {}))
    },
    717068: (e, t, n) => {
      n.r(t), n.d(t, {
        SplitPromise: () => o
      });
      var r = n(629133),
        a = n.n(r);

      function i(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var o = function e() {
        var t = this;
        ! function(e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }(this, e), i(this, "promise", void 0), i(this, "resolve", a().noop), i(this, "reject", a().noop), this.promise = new Promise((function(e, n) {
          t.resolve = e, t.reject = n
        }))
      }
    },
    960956: (e, t, n) => {
      e.exports = n.p + "npm/libheif-js@1.19.8/libheif-wasm/libheif-bundle.mjs"
    },
    334016: (e, t, n) => {
      n.r(t), n.d(t, {
        bigInt: () => r,
        bulkMemory: () => a,
        exceptions: () => i,
        exceptionsFinal: () => o,
        extendedConst: () => u,
        gc: () => s,
        jsStringBuiltins: () => c,
        jspi: () => l,
        memory64: () => f,
        multiMemory: () => d,
        multiValue: () => p,
        mutableGlobals: () => h,
        referenceTypes: () => y,
        relaxedSimd: () => b,
        saturatedFloatToInt: () => v,
        signExtensions: () => m,
        simd: () => g,
        streamingCompilation: () => _,
        tailCall: () => w,
        threads: () => E,
        typeReflection: () => A,
        typedFunctionReferences: () => T
      });
      const r = () => (async e => {
          try {
            return (await WebAssembly.instantiate(e)).instance.exports.b(BigInt(0)) === BigInt(0)
          } catch (e) {
            return !1
          }
        })(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 126, 1, 126, 3, 2, 1, 0, 7, 5, 1, 1, 98, 0, 0, 10, 6, 1, 4, 0, 32, 0, 11])),
        a = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 3, 1, 0, 1, 10, 14, 1, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11])), i = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 6, 64, 25, 11, 11])), o = () => (async () => {
          try {
            return new WebAssembly.Module(Uint8Array.from(atob("AGFzbQEAAAABBAFgAAADAgEAChABDgACaR9AAQMAAAsACxoL"), (e => e.codePointAt(0)))), !0
          } catch (e) {
            return !1
          }
        })(), u = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 5, 3, 1, 0, 1, 11, 9, 1, 0, 65, 1, 65, 2, 106, 11, 0])), s = () => (async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 95, 1, 120, 0])))(), c = () => (async () => {
          try {
            return await WebAssembly.instantiate(Uint8Array.from(atob("AGFzbQEAAAABBgFgAW8BfwIXAQ53YXNtOmpzLXN0cmluZwR0ZXN0AAA="), (e => e.codePointAt(0))), {}, {
              builtins: ["js-string"]
            }), !0
          } catch (e) {
            return !1
          }
        })(), l = () => (async () => "Suspending" in WebAssembly)(), f = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 5, 3, 1, 4, 1])), d = () => (async () => {
          try {
            return new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 5, 5, 2, 0, 0, 0, 0])), !0
          } catch (e) {
            return !1
          }
        })(), p = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 0, 2, 127, 127, 3, 2, 1, 0, 10, 8, 1, 6, 0, 65, 0, 65, 0, 11])), h = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 2, 8, 1, 1, 97, 1, 98, 3, 127, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 5, 1, 1, 97, 3, 1])), y = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 7, 1, 5, 0, 208, 112, 26, 11])), b = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 15, 1, 13, 0, 65, 1, 253, 15, 65, 2, 253, 15, 253, 128, 2, 11])), v = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 12, 1, 10, 0, 67, 0, 0, 0, 0, 252, 0, 26, 11])), m = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6, 0, 65, 0, 192, 26, 11])), g = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11])), _ = () => (async () => "compileStreaming" in WebAssembly)(), w = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 6, 1, 4, 0, 18, 0, 11])), E = () => (async e => {
          try {
            return "undefined" != typeof MessageChannel && (new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(e)
          } catch (e) {
            return !1
          }
        })(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11])), A = () => (async () => "Function" in WebAssembly)(), T = () => (async () => {
          try {
            return new WebAssembly.Module(Uint8Array.from(atob("AGFzbQEAAAABEANgAX8Bf2ABZAABf2AAAX8DBAMBAAIJBQEDAAEBChwDCwBBCkEqIAAUAGoLBwAgAEEBagsGANIBEAAL"), (e => e.codePointAt(0)))), !0
          } catch (e) {
            return !1
          }
        })()
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "82132e32-19b2-4711-b959-5ff1de0786d8", e._sentryDebugIdIdentifier = "sentry-dbid-82132e32-19b2-4711-b959-5ff1de0786d8")
    } catch (e) {}
  }();
//# sourceMappingURL=32760.93b89785a153716903ea.js.map