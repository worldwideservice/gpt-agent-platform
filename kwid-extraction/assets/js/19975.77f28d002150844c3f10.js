/*! For license information please see 19975.77f28d002150844c3f10.js.LICENSE.txt */
(window.webpackChunk = window.webpackChunk || []).push([
  [19975], {
    698302: function(t, e) {
      ! function(n, r) {
        var i = {
            version: "0.3.2",
            settings: {
              currency: {
                symbol: "$",
                format: "%s%v",
                decimal: ".",
                thousand: ",",
                precision: 2,
                grouping: 3
              },
              number: {
                precision: 0,
                grouping: 3,
                thousand: ",",
                decimal: "."
              }
            }
          },
          o = Array.prototype.map,
          a = Array.isArray,
          s = Object.prototype.toString;

        function c(t) {
          return !!("" === t || t && t.charCodeAt && t.substr)
        }

        function u(t) {
          return a ? a(t) : "[object Array]" === s.call(t)
        }

        function l(t) {
          return "[object Object]" === s.call(t)
        }

        function d(t, e) {
          var n;
          for (n in t = t || {}, e = e || {}) e.hasOwnProperty(n) && null == t[n] && (t[n] = e[n]);
          return t
        }

        function f(t, e, n) {
          var r, i, a = [];
          if (!t) return a;
          if (o && t.map === o) return t.map(e, n);
          for (r = 0, i = t.length; r < i; r++) a[r] = e.call(n, t[r], r, t);
          return a
        }

        function p(t, e) {
          return t = Math.round(Math.abs(t)), isNaN(t) ? e : t
        }

        function m(t) {
          var e = i.settings.currency.format;
          return "function" == typeof t && (t = t()), c(t) && t.match("%v") ? {
            pos: t,
            neg: t.replace("-", "").replace("%v", "-%v"),
            zero: t
          } : t && t.pos && t.pos.match("%v") ? t : c(e) ? i.settings.currency.format = {
            pos: e,
            neg: e.replace("%v", "-%v"),
            zero: e
          } : e
        }
        var g = i.unformat = i.parse = function(t, e) {
            if (u(t)) return f(t, (function(t) {
              return g(t, e)
            }));
            if ("number" == typeof(t = t || 0)) return t;
            e = e || ".";
            var n = new RegExp("[^0-9-" + e + "]", ["g"]),
              r = parseFloat(("" + t).replace(/\((.*)\)/, "-$1").replace(n, "").replace(e, "."));
            return isNaN(r) ? 0 : r
          },
          h = i.toFixed = function(t, e) {
            e = p(e, i.settings.number.precision);
            var n = Math.pow(10, e);
            return (Math.round(i.unformat(t) * n) / n).toFixed(e)
          },
          b = i.formatNumber = function(t, e, n, r) {
            if (u(t)) return f(t, (function(t) {
              return b(t, e, n, r)
            }));
            t = g(t);
            var o = d(l(e) ? e : {
                precision: e,
                thousand: n,
                decimal: r
              }, i.settings.number),
              a = p(o.precision),
              s = t < 0 ? "-" : "",
              c = parseInt(h(Math.abs(t || 0), a), 10) + "",
              m = c.length > 3 ? c.length % 3 : 0;
            return s + (m ? c.substr(0, m) + o.thousand : "") + c.substr(m).replace(/(\d{3})(?=\d)/g, "$1" + o.thousand) + (a ? o.decimal + h(Math.abs(t), a).split(".")[1] : "")
          },
          y = i.formatMoney = function(t, e, n, r, o, a) {
            if (u(t)) return f(t, (function(t) {
              return y(t, e, n, r, o, a)
            }));
            t = g(t);
            var s = d(l(e) ? e : {
                symbol: e,
                precision: n,
                thousand: r,
                decimal: o,
                format: a
              }, i.settings.currency),
              c = m(s.format);
            return (t > 0 ? c.pos : t < 0 ? c.neg : c.zero).replace("%s", s.symbol).replace("%v", b(Math.abs(t), p(s.precision), s.thousand, s.decimal))
          };
        i.formatColumn = function(t, e, n, r, o, a) {
          if (!t) return [];
          var s = d(l(e) ? e : {
              symbol: e,
              precision: n,
              thousand: r,
              decimal: o,
              format: a
            }, i.settings.currency),
            h = m(s.format),
            y = h.pos.indexOf("%s") < h.pos.indexOf("%v"),
            v = 0,
            w = f(t, (function(t, e) {
              if (u(t)) return i.formatColumn(t, s);
              var n = ((t = g(t)) > 0 ? h.pos : t < 0 ? h.neg : h.zero).replace("%s", s.symbol).replace("%v", b(Math.abs(t), p(s.precision), s.thousand, s.decimal));
              return n.length > v && (v = n.length), n
            }));
          return f(w, (function(t, e) {
            return c(t) && t.length < v ? y ? t.replace(s.symbol, s.symbol + new Array(v - t.length + 1).join(" ")) : new Array(v - t.length + 1).join(" ") + t : t
          }))
        }, t.exports && (e = t.exports = i), e.accounting = i
      }();
      var n = "accounting";
      window.define(n, (function() {
        var e = "undefined",
          n = typeof __webpack_exports__ === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof t === e ? void 0 : t.exports : __WEBPACK_AMD_DEFINE_RESULT__ : __webpack_exports__;
        return n && n.default || n
      })), window.require([n])
    },
    445752: (t, e, n) => {
      var r = n(178461),
        i = n(621614);

      function o(t) {
        return null == t
      }

      function a(t) {
        (t = function(t) {
          var e = {};
          for (var n in t) e[n] = t[n];
          return e
        }(t || {})).whiteList = t.whiteList || r.whiteList, t.onAttr = t.onAttr || r.onAttr, t.onIgnoreAttr = t.onIgnoreAttr || r.onIgnoreAttr, t.safeAttrValue = t.safeAttrValue || r.safeAttrValue, this.options = t
      }
      n(705088), a.prototype.process = function(t) {
        if (!(t = (t = t || "").toString())) return "";
        var e = this.options,
          n = e.whiteList,
          r = e.onAttr,
          a = e.onIgnoreAttr,
          s = e.safeAttrValue;
        return i(t, (function(t, e, i, c, u) {
          var l = n[i],
            d = !1;
          if (!0 === l ? d = l : "function" == typeof l ? d = l(c) : l instanceof RegExp && (d = l.test(c)), !0 !== d && (d = !1), c = s(i, c)) {
            var f, p = {
              position: e,
              sourcePosition: t,
              source: u,
              isWhite: d
            };
            return d ? o(f = r(i, c, p)) ? i + ":" + c : f : o(f = a(i, c, p)) ? void 0 : f
          }
        }))
      }, t.exports = a
    },
    178461: (t, e) => {
      function n() {
        return {
          "align-content": !1,
          "align-items": !1,
          "align-self": !1,
          "alignment-adjust": !1,
          "alignment-baseline": !1,
          all: !1,
          "anchor-point": !1,
          animation: !1,
          "animation-delay": !1,
          "animation-direction": !1,
          "animation-duration": !1,
          "animation-fill-mode": !1,
          "animation-iteration-count": !1,
          "animation-name": !1,
          "animation-play-state": !1,
          "animation-timing-function": !1,
          azimuth: !1,
          "backface-visibility": !1,
          background: !0,
          "background-attachment": !0,
          "background-clip": !0,
          "background-color": !0,
          "background-image": !0,
          "background-origin": !0,
          "background-position": !0,
          "background-repeat": !0,
          "background-size": !0,
          "baseline-shift": !1,
          binding: !1,
          bleed: !1,
          "bookmark-label": !1,
          "bookmark-level": !1,
          "bookmark-state": !1,
          border: !0,
          "border-bottom": !0,
          "border-bottom-color": !0,
          "border-bottom-left-radius": !0,
          "border-bottom-right-radius": !0,
          "border-bottom-style": !0,
          "border-bottom-width": !0,
          "border-collapse": !0,
          "border-color": !0,
          "border-image": !0,
          "border-image-outset": !0,
          "border-image-repeat": !0,
          "border-image-slice": !0,
          "border-image-source": !0,
          "border-image-width": !0,
          "border-left": !0,
          "border-left-color": !0,
          "border-left-style": !0,
          "border-left-width": !0,
          "border-radius": !0,
          "border-right": !0,
          "border-right-color": !0,
          "border-right-style": !0,
          "border-right-width": !0,
          "border-spacing": !0,
          "border-style": !0,
          "border-top": !0,
          "border-top-color": !0,
          "border-top-left-radius": !0,
          "border-top-right-radius": !0,
          "border-top-style": !0,
          "border-top-width": !0,
          "border-width": !0,
          bottom: !1,
          "box-decoration-break": !0,
          "box-shadow": !0,
          "box-sizing": !0,
          "box-snap": !0,
          "box-suppress": !0,
          "break-after": !0,
          "break-before": !0,
          "break-inside": !0,
          "caption-side": !1,
          chains: !1,
          clear: !0,
          clip: !1,
          "clip-path": !1,
          "clip-rule": !1,
          color: !0,
          "color-interpolation-filters": !0,
          "column-count": !1,
          "column-fill": !1,
          "column-gap": !1,
          "column-rule": !1,
          "column-rule-color": !1,
          "column-rule-style": !1,
          "column-rule-width": !1,
          "column-span": !1,
          "column-width": !1,
          columns: !1,
          contain: !1,
          content: !1,
          "counter-increment": !1,
          "counter-reset": !1,
          "counter-set": !1,
          crop: !1,
          cue: !1,
          "cue-after": !1,
          "cue-before": !1,
          cursor: !1,
          direction: !1,
          display: !0,
          "display-inside": !0,
          "display-list": !0,
          "display-outside": !0,
          "dominant-baseline": !1,
          elevation: !1,
          "empty-cells": !1,
          filter: !1,
          flex: !1,
          "flex-basis": !1,
          "flex-direction": !1,
          "flex-flow": !1,
          "flex-grow": !1,
          "flex-shrink": !1,
          "flex-wrap": !1,
          float: !1,
          "float-offset": !1,
          "flood-color": !1,
          "flood-opacity": !1,
          "flow-from": !1,
          "flow-into": !1,
          font: !0,
          "font-family": !0,
          "font-feature-settings": !0,
          "font-kerning": !0,
          "font-language-override": !0,
          "font-size": !0,
          "font-size-adjust": !0,
          "font-stretch": !0,
          "font-style": !0,
          "font-synthesis": !0,
          "font-variant": !0,
          "font-variant-alternates": !0,
          "font-variant-caps": !0,
          "font-variant-east-asian": !0,
          "font-variant-ligatures": !0,
          "font-variant-numeric": !0,
          "font-variant-position": !0,
          "font-weight": !0,
          grid: !1,
          "grid-area": !1,
          "grid-auto-columns": !1,
          "grid-auto-flow": !1,
          "grid-auto-rows": !1,
          "grid-column": !1,
          "grid-column-end": !1,
          "grid-column-start": !1,
          "grid-row": !1,
          "grid-row-end": !1,
          "grid-row-start": !1,
          "grid-template": !1,
          "grid-template-areas": !1,
          "grid-template-columns": !1,
          "grid-template-rows": !1,
          "hanging-punctuation": !1,
          height: !0,
          hyphens: !1,
          icon: !1,
          "image-orientation": !1,
          "image-resolution": !1,
          "ime-mode": !1,
          "initial-letters": !1,
          "inline-box-align": !1,
          "justify-content": !1,
          "justify-items": !1,
          "justify-self": !1,
          left: !1,
          "letter-spacing": !0,
          "lighting-color": !0,
          "line-box-contain": !1,
          "line-break": !1,
          "line-grid": !1,
          "line-height": !1,
          "line-snap": !1,
          "line-stacking": !1,
          "line-stacking-ruby": !1,
          "line-stacking-shift": !1,
          "line-stacking-strategy": !1,
          "list-style": !0,
          "list-style-image": !0,
          "list-style-position": !0,
          "list-style-type": !0,
          margin: !0,
          "margin-bottom": !0,
          "margin-left": !0,
          "margin-right": !0,
          "margin-top": !0,
          "marker-offset": !1,
          "marker-side": !1,
          marks: !1,
          mask: !1,
          "mask-box": !1,
          "mask-box-outset": !1,
          "mask-box-repeat": !1,
          "mask-box-slice": !1,
          "mask-box-source": !1,
          "mask-box-width": !1,
          "mask-clip": !1,
          "mask-image": !1,
          "mask-origin": !1,
          "mask-position": !1,
          "mask-repeat": !1,
          "mask-size": !1,
          "mask-source-type": !1,
          "mask-type": !1,
          "max-height": !0,
          "max-lines": !1,
          "max-width": !0,
          "min-height": !0,
          "min-width": !0,
          "move-to": !1,
          "nav-down": !1,
          "nav-index": !1,
          "nav-left": !1,
          "nav-right": !1,
          "nav-up": !1,
          "object-fit": !1,
          "object-position": !1,
          opacity: !1,
          order: !1,
          orphans: !1,
          outline: !1,
          "outline-color": !1,
          "outline-offset": !1,
          "outline-style": !1,
          "outline-width": !1,
          overflow: !1,
          "overflow-wrap": !1,
          "overflow-x": !1,
          "overflow-y": !1,
          padding: !0,
          "padding-bottom": !0,
          "padding-left": !0,
          "padding-right": !0,
          "padding-top": !0,
          page: !1,
          "page-break-after": !1,
          "page-break-before": !1,
          "page-break-inside": !1,
          "page-policy": !1,
          pause: !1,
          "pause-after": !1,
          "pause-before": !1,
          perspective: !1,
          "perspective-origin": !1,
          pitch: !1,
          "pitch-range": !1,
          "play-during": !1,
          position: !1,
          "presentation-level": !1,
          quotes: !1,
          "region-fragment": !1,
          resize: !1,
          rest: !1,
          "rest-after": !1,
          "rest-before": !1,
          richness: !1,
          right: !1,
          rotation: !1,
          "rotation-point": !1,
          "ruby-align": !1,
          "ruby-merge": !1,
          "ruby-position": !1,
          "shape-image-threshold": !1,
          "shape-outside": !1,
          "shape-margin": !1,
          size: !1,
          speak: !1,
          "speak-as": !1,
          "speak-header": !1,
          "speak-numeral": !1,
          "speak-punctuation": !1,
          "speech-rate": !1,
          stress: !1,
          "string-set": !1,
          "tab-size": !1,
          "table-layout": !1,
          "text-align": !0,
          "text-align-last": !0,
          "text-combine-upright": !0,
          "text-decoration": !0,
          "text-decoration-color": !0,
          "text-decoration-line": !0,
          "text-decoration-skip": !0,
          "text-decoration-style": !0,
          "text-emphasis": !0,
          "text-emphasis-color": !0,
          "text-emphasis-position": !0,
          "text-emphasis-style": !0,
          "text-height": !0,
          "text-indent": !0,
          "text-justify": !0,
          "text-orientation": !0,
          "text-overflow": !0,
          "text-shadow": !0,
          "text-space-collapse": !0,
          "text-transform": !0,
          "text-underline-position": !0,
          "text-wrap": !0,
          top: !1,
          transform: !1,
          "transform-origin": !1,
          "transform-style": !1,
          transition: !1,
          "transition-delay": !1,
          "transition-duration": !1,
          "transition-property": !1,
          "transition-timing-function": !1,
          "unicode-bidi": !1,
          "vertical-align": !1,
          visibility: !1,
          "voice-balance": !1,
          "voice-duration": !1,
          "voice-family": !1,
          "voice-pitch": !1,
          "voice-range": !1,
          "voice-rate": !1,
          "voice-stress": !1,
          "voice-volume": !1,
          volume: !1,
          "white-space": !1,
          widows: !1,
          width: !0,
          "will-change": !1,
          "word-break": !0,
          "word-spacing": !0,
          "word-wrap": !0,
          "wrap-flow": !1,
          "wrap-through": !1,
          "writing-mode": !1,
          "z-index": !1
        }
      }
      var r = /javascript\s*\:/gim;
      e.whiteList = {
        "align-content": !1,
        "align-items": !1,
        "align-self": !1,
        "alignment-adjust": !1,
        "alignment-baseline": !1,
        all: !1,
        "anchor-point": !1,
        animation: !1,
        "animation-delay": !1,
        "animation-direction": !1,
        "animation-duration": !1,
        "animation-fill-mode": !1,
        "animation-iteration-count": !1,
        "animation-name": !1,
        "animation-play-state": !1,
        "animation-timing-function": !1,
        azimuth: !1,
        "backface-visibility": !1,
        background: !0,
        "background-attachment": !0,
        "background-clip": !0,
        "background-color": !0,
        "background-image": !0,
        "background-origin": !0,
        "background-position": !0,
        "background-repeat": !0,
        "background-size": !0,
        "baseline-shift": !1,
        binding: !1,
        bleed: !1,
        "bookmark-label": !1,
        "bookmark-level": !1,
        "bookmark-state": !1,
        border: !0,
        "border-bottom": !0,
        "border-bottom-color": !0,
        "border-bottom-left-radius": !0,
        "border-bottom-right-radius": !0,
        "border-bottom-style": !0,
        "border-bottom-width": !0,
        "border-collapse": !0,
        "border-color": !0,
        "border-image": !0,
        "border-image-outset": !0,
        "border-image-repeat": !0,
        "border-image-slice": !0,
        "border-image-source": !0,
        "border-image-width": !0,
        "border-left": !0,
        "border-left-color": !0,
        "border-left-style": !0,
        "border-left-width": !0,
        "border-radius": !0,
        "border-right": !0,
        "border-right-color": !0,
        "border-right-style": !0,
        "border-right-width": !0,
        "border-spacing": !0,
        "border-style": !0,
        "border-top": !0,
        "border-top-color": !0,
        "border-top-left-radius": !0,
        "border-top-right-radius": !0,
        "border-top-style": !0,
        "border-top-width": !0,
        "border-width": !0,
        bottom: !1,
        "box-decoration-break": !0,
        "box-shadow": !0,
        "box-sizing": !0,
        "box-snap": !0,
        "box-suppress": !0,
        "break-after": !0,
        "break-before": !0,
        "break-inside": !0,
        "caption-side": !1,
        chains: !1,
        clear: !0,
        clip: !1,
        "clip-path": !1,
        "clip-rule": !1,
        color: !0,
        "color-interpolation-filters": !0,
        "column-count": !1,
        "column-fill": !1,
        "column-gap": !1,
        "column-rule": !1,
        "column-rule-color": !1,
        "column-rule-style": !1,
        "column-rule-width": !1,
        "column-span": !1,
        "column-width": !1,
        columns: !1,
        contain: !1,
        content: !1,
        "counter-increment": !1,
        "counter-reset": !1,
        "counter-set": !1,
        crop: !1,
        cue: !1,
        "cue-after": !1,
        "cue-before": !1,
        cursor: !1,
        direction: !1,
        display: !0,
        "display-inside": !0,
        "display-list": !0,
        "display-outside": !0,
        "dominant-baseline": !1,
        elevation: !1,
        "empty-cells": !1,
        filter: !1,
        flex: !1,
        "flex-basis": !1,
        "flex-direction": !1,
        "flex-flow": !1,
        "flex-grow": !1,
        "flex-shrink": !1,
        "flex-wrap": !1,
        float: !1,
        "float-offset": !1,
        "flood-color": !1,
        "flood-opacity": !1,
        "flow-from": !1,
        "flow-into": !1,
        font: !0,
        "font-family": !0,
        "font-feature-settings": !0,
        "font-kerning": !0,
        "font-language-override": !0,
        "font-size": !0,
        "font-size-adjust": !0,
        "font-stretch": !0,
        "font-style": !0,
        "font-synthesis": !0,
        "font-variant": !0,
        "font-variant-alternates": !0,
        "font-variant-caps": !0,
        "font-variant-east-asian": !0,
        "font-variant-ligatures": !0,
        "font-variant-numeric": !0,
        "font-variant-position": !0,
        "font-weight": !0,
        grid: !1,
        "grid-area": !1,
        "grid-auto-columns": !1,
        "grid-auto-flow": !1,
        "grid-auto-rows": !1,
        "grid-column": !1,
        "grid-column-end": !1,
        "grid-column-start": !1,
        "grid-row": !1,
        "grid-row-end": !1,
        "grid-row-start": !1,
        "grid-template": !1,
        "grid-template-areas": !1,
        "grid-template-columns": !1,
        "grid-template-rows": !1,
        "hanging-punctuation": !1,
        height: !0,
        hyphens: !1,
        icon: !1,
        "image-orientation": !1,
        "image-resolution": !1,
        "ime-mode": !1,
        "initial-letters": !1,
        "inline-box-align": !1,
        "justify-content": !1,
        "justify-items": !1,
        "justify-self": !1,
        left: !1,
        "letter-spacing": !0,
        "lighting-color": !0,
        "line-box-contain": !1,
        "line-break": !1,
        "line-grid": !1,
        "line-height": !1,
        "line-snap": !1,
        "line-stacking": !1,
        "line-stacking-ruby": !1,
        "line-stacking-shift": !1,
        "line-stacking-strategy": !1,
        "list-style": !0,
        "list-style-image": !0,
        "list-style-position": !0,
        "list-style-type": !0,
        margin: !0,
        "margin-bottom": !0,
        "margin-left": !0,
        "margin-right": !0,
        "margin-top": !0,
        "marker-offset": !1,
        "marker-side": !1,
        marks: !1,
        mask: !1,
        "mask-box": !1,
        "mask-box-outset": !1,
        "mask-box-repeat": !1,
        "mask-box-slice": !1,
        "mask-box-source": !1,
        "mask-box-width": !1,
        "mask-clip": !1,
        "mask-image": !1,
        "mask-origin": !1,
        "mask-position": !1,
        "mask-repeat": !1,
        "mask-size": !1,
        "mask-source-type": !1,
        "mask-type": !1,
        "max-height": !0,
        "max-lines": !1,
        "max-width": !0,
        "min-height": !0,
        "min-width": !0,
        "move-to": !1,
        "nav-down": !1,
        "nav-index": !1,
        "nav-left": !1,
        "nav-right": !1,
        "nav-up": !1,
        "object-fit": !1,
        "object-position": !1,
        opacity: !1,
        order: !1,
        orphans: !1,
        outline: !1,
        "outline-color": !1,
        "outline-offset": !1,
        "outline-style": !1,
        "outline-width": !1,
        overflow: !1,
        "overflow-wrap": !1,
        "overflow-x": !1,
        "overflow-y": !1,
        padding: !0,
        "padding-bottom": !0,
        "padding-left": !0,
        "padding-right": !0,
        "padding-top": !0,
        page: !1,
        "page-break-after": !1,
        "page-break-before": !1,
        "page-break-inside": !1,
        "page-policy": !1,
        pause: !1,
        "pause-after": !1,
        "pause-before": !1,
        perspective: !1,
        "perspective-origin": !1,
        pitch: !1,
        "pitch-range": !1,
        "play-during": !1,
        position: !1,
        "presentation-level": !1,
        quotes: !1,
        "region-fragment": !1,
        resize: !1,
        rest: !1,
        "rest-after": !1,
        "rest-before": !1,
        richness: !1,
        right: !1,
        rotation: !1,
        "rotation-point": !1,
        "ruby-align": !1,
        "ruby-merge": !1,
        "ruby-position": !1,
        "shape-image-threshold": !1,
        "shape-outside": !1,
        "shape-margin": !1,
        size: !1,
        speak: !1,
        "speak-as": !1,
        "speak-header": !1,
        "speak-numeral": !1,
        "speak-punctuation": !1,
        "speech-rate": !1,
        stress: !1,
        "string-set": !1,
        "tab-size": !1,
        "table-layout": !1,
        "text-align": !0,
        "text-align-last": !0,
        "text-combine-upright": !0,
        "text-decoration": !0,
        "text-decoration-color": !0,
        "text-decoration-line": !0,
        "text-decoration-skip": !0,
        "text-decoration-style": !0,
        "text-emphasis": !0,
        "text-emphasis-color": !0,
        "text-emphasis-position": !0,
        "text-emphasis-style": !0,
        "text-height": !0,
        "text-indent": !0,
        "text-justify": !0,
        "text-orientation": !0,
        "text-overflow": !0,
        "text-shadow": !0,
        "text-space-collapse": !0,
        "text-transform": !0,
        "text-underline-position": !0,
        "text-wrap": !0,
        top: !1,
        transform: !1,
        "transform-origin": !1,
        "transform-style": !1,
        transition: !1,
        "transition-delay": !1,
        "transition-duration": !1,
        "transition-property": !1,
        "transition-timing-function": !1,
        "unicode-bidi": !1,
        "vertical-align": !1,
        visibility: !1,
        "voice-balance": !1,
        "voice-duration": !1,
        "voice-family": !1,
        "voice-pitch": !1,
        "voice-range": !1,
        "voice-rate": !1,
        "voice-stress": !1,
        "voice-volume": !1,
        volume: !1,
        "white-space": !1,
        widows: !1,
        width: !0,
        "will-change": !1,
        "word-break": !0,
        "word-spacing": !0,
        "word-wrap": !0,
        "wrap-flow": !1,
        "wrap-through": !1,
        "writing-mode": !1,
        "z-index": !1
      }, e.getDefaultWhiteList = n, e.onAttr = function(t, e, n) {}, e.onIgnoreAttr = function(t, e, n) {}, e.safeAttrValue = function(t, e) {
        return r.test(e) ? "" : e
      }
    },
    878114: (t, e, n) => {
      var r = n(178461),
        i = n(445752);
      for (var o in (e = t.exports = function(t, e) {
          return new i(e).process(t)
        }).FilterCSS = i, r) e[o] = r[o];
      "undefined" != typeof window && (window.filterCSS = t.exports)
    },
    621614: (t, e, n) => {
      var r = n(705088);
      t.exports = function(t, e) {
        ";" !== (t = r.trimRight(t))[t.length - 1] && (t += ";");
        var n = t.length,
          i = !1,
          o = 0,
          a = 0,
          s = "";

        function c() {
          if (!i) {
            var n = r.trim(t.slice(o, a)),
              c = n.indexOf(":");
            if (-1 !== c) {
              var u = r.trim(n.slice(0, c)),
                l = r.trim(n.slice(c + 1));
              if (u) {
                var d = e(o, s.length, u, l, n);
                d && (s += d + "; ")
              }
            }
          }
          o = a + 1
        }
        for (; a < n; a++) {
          var u = t[a];
          if ("/" === u && "*" === t[a + 1]) {
            var l = t.indexOf("*/", a + 2);
            if (-1 === l) break;
            o = (a = l + 1) + 1, i = !1
          } else "(" === u ? i = !0 : ")" === u ? i = !1 : ";" === u ? i || c() : "\n" === u && c()
        }
        return r.trim(s)
      }
    },
    705088: t => {
      t.exports = {
        indexOf: function(t, e) {
          var n, r;
          if (Array.prototype.indexOf) return t.indexOf(e);
          for (n = 0, r = t.length; n < r; n++)
            if (t[n] === e) return n;
          return -1
        },
        forEach: function(t, e, n) {
          var r, i;
          if (Array.prototype.forEach) return t.forEach(e, n);
          for (r = 0, i = t.length; r < i; r++) e.call(n, t[r], r, t)
        },
        trim: function(t) {
          return String.prototype.trim ? t.trim() : t.replace(/(^\s*)|(\s*$)/g, "")
        },
        trimRight: function(t) {
          return String.prototype.trimRight ? t.trimRight() : t.replace(/(\s*$)/g, "")
        }
      }
    },
    509372: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, {
        COOKIE_LISTENER_INTERVAL_DELAY: () => p,
        get: () => u,
        listenCookie: () => g,
        remove: () => l,
        set: () => c
      });
      var r = n(629133),
        i = n.n(r),
        o = n(334254),
        a = n.n(o),
        s = n(778618),
        c = function(t) {
          if (void 0 === t.name || void 0 === t.value) return !1;
          "object" == typeof t.value && (t.value = JSON.stringify(t.value));
          var e = t.expiredays || 7,
            n = t.path || "/",
            r = t.domain || "",
            i = t.secure || !1,
            o = null;
          if (!1 !== i && (i = !0), t.session) o = null;
          else if (e) {
            var a = new Date;
            a.setDate(a.getDate() + e), o = a.toGMTString()
          }
          return document.cookie = "".concat(t.name, "=").concat(escape(t.value)).concat(o ? "; expires=".concat(o) : "").concat(n ? "; path=".concat(n) : "").concat(r ? "; domain=".concat(r) : "").concat(i ? "; secure" : ""), !0
        },
        u = function(t) {
          var e = " ".concat(document.cookie),
            n = " ".concat(t, "="),
            r = null,
            i = 0,
            o = 0;
          return e.length > 0 && -1 !== (i = e.indexOf(n)) && (i += n.length, -1 === (o = e.indexOf(";", i)) && (o = e.length), r = unescape(e.substring(i, o))), r
        },
        l = function(t) {
          var e = t.name,
            n = t.path,
            r = void 0 === n ? "/" : n,
            i = t.domain,
            o = t.secure,
            a = void 0 !== o && o;
          if (e) {
            var s = ["".concat(encodeURIComponent(e), "="), "expires=Thu, 01 Jan 1970 00:00:00 GMT", "path=".concat(r)];
            i && s.push("domain=".concat(i)), a && s.push("secure"), document.cookie = s.join("; ")
          }
        },
        d = {},
        f = {},
        p = 100,
        m = i().once((function() {
          if (window.cookieStore) {
            var t = function(t) {
              var e = t.name,
                n = t.value,
                r = d[e];
              if (r) {
                var i = !0,
                  o = !1,
                  a = void 0;
                try {
                  for (var s, c = r[Symbol.iterator](); !(i = (s = c.next()).done); i = !0)(0, s.value)({
                    newValue: n
                  })
                } catch (t) {
                  o = !0, a = t
                } finally {
                  try {
                    i || null == c.return || c.return()
                  } finally {
                    if (o) throw a
                  }
                }
              }
            };
            window.cookieStore.addEventListener("change", (function(e) {
              var n = !0,
                r = !1,
                i = void 0;
              try {
                for (var o, a = e.changed[Symbol.iterator](); !(n = (o = a.next()).done); n = !0) {
                  var s = o.value,
                    c = s.name,
                    u = s.value;
                  t({
                    name: c,
                    value: u
                  })
                }
              } catch (t) {
                r = !0, i = t
              } finally {
                try {
                  n || null == a.return || a.return()
                } finally {
                  if (r) throw i
                }
              }
              var l = !0,
                d = !1,
                f = void 0;
              try {
                for (var p, m = e.deleted[Symbol.iterator](); !(l = (p = m.next()).done); l = !0) {
                  var g = p.value.name;
                  t({
                    name: g,
                    value: null
                  })
                }
              } catch (t) {
                d = !0, f = t
              } finally {
                try {
                  l || null == m.return || m.return()
                } finally {
                  if (d) throw f
                }
              }
            }))
          } else {
            var e = 0,
              n = function() {
                i().each(d, (function(t, e) {
                  if (t) {
                    var n = u(e),
                      r = f[e] || null;
                    n !== r && i().each(t, (function(t) {
                      t({
                        newValue: n
                      }), f[e] = n
                    }))
                  }
                })), e = (0, s.setWorkerTimeout)(n, p)
              };
            a().change((function() {
              a().hidden() || ((0, s.clearWorkerTimeout)(e), n())
            })), e = (0, s.setWorkerTimeout)(n, p)
          }
        })),
        g = function(t) {
          var e, n, r = t.name,
            i = t.listener;
          (e = d)[n = r] || (e[n] = []), d[r].push(i), f[r] = u(r), m()
        },
        h = "../build/transpiled/common/cookie";
      window.define(h, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([h])
    },
    761634: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, {
        get: () => s,
        getSupportBotId: () => c
      });
      var r = n(629133),
        i = n.n(r),
        o = n(926168),
        a = APP.constant("amojo_bots");

      function s() {
        var t = {};
        return i().each(a, (function(e) {
          t[e.id] = {
            id: e.id,
            amojo_id: e.id,
            name: e.name,
            active: !0,
            code: e.code,
            avatar: e.avatar,
            option: e.name,
            title: e.name,
            bot: !0,
            group: "bots",
            is_direct: e.direct,
            is_integration_bot: e.is_integration_bot,
            is_available_for_chatting: e.is_available_for_chatting
          }
        })), t
      }

      function c() {
        var t = i().find(s(), (function(t) {
          return !(0, o.isCustomers)() && "amo.support" === t.code
        }));
        return i().propertyOf(t)(["id"])
      }
      var u = "../build/transpiled/interface/amojo/bots";
      window.define(u, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([u])
    },
    926168: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, {
        checkIsInvoicesFeatureEnabled: () => C,
        checkIsProductsFeatureEnabled: () => L,
        convertElementType: () => M,
        getContactFullName: () => R,
        getEntityByTypeId: () => S,
        getEntityLangIdWithCase: () => I,
        getLangId: () => T,
        getLeadsWinlostStatuses: () => k,
        getMatchingEntity: () => _,
        getProductsCatalogId: () => j,
        getSuppliersCatalogId: () => O,
        getVersion: () => z,
        isCustomers: () => U,
        isExpired: () => B,
        isHelpbotEnabled: () => N,
        isLostStatus: () => x,
        isPartner: () => F,
        isPartnersHelpAvailable: () => V,
        isTrial: () => W,
        isTrialExpired: () => Y,
        isUnsortedStatus: () => A,
        isWonLostStatus: () => E,
        isWonStatus: () => P,
        parseLinkedType: () => D
      });
      var r = n(629133),
        i = n.n(r),
        o = n(866633),
        a = n(445368),
        s = n(500034);

      function c(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = n, t
      }
      var u = {
          win: 142,
          lost: 143
        },
        l = APP.element_types.leads,
        d = APP.element_types.contacts,
        f = APP.element_types.companies,
        p = APP.element_types.customers,
        m = APP.element_types.transactions,
        g = APP.element_types.catalogs,
        h = APP.element_types.tags,
        b = APP.element_types.unsorted,
        y = APP.element_types.todo,
        v = APP.element_types.catalog_elements,
        w = [{
          int: l,
          string: "leads",
          single: "lead"
        }, {
          int: d,
          string: "contacts",
          single: "contact"
        }, {
          int: f,
          string: "companies",
          single: "company"
        }, {
          int: p,
          string: "customers",
          single: "customer"
        }, {
          int: m,
          string: "transactions",
          single: "transaction"
        }, {
          int: g,
          string: "catalogs",
          single: "catalog"
        }, {
          int: h,
          string: "tags",
          single: "tag"
        }, {
          int: b,
          string: "unsorted",
          single: "unsorted"
        }, {
          int: y,
          string: "todos",
          single: "todo"
        }, {
          int: v,
          string: "catalog_elements",
          single: "catalog_element"
        }],
        _ = function(t) {
          var e;
          return t = t || APP.data.current_entity, i().each({
            contacts: ["companies"]
          }, (function(n, r) {
            i().contains(n, t) && (e = r)
          })), e || t
        },
        P = function(t) {
          return u.win === parseInt(t)
        },
        x = function(t) {
          return u.lost === parseInt(t)
        },
        A = function(t) {
          return APP.constant("unsorted_statuses")[t]
        },
        k = function(t) {
          return i().isUndefined(t) ? i().values(u) : u[t]
        },
        E = function(t) {
          return i().contains(k(), +t)
        },
        S = function(t) {
          return i().invert(APP.element_types)[t]
        },
        I = function(t) {
          var e, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "nominative";
          return (c(e = {}, l, {
            nominative: "Lead",
            dative: "lead (dative)",
            dativeWithPreposition: "lead (dative with preposition)",
            causative: "lead (causative)",
            causativeWithPreposition: "lead (causative with preposition)",
            locative: "lead (locative)"
          }), c(e, d, {
            nominative: "Contact",
            dative: "contact (dative)",
            dativeWithPreposition: "contact (dative with preposition)",
            causative: "contact (causative)",
            causativeWithPreposition: "contact (causative with preposition)",
            locative: "contact (locative)"
          }), c(e, p, {
            nominative: "Customer",
            dative: "customer (dative)",
            dativeWithPreposition: "customer (dative with preposition)",
            causative: "customer (causative)",
            causativeWithPreposition: "customer (causative with preposition)",
            locative: "customer (locative)"
          }), c(e, f, {
            nominative: "Company",
            dative: "company (dative)",
            dativeWithPreposition: "company (dative with preposition)",
            causative: "company (causative)",
            causativeWithPreposition: "company (causative with preposition)",
            locative: "company (locative)"
          }), e)[t][n]
        },
        M = function(t, e) {
          var n = {
            int: !1,
            string: !1,
            single: !1
          };
          if (i().isUndefined(n[e])) return !1;
          var r = Number(t) > APP.constant("catalog_min_id") ? APP.element_types.catalogs : t;
          return w.forEach((function(t) {
            var e = i().find(t, (function(t) {
              return t == r
            }));
            i().isUndefined(e) || (n = t)
          })), n[e]
        },
        D = function(t) {
          if (!t) throw new Error("Invalid type given: ".concat(JSON.stringify([t])));
          if (!t.id) throw new Error("Type id must be defined");
          if (t.type || (t.type = M(t.id, "string") || "catalog_elements"), i().isUndefined(t.name)) throw new Error("Type name must be defined");
          return i().pick(t, ["id", "type", "catalog_type", "name"])
        },
        T = function() {
          return APP.lang_id
        },
        N = function() {
          return APP.constant("account").helpbot_enabled
        },
        C = function() {
          var t = APP.constant("account");
          return Boolean(t && t.invoices && t.invoices.enabled)
        },
        O = function() {
          var t = APP.constant("account");
          return t && t.suppliers && t.suppliers.catalog_id || null
        },
        j = function() {
          var t = APP.constant("account");
          return t && t.products && t.products.catalog_id || null
        },
        L = function() {
          var t = APP.constant("account");
          return t && t.products && t.products.enabled || !1
        },
        z = function() {
          return APP.constant("account").version
        },
        R = function(t) {
          var e = APP.constant("account").is_contact_name_display_order_first ? i().compact([t["contact[FIRST_NAME]"], t["contact[LAST_NAME]"]]).join(" ") : i().compact([t["contact[LAST_NAME]"], t["contact[FIRST_NAME]"]]).join(" ");
          return e || (e = t["contact[NAME]"]), (0, a.contactName)(e)
        },
        U = function() {
          return "customers" === APP.constant("account").subdomain || "customersus" === APP.constant("account").subdomain
        },
        F = function() {
          return "Partner" === APP.constant("account").tariffName
        },
        W = function() {
          return APP.constant("account").pay_type === o.PayType.PAYMENT_TYPE_TRIAL
        },
        B = function() {
          return APP.constant("account").pay_type === o.PayType.PAYMENT_TYPE_BLOCK
        },
        Y = function() {
          return B && APP.constant("account").tariffName === (0, a.i18n)("REPORT_ACCOUNT_INFO_TRIAL")
        },
        V = function() {
          return (0, s.isFeatureAvailable)(s.Features.PARTNERS_HELP_AVAILABLE)
        },
        K = "../build/transpiled/utils/account/system";
      window.define(K, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([K])
    },
    445368: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, {
        capitalize: () => nt,
        catalogElementName: () => Z,
        chainedListValue: () => Q,
        changeKeysCase: () => W,
        cleanXSSContent: () => N,
        contactName: () => J,
        convertToSnake: () => ct,
        currency: () => z,
        customerName: () => X,
        escapeRegExp: () => E,
        escapeString: () => S,
        escapeTags: () => k,
        formatBillingCurrency: () => R,
        formatDate: () => _,
        formatFileSize: () => w,
        getDefaultAvatar: () => it,
        getElementUrl: () => O,
        getEntityLang: () => q,
        getEscapedEntity: () => I,
        getMoment: () => tt,
        getNumberTypeUnsorted: () => rt,
        hex2rgb: () => K,
        hex2rgba: () => $,
        i18n: () => Y,
        is12HourFormat: () => P,
        isDarkColor: () => H,
        leadName: () => G,
        mergeChatsMessages: () => st,
        numeralWord: () => C,
        parseNum: () => T,
        phone: () => v,
        plugPrice: () => U,
        prettyNumber: () => j,
        reductNumericValue: () => F,
        removeAllSymbols: () => ot,
        replaceAll: () => L,
        replaceLangPlaceholders: () => B,
        sprintf: () => at,
        stripTags: () => M,
        time: () => A,
        toTitleCase: () => V,
        transliterate: () => b,
        transliterateFileName: () => y,
        trim: () => D,
        twigFilterDate: () => x,
        unescapeHTML: () => et
      });
      var r = n(629133),
        i = n.n(r),
        o = n(161320),
        a = n.n(o),
        s = n(698302),
        c = n.n(s),
        u = n(971719),
        l = n(250202),
        d = n.n(l),
        f = n(955026),
        p = n(553542),
        m = n(577486),
        g = n(661533),
        h = new(d().AsYouTypeFormatter)(APP.constant("account").country),
        b = p.default,
        y = function(t, e) {
          return b(t).replace(/\s/gi, "_").replace(/[^\w\s]/gi, "").toLowerCase() + (e ? ".".concat(e) : "")
        },
        v = function(t) {
          var e, n, r = t;
          if ((0, f.isPhoneValid)(t))
            for (e = t.replace(/[\s-]/g, ""), h.clear(), n = 0; n < e.length; n++) r = h.inputDigit(e[n]);
          return r
        },
        w = function(t) {
          var e;
          if (t = parseInt(t), i().isNaN(t)) return "";
          if (e = "ru" === APP.lang_id ? [" Байт", " КБ", " МБ", " ГБ", " ТБ", " ПБ"] : [" Bytes", " KB", " MB", " GB", " TB", " PB"], 0 === t) return t + e[0];
          var n = parseInt(Math.floor(Math.log(t) / Math.log(1024)));
          return t /= Math.pow(1024, n), (n > 1 ? Math.round(100 * t) / 100 : Math.round(t)) + (e[n] ? e[n] : "")
        },
        _ = function(t, e, n, r) {
          var i, o, s = [],
            c = a().utc(),
            u = "".concat(APP.system.format.date.date, " ").concat(APP.system.format.date.time);
          return t ? "today" === t || "tomorrow" === t ? (r || c.set("hour", 23).set("minute", 59), c.add("tomorrow" === t ? 1 : 0, "days"), i = a()().tz(APP.system.timezone).set("year", c.get("year")).set("month", c.get("month")).set("date", c.get("date")).set("hour", c.get("hour")).set("minute", c.get("minute")), "timestamp" === e ? i : i.format(u)) : (o = "now" === t ? a()() : parseFloat(t).toString() === t.toString() ? a().unix(t).tz(APP.system.timezone) : a()(t, u), "time" !== e && (o.isSame(new Date, "day") && !0 !== n ? s.push(o.format(a()().localeData().calendar("today"))) : o.isSame(a()().add(1, "days"), "day") && !0 !== n ? s.push(o.format(a()().localeData().calendar("tomorrow"))) : o.isSame(a()().subtract(1, "days"), "day") && !0 !== n ? s.push(o.format(a()().localeData().calendar("yesterday"))) : s.push(o.format(APP.system.format.date.date))), "date" !== e && ("23:59" === o.format("HH:mm") && !0 !== n ? s.push(APP.lang.tasks_all_day.toString()) : s.push(o.format(APP.system.format.date.time))), s.join(" ")) : ""
        },
        P = function() {
          return 12 === APP.system.format.time
        },
        x = function(t, e) {
          var n, r;
          if (!t) return "";
          if ("now" === t ? n = a()() : "tomorrow" === t ? n = a()().add(1, "days") : (n = "string" == typeof t && parseInt(t).toString() !== t ? a()(t, "".concat(APP.system.format.date.date, " ").concat(APP.system.format.date.time)) : a().utc(t, "X").tz(APP.system.timezone)).isValid() || (n = "short" === e ? a()(t, APP.system.format.date.date) : "full_date_dash" === e ? a()(t, "YYYY-MM-DD HH:mm:ss") : "date_dash" === e ? a()(t, "YYYY-MM-DD") : a()(t, "DD.MM.YYYY HH:mm:ss")), e) {
            if (r = APP.system.format.date, i().contains(["full_date", "full_date_dash"], e) && (e = "full"), "date_dash" === e && (e = "date"), "timestamp" === e) return n.format("X");
            if ("date_short" === e && n.format("YYYY") !== a()().format("YYYY") && (e = "short"), "short" === e) return n.format(r.date);
            if (r[e]) return n.format(r[e])
          }
          return n.calendar()
        },
        A = function(t, e) {
          if (e = e || 0, !t) return "";
          var n, r = Math.floor(t / 60);
          return t < 60 ? (r = "00", n = parseInt(t)) : (r = parseInt(r), n = parseInt(t - 60 * r), r < 10 ? r = "0".concat(r) : r > 100 && 1 !== e && (r = A(r, 1))), r + (n < 10 ? ":0" : ":") + n
        },
        k = function(t) {
          return (t || "").toString().replace(/[<]/gi, "&lt;").replace(/[>]/gi, "&gt;")
        },
        E = function(t) {
          return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        },
        S = function(t) {
          return t.replace(/[&<>"']/g, (function(t) {
            return t.startsWith("&") ? t : (e = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&apos;"
            }, t.replace(/[&<>"']/g, (function(t) {
              return e[t]
            })));
            var e
          }))
        },
        I = function(t) {
          switch (!0) {
            case i().isString(t):
              return (0, f.isStringUnescaped)(t) ? S(t) : t;
            case i().isArray(t):
              return i().map(t, I);
            case i().isObject(t):
              return i().mapObject(t, I);
            default:
              return t
          }
        },
        M = function(t) {
          return (t || "").toString().replace(/<\/?[^>]+>/gi, "")
        },
        D = function(t) {
          return (t || "").toString().replace(/^\s+|\s+$/g, "")
        },
        T = function(t) {
          var e = parseFloat(i().isString(t) ? t.replace(",", ".") : t);
          return isNaN(e) ? 0 : e
        },
        N = function(t) {
          var e = {
            onIgnoreTagAttr: function(t, e, n) {
              if ("style" === e) return e + '="' + (0, u.escapeAttrValue)(n) + '"'
            }
          };
          return (0, u.filterXSS)(t, e)
        },
        C = function(t, e, n) {
          var r, o, a;
          if (!e) return "";
          var s = e.toString().split(",");
          if ("ru" === APP.lang_id) switch (a = (o = Math.abs(t) % 100) % 10, !0) {
            case "all" === t:
              r = s[3];
              break;
            case o > 10 && o < 20:
              r = s[2];
              break;
            case a > 1 && a < 5:
              r = s[1];
              break;
            case 1 === a:
              r = s[0];
              break;
            default:
              r = s[2]
          } else switch (!0) {
            case "all" === t:
              r = i().isEmpty(s[2]) ? s[1] : s[2];
              break;
            case 1 !== t:
              r = s[1];
              break;
            default:
              r = s[0]
          }
          return !0 === n && (r = "".concat(t, " ").concat(r)), r
        },
        O = function(t, e) {
          return "/".concat(i().invert(APP.element_types)[t], "/detail/").concat(e)
        },
        j = function(t) {
          var e, n, r = "",
            o = !1,
            a = (t = null === t || i().isUndefined(t) ? 0 : "".concat(t)).length;
          if (!a) return t;
          for ((e = a % 3) && (o = !0), n = 1; n <= a; n++) r += t[n - 1], n < a && (o ? e === n && (r += " ", o = !1) : n % 3 - e == 0 && (r += " "));
          return r
        },
        L = function(t, e, n) {
          return (n || "").replace(new m.UnsafeRegExp(t, "g"), e)
        },
        z = function(t, e, n, r, o) {
          var a, s, u, l = "",
            d = APP.lang.currency_class.reductions,
            f = 0,
            p = i().propertyOf(APP.constant("currencies_used"));
          n = n || 0, i().isString(r) && p(r) && (r = p(r)), u = i().extend({}, i().pick(APP.system.locale, "currency_symbol", "currency_pattern", "mon_thousands_sep", "mon_decimal_point"), r || {});
          var m = !i().isUndefined(r) && i().isString(r) ? r : u.currency_symbol;
          if (e = !i().isUndefined(e) && e ? "" : m, (o = o ? parseInt(o) : 0) >= 3) {
            switch (a = "".concat(parseInt(t)).length, !0) {
              case a > o + 6:
                f = 9, l = " ".concat(d.billions);
                break;
              case a > o + 3:
                f = 6, l = " ".concat(d.millions);
                break;
              case a > o:
                f = 3, l = " ".concat(d.thousands)
            }
            f > 0 && (t /= Math.pow(10, f))
          }
          return t = parseFloat(t), t = Math.round(t * Math.pow(10, n)) / Math.pow(10, n), s = u.currency_pattern, l && (s = s.replace("%v", "%v".concat(l))), c().formatMoney(t, {
            symbol: e,
            precision: i().isUndefined(n) ? 0 : n,
            thousand: u.mon_thousands_sep,
            decimal: u.mon_decimal_point,
            format: {
              pos: s,
              neg: "-".concat(s),
              zero: s
            }
          })
        },
        R = function(t, e) {
          var n = "%v %s",
            r = i().propertyOf(APP.constant("currencies_used"));
          i().isString(e) && r(e) && (e = r(e));
          var o = i().extend({}, i().pick(APP.system.locale, "currency_symbol", "currency_pattern", "mon_thousands_sep", "mon_decimal_point"), e || {}),
            a = !i().isUndefined(e) && i().isString(e) ? e : o.currency_symbol;
          return t = parseFloat(t), c().formatMoney(t, {
            symbol: a,
            precision: 0,
            thousand: " ",
            decimal: ".",
            format: {
              pos: n,
              neg: "-".concat(n),
              zero: n
            }
          })
        },
        U = function() {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 3,
            e = "".concat(z(new Array(++t).join("1")));
          return L("1", "0", e)
        },
        F = function() {
          var t, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            n = e.value || 0,
            r = e.max_value || 99999999,
            i = APP.lang.currency_class.reductions,
            o = "",
            a = "",
            s = [],
            c = 0,
            u = APP.system.locale.currency_symbol;
          if (n) {
            if (t = a = j(n), s = a.split(" "), n > r && (((c = +(n / Math.pow(1e3, s.length - 1)).toFixed(1)) == +s[0] || e.round_value) && (c = c.toFixed()), t = c, !e.is_plain_number)) switch (s.length) {
              case 2:
                o = i.thousands;
                break;
              case 3:
                o = i.millions;
                break;
              case 4:
                o = i.billions;
                break;
              default:
                t = a
            }
            o && (t += " ".concat(o))
          } else t = "0";
          return e.is_currency && (t += " ".concat(u)), t
        },
        W = function(t, e) {
          var n = {};
          return i().each(t, (function(t, r) {
            var o = "upper" === e ? r.toString().toUpperCase() : r.toString().toLowerCase();
            i().isObject(t) ? n[o] = W(t, e) : i().isArray(t) ? n[o] = i().map(t, (function(t) {
              W(t, e)
            })) : n[o] = t
          })), n
        },
        B = function(t) {
          return t.replace(/{{.+?}}/g, (function(t) {
            var e = t.includes("brand_name") ? APP.constant("global_brand_name") : APP.constant("entity_names");
            return i().isUndefined(e[t]) ? t : e[t]
          }))
        },
        Y = function(t) {
          var e = t;
          return i().isString(t) && (t = APP.lang[t] || t).indexOf("{{") > -1 && (t = B(t), APP.lang[e] = t), t
        },
        V = function(t) {
          return (t || "").replace(/(\w)(\w*)/g, (function(t, e, n) {
            return e.toUpperCase() + (null === n ? "" : n)
          }))
        },
        K = function(t) {
          return [(t = String(t).lastIndexOf("#") > -1 ? t.replace(/#/, "0x") : "0x".concat(t)) >> 16, (65280 & t) >> 8, 255 & t]
        },
        $ = function(t, e) {
          var n = K(t);
          return "rgba(".concat(n[0], ", ").concat(n[1], ", ").concat(n[2], ", ").concat(e, ")")
        },
        H = function(t, e, n) {
          var r;
          return n = n || .5, "transparent" !== t && (i().isEmpty(e) && (e = K(t)), r = 299 * e[0] + 587 * e[1] + 114 * e[2], (r /= 255e3) < n)
        },
        q = function(t) {
          switch (parseInt(t)) {
            case 2:
              return Y("Lead");
            case 1:
              return Y("Contact");
            case 3:
              return Y("Company");
            case 12:
              return Y("Customer");
            case 10:
              return Y("List");
            case 24:
              return Y("Talk");
            case 4:
              return Y("Task")
          }
          return t
        },
        G = function(t, e) {
          return t || Y("Lead #") + e
        },
        X = function(t, e) {
          return t || Y("Customer #") + e
        },
        J = function(t) {
          return t || "..."
        },
        Z = function(t, e, n) {
          var r = i().propertyOf(APP.constant("account"))(["invoices", "catalog_id"]);
          return parseInt(n) === parseInt(r) ? t || "".concat(Y("Invoice"), " #").concat(e) : t
        },
        Q = function(t) {
          return t = i().sortBy(t, "position"), i().pluck(t, "name").join(" / ")
        },
        tt = function(t) {
          var e, n;
          return "string" == typeof t && parseInt(t) != t ? (n = t.match(/^\d{4}-\d{2}-\d{2}/) ? "YYYY-MM-DD HH:mm:ss" : "".concat(APP.system.format.date.date, " ").concat(APP.system.format.date.time), e = a()(t, n)) : e = a().unix(t), e
        },
        et = function(t) {
          return g("<div/>").html(t).text()
        },
        nt = function(t) {
          return t ? t.charAt(0).toUpperCase() + t.substr(1) : ""
        },
        rt = function(t) {
          return {
            sip: 1,
            mail: 2,
            forms: 3,
            chats: 4
          } [t]
        },
        it = function(t) {
          var e = parseInt(t) || 0;
          return "/frontend/images/interface/avatars/".concat(Math.abs(e % 10) + 1, ".jpeg")
        },
        ot = function(t) {
          return (t || "").replace(/[^a-zA-Z0-9 ]/g, "")
        },
        at = function(t) {
          for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
          return t.replace(/%s/g, (function() {
            return n.shift()
          }))
        },
        st = function(t) {
          var e, n = 0;
          return i().each(i().values(t), (function(t, r, o) {
            var a = t.date - n;
            return t.text = i().isArray(t.text) ? t.text : [t.text], n = t.date, t.text = i().map(t.text, (function(t) {
              return {
                type: "text",
                text: t
              }
            })), t.links ? t.links.links ? t.links = [t.links] : t.links = i().values(t.links) : t.links = [], t.data = t.links.concat(t.text), a >= 60 ? (t.prepend_date = !0, void(e = r)) : e && o[e] && o[e].manager == t.manager && a <= 10 ? (Array.prototype.push.apply(o[e].text, t.text), Array.prototype.push.apply(o[e].links, t.links), Array.prototype.push.apply(o[e].data, t.data), void(t.hide = !0)) : void(e = r)
          }))
        },
        ct = function(t) {
          if ("object" != typeof t || null === t) return t;
          var e = Array.isArray(t) ? [] : {};
          for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n.replace(/[A-Z]/g, (function(t) {
            return "_".concat(t.toLowerCase())
          }))] = "object" == typeof t[n] ? ct(t[n]) : t[n]);
          return e
        },
        ut = "../build/transpiled/utils/format/index";
      window.define(ut, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([ut])
    },
    553542: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, {
        default: () => l
      });
      var r = n(629133),
        i = n.n(r),
        o = n(577486);

      function a(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : t[e] = n, t
      }
      var s, c, u = {
        latinTranslit: {
          a: "а",
          b: "б",
          d: "д",
          e: "е",
          f: "ф",
          g: "г",
          j: "й",
          v: "в",
          zh: "ж",
          z: "з",
          i: "и",
          k: "к",
          l: "л",
          m: "м",
          n: "н",
          o: "о",
          p: "п",
          r: "р",
          s: "с",
          t: "т",
          u: "у",
          kh: "х",
          tc: "ц",
          ch: "ч",
          sh: "ш",
          shch: "щ",
          y: "ы",
          iu: "ю",
          ia: "я"
        },
        latinPunto: {
          q: "й",
          w: "ц",
          e: "у",
          r: "к",
          t: "е",
          y: "н",
          u: "г",
          i: "ш",
          o: "щ",
          p: "з",
          "[": "х",
          "]": "ъ",
          a: "ф",
          s: "ы",
          d: "в",
          f: "а",
          g: "п",
          h: "р",
          j: "о",
          k: "л",
          l: "д",
          ";": "ж",
          "'": "э",
          z: "я",
          x: "ч",
          c: "с",
          v: "м",
          b: "и",
          n: "т",
          m: "ь",
          ",": "б",
          ".": "ю"
        },
        translit: {},
        punto: {}
      };

      function l(t, e) {
        u[e] || (e = "translit");
        var n = u[e],
          r = function() {
            switch (e) {
              case "punto":
              case "translit":
                return /([а-яё])/gi;
              default:
                return new o.UnsafeRegExp("(".concat(i().keys(n).join("|"), ")"), "gi")
            }
          }();
        return (t || "").replace(r, (function(t) {
          var e = t.toLowerCase(),
            r = n[e];
          return void 0 === r ? t : e === t ? r : r.substring(0, 1).toUpperCase() + r.substring(1)
        }))
      }
      u.translit = (s = function(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {},
            r = Object.keys(n);
          "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(t) {
            return Object.getOwnPropertyDescriptor(n, t).enumerable
          })))), r.forEach((function(e) {
            a(t, e, n[e])
          }))
        }
        return t
      }({}, i().invert(u.latinTranslit)), c = null != (c = {
        ъ: "",
        ь: "",
        э: "e",
        ё: "e",
        х: "h",
        ц: "c"
      }) ? c : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(s, Object.getOwnPropertyDescriptors(c)) : function(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(t);
          n.push.apply(n, r)
        }
        return n
      }(Object(c)).forEach((function(t) {
        Object.defineProperty(s, t, Object.getOwnPropertyDescriptor(c, t))
      })), s), u.punto = i().invert(u.latinPunto);
      var d = "../build/transpiled/utils/format/transliterate";
      window.define(d, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([d])
    },
    168807: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, {
        exponentialDelay: () => u,
        password: () => l,
        randHex: () => a,
        randInt: () => c,
        randString: () => s,
        storeWithExpiration: () => d
      });
      var r = n(629821),
        i = n.n(r),
        o = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "123456789"],
        a = function() {
          return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        },
        s = function(t) {
          var e = "",
            n = 0;
          for (t = t || 4; n < t; n++) e += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" [parseInt(Math.floor(52 * Math.random()))];
          return e
        },
        c = function(t, e) {
          return Math.floor(Math.random() * (e - t + 1)) + t
        },
        u = function(t) {
          var e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).with_jitter,
            n = void 0 !== e && e,
            r = 1e3 * Math.pow(2, t);
          if (0 === t && (r = 100), n) {
            var i = u(t > 0 ? t - 1 : 0);
            r = c(r, 3 * i)
          }
          return r
        },
        l = function(t) {
          var e, n = o,
            r = "",
            i = t / 2 - 1,
            a = t - i - i;
          for (e = 0; e < i; e++) r += n[0].charAt(Math.floor(Math.random() * n[0].length));
          for (e = 0; e < i; e++) r += n[1].charAt(Math.floor(Math.random() * n[1].length));
          for (e = 0; e < a; e++) r += n[2].charAt(Math.floor(Math.random() * n[2].length));
          return r.split("").sort((function() {
            return .5 - Math.random()
          })).join("")
        },
        d = {
          set: function(t, e, n) {
            i().set(t, {
              val: e,
              exp: n,
              time: (new Date).getTime()
            })
          },
          get: function(t) {
            var e = i().get(t);
            return !e || (new Date).getTime() - e.time > e.exp ? null : e.val
          },
          get_created_at: function(t) {
            var e = i().get(t);
            return !e || (new Date).getTime() - e.time > e.exp ? null : e.time
          },
          remove: function(t) {
            i().remove(t)
          }
        },
        f = "../build/transpiled/utils/generator";
      window.define(f, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([f])
    },
    955026: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, {
        EMAIL_REGEX: () => d,
        IS_DIGITS_REGEX: () => v,
        PROTOCOL_REGEX: () => f,
        cleanResponse: () => W,
        endsWith: () => I,
        getDigitsOnly: () => q,
        getWidgetCallbacks: () => $,
        hasKeys: () => U,
        isBase64: () => K,
        isCharacterEventKeyPress: () => F,
        isDev: () => Y,
        isDigit: () => x,
        isKommoPasswordValid: () => N,
        isNegativeNumber: () => z,
        isOnlyLatinCharNum: () => j,
        isOnlyLetters: () => L,
        isPhoneValid: () => T,
        isRuPasswordValid: () => C,
        isStringUnescaped: () => R,
        isV3Design: () => V,
        isValidEmail: () => M,
        isValidEmailForSending: () => D,
        isValidIdpCertificate: () => O,
        isValidPinfl: () => H,
        isValidSimpleUrl: () => E,
        isValidStrictUrl: () => k,
        isValidUrl: () => A,
        isValidUrlProtocol: () => S,
        replaceBoolean: () => B
      });
      var r, i, o = n(629133),
        a = n.n(o),
        s = n(544621),
        c = n.n(s),
        u = n(661533),
        l = void 0,
        d = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,15}(?:\.[a-z]{2,15})?)$/i,
        f = /^(?:(?:https?|ftp):\/\/)(.+)?$/i,
        p = /^((https?|ftp):\/\/)?(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([\w\d-_.]+)\.([\w\d]{2,}))|(localhost))([?#/].*)?$/,
        m = /\w+(?=\.(?:amocrm2\.saas|kommo2\.com))/,
        g = /^([\w-+]+(?:\.[\w-]+)*)(\.)?@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,11}(?:\.[a-z]{2,11})?)$/i,
        h = RegExp("^(?=.*[\\p{Ll}])(?=.*[\\p{Lu}])(?=.*\\d)(?=.*[\\W_]).{8,}$", "u"),
        b = /^-----BEGIN CERTIFICATE-----[\s\S]*-----END CERTIFICATE-----$/,
        y = /^[a-zA-Z0-9!@#$%^&*()_+=[\]{}|\\;',./?:\-`~<>]+$/,
        v = /\d/g,
        w = RegExp("[\\p{L}]", "u"),
        _ = [7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1, 7],
        P = /^-\d+(\.\d+)?$/,
        x = function(t) {
          return /^\d+$/.test(t)
        },
        A = function(t) {
          return c()({
            exact: !0
          }).test(t)
        },
        k = function(t) {
          return c()({
            exact: !0,
            strict: !0
          }).test(t)
        },
        E = function(t) {
          return p.test(t)
        },
        S = function(t) {
          return f.test(t)
        },
        I = function() {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
            e = arguments.length > 1 ? arguments[1] : void 0;
          return -1 !== t.indexOf(e, t.length - e.length)
        },
        M = function() {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
          return d.test(t.toString().trim())
        },
        D = function() {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
          return g.test(t.toString().trim())
        },
        T = function(t) {
          return /^\+?[\d]+$/.test(t)
        },
        N = function(t) {
          return h.test(t)
        },
        C = function(t) {
          return t.length >= 6
        },
        O = function(t) {
          return b.test(t)
        },
        j = function(t) {
          return y.test(t)
        },
        L = function(t) {
          return w.test(t)
        },
        z = function(t) {
          return P.test(t)
        },
        R = function(t) {
          var e = t.match(/(&[a-z]+;|<[^>]+>)/g);
          return !!e && a().some(e, (function(t) {
            return !(t.startsWith("&") || "<" === t || ">" === t)
          }))
        },
        U = function(t, e) {
          var n = !0,
            r = a().clone(t);
          return a().each(e, (function(t) {
            (n = n && a().has(r, t)) && (r = a().clone(r[t]))
          })), n
        },
        F = function(t) {
          return "number" == typeof t.which && t.which > 0 && !t.ctrlKey && !t.metaKey && !t.altKey && 8 !== t.which
        },
        W = function() {
          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          return t.responseJSON && (t = t.responseJSON), t.response && (t = t.response), t
        },
        B = function(t) {
          return a().isBoolean(t) ? t ? "Y" : "N" : a().isArray(t) ? a().map(t, (function(t) {
            return B(t)
          }), l) : a().isObject(t) ? a().mapObject(t, (function(t) {
            return B(t)
          }), l) : t
        },
        Y = function() {
          var t = a().first(window.location.origin.match(m));
          return "dev" === APP.environment || "main6" === t
        },
        V = (r = ["leads", "customers", "contacts", "dashboard", "todo", "catalogs", "mail", "widgetsSettings", "files", "events", "settings"], i = ["settings-users", "settings-communications"], function() {
          return a().include(r, APP.getBaseEntity()) || a().include(i, APP.data.current_entity)
        }),
        K = function(t) {
          return !!t.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+,;=\-._~:@/?%\s]*\s*$/i)
        },
        $ = function(t) {
          if (APP.widgets.list && APP.widgets.list[t] && APP.widgets.list[t].callbacks) return APP.widgets.list[t].callbacks
        },
        H = function(t) {
          var e = u.trim(t);
          return 14 === e.length && !a().isNaN(Number(e)) && a().reduce(_, (function(t, n, r) {
            return t + n * Number(e[r])
          }), 0) % 10 === parseInt(e.charAt(13))
        },
        q = function(t) {
          return t.match(v) || []
        },
        G = "../build/transpiled/utils/tester";
      window.define(G, (function() {
        var t = "undefined",
          n = typeof e === t ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === t ? typeof module === t ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : e;
        return n && n.default || n
      })), window.require([G])
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
      e && (t._sentryDebugIds = t._sentryDebugIds || {}, t._sentryDebugIds[e] = "ffebd251-715b-4904-8d38-082cf0290070", t._sentryDebugIdIdentifier = "sentry-dbid-ffebd251-715b-4904-8d38-082cf0290070")
    } catch (t) {}
  }();
//# sourceMappingURL=19975.77f28d002150844c3f10.js.map