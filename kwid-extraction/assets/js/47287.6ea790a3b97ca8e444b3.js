"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [47287], {
    280799: (e, n, t) => {
      t.r(n), t.d(n, {
        ContextMenuProvider: () => i,
        ContextMenuRootProvider: () => s,
        DISPLAY_NAME: () => r,
        ROOT_DISPLAY_NAME: () => u,
        useContextMenuContext: () => a,
        useContextMenuRootContext: () => l
      });
      var o = t(818910);
      const r = "ContextMenu",
        [i, a] = (0, o.createComponentContext)(r),
        u = "ContextMenu.Root",
        [s, l] = (0, o.createComponentContext)(u)
    },
    575133: (e, n, t) => {
      t.r(n), t.d(n, {
        ContextMenuMode: () => o
      });
      var o = (e => (e.CLICK = "click", e.HOVER = "hover", e))(o || {})
    },
    670722: (e, n, t) => {
      t.r(n), t.d(n, {
        ContextMenu: () => O
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(879929),
        u = t(280799),
        s = t(819072),
        l = t(974667),
        c = t(465066),
        d = t(751242),
        f = t(959344),
        p = t(187339),
        m = t(709725),
        h = t(12220),
        v = t(211433),
        g = t(260774),
        y = t(911915),
        w = t(510363),
        b = t(258607),
        C = t(18411),
        x = t(891626),
        M = t(666946),
        E = t(720938),
        R = t(494097);
      const O = (0, r.forwardRef)((({
        children: e,
        mode: n,
        onOpen: t,
        isOpen: s,
        defaultOpen: l,
        onAnimatedOpen: c,
        isCloseOnClick: d = !0,
        enableInnerInputFocus: f = !1,
        backgroundFocusBlockerContainers: p = [document.body],
        backgroundFocusBlockerClassName: m,
        ...h
      }, v) => {
        const {
          mode: g,
          open: y,
          onOpenChange: w,
          triggerRef: b,
          contentRef: C,
          inheritedArrowColor: x,
          animatedOpen: M,
          animationDuration: E,
          hoverCloseDelay: R,
          temporaryHoverClose: O,
          closeMenuImmediately: I,
          onMouseEnter: S,
          onMouseLeave: D,
          enableTemporaryHoverClose: P,
          onOpenByKeyboard: L,
          onChildOpen: _,
          onSubmenuOpen: k,
          isRootContentBlocked: T,
          isChildOpen: N,
          itemWithFocusedInput: A,
          setItemWithFocusedInput: F
        } = (0, a.useContextMenu)({
          mode: n,
          defaultOpen: l,
          onOpen: t,
          onAnimatedOpen: c,
          animationDuration: 150,
          hoverCloseDelay: 200,
          isOpen: s,
          enableInnerInputFocus: f,
          backgroundFocusBlockerContainers: p,
          backgroundFocusBlockerClassName: m
        });
        return (0, r.useImperativeHandle)(v, (() => ({
          closeMenuImmediately: I,
          enableTemporaryHoverClose: P,
          onOpenByKeyboard: L
        }))), (0, o.jsx)(u.ContextMenuRootProvider, {
          closeRootMenuImmediately: I,
          itemWithFocusedInput: A,
          setItemWithFocusedInput: F,
          enableInnerInputFocus: f,
          children: (0, o.jsx)(u.ContextMenuProvider, {
            mode: g,
            triggerRef: b,
            contentRef: C,
            inheritedArrowColor: x,
            animatedOpen: M,
            animationDuration: E,
            hoverCloseDelay: R,
            temporaryHoverClose: O,
            closeMenuImmediately: I,
            onMouseEnter: S,
            onMouseLeave: D,
            enableTemporaryHoverClose: P,
            onOpenByKeyboard: L,
            isCloseOnClick: d,
            onChildOpen: _,
            isOpen: y,
            onSubmenuOpen: k,
            isRootContentBlocked: T,
            isChildOpen: N,
            children: (0, o.jsx)(i.R, {
              open: s ?? y,
              onOpenChange: w,
              modal: !1,
              ...h,
              children: e
            })
          })
        })
      }));
      O.displayName = u.DISPLAY_NAME, O.Root = O, O.SubRoot = R.SubRoot, O.Trigger = l.Trigger, O.Content = s.C, O.Portal = c.Portal, O.Sub = d.Sub, O.SubTrigger = f.SubTrigger, O.SubContent = p.SubContent, O.Arrow = m.Arrow, O.Item = h.Item, O.ItemRightSlot = v.ItemRightSlot, O.Group = g.Group, O.Label = y.Label, O.CheckboxItem = w.CheckboxItem, O.RadioGroup = C.RadioGroup, O.RadioItem = x.RadioItem, O.ItemIndicator = b.ItemIndicator, O.Separator = M.Separator, O.ItemIcon = E.ItemIcon, O.FocusBlocker = s.F
    },
    709725: (e, n, t) => {
      t.r(n), t.d(n, {
        Arrow: () => l
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(280799);
      t(831803);
      const s = "ContextMenu.Arrow",
        l = (0, r.forwardRef)((({
          className: e,
          ...n
        }, t) => {
          const {
            inheritedArrowColor: r
          } = (0, u.useContextMenuContext)(s);
          return (0, o.jsxs)("span", {
            "data-arrow": !0,
            children: [(0, o.jsx)(i.A, {
              className: (0, a.c)("_arrow_border_udm9h_8", e),
              ...n
            }), (0, o.jsx)(i.A, {
              className: (0, a.c)("_arrow_udm9h_1", e),
              style: {
                ...r ? {
                  fill: r
                } : {}
              },
              ref: t,
              ...n
            })]
          })
        }));
      l.displayName = s
    },
    510363: (e, n, t) => {
      t.r(n), t.d(n, {
        CheckboxItem: () => h
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(501765),
        l = t(58102),
        c = t(280799),
        d = t(568406),
        f = t(510985),
        p = t(848283);
      t(397762);
      const m = "ContextMenu.CheckboxItem",
        h = (0, r.forwardRef)((({
          className: e,
          children: n,
          onChange: t,
          isDisabled: h,
          isChecked: v,
          hasIconCheckFn: g = l.hasItemIcon,
          onFocus: y,
          onMouseEnter: w,
          onBlur: b,
          onMouseLeave: C,
          onSelect: x,
          onClick: M,
          isCloseMenuOnClick: E = !0,
          shouldCloseRootMenuOnClick: R,
          onCheckedChange: O,
          onKeyDown: I,
          ...S
        }, D) => {
          const P = (0, r.useId)(),
            {
              hasItemWithIcon: L,
              closeMenuImmediately: _,
              isCloseOnClick: k,
              shouldCloseRootMenuOnClick: T
            } = (0, s.useLevelContext)(m),
            {
              itemRef: N,
              hasSubmenu: A,
              subMenuOpen: F,
              handleKeyDown: j,
              withProvider: K
            } = (0, f.useSubMenu)({
              onKeyDown: I
            }),
            {
              dataHighlighted: B,
              onFocus: H,
              onMouseEnter: W,
              onBlur: V,
              onMouseLeave: G
            } = (0, d.useContextMenuItemFocus)({
              displayName: m,
              ref: N,
              id: P,
              isDisabled: h,
              hasSubmenu: A,
              onFocus: y,
              onBlur: b,
              onMouseEnter: w,
              onMouseLeave: C
            }),
            U = (0, r.useMemo)((() => g(n)), [n]),
            {
              closeRootMenuImmediately: $
            } = (0, c.useContextMenuRootContext)(m),
            z = (0, p.useChildrenWithBlocker)({
              children: n,
              displayName: m,
              blockerClassName: "_blocker_1lejf_34"
            }),
            Y = () => {
              k && E && (_(R), (R ?? T) && (null == $ || $()))
            };
          return K((0, o.jsx)(i.C, {
            ref: (0, u.mergeRefs)(D, N),
            className: (0, a.c)("_checkbox_item_1lejf_1", e),
            disabled: h,
            checked: v,
            "data-item": !0,
            "data-no-icon-align": U || !L ? "" : void 0,
            onCheckedChange: e => {
              t && t({
                target: {
                  checked: e
                }
              })
            },
            "data-highlighted": F || B,
            onSelect: e => {
              null == x || x(e), Y()
            },
            onClick: e => {
              e.preventDefault(), null == M || M(e), (e => {
                null == O || O(e), t && t({
                  target: {
                    checked: e
                  }
                })
              })(!v), Y()
            },
            onFocus: H,
            onMouseEnter: W,
            onBlur: V,
            onMouseLeave: G,
            onKeyDown: j,
            ...S,
            children: z
          }))
        }));
      h.displayName = m
    },
    169043: (e, n, t) => {
      t.r(n), t.d(n, {
        Direction: () => o
      });
      var o = (e => (e.UP_LEFT = "up-left", e.UP_RIGHT = "up-right", e.DOWN_LEFT = "down-left", e.DOWN_RIGHT = "down-right", e.LEFT_UP = "left-up", e.LEFT_DOWN = "left-down", e.RIGHT_UP = "right-up", e.RIGHT_DOWN = "right-down", e))(o || {})
    },
    391378: (e, n, t) => {
      t.r(n), t.d(n, {
        directionToSide: () => r
      });
      var o = t(169043);
      const r = {
        [o.Direction.UP_LEFT]: "top",
        [o.Direction.UP_RIGHT]: "top",
        [o.Direction.DOWN_LEFT]: "bottom",
        [o.Direction.DOWN_RIGHT]: "bottom",
        [o.Direction.LEFT_UP]: "left",
        [o.Direction.LEFT_DOWN]: "left",
        [o.Direction.RIGHT_UP]: "right",
        [o.Direction.RIGHT_DOWN]: "right"
      }
    },
    260774: (e, n, t) => {
      t.r(n), t.d(n, {
        Group: () => o
      });
      const o = t(635805).G;
      o.displayName = "ContextMenu.Group"
    },
    12220: (e, n, t) => {
      t.r(n), t.d(n, {
        Item: () => g
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(501765),
        l = t(58102),
        c = t(280799),
        d = t(568406),
        f = t(510985),
        p = t(42552),
        m = t(131005);
      t(782272);
      const h = "_item_hzqyl_1",
        v = "ContextMenu.Item",
        g = (0, r.forwardRef)(((e, n) => {
          const {
            className: t,
            children: g,
            isDisabled: y,
            isDanger: w,
            hasIconCheckFn: b = l.hasItemIcon,
            onSelect: C,
            onClick: x,
            onFocus: M,
            onMouseEnter: E,
            onBlur: R,
            onMouseLeave: O,
            onKeyDown: I,
            isCloseMenuOnClick: S = !0,
            shouldCloseRootMenuOnClick: D,
            isSelectable: P,
            asChild: L,
            ..._
          } = e, k = (0, r.useId)(), {
            hasItemWithIcon: T,
            closeMenuImmediately: N,
            isCloseOnClick: A,
            shouldCloseRootMenuOnClick: F
          } = (0, s.useLevelContext)(v), j = (0, r.useMemo)((() => b(g)), [g]), {
            closeRootMenuImmediately: K
          } = (0, c.useContextMenuRootContext)(v), {
            itemRef: B,
            hasSubmenu: H,
            subMenuOpen: W,
            handleKeyDown: V,
            withProvider: G
          } = (0, f.useSubMenu)({
            onKeyDown: I
          }), {
            dataHighlighted: U,
            onFocus: $,
            onMouseEnter: z,
            onBlur: Y,
            onMouseLeave: X
          } = (0, d.useContextMenuItemFocus)({
            displayName: v,
            ref: B,
            id: k,
            isDisabled: y,
            hasSubmenu: H,
            onFocus: M,
            onBlur: R,
            onMouseEnter: E,
            onMouseLeave: O
          }), {
            isSelectable: q,
            handleNodeRef: Z,
            childrenWithBlocker: J
          } = (0, p.useItemInnerFocus)({
            id: k,
            children: g,
            isSelectableProp: P,
            displayName: v,
            blockerClassName: "_blocker_hzqyl_44"
          }), Q = () => {
            A && S && (N(D), (D ?? F) && (null == K || K()))
          };
          return G(q ? (0, o.jsx)(i.I, {
            ref: (0, u.mergeRefs)(n, B, Z),
            className: (0, a.c)(h, t),
            disabled: y,
            "data-item": !0,
            "data-danger": w ? "" : void 0,
            "data-no-icon-align": j || !T ? "" : void 0,
            "data-has-submenu": H ? "" : void 0,
            onSelect: e => {
              null == C || C(e), Q()
            },
            onClick: e => {
              e.stopPropagation(), e.target.closest("a") || e.preventDefault(), null == x || x(e), Q()
            },
            "data-highlighted": W || U,
            onFocus: $,
            onMouseEnter: z,
            onBlur: Y,
            onMouseLeave: X,
            onKeyDown: V,
            asChild: L,
            ..._,
            children: J
          }) : (0, o.jsx)(m.MaybeAsChild, {
            ref: (0, u.mergeRefs)(n, B, Z),
            className: (0, a.c)(h, t),
            "data-not-selectable": !0,
            "data-item": !0,
            "data-danger": w ? "" : void 0,
            "data-no-icon-align": j || !T ? "" : void 0,
            "data-has-submenu": H ? "" : void 0,
            onFocus: M,
            onMouseEnter: E,
            onBlur: R,
            onMouseLeave: O,
            onKeyDown: I,
            onClick: x,
            asChild: L,
            ..._,
            children: g
          }))
        }));
      g.displayName = v
    },
    131005: (e, n, t) => {
      t.r(n), t.d(n, {
        MaybeAsChild: () => i
      });
      var o = t(824246),
        r = t(827378);
      const i = (0, r.forwardRef)((({
        asChild: e,
        children: n,
        ...t
      }, i) => e && (0, r.isValidElement)(n) ? (0, r.cloneElement)(n, {
        ...t,
        ref: i
      }) : (0, o.jsx)("div", {
        ref: i,
        ...t,
        children: n
      })));
      i.displayName = "ContextMenu.MaybeAsChild"
    },
    720938: (e, n, t) => {
      t.r(n), t.d(n, {
        ItemIcon: () => l
      });
      var o = t(824246),
        r = t(827378),
        i = t(22538),
        a = t(445857),
        u = t(501765);
      t(910397);
      const s = "ContextMenu.ItemIcon",
        l = (0, r.forwardRef)((({
          children: e,
          className: n
        }, t) => {
          const {
            setHasItemWithIcon: l
          } = (0, u.useLevelContext)(s), c = (0, r.useRef)(null);
          return (0, r.useEffect)((() => {
            const e = c.current;
            if (!e) return;
            const n = e.parentElement;
            if (n) {
              if (Array.from(n.children).find((e => !e.hasAttribute("data-blocker"))) !== e) throw new Error(`[${s}] must be the first child in <ContextMenu.Item>`);
              l(!0)
            }
          }), [l]), (0, o.jsx)("span", {
            ref: (0, a.mergeRefs)(t, c),
            className: (0, i.c)("_icon_1txqe_1", n),
            children: e
          })
        }));
      l.displayName = s
    },
    258607: (e, n, t) => {
      t.r(n), t.d(n, {
        ItemIndicator: () => d
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(501765),
        l = t(860276);
      t(896999);
      const c = "ContextMenu.ItemIndicator",
        d = (0, r.forwardRef)((({
          className: e,
          children: n,
          ...t
        }, d) => {
          const {
            setHasItemWithIcon: f
          } = (0, s.useLevelContext)(c), p = (0, r.useRef)(null);
          return (0, r.useEffect)((() => {
            (0, l.isFirstElement)(p) && f(!0)
          }), [f]), (0, o.jsx)(i.d, {
            ref: (0, u.mergeRefs)(d, p),
            className: (0, a.c)("_item_indicator_1d8fw_1", e),
            ...t,
            children: n
          })
        }));
      d.displayName = c
    },
    211433: (e, n, t) => {
      t.r(n), t.d(n, {
        ItemRightSlot: () => s
      });
      var o = t(824246),
        r = t(827378),
        i = t(22538),
        a = t(445857),
        u = t(335458);
      t(654979);
      const s = (0, r.forwardRef)((({
        className: e,
        children: n,
        onClick: t,
        onKeyDown: s,
        onKeyUp: l,
        onKeyPress: c,
        onPointerDown: d,
        onPointerUp: f,
        onPointerEnter: p,
        onPointerLeave: m,
        onPointerMove: h,
        ...v
      }, g) => {
        const y = (0, r.useRef)(null),
          [w, b] = (0, r.useState)(!1);
        (0, r.useEffect)((() => {
          if (!y.current) return;
          const e = y.current.querySelector("[data-submenu-trigger]");
          b(!!e)
        }), [n]);
        const C = {
            onClick: t,
            onKeyDown: s,
            onKeyUp: l,
            onKeyPress: c,
            onPointerDown: d,
            onPointerUp: f,
            onPointerEnter: p,
            onPointerLeave: m,
            onPointerMove: h
          },
          x = (0, u.useStopContextMenuEvents)(C),
          M = w ? x : C;
        return (0, o.jsx)("div", {
          ref: (0, a.mergeRefs)(y, g),
          className: (0, i.c)("_rightSlot_fkycg_1", e),
          "data-submenu-right-slot": w ? "" : void 0,
          ...M,
          ...v,
          children: n
        })
      }));
      s.displayName = "ContextMenu.ItemRightSlot"
    },
    911915: (e, n, t) => {
      t.r(n), t.d(n, {
        Label: () => f
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(501765),
        l = t(58102),
        c = t(510985);
      t(329528);
      const d = "ContextMenu.Label",
        f = (0, r.forwardRef)((({
          className: e,
          children: n,
          onKeyDown: t,
          ...r
        }, f) => {
          const {
            hasItemWithIcon: p
          } = (0, s.useLevelContext)(d), {
            itemRef: m,
            handleKeyDown: h,
            withProvider: v
          } = (0, c.useSubMenu)({
            onKeyDown: t
          });
          return v((0, o.jsx)(i.L, {
            ref: (0, u.mergeRefs)(f, m),
            className: (0, a.c)("_label_1sne1_1", e),
            "data-no-icon-align": (0, l.hasItemIcon)(n) || !p ? "" : void 0,
            onKeyDown: h,
            "data-label": !0,
            ...r,
            children: n
          }))
        }));
      f.displayName = d
    },
    465066: (e, n, t) => {
      t.r(n), t.d(n, {
        Portal: () => o
      });
      const o = t(635805).P;
      o.displayName = "ContextMenu.Portal"
    },
    772425: (e, n, t) => {
      t.r(n), t.d(n, {
        DISPLAY_NAME: () => r,
        RadioGroupProvider: () => i,
        useRadioGroupContext: () => a
      });
      var o = t(818910);
      const r = "ContextMenu.RadioGroup",
        [i, a] = (0, o.createComponentContext)(r)
    },
    18411: (e, n, t) => {
      t.r(n), t.d(n, {
        RadioGroup: () => a
      });
      var o = t(824246),
        r = t(635805),
        i = t(772425);
      const a = ({
        onChange: e,
        ...n
      }) => {
        const t = n => {
          e && e({
            target: {
              value: n
            }
          })
        };
        return (0, o.jsx)(i.RadioGroupProvider, {
          onChange: t,
          children: (0, o.jsx)(r.a, {
            ...n,
            onValueChange: t
          })
        })
      };
      a.displayName = i.DISPLAY_NAME
    },
    891626: (e, n, t) => {
      t.r(n), t.d(n, {
        RadioItem: () => v
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(501765),
        l = t(58102),
        c = t(280799),
        d = t(568406),
        f = t(510985),
        p = t(848283),
        m = t(772425);
      t(333351);
      const h = "ContextMenu.RadioItem",
        v = (0, r.forwardRef)((({
          className: e,
          children: n,
          isDisabled: t,
          hasIconCheckFn: v = l.hasItemIcon,
          onFocus: g,
          onMouseEnter: y,
          onBlur: w,
          onMouseLeave: b,
          onSelect: C,
          onClick: x,
          isCloseMenuOnClick: M = !0,
          shouldCloseRootMenuOnClick: E,
          value: R,
          onKeyDown: O,
          ...I
        }, S) => {
          const D = (0, r.useId)(),
            {
              hasItemWithIcon: P,
              closeMenuImmediately: L,
              isCloseOnClick: _,
              shouldCloseRootMenuOnClick: k
            } = (0, s.useLevelContext)(h),
            {
              itemRef: T,
              hasSubmenu: N,
              subMenuOpen: A,
              handleKeyDown: F,
              withProvider: j
            } = (0, f.useSubMenu)({
              onKeyDown: O
            }),
            {
              closeRootMenuImmediately: K
            } = (0, c.useContextMenuRootContext)(h),
            {
              dataHighlighted: B,
              onFocus: H,
              onMouseEnter: W,
              onBlur: V,
              onMouseLeave: G
            } = (0, d.useContextMenuItemFocus)({
              displayName: h,
              ref: T,
              id: D,
              isDisabled: t,
              hasSubmenu: N,
              onFocus: g,
              onBlur: w,
              onMouseEnter: y,
              onMouseLeave: b
            }),
            U = (0, r.useMemo)((() => v(n)), [n]),
            {
              onChange: $
            } = (0, m.useRadioGroupContext)(h),
            z = (0, p.useChildrenWithBlocker)({
              children: n,
              displayName: h,
              blockerClassName: "_blocker_1ohpj_35"
            }),
            Y = () => {
              _ && M && (L(E), (E ?? k) && (null == K || K()))
            };
          return j((0, o.jsx)(i.e, {
            ref: (0, u.mergeRefs)(S, T),
            className: (0, a.c)("_radio_item_1ohpj_1", e),
            disabled: t,
            "data-item": !0,
            "data-no-icon-align": U || !P ? "" : void 0,
            "data-highlighted": A || B,
            value: R,
            onSelect: e => {
              null == C || C(e), Y()
            },
            onClick: e => {
              e.preventDefault(), $(R), null == x || x(e), Y()
            },
            onFocus: H,
            onMouseEnter: W,
            onBlur: V,
            onMouseLeave: G,
            onKeyDown: F,
            ...I,
            children: z
          }))
        }));
      v.displayName = h
    },
    666946: (e, n, t) => {
      t.r(n), t.d(n, {
        Separator: () => u
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538);
      t(902901);
      const u = (0, r.forwardRef)((({
        className: e,
        ...n
      }, t) => (0, o.jsx)(i.f, {
        ref: t,
        className: (0, a.c)("_separator_1k8lw_1", e),
        "data-separator": !0,
        ...n
      })));
      u.displayName = "ContextMenu.Separator"
    },
    140379: (e, n, t) => {
      t.r(n), t.d(n, {
        ContextMenuSubProvider: () => i,
        DISPLAY_NAME: () => r,
        useContextMenuSubContext: () => a
      });
      var o = t(818910);
      const r = "ContextMenu.Sub",
        [i, a] = (0, o.createComponentContext)(r)
    },
    751242: (e, n, t) => {
      t.r(n), t.d(n, {
        Sub: () => l
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(575133),
        u = t(751368),
        s = t(140379);
      const l = (0, r.forwardRef)((({
        children: e,
        mode: n = a.ContextMenuMode.HOVER,
        onOpen: t,
        defaultOpen: l,
        shouldCloseRootMenuOnClick: c = !0,
        isCloseOnClick: d = !0,
        ...f
      }, p) => {
        const {
          isOpen: m,
          setOpen: h,
          animatedOpen: v,
          startAnimation: g,
          handleMouseEnter: y,
          handleMouseLeave: w,
          handleOpenChange: b,
          triggerId: C,
          onOpenByKeyboard: x,
          contentRef: M,
          triggerRef: E,
          onChildOpen: R,
          onSubRootOpen: O,
          closeMenuImmediately: I
        } = (0, u.useContextMenuSub)({
          displayName: s.DISPLAY_NAME,
          mode: n,
          defaultOpen: l,
          onOpen: t
        });
        return (0, r.useImperativeHandle)(p, (() => ({
          setOpen: h
        }))), (0, o.jsx)(s.ContextMenuSubProvider, {
          mode: n,
          isOpen: m,
          setOpen: h,
          animatedOpen: v,
          defaultOpen: l,
          startAnimation: g,
          onMouseEnter: y,
          onMouseLeave: w,
          onOpenByKeyboard: x,
          triggerId: C,
          contentRef: M,
          triggerRef: E,
          onChildOpen: R,
          onSubRootOpen: O,
          shouldCloseRootMenuOnClick: c,
          isCloseOnClick: d,
          closeMenuImmediately: I,
          children: (0, o.jsx)(i.S, {
            open: m,
            onOpenChange: b,
            ...f,
            children: e
          })
        })
      }));
      l.displayName = s.DISPLAY_NAME
    },
    187339: (e, n, t) => {
      t.r(n), t.d(n, {
        SubContent: () => p
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(819072),
        u = t(22538),
        s = t(445857),
        l = t(501765),
        c = t(140379),
        d = t(280799);
      t(922784);
      const f = "ContextMenu.SubContent",
        p = (0, r.forwardRef)((({
          className: e,
          children: n,
          sideOffset: t = 4,
          collisionPadding: p = 10,
          onMouseEnter: m,
          onMouseLeave: h,
          alignOffset: v,
          disableAutoPositioning: g = !1,
          disableRepositioning: y = !1,
          onEscapeKeyDown: w,
          ...b
        }, C) => {
          const [x, M] = (0, r.useState)(null), {
            animatedOpen: E,
            startAnimation: R,
            onMouseEnter: O,
            onMouseLeave: I,
            defaultOpen: S,
            isOpen: D,
            triggerRef: P,
            contentRef: L,
            onChildOpen: _,
            onSubRootOpen: k,
            closeMenuImmediately: T,
            isCloseOnClick: N,
            shouldCloseRootMenuOnClick: A
          } = (0, c.useContextMenuSubContext)(f), {
            animationDuration: F
          } = (0, d.useContextMenuContext)(f), {
            level: j
          } = (0, l.useLevelContext)(f), {
            offset: K
          } = (0, a.u)({
            alignOffset: v,
            disableAutoPositioning: g,
            triggerRef: P,
            contentRef: L,
            children: n,
            disableRepositioning: y
          }), [B, H] = (0, r.useState)(!1), [W, V] = (0, r.useState)(!1);
          (0, r.useLayoutEffect)((() => {
            R()
          }), []), (0, r.useLayoutEffect)((() => {
            let e;
            return E ? (V(!1), e = requestAnimationFrame((() => {
              V(!0)
            }))) : V(!1), () => {
              e && cancelAnimationFrame(e)
            }
          }), [E]);
          const G = (0, a.a)({
            opacity: W && E || void 0 !== S ? 1 : 0,
            config: void 0 === S ? {
              duration: F,
              easing: a.e.easeInOutCubic
            } : {
              duration: 0
            }
          });
          return (0, o.jsx)(l.LevelProvider, {
            hasItemWithIcon: B,
            setHasItemWithIcon: H,
            activeItemId: x,
            setActiveItemId: M,
            onChildOpen: _,
            onSubRootOpen: k,
            isCloseOnClick: N,
            closeMenuImmediately: T,
            shouldCloseRootMenuOnClick: A,
            level: j + 1,
            children: D && (0, o.jsx)(a.b.div, {
              style: {
                position: "fixed",
                zIndex: Number.MAX_SAFE_INTEGER - 10,
                ...G
              },
              onMouseEnter: e => {
                null == O || O(e), null == m || m(e)
              },
              onMouseLeave: e => {
                null == I || I(e), null == h || h(e)
              },
              "data-content-wrapper": !0,
              children: (0, o.jsx)(i.c, {
                ref: (0, s.mergeRefs)(L, C),
                className: (0, u.c)("_sub_content_y6v65_1", e),
                sideOffset: t,
                collisionPadding: p,
                alignOffset: K,
                onEscapeKeyDown: e => {
                  T(), null == w || w(e)
                },
                ...b,
                children: n
              })
            })
          })
        }));
      p.displayName = f
    },
    494097: (e, n, t) => {
      t.r(n), t.d(n, {
        SubRoot: () => m
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(280799),
        u = t(575133),
        s = t(819072),
        l = t(545167),
        c = t(606215),
        d = t(802255),
        f = t(523509);
      const p = "ContextMenu.SubRoot",
        m = (0, r.forwardRef)((({
          children: e,
          mode: n = u.ContextMenuMode.HOVER,
          onOpen: t,
          onAnimatedOpen: d,
          defaultOpen: f,
          shouldCloseRootMenuOnClick: m = !1,
          isCloseOnClick: h = !0,
          ...v
        }, g) => {
          const {
            animationDuration: y,
            hoverCloseDelay: w
          } = (0, a.useContextMenuContext)(p), {
            subMenuOpen: b,
            setSubMenuOpen: C
          } = (0, c.useSubMenuContext)(p), {
            mode: x,
            isOpen: M,
            onOpenChange: E,
            triggerRef: R,
            contentRef: O,
            inheritedArrowColor: I,
            animatedOpen: S,
            temporaryHoverClose: D,
            closeMenuImmediately: P,
            onMouseEnter: L,
            onMouseLeave: _,
            enableTemporaryHoverClose: k,
            triggerId: T,
            onOpenByKeyboard: N,
            onChildOpen: A
          } = (0, l.useContextMenuSubMenu)({
            displayName: p,
            mode: n,
            defaultOpen: f,
            onOpen: t,
            onAnimatedOpen: d,
            animationDuration: y,
            subMenuOpen: b,
            setSubMenuOpen: C,
            hoverCloseDelay: w
          });
          return (0, r.useImperativeHandle)(g, (() => ({
            closeMenuImmediately: P,
            enableTemporaryHoverClose: k,
            onOpenByKeyboard: N
          }))), (0, o.jsx)(a.ContextMenuProvider, {
            mode: x,
            triggerRef: R,
            contentRef: O,
            inheritedArrowColor: I,
            animatedOpen: S,
            animationDuration: y,
            hoverCloseDelay: w,
            temporaryHoverClose: D,
            closeMenuImmediately: P,
            onMouseEnter: L,
            onMouseLeave: _,
            enableTemporaryHoverClose: k,
            subMenuOpen: M,
            setSubMenuOpen: C,
            triggerId: T,
            onOpenByKeyboard: N,
            isCloseOnClick: h,
            shouldCloseRootMenuOnClick: m,
            onChildOpen: A,
            isOpen: M,
            children: (0, o.jsxs)(i.R, {
              open: M,
              onOpenChange: E,
              modal: !1,
              ...v,
              children: [e, M && (0, o.jsx)(s.F, {
                onClick: () => {
                  P(!1)
                }
              })]
            })
          })
        }));
      m.displayName = p, m.Trigger = d.Trigger, m.Content = f.Content
    },
    523509: (e, n, t) => {
      t.r(n), t.d(n, {
        Content: () => v
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(819072),
        s = t(445857),
        l = t(501765),
        c = t(280799),
        d = t(575133),
        f = t(145104),
        p = t(169043),
        m = t(391378);
      t(392007);
      const h = "ContextMenu.SubRoot.Content",
        v = (0, r.forwardRef)((({
          style: e,
          className: n,
          children: t,
          alignOffset: v,
          arrowPadding: g = 5,
          collisionBoundary: y,
          direction: w = p.Direction.DOWN_RIGHT,
          disableAutoPositioning: b = !1,
          disableRepositioning: C = !1,
          onMouseEnter: x,
          onMouseLeave: M,
          onKeyDown: E,
          ...R
        }, O) => {
          const [I, S] = (0, r.useState)(!1), [D, P] = (0, r.useState)(null), {
            triggerRef: L,
            contentRef: _,
            animatedOpen: k,
            animationDuration: T,
            mode: N,
            temporaryHoverClose: A,
            onMouseEnter: F,
            onMouseLeave: j,
            closeMenuImmediately: K,
            isOpen: B,
            onChildOpen: H,
            isCloseOnClick: W,
            shouldCloseRootMenuOnClick: V
          } = (0, c.useContextMenuContext)(h), {
            level: G
          } = (0, l.useLevelContext)(h), {
            align: U,
            offset: $,
            isPositioned: z
          } = (0, u.u)({
            direction: w,
            alignOffset: v,
            disableAutoPositioning: b,
            triggerRef: L,
            contentRef: _,
            collisionBoundary: y,
            children: t,
            disableRepositioning: C
          }), Y = (0, u.a)({
            opacity: z && (N === d.ContextMenuMode.CLICK && !A || k) ? 1 : 0,
            config: N !== d.ContextMenuMode.CLICK || A ? {
              duration: T,
              easing: u.e.easeInOutCubic
            } : {
              duration: 0
            }
          });
          return (0, o.jsx)(l.LevelProvider, {
            hasItemWithIcon: I,
            setHasItemWithIcon: S,
            activeItemId: D,
            setActiveItemId: P,
            onChildOpen: H,
            isCloseOnClick: W,
            closeMenuImmediately: K,
            shouldCloseRootMenuOnClick: V ?? !1,
            level: G + 1,
            children: B && (0, o.jsx)(u.b.div, {
              style: {
                zIndex: Number.MAX_SAFE_INTEGER - 10,
                position: "fixed",
                ...Y
              },
              "data-content-wrapper": !0,
              children: (0, o.jsx)(i.g, {
                ref: (0, s.mergeRefs)(_, O),
                className: (0, a.c)("_content_k9opk_1", n),
                style: {
                  ...e || {},
                  pointerEvents: b || z ? "auto" : "none"
                },
                collisionBoundary: y,
                side: m.directionToSide[w],
                align: U,
                arrowPadding: g,
                alignOffset: $,
                onMouseEnter: e => {
                  null == F || F(e), null == x || x(e)
                },
                onMouseLeave: e => {
                  null == j || j(e), null == M || M(e)
                },
                onKeyDown: e => {
                  (e => {
                    "ArrowLeft" === e.key && (K(), (0, f.focusParentItem)(L.current)), null == E || E(e)
                  })(e)
                },
                ...R,
                children: t
              })
            })
          })
        }));
      v.displayName = h
    },
    802255: (e, n, t) => {
      t.r(n), t.d(n, {
        Trigger: () => f
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(280799),
        l = t(575133),
        c = t(568406);
      t(135468);
      const d = "ContextMenu.SubRoot.Trigger",
        f = (0, r.forwardRef)((({
          className: e,
          children: n,
          onFocus: t,
          onBlur: r,
          onMouseEnter: f,
          onMouseLeave: p,
          onPointerDown: m,
          ...h
        }, v) => {
          const {
            isOpen: g,
            triggerRef: y,
            mode: w,
            onMouseEnter: b,
            onMouseLeave: C,
            triggerId: x
          } = (0, s.useContextMenuContext)(d), {
            dataHighlighted: M,
            onFocus: E,
            onMouseEnter: R,
            onBlur: O,
            onMouseLeave: I
          } = (0, c.useContextMenuItemFocus)({
            displayName: d,
            ref: y,
            id: x || "",
            isDisabled: !1,
            onMouseEnter: e => {
              b(e), null == f || f(e)
            },
            onMouseLeave: e => {
              C(e), null == p || p(e)
            },
            onFocus: e => {
              null == t || t(e)
            },
            onBlur: e => {
              null == r || r(e)
            }
          });
          return (0, o.jsx)(i.T, {
            ref: (0, u.mergeRefs)(y, v),
            className: (0, a.c)("_trigger_19e8i_1", {
              _open_19e8i_5: g
            }, e),
            "data-highlighted": M || g ? "" : void 0,
            onPointerDown: e => {
              w === l.ContextMenuMode.HOVER && e.preventDefault(), e.stopPropagation(), null == m || m(e)
            },
            onFocus: E,
            onMouseEnter: R,
            onBlur: O,
            onMouseLeave: I,
            "data-submenu-trigger": !0,
            ...h,
            children: n
          })
        }));
      f.displayName = d
    },
    959344: (e, n, t) => {
      t.r(n), t.d(n, {
        SubTrigger: () => v
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(501765),
        l = t(140379),
        c = t(58102),
        d = t(575133),
        f = t(568406),
        p = t(510985),
        m = t(848283);
      t(69103);
      const h = "ContextMenu.SubTrigger",
        v = (0, r.forwardRef)((({
          className: e,
          children: n,
          isDisabled: t,
          onKeyDown: r,
          onFocus: v,
          onBlur: g,
          onClick: y,
          onPointerEnter: w,
          onPointerMove: b,
          onPointerLeave: C,
          onMouseEnter: x,
          onMouseLeave: M,
          ...E
        }, R) => {
          const {
            hasItemWithIcon: O
          } = (0, s.useLevelContext)(h), {
            mode: I,
            isOpen: S,
            defaultOpen: D,
            setOpen: P,
            onMouseEnter: L,
            onMouseLeave: _,
            triggerId: k,
            triggerRef: T,
            onOpenByKeyboard: N
          } = (0, l.useContextMenuSubContext)(h), {
            itemRef: A,
            hasSubmenu: F,
            subMenuOpen: j,
            handleKeyDown: K,
            withProvider: B
          } = (0, p.useSubMenu)({
            onKeyDown: r
          }), {
            dataHighlighted: H,
            onFocus: W,
            onMouseEnter: V,
            onBlur: G,
            onMouseLeave: U
          } = (0, f.useContextMenuItemFocus)({
            displayName: h,
            ref: A,
            id: k,
            isDisabled: t,
            onMouseEnter: e => {
              L(e), null == x || x(e)
            },
            onMouseLeave: e => {
              _(e), null == M || M(e)
            },
            hasSubmenu: F,
            onFocus: v,
            onBlur: g
          }), $ = (0, m.useChildrenWithBlocker)({
            children: n,
            displayName: h,
            blockerClassName: "_blocker_12gka_30"
          });
          return B((0, o.jsx)(i.b, {
            ref: (0, u.mergeRefs)(R, T, A),
            className: (0, a.c)("_sub_trigger_12gka_1", e),
            disabled: t,
            "data-item": !0,
            "data-no-icon-align": (0, c.hasItemIcon)(n) || !O ? "" : void 0,
            "data-highlighted": j || S || "" === H || I === d.ContextMenuMode.CLICK && S ? "" : void 0,
            "data-submenu-trigger": !0,
            onKeyDown: e => {
              I === d.ContextMenuMode.HOVER && (["Enter", " ", "ArrowRight"].includes(e.key) ? N(!0) : "ArrowLeft" === e.key && N(!1)), null == K || K(e), null == r || r(e)
            },
            onClick: e => {
              (I === d.ContextMenuMode.CLICK || void 0 !== D) && (e.preventDefault(), e.stopPropagation(), void 0 === D && P(!S)), null == y || y(e)
            },
            onFocus: W,
            onMouseEnter: V,
            onBlur: G,
            onMouseLeave: U,
            onPointerEnter: e => {
              (I === d.ContextMenuMode.CLICK || void 0 !== D) && (e.preventDefault(), e.stopPropagation()), null == w || w(e)
            },
            onPointerMove: e => {
              (I === d.ContextMenuMode.CLICK || void 0 !== D) && (e.preventDefault(), e.stopPropagation()), null == b || b(e)
            },
            onPointerLeave: e => {
              (I === d.ContextMenuMode.CLICK || void 0 !== D) && (e.preventDefault(), e.stopPropagation()), null == C || C(e)
            },
            ...E,
            children: $
          }))
        }));
      v.displayName = h
    },
    974667: (e, n, t) => {
      t.r(n), t.d(n, {
        Trigger: () => d
      });
      var o = t(824246),
        r = t(827378),
        i = t(635805),
        a = t(22538),
        u = t(445857),
        s = t(280799),
        l = t(575133);
      const c = "ContextMenu.Trigger",
        d = (0, r.forwardRef)((({
          className: e,
          children: n,
          onKeyDown: t,
          onMouseEnter: r,
          onMouseLeave: d,
          onPointerDown: f,
          ...p
        }, m) => {
          const {
            triggerRef: h,
            mode: v,
            onMouseEnter: g,
            onMouseLeave: y,
            onOpenByKeyboard: w
          } = (0, s.useContextMenuContext)(c);
          return (0, o.jsx)(i.T, {
            ref: (0, u.mergeRefs)(h, m),
            className: (0, a.c)(e),
            onPointerDown: e => {
              v === l.ContextMenuMode.HOVER && (e.preventDefault(), e.stopPropagation()), null == f || f(e)
            },
            onKeyDown: e => {
              v === l.ContextMenuMode.HOVER && (e.stopPropagation(), ["Enter", " ", "ArrowDown"].includes(e.key) ? w(!0) : "Escape" === e.key && w(!1)), null == t || t(e)
            },
            onMouseEnter: e => {
              g(e), null == r || r(e)
            },
            onMouseLeave: e => {
              y(e), null == d || d(e)
            },
            ...p,
            children: n
          })
        }));
      d.displayName = c
    },
    848283: (e, n, t) => {
      t.r(n), t.d(n, {
        useChildrenWithBlocker: () => s
      });
      var o = t(824246),
        r = t(827378),
        i = t.n(r),
        a = t(819072),
        u = t(280799);

      function s({
        displayName: e,
        children: n,
        shouldShowBlocker: t,
        blockerClassName: s,
        onBlockerClick: l
      }) {
        const {
          itemWithFocusedInput: c,
          setItemWithFocusedInput: d
        } = (0, u.useContextMenuRootContext)(e);
        return l = l ?? (() => {
          var e;
          d(null), null == (e = document.activeElement) || e.blur()
        }), t = t ?? null !== c, (0, r.useMemo)((() => {
          if (!i().isValidElement(n)) return (0, o.jsxs)(o.Fragment, {
            children: [t && (0, o.jsx)(a.F, {
              className: s,
              onClick: l
            }, "focus-blocker"), n]
          });
          const e = t ? (0, o.jsx)(a.F, {
            className: s,
            onClick: l
          }, "focus-blocker") : null;
          return i().cloneElement(n, {
            children: (0, o.jsxs)(o.Fragment, {
              children: [e, n.props.children]
            })
          })
        }), [n, t, s, l])
      }
    },
    825699: (e, n, t) => {
      t.r(n), t.d(n, {
        useClickOutside: () => r
      });
      var o = t(827378);

      function r({
        refs: e,
        handler: n
      }) {
        (0, o.useEffect)((() => {
          function t(t) {
            e.some((e => {
              const n = null == e ? void 0 : e.current;
              return n && n.contains(t.target)
            })) || n(t)
          }
          return document.addEventListener("mousedown", t), document.addEventListener("touchstart", t), () => {
            document.removeEventListener("mousedown", t), document.removeEventListener("touchstart", t)
          }
        }), [e, n])
      }
    },
    879929: (e, n, t) => {
      t.r(n), t.d(n, {
        useContextMenu: () => c
      });
      var o = t(824246),
        r = t(827378),
        i = t(819072),
        a = t(575133),
        u = t(87829),
        s = t(737517),
        l = t(626331);
      const c = ({
        mode: e,
        defaultOpen: n,
        animationDuration: t,
        hoverCloseDelay: c,
        onOpen: d,
        onAnimatedOpen: f,
        isOpen: p,
        enableInnerInputFocus: m,
        backgroundFocusBlockerContainers: h,
        backgroundFocusBlockerClassName: v
      }) => {
        const g = (0, r.useId)(),
          [y, w] = (0, r.useState)(p ?? n ?? !1),
          [b, C] = (0, r.useState)(!1),
          [x, M] = (0, r.useState)(!1),
          [E, R] = (0, r.useState)(!1),
          [O, I] = (0, r.useState)(!1),
          [S, D] = (0, r.useState)(!1),
          [P, L] = (0, r.useState)(null),
          [_, k] = (0, r.useState)(!1),
          [T, N] = (0, r.useState)(null),
          A = (0, r.useRef)(null),
          F = (0, r.useRef)(null),
          j = (0, r.useRef)(null),
          K = (0, r.useRef)(null),
          B = (0, s.useIsTouchDevice)() ? a.ContextMenuMode.CLICK : e,
          H = () => {
            j.current && (clearTimeout(j.current), j.current = null), K.current && (clearTimeout(K.current), K.current = null)
          },
          W = () => {
            w(!1), null == d || d(!1), M(!1), I(!1), k(!1)
          },
          V = () => {
            if (H(), B === a.ContextMenuMode.HOVER || O) {
              if (S && P === a.ContextMenuMode.CLICK || null !== T) return;
              C(!1), K.current = setTimeout((() => {
                W()
              }), t)
            } else W()
          },
          G = () => {
            H(), C(!1), w(!1), null == d || d(!1), M(!1), I(!1)
          },
          U = e => {
            B === a.ContextMenuMode.CLICK && void 0 !== n || (e ? (K.current && (clearTimeout(K.current), K.current = null), (B === a.ContextMenuMode.HOVER || O) && C(!0), w(!0), null == d || d(!0), setTimeout((() => l.contextMenuBus.emit(g)), 0)) : V())
          };
        (0, r.useEffect)((() => l.contextMenuBus.subscribe((e => {
          e !== g && G()
        }))), [g]), (0, r.useEffect)((() => {
          !y || B !== a.ContextMenuMode.HOVER && !O || E || (x ? j.current && (clearTimeout(j.current), j.current = null) : j.current || (j.current = setTimeout((() => {
            V()
          }), c)))
        }), [B, y, x, O, c, E]), (0, r.useEffect)((() => {
          null == f || f(b)
        }), [b]);
        const $ = (0, u.useInheritedArrowColor)(y, F);
        return (0, r.useEffect)((() => {
          if (!m || !h || null === T) return;
          const e = h.map((e => "function" == typeof e ? e() : e)).filter(Boolean),
            n = [];
          return e.forEach((e => {
            const t = document.createElement("div");
            e.appendChild(t);
            const r = (0, i.c)(t);
            r.render((0, o.jsx)(i.F, {
              className: v,
              onClick: () => {
                var e;
                N(null), null == (e = document.activeElement) || e.blur()
              }
            })), n.push({
              root: r,
              mountNode: t
            })
          })), () => {
            n.forEach((({
              root: e,
              mountNode: n
            }) => {
              queueMicrotask((() => {
                e.unmount(), n.remove()
              }))
            }))
          }
        }), [m, T]), {
          open: y,
          mode: B,
          onOpenChange: U,
          onOpenByKeyboard: e => {
            R(e), U(e)
          },
          inheritedArrowColor: $,
          triggerRef: A,
          contentRef: F,
          animatedOpen: b,
          animationDuration: t,
          hoverCloseDelay: c,
          temporaryHoverClose: O,
          closeMenuImmediately: G,
          onMouseEnter: () => {
            B !== a.ContextMenuMode.HOVER && !O || (R(!1), K.current && (clearTimeout(K.current), K.current = null, C(!0)), y ? M(!0) : (j.current && (clearTimeout(j.current), j.current = null), C(!0), w(!0), null == d || d(!0), M(!0), setTimeout((() => l.contextMenuBus.emit(g)), 0)))
          },
          onMouseLeave: () => {
            B !== a.ContextMenuMode.HOVER && !O || (R(!1), M(!1), j.current && (clearTimeout(j.current), j.current = null))
          },
          enableTemporaryHoverClose: () => {
            C(!0), M(!0), I(!0)
          },
          onChildOpen: (e, n) => {
            e || k(!1), D(e), L(n)
          },
          onSubmenuOpen: e => {
            k(e)
          },
          isRootContentBlocked: _,
          isChildOpen: S,
          itemWithFocusedInput: T,
          setItemWithFocusedInput: N
        }
      }
    },
    568406: (e, n, t) => {
      t.r(n), t.d(n, {
        useContextMenuItemFocus: () => a
      });
      var o = t(827378),
        r = t(501765),
        i = t(25923);
      const a = ({
        displayName: e,
        id: n,
        ref: t,
        isDisabled: a,
        hasSubmenu: u,
        onMouseEnter: s,
        onMouseLeave: l,
        onFocus: c,
        onBlur: d,
        onKeyDown: f,
        isSelectable: p = !0
      }) => {
        const [m, h] = (0, o.useState)(!1), {
          setActiveItemId: v,
          activeItemId: g
        } = (0, r.useLevelContext)(e);
        return (0, i.useMouseMoveOutside)(t, (() => {
          h(!1)
        })), a ? {
          dataHighlighted: void 0,
          onFocus: void 0,
          onMouseEnter: void 0,
          onBlur: void 0,
          onMouseLeave: void 0,
          onKeyDown: void 0
        } : ((0, o.useEffect)((() => {
          u && null === g && h(!1)
        }), [g]), {
          dataHighlighted: m && p ? "" : void 0,
          onFocus: e => {
            p ? (u || v(n), h(!a), null == c || c(e)) : null == c || c(e)
          },
          onMouseEnter: e => {
            p ? (u || v(n), h(!a), null == s || s(e)) : null == s || s(e)
          },
          onBlur: e => {
            p ? (h(!1), null == d || d(e)) : null == d || d(e)
          },
          onMouseLeave: e => {
            p ? (h(!1), null == l || l(e)) : null == l || l(e)
          },
          onKeyDown: e => {
            p ? (u && "ArrowLeft" === e.key && h(!1), null == f || f(e)) : null == f || f(e)
          }
        })
      }
    },
    751368: (e, n, t) => {
      t.r(n), t.d(n, {
        useContextMenuSub: () => l
      });
      var o = t(827378),
        r = (t(824246), t(575133)),
        i = t(501765),
        a = t(280799),
        u = t(737517),
        s = t(825699);

      function l({
        displayName: e,
        mode: n,
        defaultOpen: t,
        onOpen: l
      }) {
        const c = (0, o.useId)(),
          [d, f] = (0, o.useState)(t || !1),
          [p, m] = (0, o.useState)(!1),
          [h, v] = (0, o.useState)(!1),
          [g, y] = (0, o.useState)(!1),
          [w, b] = (0, o.useState)(!1),
          [C, x] = (0, o.useState)(null),
          [M, E] = (0, o.useState)(!1),
          R = (0, o.useRef)(null),
          O = (0, o.useRef)(null),
          I = (0, o.useRef)(null),
          S = (0, o.useRef)(null),
          D = (0, u.useIsTouchDevice)(),
          {
            hoverCloseDelay: P,
            animationDuration: L
          } = (0, a.useContextMenuContext)(e),
          {
            activeItemId: _,
            onChildOpen: k,
            onSubRootOpen: T
          } = (0, i.useLevelContext)(e),
          N = e => {
            setTimeout((() => null == T ? void 0 : T(e)), 0)
          },
          A = D ? r.ContextMenuMode.CLICK : n,
          F = () => {
            R.current && (clearTimeout(R.current), R.current = null), O.current && (clearTimeout(O.current), O.current = null)
          },
          j = () => {
            F(), m(!1), f(!1), null == l || l(!1), N(!1), v(!1), y(!1)
          },
          K = () => {
            if (F(), A === r.ContextMenuMode.HOVER) {
              if (w && C === r.ContextMenuMode.CLICK) return;
              m(!1), O.current = setTimeout((() => {
                f(!1), null == l || l(!1), N(!1), v(!1), y(!1)
              }), L)
            } else j()
          },
          B = e => void 0 !== t ? (f(t), null == l || l(t), N(t), m(t), void y(!1)) : A === r.ContextMenuMode.CLICK ? (f(e), null == l || l(e), N(e), void m(e)) : void(e ? (O.current && (clearTimeout(O.current), O.current = null), A === r.ContextMenuMode.HOVER && m(!0), f(!0), null == l || l(!0), N(!0)) : K());
        return (0, o.useEffect)((() => {
          _ !== c && d && void 0 === t && j()
        }), [_, d, t]), (0, o.useEffect)((() => {
          if (d && A === r.ContextMenuMode.HOVER && !g) return h ? void(R.current && (clearTimeout(R.current), R.current = null)) : (R.current || (R.current = setTimeout((() => {
            K()
          }), P)), () => {
            R.current && (clearTimeout(R.current), R.current = null)
          })
        }), [A, d, h, P, g]), (0, o.useEffect)((() => {
          null == k || k(d, A)
        }), [d, A]), (0, s.useClickOutside)({
          refs: [I, S],
          handler: () => {
            M || j()
          }
        }), {
          isOpen: d,
          setOpen: f,
          animatedOpen: p,
          startAnimation: () => m(!0),
          handleMouseEnter: () => {
            A === r.ContextMenuMode.HOVER && (y(!1), O.current && (clearTimeout(O.current), O.current = null, m(!0)), d || (R.current && (clearTimeout(R.current), R.current = null), m(!0), null == l || l(!0), N(!0), f(!0)), v(!0))
          },
          handleMouseLeave: () => {
            A === r.ContextMenuMode.HOVER && (y(!1), R.current && (clearTimeout(R.current), R.current = null), v(!1))
          },
          handleOpenChange: B,
          onOpenByKeyboard: e => {
            y(e), B(e)
          },
          triggerId: c,
          contentRef: I,
          triggerRef: S,
          onChildOpen: (e, n) => {
            b(e), x(n), n === r.ContextMenuMode.CLICK && (null == k || k(e, n))
          },
          onSubRootOpen: e => {
            E(e)
          },
          closeMenuImmediately: j
        }
      }
    },
    545167: (e, n, t) => {
      t.r(n), t.d(n, {
        useContextMenuSubMenu: () => l
      });
      var o = t(827378),
        r = (t(824246), t(575133)),
        i = t(87829),
        a = t(280799),
        u = t(501765),
        s = t(737517);
      const l = ({
        displayName: e,
        mode: n,
        defaultOpen: t,
        animationDuration: l,
        subMenuOpen: c,
        setSubMenuOpen: d,
        hoverCloseDelay: f,
        onOpen: p,
        onAnimatedOpen: m
      }) => {
        const h = (0, o.useId)(),
          [v, g] = (0, o.useState)(c || t || !1),
          [y, w] = (0, o.useState)(!1),
          [b, C] = (0, o.useState)(!1),
          [x, M] = (0, o.useState)(!1),
          [E, R] = (0, o.useState)(!1),
          [O, I] = (0, o.useState)(!1),
          [S, D] = (0, o.useState)(null),
          {
            activeItemId: P,
            onChildOpen: L,
            level: _,
            onSubRootOpen: k
          } = (0, u.useLevelContext)(e),
          {
            onSubmenuOpen: T
          } = (0, a.useContextMenuContext)(e),
          {
            closeRootMenuImmediately: N
          } = (0, a.useContextMenuRootContext)(e),
          A = (0, o.useRef)(null),
          F = (0, o.useRef)(null),
          j = (0, o.useRef)(null),
          K = (0, o.useRef)(null),
          B = (0, s.useIsTouchDevice)() ? r.ContextMenuMode.CLICK : n,
          H = c || v,
          W = () => {
            j.current && (clearTimeout(j.current), j.current = null), K.current && (clearTimeout(K.current), K.current = null)
          },
          V = (e = !1) => {
            null == d || d(!1), g(!1), null == p || p(!1), C(!1), R(!1), e && (null == N || N())
          },
          G = () => {
            if (W(), B === r.ContextMenuMode.HOVER || E) {
              if (O && S === r.ContextMenuMode.CLICK) return;
              w(!1), K.current = setTimeout((() => {
                V()
              }), l)
            } else V()
          },
          U = e => {
            W(), w(!1), null == d || d(!1), null == p || p(!1), C(!1), R(!1), e && (null == N || N())
          },
          $ = e => {
            B === r.ContextMenuMode.CLICK && void 0 !== t || (e ? (K.current && (clearTimeout(K.current), K.current = null), (B === r.ContextMenuMode.HOVER || E) && w(!0), null == d || d(!0), null == p || p(!0)) : G())
          };
        (0, o.useLayoutEffect)((() => {
          void 0 !== c && w(c)
        }), [c]), (0, o.useEffect)((() => {
          P !== h && (v || c) && U()
        }), [P, v, h]), (0, o.useEffect)((() => {
          !v && !y || B !== r.ContextMenuMode.HOVER && !E || x || (b ? j.current && (clearTimeout(j.current), j.current = null) : j.current || (j.current = setTimeout((() => {
            G()
          }), f)))
        }), [B, v, b, E, f]), (0, o.useEffect)((() => {
          null == m || m(y)
        }), [y]);
        const z = (0, i.useInheritedArrowColor)(v, F);
        return (0, o.useEffect)((() => {
          var e;
          L(H, B), e = H, _ > 1 && (null == T || T(e)), setTimeout((() => null == k ? void 0 : k(e)), 0)
        }), [H, B]), {
          mode: B,
          isOpen: H,
          onOpenChange: $,
          onOpenByKeyboard: e => {
            M(e), null == $ || $(e)
          },
          inheritedArrowColor: z,
          triggerRef: A,
          contentRef: F,
          animatedOpen: y,
          animationDuration: l,
          hoverCloseDelay: f,
          temporaryHoverClose: E,
          closeMenuImmediately: U,
          onMouseEnter: () => {
            M(!1), (B === r.ContextMenuMode.HOVER || E) && (K.current && (clearTimeout(K.current), K.current = null, w(!0)), v || (j.current && (clearTimeout(j.current), j.current = null), w(!0), null == d || d(!0), null == p || p(!0)), C(!0))
          },
          onMouseLeave: () => {
            M(!1), (B === r.ContextMenuMode.HOVER || E) && (j.current && (clearTimeout(j.current), j.current = null), C(!1))
          },
          enableTemporaryHoverClose: () => {
            w(!0), C(!0), R(!0)
          },
          triggerId: h,
          onChildOpen: (e, n) => {
            I(e), D(n)
          }
        }
      }
    },
    87829: (e, n, t) => {
      t.r(n), t.d(n, {
        useInheritedArrowColor: () => r
      });
      var o = t(827378);
      const r = (e, n) => {
        const [t, r] = (0, o.useState)(null);
        return (0, o.useLayoutEffect)((() => {
          if (!e) return;
          const t = requestAnimationFrame((() => {
            const e = e => {
              r(getComputedStyle(e).backgroundColor)
            };
            let t = null,
              o = null;
            const i = () => {
              const r = (() => {
                var e, t;
                if (!n.current) return;
                const o = null == (e = n.current) ? void 0 : e.dataset.side,
                  r = null == (t = n.current) ? void 0 : t.dataset.align;
                if (!o || !r) return;
                const i = Array.from(n.current.children);
                if (!i.length) return;
                let a = "bottom" === o || "top" !== o && "start" === r ? 0 : i.length - 1,
                  u = i[a];
                if (u && (!u.hasAttribute("data-arrow") || ("bottom" === o || "top" !== o && "start" === r ? a += 1 : a -= 1, u = i[a], u)) && (!u.hasAttribute("data-label") || !["left", "right"].includes(n.current.dataset.side ?? "") || "start" !== n.current.dataset.align || ("bottom" === o || "top" !== o && "start" === r ? a += 1 : a -= 1, u = i[a], u))) {
                  if ("group" === u.getAttribute("role") && u.children) {
                    const e = Array.from(u.children);
                    u = "bottom" === o || "top" !== o && "start" === r ? e[0] : e[e.length - 1], u.hasAttribute("data-content-wrapper") && (u = "bottom" === o || "top" !== o && "start" === r ? e[1] : e[e.length - 2])
                  }
                  return u.hasAttribute("data-item") ? u : null
                }
              })();
              if (!r) return;
              e(r), t && t.disconnect(), t = new MutationObserver((() => e(r))), t.observe(r, {
                attributes: !0,
                attributeFilter: ["style", "class", "data-highlighted", "data-state"]
              });
              const i = document.documentElement;
              o = new MutationObserver((() => e(r))), o.observe(i, {
                attributes: !0,
                attributeFilter: ["data-crm-ui-kit-theme"]
              })
            };
            i();
            const a = n.current,
              u = new MutationObserver(i);
            return a && u.observe(a, {
              attributes: !0,
              attributeFilter: ["data-side", "data-align"]
            }), () => {
              null == t || t.disconnect(), null == o || o.disconnect(), u.disconnect()
            }
          }));
          return () => cancelAnimationFrame(t)
        }), [e]), t
      }
    },
    248748: (e, n, t) => {
      t.r(n), t.d(n, {
        useInnerInputsFocus: () => r
      });
      var o = t(827378);
      const r = ({
        isEnabled: e
      }) => {
        const [n, t] = (0, o.useState)(!1), [r, i] = (0, o.useState)(!1), [a, u] = (0, o.useState)(null);
        return (0, o.useLayoutEffect)((() => {
          if (!e || !a) return;
          const n = () => {
            const e = Array.from(a.querySelectorAll("input"));
            t(e.length > 0), i(e.some((e => document.activeElement === e)))
          };
          n();
          const o = e => {
              e.target instanceof HTMLElement && ("INPUT" === e.target.tagName || e.target.isContentEditable) && a.contains(e.target) && i(!0)
            },
            r = () => setTimeout(n, 0);
          a.addEventListener("focusin", o), a.addEventListener("focusout", r);
          const u = new MutationObserver(n);
          return u.observe(a, {
            childList: !0,
            subtree: !0
          }), () => {
            u.disconnect(), a.removeEventListener("focusin", o), a.removeEventListener("focusout", r)
          }
        }), [a, e]), {
          hasInnerInput: n,
          isInnerInputFocused: r,
          handleNodeRef: n => {
            if (u(n), n && e) {
              const e = Array.from(n.querySelectorAll("input"));
              t(e.length > 0), i(e.some((e => document.activeElement === e)))
            }
          }
        }
      }
    },
    737517: (e, n, t) => {
      t.r(n), t.d(n, {
        useIsTouchDevice: () => r
      });
      var o = t(827378);
      const r = () => {
        const [e, n] = (0, o.useState)((() => !(typeof window > "u") && ("ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia && window.matchMedia("(pointer: coarse)").matches)));
        return (0, o.useEffect)((() => {
          const e = e => {
            "touch" === e.pointerType ? n(!0) : "mouse" === e.pointerType && n(!1)
          };
          return window.addEventListener("pointerdown", e), () => {
            window.removeEventListener("pointerdown", e)
          }
        }), []), e
      }
    },
    42552: (e, n, t) => {
      t.r(n), t.d(n, {
        useItemInnerFocus: () => u
      });
      var o = t(827378),
        r = t(280799),
        i = (t(824246), t(248748)),
        a = t(848283);

      function u({
        id: e,
        children: n,
        isSelectableProp: t,
        displayName: u,
        blockerClassName: s
      }) {
        const {
          itemWithFocusedInput: l,
          setItemWithFocusedInput: c,
          enableInnerInputFocus: d
        } = (0, r.useContextMenuRootContext)(u), {
          hasInnerInput: f,
          isInnerInputFocused: p,
          handleNodeRef: m
        } = (0, i.useInnerInputsFocus)({
          isEnabled: d
        }), [h, v] = (0, o.useState)(t ?? !0);
        (0, o.useLayoutEffect)((() => {
          v(void 0 === t && d ? !f : t ?? !0)
        }), [f, t, d]), (0, o.useLayoutEffect)((() => {
          if (d) return p ? c(e) : l === e && c(null), () => {
            l === e && c(null)
          }
        }), [p, l, c, e, d]);
        const g = (0, a.useChildrenWithBlocker)({
          displayName: u,
          children: n,
          shouldShowBlocker: null !== l && l !== e,
          blockerClassName: s
        });
        return {
          isSelectable: h,
          setIsSelectable: v,
          handleNodeRef: m,
          childrenWithBlocker: g
        }
      }
    },
    25923: (e, n, t) => {
      t.r(n), t.d(n, {
        useMouseMoveOutside: () => r
      });
      var o = t(827378);

      function r(e, n) {
        (0, o.useEffect)((() => {
          const t = t => {
            const o = e.current;
            o && (o.contains(t.target) || n(t))
          };
          return document.addEventListener("mousemove", t), () => document.removeEventListener("mousemove", t)
        }), [e, n])
      }
    },
    668654: (e, n, t) => {
      t.r(n), t.d(n, {
        usePrevious: () => r
      });
      var o = t(827378);

      function r(e) {
        const n = (0, o.useRef)();
        return (0, o.useLayoutEffect)((() => {
          n.current = e
        }), [e]), n.current
      }
    },
    335458: (e, n, t) => {
      t.r(n), t.d(n, {
        useStopContextMenuEvents: () => r
      });
      var o = t(827378);
      const r = (e = {}) => {
        const n = (0, o.useCallback)((e => {
            e.stopPropagation(), e.preventDefault()
          }), []),
          t = e => t => {
            n(t), null == e || e(t)
          };
        return {
          onClick: t(e.onClick),
          onKeyDown: t(e.onKeyDown),
          onKeyUp: t(e.onKeyUp),
          onKeyPress: t(e.onKeyPress),
          onPointerDown: t(e.onPointerDown),
          onPointerUp: t(e.onPointerUp),
          onPointerEnter: t(e.onPointerEnter),
          onPointerLeave: t(e.onPointerLeave),
          onPointerMove: t(e.onPointerMove)
        }
      }
    },
    510985: (e, n, t) => {
      t.r(n), t.d(n, {
        useSubMenu: () => a
      });
      var o = t(824246),
        r = t(827378),
        i = t(606215);
      const a = ({
        onKeyDown: e
      }) => {
        const [n, t] = (0, r.useState)(!1), [a, u] = (0, r.useState)(!1), s = (0, r.useRef)(null);
        return (0, r.useEffect)((() => {
          if (!s.current) return;
          const e = s.current.querySelector("[data-submenu-trigger]");
          u(!!e)
        }), [s]), {
          itemRef: s,
          hasSubmenu: a,
          subMenuOpen: n,
          setSubMenuOpen: t,
          handleKeyDown: n => {
            a && "ArrowRight" === n.key && t(!0), null == e || e(n)
          },
          withProvider: e => (0, o.jsx)(i.SubMenuProvider, {
            hasSubmenu: a,
            subMenuOpen: n,
            setSubMenuOpen: t,
            children: e
          })
        }
      }
    },
    456346: (e, n, t) => {
      t.r(n), t.d(n, {
        ContextMenu: () => o.ContextMenu,
        ContextMenuDirection: () => i.Direction,
        ContextMenuMode: () => r.ContextMenuMode
      });
      var o = t(670722),
        r = t(575133),
        i = t(169043)
    },
    501765: (e, n, t) => {
      t.r(n), t.d(n, {
        LevelProvider: () => r,
        useLevelContext: () => i
      });
      var o = t(818910);
      const [r, i] = (0, o.createComponentContext)("ContextMenu.LevelProvider")
    },
    606215: (e, n, t) => {
      t.r(n), t.d(n, {
        DISPLAY_NAME: () => r,
        SubMenuProvider: () => i,
        useSubMenuContext: () => a
      });
      var o = t(818910);
      const r = "ContextMenu.Item",
        [i, a] = (0, o.createComponentContext)(r)
    },
    626331: (e, n, t) => {
      t.r(n), t.d(n, {
        contextMenuBus: () => r
      });
      var o = Object.defineProperty;
      const r = new class {
        constructor() {
          var e;
          ((e, n, t) => {
            n in e ? o(e, n, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: t
            }) : e[n] = t
          })(this, "symbol" != typeof(e = "listeners") ? e + "" : e, [])
        }
        emit(e) {
          this.listeners.forEach((n => n(e)))
        }
        subscribe(e) {
          return this.listeners.push(e), () => {
            this.listeners = this.listeners.filter((n => n !== e))
          }
        }
      }
    },
    145104: (e, n, t) => {
      t.r(n), t.d(n, {
        focusParentItem: () => o
      });
      const o = e => {
        let n = null == e ? void 0 : e.parentElement;
        for (; n;) {
          if (n.hasAttribute("data-item")) return void n.focus();
          n = n.parentElement
        }
      }
    },
    58102: (e, n, t) => {
      t.r(n), t.d(n, {
        hasItemIcon: () => a
      });
      var o = t(827378),
        r = t.n(o);
      const i = ["ItemIcon", "ItemIndicator"],
        a = e => {
          var n;
          const t = r().Children.toArray(e)[0];
          return !!(0, o.isValidElement)(t) && i.includes(null == (n = t.type) ? void 0 : n.displayName)
        }
    },
    860276: (e, n, t) => {
      function o(e) {
        const n = e.current;
        if (!n) return !1;
        const t = n.parentElement;
        return !!t && t.firstElementChild === n
      }
      t.r(n), t.d(n, {
        isFirstElement: () => o
      })
    },
    445790: (e, n, t) => {
      t.r(n), t.d(n, {
        Appearance: () => o.Appearance
      });
      var o = t(861730)
    },
    486773: (e, n, t) => {
      t.r(n), t.d(n, {
        default: () => o
      });
      const o = t.p + "images/c8913dcb338cc1526f85f9e82f8ab0b1.svg"
    },
    831803: (e, n, t) => {
      t.r(n)
    },
    397762: (e, n, t) => {
      t.r(n)
    },
    392007: (e, n, t) => {
      t.r(n)
    },
    782272: (e, n, t) => {
      t.r(n)
    },
    910397: (e, n, t) => {
      t.r(n)
    },
    896999: (e, n, t) => {
      t.r(n)
    },
    654979: (e, n, t) => {
      t.r(n)
    },
    329528: (e, n, t) => {
      t.r(n)
    },
    333351: (e, n, t) => {
      t.r(n)
    },
    902901: (e, n, t) => {
      t.r(n)
    },
    922784: (e, n, t) => {
      t.r(n)
    },
    69103: (e, n, t) => {
      t.r(n)
    },
    135468: (e, n, t) => {
      t.r(n)
    },
    153002: (e, n, t) => {
      t.r(n)
    },
    635805: (e, n, t) => {
      var o;
      t.r(n), t.d(n, {
        A: () => Mi,
        C: () => yi,
        G: () => hi,
        I: () => gi,
        L: () => vi,
        P: () => pi,
        R: () => di,
        S: () => Ei,
        T: () => fi,
        a: () => wi,
        b: () => Ri,
        c: () => Oi,
        d: () => Ci,
        e: () => bi,
        f: () => xi,
        g: () => mi
      });
      var r = t(827378),
        i = t(824246),
        a = t(331542);

      function u(e, n, {
        checkForDefaultPrevented: t = !0
      } = {}) {
        return function(o) {
          if (null == e || e(o), !1 === t || !o.defaultPrevented) return null == n ? void 0 : n(o)
        }
      }

      function s(e, n) {
        if ("function" == typeof e) return e(n);
        null != e && (e.current = n)
      }

      function l(...e) {
        return n => {
          let t = !1;
          const o = e.map((e => {
            const o = s(e, n);
            return !t && "function" == typeof o && (t = !0), o
          }));
          if (t) return () => {
            for (let n = 0; n < o.length; n++) {
              const t = o[n];
              "function" == typeof t ? t() : s(e[n], null)
            }
          }
        }
      }

      function c(...e) {
        return r.useCallback(l(...e), e)
      }

      function d(e, n = []) {
        let t = [];
        const o = () => {
          const n = t.map((e => r.createContext(e)));
          return function(t) {
            const o = (null == t ? void 0 : t[e]) || n;
            return r.useMemo((() => ({
              [`__scope${e}`]: {
                ...t,
                [e]: o
              }
            })), [t, o])
          }
        };
        return o.scopeName = e, [function(n, o) {
          const a = r.createContext(o),
            u = t.length;
          t = [...t, o];
          const s = n => {
            var t;
            const {
              scope: o,
              children: s,
              ...l
            } = n, c = (null == (t = null == o ? void 0 : o[e]) ? void 0 : t[u]) || a, d = r.useMemo((() => l), Object.values(l));
            return (0, i.jsx)(c.Provider, {
              value: d,
              children: s
            })
          };
          return s.displayName = n + "Provider", [s, function(t, i) {
            var s;
            const l = (null == (s = null == i ? void 0 : i[e]) ? void 0 : s[u]) || a,
              c = r.useContext(l);
            if (c) return c;
            if (void 0 !== o) return o;
            throw new Error(`\`${t}\` must be used within \`${n}\``)
          }]
        }, f(o, ...n)]
      }

      function f(...e) {
        const n = e[0];
        if (1 === e.length) return n;
        const t = () => {
          const t = e.map((e => ({
            useScope: e(),
            scopeName: e.scopeName
          })));
          return function(e) {
            const o = t.reduce(((n, {
              useScope: t,
              scopeName: o
            }) => ({
              ...n,
              ...t(e)[`__scope${o}`]
            })), {});
            return r.useMemo((() => ({
              [`__scope${n.scopeName}`]: o
            })), [o])
          }
        };
        return t.scopeName = n.scopeName, t
      }
      var p = null != globalThis && globalThis.document ? r.useLayoutEffect : () => {},
        m = (o || (o = t.t(r, 2)))[" useInsertionEffect ".trim().toString()] || p;

      function h({
        prop: e,
        defaultProp: n,
        onChange: t = (() => {}),
        caller: o
      }) {
        const [i, a, u] = function({
          defaultProp: e,
          onChange: n
        }) {
          const [t, o] = r.useState(e), i = r.useRef(t), a = r.useRef(n);
          return m((() => {
            a.current = n
          }), [n]), r.useEffect((() => {
            var e;
            i.current !== t && (null == (e = a.current) || e.call(a, t), i.current = t)
          }), [t, i]), [t, o, a]
        }({
          defaultProp: n,
          onChange: t
        }), s = void 0 !== e, l = s ? e : i;
        {
          const n = r.useRef(void 0 !== e);
          r.useEffect((() => {
            const e = n.current;
            e !== s && console.warn(`${o} is changing from ${e?"controlled":"uncontrolled"} to ${s?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`), n.current = s
          }), [s, o])
        }
        return [l, r.useCallback((n => {
          var t;
          if (s) {
            const o = function(e) {
              return "function" == typeof e
            }(n) ? n(e) : n;
            o !== e && (null == (t = u.current) || t.call(u, o))
          } else a(n)
        }), [s, e, a, u])]
      }

      function v(e) {
        const n = g(e),
          t = r.forwardRef(((e, t) => {
            const {
              children: o,
              ...a
            } = e, u = r.Children.toArray(o), s = u.find(w);
            if (s) {
              const e = s.props.children,
                o = u.map((n => n === s ? r.Children.count(e) > 1 ? r.Children.only(null) : r.isValidElement(e) ? e.props.children : null : n));
              return (0, i.jsx)(n, {
                ...a,
                ref: t,
                children: r.isValidElement(e) ? r.cloneElement(e, void 0, o) : null
              })
            }
            return (0, i.jsx)(n, {
              ...a,
              ref: t,
              children: o
            })
          }));
        return t.displayName = `${e}.Slot`, t
      }

      function g(e) {
        const n = r.forwardRef(((e, n) => {
          const {
            children: t,
            ...o
          } = e;
          if (r.isValidElement(t)) {
            const e = function(e) {
                var n, t;
                let o = null == (n = Object.getOwnPropertyDescriptor(e.props, "ref")) ? void 0 : n.get,
                  r = o && "isReactWarning" in o && o.isReactWarning;
                return r ? e.ref : (o = null == (t = Object.getOwnPropertyDescriptor(e, "ref")) ? void 0 : t.get, r = o && "isReactWarning" in o && o.isReactWarning, r ? e.props.ref : e.props.ref || e.ref)
              }(t),
              i = function(e, n) {
                const t = {
                  ...n
                };
                for (const o in n) {
                  const r = e[o],
                    i = n[o];
                  /^on[A-Z]/.test(o) ? r && i ? t[o] = (...e) => {
                    const n = i(...e);
                    return r(...e), n
                  } : r && (t[o] = r) : "style" === o ? t[o] = {
                    ...r,
                    ...i
                  } : "className" === o && (t[o] = [r, i].filter(Boolean).join(" "))
                }
                return {
                  ...e,
                  ...t
                }
              }(o, t.props);
            return t.type !== r.Fragment && (i.ref = n ? l(n, e) : e), r.cloneElement(t, i)
          }
          return r.Children.count(t) > 1 ? r.Children.only(null) : null
        }));
        return n.displayName = `${e}.SlotClone`, n
      }
      var y = Symbol("radix.slottable");

      function w(e) {
        return r.isValidElement(e) && "function" == typeof e.type && "__radixId" in e.type && e.type.__radixId === y
      }
      var b = ["a", "button", "div", "form", "h2", "h3", "img", "input", "label", "li", "nav", "ol", "p", "select", "span", "svg", "ul"].reduce(((e, n) => {
        const t = v(`Primitive.${n}`),
          o = r.forwardRef(((e, o) => {
            const {
              asChild: r,
              ...a
            } = e, u = r ? t : n;
            return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), (0, i.jsx)(u, {
              ...a,
              ref: o
            })
          }));
        return o.displayName = `Primitive.${n}`, {
          ...e,
          [n]: o
        }
      }), {});

      function C(e, n) {
        e && a.flushSync((() => e.dispatchEvent(n)))
      }

      function x(e) {
        const n = e + "CollectionProvider",
          [t, o] = d(n),
          [a, u] = t(n, {
            collectionRef: {
              current: null
            },
            itemMap: new Map
          }),
          s = e => {
            const {
              scope: n,
              children: t
            } = e, o = r.useRef(null), u = r.useRef(new Map).current;
            return (0, i.jsx)(a, {
              scope: n,
              itemMap: u,
              collectionRef: o,
              children: t
            })
          };
        s.displayName = n;
        const l = e + "CollectionSlot",
          f = v(l),
          p = r.forwardRef(((e, n) => {
            const {
              scope: t,
              children: o
            } = e, r = c(n, u(l, t).collectionRef);
            return (0, i.jsx)(f, {
              ref: r,
              children: o
            })
          }));
        p.displayName = l;
        const m = e + "CollectionItemSlot",
          h = "data-radix-collection-item",
          g = v(m),
          y = r.forwardRef(((e, n) => {
            const {
              scope: t,
              children: o,
              ...a
            } = e, s = r.useRef(null), l = c(n, s), d = u(m, t);
            return r.useEffect((() => (d.itemMap.set(s, {
              ref: s,
              ...a
            }), () => {
              d.itemMap.delete(s)
            }))), (0, i.jsx)(g, {
              [h]: "",
              ref: l,
              children: o
            })
          }));
        return y.displayName = m, [{
          Provider: s,
          Slot: p,
          ItemSlot: y
        }, function(n) {
          const t = u(e + "CollectionConsumer", n);
          return r.useCallback((() => {
            const e = t.collectionRef.current;
            if (!e) return [];
            const n = Array.from(e.querySelectorAll(`[${h}]`));
            return Array.from(t.itemMap.values()).sort(((e, t) => n.indexOf(e.ref.current) - n.indexOf(t.ref.current)))
          }), [t.collectionRef, t.itemMap])
        }, o]
      }
      var M = r.createContext(void 0);

      function E(e) {
        const n = r.useContext(M);
        return e || n || "ltr"
      }

      function R(e) {
        const n = r.useRef(e);
        return r.useEffect((() => {
          n.current = e
        })), r.useMemo((() => (...e) => {
          var t;
          return null == (t = n.current) ? void 0 : t.call(n, ...e)
        }), [])
      }
      var O, I = "dismissableLayer.update",
        S = r.createContext({
          layers: new Set,
          layersWithOutsidePointerEventsDisabled: new Set,
          branches: new Set
        }),
        D = r.forwardRef(((e, n) => {
          const {
            disableOutsidePointerEvents: t = !1,
            onEscapeKeyDown: o,
            onPointerDownOutside: a,
            onFocusOutside: s,
            onInteractOutside: l,
            onDismiss: d,
            ...f
          } = e, p = r.useContext(S), [m, h] = r.useState(null), v = (null == m ? void 0 : m.ownerDocument) ?? (null == globalThis ? void 0 : globalThis.document), [, g] = r.useState({}), y = c(n, (e => h(e))), w = Array.from(p.layers), [C] = [...p.layersWithOutsidePointerEventsDisabled].slice(-1), x = w.indexOf(C), M = m ? w.indexOf(m) : -1, E = p.layersWithOutsidePointerEventsDisabled.size > 0, D = M >= x, P = function(e, n = (null == globalThis ? void 0 : globalThis.document)) {
            const t = R(e),
              o = r.useRef(!1),
              i = r.useRef((() => {}));
            return r.useEffect((() => {
              const e = e => {
                  if (e.target && !o.current) {
                    let o = function() {
                      _("dismissableLayer.pointerDownOutside", t, r, {
                        discrete: !0
                      })
                    };
                    const r = {
                      originalEvent: e
                    };
                    "touch" === e.pointerType ? (n.removeEventListener("click", i.current), i.current = o, n.addEventListener("click", i.current, {
                      once: !0
                    })) : o()
                  } else n.removeEventListener("click", i.current);
                  o.current = !1
                },
                r = window.setTimeout((() => {
                  n.addEventListener("pointerdown", e)
                }), 0);
              return () => {
                window.clearTimeout(r), n.removeEventListener("pointerdown", e), n.removeEventListener("click", i.current)
              }
            }), [n, t]), {
              onPointerDownCapture: () => o.current = !0
            }
          }((e => {
            const n = e.target,
              t = [...p.branches].some((e => e.contains(n)));
            !D || t || (null == a || a(e), null == l || l(e), e.defaultPrevented || null == d || d())
          }), v), k = function(e, n = (null == globalThis ? void 0 : globalThis.document)) {
            const t = R(e),
              o = r.useRef(!1);
            return r.useEffect((() => {
              const e = e => {
                e.target && !o.current && _("dismissableLayer.focusOutside", t, {
                  originalEvent: e
                }, {
                  discrete: !1
                })
              };
              return n.addEventListener("focusin", e), () => n.removeEventListener("focusin", e)
            }), [n, t]), {
              onFocusCapture: () => o.current = !0,
              onBlurCapture: () => o.current = !1
            }
          }((e => {
            const n = e.target;
            [...p.branches].some((e => e.contains(n))) || (null == s || s(e), null == l || l(e), e.defaultPrevented || null == d || d())
          }), v);
          return function(e, n = (null == globalThis ? void 0 : globalThis.document)) {
            const t = R(e);
            r.useEffect((() => {
              const e = e => {
                "Escape" === e.key && t(e)
              };
              return n.addEventListener("keydown", e, {
                capture: !0
              }), () => n.removeEventListener("keydown", e, {
                capture: !0
              })
            }), [t, n])
          }((e => {
            M === p.layers.size - 1 && (null == o || o(e), !e.defaultPrevented && d && (e.preventDefault(), d()))
          }), v), r.useEffect((() => {
            if (m) return t && (0 === p.layersWithOutsidePointerEventsDisabled.size && (O = v.body.style.pointerEvents, v.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(m)), p.layers.add(m), L(), () => {
              t && 1 === p.layersWithOutsidePointerEventsDisabled.size && (v.body.style.pointerEvents = O)
            }
          }), [m, v, t, p]), r.useEffect((() => () => {
            m && (p.layers.delete(m), p.layersWithOutsidePointerEventsDisabled.delete(m), L())
          }), [m, p]), r.useEffect((() => {
            const e = () => g({});
            return document.addEventListener(I, e), () => document.removeEventListener(I, e)
          }), []), (0, i.jsx)(b.div, {
            ...f,
            ref: y,
            style: {
              pointerEvents: E ? D ? "auto" : "none" : void 0,
              ...e.style
            },
            onFocusCapture: u(e.onFocusCapture, k.onFocusCapture),
            onBlurCapture: u(e.onBlurCapture, k.onBlurCapture),
            onPointerDownCapture: u(e.onPointerDownCapture, P.onPointerDownCapture)
          })
        }));
      D.displayName = "DismissableLayer";
      var P = r.forwardRef(((e, n) => {
        const t = r.useContext(S),
          o = r.useRef(null),
          a = c(n, o);
        return r.useEffect((() => {
          const e = o.current;
          if (e) return t.branches.add(e), () => {
            t.branches.delete(e)
          }
        }), [t.branches]), (0, i.jsx)(b.div, {
          ...e,
          ref: a
        })
      }));

      function L() {
        const e = new CustomEvent(I);
        document.dispatchEvent(e)
      }

      function _(e, n, t, {
        discrete: o
      }) {
        const r = t.originalEvent.target,
          i = new CustomEvent(e, {
            bubbles: !1,
            cancelable: !0,
            detail: t
          });
        n && r.addEventListener(e, n, {
          once: !0
        }), o ? C(r, i) : r.dispatchEvent(i)
      }
      P.displayName = "DismissableLayerBranch";
      var k = 0;

      function T() {
        const e = document.createElement("span");
        return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e
      }
      var N = "focusScope.autoFocusOnMount",
        A = "focusScope.autoFocusOnUnmount",
        F = {
          bubbles: !1,
          cancelable: !0
        },
        j = r.forwardRef(((e, n) => {
          const {
            loop: t = !1,
            trapped: o = !1,
            onMountAutoFocus: a,
            onUnmountAutoFocus: u,
            ...s
          } = e, [l, d] = r.useState(null), f = R(a), p = R(u), m = r.useRef(null), h = c(n, (e => d(e))), v = r.useRef({
            paused: !1,
            pause() {
              this.paused = !0
            },
            resume() {
              this.paused = !1
            }
          }).current;
          r.useEffect((() => {
            if (o) {
              let e = function(e) {
                  if (v.paused || !l) return;
                  const n = e.target;
                  l.contains(n) ? m.current = n : W(m.current, {
                    select: !0
                  })
                },
                n = function(e) {
                  if (v.paused || !l) return;
                  const n = e.relatedTarget;
                  null !== n && (l.contains(n) || W(m.current, {
                    select: !0
                  }))
                },
                t = function(e) {
                  if (document.activeElement === document.body)
                    for (const n of e) n.removedNodes.length > 0 && W(l)
                };
              document.addEventListener("focusin", e), document.addEventListener("focusout", n);
              const o = new MutationObserver(t);
              return l && o.observe(l, {
                childList: !0,
                subtree: !0
              }), () => {
                document.removeEventListener("focusin", e), document.removeEventListener("focusout", n), o.disconnect()
              }
            }
          }), [o, l, v.paused]), r.useEffect((() => {
            if (l) {
              V.add(v);
              const e = document.activeElement;
              if (!l.contains(e)) {
                const n = new CustomEvent(N, F);
                l.addEventListener(N, f), l.dispatchEvent(n), n.defaultPrevented || (function(e, {
                  select: n = !1
                } = {}) {
                  const t = document.activeElement;
                  for (const o of e)
                    if (W(o, {
                        select: n
                      }), document.activeElement !== t) return
                }(function(e) {
                  return e.filter((e => "A" !== e.tagName))
                }(K(l)), {
                  select: !0
                }), document.activeElement === e && W(l))
              }
              return () => {
                l.removeEventListener(N, f), setTimeout((() => {
                  const n = new CustomEvent(A, F);
                  l.addEventListener(A, p), l.dispatchEvent(n), n.defaultPrevented || W(e ?? document.body, {
                    select: !0
                  }), l.removeEventListener(A, p), V.remove(v)
                }), 0)
              }
            }
          }), [l, f, p, v]);
          const g = r.useCallback((e => {
            if (!t && !o || v.paused) return;
            const n = "Tab" === e.key && !e.altKey && !e.ctrlKey && !e.metaKey,
              r = document.activeElement;
            if (n && r) {
              const n = e.currentTarget,
                [o, i] = function(e) {
                  const n = K(e);
                  return [B(n, e), B(n.reverse(), e)]
                }(n);
              o && i ? e.shiftKey || r !== i ? e.shiftKey && r === o && (e.preventDefault(), t && W(i, {
                select: !0
              })) : (e.preventDefault(), t && W(o, {
                select: !0
              })) : r === n && e.preventDefault()
            }
          }), [t, o, v.paused]);
          return (0, i.jsx)(b.div, {
            tabIndex: -1,
            ...s,
            ref: h,
            onKeyDown: g
          })
        }));

      function K(e) {
        const n = [],
          t = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
            acceptNode: e => {
              const n = "INPUT" === e.tagName && "hidden" === e.type;
              return e.disabled || e.hidden || n ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
            }
          });
        for (; t.nextNode();) n.push(t.currentNode);
        return n
      }

      function B(e, n) {
        for (const t of e)
          if (!H(t, {
              upTo: n
            })) return t
      }

      function H(e, {
        upTo: n
      }) {
        if ("hidden" === getComputedStyle(e).visibility) return !0;
        for (; e;) {
          if (void 0 !== n && e === n) return !1;
          if ("none" === getComputedStyle(e).display) return !0;
          e = e.parentElement
        }
        return !1
      }

      function W(e, {
        select: n = !1
      } = {}) {
        if (e && e.focus) {
          const t = document.activeElement;
          e.focus({
            preventScroll: !0
          }), e !== t && function(e) {
            return e instanceof HTMLInputElement && "select" in e
          }(e) && n && e.select()
        }
      }
      j.displayName = "FocusScope";
      var V = function() {
        let e = [];
        return {
          add(n) {
            const t = e[0];
            n !== t && (null == t || t.pause()), e = G(e, n), e.unshift(n)
          },
          remove(n) {
            var t;
            e = G(e, n), null == (t = e[0]) || t.resume()
          }
        }
      }();

      function G(e, n) {
        const t = [...e],
          o = t.indexOf(n);
        return -1 !== o && t.splice(o, 1), t
      }
      var U = (o || (o = t.t(r, 2)))[" useId ".trim().toString()] || (() => {}),
        $ = 0;

      function z(e) {
        const [n, t] = r.useState(U());
        return p((() => {
          t((e => e ?? String($++)))
        }), [e]), e || (n ? `radix-${n}` : "")
      }
      const Y = ["top", "right", "bottom", "left"],
        X = Math.min,
        q = Math.max,
        Z = Math.round,
        J = Math.floor,
        Q = e => ({
          x: e,
          y: e
        }),
        ee = {
          left: "right",
          right: "left",
          bottom: "top",
          top: "bottom"
        },
        ne = {
          start: "end",
          end: "start"
        };

      function te(e, n, t) {
        return q(e, X(n, t))
      }

      function oe(e, n) {
        return "function" == typeof e ? e(n) : e
      }

      function re(e) {
        return e.split("-")[0]
      }

      function ie(e) {
        return e.split("-")[1]
      }

      function ae(e) {
        return "x" === e ? "y" : "x"
      }

      function ue(e) {
        return "y" === e ? "height" : "width"
      }
      const se = new Set(["top", "bottom"]);

      function le(e) {
        return se.has(re(e)) ? "y" : "x"
      }

      function ce(e) {
        return ae(le(e))
      }

      function de(e) {
        return e.replace(/start|end/g, (e => ne[e]))
      }
      const fe = ["left", "right"],
        pe = ["right", "left"],
        me = ["top", "bottom"],
        he = ["bottom", "top"];

      function ve(e) {
        return e.replace(/left|right|bottom|top/g, (e => ee[e]))
      }

      function ge(e) {
        return "number" != typeof e ? function(e) {
          return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            ...e
          }
        }(e) : {
          top: e,
          right: e,
          bottom: e,
          left: e
        }
      }

      function ye(e) {
        const {
          x: n,
          y: t,
          width: o,
          height: r
        } = e;
        return {
          width: o,
          height: r,
          top: t,
          left: n,
          right: n + o,
          bottom: t + r,
          x: n,
          y: t
        }
      }

      function we(e, n, t) {
        let {
          reference: o,
          floating: r
        } = e;
        const i = le(n),
          a = ce(n),
          u = ue(a),
          s = re(n),
          l = "y" === i,
          c = o.x + o.width / 2 - r.width / 2,
          d = o.y + o.height / 2 - r.height / 2,
          f = o[u] / 2 - r[u] / 2;
        let p;
        switch (s) {
          case "top":
            p = {
              x: c,
              y: o.y - r.height
            };
            break;
          case "bottom":
            p = {
              x: c,
              y: o.y + o.height
            };
            break;
          case "right":
            p = {
              x: o.x + o.width,
              y: d
            };
            break;
          case "left":
            p = {
              x: o.x - r.width,
              y: d
            };
            break;
          default:
            p = {
              x: o.x,
              y: o.y
            }
        }
        switch (ie(n)) {
          case "start":
            p[a] -= f * (t && l ? -1 : 1);
            break;
          case "end":
            p[a] += f * (t && l ? -1 : 1)
        }
        return p
      }
      async function be(e, n) {
        var t;
        void 0 === n && (n = {});
        const {
          x: o,
          y: r,
          platform: i,
          rects: a,
          elements: u,
          strategy: s
        } = e, {
          boundary: l = "clippingAncestors",
          rootBoundary: c = "viewport",
          elementContext: d = "floating",
          altBoundary: f = !1,
          padding: p = 0
        } = oe(n, e), m = ge(p), h = u[f ? "floating" === d ? "reference" : "floating" : d], v = ye(await i.getClippingRect({
          element: null == (t = await (null == i.isElement ? void 0 : i.isElement(h))) || t ? h : h.contextElement || await (null == i.getDocumentElement ? void 0 : i.getDocumentElement(u.floating)),
          boundary: l,
          rootBoundary: c,
          strategy: s
        })), g = "floating" === d ? {
          x: o,
          y: r,
          width: a.floating.width,
          height: a.floating.height
        } : a.reference, y = await (null == i.getOffsetParent ? void 0 : i.getOffsetParent(u.floating)), w = await (null == i.isElement ? void 0 : i.isElement(y)) && await (null == i.getScale ? void 0 : i.getScale(y)) || {
          x: 1,
          y: 1
        }, b = ye(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
          elements: u,
          rect: g,
          offsetParent: y,
          strategy: s
        }) : g);
        return {
          top: (v.top - b.top + m.top) / w.y,
          bottom: (b.bottom - v.bottom + m.bottom) / w.y,
          left: (v.left - b.left + m.left) / w.x,
          right: (b.right - v.right + m.right) / w.x
        }
      }

      function Ce(e, n) {
        return {
          top: e.top - n.height,
          right: e.right - n.width,
          bottom: e.bottom - n.height,
          left: e.left - n.width
        }
      }

      function xe(e) {
        return Y.some((n => e[n] >= 0))
      }
      const Me = new Set(["left", "top"]);

      function Ee() {
        return typeof window < "u"
      }

      function Re(e) {
        return Se(e) ? (e.nodeName || "").toLowerCase() : "#document"
      }

      function Oe(e) {
        var n;
        return (null == e || null == (n = e.ownerDocument) ? void 0 : n.defaultView) || window
      }

      function Ie(e) {
        var n;
        return null == (n = (Se(e) ? e.ownerDocument : e.document) || window.document) ? void 0 : n.documentElement
      }

      function Se(e) {
        return !!Ee() && (e instanceof Node || e instanceof Oe(e).Node)
      }

      function De(e) {
        return !!Ee() && (e instanceof Element || e instanceof Oe(e).Element)
      }

      function Pe(e) {
        return !!Ee() && (e instanceof HTMLElement || e instanceof Oe(e).HTMLElement)
      }

      function Le(e) {
        return !(!Ee() || typeof ShadowRoot > "u") && (e instanceof ShadowRoot || e instanceof Oe(e).ShadowRoot)
      }
      const _e = new Set(["inline", "contents"]);

      function ke(e) {
        const {
          overflow: n,
          overflowX: t,
          overflowY: o,
          display: r
        } = Ue(e);
        return /auto|scroll|overlay|hidden|clip/.test(n + o + t) && !_e.has(r)
      }
      const Te = new Set(["table", "td", "th"]);

      function Ne(e) {
        return Te.has(Re(e))
      }
      const Ae = [":popover-open", ":modal"];

      function Fe(e) {
        return Ae.some((n => {
          try {
            return e.matches(n)
          } catch {
            return !1
          }
        }))
      }
      const je = ["transform", "translate", "scale", "rotate", "perspective"],
        Ke = ["transform", "translate", "scale", "rotate", "perspective", "filter"],
        Be = ["paint", "layout", "strict", "content"];

      function He(e) {
        const n = We(),
          t = De(e) ? Ue(e) : e;
        return je.some((e => !!t[e] && "none" !== t[e])) || !!t.containerType && "normal" !== t.containerType || !n && !!t.backdropFilter && "none" !== t.backdropFilter || !n && !!t.filter && "none" !== t.filter || Ke.some((e => (t.willChange || "").includes(e))) || Be.some((e => (t.contain || "").includes(e)))
      }

      function We() {
        return !(typeof CSS > "u" || !CSS.supports) && CSS.supports("-webkit-backdrop-filter", "none")
      }
      const Ve = new Set(["html", "body", "#document"]);

      function Ge(e) {
        return Ve.has(Re(e))
      }

      function Ue(e) {
        return Oe(e).getComputedStyle(e)
      }

      function $e(e) {
        return De(e) ? {
          scrollLeft: e.scrollLeft,
          scrollTop: e.scrollTop
        } : {
          scrollLeft: e.scrollX,
          scrollTop: e.scrollY
        }
      }

      function ze(e) {
        if ("html" === Re(e)) return e;
        const n = e.assignedSlot || e.parentNode || Le(e) && e.host || Ie(e);
        return Le(n) ? n.host : n
      }

      function Ye(e) {
        const n = ze(e);
        return Ge(n) ? e.ownerDocument ? e.ownerDocument.body : e.body : Pe(n) && ke(n) ? n : Ye(n)
      }

      function Xe(e, n, t) {
        var o;
        void 0 === n && (n = []), void 0 === t && (t = !0);
        const r = Ye(e),
          i = r === (null == (o = e.ownerDocument) ? void 0 : o.body),
          a = Oe(r);
        if (i) {
          const e = qe(a);
          return n.concat(a, a.visualViewport || [], ke(r) ? r : [], e && t ? Xe(e) : [])
        }
        return n.concat(r, Xe(r, [], t))
      }

      function qe(e) {
        return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null
      }

      function Ze(e) {
        const n = Ue(e);
        let t = parseFloat(n.width) || 0,
          o = parseFloat(n.height) || 0;
        const r = Pe(e),
          i = r ? e.offsetWidth : t,
          a = r ? e.offsetHeight : o,
          u = Z(t) !== i || Z(o) !== a;
        return u && (t = i, o = a), {
          width: t,
          height: o,
          $: u
        }
      }

      function Je(e) {
        return De(e) ? e : e.contextElement
      }

      function Qe(e) {
        const n = Je(e);
        if (!Pe(n)) return Q(1);
        const t = n.getBoundingClientRect(),
          {
            width: o,
            height: r,
            $: i
          } = Ze(n);
        let a = (i ? Z(t.width) : t.width) / o,
          u = (i ? Z(t.height) : t.height) / r;
        return (!a || !Number.isFinite(a)) && (a = 1), (!u || !Number.isFinite(u)) && (u = 1), {
          x: a,
          y: u
        }
      }
      const en = Q(0);

      function nn(e) {
        const n = Oe(e);
        return We() && n.visualViewport ? {
          x: n.visualViewport.offsetLeft,
          y: n.visualViewport.offsetTop
        } : en
      }

      function tn(e, n, t, o) {
        void 0 === n && (n = !1), void 0 === t && (t = !1);
        const r = e.getBoundingClientRect(),
          i = Je(e);
        let a = Q(1);
        n && (o ? De(o) && (a = Qe(o)) : a = Qe(e));
        const u = function(e, n, t) {
          return void 0 === n && (n = !1), !(!t || n && t !== Oe(e)) && n
        }(i, t, o) ? nn(i) : Q(0);
        let s = (r.left + u.x) / a.x,
          l = (r.top + u.y) / a.y,
          c = r.width / a.x,
          d = r.height / a.y;
        if (i) {
          const e = Oe(i),
            n = o && De(o) ? Oe(o) : o;
          let t = e,
            r = qe(t);
          for (; r && o && n !== t;) {
            const e = Qe(r),
              n = r.getBoundingClientRect(),
              o = Ue(r),
              i = n.left + (r.clientLeft + parseFloat(o.paddingLeft)) * e.x,
              a = n.top + (r.clientTop + parseFloat(o.paddingTop)) * e.y;
            s *= e.x, l *= e.y, c *= e.x, d *= e.y, s += i, l += a, t = Oe(r), r = qe(t)
          }
        }
        return ye({
          width: c,
          height: d,
          x: s,
          y: l
        })
      }

      function on(e, n) {
        const t = $e(e).scrollLeft;
        return n ? n.left + t : tn(Ie(e)).left + t
      }

      function rn(e, n, t) {
        void 0 === t && (t = !1);
        const o = e.getBoundingClientRect();
        return {
          x: o.left + n.scrollLeft - (t ? 0 : on(e, o)),
          y: o.top + n.scrollTop
        }
      }
      const an = new Set(["absolute", "fixed"]);

      function un(e, n, t) {
        let o;
        if ("viewport" === n) o = function(e, n) {
          const t = Oe(e),
            o = Ie(e),
            r = t.visualViewport;
          let i = o.clientWidth,
            a = o.clientHeight,
            u = 0,
            s = 0;
          if (r) {
            i = r.width, a = r.height;
            const e = We();
            (!e || e && "fixed" === n) && (u = r.offsetLeft, s = r.offsetTop)
          }
          return {
            width: i,
            height: a,
            x: u,
            y: s
          }
        }(e, t);
        else if ("document" === n) o = function(e) {
          const n = Ie(e),
            t = $e(e),
            o = e.ownerDocument.body,
            r = q(n.scrollWidth, n.clientWidth, o.scrollWidth, o.clientWidth),
            i = q(n.scrollHeight, n.clientHeight, o.scrollHeight, o.clientHeight);
          let a = -t.scrollLeft + on(e);
          const u = -t.scrollTop;
          return "rtl" === Ue(o).direction && (a += q(n.clientWidth, o.clientWidth) - r), {
            width: r,
            height: i,
            x: a,
            y: u
          }
        }(Ie(e));
        else if (De(n)) o = function(e, n) {
          const t = tn(e, !0, "fixed" === n),
            o = t.top + e.clientTop,
            r = t.left + e.clientLeft,
            i = Pe(e) ? Qe(e) : Q(1);
          return {
            width: e.clientWidth * i.x,
            height: e.clientHeight * i.y,
            x: r * i.x,
            y: o * i.y
          }
        }(n, t);
        else {
          const t = nn(e);
          o = {
            x: n.x - t.x,
            y: n.y - t.y,
            width: n.width,
            height: n.height
          }
        }
        return ye(o)
      }

      function sn(e, n) {
        const t = ze(e);
        return !(t === n || !De(t) || Ge(t)) && ("fixed" === Ue(t).position || sn(t, n))
      }

      function ln(e, n) {
        const t = n.get(e);
        if (t) return t;
        let o = Xe(e, [], !1).filter((e => De(e) && "body" !== Re(e))),
          r = null;
        const i = "fixed" === Ue(e).position;
        let a = i ? ze(e) : e;
        for (; De(a) && !Ge(a);) {
          const n = Ue(a),
            t = He(a);
          !t && "fixed" === n.position && (r = null), (i ? !t && !r : !t && "static" === n.position && r && an.has(r.position) || ke(a) && !t && sn(e, a)) ? o = o.filter((e => e !== a)) : r = n, a = ze(a)
        }
        return n.set(e, o), o
      }

      function cn(e, n, t) {
        const o = Pe(n),
          r = Ie(n),
          i = "fixed" === t,
          a = tn(e, !0, i, n);
        let u = {
          scrollLeft: 0,
          scrollTop: 0
        };
        const s = Q(0);

        function l() {
          s.x = on(r)
        }
        if (o || !o && !i)
          if (("body" !== Re(n) || ke(r)) && (u = $e(n)), o) {
            const e = tn(n, !0, i, n);
            s.x = e.x + n.clientLeft, s.y = e.y + n.clientTop
          } else r && l();
        i && !o && r && l();
        const c = !r || o || i ? Q(0) : rn(r, u);
        return {
          x: a.left + u.scrollLeft - s.x - c.x,
          y: a.top + u.scrollTop - s.y - c.y,
          width: a.width,
          height: a.height
        }
      }

      function dn(e) {
        return "static" === Ue(e).position
      }

      function fn(e, n) {
        if (!Pe(e) || "fixed" === Ue(e).position) return null;
        if (n) return n(e);
        let t = e.offsetParent;
        return Ie(e) === t && (t = t.ownerDocument.body), t
      }

      function pn(e, n) {
        const t = Oe(e);
        if (Fe(e)) return t;
        if (!Pe(e)) {
          let n = ze(e);
          for (; n && !Ge(n);) {
            if (De(n) && !dn(n)) return n;
            n = ze(n)
          }
          return t
        }
        let o = fn(e, n);
        for (; o && Ne(o) && dn(o);) o = fn(o, n);
        return o && Ge(o) && dn(o) && !He(o) ? t : o || function(e) {
          let n = ze(e);
          for (; Pe(n) && !Ge(n);) {
            if (He(n)) return n;
            if (Fe(n)) return null;
            n = ze(n)
          }
          return null
        }(e) || t
      }
      const mn = {
        convertOffsetParentRelativeRectToViewportRelativeRect: function(e) {
          let {
            elements: n,
            rect: t,
            offsetParent: o,
            strategy: r
          } = e;
          const i = "fixed" === r,
            a = Ie(o),
            u = !!n && Fe(n.floating);
          if (o === a || u && i) return t;
          let s = {
              scrollLeft: 0,
              scrollTop: 0
            },
            l = Q(1);
          const c = Q(0),
            d = Pe(o);
          if ((d || !d && !i) && (("body" !== Re(o) || ke(a)) && (s = $e(o)), Pe(o))) {
            const e = tn(o);
            l = Qe(o), c.x = e.x + o.clientLeft, c.y = e.y + o.clientTop
          }
          const f = !a || d || i ? Q(0) : rn(a, s, !0);
          return {
            width: t.width * l.x,
            height: t.height * l.y,
            x: t.x * l.x - s.scrollLeft * l.x + c.x + f.x,
            y: t.y * l.y - s.scrollTop * l.y + c.y + f.y
          }
        },
        getDocumentElement: Ie,
        getClippingRect: function(e) {
          let {
            element: n,
            boundary: t,
            rootBoundary: o,
            strategy: r
          } = e;
          const i = [..."clippingAncestors" === t ? Fe(n) ? [] : ln(n, this._c) : [].concat(t), o],
            a = i[0],
            u = i.reduce(((e, t) => {
              const o = un(n, t, r);
              return e.top = q(o.top, e.top), e.right = X(o.right, e.right), e.bottom = X(o.bottom, e.bottom), e.left = q(o.left, e.left), e
            }), un(n, a, r));
          return {
            width: u.right - u.left,
            height: u.bottom - u.top,
            x: u.left,
            y: u.top
          }
        },
        getOffsetParent: pn,
        getElementRects: async function(e) {
          const n = this.getOffsetParent || pn,
            t = this.getDimensions,
            o = await t(e.floating);
          return {
            reference: cn(e.reference, await n(e.floating), e.strategy),
            floating: {
              x: 0,
              y: 0,
              width: o.width,
              height: o.height
            }
          }
        },
        getClientRects: function(e) {
          return Array.from(e.getClientRects())
        },
        getDimensions: function(e) {
          const {
            width: n,
            height: t
          } = Ze(e);
          return {
            width: n,
            height: t
          }
        },
        getScale: Qe,
        isElement: De,
        isRTL: function(e) {
          return "rtl" === Ue(e).direction
        }
      };

      function hn(e, n) {
        return e.x === n.x && e.y === n.y && e.width === n.width && e.height === n.height
      }
      const vn = function(e) {
          return void 0 === e && (e = 0), {
            name: "offset",
            options: e,
            async fn(n) {
              var t, o;
              const {
                x: r,
                y: i,
                placement: a,
                middlewareData: u
              } = n, s = await async function(e, n) {
                const {
                  placement: t,
                  platform: o,
                  elements: r
                } = e, i = await (null == o.isRTL ? void 0 : o.isRTL(r.floating)), a = re(t), u = ie(t), s = "y" === le(t), l = Me.has(a) ? -1 : 1, c = i && s ? -1 : 1, d = oe(n, e);
                let {
                  mainAxis: f,
                  crossAxis: p,
                  alignmentAxis: m
                } = "number" == typeof d ? {
                  mainAxis: d,
                  crossAxis: 0,
                  alignmentAxis: null
                } : {
                  mainAxis: d.mainAxis || 0,
                  crossAxis: d.crossAxis || 0,
                  alignmentAxis: d.alignmentAxis
                };
                return u && "number" == typeof m && (p = "end" === u ? -1 * m : m), s ? {
                  x: p * c,
                  y: f * l
                } : {
                  x: f * l,
                  y: p * c
                }
              }(n, e);
              return a === (null == (t = u.offset) ? void 0 : t.placement) && null != (o = u.arrow) && o.alignmentOffset ? {} : {
                x: r + s.x,
                y: i + s.y,
                data: {
                  ...s,
                  placement: a
                }
              }
            }
          }
        },
        gn = function(e) {
          return void 0 === e && (e = {}), {
            name: "shift",
            options: e,
            async fn(n) {
              const {
                x: t,
                y: o,
                placement: r
              } = n, {
                mainAxis: i = !0,
                crossAxis: a = !1,
                limiter: u = {
                  fn: e => {
                    let {
                      x: n,
                      y: t
                    } = e;
                    return {
                      x: n,
                      y: t
                    }
                  }
                },
                ...s
              } = oe(e, n), l = {
                x: t,
                y: o
              }, c = await be(n, s), d = le(re(r)), f = ae(d);
              let p = l[f],
                m = l[d];
              if (i) {
                const e = "y" === f ? "bottom" : "right";
                p = te(p + c["y" === f ? "top" : "left"], p, p - c[e])
              }
              if (a) {
                const e = "y" === d ? "bottom" : "right";
                m = te(m + c["y" === d ? "top" : "left"], m, m - c[e])
              }
              const h = u.fn({
                ...n,
                [f]: p,
                [d]: m
              });
              return {
                ...h,
                data: {
                  x: h.x - t,
                  y: h.y - o,
                  enabled: {
                    [f]: i,
                    [d]: a
                  }
                }
              }
            }
          }
        },
        yn = function(e) {
          return void 0 === e && (e = {}), {
            name: "flip",
            options: e,
            async fn(n) {
              var t, o;
              const {
                placement: r,
                middlewareData: i,
                rects: a,
                initialPlacement: u,
                platform: s,
                elements: l
              } = n, {
                mainAxis: c = !0,
                crossAxis: d = !0,
                fallbackPlacements: f,
                fallbackStrategy: p = "bestFit",
                fallbackAxisSideDirection: m = "none",
                flipAlignment: h = !0,
                ...v
              } = oe(e, n);
              if (null != (t = i.arrow) && t.alignmentOffset) return {};
              const g = re(r),
                y = le(u),
                w = re(u) === u,
                b = await (null == s.isRTL ? void 0 : s.isRTL(l.floating)),
                C = f || (w || !h ? [ve(u)] : function(e) {
                  const n = ve(e);
                  return [de(e), n, de(n)]
                }(u)),
                x = "none" !== m;
              !f && x && C.push(... function(e, n, t, o) {
                const r = ie(e);
                let i = function(e, n, t) {
                  switch (e) {
                    case "top":
                    case "bottom":
                      return t ? n ? pe : fe : n ? fe : pe;
                    case "left":
                    case "right":
                      return n ? me : he;
                    default:
                      return []
                  }
                }(re(e), "start" === t, o);
                return r && (i = i.map((e => e + "-" + r)), n && (i = i.concat(i.map(de)))), i
              }(u, h, m, b));
              const M = [u, ...C],
                E = await be(n, v),
                R = [];
              let O = (null == (o = i.flip) ? void 0 : o.overflows) || [];
              if (c && R.push(E[g]), d) {
                const e = function(e, n, t) {
                  void 0 === t && (t = !1);
                  const o = ie(e),
                    r = ce(e),
                    i = ue(r);
                  let a = "x" === r ? o === (t ? "end" : "start") ? "right" : "left" : "start" === o ? "bottom" : "top";
                  return n.reference[i] > n.floating[i] && (a = ve(a)), [a, ve(a)]
                }(r, a, b);
                R.push(E[e[0]], E[e[1]])
              }
              if (O = [...O, {
                  placement: r,
                  overflows: R
                }], !R.every((e => e <= 0))) {
                var I, S;
                const e = ((null == (I = i.flip) ? void 0 : I.index) || 0) + 1,
                  n = M[e];
                if (n && ("alignment" !== d || y === le(n) || O.every((e => le(e.placement) !== y || e.overflows[0] > 0)))) return {
                  data: {
                    index: e,
                    overflows: O
                  },
                  reset: {
                    placement: n
                  }
                };
                let t = null == (S = O.filter((e => e.overflows[0] <= 0)).sort(((e, n) => e.overflows[1] - n.overflows[1]))[0]) ? void 0 : S.placement;
                if (!t) switch (p) {
                  case "bestFit": {
                    var D;
                    const e = null == (D = O.filter((e => {
                      if (x) {
                        const n = le(e.placement);
                        return n === y || "y" === n
                      }
                      return !0
                    })).map((e => [e.placement, e.overflows.filter((e => e > 0)).reduce(((e, n) => e + n), 0)])).sort(((e, n) => e[1] - n[1]))[0]) ? void 0 : D[0];
                    e && (t = e);
                    break
                  }
                  case "initialPlacement":
                    t = u
                }
                if (r !== t) return {
                  reset: {
                    placement: t
                  }
                }
              }
              return {}
            }
          }
        },
        wn = function(e) {
          return void 0 === e && (e = {}), {
            name: "size",
            options: e,
            async fn(n) {
              var t, o;
              const {
                placement: r,
                rects: i,
                platform: a,
                elements: u
              } = n, {
                apply: s = (() => {}),
                ...l
              } = oe(e, n), c = await be(n, l), d = re(r), f = ie(r), p = "y" === le(r), {
                width: m,
                height: h
              } = i.floating;
              let v, g;
              "top" === d || "bottom" === d ? (v = d, g = f === (await (null == a.isRTL ? void 0 : a.isRTL(u.floating)) ? "start" : "end") ? "left" : "right") : (g = d, v = "end" === f ? "top" : "bottom");
              const y = h - c.top - c.bottom,
                w = m - c.left - c.right,
                b = X(h - c[v], y),
                C = X(m - c[g], w),
                x = !n.middlewareData.shift;
              let M = b,
                E = C;
              if (null != (t = n.middlewareData.shift) && t.enabled.x && (E = w), null != (o = n.middlewareData.shift) && o.enabled.y && (M = y), x && !f) {
                const e = q(c.left, 0),
                  n = q(c.right, 0),
                  t = q(c.top, 0),
                  o = q(c.bottom, 0);
                p ? E = m - 2 * (0 !== e || 0 !== n ? e + n : q(c.left, c.right)) : M = h - 2 * (0 !== t || 0 !== o ? t + o : q(c.top, c.bottom))
              }
              await s({
                ...n,
                availableWidth: E,
                availableHeight: M
              });
              const R = await a.getDimensions(u.floating);
              return m !== R.width || h !== R.height ? {
                reset: {
                  rects: !0
                }
              } : {}
            }
          }
        },
        bn = function(e) {
          return void 0 === e && (e = {}), {
            name: "hide",
            options: e,
            async fn(n) {
              const {
                rects: t
              } = n, {
                strategy: o = "referenceHidden",
                ...r
              } = oe(e, n);
              switch (o) {
                case "referenceHidden": {
                  const e = Ce(await be(n, {
                    ...r,
                    elementContext: "reference"
                  }), t.reference);
                  return {
                    data: {
                      referenceHiddenOffsets: e,
                      referenceHidden: xe(e)
                    }
                  }
                }
                case "escaped": {
                  const e = Ce(await be(n, {
                    ...r,
                    altBoundary: !0
                  }), t.floating);
                  return {
                    data: {
                      escapedOffsets: e,
                      escaped: xe(e)
                    }
                  }
                }
                default:
                  return {}
              }
            }
          }
        },
        Cn = e => ({
          name: "arrow",
          options: e,
          async fn(n) {
            const {
              x: t,
              y: o,
              placement: r,
              rects: i,
              platform: a,
              elements: u,
              middlewareData: s
            } = n, {
              element: l,
              padding: c = 0
            } = oe(e, n) || {};
            if (null == l) return {};
            const d = ge(c),
              f = {
                x: t,
                y: o
              },
              p = ce(r),
              m = ue(p),
              h = await a.getDimensions(l),
              v = "y" === p,
              g = v ? "top" : "left",
              y = v ? "bottom" : "right",
              w = v ? "clientHeight" : "clientWidth",
              b = i.reference[m] + i.reference[p] - f[p] - i.floating[m],
              C = f[p] - i.reference[p],
              x = await (null == a.getOffsetParent ? void 0 : a.getOffsetParent(l));
            let M = x ? x[w] : 0;
            (!M || !await (null == a.isElement ? void 0 : a.isElement(x))) && (M = u.floating[w] || i.floating[m]);
            const E = b / 2 - C / 2,
              R = M / 2 - h[m] / 2 - 1,
              O = X(d[g], R),
              I = X(d[y], R),
              S = O,
              D = M - h[m] - I,
              P = M / 2 - h[m] / 2 + E,
              L = te(S, P, D),
              _ = !s.arrow && null != ie(r) && P !== L && i.reference[m] / 2 - (P < S ? O : I) - h[m] / 2 < 0,
              k = _ ? P < S ? P - S : P - D : 0;
            return {
              [p]: f[p] + k,
              data: {
                [p]: L,
                centerOffset: P - L - k,
                ..._ && {
                  alignmentOffset: k
                }
              },
              reset: _
            }
          }
        }),
        xn = function(e) {
          return void 0 === e && (e = {}), {
            options: e,
            fn(n) {
              const {
                x: t,
                y: o,
                placement: r,
                rects: i,
                middlewareData: a
              } = n, {
                offset: u = 0,
                mainAxis: s = !0,
                crossAxis: l = !0
              } = oe(e, n), c = {
                x: t,
                y: o
              }, d = le(r), f = ae(d);
              let p = c[f],
                m = c[d];
              const h = oe(u, n),
                v = "number" == typeof h ? {
                  mainAxis: h,
                  crossAxis: 0
                } : {
                  mainAxis: 0,
                  crossAxis: 0,
                  ...h
                };
              if (s) {
                const e = "y" === f ? "height" : "width",
                  n = i.reference[f] - i.floating[e] + v.mainAxis,
                  t = i.reference[f] + i.reference[e] - v.mainAxis;
                p < n ? p = n : p > t && (p = t)
              }
              if (l) {
                var g, y;
                const e = "y" === f ? "width" : "height",
                  n = Me.has(re(r)),
                  t = i.reference[d] - i.floating[e] + (n && (null == (g = a.offset) ? void 0 : g[d]) || 0) + (n ? 0 : v.crossAxis),
                  o = i.reference[d] + i.reference[e] + (n ? 0 : (null == (y = a.offset) ? void 0 : y[d]) || 0) - (n ? v.crossAxis : 0);
                m < t ? m = t : m > o && (m = o)
              }
              return {
                [f]: p,
                [d]: m
              }
            }
          }
        };
      var Mn = typeof document < "u" ? r.useLayoutEffect : function() {};

      function En(e, n) {
        if (e === n) return !0;
        if (typeof e != typeof n) return !1;
        if ("function" == typeof e && e.toString() === n.toString()) return !0;
        let t, o, r;
        if (e && n && "object" == typeof e) {
          if (Array.isArray(e)) {
            if (t = e.length, t !== n.length) return !1;
            for (o = t; 0 != o--;)
              if (!En(e[o], n[o])) return !1;
            return !0
          }
          if (r = Object.keys(e), t = r.length, t !== Object.keys(n).length) return !1;
          for (o = t; 0 != o--;)
            if (!{}.hasOwnProperty.call(n, r[o])) return !1;
          for (o = t; 0 != o--;) {
            const t = r[o];
            if (!("_owner" === t && e.$$typeof || En(e[t], n[t]))) return !1
          }
          return !0
        }
        return e != e && n != n
      }

      function Rn(e) {
        return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1
      }

      function On(e, n) {
        const t = Rn(e);
        return Math.round(n * t) / t
      }

      function In(e) {
        const n = r.useRef(e);
        return Mn((() => {
          n.current = e
        })), n
      }
      const Sn = e => ({
          name: "arrow",
          options: e,
          fn(n) {
            const {
              element: t,
              padding: o
            } = "function" == typeof e ? e(n) : e;
            return t && function(e) {
              return {}.hasOwnProperty.call(e, "current")
            }(t) ? null != t.current ? Cn({
              element: t.current,
              padding: o
            }).fn(n) : {} : t ? Cn({
              element: t,
              padding: o
            }).fn(n) : {}
          }
        }),
        Dn = (e, n) => ({
          ...vn(e),
          options: [e, n]
        }),
        Pn = (e, n) => ({
          ...gn(e),
          options: [e, n]
        }),
        Ln = (e, n) => ({
          ...xn(e),
          options: [e, n]
        }),
        _n = (e, n) => ({
          ...yn(e),
          options: [e, n]
        }),
        kn = (e, n) => ({
          ...wn(e),
          options: [e, n]
        }),
        Tn = (e, n) => ({
          ...bn(e),
          options: [e, n]
        }),
        Nn = (e, n) => ({
          ...Sn(e),
          options: [e, n]
        });
      var An = r.forwardRef(((e, n) => {
        const {
          children: t,
          width: o = 10,
          height: r = 5,
          ...a
        } = e;
        return (0, i.jsx)(b.svg, {
          ...a,
          ref: n,
          width: o,
          height: r,
          viewBox: "0 0 30 10",
          preserveAspectRatio: "none",
          children: e.asChild ? t : (0, i.jsx)("polygon", {
            points: "0,0 30,0 15,10"
          })
        })
      }));
      An.displayName = "Arrow";
      var Fn = An,
        jn = "Popper",
        [Kn, Bn] = d(jn),
        [Hn, Wn] = Kn(jn),
        Vn = e => {
          const {
            __scopePopper: n,
            children: t
          } = e, [o, a] = r.useState(null);
          return (0, i.jsx)(Hn, {
            scope: n,
            anchor: o,
            onAnchorChange: a,
            children: t
          })
        };
      Vn.displayName = jn;
      var Gn = "PopperAnchor",
        Un = r.forwardRef(((e, n) => {
          const {
            __scopePopper: t,
            virtualRef: o,
            ...a
          } = e, u = Wn(Gn, t), s = r.useRef(null), l = c(n, s);
          return r.useEffect((() => {
            u.onAnchorChange((null == o ? void 0 : o.current) || s.current)
          })), o ? null : (0, i.jsx)(b.div, {
            ...a,
            ref: l
          })
        }));
      Un.displayName = Gn;
      var $n = "PopperContent",
        [zn, Yn] = Kn($n),
        Xn = r.forwardRef(((e, n) => {
          var t, o, u, s, l, d;
          const {
            __scopePopper: f,
            side: m = "bottom",
            sideOffset: h = 0,
            align: v = "center",
            alignOffset: g = 0,
            arrowPadding: y = 0,
            avoidCollisions: w = !0,
            collisionBoundary: C = [],
            collisionPadding: x = 0,
            sticky: M = "partial",
            hideWhenDetached: E = !1,
            updatePositionStrategy: O = "optimized",
            onPlaced: I,
            ...S
          } = e, D = Wn($n, f), [P, L] = r.useState(null), _ = c(n, (e => L(e))), [k, T] = r.useState(null), N = function(e) {
            const [n, t] = r.useState(void 0);
            return p((() => {
              if (e) {
                t({
                  width: e.offsetWidth,
                  height: e.offsetHeight
                });
                const n = new ResizeObserver((n => {
                  if (!Array.isArray(n) || !n.length) return;
                  const o = n[0];
                  let r, i;
                  if ("borderBoxSize" in o) {
                    const e = o.borderBoxSize,
                      n = Array.isArray(e) ? e[0] : e;
                    r = n.inlineSize, i = n.blockSize
                  } else r = e.offsetWidth, i = e.offsetHeight;
                  t({
                    width: r,
                    height: i
                  })
                }));
                return n.observe(e, {
                  box: "border-box"
                }), () => n.unobserve(e)
              }
              t(void 0)
            }), [e]), n
          }(k), A = (null == N ? void 0 : N.width) ?? 0, F = (null == N ? void 0 : N.height) ?? 0, j = m + ("center" !== v ? "-" + v : ""), K = "number" == typeof x ? x : {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            ...x
          }, B = Array.isArray(C) ? C : [C], H = B.length > 0, W = {
            padding: K,
            boundary: B.filter(Qn),
            altBoundary: H
          }, {
            refs: V,
            floatingStyles: G,
            placement: U,
            isPositioned: $,
            middlewareData: z
          } = function(e) {
            void 0 === e && (e = {});
            const {
              placement: n = "bottom",
              strategy: t = "absolute",
              middleware: o = [],
              platform: i,
              elements: {
                reference: u,
                floating: s
              } = {},
              transform: l = !0,
              whileElementsMounted: c,
              open: d
            } = e, [f, p] = r.useState({
              x: 0,
              y: 0,
              strategy: t,
              placement: n,
              middlewareData: {},
              isPositioned: !1
            }), [m, h] = r.useState(o);
            En(m, o) || h(o);
            const [v, g] = r.useState(null), [y, w] = r.useState(null), b = r.useCallback((e => {
              e !== E.current && (E.current = e, g(e))
            }), []), C = r.useCallback((e => {
              e !== R.current && (R.current = e, w(e))
            }), []), x = u || v, M = s || y, E = r.useRef(null), R = r.useRef(null), O = r.useRef(f), I = null != c, S = In(c), D = In(i), P = In(d), L = r.useCallback((() => {
              if (!E.current || !R.current) return;
              const e = {
                placement: n,
                strategy: t,
                middleware: m
              };
              D.current && (e.platform = D.current), ((e, n, t) => {
                const o = new Map,
                  r = {
                    platform: mn,
                    ...t
                  },
                  i = {
                    ...r.platform,
                    _c: o
                  };
                return (async (e, n, t) => {
                  const {
                    placement: o = "bottom",
                    strategy: r = "absolute",
                    middleware: i = [],
                    platform: a
                  } = t, u = i.filter(Boolean), s = await (null == a.isRTL ? void 0 : a.isRTL(n));
                  let l = await a.getElementRects({
                      reference: e,
                      floating: n,
                      strategy: r
                    }),
                    {
                      x: c,
                      y: d
                    } = we(l, o, s),
                    f = o,
                    p = {},
                    m = 0;
                  for (let t = 0; t < u.length; t++) {
                    const {
                      name: i,
                      fn: h
                    } = u[t], {
                      x: v,
                      y: g,
                      data: y,
                      reset: w
                    } = await h({
                      x: c,
                      y: d,
                      initialPlacement: o,
                      placement: f,
                      strategy: r,
                      middlewareData: p,
                      rects: l,
                      platform: a,
                      elements: {
                        reference: e,
                        floating: n
                      }
                    });
                    c = v ?? c, d = g ?? d, p = {
                      ...p,
                      [i]: {
                        ...p[i],
                        ...y
                      }
                    }, w && m <= 50 && (m++, "object" == typeof w && (w.placement && (f = w.placement), w.rects && (l = !0 === w.rects ? await a.getElementRects({
                      reference: e,
                      floating: n,
                      strategy: r
                    }) : w.rects), ({
                      x: c,
                      y: d
                    } = we(l, f, s))), t = -1)
                  }
                  return {
                    x: c,
                    y: d,
                    placement: f,
                    strategy: r,
                    middlewareData: p
                  }
                })(e, n, {
                  ...r,
                  platform: i
                })
              })(E.current, R.current, e).then((e => {
                const n = {
                  ...e,
                  isPositioned: !1 !== P.current
                };
                _.current && !En(O.current, n) && (O.current = n, a.flushSync((() => {
                  p(n)
                })))
              }))
            }), [m, n, t, D, P]);
            Mn((() => {
              !1 === d && O.current.isPositioned && (O.current.isPositioned = !1, p((e => ({
                ...e,
                isPositioned: !1
              }))))
            }), [d]);
            const _ = r.useRef(!1);
            Mn((() => (_.current = !0, () => {
              _.current = !1
            })), []), Mn((() => {
              if (x && (E.current = x), M && (R.current = M), x && M) {
                if (S.current) return S.current(x, M, L);
                L()
              }
            }), [x, M, L, S, I]);
            const k = r.useMemo((() => ({
                reference: E,
                floating: R,
                setReference: b,
                setFloating: C
              })), [b, C]),
              T = r.useMemo((() => ({
                reference: x,
                floating: M
              })), [x, M]),
              N = r.useMemo((() => {
                const e = {
                  position: t,
                  left: 0,
                  top: 0
                };
                if (!T.floating) return e;
                const n = On(T.floating, f.x),
                  o = On(T.floating, f.y);
                return l ? {
                  ...e,
                  transform: "translate(" + n + "px, " + o + "px)",
                  ...Rn(T.floating) >= 1.5 && {
                    willChange: "transform"
                  }
                } : {
                  position: t,
                  left: n,
                  top: o
                }
              }), [t, l, T.floating, f.x, f.y]);
            return r.useMemo((() => ({
              ...f,
              update: L,
              refs: k,
              elements: T,
              floatingStyles: N
            })), [f, L, k, T, N])
          }({
            strategy: "fixed",
            placement: j,
            whileElementsMounted: (...e) => function(e, n, t, o) {
              void 0 === o && (o = {});
              const {
                ancestorScroll: r = !0,
                ancestorResize: i = !0,
                elementResize: a = "function" == typeof ResizeObserver,
                layoutShift: u = "function" == typeof IntersectionObserver,
                animationFrame: s = !1
              } = o, l = Je(e), c = r || i ? [...l ? Xe(l) : [], ...Xe(n)] : [];
              c.forEach((e => {
                r && e.addEventListener("scroll", t, {
                  passive: !0
                }), i && e.addEventListener("resize", t)
              }));
              const d = l && u ? function(e, n) {
                let t, o = null;
                const r = Ie(e);

                function i() {
                  var e;
                  clearTimeout(t), null == (e = o) || e.disconnect(), o = null
                }
                return function a(u, s) {
                  void 0 === u && (u = !1), void 0 === s && (s = 1), i();
                  const l = e.getBoundingClientRect(),
                    {
                      left: c,
                      top: d,
                      width: f,
                      height: p
                    } = l;
                  if (u || n(), !f || !p) return;
                  const m = {
                    rootMargin: -J(d) + "px " + -J(r.clientWidth - (c + f)) + "px " + -J(r.clientHeight - (d + p)) + "px " + -J(c) + "px",
                    threshold: q(0, X(1, s)) || 1
                  };
                  let h = !0;

                  function v(n) {
                    const o = n[0].intersectionRatio;
                    if (o !== s) {
                      if (!h) return a();
                      o ? a(!1, o) : t = setTimeout((() => {
                        a(!1, 1e-7)
                      }), 1e3)
                    }
                    1 === o && !hn(l, e.getBoundingClientRect()) && a(), h = !1
                  }
                  try {
                    o = new IntersectionObserver(v, {
                      ...m,
                      root: r.ownerDocument
                    })
                  } catch {
                    o = new IntersectionObserver(v, m)
                  }
                  o.observe(e)
                }(!0), i
              }(l, t) : null;
              let f = -1,
                p = null;
              a && (p = new ResizeObserver((e => {
                let [o] = e;
                o && o.target === l && p && (p.unobserve(n), cancelAnimationFrame(f), f = requestAnimationFrame((() => {
                  var e;
                  null == (e = p) || e.observe(n)
                }))), t()
              })), l && !s && p.observe(l), p.observe(n));
              let m, h = s ? tn(e) : null;
              return s && function n() {
                const o = tn(e);
                h && !hn(h, o) && t(), h = o, m = requestAnimationFrame(n)
              }(), t(), () => {
                var e;
                c.forEach((e => {
                  r && e.removeEventListener("scroll", t), i && e.removeEventListener("resize", t)
                })), null == d || d(), null == (e = p) || e.disconnect(), p = null, s && cancelAnimationFrame(m)
              }
            }(...e, {
              animationFrame: "always" === O
            }),
            elements: {
              reference: D.anchor
            },
            middleware: [Dn({
              mainAxis: h + F,
              alignmentAxis: g
            }), w && Pn({
              mainAxis: !0,
              crossAxis: !1,
              limiter: "partial" === M ? Ln() : void 0,
              ...W
            }), w && _n({
              ...W
            }), kn({
              ...W,
              apply: ({
                elements: e,
                rects: n,
                availableWidth: t,
                availableHeight: o
              }) => {
                const {
                  width: r,
                  height: i
                } = n.reference, a = e.floating.style;
                a.setProperty("--radix-popper-available-width", `${t}px`), a.setProperty("--radix-popper-available-height", `${o}px`), a.setProperty("--radix-popper-anchor-width", `${r}px`), a.setProperty("--radix-popper-anchor-height", `${i}px`)
              }
            }), k && Nn({
              element: k,
              padding: y
            }), et({
              arrowWidth: A,
              arrowHeight: F
            }), E && Tn({
              strategy: "referenceHidden",
              ...W
            })]
          }), [Y, Z] = nt(U), Q = R(I);
          p((() => {
            $ && (null == Q || Q())
          }), [$, Q]);
          const ee = null == (t = z.arrow) ? void 0 : t.x,
            ne = null == (o = z.arrow) ? void 0 : o.y,
            te = 0 !== (null == (u = z.arrow) ? void 0 : u.centerOffset),
            [oe, re] = r.useState();
          return p((() => {
            P && re(window.getComputedStyle(P).zIndex)
          }), [P]), (0, i.jsx)("div", {
            ref: V.setFloating,
            "data-radix-popper-content-wrapper": "",
            style: {
              ...G,
              transform: $ ? G.transform : "translate(0, -200%)",
              minWidth: "max-content",
              zIndex: oe,
              "--radix-popper-transform-origin": [null == (s = z.transformOrigin) ? void 0 : s.x, null == (l = z.transformOrigin) ? void 0 : l.y].join(" "),
              ...(null == (d = z.hide) ? void 0 : d.referenceHidden) && {
                visibility: "hidden",
                pointerEvents: "none"
              }
            },
            dir: e.dir,
            children: (0, i.jsx)(zn, {
              scope: f,
              placedSide: Y,
              onArrowChange: T,
              arrowX: ee,
              arrowY: ne,
              shouldHideArrow: te,
              children: (0, i.jsx)(b.div, {
                "data-side": Y,
                "data-align": Z,
                ...S,
                ref: _,
                style: {
                  ...S.style,
                  animation: $ ? void 0 : "none"
                }
              })
            })
          })
        }));
      Xn.displayName = $n;
      var qn = "PopperArrow",
        Zn = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right"
        },
        Jn = r.forwardRef((function(e, n) {
          const {
            __scopePopper: t,
            ...o
          } = e, r = Yn(qn, t), a = Zn[r.placedSide];
          return (0, i.jsx)("span", {
            ref: r.onArrowChange,
            style: {
              position: "absolute",
              left: r.arrowX,
              top: r.arrowY,
              [a]: 0,
              transformOrigin: {
                top: "",
                right: "0 0",
                bottom: "center 0",
                left: "100% 0"
              } [r.placedSide],
              transform: {
                top: "translateY(100%)",
                right: "translateY(50%) rotate(90deg) translateX(-50%)",
                bottom: "rotate(180deg)",
                left: "translateY(50%) rotate(-90deg) translateX(50%)"
              } [r.placedSide],
              visibility: r.shouldHideArrow ? "hidden" : void 0
            },
            children: (0, i.jsx)(Fn, {
              ...o,
              ref: n,
              style: {
                ...o.style,
                display: "block"
              }
            })
          })
        }));

      function Qn(e) {
        return null !== e
      }
      Jn.displayName = qn;
      var et = e => ({
        name: "transformOrigin",
        options: e,
        fn(n) {
          var t, o, r;
          const {
            placement: i,
            rects: a,
            middlewareData: u
          } = n, s = 0 !== (null == (t = u.arrow) ? void 0 : t.centerOffset), l = s ? 0 : e.arrowWidth, c = s ? 0 : e.arrowHeight, [d, f] = nt(i), p = {
            start: "0%",
            center: "50%",
            end: "100%"
          } [f], m = ((null == (o = u.arrow) ? void 0 : o.x) ?? 0) + l / 2, h = ((null == (r = u.arrow) ? void 0 : r.y) ?? 0) + c / 2;
          let v = "",
            g = "";
          return "bottom" === d ? (v = s ? p : `${m}px`, g = -c + "px") : "top" === d ? (v = s ? p : `${m}px`, g = `${a.floating.height+c}px`) : "right" === d ? (v = -c + "px", g = s ? p : `${h}px`) : "left" === d && (v = `${a.floating.width+c}px`, g = s ? p : `${h}px`), {
            data: {
              x: v,
              y: g
            }
          }
        }
      });

      function nt(e) {
        const [n, t = "center"] = e.split("-");
        return [n, t]
      }
      var tt = Vn,
        ot = Un,
        rt = Xn,
        it = Jn,
        at = r.forwardRef(((e, n) => {
          var t;
          const {
            container: o,
            ...u
          } = e, [s, l] = r.useState(!1);
          p((() => l(!0)), []);
          const c = o || s && (null == (t = null == globalThis ? void 0 : globalThis.document) ? void 0 : t.body);
          return c ? a.createPortal((0, i.jsx)(b.div, {
            ...u,
            ref: n
          }), c) : null
        }));
      at.displayName = "Portal";
      var ut = e => {
        const {
          present: n,
          children: t
        } = e, o = function(e) {
          const [n, t] = r.useState(), o = r.useRef(null), i = r.useRef(e), a = r.useRef("none"), u = e ? "mounted" : "unmounted", [s, l] = function(e, n) {
            return r.useReducer(((e, t) => n[e][t] ?? e), e)
          }(u, {
            mounted: {
              UNMOUNT: "unmounted",
              ANIMATION_OUT: "unmountSuspended"
            },
            unmountSuspended: {
              MOUNT: "mounted",
              ANIMATION_END: "unmounted"
            },
            unmounted: {
              MOUNT: "mounted"
            }
          });
          return r.useEffect((() => {
            const e = st(o.current);
            a.current = "mounted" === s ? e : "none"
          }), [s]), p((() => {
            const n = o.current,
              t = i.current;
            if (t !== e) {
              const o = a.current,
                r = st(n);
              e ? l("MOUNT") : "none" === r || "none" === (null == n ? void 0 : n.display) ? l("UNMOUNT") : l(t && o !== r ? "ANIMATION_OUT" : "UNMOUNT"), i.current = e
            }
          }), [e, l]), p((() => {
            if (n) {
              let e;
              const t = n.ownerDocument.defaultView ?? window,
                r = r => {
                  const a = st(o.current).includes(r.animationName);
                  if (r.target === n && a && (l("ANIMATION_END"), !i.current)) {
                    const o = n.style.animationFillMode;
                    n.style.animationFillMode = "forwards", e = t.setTimeout((() => {
                      "forwards" === n.style.animationFillMode && (n.style.animationFillMode = o)
                    }))
                  }
                },
                u = e => {
                  e.target === n && (a.current = st(o.current))
                };
              return n.addEventListener("animationstart", u), n.addEventListener("animationcancel", r), n.addEventListener("animationend", r), () => {
                t.clearTimeout(e), n.removeEventListener("animationstart", u), n.removeEventListener("animationcancel", r), n.removeEventListener("animationend", r)
              }
            }
            l("ANIMATION_END")
          }), [n, l]), {
            isPresent: ["mounted", "unmountSuspended"].includes(s),
            ref: r.useCallback((e => {
              o.current = e ? getComputedStyle(e) : null, t(e)
            }), [])
          }
        }(n), i = "function" == typeof t ? t({
          present: o.isPresent
        }) : r.Children.only(t), a = c(o.ref, function(e) {
          var n, t;
          let o = null == (n = Object.getOwnPropertyDescriptor(e.props, "ref")) ? void 0 : n.get,
            r = o && "isReactWarning" in o && o.isReactWarning;
          return r ? e.ref : (o = null == (t = Object.getOwnPropertyDescriptor(e, "ref")) ? void 0 : t.get, r = o && "isReactWarning" in o && o.isReactWarning, r ? e.props.ref : e.props.ref || e.ref)
        }(i));
        return "function" == typeof t || o.isPresent ? r.cloneElement(i, {
          ref: a
        }) : null
      };

      function st(e) {
        return (null == e ? void 0 : e.animationName) || "none"
      }
      ut.displayName = "Presence";
      var lt = "rovingFocusGroup.onEntryFocus",
        ct = {
          bubbles: !1,
          cancelable: !0
        },
        dt = "RovingFocusGroup",
        [ft, pt, mt] = x(dt),
        [ht, vt] = d(dt, [mt]),
        [gt, yt] = ht(dt),
        wt = r.forwardRef(((e, n) => (0, i.jsx)(ft.Provider, {
          scope: e.__scopeRovingFocusGroup,
          children: (0, i.jsx)(ft.Slot, {
            scope: e.__scopeRovingFocusGroup,
            children: (0, i.jsx)(bt, {
              ...e,
              ref: n
            })
          })
        })));
      wt.displayName = dt;
      var bt = r.forwardRef(((e, n) => {
          const {
            __scopeRovingFocusGroup: t,
            orientation: o,
            loop: a = !1,
            dir: s,
            currentTabStopId: l,
            defaultCurrentTabStopId: d,
            onCurrentTabStopIdChange: f,
            onEntryFocus: p,
            preventScrollOnEntryFocus: m = !1,
            ...v
          } = e, g = r.useRef(null), y = c(n, g), w = E(s), [C, x] = h({
            prop: l,
            defaultProp: d ?? null,
            onChange: f,
            caller: dt
          }), [M, O] = r.useState(!1), I = R(p), S = pt(t), D = r.useRef(!1), [P, L] = r.useState(0);
          return r.useEffect((() => {
            const e = g.current;
            if (e) return e.addEventListener(lt, I), () => e.removeEventListener(lt, I)
          }), [I]), (0, i.jsx)(gt, {
            scope: t,
            orientation: o,
            dir: w,
            loop: a,
            currentTabStopId: C,
            onItemFocus: r.useCallback((e => x(e)), [x]),
            onItemShiftTab: r.useCallback((() => O(!0)), []),
            onFocusableItemAdd: r.useCallback((() => L((e => e + 1))), []),
            onFocusableItemRemove: r.useCallback((() => L((e => e - 1))), []),
            children: (0, i.jsx)(b.div, {
              tabIndex: M || 0 === P ? -1 : 0,
              "data-orientation": o,
              ...v,
              ref: y,
              style: {
                outline: "none",
                ...e.style
              },
              onMouseDown: u(e.onMouseDown, (() => {
                D.current = !0
              })),
              onFocus: u(e.onFocus, (e => {
                const n = !D.current;
                if (e.target === e.currentTarget && n && !M) {
                  const n = new CustomEvent(lt, ct);
                  if (e.currentTarget.dispatchEvent(n), !n.defaultPrevented) {
                    const e = S().filter((e => e.focusable));
                    Et([e.find((e => e.active)), e.find((e => e.id === C)), ...e].filter(Boolean).map((e => e.ref.current)), m)
                  }
                }
                D.current = !1
              })),
              onBlur: u(e.onBlur, (() => O(!1)))
            })
          })
        })),
        Ct = "RovingFocusGroupItem",
        xt = r.forwardRef(((e, n) => {
          const {
            __scopeRovingFocusGroup: t,
            focusable: o = !0,
            active: a = !1,
            tabStopId: s,
            children: l,
            ...c
          } = e, d = z(), f = s || d, p = yt(Ct, t), m = p.currentTabStopId === f, h = pt(t), {
            onFocusableItemAdd: v,
            onFocusableItemRemove: g,
            currentTabStopId: y
          } = p;
          return r.useEffect((() => {
            if (o) return v(), () => g()
          }), [o, v, g]), (0, i.jsx)(ft.ItemSlot, {
            scope: t,
            id: f,
            focusable: o,
            active: a,
            children: (0, i.jsx)(b.span, {
              tabIndex: m ? 0 : -1,
              "data-orientation": p.orientation,
              ...c,
              ref: n,
              onMouseDown: u(e.onMouseDown, (e => {
                o ? p.onItemFocus(f) : e.preventDefault()
              })),
              onFocus: u(e.onFocus, (() => p.onItemFocus(f))),
              onKeyDown: u(e.onKeyDown, (e => {
                if ("Tab" === e.key && e.shiftKey) return void p.onItemShiftTab();
                if (e.target !== e.currentTarget) return;
                const n = function(e, n, t) {
                  const o = function(e, n) {
                    return "rtl" !== n ? e : "ArrowLeft" === e ? "ArrowRight" : "ArrowRight" === e ? "ArrowLeft" : e
                  }(e.key, t);
                  if (!("vertical" === n && ["ArrowLeft", "ArrowRight"].includes(o) || "horizontal" === n && ["ArrowUp", "ArrowDown"].includes(o))) return Mt[o]
                }(e, p.orientation, p.dir);
                if (void 0 !== n) {
                  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
                  e.preventDefault();
                  let t = h().filter((e => e.focusable)).map((e => e.ref.current));
                  if ("last" === n) t.reverse();
                  else if ("prev" === n || "next" === n) {
                    "prev" === n && t.reverse();
                    const o = t.indexOf(e.currentTarget);
                    t = p.loop ? function(e, n) {
                      return e.map(((t, o) => e[(n + o) % e.length]))
                    }(t, o + 1) : t.slice(o + 1)
                  }
                  setTimeout((() => Et(t)))
                }
              })),
              children: "function" == typeof l ? l({
                isCurrentTabStop: m,
                hasTabStop: null != y
              }) : l
            })
          })
        }));
      xt.displayName = Ct;
      var Mt = {
        ArrowLeft: "prev",
        ArrowUp: "prev",
        ArrowRight: "next",
        ArrowDown: "next",
        PageUp: "first",
        Home: "first",
        PageDown: "last",
        End: "last"
      };

      function Et(e, n = !1) {
        const t = document.activeElement;
        for (const o of e)
          if (o === t || (o.focus({
              preventScroll: n
            }), document.activeElement !== t)) return
      }
      var Rt = wt,
        Ot = xt,
        It = new WeakMap,
        St = new WeakMap,
        Dt = {},
        Pt = 0,
        Lt = function(e) {
          return e && (e.host || Lt(e.parentNode))
        },
        _t = function(e, n, t) {
          void 0 === t && (t = "data-aria-hidden");
          var o = Array.from(Array.isArray(e) ? e : [e]),
            r = function(e) {
              return typeof document > "u" ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body
            }(e);
          return r ? (o.push.apply(o, Array.from(r.querySelectorAll("[aria-live], script"))), function(e, n, t, o) {
            var r = function(e, n) {
              return n.map((function(n) {
                if (e.contains(n)) return n;
                var t = Lt(n);
                return t && e.contains(t) ? t : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null)
              })).filter((function(e) {
                return !!e
              }))
            }(n, Array.isArray(e) ? e : [e]);
            Dt[t] || (Dt[t] = new WeakMap);
            var i = Dt[t],
              a = [],
              u = new Set,
              s = new Set(r),
              l = function(e) {
                !e || u.has(e) || (u.add(e), l(e.parentNode))
              };
            r.forEach(l);
            var c = function(e) {
              !e || s.has(e) || Array.prototype.forEach.call(e.children, (function(e) {
                if (u.has(e)) c(e);
                else try {
                  var n = e.getAttribute(o),
                    r = null !== n && "false" !== n,
                    s = (It.get(e) || 0) + 1,
                    l = (i.get(e) || 0) + 1;
                  It.set(e, s), i.set(e, l), a.push(e), 1 === s && r && St.set(e, !0), 1 === l && e.setAttribute(t, "true"), r || e.setAttribute(o, "true")
                } catch (n) {
                  console.error("aria-hidden: cannot operate on ", e, n)
                }
              }))
            };
            return c(n), u.clear(), Pt++,
              function() {
                a.forEach((function(e) {
                  var n = It.get(e) - 1,
                    r = i.get(e) - 1;
                  It.set(e, n), i.set(e, r), n || (St.has(e) || e.removeAttribute(o), St.delete(e)), r || e.removeAttribute(t)
                })), --Pt || (It = new WeakMap, It = new WeakMap, St = new WeakMap, Dt = {})
              }
          }(o, r, t, "aria-hidden")) : function() {
            return null
          }
        },
        kt = function() {
          return kt = Object.assign || function(e) {
            for (var n, t = 1, o = arguments.length; t < o; t++)
              for (var r in n = arguments[t]) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
            return e
          }, kt.apply(this, arguments)
        };

      function Tt(e, n) {
        var t = {};
        for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && n.indexOf(o) < 0 && (t[o] = e[o]);
        if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
          var r = 0;
          for (o = Object.getOwnPropertySymbols(e); r < o.length; r++) n.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r]) && (t[o[r]] = e[o[r]])
        }
        return t
      }
      var Nt = "right-scroll-bar-position",
        At = "width-before-scroll-bar";

      function Ft(e, n) {
        return "function" == typeof e ? e(n) : e && (e.current = n), e
      }
      var jt = typeof window < "u" ? r.useLayoutEffect : r.useEffect,
        Kt = new WeakMap;

      function Bt(e) {
        return e
      }
      var Ht = function(e) {
        var n = e.sideCar,
          t = Tt(e, ["sideCar"]);
        if (!n) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
        var o = n.read();
        if (!o) throw new Error("Sidecar medium not found");
        return r.createElement(o, kt({}, t))
      };
      Ht.isSideCarExport = !0;
      var Wt = function(e) {
          void 0 === e && (e = {});
          var n = function(e, n) {
            void 0 === n && (n = Bt);
            var t = [],
              o = !1;
            return {
              read: function() {
                if (o) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
                return t.length ? t[t.length - 1] : null
              },
              useMedium: function(e) {
                var r = n(e, o);
                return t.push(r),
                  function() {
                    t = t.filter((function(e) {
                      return e !== r
                    }))
                  }
              },
              assignSyncMedium: function(e) {
                for (o = !0; t.length;) {
                  var n = t;
                  t = [], n.forEach(e)
                }
                t = {
                  push: function(n) {
                    return e(n)
                  },
                  filter: function() {
                    return t
                  }
                }
              },
              assignMedium: function(e) {
                o = !0;
                var n = [];
                if (t.length) {
                  var r = t;
                  t = [], r.forEach(e), n = t
                }
                var i = function() {
                    var t = n;
                    n = [], t.forEach(e)
                  },
                  a = function() {
                    return Promise.resolve().then(i)
                  };
                a(), t = {
                  push: function(e) {
                    n.push(e), a()
                  },
                  filter: function(e) {
                    return n = n.filter(e), t
                  }
                }
              }
            }
          }();
          return n.options = kt({
            async: !0,
            ssr: !1
          }, e), n
        }(),
        Vt = function() {},
        Gt = r.forwardRef((function(e, n) {
          var t = r.useRef(null),
            o = r.useState({
              onScrollCapture: Vt,
              onWheelCapture: Vt,
              onTouchMoveCapture: Vt
            }),
            i = o[0],
            a = o[1],
            u = e.forwardProps,
            s = e.children,
            l = e.className,
            c = e.removeScrollBar,
            d = e.enabled,
            f = e.shards,
            p = e.sideCar,
            m = e.noRelative,
            h = e.noIsolation,
            v = e.inert,
            g = e.allowPinchZoom,
            y = e.as,
            w = void 0 === y ? "div" : y,
            b = e.gapMode,
            C = Tt(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]),
            x = p,
            M = function(e, n) {
              var t = function(e, n) {
                var t = (0, r.useState)((function() {
                  return {
                    value: null,
                    callback: n,
                    facade: {
                      get current() {
                        return t.value
                      },
                      set current(e) {
                        var n = t.value;
                        n !== e && (t.value = e, t.callback(e, n))
                      }
                    }
                  }
                }))[0];
                return t.callback = n, t.facade
              }(0, (function(n) {
                return e.forEach((function(e) {
                  return Ft(e, n)
                }))
              }));
              return jt((function() {
                var n = Kt.get(t);
                if (n) {
                  var o = new Set(n),
                    r = new Set(e),
                    i = t.current;
                  o.forEach((function(e) {
                    r.has(e) || Ft(e, null)
                  })), r.forEach((function(e) {
                    o.has(e) || Ft(e, i)
                  }))
                }
                Kt.set(t, e)
              }), [e]), t
            }([t, n]),
            E = kt(kt({}, C), i);
          return r.createElement(r.Fragment, null, d && r.createElement(x, {
            sideCar: Wt,
            removeScrollBar: c,
            shards: f,
            noRelative: m,
            noIsolation: h,
            inert: v,
            setCallbacks: a,
            allowPinchZoom: !!g,
            lockRef: t,
            gapMode: b
          }), u ? r.cloneElement(r.Children.only(s), kt(kt({}, E), {
            ref: M
          })) : r.createElement(w, kt({}, E, {
            className: l,
            ref: M
          }), s))
        }));
      Gt.defaultProps = {
        enabled: !0,
        removeScrollBar: !0,
        inert: !1
      }, Gt.classNames = {
        fullWidth: At,
        zeroRight: Nt
      };
      var Ut = function() {
          var e = 0,
            n = null;
          return {
            add: function(o) {
              0 == e && (n = function() {
                if (!document) return null;
                var e = document.createElement("style");
                e.type = "text/css";
                var n = t.nc;
                return n && e.setAttribute("nonce", n), e
              }()) && (function(e, n) {
                e.styleSheet ? e.styleSheet.cssText = n : e.appendChild(document.createTextNode(n))
              }(n, o), function(e) {
                (document.head || document.getElementsByTagName("head")[0]).appendChild(e)
              }(n)), e++
            },
            remove: function() {
              !--e && n && (n.parentNode && n.parentNode.removeChild(n), n = null)
            }
          }
        },
        $t = function() {
          var e = function() {
            var e = Ut();
            return function(n, t) {
              r.useEffect((function() {
                return e.add(n),
                  function() {
                    e.remove()
                  }
              }), [n && t])
            }
          }();
          return function(n) {
            var t = n.styles,
              o = n.dynamic;
            return e(t, o), null
          }
        },
        zt = {
          left: 0,
          top: 0,
          right: 0,
          gap: 0
        },
        Yt = function(e) {
          return parseInt(e || "", 10) || 0
        },
        Xt = $t(),
        qt = "data-scroll-locked",
        Zt = function(e, n, t, o) {
          var r = e.left,
            i = e.top,
            a = e.right,
            u = e.gap;
          return void 0 === t && (t = "margin"), "\n  .".concat("with-scroll-bars-hidden", " {\n   overflow: hidden ").concat(o, ";\n   padding-right: ").concat(u, "px ").concat(o, ";\n  }\n  body[").concat(qt, "] {\n    overflow: hidden ").concat(o, ";\n    overscroll-behavior: contain;\n    ").concat([n && "position: relative ".concat(o, ";"), "margin" === t && "\n    padding-left: ".concat(r, "px;\n    padding-top: ").concat(i, "px;\n    padding-right: ").concat(a, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(u, "px ").concat(o, ";\n    "), "padding" === t && "padding-right: ".concat(u, "px ").concat(o, ";")].filter(Boolean).join(""), "\n  }\n  \n  .").concat(Nt, " {\n    right: ").concat(u, "px ").concat(o, ";\n  }\n  \n  .").concat(At, " {\n    margin-right: ").concat(u, "px ").concat(o, ";\n  }\n  \n  .").concat(Nt, " .").concat(Nt, " {\n    right: 0 ").concat(o, ";\n  }\n  \n  .").concat(At, " .").concat(At, " {\n    margin-right: 0 ").concat(o, ";\n  }\n  \n  body[").concat(qt, "] {\n    ").concat("--removed-body-scroll-bar-size", ": ").concat(u, "px;\n  }\n")
        },
        Jt = function() {
          var e = parseInt(document.body.getAttribute(qt) || "0", 10);
          return isFinite(e) ? e : 0
        },
        Qt = function(e) {
          var n = e.noRelative,
            t = e.noImportant,
            o = e.gapMode,
            i = void 0 === o ? "margin" : o;
          r.useEffect((function() {
            return document.body.setAttribute(qt, (Jt() + 1).toString()),
              function() {
                var e = Jt() - 1;
                e <= 0 ? document.body.removeAttribute(qt) : document.body.setAttribute(qt, e.toString())
              }
          }), []);
          var a = r.useMemo((function() {
            return function(e) {
              if (void 0 === e && (e = "margin"), typeof window > "u") return zt;
              var n = function(e) {
                  var n = window.getComputedStyle(document.body),
                    t = n["padding" === e ? "paddingLeft" : "marginLeft"],
                    o = n["padding" === e ? "paddingTop" : "marginTop"],
                    r = n["padding" === e ? "paddingRight" : "marginRight"];
                  return [Yt(t), Yt(o), Yt(r)]
                }(e),
                t = document.documentElement.clientWidth,
                o = window.innerWidth;
              return {
                left: n[0],
                top: n[1],
                right: n[2],
                gap: Math.max(0, o - t + n[2] - n[0])
              }
            }(i)
          }), [i]);
          return r.createElement(Xt, {
            styles: Zt(a, !n, i, t ? "" : "!important")
          })
        },
        eo = !1;
      if (typeof window < "u") try {
        var no = Object.defineProperty({}, "passive", {
          get: function() {
            return eo = !0, !0
          }
        });
        window.addEventListener("test", no, no), window.removeEventListener("test", no, no)
      } catch {
        eo = !1
      }
      var to = !!eo && {
          passive: !1
        },
        oo = function(e, n) {
          if (!(e instanceof Element)) return !1;
          var t = window.getComputedStyle(e);
          return "hidden" !== t[n] && !(t.overflowY === t.overflowX && ! function(e) {
            return "TEXTAREA" === e.tagName
          }(e) && "visible" === t[n])
        },
        ro = function(e, n) {
          var t = n.ownerDocument,
            o = n;
          do {
            if (typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host), io(e, o)) {
              var r = ao(e, o);
              if (r[1] > r[2]) return !0
            }
            o = o.parentNode
          } while (o && o !== t.body);
          return !1
        },
        io = function(e, n) {
          return "v" === e ? function(e) {
            return oo(e, "overflowY")
          }(n) : function(e) {
            return oo(e, "overflowX")
          }(n)
        },
        ao = function(e, n) {
          return "v" === e ? function(e) {
            return [e.scrollTop, e.scrollHeight, e.clientHeight]
          }(n) : function(e) {
            return [e.scrollLeft, e.scrollWidth, e.clientWidth]
          }(n)
        },
        uo = function(e) {
          return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0]
        },
        so = function(e) {
          return [e.deltaX, e.deltaY]
        },
        lo = function(e) {
          return e && "current" in e ? e.current : e
        },
        co = function(e) {
          return "\n  .block-interactivity-".concat(e, " {pointer-events: none;}\n  .allow-interactivity-").concat(e, " {pointer-events: all;}\n")
        },
        fo = 0,
        po = [];

      function mo(e) {
        for (var n = null; null !== e;) e instanceof ShadowRoot && (n = e.host, e = e.host), e = e.parentNode;
        return n
      }
      const ho = (vo = function(e) {
        var n = r.useRef([]),
          t = r.useRef([0, 0]),
          o = r.useRef(),
          i = r.useState(fo++)[0],
          a = r.useState($t)[0],
          u = r.useRef(e);
        r.useEffect((function() {
          u.current = e
        }), [e]), r.useEffect((function() {
          if (e.inert) {
            document.body.classList.add("block-interactivity-".concat(i));
            var n = function(e, n, t) {
              if (t || 2 === arguments.length)
                for (var o, r = 0, i = n.length; r < i; r++)(o || !(r in n)) && (o || (o = Array.prototype.slice.call(n, 0, r)), o[r] = n[r]);
              return e.concat(o || Array.prototype.slice.call(n))
            }([e.lockRef.current], (e.shards || []).map(lo), !0).filter(Boolean);
            return n.forEach((function(e) {
                return e.classList.add("allow-interactivity-".concat(i))
              })),
              function() {
                document.body.classList.remove("block-interactivity-".concat(i)), n.forEach((function(e) {
                  return e.classList.remove("allow-interactivity-".concat(i))
                }))
              }
          }
        }), [e.inert, e.lockRef.current, e.shards]);
        var s = r.useCallback((function(e, n) {
            if ("touches" in e && 2 === e.touches.length || "wheel" === e.type && e.ctrlKey) return !u.current.allowPinchZoom;
            var r, i = uo(e),
              a = t.current,
              s = "deltaX" in e ? e.deltaX : a[0] - i[0],
              l = "deltaY" in e ? e.deltaY : a[1] - i[1],
              c = e.target,
              d = Math.abs(s) > Math.abs(l) ? "h" : "v";
            if ("touches" in e && "h" === d && "range" === c.type) return !1;
            var f = ro(d, c);
            if (!f) return !0;
            if (f ? r = d : (r = "v" === d ? "h" : "v", f = ro(d, c)), !f) return !1;
            if (!o.current && "changedTouches" in e && (s || l) && (o.current = r), !r) return !0;
            var p = o.current || r;
            return function(e, n, t, o, r) {
              var i = function(e, n) {
                  return "h" === e && "rtl" === n ? -1 : 1
                }(e, window.getComputedStyle(n).direction),
                a = i * o,
                u = t.target,
                s = n.contains(u),
                l = !1,
                c = a > 0,
                d = 0,
                f = 0;
              do {
                if (!u) break;
                var p = ao(e, u),
                  m = p[0],
                  h = p[1] - p[2] - i * m;
                (m || h) && io(e, u) && (d += h, f += m);
                var v = u.parentNode;
                u = v && v.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? v.host : v
              } while (!s && u !== document.body || s && (n.contains(u) || n === u));
              return (c && Math.abs(d) < 1 || !c && Math.abs(f) < 1) && (l = !0), l
            }(p, n, e, "h" === p ? s : l)
          }), []),
          l = r.useCallback((function(e) {
            var t = e;
            if (po.length && po[po.length - 1] === a) {
              var o = "deltaY" in t ? so(t) : uo(t),
                r = n.current.filter((function(e) {
                  return e.name === t.type && (e.target === t.target || t.target === e.shadowParent) && function(e, n) {
                    return e[0] === n[0] && e[1] === n[1]
                  }(e.delta, o)
                }))[0];
              if (r && r.should) return void(t.cancelable && t.preventDefault());
              if (!r) {
                var i = (u.current.shards || []).map(lo).filter(Boolean).filter((function(e) {
                  return e.contains(t.target)
                }));
                (i.length > 0 ? s(t, i[0]) : !u.current.noIsolation) && t.cancelable && t.preventDefault()
              }
            }
          }), []),
          c = r.useCallback((function(e, t, o, r) {
            var i = {
              name: e,
              delta: t,
              target: o,
              should: r,
              shadowParent: mo(o)
            };
            n.current.push(i), setTimeout((function() {
              n.current = n.current.filter((function(e) {
                return e !== i
              }))
            }), 1)
          }), []),
          d = r.useCallback((function(e) {
            t.current = uo(e), o.current = void 0
          }), []),
          f = r.useCallback((function(n) {
            c(n.type, so(n), n.target, s(n, e.lockRef.current))
          }), []),
          p = r.useCallback((function(n) {
            c(n.type, uo(n), n.target, s(n, e.lockRef.current))
          }), []);
        r.useEffect((function() {
          return po.push(a), e.setCallbacks({
              onScrollCapture: f,
              onWheelCapture: f,
              onTouchMoveCapture: p
            }), document.addEventListener("wheel", l, to), document.addEventListener("touchmove", l, to), document.addEventListener("touchstart", d, to),
            function() {
              po = po.filter((function(e) {
                return e !== a
              })), document.removeEventListener("wheel", l, to), document.removeEventListener("touchmove", l, to), document.removeEventListener("touchstart", d, to)
            }
        }), []);
        var m = e.removeScrollBar,
          h = e.inert;
        return r.createElement(r.Fragment, null, h ? r.createElement(a, {
          styles: co(i)
        }) : null, m ? r.createElement(Qt, {
          noRelative: e.noRelative,
          gapMode: e.gapMode
        }) : null)
      }, Wt.useMedium(vo), Ht);
      var vo, go = r.forwardRef((function(e, n) {
        return r.createElement(Gt, kt({}, e, {
          ref: n,
          sideCar: ho
        }))
      }));
      go.classNames = Gt.classNames;
      var yo = ["Enter", " "],
        wo = ["ArrowUp", "PageDown", "End"],
        bo = ["ArrowDown", "PageUp", "Home", ...wo],
        Co = {
          ltr: [...yo, "ArrowRight"],
          rtl: [...yo, "ArrowLeft"]
        },
        xo = {
          ltr: ["ArrowLeft"],
          rtl: ["ArrowRight"]
        },
        Mo = "Menu",
        [Eo, Ro, Oo] = x(Mo),
        [Io, So] = d(Mo, [Oo, Bn, vt]),
        Do = Bn(),
        Po = vt(),
        [Lo, _o] = Io(Mo),
        [ko, To] = Io(Mo),
        No = e => {
          const {
            __scopeMenu: n,
            open: t = !1,
            children: o,
            dir: a,
            onOpenChange: u,
            modal: s = !0
          } = e, l = Do(n), [c, d] = r.useState(null), f = r.useRef(!1), p = R(u), m = E(a);
          return r.useEffect((() => {
            const e = () => {
                f.current = !0, document.addEventListener("pointerdown", n, {
                  capture: !0,
                  once: !0
                }), document.addEventListener("pointermove", n, {
                  capture: !0,
                  once: !0
                })
              },
              n = () => f.current = !1;
            return document.addEventListener("keydown", e, {
              capture: !0
            }), () => {
              document.removeEventListener("keydown", e, {
                capture: !0
              }), document.removeEventListener("pointerdown", n, {
                capture: !0
              }), document.removeEventListener("pointermove", n, {
                capture: !0
              })
            }
          }), []), (0, i.jsx)(tt, {
            ...l,
            children: (0, i.jsx)(Lo, {
              scope: n,
              open: t,
              onOpenChange: p,
              content: c,
              onContentChange: d,
              children: (0, i.jsx)(ko, {
                scope: n,
                onClose: r.useCallback((() => p(!1)), [p]),
                isUsingKeyboardRef: f,
                dir: m,
                modal: s,
                children: o
              })
            })
          })
        };
      No.displayName = Mo;
      var Ao = r.forwardRef(((e, n) => {
        const {
          __scopeMenu: t,
          ...o
        } = e, r = Do(t);
        return (0, i.jsx)(ot, {
          ...r,
          ...o,
          ref: n
        })
      }));
      Ao.displayName = "MenuAnchor";
      var Fo = "MenuPortal",
        [jo, Ko] = Io(Fo, {
          forceMount: void 0
        }),
        Bo = e => {
          const {
            __scopeMenu: n,
            forceMount: t,
            children: o,
            container: r
          } = e, a = _o(Fo, n);
          return (0, i.jsx)(jo, {
            scope: n,
            forceMount: t,
            children: (0, i.jsx)(ut, {
              present: t || a.open,
              children: (0, i.jsx)(at, {
                asChild: !0,
                container: r,
                children: o
              })
            })
          })
        };
      Bo.displayName = Fo;
      var Ho = "MenuContent",
        [Wo, Vo] = Io(Ho),
        Go = r.forwardRef(((e, n) => {
          const t = Ko(Ho, e.__scopeMenu),
            {
              forceMount: o = t.forceMount,
              ...r
            } = e,
            a = _o(Ho, e.__scopeMenu),
            u = To(Ho, e.__scopeMenu);
          return (0, i.jsx)(Eo.Provider, {
            scope: e.__scopeMenu,
            children: (0, i.jsx)(ut, {
              present: o || a.open,
              children: (0, i.jsx)(Eo.Slot, {
                scope: e.__scopeMenu,
                children: u.modal ? (0, i.jsx)(Uo, {
                  ...r,
                  ref: n
                }) : (0, i.jsx)($o, {
                  ...r,
                  ref: n
                })
              })
            })
          })
        })),
        Uo = r.forwardRef(((e, n) => {
          const t = _o(Ho, e.__scopeMenu),
            o = r.useRef(null),
            a = c(n, o);
          return r.useEffect((() => {
            const e = o.current;
            if (e) return _t(e)
          }), []), (0, i.jsx)(Yo, {
            ...e,
            ref: a,
            trapFocus: t.open,
            disableOutsidePointerEvents: t.open,
            disableOutsideScroll: !0,
            onFocusOutside: u(e.onFocusOutside, (e => e.preventDefault()), {
              checkForDefaultPrevented: !1
            }),
            onDismiss: () => t.onOpenChange(!1)
          })
        })),
        $o = r.forwardRef(((e, n) => {
          const t = _o(Ho, e.__scopeMenu);
          return (0, i.jsx)(Yo, {
            ...e,
            ref: n,
            trapFocus: !1,
            disableOutsidePointerEvents: !1,
            disableOutsideScroll: !1,
            onDismiss: () => t.onOpenChange(!1)
          })
        })),
        zo = v("MenuContent.ScrollLock"),
        Yo = r.forwardRef(((e, n) => {
          const {
            __scopeMenu: t,
            loop: o = !1,
            trapFocus: a,
            onOpenAutoFocus: s,
            onCloseAutoFocus: l,
            disableOutsidePointerEvents: d,
            onEntryFocus: f,
            onEscapeKeyDown: p,
            onPointerDownOutside: m,
            onFocusOutside: h,
            onInteractOutside: v,
            onDismiss: g,
            disableOutsideScroll: y,
            ...w
          } = e, b = _o(Ho, t), C = To(Ho, t), x = Do(t), M = Po(t), E = Ro(t), [R, O] = r.useState(null), I = r.useRef(null), S = c(n, I, b.onContentChange), P = r.useRef(0), L = r.useRef(""), _ = r.useRef(0), N = r.useRef(null), A = r.useRef("right"), F = r.useRef(0), K = y ? go : r.Fragment, B = y ? {
            as: zo,
            allowPinchZoom: !0
          } : void 0;
          r.useEffect((() => () => window.clearTimeout(P.current)), []), r.useEffect((() => {
            const e = document.querySelectorAll("[data-radix-focus-guard]");
            return document.body.insertAdjacentElement("afterbegin", e[0] ?? T()), document.body.insertAdjacentElement("beforeend", e[1] ?? T()), k++, () => {
              1 === k && document.querySelectorAll("[data-radix-focus-guard]").forEach((e => e.remove())), k--
            }
          }), []);
          const H = r.useCallback((e => {
            var n, t;
            return A.current === (null == (n = N.current) ? void 0 : n.side) && function(e, n) {
              if (!n) return !1;
              return function(e, n) {
                const {
                  x: t,
                  y: o
                } = e;
                let r = !1;
                for (let e = 0, i = n.length - 1; e < n.length; i = e++) {
                  const a = n[e],
                    u = n[i],
                    s = a.x,
                    l = a.y,
                    c = u.x,
                    d = u.y;
                  l > o != d > o && t < (c - s) * (o - l) / (d - l) + s && (r = !r)
                }
                return r
              }({
                x: e.clientX,
                y: e.clientY
              }, n)
            }(e, null == (t = N.current) ? void 0 : t.area)
          }), []);
          return (0, i.jsx)(Wo, {
            scope: t,
            searchRef: L,
            onItemEnter: r.useCallback((e => {
              H(e) && e.preventDefault()
            }), [H]),
            onItemLeave: r.useCallback((e => {
              var n;
              H(e) || (null == (n = I.current) || n.focus(), O(null))
            }), [H]),
            onTriggerLeave: r.useCallback((e => {
              H(e) && e.preventDefault()
            }), [H]),
            pointerGraceTimerRef: _,
            onPointerGraceIntentChange: r.useCallback((e => {
              N.current = e
            }), []),
            children: (0, i.jsx)(K, {
              ...B,
              children: (0, i.jsx)(j, {
                asChild: !0,
                trapped: a,
                onMountAutoFocus: u(s, (e => {
                  var n;
                  e.preventDefault(), null == (n = I.current) || n.focus({
                    preventScroll: !0
                  })
                })),
                onUnmountAutoFocus: l,
                children: (0, i.jsx)(D, {
                  asChild: !0,
                  disableOutsidePointerEvents: d,
                  onEscapeKeyDown: p,
                  onPointerDownOutside: m,
                  onFocusOutside: h,
                  onInteractOutside: v,
                  onDismiss: g,
                  children: (0, i.jsx)(Rt, {
                    asChild: !0,
                    ...M,
                    dir: C.dir,
                    orientation: "vertical",
                    loop: o,
                    currentTabStopId: R,
                    onCurrentTabStopIdChange: O,
                    onEntryFocus: u(f, (e => {
                      C.isUsingKeyboardRef.current || e.preventDefault()
                    })),
                    preventScrollOnEntryFocus: !0,
                    children: (0, i.jsx)(rt, {
                      role: "menu",
                      "aria-orientation": "vertical",
                      "data-state": xr(b.open),
                      "data-radix-menu-content": "",
                      dir: C.dir,
                      ...x,
                      ...w,
                      ref: S,
                      style: {
                        outline: "none",
                        ...w.style
                      },
                      onKeyDown: u(w.onKeyDown, (e => {
                        const n = e.target.closest("[data-radix-menu-content]") === e.currentTarget,
                          t = e.ctrlKey || e.altKey || e.metaKey,
                          o = 1 === e.key.length;
                        n && ("Tab" === e.key && e.preventDefault(), !t && o && (e => {
                          var n, t;
                          const o = L.current + e,
                            r = E().filter((e => !e.disabled)),
                            i = document.activeElement,
                            a = null == (n = r.find((e => e.ref.current === i))) ? void 0 : n.textValue,
                            u = function(e, n, t) {
                              const o = n.length > 1 && Array.from(n).every((e => e === n[0])) ? n[0] : n,
                                r = t ? e.indexOf(t) : -1;
                              let i = function(e, n) {
                                return e.map(((t, o) => e[(n + o) % e.length]))
                              }(e, Math.max(r, 0));
                              1 === o.length && (i = i.filter((e => e !== t)));
                              const a = i.find((e => e.toLowerCase().startsWith(o.toLowerCase())));
                              return a !== t ? a : void 0
                            }(r.map((e => e.textValue)), o, a),
                            s = null == (t = r.find((e => e.textValue === u))) ? void 0 : t.ref.current;
                          (function e(n) {
                            L.current = n, window.clearTimeout(P.current), "" !== n && (P.current = window.setTimeout((() => e("")), 1e3))
                          })(o), s && setTimeout((() => s.focus()))
                        })(e.key));
                        const r = I.current;
                        if (e.target !== r || !bo.includes(e.key)) return;
                        e.preventDefault();
                        const i = E().filter((e => !e.disabled)).map((e => e.ref.current));
                        wo.includes(e.key) && i.reverse(),
                          function(e) {
                            const n = document.activeElement;
                            for (const t of e)
                              if (t === n || (t.focus(), document.activeElement !== n)) return
                          }(i)
                      })),
                      onBlur: u(e.onBlur, (e => {
                        e.currentTarget.contains(e.target) || (window.clearTimeout(P.current), L.current = "")
                      })),
                      onPointerMove: u(e.onPointerMove, Rr((e => {
                        const n = e.target,
                          t = F.current !== e.clientX;
                        if (e.currentTarget.contains(n) && t) {
                          const n = e.clientX > F.current ? "right" : "left";
                          A.current = n, F.current = e.clientX
                        }
                      })))
                    })
                  })
                })
              })
            })
          })
        }));
      Go.displayName = Ho;
      var Xo = r.forwardRef(((e, n) => {
        const {
          __scopeMenu: t,
          ...o
        } = e;
        return (0, i.jsx)(b.div, {
          role: "group",
          ...o,
          ref: n
        })
      }));
      Xo.displayName = "MenuGroup";
      var qo = r.forwardRef(((e, n) => {
        const {
          __scopeMenu: t,
          ...o
        } = e;
        return (0, i.jsx)(b.div, {
          ...o,
          ref: n
        })
      }));
      qo.displayName = "MenuLabel";
      var Zo = "MenuItem",
        Jo = "menu.itemSelect",
        Qo = r.forwardRef(((e, n) => {
          const {
            disabled: t = !1,
            onSelect: o,
            ...a
          } = e, s = r.useRef(null), l = To(Zo, e.__scopeMenu), d = Vo(Zo, e.__scopeMenu), f = c(n, s), p = r.useRef(!1);
          return (0, i.jsx)(er, {
            ...a,
            ref: f,
            disabled: t,
            onClick: u(e.onClick, (() => {
              const e = s.current;
              if (!t && e) {
                const n = new CustomEvent(Jo, {
                  bubbles: !0,
                  cancelable: !0
                });
                e.addEventListener(Jo, (e => null == o ? void 0 : o(e)), {
                  once: !0
                }), C(e, n), n.defaultPrevented ? p.current = !1 : l.onClose()
              }
            })),
            onPointerDown: n => {
              var t;
              null == (t = e.onPointerDown) || t.call(e, n), p.current = !0
            },
            onPointerUp: u(e.onPointerUp, (e => {
              var n;
              p.current || null == (n = e.currentTarget) || n.click()
            })),
            onKeyDown: u(e.onKeyDown, (e => {
              const n = "" !== d.searchRef.current;
              t || n && " " === e.key || yo.includes(e.key) && (e.currentTarget.click(), e.preventDefault())
            }))
          })
        }));
      Qo.displayName = Zo;
      var er = r.forwardRef(((e, n) => {
          const {
            __scopeMenu: t,
            disabled: o = !1,
            textValue: a,
            ...s
          } = e, l = Vo(Zo, t), d = Po(t), f = r.useRef(null), p = c(n, f), [m, h] = r.useState(!1), [v, g] = r.useState("");
          return r.useEffect((() => {
            const e = f.current;
            e && g((e.textContent ?? "").trim())
          }), [s.children]), (0, i.jsx)(Eo.ItemSlot, {
            scope: t,
            disabled: o,
            textValue: a ?? v,
            children: (0, i.jsx)(Ot, {
              asChild: !0,
              ...d,
              focusable: !o,
              children: (0, i.jsx)(b.div, {
                role: "menuitem",
                "data-highlighted": m ? "" : void 0,
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
                ...s,
                ref: p,
                onPointerMove: u(e.onPointerMove, Rr((e => {
                  o ? l.onItemLeave(e) : (l.onItemEnter(e), e.defaultPrevented || e.currentTarget.focus({
                    preventScroll: !0
                  }))
                }))),
                onPointerLeave: u(e.onPointerLeave, Rr((e => l.onItemLeave(e)))),
                onFocus: u(e.onFocus, (() => h(!0))),
                onBlur: u(e.onBlur, (() => h(!1)))
              })
            })
          })
        })),
        nr = r.forwardRef(((e, n) => {
          const {
            checked: t = !1,
            onCheckedChange: o,
            ...r
          } = e;
          return (0, i.jsx)(lr, {
            scope: e.__scopeMenu,
            checked: t,
            children: (0, i.jsx)(Qo, {
              role: "menuitemcheckbox",
              "aria-checked": Mr(t) ? "mixed" : t,
              ...r,
              ref: n,
              "data-state": Er(t),
              onSelect: u(r.onSelect, (() => null == o ? void 0 : o(!!Mr(t) || !t)), {
                checkForDefaultPrevented: !1
              })
            })
          })
        }));
      nr.displayName = "MenuCheckboxItem";
      var tr = "MenuRadioGroup",
        [or, rr] = Io(tr, {
          value: void 0,
          onValueChange: () => {}
        }),
        ir = r.forwardRef(((e, n) => {
          const {
            value: t,
            onValueChange: o,
            ...r
          } = e, a = R(o);
          return (0, i.jsx)(or, {
            scope: e.__scopeMenu,
            value: t,
            onValueChange: a,
            children: (0, i.jsx)(Xo, {
              ...r,
              ref: n
            })
          })
        }));
      ir.displayName = tr;
      var ar = "MenuRadioItem",
        ur = r.forwardRef(((e, n) => {
          const {
            value: t,
            ...o
          } = e, r = rr(ar, e.__scopeMenu), a = t === r.value;
          return (0, i.jsx)(lr, {
            scope: e.__scopeMenu,
            checked: a,
            children: (0, i.jsx)(Qo, {
              role: "menuitemradio",
              "aria-checked": a,
              ...o,
              ref: n,
              "data-state": Er(a),
              onSelect: u(o.onSelect, (() => {
                var e;
                return null == (e = r.onValueChange) ? void 0 : e.call(r, t)
              }), {
                checkForDefaultPrevented: !1
              })
            })
          })
        }));
      ur.displayName = ar;
      var sr = "MenuItemIndicator",
        [lr, cr] = Io(sr, {
          checked: !1
        }),
        dr = r.forwardRef(((e, n) => {
          const {
            __scopeMenu: t,
            forceMount: o,
            ...r
          } = e, a = cr(sr, t);
          return (0, i.jsx)(ut, {
            present: o || Mr(a.checked) || !0 === a.checked,
            children: (0, i.jsx)(b.span, {
              ...r,
              ref: n,
              "data-state": Er(a.checked)
            })
          })
        }));
      dr.displayName = sr;
      var fr = r.forwardRef(((e, n) => {
        const {
          __scopeMenu: t,
          ...o
        } = e;
        return (0, i.jsx)(b.div, {
          role: "separator",
          "aria-orientation": "horizontal",
          ...o,
          ref: n
        })
      }));
      fr.displayName = "MenuSeparator";
      var pr = r.forwardRef(((e, n) => {
        const {
          __scopeMenu: t,
          ...o
        } = e, r = Do(t);
        return (0, i.jsx)(it, {
          ...r,
          ...o,
          ref: n
        })
      }));
      pr.displayName = "MenuArrow";
      var mr = "MenuSub",
        [hr, vr] = Io(mr),
        gr = e => {
          const {
            __scopeMenu: n,
            children: t,
            open: o = !1,
            onOpenChange: a
          } = e, u = _o(mr, n), s = Do(n), [l, c] = r.useState(null), [d, f] = r.useState(null), p = R(a);
          return r.useEffect((() => (!1 === u.open && p(!1), () => p(!1))), [u.open, p]), (0, i.jsx)(tt, {
            ...s,
            children: (0, i.jsx)(Lo, {
              scope: n,
              open: o,
              onOpenChange: p,
              content: d,
              onContentChange: f,
              children: (0, i.jsx)(hr, {
                scope: n,
                contentId: z(),
                triggerId: z(),
                trigger: l,
                onTriggerChange: c,
                children: t
              })
            })
          })
        };
      gr.displayName = mr;
      var yr = "MenuSubTrigger",
        wr = r.forwardRef(((e, n) => {
          const t = _o(yr, e.__scopeMenu),
            o = To(yr, e.__scopeMenu),
            a = vr(yr, e.__scopeMenu),
            s = Vo(yr, e.__scopeMenu),
            c = r.useRef(null),
            {
              pointerGraceTimerRef: d,
              onPointerGraceIntentChange: f
            } = s,
            p = {
              __scopeMenu: e.__scopeMenu
            },
            m = r.useCallback((() => {
              c.current && window.clearTimeout(c.current), c.current = null
            }), []);
          return r.useEffect((() => m), [m]), r.useEffect((() => {
            const e = d.current;
            return () => {
              window.clearTimeout(e), f(null)
            }
          }), [d, f]), (0, i.jsx)(Ao, {
            asChild: !0,
            ...p,
            children: (0, i.jsx)(er, {
              id: a.triggerId,
              "aria-haspopup": "menu",
              "aria-expanded": t.open,
              "aria-controls": a.contentId,
              "data-state": xr(t.open),
              ...e,
              ref: l(n, a.onTriggerChange),
              onClick: n => {
                var o;
                null == (o = e.onClick) || o.call(e, n), !e.disabled && !n.defaultPrevented && (n.currentTarget.focus(), t.open || t.onOpenChange(!0))
              },
              onPointerMove: u(e.onPointerMove, Rr((n => {
                s.onItemEnter(n), !n.defaultPrevented && !e.disabled && !t.open && !c.current && (s.onPointerGraceIntentChange(null), c.current = window.setTimeout((() => {
                  t.onOpenChange(!0), m()
                }), 100))
              }))),
              onPointerLeave: u(e.onPointerLeave, Rr((e => {
                var n, o;
                m();
                const r = null == (n = t.content) ? void 0 : n.getBoundingClientRect();
                if (r) {
                  const n = null == (o = t.content) ? void 0 : o.dataset.side,
                    i = "right" === n,
                    a = i ? -5 : 5,
                    u = r[i ? "left" : "right"],
                    l = r[i ? "right" : "left"];
                  s.onPointerGraceIntentChange({
                    area: [{
                      x: e.clientX + a,
                      y: e.clientY
                    }, {
                      x: u,
                      y: r.top
                    }, {
                      x: l,
                      y: r.top
                    }, {
                      x: l,
                      y: r.bottom
                    }, {
                      x: u,
                      y: r.bottom
                    }],
                    side: n
                  }), window.clearTimeout(d.current), d.current = window.setTimeout((() => s.onPointerGraceIntentChange(null)), 300)
                } else {
                  if (s.onTriggerLeave(e), e.defaultPrevented) return;
                  s.onPointerGraceIntentChange(null)
                }
              }))),
              onKeyDown: u(e.onKeyDown, (n => {
                var r;
                const i = "" !== s.searchRef.current;
                e.disabled || i && " " === n.key || Co[o.dir].includes(n.key) && (t.onOpenChange(!0), null == (r = t.content) || r.focus(), n.preventDefault())
              }))
            })
          })
        }));
      wr.displayName = yr;
      var br = "MenuSubContent",
        Cr = r.forwardRef(((e, n) => {
          const t = Ko(Ho, e.__scopeMenu),
            {
              forceMount: o = t.forceMount,
              ...a
            } = e,
            s = _o(Ho, e.__scopeMenu),
            l = To(Ho, e.__scopeMenu),
            d = vr(br, e.__scopeMenu),
            f = r.useRef(null),
            p = c(n, f);
          return (0, i.jsx)(Eo.Provider, {
            scope: e.__scopeMenu,
            children: (0, i.jsx)(ut, {
              present: o || s.open,
              children: (0, i.jsx)(Eo.Slot, {
                scope: e.__scopeMenu,
                children: (0, i.jsx)(Yo, {
                  id: d.contentId,
                  "aria-labelledby": d.triggerId,
                  ...a,
                  ref: p,
                  align: "start",
                  side: "rtl" === l.dir ? "left" : "right",
                  disableOutsidePointerEvents: !1,
                  disableOutsideScroll: !1,
                  trapFocus: !1,
                  onOpenAutoFocus: e => {
                    var n;
                    l.isUsingKeyboardRef.current && (null == (n = f.current) || n.focus()), e.preventDefault()
                  },
                  onCloseAutoFocus: e => e.preventDefault(),
                  onFocusOutside: u(e.onFocusOutside, (e => {
                    e.target !== d.trigger && s.onOpenChange(!1)
                  })),
                  onEscapeKeyDown: u(e.onEscapeKeyDown, (e => {
                    l.onClose(), e.preventDefault()
                  })),
                  onKeyDown: u(e.onKeyDown, (e => {
                    var n;
                    const t = e.currentTarget.contains(e.target),
                      o = xo[l.dir].includes(e.key);
                    t && o && (s.onOpenChange(!1), null == (n = d.trigger) || n.focus(), e.preventDefault())
                  }))
                })
              })
            })
          })
        }));

      function xr(e) {
        return e ? "open" : "closed"
      }

      function Mr(e) {
        return "indeterminate" === e
      }

      function Er(e) {
        return Mr(e) ? "indeterminate" : e ? "checked" : "unchecked"
      }

      function Rr(e) {
        return n => "mouse" === n.pointerType ? e(n) : void 0
      }
      Cr.displayName = br;
      var Or = No,
        Ir = Ao,
        Sr = Bo,
        Dr = Go,
        Pr = Xo,
        Lr = qo,
        _r = Qo,
        kr = nr,
        Tr = ir,
        Nr = ur,
        Ar = dr,
        Fr = fr,
        jr = pr,
        Kr = gr,
        Br = wr,
        Hr = Cr,
        Wr = "DropdownMenu",
        [Vr, Gr] = d(Wr, [So]),
        Ur = So(),
        [$r, zr] = Vr(Wr),
        Yr = e => {
          const {
            __scopeDropdownMenu: n,
            children: t,
            dir: o,
            open: a,
            defaultOpen: u,
            onOpenChange: s,
            modal: l = !0
          } = e, c = Ur(n), d = r.useRef(null), [f, p] = h({
            prop: a,
            defaultProp: u ?? !1,
            onChange: s,
            caller: Wr
          });
          return (0, i.jsx)($r, {
            scope: n,
            triggerId: z(),
            triggerRef: d,
            contentId: z(),
            open: f,
            onOpenChange: p,
            onOpenToggle: r.useCallback((() => p((e => !e))), [p]),
            modal: l,
            children: (0, i.jsx)(Or, {
              ...c,
              open: f,
              onOpenChange: p,
              dir: o,
              modal: l,
              children: t
            })
          })
        };
      Yr.displayName = Wr;
      var Xr = "DropdownMenuTrigger",
        qr = r.forwardRef(((e, n) => {
          const {
            __scopeDropdownMenu: t,
            disabled: o = !1,
            ...r
          } = e, a = zr(Xr, t), s = Ur(t);
          return (0, i.jsx)(Ir, {
            asChild: !0,
            ...s,
            children: (0, i.jsx)(b.button, {
              type: "button",
              id: a.triggerId,
              "aria-haspopup": "menu",
              "aria-expanded": a.open,
              "aria-controls": a.open ? a.contentId : void 0,
              "data-state": a.open ? "open" : "closed",
              "data-disabled": o ? "" : void 0,
              disabled: o,
              ...r,
              ref: l(n, a.triggerRef),
              onPointerDown: u(e.onPointerDown, (e => {
                !o && 0 === e.button && !1 === e.ctrlKey && (a.onOpenToggle(), a.open || e.preventDefault())
              })),
              onKeyDown: u(e.onKeyDown, (e => {
                o || (["Enter", " "].includes(e.key) && a.onOpenToggle(), "ArrowDown" === e.key && a.onOpenChange(!0), ["Enter", " ", "ArrowDown"].includes(e.key) && e.preventDefault())
              }))
            })
          })
        }));
      qr.displayName = Xr;
      var Zr = e => {
        const {
          __scopeDropdownMenu: n,
          ...t
        } = e, o = Ur(n);
        return (0, i.jsx)(Sr, {
          ...o,
          ...t
        })
      };
      Zr.displayName = "DropdownMenuPortal";
      var Jr = "DropdownMenuContent",
        Qr = r.forwardRef(((e, n) => {
          const {
            __scopeDropdownMenu: t,
            ...o
          } = e, a = zr(Jr, t), s = Ur(t), l = r.useRef(!1);
          return (0, i.jsx)(Dr, {
            id: a.contentId,
            "aria-labelledby": a.triggerId,
            ...s,
            ...o,
            ref: n,
            onCloseAutoFocus: u(e.onCloseAutoFocus, (e => {
              var n;
              l.current || null == (n = a.triggerRef.current) || n.focus(), l.current = !1, e.preventDefault()
            })),
            onInteractOutside: u(e.onInteractOutside, (e => {
              const n = e.detail.originalEvent,
                t = 0 === n.button && !0 === n.ctrlKey,
                o = 2 === n.button || t;
              (!a.modal || o) && (l.current = !0)
            })),
            style: {
              ...e.style,
              "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
              "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
              "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
            }
          })
        }));
      Qr.displayName = Jr;
      var ei = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Pr, {
          ...r,
          ...o,
          ref: n
        })
      }));
      ei.displayName = "DropdownMenuGroup";
      var ni = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Lr, {
          ...r,
          ...o,
          ref: n
        })
      }));
      ni.displayName = "DropdownMenuLabel";
      var ti = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(_r, {
          ...r,
          ...o,
          ref: n
        })
      }));
      ti.displayName = "DropdownMenuItem";
      var oi = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(kr, {
          ...r,
          ...o,
          ref: n
        })
      }));
      oi.displayName = "DropdownMenuCheckboxItem";
      var ri = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Tr, {
          ...r,
          ...o,
          ref: n
        })
      }));
      ri.displayName = "DropdownMenuRadioGroup";
      var ii = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Nr, {
          ...r,
          ...o,
          ref: n
        })
      }));
      ii.displayName = "DropdownMenuRadioItem";
      var ai = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Ar, {
          ...r,
          ...o,
          ref: n
        })
      }));
      ai.displayName = "DropdownMenuItemIndicator";
      var ui = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Fr, {
          ...r,
          ...o,
          ref: n
        })
      }));
      ui.displayName = "DropdownMenuSeparator";
      var si = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(jr, {
          ...r,
          ...o,
          ref: n
        })
      }));
      si.displayName = "DropdownMenuArrow";
      var li = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Br, {
          ...r,
          ...o,
          ref: n
        })
      }));
      li.displayName = "DropdownMenuSubTrigger";
      var ci = r.forwardRef(((e, n) => {
        const {
          __scopeDropdownMenu: t,
          ...o
        } = e, r = Ur(t);
        return (0, i.jsx)(Hr, {
          ...r,
          ...o,
          ref: n,
          style: {
            ...e.style,
            "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
          }
        })
      }));
      ci.displayName = "DropdownMenuSubContent";
      var di = Yr,
        fi = qr,
        pi = Zr,
        mi = Qr,
        hi = ei,
        vi = ni,
        gi = ti,
        yi = oi,
        wi = ri,
        bi = ii,
        Ci = ai,
        xi = ui,
        Mi = si,
        Ei = e => {
          const {
            __scopeDropdownMenu: n,
            children: t,
            open: o,
            onOpenChange: r,
            defaultOpen: a
          } = e, u = Ur(n), [s, l] = h({
            prop: o,
            defaultProp: a ?? !1,
            onChange: r,
            caller: "DropdownMenuSub"
          });
          return (0, i.jsx)(Kr, {
            ...u,
            open: s,
            onOpenChange: l,
            children: t
          })
        },
        Ri = li,
        Oi = ci
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
        n = (new Error).stack;
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0c43b639-4540-401f-9822-fae1a2a88a50", e._sentryDebugIdIdentifier = "sentry-dbid-0c43b639-4540-401f-9822-fae1a2a88a50")
    } catch (e) {}
  }();
//# sourceMappingURL=47287.6ea790a3b97ca8e444b3.js.map