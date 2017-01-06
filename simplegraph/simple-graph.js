/*************************************************************************************************************
 * SimpleGraph
 *
 * @author Lawrence Sim
 * @copyright 2016 - San Francisco Estuary Institute
 
 * @license
 * Copyright (c) 2016 - San Francisco Estuary Institute
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 * associated documentation files (the "Software"), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO 
 * EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER 
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
 * THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ************************************************************************************************************/

// START IIFE (Immediately-Invoked Function Expression) Constructor
!function(root, factory) {
	// Because Internet Explorer.. All credit due to Mathias Bynens <https://mathiasbynens.be/>
	if(!String.prototype.startsWith) {
		(function() {
			'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
			var defineProperty = (function() {
				// IE 8 only supports `Object.defineProperty` on DOM elements
				try {
					var object = {};
					var $defineProperty = Object.defineProperty;
					var result = $defineProperty(object, object, object) && $defineProperty;
				} catch(error) {}
				return result;
			}());
			var toString = {}.toString;
			var startsWith = function(search) {
				if (this == null) {
					throw TypeError();
				}
				var string = String(this);
				if (search && toString.call(search) == '[object RegExp]') {
					throw TypeError();
				}
				var stringLength = string.length;
				var searchString = String(search);
				var searchLength = searchString.length;
				var position = arguments.length > 1 ? arguments[1] : undefined;
				// `ToInteger`
				var pos = position ? Number(position) : 0;
				if (pos != pos) { // better `isNaN`
					pos = 0;
				}
				var start = Math.min(Math.max(pos, 0), stringLength);
				// Avoid the `indexOf` call if no match is possible
				if (searchLength + start > stringLength) {
					return false;
				}
				var index = -1;
				while (++index < searchLength) {
					if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
						return false;
					}
				}
				return true;
			};
			if (defineProperty) {
				defineProperty(String.prototype, 'startsWith', {
					'value': startsWith,
					'configurable': true,
					'writable': true
				});
			} else {
				String.prototype.startsWith = startsWith;
			}
		}());
	}
	if(!String.prototype.endsWith) {
		(function() {
			'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
			var defineProperty = (function() {
				// IE 8 only supports `Object.defineProperty` on DOM elements
				try {
					var object = {};
					var $defineProperty = Object.defineProperty;
					var result = $defineProperty(object, object, object) && $defineProperty;
				} catch(error) {}
				return result;
			}());
			var toString = {}.toString;
			var endsWith = function(search) {
				if (this == null) {
					throw TypeError();
				}
				var string = String(this);
				if (search && toString.call(search) == '[object RegExp]') {
					throw TypeError();
				}
				var stringLength = string.length;
				var searchString = String(search);
				var searchLength = searchString.length;
				var pos = stringLength;
				if (arguments.length > 1) {
					var position = arguments[1];
					if (position !== undefined) {
						// `ToInteger`
						pos = position ? Number(position) : 0;
						if (pos != pos) { // better `isNaN`
							pos = 0;
						}
					}
				}
				var end = Math.min(Math.max(pos, 0), stringLength);
				var start = end - searchLength;
				if (start < 0) {
					return false;
				}
				var index = -1;
				while (++index < searchLength) {
					if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
						return false;
					}
				}
				return true;
			};
			if (defineProperty) {
				defineProperty(String.prototype, 'endsWith', {
					'value': endsWith,
					'configurable': true,
					'writable': true
				});
			} else {
				String.prototype.endsWith = endsWith;
			}
		}());
	}
	
	// CommonJS-based (e.g. NodeJS) API
	if(typeof module === "object" && module.exports) {
		module.exports = factory(require("d3"));
	// AMD-based (e.g. RequireJS) API
	} else if(typeof define === "function" && define.amd) {
		define(["d3"], factory);
	// Regular instantiation 
	} else {
		root.SimpleGraph = factory(root.d3);
	}
	
}(this, function(d3) {

/**
 * Create a SimpleGraph instance and draw an empty graph.
 * @param {Object} [options] - Object literal of options (all optional).
 * @param {string} [options.container='body'] - The DOM element query/selector to the element to append the 
 *        graph to.
 * @param {number} [options.width=600] - Width value.
 * @param {number} [options.height=600] - Height value).
 * @param {Object} [options.margins={top:20,right:20,bottom:40,left:40}] - Margins for graph within 
 *        overarching SVG (e.g. with all default values, the width of the actual graph will be 540px in a 
 *        600px wide SVG element).
 * @param {d3.scale} [options.colorScale=d3.scaleOrdinal(d3.schemeCategory10)] - Optional color scale to use 
 *        with data. If data series will have non-numeric identifiers, it should be a categorical or ordinal 
 *        scale.
 * @param {boolean} [allowDrawBeyondGraph=false] - Allow drawing beyond graph. If true, all data will be drawn 
 *        as supplied. If false, points beyond the x/y-axis range will not be drawn and lines/areas will be 
 *        cut off where they extend past the x/y-axis ranges.
 * @param {Object} [options.axis] - Optional dictionary of axis options. See resetAxisOptions() for details.
 */
function SimpleGraph(options) {
	// otherwise reaching too deep will cause errors
	if(!options)             { options = {}; }
	if(!options.container)   { options.container = "body"; }
	if(!options.margins)     { options.margins = {}; }
	if(!options.axis)        { options.axis = {}; }
	
	// Option to allow drawing outside graph range.
	this.allowDrawBeyondGraph = options.allowDrawBeyondGraph;

	// adjust width and height by margins
	this.margins = {
		left: (!options.margins.left && options.margins.left !== 0) ? 40 : options.margins.left, 
		right: (!options.margins.right && options.margins.left !== 0) ? 20 : options.margins.right, 
		top: (!options.margins.top && options.margins.left !== 0) ? 20 : options.margins.top, 
		bottom: (!options.margins.bottom && options.margins.left !== 0) ? 40 : options.margins.bottom
	};
	this.containerWidth = ((options.width) ?  options.width : 600);
	this.containerHeight = ((options.height) ?  options.height : 400);
	this.width = this.containerWidth - this.margins.left - this.margins.right;
	this.height = this.containerHeight - this.margins.top - this.margins.bottom;
	
	// category color scale
	this.color = (options.colorScale) ? options.colorScale : d3.scaleOrdinal(d3.schemeCategory10);
	this.customColors = {};
	
	// create the SVG
	this.svg = d3.select(options.container).append("svg")
		.attr("width", this.containerWidth)
		.attr("height", this.containerHeight)
		.style('font-family', "'Century Gothic', CenturyGothic, Geneva, AppleGothic, sans-serif")
		.style('font-size', '14px')
		.style('overflow', 'visible');
	this.svgGraph = this.svg.append("g")
		.attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");
	
	this.resetAxisOptions(options.axis);
};

/**
 * Set axes. As calling this will invalidating anything drawn on the graph, all data is cleared from the graph
 * on calling this.
 * @param {Object} [axisOptions] -Dictionary of axis options per axes (keys being x, y, and optionally, y2).
 * @param {Object} [axisOptions.style={fill:"none",'stroke-width':0.5,stroke:'black'}] - Shared styles for 
 *        both axes stored as key-value pairs where each key is the name of an appropriate style.
 * @param {Object} [axisOptions.x] - X-axis options object (further expanded below).
 * @param {Object} [axisOptions.y] - Y-axis options object (same as expanded x-axis options below, so not 
 *        duplicated).
 * @param {Object} [axisOptions.y2] - Second y-axis options object (same as expanded x-axis options below, so 
 *        not duplicated).
 * @param {string} [axisOptions.x.format=".0f"] - Number format for tick labels.
 * @param {number} [axisOptions.x.min=0] - Minimum value on axis 
 * @param {number} [axisOptions.x.max=100] - Maximum value on axis.
 * @param {string} [axisOptions.x.label="x-value"] - Axis label.
 * @param {Object} [axisOptions.x.scale=d3.scale.linear] - Optional class for scale type. Must be d3 scale.
 * @param {Object} [axisOptions.x.logBase=10] - Optional base number if using logarithmic scale.
 * @param {number[]} [axisOptions.x.tickValues] - Specific values on x-axis to create tick marks on (this 
 *        will take priority over axisOptions.x.ticks if both are supplied).
 * @param {number} [axisOptions.x.ticks] - Number of evenly spaced tick intervals on x-axis to create (due 
 *        to nature of axis, may not always create exactly this amount but will attempt to).
 * @param {Object} [axisOptions.x.grid] - Optional dictionary of axis-grid options.
 * @param {number[]} [axisOptions.x.grid.tickValues] - Specific values on x-axis grid to create tick marks on
 *        (this will take priority over axisOptions.x.grid.ticks if both are supplied).
 * @param {number} [axisOptions.x.grid.ticks] - Number of evenly spaced tick intervals on x-axis grid to 
 *        create (due to nature of axis, may not always create exactly this amount but will attempt to).
 */
SimpleGraph.prototype.resetAxisOptions = function(axisOptions) {
	if(!axisOptions)        { axisOptions = {}; }
	if(!axisOptions.x)      { axisOptions.x = {}; }
	if(!axisOptions.y)      { axisOptions.y = {}; }
	if(!axisOptions.styles) { axisOptions.styles = {}; }
	
	// default axis styles
	this.axisStyles = axisOptions.style;
	if(!this.axisStyles) {
		this.axisStyles = {};
	}
	if(!this.axisStyles.fill) {
		this.axisStyles.fill = "none";
	}
	if(!this.axisStyles['stroke-width']) {
		this.axisStyles['stroke-width'] = 0.5;
	}
	if(!this.axisStyles.stroke) {
		this.axisStyles.stroke = "black";
	}
	
	// loop per axis to remove redundancies
	var axes = ["x", "y", "y2"];
	for(var i = 0; i < axes.length; i++) {
		// specific axis options
		var a = axes[i];
		if(!axisOptions[a]) {
			// if no second y-axis, just skip
			if(a === "y2") { continue; }
			axisOptions[a] = {};
		}
		if(!axisOptions[a].scale) {
			axisOptions[a].scale = d3.scaleLinear;
		}
		var scaleIsTime = axisOptions[a].scale === d3.scaleTime || axisOptions[a].scale === d3.scaleUtc;
		var scaleIsLog = !scaleIsTime && axisOptions[a].scale === d3.scaleLog;
		if(!axisOptions[a].format) {
			if(scaleIsTime) {
				axisOptions[a].format = "%Y-%m-%d";
			} else {
				axisOptions[a].format = ".0f";
			}
		}
		if(!axisOptions[a].grid) { axisOptions[a].grid = {}; }
		if(scaleIsLog && !axisOptions[a].logBase) { axisOptions[a].logBase = 10; }
		
		this[a] = {
			label: (axisOptions[a].label === null) ? (a === "x" ? "x-value" : "y-value") : axisOptions[a].label, 
			isDate: scaleIsTime, 
			isLog: scaleIsLog
		};
		if(scaleIsTime) {
			if(axisOptions[a].scale === d3.time.scale.utc) {
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
		if(scaleIsLog) {
			this[a].scale.base(axisOptions[a].logBase);
		}
		this[a].scale
			.domain([this[a].min, this[a].max])
			.range(a === "x" ? [0, this.width] : [this.height, 0]);
	
		// create axes
		if(a === "x") {
			// note axis will be reconstructed at drawing since top/bottom specified there
			this[a].axis = d3.axisBottom(this[a].scale);
			this[a].gridAxis = d3.axisBottom(this[a].scale);
		} else {
			if(a === "y2") {
				this[a].axis = d3.axisRight(this[a].scale);
				this[a].gridAxis = d3.axisRight(this[a].scale);
			} else {
				this[a].axis = d3.axisLeft(this[a].scale);
				this[a].gridAxis = d3.axisLeft(this[a].scale);
			}
		}
		
		// log scale handles ticks differently
		if(scaleIsLog) {
			this[a].axis.tickFormat(this[a].format);
			if(axisOptions[a].ticks) {
				this[a].axis.ticks(axisOptions[a].ticks, this[a].format);
			} else {
				this[a].axis.ticks(this[a].format);
				if(axisOptions[a].tickValues) {
					this[a].axis.tickValues(axisOptions[a].tickValues);
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
		}
	}
	
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
};


//************************************************************************************************************
// Basic Functions
//************************************************************************************************************
/**
 * Get the SVG element
 * @returns {object} the D3 SVG element
 */
SimpleGraph.prototype.getSvgElement = function() {	
	return this.svg;
};

/**
 * Get the SVG 'g' (graphic) element
 * @returns {object} the D3 SVG element
 */
SimpleGraph.prototype.getSvgGraphic = function() {	
	return this.svgGraph;
};

/**
 * Remove the SVG graph from its container, but preserve the object.
 */
SimpleGraph.prototype.remove = function() {
	this.svg.remove();
};

/**
 * Remove and destroy this object.
 */
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
};


//************************************************************************************************************
// Common Drawing Functions
//************************************************************************************************************
/**
 * (Re)draw axes on graph.
 * @param {string} [labelPosition="outside center"] - Keywords for the label positions on each axis. Keywords 
 *        include 'inside' or 'outside' for the position of both axis labels either inside or outside of the 
 *        axis lines; 'center' to center both axis labels along parallel of respective axis; 'left' or 'right'
 *        to determine placement of x-axis label along axis parallel; 'top' or 'bottom' to determine placement
 *        of y-axis label along axis parallel. Keywords are assigned in the order they are read. Thus a call 
 *        of "center top" would first center both labels, then move the y-axis label to the top.
 * @param {string} [xAxisPosition="bottom"] - Placement option of the x-axis, allowing you to draw the x-axis 
 *        line and labels on top or bottom.
 * @param {number} [axisLabelMargin=0] - Labels are automatically placed at a margin determined not to overlap
 *        with the tick marks. However you may specify and additional margin here.
 */
SimpleGraph.prototype.drawAxes = function(labelPosition, xAxisPosition, axisLabelMargin) {
	if(!xAxisPosition) { 
		xAxisPosition = "bottom"; 
	} else {
		xAxisPosition = xAxisPosition.toLowerCase().trim();
		if(xAxisPosition !== "top") { xAxisPosition = "bottom"; }
	}
	var xAxisPosY = 0;
	if(xAxisPosition === "top") {
		this.x.axis = d3.axisTop(this.x.scale);
	} else {
		this.x.axis = d3.axisBottom(this.x.scale);
		xAxisPosY = this.height;
	}
	if(!axisLabelMargin) { axisLabelMargin = 0; }
	
	// draw axes first without labels
	this.svg.selectAll(".scatterplot-xaxis, .scatterplot-yaxis, .scatterplot-y2axis, .axis-label").remove();
	var xAxisG = this.svgGraph.append("g")
		.attr("class", "scatterplot-xaxis")
		.attr("transform", "translate(0," + xAxisPosY + ")")
		.call(this.x.axis);
	var yAxisG = this.svgGraph.append("g")
		.attr("class", "scatterplot-yaxis")
		.call(this.y.axis);
	var y2AxisG = !this.y2 ? null : this.svgGraph.append("g")
		.attr("class", "scatterplot-y2axis")
		.attr("transform", "translate(" + this.width + ",0)")
		.call(this.y2.axis);
	// for some reason ticks are by default invisible
	this.svgGraph.selectAll(".tick line").style("stroke", "#000");
	// add styles
	var axes = this.svgGraph.selectAll(".scatterplot-xaxis .domain, .scatterplot-yaxis .domain, .scatterplot-y2axis .domain");
	for(var style in this.axisStyles) {
		axes.style(style, this.axisStyles[style]);
	}
	
	// get size of ticks to know margin to place labels away if outside
	var tickMargin = { x: 0, y: 0, y2: 0 };
	this.svgGraph.selectAll(".scatterplot-xaxis .tick").each(function() {
		if(this.getBBox().height > tickMargin.x) {
			tickMargin.x = this.getBBox().height;
		}
	});
	this.svgGraph.selectAll(".scatterplot-yaxis .tick").each(function() {
		if(this.getBBox().width > tickMargin.y) {
			tickMargin.y = this.getBBox().width;
		}
	});
	this.svgGraph.selectAll(".scatterplot-y2axis .tick").each(function() {
		if(this.getBBox().width > tickMargin.y2) {
			tickMargin.y2 = this.getBBox().width;
		}
	});
	
	// default position on center-outside
	var xLabelPos = {
		a: 'middle', 
		x: 0.5*this.width,
		y: (xAxisPosition === "top") ? -(tickMargin.x + axisLabelMargin) : (tickMargin.x + 10 + axisLabelMargin)
	};
	var yLabelPos = {
		a: 'middle', 
		x: -0.5*this.height,
		y: -(tickMargin.y + 10 + axisLabelMargin)
	};
	var y2LabelPos = {
		a: 'middle', 
		x: 0.5*this.height,
		y: -(tickMargin.y2 + 10 + axisLabelMargin)
	};
	// determine label position
	if(labelPosition) {
		// split by keys
		var lpKeys = labelPosition.toLowerCase().split(/[ ,]+/);
		var xparallel = "center", yparallel = "center", perpendicular = "outside";
		for(var i = 0; i < lpKeys.length; i++) {
			if(lpKeys[i] === "outside") {
				xLabelPos.y =(xAxisPosition === "top") ? -(tickMargin.x + axisLabelMargin) : (tickMargin.x + 10 + axisLabelMargin);
				yLabelPos.y = -(tickMargin.y + 10 + axisLabelMargin);
				y2LabelPos.y = -(tickMargin.y2 + 10 + axisLabelMargin);
				perpendicular = "outside";
			} else if(lpKeys[i] === "inside") {
				xLabelPos.y = (xAxisPosition === "top") ? (14 + axisLabelMargin) : -(6 + axisLabelMargin);
				yLabelPos.y = 6 + axisLabelMargin;
				y2LabelPos.y = yLabelPos.y;
				perpendicular = "inside";
			} else if(lpKeys[i] === "center") {
				xLabelPos.a = 'middle';
				xLabelPos.x = 0.5*this.width;
				yLabelPos.a = 'middle';
				yLabelPos.x = -0.5*this.height;
				y2LabelPos.a = 'middle';
				y2LabelPos.x = -yLabelPos.x;
				xparallel = "center";
				yparallel = "center";
			} else if(lpKeys[i] === "left") {
				xLabelPos.a = 'start';
				xLabelPos.x = 0;
				xparallel = "left";
			} else if(lpKeys[i] === "right") {
				xLabelPos.a = 'end';
				xLabelPos.x = this.width;
				xparallel = "right";
			} else if(lpKeys[i] === "top") {
				yLabelPos.a = 'end';
				yLabelPos.x = 0;
				y2LabelPos.a = 'start';
				y2LabelPos.x = -yLabelPos.x;
				yparallel = "top";
			} else if(lpKeys[i] === "bottom") {
				yLabelPos.a = 'start';
				yLabelPos.x = -this.height;
				y2LabelPos.a = 'end';
				y2LabelPos.x = -yLabelPos.x;
				yparallel = "bottom";
			}
		}
		// if near axis crossing, needs some extra padding
		if(perpendicular === "inside") {
			if(xparallel === "left") {
				xLabelPos.x += 10;
			} else if(xparallel === "right" && this.y2) {
				xLabelPos.x -= 10;
			}
			if(xAxisPosition === "bottom") {
				if(yparallel === "bottom") {
					yLabelPos.x += 10;
					y2LabelPos.x -= 10;
					if(xparallel === "left") {
						xLabelPos.x += 10;
						yLabelPos.x += 10;
					} else if(xparallel === "right" && this.y2) {
						xLabelPos.x -= 10;
						y2LabelPos.x -= 10;
					}
				} else {
					yLabelPos.x -= 10;
					y2LabelPos.x += 10;
				}
			} else {
				if(yparallel === "top") {
					yLabelPos.x -= 10;
					y2LabelPos.x += 10;
					if(xparallel === "left") {
						xLabelPos.x += 10;
						yLabelPos.x -= 10;
					} else if(xparallel === "right" && this.y2) {
						xLabelPos.x -= 10;
						y2LabelPos.x += 10;
					}
				} else {
					yLabelPos.x += 10;
					y2LabelPos.x -= 10;
				}
			}
		}
	}
	
	// add labels
	xAxisG.append("text")
		.attr("class", "axis-label scatterplot-xaxis")
		.attr("x", xLabelPos.x)
		.attr("y", xLabelPos.y)
		.attr("fill", "#000")
		.style("text-anchor", xLabelPos.a)
		.style("font-weight", "bolder")
		.text(this.x.label);
	yAxisG.append("text")
		.attr("class", "axis-label scatterplot-yaxis")
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
			.attr("class", "axis-label scatterplot-y2axis")
			.attr("transform", "rotate(90)")
			.attr("x", y2LabelPos.x)
			.attr("y", y2LabelPos.y)
			.attr("dy", ".71em")
			.attr("fill", "#000")
			.style("text-anchor", y2LabelPos.a)
			.style("font-weight", "bolder")
			.text(this.y2.label);
	}
};

/**
 * Add grid over graph.
 * @param {Object} [style={opacity:0.4,stroke:"#555",'stroke-width':0.3}]
 */
SimpleGraph.prototype.drawGrid = function(style) {
	this.svgGraph.selectAll(".scatterplot-grid").remove();
	// default styles
	var opacity = (style && style.opacity) ? parseFloat(style.opacity) : 0.4;
	var stroke = (style && style.stroke) ? style.stroke : "#555";
	var strokeWidth = (style && style['stroke-width']) ? parseFloat(style['stroke-width']) : 0.3;
	
	this.svgGraph.append("g")
		.attr("class", "scatterplot-grid")
		.attr("transform", "translate(0," + this.height + ")")
		.style("opacity", opacity)
		.style("stroke", stroke)
		.style("stroke-width", strokeWidth)
		.call(this.x.gridAxis.tickSize(-this.height).tickFormat(""));
	this.svgGraph.append("g")
		.attr("class", "scatterplot-grid")
		.attr("opacity", opacity)
		.style("stroke", stroke)
		.style("stroke-width", strokeWidth)
		.call(this.y.gridAxis.tickSize(-this.width).tickFormat(""));
};

/**
 * Remove grid, if it exists.
 */
SimpleGraph.prototype.removeGrid = function() {
	this.svgGraph.selectAll(".scatterplot-grid").remove();
};

/**
 * Draw the legend onto the graph. If legend already exists, will redraw it.
 * @param {number[]} position - x,y coordinate position from top-left corner of SVG.
 * @param {string} [anchor="left"] - Optional anchor for the coordinate x-position (left, middle, or right).
 * @param {Object} [bgstyle] - Optional styles for the legend. These are SVG style attributes with the 
 *        exception of support for padding.
 * @param {number} [itemsPerColumn=0] - Optional limit on items per column. On reaching this number, a new 
 *        column will be started to the right. If set to 0 or less, infinite (that is, all will be put in 
 *        single column). Note that if the next column exceeds the right margin of the graph, placement errors
 *        will result.
 * @param {number} [rowHeight=24] - The height per row. Default is set to best fit size of text and icons in 
 *        legend (the second which is currently uncustomizable) so use care if decreasing row height.
 */
SimpleGraph.prototype.drawLegend = function(position, anchor, bgstyle, itemsPerColumn, rowHeight, exclude) {
	this.svg.selectAll(".scatterplot-legend").remove();
	
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
	if(!anchor) {
		anchor = "left";
	}
	
	if(!exclude) { exclude = []; }
	if(typeof exclude === "string") { exclude = exclude.trim().split(/\s+/); }
	for(var i = 0; i < exclude.length; i++) { exclude[i] = exclude[i].toLowerCase(); }
	
	// default styles for legend container (padding is set via explicit sides)
	if(!bgstyle) { bgstyle = {}; }
	if(bgstyle.padding) {
		var pads = (typeof bgstyle.padding === "string") ? bgstyle.padding.split(" ") : [bgstyle.padding];
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
		.attr("class", "scatterplot-legend")
		.attr("transform", "translate(" + position.x + "," + position.y + ")");
	var legendBg = legend.append("rect")
		.attr("class", "scatterplot-legend-bg")
		.attr("x", 0)
		.attr("y", 0);
	for(var skey in bgstyle) {
		if(!skey.startsWith('padding')) {
			legendBg.style(skey, bgstyle[skey]);
		}
	}
	
	// column parameters
	if(!itemsPerColumn) { itemsPerColumn = 0; }
	if(!rowHeight) { rowHeight = 24; }
	var columnNumber = 0;
	var columnItemCount = 0;
	// running position for next item
	var yOffset = bgstyle['padding-top'];
	var xOffset = bgstyle['padding-left'];
	
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
	function addPointItem(data, drawPointLine) {
		if(drawPointLine) {
			var lineOffset = yOffset + 10;
			var path = legend.append("path")
				.attr("x", xOffset)
				.attr("y", yOffset)
				.attr("d", 
					"M" + xOffset + " " + lineOffset + " " + 
					"L" + (18+xOffset) + " " + lineOffset
				);
			// remember styles are only stored in first since they're shared
			for(var style in self.pointLines[0].style) {
				path.style(style, self.pointLines[0].style[style]);
			}
			path.style("stroke", self.getColorBySeriesName(data.series));
		}
		var size = (typeof data.pointsize === "function") ? data.pointsize() : data.pointsize;
		if(size > 14) { size = 14; }
		var halfSize = size/2.0, halfSizeDiff = 7-halfSize;
		var iconOffsetX = xOffset+2+halfSizeDiff, 
			iconOffsetY = yOffset+3+halfSizeDiff;
		legend.append("rect")
			.attr("x", iconOffsetX)
			.attr("y", iconOffsetY)
			.attr("width", size)
			.attr("height", size)
			.attr("transform", "rotate(45," + (iconOffsetX+halfSize) + "," + (iconOffsetY+halfSize) + ")")
			.style("fill", self.getColorBySeriesName(data.series));
		legend.append("text")
			.attr("x", xOffset+23)
			.attr("y", yOffset+9)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(data.series);
		addAndCheckColumn();
	}
	function addLineItem(data) {
		var lineOffset = yOffset + 10;
		var path = legend.append("path")
			.attr("x", xOffset)
			.attr("y", yOffset)
			.attr("d", 
				"M" + xOffset + " " + lineOffset + " " + 
				"L" + (18+xOffset) + " " + lineOffset
			);
		for(var style in data.style) {
			path.style(style, data.style[style]);
		}
		if(!("stroke" in data.style)) {
			path.style("stroke", self.getColorBySeriesName(data.series));
		}
		legend.append("text")
			.attr("x", xOffset+23)
			.attr("y", yOffset+9)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(data.series);
		addAndCheckColumn();
	}
	function addAreaItem(data) {
		var symbol = legend.append("rect")
			.attr("x", xOffset)
			.attr("y", yOffset)
			.attr("width", 18)
			.attr("height", 18);
		for(var style in data.style) {
			symbol.style(style, data.style[style]);
		}
		if(!("fill" in data.style)) {
			symbol.style("fill", self.getColorBySeriesName(data.series));
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
	if(this.areas && exclude.indexOf("areas") < 0) {
		var areaSeries = [];
		for(var i = 0; i < this.areas.length; i++) {
			var name = this.areas[i].series;
			if(areaSeries.indexOf(name) < 0) {
				areaSeries.push(name);
				addAreaItem(this.areas[i]);
			}
		}
	}
	// then lines
	if(this.lines && exclude.indexOf("lines") < 0) {
		var lineSeries = [];
		for(var i = 0; i < this.lines.length; i++) {
			var name = this.lines[i].series;
			if(lineSeries.indexOf(name) < 0) {
				lineSeries.push(name);
				addLineItem(this.lines[i]);
			}
		}
	}
	// finally points
	if(this.points && exclude.indexOf("points") < 0) {
		var pointSeries = [];
		for(var i = 0; i < this.points.length; i++) {
			var name = this.points[i].series;
			if(pointSeries.indexOf(name) < 0) {
				pointSeries.push(name);
				// find connected point line series, if it exists
				var drawPointLine = false;
				if(this.pointLines) {
					var j = this.pointLines.length;
					while(j--) {
						if(this.pointLines[j].series === name) {
							drawPointLine = true;
							break;
						}
					}
				}
				addPointItem(this.points[i], drawPointLine);
			}
		}
	}
	
	// finish up legend bg after completing elements inside
	var legendBox = legend.node().getBBox();
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
};


//************************************************************************************************************
// Color/Category Functions
//************************************************************************************************************
/**
 * Get the color or style related to a data series. Attempts to return the style first, but failing that will
 * return the color string. Note that colors will not be assigned until drawn, thus data series that do exist 
 * but haven't been drawn yet may not return a color.
 * @param {string} name - name of the point or line series (case sensitive).
 * @returns {string} color information
 */
SimpleGraph.prototype.getColorBySeriesName = function(name, create) {
	if(!name) { return null; }
	if(name in this.customColors) {
		return this.customColors[name];
	}
	if(this.points) {
		for(var p in this.points) {
			var point = this.points[p];
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
		for(var l in this.lines) {
			var line = this.lines[l];
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
		for(var a in this.areas) {
			var area = this.areas[a];
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
	if(create) { return this.color(name); }
};

/**
 * Reset domain on color scale, or replace with provided.
 * @param {d3.scale} colorScale - Color scale to replace with or null.
 */
SimpleGraph.prototype.resetColorScale = function(colorScale) {
	if(colorScale) {
		this.color = colorScale;
	} else {
		this.color.domain([]);
	}
};

SimpleGraph.prototype.setSeriesColor = function(series, color) {
	this.customColors[series] = color;
};

SimpleGraph.prototype.removeSeriesColor = function(series) {
	if(this.customColors[series]) {
		delete this.customColors[series];
	};
};


//************************************************************************************************************
// Add Data Functions (These do not draw to graph)
//************************************************************************************************************
/**
 * Add a datapoint to the given set of data.
 * @param {string} name - The name of the data point or data series.
 * @param {string} xValue - The x-value.
 * @param {string} yValue - The y-value.
 * @param {number|callback} [size=10] - The size of the points when drawn. May also be a callback function 
 *        where the 'this' scope would be the data point object (with keys series, x, y, and additional data 
 *        keys, if supplied).
 * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
 * @param {boolean} [showNulls=false] - If true, converts undefined/null y-values to 0. If false, 
 *        undefined/null y-values are not added.
 */
SimpleGraph.prototype.addPointData = function(name, xValue, yValue, size, y2Axis, showNulls) {
	if(!this.points) { this.points = []; }	
	if(!size || size <= 0) { size = 10; }
	var p = {
		series: name, 
		x: parseFloat(xValue), 
		y: parseFloat(yValue), 
		y2: y2Axis ? true : false, 
		pointsize: size
	};
	if(isNaN(p.y) || (!p.y && p.y !== 0)) {
		if(showNulls) {
			p.y = 0;
			p.wasNull = true;
		} else {
			return;
		}
	}
	this.points.push(p);
};

/**
 * Add points data with an array of objects.
 * @param {Object[]} data - The plot data as an array of objects. Use the dataPointName, xValueName, and 
 *        yValueName parameters to tell the function how to parse the data.
 * @param {string} dataPointName - The key name in each data object to retrieve the data point or data series
 *        name and label. If it cannot find the given key in the data object, assumes the given string is the 
 *        series name for all points. If it is null or undefined, uses the index position (thus all points 
 *        will be of unique series).
 * @param {string} xValueName - The key name in each data object to retrieve the x-value.
 * @param {string} yValueName - The key name in each data object to retrieve the y-value.
 * @param {string[]} [additionalDataKeys] - Additional keys for data you want to store for each point.
 * @param {number|callback} [size=10] - The size of the points when drawn. May also be a callback function 
 *        where the 'this' scope would be the data point object (with keys series, x, y, and additional data 
 *        keys, if supplied).
 * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
 * @param {boolean} [showNulls=false] - If true, converts undefined/null y-values to 0. If false, 
 *        undefined/null y-values are not added.
 */
SimpleGraph.prototype.addPointsData = function(data, dataPointName, xValueName, yValueName, additionalDataKeys, size, y2Axis, showNulls) {
	if(!data || data.length === 0) {
		return;
	}
	if(!this.points) { this.points = []; }
	if(!size || size <= 0) { size = 10; }
	// first we gotta comb through the data and organize it nicely
	for(var i = 0; i < data.length; i++) {
		// get data series name, if it exists, otherwise assume dataPointName is series name
		var seriesName = !dataPointName ? i : (data[i][dataPointName] ? data[i][dataPointName] : dataPointName);
		var xValue = data[i][xValueName];
		var yValue = data[i][yValueName];
		// if any null x-values, skip
		if(xValue === undefined || xValue === null) {
			continue;
		}
		// nicely organize data
		var point = {
			series: seriesName, 
			x: xValue, 
			y: parseFloat(yValue), 
			y2: y2Axis ? true : false, 
			pointsize: size
		};
		// check for nulls
		if(isNaN(point.y) || (!point.y && point.y !== 0)) {
			if(showNulls) {
				point.y = 0;
				point.wasNull = true;
			} else {
				continue;
			}
		}
		// check for NaN 
		if(isNaN(point.y)) {
			point.y = 0;
			point.wasNull = true;
		}
		// additonal keys
		if(additionalDataKeys && Array.isArray(additionalDataKeys)) {
			for(var k = 0; k < additionalDataKeys.length; k++) {
				var key = additionalDataKeys[k];
				var asKey = key;
				// if key exists (name, x, y are reserved), adjust key name
				var t = 2;
				while(asKey in point) {
					asKey = key + String(t);
					t++;
				}
				point[asKey] = data[i][key];
			}
		}
		this.points.push(point);
	}
};

/**
 * Add points data with an array of arrays.
 * @param {string} name - The name of the data data series.
 * @param {Array[]} data - The plot data as an array of [x,y] arrays.
 * @param {number|callback} [size=10] - The size of the points when drawn. May also be a callback function 
 *        where the 'this' scope would be the data point object (with keys series, x, y, and additional data 
 *        keys, if supplied).
 * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
 * @param {boolean} [showNulls=false] - If true, converts undefined/null y-values to 0. If false, 
 *        undefined/null y-values are not added.
 */
SimpleGraph.prototype.addPointsDataAsArray = function(name, data, size, y2Axis, showNulls) {
	if(!data || data.length === 0) {
		return;
	}
	if(!size || (typeof size !== "number" && typeof size != "function")) { size = 10; }
	if(!this.points) { this.points = []; }
	for(var i = 0; i < data.length; i++) {
		if(data[i][0] === undefined || data[i][0] === null || data[i][1] === undefined || data[i][1] === null) {
			continue;
		}
		var p = {
			series: name, 
			x: parseFloat(data[i][0]),
			y: parseFloat(data[i][1]), 
			y2: y2Axis ? true : false, 
			pointsize: size
		};
		if(isNaN(p.y) || (!p.y && p.y !== 0)) {
			if(showNulls) {
				p.y = 0;
				p.wasNull = true;
			} else {
				continue;
			}
		}
		this.points.push(p);
	}
};

/**
 * Add line data series as an array of coordinates.
 * @param {string} name - series name
 * @param {Array[]} lineCoordinates - array of x,y coordinates.
 * @param {Object} [style]{'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
 *        the resulting SVG element's CSS style.
 * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
 * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
 */
SimpleGraph.prototype.addLineDataAsCoordinates = function(name, lineCoordinates, style, interpolation, y2Axis) {
	if(!lineCoordinates || lineCoordinates.length === 0) { return; }
	if(!this.lines) {
		this.lines = [];
	}
	//lineCoordinates.sort(function(a, b) { return a[0] - b[0]; });
	// default styles
	if(!style) {
		style = {};
	}
	if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
		style['stroke-width'] = 1.5;
	}
	if(!interpolation) {
		interpolation = d3.curveLinear;
	}
	this.lines.push({
		series: name, 
		lineFunction: null, 
		coords: lineCoordinates, 
		y2: y2Axis ? true : false, 
		style: style, 
		interpolate: interpolation
	});
};

/**
 * Add line data series as a function.
 * @param {string} name - Series name
 * @callback lineFunction - Callback function such that function(x) returns y.
 * @param {Object} [style]{'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
 *        the resulting SVG element's CSS style.
 * @param {number} [resolution] - How many coordinates to calculate when drawing the line (defaults to every 
 *        20 pixels of width if not provided and if provided enforces minimum of 2).
 * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
 * @param {number[]} [xRange] - The x-range of the line. Defaults to the min-max of the graph. If supplied 
 *        will still be truncated to the min-max of the graph if it extends past.
 * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
 */
SimpleGraph.prototype.addLineDataAsFunction = function(name, lineFunction, style, resolution, interpolation, xRange, y2Axis) {
	if(!lineFunction || typeof lineFunction !== "function" || typeof lineFunction(0) !== "number") {
		return;
	}
	// default styles
	if(!style) {
		style = {};
	}
	if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
		style['stroke-width'] = 1.5;
	}
	if(!interpolation) {
		interpolation = d3.curveLinear;
	}
	if(!this.lines) {
		this.lines = [];
	}
	this.lines.push({
		series: name, 
		lineFunction: lineFunction, 
		resolution: resolution, 
		coords: null, 
		xRange: xRange, 
		y2: y2Axis ? true : false, 
		style: style, 
		interpolate: interpolation
	});
};

/**
 * Interpolate lines for each data series in the points data. If called multiple times, will recalculate the 
 * lines and replace existing data.
 * @param {Object} [style={'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
 *        the resulting SVG element's CSS style.
 * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
 * @param {string} [handleOverlap="average"] - If there are 2 or more points overlapped for a given x-value, 
 *        how to handle the y-value for the line. Options are "average", "median", "highest", and "lowest".
 */
SimpleGraph.prototype.addLinesDataFromPoints = function(style, interpolation, handleOverlap) {
	if(!this.points || this.points.length === 0) {
		this.pointLines = null;
		return;
	}
	if(!handleOverlap) {
		handleOverlap = 'average';
	} else {
		handleOverlap = handleOverlap.toLowerCase();
	}
	// default styles
	if(!style) {
		style = {};
	}
	if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
		style['stroke-width'] = 1.5;
	}
	// can't specify color, will be taken from related point data series
	if(style.stroke) {
		delete style.stroke;
	}
	if(!interpolation) {
		interpolation = d3.curveLinear;
	}
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
	
	// will be our array of point-connecting-lines
	this.pointLines = [];

	// start looping
	for(var series in pointsBySeries) {
		var checkPoints = pointsBySeries[series].points;
		var yAxis = pointsBySeries[series].y2 ? this.y2 : this.y;
		// less than 2 points, skip
		if(checkPoints.length < 2) {
			continue;
		}
		// first sort in ascending order
		checkPoints.sort(function(a, b) {
			return a.x - b.x;
		});
		var lineCoords = [];
		for(var i = 0; i < checkPoints.length; i++) {
			var pointToAdd = checkPoints[i];
			// always add point to line, will now do check beyond graph at drawing stage
			// check is point overlaps another on x-position
			var exists = false;
			for(var j = 0; j < lineCoords.length; j++) {
				if(lineCoords[j][0] === pointToAdd.x) {
					exists = true;
					// if it exists, add to count and..
					if(handleOverlap === "median") {
						if(!Array.isArray(lineCoords[j][2])) {
							lineCoords[j][2] = [];
						}
						lineCoords[j][2].push(pointToAdd.y);
						lineCoords[j][2].sort();
						var medianIndex = (lineCoords[j][2].length > 1) ? Math.round(lineCoords[j][2].length/2)-1 : 0;
						lineCoords[j][1] = lineCoords[j][2][medianIndex];
					} else {
						lineCoords[j][2] += 1;
						if(handleOverlap === "average") {
							lineCoords[j][1] = (lineCoords[j][1]*(lineCoords[j][2]-1) + pointToAdd.y)/lineCoords[j][2];
						} else if(handleOverlap === "lowest") {
							if(pointToAdd.y < lineCoords[j][1]) {
								lineCoords[j][1] = pointToAdd.y;
							}
						} else if(handleOverlap === "highest") {
							if(pointToAdd.y > lineCoords[j][1]) {
								lineCoords[j][1] = pointToAdd.y;
							}
						} else {
							throw "Unknown handle overlap operation: " + handleOverlap;
						}
					}
					break;
				} else if(lineCoords[j] > pointToAdd.x) {
					// since this is assumed in ascending order
					break;
				}
			}
			// if no match found, add with count=1
			if(!exists) {
				lineCoords.push([pointToAdd.x, pointToAdd.y, 1]);
			}
		}
		// add after looping coords
		if(lineCoords.length >= 2) {
			this.pointLines.push({
				series: series, 
				coords: lineCoords, 
				y2: pointsBySeries[series].y2, 
				interpolate: interpolation, 
				style: style
			});
		}
	}
};

/**
 * Add an area data series using two lines to calculate the top and bottom bounds.
 * @param {string} name - series name
 * @callback lineFunctionBottom - callback function for bottom border of area such that function(x) returns y0.
 * @callback lineFunctionTop - callback function for top border of area such that function(x) returns y1.
 * @param {Object} [style={fill:"#ccc"}] - Object literal of key-value pairs that will be applied as 
 *        the resulting SVG element's CSS style.
 * @param {number} [resolution] - How many coordinates to calculate when drawing the line (defaults to every 
 *        20 pixels of width if not provided and if provided enforces minimum of 2).
 * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
 * @param {number[]} [xRange] - The x-range of the line. Defaults to the min-max of the graph. If supplied 
 *        will still be truncated to the min-max of the graph if it extends past.
 * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
 */
SimpleGraph.prototype.addAreaBetweenTwoLines = function(name, lineFunctionBottom, lineFunctionTop, style, resolution, interpolation, xRange, y2Axis) {
	if(!lineFunctionTop || typeof lineFunctionTop !== "function") {
		return;
	}
	if(!lineFunctionBottom || typeof lineFunctionBottom !== "function") {
		return;
	}
	// default styles
	if(!style) {
		style = {};
	}
	if(!interpolation) {
		interpolation = d3.curveLinear;
	}
	if(!this.areas) {
		this.areas = [];
	}
	this.areas.push({
		series: name, 
		areaFunctions: [lineFunctionBottom, lineFunctionTop], 
		coords: null, 
		resolution: resolution, 
		xRange: xRange, 
		y2: y2Axis ? true : false, 
		style: style, 
		interpolate: interpolation
	});
};

/**
 * Add an area data series a given set of coordinates.
 * @param {string} name - series name
 * @param {number[][]} areaCoordinates - array of area coordinate triplets [x, y0, y1]
 * @param {Object} [style] - Object literal of key-value pairs that will be applied as the resulting SVG 
 *        element's CSS style.
 * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
 * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
 */
SimpleGraph.prototype.addAreaAsCoordinates = function(name, areaCoordinates, style, interpolation, y2Axis) {
	if(!areaCoordinates || !Array.isArray(areaCoordinates) || areaCoordinates.length < 2) {
		return;
	}
	// default styles
	if(!style) {
		style = {};
	}
	if(!interpolation) {
		interpolation = d3.curveLinear;
	}
	if(!this.areas) {
		this.areas = [];
	}
	this.areas.push({
		series: name, 
		areaFunctions: null, 
		coords: areaCoordinates, 
		y2: y2Axis ? true : false, 
		style: style, 
		interpolate: interpolation
	});
};


//************************************************************************************************************
// Remove Data Functions (These do not clear from graph)
//************************************************************************************************************
/**
 * Clear all points data.
 */
SimpleGraph.prototype.clearPointsData = function() {
	this.points = null;
};

/**
 * Clear all lines data.
 */
SimpleGraph.prototype.clearLinesData = function() {
	this.lines = null;
	this.pointLines = null;
};

/**
 * Clear areas data.
 */
SimpleGraph.prototype.clearAreasData = function() {
	this.areas = null;
};

/**
 * Clear all data.
 */
SimpleGraph.prototype.clearAllData = function() {
	this.clearPointsData();
	this.clearLinesData();
	this.clearAreasData();
};


//************************************************************************************************************
// Some Additional Data Functions
//************************************************************************************************************
/** 
 * @typedef PointData
 * @type Object
 * @property {string} series - The series name this point belongs to.
 * @property {number|Date} x - The x-value.
 * @property {number} y - The y-value.
 * @property {boolean} y2 - If true, the y-value correlates to the y2 axis.
 * @property {number|callback} pointsize - The symbol size. May be a number, a callback function, or null.
 */
/**
 * Grab all point data by series names.
 * @param {string} seriesName - Name of the series for which you want to grab data.
 * @returns {PointData[]} Array of points data.
 */
SimpleGraph.prototype.getPointsDataBySeries = function(seriesName) {
	var pointData = [];
	if(this.points) {
		for(var i = 0; i < this.points.length; i++) {
			if(this.points[i].series === seriesName) {
				pointData.push(this.points[i]);
			}
		}
	}
	return pointData;
};

/**
 * Retrieve all point coordinates for a given series name.
 * @param {string} seriesName - Name of the series for which you want to grab the point coordiantes.
 * @returns {Number[][]} Array of x,y coordinate pairs.
 */
SimpleGraph.prototype.getPointCoordinatesBySeries = function(seriesName) {
	var coordList = [];
	if(this.points) {
		for(var i = 0; i < this.points.length; i++) {
			if(this.points[i].series === seriesName) {
				coordList.push([
					this.points[i].x, 
					this.points[i].y || this.points[i].y === 0 ? this.points[i].y : this.points[i].y2
				]);
			}
		}
	}
	return coordList;
};

/** 
 * @typedef LineData
 * @type Object
 * @property {string} series - The series name this line belongs to.
 * @property {callback} lineFunction - The line function defining this line (or null if the line was provided 
 *           as a series of coordinates.
 * @property {number[][]} coords - The line as a series of coordinates (or null if the line was provided as a 
 *           function.
 * @property {number} resolution - If the line was defined by a function, the resolution to draw the line, 
 *           i.e. the number of points to draw then interpolate a line through, or null if using default 
 *           settings.
 * @property {number[]} xRange - The minimum and maximum x-values the drawn line may not exceed, or null if 
 *           there are no limits.
 * @property {boolean} y2 - If true, the y-values of the line correlates to the y2 axis.
 * @property {Object} style - A dictionary of styles to apply to the line. Even if no style was provided with 
 *           the data, a default 'stroke' style value provided.
 * @property {string} interpolate - The interpolation type (now curve factory) when drawing the line.
 */
/**
 * Grab all line data by series names.
 * @param {string} seriesName - Name of the series for which you want to grab data.
 * @returns {LineData[]} Array of line data.
 */
SimpleGraph.prototype.getLinesDataBySeries = function(seriesName) {
	var lineData = [];
	if(this.lines) {
		for(var i = 0; i < this.lines.length; i++) {
			if(this.lines[i].series === seriesName) {
				lineData.push(this.lines[i]);
			}
		}
	}
	return lineData;
};

/** 
 * @typedef AreaData
 * @type Object
 * @property {string} series - The series name this area belongs to.
 * @property {callback[]} areaFunctions - The two area functions (for y0 and y1) defining this area (or null 
 *           if the area was provided as a series of coordinates.
 * @property {number[][]} coords - The area as a series of coordinates [x, y0, y1] (or null if the area was 
 *           provided as a  function.
 * @property {number} resolution - If the area was defined by functions, the resolution to draw the line, 
 *           i.e. the number of points to draw then interpolate each line through, or null if using default 
 *           settings.
 * @property {number[]} xRange - The minimum and maximum x-values the drawn area may not exceed, or null if 
 *           there are no limits.
 * @property {boolean} y2 - If true, the y-values of the area correlates to the y2 axis.
 * @property {Object} style - A dictionary of styles to apply to the area.
 * @property {string} interpolate - The interpolation type (now curve factory) when drawing the area.
 */
/**
 * Grab all area data by series names.
 * @param {string} seriesName - Name of the series for which you want to grab data.
 * @returns {AreaData[]} Array of area data.
 */
SimpleGraph.prototype.getAreasDataBySeries = function(seriesName) {
	var areaData = [];
	if(this.areas) {
		for(var i = 0; i < this.areas.length; i++) {
			if(this.areas[i].series === seriesName) {
				areaData.push(this.areas[i]);
			}
		}
	}
	return areaData;
};


//************************************************************************************************************
// Draw Data Functions
//************************************************************************************************************
/**
 * Draw points data onto the graph. If points already exist will remove and redraw. Points will have class 
 * ".scatterplot-point".
 */
SimpleGraph.prototype.drawPoints = function() {
	this.removePoints();

	if(!this.points || this.points.length === 0) {
		return;
	}

	// for 'this' references
	var self = this;
	var color = this.color;
	var xScale = this.x.scale;
	var yScale = this.y.scale;
	var y2Scale = this.y2 ? this.y2.scale : null;

	// if necessary, remove points that extend beyond graph
	var drawPointsData;
	if(this.allowDrawBeyondGraph) {
		drawPointsData = this.points;
	} else {
		drawPointsData = [];
		for(var i = 0; i < this.points.length; i++) {
			var yAxis = this.points[i].y2 ? this.y2 : this.y;
			var addPoint = this.points[i].x >= this.x.min;
			addPoint = addPoint && this.points[i].x <= this.x.max;
			addPoint = addPoint && this.points[i].y >= yAxis.min;
			addPoint = addPoint && this.points[i].y <= yAxis.max;
			if(addPoint) { drawPointsData.push(this.points[i]); }
		}
	}

	var points = this.svgGraph.selectAll(".scatterplot-point")
		.data(drawPointsData)
	  .enter().append("rect")
		.attr("series", function(d) { return d.series; })
		.attr("class", "scatterplot-point")
		.attr("width", function(d) { return (typeof d.pointsize === "function") ? d.pointsize() : d.pointsize; })
		.attr("height", function(d) { return (typeof d.pointsize === "function") ? d.pointsize() : d.pointsize; })
		.attr("x", function(d) {
			var size = (typeof d.pointsize === "function") ? d.pointsize() : d.pointsize;
			return xScale(d.x)-size/2.0;
		})
		.attr("y", function(d) {
			var size = (typeof d.pointsize === "function") ? d.pointsize() : d.pointsize;
			return (d.y2 ? y2Scale : yScale)(d.y)-size/2.0;
		})
		.attr("transform", function(d) {
			return "rotate(45," + xScale(d.x) + "," + (d.y2 ? y2Scale : yScale)(d.y) + ")";
		})
		.style("fill", function(d) {
			if(d.wasNull) { return "none"; }
			return self.getColorBySeriesName(d.series, true);
		})
		.style("stroke", function(d) {
			if(!d.wasNull) { return null; }
			return self.getColorBySeriesName(d.series, true);
		});
};

/**
 * Draw lines on graph. If lines exist already, will remove and redraw them. Lines will have class 
 * ".scatterplot-line" or ".plotted-line".
 */
SimpleGraph.prototype.drawLines = function() {
	this.removeLines();
	// for this references
	var self = this;
	var color = this.color;
	var xScale = this.x.scale;
	var svgGraph = this.svgGraph;
	
	// local function for adding lines to graph as it may be used multiple times per loop
	function addLine(lineData, lineCoords, className) {
		if(lineCoords.length < 2) {
			return;
		}
		var yScale = lineData.y2 ? self.y2.scale : self.y.scale;
		var addedLine = svgGraph.selectAll(".temporary-line")
			.data([lineCoords])
		  .enter().append("path")
			.attr("series", lineData.series)
			.attr("class", className)
			.style("fill", 'none')
			.attr("d",
				d3.line()
					.x(function(c) { return xScale(c[0]); })
					.y(function(c) { return yScale(c[1]); })
					.curve(lineData.interpolate)
			);
		// add styles
		var styles = lineData.style ? lineData.style : {};
		for(var skey in styles) {
			addedLine.style(skey, styles[skey]);
		}
		// add color if not specified
		if(!('stroke' in styles)) {
			addedLine.style('stroke', self.getColorBySeriesName(lineData.series, true));
		}
	}
	
	// lines interpolated from points
	if(this.pointLines) {
		for(var l = 0; l < this.pointLines.length; l++) {
			var line = this.pointLines[l];
			if(this.allowDrawBeyondGraph) {
				addLine(line, line.coords, "scatterplot-line");
			} else {
				var lineSegments = this.getLineSegmentsFromCoordinates(line.coords, line.y2);
				for(var s = 0; s < lineSegments.length; s++) {
					addLine(line, lineSegments[s], "scatterplot-line");
				}
			}
		}
	}
	
	// lines added as lines
	if(this.lines) {
		for(var l = 0; l < this.lines.length; l++) {
			var line = this.lines[l];
			// lines added as functions
			if(line.lineFunction) {
				var lineSegments = this.getLineSegmentsFromFunction(
					line.lineFunction, 
					line.resolution, 
					line.xRange, 
					line.y2Axis, 
					!this.allowDrawBeyondGraph
				);
				for(var s = 0; s < lineSegments.length; s++) {
					addLine(line, lineSegments[s], "plotted-line");
				}
			// lines added as coordinates
			} else {
				if(this.allowDrawBeyondGraph) {
					addLine(line.coords, "plotted-line");
				} else {
					var lineSegments = this.getLineSegmentsFromCoordinates(line.coords, line.y2);
					for(var s = 0; s < lineSegments.length; s++) {
						addLine(line, lineSegments[s], "plotted-line");
					}
				}
			}
		}
	}
};

/**
 * Draw areas onto graph. Areas will have class ".plotted-areas".
 */
SimpleGraph.prototype.drawAreas = function() {
	this.removeAreas();
	// for this references
	var self = this;
	var color = this.color;
	var xScale = this.x.scale;
	
	// local function for adding areas to graph as it may be used multiple times per loop
	function addArea(areaData, areaCoords, className) {
		if(areaCoords.length < 2 || areaCoords[0].length < 2 || areaCoords[1].length < 2) {
			return;
		}
		var yScale = areaData.y2 ? self.y2.scale : self.y.scale;
		var addedArea = self.svgGraph.selectAll(".temporary-area")
			.data([areaCoords])
		  .enter().append("path")
			.attr("series", areaData.series)
			.attr("class", className)
			.attr("d",
				d3.area()
					.x(function(c) { return xScale(c[0]); })
					.y0(function(c) { return yScale(c[1]); })
					.y1(function(c) { return yScale(c[2]); })
					.curve(areaData.interpolate)
			);
		var styles = areaData.style ? areaData.style : {};
		for(var skey in styles) {
			addedArea.style(skey, styles[skey]);
		}
		// add color if not specified
		if(!('fill' in styles)) {
			addedArea.style("fill", self.getColorBySeriesName(areaData.series, true));
		}
	}

	if(this.areas) {
		for(var a = 0; a < this.areas.length; a++) {
			var area = this.areas[a];
			// areas added as functions
			if(area.areaFunctions) {
				var areaPolys = this.getAreasPolysFromFunctions(
					area.areaFunctions[0], 
					area.areaFunctions[1], 
					area.resolution, 
					area.xRange, 
					area.y2, 
					!this.allowDrawBeyondGraph
				);
				for(var p = 0; p < areaPolys.length; p++) {
					addArea(area, areaPolys[p], "plotted-area");
				}
			// areas added as coordinates
			} else {
				if(this.allowDrawBeyondGraph) {
					addArea(area.coords, "plotted-area");
				} else {
					var areaPolys = this.getAreaPolysFromCoordinates(area.coords, area.y2);
					for(var p = 0; p < areaPolys.length; p++) {
						addArea(area, areaPolys[p], "plotted-area");
					}
				}
			}
		}
	}
};


//************************************************************************************************************
// Mostly "private" functions for creating line coordinates from function
//************************************************************************************************************
SimpleGraph.prototype.findIntercept = function(f, x1, x2, y2Axis) {
	var y1 = f(x1), y2 = f(x2);
	var breakValue, increasing;
	var yAxis = y2Axis ? this.y2 : this.y;
	if(y1 < yAxis.min !== y2 < yAxis.min) {
		breakValue = yAxis.min;
	} else if(y1 > yAxis.max !== y2 > yAxis.max) {
		breakValue = yAxis.max;
	} else {
		return null;
	}
	var x = x1 + 0.5*(x2 - x1);          // start halfway
	var search = 0.25*Math.abs(x2 - x1); // search distance
	var lasty = y1, lastx = x1;          // store last x,y values
	var y, diff, goHigher;               // vars scoped only in interation but to avoid redeclaring var
	var lastDiff, lastGoHigher;          // some other memory items
	x1 -= 0.00001;                       // add tolerances to min/max bounds as binary arithmetic can cause 
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
		if(x < x1 || x > x2) {
			return null;
		}
	}
	return null;
};

SimpleGraph.prototype.getLineSegmentsFromCoordinates = function(lineCoords, y2Axis) {
	var yAxis = y2Axis ? this.y2 : this.y;
	var lineSegments = [];
	var segment = [];
	var lastCoords = null;
	var crossedXMin = false;
	var crossedXMax = false;

	for(var c = 0; c < lineCoords.length; c++) {
		var coords = lineCoords[c];
		// null means a break in the line
		if(coords[1] === undefined || coords[1] === null) {
			if(segment.length > 1) {
				lineSegments.push(segment);
			}
			segment = [];
			lastCoords = null;
			continue;
		}
		// note, if date, this will become y per milliseconds
		var slope = (!lastCoords) ? 0 : (lineCoords[c][1] - lastCoords[1]) / (lineCoords[c][0] - lastCoords[0]);

		if(!crossedXMin) {
			if(coords[0] >= this.x.min) {
				crossedXMin = true;
				if(coords[0] > this.x.min && lastCoords) {
					// get intercept on y=x-min, add if within range
					var intercept = [
						this.x.min, 
						lastCoords[0] + slope*(coords[1] - lastCoords[1])
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
			// skip rest of loop until crossing x-min or because we just added segment start
			lastCoords = coords;
			continue;
		}

		if(!crossedXMax && coords[0] >= this.x.max) {
			crossedXMax = true;
			if(coords[0] > this.x.max) {
				// if no last coords, this is just a point outside
				if(!lastCoords) {
					break;
				}
				// interpolate back to x-max
				coords = [
					this.x.max, 
					lastCoords[0] + slope*(coords[1] - lastCoords[1])
				];
			}
		}

		// check within y-range
		if(coords[1] >= yAxis.min && coords[1] <= yAxis.max) {
			// case: first point of new segment
			if(segment.length === 0 && lastCoords) {
				if(slope === 0) {
					// get y-intercept
					var yTarget = slope > 0 ? yAxis.min : yAxis.max;
					var lastX = this.x.isDate ? lastCoords[0].getTime() : lastCoords[0];
					coords = [
						lastX + (yTarget - lastCoords[1])/slope, 
						yTarget
					];
					if(this.x.isDate) {
						coords[0] = new Date(coords[0]);
					}
					// force repeat of the coords that original came in for this loop (intercept will become last)
					c--;
				}
			}
			// add to segment
			segment.push(coords);
		} else {
			// case: ending segment with last point outside of range
			if(segment.length > 0) {
				// yet y-intercept
				var yTarget = slope > 0 ? yAxis.min : yAxis.max;
				var lastX = this.x.isDate ? lastCoords[0].getTime() : lastCoords[0];
				coords = [
					lastX + (yTarget - lastCoords[1])/slope, 
					yTarget
				];
				if(this.x.isDate) {
					coords[0] = new Date(coords[0]);
				}
				// add to segment
				segment.push(coords);
			}
			// finish segment
			if(segment.length > 1) {
				lineSegments.push(segment);
				segment = [];
			}
		}
		// if crossed x-max we can break
		if(crossedXMax) { break; }
		// save last coordinates
		lastCoords = coords;
	}

	// always attempt to add last segment
	if(segment.length > 1) {
		lineSegments.push(segment);
	}

	return lineSegments;
};

SimpleGraph.prototype.getLineSegmentsFromFunction = function(lineFunction, resolution, xRange, y2Axis, limitToGraphRange) {
	var yAxis = y2Axis ? this.y2 : this.y;

	if(!xRange) {
		xRange = [this.x.min, this.x.max];
	} else {
		if(xRange[0] < this.x.min) { xRange[0] = this.x.min; }
		if(xRange[1] > this.x.max) { xRange[0] = this.x.max; }
	}
	if(!resolution || typeof resolution !== "number") {
		resolution = Math.floor((this.width - this.margins.left - this.margins.right) / 10);
	}
	if(resolution < 2) {
		resolution = 2;
	}

	// how increments are handled and needed variables
	var incrementFunc;
	if(!this.x.isLog) {
		// if not log-scale, standard increment (this works for dates too)
		var increment = (xRange[1] - xRange[0])/(resolution-1);
		var isDate = this.x.isDate;
		// standard increment function
		incrementFunc = function(n) {
			if(isDate) {
				return new DateUTC(n.getTime() + increment);
			}
			return n += increment;
		};
	} else {
		// increment in exponential scale fit to range and resolution
		var base = Math.pow(xRange[1]/xRange[0], 1-resolution);
		incrementFunc = function(n) {
			n *= base;
			return (n > xRange[1]) ? xRange[1] : n;
		};
	}

	var lineSegments = [];
	var segment = [];
	var lastX = x = xRange[0];

	while(true) {
		var markForBreak = false;
		if(x >= xRange[1]) {
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
				var intercept = this.findIntercept(lineFunction, lastX, x, y2Axis);
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
				var intercept = this.findIntercept(lineFunction, lastX, x, y2Axis);
				if(intercept) {
					segment.push(intercept);
				}
			}
			// finish segment
			if(segment.length > 1) {
				lineSegments.push(segment);
				segment = [];
			}
		}

		lastX = x;
		x = incrementFunc(x);
		if(markForBreak) { break; }
	}
	
	// always attempt to add last segment
	if(segment.length > 1) {
		lineSegments.push(segment);
	}

	return lineSegments;
};

SimpleGraph.prototype.getAreaPolysFromCoordinates = function(areaCoordinates, y2Axis) {
	var lineA = [];
	var lineB = [];
	for(var i = 0; i < areaCoordinates.length; i++) {
		lineA.push([areaCoordinates[i][0], areaCoordinates[i][1]]);
		lineB.push([areaCoordinates[i][0], areaCoordinates[i][2]]);
	}
	return this.getAreaPolysFromLineCrosswalk(
		this.getLineSegmentsFromCoordinates(lineA, y2Axis), 
		this.getLineSegmentsFromCoordinates(lineB, y2Axis), 
		y2Axis
	);
};

SimpleGraph.prototype.getAreasPolysFromFunctions = function(funcA, funcB, resolution, xRange, y2Axis, limitToGraphRange) {
	var lines = [
		this.getLineSegmentsFromFunction(funcA, resolution, xRange, y2Axis, limitToGraphRange), 
		this.getLineSegmentsFromFunction(funcB, resolution, xRange, y2Axis, limitToGraphRange)
	];
	return this.getAreaPolysFromLineCrosswalk(
		this.getLineSegmentsFromFunction(funcA, resolution, xRange, y2Axis, limitToGraphRange), 
		this.getLineSegmentsFromFunction(funcB, resolution, xRange, y2Axis, limitToGraphRange), 
		y2Axis
	);
};

SimpleGraph.prototype.getAreaPolysFromLineCrosswalk = function(lineA, lineB, y2Axis) {
	var areas = [];
	var areaCoords = [];
	var li = [0, 0];
	var ci = [0, 0];
	var endOfLines = [false, false];
	var endOfCoords = [false, false];
	var coordA, coordB;

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


//************************************************************************************************************
// Remove From Graph Functions (does not remove underlying data)
//************************************************************************************************************
/**
 * Remove all points on graph.
 */
SimpleGraph.prototype.removePoints = function() {
	this.svgGraph.selectAll(".scatterplot-dot, .scatterplot-point").remove();
};

/**
 * Remove lines from graph.
 */
SimpleGraph.prototype.removeLines = function() {
	this.svgGraph.selectAll(".scatterplot-line, .plotted-line").remove();
};

/**
 * Remove areas from graph.
 */
SimpleGraph.prototype.removeAreas = function() {
	this.svgGraph.selectAll(".plotted-area").remove();
};

/**
 * Remove everything from graph.
 */
SimpleGraph.prototype.removeAll = function() {
	this.svgGraph.selectAll(".scatterplot-dot, .scatterplot-point, .scatterplot-line, .plotted-line, .plotted-area").remove();
};


//************************************************************************************************************
// Tooltip Functions
//************************************************************************************************************
/**
 * Add tooltip function to the points on the graph. Does not add tooltips to the lines connecting points, if 
 * they were added. That is handled by addTooltipToLines(). You can check the series name in the callback's 
 * returned SVG element or the class to determine type, regular lines are ".plotted-line" and lines drawn from
 * connecting points are ".scatterplot-line".
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 *        the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places
 *        the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
 *        div's CSS style (optional).
 */
SimpleGraph.prototype.addTooltipToPoints = function(tooltipFunction, options) {
	this.svgGraph.selectAll(".scatterplot-point")
		.call(this.addTooltipFunctionality(tooltipFunction, options));
};

/**
 * Add tooltip function to the lines on the graph.
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 *        the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
 *        the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
 *        div's CSS style (optional).
 */
SimpleGraph.prototype.addTooltipToLines = function(tooltipFunction, options) {
	this.svgGraph.selectAll(".scatterplot-line, .plotted-line")
		.call(this.addTooltipFunctionality(tooltipFunction, options));
};

/**
 * Add tooltip function to the areas on the graph.
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 *        the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
 *        the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
 *        div's CSS style (optional).
 */
SimpleGraph.prototype.addTooltipToAreas = function(tooltipFunction, options) {
	this.svgGraph.selectAll(".plotted-area")
		.call(this.addTooltipFunctionality(tooltipFunction, options));
};

/**
 * Tooltip functionality for SVG objects (modified from <http://bl.ocks.org/rveciana/5181105>). Should not be
 * called explicitly, it is added to D3 SVG elements via call(). Use the 
 * addTooltipTo[Points|Lines|Areas]() functions instead.
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 *        the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
 *        the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
 *        div's CSS style (optional).
 */
SimpleGraph.prototype.addTooltipFunctionality = function(textFunction, options) {
	var svg = this.svg;
	return function(selection) {
		if(!selection) { return; }
		if(!options) { options = {}; }
		var d3Body = d3.select('body');
		var tooltipDiv;
		selection.on("mouseover", function(d, i) {
			// set relative position of tool-tip
			var absMousePos = d3.mouse(d3Body.node());
			var tooltipOffset = (options.offset) ? options.offset : [10, -15];
			// Check if tooltip div already exists
			var styles = {};
			if(!tooltipDiv) {
				// Clean up lost tooltips
				d3Body.selectAll('.d3-tooltip').remove();
				// Append tooltip 
				tooltipDiv = d3Body.append('div');
				tooltipDiv.attr('class', 'd3-tooltip');
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
			for(var styleKey in styles) {
				tooltipDiv.style(styleKey, styles[styleKey]);
			}
			// add custom styles if provided
			if(options.style) {
				for(var styleKey in options.style) {
					tooltipDiv.style(styleKey, options.style[styleKey]);
				}
			}
		})
		.on('mousemove', function(d, i) {
			if(tooltipDiv) {
				// Move tooltip
				var absMousePos = d3.mouse(d3Body.node());
				var tooltipOffset = (options.offset) ? options.offset : [10, -15];
				tooltipDiv.style('left', (absMousePos[0] + tooltipOffset[0])+'px');
				tooltipDiv.style('top', (absMousePos[1] + tooltipOffset[1])+'px');
				// TODO: selection is no longer array-like, hides it in _groups var -- this seems unideal, update/change when able
				var tooltipText = (textFunction) ? textFunction(d, d3.mouse(svg.node()), selection._groups[0], i) : null;
				// If no text, remove tooltip
				if(!tooltipText) {
					tooltipDiv.remove();
					tooltipDiv = null;
				} else {
					tooltipDiv.html(tooltipText);
				}
			}
		})
		.on("mouseout", function(d, i) {
			// Remove tooltip
			if(tooltipDiv) {
				tooltipDiv.remove();
				tooltipDiv = null;
			}
		});
	};
};


/**
 * Handles the text appearing in the tooltip. Several parameters are provided to pull relevant data from.
 * @callback tooltipTextFunction
 * @param {Object} d - The data object bound to the hovered SVG element. For points, keys included are 
 *        'series', 'x', 'y', and any additional data keys specified. For lines and areas, only the raw 
 *         coordinates are  stored.
 * @param {number[]} p - The x,y relative mouse position on the parent SVG.
 * @param {Object[]} s - Array of the SVG elements in the layer selected(or null).
 * @param {number} i - Index of selected element in array above such that s[i] gives the specific SVG element.
 */


//************************************************************************************************************
// Highlight Functions (Currently only implemented for points)
//************************************************************************************************************
SimpleGraph.prototype.highlightPoints = function(series, validationCallback, size, fill, stylesDict) {
	var selectQuery = ".scatterplot-point";
	if(series) { selectQuery += "[series='" + series + "']"; }
	var self = this;
	this.svgGraph.selectAll(selectQuery).each(function(d, i, s) {
		if(!validationCallback(d)) { return false; }
		var xScale = self.x.scale;
		var yScale = d.y2 ? self.y2.scale : self.y.scale;
		if(!fill) {
			fill = d.wasNull ? "none" : self.getColorBySeriesName(d.series, true);
		};
		var rect = self.svgGraph.append("rect")
			.attr("class", "scatterplot-point-highlight")
			.attr("width", size)
			.attr("height", size)
			.attr("x", xScale(d.x)-size/2.0)
			.attr("y", yScale(d.y)-size/2.0)
			.attr("transform", "rotate(45," + xScale(d.x) + "," + yScale(d.y) + ")")
			.style("fill", fill);
		if(stylesDict) {
			for(var sKey in stylesDict) {
				rect.style(sKey, stylesDict[sKey]);
			}
		}
	});
};

SimpleGraph.prototype.removeHighlightPoints = function() {
	this.svgGraph.selectAll(".scatterplot-point-highlight").remove();
};

SimpleGraph.prototype.removeHighlights = function() {
	this.removeHighlightPoints();
};


//************************************************************************************************************
// Save graph function
//************************************************************************************************************
/**
 * Save graph as a PNG.
 * @param {string} [pngName] - Default name to save png.
 */
SimpleGraph.prototype.saveAsPng = function(pngName) {
	if(!pngName) { pngName = "graph.png"; }
	if(!pngName.toLowerCase().endsWith(".png")) { pngName += ".png"; }
	
	var svgNode = this.svg
		.attr("version", "1.1")
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
		.node();
	var serializer = new XMLSerializer();
	var svgHtml = serializer.serializeToString(svgNode);
	
	var canvas = document.createElement("canvas");
	canvas.style.display = "none";
	canvas.width = this.containerWidth;
	canvas.height = this.containerHeight;
	
	// because internet explorer, this is only way around the security error (requires canvg library which is 
	// not explicitly requires, assumed loaded somewhere on the page)
	if(navigator.msSaveBlob && canvg) {
		// have to manually replace the width/height in cases of bottom-buffer IE hack for resizable graphs
		svgHtml = svgHtml.replace("style=\"width: 100%; height: 1px;", "style=\"width:" + this.containerWidth + "px; height:" + this.containerHeight + "px;");
		// draw via canvg, which is totally redudant if not for the fact this is only way to bypass security error
		canvg(canvas, svgHtml);
		navigator.msSaveBlob(
			new Blob([canvas.msToBlob()], {type:"image/png"}), 
			pngName
		);
		return;
	}
	
	var a = document.createElement("a");
	a.style.display = "none";
	a.download = pngName;
	this.svg.node().parentNode.appendChild(a);
	
	var img = new Image();
	img.onload = function() {
		canvas.getContext("2d").drawImage(img, 0, 0);
		// freaking internet explorer..
		if(navigator.msSaveBlob) {
			try {
				navigator.msSaveBlob(
					new Blob([canvas.msToBlob()], {type:"image/png"}), 
					pngName
				);
			} catch(e) {
				// still doesn't work because of overly strict security restrictions in IE
				alert("Sorry, SVG to PNG downloads are restricted in Internet Explorer, please try with another browser.");
			}
		} else {
			a.href = canvas.toDataURL("image/png");
			a.click();
		}
		a.parentElement.removeChild(a);
		canvas.remove();
	};
	img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgHtml)));
};


// return object definition
return SimpleGraph;


// END IIFE Constructor
});
