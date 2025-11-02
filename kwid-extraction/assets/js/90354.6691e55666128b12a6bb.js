(window.webpackChunk = window.webpackChunk || []).push([
  [90354], {
    809228: e => {
      e.exports = function e(t, i, n) {
        function s(r, a) {
          if (!i[r]) {
            if (!t[r]) {
              if (o) return o(r, !0);
              var l = new Error("Cannot find module '" + r + "'");
              throw l.code = "MODULE_NOT_FOUND", l
            }
            var c = i[r] = {
              exports: {}
            };
            t[r][0].call(c.exports, (function(e) {
              return s(t[r][1][e] || e)
            }), c, c.exports, e, t, i, n)
          }
          return i[r].exports
        }
        for (var o = void 0, r = 0; r < n.length; r++) s(n[r]);
        return s
      }({
        1: [function(e, t, i) {
          var n = e("matches-selector");
          t.exports = function(e, t, i) {
            for (var s = i ? e : e.parentNode; s && s !== document;) {
              if (n(s, t)) return s;
              s = s.parentNode
            }
          }
        }, {
          "matches-selector": 5
        }],
        2: [function(e, t, i) {
          var n = e("closest");

          function s(e, t, i, s) {
            return function(i) {
              i.delegateTarget = n(i.target, t, !0), i.delegateTarget && s.call(e, i)
            }
          }
          t.exports = function(e, t, i, n, o) {
            var r = s.apply(this, arguments);
            return e.addEventListener(i, r, o), {
              destroy: function() {
                e.removeEventListener(i, r, o)
              }
            }
          }
        }, {
          closest: 1
        }],
        3: [function(e, t, i) {
          i.node = function(e) {
            return void 0 !== e && e instanceof HTMLElement && 1 === e.nodeType
          }, i.nodeList = function(e) {
            var t = Object.prototype.toString.call(e);
            return void 0 !== e && ("[object NodeList]" === t || "[object HTMLCollection]" === t) && "length" in e && (0 === e.length || i.node(e[0]))
          }, i.string = function(e) {
            return "string" == typeof e || e instanceof String
          }, i.fn = function(e) {
            return "[object Function]" === Object.prototype.toString.call(e)
          }
        }, {}],
        4: [function(e, t, i) {
          var n = e("./is"),
            s = e("delegate");
          t.exports = function(e, t, i) {
            if (!e && !t && !i) throw new Error("Missing required arguments");
            if (!n.string(t)) throw new TypeError("Second argument must be a String");
            if (!n.fn(i)) throw new TypeError("Third argument must be a Function");
            if (n.node(e)) return function(e, t, i) {
              return e.addEventListener(t, i), {
                destroy: function() {
                  e.removeEventListener(t, i)
                }
              }
            }(e, t, i);
            if (n.nodeList(e)) return function(e, t, i) {
              return Array.prototype.forEach.call(e, (function(e) {
                e.addEventListener(t, i)
              })), {
                destroy: function() {
                  Array.prototype.forEach.call(e, (function(e) {
                    e.removeEventListener(t, i)
                  }))
                }
              }
            }(e, t, i);
            if (n.string(e)) return function(e, t, i) {
              return s(document.body, e, t, i)
            }(e, t, i);
            throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
          }
        }, {
          "./is": 3,
          delegate: 2
        }],
        5: [function(e, t, i) {
          var n = Element.prototype,
            s = n.matchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector;
          t.exports = function(e, t) {
            if (s) return s.call(e, t);
            for (var i = e.parentNode.querySelectorAll(t), n = 0; n < i.length; ++n)
              if (i[n] == e) return !0;
            return !1
          }
        }, {}],
        6: [function(e, t, i) {
          t.exports = function(e) {
            var t;
            if ("INPUT" === e.nodeName || "TEXTAREA" === e.nodeName) e.focus(), e.setSelectionRange(0, e.value.length), t = e.value;
            else {
              e.hasAttribute("contenteditable") && e.focus();
              var i = window.getSelection(),
                n = document.createRange();
              n.selectNodeContents(e), i.removeAllRanges(), i.addRange(n), t = i.toString()
            }
            return t
          }
        }, {}],
        7: [function(e, t, i) {
          function n() {}
          n.prototype = {
            on: function(e, t, i) {
              var n = this.e || (this.e = {});
              return (n[e] || (n[e] = [])).push({
                fn: t,
                ctx: i
              }), this
            },
            once: function(e, t, i) {
              var n = this;

              function s() {
                n.off(e, s), t.apply(i, arguments)
              }
              return s._ = t, this.on(e, s, i)
            },
            emit: function(e) {
              for (var t = [].slice.call(arguments, 1), i = ((this.e || (this.e = {}))[e] || []).slice(), n = 0, s = i.length; n < s; n++) i[n].fn.apply(i[n].ctx, t);
              return this
            },
            off: function(e, t) {
              var i = this.e || (this.e = {}),
                n = i[e],
                s = [];
              if (n && t)
                for (var o = 0, r = n.length; o < r; o++) n[o].fn !== t && n[o].fn._ !== t && s.push(n[o]);
              return s.length ? i[e] = s : delete i[e], this
            }
          }, t.exports = n
        }, {}],
        8: [function(e, t, i) {
          ! function(n, s) {
            if (void 0 !== i) s(t, e("select"));
            else {
              var o = {
                exports: {}
              };
              s(o, n.select), n.clipboardAction = o.exports
            }
          }(this, (function(e, t) {
            "use strict";
            var i, n = (i = t) && i.__esModule ? i : {
              default: i
            };
            var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
              return typeof e
            } : function(e) {
              return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
            };
            var o = function() {
                function e(e, t) {
                  for (var i = 0; i < t.length; i++) {
                    var n = t[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                  }
                }
                return function(t, i, n) {
                  return i && e(t.prototype, i), n && e(t, n), t
                }
              }(),
              r = function() {
                function e(t) {
                  (function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                  })(this, e), this.resolveOptions(t), this.initSelection()
                }
                return e.prototype.resolveOptions = function() {
                  var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                  this.action = e.action, this.emitter = e.emitter, this.target = e.target, this.text = e.text, this.trigger = e.trigger, this.selectedText = ""
                }, e.prototype.initSelection = function() {
                  this.text ? this.selectFake() : this.target && this.selectTarget()
                }, e.prototype.selectFake = function() {
                  var e = this,
                    t = "rtl" == document.documentElement.getAttribute("dir");
                  this.removeFake(), this.fakeHandler = document.body.addEventListener("click", (function() {
                    return e.removeFake()
                  })), this.fakeElem = document.createElement("textarea"), this.fakeElem.style.fontSize = "12pt", this.fakeElem.style.border = "0", this.fakeElem.style.padding = "0", this.fakeElem.style.margin = "0", this.fakeElem.style.position = "fixed", this.fakeElem.style[t ? "right" : "left"] = "-9999px", this.fakeElem.style.top = (window.pageYOffset || document.documentElement.scrollTop) + "px", this.fakeElem.setAttribute("readonly", ""), this.fakeElem.value = this.text, document.body.appendChild(this.fakeElem), this.selectedText = (0, n.default)(this.fakeElem), this.copyText()
                }, e.prototype.removeFake = function() {
                  this.fakeHandler && (document.body.removeEventListener("click"), this.fakeHandler = null), this.fakeElem && (document.body.removeChild(this.fakeElem), this.fakeElem = null)
                }, e.prototype.selectTarget = function() {
                  this.selectedText = (0, n.default)(this.target), this.copyText()
                }, e.prototype.copyText = function() {
                  var e = void 0;
                  try {
                    e = document.execCommand(this.action)
                  } catch (t) {
                    e = !1
                  }
                  this.handleResult(e)
                }, e.prototype.handleResult = function(e) {
                  e ? this.emitter.emit("success", {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                  }) : this.emitter.emit("error", {
                    action: this.action,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                  })
                }, e.prototype.clearSelection = function() {
                  this.target && this.target.blur(), window.getSelection().removeAllRanges()
                }, e.prototype.destroy = function() {
                  this.removeFake()
                }, o(e, [{
                  key: "action",
                  set: function() {
                    var e = arguments.length <= 0 || void 0 === arguments[0] ? "copy" : arguments[0];
                    if (this._action = e, "copy" !== this._action && "cut" !== this._action) throw new Error('Invalid "action" value, use either "copy" or "cut"')
                  },
                  get: function() {
                    return this._action
                  }
                }, {
                  key: "target",
                  set: function(e) {
                    if (void 0 !== e) {
                      if (!e || "object" !== (void 0 === e ? "undefined" : s(e)) || 1 !== e.nodeType) throw new Error('Invalid "target" value, use a valid Element');
                      if ("copy" === this.action && e.hasAttribute("disabled")) throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                      if ("cut" === this.action && (e.hasAttribute("readonly") || e.hasAttribute("disabled"))) throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                      this._target = e
                    }
                  },
                  get: function() {
                    return this._target
                  }
                }]), e
              }();
            e.exports = r
          }))
        }, {
          select: 6
        }],
        9: [function(e, t, i) {
          ! function(n, s) {
            if (void 0 !== i) s(t, e("./clipboard-action"), e("tiny-emitter"), e("good-listener"));
            else {
              var o = {
                exports: {}
              };
              s(o, n.clipboardAction, n.tinyEmitter, n.goodListener), n.clipboard = o.exports
            }
          }(this, (function(e, t, i, n) {
            "use strict";
            var s = a(t),
              o = a(i),
              r = a(n);

            function a(e) {
              return e && e.__esModule ? e : {
                default: e
              }
            }
            var l = function(e) {
              function t(i, n) {
                ! function(e, t) {
                  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t);
                var s = function(e, t) {
                  if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                  return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, e.call(this));
                return s.resolveOptions(n), s.listenClick(i), s
              }
              return function(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                  constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                  }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
              }(t, e), t.prototype.resolveOptions = function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                this.action = "function" == typeof e.action ? e.action : this.defaultAction, this.target = "function" == typeof e.target ? e.target : this.defaultTarget, this.text = "function" == typeof e.text ? e.text : this.defaultText
              }, t.prototype.listenClick = function(e) {
                var t = this;
                this.listener = (0, r.default)(e, "click", (function(e) {
                  return t.onClick(e)
                }))
              }, t.prototype.onClick = function(e) {
                var t = e.delegateTarget || e.currentTarget;
                this.clipboardAction && (this.clipboardAction = null), this.clipboardAction = new s.default({
                  action: this.action(t),
                  target: this.target(t),
                  text: this.text(t),
                  trigger: t,
                  emitter: this
                })
              }, t.prototype.defaultAction = function(e) {
                return c("action", e)
              }, t.prototype.defaultTarget = function(e) {
                var t = c("target", e);
                if (t) return document.querySelector(t)
              }, t.prototype.defaultText = function(e) {
                return c("text", e)
              }, t.prototype.destroy = function() {
                this.listener.destroy(), this.clipboardAction && (this.clipboardAction.destroy(), this.clipboardAction = null)
              }, t
            }(o.default);

            function c(e, t) {
              var i = "data-clipboard-" + e;
              if (t.hasAttribute(i)) return t.getAttribute(i)
            }
            e.exports = l
          }))
        }, {
          "./clipboard-action": 8,
          "good-listener": 4,
          "tiny-emitter": 7
        }]
      }, {}, [9])(9);
      var t = "clipboard";
      window.define(t, (function() {
        var t = "undefined",
          i = typeof __webpack_exports__ === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof e === t ? void 0 : e.exports : __WEBPACK_AMD_DEFINE_RESULT__ : __webpack_exports__;
        return i && i.default || i
      })), window.require([t])
    },
    555989: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => u
      });
      var n = i(661533),
        s = i.n(n),
        o = i(629133),
        r = i.n(o),
        a = i(460159),
        l = i.n(a),
        c = i(313981),
        h = i(577486),
        d = i(526471);
      const u = c.default.extend({
        template: "/tmpl/controls/checkboxes_search/opening_list.twig",
        className: "checkboxes-search__opening-list hidden",
        events: {
          click: "_stopPropagation",
          "update:form:defaults": "updateFormDefaults"
        },
        _stopPropagation: function(e) {
          e.stopPropagation()
        },
        _selectors: function() {
          return {
            cb_inputs: "input:checkbox",
            cb_ch_inputs: "input:checked"
          }
        },
        initialize: function(e) {
          this.options = e || {}, this.applyClick = r().isFunction(e.applyClick) ? e.applyClick : r().noop, this.cancelClick = r().isFunction(e.cancelClick) ? e.cancelClick : r().noop, this.parrentClose = r().isFunction(e.parrentClose) ? e.parrentClose : r().noop, this.callbackHide = r().isFunction(e.callbackHide) ? e.callbackHide : r().noop, c.default.prototype.initialize.apply(this, arguments), this.options.el || this.render(), this.initForm(), this.initEvent()
        },
        initEvent: function() {
          this.$el.on("click".concat(this.ns), ".js-checkboxes-search-list-apply:not(.button-input-disabled)", r().bind(this.hide, this)).on("click".concat(this.ns), ".js-checkboxes-search-list-close", r().bind(this.close, this)).on("input".concat(this.ns), ".checkboxes-search__search-input", r().bind(this.search, this)).on("click".concat(this.ns), ".js-checkboxes-search-clear-all", r().bind(this.allChangeClear, this)).on("click".concat(this.ns), ".js-checkboxes-search-check-all", r().bind(this.allChangeCheck, this))
        },
        updateFormDefaults: function() {
          this.form.model.deepCloneDefaults(), this.form.checkChanges()
        },
        initForm: function() {
          this.form = this._addComponent(d.default.View, {
            el: this.$el,
            model: d.default.Model
          }), this.form.listenTo(this.form.model, "has_changes", r().bind(this.triggerButton, this, !0)).listenTo(this.form.model, "has_reverted", r().bind(this.triggerButton, this, !1))
        },
        close: function(e) {
          e.stopPropagation(), e.preventDefault(), this.form && this.form.revert(), this.cancelClick(), this.hide()
        },
        triggerButton: function(e) {
          this._triggerButton || (this._triggerButton = r().throttle(r().bind((function() {
            var t = this.$el.find("input:checkbox"),
              i = this.$el.find("input:checked"),
              n = this.form.model.defaults[this.options.name];
            e = r().isString(n) && !n.length || n && n.length === t.length ? t.length !== i.length && 0 !== i.length : !r().isEqual(this.form.model.attributes, this.form.model.defaults), this.$el.find(".js-checkboxes-search-list-apply").trigger("button:save:".concat(e ? "enable" : "disable"))
          }), this), 400)), r().isFunction(this._triggerButton) && this._triggerButton()
        },
        render: function() {
          return l()._preload([this.template], r().bind((function() {
            this.$el.html(l()({
              ref: this.template
            }).render(this.options))
          }), this))()
        },
        hide: function(e) {
          this.parrentClose(), e && this.applyClick(), this.$el.addClass("hidden").find(".checkboxes-search__search-input").val("").trigger("input"), this._findElem("cb_inputs").length === this._findElem("cb_ch_inputs").length && this._findElem("cb_inputs").attr("checked", !1), this._findElem("cb_inputs").trigger("change"), this._findElem("cb_ch_inputs").trigger("change"), this.form && "" === this.form.model.get(this.name) && this.form.revert(), this.updateFormDefaults(), this.callbackHide()
        },
        allChange: function(e) {
          this.$el.find("input:checkbox").prop("checked", !1), this.$el.find("input:checkbox").prop("checked", e).trigger("change")
        },
        allChangeClear: function() {
          this.allChange(!1)
        },
        allChangeCheck: function() {
          this.allChange(!0)
        },
        search: function(e) {
          var t = s()(e.currentTarget).val();
          this.$el.find(".checkboxes-search__item-label").each((function(e, i) {
            s()(i).toggleClass("hidden", r().isNull(s()(i).find(".element__text").text().toLowerCase().match(new h.UnsafeRegExp(t, "igm"))))
          }))
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this.$el.off(), this._destroyComponent(this.form), c.default.prototype.destroy.apply(this, t)
        }
      });
      var _ = "../build/transpiled/components/fields/checkboxes_search";
      window.define(_, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([_])
    },
    242284: (e, t, i) => {
      "use strict";
      i.r(t);
      var n = i(661533),
        s = i.n(n),
        o = i(629133),
        r = i.n(o),
        a = i(564638);

      function l() {
        switch (APP.data.current_entity) {
          case "events":
            return "#sidebar_events";
          case "settings-users":
            return "#user_right_aside";
          default:
            return "#sidebar"
        }
      }
      s()(document).off("click", ".aside-toggleable #sidebar_toggler, .js-aside_toggler").on("page:changed.filter", (function() {
        s()(l()).toggleClass("sidebar-expanded", !1), s()("#sidebar__right").toggleClass("sidebar-expanded", !1), s()("#sidebar_overlay, #filter_overlay").trigger("overlay:hide")
      })).on("click", ".filter-sidebar", (function() {
        s()("#sidebar__right").toggleClass("sidebar-expanded"), s()(".sidebar__button__close").css({
          "background-image": "none"
        }), s()(document.body).append(s()('<div class="default-overlay" id="filter_overlay"></div>')), s()("#filter_overlay").trigger("overlay:show")
      })).on("click", ".aside-toggleable #sidebar_toggler, .js-aside_toggler", (function() {
        var e = s()(l());
        if (e.toggleClass("sidebar-expanded"), e.hasClass("sidebar-expanded")) {
          var t = s()('<div class="default-overlay" id="sidebar_overlay"></div>');
          s()(document.body).append(t), t.trigger("overlay:show")
        } else s()("#sidebar_overlay").trigger("overlay:hide")
      })).on("click", ".sidebar__button__close, #filter_overlay", (function() {
        s()("#filter_overlay").trigger("overlay:hide"), s()("#sidebar__right").toggleClass("sidebar-expanded", !1)
      })).on("click", "#sidebar_overlay", (function() {
        s()("#sidebar_overlay").trigger("overlay:hide"), s()(l()).toggleClass("sidebar-expanded", !1)
      })), s()(window).on("resize", r().throttle((function() {
        var e, t = null !== (e = s()(window).width()) && void 0 !== e ? e : 0,
          i = s()(l());
        t > 1279 && i.hasClass("sidebar-expanded") && (s()("#sidebar_overlay").trigger("overlay:hide"), s()(l()).toggleClass("sidebar-expanded", !1))
      }), a.WINDOW_RESIZE_THROTTLE_DELAY));
      var c = "../build/transpiled/components/filter/common";
      window.define(c, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([c])
    },
    526471: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => p
      });
      var n, s = i(661533),
        o = i.n(s),
        r = i(629133),
        a = i.n(r),
        l = i(345839),
        c = i.n(l),
        h = i(729115),
        d = function(e) {
          return e && "object" == typeof e ? a().isString(e) ? String.prototype.slice.call(e) : a().isDate(e) ? new Date(e.valueOf()) : a().isFunction(e.clone) ? e.clone() : a().isArray(e) ? a().map(e, (function(e) {
            return d(e)
          })) : a().mapObject(e, (function(e) {
            return d(e)
          })) : e
        },
        u = (n = a().allKeys, !0, function(e) {
          var t, i, s, o, r, a, l = arguments.length;
          if (l < 2 || null === e) return e;
          for (t = 1; t < l; t++)
            for (a = (s = n(i = arguments[t])).length, r = 0; r < a; r++) void 0 !== e[o = s[r]] || (e[o] = d(i[o]));
          return e
        }),
        _ = h.default.Model.extend({
          initialize: function() {
            this.defaults = d(this.attributes)
          },
          setDefaults: function() {
            this.defaults = u(this.defaults, this.attributes)
          },
          updateDefaults: function() {
            this.defaults = o().extend(!0, {}, this.defaults, this.attributes)
          },
          set: function(e, t, i) {
            if ("statistic_select" !== e) return a().isObject(e) ? a().each(e, (function(t, i) {
              e[i] = n(t)
            })) : t = n(t), h.default.Model.prototype.set.call(this, e, t, i);

            function n(e) {
              return a().isArray(e) ? a()(e).sort() : e
            }
          },
          toJSON: function(e) {
            var t = c().Model.prototype.toJSON.call(this),
              i = {};
            return e = e || !1, a().isObject(e) ? (a().mapObject(e, (function(e, t) {
              var n = a().findKey(this.attributes, (function(e, i) {
                return -1 !== i.indexOf(t)
              }));
              i[n] = this.get(n), -1 !== t.indexOf("from") && (t = t.replace("from", "to"), i[t] = this.get(t))
            }), this), i) : t
          }
        });
      const p = {
        View: h.default.View.extend({
          _cached_form_html: null,
          destroy: function() {
            this.$(".pipeline-select-wrapper").off("filter:statuses:update"), this.remove(!1)
          },
          updateCache: function() {
            this._cached_form_html = this.$el.html()
          },
          revert: function() {
            this._cached_form_html && this.$el.html(this._cached_form_html), this.initModelFromForm(), this.model.trigger("filter:reinit"), this.model.trigger("has_reverted", {
              type: "has_reverted"
            })
          },
          initModelFromForm: function() {
            var e = this;
            this._cached_form_html = this.$el.html(), a().each(this.$(":input"), (function(e) {
              this.setModelValue(o()(e))
            }), this), this.model.deepCloneDefaults(), this.model.url || (this.model.url = this.$el.attr("action")), this.$(".pipeline-select-wrapper").on("filter:statuses:update", (function(t, i) {
              e.showLossReasonsInput(i.statuses), e.showUnsortedCategoriesInput(i.statuses)
            }))
          },
          setInputValue: function(e, t, i, n) {
            var s = e.attr("type");
            switch (n = n || {}, i = i || e.attr("name"), s) {
              case "checkbox":
              case "radio":
                e.prop("checked", t);
                break;
              default:
                e.val(t)
            }
            n.silent || e.trigger("change").trigger("controls:change"), this.setModelValue(e)
          },
          checkDeleted: function() {
            a().each(this.model.attributes, (function(e, t) {
              var i = this.$el.find(':input[name="'.concat(t, '"]:not(.js-form-changes-skip)')),
                n = [];
              i.length ? i.is(":checkbox") && a().isArray(e) && (n = i.map((function(e, t) {
                return t.value
              })).toArray(), this.model.attributes[t] = a().filter(e, (function(e) {
                return a().contains(n, e)
              }))) : delete this.model.attributes[t]
            }), this), this.checkChanges()
          },
          changeInModel: function(e, t) {
            this.setModelValue(o()(e.currentTarget), t), this.checkChanges()
          },
          setModelValue: function(e, t) {
            var i, n, s = e.attr("name"),
              o = this.model.get(s);
            if (t = t || {}, e.length && s && !e.hasClass("js-form-changes-skip") && !e.closest(".filter__custom_settings__item").is([".filter__custom_settings__item_unsorted-categories.hidden", ".filter__custom_settings__item_loss-reasons.hidden"].join(",")) && !e.attr("disabled")) {
              if ("checkbox" === e[0].type) {
                if (i = this.getInputValue(e), o) switch (a().isArray(o) || (o = [o]), i ? o.push(i) : (n = a().contains(o, e.val()) ? e.val() : !!a().contains(o, !0) || "on", o = a().without(o, n)), (i = a().sortBy(a().uniq(o), (function(e) {
                    return (e || "").toString()
                  }))).length) {
                  case 1:
                    i = i[0];
                    break;
                  case 0:
                    i = ""
                }
              } else i = this.getInputValue(e);
              "status" === e.attr("data-field_type") && (this.showLossReasonsInput(i), this.showUnsortedCategoriesInput(i)), this.model.set(s, i, {
                silent: t.base_form_silent || !1
              })
            }
          },
          setFormChanges: function(e, t) {
            t && t.is_called_inside_on_change && (this.model._changing = !1), this.model.set(e), t && !1 !== t.is_input_update_needed && a().each(e, (function(e, t) {
              this.setInputValue(this.$el.find('[name="'.concat(t, '"]')), e, t)
            }), this)
          },
          showUnsortedCategoriesInput: function(e) {
            var t = this.$el.find(".filter__custom_settings__item_unsorted-categories");
            e = (e = a().isArray(e) ? e : [e]).map((function(e) {
              return parseInt(e)
            })), e = a().intersection(e, Object.keys(APP.constant("unsorted_statuses")).map((function(e) {
              return parseInt(e)
            }))), a().isEmpty(e) ? t.hasClass("hidden") || (t.hasClass("glow") && this.model.unset("filter[unsorted_category][]"), t.addClass("hidden")) : t.removeClass("hidden")
          },
          showLossReasonsInput: function(e) {
            var t = this.$el.find(".filter__custom_settings__item_loss-reasons");
            e = a().isArray(e) ? e : [e], a().contains(e, "143") ? t.removeClass("hidden") : t.hasClass("hidden") || (t.hasClass("glow") && this.model.unset("filter[loss_reason_id][]"), t.addClass("hidden"))
          }
        }),
        Model: _
      };
      var f = "../build/transpiled/components/filter/form";
      window.define(f, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([f])
    },
    89758: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => y
      });
      var n, s, o = i(661533),
        r = i.n(o),
        a = i(629133),
        l = i.n(a),
        c = i(161320),
        h = i.n(c),
        d = i(323344),
        u = i(926168),
        _ = i(214558),
        p = (0, u.getLeadsWinlostStatuses)(),
        f = ["filter_date_from", "filter_date_to", "filter[date][from]", "filter[date][to]"],
        g = /^(filter\[(cf|custom_fields)\]\[\d+\]\[)(from|to)(])$/g,
        m = {
          leads: function() {
            var e = "",
              t = !(0, d.getQueryParam)("term") || this._searching,
              i = this.getFilterStatuses(t);
            return i.length && (e = this.sortFilter(i)), this.getDefaultFilterTagsLogic(e)
          },
          "leads-pipeline": function() {
            return m.leads.call(this)
          },
          customers: function() {
            return this.sortFilter([{
              name: "filter[segments_logic]",
              value: "and"
            }])
          },
          events: function() {
            return this.sortFilter([{
              name: "filter_date_switch",
              value: "created"
            }, {
              name: "filter[main_user][]",
              value: ""
            }])
          },
          dashboard: function() {
            return this.sortFilter([{
              name: "filter_date_switch",
              value: "created"
            }, {
              name: "filter[main_user][]",
              value: ""
            }])
          },
          todo: function() {
            var e = l().map(APP.constant("task_types"), (function(e) {
              return {
                name: "filter[task_type][]",
                value: e.id
              }
            }));
            return this.sortFilter(l().union([{
              name: "filter[task_type][]",
              value: "1"
            }, {
              name: "filter[task_type][]",
              value: "2"
            }, {
              name: "filter[status][]",
              value: "uncompl"
            }, {
              name: "filter[main_user][]",
              value: ((0, _.current)("id") || "").toString()
            }], e))
          },
          "todo-calendar": function() {
            return m.todo.call(this)
          },
          "todo-line": function() {
            return m.todo.call(this)
          },
          stats: function() {
            var e = [];
            switch (this.params._report_type) {
              case "winlost":
                e = APP.constant("default_filter") || [];
                break;
              case "consolidated":
                e = this.getFilterStatuses();
                break;
              case "goals":
                e = (e = e.concat(r().makeArray(this.$('[name="filter[group][]"]').map((function() {
                  return {
                    name: this.name,
                    value: this.value
                  }
                }))))).concat([{
                  name: "filter[month]",
                  value: (h()().month() + 1).toString()
                }, {
                  name: "filter[year]",
                  value: h()().year().toString()
                }])
            }
            return this.sortFilter(e)
          },
          "settings-users": function() {
            var e = [{
              name: "active[]",
              value: "Y"
            }];
            return this.params.is_all_preset_first && e.push({
              name: "active[]",
              value: "N"
            }), this.sortFilter(e)
          },
          statsCalls: function() {
            var e = [];
            return e = (e = (e = (e = e.concat(r().makeArray(this.$('[name="entity[]"]').map((function() {
              return {
                name: this.name,
                value: this.value
              }
            }))))).concat(r().makeArray(this.$('[name="filter[group_id][]"]').map((function() {
              return {
                name: this.name,
                value: this.value
              }
            }))))).concat(r().makeArray(this.$('[name="call_status[]"]').map((function() {
              return {
                name: this.name,
                value: this.value
              }
            }))))).concat(r().makeArray(this.$('[name="call_type[]"]').map((function() {
              return {
                name: this.name,
                value: this.value
              }
            })))), this.sortFilter(e)
          },
          files: function() {
            return this.sortFilter([{
              name: "filter[size][unit]",
              value: "1000000"
            }])
          },
          "files-trash": function() {
            return this.sortFilter([{
              name: "filter[size][unit]",
              value: "1000000"
            }])
          }
        },
        v = (n = {
          filter_date_switch: ["", "created", "on"],
          "filter[date_preset]": [""],
          "filter[main_contact][date_preset]": [""],
          "filter[company][date_preset]": [""],
          "filter[next_date][date_preset]": [""],
          fake: ["", "fake"],
          "filter[segments_logic]": "and",
          "filter[size][unit]": ["1", "1000", "1000000", "1000000000"]
        }, s = ["company", "main_contact"], l().each(n, (function(e, t) {
          l().each(s, (function(i) {
            n["filter[%s][%d]".replace("%s", i).replace("%d", t)] = e
          }))
        })), n["filter[date][type]"] = ["", "create", "on"], n["filter[tags_logic]"] = ["or"], n),
        b = {};
      const y = {
        getDefaultFilter: function() {
          var e = APP.data.current_entity,
            t = m[e],
            i = l().isFunction(t) ? t.call(this) : t;
          return b[e] = l().extend({}, v, (0, d.QStoJSON)(i)), i
        },
        filterDefaultValues: function(e, t, i) {
          var n = b[APP.data.current_entity],
            s = (i && n || v)[e];
          return !!s && (l().isArray(s) ? l().isArray(t) ? l().isEqual(s, t) : l().contains(s, t) : s === t)
        },
        filterDefaultsDatePresetCheck: function(e) {
          var t, i, n = !1;
          return l().contains(f, e) && (t = ["filter[date_preset]", "filter[date][date_preset]"], n = !0), e.match(g) && (t = [e.replace(g, "$1date_preset$4")], n = !0), !!n && (i = l().reduce(t, (function(e, t) {
            return e || (e = this.form.model.get(t)), e
          }), "", this), !l().isEmpty(i) && !this.filterDefaultValues(t, i))
        },
        getFilterStatuses: function() {
          var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          return r().makeArray(this.$('[name="filter[status_id][]"], [name^="filter[pipe]"]').filter((function() {
            return !e || !l().contains(p, parseInt(this.value))
          })).map((function() {
            return {
              name: this.name,
              value: this.value
            }
          })))
        },
        sortFilter: function(e) {
          return l().chain(e).map((function(e) {
            return "".concat(e.name, "=").concat(e.value)
          })).sortBy((function(e) {
            return e
          })).value().join("&")
        },
        getDefaultFilterTagsLogic: function(e) {
          var t = this.form.model.get("filter[tags_logic]") ? "filter[tags_logic]=or" : "";
          return e && t && (t = "&".concat(t)), (e || "") + t
        }
      };
      var k = "../build/transpiled/components/filter/mixins/defaults";
      window.define(k, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([k])
    },
    997150: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => a
      });
      var n = i(629133),
        s = i.n(n),
        o = i(210734),
        r = i(661533);
      const a = o.default.extend({
        controlClassName: "control-checkbox",
        _classes: function() {
          return {
            minus: "control-checkbox__helper_minus"
          }
        },
        _selectors: function() {
          return {
            input: 'input[type="checkbox"]',
            helper: ".control-checkbox__helper"
          }
        },
        events: {
          'change input[type="checkbox"]': "onChange",
          'controls:disable input[type="checkbox"]': "onDisable",
          'controls:checkbox:minus input[type="checkbox"]': "onChangeMinus"
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          var n = this.$el.hasClass("js-react-control");
          if (o.default.prototype.initialize.apply(this, t), n) return this.delegateEvents = function() {
            return this
          }, void(this.undelegateEvents = this.delegateEvents);
          this._hasClass("minus", "helper") && this.onChangeMinus(new r.Event({
            type: "controls:checkbox:minus"
          }), this._elem("input").prop("checked"))
        },
        onChange: function(e) {
          r(e.currentTarget).trigger("controls:change"), this.onChangeMinus(e, !1)
        },
        onDisable: function(e, t) {
          this._elem("input").get(0).disabled = !!s().isUndefined(t) || t
        },
        onChangeMinus: function(e, t, i) {
          var n = this._elem("input");
          !0 !== t && !0 !== i || n.prop("checked", t), n.prop("indeterminate", t), this._toggleClass("minus", "helper", t), this._updateIsChecked()
        },
        _updateIsChecked: function() {
          this.$el.toggleClass("is-checked", this._elem("input").prop("checked"))
        }
      });
      var l = "../build/transpiled/interface/controls/checkbox";
      window.define(l, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([l])
    },
    447366: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => h
      });
      var n = i(629133),
        s = i.n(n),
        o = i(445368),
        r = i(969109),
        a = i(174568),
        l = i(210734),
        c = i(661533);
      i(368439), i(997150);
      const h = l.default.extend({
        controlClassName: "js-control-checkboxes_dropdown",
        max_title_elems: 5,
        $navigationCursor: null,
        _debouncedRecalcSearchResult: null,
        _navItemChangeLocker: (0, r.makeLocker)(10),
        _expanded: !1,
        _classes: function() {
          return {
            checkboxes_index: "checkboxes_dropdown_index",
            checked_dropdown: "is_checked_dropdown",
            checked: "icon-checkbox-checked",
            icon_checkbox: "icon-checkbox",
            minus: "icon-check-minus",
            up_arrow: "icon-up-arrow",
            expanded: "expanded",
            icon: "icon-v-ico-2",
            dropdown_list_all_items_hidden: "checkboxes_dropdown__list--all_items_hidden",
            cursor_item: "checkboxes_dropdown__item--cursor"
          }
        },
        _selectors: function() {
          return {
            master_checkbox: ".js-master-checkbox",
            item_checkbox: ".js-item-checkbox",
            title_wrapper: ".checkboxes_dropdown__title_wrapper",
            checkboxes_list: ".checkboxes_dropdown__list",
            checkboxes_icon: ".checkboxes_dropdown_icon",
            dropdown_item: ".checkboxes_dropdown__item",
            master_dropdown_item: ".checkboxes_dropdown__item:has(input.js-master-checkbox)",
            counter: ".checkboxes_dropdown__selected",
            control_checkbox: ".control-checkbox",
            title: ".checkboxes_dropdown__title",
            checkboxes_checked: ".js-item-checkbox:not(.js-master-checkbox):checked",
            checkboxes: ".js-item-checkbox:not(.js-master-checkbox):not([readonly])",
            select_all_text: ".js-select-all-text",
            search_input: ".checkboxes_dropdown__search-input"
          }
        },
        events: {
          "click .js-master-checkbox": "onClickMasterCheckbox",
          "controls:change .js-item-checkbox": "setTitle",
          "controls:view:init .js-master-checkbox-wrapper": "_updateMasterCheckboxesOnInit",
          "click .checkboxes_dropdown__title_wrapper:not(.js-checkboxes_dropdown_disabled)": "onClickTitle",
          "click .checkboxes_dropdown__item": "stopPropagation",
          "click .checkboxes_dropdown__search-wrapper": "stopPropagation",
          "click .checkboxes_dropdown__search-clear-button": "resetSearchPrompt",
          "input .checkboxes_dropdown__search-input": "handleInputSearch",
          "mouseenter .checkboxes_dropdown__item": "handleDropdownItemMouseEnter",
          keydown: "handleDropdownKeydown"
        },
        document_events: function() {
          return {
            "controls:hide:private": "_onControlsHide"
          }
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          var n = this.$el.hasClass("js-react-control");
          if (this._debouncedRecalcSearchResult = s().debounce(s().bind(this._recalcSearchResult, this), 150), l.default.prototype.initialize.apply(this, t), n) return this.delegateEvents = function() {
            return this
          }, void(this.undelegateEvents = this.delegateEvents);
          this._disable_to_top_mode = "Y" === this.$el.attr("data-disable-to-top-mode"), this.setTitle(), this.onKeyDownDocument = s().bind(this.onKeyDownDocument, this)
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this.destroyForShownStateListeners(), l.default.prototype.destroy.apply(this, t)
        },
        destroyForShownStateListeners: function() {
          this._$document.off("keydown", this.onKeyDownDocument)
        },
        setForShownStateListeners: function() {
          this._$document.on("keydown", this.onKeyDownDocument)
        },
        _onControlsHide: function(e) {
          this.el !== e.target && this._hide()
        },
        _hide: function() {
          this._expanded && (this._expanded = !1, this.$el.removeClass(this._class("checkboxes_index")).removeClass(this._class("expanded")), this._findElem("checkboxes_list").trigger("controls:checkboxes_dropdown:hide").trigger({
            type: "controls:hide",
            target: this.el
          }), this.$el.find(this._selector("checkboxes_icon")).removeClass(this._class("up_arrow")).addClass(this._class("icon")), this._onHide())
        },
        _$getSearchInputEl: function() {
          return this._elem("search_input")
        },
        _getItemValue: function(e) {
          var t = e.data("value");
          return s().isUndefined(t) ? t : String(t)
        },
        changeItemsVisibilityByTerm: function(e) {
          var t = this._elem("dropdown_item"),
            i = (0, a.createFuzzySearch)(e),
            n = !1,
            s = this;
          t.each((function() {
            var e = c(this),
              t = s._getItemValue(e);
            i(t) ? (e.show(), n = !0) : e.hide()
          }));
          var o = this._elem("master_dropdown_item"),
            r = this._elem("checkboxes_list");
          n ? (o.show(), r.removeClass(this._class("dropdown_list_all_items_hidden"))) : (o.hide(), r.addClass(this._class("dropdown_list_all_items_hidden")))
        },
        _recalcSearchResult: function(e) {
          this.changeItemsVisibilityByTerm(e), this._actualizeNavigationCursor()
        },
        scrollToNavigationCursor: function() {
          var e, t;
          null === (t = this.$navigationCursor) || void 0 === t || null === (e = t.get(0)) || void 0 === e || e.scrollIntoView({
            block: "nearest"
          })
        },
        _setNavigationCursor: function(e) {
          var t, i, n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
          this._navItemChangeLocker.checkIsLocked() || (null === (t = this.$navigationCursor) || void 0 === t || t.removeClass(this._class("cursor_item")), this.$navigationCursor = e, null === (i = this.$navigationCursor) || void 0 === i || i.addClass(this._class("cursor_item")), n && this.scrollToNavigationCursor())
        },
        _calcNavigationCursor: function() {
          var e, t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          if (null === (e = this.$navigationCursor) || void 0 === e ? void 0 : e.get(0)) {
            var i = t ? this.$navigationCursor.nextAll(":visible").first() : this.$navigationCursor.prevAll(":visible").first();
            if (!i || 0 === i.length) return this._setNavigationCursor(null), this._calcNavigationCursor(t);
            this._setNavigationCursor(i)
          } else {
            var n = this._elem("dropdown_item").filter(":visible");
            this._setNavigationCursor(t ? n.first() : n.last())
          }
        },
        _actualizeNavigationCursor: function() {
          this.$navigationCursor && (this.$navigationCursor.is(":visible") ? this.scrollToNavigationCursor() : (this._setNavigationCursor(null), this._calcNavigationCursor()))
        },
        _selectNavigationCursorCheckbox: function() {
          var e;
          this.$navigationCursor && (null === (e = this.$navigationCursor.find("input")) || void 0 === e || e.prop("checked", (function(e, t) {
            return !t
          })).trigger("controls:change"), this.$navigationCursor.find("input").is(".js-master-checkbox") && this.toggleMasterCheckbox())
        },
        onClickTitle: function(e) {
          var t, i, n = this._elem("checkboxes_list"),
            s = this._elem("checkboxes_icon");
          this._expanded ? this._hide() : (s.hasClass(this._class("icon")) && (this._$document.trigger("keyboard:hide").trigger({
            type: "controls:hide",
            target: this.el
          }), n.trigger("controls:checkboxes_dropdown:open"), s.removeClass(this._class("icon")).addClass(this._class("up_arrow")), this.$el.addClass(this._class("expanded")).addClass(this._class("checkboxes_index")), i = this.$el.offset().top + this.$el.height() + n.height() + 60, t = !this._disable_to_top_mode && this._$document.height() < i, n.toggleClass("checkboxes_dropdown__expanded-to-top", t), t && n.height() > this.$el.offset().top && n.css("max-height", this.$el.offset().top), this._expanded = !0, this._onShow()), e.stopPropagation(), e.preventDefault())
        },
        handleInputSearch: function(e) {
          var t, i = e.target.value;
          null === (t = this._debouncedRecalcSearchResult) || void 0 === t || t.call(this, i)
        },
        handleDropdownItemMouseEnter: function(e) {
          var t = e.currentTarget;
          this._setNavigationCursor(t ? c(t) : null, !1)
        },
        handleDropdownKeydown: function(e) {
          var t = !0;
          switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
              this._calcNavigationCursor("ArrowDown" === e.key), this._navItemChangeLocker.lock();
              break;
            case "Enter":
              this._selectNavigationCursorCheckbox(), this.stopPropagation(e);
              break;
            case " ":
              var i = this._$getSearchInputEl();
              if (i.is(":focus") && i.val().trim().length > 0 || !this.$navigationCursor) return;
              this._selectNavigationCursorCheckbox();
              break;
            default:
              t = !1
          }
          t && e.preventDefault()
        },
        onKeyDownDocument: function(e) {
          var t = e.target,
            i = this._elem("checkboxes_list").get(0);
          (i === t || i.contains(t)) && this._$getSearchInputEl().focus()
        },
        _onHide: function() {
          this.resetSearchPrompt(), this.destroyForShownStateListeners(), this._setNavigationCursor(null)
        },
        _onShow: function() {
          this._$getSearchInputEl().focus(), this.setForShownStateListeners(), this._calcNavigationCursor()
        },
        stopPropagation: function(e) {
          e.stopPropagation()
        },
        onClickMasterCheckbox: function(e) {
          this.toggleMasterCheckbox(), e.stopPropagation()
        },
        toggleMasterCheckbox: function() {
          var e = this._elem("master_checkbox"),
            t = e.prop("checked");
          this._$document.trigger("keyboard:hide").trigger({
            type: "controls:hide",
            target: this.el
          }), this._elem("checkboxes").prop("checked", t).trigger("change"), e.trigger("change")
        },
        resetSearchPrompt: function() {
          this._$getSearchInputEl().val("").focus(), this._recalcSearchResult("")
        },
        _updateMasterCheckboxesOnInit: function() {
          this._updateMasterMinus()
        },
        _getCheckboxesChecked: function(e) {
          var t = this;
          return e = e || this._findElem("checkboxes_checked"), c.makeArray(e.map((function() {
            var e = c(this).closest(t._selector("control_checkbox")).text().trim();
            return s().escape(e)
          })))
        },
        setTitle: function() {
          var e = this._findElem("checkboxes"),
            t = this._findElem("checkboxes_checked");
          this._updateMasterMinus(t, e), this._setTitle(t, e)
        },
        _setTitle: function(e, t) {
          var i = this._getCheckboxesChecked(e),
            n = this._elem("title").attr("data-title-empty"),
            r = this._elem("title").attr("data-numeral"),
            a = !!this._elem("title").attr("data-custom-title"),
            l = i.length - this.max_title_elems,
            c = s().first(i, this.max_title_elems);
          e.length && e.length !== t.length ? i.length > this.max_title_elems && c.push((0, o.i18n)("N more").replace("%s", l)) : c = !e.length && n || a ? [n] : ["".concat((0, o.i18n)("all"), " ").concat((0, o.numeralWord)("all", r) || "")], this._updateTitle(c)
        },
        _updateTitle: function(e) {
          var t = this._elem("title").find("[data-title-before]").attr("data-title-before") || "";
          this._elem("title").html(s().map(e, (function(e, i) {
            var n = i ? "" : 'data-title-before="'.concat(t ? "".concat(t.trim(), " ") : "", '"');
            return '<div class="checkboxes_dropdown__title-item" '.concat(n, ">").concat(e.trim(), "</div>")
          }), this).join(""))
        },
        _updateMasterMinus: function(e, t) {
          var i = !1,
            n = (0, o.i18n)("Select all");
          t = t || this._findElem("checkboxes"), (e = e || this._findElem("checkboxes_checked")).length && (e.length !== t.length && (i = !0), n = (0, o.i18n)("Select none")), this._elem("master_checkbox").prop("checked", 0 !== e.length).trigger("controls:checkbox:minus", [i]), this._elem("select_all_text").text(n)
        }
      });
      var d = "../build/transpiled/interface/controls/checkboxes_dropdown/index";
      window.define(d, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([d])
    },
    709984: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => c
      });
      var n = i(661533),
        s = i.n(n),
        o = i(629133),
        r = i.n(o),
        a = i(210734),
        l = !1;
      const c = a.default.extend({
        controlClassName: "js-control-pipeline-select",
        _selectors: function() {
          return {
            wrapper: ".pipeline-select-wrapper_plain",
            inner: ".pipeline-select-wrapper__inner_plain",
            holder: ".pipeline-select-wrapper__inner__holder",
            container: ".pipeline-select-wrapper__inner__container",
            item: ".pipeline-select__dropdown__item",
            pipeline: ".pipeline-select",
            pipeline_radio: ".pipeline-select__pipeline-input",
            pipeline_caption: ".pipeline-select__caption",
            pipeline_caption_inner: ".pipeline-select__caption__inner",
            pipeline_caption_text: ".pipeline-select__caption-text",
            pipeline_selected: ".pipeline-select__pipeline-selected",
            pipeline_checkbox: '.pipeline-select__caption input[type="checkbox"]',
            pipeline_checkbox_by_value: '.pipeline-select__caption input[type="checkbox"][value="%s"]',
            status_radio: ".pipeline-select__dropdown__item__input",
            status_checkbox: '.pipeline-select__dropdown__item__label input[type="checkbox"]',
            status_checkbox_by_value: '.pipeline-select__dropdown__item__label input[type="checkbox"][value="%s"]'
          }
        },
        _classes: function() {
          return {
            showed: "pipeline-select-showed",
            item_selected: "pipeline-select__dropdown__item_selected"
          }
        },
        document_events: function() {
          var e = {};
          return e["click ".concat(this._selector("showed"), " ").concat(this._selector("inner"), " ").concat(this._selector("container"))] = "stopPropagationOnClickInside", e["controls:change:visual ".concat(this._selector("inner"), " ").concat(this._selector("status_radio"))] = "onStatusChange", e["change ".concat(this._selector("inner"), " ").concat(this._selector("status_radio"))] = "onStatusChange", e["change ".concat(this._selector("inner"), " ").concat(this._selector("pipeline_radio"))] = "onPipelineChange", e["keydown body".concat(this._selector("showed"))] = "hideOnEscape", e["click ".concat(this._selector("inner"), ", ").concat(this._selector("item_selected"))] = "_hideSelect", e["controls:hide:private"] = "onControlsHide", e["page:change:start page:change:stop"] = "_hideSelect", e["control:select:reset"] = "_resetSelect", e
        },
        events: function() {
          var e = {};
          return e["click ".concat(this._selector("holder"))] = "openOnClick", e["pipeline-select:open"] = "open", r().extend({}, r().result(a.default.prototype, "events", {}), e)
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          a.default.prototype.initialize.apply(this, t), this._$window.on("resize".concat(this.ns), r().bind(this._reposition, this)), this._left_menu_width = s()("#left_menu").width()
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this._hideSelect(), a.default.prototype.destroy.apply(this, t)
        },
        onControlsHide: function(e) {
          e.target !== this.el && this._hideSelect()
        },
        openOnClick: function(e) {
          e.stopPropagation(), this.open()
        },
        open: function() {
          !l && this._isHidden() && (this._$document.trigger({
            type: "controls:hide",
            target: this.$el
          }), this._$inner = this.$el.children(this._selector("inner")), this._$body.addClass(this._class("showed")).append(this._$inner), this._$inner.addClass("active"), this.$el.removeClass("folded"), this._reposition(), this._captionCentrify(this._$inner.find("".concat(this._selector("pipeline_radio"), "[checked] + ").concat(this._selector("pipeline")))), this._$overlay = s()('<div class="default-overlay pipeline-select-overlay" id="pipeline_select_overlay"></div>'), this._$inner.append(this._$overlay), this.$el.focus(), this._$overlay.trigger("overlay:show"), this._afterOpen())
        },
        hideOnEscape: function(e) {
          27 === e.keyCode && (e.stopPropagation(), e.preventDefault(), this._hideSelect())
        },
        stopPropagationOnClickInside: function(e) {
          e.stopPropagation()
        },
        onStatusChange: function(e) {
          var t = s()(e.currentTarget);
          if (!e.isTrigger && this._$inner && s().contains(this._$inner.get(0), t.get(0))) {
            var i = t.closest(this._selector("holder"));
            i.find("".concat(this._selector("status_radio"), "[checked]")).removeAttr("checked"), i.find(this._selector("item")).removeClass(this._class("item_selected"));
            var n = i.find(this._selector("pipeline_radio")).filter((function(e, t) {
              return s()(t).attr("checked") || s()(t).prop("checked")
            }));
            i.find(this._selector("pipeline_selected")).val(n.val()), this._hideSelect()
          }
        },
        onPipelineChange: function(e) {
          var t = s()(e.currentTarget);
          if (!e._is_trigger && this._$inner && s().contains(this._$inner.get(0), t.get(0))) {
            var i = t.closest(this._selector("holder"));
            e.stopPropagation(), this._captionCentrify(t.next(this._selector("pipeline"))), i.find(this._selector("pipeline_radio")).not(t).removeProp("checked").removeAttr("checked"), "unsorted" !== t.attr("data-type") && "y" !== t.attr("data-is-custom") || t.next().find("input").trigger("click")
          }
        },
        _reposition: function() {
          if (!this._isHidden()) {
            var e = this.$el.offset(),
              t = this._$window.scrollTop();
            this._$inner.children(this._selector("holder")).css({
              left: e.left - this._left_menu_width,
              top: e.top - t,
              paddingBottom: this._$window.height() - (e.top + this.$el.height() + 9) + t,
              width: this.$el.width()
            })
          }
        },
        _captionCentrify: function(e) {
          var t = e.children(this._selector("pipeline_caption")),
            i = e.closest(this._selector("holder")).find(this._selector("pipeline")).index(e[0]);
          this._$inner.scrollTop(i * (t[0].offsetHeight + 5))
        },
        _isHidden: function() {
          return this.$el.is(".folded")
        },
        _hideSelect: function(e) {
          var t = this.$el;
          if (!this._isHidden()) {
            e && "click" === e.type && e.stopPropagation(), this.$el.append(this._$inner);
            var i = this._findElem("holder"),
              n = this._elem("pipeline_radio"),
              o = this._findElem("pipeline_selected"),
              a = o.val();
            a || (a = this.$("".concat(this._selector("pipeline_radio"), ":first")).val()), t.addClass("folded"), i.attr("style", ""), this._$overlay.trigger("overlay:hide", {
              instantly: !0
            }), n.removeProp("checked").removeAttr("checked").each((function() {
              var e = s()(this);
              e.val().toString() === a.toString() && e.prop("checked", !0).attr("checked", "checked").trigger({
                type: "change",
                _is_trigger: !0
              })
            })), o.trigger("change"), this._$body.children(this._selector("inner")).length || this._$body.removeClass(this._class("showed")), this._afterHide(), this._$inner.removeClass("active"), this._$inner = null, l = !0, r().delay((function() {
              l = !1
            }), 300)
          }
        },
        _afterOpen: function() {
          this.$el.trigger("controls:pipeline-select:open")
        },
        _afterHide: function() {
          this.$el.trigger("controls:pipeline-select:hide"), this.$("".concat(this._selector("status_radio"), ":checked")).trigger("change").closest(this._selector("item")).addClass(this._class("item_selected"))
        },
        _resetSelect: function() {
          var e = parseInt(this.$el.find('input[name="lead[PIPELINE_ID]"]').val() || 0),
            t = 'input[name="lead[STATUS]"]';
          e && (t += ":checked");
          var i = parseInt(this.$el.find(t).val() || 0);
          this._findElem("item").removeClass(this._class("item_selected")), this._findElem("pipeline_radio").removeAttr("checked").closest('[value="'.concat(e, '"]')).attr("checked", "checked").find('input[name="lead[STATUS]"][value="'.concat(i, '"]')).closest(this._selector("item")).addClass(this._class("item_selected"))
        }
      });
      var h = "../build/transpiled/interface/controls/pipeline_select/index";
      window.define(h, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([h])
    },
    313445: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => h
      });
      var n = i(661533),
        s = i.n(n),
        o = i(629133),
        r = i.n(o),
        a = i(445368),
        l = i(709984);

      function c(e, t) {
        var i = this._$inner ? this._$inner.get(0) : this.el;
        !r().isUndefined(i) && s().contains(i, t.currentTarget) && e.call(this, t)
      }
      const h = l.default.extend({
        controlClassName: "js-control-pipeline-select_multiple",
        document_events: function() {
          var e = {};
          return e["change ".concat(this._selector("inner"), " ").concat(this._selector("pipeline_checkbox"))] = r().bind(c, this, this.onCheckAllPipelineStatuses), e["controls:change:visual ".concat(this._selector("inner"), " ").concat(this._selector("status_checkbox"))] = r().bind(c, this, this.onStatusCheckboxChange), e["change ".concat(this._selector("inner"), " ").concat(this._selector("status_checkbox"))] = r().bind(c, this, this.onStatusCheckboxChange), r().extend({}, r().result(l.default.prototype, "document_events", {}), e)
        },
        events: function() {
          return r().extend({}, r().result(l.default.prototype, "events", {}), {
            "controls:initDefaultStatuses": "_updateFoldedCaption"
          })
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          l.default.prototype.initialize.apply(this, t), this._updateFoldedCaptionThrottled = r().throttle(this._updateFoldedCaption, 200), this._updateFoldedCaption()
        },
        onCheckAllPipelineStatuses: function(e) {
          var t = s()(e.currentTarget),
            i = t.get(0).checked;
          i || t.trigger("controls:checkbox:minus", [!1]), e.isTrigger || t.closest(this._selector("pipeline")).find(this._selector("status_checkbox")).each((function() {
            this.disabled || (this.checked = i)
          }))
        },
        onStatusCheckboxChange: function(e) {
          var t = s()(e.currentTarget).closest(this._selector("pipeline")),
            i = t.find(this._selector("status_checkbox")),
            n = t.find(this._selector("pipeline_checkbox"));
          switch (n.trigger("controls:checkbox:minus", [!1]), i.filter((function() {
              return this.checked
            })).length) {
            case i.length:
              n[0].checked = !0;
              break;
            case 0:
              n[0].checked = !1;
              break;
            default:
              n.trigger("controls:checkbox:minus", [!0])
          }
          this._updateFoldedCaptionThrottled()
        },
        _updateFoldedCaption: function() {
          var e = (this._$inner || this.$el.children(this._selector("inner"))).find(this._selector("holder")),
            t = e.find(this._selector("pipeline_caption_text")),
            i = this._getStatusesChecked(e),
            n = this._getPipelinesChecked(e);
          this.empty_caption = 0 !== i && 0 !== n, this.empty_caption ? t.attr("data-folded-title", this._getFilledMultipleTitle(t, i, n)) : t.attr("data-folded-title", this._getDefaultMultipleTitle())
        },
        _getFilledMultipleTitle: function(e, t, i) {
          var n = [],
            s = "";
          return t = r().isNaN(parseInt(t)) ? 0 : parseInt(t), s = -1 === (i = r().isNaN(parseInt(i)) ? 0 : parseInt(i)) ? this._getCorrectAllLangValue() : i, s += " ".concat((0, a.numeralWord)(r().contains([-1, 0], i) ? "," : i, e.attr("data-pipelines-numeral") || (0, a.i18n)("pipeline,pipelines"))), 1 !== i && n.push(s), s = -1 === t ? this._getCorrectAllLangValue() : t, s += " ".concat((0, a.numeralWord)(r().contains([-1, 0], t) ? "all" : t, e.attr("data-statuses-numeral") || (0, a.i18n)("stage,stages"))), n.push(s), n.join(", ")
        },
        _getCorrectAllLangValue: function() {
          return APP.lang.all
        },
        _getDefaultMultipleTitle: function() {
          return (0, a.capitalize)([(0, a.numeralWord)("all", (0, a.i18n)("pipeline,pipelines")), (0, a.numeralWord)("all", (0, a.i18n)("stage,stages"))].join(", ").toLowerCase())
        },
        _getStatusesChecked: function(e) {
          var t, i = e.find(this._selector("status_checkbox")),
            n = [];
          return (t = i.filter((function() {
            var e = this.checked;
            return e && n.push(s()(this).attr("value")), e
          })).length) === i.length && (t = -1), this.$el.trigger("filter:statuses:update", {
            statuses: n
          }), t
        },
        _getPipelinesChecked: function(e) {
          var t = e.find(this._selector("pipeline_checkbox")),
            i = t.filter((function() {
              return this.checked
            })).length;
          return t.length > 1 && i === t.length && (i = -1), i
        },
        _makeFingerPrint: function() {
          var e = {};
          return this.$(this._selector("status_checkbox")).each((function(t, i) {
            var n = i.getAttribute("name");
            e[n] || (e[n] = []), e[n].push([i.value, i.checked].join("_"))
          })), e
        },
        open: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this._finger_print = this._makeFingerPrint(), l.default.prototype.open.apply(this, t)
        },
        _afterHide: function() {
          var e = r().chain(this._makeFingerPrint()).reduce((function(e, t, i) {
            return r().union(e, r().map(r().difference(t, this._finger_print[i]), (function(e) {
              return e.split("_")[0]
            })))
          }), [], this).unique().value();
          r().each(e, (function(e) {
            this._findElem("status_checkbox_by_value", e).trigger("change")
          }), this), this.$el.trigger("controls:pipeline-select:hide")
        }
      });
      var d = "../build/transpiled/interface/controls/pipeline_select/multiple";
      window.define(d, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([d])
    },
    349384: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => r
      });
      var n = i(629133),
        s = i.n(n),
        o = i(7107);
      const r = o.default.extend({
        controlClassName: null,
        events: function() {
          var e = s().result(o.default.prototype, "events", {});
          return delete e["mousedown ".concat(this._selector("item"))], delete e["touchstart ".concat(this._selector("item"))], delete e["click ".concat(this._selector("item"))], e
        },
        _elem: function(e) {
          var t = o.default.prototype._elem.apply(this, arguments);
          return "list" === e && this._$list ? this._$list : t
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          o.default.prototype.initialize.apply(this, t), this._$list = this._elem("list"), this._$list.on("mousedown", this._selector("item"), s().bind(this.onItemDownPressed, this)).on("touchstart", this._selector("item"), s().bind(this.onItemDownPressed, this)).on("click", this._selector("item"), s().bind(this.onItemClick, this))
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this._$list.off(), o.default.prototype.destroy.apply(this, t)
        },
        hide: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          s().isFunction(this._hideBodyOverlay) && (this._hideBodyOverlay(), this._hideBodyOverlay = null), o.default.prototype.hide.apply(this, t)
        },
        open: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          var n = this.el.getBoundingClientRect(),
            s = n.width,
            r = n.top,
            a = n.left;
          o.default.prototype.open.apply(this, t), this._hideBodyOverlay = this._toggleBodyOverlay(this._elem("list")), this.$el.hasClass("control--select--transparent") && (r -= 8, a -= 23), this._elem("list").css({
            position: "fixed",
            zIndex: 1e3,
            top: r,
            left: a,
            width: this._$list.hasClass("control--select--list--auto-width") ? "" : s,
            bottom: "unset"
          }), this._elem("list").visible() || this._elem("list").css({
            top: "unset",
            bottom: window.innerHeight - n.bottom
          }), this._scrollToLi(this._elem("list").find(this._selector("item_selected")).addClass(this._class("item_key_selected")))
        }
      })
    },
    7107: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => l
      });
      var n = i(661533),
        s = i.n(n),
        o = i(629133),
        r = i.n(o),
        a = i(210734);
      s()(document).on("click", ".control--select--list--item", (function(e) {
        e.stopPropagation()
      })).on("change controls:change", ".control--select--input", (function(e) {
        e.target.setAttribute("data-change-on-init", !0)
      }));
      const l = a.default.extend({
        _classes: function() {
          return {
            list_opened: "control--select--list-opened",
            list_closed: "control--select--list",
            list_to_top: "control--select--list-to-top",
            button: "control--select--button",
            button_inner: "control--select--button-inner",
            item: "control--select--list--item",
            item_selected: "control--select--list--item-selected",
            item_key_selected: "control--select--list--item-key_selected",
            item_default: "control--select--list--item-default",
            input: "control--select--input"
          }
        },
        _selectors: function() {
          return {
            list: "ul",
            item_by_value: '.control--select--list--item[data-value="%s"]'
          }
        },
        events: function() {
          var e = {};
          return e["click ".concat(this._selector("button"))] = "onButtonOpenedClick", e["keydown ".concat(this._selector("button"))] = "onButtonKeydown", e["controls:change ".concat(this._selector("input"))] = "onInputChange", e["controls:change:visual ".concat(this._selector("input"))] = "onInputChange", e["mousedown ".concat(this._selector("item"))] = "onItemDownPressed", e["touchstart ".concat(this._selector("item"))] = "onItemDownPressed", e["click ".concat(this._selector("item"))] = "onItemClick", e
        },
        document_events: {
          "controls:hide:private": "hide"
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this._mouse_down = !1, this._opened = this._elem("list").hasClass(this._class("list_opened")), this._makeButtonBlurable(!0), this._elem("input").length && this._elem("input")[0].getAttribute("data-change-on-init") && (this._elem("input")[0].removeAttribute("data-change-on-init"), this.onInputChange(new(s().Event)("controls:change"))), a.default.prototype.initialize.apply(this, t)
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this._makeButtonBlurable(!1), a.default.prototype.destroy.apply(this, t)
        },
        onButtonOpenedClick: function(e) {
          e.stopPropagation(), e.preventDefault(), this.open()
        },
        onButtonOpenerBlur: function() {
          this._mouse_down && this._opened ? setTimeout(r().bind(this.hide, this), 250) : this.hide(), this._mouse_down = !1
        },
        onButtonKeydown: function(e) {
          var t = this.hotkey(e.keyCode);
          this._opened && r().isFunction(t) && t.call(this, e)
        },
        onItemDownPressed: function(e) {
          s()(e.currentTarget).attr("data-disabled") || (this._mouse_down = !0)
        },
        onInputChange: function(e) {
          var t, i = (this._elem("input").val() || "").toString(),
            n = this._elem("list").find(this._selector("item_by_value", i));
          n.length || (n = this._elem("list").find(this._selector("item_by_value", i.replace("+", " ")))), this._elem("list").find(this._selector("item_selected")).removeClass(this._class("item_selected")), n.length ? t = n : ((t = this._elem("list").find(this._selector("item_default"))).length || (t = this._elem("list").find("".concat(this._selector("item"), ":first"))), this._elem("input").val(t.attr("data-value"))), t.addClass(this._class("item_selected"));
          var s = t.attr("data-bg-color");
          this._elem("button").css("background", s || "").toggleClass("control--select--button-colored", !!s).attr("data-value", t.attr("data-value")).children(this._selector("button_inner")).text(t.text()), "controls:change:visual" !== e.type && this._elem("input").change()
        },
        onItemClick: function(e) {
          var t = s()(e.currentTarget);
          Boolean(t.attr("data-disabled")) || (this.choose(t.attr("data-value")), this.hide(), this._elem("button").is(":focus") || APP.is_touch_device || this._elem("button").focus())
        },
        _makeButtonBlurable: function(e) {
          this._elem("button").length && (e ? (this._onButtonOpenerBlurBinded = r().bind(this.onButtonOpenerBlur, this), this._elem("button").get(0).addEventListener("blur", this._onButtonOpenerBlurBinded)) : this._onButtonOpenerBlurBinded && this._elem("button").get(0).removeEventListener("blur", this._onButtonOpenerBlurBinded))
        },
        _scrollToLi: function(e) {
          e.length && this._elem("list").scrollTop(r().reduce([e.position().top, this._elem("list").scrollTop(), -this._elem("list").height() / 2, e.height()], (function(e, t) {
            return e + t
          }), 0))
        },
        open: function() {
          this._opened || (this._$document.trigger({
            type: "controls:hide",
            target: this.$el
          }), APP.is_touch_device && document.activeElement && document.activeElement.blur(), this._elem("list").removeClass(this._class("list_closed")).removeClass(this._class("list_to_top")).addClass(this._class("list_opened")).css("z-index", 30), this.$el.css("z-index", 60), this._elem("list").visible() || this._elem("list").addClass(this._class("list_to_top")), this._scrollToLi(this._elem("list").find(this._selector("item_selected")).addClass(this._class("item_key_selected"))), this._elem("list").trigger("controls:select:open"), this._opened = !0)
        },
        hide: function() {
          this._opened && (this._elem("list").addClass(this._class("list_closed")).removeClass(this._class("list_opened")).css("z-index", ""), this._findElem("item_key_selected").removeClass(this._class("item_key_selected")), this.$el.css("z-index", ""), this._elem("list").trigger("controls:select:hide"), this._opened = !1)
        },
        choose: function(e) {
          var t = this._elem("list").find(this._selector("item_by_value", e));
          this._elem("list").find(this._selector("item_selected")).removeClass(this._class("item_selected")), t.addClass(this._class("item_selected")), this._elem("button").attr("data-value", t.attr("data-value")), this._elem("input").attr("data-prev-value", this._elem("input").val()).val(t.attr("data-value")).trigger("controls:change"), this._updateTitle(e)
        },
        hotkey: function(e) {
          switch (e) {
            case 27:
              return this.hide;
            case 13:
            case 32:
              return function(e) {
                var t = this._elem("list").find(this._selector("item_key_selected")),
                  i = Boolean(t.attr("data-disabled"));
                e.preventDefault(), i || (this.choose(t.attr("data-value")), this.hide())
              };
            case 38:
            case 40:
              return function(e) {
                var t = this._elem("list").find(this._selector("item_key_selected")),
                  i = t.index(),
                  n = 38 === e.keyCode ? -1 : 1,
                  s = this._elem("list").find("".concat(this._selector("item"), ":eq(").concat(i + n, ")"));
                e.preventDefault(), s.length || (s = this._elem("list").find(this._selector("item") + (38 === e.keyCode ? ":last" : ":first"))), t.removeClass(this._class("item_key_selected")), s.addClass(this._class("item_key_selected")), this._scrollToLi(s)
              };
            default:
              return r().noop
          }
        },
        _updateTitle: function(e) {
          var t = this._elem("list").find(this._selector("item_by_value", e));
          this._elem("button").children(this._selector("button_inner")).text(t.text())
        }
      })
    },
    863329: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        default: () => r
      });
      var n = i(629133),
        s = i.n(n),
        o = i(210734);
      const r = o.default.extend({
        controlClassName: "js-control-textarea-code",
        _classes: function() {
          return {
            textarea: "control__textarea-code-area",
            lines: "control__textarea-code-lines"
          }
        },
        events: {
          "propertychange textarea": "onChange",
          "input textarea": "onChange",
          "keydown textarea": "onKeyDown",
          "keyup textarea": "onChange",
          "change textarea": "onScroll",
          "mousewheel textarea": "onScroll"
        },
        initialize: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          o.default.prototype.initialize.apply(this, t), this._elem("textarea").on("scroll", s().bind(this.onScroll, this)), this.updateLineNumbers()
        },
        destroy: function() {
          for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          this._elem("textarea").off(), o.default.prototype.destroy.apply(this, t)
        },
        onChange: function(e) {
          (10 != +this._elem("textarea").scrollLeft || 37 !== e.keyCode && 37 !== e.which && "ArrowLeft" !== e.code && "ArrowLeft" !== e.key) && 36 !== e.keyCode && 36 !== e.which && "Home" !== e.code && "Home" !== e.key && 13 !== e.keyCode && 13 !== e.which && "Enter" !== e.code && "Enter" !== e.key && "NumpadEnter" !== e.code || this._elem("textarea").scrollLeft(0), this.updateLineNumbers()
        },
        onScroll: function() {
          this._elem("lines").scrollTop(this._elem("textarea").scrollTop())
        },
        onKeyDown: function(e) {
          var t, i = e.currentTarget;
          if (9 === e.keyCode) return t = this.getCaretPosition() + 4, i.value = "".concat(i.value.substring(0, this.getCaretPosition()), "    ").concat(i.value.substring(this.getCaretPosition(), i.value.length)), this.setCaretPosition(t), !1;
          8 === e.keyCode && "    " === i.value.substring(this.getCaretPosition() - 4, this.getCaretPosition()) && (t = this.getCaretPosition() - 3, i.value = i.value.substring(0, this.getCaretPosition() - 3) + i.value.substring(this.getCaretPosition(), i.value.length), this.setCaretPosition(t)), 37 === e.keyCode && "    " === i.value.substring(this.getCaretPosition() - 4, this.getCaretPosition()) && (t = this.getCaretPosition() - 3, this.setCaretPosition(t)), 39 === e.keyCode && "    " === i.value.substring(this.getCaretPosition() + 4, this.getCaretPosition()) && (t = this.getCaretPosition() + 3, this.setCaretPosition(t)), this.onChange(e)
        },
        updateLineNumbers: function() {
          var e, t, i = this._elem("textarea").val().split("\n").length,
            n = this._elem("lines").get(0),
            s = i - n.children.length;
          if (s > 0) {
            for (e = document.createDocumentFragment(); s > 0;)(t = document.createElement("span")).className = "control__textarea-code-line", e.appendChild(t), s--;
            n.appendChild(e)
          }
          for (; s < 0;) n.removeChild(n.firstChild), s++
        },
        getCaretPosition: function() {
          return this._elem("textarea").get(0).selectionStart
        },
        setCaretPosition: function(e) {
          var t = this._elem("textarea").get(0);
          t.selectionStart = e, t.selectionEnd = e, t.focus()
        },
        hasSelection: function() {
          var e = this._elem("textarea").get(0);
          return e.selectionStart !== e.selectionEnd
        },
        getSelectedText: function() {
          return this.value.substring(this.selectionStart, this.selectionEnd)
        },
        setSelection: function(e, t) {
          var i = this._elem("textarea").get(0);
          i.selectionStart = e, i.selectionEnd = t, i.focus()
        }
      });
      var a = "../build/transpiled/interface/controls/textarea_code";
      window.define(a, (function() {
        var e = "undefined",
          i = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return i && i.default || i
      })), window.require([a])
    },
    943533: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        createFuzzySearch: () => h
      });
      var n = i(445368),
        s = function(e) {
          return function(t) {
            return (0, n.transliterate)(t, e)
          }
        },
        o = s("translit"),
        r = s("latinTranslit"),
        a = s("latinPunto"),
        l = s("punto"),
        c = function(e, t, i) {
          var n = e.length,
            s = t.length;
          if (n > s) return !1;
          if (n === s) return e === t;
          var o = e.split(" ");
          e: for (var r = 0, a = i.length; r < a; r++)
            for (var l = i[r], c = 0; c < o.length; c++) {
              var h = o[c];
              if (l.includes(h)) {
                if (o.splice(c, 1), o.length) break;
                break e
              }
            }
          return !o.length
        },
        h = function() {
          var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").toLowerCase(),
            t = o(e),
            i = r(e),
            n = a(e),
            s = l(e);
          return function() {
            var o = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "").toLowerCase(),
              r = o.split(" ");
            return c(e, o, r) || c(t, o, r) || c(i, o, r) || c(n, o, r) || c(s, o, r)
          }
        }
    },
    174568: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        createFuzzySearch: () => n.createFuzzySearch
      });
      var n = i(943533)
    },
    969109: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        makeLocker: () => n.makeLocker
      });
      var n = i(361882)
    },
    361882: (e, t, i) => {
      "use strict";
      i.r(t), i.d(t, {
        makeLocker: () => n
      });
      var n = function() {
        var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10,
          i = !1;
        return {
          lock: function() {
            clearTimeout(e), i = !0, e = setTimeout((function() {
              i = !1
            }), t)
          },
          checkIsLocked: function() {
            return i
          }
        }
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "3795d4f0-429f-4888-aeb0-d889709cf5f0", e._sentryDebugIdIdentifier = "sentry-dbid-3795d4f0-429f-4888-aeb0-d889709cf5f0")
    } catch (e) {}
  }();
//# sourceMappingURL=90354.6691e55666128b12a6bb.js.map