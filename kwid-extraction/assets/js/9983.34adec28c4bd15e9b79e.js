/*! For license information please see 9983.34adec28c4bd15e9b79e.js.LICENSE.txt */
(window.webpackChunk = window.webpackChunk || []).push([
  [9983], {
    574253: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => i
      });
      const i = {
        titleMessageB2C: "ea55bfa2",
        notificationInnerTitleMessageB2C: "a255d0464"
      }
    },
    562584: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => i
      });
      const i = {
        wrapper: "a1be419f4",
        content: "a68a8ba28",
        "arrow--top": "a3e6dcc0e",
        "arrow--bottom": "a6bb1cf07",
        "arrow--right": "a5a68fc80",
        "arrow--left": "a38565be3",
        picture: "a7084cb71",
        image: "a5fe3cee4",
        title: "a5eb0dcea",
        text: "a55a2b8cc",
        buttons: "bd51a418",
        "close-button": "a3459a3d8"
      }
    },
    398457: e => {
      function t(e) {
        if (!e) throw new Error("missing options");
        if (!e.handler) throw new Error("missing handler parameter");
        this.scrollElement = e.scrollElement || window, this.conditions = e.conditions || {}, this.handler = e.handler, this.values = {}, this.tracked = {}, this.success = !1, this.throttleVal = e.throttle || 100, this.processing = !1, this.stopped = !1, this._parse(), "pageYOffset" in this.scrollElement ? (this._addBottom(), this._addTop()) : (this._addBottomEl(), this._addTopEl(), this._addScrollLeft()), this._addWidth(), this._onScroll()
      }
      t.prototype.addCondition = function(e, t) {
        this.conditions[e] = t, this._parse()
      }, t.prototype.removeCondition = function(e) {
        delete this.conditions[e], this._parse()
      }, t.prototype.addTracker = function(e, t) {
        this.tracked[e] = {
          cb: t,
          name: e
        }
      }, t.prototype._addBottom = function() {
        this.addTracker("bottom", (function(e) {
          return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - (e.pageYOffset + e.innerHeight)
        }))
      }, t.prototype._addTop = function() {
        this.addTracker("top", (function(e) {
          return e.pageYOffset
        }))
      }, t.prototype._addBottomEl = function() {
        this.addTracker("bottom", (function(e) {
          return Math.max(e.scrollHeight, e.offsetHeight) - (e.scrollTop + e.offsetHeight)
        }))
      }, t.prototype._addTopEl = function() {
        this.addTracker("top", (function(e) {
          return e.scrollTop
        }))
      }, t.prototype._addScrollLeft = function() {
        this.addTracker("scrollLeft", (function(e) {
          return e.scrollLeft
        }))
      }, t.prototype._addWidth = function() {
        this.addTracker("width", (function(e) {
          return e.innerWidth
        }))
      }, t.prototype._parse = function() {
        for (var e in this._parsed = {}, this._wantedTrackers = [], this._parsedMax = {}, this._parsedMin = {}, this.conditions)
          if (this.conditions.hasOwnProperty(e)) switch (e.substr(0, 4)) {
            case "min-":
              this._wantedTrackers.push(e.substr(4, e.length)), this._parsedMin[e.substr(4, e.length)] = this.conditions[e];
              break;
            case "max-":
              this._wantedTrackers.push(e.substr(4, e.length)), this._parsedMax[e.substr(4, e.length)] = this.conditions[e];
              break;
            default:
              this._wantedTrackers.push(e), this._parsed[e] = this.conditions[e]
          }
      }, t.prototype._check = function() {
        var e = [];
        for (var t in this.values) this._parsed.hasOwnProperty(t) && e.push(this._parsed[t] == this.values[t]), this._parsedMin.hasOwnProperty(t) && e.push(this._parsedMin[t] <= this.values[t]), this._parsedMax.hasOwnProperty(t) && e.push(this._parsedMax[t] >= this.values[t]);
        if (e.length && -1 == e.indexOf(!1)) {
          this.processing = !0;
          var n = this._done.bind(this);
          window.requestAnimationFrame(this.handler.bind(this, this.values, n))
        }
      }, t.prototype._done = function() {
        this.processing = !1
      }, t.prototype._onScroll = function() {
        this._onScrollHandler = this._throttledHandler(), this.scrollElement.addEventListener("scroll", this._onScrollHandler, !1)
      }, t.prototype._throttledHandler = function() {
        var e = this;
        return this.throttle((function(t) {
          if (e._wantedTrackers.length && !e.processing) {
            for (var n = 0; n < e._wantedTrackers.length; n++) e.tracked[e._wantedTrackers[n]] && (e.values[e._wantedTrackers[n]] = e.tracked[e._wantedTrackers[n]].cb(e.scrollElement || window));
            window.requestAnimationFrame(e._check.bind(e))
          }
        }), this.throttleVal)
      }, t.prototype.stop = function() {
        this.stopped || (this.scrollElement.removeEventListener("scroll", this._onScrollHandler, !1), this.stopped = !0)
      }, t.prototype.resume = function() {
        this.stopped && this._onScroll(), this.stopped = !1
      }, t.prototype.throttle = function(e, t) {
        var n, i = !0;
        return function() {
          var o = this,
            r = arguments;
          if (i) return e.apply(o, r), void(i = !1);
          n || (n = !0, setTimeout((function() {
            e.apply(o, r), n = !1
          }), t))
        }
      }, e.exports && (e.exports = t);
      var n = "steady";
      window.define(n, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof e === t ? void 0 : e.exports : __WEBPACK_AMD_DEFINE_RESULT__ : __webpack_exports__;
        return n && n.default || n
      })), window.require([n])
    },
    537107: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => N
      });
      var i = n(661533),
        o = n.n(i),
        r = n(629133),
        a = n.n(r),
        s = n(460159),
        l = n.n(s),
        c = n(809228),
        u = n.n(c),
        d = n(267651),
        h = n.n(d),
        f = n(846257),
        _ = n(313981),
        p = n(445368),
        m = n(500034),
        v = n(450422),
        g = n(998798),
        y = n(926168),
        b = n(859200),
        w = n(464702),
        C = n(509372),
        S = n(922789);

      function E(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function k(e, t, n, i, o, r, a) {
        try {
          var s = e[r](a),
            l = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function x(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var r = e.apply(t, n);

            function a(e) {
              k(r, i, o, a, s, "next", e)
            }

            function s(e) {
              k(r, i, o, a, s, "throw", e)
            }
            a(void 0)
          }))
        }
      }

      function P(e, t) {
        return function(e) {
          if (Array.isArray(e)) return e
        }(e) || function(e, t) {
          var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != n) {
            var i, o, r = [],
              a = !0,
              s = !1;
            try {
              for (n = n.call(e); !(a = (i = n.next()).done) && (r.push(i.value), !t || r.length !== t); a = !0);
            } catch (e) {
              s = !0, o = e
            } finally {
              try {
                a || null == n.return || n.return()
              } finally {
                if (s) throw o
              }
            }
            return r
          }
        }(e, t) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return E(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? E(e, t) : void 0
          }
        }(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function A(e, t) {
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
                r = t.call(e, a)
              } catch (e) {
                r = [6, e], i = 0
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
      var I = ["leads", "catalogs"],
        M = "/settings/profile/",
        O = "",
        T = _.default.extend({
          el: o()(document),
          entities: {
            leads: "leads",
            whatsapp: "whatsapp",
            catalogs: "catalogs",
            contacts: "catalogs",
            companies: "contacts",
            events: "stats",
            statsCalls: "stats",
            statsOperday: "stats",
            "todo-line": "todo",
            authlog: "settings",
            widgetsSettings: "amo-market",
            dev: "settings",
            mail: "mail",
            help: "help-center"
          },
          setTelephonyState: function(e) {
            var t = e || {},
              n = t.isEnabled,
              i = t.onClick,
              r = t.ns;
            if (n) {
              if (!i || !r) return;
              var a = o()("#left_menu .nav__notifications");
              return a.find(".calls-list-toggler").length || (o()("#left_menu .nav__notifications").append('<div class="calls-list-toggler"><div class="calls-list-toggler__wrapper"></div><div class="calls-list-toggler__icon"><span class="nav__notifications__counter nav__notifications-call-list__counter js-notifications_call_list_counter" style="display:none;">0</span></div></div>').prepareTransition().addClass("nav__notifications-call-list"), a.addClass("calls-list-active")), O && o()(document).off(O), o()(document).on("click".concat(r), ".calls-list-toggler__wrapper, .calls-list-toggler__icon", (function(e) {
                i.call(this), e.stopPropagation()
              })), void(O = r)
            }
            var s = o()("#left_menu .nav__notifications");
            s.find(".calls-list-toggler").length && (s.prepareTransition().removeClass("nav__notifications-call-list").find(".calls-list-toggler").remove(), o()(document).off("click".concat(r)), s.removeClass("calls-list-active")), O && o()(document).off(O)
          },
          _matching_entities: {
            leads: ["leads"],
            whatsapp: ["whatsapp"],
            catalogs: ["companies", "contacts", "files", "catalogs"],
            settings: ["authlog", "dev", "widgetsSettings", "advanced"],
            stats: ["statsCalls", "events", "statsOperday", "advanced"],
            mail: ["mail"],
            "amo-market": ["widgetsSettings"]
          },
          _partially_matchable: ["chats"],
          _classes: function() {
            return {
              nav_top: "nav__top",
              nav_top_wrapper: "nav__top__wrapper",
              operday_holder: "nav__top__operday-holder",
              item: "nav__menu__item",
              item_selected: "nav__menu__item-selected",
              copy: "js-copy-account-id",
              support_body: "project_info-body-support",
              logo: "project_info-body-logo",
              themes_switcher: "js-themes-switcher",
              help_center_helper: "help-center-helper"
            }
          },
          _selectors: function() {
            return {
              left_menu: "#left_menu",
              links: ".nav__menu__item__link",
              loader: "#page_change_progress",
              nav_menu_up: "#nav_menu_up",
              nav_menu_down: "#nav_menu_down",
              nav_menu: "#nav_menu",
              nav_menu_wrapper: ".nav__menu-wrapper",
              nav_item_by_entity: '.nav__menu__item[data-entity="%s"]',
              widget_naw_item: '.nav__menu__item[data-widget-code="%(widget_code)s"][data-widget-item="%(widget_item)s"]',
              overlay: "#left-menu-overlay:not(.hover-overlay)",
              current_account: ".nav__top__userbar_useraccounts__item--current",
              menu_blocker: ".js-operday-menu-blocker",
              avatar: ".js-avatar-wrapper .js-left-avatar",
              avatar_overlay: ".js-left-avatar-overlay",
              nvTooltip: ".js-avatar-snv-tooltip"
            }
          },
          document_events: function() {
            return {
              "menu:start-hover": "startHoverMenu",
              "menu:stop-hover": "stopHoverMenu"
            }
          },
          initialize: function() {
            for (var e, t, n = this, i = arguments.length, o = new Array(i), r = 0; r < i; r++) o[r] = arguments[r];
            _.default.prototype.initialize.apply(this, o), e = this._elem("item_selected");
            var s = this._getCompleteMatchUrlItem();
            a().isUndefined(s) || (e.removeClass(this._class("item_selected")), (e = s).addClass(this._class("item_selected"))), "Kommo" === APP.constant("current_brand") && this._elem("logo").addClass("logo-kommo"), this.themes_switcher_mounted = !1, this.$_selected_item = e.length ? e : void 0, this.smooth_scroll_interval = null, this.toggle_menu_blocked = !1, this.initEvents(), !(0, m.isFeatureAvailable)("new_com_onboarding") || (0, m.isFeatureAvailable)("userflow") || (0, m.isFeatureAvailable)("system_navigation_v2") || (this._elem("left_menu").append('<div class="help-center-helper"></div>'), this.$help_center_helper = this._elem("help_center_helper"), this.help_center_menu_button = this._elem("nav_item_by_entity", "help").get(0), this._$document.on("help_center_helper:show", (function() {
              n._elem("nav_menu_wrapper").on("scroll", a().bind((function() {
                this.handleHelperPositionChange(this.help_center_menu_button, this.$help_center_helper)
              }), n)), n.initHelpCenterHelper(), n.help_center_helper_available = !0
            }))), this._addComponent(u(), ".js-copy-account-id").on("success", a().bind((function() {
              this._elem("copy").addClass("js-copied"), a().delay(a().bind((function() {
                this._elem("copy").removeClass("js-copied")
              }), this), 800)
            }), this)).on("error", a().bind((function() {
              this._elem("copy").addClass("animated shake"), a().delay(a().bind((function() {
                this._elem("copy").removeClass("animated shake")
              }), this), 200)
            }), this)), (0, m.isFeatureAvailable)("operday") && (0, b.getRights)("oper_day_user_tracking") && (this.operday = this._addComponent(S.default, {
              $holder: this._elem("operday_holder"),
              start_time: Math.floor(Date.now() / 1e3),
              onShowMenuAndBlock: a().bind(this.handleShowMenuAndBlock, this),
              onUnblockMenu: a().bind(this.handleUnblockMenu, this),
              onBlockMenu: a().bind(this.handleBlockMenu, this),
              onCloseMenu: a().bind(this.handleCloseMenu, this)
            })), (0, v.isAmoChatsFullEnabled)() || (0, m.isFeatureAvailable)(m.Features.SYSTEM_NAVIGATION_V2) || (t = h().subscribe("hover_menu:show", a().bind((function(e, n) {
              this.initHoverMenu((function() {
                h().unsubscribe(t), h().publish("hover_menu:show", n)
              }))
            }), this))), this._$document.on("avatar:change", (function(e, t) {
              n.changeAvatarSrc(t)
            })), this._$document.on("avatar:reset", (function() {
              n.resetAvatar()
            }))
          },
          _common_events: {
            "menu:loader:change": "onLoaderChange",
            "page:change:start": "onPageChangeStart",
            "page:change:stop": "onPageChangeStop",
            "page:entity_changed": "onEntityChanged",
            "menu:icon:restore": "onEntityChanged",
            "menu:item:deleted": "onItemDelete",
            "click .js-support": "onSupportClick",
            "click .js-manage-profile": "onManageProfileClick",
            "click .js-account-id": "onAccountIdClick",
            "click .js-logout": "onLogoutClick",
            "click .nav__top": "onNavTopClick",
            "click .user-select-overlay": "onNavTopClick",
            "click .account_selection": "onAccountSelectionClick",
            "click .nav__menu__item": "onMenuClick"
          },
          _touch_events: {
            "scroll .nav__menu-wrapper": "onTouchScroll"
          },
          _desktop_events: {
            "menu:scroll .nav__menu-wrapper": "onMenuScroll",
            "menu:scroll:revert": "onMenuScrollRevert",
            "mousewheel .nav__menu-wrapper": "onWheelScroll",
            "mouseleave #left_menu": "onMouseLeave",
            "mouseenter #nav_menu_down": "onMouseEnter",
            "mouseenter #nav_menu_up": "onMouseEnter",
            "mouseenter #left_menu": "onMouseEnterInitHoverMenu"
          },
          _templates: ["/tmpl/left_menu/aside.twig"],
          initEvents: function() {
            var e = APP.is_touch_device ? this._touch_events : this._desktop_events;
            this.events = a().extend(this._common_events, e), APP.router && this.listenTo(APP.router, "route", a().bind(this.onRouteChanged, this)), this.delegateEvents()
          },
          showNavigationAvatarPromotionTooltip: function() {
            return x((function() {
              var e, t, i;
              return A(this, (function(o) {
                switch (o.label) {
                  case 0:
                    return (e = this).avatarTooltipInitialized ? [3, 2] : (e.avatarTooltipInitialized = !0, [4, Promise.all([Promise.all([n.e(68592), n.e(95882), n.e(60190), n.e(12145), n.e(35534), n.e(92581), n.e(19781), n.e(52044), n.e(9034), n.e(31542), n.e(3473), n.e(32760), n.e(94046), n.e(28422), n.e(47287), n.e(34385), n.e(43323), n.e(35370), n.e(42178)]).then(n.bind(n, 821630)), l()._preload("langs/navigationAvatarTooltip")()])]);
                  case 1:
                    t = P.apply(void 0, [o.sent(), 1]), i = t[0].NavigationAvatarPromotionTooltipView, e.avatarTooltip = e._addComponent(i, {
                      innerElement: e._elem("avatar"),
                      el: e._elem("nvTooltip"),
                      onDestroy: function() {
                        e.avatarTooltipInitialized = !1, e.avatarTooltip = null
                      }
                    }), o.label = 2;
                  case 2:
                    return [2]
                }
              }))
            })).apply(this)
          },
          initHelpCenterHelper: function() {
            var e = this;
            Promise.all([n.e(31542), n.e(85748)]).then(n.bind(n, 785748)).then((function(t) {
              var n = t.default;
              if (e._addComponent(n, {
                  el: e._elem("help_center_helper"),
                  onHelperPositionChange: a().bind((function() {
                    this.handleHelperPositionChange(this.help_center_menu_button, this.$help_center_helper)
                  }), e),
                  onDestroy: a().bind(e.handleHelpCenterHelperDestroy, e),
                  isHelpCenterMenuButton: Boolean(e.help_center_menu_button)
                }), e.help_center_menu_button && "help" !== APP.data.current_entity) {
                var i = e.help_center_menu_button.getBoundingClientRect().top,
                  o = e._elem("nav_menu_wrapper").height();
                e.onMenuScroll({
                  currentTarget: e._elem("nav_menu_wrapper")
                }, i - o + f.MENU_TIP_PADDING)
              } else e.setHelperBottomOffset(e.$help_center_helper)
            }))
          },
          resetAvatar: function() {
            this._elem("avatar_overlay").show();
            var e = this._elem("avatar").css("background-image").replace(/"[^,]*"/, '"' + (0, w.getCDNPath)("/frontend/images/interface/avatars/") + (APP.constant("account").id % 10 + 1) + '.jpeg"');
            this._elem("avatar").css("background-image", e)
          },
          changeAvatarSrc: function(e) {
            var t = this._elem("avatar").css("background-image"),
              n = e.withCDN ? (0, w.getCDNPath)(e.src) : e.src,
              i = t.replace(/"[^,]*"/, '"' + n + '"');
            this._elem("avatar_overlay").hide(), this._elem("avatar").css("background-image", i)
          },
          handleHelpCenterHelperDestroy: function() {
            this._elem("nav_menu_wrapper").off("scroll", a().bind((function() {
              this.handleHelperPositionChange(this.help_center_menu_button, this.$help_center_helper)
            }), this)), this.help_center_helper_available = !1
          },
          getItem: function(e) {
            return a().isEmpty(e.widgetCode) || a().isEmpty(e.widgetItem) ? a().isEmpty(e.id) ? [] : this._elem("nav_item_by_entity", e.id) : this._findElem("widget_naw_item", {
              widget_code: e.widgetCode,
              widget_item: e.widgetItem
            })
          },
          addMenuItem: function(e) {
            var t = {};
            t.item = {
              label: e.item_label,
              description: e.item_description,
              link: e.item_code,
              selected: !1
            }, t.item_name = e.item_name;
            var n = l()({
              ref: "/tmpl/settings/menu_item.twig"
            }).render(t);
            o()("#sidebar").find(".filter__list").append(n)
          },
          handleHelperPositionChange: function(e, t) {
            if (e) {
              var n, i = e.getBoundingClientRect(),
                o = t.height();
              n = i.top + i.height - o + 9, i.height + i.top < this._$window.height() && (t.css("top", "".concat(n, "px")), t.css("bottom", "unset"))
            } else this.setHelperBottomOffset(t)
          },
          removeMenuItem: function(e) {
            o()("#".concat(e)).remove()
          },
          updateItemCounter: function(e) {
            var t = this.getItem(e);
            return t.length ? (e.count <= 0 ? t.find(".js-notifications_counter").hide() : t.find(".js-notifications_counter").html(e.count).show(), this) : this
          },
          onAccountSelectionClick: function(e) {
            this._elem("nav_top").removeClass("expanded"), o()(e.currentTarget).hide().removeClass("account_selection"), this._elem("nav_top_wrapper").removeClass("expanded")
          },
          onNavTopClick: function() {
            if (this.isNotificationsExpanded() || this.toggle_menu_blocked) return !1;
            this.toggleLeftMenu()
          },
          toggleLeftMenu: function() {
            var e = this;
            this.hover_menu && this.hover_menu.isHoverMenuVisible() && this.closeHoverMenu(), this.toggleSubmenus();
            var t = this._elem("nav_top").hasClass("expanded");
            this.toggleOverlay(t).toggleClass("user-select-overlay", t), this.toggleSupportButton(), e.leftMenuPromotionPopup && !t && e.leftMenuPromotionPopup.destroy(), t && (this._elem("current_account").length && this._elem("current_account").get(0).scrollIntoView(!0), this.operday && this.operday.onRerenderWorkspace(), (0, m.isFeatureAvailable)(m.Features.SYSTEM_NAVIGATION_V2_VIEWABLE) && Promise.all([Promise.all([n.e(68592), n.e(31542), n.e(50368)]).then(n.bind(n, 450368)), l()._preload("langs/leftMenuPromotion")()]).then((function(t) {
              var n = P(t, 1)[0].default;
              e.leftMenuPromotionPopup = e._addComponent(n, {
                onClick: function() {
                  e.toggleLeftMenu()
                }
              })
            })))
          },
          onLogoutClick: function(e) {
            window.location.href = o()(e.currentTarget).find("a").attr("href")
          },
          onAccountIdClick: function(e) {
            e.stopPropagation()
          },
          onManageProfileClick: function(e) {
            if (e.stopPropagation(), this.toggle_menu_blocked) return !1;
            if (this.avatarTooltip && this.avatarTooltip.destroy(), e.metaKey || e.ctrlKey) {
              var t = window.open();
              t.opener = null, t.location = M
            } else APP.router.navigate(M, {
              trigger: !0
            }), this.toggleSubmenus(!1), this.toggleOverlay(!1);
            return !1
          },
          onSupportClick: function(e) {
            if (e.preventDefault(), this.toggle_menu_blocked) {
              if ((0, y.isCustomers)()) return;
              (0, g.openSupportChat)(!0)
            } else(0, g.openSupportChat)();
            this.toggleSubmenus(!1), this.toggleOverlay(!1)
          },
          handleShowMenuAndBlock: function() {
            this.onNavTopClick(), this.handleBlockMenu()
          },
          handleCloseMenu: function() {
            this.onNavTopClick()
          },
          handleUnblockMenu: function() {
            this.toggle_menu_blocked = !1, this._elem("menu_blocker").hide()
          },
          handleBlockMenu: function() {
            this.toggle_menu_blocked = !0, this._elem("menu_blocker").show()
          },
          isNotificationsExpanded: function() {
            return this.$notifications || (this.$notifications = o()("#sidebar-notifications")), this.$notifications.hasClass("aside-expanded")
          },
          toggleSubmenus: function(e) {
            this._elem("nav_top").toggleClass("expanded", e), this._elem("nav_top_wrapper").toggleClass("expanded", e), this._elem("left_menu").toggleClass("h-elevated", e), this._elem("operday_holder").toggleClass("expanded", e), this.themes_switcher_mounted ? this._elem("themes_switcher").toggleClass("expanded", e) : this.initThemesSwitcher(e)
          },
          initThemesSwitcher: function() {
            var e = this,
              t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],
              i = this;
            t && Promise.all([n.e(31542), n.e(57803)]).then(n.bind(n, 557803)).then((function(n) {
              var o = n.default;
              i._addComponent(o, {
                el: i._elem("themes_switcher")
              }), e.themes_switcher_mounted = !0, e._elem("themes_switcher").toggleClass("expanded", t)
            }))
          },
          toggleSupportButton: function() {
            APP.constant("account").amojo_enabled || this._elem("support_body").addClass("".concat(this._class("support_body"), "_disabled")).find(".button-input-inner__text").text((0, p.i18n)("The service is not available at the moment"))
          },
          toggleOverlay: function(e) {
            return e ? this._$document.trigger("overlay:fix") : this._findElem("overlay").hasClass("default-overlay-visible") && this._$document.trigger("overlay:unfix"), this._findElem("overlay").removeClass("user-select-overlay").toggleClass("default-overlay-visible", e), this._elem("overlay")
          },
          setHelperBottomOffset: function(e) {
            e.css("bottom", 0), e.css("top", "unset")
          },
          initHoverMenu: function() {
            var e = this,
              t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a().noop;
            if (this.pending_hover_initialization) return this.pending_hover_initialization;
            this.pending_hover_initialization = new Promise((function(i) {
              e.hover_menu || (0, v.isAmoChatsFullEnabled)() || Promise.all([n.e(68592), n.e(95882), n.e(93320)]).then(n.bind(n, 793320)).then((function(t) {
                var n = t.default;
                return e.hover_menu = new n({
                  isNotificationsExpanded: a().bind(e.isNotificationsExpanded, e)
                }), e.hover_menu.init({
                  requestAt: e._initHoverMenuRequestAt
                })
              })).then((function() {
                APP.is_touch_device || (e.onMenuScrollInit(), e._$window.on("resize", a().debounce(a().bind(e.onMenuScrollInit, e), 200))), t(), i()
              }))
            }))
          },
          onPageChangeStart: function() {
            this._elem("loader").closest(this._selector("item")).hasClass(this._class("item_selected")) && this._elem("loader").removeClass("stopped")
          },
          onPageChangeStop: function() {
            this._elem("loader").addClass("stopped")
          },
          getItemInfo: function(e) {
            if (e || (e = this._getSelected()), !this._getSelected()) return {
              is_sub_item: !1,
              main_entity: "",
              id: ""
            };
            var t = this._getSelected().data("entity").split("_");
            return {
              is_sub_item: I.includes(t[0]) && !a().isUndefined(t[1]),
              main_entity: t[0],
              id: t.slice(1).join("_") || ""
            }
          },
          onLoaderChange: function() {
            var e = this._elem("loader").show(),
              t = this.getItemInfo(this._getSelected()),
              n = APP.getBaseEntity();
            this.entities[n] && (n = this.entities[n]), t.is_sub_item && (n = "".concat(t.main_entity, "_").concat(t.id)), this._elem("nav_item_by_entity", n).find(".nav__menu__item__icon").append(e)
          },
          onTouchScroll: function(e) {
            var t = o()(e.currentTarget).scrollTop() > 0;
            this._elem("nav_menu_up").toggleClass("nav__menu-scroller-showed", t), this._elem("nav_menu_down").toggleClass("nav__menu-scroller-showed", !t)
          },
          _linearToPower: function(e, t, n, i) {
            var o = (n[1] - n[0]) / (Math.pow(t[0], i) + Math.pow(t[1], i)),
              r = n[1] - Math.pow(t[1], i) * o;
            return o * Math.pow(e, i) + r
          },
          _stopSmoothScrollInterval: function() {
            clearInterval(this.smooth_scroll_interval), this.smooth_scroll_interval = null
          },
          _reinitSmoothScrollInterval: function(e, t, n) {
            var i = Math.floor(this._linearToPower(e, [0, 100], [25, 1], .5)),
              o = this._elem("nav_menu_wrapper");
            this._stopSmoothScrollInterval(), this.smooth_scroll_interval = setInterval(a().bind((function() {
              this._scrollNotEnd(n) ? o.scrollTop(o.scrollTop() + t) : this.onMouseEnter(n)
            }), this), i)
          },
          offSmoothScroll: function() {
            this._stopSmoothScrollInterval(), this._elem("nav_menu_up").off(".smooth_scroll"), this._elem("nav_menu_down").off(".smooth_scroll")
          },
          startSmoothScroll: function(e) {
            var t = o()(e.currentTarget),
              n = t.height(),
              i = "nav_menu_up" === t.attr("id") ? -3 : 3,
              r = 100 / n * ("nav_menu_up" === t.attr("id") ? n - e.offsetY : e.offsetY);
            this._reinitSmoothScrollInterval(r, i, e)
          },
          _scrollNotEnd: function(e) {
            var t = o()(e.currentTarget),
              n = this._elem("nav_menu_wrapper"),
              i = n[0].scrollHeight,
              r = n[0].scrollTop,
              a = n[0].offsetHeight,
              s = t.attr("id");
            return r > 0 && "nav_menu_up" === s || r + a < i && "nav_menu_down" === s
          },
          onMouseEnterInitHoverMenu: function(e) {
            var t = performance.now();
            this.initHoverMenu((function() {
              o()(e.target).trigger("mouseenter", [{
                requestAt: t
              }])
            }))
          },
          onMouseEnter: function(e) {
            var t, n = o()(e.currentTarget),
              i = this._elem("nav_menu_wrapper"),
              r = this._elem("nav_menu").outerHeight(!0),
              s = i.height();
            if (this.offSmoothScroll(), this._scrollNotEnd(e)) return n.on("mousemove.smooth_scroll", a().bind(this.startSmoothScroll, this)), n.on("mouseleave.smooth_scroll", a().bind(this.offSmoothScroll, this)), this._elem("nav_menu_up").addClass("nav__menu-scroller-showed"), void this._elem("nav_menu_down").addClass("nav__menu-scroller-showed");
            t = "nav_menu_down" === n.attr("id") ? r - s : 0, r > s && (i.trigger("menu:scroll", [t]), e.stopPropagation())
          },
          onMouseLeave: function() {
            this._$document.trigger("menu:scroll:revert")
          },
          onMenuScrollRevert: function() {
            var e = this._elem("nav_menu"),
              t = this._elem("nav_menu_wrapper"),
              n = e.children(".nav__menu__item-selected"),
              i = Math.floor(t.height() / 72),
              r = n.length ? n[0].offsetTop - 72 * Math.floor(i / 2) : 0;
            APP.is_touch_device || a().delay((function() {
              o()("#sidebar").hasClass("aside-expanded") || t.trigger("menu:scroll", [r])
            }), 150)
          },
          onMenuScrollInit: function() {
            var e = this._elem("nav_menu_wrapper").get(0),
              t = this._elem("nav_menu_wrapper").scrollTop(),
              n = t > 0,
              i = e && e.scrollHeight > e.offsetHeight && e.scrollHeight !== e.offsetHeight + t;
            this._elem("nav_menu_up").toggleClass("nav__menu-scroller-showed", n), this._elem("nav_menu_down").toggleClass("nav__menu-scroller-showed", i), i && this._$document.trigger("menu:scroll:revert")
          },
          onMenuScroll: function(e, t) {
            var n = o()(e.currentTarget),
              i = n[0].scrollHeight > n[0].offsetHeight,
              r = t > 0 && i,
              a = t + n.height() < n.children(".nav__menu").outerHeight(!0) && i;
            n.animate({
              scrollTop: t
            }, 100), this._elem("nav_menu_up").toggleClass("nav__menu-scroller-showed", r), this._elem("nav_menu_down").toggleClass("nav__menu-scroller-showed", a)
          },
          onWheelScroll: function(e) {
            var t = this._elem("nav_menu_wrapper").get(0),
              n = this._elem("nav_menu_wrapper").scrollTop() - e.deltaY;
            this.help_center_helper_available && this.handleHelperPositionChange(this.help_center_menu_button, this.$help_center_helper), this._elem("nav_menu_up").toggleClass("nav__menu-scroller-showed", n > 0), this._elem("nav_menu_down").toggleClass("nav__menu-scroller-showed", t.scrollHeight > t.offsetHeight && t.scrollHeight > t.offsetHeight + n)
          },
          onMenuClick: function(e) {
            var t = this,
              n = o()(e.currentTarget),
              i = n.data("entity");
            if (this.toggle_menu_blocked) return !1;
            e.stopPropagation(), e.ctrlKey || e.metaKey || (e.preventDefault(), APP.is_touch_device ? this.initHoverMenu().then((function() {
              t.hover_menu.checkTouchClick(e, i).done((function() {
                t._onMenuClick(n)
              }))
            })) : this._onMenuClick(n))
          },
          _onMenuClick: function(e) {
            return x((function() {
              var t, n;
              return A(this, (function(i) {
                return this.toggleSubmenus(!1), this.toggleOverlay(!1), e.hasClass("nav__menu__item-selected") || this._$document.trigger("page:change:start"), this._elem("left_menu").find(".nav__menu__item").removeClass("nav__menu__item-selected"), e.addClass("nav__menu__item-selected"), this.$_selected_item = e, t = e.children("a").attr("href"), n = this._isStrictPipelineRoute(t) ? this._transformLeadsRoute(t) : t, APP.router.navigate(n, {
                  trigger: !0
                }), [2]
              }))
            })).apply(this)
          },
          _isStrictPipelineRoute: function(e) {
            return e.startsWith("/leads/pipeline")
          },
          _transformLeadsRoute: function(e) {
            var t;
            if (!(null === (t = (0, C.get)("LAST_PLACE_DEALS")) || void 0 === t ? void 0 : t.startsWith("list"))) return e;
            var n = e.split("/");
            return n.splice(2, 0, "list"), n.join("/")
          },
          onItemDelete: function(e, t, n) {
            var i;
            switch (t) {
              case "leads":
              case "catalogs":
                (i = this._elem("nav_item_by_entity", "".concat(t, "_").concat(n.id))).hasClass(this._class("item_selected")) && (this.$_selected_item = this._elem("nav_item_by_entity", t), this.$_selected_item.addClass(this._class("item_selected"))), i.remove(), this._dropElemCache()
            }
          },
          _getCompleteMatchUrlItem: function() {
            var e, t, n = this;
            return this._elem("links").each((function() {
              var i = o()(this),
                r = i.attr("href"),
                s = i.parent().attr("data-entity");
              window.location.pathname === i.attr("href") ? e = i.closest(".nav__menu__item") : r && a().contains(n._partially_matchable, s) && window.location.pathname.split("/")[1] === r.split("/")[1] && (t = i.closest(".nav__menu__item"))
            })), e || t
          },
          _getSubEntityId: function(e) {
            var t, n = window.location.pathname;
            switch (e) {
              case "leads":
                if ("/" === n[n.length - 1] && (n = n.slice(0, -1)), t = n.split("/").slice(-1)[0], isNaN(Number(t))) return "";
                break;
              case "catalogs":
                if (location.pathname.split("/")[1]) switch (n.split("/").slice(-2, -1)[0]) {
                  case "list":
                    t = "contacts_and_companies";
                    break;
                  case "companies":
                    t = "companies";
                    break;
                  case "contacts":
                    t = "contacts";
                    break;
                  case "catalogs":
                    if (t = n.split("/").slice(-1)[0], isNaN(Number(t))) return "";
                    break;
                  default:
                    return ""
                }
                break;
              default:
                return ""
            }
            return t
          },
          _getSelected: function() {
            if (this.$_selected_item && this.$_selected_item.length) return this.$_selected_item
          },
          _isNeedChange: function() {
            var e = this._getSelected(),
              t = APP.getBaseEntity(),
              n = this._matching_entities,
              i = this._getCompleteMatchUrlItem();
            if (!a().isUndefined(i) && i !== e) return !0;
            if (!e) return !1;
            var o = e.attr("data-entity").split("_")[0];
            return t === o && this._getSelected() && this.$_selected_item.addClass("nav__menu__item-selected"), this._getSelected() && this.$_selected_item.addClass("nav__menu__item-selected"), !(t === o || Object.prototype.hasOwnProperty.call(n, o) && a().contains(n[o], t))
          },
          _isChangeCandidate: function(e) {
            var t, n, i, o = e.attr("data-entity"),
              r = this._matching_entities,
              s = this._getCompleteMatchUrlItem(),
              l = APP.getBaseEntity();
            if (!a().propertyOf(s)(0)) {
              if (o === l || Object.prototype.hasOwnProperty.call(r, o) && a().contains(r[o], l)) return !0;
              if (t = o.split("_")[0], n = o.split("_").slice(1).join("_"), I.includes(t)) return "" !== (i = this._getSubEntityId(t)) && Object.prototype.hasOwnProperty.call(r, t) && a().contains(r[t], l) && i === n
            }
            return a().propertyOf(s)(0) === a().propertyOf(e)(0)
          },
          onRouteChanged: function(e) {
            this._isNeedChange() ? this.onEntityChanged(e) : this._$document.trigger("menu:loader:change")
          },
          onEntityChanged: function() {
            var e = APP.getBaseEntity(),
              t = this._isNeedChange(),
              n = this;
            this._elem("left_menu").find(".nav__menu__item").removeClass("js-new-selected").each((function() {
              var i = o()(this);
              if (i.hasClass("nav__menu__item-selected") && !i.hasClass("js-new-selected") && (t || "widget" === e && i.data("widget-code") !== APP.getWidgetsArea().split(":")[1] && i.data("widget-item") !== APP.getWidgetsArea().split(":")[2] && i.hasClass("nav__menu__item__icon-integration")) && i.removeClass("nav__menu__item-selected"), !i.hasClass("nav__menu__item-selected") && (t && n._isChangeCandidate(i) || "widget" === e && i.data("widget-code") === APP.getWidgetsArea().split(":")[1] && i.data("widget-item") === APP.getWidgetsArea().split(":")[2] && i.hasClass("nav__menu__item__icon-integration"))) {
                if (!n._getSelected()) return;
                n._getSelected().removeClass("nav__menu__item-selected").removeClass("js-new-selected"), i.addClass("nav__menu__item-selected").addClass("js-new-selected"), n.$_selected_item = i
              }
            })), this._$document.trigger("menu:loader:change"), t && this.onMouseLeave()
          },
          stopHoverMenu: function() {
            this.hover_menu && this.hover_menu.prependHoverMenu(false)
          },
          startHoverMenu: function() {
            this.hover_menu && this.hover_menu.prependHoverMenu(true)
          },
          isHoverMenuVisible: function() {
            if (this.hover_menu) return this.hover_menu.isHoverMenuVisible()
          },
          closeHoverMenu: function() {
            if (this.hover_menu) return this.hover_menu.closeHoverMenu()
          }
        });
      const N = window.__leftMenuInstance || (window.__leftMenuInstance = new T)
    },
    922789: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => b
      });
      var i = n(629133),
        o = n.n(i),
        r = n(161320),
        a = n.n(r),
        s = n(313981),
        l = n(661533);

      function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }

      function u(e, t, n, i, o, r, a) {
        try {
          var s = e[r](a),
            l = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function d(e) {
        return function() {
          var t = this,
            n = arguments;
          return new Promise((function(i, o) {
            var r = e.apply(t, n);

            function a(e) {
              u(r, i, o, a, s, "next", e)
            }

            function s(e) {
              u(r, i, o, a, s, "throw", e)
            }
            a(void 0)
          }))
        }
      }

      function h(e, t) {
        for (var n = 0; n < t.length; n++) {
          var i = t[n];
          i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
      }

      function f(e, t, n) {
        return f = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
          var i = function(e, t) {
            for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = _(e)););
            return e
          }(e, t);
          if (i) {
            var o = Object.getOwnPropertyDescriptor(i, t);
            return o.get ? o.get.call(n || e) : o.value
          }
        }, f(e, t, n || e)
      }

      function _(e) {
        return _ = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, _(e)
      }

      function p(e, t) {
        return p = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, p(e, t)
      }

      function m(e, t) {
        return function(e) {
          if (Array.isArray(e)) return e
        }(e) || function(e, t) {
          var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != n) {
            var i, o, r = [],
              a = !0,
              s = !1;
            try {
              for (n = n.call(e); !(a = (i = n.next()).done) && (r.push(i.value), !t || r.length !== t); a = !0);
            } catch (e) {
              s = !0, o = e
            } finally {
              try {
                a || null == n.return || n.return()
              } finally {
                if (s) throw o
              }
            }
            return r
          }
        }(e, t) || v(e, t) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
      }

      function v(e, t) {
        if (e) {
          if ("string" == typeof e) return c(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? c(e, t) : void 0
        }
      }

      function g(e) {
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
          var n, i = _(e);
          if (t) {
            var o = _(this).constructor;
            n = Reflect.construct(i, arguments, o)
          } else n = i.apply(this, arguments);
          return function(e, t) {
            return !t || "object" != ((n = t) && "undefined" != typeof Symbol && n.constructor === Symbol ? "symbol" : typeof n) && "function" != typeof t ? function(e) {
              if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return e
            }(e) : t;
            var n
          }(this, n)
        }
      }

      function y(e, t) {
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
                r = t.call(e, a)
              } catch (e) {
                r = [6, e], i = 0
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
      const b = function(e) {
        ! function(e, t) {
          if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
          e.prototype = Object.create(t && t.prototype, {
            constructor: {
              value: e,
              writable: !0,
              configurable: !0
            }
          }), t && p(e, t)
        }(s, e);
        var t, i, r = g(s);

        function s() {
          return function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
          }(this, s), r.apply(this, arguments)
        }
        return t = s, i = [{
          key: "initialize",
          value: function() {
            var e = this,
              t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              n = this,
              i = arguments;
            return d((function() {
              var r;
              return y(this, (function(a) {
                return (r = f(_(s.prototype), "initialize", e)).call.apply(r, [n].concat(function(e) {
                  if (Array.isArray(e)) return c(e)
                }(u = i) || function(e) {
                  if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
                }(u) || v(u) || function() {
                  throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }())), n.onShowMenuAndBlock = t.onShowMenuAndBlock, n.onCloseMenu = t.onCloseMenu, n.onUnblockMenu = t.onUnblockMenu, n.onBlockMenu = t.onBlockMenu, n.$holder = t.$holder, n.$el = l('<div class="operday"></div>'), n.$document = l(document), n.onAjaxCompleteWithThis = o().bind(n.onAjaxComplete, n), n.render(), n.$document.on("ajaxComplete", n.onAjaxCompleteWithThis), [2];
                var u
              }))
            }))()
          }
        }, {
          key: "document_events",
          value: function() {
            return {
              "operday:rerender": "onRerenderWorkspace"
            }
          }
        }, {
          key: "onAjaxComplete",
          value: function(e, t) {
            var n = this,
              i = t.getResponseHeader("X-Oper-Day-State"),
              r = t.getResponseHeader("X-Oper-Day-Expires-In");
            i && (o().isNull(r) || (this._expires_in = r), this.ensureViews((function(e) {
              var t = m(e, 2),
                r = t[0],
                a = t[1];
              switch (!0) {
                case "closed" === i && (!n._state || "open" === n._state):
                  n.current_view && n._destroyComponent(n.current_view), n.onShowMenuAndBlock(), n._state = "closed", n.current_view = n.renderStartOperday(r);
                  break;
                case "open" === i && n._expires_in <= 0 && "expired" !== n._state:
                  n.current_view && n._destroyComponent(n.current_view), n.onShowMenuAndBlock(), n.current_view = n.renderWorkspace(a, !0), n._state = "expired";
                  break;
                case "open" === i && !o().contains(["open", "expired"], n._state):
                  n.current_view && n._destroyComponent(n.current_view), n.current_view = n.renderWorkspace(a), n._state = "open"
              }
            })))
          }
        }, {
          key: "onRerenderWorkspace",
          value: function() {
            this.current_view && o().isFunction(this.current_view.reRender) && this.current_view.reRender()
          }
        }, {
          key: "handleChangeView",
          value: function(e) {
            var t = this;
            this.ensureViews((function(n) {
              var i = m(n, 2),
                o = i[0],
                r = i[1];
              switch (t.current_view && t._destroyComponent(t.current_view), e) {
                case "start":
                  t.onBlockMenu(), t._state = "closed", t.current_view = t.renderStartOperday(o);
                  break;
                case "workspace":
                  t.onUnblockMenu(), t._state = "open", t.current_view = t.renderWorkspace(r, !0)
              }
            }))
          }
        }, {
          key: "render",
          value: function() {
            this.$holder.html(this.$el)
          }
        }, {
          key: "renderStartOperday",
          value: function(e) {
            return this._addComponent(e, {
              $holder: this.$el,
              start_time: a()().startOf("minute").unix(),
              onChangeView: o().bind(this.handleChangeView, this),
              is_last_day_expired: this._expires_in <= 0
            })
          }
        }, {
          key: "renderWorkspace",
          value: function(e, t) {
            return this._addComponent(e, {
              $holder: this.$el,
              onChangeView: o().bind(this.handleChangeView, this),
              onDestroy: o().bind(this.onCloseMenu, this),
              need_fetch: t
            })
          }
        }, {
          key: "ensureViews",
          value: function(e) {
            return d((function() {
              var t, i, o, r, a;
              return y(this, (function(s) {
                switch (s.label) {
                  case 0:
                    return [4, Promise.all([n.e(41389).then(n.bind(n, 41389)), Promise.all([n.e(56740), n.e(68592), n.e(49458), n.e(52383), n.e(45644), n.e(71209), n.e(27956), n.e(27386), n.e(85663), n.e(83711)]).then(n.bind(n, 510566))])];
                  case 1:
                    return t = m.apply(void 0, [s.sent(), 2]), i = t[0], o = i.default, r = t[1], a = r.default, e([o, a]), [2]
                }
              }))
            }))()
          }
        }], i && h(t.prototype, i), s
      }(s.default);
      var w = "../build/transpiled/interface/operday/operday";
      window.define(w, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([w])
    },
    811149: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => u
      });
      var i = n(12615);

      function o(e, t, n, i, o, r, a) {
        try {
          var s = e[r](a),
            l = s.value
        } catch (e) {
          return void n(e)
        }
        s.done ? t(l) : Promise.resolve(l).then(i, o)
      }

      function r(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function a(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            i = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), i.forEach((function(t) {
            r(e, t, n[t])
          }))
        }
        return e
      }
      var s, l, c = (s = function(e, t) {
        var n, i, o, r = arguments;
        return function(e, t) {
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
                  r = t.call(e, a)
                } catch (e) {
                  r = [6, e], i = 0
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
        }(this, (function(s) {
          switch (s.label) {
            case 0:
              return n = r.length > 2 && void 0 !== r[2] ? r[2] : {}, i = {
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                  headers: {
                    "X-Requested-With": "XMLHttpRequest"
                  }
                },
                method: "POST",
                body: JSON.stringify(a({
                  id: t.ids,
                  all: t.choose_all || !1
                }, n))
              }, [4, fetch("/v3/inbox/".concat(e), i)];
            case 1:
              return (o = s.sent()).ok && 200 === o.status ? [2, o.json()] : [2, {
                status: o.status
              }]
          }
        }))
      }, l = function() {
        var e = this,
          t = arguments;
        return new Promise((function(n, i) {
          var r = s.apply(e, t);

          function a(e) {
            o(r, n, i, a, l, "next", e)
          }

          function l(e) {
            o(r, n, i, a, l, "throw", e)
          }
          a(void 0)
        }))
      }, function(e, t) {
        return l.apply(this, arguments)
      });
      const u = {
        fetchAction: function(e, t) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          return i.default.check().fail((function() {
            return {
              status: 401
            }
          })).done((function() {
            return c(e, t, n)
          }))
        }
      };
      var d = "../build/transpiled/network/inbox/api";
      window.define(d, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([d])
    },
    833496: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        default: () => r
      });
      var i = {},
        o = function(e, t) {
          if ("Y" === APP.widgets.list[e].init_once) return i[e] = t
        };
      APP.addNotificationCallback = o;
      const r = {
        addCallback: o,
        execCallbacks: function(e) {
          for (var t in i) i[t](e)
        }
      };
      var a = "../build/transpiled/widgets/notification_subscriber";
      window.define(a, (function() {
        var e = "undefined",
          n = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return n && n.default || n
      })), window.require([a])
    },
    283070: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        BaseInboxCard: () => i.BaseInboxCard
      });
      var i = n(409220)
    },
    409220: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        BaseInboxCard: () => u
      });
      var i = n(60042),
        o = n.n(i),
        r = n(701106),
        a = n(491967),
        s = n(445368),
        l = n(574253),
        c = n(827378),
        u = function(e) {
          var t = e.id,
            n = e.contact,
            i = e.status,
            u = e.updatedAt,
            d = e.children,
            h = e.subtitle,
            f = e.emotion,
            _ = e.shouldShowEmotion,
            p = e.foundMessage,
            m = (null == n ? void 0 : n.name) || "...",
            v = (null == p ? void 0 : p.createdAt) || u;
          return c.createElement("div", {
            className: o()("notification-inner__container_text", {
              "notification-inner__container_text--center": !u
            })
          }, c.createElement("div", {
            className: "notification-inner__info_message"
          }, c.createElement(r.default, {
            type: "h2",
            size: "l",
            className: o()("notification-inner__title_message", l.default.titleMessageB2C)
          }, c.createElement("span", {
            className: "notification-inner__title_message_title"
          }, m), c.createElement("span", {
            className: o()(l.default.notificationInnerTitleMessageB2C, "notification-inner__title_message_talk-id ".concat("closed" === i ? "notification-inner__title_message_talk-id_closed" : "")),
            title: "A".concat(t)
          }, "A".concat(t)), _ && f && c.createElement("div", {
            className: "notification-inner__emotion js-notification_emotion shown",
            "data-id": "120"
          }, c.createElement(a.default, {
            type: "svg",
            name: "common--".concat(f.toLowerCase()),
            className: "notification-inner__emotion__svg"
          }))), (v || 0 === v) && c.createElement("span", {
            className: "notification-inner__data_message"
          }, (0, s.formatDate)(v))), h && c.createElement(r.default, {
            type: "h3",
            size: "l",
            className: "notification-inner__info_message"
          }, h), d)
        }
    },
    135993: (e, t, n) => {
      "use strict";
      var i;
      n.r(t), n.d(t, {
          ArrowPosition: () => i
        }),
        function(e) {
          e.TOP = "top", e.BOTTOM = "bottom", e.LEFT = "left", e.RIGHT = "right"
        }(i || (i = {}))
    },
    975725: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        HelpModal: () => g
      });
      var i = n(827378),
        o = n(292554),
        r = n.n(o),
        a = n(629133),
        s = n.n(a),
        l = n(529062),
        c = n(916569),
        u = n(701106),
        d = n(445368),
        h = n(135993),
        f = n(943233),
        _ = n(562584),
        p = n(827378);

      function m(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }
      var v = r().bind(_.default),
        g = function(e) {
          var t, n, o, r = e.className,
            a = void 0 === r ? "" : r,
            _ = e.contentClass,
            g = void 0 === _ ? "" : _,
            y = e.hasActionButton,
            b = void 0 !== y && y,
            w = e.hideCloseButton,
            C = void 0 !== w && w,
            S = e.title,
            E = e.description,
            k = e.imgUrl,
            x = void 0 === k ? "" : k,
            P = e.srcSet,
            A = void 0 === P ? "" : P,
            I = e.buttonCloseText,
            M = void 0 === I ? (0, d.i18n)("Okay, got it") : I,
            O = e.buttonActionText,
            T = void 0 === O ? "" : O,
            N = e.arrowPosition,
            j = void 0 === N ? h.ArrowPosition.TOP : N,
            H = e.onCloseRequest,
            B = void 0 === H ? s().noop : H,
            R = e.onActionRequest,
            D = void 0 === R ? s().noop : R,
            z = e.onAfterRender,
            L = void 0 === z ? s().noop : z,
            $ = e.isClosedByOutsideClick,
            U = void 0 !== $ && $,
            F = (n = (0, i.useState)(!0), o = 2, function(e) {
              if (Array.isArray(e)) return e
            }(n) || function(e, t) {
              var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
              if (null != n) {
                var i, o, r = [],
                  a = !0,
                  s = !1;
                try {
                  for (n = n.call(e); !(a = (i = n.next()).done) && (r.push(i.value), !t || r.length !== t); a = !0);
                } catch (e) {
                  s = !0, o = e
                } finally {
                  try {
                    a || null == n.return || n.return()
                  } finally {
                    if (s) throw o
                  }
                }
                return r
              }
            }(n, o) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return m(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? m(e, t) : void 0
              }
            }(n, o) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()),
            W = F[0],
            V = F[1],
            q = (0, i.useRef)(null),
            K = function() {
              V(!1), B()
            };
          (0, i.useEffect)((function() {
            var e = function(e) {
              var t;
              U && (q.current && !q.current.contains(e.target) && K(), (null === (t = e.target) || void 0 === t ? void 0 : t.isContentEditable) && K())
            };
            return document.addEventListener("mousedown", e),
              function() {
                document.removeEventListener("mousedown", e)
              }
          }), [U, B]), (0, i.useEffect)((function() {
            L()
          }), []);
          var G = function() {
              K()
            },
            Y = function() {
              D(), K()
            };
          switch (!0) {
            case b && !C:
              t = p.createElement("div", {
                className: v("buttons")
              }, p.createElement(l.Button, {
                theme: l.ButtonPrimaryTheme,
                onClick: Y
              }, T), p.createElement(l.Button, {
                theme: l.ButtonSecondaryTheme,
                onClick: G
              }, M));
              break;
            case b && C:
              t = p.createElement(l.Button, {
                theme: l.ButtonPrimaryTheme,
                onClick: Y
              }, T);
              break;
            case !b && !C:
              t = p.createElement(l.Button, {
                className: v("close-button"),
                theme: l.ButtonSecondaryTheme,
                onClick: G
              }, M);
              break;
            default:
              t = p.createElement(l.Button, {
                theme: l.ButtonSecondaryTheme,
                onClick: G
              }, M)
          }
          return W ? p.createElement("div", {
            className: "".concat(v("wrapper"), " ").concat(v(a))
          }, p.createElement("div", {
            ref: q,
            className: v("content", "arrow--".concat(j), g)
          }, (x || A) && p.createElement("picture", {
            className: v("picture")
          }, p.createElement("img", {
            className: v("image"),
            src: x,
            srcSet: A,
            alt: "image"
          })), p.createElement(u.default, {
            className: v("title"),
            size: "l",
            type: "h2"
          }, S), p.createElement(c.Text, {
            theme: f.TextTheme,
            className: v("text"),
            size: "l"
          }, E), t)) : null
        }
    },
    846257: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        HelpModal: () => i.HelpModal,
        MENU_TIP_PADDING: () => o.MENU_TIP_PADDING
      });
      var i = n(975725),
        o = n(161101)
    },
    161101: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        MENU_TIP_PADDING: () => i
      });
      var i = 20
    },
    943233: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        TextTheme: () => s
      });
      var i = n(916569);

      function o(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var r, a, s = (r = function(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            i = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), i.forEach((function(t) {
            o(e, t, n[t])
          }))
        }
        return e
      }({}, i.TextPrimaryTheme), a = null != (a = {
        "--crm-ui-kit-text-color": "#ffffff"
      }) ? a : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(a)) : function(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(e);
          n.push.apply(n, i)
        }
        return n
      }(Object(a)).forEach((function(e) {
        Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(a, e))
      })), r)
    },
    937585: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        B2CNotificationInboxCard: () => i.B2CNotificationInboxCard
      });
      var i = n(967727)
    },
    181767: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        getMessageWebLink: () => r
      });
      var i = n(323344);

      function o(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }
      var r = function(e, t) {
        if (!t) return e;
        var n, r, a = (n = e.split("?"), r = 2, function(e) {
            if (Array.isArray(e)) return e
          }(n) || function(e, t) {
            var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != n) {
              var i, o, r = [],
                a = !0,
                s = !1;
              try {
                for (n = n.call(e); !(a = (i = n.next()).done) && (r.push(i.value), !t || r.length !== t); a = !0);
              } catch (e) {
                s = !0, o = e
              } finally {
                try {
                  a || null == n.return || n.return()
                } finally {
                  if (s) throw o
                }
              }
              return r
            }
          }(n, r) || function(e, t) {
            if (e) {
              if ("string" == typeof e) return o(e, t);
              var n = Object.prototype.toString.call(e).slice(8, -1);
              return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? o(e, t) : void 0
            }
          }(n, r) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
          }()),
          s = a[0],
          l = a[1],
          c = void 0 === l ? "" : l;
        return "".concat(s).concat((0, i.setQueryParam)({
          t: t.createdAt,
          tid: t.id
        }, {
          query_string: c,
          only_query_string: !0
        }))
      }
    },
    938314: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        getMessageWebLink: () => i.getMessageWebLink
      });
      var i = n(181767)
    },
    226927: (e, t, n) => {
      "use strict";
      var i;
      n.r(t), n.d(t, {
          CardDisplayMode: () => i
        }),
        function(e) {
          e.CHAT = "chat", e.SEARCH = "search"
        }(i || (i = {}))
    },
    141963: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        BodyInbox: () => o.BodyInbox,
        CardDisplayMode: () => i.CardDisplayMode,
        ChatInboxCardProps: () => o.ChatInboxCardProps,
        Contact: () => o.Contact,
        ContentProps: () => o.ContentProps,
        SearchInboxCardProps: () => o.SearchInboxCardProps
      });
      var i = n(226927),
        o = n(828195)
    },
    828195: (e, t, n) => {
      "use strict";
      n.r(t)
    },
    982096: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        B2CNotificationInboxCard: () => u
      });
      var i = n(60042),
        o = n.n(i),
        r = n(500034),
        a = n(226927),
        s = n(584509),
        l = n(827378);

      function c(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var u = function(e) {
        var t, n, i = e.displayMode,
          u = e.isNativeLink,
          d = e.onActionClick,
          h = e.id,
          f = e.isProvider,
          _ = e.isTalk,
          p = e.isPreselected,
          m = e.isSelected,
          v = e.isChecked,
          g = e.isRead,
          y = e.isFavorite,
          b = e.amoLink,
          w = e.customActionHash,
          C = i === a.CardDisplayMode.CHAT && u,
          S = o()("notification__item", "notification-inner", {
            "notification__item_not-multiaction": !f && !_,
            "notification-inner_preselected": p,
            "notification-inner_selected": !p && m,
            "notification--talk": !(0, r.isFeatureAvailable)("global_inbox"),
            notification_checked: v,
            notification__item__unread: i === a.CardDisplayMode.CHAT && !p && !g,
            notification__item_favirites: y
          }),
          E = {
            id: "inbox-notification-".concat(h),
            "data-id": h,
            "data-custom-action-hash": w,
            className: S,
            onClick: d
          };
        return C ? l.createElement("a", (t = function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {},
              i = Object.keys(n);
            "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable
            })))), i.forEach((function(t) {
              c(e, t, n[t])
            }))
          }
          return e
        }({}, E), n = null != (n = {
          href: b
        }) ? n : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : function(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(e);
            n.push.apply(n, i)
          }
          return n
        }(Object(n)).forEach((function(e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
        })), t), l.createElement(s.CardContent, e)) : l.createElement("div", E, l.createElement(s.CardContent, e))
      }
    },
    584509: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        CardContent: () => l
      });
      var i = n(352185),
        o = n(562268),
        r = n(827378);

      function a(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }

      function s(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {},
            i = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
            return Object.getOwnPropertyDescriptor(n, e).enumerable
          })))), i.forEach((function(t) {
            a(e, t, n[t])
          }))
        }
        return e
      }
      var l = function(e) {
        var t = e.webLink,
          n = e.absoluteLink,
          a = e.foundMessage,
          l = function(e, t) {
            if (null == e) return {};
            var n, i, o = function(e, t) {
              if (null == e) return {};
              var n, i, o = {},
                r = Object.keys(e);
              for (i = 0; i < r.length; i++) n = r[i], t.indexOf(n) >= 0 || (o[n] = e[n]);
              return o
            }(e, t);
            if (Object.getOwnPropertySymbols) {
              var r = Object.getOwnPropertySymbols(e);
              for (i = 0; i < r.length; i++) n = r[i], t.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(e, n) && (o[n] = e[n])
            }
            return o
          }(e, ["webLink", "absoluteLink", "foundMessage"]);
        return t ? r.createElement(i.LinkWrapper, {
          webLink: t,
          absoluteLink: n,
          foundMessage: a
        }, r.createElement(o.InnerContent, s({
          foundMessage: a
        }, l))) : r.createElement(o.InnerContent, s({
          foundMessage: a
        }, l))
      }
    },
    734304: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        InnerContent: () => s
      });
      var i = n(827378),
        o = n.n(i),
        r = n(711757),
        a = n(256795),
        s = function(e) {
          var t = e.id,
            n = e.body,
            i = e.contact,
            s = e.avatar || null;
          return o().createElement(o().Fragment, {
            key: "inner-content-".concat(t)
          }, o().createElement(a.AvatarInbox, {
            body: n,
            contact: i,
            profileAvatar: s
          }), o().createElement(r.Content, e))
        }
    },
    330010: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        AvatarInbox: () => d,
        getIconClassName: () => u
      });
      var i = n(60042),
        o = n.n(i),
        r = n(827378),
        a = n(445368),
        s = n(17011),
        l = n(827378);

      function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
        return i
      }
      var u = function(e) {
          switch (e) {
            case "chat_group":
              return "group_chat";
            case "chat":
              return "chats";
            case "chat_direct":
              return !1;
            default:
              return e
          }
        },
        d = function(e) {
          var t, n, i, d, h, f, _ = e.body,
            p = e.profileAvatar,
            m = (0, a.getDefaultAvatar)(null === (t = _.icon) || void 0 === t ? void 0 : t.avatarId),
            v = (h = (0, r.useState)(p || m), f = 2, function(e) {
              if (Array.isArray(e)) return e
            }(h) || function(e, t) {
              var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
              if (null != n) {
                var i, o, r = [],
                  a = !0,
                  s = !1;
                try {
                  for (n = n.call(e); !(a = (i = n.next()).done) && (r.push(i.value), !t || r.length !== t); a = !0);
                } catch (e) {
                  s = !0, o = e
                } finally {
                  try {
                    a || null == n.return || n.return()
                  } finally {
                    if (s) throw o
                  }
                }
                return r
              }
            }(h, f) || function(e, t) {
              if (e) {
                if ("string" == typeof e) return c(e, t);
                var n = Object.prototype.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(n) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? c(e, t) : void 0
              }
            }(h, f) || function() {
              throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()),
            g = v[0],
            y = v[1],
            b = u(null === (n = _.icon) || void 0 === n ? void 0 : n.sub);
          return l.createElement("div", {
            className: "notification-chat__non-select"
          }, l.createElement("div", {
            className: o()({
              "notification-chat__container-img_bot": null === (i = _.icon) || void 0 === i ? void 0 : i.robot,
              "notification-chat__container-img": !(null === (d = _.icon) || void 0 === d ? void 0 : d.robot)
            })
          }, l.createElement("div", {
            className: o()("n-avatar", "notification-inner__avatar")
          }, l.createElement("img", {
            src: g,
            alt: "avatar",
            onError: function() {
              g !== m && y(m)
            }
          })), b && l.createElement("div", {
            className: "notification-chat__container-icon"
          }, l.createElement(s.IconImage, {
            iconClassName: b,
            iconOrigin: _.iconOrigin
          }))))
        }
    },
    593974: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        IconImage: () => r
      });
      var i = n(491967),
        o = n(827378),
        r = function(e) {
          var t = e.iconClassName,
            n = e.iconOrigin;
          return "mail" === t ? o.createElement("img", {
            className: "notification-mail__icon",
            src: "/frontend/images/interface/inbox/icon_notification_mail.png",
            alt: "mail icon"
          }) : n ? o.createElement("img", {
            className: "notification-".concat(n, "__icon"),
            src: n,
            alt: "icon"
          }) : o.createElement(i.default, {
            type: "svg",
            name: "common--".concat(t)
          })
        }
    },
    17011: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        IconImage: () => i.IconImage
      });
      var i = n(593974)
    },
    256795: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        AvatarInbox: () => i.AvatarInbox
      });
      var i = n(330010)
    },
    909899: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        Content: () => s
      });
      var i = n(141963),
        o = n(606108),
        r = n(441925),
        a = n(827378),
        s = function(e) {
          return e.displayMode === i.CardDisplayMode.CHAT ? a.createElement(o.ChatInboxCard, e) : e.displayMode === i.CardDisplayMode.SEARCH ? a.createElement(r.SearchInboxCard, e) : null
        }
    },
    589819: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        ChatInboxCard: () => u
      });
      var i = n(60042),
        o = n.n(i),
        r = n(701106),
        a = n(491967),
        s = n(283070),
        l = n(827378);

      function c(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var u = function(e) {
        var t = e.id,
          n = e.body,
          i = e.typeContact,
          u = e.message,
          d = e.isFavorite,
          h = e.emotion,
          f = e.isTalk,
          _ = e.isChecked;
        return l.createElement(l.Fragment, null, f && l.createElement("label", {
          className: "notification-chat__checkbox control-checkbox"
        }, l.createElement("input", {
          type: "checkbox",
          className: "js-item-checkbox",
          name: "notify_selected",
          id: "cbx_drop_".concat(t),
          value: t,
          checked: _,
          readOnly: !0
        }), l.createElement("span", {
          className: "control-checkbox__helper"
        })), l.createElement(s.BaseInboxCard, function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {},
              i = Object.keys(n);
            "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable
            })))), i.forEach((function(t) {
              c(e, t, n[t])
            }))
          }
          return e
        }({
          shouldShowEmotion: Boolean(h),
          subtitle: n.subtitle
        }, e), n.title && "contacts" !== i && l.createElement("div", {
          className: "notification-inner__info_message"
        }, l.createElement(r.default, {
          type: "h3",
          size: "l",
          className: "notification-inner__title_message notification-inner__container_text_B2C"
        }, l.createElement("span", {
          className: "notification-inner__title_message_title"
        }, n.title))), l.createElement("div", {
          className: "notification-inner__info_message"
        }, l.createElement(r.default, {
          type: "h3",
          size: "l",
          className: "notification-inner__title_message notification-inner__from__message notification-inner__container_text_B2C"
        }, l.createElement("span", {
          className: "notification-inner__title_message_title"
        }, u))), l.createElement("div", {
          className: "notification-inner__controllers"
        }, l.createElement(a.default, {
          type: "svg",
          name: "controls--button-more",
          className: "js-notification-quick-action notification-inner__quick-action"
        }), l.createElement(a.default, {
          type: "svg",
          name: "inbox--outline-star",
          className: o()("js-notification-favorites notification-inner__favorites", {
            "notification-inner__favorites_selected": d
          })
        }))))
      }
    },
    606108: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        ChatInboxCard: () => i.ChatInboxCard
      });
      var i = n(589819)
    },
    461097: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        SearchInboxCard: () => u
      });
      var i = n(60042),
        o = n.n(i),
        r = n(916569),
        a = n(701106),
        s = n(283070),
        l = n(827378);

      function c(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = n, e
      }
      var u = function(e) {
        var t = e.body,
          n = e.message,
          i = e.isOpened,
          u = e.typeContact;
        return l.createElement(s.BaseInboxCard, function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {},
              i = Object.keys(n);
            "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter((function(e) {
              return Object.getOwnPropertyDescriptor(n, e).enumerable
            })))), i.forEach((function(t) {
              c(e, t, n[t])
            }))
          }
          return e
        }({
          subtitle: t.subtitle
        }, e), (t.title || !t.subtitle) && "contacts" !== u && l.createElement("div", {
          className: "notification-inner__info_message"
        }, l.createElement(a.default, {
          type: "h3",
          size: "l",
          className: "notification-inner__title_message notification-inner__container_text_B2C"
        }, l.createElement("span", {
          className: "notification-inner__title_message_title"
        }, t.title || "..."))), t.rows && l.createElement("span", {
          className: o()("notification-inner__from__message", {
            "notification-inner__from__message-fully-opened": i
          })
        }, t.rows.map((function(e, t) {
          return l.createElement(r.Text, {
            key: t,
            theme: r.TextSecondaryDarkTheme,
            size: "l",
            className: o()(e.style, "notification-inner__from__message_height-".concat(e.classHeight))
          }, n)
        }))))
      }
    },
    441925: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        SearchInboxCard: () => i.SearchInboxCard
      });
      var i = n(461097)
    },
    711757: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        Content: () => i.Content
      });
      var i = n(909899)
    },
    562268: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        InnerContent: () => i.InnerContent
      });
      var i = n(734304)
    },
    745409: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        LinkWrapper: () => s
      });
      var i = n(60042),
        o = n.n(i),
        r = n(938314),
        a = n(827378),
        s = function(e) {
          var t = e.children,
            n = e.webLink,
            i = e.foundMessage,
            s = e.absoluteLink,
            l = (0, r.getMessageWebLink)(n, i);
          return a.createElement("a", {
            href: l,
            className: o()({
              "notification-inner__link": s,
              "js-navigate-link notification-inner__navigate-link": !s
            }),
            target: s && "_blank",
            rel: s ? "noreferrer noopener" : void 0
          }, t)
        }
    },
    352185: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        LinkWrapper: () => i.LinkWrapper
      });
      var i = n(745409)
    },
    967727: (e, t, n) => {
      "use strict";
      n.r(t), n.d(t, {
        B2CNotificationInboxCard: () => i.B2CNotificationInboxCard
      });
      var i = n(982096)
    },
    949137: function(e) {
      var t;
      t = function() {
        return function(e) {
          var t = {};

          function n(i) {
            if (t[i]) return t[i].exports;
            var o = t[i] = {
              i,
              l: !1,
              exports: {}
            };
            return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
          }
          return n.m = e, n.c = t, n.i = function(e) {
            return e
          }, n.d = function(e, t, i) {
            n.o(e, t) || Object.defineProperty(e, t, {
              configurable: !1,
              enumerable: !0,
              get: i
            })
          }, n.n = function(e) {
            var t = e && e.__esModule ? function() {
              return e.default
            } : function() {
              return e
            };
            return n.d(t, "a", t), t
          }, n.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
          }, n.p = "", n(n.s = 5)
        }([function(e, t, n) {
          "use strict";
          var i = n(4),
            o = n.n(i),
            r = n(3);
          n.d(t, "a", (function() {
            return a
          }));
          var a = function() {
            function e(t, n) {
              var i = this;
              ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
              }(this, e), this.getRowHeight = function(e) {
                var t = e.index,
                  n = i.options.rowHeight;
                return "function" == typeof n ? n(t) : Array.isArray(n) ? n[t] : n
              }, this.container = t, this.options = n, this.state = {}, this._initializeSizeAndPositionManager(n.rowCount), this.render = this.render.bind(this), this.handleScroll = this.handleScroll.bind(this), this.componentDidMount()
            }
            return e.prototype.componentDidMount = function() {
              var e = this,
                t = this.options,
                n = t.onMount,
                i = t.initialScrollTop,
                o = t.initialIndex,
                r = t.height,
                a = i || null != o && this.getRowOffset(o) || 0,
                s = this.inner = document.createElement("div"),
                l = this.content = document.createElement("div");
              s.setAttribute("style", "position:relative; overflow:hidden; width:100%; min-height:100%; will-change: transform;"), l.setAttribute("style", "position:absolute; top:0; left:0; height:100%; width:100%; overflow:visible;"), s.appendChild(l), this.container.appendChild(s), this.setState({
                offset: a,
                height: r
              }, (function() {
                a && (e.container.scrollTop = a), e.container.addEventListener("scroll", e.handleScroll), "function" == typeof n && n()
              }))
            }, e.prototype._initializeSizeAndPositionManager = function(e) {
              this._sizeAndPositionManager = new r.a({
                itemCount: e,
                itemSizeGetter: this.getRowHeight,
                estimatedItemSize: this.options.estimatedRowHeight || 100
              })
            }, e.prototype.setState = function() {
              var e = this,
                t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                n = arguments[1];
              this.state = Object.assign(this.state, t), requestAnimationFrame((function() {
                e.render(), "function" == typeof n && n()
              }))
            }, e.prototype.resize = function(e, t) {
              this.setState({
                height: e
              }, t)
            }, e.prototype.handleScroll = function(e) {
              var t = this.options.onScroll,
                n = this.container.scrollTop;
              this.setState({
                offset: n
              }), "function" == typeof t && t(n, e)
            }, e.prototype.getRowOffset = function(e) {
              return this._sizeAndPositionManager.getSizeAndPositionForIndex(e).offset
            }, e.prototype.scrollToIndex = function(e, t) {
              var n = this.state.height,
                i = this._sizeAndPositionManager.getUpdatedOffsetForIndex({
                  align: t,
                  containerSize: n,
                  targetIndex: e
                });
              this.container.scrollTop = i
            }, e.prototype.setRowCount = function(e) {
              this._initializeSizeAndPositionManager(e), this.render()
            }, e.prototype.onRowsRendered = function(e) {
              var t = this.options.onRowsRendered;
              "function" == typeof t && t(e)
            }, e.prototype.destroy = function() {
              this.container.removeEventListener("scroll", this.handleScroll), this.container.innerHTML = ""
            }, e.prototype.render = function() {
              for (var e = this.options, t = e.overscanCount, n = e.renderRow, i = this.state, r = i.height, a = i.offset, s = void 0 === a ? 0 : a, l = this._sizeAndPositionManager.getVisibleRange({
                  containerSize: r,
                  offset: s,
                  overscanCount: t
                }), c = l.start, u = l.stop, d = document.createDocumentFragment(), h = c; h <= u; h++) d.appendChild(n(h));
              this.inner.style.height = this._sizeAndPositionManager.getTotalSize() + "px", this.content.style.top = this.getRowOffset(c) + "px", o()(this.content, d, {
                childrenOnly: !0,
                getNodeKey: function(e) {
                  return e.nodeIndex
                }
              }), this.onRowsRendered({
                startIndex: c,
                stopIndex: u
              })
            }, e
          }()
        }, function(e, t, n) {
          "use strict";
          Object.defineProperty(t, "__esModule", {
            value: !0
          });
          var i = n(0);
          n.d(t, "default", (function() {
            return i.a
          }));
          var o = n(2);
          n.d(t, "InfiniteVirtualList", (function() {
            return o.a
          }))
        }, function(e, t, n) {
          "use strict";
          var i = n(0);
          n.d(t, "a", (function() {
            return o
          }));
          var o = function(e) {
            function t() {
              return function(e, t) {
                  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, t),
                function(e, t) {
                  if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                  return !t || "object" != typeof t && "function" != typeof t ? e : t
                }(this, e.apply(this, arguments))
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
            }(t, e), t.prototype.onRowsRendered = function(e) {
              var t = this,
                n = e.startIndex,
                i = e.stopIndex,
                o = this.options,
                r = o.isRowLoaded,
                a = o.loadMoreRows,
                s = o.minimumBatchSize,
                l = void 0 === s ? 10 : s,
                c = o.rowCount,
                u = void 0 === c ? 0 : c,
                d = o.threshold,
                h = void 0 === d ? 15 : d,
                f = function(e) {
                  for (var t = e.isRowLoaded, n = e.minimumBatchSize, i = e.rowCount, o = e.stopIndex, r = [], a = null, s = null, l = e.startIndex; l <= o; l++) t(l) ? null !== s && (r.push({
                    startIndex: a,
                    stopIndex: s
                  }), a = s = null) : (s = l, null === a && (a = l));
                  if (null !== s) {
                    for (var c = Math.min(Math.max(s, a + n - 1), i - 1), u = s + 1; u <= c && !t({
                        index: u
                      }); u++) s = u;
                    r.push({
                      startIndex: a,
                      stopIndex: s
                    })
                  }
                  if (r.length)
                    for (var d = r[0]; d.stopIndex - d.startIndex + 1 < n && d.startIndex > 0;) {
                      var h = d.startIndex - 1;
                      if (t({
                          index: h
                        })) break;
                      d.startIndex = h
                    }
                  return r
                }({
                  isRowLoaded: r,
                  minimumBatchSize: l,
                  rowCount: u,
                  startIndex: Math.max(0, n - h),
                  stopIndex: Math.min(u - 1, i + h)
                });
              f.forEach((function(e) {
                var o = a(e);
                o && o.then((function() {
                  var o;
                  !((o = {
                    lastRenderedStartIndex: n,
                    lastRenderedStopIndex: i,
                    startIndex: e.startIndex,
                    stopIndex: e.stopIndex
                  }).startIndex > o.lastRenderedStopIndex || o.stopIndex < o.lastRenderedStartIndex) && t.render()
                }))
              }))
            }, t
          }(i.a)
        }, function(e, t, n) {
          "use strict";
          n.d(t, "a", (function() {
            return i
          }));
          var i = function() {
            function e(t) {
              var n = t.itemCount,
                i = t.itemSizeGetter,
                o = t.estimatedItemSize;
              ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
              }(this, e), this._itemSizeGetter = i, this._itemCount = n, this._estimatedItemSize = o, this._itemSizeAndPositionData = {}, this._lastMeasuredIndex = -1
            }
            return e.prototype.getLastMeasuredIndex = function() {
              return this._lastMeasuredIndex
            }, e.prototype.getSizeAndPositionForIndex = function(e) {
              if (e < 0 || e >= this._itemCount) throw Error("Requested index " + e + " is outside of range 0.." + this._itemCount);
              if (e > this._lastMeasuredIndex) {
                for (var t = this.getSizeAndPositionOfLastMeasuredItem(), n = t.offset + t.size, i = this._lastMeasuredIndex + 1; i <= e; i++) {
                  var o = this._itemSizeGetter({
                    index: i
                  });
                  if (null == o || isNaN(o)) throw Error("Invalid size returned for index " + i + " of value " + o);
                  this._itemSizeAndPositionData[i] = {
                    offset: n,
                    size: o
                  }, n += o
                }
                this._lastMeasuredIndex = e
              }
              return this._itemSizeAndPositionData[e]
            }, e.prototype.getSizeAndPositionOfLastMeasuredItem = function() {
              return this._lastMeasuredIndex >= 0 ? this._itemSizeAndPositionData[this._lastMeasuredIndex] : {
                offset: 0,
                size: 0
              }
            }, e.prototype.getTotalSize = function() {
              var e = this.getSizeAndPositionOfLastMeasuredItem();
              return e.offset + e.size + (this._itemCount - this._lastMeasuredIndex - 1) * this._estimatedItemSize
            }, e.prototype.getUpdatedOffsetForIndex = function(e) {
              var t = e.align,
                n = void 0 === t ? "start" : t,
                i = e.containerSize,
                o = e.targetIndex;
              if (i <= 0) return 0;
              var r = this.getSizeAndPositionForIndex(o),
                a = r.offset,
                s = a - i + r.size,
                l = void 0;
              switch (n) {
                case "end":
                  l = s;
                  break;
                case "center":
                  l = a - (i - r.size) / 2;
                  break;
                default:
                  l = a
              }
              var c = this.getTotalSize();
              return Math.max(0, Math.min(c - i, l))
            }, e.prototype.getVisibleRange = function(e) {
              var t = e.containerSize,
                n = e.offset,
                i = e.overscanCount;
              if (0 === this.getTotalSize()) return {};
              var o = n + t,
                r = this._findNearestItem(n),
                a = r,
                s = this.getSizeAndPositionForIndex(r);
              for (n = s.offset + s.size; n < o && a < this._itemCount - 1;) a++, n += this.getSizeAndPositionForIndex(a).size;
              return i && (r = Math.max(0, r - i), a = Math.min(a + i, this._itemCount)), {
                start: r,
                stop: a
              }
            }, e.prototype.resetItem = function(e) {
              this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, e - 1)
            }, e.prototype._binarySearch = function(e) {
              for (var t = e.low, n = e.high, i = e.offset, o = void 0, r = void 0; t <= n;) {
                if (o = t + Math.floor((n - t) / 2), (r = this.getSizeAndPositionForIndex(o).offset) === i) return o;
                r < i ? t = o + 1 : r > i && (n = o - 1)
              }
              if (t > 0) return t - 1
            }, e.prototype._exponentialSearch = function(e) {
              for (var t = e.index, n = e.offset, i = 1; t < this._itemCount && this.getSizeAndPositionForIndex(t).offset < n;) t += i, i *= 2;
              return this._binarySearch({
                high: Math.min(t, this._itemCount - 1),
                low: Math.floor(t / 2),
                offset: n
              })
            }, e.prototype._findNearestItem = function(e) {
              if (isNaN(e)) throw Error("Invalid offset " + e + " specified");
              e = Math.max(0, e);
              var t = this.getSizeAndPositionOfLastMeasuredItem(),
                n = Math.max(0, this._lastMeasuredIndex);
              return t.offset >= e ? this._binarySearch({
                high: n,
                low: 0,
                offset: e
              }) : this._exponentialSearch({
                index: n,
                offset: e
              })
            }, e
          }()
        }, function(e, t, n) {
          "use strict";
          var i, o = "undefined" == typeof document ? void 0 : document,
            r = o ? o.body || o.createElement("div") : {},
            a = r.hasAttributeNS ? function(e, t, n) {
              return e.hasAttributeNS(t, n)
            } : r.hasAttribute ? function(e, t, n) {
              return e.hasAttribute(n)
            } : function(e, t, n) {
              return null != e.getAttributeNode(t, n)
            };

          function s(e, t) {
            var n = e.nodeName,
              i = t.nodeName;
            return n === i || !!(t.actualize && n.charCodeAt(0) < 91 && i.charCodeAt(0) > 90) && n === i.toUpperCase()
          }

          function l(e, t, n) {
            e[n] !== t[n] && (e[n] = t[n], e[n] ? e.setAttribute(n, "") : e.removeAttribute(n, ""))
          }
          var c = {
            OPTION: function(e, t) {
              l(e, t, "selected")
            },
            INPUT: function(e, t) {
              l(e, t, "checked"), l(e, t, "disabled"), e.value !== t.value && (e.value = t.value), a(t, null, "value") || e.removeAttribute("value")
            },
            TEXTAREA: function(e, t) {
              var n = t.value;
              if (e.value !== n && (e.value = n), e.firstChild) {
                if ("" === n && e.firstChild.nodeValue === e.placeholder) return;
                e.firstChild.nodeValue = n
              }
            },
            SELECT: function(e, t) {
              if (!a(t, null, "multiple")) {
                for (var n = 0, i = t.firstChild; i;) {
                  var o = i.nodeName;
                  if (o && "OPTION" === o.toUpperCase()) {
                    if (a(i, null, "selected")) break;
                    n++
                  }
                  i = i.nextSibling
                }
                e.selectedIndex = n
              }
            }
          };

          function u() {}

          function d(e) {
            return e.id
          }
          var h = function(e, t, n) {
            if (n || (n = {}), "string" == typeof t)
              if ("#document" === e.nodeName || "HTML" === e.nodeName) {
                var r = t;
                (t = o.createElement("html")).innerHTML = r
              } else l = t, !i && o.createRange && (i = o.createRange()).selectNode(o.body), i && i.createContextualFragment ? h = i.createContextualFragment(l) : (h = o.createElement("body")).innerHTML = l, t = h.childNodes[0];
            var l, h, f, _ = n.getNodeKey || d,
              p = n.onBeforeNodeAdded || u,
              m = n.onNodeAdded || u,
              v = n.onBeforeElUpdated || u,
              g = n.onElUpdated || u,
              y = n.onBeforeNodeDiscarded || u,
              b = n.onNodeDiscarded || u,
              w = n.onBeforeElChildrenUpdated || u,
              C = !0 === n.childrenOnly,
              S = {};

            function E(e) {
              f ? f.push(e) : f = [e]
            }

            function k(e, t) {
              if (1 === e.nodeType)
                for (var n = e.firstChild; n;) {
                  var i = void 0;
                  t && (i = _(n)) ? E(i) : (b(n), n.firstChild && k(n, t)), n = n.nextSibling
                }
            }

            function x(e, t, n) {
              !1 !== y(e) && (t && t.removeChild(e), b(e), k(e, n))
            }

            function P(e) {
              m(e);
              for (var t = e.firstChild; t;) {
                var n = t.nextSibling,
                  i = _(t);
                if (i) {
                  var o = S[i];
                  o && s(t, o) && (t.parentNode.replaceChild(o, t), A(o, t))
                }
                P(t), t = n
              }
            }

            function A(n, i, r) {
              var l, u = _(i);
              if (u && delete S[u], !t.isSameNode || !t.isSameNode(e)) {
                if (!r) {
                  if (!1 === v(n, i)) return;
                  if (function(e, t) {
                      var n, i, o, r, s, l = t.attributes;
                      for (n = l.length - 1; n >= 0; --n) o = (i = l[n]).name, r = i.namespaceURI, s = i.value, r ? (o = i.localName || o, e.getAttributeNS(r, o) !== s && e.setAttributeNS(r, o, s)) : e.getAttribute(o) !== s && e.setAttribute(o, s);
                      for (n = (l = e.attributes).length - 1; n >= 0; --n) !1 !== (i = l[n]).specified && (o = i.name, (r = i.namespaceURI) ? (o = i.localName || o, a(t, r, o) || e.removeAttributeNS(r, o)) : a(t, null, o) || e.removeAttribute(o))
                    }(n, i), g(n), !1 === w(n, i)) return
                }
                if ("TEXTAREA" !== n.nodeName) {
                  var d, h, f, m, y = i.firstChild,
                    b = n.firstChild;
                  e: for (; y;) {
                    for (f = y.nextSibling, d = _(y); b;) {
                      if (h = b.nextSibling, y.isSameNode && y.isSameNode(b)) {
                        y = f, b = h;
                        continue e
                      }
                      l = _(b);
                      var C = b.nodeType,
                        k = void 0;
                      if (C === y.nodeType && (1 === C ? (d ? d !== l && ((m = S[d]) ? b.nextSibling === m ? k = !1 : (n.insertBefore(m, b), h = b.nextSibling, l ? E(l) : x(b, n, !0), b = m) : k = !1) : l && (k = !1), (k = !1 !== k && s(b, y)) && A(b, y)) : 3 !== C && 8 != C || (k = !0, b.nodeValue = y.nodeValue)), k) {
                        y = f, b = h;
                        continue e
                      }
                      l ? E(l) : x(b, n, !0), b = h
                    }
                    if (d && (m = S[d]) && s(m, y)) n.appendChild(m), A(m, y);
                    else {
                      var I = p(y);
                      !1 !== I && (I && (y = I), y.actualize && (y = y.actualize(n.ownerDocument || o)), n.appendChild(y), P(y))
                    }
                    y = f, b = h
                  }
                  for (; b;) h = b.nextSibling, (l = _(b)) ? E(l) : x(b, n, !0), b = h
                }
                var M = c[n.nodeName];
                M && M(n, i)
              }
            }! function e(t) {
              if (1 === t.nodeType)
                for (var n = t.firstChild; n;) {
                  var i = _(n);
                  i && (S[i] = n), e(n), n = n.nextSibling
                }
            }(e);
            var I, M, O = e,
              T = O.nodeType,
              N = t.nodeType;
            if (!C)
              if (1 === T) 1 === N ? s(e, t) || (b(e), O = function(e, t) {
                for (var n = e.firstChild; n;) {
                  var i = n.nextSibling;
                  t.appendChild(n), n = i
                }
                return t
              }(e, (I = t.nodeName, (M = t.namespaceURI) && "http://www.w3.org/1999/xhtml" !== M ? o.createElementNS(M, I) : o.createElement(I)))) : O = t;
              else if (3 === T || 8 === T) {
              if (N === T) return O.nodeValue = t.nodeValue, O;
              O = t
            }
            if (O === t) b(e);
            else if (A(O, t, C), f)
              for (var j = 0, H = f.length; j < H; j++) {
                var B = S[f[j]];
                B && x(B, B.parentNode, !1)
              }
            return !C && O !== e && e.parentNode && (O.actualize && (O = O.actualize(e.ownerDocument || o)), e.parentNode.replaceChild(O, e)), O
          };
          e.exports = h
        }, function(e, t, n) {
          e.exports = n(1)
        }])
      }, e.exports = t();
      var n = "virtualized-list";
      window.define(n, (function() {
        var t = "undefined",
          n = typeof __webpack_exports__ === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof e === t ? void 0 : e.exports : __WEBPACK_AMD_DEFINE_RESULT__ : __webpack_exports__;
        return n && n.default || n
      })), window.require([n])
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "a07aae6d-59f9-4839-8102-a218197a694e", e._sentryDebugIdIdentifier = "sentry-dbid-a07aae6d-59f9-4839-8102-a218197a694e")
    } catch (e) {}
  }();
//# sourceMappingURL=9983.34adec28c4bd15e9b79e.js.map