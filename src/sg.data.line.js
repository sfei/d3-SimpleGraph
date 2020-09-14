export default function(SimpleGraph, d3) {

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
    
    SimpleGraph.prototype.clearLinesData = function() {
        this.lines = null;
        this.pointLines = null;
        return this;
    };
}