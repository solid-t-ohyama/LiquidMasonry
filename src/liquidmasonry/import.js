(() => {
    "use strict";
    var LiquidMasonry = function() {
        function LiquidMasonry(options) {
            var _this = this;
            this.defaults = {
                containerSelector: ".masonry",
                itemSelector: ".items",
                brakePoints: [],
                brakeTargetSelector: "window",
                gapMin: 10,
                gapMax: 30,
                initialStyle: true,
                debug: false
            };
            this.cardSetting = null;
            this.breakWidth = 0;
            this.containerWidth = 0;
            this.cardWidths = [];
            this.grid = 0;
            this.gapV = 0;
            this.gapH = 0;
            this.debug = false;
            this.options = Object.assign(this.defaults, options);
            this.container = document.querySelector(this.options.containerSelector);
            if (!this.container) throw new Error("container is not found");
            this.items = document.querySelectorAll(this.options.itemSelector);
            if (this.options.brakeTargetSelector === "window") {
                this.brakeTarget = window;
            } else {
                this.brakeTarget = document.querySelector(this.options.brakeTargetSelector);
            }
            if (!this.brakeTarget) this.brakeTarget = window;
            this.debug = this.options.debug;
            this.sortBrakePoints();
            this.init();
            this.display();
            document.addEventListener("DOMContentLoaded", (function(event) {
                _this.update();
            }));
            this.monitorImageLoad();
            this.monitorItemResize();
            this.container.classList.add("masonry-initialized");
        }
        LiquidMasonry.prototype.init = function() {
            this.setContainerWidth();
            this.setBrakePointSettings();
            this.setCardSizes();
        };
        LiquidMasonry.prototype.update = function() {
            this.setContainerWidth();
            this.setBrakePointSettings();
            this.setCardSizes();
            this.display();
        };
        LiquidMasonry.prototype.monitorImageLoad = function() {
            var _this = this;
            var images = this.container.getElementsByTagName("img");
            for (var i = 0; i < images.length; i++) {
                var img = images[i];
                if (img.complete) {
                    this.update();
                } else {
                    img.addEventListener("load", (function(event) {
                        _this.update();
                    }));
                }
            }
        };
        LiquidMasonry.prototype.monitorItemResize = function() {
            var _this = this;
            var resizeObserver = new ResizeObserver((function(entries) {
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var entry = entries_1[_i];
                    if (_this.debug) console.log("resize", entry.target);
                }
                _this.update();
            }));
            resizeObserver.observe(this.container);
            this.items.forEach((function(item, index) {
                resizeObserver.observe(item);
            }));
        };
        LiquidMasonry.prototype.sortBrakePoints = function() {
            this.options.brakePoints.sort((function(a, b) {
                if (a.brakePoint < b.brakePoint) return -1;
                if (a.brakePoint > b.brakePoint) return 1;
                return 0;
            }));
            if (this.debug) console.log("brakePoints", this.options.brakePoints);
        };
        LiquidMasonry.prototype.setContainerWidth = function() {
            this.containerWidth = this.container.clientWidth;
            if (this.debug) console.log("containerWidth", this.containerWidth);
        };
        LiquidMasonry.prototype.setBrakeWidth = function() {
            if (this.brakeTarget instanceof Window) {
                this.breakWidth = window.innerWidth;
            } else {
                this.breakWidth = this.brakeTarget.clientWidth;
            }
            if (this.debug) console.log("breakWidth", this.containerWidth);
        };
        LiquidMasonry.prototype.setBrakePointSettings = function() {
            var _this = this;
            this.setBrakeWidth();
            var match = false;
            this.options.brakePoints.forEach((function(setting, index) {
                if (_this.debug) console.log("cardSetting check", [ _this.breakWidth, setting.brakePoint ]);
                if (_this.breakWidth > setting.brakePoint) {
                    _this.cardSetting = setting;
                    match = true;
                    return;
                }
            }));
            if (!match) this.cardSetting = null;
            if (this.debug) console.log("cardSetting", this.cardSetting);
        };
        LiquidMasonry.prototype.setCardSizes = function() {
            var _a, _b, _c;
            if (this.cardSetting === null) {
                this.grid = 0;
                this.gapV = 0;
                this.gapH = 0;
                return;
            }
            var gapRatioX = (_a = this.cardSetting.gapRatioX) !== null && _a !== void 0 ? _a : .01;
            var gapRatioY = (_b = this.cardSetting.gapRatioY) !== null && _b !== void 0 ? _b : .01;
            var gridWidth = 0;
            if (typeof this.cardSetting.grid === "object") {
                var setting = this.cardSetting.grid;
                var result = this.calculateMasonryLayout(setting.itemMinWidth, setting.itemMaxWidth, gapRatioX, this.options.gapMin, this.options.gapMax);
                if (result === null) {
                    this.cardSetting = null;
                    return;
                }
                this.grid = result.grid;
                this.gapH = result.margin;
                gridWidth = result.itemWidth;
            } else {
                this.grid = (_c = this.cardSetting.grid) !== null && _c !== void 0 ? _c : 1;
                this.gapH = this.breakWidth * gapRatioY;
                this.gapH = Math.min(Math.max(this.gapH, this.options.gapMin), this.options.gapMax);
                gridWidth = (this.containerWidth - this.gapH * (this.grid - 1)) / this.grid;
            }
            this.gapV = this.breakWidth * gapRatioX;
            this.gapV = Math.min(Math.max(this.gapV, this.options.gapMin), this.options.gapMax);
            this.cardWidths = [];
            for (var i = 0; i < this.grid; i++) {
                var width = gridWidth * (i + 1) + this.gapH * i;
                this.cardWidths.push(width);
            }
            if (this.debug) console.log("gap", {
                x: this.gapH,
                y: this.gapV
            });
            if (this.debug) console.log("cardWidths", this.cardWidths);
        };
        LiquidMasonry.prototype.display = function() {
            var _this = this;
            var _a;
            if (this.cardSetting === null) {
                this.resetStyle();
                return;
            }
            this.initialStyle();
            var grid = this.grid;
            var rowWidth = (_a = this.cardWidths[0]) !== null && _a !== void 0 ? _a : 0;
            var colHeights = Array(grid).fill(0);
            this.items.forEach((function(item, index) {
                var colWidth = item.dataset.colWidth ? Number(item.dataset.colWidth) : 1;
                if (colWidth > grid) colWidth = grid;
                if (colWidth <= 0) colWidth = 1;
                item.style.width = _this.cardWidths[colWidth - 1] + "px";
            }));
            this.items.forEach((function(item, index) {
                if (_this.cardSetting === null) return;
                var colWidth = item.dataset.colWidth ? Number(item.dataset.colWidth) : 1;
                if (colWidth > grid) colWidth = grid;
                if (colWidth <= 0) colWidth = 1;
                var _a = _this.getMultiMinIndex(colHeights, colWidth), col = _a[0], posY = _a[1];
                var posX = (rowWidth + _this.gapH) * col;
                item.style.left = posX + "px";
                item.style.top = posY + "px";
                for (var i = 0; i < colWidth; i++) {
                    colHeights[col + i] = posY + item.clientHeight + _this.gapV;
                }
            }));
            this.container.style.height = Math.max.apply(Math, colHeights) + "px";
        };
        LiquidMasonry.prototype.initialStyle = function() {
            if (!this.options.initialStyle) return;
            this.container.style.position = "relative";
            this.items.forEach((function(item, index) {
                item.style.position = "absolute";
            }));
        };
        LiquidMasonry.prototype.resetStyle = function() {
            var _this = this;
            this.container.style.height = "";
            if (this.options.initialStyle) {
                this.container.style.position = "";
            }
            this.items.forEach((function(item, index) {
                _this.cardReset(item);
                if (_this.options.initialStyle) {
                    item.style.position = "";
                }
            }));
        };
        LiquidMasonry.prototype.cardReset = function(item) {
            item.style.width = "";
            item.style.left = "";
            item.style.top = "";
        };
        LiquidMasonry.prototype.getMultiMinIndex = function(columns, span) {
            var minIndex = 0;
            var minHeight = Math.max.apply(Math, columns.slice(0, span));
            for (var i = 1; i <= columns.length - span; i++) {
                var currentSpanHeight = Math.max.apply(Math, columns.slice(i, i + span));
                if (currentSpanHeight < minHeight) {
                    minIndex = i;
                    minHeight = currentSpanHeight;
                }
            }
            return [ minIndex, minHeight ];
        };
        LiquidMasonry.prototype.calculateMasonryLayout = function(itemMinWidth, itemMaxWidth, marginRatio, marginMin, marginMax) {
            if (this.containerWidth < itemMinWidth) itemMinWidth = this.containerWidth;
            if (this.containerWidth < 1) return null;
            var grid = Math.floor(this.containerWidth / itemMinWidth);
            if (grid < 1) grid = 1;
            var margin = this.containerWidth * marginRatio;
            margin = Math.min(Math.max(margin, marginMin), marginMax);
            var itemWidth = (this.containerWidth - margin * (grid - 1)) / grid;
            while (itemWidth > itemMaxWidth && grid < this.containerWidth / itemMinWidth) {
                grid++;
                itemWidth = (this.containerWidth - margin * (grid - 1)) / grid;
            }
            while (itemWidth < itemMinWidth && grid > 1) {
                grid--;
                itemWidth = (this.containerWidth - margin * (grid - 1)) / grid;
            }
            if (itemWidth > itemMaxWidth) {
                itemWidth = itemMaxWidth;
            } else if (itemWidth < itemMinWidth) {
                itemWidth = itemMinWidth;
            }
            if (itemWidth * grid + margin * (grid - 1) < this.containerWidth) {
                margin = (this.containerWidth - itemWidth * grid) / (grid - 1);
            }
            if (this.debug) console.log("calculateMasonryLayout", {
                grid,
                itemWidth,
                margin
            });
            return {
                grid,
                itemWidth,
                margin
            };
        };
        return LiquidMasonry;
    }();
    const liquidMasonry = LiquidMasonry;
    document.addEventListener("DOMContentLoaded", (function() {
        window.LiquidMasonry = liquidMasonry;
    }));
})();