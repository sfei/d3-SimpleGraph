import * as __WEBPACK_EXTERNAL_MODULE_d3__ from "d3";
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ simple_graph)
});

;// CONCATENATED MODULE: external "d3"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_d3_namespaceObject = __WEBPACK_EXTERNAL_MODULE_d3__;
;// CONCATENATED MODULE: ./src/checkscale.js
const TEST_DOMAIN        = [new Date("2000-01-01"), new Date("2000-01-02")], 
      TEST_DOMAIN_TIME_0 = TEST_DOMAIN[0].getTime();

/* harmony default export */ function checkscale(scale) {
    let checkScale   = scale(TEST_DOMAIN), 
        checkDomain  = checkScale.domain(), 
        isSequential = !!checkScale.interpolator;  // various version can be sequential
    // scaleOrdinal and odd-balls
    if(!checkDomain.length) {
        if(checkScale.quantiles) return {isQuantile: true, isSequential: isSequential};
        if(checkScale.step) {
            return {
                isBand: true, 
                isPoint: !checkScale.paddingInner
            };
        }
        return {isOrdinal: true};
    }
    if(checkDomain.length === 1) return {isThreshold: true};
    // time scales
    if(checkDomain[0] instanceof Date) {
        return {
            isTime: true, 
            isUTC: checkDomain[0].getTime() === TEST_DOMAIN_TIME_0
        };
    }
    let isDiverging  = checkDomain.length === 3;  // various version can be diverging
    // log and pow scales
    if(checkScale.base) {
        return {
            isPow: true, 
            isSequential: isSequential, 
            isDiverging: isDiverging
        };
    }
    if(checkScale.exponent) {
        return {
            isPow: true,
            isSqrt: checkScale.exponent() == 0.5, 
            isSequential: isSequential, 
            isDiverging: isDiverging
        };
    }
    if(checkScale.constant) {
        return {
            isSymlog: true, 
            isSequential: isSequential, 
            isDiverging: isDiverging
        };
    }
    // scaleQuantize
    if(checkScale.thresholds) return {isQuantize: true};
    // scaleLinear
    return {
        isLinear: true, 
        isSequential: isSequential, 
        isDiverging: isDiverging
    };
};
;// CONCATENATED MODULE: ./src/sg.axis.js



/* harmony default export */ function sg_axis(SimpleGraph, d3) {

    SimpleGraph.prototype.resetAxisOptions = function(axisOptions) {
        axisOptions       = axisOptions || {};
        axisOptions.x     = axisOptions.x || {};
        axisOptions.y     = axisOptions.y || {};
        axisOptions.style = axisOptions.styles || {};
        
        // default axis styles
        this.axisStyles                 = axisOptions.style;
        this.axisStyles                 = this.axisStyles || {};
        this.axisStyles.fill            = this.axisStyles.fill || "none";
        this.axisStyles["stroke-width"] = this.axisStyles["stroke-width"] || 0.5;
        this.axisStyles.stroke          = this.axisStyles.stroke || "black";
        
        // loop per axis to remove redundancies
        ["x", "y", "y2"].forEach(a => {
            // specific axis options
            if(!axisOptions[a]) {
                // if no second y-axis, just skip
                if(a === "y2") return;
                axisOptions[a] = {};
            }
            axisOptions[a].scale = axisOptions[a].scale || d3.scaleLinear;
            let theScale = checkscale(axisOptions[a].scale);
            if(!theScale.isTime && !theScale.isLog && !theScale.isLinear) {
                // possibly unsupported scales? TODO: handle
            }
            if(!axisOptions[a].format) {
                axisOptions[a].format = theScale.isTime ? "%Y-%m-%d" : ".0f";
            }
            axisOptions[a].grid = axisOptions[a].grid || {};
            if(theScale.isLog) axisOptions[a].logBase = axisOptions[a].logBase || 10;
            
            this[a] = {
                label:  (axisOptions[a].label === null) ? (a === "x" ? "x-value" : "y-value") : axisOptions[a].label, 
                isDate: theScale.isTime, 
                isLog:  theScale.isLog
            };
            if(theScale.isTime) {
                if(theScale.isUTC) {
                    this[a].format = d3.utcFormat(axisOptions[a].format);
                } else {
                    this[a].format = d3.timeFormat(axisOptions[a].format);
                }
            } else {
                this[a].format = d3.format(axisOptions[a].format);
            }
            
            this[a].min = axisOptions[a].min ? axisOptions[a].min : 0;
            this[a].max = axisOptions[a].max ? axisOptions[a].max : 100;
            
            // create scale
            this[a].scale = axisOptions[a].scale();
            theScale.isLog && this[a].scale.base(axisOptions[a].logBase);
            let domain, range;
            if(axisOptions[a].break) {
                this[a].break = axisOptions[a].break;
                domain = [
                    this[a].min, 
                    this[a].break.domain[0], 
                    this[a].break.domain[1], 
                    this[a].max
                ];
                let domain2 = !theScale.isTime ? domain : domain.map(x => x.getTime()), 
                    span = a === "x" ? this.width : this.height;
                range = a === "x" ? [0, 0, 0, span] : [span, 0, 0, 0];
                let validspan = span - this[a].break.rangegap, 
                    rangePerDomain = validspan / (domain2[1] - domain2[0] + domain2[3] - domain2[2]);
                range[1] = rangePerDomain*(domain2[1] - domain2[0]);
                range[2] = range[1] + this[a].break.rangegap;
            } else {
                domain = [this[a].min, this[a].max];
                range = a === "x" ? [0, this.width] : [this.height, 0];
            }
            this[a].scale.domain(domain).range(range);
        
            // create axes
            let applySecondAxes = false;
            if(a === "x") {
                // create both versions of the axes as we need to apply tick formatting to both here
                applySecondAxes = true;
                this[a].axis = d3.axisBottom(this[a].scale);
                this[a].axisTwo = d3.axisTop(this[a].scale);
                this[a].gridAxis = d3.axisBottom(this[a].scale);
            } else if(a === "y2") {
                this[a].axis = d3.axisRight(this[a].scale);
                this[a].gridAxis = d3.axisRight(this[a].scale);
            } else {
                this[a].axis = d3.axisLeft(this[a].scale);
                this[a].gridAxis = d3.axisLeft(this[a].scale);
            }
            
            // log scale handles ticks differently
            if(theScale.isLog) {
                this[a].axis.tickFormat(this[a].format);
                if(axisOptions[a].ticks) {
                    this[a].axis.ticks(axisOptions[a].ticks, this[a].format);
                } else {
                    this[a].axis.ticks(this[a].format);
                    if(axisOptions[a].tickValues) {
                        this[a].axis.tickValues(axisOptions[a].tickValues);
                    }
                }
                // repeat on second axis if needed
                if(applySecondAxes) {
                    this[a].axisTwo.tickFormat(this[a].format);
                    if(axisOptions[a].ticks) {
                        this[a].axisTwo.ticks(axisOptions[a].ticks, this[a].format);
                    } else {
                        this[a].axisTwo.ticks(this[a].format);
                        if(axisOptions[a].tickValues) {
                            this[a].axisTwo.tickValues(axisOptions[a].tickValues);
                        }
                    }
                }
            } else {
                // add ticks
                this[a].axis.tickFormat(this[a].format);
                if(axisOptions[a].tickValues) {
                    this[a].axis.tickValues(axisOptions[a].tickValues);
                    this[a].gridAxis.tickValues(axisOptions[a].tickValues);
                } else if(axisOptions[a].ticks || axisOptions[a].ticks === 0) {
                    if(Array.isArray(axisOptions[a].ticks)) {
                        this[a].axis.ticks(axisOptions[a].ticks[0], axisOptions[a].ticks[1]);
                        this[a].gridAxis.ticks(axisOptions[a].ticks[0], axisOptions[a].ticks[1]);
                    } else {
                        this[a].axis.ticks(axisOptions[a].ticks);
                        this[a].gridAxis.ticks(axisOptions[a].ticks);
                    }
                }
                // add sub-grid-ticks
                this[a].gridAxis.tickFormat(this[a].format);
                if(axisOptions[a].grid.tickValues) {
                    this[a].gridAxis.tickValues(axisOptions[a].grid.tickValues);
                } else if(axisOptions[a].grid.ticks || axisOptions[a].grid.ticks === 0) {
                    if(Array.isArray(axisOptions[a].grid.ticks)) {
                        this[a].gridAxis.ticks(axisOptions[a].grid.ticks[0], axisOptions[a].grid.ticks[1]);
                    } else {
                        this[a].gridAxis.ticks(axisOptions[a].grid.ticks);
                    }
                }
                // repeat on second axis if needed
                if(applySecondAxes) {
                    this[a].axisTwo.tickFormat(this[a].format);
                    if(axisOptions[a].tickValues) {
                        this[a].axisTwo.tickValues(axisOptions[a].tickValues);
                    } else if(axisOptions[a].ticks || axisOptions[a].ticks === 0) {
                        if(Array.isArray(axisOptions[a].ticks)) {
                            this[a].axisTwo.ticks(axisOptions[a].ticks[0], axisOptions[a].ticks[1]);
                        } else {
                            this[a].axisTwo.ticks(axisOptions[a].ticks);
                        }
                    }
                }
            }
        });
        
        // for backwards compatibility
        this.minMax = {
            x: [this.x.min, this.x.max],
            y: [this.y.min, this.y.max]
        };
        this.xScale = this.x.scale;
        this.xAxis = this.x.axis;
        this.xGridAxis = this.x.gridAxes;
        this.yScale = this.y.scale;
        this.yAxis = this.y.axis;
        this.yGridAxis = this.y.gridAxes;
        
        // draw axes but also clear any drawn lines/points/areas as they'd now be off
        this.removeAll();
        this.drawAxes();
        
        return this;
    };

    SimpleGraph.prototype.drawAxes = function(labelPosition, xAxisPosition, axisLabelMargin) {
        if(!xAxisPosition) { 
            xAxisPosition = "bottom"; 
        } else {
            xAxisPosition = xAxisPosition.toLowerCase().trim();
            if(xAxisPosition !== "top") { xAxisPosition = "bottom"; }
        }
        let xAxis, 
            xAxisPosY = 0;
        if(xAxisPosition !== "top") {
            xAxis = this.x.axis;
            xAxisPosY = this.height;
        } else {
            xAxis = this.x.axisTwo;
        }
        if(!axisLabelMargin) { axisLabelMargin = 0; }
        
        // draw axes first without labels
        this.svg.selectAll(".sg-xaxis, .sg-yaxis, .sg-y2axis, .sg-axis-label").remove();
        let xAxisG = this.svgGraph.append("g")
                .attr("class", "sg-xaxis")
                .attr("transform", "translate(0," + xAxisPosY + ")")
                .call(xAxis)
                // annoyingly d3 adds these after axis call so remove so they don't override svg style
                .attr("font-size", null)
                .attr("font-family", null), 
            yAxisG = this.svgGraph.append("g")
                .attr("class", "sg-yaxis")
                .call(this.y.axis)
                .attr("font-size", null)
                .attr("font-family", null), 
            y2AxisG = !this.y2 ? null : this.svgGraph.append("g")
                .attr("class", "sg-y2axis")
                .attr("transform", "translate(" + this.width + ",0)")
                .call(this.y2.axis)
                .attr("font-size", null)
                .attr("font-family", null);
        // for some reason ticks are by default invisible
        this.svgGraph.selectAll(".tick line").style("stroke", "#000");
        // add styles
        let axes = this.svgGraph.selectAll(".sg-xaxis .domain, .sg-yaxis .domain, .sg-y2axis .domain");
        for(let style in this.axisStyles) {
            axes.style(style, this.axisStyles[style]);
        }
        
        // get size of ticks to know margin to place labels away if outside
        let tickMargin = { x: 0, y: 0, y2: 0 };
        this.svgGraph.selectAll(".sg-xaxis .tick").each(function() {
            if(this.getBBox().height > tickMargin.x) {
                tickMargin.x = this.getBBox().height;
            }
        });
        this.svgGraph.selectAll(".sg-yaxis .tick").each(function() {
            if(this.getBBox().width > tickMargin.y) {
                tickMargin.y = this.getBBox().width;
            }
        });
        this.svgGraph.selectAll(".sg-y2axis .tick").each(function() {
            if(this.getBBox().width > tickMargin.y2) {
                tickMargin.y2 = this.getBBox().width;
            }
        });
        
        // default position on center-outside
        let xLabelPos = {
                a: 'middle', 
                x: 0.5*this.width,
                y: (xAxisPosition === "top") ? -(tickMargin.x + axisLabelMargin) : (tickMargin.x + 10 + axisLabelMargin)
            }, 
            yLabelPos = {
                a: 'middle', 
                x: -0.5*this.height,
                y: -(tickMargin.y + 10 + axisLabelMargin)
            }, 
            y2LabelPos = {
                a: 'middle', 
                x: 0.5*this.height,
                y: -(tickMargin.y2 + 10 + axisLabelMargin)
            };
        // determine label position
        // split by keys
        let xparallel       = "center", 
            yparallel       = "center", 
            y2parallel      = "center", 
            xperpendicular  = "outside", 
            yperpendicular  = "outside", 
            y2perpendicular = "outside";
        if(labelPosition) {
            let lpKeys = (labelPosition || "").toLowerCase().split(/[ ,]+/);
            lpKeys.forEach(directive => {
                let parts = directive.trim().split("-"), 
                    axis = parts.length > 1 ? parts[0] : false;
                directive = parts.length > 1 ? parts[parts.length-1] : parts[0];
                switch(directive) {
                    case "outside":
                        if(!axis || axis === "x") {
                            xLabelPos.y =(xAxisPosition === "top") ? -(tickMargin.x + axisLabelMargin) : (tickMargin.x + 10 + axisLabelMargin);
                            xperpendicular = "outside";
                        }
                        if(!axis || axis === "y") {
                            yLabelPos.y = -(tickMargin.y + 10 + axisLabelMargin);
                            yperpendicular = "outside";
                        }
                        if(!axis || axis === "y2") {
                            y2LabelPos.y = -(tickMargin.y2 + 10 + axisLabelMargin);
                            y2perpendicular = "outside";
                        }
                        break;
                    case "inside":
                        if(!axis || axis === "x") {
                            xLabelPos.y = (xAxisPosition === "top") ? (14 + axisLabelMargin) : -(6 + axisLabelMargin);
                            xperpendicular = "inside";
                        }
                        if(!axis || axis === "y") {
                            yLabelPos.y = 5;
                            yperpendicular = "inside";
                        }
                        if(!axis || axis === "y2") {
                            y2LabelPos.y = 5;
                            y2perpendicular = "inside";
                        }
                    case "center":
                        if(!axis || axis === "x") {
                            xLabelPos.a = 'middle';
                            xLabelPos.x = 0.5*this.width;
                            xparallel = "center";
                        }
                        if(!axis || axis === "y") {
                            yLabelPos.a = 'middle';
                            yLabelPos.x = -0.5*this.height;
                            yparallel = "center";
                        }
                        if(!axis || axis === "y2") {
                            y2LabelPos.a = 'middle';
                            y2LabelPos.x = 0.5*this.height;
                            y2parallel = "center";
                        }
                        break;
                    case "left":
                        xLabelPos.a = 'start';
                        xLabelPos.x = 0;
                        xparallel = "left";
                        break;
                    case "right":
                        xLabelPos.a = 'end';
                        xLabelPos.x = this.width;
                        xparallel = "right";
                        break;
                    case "top":
                        if(!axis || axis === "y") {
                            yLabelPos.a = 'end';
                            yLabelPos.x = 0;
                            yparallel = "top";
                        }
                        if(!axis || axis === "y2") {
                            y2LabelPos.a = 'start';
                            y2LabelPos.x = 0;
                            y2parallel = "top";
                        }
                        break;
                    case "bottom":
                        if(!axis || axis === "y") {
                            yLabelPos.a = 'start';
                            yLabelPos.x = -this.height;
                            yparallel = "bottom";
                        }
                        if(!axis || axis === "y2") {
                            y2LabelPos.a = 'end';
                            y2LabelPos.x = this.height;
                            y2parallel = "bottom";
                        }
                        break;
                }
            });
            // if near axis crossing, needs some extra padding
            if(xperpendicular === "inside") {
                if(xparallel === "left") {
                    xLabelPos.x += 10;
                } else if(xparallel === "right" && this.y2) {
                    xLabelPos.x -= 10;
                }
                if(xAxisPosition === "bottom") {
                    if(xparallel === "left" && yperpendicular === "inside" && yparallel === "bottom") {
                        xLabelPos.x += 10;
                        yLabelPos.x += 10;
                    }
                    if(xparallel === "right" && this.y2 && y2perpendicular === "inside" && y2parallel === "bottom") {
                        xLabelPos.x -= 10;
                        y2LabelPos.x -= 10;
                    }
                } else {
                    if(xparallel === "left" && yperpendicular === "inside" && yparallel === "top") {
                        xLabelPos.x += 10;
                        yLabelPos.x -= 10;
                    }
                    if(xparallel === "right" && this.y2 && y2perpendicular === "inside" && y2parallel === "top") {
                        xLabelPos.x -= 10;
                        y2LabelPos.x += 10;
                    }
                }
            }
        }
        if(yperpendicular === "inside") {
            if(yparallel === "top") yLabelPos.x -= 5;
            if(yparallel === "bottom") yLabelPos.x += 5;
        }
        if(y2perpendicular === "inside") {
            if(y2parallel === "top") y2LabelPos.x += 5;
            if(y2parallel === "bottom") y2LLabelPos.x -= 5;
        }
        
        // add labels
        xAxisG.append("text")
            .attr("class", "sg-axis-label sg-xaxis")
            .attr("x", xLabelPos.x)
            .attr("y", xLabelPos.y)
            .attr("fill", "#000")
            .style("text-anchor", xLabelPos.a)
            .style("font-weight", "bolder")
            .text(this.x.label);
        yAxisG.append("text")
            .attr("class", "sg-axis-label sg-yaxis")
            .attr("transform", "rotate(-90)")
            .attr("x", yLabelPos.x)
            .attr("y", yLabelPos.y)
            .attr("dy", ".71em")
            .attr("fill", "#000")
            .style("text-anchor", yLabelPos.a)
            .style("font-weight", "bolder")
            .text(this.y.label);
        if(y2AxisG) {
            y2AxisG.append("text")
                .attr("class", "sg-axis-label sg-y2axis")
                .attr("transform", "rotate(90)")
                .attr("x", y2LabelPos.x)
                .attr("y", y2LabelPos.y)
                .attr("dy", ".71em")
                .attr("fill", "#000")
                .style("text-anchor", y2LabelPos.a)
                .style("font-weight", "bolder")
                .text(this.y2.label);
        }
        
        return this;
    };
}
;// CONCATENATED MODULE: ./src/sg.color.js
/* harmony default export */ function sg_color(SimpleGraph) {

    SimpleGraph.prototype.getColorBySeriesName = function(name, create) {
        if(!name) return null;
        if(name in this.customColors) return this.customColors[name];
        if(this.points) {
            let point;
            for(let p in this.points) {
                point = this.points[p];
                if(name === point.series) {
                    // TODO, no style options yet available for points data
                    if(point.style && point.style.fill) {
                        return point.style.fill;
                    } else {
                        if(create) { return this.color(name); }
                        return (this.color.domain().indexOf(name) >= 0) ? this.color(name) : null;
                    }
                }
            }
        }
        if(this.lines) {
            let line;
            for(let l in this.lines) {
                line = this.lines[l];
                if(name === line.series) {
                    if(line.style && line.style.stroke) {
                        return line.style.stroke;
                    } else {
                        if(create) { return this.color(name); }
                        return (this.color.domain().indexOf(name) >= 0) ? this.color(name) : null;
                    }
                }
            }
        }
        if(this.areas) {
            let area;
            for(let a in this.areas) {
                area = this.areas[a];
                if(name === area.series) {
                    if(area.style && area.style.fill) {
                        return area.style.fill;
                    } else {
                        if(create) { return this.color(name); }
                        return (this.color.domain().indexOf(name) >= 0) ? this.color(name) : null;
                    }
                }
            }
        }
        if(create) return this.color(name);
        return null;
    };

    SimpleGraph.prototype.resetColorScale = function(colorScale) {
        if(colorScale) {
            this.color = colorScale;
        } else {
            this.color.domain([]);
        }
        return this;
    };

    SimpleGraph.prototype.setSeriesColor = function(series, color) {
        this.customColors[series] = color;
    };

    SimpleGraph.prototype.removeSeriesColor = function(series) {
        if(this.customColors[series]) {
            delete this.customColors[series];
        };
        return this;
    };
}
;// CONCATENATED MODULE: ./src/sg.grid.legend.js
 

 /* harmony default export */ function sg_grid_legend(SimpleGraph) {

    SimpleGraph.prototype.drawGrid = function(style) {
        this.svgGraph.selectAll(".sg-grid").remove();
        // default styles
        let opacity = (style && style.opacity) ? parseFloat(style.opacity) : 0.4, 
            stroke = (style && style.stroke) ? style.stroke : "#555", 
            strokeWidth = (style && style['stroke-width']) ? parseFloat(style['stroke-width']) : 0.3;
        
        this.svgGraph.append("g")
            .attr("class", "sg-grid")
            .attr("transform", "translate(0," + this.height + ")")
            .style("opacity", opacity)
            .style("stroke", stroke)
            .style("stroke-width", strokeWidth)
            .call(this.x.gridAxis.tickSize(-this.height).tickFormat(""));
        this.svgGraph.append("g")
            .attr("class", "sg-grid")
            .style("opacity", opacity)
            .style("stroke", stroke)
            .style("stroke-width", strokeWidth)
            .call(this.y.gridAxis.tickSize(-this.width).tickFormat(""));
        
        return this;
    };

    SimpleGraph.prototype.removeGrid = function() {
        this.svgGraph.selectAll(".sg-grid").remove();
        return this;
    };
    
    SimpleGraph.prototype.removeLegend = function() {
        this.svg.selectAll(".sg-legend").remove();
        return this;
    };
    
    SimpleGraph.prototype.drawLegend = function(position, options) {
        this.removeLegend();
        
        if(!position) {
            position = { x: 0, y: 0 };
        } else if(!position.x || !position.y) {
            if(!position.x && position.x !== 0) {
                position.x = (position[0] !== undefined && typeof position[0] === "number") ? position[0] : this.width+5;
            }
            if(!position.y && position.y !== 0) {
                position.y = (position[1] !== undefined && typeof position[1] === "number") ? position[1] : 0;
            }
        }

        options = options || {};
        let anchor = options.anchor || "left", 
            bgstyle = options.bgstyle || {}, 
            exclude = options.exclude || [];

        // exclude formatting
        if(!exclude) { exclude = []; }
        if(typeof exclude === "string") { exclude = exclude.trim().split(/\s+/); }
        let excludeObj = {
            "all":    [], 
            "points": [], 
            "lines":  [], 
            "areas":  []
        };
        exclude.forEach(seriesname => {
            let excludeSub = excludeObj.all, 
                nameparts = seriesname.split("::").map(s => s.trim());
            if(nameparts.length > 1) {
                switch(nameparts[1].toLowerCase()) {
                    case "point":
                    case "points":
                        if(!nameparts[0]) excludeObj.points = true;
                        excludeSub = excludeObj.points;
                        break;
                    case "line":
                    case "lines":
                        if(!nameparts[0]) excludeObj.lines = true;
                        excludeSub = excludeObj.lines;
                        break;
                    case "area":
                    case "areas":
                        if(!nameparts[0]) excludeObj.areas = true;
                        excludeSub = excludeObj.areas;
                        break;
                    default:
                        return;
                }
            }
            if(excludeSub === true) return;
            excludeSub.push(nameparts[0]);
        });
        let checkExclude = (seriesname, seriesshape) => (
            excludeObj[seriesshape] === true
            || ~excludeObj[seriesshape].indexOf(seriesname)
            || !excludeObj.all.indexOf(seriesname)
        );
        
        // default styles for legend container (padding is set via explicit sides)
        if(bgstyle.padding) {
            let pads = (typeof bgstyle.padding === "string") ? bgstyle.padding.split(" ") : [bgstyle.padding];
            if(pads.length === 1) {
                bgstyle['padding-left'] = pads[0];
                bgstyle['padding-right'] = pads[0];
                bgstyle['padding-top'] = pads[0];
                bgstyle['padding-bottom'] = pads[0];
            } else if(pads.length === 2) {
                bgstyle['padding-left'] = pads[1];
                bgstyle['padding-right'] = pads[1];
                bgstyle['padding-top'] = pads[0];
                bgstyle['padding-bottom'] = pads[0];
            } else {
                if(pads.length > 3) { bgstyle['padding-left'] = pads[3]; }
                bgstyle['padding-right'] = pads[1];
                bgstyle['padding-top'] = pads[0];
                bgstyle['padding-bottom'] = pads[2];
            }
            delete bgstyle.padding;
        } else {
            if(!bgstyle['padding-left']) { bgstyle['padding-left'] = 0; }
            if(!bgstyle['padding-right']) { bgstyle['padding-right'] = 0; }
            if(!bgstyle['padding-top']) { bgstyle['padding-top'] = 0; }
            if(!bgstyle['padding-bottom']) { bgstyle['padding-bottom'] = 0; }
        }
        if(!bgstyle.fill) {
            bgstyle.fill = "#fff";
            bgstyle.opacity = 0;
        }
        // ensure int type
        bgstyle['padding-left'] = parseInt(bgstyle['padding-left']);
        bgstyle['padding-right'] = parseInt(bgstyle['padding-right']);
        bgstyle['padding-top'] = parseInt(bgstyle['padding-top']);
        bgstyle['padding-bottom'] = parseInt(bgstyle['padding-bottom']);
        
        // create legend graphic and background (note, added to top SVG not svgGraph)
        var legend = this.svg.append("g")
                .attr("class", "sg-legend")
                .attr("transform", "translate(" + position.x + "," + position.y + ")"), 
            legendBg = legend.append("rect")
                .attr("class", "sg-legend-bg")
                .attr("x", 0)
                .attr("y", 0);
        for(let skey in bgstyle) {
            if(!skey.startsWith('padding')) {
                legendBg.style(skey, bgstyle[skey]);
            }
        }
        
            // column parameters
        let itemsPerColumn  = options.itemsPerColumn || 0, 
            rowHeight       = options.rowHeight || 24, 
            columnNumber    = 0,
            columnItemCount = 0, 
            // running position for next item
            yOffset = bgstyle['padding-top'], 
            xOffset = bgstyle['padding-left'];
        
        // local function checks for new column and adjusts position if so
        function addAndCheckColumn() {
            columnItemCount++;
            if(itemsPerColumn > 0 && columnItemCount >= itemsPerColumn) {
                columnNumber++;
                columnItemCount = 0;
                yOffset = bgstyle['padding-top'];
                xOffset = legend.node().getBBox().width + 12;
            } else {
                yOffset += rowHeight;
            }
        }
        
        // local functions for adding items to legend by data type (not needed yet but will make custom item order
        // easier for future)
        var self = this;
        function addPointItem(data, shape, color, drawPointLine) {
            if(drawPointLine) {
                let lineOffset = yOffset + 10,
                    path = legend.append("path")
                        .attr("x", xOffset)
                        .attr("y", yOffset)
                        .attr("d", 
                            "M" + xOffset + " " + lineOffset + " " + 
                            "L" + (18+xOffset) + " " + lineOffset
                        );
                // remember styles are only stored in first since they're shared
                for(let style in self.pointLines[0].style) {
                    path.style(style, self.pointLines[0].style[style]);
                }
                path.style("stroke", self.getColorBySeriesName(data.series));
            }

            let size = (typeof data.size === "function") ? data.size() : data.size;
            if(size > 14) { size = 14; }
            let ioffx = xOffset+2, 
                ioffy = yOffset+3;
            if(shape && shape.startsWith("triangle")) {
                let length = size*1.519676,  // side length of equilateral trangle of same area of square
                    hl = length/2.0, 
                    hlDiff = 7-hl, 
                    height = length*0.86602,  // ratio of equilateral triangle
                    hh = height*0.5, 
                    hhDiff = 7-hh;
                ioffx += hlDiff;
                ioffy += hhDiff;
                switch(shape) {
                    case "triangle-down":
                        legend.append("polygon")
                            .attr("points", (
                                `${ioffx},${ioffy+height} `
                                + `${ioffx+hl},${ioffy} `
                                + `${ioffx+length},${ioffy+height}`
                            ))
                            .style("fill", color);
                        break;
                    case "triangle":
                    case "triangle-up":
                        legend.append("polygon")
                            .attr("points", (
                                `${ioffx},${ioffy} `
                                + `${ioffx+hl},${ioffy+height} `
                                + `${ioffx+length},${ioffy}`
                            ))
                            .style("fill", color);
                        break;
                }
            } else {
                let hs = size/2.0, 
                    hsDiff = 7-hs;
                ioffx += hsDiff;
                ioffy += hsDiff;
                switch(shape) {
                    case "circle":
                        legend.append("circle")
                            .attr("cx", ioffx+hs)
                            .attr("cy", ioffy+hs)
                            .attr("r", hs)
                            .style("fill", color);
                        break;
                    case "square":
                    case "diamond":
                    default:
                        legend.append("rect")
                            .attr("x", ioffx)
                            .attr("y", ioffy)
                            .attr("width", size)
                            .attr("height", size)
                            .attr("transform", shape == "square" ? "" : `rotate(45,${ioffx+hs},${ioffy+hs})`)
                            .style("fill", color);
                        break;
                }
            }

            legend.append("text")
                .attr("x", xOffset+23)
                .attr("y", yOffset+9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(data.series);

            addAndCheckColumn();
        }
        function addLineItem(data, color) {
            let lineOffset = yOffset + 10, 
                path = legend.append("path")
                    .attr("x", xOffset)
                    .attr("y", yOffset)
                    .attr("d", 
                        "M" + xOffset + " " + lineOffset + " " + 
                        "L" + (18+xOffset) + " " + lineOffset
                    );
            for(let style in data.style) {
                path.style(style, data.style[style]);
            }
            if(!("stroke" in data.style)) {
                path.style("stroke", color);
            }
            legend.append("text")
                .attr("x", xOffset+23)
                .attr("y", yOffset+9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(data.series);
            addAndCheckColumn();
        }
        function addAreaItem(data, color) {
            let symbol = legend.append("rect")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .attr("width", 18)
                .attr("height", 18);
            for(let style in data.style) {
                symbol.style(style, data.style[style]);
            }
            if(!("fill" in data.style)) {
                symbol.style("fill", color);
            }
            legend.append("text")
                .attr("x", xOffset+23)
                .attr("y", yOffset+9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(data.series);
            addAndCheckColumn();
        }
        
        // start with areas data
        if(this.areas && excludeObj.areas !== true) {
            let areaSeries = [];
            for(let i = 0; i < this.areas.length; i++) {
                let name = this.areas[i].series;
                if(!checkExclude(name, 'areas') && !~areaSeries.indexOf(name)) {
                    areaSeries.push(name);
                    let color = this.getColorBySeriesName(name);
                    addAreaItem(this.areas[i], typeof color === "function" ? color(this.areas[i]) : color);
                }
            }
        }
        // then lines
        if(this.lines && excludeObj.lines !== true) {
            let lineSeries = [];
            for(let i = 0; i < this.lines.length; i++) {
                let name = this.lines[i].series;
                if(!checkExclude(name, 'lines') && !~lineSeries.indexOf(name)) {
                    lineSeries.push(name);
                    let color = this.getColorBySeriesName(name);
                    addLineItem(this.lines[i], typeof color === "function" ? color(this.lines[i]) : color);
                }
            }
        }
        // finally points
        if(this.points && excludeObj.points !== true) {
            let pointSeries = [];
            for(let i = 0; i < this.points.length; i++) {
                let name = this.points[i].series;
                if(!checkExclude(name, 'points') && !~pointSeries.indexOf(name)) {
                    pointSeries.push(name);
                    // find connected point line series, if it exists
                    let drawPointLine = false;
                    if(this.pointLines) {
                        let j = this.pointLines.length;
                        while(j--) {
                            if(this.pointLines[j].series === name) {
                                drawPointLine = true;
                                break;
                            }
                        }
                    }
                    let color = this.getColorBySeriesName(name);
                    color = typeof color === "function" ? color(this.points[i]) : color;
                    addPointItem(this.points[i], this.getPointSeriesShape(name), color, drawPointLine);
                }
            }
        }
        
        // finish up legend bg after completing elements inside
        let legendBox = legend.node().getBBox();
        legendBg
            .attr("width", legendBox.width + bgstyle['padding-left'] + bgstyle['padding-right'])
            .attr("height", legendBox.height + bgstyle['padding-top'] + bgstyle['padding-bottom']);
            
        // adjust legend position if necessary
        anchor = anchor.trim().toLowerCase();
        if(anchor === "middle") {
            position.x -= 0.5*legendBox.width;
        } else if(anchor === "right") {
            position.x -= legendBox.width;
        }
        legend.attr("transform", "translate(" + position.x + "," + position.y + ")");
        
        return this;
    };
}
;// CONCATENATED MODULE: ./src/sg.point.shapes.js
/* harmony default export */ const sg_point_shapes = (["diamond", "circle", "square", "triangle", "triangle-up", "triangle-down"]);
;// CONCATENATED MODULE: ./src/sg.data.point.js


/* harmony default export */ function sg_data_point(SimpleGraph) {

    SimpleGraph.prototype.addPointData = function(series, xValue, yValue, options) {
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        series = (series === null) ? "" : String(series);
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!(options.y2Axis || options.y2);
        if(options.shape) this.setPointSeriesShape(series, options.shape);

        let p = {
            series: series, 
            x: xValue, 
            y: parseFloat(yValue), 
            y2: options.y2Axis, 
            size: options.size, 
            _bind: null, 
            _keys: null
        };

        this.points.push(p);
        
        return this;
    };

    SimpleGraph.prototype.addPointsData = function(data, seriesName, xValueName, yValueName, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!(options.y2Axis || options.y2);
        options.additionalDataKeys = options.additionalDataKeys || null;

        // first we gotta comb through the data and organize it nicely
        data.forEach((d, i) => {
            // get data series name, if it exists, otherwise assume seriesName is series name
            let snIsIn = !options.forceSeriesName && !options.forceSeries && (seriesName in d) && d[seriesName], 
                series = snIsIn ? d[seriesName] : ((!seriesName && seriesName !== 0) ? i : seriesName), 
                xValue = d[xValueName], 
                yValue = d[yValueName];
            series = (series === null) ? "" : String(series);
            // add shape if provided as constant string
            if(options.shape) this.ptSeriesShapes[series] = options.shape;
            // nicely organize data
            let point = {
                series: series, 
                x: xValue, 
                y: parseFloat(yValue), 
                y2: options.y2Axis, 
                size: options.size, 
                _bind: d, 
                _keys: {
                    x: xValueName, 
                    y: yValueName, 
                    additional: null
                }
            };
            if(snIsIn) point._keys.series = seriesName;
            // additonal keys
            if(options.additionalDataKeys && Array.isArray(options.additionalDataKeys)) {
                let addKeys = [];
                options.additionalDataKeys.forEach((key) => {
                    let name = key, 
                        t = 1;
                    // if key exists (name, x, y are reserved), adjust key name
                    while(name in point) {
                        name = key + String(++t);
                    }
                    addKeys.push({key: key, name: name})
                    point[name] = d[key];
                });
                point._keys.additional = addKeys;
            }
            this.points.push(point);
        });
        
        return this;
    };

    SimpleGraph.prototype.addPointsDataAsArray = function(series, data, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        series = (series === null) ? "" : String(series);
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!(options.y2Axis || options.y2);
        options.showNulls = !!options.showNulls;
        if(options.shape) this.setPointSeriesShape(series, options.shape);

        var self = this;
        data.forEach(datum => {
            var p = {
                series: series, 
                x: parseFloat(datum[0]),
                y: parseFloat(datum[1]), 
                y2: options.y2Axis, 
                size: options.size, 
                _bind: datum, 
                _keys: {
                    x: 0, 
                    y: 1, 
                    additional: null
                }
            };
            if(isNaN(p.y) || (!p.y && p.y !== 0)) {
                if(!showNulls) return;
                p.y = 0;
                p.wasNull = true;
            }
            self.points.push(p);
        });
        
        return this;
    };

    SimpleGraph.prototype.clearPointsData = function(series) {
        if(series === null || typeof series === "undefined") {
            this.points = null;
        } else if(Array.isArray(series)) {
            this.points = this.points.filter(d => ~series.indexOf(d.series));
        } else {
            this.points = this.points.filter(d => d.series !== series);
        }
        return this;
    };

    SimpleGraph.prototype._getPointData = function(series, index) {
        if(!this.points) return [];
        var points = this.points.filter(d => d.series === series)
        if(!points || !points.length) return this;
        if(index || index === 0) {
            while(index < 0) { index = points.length + index; }
            points = [points[index]];
        }
        return points;
    };

    SimpleGraph.prototype._clonePointData = function(d) {
        let data = {
            series: d.series, 
            x: d.x, 
            y: d.y, 
            y2: d.y2, 
            size: d.size
        };
        if(d._keys) {
            if(d._keys.x) data[d._keys.x] = d.x;
            if(d._keys.y) data[d._keys.y] = d.y;
            d._keys.additional && d._keys.additional.forEach(a => {
                data[a.name] = d[a.name];
            });
        }
        return data;
    };

    SimpleGraph.prototype.getPointsDataBySeries = function(series) {
        return this._getPointData(series).map(d => this._clonePointData(d));
    };

    SimpleGraph.prototype.getPointCoordinatesBySeries = function(series) {
        return this._getPointData.map(c => [c.x, c.y || c.y === 0 ? c.y : c.y2]);
    };

    SimpleGraph.prototype.getPointSeriesShape = function(series) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        return this.ptSeriesShapes[series];
    };

    SimpleGraph.prototype.setPointSeriesShape = function(series, shape) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        this.ptSeriesShapes[series] = ~sg_point_shapes.indexOf(shape) ? shape : null;
        return this;
    };

    SimpleGraph.prototype.updatePointsData = function(series, index, update) {
        this._getPointData(series, index).forEach(point => {
            ['x', 'y', 'y2', 'size'].forEach(k => {
                if((k in update) && update[k] !== null && typeof update[k] !== undefined) {
                    point[k] = update[k];
                    if(point._keys) delete point._keys[k];
                }
            });
        });
        this._syncPointLinesData();
        return this;
    };

    SimpleGraph.prototype.syncPointsData = function() {
        if(!this.points) return this;
        this.points.forEach(d => {
            if(!d._bind || !d._keys) return;
            if('series' in d._keys) d._bind[d._keys.series];
            if('x' in d._keys) d.x = parseFloat(d._bind[d._keys.x]);
            if('y' in d._keys) d.y = parseFloat(d._bind[d._keys.y]);
            if(!d._keys.additional) return;
            d._keys.additional.forEach(a => d[a.name] = d._bind[a.key]);
        });
        this._syncPointLines();
        return this;
    };

}
;// CONCATENATED MODULE: ./src/sg.data.area.js
/* harmony default export */ function sg_data_area(SimpleGraph, d3) {

    SimpleGraph.prototype.addAreaAsCoordinates = function(series, areaCoordinates, options) {
        if(!areaCoordinates || !Array.isArray(areaCoordinates) || areaCoordinates.length < 2) return this;
        options = options || {};
        var style = {};
        if(options.style) {
            for(let k in options.style) {
                style[k] = options.style[k];
            }
        }
        this.areas = this.areas || [];
        this.areas.push({
            series:      (series === null) ? "" : String(series), 
            functions:   null, 
            coords:      areaCoordinates, 
            resolution:  null, 
            xRange:      null, 
            y2:          !!(options.y2Axis || options.y2), 
            style:       options.style || {}, 
            interpolate: options.interpolation || d3.curveLinear, 
            _bind:       {coords: areaCoordinates, style: style}
        });
        return this;
    };

    SimpleGraph.prototype.addAreaBetweenTwoLines = function(series, lineFunctionBottom, lineFunctionTop, xRange, options) {
        if(!lineFunctionTop || typeof lineFunctionTop !== "function") return this;
        if(!lineFunctionBottom || typeof lineFunctionBottom !== "function") return this;
        options = options || {};
        var style = {};
        if(options.style) {
            for(let k in options.style) {
                style[k] = options.style[k];
            }
        }
        this.areas = this.areas || [];
        this.areas.push({
            series:      (series === null) ? "" : String(series), 
            functions:   [lineFunctionBottom, lineFunctionTop], 
            coords:      null, 
            xRange:      xRange ? [...xRange] : null, 
            y2:          !!(options.y2Axis || options.y2), 
            style:       options.style || {}, 
            interpolate: options.interpolation || d3.curveLinear, 
            _bind:       {xRange: xRange, style: style}
        });
        return this;
    };

    SimpleGraph.prototype._getAreaData = function(series, index) {
        if(!this.areas) return [];
        var areas = this.areas.filter(d => d.series === series)
        if(!areas || !areas.length) return this;
        if(index || index === 0) {
            while(index < 0) { index = areas.length + index; }
            areas = [areas[index]];
        }
        return areas;
    };

    SimpleGraph.prototype._cloneAreaData = function(d) {
        return {
            series:      d.series, 
            functions:   d.functions ? [...d.functions] : null, 
            coords:      d.coords ? d.coords.map(c => [...c]) : null, 
            xRange:      d.xRange ? [...d.xRange] : null, 
            y2:          d.y2, 
            style:       d.style, 
            interpolate: d.interpolate
        };
    };

    SimpleGraph.prototype.getAreasDataBySeries = function(series, index) {
        return this._getAreaData(series, index).map(d => this._cloneAreaData(d));
    };

    SimpleGraph.prototype.updateAreaData = function(series, index, update) {
        this._getAreaData(series, index).forEach(area => {
            if(update.lineFunctionTop || update.functionTop || update.lineFunctionBottom || update.functionBottom) {
                area.functions = [
                    update.lineFunctionBottom || update.functionBottom || (area.functions && area.functions[0]), 
                    update.lineFunctionTop || update.functionTop || (area.functions && area.functions[1])
                ];
                if(!area.functions[0]) area.functions[0] = (x => 0);
                if(!area.functions[1]) area.functions[1] = (x => 0);
                if(update.xRange) {
                    area.xRange = [...update.xRange];
                    if(area._bind) {
                        area._bind.xRange = update.xRange;
                    }
                }
                area.coords = null;
                if(area._bind) delete area._bind.coords;
            } else if(update.coordinates || update.coords) {
                let repCoords = update.coordinates || update.coords;
                area.coords = [...repCoords];
                area.functions = null;
                if(area._bind) {
                    area._bind.coords = repCoords;
                    delete area._bind.xRange;
                }
            }
            area.interpolate = update.interpolate || area.interpolate;
            if(update.style) {
                area.style = {};
                for(let key in update.style) {
                    area.style[key] = update.style[key];
                }
                if(area._bind) {
                    area._bind.style = update.style;
                }
            }
        });
        return this;
    };
    
    SimpleGraph.prototype.clearAreasData = function(series) {
        if(series === null || typeof series === "undefined") {
            this.areas = null;
        } else if(Array.isArray(series)) {
            this.areas = this.areas.filter(d => ~series.indexOf(d.series));
        } else {
            this.areas = this.areas.filter(d => d.series !== series);
        }
        return this;
    };

    SimpleGraph.prototype.syncAreasData = function() {
        if(!this.areas) return this;
        this.areas.forEach(d => {
            if(d._bind.xRange) {
                d.xRange = [...d._bind.xRange];
            }
            if(d._bind.coords) {
                d.coords = d._bind.coords.map(c => [...c]);
            }
            if(d._bind.style) {
                d.style = {};
                for(let key in update.style) {
                    d.style[key] = update.style[key];
                }
            }
        });
        return this;
    };
    
}
;// CONCATENATED MODULE: ./src/sg.data.line.js
/* harmony default export */ function sg_data_line(SimpleGraph, d3) {

    SimpleGraph.prototype.addLineDataAsCoordinates = function(series, coords, options) {
        if(!coords || coords.length === 0) {
            return this;
        }
        this.lines = this.lines || [];
        //coords.sort(function(a, b) { return a[0] - b[0]; });
        // defaults
        options = options || {};
        var style = {};
        if(options.style) {
            for(let k in options.style) {
                style[k] = options.style[k];
            }
        }
        if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
            style['stroke-width'] = 1.5;
        }
        this.lines.push({
            series:       (series === null) ? "" : String(series), 
            lineFunction: null, 
            coords:       coords.map(c => [...c]), 
            xRange:       null, 
            y2:           !!(options.y2Axis || options.y2), 
            style:        style, 
            interpolate:  options.interpolation || d3.curveLinear, 
            _bind:        {coords: coords, style: style}
        });
        return this;
    };

    SimpleGraph.prototype.addLineDataAsFunction = function(series, lineFunction, xRange, options) {
        if(!lineFunction || typeof lineFunction !== "function" || typeof lineFunction(0) !== "number") {
            return this;
        }
        this.lines = this.lines || [];
        // defaults
        options = options || {};
        var style = options.style || {};
        if(options.style) {
            for(let k in options.style) {
                style[k] = options.style[k];
            }
        }
        if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
            style['stroke-width'] = 1.5;
        }
        var interpolation = interpolation || d3.curveLinear;
        this.lines.push({
            series:       (series === null) ? "" : String(series), 
            lineFunction: lineFunction, 
            coords:       null, 
            xRange:       xRange ? [...xRange] : null, 
            y2:           !!(options.y2Axis || options.y2), 
            style:        style, 
            interpolate:  options.interpolation || d3.curveLinear, 
            _bind:        {xRange: xRange, style: style}
        });
        return this;
    };

    SimpleGraph.prototype.addLinesDataFromPoints = function(forSeries, options) {
        if(!this.points || this.points.length === 0) return this;

        options = options || {};
        var handleOverlap = !options.handleOverlap ? 'average' : options.handleOverlap.toLowerCase();
        // default styles
        var style = {};
        if(options.style) {
            for(let k in options.style) {
                style[k] = options.style[k];
            }
        }
        if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
            style['stroke-width'] = 1.5;
        }
        // can't specify color, will be taken from related point data series
        if(style.stroke) delete style.stroke;
        // this multiple series of loops isn't pretty but necessary for flexible preprocessing
        // first organize points by data series
        var pointsBySeries = {};
        for(var i = 0; i < this.points.length; i++) {
            var series = this.points[i].series;
            if(series in pointsBySeries) {
                pointsBySeries[series].y2 = this.points[i].y2;
                pointsBySeries[series].points.push(this.points[i]);
            } else {
                pointsBySeries[series] = {points: [this.points[i]]};
            }
        }

        // change forSeries to function
        var checkSeries = function(s) { return true; };
        if(forSeries) {
            if(typeof forSeries === "function") {
                checkSeries = forSeries;
            } else if(typeof forSeries === "string") {
                checkSeries = function(s) { return s === forSeries; };
            } else if(Array.isArray(forSeries)) {
                checkSeries = function(s) { return ~forSeries.indexOf(s); };
            }
        }

        // will be our array of point-connecting-lines
        this.pointLines = [];

        for(let series in pointsBySeries) {
            if(!checkSeries(series) || pointsBySeries[series].points.length < 2) continue;
            var lineCoords = this._getPointLine(pointsBySeries[series].points, handleOverlap);
            if(lineCoords.length >= 2) {
                this.pointLines.push({
                    series:       series, 
                    lineFunction: null, 
                    resolution:   null, 
                    coords:       lineCoords, 
                    xRange:       null, 
                    y2:           pointsBySeries[series].y2, 
                    style:        style, 
                    interpolate:  options.interpolation || d3.curveLinear, 
                    bind:         {style: style}
                });
            }
        }
        
        return this;
    };

    SimpleGraph.prototype._getPointLine = function(points, handleOverlap) {
        points.sort((a,b) => a.x - b.x);
        var lineCoords = [];
        for(let i = 0; i < points.length; ++i) {
            var p = points[i], 
                ys = [p.y], 
                coords = [p.x, p.y], 
                overlaps = false;
            // accumlate overlaps
            while(i+1 < points.length) {
                p = points[i+1];
                if(p.x === coords[0]) {
                    overlaps = true;
                    ys.push(p.y);
                    ++i;
                } else {
                    // assuming sorted, so all equal values should be consequtive
                    break;
                }
            }
            // add next line coordinate, processing overlaps as necessary
            if(overlaps) {
                if(~["mean", "average"].indexOf(handleOverlap)) {
                    coords[1] = ys.reduce((a,v) => a+v);
                } else {
                    ys.sort();
                    switch(handleOverlap) {
                        case "lowest":
                        case "min":
                            coords[1] = ys[0];
                            break;
                        case "highest":
                        case "max":
                            coords[1] = ys[ys.length-1];
                            break;
                        case "median":
                            coords[1] = ys[Math.floor(0.5*ys.length)];
                            break;
                        default:
                            throw `Unknown handle overlap operation: ${handleOverlap}`;
                    }
                }
            }
            lineCoords.push(coords);
        }
        return lineCoords;
    };
    
    SimpleGraph.prototype.clearLinesData = function(series) {
        if(series === null || typeof series === "undefined") {
            this.lines = null;
        } else if(Array.isArray(series)) {
            this.lines = this.lines.filter(d => ~series.indexOf(d.series));
        } else {
            this.lines = this.lines.filter(d => d.series !== series);
        }
        return this;
    };
    
    SimpleGraph.prototype.clearPointLinesData = function(series) {
        if(series === null || typeof series === "undefined") {
            this.pointLines = null;
        } else if(Array.isArray(series)) {
            this.pointLines = this.pointLines.filter(d => ~series.indexOf(d.series));
        } else {
            this.pointLines = pointLines.lines.filter(d => d.series !== series);
        }
        return this;
    };

    SimpleGraph.prototype._getLineData = function(series, index) {
        if(!this.lines) return [];
        var lines = this.lines.filter(d => d.series === series);
        if(!lines || !lines.length) return [];
        if(index || index === 0) {
            while(index < 0) { index = lines.length + index; }
            lines = [lines[index]];
        }
        return lines;
    };

    SimpleGraph.prototype._cloneLineData = function(d) {
        return {
            series:       d.series, 
            lineFunction: d.lineFunction, 
            coords:       d.coords ? d.coords.map(c => [...c]) : null, 
            xRange:       d.xRange ? [...d.xRange] : null, 
            y2:           d.y2, 
            style:        d.style, 
            interpolate:  d.interpolate
        };
    };

    SimpleGraph.prototype.getLinesDataBySeries = function(series, index) {
        return this._getLineData(series, index).map(d => this._cloneLineData(d));
    };

    SimpleGraph.prototype.updateLinesData = function(series, index, update) {
        this._getLineData(series, index).forEach(line => {
            if(update.lineFunction || update.function) {
                line.lineFunction = update.lineFunction || update.function || line.lineFunction;
                if(update.xRange) {
                    line.xRange = [...update.xRange];
                    if(line._bind) {
                        line._bind.xRange = update.xRange;
                    }
                }
                line.coords = null;
                if(line._bind) delete line._bind.coords;
            } else if(update.coordinates || update.coords) {
                let repCoords = update.coordinates || update.coords;
                line.coords = [...repCoords];
                if(line._bind) {
                    line._bind.coords = repCoords;
                    delete line._bind.xRange;
                }
            }
            line.interpolate = update.interpolate || line.interpolate;
            if(update.style) {
                line.style = {};
                for(let key in update.style) {
                    line.style[key] = update.style[key];
                }
                if(!line.style['stroke-width'] || typeof line.style['stroke-width'] !== "number") {
                    line.style['stroke-width'] = 1.5;
                }
                if(line._bind) {
                    line._bind.style = update.style;
                }
            }
        });
        return this;
    };

    SimpleGraph.prototype.syncLinesData = function() {
        if(!this.lines) return this;
        this.lines.forEach(d => {
            if(d._bind.xRange) {
                d.xRange = [...d._bind.xRange];
            }
            if(d._bind.coords) {
                d.coords = d._bind.coords.map(c => [...c]);
            }
            if(d._bind.style) {
                d.style = {};
                for(let key in d._bind.style) {
                    d.style[key] = d._bind.style[key];
                }
                if(!d.style['stroke-width'] || typeof d.style['stroke-width'] !== "number") {
                    d.style['stroke-width'] = 1.5;
                }
            }
        });
        return this;
    };

    SimpleGraph.prototype._syncPointLines = function() {
        if(!this.pointLines) return;
        // first organize points by data series
        var pointsBySeries = {};
        this.points.forEach(point => {
            let series = point.series;
            if(series in pointsBySeries) {
                pointsBySeries[series].push(this.points[i]);
            } else {
                pointsBySeries[series] = [this.points[i]];
            }
        });
        // update existing point-line data
        this.pointLines = this.pointLines.filter(d => {
            if(!(d.series in pointsBySeries)) return false;
            d.coords = this._getPointLine(pointsBySeries[d.series]);
            if(d._bind.style) {
                d.style = {};
                for(let key in d._bind.style) {
                    d.style[key] = d._bind.style[key];
                }
                if(!d.style['stroke-width'] || typeof d.style['stroke-width'] !== "number") {
                    d.style['stroke-width'] = 1.5;
                }
            }
            return true;
        });
    };

}
;// CONCATENATED MODULE: ./src/sg.draw.lib.js
/* harmony default export */ function sg_draw_lib(SimpleGraph) {
    
    /*
     * Find x-intercept (on either y-axis min or max).using simple binary search
     */
    SimpleGraph.prototype._findIntercept = function(f, x1, x2, y2Axis) {
        var y1 = f(x1), 
            y2 = f(x2), 
            breakValue, 
            increasing, 
            yAxis = y2Axis ? this.y2 : this.y;
        if(y1 < yAxis.min !== y2 < yAxis.min) {
            breakValue = yAxis.min;
        } else if(y1 > yAxis.max !== y2 > yAxis.max) {
            breakValue = yAxis.max;
        } else {
            return null;
        }
        var x = x1 + 0.5*(x2 - x1),          // start halfway
            search = 0.25*Math.abs(x2 - x1), // search distance
            lasty = y1, lastx = x1,          // store last x,y values
            y, diff, goHigher,               // vars scoped only in interation but to avoid redeclaring var
            lastDiff, lastGoHigher;          // some other memory items
        x1 -= 0.00001;                       // tolerances to min/max bounds as binary conversion be funky
        x2 += 0.00001;                       // minor discrepancies when converted to decimal values
        var i = 0;                           // increment for fail-safe stop condition
        while(i++ < 100) {
            y = f(x);
            diff = Math.abs(y - breakValue);
            if(x >= this.x.min && x <= this.x.max && diff < 0.000001) {
                return [x, breakValue];
            }
            if(i > 0 && lastDiff < diff) {
                // last search point was closer
                x = lastx;
                y = lasty;
                search *= 0.5;
            } else {
                // new search point is closer (determine whether to try higher/lower x by comparing whether the y 
                // is over the break value against whether the line is upsloped).
                goHigher = (y > breakValue) !== ((x > lastx) === (y > lasty));
                if(goHigher !== lastGoHigher) {
                    search *= 0.5;
                }
                lastx = x;
                lasty = y;
                lastGoHigher = goHigher;
                lastDiff = diff;
            }
            x += (lastGoHigher) ? search : -search;
            if(x < x1 || x > x2) return null;
        }
        return null;
    };

    /*
     * Split line into segments based on it crossing in/out of the graph bounds. This version works on line coordinates, traversing through coordinates and tracking as it enters or leaves domain.
     */
    SimpleGraph.prototype._getLineSegmentsFromCoordinates = function(lineCoords, y2Axis) {
        var yAxis       = y2Axis ? this.y2 : this.y, 
            segments    = [], 
            segment     = [], 
            lastCoords  = null, 
            crossedXMin = false, 
            crossedXMax = false;

        for(var c = 0; c < lineCoords.length; c++) {
            var coords = lineCoords[c];

            // null means a break in the line
            if(coords[1] === undefined || coords[1] === null) {
                if(segment.length > 1) segments.push(segment);
                segment = [];
                lastCoords = null;
                continue;
            }

            // note, if date, this will become y per milliseconds
            var slope = (!lastCoords) ? 
                            0 : (lineCoords[c][1] - lastCoords[1]) / (lineCoords[c][0] - lastCoords[0]);

            // search for x-domain crossings, if it hasn't yet entered graph area
            if(!crossedXMin) {
                if(coords[0] >= this.x.min) {
                    crossedXMin = true;
                    if(coords[0] > this.x.min && lastCoords) {
                        // get y-intercept on x-domain-min, add if within range
                        var intercept = [
                            this.x.min, 
                            lastCoords[1] + slope*(coords[1] - lastCoords[1])
                        ];
                        if(intercept[1] >= yAxis.min && intercept[1] <= yAxis.max) {
                            segment.push(intercept);
                        }
                    }
                    // add if within y-range
                    if(coords[1] >= yAxis.min && coords[1] <= yAxis.max) {
                        segment.push(coords);
                    }
                }
                // skip rest of loop until crossing x-domain or because we just added segment start
                lastCoords = coords;
                continue;
            }
            if(!crossedXMax && coords[0] >= this.x.max) {
                crossedXMax = true;
                if(coords[0] > this.x.max) {
                    // if no last coords, this is just a point outside
                    if(!lastCoords) break;
                    // interpolate back to x-max
                    coords = [
                        this.x.max, 
                        lastCoords[1] + slope*(coords[1] - lastCoords[1])
                    ];
                }
            }

            // check within y-domain, if inside, add to running segment, if outside, end segment
            if(coords[1] >= yAxis.min && coords[1] <= yAxis.max) {
                // SPECIAL CASE: first point of new segment
                if(segment.length === 0 && lastCoords) {
                    if(slope !== 0) {
                        // get y-intercept
                        var yTarget = slope > 0 ? yAxis.min : yAxis.max;
                        var lastX = this.x.isDate ? lastCoords[0].getTime() : lastCoords[0];
                        coords = [
                            lastX + (yTarget - lastCoords[1])/slope, 
                            yTarget
                        ];
                        if(this.x.isDate) coords[0] = new Date(coords[0]);
                        // force repeat of the coords that original came in for this loop (intercept will become last)
                        c--;
                    }
                }
                // add to segment
                segment.push(coords);
            } else {
                // SPECIAL CASE: ending segment with last point outside of range
                if(segment.length > 0) {
                    // yet y-intercept
                    var yTarget = slope > 0 ? yAxis.max : yAxis.min;
                    var lastX = this.x.isDate ? lastCoords[0].getTime() : lastCoords[0];
                    coords = [
                        lastX + (yTarget - lastCoords[1])/slope, 
                        yTarget
                    ];
                    if(this.x.isDate) coords[0] = new Date(coords[0]);
                    // add to segment
                    segment.push(coords);
                }
                // finish segment
                if(segment.length > 1) {
                    segments.push(segment);
                    segment = [];
                }
            }
            // if crossed x-max we can break
            if(crossedXMax) break;
            // save last coordinates
            lastCoords = coords;
        }

        // always add last segment (if valid)
        if(segment.length > 1) segments.push(segment);

        return segments;
    };

    /*
     * Split line into segments based on it crossing in/out of the graph bounds. This version works on line as function, traversing through coordinates by resolution and tracking as it enters or leaves domain.
     */
    SimpleGraph.prototype._getLineSegmentsFromFunction = function(lineFunction, resolution, xRange, y2Axis, limitToGraphRange) {
        if(!xRange) {
            xRange = [this.x.min, this.x.max];
        } else {
            if(xRange[0] < this.x.min) { xRange[0] = this.x.min; }
            if(xRange[1] > this.x.max) { xRange[0] = this.x.max; }
        }
        if(!resolution || typeof resolution !== "number") {
            resolution = Math.floor((this.width - this.margins.left - this.margins.right) / 10);
        }
        if(resolution < 2) resolution = 2;

        // how increments down the line are handled
        var incrementFunc;
        if(!this.x.isLog) {
            // if not log-scale, standard increment (this works for dates too)
            var increment = (xRange[1] - xRange[0])/(resolution-1), 
                isDate = this.x.isDate;
            // standard increment function
            incrementFunc = function(n) {
                return isDate ? new DateUTC(n.getTime() + increment) : n + increment;
            };
        } else {
            // increment in exponential scale fit to range and resolution
            var base = Math.pow(xRange[1]/xRange[0], 1-resolution);
            incrementFunc = function(n) {
                n *= base;
                return (n > xRange[1]) ? xRange[1] : n;
            };
        }

        var segments = [], 
            segment  = [], 
            x        = xRange[0], 
            lastX    = x, 
            yAxis    = y2Axis ? this.y2 : this.y;
        while(true) {
            var markForBreak = false;
            if(x >= xRange[1] || isNaN(x)) {
                x = xRange[1];
                markForBreak = true;
            }

            var y = lineFunction(x);

            if(!limitToGraphRange) {
                segment.push([x, y]);
                continue;
            }

            if(y >= yAxis.min && y <= yAxis.max) {
                // case: first point of new segment
                if(segment.length === 0 && x > xRange[0]) {
                    // get y-intercept
                    var intercept = this._findIntercept(lineFunction, lastX, x, y2Axis);
                    if(intercept) {
                        segment.push(intercept);
                    }
                }
                // add to segment
                segment.push([x, y]);
            } else {
                // case: ending segment with last point outside of range
                if(segment.length > 0) {
                    // yet y-intercept
                    var intercept = this._findIntercept(lineFunction, lastX, x, y2Axis);
                    if(intercept) {
                        segment.push(intercept);
                    }
                }
                // finish segment
                if(segment.length > 1) {
                    segments.push(segment);
                    segment = [];
                }
            }

            lastX = x;
            x = incrementFunc(x);
            if(markForBreak) break;
        }
        
        // always attempt to add last segment
        if(segment.length > 1) segments.push(segment);

        return segments;
    };

    SimpleGraph.prototype._getAreaPolysFromCoordinates = function(areaCoordinates, y2Axis) {
        var lineA = [], 
            lineB = [];
        for(var i = 0; i < areaCoordinates.length; i++) {
            lineA.push([areaCoordinates[i][0], areaCoordinates[i][1]]);
            lineB.push([areaCoordinates[i][0], areaCoordinates[i][2]]);
        }
        return this._getAreaPolysFromLineCrosswalk(
            this._getLineSegmentsFromCoordinates(lineA, y2Axis), 
            this._getLineSegmentsFromCoordinates(lineB, y2Axis), 
            y2Axis
        );
    };

    SimpleGraph.prototype._getAreasPolysFromFunctions = function(funcA, funcB, resolution, xRange, y2Axis, limitToGraphRange) {
        var lines = [
            this._getLineSegmentsFromFunction(funcA, resolution, xRange, y2Axis, limitToGraphRange), 
            this._getLineSegmentsFromFunction(funcB, resolution, xRange, y2Axis, limitToGraphRange)
        ];
        return this._getAreaPolysFromLineCrosswalk(
            this._getLineSegmentsFromFunction(funcA, resolution, xRange, y2Axis, limitToGraphRange), 
            this._getLineSegmentsFromFunction(funcB, resolution, xRange, y2Axis, limitToGraphRange), 
            y2Axis
        );
    };

    SimpleGraph.prototype._getAreaPolysFromLineCrosswalk = function(lineA, lineB, y2Axis) {
        var areas = [], 
            areaCoords = [], 
            li = [0, 0], 
            ci = [0, 0], 
            endOfLines = [false, false], 
            endOfCoords = [false, false], 
            coordA, coordB;
        while(true) {
            // grab coords
            coordA = endOfLines[0] ? null : lineA[li[0]][ci[0]];
            coordB = endOfLines[1] ? null : lineB[li[1]][ci[1]];
            // whether to progress each line
            var moveCoords = [false, false];
            
            if(!coordA && !coordB) {
                break;
            } else if(!coordA || !coordB) {
                // if null value in either coordinate or odd situation if inconsistent number of coordinates, 
                // pinch off area and move
                moveCoords = [true, true];
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                areaCoords = [];
            } else if(coordA[0] === coordB[0]) {
                // matching, just add
                areaCoords.push([coordA[0], coordA[1], coordB[1]]);
                // both coords moved
                moveCoords[0] = moveCoords[1] = true;
            } else {
                // if one set of coords needs to catch up, don't add the coord (assume no area), pinch existing 
                // coords to areas if available
                if(coordA[0] < coordB[0]) {
                    moveCoords[0] = true;
                } else {
                    moveCoords[1] = true;
                }
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                areaCoords = [];
            }
            
            var newLines = [false, false];
            for(var i = 0; i < 2; i++) {
                if(endOfLines[i]) { continue; }
                var line = i === 0 ? lineA : lineB;
                // move coords as necessary
                if(moveCoords[i]) { ci[i] += 1; }
                // check end of coordinates
                endOfCoords[i] = ci[i] >= line[li[i]].length;
                // increment lines when needed
                if(endOfCoords[i]) {
                    li[i] += 1;
                    ci[i] = 0;
                    newLines[i] = true;
                    // check end of line
                    endOfLines[i] = li[i] >= line.length;
                }
            }
            // if both moved to new lines, we can pinch off this area and start a new one
            if(newLines[0] && newLines[1]) {
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                areaCoords = [];
            }
            // break condition
            if(endOfLines[0] && endOfLines[1]) {
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                break;
            }
        }
        return areas;
    };
}
;// CONCATENATED MODULE: ./src/sg.draw.points.js


/* harmony default export */ function sg_draw_points(SimpleGraph, d3) {

    SimpleGraph.prototype.removePoints = function(series) {
        if(series === null || typeof series === "undefined") {
            this.svgGraph.selectAll(".sg-point").remove();
        } else {
            series = Array.isArray(series) ? series : [series];
            this.svgGraph.selectAll(".sg-point")
                .filter(d => ~series.indexOf(d.series))
                .remove();
        }
        return this;
    };

    SimpleGraph.prototype.drawPoints = function(showNulls, transition) {
        this.removePoints();

        if(!this.points || this.points.length === 0) return this;

        var drawPointsData = this.points;
        // if necessary, remove points that extend beyond graph
        if(!this.allowDrawBeyondGraph) {
            drawPointsData = drawPointsData.filter(d => {
                if((!d.x && d.x !== 0) || Number.isNaN(d.x)) return false;
                if(d.x < this.x.min || d.x > this.x.max) return false;
                if(this.x.break && d.x > this.x.break.domain[0] && d.x < this.x.break.domain[1]) return false;
                if(!showNulls && isNaN(d.y)) return false;
                let yAxis = d.y2 ? this.y2 : this.y;
                if(d.y < yAxis.min || d.y > yAxis.max) return false;
                if(yAxis.break && d.y > yAxis.break.domain[0] && d.y < yAxis.break.domain[1]) return false;
                return true;
            });
        }
        if(!drawPointsData.length) return this;

        var pointsDataBySeries = {};
        drawPointsData.forEach(d => {
            if(!(d.series in pointsDataBySeries)) {
                pointsDataBySeries[d.series] = [d];
            } else {
                pointsDataBySeries[d.series].push(d);
            }
        });

        for(let series in pointsDataBySeries) {
            this._drawPoints(
                this.svgGraph.selectAll(".sg-temporary-point").data(pointsDataBySeries[series]).enter(), 
                this.ptSeriesShapes[series], 
                transition
            );
        }

        return this;
    };

    SimpleGraph.prototype.drawUpdatePoints = function(showNulls, transition) {
        if(!this.points || this.points.length === 0) {
            this.removePoints();
            this.removePointLines();
            return this;
        }

        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
        }
        
        var drawPointsData = this.points;
        // if necessary, remove points that extend beyond graph
        if(!this.allowDrawBeyondGraph) {
            drawPointsData = drawPointsData.filter(d => {
                if((!d.x && d.x !== 0) || Number.isNaN(d.x)) return false;
                if(d.x < this.x.min || d.x > this.x.max) return false;
                if(this.x.break && d.x > this.x.break.domain[0] && d.x < this.x.break.domain[1]) return false;
                if(!showNulls && isNaN(d.y)) return false;
                let yAxis = d.y2 ? this.y2 : this.y;
                if(d.y < yAxis.min || d.y > yAxis.max) return false;
                if(yAxis.break && d.y > yAxis.break.domain[0] && d.y < yAxis.break.domain[1]) return false;
                return true;
            });
        }

        var pointsDataBySeries = {};
        drawPointsData.forEach(d => {
            if(!(d.series in pointsDataBySeries)) {
                pointsDataBySeries[d.series] = [d];
            } else {
                pointsDataBySeries[d.series].push(d);
            }
        });

        for(let series in pointsDataBySeries) {
            var data = pointsDataBySeries[series], 
                shape = this.ptSeriesShapes[series], 
                selection = this.svgGraph.selectAll(".sg-point")
                    .filter(d => d.series === series);

            // remove points that no longer exist and reselect (for those that will need modifying)
            selection.filter(d => !~data.indexOf(d)).remove();
            selection = selection.filter(d => ~data.indexOf(d));

            // add new points
            var newData = [...data];
            selection.each(d => {
                let exists = newData.indexOf(d);
                if(~exists) newData.splice(exists, 1);
            });
            this._drawPoints(
                this.svgGraph.selectAll(".sg-temporary-point").data(newData).enter(), 
                shape, 
                transition
            );

            // update existing points
            this._updatePoints(selection, shape, transition);
        }

        return this;
    };

    SimpleGraph.prototype._drawPoints = function(selection, shape, transition) {
        if(!selection.size()) return;
        var items;
        switch(shape) {
            case "triangle":
            case "triangle-up":
            case "triangle-down":
                items = selection.append("polygon");
                break;
            case "square":
            case "diamond":
                items = selection.append("rect");
                break;
            default:
            case "circle":
                items = selection.append("circle");
                break;
        }
        items = this._formatPoint(items, shape, transition);
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            items.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

    SimpleGraph.prototype._updatePoints = function(selection, shape, transition) {
        if(!selection.size()) return;
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            selection = selection.transition().duration(transition.duration).ease(transition.ease);
        }
        this._formatPoint(selection, shape);
    };

    SimpleGraph.prototype._formatPoint = function(selc, shape, fadeIn) {
        switch(shape) {
            case "triangle-down":
                selc.attr("series", d => d.series)
                    .style("opacity", fadeIn ? 0 : 1)
                    .attr("class", "sg-point sg-point-td")
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size() : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = this.x.scale(d.x), 
                            y = isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? this.y2.scale : this.y.scale)(y);
                        return `${x-hl},${y+hh} ${x},${y-hh} ${x+hl},${y+hh}`;
                    });
                break;
            case "triangle":
            case "triangle-up":
                selc.attr("series", d => d.series)
                    .style("opacity", fadeIn ? 0 : 1)
                    .attr("class", "sg-point sg-point-tu")
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size(d, d._bind) : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = this.x.scale(d.x), 
                            y = isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? this.y2.scale : this.y.scale)(y);
                        return `${x-hl},${y-hh} ${x},${y+hh} ${x+hl},${y-hh}`;
                    });
                break;
            case "square":
            case "diamond":
                selc.attr("series", d => d.series)
                    .style("opacity", fadeIn ? 0 : 1)
                    .attr("class", "sg-point sg-point-sd")
                    .attr("width", d => (typeof d.size === "function") ? d.size() : d.size)
                    .attr("height", d => (typeof d.size === "function") ? d.size() : d.size)
                    .attr("x", d => {
                        let size = (typeof d.size === "function") ? d.size() : d.size;
                        return this.x.scale(d.x)-size/2.0;
                    })
                    .attr("y", d => {
                        let y = isNaN(d.y) ? 0 : d.y, 
                            size = (typeof d.size === "function") ? d.size() : d.size;
                        return (d.y2 ? this.y2.scale : this.y.scale)(d.y)-size/2.0;
                    })
                    .attr("transform", d => {
                        if(shape !== "diamond") return "";
                        let y = isNaN(d.y) ? 0 : d.y;
                        return `rotate(45,${this.x.scale(d.x)},${(d.y2 ? this.y2.scale : this.y.scale)(y)})`
                    });
                break;
            default:
            case "circle":
                selc.style("opacity", fadeIn ? 0 : 1)
                    .attr("series", d => d.series)
                    .attr("class", "sg-point sg-point-cr")
                    .attr("r", d => (
                        0.5*(typeof d.size === "function" ? d.size(d) : d.size)
                    ))
                    .attr("cx", d => this.x.scale(d.x))
                    .attr("cy", d => {
                        let y = isNaN(d.y) ? 0 : d.y;
                        return (d.y2 ? this.y2.scale : this.y.scale)(y);
                    });
                break;
        }
        selc.style("fill", d => {
                let color = this.getColorBySeriesName(d.series, true);
                return typeof color === "function" ? color(d) : color;
            })
            .style("stroke", d => {
                let color = this.getColorBySeriesName(d.series, true);
                return typeof color === "function" ? color(d) : color;
            });
        return selc;
    };

}
;// CONCATENATED MODULE: ./src/sg.draw.lines.js


/* harmony default export */ function sg_draw_lines(SimpleGraph, d3) {

    SimpleGraph.prototype.removeAllLines = function(series) {
        return this.removeLines(series).removePointLines(series);
    };

    SimpleGraph.prototype.removeLines = function(series) {
        let removed;
        if(series === null || typeof series === "undefined") {
            removed = this.svgGraph.selectAll(".sg-line").remove();
        } else {
            removed = Array.isArray(series) ? series : [series];
            this.svgGraph.selectAll(".sg-line")
                .filter(d => ~series.indexOf(d.series))
                .remove();
        }
        removed.each(d => {
            d._segments = null;
            d._d3s = null;
        });
        return this;
    };

    SimpleGraph.prototype.removePointLines = function(series) {
        let removed;
        if(series === null || typeof series === "undefined") {
            removed = this.svgGraph.selectAll(".sg-point-line").remove();
        } else {
            removed = Array.isArray(series) ? series : [series];
            this.svgGraph.selectAll(".sg-point-line")
                .filter(d => ~series.indexOf(d.series))
                .remove();
        }
        removed.each(d => {
            d._segments = null;
            d._d3s = null;
        });
        return this;
    };

    SimpleGraph.prototype.drawAllLines = function(resolution, transition) {
        return this.drawPointLines().drawLines(resolution, transition);
    };

    SimpleGraph.prototype.drawLines = function(resolution, transition) {
        this.removeLines();
        // default and enforced minimum resolution for resolving from function
        if(!resolution && resolution !== 0) {
            resolution = 20;
        } else if(resolution <= 2) {
            resolution = 2;
        }
        if(!this.lines) return this;

        var self = this;
        this.lines.forEach(line => {
            if(line.lineFunction) {
                line._segments = self._getLineSegmentsFromFunction(
                    line.lineFunction, 
                    resolution, 
                    line.xRange, 
                    line.y2Axis, 
                    !self.allowDrawBeyondGraph
                );
            } else if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        this._drawLines(this.lines, "sg-line");

        return this;
    };

    SimpleGraph.prototype.drawPointLines = function(transition) {
        this.removePointLines();
        if(!this.pointLines) return this;

        var self = this;
        this.pointLines.forEach(line => {
            if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        this._drawLines(this.pointLines, "sg-point-line", transition);

        return this;
    };

    SimpleGraph.prototype.drawUpdateAllLines = function(resolution, transition) {
        return this.drawUpdateLines(resolution, transition).drawUpdatePointLines(transition);
    };

    SimpleGraph.prototype.drawUpdateLines = function(resolution, transition) {
        // defaults
        if(!resolution && resolution !== 0) {
            resolution = 20;
        } else if(resolution <= 2) {
            resolution = 2;
        }
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
        }

        var self = this;
        this.lines.forEach(line => {
            if(line.lineFunction) {
                line._segments = self._getLineSegmentsFromFunction(
                    line.lineFunction, 
                    resolution, 
                    line.xRange, 
                    line.y2Axis, 
                    !self.allowDrawBeyondGraph
                );
            } else if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        self._updateLines(this.lines, "sg-line", transition);

        return this;
    };

    SimpleGraph.prototype.drawUpdatePointLines = function(transition) {
        // defaults
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
        }

        var self = this;
        this.pointLines.forEach(line => {
            if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        self._updateLines(this.pointLines, "sg-point-line", transition);

        return this;
    };

    SimpleGraph.prototype._drawLines = function(lines, className, transition) {
        var self = this, 
            addedLines = this.svgGraph.selectAll(".sg-temporary-line")
                .data(lines)
              .enter().append("path")
                .attr("series", d => d.series)
                .attr("class", className)
                .style("opacity", transition ? 0 : 1)
                .style("fill", 'none')
                .attr("d", d => {
                    let yAxis = d.y2 ? this.y2 : this.y, 
                        d3line = d3.line()
                            .x(c => this.x.scale(c[0]))
                            .y(c => yAxis.scale(c[1]))
                            .curve(d.interpolate);
                    return d._segments.reduce(
                        (path, segment) => (path || "") + (segment.length < 2 ? "" : " " + d3line(segment)), 
                        ""
                    );
                })
                .each(function(d) {
                    // add styles
                    let nLine = d3.select(this), 
                        styles = d.style || {};
                    for(let key in styles) {
                        if(!transition || (key && key.toLowerCase() != "opacity")) {
                            nLine.style(key, styles[key]);
                        }
                    }
                    // add color if not specified
                    if(!('stroke' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        nLine.style('stroke', typeof color === "function" ? color(d) : color);
                    }
                    // attach
                    d._d3s = nLine;
                });
        // animate
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            addedLines.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

    SimpleGraph.prototype._updateLines = function(lines, className, transition) {
        if(!lines) return this;

        // remove, while also filter for new lines
        var newLines = lines.filter(line => {
            if(!line._segments || !line._segments.length || line._segments.filter(c => c.length < 2).length) {
                if(segments._d3s) {
                    line._d3s.remove();
                    line._d3s = null;
                }
                return false;
            }
            return !line._d3s;
        });
        
        // modify existing lines, transition if necessary
        var sel = this.svgGraph.selectAll("."+className);
        if(transition) {
            sel = sel.transition().duration(transition.duration).ease(transition.ease);
        }
        var self = this;
        sel.attr("d", d => {
                var yAxis = d.y2 ? this.y2 : this.y, 
                    d3line = d3.line()
                        .x(c => this.x.scale(c[0]))
                        .y(c => yAxis.scale(c[1]))
                        .curve(d.interpolate);
                return d._segments.reduce(
                    (path, segment) => (path || "") + (segment.length < 2 ? "" : " " + d3line(segment)), 
                    ""
                )
            })
            .each(function(d) {
                // update styles
                var nLine = d3.select(this), 
                    styles = d.style || {};
                for(var key in styles) {
                    nLine.style(key, styles[key]);
                }
                // add color if not specified
                if(!('stroke' in styles)) {
                    let color = self.getColorBySeriesName(d.series, true);
                    nLine.style('stroke', typeof color === "function" ? color(d) : color);
                }
            });

        // add new lines
        var addedLines = this.svgGraph.selectAll(".sg-temporary-line")
                .data(newLines)
              .enter().append("path")
                .attr("series", d => d.series)
                .attr("class", className)
                .style("opacity", transition ? 0 : 1)
                .style("fill", 'none')
                .attr("d", d => {
                    var yAxis = d.y2 ? self.y2 : self.y, 
                        d3line = d3.line()
                            .x(c => self.x.scale(c[0]))
                            .y(c => yAxis.scale(c[1]))
                            .curve(d.interpolate);
                    return d._segments.reduce(
                        (path, segment) => (path || "") + (segment.length < 2 ? "" : " " + d3line(segment)), 
                        ""
                    );
                })
                .each(function(d) {
                    // add styles
                    var nLine = d3.select(this), 
                        styles = d.style || {};
                    for(var key in styles) {
                        if(!transition || (key && key.toLowerCase() != "opacity")) {
                            nLine.style(key, styles[key]);
                        }
                    }
                    // add color if not specified
                    if(!('stroke' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        nLine.style('stroke', typeof color === "function" ? color(d) : color);
                    }
                    // attach
                    d._d3s = nLine;
                });
        // animate
        if(transition) {
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            addedLines.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

}
;// CONCATENATED MODULE: ./src/sg.draw.areas.js


/* harmony default export */ function sg_draw_areas(SimpleGraph, d3) {

    SimpleGraph.prototype.removeAreas = function(series) {
        if(series === null || typeof series === "undefined") {
            this.svgGraph.selectAll(".sg-area").remove();
        } else {
            removed = Array.isArray(series) ? series : [series];
            this.svgGraph.selectAll(".sg-area")
                .filter(d => ~series.indexOf(d.series))
                .remove();
        }
        return this;
    };

    SimpleGraph.prototype.drawAreas = function(resolution, transition) {
        this.removeAreas();
        // default and enforced minimum resolution for resolving from function
        if(!resolution && resolution !== 0) {
            resolution = 20;
        } else if(resolution <= 2) {
            resolution = 2;
        }
        if(!this.areas) return this;

        this.areas.forEach(area => {
            if(area.functions) {
                area._parts = this._getAreasPolysFromFunctions(
                    area.functions[0], 
                    area.functions[1], 
                    area.resolution, 
                    area.xRange, 
                    area.y2, 
                    !this.allowDrawBeyondGraph
                );
            } else if(this.allowDrawBeyondGraph) {
                area._parts = [area.coords];
            } else {
                area._parts = this._getAreaPolysFromCoordinates(area.coords, area.y2);
            }
            if(area._parts) area._parts = area._parts.filter(s => s && s.length >= 2);
        });
        this._drawAreas(resolution, transition);

        return this;
    };

    SimpleGraph.prototype.drawUpdateAreas = function(resolution, transition) {
        if(!resolution && resolution !== 0) {
            resolution = 20;
        } else if(resolution <= 2) {
            resolution = 2;
        }

        this.areas.forEach(area => {
            if(area.functions) {
                area._parts = this._getAreasPolysFromFunctions(
                    area.functions[0], 
                    area.functions[1], 
                    area.resolution, 
                    area.xRange, 
                    area.y2, 
                    !this.allowDrawBeyondGraph
                );
            } else if(this.allowDrawBeyondGraph) {
                area._parts = [area.coords];
            } else {
                area._parts = this._getAreaPolysFromCoordinates(area.coords, area.y2);
            }
            if(area._parts) area._parts = area._parts.filter(s => s && s.length >= 2);
        });
        this._updateAreas(transition);

        return this;
    };

    SimpleGraph.prototype._drawAreas = function(resolution, transition) {
        if(!this.areas) return;
        var self = this, 
            addedAreas = this.svgGraph.selectAll(".sg-temporary-area")
                .data(this.areas)
              .enter().append("path")
                .attr("series", d => d.series)
                .attr("class", "sg-area")
                .style("opacity", transition ? 0 : 1)
                .attr("d", d => {
                    let yAxis = d.y2 ? this.y2 : this.y, 
                        d3Area = d3.area()
                            .x(c => this.x.scale(c[0]))
                            .y0(c => yAxis.scale(c[1]))
                            .y1(c => yAxis.scale(c[2]))
                            .curve(d.interpolate);
                    return d._parts.reduce(
                        (path, area) => area.length < 2 ? path : path + " " + d3Area(area), 
                        ""
                    );
                })
                .each(function(d) {
                    // update styles
                    var nArea = d3.select(this), 
                        styles = d.style || {};
                    for(let key in styles) {
                        if(!transition || (key && key.toLowerCase() != "opacity")) {
                            nArea.style(key, styles[key]);
                        }
                    }
                    // add color if not specified
                    if(!('fill' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        nArea.style('fill', typeof color === "function" ? color(d) : color);
                    }
                    // attach
                    d._d3s = nArea;
                });
        // animate
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            addedAreas.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

    SimpleGraph.prototype._updateAreas = function(transition) {
        if(!this.areas) return;

        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
        }

        // remove, while also filter for new areas
        var newAreas = this.areas.filter(area => {
            if(!area._parts || !area._parts.length || area._parts.filter(c => c.length < 2).length) {
                if(segments._d3s) {
                    area._d3s.remove();
                    area._d3s = null;
                }
                return false;
            }
            return !area._d3s;
        });
        
        // modify existing areas, transition if necessary
        var sel = this.svgGraph.selectAll(".sg-area");
        if(transition) {
            sel = sel.transition().duration(transition.duration).ease(transition.ease);
        }
        var self = this;
        sel.attr("d", d => {
                let yAxis = d.y2 ? this.y2 : this.y, 
                    d3Area = d3.area()
                        .x(c => this.x.scale(c[0]))
                        .y0(c => yAxis.scale(c[1]))
                        .y1(c => yAxis.scale(c[2]))
                        .curve(d.interpolate);
                return d._parts.reduce(
                    (path, area) => area.length < 2 ? path : path + " " + d3Area(area), 
                    ""
                );
            })
            .each(function(d) {
                // update styles
                var nArea = d3.select(this), 
                    styles = d.style || {};
                for(let key in styles) {
                    nArea.style(key, styles[key]);
                }
                // add color if not specified
                if(!('fill' in styles)) {
                    let color = self.getColorBySeriesName(d.series, true);
                    nArea.style('fill', typeof color === "function" ? color(d) : color);
                }
            });

        // add new areas
        var addedAreas = this.svgGraph.selectAll(".sg-temporary-area")
                .data(newAreas)
              .enter().append("path")
                .attr("series", d => d.series)
                .attr("class", "sg-area")
                .style("opacity", transition ? 0 : 1)
                .attr("d", d => {
                    let yAxis = d.y2 ? this.y2 : this.y, 
                        d3Area = d3.area()
                            .x(c => this.x.scale(c[0]))
                            .y0(c => yAxis.scale(c[1]))
                            .y1(c => yAxis.scale(c[2]))
                            .curve(d.interpolate);
                    return d._parts.reduce(
                        (path, area) => area.length < 2 ? path : path + " " + d3Area(area), 
                        ""
                    );
                })
                .each(function(d) {
                    // update styles
                    var nArea = d3.select(this), 
                        styles = d.style || {};
                    for(let key in styles) {
                        if(!transition || (key && key.toLowerCase() != "opacity")) {
                            nArea.style(key, styles[key]);
                        }
                    }
                    // add color if not specified
                    if(!('fill' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        nArea.style('fill', typeof color === "function" ? color(d) : color);
                    }
                    // attach
                    d._d3s = nArea;
                });
        // animate
        if(transition) {
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            addedAreas.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

}
;// CONCATENATED MODULE: ./src/sg.tooltip.js
/* harmony default export */ function sg_tooltip(SimpleGraph, d3) {

    SimpleGraph.prototype.addTooltipToPoints = function(textFunction, forSeries, options) {
        forSeries = forSeries && !Array.isArray(forSeries) ? [forSeries] : forSeries;
        this.svgGraph.selectAll(".sg-point")
            .filter(d => !forSeries || ~forSeries.indexOf(d.series))
            .call(this._constructTooltipFunctionality(textFunction, options));
        return this;
    };

    SimpleGraph.prototype.addTooltipToLines = function(textFunction, forSeries, options) {
        forSeries = forSeries && !Array.isArray(forSeries) ? [forSeries] : forSeries;
        this.svgGraph.selectAll(".sg-line")
            .filter(d => !forSeries || ~forSeries.indexOf(d.series))
            .call(this._constructTooltipFunctionality(textFunction, options));
        return this;
    };

    SimpleGraph.prototype.addTooltipToAreas = function(textFunction, forSeries, options) {
        forSeries = forSeries && !Array.isArray(forSeries) ? [forSeries] : forSeries;
        this.svgGraph.selectAll(".sg-area")
            .filter(d => !forSeries || ~forSeries.indexOf(d.series))
            .call(this._constructTooltipFunctionality(textFunction, options));
        return this;
    };

    SimpleGraph.prototype._constructTooltipFunctionality = function(textFunction, options) {
        var gNode = this.svgGraph.node();

        return function(selection) {
            if(!selection) return null;
            if(!options) options = {};

            var d3Body = d3.select('body'), 
                tooltipOffset = options.offset || [15, 15], 
                // TODO: selection is no longer array-like, hides it in _groups var
                // this seems less than ideal, update/change when able
                selGroup = selection._groups[0], 
                tooltipDiv;

            selection.on("mouseover.sg-tooltip", function(evt, d) {
                // set relative position of tool-tip
                let absMousePos = d3.pointer(evt, d3Body.node()), 
                    styles;
                // Check if tooltip div already exists
                if(!tooltipDiv) {
                    // Clean up lost tooltips
                    d3Body.selectAll('.sg-tooltip').remove();
                    // Append tooltip 
                    tooltipDiv = d3Body.append('div');
                    tooltipDiv.attr('class', 'sg-tooltip');
                    // full styles
                    styles = {
                        'position': 'absolute', 
                        'left': (absMousePos[0] + tooltipOffset[0])+'px', 
                        'top': (absMousePos[1] + tooltipOffset[1])+'px', 
                        'z-index': 1001, 
                        'background-color': '#fff', 
                        'border': '1px solid #777', 
                        'border-radius': '4px', 
                        'padding': '4px 6px', 
                        'font-family': "'Century Gothic', CenturyGothic, Geneva, AppleGothic, sans-serif", 
                        'font-size': '12px'
                    };
                } else {
                    // just update position
                    styles = {
                        'left': (absMousePos[0] + tooltipOffset[0])+'px', 
                        'top': (absMousePos[1] + tooltipOffset[1])+'px'
                    };
                }
                for(let styleKey in styles) {
                    tooltipDiv.style(styleKey, styles[styleKey]);
                }
                // add custom styles if provided
                if(options.style) {
                    for(let styleKey in options.style) {
                        tooltipDiv.style(styleKey, options.style[styleKey]);
                    }
                }
                // additional trigger
                if(options.mouseover) options.mouseover(d, d3.pointer(evt, gNode), selGroup);
            })

            .on('mousemove.sg-tooltip', function(evt, d) {
                if(tooltipDiv) {
                    // Move tooltip
                    let absMousePos = d3.pointer(evt, d3Body.node());
                    tooltipDiv
                        .style('left', (absMousePos[0] + tooltipOffset[0])+'px')
                        .style('top', (absMousePos[1] + tooltipOffset[1])+'px');
                    let tooltipText = null;
                    if(textFunction) {
                        tooltipText = textFunction(d, d3.pointer(evt, gNode), selGroup);
                    }
                    // If no text, remove tooltip
                    if(!tooltipText) {
                        tooltipDiv.remove();
                        tooltipDiv = null;
                    } else {
                        tooltipDiv.html(tooltipText);
                    }
                }
            })

            .on("mouseout.sg-tooltip", function(evt, d) {
                // additional trigger
                if(options.mouseout) options.mouseout(d, d3.pointer(evt, gNode), selGroup);
                // Remove tooltip
                if(tooltipDiv) {
                    tooltipDiv.remove();
                    tooltipDiv = null;
                }
            });
        };
    };

    SimpleGraph.prototype.highlightPoints = function(series, validationCallback, size, fill, stylesDict) {
        var selectQuery = ".sg-point";
        if(series) { selectQuery += "[series='" + series + "']"; }
        var self = this;
        this.svgGraph.selectAll(selectQuery).each(function(d, i, s) {
            if(validationCallback && !validationCallback(d)) return;
            var xScale = self.x.scale, 
                yScale = d.y2 ? self.y2.scale : self.y.scale;
            if(!size) {
                size = d.wasNull ? 0 : (typeof d.pointsize === "function" ? d.pointsize() : d.pointsize);
            };
            if(!fill) {
                fill = d.wasNull ? "none" : self.getColorBySeriesName(d.series, true);
            };
            var realSize = size ? size : d.pointsize;
            if(typeof realSize === "function") {
                realSize = realSize.call(d);
            }
            var rect = self.svgGraph.append("rect")
                .attr("class", "sg-point-highlight")
                .attr("width", realSize)
                .attr("height", realSize)
                .attr("x", xScale(d.x)-realSize/2.0)
                .attr("y", yScale(d.y)-realSize/2.0)
                .attr("transform", "rotate(45," + xScale(d.x) + "," + yScale(d.y) + ")")
                .style("fill", fill);
            if(stylesDict) {
                for(var sKey in stylesDict) {
                    rect.style(sKey, stylesDict[sKey]);
                }
            }
        });
        return this;
    };

    SimpleGraph.prototype.removeHighlightPoints = function() {
        this.svgGraph.selectAll(".sg-point-highlight").remove();
        return this;
    };

    SimpleGraph.prototype.removeHighlights = function() {
        this.removeHighlightPoints();
        return this;
    };

    
}
;// CONCATENATED MODULE: ./src/sg.highlight.js
/* harmony default export */ function sg_highlight(SimpleGraph, d3) {

    SimpleGraph.prototype.removeHighlights = function() {
        return this.removeHighlightPoints()
                   .removeHighlightLines()
                   .removeHighlightAreas();
    };

    SimpleGraph.prototype.removeHighlightPoints = function() {
        this.svgGraph.selectAll(".sg-point-highlight").remove();
        this.svgGraph.selectAll(".sg-point.sg-highlight-hide")
                     .style("opacity", "")
                     .classed("sg-highlight-hide", false);
        return this;
    };

    SimpleGraph.prototype.removeHighlightLines = function() {
        this.svgGraph.selectAll(".sg-line-highlight").remove();
        this.svgGraph.selectAll(".sg-line.sg-highlight-hide")
                     .style("opacity", "")
                     .classed("sg-highlight-hide", false);
        return this;
    };

    SimpleGraph.prototype.removeHighlightAreas = function() {
        this.svgGraph.selectAll(".sg-area-highlight").remove();
        this.svgGraph.selectAll(".sg-area.sg-highlight-hide")
                     .style("opacity", "")
                     .classed("sg-highlight-hide", false);
        return this;
    };

    SimpleGraph.prototype._addBlurDefn = function() {
        if(!this.svgDefs.select("#sg-effect-blur").empty()) return;
        this.svgDefs
          .append("filter")
            .attr("id", "sg-effect-blur")
          .append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", 6);
    };

    SimpleGraph.prototype.highlightPoints = function(options) {
        options = options || {};
        if(options.series) {
            options.series = Array.isArray(options.series) ? options.series : [options.series];
        }
        this.svgGraph.selectAll(".sg-point").each((d, i, s) => {
            if(options.series && !~options.series.indexOf(d.series)) return;
            if(options.filter && !options.filter(this._clonePointData(d), s[i])) return;
            let highlight = d3.select(s[i].cloneNode(true)).attr("class", "sg-point-highlight"), 
                xScale    = this.x.scale, 
                yScale    = d.y2 ? this.y2.scale : this.y.scale, 
                x         = xScale(d.x), 
                y         = yScale(isNaN(d.y) ? 0 : d.y), 
                size      = options.size || d.size;
            if(typeof size === "function") size = size.call(d);
            switch(this.ptSeriesShapes[d.series]) {
                case "triangle":
                case "triangle-up":
                    size *= 2.0;
                    highlight.attr("points", d => {
                        let length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length;
                        return `${x-hl},${y-hh} ${x},${y+hh} ${x+hl},${y-hh}`;
                    });
                    break;
                case "triangle-down":
                    size *= 2.0;
                    highlight.attr("points", d => {
                        let length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length;
                        return `${x-hl},${y+hh} ${x},${y-hh} ${x+hl},${y+hh}`;
                    });
                    break;
                case "square":
                case "diamond":
                    highlight
                        .attr("width", size)
                        .attr("height", size)
                        .attr("x", x-size/2.0)
                        .attr("y", y-size/2.0);
                    break;
                default:
                case "circle":
                    highlight.attr("r", size);
                    break;
            }
            if(!options.nooutline) {
                highlight.style('stroke', '#000');
                highlight.style('stroke-width', '1');
            }
            if(options.style) {
                for(let sk in options.style) {
                    highlight.style(sk, options.style[sk]);
                }
            }
            highlight.style('pointer-events', 'none');
            this.svgGraph.node().append(highlight.node());
            d3.select(s[i]).classed("sg-highlight-hide", true)
                .style("opacity", "0");
        });
        return this;
    };

    SimpleGraph.prototype.highlightLines = function(options) {
        options = options || {};
        if(options.series) {
            options.series = Array.isArray(options.series) ? options.series : [options.series];
        }
        this._addBlurDefn();
        this.svgGraph.selectAll(".sg-line").each((d, i, s) => {
            if(options.series && !~options.series.indexOf(d.series)) return;
            if(options.filter && !options.filter(this._cloneLineData(d), s[i])) return;
            let front = d3.select(s[i].cloneNode(true)).attr("class", "sg-point-highlight"), 
                behind = null;
            if(!options.noblur) {
                behind = d3.select(s[i].cloneNode(true))
                    .attr("class", "sg-line-highlight")
                    .attr("filter", "url('#sg-effect-blur')")
                    .style("fill", 'none')
                    .style("filter", 'brightness(135%)')
                    .style("opacity", "0.7");
                if(options.blurstyle) {
                    for(let sk in options.blurstyle) {
                        behind.style(sk, options.blurstyle[sk]);
                    }
                }
                behind.style('pointer-events', 'none');
                this.svgGraph.node().append(behind.node());
            }
            if(options.style) {
                for(let sk in options.style) {
                    front.style(sk, options.style[sk]);
                }
            }
            front.style('pointer-events', 'none');
            this.svgGraph.node().append(front.node());
            d3.select(s[i]).classed("sg-highlight-hide", true)
                .style("opacity", "0");
        });
        return this;
    };

    SimpleGraph.prototype.highlightAreas = function(options) {
        options = options || {};
        if(options.series) {
            options.series = Array.isArray(options.series) ? options.series : [options.series];
        }
        this.svgGraph.selectAll(".sg-area").each((d, i, s) => {
            if(options.series && !~options.series.indexOf(d.series)) return;
            if(options.filter && !options.filter(this._cloneAreaData(d), s[i])) return;
            let highlight = d3.select(s[i].cloneNode(true))
                .attr("class", "sg-point-highlight")
                .style("opacity", "1");
            if(!options.nooutline) {
                highlight.style("stroke", "#000");
                highlight.style("stroke-width", "1.5")
            }
            if(options.style) {
                for(let sk in options.style) {
                    highlight.style(sk, options.style[sk]);
                }
            }
            highlight.style('pointer-events', 'none');
            this.svgGraph.node().append(highlight.node());
            d3.select(s[i]).classed("sg-highlight-hide", true)
                .style("opacity", "0");
        });
        return this;
    };

}
;// CONCATENATED MODULE: ./src/simple-graph.js
/*************************************************************************************************************
 * D3-Simple-Graph
 * @version v3.1.3
 * @author Lindsey Sim
 * @copyright 2025 - San Francisco Estuary Institute
 * @license This project is licensed under the GNU Lesser General Public License.
 ************************************************************************************************************/


function SimpleGraph(params) {
    // default params
    params           = params || {};
    params.container = params.container || "body";
    params.margins   = params.margins || {};
    params.axis      = params.axis || {};
    params.styles    = params.styles || {};
    
    // Option to allow drawing outside graph range.
    this.allowDrawBeyondGraph = !!params.allowDrawBeyondGraph;

    // adjust width and height by margins
    if(Array.isArray(params.margins)) {
        params.margins = {
            top:    params.margins[0], 
            right:  params.margins[1],
            bottom: params.margins[2], 
            left:   params.margins[3]
        };
    }
    this.margins = {
        left:   (!params.margins.left && params.margins.left !== 0)     ? 40 : params.margins.left, 
        right:  (!params.margins.right && params.margins.right !== 0)   ? 20 : params.margins.right, 
        top:    (!params.margins.top && params.margins.top !== 0)       ? 20 : params.margins.top, 
        bottom: (!params.margins.bottom && params.margins.bottom !== 0) ? 40 : params.margins.bottom
    };
    this.containerWidth  = params.width || 600;
    this.containerHeight = params.height || 400;
    this.width           = this.containerWidth - this.margins.left - this.margins.right;
    this.height          = this.containerHeight - this.margins.top - this.margins.bottom;
    
    // category color scale
    this.color = (params.colorScale) ? params.colorScale : external_d3_namespaceObject.scaleOrdinal(external_d3_namespaceObject.schemeCategory10);
    this.customColors = {};
    
    // create the SVG
    this.svg = external_d3_namespaceObject.select(params.container).append("svg")
        .attr("width", this.containerWidth)
        .attr("height", this.containerHeight)
        .style('font-family', "'Century Gothic', CenturyGothic, Geneva, AppleGothic, sans-serif")
        .style('overflow', 'visible');
    this.svgDefs = this.svg.append("defs");
    this.svgGraph = this.svg.append("g")
        .attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");
    
    // append styles, save to instance the default text-size
    for(let style in params.styles) {
        this.svg.style(style, params.styles[style]);
    }
    
    this.resetAxisOptions(params.axis);
    
    return this;
};

//************************************************************************************************************
// Basic Functions
//************************************************************************************************************
SimpleGraph.prototype.getSvgElement = function() {
    return this.svg;
};

SimpleGraph.prototype.getSvgGraphic = function() {
    return this.svgGraph;
};

SimpleGraph.prototype.remove = function() {
    this.svg.remove();
    return this;
};

SimpleGraph.prototype.destroy = function() {
    this.svg.remove();
    this.svg = null;
    this.svgGraph = null;
    this.clearAllData();
    this.color = null;
    this.customColors = null;
    this.x = null;
    this.y = null;
    this.minMax = null;
    this.xScale = null;
    this.yScale = null;
    this.yAxis = null;
    this.xAxis = null;
    this.yGridAxis = null;
    this.xGridAxis = null;
    this.points = null;
    this.ptSeriesShapes = null;
    this.lines = null;
    this.pointLines = null;
    this.areas = null;
};

//************************************************************************************************************
// Add modules
//************************************************************************************************************
// Axis functions

sg_axis(SimpleGraph, external_d3_namespaceObject);
// Color/category functions

sg_color(SimpleGraph, external_d3_namespaceObject);
// Grid and legend

sg_grid_legend(SimpleGraph, external_d3_namespaceObject);
// Data functions



sg_data_point(SimpleGraph, external_d3_namespaceObject);
sg_data_area(SimpleGraph, external_d3_namespaceObject);
sg_data_line(SimpleGraph, external_d3_namespaceObject);
// Draw functions




sg_draw_lib(SimpleGraph, external_d3_namespaceObject);
sg_draw_points(SimpleGraph, external_d3_namespaceObject);
sg_draw_lines(SimpleGraph, external_d3_namespaceObject);
sg_draw_areas(SimpleGraph, external_d3_namespaceObject);
// Interactivity functions


sg_tooltip(SimpleGraph, external_d3_namespaceObject);
sg_highlight(SimpleGraph, external_d3_namespaceObject);

//************************************************************************************************************
// Misc Functions
//************************************************************************************************************
SimpleGraph.prototype.clearAllData = function(series) {
    this.clearPointsData(series);
    this.clearLinesData(series);
    this.clearAreasData(series);
    return this;
};

SimpleGraph.prototype.removeAll = function(series) {
    this.removePoints(series).removeAllLines(series).removeAreas(series);
    return this;
};

SimpleGraph.prototype.saveAsPng = function(pngName) {
    if(!pngName) { pngName = "graph.png"; }
    if(!pngName.toLowerCase().endsWith(".png")) { pngName += ".png"; }
    
    let svgNode = this.svg
            .attr("version", "1.1")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .node();
        serializer = new XMLSerializer(), 
        svgHtml = serializer.serializeToString(svgNode), 
        canvas = document.createElement("canvas");
    canvas.style.display = "none";
    canvas.width = this.containerWidth;
    canvas.height = this.containerHeight;
    
    // because internet explorer, this is only way around the security error (requires canvg library which is 
    // not explicitly required, assumed loaded somewhere on the page globally)
    // if(navigator.msSaveBlob && canvg) {
    //     // have to manually replace the width/height in cases of bottom-buffer IE hack for resizable graphs
    //     svgHtml = svgHtml.replace("style=\"width: 100%; height: 1px;", "style=\"width:" + this.containerWidth + "px; height:" + this.containerHeight + "px;");
    //     // draw via canvg, which is totally redudant if not for the fact this is only way to bypass security error
    //     canvg(canvas, svgHtml);
    //     navigator.msSaveBlob(
    //         new Blob([canvas.msToBlob()], {type:"image/png"}), 
    //         pngName
    //     );
    //     return this;
    // }
    
    let a = document.createElement("a");
    a.style.display = "none";
    a.download = pngName;
    this.svg.node().parentNode.appendChild(a);
    
    let img = new Image();
    img.onload = function() {
        canvas.getContext("2d").drawImage(img, 0, 0);
        // freaking internet explorer..
        // if(navigator.msSaveBlob) {
        //     try {
        //         navigator.msSaveBlob(
        //             new Blob([canvas.msToBlob()], {type:"image/png"}), 
        //             pngName
        //         );
        //     } catch(e) {
        //         // still doesn't work because of overly strict security restrictions in IE
        //         alert("Sorry, SVG to PNG downloads are restricted in Internet Explorer, please try with another browser.");
        //     }1
        a.href = canvas.toDataURL("image/png");
        a.click();
        a.parentElement.removeChild(a);
        canvas.remove();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgHtml)));
};

/* harmony default export */ const simple_graph = (SimpleGraph);
var __webpack_exports__default = __webpack_exports__.A;
export { __webpack_exports__default as default };
