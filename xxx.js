!function (t) {
    function e(t) {
        this.opts = {
            inputCDom: [],
            divClass: "",
            itemClass: "",
            hoverClass: "",
            onChange: o,
            onSelection: o
        },
            i(this.opts, t || {}),
            this.isShow = !1;
        var e = document.createElement("div");
        e.className = this.opts.divClass,
            e.style.cssText = "display:none;position:absolute;z-index:20001;background-color:#fff",
            document.body.appendChild(e),
            this.div = e,
            this._bindEvent()
    }

    var o = function () {
    }
        , i = t.extend;
    e.prototype = {
        constructor: e,
        _bindEvent: function () {
            var t = this
                , e = t.opts.inputCDom;
            e.attr("lastvalue", e.value()),
                e.bind("keyup", function (o) {
                    if (13 !== o.keyCode) {
                        var i = e.value();
                        i !== e.attr("lastvalue") && (e.attr("lastvalue", i),
                            t.opts.onChange.call(this))
                    }
                }),
                e.bind("keydown", function (o) {
                    if (t.isShow) {
                        var i = t.items.length - 1
                            , s = t.hoverItemIndex;
                        switch (o.keyCode) {
                            case 38:
                                s -= 1,
                                s < 0 && (s = i),
                                    t._addHover(s);
                                break;
                            case 40:
                                s += 1,
                                s > i && (s = 0),
                                    t._addHover(s);
                                break;
                            case 13:
                                o.stop(),
                                    e.value() ? (t.opts.onSelection(t.hoverItem[0]),
                                        e.trigger("blur")) : (t.div.innerHTML = "",
                                        t.div.style.display = "none");
                                break;
                            case 37:
                            case 39:
                                o.stop()
                        }
                    }
                }),
                e.bind("blur", function (e) {
                    t.div.innerHTML = "",
                        t.div.style.display = "none"
                })
        },
        _addHover: function (e) {
            this.hoverItemIndex = e;
            var o = this.opts.hoverClass;
            t(this.div).find("." + o).removeClass(o);
            var i = t(this.items[e]);
            i.addClass(o),
                this.hoverItem = i
        },
        _position: function () {
            var e = this.div
                , o = this.opts.inputCDom.offset()
                , i = t(e).offset()
                , s = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth
                , n = window.innerHeight || document.documentElement.clientHeight || document.body.offsetHeight
                , d = document.documentElement.scrollTop || document.body.scrollTop;
            e.style.right = s - o.right + "px",
                d + n - o.top - o.height > i.height ? e.style.top = o.top + o.height + "px" : o.top - d > i.height ? e.style.top = o.top - i.height + "px" : e.style.top = o.top + o.height + "px"
        },
        onReady: function (e) {
            var o = this
                , i = t(this.div);
            if (!e)
                return void i.hide();
            i.html(e),
                i.show(),
                this.isShow = !0;
            var e = i.find("." + this.opts.itemClass)
                , s = this.opts.hoverClass;
            e.bind("mouseover", function () {
                i.find("." + s).removeClass(s),
                    t(this).addClass(s)
            }).bind("mouseout", function () {
                t(this).removeClass(s)
            }).bind("mousedown", function () {
                o.opts.onSelection(this),
                    o.opts.inputCDom.trigger("blur")
            }),
                this.items = e,
                this._addHover(0),
                this._position()
        }
    },
        t.Autocomplete = e
}(cQuery);
!function (t, e) {
    "use strict";
    var o = {
        extend: function () {
            var t, o, n = arguments[0] || {}, i = 1, s = arguments.length, a = !1;
            for ("boolean" == typeof n && (a = n,
                n = arguments[1] || {},
                i = 2),
                 s === i && (n = this,
                     --i); i < s; i++)
                if (null != (t = arguments[i]))
                    for (var h in t)
                        o = t[h],
                        n !== o && o !== e && (n[h] = o);
            return n
        }
    }
        , n = function (t) {
        this.init(t)
    };
    n.prototype = {
        init: function (t) {
            var e = {
                obj: "",
                shade: {
                    shadeObj: null,
                    hasShade: !0,
                    cssText: "z-index:10000;background:#000;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);opacity:0.5;left:0;top:0;position:absolute;display:none;"
                },
                hasScroll: !1,
                zIndex: 10001,
                padding: "160|160",
                min: "700|580",
                hasResize: !0,
                onChange: function () {
                },
                onShow: function () {
                },
                onHide: function () {
                }
            };
            this.opts = o.extend(e, t),
            this.opts.obj && (this.shade = this._createShade(),
                this.opts.obj.style.position = "absolute",
                this.opts.obj.style.zIndex = this.opts.zIndex,
            this.opts.hasResize && this.addResizer())
        },
        addResizer: function () {
            var e = this
                , o = null
                , n = 200;
            t.addEventListener ? t.addEventListener("resize", function () {
                clearTimeout(o),
                    o = setTimeout(function () {
                        e._render()
                    }, n)
            }, !1) : t.attachEvent("onresize", function () {
                clearTimeout(o),
                    o = setTimeout(function () {
                        e._render()
                    }, n)
            }),
            t.onorientationchange && (t.onorientationchange = function () {
                    clearTimeout(o),
                        o = setTimeout(function () {
                            e._render()
                        }, n)
                }
            )
        },
        _createShade: function () {
            var t = this.opts.shade;
            if (!t.hasShade)
                return null;
            if (t.shadeObj)
                return t.shadeObj;
            var e = document.createElement("div")
                , o = this._getScreenInfo()
                , n = "width:100%;height:" + o.h + "px;" + t.cssText;
            return e.style.cssText = n,
                document.body.appendChild(e),
                e
        },
        _getScreenInfo: function () {
            var t = document.body
                , e = document.documentElement;
            return {
                w: t.offsetWidth,
                h: t.offsetHeight,
                cw: e.clientWidth,
                ch: e.clientHeight,
                sl: e.scrollLeft || t.scrollLeft,
                st: e.scrollTop || t.scrollTop
            }
        },
        _render: function (t) {
            var e = this.opts
                , o = e.obj;
            if (o) {
                var n = this._getScreenInfo()
                    , i = e.padding.split("|")
                    , s = e.min.split("|")
                    , a = Math.max(n.cw - i[0], s[0])
                    , h = Math.max(n.ch - i[1], s[1])
                    , r = {
                    w: a,
                    h: h,
                    l: Math.max((n.cw - a) / 2 + n.sl, 0),
                    t: Math.max((n.ch - h) / 2 + n.st, 0)
                };
                o.style.width = r.w + "px",
                    o.style.height = r.h + "px",
                    o.style.left = r.l + "px",
                    o.style.top = r.t + "px",
                    e.onChange(r, t)
            }
        },
        show: function (t) {
            var e = this.opts;
            if (e.obj) {
                var o = this.shade;
                o && (o.style.display = "",
                e.hasScroll || (document.documentElement.style.overflow = "hidden",
                    document.body.style.overflow = "hidden")),
                    this._render(t),
                    e.obj.style.display = "",
                    this._show = !0,
                    e.onShow(t)
            }
        },
        hide: function (t) {
            var e = this.opts;
            if (e.obj) {
                var o = this.shade;
                o && (o.style.display = "none",
                e.hasScroll || (document.documentElement.style.overflow = "",
                    document.body.style.overflow = "")),
                    e.obj.style.display = "none",
                    this._show = !1,
                    e.onHide(t)
            }
        }
    },
        t.CtripHotelMap = t.CtripHotelMap || {},
        t.CtripHotelMap.dialog = function (t) {
            return new n(t)
        }
}(window, void 0);
"use strict";
$.fn.show = function () {
    this.each(function (e) {
        e.css("display", "block")
    })
}
    ,
    $.fn.hide = function () {
        this.each(function (e) {
            e.css("display", "none")
        })
    }
    ,
    function (e, t) {
        var a, o = t.browser.isIPad, s = o ? "touchstart" : "click", i = 222, r = 0;
        (t.browser.isIE6 || t.browser.isIE7) && (r = 8);
        var n = {
            init: function (a) {
                this.popAMap = a,
                    this.CMap = a.CMap,
                    this.C = e.hotelDomesticConfig,
                    this.sideHeight = a.options.height,
                    t("#J_mapSide").css("height", this.sideHeight + "px"),
                    t("#J_aroundList").css("height", this.sideHeight - i + "px");
                var s = document.getElementById("cityCode").value
                    , r = document.getElementById("cityName").value;
                this.cityName = r,
                    this.curGeocode = s ? s : encodeURIComponent(r),
                    this.hotel = a.mapData,
                    this.sgeocode = [],
                    this.egeocode = [{
                        formattedAddress: this.hotel.fullname,
                        location: this.toLngLat(this.hotel.pos, "|")
                    }],
                    t("#J_endPoint").value(this.hotel.fullname);
                var n = t("#J_routeSearch")
                    , c = t("#J_rounteSearchIPad");
                o && (n.hide(),
                    c.show(),
                    c.bind("touchstart", function () {
                        n.show(),
                            c.hide(),
                            t("#J_routeBack").css("display", "inline"),
                            t("#J_trafficHub").hide(),
                            t("#J_aroundSearch").hide()
                    })),
                    this.queryTraffic(),
                    this.queryAround(),
                    this.routeSwitch(),
                    this.foldSide()
            },
            reshow: function (e) {
                var a = this
                    , s = t("#J_endPoint")
                    , i = t("#J_startPoint")
                    , r = t("#J_aroundBox")
                    , n = t("#J_aroundSearch")
                    , c = t("#J_routeSearch")
                    , d = t("#J_rounteSearchIPad")
                    , l = t("#J_trafficHub")
                    , u = t("#J_aroundList")
                    , h = t(".bus_route_height, .route_detail_box")
                    , p = t(".bus_sort")
                    , g = t(".car_sort")
                    , f = t("#J_startAndEnd")
                    ,
                    _ = t("#J_aroundBack, #J_routeBack, #J_routeSearchBox, #J_noRoute, #J_tooClose, #J_aroundListBox");
                a.reshow = function (e) {
                    a.hotel = e,
                        a.sgeocode = [],
                        a.egeocode = [{
                            formattedAddress: e.fullname,
                            location: a.toLngLat(e.pos, "|")
                        }],
                        s.value(a.hotel.fullname),
                        i.value(""),
                        t("#J_routeWay .selected").removeClass("selected"),
                        t('#J_routeWay a[data-way="transfer"]').addClass("selected"),
                        _.hide(),
                        r[0].className = "around_box",
                        n.show(),
                        c.show(),
                    a.hasTrafficHub && l.show(),
                    o && (c.hide(),
                        d.show()),
                        u.html(""),
                        h.html(""),
                        p.html(p.html()),
                        g.html(g.html()),
                        f.css({
                            "background-color": "transparent",
                            display: "none"
                        })
                }
                    ,
                    a.reshow(e)
            },
            resize: function (e) {
                this.sideHeight = e;
                var a = e - i
                    , o = t("#J_aroundListType");
                "block" == o.css("display") && (a = a - o.offset().height - 12),
                    t("#J_mapSide").css("height", e + "px"),
                    t("#J_aroundList").css("height", a + "px"),
                    t(".foot_route_result .route_detail_box").css("height", e - 310 - r + "px"),
                    t(".car_route_result .route_detail_box").css("height", e - 360 - r + "px"),
                    t(".bus_route_height").css("height", e - 284 - r + "px")
            },
            toLngLat: function (e, t) {
                return this.CMap.setLngLat(e)
            },
            queryTraffic: function () {
                var e, a = this;
                e = this.C.query ? this.C.query.cityId : this.C.city.id;
                var o = "<span>|</span>"
                    , s = t("#J_trafficHub")
                    , i = t("#J_airportItem")
                    , r = i.parentNode()
                    , n = t("#J_stationItem")
                    , c = n.parentNode()
                    , d = t("#J_routeBack");
                t.ajax("/Domestic/Tool/AjaxGetPositions.aspx?city=" + e, {
                    onsuccess: function (e, l) {
                        if (l = t.parseJSON(l)) {
                            var u = []
                                , h = []
                                , p = l.airport || [];
                            p.length ? (a.hasTrafficHub = !0,
                            "inline" != d[0].style.display && s.show()) : a.hasTrafficHub = !1;
                            for (var g = 0, f = p.length; g < f; g++) {
                                var _ = p[g];
                                "airport" == _.type ? u.push('<a href="javascript:;" data-xy="' + _.position + '">' + _.name + "</a>") : "station" == _.type && h.push('<a href="javascript:;" data-xy="' + _.position + '">' + _.name + "</a>")
                            }
                            u.length ? (r.show(),
                                i.show(),
                                i.html(u.join(o))) : (r.hide(),
                                i.hide()),
                                h.length ? (c.show(),
                                    n.show(),
                                    n.html(h.join(o))) : (c.hide(),
                                    n.hide())
                        } else
                            a.hasTrafficHub = !1
                    }
                })
            },
            queryAround: function () {
                function e(e) {
                    t("#J_aroundType").html(e),
                        t.ajax("/Domestic/Tool/AjaxGetArroundHotels.aspx?hotelid=" + p.hotel.id + "&city=" + n + "&checkin=" + c + "&checkout=" + d, {
                            method: "GET",
                            onsuccess: function (o, s) {
                                var i = p.addUID(t.parseJSON(s) || [])
                                    , r = t.tmpl.render(k, {
                                    list: i
                                });
                                if (J.html(i.length || 0),
                                    C[0].className = "around_list hotel_list",
                                    C.html(r),
                                    b.show(),
                                    f.reset(!0),
                                    f.clearPOIMarkers(),
                                    i.length) {
                                    var n = [];
                                    i.each(function (e, a) {
                                        var o = e.location.lng + "|" + e.location.lat;
                                        e.location = g.setLngLat(o),
                                            n.push(e.location);
                                        var s = e.index
                                            , i = t(t("#J_aroundList .name .around_hotel")[s]).attr("href");
                                        t(t("#J_aroundList .name .around_hotel")[s]).attr("href", i + "#ctm_ref=hod_dl_map_ htllst_n_" + s)
                                    }),
                                        p.bindMouseoverAndMouseout();
                                    var c = {
                                        type: "complete",
                                        info: "ok",
                                        poiList: {
                                            pois: i
                                        }
                                    };
                                    f.drawPOIMarkers(c, "hotel"),
                                        clearTimeout(a),
                                        a = setTimeout(function () {
                                            f.autoZoom(n)
                                        }, 100)
                                } else
                                    y.show(),
                                        y.find("span.b").html(e)
                            },
                            onerror: function () {
                                J.html(0),
                                    C.html(""),
                                    b.show(),
                                    y.show(),
                                    y.find("span.b").html(e)
                            }
                        })
                }

                function r(e, t, a, o, s, i) {
                    T.keyword = e,
                        T.lngLat = t,
                        T.type = a,
                        p.queryPoi(e, t, a, o, s, i, !0)
                }

                var n, c, d, l, u, h, p = this, g = this.CMap, f = p.popAMap, _ = t("#J_startPoint"),
                    m = t("#J_endPoint"), v = t("#J_aroundBox"), b = t("#J_aroundTitle"), y = t("#J_noResultSpot"),
                    C = t("#J_aroundList"), J = t("#J_aroundNum"), w = t("#J_aroundPage"), M = t("#J_aroundListType"),
                    S = t("#J_aroundDistance"), k = t("#J_aroundHotelTpl").html(), A = t("#J_aroundBack, #J_routeBack"),
                    x = t("#J_aroundSearch"), L = t("#J_routeSearch"), I = t("#J_rounteSearchIPad"),
                    P = t("#J_aroundListBox, #J_routeSearchBox, #J_noRoute, #J_tooClose, #J_startAndEnd"), T = {};
                this.C.query ? (n = this.C.query.cityId,
                    c = this.C.query.checkIn,
                    d = this.C.query.checkOut) : (n = this.C.city.id,
                    c = t("#checkIn").value(),
                    d = t("#checkOut").value()),
                    A.bind(s, function () {
                        A.hide(),
                            P.hide(),
                            x.show(),
                            o ? (I.show(),
                                L.hide()) : L.show(),
                            _[0].blur(),
                            m[0].blur(),
                            v[0].className.indexOf("_selected") != -1 && "J_routeBack" === this.id ? t(h).trigger(s) : (v[0].className = "around_box",
                            p.hasTrafficHub && t("#J_trafficHub").show(),
                                p.sgeocode = [],
                                p.egeocode = [{
                                    formattedAddress: p.hotel.fullname,
                                    location: p.toLngLat(p.hotel.pos, "|")
                                }],
                                _.value(""),
                                m.value(p.hotel.fullname),
                                t("#J_routeWay .selected").removeClass("selected"),
                                t('#J_routeWay a[data-way="transfer"]').addClass("selected"),
                                t(".car_sort .selected").removeClass("selected"),
                                t(".bus_sort .selected").removeClass("selected"),
                                t('.bus_sort a[data-policy="LEAST_TIME"]').addClass("selected")),
                            f.reset(!0),
                        f.CMap.cMapObject.mapObj.clearOverlays && f.CMap.cMapObject.mapObj.clearOverlays(),
                            f.centerMarker.setMap(),
                            g.setCenter(f.centerMarker.getPosition())
                    }),
                    v.find("a").bind(s, function (a) {
                        a.stop();
                        var o = this.getAttribute("data-type");
                        if (!v.hasClass(o + "_selected") || void 0 === a.which) {
                            h = this;
                            var s = p.sideHeight;
                            u = this.getAttribute("data-subtype");
                            var n = t(this).text();
                            if (l = o,
                                v[0].className = "around_box " + o + "_selected",
                                t("#J_aroundBack").css("display", "inline"),
                                t("#J_trafficHub, #J_routeSearch").hide(),
                                t("#J_aroundListBox").show(),
                                I.hide(),
                                y.hide(),
                                u) {
                                for (var c = u.split("|"), d = [], g = 0; g < c.length; g++)
                                    d.push('<a href="javascript:;" data-type="' + c[g] + '">' + c[g] + "</a>");
                                M.html('<a href="javascript:;" class="selected" data-type="' + n + '">全部</a>|' + d.join("|")),
                                    M.show(),
                                    C.css("height", s - i - 12 - M.offset().height + "px"),
                                    M.hide()
                            } else
                                C.css("height", s - i + "px"),
                                    M.hide();
                            switch (w.hide(),
                                b.hide(),
                                C.html('<div class="map_pop_loading">加载中...</div>'),
                                o) {
                                case "hotel":
                                    e(n);
                                    break;
                                case "metro":
                                case "sight":
                                case "market":
                                case "restaurant":
                                case "entertainment":
                                    r(n, p.toLngLat(p.hotel.pos, "|"), l, u, 1, 5e3)
                            }
                        }
                    }),
                    M.bind(s, function (e) {
                        var t = e.target;
                        if ("A" === t.tagName) {
                            e.stop();
                            var a = t.getAttribute("data-type");
                            M.find(".selected").removeClass("selected"),
                                t.className = "selected",
                                r(a, p.toLngLat(p.hotel.pos, "|"), l, u, 1, 5e3)
                        }
                    }),
                    w.bind(s, function (e) {
                        var a = e.target;
                        if ("A" == a.tagName) {
                            e.stop();
                            var o = S.attr("data-distance");
                            switch (a.className) {
                                case "c_page_mini_current":
                                    break;
                                case "c_page_mini_previous":
                                    var s = w.find(".c_page_mini_current").html();
                                    if (1 != s) {
                                        var i = Number(s) - 1;
                                        p.queryPoi(T.keyword, T.lngLat, T.type, u, i, o, !0)
                                    }
                                    break;
                                case "c_page_mini_next":
                                    var s = w.find(".c_page_mini_current").html();
                                    if (s != Math.ceil(J.html() / 10)) {
                                        var i = Number(s) + 1;
                                        p.queryPoi(T.keyword, T.lngLat, T.type, u, i, o, !0)
                                    }
                                    break;
                                default:
                                    var i = t(a).html();
                                    p.queryPoi(T.keyword, T.lngLat, T.type, u, i, o, !0)
                            }
                        }
                    })
            },
            displayCircleAndMoniter: function (e, t, a, o, s, i) {
                var r = this
                    , n = e
                    , c = t
                    , d = a
                    , l = o
                    , u = r.popAMap.addCircle(r.hotel.pos, {
                    radius: i,
                    dragstart: function () {
                    },
                    dragend: function () {
                        var e = Math.round(this.getRadius() / 1.15);
                        r.queryPoi(n, c, d, l, 1, e, !1)
                    },
                    dragging: function () {
                        r.popAMap.moniter.update(u.getDragger(), t)
                    }
                });
                r.circle = u,
                    r.popAMap.addDistanceMoniter(t, u.getDragger()),
                    r.displayCircleAndMoniter = function (e, t, a, o, s, i) {
                        var h = r.popAMap;
                        n = e,
                            c = t,
                            d = a,
                            l = o,
                            h.moniter.restore(),
                            u.setMap(),
                            h.resetCircle(i, t),
                            u.show(),
                            h.moniter.show()
                    }
            },
            bindMouseoverAndMouseout: function () {
                var e = this
                    , a = t("#J_aroundList");
                a.find(".around_item").bind("mouseenter", function () {
                    var a = t(this);
                    a.addClass("item_hover");
                    var o = a.attr("data-uid");
                    e.popAMap.poi.highlight(o)
                }).bind("mouseleave", function (a) {
                    var o = t(this)
                        , s = e.popAMap.poi
                        , i = o.attr("data-uid");
                    s.isActive(i) || (s.highlight(i, !0),
                        o.removeClass("item_hover"))
                })
            },
            queryPoi: function (e, o, s, i, r, n, c) {
                var d = this
                    , l = d.CMap
                    , u = d.popAMap
                    , h = t("#J_aroundOtherTpl").html()
                    , p = t("#J_aroundNum")
                    , g = t("#J_aroundTitle")
                    , f = t("#J_aroundType")
                    , _ = t("#J_aroundList")
                    , m = t("#J_noResultSpot")
                    , v = t("#J_aroundDistance")
                    , b = t("#J_aroundPage")
                    , y = t("#J_aroundListType");
                d.queryPoi = function (e, o, s, i, r, n, c) {
                    l.addService("PlaceSearch", function (l) {
                        l.create({
                            city: d.curGeocode,
                            onSearchSuccess: function (l) {
                                if (g.show(),
                                    f.html(e),
                                    v.html(Math.round(n / 100) / 10),
                                    v.attr("data-distance", n),
                                    u.clearPOIMarkers(),
                                "metro" === s && !function (e) {
                                    var t, a, o, s, i, r, n, c;
                                    for (n = 0; n < e.length; n++) {
                                        for (t = e[n],
                                                 a = t.name,
                                                 o = t.address.split(";"),
                                                 i = t.type.split(";"),
                                                 r = i[1],
                                                 c = 0; c < o.length; c++)
                                            s = o[c],
                                                o[c] = s.replace("地铁", "");
                                        a = a.replace("(地铁站)", "站(" + o.join("/") + ")"),
                                            t.name = a
                                    }
                                }(l.poiList.pois),
                                "ok" !== l.info.toLowerCase())
                                    m.show(),
                                        m.find("span.b").html(e),
                                        p.html(0),
                                        _.html("");
                                else {
                                    m.hide();
                                    var C = l.poiList
                                        , J = d.addUID(d.insertionSort(C.pois, "distance"));
                                    if (c && J.length) {
                                        var w = J[J.length - 1].distance;
                                        d.displayCircleAndMoniter(e, o, s, i, r, w > 200 ? w : 200)
                                    }
                                    p.html(C.count),
                                        C.count > 10 ? (b.show(),
                                            d.paging(r, Math.ceil(C.count / 10), b[0])) : b.hide(),
                                    i && y.show();
                                    var M = t.tmpl.render(h, {
                                        list: J
                                    });
                                    _[0].className = "around_list " + s + "_list",
                                        _.html(M),
                                        d.bindMouseoverAndMouseout(),
                                        l.poiList.pois = J,
                                        u.drawPOIMarkers(l, s),
                                        clearTimeout(a),
                                        a = setTimeout(function () {
                                            u.autoZoom()
                                        }, 100)
                                }
                            }
                        }),
                            l.setPageIndex(r),
                            l.searchNearby(e, o, n)
                    })
                }
                    ,
                    d.queryPoi(e, o, s, i, r, n, c)
            },
            routeSwitch: function () {
                function e(e) {
                    var t = this.value;
                    t.length > 0 ? r.addService("Autocomplete", function (a) {
                        a.create({
                            city: i.curGeocode,
                            onSearchSuccess: function (a) {
                                var o = a.tips;
                                if (o) {
                                    for (var s = [], i = 0, r = o.length; i < r; i++) {
                                        var n = o[i].location
                                            ,
                                            a = e + "|" + o[i].name + "|" + o[i].adcode + (n ? "|" + [n.lng, n.lat].join(",") : "");
                                        s.push('<div class="item" data="' + a + '"><span class="name">' + o[i].name.replace(t, '<span class="b">' + t + "</span>") + '</span><span class="adress">' + o[i].district + "</span></div>")
                                    }
                                    "start" === e ? g.onReady(s.join("")) : f.onReady(s.join(""))
                                }
                            }
                        }),
                            a.search(t)
                    }) : "start" === e ? g.onReady("") : f.onReady("")
                }

                function a(e, o, s) {
                    var n = "string" == typeof e ? e : e.getAttribute("data")
                        , l = n.split("|")
                        , u = l[0]
                        , h = l[1]
                        , p = l[2]
                        , g = l[3];
                    g && (g = g.split(","),
                        g = {
                            lng: Number(g[0]),
                            lat: Number(g[1])
                        }),
                        "start" === u ? c.value(h) : d.value(h),
                        r.addService("Geocoder", function (e) {
                            e.create({
                                city: i.curGeocode
                            }),
                                t.BizMod.Promise(function (e) {
                                    r.addService("PlaceSearch", function (t) {
                                        t.create({
                                            city: i.curGeocode,
                                            onSearchSuccess: function (t) {
                                                if ("ok" === t.info.toLowerCase() && t.poiList.pois.length) {
                                                    for (var i, r, n = t.poiList.pois, c = 0, d = n.length; c < d && g; c++)
                                                        if (n[c].location.lng === g.lng && n[c].location.lat === g.lat) {
                                                            i = n[c];
                                                            break
                                                        }
                                                    if (!i && (i = n[0]),
                                                        r = [{
                                                            addressComponent: "",
                                                            formattedAddress: i.address,
                                                            location: i.location,
                                                            adcode: p || "",
                                                            level: ""
                                                        }],
                                                    i.address && i.location && i.location.lng && i.location.lat)
                                                        e.resolve(r);
                                                    else if (!s || h.indexOf(s) >= 0)
                                                        e.reject();
                                                    else {
                                                        var l = u + "|" + s + h + "|" + p + "|" + g;
                                                        a(l, o)
                                                    }
                                                } else if (!s || h.indexOf(s) >= 0)
                                                    e.reject();
                                                else {
                                                    var l = u + "|" + s + h + "|" + p + "|" + g;
                                                    a(l, o)
                                                }
                                            }
                                        }),
                                            t.search(h.replace(/\(|\)/g, ""))
                                    })
                                }).then(function (t) {
                                    e.getAddress(t[0].location, function (e, a) {
                                        a || (t[0].addressComponent = e.regeocode.addressComponent,
                                            t[0].formattedAddress = e.regeocode.formattedAddress),
                                            "start" === u ? i.sgeocode = t : i.egeocode = t,
                                        o && o()
                                    }, p)
                                })["catch"](function () {
                                    console && console.warn && console.warn(h + "placesearch 联想失败"),
                                        e.getLocation(h.replace(/\(|\)/g, ""), function (e, t) {
                                            "start" === u ? i.sgeocode = e.geocodes : i.egeocode = e.geocodes,
                                            o && o()
                                        }, p)
                                })
                        })
                }

                function o(e, a, o) {
                    u.css({
                        display: "",
                        "background-color": "#F5F3EF"
                    }),
                        t("#J_routeSearchBox, #J_tooClose").hide();
                    for (var s = "", r = 0, n = o.length; r < n; r++)
                        s += '<div class="list_item" onmouseover="this.className=\'list_item item_hover\'" onmouseout="this.className=\'list_item\'" onclick="selectGeocode(\'' + e + "', '" + o[r].formattedAddress + "', " + r + ')"><span class="num">' + (r + 1) + '</span><p class="name">' + o[r].formattedAddress + '</p><p class="adress">' + o[r].addressComponent.province + o[r].addressComponent.city + o[r].addressComponent.district + "</p></div>";
                    var c = "";
                    switch (o.length) {
                        case 0:
                            c = '<span class="ico_' + e + '"></span><p class="place">抱歉，在' + i.cityName + '没有找到与<span class="b">“' + a + '”</span>相关的地点。</p><div class="tips"><p class="txt">您还可以:</p><p class="txt">- 检查输入的文字是否有误</p><p class="txt">- 尝试更换不同的文字</p></div>';
                            break;
                        default:
                            c = '<span class="ico_' + e + '"></span><p class="place"><span class="b">你是不是要找？</span></p><div class="rec_list">' + s + "</div>"
                    }
                    u.html('<div class="route">' + c + "</div>")
                }

                var i = this
                    , r = this.CMap
                    , n = t("#J_routeWay")
                    , c = t("#J_startPoint")
                    , d = t("#J_endPoint")
                    , l = t("#J_routeSearchBtn")
                    , u = t("#J_startAndEnd")
                    , h = t("#J_routeBack")
                    , p = t("#J_aroundSearch, #J_trafficHub, #J_rounteSearchIPad");
                l.bind(s, function () {
                    if (c.value() && d.value())
                        if (p.hide(),
                            h.css("display", "inline"),
                        1 === i.sgeocode.length && 1 === i.egeocode.length) {
                            var e = n.find(".selected").attr("data-way");
                            i.routeSearch(e, i.sgeocode[0].location, i.egeocode[0].location, i.sgeocode[0].formattedAddress, i.egeocode[0].formattedAddress)
                        } else
                            i.sgeocode.length ? i.sgeocode.length > 1 && o("start", c.value(), i.sgeocode) : a("start|" + c.value() + "|" + i.curGeocode, function () {
                                1 === i.sgeocode.length && 1 === i.egeocode.length ? l.trigger(s) : o("start", c.value(), i.sgeocode)
                            }, i.cityName),
                                i.egeocode.length ? i.egeocode.length > 1 && o("end", d.value(), i.egeocode) : a("end|" + d.value() + "|" + i.curGeocode, function () {
                                    1 === i.sgeocode.length && 1 === i.egeocode.length ? l.trigger(s) : o("end", d.value(), i.egeocode)
                                }, i.cityName)
                }),
                    n.find("a").bind(s, function (e) {
                        e.stop(),
                            n.find(".selected").removeClass("selected"),
                            t(this).addClass("selected"),
                            t(".car_sort .selected").removeClass("selected"),
                            t(".bus_sort .selected").removeClass("selected"),
                            t('.bus_sort a[data-policy="LEAST_TIME"]').addClass("selected"),
                            l.trigger(s)
                    }),
                    t("#J_changeBus").bind(s, function (e) {
                        e.stop(),
                            n.find(".selected").removeClass("selected"),
                            n.find('a[data-way="transfer"]').addClass("selected"),
                            l.trigger(s)
                    }),
                    t("#J_orWalking").bind(s, function (e) {
                        e.stop(),
                            n.find(".selected").removeClass("selected"),
                            n.find('a[data-way="walking"]').addClass("selected"),
                            l.trigger(s)
                    }),
                    t("#J_changeStartEnd").bind(s, function (e) {
                        e.stop();
                        var t = c.value();
                        c.value(d.value()),
                            d.value(t),
                            t = i.sgeocode,
                            i.sgeocode = i.egeocode,
                            i.egeocode = t,
                            l.trigger(s)
                    }),
                    t(".car_sort").bind(s, function (e) {
                        var a = e.target;
                        "A" === a.tagName && (e.stop(),
                            t(".car_sort .selected").removeClass("selected"),
                            t(a).addClass("selected"),
                            l.trigger(s))
                    }),
                    t(".bus_sort").bind(s, function (e) {
                        var a = e.target;
                        "A" === a.tagName && (e.stop(),
                            t(".bus_sort .selected").removeClass("selected"),
                            t(a).addClass("selected"),
                            l.trigger(s))
                    }),
                    t("#J_aroundList").bind(s, function (e) {
                        var a = e.target
                            , o = a.getAttribute("data-way");
                        if (o) {
                            e.stop();
                            var s = t.parseJSON(a.parentNode.getAttribute("data-poi"));
                            (CtripHotelMap.mapSupplier = "B") && (s.pos = i.CMap.setLngLat(s.pos),
                                s.pos = [s.pos.lng, s.pos.lat].join("|")),
                                t("#J_aroundListBox").hide(),
                                i.endRoute(o, s.name, s.pos)
                        }
                    }),
                    i.startRoute = function (e, a, o) {
                        var r = o.split("|");
                        t("#J_routeWay .selected").removeClass("selected"),
                            t('#J_routeWay a[data-way="' + e + '"]').addClass("selected"),
                            i.egeocode = [{
                                formattedAddress: a,
                                location: i.toLngLat({
                                    lng: Number(r[0]),
                                    lat: Number(r[1])
                                })
                            }],
                            i.sgeocode = [{
                                formattedAddress: i.hotel.fullname,
                                location: i.toLngLat(i.hotel.pos, "|")
                            }],
                            c.value(i.hotel.fullname),
                            d.value(a),
                            l.trigger(s)
                    }
                    ,
                    i.endRoute = function (e, a, o) {
                        var r = o.split("|");
                        t("#J_routeWay .selected").removeClass("selected"),
                            t('#J_routeWay a[data-way="' + e + '"]').addClass("selected"),
                            i.egeocode = [{
                                formattedAddress: a,
                                location: i.toLngLat({
                                    lng: Number(r[0]),
                                    lat: Number(r[1])
                                })
                            }],
                            i.sgeocode = [{
                                formattedAddress: i.hotel.fullname,
                                location: i.toLngLat(i.hotel.pos, "|")
                            }],
                            c.value(i.hotel.fullname),
                            d.value(a),
                            l.trigger(s)
                    }
                    ,
                    t("#J_airportItem, #J_stationItem").bind(s, function (e) {
                        var t = e.target
                            , a = t.getAttribute("data-xy");
                        "A" === t.tagName && a && (e.stop(),
                        "B" === CtripHotelMap.mapSupplier && (a = i.CMap.setLngLat(a.replace(",", "|")),
                            a = a.lng + "," + a.lat),
                            i.endRoute("transfer", t.innerHTML, a.replace(",", "|")))
                    });
                var g = new t.Autocomplete({
                    inputCDom: c,
                    itemClass: "item",
                    hoverClass: "item_hover",
                    divClass: "side_input_pop",
                    onChange: function () {
                        i.sgeocode = [],
                            e.call(this, "start")
                    },
                    onSelection: a
                })
                    , f = new t.Autocomplete({
                    inputCDom: d,
                    itemClass: "item",
                    hoverClass: "item_hover",
                    divClass: "side_input_pop",
                    onChange: function () {
                        i.egeocode = [],
                            e.call(this, "end")
                    },
                    onSelection: a
                });
                window.selectGeocode = function (e, t, a) {
                    "start" === e ? (i.sgeocode = [i.sgeocode[a]],
                        c.value(t)) : (i.egeocode = [i.egeocode[a]],
                        d.value(t)),
                        u.hide(),
                        l.trigger(s)
                }
            },
            routeSearch: function (e, a, o, i, n) {
                function c() {
                    var e = t(".bus_sort .selected").attr("data-policy");
                    f.addService("Transfer", function (a) {
                        a.create({
                            city: decodeURIComponent(g.curGeocode),
                            policy: a.getPolicy(e),
                            onSearchSuccess: function (a) {
                                if ("ok" !== a.info.toLowerCase())
                                    return k.hide(),
                                        void (f.getDistance(v, b) < 1e3 ? w.show() : J.show());
                                var o = a.plans;
                                "LEAST_TIME" == e && (o = g.insertionSort(o, "time"));
                                var i = k.find(".bus_route_height");
                                i.html("");
                                for (var r = 0, n = o.length; r < n; r++) {
                                    for (var c = o[r], d = c.segments, l = [], h = '<div class="route_detail"><span class="ico_start"></span><p class="place_start">' + y + "</p></div>", _ = 0; _ < d.length; _++) {
                                        var m, M = d[_];
                                        switch (M.transit_mode) {
                                            case "BUS":
                                                m = "ico_bus";
                                                break;
                                            case "WALK":
                                                m = "ico_foot";
                                                break;
                                            case "SUBWAY":
                                                m = "m_default"
                                        }
                                        h += '<div class="route_detail" data-index="' + _ + '"><span class="' + m + '"></span><p>' + M.instruction + "</p></div>",
                                        "WALK" !== M.transit_mode && l.push('<span class="bus_stop">' + M.transit.lines[0].name.replace(/\(.*\)/, "") + "</span>")
                                    }
                                    h += '<div class="route_detail"><span class="ico_end"></span><p class="place_end">' + C + "</p></div>";
                                    var S = Math.floor(c.time / 3600)
                                        , A = S > 0 ? S + "小时" : ""
                                        ,
                                        x = '<div class="bus_route_box"><table class="route_table" data-index="' + r + '"><tr><th>' + (r + 1) + '</th><td><p class="route_pass">' + l.join("&gt;") + '</p><p class="total"><a class="print" href="javascript:;">打印</a>全程约 ' + A + Math.floor(c.time % 3600 / 60) + "分 " + c.distance / 1e3 + '公里</p></td></tr></table><div class="route_detail_box"><div class="route_detail_box2">' + h + "</div></div></div>";
                                    i.append(g.html2dom(x))
                                }
                                i.firstChild().addClass("show_route"),
                                    u(a, "transfer");
                                var L = t(".bus_route_box");
                                i.find(".route_table").bind(s, function (o) {
                                    var s = o.target
                                        , r = 0
                                        , n = t(this).parentNode()
                                        , c = this.getAttribute("data-index");
                                    if ("A" === s.tagName && "print" === s.className)
                                        o.stop(),
                                            g.printRouter("transfer", e, c);
                                    else {
                                        if (n.hasClass("show_route"))
                                            return;
                                        t(".bus_route_box.show_route").removeClass("show_route"),
                                            n.addClass("show_route");
                                        for (var d = 0; d < c; d++)
                                            r += parseInt(t(L[d]).offset().height) + 10;
                                        i[0].scrollTop = r,
                                            u(a, "transfer", c)
                                    }
                                }),
                                    p(i)
                            }
                        }),
                            a.search(v, b)
                    })
                }

                function d() {
                    var e = t(".car_sort .selected").attr("data-policy");
                    f.addService("Driving", function (t) {
                        t.create({
                            onSearchSuccess: function (e, t) {
                                t ? h(e, "walking") : h(e, "driving")
                            }
                        }),
                            t.setPolicy(e),
                            t.search(v, b)
                    })
                }

                function l() {
                    f.addService("Walking", function (e) {
                        e.create({
                            onSearchSuccess: function (e, t) {
                                t ? h(e, "walking") : h(e, "walking")
                            }
                        }),
                            e.search(v, b)
                    })
                }

                function u(e, a, o) {
                    function s() {
                        if ("driving" === a || "walking" === a) {
                            window.Instance = _.CMap.cMapObject.ifmWin.Instance;
                            var s = _.CMap.cMapObject.mapObj;
                            s.clearOverlays(),
                                s.enableScrollWheelZoom(),
                                s.enableContinuousZoom();
                            var r = _.CMap.cMapObject.BMap
                                , n = new r.Point(e.start.point.lng, e.start.point.lat)
                                , c = new r.Point(e.end.point.lng, e.end.point.lat)
                                , d = t(".car_sort .selected").attr("data-policy")
                                , l = {
                                map: s,
                                autoViewport: !0,
                                panel: "c_result",
                                enableDragging: !0,
                                highlightMode: _.CMap.cMapObject.ifmWin.BMAP_HIGHLIGHT_ROUTE
                            }
                                , u = function () {
                                var e = t(".route_detail_box")
                                    , a = _.CMap.cMapObject.ifmWin.document.getElementById("c_result");
                                e.html(a.innerHTML),
                                    e.find("h1").remove(),
                                    e.find(".navtrans-view").remove(),
                                    e.find("tr").bind("click", function () {
                                        t(".navtrans-table tr[onclick]").each(function (e, a) {
                                            t(e).find("td").css("background-color", "white")
                                        }),
                                            t(this).find("td").css("background-color", "#ABCDEF")
                                    })
                            };
                            if ("driving" === a) {
                                var h = new r.DrivingRoute(s, {
                                    renderOptions: l,
                                    policy: d,
                                    onPolylinesSet: function (e) {
                                        e && e.length && (e[0].getPolyline().setStrokeColor("blue"),
                                            e[0].getPolyline().setStrokeOpacity(.5),
                                            e[0].getPolyline().setStrokeWeight(7))
                                    }
                                });
                                h.search(n, c),
                                    h.setResultsHtmlSetCallback(u)
                            } else if ("walking" === a) {
                                var p = new r.WalkingRoute(s, {
                                    renderOptions: l,
                                    onPolylinesSet: function (e) {
                                        e && e.length && (e[0].getPolyline().setStrokeColor("#18a52a"),
                                            e[0].getPolyline().setStrokeOpacity(.7),
                                            e[0].getPolyline().setStrokeWeight(7),
                                            e[0].getPolyline().setStrokeStyle("solid"))
                                    }
                                });
                                p.search(n, c),
                                    p.setResultsHtmlSetCallback(u)
                            }
                        } else
                            _.drawRouter(e, t.BizMod.Router[i[a]], o)
                    }

                    g.circle && g.circle.remove(),
                    _.moniter && _.moniter.hide(),
                    _.CMap.cMapObject.mapObj.clearOverlays && _.CMap.cMapObject.mapObj.clearOverlays(),
                        _.clearRouter(),
                        _.clearPOIMarkers(),
                        _.centerMarker.remove(),
                    "ok" !== e.info.toLowerCase() && (e.origin || (e.origin = g.sgeocode[0].location),
                    e.destination || (e.destination = g.egeocode[0].location));
                    var i = {
                        driving: "DRIVE",
                        walking: "WALK",
                        transfer: "BUS"
                    };
                    "T" === IsGAT ? "T" === IsOpenBaiDuMapFlgForGAT ? s() : _.drawRouter(e, t.BizMod.Router[i[a]], o) : "T" === IsOpenBaiDuMapFlg ? s() : _.drawRouter(e, t.BizMod.Router[i[a]], o)
                }

                function h(e, a) {
                    if ("ok" !== e.info.toLowerCase())
                        return k.hide(),
                            void J.show();
                    var o, s = e.routes[0];
                    if ("walking" === a)
                        I.find(".distance").html(s.distance < 1e3 ? s.distance + "米" : Math.round(s.distance / 100) / 10 + "公里"),
                            o = T;
                    else {
                        x.find(".distance").html(s.distance < 1e3 ? s.distance + "米" : Math.round(s.distance / 100) / 10 + "公里");
                        var i = t("#J_taxiCost");
                        e.taxi_cost > 0 ? (i.show(),
                            i.find(".tolls").html(e.taxi_cost)) : i.hide(),
                            o = P
                    }
                    if (u(e, a),
                    "T" === IsGAT) {
                        if ("T" === IsOpenBaiDuMapFlgForGAT && ("driving" === a || "walking" === a))
                            return
                    } else if ("T" === IsOpenBaiDuMapFlg && ("driving" === a || "walking" === a))
                        return;
                    for (var r = s.steps, n = '<div class="route_detail"><span class="ico_start"></span><p class="place_start">' + y + "</p></div>", c = 0, d = r.length; c < d; c++) {
                        var l = "";
                        n += '<div class="route_detail" data-index="' + c + '"><!--<span class="' + l + '"></span>--><p>' + r[c].instruction + "</p></div>"
                    }
                    n += '<div class="route_detail"><span class="ico_end"></span><p class="place_end">' + C + "</p></div>",
                        o.html(n),
                        p(o)
                }

                function p(e) {
                    var a;
                    e.find(".route_detail").bind("mouseover", function () {
                        var e = this.getAttribute("data-index");
                        null !== e && t(this).find("p").addClass("hover")
                    }).bind("mouseout", function () {
                        var e = this.getAttribute("data-index");
                        null !== e && t(this).find("p").removeClass("hover")
                    }).bind(s, function () {
                        var o = this.getAttribute("data-index");
                        null !== o && (e.find(".selected").removeClass("selected"),
                            t(this).find("p").addClass("selected"),
                            g.popAMap.router.openStep(o),
                            g.popAMap.highlightRouterStep(a, !0),
                            a = o,
                            g.popAMap.highlightRouterStep(o))
                    })
                }

                var g = this
                    , f = this.CMap
                    , _ = this.popAMap
                    , m = e
                    , v = a
                    , b = o
                    , y = i
                    , C = n
                    , J = t("#J_noRoute")
                    , w = t("#J_tooClose")
                    , M = t("#J_routeBack")
                    , S = t("#J_routeSearch")
                    , k = t("#J_routeSearchBox")
                    , A = t(".route_result")
                    , x = t(".car_route_result")
                    , L = t(".bus_route_result")
                    , I = t(".foot_route_result")
                    , P = x.find(".route_detail_box")
                    , T = I.find(".route_detail_box")
                    , j = t(".bus_route_height")
                    , N = t("#J_trafficHub, #J_aroundSearch, #J_aroundListBox, #J_startAndEnd")
                    , B = '<div class="map_pop_loading">加载中...</div>';
                x.find(".print").bind(s, function () {
                    var e = t(".car_sort a.selected").attr("data-policy");
                    g.printRouter("driving", e)
                }),
                    I.find(".print").bind(s, function () {
                        g.printRouter("walking")
                    }),
                    g.routeSearch = function (e, a, o, s, i) {
                        switch (m = e,
                            v = a,
                            b = o,
                            y = s,
                            C = i,
                            N.hide(),
                            J.hide(),
                            w.hide(),
                            A.hide(),
                            S.show(),
                            k.show(),
                            t("#J_routeWay .selected").removeClass("selected"),
                            t('#J_routeWay a[data-way="' + e + '"]').addClass("selected"),
                            M.css("display", "inline"),
                            e) {
                            case "driving":
                                x.show(),
                                    P.css("height", g.sideHeight - 360 - r + "px"),
                                    P.html(B),
                                    d();
                                break;
                            case "walking":
                                I.show(),
                                    T.css("height", g.sideHeight - 310 - r + "px"),
                                    T.html(B),
                                    l();
                                break;
                            case "transfer":
                                L.show(),
                                    j.css("height", g.sideHeight - 284 - r + "px"),
                                    j.html(B),
                                    c()
                        }
                    }
                    ,
                    g.routeSearch(e, a, o, i, n)
            },
            printRouter: function (a, o, s) {
                var i = this
                    , r = {
                    cityId: e.DomesticCityId,
                    cityName: i.cityName,
                    cityCode: i.curGeocode,
                    routeType: a,
                    origin: {
                        name: i.sgeocode[0].formattedAddress,
                        position: i.sgeocode[0].location.lng + "|" + i.sgeocode[0].location.lat
                    },
                    destination: {
                        name: i.egeocode[0].formattedAddress,
                        position: i.egeocode[0].location.lng + "|" + i.egeocode[0].location.lat
                    }
                };
                o && (r.policy = o),
                s && (r.index = s);
                var n = document.createElement("form");
                n.action = "/domestic/MapRoutePrint.aspx",
                    n.target = "_blank",
                    n.method = "get",
                    document.body.appendChild(n);
                var c = document.createElement("input");
                c.type = "hidden",
                    c.name = "params",
                    c.value = encodeURIComponent(escape(t.stringifyJSON(r))),
                    n.appendChild(c),
                    n.submit(),
                    document.body.removeChild(n)
            },
            addUID: function (e) {
                for (var t = this.popAMap.CMap, a = 0, o = e.length; a < o; a++)
                    e[a].uid = t.getUID.call(t);
                return e
            },
            foldSide: function () {
                var e = this
                    , a = this.popAMap
                    , o = t("#J_foldBtn")
                    , i = t("#J_mapSide")
                    , r = t(".map_marker_box");
                o.bind(s, function () {
                    o.hasClass("btn_side_close") ? (o.removeClass("btn_side_close").addClass("btn_side_open"),
                        i.addClass("map_side_hidden"),
                        r.css("right", "9px"),
                        a.resizeMap(a.options.width + 281, e.sideHeight)) : (o.removeClass("btn_side_open").addClass("btn_side_close"),
                        i.removeClass("map_side_hidden"),
                        r.css("right", "290px"),
                        a.resizeMap(a.options.width, e.sideHeight))
                })
            },
            html2dom: function (e) {
                var t = document.createDocumentFragment()
                    , a = document.createElement("div");
                a.innerHTML = e;
                for (var o = a.children; o.length > 0;)
                    t.appendChild(o[0]);
                return t
            },
            insertionSort: function (e, t) {
                if (!e)
                    return e;
                var a, o, s, i = e.length;
                for (o = 0; o < i; o++) {
                    for (a = e[o],
                             s = o - 1; s > -1 && Number(e[s][t]) > Number(a[t]); s--)
                        e[s + 1] = e[s];
                    e[s + 1] = a
                }
                return e
            },
            paging: function (e, t, a) {
                var o, s = 1, e = Number(e), i = '<span class="c_page_ellipsis">...</span>',
                    r = '<a class="c_page_mini_previous" href="javascript:void(0);">&lt;-</a>',
                    n = '<a class="c_page_mini_next" href="javascript:void(0);">-&gt;</a>', c = "";
                if (t > 5) {
                    c = '<a class="c_page_mini_current" href="javascript:void(0);">' + e + "</a>";
                    var d = e - 1;
                    for (o = 0; o < 2 && d > 0; o++,
                        d--)
                        c = '<a href="javascript:void(0);">' + d + "</a>" + c,
                            s++;
                    var l = e + 1;
                    for (o = 0; o < 2 && l <= t; o++,
                        l++)
                        c = c + '<a href="javascript:void(0);">' + l + "</a>",
                            s++;
                    if (s < 5)
                        if (d > 0)
                            for (o = 0; o < 5 - s; o++,
                                d--)
                                c = '<a href="javascript:void(0);">' + d + "</a>" + c;
                        else
                            for (o = 0; o < 5 - s; o++,
                                l++)
                                c = c + '<a href="javascript:void(0);">' + l + "</a>";
                    1 == d && (c = '<a href="javascript:void(0);">' + d + "</a>" + c),
                    t - l == 0 && (c = c + '<a href="javascript:void(0);">' + l + "</a>"),
                    d >= 2 && (c = '<a href="javascript:void(0);">1</a>' + i + c),
                    t - l >= 1 && (c = c + i + '<a href="javascript:void(0);">' + t + "</a>")
                } else
                    for (o = 1; o <= t; o++)
                        c += o == e ? '<a class="c_page_mini_current" href="javascript:void(0);">' + o + "</a>" : '<a href="javascript:void(0);">' + o + "</a>";
                a.innerHTML = r + c + n
            }
        };
        e.CtripHotelMap.popSide = n
    }(window, cQuery);
cQuery.myFn = {
    refresh: function (e, n, r) {
        if (null != e) {
            var t = $.parseJSON(e);
            if (null != t) {
                var i = t.needRedirect
                    , d = t.redirectUrl;
                if ("true" == i)
                    if ("reload" == n)
                        window.location.reload();
                    else if ("post" == n) {
                        var l = document.getElementById("mainbody")
                            , a = document.createElement("form");
                        if (a.method = "POST",
                            a.action = d,
                        null != r)
                            for (var o in r) {
                                var u = document.createElement("input");
                                u.type = "hidden",
                                    u.name = o,
                                    u.value = r[o],
                                    a.appendChild(u)
                            }
                        l.appendChild(a),
                            a.submit()
                    } else if ("get" == n)
                        return window.location.href = d,
                            !0
            }
        }
    }
};

function expand(r) {
    if ("string" != typeof r)
        return "";
    for (var n = r.indexOf("@"), t = r.substring(0, n), e = r.substring(n + 1), i = new Array, s = t.split("`"), f = 0; f < s.length; f++) {
        var l = s[f].split("#");
        i[l[0]] = l[1]
    }
    for (var u = "", a = "", f = 0; f < e.length; f++)
        u += e[f],
        null != i[u] && (a += i[u],
            u = "");
    return a
}

!function (t, o, e) {
    function n() {
        s++
    }

    function a() {
        s--
    }

    function r() {
        e.ajaxGetSpotHotelAndGroupDataUrl && t.ajax(e.ajaxGetSpotHotelAndGroupDataUrl, {
            method: "GET",
            async: !0,
            cache: !1,
            onsuccess: function (o, e) {
                i(t.parseJSON(e))
            },
            onerror: function () {
            }
        })
    }

    function i(t) {
        var o = function () {
            0 === s && (clearTimeout(o),
                d(t))
        }
            .repeat(50)
    }

    function d(o) {
        var e, n, a = t(".J_roomTable"), r = "";
        if (a.length) {
            if ("done" === a.data("spotHotelAndGroup"))
                return;
            if (a.data("spotHotelAndGroup", "done"),
                e = a.find("td[data-baseroomid]"),
                n = t(a.find(".group_hotel")[0]),
                o.spotHotel.each(function (o) {
                    o.RoomList = o.RoomList || [],
                        o.RoomList.each(function (e) {
                            var n = o.BaseRoomInfoEntity.MasterBasicRoomID
                                , i = a.find("td[data-masterbasicroomid=" + n + "]");
                            if (0 !== i.length) {
                                var d = Number(i.attr("rowspan")) || 1
                                    , s = i.parentNode()
                                    , c = a.find("tr").indexOf(s) + d - 1
                                    , l = a.find("tr")[c];
                                f(e, d + 1);
                                try {
                                    r = t.tmpl.render("<table>" + t("#J_spotHotelTmpl").html() + "</table>", e)
                                } catch (p) {
                                }
                                r && (i.attr("rowspan", d + 1),
                                    t(htmlToDom(r)).find("tr").insertAfter(l))
                            }
                        })
                }),
            o.group && n.length) {
                try {
                    r = t.tmpl.render("<table>" + o.group + "</table>", ++e)
                } catch (i) {
                }
                r && t(htmlToDom(r)).find("tr").insertAfter(n)
            }
        }
    }

    function f(t, o) {
        var e = t.Broadnet.split("");
        t.bedInfoCode = {
            "大床": "1",
            "双床": "2",
            "大/双": "1|2",
            "单人床": "3",
            "多床": "4"
        }[t.BedInfo] || "",
            t.breakfastChinese = ["无早", "单早", "双早", "三早", "四早", "五早", "六早", "七早", "八早", "每人一份早"][t.RoomBaseInfoEntity.BreakFast] || "",
            t.breakfastBf = {
                "双早": 1,
                "单早": 2,
                "无早": 3
            }[t.breakfastChinese] || 4,
            t.RoomBaseInfoEntity.saveMoney = t.RoomBaseInfoEntity.SpotHotelOriginPrice - t.RoomBaseInfoEntity.Price,
            t.Broadnet = e[0],
            t.BordNetDesc = "",
        e[1] && (e[1].indexOf("无线宽带免费") > -1 ? t.BordNetDesc = "1" : e[1].indexOf("有线宽带免费") > -1 ? t.BordNetDesc = "2" : e[1].indexOf("免费") > -1 && (t.BordNetDesc = "1|2"),
        e[1].indexOf("无线宽带免费") > -1 && e[1].indexOf("有线宽带免费") > -1 && (t.BordNetDesc = "1|2")),
            t.rank = o
    }

    var s = 0;
    o.spotHotelAndGroup = {
        load: r,
        retain: n,
        release: a
    }
}(cQuery, window, addressUrlConfig);

function LoadAjaxGetHotelRelationInfo() {
    var e = {
            disabled: !1,
            _requestCallback: !1,
            _eventCallback: !1,
            start: function (e, t, o) {
                t && o && (this._requestCallback = o,
                    this._bindEvents(e, t))
            },
            _bindEvents: function (e, t) {
                var o = this
                    , n = null
                    , i = function () {
                    var e = $(t);
                    o._isComingUp(e) && o._request()
                }
                    , a = function () {
                    clearTimeout(n),
                        n = setTimeout(i, e || 200)
                };
                this._eventCallback = a,
                    $(window).bind("scroll", a),
                    $(window).bind("resize", a)
            },
            _request: function () {
                this.disabled || (this.disabled = !0,
                    $(window).unbind("scroll", this._eventCallback),
                    $(window).unbind("resize", this._eventCallback),
                this._requestCallback && this._requestCallback())
            },
            _isComingUp: function (e) {
                var t = e.offset()
                    , o = document.documentElement.scrollTop || document.body.scrollTop
                    , n = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                return t.top <= o + n + 500
            }
        }
        ,
        t = hotelDomesticConfig.bookingOver || hotelDomesticConfig.bookOverView ? "#AdviceHotelHasPrice2" : "#AdviceHotelHasPrice"
        , o = function () {
            $.ajax(addressUrlConfig.AjaxGetHotelRelationInfo, {
                cache: !0,
                onsuccess: function (e) {
                    if (e && e.responseText) {
                        ("T" == hotelDomesticConfig.isghi || 0 == isShowResult) && $("#adviseHotel").length > 0 ? ($("#adviseHotel").html(e.responseText),
                            $(t).html("")) : $(t).html(e.responseText);
                        var o = $("#around_same_type_hotel");
                        if (o.length > 0) {
                            var n = [];
                            o.find("li").each(function (e, t) {
                                n.push({
                                    hotelid: e.attr("hotel-id"),
                                    amount: e.attr("hotel-amount")
                                })
                            });
                            var i = {
                                hotelid: $("#hotel").value(),
                                aroundsametype_htllist: n
                            };
                            window.__bfi.push(["_tracklog", "hotel_inland_detail_nearbyhtl", $.stringifyJSON(i)])
                        }
                    }
                }
            })
        };
    if (hotelDomesticConfig.bookOverView || 0 == isShowResult && $("#adviseHotel").length > 0 && "" == $("#adviseHotel").html())
        o();
    else {
        $(t);
        e.start(200, t, o)
    }
}

function htmlToDom(e, t) {
    var o = t ? t.document.createElement("div") : document.createElement("div")
        , n = document.createDocumentFragment();
    o.innerHTML = e;
    var i = o.children;
    if (i.length > 1) {
        for (; i.length > 0;)
            n.appendChild(i[0]);
        return n
    }
    return i[0]
}

function getUrlPice() {
    var e = window.location.href;
    return e.indexOf("ab_alternative") != -1 ? "&ab=" + e.split("?")[1].substr(-1, 1) : ""
}

function getUrlFixedBugPice() {
    return commentVersion ? "&viewVersion=" + commentVersion : ""
}

function postAjax(e, t, o) {
    cQuery.ajax(e, {
        method: "POST",
        context: t,
        onsuccess: function (e) {
            var e = $.parseJSON(e.responseText);
            o && "function" == typeof o && o(e)
        }
    })
}

function priceForNewUserPop() {
    var e, t = this, o = $("#J_ForNewUserPopbox");
    t.judgePopDisplay = function (t, n, i) {
        "1" == t && n ? (clearTimeout(e),
            e = setTimeout(function () {
                $.myAjax("/DomesticBook/Tool/AjaxCheckPriceCS.aspx", "POST", n, function (e) {
                    500 == e.code ? o.getMask() : i()
                })
            }, 500)) : i()
    }
        ,
        t.bindEvent = function () {
            o.find(".c_close, .J_return").bind("click", function () {
                o.removeMask()
            })
        }
}

function addFavHotel(e) {
    submitForm(c_fav_action, "_self", e)
}

function submitForm(e, t, o) {
    var n;
    if (n || (n = document.forms[0]),
    n.__VIEWSTATE && (n.__VIEWSTATE.name = "NOVIEWSTATE"),
        o)
        for (var i in o)
            if (n[i])
                n[i].value = o[i];
            else {
                var a = document.createElement("input");
                a.type = "hidden",
                    a.value = o[i],
                    a.name = i,
                    n.appendChild(a)
            }
    n.action = e,
        n.target = t,
        n.submit()
}

function DealSaleLogin(e) {
    __SSO_booking_1(e.id, 0)
}

function __SSO_submit(e, t) {
    if ("J_bannerLogin" == e)
        return void location.reload();
    var o = document.getElementById(e);
    if (o) {
        if (e.match(/(fav)/i)) {
            hotelDomesticConfig.hasLogin = "T";
            try {
                DoFavHotel(o, void 0)
            } catch (n) {
            }
            return void location.reload()
        }
        if (e.match(/(faq)/i)) {
            hotelDomesticConfig.hasLogin = "T";
            try {
                window.DoFaqHotel(o, void 0)
            } catch (n) {
            }
            return
        }
        if (e.match(/(reply)/i)) {
            hotelDomesticConfig.hasLogin = "T";
            try {
                window.DoFaqReply(o, void 0)
            } catch (n) {
            }
            return
        }
        if (e.match(/(btn_comment)/i))
            hotelId = o.getAttribute("data_hotel"),
                fm.action = "/Domestic/WriteComment.aspx?hotel=" + hotelId,
                fm.target = "_blank",
            fm.__VIEWSTATE && (fm.__VIEWSTATE.name = "NOVIEWSTATE"),
                fm.submit();
        else if (e.match(/(dealsalelogin)/i))
            fm.action = window.location.href.split("#")[0] + "#book",
            fm.__VIEWSTATE && (fm.__VIEWSTATE.name = "NOVIEWSTATE"),
                fm.submit();
        else {
            if (e.match(/(ulogin)/i)) {
                hotelDomesticConfig.hasLogin = "T";
                try {
                    DoFavHotel(o, void 0, "", "T")
                } catch (n) {
                }
                return void location.reload()
            }
            if (e.match(/(commentGrabOff)/i))
                commentGrabOff.jumpPageJudge();
            else if (e.match(/(memberRoomType)/i))
                location.reload();
            else if (e.match(/(LoginForCoupon)/i))
                location.reload();
            else if (e.match(/(btnMeeting)/i))
                hotelDomesticConfig.hasLogin = "T",
                    o.click();
            else if (e.match(/(J_makeOrder)/i))
                App.callSuccessAuthStatus(e);
            else if (e.match(/(changeBtn)/i))
                hotelDomesticConfig.hasLogin = "T",
                    o.click();
            else {
                if (e.match(/(J_MeetingCustomization)/i))
                    return hotelDomesticConfig.hasLogin = !0,
                        void $("#" + e)[0].click();
                if ($obj = $(o),
                    $obj.hasClass("spotOrderButton")) {
                    var i = $obj.attr("href");
                    return void (i && (window.location.href = i))
                }
                hotelDomesticConfig.hasLogin = !0,
                    window.HotelRoom.onOrderButtonClick(o)
            }
        }
    }
}

function goNextDInfo(e) {
    var t = $(e)
        , o = t.parentNode().find(".btn_prev")
        , n = t.parentNode().find(".J_EveryDayScroll")
        , i = n.find("li").length
        , a = n.attr("cindex");
    return a >= i ? void t.addClass("hidden") : (a++,
        n.attr("cindex", a),
    a > 1 && o.removeClass("hidden"),
    a == i && t.addClass("hidden"),
        void $.mod.load("animate", "1.0", function () {
            n.animate({
                marginLeft: "-=624"
            })
        }))
}

function goPrevDInfo(e) {
    var t = $(e)
        , o = t.parentNode().find(".btn_next")
        , n = t.parentNode().find(".J_EveryDayScroll")
        , i = n.find("li").length
        , a = n.attr("cindex");
    return a <= 1 ? void t.addClass("hidden") : (a--,
        n.attr("cindex", a),
    1 == a && t.addClass("hidden"),
    a < i && o.removeClass("hidden"),
        void $.mod.load("animate", "1.0", function () {
            n.animate({
                marginLeft: "+=624"
            })
        }))
}

function DoFavHotel(e, t, o, n) {
    if (hotelDomesticConfig.hasLogin) {
        var i = e;
        t = t || window.event,
        t && (i = t.target || t.srcElement);
        var a = i.dataset ? i.dataset.id : i.getAttribute("data-id")
            , s = i.getAttribute("data-favid")
            , r = $("#cityId").value()
            , l = "D";
        l = o ? o : i.dataset ? i.dataset.type : i.getAttribute("data-type"),
        "I" == l && window.setHotelPyramidTrace(a),
            $.ajax("/Domestic/Tool/AjaxGetHotelAddtionalInfo.ashx?favData=1&favCount=7&hotelId=" + a + "&cityId=" + r + "&type=" + l + "&hotelidlist=" + a + "&favid=" + s, {
                cache: !1,
                onsuccess: function (e, t) {
                    if ("" != t) {
                        var o = $.parseJSON(t)
                            , n = o.HotelFavList;
                        if (n && n.length ? ($("#favlist").remove(),
                            $(".sider_pic").append(htmlToDom($.tmpl.render($("#J_favHotel").html(), n))).removeClass("hidden"),
                            tracklog.hotelRecommendTrack()) : $("#favlist").addClass("hidden"),
                        void 0 != o.IsFavList) {
                            var i = $.parseJSON(o.IsFavList)
                                , s = $("#hotel").value();
                            if (i.length > 0 && i[0][s]) {
                                var r = $("#id_fav_btn");
                                r.find("a.ico_unfavorite").remove(),
                                    r.find("a.ico_favorite").remove(),
                                    r.html(r.html() + i[0][a])
                            }
                        }
                    }
                }
            })
    } else
        __SSO_booking_1(e.id, 0);
    return t && (t.returnValue = !1,
    t.preventDefault && t.preventDefault(),
    t.stopPropagation && t.stopPropagation(),
        t.cancelBubble = !0),
        !1
}

var getRoomHTML, expandRoom, loaded = !0, showRoomList, getPromotionFilterList = function () {
    var e = $("#cityId").value()
        , t = $("#cc_txtCheckIn").value()
        , o = $("#cc_txtCheckOut").value();
    $("#J_promotionf").addClass("hidden");
    var n = $("#J_promotionf").attr("data-default");
    $.ajax("/Domestic/Tool/AjaxGetPromotionFilterList.aspx", {
        method: $.AJAX_METHOD_POST,
        context: {
            city: e,
            checkin: t,
            checkout: o,
            defaultVal: n
        },
        onsuccess: function (e) {
            var t = $.parseJSON(e.responseText);
            t && t.html && ($("#J_promotionf").removeClass("hidden"),
                $("#J_promotionf .lb_text").html(t.title),
                $("#J_promotionf_div").html(t.html),
                $(".J_prom_click").bind("click", function (e) {
                    var t = $("#J_promotionf .lb_text").attr("data-default")
                        , o = [];
                    if ($(this).attr("data-id")) {
                        if ($(this).hasClass("choosed"))
                            if ($(this).removeClass("choosed"),
                            0 == $("#J_promotionf .choosed").length)
                                $("#J_promotionf .J_price_item:eq(0)").addClass("choosed");
                            else {
                                for (var n = 0; n < $("#J_promotionf .choosed").length; n++)
                                    o.push($($("#J_promotionf .choosed")[n]).text());
                                t = o.join(",")
                            }
                        else {
                            $(this).addClass("choosed"),
                                $("#J_promotionf .J_prom_item:eq(0)").removeClass("choosed");
                            for (var n = 0; n < $("#J_promotionf .choosed").length; n++)
                                o.push($($("#J_promotionf .choosed")[n]).text());
                            t = o.join(",")
                        }
                        $("#J_promotionf .c_sort_links").hasClass("c_sort_links_choosed") || $("#J_promotionf .c_sort_links").addClass("c_sort_links_choosed"),
                            $(".btn_clear").removeClass("hidden"),
                            $("#J_promotionf .lb_text").html(t)
                    } else
                        hourRoom.prototype.clearPromFilter();
                    $(".c_sort_price").find(".multiple_menu").addClass("hidden"),
                        getRoomHTML(!0, function () {
                            $(".J_ExpandLeftRoom").bind("click", function () {
                                expandRoom.call(this)
                            }),
                            window.hourRoomObj && window.hourRoomObj._initSelect()
                        })
                }))
        }
    })
};
getPromotionFilterList();
var commentGrabOff = function () {
    function e(e, t, o, n) {
        cQuery.ajax(e, {
            method: t,
            context: o,
            onsuccess: function (e) {
                var e = $.parseJSON(e.responseText);
                e && n && "function" == typeof n && n(e)
            }
        })
    }

    function t(t) {
        e("/domestic/tool/AjaxGetUserOrderId.aspx?hotelid=" + i, "GET", "", function (e) {
            e.url ? location.href = e.url : __SSO_loginShow_1(t, !0, "0", !0)
        })
    }

    function o() {
        $(".htl_com_no_comment").length && !$(".htl_com_no_comment").hasClass("hidden") ? ($("#divDetailMain").length && $("#divDetailMain").addClass("detail_main_no_comment"),
        $("#divPicModal_2").length && $("#divPicModal_2").addClass("detail_main_no_comment")) : $(".detail_main").addClass("detail_main_no_tips")
    }

    function n(e) {
        function o() {
            e.bind("click", function () {
                var e = $(this).attr("id");
                i = $("#hotel").value(),
                    window.hotelDomesticConfig.hasLogin ? t(e) : window.__SSO_booking_1(e, 0)
            })
        }

        e.length && o()
    }

    var i;
    return {
        construct: n,
        jumpPageJudge: t,
        adjustStyle: o
    }
}();
commentGrabOff.adjustStyle(),
$(".commentGrabOff").length && commentGrabOff.construct($(".commentGrabOff"));
var checkForFoldYc = {
    key: !0
};
$("#seo_more").bind("click", function () {
    checkForFoldYc.key ? ($(this).parentNode().parentNode().find(".seo_hot").addClass("sta_unfold"),
        checkForFoldYc.key = !1) : ($(this).parentNode().parentNode().find(".seo_hot").removeClass("sta_unfold"),
        $(this).parentNode().parentNode().find(".seo_hot").last().addClass("sta_unfold"),
        checkForFoldYc.key = !0)
}),
    $(".seo_hot").removeClass("sta_unfold"),
    $(".seo_hot").last().addClass("sta_unfold");
var placeholderPlugin = function () {
    function e(e, t, o) {
        function n() {
            e.value() && e.value() != t ? e.removeClass(o) : (e.value(t),
                e.addClass(o))
        }

        function i() {
            e.removeClass(o),
            e.value() == t && e.value("")
        }

        function a() {
            e.bind("focus", function () {
                i()
            }),
                e.bind("blur", function () {
                    n()
                })
        }

        n(),
            a()
    }

    return {
        initLazyLoad: e,
        getInputVal: function (e, t) {
            var o = e.value();
            return o != t || (e.value(""),
                !1)
        },
        askTitle: "请输入您想要提的问题",
        userEmail: "请输入您的邮箱地址",
        answerTitle: "请输入回答，尽可能详细描述哦",
        userSearch: ""
    }
}()
    , showUnfoldPlugin = function () {
    function e(e, t) {
        function o(e) {
            s = e.parentNode().find(".show_fold"),
                a = e.parentNode().find(".show_unfold"),
                r = e.parentNode().parentNode().find(".text"),
                l = e.parentNode()
        }

        function n(e, t) {
            e && e.removeClass("hidden"),
            t && (t.removeClass("hidden"),
                t.addClass("hidden"))
        }

        function i() {
            e.bind("click", function () {
                o($(this)),
                    n(s, $(this)),
                    r.removeClass(l && l.hasClass("J_txt_fold") ? "text_other" : "hidden")
            }),
                t.bind("click", function () {
                    o($(this)),
                        n(a, $(this)),
                        r.addClass(l && l.hasClass("J_txt_fold") ? "text_other" : "hidden")
                })
        }

        var a, s, r, l;
        i()
    }

    return {
        initLazyLoad: e
    }
}();
showUnfoldPlugin.initLazyLoad($(".htl_reply .show_unfold"), $(".htl_reply .show_fold"));
var imgHoverPlugin = function () {
    function e() {
        function e() {
            $(".user_info").each(function (e) {
                e.hasClass("J_NoPop") || e.addClass("J_ctrip_pop")
            }),
            $(".comment_head_pop").length && $(".comment_head_pop").remove()
        }

        function t(e) {
            var t = {};
            return e >= 0 && e <= 4 ? (t.logoClass = "level_new",
                t.text = "点评达人",
                t.goalNum = 5,
                t.comRnage = "1-4条") : e >= 5 && e <= 29 ? (t.logoClass = "level_daren",
                t.text = "点评专家",
                t.goalNum = 30,
                t.comRnage = "5-29条") : e >= 30 && (t.logoClass = "level_master",
                t.text = "点评专家",
                t.goalNum = 30,
                t.comRnage = "30条及以上"),
                t
        }

        function o(e, o) {
            var n = e.attr("src")
                , i = e.parentNode()
                , a = parseInt(i.attr("data-commentcount"))
                , s = i.attr("data-comhotcount")
                , r = t(a)
                , l = 160 * (a / r.goalNum)
                , d = o;
            l > 160 && (l = 160),
                d = d.replace(/{src}/, n).replace(/{userName}/, e.parentNode().parentNode().parentNode().find(".name span").html()).replace(/{currentCommentNum}/g, parseInt(i.attr("data-commentcount"))).replace(/{goalCommentNum}/, r.goalNum).replace(/{processWidth}/, l).replace(/{leftCommentNum}/, r.goalNum - a).replace(/{cityNum}/, i.attr("data-arrivcitycount")).replace(/{totalCommentNum}/g, a).replace(/{comhotcount}/g, s).replace(/{picNum}/, i.attr("data-img-count")).replace(/{usefulCommentNum}/, i.attr("data-userfulcount")).replace(/{userLevelLogo}/, r.logoClass).replace(/{userLevelText}/, r.text).replace(/{comRange}/, r.comRnage),
                $(htmlToDom(d)).appendTo($("body")),
            a >= 30 && $(".J_leftCommentNumBox").html("恭喜您已达到点评专家满级！")
        }

        function n(e) {
            function t() {
                $("body").unbind("touchstart", o)
            }

            function o(e) {
                l(),
                    t()
            }

            l(),
                s.bind("touchstart", function (e) {
                    e.stopPropagation(),
                        d($(this)),
                        $("body").bind("touchstart", o)
                })
        }

        function i() {
            s.bind("mouseover", function () {
                d($(this))
            }),
                s.bind("mouseout", function () {
                    l()
                })
        }

        function a() {
            $.browser.isIPad ? n() : i()
        }

        e();
        var s = $(".J_ctrip_pop .head, .J_ctrip_pop .name, .J_ctrip_pop .level_new, .J_ctrip_pop .level_daren, .J_ctrip_pop .level_master")
            , r = ""
            , l = function () {
            r && r.remove()
        }
            , d = function (e) {
            e = e.parentNode().find(".head img");
            var t = e.parentNode().attr("data-isUserSelf").toLowerCase();
            "true" == t ? o(e, $("#J_checkSelfCom").html()) : "false" == t && o(e, $("#J_checkOthersCom").html()),
                r = $(".comment_head_pop"),
                r.bind("touchstart", function (e) {
                    e.stopPropagation()
                });
            var n = e.parentNode().parentNode();
            r.css({
                top: n.offset().top + n.offset().height + "px",
                left: n.offset().left + "px"
            })
        };
        a()
    }

    return {
        construct: e
    }
}();
imgHoverPlugin.construct();
var sliderPhotoNS = {
    liIndex: "",
    liLength: "",
    thisFatherUl: "",
    _initMaskCreate: function () {
        var e = '<div class="hidden" id="mask" style="width:100%; height:100%; position:fixed; _position:absolute; top:0; left:0; z-index:999; background:rgba(0,0,0,.5)"></div>';
        $("body").append(htmlToDom(e))
    },
    _mask: function (e) {
        $(".comment_show_pop").css({
            position: "fixed",
            _position: "absolute",
            zIndex: "9999",
            top: "50%",
            marginTop: "-250px",
            left: "50%",
            marginLeft: "-250px"
        })
    },
    _unmask: function (e) {
        $("#mask, .comment_show_pop").addClass("hidden")
    },
    _isReviewJudge: function (e) {
        var t = e.attr("isPass");
        $(".comment_show_pop .d").addClass("hidden"),
            "F" == t.toUpperCase() ? $($(".comment_show_pop .d").get(0)).removeClass("hidden") : "U" == t.toUpperCase() && $($(".comment_show_pop .d").get(1)).removeClass("hidden")
    },
    _leftRightTem: function () {
        var e = $(sliderPhotoNS.thisFatherUl.find("img").get(sliderPhotoNS.liIndex));
        sliderPhotoNS._isReviewJudge($(e));
        var t = e.attr("data-bigimgsrc");
        $(".comment_show_pop .pic img").attr("src", t)
    },
    smallImgEleClick: function (e) {
        $(".comment_show_pop .prev, .comment_show_pop .next, #mask, .comment_show_pop").removeClass("hidden"),
            sliderPhotoNS._isReviewJudge(e),
            sliderPhotoNS.thisFatherUl = e.parentNode().parentNode(),
            sliderPhotoNS.liLength = sliderPhotoNS.thisFatherUl.find("img").length - 1,
            sliderPhotoNS.liIndex = sliderPhotoNS.thisFatherUl.find("img").indexOf(e);
        var t = e.attr("data-bigimgsrc");
        sliderPhotoNS._mask($(".comment_show_pop")),
            $(".comment_show_pop .pic img").attr("src", t),
        sliderPhotoNS.liIndex <= 0 && $(".comment_show_pop .prev").addClass("hidden"),
        sliderPhotoNS.liIndex >= sliderPhotoNS.liLength && $(".comment_show_pop .next").addClass("hidden")
    },
    leftClick: function () {
        sliderPhotoNS.liIndex--,
            sliderPhotoNS.liIndex <= 0 ? ($(".comment_show_pop .prev").addClass("hidden"),
                $(".comment_show_pop .next").removeClass("hidden")) : $(".comment_show_pop .next").removeClass("hidden"),
            sliderPhotoNS._leftRightTem()
    },
    rightClick: function () {
        sliderPhotoNS.liIndex++,
            sliderPhotoNS.liIndex >= sliderPhotoNS.liLength ? ($(".comment_show_pop .next").addClass("hidden"),
                $(".comment_show_pop .prev").removeClass("hidden")) : $(".comment_show_pop .prev").removeClass("hidden"),
            sliderPhotoNS._leftRightTem()
    },
    initBindEve: function () {
        $(".comment_show_pop").addClass("hidden"),
            sliderPhotoNS._initMaskCreate(),
            $("body").bind("click", function (e) {
                e = e || window.event;
                var t = e.target || e.srcElement;
                "IMG" == t.tagName && "comment_pic" == $(t).parentNode().parentNode().get(0).className ? sliderPhotoNS.smallImgEleClick($(t)) : "close" == t.className && "comment_show_pop" == $(t).parentNode().parentNode()[0].className ? sliderPhotoNS._unmask() : "B" == t.tagName && $(t).parentNode()[0].className.indexOf("prev") != -1 ? sliderPhotoNS.leftClick() : "B" == t.tagName && $(t).parentNode()[0].className.indexOf("next") != -1 && sliderPhotoNS.rightClick()
            })
    }
};
sliderPhotoNS.initBindEve();
var dropDownPlugin = {
    isOptionClick: !1,
    getSelectOption: function (e) {
        if (!$(e).length)
            return "";
        for (var t, o = e, n = o.getElementsByTagName("option"), i = 0; i < n.length; ++i)
            if (n[i].selected) {
                t = n[i].value;
                break
            }
        return t
    },
    isOptionClickFun: function () {
        $(".select_ctrip, .select_room, .select_sort").bind("change", function (e) {
            dropDownPlugin.isOptionClick = !0,
                $("#commentList").trigger("click"),
                dropDownPlugin.isOptionClick = !1
        })
    }
};
dropDownPlugin.isOptionClickFun();
var searchResultNS = function () {
    return {
        isSearchClick: !1,
        reSetPlaceHolder: function () {
            var e = placeholderPlugin.getInputVal($("#J_searchInput"), $("#J_searchInput").attr("data-placeholder"));
            e || $("#J_searchInput").value($("#J_searchInput").attr("data-placeholder"))
        },
        getSearchBoxVal: function (e, t) {
            return e && e != $("#J_searchInput").attr("data-placeholder") ? t = "&keyword=" + encodeURIComponent(escape($("#J_searchInput").value().trim())) : (searchResultNS.reSetPlaceHolder(),
                t = "&keyword="),
                t
        },
        enterAjax: function () {
            $("#J_searchInput").bind("keydown", function (e) {
                e = e || window.event,
                13 == e.keyCode && (e.stop(),
                    searchResultNS.isSearchClick = !0,
                    $("#commentList").trigger("click"))
            }),
                $("#cPageNum").bind("keydown", function (e) {
                    e = e || window.event,
                    13 == e.keyCode && (e.stop(),
                        searchResultNS.pageclick())
                })
        }
    }
}();
searchResultNS.enterAjax();
var showMore = function () {
    var e = {
        getShowMoreBtn: function (e) {
            return e.parentNode().find(".J_commentShowMore")
        },
        getShowLessBtn: function (e) {
            return e.parentNode().find(".J_commentShowLess")
        },
        getWordBox: function (e) {
            return e.parentNode().find(".J_commentDetail")
        }
    }
        , t = function (e, t, o, n) {
        e.addClass("hidden"),
            t.removeClass("hidden"),
            n ? (o.removeClass("comment_txt_detail"),
                o.removeClass("show")) : (o.addClass("show"),
                o.addClass("comment_txt_detail"))
    }
        , o = function () {
        $(".J_commentDetail").each(function (o) {
            o.offset().height > 240 && t(e.getShowLessBtn(o), e.getShowMoreBtn(o), o, !1)
        })
    };
    return {
        initBindEvent: function () {
            o(),
                $(".J_commentShowMore").bind("click", function () {
                    t($(this), e.getShowLessBtn($(this)), e.getWordBox($(this)), !0)
                }),
                $(".J_commentShowLess").bind("click", function () {
                    t($(this), e.getShowMoreBtn($(this)), e.getWordBox($(this)), !1)
                })
        }
    }
}();
showMore.initBindEvent();
var tracklog = function () {
    function e(e, t) {
        "undefined" == typeof window.__bfi && (window.__bfi = []),
            window.__bfi.push(["_tracklog", e, t])
    }

    function t() {
        b = 1,
            g = [],
            v = {}
    }

    function o(e) {
        if (e.attr("data-order") && e.attr("data-order").split(",")[0]) {
            var t = e.attr("data-order").split(",");
            return t
        }
    }

    function n(e) {
        if (e.attr("data-ids"))
            return e.attr("data-ids").split(",")
    }

    function i() {
        return (new Date).toFormatString("yyyy-MM-dd hh:mm:ss")
    }

    function a() {
        var e = 0;
        return document.documentElement && document.documentElement.scrollTop ? e = document.documentElement.scrollTop : document.body && (e = document.body.scrollTop),
            e
    }

    function s(e) {
        var t = window.screen.availHeight
            , o = e.offset().top + 5 >= a()
            , n = e.offset().top + e.offset().height + 100 <= a() + t;
        o && n ? e.attr("data-isLooking", "true") : e.attr("data-isLooking", "")
    }

    function r() {
        $(htmlToDom('<input type="hidden" id="htl_detail_htl_hotel" /><input type="hidden" id="htl_detail_htl_hotel_baseroom" /><input type="hidden" id="htl_detail_htl_hotel_rollingscreen" /><input type="hidden" id="htl_detail_recom_notik" /><input type="hidden" id="htl_detail_htl_hotel_comment" /><input type="hidden" id="htl_detail_htl_hotel_hotelrecommend" /><input type="hidden" id="hod_detail_picture" />')).appendTo($("body"))
    }

    var l, d, c, u, m, h, p, f, _, v = {}, g = [], b = 1, C = $("#page_id").value(), w = $("#hotel").value(),
        y = $("#cityId").value();
    $("#startdate").value(),
        $("#depdate").value();
    return r(),
        {
            hotDetailPictureTrack: function (t) {
                y = y || "",
                    w = w || "",
                    u = t.attr("data-pictureid") || "",
                    m = t.attr("data-cli_type") || "",
                    h = t.attr("data-source") || "酒店官方",
                    f = t.attr("data-pic_rank") || "1",
                    _ = t.attr("data-pic_num") || "";
                var o = t.attr("data-pic_type");
                o = "1,13" == o ? "外观" : "2,3,4,5,11" == o ? "内景" : "6,14" == o ? "房间" : "所有",
                    p = o || "所有",
                    l = "{cityid:'" + y + "',hotelid:'" + w + "',pictureid:'" + u + "',cli_type:'" + m + "',source:'" + h + "',pic_type:'" + p + "',pic_rank:'" + f + "',pic_num:'" + _ + "',}",
                    $("#hod_detail_picture").value(l),
                    e("hod_detail_picture", l)
            },
            threeSixZoreTrack: function (t) {
                y = y || "",
                    w = w || "",
                    u = "",
                    m = "4",
                    h = "360",
                    f = "",
                    _ = "",
                    p = t.attr("data-picType") || "",
                    l = "{cityid:'" + y + "',hotelid:'" + w + "',pictureid:'" + u + "',cli_type:'" + m + "',source:'" + h + "',pic_type:'" + p + "',pic_rank:'" + f + "',pic_num:'" + _ + "',}",
                    $("#hod_detail_picture").value(l),
                    e("hod_detail_picture", l)
            },
            allHotelRoomTrack: function () {
                var n = [];
                $("#hotelRoomBox a[data-order]").each(function (e) {
                    n.push(o(e))
                }),
                    t();
                for (var i = 0; i < n.length; i++)
                    v = {},
                    n[i] && (v.rm = n[i][0],
                        v.shadowid = n[i][1],
                        v.rpfq = n[i][2],
                        v.rpfh = n[i][3],
                        v.pt = n[i][4],
                        v.mt = n[i][5],
                        v.pn = n[i][6],
                        v.promotiontype = n[i][7],
                        v.iscomfirm = n[i][8],
                        v.bedtype = n[i][9],
                        v.breakfast = n[i][10],
                        v.policy = n[i][11],
                        v.guaranteetype = n[i][12],
                        v.bk = n[i][13],
                        v.isgift = n[i][14],
                        v.isgroup = n[i][15],
                        b++,
                        g.push(v));
                v = {
                    roomlist: g
                },
                    l = "pageid=" + C + ";ht=" + w + ";checkin=" + $("#startdate").value() + ";checkout=" + $("#depdate").value() + ";rmlist=" + $.stringifyJSON(v.roomlist),
                    v.roomlist.each(function (e, t) {
                        var o = Math.random() / 10 + 1.1;
                        v.roomlist[t].rpfq = parseInt(v.roomlist[t].rpfq.toInt() * o, 10),
                            v.roomlist[t].rpfh = parseInt(v.roomlist[t].rpfh.toInt() * o, 10)
                    });
                var a = "pageid=" + C + ";ht=" + w + ";checkin=" + $("#startdate").value() + ";checkout=" + $("#depdate").value() + ";rmlist=" + $.stringifyJSON(v.roomlist);
                $("#htl_detail_htl_hotel").value(a),
                    e("htl_detail_htl_hotel", l)
            },
            baseroomTrack: function () {
                $("#id_room_select_box table td a").bind("click", function () {
                    l = "pageid=" + C + ";hotelid=" + w + ";baseroomid=" + $(this).parentNode().attr("data-baseroomid") + ";clicktime=" + i() + ";roomlist=" + $(this).parentNode().attr("data-roomlist"),
                        $("#htl_detail_htl_hotel_baseroom").value(l),
                        e("htl_detail_htl_hotel_baseroom", l);
                    var t = $(this)
                        , o = t.attr("tracekey")
                        , n = t.attr("tracevalue");
                    o && e(o, n)
                })
            },
            rollingscreenTrackComment: function () {
                clearTimeout(c),
                    c = setTimeout(function () {
                        $("#htl_detail_recom_notik").value("");
                        var o = [];
                        $("#commentList .comment_block").each(function (e) {
                            s(e, 2),
                            e.attr("data-isLooking") && o.push(n(e))
                        }),
                            t();
                        for (var i = 0; i < o.length; i++)
                            v = {},
                            o[i] && (v.city = o[i][0],
                                v.hotelid = o[i][1],
                                v.recomid = o[i][2],
                                g.push(v));
                        v = {
                            roomlist: g
                        },
                        o[0] && (l = $.stringifyJSON(v.roomlist),
                            $("#htl_detail_recom_notik").value(l),
                            e("htl_detail_recom_notik", l))
                    }, 500)
            },
            rollingscreenTrack: function () {
                clearTimeout(d),
                    d = setTimeout(function () {
                        $("#htl_detail_htl_hotel_rollingscreen").value("");
                        var n = [];
                        $("#hotelRoomBox .btn_buy").each(function (e) {
                            s(e),
                            e.attr("data-isLooking") && n.push(o(e))
                        }),
                            t();
                        for (var a = 0; a < n.length; a++)
                            v = {},
                            n[a] && (v["rm" + b] = n[a][1],
                                v["rp" + b] = "",
                                v["pt" + b] = n[a][2],
                                v["mt" + b] = "",
                                v["pn" + b] = "",
                                b++,
                                g.push(v));
                        v = {
                            roomlist: g
                        },
                        n[0] && (l = "pageid=" + C + ";clicktime=" + i() + ";roomlist=" + $.stringifyJSON(v.roomlist),
                            $("#htl_detail_htl_hotel_rollingscreen").value(l),
                            e("htl_detail_htl_hotel_rollingscreen", l))
                    }, 500)
            },
            hotelCommentTrack: function (t) {
                var o = i()
                    , n = $(t).attr("data-cid");
                l = 'pageid="' + C + '";hotelid="' + w + '";clicktime="' + o + '";comment="' + n + '"',
                    $("#htl_detail_htl_hotel_comment").value(l),
                    e("htl_detail_htl_hotel_comment", l)
            },
            hotelRecommendTrack: function () {
                var t = ""
                    , o = "";
                $("#favlist").get(0) && (o = [],
                    $("#favlist ul li").each(function (e) {
                        o.push($(e.find("a").get(0)).attr("data-id"))
                    })),
                    l = "pageid=" + C + ";scanedhotellist=" + t + ";collecthotellist=" + o.join(","),
                    $("#htl_detail_htl_hotel_hotelrecommend").value(l),
                    e("htl_detail_htl_hotel_hotelrecommend", l)
            },
            meetingTrack: function (t) {
                var o = $("input[name=hotel]").value()
                    , n = $("#meetingCheckIn").value()
                    , i = $("#meetingCheckOut").value();
                l = '{"hotelid":"' + o + '","checkin":"' + n + '","checkout":"' + i + '"}',
                    e(t, l)
            }
        }
}()
    , MadCat = function (e, t) {
    this.events = {},
    e && e.call(this, t)
};
$.extend(MadCat.prototype, {
    set: function () {
    },
    get: function () {
        return null
    },
    evt: function (e, t) {
        this.events[e] = t
    },
    init: function () {
    }
});
var HotelView = new MadCat(function () {
        this.init = function () {
        }
            ,
            this.set = function () {
            }
            ,
            this.showLoading = function (e, t) {
                var o = e.clientHeight || e.offsetHeight
                    , n = e.clientWidth || e.offsetWidth;
                o && n || (o = parseInt($(e).css("height")),
                    n = parseInt($(e).css("width")));
                var i = Math.abs((o - 80) / 2)
                    , a = Math.abs(o - i);
                if (e.loading)
                    e.loading.style.height = a + "px",
                        e.loading.style.width = n + "px",
                        e.loading.style.paddingTop = i + "px",
                        e.loading.style.opacity = "",
                        e.loading.style.filter = "",
                        e.loading.style.display = "";
                else {
                    var s = $.create("div", {
                        innerHTML: '<img src="//pic.ctrip.com/common/loading_50.gif" /></div>',
                        cssText: $.format("height:$1px;width:$2px;padding-top:$3px;text-align:center;background-color:#fff", a, n, i)
                    });
                    e.appendChild(s),
                        e.loading = s
                }
            }
            ,
            this.hideLoading = function (e) {
                e.loading.style.display = "none"
            }
    }
)
    , checkPriceForNewUserPop = new priceForNewUserPop;
checkPriceForNewUserPop.bindEvent();
var HotelRoom = new MadCat(function (e) {
        function t(e, t) {
            var o = window.location.host.replace("hotels.", "");
            t.hotelLevel ? t.hotelLevel : "",
                t.startDate ? t.startDate : "",
                t.endDate ? t.endDate : "";
            cQuery.cookie.set(e, null, t.cityId + "split" + t.cityName + "split" + t.cityPY + "split" + t.startDate + "split" + t.endDate + "split" + t.hotelLevel, {
                expires: 1,
                domain: o,
                path: "/"
            })
        }

        this.next = function (e) {
            for (var t = e.nextElementSibling || e.nextSibling; t && 1 != t.nodeType;)
                t = t.nextSibling;
            return t
        }
            ,
            this.prev = function (e) {
                for (var t = e.previousElementSibling || e.previousSibling; t && 1 != t.nodeType;)
                    t = t.previousSibling;
                return t
            }
        ;
        var o = null
            , n = null
            , i = !0;
        this.hideBaseRoomDetail = function () {
            $("#J_RoomListTbl .J_show_room_detail").bind("blur", function () {
                o = setTimeout(function () {
                    i && $("#J_roomDetail_float").hide()
                }, 300)
            }),
                $("#J_roomDetail_float").bind("mouseup", function () {
                    i = !0,
                    o && (clearTimeout(o),
                        n[0].focus())
                }),
                $("#J_roomDetail_float").bind("mousedown", function () {
                    i = !1,
                    o && (clearTimeout(o),
                        n[0].focus())
                }),
                $("#J_roomDetail_float").bind("mouseover", function () {
                    i = !0,
                    o && (clearTimeout(o),
                        n[0].focus())
                })
        }
            ,
            this.onNameNewClick = function (e, t) {
                n = $(e),
                o && clearTimeout(o);
                var i = e.parentNode.parentNode;
                if (null != i && void 0 != i) {
                    var a = $("#rdn" + i.getAttribute("brid"))
                        , s = $("#J_roomDetail_float")
                        , r = picScroll.getOptions() || {};
                    r.maxPage = parseInt(a.find(".J_slider_box_in").attr("data-page")) || 0,
                        picScroll.reset(r),
                        s.css("top", $(i).offset().top + $(i).offset().height + "px"),
                        s.css("left", $(i).offset().left + 130 + "px"),
                        $("#J_room_detail").html(a.html());
                    var l = $("#J_room_detail .view_360");
                    l.length && (l.bind("click", function () {
                        HotelRoom.InitBaseRoomVR(),
                            s.hide(),
                            $("#J_baseroomvr .J_VRanimation").removeClass("btn_stop"),
                            $("#J_baseroomvr .J_VRanimation").addClass("btn_play"),
                            $("#J_baseroomvr").mask()
                    }),
                        $("#J_baseroomvr .close").bind("click", function () {
                            $("#J_baseroomvr").unmask()
                        })),
                        s.show(),
                        t = t || window.event,
                        t.preventDefault ? t.stopPropagation() : t.cancelBubble = !0
                }
            }
        ;
        var a = function () {
            $(this).hasClass("menu_top_dis") || (topShowIndex--,
                $("#J_baseroomvr .ctrip_360_txt_cont li:eq(" + topShowIndex + ")").css("display", ""),
                $("#J_baseroomvr .ctrip_360_txt_cont li:eq(" + bottomShowIndex + ")").css("display", "none"),
                bottomShowIndex--,
            0 == topShowIndex && $(this).addClass("menu_top_dis"),
                $("#J_baseroomvr .menu_btm").removeClass("menu_btm_dis"))
        }
            , s = function () {
            $(this).hasClass("menu_btm_dis") || ($("#J_baseroomvr .ctrip_360_txt_cont li:eq(" + topShowIndex + ")").css("display", "none"),
                topShowIndex++,
                bottomShowIndex++,
                $("#J_baseroomvr .ctrip_360_txt_cont li:eq(" + bottomShowIndex + ")").css("display", ""),
            bottomShowIndex == self.divPicModal.find(".ctrip_360_txt_cont li").length - 1 && $(this).addClass("menu_btm_dis"),
                $("#J_baseroomvr .menu_top").removeClass("menu_top_dis"))
        }
            , r = function () {
            if ($(this).hasClass("btn_play")) {
                $(this).removeClass("btn_play"),
                    $(this).addClass("btn_stop");
                try {
                    window.frames.J_baseroomvriframe.startRotate()
                } catch (e) {
                }
            } else {
                $(this).removeClass("btn_stop"),
                    $(this).addClass("btn_play");
                try {
                    window.frames.J_baseroomvriframe.stopRotate()
                } catch (e) {
                }
            }
        };
        this.InitBaseRoomVR = function () {
            var e = "/hotel/IframeVR.aspx?vrurl=";
            $.browser.isAllIE && (e = "/hotel/IframeVR.aspx?jsdebug=t&vrurl=");
            for (var t = $("#J_room_detail .hrd-info-pic").attr("data-baseroomvrimage"), o = JSON.parse(t), n = "", i = 0; i < o.length; i++)
                i > 6 ? n += "<li style='display:none' data-url='" + o[i].PictureName + "' > <a href='javascript:;'>" + o[i].PictureTitle + "</a></li>" : 0 == i ? ($("#J_baseroomvriframe")[0].src = e + o[i].PictureName,
                    n += "<li class='current' data-url='" + o[i].PictureName + "' > <a href='javascript:;'>" + o[i].PictureTitle + "</a></li>") : n += "<li data-url='" + o[i].PictureName + "' > <a href='javascript:;'>" + o[i].PictureTitle + "</a></li>",
                    $("#J_baseroomvr .ctrip_360_txt_cont").html(n);
            o.length > 7 && $("#J_baseroomvr .menu_btm").removeClass("menu_btm_dis"),
                $("#J_baseroomvr .ctrip_360_txt_cont li").bind("click", function () {
                    $(this).hasClass("current") || ($("#J_baseroomvr .J_VRanimation").removeClass("btn_stop"),
                        $("#J_baseroomvr .J_VRanimation").addClass("btn_play"),
                        $("#J_baseroomvr .current").removeClass("current"),
                        $(this).addClass("current"),
                        $("#J_baseroomvriframe")[0].src = e + $(this).attr("data-url"))
                });
            if ($("#J_baseroomvr .menu_top").unbind("click", a).bind("click", a),
                $("#J_baseroomvr .menu_btm").unbind("click", s).bind("click", s),
                $("#J_baseroomvr .J_VRanimation").unbind("click", r).bind("click", r),
            $.browser.isAllIE && !$.browser.isIE11)
                $("#J_baseroomvriframe").css("display", "none"),
                    $("#J_baseroomvr .J_VRanimation").css("display", "none"),
                    $(".ctrip_360_tip").css("display", "none"),
                    $(".ctrip_360_browser").css("display", "");
            else {
                $(".ctrip_360_tip").css("display", "");
                var l = setTimeout(function () {
                    $(".ctrip_360_tip").css("display", "none"),
                        clearTimeout(l)
                }, 1e3)
            }
        }
            ,
            this.onInitAllFaci = function (e) {
                var t = e.parentNode.getElementsByTagName("a");
                if (t && t.length > 1) {
                    var o = t[0];
                    o.style.display = "";
                    var n = o.parentNode.getElementsByTagName("ul");
                    n && n.length > 1 && (node = n[1],
                        node.style.display = "none")
                }
            }
            ,
            this.onOrderButtonClick = function (e) {
                window.setToOrderPageTraceLog(e);
                var o = $.parseJSON($(e).attr("bookParam"));
                if (!hotelDomesticConfig.hasLogin || hotelDomesticConfig.IsQuickBooking && !ISSSOQUICKLOGIN)
                    return e.id || (e.id = "btnOrder_" + o.room + "_" + parseInt(1e4 * Math.random())),
                        "true" == $(e).attr("data-isMember") ? ($(e).attr("id", "memberRoomType_" + o.room + "_" + parseInt(1e4 * Math.random())),
                            __SSO_loginShow_1($(e).attr("id"), !0, "0", !0),
                            !1) : (ISSSOQUICKLOGIN ? __SSO_booking(e.id, "undefined" != typeof ISSSOQUICKLOGIN ? ISSSOQUICKLOGIN : 0) : __SSO_loginShow_1(e.id, !0, "0", !0),
                            !1);
                var n = this;
                t("DomesticHotelCityID", {
                    startDate: o.StartDate,
                    endDate: o.DepDate
                }),
                    checkPriceForNewUserPop.judgePopDisplay(e.getAttribute("data-GrpHotelFstOrd"), $.proUrlParam(e.getAttribute("href")), function () {
                        n.Post2Get_order(e, o)
                    })
            }
            ,
            this.Post2Get_order = function (e, t) {
                var o = $("input[name='ishotsale']")
                    , n = 0;
                $(e).attr("data-price") && (n = $(e).attr("data-price")),
                    $("#priceCx").value(n);
                var i = this._collectTagInfo(e)
                    , a = {
                    startdate: t.StartDate,
                    depdate: t.DepDate,
                    hotel: t.hotel,
                    room: t.room,
                    operationType: "NEWHOTELORDER",
                    DealSale: null,
                    UseFG: t.useFG,
                    paymentterm: t.payment,
                    swid: t.swid,
                    sctx: t.sctx,
                    logoType: null,
                    bWeeOrder: null,
                    NoSignupLogin: null,
                    SEM: null,
                    From: o && 1 == o.value() ? "hotsale" : "detail",
                    cityId: null,
                    frominn: null,
                    tag: i.tag,
                    tagtop: i.tagtop,
                    tagrank: i.tagrank,
                    defaultcoupon: t.defaultcoupon,
                    successurl: null,
                    returnurl: t.returnurl,
                    channeltype: null,
                    ishotsale: t.ishotsale,
                    PriceCX: n,
                    isLowestRoom: t.isLowestRoom,
                    roomNumber: t.roomNumbers,
                    PPDSingleVal: t.PPDSingleVal,
                    isTonightPromotion: t.isTonightPromotion,
                    rmsTokenSearch: window.rmsTokenSearch || ""
                };
                e && "ALL" == e.getAttribute("DealSale") ? a.DealSale = "ALL" : e && "EDM" == e.getAttribute("DealSale") ? a.DealSale = "EDM" : e && "VIP" == e.getAttribute("DealSale") && (a.DealSale = "VIP");
                var s, r = hotelDomesticConfig.ref || "";
                if (r)
                    e.getAttribute("data-ctm") ? a.ctm_ref = r.split("hi_0_0_0")[0] + "hi_bk_0_th" : a.ctm_ref = r;
                else {
                    var s = e.getAttribute("data-ctm");
                    if (s) {
                        s = s.replace("#", "");
                        var l = s.indexOf("=");
                        l > 0 && (a[s.substring(0, l)] = s.substring(l + 1))
                    }
                }
                $(".J_priceInfo a").filter(".selected").attr("data-value");
                a.logoType = fm.v("logoType"),
                    a.bWeeOrder = fm.v("bWeeOrder"),
                    a.NoSignupLogin = fm.v("NoSignupLogin"),
                    a.SEM = fm.v("SEM"),
                    a.cityId = fm.v("cityId"),
                    a.frominn = fm.v("frominn"),
                    a.successurl = fm.v("successurl"),
                    a.channeltype = fm.v("channeltype");
                var d = document.createElement("form");
                document.body.appendChild(d),
                    d.method = "post",
                    d.action = addressUrlConfig.order,
                    1 == isBookingInNewPage ? d.target = "_blank" : d.target = "_self";
                for (var c in a) {
                    var u = a[c];
                    if (null != u && "undefined" != u) {
                        var m = document.createElement("input");
                        m.setAttribute("name", c),
                            m.setAttribute("type", "hidden"),
                            m.setAttribute("value", u),
                            d.appendChild(m)
                    }
                }
                d.submit()
            }
            ,
            this.onOrderNull = function (e, t) {
                if (e && t)
                    return MOD.formValidator || (MOD.formValidator = $(document).regMod("validate", "1.1")),
                        MOD.formValidator.method("show", {
                            $obj: $(e),
                            data: t,
                            removeErrorClass: !0,
                            isScroll: !1
                        }),
                        !1
            }
            ,
            this.onOrderRead = function (e, t) {
                if (e && t)
                    return MOD.formValidator || (MOD.formValidator = $(document).regMod("validate", "1.1")),
                        MOD.formValidator.method("show", {
                            $obj: $(e),
                            data: t,
                            removeErrorClass: !0,
                            isScroll: !1
                        }),
                        !1
            }
            ,
            this.onSpotHotel = function (t) {
                if (!e.hasLogin)
                    return __SSO_booking(t.id, 1),
                        !1
            }
            ,
            this._collectTagInfo = function (e) {
                for (var t = null, o = $(e).parentNode(); o && "TR" != o.get(0).tagName.toUpperCase();)
                    o = o.parentNode();
                t = o;
                var n = {
                    tag: null,
                    tagtop: null,
                    tagrank: null
                };
                if (t) {
                    var i = t.find(".J_roomtag");
                    i.length > 0 && (i = i.first(),
                        n = {
                            tag: i.attr("data-tag"),
                            tagtop: i.attr("data-top"),
                            tagrank: i.attr("data-rank")
                        })
                }
                return n
            }
    }
    , hotelDomesticConfig)
    , c_fav_action = "//www.ctrip.com/Member/memberHotelAdd.asp"
    , HotelPicture = function (e) {
    this.init(e)
};
HotelPicture.prototype = {
    init: function (e) {
        if (this.options = {
            data: {},
            btnPrev: null,
            btnNext: null,
            divPrev: null,
            divNext: null,
            lblNum: null,
            lblSum: null,
            lblTitle: null,
            objImg: null,
            objBox: null,
            source: null,
            curIndex: 1,
            curId: null,
            showLen: 0,
            width: 0,
            moveLen: 1,
            onSelect: function () {
            }
        },
            $.extend(this.options, e),
            this.data = this.options.data || [],
            this.data.length) {
            if (this.options.curId) {
                var t = 1;
                if (this.options.data && this.options.data.length > 0)
                    for (var o = 0; o < this.options.data.length; o++)
                        this.options.data[o].pid == this.options.curId && (t = parseInt(this.options.data[o].index) + 1);
                this.options.curIndex = t
            }
            this.left = 0,
                this.max = this.data.length,
                this.mid = Math.ceil(this.options.showLen / 2),
                this.curIndex = this.options.curIndex,
                this.posIndex = this.getPosIndex(),
                this.items = null,
                this.timer = null,
                this.lock = !1,
            this.max && this.options.objBox && (this.setHTML(),
                this.handleBind())
        }
    },
    getPosIndex: function () {
        return this.curIndex <= this.mid || this.max <= this.options.showLen ? 1 : this.curIndex > this.max - this.mid ? this.max - this.options.showLen + 1 : this.curIndex - this.mid + 1
    },
    setHTML: function () {
        this.options.objBox.style.left = "0px",
            this.items = this.options.objBox.children,
            this.openPictureByIndex(this.curIndex)
    },
    openPictureByIndex: function (e) {
        e < 1 ? e = 1 : e > this.max && (e = this.max),
            this.lock = !0,
            this.toCurrent(e)
    },
    openPictureById: function (e) {
        var t = 1;
        if (this.options.data && this.options.data.length > 0)
            for (var o = 0; o < this.options.data.length; o++)
                this.options.data[o].pid == e && (t = parseInt(this.options.data[o].index) + 1);
        this.lock = !0,
            this.toCurrent(t)
    },
    handleBind: function () {
        var e = /pad/.test(navigator.userAgent.toLowerCase()) ? "touchstart" : "click";
        $(this.options.btnPrev).bind(e, this.toPrevPage.bind(this)),
            $(this.options.btnNext).bind(e, this.toNextPage.bind(this)),
            $(this.options.divPrev).bind(e, this.toPrevImg.bind(this)).bind("mouseover", this.handleOver.bind(this)).bind("mouseout", this.handleOut),
            $(this.options.divNext).bind(e, this.toNextImg.bind(this)).bind("mouseover", this.handleOver.bind(this)).bind("mouseout", this.handleOut),
            $(this.options.objBox).bind(e, this.toClick.bind(this))
    },
    toPrevPage: function (e) {
        e = e || window.event;
        var t = this.options.btnPrev;
        this.lock || /disable/i.test(t.className) || (this.lock = !0,
            this.posIndex -= this.options.showLen,
        this.posIndex <= 1 && (this.posIndex = 1,
            t.className = this.options.prevDisabledCls || "page_up_disable"),
            this.options.btnNext.className = this.options.nextCls || "page_down",
            this.marquee(-(this.posIndex - 1) * this.options.width),
            this.showImg(this.posIndex),
            e.preventDefault ? e.stopPropagation() : e.cancelBubble = !0,
            e.preventDefault ? e.preventDefault() : e.returnValue = !1)
    },
    toNextPage: function (e) {
        e = e || window.event;
        var t = this.options.btnNext;
        if (!this.lock && !/disable/i.test(t.className)) {
            this.lock = !0;
            var o = this.max - this.options.showLen + 1;
            this.posIndex += this.options.showLen,
            this.posIndex >= o && (this.posIndex = o,
                t.className = this.options.nextDisabledCls || "page_down_disable"),
                this.options.btnPrev.className = this.options.prevCls || "page_up",
                this.marquee(-(this.posIndex - 1) * this.options.width),
                this.showImg(this.posIndex),
                e.preventDefault ? e.stopPropagation() : e.cancelBubble = !0,
                e.preventDefault ? e.preventDefault() : e.returnValue = !1
        }
    },
    toClick: function (e) {
        e = e || window.event;
        for (var t = e.target || e.srcElement; t !== this.options.objBox && null === t.getAttribute("data-index");)
            t = t.parentNode;
        if (!this.lock) {
            this.lock = !0;
            var o = parseInt(t.dataset ? t.dataset.index : t.getAttribute("data-index"));
            this.toCurrent(o)
        }
        e.preventDefault ? e.stopPropagation() : e.cancelBubble = !0,
            e.preventDefault ? e.preventDefault() : e.returnValue = !1
    },
    toPrevImg: function (e) {
        if (e = e || window.event,
        !this.lock && 1 != this.curIndex) {
            this.lock = !0;
            var t = this.curIndex - 1;
            this.toCurrent(t),
            1 == t && (this.options.divPrev.childNodes[0].className = "",
                this.options.divPrev.style.cursor = "auto"),
                e.preventDefault ? e.stopPropagation() : e.cancelBubble = !0,
                e.preventDefault ? e.preventDefault() : e.returnValue = !1
        }
    },
    toNextImg: function (e) {
        if (e = e || window.event,
        !this.lock && this.curIndex != this.max) {
            this.lock = !0;
            var t = this.curIndex + 1;
            this.toCurrent(t),
            t == this.max && (this.options.divNext.childNodes[0].className = "",
                this.options.divNext.style.cursor = "auto"),
                e.preventDefault ? e.stopPropagation() : e.cancelBubble = !0,
                e.preventDefault ? e.preventDefault() : e.returnValue = !1
        }
    },
    toCurrent: function (e) {
        var t = this.options
            , o = t.nextCls || "page_down"
            , n = t.nextDisabledCls || "page_down_disable"
            , i = t.prevCls || "page_up"
            , a = t.prevDisabledCls || "page_up_disable"
            , s = t.activeCls || "current";
        onSelect = t.onSelect,
            this.items[this.curIndex - 1].className = "",
            this.items[e - 1].className = s,
            this.options.btnPrev.className = e <= this.mid || this.max <= this.options.showLen ? a : i,
            this.options.btnNext.className = e > this.max - this.mid || this.max <= this.options.showLen ? n : o;
        var r = this.data[e - 1] || {
            max: "//pic.c-ctrip.com/common/pic_alpha.gif",
            info: "",
            source: ""
        }
            , l = this.options.objImg;
        r.max && (l.src = r.max),
        l.onerror || (l.onerror = function () {
                l.src = "//pic.c-ctrip.com/hotels110127/no_pic486.png",
                    l.onerror = null
            }
        ),
            this.options.lblTitle.innerHTML = r.info,
            this.options.lblNum.innerHTML = e,
            this.options.source.innerHTML = r.source,
            this.curIndex = e,
            this.posIndex = this.getPosIndex(),
            this.marquee(-(this.posIndex - 1) * this.options.width),
            this.showImg(this.posIndex),
            onSelect.call(this, l, e)
    },
    showImg: function (e) {
        for (var t, o = e - 1, n = o + this.options.showLen; (t = this.items[o]) && o < n; o++) {
            var i = t.childNodes[0];
            i.src || (i.src = i.getAttribute("_src"),
                i.removeAttribute("_src"))
        }
    },
    marquee: function (e) {
        var t = parseInt(this.options.objBox.style.left)
            , o = e - t;
        0 == o ? (this.lock = !1,
            clearTimeout(this.timer)) : (this.options.objBox.style.left = t + (o > 0 ? Math.ceil(o / 5) : Math.floor(o / 3)) + "px",
            this.timer = setTimeout(function () {
                this.marquee(e)
            }
                .bind(this), 20))
    },
    handleOver: function (e) {
        e = e || window.event;
        var t = e.target || e.srcElement;
        "B" == t.nodeName.toUpperCase() ? t = t.parentNode : "DIV" == t.nodeName.toUpperCase() && (t = t.childNodes[0]),
            1 == this.curIndex && "prev" == t.parentNode.className || this.curIndex == this.max && "next" == t.parentNode.className ? (t.className = "",
                t.parentNode.style.cursor = "auto") : (t.className = "hover",
                t.parentNode.style.cursor = "pointer")
    },
    handleOut: function () {
        this.childNodes[0].className = "",
            this.style.cursor = "auto"
    }
},
    function (e) {
        e.fixPosition = function (e, t) {
            "function" != typeof e.addClass && (e = $(e)),
                t = t || {};
            var o, n = e.offset().top;
            if (cQuery.browser.isIE6) {
                var i;
                o = function (o) {
                    i = setTimeout(function () {
                        i && clearTimeout(i);
                        var o = +(document.documentElement.scrollTop || document.body.scrollTop);
                        o > n ? (e[0].style.position = "absolute",
                            e[0].style.bottom = "auto",
                            e[0].style.top = o + "px",
                        "function" == typeof t.onFixed && t.onFixed()) : (e[0].style.position = "static",
                        "function" == typeof t.onStatic && t.onStatic())
                    }, 100)
                }
            } else {
                var a = !1;
                o = function (o) {
                    var i = +(document.documentElement.scrollTop || document.body.scrollTop);
                    if (i > n) {
                        if (a)
                            return;
                        t.fixedClass ? e.addClass(t.fixedClass) : e[0].style.position = "fixed",
                            e[0].style.top = t.topSpace || "0",
                            a = !0,
                        "function" == typeof t.onFixed && t.onFixed()
                    } else
                        t.fixedClass ? e.removeClass(t.fixedClass) : e[0].style.position = "",
                            e[0].style.top = "",
                            a = !1,
                        "function" == typeof t.onStatic && t.onStatic();
                    tracklog.rollingscreenTrack(),
                        tracklog.rollingscreenTrackComment()
                }
            }
            return $(window).bind("scroll", o),
                {
                    updateUpper: function () {
                        cQuery.browser.isIE6 ? (e[0].style.position = "static",
                            n = e.offset().top) : (t.fixedClass ? e.removeClass(t.fixedClass) : e[0].style.position = "",
                            n = e.offset().top),
                            o()
                    }
                }
        }
    }(window),
    window.searchMaiDian = {
        version: "",
        destination: "",
        destination_input: "",
        property_dstn: "",
        keyword: "",
        keyword_input: "",
        property_kwd: "",
        keyword_type: "",
        prepageid: "",
        isothercity: "",
        rank_kwd: "",
        rank_dstn: ""
    },
    window.associationMatchMaiDian = {
        destination: "",
        keyword: "",
        ismatch_dstn: "",
        ismatch_kyw: "",
        target: ""
    };
var PageLoad = function (e) {
    function t() {
        var e = document.getElementById("divViewCount");
        e.style.top = document.documentElement.scrollTop + document.documentElement.clientHeight - e.offsetHeight - 10 + "px"
    }

    function o(e) {
        if (e && e.length) {
            var t = ""
                , o = document.getElementById("popCommentPic")
                , n = function (e) {
                var t = document.documentElement.scrollLeft || document.body.scrollLeft
                    , o = document.documentElement.scrollTop || document.body.scrollTop;
                return {
                    left: t - document.documentElement.clientLeft,
                    top: o - document.documentElement.clientTop,
                    x: e.clientX,
                    y: e.clientY,
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                }
            };
            e.bind("mouseover", function (e) {
                e = e || window.event;
                var n = e.target || e.srcElement;
                if ("DIV" == n.nodeName) {
                    var i = n.getAttribute("_src");
                    if (!i)
                        return;
                    t != i && (o.getElementsByTagName("img")[0].src = i,
                        o.getElementsByTagName("p")[0].innerHTML = n.alt,
                        t = i),
                        setTimeout(function () {
                            o.style.display = ""
                        }, 500)
                }
            }).bind("mouseout", function (e) {
                e = e || window.event;
                var n = e.target || e.srcElement;
                "DIV" == n.nodeName && (t = "",
                    o.style.display = "none",
                    o.style.top = "-1000px",
                    o.getElementsByTagName("img")[0].src = "//pic.c-ctrip.com/common/pic_alpha.gif",
                    o.getElementsByTagName("p")[0].innerHTML = "")
            }).bind("mousemove", function (e) {
                if (e = e || window.event,
                    t) {
                    var i = n(e);
                    o.style.left = (i.width - 550 < i.x ? i.x - 560 : i.x + 10) + i.left + "px",
                        o.style.top = Math.min(i.height - 446, i.y + 10) + i.top + "px"
                }
            })
        }
    }

    function n() {
        function t() {
            var e = ($("#cPageNum"),
                $("#cPageBtn"),
                $("#commentList"))
                , t = ""
                , o = "&orderBy="
                , n = "&UserType=-1"
                , i = "&keyword="
                , a = "&roomName="
                , s = function () {
                var r, l = $("#cPageNum"), d = parseInt(l.value()),
                    c = parseInt(document.getElementById("cTotalPageNum").value);
                r = d && d >= 1 && d <= c ? d : d > c ? c : 1,
                $(".select_sort")[0] && (o = "&orderBy=" + dropDownPlugin.getSelectOption($(".select_sort")[0])),
                    n = "&userType=" + dropDownPlugin.getSelectOption($(".select_ctrip")[0]);
                var h = $("#J_searchInput").value();
                i = searchResultNS.getSearchBoxVal(h, i),
                $(".select_room")[0] && (a = "&roomName=" + encodeURIComponent(escape(dropDownPlugin.getSelectOption($(".select_room")[0]))));
                var p = "&productcode=" + expand($.cookie.get("productcode"))
                    ,
                    f = addressUrlConfig.ajaxCommentList + t + "&currentPage=" + parseInt(r) + p + getUrlPice() + getUrlFixedBugPice() + n + i + o;
                $(".select_room")[0] && (f += a),
                    f += "&contyped=" + parseInt(window.getuseridentityresult()),
                    u.getCommentList(f, {
                        cache: !0,
                        onsuccess: function (t) {
                            if (window.hideCommentBigImg(),
                                t) {
                                if ($.myFn.refresh(t, "get", null))
                                    return;
                                e[0].style.display = "block",
                                    e[0].innerHTML = t,
                                    searchResultNS.enterAjax(),
                                    imgHoverPlugin.construct(),
                                $("#commentList .commentGrabOff").length && commentGrabOff.construct($("#commentList .commentGrabOff")),
                                    dropDownPlugin.isOptionClickFun(),
                                    showUnfoldPlugin.initLazyLoad($(".htl_reply .show_unfold"), $(".htl_reply .show_fold")),
                                    placeholderPlugin.initLazyLoad($("#J_searchInput"), $("#J_searchInput").attr("data-placeholder"), "inputSel"),
                                    m("commentTracker", "hotel.comment"),
                                    m("commentTracker20150415", "htl.comment.chooseorsearch"),
                                    $("#cPageBtn").bind("click", function () {
                                        s()
                                    });
                                var o = parseInt($("#id_comment_arrow").offset().top);
                                window.scroll(0, o - 48),
                                    changRoomClass()
                            }
                        }
                    })
            };
            searchResultNS.pageclick = s;
            var r = function (o) {
                o = o || window.event;
                var n = o.target || o.srcElement;
                if (!$(n).hasClass("commentGrabOff")) {
                    "#DOCUMENT" == n.nodeName.toUpperCase() && (n = $("#commentList").get(0));
                    var i = "&property=-1"
                        , a = "&card=-1"
                        , r = "&UserType=-1"
                        , l = "&keyword="
                        , d = "&roomName="
                        , c = "&orderBy="
                        , h = ""
                        , p = ""
                        , f = addressUrlConfig.ajaxCommentList;
                    if (f = f.replace(/[&](card|property|cardpos)=([^&]*)/g, ""),
                        r = "&userType=" + dropDownPlugin.getSelectOption($(".select_ctrip")[0]),
                    $(".select_room")[0] && (d = "&roomName=" + encodeURIComponent(escape(dropDownPlugin.getSelectOption($(".select_room")[0])))),
                    "SPAN" == n.nodeName.toUpperCase() && (l = searchResultNS.getSearchBoxVal(_, l),
                        "All_Comment" === n.getAttribute("id") || "Recomment" === n.getAttribute("id") || "No_Recoment" === n.getAttribute("id") || "HasImage" === n.getAttribute("id") ? (t = n.getAttribute("commentparam") ? n.getAttribute("commentparam") : "",
                            n = n.parentNode) : ($(n).hasClass("del") || $(n).hasClass("n")) && (n = n.parentNode),
                    "A" == n.parentNode.nodeName.toUpperCase() && (n = n.parentNode)),
                    "A" == n.nodeName.toUpperCase() && !$(n).hasClass("J_baseroom_link") || dropDownPlugin.isOptionClick || "J_searchResultBtn" == $(n).attr("id") || "J_searchResultDel" == $(n).attr("id") || searchResultNS.isSearchClick) {
                        if (window.commentInType = window.CommentType.Other,
                            o.stop(),
                        $(n).hasClass("show_unfold") || $(n).hasClass("show_fold"))
                            return;
                        var _ = $("#J_searchInput").value();
                        if ("J_searchResultDel" == $(n).attr("id") && $("#J_searchInput").value(""),
                        ("J_searchResultBtn" == $(n).attr("id") || searchResultNS.isSearchClick) && (a = "&card=-1",
                            t = "",
                            h = "&keywordPress=1",
                            r = "&UserType=",
                            d = "&roomName="),
                        dropDownPlugin.isOptionClick && (t = ""),
                            l = searchResultNS.getSearchBoxVal(_, l),
                        $(".select_sort")[0] && (c = "&orderBy=" + dropDownPlugin.getSelectOption($(".select_sort")[0])),
                            o.stop(),
                            $(n).hasClass("NotNormalComment")) {
                            var v = $(n).attr("data-type")
                                , g = $(n).attr("data-value")
                                , b = $("#comment_loading");
                            b.css({
                                display: "block"
                            }),
                                e.css({
                                    display: "none"
                                });
                            var C = "&productcode=" + expand($.cookie.get("productcode"))
                                ,
                                w = addressUrlConfig.ajaxCommentList + "&" + v + "=" + g + "&contyped=" + parseInt(window.getuseridentityresult()) + C;
                            return void u.getCommentList(w, {
                                cache: !1,
                                onsuccess: function (t) {
                                    window.hideCommentBigImg(),
                                    $.myFn.refresh(t, "get", null) || (b.css({
                                        display: "none"
                                    }),
                                        e.css({
                                            display: "block"
                                        }).html(t),
                                        imgHoverPlugin.construct(),
                                        showUnfoldPlugin.initLazyLoad($(".htl_reply .show_unfold"), $(".htl_reply .show_fold")))
                                }
                            })
                        }
                        if ($(n).hasClass("useful"))
                            return;
                        if ($(n).hasClass("txt")) {
                            if ($(n).hasClass("disabled"))
                                return;
                            if (!$(n).hasClass("selected") && $(n).attr("data-value")) {
                                var y = $(n).attr("data-value").split(",");
                                i = "&property=" + parseInt(y[0]),
                                    a = "&card=" + parseInt(y[1])
                            }
                        } else {
                            var k = $("#commentList a.txt.selected");
                            if (k.length > 0 && $(k[0]).attr("data-value")) {
                                var y = $(k[0]).attr("data-value").split(",");
                                i = "&property=" + parseInt(y[0]),
                                    a = "&card=" + parseInt(y[1])
                            }
                        }
                        var x = "";
                        n.getAttribute("postdata") && (x = n.getAttribute("postdata"));
                        var I = "";
                        "c_page_list layoutfix" != n.parentNode.className && "c_page" != n.parentNode.className || !n.getAttribute("value") || (I = "&currentPage=" + parseInt(n.getAttribute("value")),
                            window.commentInType = window.CommentType.Pager),
                        $(".select_room")[0] || (d = "");
                        var C = "&productcode=" + expand($.cookie.get("productcode"));
                        null != $(".user_impress").find(".current").attr("data-id") && "" != $(".user_impress").find(".current").attr("data-id") && (p = "&commentTagID=" + $(".user_impress").find(".current").attr("data-id")),
                        null != $(n).attr("data-id") && "" != $(n).attr("data-id") && ($(n).parentNode().find(".current").attr("data-id") == $(n).attr("data-id") ? (p = "",
                            $(n).removeClass("current")) : (p = "&commentTagID=" + $(n).attr("data-id"),
                            $(n).parentNode().find("a").removeClass("current"),
                            $(n).addClass("current"))),
                            f = f + h + a + i + r + C + l + d + c + t + x + I + getUrlPice() + getUrlFixedBugPice() + p,
                            f += "&contyped=" + parseInt(window.getuseridentityresult()),
                            u.getCommentList(f, {
                                cache: !1,
                                onsuccess: function (t) {
                                    if (window.hideCommentBigImg(),
                                        dropDownPlugin.isOptionClick = !1,
                                        searchResultNS.isSearchClick = !1,
                                    "" != t) {
                                        if ($.myFn.refresh(t, "get", null))
                                            return;
                                        e[0].style.display = "block",
                                            e[0].innerHTML = t,
                                            changRoomClass(),
                                            searchResultNS.enterAjax(),
                                            imgHoverPlugin.construct(),
                                        $("#commentList .commentGrabOff").length && commentGrabOff.construct($("#commentList .commentGrabOff")),
                                            dropDownPlugin.isOptionClickFun(),
                                            showUnfoldPlugin.initLazyLoad($(".htl_reply .show_unfold"), $(".htl_reply .show_fold")),
                                            placeholderPlugin.initLazyLoad($("#J_searchInput"), $("#J_searchInput").attr("data-placeholder"), "inputSel"),
                                            showMore.initBindEvent(),
                                            m("commentTracker", "hotel.comment"),
                                            m("commentTracker20150415", "htl.comment.chooseorsearch"),
                                            $("#cPageBtn").bind("click", function () {
                                                s()
                                            });
                                        var o = parseInt($("#id_comment_arrow").offset().top);
                                        window.scroll(0, o - 48)
                                    }
                                }
                            })
                    }
                    "INPUT" == n.nodeName.toUpperCase() && "c_page_submit" == n.className && (o.stop(),
                        s())
                }
            };
            e.unbind("click", r),
                e.bind("click", r)
        }

        var o = function (e, t) {
            var o = {
                val: 0,
                max: 0,
                min: 0,
                item: e,
                setValue: function (e) {
                    e <= this.max && e >= this.min ? this.val = e : e > this.max ? this.val = this.max : this.val = this.min,
                        this.item.find(".number_input").value(this.val),
                        n(),
                        t(e)
                },
                init: function (e) {
                    this.setValue(e),
                        t(e)
                }
            }
                , n = function () {
                o.val > o.min && o.item.find(".number_reduce").removeClass("number_disable"),
                o.val < o.max && o.item.find(".number_plus").removeClass("number_disable"),
                o.val <= o.min && o.item.find(".number_reduce").addClass("number_disable"),
                o.val >= o.max && o.item.find(".number_plus").addClass("number_disable")
            };
            return e.find(".number_input").bind("blur", function () {
                o.setValue(parseIntNull(o.item.find(".number_input").value())),
                    t(o.val)
            }),
                e.find(".number_reduce").bind("click", function () {
                    o.val > o.min && (o.val--,
                        o.item.find(".number_input").value(o.val),
                        t(o.val)),
                        n()
                }),
                e.find(".number_plus").bind("click", function () {
                    o.val < o.max && (o.val++,
                        o.item.find(".number_input").value(o.val),
                        t(o.val)),
                        n()
                }),
                n(),
                o
        };
        $("#J_roomCount_Detail").bind("focus", function () {
            $("#J_roomCountDiv_Detail").addClass("n_gst_active")
        }),
            $("#J_roomCount_Detail").bind("blur", function () {
                $("#J_roomCountDiv_Detail").removeClass("n_gst_active")
            }),
            $("#J_roomCount_Detail_i").bind("click", function () {
                $("#J_roomCount_Detail")[0].focus()
            });
        for (var n = 1; n <= 9; n++) {
            var i = document.createElement("li");
            i.innerHTML = n + "间",
                $("#J_roomCountList_Detail").append(i)
        }
        $("#J_roomCountList_Detail").bind("mousedown", function (e) {
            $("#J_roomCount_Detail").value($(e.target).html()),
                a()
        });
        var a = function () {
            try {
                var e = $("#J_roomCount_Detail").value()
                    , t = parseInt(e.substring(0, e.length - 1), 10);
                t >= 1 && t <= 9 || (t = 1),
                    $("#J_roomCount_Detail").value(t + "间");
                for (var o = t + "," + s.val + "," + r.val, n = 0; n < r.val; n++)
                    o += "," + $("#J_childageVal_Detail" + n).value();
                $("#J_RoomGuestCount_Detail").value(o),
                    $("#J_RoomGuestInfoTxt_Detail").value(s.val + "成人 " + (r.val > 0 ? r.val + "儿童" : ""))
            } catch (i) {
            }
        };
        $("#J_RoomGuestInfoTxt_Detail,#J_RoomGuestInfoTxt_i_Detail").bind("click", function () {
            var e = new Date($("#txtCheckIn").value())
                , t = e.getFullYear()
                , o = e.getMonth() + 1
                , n = e.getDate();
            $(".J_today").html(t + "年" + o + "月" + n + "日"),
                $("#J_RoomGuestInfoDiv_Detail").addClass("n_gst_active")
        }),
            $(".J_childageVal").each(function (e) {
                if (0 == e.childNodes().length) {
                    elem = document.createElement("option"),
                        elem.value = "0",
                        elem.text = "<1岁",
                        e.append(elem);
                    for (var t = 1; t < 18; t++)
                        elem = document.createElement("option"),
                            elem.value = t,
                            elem.text = t + "岁",
                        12 == t && (elem.selected = !0),
                            e.append(elem)
                }
            }),
            $("#J_RoomGuestInfoBtnOK_Detail").bind("click", function () {
                if (r.val > 0)
                    for (var e = 0; e < r.val; e++)
                        if ("" == $("#J_childageVal_Detail" + e).value())
                            return void $("#J_RoomGuestInfoDiv_Detail").find(".n_gst_childs_tips").show();
                $("#J_RoomGuestInfoDiv_Detail").find(".n_gst_childs_tips").hide(),
                    a(),
                    $("#J_RoomGuestInfoDiv_Detail").removeClass("n_gst_active")
            }),
            $("#J_RoomGuestInfoBtnCancel_Detail").bind("click", function () {
                $("#J_RoomGuestInfoDiv_Detail").removeClass("n_gst_active")
            });
        var s = o($("#J_AdultCount_Detail"), function () {
        });
        s.min = 1,
            s.max = 36,
            s.init(1);
        var r = o($("#J_ChildCount_Detail"), function () {
            0 == r.val ? $("#J_childageValDiv_Detail").hide() : $("#J_childageValDiv_Detail").show();
            for (var e = 0; e < 9; e++)
                e < r.val ? $("#J_childageVal_Detail" + e).show() : $("#J_childageVal_Detail" + e).hide()
        });
        r.min = 0,
            r.max = 9,
            r.init(0);
        try {
            var l = $("#J_RoomGuestCount_Detail").value();
            l = l.split(","),
                $("#J_roomCount_Detail").value(parseInt(l[0]) + "间"),
                s.setValue(parseInt(l[1])),
                r.setValue(parseInt(l[2]));
            for (var n = 0; n < r.val; n++)
                $("#J_childageVal_Detail" + n).value(parseInt(l[3 + n]));
            a()
        } catch (d) {
        }
        var c = e.hotel.vacationsDP
            , m = function (e, t) {
            var o = $("#" + e)[0] && $("#" + e).text() || "";
            o && window.__bfi.push(["_tracklog", t, o])
        };
        if (c) {
            window.fm = document.forms[0],
            fm && (window.fm.v = function () {
                    var e = arguments
                        , t = e.length
                        , o = this.elements;
                    if (1 == t) {
                        if ("string" == typeof e[0])
                            return o[e[0]] ? o[e[0]].value.trim() : null;
                        for (var n in e[0])
                            o[n] && (o[n].value = e[0][n])
                    } else
                        2 == t && o[e[0]] && (o[e[0]].value = e[1]);
                    return this
                }
            );
            var h = $("#cc_txtCheckIn")
                , p = $("#cc_txtCheckOut");
            new RegMod({
                city: $("#txtCity"),
                startDate: $("#txtCheckIn"),
                endDate: $("#txtCheckOut"),
                keyword: $("#txtKeyword"),
                checkInDate: h.length ? h : [],
                checkOutDate: p.length ? p : [],
                meetingCheckIn: $("#meetingCheckIn"),
                meetingCheckOut: $("#meetingCheckOut")
            });
            HotelSearch.init();
            var f = setTimeout(function () {
                if (clearTimeout(f),
                "undefined" == typeof window.CHINA_HOTEL_CITY_RAW_DATA) {
                    var e = arguments.callee;
                    return void (f = setTimeout(e, 100))
                }
                MOD.a_city.method("validate")
            }, 50);
            $("#btnSearch").bind("click", function (e) {
                var t = document.getElementsByTagName("form")[0];
                HotelSearch.submit() && (sendAjaxWithKeyword(),
                    t.submit()),
                    e.stop()
            })
        }
        $.mod.load("jmp", "1.0", function () {
            $(document).regMod("jmp", "1.0", {
                options: {
                    alignTo: "cursor"
                }
            })
        });
        var _ = $("#divDetailMain")
            , v = $("#J_room_list_tabs");
        v.length && (v.css({
                backgroundColor: "#FFF",
                zIndex: 10
            }),
                window.hotelTabsFixer = fixPosition(v, {
                    topSpace: "0px",
                    onFixed: function () {
                        $("#lnkBook").removeClass("hidden");
                        var e = _.css("width").indexOf("px") == -1 ? _[0].offsetWidth : parseInt(_.css("width"));
                        HAS_ROOM_RESULT && $("#lnkBook").removeClass("hidden"),
                            v.css({
                                width: e + "px"
                            })
                    },
                    onStatic: function () {
                        $("#lnkBook").addClass("hidden")
                    }
                }),
                window.onresize = function () {
                    if (!isNaN(parseInt(v[0].style.width))) {
                        var e = _.css("width").indexOf("px") == -1 ? _[0].offsetWidth : parseInt(_.css("width"));
                        v.css({
                            width: e + "px"
                        })
                    }
                }
        ),
            function () {
                var e = 48
                    , t = $("#J_room_list_tabs");
                $("#J_room_list_tabs li a").bind("click", function (o) {
                    var n = $(this).parentNode()
                        , i = n.attr("data-to")
                        , a = 0;
                    return $("#" + i).length > 0 && (a = parseInt($("#" + i).offset().top),
                    "bookTab" != n[0].id && "commentTab" != n[0].id || (a -= e,
                    "fixed" != t.css("position") && (a -= e)),
                        window.scrollTo(0, a)),
                        o && o.preventDefault ? o.preventDefault() : window.event.returnValue = !1,
                        !1
                }),
                    $(window).bind("scroll", function (o) {
                        var n = parseInt($("#id_detail_arrow").offset().top)
                            , i = parseInt($("#id_comment_arrow").offset().top)
                            , a = $("#bookTab")
                            , s = $("#commentTab")
                            , r = $("#J_room_list_tabs .fn-hotel-list")
                            , l = $("#J_room_list_tabs .fn-shx-dp")
                            , d = $("#J_room_list_tabs .fn-meeting-list")
                            , c = e
                            , u = document.documentElement.scrollTop || document.body.scrollTop;
                        "fixed" != t.css("position") && (c += e),
                            u < n - c ? r.hasClass("current") || l.hasClass("current") || d.hasClass("current") || ($("#J_room_list_tabs li").removeClass("current"),
                                "none" != $("#id_room_select_box").css("display") ? r.addClass("current") : $(".IFR-SHDPX").length && "none" != $(".IFR-SHDPX").css("display") ? l.addClass("current") : d.addClass("current")) : u >= n - c && u < i - c ? a && !a.hasClass("current") && ($("#J_room_list_tabs li").removeClass("current"),
                                a.addClass("current")) : s && !s.hasClass("current") && ($("#J_room_list_tabs li").removeClass("current"),
                                s.addClass("current"))
                    }),
                2 == tabtype && setTimeout(function () {
                    var o = parseInt($("#id_comment_arrow").offset().top);
                    o -= e,
                    "fixed" != t.css("position") && (o -= e),
                        window.scrollTo(0, o)
                }, 300)
            }(),
            function () {
                var e = ($("#J_detail_extracontent"),
                    $("#J_show_unfold"))
                    , t = $("#J_show_fold")
                    , o = $("#J_htl_facilities")
                    , n = ($("#J_layoutfix"),
                    $(".htl_info_table"),
                    o.find("tr:not(:last)").find("li[data-rank=0]"));
                e.bind("click", function (e) {
                    o.find("tr").each(function (e) {
                        $(e).removeClass("hidden")
                    }),
                        n.removeClass("hidden"),
                        $(this).parentNode().addClass("hidden"),
                        t.parentNode().removeClass("hidden")
                }),
                    t.bind("click", function (t) {
                        o.find("tr[data-init=0]").each(function (e) {
                            $(e).addClass("hidden")
                        }),
                            n.addClass("hidden"),
                            $(this).parentNode().addClass("hidden"),
                            e.parentNode().removeClass("hidden")
                    })
            }(),
            t(),
            function () {
                var e = $("#J_realContact");
                e.length && e.bind("click", function () {
                    var e = $(this)
                        , t = $("#linkViewMap").attr("data-hotelId");
                    e.css({
                        color: "inherit",
                        cursor: "default"
                    }).html(e.attr("data-real")),
                        window.__bfi.push(["_tracklog", "online.hotelcontact", "hotelid=" + t])
                })
            }()
    }

    function i() {
        var e = document.getElementById("divPicModal_2");
        if (e) {
            var t, o, n, i = $("#J_videoStage_2"), a = "", s = {
                pic: function () {
                    t = new HotelPicture({
                        data: pictureConfig.album,
                        btnPrev: document.getElementById("btnPrev"),
                        btnNext: document.getElementById("btnNext"),
                        divPrev: document.getElementById("divPrev_2"),
                        divNext: document.getElementById("divNext_2"),
                        lblNum: document.getElementById("lblNum"),
                        lblSum: document.getElementById("lblSum"),
                        lblTitle: document.getElementById("lblTitle"),
                        objImg: document.getElementById("mainPic"),
                        objBox: document.getElementById("listBox"),
                        source: document.getElementById("picSource"),
                        showLen: 7,
                        width: 88,
                        curId: pictureConfig.guid || ""
                    }),
                    t && delete s.pic
                },
                pic360: function () {
                    var e = document.getElementById("J_ctrip_old360_2")
                        , t = !1
                        , o = document.getElementById("J_ctrip_new360_2");
                    o && pictureConfig.picture360 ? (document.getElementById("J_360Pic_num_2") && (document.getElementById("J_360Pic_num_2").innerHTML = ""),
                    document.getElementById("J_ctrip_360_pic_2") && (document.getElementById("J_ctrip_360_pic_2").innerHTML = ""),
                    document.getElementById("J_ctrip_360_txt_2") && (document.getElementById("J_ctrip_360_txt_2").innerHTML = ""),
                        o.style.display = "block",
                    t || (initNewPic360({
                        numId: "#J_360Pic_num_2",
                        txtId: "#J_ctrip_360_txt_2",
                        picId: "#J_ctrip_360_pic_2"
                    }),
                        t = !0)) : e && "about:blank" !== pictureConfig.ifm360src && (e.style.display = "block",
                    document.getElementById("ifm360_2") || (document.getElementById("divB360_2").innerHTML = '<iframe id="ifm360_2" src="' + pictureConfig.ifm360src + '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="100%" height="100%" allowtransparency="yes"></iframe>')),
                        delete s.pic360
                },
                video: function () {
                    var e = '<iframe height="360" width="640" frameborder="0" scrolling="no" allowtransparency="true" src="//yuntv.letv.com/bcloud.html?${flashvars}"/>'
                        , t = function (t) {
                        return e.replace("${flashvars}", t)
                    }
                        , n = pictureConfig.videos.data;
                    o = new HotelPicture({
                        data: pictureConfig.videos.data,
                        btnPrev: document.getElementById("J_prevVideo_2"),
                        btnNext: document.getElementById("J_nextVideo_2"),
                        lblNum: document.getElementById("J_curVideoIndex_2"),
                        lblSum: document.getElementById("J_totalVideos_2"),
                        lblTitle: document.getElementById("J_videoTitle_2"),
                        objImg: i[0],
                        objBox: document.getElementById("J_videosList_2"),
                        source: "",
                        showLen: 4,
                        width: 156,
                        curId: pictureConfig.guid || "",
                        prevCls: "prev_btn",
                        prevDisabledCls: "prev_btn disabled",
                        nextCls: "next_btn",
                        nextDisabledCls: "next_btn disabled",
                        activeCls: "active",
                        onSelect: function (e, o) {
                            var i = t(n[o - 1].flashvars);
                            e.innerHTML = i,
                                a = i
                        }
                    }),
                    o && delete s.video
                }
            };
            $.mod.load("tab", "1.2", function () {
                var e = {
                    options: {
                        tab: "#picBoxTab_2 a",
                        panel: "#divPicModal_2>.detail_pic_box>div",
                        trigger: "click",
                        save: !1
                    },
                    style: {
                        tab: ["current", ""],
                        panel: {
                            display: ["block", "none"]
                        }
                    },
                    listeners: {
                        returnTab: function (e, t) {
                            var o = $(t).attr("data-category").toLowerCase()
                                , n = "video" === o
                                , r = o && s[o];
                            i.html(n ? a : ""),
                            n && (a = i.html()),
                            r && r()
                        }
                    }
                };
                n = $("#divPicModal_2").regMod("tab", "1.2", e),
                    function (e, t) {
                        var o = function () {
                            var e = t.currentPicTabLabel;
                            return e ? e : (e = /#tab\=(\w+).*/.exec(location.hash),
                            e && e[1] || "")
                        }
                            , n = 0
                            , i = function (t) {
                            n = t && r.find("a[data-category]").indexOf(r.find("a[data-category=" + t + "]")) || 0,
                                e.method("select", n)
                        }
                            , a = $(".J_switchPicTab")
                            , s = o()
                            , r = $("#picBoxTab");
                        i(s),
                        a.length && a.bind("click", function () {
                            i($(this).attr("data-tab-label"))
                        })
                    }(n, hotelDomesticConfig),
                    $("#J_picCategory_2").bind("click", function (e) {
                        e.stop();
                        var o = "current"
                            , n = $(e.target);
                        $(this).find("." + o).removeClass(o),
                        "a" === n[0].tagName.toLowerCase() && (n.addClass(o),
                        t && t.openPictureById(n.attr("data-index")))
                    })
            })
        }
    }

    function a() {
        var t = $("#more")
            , n = document.getElementById("htlDes");
        window.initedHotelLists = !1,
        n && (n.children[0].offsetHeight >= 72 ? t.removeClass("hidden") : n.style.height = "auto",
            t.bind("click", function () {
                n.style.height = "auto",
                    t.addClass("hidden")
            }));
        var i = e.hotel.vacationsDP;
        if (i) {
            var a = document.getElementById("cc_txtCheckIn")
                , s = document.getElementById("cc_txtCheckOut")
                , r = document.getElementById("hotelRoomBox")
                , l = "";
            l = 1 == isNewBookSucessVer ? '<td colspan="4" class="room_type">' : '<td colspan="5" class="room_type">';
            var c = ['<td class="hotel_spot_item1">优惠套餐</td>', l, "<div>", '<span class="icon_tag_hotel">酒店</span>', '<p title="${RoomEntity.RoomName}">${RoomEntity.RoomName}</p>', "<span> <strong>${RoomEntity.Nights}</strong>", "晚", "</span>", "</div>", "<div>", '<span class="icon_tag_ticket">门票</span>', '<p title="${CheapestTicket.TicketName}">${CheapestTicket.TicketName}</p>', "<span> <strong>${CheapestTicket.TicketCount}</strong>", "张", "</span>", "</div>", "</td>", "<td>", "<p>", "<strong>&nbsp;&nbsp;套餐价</strong>", "</p>", "<p>", '<span class="base_price"> <dfn>￥</dfn>', "${TotalPrice.Price}", "</span>", "</p>", "</td>", '<td><a id="SHXDP_buy_button" href="${Url}" onclick="return window.HotelRoom.onSpotHotel(this);" class="btn_buy spotOrderButton">立即预订</a></td>'].join("");
            window.showRoomListTab = function () {
                $("#J_room_list_tabs li").removeClass("current"),
                    $(this).addClass("current"),
                    $("#id_room_select_box").show(),
                    $("iframe.IFR-SHDPX").hide(),
                    $("#J_meeting_list").hide(),
                window.checkInDateFromOtherTab && window.checkOutDateFromOtherTab && ($("#cc_txtCheckIn").value(window.checkInDateFromOtherTab),
                    $("#cc_txtCheckOut").value(window.checkOutDateFromOtherTab),
                    $("#changeBtn").click(),
                    window.checkInDateFromOtherTab = null,
                    window.checkOutDateFromOtherTab = null)
            }
                ,
                getRoomHTML = function (t, o) {
                    t = t || !1;
                    var n, i = $("#J_HorizontalVersionPay").find(".choosed[data-value=3]").length > 0,
                        a = $("#J_HorizontalVersionOther .choosed[data-type='confirm']").length > 0,
                        s = document.getElementById("startdate").value, l = document.getElementById("depdate").value,
                        m = (e.hotel.id,
                            document.getElementById("chkTMony")), h = document.getElementById("chkJustConfirm"),
                        p = document.getElementById("hotsalesroomids").value, f = i ? "T" : m && m.checked ? "T" : "F",
                        _ = a ? "T" : h && h.checked ? "T" : "F", v = window.priceInfo || -1;
                    n = window.hourRoomObj ? window.hourRoomObj ? window.hourRoomObj.getFilterParam() : "" : "4" == $("#J_HorizontalVersionOther .choosed[data-type='CtripService']").attr("data-value") ? "CtripService|4" : "";
                    var g = $("#isTravelMoneyFromList")
                        , b = $("#isJustConfirmFromList")
                        , C = $("#bookingoverTip")
                        ,
                        w = $(".c_sort_pay").find(".choosed[data-value=4]").length || $("#J_HorizontalVersionPay").find(".choosed[data-value=4]").length ? "T" : "F";
                    if (a || h || (_ = b.value()),
                        $("#noPriceInfo").html(""),
                        r.innerHTML = '<div class="htl_room_table"><div class="room_list_loading">' + roomMessageConfig.loading + "</div></div>",
                        r.className = "",
                    "undefined" != typeof useNewCompare && useNewCompare) {
                        var y = $("#J_RoomChange .a_choosed");
                        if ("compare" == y.attr("id")) {
                            hotelDomesticConfig.hotel.id;
                            return void window.App.callLoadCompareRoomList()
                        }
                    }
                    $("#J_CompareExtension").addClass("hidden"),
                        $("#J_HotelCompare").addClass("hidden");
                    var k = window.initedHotelLists ? addressUrlConfig.ajaxRoomListBaseUrl : addressUrlConfig.ajaxRoomList
                        ,
                        x = k + "&startDate=" + s + "&depDate=" + l + "&IsFlash=" + w + "&RequestTravelMoney=" + f + "&hsids=" + p + "&IsJustConfirm=" + _ + "&contyped=" + parseInt(window.getuseridentityresult()) + "&priceInfo=" + v + "&equip=" + window.equip + "&filter=" + n + "&productcode=" + expand($.cookie.get("productcode")) + "&couponList=" + $("#defaultcoupon").value() + "&abForHuaZhu=" + $("#abForHuaZhu").value() + "&defaultLoad=" + ("T" == $("#defaultLoad").value() ? "T" : "F");
                    g.value() && (x = x + "&TmFromList=" + g.value());
                    var I = 0 == $("#J_price_nolimit.choosed").length
                        , J = [];
                    if (I) {
                        $("#J_price_range .choosed").each(function (e, t) {
                            var o = $(e).attr("data-range");
                            o && J.push(o)
                        });
                        var S = $("#J_price_min").value() || ""
                            , T = $("#J_price_max").value() || "";
                        (S || T) && (J = [(S || 0) + "-" + (T || 2147483647)]),
                            x = x + "&pricefilter=" + J.join(",")
                    }
                    if (x = x + "&RoomGuestCount=" + $("#J_RoomGuestCount_Detail").value(),
                    $("#J_promotionf") && !$("#J_promotionf").hasClass("hidden")) {
                        var N = "";
                        $(".J_prom_item").each(function (e, t) {
                            e.hasClass("choosed") && (N += e.attr("data-id") + ",")
                        }),
                            x = x + "&promf=" + N
                    } else {
                        var N = $("#J_promotionf").attr("data-default");
                        N && (x = x + "&promf=" + N)
                    }
                    var P = d("showflagship");
                    P && (x = x + "&showflagship=" + P),
                        window.spotHotelAndGroup.load(),
                        window.spotHotelAndGroup.retain(),
                        window.spotHotelAndGroup.retain(),
                        u.getHotelDetails(x, {
                            onsuccess: function (e) {
                                $("#defaultLoad").value("F"),
                                    loaded = !0;
                                var n = function (t) {
                                    var o = HotelMaiDianData;
                                    o.value.loadtime = (new Date).getTime() - new Date(o.value.loadtime).getTime();
                                    var n = "";
                                    $("#visitedHistory").get(0) && (n = [],
                                        $("#visitedHistory ul li").each(function (e) {
                                            n.push($(e.find("a").get(0)).attr("data-id"))
                                        })),
                                        o.value.pageid = $("#page_id").value(),
                                        o.value.scanedhotellist = n.join(","),
                                        o.value.collecthotellist = "",
                                        o.value.guest_num = e.GuestNum,
                                        o.value.roomnum = e.SubRoomCount || "0",
                                        o.value.bookable_cx = e.CanBookRoomNum || "0",
                                        o.value.abnorm_condition = "0" == (e.CanBookRoomNum || "0") ? "酒店不可订或已经订完" : o.value.abnorm_condition,
                                        o.value.bookable_zl = "0" == (e.CanBookRoomNum || "0") ? "0" : e.CanBookRoomNum,
                                        o.value.price_zl = t,
                                        o.value.amount = e.PriceZl || "0",
                                        o.value.credit = e.Credit || "N",
                                        o.value.starttime = $("#cc_txtCheckIn").value(),
                                        o.value.endtime = $("#cc_txtCheckOut").value(),
                                        o.value.price_cx = "0",
                                    $("#cc_txtCheckIn").value() === $("#priceCheckIn").value() && $("#cc_txtCheckOut").value() === $("#priceCheckOut").value() && (o.value.price_cx = isNaN(parseFloat($("#priceLowList").value())) ? "0" : $("#priceLowList").value()),
                                        $("#HotelInfoFrom").value() && o.value.price_cx > 0 ? o.value.price_from = $("#HotelInfoFrom").value() : o.value.price_from = document.referrer,
                                        o.value.listisfull = $("#isFullFromList").value(),
                                        window.__bfi.push(["_tracklog", o.key, $.stringifyJSON(o.value)])
                                };
                                if (e.PromoteInfo) {
                                    $("#J_Pro_Info").remove();
                                    var i = $("#J_price_box").html() + e.PromoteInfo;
                                    $("#J_price_box").html(i)
                                }
                                e.IntegralIcon && ($("#J_integralIcon").show(),
                                    $("#J_integralIcon").html(e.IntegralIcon)),
                                    window.spotHotelAndGroup.release();
                                var a = ("{'startDate':'" + s + "','depDate':'" + l + "','RequestTravelMoney':'" + f + "','hsids':'" + p + "','IsJustConfirm':'" + _ + "','priceInfo':'" + v + "','TmFromList':'" + g.value() + "'}",
                                    "")
                                    , d = ""
                                    , m = ""
                                    , h = !0
                                    , w = 1;
                                if (g.value(""),
                                    b.value(""),
                                    window.initedHotelLists = !0,
                                    e.LoginRequired) {
                                    __SSO_loginShow_1("changeBtn", !0, "0", !0);
                                    var y = 0
                                        , k = 10;
                                    return void (k = setInterval(function () {
                                        var e = $("#sso_divClose");
                                        y--,
                                        e.length && (e.remove(),
                                            y = 0),
                                        0 === y && clearInterval(k)
                                    }, 300))
                                }
                                e.notice ? (C.html("<b></b>" + e.notice),
                                    C.removeClass("hidden")) : C.addClass("hidden"),
                                    "F" === e.isShowJustConfirm ? $("#J_Confirm").addClass("hidden") : $("#J_Confirm").removeClass("hidden"),
                                    "F" === e.isShowPrepay ? $(".c_sort_pay .multiple_menu a[data-value=3] ").addClass("hidden") : $(".c_sort_pay .multiple_menu a[data-value=3] ").removeClass("hidden");
                                var I = e.HotelAdd;
                                if (I ? ($("#J_htTips").html(I),
                                    $("#J_htTips").removeClass("hidden")) : ($("#J_htTips").html(""),
                                    $("#J_htTips").addClass("hidden")),
                                e.ShowServiceScoreIcon && $("#J_ServiceScoreIcon").css("display", "inline-block"),
                                    rtMoneyBobble.init(),
                                    isShowResult = !0,
                                    e.collapsed || "" === e.html ? e.collapsed && "" !== e.collapsedHtml && "" !== e.html ? (a = e.collapsedHtml,
                                        m = e.html,
                                        h = !1) : isShowResult = !1 : (a = e.html,
                                        d = e.minprice),
                                    isShowResult) {
                                    r.className = "",
                                        $("#id_room_select_box").attr("class", "room_select_box"),
                                        $("#AdviceHotelHasPrice").css("display", "block"),
                                    102004 === parseInt($("#page_id").value()) && $("#page_id").attr("value", parseInt($("#init_page_id").value())),
                                        2 == tabtype ? r.innerHTML = a + '<div id="insertStateLabel" class="hidden" style="display:none;"></div>' : r.innerHTML = a,
                                    o && o();
                                    var J = function () {
                                        if (!t) {
                                            var e, o = 9, n = function () {
                                                if (2 == tabtype) {
                                                    var t = document.getElementById("insertStateLabel");
                                                    if (t) {
                                                        e && clearTimeout(e);
                                                        var n = parseInt($("#id_comment_arrow").offset().top);
                                                        n -= 48,
                                                        "fixed" != $("#J_room_list_tabs").css("position") && (n -= 48),
                                                            window.scrollTo(0, n)
                                                    } else
                                                        0 != o ? (o -= 1,
                                                            e = setTimeout("setTimeState()", 500)) : e && clearTimeout(e)
                                                }
                                            };
                                            n()
                                        }
                                        $("#adviseHotel").html("")
                                    };
                                    h || $(r).bind("click", function (e) {
                                        e = e || window.event;
                                        var t = e.target || e.srcElement;
                                        if ("expandRoom" === t.getAttribute("data-event-type")) {
                                            var o = parseInt(document.documentElement.scrollTop || document.body.scrollTop)
                                                , n = $(r).offset().top;
                                            n < o && $("#lnkBook").trigger("click"),
                                                1 === w ? (r.innerHTML = m,
                                                    w = 0) : (r.innerHTML = a,
                                                    w = 1),
                                            window.hourRoomObj || (window.hourRoomObj = new hourRoom({
                                                container: $(".J_selectorContainer").length > 0 ? "J_selectorContainer" : "J_HorizontalVersionFilter",
                                                select: "J_switchSelect",
                                                options: "J_switchOptions",
                                                list: "J_roomTable"
                                            })),
                                                repaint()
                                        }
                                        window.App && App.enablePriceCompareEntries && App.enablePriceCompareEntries()
                                    }),
                                        J(),
                                        $(".J_baseRoomPicBtn").bind("click", function () {
                                            var e = $(this)
                                                , t = e.parentNode().find(".pic_s");
                                            if (t && t.length > 0) {
                                                for (var o = t[0].innerHTML, n = 0; n < t.length - 1; n++)
                                                    t[n].innerHTML = t[n + 1].innerHTML;
                                                t[t.length - 1].innerHTML = o
                                            }
                                        }),
                                    window.hourRoomObj || (window.hourRoomObj = new hourRoom({
                                        container: $(".J_selectorContainer").length > 0 ? "J_selectorContainer" : "J_HorizontalVersionFilter",
                                        select: "J_switchSelect",
                                        options: "J_switchOptions",
                                        list: "J_roomTable"
                                    }))
                                } else
                                    document.getElementById("hotelRoomBox").className = "hidden",
                                        document.getElementById("id_room_select_box").className = "",
                                        $("#bookingoverTip").addClass("hidden"),
                                        $("#page_id").attr("value", 102004),
                                        $("#AdviceHotelHasPrice").css("display", "none"),
                                        $("#noPriceInfo").html(roomMessageConfig.noResult),
                                        LoadAjaxGetHotelRelationInfo();
                                repaint(),
                                    changRoomClass(),
                                window.App && App.enablePriceCompareEntries && App.enablePriceCompareEntries(),
                                    rtMoneyBobble.init(),
                                    tracklog.allHotelRoomTrack(),
                                    tracklog.baseroomTrack();
                                var S = document.getElementById("chkJustConfirm")
                                    , T = {
                                    checkIn: $("#cc_txtCheckIn").value(),
                                    checkOut: $("#cc_txtCheckOut").value()
                                }
                                    , N = !1;
                                if ((e.collapsed && "" !== e.collapsedHtml && "" !== e.html || "" === e.collapsedHtml && "" === e.html) && ($("#ComboInfo").css("display", "none"),
                                    N = !0),
                                    window.ComoInfo.getComInfo(T.checkIn, T.checkOut, !!S && S.checked, N),
                                "True" === IsAjaxGetGroupRoomList) {
                                    var P = addressUrlConfig.ajaxGroupRoomList;
                                    $.ajax(P, {
                                        onsuccess: function (e) {
                                            e && e.responseText && ($(".J_GroupRoom").html(e.responseText),
                                                $(".J_GroupRoom").removeClass("hidden"),
                                                $(".J_OtherBuBaseRoom").removeClass("hidden"))
                                        }
                                    })
                                }
                                window.getMeetingRoomsFunc();
                                var D = addressUrlConfig.AjaxSHXDPInfo;
                                if (e.HasRoom) {
                                    if (D) {
                                        var L = function () {
                                            return +new Date
                                        }
                                            , O = $("#cc_txtCheckIn").value()
                                            , E = $("#cc_txtCheckOut").value();
                                        D = [D, "&checkindate=", O, "&checkoutdate=", E, "&_=", L()].join(""),
                                            $.ajax(D, {
                                                onsuccess: function (e) {
                                                    if (e && e.responseText) {
                                                        var t = hotelDomesticConfig.query.cityId
                                                            , o = hotelDomesticConfig.hotel.id;
                                                        if ("{}" === e.responseText)
                                                            return;
                                                        var n = $.parseJSON(e.responseText)
                                                            , i = $.tmpl.render(c, n);
                                                        $(".J_ShxDpSpot").html(i),
                                                            $(".J_ShxDpSpot").removeClass("hidden"),
                                                            $(".J_OtherBuBaseRoom").removeClass("hidden"),
                                                            $("#J_room_list_tabs").css("display", ""),
                                                            $("#J_room_list_tabs .fn-shx-dp").css("display", "");
                                                        var a = null;
                                                        0 == $("iframe.IFR-SHDPX").length ? (a = document.createElement("iframe"),
                                                            a.frameBorder = 0,
                                                            a.className = "IFR-SHDPX",
                                                            a.scrolling = "no") : (a = $("iframe.IFR-SHDPX")[0],
                                                            DPState.iframeInserted = !0),
                                                        DPState.iframeInited || a.setAttribute("fakesrc", n.IframeSrc);
                                                        var s = document.getElementById("id_room_select_box");
                                                        s.parentNode.insertBefore(a, s),
                                                            a = $(a),
                                                            a.hide(),
                                                            window.checkInDateFromOtherTab = null,
                                                            window.checkOutDateFromOtherTab = null;
                                                        for (var r = function (e) {
                                                            a[0] && a[0].contentWindow.postMessage($.stringifyJSON(e), "*")
                                                        }, l = {
                                                            date: function (e) {
                                                                var t = e.checkInDate
                                                                    , o = e.checkOutDate;
                                                                window.checkInDateFromOtherTab = t,
                                                                    window.checkOutDateFromOtherTab = o
                                                            },
                                                            height: function (e) {
                                                                var t = e.value;
                                                                t && a.css("height", t + "px")
                                                            },
                                                            askWidth: function (e) {
                                                                r($.stringifyJSON({
                                                                    type: "screenWidth",
                                                                    value: $("body").offset().width
                                                                }))
                                                            }
                                                        }, d = function (e) {
                                                            var t = (e.origin,
                                                                e.data);
                                                            if (t) {
                                                                t = $.parseJSON(t);
                                                                var o = t.type;
                                                                o && l[o](t)
                                                            }
                                                        }, u = 0; u < DPState.events.length; u++)
                                                            window.removeEventListener && window.removeEventListener("message", DPState.events[u]),
                                                            window.detachEvent && window.detachEvent("message", DPState.events[u]);
                                                        window.addEventListener && window.addEventListener("message", d),
                                                        window.attachEvent && window.attachEvent("message", d),
                                                            DPState.events.push(d);
                                                        var m = $("#id_room_select_box")
                                                            , h = function () {
                                                            var e = $(".hotel_tabs.layoutfix").offset()
                                                                , t = e.left
                                                                , o = e.top;
                                                            window.scrollTo(t, o)
                                                        }
                                                            , p = {
                                                            None: 0,
                                                            Tab: 1,
                                                            Hotel: 2,
                                                            Scenic: 3,
                                                            AutoFocus: 4
                                                        }
                                                            , f = null
                                                            , _ = $("#J_room_list_tabs").find(".fn-hotel-list");
                                                        _.unbind("click", window.showRoomListTab).bind("click", window.showRoomListTab),
                                                            $(".J_ShxDpSpot").find(".btn_buy").bind("click", function () {
                                                                var e = $.stringifyJSON({
                                                                    cityid: t,
                                                                    hotelid: o,
                                                                    type: "ljyd"
                                                                });
                                                                window.__bfi.push(["_tracklog", "htl_detail_hotel_ju", e])
                                                            }),
                                                        window.showShxDP || (window.showShxDP = function () {
                                                                var e = "";
                                                                switch (f) {
                                                                    case p.Hotel:
                                                                        r({
                                                                            type: "clickMode",
                                                                            value: "Hotel"
                                                                        }),
                                                                            e = "#!tab=hotel";
                                                                        var n = $.stringifyJSON({
                                                                            cityid: t,
                                                                            hotelid: o,
                                                                            type: "ghfx"
                                                                        });
                                                                        break;
                                                                    case p.Scenic:
                                                                        r({
                                                                            type: "clickMode",
                                                                            value: "Scenic"
                                                                        }),
                                                                            e = "#!tab=scenic";
                                                                        var n = $.stringifyJSON({
                                                                            cityid: t,
                                                                            hotelid: o,
                                                                            type: "ghjd"
                                                                        })
                                                                }
                                                                window.__bfi.push(["_tracklog", "htl_detail_hotel_ju", n]);
                                                                $("#J_room_list_tabs li").removeClass("current"),
                                                                    $(this).addClass("current"),
                                                                    m.hide(),
                                                                    a.show(),
                                                                    $("#J_meeting_list").hide(),
                                                                DPState.iframeInited || (a.attr("src", a.attr("fakesrc") + e),
                                                                    DPState.iframeInserted = !0,
                                                                    DPState.iframeInited = !0),
                                                                e && h();
                                                                var i = window.checkInDateFromOtherTab || $("#cc_txtCheckIn").value()
                                                                    ,
                                                                    s = window.checkOutDateFromOtherTab || $("#cc_txtCheckOut").value();
                                                                r({
                                                                    type: "date",
                                                                    checkInDate: i,
                                                                    checkOutDate: s
                                                                }),
                                                                    window.checkInDateFromOtherTab = null,
                                                                    window.checkOutDateFromOtherTab = null,
                                                                    f = p.Tab
                                                            }
                                                        );
                                                        var v = $("#J_room_list_tabs").find(".fn-shx-dp").unbind("click", window.showShxDP).bind("click", window.showShxDP);
                                                        $(".J_ShxDpSpot").find(".room_type a").bind("click", function () {
                                                            var e = $(this).attr("data-fn-type");
                                                            switch (e) {
                                                                case "changeRoomType":
                                                                    f = p.Hotel;
                                                                    break;
                                                                case "changeTicketType":
                                                                    f = p.Scenic;
                                                                    break;
                                                                default:
                                                                    f = p.None
                                                            }
                                                            v.trigger("click")
                                                        }),
                                                        hotelDomesticConfig.SHXDPFocus && (f = p.AutoFocus,
                                                            v.trigger("click"))
                                                    }
                                                }
                                            }),
                                            HotelRoom.hideBaseRoomDetail()
                                    } else
                                        ;
                                    if ($("#J_RecommendTotal").length > 0) {
                                        var R = x.replace("AjaxHote1RoomListForDetai1.aspx", "AjaxHotelSingleRoomPriceForDetail.aspx")
                                            , H = $("#J_RecommendTotal").attr("data-roomid")
                                            , A = $("#J_RecommendTotal").attr("data-swid");
                                        u.getHotelDetails(R + "&roomid4rc=" + H + "&swid4rc=" + A, {
                                            onsuccess: function (e) {
                                                multidayscript = e.detail,
                                                    $("#J_RecommendTotalHoverDiv").addClass("base_price"),
                                                    $("#J_RecommendTotalHoverDiv").removeClass("base_txtdiv"),
                                                multidayscript.length > 0 && ($("#J_RecommendTotalHoverDiv").attr("data-role", "jmp"),
                                                    $("#J_RecommendTotalHoverDiv").attr("data-params", multidayscript),
                                                    $("#J_RecommendTotalHoverDiv").removeClass("base_price"),
                                                    $("#J_RecommendTotalHoverDiv").addClass("base_txtdiv")),
                                                    $("#J_RecommendTotalHoverDiv").html("<dfn>¥</dfn>" + e.price + "</span>")
                                            }
                                        })
                                    }
                                    var M = 1
                                        , B = 1
                                        , F = 0;
                                    try {
                                        var j = $("#J_RoomGuestCount_Detail").value();
                                        j = j.split(","),
                                            M = parseInt(j[0]),
                                            B = parseInt(j[1]),
                                            F = parseInt(j[2])
                                    } catch (V) {
                                    }
                                    if (1 == M && (B > 1 || F > 0)) {
                                        var R = x.replace("AjaxHote1RoomListForDetai1.aspx", "AjaxHotelRoomGetMinPriceForDetail.aspx");
                                        u.getHotelDetails(R, {
                                            onsuccess: function (e) {
                                                minprice = e.minprice,
                                                    n(e.PriceZl),
                                                    $("#div_minprice").html(minprice)
                                            },
                                            onerror: function () {
                                                d && $("#div_minprice").html(d),
                                                    n(e.PriceZl)
                                            }
                                        })
                                    } else
                                        d && $("#div_minprice").html(d),
                                            n(e.PriceZl)
                                }
                            },
                            onerror: function () {
                                document.getElementById("hotelRoomBox").className = "hidden",
                                    document.getElementById("id_room_select_box").className = "",
                                    $("#noPriceInfo").html(roomMessageConfig.noResult)
                            }
                        })
                }
                ,
                showRoomList = function (e) {
                    return !!HotelSearch.checkDate([a, s]) && (document.getElementById("startdate").value = a.value,
                        document.getElementById("depdate").value = s.value,
                        getRoomHTML(e, function () {
                            window.hourRoomObj && window.hourRoomObj._initSelect(),
                                $(".J_ExpandLeftRoom").bind("click", function () {
                                    expandRoom.call(this)
                                })
                        }),
                        void 0)
                }
            ;
            var m = function (e) {
                e = e || !1;
                var t = !0
                    , o = document.getElementById("hotsalesroomids").value;
                if (null == o || "" == o)
                    t = !1;
                else if (1 == e) {
                    var n = document.getElementById("startdate").value
                        , i = document.getElementById("depdate").value;
                    n == a.value && i == s.value || (t = !1)
                }
                return t
            };
            showRoomList(!1),
                $("#changeBtn").bind("click", function () {
                    0 == m(!0) && $("#hotsalesroomids").value(""),
                        $(".J_GroupRoom").addClass("hidden"),
                        $(".J_OtherBuBaseRoom").addClass("hidden"),
                        $(".J_MeetingRooms").addClass("hidden"),
                        $(".J_ShxDpSpot").addClass("hidden"),
                        $("input[name=Checkin]").value($("#cc_txtCheckIn").value()),
                        $("input[name=Checkout]").value($("#cc_txtCheckOut").value()),
                        $("#txtCheckIn").value($("#cc_txtCheckIn").value()),
                        $("#txtCheckOut").value($("#cc_txtCheckOut").value()),
                        showRoomList(!0),
                        getPromotionFilterList()
                }),
                function (e) {
                    var t = e("#hotelRoomBox a.show_all");
                    t.each(function (e) {
                        t.indexOf(e);
                        e.bind("click", function () {
                            var t = e.previousSibling();
                            t.css("height", "auto"),
                                e.css("display", "none")
                        })
                    })
                }(cQuery),
                function () {
                    var e = ""
                        , t = null
                        , o = document.getElementById("popRoomPic");
                    $("#hotelRoomBox, #commentList, #J_meeting_list").bind("mouseover", function (n) {
                        n = n || window.event;
                        var i = n.target || n.srcElement;
                        if (t && clearTimeout(t),
                        "IMG" == i.nodeName) {
                            var a = i.getAttribute("_src");
                            if (!a)
                                return;
                            e != a && (o.getElementsByTagName("img")[0].src = a,
                                e = a),
                                t = setTimeout(function () {
                                    o.style.display = "",
                                    e && (o.style.left = parseInt($(i).offset().left) + parseInt($(i).offset().width) + 3 + "px",
                                        o.style.top = parseInt($(i).offset().top) + "px")
                                }, 500)
                        }
                    }).bind("mouseout", function (t) {
                        t = t || window.event;
                        var n = t.target || t.srcElement;
                        "IMG" == n.nodeName && (e = "",
                            o.style.display = "none",
                            o.style.top = "-1000px",
                            o.getElementsByTagName("img")[0].src = "//pic.c-ctrip.com/common/pic_alpha.gif")
                    })
                }(),
                function (e, t) {
                    function o(t) {
                        var o = e("#hotel").value()
                            , n = e("#checkIn").value()
                            , s = e("#checkOut").value()
                            , r = e("#cityId").value()
                            ,
                            l = "/Domestic/Tool/AjaxGetCouponData.aspx?from=detail&hotel=" + o + "&city=" + r + "&checkin=" + n + "&checkout=" + s;
                        e.ajax(l, {
                            cache: !1,
                            onsuccess: function (o) {
                                var o = o.responseText;
                                if (o) {
                                    var n = e("#defaultcoupon").value()
                                        , s = n && n.split(",")
                                        , r = 0;
                                    if (e("#J_CouponList").remove(),
                                        e("#J_Coupon").append(htmlToDom(o)),
                                    s && s.length > 0) {
                                        e("#J_CouponList input").each(function (e) {
                                            for (var t = 0; t < s.length; t++)
                                                if (e.attr("data-id") == s[t]) {
                                                    e[0].checked = !0,
                                                        r++;
                                                    break
                                                }
                                        });
                                        var l = e("#J_Coupon label.lb")
                                            , d = l.text();
                                        r > 0 && (d = d + "(" + r + ")"),
                                            l.text(d)
                                    }
                                    t && i(),
                                        a()
                                }
                            },
                            onerror: function () {
                            }
                        })
                    }

                    function n(t) {
                        var o = e("#J_Coupon label.lb")
                            , n = "可用优惠券";
                        t > 0 && (n = n + "(" + t + ")"),
                            o.text(n)
                    }

                    function i() {
                        e("#J_ShowCoupon").bind("mouseover", function (t) {
                            t = t || window.event,
                                t.preventDefault ? t.stopPropagation() : t.cancelBubble = !0,
                                e("#J_ShowCoupon").addClass("coupon_open"),
                                e("#J_CouponList").removeClass("hidden");
                            var o = "htl_coupon"
                                ,
                                n = "{cityid:'" + e("#cityId").value() + "',hotelid:'" + e("#hotel").value() + "',ison:'" + (hotelDomesticConfig.hasLogin ? 1 : 0) + "'}";
                            window.__bfi.push(["_tracklog", o, n])
                        }),
                            e("#J_ShowCoupon").bind("mouseout", function (t) {
                                t = t || window.event,
                                    t.preventDefault ? t.stopPropagation() : t.cancelBubble = !0,
                                    e("#J_ShowCoupon").removeClass("coupon_open"),
                                    e("#J_CouponList").addClass("hidden")
                            })
                    }

                    function a() {
                        var t;
                        t = e("#J_CouponList"),
                            t.bind("click", function (t) {
                                t = t || window.event,
                                    t.preventDefault ? t.stopPropagation() : t.cancelBubble = !0;
                                var o = this
                                    , i = t.target;
                                if ("INPUT" == i.tagName || "SPAN" == i.tagName) {
                                    var a = ""
                                        , s = ""
                                        , r = 0;
                                    e("#J_CouponList input").each(function (t) {
                                        t[0].checked ? (t.addClass("c_sort_links_choosed"),
                                            a += "," + t.attr("data-id"),
                                            s += "," + t.attr("data-amount"),
                                            r++) : (t.removeClass("c_sort_links_choosed"),
                                        e(".J_selectorContainer").find(".c_sort_links_choosed").length <= 0 && e(o).parentNode().parentNode().find(".btn_clear").addClass("hidden"))
                                    }),
                                    a.length > 0 && (a = a.substr(1, a.length - 1),
                                        s = s.substr(1, s.length - 1),
                                        e(this).parentNode().parentNode().find(".btn_clear").removeClass("hidden")),
                                        e("#defaultcoupon").value(a),
                                        n(r);
                                    var l = "htl_coupon_num"
                                        , d = "{cityid:'" + e("#cityId").value() + "',hotelid:'',price:'" + s + "'}";
                                    window.__bfi.push(["_tracklog", l, d]),
                                        getRoomHTML(!0, function () {
                                            e(".J_ExpandLeftRoom").bind("click", function () {
                                                expandRoom.call(this)
                                            }),
                                            window.hourRoomObj && window.hourRoomObj._initSelect()
                                        })
                                }
                            }),
                            e("#J_LoginForCoupon").bind("click", function (e) {
                                hotelDomesticConfig.hasLogin || __SSO_booking_1(this.id, 0)
                            })
                    }

                    o(!0),
                        window.onCouponShow = o
                }(cQuery)
        }
        $("#transTab h2 a").length > 1 && $.mod.load("tab", "1.2", function () {
            var e = {
                options: {
                    tab: "h2 a",
                    panel: ".transSub",
                    trigger: "click"
                },
                style: {
                    tab: ["current", ""],
                    panel: {
                        display: ["block", "none"]
                    }
                }
            };
            $("#transTab").regMod("tab", "1.2", e)
        }),
        $("#comment_tab li").length > 1 && $.mod.load("tab", "1.2", function () {
            var e = {
                options: {
                    tab: "li",
                    panel: ".comment_tab_list",
                    trigger: "click"
                },
                style: {
                    tab: ["tab_current", "tab_nocurrent"],
                    panel: {
                        display: ["block", "none"]
                    }
                }
            };
            $("#comment_tab").regMod("tab", "1.2", e)
        }),
            $("#lvpinglink").bind("click", function () {
                this.getAttribute("hasAjax") || ($.ajax(addressUrlConfig.lvPingRecomand, {
                    cache: !0,
                    onsuccess: function (e) {
                        "" != e.responseText ? document.getElementById("hotel_comment_list").innerHTML = e.responseText : (document.getElementById("comment_alert").style.display = "",
                            document.getElementById("hotel_comment_list").style.display = "none")
                    }
                }),
                    this.setAttribute("hasAjax", "T"))
            }),
            o($("#hotelCommentList"))
    }

    function s() {
        o($("#hotelCommentList"))
    }

    function r() {
        function o(e, t) {
            HotelView.showLoading(t);
            var o = CtripHotelMap.map({
                el: t,
                cityCode: null,
                width: t.style.width || t.offsetWidth,
                height: t.style.height || t.offsetHeight,
                map: {
                    resizeEnable: !0,
                    level: 16,
                    doubleClickZoom: !1,
                    scrollWheel: !1,
                    dragEnable: !1
                },
                iframe: {
                    src: addressUrlConfig.mapIframe,
                    frameBorder: "none",
                    scrolling: "no",
                    cssText: "border:none",
                    width: t.style.width || t.offsetWidth + "px",
                    height: t.style.height || t.offsetHeight + "px"
                }
            });
            t.style.overflow = "hidden",
                o.makeMap(function () {
                    e = o.setLngLat(e),
                        o.setZoomAndCenter(14, e),
                        o.addPlugin("Scale", function (t) {
                            t.create().addToControl(),
                                o.addMarker({
                                    cpix: "-10|-30",
                                    icon: o.addIcon({
                                        size: "21|31",
                                        image: "//pic.c-ctrip.com/hotels110127/hotel_pointer." + (cQuery.browser.isIE6 ? "gif" : "png")
                                    }),
                                    position: e
                                })
                        }),
                        HotelView.hideLoading(t),
                        o.listenerMap("click", function () {
                            var e = $("#linkViewMap")[0];
                            e && e.click ? e.click() : (e.href = "javascript:void(0)",
                                $(e).trigger("click"))
                        })
                })
        }

        function n(e, t) {
            e && e.length && ($("#favlist").remove(),
                $(".sider_pic").append(htmlToDom($.tmpl.render($("#J_favHotel").html(), e))).removeClass("hidden"),
                tracklog.hotelRecommendTrack()),
            t && t()
        }

        function i(e, t) {
            e && e.length ? ($("#visitedHistory").remove(),
                $(".sider_pic").append(htmlToDom($.tmpl.render($("#J_visitedHotel").html(), e))).removeClass("hidden"),
            t && "function" == typeof t && t()) : $(".collect_list li").length || $(".sider_pic").addClass("hidden")
        }

        function a(e) {
            e && e.ProductList && e.ProductList.length ? (e.ProductList = e.ProductList.slice(0, 3),
                $("#groupProduct").html($.tmpl.render($("#J_groupProuct").html(), e)).removeClass("hidden")) : $("#groupProduct").addClass("hidden")
        }

        function s(e) {
            if (e && e.length) {
                for (var t = {
                    shopping: [],
                    airport: [],
                    train: [],
                    centre: [],
                    sight: []
                }, o = 0; o < e.length; o++) {
                    var n = e[o];
                    switch (n.PlaceType) {
                        case 1:
                            t.shopping.push(n);
                            break;
                        case 2:
                            t.airport.push(n);
                            break;
                        case 3:
                            t.train.push(n);
                            break;
                        case 4:
                            t.centre.push(n);
                            break;
                        case 5:
                            t.sight.push(n)
                    }
                }
                $(".traffic_side").html($.tmpl.render($("#J_traffic").html(), t)).removeClass("hidden"),
                d || $(".traffic_item .rounte").css("display", "none")
            } else
                $(".traffic_side").addClass("hidden");
            $("#faq-block").removeClass("hidden")
        }

        $(document).bind("mousedown", function (e) {
            e = e || window.event;
            var t = e.target || e.srcElement;
            "A" != t.nodeName && (t = t.parentNode);
            var o;
            if (void 0 !== e.which ? o = 3 == e.which : void 0 !== e.button && (o = 2 == e.button),
            o && ($(t).hasClass("J_hotel_order") || "A" == t.parentNode.nodeName.toUpperCase() && $(t.parentNode).hasClass("J_hotel_order")) && window.setToOrderPageTraceLog($(t).hasClass("J_hotel_order") ? t : t.parentNode),
            t && 1 == t.nodeType && "A" == t.nodeName.toUpperCase())
                if ("sider_hotel_pic" === t.className || "hotel_name" === t.className || "huixuan_name" === t.className || "more" === t.className || "H2" == t.parentNode.nodeName.toUpperCase() && "searchresult_name" == t.parentNode.className || "needTraceCode" == t.getAttribute("name")) {
                    var n = ""
                        , i = ""
                        , a = []
                        , s = null
                        , r = [];
                    if (t.getAttribute("data-href") && t.getAttribute("data-ctm"))
                        n = t.getAttribute("data-href"),
                            i = t.getAttribute("data-ctm");
                    else {
                        if (n = t.href,
                        n.indexOf("?") != -1) {
                            var l = n.split("?");
                            if (s = l[0],
                            l[1].indexOf("&") != -1)
                                for (var d = l[1].split("&"), c = 0; c < d.length; c++)
                                    if (d[c].indexOf("#") != -1)
                                        for (var u = pras[c].split("#"), m = 0; m < u.length; m++)
                                            0 === m ? a.push(u[m]) : r.push(u[m]);
                                    else
                                        a.push(d[c]);
                            else if (l[1].indexOf("#") != -1) {
                                for (var h = l[1].split("#"), p = 0; p < h.length; p++)
                                    0 === p ? a.push(h[0]) : r.push(h[p]);
                                a.push(h[0]),
                                    r = h[1]
                            } else
                                a.push(l[1])
                        } else if (n.indexOf("#") != -1)
                            for (var f = n.split("#"), _ = 0; _ < f.length; _++)
                                0 === _ ? s = f[_] : r.push(f[_]);
                        else
                            s = n;
                        n = a.length > 0 ? s + "?" + a.join("&") : s,
                        r.length > 0 && (i = "#" + r.join("#")),
                            t.setAttribute("data-href", n),
                            t.setAttribute("data-ctm", i)
                    }
                    if (2 === e.button) {
                        var v = $("#cc_txtCheckIn").value()
                            , g = $("#cc_txtCheckOut").value()
                            , b = [];
                        return !/checkIn=/.test(n) && v && b.push("checkIn=" + v),
                        !/checkOut=/.test(n) && g && b.push("checkOut=" + g),
                        b.length > 0 && (n = n.indexOf("?") == -1 ? n + "?" + b.join("&") : n + "&" + b.join("&")),
                            void (t.href = n + i)
                    }
                    t.href = n + i
                } else {
                    var i = t.dataset ? t.dataset.ctm : t.getAttribute("data-ctm");
                    i && !/#ctm_ref=/.test(t.href) && (t.href += i)
                }
        }).bind("click", function (e) {
            e = e || window.event;
            var t = e.target || e.srcElement;
            if (1 === t.nodeType && ("A" != t.nodeName && (t = t.parentNode),
            "A" != t.nodeName && ($(t).hasClass("s_row") || $(t).hasClass("commnet_num")) && (t = t.parentNode),
            "A" == t.nodeName)) {
                var o = t.dataset ? t.dataset.dopost : t.getAttribute("data-dopost");
                if (o) {
                    var n = t.parentNode;
                    n && $(n).hasClass("hot_info") && setLocationHiddens(t.getAttribute("href"));
                    var i = document.forms[0];
                    i.action = t.href,
                        t.target ? i.target = t.target : i.target = "_self",
                    i.__VIEWSTATE && (i.__VIEWSTATE.name = "NOVIEWSTATE"),
                        i.submit(),
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0,
                        e.preventDefault ? e.preventDefault() : e.returnValue = !1
                }
            }
        });
        var r = document.getElementById("map")
            , d = e.hotel.position
            , c = $("#viewMap");
        if (r)
            if (d)
                if (addressUrlConfig.imgMapUrl) {
                    var u = document.createElement("img");
                    u.style.height = map.style.height || map.offsetHeight + "px",
                        u.style.width = map.style.width || map.offsetWidth + "px",
                        u.src = addressUrlConfig.imgMapUrl,
                        u.onerror = function () {
                            r.removeChild(u),
                                o(d, r)
                        }
                        ,
                        r.appendChild(u),
                    hotelDomesticConfig.popMapFlag && $(u).bind("click", handlePopMap)
                } else
                    o(d, r);
            else
                r.style.display = "none",
                    c.css("display", "none"),
                    $("#linkViewMap").css("display", "none");
        !function () {
            var e = ""
                , t = null
                , o = document.getElementById("popTopPic")
                , n = function (e) {
                var t = document.documentElement.scrollLeft || document.body.scrollLeft
                    , o = document.documentElement.scrollTop || document.body.scrollTop;
                return {
                    left: t - document.documentElement.clientLeft,
                    top: o - document.documentElement.clientTop,
                    x: e.clientX,
                    y: e.clientY,
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                }
            };
            $("#topPicList").bind("mouseover", function (n) {
                n = n || window.event;
                var i = n.target || n.srcElement;
                if ("topPicList" != i.id && "DIV" == i.nodeName) {
                    t && clearTimeout(t);
                    var a = i.getAttribute("_src");
                    if (!a)
                        return;
                    e != a && (o.getElementsByTagName("img")[0].src = a,
                        e = a),
                        t = setTimeout(function () {
                            o.style.display = ""
                        }, 500)
                }
            }).bind("mouseout", function (t) {
                t = t || window.event;
                var n = t.target || t.srcElement;
                "DIV" == n.nodeName && (e = "",
                    o.style.display = "none",
                    o.style.top = "-1000px",
                    o.getElementsByTagName("img")[0].src = "//pic.c-ctrip.com/common/pic_alpha.gif")
            }).bind("mousemove", function (t) {
                if (t = t || window.event,
                    e) {
                    var i = n(t)
                        , a = o.getElementsByTagName("img")[0];
                    i.width > 1024 && i.height > 600 ? (o.style.left = (i.width - 560 < i.x ? i.x - 570 : i.x + 10) + i.left + "px",
                        o.style.top = Math.min(i.height - 420, i.y + 10) + i.top + "px",
                        o.style.width = "558px",
                        o.style.height = "420px",
                        a.style.width = "550px",
                        a.style.height = "412px") : (o.style.left = (i.width - 410 < i.x ? i.x - 420 : i.x + 10) + i.left + "px",
                        o.style.top = Math.min(i.height - 310, i.y + 10) + i.top + "px",
                        o.style.width = "408px",
                        o.style.height = "308px",
                        a.style.width = "400px",
                        a.style.height = "300px")
                }
            })
        }(),
            function () {
                var e = ""
                    , t = document.getElementById("popRoomPic");
                if (t) {
                    var o = function (e) {
                        var t = document.documentElement.scrollLeft || document.body.scrollLeft
                            , o = document.documentElement.scrollTop || document.body.scrollTop;
                        return {
                            left: t - document.documentElement.clientLeft,
                            top: o - document.documentElement.clientTop,
                            x: e.clientX,
                            y: e.clientY,
                            width: document.documentElement.clientWidth,
                            height: document.documentElement.clientHeight
                        }
                    };
                    $("#huixuanHotelPic").bind("mouseover", function (o) {
                        o = o || window.event;
                        var n = o.target || o.srcElement;
                        if ("IMG" == n.nodeName) {
                            var i = n.getAttribute("_src");
                            if (!i)
                                return;
                            e != i && (t.getElementsByTagName("img")[0].src = i,
                                e = i),
                                t.style.display = ""
                        }
                    }).bind("mouseout", function (o) {
                        o = o || window.event;
                        var n = o.target || o.srcElement;
                        "IMG" == n.nodeName && (e = "",
                            t.style.display = "none",
                            t.style.top = "-1000px",
                            t.getElementsByTagName("img")[0].src = "//pic.c-ctrip.com/common/pic_alpha.gif")
                    }).bind("mousemove", function (n) {
                        if (n = n || window.event,
                            e) {
                            var i = o(n);
                            t.style.left = (i.width - 300 < i.x ? i.x - 310 : i.x + 10) + i.left + "px",
                                t.style.top = Math.min(i.height - 225, i.y + 10) + i.top + "px"
                        }
                    })
                }
            }();
        var m = $.BizMod.SearchPanel;
        m.initAdditionalInfo().init({
            getListUrl: addressUrlConfig.ajaxGetHotelAddtionalInfo + "&favCount=7",
            removeUrl: "/Domestic/Tool/AjaxDeleteVistedB.aspx",
            hasLogin: hotelDomesticConfig.hasLogin,
            onRemove: function (e) {
                var t = $("#visitedHistory");
                e.parentNode().remove(),
                0 == t.find(".J_historyHotelsList")[0].children.length && t.remove()
            },
            oncomplete: function (e) {
                s(e.PlaceInfoEntityList),
                    a(e.AdditionalProduct),
                    n(e.HotelFavList, function () {
                        var t = $("#id_fav_btn")
                            , o = $("#hotel").value();
                        if (e && void 0 != e.IsFavList && t[0]) {
                            var n = $.parseJSON(e.IsFavList);
                            n && n.length && n[0][o] && t.html(n[0][o])
                        }
                    }),
                    i(e.VisitedHotelInfo, function () {
                        var e = $("#visitedHistory")
                            , t = "item_hover";
                        e.find("li").bind("mouseover", function () {
                            $(this).addClass(t)
                        }),
                            e.find("li").bind("mouseout", function () {
                                $(this).removeClass(t)
                            })
                    })
            },
            deleteBtnCls: "delete"
        }).getList();
        var h = document.getElementById("rightFixed")
            , p = document.getElementById("gotop");
        cQuery.browser.isIE6 && h ? (h.style.position = "absolute",
            $(window).bind("scroll", function () {
                if (h.style.top = document.documentElement.scrollTop + document.documentElement.clientHeight / 2 + "px",
                    p) {
                    var e = (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
                    e > document.documentElement.clientHeight / 2 ? p.style.display = "block" : p.style.display = "none"
                }
            })) : p && $(window).bind("scroll", function () {
            var e = (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop;
            e > document.documentElement.clientHeight / 2 ? p.style.display = "block" : p.style.display = "none"
        });
        var f = document.getElementById("divViewCount");
        cQuery.browser.isIE6 && f && (f.style.position = "absolute",
            $(window).bind("scroll", t)),
            $.ajax(addressUrlConfig.visitCount, {
                onsuccess: function (e) {
                    var o = e.responseText;
                    if (!o)
                        return void (cQuery.browser.isIE6 && $(window).unbind("scroll", t));
                    if ("0" != o) {
                        document.getElementById("spanVisitCount").innerHTML = o;
                        var n = document.getElementById("divViewCount");
                        l(n, 40, 1e4),
                            $("#closeViewCount").bind("click", function () {
                                n.style.display = "none",
                                    clearInterval(timer),
                                cQuery.browser.isIE6 && $(window).unbind("scroll", t)
                            })
                    }
                }
            }),
        $("#banner").length && $("#banner").regMod("allyes", "1.0", {
            mod_allyes_user: "ctrip|CTRIP_HOTEL_HOMEPAGE|HOTEL_BANNER@ctrip|CTRIP_HOTEL_INNERPAGE|HOTEL_INNER_BANNER"
        }),
            $.mod.load("tab", "1.2", function () {
                var e = {
                    options: {
                        tab: "a",
                        panel: ".areaTabContent",
                        trigger: "click"
                    },
                    style: {
                        tab: ["current", ""],
                        panel: {
                            display: ["block", "none"]
                        }
                    }
                };
                $("#areaTab").length && $("#areaTab").regMod("tab", "1.2", e)
            })
    }

    function l(e, o, n) {
        e.style.display = "";
        var i = 0
            , a = setInterval(function () {
            i += 4,
                e.style.height = i + "px",
                $(e).bind("mouseover", function () {
                    e.style.height = o + "px",
                        clearInterval(a)
                }),
            i >= o && (clearInterval(a),
                a = setTimeout(function () {
                    a = setInterval(function () {
                        i -= 4,
                            e.style.height = i + "px",
                        i <= 0 && (clearInterval(a),
                            e.style.display = "none",
                        cQuery.browser.isIE6 && $(window).unbind("scroll", t))
                    }, 80)
                }, n))
        }, 80)
    }

    function d(e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)")
            , o = window.location.search.substr(1).match(t);
        return null != o ? unescape(o[2]) : null
    }

    function c() {
        function e(e) {
            for (var t = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], o = "CAS", n = 0; n < e; n++) {
                var i = Math.ceil(51 * Math.random());
                o += t[i]
            }
            return o
        }

        function t(e, t, o) {
            var n = "";
            if ("function" != typeof NODEJS)
                return "";
            if ("undefined" == typeof e)
                return "";
            if (!e)
                return "";
            try {
                n = NODEJS(e, t)
            } catch (i) {
                n = ""
            }
            return n
        }

        function o(o, n) {
            var i = e(16)
                , a = function () {
                }
                , s = $.BizMod.Util.isFunction(n.onsuccess) ? n.onsuccess : a
                , r = $.BizMod.Util.isFunction(n.onerror) ? n.onerror : a
                , l = hotelDomesticConfig.cas.MainSwitch && hotelDomesticConfig.cas.MainSwitch.jsTemplate
                ,
                d = hotelDomesticConfig && hotelDomesticConfig.cas && hotelDomesticConfig.cas.testSwitch && "undefined" != typeof hotelDomesticConfig.cas.testSwitch.CAT;
            for (o += "&callback=" + i + "&_=" + (new Date).getTime(),
                 d && (o += "&cat=" + hotelDomesticConfig.cas.testSwitch.CAT); i in window;)
                i = e(16);
            window[i] = function (e) {
                window[i] = void 0;
                var n = ["T", "F", "e", "s", "M", "a", "g", "r", "o", "B", "u", "l", "y", "m", "f", "t"];
                e = $.parseJSON(e),
                    null == e ? r() : (hotelDomesticConfig.cas.Pretty && e["0|2|3|15|4|2|3|3|5|6|2|1|7|8|13|9|10|15|15|2|7|14|11|12".split("|").map(function (e) {
                        return n[e]
                    }).join("")].slice(-9999).indexOf("  ") !== -1 ? e.html = "" : !l && hotelDomesticConfig.cas.decrypt && (e.html = t(e.ComplexHtml, e.ASYS, e.html)),
                        s(e)),
                    $('script[src="' + o + '"]').remove()
            }
                ,
                l ? $.loader.js(o, {
                    onload: function () {
                    },
                    onerror: function (e) {
                        e && (window[i] = void 0,
                            r())
                    }
                }) : $.ajax(o, {
                    onsuccess: function (e) {
                        window[i](e.responseText)
                    },
                    onerror: function () {
                        window[i] = void 0,
                            r()
                    }
                })
        }

        function n(t, o) {
            var n = e(14)
                , i = function () {
                }
                , a = $.BizMod.Util.isFunction(o.onsuccess) ? o.onsuccess : i
                , s = $.BizMod.Util.isFunction(o.onerror) ? o.onerror : i
                ,
                r = hotelDomesticConfig && hotelDomesticConfig.cas && hotelDomesticConfig.cas.testSwitch && "undefined" != typeof hotelDomesticConfig.cas.testSwitch.CAT;
            for (t += "&callback=" + n + "&_=" + (new Date).getTime(),
                 r && (t += "&cat=" + hotelDomesticConfig.cas.testSwitch.CAT); n in window;)
                n = e(14);
            window[n] = function (e) {
                window[n] = void 0,
                    e ? a(e) : s(),
                    $('script[src="' + t + '"]').remove()
            }
                ,
                $.ajax(t, {
                    onsuccess: function (e) {
                        window[n](e.responseText)
                    },
                    onerror: function () {
                        window[n] = void 0,
                            s()
                    }
                })
        }

        function i(t) {
            var o, n = e(15), i = !1;
            if (!hotelDomesticConfig.cas.OceanBall)
                return t.resolve("");
            for (; n in window;)
                n = e(15);
            o = hotelDomesticConfig.cas.OceanBallUrl + "?callback=" + n + "&_=" + (new Date).getTime(),
                window[n] = function (e) {
                    var o = "";
                    i = !0;
                    try {
                        o = e()
                    } catch (n) {
                        $.ajax("/domestic/cas/image/bi", {
                            method: $.AJAX_METHOD_POST,
                            cache: !1,
                            context: {
                                value: "11-" + encodeURIComponent(n.stack || n)
                            }
                        })
                    } finally {
                        t.resolve(o)
                    }
                }
                ,
                $.loader.js(o, {
                    onload: function () {
                        setTimeout(function () {
                            i || t.reject("")
                        }, 5e3)
                    },
                    onerror: function (e) {
                        e && (window[n] = void 0),
                            t.reject("")
                    }
                })
        }

        function a(e, t) {
            $.BizMod.Promise(i).any(function (n) {
                n && (e += "&eleven=" + encodeURIComponent(n)),
                    o(e, t)
            })
        }

        function s(e, t) {
            $.BizMod.Promise(i).any(function (o) {
                o && (e += "&eleven=" + encodeURIComponent(o)),
                    n(e, t)
            })
        }

        return {
            decrypt: t,
            getHotelDetails: a,
            getCommentList: s
        }
    }

    var u = c();
    return {
        initPage: n,
        initRoom: a,
        initComment: s,
        initPic: i,
        initComplete: r
    }
}(hotelDomesticConfig);
$("#J_bannerLogin").bind("click", function (e) {
    hotelDomesticConfig.hasLogin || __SSO_booking_1(this.id, 0)
});
var initNewPic360 = function (e) {
    var t = $(e.picId)
        , o = $(e.numId)
        , n = pictureConfig ? pictureConfig.picture360 : null
        , i = "";
    if (t[0] && n && n.data[0]) {
        HotelView.showLoading(t[0]);
        var a = $.Pic360List({
            data: n
        }, e.txtId);
        n.total && n.total > 7 && (i = "<span>1</span>/" + n.total + "张",
            o.html(i).css("display", "block"));
        var s = $.Pic360({}, e.picId);
        s.showImg(n.data[0].imgUrl, function (e, o) {
            HotelView.hideLoading(t[0])
        }),
            $(a.listObj.list).find("li").bind("click", function () {
                var e = $(this).attr("data-url");
                if (o.find("span")[0]) {
                    var n = $(this).attr("data-index");
                    o.find("span").html(n)
                }
                $(a.listObj.list).find("li").removeClass("current"),
                    $(this).addClass("current"),
                s.imgObj.img.src !== e && (s.controllObj && (s.controllObj.box.style.display = "none"),
                    s.imgObj.imgBox.style.display = "none",
                    HotelView.showLoading(t[0]),
                    s.showImg(e, function (e, o) {
                        HotelView.hideLoading(t[0])
                    }))
            })
    }
};
!function (e) {
    var t = e("#div360");
    if (t[0]) {
        var o = e.browser.isIE6;
        setTimeout(function () {
            t[0].style.display = "none",
            o && e(window).unbind("scroll", n)
        }, 1e4);
        var n = function () {
            var e = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight - 76;
            t.css("top", e)
        };
        o && e(window).bind("scroll", n)
    }
}(cQuery),
    $(".hotel_name").bind("click", function (e) {
        e = e || window.event;
        var t = e.target || e.srcElement;
        if ("A" != t.nodeName && (t = t.parentNode),
        t && 1 == t.nodeType && "A" == t.nodeName) {
            var o = t.parentNode
                , n = t.dataset ? t.dataset.dopost : t.getAttribute("data-dopost");
            if (n) {
                var i;
                o && (i = o.parentNode) && ("J_locationItems" == i.getAttribute("id") || "hot_htl_city" == i.className) && setLocationHiddens(t.getAttribute("href"));
                var a = document.forms[0];
                a.action = t.href,
                    t.target ? a.target = t.target : a.target = "_self",
                a.__VIEWSTATE && (a.__VIEWSTATE.name = "NOVIEWSTATE"),
                    a.submit(),
                    e.preventDefault ? e.stopPropagation() : e.cancelBubble = !0,
                    e.preventDefault ? e.preventDefault() : e.returnValue = !1
            }
        }
    }),
    function (e, t) {
        var o = {
            init: function (t) {
                this.options = t || {},
                    this.modal = t.modal,
                    this.divList = e("#topPicList"),
                    this._bindEvents()
            },
            _getImgIndex: function (t) {
                var o = 0;
                return e("#divPicModal .pic_right a img").each(function (e, n) {
                    e.attr("pid") === t && (o = n)
                }),
                    o
            },
            _getImgsList: function (t) {
                var o = this
                    , n = o.options.imgsListWrap;
                e.ajax(o.options.ajaxImgsUrl, {
                    onsuccess: function (e, i) {
                        o._inited = !0,
                            n.html(i),
                        t && t()
                    }
                })
            },
            showPopup: function (e, t) {
                var o = this;
                this._inited ? this.modal.show(e, t) : o._getImgsList(function () {
                    o.modal.init(e, t)
                })
            },
            _bindEvents: function () {
                var t = this
                    , o = this.divList;
                o.bind("click", function (e) {
                    e.stop();
                    var n, i = e.target, a = "T" == isIntGtaHotel;
                    if (("A" == i.nodeName.toUpperCase() || "" == i.innerHTML.trim()) && ("I" == i.nodeName.toUpperCase() && (i = i.parentNode),
                        n = i.getAttribute("data-category") || "pic",
                        a)) {
                        var s = i.getAttribute("pid") || o.find("div[pid]")[0].getAttribute("pid");
                        t.showPopup(n, s)
                    }
                }),
                    this.divList.find("div:first").bind("mouseover", function (t) {
                        e("#view_allpic").addClass("all_pic_hover")
                    }).bind("mouseout", function (t) {
                        e("#view_allpic").removeClass("all_pic_hover")
                    })
            }
        };
        !function () {
            o.init({
                modal: e.BizMod.mainPanelModal,
                ajaxImgsUrl: addressUrlConfig.ajaxGetPictureAlbum,
                imgsListWrap: e("#photoabulm")
            });
            var t = e("#viewMap");
            t.parentNode().bind("mouseover", function (e) {
                t.addClass("view_hover")
            }).bind("mouseout", function (e) {
                t.removeClass("view_hover")
            })
        }()
    }(cQuery, window),
    function (e, t, o) {
        t.Voted = function (t) {
            var o = e.cookie.get("CommentVoted", "commVoted");
            return null != o && o.indexOf(t) >= 0
        }
            ,
            t.addCookie = function (t, o, n) {
                var i = e.cookie.get(t, o);
                i = null == i ? n : i + ", " + n,
                    e.cookie.set(t, o, i)
            }
            ,
            function () {
                var o, n = e("#commentList, #divCtripComment"), i = e("#hotel").value(), a = function (e, t) {
                    if (e) {
                        for (var o = e.split(","), n = [], i = 0; i < o.length; i++)
                            o[i].trim() == t && n.push(o[i].trim());
                        return n
                    }
                }, s = function (t) {
                    var o = e.cookie.get("CommentCurHotelVoted", "commCurHotelVoted")
                        , n = a(o, t);
                    return !!(n && n.length >= 5)
                }, r = function () {
                    var t = e("#pic_big");
                    t.css({
                        display: "none"
                    }),
                        t.find("p.pic_txt").html("")
                };
                t.hideCommentBigImg = r;
                var l = function () {
                    var t = e("#score_pop");
                    t.css({
                        display: "none"
                    }),
                        t.find(".score_item").html("")
                }
                    , d = function (t) {
                    for (var o = e("#score_pop"), n = e(t).offset(), i = e(t).attr("data-value") ? e(t).attr("data-value").split(",") : [], a = o.find("span.score_item"), s = 0; s < i.length; s++)
                        a[s] && e(a[s]).html(i[s]);
                    o.css({
                        top: n.top - 25 + "px",
                        left: n.left + "px",
                        position: "absolute",
                        "z-index": 2,
                        "background-color": "#FFF",
                        display: "block"
                    })
                }
                    , c = function (t) {
                    var o = e(t).offset()
                        , n = e("#pic_big");
                    n.find("img.p").attr("src", e(t).attr("data-bigimgsrc")),
                        n.find("p.pic_txt").html(e(t).attr("data-bigimgtitle")),
                        n.css({
                            top: o.top + "px",
                            left: o.left + o.width + 2 + "px",
                            position: "absolute",
                            "z-index": 2,
                            "background-color": "#FFF",
                            display: "block"
                        })
                };
                if (e.browser.isIPad) {
                    var u = function () {
                        e("a.voted").each(function (e) {
                            e.html('有用<span class="n">(' + e.attr("data-voted") + ")</span>"),
                                e.removeClass("voted")
                        })
                    }
                        , m = function (t) {
                        var o = t.target;
                        if ("SPAN" === o.nodeName.toUpperCase() && (r(),
                        e(o).hasClass("b") && (o = o.parentNode),
                        e(o).hasClass("n") && (o = o.parentNode),
                        e(o).hasClass("small_c") && (t.stop(),
                            u(),
                            l(),
                            r(),
                            d(o))),
                        "A" === o.nodeName.toUpperCase() && e(o).hasClass("useful")) {
                            t.stop();
                            var a = o.dataset ? o.dataset.cid : o.getAttribute("data-cid");
                            Voted(a) ? (u(),
                                l(),
                                r(),
                                o.innerHTML = "您已投票",
                                e(o).addClass("voted")) : (n.unbind("touchstart", m),
                                e.ajax("/Domestic/Tool/AjaxVoteComment.aspx?commentId=" + a, {
                                    cache: !1,
                                    onsuccess: function (t) {
                                        n.bind("touchstart", m),
                                            addCookie("CommentVoted", "commVoted", a),
                                            addCookie("CommentCurHotelVoted", "commCurHotelVoted", i);
                                        for (var o = e(".useful"), s = 0; s < o.length; s++) {
                                            var r = e(".useful")[s]
                                                , l = r.dataset ? r.dataset.cid : r.getAttribute("data-cid");
                                            if (parseInt(l) == a) {
                                                var d = r.dataset ? r.dataset.voted : r.getAttribute("data-voted");
                                                d = parseInt(d, 10) + 1,
                                                    r.setAttribute("data-voted", d),
                                                    e(r).addClass("useful_voted"),
                                                    r.innerHTML = '有用<span class="n">(' + d + ")</span>"
                                            }
                                        }
                                    },
                                    onerror: function () {
                                        n.bind("touchstart", m)
                                    }
                                }))
                        }
                        "IMG" === o.nodeName.toUpperCase() && e(o).hasClass("listimg") && (t.stop(),
                            u(),
                            l(),
                            r(),
                            c(o))
                    };
                    n.bind("touchstart", m),
                        e(document).bind("touchstart", function (e) {
                            u(),
                                l(),
                                r()
                        })
                } else
                    n.bind("mouseover", function (t) {
                        var o = t.target;
                        if ("A" === o.nodeName.toUpperCase() && e(o).hasClass("useful")) {
                            var n = o.dataset ? o.dataset.cid : o.getAttribute("data-cid");
                            Voted(n) ? (o.innerHTML = "您已投票",
                                e(o).addClass("voted")) : s(i) ? (o.innerHTML = "投票数已满",
                                e(o).addClass("voted")) : (o.innerHTML = "+1",
                                e(o).addClass("useful_hover"))
                        }
                        "SPAN" === o.nodeName.toUpperCase() && (e(o).hasClass("b") && (o = o.parentNode),
                        e(o).hasClass("small_c") && d(o)),
                        "IMG" === o.nodeName.toUpperCase() && e(o).hasClass("listimg") && c(o)
                    }).bind("mouseout", function (t) {
                        var o = t.target;
                        if ("A" === o.nodeName.toUpperCase() && e(o).hasClass("useful")) {
                            var n = o.dataset ? o.dataset.voted : o.getAttribute("data-voted");
                            e(o).hasClass("voted") && e(o).removeClass("voted"),
                            e(o).hasClass("useful_hover") && e(o).removeClass("useful_hover"),
                                o.innerHTML = '有用<span class="n">(' + n + ")</span>"
                        }
                        "SPAN" === o.nodeName.toUpperCase() && (e(o).hasClass("b") && (o = o.parentNode),
                        e(o).hasClass("small_c") && l()),
                        "IMG" === o.nodeName.toUpperCase() && e(o).hasClass("listimg") && r()
                    }).bind("click", function (t) {
                        var n = t.target;
                        if ("SPAN" === n.nodeName.toUpperCase() && e(n).hasClass("n") && (n = n.parentNode),
                        "A" === n.nodeName.toUpperCase() && e(n).hasClass("useful")) {
                            t.stop(),
                                tracklog.hotelCommentTrack(n);
                            var a = n.dataset ? n.dataset.cid : n.getAttribute("data-cid");
                            Voted(a) || s(i) || (o && clearTimeout(o),
                                o = setTimeout(function () {
                                    e.ajax("/Domestic/Tool/AjaxVoteComment.aspx?commentId=" + a, {
                                        cache: !1,
                                        onsuccess: function (t) {
                                            addCookie("CommentVoted", "commVoted", a),
                                                addCookie("CommentCurHotelVoted", "commCurHotelVoted", i);
                                            for (var o = e(".useful"), n = 0; n < o.length; n++) {
                                                var s = e(".useful")[n]
                                                    , r = s.dataset ? s.dataset.cid : s.getAttribute("data-cid");
                                                if (parseInt(r) == a) {
                                                    var l = s.dataset ? s.dataset.voted : s.getAttribute("data-voted");
                                                    l = parseInt(l, 10) + 1,
                                                        s.setAttribute("data-voted", l),
                                                        e(s).addClass("useful_voted"),
                                                        s.innerHTML = '有用<span class="n">(' + l + ")</span>"
                                                }
                                            }
                                        },
                                        onerror: function () {
                                        }
                                    })
                                }, 500))
                        }
                    })
            }()
    }(cQuery, window),
    function (e, t, o) {
        function n(t) {
            this.conmentLeft = e(t.conmentLeft),
                this.conmentRight = e(t.conmentRight),
                this.conments = e(t.conments),
                this.conmentPanel = e(t.conmentPanel),
                this.conmentsLen = this.conments.length,
                this.init()
        }

        n.prototype = {
            conctructor: n,
            init: function () {
                var t = this;
                this.conmentLeft.bind("click", function (o) {
                    o.stop();
                    var n = parseInt(t.conmentPanel.attr("data-index")) || 0;
                    n >= 1 && (e(t.conments[n - 1]).css({
                        display: "block"
                    }),
                        e(t.conments[n]).css({
                            display: "none"
                        }),
                        t.conmentPanel.attr("data-index", n - 1),
                        t.triggerChange(n - 1))
                }),
                    this.conmentRight.bind("click", function (o) {
                        o.stop();
                        var n = parseInt(t.conmentPanel.attr("data-index")) || 0
                            , i = t.conments.length;
                        n < i - 1 && (e(t.conments[n + 1]).css({
                            display: "block"
                        }),
                            e(t.conments[n]).css({
                                display: "none"
                            }),
                            t.conmentPanel.attr("data-index", n + 1),
                            t.triggerChange(n + 1))
                    })
            },
            triggerChange: function (e) {
                this.conmentsLen > 1 ? 0 === e ? (this.conmentLeft.addClass("pre_disabled"),
                    this.conmentRight.addClass("next"),
                    this.conmentLeft.removeClass("pre"),
                    this.conmentRight.removeClass("next_disabled")) : e === this.conmentsLen - 1 ? (this.conmentLeft.addClass("pre"),
                    this.conmentRight.addClass("next_disabled"),
                    this.conmentLeft.removeClass("pre_disabled"),
                    this.conmentRight.removeClass("next")) : (this.conmentLeft.addClass("pre"),
                    this.conmentRight.addClass("next"),
                    this.conmentLeft.removeClass("pre_disabled"),
                    this.conmentRight.removeClass("next_disabled")) : (this.conmentLeft.addClass("pre_disabled"),
                    this.conmentRight.addClass("next_disabled"),
                    this.conmentLeft.removeClass("pre"),
                    this.conmentRight.removeClass("next"))
            }
        },
            new n({
                conmentLeft: "#comment_impre_left",
                conmentRight: "#comment_impre_right",
                conments: ".comment_text .text",
                conmentPanel: ".comment_text"
            })
    }(cQuery, window),
    function (e, t, o) {
        function n(t, o, n) {
            var a = this;
            if (l || (l = CtripHotelMap.dialog({
                obj: document.getElementById("mapDialog"),
                onChange: function (e, t) {
                    if (t)
                        switch (t.type) {
                            case "AMap":
                                r(e, t);
                                break;
                            case "SOSO":
                                i(e, t)
                        }
                    else
                        r(e),
                            i(e)
                }
            }),
                e("#J_delMap").bind("click", function () {
                    d && d.reset(),
                    c && c.deleteSOSO(),
                        c = null,
                        l.hide()
                })),
                o) {
                var s = HotelMapStreetJson[e(this).attr("data-hotelId")];
                s && s.soso && s.soso.pano ? f.removeClass("hidden") : f.addClass("hidden")
            }
            h && (e("#J_mapSide").css("display", "none"),
                e(".map_marker_box").css("display", "none")),
                l.show({
                    type: t,
                    inited: o,
                    env: a,
                    callback: n
                })
        }

        function i(t, o) {
            if (o && s(),
            o && o.inited) {
                var n = o.env;
                currentInfo = {
                    hotelId: e(n).attr("data-hotelId")
                }
            }
            var i = HotelMapStreetJson[currentInfo.hotelId];
            if (i) {
                var a = cQuery.extend(t, i);
                if (a.hotelId = currentInfo.hotelId,
                    m)
                    c ? c.resize(t) : c = CtripHotelMap.sosoMap(a);
                else {
                    var r = {
                        type: "text/javascript",
                        async: !0,
                        charset: "utf-8",
                        onload: function () {
                            m = !0,
                                c = CtripHotelMap.sosoMap(a)
                        }
                    };
                    cQuery.loader.js(SOSOMAP_URL, r)
                }
            }
        }

        function a() {
            f.removeClass("hidden"),
                f.removeClass("current"),
                v.addClass("current"),
                v.removeClass("hidden"),
                g.removeClass("hidden"),
                b.addClass("hidden")
        }

        function s() {
            v.removeClass("hidden"),
                v.removeClass("current"),
                f.removeClass("hidden"),
                f.addClass("current"),
                g.addClass("hidden"),
                b.removeClass("hidden")
        }

        function r(o, n, i) {
            if (n && n.inited) {
                var s = n.env;
                currentInfo = {
                    hotelId: e(s).attr("data-hotelId") || hotelDomesticConfig.hotel.id
                }
            }
            var r = HotelMapStreetJson[currentInfo.hotelId];
            if (n && r.soso.pano && a(),
                r)
                if (r.amap.id = currentInfo.hotelId,
                    u)
                    n ? (!h && CtripHotelMap.popSide.reshow(r.amap),
                        d.addCenterMarker(r.amap.pos, r.amap),
                    n.callback && n.callback()) : (d.resizeMap(o.w, o.h),
                        CtripHotelMap.popSide.resize(o.h));
                else {
                    !h && (o.w -= 281);
                    var l = {
                        type: "text/javascript",
                        async: !0,
                        charset: "utf-8",
                        onload: function () {
                            u = !0,
                                d = CtripHotelMap.popAMap({
                                    width: o.w,
                                    height: o.h,
                                    infoWinTpl: e("#J_dotMarkerTpl").html(),
                                    mapData: r.amap,
                                    mapSide: document.getElementById("J_mapSide"),
                                    loading: e("#J_amapLoading"),
                                    centerMarkerTpl: e("#J_centerMarkerTpl").html(),
                                    circleDragEvents: {
                                        dragstart: function () {
                                        },
                                        dragend: function (e) {
                                            d.moniter.update(e)
                                        },
                                        dragging: function (e) {
                                            d.moniter.update(e)
                                        }
                                    },
                                    onMapReady: function () {
                                        !h && CtripHotelMap.popSide.init(this),
                                        n.callback && n.callback()
                                    },
                                    onPOIMouseOver: function (t) {
                                        var o = t.target
                                            , n = o._cUid
                                            , i = this.poi;
                                        i.highlight(o),
                                        !i.isActive(t.target) && e(o.getContent()).find(".landmarks_click").removeClass(p),
                                            e(".around_item[data-uid=" + n + "]").addClass("item_hover")
                                    },
                                    onPOIDeactive: function (t) {
                                        var o = t.target
                                            , n = o._cUid;
                                        e(".around_item[data-uid=" + n + "]").removeClass("item_hover")
                                    },
                                    onPOIMouseOut: function (t) {
                                        var o = t.target
                                            , n = o._cUid;
                                        this.poi.isActive(o) || (this.poi.highlight(o, !0),
                                            e(o.getContent()).find(".landmarks_click").addClass(p),
                                            e(".around_item[data-uid=" + n + "]").removeClass("item_hover"))
                                    },
                                    onPOIClick: function (e) {
                                    }
                                }),
                                t._tmpObj = d
                        }
                    };
                    cQuery.loader.js(POPMAP_URL, l)
                }
        }

        var l = null
            , d = null
            , c = null
            , u = !1
            , m = !1
            , h = "1" === hotelDomesticConfig.istaiwan
            , p = "hidden"
            , f = e("#J_showSOSO")
            , _ = e("#viewMap, #linkViewMap")
            , v = e("#J_showAMap")
            , g = e("#J_mapBox")
            , b = e("#J_streetBox")
            , C = e(".J_showPopStreet")
            , w = e("#linkViewSoso")
            , y = e(".traffic_side");
        currentInfo = {},
            _.bind("click", function (e) {
                e.stop(),
                    n.call(this, "AMap", !0)
            }),
            C.bind("click", function () {
                n.call(this, "SOSO", !0),
                    s()
            }),
            f.bind("click", function () {
                n.call(this, "SOSO", !1),
                    s()
            }),
            v.bind("click", function () {
                n.call(this, "AMap", !1)
            }),
            w.bind("click", function (e) {
                n.call(this, "SOSO", !0),
                    s()
            }),
            y.bind("click", function (t) {
                var o = e(t.target);
                o.hasClass("rounte") && n.call(this, "AMap", !0, function () {
                    var e = o.attr("data-name")
                        , t = o.attr("data-lnglat");
                    CtripHotelMap.popSide.endRoute("driving", e, t)
                })
            })
    }(cQuery, this),
    function (e, t, o) {
        function n(o) {
            this.hotelSliderCont = e(o.hotelSliderCont),
                this.hotelSlider = e(o.hotelSlider),
                this.hsPrev = e(o.hsPrev),
                this.hsNext = e(o.hsNext),
                this.imgsData = t.GHIpictureConfig && t.GHIpictureConfig.album || [],
                this.imgs = this.hotelSlider[0] && this.hotelSlider.find("img"),
                this.countWidth = 0,
                this.imgsCount = 0,
                this.pageNum = 1,
                this.pageSum = 1,
                this.sumWidth = 0,
                this.btnLeftState = !0,
                this.btnRightState = !0,
                this.timer = 500,
                this.init()
        }

        n.prototype = {
            constructor: n,
            init: function () {
                this.hotelSliderCont[0] && (this.countWidth = parseInt(this.hotelSliderCont.css("width")),
                    this.imgsCount = this.imgsData.length,
                    this.pageSum = Math.ceil(this.imgsCount / 3),
                    this.sumWidth = 250 * this.imgsCount,
                    this.imgsCount > 3 ? (this._initImgSrc(),
                        this._setBtnDisabled(),
                        this.hsPrev.bind("click", this._leftScroll.bind(this)),
                        this.hsNext.bind("click", this._rightScroll.bind(this))) : (this.hsPrev.css({
                        display: "none"
                    }),
                        this.hsNext.css({
                            display: "none"
                        })))
            },
            _leftScroll: function () {
                var t = this;
                if (t.btnLeftState) {
                    t.btnLeftState = !1;
                    var o = parseInt(t.hotelSlider.css("left")) || 0
                        , n = 250 * (this.imgsCount - 3)
                        , i = t.sumWidth - Math.abs(o) > 1500 ? o - 750 : "-" + n;
                    e.mod.load("animate", "1.0", function () {
                        t.hotelSlider.animate({
                            left: i + "px"
                        }, t.timer),
                            setTimeout(function () {
                                t.btnLeftState = !0
                            }, t.timer)
                    }),
                        t.pageNum++,
                        t._setBtnDisabled()
                }
            },
            _rightScroll: function () {
                var t = this;
                if (t.btnRightState) {
                    t.btnRightState = !1;
                    var o = parseInt(t.hotelSlider.css("left")) || 0
                        , n = (250 * (this.imgsCount - 3),
                        Math.abs(o) > 750 ? o + 750 : 0);
                    e.mod.load("animate", "1.0", function () {
                        t.hotelSlider.animate({
                            left: n + "px"
                        }, t.timer),
                            setTimeout(function () {
                                t.btnRightState = !0
                            }, t.timer)
                    }),
                        t.pageNum--,
                        t._setBtnDisabled()
                }
            },
            _initImgSrc: function () {
                var e = this;
                this.imgs.each(function (t, o) {
                    o > 2 && (t[0].src = e.imgsData[o].source)
                })
            },
            _setBtnDisabled: function () {
                1 === this.pageNum ? (this.hsPrev.css({
                    display: "block"
                }),
                    this.hsNext.css({
                        display: "none"
                    })) : this.pageNum === this.pageSum ? (this.hsPrev.css({
                    display: "none"
                }),
                    this.hsNext.css({
                        display: "block"
                    })) : (this.hsPrev.css({
                    display: "block"
                }),
                    this.hsNext.css({
                        display: "block"
                    }))
            }
        },
            new n({
                hotelSliderCont: "#hotel_slider_cont",
                hotelSlider: "#hotel_slider",
                hsPrev: "#hs_next",
                hsNext: "#hs_prev"
            })
    }(cQuery, window);
var hotelLoginProject = function () {
    return {
        isMyFaqClick: !1,
        judgeAjaxReadyTem: function () {
        }
    }
}();
!function (e, t, o) {
    function n(o) {
        if (t.faqConfig) {
            this.askPanel = e(o.askPanel),
                this.msgPanel = e(o.msgPanel),
                this.qaPanel = e(o.qaPanel),
                this.faqConfig = e.extend({}, t.faqConfig),
                this.addFaqUrl = faqConfig.addFaqUrl,
                this.replyFaqUrl = faqConfig.replyFaqUrl,
                this.getDataUrl = faqConfig.loadFaqUrl,
                this.addReplyUsefulUrl = faqConfig.AddReplyUsefulUrl,
                this.addReplyUsefulEnable = faqConfig.isCallAjax,
                this.maxContLen = o.maxContLen || 500,
                this.qaData = {
                    totalCount: 0,
                    totalPageCount: 1,
                    qMap: {}
                },
                this.HIDDENCLS = "hidden";
            var n = this.faqConfig.hotelId;
            this.config = {
                max_display_comment: 6,
                ask_first_cls: "ask-first",
                ask_has_cls: "ask-has",
                askFirst: '<a href="javascript:;" id="faq' + n + '" class="btn J_ask">我要提问</a><p class="tips">还没有人提问哦，你开个头吧！</p>',
                askHas: '<p class="tips"><a href="javascript:;" id="faq' + n + '" class="btn J_ask">我要提问</a>答案由热心网友提供，仅供参考</p>',
                publishIng: "发表中",
                publish: "发表问题"
            },
                this.init()
        }
    }

    var i = (t.ISSSOQUICKLOGIN,
    t.hotelDomesticConfig && t.hotelDomesticConfig.hasLogin);
    n.prototype = {
        constructor: n,
        isMyFaqClick: !1,
        init: function () {
            this._bindEvent(),
                this._getFaqData(),
                hotelLoginProject.judgeAjaxReadyTem = this._judgeAjaxReadyTem
        },
        _statusReset: function () {
            e("#J_quesLoading").addClass("hidden"),
                e("#J_quesLoadingFail").addClass("hidden"),
                e("#faq-list").html("")
        },
        _tabStyleShift: function (t) {
            e(".J_faqMy, .J_faqNormal").addClass("hidden"),
                t.removeClass("hidden")
        },
        _judgeAjaxReadyTem: function (t) {
            var o = this;
            "myAnswer" == e("#J_faqTabs a.faq-link:not(.hidden)").attr("data-tag") ? (t && o._tabStyleShift(e(".J_faqMy")),
                o._getFaqData(!0)) : (t && o._tabStyleShift(e(".J_faqNormal")),
                o._getFaqData(!1))
        },
        _bindEvent: function () {
            var t = this;
            e(".J_ask_info").bind("click", this._setState.bind(this)),
                this.askPanel.bind("click", this._clickAskPopPanel.bind(this)),
                this.msgPanel.bind("click", this._clickMsgPopPanel.bind(this)),
                this.qaPanel.bind("click", this._clickQaPopPanel.bind(this)),
                e(".J_replay_success").bind("click", this._clickReplaySuccessPopPanel.bind(this)),
                this.askPanel.find("textarea.form-textarea").bind("keyup", this._contLenVali.bind(this)).bind("keydown", this._setDownContLen.bind(this)).bind("blur", this._contLenVali.bind(this)).bind("paste", this._contLenVali.bind(this)).bind("cut", this._contLenVali.bind(this)),
                this.qaPanel.find("textarea.qa-textarea").bind("keyup", this._conQaTextLenVali.bind(this)).bind("keydown", this._setDownQaTextContLen.bind(this)).bind("blur", this._conQaTextLenVali.bind(this)).bind("paste", this._conQaTextLenVali.bind(this)).bind("cut", this._conQaTextLenVali.bind(this)),
                e(".J_qa_default li").bind("click", function (t) {
                    var o = e(t.target);
                    e(this).hasClass("current") ? o.hasClass("qa-default-q") && e(this).removeClass("current").find(".qa-default-q i").removeClass("icon-up").addClass("icon-down") : (e(".J_qa_default li").removeClass("current").find(".qa-default-q i").removeClass("icon-up"),
                        e(this).addClass("current").find(".qa-default-q i").addClass("icon-up").removeClass("icon-down"))
                }).bind("mouseover", function (t) {
                    e(this).hasClass("current") || e(this).find(".qa-default-q i").addClass("icon-down")
                }).bind("mouseout", function (t) {
                    e(this).find(".qa-default-q i").removeClass("icon-down")
                }),
                e(".J_faq_container").bind("click", function (o) {
                    var n = e(o.target);
                    if (n.hasClass("answer-btn")) {
                        o.stop();
                        var i = n.attr("data-id");
                        i && t._setQaPanelStatus(o, i)
                    } else if (n.hasClass("J_faq_add_askZan") || n.parentNode().hasClass("J_faq_add_askZan")) {
                        var a = n.parentNode().find("i.J_like")
                            , s = a.attr("ask-id")
                            , r = a.attr("answer-id");
                        if (!a.parentNode().hasClass("useful")) {
                            var l = a.parentNode().find("span.J_usefulCount")
                                , d = parseInt(l.text()) || 0;
                            d++,
                                l.text(d + ""),
                                a.parentNode().removeClass("useless").addClass("useful").attr("title", "已赞"),
                                t._add_askZan(s, r)
                        }
                    }
                }),
                e(".J_go_default_qa").bind("click", function (o) {
                    var n = t.HIDDENCLS;
                    e(".J_qa_part").addClass(n),
                        e(".J_default_part").removeClass(n)
                }),
                e(".J_go_all_qa").bind("click", function (o) {
                    var n = t.HIDDENCLS;
                    e(".J_default_part").addClass(n),
                        e(".J_qa_part").removeClass(n)
                }),
                e(".J_page_control a.first").bind("click", function (e) {
                    t._qaSearch(1)
                }),
                e(".J_page_control a.prev").bind("click", function (o) {
                    var n = +e(".J_qa_page_num").attr("data-val") || 1
                        , i = n - 1;
                    i > 0 && t._qaSearch(i)
                }),
                e(".J_page_control a.next").bind("click", function (o) {
                    var n = +e(".J_qa_page_num").attr("data-val") || 1
                        , i = +e(".J_total_page_num").attr("max-num")
                        , a = n + 1;
                    a <= i && t._qaSearch(a)
                }),
                e(".J_page_control a.last").bind("click", function (o) {
                    var n = +e(".J_total_page_num").attr("max-num");
                    t._qaSearch(n)
                }),
                e(".J_page_control a.submit").bind("mousedown", function (o) {
                    if (o.stop(),
                        !e(this).hasClass("disabled")) {
                        var n = +e(".J_qa_page_num").attr("data-val") || 1
                            , i = +e(".J_qa_page_num").value()
                            , a = +e(".J_total_page_num").attr("max-num");
                        i !== n && i > 0 && i <= a && t._qaSearch(i)
                    }
                });
            var o = e(".J_page_control a.submit");
            e(".J_page_control input.num").bind("focus", function (e) {
                o.removeClass(t.HIDDENCLS),
                    t._setSubmitButtonStatus(e)
            }).bind("blur", function (n) {
                var i = e(this).attr("data-val");
                e(this).value(i),
                    o.addClass(t.HIDDENCLS)
            }).bind("keyup", this._setSubmitButtonStatus.bind(this)).bind("paste", this._setSubmitButtonStatus.bind(this)).bind("cut", this._setSubmitButtonStatus.bind(this))
        },
        _getFaqData: function (t, o) {
            if (!o) {
                var n = this;
                n._statusReset();
                var i = function (t, o) {
                    n._statusReset();
                    var i = e.parseJSON(o.replace(/\n/g, "")) || {}
                        , a = i.PublishTotalCount || 0;
                    n._renderQAList(i),
                        n._setQAStatus(1, a)
                }
                    , a = function (e, t) {
                    n._statusReset(),
                        n._setQAStatus(1, 0)
                }
                    , s = {
                    hotelid: this.faqConfig.hotelId
                };
                t && (s.showprivate = "T"),
                    this._sendAjax(this.getDataUrl, "POST", s, i, a)
            }
        },
        _sendAjax: function (t, o, n, i, a) {
            e.ajax(t, {
                method: o,
                context: n,
                onsuccess: function (e, t) {
                    i(e, t)
                }
                    .bind(this),
                onerror: function (e, t) {
                    a(e, t)
                }
                    .bind(this)
            })
        },
        _renderQAList: function (t) {
            for (var o = t.AskList || [], n = {
                tagUrl: t.HotelTagUrl || "",
                multipage: t.PublishTotalCount > 6,
                qaList: []
            }, i = 0, a = o.length; i < a; i++) {
                for (var s = o[i] || {}, r = [], l = s.ReplyList || [], d = 0, c = l.length; d < c; d++) {
                    var u = l[d];
                    r.push({
                        rid: u.ReplyId || "",
                        a: u.ReplyContent || "",
                        aTitle: u.ReplyContentTitle || "",
                        rt: u.ReplyTime || "",
                        rn: u.NickName || "",
                        rl: u.ReplierText || "",
                        uc: u.UsefulCount || "",
                        zaned: u.Zaned,
                        zd: u.ZanDisable
                    })
                }
                n.qaList.push({
                    id: s.AskId,
                    isMyAsk: s.IsMyAsk,
                    isAnswerable: t.IsAnswerable,
                    q: s.AskContent || "",
                    qTitle: s.AskContentTitle || "",
                    qt: s.CreateTime || "",
                    qn: s.NickName || "",
                    ql: s.AskerText || "",
                    rList: r,
                    rc: s.ReplyCount || 0,
                    ru: s.Url
                }),
                    this.qaData.totalCount = t.PublishTotalCount,
                    this.qaData.totalPageCount = t.TotalPage,
                    this.qaData.qMap[s.AskId] = s.AskContentTitle || ""
            }
            e(".J_faq_container").html(e.tmpl.render(e("#J_htlQaListTmpl").html(), n))
        },
        _setQAStatus: function (t, o) {
            var n = this.config
                , i = this.HIDDENCLS
                , a = o > n.max_display_comment ? "removeClass" : "addClass";
            e(".J_page_control")[a](i),
                this._setPageListControlStatus(t);
            var s = o > 0
                , r = n.askFirst
                , l = n.ask_first_cls;
            s ? (r = n.askHas,
                l = n.ask_has_cls,
                e(".J_go_default_qa").removeClass(i)) : (e(".J_go_all_qa").remove(),
                e(".J_qa_default").removeClass(i),
                e(".J_go_default_qa").addClass(i)),
                e(".J_ask_info").addClass(l).html(r)
        },
        _setPageListControlStatus: function (t) {
            var o = this.qaData.totalPageCount;
            e(".J_qa_page_num").attr("data-val", t).value(t),
                e(".J_total_page_num").attr("max-num", o).text(o + "")
        },
        _setState: function (o) {
            hotelLoginProject.isMyFaqClick = !1,
                o.stop();
            var n = o.target;
            t.faqConfig.quickLogin ? __SSO_loginShow_1(e(n).attr("id"), !0, "0", !0) : i ? this._showAskPanel() : __SSO_booking_1(e(n).attr("id"), 0)
        },
        _setQaPanelStatus: function (t, o) {
            t.stop(),
                i ? this._showQaPanel(o) : __SSO_booking_1(e(t.target).attr("id"), 0)
        },
        _initForm: function () {
            var t = this.askPanel;
            t.find(".fr").removeClass("exceed-red"),
                t.find(".charnumber").html("0"),
                t.find("textarea.form-textarea").value(""),
                placeholderPlugin.initLazyLoad(e("#J_AskTitle"), placeholderPlugin.askTitle, "inputSel"),
                placeholderPlugin.initLazyLoad(e("#J_userEmail"), placeholderPlugin.userEmail, "inputSel"),
                t.find("textarea.form-textarea")[0].removeAttribute("disabled"),
                t.find("a.btn-primary").addClass("disabled"),
                t.find(".icon-loading").addClass(this.HIDDENCLS),
                t.find("a.btn-primary span").html(this.config.publish),
                postAjax("/Domestic/tool/AjaxGetUserEmail.aspx", "", function (t) {
                    t && (e("#J_userEmail").value(t),
                        e("#J_userEmail").addClass("text-disabled").attr("readonly", "true"))
                })
        },
        _initQaPanelForm: function (t) {
            var o = this.qaData.qMap[t]
                , n = this.qaPanel.find("textarea.qa-textarea");
            e(".J_question").text(o),
                placeholderPlugin.initLazyLoad(n, placeholderPlugin.answerTitle, "inputSel"),
                this.qaPanel.find("a.btn-large").attr("data-id", t)
        },
        _clickAskPopPanel: function (t) {
            t.stop();
            var o = this
                , n = t.target;
            "SPAN" === n.tagName.toUpperCase() && (n = n.parentNode);
            var i = e(n);
            if ("A" === i[0].tagName.toUpperCase() && i.hasClass("c_close") && this._hideAskPanel(),
            "A" === i[0].tagName.toUpperCase() && i.hasClass("btn-primary")) {
                if (placeholderPlugin.getInputVal(e("#J_AskTitle"), placeholderPlugin.askTitle),
                    placeholderPlugin.getInputVal(e("#J_userEmail"), placeholderPlugin.userEmail),
                    i.hasClass("disabled"))
                    return;
                var a = this.askPanel.find("textarea.form-textarea")
                    , s = this.askPanel.find("input.form-text")
                    , r = {
                    email: s[0] && s.value() || "",
                    content: a[0] && a.value() || ""
                };
                for (var l in this.faqConfig)
                    "addFaqUrl" != l && "loadFaqUrl" != l && "email" != l && (r[l] = this.faqConfig[l]);
                var d = function (t, n) {
                    i.removeClass("disabled"),
                        a[0].removeAttribute("disabled"),
                        i.find(".icon-loading").addClass(o.HIDDENCLS),
                        i.find("span").html(o.config.publish);
                    var s = e.extend({
                        ErrorCode: "",
                        Message: ""
                    }, e.parseJSON(n))
                        , r = o.msgPanel.find("div.pop-bd");
                    r.html(s.Message),
                        o._hideAskPanel(),
                        o._showMsgPanel()
                }
                    , c = function (e, t) {
                    i.removeClass("disabled"),
                        a[0].removeAttribute("disabled"),
                        i.find(".icon-loading").addClass(o.HIDDENCLS),
                        i.find("span").html(o.config.publish)
                };
                this._sendAjax(this.addFaqUrl, "POST", r, d, c),
                    i.addClass("disabled"),
                    a.attr("disabled", "disabled"),
                    i.find(".icon-loading").removeClass(o.HIDDENCLS),
                    i.find("span").html(this.config.publishIng)
            }
        },
        _clickMsgPopPanel: function (t) {
            t.stop();
            var o = e(t.target);
            return "A" === o[0].tagName.toUpperCase() && (o.hasClass("c_close") || o.hasClass("btn-primary")) ? void this._hideMsgPanel() : "A" === o[0].tagName.toUpperCase() && o.hasClass("faq-resubmit") ? (this._hideMsgPanel(),
                void this._showAskPanel()) : void 0
        },
        _clickQaPopPanel: function (t) {
            var o = e(t.target)
                , n = this;
            if (o.hasClass("c_close") && n._hideQaPanel(),
            "A" === o[0].tagName.toUpperCase() && o.hasClass("btn-large")) {
                if (o.hasClass("disabled"))
                    return;
                placeholderPlugin.getInputVal(e("#J_AskTitle"), placeholderPlugin.askTitle);
                var i = this.qaPanel.find("textarea.qa-textarea")
                    , a = o.attr("data-id")
                    , s = {
                    askId: a,
                    content: i.value()
                }
                    , r = function (e, t) {
                    n._hideQaPanel(),
                        n._showReplaySuccess(),
                        setTimeout(function () {
                            n._hideReplayLoading(),
                                n._hideQaPanel(),
                                n._hideReplaySuccess()
                        }, 1e4)
                }
                    , l = function (e, t) {
                    n._hideReplayLoading(),
                        n.qaPanel.find("p.tips").removeClass(n.HIDDENCLS)
                };
                n._showReplayLoading(),
                    this._sendAjax(this.replyFaqUrl, "POST", s, r, l)
            }
        },
        _clickReplaySuccessPopPanel: function (t) {
            var o = this
                , n = e(t.target);
            n.hasClass("c_close btn-large") && (o._hideReplayLoading(),
                o._hideQaPanel(),
                o._hideReplaySuccess())
        },
        _add_askZan: function (t, o) {
            if (this.addReplyUsefulEnable) {
                var n = function (t, o) {
                    e.parseJSON(o.replace(/\n/g, "")) || {}
                }
                    , i = function (e, t) {
                }
                    , a = {
                    askId: t,
                    askReplyId: o
                };
                this._sendAjax(this.addReplyUsefulUrl, "POST", a, n, i)
            }
        },
        _contLenVali: function (t) {
            var o = e(t.target)
                , n = this.askPanel.find(".charnumber")
                , i = this.askPanel.find("span.fr")
                , a = this.askPanel.find("a.btn-primary")
                , s = +n.attr("data-maxLen") || this.maxContLen
                , r = o.value()
                , l = r.trim().length;
            l <= 0 ? (a.addClass("disabled"),
                n.html("0")) : (e("#J_AskTitle").value() != placeholderPlugin.askTitle && a.removeClass("disabled"),
                l > s ? (i.addClass("exceed-red"),
                    n.html(s),
                    o.value(r.substring(0, s)),
                    t.stop()) : l == s ? (n.html(l),
                    i.addClass("exceed-red"),
                    t.stop()) : (i.removeClass("exceed-red"),
                e("#J_AskTitle").value() != placeholderPlugin.askTitle && n.html(l))),
            "paste" === t.type && setTimeout(function () {
                o.trigger("blur")
            }, 0)
        },
        _conQaTextLenVali: function (t) {
            var o = e(t.target)
                , n = this.qaPanel.find(".txt-num")
                , i = this.qaPanel.find("a.btn-large")
                , a = +n.attr("data-maxLen") || this.maxContLen
                , s = "最多可输入" + a + "个字"
                , r = o.value()
                , l = r.trim().length;
            if (r && r != placeholderPlugin.answerTitle) {
                i.removeClass("disabled");
                var d = l;
                l > a && (d = a,
                    o.value(r.substring(0, a))),
                    s += ",您已输入" + d + "字"
            } else
                i.addClass("disabled");
            n.text(s),
            "paste" === t.type && setTimeout(function () {
                o.trigger("blur")
            }, 0)
        },
        _setDownContLen: function (t) {
            if ([8, 16, 17, 20, 37, 38, 39, 40, 46, 65].indexOf(t.keyCode) == -1) {
                var o = e(t.target)
                    , n = this.askPanel.find(".charnumber")
                    , i = +n.attr("data-maxLen") || 50
                    , a = o.value().length;
                return a >= i ? void t.stop() : void 0
            }
        },
        _setDownQaTextContLen: function (t) {
            if ([8, 16, 17, 20, 37, 38, 39, 40, 46, 65].indexOf(t.keyCode) == -1) {
                var o = e(t.target)
                    , n = this.qaPanel.find(".txt-num")
                    , i = +n.attr("data-maxLen") || this.maxContLen
                    , a = o.value().length;
                return a >= i ? void t.stop() : void 0
            }
        },
        _qaSearch: function (t, o) {
            var n = this
                , i = {
                hotelid: this.faqConfig.hotelId,
                currentPage: t || 1
            }
                , a = function (i, a) {
                var s = e.parseJSON(a.replace(/\n/g, "")) || {}
                    , r = s.PublishTotalCount || 0;
                n._renderQAList(s),
                    n._setQAStatus(t, r),
                    n._setPageListControlStatus(t);
                var l = parseInt(e(".J_faq_block").offset().top);
                switch (!0) {
                    case e.browser.isIE9:
                        l += 20;
                        break;
                    case e.browser.isIE8:
                        l -= 3;
                        break;
                    case e.browser.isIE6:
                        l -= 22;
                        break;
                    case e.browser.isFirefox:
                        l += 12
                }
                window.scroll(0, l),
                o && o()
            }
                , s = function (e, t) {
                o && o()
            };
            this._sendAjax(this.getDataUrl, "POST", i, a, s)
        },
        _setSubmitButtonStatus: function (t) {
            var o = e(t.target)
                , n = e(".J_page_control a.submit")
                , i = +o.value()
                , a = +e(".J_total_page_num").attr("max-num");
            i >= 1 && i <= a ? n.removeClass("disabled") : n.addClass("disabled")
        },
        _showMsgPanel: function () {
            this.msgPanel.removeClass(this.HIDDENCLS).mask()
        },
        _hideAskPanel: function () {
            this.askPanel.unmask(),
                this.askPanel.addClass(this.HIDDENCLS)
        },
        _showAskPanel: function () {
            var e = this;
            CRealName.realNameView(function (t, o) {
                e._initForm(),
                    e.askPanel.removeClass(e.HIDDENCLS).mask()
            }, function (e) {
            }, !0)
        },
        _showQaPanel: function (e) {
            var t = this;
            CRealName.realNameView(function (o, n) {
                t._initQaPanelForm(e),
                    t.qaPanel.removeClass(t.HIDDENCLS).mask()
            }, function (e) {
            }, !0)
        },
        _hideQaPanel: function () {
            var e = this.qaPanel
                , t = e.find("textarea.qa-textarea");
            t.value("");
            var o = e.find(".txt-num")
                , n = +o.attr("data-maxLen") || this.maxContLen
                , i = "最多可输入" + n + "个字";
            o.text(i),
                e.find("p.tips").addClass(this.HIDDENCLS),
                e.unmask(),
                e.addClass(this.HIDDENCLS)
        },
        _hideMsgPanel: function () {
            this.msgPanel.unmask(),
                this.msgPanel.addClass(this.HIDDENCLS)
        },
        _showReplayLoading: function () {
            e(".J_reply_loading").removeClass(this.HIDDENCLS).mask()
        },
        _hideReplayLoading: function () {
            e(".J_reply_loading").addClass(this.HIDDENCLS).unmask()
        },
        _showReplaySuccess: function () {
            e(".J_replay_success").removeClass(this.HIDDENCLS).mask()
        },
        _hideReplaySuccess: function () {
            e(".J_replay_success").addClass(this.HIDDENCLS).unmask()
        }
    };
    var a = new n({
        askPanel: "#pop-box-ask",
        msgPanel: "#pop-box-msg",
        qaPanel: "#pop-qa-box"
    });
    t.DoFaqHotel = function (e, t, o, n) {
        return i = !0,
            hotelDomesticConfig.hasLogin ? hotelLoginProject.isMyFaqClick ? a._judgeAjaxReadyTem(!0) : a._showAskPanel() : __SSO_booking_1(e.id, 0),
            !1
    }
        ,
        t.DoFaqReply = function (t, o, n, s) {
            if (i = !0,
                hotelDomesticConfig.hasLogin) {
                var r = e(t).attr("data-id");
                a._showQaPanel(r)
            } else
                __SSO_booking_1(t.id, 0);
            return !1
        }
}(cQuery, window),
    function (e, t) {
        var o, n, i, a = /#ctm_ref=[^&#]*/i, s = window, r = s.document, l = e.browser.isIPad;
        i = function (t, o, n) {
            if (o = o.toUpperCase(),
                n = n || 2,
            n && t.length)
                do {
                    var i = t[0].tagName;
                    if (i && i.toUpperCase() === o)
                        return t
                } while (n-- && (t = t.parentNode()) && t.length);
            return e()
        }
            ,
            n = {
                openLink: function (e, t, o) {
                    if (e) {
                        var n = this.linkForm;
                        n || (n = document.createElement("form"),
                            r.body.appendChild(n),
                            this.linkForm = n),
                            t = t ? t : "_blank",
                        o && !a.test(e) && (n.action = e + "#ctm_ref=" + o,
                            n.method = "post",
                            n.target = t,
                            n.submit())
                    }
                },
                addTracecode: function (e, t) {
                    var o = ""
                        , n = (window.location + "").match(/#ctm_ref=([^&#]*)/i);
                    return n && (o = n[1] || ""),
                        e += o ? "#ctm_ref=" + t : "#ctm_ref=hd_0_0_0_0_lst_0_0_0_0_0_0_" + t
                }
            },
            o = {
                init: function (e) {
                    this.delegateTraceCode()
                },
                delegateTraceCode: function () {
                    var t = s.location.href
                        , o = t.match(a);
                    o = o && o.length ? o[0] : "hd_0_0_0_0_lst_0_0_0_0_0_0",
                        e("body").bind(l ? "touchstart" : "mousedown", function (t) {
                            var o = i(e(t.target), "A")
                                , a = o.attr("href")
                                , s = o.attr("tracecodevalue");
                            s && o.attr("href", n.addTracecode(a, s))
                        })
                }
            },
            t.DetailPage = o
    }(cQuery, window),
    function (e, t) {
        function o(t, o, n, d) {
            a && s[0] && !n && !d && e.ajax(r, {
                cache: !1,
                method: e.AJAX_METHOD_POST,
                context: {
                    hotelId: l,
                    checkIn: t,
                    checkOut: o
                },
                onsuccess: function (e, t) {
                    var o = document.getElementById("chkJustConfirm");
                    o && o.checked ? s.css("display", "none") : (s.html(t),
                        s.css("display", "")),
                        i()
                },
                onerror: function () {
                    s.css("display", "none")
                }
            })
        }

        function n(e) {
            e ? s.css("display", "none") : s.css("display", "")
        }

        function i() {
            e("#ComboInfo img").bind("mouseover", function (t) {
                var o = e(t.target || t.srcElement)
                    , n = o.offset();
                c.attr("src", o.attr("data-huge")),
                    d.css("position", "absolute").css("z-index", 1e4).css("left", n.left + n.width + 1 + "px").css("top", n.top + 1 + "px").css("display", "")
            }).bind("mouseout", function (e) {
                d.css("display", "none")
            })
        }

        var a = t.isShowComboInfo
            , s = e("#ComboInfo")
            , r = t.addressUrlConfig.AjaxHotelComboInfo
            , l = e("#hotel").value()
            , d = e("#popComboPic")
            , c = e("#popComboPic img");
        t.ComoInfo = {
            getComInfo: o,
            hideComoInfo: n
        }
    }(cQuery, window),
    function (e, t) {
        t.rtMoneyBobble = {
            init: function () {
                var t = this;
                e.storage.get("rt_hotel_detail") || (e(".J_rtPriceTips").css("display", ""),
                    e(".J_rtPriceTips .J_close").bind("click", function () {
                        e(".J_rtPriceTips").css("display", "none"),
                            t.hide()
                    }))
            },
            hide: function () {
                e.storage.set("rt_hotel_detail", "T")
            }
        }
    }(cQuery, window),
    rtMoneyBobble.init(),
    function (e, t) {
        function o(t) {
            this.options = {
                recommendKeys: ["bed", "bf", "network", "policy", "reserve", "pay", "hourroom", "triple", "addbed", "chooseroom", "ctrip", "hotelinvoice", "CtripService"],
                keyMapper: {
                    bed: "床型",
                    bf: "早餐",
                    network: "宽带",
                    policy: "政策",
                    reserve: "可预订",
                    pay: "支付类型",
                    hourroom: "钟点房",
                    triple: "三人/家庭房",
                    addbed: "可加床",
                    chooseroom: "在线选房",
                    ctrip: "携程自营",
                    hotelinvoice: "可开专票"
                },
                valueMapper: {
                    bed: {
                        0: "不限",
                        1: "大床",
                        2: "双床",
                        3: "单人床",
                        4: "多床"
                    },
                    bf: {
                        0: "不限",
                        1: "双份早餐",
                        2: "单份早餐",
                        3: "不含早餐",
                        4: "多份早餐"
                    },
                    network: {
                        0: "不限",
                        1: "无线免费",
                        2: "有线免费"
                    },
                    policy: {
                        0: "不限",
                        1: "免费取消",
                        2: "可取消"
                    },
                    reserve: {
                        0: "不限",
                        1: "可预订"
                    },
                    pay: {
                        0: "不限",
                        1: "现付",
                        2: "担保",
                        3: "预付",
                        4: "闪住"
                    },
                    hourroom: {
                        0: "不限",
                        1: "钟点房"
                    },
                    triple: {
                        0: "不限",
                        1: "三人/家庭房"
                    },
                    addbed: {
                        0: "不限",
                        1: "可加床"
                    },
                    chooseroom: {
                        0: "不限",
                        1: "在线选房"
                    },
                    ctrip: {
                        0: "不限",
                        1: "携程自营"
                    },
                    hotelinvoice: {
                        0: "不限",
                        1: "可开专票"
                    }
                }
            },
                e.extend(this.options, t),
                this._init()
        }

        o.prototype = {
            constructor: o,
            _init: function () {
                this.roomGroupList = {},
                    this.curSelectList = {
                        bed: 0,
                        bf: 0,
                        network: 0,
                        policy: 0,
                        hourroom: 0
                    },
                    this.recommendKeyIndex = -1,
                    this.recursion = 0,
                    this._bindEvent(),
                    this._initSelect()
            },
            clearAllFilter: function () {
                e(".J_HorizontalVersionFilter").find(".c_sort_links_choosed").removeClass("c_sort_links_choosed"),
                    e(".J_HorizontalVersionFilter").find(".choosed").removeClass("choosed"),
                    e(".J_HorizontalVersionFilter").find(".multiple_menu a[data-value=0]").addClass("choosed"),
                    e(".J_HorizontalVersionFilter").find(".btn_clear").addClass("hidden"),
                    e("#defaultcoupon").value(""),
                    this.clearPriceFilter(),
                    this.clearPromFilter(),
                    e(".c_sort_bed .lb_text").text("床型"),
                    e(".c_sort_price .lb_text").text("价格"),
                    e(".c_sort_pay .lb_text").text("支付类型"),
                    e("#J_CouponList input").each(function (e) {
                        e[0].checked = !1
                    });
                for (var t in self.curSelectList)
                    self.curSelectList[t] = "0";
                getRoomHTML(!0, function () {
                    e(".J_ExpandLeftRoom").bind("click", function () {
                        expandRoom.call(this)
                    }),
                    window.hourRoomObj && window.hourRoomObj._initSelect()
                })
            },
            clearPriceFilter: function () {
                e("#J_price_range .choosed").removeClass("choosed"),
                    e(this).hasClass("choosed") ? e(this).removeClass("choosed") : e(this).addClass("choosed");
                var t = "价格";
                e("#J_price_min").value(""),
                    e("#J_price_max").value(""),
                    e("#J_price_range .c_sort_links").removeClass("c_sort_links_choosed"),
                e(".btn_clear").hasClass("hidden") || e(".btn_clear").addClass("hidden"),
                    e("#J_price_range .lb_text").html(t)
            },
            clearPromFilter: function () {
                var t = e("#J_promotionf .lb_text").attr("data-default");
                e("#J_prom_range .choosed").removeClass("choosed"),
                    e(".J_prom_item").removeClass("choosed"),
                    e(this).addClass("choosed"),
                e(".btn_clear").hasClass("hidden") || e(".btn_clear").addClass("hidden"),
                    e("#J_promotionf .c_sort_links").removeClass("c_sort_links_choosed"),
                    e("#J_promotionf .lb_text").html(t)
            },
            _bindEvent: function () {
                function t() {
                    return e("." + o.options.container).find(".choosed").length <= 0 && e("#J_HorizontalPriceAndCoupon").find(".c_sort_links_choosed").length <= 0
                }

                var o = this;
                e(document).bind("click", function () {
                    e(".multiple_menu").addClass("hidden")
                }),
                    e("#J_HorizontalPriceAndCoupon .J_price_item").bind("click", function (e) {
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
                    }),
                    e(".J_price_click").bind("click", function (t) {
                        var n = ""
                            , i = [];
                        if ("J_price_range_btn" == e(this)[0].id)
                            (e("#J_price_min").value() || e("#J_price_max").value()) && (e("#J_price_range .choosed").removeClass("choosed"),
                                n = e("#J_price_min").value() ? e("#J_price_max").value() ? "&yen;" + e("#J_price_min").value() + "-" + e("#J_price_max").value() : "&yen;" + e("#J_price_min").value() + "以上" : "&yen;" + e("#J_price_max").value() + "以下",
                                e("#J_price_range .c_sort_links").addClass("c_sort_links_choosed"),
                                e(".btn_clear").removeClass("hidden")),
                                e("#J_price_range .lb_text").html(n);
                        else if ("不限" == e(this).text())
                            o.clearPriceFilter();
                        else {
                            if (e(this).hasClass("choosed"))
                                if (e(this).removeClass("choosed"),
                                0 == e("#J_price_range .choosed").length)
                                    e("#J_price_range .J_price_item:eq(0)").addClass("choosed"),
                                        n = "价格";
                                else {
                                    for (var a = 0; a < e("#J_price_range .choosed").length; a++)
                                        i.push(e(e("#J_price_range .choosed")[a]).text());
                                    n = i.join(",")
                                }
                            else {
                                e(this).addClass("choosed"),
                                    e("#J_price_range .J_price_item:eq(0)").removeClass("choosed");
                                for (var a = 0; a < e("#J_price_range .choosed").length; a++)
                                    i.push(e(e("#J_price_range .choosed")[a]).text());
                                n = i.join(",")
                            }
                            e("#J_price_min").value(""),
                                e("#J_price_max").value(""),
                            e("#J_price_range .c_sort_links").hasClass("c_sort_links_choosed") || e("#J_price_range .c_sort_links").addClass("c_sort_links_choosed"),
                                e(".btn_clear").removeClass("hidden"),
                                e("#J_price_range .lb_text").html(n)
                        }
                        e(".c_sort_price").find(".multiple_menu").addClass("hidden"),
                            getRoomHTML(!0, function () {
                                e(".J_ExpandLeftRoom").bind("click", function () {
                                    expandRoom.call(this)
                                }),
                                window.hourRoomObj && window.hourRoomObj._initSelect()
                            })
                    }),
                    e(".J_HorizontalVersionFilter").bind("click", function (n) {
                        n = n || window.event;
                        var i = n.target || n.srcElement;
                        if (e("#hotelRoomBox .clicked").addClass("hidden"),
                            e(i).parentNode().hasClass("btn_clear"))
                            return void o.clearAllFilter();
                        if (e(i).hasClass("J_price_item"))
                            return void (n.stopPropagation ? n.stopPropagation() : n.cancelBubble = !0);
                        if (("A" === i.tagName.toUpperCase() || "I" === i.tagName.toUpperCase()) && "J_Coupon" !== i.parentNode.id) {
                            if (e(i).hasClass("sort_item")) {
                                var a = e(i).attr("data-type")
                                    , s = !1;
                                if (e(i).hasClass("choosed"))
                                    e(i).removeClass("choosed"),
                                    t() && e(".J_HorizontalVersionFilter").find(".sort_btn").addClass("hidden"),
                                        "confirm" === a ? s = !0 : "pay" === a ? (e(i).parentNode().find(".choosed").removeClass("choosed"),
                                            o.curSelectList[a] = 0,
                                            s = !0) : "CtripService" === a && (s = !0);
                                else {
                                    if (e(".J_HorizontalVersionFilter").find(".sort_btn").removeClass("hidden"),
                                    "confirm" === a)
                                        s = !0;
                                    else if ("pay" === a) {
                                        e(i).parentNode().find(".choosed").removeClass("choosed");
                                        var r = e(i).attr("data-value");
                                        o.currnetKey = a,
                                            o.currentValue = r,
                                            o.curSelectList[o.currnetKey] = 4 == o.currentValue ? 0 : o.currentValue,
                                            s = !0
                                    } else
                                        "CtripService" === a ? s = !0 : "bf" === a ? e(i).parentNode().find(".choosed").removeClass("choosed") : "bed" !== a && "triple" !== a || (o.curSelectList.bed = 0,
                                            o.curSelectList.triple = 0,
                                            e(i).parentNode().find(".choosed").removeClass("choosed"));
                                    e(i).addClass("choosed")
                                }
                                var l = e(i).parentNode().find(".choosed[data-type='" + a + "']")
                                    , d = [];
                                if (l.length > 0 ? l.each(function (t) {
                                    d.push(e(t).attr("data-value"))
                                }) : d.push("0"),
                                d.length > 0 && (o.currnetKey = a,
                                    o.currentValue = d.join(","),
                                    o.curSelectList[o.currnetKey] = o.currentValue,
                                    o._fetchRoom(o.curSelectList),
                                    o._trackLog()),
                                    s)
                                    return void getRoomHTML(!0, function () {
                                        o._fetchRoom(o.curSelectList),
                                            o._trackLog(),
                                            e(".J_ExpandLeftRoom").bind("click", function () {
                                                expandRoom.call(this)
                                            })
                                    })
                            }
                            n.stop()
                        }
                    }),
                    expandRoom = function () {
                        for (var t, n, i, a = e(this), s = "收起" != a.text(); a && a[0].tagName && "TR" != a[0].tagName.toUpperCase();)
                            a = a.parentNode();
                        for (t = a.attr("brid"),
                                 n = o._previousElementSibling(a[0]); n && n.tagName && "TR" == n.tagName.toUpperCase() && e(n).attr("brid") == t;)
                            "T" == e(n).attr("OverF") && (s ? e(n).removeClass("hidden") : e(n).addClass("hidden")),
                                n = o._previousElementSibling(n);
                        i = a.find(".J_ExpandLeftRoom"),
                            s ? (e(".td" + t).attr("rowSpan", i.attr("tcnt")),
                                i.text("收起"),
                                i.removeClass("show_unfold"),
                                i.addClass("show_fold")) : (e(".td" + t).attr("rowSpan", 5),
                                i.text("展开全部房型(" + i.attr("tcnt") + ")"),
                                i.removeClass("show_fold"),
                                i.addClass("show_unfold"))
                    }
                    ,
                    e("#J_Coupon").bind("mouseenter", function () {
                        e("#J_CouponList").removeClass("hidden")
                    }).bind("mouseleave", function () {
                        e("#J_CouponList").addClass("hidden")
                    }),
                    e(".c_sort_bed").bind("mouseover", function () {
                        e(this).find(".multiple_menu").removeClass("hidden")
                    }).bind("mouseout", function () {
                        e(this).find(".multiple_menu").addClass("hidden")
                    }),
                    e(".c_sort_pay").bind("mouseover", function () {
                        e(this).find(".multiple_menu").removeClass("hidden")
                    }).bind("mouseout", function () {
                        e(this).find(".multiple_menu").addClass("hidden")
                    }),
                    e(".c_sort_price").bind("mouseover", function () {
                        e(this).find(".multiple_menu").removeClass("hidden")
                    }).bind("mouseout", function () {
                        e(this).find(".multiple_menu").addClass("hidden")
                    }),
                    e(".c_sort_promotionf").bind("mouseover", function () {
                        e(this).find(".multiple_menu").removeClass("hidden")
                    }).bind("mouseout", function () {
                        e(this).find(".multiple_menu").addClass("hidden")
                    })
            },
            _fetchRoom: function (t, o) {
                function n(e) {
                    do
                        e = e.nextSibling;
                    while (e && 1 !== e.nodeType);
                    return e
                }

                var i, a = this, s = 0;
                a.list = e("." + a.options.list),
                    a._groupRoom();
                var r = !0;
                for (var l in a.options.recommendKeys)
                    if (parseInt(a.curSelectList[a.options.recommendKeys[l]], 10)) {
                        r = !1;
                        break
                    }
                for (var d in a.roomGroupList) {
                    for (var c = d.indexOf(",") ? d.split(",") : d, u = [], m = {}, l = 0; l < c.length; l++) {
                        hasBaseRoom = !1;
                        var h = a.list.find("td[data-roomId=" + c[l] + "]")
                            , p = !0
                            , f = !1;
                        if (h.length)
                            for (var _ = 0; _ < h.length; _++) {
                                e(h[_]).parentNode().removeClass("last_room");
                                for (var v in t)
                                    if (0 != t[v]) {
                                        var g = e(h[_]).attr("data-" + v);
                                        g || (g = "");
                                        var b = g.indexOf("|") && e(h[_]).attr("data-" + v) ? e(h[_]).attr("data-" + v).split("|") : g
                                            , C = t[v].split(",");
                                        f = !1;
                                        for (var w = 0; w < C.length; w++)
                                            if (b.indexOf(C[w]) >= 0) {
                                                f = !0;
                                                break
                                            }
                                        if (p = f,
                                            !p)
                                            break
                                    }
                                if (p && e("#J_price_range .c_sort_links_choosed").length > 0) {
                                    f = !1;
                                    for (var y = e("#J_price_range .choosed"), k = parseInt(e(h[_]).attr("data-price")), x = 0; x < y.length; x++) {
                                        var $ = e(y[x]).attr("data-range")
                                            , I = $.split("-");
                                        if (I && 2 == I.length && k >= parseInt(I[0]) && k <= parseInt(I[1])) {
                                            f = !0;
                                            break
                                        }
                                    }
                                    var J = parseInt(e("#J_price_min").value())
                                        , S = parseInt(e("#J_price_max").value());
                                    f = J && S ? f || k >= J && k <= S : J ? f || k >= J : f || k <= S,
                                        p = f
                                }
                                var T = c[l] + "_" + _;
                                m.hasOwnProperty(T) || (m[T] = "1",
                                    p ? (u.push(e(h[_]).parentNode()),
                                        i = !0,
                                        e(h[_]).parentNode().removeClass("hidden").attr("data-disable", 0)) : e(h[_]).parentNode().addClass("hidden").attr("data-disable", 1))
                            }
                    }
                    var N = (r ? u.length - 1 : u.length,
                        e(u.length && e(u[u.length - 1]).length ? u[u.length - 1] : u[u.length - 2]));
                    if (u.length && N.last().addClass("last_room"),
                        e.browser.isIE7) {
                        for (var P, D = N.attr("brid"), L = e("#J_RoomListTbl tr[brid=" + D + "]"), l = 0; l < L.length; l++) {
                            var O = L[l];
                            if (!e(O).hasClass("hidden")) {
                                P = e(O);
                                break
                            }
                        }
                        for (; P && !P.hasClass("last_room");)
                            s++,
                                P = e(n(P[0]));
                        s++,
                        u.length && e(a.roomGroupList[d]).attr("rowSpan", s)
                    } else
                        u.length && e(a.roomGroupList[d]).attr("rowSpan", u.length);
                    u.length && e(a.roomGroupList[d]).insertBefore(e(u[0]).find(".child_name")),
                        s = 0
                }
                var v = a.options.recommendKeys[a.recommendKeyIndex]
                    , g = a.curSelectList[v];
                if (i || (i = !0,
                    o = !0),
                    i)
                    if (o) {
                        var E, R = !1;
                        R = e(".J_HorizontalVersionFilter").length > 0 ? e(".J_HorizontalVersionFilter .choosed").length > 0 || e(".J_HorizontalPriceAndCoupon .c_sort_links_choosed").length > 0 : e(".J_selectorContainer .c_sort_links_choosed").length > 0,
                            R ? (e("#bookingoverTip").addClass("hidden"),
                                e("tr#J_hourNoResult").removeClass("hidden").html(e.tmpl.render(e("#J_hourNoResultTpl").html(), E))) : (e("#bookingoverTip").removeClass("hidden"),
                                e("#J_hourNoResult").addClass("hidden")),
                            e("#J_ShowAllRoomList").bind("click", function () {
                                a.clearAllFilter()
                            }),
                            a.recursion = 0
                    } else
                        e("tr#J_hourNoResult").addClass("hidden"),
                            a.recursion = 0;
                else {
                    for (var l = 0; l < a.options.recommendKeys.length; l++)
                        if (parseInt(a.curSelectList[a.options.recommendKeys[l]], 10)) {
                            a.recommendKeyIndex = l;
                            break
                        }
                    if (v = a.options.recommendKeys[a.recommendKeyIndex],
                        g = a.curSelectList[v],
                    a.recommendKeyIndex != -1 && a.recursion < a.options.recommendKeys.length + 1) {
                        var H = {};
                        H[v] = g,
                            a.recursion++,
                            a._fetchRoom(H, !0)
                    }
                }
                a._recollepseRoom()
            },
            _groupRoom: function () {
                var t = this;
                t.roomGroupList = {};
                for (var o = t.list.find("td[data-idlist]"), n = 0; n < o.length; n++)
                    t.roomGroupList[e(o[n]).attr("data-idlist")] = e(o[n]);
                t.groupRoomInited = !0
            },
            _initSelect: function () {
                for (var t = this, o = this.curSelectList, n = "", i = "", a = e(".J_selectorContainer .c_sort_links_choosed"), s = 0; s < a.length; s++)
                    e(a[s]).hasClass("J_selectMode") ? (n = e(a[s]).parentNode().find(".choosed").attr("data-type"),
                        i = e(a[s]).parentNode().find(".choosed").attr("data-value")) : (n = e(a[s]).attr("data-type"),
                        i = e(a[s]).attr("data-value")),
                    n && "confirm" != n && (o[n] = i,
                        t.curSelectList[n] = i);
                if (e(".J_HorizontalVersionFilter").length > 0)
                    for (var s = 0; s < this.options.recommendKeys.length; s++) {
                        var r = this.options.recommendKeys[s];
                        if (r && "confirm" != r) {
                            var l = e(".J_HorizontalVersionFilter").find(".choosed[data-type='" + r + "']")
                                , d = [];
                            l.length > 0 ? l.each(function (t) {
                                d.push(e(t).attr("data-value"))
                            }) : d.push("0"),
                            d.length > 0 && (t.currnetKey = r,
                                t.currentValue = d.join(","),
                                t.curSelectList[t.currnetKey] = t.currentValue,
                                o[t.currnetKey] = t.currentValue)
                        }
                    }
                null != o && 4 == o.pay && (o.pay = 0),
                    this._fetchRoom(o)
            },
            _trackLog: function () {
                var t = this
                    , o = e("#chkJustConfirm")[0] && e("#chkJustConfirm")[0].checked ? 1 : 0
                    , n = t.curSelectList.bed || 0
                    , i = t.curSelectList.bf || 0
                    , a = t.curSelectList.network || 0
                    , s = t.curSelectList.policy || 0
                    , r = t.list.find("tr[data-disable=0] td.child_name");
                "undefined" == typeof window.__bfi && (window.__bfi = []);
                for (var l = "checkin=" + e("#startdate").value() + "&checkout=" + e("#depdate").value() + "&bedtype=" + n + "&brfast=" + i + "&net=" + a + "&po=" + s + "&confirm=" + o + "&rmlist=", d = 0; d < r.length; d++) {
                    var c = e(r[d]).attr("data-roomId").match(/^[0-9]*/);
                    l += 0 == d ? c : "," + c
                }
                window.__bfi.push(["_tracklog", "htl.detail.subrmsel", l])
            },
            getFilterParam: function () {
                var e = ""
                    , t = 0;
                for (var o in this.curSelectList)
                    t++,
                        e += o + "|" + this.curSelectList[o],
                        e += t == this.options.recommendKeys.length ? "" : ",";
                return e
            },
            _recollepseRoom: function () {
                if ("T" != isOpenRoomSort)
                    return !1;
                if (this._isIE6OrIe7())
                    return !1;
                var t, o, n, i, a, s, r = 0, l = "", d = 0, c = "展开全部房型", u = 5;
                if (e("#J_RoomListTbl tr").each(function (m) {
                    var h = e(m);
                    if (t = h.attr("brid"),
                        o = h.attr("guid"),
                        !t)
                        return !0;
                    if (i = e(".td" + r),
                        a = e("#Expand" + r).find(".J_ExpandLeftRoom"),
                        s = e("#Expand" + r),
                    l != o) {
                        if (d > u) {
                            var p = d - 1;
                            a.text(c + "(" + p + ")"),
                                a.attr("tcnt", p),
                                n = s,
                                i.attr("rowSpan", u),
                                i.addClass("room_type_fold"),
                                s.removeClass("hidden")
                        } else
                            s.addClass("hidden"),
                                i.removeClass("room_type_fold");
                        n && n.addClass("last_room"),
                            d = h.attr("class").indexOf("hidden") < 0 ? 1 : 0,
                            r = t,
                            l = o
                    } else {
                        h.removeClass("last_room");
                        var f = "Expand" + h.attr("brid");
                        d > u && h.attr("id") == f && h.attr("class").indexOf("hidden") >= 0 && d++,
                            h.attr("OverF", "F"),
                        h.attr("class").indexOf("hidden") < 0 && (d++,
                            d > u ? (h.addClass("hidden"),
                                h.attr("OverF", "T")) : n = h)
                    }
                }),
                    i = e(".td" + r),
                    a = e("#Expand" + r).find(".J_ExpandLeftRoom"),
                    s = e("#Expand" + r),
                    s.addClass("hidden"),
                d > u) {
                    var m = d - 1;
                    a.text(c + "(" + m + ")"),
                        a.attr("tcnt", m),
                        n = s,
                        i.attr("rowSpan", u),
                        i.addClass("room_type_fold"),
                        s.removeClass("hidden")
                }
            },
            _previousElementSibling: function (e) {
                if (e.previousElementSibling)
                    return e.previousElementSibling;
                for (; e = e.previousSibling;)
                    if (1 === e.nodeType)
                        return e
            },
            _isIE6OrIe7: function () {
                var e = !1;
                return "Microsoft Internet Explorer" == navigator.appName && navigator.appVersion.split(";").length > 1 && "MSIE6.0" == navigator.appVersion.split(";")[1].replace(/[ ]/g, "") ? e = !0 : "Microsoft Internet Explorer" == navigator.appName && navigator.appVersion.split(";").length > 1 && "MSIE7.0" == navigator.appVersion.split(";")[1].replace(/[ ]/g, "") && (e = !0),
                    e
            }
        },
            t.hourRoom = o
    }(cQuery, window);
var DPState = {
    iframeInserted: !1,
    iframeInited: !1,
    events: []
};
!function (e, t, o) {
    function n() {
        var e = 0;
        return document.documentElement && document.documentElement.scrollTop ? e = document.documentElement.scrollTop : document.body && (e = document.body.scrollTop),
            e
    }

    var i = 0;
    t.CommentType = {
        Scroll: 1,
        Tab: 2,
        Pager: 3,
        Url: 4,
        More: 5,
        Other: 6
    },
        t.commentInType = t.location.href.indexOf("/hotel/dianping/") >= 0 ? t.CommentType.Url : t.CommentType.Other,
        e("#commentTab a").bind("click", function () {
            window.commentInType = t.CommentType.Tab
        }),
        e(t).bind("scroll", function () {
            i && clearTimeout(i),
                i = setTimeout(function () {
                    var o = []
                        , n = []
                        , i = !1
                        , a = 0
                        , s = ".comment_block" + (i ? ".J_asyncCmt" : ".J_syncCmt")
                        , r = e("#bookTab")
                        , l = e(".J_recommend")
                        , d = e("#cPageNum")
                        , c = e("#hotel").value();
                    if (r.length && (i = !r.hasClass("current"),
                        l.length)) {
                        var u = --l.html()
                            , m = e(s);
                        if (m.length && (m.each(function (e, t) {
                            if (e.isInScreenArea()) {
                                o.push(e.attr("data-cid"));
                                var i = e.find("a.useful");
                                i && i.length && n.push(i.attr("data-voted"))
                            }
                        }),
                            o.length)) {
                            a = i && d.length ? d.attr("value") : 1;
                            var h = i ? t.commentInType : t.CommentType.Scroll
                                , p = {
                                hotelid: c,
                                pageindex: a,
                                ranklist: o.toString(),
                                intype: h,
                                marks: a,
                                recommend: u,
                                useful: n.toString(),
                                others: ""
                            };
                            window.__bfi.push(["_tracklog", "htl.comment.detail", e.stringifyJSON(p)])
                        }
                    }
                }, 500)
        }),
        e.extend(e.fn, {
            isInScreenArea: function () {
                var e = this
                    , t = window.screen.availHeight
                    , o = e.offset().top + 5 >= n()
                    , i = e.offset().top + e.offset().height + 100 <= n() + t;
                return o && i
            }
        })
}(cQuery, window, window.__bfi),
    $.ready(function () {
        var e = null;
        $(window).bind("resize", function () {
            var t = $("iframe.IFR-SHDPX");
            0 != t.length && (clearTimeout(e),
                e = setTimeout(function () {
                    t[0].contentWindow.postMessage($.stringifyJSON({
                        type: "screenWidth",
                        value: $("body").offset().width
                    }), "*")
                }, 1e3))
        })
    }),
    function (e, t) {
        function o(e, o) {
            var i, a = t(".gl-mask");
            t.extend({
                close: ".gl-mask-close"
            }, o);
            0 === a.length && (i = document.createElement("div"),
                a = t(i).addClass("gl-mask").insertBefore(document.body.firstChild)),
                t(e).removeClass("gl-mask-content").addClass("gl-mask-content").css("margin-top", "-176px").css("display", "").find(".c_close").bind("click", function () {
                    n()
                }),
                a.append(e).css("display", "")
        }

        function n() {
            var e = t(".gl-mask");
            0 !== e.length && (e.firstChild().remove(),
                e.css("display", "none"))
        }

        e.gl_mask = o,
            e.gl_unmask = n
    }(window, cQuery),
    function (e, t) {
        function o(o) {
            var n = t(this).attr("data-id")
                , i = addressUrlConfig.MeetingDomain + "/online/panorpic/" + n;
            t("#J_meeting_box .i720").each(function (e) {
                var o = t(e).attr("data-id");
                o && o != n && (i += "_" + o)
            }),
                i += ".html",
                e.open(i),
                o = o || e.event,
                o.preventDefault ? o.stopPropagation() : o.cancelBubble = !0
        }

        function n(e) {
            u && (clearTimeout(u),
                m[0].focus())
        }

        function i(e) {
            u = setTimeout(function () {
                t("#J_meeting_detail").hide()
            }, 300),
                m = t(this)
        }

        function a(o) {
            u && clearTimeout(u);
            var n = t(this).parentNode().parentNode()
                , i = t("#J_meeting_detail");
            if (null != n && void 0 != n) {
                var a = t(n).attr("data-id");
                if (c && c[a]) {
                    i.html(t.tmpl.render(t("#J_meeting_detail_tpl").html(), c[a])),
                        i.css("top", t(n).offset().top + t(n).offset().height / 2 + "px"),
                        i.css("left", t(n).offset().left + 130 + "px"),
                        i.show(),
                        t(n).find(".meeting_title_box")[0].focus();
                    var s = 1
                        , r = t("#J_meeting_detail .J_meeting_pic_slide ul").length;
                    t.mod.load("animate", "1.0", function () {
                        t("#J_meeting_detail .mt_prev").bind("click", function () {
                            s--,
                            1 == s && t(this).hide(),
                                t("#J_meeting_detail .mt_next").show(),
                                t("#J_meeting_detail .J_meeting_pic_slide").animate({
                                    marginLeft: "+=320"
                                }, function () {
                                })
                        }),
                            t("#J_meeting_detail .mt_next").bind("click", function () {
                                s++,
                                s == r && t(this).hide(),
                                    t("#J_meeting_detail .mt_prev").show(),
                                    t("#J_meeting_detail .J_meeting_pic_slide").animate({
                                        marginLeft: "-=320"
                                    }, function () {
                                    })
                            })
                    }),
                        t("#J_meeting_detail i").bind("click", function () {
                            t("#J_meeting_detail").hide()
                        }),
                        o = o || e.event,
                        o.preventDefault ? o.stopPropagation() : o.cancelBubble = !0
                }
            }
        }

        function s(e) {
            tracklog.meetingTrack("o_hotel_inland_meeting_checkhour");
            var o = t("#J_meeting_choose_time")
                , n = t(this).parentNode().parentNode();
            if (n) {
                var i = t(n).attr("data-id");
                c && c[i] && (o.html(t.tmpl.render(t("#J_meeting_choose_tpl").html(), c[i])),
                    o.find("i").bind("click", function () {
                        o.unmask()
                    }),
                    o.mask(),
                    t("#J_meeting_choose_time .J_choose_time").bind("click", function (e) {
                        if (!t(this).hasClass("gray")) {
                            var o = t(this).attr("data-clock");
                            t(this).hasClass("active") ? t(this).removeClass("active") : (t(this).addClass("active"),
                                1 == o || 2 == o ? t(this).parentNode().find("[data-clock=0]").removeClass("active") : 0 == o && t(this).parentNode().find("[data-clock=1],[data-clock=2]").removeClass("active"));
                            var n = t("#J_meeting_choose_time .active");
                            if (n.length > 0) {
                                for (var i = 0, a = 0; a < n.length; a++)
                                    i += parseInt(t(n[a]).attr("data-price"));
                                t("#J_meeting_choose_time .J_totle_price").html("<dfn>¥</dfn>" + i),
                                    t("#J_meeting_choose_time .J_floor_price").css("display", "none"),
                                    t("#J_meeting_choose_time .J_totle_price").css("display", "inline-block"),
                                    t("#J_meeting_choose_time .mt_btn").removeClass("disabled")
                            } else
                                t("#J_meeting_choose_time .J_floor_price").css("display", "inline-block"),
                                    t("#J_meeting_choose_time .J_totle_price").css("display", "none"),
                                    t("#J_meeting_choose_time .mt_btn").addClass("disabled")
                        }
                    }),
                    t("#J_meeting_choose_time .mt_btn").bind("click", function (e) {
                        var o = null
                            , n = []
                            , i = {}
                            , a = t(this).attr("data-booking")
                            , s = t("#J_meeting_choose_time .active");
                        if (!t(this).hasClass("disabled")) {
                            if (!hotelDomesticConfig.hasLogin)
                                return t(this)[0].id = "btnMeeting_" + a + "_" + parseInt(1e4 * Math.random()),
                                    void __SSO_booking(t(this)[0].id, "undefined" != typeof ISSSOQUICKLOGIN ? ISSSOQUICKLOGIN : 0);
                            for (var l = 0; l < s.length; l++) {
                                var d = t(s[l]).parentNode()
                                    , u = d.find(".mt_date_li").text()
                                    , m = t(s[l]).attr("data-clock")
                                    , h = t(s[l]).attr("data-price");
                                i[u] || (i[u] = []),
                                    i[u].push({
                                        dateday: u,
                                        clock: m,
                                        price: h,
                                        roomcount: 1
                                    })
                            }
                            for (var p in i)
                                i.hasOwnProperty(p) && (o = t.extend({}, c[a].bookInfo),
                                    o.usedate = i[p],
                                    n.push(o));
                            r(n)
                        }
                    }))
            }
        }

        function r(e) {
            var o = document.createElement("form");
            document.body.appendChild(o),
                o.method = "post",
                o.action = addressUrlConfig.MeetingDomain + "/online/MeetingLoading.aspx#ctm_ref=hod_dl_tab_meet_chk",
                o.target = "_self";
            var n = document.createElement("input");
            n.setAttribute("name", "settleobj"),
                n.setAttribute("type", "hidden"),
                n.setAttribute("value", t.stringifyJSON(e)),
                o.appendChild(n),
                n = document.createElement("input"),
                n.setAttribute("name", "sourceFrom"),
                n.setAttribute("type", "hidden"),
                n.setAttribute("value", 2),
                o.appendChild(n),
                o.submit()
        }

        function l() {
            t(".J_baseroom_link").each(function (e) {
                var o = t("td[data-baseroomname='" + e.attr("data-baseroomname") + "']");
                o.length > 0 ? e.addClass("room_link") : e.removeClass("room_link")
            })
        }

        function d() {
            var o = t("#checkIn").value()
                , n = t("#checkOut").value()
                , i = addressUrlConfig.AjaxMeetingRooms;
            i && t.ajax(i, {
                cache: !1,
                method: "POST",
                context: {
                    checkIn: o,
                    checkOut: n
                },
                onsuccess: function (o, n) {
                    if (n) {
                        var i = t.parseJSON(n);
                        i && (t(".J_MeetingRooms").html(i.MeetingAdvertise),
                            t(".J_MeetingRooms").removeClass("hidden"),
                            t(".J_OtherBuBaseRoom").removeClass("hidden"),
                        i.HasMeeting && (t("#J_room_list_tabs").css("display", ""),
                            t("#J_room_list_tabs .fn-meeting-list").css("display", "")),
                        e.showMeetingList || (e.showMeetingList = function () {
                                if (!t("#J_room_list_tabs").find(".fn-meeting-list").hasClass("current")) {
                                    var o = t("#cc_txtCheckIn").value()
                                        , n = t("#cc_txtCheckOut").value();
                                    t("#J_room_list_tabs").find(".fn-hotel-list").removeClass("current"),
                                        t("#J_room_list_tabs").find(".fn-shx-dp").removeClass("current"),
                                        t("#J_room_list_tabs").find(".fn-meeting-list").addClass("current"),
                                        t("#id_room_select_box").hide(),
                                        t("iframe.IFR-SHDPX").hide(),
                                        t("#J_meeting_list").css("display", "");
                                    var i = (new Date).addDays(1).toFormatString("yyyy-MM-dd");
                                    (new Date).getHours() >= 18 && (i = (new Date).addDays(2).toFormatString("yyyy-MM-dd")),
                                        e.checkInDateFromOtherTab && e.checkOutDateFromOtherTab ? (e.checkInDateFromOtherTab <= i ? t("#meetingCheckIn").value(i) : t("#meetingCheckIn").value(e.checkInDateFromOtherTab),
                                            e.checkOutDateFromOtherTab <= i ? t("#meetingCheckOut").value(i) : t("#meetingCheckOut").value(e.checkOutDateFromOtherTab),
                                            e.checkInDateFromOtherTab = null,
                                            e.checkOutDateFromOtherTab = null,
                                            t("#meetingChangeBtn").trigger("click")) : o && n && (o <= i ? t("#meetingCheckIn").value(i) : t("#meetingCheckIn").value(o),
                                            n <= i ? t("#meetingCheckOut").value(i) : t("#meetingCheckOut").value(n),
                                            t("#meetingChangeBtn").trigger("click")),
                                        tracklog.meetingTrack("o_hotel_inland_meetingtab")
                                }
                            }
                        ),
                            t("#J_room_list_tabs .fn-meeting-list").unbind("click", e.showMeetingList).bind("click", e.showMeetingList),
                            t("#J_room_list_tabs").find(".fn-hotel-list").unbind("click", e.showRoomListTab).bind("click", e.showRoomListTab))
                    }
                },
                onerror: function () {
                }
            })
        }

        var c = null;
        t("#meetingChangeBtn").bind("click", function () {
            var r = t("#meetingCheckIn").value()
                , l = t("#meetingCheckOut").value()
                , d = t("#hotel").value();
            if (t("#J_meeting_box .room_list_loading").show(),
                t("#J_meeting_box table").hide(),
                t("#J_meeting_box .mt_pic").hide(),
                t("#J_MeetingCustomization").bind("click", function (t) {
                    var t = t || e.event;
                    hotelDomesticConfig.hasLogin || (t.stop(),
                        __SSO_booking_1(this.id, 1))
                }),
                e.checkInDateFromOtherTab = t("#meetingCheckIn").value(),
                e.checkOutDateFromOtherTab = t("#meetingCheckOut").value(),
            e.checkInDateFromOtherTab == e.checkOutDateFromOtherTab) {
                var u = new Date(e.checkOutDateFromOtherTab.replace("-", "/"));
                e.checkInDateFromOtherTab = u.addDays(-1).toFormatString("yyyy-MM-dd")
            }
            t.ajax("/Domestic/Tool/AjaxMeetingRoomDetail.ashx", {
                cache: !1,
                method: "POST",
                context: {
                    checkIn: r,
                    checkOut: l,
                    hotel: d
                },
                onsuccess: function (e, r) {
                    if (c = {},
                        t("#J_meeting_box .room_list_loading").hide(),
                        t("#J_meeting_box table").css("display", ""),
                        t("#J_meeting_box .mt_pic").show(),
                        r) {
                        var l = t.parseJSON(r);
                        if (l) {
                            for (var d = 0; d < l.length; d++)
                                c[l[d].MeetingRoomID] = l[d],
                                    l[d].bookInfo = {
                                        type: 1,
                                        id: l[d].ResID,
                                        proid: l[d].SubProID,
                                        payratio: l[d].PayRatio,
                                        placeid: 0,
                                        placename: l[d].PlaceName,
                                        mhotelid: l[d].PlaceID,
                                        name: l[d].Name,
                                        hasPillar: null == l[d].IsPillar ? "--" : l[d].IsPillar ? "有" : "无",
                                        volPerson: l[d].MinCapacity == l[d].MaxCapacity ? 0 == l[d].MinCapacity ? "--" : l[d].MinCapacity : l[d].MinCapacity + "~" + l[d].MaxCapacity,
                                        usedate: []
                                    },
                                    l[d].Area = l[d].Area > 0 ? l[d].Area + "㎡" : "--",
                                    l[d].MaxCapacity = l[d].MaxCapacity > 0 ? l[d].MaxCapacity + "人" : "--",
                                    l[d].TheaterCapacity = l[d].TheaterCapacity > 0 ? l[d].TheaterCapacity + "人" : "--",
                                    l[d].SchoolCapacity = l[d].SchoolCapacity > 0 ? l[d].SchoolCapacity + "人" : "--",
                                    l[d].DinnerCapacity = l[d].DinnerCapacity > 0 ? l[d].DinnerCapacity + "人" : "--";
                            t("#J_meeting_box tbody").html(t.tmpl.render(t("#J_meeting_list_tpl").html(), {
                                list: l
                            })),
                                t("#J_meeting_box .btn_date").bind("click", s),
                                t("#J_meeting_box .meeting_title_box,.mt_detail").bind("click", a),
                                t("#J_meeting_box .meeting_title_box").bind("blur", i),
                                t("#J_meeting_detail").bind("click", n),
                                t("#J_meeting_box .i720").bind("click", o)
                        }
                    }
                },
                onerror: function () {
                    t("#J_meeting_box .room_list_loading").hide()
                }
            })
        });
        var u = null
            , m = null;
        e.changRoomClass = l,
            e.getMeetingRoomsFunc = d
    }(window, cQuery),
    function () {
        $("#commentList,#divCtripComment").bind("click", function (e) {
            var t = $(e.target || e.srcElement);
            if (t.hasClass("J_baseroom_link")) {
                var o = $("td[data-baseroomname='" + t.attr("data-baseroomname") + "']");
                if (o.length > 0) {
                    var n, i = $.parseJSON(o.attr("data-baseroominfo") || "{}"), a = document.createElement("div");
                    n = $.tmpl.render($("#J_baseroomTemplate").html(), i),
                        $(a).html(n),
                        $(document.body).append(a);
                    var s = $(".J_baseroomDialog");
                    gl_mask(s),
                        s.data("tdId", i.RoomID).find(".room_btn").bind("click", function () {
                            gl_unmask(s),
                                location.hash = "",
                                location.hash = s.data("tdId")
                        })
                }
            }
        })
    }(),
    function () {
        function e(e) {
            this.options = e,
                this._count = 1
        }

        e.prototype = {
            contructor: e,
            prev: function () {
                var e = this
                    , t = (this.options.maxPage,
                    this.options.width)
                    , o = $("#J_room_detail .J_slider_box_in");
                this._count > 1 ? (o.animate({
                    marginLeft: "+=" + t
                }, function () {
                }),
                    this._count--,
                    e.showPrevNext()) : e.showPrevNext()
            },
            showPrevNext: function () {
                var e = $("#J_room_detail .next")
                    , t = $("#J_room_detail .prev");
                1 == this._count ? (e.show(),
                    t.hide()) : this._count == this.options.maxPage ? (e.hide(),
                    t.show()) : (e.show(),
                    t.show())
            },
            next: function () {
                var e = this
                    , t = this.options.maxPage
                    , o = this.options.width
                    , n = $("#J_room_detail .J_slider_box_in");
                this._count < t ? (n.animate({
                    marginLeft: "-=" + o
                }, function () {
                }),
                    this._count++,
                    e.showPrevNext()) : e.showPrevNext()
            },
            getOptions: function () {
                return this.options
            },
            reset: function (e) {
                this._count = 1,
                    this.options = $.extend(this.options, e)
            }
        };
        var t = $("#J_roomDetail_float")
            , o = {
            width: 300
        }
            , n = new e(o);
        $.mod.load("animate", "1.0", function () {
            t.bind("click", function (e) {
                e = e || window.event,
                    e.preventDefault ? e.stopPropagation() : e.cancelBubble = !0;
                var o = $(e.target || e.srcElement);
                if (o.hasClass("j_detail_close"))
                    return void t.hide();
                if (null != n.getOptions() && n.getOptions().maxPage > 0) {
                    if (o[0] && "B" == o[0].tagName) {
                        if (o.parentNode().hasClass("next"))
                            return void n.next();
                        if (o.parentNode().hasClass("prev"))
                            return void n.prev()
                    }
                    if (o.hasClass("next"))
                        return void n.next();
                    if (o.hasClass("prev"))
                        return void n.prev()
                }
            })
        }),
            window.picScroll = n
    }(),
    function (e) {
        if (!e.cookie.get("OID_ForOnlineHotel")) {
            var t = (e.cookie.get("_bfa") || "").split(".");
            t && t.length >= 3 && e.cookie.set("OID_ForOnlineHotel", "", t[1] + t[2] + (new Date).getTime() + e("#page_id").value(), {
                path: "/"
            })
        }
        window.setToOrderPageTraceLog = function (t) {
            var o = e(t).attr("data-order").split(",");
            if (o[0] && o[17]) {
                var n = {};
                n.masterhotelid = o[16],
                    n.hotelid = o[17],
                    n.roomid = o[0],
                    n.isG = o[12],
                    n.isPP = "PP" == o[4] ? "T" : "F",
                    n.aid = e.cookie.get("Union", "AllianceID"),
                    n.sid = e.cookie.get("Union", "SID"),
                    n.OID = e.cookie.get("OID_ForOnlineHotel"),
                    window.__bfi.push(["_tracklog", "hotel_inland_order_book", e.stringifyJSON(n)])
            }
        }
            ,
            window.setHotelPyramidTrace = function (t) {
                if ("T" === e("#hasPyramid").value() && 0 != t) {
                    var o = "/Domestic/Tool/AjaxHotelPyramidTrace.aspx"
                        , n = {
                        hotelId: t,
                        city: e("#cityId").value(),
                        zone: e("#zonelist").value(),
                        keyword: e("#keyword").value(),
                        star: e("#starlist").value(),
                        scenario: 2,
                        hotelposition: e("#hotelposition").value(),
                        action: 6,
                        pageId: e("#page_id").value()
                    };
                    e.ajax(o, {
                        method: "POST",
                        context: n,
                        cache: !1,
                        onsuccess: function () {
                        },
                        onerror: function () {
                        }
                    })
                }
            }
    }(cQuery),
    function (e) {
        var t = e("#hotel").val();
        e("#QRCode").qrcode({
            render: "table",
            width: 120,
            height: 120,
            text: "https://m.ctrip.com/webapp/hotel/wechatlab/detail/" + t
        })
    }(jQuery);
!function (e) {
    function o() {
        "undefined" != typeof useNewCompare && useNewCompare || i.check()
    }

    function n(e, o) {
        i.makeOrder(e, o)
    }

    function t(e) {
        i.callSuccessAuthStatus(e)
    }

    var i = {
        container: {},
        hotelId: 0,
        config: {
            FAIL_DOM: $(".compare_fail_pop"),
            POPUI_DOM: $(".compare_pop"),
            TITLEBAR: $(".compare_pop_hd"),
            HOTEL_LIST_DOM: $("#hotel_list,#hotelRoomBox"),
            HOTEL_LIST_DOM_ID: "#hotel_list,#hotelRoomBox",
            LOADING_HTML: $(".compare_pop_loading").parentNode().html(),
            ORIGINAL_PAGE_ID: $("#page_id").value(),
            ORIGINAL_URL: window.location.toString(),
            POPUI_PAGE_ID: "102002" == $("#page_id").value() ? "599003991" : "599003992",
            POPUI_URL_TMPL: window.location.origin + "/pricecmp/hotelid{$0}.html",
            POP_POSITION: {
                top: 0,
                left: 0,
                scrollTop: 0,
                width: 0,
                height: 0,
                popBodyHeight: 0
            },
            ROOT_CONTAINER: $.browser.isIE || $.browser.isIE11 ? document.documentElement : document.body,
            ISMAXED: !1
        },
        init: function () {
            var e = this;
            e.config.FAIL_DOM.find(".close").bind("click", function (o) {
                e.container.unmask(),
                    e.config.ROOT_CONTAINER.scrollTop = e.config.POP_POSITION.scrollTop,
                    e.config.ROOT_CONTAINER.style.overflow = "auto"
            }),
                e.config.POPUI_DOM.find(".close").bind("click", function (o) {
                    o.stopPropagation ? o.stopPropagation() : o.cancelBubble = !0,
                        e.container.unmask(),
                        e.config.ROOT_CONTAINER.scrollTop = e.config.POP_POSITION.scrollTop,
                        e.config.ROOT_CONTAINER.style.overflow = "auto",
                    e.hotelId && (e._sendUBT(),
                        e.hotelId = 0),
                        i.config.ISMAXED = !1
                }),
                e._getHotelList().bind("click", function (o) {
                    var n = $(o.target);
                    if (n.hasClass("J_priceCmpEntry")) {
                        var t = n.attr("data-hotelid")
                            , i = n.attr("data-hotelname");
                        t && i && e._load(t, i)
                    }
                })
        },
        check: function () {
            var e = $(".J_priceCmpEntry")
                , o = [];
            e.each(function (e) {
                o.push(e.attr("data-hotelid"))
            })
        },
        makeOrder: function (e, o) {
            var n = "T" === $(e).attr("data-checkAuth")
                , t = "T" === $("#J_hasLogin4ComparePrice").value();
            n && !t && ((o = o || window.event) && (o.returnValue = !1,
            o.preventDefault && o.preventDefault()),
                window.__SSO_booking(e.id, 1))
        },
        callSuccessAuthStatus: function (e) {
            var o = $("#" + e);
            o.length > 0 && o.trigger("click"),
                $("#J_hasLogin4ComparePrice").value("T")
        },
        _load: function (e, o) {
            var n = this
                , t = n._getFormOptions();
            n._updateCurrentHotelId(e),
                n._showLoadingPanel(o);
            var i = $(".J_priceInfo a").filter(".selected").attr("data-value");
            $.BizMod.Promise(this._getElevenValue).any(function (o) {
                n._pollCas({
                    hotelId: e,
                    checkIn: t.checkIn,
                    checkOut: t.checkOut,
                    returnCash: i,
                    edm: t.EDM,
                    eleven: encodeURIComponent(o)
                })
            })
        },
        _bindBaseRoomEvents: function () {
            var e = this
                , o = e.container;
            o.find(".J_foldBar").bind("click", function (o) {
                var n = $(this)
                    , t = o.target
                    , i = n.attr("data-index")
                    , a = n.offset().height
                    , r = ["btn_compare", "room_btn", "btn_fold", "btn_unfold", "room_type_name"];
                t && r.indexOf(t.className) !== -1 && (o.stop(),
                    n.hasClass("modular_fold") ? e._unfold(n) : n.hasClass("modular_unfold") && (e._fold(n),
                        $(".compare_pop_bd")[0].scrollTop = i * a))
            }),
                o.find("div.room_type>.room_type_name, .room_btn>span").bind("click", function (o) {
                    var n = $(this)
                        , t = e._getCurrentBaseRoom(n)
                        , i = t.attr("data-tracekey")
                        , a = t.attr("data-tracevalue");
                    e._sendTrack(i, a)
                }),
                o.find(".J_makeOrder").bind("click", function () {
                    var o = $(this)
                        , n = o.attr("data-tracekey")
                        , t = o.attr("data-tracevalue");
                    $(".J_priceInfo a").filter(".selected").attr("data-value"),
                        e._getFormOptions();
                    e._sendTrack(n, t)
                }),
                o.find("a.more_unfold").bind("click", function (o) {
                    var n = e._getCurrentBaseRoom($(this));
                    n.find(".room_caplist").removeClass("hidden"),
                        n.find(".room_type_info").addClass("hidden"),
                        n.find(".J_ViewRoomDetail").addClass("hidden")
                }),
                o.find("li.more_fold a").bind("click", function (o) {
                    var n = e._getCurrentBaseRoom($(this));
                    n.find(".room_caplist").addClass("hidden"),
                        n.find(".room_type_info").removeClass("hidden"),
                        n.find(".J_ViewRoomDetail").removeClass("hidden")
                }),
                o.find("a.more_price").bind("click", function () {
                    var o = $(this)
                        , n = e._getCurrentSubRoom(o);
                    o.addClass("hidden"),
                        n.find(".child_room_model").addClass("child_room_open").removeClass("hidden"),
                        n.find(".supplier_logo").addClass("supplier_logo_open")
                }),
                o.find(".more_supplier_btn a").bind("click", function () {
                    var o = $(this)
                        , n = e._getCurrentBaseRoom(o);
                    o.addClass("hidden"),
                        n.find(".child_room").removeClass("hidden")
                }),
                o.find(".compare_pop_hd")[0].ondblclick = function () {
                    e._maxiumAndMinium()
                }
                ,
                e.config.TITLEBAR.bind("mousedown", a.start),
                e._bindEventForHoverOnRoomPic()
        },
        _maxiumAndMinium: function () {
            var e = this.container
                , o = this;
            if (parseInt(e.css("width")) === document.documentElement.clientWidth)
                o.config.ROOT_CONTAINER.scrollTop = o.config.POP_POSITION.scrollTop,
                    e.css({
                        width: o.config.POP_POSITION.width + "px",
                        top: o.config.POP_POSITION.top + "px",
                        left: o.config.POP_POSITION.left + "px",
                        height: o.config.POP_POSITION.height + "px"
                    }),
                o.config.POP_POSITION.popBodyHeight && e.find(".compare_pop_bd").css({
                    height: o.config.POP_POSITION.popBodyHeight + "px"
                }),
                    o.config.ISMAXED = !1;
            else {
                o.config.POP_POSITION.scrollTop = o.config.ROOT_CONTAINER.scrollTop,
                    o.config.ROOT_CONTAINER.scrollTop = 0,
                    o.config.ROOT_CONTAINER.style.overflow = "hidden",
                    o.config.POP_POSITION.top = e.offset().top,
                    o.config.POP_POSITION.left = e.offset().left,
                    o.config.POP_POSITION.width = e.offset().width,
                    o.config.POP_POSITION.height = e.offset().height;
                var n = e.find(".compare_pop_bd");
                o.config.POP_POSITION.popBodyHeight = n.offset().height - 10,
                    n.css({
                        height: document.documentElement.clientHeight - 50 + "px"
                    }),
                    e.css({
                        width: document.documentElement.clientWidth + "px",
                        top: 0,
                        left: 0,
                        height: document.documentElement.clientHeight + "px"
                    }),
                    o.config.ISMAXED = !0
            }
        },
        _getCurrentBaseRoom: function (e) {
            return this._has(this.container.find(".J_foldBar"), e)
        },
        _getCurrentSubRoom: function (e) {
            return this._has(this.container.find(".J_foldBar .child_room"), e)
        },
        _has: function (e, o) {
            var n = void 0;
            return e.each(function (e, t) {
                if (e.contains(o))
                    return n = e,
                        !1
            }),
                n
        },
        _unfold: function (e) {
            var o = this
                , n = e || o.container.find(".modular_fold")
                , t = n.attr("data-index")
                , i = o.container.find(".J_foldList");
            n.removeClass("modular_fold").addClass("modular_unfold"),
                n.find(".J_modular_warp").addClass("modular_unfold_wrap"),
                n.find(".btn_unfold").removeClass("hidden"),
                n.find(".btn_fold").addClass("hidden"),
                n.find(".modular_list, .room_pic, .room_caplist, .more_unfold").addClass("hidden"),
                n.find(".room_caplist").addClass("hidden"),
                i.filter("[data-index=" + t + "]").addClass("hidden"),
                n.find(".btn_fast").addClass("hidden"),
                n.find(".btn_compare").removeClass("hidden"),
                n.find(".room_type_info").removeClass("hidden")
        },
        _fold: function (e) {
            var o = this;
            e.attr("data-index"),
                o.container.find(".J_foldBar"),
                o.container.find(".J_foldList");
            o._unfold(),
                e.removeClass("modular_unfold").addClass("modular_fold"),
                e.find(".J_modular_warp").removeClass("modular_unfold_wrap"),
                e.find(".modular_list, .room_pic, .more_unfold").removeClass("hidden"),
                e.find(".btn_unfold").addClass("hidden"),
                e.find(".btn_fold").removeClass("hidden"),
                e.find(".room_type_info").removeClass("hidden"),
                e.find(".room_caplist").addClass("hidden")
        },
        _foldFirstBaseRoom: function () {
            var e = this.container.find(".J_foldBar:first");
            this._fold(e)
        },
        _sendUBT: function () {
            var e = this;
            window.__bfi.push(["_asynRefresh", {
                page_id: e.config.POPUI_PAGE_ID,
                url: e.config.POPUI_URL_TMPL.replace("{$0}", e.hotelId),
                refer: e.config.ORIGINAL_URL
            }])
        },
        _sendTrackLog: function () {
            var e = $("#J_compareBtnTraceKey").value() || "htl.searchbtn.pri"
                , o = $("#J_compareBtnTraceValue").value();
            e && o && window.__bfi.push(["_tracklog", e, o])
        },
        _sendTrack: function (e, o) {
            e && o && window.__bfi.push(["_tracklog", e, o])
        },
        _updateCurrentHotelId: function (e) {
            this.hotelId = e
        },
        _updatePanelContent: function (e) {
            var o = this;
            o.container && o.container.find(".compare_pop_bd").html(e)
        },
        _showLoadingPanel: function (e) {
            var o = this;
            o.config.POP_POSITION.scrollTop = o.config.ROOT_CONTAINER.scrollTop,
                o.config.ROOT_CONTAINER.style.overflow = "hidden",
                o.container = $(o.config.POPUI_DOM);
            var n = o.container.find(".compare_pop_bd");
            o.config.POP_POSITION.height && o.container.css({
                height: o.config.POP_POSITION.height + "px"
            }),
            o.config.POP_POSITION.popBodyHeight && n.css({
                height: o.config.POP_POSITION.popBodyHeight + "px"
            }),
                o.container.find(".J_hotelName").text(e),
                n.html(o.config.LOADING_HTML),
                o.container.mask()
        },
        _showErrorPanel: function (e) {
            var o = this;
            o.container.unmask(),
                o.container = $(o.config.FAIL_DOM),
                o.container.find(".J_hotelName").text(e),
                o.container.mask(),
                setTimeout(function () {
                    o.container.mask()
                }, 2e3)
        },
        _getHotelList: function () {
            return $(this.config.HOTEL_LIST_DOM_ID)
        },
        _getFormOptions: function () {
            return {
                checkIn: $("#checkIn").value(),
                checkOut: $("#checkOut").value(),
                EDM: $("#J_edm").value(),
                pageType: $("#pagetype").value(),
                useFPGP: $("#useFPGP").value()
            }
        },
        _bindEventForHoverOnRoomPic: function () {
            var e = null
                , o = ""
                , n = document.getElementById("popRoomPic");
            $(".room_pic").bind("mouseover", function (t) {
                t = t || window.event;
                var i = t.target || t.srcElement;
                if (e && clearTimeout(e),
                "IMG" == i.nodeName) {
                    var a = i.getAttribute("_src");
                    if (!a)
                        return;
                    o != a && (n.getElementsByTagName("img")[0].src = a,
                        o = a),
                        e = setTimeout(function () {
                            n.style.display = "",
                                $("#popRoomPic").css("z-index", 1e3),
                            o && (n.style.left = parseInt($(i).offset().left) + parseInt($(i).offset().width) + 3 + "px",
                                n.style.top = parseInt($(i).offset().top) + "px")
                        }, 300)
                }
            }).bind("mouseout", function (e) {
                e = e || window.event;
                var t = e.target || e.srcElement;
                "IMG" == t.nodeName && (o = "",
                    n.style.display = "none",
                    n.style.top = "-1000px",
                    n.getElementsByTagName("img")[0].src = "//pic.c-ctrip.com/common/pic_alpha.gif")
            })
        },
        _pollCas: function (e, o) {
            "function" !== $.type(o) && (o = function () {
                }
            ),
            window.EXPRESSION && EXPRESSION.poll("/domestic/cas/nevermore/RemoteCall", null, "POST", hotelDomesticConfig.cas.NeverMore, o, null, e)
        },
        _getElevenValue: function (e) {
            function o(e) {
                for (var o = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], n = "", t = 0; t < e; t++) {
                    var i = Math.ceil(25 * Math.random());
                    n += o[i]
                }
                return n
            }

            var n, t = o(7), i = !1;
            if (!hotelDomesticConfig.cas.OceanBall)
                return e.resolve("");
            for (; window[t];)
                t = o(15);
            n = hotelDomesticConfig.cas.OceanBallUrl + "?callback=" + t + "&_=" + (new Date).getTime(),
                window[t] = function (o) {
                    window[t] = void 0;
                    var n = "";
                    try {
                        n = o()
                    } catch (a) {
                        $.ajax("/domestic/cas/image/bi", {
                            method: $.AJAX_METHOD_POST,
                            cache: !1,
                            context: {
                                value: "11-" + encodeURIComponent(a.stack || a)
                            }
                        })
                    } finally {
                        i = !0,
                            e.resolve(n)
                    }
                }
                ,
                $.loader.js(n, {
                    onload: function () {
                        i || (window[t] = void 0,
                            e.reject(""))
                    },
                    onerror: function (o) {
                        o && (window[t] = void 0),
                            e.reject("")
                    }
                })
        }
    };
    "undefined" != typeof useNewCompare && useNewCompare || (i.init(),
        i.check()),
        e.enablePriceCompareEntries = o,
        e.makeOrderPriceCompare = n,
        e.callSuccessAuthStatus = t;
    var a = {
        X: 0,
        Y: 0,
        element: null,
        start: function (e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0,
            i.config.ISMAXED || $(e.target).hasClass("close") || (e = e || window.event,
                a.element = this,
                this.setCapture ? this.setCapture() : window.captureEvents && window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP),
                a.X = e.clientX - this.parentNode.offsetLeft || 0,
                a.Y = e.clientY - this.parentNode.offsetTop || 0,
                document.onmousemove = a.move,
                document.onmouseup = a.stop)
        },
        move: function (e) {
            e = e || window.event;
            var o = i.config.POPUI_DOM
                , n = Math.max(e.clientX - a.X, 0)
                , t = Math.max(e.clientY - a.Y, i.config.ROOT_CONTAINER.scrollTop);
            o.css({
                left: n + "px",
                top: t + "px",
                position: "absolute"
            })
        },
        stop: function (e) {
            function o(e, o, n) {
                e.removeEventListener ? e.removeEventListener(o, n, !1) : e.detachEvent("on" + o, n)
            }

            $.browser.isIE ? (o(a.element, "losecapture", a.start),
                a.element.releaseCapture()) : o(window, "blur", a.start),
                document.onmousemove = null,
                document.onmouseup = null
        }
    }
}(window.App = window.App || {});
!function (e) {
    function t(e, t) {
        d.makeOrder(e, t)
    }

    function n() {
        return d._getCompareParams()
    }

    function o(e) {
        d.callSuccessAuthStatus(e)
    }

    function a() {
        var e = hotelDomesticConfig.hotel.id;
        e && d._loadList(e, ""),
            $(".J_selectorContainer").addClass("hidden"),
            $("#J_CompareExtension").removeClass("hidden")
    }

    var i, d = {
        container: {},
        hotelId: 0,
        config: {
            FAIL_DOM: $(".compare_fail_pop"),
            POPUI_DOM: $(".compare_pop"),
            TITLEBAR: $(".compare_pop_hd"),
            HOTEL_LIST_DOM: $("#hotel_list,#hotelRoomBox"),
            HOTEL_LIST_DOM_ID: "#hotel_list,#hotelRoomBox",
            LOADING_HTML: $(".compare_pop_loading").parentNode().html(),
            ORIGINAL_PAGE_ID: $("#page_id").value(),
            ORIGINAL_URL: window.location.toString(),
            POPUI_PAGE_ID: "102002" == $("#page_id").value() ? "599003991" : "599003992",
            POPUI_URL_TMPL: window.location.origin + "/pricecmp/hotelid{$0}.html"
        },
        init: function () {
            i = this,
                i._bindChangeTabEvent()
        },
        _loadList: function (e, t) {
            var n = i._getFormOptions()
                , o = '<div class="room_list_loading">' + roomMessageConfig.loading + "</div>";
            $("#noPriceInfo").html(""),
                $("#hotelRoomBox").addClass("hidden"),
                $("#J_HotelCompare").removeClass("hidden"),
                $("#J_HotelCompare").removeClass("hotel_compare"),
                $("#J_HotelCompare").html(o),
                $.BizMod.Promise(this._getElevenValue).any(function (t) {
                    i._pollCas({
                        hotelId: e,
                        checkIn: n.checkIn,
                        checkOut: n.checkOut,
                        edm: n.EDM,
                        eleven: encodeURIComponent(t)
                    })
                })
        },
        _getHotelId: function () {
            return hotelDomesticConfig.hotel.id
        },
        _bindChangeTabEvent: function () {
            $("#J_RoomChange").bind("click", function (e) {
                var t = $(e.target);
                if (!t.hasClass("a_choosed") && loaded) {
                    loaded = !1;
                    var n = i._getHotelId();
                    $(this).find("a").removeClass("a_choosed"),
                        t.addClass("a_choosed"),
                        "compare" == t.attr("id") ? (i._hide($(".J_selectorContainer")),
                            i._show($("#J_CompareExtension")),
                        n && i._loadList(n, "")) : (i._hide($("#J_HotelCompare")),
                            i._hide($("#J_CompareExtension")),
                            i._show($(".J_selectorContainer")),
                            showRoomList(!0))
                }
            })
        },
        _bindExpandAllSupplierEvent: function () {
            $(".compare_showfold").bind("click", function () {
                var e = $(this)
                    , t = e.parentNode();
                t && (t.find(".compare_list_room.hidden").removeClass("hidden"),
                    t.find(".compare_other_room.unexpend.hidden").removeClass("hidden"),
                    e.addClass("hidden"))
            })
        },
        _bindExpandFacilityEvent: function () {
            $(".J_BaseRoomName").bind("click", function () {
                var e = $(this)
                    , t = e.attr("data-index")
                    , n = $("#J_Compare_Facility" + t);
                "f" == e.attr("open") ? (i._show(n),
                    i._show(e.find(".J_Facility_Fold")),
                    i._hide(e.find(".J_Facility_unFold")),
                    n.attr("open", "t"),
                    e.attr("open", "t")) : (i._hide(n),
                    i._hide(e.find(".J_Facility_Fold")),
                    i._show(e.find(".J_Facility_unFold")),
                    n.attr("open", ""),
                    e.attr("open", "f"))
            })
        },
        _bindExpandAllFacilityEvent: function () {
            $(".J_ExpandAllFacility").bind("click", function (e) {
                var t = $(this)
                    , n = (e.target,
                    t.parentNode());
                t.hasClass("open") ? (i._show(t.find(".J_Close")),
                    i._hide(t.find(".J_Open")),
                    i._show(n.find(".J_PartsFacility")),
                    i._hide(n.find(".J_AllFacility")),
                    t.removeClass("open")) : (i._hide(t.find(".J_Close")),
                    i._show(t.find(".J_Open")),
                    i._hide(n.find(".J_PartsFacility")),
                    i._show(n.find(".J_AllFacility")),
                    t.addClass("open"))
            })
        },
        _bindChanagePicEvent: function () {
            $(".J_BaseRoomPic").bind("click", function (e) {
                var t = $(e.target)
                    , n = $(this).find(".facility_pic_main ul")
                    , o = n.css("left")
                    , a = n.find("li").length
                    , d = $(this).find(".btn_prev")
                    , r = $(this).find(".btn_next")
                    , c = $(this).find(".pic_page");
                if (o = parseInt(o),
                "SPAN" == t[0].tagName.toUpperCase() || "I" == t[0].tagName.toUpperCase()) {
                    "I" == t[0].tagName.toUpperCase() && (t = t.parentNode());
                    var l = n.attr("pageIndex");
                    l || (l = 0),
                        t.hasClass("btn_prev") ? (l--,
                            o += 300) : t.hasClass("btn_next") && (l++,
                            o -= 300),
                        i._show(d),
                        i._show(r),
                        l <= 0 ? i._hide(d) : l >= a - 1 && i._hide(r),
                        c.html(l + 1 + "/" + a),
                        n.css("left", o + "px"),
                        n.attr("pageIndex", l)
                }
            })
        },
        _getCompareParams: function () {
            return {
                type: 0,
                hotelList: i._getHotelId(),
                checkIn: $("#checkIn").value(),
                checkOut: $("#checkOut").value()
            }
        },
        _bindChangeAllRoomEvent: function () {
            $(".J_BtnExpendPrice").bind("click", function (e) {
                var t = $(e.target)
                    , n = $(this)
                    , o = n.find(".btn_fold")
                    , a = n.find(".btn_unfold")
                    , d = n.attr("data-index")
                    , r = $("#J_Compare_RoomList" + d)
                    , c = $("#J_Compare_Facility" + d);
                if ("SPAN" == t[0].tagName.toUpperCase() || "I" == t[0].tagName.toUpperCase()) {
                    "I" == t[0].tagName.toUpperCase() && (t = t.parentNode());
                    var l = n.parentNode()
                        , _ = l.find(".J_Facility_Fold")
                        , s = l.find(".J_Facility_unFold");
                    t.hasClass("btn_unfold") ? (i._hide(t),
                        i._show(s),
                        i._hide(_),
                        i._hide(c),
                        i._hide(r),
                        i._show(o)) : (i._hide(t),
                    c.attr("open") && "t" == c.attr("open") && (i._show(c),
                        i._hide(s),
                        i._show(_)),
                        i._show(r),
                        i._show(a)),
                        $(".compare_room").each(function (e) {
                            if (e && e.attr("data-index") == d) {
                                var t = e.attr("data-tracekey")
                                    , n = e.attr("data-tracevalue");
                                return i._sendTrack(t, n),
                                    !1
                            }
                        })
                }
            })
        },
        _bindExpandSingleRoomEvent: function () {
            $(".J_SupplierExpend").bind("click", function (e) {
                var t = $(this)
                    , n = t.attr("id");
                i._show($(".supplier_" + n)),
                    i._hide(t),
                    t.removeClass("unexpend")
            })
        },
        _bindOrderEvent: function () {
            $(".J_makeOrder").bind("click", function () {
                var e = $(this)
                    , t = e.attr("data-tracekey")
                    , n = e.attr("data-tracevalue");
                i._getFormOptions();
                i._sendTrack(t, n)
            })
        },
        _hide: function (e) {
            e.hasClass("hidden") || e.addClass("hidden")
        },
        _show: function (e) {
            e.removeClass("hidden")
        },
        makeOrder: function (e, t) {
            var n = "T" === $(e).attr("data-checkAuth")
                , o = "T" === $("#J_hasLogin4ComparePrice").value();
            n && !o && ((t = t || window.event) && (t.returnValue = !1,
            t.preventDefault && t.preventDefault()),
                window.__SSO_booking(e.id, 1))
        },
        callSuccessAuthStatus: function (e) {
            var t = $("#" + e);
            t.length > 0 && t.trigger("click"),
                $("#J_hasLogin4ComparePrice").value("T")
        },
        _sendUBT: function () {
            var e = this;
            window.__bfi.push(["_asynRefresh", {
                page_id: e.config.POPUI_PAGE_ID,
                url: e.config.POPUI_URL_TMPL.replace("{$0}", e.hotelId),
                refer: e.config.ORIGINAL_URL
            }])
        },
        _sendTrackLog: function () {
            var e = $("#J_compareBtnTraceKey").value() || "htl.searchbtn.pri"
                , t = $("#J_compareBtnTraceValue").value();
            e && t && window.__bfi.push(["_tracklog", e, t])
        },
        _sendTrack: function (e, t) {
            e && t && window.__bfi.push(["_tracklog", e, t])
        },
        _updateCurrentHotelId: function (e) {
            this.hotelId = e
        },
        _getFormOptions: function () {
            return {
                checkIn: $("#checkIn").value(),
                checkOut: $("#checkOut").value(),
                EDM: $("#J_edm").value(),
                pageType: $("#pagetype").value(),
                useFPGP: $("#useFPGP").value()
            }
        },
        _pollCas: function (e, t) {
            "function" !== $.type(t) && (t = function () {
                }
            ),
            window.EXPRESSION && EXPRESSION.poll("/domestic/cas/nevermore/RemoteCall", null, "POST", hotelDomesticConfig.cas.NeverMore, t, null, e)
        },
        _getElevenValue: function (e) {
            function t(e) {
                for (var t = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], n = "", o = 0; o < e; o++) {
                    var a = Math.ceil(25 * Math.random());
                    n += t[a]
                }
                return n
            }

            var n, o = t(7), a = !1;
            if (!hotelDomesticConfig.cas.OceanBall)
                return e.resolve("");
            for (; window[o];)
                o = t(15);
            n = hotelDomesticConfig.cas.OceanBallUrl + "?callback=" + o + "&_=" + (new Date).getTime(),
                window[o] = function (t) {
                    window[o] = void 0;
                    var n = "";
                    try {
                        n = t()
                    } catch (i) {
                        $.ajax("/domestic/cas/image/bi", {
                            method: $.AJAX_METHOD_POST,
                            cache: !1,
                            context: {
                                value: "11-" + encodeURIComponent(i.stack || i)
                            }
                        })
                    } finally {
                        a = !0,
                            e.resolve(n)
                    }
                }
                ,
                $.loader.js(n, {
                    onload: function () {
                        a || (window[o] = void 0,
                            e.reject(""))
                    },
                    onerror: function (t) {
                        t && (window[o] = void 0),
                            e.reject("")
                    }
                })
        },
        check: function () {
            if ("undefined" != typeof useNewCompare && useNewCompare) {
                i._getCompareParams()
            }
        }
    };
    "undefined" != typeof useNewCompare && useNewCompare && (d.init(),
        d.check()),
        e.makeOrderPriceCompare = t,
        e.callSuccessAuthStatus = o,
        e.callLoadCompareRoomList = a,
        e.getHasCompareParams = n
}(window.App = window.App || {});
!function () {
    var t = ['<div class="htl_room_table">', '<table border="0" cellspacing="0" cellpadding="0" summary="详情页酒店房型列表">', "<tbody>", "<tr>", '<th class="col1">房型</th>', '<th class="col2"></th>', '<th class="col3">床型</th>', '<th class="col4">宽带</th>', '<th class="col5">早餐</th>', '<th class="col_policy">政策</th>', '<th class="col6">', '<span class="room_preis">房价（含服务费）</span>', "</th>", '<th class="col7"></th>', "</tr>", "{{each data}}", "<tr>", '<td class="room_type">', '<a class="pic" href="${ProductUrl}">', '<img src="${ImageUrl}" _src="${ImageUrl}"></a>', '<a class="room_unfold" title="${ProductName}" href="${ProductUrl}">', "${ProductName}", "<br></a>", "</td>", '<td class="child_name">', '<span class="label_onsale_red" title="团购产品，购买后请电话酒店预约入住时间">团购券</span>', "</td>", '<td class="col3">${BedType}</td>', '<td class="col4">', "<span class=\"b_none\" data-role=\"jmp\" class=\"net_free\" data-params=\"{'options':{'type':'jmp_table','template':'#jmpTempNet','content':{'txt':'${NetworkInfoDescription}'},'classNames':{'boxType':'jmp_table'},'css':{'maxWidth':500},'group':'net'}}\">${NetworkInfo}</span>", "</td>", '<td class="col5">', "<span>${BreakfastType}</span>", "</td>", '<td class="col_policy">', "<span class=\"room_policy\" data-role=\"jmp\" data-params=\"{'options':{'type':'jmp_table','template':'#jmpTempCacnel','content':{'txt':'团购支持未消费退款、过期返还、不满意免单。'},'classNames':{'boxType':'jmp_table'},'css':{'maxWidth':500},'group':'cashback'}}\">免费取消</span>", "</td>", "<td>", '<span class="base_price"> <dfn>¥</dfn>', "${ShownPrice}", "</span>", '{{if MarketPrice!="0"}}', '<span class="base_txtdiv">', '<span class="j">', "-${MarketPrice}", "</span>", "</span>", "{{/if}}", "</td>", '<td class="col7">', '<a href="${ProductUrl}" target="_blank" class="btn_buy group_btn_buy J_TuanBtn" ctripid="${CtripId}" productid="${ProductId}">抢购</a>', '<span class="icon_prepay" title="需预先支付房款"> </span>', "</td>", "</tr>", "{{/each}}", "</tbody>", "</table>", "</div>"].join("")
        ,
        a = ['<table width="100%" cellspacing="0" cellpadding="0" border="0" class="hotel_datelist ">', "<thead>", "<tr>", '<th style="padding-left: 23px;" class="th_room">房型</th>', '<th style="width: 40px;">床型</th>', '<th style="width: 40px;">早餐</th>', '<th style="width: 42px;">宽带</th>', '<th style="width: 50px;" class="th_policy">政策</th>', '<th style="width: 90px;" class="text_right">', '<div class="price_th">', "房价", '<span class="price_tips">(含服务费)</span>', "</div>", "</th>", '<th style="width: 95px;"></th>', '<th style="width: 70px;"></th>', '<th style="width: 25px;"></th>', "</tr>", "</thead>", "<tbody>", "{{each(i,r) data}}", "{{if i<3}}", "<tr>", "{{else}}", '<tr data-type="hidden" style="display:none;">', "{{/if}}", '<td class="hotel_room">', '<a class="hotel_roompic" href="${ProductUrl}" target="_blank">&nbsp;</a>', '<a class="hotel_room_name" href="${ProductUrl}" target="_blank" title="${ProductName}">${ProductName}</a>', '<span class="label_onsale_red" title="团购产品，购买后请电话酒店预约入住时间">团购券</span>', "</td>", "<td>", "<span>${BedType}</span>", "</td>", "<td>${BreakfastType}</td>", "<td>", "<span>${NetworkInfo}</span>", "</td>", "<td>", "<span class=\"room_policy\" mod_jmpinfo_page=\"hotels_icon_tips\" data-role=\"jmp\" data-params=\"{'options':{'type':'jmp_table','template':'#jmpTempCacnel','content':{'txt':'团购支持未消费退款、过期返还、不满意免单。'},'classNames':{'boxType':'jmp_table'},'css':{'maxWidth':500},'group':'cashback'}}\" mod=\"jmpInfo\">免费取消</span>", "</td>", '<td class="htl_price_td text_right">', '<span class="base_txtdiv"> <dfn>¥</dfn>', "${ShownPrice}", "</span>", "</td>", "<td>", "</td>", "<td>", '<a href="${ProductUrl}" target="_blank" class="btn_buy group_btn_buy J_TuanBtn" ctripid="${CtripId}" productid="${ProductId}">抢购</a>', '<span class="icon_prepay" title="需预先支付房款"> </span>', "</td>", "</tr>", "{{/each}}", "</tbody>", "</table>", "{{if data.length>3}}", '<p class="searchresult_toggle"> <a class="show_unfold float_right" onclick="" href="javascript:void(0);">展开全部房型</a></p>', "{{/if}}"].join("")
        , e = function (a, e) {
            var s = $.tmpl.render(t, {
                data: a
            });
            e = (e || $("#hotelRoomBox")).html(s),
                l(e, "htl_detail_tuanrush")
        }
        , s = function (t, e, s) {
            var o = $.tmpl.render(a, {
                data: t
            });
            e.html(o),
            s && s.append(e),
                e.find("a.show_unfold").bind("click", function (t) {
                    var a = e.find('tr[data-type="hidden"]');
                    $(this).hasClass("show_unfold") ? (a.removeAttr("style"),
                        $(this).removeClass("show_unfold").addClass("show_fold").text("收起房型")) : (a.hide(),
                        $(this).addClass("show_unfold").removeClass("show_fold").text("展开全部房型"))
                }),
                l(e, "htl_list_tuanrush")
        };
    $.ready(function () {
        var t = $("#GHI_changeBtn");
        if (0 !== t.length) {
            var a = '<div class="room_list_loading">给力加载中，请稍候......</div>';
            t.bind("click", function () {
                $("#hotelRoomBox").html(a),
                    $.ajax([addressUrlConfig.AjaxGHIGroupProduct, "&startDate=", $("#cc_txtCheckIn").value(), "&endDate=", $("#cc_txtCheckOut").value(), "&_=", +new Date].join(""), {
                        cache: !1,
                        onsuccess: function (t) {
                            var a = t.responseText && $.parseJSON(t.responseText);
                            e(a)
                        }
                    })
            }),
                t.trigger("click"),
                $("#hotelRoomBox").html(a);
            var s = null
                , o = "";
            $("#hotelRoomBox, #commentList").bind("mouseover", function (t) {
                t = t || window.event;
                var a = t.target || t.srcElement;
                if (s && clearTimeout(s),
                "IMG" == a.nodeName) {
                    var e = a.getAttribute("_src");
                    if (!e)
                        return;
                    o != e && (popRoomPic.getElementsByTagName("img")[0].src = e,
                        o = e),
                        s = setTimeout(function () {
                            popRoomPic.style.display = "",
                            o && (popRoomPic.style.left = parseInt($(a).offset().left) + parseInt($(a).offset().width) + 3 + "px",
                                popRoomPic.style.top = parseInt($(a).offset().top) + "px")
                        }, 500)
                }
            }).bind("mouseout", function (t) {
                t = t || window.event;
                var a = t.target || t.srcElement;
                "IMG" == a.nodeName && (o = "",
                    popRoomPic.style.display = "none",
                    popRoomPic.style.top = "-1000px",
                    popRoomPic.getElementsByTagName("img")[0].src = "//pic.c-ctrip.com/common/pic_alpha.gif")
            })
        }
    }),
        window.Domestic = window.Domestic || {},
        window.Domestic.Group = window.Domestic.Group || {};
    var o = function (t, a) {
        var e = $(t).attr("ctripid")
            , s = $(t).attr("productid")
            , o = $("#cc_txtCheckIn").value() || $("#txtCheckIn").value()
            , l = $("#cc_txtCheckOut").value() || $("#txtCheckOut").value();
        window.__bfi.push(["_tracklog", a, $.stringifyJSON({
            hotelid: e,
            productid: s,
            checkin: o,
            checkout: l
        })])
    }
        , l = function (t, a) {
        t.find(".btn_buy").bind("click", function () {
            o($(this), a)
        })
    };
    $.extend(window.Domestic.Group, {
        renderGHIRooms: e,
        renderGHIRoomHotelList: s
    }),
        $.ready(function () {
            $('script[type="text/x-cquery-template-data"]').each(function (t) {
                var a = $(t).attr("container-id")
                    , e = $.parseJSON($(t).html())
                    , s = document.createElement("div");
                s = $(s),
                    window.Domestic.Group.renderGHIRoomHotelList(e, s, $("#" + a))
            })
        })
}();
