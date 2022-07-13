/*************************************************************************************************************
 * D3-Simple-Graph
 * @version v3.0.0
 * @author Lawrence Sim
 * @copyright 2022 - San Francisco Estuary Institute
 * @license This project is licensed under the GNU Lesser General Public License.
 ************************************************************************************************************/
import * as d3 from 'd3';

function SimpleGraph(options) {
    // default options
    if(!options)             { options = {}; }
    if(!options.container)   { options.container = "body"; }
    if(!options.margins)     { options.margins = {}; }
    if(!options.axis)        { options.axis = {}; }
    if(!options.styles)      { options.styles = {}; }
    
    // Option to allow drawing outside graph range.
    this.allowDrawBeyondGraph = options.allowDrawBeyondGraph;

    // adjust width and height by margins
    this.margins = {
        left: (!options.margins.left && options.margins.left !== 0) ? 40 : options.margins.left, 
        right: (!options.margins.right && options.margins.right !== 0) ? 20 : options.margins.right, 
        top: (!options.margins.top && options.margins.top !== 0) ? 20 : options.margins.top, 
        bottom: (!options.margins.bottom && options.margins.bottom !== 0) ? 40 : options.margins.bottom
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
        .style('overflow', 'visible');
    this.svgGraph = this.svg.append("g")
        .attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");
    
    // append styles, save to instance the default text-size
    for(var style in options.styles) {
        this.svg.style(style, options.styles[style]);
    }
    
    this.resetAxisOptions(options.axis);
    
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
import sgAxis from "./sg.axis";
sgAxis(SimpleGraph, d3);
// Color/category functions
import sgColor from "./sg.color";
sgColor(SimpleGraph, d3);
// Grid and legend
import sgGridLegend from "./sg.grid.legend";
sgGridLegend(SimpleGraph, d3);
// Data functions
import sgDataPoint from "./sg.data.point";
import sgDataArea from "./sg.data.area";
import sgDataLine from "./sg.data.line";
sgDataPoint(SimpleGraph, d3);
sgDataArea(SimpleGraph, d3);
sgDataLine(SimpleGraph, d3);
// Draw functions
import sgDrawLib from "./sg.draw.lib";
import sgDrawPoints from "./sg.draw.points";
import sgDrawLines from "./sg.draw.lines";
import sgDrawAreas from "./sg.draw.areas";
sgDrawLib(SimpleGraph, d3);
sgDrawPoints(SimpleGraph, d3);
sgDrawLines(SimpleGraph, d3);
sgDrawAreas(SimpleGraph, d3);
// Interactivity functions
import sgTooltip from "./sg.tooltip";
import sgHighlight from "./sg.highlight";
sgTooltip(SimpleGraph, d3);
sgHighlight(SimpleGraph, d3);

//************************************************************************************************************
// Misc Functions
//************************************************************************************************************
SimpleGraph.prototype.clearAllData = function(series) {
    this.clearPointsData(series);
    this.clearLinesData(series);
    this.clearAreasData(series);
    return this;
};

/**
 * Clear all data.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.clearAllData = function() {
    this.clearPointsData();
    this.clearLinesData();
    this.clearAreasData();
    return this;
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
 * @memberof SimpleGraph 
 */
/**
 * Grab all point data by series names.
 * @param {string} seriesName - Name of the series for which you want to grab data.
 * @returns {PointData[]} Array of points data.
 * @memberof SimpleGraph 
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
 * @memberof SimpleGraph 
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
 * @memberof SimpleGraph 
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
 * @memberof SimpleGraph 
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
 * ".sg-point".
 */
SimpleGraph.prototype.drawPoints = function() {
    this.removePoints();

    if(!this.points || this.points.length === 0) {
        return this;
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
            if(this.x.break) {
                addPoint = addPoint && (
                    this.points[i].x <= this.x.break.domain[0]
                    || this.points[i].x >= this.x.break.domain[0]
                );
            }
            if(yAxis.break) {
                addPoint = addPoint && (
                    this.points[i].y <= yAxis.break.domain[0]
                    || this.points[i].y >= yAxis.break.domain[0]
                );
            }
            if(addPoint) { drawPointsData.push(this.points[i]); }
        }
    }

    var points = this.svgGraph.selectAll(".sg-point")
        .data(drawPointsData)
      .enter().append("rect")
        .attr("series", function(d) { return d.series; })
        .attr("class", "sg-point")
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
        
    return this;
};

/**
 * Draw lines on graph. If lines exist already, will remove and redraw them. Lines will have class 
 * ".sg-line" or ".sg-plotted-line".
 * @memberof SimpleGraph 
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
        var yAxis = lineData.y2 ? self.y2 : self.y;
        if(lineCoords.length < 2) {
            return this;
        }
        var addedLine = svgGraph.selectAll(".sg-temporary-line")
            .data([lineCoords])
          .enter().append("path")
            .attr("series", lineData.series)
            .attr("class", className)
            .style("fill", 'none')
            .attr("d",
                d3.line()
                    .x(function(c) { return xScale(c[0]); })
                    .y(function(c) { return yAxis.scale(c[1]); })
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
                addLine(line, line.coords, "sg-line");
            } else {
                var lineSegments = this._getLineSegmentsFromCoordinates(line.coords, line.y2);
                for(var s = 0; s < lineSegments.length; s++) {
                    addLine(line, lineSegments[s], "sg-line");
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
                var lineSegments = this._getLineSegmentsFromFunction(
                    line.lineFunction, 
                    line.resolution, 
                    line.xRange, 
                    line.y2Axis, 
                    !this.allowDrawBeyondGraph
                );
                for(var s = 0; s < lineSegments.length; s++) {
                    addLine(line, lineSegments[s], "sg-plotted-line");
                }
            // lines added as coordinates
            } else {
                if(this.allowDrawBeyondGraph) {
                    addLine(line.coords, "sg-plotted-line");
                } else {
                    var lineSegments = this._getLineSegmentsFromCoordinates(line.coords, line.y2);
                    for(var s = 0; s < lineSegments.length; s++) {
                        addLine(line, lineSegments[s], "sg-plotted-line");
                    }
                }
            }
        }
    }
    
    return this;
};

/**
 * Draw areas onto graph. Areas will have class ".plotted-areas".
 * @memberof SimpleGraph 
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
            return this;
        }
        var yScale = areaData.y2 ? self.y2.scale : self.y.scale;
        var addedArea = self.svgGraph.selectAll(".sg-temporary-area")
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
                var areaPolys = this._getAreasPolysFromFunctions(
                    area.areaFunctions[0], 
                    area.areaFunctions[1], 
                    area.resolution, 
                    area.xRange, 
                    area.y2, 
                    !this.allowDrawBeyondGraph
                );
                for(var p = 0; p < areaPolys.length; p++) {
                    addArea(area, areaPolys[p], "sg-plotted-area");
                }
            // areas added as coordinates
            } else {
                if(this.allowDrawBeyondGraph) {
                    addArea(area.coords, "sg-plotted-area");
                } else {
                    var areaPolys = this._getAreaPolysFromCoordinates(area.coords, area.y2);
                    for(var p = 0; p < areaPolys.length; p++) {
                        addArea(area, areaPolys[p], "sg-plotted-area");
                    }
                }
            }
        }
    }
    
    return this;
};


//************************************************************************************************************
// Mostly "private" functions for creating line coordinates from function
//************************************************************************************************************
SimpleGraph.prototype._findIntercept = function(f, x1, x2, y2Axis) {
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

SimpleGraph.prototype._getLineSegmentsFromCoordinates = function(lineCoords, y2Axis) {
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
                if(slope !== 0) {
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
                var yTarget = slope > 0 ? yAxis.max : yAxis.min;
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

SimpleGraph.prototype._getLineSegmentsFromFunction = function(lineFunction, resolution, xRange, y2Axis, limitToGraphRange) {
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

SimpleGraph.prototype._getAreaPolysFromCoordinates = function(areaCoordinates, y2Axis) {
    var lineA = [];
    var lineB = [];
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
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.removePoints = function() {
    this.svgGraph.selectAll(".sg-dot, .sg-point").remove();
    return this;
};

/**
 * Remove lines from graph.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.removeLines = function() {
    this.svgGraph.selectAll(".sg-line, .sg-plotted-line").remove();
    return this;
};

/**
 * Remove areas from graph.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.removeAreas = function() {
    this.svgGraph.selectAll(".sg-plotted-area").remove();
    return this;
};

/**
 * Remove everything from graph.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.removeAll = function() {
    this.removePoints().removeAllLines().removeAreas();
    return this;
};

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
    // not explicitly required, assumed loaded somewhere on the page globally)
    if(navigator.msSaveBlob && canvg) {
        // have to manually replace the width/height in cases of bottom-buffer IE hack for resizable graphs
        svgHtml = svgHtml.replace("style=\"width: 100%; height: 1px;", "style=\"width:" + this.containerWidth + "px; height:" + this.containerHeight + "px;");
        // draw via canvg, which is totally redudant if not for the fact this is only way to bypass security error
        canvg(canvas, svgHtml);
        navigator.msSaveBlob(
            new Blob([canvas.msToBlob()], {type:"image/png"}), 
            pngName
        );
        return this;
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

export default SimpleGraph;