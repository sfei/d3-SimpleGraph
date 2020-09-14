export default function(SimpleGraph, d3) {
    /**
     * Add line data series as an array of coordinates.
     * @param {string} name - series name
     * @param {Array[]} lineCoordinates - array of x,y coordinates.
     * @param {Object} [style]{'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
     *        the resulting SVG element's CSS style.
     * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
     * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addLineDataAsCoordinates = function(name, lineCoordinates, style, interpolation, y2Axis) {
        if(!lineCoordinates || lineCoordinates.length === 0) {
            return this;
        }
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
        
        return this;
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
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addLineDataAsFunction = function(name, lineFunction, style, resolution, interpolation, xRange, y2Axis) {
        if(!lineFunction || typeof lineFunction !== "function" || typeof lineFunction(0) !== "number") {
            return this;
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
        
        return this;
    };

    /**
     * Interpolate lines for each data series in the points data. If called multiple times, will recalculate the 
     * lines and replace existing data.
     * @param {Object} [style={'stroke-width':1.5}] - Object literal of key-value pairs that will be applied as 
     *        the resulting SVG element's CSS style.
     * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
     * @param {string} [handleOverlap="average"] - If there are 2 or more points overlapped for a given x-value, 
     *        how to handle the y-value for the line. Options are "average", "median", "highest", and "lowest".
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addLinesDataFromPoints = function(style, interpolation, handleOverlap) {
        if(!this.points || this.points.length === 0) {
            this.pointLines = null;
            return this;
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
                    lineFunction: null, 
                    resolution: null, 
                    coords: lineCoords, 
                    xRange: null, 
                    y2: pointsBySeries[series].y2, 
                    interpolate: interpolation, 
                    style: style
                });
            }
        }
        
        return this;
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
     * Clear all lines data.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.clearLinesData = function() {
        this.lines = null;
        this.pointLines = null;
        return this;
    };
}