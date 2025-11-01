"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [84330, 3218, 37634, 23456], {
    617859: (e, t, i) => {
      i.r(t), i.d(t, {
        Checkbox: () => l
      });
      var r = i(824246),
        n = i(827378),
        a = i(22538),
        o = i(55436),
        u = i(447323),
        c = i(439452),
        s = i(445857);
      i(512078);
      const l = (0, n.forwardRef)(((e, t) => {
        const {
          className: i = "",
          checkedStyle: n,
          isInvalid: c,
          theme: l,
          ...d
        } = e, p = (0, o.useThemeClassName)(l);
        return (0, r.jsxs)("div", {
          className: (0, a.c)("_wrapper_1u7sv_1", p, i, {
            _touchable_1u7sv_54: (0, s.isTouchableDevice)()
          }),
          children: [(0, r.jsx)(u.VisuallyHiddenInput, {
            className: (0, a.c)("_input_1u7sv_6"),
            ref: t,
            type: "checkbox",
            ...d
          }), (0, r.jsx)("span", {
            className: (0, a.c)("_checkbox_1u7sv_7", {
              _indeterminate_1u7sv_7: "indeterminate" === n,
              _invalid_1u7sv_50: c
            })
          })]
        })
      }));
      l.displayName = "Checkbox", l.Label = c.Label
    },
    502683: (e, t, i) => {
      i.r(t), i.d(t, {
        CheckboxBaseValues: () => n,
        CheckboxDarkTheme: () => u,
        CheckboxLabelTheme: () => s,
        CheckboxLightTheme: () => a,
        CheckboxSmallDarkTheme: () => c,
        CheckboxSmallLightTheme: () => o
      });
      var r = i(437682);
      const n = {
          "--crm-ui-kit-checkbox-z-index": "3",
          "--crm-ui-kit-checkbox-border-width": "1px",
          "--crm-ui-kit-checkbox-border-radius": "3px",
          "--crm-ui-kit-checkbox-border-style": "solid",
          "--crm-ui-kit-checkbox-background-color": "var(--crm-ui-kit-palette-background-primary)",
          "--crm-ui-kit-checkbox-disabled-background-color": "var(--crm-ui-kit-palette-background-primary-disabled)",
          "--crm-ui-kit-checkbox-error-border-color": "var(--crm-ui-kit-color-error)",
          "--crm-ui-kit-checkbox-checked-background": "var(--crm-ui-kit-checkbox-background-color) var(--crm-ui-kit-icon-checked-mark) no-repeat center / 70%",
          "--crm-ui-kit-checkbox-indeterminate-background": "var(--crm-ui-kit-checkbox-background-color) var(--crm-ui-kit-icon-minus) no-repeat center",
          "--crm-ui-kit-checkbox-focus-visible-outline-color": "var(--crm-ui-kit-palette-focus-visible-color)",
          "--crm-ui-kit-checkbox-focus-visible-outline-width": "var(--crm-ui-kit-palette-focus-visible-outline-width)",
          "--crm-ui-kit-checkbox-focus-visible-outline-style": "var(--crm-ui-kit-palette-focus-visible-outline-style)",
          "--crm-ui-kit-checkbox-focus-visible-outline-offset": "var(--crm-ui-kit-palette-focus-visible-outline-offset)",
          "--crm-ui-kit-checkbox-focus-visible-border-radius": "var(--crm-ui-kit-palette-focus-visible-border-radius)"
        },
        a = {
          ...n,
          "--crm-ui-kit-checkbox-size": "20px",
          "--crm-ui-kit-checkbox-border-color": "var(--crm-ui-kit-palette-border-default)"
        },
        o = {
          ...n,
          "--crm-ui-kit-checkbox-size": "16px",
          "--crm-ui-kit-checkbox-border-color": "var(--crm-ui-kit-palette-border-default)"
        },
        u = {
          ...n,
          "--crm-ui-kit-checkbox-size": "20px",
          "--crm-ui-kit-checkbox-border-color": "var(--crm-ui-kit-palette-border-primary)"
        },
        c = {
          ...n,
          "--crm-ui-kit-checkbox-size": "16px",
          "--crm-ui-kit-checkbox-border-color": "var(--crm-ui-kit-palette-border-primary)"
        },
        s = {
          ...r.LabelTheme,
          "--crm-ui-kit-label-description-spacing": "8px",
          "--crm-ui-kit-label-spacing": "8px"
        }
    },
    170303: (e, t, i) => {
      i.r(t), i.d(t, {
        Checkbox: () => r.Checkbox,
        CheckboxDarkTheme: () => n.CheckboxDarkTheme,
        CheckboxLabelTheme: () => n.CheckboxLabelTheme,
        CheckboxLightTheme: () => n.CheckboxLightTheme,
        CheckboxSmallDarkTheme: () => n.CheckboxSmallDarkTheme,
        CheckboxSmallLightTheme: () => n.CheckboxSmallLightTheme
      });
      var r = i(617859),
        n = i(502683)
    },
    130671: (e, t, i) => {
      i.r(t), i.d(t, {
        InlineInput: () => d
      });
      var r = i(824246),
        n = i(827378),
        a = i(22538),
        o = i(55436),
        u = i(901926),
        c = i(560885),
        s = i(445857),
        l = i(138747);
      i(907729);
      const d = (0, n.forwardRef)(((e, t) => {
        const {
          className: i = "",
          isInvalid: n = !1,
          invalidDescription: d,
          isDisabled: p,
          after: h,
          theme: m,
          ...f
        } = e, v = (0, o.useThemeClassName)(m);
        return (0, r.jsxs)("div", {
          className: (0, a.c)("_wrapper_vhy8z_1", v, i),
          children: [(0, r.jsx)("div", {
            className: (0, a.c)("_input_container_vhy8z_25", {
              _disabled_vhy8z_98: p
            }),
            children: (0, r.jsx)(c.BaseInput, {
              className: (0, a.c)({
                _has_after_vhy8z_54: !!h
              }),
              isDisabled: p,
              ref: t,
              ...f
            })
          }), (0, s.isValidRenderValue)(h) && (0, r.jsx)("div", {
            className: (0, a.c)("_after_container_vhy8z_42"),
            children: (0, r.jsx)("div", {
              className: (0, a.c)("_after_vhy8z_42"),
              children: h
            })
          }), n && (0, r.jsx)("div", {
            className: (0, a.c)("_invalid_description_container_vhy8z_58"),
            children: (0, r.jsx)(u.Text, {
              size: "m",
              theme: l.InputInvalidTextTheme,
              className: (0, a.c)("_invalid_description_vhy8z_58"),
              children: d
            })
          })]
        })
      }));
      d.displayName = "InlineInput"
    },
    138747: (e, t, i) => {
      i.r(t), i.d(t, {
        InlineInputPrimaryFocusedTheme: () => o,
        InlineInputPrimaryTheme: () => a,
        InputInvalidTextTheme: () => u
      });
      var r = i(799591);
      const n = {
          "--crm-ui-kit-inline-input-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-inline-input-placeholder-color": "var(--crm-ui-kit-palette-placeholder-primary)",
          "--crm-ui-kit-inline-input-disabled-color": "var(--crm-ui-kit-palette-text-primary)",
          "--crm-ui-kit-inline-input-invalid-description-color": "var(--crm-ui-kit-color-white)",
          "--crm-ui-kit-inline-input-invalid-description-background-color": "var(--crm-ui-kit-color-error)",
          "--crm-ui-kit-inline-input-font-size": "var(--crm-ui-kit-base-font-size)",
          "--crm-ui-kit-input-after-min-width": "36px",
          "--crm-ui-kit-inline-input-line-height": "20px",
          "--crm-ui-kit-inline-input-width": "100%",
          "--crm-ui-kit-inline-input-height": "19px",
          "--crm-ui-kit-inline-input-invalid-description-width": "auto",
          "--crm-ui-kit-inline-input-disabled-opacity": "0.6",
          "--crm-ui-kit-inline-input-padding-left": "1px",
          "--crm-ui-kit-inline-input-padding-right": "1px",
          "--crm-ui-kit-inline-input-border-style": "solid",
          "--crm-ui-kit-inline-input-border-width": "1px",
          "--crm-ui-kit-inline-input-invalid-description-offset": "5px",
          "--crm-ui-kit-inline-input-invalid-description-padding-x": "5px",
          "--crm-ui-kit-inline-input-invalid-description-padding-y": "9px",
          "--crm-ui-kit-inline-input-invalid-description-border-radius": "3px",
          "--crm-ui-kit-inline-input-invalid-description-arrow-width": "4px",
          "--crm-ui-kit-inline-input-invalid-description-arrow-top": "13px",
          "--crm-ui-kit-inline-input-invalid-description-arrow-left": "-5px"
        },
        a = {
          ...n,
          "--crm-ui-kit-inline-input-border-color": "transparent",
          "--crm-ui-kit-inline-input-focus-border-color": "var(--crm-ui-kit-color-blueberry)"
        },
        o = {
          ...n,
          "--crm-ui-kit-inline-input-border-color": "var(--crm-ui-kit-color-blueberry)",
          "--crm-ui-kit-inline-input-focus-border-color": "var(--crm-ui-kit-color-blueberry)"
        },
        u = {
          ...r.TextPrimaryTheme,
          "--crm-ui-kit-text-color": "var(--crm-ui-kit-inline-input-invalid-description-color)",
          "--crm-ui-kit-text-size-m-line-height": "15px"
        }
    },
    151807: (e, t, i) => {
      i.r(t), i.d(t, {
        InlineInput: () => r.InlineInput,
        InlineInputPrimaryFocusedTheme: () => n.InlineInputPrimaryFocusedTheme,
        InlineInputPrimaryTheme: () => n.InlineInputPrimaryTheme
      });
      var r = i(130671),
        n = i(138747)
    },
    439452: (e, t, i) => {
      i.r(t), i.d(t, {
        Label: () => l
      });
      var r = i(824246),
        n = i(827378),
        a = i.n(n),
        o = i(22538),
        u = i(55436),
        c = i(445857);
      i(406084);
      const s = {
          top: "_top_77ijt_10",
          left: "_left_77ijt_18",
          right: "_right_77ijt_19"
        },
        l = (0, n.forwardRef)(((e, t) => {
          const {
            className: i = "",
            children: n,
            text: a,
            theme: l,
            description: d,
            textPlacement: p = "top",
            isCentered: h = !1,
            ...m
          } = e, f = (0, u.useThemeClassName)(l);
          return (0, r.jsxs)("label", {
            ref: t,
            className: (0, o.c)(s[p], f, i, {
              _centered_77ijt_14: h
            }),
            ...m,
            children: [!(!(0, c.isValidRenderValue)(a) && !(0, c.isValidRenderValue)(d)) && (0, r.jsxs)("div", {
              className: (0, o.c)("_text_container_77ijt_10"),
              children: [(0, c.isValidRenderValue)(a) && a, (0, c.isValidRenderValue)(d) && (0, r.jsx)("div", {
                className: "_text_description_77ijt_43",
                children: d
              }), (0, r.jsx)("div", {
                children: !0
              })]
            }), n]
          })
        }));
      l.displayName = "Label";
      const d = (0, n.forwardRef)(((e, t) => {
        const {
          children: i,
          theme: n
        } = e, c = (0, u.useThemeClassName)(n);
        return (0, r.jsx)("div", {
          ref: t,
          children: a().Children.map(i, (e => (0, r.jsx)("div", {
            className: (0, o.c)("_wrapper_77ijt_1", c),
            children: e
          })))
        })
      }));
      d.displayName = "Group", l.Group = d
    },
    437682: (e, t, i) => {
      i.r(t), i.d(t, {
        LabelGroupTheme: () => r,
        LabelTheme: () => n
      });
      const r = {
          "--crm-ui-kit-label-group-margin-bottom": "16px"
        },
        n = {
          "--crm-ui-kit-label-spacing": "4px",
          "--crm-ui-kit-label-description-spacing": "4px",
          "--crm-ui-kit-label-text-width": "auto"
        }
    },
    855600: (e, t, i) => {
      i.r(t), i.d(t, {
        Label: () => r.Label,
        LabelGroupTheme: () => n.LabelGroupTheme,
        LabelTheme: () => n.LabelTheme
      });
      var r = i(439452),
        n = i(437682)
    },
    447323: (e, t, i) => {
      i.r(t), i.d(t, {
        VisuallyHiddenInput: () => u
      });
      var r = i(824246),
        n = i(827378),
        a = i(22538),
        o = i(560885);
      i(312205);
      const u = (0, n.forwardRef)(((e, t) => {
        const {
          className: i = "",
          ...n
        } = e;
        return (0, r.jsx)(o.BaseInput, {
          ref: t,
          className: (0, a.c)("_input_onafw_1", i),
          ...(() => {
            if ("isChecked" in n) {
              const {
                isChecked: e,
                ...t
              } = n;
              return {
                checked: e,
                ...t
              }
            }
            const {
              isDefaultChecked: e,
              ...t
            } = n;
            return {
              defaultChecked: e,
              ...t
            }
          })()
        })
      }));
      u.displayName = "VisuallyHiddenInput"
    },
    512078: (e, t, i) => {
      i.r(t)
    },
    907729: (e, t, i) => {
      i.r(t)
    },
    406084: (e, t, i) => {
      i.r(t)
    },
    312205: (e, t, i) => {
      i.r(t)
    },
    937634: (e, t, i) => {
      var r = i(331542);
      t.createRoot = r.createRoot, t.hydrateRoot = r.hydrateRoot
    },
    611958: (e, t, i) => {
      i.r(t), i.d(t, {
        default: () => m
      });
      var r = i(629133),
        n = i.n(r),
        a = i(395882),
        o = i.n(a),
        u = i(130860),
        c = i.n(u),
        s = i(444459),
        l = i(785557),
        d = i(661533);

      function p(e, t) {
        for (var i = 0; i < t.length; i++) {
          var r = t[i];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
        }
      }

      function h(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = i, e
      }
      const m = new(function() {
        function e() {
          ! function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, e), h(this, "api", void 0), h(this, "eTags", {}), this.api = new s.default("/api/v2"), this.api.loadBackendVersion()
        }
        var t, i;
        return t = e, i = [{
          key: "registerAccount",
          value: function(e, t) {
            var i = this.api.makeUrl("/register"),
              r = {
                account_id: +e,
                domain: t
              };
            return this.api.request("POST", i, r)
          }
        }, {
          key: "sendMessage",
          value: function(e, t, i, r, a, o, u, c, s) {
            var l = this.api.makeUrl("/account_id/messages/send"),
              d = {
                subject: i,
                attachments: o || {},
                content_type: a || "text",
                content: r,
                template_fields: u || {}
              };
            return n().isNull(s) || (d.entity_id = +c, d.entity_type = s), n().isObject(e) ? d.from = e : d.from = {
              mailbox_id: +e
            }, d = n().extend(d, t), this.api.request("POST", l, d)
          }
        }, {
          key: "getComposeDataForEntity",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/type/entity_id/compose", {
              entity_id: e,
              type: t
            });
            return this.api.request("GET", i)
          }
        }, {
          key: "createEntitiesFromThreads",
          value: function(e, t, i, r) {
            var n = this.api.makeUrl("/account_id/type/create", {
                type: t
              }),
              a = {
                thread_id: e,
                fields: i,
                name: r
              };
            return this.api.request("POST", n, a)
          }
        }, {
          key: "linkEntityToThread",
          value: function(e, t, i) {
            var r = this.api.makeUrl("/account_id/threads/thread_id/link", {
                thread_id: e
              }),
              n = {
                entity_type: t,
                entity_id: i
              };
            return this.api.request("POST", r, n)
          }
        }, {
          key: "listThreads",
          value: function(e, t, i, r, a) {
            var o, u = {
              fields: e,
              type: t,
              page: i || 1
            };
            return o = r ? this.api.makeUrl("/account_id/mailboxes/mailbox_id/threads", {
              mailbox_id: r
            }) : this.api.makeUrl("/account_id/threads"), u = n().extend({}, u, a), this.api.request("GET", o, u, null, {
              cache: !1
            })
          }
        }, {
          key: "getThread",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/threads/thread_id", {
              thread_id: e
            });
            return this.api.request("GET", i, null, null, t)
          }
        }, {
          key: "shareThreads",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/threads/share");
            return this.api.request("POST", t, e || [])
          }
        }, {
          key: "getExternalAddresses",
          value: function() {
            var e = this.api.makeUrl("/account_id/whitelist/external");
            return this.api.request("GET", e)
          }
        }, {
          key: "updateExternalAddresses",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/whitelist/external"),
              i = n().isEmpty(e) ? "DELETE" : "POST";
            return this.api.request(i, t, e || [])
          }
        }, {
          key: "shareThread",
          value: function(e, t, i) {
            t = n().isObject(t) ? t : {};
            var r = this.api.makeUrl("/account_id/threads/thread_id/share", {
                thread_id: e
              }),
              a = n().extend(t, {
                note: i
              });
            return this.api.request("POST", r, a)
          }
        }, {
          key: "resendThreads",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/threads/resend");
            return this.api.request("POST", t, e || [])
          }
        }, {
          key: "getMessages",
          value: function(e, t, i, r) {
            var n = this.api.makeUrl("/account_id/threads/thread_id/messages", {
              thread_id: e
            });
            return this.api.request("GET", n, {
              page: t,
              limit: i,
              opened_at: !0
            }, null, r)
          }
        }, {
          key: "resendMessage",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/threads/thread_id/messages/message_id/resend", {
              thread_id: e,
              message_id: t
            });
            return this.api.request("POST", i)
          }
        }, {
          key: "resendThread",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/threads/thread_id/resend", {
              thread_id: e
            });
            return this.api.request("POST", t)
          }
        }, {
          key: "unlinkThread",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/threads/thread_id/unlink", {
              thread_id: e
            });
            return this.api.request("POST", t)
          }
        }, {
          key: "linkThread",
          value: function(e, t, i) {
            var r = this.api.makeUrl("/account_id/threads/thread_id/link", {
                thread_id: e
              }),
              n = {
                entity_type: t,
                entity_id: i
              };
            return this.api.request("POST", r, n)
          }
        }, {
          key: "requestOAuthConnect",
          value: function(e, t) {
            var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
              r = this.api.makeUrl("/account_id/mailboxes/oauth"),
              a = n().extend({
                provider: e,
                back_url: t
              }, i);
            return this.api.request("GETJSON", r, a)
          }
        }, {
          key: "completeOAuthConnect",
          value: function(e, t, i, r, n) {
            var a = {
              name: e,
              token: t
            };
            r && (a.user_id = r, a.access = n ? l.default.MAILBOX_ACCESS_ADMIN : l.default.MAILBOX_ACCESS_OWNER), i && (a.settings = i);
            var o = this.api.makeUrl("/account_id/mailboxes/oauth");
            return this.api.request("POST", o, a)
          }
        }, {
          key: "requestOAuthMailboxConnect",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/mailboxes/mailbox_id/oauth", {
                mailbox_id: e
              }),
              r = {
                back_url: t
              };
            return this.api.request("GETJSON", i, r)
          }
        }, {
          key: "enableOAuthMailbox",
          value: function(e, t) {
            return this.enableMailbox(e, {
              token: t
            })
          }
        }, {
          key: "getUploadSandbox",
          value: function() {
            var e = this.api.makeUrl("/account_id/upload");
            return this.api.request("GET", e)
          }
        }, {
          key: "createParserTemplate",
          value: function(e, t, i) {
            var r = this.api.makeUrl("/account_id/mailboxes/mailbox_id/message_template", {
                mailbox_id: e
              }),
              n = {
                content: t,
                content_markers: i
              };
            return this.api.request("POST", r, n)
          }
        }, {
          key: "updateParserTemplate",
          value: function(e, t, i, r) {
            var n = this.api.makeUrl("/account_id/mailboxes/mailbox_id/message_template", {
                mailbox_id: e
              }),
              a = {
                content: t,
                content_markers: i,
                fields_info: r || {}
              };
            return this.api.request("POST", n, a)
          }
        }, {
          key: "getParserTemplate",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/mailbox_id/message_template", {
              mailbox_id: e
            });
            return this.api.request("GET", t)
          }
        }, {
          key: "fetchAttachment",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/attachments/".concat(e));
            return this.api.request("POST", t)
          }
        }, {
          key: "getAttachment",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/attachments/".concat(e));
            return this.api.request("GET", t)
          }
        }, {
          key: "uploadFiles",
          value: function(e, t) {
            var i = d.Deferred(),
              r = {
                "X-Upload-Version": 2,
                "X-Upload-Token": t.token,
                "X-Upload-Key": t.key
              },
              n = this;
            return o().upload({
              cache: !0,
              url: t.url,
              headers: r,
              complete: function(e, a) {
                !1 === e ? n.api.requestRaw("GET", t.url, {}, r).done((function(e) {
                  i.resolve(e)
                })).fail((function(e) {
                  i.reject(e.responseJSON || {
                    error_code: "complete_failed"
                  }, e)
                })) : i.reject({
                  error_code: "upload_failed",
                  message: e
                }, a)
              },
              fileupload: function(e, t, r) {
                var n;
                (n = i).notify.apply(n, arguments)
              },
              fileprogress: function(e, t, r, n) {
                i.notify(e, r, t, n)
              },
              filecomplete: function(e, t, r, n) {
                i.notify(e, t, r, n)
              },
              prepare: function(e, t) {
                t.headers["X-Upload-Id"] = c()().toString(), e.uuid = t.headers["X-Upload-Id"]
              },
              files: e,
              chunkSize: +o().MB,
              chunkUploadRetry: 3
            }), i
          }
        }, {
          key: "getTemplates",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/templates"),
              i = {};
            return n().isUndefined(e) || (i.type = e), this.api.resolveOnCache(this.api.request("GET", t, i, this.applyEtag("templates")), this.api.makeRequest("GET", t, i))
          }
        }, {
          key: "touchTemplates",
          value: function() {
            var e = this.api.makeUrl("/account_id/templates");
            return this.api.request("HEAD", e, null, this.applyEtag("templates"))
          }
        }, {
          key: "addTemplate",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/templates"),
              r = {
                name: e,
                fields: t || {}
              };
            return this.api.request("POST", i, r).done(this.storeEtagOnDone("templates"))
          }
        }, {
          key: "updateTemplate",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/templates/".concat(e));
            return this.api.request("PATCH", i, t).done(this.storeEtagOnDone("templates"))
          }
        }, {
          key: "getTemplate",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/templates/".concat(e));
            return this.api.resolveOnCache(this.api.request("GET", t, null, this.applyEtag("templates")), this.api.makeRequest("GET", t))
          }
        }, {
          key: "removeTemplate",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/templates/".concat(e));
            return this.api.request("DELETE", t).done(this.storeEtagOnDone("templates"))
          }
        }, {
          key: "sortTemplate",
          value: function(e, t) {
            return this.updateTemplate(e, {
              sort: {
                after: t
              }
            }).done(this.storeEtagOnDone("templates"))
          }
        }, {
          key: "getTemplateMarkers",
          value: function() {
            var e = d.Deferred();
            return e.resolve([{
              name: "contact_name",
              code: "{{contact.name}}"
            }, {
              name: "profile_name",
              code: "{{profile.name}}"
            }, {
              name: "profile_phone",
              code: "{{profile.phone}}"
            }]), e.promise()
          }
        }, {
          key: "getMailboxes",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes");
            return this.api.request("GET", t, {
              mode: e
            })
          }
        }, {
          key: "getMailbox",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/".concat(e));
            return this.api.request("GET", t)
          }
        }, {
          key: "getMailboxStatus",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/mailbox_id/status", {
              mailbox_id: e
            });
            return this.api.request("GET", t)
          }
        }, {
          key: "getMailboxesStatus",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/status");
            return this.api.request("GET", t, {
              id: e || []
            })
          }
        }, {
          key: "enableMailbox",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/mailboxes/mailbox_id", {
                mailbox_id: e
              }),
              r = n().extend({
                active: !0
              }, t || {});
            return this.api.request("PATCH", i, r)
          }
        }, {
          key: "cancelConnection",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/mailbox_id/cancel", {
              mailbox_id: e
            });
            return this.api.request("POST", t)
          }
        }, {
          key: "addMailbox",
          value: function(e, t, i, r) {
            var n = this.api.makeUrl("/account_id/mailboxes");
            return (t = t || {}).email = e, i && (t.user_id = +i, t.access = r ? l.default.MAILBOX_ACCESS_ADMIN : l.default.MAILBOX_ACCESS_OWNER), this.api.request("POST", n, t)
          }
        }, {
          key: "createMailbox",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/create"),
              i = {
                type: e
              };
            return this.api.request("POST", t, i)
          }
        }, {
          key: "getMailboxSetupSettings",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailbox_setup/mailbox_id", {
              mailbox_id: e
            });
            return this.api.request("GET", t)
          }
        }, {
          key: "getMailboxConfirmMessage",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailbox_setup/mailbox_id/confirm_message", {
              mailbox_id: e
            });
            return this.api.request("GET", t)
          }
        }, {
          key: "getTemplateMessage",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/threads/thread_id/messages/parser_message_template", {
              thread_id: e
            });
            return this.api.request("GET", t)
          }
        }, {
          key: "updateMailbox",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/mailboxes/mailbox_id", {
              mailbox_id: e
            });
            return t = t || {}, this.api.request("PATCH", i, t)
          }
        }, {
          key: "updateMailboxSetup",
          value: function(e, t, i) {
            var r = this.api.makeUrl("/account_id/mailbox_setup/mailbox_id", {
                mailbox_id: e
              }),
              n = {
                status: t,
                state: i
              };
            return this.api.request("PATCH", r, n)
          }
        }, {
          key: "changeMailboxAuth",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/mailboxes/mailbox_id", {
                mailbox_id: e
              }),
              r = {
                auth: t
              };
            return this.api.request("PATCH", i, r)
          }
        }, {
          key: "getDomain",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/domains/domain_id", {
              domain_id: e
            });
            return this.api.request("GET", t)
          }
        }, {
          key: "getDomainStatus",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/domains/domain_id/status/uuid", {
              domain_id: e,
              uuid: t
            });
            return this.api.request("GET", i)
          }
        }, {
          key: "checkDomain",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/domains/domain_id/check", {
              domain_id: e
            });
            return this.api.request("POST", t)
          }
        }, {
          key: "changeMailboxOwner",
          value: function(e, t, i) {
            var r = this.api.makeUrl("/account_id/mailboxes/mailbox_id", {
              mailbox_id: e
            });
            if (n().isUndefined(t)) throw new Error("Logic error user_id must be set");
            var a = {
              user_id: t
            };
            return t && (a.access = i ? l.default.MAILBOX_ACCESS_ADMIN : l.default.MAILBOX_ACCESS_OWNER), this.api.request("PATCH", r, a)
          }
        }, {
          key: "disableMailbox",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/mailbox_id", {
              mailbox_id: e
            });
            return this.api.request("PATCH", t, {
              active: !1
            })
          }
        }, {
          key: "deleteMailbox",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/mailboxes/mailbox_id", {
              mailbox_id: e
            });
            return this.api.request("DELETE", t)
          }
        }, {
          key: "readThread",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/threads/read"),
              i = {
                threads: e
              };
            return this.api.request("POST", t, i)
          }
        }, {
          key: "unreadThread",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/threads/unread"),
              i = {
                threads: e
              };
            return this.api.request("POST", t, i)
          }
        }, {
          key: "getUserSignature",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/signatures"),
              i = {
                user_id: e
              };
            return this.api.resolveOnCache(this.api.request("GET", t, i, this.applyEtag("signatures")), this.api.makeRequest("GET", t, i))
          }
        }, {
          key: "getSignatures",
          value: function() {
            var e = this.api.makeUrl("/account_id/signatures");
            return this.api.resolveOnCache(this.api.request("GET", e, null, this.applyEtag("signature")), this.api.makeRequest("GET", e))
          }
        }, {
          key: "touchSignatures",
          value: function() {
            var e = this.api.makeUrl("/account_id/signatures");
            return this.api.request("HEAD", e, null, this.applyEtag("signature"))
          }
        }, {
          key: "addSignature",
          value: function(e, t) {
            var i = this.api.makeUrl("/account_id/signatures"),
              r = {
                user_id: e,
                content: t
              };
            return this.api.request("POST", i, r).done(this.storeEtagOnDone("signature"))
          }
        }, {
          key: "updateSignature",
          value: function(e, t, i) {
            var r = this.api.makeUrl("/account_id/signatures/signature_id", {
                signature_id: e
              }),
              n = {
                content: i,
                user_id: t
              };
            return this.api.request("PATCH", r, n).done(this.storeEtagOnDone("signature"))
          }
        }, {
          key: "deleteSignature",
          value: function(e) {
            var t = this.api.makeUrl("/account_id/signatures/signature_id", {
              signature_id: e
            });
            return this.api.request("DELETE", t).done(this.storeEtagOnDone("signature"))
          }
        }, {
          key: "applyEtag",
          value: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return this.eTags[e] && (t["If-None-Match"] = this.eTags[e], delete this.eTags[e]), t
          }
        }, {
          key: "storeEtagOnDone",
          value: function(e) {
            return n().bind((function(t, i, r) {
              var a = r.getResponseHeader("ETag");
              n().isEmpty(a) || (this.eTags[e] = a)
            }), this)
          }
        }], i && p(t.prototype, i), e
      }());
      var f = "../build/transpiled/components/mail/api_v2";
      window.define(f, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([f])
    },
    444459: (e, t, i) => {
      i.r(t), i.d(t, {
        default: () => d
      });
      var r = i(629133),
        n = i.n(r),
        a = i(661533),
        o = i.n(a),
        u = i(12615),
        c = i(509372);

      function s(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var i = 0, r = new Array(t); i < t; i++) r[i] = e[i];
        return r
      }
      var l = function(e, t) {
        this.base_path = e, this.headers = n().extend({
          "X-Requested-With": "XMLHttpRequest"
        }, t || {})
      };
      n().extend(l.prototype, {
        loadBackendVersion: function() {
          var e;
          (e = (0, c.get)("amomail_backend")) && (e = JSON.parse(e), n().isString(e.backend) && (this.headers["X-App-Api-Backend"] = e.backend), this.headers["X-App-Version"] = e.version)
        },
        setBackendVersion: function(e, t) {
          if (n().isUndefined(e) && n().isUndefined(t) || n().isUndefined(t) && "current" === e) return (0, c.set)({
            name: "amomail_backend",
            value: "{}",
            expiredays: -1
          }), delete this.headers["X-App-Api-Backend"], void delete this.headers["X-App-Version"];
          e = e || "current", this.headers["X-App-Version"] = e;
          var i = {
            backend: null,
            version: e
          };
          n().isString(t) && (this.headers["X-App-Api-Backend"] = t, i.backend = t), (0, c.set)({
            name: "amomail_backend",
            expiredays: 1,
            value: JSON.stringify(i)
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
          return t.headers = n().extend({}, this.headers, e || {}), t
        },
        resolveOnCache: function(e, t) {
          var i = o().Deferred(),
            r = n().bind((function() {
              for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
              i.resolve.apply(this, t)
            }), this),
            a = n().bind((function() {
              for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
              i.reject(this, t)
            }), this);
          return e.done((function(e, i, n) {
            304 === n.status ? t().done(r).fail(a) : r.apply(this, arguments)
          })).fail(a), i.promise()
        },
        makeRequest: function() {
          var e = Array.prototype.slice.call(arguments);
          return n().bind((function() {
            return this.request.apply(this, function(e) {
              if (Array.isArray(e)) return s(e)
            }(t = e) || function(e) {
              if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(t) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return s(e, t);
                var i = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === i && e.constructor && (i = e.constructor.name), "Map" === i || "Set" === i ? Array.from(i) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? s(e, t) : void 0
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
            var i = o().Deferred();
            return i.resolve(), i.promise()
          }
          var r = "".concat(t.server_base, "/api/v2/register"),
            a = APP.constant("account"),
            u = {
              account_id: a.id,
              domain: a.subdomain
            },
            c = n().extend(this.getAjaxDefaults(), {
              url: r,
              data: JSON.stringify(u),
              type: "POST",
              dataType: "json"
            }),
            s = o().ajax(c);
          return s.done((function() {
            t.enabled = !0
          })), s
        },
        makeUrl: function(e, t) {
          var i = this.getParams();
          return t = t || {}, i.account_id && (t.account_id = i.account_id), n().each(t, (function(t, i) {
            e = e.replace(i, t)
          })), i.base_url + e
        },
        _request: function(e, t, i, r, a) {
          var c = o().Deferred();
          r = r || {}, i = i || {}, "GET" !== e && (i = JSON.stringify(i), "GETJSON" === e ? r["X-Http-Method-Override"] = "GET" : "POST" !== e && (r["X-Http-Method-Override"] = e), e = "POST");
          var s = n().extend(this.getAjaxDefaults(r), {
            url: t,
            data: i,
            type: e,
            dataType: "json"
          }, a || {});
          return o().ajax(s).done((function() {
            c.resolve.apply(null, arguments)
          })).fail((function(e) {
            401 === e.status ? u.default.checkAuth((function() {
              return o().ajax(s)
            }), 0).done((function() {
              c.resolve.apply(null, arguments)
            })).fail((function() {
              c.reject.apply(null, arguments)
            })) : c.reject.apply(null, arguments)
          })), c.promise()
        },
        requestRaw: function(e, t) {
          var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
            a = arguments.length > 4 ? arguments[4] : void 0,
            u = n().extend({
              url: t,
              data: i,
              type: e,
              headers: r,
              dataType: "json"
            }, a || {});
          return o().ajax(u)
        },
        request: function(e, t, i, r, a) {
          var o = this;
          return this.checkAccount().always((function() {
            o.request = o._request
          })).then(n().bind(o._request, this, e, t, i, r, a))
        }
      });
      const d = l;
      var p = "../build/transpiled/components/mail/base_api";
      window.define(p, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([p])
    },
    785557: (e, t, i) => {
      i.r(t), i.d(t, {
        MAILBOX_AUTH_TYPES: () => h,
        MAILBOX_ERRORS: () => p,
        MAILBOX_ERROR_GROUPS_CODES: () => v,
        MAILBOX_GENERAL_ERRORS: () => l,
        MAILBOX_GENERAL_ERROR_CODES: () => d,
        MAILBOX_GROUPS_ERROR: () => f,
        MAILBOX_STATES: () => r,
        MAILBOX_STATE_CODES: () => n,
        MAILBOX_STATUSES: () => a,
        MAILBOX_STATUS_CODES: () => o,
        MAILBOX_TYPES: () => u,
        MAILBOX_TYPE_CODES: () => c,
        MAILBOX_VALIDATION_ERRORS: () => s,
        default: () => m
      });
      var r = {
          complete: "complete",
          locked: "locked",
          connection: "connection",
          convertation: "convertation"
        },
        n = [r.complete, r.locked, r.connection, r.convertation],
        a = {
          connection: "connection",
          import: "import",
          sync: "sync",
          locked: "locked",
          disabled: "disabled",
          complete: "complete"
        },
        o = [a.connection, a.import, a.sync, a.locked, a.disabled, a.complete],
        u = {
          internal: "internal",
          shared: "shared",
          private: "private",
          parser: "parser"
        },
        c = [u.internal, u.shared, u.private, u.parser],
        s = {
          temporary_locked: "temporary_locked"
        },
        l = {
          locked: "locked",
          reauth_required: "reauthorization_required",
          oauth_conn_error: "oauth_connection_error",
          conn_error: "connection_error",
          list_folders: "list_folders",
          no_sent_folders: "no_sent_folder"
        },
        d = [l.locked, l.reauth_required, l.oauth_conn_error, l.conn_error, l.list_folders, l.no_sent_folders],
        p = {
          auth_invalid_credentials: "auth.invalid_credentials",
          auth_token_refresh: "auth.token_refresh",
          imap_auth_error: "imap.auth.error",
          imap_conn_error: "imap.conn.error",
          imap_conn_timeout: "imap.conn.timeout",
          imap_conn_wrong_proto: "imap.conn.wrong_proto",
          imap_conn_tls_invalid_cert: "imap.conn.tls_invalid_cert",
          smtp_auth_error: "smtp.auth.error",
          smtp_conn_error: "smtp.conn.error",
          smtp_conn_timeout: "smtp.conn.timeout",
          smtp_conn_wrong_proto: "smtp.conn.wrong_proto",
          smtp_conn_tls_invalid_cert: "smtp.conn.tls_invalid_cert"
        },
        h = {
          login: "login",
          oauth: "oauth"
        };
      const m = {
        MAILER_AMO: "amo",
        MAILER_PROVIDER: "provider",
        MAILBOX_ACCESS_OWNER: 0,
        MAILBOX_ACCESS_ADMIN: 1
      };
      var f = {
          connection_group_error: "connection_group_error",
          timeout_group_error: "timeout_group_error",
          auth_group_error: "auth_group_error",
          oauth_group_error: "oauth_group_error"
        },
        v = [f.connection_group_error, f.timeout_group_error, f.auth_group_error, f.oauth_group_error],
        _ = "../build/transpiled/components/mail/constants";
      window.define(_, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([_])
    },
    343377: (e, t, i) => {
      i.r(t), i.d(t, {
        NavigationBarView: () => q,
        navigationBarView: () => D
      });
      var r = i(567952),
        n = i.n(r),
        a = i(937634),
        o = i(460159),
        u = i.n(o),
        c = i(629133),
        s = i(827378),
        l = i(313981),
        d = i(926168),
        p = i(445368),
        h = i(500034),
        m = i(803218),
        f = i(323344),
        v = i(317954),
        _ = i(614759),
        y = i(403889),
        b = i(396579),
        k = i(572571),
        g = i(397927),
        x = i(827378);

      function T(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var i = 0, r = new Array(t); i < t; i++) r[i] = e[i];
        return r
      }

      function E(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
      }

      function I(e, t, i, r, n, a, o) {
        try {
          var u = e[a](o),
            c = u.value
        } catch (e) {
          return void i(e)
        }
        u.done ? t(c) : Promise.resolve(c).then(r, n)
      }

      function A(e, t) {
        for (var i = 0; i < t.length; i++) {
          var r = t[i];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
        }
      }

      function S(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = i, e
      }

      function O(e, t, i) {
        return O = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, i) {
          var r = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = w(e)););
            return e
          }(e, t);
          if (r) {
            var n = Object.getOwnPropertyDescriptor(r, t);
            return n.get ? n.get.call(i || e) : n.value
          }
        }, O(e, t, i || e)
      }

      function w(e) {
        return w = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, w(e)
      }

      function P(e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = null != arguments[t] ? arguments[t] : {},
            r = Object.keys(i);
          "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(i).filter((function(e) {
            return Object.getOwnPropertyDescriptor(i, e).enumerable
          })))), r.forEach((function(t) {
            S(e, t, i[t])
          }))
        }
        return e
      }

      function C(e, t) {
        return t = null != t ? t : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : function(e, t) {
          var i = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            i.push.apply(i, r)
          }
          return i
        }(Object(t)).forEach((function(i) {
          Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(t, i))
        })), e
      }

      function R(e, t) {
        return R = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, R(e, t)
      }

      function N(e) {
        return function(e) {
          if (Array.isArray(e)) return T(e)
        }(e) || function(e) {
          if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
        }(e) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return T(e, t);
            var i = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === i && e.constructor && (i = e.constructor.name), "Map" === i || "Set" === i ? Array.from(i) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? T(e, t) : void 0
          }
        }(e) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function U(e) {
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
          var i, r = w(e);
          if (t) {
            var n = w(this).constructor;
            i = Reflect.construct(r, arguments, n)
          } else i = r.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((i = t) && "undefined" != typeof Symbol && i.constructor === Symbol ? "symbol" : typeof i) && "function" != typeof t ? E(e) : t;
            var i
          }(this, i)
        }
      }
      var M = new Map,
        L = (0, _.withQueryProvider)(k.NavigationBar),
        q = function(e) {
          ! function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && R(e, t)
          }(l, e);
          var t, r, o = U(l);

          function l(e) {
            var t;
            return function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, l), S(E(t = o.call(this, e)), "activeItemId", ""), S(E(t), "groupId", ""), S(E(t), "cachedRenderProps", null), S(E(t), "telephonyState", null), S(E(t), "root", void 0), S(E(t), "unmountChangeNavigationModal", void 0), S(E(t), "tryToFindItem", (function(e, t, i, r) {
              return (0, k.findItem)(e || [], r) || (0, k.findItem)(t || [], r) || (0, k.findItem)((0, c.pluck)(i, "children"), r)
            })), t.root = (0, a.createRoot)(t.el), "Y" === (0, m.getInitParam)("success_navigation_bar_change") && t.mountChangeNavigationModal().then((function(e) {
              t.unmountChangeNavigationModal = e
            })), APP.router && t.listenTo(APP.router, "route", (0, c.bind)(t.handleRouteChange, E(t))), t.render(), t
          }
          return t = l, r = [{
            key: "destroy",
            value: function() {
              this.unmountChangeNavigationModal && this.unmountChangeNavigationModal(), O(w(l.prototype), "destroy", this).call(this)
            }
          }, {
            key: "handleRouteChange",
            value: function() {
              this.renderWithoutCache()
            }
          }, {
            key: "render",
            value: function() {
              var e, t, i, r = this.getRenderProps();
              if (r) {
                var n = r.menu,
                  a = r.extra,
                  o = r.pinned,
                  u = r.selectedItem,
                  s = r.selectedAsideableItem,
                  l = r.profileExtra,
                  d = (0, c.bind)(this.handleAsyncStateChange, this);
                this.root.render(x.createElement(L, {
                  selectedItem: u,
                  selectedAsideableItem: s,
                  systemNavigation: {
                    menu: n,
                    extra: a,
                    pinned: o,
                    profileExtra: l
                  },
                  isTelephonyEnabled: Boolean(null === (e = this.telephonyState) || void 0 === e ? void 0 : e.isEnabled),
                  onTelephonyToggle: (null === (t = this.telephonyState) || void 0 === t ? void 0 : t.isEnabled) ? null === (i = this.telephonyState) || void 0 === i ? void 0 : i.onClick : void 0,
                  onAsyncStateChange: d
                }))
              }
            }
          }, {
            key: "renderWithoutCache",
            value: function() {
              this.cachedRenderProps = null, this.render()
            }
          }, {
            key: "handleAsyncStateChange",
            value: function() {
              var e = this;
              setTimeout((function() {
                e.renderWithoutCache()
              }), 0)
            }
          }, {
            key: "setTelephonyState",
            value: function(e) {
              this.telephonyState = e, this.renderWithoutCache()
            }
          }, {
            key: "setActiveItemId",
            value: function(e, t) {
              this.activeItemId = e, this.groupId = t || "", this.renderWithoutCache()
            }
          }, {
            key: "mountChangeNavigationModal",
            value: function() {
              return (e = function() {
                var e, t, r, n, o;
                return function(e, t) {
                  var i, r, n, a, o = {
                    label: 0,
                    sent: function() {
                      if (1 & n[0]) throw n[1];
                      return n[1]
                    },
                    trys: [],
                    ops: []
                  };
                  return a = {
                    next: u(0),
                    throw: u(1),
                    return: u(2)
                  }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                    return this
                  }), a;

                  function u(a) {
                    return function(u) {
                      return function(a) {
                        if (i) throw new TypeError("Generator is already executing.");
                        for (; o;) try {
                          if (i = 1, r && (n = 2 & a[0] ? r.return : a[0] ? r.throw || ((n = r.return) && n.call(r), 0) : r.next) && !(n = n.call(r, a[1])).done) return n;
                          switch (r = 0, n && (a = [2 & a[0], n.value]), a[0]) {
                            case 0:
                            case 1:
                              n = a;
                              break;
                            case 4:
                              return o.label++, {
                                value: a[1],
                                done: !1
                              };
                            case 5:
                              o.label++, r = a[1], a = [0];
                              continue;
                            case 7:
                              a = o.ops.pop(), o.trys.pop();
                              continue;
                            default:
                              if (!((n = (n = o.trys).length > 0 && n[n.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                o = 0;
                                continue
                              }
                              if (3 === a[0] && (!n || a[1] > n[0] && a[1] < n[3])) {
                                o.label = a[1];
                                break
                              }
                              if (6 === a[0] && o.label < n[1]) {
                                o.label = n[1], n = a;
                                break
                              }
                              if (n && o.label < n[2]) {
                                o.label = n[2], o.ops.push(a);
                                break
                              }
                              n[2] && o.ops.pop(), o.trys.pop();
                              continue
                          }
                          a = t.call(e, o)
                        } catch (e) {
                          a = [6, e], r = 0
                        } finally {
                          i = n = 0
                        }
                        if (5 & a[0]) throw a[1];
                        return {
                          value: a[0] ? a[1] : void 0,
                          done: !0
                        }
                      }([a, u])
                    }
                  }
                }(this, (function(c) {
                  switch (c.label) {
                    case 0:
                      return [4, Promise.resolve().then(i.bind(i, 572571))];
                    case 1:
                      return e = c.sent().ChangeNavigationModalUsage, [4, u()._preload("langs/changeNavigationModal")()];
                    case 2:
                      return c.sent(), t = document.createElement("div"), document.body.appendChild(t), r = (0, s.createElement)(e, {}), n = (0, a.createRoot)(t), o = (0, f.removeQueryParam)("success_navigation_bar_change"), n.render(r), APP.router.navigate(window.location.pathname + (o ? "?".concat(o) : ""), {
                        replace: !0
                      }), [2, function() {
                        n.unmount()
                      }]
                  }
                }))
              }, function() {
                var t = this,
                  i = arguments;
                return new Promise((function(r, n) {
                  var a = e.apply(t, i);

                  function o(e) {
                    I(a, r, n, o, u, "next", e)
                  }

                  function u(e) {
                    I(a, r, n, o, u, "throw", e)
                  }
                  o(void 0)
                }))
              })();
              var e
            }
          }, {
            key: "addItem",
            value: function(e) {
              var t = e.id,
                i = e.title,
                r = e.path,
                n = e.groupId,
                a = e.pinnedSectionEntity,
                o = APP.constant("system_navigation") || {},
                u = o.menu,
                s = o.extra;
              if (((0, k.findItem)(u || [], t) || (0, k.findItem)(s || [], t) || {}).item) return !1;
              if (a) {
                var l = (APP.constant("system_navigation") || {}).pinned,
                  d = (void 0 === l ? [] : l).find((function(e) {
                    return e.entity === a
                  }));
                return !!d && (d.children.push({
                  id: t,
                  title: i,
                  path: r
                }), this.renderWithoutCache(), !0)
              }
              if (!n) return !!u && (u.push({
                id: t,
                title: i,
                path: r
              }), this.renderWithoutCache(), !0);
              var p = ((0, k.findItem)(u || [], n) || (0, k.findItem)(s || [], n) || {}).item;
              if (p && (0, k.isGroupItem)(p)) return p.children.push({
                id: t,
                title: i,
                path: r
              }), this.renderWithoutCache(), !0;
              if (p && (0, k.isAsideableItem)(p)) {
                var h = (0, c.last)(p.aside.sections);
                return !!h && (h.children.push({
                  id: t,
                  title: i,
                  path: r
                }), this.renderWithoutCache(), !0)
              }
              return !1
            }
          }, {
            key: "removeItem",
            value: function(e) {
              var t = APP.constant("system_navigation") || {},
                i = t.menu,
                r = void 0 === i ? [] : i,
                n = t.extra,
                a = void 0 === n ? [] : n,
                o = !1,
                u = function(t) {
                  if (!o)
                    for (var i = 0; i < t.length && !o; i++) {
                      var r = t[i];
                      if ((0, c.isArray)(r)) u(r);
                      else if ((0, k.isGroupItem)(r)) u(r.children);
                      else if ((0, k.isAsideableItem)(r)) {
                        var n = !0,
                          a = !1,
                          s = void 0;
                        try {
                          for (var l, d = r.aside.sections[Symbol.iterator](); !(n = (l = d.next()).done); n = !0) {
                            var p = l.value;
                            if (u(p.children), o) break
                          }
                        } catch (e) {
                          a = !0, s = e
                        } finally {
                          try {
                            n || null == d.return || d.return()
                          } finally {
                            if (a) throw s
                          }
                        }
                      } else r.id === e && (t.splice(i, 1), o = !0)
                    }
                };
              return u(r), u(a), o && this.renderWithoutCache(), o
            }
          }, {
            key: "updateItemCounter",
            value: function(e) {
              if (!this.getRenderProps()) return !1;
              var t;
              t = "id" in e ? e.id : e.widgetCode;
              var i = e.count;
              if (("string" == typeof i ? parseInt(i) < 0 : i < 0) && (i = 0), i !== M.get(t)) {
                M.set(t, i);
                var r = this.getRenderProps() || {},
                  n = r.menu,
                  a = void 0 === n ? [] : n,
                  o = r.extra,
                  u = void 0 === o ? [] : o,
                  s = r.pinned,
                  l = void 0 === s ? [] : s,
                  d = (this.tryToFindItem(a, u, l, t) || {}).coreGroupItem;
                if (d) {
                  var p = function(e) {
                    if ((0, k.isGroupItem)(e) && e.id !== g.KnownNavigationItemIdV2.EMAIL_INBOX) {
                      var t = 0;
                      e.children.forEach((function(e) {
                        var i = function(e) {
                          var i = p(e);
                          switch (!0) {
                            case "string" == typeof i && isNaN(parseInt(i)):
                              t = i;
                              break;
                            case "string" == typeof i && !isNaN(parseInt(i)) && "number" == typeof t:
                              i.endsWith("+") ? t = i : /(k|к)$/.test(i.toLowerCase()) ? t += parseInt(i.toLowerCase().replace(/(k|к)/g, "000")) : isNaN(parseInt(i[i.length - 1])) || (t += parseInt(i));
                              break;
                            case "number" == typeof i && "number" == typeof t:
                              t += i
                          }
                        };
                        (0, c.isArray)(e) ? e.forEach(i): i(e)
                      }));
                      var i = t;
                      if ("number" == typeof i && i.toString().length > 3) {
                        var r = i.toString().length,
                          n = Math.floor((r - 1) / 3);
                        n > 0 && (i = i.toString().slice(0, r - 3 * n) + "".padStart(n, "k"))
                      }
                      return "number" != typeof i && "string" != typeof i || M.set(e.id, i), t
                    }
                    return M.get(e.id) || 0
                  };
                  p(d)
                }
                return this.renderWithoutCache(), !0
              }
            }
          }, {
            key: "getRenderProps",
            value: function() {
              var e = this;
              if (this.cachedRenderProps) return this.cachedRenderProps;
              var t = n()(APP.constant("system_navigation"));
              if (!t) return null;
              var i = t.menu,
                r = t.extra,
                a = t.pinned,
                o = void 0 === a ? [] : a,
                u = this.mutateExtraItems(r),
                c = (0, k.extractItemsById)(u, [g.KnownNavigationItemIdV2.SETTINGS_WORKSPACE, g.KnownNavigationItemIdV2.SETTINGS_BILLING]);
              c = this.applyTrialBadgeToBillingItem(c);
              var s, l, d = this.mapMenuItems(i),
                p = this.mapMenuItems(u),
                h = this.mapPinned(o),
                m = function(t) {
                  if (!s) {
                    var i = e.tryToFindItem(d, p, h, t) || {},
                      r = i.item,
                      n = i.parentAsideableItem;
                    r && (s = r), n && (l = n)
                  }
                };
              m(this.activeItemId), m(this.groupId);
              var f = (0, y.getPathname)();
              return m((function(e) {
                return (0, k.isSelectableItem)(e) && (0, y.normalizePath)(e.path) === f
              })), this.cachedRenderProps = {
                menu: d,
                extra: p,
                pinned: h,
                selectedItem: s,
                selectedAsideableItem: l,
                profileExtra: c
              }, this.cachedRenderProps
            }
          }, {
            key: "applyTrialBadgeToBillingItem",
            value: function(e) {
              var t = e.findIndex((function(e) {
                return e.id === g.KnownNavigationItemIdV2.SETTINGS_BILLING
              }));
              if (!(0, d.isTrial)() || -1 === t) return e;
              var i = (0, b.getTrialDaysLeft)();
              return i ? N(e.slice(0, t)).concat([C(P({}, e[t]), {
                badge: x.createElement(v.MetaBadge, {
                  title: (0, p.sprintf)((0, p.i18n)("Trial %s left"), i + " " + (0, p.numeralWord)(i, (0, p.i18n)("day,days,days,days"))),
                  theme: "red"
                })
              })], N(e.slice(t + 1))) : e
            }
          }, {
            key: "mutateExtraItems",
            value: function(e) {
              var t, i = e.concat({
                id: g.KnownNavigationItemIdV2.NOTIFICATIONS,
                title: (0, p.i18n)("Notifications"),
                path: "/settings/profile/notifications"
              });
              if ((0, h.isFeatureAvailable)(h.Features.IS_AI_COPILOT_AVAILABLE) && (i.forEach((function(e) {
                  var i = function(e) {
                    (0, k.isGroupItem)(e) && e.id === g.KnownNavigationItemIdV2.HELP && (t = e)
                  };
                  (0, c.isArray)(e) ? e.forEach(i): i(e)
                })), t)) {
                var r = {
                  id: g.KnownNavigationItemIdV2.AI_COPILOT,
                  title: (0, p.i18n)("AI Copilot"),
                  path: "/settings/ai"
                };
                t.children = [r].concat(N(t.children))
              }
              return i
            }
          }, {
            key: "mapMenuItems",
            value: function(e) {
              var t = this;
              return e.map((function(e) {
                return (0, c.isArray)(e) ? t.mapMenuItems(e) : ((0, k.isGroupItem)(e) && (e = C(P({}, e), {
                  children: t.mapMenuItems(e.children)
                })), C(P({}, e), {
                  badge: M.get(e.id) || e.badge,
                  icon: function(t) {
                    var i = t.isActive;
                    return x.createElement(k.BaseIcon, {
                      id: e.id,
                      isActive: i
                    })
                  }
                }))
              }))
            }
          }, {
            key: "mapPinned",
            value: function(e) {
              return e.map((function(e) {
                return C(P({}, e), {
                  children: e.children.map((function(t) {
                    var i = t.icon;
                    return "object" == typeof i || "function" == typeof i ? t : "string" == typeof i && i ? C(P({}, t), {
                      icon: x.createElement(k.IntegrationIcon, {
                        src: i
                      })
                    }) : e.entity ? C(P({}, t), {
                      icon: function(i) {
                        var r = i.isCollapsed,
                          n = i.isActive;
                        return x.createElement(k.PinnedIcon, {
                          entity: e.entity || "",
                          title: r ? t.title : "",
                          isActive: n
                        })
                      }
                    }) : t
                  }))
                })
              }))
            }
          }], r && A(t.prototype, r), l
        }(l.View),
        j = document.getElementById("popover-boundary");
      j || ((j = document.createElement("div")).id = "popover-boundary", document.body.appendChild(j), j.style.position = "fixed", j.style.inset = "0", j.style.width = "100%", j.style.height = "100%", j.style.pointerEvents = "none", j.style.zIndex = String(-Number.MAX_SAFE_INTEGER));
      var D = window.__navigationBar || (window.__navigationBar = new q({
        el: document.getElementById("left_menu")
      }))
    },
    23456: (e, t, i) => {
      i.r(t), i.d(t, {
        kommoLogAmplitude: () => a
      });
      var r = i(629133),
        n = i.n(r),
        a = function(e, t, i) {
          n().isFunction(window.logAmplitudeEvent) && window.logAmplitudeEvent(e, t, i)
        },
        o = "../build/transpiled/utils/analytics/amplitude";
      window.define(o, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([o])
    },
    616165: (e, t, i) => {
      var r;
      i.r(t), i.d(t, {
          KeyboardKeys: () => r
        }),
        function(e) {
          e.BACKSPACE = "Backspace", e.ENTER = "Enter", e.SPACE = "Space", e.ESCAPE = "Escape", e.ARROW_UP = "ArrowUp", e.ARROW_DOWN = "ArrowDown", e.ARROW_LEFT = "ArrowLeft", e.ARROW_RIGHT = "ArrowRight", e.TAB = "Tab"
        }(r || (r = {}))
    },
    396579: (e, t, i) => {
      i.r(t), i.d(t, {
        getTrialDaysLeft: () => r.getTrialDaysLeft
      });
      var r = i(191800)
    },
    156017: (e, t, i) => {
      i.r(t), i.d(t, {
        getTrialDaysLeft: () => n
      });
      var r = i(909599);

      function n() {
        var e, t = null === (e = APP.constant("account")) || void 0 === e ? void 0 : e.trial_end;
        if (!t) return 0;
        var i = 1e3 * t - 1e3 * Number((0, r.getServerTime)());
        return i <= 0 ? 0 : Math.floor(i / r.DAY)
      }
    },
    191800: (e, t, i) => {
      i.r(t), i.d(t, {
        getTrialDaysLeft: () => r.getTrialDaysLeft
      });
      var r = i(156017)
    },
    803218: (e, t, i) => {
      function r(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var i = 0, r = new Array(t); i < t; i++) r[i] = e[i];
        return r
      }

      function n(e, t, i) {
        return t in e ? Object.defineProperty(e, t, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = i, e
      }
      i.r(t), i.d(t, {
        getAllInitParams: () => u,
        getInitParam: () => o
      });
      var a = function() {
        var e, t, i = new URLSearchParams(window.location.search),
          n = {},
          a = !0,
          o = !1,
          u = void 0;
        try {
          for (var c, s = i.entries()[Symbol.iterator](); !(a = (c = s.next()).done); a = !0) {
            var l = (e = c.value, t = 2, function(e) {
                if (Array.isArray(e)) return e
              }(e) || function(e, t) {
                var i = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null != i) {
                  var r, n, a = [],
                    o = !0,
                    u = !1;
                  try {
                    for (i = i.call(e); !(o = (r = i.next()).done) && (a.push(r.value), !t || a.length !== t); o = !0);
                  } catch (e) {
                    u = !0, n = e
                  } finally {
                    try {
                      o || null == i.return || i.return()
                    } finally {
                      if (u) throw n
                    }
                  }
                  return a
                }
              }(e, t) || function(e, t) {
                if (e) {
                  if ("string" == typeof e) return r(e, t);
                  var i = Object.prototype.toString.call(e).slice(8, -1);
                  return "Object" === i && e.constructor && (i = e.constructor.name), "Map" === i || "Set" === i ? Array.from(i) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? r(e, t) : void 0
                }
              }(e, t) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
              }()),
              d = l[0],
              p = l[1];
            n[d] = p
          }
        } catch (e) {
          o = !0, u = e
        } finally {
          try {
            a || null == s.return || s.return()
          } finally {
            if (o) throw u
          }
        }
        return n
      }();

      function o(e) {
        return a[e]
      }

      function u() {
        return function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var i = null != arguments[t] ? arguments[t] : {},
              r = Object.keys(i);
            "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(i).filter((function(e) {
              return Object.getOwnPropertyDescriptor(i, e).enumerable
            })))), r.forEach((function(t) {
              n(e, t, i[t])
            }))
          }
          return e
        }({}, a)
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "98795267-e5e7-4506-a016-0d14c104c023", e._sentryDebugIdIdentifier = "sentry-dbid-98795267-e5e7-4506-a016-0d14c104c023")
    } catch (e) {}
  }();
//# sourceMappingURL=84330.72e5fb2baa5af1a0344c.js.map