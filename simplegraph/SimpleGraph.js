/*************************************************************************************************************
 * SimpleGraph
 *
 * @author Lawrence Sim
 * @copyright 2016 - Lawrence Sim
 
 * @license
 * Copyright (c) 2016 - Lawrence Sim
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

 
/**
 * Create a SimpleGraph instance and draw an empty graph.
 * @param {Object} [options] - Object literal of options (all optional).
 * @param {string} [options.container='body'] - The DOM element query/selector to the element to append the graph too 
 *		graph to.
 * @param {number} [options.width=600] - Width value.
 * @param {number} [options.height=600] - Height value).
 * @param {Object} [options.margins={top:20,right:20,bottom:40,left:40}] - Margins for graph within 
 *		overarching SVG (e.g. with all default values, the width of the actual graph will be 540px in a 600px 
 * 		wide SVG element).
 * @param {d3.scale} [options.colorScale=d3.scale.category10()] - Optional color scale to use with data. If 
 * 		data series will have non-numeric identifiers, it should be a categorical or ordinal scale.
 * @param {Object} [options.axis] - Optional dictionary of styles axes.
 * @param {Object} [option.axis.style={fill:"none",'stroke-width':0.5,stroke:'black'}] - Shared styles for 
 * 		both axes stored as key-value pairs where each key is the name of an appropriate style.
 * @param {Object} [options.axis.x] - X-axis options object (further expanded below).
 * @param {Object} [options.axis.y] - Y-axis options object (same as expanded x-axis options).
 * @param {number} [options.axis.x.min=0] - Minimum value on axis 
 * @param {number} [options.axis.x.max=100] - Maximum value on axis.
 * @param {string} [options.axis.x.label="x-value"] - Axis label.
 * @param {string} [options.axis.x.format=".0f"] - Number format for tick labels.
 * @param {number[]} [options.axis.x.tickValues] - Specific values on x-axis to create tick marks on (this 
 *		will take priority over options.axis.x.ticks if both are supplied).
 * @param {number} [options.axis.x.ticks] - Number of evenly spaced tick intervals on x-axis to create (due 
 * 		to nature of axis, may not always create exactly this amount but will attempt to)
 */
var SimpleGraph = function(options) {
	// otherwise reaching too deep will cause errors
	if(!options) { options = {}; }
	if(!options.margins) { options.margins = {}; }
	if(!options.axis) { options.axis = {}; }
	if(!options.axis.x) { options.axis.x = {}; }
	if(!options.axis.y) { options.axis.y = {}; }
	if(!options.axis.styles) { options.axis.styles = {}; }
	// right now the min/max for the axes are fairly fixed, should be customizable later
	this.minMax = {
		x: [
			(options.axis.x.min) ? options.axis.x.min : 0, 
			(options.axis.x.max) ? options.axis.x.max : 100
		],
		y: [
			(options.axis.y.min) ? options.axis.y.min : 0, 
			(options.axis.y.max) ? options.axis.y.max : 100
			
		]
	};

	// adjust width and height by margins
	this.margins = {
		left: (!options.margins.left) ? 40 : options.margins.left, 
		right: (!options.margins.right) ? 20 : options.margins.right, 
		top: (!options.margins.top) ? 20 : options.margins.top, 
		bottom: (!options.margins.bottom) ? 40 : options.margins.bottom
	};
	this.width = ((options.width) ?  options.width : 600) - this.margins.left - this.margins.right;
	this.height = ((options.height) ?  options.height : 400) - this.margins.top - this.margins.bottom;
	
	// category color scale
	this.color = (options.colorScale) ? options.colorScale : d3.scale.category10();
	
	if(!options.container) {
		options.container = "body";
	}
	
	// default axis styles
	this.axisStyles = options.axis.style;
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
	if(!options.axis.x) {
		options.axis.x = {};
	}
	if(!options.axis.x.format) {
		options.axis.x.format = ".0f";
	}
	if(!options.axis.y) {
		options.axis.y = {};
	}
	if(!options.axis.y.format) {
		options.axis.y.format = ".0f";
	}
	this.xAxisLabel = (!options.axis.x.label) ? "x-value" : options.axis.x.label;
	this.yAxisLabel = (!options.axis.y.label) ? "y-value" : options.axis.y.label;

	// create the SVG
	this.svg = d3.select(options.container)
	  .append("svg")
		.attr("width", this.width + this.margins.left + this.margins.right)
		.attr("height", this.height + this.margins.top + this.margins.bottom)
		.style('font-family', "'Century Gothic', CenturyGothic, Geneva, AppleGothic, sans-serif")
		.style('font-size', '14px')
		.style('overflow', 'visible');
	this.svgGraphic = this.svg.append("g")
		.attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");

	// x-axis
	this.xScale = d3.scale.linear()
		.domain(this.minMax.x)
		.range([0, this.width]);
	this.xAxis = d3.svg.axis()
		.scale(this.xScale)
		.tickFormat(d3.format(options.axis.x.format))
		.orient("bottom");
	if(options.axis.x.tickValues) {
		this.xAxis.tickValues(options.axis.x.tickValues);
	} else if(options.axis.x.ticks) {
		this.xAxis.ticks(options.axis.x.ticks);
	}

	// y-axis
	this.yScale = d3.scale.linear()
		.domain(this.minMax.y)
		.range([this.height, 0]);
	this.yAxis = d3.svg.axis()
		.scale(this.yScale)
		.tickFormat(d3.format(options.axis.y.format))
		.orient("left");
	if(options.axis.y.tickValues) {
		this.yAxis.tickValues(options.axis.y.tickValues);
	} else if(options.axis.y.ticks) {
		this.yAxis.ticks(options.axis.y.ticks);
	}
	
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
	return this.svgGraphic;
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
	this.svgGraphic = null;
	this.clearAllData();
	this.color = null;
	this.xScale = null;
	this.yScale = null;
	this.yAxis = null;
	this.xAxis = null;
};


//************************************************************************************************************
// Common Drawing Functions
//************************************************************************************************************
/**
 * Draw axes on graph. Currently not a whole lot of customizability here.
 */
SimpleGraph.prototype.drawAxes = function() {
	this.svgGraphic.selectAll(".scatterplot-xaxis, .scatterplot-yaxis, .axis-label").remove();
	this.svgGraphic.append("g")
		.attr("class", "scatterplot-xaxis")
		.attr("transform", "translate(0," + this.height + ")")
		.call(this.xAxis)
	  .append("text")
		.attr("class", "axis-label")
		.attr("x", this.width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.style("font-weight", "bolder")
		.text(this.xAxisLabel);
	this.svgGraphic.append("g")
		.attr("class", "scatterplot-yaxis")
		.call(this.yAxis)
	  .append("text")
		.attr("class", "axis-label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-weight", "bolder")
		.text(this.yAxisLabel);
		
	// for some reason ticks are by default invisible
	this.svgGraphic.selectAll(".tick line").style("stroke", "#000");
	
	var axes = this.svgGraphic.selectAll(".scatterplot-xaxis .domain, .scatterplot-yaxis .domain");
	for(var style in this.axisStyles) {
		axes.style(style, this.axisStyles[style]);
	}
};

/**
 * Add grid over graph.
 * @param {Object} [style={opacity:0.4,stroke:"#555","stroke-width":0.3}]
 */
SimpleGraph.prototype.drawGrid = function(style) {
	this.svgGraphic.selectAll(".scatterplot-grid").remove();
	var opacity = (style && style.opacity) ? parseFloat(style.opacity) : 0.4;
	var stroke = (style && style.stroke) ? style.stroke : "#555";
	var strokeWidth = (style && style['stroke-width']) ? parseFloat(style['stroke-width']) : 0.3;
	this.svgGraphic.append("g")
		.attr("class", "scatterplot-grid")
		.attr("transform", "translate(0," + this.height + ")")
		.style("opacity", opacity)
		.style("stroke", stroke)
		.style("stroke-width", strokeWidth)
		.call(this.xAxis
			.tickSize(-this.height, 0, 0)
			.tickFormat("")
		);
	this.svgGraphic.append("g")
		.attr("class", "scatterplot-grid")
		.attr("opacity", opacity)
		.style("stroke", stroke)
		.style("stroke-width", strokeWidth)
		.call(this.yAxis
			.tickSize(-this.width, 0, 0)
			.tickFormat("")
		);
};

/**
 * Remove grid, if it exists.
 */
SimpleGraph.prototype.removeGrid = function() {
	this.svgGraphic.selectAll(".scatterplot-grid").remove();
};

/**
 * Draw the legend onto the graph. If legend already exists, will redraw it.
 * @param {number[]} position - x,y coordinate position from top-left corner of SVG
 * @param {Object} [bgstyle] - Optional styles for the legend. These are SVG style attributes with the 
 * 		exception of support for padding.
 */
SimpleGraph.prototype.drawLegend = function(position, bgstyle) {
	this.svgGraphic.selectAll(".scatterplot-legend").remove();
	
	if(!position) {
		position = { x: 0, y: 0 };
	} else if(!position.x || !position.y) {
		if(!position.x) {
			position.x = (position[0] && typeof position[0] === "number") ? position[0] : this.width+5;
		}
		if(!position.y) {
			position.y = (position[1] && typeof position[1] === "number") ? position[1] : 0;
		}
	}
	
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
	
	var legend = this.svgGraphic.append("g")
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
	
	var yOffset = bgstyle['padding-top'];
	
	// by unique point names
	if(this.points) {
		var pointSeries = [];
		for(var i = 0; i < this.points.length; i++) {
			var name = this.points[i].series;
			if(pointSeries.indexOf(name) < 0) {
				pointSeries.push(name);
				if(!legend) { createLegend(); }
				legend.append("rect")
					.attr("x", 2+bgstyle['padding-left'])
					.attr("y", yOffset+4)
					.attr("width", 14)
					.attr("height", 14)
					.attr("transform", function(d) {
						return "rotate(45," + (10+bgstyle['padding-left']) + "," + (10+yOffset) + ")"; }
					)
					.style("fill", this.getColorBySeriesName(name));
				legend.append("text")
					.attr("x", 23+bgstyle['padding-left'])
					.attr("y", yOffset + 9)
					.attr("dy", ".35em")
					.style("text-anchor", "start")
					.text(name);
				yOffset += 24;
			}
		}
	}
	
	// now get unique line names
	if(this.lines) {
		var lineSeries = [];
		for(var i = 0; i < this.lines.length; i++) {
			var name = this.lines[i].series;
			if(lineSeries.indexOf(name) < 0) {
				lineSeries.push(name);
				var lineOffset = yOffset + 10;
				var path = legend.append("path")
					.attr("y", yOffset)
					.attr("d", 
						"M" + bgstyle['padding-left'] + " " + lineOffset + " " + 
						"L" + (18+bgstyle['padding-left']) + " " + lineOffset
					);
				for(var style in this.lines[i].style) {
					path.style(style, this.lines[i].style[style]);
				}
				if(!('stroke' in this.lines[i].style)) {
					path.style('stroke', this.color(this.lines[i].series));
				}
				legend.append("text")
					.attr("x", 23+bgstyle['padding-left'])
					.attr("y", yOffset + 9)
					.attr("dy", ".35em")
					.style("text-anchor", "start")
					.text(name);
				yOffset += 24;
			}
		}
	}
	// now get unique area names
	if(this.areas) {
		var areaSeries = [];
		for(var i = 0; i < this.areas.length; i++) {
			var name = this.areas[i].series;
			if(areaSeries.indexOf(name) < 0) {
				areaSeries.push(name);
				var symbol = legend.append("rect")
					.attr("x", bgstyle['padding-left'])
					.attr("y", yOffset)
					.attr("width", 18)
					.attr("height", 18);
				for(var style in this.areas[i].style) {
					symbol.style(style, this.areas[i].style[style]);
				}
				legend.append("text")
					.attr("x", 23+bgstyle['padding-left'])
					.attr("y", yOffset + 9)
					.attr("dy", ".35em")
					.style("text-anchor", "start")
					.text(name);
				yOffset += 24;
			}
		}
	}
	// finish up legend bg after completing elements inside
	var legendBox = legend.node().getBBox();
	legendBg
		.attr("width", legendBox.width + bgstyle['padding-left'] + bgstyle['padding-right'])
		.attr("height", legendBox.height + bgstyle['padding-top'] + bgstyle['padding-bottom']);
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
SimpleGraph.prototype.getColorBySeriesName = function(name) {
	if(!name) { return null; }
	if(this.points) {
		for(var p in this.points) {
			var point = this.points[p];
			if(name === point.series) {
				if(point.style && point.style.fill) {
					return point.style.fill;
				} else {
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
					return (this.color.domain().indexOf(name) >= 0) ? this.color(name) : null;
				}
			}
		}
	}
};

/**
 * Reset domain on color scale, or replace with provided.
 * @param {d3.scale} colorScale - Color scale to replace with or null.
 */
SimpleGraph.prototype.resetColorScale = function(colorScale) {
	if(!colorScale) {
		this.color = colorScale;
	} else {
		this.color.domain([]);
	}
}


//************************************************************************************************************
// Add Data Functions (These do not draw to graph)
//************************************************************************************************************
/**
 * Add a datapoint to the given set of data.
 * @param {string} name - The name of the data point or data series.
 * @param {string} xValue - The x-value.
 * @param {string} yValue - The y-value.
 */
SimpleGraph.prototype.addPointData = function(name, xValue, yValue) {
	if(!this.points) { this.points = []; }
	var p = {
		series: name, 
		x: parseFloat(xValue), 
		y: parseFloat(yValue)
	};
	if(isNaN(p.y)) {
		p.y = 0;
	}
	this.points.push(p);
};

/**
 * Add points data with an array of objects.
 * @param {Object[]} data - The plot data as an array of objects. Use the dataPointName, xValueName, and 
 *		yValueName parameters to tell the function how to parse the data.
 * @param {string} dataPointName - The key name in each data object to retrieve the data point or data series
 *		name and label. Optional. If not supplied, or it cannot find the given key in the data object, 
 *		defaults to the index position in array of points.
 * @param {string} xValueName - The key name in each data object to retrieve the x-value.
 * @param {string} yValueName - The key name in each data object to retrieve the y-value.
 * @param {string[]} [additionalDataKeys] - Additional keys for data you want to store for each point.
 */
SimpleGraph.prototype.addPointsData = function(data, dataPointName, xValueName, yValueName, additionalDataKeys) {
	if(!data || data.length === 0) {
		return;
	}
	if(!this.points) { this.points = []; }
	var pointIndex = -1;
	// first we gotta comb through the data and organize it nicely
	for(var i = 0; i < data.length; i++) {
		// get data series name, if it exists
		var seriesName = (dataPointName && data[i][dataPointName]) ? data[i][dataPointName] : i;
		var xValue = data[i][xValueName];
		var yValue = data[i][yValueName];
		// if any null values, skip
		if(xValue === undefined || xValue === null || yValue === undefined || yValue === null) {
			continue;
		}
		// nicely organize data
		this.points.push({
			series: seriesName, 
			x: parseFloat(xValue), // ensure numeric type
			y: parseFloat(yValue)
		});
		pointIndex++;
		// additonal keys
		if(additionalDataKeys && $.isArray(additionalDataKeys)) {
			for(var k = 0; k < additionalDataKeys.length; k++) {
				var key = additionalDataKeys[k];
				var asKey = key;
				// if key exists (name, x, y are reserved), adjust key name
				var t = 2;
				while(asKey in this.points[pointIndex]) {
					asKey = key + String(t);
					t++;
				}
				this.points[pointIndex][asKey] = data[i][key];
			}
		}
		// check for NaN (from ND)
		if(isNaN(this.points[pointIndex].y)) {
			this.points[pointIndex].y = 0;
		}
	}
};

/**
 * Add points data with an array of arrays.
 * @param {Array[]} data - The plot data as an array of [x,y] arrays.
 * @param {string} name - The name of the data data series.
 */
SimpleGraph.prototype.addPointsDataAsArray = function(data, name) {
	if(!data || data.length === 0) {
		return;
	}
	if(!this.points) { this.points = []; }
	for(var i = 0; i < data.length; i++) {
		if(data[i][0] === undefined || data[i][0] === null || data[i][1] === undefined || data[i][1] === null) {
			continue;
		}
		var p = {
			series: name, 
			x: parseFloat(data[i][0]),
			y: parseFloat(data[i][1])
		};
		if(isNaN(p.y)) {
			p.y = 0;
		}
		this.points.push(p);
	}
}

/**
 * Add line data series as an array of coordinates.
 * @param {string} name - series name
 * @param {Array[]} lineCoordinates - array of x,y coordinates (will automatically be sorted)
 * @param {Object} [style]{'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
 * 		the resulting SVG element's CSS style.
 * @param {string} [interpolation="linear"] - Type of interpolation to draw line with.
 */
SimpleGraph.prototype.addLineDataAsCoordinates = function(name, lineCoordinates, style, interpolation) {
	if(!lineCoordinates || lineCoordinates.length === 0) { return; }
	if(!this.lines) {
		this.lines = [];
	}
	lineCoordinates.sort(function(a, b) { return a[0] - b[0]; });
	// default styles
	if(!style) {
		style = {};
	}
	if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
		style['stroke-width'] = 1.5;
	}
	if(!style.stroke) {
		style.stroke = this.color(name);
	}
	if(!interpolation) {
		interpolation = "linear";
	}
	this.lines.push({
		series: name, 
		coords: lineCoordinates, 
		style: style, 
		interpolate: interpolation
	});
};

/**
 * Add line data series as a function.
 * @param {string} name - Series name
 * @callback lineFunction - Callback function such that function(x) returns y.
 * @param {Object} [style]{'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
 * 		the resulting SVG element's CSS style.
 * @param {number} [resolution] - How many coordinates to calculate when drawing the line (defaults to every 20 
 *		pixels of width if not provided and if provided enforces minimum of 2).
 * @param {string} [interpolation="linear"] - Type of interpolation to draw line with.
 */
SimpleGraph.prototype.addLineDataAsFunction = function(name, lineFunction, style, resolution, interpolation) {
	if(!lineFunction || typeof lineFunction !== "function" || typeof lineFunction(0) !== "number") {
		return;
	}
	if(!resolution || typeof resolution !== "number") {
		resolution = Math.floor((this.width - this.margin.left - this.margin.right) / 20);
	} else if(resolution < 2) {
		resolution = 2;
	}
	if(!this.lines) {
		this.lines = [];
	}
	var coords = [];
	var increment = (this.minMax.x[1] - this.minMax.x[0]) / (resolution-1);
	var x = this.minMax.x[0];
	for(var i = 0; i < resolution; i++) {
		coords.push([x, lineFunction(x)]);
		x += increment;
	}
	// default styles
	if(!style) {
		style = {};
	}
	if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
		style['stroke-width'] = 1.5;
	}
	if(!style.stroke) {
		style.stroke = this.color(name);
	}
	if(!interpolation) {
		interpolation = "linear";
	}
	this.lines.push({
		series: name, 
		lineFunction: lineFunction, 
		coords: coords, 
		style: style, 
		interpolate: interpolation
	});
};

/**
 * Interpolate lines for each data series in the points data. If called multiple times, will recalculate the 
 * lines and replace existing data.
 * @param {Object} [style={'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
 * 		the resulting SVG element's CSS style.
 * @param {string} [interpolation="linear"] - Type of interpolation to draw line with.
 */
SimpleGraph.prototype.addLinesDataFromPoints = function(style, interpolation) {
	if(!this.points || this.points.length === 0) {
		this.pointLines = null;
		return;
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
		interpolation = "linear";
	}
	this.pointLines = [];
	// first we gotta comb through the data and organize it nicely
	for(var i = 0; i < this.points.length; i++) {
		// group values of the same data point name together (to create this.pointLines)
		if(this.points[i].series) {
			// first find if line already exists
			var lineIndex = -1;
			for(var l = 0; l < this.pointLines.length; l++) {
				if(this.points[i].series === this.pointLines[l].series) {
					lineIndex = l;
					break;
				}
			}
			// if doesn't exist, create
			if(lineIndex < 0) {
				this.pointLines.push({
					series: this.points[i].series, 
					coords: [[this.points[i].x, this.points[i].y, 1]] // array of [x, y, and count]
				});
			// if it does exist, we need to check if there are overlapped x-values
			} else {
				var line = this.pointLines[lineIndex];
				var exists = false;
				for(var j = 0; j < line.coords.length; j++) {
					var c = line.coords[j];
					if(c[0] === this.points[i].x) {
						// if it exists, add to count and use average y-value
						c[2] += 1;
						c[1] = (c[1]*(c[2]-1) + this.points[i].y)/c[2];
						exists = true;
						break;
					}
				}
				if(!exists) {
					// if it doesn't exist, push a new point
					line.coords.push(
						[this.points[i].x, this.points[i].y, 1]
					);
				}
			}
		}
	}
	// make sure x-values are in ascending order
	for(var i = 0; i < this.pointLines.length; i++) {
		if(this.pointLines[i].coords.length >= 2) {
			this.pointLines[i].coords.sort(function(a, b) {
				return a[0] - b[0];
			});
		}
	}
	// style and interpolation are shared, so only need to add to first in list
	this.pointLines[0].interpolate = interpolation;
	this.pointLines[0].style = style;
};

/**
 * Add an area data series using two lines to calculate the top and bottom bounds.
 * @param {string} name - series name
 * @callback lineFunctionBottom - callback function for top border of area such that function(x) returns y0.
 * @callback lineFunctionTop - callback function for top border of area such that function(x) returns y1.
 * @param {Object} [style]{'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
 * 		the resulting SVG element's CSS style.
 * @param {number} [resolution] - How many coordinates to calculate when drawing the line (defaults to every 20 
 *		pixels of width if not provided and if provided enforces minimum of 2).
 * @param {string} [interpolation="linear"] - Type of interpolation to draw line with.
 */
SimpleGraph.prototype.addAreaBetweenTwoLines = function(name, lineFunctionBottom, lineFunctionTop, style, resolution, interpolation) {
	if(!lineFunctionTop || typeof lineFunctionTop !== "function" || typeof lineFunctionTop(0) !== "number") {
		return;
	}
	if(!lineFunctionBottom || typeof lineFunctionBottom !== "function" || typeof lineFunctionBottom(0) !== "number") {
		return;
	}
	if(!resolution || typeof resolution !== "number") {
		resolution = Math.floor((this.width - this.margin.left - this.margin.right) / 20);
	} else if(resolution < 2) {
		resolution = 2;
	}
	if(!this.areas) {
		this.areas = [];
	}
	// create coordinates
	var coords = [];
	var increment = (this.minMax.x[1] - this.minMax.x[0]) / (resolution-1);
	var x = this.minMax.x[0];
	for(var i = 0; i < resolution; i++) {
		coords.push([x, lineFunctionBottom(x), lineFunctionTop(x)]);
		x += increment;
	}
	// default styles
	if(!style) {
		style = {};
	}
	if(!style.strokeWidth || typeof style.strokeWidth !== "number") {
		style.strokeWidth = 1.5;
	}
	if(!interpolation) {
		interpolation = "linear";
	}
	// push data
	this.areas.push({
		series: name, 
		functions: [lineFunctionBottom, lineFunctionTop], 
		coords: coords, 
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
	this.points = [];
};

/**
 * Clear all lines data.
 */
SimpleGraph.prototype.clearLinesData = function() {
	this.lines = [];
	this.pointLines = [];
};

/**
 * Clear areas data.
 */
SimpleGraph.prototype.clearAreasData = function() {
	this.areas = [];
};

/**
 * Clear all data.
 */
SimpleGraph.prototype.clearAllData = function() {
	this.points = [];
	this.lines = [];
	this.pointLines = [];
	this.areas = [];
}


//************************************************************************************************************
// Draw Data Functions
//************************************************************************************************************
/**
 * Draw points data onto the graph. If points already exist will remove and redraw. Points will have class 
 * ".scatterplot-point".
 * @param {number} [size=10] - size of points
 */
SimpleGraph.prototype.drawPoints = function(size) {
	if(!this.points || this.points.length === 0) {
		return;
	}
	this.removePoints();
	if(!size || typeof size !== "number") {
		size = 10;
	}
	// for 'this' references
	var color = this.color;
	var xScale = this.xScale;
	var yScale = this.yScale;
	// cycle by shapes, first diamonds
	
	var points = this.svgGraphic.selectAll(".scatterplot-point")
		.data(this.points)
	  .enter().append("rect")
		.attr("class", "scatterplot-point")
		.attr("width", size)
		.attr("height", size)
		.attr("x", function(d) { return xScale(d.x)-size/2.0; })
		.attr("y", function(d) { return yScale(d.y)-size/2.0; })
		.attr("transform", function(d) { return "rotate(45," + xScale(d.x) + "," + yScale(d.y) + ")"; })
		.style("fill", function(d) { return color(d.series);});
};

/**
 * Draw lines on graph. If lines exist already, will remove and redraw them. Lines will have class 
 * ".scatterplot-line" or ".plotted-line".
 */
SimpleGraph.prototype.drawLines = function() {
	this.removeLines();
	// for this references
	var color = this.color;
	var xScale = this.xScale;
	var yScale = this.yScale;
	// add the scatterplot interpolated lines all at once
	if(this.pointLines && this.pointLines.length > 0) {
		var drawLines = this.pointLines;
		// concatenate all line coordinates into array
		var linesAsCoords = [];
		for(var i = 0; i < drawLines.length; i++) {
			linesAsCoords.push(drawLines[i].coords);
		}
		var addLines = this.svgGraphic.selectAll(".scatterplot-line")
			.data(linesAsCoords)
		  .enter().append("path")
			.attr("series", function(l, i) { return drawLines[i].series; })
			.attr("class", "scatterplot-line")
			.style("stroke", function(l, i) { return color(drawLines[i].series); })
			.style("fill", 'none')
			.attr("d",
				d3.svg.line()
					.x(function(coords) { return xScale(coords[0]); })
					.y(function(coords) { return yScale(coords[1]); })
					.interpolate(drawLines.interpolate)
			);
		for(var style in drawLines[0].style) {
			addLines.style(style, drawLines[0].style[style]);
		}
	}
	// add individually added lines one at a time (allows more custom styles)
	if(this.lines) {
		var lines = this.lines;
		for(var i = 0; i < lines.length; i++) {
			var addLine = this.svgGraphic.selectAll(".temporary-line")
				.data([lines[i].coords])
			  .enter().append("path")
				.attr("series", function(l, i) { return lines[i].series; })
				.attr("class", "plotted-line")
				.style("fill", 'none')
				.attr("d",
					d3.svg.line()
						.x(function(coords) { return xScale(coords[0]); })
						.y(function(coords) { return yScale(coords[1]); })
						.interpolate(lines[i].interpolate)
				);
			// add color if not specified
			if(!('stroke' in lines[i].style)) {
				lines[i].style.stroke = this.color(lines[i].series);
			}
			for(var style in lines[i].style) {
				addLine.style(style, lines[i].style[style]);
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
	var color = this.color;
	var xScale = this.xScale;
	var yScale = this.yScale;
	if(this.areas) {
		for(var i = 0; i < this.areas.length; i++) {
			var area = this.areas[i];
			var addArea = this.svgGraphic.selectAll(".temporary-area")
				.data([area.coords])
			  .enter().append("path")
				.attr("name", area.series)
				.attr("class", "plotted-area")
				.style("fill", 'none')
				.attr("d",
					d3.svg.area()
						.x(function(coords) { return xScale(coords[0]); })
						.y0(function(coords) { return yScale(coords[1]); })
						.y1(function(coords) { return yScale(coords[2]); })
						.interpolate(area.interpolate)
				);
			for(var style in area.style) {
				addArea.style(style, area.style[style]);
			}
		}
	}
};


//************************************************************************************************************
// Remove From Graph Functions (does not remove underlying data)
//************************************************************************************************************
/**
 * Remove all points on graph.
 */
SimpleGraph.prototype.removePoints = function() {
	this.svgGraphic.selectAll(".scatterplot-dot, .scatterplot-point").remove();
};

/**
 * Remove lines from graph.
 */
SimpleGraph.prototype.removeLines = function() {
	this.svgGraphic.selectAll(".scatterplot-line, .plotted-line").remove();
};

/**
 * Remove areas from graph.
 */
SimpleGraph.prototype.removeAreas = function() {
	this.svgGraphic.selectAll(".plotted-area").remove();
};

/**
 * Remove everything from graph.
 */
SimpleGraph.prototype.removeAll = function() {
	this.svgGraphic.selectAll(".scatterplot-dot, .scatterplot-point, .scatterplot-line, .plotted-line, .plotted-area").remove();
}


//************************************************************************************************************
// Tooltip Functions
//************************************************************************************************************
/**
 * Add tooltip function to the points on the graph. Does not add tooltips to the lines connecting points, if 
 * they were added. That is handled by addTooltipToLines(). You can check the series name in the callback's 
 * returned SVG element or the class to determine type, regular lines are ".plotted-line" and lines drawn from
 * connecting points are ".scatterplot-line".
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 * 		the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
 * 		the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip div's 
 * 		CSS style (optional).
 */
SimpleGraph.prototype.addTooltipToPoints = function(tooltipFunction, options) {
	this.svgGraphic.selectAll(".scatterplot-point")
		.call(this.addTooltipFunctionality(tooltipFunction, options));
};

/**
 * Add tooltip function to the lines on the graph.
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 * 		the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
 * 		the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip div's 
 * 		CSS style (optional).
 */
SimpleGraph.prototype.addTooltipToLines = function(tooltipFunction, options) {
	this.svgGraphic.selectAll(".scatterplot-line, .plotted-line")
		.call(this.addTooltipFunctionality(tooltipFunction, options));
};

/**
 * Add tooltip function to the areas on the graph.
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 * 		the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
 * 		the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip div's 
 * 		CSS style (optional).
 */
SimpleGraph.prototype.addTooltipToAreas = function(tooltipFunction, options) {
	this.svgGraphic.selectAll(".plotted-area")
		.call(this.addTooltipFunctionality(tooltipFunction, options));
};

/**
 * Tooltip functionality for SVG objects (modified from <http://bl.ocks.org/rveciana/5181105>). Should not be
 * called explicitly, it is added to D3 SVG elements via call(). Use the 
 * addTooltipTo[Points|Lines|Areas]() functions instead.
 * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
 * 		the tooltip.
 * @param {Object} [options] - Optional parameters.
 * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
 * 		the tooltip to the bottom right of the cursor).
 * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip div's 
 * 		CSS style (optional).
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
			// Clean up lost tooltips
			d3Body.selectAll('.d3-tooltip').remove();
			// Append tooltip
			tooltipDiv = d3Body.append('div')
				.attr('class', 'd3-tooltip')
				.style({
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
				});
			// add custom styles if provided
			if(options.style) {
				for(var styleKey in options.style) {
					tooltipDiv.style(styleKey, options.style[styleKey]);
				}
			}
		})
		.on('mousemove', function(d, i) {
			if(!tooltipDiv) { return; }
			// Move tooltip
			var absMousePos = d3.mouse(d3Body.node());
			tooltipDiv.style({
				'left': (absMousePos[0] + 20)+'px',
				'top': (absMousePos[1])+'px'
			});
			var tooltipText = (textFunction) ? textFunction(d, d3.mouse(svg.node()), selection[0], i) : null;
			// If no text, remove tooltip
			if(!tooltipText) {
				tooltipDiv.remove();
			} else {
				tooltipDiv.html(tooltipText);
			}
		})
		.on("mouseout", function(d, i) {
			// Remove tooltip
			if(tooltipDiv) { tooltipDiv.remove(); }
		});
	};
};


/**
 * Handles the text appearing in the tooltip. Several parameters are provided to pull relevant data from.
 * @callback tooltipTextFunction
 * @param {Object} d - The data object bound to the hovered SVG element. Keys included are 'series', 'x', 'y', 
 * 		and any additional data keys specified.
 * @param {number[]} p - The x,y relative mouse position on the parent SVG.
 * @param {Object[]} s - Array of the SVG elements in the layer selected(or null).
 * @param {number} i - Index of selected element in array above such that s[i] gives the specific SVG element.
 */

 
 // Because Internet Explorer... All credit due to Mathias Bynens <https://mathiasbynens.be/>
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
 