"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [35534], {
    589531: (e, n, t) => {
      t.r(n), t.d(n, {
        attention: () => r.attention,
        autolink: () => i.autolink,
        blankLine: () => c.blankLine,
        blockQuote: () => o.blockQuote,
        characterEscape: () => u.characterEscape,
        characterReference: () => a.characterReference,
        codeFenced: () => s.codeFenced,
        codeIndented: () => l.codeIndented,
        codeText: () => f.codeText,
        content: () => d.content,
        definition: () => m.definition,
        hardBreakEscape: () => h.hardBreakEscape,
        headingAtx: () => p.headingAtx,
        htmlFlow: () => g.htmlFlow,
        htmlText: () => k.htmlText,
        labelEnd: () => x.labelEnd,
        labelStartImage: () => S.labelStartImage,
        labelStartLink: () => y.labelStartLink,
        lineEnding: () => w.lineEnding,
        list: () => E.list,
        setextUnderline: () => b.setextUnderline,
        thematicBreak: () => v.thematicBreak
      });
      var r = t(498415),
        i = t(887444),
        c = t(352929),
        o = t(67207),
        u = t(101687),
        a = t(172810),
        s = t(4678),
        l = t(682535),
        f = t(735180),
        d = t(706814),
        m = t(284882),
        h = t(896100),
        p = t(695528),
        g = t(247453),
        k = t(595890),
        x = t(678966),
        S = t(755365),
        y = t(735856),
        w = t(400890),
        E = t(84618),
        b = t(146263),
        v = t(88038)
    },
    498415: (e, n, t) => {
      t.r(n), t.d(n, {
        attention: () => o
      });
      var r = t(158300),
        i = t(173886),
        c = t(563879);
      const o = {
        name: "attention",
        resolveAll: function(e, n) {
          let t, i, o, a, s, l, f, d, m = -1;
          for (; ++m < e.length;)
            if ("enter" === e[m][0] && "attentionSequence" === e[m][1].type && e[m][1]._close)
              for (t = m; t--;)
                if ("exit" === e[t][0] && "attentionSequence" === e[t][1].type && e[t][1]._open && n.sliceSerialize(e[t][1]).charCodeAt(0) === n.sliceSerialize(e[m][1]).charCodeAt(0)) {
                  if ((e[t][1]._close || e[m][1]._open) && (e[m][1].end.offset - e[m][1].start.offset) % 3 && !((e[t][1].end.offset - e[t][1].start.offset + e[m][1].end.offset - e[m][1].start.offset) % 3)) continue;
                  l = e[t][1].end.offset - e[t][1].start.offset > 1 && e[m][1].end.offset - e[m][1].start.offset > 1 ? 2 : 1;
                  const h = {
                      ...e[t][1].end
                    },
                    p = {
                      ...e[m][1].start
                    };
                  u(h, -l), u(p, l), a = {
                    type: l > 1 ? "strongSequence" : "emphasisSequence",
                    start: h,
                    end: {
                      ...e[t][1].end
                    }
                  }, s = {
                    type: l > 1 ? "strongSequence" : "emphasisSequence",
                    start: {
                      ...e[m][1].start
                    },
                    end: p
                  }, o = {
                    type: l > 1 ? "strongText" : "emphasisText",
                    start: {
                      ...e[t][1].end
                    },
                    end: {
                      ...e[m][1].start
                    }
                  }, i = {
                    type: l > 1 ? "strong" : "emphasis",
                    start: {
                      ...a.start
                    },
                    end: {
                      ...s.end
                    }
                  }, e[t][1].end = {
                    ...a.start
                  }, e[m][1].start = {
                    ...s.end
                  }, f = [], e[t][1].end.offset - e[t][1].start.offset && (f = (0, r.push)(f, [
                    ["enter", e[t][1], n],
                    ["exit", e[t][1], n]
                  ])), f = (0, r.push)(f, [
                    ["enter", i, n],
                    ["enter", a, n],
                    ["exit", a, n],
                    ["enter", o, n]
                  ]), f = (0, r.push)(f, (0, c.resolveAll)(n.parser.constructs.insideSpan.null, e.slice(t + 1, m), n)), f = (0, r.push)(f, [
                    ["exit", o, n],
                    ["enter", s, n],
                    ["exit", s, n],
                    ["exit", i, n]
                  ]), e[m][1].end.offset - e[m][1].start.offset ? (d = 2, f = (0, r.push)(f, [
                    ["enter", e[m][1], n],
                    ["exit", e[m][1], n]
                  ])) : d = 0, (0, r.splice)(e, t - 1, m - t + 3, f), m = t + f.length - d - 2;
                  break
                } for (m = -1; ++m < e.length;) "attentionSequence" === e[m][1].type && (e[m][1].type = "data");
          return e
        },
        tokenize: function(e, n) {
          const t = this.parser.constructs.attentionMarkers.null,
            r = this.previous,
            c = (0, i.classifyCharacter)(r);
          let o;
          return function(n) {
            return o = n, e.enter("attentionSequence"), u(n)
          };

          function u(a) {
            if (a === o) return e.consume(a), u;
            const s = e.exit("attentionSequence"),
              l = (0, i.classifyCharacter)(a),
              f = !l || 2 === l && c || t.includes(a),
              d = !c || 2 === c && l || t.includes(r);
            return s._open = Boolean(42 === o ? f : f && (c || !d)), s._close = Boolean(42 === o ? d : d && (l || !f)), n(a)
          }
        }
      };

      function u(e, n) {
        e.column += n, e.offset += n, e._bufferIndex += n
      }
    },
    887444: (e, n, t) => {
      t.r(n), t.d(n, {
        autolink: () => i
      });
      var r = t(576781);
      const i = {
        name: "autolink",
        tokenize: function(e, n, t) {
          let i = 0;
          return function(n) {
            return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(n), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), c
          };

          function c(n) {
            return (0, r.asciiAlpha)(n) ? (e.consume(n), o) : 64 === n ? t(n) : s(n)
          }

          function o(e) {
            return 43 === e || 45 === e || 46 === e || (0, r.asciiAlphanumeric)(e) ? (i = 1, u(e)) : s(e)
          }

          function u(n) {
            return 58 === n ? (e.consume(n), i = 0, a) : (43 === n || 45 === n || 46 === n || (0, r.asciiAlphanumeric)(n)) && i++ < 32 ? (e.consume(n), u) : (i = 0, s(n))
          }

          function a(i) {
            return 62 === i ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(i), e.exit("autolinkMarker"), e.exit("autolink"), n) : null === i || 32 === i || 60 === i || (0, r.asciiControl)(i) ? t(i) : (e.consume(i), a)
          }

          function s(n) {
            return 64 === n ? (e.consume(n), l) : (0, r.asciiAtext)(n) ? (e.consume(n), s) : t(n)
          }

          function l(e) {
            return (0, r.asciiAlphanumeric)(e) ? f(e) : t(e)
          }

          function f(t) {
            return 46 === t ? (e.consume(t), i = 0, l) : 62 === t ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(t), e.exit("autolinkMarker"), e.exit("autolink"), n) : d(t)
          }

          function d(n) {
            if ((45 === n || (0, r.asciiAlphanumeric)(n)) && i++ < 63) {
              const t = 45 === n ? d : f;
              return e.consume(n), t
            }
            return t(n)
          }
        }
      }
    },
    352929: (e, n, t) => {
      t.r(n), t.d(n, {
        blankLine: () => c
      });
      var r = t(474014),
        i = t(576781);
      const c = {
        partial: !0,
        tokenize: function(e, n, t) {
          return function(n) {
            return (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, c, "linePrefix")(n) : c(n)
          };

          function c(e) {
            return null === e || (0, i.markdownLineEnding)(e) ? n(e) : t(e)
          }
        }
      }
    },
    67207: (e, n, t) => {
      t.r(n), t.d(n, {
        blockQuote: () => c
      });
      var r = t(474014),
        i = t(576781);
      const c = {
        continuation: {
          tokenize: function(e, n, t) {
            const o = this;
            return function(n) {
              return (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, u, "linePrefix", o.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(n) : u(n)
            };

            function u(r) {
              return e.attempt(c, n, t)(r)
            }
          }
        },
        exit: function(e) {
          e.exit("blockQuote")
        },
        name: "blockQuote",
        tokenize: function(e, n, t) {
          const r = this;
          return function(n) {
            if (62 === n) {
              const t = r.containerState;
              return t.open || (e.enter("blockQuote", {
                _container: !0
              }), t.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(n), e.exit("blockQuoteMarker"), c
            }
            return t(n)
          };

          function c(t) {
            return (0, i.markdownSpace)(t) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(t), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), n) : (e.exit("blockQuotePrefix"), n(t))
          }
        }
      }
    },
    101687: (e, n, t) => {
      t.r(n), t.d(n, {
        characterEscape: () => i
      });
      var r = t(576781);
      const i = {
        name: "characterEscape",
        tokenize: function(e, n, t) {
          return function(n) {
            return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(n), e.exit("escapeMarker"), i
          };

          function i(i) {
            return (0, r.asciiPunctuation)(i) ? (e.enter("characterEscapeValue"), e.consume(i), e.exit("characterEscapeValue"), e.exit("characterEscape"), n) : t(i)
          }
        }
      }
    },
    172810: (e, n, t) => {
      t.r(n), t.d(n, {
        characterReference: () => c
      });
      var r = t(269477),
        i = t(576781);
      const c = {
        name: "characterReference",
        tokenize: function(e, n, t) {
          const c = this;
          let o, u, a = 0;
          return function(n) {
            return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(n), e.exit("characterReferenceMarker"), s
          };

          function s(n) {
            return 35 === n ? (e.enter("characterReferenceMarkerNumeric"), e.consume(n), e.exit("characterReferenceMarkerNumeric"), l) : (e.enter("characterReferenceValue"), o = 31, u = i.asciiAlphanumeric, f(n))
          }

          function l(n) {
            return 88 === n || 120 === n ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(n), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), o = 6, u = i.asciiHexDigit, f) : (e.enter("characterReferenceValue"), o = 7, u = i.asciiDigit, f(n))
          }

          function f(s) {
            if (59 === s && a) {
              const o = e.exit("characterReferenceValue");
              return u !== i.asciiAlphanumeric || (0, r.decodeNamedCharacterReference)(c.sliceSerialize(o)) ? (e.enter("characterReferenceMarker"), e.consume(s), e.exit("characterReferenceMarker"), e.exit("characterReference"), n) : t(s)
            }
            return u(s) && a++ < o ? (e.consume(s), f) : t(s)
          }
        }
      }
    },
    4678: (e, n, t) => {
      t.r(n), t.d(n, {
        codeFenced: () => o
      });
      var r = t(474014),
        i = t(576781);
      const c = {
          partial: !0,
          tokenize: function(e, n, t) {
            const r = this;
            return function(n) {
              return null === n ? t(n) : (e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), i)
            };

            function i(e) {
              return r.parser.lazy[r.now().line] ? t(e) : n(e)
            }
          }
        },
        o = {
          concrete: !0,
          name: "codeFenced",
          tokenize: function(e, n, t) {
            const o = this,
              u = {
                partial: !0,
                tokenize: function(e, n, t) {
                  let c = 0;
                  return function(n) {
                    return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), u
                  };

                  function u(n) {
                    return e.enter("codeFencedFence"), (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, s, "linePrefix", o.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(n) : s(n)
                  }

                  function s(n) {
                    return n === a ? (e.enter("codeFencedFenceSequence"), f(n)) : t(n)
                  }

                  function f(n) {
                    return n === a ? (c++, e.consume(n), f) : c >= l ? (e.exit("codeFencedFenceSequence"), (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, d, "whitespace")(n) : d(n)) : t(n)
                  }

                  function d(r) {
                    return null === r || (0, i.markdownLineEnding)(r) ? (e.exit("codeFencedFence"), n(r)) : t(r)
                  }
                }
              };
            let a, s = 0,
              l = 0;
            return function(n) {
              return function(n) {
                const t = o.events[o.events.length - 1];
                return s = t && "linePrefix" === t[1].type ? t[2].sliceSerialize(t[1], !0).length : 0, a = n, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), f(n)
              }(n)
            };

            function f(n) {
              return n === a ? (l++, e.consume(n), f) : l < 3 ? t(n) : (e.exit("codeFencedFenceSequence"), (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, d, "whitespace")(n) : d(n))
            }

            function d(t) {
              return null === t || (0, i.markdownLineEnding)(t) ? (e.exit("codeFencedFence"), o.interrupt ? n(t) : e.check(c, g, w)(t)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
                contentType: "string"
              }), m(t))
            }

            function m(n) {
              return null === n || (0, i.markdownLineEnding)(n) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), d(n)) : (0, i.markdownSpace)(n) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), (0, r.factorySpace)(e, h, "whitespace")(n)) : 96 === n && n === a ? t(n) : (e.consume(n), m)
            }

            function h(n) {
              return null === n || (0, i.markdownLineEnding)(n) ? d(n) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
                contentType: "string"
              }), p(n))
            }

            function p(n) {
              return null === n || (0, i.markdownLineEnding)(n) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), d(n)) : 96 === n && n === a ? t(n) : (e.consume(n), p)
            }

            function g(n) {
              return e.attempt(u, w, k)(n)
            }

            function k(n) {
              return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), x
            }

            function x(n) {
              return s > 0 && (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, S, "linePrefix", s + 1)(n) : S(n)
            }

            function S(n) {
              return null === n || (0, i.markdownLineEnding)(n) ? e.check(c, g, w)(n) : (e.enter("codeFlowValue"), y(n))
            }

            function y(n) {
              return null === n || (0, i.markdownLineEnding)(n) ? (e.exit("codeFlowValue"), S(n)) : (e.consume(n), y)
            }

            function w(t) {
              return e.exit("codeFenced"), n(t)
            }
          }
        }
    },
    682535: (e, n, t) => {
      t.r(n), t.d(n, {
        codeIndented: () => c
      });
      var r = t(474014),
        i = t(576781);
      const c = {
          name: "codeIndented",
          tokenize: function(e, n, t) {
            const c = this;
            return function(n) {
              return e.enter("codeIndented"), (0, r.factorySpace)(e, u, "linePrefix", 5)(n)
            };

            function u(e) {
              const n = c.events[c.events.length - 1];
              return n && "linePrefix" === n[1].type && n[2].sliceSerialize(n[1], !0).length >= 4 ? a(e) : t(e)
            }

            function a(n) {
              return null === n ? l(n) : (0, i.markdownLineEnding)(n) ? e.attempt(o, a, l)(n) : (e.enter("codeFlowValue"), s(n))
            }

            function s(n) {
              return null === n || (0, i.markdownLineEnding)(n) ? (e.exit("codeFlowValue"), a(n)) : (e.consume(n), s)
            }

            function l(t) {
              return e.exit("codeIndented"), n(t)
            }
          }
        },
        o = {
          partial: !0,
          tokenize: function(e, n, t) {
            const c = this;
            return o;

            function o(n) {
              return c.parser.lazy[c.now().line] ? t(n) : (0, i.markdownLineEnding)(n) ? (e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), o) : (0, r.factorySpace)(e, u, "linePrefix", 5)(n)
            }

            function u(e) {
              const r = c.events[c.events.length - 1];
              return r && "linePrefix" === r[1].type && r[2].sliceSerialize(r[1], !0).length >= 4 ? n(e) : (0, i.markdownLineEnding)(e) ? o(e) : t(e)
            }
          }
        }
    },
    735180: (e, n, t) => {
      t.r(n), t.d(n, {
        codeText: () => i
      });
      var r = t(576781);
      const i = {
        name: "codeText",
        previous: function(e) {
          return 96 !== e || "characterEscape" === this.events[this.events.length - 1][1].type
        },
        resolve: function(e) {
          let n, t, r = e.length - 4,
            i = 3;
          if (!("lineEnding" !== e[i][1].type && "space" !== e[i][1].type || "lineEnding" !== e[r][1].type && "space" !== e[r][1].type))
            for (n = i; ++n < r;)
              if ("codeTextData" === e[n][1].type) {
                e[i][1].type = "codeTextPadding", e[r][1].type = "codeTextPadding", i += 2, r -= 2;
                break
              } for (n = i - 1, r++; ++n <= r;) void 0 === t ? n !== r && "lineEnding" !== e[n][1].type && (t = n) : n !== r && "lineEnding" !== e[n][1].type || (e[t][1].type = "codeTextData", n !== t + 2 && (e[t][1].end = e[n - 1][1].end, e.splice(t + 2, n - t - 2), r -= n - t - 2, n = t + 2), t = void 0);
          return e
        },
        tokenize: function(e, n, t) {
          let i, c, o = 0;
          return function(n) {
            return e.enter("codeText"), e.enter("codeTextSequence"), u(n)
          };

          function u(n) {
            return 96 === n ? (e.consume(n), o++, u) : (e.exit("codeTextSequence"), a(n))
          }

          function a(n) {
            return null === n ? t(n) : 32 === n ? (e.enter("space"), e.consume(n), e.exit("space"), a) : 96 === n ? (c = e.enter("codeTextSequence"), i = 0, l(n)) : (0, r.markdownLineEnding)(n) ? (e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), a) : (e.enter("codeTextData"), s(n))
          }

          function s(n) {
            return null === n || 32 === n || 96 === n || (0, r.markdownLineEnding)(n) ? (e.exit("codeTextData"), a(n)) : (e.consume(n), s)
          }

          function l(t) {
            return 96 === t ? (e.consume(t), i++, l) : i === o ? (e.exit("codeTextSequence"), e.exit("codeText"), n(t)) : (c.type = "codeTextData", s(t))
          }
        }
      }
    },
    706814: (e, n, t) => {
      t.r(n), t.d(n, {
        content: () => o
      });
      var r = t(474014),
        i = t(576781),
        c = t(172988);
      const o = {
          resolve: function(e) {
            return (0, c.subtokenize)(e), e
          },
          tokenize: function(e, n) {
            let t;
            return function(n) {
              return e.enter("content"), t = e.enter("chunkContent", {
                contentType: "content"
              }), r(n)
            };

            function r(n) {
              return null === n ? c(n) : (0, i.markdownLineEnding)(n) ? e.check(u, o, c)(n) : (e.consume(n), r)
            }

            function c(t) {
              return e.exit("chunkContent"), e.exit("content"), n(t)
            }

            function o(n) {
              return e.consume(n), e.exit("chunkContent"), t.next = e.enter("chunkContent", {
                contentType: "content",
                previous: t
              }), t = t.next, r
            }
          }
        },
        u = {
          partial: !0,
          tokenize: function(e, n, t) {
            const c = this;
            return function(n) {
              return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), (0, r.factorySpace)(e, o, "linePrefix")
            };

            function o(r) {
              if (null === r || (0, i.markdownLineEnding)(r)) return t(r);
              const o = c.events[c.events.length - 1];
              return !c.parser.constructs.disable.null.includes("codeIndented") && o && "linePrefix" === o[1].type && o[2].sliceSerialize(o[1], !0).length >= 4 ? n(r) : e.interrupt(c.parser.constructs.flow, t, n)(r)
            }
          }
        }
    },
    284882: (e, n, t) => {
      t.r(n), t.d(n, {
        definition: () => l
      });
      var r = t(880917),
        i = t(147504),
        c = t(474014),
        o = t(801559),
        u = t(46096),
        a = t(576781),
        s = t(262493);
      const l = {
          name: "definition",
          tokenize: function(e, n, t) {
            const o = this;
            let l;
            return function(n) {
              return e.enter("definition"),
                function(n) {
                  return i.factoryLabel.call(o, e, d, t, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(n)
                }(n)
            };

            function d(n) {
              return l = (0, s.normalizeIdentifier)(o.sliceSerialize(o.events[o.events.length - 1][1]).slice(1, -1)), 58 === n ? (e.enter("definitionMarker"), e.consume(n), e.exit("definitionMarker"), m) : t(n)
            }

            function m(n) {
              return (0, a.markdownLineEndingOrSpace)(n) ? (0, u.factoryWhitespace)(e, h)(n) : h(n)
            }

            function h(n) {
              return (0, r.factoryDestination)(e, p, t, "definitionDestination", "definitionDestinationLiteral", "definitionDestinationLiteralMarker", "definitionDestinationRaw", "definitionDestinationString")(n)
            }

            function p(n) {
              return e.attempt(f, g, g)(n)
            }

            function g(n) {
              return (0, a.markdownSpace)(n) ? (0, c.factorySpace)(e, k, "whitespace")(n) : k(n)
            }

            function k(r) {
              return null === r || (0, a.markdownLineEnding)(r) ? (e.exit("definition"), o.parser.defined.push(l), n(r)) : t(r)
            }
          }
        },
        f = {
          partial: !0,
          tokenize: function(e, n, t) {
            return function(n) {
              return (0, a.markdownLineEndingOrSpace)(n) ? (0, u.factoryWhitespace)(e, r)(n) : t(n)
            };

            function r(n) {
              return (0, o.factoryTitle)(e, i, t, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(n)
            }

            function i(n) {
              return (0, a.markdownSpace)(n) ? (0, c.factorySpace)(e, s, "whitespace")(n) : s(n)
            }

            function s(e) {
              return null === e || (0, a.markdownLineEnding)(e) ? n(e) : t(e)
            }
          }
        }
    },
    896100: (e, n, t) => {
      t.r(n), t.d(n, {
        hardBreakEscape: () => i
      });
      var r = t(576781);
      const i = {
        name: "hardBreakEscape",
        tokenize: function(e, n, t) {
          return function(n) {
            return e.enter("hardBreakEscape"), e.consume(n), i
          };

          function i(i) {
            return (0, r.markdownLineEnding)(i) ? (e.exit("hardBreakEscape"), n(i)) : t(i)
          }
        }
      }
    },
    695528: (e, n, t) => {
      t.r(n), t.d(n, {
        headingAtx: () => o
      });
      var r = t(474014),
        i = t(576781),
        c = t(158300);
      const o = {
        name: "headingAtx",
        resolve: function(e, n) {
          let t, r, i = e.length - 2,
            o = 3;
          return "whitespace" === e[o][1].type && (o += 2), i - 2 > o && "whitespace" === e[i][1].type && (i -= 2), "atxHeadingSequence" === e[i][1].type && (o === i - 1 || i - 4 > o && "whitespace" === e[i - 2][1].type) && (i -= o + 1 === i ? 2 : 4), i > o && (t = {
            type: "atxHeadingText",
            start: e[o][1].start,
            end: e[i][1].end
          }, r = {
            type: "chunkText",
            start: e[o][1].start,
            end: e[i][1].end,
            contentType: "text"
          }, (0, c.splice)(e, o, i - o + 1, [
            ["enter", t, n],
            ["enter", r, n],
            ["exit", r, n],
            ["exit", t, n]
          ])), e
        },
        tokenize: function(e, n, t) {
          let c = 0;
          return function(n) {
            return e.enter("atxHeading"),
              function(n) {
                return e.enter("atxHeadingSequence"), o(n)
              }(n)
          };

          function o(n) {
            return 35 === n && c++ < 6 ? (e.consume(n), o) : null === n || (0, i.markdownLineEndingOrSpace)(n) ? (e.exit("atxHeadingSequence"), u(n)) : t(n)
          }

          function u(t) {
            return 35 === t ? (e.enter("atxHeadingSequence"), a(t)) : null === t || (0, i.markdownLineEnding)(t) ? (e.exit("atxHeading"), n(t)) : (0, i.markdownSpace)(t) ? (0, r.factorySpace)(e, u, "whitespace")(t) : (e.enter("atxHeadingText"), s(t))
          }

          function a(n) {
            return 35 === n ? (e.consume(n), a) : (e.exit("atxHeadingSequence"), u(n))
          }

          function s(n) {
            return null === n || 35 === n || (0, i.markdownLineEndingOrSpace)(n) ? (e.exit("atxHeadingText"), u(n)) : (e.consume(n), s)
          }
        }
      }
    },
    247453: (e, n, t) => {
      t.r(n), t.d(n, {
        htmlFlow: () => o
      });
      var r = t(576781),
        i = t(800733),
        c = t(352929);
      const o = {
          concrete: !0,
          name: "htmlFlow",
          resolveTo: function(e) {
            let n = e.length;
            for (; n-- && ("enter" !== e[n][0] || "htmlFlow" !== e[n][1].type););
            return n > 1 && "linePrefix" === e[n - 2][1].type && (e[n][1].start = e[n - 2][1].start, e[n + 1][1].start = e[n - 2][1].start, e.splice(n - 2, 2)), e
          },
          tokenize: function(e, n, t) {
            const c = this;
            let o, s, l, f, d;
            return function(n) {
              return function(n) {
                return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(n), m
              }(n)
            };

            function m(i) {
              return 33 === i ? (e.consume(i), h) : 47 === i ? (e.consume(i), s = !0, k) : 63 === i ? (e.consume(i), o = 3, c.interrupt ? n : B) : (0, r.asciiAlpha)(i) ? (e.consume(i), l = String.fromCharCode(i), x) : t(i)
            }

            function h(i) {
              return 45 === i ? (e.consume(i), o = 2, p) : 91 === i ? (e.consume(i), o = 5, f = 0, g) : (0, r.asciiAlpha)(i) ? (e.consume(i), o = 4, c.interrupt ? n : B) : t(i)
            }

            function p(r) {
              return 45 === r ? (e.consume(r), c.interrupt ? n : B) : t(r)
            }

            function g(r) {
              return r === "CDATA[".charCodeAt(f++) ? (e.consume(r), 6 === f ? c.interrupt ? n : C : g) : t(r)
            }

            function k(n) {
              return (0, r.asciiAlpha)(n) ? (e.consume(n), l = String.fromCharCode(n), x) : t(n)
            }

            function x(u) {
              if (null === u || 47 === u || 62 === u || (0, r.markdownLineEndingOrSpace)(u)) {
                const r = 47 === u,
                  a = l.toLowerCase();
                return r || s || !i.htmlRawNames.includes(a) ? i.htmlBlockNames.includes(l.toLowerCase()) ? (o = 6, r ? (e.consume(u), S) : c.interrupt ? n(u) : C(u)) : (o = 7, c.interrupt && !c.parser.lazy[c.now().line] ? t(u) : s ? y(u) : w(u)) : (o = 1, c.interrupt ? n(u) : C(u))
              }
              return 45 === u || (0, r.asciiAlphanumeric)(u) ? (e.consume(u), l += String.fromCharCode(u), x) : t(u)
            }

            function S(r) {
              return 62 === r ? (e.consume(r), c.interrupt ? n : C) : t(r)
            }

            function y(n) {
              return (0, r.markdownSpace)(n) ? (e.consume(n), y) : z(n)
            }

            function w(n) {
              return 47 === n ? (e.consume(n), z) : 58 === n || 95 === n || (0, r.asciiAlpha)(n) ? (e.consume(n), E) : (0, r.markdownSpace)(n) ? (e.consume(n), w) : z(n)
            }

            function E(n) {
              return 45 === n || 46 === n || 58 === n || 95 === n || (0, r.asciiAlphanumeric)(n) ? (e.consume(n), E) : b(n)
            }

            function b(n) {
              return 61 === n ? (e.consume(n), v) : (0, r.markdownSpace)(n) ? (e.consume(n), b) : w(n)
            }

            function v(n) {
              return null === n || 60 === n || 61 === n || 62 === n || 96 === n ? t(n) : 34 === n || 39 === n ? (e.consume(n), d = n, I) : (0, r.markdownSpace)(n) ? (e.consume(n), v) : L(n)
            }

            function I(n) {
              return n === d ? (e.consume(n), d = null, T) : null === n || (0, r.markdownLineEnding)(n) ? t(n) : (e.consume(n), I)
            }

            function L(n) {
              return null === n || 34 === n || 39 === n || 47 === n || 60 === n || 61 === n || 62 === n || 96 === n || (0, r.markdownLineEndingOrSpace)(n) ? b(n) : (e.consume(n), L)
            }

            function T(e) {
              return 47 === e || 62 === e || (0, r.markdownSpace)(e) ? w(e) : t(e)
            }

            function z(n) {
              return 62 === n ? (e.consume(n), F) : t(n)
            }

            function F(n) {
              return null === n || (0, r.markdownLineEnding)(n) ? C(n) : (0, r.markdownSpace)(n) ? (e.consume(n), F) : t(n)
            }

            function C(n) {
              return 45 === n && 2 === o ? (e.consume(n), M) : 60 === n && 1 === o ? (e.consume(n), N) : 62 === n && 4 === o ? (e.consume(n), R) : 63 === n && 3 === o ? (e.consume(n), B) : 93 === n && 5 === o ? (e.consume(n), O) : !(0, r.markdownLineEnding)(n) || 6 !== o && 7 !== o ? null === n || (0, r.markdownLineEnding)(n) ? (e.exit("htmlFlowData"), A(n)) : (e.consume(n), C) : (e.exit("htmlFlowData"), e.check(u, q, A)(n))
            }

            function A(n) {
              return e.check(a, _, q)(n)
            }

            function _(n) {
              return e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), P
            }

            function P(n) {
              return null === n || (0, r.markdownLineEnding)(n) ? A(n) : (e.enter("htmlFlowData"), C(n))
            }

            function M(n) {
              return 45 === n ? (e.consume(n), B) : C(n)
            }

            function N(n) {
              return 47 === n ? (e.consume(n), l = "", D) : C(n)
            }

            function D(n) {
              if (62 === n) {
                const t = l.toLowerCase();
                return i.htmlRawNames.includes(t) ? (e.consume(n), R) : C(n)
              }
              return (0, r.asciiAlpha)(n) && l.length < 8 ? (e.consume(n), l += String.fromCharCode(n), D) : C(n)
            }

            function O(n) {
              return 93 === n ? (e.consume(n), B) : C(n)
            }

            function B(n) {
              return 62 === n ? (e.consume(n), R) : 45 === n && 2 === o ? (e.consume(n), B) : C(n)
            }

            function R(n) {
              return null === n || (0, r.markdownLineEnding)(n) ? (e.exit("htmlFlowData"), q(n)) : (e.consume(n), R)
            }

            function q(t) {
              return e.exit("htmlFlow"), n(t)
            }
          }
        },
        u = {
          partial: !0,
          tokenize: function(e, n, t) {
            return function(r) {
              return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), e.attempt(c.blankLine, n, t)
            }
          }
        },
        a = {
          partial: !0,
          tokenize: function(e, n, t) {
            const i = this;
            return function(n) {
              return (0, r.markdownLineEnding)(n) ? (e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), c) : t(n)
            };

            function c(e) {
              return i.parser.lazy[i.now().line] ? t(e) : n(e)
            }
          }
        }
    },
    595890: (e, n, t) => {
      t.r(n), t.d(n, {
        htmlText: () => c
      });
      var r = t(474014),
        i = t(576781);
      const c = {
        name: "htmlText",
        tokenize: function(e, n, t) {
          const c = this;
          let o, u, a;
          return function(n) {
            return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(n), s
          };

          function s(n) {
            return 33 === n ? (e.consume(n), l) : 47 === n ? (e.consume(n), E) : 63 === n ? (e.consume(n), y) : (0, i.asciiAlpha)(n) ? (e.consume(n), I) : t(n)
          }

          function l(n) {
            return 45 === n ? (e.consume(n), f) : 91 === n ? (e.consume(n), u = 0, p) : (0, i.asciiAlpha)(n) ? (e.consume(n), S) : t(n)
          }

          function f(n) {
            return 45 === n ? (e.consume(n), h) : t(n)
          }

          function d(n) {
            return null === n ? t(n) : 45 === n ? (e.consume(n), m) : (0, i.markdownLineEnding)(n) ? (a = d, M(n)) : (e.consume(n), d)
          }

          function m(n) {
            return 45 === n ? (e.consume(n), h) : d(n)
          }

          function h(e) {
            return 62 === e ? P(e) : 45 === e ? m(e) : d(e)
          }

          function p(n) {
            return n === "CDATA[".charCodeAt(u++) ? (e.consume(n), 6 === u ? g : p) : t(n)
          }

          function g(n) {
            return null === n ? t(n) : 93 === n ? (e.consume(n), k) : (0, i.markdownLineEnding)(n) ? (a = g, M(n)) : (e.consume(n), g)
          }

          function k(n) {
            return 93 === n ? (e.consume(n), x) : g(n)
          }

          function x(n) {
            return 62 === n ? P(n) : 93 === n ? (e.consume(n), x) : g(n)
          }

          function S(n) {
            return null === n || 62 === n ? P(n) : (0, i.markdownLineEnding)(n) ? (a = S, M(n)) : (e.consume(n), S)
          }

          function y(n) {
            return null === n ? t(n) : 63 === n ? (e.consume(n), w) : (0, i.markdownLineEnding)(n) ? (a = y, M(n)) : (e.consume(n), y)
          }

          function w(e) {
            return 62 === e ? P(e) : y(e)
          }

          function E(n) {
            return (0, i.asciiAlpha)(n) ? (e.consume(n), b) : t(n)
          }

          function b(n) {
            return 45 === n || (0, i.asciiAlphanumeric)(n) ? (e.consume(n), b) : v(n)
          }

          function v(n) {
            return (0, i.markdownLineEnding)(n) ? (a = v, M(n)) : (0, i.markdownSpace)(n) ? (e.consume(n), v) : P(n)
          }

          function I(n) {
            return 45 === n || (0, i.asciiAlphanumeric)(n) ? (e.consume(n), I) : 47 === n || 62 === n || (0, i.markdownLineEndingOrSpace)(n) ? L(n) : t(n)
          }

          function L(n) {
            return 47 === n ? (e.consume(n), P) : 58 === n || 95 === n || (0, i.asciiAlpha)(n) ? (e.consume(n), T) : (0, i.markdownLineEnding)(n) ? (a = L, M(n)) : (0, i.markdownSpace)(n) ? (e.consume(n), L) : P(n)
          }

          function T(n) {
            return 45 === n || 46 === n || 58 === n || 95 === n || (0, i.asciiAlphanumeric)(n) ? (e.consume(n), T) : z(n)
          }

          function z(n) {
            return 61 === n ? (e.consume(n), F) : (0, i.markdownLineEnding)(n) ? (a = z, M(n)) : (0, i.markdownSpace)(n) ? (e.consume(n), z) : L(n)
          }

          function F(n) {
            return null === n || 60 === n || 61 === n || 62 === n || 96 === n ? t(n) : 34 === n || 39 === n ? (e.consume(n), o = n, C) : (0, i.markdownLineEnding)(n) ? (a = F, M(n)) : (0, i.markdownSpace)(n) ? (e.consume(n), F) : (e.consume(n), A)
          }

          function C(n) {
            return n === o ? (e.consume(n), o = void 0, _) : null === n ? t(n) : (0, i.markdownLineEnding)(n) ? (a = C, M(n)) : (e.consume(n), C)
          }

          function A(n) {
            return null === n || 34 === n || 39 === n || 60 === n || 61 === n || 96 === n ? t(n) : 47 === n || 62 === n || (0, i.markdownLineEndingOrSpace)(n) ? L(n) : (e.consume(n), A)
          }

          function _(e) {
            return 47 === e || 62 === e || (0, i.markdownLineEndingOrSpace)(e) ? L(e) : t(e)
          }

          function P(r) {
            return 62 === r ? (e.consume(r), e.exit("htmlTextData"), e.exit("htmlText"), n) : t(r)
          }

          function M(n) {
            return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), N
          }

          function N(n) {
            return (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, D, "linePrefix", c.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(n) : D(n)
          }

          function D(n) {
            return e.enter("htmlTextData"), a(n)
          }
        }
      }
    },
    678966: (e, n, t) => {
      t.r(n), t.d(n, {
        labelEnd: () => f
      });
      var r = t(880917),
        i = t(147504),
        c = t(801559),
        o = t(46096),
        u = t(576781),
        a = t(158300),
        s = t(262493),
        l = t(563879);
      const f = {
          name: "labelEnd",
          resolveAll: function(e) {
            let n = -1;
            const t = [];
            for (; ++n < e.length;) {
              const r = e[n][1];
              if (t.push(e[n]), "labelImage" === r.type || "labelLink" === r.type || "labelEnd" === r.type) {
                const e = "labelImage" === r.type ? 4 : 2;
                r.type = "data", n += e
              }
            }
            return e.length !== t.length && (0, a.splice)(e, 0, e.length, t), e
          },
          resolveTo: function(e, n) {
            let t, r, i, c, o = e.length,
              u = 0;
            for (; o--;)
              if (t = e[o][1], r) {
                if ("link" === t.type || "labelLink" === t.type && t._inactive) break;
                "enter" === e[o][0] && "labelLink" === t.type && (t._inactive = !0)
              } else if (i) {
              if ("enter" === e[o][0] && ("labelImage" === t.type || "labelLink" === t.type) && !t._balanced && (r = o, "labelLink" !== t.type)) {
                u = 2;
                break
              }
            } else "labelEnd" === t.type && (i = o);
            const s = {
                type: "labelLink" === e[r][1].type ? "link" : "image",
                start: {
                  ...e[r][1].start
                },
                end: {
                  ...e[e.length - 1][1].end
                }
              },
              f = {
                type: "label",
                start: {
                  ...e[r][1].start
                },
                end: {
                  ...e[i][1].end
                }
              },
              d = {
                type: "labelText",
                start: {
                  ...e[r + u + 2][1].end
                },
                end: {
                  ...e[i - 2][1].start
                }
              };
            return c = [
              ["enter", s, n],
              ["enter", f, n]
            ], c = (0, a.push)(c, e.slice(r + 1, r + u + 3)), c = (0, a.push)(c, [
              ["enter", d, n]
            ]), c = (0, a.push)(c, (0, l.resolveAll)(n.parser.constructs.insideSpan.null, e.slice(r + u + 4, i - 3), n)), c = (0, a.push)(c, [
              ["exit", d, n], e[i - 2], e[i - 1],
              ["exit", f, n]
            ]), c = (0, a.push)(c, e.slice(i + 1)), c = (0, a.push)(c, [
              ["exit", s, n]
            ]), (0, a.splice)(e, r, e.length, c), e
          },
          tokenize: function(e, n, t) {
            const r = this;
            let i, c, o = r.events.length;
            for (; o--;)
              if (("labelImage" === r.events[o][1].type || "labelLink" === r.events[o][1].type) && !r.events[o][1]._balanced) {
                i = r.events[o][1];
                break
              } return function(n) {
              return i ? i._inactive ? f(n) : (c = r.parser.defined.includes((0, s.normalizeIdentifier)(r.sliceSerialize({
                start: i.end,
                end: r.now()
              }))), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(n), e.exit("labelMarker"), e.exit("labelEnd"), u) : t(n)
            };

            function u(n) {
              return 40 === n ? e.attempt(d, l, c ? l : f)(n) : 91 === n ? e.attempt(m, l, c ? a : f)(n) : c ? l(n) : f(n)
            }

            function a(n) {
              return e.attempt(h, l, f)(n)
            }

            function l(e) {
              return n(e)
            }

            function f(e) {
              return i._balanced = !0, t(e)
            }
          }
        },
        d = {
          tokenize: function(e, n, t) {
            return function(n) {
              return e.enter("resource"), e.enter("resourceMarker"), e.consume(n), e.exit("resourceMarker"), i
            };

            function i(n) {
              return (0, u.markdownLineEndingOrSpace)(n) ? (0, o.factoryWhitespace)(e, a)(n) : a(n)
            }

            function a(n) {
              return 41 === n ? m(n) : (0, r.factoryDestination)(e, s, l, "resourceDestination", "resourceDestinationLiteral", "resourceDestinationLiteralMarker", "resourceDestinationRaw", "resourceDestinationString", 32)(n)
            }

            function s(n) {
              return (0, u.markdownLineEndingOrSpace)(n) ? (0, o.factoryWhitespace)(e, f)(n) : m(n)
            }

            function l(e) {
              return t(e)
            }

            function f(n) {
              return 34 === n || 39 === n || 40 === n ? (0, c.factoryTitle)(e, d, t, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(n) : m(n)
            }

            function d(n) {
              return (0, u.markdownLineEndingOrSpace)(n) ? (0, o.factoryWhitespace)(e, m)(n) : m(n)
            }

            function m(r) {
              return 41 === r ? (e.enter("resourceMarker"), e.consume(r), e.exit("resourceMarker"), e.exit("resource"), n) : t(r)
            }
          }
        },
        m = {
          tokenize: function(e, n, t) {
            const r = this;
            return function(n) {
              return i.factoryLabel.call(r, e, c, o, "reference", "referenceMarker", "referenceString")(n)
            };

            function c(e) {
              return r.parser.defined.includes((0, s.normalizeIdentifier)(r.sliceSerialize(r.events[r.events.length - 1][1]).slice(1, -1))) ? n(e) : t(e)
            }

            function o(e) {
              return t(e)
            }
          }
        },
        h = {
          tokenize: function(e, n, t) {
            return function(n) {
              return e.enter("reference"), e.enter("referenceMarker"), e.consume(n), e.exit("referenceMarker"), r
            };

            function r(r) {
              return 93 === r ? (e.enter("referenceMarker"), e.consume(r), e.exit("referenceMarker"), e.exit("reference"), n) : t(r)
            }
          }
        }
    },
    755365: (e, n, t) => {
      t.r(n), t.d(n, {
        labelStartImage: () => r
      });
      const r = {
        name: "labelStartImage",
        resolveAll: t(678966).labelEnd.resolveAll,
        tokenize: function(e, n, t) {
          const r = this;
          return function(n) {
            return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(n), e.exit("labelImageMarker"), i
          };

          function i(n) {
            return 91 === n ? (e.enter("labelMarker"), e.consume(n), e.exit("labelMarker"), e.exit("labelImage"), c) : t(n)
          }

          function c(e) {
            return 94 === e && "_hiddenFootnoteSupport" in r.parser.constructs ? t(e) : n(e)
          }
        }
      }
    },
    735856: (e, n, t) => {
      t.r(n), t.d(n, {
        labelStartLink: () => r
      });
      const r = {
        name: "labelStartLink",
        resolveAll: t(678966).labelEnd.resolveAll,
        tokenize: function(e, n, t) {
          const r = this;
          return function(n) {
            return e.enter("labelLink"), e.enter("labelMarker"), e.consume(n), e.exit("labelMarker"), e.exit("labelLink"), i
          };

          function i(e) {
            return 94 === e && "_hiddenFootnoteSupport" in r.parser.constructs ? t(e) : n(e)
          }
        }
      }
    },
    400890: (e, n, t) => {
      t.r(n), t.d(n, {
        lineEnding: () => i
      });
      var r = t(474014);
      const i = {
        name: "lineEnding",
        tokenize: function(e, n) {
          return function(t) {
            return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), (0, r.factorySpace)(e, n, "linePrefix")
          }
        }
      }
    },
    84618: (e, n, t) => {
      t.r(n), t.d(n, {
        list: () => u
      });
      var r = t(474014),
        i = t(576781),
        c = t(352929),
        o = t(88038);
      const u = {
          continuation: {
            tokenize: function(e, n, t) {
              const o = this;
              return o.containerState._closeFlow = void 0, e.check(c.blankLine, (function(t) {
                return o.containerState.furtherBlankLines = o.containerState.furtherBlankLines || o.containerState.initialBlankLine, (0, r.factorySpace)(e, n, "listItemIndent", o.containerState.size + 1)(t)
              }), (function(t) {
                return o.containerState.furtherBlankLines || !(0, i.markdownSpace)(t) ? (o.containerState.furtherBlankLines = void 0, o.containerState.initialBlankLine = void 0, a(t)) : (o.containerState.furtherBlankLines = void 0, o.containerState.initialBlankLine = void 0, e.attempt(s, n, a)(t))
              }));

              function a(i) {
                return o.containerState._closeFlow = !0, o.interrupt = void 0, (0, r.factorySpace)(e, e.attempt(u, n, t), "linePrefix", o.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(i)
              }
            }
          },
          exit: function(e) {
            e.exit(this.containerState.type)
          },
          name: "list",
          tokenize: function(e, n, t) {
            const r = this,
              u = r.events[r.events.length - 1];
            let s = u && "linePrefix" === u[1].type ? u[2].sliceSerialize(u[1], !0).length : 0,
              l = 0;
            return function(n) {
              const c = r.containerState.type || (42 === n || 43 === n || 45 === n ? "listUnordered" : "listOrdered");
              if ("listUnordered" === c ? !r.containerState.marker || n === r.containerState.marker : (0, i.asciiDigit)(n)) {
                if (r.containerState.type || (r.containerState.type = c, e.enter(c, {
                    _container: !0
                  })), "listUnordered" === c) return e.enter("listItemPrefix"), 42 === n || 45 === n ? e.check(o.thematicBreak, t, d)(n) : d(n);
                if (!r.interrupt || 49 === n) return e.enter("listItemPrefix"), e.enter("listItemValue"), f(n)
              }
              return t(n)
            };

            function f(n) {
              return (0, i.asciiDigit)(n) && ++l < 10 ? (e.consume(n), f) : (!r.interrupt || l < 2) && (r.containerState.marker ? n === r.containerState.marker : 41 === n || 46 === n) ? (e.exit("listItemValue"), d(n)) : t(n)
            }

            function d(n) {
              return e.enter("listItemMarker"), e.consume(n), e.exit("listItemMarker"), r.containerState.marker = r.containerState.marker || n, e.check(c.blankLine, r.interrupt ? t : m, e.attempt(a, p, h))
            }

            function m(e) {
              return r.containerState.initialBlankLine = !0, s++, p(e)
            }

            function h(n) {
              return (0, i.markdownSpace)(n) ? (e.enter("listItemPrefixWhitespace"), e.consume(n), e.exit("listItemPrefixWhitespace"), p) : t(n)
            }

            function p(t) {
              return r.containerState.size = s + r.sliceSerialize(e.exit("listItemPrefix"), !0).length, n(t)
            }
          }
        },
        a = {
          partial: !0,
          tokenize: function(e, n, t) {
            const c = this;
            return (0, r.factorySpace)(e, (function(e) {
              const r = c.events[c.events.length - 1];
              return !(0, i.markdownSpace)(e) && r && "listItemPrefixWhitespace" === r[1].type ? n(e) : t(e)
            }), "listItemPrefixWhitespace", c.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5)
          }
        },
        s = {
          partial: !0,
          tokenize: function(e, n, t) {
            const i = this;
            return (0, r.factorySpace)(e, (function(e) {
              const r = i.events[i.events.length - 1];
              return r && "listItemIndent" === r[1].type && r[2].sliceSerialize(r[1], !0).length === i.containerState.size ? n(e) : t(e)
            }), "listItemIndent", i.containerState.size + 1)
          }
        }
    },
    146263: (e, n, t) => {
      t.r(n), t.d(n, {
        setextUnderline: () => c
      });
      var r = t(474014),
        i = t(576781);
      const c = {
        name: "setextUnderline",
        resolveTo: function(e, n) {
          let t, r, i, c = e.length;
          for (; c--;)
            if ("enter" === e[c][0]) {
              if ("content" === e[c][1].type) {
                t = c;
                break
              }
              "paragraph" === e[c][1].type && (r = c)
            } else "content" === e[c][1].type && e.splice(c, 1), i || "definition" !== e[c][1].type || (i = c);
          const o = {
            type: "setextHeading",
            start: {
              ...e[t][1].start
            },
            end: {
              ...e[e.length - 1][1].end
            }
          };
          return e[r][1].type = "setextHeadingText", i ? (e.splice(r, 0, ["enter", o, n]), e.splice(i + 1, 0, ["exit", e[t][1], n]), e[t][1].end = {
            ...e[i][1].end
          }) : e[t][1] = o, e.push(["exit", o, n]), e
        },
        tokenize: function(e, n, t) {
          const c = this;
          let o;
          return function(n) {
            let r, i = c.events.length;
            for (; i--;)
              if ("lineEnding" !== c.events[i][1].type && "linePrefix" !== c.events[i][1].type && "content" !== c.events[i][1].type) {
                r = "paragraph" === c.events[i][1].type;
                break
              } return c.parser.lazy[c.now().line] || !c.interrupt && !r ? t(n) : (e.enter("setextHeadingLine"), o = n, function(n) {
              return e.enter("setextHeadingLineSequence"), u(n)
            }(n))
          };

          function u(n) {
            return n === o ? (e.consume(n), u) : (e.exit("setextHeadingLineSequence"), (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, a, "lineSuffix")(n) : a(n))
          }

          function a(r) {
            return null === r || (0, i.markdownLineEnding)(r) ? (e.exit("setextHeadingLine"), n(r)) : t(r)
          }
        }
      }
    },
    88038: (e, n, t) => {
      t.r(n), t.d(n, {
        thematicBreak: () => c
      });
      var r = t(474014),
        i = t(576781);
      const c = {
        name: "thematicBreak",
        tokenize: function(e, n, t) {
          let c, o = 0;
          return function(n) {
            return e.enter("thematicBreak"),
              function(e) {
                return c = e, u(e)
              }(n)
          };

          function u(r) {
            return r === c ? (e.enter("thematicBreakSequence"), a(r)) : o >= 3 && (null === r || (0, i.markdownLineEnding)(r)) ? (e.exit("thematicBreak"), n(r)) : t(r)
          }

          function a(n) {
            return n === c ? (e.consume(n), o++, a) : (e.exit("thematicBreakSequence"), (0, i.markdownSpace)(n) ? (0, r.factorySpace)(e, u, "whitespace")(n) : u(n))
          }
        }
      }
    },
    880917: (e, n, t) => {
      t.r(n), t.d(n, {
        factoryDestination: () => i
      });
      var r = t(576781);

      function i(e, n, t, i, c, o, u, a, s) {
        const l = s || Number.POSITIVE_INFINITY;
        let f = 0;
        return function(n) {
          return 60 === n ? (e.enter(i), e.enter(c), e.enter(o), e.consume(n), e.exit(o), d) : null === n || 32 === n || 41 === n || (0, r.asciiControl)(n) ? t(n) : (e.enter(i), e.enter(u), e.enter(a), e.enter("chunkString", {
            contentType: "string"
          }), p(n))
        };

        function d(t) {
          return 62 === t ? (e.enter(o), e.consume(t), e.exit(o), e.exit(c), e.exit(i), n) : (e.enter(a), e.enter("chunkString", {
            contentType: "string"
          }), m(t))
        }

        function m(n) {
          return 62 === n ? (e.exit("chunkString"), e.exit(a), d(n)) : null === n || 60 === n || (0, r.markdownLineEnding)(n) ? t(n) : (e.consume(n), 92 === n ? h : m)
        }

        function h(n) {
          return 60 === n || 62 === n || 92 === n ? (e.consume(n), m) : m(n)
        }

        function p(c) {
          return f || null !== c && 41 !== c && !(0, r.markdownLineEndingOrSpace)(c) ? f < l && 40 === c ? (e.consume(c), f++, p) : 41 === c ? (e.consume(c), f--, p) : null === c || 32 === c || 40 === c || (0, r.asciiControl)(c) ? t(c) : (e.consume(c), 92 === c ? g : p) : (e.exit("chunkString"), e.exit(a), e.exit(u), e.exit(i), n(c))
        }

        function g(n) {
          return 40 === n || 41 === n || 92 === n ? (e.consume(n), p) : p(n)
        }
      }
    },
    147504: (e, n, t) => {
      t.r(n), t.d(n, {
        factoryLabel: () => i
      });
      var r = t(576781);

      function i(e, n, t, i, c, o) {
        const u = this;
        let a, s = 0;
        return function(n) {
          return e.enter(i), e.enter(c), e.consume(n), e.exit(c), e.enter(o), l
        };

        function l(d) {
          return s > 999 || null === d || 91 === d || 93 === d && !a || 94 === d && !s && "_hiddenFootnoteSupport" in u.parser.constructs ? t(d) : 93 === d ? (e.exit(o), e.enter(c), e.consume(d), e.exit(c), e.exit(i), n) : (0, r.markdownLineEnding)(d) ? (e.enter("lineEnding"), e.consume(d), e.exit("lineEnding"), l) : (e.enter("chunkString", {
            contentType: "string"
          }), f(d))
        }

        function f(n) {
          return null === n || 91 === n || 93 === n || (0, r.markdownLineEnding)(n) || s++ > 999 ? (e.exit("chunkString"), l(n)) : (e.consume(n), a || (a = !(0, r.markdownSpace)(n)), 92 === n ? d : f)
        }

        function d(n) {
          return 91 === n || 92 === n || 93 === n ? (e.consume(n), s++, f) : f(n)
        }
      }
    },
    474014: (e, n, t) => {
      t.r(n), t.d(n, {
        factorySpace: () => i
      });
      var r = t(576781);

      function i(e, n, t, i) {
        const c = i ? i - 1 : Number.POSITIVE_INFINITY;
        let o = 0;
        return function(i) {
          return (0, r.markdownSpace)(i) ? (e.enter(t), u(i)) : n(i)
        };

        function u(i) {
          return (0, r.markdownSpace)(i) && o++ < c ? (e.consume(i), u) : (e.exit(t), n(i))
        }
      }
    },
    801559: (e, n, t) => {
      t.r(n), t.d(n, {
        factoryTitle: () => c
      });
      var r = t(474014),
        i = t(576781);

      function c(e, n, t, c, o, u) {
        let a;
        return function(n) {
          return 34 === n || 39 === n || 40 === n ? (e.enter(c), e.enter(o), e.consume(n), e.exit(o), a = 40 === n ? 41 : n, s) : t(n)
        };

        function s(t) {
          return t === a ? (e.enter(o), e.consume(t), e.exit(o), e.exit(c), n) : (e.enter(u), l(t))
        }

        function l(n) {
          return n === a ? (e.exit(u), s(a)) : null === n ? t(n) : (0, i.markdownLineEnding)(n) ? (e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), (0, r.factorySpace)(e, l, "linePrefix")) : (e.enter("chunkString", {
            contentType: "string"
          }), f(n))
        }

        function f(n) {
          return n === a || null === n || (0, i.markdownLineEnding)(n) ? (e.exit("chunkString"), l(n)) : (e.consume(n), 92 === n ? d : f)
        }

        function d(n) {
          return n === a || 92 === n ? (e.consume(n), f) : f(n)
        }
      }
    },
    46096: (e, n, t) => {
      t.r(n), t.d(n, {
        factoryWhitespace: () => c
      });
      var r = t(474014),
        i = t(576781);

      function c(e, n) {
        let t;
        return function c(o) {
          return (0, i.markdownLineEnding)(o) ? (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), t = !0, c) : (0, i.markdownSpace)(o) ? (0, r.factorySpace)(e, c, t ? "linePrefix" : "lineSuffix")(o) : n(o)
        }
      }
    },
    576781: (e, n, t) => {
      t.r(n), t.d(n, {
        asciiAlpha: () => r,
        asciiAlphanumeric: () => i,
        asciiAtext: () => c,
        asciiControl: () => o,
        asciiDigit: () => u,
        asciiHexDigit: () => a,
        asciiPunctuation: () => s,
        markdownLineEnding: () => l,
        markdownLineEndingOrSpace: () => f,
        markdownSpace: () => d,
        unicodePunctuation: () => m,
        unicodeWhitespace: () => h
      });
      const r = p(/[A-Za-z]/),
        i = p(/[\dA-Za-z]/),
        c = p(/[#-'*+\--9=?A-Z^-~]/);

      function o(e) {
        return null !== e && (e < 32 || 127 === e)
      }
      const u = p(/\d/),
        a = p(/[\dA-Fa-f]/),
        s = p(/[!-/:-@[-`{-~]/);

      function l(e) {
        return null !== e && e < -2
      }

      function f(e) {
        return null !== e && (e < 0 || 32 === e)
      }

      function d(e) {
        return -2 === e || -1 === e || 32 === e
      }
      const m = p(/\p{P}|\p{S}/u),
        h = p(/\s/);

      function p(e) {
        return function(n) {
          return null !== n && n > -1 && e.test(String.fromCharCode(n))
        }
      }
    },
    158300: (e, n, t) => {
      function r(e, n, t, r) {
        const i = e.length;
        let c, o = 0;
        if (n = n < 0 ? -n > i ? 0 : i + n : n > i ? i : n, t = t > 0 ? t : 0, r.length < 1e4) c = Array.from(r), c.unshift(n, t), e.splice(...c);
        else
          for (t && e.splice(n, t); o < r.length;) c = r.slice(o, o + 1e4), c.unshift(n, 0), e.splice(...c), o += 1e4, n += 1e4
      }

      function i(e, n) {
        return e.length > 0 ? (r(e, e.length, 0, n), e) : n
      }
      t.r(n), t.d(n, {
        push: () => i,
        splice: () => r
      })
    },
    173886: (e, n, t) => {
      t.r(n), t.d(n, {
        classifyCharacter: () => i
      });
      var r = t(576781);

      function i(e) {
        return null === e || (0, r.markdownLineEndingOrSpace)(e) || (0, r.unicodeWhitespace)(e) ? 1 : (0, r.unicodePunctuation)(e) ? 2 : void 0
      }
    },
    514666: (e, n, t) => {
      t.r(n), t.d(n, {
        combineExtensions: () => c,
        combineHtmlExtensions: () => a
      });
      var r = t(158300);
      const i = {}.hasOwnProperty;

      function c(e) {
        const n = {};
        let t = -1;
        for (; ++t < e.length;) o(n, e[t]);
        return n
      }

      function o(e, n) {
        let t;
        for (t in n) {
          const r = (i.call(e, t) ? e[t] : void 0) || (e[t] = {}),
            c = n[t];
          let o;
          if (c)
            for (o in c) {
              i.call(r, o) || (r[o] = []);
              const e = c[o];
              u(r[o], Array.isArray(e) ? e : e ? [e] : [])
            }
        }
      }

      function u(e, n) {
        let t = -1;
        const i = [];
        for (; ++t < n.length;)("after" === n[t].add ? e : i).push(n[t]);
        (0, r.splice)(e, 0, 0, i)
      }

      function a(e) {
        const n = {};
        let t = -1;
        for (; ++t < e.length;) s(n, e[t]);
        return n
      }

      function s(e, n) {
        let t;
        for (t in n) {
          const r = (i.call(e, t) ? e[t] : void 0) || (e[t] = {}),
            c = n[t];
          let o;
          if (c)
            for (o in c) r[o] = c[o]
        }
      }
    },
    48031: (e, n, t) => {
      function r(e, n) {
        const t = Number.parseInt(e, n);
        return t < 9 || 11 === t || t > 13 && t < 32 || t > 126 && t < 160 || t > 55295 && t < 57344 || t > 64975 && t < 65008 || 65535 == (65535 & t) || 65534 == (65535 & t) || t > 1114111 ? "�" : String.fromCodePoint(t)
      }
      t.r(n), t.d(n, {
        decodeNumericCharacterReference: () => r
      })
    },
    812116: (e, n, t) => {
      t.r(n), t.d(n, {
        decodeString: () => o
      });
      var r = t(269477),
        i = t(48031);
      const c = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;

      function o(e) {
        return e.replace(c, u)
      }

      function u(e, n, t) {
        if (n) return n;
        if (35 === t.charCodeAt(0)) {
          const e = t.charCodeAt(1),
            n = 120 === e || 88 === e;
          return (0, i.decodeNumericCharacterReference)(t.slice(n ? 2 : 1), n ? 16 : 10)
        }
        return (0, r.decodeNamedCharacterReference)(t) || e
      }
    },
    854856: (e, n, t) => {
      t.r(n), t.d(n, {
        encode: () => i
      });
      const r = {
        '"': "quot",
        "&": "amp",
        "<": "lt",
        ">": "gt"
      };

      function i(e) {
        return e.replace(/["&<>]/g, (function(e) {
          return "&" + r[e] + ";"
        }))
      }
    },
    800733: (e, n, t) => {
      t.r(n), t.d(n, {
        htmlBlockNames: () => r,
        htmlRawNames: () => i
      });
      const r = ["address", "article", "aside", "base", "basefont", "blockquote", "body", "caption", "center", "col", "colgroup", "dd", "details", "dialog", "dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "iframe", "legend", "li", "link", "main", "menu", "menuitem", "nav", "noframes", "ol", "optgroup", "option", "p", "param", "search", "section", "summary", "table", "tbody", "td", "tfoot", "th", "thead", "title", "tr", "track", "ul"],
        i = ["pre", "script", "style", "textarea"]
    },
    262493: (e, n, t) => {
      function r(e) {
        return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase()
      }
      t.r(n), t.d(n, {
        normalizeIdentifier: () => r
      })
    },
    563879: (e, n, t) => {
      function r(e, n, t) {
        const r = [];
        let i = -1;
        for (; ++i < e.length;) {
          const c = e[i].resolveAll;
          c && !r.includes(c) && (n = c(n, t), r.push(c))
        }
        return n
      }
      t.r(n), t.d(n, {
        resolveAll: () => r
      })
    },
    157130: (e, n, t) => {
      t.r(n), t.d(n, {
        normalizeUri: () => o,
        sanitizeUri: () => c
      });
      var r = t(576781),
        i = t(854856);

      function c(e, n) {
        const t = (0, i.encode)(o(e || ""));
        if (!n) return t;
        const r = t.indexOf(":"),
          c = t.indexOf("?"),
          u = t.indexOf("#"),
          a = t.indexOf("/");
        return r < 0 || a > -1 && r > a || c > -1 && r > c || u > -1 && r > u || n.test(t.slice(0, r)) ? t : ""
      }

      function o(e) {
        const n = [];
        let t = -1,
          i = 0,
          c = 0;
        for (; ++t < e.length;) {
          const o = e.charCodeAt(t);
          let u = "";
          if (37 === o && (0, r.asciiAlphanumeric)(e.charCodeAt(t + 1)) && (0, r.asciiAlphanumeric)(e.charCodeAt(t + 2))) c = 2;
          else if (o < 128) /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o)) || (u = String.fromCharCode(o));
          else if (o > 55295 && o < 57344) {
            const n = e.charCodeAt(t + 1);
            o < 56320 && n > 56319 && n < 57344 ? (u = String.fromCharCode(o, n), c = 1) : u = "�"
          } else u = String.fromCharCode(o);
          u && (n.push(e.slice(i, t), encodeURIComponent(u)), i = t + c + 1, u = ""), c && (t += c, c = 0)
        }
        return n.join("") + e.slice(i)
      }
    },
    172988: (e, n, t) => {
      t.r(n), t.d(n, {
        SpliceBuffer: () => i.SpliceBuffer,
        subtokenize: () => c
      });
      var r = t(158300),
        i = t(332122);

      function c(e) {
        const n = {};
        let t, c, u, a, s, l, f, d = -1;
        const m = new i.SpliceBuffer(e);
        for (; ++d < m.length;) {
          for (; d in n;) d = n[d];
          if (t = m.get(d), d && "chunkFlow" === t[1].type && "listItemPrefix" === m.get(d - 1)[1].type && (l = t[1]._tokenizer.events, u = 0, u < l.length && "lineEndingBlank" === l[u][1].type && (u += 2), u < l.length && "content" === l[u][1].type))
            for (; ++u < l.length && "content" !== l[u][1].type;) "chunkText" === l[u][1].type && (l[u][1]._isInFirstContentOfListItem = !0, u++);
          if ("enter" === t[0]) t[1].contentType && (Object.assign(n, o(m, d)), d = n[d], f = !0);
          else if (t[1]._container) {
            for (u = d, c = void 0; u--;)
              if (a = m.get(u), "lineEnding" === a[1].type || "lineEndingBlank" === a[1].type) "enter" === a[0] && (c && (m.get(c)[1].type = "lineEndingBlank"), a[1].type = "lineEnding", c = u);
              else if ("linePrefix" !== a[1].type && "listItemIndent" !== a[1].type) break;
            c && (t[1].end = {
              ...m.get(c)[1].start
            }, s = m.slice(c, d), s.unshift(t), m.splice(c, d - c + 1, s))
          }
        }
        return (0, r.splice)(e, 0, Number.POSITIVE_INFINITY, m.slice(0)), !f
      }

      function o(e, n) {
        const t = e.get(n)[1],
          r = e.get(n)[2];
        let i = n - 1;
        const c = [];
        let o = t._tokenizer;
        o || (o = r.parser[t.contentType](t.start), t._contentTypeTextTrailing && (o._contentTypeTextTrailing = !0));
        const u = o.events,
          a = [],
          s = {};
        let l, f, d = -1,
          m = t,
          h = 0,
          p = 0;
        const g = [p];
        for (; m;) {
          for (; e.get(++i)[1] !== m;);
          c.push(i), m._tokenizer || (l = r.sliceStream(m), m.next || l.push(null), f && o.defineSkip(m.start), m._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = !0), o.write(l), m._isInFirstContentOfListItem && (o._gfmTasklistFirstContentOfListItem = void 0)), f = m, m = m.next
        }
        for (m = t; ++d < u.length;) "exit" === u[d][0] && "enter" === u[d - 1][0] && u[d][1].type === u[d - 1][1].type && u[d][1].start.line !== u[d][1].end.line && (p = d + 1, g.push(p), m._tokenizer = void 0, m.previous = void 0, m = m.next);
        for (o.events = [], m ? (m._tokenizer = void 0, m.previous = void 0) : g.pop(), d = g.length; d--;) {
          const n = u.slice(g[d], g[d + 1]),
            t = c.pop();
          a.push([t, t + n.length - 1]), e.splice(t, 2, n)
        }
        for (a.reverse(), d = -1; ++d < a.length;) s[h + a[d][0]] = h + a[d][1], h += a[d][1] - a[d][0] - 1;
        return s
      }
    },
    332122: (e, n, t) => {
      t.r(n), t.d(n, {
        SpliceBuffer: () => r
      });
      class r {
        constructor(e) {
          this.left = e ? [...e] : [], this.right = []
        }
        get(e) {
          if (e < 0 || e >= this.left.length + this.right.length) throw new RangeError("Cannot access index `" + e + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
          return e < this.left.length ? this.left[e] : this.right[this.right.length - e + this.left.length - 1]
        }
        get length() {
          return this.left.length + this.right.length
        }
        shift() {
          return this.setCursor(0), this.right.pop()
        }
        slice(e, n) {
          const t = null == n ? Number.POSITIVE_INFINITY : n;
          return t < this.left.length ? this.left.slice(e, t) : e > this.left.length ? this.right.slice(this.right.length - t + this.left.length, this.right.length - e + this.left.length).reverse() : this.left.slice(e).concat(this.right.slice(this.right.length - t + this.left.length).reverse())
        }
        splice(e, n, t) {
          const r = n || 0;
          this.setCursor(Math.trunc(e));
          const c = this.right.splice(this.right.length - r, Number.POSITIVE_INFINITY);
          return t && i(this.left, t), c.reverse()
        }
        pop() {
          return this.setCursor(Number.POSITIVE_INFINITY), this.left.pop()
        }
        push(e) {
          this.setCursor(Number.POSITIVE_INFINITY), this.left.push(e)
        }
        pushMany(e) {
          this.setCursor(Number.POSITIVE_INFINITY), i(this.left, e)
        }
        unshift(e) {
          this.setCursor(0), this.right.push(e)
        }
        unshiftMany(e) {
          this.setCursor(0), i(this.right, e.reverse())
        }
        setCursor(e) {
          if (!(e === this.left.length || e > this.left.length && 0 === this.right.length || e < 0 && 0 === this.left.length))
            if (e < this.left.length) {
              const n = this.left.splice(e, Number.POSITIVE_INFINITY);
              i(this.right, n.reverse())
            } else {
              const n = this.right.splice(this.left.length + this.right.length - e, Number.POSITIVE_INFINITY);
              i(this.left, n.reverse())
            }
        }
      }

      function i(e, n) {
        let t = 0;
        if (n.length < 1e4) e.push(...n);
        else
          for (; t < n.length;) e.push(...n.slice(t, t + 1e4)), t += 1e4
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
        n = (new Error).stack;
      n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "d0afc989-bf78-4e62-863d-b1284c1f35b3", e._sentryDebugIdIdentifier = "sentry-dbid-d0afc989-bf78-4e62-863d-b1284c1f35b3")
    } catch (e) {}
  }();
//# sourceMappingURL=35534.b37580f307cbe5725a90.js.map