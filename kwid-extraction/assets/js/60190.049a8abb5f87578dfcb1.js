"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [60190], {
    604874: (e, t, n) => {
      n.r(t), n.d(t, {
        ABORT_ERROR_MESSAGE: () => j,
        ANSWER_URL: () => _,
        BASE_URL: () => b,
        BASE_YCLOUD_API_URL: () => C,
        KNOWLEDGE_BASE_DEFAULT_URL: () => N,
        MARK_ANSWER_URL: () => P,
        MARK_REWRITER_URL: () => R,
        MARK_TASK_URL: () => O,
        REWRITER_URL: () => T,
        TASK_URL: () => m,
        addSource: () => Q,
        addYCloud: () => ye,
        cancelSourceUploading: () => ne,
        checkYCloudKeyStatus: () => Ae,
        connectAiTrial: () => be,
        deleteMultipleRow: () => X,
        deleteRow: () => Z,
        get: () => W,
        getEmotionDetectionSettings: () => Re,
        getPage: () => ue,
        getSourcePages: () => oe,
        getSources: () => z,
        getTaskSuggestionSettings: () => ge,
        getYCloud: () => he,
        grammar: () => V,
        linkSources: () => me,
        mark: () => J,
        markTrialExpiredShown: () => _e,
        post: () => B,
        profanity: () => Y,
        reloadPage: () => le,
        removeMultiplePage: () => de,
        removePage: () => ce,
        removeYCloud: () => we,
        requestAiTrial: () => Te,
        setAnswerOnboarding: () => ve,
        summarize: () => K,
        switchMultiplePageAvailability: () => fe,
        switchMultipleSourceAvailability: () => $,
        switchSourceAvailability: () => ee,
        toggleAnswerSettings: () => Se,
        toggleEmotionDetectionSettings: () => Pe,
        toggleTaskSuggestionSettings: () => pe,
        tone: () => H,
        updateNameSource: () => re,
        updatePage: () => se,
        updateSourceData: () => ae,
        updateSourcePagesLang: () => ie,
        updateUrlSource: () => te,
        updateYCloud: () => Ee
      });
      var r = n(567952),
        a = n.n(r),
        i = n(623967),
        o = n.n(i),
        u = n(629133),
        s = n.n(u),
        c = n(744741),
        l = n(990703),
        d = n(286340),
        f = n(197634),
        p = n(926168),
        g = n(661533);

      function S(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function v(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              S(i, r, a, o, u, "next", e)
            }

            function u(e) {
              S(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function h(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function y(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            r = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), r.forEach((function(t) {
            h(e, t, n[t])
          }))
        }
        return e
      }

      function E(e, t) {
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
      var w, A = "",
        b = APP.constant("airewriter").url,
        T = "".concat(b, "/api/v1/rewrite_text"),
        _ = "".concat(b, "/api/v1/answer"),
        m = "".concat(b, "/api/v1/task"),
        R = "".concat(b, "/api/v1/rewrite_text/stats/mark_used"),
        P = "".concat(b, "/api/v1/answer/stats/mark_used"),
        O = "".concat(b, "/api/v1/task/stats/mark_used"),
        N = "".concat(b, "/api/v1/source"),
        I = "".concat(b, "/api/v1/multi/source/disable"),
        L = "".concat(b, "/api/v1/multi/source/delete"),
        k = "".concat(b, "/api/v1/summarize_talk"),
        U = "".concat(b, "/api/v1/tone/analyze"),
        D = "".concat(b, "/api/v1/sources/link"),
        C = "".concat(b, "/api/v1/ycloud/apikey"),
        x = "/ajax/v4/emotion_detector/settings",
        M = "/ajax/v4/airewriter/task_suggestion/settings",
        j = "AbortError",
        G = function() {
          return g.ajax({
            url: "/ajax/v4/airewriter/issue_token",
            method: "POST"
          })
        },
        F = null,
        q = (w = v((function(e) {
          var t, n, r, a;
          return E(this, (function(i) {
            switch (i.label) {
              case 0:
                t = function(t) {
                  return g.ajax(g.extend(!0, {}, e, {
                    url: e.url,
                    beforeSend: function(t) {
                      e.signal && (e.signal.onabort = t.abort)
                    },
                    headers: {
                      "X-Auth-Token": t,
                      "x-language": (0, p.isCustomers)() && s().includes(["leads", "customers"], APP.getBaseEntity()) ? (0, d.getEntityLangInCustomers)(APP.getBaseEntity()) : (0, p.getLangId)()
                    },
                    contentType: "application/json"
                  }))
                }, i.label = 1;
              case 1:
                return i.trys.push([1, 6, 11, 12]), A ? [4, t(A)] : [3, 3];
              case 2:
                return [2, i.sent()];
              case 3:
                return F || (F = v((function() {
                  var e, t;
                  return E(this, (function(n) {
                    switch (n.label) {
                      case 0:
                        return n.trys.push([0, 2, , 3]), [4, G()];
                      case 1:
                        return e = n.sent().token, A = e, [2, e];
                      case 2:
                        throw t = n.sent(), F = null, t;
                      case 3:
                        return [2]
                    }
                  }))
                }))()), [4, F];
              case 4:
                return n = i.sent(), [4, t(n)];
              case 5:
                return [2, i.sent()];
              case 6:
                if (0 === (r = i.sent()).status) throw new Error(j);
                return r.status !== c.HttpStatusCode.FORBIDDEN ? [3, 8] : [4, G()];
              case 7:
                return a = i.sent(), A = a.token, [2, t(A)];
              case 8:
                return r.status !== c.HttpStatusCode.UNAUTHORIZED ? [3, 10] : [4, (0, l.updateCoreTokens)()];
              case 9:
                return i.sent(), [2, t(A)];
              case 10:
                throw JSON.parse(r.responseText);
              case 11:
                return A && (F = null), [7];
              case 12:
                return [2]
            }
          }))
        })), function(e) {
          return w.apply(this, arguments)
        }),
        W = function() {
          var e = v((function(e) {
            var t, n, r = arguments;
            return E(this, (function(i) {
              switch (i.label) {
                case 0:
                  return t = !(r.length > 1 && void 0 !== r[1]) || r[1], [4, q(e)];
                case 1:
                  return n = i.sent(), [2, t ? a()(n) : n]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        B = function() {
          var e = v((function(e) {
            var t, n, r;
            return E(this, (function(i) {
              switch (i.label) {
                case 0:
                  return t = e.url, n = e.data, [4, q({
                    url: t,
                    method: "POST",
                    data: JSON.stringify(y({}, o()(n)))
                  })];
                case 1:
                  return r = i.sent(), [2, a()(r)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        J = function() {
          var e = v((function(e) {
            var t, n;
            return E(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.url, n = e.data, [4, q({
                    url: t,
                    method: "POST",
                    data: JSON.stringify(y({}, o()(n)))
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
        K = function() {
          var e = v((function(e) {
            var t, n, r;
            return E(this, (function(a) {
              switch (a.label) {
                case 0:
                  return t = e.talkId, n = e.elementId, r = e.elementType, [4, q({
                    url: "".concat(k, "/").concat(t),
                    method: "POST",
                    data: JSON.stringify({
                      date_format: APP.system.format.date.date,
                      entity_id: n,
                      entity_type: r
                    })
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
        Y = function() {
          var e = v((function(e) {
            var t, n;
            return E(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = APP.constant("ai_services").prdservice, n = t.server_url, [4, g.ajax({
                    url: "".concat(n, "/api/detect"),
                    method: "POST",
                    data: JSON.stringify({
                      text: e,
                      lang: APP.lang_id
                    }),
                    contentType: "application/json"
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
        V = function() {
          var e = v((function(e) {
            var t, n;
            return E(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = APP.constant("ai_services").spell_checker_service, n = t.server_url, [4, g.ajax({
                    url: "".concat(n, "/api/check/grammar"),
                    method: "POST",
                    data: JSON.stringify({
                      text: e,
                      lang: APP.lang_id
                    }),
                    contentType: "application/json"
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
        H = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, q({
                    url: "".concat(U),
                    method: "POST",
                    data: JSON.stringify({
                      text: e
                    })
                  })];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        z = function() {
          var e = v((function(e) {
            var t, n, r, i, o, u, s, c, l, d, f, p;
            return E(this, (function(g) {
              switch (g.label) {
                case 0:
                  return n = e.totalLimit, r = e.page, i = e.orderBy, o = e.orderType, u = e.enabledFor, s = e.linkedAgentId, c = e.withSamples, l = e.excludeAgentIds, d = r ? "".concat(N, "?page=").concat(r) : "".concat(N, "?limit=").concat(n), i && o && (d = "".concat(d, "&order_by=").concat(i, "&order_type=").concat(o)), u && (d = "".concat(d, "&enabled_for=").concat(u)), s && (d = "".concat(d, "&linked_agent_id=").concat(s)), c && (d = "".concat(d, "&with_samples=Y")), l && (d = "".concat(d, "&exclude_agent_ids[]=").concat(l.join(","))), [4, q({
                    url: d
                  })];
                case 1:
                  return f = g.sent(), [2, a()({
                    items: null !== (p = null == f || null === (t = f._embedded) || void 0 === t ? void 0 : t.sources) && void 0 !== p ? p : null == f ? void 0 : f.sources[0],
                    currentPage: null == f ? void 0 : f._page,
                    isNextPageAvailable: (null == f ? void 0 : f._page) ? (null == f ? void 0 : f._page) < (null == f ? void 0 : f._page_count) : null == f ? void 0 : f.is_next_page_available
                  })]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        Q = function() {
          var e = v((function(e) {
            var t;
            return E(this, (function(n) {
              switch (n.label) {
                case 0:
                  return [4, q({
                    url: N,
                    method: "POST",
                    data: JSON.stringify(e),
                    contentType: "application/json"
                  })];
                case 1:
                  return t = n.sent(), [2, a()(null == t ? void 0 : t.source)]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        X = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, q({
                    url: L,
                    method: "POST",
                    data: JSON.stringify(e),
                    contentType: "application/json"
                  })];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        Z = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, q({
                    url: "".concat(N, "/").concat(e),
                    method: "DELETE",
                    contentType: "application/json"
                  })];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        $ = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, q({
                    url: I,
                    data: JSON.stringify(e),
                    method: "POST",
                    contentType: "application/json"
                  })];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        ee = function() {
          var e = v((function(e, t) {
            return E(this, (function(n) {
              switch (n.label) {
                case 0:
                  return [4, q({
                    url: "".concat(N, "/").concat(t, "/disable"),
                    data: JSON.stringify(e),
                    method: "POST",
                    contentType: "application/json"
                  })];
                case 1:
                  return [2, n.sent()]
              }
            }))
          }));
          return function(t, n) {
            return e.apply(this, arguments)
          }
        }(),
        te = function() {
          var e = v((function(e) {
            var t;
            return E(this, (function(n) {
              switch (n.label) {
                case 0:
                  return t = e.id, [4, q({
                    url: "".concat(N, "/").concat(t, "/update_pages"),
                    method: "POST",
                    contentType: "application/json"
                  })];
                case 1:
                  return [2, n.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        ne = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, q({
                    url: "".concat(N, "/").concat(e, "/cancel"),
                    method: "POST",
                    contentType: "application/json"
                  })];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        re = function() {
          var e = v((function(e) {
            var t, n;
            return E(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.id, n = e.value, (0, f.isEmptyString)(n) ? [2] : [4, q({
                    url: "".concat(N, "/").concat(t),
                    method: "PUT",
                    data: JSON.stringify({
                      name: n
                    })
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
        ae = function() {
          var e = v((function(e) {
            var t, n;
            return E(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.id, (n = e.data).name && (0, f.isEmptyString)(n.name) ? [2] : [4, q({
                    url: "".concat(N, "/").concat(t),
                    method: "PUT",
                    data: JSON.stringify(y({}, o()(n)))
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
        ie = function() {
          var e = v((function(e) {
            var t, n;
            return E(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.id, n = e.data, [4, q({
                    url: "".concat(N, "/").concat(t, "/pages/lang"),
                    method: "PATCH",
                    data: JSON.stringify(y({}, o()(n)))
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
        oe = function() {
          var e = v((function(e) {
            var t, n, r, i, o, u, s, c, l, d, f, p;
            return E(this, (function(g) {
              switch (g.label) {
                case 0:
                  return n = e.sourceId, r = e.totalLimit, i = e.page, o = e.orderBy, u = e.orderType, s = e.term, c = e.signal, l = "".concat(N, "/").concat(n, "/page"), d = i ? "".concat(l, "?page=").concat(i) : "".concat(l, "?limit=").concat(r), o && u && (d = "".concat(d, "&order_by=").concat(o, "&order_type=").concat(u)), s && (d = "".concat(d, "&term=").concat(s)), [4, q({
                    url: d,
                    signal: c
                  })];
                case 1:
                  return f = g.sent(), [2, a()({
                    items: null !== (p = null == f || null === (t = f._embedded) || void 0 === t ? void 0 : t.pages) && void 0 !== p ? p : null == f ? void 0 : f.pages[0],
                    currentPage: null == f ? void 0 : f._page,
                    pageCount: null == f ? void 0 : f._page_count,
                    isNextPageAvailable: (null == f ? void 0 : f._page) ? (null == f ? void 0 : f._page) < (null == f ? void 0 : f._page_count) : null == f ? void 0 : f.is_next_page_available
                  })]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        ue = function(e) {
          var t = e.sourceId,
            n = e.pageId;
          return q({
            url: "".concat(N, "/").concat(t, "/page/").concat(n)
          })
        },
        se = function(e) {
          var t = e.sourceId,
            n = e.pageId,
            r = e.data;
          return q({
            url: "".concat(N, "/").concat(t, "/page/").concat(n),
            method: "PATCH",
            data: JSON.stringify(y({}, o()(r)))
          })
        },
        ce = function(e) {
          var t = e.sourceId,
            n = e.pageId;
          return q({
            url: "".concat(N, "/").concat(t, "/page/").concat(n),
            method: "DELETE"
          })
        },
        le = function(e) {
          var t = e.sourceId,
            n = e.pageId;
          return q({
            url: "".concat(N, "/").concat(t, "/page/").concat(n, "/reload"),
            method: "PUT"
          })
        },
        de = function(e) {
          var t = e.sourceId,
            n = e.data;
          return q({
            url: "".concat(N, "/").concat(t, "/pages/delete"),
            method: "PATCH",
            data: JSON.stringify(y({}, o()(n)))
          })
        },
        fe = function(e) {
          var t = e.sourceId,
            n = e.data;
          return q({
            url: "".concat(N, "/").concat(t, "/pages/disable"),
            method: "PATCH",
            data: JSON.stringify(y({}, o()(n)))
          })
        },
        pe = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, q({
                    url: M,
                    method: "POST",
                    data: JSON.stringify({
                      is_ai_task_suggestion_enabled: e
                    })
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
        ge = function() {
          var e = v((function() {
            return E(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, W({
                    url: M
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
        Se = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, q({
                    url: "".concat(_, "/settings"),
                    method: "POST",
                    data: JSON.stringify({
                      ai_answer_enable: e
                    })
                  })];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        ve = function() {
          var e = v((function() {
            return E(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, q({
                    url: "/api/v4/features",
                    method: "POST",
                    data: JSON.stringify({
                      is_ai_user_onboarding_completed: {
                        is_available: !0,
                        user_id: APP.constant("user").id
                      }
                    })
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
        he = function() {
          return q({
            url: C
          })
        },
        ye = function(e) {
          return q({
            url: C,
            method: "POST",
            data: JSON.stringify(y({}, o()(e))),
            contentType: "application/json"
          })
        },
        Ee = function(e) {
          return q({
            url: C,
            method: "PUT",
            data: JSON.stringify(y({}, o()(e))),
            contentType: "application/json"
          })
        },
        we = function(e) {
          return q({
            url: "".concat(C, "/").concat(e),
            method: "DELETE",
            contentType: "application/json"
          })
        },
        Ae = function(e) {
          var t = e.id,
            n = e.data;
          return q({
            url: "".concat(C, "/").concat(t),
            method: "PUT",
            data: JSON.stringify(y({}, o()(n))),
            contentType: "application/json"
          })
        },
        be = function() {
          return g.ajax({
            url: "/ajax/v4/packages/kommo_ai_trial/connect",
            method: "POST"
          })
        },
        Te = function(e) {
          var t = {
            type: e
          };
          return g.ajax({
            url: "/ajax/v4/airewriter/user_request",
            method: "POST",
            data: JSON.stringify(t),
            contentType: "application/json"
          })
        },
        _e = function() {
          var e = {
            is_kait_expired_modal_shown: {
              is_available: !0,
              user_id: APP.constant("user").id
            }
          };
          return g.ajax({
            url: "/ajax/v4/features",
            method: "POST",
            data: JSON.stringify(e),
            contentType: "application/json"
          })
        },
        me = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, B({
                    url: D,
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
        Re = function() {
          var e = v((function() {
            return E(this, (function(e) {
              switch (e.label) {
                case 0:
                  return [4, W({
                    url: x
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
        Pe = function() {
          var e = v((function(e) {
            return E(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, B({
                    url: x,
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
        }()
    },
    292562: (e, t, n) => {
      n.r(t), n.d(t, {
        AiSourceEntities: () => r,
        AnswerUsingStatuses: () => d,
        AvailableSummarizeEntityTypes: () => l,
        LinkSourceEntity: () => v,
        LinkSourcesActions: () => S,
        RewriteStatusRequest: () => s,
        RewriterErrorCodes: () => c,
        SourceErrorStatus: () => o,
        SourceLoadingStatus: () => i,
        SourceOrigins: () => u,
        SourcesType: () => a,
        TaskTypes: () => p,
        TaskUsingStatuses: () => f,
        TrialUserRequest: () => g
      });
      var r, a, i, o, u, s, c, l, d, f, p, g, S, v, h = n(19050);
      ! function(e) {
        e[e.UNSET = 0] = "UNSET", e[e.SUGGESTED_REPLY = 1] = "SUGGESTED_REPLY", e[e.AGENT = 2] = "AGENT", e[e.SUGGESTED_REPLY_AGENT = 3] = "SUGGESTED_REPLY_AGENT"
      }(r || (r = {})),
      function(e) {
        e[e.URL = 1] = "URL", e[e.FILE = 2] = "FILE", e[e.TEXT = 3] = "TEXT"
      }(a || (a = {})),
      function(e) {
        e[e.IN_PROGRESS = 1] = "IN_PROGRESS", e[e.SUCCESS = 2] = "SUCCESS", e[e.FAIL = 3] = "FAIL", e[e.UPDATE = 4] = "UPDATE", e[e.STOP = 5] = "STOP", e[e.DELETED = 6] = "DELETED", e[e.UPDATE_CANCEL = 7] = "UPDATE_CANCEL"
      }(i || (i = {})),
      function(e) {
        e[e.SOMETHING_WENT_WRONG = 1] = "SOMETHING_WENT_WRONG", e[e.INVALID_LANG = 2] = "INVALID_LANG", e[e.SITE_NOT_AVAILABLE = 3] = "SITE_NOT_AVAILABLE", e[e.PARSE_FAIL = 4] = "PARSE_FAIL", e[e.UNSUPPORTED_FORMAT = 5] = "UNSUPPORTED_FORMAT", e[e.LARGE_FILE = 6] = "LARGE_FILE", e[e.INVALID_FILE_FORMAT = 7] = "INVALID_FILE_FORMAT", e[e.BROKEN_FILE = 8] = "BROKEN_FILE", e[e.TOO_MANY_FILES = 9] = "TOO_MANY_FILES"
      }(o || (o = {})),
      function(e) {
        e.USER = "user", e.SHOPIFY = "shopify", e.WOOCOMMERCE = "woocom", e.NUVEMSHOP = "nuvemshop", e.LAZADA = "lazada"
      }(u || (u = {})),
      function(e) {
        e.SUCCESS = "success", e.PENDING = "pending", e.ERROR = "error", e.LOADING = "loading"
      }(s || (s = {})),
      function(e) {
        e[e.NOT_FOUND = 404] = "NOT_FOUND", e[e.PAYMENT_REQUIRED = 402] = "PAYMENT_REQUIRED", e[e.VALIDATION_ERROR = 400] = "VALIDATION_ERROR"
      }(c || (c = {})),
      function(e) {
        e[e.LEADS = h.default.leads] = "LEADS", e[e.CUSTOMERS = h.default.customers] = "CUSTOMERS", e[e.CONTACTS = h.default.contacts] = "CONTACTS"
      }(l || (l = {})),
      function(e) {
        e[e.OPEN_ANSWER = 1] = "OPEN_ANSWER", e[e.SHOW_ANSWER = 2] = "SHOW_ANSWER", e[e.SEND_ANSWER = 3] = "SEND_ANSWER", e[e.EDIT_ANSWER = 4] = "EDIT_ANSWER", e[e.SKIP_ANSWER = 5] = "SKIP_ANSWER", e[e.CLOSE_ANSWER = 6] = "CLOSE_ANSWER"
      }(d || (d = {})),
      function(e) {
        e[e.CORRECT_TASK = 1] = "CORRECT_TASK", e[e.EDIT_TASK = 2] = "EDIT_TASK"
      }(f || (f = {})),
      function(e) {
        e[e.FOLLOW_UP = 1] = "FOLLOW_UP", e[e.MEET = 2] = "MEET", e[e.CUSTOM = 3] = "CUSTOM"
      }(p || (p = {})),
      function(e) {
        e.UPGRADE_REQUESTED = "upgrade_requested", e.TRIAL_REQUESTED = "trial_requested", e.AGENT_REQUESTED = "ai_agent_requested"
      }(g || (g = {})),
      function(e) {
        e.LINK = "link", e.UNLINK = "unlink"
      }(S || (S = {})),
      function(e) {
        e.AGENT = "agent", e.ANSWER_SOURCE = "answer_source"
      }(v || (v = {}))
    },
    700682: (e, t, n) => {
      n.r(t), n.d(t, {
        checkAgentPreviewTasks: () => k,
        clearAgentPreviewDialog: () => D,
        disableAiAgent: () => I,
        getAgentPreviewMessages: () => L,
        getAgentSettings: () => T,
        getAgentSources: () => A,
        getAllChannels: () => P,
        getBaseAgentSettings: () => m,
        getIsAgentSourcesEditable: () => C,
        getIsAiAgentEnabled: () => N,
        importAgentKnowledge: () => O,
        resetAgentSources: () => b,
        saveAgentSettings: () => _,
        saveBaseAgentSettings: () => R,
        sendAgentPreviewMessage: () => U
      });
      var r = n(629133),
        a = n.n(r),
        i = n(104737),
        o = n(604874),
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

      function c(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              s(i, r, a, o, u, "next", e)
            }

            function u(e) {
              s(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function l(e, t) {
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
      var d = "".concat(o.BASE_URL, "/api/v1/agent"),
        f = "".concat(d, "/knowledge"),
        p = "".concat(d, "/settings"),
        g = "".concat(f, "/import"),
        S = "".concat(f, "/reset"),
        v = "".concat("/ajax/v4/airewriter/agent", "/settings"),
        h = "/ajax/v4/talks/agent/multiple",
        y = {
          detailAgentSettings: null,
          baseAgentSettings: null
        },
        E = function() {
          y.detailAgentSettings = null, y.baseAgentSettings = null
        };
      u(document).on("page:entity_changed", E);
      var w, A = (w = c((function() {
          return l(this, (function(e) {
            switch (e.label) {
              case 0:
                return [4, (0, o.get)({
                  url: f
                })];
              case 1:
                return [2, e.sent()]
            }
          }))
        })), function() {
          return w.apply(this, arguments)
        }),
        b = function() {
          var e = c((function(e) {
            return l(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, o.post)({
                    url: S,
                    data: {
                      origin: e
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
        }(),
        T = function() {
          var e = c((function(e) {
            var t;
            return l(this, (function(n) {
              switch (n.label) {
                case 0:
                  return t = y.detailAgentSettings, e && !a().isNull(t) ? [2, t] : (y.detailAgentSettings = (0, o.get)({
                    url: p
                  }), [4, y.detailAgentSettings]);
                case 1:
                  return [2, n.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        _ = function(e) {
          return E(), (0, o.post)({
            url: p,
            data: e
          })
        },
        m = function() {
          var e = c((function() {
            var e;
            return l(this, (function(t) {
              switch (t.label) {
                case 0:
                  return e = y.baseAgentSettings, a().isNull(e) ? (y.baseAgentSettings = (0, o.get)({
                    url: v
                  }), [4, y.baseAgentSettings]) : [2, e];
                case 1:
                  return [2, t.sent()]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        R = function(e) {
          return E(), (0, o.post)({
            url: v,
            data: e
          })
        },
        P = function() {
          var e = c((function() {
            var e, t;
            return l(this, (function(n) {
              switch (n.label) {
                case 0:
                  return [4, i.default.request({
                    url: "/ajax/v4/sources?only=chats&with=supports_delivery_notification,is_widget_disabled"
                  })];
                case 1:
                  return [2, (null == (t = n.sent()) || null === (e = t.Embedded) || void 0 === e ? void 0 : e.sources) || []]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        O = function() {
          var e = c((function(e) {
            return l(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, o.post)({
                    url: g,
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
        N = function(e) {
          var t = e.talkIds;
          return i.default.request({
            url: "".concat(h),
            method: "POST",
            data: {
              talk_ids: t
            },
            contentType: "application/json"
          })
        },
        I = function(e) {
          var t = e.talkIds;
          return i.default.request({
            url: "".concat(h, "/cancel"),
            method: "POST",
            data: {
              talk_ids: t
            },
            contentType: "application/json"
          })
        },
        L = function() {
          var e = c((function() {
            return l(this, (function(e) {
              return [2, (0, o.get)({
                url: "".concat(o.BASE_URL, "/api/v1/agent/preview/messages")
              })]
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        k = function() {
          var e = c((function(e) {
            var t;
            return l(this, (function(n) {
              return t = e.taskId, [2, (0, o.get)({
                url: "".concat(o.BASE_URL, "/api/v1/agent/preview/execute/").concat(t)
              })]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        U = function() {
          var e = c((function(e) {
            return l(this, (function(t) {
              return [2, (0, o.post)({
                url: "".concat(o.BASE_URL, "/api/v1/agent/preview/execute"),
                data: e
              })]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        D = function() {
          var e = c((function() {
            return l(this, (function(e) {
              return [2, (0, o.get)({
                url: "".concat(o.BASE_URL, "/api/v1/agent/preview/clean"),
                method: "DELETE"
              })]
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        C = function() {
          return (0, o.get)({
            url: "".concat(o.BASE_URL, "/api/v1/features/status")
          })
        }
    },
    908658: (e, t, n) => {
      var r, a;
      n.r(t), n.d(t, {
          PreviewMessageTypes: () => a,
          ProductsImportStatus: () => r
        }),
        function(e) {
          e[e.NONE = 0] = "NONE", e[e.ACCEPTED = 1] = "ACCEPTED", e[e.IN_PROGRESS = 2] = "IN_PROGRESS", e[e.COMPLETED = 3] = "COMPLETED"
        }(r || (r = {})),
        function(e) {
          e.Incoming = "incoming", e.Outgoing = "outgoing"
        }(a || (a = {}))
    },
    653140: (e, t, n) => {
      n.r(t), n.d(t, {
        AgentSettings: () => r.AgentSettings,
        BaseAgentSettings: () => r.BaseAgentSettings
      });
      var r = n(908658)
    },
    89217: (e, t, n) => {
      n.r(t), n.d(t, {
        DEFAULT_VIEWING_TIME: () => r
      });
      var r = .1
    },
    593444: (e, t, n) => {
      n.r(t), n.d(t, {
        getRewriterRequest: () => f,
        postRewriterRequest: () => g
      });
      var r = n(717068),
        a = n(445368),
        i = n(604874),
        o = n(292562);

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
      var l, d = (l = s((function(e) {
          var t, n, r, u, s, l, d, f, p, g, S, v, h, y, E, w, A, b, T;
          return c(this, (function(c) {
            switch (c.label) {
              case 0:
                t = e.jobUuid, n = e.maxRequestCount, r = e.url, u = e.resolve, s = e.reject, l = e.requestCount, d = e.incrementRequestCount, f = e.clearRequestCount, c.label = 1;
              case 1:
                return c.trys.push([1, 3, , 4]), [4, (0, i.get)({
                  url: "".concat(r, "/").concat(t)
                })];
              case 2:
                switch (p = c.sent(), g = p.status, S = p.answer, v = void 0 === S ? "" : S, h = p.detail, y = void 0 === h ? "" : h, E = p.answerId, w = p.usedReferences, g) {
                  case o.RewriteStatusRequest.ERROR:
                    f(), s({
                      detail: y
                    });
                    break;
                  case o.RewriteStatusRequest.PENDING:
                    l === n ? (f(), s({
                      detail: (0, a.i18n)("Something went wrong"),
                      code: o.RewriterErrorCodes.NOT_FOUND
                    })) : d();
                    break;
                  case o.RewriteStatusRequest.LOADING:
                  case o.RewriteStatusRequest.SUCCESS:
                    v && f()
                }
                return u({
                  answer: v,
                  status: g,
                  answerId: E,
                  usedReferences: w
                }), [3, 4];
              case 3:
                return A = c.sent(), T = (null == A || null === (b = A.responseJSON) || void 0 === b ? void 0 : b.detail) ? A.responseJSON : {
                  detail: (0, a.i18n)("Something went wrong"),
                  code: o.RewriterErrorCodes.NOT_FOUND
                }, f(), s(T), [3, 4];
              case 4:
                return [2]
            }
          }))
        })), function(e) {
          return l.apply(this, arguments)
        }),
        f = function() {
          var e = s((function(e) {
            var t, n, a, i, o, u, s, l, f, p;
            return c(this, (function(c) {
              return t = e.jobUuid, n = e.maxRequestCount, a = e.url, i = e.requestCount, o = e.clearRequestCount, u = e.incrementRequestCount, s = new r.SplitPromise, l = s.promise, f = s.resolve, p = s.reject, d({
                jobUuid: t,
                resolve: f,
                reject: p,
                maxRequestCount: n,
                url: a,
                requestCount: i,
                clearRequestCount: o,
                incrementRequestCount: u
              }), [2, l]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        p = function() {
          var e = s((function(e) {
            var t, n, r, u, s, l, d, f, p, g, S, v, h, y, E, w, A, b;
            return c(this, (function(c) {
              switch (c.label) {
                case 0:
                  t = e.text, n = e.id, r = e.resolve, u = e.reject, c.label = 1;
                case 1:
                  return c.trys.push([1, 3, , 4]), [4, (0, i.post)({
                    url: i.REWRITER_URL,
                    data: {
                      rewriteTypes: [n],
                      text: t
                    }
                  })];
                case 2:
                  return s = c.sent(), l = s.status, d = s.answer, f = void 0 === d ? "" : d, p = s.jobUuid, g = void 0 === p ? "" : p, S = s.detail, v = void 0 === S ? "" : S, h = s.answerId, y = s.usedReferences, E = s.code, f || l === o.RewriteStatusRequest.PENDING ? (r({
                    answer: f,
                    status: l,
                    jobUuid: g,
                    answerId: h,
                    usedReferences: y
                  }), [2]) : (!v && g || u({
                    detail: v,
                    code: E
                  }), [3, 4]);
                case 3:
                  return w = c.sent(), b = (null == w || null === (A = w.responseJSON) || void 0 === A ? void 0 : A.detail) ? w.responseJSON : {
                    detail: (0, a.i18n)("Something went wrong"),
                    code: o.RewriterErrorCodes.NOT_FOUND
                  }, u(b), [3, 4];
                case 4:
                  return [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        g = function() {
          var e = s((function(e) {
            var t, n, a, i, o, u;
            return c(this, (function(s) {
              return t = e.text, n = e.id, a = new r.SplitPromise, i = a.promise, o = a.resolve, u = a.reject, p({
                text: t,
                id: n,
                resolve: o,
                reject: u
              }), [2, i]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    960190: (e, t, n) => {
      n.r(t), n.d(t, {
        AgentSetupTypes: () => s.AgentSetupTypes,
        AiSourceEntities: () => f.AiSourceEntities,
        AvailableSummarizeEntityTypes: () => f.AvailableSummarizeEntityTypes,
        BaseAgentSettings: () => l.BaseAgentSettings,
        KNOWLEDGE_BASE_DEFAULT_URL: () => d.KNOWLEDGE_BASE_DEFAULT_URL,
        LinkSourceEntity: () => f.LinkSourceEntity,
        LinkSourcesActions: () => f.LinkSourcesActions,
        PreviewMessage: () => p.PreviewMessage,
        PreviewMessageTypes: () => p.PreviewMessageTypes,
        ProductsImportStatus: () => p.ProductsImportStatus,
        REWRITER_URL: () => d.REWRITER_URL,
        RewriteStatusRequest: () => f.RewriteStatusRequest,
        RewriterError: () => f.RewriterError,
        RewriterErrorCodes: () => f.RewriterErrorCodes,
        SourceErrorStatus: () => f.SourceErrorStatus,
        SourceLoadingStatus: () => f.SourceLoadingStatus,
        SourceOrigins: () => f.SourceOrigins,
        SourcesType: () => f.SourcesType,
        TaskTypes: () => f.TaskTypes,
        TaskUsingStatuses: () => f.TaskUsingStatuses,
        addSource: () => d.addSource,
        cancelSourceUploading: () => d.cancelSourceUploading,
        checkAgentPreviewTasks: () => c.checkAgentPreviewTasks,
        clearAgentPreviewDialog: () => c.clearAgentPreviewDialog,
        connectAiTrial: () => d.connectAiTrial,
        deleteMultipleRow: () => d.deleteMultipleRow,
        deleteRow: () => d.deleteRow,
        disableAiAgent: () => c.disableAiAgent,
        get: () => d.get,
        getAgentPreviewMessages: () => c.getAgentPreviewMessages,
        getAgentSettings: () => c.getAgentSettings,
        getAgentSources: () => c.getAgentSources,
        getAllChannels: () => c.getAllChannels,
        getBaseAgentSettings: () => c.getBaseAgentSettings,
        getEmotionDetectionSettings: () => d.getEmotionDetectionSettings,
        getIsAgentSourcesEditable: () => c.getIsAgentSourcesEditable,
        getIsAiAgentEnabled: () => c.getIsAiAgentEnabled,
        getPage: () => d.getPage,
        getRewriterRequest: () => o.getRewriterRequest,
        getSourcePages: () => d.getSourcePages,
        getSources: () => d.getSources,
        getTaskSuggestionSettings: () => d.getTaskSuggestionSettings,
        grammar: () => d.grammar,
        importAgentKnowledge: () => c.importAgentKnowledge,
        linkSources: () => d.linkSources,
        mark: () => d.mark,
        markAnswer: () => a.default,
        markRewriter: () => r.default,
        markTrialExpiredShown: () => d.markTrialExpiredShown,
        post: () => d.post,
        postAnswerRequest: () => i.default,
        postRewriterRequest: () => o.postRewriterRequest,
        profanity: () => d.profanity,
        reloadPage: () => d.reloadPage,
        removeMultiplePage: () => d.removeMultiplePage,
        removePage: () => d.removePage,
        requestAiTrial: () => d.requestAiTrial,
        resetAgentSources: () => c.resetAgentSources,
        saveAgentSettings: () => c.saveAgentSettings,
        saveBaseAgentSettings: () => c.saveBaseAgentSettings,
        sendAgentPreviewMessage: () => c.sendAgentPreviewMessage,
        sendAgentSurveyIsSeenMetric: () => u.sendAgentSurveyIsSeenMetric,
        sendFirstTimeAgentSetupMetric: () => s.sendFirstTimeAgentSetupMetric,
        setAnswerOnboarding: () => d.setAnswerOnboarding,
        summarize: () => d.summarize,
        switchMultiplePageAvailability: () => d.switchMultiplePageAvailability,
        switchMultipleSourceAvailability: () => d.switchMultipleSourceAvailability,
        switchSourceAvailability: () => d.switchSourceAvailability,
        toggleAnswerSettings: () => d.toggleAnswerSettings,
        toggleEmotionDetectionSettings: () => d.toggleEmotionDetectionSettings,
        toggleTaskSuggestionSettings: () => d.toggleTaskSuggestionSettings,
        tone: () => d.tone,
        updateNameSource: () => d.updateNameSource,
        updatePage: () => d.updatePage,
        updateSourceData: () => d.updateSourceData,
        updateSourcePagesLang: () => d.updateSourcePagesLang,
        updateUrlSource: () => d.updateUrlSource
      });
      var r = n(872767),
        a = n(743773),
        i = n(746716),
        o = n(593444),
        u = n(508459),
        s = n(584840),
        c = n(700682),
        l = n(653140),
        d = n(604874),
        f = n(292562),
        p = n(908658)
    },
    743773: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => a
      });
      var r = n(604874);
      const a = function(e) {
        var t = e.data,
          n = e.answerId;
        (0, r.mark)({
          url: "".concat(r.MARK_ANSWER_URL, "/").concat(n),
          data: t
        })
      }
    },
    872767: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => i
      });
      var r = n(604874);

      function a(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      const i = function(e) {
        var t, n = e.currentText,
          i = e.rewriterAnswer,
          o = i.answer,
          u = i.answerId;
        t = n === o ? {
          data: {
            isUsed: !0
          }
        } : {
          data: {
            isUsed: !1,
            userText: n
          }
        }, (0, r.mark)(function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {},
              r = Object.keys(n);
            "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable
            })))), r.forEach((function(t) {
              a(e, t, n[t])
            }))
          }
          return e
        }({
          url: "".concat(r.MARK_REWRITER_URL, "/").concat(u)
        }, t))
      }
    },
    746716: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => g,
        postGenerateAnswerRequest: () => p
      });
      var r = n(717068),
        a = n(445368),
        i = n(292562),
        o = n(604874);

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
      var l, d = (l = s((function(e) {
          var t, n, r, u, s, l, d, f, p, g, S, v, h, y, E, w, A, b;
          return c(this, (function(c) {
            switch (c.label) {
              case 0:
                t = e.url, n = void 0 === t ? o.ANSWER_URL : t, r = e.data, u = e.resolve, s = e.reject, c.label = 1;
              case 1:
                return c.trys.push([1, 3, , 4]), [4, (0, o.post)({
                  url: n,
                  data: r
                })];
              case 2:
                return l = c.sent(), d = l.status, f = l.answer, p = void 0 === f ? "" : f, g = l.jobUuid, S = void 0 === g ? "" : g, v = l.detail, h = void 0 === v ? "" : v, y = l.answerId, E = l.usedReferences, w = l.code, p || d === i.RewriteStatusRequest.PENDING || d === i.RewriteStatusRequest.LOADING ? (u({
                  answer: p,
                  status: d,
                  usedReferences: E,
                  jobUuid: S,
                  answerId: y
                }), [2]) : (!h && S || s({
                  detail: h,
                  code: w
                }), [3, 4]);
              case 3:
                return A = c.sent(), b = A.detail ? A : {
                  detail: (0, a.i18n)("Something went wrong. Please Try again."),
                  code: i.RewriterErrorCodes.NOT_FOUND
                }, s(b), [3, 4];
              case 4:
                return [2]
            }
          }))
        })), function(e) {
          return l.apply(this, arguments)
        }),
        f = function() {
          var e = s((function(e) {
            var t, n, a, i, o, u, s, l;
            return c(this, (function(c) {
              return t = e.lastMessageId, n = e.talkId, a = e.entityId, i = e.entityType, o = new r.SplitPromise, u = o.promise, s = o.resolve, l = o.reject, d({
                data: {
                  talkId: n,
                  lastMessageId: t,
                  entityId: a,
                  entityType: i
                },
                resolve: s,
                reject: l
              }), [2, u]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        p = function() {
          var e = s((function(e) {
            var t, n, a, i, u, s, l, f;
            return c(this, (function(c) {
              return t = e.text, n = e.talkId, a = e.entityId, i = e.entityType, u = new r.SplitPromise, s = u.promise, l = u.resolve, f = u.reject, d({
                data: {
                  talkId: n,
                  text: t,
                  entityId: a,
                  entityType: i
                },
                url: "".concat(o.ANSWER_URL, "/direct"),
                resolve: l,
                reject: f
              }), [2, s]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }();
      const g = f
    },
    508459: (e, t, n) => {
      n.r(t), n.d(t, {
        sendAgentSurveyIsSeenMetric: () => c
      });
      var r = n(320526),
        a = n(417438),
        i = n(89217);

      function o(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      var u, s, c = (u = function() {
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
              return e.trys.push([0, 2, , 3]), [4, (0, r.saveSurveyResult)({
                name: a.Surveys.AGENT_SURVEY_SEEN,
                data: {
                  isSeen: !0
                },
                metadata: {
                  viewingTime: i.DEFAULT_VIEWING_TIME,
                  viewingUrl: window.location.pathname
                },
                options: {
                  isEnableCooldown: !1
                }
              })];
            case 1:
            case 2:
              return e.sent(), [3, 3];
            case 3:
              return [2]
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
      }, function() {
        return s.apply(this, arguments)
      })
    },
    584840: (e, t, n) => {
      n.r(t), n.d(t, {
        AgentSetupTypes: () => a.AgentSetupTypes,
        sendFirstTimeAgentSetupMetric: () => r.sendFirstTimeAgentSetupMetric
      });
      var r = n(595679),
        a = n(809114)
    },
    595679: (e, t, n) => {
      n.r(t), n.d(t, {
        sendFirstTimeAgentSetupMetric: () => c
      });
      var r = n(320526),
        a = n(417438),
        i = n(89217);

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
              return t.trys.push([0, 2, , 3]), [4, (0, r.saveSurveyResult)({
                name: a.Surveys.FIRST_TIME_AGENT_SETUP,
                data: {
                  setup: e
                },
                metadata: {
                  viewingTime: i.DEFAULT_VIEWING_TIME,
                  viewingUrl: window.location.pathname
                },
                options: {
                  isEnableCooldown: !1
                }
              })];
            case 1:
            case 2:
              return t.sent(), [3, 3];
            case 3:
              return [2]
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
    809114: (e, t, n) => {
      var r;
      n.r(t), n.d(t, {
          AgentSetupTypes: () => r
        }),
        function(e) {
          e.FROM_SCRATCH = "from_scratch", e.TEMPLATE = "template"
        }(r || (r = {}))
    },
    19050: (e, t, n) => {
      var r;
      n.r(t), n.d(t, {
          default: () => a
        }),
        function(e) {
          e[e.contacts = 1] = "contacts", e[e.leads = 2] = "leads", e[e.companies = 3] = "companies", e[e.todo = 4] = "todo", e[e.notes = 5] = "notes", e[e.tags = 7] = "tags", e[e.catalogs = 10] = "catalogs", e[e.catalog_elements = 11] = "catalog_elements", e[e.customers = 12] = "customers", e[e.transactions = 13] = "transactions", e[e.unsorted = 14] = "unsorted", e[e.mail = 16] = "mail", e[e.contacts_and_companies = 17] = "contacts_and_companies", e[e.amoforms = 19] = "amoforms", e[e.events = 23] = "events", e[e.talk = 24] = "talk", e[e.files = 25] = "files"
        }(r || (r = {}));
      const a = r
    },
    286340: (e, t, n) => {
      n.r(t), n.d(t, {
        getEntityLangInCustomers: () => i
      });
      var r = n(629133),
        a = n.n(r),
        i = function(e) {
          if (APP.isCard()) {
            var t = a().find(APP.constant("account").cf, (function(t) {
              return t.ELEMENT_TYPES[0] === APP.element_types[e] && "Language" === t.NAME
            }));
            if (t && APP.data.current_card) {
              var n, r = APP.data.current_card.model.get("CFV[".concat(t.ID, "]"));
              if (t.ENUMS && r) return null === (n = t.ENUMS[r]) || void 0 === n ? void 0 : n.VALUE.toString().toLowerCase()
            }
          }
          return APP.lang_id
        }
    },
    197634: (e, t, n) => {
      n.r(t), n.d(t, {
        isEmptyString: () => r
      });
      var r = function(e) {
        return !Boolean(e.trim().length)
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "34daa87d-f05f-4fc4-a84a-d5c0a76b212b", e._sentryDebugIdIdentifier = "sentry-dbid-34daa87d-f05f-4fc4-a84a-d5c0a76b212b")
    } catch (e) {}
  }();
//# sourceMappingURL=60190.049a8abb5f87578dfcb1.js.map