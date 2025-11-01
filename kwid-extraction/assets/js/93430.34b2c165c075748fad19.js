"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [93430], {
    686007: (t, e, n) => {
      n.r(e), n.d(e, {
        default: () => o
      });
      var i = n(450422);
      const o = {
        loadConnectSources: function() {
          var t = this;
          (0, i.isAmoChatsFullEnabled)() && n.e(72667).then(n.bind(n, 472667)).then((function(e) {
            var n = e.default;
            t._addComponent(n, {
              el: t.$el.get(0)
            })
          }))
        }
      };
      var r = "../build/transpiled/components/amochats_connect_sources/mixins/load_connect_sources";
      window.define(r, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([r])
    },
    493430: (t, e, n) => {
      n.r(e), n.d(e, {
        InboxMessagingTabs: () => w
      });
      var i = n(629133),
        o = n.n(i),
        r = n(313981),
        a = n(323344),
        s = n(998798),
        c = n(500034),
        l = n(258471),
        u = n(315243),
        d = n(656669),
        h = n(56783),
        f = n(30514),
        p = n(661533);

      function _(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
        return i
      }

      function g(t, e, n, i, o, r, a) {
        try {
          var s = t[r](a),
            c = s.value
        } catch (t) {
          return void n(t)
        }
        s.done ? e(c) : Promise.resolve(c).then(i, o)
      }

      function b(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = n, t
      }

      function y(t, e) {
        return function(t) {
          if (Array.isArray(t)) return t
        }(t) || function(t, e) {
          var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
          if (null != n) {
            var i, o, r = [],
              a = !0,
              s = !1;
            try {
              for (n = n.call(t); !(a = (i = n.next()).done) && (r.push(i.value), !e || r.length !== e); a = !0);
            } catch (t) {
              s = !0, o = t
            } finally {
              try {
                a || null == n.return || n.return()
              } finally {
                if (s) throw o
              }
            }
            return r
          }
        }(t, e) || m(t, e) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function v(t) {
        return function(t) {
          if (Array.isArray(t)) return _(t)
        }(t) || function(t) {
          if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t)
        }(t) || m(t) || function() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function m(t, e) {
        if (t) {
          if ("string" == typeof t) return _(t, e);
          var n = Object.prototype.toString.call(t).slice(8, -1);
          return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _(t, e) : void 0
        }
      }
      var C = {
        inbox: {
          view: f.InboxTabContent,
          exclude_types: []
        }
      };
      (0, c.isFeatureAvailable)("global_inbox") && (C.mentions = {
        view: h.MentionsTabContent
      });
      var w = r.default.extend({
          is_indestructible: !0,
          _elem: function(t) {
            return this._is_indestructible ? (this._indestructible_elems_cache || (this._indestructible_elems_cache = {}), this._indestructible_elems_cache[t] || (this._indestructible_elems_cache[t] = p("<div></div>")), this._indestructible_elems_cache[t]) : r.default.prototype._elem.apply(this, arguments)
          },
          _selectors: function() {
            return {
              tab: ".inbox-messaging__tab",
              tab_by_type: '.inbox-messaging__tab[data-type="%s"]',
              filter_by_type: '.inbox-messaging__tab[data-type="%s"] .js-inbox-filter'
            }
          },
          _classes: function() {
            return {
              open_tools: "js-open-chat-tools",
              chat_tools: "inbox-messaging-chat-tools",
              tab_active: "inbox-messaging__tab--active",
              tab_title: "inbox-messaging__tab-title",
              search: "inbox-messaging-search",
              tab_content: "inbox-messaging__tab-content"
            }
          },
          events: function() {
            var t;
            return b(t = {}, "click ".concat(this._selector("tab_title")), "onTabTitleClick"), b(t, "click .".concat(this._class("search")), "onInboxSearchClick"), b(t, "click .".concat(this._class("open_tools")), "onOpenToolsClick"), b(t, "click .js-navigate-link", (function(t) {
              var e = p(t.currentTarget).attr("href");
              window.location.pathname === e && (t.preventDefault(), t.stopPropagation())
            })), t
          },
          document_events: function() {
            return {
              "click #inbox_messaging_overlay": "onFilterOverlayCloseClick"
            }
          },
          initialize: function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              e = t.el,
              n = t.getRightContainer,
              i = void 0 === n ? null : n,
              a = t.toggleRightContainer,
              s = void 0 === a ? o().noop : a,
              c = t.getOnboardingParams,
              l = void 0 === c ? o().noop : c,
              u = t.pageType;
            r.default.prototype.initialize.apply(this, arguments), this._getRightContainer = i, this._toggleRightContainer = s, this._getOnboardingParams = l, this.pageType = u, this.initTabs({
              toggleRightContainer: s,
              getOnboardingParams: l
            }), e && (this.unmountInboxMessagingSearch = this.mountInboxMessagingSearch(), this.openFirstNotification(), this.model && this.listenTo(APP.router, "route", this.onRouteChange))
          },
          destroy: function() {
            this.unmountInboxMessagingSearch && this.unmountInboxMessagingSearch(), this.onFilterOverlayCloseClick(), r.default.prototype.destroy.apply(this, arguments)
          },
          openFirstNotification: function() {
            var t = this;
            !(0, s.isImboxSection)() || APP.isCard() || (0, c.isFeatureAvailable)("global_inbox") || this.inbox_view.afterFirstLoad().then((function() {
              var e = t.inbox_view.notifications.first();
              e && o().contains(["fake", "amochats_connect_sources"], e.get("id")) ? setTimeout(t.collectEmptyDialogsMetrics) : APP.router.navigate(e.get("web_link"), {
                trigger: !0,
                replace: !0
              })
            }))
          },
          collectEmptyDialogsMetrics: function() {
            var t = APP.constant("load_from_server"),
              e = [l.TrackedMetricName.CHAT_TTI],
              n = t ? l.TrackedMetricType.INBOX_EMPTY_DIALOGS : l.TrackedMetricType.INBOX_EMPTY_DIALOGS_NAVIGATION;
            t && e.push(l.TrackedMetricName.CHAT_FCP), l.metricRegistry.changeRegisterTypeWithMetrics((0, l.getDefaultMetricNamespace)(), n, e)
          },
          initTabs: function(t) {
            var e = this,
              n = t.toggleRightContainer,
              i = t.getOnboardingParams,
              r = function(t, e) {
                var i = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).is_before_opening;
                e || void 0 !== i && i || "mentions" !== t || APP.router.navigate((0, a.setParam)({
                  mentions: ""
                }, {
                  only_path: !1
                }), {
                  trigger: !1,
                  replace: !0
                }), n.apply(void 0, arguments)
              };
            this.first_inited_tab = null, o().each(C, (function(t, n) {
              var a = e;
              e._elem("tab_by_type", n).get(0) && (e["".concat(n, "_view")] = e._addComponent(t.view, {
                el: e._elem("tab_by_type", n),
                is_indestructible: e.is_indestructible,
                exclude_click_types: t.exclude_types,
                getOnboardingParams: i,
                getSelectedId: function() {
                  return e.selected_id
                },
                getRightContainer: o().bind(e.getRightContainer, e),
                openTools: o().bind(e.openTools, e),
                toggleRightContainer: o().bind(r, e, n),
                onBeforeRightContainerChange: function() {
                  for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
                  return a.onBeforeRightContainerChange.apply(a, v(e))
                },
                onFilterToggle: o().bind(e.filterHandleToggling, e),
                onRouteChange: o().bind(e.onRouteChange, e)
              }), e.first_inited_tab || (e.first_inited_tab = e["".concat(n, "_view")]))
            })), this.model && this.listenTo(APP.router, "route", this.onRouteChange)
          },
          mountInboxMessagingSearch: function() {
            var t, e = this;
            if (!(0, s.isImboxSection)() || !(0, c.isFeatureAvailable)("talks_search") || !(0, c.isFeatureAvailable)("global_inbox")) return o().noop;
            var i, r, a = this,
              l = (i = function() {
                var e, i, r, s, c, l, h, f, p;
                return function(t, e) {
                  var n, i, o, r, a = {
                    label: 0,
                    sent: function() {
                      if (1 & o[0]) throw o[1];
                      return o[1]
                    },
                    trys: [],
                    ops: []
                  };
                  return r = {
                    next: s(0),
                    throw: s(1),
                    return: s(2)
                  }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                  }), r;

                  function s(r) {
                    return function(s) {
                      return function(r) {
                        if (n) throw new TypeError("Generator is already executing.");
                        for (; a;) try {
                          if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, r[1])).done) return o;
                          switch (i = 0, o && (r = [2 & r[0], o.value]), r[0]) {
                            case 0:
                            case 1:
                              o = r;
                              break;
                            case 4:
                              return a.label++, {
                                value: r[1],
                                done: !1
                              };
                            case 5:
                              a.label++, i = r[1], r = [0];
                              continue;
                            case 7:
                              r = a.ops.pop(), a.trys.pop();
                              continue;
                            default:
                              if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || 6 !== r[0] && 2 !== r[0])) {
                                a = 0;
                                continue
                              }
                              if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
                                a.label = r[1];
                                break
                              }
                              if (6 === r[0] && a.label < o[1]) {
                                a.label = o[1], o = r;
                                break
                              }
                              if (o && a.label < o[2]) {
                                a.label = o[2], a.ops.push(r);
                                break
                              }
                              o[2] && a.ops.pop(), a.trys.pop();
                              continue
                          }
                          r = e.call(t, a)
                        } catch (t) {
                          r = [6, t], i = 0
                        } finally {
                          n = o = 0
                        }
                        if (5 & r[0]) throw r[1];
                        return {
                          value: r[0] ? r[1] : void 0,
                          done: !0
                        }
                      }([r, s])
                    }
                  }
                }(this, (function(_) {
                  switch (_.label) {
                    case 0:
                      return [4, Promise.all([Promise.resolve().then(n.t.bind(n, 827378, 23)), n.e(37634).then(n.t.bind(n, 937634, 19)), Promise.all([n.e(98529), n.e(65111)]).then(n.bind(n, 809243))])];
                    case 1:
                      switch (e = y.apply(void 0, [_.sent(), 3]), i = e[0], r = i.default, s = e[1], c = s.default, l = e[2], h = l.default, f = [], a.pageType) {
                        case "chats":
                          f.push(u.AvailableSearchEntities.INBOX, u.AvailableSearchEntities.LEADS);
                          break;
                        case "teams":
                          f.push(u.AvailableSearchEntities.TEAM);
                          break;
                        default:
                          f.push(u.AvailableSearchEntities.INBOX, u.AvailableSearchEntities.LEADS, u.AvailableSearchEntities.TEAM)
                      }
                      return p = r.createElement(h, {
                        enabledSearchEntities: f,
                        initialValue: (0, d.isSearchActive)() ? (0, d.get)().term : "",
                        onSearchDataFetched: o().bind(a.onSearchDataFetched, a),
                        onSearchItemClick: o().bind(a.onSearchItemClick, a),
                        onToggleSearchSize: o().bind(a.onToggleSearchSize, a),
                        onSearchValueChange: o().bind(a.onSearchValueChange, a)
                      }), (t = c.createRoot(a._elem("search")[0])).render(p), [2]
                  }
                }))
              }, r = function() {
                var t = this,
                  e = arguments;
                return new Promise((function(n, o) {
                  var r = i.apply(t, e);

                  function a(t) {
                    g(r, n, o, a, s, "next", t)
                  }

                  function s(t) {
                    g(r, n, o, a, s, "throw", t)
                  }
                  a(void 0)
                }))
              }, function() {
                return r.apply(this, arguments)
              });
            return l(),
              function() {
                var n = e._elem("search").html();
                t && t.unmount(), e._elem("search").html(n)
              }
          },
          onToggleSearchSize: function(t) {
            this.overlay(!t, "search"), t ? this.$el.css("z-index", 102) : this.$el.css("z-index", "")
          },
          onSearchItemClick: function(t, e) {
            switch (t) {
              case "inbox":
                break;
              case "team":
                this.mentions_view.navigateToChat(e.id, e.webLink), this.removeHighlightsFromQueryString();
                break;
              default:
                this.removeHighlightsFromQueryString()
            }
            this._$document.trigger("card-messages:rerender-highlights")
          },
          onSearchDataFetched: function(t) {
            var e = this;
            o().each(t, (function(t) {
              var n = {};
              "inbox" === t.entity ? n = o().propertyOf(t)(["data", "entity"]) || {} : "leads" === t.entity && (n = {
                id: o().propertyOf(t)(["data", "id"]),
                type: "leads"
              }), n.id && e._$document.trigger("entity:chats-preload", [n.id, n.type])
            }))
          },
          removeHighlightsFromQueryString: function() {
            var t = (0, a.removeQueryParam)(["highlights", "highlightId"]),
              e = window.location.pathname + (t ? "?".concat(t) : "");
            APP.router.navigate(e, {
              trigger: !1,
              replace: !0
            })
          },
          onSearchValueChange: function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
            t.trim() ? this._elem("open_tools").hide() : this._elem("open_tools").show(), t.trim().length >= 3 ? (0, d.set)({
              term: t
            }) : (this.removeHighlightsFromQueryString(), this.actualizeActiveTabFilter(), this._$document.trigger("card-messages:rerender-highlights"))
          },
          onInboxSearchClick: function() {
            this.$el.hasClass("inbox-filter_open") && this.onFilterOverlayCloseClick()
          },
          onTabTitleClick: function(t) {
            var e = t.currentTarget,
              n = p(e).closest(this._selector("tab")).attr("data-type");
            this.switchTab(n)
          },
          onOpenToolsClick: function() {
            this.openTools()
          },
          onRouteChange: function(t) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
              n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            if ((0, s.isImboxSection)()) {
              var i = n.silent,
                o = n.skip_tab_filter_actualization,
                r = void 0 !== o && o,
                a = parseInt(e[0]) > 0 ? "inbox" : e[0];
              if ((0, s.isMentionsPageSection)() && (a = "mentions"), (0, s.isChatToolsPageSection)() && (a = "tools"), a && (C[a] || "tools" === a)) {
                this.closeViewsInRightContainer(a);
                var c = Boolean(this._elem("tab_by_type", a).length);
                "tools" !== a && c && this.switchTab(a, {
                  skip_filter_actualization: r
                }), this.selected_id = "inbox" === a ? parseInt(e[0]) : e[0], this.model.set("current_state", {
                  section: a,
                  selected: this.selected_id
                }), i || (this.unsetSelected(), (c || "tools" === a) && this.setSelected(a, e))
              } else this.unsetSelected()
            }
          },
          openTools: function(t) {
            var e = this;
            return (0, c.isFeatureAvailable)("chats_chat_tools") ? new Promise((function(i, r) {
              Promise.all([n.e(76012), n.e(20983), n.e(56740), n.e(95882), n.e(41203), n.e(15656), n.e(49458), n.e(56973), n.e(52383), n.e(45644), n.e(71209), n.e(41136), n.e(52853), n.e(21483), n.e(58551), n.e(39970), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(15899), n.e(42714), n.e(64044), n.e(58432), n.e(12651), n.e(25050), n.e(6476), n.e(87822), n.e(72209), n.e(48008), n.e(42518), n.e(11291), n.e(87868), n.e(38873), n.e(60930), n.e(287), n.e(69314), n.e(35838), n.e(90443), n.e(57399), n.e(96851), n.e(92926), n.e(17506), n.e(61723), n.e(94400), n.e(64622)]).then(n.bind(n, 606011)).then((function(n) {
                var r = n.default;
                if (!e.tools_view) {
                  var a = e;
                  e.tools_view = e._addComponent(r, {
                    el: e._elem("chat_tools"),
                    getRightContainer: o().bind(e.getRightContainer, e),
                    toggleRightContainer: e._toggleRightContainer,
                    getOnboardingParams: e._getOnboardingParams,
                    onBeforeRightContainerChange: function() {
                      for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
                      return a.onBeforeRightContainerChange.apply(a, v(e))
                    },
                    onClose: o().bind(e.actualizeActiveTabFilter, e),
                    onFilterToggle: o().bind(e.filterHandleToggling, e),
                    onRouteChange: o().bind(e.onRouteChange, e)
                  })
                }
                e.tools_view.open(t), i(e.tools_view)
              }), (function(t) {
                return r(t)
              }))
            })) : Promise.reject()
          },
          onFilterOverlayCloseClick: function() {
            var t = this,
              e = [this].concat(o().reduce(o().keys(C), (function(e, n) {
                return t["".concat(n, "_view")] ? e.concat(t["".concat(n, "_view")]) : e
              }), []));
            o().each(e, (function(t) {
              t.search && t.search.filter && t.search.filter.close()
            }))
          },
          switchTab: function(t) {
            var e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).skip_filter_actualization,
              n = void 0 !== e && e,
              i = this._elem("tab_by_type", t),
              o = this._findElem("tab_active");
            o.attr("data-type") !== t && i.length && (this.model && this.model.set("active_tab", t), i.addClass(this._class("tab_active")), o.removeClass(this._class("tab_active")), this["".concat(t, "_view")] && (this["".concat(t, "_view")].show(), this["".concat(t, "_view")].onVirtualizedResize(), n || this.actualizeActiveTabFilter()))
          },
          show: function() {
            var t;
            null === (t = this.first_inited_tab) || void 0 === t || t.show()
          },
          closeViewsInRightContainer: function() {
            this.mentions_view && this.mentions_view.opened_direct_chat && !(0, s.isTeamChatOpened)() && (this.mentions_view.closeDirectChat(), this.actualizeActiveTabFilter())
          },
          getRightContainer: function() {
            return o().isFunction(this._getRightContainer) ? this._getRightContainer() : p()
          },
          onBeforeRightContainerChange: function() {
            var t = this.canChangeRightContainerView();
            return t || this.disallowRightContainerChange(), t
          },
          disallowRightContainerChange: function() {
            var t = this.getCurrentState().section;
            return this["".concat(t, "_view")].onDisallowRightContainerChange()
          },
          canChangeRightContainerView: function() {
            var t = (this.getCurrentState() || {}).section,
              e = this["".concat(t, "_view")];
            return !t || !o().isFunction(e.canDestroyViewInRightContainer) || e.canDestroyViewInRightContainer()
          },
          getCurrentState: function() {
            return this.model && this.model.get("current_state")
          },
          ensureView: function(t) {
            var e = this;
            return new Promise((function(n, i) {
              "tools" !== t ? n(e["".concat(t, "_view")]) : e.openTools().then(n, i)
            }))
          },
          setSelected: function(t, e) {
            var n = this;
            this.ensureView(t).then((function(i) {
              if (i) {
                var r = i;
                r.afterFirstLoad().then((function() {
                  var i, a = (0, s.isTeamChatOpened)();
                  r.notifications && !a && (i = "mentions" === t ? r.notifications.find((function(t) {
                    return o().propertyOf(t.get("entity"))("id") === n.selected_id
                  })) : r.notifications.get(n.selected_id)), i && i.set("selected", !0), "tools" === t && r.open(e[0]), a && ("create" === e[1] ? r.createGroupChat() : r.openDirectChat(n.selected_id, !0))
                }))
              }
            }))
          },
          unsetSelected: function() {
            var t = this;
            o().each(C, (function(e, n) {
              var i = t["".concat(n, "_view")];
              if (i && i.notifications) {
                var o = i.notifications.findWhere({
                  selected: !0
                });
                o && o.set("selected", !1)
              }
            }))
          },
          actualizeActiveTabFilter: function() {
            var t = {};
            "inbox" === this.model.get("active_tab") && (t = this.inbox_view.search.filter.getFilterState()), (0, d.set)(t)
          },
          filterHandleToggling: function(t) {
            this.$el.toggleClass("inbox-filter_open", t), this.overlay(!t)
          },
          overlay: function(t) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
            t && this.$overlay ? (this.$overlay.trigger("overlay:hide"), this.$overlay = null) : t || this.$overlay || (this._$body.append(this.$overlay = p('<div class="default-overlay" id="inbox_messaging_overlay'.concat(e ? "_".concat(e) : "", '" style="z-index: 101"></div>'))), this.$overlay.trigger("overlay:show"))
          }
        }),
        S = "../build/transpiled/components/base/inbox/inbox_messaging/InboxMessagingTabs";
      window.define(S, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([S])
    },
    30514: (t, e, n) => {
      n.r(e), n.d(e, {
        InboxTabContent: () => W,
        subscribeInitGoToNotification: () => Q
      });
      var i = n(629133),
        o = n.n(i),
        r = n(162262),
        a = n.n(r),
        s = n(128508),
        c = n(161320),
        l = n.n(c),
        u = n(267651),
        d = n.n(u),
        h = n(156040),
        f = n(797078),
        p = n(859200),
        _ = n(323344),
        g = n(445368),
        b = n(450422),
        y = n(214558),
        v = n(500034),
        m = n(998798),
        C = n(672034),
        w = n(397927),
        S = n(363119),
        k = n(686007),
        x = n(382646),
        O = n(778636),
        T = n(304483),
        I = n(621448),
        P = n(701291),
        E = n(407769),
        A = n(656669),
        R = n(962444),
        M = n(661533);

      function N(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, i = new Array(e); n < e; n++) i[n] = t[n];
        return i
      }

      function F(t, e, n, i, o, r, a) {
        try {
          var s = t[r](a),
            c = s.value
        } catch (t) {
          return void n(t)
        }
        s.done ? e(c) : Promise.resolve(c).then(i, o)
      }

      function D(t) {
        return function() {
          var e = this,
            n = arguments;
          return new Promise((function(i, o) {
            var r = t.apply(e, n);

            function a(t) {
              F(r, i, o, a, s, "next", t)
            }

            function s(t) {
              F(r, i, o, a, s, "throw", t)
            }
            a(void 0)
          }))
        }
      }

      function j(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = n, t
      }

      function B(t, e) {
        return function(t) {
          if (Array.isArray(t)) return t
        }(t) || function(t, e) {
          var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
          if (null != n) {
            var i, o, r = [],
              a = !0,
              s = !1;
            try {
              for (n = n.call(t); !(a = (i = n.next()).done) && (r.push(i.value), !e || r.length !== e); a = !0);
            } catch (t) {
              s = !0, o = t
            } finally {
              try {
                a || null == n.return || n.return()
              } finally {
                if (s) throw o
              }
            }
            return r
          }
        }(t, e) || function(t, e) {
          if (t) {
            if ("string" == typeof t) return N(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? N(t, e) : void 0
          }
        }(t, e) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function L(t, e) {
        var n, i, o, r, a = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return r = {
          next: s(0),
          throw: s(1),
          return: s(2)
        }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
          return this
        }), r;

        function s(r) {
          return function(s) {
            return function(r) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; a;) try {
                if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, r[1])).done) return o;
                switch (i = 0, o && (r = [2 & r[0], o.value]), r[0]) {
                  case 0:
                  case 1:
                    o = r;
                    break;
                  case 4:
                    return a.label++, {
                      value: r[1],
                      done: !1
                    };
                  case 5:
                    a.label++, i = r[1], r = [0];
                    continue;
                  case 7:
                    r = a.ops.pop(), a.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || 6 !== r[0] && 2 !== r[0])) {
                      a = 0;
                      continue
                    }
                    if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
                      a.label = r[1];
                      break
                    }
                    if (6 === r[0] && a.label < o[1]) {
                      a.label = o[1], o = r;
                      break
                    }
                    if (o && a.label < o[2]) {
                      a.label = o[2], a.ops.push(r);
                      break
                    }
                    o[2] && a.ops.pop(), a.trys.pop();
                    continue
                }
                r = e.call(t, a)
              } catch (t) {
                r = [6, t], i = 0
              } finally {
                n = o = 0
              }
              if (5 & r[0]) throw r[1];
              return {
                value: r[0] ? r[1] : void 0,
                done: !0
              }
            }([r, s])
          }
        }
      }
      var z = APP.constant("account").id,
        V = "inbox:talks:".concat(z),
        G = "system:state:".concat(z),
        $ = {
          create: [119],
          update: [127, 128, 134],
          delete: [120],
          read: [125],
          unread: [126],
          is_starred: [131],
          is_not_starred: [132],
          emotionDetection: [170]
        };
      f.default.status.subscribe((function(t) {
          t.state === WebSocket.OPEN && f.default.send([{
            method: "subscribe",
            params: {
              channel: G
            }
          }])
        })),
        function() {
          if (APP.constant("account").is_chats_inbox_enabled) {
            var t = [I.InboxBadgeId.BADGE_INBOX],
              e = (0, v.isFeatureAvailable)("global_inbox");
            e && t.push(I.InboxBadgeId.BADGE_TEAM_UNION), (0, I.listen)(t).subscribe((function(t) {
              if ((0, v.isFeatureAvailable)(v.Features.SYSTEM_NAVIGATION_V2))(0, i.each)(t, (function(t, e) {
                switch (e) {
                  case I.InboxBadgeId.BADGE_INBOX:
                    (0, w.updateItemCounter)({
                      id: w.CounterId.CHATS_INBOX,
                      count: t
                    });
                    break;
                  case I.InboxBadgeId.BADGE_TEAM_UNION:
                    (0, w.updateItemCounter)({
                      id: w.CounterId.TEAM_INBOX,
                      count: t
                    })
                }
              }));
              else {
                var n = o()(o().values(t)).reduce((function(t, e) {
                  return t + e
                }), 0);
                (0, w.updateItemCounter)({
                  id: w.CounterId.CHATS,
                  count: n > 999 && e ? "999+" : n
                })
              }
            }))
          }
        }();
      var U, Q = (U = D((function(t, e) {
          var n, i, r, a, s;
          return L(this, (function(c) {
            return n = e.params, i = e.type, r = e.id, a = o().propertyOf(n)([i, "enabled"]), (0, m.isImboxSection)() && (0, p.isAdmin)() && a ? ((s = function() {
              return t.add({
                id: r
              })
            })(), t.on("add remove", s), [2, function() {
              t.off("add remove", s)
            }]) : [2, o().noop]
          }))
        })), function(t, e) {
          return U.apply(this, arguments)
        }),
        W = O.default.extend({
          el: "<div></div>",
          template: "/tmpl/inbox/inbox_messaging/aside.twig",
          badge_id: I.InboxBadgeId.BADGE_INBOX,
          sound_id: "amo_inbox_sound_talks",
          source: R.default,
          collection: E.Collection,
          hidden: !0,
          no_content_text: (0, g.i18n)("No conversations found"),
          is_chats_notification_item_enabled: !(0, v.isFeatureAvailable)("global_inbox"),
          _selectors: function() {
            return o().extend({}, O.default.prototype._selectors.apply(this, arguments), {
              inbox: "#inbox_messaging_aside",
              inbox_container: "#inbox_messaging_list",
              mentions: "#inbox_mentions",
              connect_source_btn: ".search-more .connect-source-item"
            })
          },
          _classes: function() {
            return o().extend({}, O.default.prototype._classes.apply(this, arguments), {
              aside: "inbox-messaging__aside",
              is_hidden: "inbox-holder_hidden",
              tab_counter: "js-talks-tab-counter",
              list: "inbox-list",
              list_scrolled: "inbox-list--scrolled",
              widget_creator: "widget-creator"
            })
          },
          document_events: function() {
            var t = this;
            return o().extend({}, o().result(O.default.prototype, "document_events", {}), {
              "page:changed": "updateVirtualizedInboxList",
              "fake-socket-event:inbox:talks:read": function(e, n) {
                O.default.prototype.onMessageRead.call(t, n)
              }
            })
          },
          events: function() {
            return o().extend({}, o().result(O.default.prototype, "events", {}), {
              "click .notification-item--go-to-add-channel": "onGoToAddChannelClick",
              "js-widget-creator:create-widget .widget-creator": "onWidgetCreate"
            })
          },
          initialize: function() {
            var t = this,
              e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              n = e.is_indestructible,
              i = void 0 === n || n,
              r = e.getSelectedId,
              a = void 0 === r ? o().noop : r,
              s = e.getOnboardingParams,
              c = e.getRightSideContainer,
              l = void 0 === c ? null : c,
              u = e.openTools;
            this._is_indestructible = i, this._list_scrolled = !1, this.getSelectedId = a, this.getDirectChatContainer = l, O.default.prototype.initialize.apply(this, arguments), this.openTools = u, (0, h.onPageFullyLoaded)((function() {
              t.initGoToNotification(s), (0, m.isImboxSection)() && t.loadConnectSources()
            }))
          },
          destroy: function() {
            return o().isFunction(this.removeSocketConnectionChangeListener) && this.removeSocketConnectionChangeListener(), o().isFunction(this.unsubscribeInitGoToNotification) && this.unsubscribeInitGoToNotification(), O.default.prototype.destroy.apply(this, arguments)
          },
          updateVirtualizedInboxList: function() {
            this.notifications && (this.onVirtualizedResize(), this.onInboxListModify(), this.checkVisibilityOpenChat())
          },
          initAllPromises: function() {
            this.promise_all_init = [this.requestBadge(), this.initSource(), this.connect(), this.requestPushPermission()], (0, v.isFeatureAvailable)(v.Features.EMOTION_DETECTOR_AVAILABLE) && o().isUndefined((0, v.getAccountFeatures)()[v.Features.IS_EMOTION_DETECTOR_ENABLED]) && this.promise_all_init.push(this.checkEmotionDetectorEnabled());
            var t = Promise.all(this.promise_all_init);
            return (0, h.onPageFullyLoaded)(o().bind(this.initCounters, this)), t
          },
          getInitialSortOrder: function() {
            return (0, P.getInitialSortOrder)()
          },
          initQuickActionMenu: function(t) {
            return D((function() {
              var e, i;
              return L(this, (function(r) {
                switch (r.label) {
                  case 0:
                    return [4, n.e(45611).then(n.bind(n, 245611))];
                  case 1:
                    return e = r.sent(), i = e.default, this.notification_quick_action = this._addComponent(i, o().extend({
                      onButtonClick: o().bind(this.processMultiaction, this),
                      onGetQuickActionButtons: o().bind(this.getQuickActionButtons, this, t.model)
                    }, t)), [2]
                }
              }))
            })).apply(this)
          },
          initCounters: function() {
            return D((function() {
              var t, e, n;
              return L(this, (function(i) {
                switch (i.label) {
                  case 0:
                    return t = (0, A.isFilterActive)() ? (0, A.get)({
                      parse: !1
                    }) : {}, [4, Promise.all([this.loadCount(t), this.afterFirstLoad()])];
                  case 1:
                    return e = B.apply(void 0, [i.sent(), 1]), n = e[0].count, this.setTotalCount(n), [2]
                }
              }))
            })).apply(this)
          },
          initGoToNotification: function(t) {
            return D((function() {
              var e, n, i, r;
              return L(this, (function(a) {
                switch (a.label) {
                  case 0:
                    return e = this, [4, t()];
                  case 1:
                    return n = a.sent(), (0, v.isFeatureAvailable)("global_inbox") ? (i = this, [4, Q(this.notifications, {
                      id: "go-to-add-channel",
                      type: "inbox",
                      params: n
                    })]) : [3, 3];
                  case 2:
                    return i.unsubscribeInitGoToNotification = a.sent(), [3, 4];
                  case 3:
                    (0, b.isAmoChatsFullEnabled)() && o().propertyOf(n)(["inbox", "enabled"]) && (this.notifications.add({
                      id: "amochats_connect_sources"
                    }), this._elem("connect_source_btn").addClass("hidden"), r = function() {
                      2 === e.notifications.length && "amochats_connect_sources" === e.notifications.at(0).get("id") && (e.notifications.remove("amochats_connect_sources"), e._elem("connect_source_btn").removeClass("hidden")), e.notifications.off("add", r)
                    }, this.notifications.on("add", r)), a.label = 4;
                  case 4:
                    return [2]
                }
              }))
            })).apply(this)
          },
          onGoToAddChannelClick: function() {
            return D((function() {
              var t;
              return L(this, (function(e) {
                return t = this, (0, v.isFeatureAvailable)("global_marketplace") ? ((0, v.isFeatureAvailable)(v.Features.SYSTEM_NAVIGATION_V2) ? APP.router.navigate("/settings/widgets", {
                  trigger: !0
                }) : this.openTools("channels"), [2]) : (Promise.all([n.e(95882), n.e(58551), n.e(63661), n.e(47448), n.e(21896), n.e(34040), n.e(15899), n.e(42714), n.e(64044), n.e(58432), n.e(12651), n.e(68963), n.e(17433), n.e(74687), n.e(89060), n.e(61494), n.e(47731), n.e(66815), n.e(45942), n.e(81048), n.e(12827)]).then(n.bind(n, 440178)).then((function(e) {
                  var n = e.default;
                  t.source_modal_creator || (t.source_modal_creator = t._addComponent(n, {
                    onBeforeInitSources: function() {
                      S.default.showMainOverlay(M("#page_holder"), {
                        position_absolute: !0,
                        z_index: 105
                      })
                    },
                    onInitSourcesSuccess: function() {
                      S.default.hideMainOverlay()
                    },
                    onInitSourcesError: function() {
                      S.default.hideMainOverlay(), (new T.default).showError(!1, !1)
                    }
                  })), t.source_modal_creator.showModal()
                })), [2])
              }))
            })).apply(this)
          },
          onVirtualizedListScroll: function(t) {
            t <= 0 && this._list_scrolled ? (this._list_scrolled = !1, this._elem("list").removeClass(this._class("list_scrolled"))) : this._list_scrolled || (this._list_scrolled = !0, this._elem("list").addClass(this._class("list_scrolled"))), O.default.prototype.onVirtualizedListScroll.apply(this, arguments)
          },
          onWidgetCreate: function() {
            return D((function() {
              var t, e, i;
              return L(this, (function(o) {
                switch (o.label) {
                  case 0:
                    return t = this, [4, n.e(42627).then(n.bind(n, 942627))];
                  case 1:
                    return e = o.sent(), i = e.default, this.modal_create_widget = new i({
                      filter: {
                        filter: this.search.filter.getFilterState()
                      },
                      widget_data: {
                        name: "",
                        element_type: APP.element_types.talk
                      },
                      need_additional_aggregation: !1,
                      getFilterState: function() {
                        return t.search.filter.getFilterState()
                      }
                    }), [2]
                }
              }))
            })).apply(this)
          },
          cleanTotalCount: function() {
            this._elem("widget_creator").text("")
          },
          loadCount: function(t) {
            return D((function() {
              var e, n;
              return L(this, (function(i) {
                switch (i.label) {
                  case 0:
                    if ((0, p.getRights)("is_free_user")) return [2, {
                      count: 0
                    }];
                    i.label = 1;
                  case 1:
                    return i.trys.push([1, 3, , 4]), [4, M.ajaxPromisify("/ajax/v4/inbox/count", {
                      data: {
                        filter: t
                      }
                    })];
                  case 2:
                    return e = i.sent(), [3, 4];
                  case 3:
                    return n = i.sent(), console.error(n), [3, 4];
                  case 4:
                    return [2, {
                      count: null == e ? void 0 : e.count
                    }]
                }
              }))
            }))()
          },
          setTotalCount: function(t) {
            var e;
            o().isUndefined(t) ? this.cleanTotalCount() : this.count !== t && (this.total_count = t, this._elem("widget_creator").text("".concat((0, g.i18n)("Total"), ": ").concat(t)), null === (e = this.search) || void 0 === e || e.checkWidthOptions())
          },
          getQuickActionButtons: function(t) {
            var e = [];
            return t.get("is_read") || e.push({
              icon: "inbox--double-tick",
              text: (0, g.i18n)("Mark answered"),
              callback: {
                type: "read",
                data: {
                  ids: [t.get("notification_id")]
                }
              }
            }), "opened" === t.get("status") && e.push({
              icon: "tasks--types-icons--63",
              text: (0, g.i18n)("Talk close"),
              callback: {
                type: "close",
                data: {
                  ids: [t.get("notification_id")]
                }
              }
            }), e
          },
          _getDirectChatContainer: function() {
            return o().isFunction(this.getDirectChatContainer) ? this.getDirectChatContainer() : O.default.prototype._getDirectChatContainer.apply(this, arguments)
          },
          initMultiaction: function() {
            return D((function() {
              var t, e;
              return L(this, (function(i) {
                switch (i.label) {
                  case 0:
                    return [4, n.e(59068).then(n.bind(n, 59068))];
                  case 1:
                    return t = i.sent(), e = t.default, this.multiaction = this._addComponent(e, {
                      el: this._elem("aside_inner").get(0),
                      notifications: this.notifications,
                      buttons: [{
                        title: (0, g.i18n)("Mark answered"),
                        icon: "inbox--double-tick",
                        type: "read"
                      }, {
                        title: (0, g.i18n)("Talk close"),
                        icon: "tasks--types-icons--63",
                        type: "close"
                      }],
                      closeChat: o().bind(this.closeDirectChat, this),
                      onButtonClick: o().bind(this.processMultiaction, this)
                    }), [2]
                }
              }))
            })).apply(this)
          },
          processMultiaction: function(t, e) {
            var n = {
              filter: {}
            };
            e.choose_all ? n.filter = this.search.filter.getFilterState() : n.filter.id = e.ids, o().contains(["read", "close"], t) && this.source_loader.handleMultiaction(t, n)
          },
          connect: function() {
            return D((function() {
              return L(this, (function(t) {
                switch (t.label) {
                  case 0:
                    return this._is_indestructible ? [3, 2] : [4, this.afterFilterInit()];
                  case 1:
                    t.sent(), t.label = 2;
                  case 2:
                    return this.inboxTalkChannelSocket(), this.systemChannelSocket(), [2]
                }
              }))
            })).apply(this)
          },
          inboxTalkChannelSocket: function() {
            var t = f.default.subscribe([V]).pipe(s.filter((function(t) {
                var e = o().propertyOf(t.body),
                  n = e("payload"),
                  i = e("channel") === V;
                return n && i
              })), s.map((function(t) {
                return t.body.payload
              })), s.share()),
              e = t.pipe(s.filter((function(t) {
                return o().contains(o().union($.create, $.update), t.type)
              })), s.map((function(t) {
                var e = t.model;
                return e.silent = parseInt(o().propertyOf(t.model)(["last_message", "id"])) >= 0, !o().isEmpty(e.last_reaction) && e.silent && (e.silent = l()(e.last_reaction.created_at).isBefore(e.last_message.last_message_at)), [e]
              }))),
              n = t.pipe(s.filter((function(t) {
                return o().contains($.read, t.type)
              })), s.map((function(t) {
                return [t.model]
              }))),
              i = t.pipe(s.filter((function(t) {
                return o().contains($.delete, t.type)
              })), s.map((function(t) {
                return [t.model]
              }))),
              r = t.pipe(s.filter((function(t) {
                return o().contains(o().union($.is_starred, $.is_not_starred), t.type)
              })), s.map((function(t) {
                return {
                  ids: [t.model.id],
                  label: o().contains($.is_starred, t.type)
                }
              }))),
              a = t.pipe(s.filter((function(t) {
                return o().contains($.emotionDetection, t.type)
              })), s.map((function(t) {
                return [t.model]
              })));
            this.socket.add(e.subscribe(o().bind(this.onMessageReceived, this))), this.socket.add(n.subscribe(o().bind(this.onMessageRead, this))), this.socket.add(i.subscribe(o().bind(this.onMessageRemove, this))), this.socket.add(r.subscribe(o().bind(this.onMessageLabel, this))), this.socket.add(a.subscribe(o().bind(this.onEmotionDetection, this))), this.removeSocketConnectionChangeListener = f.default.onConnectionChange(o().bind(this.onSocketReconnectSynchronize, this))
          },
          systemChannelSocket: function() {
            var t = f.default.subscribe([G]).pipe(s.filter((function(t) {
              var e = o().propertyOf(t.body),
                n = e("payload"),
                i = e("channel") === G;
              return n && i
            })), s.map((function(t) {
              return t.body.payload
            })), s.share()).pipe(s.filter((function(t) {
              var e = o().chain($).values().flatten(1).value();
              return o().contains(e, t.type)
            })), s.map((function() {
              return []
            })));
            this.socket.add(t.subscribe(o().bind(this.onMultipleEventHandle, this)))
          },
          onMultipleEventHandle: function() {
            var t = this,
              e = o().propertyOf(this.notifications.findWhere({
                selected: !0
              }))("id");
            this.no_content = !0, this.cleanTotalCount();
            var n = [this.loadCount(this.search.filter.getFilterState()), this.apply()];
            Promise.all(n).then((function(e) {
              var n = B(e, 1)[0].count;
              t.setTotalCount(n)
            })), (0, I.update)(), this.listenToOnce(this.notifications, "sort", (function() {
              var n = t.notifications.get(e);
              n && n.set("selected", !0), o().delay((function() {
                return t.updateVirtualizedInboxList()
              }), 100)
            }))
          },
          onEmotionDetection: function(t) {
            var e = this;
            o().each(t, (function(t) {
              var n = e.notifications.get(t.id);
              n && (d().publish("socket-event:talks:emotion", {
                emotion: t.emotion,
                talkId: t.id
              }), n.set("emotion", t.emotion))
            })), this.onMessageReceived(t)
          },
          onMessageRemove: function(t) {
            (0, m.isImboxSection)() && this.processSocket({
              models: t,
              canRemove: function(t) {
                var e = o().keys(t).length,
                  n = "opened" === t.status;
                return 1 === e && n || 2 === e && n && t.is_read
              }
            })
          },
          onMessageRead: function(t) {
            (0, m.isImboxSection)() && this.processSocket({
              models: t,
              canRemove: function(t) {
                var e = o().keys(t).length,
                  n = "false" === t.is_read;
                return 1 === e && n || 2 === e && n && t.status
              }
            })
          },
          processSocket: function(t) {
            var e = this,
              n = t.canRemove,
              i = t.models,
              r = this.search.filter.getFilterState();
            o().each(i, (function(t) {
              var i = new(0, e.notifications.model)(t),
                o = e.filterEntryCheck(i),
                a = Boolean(e.notifications.get(i));
              return o ? (a || e.setTotalCount(e.total_count + 1), void e.addNotification(i, {
                merge: !0
              })) : a ? (e.setTotalCount(e.total_count - 1), void e.notifications.remove(i)) : void(n(r) && e.setTotalCount(e.total_count - 1))
            })), this.notifications.sort()
          },
          onMessageReceived: function(t) {
            var e = this;
            o().each(t, (function(t) {
              var n = new(0, e.notifications.model)(t),
                i = e.filterEntryCheck(n);
              !e.notifications.get(n) && i && e.setTotalCount(e.total_count + 1)
            })), O.default.prototype.onMessageReceived.apply(this, arguments)
          },
          rejectExistingModelOnAdd: function() {
            var t = O.default.prototype.rejectExistingModelOnAdd.apply(this, arguments);
            t.length && this.setTotalCount(this.total_count - t.length)
          },
          addNotification: function(t) {
            var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              n = t.get("entity") || {};
            return e.merge && (e.parse = !0), t.id === this.getSelectedId() && t.set("selected", !0), o().contains(["leads", "customers"], n.type) && this._$document.trigger("entity:chats-preload", [n.id, n.type]), O.default.prototype.addNotification.apply(this, arguments)
          },
          read: function() {
            return Promise.resolve()
          },
          show: function() {
            return D((function() {
              var t, e = arguments;
              return L(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return t = this, this.hidden ? (this.hidden = !1, [4, O.default.prototype.show.apply(this, e)]) : [2];
                  case 1:
                    return n.sent(), this._removeClass("is_hidden"), this._elem("aside").addClass("slide-in"), this.updateVirtualizedInboxList(), this.autoloadContent(), this.afterFirstLoad().then((function() {
                      t.updateVirtualizedInboxList(), o().delay((function() {
                        return t.updateVirtualizedInboxList()
                      }), 100)
                    })), [2]
                }
              }))
            })).apply(this)
          },
          checkEmotionDetectorEnabled: function() {
            return D((function() {
              var t, e;
              return L(this, (function(n) {
                switch (n.label) {
                  case 0:
                    return n.trys.push([0, 2, , 3]), [4, (0, C.getFeaturesByQuery)({
                      queries: [v.Features.IS_EMOTION_DETECTOR_ENABLED],
                      shouldCamelCase: !1
                    })];
                  case 1:
                    return t = n.sent().features, (0, v.updateFeature)(v.Features.IS_EMOTION_DETECTOR_ENABLED, t[v.Features.IS_EMOTION_DETECTOR_ENABLED]), this.updateListView(), [3, 3];
                  case 2:
                    return e = n.sent(), console.error(e), [3, 3];
                  case 3:
                    return [2]
                }
              }))
            })).apply(this)
          },
          canNotFoundNotificationBeShown: function() {
            return 0 === this.notifications.length || 1 === this.notifications.length && "go-to-add-channel" === this.notifications.at(0).get("id")
          },
          canNotFoundNotificationBeRemoved: function() {
            var t = this;
            return !(1 === this.notifications.length && "fake" === this.notifications.at(0).get("id") || 2 === this.notifications.length && o().every(["go-to-add-channel", "fake"], (function(e) {
              return t.notifications.get(e)
            })))
          },
          canMultiactionsBeShown: function() {
            var t = ["fake", "go-to-add-channel"],
              e = !0;
            return this.notifications.length <= t.length && (e = o().filter(this.notifications.models, (function(e) {
              var n = e.id;
              return o().includes(t, n)
            })).length !== t.length), e
          },
          openMultiaction: function() {
            this.multiaction && this.canMultiactionsBeShown() && this.multiaction.show(!1)
          },
          firstApply: function() {
            var t = (0, _.QStoJSON)((0, _.getQueryString)(), !0),
              e = {};
            o().each(t.filter, o().bind(this.firstApplyMutator, this, e)), this.apply({
              is_first: !0,
              first_preset_data: e
            })
          },
          firstApplyMutator: function(t, e, n) {
            switch (n) {
              case "date_preset":
                if (!o().isEmpty(e)) break;
                t.updated_at = {
                  date_preset: e
                };
                break;
              case "interaction_status[]":
                if (o().isEmpty(e)) break;
                t.type = e;
                break;
              case "inbox_chat_source[]":
                if (o().isEmpty(e)) break;
                t.source_id = e;
                break;
              default:
                O.default.prototype.firstApplyMutator.apply(this, arguments)
            }
          },
          filterEntryCheck: function(t) {
            var e = this,
              n = this.getFilterOptions(),
              i = o().propertyOf(n)("date[type]") || "",
              r = "closed" === i ? t.get("closed_at") : t.get("created_at"),
              a = o().reduce(n, (function(n, a, s) {
                var c = o().compact(o().isArray(a) ? a : [a]);
                if (n && c.length && "in_work" !== i) {
                  var u = o().propertyOf(t.get("entity"))("main_user_id") || "";
                  switch (s = s.indexOf("[pipe]") > -1 ? "pipe" : s) {
                    case "tag[]":
                      var d;
                      n = Boolean(o().chain(null === (d = t.get("entity")) || void 0 === d ? void 0 : d.tags).pluck("id").intersection(o().map(c, (function(t) {
                        return parseInt(t)
                      }))).value().length);
                      break;
                    case "segments":
                      var h;
                      n = Boolean(o().chain(null === (h = t.get("entity")) || void 0 === h ? void 0 : h.segments).pluck("id").intersection(o().map(c, (function(t) {
                        return parseInt(t)
                      }))).value().length);
                      break;
                    case "pipe":
                      n = e.isPipelineFillerValid(t);
                      break;
                    case "responsible":
                      n = o().contains(c, u.toString());
                      break;
                    case "status[]":
                      n = o().contains(c, t.get("status"));
                      break;
                    case "is_read[]":
                      n = o().contains(c, t.get("is_read").toString());
                      break;
                    case "is_starred[]":
                      n = o().isUndefined(t.get(e.getLabelParamName())) ? !o().isUndefined(e.notifications.get(t.get("id"))) : o().contains(c, Number(t.get(e.getLabelParamName())).toString());
                      break;
                    case "date_preset":
                      n = function(t, e) {
                        var n = (0, x.default)(e),
                          i = parseInt(n.from),
                          o = parseInt(n.to);
                        return t >= i && t <= o
                      }(r, a);
                      break;
                    case "emotion[]":
                      n = o().contains(c, t.get("emotion"));
                      break;
                    case "updated_at_from":
                      n = function(t, e) {
                        var n = APP.system.format.date.date;
                        return t >= l()(e, n).unix()
                      }(r, a);
                      break;
                    case "updated_at_to":
                      n = function(t, e) {
                        var n = APP.system.format.date.date;
                        return t <= l()(e, n).set({
                          hours: 23,
                          minutes: 59,
                          second: 59
                        }).unix()
                      }(r, a);
                      break;
                    case "interaction_status[]":
                      n = o().contains(c, t.get("type"));
                      break;
                    case "inbox_chat_source[]":
                      n = o().contains(c, String(t.get("source_id")))
                  }
                }
                return n
              }), !0),
              s = this.isSubscribedFilterValid({
                filter_fields: n,
                model: t
              }),
              c = this.isParticipantsFilterValid({
                filter_fields: n,
                model: t
              });
            return a && s && c
          },
          isPipelineFillerValid: function(t) {
            var e = this.search.filter.getFilterState().pipe;
            if (!e) return !0;
            var n = t.get("entity") || {},
              i = n.pipeline_id,
              r = n.status_id;
            if (!i || !r) return !1;
            var a = e[i];
            return !!a && o().contains(a, r.toString())
          },
          showNotification: function() {},
          isParticipantsFilterValid: function(t) {
            var e = t.filter_fields,
              n = t.model,
              i = [],
              r = o().reduce(["participants_users", "participants_groups"], (function(t, r, a) {
                var s, c, l, u = o().propertyOf(e)(r);
                if (u) {
                  var d = o().compact(o().isArray(u) ? u : [u]);
                  switch (r) {
                    case "participants_users":
                      t[a] = !n.get("participants") || o().intersection(o().map(n.get("participants"), (function(t) {
                        return t.toString()
                      })), o().map(d, (function(t) {
                        return "bot" === t ? "0" : t
                      }))).length > 0;
                      break;
                    case "participants_groups":
                      t[a] = !n.get("participants") || o().intersection((s = d, c = o().groupBy((0, y.get)(), "group"), l = o().reduce(s, (function(t, e) {
                        var n = c["group_".concat(e)];
                        return o().union(t, n)
                      }), []), o().chain(l).pluck("id").map((function(t) {
                        return parseInt(t)
                      })).value()), n.get("participants")).length > 0
                  }
                } else i.push(a);
                return t
              }), [!0, !0]);
            return i.length && r.length !== i.length && o().each(i, (function(t) {
              r[t] = !1
            })), o().compact(r).length > 0
          },
          isSubscribedFilterValid: function(t) {
            var e = t.filter_fields,
              n = t.model,
              i = [],
              r = o().propertyOf(n.get("subscribers")),
              a = o().reduce(["subscribed_user", "subscribed_group"], (function(t, a, s) {
                var c = o().propertyOf(e)(a);
                if (c) {
                  var l = o().compact(o().isArray(c) ? c : [c]);
                  switch (a) {
                    case "subscribed_user":
                      t[s] = !n.get("subscribers") || o().intersection(o().map(l, (function(t) {
                        return parseInt(t)
                      })), r("users")).length > 0;
                      break;
                    case "subscribed_group":
                      t[s] = !n.get("subscribers") || o().intersection(o().map(l, (function(t) {
                        return parseInt(t)
                      })), r("groups")).length > 0
                  }
                } else i.push(s);
                return t
              }), [!0, !0]);
            return i.length && a.length !== i.length && o().each(i, (function(t) {
              a[t] = !1
            })), o().compact(a).length > 0
          },
          createNotificationModel: function(t) {
            this.addNotification(new E.Model(t), {
              sort: !1
            })
          },
          getCounterEl: function() {
            return this._elem("tab_counter")
          },
          initSearch: function() {
            return D((function() {
              var t, e, i, r, a, s;
              return L(this, (function(c) {
                switch (c.label) {
                  case 0:
                    return t = this, [4, Promise.all([Promise.all([n.e(69148), n.e(4976)]).then(n.bind(n, 4976)), Promise.all([n.e(69148), n.e(21803)]).then(n.bind(n, 21803))])];
                  case 1:
                    return e = B.apply(void 0, [c.sent(), 2]), i = e[0], r = i.default, a = e[1], s = a.default, this.search = this._addComponent(r, {
                      el: this.el.querySelector(".search-container-wrapper"),
                      FilterComponent: s,
                      getPresets: o().bind(this.requestPresets, this),
                      onFilterItems: function(e) {
                        if ((0, m.isImboxSection)()) {
                          var n = t.search.filter.getFilterState();
                          t.data = [], t.showLoading(), t.multiactionClose(), t.cleanTotalCount();
                          var i = [t.loadCount(n), t.loadData(e)];
                          Promise.all(i).then((function(e) {
                            var n = B(e, 1)[0].count;
                            t.setTotalCount(n)
                          })), (0, A.set)(n)
                        }
                      },
                      onTermIsValid: o().bind((function() {
                        this.loader && this._destroyComponent(this.loader)
                      }), this),
                      onTermIsInvalid: o().bind((function() {
                        this.autoloadContent()
                      }), this),
                      startClickDown: o().bind(this.onWindowKeyDown, this),
                      onFilterToggle: this.options.onFilterToggle
                    }), [2]
                }
              }))
            })).apply(this)
          },
          convertPresets: function(t) {
            var e = o().reduce(o().toArray(t), (function(t, e) {
              var n, i, o = (n = function(t) {
                for (var e = 1; e < arguments.length; e++) {
                  var n = null != arguments[e] ? arguments[e] : {},
                    i = Object.keys(n);
                  "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(t) {
                    return Object.getOwnPropertyDescriptor(n, t).enumerable
                  })))), i.forEach((function(e) {
                    j(t, e, n[e])
                  }))
                }
                return t
              }({}, e), i = null != (i = {
                query: e.query.replace(/created_at/g, "updated_at").replace(/pipe/g, "filter[pipe]")
              }) ? i : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(i)) : function(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(t);
                  n.push.apply(n, i)
                }
                return n
              }(Object(i)).forEach((function(t) {
                Object.defineProperty(n, t, Object.getOwnPropertyDescriptor(i, t))
              })), n);
              return t[e.id] = o, t
            }), {});
            return e
          },
          requestPresets: function() {
            var t = this;
            return this.source_loader.getPresets().then((function(e) {
              return t.presets = t.convertPresets(e), t.presets
            }))
          },
          chooseFavorite: function(t) {
            t.stopPropagation(), t.preventDefault();
            var e = M(t.currentTarget).closest(".notification-inner").attr("data-id"),
              n = parseInt(e) && parseInt(e) || e,
              i = this.notifications.get(n);
            if (i) {
              var o = this.getLabelParamName(),
                r = !i.get(o);
              i.set(o, r), M.ajax({
                url: "/ajax/v4/talks/".concat(i.get("notification_id"), "/star"),
                type: r ? "PUT" : "DELETE",
                error: function(t) {
                  var e = new T.default;
                  422 === t.status ? e.showError((0, g.i18n)("You've reached your limit of 1000 starred chats"), !1) : e.showError(!1, !1), i.set(o, !1)
                }
              })
            }
          },
          reAskNotification: function(t) {
            var e = this;
            return M.ajax({
              url: "/ajax/v4/inbox/list",
              data: {
                filter: {
                  id: t
                }
              }
            }).then((function(t) {
              o().propertyOf(t)(["_embedded", "talks"]) && o().each(t._embedded.talks, (function(t) {
                e.notifications.remove(t.id), e.createNotificationModel(t), e.notifications.sort()
              }))
            }))
          },
          getLabelParamName: function() {
            return "is_starred"
          },
          reconnectOpenedChat: o().noop,
          readTypes: o().noop,
          onItemSelected: o().noop
        });
      a().mixin(W, k.default)
    },
    407769: (t, e, n) => {
      n.r(e), n.d(e, {
        Collection: () => _,
        Model: () => g
      });
      var i = n(629133),
        o = n.n(i),
        r = n(345839),
        a = n.n(r),
        s = n(161320),
        c = n.n(s),
        l = n(445368),
        u = n(500034),
        d = n(567042);

      function h(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = n, t
      }
      var f = 1e3 * Date.now(),
        p = a().Model.extend({
          view: null,
          constructor: function(t) {
            return t.id && t.entity && o().extend(t, this.parse(t)), t.notification_id || (t.notification_id = t.id), t.body && (t.body.rows && this.getStyleMessage(t.body.rows), this.getIconSub(t.body)), a().Model.apply(this, arguments)
          },
          parse: function(t) {
            var e, n = t.entity.title || "",
              i = t.last_message,
              r = t.last_reaction,
              a = t.is_comment,
              s = o().propertyOf(i),
              d = 0 === s("id") || 0 === s("user_id") ? (0, l.i18n)("Salesbot") : s("author"),
              h = (0, u.isFeatureAvailable)("global_inbox") ? "/chats/" : "/imbox/";
            switch (d || (0, u.isFeatureAvailable)("global_inbox") || (d = "..."), t.entity.type) {
              case "leads":
                n = (0, l.leadName)(t.entity.title, t.entity.id);
                break;
              case "customers":
                n = (0, l.customerName)(t.entity.title, t.entity.id);
                break;
              case "contacts":
                n = (0, l.contactName)(t.entity.title)
            }
            return o().extend({
              web_link: "".concat(h + t.id, "/").concat(t.entity.type, "/detail/").concat(t.entity.id, "?t=").concat(t.last_message.last_message_at_msec || t.last_message.last_message_at),
              body: {
                title: n,
                is_talk: !0,
                last_message_at: (null === (e = t.last_reaction) || void 0 === e ? void 0 : e.created_at) ? Math.max(t.last_reaction.created_at, t.last_message.last_message_at) : t.last_message.last_message_at,
                author_title: d,
                rows: [{
                  style: "default",
                  text: function() {
                    var e;
                    if (o().isEmpty(r) || !c()(i.last_message_at).isBefore(r.created_at)) {
                      var n = "instagram_business" === t.chat_source && "secondary" === t.category && a && (0, u.isFeatureAvailable)("ig_inbox_comments") ? (0, l.i18n)("Commented") : "";
                      return o().compact([d, "".concat(n, " ").concat(s("text") || "...").trim()]).join(": ")
                    }
                    switch (!0) {
                      case !r.message_author_id:
                        e = (0, l.sprintf)((0, l.i18n)("%s: Reacted %s"), r.author, r.reaction);
                        break;
                      case r.message_author_id === APP.constant("user").id:
                        e = (0, l.sprintf)((0, l.i18n)("%s: Reacted %s to you"), r.author, r.reaction);
                        break;
                      default:
                        e = (0, l.sprintf)((0, l.i18n)("%s: Reacted %s to %s"), r.author, r.reaction, r.message_author)
                    }
                    return e
                  }()
                }],
                icon: {
                  sub: t.chat_source,
                  value: s("profile_avatar"),
                  avatar_id: s("id") || t.contact_id
                }
              },
              disable_more_content_button: !0
            }, t)
          },
          getIconSub: function(t) {
            var e = !!t.icon && t.icon.sub;
            e && APP.constant("amojo_origins")[e] && (t.icon_origin = APP.constant("amojo_origins")[e].icon || !1)
          },
          getStyleMessage: function(t) {
            o().chain(t).sortBy((function(t) {
              return t.text.length
            })).reverse().each((function(e, n) {
              switch (t.length) {
                case 1:
                  e.class_height = "h3";
                  break;
                case 2:
                  e.class_height = 0 === n ? "h2" : "h1";
                  break;
                case 3:
                  t[n].class_height = 2 === n ? "h2" : "h1"
              }
            }))
          }
        }),
        _ = a().Collection.extend({
          model: p,
          initialize: function() {
            this.listenTo(this, "change:selected", this.onChangeSelected), a().Collection.prototype.initialize.apply(this, arguments)
          },
          preselect: function(t) {
            var e, n = this.findWhere({
              preselected: !0
            });
            switch (n ? n.set("preselected", !1) : n = this.findWhere({
                selected: !0
              }), e = this.indexOf(n) + t, !0) {
              case -1 === e:
              case -2 === e:
                e = 0;
                break;
              case e === this.length:
                e = this.length - 1
            }
            this.at(e).set("preselected", !0)
          },
          select: function() {
            var t = this.findWhere({
              preselected: !0
            });
            t && t.set({
              preselected: !1,
              selected: !0
            })
          },
          setOrder: function(t) {
            this.order_by = t
          },
          comparator: function(t) {
            var e = o().propertyOf(t.get("last_message"))("last_message_at"),
              n = t.get("first_unanswered_message_at"),
              i = t.get("is_starred"),
              r = this.order_by || {};
            if (o().isNull(n) && (n = f - e), "is_starred" === r.sort_by && i && (e += f), r.sort_by === d.default.EMOTION_FILTER_NAME) {
              var a, s, c, l = t.get(d.default.EMOTION_FILTER_NAME);
              n += (null === (a = {
                asc: (s = {}, h(s, d.default.EMOTIONS.NEGATIVE, -f), h(s, d.default.EMOTIONS.POSITIVE, +f), s),
                desc: (c = {}, h(c, d.default.EMOTIONS.NEGATIVE, +f), h(c, d.default.EMOTIONS.POSITIVE, -f), c)
              } [r.sort_type]) || void 0 === a ? void 0 : a[l]) || 0
            }
            switch (!0) {
              case "fake" === t.id && "user_not_found" === t.get("type"):
                return 1 / 0;
              case "go-to-add-channel" === t.id:
                return Number.MAX_SAFE_INTEGER;
              case "is_starred" === r.sort_by:
              case "last_message_at" === r.sort_by:
                return "desc" === r.sort_type ? -e : e;
              case "first_unanswered_message_at" === r.sort_by:
                return "desc" === r.sort_type ? n : -n;
              case r.sort_by === d.default.EMOTION_FILTER_NAME:
                return n;
              default:
                return -e
            }
          },
          onChangeSelected: function(t) {
            if (t.get("selected")) {
              var e = o().find(this.without(t), (function(t) {
                  return t.get("selected")
                })),
                n = this.findWhere({
                  preselected: !0
                });
              e && e.set("selected", !1), n && n.set("preselected", !1), this.sort()
            }
          }
        }),
        g = p
    },
    656669: (t, e, n) => {
      n.r(e), n.d(e, {
        get: () => f,
        isFilterActive: () => d,
        isSearchActive: () => h,
        listen: () => g,
        set: () => p,
        unsubscribeListener: () => _
      });
      var i = n(629133),
        o = n.n(i),
        r = n(323344),
        a = n(661533),
        s = (0, r.QStoJSON)((0, r.getQueryString)(), {
          to_arrays: !0
        }) || {},
        c = !o().isEmpty(s.filter),
        l = c ? s.filter : {},
        u = function() {
          var t = (0, r.QStoJSON)((0, r.getQueryString)(), !0),
            e = a.param(o().extend({}, o().omit(t, "filter"), o().isEmpty(l) ? {} : {
              filter: l
            }));
          APP.router.navigate("".concat(window.location.pathname).concat(e ? "?".concat(e) : ""), {
            replace: !0,
            silent: !0,
            trigger: !1
          })
        },
        d = function() {
          return !o().isEmpty(l) && !l.term
        },
        h = function() {
          return !o().isEmpty(l) && Boolean(l.term)
        },
        f = function() {
          var t = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).parse;
          return (void 0 === t ? c : t) ? (0, r.QStoJSON)(a.param(l)) : l
        },
        p = function() {
          c = !1, l = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, u()
        },
        _ = function() {
          p({}), APP.router.off("route", u)
        },
        g = function() {
          return APP.router.on("route", u),
            function() {
              o().find(o().propertyOf(APP.router._events)("route"), {
                callback: u
              }) && _()
            }
        }
    },
    56783: (t, e, n) => {
      n.r(e), n.d(e, {
        MentionsTabContent: () => b
      });
      var i = n(629133),
        o = n.n(i),
        r = n(156040),
        a = n(811149),
        s = n(445368),
        c = n(998798),
        l = n(30514),
        u = n(778636),
        d = n(476933),
        h = n(661533);

      function f(t, e, n, i, o, r, a) {
        try {
          var s = t[r](a),
            c = s.value
        } catch (t) {
          return void n(t)
        }
        s.done ? e(c) : Promise.resolve(c).then(i, o)
      }

      function p(t) {
        return function() {
          var e = this,
            n = arguments;
          return new Promise((function(i, o) {
            var r = t.apply(e, n);

            function a(t) {
              f(r, i, o, a, s, "next", t)
            }

            function s(t) {
              f(r, i, o, a, s, "throw", t)
            }
            a(void 0)
          }))
        }
      }

      function _(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = n, t
      }

      function g(t, e) {
        var n, i, o, r, a = {
          label: 0,
          sent: function() {
            if (1 & o[0]) throw o[1];
            return o[1]
          },
          trys: [],
          ops: []
        };
        return r = {
          next: s(0),
          throw: s(1),
          return: s(2)
        }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
          return this
        }), r;

        function s(r) {
          return function(s) {
            return function(r) {
              if (n) throw new TypeError("Generator is already executing.");
              for (; a;) try {
                if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, r[1])).done) return o;
                switch (i = 0, o && (r = [2 & r[0], o.value]), r[0]) {
                  case 0:
                  case 1:
                    o = r;
                    break;
                  case 4:
                    return a.label++, {
                      value: r[1],
                      done: !1
                    };
                  case 5:
                    a.label++, i = r[1], r = [0];
                    continue;
                  case 7:
                    r = a.ops.pop(), a.trys.pop();
                    continue;
                  default:
                    if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || 6 !== r[0] && 2 !== r[0])) {
                      a = 0;
                      continue
                    }
                    if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
                      a.label = r[1];
                      break
                    }
                    if (6 === r[0] && a.label < o[1]) {
                      a.label = o[1], o = r;
                      break
                    }
                    if (o && a.label < o[2]) {
                      a.label = o[2], a.ops.push(r);
                      break
                    }
                    o[2] && a.ops.pop(), a.trys.pop();
                    continue
                }
                r = e.call(t, a)
              } catch (t) {
                r = [6, t], i = 0
              } finally {
                n = o = 0
              }
              if (5 & r[0]) throw r[1];
              return {
                value: r[0] ? r[1] : void 0,
                done: !0
              }
            }([r, s])
          }
        }
      }
      var b = u.default.extend({
        el: "<div></div>",
        no_content_text: (0, s.i18n)("No mentions found"),
        badge_id: "badge_team_union",
        sound_id: "amo_inbox_sound_mentions",
        collection: d.default.Collection,
        api: o().extend({}, u.default.prototype.api, {
          list: "/v3/inbox/list?filter[team_union]=true"
        }),
        _selectors: function() {
          return o().extend({}, u.default.prototype._selectors.apply(this, arguments), {
            inbox: "#inbox_mentions_aside",
            inbox_container: "#inbox_mentions_list"
          })
        },
        _classes: function() {
          return o().extend({}, u.default.prototype._classes.apply(this, arguments), {
            hidden_inbox: "inbox-holder_hidden",
            inbox_tab_counter: "inbox-messaging__tab-counter",
            list: "inbox-list",
            list_scrolled: "inbox-list--scrolled"
          })
        },
        events: function() {
          return o().extend({}, o().result(u.default.prototype, "events", {}), {
            "click .notification-item--go-to-invite-a-user": "onGoToUsersClick"
          })
        },
        initialize: function() {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            e = t.is_indestructible,
            n = void 0 === e || e,
            i = t.getSelectedId,
            a = void 0 === i ? o().noop : i,
            s = t.getOnboardingParams,
            c = t.getRightContainer,
            l = t.toggleRightContainer,
            d = t.onBeforeRightContainerChange,
            h = t.onRouteChange;
          return this.getSelectedId = a, this.getRightContainer = c, this.toggleRightContainer = l, this.onBeforeRightContainerChange = d, this.onRouteChange = h, this._is_indestructible = n, this._list_scrolled = !1, (0, r.onPageFullyLoaded)(o().bind(this.initGoToNotification, this, s)), u.default.prototype.initialize.apply(this, arguments)
        },
        initGoToNotification: function(t) {
          return p((function() {
            var e, n;
            return g(this, (function(i) {
              switch (i.label) {
                case 0:
                  return [4, t()];
                case 1:
                  return e = i.sent(), n = this, [4, (0, l.subscribeInitGoToNotification)(this.notifications, {
                    id: "go-to-invite-a-user",
                    type: "mentions",
                    params: e
                  })];
                case 2:
                  return n.unsubscribeInitGoToNotification = i.sent(), [2]
              }
            }))
          })).apply(this)
        },
        onGoToUsersClick: function() {
          APP.router.navigate("/settings/users/#invite-a-user", {
            trigger: !0
          })
        },
        canNotFoundNotificationBeShown: function() {
          return 0 === this.notifications.length || 1 === this.notifications.length && "go-to-invite-a-user" === this.notifications.at(0).get("id")
        },
        onSelectItemClick: function(t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            n = h(t.currentTarget),
            i = n.attr("data-id"),
            o = n.find(this._selector("navigation")).attr("href");
          (0, c.isTeamChatOpened)(o) && (t.preventDefault(), this.navigateToChat(i, o, function(t) {
            for (var e = 1; e < arguments.length; e++) {
              var n = null != arguments[e] ? arguments[e] : {},
                i = Object.keys(n);
              "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(t) {
                return Object.getOwnPropertyDescriptor(n, t).enumerable
              })))), i.forEach((function(e) {
                _(t, e, n[e])
              }))
            }
            return t
          }({
            silent: !0
          }, e))), u.default.prototype.onSelectItemClick.apply(this, arguments)
        },
        navigateToChat: function(t, e) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          !1 !== this.onBeforeRightContainerChange() && (APP.router.navigate(e, {
            trigger: n.trigger || !1
          }), n.trigger || this.onRouteChange(null, [t], {
            silent: n.silent
          }))
        },
        canNotFoundNotificationBeRemoved: function() {
          var t = this;
          return !(1 === this.notifications.length && "fake" === this.notifications.at(0).get("id") || 2 === this.notifications.length && o().every(["go-to-invite-a-user", "fake"], (function(e) {
            return t.notifications.get(e)
          })))
        },
        canMultiactionsBeShown: function() {
          var t = ["fake", "go-to-invite-a-user"],
            e = !0;
          return this.notifications.length < 3 && (e = o().every(this.notifications.models, (function(e) {
            return !1 === o().includes(t, e.id)
          }))), e
        },
        createGroupChat: function() {
          var t = (0, c.getChatsMentionsResourceUrl)("create");
          !1 !== this.onBeforeRightContainerChange() && (APP.router.navigate(t, {
            trigger: !1
          }), this.onRouteChange(null, ["mentions", "create"], {
            silent: !0
          }), u.default.prototype.createGroupChat.apply(this, arguments))
        },
        _toggleDirectChatOpenedState: function(t, e) {
          this.toggleRightContainer(t, e)
        },
        _getDirectChatContainer: function() {
          return this.getRightContainer()
        },
        onItemSelected: function() {
          (0, c.isTeamChatOpened)() && u.default.prototype.onItemSelected.apply(this, arguments)
        },
        connect: function() {
          return p((function() {
            var t = arguments;
            return g(this, (function(e) {
              switch (e.label) {
                case 0:
                  return this._is_indestructible ? [3, 2] : [4, this.afterFilterInit()];
                case 1:
                  e.sent(), e.label = 2;
                case 2:
                  return [2, u.default.prototype.connect.apply(this, t)]
              }
            }))
          })).apply(this)
        },
        initAllPromises: function() {
          return this.promise_all_init = Promise.all([this.requestBadge(), this.connect(), this.initSource(), this.initMultiaction(), this.requestPushPermission()]), this.promise_all_init
        },
        toggle: function() {
          this._is_opened ? this.hide() : this.show()
        },
        onVirtualizedListScroll: function(t) {
          t <= 0 && this._list_scrolled ? (this._list_scrolled = !1, this._elem("list").removeClass(this._class("list_scrolled"))) : this._list_scrolled || (this._list_scrolled = !0, this._elem("list").addClass(this._class("list_scrolled"))), u.default.prototype.onVirtualizedListScroll.apply(this, arguments)
        },
        show: function() {
          var t = this,
            e = h.Deferred();
          return this._is_opened ? e.resolve() : (this._toggleClass("active", "inbox", !0), this._toggleClass("hide_animation", "inbox", !1), this._toggleClass("show_animation", "inbox", !0), this.$el.one("animationend", (function() {
            t.showLoading(), t.afterFirstLoad().then((function() {
              t._onShow(), t.hideLoading(), e.resolve()
            }))
          }))), this._is_opened = !0, u.default.prototype.show.apply(this), e.promise()
        },
        hide: function() {
          var t = this;
          this.destroyQuickActionMenu(), this.closeDirectChat().then((function() {
            t._onHide(), t._toggleClass("active", "inbox", !1), t._toggleClass("hide_animation", "inbox", !0), t._toggleClass("show_animation", "inbox", !1), u.default.prototype.hide.apply(t), APP.is_touch_device && t._releaseBodyPosition()
          })), this._is_opened = !1
        },
        _onShow: function() {
          this.inbox_fully_opened = !0, this.onInboxListModify(), this.autoloadContent(), this.readable_ids.length > 0 && this.read({
            id: this.readable_ids
          })
        },
        _onHide: function() {
          this.inbox_fully_opened = !1, this.loader && this.loader.destroy()
        },
        initSearch: function() {
          var t = this;
          return u.default.prototype.initSearch.call(this, {
            onFilterToggle: this.options.onFilterToggle || o().noop,
            onFilterItems: function(e) {
              (0, c.isImboxSection)() && (t.data = [], t.showLoading(), t.multiactionClose(), t.loadData(e))
            }
          })
        },
        processNotificationFetch: function(t, e) {
          var n = this,
            i = {};
          return e.choose_all && o().contains(["read", "delete"], t) && (i.team = !0), a.default.fetchAction(t, e, i).then((function(t) {
            t._embedded && t._embedded.clear && n.resetFilter()
          }))
        },
        addNotification: function(t) {
          return o().propertyOf(t.get("entity"))("id") === this.getSelectedId() && t.set("selected", !0), u.default.prototype.addNotification.apply(this, arguments)
        },
        excludeTypeEntryCheck: function(t) {
          var e = t.get("chat_source"),
            n = o().propertyOf(t.get("entity"))("type"),
            i = o().propertyOf(t.get("linked_entity"))("type"),
            r = o().includes(["chat_group", "chat_direct"], n),
            a = o().includes(["chat", "entity_chat"], i);
          return !((r || a) && !e)
        },
        _getChatView: function(t) {
          return p((function() {
            return g(this, (function(e) {
              switch (e.label) {
                case 0:
                  switch (o().propertyOf(t)(["click", "type"])) {
                    case "chat_group":
                      return [3, 1];
                    case "chat_group_create":
                      return [3, 3];
                    case "chat_direct":
                      return [3, 5]
                  }
                  return [3, 5];
                case 1:
                  return [4, Promise.all([n.e(95882), n.e(41203), n.e(15656), n.e(71928), n.e(35969), n.e(90256), n.e(40681)]).then(n.bind(n, 508851))];
                case 2:
                  return [2, e.sent().default];
                case 3:
                  return [4, Promise.all([n.e(95882), n.e(41203), n.e(15656), n.e(71928), n.e(35969), n.e(90256), n.e(66231)]).then(n.bind(n, 15208))];
                case 4:
                  return [2, e.sent().default];
                case 5:
                  return [4, Promise.all([n.e(95882), n.e(41203), n.e(15656), n.e(71928), n.e(35969), n.e(90256), n.e(54581), n.e(13248)]).then(n.bind(n, 329856))];
                case 6:
                  return [2, e.sent().default];
                case 7:
                  return [2]
              }
            }))
          }))()
        },
        getCounterEl: function() {
          return this._elem("inbox_tab_counter")
        },
        destroy: function() {
          return o().isFunction(this.unsubscribeInitGoToNotification) && this.unsubscribeInitGoToNotification(), u.default.prototype.destroy.apply(this, arguments)
        }
      })
    },
    476933: (t, e, n) => {
      n.r(e), n.d(e, {
        Model: () => b,
        default: () => y
      });
      var i = n(629133),
        o = n.n(i),
        r = n(345839),
        a = n.n(r),
        s = n(998798),
        c = n(641228);

      function l(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
      }

      function u(t, e) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
      }

      function d(t, e, n) {
        return e && u(t.prototype, e), n && u(t, n), t
      }

      function h(t, e, n) {
        return h = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, n) {
          var i = function(t, e) {
            for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = f(t)););
            return t
          }(t, e);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, e);
            return o.get ? o.get.call(n || t) : o.value
          }
        }, h(t, e, n || t)
      }

      function f(t) {
        return f = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
          return t.__proto__ || Object.getPrototypeOf(t)
        }, f(t)
      }

      function p(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
        t.prototype = Object.create(e && e.prototype, {
          constructor: {
            value: t,
            writable: !0,
            configurable: !0
          }
        }), e && _(t, e)
      }

      function _(t, e) {
        return _ = Object.setPrototypeOf || function(t, e) {
          return t.__proto__ = e, t
        }, _(t, e)
      }

      function g(t) {
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
          var n, i = f(t);
          if (e) {
            var o = f(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(t, e) {
            return !e || "object" != ((n = e) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof e ? function(t) {
              if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return t
            }(t) : e;
            var n
          }(this, n)
        }
      }
      var b = function(t) {
        p(n, t);
        var e = g(n);

        function n() {
          return l(this, n), e.apply(this, arguments)
        }
        return d(n, [{
          key: "parseAttributes",
          value: function(t, e) {
            var i = {
              disable_more_content_button: !0
            };
            switch (!0) {
              case !o().isUndefined(t.lead):
                o().extend(i, {
                  web_link: (0, s.getChatsMentionsResourceUrl)("leads", t.lead)
                }), "click" === e && (i.click = null);
                break;
              case !o().isUndefined(t.customer):
                o().extend(i, {
                  web_link: (0, s.getChatsMentionsResourceUrl)("customers", t.customer)
                }), "click" === e && (i.click = null);
                break;
              case !o().isUndefined(t.chat_direct):
                o().extend(i, h(f(n.prototype), "parseAttributes", this).apply(this, arguments), {
                  web_link: (0, s.getChatsMentionsResourceUrl)(t.chat_direct)
                });
                break;
              case !o().isUndefined(t.chat_bot):
                o().extend(i, h(f(n.prototype), "parseAttributes", this).apply(this, arguments), {
                  web_link: (0, s.getChatsMentionsResourceUrl)(t.chat_bot)
                });
                break;
              case !o().isUndefined(t.chat_group):
                o().extend(i, h(f(n.prototype), "parseAttributes", this).apply(this, arguments), {
                  web_link: (0, s.getChatsMentionsResourceUrl)(t.chat_group)
                });
                break;
              default:
                o().extend(i, h(f(n.prototype), "parseAttributes", this).apply(this, arguments))
            }
            return i
          }
        }]), n
      }(c.Model);
      const y = {
        Collection: function(t) {
          p(n, t);
          var e = g(n);

          function n() {
            return l(this, n), e.apply(this, arguments)
          }
          return d(n, [{
            key: "model",
            get: function() {
              return b
            }
          }, {
            key: "comparator",
            value: function(t) {
              switch (!0) {
                case "fake" === t.id && "user_not_found" === t.get("type"):
                  return 1 / 0;
                case "go-to-invite-a-user" === t.id:
                  return Number.MAX_SAFE_INTEGER;
                default:
                  return h(f(n.prototype), "comparator", this).apply(this, arguments)
              }
            }
          }, {
            key: "sort",
            value: function() {
              return a().Collection.prototype.sort.apply(this, arguments)
            }
          }]), n
        }(c.Collection),
        Model: b
      }
    },
    701291: (t, e, n) => {
      n.r(e), n.d(e, {
        default: () => _,
        getInitialSortOrder: () => g
      });
      var i = n(661533),
        o = n.n(i),
        r = n(629133),
        a = n.n(r),
        s = n(313981);

      function c(t, e) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
      }

      function l(t, e, n) {
        return l = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(t, e, n) {
          var i = function(t, e) {
            for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = u(t)););
            return t
          }(t, e);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, e);
            return o.get ? o.get.call(n || t) : o.value
          }
        }, l(t, e, n || t)
      }

      function u(t) {
        return u = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
          return t.__proto__ || Object.getPrototypeOf(t)
        }, u(t)
      }

      function d(t, e) {
        return d = Object.setPrototypeOf || function(t, e) {
          return t.__proto__ = e, t
        }, d(t, e)
      }

      function h(t) {
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
          var n, i = u(t);
          if (e) {
            var o = u(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(t, e) {
            return !e || "object" != ((n = e) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof e ? function(t) {
              if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return t
            }(t) : e;
            var n
          }(this, n)
        }
      }
      var f = "amo_inbox_messaging_sort",
        p = {
          sort_by: "last_message_at",
          sort_type: "desc"
        },
        _ = function(t) {
          ! function(t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
            t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                writable: !0,
                configurable: !0
              }
            }), e && d(t, e)
          }(r, t);
          var e, n, i = h(r);

          function r() {
            return function(t, e) {
              if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, r), i.apply(this, arguments)
          }
          return e = r, n = [{
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
            key: "events",
            value: function() {
              return {
                "click .js-read-sort": "onSortChange",
                "click .search-more__item-header": "onSearchMoreItemHeaderClick"
              }
            }
          }, {
            key: "initialize",
            value: function() {
              var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
              l(u(r.prototype), "initialize", this).apply(this, arguments);
              var e = t.onSelect,
                n = void 0 === e ? a().noop : e,
                i = JSON.parse(localStorage.getItem(f));
              this.onSelect = n, this.order = i || p, this._prepareSort()
            }
          }, {
            key: "onSortChange",
            value: function(t) {
              this.changeSortState(t), this.onSelect(this.order)
            }
          }, {
            key: "changeSortState",
            value: function(t) {
              var e = o()(t.currentTarget);
              e.hasClass(this._class("selected_sort_option")) || (this._elem("sort_buttons").removeClass(this._class("selected_sort_option")), e.addClass(this._class("selected_sort_option")), this.order = {
                sort_by: e.attr("data-sort-by"),
                sort_type: e.attr("data-sort-type")
              }, localStorage.setItem(f, JSON.stringify(this.order)))
            }
          }, {
            key: "_prepareSort",
            value: function() {
              this._findElem("selected_sort_by", this.order.sort_by, this.order.sort_type).addClass(this._class("selected_sort_option"))
            }
          }, {
            key: "onSearchMoreItemHeaderClick",
            value: function(t) {
              t.stopPropagation()
            }
          }], n && c(e.prototype, n), r
        }(s.default);

      function g() {
        var t, e, n, i;
        try {
          if (!(t = JSON.parse(localStorage.getItem(f))) || !a().isObject(t)) throw new Error("No sort in LS")
        } catch (e) {
          t = p
        }
        return e = {}, n = t.sort_by, i = t.sort_type, n in e ? Object.defineProperty(e, n, {
          value: i,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[n] = i, e
      }
    },
    962444: (t, e, n) => {
      n.r(e), n.d(e, {
        default: () => l
      });
      var i = n(629133),
        o = n.n(i),
        r = n(987081),
        a = n(128508),
        s = n(661533),
        c = {
          list: "/ajax/v4/inbox/list",
          default_list: "/ajax/v4/inbox/list",
          multiaction: "/ajax/v4/inbox/edit"
        };

      function l(t) {
        var e, n = !0,
          i = {},
          l = s.Deferred();
        return {
          init: function(u) {
            var d;
            (e = new r.Subject).pipe(a.switchMap((function(e) {
              return d = e.deferred, u = e.options, h = e.noContent, (u = u || {}).reset && (n = !0), f = function(e, u) {
                return r.defer((function() {
                  var d;
                  return n ? ((c.list === c.default_list || e.reset) && (i = {
                    limit: t,
                    order: e.order,
                    filter: e.filter
                  }), e.term && (i.query = {
                    message: e.term
                  }), d = s.ajaxPromisify({
                    url: e.reset ? c.default_list : c.list,
                    data: i
                  }), r.from(d).pipe(a.map((function(t) {
                    if (l.resolve(o().propertyOf(t)(["filter", "presets"]) || []), o().isUndefined(t)) return n = !1, [];
                    c.list = t._links.next ? t._links.next.href : t._links.self.href;
                    var e = t._embedded.talks;
                    return o().map(e, (function(t) {
                      return t
                    }))
                  })), a.flatMap((function(e) {
                    return e.length < t && (n = !1), r.from(e)
                  })), a.tap({
                    next: function() {
                      o().isFunction(u) && u(!1)
                    },
                    error: function() {
                      return o().isFunction(u) && u(!0), l.reject(), r.from([])
                    }
                  }))) : Promise.reject()
                }))
              }(u, h).pipe(a.filter((function() {
                return !0
              })), a.take(t)), r.onErrorResumeNext(f).pipe(a.toArray());
              var u, h, f
            })), a.catchError((function(t) {
              u({
                error: t
              }, d)
            }))).subscribe((function(t) {
              u({
                items: t
              }, d)
            }))
          },
          onNewOption: function(t, n, i) {
            e.next({
              options: t,
              noContent: n,
              deferred: i
            })
          },
          handleMultiaction: function(t, e) {
            return s.ajax({
              url: c.multiaction,
              type: "POST",
              data: o().extend({
                action: t
              }, e)
            })
          },
          getPresets: function() {
            return l.promise()
          },
          isFinished: function() {
            return !n
          }
        }
      }
    },
    363119: (t, e, n) => {
      n.r(e), n.d(e, {
        default: () => a
      });
      var i = n(629133),
        o = n.n(i),
        r = n(661533);
      const a = {
        showMainOverlay: function(t, e) {
          this._$overlay = r('<div class="default-overlay widget-settings__overlay" id="service_overlay" style="z-index: 101"><span class="spinner-icon expanded spinner-icon-abs-center" id="service_loader"></span></div>'), e && (e.position_absolute && this._$overlay.css("position", "absolute"), o().isNumber(e.z_index) && this._$overlay.css("z-index", e.z_index), e.offset_left_menu && this._$overlay.css("left", r("#left_menu").width()), e.isDefaultOverlay && this._$overlay.removeClass("widget-settings__overlay")), t.append(this._$overlay), this._$overlay.trigger("overlay:show")
        },
        hideMainOverlay: function() {
          this._$overlay && (this._$overlay.trigger("overlay:hide", {
            instantly: !0
          }), this._$overlay.remove(), this._$overlay = null)
        }
      };
      var s = "../build/transpiled/interface/settings/widgets/helpers/overlay";
      window.define(s, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([s])
    },
    315243: (t, e, n) => {
      var i;
      n.r(e), n.d(e, {
          AvailableSearchEntities: () => i
        }),
        function(t) {
          t.INBOX = "inbox", t.LEADS = "leads", t.TEAM = "team"
        }(i || (i = {}))
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
      e && (t._sentryDebugIds = t._sentryDebugIds || {}, t._sentryDebugIds[e] = "7fccd7ae-a4da-4fe7-a3d0-f9c4e9111aaa", t._sentryDebugIdIdentifier = "sentry-dbid-7fccd7ae-a4da-4fe7-a3d0-f9c4e9111aaa")
    } catch (t) {}
  }();
//# sourceMappingURL=93430.34b2c165c075748fad19.js.map