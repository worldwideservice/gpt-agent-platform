"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [90001], {
    510236: (e, t, n) => {
      n.r(t), n.d(t, {
        TextArea: () => p
      });
      var r = n(824246),
        a = n(827378),
        i = n(22538),
        o = n(55436),
        u = n(847306),
        s = n(445857),
        c = n(432467),
        l = n(901926),
        f = n(799591),
        d = n(311347);
      n(957935);
      const p = (0, a.forwardRef)(((e, t) => {
        const {
          className: n = "",
          isDisabled: a,
          isReadOnly: p,
          isInvalid: m = !1,
          isAutosized: h = !1,
          isPlaceholderVisibleOnFocus: y = !1,
          invalidDescription: v,
          onAutosize: b = u.noop,
          maxHeight: E,
          value: w,
          theme: g,
          ...A
        } = e, T = (0, o.useThemeClassName)(g), S = (0, d.useAutosizeTextarea)(b, h, [w, h]);
        return (0, r.jsxs)("div", {
          className: (0, i.c)("_wrapper_1afq7_1", T, n),
          children: [(0, r.jsx)("div", {
            className: (0, i.c)("_textarea_container_1afq7_7", {
              _invalid_1afq7_69: m,
              _disabled_1afq7_64: a
            }),
            children: (0, r.jsx)("textarea", {
              style: {
                maxHeight: E
              },
              ref: (0, s.mergeRefs)(S, t),
              className: (0, i.c)(c.CustomScrollClassName, "_textarea_1afq7_7", {
                _placeholder_visible_1afq7_46: y
              }),
              disabled: a,
              readOnly: p,
              value: w,
              ...A
            })
          }), !(!m || !v) && (0, r.jsx)(l.Text, {
            className: (0, i.c)("_invalid_description_1afq7_69"),
            size: "m",
            theme: f.TextPrimaryTheme,
            children: v
          })]
        })
      }));
      p.displayName = "TextArea"
    },
    498716: (e, t, n) => {
      n.r(t), n.d(t, {
        TextareaDarkTheme: () => i,
        TextareaLightTheme: () => a
      });
      const r = {
          "--crm-ui-kit-textarea-disabled-border-color": "var(--crm-ui-kit-palette-border-primary)",
          "--crm-ui-kit-textarea-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-textarea-disabled-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-textarea-placeholder-color": "var(--crm-ui-kit-palette-placeholder-primary)",
          "--crm-ui-kit-textarea-error-border-color": "var(--crm-ui-kit-palette-border-error)",
          "--crm-ui-kit-textarea-error-color": "var(--crm-ui-kit-color-error)",
          "--crm-ui-kit-textarea-error-placeholder-color": "var(--crm-ui-kit-palette-placeholder-primary)",
          "--crm-ui-kit-textarea-background-color": "var(--crm-ui-kit-palette-background-primary)",
          "--crm-ui-kit-textarea-disabled-background-color": "transparent",
          "--crm-ui-kit-textarea-disabled-opacity": "0.6",
          "--crm-ui-kit-textarea-font-weight": "400",
          "--crm-ui-kit-textarea-font-size": "var(--crm-ui-kit-base-font-size)",
          "--crm-ui-kit-textarea-line-height": "19px",
          "--crm-ui-kit-textarea-padding-top": "8px",
          "--crm-ui-kit-textarea-padding-horizontal": "9px",
          "--crm-ui-kit-textarea-padding-bottom": "7px",
          "--crm-ui-kit-textarea-border-radius": "3px",
          "--crm-ui-kit-textarea-spacing": "4px",
          "--crm-ui-kit-textarea-width": "100%",
          "--crm-ui-kit-textarea-min-height": "56px",
          "--crm-ui-kit-textarea-border-width": "1px",
          "--crm-ui-kit-textarea-border-style": "solid",
          "--crm-ui-kit-textarea-scrollbar-thumb-background": "var(--crm-ui-kit-palette-scrollbar-thumb-background)",
          "--crm-ui-kit-textarea-scrollbar-offset": "4px"
        },
        a = {
          ...r,
          "--crm-ui-kit-textarea-border-color": "var(--crm-ui-kit-palette-border-default)"
        },
        i = {
          ...r,
          "--crm-ui-kit-textarea-border-color": "var(--crm-ui-kit-palette-border-primary)"
        }
    },
    311347: (e, t, n) => {
      n.r(t), n.d(t, {
        useAutosizeTextarea: () => a
      });
      var r = n(827378);
      const a = (e, t, n) => {
        const a = (0, r.useRef)(null),
          i = (0, r.useRef)(),
          o = (0, r.useCallback)((n => {
            t && n.offsetParent && (n.style.height = "", n.style.height = `${n.scrollHeight}px`, n.scrollHeight !== i.current && e && (e(n), i.current = n.scrollHeight))
          }), [t, e]),
          u = (0, r.useCallback)((() => {
            const e = a.current;
            e && o(e)
          }), [a, o]);
        return (0, r.useLayoutEffect)(u, [...n, u]), a
      }
    },
    534139: (e, t, n) => {
      n.r(t), n.d(t, {
        TextArea: () => r.TextArea,
        TextareaDarkTheme: () => a.TextareaDarkTheme,
        TextareaLightTheme: () => a.TextareaLightTheme
      });
      var r = n(510236),
        a = n(498716)
    },
    967482: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = n.p + "images/1098a699e820ce1c902274ea3790bc79.svg"
    },
    730185: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        modal: "a3eeef05a"
      }
    },
    990205: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        wrapper: "a0afb7da0",
        title: "a64cafaa5",
        text: "a34ccaf40"
      }
    },
    494036: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        wrapper: "eda42ad0",
        title: "a5424459d",
        text: "a9fbbb570"
      }
    },
    73587: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        wrapper: "a0daa7b26",
        icon: "a2b7706c6",
        title: "a4407a1ab"
      }
    },
    650040: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        wrapper: "a6b57884e",
        title: "a7d7ff31e",
        tip: "a31d1ea3e",
        "tip-icon-wrapper": "a9f48aaaa",
        "tip-icon": "fb461036"
      }
    },
    862040: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        body: "a78fa16bc",
        text: "a79022247",
        "close-button": "a30f0a07e",
        "close-icon": "a176d9cc8",
        "trial-text": "a32f11c4",
        "trial-modal": "a1e4806dc",
        "trial-button": "cf60be3a",
        title: "b1782f04"
      }
    },
    336015: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        button: "a8b864092",
        loading: "d9e58d52",
        disable: "a3acb09fa",
        active: "a90eb90ea",
        preview: "a6c053be3"
      }
    },
    687083: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        answer: "a4b09b0c6",
        header: "a56745395",
        icon: "a05ad60fe",
        heading: "a78162dfa",
        main: "a05a9ce7e",
        text: "a05a34f96",
        "customersus-text": "a0e647c0f",
        close: "b09fa820",
        buttons: "a57116f79",
        "links-text": "f4f2a06e",
        resources: "a618f501d",
        links: "afa4c49e",
        link: "a05aa79fc"
      }
    },
    728822: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        button: "a920dad12",
        active: "a9772fd6a"
      }
    },
    604789: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        button: "a7c302fd7",
        preview: "a2f08207a",
        loading: "a0f83ed37",
        disable: "a5f112ee3",
        active: "a797d87ab"
      }
    },
    758918: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        control: "a013f64e3",
        header: "a398bda47",
        brand: "a1def16e6",
        active: "a2d8676c0",
        wrapper: "a27a18419",
        opened: "a461ac023",
        sticker: "a57dd08c3"
      }
    },
    275814: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        wrapper: "a5dfddfac",
        text: "a763d8e14",
        button: "a18c1668a"
      }
    },
    84290: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => r
      });
      const r = {
        select: "a6e70a78a",
        option: "a7ada0098",
        "option-icon": "a62480ef2",
        "option-revert": "a0009fbc6",
        icon: "a7cdc7778"
      }
    },
    957935: (e, t, n) => {
      n.r(t)
    },
    555424: (e, t, n) => {
      n.r(t), n.d(t, {
        getTaskRequest: () => d
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
      var l, f = (l = s((function(e) {
          var t, n, r, u, s, l, f, d, p, m, h, y, v, b, E, w, g, A, T;
          return c(this, (function(c) {
            switch (c.label) {
              case 0:
                t = e.jobUuid, n = e.maxRequestCount, r = e.url, u = e.resolve, s = e.reject, l = e.requestCount, f = e.incrementRequestCount, d = e.clearRequestCount, c.label = 1;
              case 1:
                return c.trys.push([1, 3, , 4]), [4, (0, i.get)({
                  url: "".concat(r, "/").concat(t)
                })];
              case 2:
                switch (p = c.sent(), m = p.status, h = p.taskId, y = void 0 === h ? null : h, v = p.taskText, b = void 0 === v ? "" : v, E = p.taskDeadline, w = void 0 === E ? null : E, g = p.taskType, m) {
                  case o.RewriteStatusRequest.ERROR:
                    d(), s({
                      detail: (0, a.i18n)("Something went wrong")
                    });
                    break;
                  case o.RewriteStatusRequest.PENDING:
                    l + 1 === n ? (d(), s({
                      detail: (0, a.i18n)("Something went wrong"),
                      code: o.RewriterErrorCodes.NOT_FOUND
                    })) : f();
                    break;
                  case o.RewriteStatusRequest.LOADING:
                  case o.RewriteStatusRequest.SUCCESS:
                    w && d()
                }
                return u({
                  taskId: y,
                  taskDeadline: w,
                  status: m,
                  taskText: b,
                  taskType: g
                }), [3, 4];
              case 3:
                return A = c.sent(), T = A.detail ? A : {
                  detail: (0, a.i18n)("Something went wrong"),
                  code: o.RewriterErrorCodes.NOT_FOUND
                }, d(), s(T), [3, 4];
              case 4:
                return [2]
            }
          }))
        })), function(e) {
          return l.apply(this, arguments)
        }),
        d = function() {
          var e = s((function(e) {
            var t, n, a, i, o, u, s, l, d, p;
            return c(this, (function(c) {
              return t = e.jobUuid, n = e.maxRequestCount, a = e.url, i = e.requestCount, o = e.incrementRequestCount, u = e.clearRequestCount, s = new r.SplitPromise, l = s.promise, d = s.resolve, p = s.reject, f({
                jobUuid: t,
                resolve: d,
                reject: p,
                maxRequestCount: n,
                url: a,
                requestCount: i,
                incrementRequestCount: o,
                clearRequestCount: u
              }), [2, l]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    58256: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => p
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
      var l, f = (l = s((function(e) {
          var t, n, r, u, s, l, f, d, p, m, h, y, v, b, E, w, g, A, T;
          return c(this, (function(c) {
            switch (c.label) {
              case 0:
                t = e.messageId, n = e.talkId, r = e.elementId, u = e.elementType, s = e.resolve, l = e.reject, c.label = 1;
              case 1:
                return c.trys.push([1, 3, , 4]), [4, (0, o.post)({
                  url: o.TASK_URL,
                  data: {
                    talkId: n,
                    lastMessageId: t,
                    entityId: r,
                    entityType: u
                  }
                })];
              case 2:
                return f = c.sent(), d = f.status, p = f.taskId, m = void 0 === p ? null : p, h = f.taskText, y = void 0 === h ? "" : h, v = f.jobUuid, b = void 0 === v ? "" : v, E = f.taskDeadline, w = void 0 === E ? null : E, g = f.taskType, y || d === i.RewriteStatusRequest.PENDING || d === i.RewriteStatusRequest.LOADING ? (s({
                  taskId: m,
                  taskText: y,
                  status: d,
                  taskDeadline: w,
                  jobUuid: b,
                  taskType: g
                }), [2]) : (!y && b || l({
                  taskText: y
                }), [3, 4]);
              case 3:
                return A = c.sent(), T = A.detail ? A : {
                  detail: (0, a.i18n)("Something went wrong. Please Try again."),
                  code: i.RewriterErrorCodes.NOT_FOUND
                }, l(T), [3, 4];
              case 4:
                return [2]
            }
          }))
        })), function(e) {
          return l.apply(this, arguments)
        }),
        d = function() {
          var e = s((function(e) {
            var t, n, a, i, o, u, s, l;
            return c(this, (function(c) {
              return t = e.messageId, n = e.talkId, a = e.elementId, i = e.elementType, o = new r.SplitPromise, u = o.promise, s = o.resolve, l = o.reject, f({
                talkId: n,
                messageId: t,
                elementId: a,
                elementType: i,
                resolve: s,
                reject: l
              }), [2, u]
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }();
      const p = d
    },
    672034: (e, t, n) => {
      n.r(t), n.d(t, {
        editFeatures: () => h,
        getFeaturesByQuery: () => p,
        isFeaturesAvailableAsync: () => y,
        updateFeatureConstants: () => m
      });
      var r = n(629133),
        a = n.n(r),
        i = n(500034),
        o = n(104737),
        u = n(796077);

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
      var f, d = {},
        p = (f = c((function(e) {
          var t, n, r, s, c, f, p, m, h, y;
          return l(this, (function(l) {
            switch (l.label) {
              case 0:
                t = e.queries, n = e.shouldCamelCase, r = void 0 === n || n, s = a().map(t, (function(e) {
                  return (0, u.snakeizeString)(e)
                })), c = a().sortBy(s), f = JSON.stringify({
                  queries: c,
                  shouldCamelCase: r
                }), l.label = 1;
              case 1:
                return l.trys.push([1, , 3, 4]), a().has(d, f) ? [2, d[f]] : (p = o.default.request({
                  url: "/ajax/v4/features",
                  method: "GET",
                  data: {
                    features: s
                  },
                  shouldCamelizeResponse: r
                }), d[f] = p, [4, p]);
              case 2:
                return m = l.sent(), h = m.features, y = m.featuresParams, a().each(h, (function(e, t) {
                  a().isString(t) && (0, i.updateFeature)(t, Boolean(e))
                })), [2, {
                  features: h,
                  featuresParams: y
                }];
              case 3:
                return delete d[f], [7];
              case 4:
                return [2]
            }
          }))
        })), function(e) {
          return f.apply(this, arguments)
        }),
        m = function(e) {
          a().each(e, (function(e, t) {
            var n = e.isAvailable;
            (0, i.updateFeature)(t, n)
          }))
        },
        h = function() {
          var e = c((function(e) {
            var t, n = arguments;
            return l(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = !(n.length > 1 && void 0 !== n[1]) || n[1], [4, o.default.request({
                    url: "/ajax/v4/features",
                    method: "POST",
                    data: e
                  })];
                case 1:
                  return r.sent(), t && m(e), [2]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        y = function() {
          var e = c((function(e) {
            var t, n;
            return l(this, (function(r) {
              switch (r.label) {
                case 0:
                  return t = e.queries, a().every(t, (function(e) {
                    return (0, i.isFeatureDefined)(e)
                  })) ? [2, a().every(t, (function(e) {
                    return Boolean((0, i.isFeatureAvailable)(e))
                  }))] : [4, p({
                    queries: t,
                    shouldCamelCase: !1
                  })];
                case 1:
                  return n = r.sent().features, [2, a().every(t, (function(e) {
                    return n[e]
                  }))]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    872828: (e, t, n) => {
      var r, a;
      n.r(t), n.d(t, {
          AiAgentActivationSteps: () => r,
          UserChoice: () => a
        }),
        function(e) {
          e.OFFER = "offer", e.CONFIRM = "confirm", e.SUCCESS = "success"
        }(r || (r = {})),
        function(e) {
          e.TURN_ON_FIRST_MODAL = "turn_on_first_modal", e.TURN_ON_SECOND_MODAL = "turn_on_second_modal", e.NOT_INTERESTED = "not_interested", e.CLOSE_FIRST_MODAL = "close_first_modal", e.CLOSE_SECOND_MODAL = "close_second_modal", e.REQUEST_TURN_ON = "request_turn_on", e.REQUEST_NOT_INTERESTED = "request_not_interested", e.REQUEST_CLOSE_MODAL = "request_close_modal"
        }(a || (a = {}))
    },
    201029: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => v
      });
      var r = n(827378),
        a = n.n(r),
        i = n(292554),
        o = n.n(i),
        u = n(859200),
        s = n(960190),
        c = n(438089),
        l = n(417438),
        f = n(246541),
        d = n(129624),
        p = n(872828),
        m = n(825650),
        h = n(730185),
        y = o().bind(h.default);
      const v = function(e) {
        var t = e.onCloseRequest,
          n = e.onSuccess,
          i = (0, d.default)().getSurveyData,
          o = (0, l.useInvalidateSurveyRequest)().invalidateSurveyRequest,
          h = p.AiAgentActivationSteps.OFFER,
          v = function(e) {
            n(i(e)), o()
          },
          b = function() {
            t()
          },
          E = function(e) {
            h = e
          },
          w = function() {
            var e;
            h !== p.AiAgentActivationSteps.SUCCESS && (e = (0, u.isAdmin)() ? h === p.AiAgentActivationSteps.OFFER ? p.UserChoice.CLOSE_FIRST_MODAL : p.UserChoice.CLOSE_SECOND_MODAL : p.UserChoice.REQUEST_CLOSE_MODAL, v({
              userChoice: e
            }))
          },
          g = (0, c.default)((function() {
            return a().createElement(f.GlobalUnifiedModal, {
              onClose: b,
              size: "s",
              customPosition: {
                right: "40px",
                bottom: "40px"
              },
              isPopup: !0,
              isCloseButtonVisible: !0,
              onCloseButtonClick: w,
              slideDirection: "right",
              className: y("modal"),
              hideDistance: 600
            }, a().createElement(m.default, {
              onStepChange: E,
              onSuccess: v
            }))
          })),
          A = g.modalElement,
          T = g.showModal;
        return (0, r.useEffect)((function() {
          T(), (0, s.sendAgentSurveyIsSeenMetric)()
        }), []), A
      }
    },
    809764: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => b
      });
      var r = n(292554),
        a = n.n(r),
        i = n(916569),
        o = n(529062),
        u = n(701106),
        s = n(445368),
        c = n(464702),
        l = n(417438),
        f = n(872828),
        d = n(990205),
        p = n(827378),
        m = a().bind(d.default),
        h = (0, c.getCDNPath)("/frontend/images/interface/ai/"),
        y = APP.lang_id.toUpperCase(),
        v = {
          "1x": "".concat(h, "ai_agent_activation_popup_").concat(y, ".png"),
          "2x": "".concat(h, "ai_agent_activation_popup_").concat(y, "@2x.png")
        };
      const b = function(e) {
        var t = e.onCloseRequest,
          n = e.onSuccess;
        return p.createElement(l.BaseStep, {
          images: v
        }, p.createElement("div", {
          className: m("wrapper")
        }, p.createElement("div", null, p.createElement(u.default, {
          className: m("title"),
          type: "h2",
          size: "xxl"
        }, (0, s.i18n)("If you change your mind...")), p.createElement(i.Text, {
          theme: i.TextPrimaryTheme,
          className: m("text"),
          size: "l"
        }, (0, s.i18n)("You can activate the AI agent any time, take it for a test run, and customize its knowledge in the Kommo AI settings."))), p.createElement("div", null, p.createElement(o.Button, {
          theme: o.ButtonPrimaryTheme,
          onClick: function() {
            n({
              userChoice: f.UserChoice.NOT_INTERESTED
            }), t()
          }
        }, (0, s.i18n)("Got it")), p.createElement(o.Button, {
          theme: o.ButtonSecondaryTheme,
          onClick: function() {
            n({
              userChoice: f.UserChoice.TURN_ON_SECOND_MODAL
            }), APP.router.navigate("/settings/ai-agent", {
              trigger: !0
            })
          }
        }, (0, s.i18n)("Go to settings")))))
      }
    },
    227318: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => A
      });
      var r = n(292554),
        a = n.n(r),
        i = n(916569),
        o = n(529062),
        u = n(701106),
        s = n(445368),
        c = n(464702),
        l = n(859200),
        f = n(960190),
        d = n(292562),
        p = n(613092),
        m = n(417438),
        h = n(872828),
        y = n(494036),
        v = n(827378),
        b = a().bind(y.default),
        E = (0, c.getCDNPath)("/frontend/images/interface/ai/"),
        w = APP.lang_id.toUpperCase(),
        g = {
          "1x": "".concat(E, "ai_agent_activation_popup_").concat(w, ".png"),
          "2x": "".concat(E, "ai_agent_activation_popup_").concat(w, "@2x.png")
        };
      const A = function(e) {
        var t = e.onSuccess,
          n = e.onCloseRequest,
          r = (0, p.useSteps)().changeStep,
          a = (0, l.isAdmin)() ? "Try now (CTA)" : "Request admin to set up";
        return v.createElement(m.BaseStep, {
          images: g
        }, v.createElement("div", {
          className: b("wrapper")
        }, v.createElement("div", null, v.createElement(u.default, {
          className: b("title"),
          type: "h2",
          size: "xxl"
        }, (0, s.i18n)("Meet your all-new AI agent")), v.createElement(i.Text, {
          theme: i.TextPrimaryTheme,
          className: b("text"),
          size: "l"
        }, (0, s.i18n)("Now AI agent is fully customizable—set the tone, role, workflows, and rules to fit your business. Use ready-made templates or build one from scratch to make sales 24/7 and more effective than ever."))), v.createElement("div", null, v.createElement(o.Button, {
          theme: o.ButtonPrimaryTheme,
          onClick: function() {
            (0, l.isAdmin)() ? (t({
              userChoice: h.UserChoice.TURN_ON_FIRST_MODAL
            }), APP.router.navigate("settings/ai-agent", {
              trigger: !0
            })) : (t({
              userChoice: h.UserChoice.REQUEST_TURN_ON
            }), (0, f.requestAiTrial)(d.TrialUserRequest.AGENT_REQUESTED), r(h.AiAgentActivationSteps.SUCCESS))
          }
        }, (0, s.i18n)(a)), v.createElement(o.Button, {
          theme: o.ButtonSecondaryTheme,
          onClick: function() {
            (0, l.isAdmin)() ? r(h.AiAgentActivationSteps.CONFIRM): (t({
              userChoice: h.UserChoice.REQUEST_NOT_INTERESTED
            }), n())
          }
        }, (0, s.i18n)("I'm not interested")))))
      }
    },
    711480: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => m
      });
      var r = n(827378),
        a = n.n(r),
        i = n(292554),
        o = n.n(i),
        u = n(916569),
        s = n(701106),
        c = n(491967),
        l = n(445368),
        f = n(970948),
        d = n(73587),
        p = o().bind(d.default);
      const m = function(e) {
        var t = e.onCloseRequest;
        return (0, r.useEffect)((function() {
          setTimeout((function() {
            t()
          }), 3e3)
        }), []), a().createElement(f.default, null, a().createElement("div", {
          className: p("wrapper")
        }, a().createElement(c.default, {
          type: "svg",
          name: "settings--widgets--check",
          className: p("icon")
        }), a().createElement(s.default, {
          type: "h2",
          size: "xxl",
          className: p("title")
        }, (0, l.i18n)("Success (AI)")), a().createElement(u.Text, {
          theme: u.TextPrimaryTheme,
          size: "l"
        }, (0, l.i18n)("Request sent"))))
      }
    },
    598505: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => l
      });
      var r = n(827378),
        a = n.n(r),
        i = n(613092),
        o = n(227318),
        u = n(711480),
        s = n(809764),
        c = n(872828);
      const l = function(e) {
        var t = e.onClose,
          n = e.onStepChange,
          l = e.onSuccess,
          f = (0, i.useSteps)().activeStep;
        switch ((0, r.useEffect)((function() {
            n(f)
          }), [f]), f) {
          case c.AiAgentActivationSteps.OFFER:
            return a().createElement(o.default, {
              onSuccess: l,
              onCloseRequest: t
            });
          case c.AiAgentActivationSteps.CONFIRM:
            return a().createElement(s.default, {
              onSuccess: l,
              onCloseRequest: t
            });
          case c.AiAgentActivationSteps.SUCCESS:
            return a().createElement(u.default, {
              onCloseRequest: t
            })
        }
      }
    },
    825650: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => c
      });
      var r = n(629133),
        a = n.n(r),
        i = n(598505),
        o = n(872828),
        u = n(613092),
        s = n(827378);
      const c = (0, u.withStepsProvider)((function(e) {
        var t = e.onSuccess,
          n = e.onStepChange,
          r = e.onClose,
          o = void 0 === r ? a().noop : r;
        return s.createElement(i.default, {
          onSuccess: t,
          onStepChange: n,
          onClose: o
        })
      }), o.AiAgentActivationSteps.OFFER)
    },
    129624: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => u
      });
      var r = n(161320),
        a = n.n(r),
        i = n(827378),
        o = n(417438);
      const u = function() {
        var e = (0, i.useRef)(a()());
        return {
          getSurveyData: function(t) {
            var n = t.userChoice,
              r = a()().diff(e.current, "seconds");
            return {
              name: o.Surveys.AI_AGENT_ACTIVATION,
              data: {
                userChoice: n
              },
              metadata: {
                viewingTime: r,
                viewingUrl: window.location.pathname
              }
            }
          }
        }
      }
    },
    559261: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => b
      });
      var r = n(827378),
        a = n(292554),
        i = n.n(a),
        o = n(916569),
        u = n(724329),
        s = n(491967),
        c = n(701106),
        l = n(445368),
        f = n(961790),
        d = n(650040),
        p = n(827378);

      function m(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function h(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function y(e, t) {
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
            if ("string" == typeof e) return m(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? m(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }
      var v = i().bind(d.default);
      const b = function(e) {
        var t, n, a = e.talkIds,
          i = y((0, r.useState)(!1), 2),
          d = i[0],
          m = i[1],
          b = y((0, r.useState)(!1), 2),
          E = b[0],
          w = b[1],
          g = (0, r.useRef)(null),
          A = (0, f.default)({
            talkIds: a,
            onSuccessAiAgentDisable: function() {
              m(!1), w(!1)
            },
            onSuccessIsAiAgentEnabled: function() {
              m(!0)
            }
          }),
          T = A.disableAiAgent,
          S = A.overlayElement,
          R = (t = function() {
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
              return T(), [2]
            }))
          }, n = function() {
            var e = this,
              n = arguments;
            return new Promise((function(r, a) {
              var i = t.apply(e, n);

              function o(e) {
                h(i, r, a, o, u, "next", e)
              }

              function u(e) {
                h(i, r, a, o, u, "throw", e)
              }
              o(void 0)
            }))
          }, function() {
            return n.apply(this, arguments)
          });
        return (0, u.useOnOutsideClick)({
          ref: g,
          handler: function() {
            w(!1)
          }
        }), d ? p.createElement("div", {
          ref: g,
          className: v("wrapper")
        }, p.createElement(o.Text, {
          theme: o.TextSecondaryDarkTheme,
          size: "m",
          className: v("title"),
          onClick: function() {
            w(!E)
          }
        }, (0, l.i18n)("AI_agent")), E && p.createElement("div", {
          className: v("tip")
        }, S, p.createElement(c.default, {
          type: "h2",
          size: "l"
        }, (0, l.i18n)("AI_agent")), p.createElement("div", {
          onClick: R,
          className: v("tip-icon-wrapper")
        }, p.createElement(s.default, {
          type: "svg",
          name: "salesbot--stop-bot-icon",
          className: v("tip-icon")
        })))) : null
      }
    },
    961790: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => d
      });
      var r = n(629133),
        a = n.n(r),
        i = n(724329),
        o = n(960190),
        u = n(393914);

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
      var f = "canceled";
      const d = function(e) {
        var t, n = e.talkIds,
          r = e.onSuccessAiAgentDisable,
          s = e.onSuccessIsAiAgentEnabled,
          d = (0, u.default)(),
          p = d.showOverlay,
          m = d.hideOverlay,
          h = d.overlayElement,
          y = (t = c((function() {
            var e, t;
            return l(this, (function(i) {
              switch (i.label) {
                case 0:
                  return i.trys.push([0, 2, 3, 4]), p(), [4, (0, o.disableAiAgent)({
                    talkIds: n
                  })];
                case 1:
                  return (e = i.sent()).Embedded ? (a().every(e.Embedded.states, (function(e) {
                    return e.state.state === f
                  })) && r(), [3, 4]) : [2];
                case 2:
                  return t = i.sent(), console.error(t), [3, 4];
                case 3:
                  return m(), [7];
                case 4:
                  return [2]
              }
            }))
          })), function() {
            return t.apply(this, arguments)
          }),
          v = function() {
            var e = c((function() {
              var e, t, r;
              return l(this, (function(i) {
                switch (i.label) {
                  case 0:
                    return i.trys.push([0, 2, , 3]), [4, (0, o.getIsAiAgentEnabled)({
                      talkIds: n
                    })];
                  case 1:
                    return e = i.sent(), t = e.Embedded.states, a().isEmpty(t) || !a().some(t, (function(e) {
                      return e.state.state !== f
                    })) ? [2] : (s(), [3, 3]);
                  case 2:
                    return r = i.sent(), console.error(r), [3, 3];
                  case 3:
                    return [2]
                }
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }();
        return (0, i.useDeepCompareEffect)((function() {
          a().isEmpty(n) ? r() : v()
        }), [n]), {
          overlayElement: h,
          disableAiAgent: y
        }
      }
    },
    99854: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => C
      });
      var r = n(292554),
        a = n.n(r),
        i = n(827378),
        o = n(629133),
        u = n.n(o),
        s = n(529062),
        c = n(916569),
        l = n(701106),
        f = n(926168),
        d = n(445368),
        p = n(225526),
        m = n(292562),
        h = n(635365),
        y = n(954480),
        v = n(304483),
        b = n(604733),
        E = n(862040),
        w = n(827378);

      function g(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }
      var A, T = a().bind(E.default),
        S = (0, f.isTrial)(),
        R = (0, f.isExpired)(),
        k = S || R,
        _ = !0;
      const C = function(e) {
        var t, n, r = e.onCloseRequest,
          a = void 0 === r ? u().noop : r,
          o = e.error,
          f = (0, h.useModalProvider)().ModalProvider,
          E = (0, y.useSupportChatMessage)(),
          S = E.sendMessageAndGoToSupportChat,
          R = E.isLoading,
          C = function() {
            a()
          },
          I = function() {
            _ = !1, A = setTimeout((function() {
              _ = !0
            }), 1e4)
          },
          x = (t = function() {
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
              return k ? (APP.router.navigate("/settings/pay/", {
                trigger: !0
              }), a(), [2]) : (a(), (new v.default).showSuccess((0, d.i18n)("Feedback received!"), null, 500), setTimeout((function() {
                return S((0, d.i18n)("Hi! I have reached the limit for AI requests. Could you please increase my limit?"), {
                  isNeedToSendMessage: _,
                  onSuccess: I
                })
              }), 500), [2])
            }))
          }, n = function() {
            var e = this,
              n = arguments;
            return new Promise((function(r, a) {
              var i = t.apply(e, n);

              function o(e) {
                g(i, r, a, o, u, "next", e)
              }

              function u(e) {
                g(i, r, a, o, u, "throw", e)
              }
              o(void 0)
            }))
          }, function() {
            return n.apply(this, arguments)
          });
        if ((0, i.useEffect)((function() {
            return function() {
              clearTimeout(A)
            }
          }), []), !o) return null;
        var O = o.code,
          N = void 0 === O ? "" : O,
          P = o.detail,
          L = void 0 === P ? "" : P,
          U = N === m.RewriterErrorCodes.PAYMENT_REQUIRED;
        return w.createElement(f, {
          onCloseRequest: C,
          bodyClassName: T("body"),
          bodyInnerClassName: T("wrapper")
        }, U ? k ? w.createElement("div", {
          className: T("trial-modal")
        }, w.createElement(l.default, {
          type: "h2",
          size: "xl",
          weight: "normal",
          className: T("title")
        }, (0, d.i18n)("You’ve reached your AI limit for the Kommo trial.")), w.createElement(p.CloseModalButton, {
          onClick: C,
          className: T("close-button")
        }), w.createElement(c.Text, {
          size: "l",
          theme: c.TextPrimaryTheme,
          className: T("trial-text")
        }, (0, d.i18n)("To continue using Kommo AI, please subscribe to a paid plan.")), w.createElement(s.Button, {
          theme: s.ButtonPrimaryTheme,
          onClick: x,
          className: T("trial-button")
        }, (0, d.i18n)("Go to Billing"))) : w.createElement(b.AiUsageSurvey, {
          onCloseRequest: C,
          onSubmit: x,
          isLoading: R
        }) : w.createElement("div", {
          className: "modal-body__caption head_2 modal-body__caption-error"
        }, L))
      }
    },
    524176: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => k
      });
      var r = n(267651),
        a = n.n(r),
        i = n(827378),
        o = n(629133),
        u = n.n(o),
        s = n(770086),
        c = n(564638),
        l = n(500034),
        f = n(614759),
        d = n(436132),
        p = n(117464),
        m = n(174246),
        h = n(355582),
        y = n(30893),
        v = n(827378);

      function b(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function E(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function w(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function g(e, t) {
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
            if ("string" == typeof e) return b(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? b(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }
      var A = [d.AiHelperType.TASK, d.AiHelperType.ANSWER],
        T = function(e) {
          return u().indexOf(A, e)
        },
        S = (0, l.isFeatureAvailable)("ai_agent_viewable") || (0, l.isFeatureAvailable)("kommo_ai_trial_started") && !(0, l.isFeatureAvailable)("kommo_ai_trial_ended"),
        R = (0, l.isFeatureAvailable)("is_ai_task_suggestion_enabled");
      const k = (0, f.withQueryProvider)((function(e) {
        var t = e.getText,
          n = e.onLoad,
          r = e.setText,
          o = e.shouldAiAnswerShow,
          f = e.shouldAiTaskShow,
          b = e.messageId,
          A = void 0 === b ? "" : b,
          k = e.talkId,
          _ = e.text,
          C = e.answerType,
          I = void 0 === C ? d.AnswerType.DEFAULT : C,
          x = e.elementType,
          O = e.elementId,
          N = e.setHelperHeight,
          P = e.el,
          L = e.onAnswerReply,
          U = e.onHelperVisibilityChange,
          D = e.checkIsTaskExists,
          M = e.shouldCheckGrammar,
          H = g((0, i.useState)(A), 2),
          q = H[0],
          F = H[1],
          G = g((0, i.useState)(k), 2),
          j = G[0],
          B = G[1],
          W = g((0, i.useState)(o), 2),
          z = W[0],
          Y = W[1],
          K = g((0, i.useState)(f), 2),
          Q = K[0],
          $ = K[1],
          V = g((0, i.useState)({
            isOpened: !1,
            text: ""
          }), 2),
          X = V[0],
          Z = V[1],
          J = (0, i.useRef)(!1),
          ee = (0, i.useRef)(!1),
          te = (0, i.useRef)(null),
          ne = (0, i.useRef)(null),
          re = (0, i.useRef)(null),
          ae = (0, i.useRef)(null),
          ie = function(e, t) {
            var n = t.talkId,
              r = t.messageId;
            n !== k || ae.current || ee.current || (Y(!0), !D() && S && R && $(!0), F(r), B(n))
          },
          oe = function(e, t) {
            t.style.visibility = e ? "hidden" : "visible"
          },
          ue = function() {
            var e = P.getBoundingClientRect().width;
            if (ne.current) {
              var t = ne.current,
                n = t.hiddenAnswerElRef,
                r = t.openedAnswerElRef,
                a = n.current ? n.current : r.current;
              if (a && te.current) {
                var i = a.getBoundingClientRect().width,
                  o = te.current.getBoundingClientRect().width;
                oe(e < i + o, te.current)
              }
            }
          },
          se = u().throttle((function() {
            ue()
          }), c.WINDOW_RESIZE_THROTTLE_DELAY);
        (0, i.useEffect)((function() {
          var e = a().subscribe(d.AI_ANSWER_MESSAGE_ADD, ie),
            t = a().subscribe(d.AI_HELPER_RESIZE, se);
          return window.addEventListener("resize", se),
            function() {
              a().unsubscribe(e), a().unsubscribe(t), window.removeEventListener("resize", se), N(d.NULL_HELPER_HEIGHT)
            }
        }), []);
        var ce, le, fe = function(e) {
            ee.current = e, J.current = e
          },
          de = (ce = function(e) {
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
              return ae.current = null, [2, new Promise((function(t) {
                setTimeout((function() {
                  U(!1), t(!0)
                }), d.SHOW_HIDE_ANIMATION_DURATION_MS), e === d.AiHelperType.ANSWER && fe(!1)
              }))]
            }))
          }, le = function() {
            var e = this,
              t = arguments;
            return new Promise((function(n, r) {
              var a = ce.apply(e, t);

              function i(e) {
                E(a, n, r, i, o, "next", e)
              }

              function o(e) {
                E(a, n, r, i, o, "throw", e)
              }
              i(void 0)
            }))
          }, function(e) {
            return le.apply(this, arguments)
          }),
          pe = function(e) {
            var t = e.helperType,
              n = e.cb,
              r = e.isLoading,
              a = function() {
                ae.current = t, U(!0), n()
              };
            ae.current ? T(t) > T(ae.current) && !r && (ae.current === d.AiHelperType.TASK && re.current && oe(!0, re.current), ae.current = null, a()) : a()
          },
          me = function(e) {
            var t = e.helperType,
              n = e.errorMessage;
            ae.current && ae.current !== t || N(d.NULL_HELPER_HEIGHT), n && Z({
              isOpened: !0,
              text: n
            })
          };
        return v.createElement(v.Fragment, null, v.createElement(s.default, {
          isOpened: X.isOpened,
          onCloseRequest: function() {
            return Z((function(e) {
              return t = function(e) {
                for (var t = 1; t < arguments.length; t++) {
                  var n = null != arguments[t] ? arguments[t] : {},
                    r = Object.keys(n);
                  "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
                    return Object.getOwnPropertyDescriptor(n, e).enumerable
                  })))), r.forEach((function(t) {
                    w(e, t, n[t])
                  }))
                }
                return e
              }({}, e), n = null != (n = {
                isOpened: !1
              }) ? n : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : function(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                  var r = Object.getOwnPropertySymbols(e);
                  n.push.apply(n, r)
                }
                return n
              }(Object(n)).forEach((function(e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
              })), t;
              var t, n
            })), !0
          },
          isTryAgainAvailable: !1
        }, X.text), z && v.createElement(m.default, {
          elementId: O,
          elementType: x,
          type: (0, p.getUpdatedAnswerType)(I),
          onAnswerReply: L,
          onLoad: n,
          onShow: function() {
            ue(), fe(!0), ee.current = !1
          },
          onHide: de,
          onError: me,
          onProcess: function(e) {
            ee.current = e
          },
          setText: r,
          getText: t,
          setHelperHeight: N,
          messageId: q,
          talkId: j,
          text: _,
          ref: ne,
          shouldSuggestionShow: !(0, l.isFeatureAvailable)("ai_answer"),
          onTryToShow: pe
        }), Q && v.createElement(y.default, {
          ref: re,
          messageId: q,
          talkId: j,
          onHide: de,
          elementId: O,
          elementType: x,
          setHelperHeight: N,
          onTryToShow: pe,
          onError: me
        }), v.createElement(h.default, {
          onAnswerReply: L,
          onLoad: n,
          onShow: function() {
            ue()
          },
          getText: t,
          setText: r,
          setHelperHeight: N,
          shouldCheckGrammar: M,
          ref: te
        }))
      }))
    },
    174246: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => j
      });
      var r = n(827378),
        a = n.n(r),
        i = n(629133),
        o = n.n(i),
        u = n(292554),
        s = n.n(u),
        c = n(267651),
        l = n.n(c),
        f = n(161320),
        d = n.n(f),
        p = n(672034),
        m = n(445368),
        h = n(859200),
        y = n(500034),
        v = n(960190),
        b = n(292562),
        E = n(321561),
        w = n(117464),
        g = n(195601),
        A = n(587776),
        T = n(436132),
        S = n(874559),
        R = n(805556),
        k = n(719929),
        _ = n(336015);

      function C(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function I(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function x(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              I(i, r, a, o, u, "next", e)
            }

            function u(e) {
              I(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function O(e, t) {
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
            if ("string" == typeof e) return C(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? C(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function N(e, t) {
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
      var P = s().bind(_.default),
        L = {
          answer: "",
          answerId: null,
          usedReferences: []
        },
        U = ["isAiUserOnboardingCompleted", "isAiAccountOnboardingCompleted"],
        D = "startAnswerTimeMetric",
        M = "showAnswerTimeMetric",
        H = (0, y.isFeatureAvailable)("ai_rewriter_fast_reply"),
        q = (0, y.isFeatureAvailable)("is_customization_for_global"),
        F = (0, h.isAdmin)(),
        G = (0, r.forwardRef)((function(e, t) {
          var n = e.messageId,
            i = e.elementId,
            u = e.elementType,
            s = e.talkId,
            c = e.text,
            f = e.type,
            y = e.setHelperHeight,
            _ = e.setText,
            C = e.getText,
            I = e.onShow,
            G = e.onHide,
            j = e.onProcess,
            B = e.shouldSuggestionShow,
            W = e.onTryToShow,
            z = e.onError,
            Y = O((0, r.useState)(!1), 2),
            K = Y[0],
            Q = Y[1],
            $ = O((0, r.useState)(!1), 2),
            V = $[0],
            X = $[1],
            Z = O((0, r.useState)(!1), 2),
            J = Z[0],
            ee = Z[1],
            te = "",
            ne = (0, r.useRef)(L),
            re = (0, r.useRef)(L),
            ae = (0, r.useRef)([]),
            ie = (0, r.useRef)(null),
            oe = (0, r.useRef)(null),
            ue = (0, r.useRef)(!1),
            se = (0, r.useRef)({
              show: o().noop,
              hide: o().noop
            }),
            ce = (0, r.useRef)(f),
            le = function() {
              ne.current = L, re.current = L, ae.current = [], ue.current = !1
            };
          (0, r.useImperativeHandle)(t, (function() {
            return {
              openedAnswerElRef: ie,
              hiddenAnswerElRef: oe
            }
          }));
          var fe, de = function() {
              Q(!1), y(T.BASE_HELPER_HEIGHT)
            },
            pe = function() {
              Q(!0);
              var e = ne.current.answerId;
              e && !ue.current && (ue.current = !0, H || (0, v.markAnswer)({
                answerId: e,
                data: {
                  status: b.AnswerUsingStatuses.OPEN_ANSWER
                }
              }))
            },
            me = (0, E.default)({
              acceptText: F ? (0, m.i18n)("Go to settings (AI)") : (0, m.i18n)("Close"),
              declineText: (0, m.i18n)("Cancel"),
              title: (0, m.i18n)("Unable to find relevant source to respond"),
              description: [{
                text: F ? (0, m.i18n)("We couldn't find a relevant source to respond to this message. Please add a new source or update the existing ones to proceed.") : (0, m.i18n)("Please ask your admin to add a new source or update the existing ones.")
              }],
              onAccept: function() {
                F && APP.router.navigate("/settings/ai-knowledge-sources/".concat(T.SHOW_SOURCES_MODAL_URL_HASH), {
                  trigger: !0
                })
              },
              shouldPreventPageChange: !1,
              isNoCancel: !F
            }).openConfirmModal,
            he = (0, S.default)({
              type: ce.current,
              onSuccess: function(e) {
                var t = e.answer,
                  n = e.answerId,
                  r = e.usedReferences;
                ne.current = {
                  answer: t,
                  answerId: n,
                  usedReferences: r.slice(0, 2)
                }, W({
                  helperType: T.AiHelperType.ANSWER,
                  cb: se.current.show
                }), performance.measure(M, D);
                var a = d().duration(performance.getEntriesByName(M)[0].duration).asSeconds();
                (0, v.markAnswer)({
                  answerId: n,
                  data: {
                    status: b.AnswerUsingStatuses.SHOW_ANSWER,
                    showAnswerTime: a
                  }
                }), (H || ce.current === T.AnswerType.GENERATE || ce.current === T.AnswerType.GENERATE_BY_HELPER) && pe()
              },
              onError: (fe = x((function(e) {
                var t, n, r;
                return N(this, (function(a) {
                  switch (a.label) {
                    case 0:
                      if (t = e.answer_id, n = e.error_reason, ne.current = {
                          answer: "",
                          answerId: t,
                          usedReferences: []
                        }, j(!1), r = {
                          helperType: T.AiHelperType.ANSWER
                        }, ce.current === T.AnswerType.GENERATE) {
                        if (n === R.AnswerErrorReasons.EMPTY_ARTICLES) return me(), [2];
                        r.errorMessage = (0, m.i18n)("Unable to generate your response. Please try again.")
                      }
                      return [4, se.current.hide()];
                    case 1:
                      return a.sent(), z(r), [2]
                  }
                }))
              })), function(e) {
                return fe.apply(this, arguments)
              }),
              onMutate: function() {
                j(!0)
              }
            }),
            ye = he.postAnswer,
            ve = he.toggleRefetching,
            be = he.isLoading,
            Ee = function() {
              X(!0), y(T.BASE_HELPER_HEIGHT), I()
            },
            we = function() {
              var e = x((function() {
                return N(this, (function(e) {
                  switch (e.label) {
                    case 0:
                      return X(!1), Q(!1), y(T.BASE_HELPER_HEIGHT), ve(!1), V ? [4, G(T.AiHelperType.ANSWER)] : [3, 2];
                    case 1:
                      e.sent(), ce.current === T.AnswerType.GENERATE && (ce.current = (0, w.getUpdatedAnswerType)(T.AnswerType.DEFAULT)), e.label = 2;
                    case 2:
                      return [2]
                  }
                }))
              }));
              return function() {
                return e.apply(this, arguments)
              }
            }();
          se.current = {
            show: Ee,
            hide: we
          };
          var ge = function(e, t) {
              if (t) {
                var n = t.event,
                  r = t.talkId;
                switch (n) {
                  case R.AiAnswerCloseEvents.CLOSE:
                  case R.AiAnswerCloseEvents.READ:
                    r !== s || H || we();
                    break;
                  case R.AiAnswerCloseEvents.SOCKET_EXTERNAL:
                    break;
                  default:
                    we()
                }
              }
            },
            Ae = function() {
              var e, t = C(),
                n = ne.current.answerId,
                r = re.current,
                a = r.answer,
                i = r.answerId;
              switch (!0) {
                case a && t === a:
                  e = {
                    status: b.AnswerUsingStatuses.SEND_ANSWER
                  };
                  break;
                case a && t !== a:
                  e = {
                    status: b.AnswerUsingStatuses.EDIT_ANSWER,
                    userText: t
                  };
                  break;
                case Boolean(n):
                  e = {
                    status: b.AnswerUsingStatuses.SKIP_ANSWER,
                    userText: t
                  }
              }
              var o = i || n;
              ae.current.length && (e.checkedReferences = ae.current), e && o && ((0, v.markAnswer)({
                answerId: o,
                data: e
              }), a && le())
            };
          (0, r.useEffect)((function() {
            var e = l().subscribe(T.FEED_COMPOSE_SUBMIT, Ae),
              t = l().subscribe(T.AI_ANSWER_CLOSE, ge);
            return function() {
              l().unsubscribe(t), l().unsubscribe(e), performance.clearMeasures(M), performance.clearMarks(D)
            }
          }), []);
          var Te = function() {
            var e = x((function() {
              var e, t, n, r;
              return N(this, (function(a) {
                switch (a.label) {
                  case 0:
                    return a.trys.push([0, 2, , 3]), [4, (0, p.getFeaturesByQuery)({
                      queries: U,
                      shouldCamelCase: !0
                    })];
                  case 1:
                    return e = a.sent().features, t = e.isAiUserOnboardingCompleted, n = e.isAiAccountOnboardingCompleted, t || n || !(0, h.isAdmin)() || (ee(!0), W({
                      helperType: T.AiHelperType.ANSWER,
                      cb: Ee
                    })), [3, 3];
                  case 2:
                    return r = a.sent(), console.error(r), [3, 3];
                  case 3:
                    return [2]
                }
              }))
            }));
            return function() {
              return e.apply(this, arguments)
            }
          }();
          (0, r.useEffect)((function() {
            if (ce.current === T.AnswerType.DEFAULT) switch (!0) {
              case q && B:
                Te();
                break;
              case !q && B:
                break;
              default:
                performance.mark(D), ye({
                  lastMessageId: n,
                  talkId: s,
                  entityId: i,
                  entityType: u
                })
            }
            ce.current !== T.AnswerType.GENERATE_BY_HELPER || ne.current.answer || W({
              helperType: T.AiHelperType.ANSWER,
              cb: Ee
            })
          }), [n]), (0, r.useEffect)((function() {
            f === T.AnswerType.GENERATE && c && (performance.mark(D), ye({
              text: c,
              talkId: s,
              entityId: i,
              entityType: u
            })), f === T.AnswerType.GENERATE_BY_HELPER && (performance.mark(D), W({
              helperType: T.AiHelperType.ANSWER,
              cb: Ee
            }))
          }), [f]), (0, r.useEffect)((function() {
            K && ie.current && y("".concat(T.MAX_OPENED_ANSWER_HEIGHT + T.BASE_BOTTOM_HELPERS_OFFSET, "px"))
          }), [K]);
          var Se = function() {
              var e = x((function(e) {
                return N(this, (function(t) {
                  switch (t.label) {
                    case 0:
                      return _({
                        text: e,
                        isAnswer: !0
                      }), re.current = ne.current, ne.current = L, [4, we()];
                    case 1:
                      return t.sent(), ae.current = [], ue.current = !1, [2]
                  }
                }))
              }));
              return function(t) {
                return e.apply(this, arguments)
              }
            }(),
            Re = function() {
              var e = x((function() {
                var e;
                return N(this, (function(t) {
                  switch (t.label) {
                    case 0:
                      return J && (0, v.setAnswerOnboarding)(), (e = ne.current.answerId) && (0, v.markAnswer)({
                        answerId: e,
                        data: {
                          status: b.AnswerUsingStatuses.CLOSE_ANSWER
                        }
                      }), [4, we()];
                    case 1:
                      return t.sent(), le(), [2]
                  }
                }))
              }));
              return function() {
                return e.apply(this, arguments)
              }
            }();
          switch ((0, r.useEffect)((function() {
              be ? W({
                helperType: T.AiHelperType.ANSWER,
                cb: Ee,
                isLoading: be
              }) : ne.current.answer || ce.current === T.AnswerType.GENERATE_BY_HELPER || we()
            }), [be]), !0) {
            case B && q:
              te = (0, m.i18n)("Reply faster by training the AI assistant using data from your information sources");
              break;
            case be && !ne.current.answer:
              te = a().createElement(g.default, null);
              break;
            case ce.current === T.AnswerType.GENERATE_BY_HELPER && !ne.current.answer:
              te = (0, m.i18n)("Generate response");
              break;
            default:
              te = ne.current.answer
          }
          return K ? a().createElement(k.default, {
            isOpen: K,
            answerRef: ne,
            ref: ie,
            onLinkMouseDown: function(e) {
              if (!o().contains(ae.current, e)) {
                var t = ne.current.answerId;
                ae.current.push(e), (0, v.markAnswer)({
                  answerId: t,
                  data: {
                    status: b.AnswerUsingStatuses.SHOW_ANSWER,
                    checkedReferences: ae.current
                  }
                })
              }
            },
            onApplyClick: Se,
            onCloseClick: function(e) {
              e.stopPropagation(), de()
            },
            onOutsideClick: function() {
              H || de()
            }
          }) : a().createElement(A.default, {
            ref: oe,
            className: P("button", {
              active: V,
              disable: be
            }),
            onClick: function(e) {
              if (e.stopPropagation(), ce.current === T.AnswerType.GENERATE_BY_HELPER) ye({
                lastMessageId: n,
                talkId: s,
                entityId: i,
                entityType: u
              });
              else {
                if (J) return (0, v.setAnswerOnboarding)(), APP.router.navigate("/settings/ai/", {
                  trigger: !0
                }), void we();
                pe()
              }
            },
            isClosable: !0,
            onCloseClick: Re
          }, a().createElement("div", {
            className: P("preview", {
              loading: be
            })
          }, te))
        }));
      G.displayName = "AiAnswer";
      const j = G
    },
    719929: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => A
      });
      var r = n(827378),
        a = n.n(r),
        i = n(629133),
        o = n.n(i),
        u = n(292554),
        s = n.n(u),
        c = n(916569),
        l = n(352467),
        f = n(529062),
        d = n(724329),
        p = n(500034),
        m = n(445368),
        h = n(436132),
        y = n(706898),
        v = n(740098),
        b = n(687083),
        E = (0, p.isFeatureAvailable)("ai_rewriter_fast_reply"),
        w = s().bind(b.default),
        g = (0, r.forwardRef)((function(e, t) {
          var n = e.isOpen,
            i = e.answerRef,
            u = e.onApplyClick,
            s = e.onLinkMouseDown,
            p = e.onCloseClick,
            b = e.onOutsideClick,
            g = (0, r.useRef)(null),
            A = (0, r.useRef)([]),
            T = (0, r.useRef)(null),
            S = (0, r.useRef)(null);
          return (0, r.useLayoutEffect)((function() {
            if (n && A.current.length > 1) {
              var e, t = null === (e = g.current) || void 0 === e ? void 0 : e.offsetWidth,
                r = A.current[0];
              t && r && r.offsetWidth > t / 2 && (r.style.maxWidth = "50%")
            }
          }), [n]), (0, r.useLayoutEffect)((function() {
            if (n) {
              var e = T.current,
                t = S.current;
              e && t && (e.style.width = "calc(100% - ".concat(t.offsetWidth + 24, "px)"))
            }
          }), [n]), (0, r.useLayoutEffect)((function() {
            var e = t.current;
            if (n && e && T.current) {
              var r = T.current,
                a = new ResizeObserver((function(e) {
                  e.forEach((function(e) {
                    r.style.display = e.contentRect.width < 350 ? "none" : "flex"
                  }))
                }));
              return a.observe(e),
                function() {
                  e && a.unobserve(e)
                }
            }
          }), [n]), (0, d.useOnOutsideClick)({
            ref: t,
            handler: b
          }), a().createElement("div", {
            className: w("answer"),
            ref: t,
            onClick: function(e) {
              var t, n = e.target;
              n === S.current || (null === (t = S.current) || void 0 === t ? void 0 : t.contains(n)) || e.stopPropagation()
            }
          }, a().createElement("div", {
            className: w("header")
          }, a().createElement(y.default, {
            className: w("icon")
          }), a().createElement("p", {
            className: w("heading")
          }, (0, m.i18n)("Suggested reply"))), a().createElement("div", {
            className: w("main")
          }, a().createElement("div", {
            className: w("text", {
              "customersus-text": E
            })
          }, a().createElement("div", {
            dangerouslySetInnerHTML: {
              __html: i.current.answer.replace(/\n/g, "<br />")
            }
          })), a().createElement("div", {
            className: w("buttons")
          }, a().createElement(f.Button, {
            theme: f.ButtonNeutralTheme,
            onClick: function() {
              var e = i.current.answer;
              PubSub.publish(h.AI_COMPOSE_ANSWER_PASTED, e), u(e)
            },
            ref: S
          }, (0, m.i18n)("Add as a draft")), i.current.usedReferences.length > 0 && a().createElement("div", {
            className: w("resources"),
            ref: T
          }, a().createElement(c.Text, {
            theme: c.TextSecondaryLightTheme,
            className: w("links-text"),
            size: "m"
          }, (0, m.i18n)("Based on:"), " "), a().createElement("div", {
            className: w("links"),
            ref: g
          }, o().map(i.current.usedReferences, (function(e, t) {
            return a().createElement(r.Fragment, {
              key: t
            }, a().createElement(l.Link, {
              theme: l.LinkPrimaryTheme,
              className: w("link"),
              href: e,
              target: "_blank",
              rel: "noreferrer",
              onMouseDown: function() {
                s(e)
              },
              ref: function(e) {
                A.current[t] = e
              },
              title: e
            }, e), i.current.usedReferences.length > 1 && t < i.current.usedReferences.length - 1 && a().createElement(a().Fragment, null, ", "))
          })))))), a().createElement("div", {
            onClick: p,
            className: w("close")
          }, a().createElement(v.default, null)))
        }));
      g.displayName = "Content";
      const A = g
    },
    874559: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => p
      });
      var r = n(456552),
        a = n(827378),
        i = n(292562),
        o = n(960190),
        u = n(604874),
        s = n(746716),
        c = n(942407),
        l = n(436132);

      function f(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
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
            if ("string" == typeof e) return f(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? f(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }
      const p = function(e) {
        var t = e.type,
          n = void 0 === t ? l.AnswerType.DEFAULT : t,
          f = e.onSuccess,
          p = e.onError,
          m = e.onMutate,
          h = d((0, a.useState)(null), 2),
          y = h[0],
          v = h[1],
          b = d((0, a.useState)(!1), 2),
          E = b[0],
          w = b[1],
          g = d((0, a.useState)(!1), 2),
          A = g[0],
          T = g[1],
          S = (0, c.default)(),
          R = S.requestCount,
          k = S.incrementRequestCount,
          _ = S.clearRequestCount,
          C = function(e) {
            var t = e.detail,
              n = e.code;
            p(e), v({
              detail: t,
              code: n
            })
          },
          I = function(e) {
            f(e), v(null), T(!1)
          },
          x = (0, r.useMutation)({
            mutationFn: function(e) {
              switch (m(), n) {
                case l.AnswerType.GENERATE:
                  return (0, s.postGenerateAnswerRequest)(e);
                case l.AnswerType.DEFAULT:
                default:
                  return (0, o.postAnswerRequest)(e)
              }
            },
            onSuccess: function(e) {
              var t = e.answer,
                r = e.status,
                a = e.answerId,
                o = e.usedReferences;
              r !== i.RewriteStatusRequest.LOADING && n !== l.AnswerType.GENERATE || T(!0), t && r === i.RewriteStatusRequest.SUCCESS && a ? I({
                answer: t,
                answerId: a,
                usedReferences: o
              }) : w(!0)
            },
            onError: C,
            onMutate: function() {
              n === l.AnswerType.GENERATE_BY_HELPER && T(!0)
            }
          }),
          O = x.mutate,
          N = x.data,
          P = x.isLoading;
        return (0, r.useQuery)({
          queryKey: ["answer", null == N ? void 0 : N.jobUuid],
          queryFn: function() {
            return (0, o.getRewriterRequest)({
              jobUuid: null == N ? void 0 : N.jobUuid,
              maxRequestCount: 20,
              url: u.ANSWER_URL,
              incrementRequestCount: k,
              clearRequestCount: _,
              requestCount: R.current
            })
          },
          enabled: E,
          refetchInterval: l.REFETCH_ANSWER_INTERVAL,
          onSuccess: function(e) {
            var t = e.answer,
              r = e.status,
              a = e.answerId,
              o = e.usedReferences;
            r !== i.RewriteStatusRequest.LOADING && n !== l.AnswerType.GENERATE && n !== l.AnswerType.GENERATE_BY_HELPER || T(!0), t && r === i.RewriteStatusRequest.SUCCESS && a && (I({
              answer: t,
              answerId: a,
              usedReferences: o
            }), w(!1))
          },
          onError: function(e) {
            w(!1), T(!1), C(e)
          }
        }), {
          error: y,
          toggleRefetching: function(e) {
            w(e)
          },
          isLoading: A || (n === l.AnswerType.GENERATE || n === l.AnswerType.GENERATE_BY_HELPER) && P,
          postAnswer: O
        }
      }
    },
    805556: (e, t, n) => {
      var r, a;
      n.r(t), n.d(t, {
          AiAnswerCloseEvents: () => r,
          AnswerErrorReasons: () => a
        }),
        function(e) {
          e.CLOSE = "close", e.READ = "read", e.USER_CHANGE = "user_change", e.SOCKET_EXTERNAL = "socket-external", e.SOCKET_INCOMING = "socket-incoming"
        }(r || (r = {})),
        function(e) {
          e.EMPTY_ARTICLES = "Articles or answers not found"
        }(a || (a = {}))
    },
    355582: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => T
      });
      var r = n(827378),
        a = n(629133),
        i = n.n(a),
        o = n(267651),
        u = n.n(o),
        s = n(292554),
        c = n.n(s),
        l = n(500034),
        f = n(292562),
        d = n(960190),
        p = n(438089),
        m = n(587776),
        h = n(99854),
        y = n(399206),
        v = n(436132),
        b = n(233678),
        E = n(728822),
        w = n(827378),
        g = c().bind(E.default),
        A = (0, r.forwardRef)((function(e, t) {
          var n = e.getText,
            a = e.onLoad,
            o = e.setText,
            s = e.setHelperHeight,
            c = e.onShow,
            E = e.shouldCheckGrammar,
            A = void 0 === E || E,
            T = (0, r.useRef)(null),
            S = (0, b.default)({
              shouldCheckGrammar: A
            }),
            R = S.suggestion,
            k = S.isShow,
            _ = S.hide,
            C = S.checker,
            I = S.clear;
          (0, r.useEffect)((function() {
            k && (s(v.BASE_HELPER_HEIGHT, !1), c())
          }), [k]);
          var x = (0, r.useRef)(null),
            O = (0, r.useRef)(""),
            N = (0, r.useRef)(""),
            P = function(e, t) {
              var n = t ? t.trim() : "";
              if (!t || N.current.trim() === n || (0, l.isFeatureAvailable)("ai_limited")) return I(), void _();
              O.current.trim() !== n && (C(t), N.current = "", O.current = "")
            },
            L = function() {
              _()
            },
            U = function(e, t) {
              var n = t.answer;
              O.current = n
            },
            D = function() {
              var e, t = n();
              (null === (e = x.current) || void 0 === e ? void 0 : e.answerId) && (0, d.markRewriter)({
                currentText: t,
                rewriterAnswer: x.current
              })
            },
            M = function(e, t) {
              N.current = t
            };
          (0, r.useEffect)((function() {
            var e = n(),
              t = u().subscribe(v.FEED_COMPOSE_INPUT_CHANGE, P),
              r = u().subscribe(v.AI_REWRITER_USE_START, L),
              a = u().subscribe(v.AI_REWRITER_USE_END, U),
              i = u().subscribe(v.FEED_COMPOSE_SUBMIT, D),
              o = u().subscribe(v.AI_COMPOSE_ANSWER_PASTED, M);
            return e ? C(e) : _(),
              function() {
                u().unsubscribe(t), u().unsubscribe(i), u().unsubscribe(r), u().unsubscribe(a), u().unsubscribe(o)
              }
          }), []);
          var H = (0, y.default)({
              onMutate: function() {
                a(!0)
              },
              onError: function() {
                a(!1), I()
              },
              onSuccess: function(e) {
                var t = e.answer,
                  r = n();
                x.current = e, O.current = t, a(!1), o({
                  text: t
                }), I(), u().publish(v.AI_REWRITER_USAGE, {
                  data: e,
                  originalText: r
                })
              }
            }),
            q = H.postRewriterAnswer,
            F = H.error,
            G = (0, p.default)(h.default, {
              onCloseRequest: function() {
                return !0
              },
              error: F
            }),
            j = G.modalElement,
            B = G.showModal;
          return (0, r.useEffect)((function() {
            F && B(), (null == F ? void 0 : F.code) === f.RewriterErrorCodes.PAYMENT_REQUIRED ? (0, l.updateFeature)("ai_limited", !0) : (0, l.updateFeature)("ai_limited", !1)
          }), [F]), w.createElement(w.Fragment, null, F && j, w.createElement(m.default, {
            ref: function(e) {
              T.current = e, i().isFunction(t) ? t(e) : t && (t.current = e)
            },
            onClick: function() {
              var e = n();
              R.optionId && (_(), q({
                text: e,
                id: R.optionId
              }))
            },
            className: g({
              active: k && n(),
              button: !0
            })
          }, R.text))
        }));
      A.displayName = "AiSuggestion";
      const T = A
    },
    233678: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => w
      });
      var r = n(827378),
        a = n(629133),
        i = n.n(a),
        o = n(445368),
        u = n(500034),
        s = n(915177),
        c = n(960190),
        l = n(439590),
        f = n(915634);

      function d(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function p(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function m(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(r, a) {
            var i = e.apply(t, n);

            function o(e) {
              p(i, r, a, o, u, "next", e)
            }

            function u(e) {
              p(i, r, a, o, u, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function h(e, t) {
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
            if ("string" == typeof e) return d(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? d(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function y(e, t) {
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
      var v = APP.lang_id,
        b = [s.LANGUAGE_CODE.ID],
        E = /[^\w\s\u0400-\u04FF_]| $/;
      const w = function(e) {
        var t, n = e.shouldCheckGrammar,
          a = h((0, r.useState)(!1), 2),
          s = a[0],
          d = a[1],
          p = h((0, r.useState)({
            optionId: null,
            text: ""
          }), 2),
          w = p[0],
          g = p[1],
          A = (0, r.useRef)({
            shorter: !1,
            tone: !1,
            profanity: !1,
            grammar: !1
          }),
          T = function(e) {
            return i().chain(A.current).omit(e).values().some().value()
          },
          S = function() {
            d(!1)
          },
          R = function(e) {
            g(e), d(!0)
          },
          k = function() {
            A.current = {
              shorter: !1,
              tone: !1,
              profanity: !1,
              grammar: !1
            }, S()
          },
          _ = (t = m((function(e) {
            var t, n, r, a, i;
            return y(this, (function(o) {
              switch (o.label) {
                case 0:
                  if (t = e.type, n = e.request, r = e.text, a = e.suggestionOptions, T(t)) return [2];
                  o.label = 1;
                case 1:
                  return o.trys.push([1, 3, , 4]), [4, n(r)];
                case 2:
                  return i = o.sent(), T(t) ? [2] : (A.current[t] = Boolean(i), i ? R(a) : d(!1), [3, 4]);
                case 3:
                  return o.sent(), A.current[t] = !1, T(t) ? [2] : (d(!1), [3, 4]);
                case 4:
                  return [2]
              }
            }))
          })), function(e) {
            return t.apply(this, arguments)
          }),
          C = function() {
            var e = m((function(e) {
              return y(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return [4, _({
                      type: f.SuggestionType.PPOFANITY,
                      text: e,
                      request: c.profanity,
                      suggestionOptions: {
                        text: (0, o.i18n)("Make it professional"),
                        optionId: l.OptionsRewriter.FORMAL
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
          I = function() {
            var e = m((function(e) {
              return y(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return [4, _({
                      type: f.SuggestionType.GRAMMAR,
                      text: e,
                      request: c.grammar,
                      suggestionOptions: {
                        text: (0, o.i18n)("Correct grammar & spelling"),
                        optionId: l.OptionsRewriter.GRAMMAR
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
          x = function() {
            var e = m((function(e) {
              return y(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return e.length >= 1800 ? [2] : [4, _({
                      type: f.SuggestionType.TONE,
                      text: e,
                      request: c.tone,
                      suggestionOptions: {
                        text: (0, o.i18n)("Make it friendly"),
                        optionId: l.OptionsRewriter.FRIENDLY
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
          O = i().debounce((function(e) {
            var t = e.length;
            if (!(t < 15)) {
              var r = e[t - 1];
              E.test(r) && (C(e), !b.includes(v) && n && I(e), (0, u.isFeatureAvailable)(u.Features.IS_CUSTOMIZATION_FOR_GLOBAL) && x(e))
            }
          }), 2e3);
        return {
          suggestion: w,
          isShow: s,
          hide: S,
          checker: function(e) {
            var t;
            e.length >= 1e4 ? k() : (t = e, T(f.SuggestionType.SHORTER) || (t.length >= 2500 ? (A.current[f.SuggestionType.SHORTER] = !0, R({
              optionId: l.OptionsRewriter.SHORTER,
              text: (0, o.i18n)("Make it shorter")
            })) : (A.current[f.SuggestionType.SHORTER] = !1, d(!1))), O(e))
          },
          clear: k
        }
      }
    },
    915634: (e, t, n) => {
      var r;
      n.r(t), n.d(t, {
          SuggestionType: () => r
        }),
        function(e) {
          e.SHORTER = "shorter", e.TONE = "tone", e.PPOFANITY = "profanity", e.GRAMMAR = "grammar"
        }(r || (r = {}))
    },
    30893: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => _
      });
      var r = n(629133),
        a = n.n(r),
        i = n(827378),
        o = n.n(i),
        u = n(292554),
        s = n.n(u),
        c = n(267651),
        l = n.n(c),
        f = n(445368),
        d = n(769734),
        p = n(292562),
        m = n(195601),
        h = n(436132),
        y = n(587776),
        v = n(805556),
        b = n(378902),
        E = n(604789),
        w = n(661533);

      function g(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function A(e, t, n, r, a, i, o) {
        try {
          var u = e[i](o),
            s = u.value
        } catch (e) {
          return void n(e)
        }
        u.done ? t(s) : Promise.resolve(s).then(r, a)
      }

      function T(e, t) {
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
            if ("string" == typeof e) return g(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? g(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }
      var S = s().bind(E.default),
        R = {
          taskId: null,
          taskText: "",
          taskType: null,
          taskDeadline: null
        },
        k = (0, i.forwardRef)((function(e, t) {
          var n, r, u = e.messageId,
            s = e.talkId,
            c = e.elementId,
            E = e.elementType,
            g = e.setHelperHeight,
            k = e.onTryToShow,
            _ = e.onHide,
            C = e.onError,
            I = T((0, i.useState)(!1), 2),
            x = I[0],
            O = I[1],
            N = (0, i.useRef)(R),
            P = (0, i.useRef)({
              show: a().noop,
              hide: a().noop
            }),
            L = (0, b.default)({
              onSuccess: function(e) {
                var t = e.taskId,
                  n = e.taskText,
                  r = e.taskType,
                  i = e.taskDeadline;
                N.current = {
                  taskId: t,
                  taskText: n,
                  taskType: a().contains([p.TaskTypes.FOLLOW_UP, p.TaskTypes.MEET], r) ? r : p.TaskTypes.FOLLOW_UP,
                  taskDeadline: i
                }, k({
                  helperType: h.AiHelperType.TASK,
                  cb: P.current.show,
                  isLoading: D
                })
              },
              onError: function() {
                N.current = R, x && P.current.hide(), C({
                  helperType: h.AiHelperType.TASK
                })
              }
            }),
            U = L.postTask,
            D = L.isLoading,
            M = L.toggleRefetching,
            H = (n = function() {
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
                    return M(!1), O(!1), [4, _(h.AiHelperType.TASK)];
                  case 1:
                    return e.sent(), x && g(h.NULL_HELPER_HEIGHT), [2]
                }
              }))
            }, r = function() {
              var e = this,
                t = arguments;
              return new Promise((function(r, a) {
                var i = n.apply(e, t);

                function o(e) {
                  A(i, r, a, o, u, "next", e)
                }

                function u(e) {
                  A(i, r, a, o, u, "throw", e)
                }
                o(void 0)
              }))
            }, function() {
              return r.apply(this, arguments)
            });
          P.current = {
            show: function() {
              g(h.BASE_HELPER_HEIGHT), O(!0)
            },
            hide: H
          };
          var q = function(e, t) {
            if (t) {
              var n = t.event,
                r = t.talkId;
              switch (n) {
                case v.AiAnswerCloseEvents.CLOSE:
                case v.AiAnswerCloseEvents.READ:
                  r === s && H();
                  break;
                case v.AiAnswerCloseEvents.SOCKET_EXTERNAL:
                  break;
                default:
                  H()
              }
            }
          };
          (0, i.useEffect)((function() {
            U({
              messageId: u,
              talkId: s,
              elementId: c,
              elementType: E
            })
          }), [u]), (0, i.useEffect)((function() {
            D && k({
              helperType: h.AiHelperType.TASK,
              cb: P.current.show,
              isLoading: D
            })
          }), [D]), (0, i.useEffect)((function() {
            var e = l().subscribe(h.AI_ANSWER_CLOSE, q);
            return function() {
              l().unsubscribe(e)
            }
          }), []);
          var F = "";
          if (!0 === D) F = o().createElement(m.default, null);
          else {
            var G = N.current,
              j = G.taskDeadline,
              B = G.taskText;
            F = "".concat((0, f.i18n)("Add task"), " ").concat(j ? (0, f.i18n)("for (time)") + " " + (0, d.getDateByTimestamp)({
              timestamp: j
            }) : "", " ").concat(B ? " — " + B : "")
          }
          return o().createElement(y.default, {
            ref: t,
            className: "".concat(S("button", {
              active: x,
              disable: D
            }), " js-ai-task"),
            onClick: function() {
              var e = N.current,
                t = e.taskId,
                n = e.taskDeadline,
                r = e.taskType,
                a = e.taskText;
              P.current.hide();
              var i = T(n ? (0, d.getDateByTimestamp)({
                  timestamp: n
                }).split(" ") : [null, null], 2),
                o = i[0],
                u = i[1];
              w(document).trigger("notes:compose:switch", ["task", {
                date: o,
                time: u,
                type: r,
                body: a,
                generalOptions: {
                  isFromAiHelpers: !0,
                  taskId: t,
                  shouldPreventAiHelpers: !0
                }
              }])
            },
            isClosable: !0,
            onCloseClick: function() {
              H()
            }
          }, o().createElement("div", {
            className: S("preview", {
              loading: D
            })
          }, F))
        }));
      k.displayName = "AiTask";
      const _ = k
    },
    378902: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => h
      });
      var r = n(629133),
        a = n.n(r),
        i = n(456552),
        o = n(827378),
        u = n(292562),
        s = n(604874),
        c = n(58256),
        l = n(555424),
        f = n(942407),
        d = n(436132);

      function p(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function m(e, t) {
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
            if ("string" == typeof e) return p(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? p(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }
      const h = function(e) {
        var t = e.onSuccess,
          n = void 0 === t ? a().noop : t,
          r = e.onError,
          p = void 0 === r ? a().noop : r,
          h = e.onMutate,
          y = void 0 === h ? a().noop : h,
          v = m((0, o.useState)(null), 2),
          b = v[0],
          E = v[1],
          w = m((0, o.useState)(!1), 2),
          g = w[0],
          A = w[1],
          T = m((0, o.useState)(!1), 2),
          S = T[0],
          R = T[1],
          k = (0, f.default)(),
          _ = k.requestCount,
          C = k.incrementRequestCount,
          I = k.clearRequestCount,
          x = function(e) {
            var t = e.detail,
              n = e.code;
            p(e), E({
              detail: t,
              code: n
            })
          },
          O = function(e) {
            n(e), E(null), R(!1)
          },
          N = (0, i.useMutation)({
            mutationFn: function(e) {
              return y(), (0, c.default)(e)
            },
            onSuccess: function(e) {
              var t = e.taskId,
                n = e.taskText,
                r = e.taskType,
                a = e.taskDeadline,
                i = e.status;
              i === u.RewriteStatusRequest.LOADING && R(!0), i !== u.RewriteStatusRequest.SUCCESS ? A(!0) : O({
                taskId: t,
                taskType: r,
                taskText: n,
                taskDeadline: a
              })
            },
            onError: x
          }),
          P = N.mutate,
          L = N.data;
        return (0, i.useQuery)({
          queryKey: ["task", null == L ? void 0 : L.jobUuid],
          queryFn: function() {
            return (0, l.getTaskRequest)({
              jobUuid: null == L ? void 0 : L.jobUuid,
              maxRequestCount: 10,
              url: s.TASK_URL,
              incrementRequestCount: C,
              clearRequestCount: I,
              requestCount: _.current
            })
          },
          enabled: g && Boolean(L),
          refetchInterval: d.REFETCH_ANSWER_INTERVAL,
          onSuccess: function(e) {
            var t = e.taskId,
              n = e.taskText,
              r = e.taskType,
              a = e.taskDeadline,
              i = e.status;
            i === u.RewriteStatusRequest.LOADING && R(!0), i === u.RewriteStatusRequest.SUCCESS && n && (O({
              taskId: t,
              taskType: r,
              taskText: n,
              taskDeadline: a
            }), A(!1))
          },
          onError: function(e) {
            A(!1), R(!1), x(e)
          }
        }), {
          error: b,
          toggleRefetching: function(e) {
            A(e)
          },
          isLoading: S,
          postTask: P
        }
      }
    },
    4190: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => N
      });
      var r = n(827378),
        a = n(292554),
        i = n.n(a),
        o = n(267651),
        u = n.n(o),
        s = n(629133),
        c = n.n(s),
        l = n(491967),
        f = n(241811),
        d = n(445368),
        p = n(500034),
        m = n(317954),
        h = n(614759),
        y = n(960190),
        v = n(292562),
        b = n(438089),
        E = n(387725),
        w = n(99854),
        g = n(436132),
        A = n(399206),
        T = n(238332),
        S = n(830221),
        R = n(967482),
        k = n(758918),
        _ = n(827378);

      function C(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
        return r
      }

      function I(e, t) {
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
            if ("string" == typeof e) return C(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? C(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }
      var x = i().bind(k.default),
        O = (0, p.isFeatureAvailable)(p.Features.IS_CUSTOMIZATION_FOR_GLOBAL);
      const N = (0, h.withQueryProvider)((function(e) {
        var t = e.offset,
          n = t.right,
          a = t.bottom,
          i = e.getText,
          o = e.setText,
          s = e.onLoad,
          h = (0, r.useRef)(null),
          k = (0, r.useRef)(null),
          C = (0, r.useRef)(null),
          N = I((0, r.useState)(null), 2),
          P = N[0],
          L = N[1],
          U = I((0, r.useState)(!1), 2),
          D = U[0],
          M = U[1],
          H = I((0, r.useState)(!0), 2),
          q = H[0],
          F = H[1],
          G = I((0, r.useState)(0), 2),
          j = G[0],
          B = G[1],
          W = (0, r.useRef)([]),
          z = (0, A.default)({
            onSuccess: function(e) {
              var t = i(),
                n = e.answer;
              c().first(W.current) !== t && W.current.unshift(t), s(!1), k.current = e, u().publish(g.AI_REWRITER_USE_END, {
                answer: n
              }), o(n)
            },
            onError: function(e) {
              var t = e.isInternalError;
              s(!1), t && (M(!0), W.current.length && B((function(e) {
                return ++e
              })))
            },
            onMutate: function() {
              s(!0)
            }
          }),
          Y = z.postRewriterAnswer,
          K = z.error,
          Q = z.hideError,
          $ = function(e) {
            var t, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            n.length > 3e3 ? F(!1) : F(!0), Q(), C.current && C.current !== n && (null === (t = k.current) || void 0 === t ? void 0 : t.answer) !== n && (W.current = [], C.current = null), M(!1)
          },
          V = function(e, t) {
            var n = t.data,
              r = t.originalText;
            W.current.unshift(r), k.current = n
          },
          X = function() {
            var e;
            if (null === (e = k.current) || void 0 === e ? void 0 : e.answerId) {
              var t = i();
              (0, y.markRewriter)({
                currentText: t,
                rewriterAnswer: k.current
              })
            }
          },
          Z = (0, b.default)(w.default, {
            onCloseRequest: function() {
              return Q(), !0
            },
            error: K
          }),
          J = Z.modalElement,
          ee = Z.showModal;
        (0, r.useEffect)((function() {
          var e = u().subscribe(g.FEED_COMPOSE_INPUT_CHANGE, $),
            t = u().subscribe(g.FEED_COMPOSE_SUBMIT, X),
            n = u().subscribe(g.AI_REWRITER_USAGE, V);
          return function() {
            u().unsubscribe(e), u().unsubscribe(t), u().unsubscribe(n)
          }
        }), []), (0, r.useEffect)((function() {
          K && (K.code === v.RewriterErrorCodes.PAYMENT_REQUIRED ? (ee(), (0, p.updateFeature)("ai_limited", !0)) : (0, p.updateFeature)("ai_limited", !1))
        }), [K]);
        var te = function() {
          var e = W.current.shift() || "";
          B((function(e) {
            return --e
          })), C.current = e, u().publish(g.AI_COMPOSE_ANSWER_PASTED, e), o(e), M(!1)
        };
        return _.createElement("div", {
          onMouseEnter: function() {
            M(!0), h.current && clearTimeout(h.current)
          },
          onMouseLeave: function() {
            h.current = setTimeout((function() {
              M(!1)
            }), 250)
          },
          className: x("control", {
            active: D
          })
        }, _.createElement(E.default, {
          dataSrc: R.default
        }), J, _.createElement(l.default, {
          type: "svg",
          className: x("sticker"),
          name: "ai_rewrite--ai"
        }), _.createElement("div", {
          className: x("wrapper", {
            opened: D
          }),
          style: {
            bottom: a,
            right: n
          },
          onMouseEnter: function() {
            M(!0), h.current && clearTimeout(h.current)
          }
        }, K && K.code !== v.RewriterErrorCodes.PAYMENT_REQUIRED ? _.createElement(S.default, {
          onUndoClick: te,
          onTryClick: function() {
            var e = i();
            P && (Y({
              text: e,
              id: P
            }), M(!1))
          },
          isUndoAvailable: Boolean(j),
          error: K
        }) : _.createElement(_.Fragment, null, _.createElement("div", {
          className: x("header")
        }, _.createElement("div", {
          className: x("brand")
        }, (0, d.i18n)("{{brand_name.ai}}")), O && _.createElement(m.MetaBadge, {
          title: (0, d.i18n)("Beta"),
          theme: "purple"
        })), _.createElement(T.default, {
          shouldLongerOptionsShow: q,
          onOptionClick: function(e) {
            if (1 != !(0, p.isFeatureAvailable)(p.Features.AIREWRITER)) {
              var t = i();
              L(e), Y({
                text: t,
                id: e
              }), u().publish(g.AI_REWRITER_USE_START, {}), M(!1)
            } else u().publish(f.default, !0)
          },
          isUndoOptionVisible: Boolean(W.current.length),
          onUndoOptionClick: te
        }))))
      }))
    },
    830221: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => y
      });
      var r = n(629133),
        a = n.n(r),
        i = n(827378),
        o = n.n(i),
        u = n(292554),
        s = n.n(u),
        c = n(352467),
        l = n(671837),
        f = n(445368),
        d = n(292562),
        p = n(275814),
        m = s().bind(p.default),
        h = [d.RewriterErrorCodes.PAYMENT_REQUIRED, d.RewriterErrorCodes.VALIDATION_ERROR];
      const y = function(e) {
        var t = e.onTryClick,
          n = e.error,
          r = e.onUndoClick,
          i = e.isUndoAvailable,
          u = n.detail,
          s = n.code,
          d = !a().include(h, s);
        return o().createElement("div", {
          className: m("wrapper")
        }, o().createElement("p", {
          className: m("text")
        }, u), d && o().createElement("p", null, o().createElement(l.default, {
          theme: c.LinkPrimaryTheme,
          className: "button",
          onClick: function() {
            t()
          }
        }, (0, f.i18n)("Try again"))), i && o().createElement(l.default, {
          theme: c.LinkPrimaryTheme,
          className: "button",
          onClick: r
        }, (0, f.i18n)("Undo changes")))
      }
    },
    238332: (e, t, n) => {
      n.r(t), n.d(t, {
        default: () => h
      });
      var r = n(827378),
        a = n.n(r),
        i = n(629133),
        o = n.n(i),
        u = n(292554),
        s = n.n(u),
        c = n(724329),
        l = n(491967),
        f = n(445368),
        d = n(439590),
        p = n(84290),
        m = s().bind(p.default);
      const h = function(e) {
        var t = e.onOptionClick,
          n = e.onUndoOptionClick,
          r = e.isUndoOptionVisible,
          i = e.shouldLongerOptionsShow,
          u = (0, c.useConst)((function() {
            return [{
              id: d.OptionsRewriter.GRAMMAR,
              option: (0, f.i18n)("Correct grammar & spelling"),
              icon: "grammar-check"
            }, {
              id: d.OptionsRewriter.FORMAL,
              option: (0, f.i18n)("Make it professional"),
              icon: "formal"
            }, {
              id: d.OptionsRewriter.FRIENDLY,
              option: (0, f.i18n)("Make it friendly"),
              icon: "friendly"
            }, {
              id: d.OptionsRewriter.HUMOROUS,
              option: (0, f.i18n)("Make it witty"),
              icon: "humorous"
            }, {
              id: d.OptionsRewriter.LONGER,
              option: (0, f.i18n)("Make it longer"),
              icon: "longer"
            }, {
              id: d.OptionsRewriter.SHORTER,
              option: (0, f.i18n)("Make it shorter"),
              icon: "shorter"
            }, {
              id: d.OptionsRewriter.SIMPLIFY,
              option: (0, f.i18n)("Make it simpler"),
              icon: "simplify"
            }]
          }));
        return a().createElement("div", {
          className: m("select")
        }, o().map(u, (function(e) {
          var n = e.icon,
            r = e.id,
            o = e.option;
          if (i || r !== d.OptionsRewriter.LONGER) return a().createElement("div", {
            className: m("option"),
            onClick: function() {
              t(r)
            },
            key: r
          }, a().createElement("div", {
            className: m("option-icon")
          }, a().createElement(l.default, {
            type: "svg",
            className: m("icon"),
            name: "ai_rewrite--".concat(n)
          })), a().createElement("div", null, o))
        })), r && a().createElement("div", {
          className: m("option", "option-revert"),
          onClick: function() {
            n()
          }
        }, a().createElement("div", {
          className: m("option-icon")
        }, a().createElement(l.default, {
          type: "svg",
          className: m("icon"),
          name: "ai_rewrite--back"
        })), a().createElement("div", null, (0, f.i18n)("Undo changes"))))
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "7446bf5e-c5e3-4d11-a50a-16431a6d93ba", e._sentryDebugIdIdentifier = "sentry-dbid-7446bf5e-c5e3-4d11-a50a-16431a6d93ba")
    } catch (e) {}
  }();
//# sourceMappingURL=90001.eab2fd6125e46df79269.js.map