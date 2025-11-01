"use strict";
(window.webpackChunk = window.webpackChunk || []).push([
  [69832], {
    67425: e => {
      function t(e) {
        if ("string" != typeof e) throw new TypeError("Path must be a string. Received " + JSON.stringify(e))
      }

      function r(e, t) {
        for (var r, n = "", i = 0, a = -1, _ = 0, o = 0; o <= e.length; ++o) {
          if (o < e.length) r = e.charCodeAt(o);
          else {
            if (47 === r) break;
            r = 47
          }
          if (47 === r) {
            if (a === o - 1 || 1 === _);
            else if (a !== o - 1 && 2 === _) {
              if (n.length < 2 || 2 !== i || 46 !== n.charCodeAt(n.length - 1) || 46 !== n.charCodeAt(n.length - 2))
                if (n.length > 2) {
                  var s = n.lastIndexOf("/");
                  if (s !== n.length - 1) {
                    -1 === s ? (n = "", i = 0) : i = (n = n.slice(0, s)).length - 1 - n.lastIndexOf("/"), a = o, _ = 0;
                    continue
                  }
                } else if (2 === n.length || 1 === n.length) {
                n = "", i = 0, a = o, _ = 0;
                continue
              }
              t && (n.length > 0 ? n += "/.." : n = "..", i = 2)
            } else n.length > 0 ? n += "/" + e.slice(a + 1, o) : n = e.slice(a + 1, o), i = o - a - 1;
            a = o, _ = 0
          } else 46 === r && -1 !== _ ? ++_ : _ = -1
        }
        return n
      }
      var n = {
        resolve: function() {
          for (var e, n = "", i = !1, a = arguments.length - 1; a >= -1 && !i; a--) {
            var _;
            a >= 0 ? _ = arguments[a] : (void 0 === e && (e = process.cwd()), _ = e), t(_), 0 !== _.length && (n = _ + "/" + n, i = 47 === _.charCodeAt(0))
          }
          return n = r(n, !i), i ? n.length > 0 ? "/" + n : "/" : n.length > 0 ? n : "."
        },
        normalize: function(e) {
          if (t(e), 0 === e.length) return ".";
          var n = 47 === e.charCodeAt(0),
            i = 47 === e.charCodeAt(e.length - 1);
          return 0 !== (e = r(e, !n)).length || n || (e = "."), e.length > 0 && i && (e += "/"), n ? "/" + e : e
        },
        isAbsolute: function(e) {
          return t(e), e.length > 0 && 47 === e.charCodeAt(0)
        },
        join: function() {
          if (0 === arguments.length) return ".";
          for (var e, r = 0; r < arguments.length; ++r) {
            var i = arguments[r];
            t(i), i.length > 0 && (void 0 === e ? e = i : e += "/" + i)
          }
          return void 0 === e ? "." : n.normalize(e)
        },
        relative: function(e, r) {
          if (t(e), t(r), e === r) return "";
          if ((e = n.resolve(e)) === (r = n.resolve(r))) return "";
          for (var i = 1; i < e.length && 47 === e.charCodeAt(i); ++i);
          for (var a = e.length, _ = a - i, o = 1; o < r.length && 47 === r.charCodeAt(o); ++o);
          for (var s = r.length - o, c = _ < s ? _ : s, u = -1, l = 0; l <= c; ++l) {
            if (l === c) {
              if (s > c) {
                if (47 === r.charCodeAt(o + l)) return r.slice(o + l + 1);
                if (0 === l) return r.slice(o + l)
              } else _ > c && (47 === e.charCodeAt(i + l) ? u = l : 0 === l && (u = 0));
              break
            }
            var d = e.charCodeAt(i + l);
            if (d !== r.charCodeAt(o + l)) break;
            47 === d && (u = l)
          }
          var f = "";
          for (l = i + u + 1; l <= a; ++l) l !== a && 47 !== e.charCodeAt(l) || (0 === f.length ? f += ".." : f += "/..");
          return f.length > 0 ? f + r.slice(o + u) : (o += u, 47 === r.charCodeAt(o) && ++o, r.slice(o))
        },
        _makeLong: function(e) {
          return e
        },
        dirname: function(e) {
          if (t(e), 0 === e.length) return ".";
          for (var r = e.charCodeAt(0), n = 47 === r, i = -1, a = !0, _ = e.length - 1; _ >= 1; --_)
            if (47 === (r = e.charCodeAt(_))) {
              if (!a) {
                i = _;
                break
              }
            } else a = !1;
          return -1 === i ? n ? "/" : "." : n && 1 === i ? "//" : e.slice(0, i)
        },
        basename: function(e, r) {
          if (void 0 !== r && "string" != typeof r) throw new TypeError('"ext" argument must be a string');
          t(e);
          var n, i = 0,
            a = -1,
            _ = !0;
          if (void 0 !== r && r.length > 0 && r.length <= e.length) {
            if (r.length === e.length && r === e) return "";
            var o = r.length - 1,
              s = -1;
            for (n = e.length - 1; n >= 0; --n) {
              var c = e.charCodeAt(n);
              if (47 === c) {
                if (!_) {
                  i = n + 1;
                  break
                }
              } else - 1 === s && (_ = !1, s = n + 1), o >= 0 && (c === r.charCodeAt(o) ? -1 == --o && (a = n) : (o = -1, a = s))
            }
            return i === a ? a = s : -1 === a && (a = e.length), e.slice(i, a)
          }
          for (n = e.length - 1; n >= 0; --n)
            if (47 === e.charCodeAt(n)) {
              if (!_) {
                i = n + 1;
                break
              }
            } else - 1 === a && (_ = !1, a = n + 1);
          return -1 === a ? "" : e.slice(i, a)
        },
        extname: function(e) {
          t(e);
          for (var r = -1, n = 0, i = -1, a = !0, _ = 0, o = e.length - 1; o >= 0; --o) {
            var s = e.charCodeAt(o);
            if (47 !== s) - 1 === i && (a = !1, i = o + 1), 46 === s ? -1 === r ? r = o : 1 !== _ && (_ = 1) : -1 !== r && (_ = -1);
            else if (!a) {
              n = o + 1;
              break
            }
          }
          return -1 === r || -1 === i || 0 === _ || 1 === _ && r === i - 1 && r === n + 1 ? "" : e.slice(r, i)
        },
        format: function(e) {
          if (null === e || "object" != typeof e) throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
          return function(e, t) {
            var r = t.dir || t.root,
              n = t.base || (t.name || "") + (t.ext || "");
            return r ? r === t.root ? r + n : r + "/" + n : n
          }(0, e)
        },
        parse: function(e) {
          t(e);
          var r = {
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: ""
          };
          if (0 === e.length) return r;
          var n, i = e.charCodeAt(0),
            a = 47 === i;
          a ? (r.root = "/", n = 1) : n = 0;
          for (var _ = -1, o = 0, s = -1, c = !0, u = e.length - 1, l = 0; u >= n; --u)
            if (47 !== (i = e.charCodeAt(u))) - 1 === s && (c = !1, s = u + 1), 46 === i ? -1 === _ ? _ = u : 1 !== l && (l = 1) : -1 !== _ && (l = -1);
            else if (!c) {
            o = u + 1;
            break
          }
          return -1 === _ || -1 === s || 0 === l || 1 === l && _ === s - 1 && _ === o + 1 ? -1 !== s && (r.base = r.name = 0 === o && a ? e.slice(1, s) : e.slice(o, s)) : (0 === o && a ? (r.name = e.slice(1, _), r.base = e.slice(1, s)) : (r.name = e.slice(o, _), r.base = e.slice(o, s)), r.ext = e.slice(_, s)), o > 0 ? r.dir = e.slice(0, o - 1) : a && (r.dir = "/"), r
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
      };
      n.posix = n, e.exports = n
    },
    378548: (e, t, r) => {
      r.r(t), r.d(t, {
        append: () => n
      });
      var n = function(e) {
          var t = e.targetArray,
            r = e.itemsToAppend,
            n = !0,
            i = !1,
            a = void 0;
          try {
            for (var _, o = r[Symbol.iterator](); !(n = (_ = o.next()).done); n = !0) {
              var s = _.value;
              t.push(s)
            }
          } catch (e) {
            i = !0, a = e
          } finally {
            try {
              n || null == o.return || o.return()
            } finally {
              if (i) throw a
            }
          }
          return t
        },
        i = "../build/transpiled/utils/append/append";
      window.define(i, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([i])
    },
    523764: (e, t, r) => {
      r.r(t), r.d(t, {
        IndexedDBCache: () => u
      });
      var n = r(629133),
        i = r.n(n);

      function a(e, t, r, n, i, a, _) {
        try {
          var o = e[a](_),
            s = o.value
        } catch (e) {
          return void r(e)
        }
        o.done ? t(s) : Promise.resolve(s).then(n, i)
      }

      function _(e) {
        return function() {
          var t = this,
            r = arguments;
          return new Promise((function(n, i) {
            var _ = e.apply(t, r);

            function o(e) {
              a(_, n, i, o, s, "next", e)
            }

            function s(e) {
              a(_, n, i, o, s, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function o(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
        }
      }

      function s(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function c(e, t) {
        var r, n, i, a, _ = {
          label: 0,
          sent: function() {
            if (1 & i[0]) throw i[1];
            return i[1]
          },
          trys: [],
          ops: []
        };
        return a = {
          next: o(0),
          throw: o(1),
          return: o(2)
        }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this
        }), a;

        function o(a) {
          return function(o) {
            return function(a) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; _;) try {
                if (r = 1, n && (i = 2 & a[0] ? n.return : a[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, a[1])).done) return i;
                switch (n = 0, i && (a = [2 & a[0], i.value]), a[0]) {
                  case 0:
                  case 1:
                    i = a;
                    break;
                  case 4:
                    return _.label++, {
                      value: a[1],
                      done: !1
                    };
                  case 5:
                    _.label++, n = a[1], a = [0];
                    continue;
                  case 7:
                    a = _.ops.pop(), _.trys.pop();
                    continue;
                  default:
                    if (!((i = (i = _.trys).length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                      _ = 0;
                      continue
                    }
                    if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
                      _.label = a[1];
                      break
                    }
                    if (6 === a[0] && _.label < i[1]) {
                      _.label = i[1], i = a;
                      break
                    }
                    if (i && _.label < i[2]) {
                      _.label = i[2], _.ops.push(a);
                      break
                    }
                    i[2] && _.ops.pop(), _.trys.pop();
                    continue
                }
                a = t.call(e, _)
              } catch (e) {
                a = [6, e], n = 0
              } finally {
                r = i = 0
              }
              if (5 & a[0]) throw a[1];
              return {
                value: a[0] ? a[1] : void 0,
                done: !0
              }
            }([a, o])
          }
        }
      }
      var u = function() {
          function e(t) {
            ! function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.current_store = t, this.db_name = "store_cache", this.stores = {
              dashboardWidgets: "dashboard_widgets",
              integrationWidgets: "integration_widgets",
              richLinks: "rich_links",
              emoji: "emoji"
            }, this.store_names = Object.values(this.stores), this.db_version = 4, this.stores_max_size = s({}, this.stores.richLinks, 1e3), this.stores_records_ttl = s({}, this.stores.richLinks, 6048e5), this.is_idb = Boolean(window.indexedDB), this.cache = {}, this._save = i().bind(this._save, this), this.load = i().bind(this.load, this), this.remove = i().bind(this._remove, this), this.set = i().bind(this.set, this)
          }
          var t, r;
          return t = e, r = [{
            key: "createDbRequest",
            value: function() {
              return indexedDB.open(this.db_name, this.db_version)
            }
          }, {
            key: "_save",
            value: function(e) {
              var t = this,
                r = {},
                n = function(e) {
                  return {
                    val: e.val,
                    exp: e.exp,
                    time: Date.now()
                  }
                };
              return new Promise((function(a, _) {
                if (t.is_idb) {
                  var o = t.createDbRequest();
                  o.onerror = function(e) {
                    _(new Error(e.target.errorCode))
                  }, o.onupgradeneeded = function(e) {
                    var r = e.target.result;
                    i().map(t.store_names, (function(e) {
                      r.objectStoreNames.contains(e) || r.createObjectStore(e)
                    }))
                  }, o.onsuccess = function(o) {
                    try {
                      var s = o.target.result.transaction([t.current_store], "readwrite"),
                        c = s.objectStore(t.current_store);
                      i().forEach(e, (function(e) {
                        var t = e.key,
                          i = n(e),
                          a = c.put(i, t);
                        a.onerror = function(e) {
                          _(Error(e.target.errorCode))
                        }, a.onsuccess = function() {
                          r[t] = i
                        }
                      })), s.oncomplete = function() {
                        i().forEach(r, (function(e, r) {
                          t.cache[r] = e
                        })), t._clearOverflowItems().then(), a(r)
                      }
                    } catch (e) {
                      _(e)
                    }
                  }
                } else i().forEach(e, (function(e) {
                  var i = n(e);
                  t.cache[e.key] = i, r[e.key] = i
                })), a(r)
              }))
            }
          }, {
            key: "load",
            value: function() {
              var e = this;
              return _((function() {
                var t;
                return c(this, (function(r) {
                  switch (r.label) {
                    case 0:
                      return t = e, i().isEmpty(e.cache) ? [4, new Promise((function(r, n) {
                        var a, o = e.createDbRequest();
                        o.onerror = function(i) {
                          if ("VersionError" === i.currentTarget.error.name) {
                            var a = indexedDB.deleteDatabase(e.db_name);
                            return a.onsuccess = _((function() {
                              var e;
                              return c(this, (function(i) {
                                switch (i.label) {
                                  case 0:
                                    return i.trys.push([0, 2, , 3]), [4, t.load()];
                                  case 1:
                                    return i.sent(), r(t.cache), [3, 3];
                                  case 2:
                                    return e = i.sent(), n(e), [3, 3];
                                  case 3:
                                    return [2]
                                }
                              }))
                            })), void(a.onerror = function(e) {
                              t.is_idb = !1, n(new Error(e.target.errorCode))
                            })
                          }
                          t.is_idb = !1, n(new Error(i.target.errorCode))
                        }, o.onupgradeneeded = (a = _((function(r) {
                          var a, _;
                          return c(this, (function(o) {
                            switch (o.label) {
                              case 0:
                                a = r.target.result, i().map(e.store_names, (function(e) {
                                  i().contains(a.objectStoreNames, e) || a.createObjectStore(e)
                                })), i().map(a.objectStoreNames, (function(e) {
                                  i().contains(t.store_names, e) || a.deleteObjectStore(e)
                                })), o.label = 1;
                              case 1:
                                return o.trys.push([1, 3, , 4]), [4, e.load()];
                              case 2:
                                return [2, o.sent()];
                              case 3:
                                return _ = o.sent(), n(_), [3, 4];
                              case 4:
                                return [2]
                            }
                          }))
                        })), function(e) {
                          return a.apply(this, arguments)
                        }), o.onsuccess = function(t) {
                          try {
                            var i = t.target.result.transaction([e.current_store], "readonly").objectStore(e.current_store).openCursor(),
                              a = {};
                            i.onerror = function(e) {
                              n(new Error(e.target.errorCode))
                            }, i.onsuccess = function() {
                              var e = i.result;
                              if (!e) return r(a);
                              var t = e.key,
                                n = e.value;
                              a[t] = n, e.continue()
                            }
                          } catch (e) {
                            n(e)
                          }
                        }
                      }))] : [2, e.cache];
                    case 1:
                      return e.cache = r.sent(), [2, e.cache]
                  }
                }))
              }))()
            }
          }, {
            key: "get",
            value: function(e) {
              var t = this.cache[e],
                r = this.stores_records_ttl[this.current_store];
              return !!t && !(r && Date.now() - t.time > r) && t.val
            }
          }, {
            key: "get_created_at",
            value: function(e) {
              return !!this.cache[e] && this.cache[e].time
            }
          }, {
            key: "set",
            value: function(e) {
              var t = Array.isArray(e) ? e : [e];
              return this._save(t).catch((function(e) {
                return Error(e)
              }))
            }
          }, {
            key: "clearObjectStore",
            value: function() {
              var e = this;
              return _((function() {
                return c(this, (function(t) {
                  return [2, new Promise((function(t, r) {
                    if (e.is_idb) {
                      var n = e.createDbRequest();
                      n.onerror = function(e) {
                        r(new Error(e.target.errorCode))
                      }, n.onsuccess = function(n) {
                        try {
                          var i = n.target.result.transaction([e.current_store], "readwrite"),
                            a = i.objectStore(e.current_store);
                          e.cache = {}, a.clear(), t(i.complete)
                        } catch (e) {
                          r(e)
                        }
                      }
                    } else e.cache = {}, Promise.resolve()
                  }))]
                }))
              }))()
            }
          }, {
            key: "_clearOverflowItems",
            value: function() {
              var e = this;
              return new Promise((function(t, r) {
                var n = e.stores_max_size[e.current_store],
                  i = Object.keys(e.cache);
                (!n || n >= i.length) && t();
                var a = i.slice(0, i.length - n);
                e._remove(a).then(t).catch(r)
              }))
            }
          }, {
            key: "_remove",
            value: function(e) {
              var t = this,
                r = Array.isArray(e) ? e : [e];
              return new Promise((function(e, n) {
                if (t.is_idb) {
                  var a = t.createDbRequest();
                  a.onerror = function(e) {
                    n(new Error(e.target.errorCode))
                  }, a.onsuccess = function(n) {
                    var a = n.target.result.transaction([t.current_store], "readwrite"),
                      _ = a.objectStore(t.current_store);
                    i().forEach(r, (function(e) {
                      _.delete(e)
                    })), a.oncomplete = function() {
                      i().forEach(r, (function(e) {
                        delete t.cache[e]
                      })), e()
                    }
                  }
                } else i().forEach(r, (function(e) {
                  delete t.cache[e]
                })), e()
              }))
            }
          }, {
            key: "reloadIndexedDB",
            value: function() {
              this.is_idb && (indexedDB.deleteDatabase(this.db_name), this.load())
            }
          }], r && o(t.prototype, r), e
        }(),
        l = "../build/transpiled/utils/indexeddb_cache";
      window.define(l, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([l])
    },
    363842: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => n
      });
      const n = {
        areas: ["leads.pipeline", "leads.list", "customers.pipeline", "customers.list", "catalogs.list", "todo.calendar", "todo.list", "settings.widgets", "widget.advanced_settings", "widget.advanced_stats", "widget.widget_page", "companies.list", "contacts.list", "leads.card", "contacts.card", "companies.card", "customers.card", "stats.winlose", "stats.consolidate", "stats.activity", "stats.goals", "stats.events", "stats.calls", "stats.customers", "settings.users", "settings.general", "dp.settings", "dp.chats", "catalogs.sdk"],
        locations: {
          everywhere: 0,
          "leads.list": 1,
          "leads.pipeline": 2,
          "leads.card": 3,
          "companies.card": 4,
          "companies.list": 5,
          "contacts.card": 6,
          "contacts.list": 7,
          "customers.card": 8,
          "customers.list": 9,
          "customers.pipeline": 10,
          "settings.widgets": 11,
          "settings.general": 12,
          "settings.users": 13,
          "stats.winlose": 14,
          "stats.consolidate": 15,
          "stats.activity": 17,
          "stats.events": 17,
          "stats.calls": 18,
          "stats.goals": 19,
          "todo.calendar": 20,
          "todo.list": 21,
          "catalogs.list": 22,
          "catalogs.sdk": 23,
          "dp.chats": 24,
          "dp.settings": 25
        },
        field_types: {
          text: 1,
          password: 2,
          users: 3,
          users_lp: 4,
          hidden: 5
        }
      };
      var i = "../build/transpiled/widgets/constants";
      window.define(i, (function() {
        var e = "undefined",
          r = typeof t === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : t;
        return r && r.default || r
      })), window.require([i])
    },
    288410: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
        clearWidgetsBlock: () => clearWidgetsBlock,
        default: () => __WEBPACK_DEFAULT_EXPORT__
      });
      var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(661533),
        jquery__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__),
        underscore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(629133),
        underscore__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(underscore__WEBPACK_IMPORTED_MODULE_1__),
        store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(629821),
        store__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(store__WEBPACK_IMPORTED_MODULE_2__),
        lib_widgets_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(363842),
        lib_network_lead_sources_chat_sources_collection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(407710),
        lib_network_lead_sources_write_first_lead_sources_collection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(543666),
        lib_common_cookie__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(509372),
        lib_utils_generator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(168807),
        lib_utils_tester__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(955026),
        lib_utils_account_rights__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(859200),
        lib_utils_account_users__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(214558),
        lib_utils_indexeddb_cache__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(523764),
        _shared_lib_regexp__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(577486),
        _shared_lib_fperf__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(258471),
        _shared_lib_cdn__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(238600),
        lib_interface_card_linked_constants__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(11024),
        lib_interface_operday_utils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(641762),
        lib_interface_left_menu_utils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(397927),
        lib_components_widgets_block_actions__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(316348),
        _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(668568);

      function _array_like_to_array(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }

      function _array_with_holes(e) {
        if (Array.isArray(e)) return e
      }

      function _define_property(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function _iterable_to_array_limit(e, t) {
        var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
        if (null != r) {
          var n, i, a = [],
            _ = !0,
            o = !1;
          try {
            for (r = r.call(e); !(_ = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); _ = !0);
          } catch (e) {
            o = !0, i = e
          } finally {
            try {
              _ || null == r.return || r.return()
            } finally {
              if (o) throw i
            }
          }
          return a
        }
      }

      function _non_iterable_rest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
      }

      function _sliced_to_array(e, t) {
        return _array_with_holes(e) || _iterable_to_array_limit(e, t) || _unsupported_iterable_to_array(e, t) || _non_iterable_rest()
      }

      function _unsupported_iterable_to_array(e, t) {
        if (e) {
          if ("string" == typeof e) return _array_like_to_array(e, t);
          var r = Object.prototype.toString.call(e).slice(8, -1);
          return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? _array_like_to_array(e, t) : void 0
        }
      }
      var returnTrueFn = function() {
          return !0
        },
        fakeWidgetOnError = function(e) {
          APP.widgets.list[e] || "widgetsSettings" !== APP.getBaseEntity() || (APP.widgets.list[e] = {
            render: returnTrueFn,
            bind_actions: returnTrueFn,
            init: returnTrueFn,
            settings: returnTrueFn,
            onSave: returnTrueFn
          })
        },
        widgets_cache_lifetime = 18e5,
        RIGHT_PANEL_WIDGETS = [],
        indexeddb_cache = new lib_utils_indexeddb_cache__WEBPACK_IMPORTED_MODULE_11__.IndexedDBCache("integration_widgets"),
        widgets;
      __webpack_require__(333193), __webpack_require__(105244), __webpack_require__(412325), APP.widgets = APP.widgets || {}, APP.widgets.list = APP.widgets.list || {}, APP.widgets.areas = APP.constant("widgets_areas"), APP.widgets.system = APP.widgets.system || {}, APP.widgets.system.displayed_count_by_area = APP.constant("displayed_count_by_area") || {}, APP.widgets.cf_actions = APP.widgets.cf_actions || {}, APP.widgets.loaded = !1, APP.widgets.current = APP.widgets.current || {}, APP.widgets.registerToRightPanel = function(e) {
        return RIGHT_PANEL_WIDGETS.push(e), underscore__WEBPACK_IMPORTED_MODULE_1___default().sortBy(RIGHT_PANEL_WIDGETS.slice())
      }, APP.widgets.clear_cache = function() {
        underscore__WEBPACK_IMPORTED_MODULE_1___default().each(lib_widgets_constants__WEBPACK_IMPORTED_MODULE_3__.default.areas, (function(e) {
          e = "widgets_".concat(e), underscore__WEBPACK_IMPORTED_MODULE_1___default().contains(["widgets_widget.widget_page", "widgets_widget.advanced_settings"], e) && underscore__WEBPACK_IMPORTED_MODULE_1___default().each(Object.keys(localStorage), (function(t) {
            new _shared_lib_regexp__WEBPACK_IMPORTED_MODULE_12__.UnsafeRegExp("".concat(e, ":(.*)")).test(t) && store__WEBPACK_IMPORTED_MODULE_2___default().get(t) && store__WEBPACK_IMPORTED_MODULE_2___default().remove(t)
          })), store__WEBPACK_IMPORTED_MODULE_2___default().get(e) && store__WEBPACK_IMPORTED_MODULE_2___default().remove(e)
        })), indexeddb_cache.clearObjectStore(), lib_network_lead_sources_write_first_lead_sources_collection__WEBPACK_IMPORTED_MODULE_5__.WriteFirstLeadSourcesCollection.clearAllCache(), lib_network_lead_sources_chat_sources_collection__WEBPACK_IMPORTED_MODULE_4__.ChatSourcesCollection.clearAllCache(), lib_utils_generator__WEBPACK_IMPORTED_MODULE_7__.storeWithExpiration.remove(lib_interface_card_linked_constants__WEBPACK_IMPORTED_MODULE_14__.default.getCacheCode())
      };
      var Widgets = function() {
        var e = (0, lib_utils_account_rights__WEBPACK_IMPORTED_MODULE_9__.isAdmin)(),
          t = (0, lib_utils_account_rights__WEBPACK_IMPORTED_MODULE_9__.getRights)("is_free_user") || (APP.constant("support_auth_button") || e) && APP.constant("widgets_off") || e && APP.constant("safe_mode");
        this.destroyAll().done(underscore__WEBPACK_IMPORTED_MODULE_1___default().bind((function() {
          var e = APP.getWidgetsArea() || !1;
          t || (jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).off("widget:installed").off("widget:removed"), this.get_scripts(e, underscore__WEBPACK_IMPORTED_MODULE_1___default().bind(this.initialize, this)))
        }), this))
      };

      function _getData(e, t, r, n) {
        var i, a = {},
          _ = this.getWidgetsCacheId(e);
        switch (t) {
          case "widget.advanced_settings":
          case "widget.advanced_stats":
          case "widget.widget_page":
            i = "widgets_widget.".concat(e.replace("-", "_"));
            break;
          default:
            i = "widgets_".concat(t)
        }
        var o = function(e) {
          if (e.widgets && (0, _shared_lib_cdn__WEBPACK_IMPORTED_MODULE_19__.getWidgetsCdnBase)())
            for (var t in e.widgets) {
              var r = e.widgets[t];
              r.path && (r.cdn_path = (0, _shared_lib_cdn__WEBPACK_IMPORTED_MODULE_19__.getWidgetsCdnPath)(r.path)), r.images_path && (r.cdn_images_path = (0, _shared_lib_cdn__WEBPACK_IMPORTED_MODULE_19__.getWidgetsCdnPath)(r.images_path)), e.widgets[t] = r
            }
          return e
        };
        indexeddb_cache.load().catch((function() {})).then((function() {
          var s = indexeddb_cache.get(i);
          underscore__WEBPACK_IMPORTED_MODULE_1___default().has(s, "cache_id") && underscore__WEBPACK_IMPORTED_MODULE_1___default().isEqual(s.cache_id, _) || (APP.widgets.clear_cache(), s = null), s ? (o(s), n(underscore__WEBPACK_IMPORTED_MODULE_1___default().omit(s, "cache_id"))) : store__WEBPACK_IMPORTED_MODULE_2___default().get(i) ? (s = store__WEBPACK_IMPORTED_MODULE_2___default().get(i), indexeddb_cache.set({
            key: i,
            val: s.val,
            exp: widgets_cache_lifetime
          }), o(s), n(underscore__WEBPACK_IMPORTED_MODULE_1___default().omit(s, "cache_id")), store__WEBPACK_IMPORTED_MODULE_2___default().remove(i)) : jquery__WEBPACK_IMPORTED_MODULE_0___default().ajax({
            url: "/ajax/widgets/list",
            method: "POST",
            dataType: "json",
            data: {
              area: "widget.widget_page" === t ? "widget-page" : e
            }
          }).then((function(e) {
            a = r(e)
          })).then(underscore__WEBPACK_IMPORTED_MODULE_1___default().bind((function() {
            a.cache_id = _, indexeddb_cache.set({
              key: i,
              val: a,
              exp: widgets_cache_lifetime
            }), o(a), n(underscore__WEBPACK_IMPORTED_MODULE_1___default().omit(a, "cache_id"))
          }), this))
        }))
      }

      function initInSpecificArea(e, t, r, n) {
        var i = this,
          a = jquery__WEBPACK_IMPORTED_MODULE_0___default().Deferred();
        return e = underscore__WEBPACK_IMPORTED_MODULE_1___default().compact([e, t]).join(":"), n || (n = {}), _getData.call(this, e, e, (function(e) {
          var r = {};
          return t ? r[t] = e.widgets[t] : r = e.widgets, r
        }), (function(e) {
          var t = underscore__WEBPACK_IMPORTED_MODULE_1___default().keys(e);
          if (underscore__WEBPACK_IMPORTED_MODULE_1___default().isEmpty(e)) return a.reject();
          var _ = [],
            o = [],
            s = {
              disable_repeated_render: n.disable_repeated_render,
              disable_repeated_advanced_settings: n.disable_repeated_advanced_settings,
              disable_repeated_menu_page_init: n.disable_repeated_menu_page_init
            };
          i.initialize(e, (function(e, r) {
            if (_.push(r), e && o.push(r), o.length === t.length) return a.reject();
            _.length === t.length && a.resolve(underscore__WEBPACK_IMPORTED_MODULE_1___default().pick(APP.widgets.list, _))
          }), r, s)
        })), a.promise()
      }
      APP.widgets.notificationsPhone = function(e) {
        var t = e.click,
          r = e.ns;
        (0, lib_interface_left_menu_utils__WEBPACK_IMPORTED_MODULE_16__.setTelephonyState)({
          isEnabled: !0,
          onClick: t,
          ns: r
        })
      }, APP.widgets.destroyNotificationsPhone = function(e) {
        (0, lib_interface_left_menu_utils__WEBPACK_IMPORTED_MODULE_16__.setTelephonyState)({
          isEnabled: !1,
          ns: null == e ? void 0 : e.ns
        })
      }, Widgets.prototype.init_by_click = function(e, t) {
        var r = APP.getWidgetsArea(),
          n = jquery__WEBPACK_IMPORTED_MODULE_0___default().Deferred();
        return this.get_data(r, underscore__WEBPACK_IMPORTED_MODULE_1___default().bind((function(r) {
          var i = r.widgets[e],
            a = {};
          a[e] = i, i ? this.initialize(a, (function(t) {
            if (t) return "initialize_request_is_already_in_progress" === t.code ? APP.widgets.list[e] ? void n.resolve() : void _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.onSuccessFinish({
              queue_request: {
                identifier: e
              },
              callback: function() {
                n.resolve()
              }
            }) : n.reject();
            n.resolve()
          }), t) : n.reject()
        }), this)), n.promise()
      }, Widgets.prototype.initialize = function(scripts, callback, status, options) {
        var self = this,
          scr_length = underscore__WEBPACK_IMPORTED_MODULE_1___default().keys(scripts).length,
          initialize_requests = {},
          counter = 0,
          isFirstLoad = APP.constant("load_from_server");
        if (isFirstLoad && (0, _shared_lib_fperf__WEBPACK_IMPORTED_MODULE_13__.registerPerformanceMetrics)({
            metrics: _define_property({}, _shared_lib_fperf__WEBPACK_IMPORTED_MODULE_13__.TrackedMetricGroupName.WIDGETS, [_shared_lib_fperf__WEBPACK_IMPORTED_MODULE_13__.TrackedMetricName.WIDGETS_TTI])
          }), this._destroyed || window.location.pathname.indexOf("/settings/pay") > -1) return !1;
        options || (options = {}), this.__scripts = scripts, "object" == typeof scripts && (scr_length && (underscore__WEBPACK_IMPORTED_MODULE_1___default().each(scripts, (function(e, t) {
          var r = {
            identifier: t
          };
          initialize_requests[t] = r;
          try {
            _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.add(r)
          } catch (e) {
            callback({
              error: "initialize request is not actual anymore",
              code: "initialize_request_is_already_in_progress"
            }, t), (0, lib_utils_tester__WEBPACK_IMPORTED_MODULE_8__.isDev)() && console.error(e)
          }
        })), __webpack_require__.e(28933).then(__webpack_require__.bind(__webpack_require__, 128933)).then((function(e) {
          var t = e.default,
            r = Object.entries(scripts).map((function(e) {
              var r = _sliced_to_array(e, 2),
                n = r[0],
                i = r[1];
              return new Promise((function(e, r) {
                var a = i.settings || {},
                  _ = i.installed_version || "0",
                  o = initialize_requests[n],
                  s = [];
                if ("operday" === n && APP.data.current_card && !APP.data.current_card.new_card) return (0, lib_interface_operday_utils__WEBPACK_IMPORTED_MODULE_15__.renderTimer)(), ++counter === scr_length && (APP.widgets.loaded = !0, jquery__WEBPACK_IMPORTED_MODULE_0___default()("#list_table").trigger("list:checkbox")), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(callback) && callback(null, n), e();
                if (!i.src) return underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(callback) && callback({
                  error: "wrong widget params (no src)"
                }, n), _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.finish({
                  queue_request: o,
                  is_success_finish: !1
                }), e();
                if (APP.widgets.list[n]) {
                  if (!_initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.isQueueRequestActual(o)) return underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(callback) && callback({
                    error: "initialize request is not actual anymore",
                    code: "initialize_request_is_already_in_progress"
                  }, n), e();
                  _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.finish({
                    queue_request: o
                  }), options.disable_repeated_render || APP.widgets.list[n].callbacks.render(), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(callback) && callback(null, n), !options.disable_repeated_advanced_settings && underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(APP.widgets.list[n].callbacks.advancedSettings) && "widget.advanced_settings" === APP.getV3WidgetsArea() && APP.widgets.list[n].callbacks.advancedSettings(), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(APP.widgets.list[n].callbacks.advancedStats) && "widget.advanced_stats" === APP.getV3WidgetsArea() && APP.widgets.list[n].callbacks.advancedStats(), !options.disable_repeated_menu_page_init && underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(APP.widgets.list[n].callbacks.initMenuPage) && "widget.widget_page" === APP.getV3WidgetsArea() && APP.widgets.list[n].callbacks.initMenuPage(Widgets.prototype.getInitParamsMenu())
                } else s.push("optional!".concat(i.src, "?v=").concat(_)), i.lang && s.push("json!".concat(i.lang, "?v=").concat(_)), s.push("".concat(APP.static_domain, "/frontend/build/templates.js?").concat(APP.constant("version"))), window.require(s, (function() {
                  for (var s = arguments.length, c = new Array(s), u = 0; u < s; u++) c[u] = arguments[u];
                  var l, d, f, E = c[0],
                    g = c[1] || {};
                  if (!_initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.isQueueRequestActual(o)) return underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(callback) && callback({
                    error: "initialize request is not actual anymore",
                    code: "initialize_request_is_already_in_progress"
                  }, n), e();
                  try {
                    underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(E) && ((new t).extend(E), APP.widgets.list[n] = new E, l = jquery__WEBPACK_IMPORTED_MODULE_0___default().extend(APP.widgets.list[n], {
                      ns: ".widget:".concat(n),
                      init_once: i.init_once
                    }), underscore__WEBPACK_IMPORTED_MODULE_1___default().isObject(l.callbacks) && (underscore__WEBPACK_IMPORTED_MODULE_1___default().isObject(g) && (underscore__WEBPACK_IMPORTED_MODULE_1___default().isEmpty(i.name) || (g.widget.name = i.name), underscore__WEBPACK_IMPORTED_MODULE_1___default().isEmpty(i.description) || (g.widget.description = i.description), l.set_lang(g)), underscore__WEBPACK_IMPORTED_MODULE_1___default().isString(a) && a.length > 0 && (a = jquery__WEBPACK_IMPORTED_MODULE_0___default().parseJSON(a)), (a = a || {}).id = i.id, a.status = status, a.widget_code = n, a.path = i.path, a.id = i.id, a.version = _, a.oauth_client_uuid = i.oauth_client_uuid, a.widget_active = "Y" === i.active ? "Y" : "N", a.images_path = i.images_path || "".concat(i.path, "/images"), a.status = i.status, a.support = i.support, l.set_settings(a), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(l.callbacks.init) && underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(l.callbacks.bind_actions) && underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(l.callbacks.render) ? ((d = jquery__WEBPACK_IMPORTED_MODULE_0___default().Deferred(), f = l.callbacks.render(), f && (underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(f.then) ? f.then(d.resolve, d.reject) : d.resolve()), d.promise()).done((function() {
                      jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).trigger("widget:".concat(a.widget_code, ":loaded")), l.callbacks.init()
                    })), l.callbacks.bind_actions(), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(l.callbacks.advancedSettings) && "widget.advanced_settings" === APP.getV3WidgetsArea() && l.callbacks.advancedSettings(), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(l.callbacks.advancedStats) && "widget.advanced_stats" === APP.getV3WidgetsArea() && l.callbacks.advancedStats(), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(l.callbacks.initMenuPage) && "widget.widget_page" === APP.getV3WidgetsArea() && l.callbacks.initMenuPage(Widgets.prototype.getInitParamsMenu())) : delete APP.widgets.list[n])), ++counter === scr_length && (APP.widgets.loaded = !0, jquery__WEBPACK_IMPORTED_MODULE_0___default()("#list_table").trigger("list:checkbox")), _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.finish({
                      queue_request: o
                    }), e()
                  } catch (e) {
                    _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.finish({
                      queue_request: o,
                      is_success_finish: !1
                    }), console.error(e), r(e)
                  } finally {
                    fakeWidgetOnError(n), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(callback) && callback(null, n)
                  }
                }), (function(e) {
                  fakeWidgetOnError(n), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(callback) && callback(e, n), r(e)
                }))
              }))
            }));
          isFirstLoad && Promise.allSettled(r).then((function(e) {
            e.some((function(e) {
              return "rejected" === e.status
            })) || (0, _shared_lib_fperf__WEBPACK_IMPORTED_MODULE_13__.trackPerformanceMetric)({
              name: _shared_lib_fperf__WEBPACK_IMPORTED_MODULE_13__.TrackedMetricName.WIDGETS_TTI,
              group: "widgets"
            })
          }))
        }))), jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).off("widget:removed").off("widget:installed").on("widget:installed", (function(e, widget_code, settings) {
          var ps = {};
          "object" == typeof self.__scripts[widget_code] && (ps[widget_code] = self.__scripts[widget_code], ps[widget_code].active = "Y", settings = settings || "", ps[widget_code].settings = "'".concat(settings, "'"), ps[widget_code].settings = eval(ps[widget_code].settings), self.__scripts[widget_code] = ps[widget_code], self.initialize(ps))
        })).on("widget:removed", (function(e, t, r, n) {
          var i;
          n = n || !1, "object" == typeof APP.widgets.list[t] && ((i = APP.widgets.list[t]).callbacks.destroy = i.callbacks.destroy || returnTrueFn, jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).off(APP.click_event + i.ns), i.callbacks.destroy(), n && delete APP.widgets.list[t])
        })))
      }, Widgets.prototype.getInitParamsMenu = function() {
        var e = window.location.pathname.split("/");
        return "widget_page" === e[1] ? {
          location: e[1],
          item_code: e[3],
          subitem_code: e[4]
        } : {
          location: e[1],
          subitem_code: e[4]
        }
      }, Widgets.prototype.destroySingle = function(e, t) {
        var r = RIGHT_PANEL_WIDGETS.indexOf(t);
        e.callbacks && underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(e.callbacks.destroy) && e.callbacks.destroy(), e.ns && jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).off(e.ns), jquery__WEBPACK_IMPORTED_MODULE_0___default()("#widgets_block").find(".card-widgets__widget-".concat(t)).remove(), r > -1 && RIGHT_PANEL_WIDGETS.splice(1, r), delete APP.widgets.list[t]
      }, Widgets.prototype.destroy = function() {
        this._destroyed = !0
      }, Widgets.prototype.destroyAll = function() {
        var e = jquery__WEBPACK_IMPORTED_MODULE_0___default().Deferred(),
          t = 0,
          r = underscore__WEBPACK_IMPORTED_MODULE_1___default().keys(APP.widgets.list).length;
        return lib_components_widgets_block_actions__WEBPACK_IMPORTED_MODULE_17__.default.destroy(), _initialize_queue_manager__WEBPACK_IMPORTED_MODULE_18__.default.finishAll(), underscore__WEBPACK_IMPORTED_MODULE_1___default().each(APP.widgets.list, (function(n, i) {
          ("Y" !== n.init_once || n.params && "Y" !== n.params.widget_active) && this.destroySingle(n, i), ++t === r && e.resolve()
        }), this), RIGHT_PANEL_WIDGETS = [], underscore__WEBPACK_IMPORTED_MODULE_1___default().isEmpty(APP.widgets.list) && e.resolve(), e.promise()
      }, Widgets.prototype.__scripts = {}, Widgets.prototype.init_scripts = function(e, t) {
        var r = {};
        e = e || {}, APP.widgets.system = e.system || {}, APP.widgets.system = underscore__WEBPACK_IMPORTED_MODULE_1___default().extend(APP.widgets.system, {
          amouser: APP.constant("user").login,
          amohash: APP.constant("user").api_key
        }), e.length && (e.system.displayed_count_by_area = e.system.displayed_count_by_area || []), lib_components_widgets_block_actions__WEBPACK_IMPORTED_MODULE_17__.default.init(), underscore__WEBPACK_IMPORTED_MODULE_1___default().isFunction(t) && (r = this.get_active_scripts(e.widgets), t.call(this, r || []))
      }, Widgets.prototype.get_scripts = function(e, t) {
        this.get_data(e, underscore__WEBPACK_IMPORTED_MODULE_1___default().bind((function(e) {
          this.init_scripts(e, t)
        }), this))
      }, Widgets.prototype.getWidgetsCacheId = function(e) {
        return {
          user_id: (0, lib_utils_account_users__WEBPACK_IMPORTED_MODULE_10__.current)("id"),
          fversion: 1,
          version: APP.constant("widgets_cache_version")[e] || ""
        }
      }, Widgets.prototype.init_in_dp = function(e, t) {
        return e ? initInSpecificArea.call(this, "widgetsSettings", e, t) : jquery__WEBPACK_IMPORTED_MODULE_0___default().Deferred().reject()
      }, Widgets.prototype.init_in_salesbot_designer = function(e) {
        var t = {
          disable_repeated_render: e.disable_repeated_render,
          disable_repeated_menu_page_init: e.disable_repeated_menu_page_init
        };
        return initInSpecificArea.call(this, "salesbot_designer", e.widget_name, e.status, t)
      }, Widgets.prototype.init_in_crm_plugin = function(e) {
        return initInSpecificArea.call(this, "crm_plugin", e.widget_name, e.status)
      }, Widgets.prototype.init_in_crm_template = function(e, t) {
        return e ? initInSpecificArea.call(this, "crm_template", e, t) : jquery__WEBPACK_IMPORTED_MODULE_0___default().Deferred().reject()
      }, Widgets.prototype.init_in_catalog_card = function() {
        return initInSpecificArea.call(this, "catalog_card", null, status)
      }, Widgets.prototype.init_in_widget_modal = function(e, t) {
        return initInSpecificArea.call(this, "widgetsSettings", e, t)
      }, Widgets.prototype.init_in_chats = function(e) {
        return initInSpecificArea.call(this, "widgetsSettings", e)
      }, Widgets.prototype.get_data = function(e, t) {
        var r = APP.getV3WidgetsArea();
        return _getData.call(this, e, r, (function(e) {
          return (e = underscore__WEBPACK_IMPORTED_MODULE_1___default().isArray(e) && !e.length ? {} : e).system = e.system || {
            display_count: 0,
            displayed_count_by_area: {}
          }, (0, lib_common_cookie__WEBPACK_IMPORTED_MODULE_6__.set)({
            name: "displayed_widgets_count_".concat(r.replace(".", "_").replace("_list", "")),
            value: e.system.displayed_count || 0
          }), e
        }), t)
      }, Widgets.prototype.build_new_integration_data = function(e) {
        var t = e._links.script.href.replace("/script.js", "");
        return {
          active: "Y",
          category_id: "2",
          init_once: 1 === e.preload ? "Y" : "N",
          installed_version: e.version_time,
          lang: e._links.lang.href,
          path: t,
          settings: e.settings && e.settings.values ? e.settings.values : {},
          src: e._links.script.href,
          templates_path: "".concat(t, "/twig"),
          images_path: "".concat(t, "/img")
        }
      }, Widgets.prototype.get_active_scripts = function(e) {
        var t = {};
        return underscore__WEBPACK_IMPORTED_MODULE_1___default().each(e, (function(e, r) {
          "2" === e.category_id || "/settings/pay/" !== window.location.pathname ? "Y" === e.active && (t[r] = e) : underscore__WEBPACK_IMPORTED_MODULE_1___default().isEmpty(APP.widgets.list[r]) || this.destroySingle(APP.widgets.list[r], r)
        }), !0), t
      }, jquery__WEBPACK_IMPORTED_MODULE_0___default()(document).on("widgets:load", (function() {
        widgets && widgets.destroy(), widgets = new Widgets
      }));
      var clearWidgetsBlock = function() {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()("#widgets_block").find(" .card-widgets__widget, .js-operday-timer").remove()
      };
      const __WEBPACK_DEFAULT_EXPORT__ = Widgets;
      var m = "../build/transpiled/widgets/index";
      window.define(m, (function() {
        var e = "undefined",
          t = typeof __webpack_exports__ === e ? typeof __WEBPACK_AMD_DEFINE_RESULT__ === e ? typeof module === e ? void 0 : module.exports : __WEBPACK_AMD_DEFINE_RESULT__ : __webpack_exports__;
        return t && t.default || t
      })), window.require([m])
    },
    668568: (e, t, r) => {
      r.r(t), r.d(t, {
        default: () => o
      });
      var n = r(629133),
        i = r.n(n),
        a = {},
        _ = {};
      const o = {
        finish: function(e) {
          var t = e.queue_request,
            r = e.is_finish_successful,
            n = void 0 === r || r,
            o = t.identifier;
          return a[o] === t && (n && _[o] && (i().each(_[o], (function(e) {
            e()
          })), delete _[o]), delete a[o])
        },
        onSuccessFinish: function(e) {
          var t = e.queue_request,
            r = e.callback,
            n = t.identifier;
          _[n] ? _[n].push(r) : _[n] = [r]
        },
        finishAll: function() {
          var e = this;
          i().each(a, (function(t) {
            e.finish({
              queue_request: t,
              is_finish_successful: !1
            })
          }))
        },
        isQueueRequestActual: function(e) {
          var t = e.identifier;
          return e === a[t]
        },
        add: function(e) {
          var t = e.identifier,
            r = a[t];
          if (r) {
            var n = JSON.stringify(r);
            throw new Error("".concat(n, " is already inside the initialize queue."))
          }
          return a[t] = e, e
        }
      }
    },
    437886: (e, t, r) => {
      r.r(t), r.d(t, {
        BASE_QUERY_PART: () => n
      });
      var n = "aiAgent"
    },
    808563: (e, t, r) => {
      r.r(t), r.d(t, {
        get: () => g,
        patch: () => P,
        post: () => p
      });
      var n = r(744741),
        i = r(990703),
        a = r(388128),
        _ = r(661533);

      function o(e, t, r, n, i, a, _) {
        try {
          var o = e[a](_),
            s = o.value
        } catch (e) {
          return void r(e)
        }
        o.done ? t(s) : Promise.resolve(s).then(n, i)
      }

      function s(e) {
        return function() {
          var t = this,
            r = arguments;
          return new Promise((function(n, i) {
            var a = e.apply(t, r);

            function _(e) {
              o(a, n, i, _, s, "next", e)
            }

            function s(e) {
              o(a, n, i, _, s, "throw", e)
            }
            _(void 0)
          }))
        }
      }

      function c(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function u(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {},
            n = Object.keys(r);
          "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
          })))), n.forEach((function(t) {
            c(e, t, r[t])
          }))
        }
        return e
      }

      function l(e, t) {
        if (null == e) return {};
        var r, n, i = function(e, t) {
          if (null == e) return {};
          var r, n, i = {},
            a = Object.keys(e);
          for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) >= 0 || (i[r] = e[r]);
          return i
        }(e, t);
        if (Object.getOwnPropertySymbols) {
          var a = Object.getOwnPropertySymbols(e);
          for (n = 0; n < a.length; n++) r = a[n], t.indexOf(r) >= 0 || Object.prototype.propertyIsEnumerable.call(e, r) && (i[r] = e[r])
        }
        return i
      }

      function d(e, t) {
        var r, n, i, a, _ = {
          label: 0,
          sent: function() {
            if (1 & i[0]) throw i[1];
            return i[1]
          },
          trys: [],
          ops: []
        };
        return a = {
          next: o(0),
          throw: o(1),
          return: o(2)
        }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this
        }), a;

        function o(a) {
          return function(o) {
            return function(a) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; _;) try {
                if (r = 1, n && (i = 2 & a[0] ? n.return : a[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, a[1])).done) return i;
                switch (n = 0, i && (a = [2 & a[0], i.value]), a[0]) {
                  case 0:
                  case 1:
                    i = a;
                    break;
                  case 4:
                    return _.label++, {
                      value: a[1],
                      done: !1
                    };
                  case 5:
                    _.label++, n = a[1], a = [0];
                    continue;
                  case 7:
                    a = _.ops.pop(), _.trys.pop();
                    continue;
                  default:
                    if (!((i = (i = _.trys).length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                      _ = 0;
                      continue
                    }
                    if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
                      _.label = a[1];
                      break
                    }
                    if (6 === a[0] && _.label < i[1]) {
                      _.label = i[1], i = a;
                      break
                    }
                    if (i && _.label < i[2]) {
                      _.label = i[2], _.ops.push(a);
                      break
                    }
                    i[2] && _.ops.pop(), _.trys.pop();
                    continue
                }
                a = t.call(e, _)
              } catch (e) {
                a = [6, e], n = 0
              } finally {
                r = i = 0
              }
              if (5 & a[0]) throw a[1];
              return {
                value: a[0] ? a[1] : void 0,
                done: !0
              }
            }([a, o])
          }
        }
      }
      var f, E = (f = s((function(e) {
          var t, r;
          return d(this, (function(a) {
            switch (a.label) {
              case 0:
                t = function() {
                  return _.ajaxPromisify(_.extend(!0, {}, e, {
                    url: e.url,
                    contentType: "application/json",
                    xhrFields: {
                      withCredentials: !0
                    },
                    headers: {
                      "X-Language": APP.lang_id
                    }
                  }))
                }, a.label = 1;
              case 1:
                return a.trys.push([1, 3, , 7]), [4, t()];
              case 2:
                return [2, a.sent()];
              case 3:
                return (null == (r = a.sent()) ? void 0 : r.status) !== n.HttpStatusCode.FORBIDDEN ? [3, 6] : [4, (0, i.updateCoreTokens)()];
              case 4:
                return a.sent(), [4, t()];
              case 5:
                return [2, a.sent()];
              case 6:
                throw r;
              case 7:
                return [2]
            }
          }))
        })), function(e) {
          return f.apply(this, arguments)
        }),
        g = function() {
          var e = s((function(e) {
            var t, r;
            return d(this, (function(n) {
              switch (n.label) {
                case 0:
                  return t = e.url, r = l(e, ["url"]), [4, E(u({
                    url: "".concat(a.API_URL).concat(t)
                  }, r))];
                case 1:
                  return [2, n.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        p = function() {
          var e = s((function(e) {
            var t, r, n;
            return d(this, (function(i) {
              switch (i.label) {
                case 0:
                  return t = e.url, r = e.data, n = l(e, ["url", "data"]), [4, E(u({
                    url: "".concat(a.API_URL).concat(t),
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(r)
                  }, n))];
                case 1:
                  return [2, i.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }(),
        P = function() {
          var e = s((function(e) {
            var t, r, n;
            return d(this, (function(i) {
              switch (i.label) {
                case 0:
                  return t = e.url, r = e.data, n = l(e, ["url", "data"]), [4, E(u({
                    url: "".concat(a.API_URL).concat(t),
                    method: "PATCH",
                    contentType: "application/json",
                    data: JSON.stringify(r)
                  }, n))];
                case 1:
                  return [2, i.sent()]
              }
            }))
          }));
          return function(t) {
            return e.apply(this, arguments)
          }
        }()
    },
    388128: (e, t, r) => {
      var n;
      r.r(t), r.d(t, {
        API_URL: () => a,
        BASE_URL: () => i
      });
      var i = null === (n = APP.constant("agentoverseer")) || void 0 === n ? void 0 : n.host,
        a = "//".concat(i, "/api/v1/").concat(APP.constant("account").id)
    },
    501599: (e, t, r) => {
      r.r(t), r.d(t, {
        BASE_QUERY_PART: () => i.BASE_QUERY_PART,
        get: () => n.get,
        patch: () => n.patch,
        post: () => n.post
      });
      var n = r(808563),
        i = r(437886)
    },
    164196: (e, t, r) => {
      var n, i, a, _;
      r.r(t), r.d(t, {
          AskForInfoPreset: () => i,
          BuilderActions: () => n,
          EntityTypes: () => o,
          ManageTagsMethod: () => f,
          ManageTagsTarget: () => E,
          ResponsibleUsersPresets: () => u,
          SET_FIELD_TARGETS: () => g,
          SetFieldPresets: () => s,
          SetFieldValueTypes: () => _,
          TargetChangeResponsiblePreset: () => a,
          TaskCommentPresets: () => l,
          TaskCommentSources: () => d,
          TaskDeadlinePresets: () => c
        }),
        function(e) {
          e.ALWAYS_INCLUDE = "always_include", e.ALWAYS_TALK_ABOUT = "always_talk_about", e.ANSWER_USING_SOURCE = "answer_using_source", e.ASK_FOR_INFO = "ask_for_info", e.DONT_TALK_ABOUT = "dont_talk_about", e.SAY_EXACT_MESSAGE = "say_message", e.TALK_ABOUT = "talk_about", e.TRANSFER_TO_OPERATOR = "transfer_to_operator", e.SET_FIELD = "set_field", e.ADD_TASK = "add_task", e.CHANGE_RESPONSIBLE = "change_responsible", e.CHANGE_LEAD_STAGE = "change_lead_stage", e.MANAGE_TAGS = "manage_tags", e.RUN_SALESBOT = "run_salesbot"
        }(n || (n = {})),
        function(e) {
          e.EMAIL = "email", e.PHONE = "phone", e.NAME = "name", e.ADDRESS = "address"
        }(i || (i = {})),
        function(e) {
          e.LEAD = "lead", e.MAIN_CONTACT = "main_contact", e.ALL_CONTACTS = "all_contacts", e.CHAT_CONTACT = "chat_contact", e.COMPANY = "company"
        }(a || (a = {})),
        function(e) {
          e.CUSTOM = "custom", e.PRESET = "preset", e.CUSTOM_FIELD = "custom_field", e.FIELD = "field"
        }(_ || (_ = {}));
      var o, s, c, u, l, d, f, E, g = {
        CHAT_CONTACT: "chat_contact",
        LEAD: "lead",
        COMPANY: "company"
      };
      ! function(e) {
        e.LEAD = "lead", e.COMPANY = "company", e.CONTACT = "contact", e.SEGMENT = "segment", e.CUSTOMER = "customer"
      }(o || (o = {})),
      function(e) {
        e.CLIENT_MESSAGE = "client_message", e.FILL_WITH_AI = "fill_with_ai"
      }(s || (s = {})),
      function(e) {
        e.IMMEDIATELY = "immediately", e.TODAY = "today", e.ONE_DAY = "1day", e.THREE_DAYS = "3days", e.WEEK = "week"
      }(c || (c = {})),
      function(e) {
        e.CURRENT = "current", e.CREATOR = "creator"
      }(u || (u = {})),
      function(e) {
        e.FILL_WITH_AI = "fill_with_ai"
      }(l || (l = {})),
      function(e) {
        e.PRESET = "preset", e.CUSTOM = "custom"
      }(d || (d = {})),
      function(e) {
        e.SET_TAGS = "set", e.UNSET_TAGS = "unset"
      }(f || (f = {})),
      function(e) {
        e.LEAD = "lead", e.COMPANY = "company", e.MAIN_CONTACT = "main_contact", e.ALL_CONTACTS = "all_contacts", e.CHAT_CONTACT = "chat_contact"
      }(E || (E = {}))
    },
    73787: (e, t, r) => {
      r.r(t), r.d(t, {
        queries: () => i
      });
      var n = "aiAgent",
        i = {
          integrations: function() {
            return [n, "integrations"]
          },
          baseSettings: function() {
            return [n, "baseSettings"]
          },
          baseCoreSettings: function() {
            return [n, "baseCoreSettings"]
          },
          baseRewriterSettings: function() {
            return [n, "baseRewriterSettings"]
          }
        }
    },
    112388: (e, t, r) => {
      r.r(t), r.d(t, {
        createAgent: () => f,
        getAgentIntegrations: () => d,
        getAgents: () => E,
        updateAgent: () => g
      });
      var n = r(567952),
        i = r.n(n),
        a = r(104737),
        _ = r(501599),
        o = r(649759);

      function s(e, t, r, n, i, a, _) {
        try {
          var o = e[a](_),
            s = o.value
        } catch (e) {
          return void r(e)
        }
        o.done ? t(s) : Promise.resolve(s).then(n, i)
      }

      function c(e) {
        return function() {
          var t = this,
            r = arguments;
          return new Promise((function(n, i) {
            var a = e.apply(t, r);

            function _(e) {
              s(a, n, i, _, o, "next", e)
            }

            function o(e) {
              s(a, n, i, _, o, "throw", e)
            }
            _(void 0)
          }))
        }
      }

      function u(e, t) {
        var r, n, i, a, _ = {
          label: 0,
          sent: function() {
            if (1 & i[0]) throw i[1];
            return i[1]
          },
          trys: [],
          ops: []
        };
        return a = {
          next: o(0),
          throw: o(1),
          return: o(2)
        }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this
        }), a;

        function o(a) {
          return function(o) {
            return function(a) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; _;) try {
                if (r = 1, n && (i = 2 & a[0] ? n.return : a[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, a[1])).done) return i;
                switch (n = 0, i && (a = [2 & a[0], i.value]), a[0]) {
                  case 0:
                  case 1:
                    i = a;
                    break;
                  case 4:
                    return _.label++, {
                      value: a[1],
                      done: !1
                    };
                  case 5:
                    _.label++, n = a[1], a = [0];
                    continue;
                  case 7:
                    a = _.ops.pop(), _.trys.pop();
                    continue;
                  default:
                    if (!((i = (i = _.trys).length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                      _ = 0;
                      continue
                    }
                    if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
                      _.label = a[1];
                      break
                    }
                    if (6 === a[0] && _.label < i[1]) {
                      _.label = i[1], i = a;
                      break
                    }
                    if (i && _.label < i[2]) {
                      _.label = i[2], _.ops.push(a);
                      break
                    }
                    i[2] && _.ops.pop(), _.trys.pop();
                    continue
                }
                a = t.call(e, _)
              } catch (e) {
                a = [6, e], n = 0
              } finally {
                r = i = 0
              }
              if (5 & a[0]) throw a[1];
              return {
                value: a[0] ? a[1] : void 0,
                done: !0
              }
            }([a, o])
          }
        }
      }
      var l, d = function() {
          return a.default.request({
            url: "/ajax/v1/widgets/list/?full=y&filter[widget_locations]=ai_agent"
          })
        },
        f = (l = c((function(e) {
          var t;
          return u(this, (function(r) {
            switch (r.label) {
              case 0:
                return [4, (0, _.post)({
                  url: o.urls.agents(e)
                })];
              case 1:
                return t = r.sent(), [2, i()(t)]
            }
          }))
        })), function(e) {
          return l.apply(this, arguments)
        }),
        E = function() {
          var e = c((function() {
            var e;
            return u(this, (function(t) {
              switch (t.label) {
                case 0:
                  return [4, (0, _.get)({
                    url: o.urls.agents()
                  })];
                case 1:
                  return e = t.sent(), [2, i()(e)]
              }
            }))
          }));
          return function() {
            return e.apply(this, arguments)
          }
        }(),
        g = function() {
          var e = c((function(e, t) {
            var r;
            return u(this, (function(n) {
              switch (n.label) {
                case 0:
                  return [4, (0, _.patch)({
                    url: o.urls.agent(e),
                    data: t
                  })];
                case 1:
                  return r = n.sent(), [2, i()(r)]
              }
            }))
          }));
          return function(t, r) {
            return e.apply(this, arguments)
          }
        }()
    },
    649759: (e, t, r) => {
      r.r(t), r.d(t, {
        urls: () => _
      });
      var n = r(629133),
        i = r.n(n),
        a = "/agents",
        _ = {
          agents: function(e) {
            return i().isUndefined(e) ? a : "".concat(a, "?from_template=").concat(e)
          },
          agent: function(e) {
            return "".concat(a, "/").concat(e)
          }
        }
    },
    579487: (e, t, r) => {
      var n, i, a, _, o, s, c, u, l;
      r.r(t), r.d(t, {
          AskAboutPreset: () => c,
          BuilderConditions: () => n,
          MessageTypePreset: () => s,
          SentenceContainPreset: () => o,
          TalkAboutPreset: () => u,
          UserProvidesPreset: () => _,
          UserSentimentPreset: () => a,
          UserWantsPreset: () => i,
          WeekDays: () => l
        }),
        function(e) {
          e.USER_ASKS = "user_asks", e.MESSAGE_TYPE = "message_type", e.OUTSIDE_WORKTIME = "outside_worktime", e.SENTENCE_CONTAIN = "sentence_contain", e.USER_PROVIDES = "user_provides", e.USER_SENTIMENT = "user_sentiment", e.USER_WANTS = "user_wants", e.CUSTOM_CONDITION = "custom_condition", e.USER_ASKS_FIRST_TIME = "user_asks_first_time"
        }(n || (n = {})),
        function(e) {
          e.BUY_PURCHASE = "buy / purchase", e.GET_SUPPORT = "get support", e.RETURN_REFUND = "return / refund", e.SPEAK_TO_HUMAN = "speak to human"
        }(i || (i = {})),
        function(e) {
          e.ANGRY = "angry", e.CONFUSED = "confused", e.NEUTRAL = "neutral", e.HAPPY = "happy", e.UPSET = "upset"
        }(a || (a = {})),
        function(e) {
          e.EMAIL = "email", e.PHONE = "phone", e.NAME = "name", e.ADDRESS = "address"
        }(_ || (_ = {})),
        function(e) {
          e.GREETING = "greeting", e.PROFANITY = "profanity", e.URL = "url"
        }(o || (o = {})),
        function(e) {
          e.TEXT = "text", e.FILE = "file", e.AUDIO = "audio", e.VOICE_MESSAGE = "voice", e.PICTURE = "picture", e.STICKER = "sticker", e.CONTACT = "contact", e.LOCATION = "location", e.VIDEO = "video"
        }(s || (s = {})),
        function(e) {
          e.PRICE = "price", e.AVAILABILITY = "availability", e.DELIVERY_TIME = "delivery time", e.REFUND_POLICY = "refund policy", e.STATUS = "status", e.TROUBLESHOOTING = "troubleshooting"
        }(c || (c = {})),
        function(e) {
          e.PRODUCTS = "products", e.RETURNS = "returns", e.DELIEVERY = "delievery"
        }(u || (u = {})),
        function(e) {
          e.MON = "mon", e.TUE = "tue", e.WED = "wed", e.THU = "thu", e.FRI = "fri", e.SAT = "sat", e.SUN = "sun"
        }(l || (l = {}))
    },
    58931: (e, t, r) => {
      r.r(t), r.d(t, {
        AgentStatus: () => n.AgentStatus,
        AskAboutPreset: () => _.AskAboutPreset,
        AskForInfoPreset: () => o.AskForInfoPreset,
        BuilderActions: () => o.BuilderActions,
        BuilderConditions: () => _.BuilderConditions,
        ConditionItem: () => _.ConditionItem,
        CustomTaskComment: () => o.CustomTaskComment,
        EntityTypes: () => o.EntityTypes,
        ExactDeadline: () => o.ExactDeadline,
        ManageTagsMethod: () => o.ManageTagsMethod,
        ManageTagsTarget: () => o.ManageTagsTarget,
        MessageTypePreset: () => _.MessageTypePreset,
        ResponsibleUsersPresets: () => o.ResponsibleUsersPresets,
        SET_FIELD_TARGETS: () => o.SET_FIELD_TARGETS,
        SentenceContainPreset: () => _.SentenceContainPreset,
        SetFieldTargets: () => o.SetFieldTargets,
        SetFieldValueTypes: () => o.SetFieldValueTypes,
        TalkAboutPreset: () => _.TalkAboutPreset,
        TargetChangeResponsiblePreset: () => o.TargetChangeResponsiblePreset,
        TaskCommentPresets: () => o.TaskCommentPresets,
        TaskCommentSources: () => o.TaskCommentSources,
        TaskDeadlinePresets: () => o.TaskDeadlinePresets,
        UserProvidesPreset: () => _.UserProvidesPreset,
        UserSentimentPreset: () => _.UserSentimentPreset,
        UserWantsPreset: () => _.UserWantsPreset,
        WeekDays: () => _.WeekDays,
        createAgent: () => a.createAgent,
        getAgentIntegrations: () => a.getAgentIntegrations,
        getAgents: () => a.getAgents,
        queries: () => i.queries,
        updateAgent: () => a.updateAgent
      });
      var n = r(637243),
        i = r(73787),
        a = r(112388),
        _ = r(579487),
        o = r(164196)
    },
    637243: (e, t, r) => {
      var n;
      r.r(t), r.d(t, {
          AgentStatus: () => n
        }),
        function(e) {
          e.LIVE = "live", e.OFFLINE = "offline", e.DRAFT = "draft"
        }(n || (n = {}))
    },
    854737: (e, t, r) => {
      r.r(t), r.d(t, {
        getObjectSize: () => n
      });
      var n = function(e) {
        return new Blob([JSON.stringify(e)], {
          type: "application/json"
        }).size
      }
    },
    623084: (e, t, r) => {
      function n() {
        return APP.constant("widgets_cdn_base")
      }
      r.r(t), r.d(t, {
        getWidgetsCdnBase: () => n
      })
    },
    539910: (e, t, r) => {
      r.r(t), r.d(t, {
        getWidgetsCdnBase: () => n.getWidgetsCdnBase
      });
      var n = r(623084)
    },
    301980: (e, t, r) => {
      r.r(t), r.d(t, {
        getWidgetsCdnPath: () => i
      });
      var n = r(238600),
        i = function(e) {
          var t = (0, n.getWidgetsCdnBase)();
          return t && e.startsWith("/") ? t + e : e
        }
    },
    785412: (e, t, r) => {
      r.r(t), r.d(t, {
        getWidgetsCdnPath: () => n.getWidgetsCdnPath
      });
      var n = r(301980)
    },
    238600: (e, t, r) => {
      r.r(t), r.d(t, {
        getWidgetsCdnBase: () => i.getWidgetsCdnBase,
        getWidgetsCdnPath: () => n.getWidgetsCdnPath
      });
      var n = r(785412),
        i = r(539910)
    },
    258471: (e, t, r) => {
      r.r(t), r.d(t, {
        BackendMetricFromResponse: () => n.BackendMetricFromResponse,
        TrackedMetricGroupName: () => n.TrackedMetricGroupName,
        TrackedMetricName: () => n.TrackedMetricName,
        TrackedMetricType: () => n.TrackedMetricType,
        TrackedNavigationMetricName: () => n.TrackedNavigationMetricName,
        getBackendPerformanceMetric: () => n.getBackendPerformanceMetric,
        getDefaultMetricNamespace: () => n.getDefaultMetricNamespace,
        metricRegistry: () => n.metricRegistry,
        registerPerformanceMetrics: () => n.registerPerformanceMetrics,
        setDefaultMetricNamespace: () => n.setDefaultMetricNamespace,
        trackPerformanceMetric: () => n.trackPerformanceMetric
      });
      var n = r(126159)
    },
    126159: (e, t, r) => {
      r.r(t), r.d(t, {
        BackendMetricFromResponse: () => i.BackendMetricFromResponse,
        TrackedMetricGroupName: () => a.TrackedMetricGroupName,
        TrackedMetricName: () => a.TrackedMetricName,
        TrackedMetricType: () => a.TrackedMetricType,
        TrackedNavigationMetricName: () => a.TrackedNavigationMetricName,
        getBackendPerformanceMetric: () => i.getBackendPerformanceMetric,
        getDefaultMetricNamespace: () => _.getDefaultMetricNamespace,
        metricRegistry: () => o.metricRegistry,
        registerPerformanceMetrics: () => n.registerPerformanceMetrics,
        setDefaultMetricNamespace: () => _.setDefaultMetricNamespace,
        trackPerformanceMetric: () => n.trackPerformanceMetric
      });
      var n = r(150076),
        i = r(728894),
        a = r(761850),
        _ = r(787035),
        o = r(207246)
    },
    787035: (e, t, r) => {
      var n;
      r.r(t), r.d(t, {
        getDefaultMetricNamespace: () => _,
        lastResourceLength: () => i,
        setDefaultMetricNamespace: () => a
      });
      var i = 0,
        a = function(e) {
          n = e, i = performance.getEntriesByType("resource").length, APP.metricTracker.updateType(n)
        },
        _ = function() {
          return n
        }
    },
    207246: (e, t, r) => {
      r.r(t), r.d(t, {
        createMetricRegistry: () => o,
        metricRegistry: () => s
      });
      var n = r(629133),
        i = r.n(n),
        a = r(150076);

      function _(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }
      var o = function() {
          var e = {},
            t = {},
            r = function(t) {
              var r, n;
              APP.metricTracker.remove(t), null === (n = e[t]) || void 0 === n || null === (r = n.onClear) || void 0 === r || r.call(n), delete e[t]
            };
          return {
            changeRegisterTypeWithMetrics: function(t, r, n) {
              if (t) {
                var i = e[t];
                if (i) {
                  var o = {};
                  for (var s in i.metrics) o[s] = i.metrics[s].filter((function(e) {
                    return n.includes(e)
                  }));
                  e[r] = (p = function(e) {
                    for (var t = 1; t < arguments.length; t++) {
                      var r = null != arguments[t] ? arguments[t] : {},
                        n = Object.keys(r);
                      "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
                        return Object.getOwnPropertyDescriptor(r, e).enumerable
                      })))), n.forEach((function(t) {
                        _(e, t, r[t])
                      }))
                    }
                    return e
                  }({}, i), P = null != (P = {
                    metrics: o
                  }) ? P : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(p, Object.getOwnPropertyDescriptors(P)) : function(e, t) {
                    var r = Object.keys(e);
                    if (Object.getOwnPropertySymbols) {
                      var n = Object.getOwnPropertySymbols(e);
                      r.push.apply(r, n)
                    }
                    return r
                  }(Object(P)).forEach((function(e) {
                    Object.defineProperty(p, e, Object.getOwnPropertyDescriptor(P, e))
                  })), p), delete e[t];
                  var c = APP.constant("metricTracker"),
                    u = c[t];
                  if (u) {
                    var l = {};
                    for (var d in u) {
                      var f = u[d],
                        E = {};
                      for (var g in f) n.includes(g) && (E[g] = f[g]);
                      Object.keys(E).length && (l[d] = E)
                    }
                    c[r] = l, delete c[t]
                  }(0, a.checkIsCollected)(r)
                }
              }
              var p, P
            },
            register: function(t, r) {
              var n, i;
              e[t] || (e[t] = r, (n = APP.constant("metricTracker"))[i = t] || (n[i] = {}))
            },
            getAll: function() {
              return e
            },
            get: function(t) {
              return e[t]
            },
            clear: r,
            clearAll: function() {
              i().each(e, (function(e, t) {
                r(t)
              }))
            },
            getSendingQueue: function() {
              return t
            },
            setSending: function(e, r) {
              t[e] = r
            }
          }
        },
        s = o()
    },
    543069: (e, t, r) => {
      r.r(t), r.d(t, {
        send: () => y
      });
      var n = r(629133),
        i = r.n(n),
        a = r(972492),
        _ = r(728058),
        o = r(541872),
        s = r(592779),
        c = r(789074),
        u = r(242132),
        l = r(395468),
        d = r(518897),
        f = r(207246);

      function E(e, t, r, n, i, a, _) {
        try {
          var o = e[a](_),
            s = o.value
        } catch (e) {
          return void r(e)
        }
        o.done ? t(s) : Promise.resolve(s).then(n, i)
      }

      function g(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function p(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = null != arguments[t] ? arguments[t] : {},
            n = Object.keys(r);
          "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
            return Object.getOwnPropertyDescriptor(r, e).enumerable
          })))), n.forEach((function(t) {
            g(e, t, r[t])
          }))
        }
        return e
      }
      var P, A, y = (P = function(e) {
        var t, r, n, E, g, P;
        return function(e, t) {
          var r, n, i, a, _ = {
            label: 0,
            sent: function() {
              if (1 & i[0]) throw i[1];
              return i[1]
            },
            trys: [],
            ops: []
          };
          return a = {
            next: o(0),
            throw: o(1),
            return: o(2)
          }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
            return this
          }), a;

          function o(a) {
            return function(o) {
              return function(a) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; _;) try {
                  if (r = 1, n && (i = 2 & a[0] ? n.return : a[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, a[1])).done) return i;
                  switch (n = 0, i && (a = [2 & a[0], i.value]), a[0]) {
                    case 0:
                    case 1:
                      i = a;
                      break;
                    case 4:
                      return _.label++, {
                        value: a[1],
                        done: !1
                      };
                    case 5:
                      _.label++, n = a[1], a = [0];
                      continue;
                    case 7:
                      a = _.ops.pop(), _.trys.pop();
                      continue;
                    default:
                      if (!((i = (i = _.trys).length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                        _ = 0;
                        continue
                      }
                      if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
                        _.label = a[1];
                        break
                      }
                      if (6 === a[0] && _.label < i[1]) {
                        _.label = i[1], i = a;
                        break
                      }
                      if (i && _.label < i[2]) {
                        _.label = i[2], _.ops.push(a);
                        break
                      }
                      i[2] && _.ops.pop(), _.trys.pop();
                      continue
                  }
                  a = t.call(e, _)
                } catch (e) {
                  a = [6, e], n = 0
                } finally {
                  r = i = 0
                }
                if (5 & a[0]) throw a[1];
                return {
                  value: a[0] ? a[1] : void 0,
                  done: !0
                }
              }([a, o])
            }
          }
        }(this, (function(A) {
          switch (A.label) {
            case 0:
              if (t = e.type, r = e.params, n = f.metricRegistry.get(t), E = APP.metricTracker.get(t), !n || i().isEmpty(E)) return [2];
              if ((0, d.wasPageInactive)() || f.metricRegistry.getSendingQueue()[t]) return [2];
              g = i().pick(E, i().keys(n.metrics)), P = {
                common: (y = p({}, a.DEFAULT_METRIC_DATA), T = {
                  origin: location.origin,
                  experimentId: (0, o.getExperimentId)() || "",
                  type: t,
                  staticDomain: APP.static_build_domain || window.location.origin.split(".").slice(-2).join("."),
                  accountWeight: (0, u.getAccountWeight)(),
                  staticLoadType: (0, l.getStaticLoadType)()
                }, T = null != T ? T : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(y, Object.getOwnPropertyDescriptors(T)) : function(e, t) {
                  var r = Object.keys(e);
                  if (Object.getOwnPropertySymbols) {
                    var n = Object.getOwnPropertySymbols(e);
                    r.push.apply(r, n)
                  }
                  return r
                }(Object(T)).forEach((function(e) {
                  Object.defineProperty(y, e, Object.getOwnPropertyDescriptor(T, e))
                })), y),
                metrics: p({}, g, r)
              }, APP.first_load && (P.metrics.navigationStats = (0, s.getNavigationStats)(), P.metrics = p({}, P.metrics, (0, c.getConstantStats)())), A.label = 1;
            case 1:
              return A.trys.push([1, , 3, 4]), f.metricRegistry.setSending(t, !0), performance.clearResourceTimings(), [4, (0, _.retryAjax)({
                ajaxOptions: {
                  url: "".concat(APP.constant("fperf").url, "/api/v1/metrics"),
                  method: "POST",
                  contentType: "application/json",
                  data: JSON.stringify(P)
                },
                retries: 3
              })];
            case 2:
              return A.sent(), [3, 4];
            case 3:
              return f.metricRegistry.clear(t), f.metricRegistry.setSending(t, !1), [7];
            case 4:
              return [2]
          }
          var y, T
        }))
      }, A = function() {
        var e = this,
          t = arguments;
        return new Promise((function(r, n) {
          var i = P.apply(e, t);

          function a(e) {
            E(i, r, n, a, _, "next", e)
          }

          function _(e) {
            E(i, r, n, a, _, "throw", e)
          }
          a(void 0)
        }))
      }, function(e) {
        return A.apply(this, arguments)
      })
    },
    518897: (e, t, r) => {
      r.r(t), r.d(t, {
        wasPageInactive: () => c
      });
      var n = r(334254),
        i = r.n(n),
        a = r(629133),
        _ = r.n(a),
        o = r(207246),
        s = i().hidden(),
        c = function() {
          return s || APP.metrics.wasPageInactiveDuringPageLoad
        };
      i().change((function() {
        var e = i().hidden();
        if (e) o.metricRegistry.clearAll();
        else if (_().isEmpty(o.metricRegistry.getAll())) return void(s = !1);
        s = s || e
      }))
    },
    150076: (e, t, r) => {
      r.r(t), r.d(t, {
        checkIsCollected: () => u,
        registerPerformanceMetrics: () => d,
        trackPerformanceMetric: () => l
      });
      var n = r(629133),
        i = r.n(n),
        a = r(156040),
        _ = r(207246),
        o = r(518897),
        s = r(543069),
        c = r(787035),
        u = function(e) {
          var t = APP.metricTracker.get(e),
            r = _.metricRegistry.get(e);
          i().isEmpty(t) || r && i().every(r.metrics, (function(e, r) {
            var n = t[r];
            return !!n && i().every(e, (function(e) {
              return e in n
            }))
          })) && (APP.constant("load_from_server") ? (0, a.onPageFullyLoaded)((function() {
            return (0, s.send)({
              type: e
            })
          })) : (0, s.send)({
            type: e
          }))
        },
        l = function(e) {
          var t = e.type,
            r = void 0 === t ? (0, c.getDefaultMetricNamespace)() : t,
            n = e.name,
            i = void 0 === n ? "" : n,
            a = e.value,
            o = e.group;
          r && setTimeout((function() {
            var e;
            if (_.metricRegistry.get(r)) {
              var t = APP.first_load || APP.constant("load_from_server"),
                n = a || Math.ceil(APP.metricTracker.getCurrentTime(!t));
              APP.metricTracker.set({
                type: r,
                name: i,
                value: n,
                group: o
              }), null === (e = _.metricRegistry.get(r)) || void 0 === e || e.onMetricCollect(i), u(r)
            }
          }))
        },
        d = function(e) {
          var t = e.type,
            r = void 0 === t ? (0, c.getDefaultMetricNamespace)() : t,
            n = e.metrics,
            a = e.onMetricCollect,
            s = void 0 === a ? i().noop : a,
            l = e.onClear,
            d = void 0 === l ? i().noop : l;
          return !(!r || (0, o.wasPageInactive)() || (_.metricRegistry.register(r, {
            metrics: n,
            onMetricCollect: s,
            onClear: d
          }), APP.metricTracker.get(r) && u(r), 0))
        }
    },
    761850: (e, t, r) => {
      var n, i, a;
      r.r(t), r.d(t, {
          TrackedMetricGroupName: () => a,
          TrackedMetricName: () => i,
          TrackedMetricType: () => n,
          TrackedNavigationMetricName: () => _
        }),
        function(e) {
          e.LEAD_CARD = "LEAD_CARD", e.LEAD_CARD_NAVIGATION = "LEAD_CARD_NAVIGATION", e.CUSTOMERS_CARD = "CUSTOMERS_CARD", e.CUSTOMERS_CARD_NAVIGATION = "CUSTOMERS_CARD_NAVIGATION", e.COMPANIES_CARD = "COMPANIES_CARD", e.COMPANIES_CARD_NAVIGATION = "COMPANIES_CARD_NAVIGATION", e.CONTACTS_CARD = "CONTACTS_CARD", e.CONTACTS_CARD_NAVIGATION = "CONTACTS_CARD_NAVIGATION", e.INBOX_DIALOGS = "INBOX_DIALOGS", e.INBOX_EMPTY_DIALOGS = "INBOX_EMPTY_DIALOGS", e.INBOX_EMPTY_DIALOGS_NAVIGATION = "INBOX_EMPTY_DIALOGS_NAVIGATION", e.INBOX_DIALOGS_NAVIGATION = "INBOX_DIALOGS_NAVIGATION", e.INBOX_WITH_LEAD_CARD = "INBOX_WITH_LEAD_CARD", e.INBOX_WITH_LEAD_CARD_NAVIGATION = "INBOX_WITH_LEAD_CARD_NAVIGATION", e.INBOX_WITH_CONTACT_CARD = "INBOX_WITH_CONTACT_CARD", e.INBOX_WITH_CONTACT_CARD_NAVIGATION = "INBOX_WITH_CONTACT_CARD_NAVIGATION", e.INBOX_WITH_CUSTOMERS_CARD = "INBOX_WITH_CUSTOMERS_CARD", e.INBOX_WITH_CUSTOMERS_CARD_NAVIGATION = "INBOX_WITH_CUSTOMERS_CARD_NAVIGATION", e.INBOX_WITH_LEAD_CARD_NO_SELECTED = "INBOX_WITH_LEAD_CARD_NO_SELECTED", e.INBOX_WITH_LEAD_CARD_NO_SELECTED_NAVIGATION = "INBOX_WITH_LEAD_CARD_NO_SELECTED_NAVIGATION", e.LEADS_PIPELINE = "LEADS_PIPELINE", e.LEADS_PIPELINE_NAVIGATION = "LEADS_PIPELINE_NAVIGATION", e.LEADS_LIST = "LEADS_LIST", e.LEADS_LIST_NAVIGATION = "LEADS_LIST_NAVIGATION"
        }(n || (n = {})),
        function(e) {
          e.CHAT_FCP = "chatFcp", e.CHAT_TTI = "chatTti", e.CARD_FCP = "cardFcp", e.CARD_TTI = "cardTti", e.FEED_FCP = "feedFcp", e.FEED_TTI = "feedTti", e.COMPOSE_TTI = "composeTti", e.FEED_PLUG_FCP = "feedPlugFcp", e.FEED_PLUG_TTI = "feedPlugTti", e.WIDGETS_TTI = "widgetsTti", e.PIPELINE_FCP = "pipelineFcp", e.PIPELINE_TTI = "pipelineTti", e.LIST_FCP = "listFcp", e.LIST_TTI = "listTti"
        }(i || (i = {})),
        function(e) {
          e.FCP = "fcp", e.TTI = "tti", e.TIMELINE_ENDPOINTS_STATS = "timelineEndpointStats", e.WIDGETS = "widgets"
        }(a || (a = {}));
      var _ = ["nextHopProtocol", "startTime", "duration", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "secureConnectionStart", "connectEnd", "requestStart", "responseStart", "responseEnd", "transferSize", "encodedBodySize", "decodedBodySize"]
    },
    242132: (e, t, r) => {
      r.r(t), r.d(t, {
        getAccountWeight: () => i
      });
      var n = r(854737),
        i = function() {
          var e = APP.constant("account").cf,
            t = (0, n.getObjectSize)(e) / 1024;
          return t <= 100 ? 1 : t <= 1e3 ? 2 : t <= 3e3 ? 3 : 4
        }
    },
    462889: (e, t, r) => {
      function n(e, t, r) {
        return n = c() ? Reflect.construct : function(e, t, r) {
          var n = [null];
          n.push.apply(n, t);
          var i = new(Function.bind.apply(e, n));
          return r && o(i, r.prototype), i
        }, n.apply(null, arguments)
      }

      function i(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      function a(e) {
        return a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
          return e.__proto__ || Object.getPrototypeOf(e)
        }, a(e)
      }

      function _(e, t) {
        return null != t && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? !!t[Symbol.hasInstance](e) : e instanceof t
      }

      function o(e, t) {
        return o = Object.setPrototypeOf || function(e, t) {
          return e.__proto__ = t, e
        }, o(e, t)
      }

      function s(e) {
        var t = "function" == typeof Map ? new Map : void 0;
        return s = function(e) {
          if (null === e || (r = e, -1 === Function.toString.call(r).indexOf("[native code]"))) return e;
          var r;
          if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");
          if (void 0 !== t) {
            if (t.has(e)) return t.get(e);
            t.set(e, i)
          }

          function i() {
            return n(e, arguments, a(this).constructor)
          }
          return i.prototype = Object.create(e.prototype, {
            constructor: {
              value: i,
              enumerable: !1,
              writable: !0,
              configurable: !0
            }
          }), o(i, e)
        }, s(e)
      }

      function c() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
        } catch (e) {
          return !1
        }
      }
      r.r(t), r.d(t, {
        getBackendPerformanceMetric: () => l
      });
      var u = function(e) {
          ! function(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && o(e, t)
          }(i, e);
          var t, r, n = (t = i, r = c(), function() {
            var e, n = a(t);
            if (r) {
              var i = a(this).constructor;
              e = Reflect.construct(n, arguments, i)
            } else e = n.apply(this, arguments);
            return function(e, t) {
              return !t || "object" != ((r = t) && "undefined" != typeof Symbol && r.constructor === Symbol ? "symbol" : typeof r) && "function" != typeof t ? function(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
              }(e) : t;
              var r
            }(this, e)
          });

          function i() {
            return function(e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, i), n.apply(this, arguments)
          }
          return i
        }(s(Error)),
        l = function(e) {
          var t, r, n = e.request,
            a = e.url;
          try {
            var o = function(e) {
              var t = performance.getEntriesByType("resource").filter((function(t) {
                return t.name.startsWith(e)
              }));
              if (t.length > 1) throw new u;
              var r = t[0];
              return _(r, PerformanceResourceTiming) ? {
                nextHopProtocol: r.nextHopProtocol,
                startTime: r.startTime,
                duration: r.duration,
                fetchStart: r.fetchStart,
                domainLookupStart: r.domainLookupStart,
                domainLookupEnd: r.domainLookupEnd,
                connectStart: r.connectStart,
                secureConnectionStart: r.secureConnectionStart,
                connectEnd: r.connectEnd,
                requestStart: r.requestStart,
                responseStart: r.responseStart,
                responseEnd: r.responseEnd,
                transferSize: r.transferSize,
                encodedBodySize: r.encodedBodySize,
                decodedBodySize: r.decodedBodySize
              } : null
            }(a);
            if (n) {
              var s = n.getResponseHeader("x-runtime-generated"),
                c = s ? Math.ceil(1e3 * parseFloat(s)) : null;
              return t = function(e) {
                for (var t = 1; t < arguments.length; t++) {
                  var r = null != arguments[t] ? arguments[t] : {},
                    n = Object.keys(r);
                  "function" == typeof Object.getOwnPropertySymbols && (n = n.concat(Object.getOwnPropertySymbols(r).filter((function(e) {
                    return Object.getOwnPropertyDescriptor(r, e).enumerable
                  })))), n.forEach((function(t) {
                    i(e, t, r[t])
                  }))
                }
                return e
              }({}, o), r = null != (r = {
                runtimeGenerated: c
              }) ? r : {}, Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : function(e, t) {
                var r = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                  var n = Object.getOwnPropertySymbols(e);
                  r.push.apply(r, n)
                }
                return r
              }(Object(r)).forEach((function(e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e))
              })), t
            }
            return o
          } catch (e) {
            return _(e, u) ? "duplicated-metric-error" : "undefined-error"
          }
        }
    },
    633662: (e, t, r) => {
      r.r(t)
    },
    728894: (e, t, r) => {
      r.r(t), r.d(t, {
        BackendMetricFromResponse: () => i.BackendMetricFromResponse,
        BackendPerformanceMetric: () => i.BackendPerformanceMetric,
        getBackendPerformanceMetric: () => n.getBackendPerformanceMetric
      });
      var n = r(462889),
        i = r(633662)
    },
    134571: (e, t, r) => {
      r.r(t), r.d(t, {
        getConstantStats: () => c
      });
      var n = r(629133),
        i = r.n(n),
        a = r(500034),
        _ = r(728894);

      function o(e, t, r, n, i, a, _) {
        try {
          var o = e[a](_),
            s = o.value
        } catch (e) {
          return void r(e)
        }
        o.done ? t(s) : Promise.resolve(s).then(n, i)
      }
      var s = "".concat(window.location.origin, "/frontend/constants/"),
        c = function() {
          if ((0, a.isFeatureAvailable)(a.Features.ASYNC_CONSTANTS)) {
            var e, t, r = performance.getEntriesByType("resource"),
              n = {};
            return r.forEach((e = function(e) {
              var t;
              return function(e, t) {
                var r, n, i, a, _ = {
                  label: 0,
                  sent: function() {
                    if (1 & i[0]) throw i[1];
                    return i[1]
                  },
                  trys: [],
                  ops: []
                };
                return a = {
                  next: o(0),
                  throw: o(1),
                  return: o(2)
                }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
                  return this
                }), a;

                function o(a) {
                  return function(o) {
                    return function(a) {
                      if (r) throw new TypeError("Generator is already executing.");
                      for (; _;) try {
                        if (r = 1, n && (i = 2 & a[0] ? n.return : a[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, a[1])).done) return i;
                        switch (n = 0, i && (a = [2 & a[0], i.value]), a[0]) {
                          case 0:
                          case 1:
                            i = a;
                            break;
                          case 4:
                            return _.label++, {
                              value: a[1],
                              done: !1
                            };
                          case 5:
                            _.label++, n = a[1], a = [0];
                            continue;
                          case 7:
                            a = _.ops.pop(), _.trys.pop();
                            continue;
                          default:
                            if (!((i = (i = _.trys).length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                              _ = 0;
                              continue
                            }
                            if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
                              _.label = a[1];
                              break
                            }
                            if (6 === a[0] && _.label < i[1]) {
                              _.label = i[1], i = a;
                              break
                            }
                            if (i && _.label < i[2]) {
                              _.label = i[2], _.ops.push(a);
                              break
                            }
                            i[2] && _.ops.pop(), _.trys.pop();
                            continue
                        }
                        a = t.call(e, _)
                      } catch (e) {
                        a = [6, e], n = 0
                      } finally {
                        r = i = 0
                      }
                      if (5 & a[0]) throw a[1];
                      return {
                        value: a[0] ? a[1] : void 0,
                        done: !0
                      }
                    }([a, o])
                  }
                }
              }(this, (function(r) {
                return i = e, (null != (a = PerformanceResourceTiming) && "undefined" != typeof Symbol && a[Symbol.hasInstance] ? a[Symbol.hasInstance](i) : i instanceof a) && e.name.includes(s) ? (t = e.name.replace(s, "").replace(/\//g, ""), n[t] = (0, _.getBackendPerformanceMetric)({
                  url: e.name
                }), [2]) : [2];
                var i, a
              }))
            }, t = function() {
              var t = this,
                r = arguments;
              return new Promise((function(n, i) {
                var a = e.apply(t, r);

                function _(e) {
                  o(a, n, i, _, s, "next", e)
                }

                function s(e) {
                  o(a, n, i, _, s, "throw", e)
                }
                _(void 0)
              }))
            }, function(e) {
              return t.apply(this, arguments)
            })), i().isEmpty(n) ? void 0 : n
          }
        }
    },
    789074: (e, t, r) => {
      r.r(t), r.d(t, {
        getConstantStats: () => n.getConstantStats
      });
      var n = r(134571)
    },
    462680: (e, t, r) => {
      r.r(t), r.d(t, {
        getExperimentId: () => i
      });
      var n = r(500034),
        i = function() {
          if (!0 === (0, n.isFeatureAvailable)(n.Features.ASYNC_CONSTANTS)) return "prod_".concat(n.Features.ASYNC_CONSTANTS, "_v1")
        }
    },
    541872: (e, t, r) => {
      r.r(t), r.d(t, {
        getExperimentId: () => n.getExperimentId
      });
      var n = r(462680)
    },
    348024: (e, t, r) => {
      function n(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
        return n
      }
      r.r(t), r.d(t, {
        getNavigationStats: () => i
      });
      var i = function() {
        var e, t, r, i, a = (r = performance.getEntriesByType("navigation"), i = 1, function(e) {
          if (Array.isArray(e)) return e
        }(r) || function(e, t) {
          var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
          if (null != r) {
            var n, i, a = [],
              _ = !0,
              o = !1;
            try {
              for (r = r.call(e); !(_ = (n = r.next()).done) && (a.push(n.value), !t || a.length !== t); _ = !0);
            } catch (e) {
              o = !0, i = e
            } finally {
              try {
                _ || null == r.return || r.return()
              } finally {
                if (o) throw i
              }
            }
            return a
          }
        }(r, i) || function(e, t) {
          if (e) {
            if ("string" == typeof e) return n(e, t);
            var r = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(r) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? n(e, t) : void 0
          }
        }(r, i) || function() {
          throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }())[0];
        return e = a, (null != (t = PerformanceNavigationTiming) && "undefined" != typeof Symbol && t[Symbol.hasInstance] ? t[Symbol.hasInstance](e) : e instanceof t) ? {
          nextHopProtocol: a.nextHopProtocol,
          startTime: a.startTime,
          duration: a.duration,
          fetchStart: a.fetchStart,
          domainLookupStart: a.domainLookupStart,
          domainLookupEnd: a.domainLookupEnd,
          connectStart: a.connectStart,
          secureConnectionStart: a.secureConnectionStart,
          connectEnd: a.connectEnd,
          requestStart: a.requestStart,
          responseStart: a.responseStart,
          responseEnd: a.responseEnd,
          transferSize: a.transferSize,
          encodedBodySize: a.encodedBodySize,
          decodedBodySize: a.decodedBodySize
        } : null
      }
    },
    592779: (e, t, r) => {
      r.r(t), r.d(t, {
        getNavigationStats: () => n.getNavigationStats
      });
      var n = r(348024)
    },
    649002: (e, t, r) => {
      r.r(t), r.d(t, {
        getStaticLoadType: () => a
      });
      var n = r(335745),
        i = r(787035),
        a = function() {
          var e = (0, n.getResourcesStats)({
            resourceIndexStart: i.lastResourceLength
          });
          switch (!e.css.internal.uncachedCount && !e.js.internal.uncachedCount) {
            case !0:
              return 1;
            case !1:
              return 0
          }
        }
    },
    395468: (e, t, r) => {
      r.r(t), r.d(t, {
        getStaticLoadType: () => n.getStaticLoadType
      });
      var n = r(649002)
    },
    728058: (e, t, r) => {
      r.r(t), r.d(t, {
        retryAjax: () => s
      });
      var n = r(661533);

      function i(e, t, r, n, i, a, _) {
        try {
          var o = e[a](_),
            s = o.value
        } catch (e) {
          return void r(e)
        }
        o.done ? t(s) : Promise.resolve(s).then(n, i)
      }

      function a(e) {
        return function() {
          var t = this,
            r = arguments;
          return new Promise((function(n, a) {
            var _ = e.apply(t, r);

            function o(e) {
              i(_, n, a, o, s, "next", e)
            }

            function s(e) {
              i(_, n, a, o, s, "throw", e)
            }
            o(void 0)
          }))
        }
      }

      function _(e, t) {
        var r, n, i, a, _ = {
          label: 0,
          sent: function() {
            if (1 & i[0]) throw i[1];
            return i[1]
          },
          trys: [],
          ops: []
        };
        return a = {
          next: o(0),
          throw: o(1),
          return: o(2)
        }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
          return this
        }), a;

        function o(a) {
          return function(o) {
            return function(a) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; _;) try {
                if (r = 1, n && (i = 2 & a[0] ? n.return : a[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, a[1])).done) return i;
                switch (n = 0, i && (a = [2 & a[0], i.value]), a[0]) {
                  case 0:
                  case 1:
                    i = a;
                    break;
                  case 4:
                    return _.label++, {
                      value: a[1],
                      done: !1
                    };
                  case 5:
                    _.label++, n = a[1], a = [0];
                    continue;
                  case 7:
                    a = _.ops.pop(), _.trys.pop();
                    continue;
                  default:
                    if (!((i = (i = _.trys).length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                      _ = 0;
                      continue
                    }
                    if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
                      _.label = a[1];
                      break
                    }
                    if (6 === a[0] && _.label < i[1]) {
                      _.label = i[1], i = a;
                      break
                    }
                    if (i && _.label < i[2]) {
                      _.label = i[2], _.ops.push(a);
                      break
                    }
                    i[2] && _.ops.pop(), _.trys.pop();
                    continue
                }
                a = t.call(e, _)
              } catch (e) {
                a = [6, e], n = 0
              } finally {
                r = i = 0
              }
              if (5 & a[0]) throw a[1];
              return {
                value: a[0] ? a[1] : void 0,
                done: !0
              }
            }([a, o])
          }
        }
      }
      var o, s = (o = a((function(e) {
        var t, r, i;
        return _(this, (function(o) {
          return t = e.retries, r = e.ajaxOptions, i = function() {
            var e = a((function(e) {
              var t;
              return _(this, (function(a) {
                switch (a.label) {
                  case 0:
                    return a.trys.push([0, 2, , 3]), [4, n.ajaxPromisify(r)];
                  case 1:
                    return [2, a.sent()];
                  case 2:
                    if (t = a.sent(), e > 0) return [2, i(e - 1)];
                    throw t;
                  case 3:
                    return [2]
                }
              }))
            }));
            return function(t) {
              return e.apply(this, arguments)
            }
          }(), [2, i(t)]
        }))
      })), function(e) {
        return o.apply(this, arguments)
      })
    },
    226218: (e, t, r) => {
      r.r(t), r.d(t, {
        isTabVisible: () => n.isTabVisible
      });
      var n = r(76410)
    },
    76410: (e, t, r) => {
      r.r(t), r.d(t, {
        isTabVisible: () => a
      });
      var n = r(334254),
        i = r.n(n),
        a = function() {
          return "visible" === i().state()
        }
    },
    156481: (e, t, r) => {
      r.r(t), r.d(t, {
        DAY: () => u,
        DEFAULT_WORK_TIME: () => g,
        END_WORK_TIME: () => E,
        HOUR: () => c,
        MINUTE: () => s,
        MONTH: () => d,
        NUMBER_TO_WEEK_DAY_MAP: () => P,
        SECOND: () => o,
        START_WORK_TIME: () => f,
        WEEK: () => l,
        WEEK_DAY_TO_NUMBER_MAP: () => p,
        allDaysAndTimePreset: () => A
      });
      var n = r(58931),
        i = r(656776);

      function a(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }
      var _, o = 1e3,
        s = 60 * o,
        c = 60 * s,
        u = 24 * c,
        l = 7 * u,
        d = 30 * u,
        f = "10:00",
        E = "19:00",
        g = "00:00",
        p = (a(_ = {}, n.WeekDays.MON, 1), a(_, n.WeekDays.TUE, 2), a(_, n.WeekDays.WED, 3), a(_, n.WeekDays.THU, 4), a(_, n.WeekDays.FRI, 5), a(_, n.WeekDays.SAT, 6), a(_, n.WeekDays.SUN, 7), _),
        P = {
          1: n.WeekDays.MON,
          2: n.WeekDays.TUE,
          3: n.WeekDays.WED,
          4: n.WeekDays.THU,
          5: n.WeekDays.FRI,
          6: n.WeekDays.SAT,
          7: n.WeekDays.SUN
        },
        A = [{
          weekDays: [n.WeekDays.MON, n.WeekDays.TUE, n.WeekDays.WED, n.WeekDays.THU, n.WeekDays.FRI, n.WeekDays.SAT, n.WeekDays.SUN],
          timeFrom: (0, i.convertTimeToUtcSeconds)(g),
          timeTo: (0, i.convertTimeToUtcSeconds)(g)
        }]
    },
    675342: (e, t, r) => {
      r.r(t), r.d(t, {
        getMomentDays: () => l,
        getTitleWorkingHours: () => P,
        getWeekDaysString: () => g,
        isAlwaysPreset: () => p,
        isSundayFirst: () => d,
        numbersToWeekDays: () => E,
        weekDaysToNumbers: () => f
      });
      var n = r(161320),
        i = r.n(n),
        a = r(445368),
        _ = r(58931),
        o = r(513017),
        s = r(909599),
        c = r(656776),
        u = r(156481),
        l = function(e) {
          return i()().day(e).format("dd")
        },
        d = function() {
          return 6 === parseInt(i()().endOf("week").format("d"))
        },
        f = function(e) {
          return e.map((function(e) {
            return e === _.WeekDays.SUN && d() ? 0 : u.WEEK_DAY_TO_NUMBER_MAP[e]
          }))
        },
        E = function(e) {
          return e.map((function(e) {
            return 0 === e && d() ? u.NUMBER_TO_WEEK_DAY_MAP[7] : u.NUMBER_TO_WEEK_DAY_MAP[e]
          })).filter((function(e) {
            return void 0 !== e
          }))
        },
        g = function(e) {
          return e.map((function(e) {
            return {
              name: l(u.WEEK_DAY_TO_NUMBER_MAP[e]),
              value: u.WEEK_DAY_TO_NUMBER_MAP[e]
            }
          }))
        },
        p = function(e) {
          if (1 !== e.length) return !1;
          var t = e[0],
            r = (0, c.convertUtcSecondsToTimeString)(t.timeFrom),
            n = (0, c.convertUtcSecondsToTimeString)(t.timeTo),
            i = [s.DEFAULT_WORK_TIME, "12:00AM"];
          return 7 === t.weekDays.length && i.includes(r) && i.includes(n)
        },
        P = function(e) {
          if (p(e)) return (0, a.i18n)("always");
          var t = "";
          return e.forEach((function(e) {
            var r = g(e.weekDays),
              n = (0, c.convertUtcSecondsToTimeString)(e.timeFrom),
              i = (0, c.convertUtcSecondsToTimeString)(e.timeTo);
            "11:59 PM" !== i && "23:59" !== i || (i = "11:59 PM" === i ? "12:00 AM" : "00:00"), t += "".concat(o.default.daysFormater(r, d()), " ").concat((0, a.i18n)("from time"), " ").concat(n, " ").concat((0, a.i18n)("till time"), " ").concat(i, "; \r\n")
          })), t
        }
    },
    367927: (e, t, r) => {
      r.r(t), r.d(t, {
        getMomentDays: () => n.getMomentDays,
        getTitleWorkingHours: () => n.getTitleWorkingHours,
        getWeekDaysString: () => n.getWeekDaysString,
        isSundayFirst: () => n.isSundayFirst,
        weekDaysToNumbers: () => n.weekDaysToNumbers
      });
      var n = r(675342)
    },
    836972: (e, t, r) => {
      r.r(t), r.d(t, {
        SERVER_TIME_COOKIE_KEY: () => i,
        getServerTime: () => a
      });
      var n = r(509372),
        i = "server_time",
        a = function() {
          return (0, n.get)(i)
        }
    },
    909599: (e, t, r) => {
      r.r(t), r.d(t, {
        DAY: () => n.DAY,
        DEFAULT_WORK_TIME: () => n.DEFAULT_WORK_TIME,
        END_WORK_TIME: () => n.END_WORK_TIME,
        HOUR: () => n.HOUR,
        MINUTE: () => n.MINUTE,
        MONTH: () => n.MONTH,
        NUMBER_TO_WEEK_DAY_MAP: () => n.NUMBER_TO_WEEK_DAY_MAP,
        SECOND: () => n.SECOND,
        SERVER_TIME_COOKIE_KEY: () => i.SERVER_TIME_COOKIE_KEY,
        START_WORK_TIME: () => n.START_WORK_TIME,
        WEEK: () => n.WEEK,
        WEEK_DAY_TO_NUMBER_MAP: () => n.WEEK_DAY_TO_NUMBER_MAP,
        allDaysAndTimePreset: () => n.allDaysAndTimePreset,
        convertTimeToUtcSeconds: () => _.convertTimeToUtcSeconds,
        convertUtcSecondsToTimeString: () => _.convertUtcSecondsToTimeString,
        getMomentDays: () => a.getMomentDays,
        getServerTime: () => i.getServerTime,
        getTitleWorkingHours: () => a.getTitleWorkingHours,
        getWeekDaysString: () => a.getWeekDaysString,
        isSundayFirst: () => a.isSundayFirst
      });
      var n = r(156481),
        i = r(836972),
        a = r(367927),
        _ = r(656776)
    },
    656776: (e, t, r) => {
      r.r(t), r.d(t, {
        convertTimeToUtcSeconds: () => u,
        convertUtcSecondsToTimeString: () => l
      });
      var n, i, a, _ = r(161320),
        o = r.n(_),
        s = 12 === ((null === (a = APP) || void 0 === a || null === (i = a.system) || void 0 === i || null === (n = i.format) || void 0 === n ? void 0 : n.time) || 12),
        c = s ? "h:mmA" : "HH:mm",
        u = function(e) {
          var t = !0,
            r = !1,
            n = void 0;
          try {
            for (var i, a = ["HH:mm", "h:mmA"][Symbol.iterator](); !(t = (i = a.next()).done); t = !0) {
              var _ = i.value,
                s = o()(e, _, !0);
              if (s.isValid()) return s.utc().unix()
            }
          } catch (e) {
            r = !0, n = e
          } finally {
            try {
              t || null == a.return || a.return()
            } finally {
              if (r) throw n
            }
          }
          return 0
        },
        l = function(e) {
          var t = o().unix(e);
          return t.isValid() ? t.format(c) : s ? "12:00AM" : "00:00"
        }
    },
    137233: (e, t, r) => {
      r.r(t), r.d(t, {
        getFileExtension: () => a
      });
      var n = r(629133),
        i = r.n(n),
        a = function(e) {
          return i().last(e.match(/\.([a-z0-9]{0,4})$/gi) || [""]) || ""
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
      t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "88e3e137-3b3f-40c7-9421-c8977a602fc8", e._sentryDebugIdIdentifier = "sentry-dbid-88e3e137-3b3f-40c7-9421-c8977a602fc8")
    } catch (e) {}
  }();
//# sourceMappingURL=69832.66dbe284b307fbe22bb2.js.map