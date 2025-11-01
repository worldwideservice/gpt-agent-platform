"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [605], {
    923703: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => c
      });
      var r, a = n(629133),
        i = n.n(a),
        o = n(444459),
        s = function() {
          (r = new o.default("/api/v1.1")).loadBackendVersion()
        };
      i().extend(s.prototype, {
        linkLead: function(e, t) {
          var n = r.makeUrl("/account_id/mail/leads/link"),
            a = {
              lead_id: t,
              thread_id: e
            };
          return r.request("POST", n, a)
        },
        unlinkLead: function(e) {
          var t = r.makeUrl("/account_id/mail/leads/unlink"),
            n = {
              thread_id: e
            };
          return r.request("POST", t, n)
        },
        getAddressesWithoutContact: function(e) {
          var t = r.makeUrl("/account_id/mail/address"),
            n = {
              thread_ids: e,
              type: "without_contact"
            };
          return r.request("GET", t, n)
        },
        linkAddress: function(e, t) {
          var n = r.makeUrl("/account_id/mail/address/link"),
            a = {
              id: t,
              address_id: e
            };
          return r.request("POST", n, a)
        },
        listThreads: function(e, t, n, a) {
          var i = r.makeUrl("/account_id/mail/list"),
            o = {
              page: t || 1,
              folder: e,
              mailbox_id: n
            };
          return r.request("GET", i, o, {}, a || {})
        },
        restoreThreads: function(e) {
          var t = r.makeUrl("/account_id/mail/threads/restore"),
            n = {
              threads: e
            };
          return r.request("POST", t, n)
        },
        deleteThreads: function(e) {
          var t = r.makeUrl("/account_id/mail/threads/delete"),
            n = i().extend({}, {
              threads: e
            });
          return r.request("POST", t, n)
        },
        createEntitiesFromThreads: function(e, t, n) {
          var a = r.makeUrl("/account_id/mail/".concat(t)),
            o = i().extend({}, n, {
              threads: e
            });
          return r.request("POST", a, o)
        },
        deleteMailbox: function(e) {
          var t = r.makeUrl("/account_id/mail/mailboxes/".concat(e, "/delete"));
          return r.request("POST", t)
        },
        enableMailbox: function(e, t) {
          var n = r.makeUrl("/account_id/mail/mailboxes/".concat(e, "/connect"));
          return r.request("POST", n, t)
        },
        disableMailbox: function(e) {
          var t = r.makeUrl("/account_id/mail/mailboxes/".concat(e, "/disconnect"));
          return r.request("POST", t)
        },
        syncMailbox: function(e) {
          var t = r.makeUrl("/account_id/mail/mailboxes/".concat(e, "/sync"));
          return r.request("POST", t)
        },
        addMailbox: function(e) {
          var t = r.makeUrl("/account_id/mail/mailboxes");
          return r.request("POST", t, e)
        },
        saveMailbox: function(e, t, n) {
          var a = r.makeUrl("/account_id/mail/mailboxes/".concat(e, "?save=").concat(n));
          return r.request("POST", a, t)
        },
        getMailbox: function(e) {
          var t = r.makeUrl("/account_id/mail/mailboxes/".concat(e));
          return r.request("GET", t)
        },
        getMailboxes: function(e) {
          var t = r.makeUrl("/account_id/mail/mailboxes");
          return r.request("GET", t, e)
        },
        getMailboxStatus: function(e) {
          var t = r.makeUrl("/account_id/mail/mailboxes/status"),
            n = {
              id: e
            };
          return r.request("GET", t, n)
        },
        getCounters: function() {
          var e = r.makeUrl("/account_id/mail/mailboxes/counters");
          return r.request("GET", e)
        },
        getThread: function(e, t, n) {
          var a = r.makeUrl("/account_id/mail/threads/".concat(e));
          return r.request("GET", a, t || {}, {}, n)
        },
        getMessage: function(e) {
          var t = r.makeUrl("/account_id/mail/messages/".concat(e));
          return r.request("GET", t)
        },
        readThread: function(e, t) {
          var n = r.makeUrl("/account_id/mail/threads/view"),
            a = {
              threads: e
            };
          return r.request("POST", n, a, {}, t)
        },
        shareThread: function(e, t) {
          var n = r.makeUrl("/account_id/mail/threads/share"),
            a = i().extend(t, {
              threads: e
            });
          return r.request("POST", n, a)
        },
        findSettings: function(e) {
          var t = r.makeUrl("/account_id/mail/settings"),
            n = {
              email: e
            };
          return r.request("GET", t, n)
        },
        getThreadReplyData: function(e) {
          var t = r.makeUrl("/account_id/mail/threads/".concat(e, "/reply"));
          return r.request("GET", t)
        },
        composeReply: function(e, t) {
          var n = e ? "threads/".concat(e, "/reply") : "reply",
            a = r.makeUrl("/account_id/mail/".concat(n));
          return r.request("POST", a, t)
        },
        composeMailing: function(e) {
          var t = r.makeUrl("/account_id/mail/compose");
          return r.request("POST", t, e)
        },
        getRecipients: function(e) {
          var t = r.makeUrl("/account_id/mail/threads/recipients");
          return r.request("GET", t, e)
        },
        getMailTemplates: function(e) {
          var t = r.makeUrl("/account_id/mail/templates");
          return r.request("GETJSON", t, e)
        },
        createMailTemplate: function(e) {
          var t = r.makeUrl("/account_id/mail/templates");
          return r.request("POST", t, e)
        },
        updateMailTemplate: function(e) {
          var t = r.makeUrl("/account_id/mail/templates/".concat(e.id));
          return r.request("POST", t, e)
        },
        removeMailTemplate: function(e) {
          var t = r.makeUrl("/account_id/mail/templates/".concat(e.id, "/delete"));
          return r.request("POST", t, e)
        },
        updateMailTemplatesSort: function(e) {
          var t = r.makeUrl("/account_id/mail/templates/sort");
          return r.request("POST", t, e)
        }
      });
      const c = new s;
      var u = "../build/transpiled/components/mail/api";
      window.define(u, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([u])
    },
    444459: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => d
      });
      var r = n(629133),
        a = n.n(r),
        i = n(661533),
        o = n.n(i),
        s = n(12615),
        c = n(509372);

      function u(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }
      var l = function(e, t) {
        this.base_path = e, this.headers = a().extend({
          "X-Requested-With": "XMLHttpRequest"
        }, t || {})
      };
      a().extend(l.prototype, {
        loadBackendVersion: function() {
          var e;
          (e = (0, c.get)("amomail_backend")) && (e = JSON.parse(e), a().isString(e.backend) && (this.headers["X-App-Api-Backend"] = e.backend), this.headers["X-App-Version"] = e.version)
        },
        setBackendVersion: function(e, t) {
          if (a().isUndefined(e) && a().isUndefined(t) || a().isUndefined(t) && "current" === e) return (0, c.set)({
            name: "amomail_backend",
            value: "{}",
            expiredays: -1
          }), delete this.headers["X-App-Api-Backend"], void delete this.headers["X-App-Version"];
          e = e || "current", this.headers["X-App-Version"] = e;
          var n = {
            backend: null,
            version: e
          };
          a().isString(t) && (this.headers["X-App-Api-Backend"] = t, n.backend = t), (0, c.set)({
            name: "amomail_backend",
            expiredays: 1,
            value: JSON.stringify(n)
          })
        },
        getParams: function() {
          var e = APP.constant("amomail") || {};
          return {
            enabled: e.enabled,
            account_id: APP.constant("account").id,
            base_url: e.server_base + this.base_path,
            auth_token: e.auth_token || ""
          }
        },
        getAjaxDefaults: function(e) {
          var t = {
            xhrFields: {
              withCredentials: !0
            },
            contentType: "application/json; charset=UTF-8"
          };
          return t.headers = a().extend({}, this.headers, e || {}), t
        },
        resolveOnCache: function(e, t) {
          var n = o().Deferred(),
            r = a().bind((function() {
              for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
              n.resolve.apply(this, t)
            }), this),
            i = a().bind((function() {
              for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
              n.reject(this, t)
            }), this);
          return e.done((function(e, n, a) {
            304 === a.status ? t().done(r).fail(i) : r.apply(this, arguments)
          })).fail(i), n.promise()
        },
        makeRequest: function() {
          var e = Array.prototype.slice.call(arguments);
          return a().bind((function() {
            return this.request.apply(this, function(e) {
              if (Array.isArray(e)) return u(e)
            }(t = e) || function(e) {
              if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(t) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return u(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? u(e, t) : void 0
              }
            }(t) || function() {
              throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }());
            var t
          }), this)
        },
        checkAccount: function() {
          var e = this.getParams(),
            t = APP.constant("amomail");
          if (e.enabled || !APP.constant("amomail")) {
            var n = o().Deferred();
            return n.resolve(), n.promise()
          }
          var r = "".concat(t.server_base, "/api/v2/register"),
            i = APP.constant("account"),
            s = {
              account_id: i.id,
              domain: i.subdomain
            },
            c = a().extend(this.getAjaxDefaults(), {
              url: r,
              data: JSON.stringify(s),
              type: "POST",
              dataType: "json"
            }),
            u = o().ajax(c);
          return u.done((function() {
            t.enabled = !0
          })), u
        },
        makeUrl: function(e, t) {
          var n = this.getParams();
          return t = t || {}, n.account_id && (t.account_id = n.account_id), a().each(t, (function(t, n) {
            e = e.replace(n, t)
          })), n.base_url + e
        },
        _request: function(e, t, n, r, i) {
          var c = o().Deferred();
          r = r || {}, n = n || {}, "GET" !== e && (n = JSON.stringify(n), "GETJSON" === e ? r["X-Http-Method-Override"] = "GET" : "POST" !== e && (r["X-Http-Method-Override"] = e), e = "POST");
          var u = a().extend(this.getAjaxDefaults(r), {
            url: t,
            data: n,
            type: e,
            dataType: "json"
          }, i || {});
          return o().ajax(u).done((function() {
            c.resolve.apply(null, arguments)
          })).fail((function(e) {
            401 === e.status ? s.default.checkAuth((function() {
              return o().ajax(u)
            }), 0).done((function() {
              c.resolve.apply(null, arguments)
            })).fail((function() {
              c.reject.apply(null, arguments)
            })) : c.reject.apply(null, arguments)
          })), c.promise()
        },
        requestRaw: function(e, t) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
            i = arguments.length > 4 ? arguments[4] : void 0,
            s = a().extend({
              url: t,
              data: n,
              type: e,
              headers: r,
              dataType: "json"
            }, i || {});
          return o().ajax(s)
        },
        request: function(e, t, n, r, i) {
          var o = this;
          return this.checkAccount().always((function() {
            o.request = o._request
          })).then(a().bind(o._request, this, e, t, n, r, i))
        }
      });
      const d = l;
      var _ = "../build/transpiled/components/mail/base_api";
      window.define(_, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([_])
    },
    12615: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => m
      });
      var r = n(661533),
        a = n.n(r),
        i = n(629133),
        o = n.n(i),
        s = n(910),
        c = n(168807),
        u = n(11024),
        l = APP.constant("version"),
        d = APP.constant("version_backend"),
        _ = o().propertyOf(window)(["performance", "timing", "responseEnd"]) || 0,
        p = null;

      function f(e, t) {
        var n = Date.now() - _,
          r = a().Deferred();
        return n < (t = o().isNumber(t) ? t : 6e4) ? e().then(r.resolve, r.reject) : (_ = Date.now(), p || (p = a().ajax({
          url: "/private/ping.php"
        }).always((function() {
          p = null
        }))), p.done((function() {
          e().then(r.resolve, r.reject)
        })).fail(r.reject)), r.promise()
      }
      "production" === APP.environment && a()(document).ajaxComplete((function(e, t, n) {
        var r = APP.constant("server"),
          i = t.getResponseHeader("X-Core-Version"),
          _ = t.getResponseHeader("X-Core-Server"),
          p = t.getResponseHeader("X-Core-Version-Backend"),
          f = t.getResponseHeader("X-Generation-Time"),
          m = t.getResponseHeader("X-Generation-Time-System"),
          h = t.getResponseHeader("X-Core-Session-Token"),
          v = t.getResponseHeader("X-Core-Widgets-Cache-Version"),
          g = {},
          b = 0,
          A = t === APP.page_xhr,
          y = (0, s.getCallingStatus)(),
          T = o().isNull(i) || l === i,
          P = o().isNull(p) || d === p;
        _ && _ !== r && APP.constant("server", _), h && h !== APP.constant("session_token") && APP.constant("session_token", h), (f || m) && (b = f || m, a()(document).find(".generation-time").append("<br>".concat(b, " - ").concat(n.url))), T && P || y || (P && A || !P) && (window.location.href = document.URL), o().isEmpty(v) || (g[APP.getWidgetsArea()] = v, o().extend(APP.constant("widgets_cache_version"), g), c.storeWithExpiration.remove(u.default.getCacheCode()))
      }));
      const m = {
        check: function() {
          var e = a().Deferred();
          return e.resolve(), f(e.promise, 0)
        },
        checkAuth: f
      };
      var h = "../build/transpiled/core/updater";
      window.define(h, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([h])
    },
    11024: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => u
      });
      var r = n(629133),
        a = n.n(r),
        i = n(661586),
        o = n.n(i),
        s = n(926168),
        c = n(859200);
      const u = {
        getCacheCode: function() {
          var e = "".concat((0, s.getVersion)(), "_linked_types_cache_").concat(APP.lang_id, "_").concat((0, c.userID)()),
            t = (0, c.getRights)("catalog_rights") || {},
            n = a().map(t, (function(e, t) {
              var n = +(e.view !== c.RIGHTS_DENIED);
              return "".concat(t, ":").concat(n)
            }));
          return n.length && (e += "_".concat(o()(n.join("_")))), e
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
        KnownNavigationItemIdV2: () => a,
        addItem: () => A,
        removeItem: () => y,
        setActiveItemId: () => v,
        setTelephonyState: () => b,
        updateItemCounter: () => g
      });
      var r, a, i = n(500034);

      function o(e, t, n, r, a, i, o) {
        try {
          var s = e[i](o),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, a)
      }

      function s(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function s(e) {
              o(i, r, a, s, c, "next", e)
            }

            function c(e) {
              o(i, r, a, s, c, "throw", e)
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
            }([i, s])
          }
        }
      }! function(e) {
        e.CHATS = "chats", e.MAIL = "mail", e.TODO = "todo"
      }(r || (r = {})),
      function(e) {
        e.CHATS_INBOX = "chats", e.EMAIL_INBOX = "mail", e.EMAIL_RECEIVED = "email_received", e.TEAM_INBOX = "team_inbox", e.NOTIFICATIONS = "notifications", e.TASKS = "tasks", e.SETTINGS = "settings", e.FEEDBACK = "feedback", e.LEADS = "leads", e.CUSTOMERS = "customers", e.CHATS = "communications", e.CATALOGS = "catalogs", e.AI_AUTOMATION = "ai-automation", e.STATS = "stats", e.HELP = "help-center", e.WHATSAPP = "whatsapp", e.SETTINGS_WORKSPACE = "settings_workspace", e.SETTINGS_BILLING = "settings_billing", e.SETTINGS_NOTIFICATIONS = "settings_notifications", e.CONTACT_SUPPORT = "contact_support", e.AI_COPILOT = "ai_copilot", e.HELP_CENTER = "help_center", e.ADMINISTRATION = "support", e.DASHBOARD = "dashboard", e.ALL_LEADS = "all_leads", e.BROADCASTING = "broadcasting", e.TEMPLATES = "templates", e.CHAT_TEMPLATES = "chat_templates", e.WHATSAPP_FEATURES = "whatsapp_features", e.WHATSAPP_BROADCASTING = "whatsapp_broadcasting", e.WHATSAPP_AI_AGENT = "whatsapp_ai-agent", e.WHATSAPP_TEMPLATES = "whatsapp_templates", e.WHATSAPP_BOTS = "whatsapp_bots", e.CONTACTS_ALL = "catalogs_contacts_and_companies", e.CONTACTS = "catalogs_contacts", e.COMPANIES = "catalogs_companies", e.FILES = "catalogs_files", e.EMAIL_SENT = "email_sent", e.EMAIL_DELETED = "email_deleted", e.EMAIL_TEMPLATES = "email_templates", e.SETTINGS_EMAIL = "settings_email", e.REPORT_BY_ACTIVITIES = "report_by_activities", e.CONSOLIDATED_REPORT = "consolidated_report", e.GOAL_REPORT = "goal_report", e.CALL_REPORT = "call_report", e.ACTIVITY_LOG = "activity_log", e.REPORT_BY_CUSTOMERS = "report_by_customers", e.BOTS = "bots", e.ARCHIVED_PIPELINES = "archived_pipelines"
      }(a || (a = {}));
      var l, d = new Set(["notifications", "ai_copilot", "help-center", "contact_support"]);
      ! function(e) {
        e.MAIL = "mail", e.TODO = "todo", e.CHATS = "chats", e.NOTIFICATIONS = "notifications", e.CHATS_INBOX = "chats", e.TEAM_INBOX = "team_inbox"
      }(l || (l = {}));
      var _, p, f = (_ = s((function() {
          return u(this, (function(e) {
            switch (e.label) {
              case 0:
                return [4, Promise.all([n.e(68592), n.e(95882), n.e(60190), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(31542), n.e(3473), n.e(32760), n.e(94046), n.e(14558), n.e(73197), n.e(28422), n.e(47287), n.e(34385), n.e(43323), n.e(35370), n.e(84330), n.e(61926)]).then(n.bind(n, 343377))];
              case 1:
                return [2, e.sent().navigationBarView]
            }
          }))
        })), function() {
          return _.apply(this, arguments)
        }),
        m = function() {
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
        h = (c(p = {}, "mail", "mail"), c(p, "todo", "tasks"), p),
        v = function() {
          var e = s((function(e, t) {
            return u(this, (function(n) {
              switch (n.label) {
                case 0:
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? [4, f()] : [2];
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
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? (t = "id" in e && h[e.id] ? (r = function(e) {
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
                  }({}, e), a = null != (a = {
                    id: h[e.id]
                  }) ? a : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(a)) : function(e, t) {
                    var n = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                      var r = Object.getOwnPropertySymbols(e);
                      n.push.apply(n, r)
                    }
                    return n
                  }(Object(a)).forEach((function(e) {
                    Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(a, e))
                  })), r) : e, [4, f()]) : [3, 2];
                case 1:
                  return n.sent().updateItemCounter(t), [2];
                case 2:
                  return [4, m()];
                case 3:
                  return n.sent().updateItemCounter(e), [2]
              }
              var r, a
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        b = function() {
          var e = s((function(e) {
            return u(this, (function(t) {
              switch (t.label) {
                case 0:
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? [4, f()] : [3, 2];
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
                  return [4, m()];
                case 3:
                  return t.sent().setTelephonyState(e), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        A = function() {
          var e = s((function(e) {
            var t, n, r;
            return u(this, (function(a) {
              switch (a.label) {
                case 0:
                  return t = e.id, n = e.title, r = e.path, (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) && "groupId" in e ? [4, f()] : [3, 2];
                case 1:
                  return [2, a.sent().addItem({
                    groupId: e.groupId,
                    pinnedSectionEntity: e.pinnedSectionEntity,
                    id: t,
                    title: n,
                    path: r,
                    icon: e.icon
                  })];
                case 2:
                  return "description" in e ? [4, m()] : [3, 4];
                case 3:
                  return [2, a.sent().addMenuItem({
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
        y = function() {
          var e = s((function(e) {
            return u(this, (function(t) {
              switch (t.label) {
                case 0:
                  return (0, i.isFeatureAvailable)(i.Features.SYSTEM_NAVIGATION_V2) ? [4, f()] : [3, 2];
                case 1:
                  return [2, t.sent().removeItem(e)];
                case 2:
                  return [4, m()];
                case 3:
                  return [2, t.sent().removeMenuItem(e)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        T = "../build/transpiled/interface/left_menu/utils";
      window.define(T, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([T])
    },
    400605: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => p
      });
      var r = n(661533),
        a = n.n(r),
        i = n(629133),
        o = n.n(i),
        s = n(156040),
        c = n(397927),
        u = n(923703),
        l = a()(document);

      function d() {
        APP.constant("amomail").enabled && u.default.getCounters().done((function(e) {
          (0, c.updateItemCounter)({
            id: c.CounterId.MAIL,
            count: e.unreadCount
          }), APP.constant("amomail").mailboxes.active = e.active, APP.constant("amomail").mailboxes.smtp_supports = e.smtpSupports
        }))
      }
      var _ = o().throttle(d, 1e4, {
        trailing: !1
      });
      l.on("mail:update:counter", (function() {
        d()
      })).on("page:changed", (function() {
        s.onPageFullyLoaded(_)
      })).on("mailbox:view:settings", (function(e, t) {
        location.href.includes("/mail/settings") && !APP.data.is_card ? (a()(window).scrollTop(0), APP.data.current_view.showMailSettings(e, t)) : (t = o().isUndefined() ? "general" : t, APP.router.navigate("/mail/settings/?mailbox-setup=".concat(t), {
          trigger: !0
        }))
      })), s.onPageFullyLoaded(_);
      const p = {};
      var f = "../build/transpiled/interface/mail/common";
      window.define(f, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([f])
    },
    910: (e, t, n) => {
      n.r(t), n.d(t, {
        getCallingStatus: () => d,
        runMerge: () => p,
        setCallingStatus: () => l,
        showUserStatus: () => _
      });
      var r = n(629133),
        a = n.n(r),
        i = n(214558);

      function o(e, t, n, r, a, i, o) {
        try {
          var s = e[i](o),
            c = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(c) : Promise.resolve(c).then(r, a)
      }
      var s, c, u = !1,
        l = function(e) {
          return "calling_status - " + (u = e)
        },
        d = function() {
          return u
        },
        _ = function(e) {
          var t = {},
            n = (0, i.get)();
          switch (!0) {
            case "online" === e:
              t = [], a().each(n, (function(e) {
                !0 === e.online && t.push(e.id)
              }));
              break;
            case !a().isNaN(parseInt(e)) && !a().isUndefined((0, i.get)(e)):
              t = (0, i.get)(e).online || !1;
              break;
            default:
              a().each(n, (function(e, n) {
                t[n] = {}, t[n].id = e.id, t[n].online = e.online || !1
              }))
          }
          return t
        },
        p = (s = function(e) {
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
            var a = s.apply(e, t);

            function i(e) {
              o(a, n, r, i, c, "next", e)
            }

            function c(e) {
              o(a, n, r, i, c, "throw", e)
            }
            i(void 0)
          }))
        }, function(e) {
          return c.apply(this, arguments)
        }),
        f = "../build/transpiled/sdk/index";
      window.define(f, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([f])
    },
    859200: (e, t, n) => {
      n.r(t), n.d(t, {
        RIGHTS_DENIED: () => p,
        RIGHTS_FULL: () => l,
        RIGHTS_GROUP: () => d,
        RIGHTS_LINKED: () => f,
        RIGHTS_MAIN: () => _,
        canCatalog: () => P,
        canDeleteCard: () => T,
        canEditCard: () => y,
        canImport: () => I,
        canTask: () => S,
        canViewLead: () => O,
        getContactsMergedRights: () => w,
        getRights: () => h,
        groupMatesIDs: () => b,
        hasRestrictedFieldAccess: () => E,
        isAdmin: () => v,
        isFromCard: () => A,
        refreshCache: () => m,
        userID: () => g
      });
      var r = n(629133),
        a = n.n(r),
        i = n(866633),
        o = n(926168),
        s = n(214558),
        c = null;

      function u(e, t) {
        var n = c;
        return null === n || a().isUndefined(e) || (n = a().has(n, e) ? n[e] : null, t && (n = a().has(n, t) ? n[t] : null)), n
      }
      var l = "A",
        d = "G",
        _ = "M",
        p = "D",
        f = "L",
        m = function() {
          var e, t = APP.constant("user_rights");
          if (t) {
            e = ["add", "add_company", "has_multi", "view_company", "merge", "view", "edit", "add_task", "change_status", "change_field", "reassign", "delete", "manage_tags", "import", "export", "can_save", "copy"], (c = c || {}).contacts = a().extend({}, c.contacts, t.contacts, t.contacts.CONTACT || {}), c.contacts = a().pick(c.contacts, e), e = ["add_company", "has_multi", "view_company", "merge", "view", "edit", "add_task", "change_status", "change_field", "reassign", "delete", "manage_tags", "add", "import", "export", "can_save", "copy"], c.companies = a().extend({}, c.companies, t.companies, t.contacts.COMPANY || {}), c.companies = a().pick(c.companies, e), a().each({
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
            }, (function(e, n) {
              c[n] = a().extend({}, c[n], t[n]), c[n] = a().pick(c[n], e)
            })), c.is_admin = !!t.is_admin, c.is_free_user = !!t.is_free_user, c.mail_admin = !!t.mail_admin, c.duplicate_search = !!t.duplicate_search, c.base_rights = t.base_rights || {}, c.status_rights = t.status_rights || {}, c.catalog_rights = t.catalog_rights || {}, c.catalogs = t.catalogs || {}, c.oper_day_user_tracking = t.oper_day_user_tracking, c.oper_day_reports_view_access = t.oper_day_reports_view_access;
            var n = APP.constant("user");
            e = ["id", "group_mates_ids"], c.user = a().extend({}, c.user, a().pick(n, e)), c.user.id = parseInt(c.user.id)
          }
        },
        h = function(e, t, n) {
          var r;
          return c && !0 !== n || m(), null === (r = u(e, t)) && (m(), r = u(e, t)), r
        },
        v = function() {
          return !!h("is_admin")
        },
        g = function() {
          return h("user", "id")
        },
        b = function() {
          return h("user", "group_mates_ids")
        },
        A = function() {
          return APP.data.current_card && APP.data.current_card.id > 0 && APP.data.current_card.element_type > 0
        },
        y = function() {
          return h(APP.data.current_entity, "can_save", !0) || "customers" === APP.data.current_entity && APP.constant("grant_edit")
        },
        T = function() {
          return h(APP.data.current_entity, "can_delete", !0) || "customers" === APP.data.current_entity && APP.constant("grant_delete")
        },
        P = function(e, t, n) {
          var r, o, s;
          return APP.constant("account").pay_type !== i.PayType.PAYMENT_TYPE_BLOCK && (v() ? s = !0 : (n = !!a().isUndefined(n) && A(), r = (h("catalog_rights")[t] || {})[e] || p, o = n ? [l, f] : [l], s = -1 !== a().indexOf(o, r), n && r === f && ("edit" === e ? s = s && y() : "delete" === e && (s = s && T()))), s)
        },
        E = function(e, t, n) {
          var r = h("restricted_fields", t) || [];
          return n = n || "edit", !!r[e] && !1 === a().propertyOf(r)([e, n])
        },
        S = function(e, t, n) {
          var r, i, c, u, p, f, m = t.element_type || APP.element_types.todo,
            g = (0, o.convertElementType)(m, "string"),
            b = null,
            A = !1,
            y = (0, s.current)().id;
          if (n = n || {}, "todos" === g && (g = "tasks"), v()) A = !0;
          else switch (i = m === APP.element_types.todo ? Number(t.responsible_user_id) : Number(n.responsible_user_id), m === APP.element_types.leads && (r = h("status_rights"), p = n.pipeline_id || 0, f = n.status_id || 0, b = a().propertyOf(r)([p, f]) || null), null === b && (b = h("base_rights", g)), b[e]) {
            case l:
              A = !0;
              break;
            case _:
              A = y && y === i;
              break;
            case d:
              c = (0, s.get)(!0)[y] || {}, u = (0, s.get)(!0)[i] || {}, A = !a().isEmpty(c) && !a().isEmpty(u) && c.group === u.group
          }
          return A
        },
        w = function() {
          var e = {};
          m();
          var t = h("contacts"),
            n = h("companies");
          return a().each(a().keys(t), (function(r) {
            e[r] = t[r] && n[r]
          })), e
        },
        I = function() {
          return h("leads", "import") || h("contacts", "import") || h("company", "import")
        },
        O = function(e, t) {
          if (v()) return !0;
          var n = h("status_rights");
          if (0 === t) {
            var r = a().keys(n);
            t = parseInt(a().first(r))
          }
          var i = a().propertyOf(n)([t, e, "view"]);
          return i === l || a().isUndefined(i)
        },
        k = "../build/transpiled/utils/account/rights";
      window.define(k, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([k])
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "dfc2604b-14b7-41c3-9922-0f57c84dc9e9", e._sentryDebugIdIdentifier = "sentry-dbid-dfc2604b-14b7-41c3-9922-0f57c84dc9e9")
    } catch (e) {}
  }();
//# sourceMappingURL=605.e6b4b0349861bcf83505.js.map