export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.addLineDataAsCoordinates = function(name, coords, options) {
        if(!coords || coords.length === 0) {
            return this;
        }
        this.lines = this.lines || [];
        //coords.sort(function(a, b) { return a[0] - b[0]; });
        // defaults
        options = options || {};
        var style = options.style || {};
        if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
            style['stroke-width'] = 1.5;
        }
        this.lines.push({
            series:       name, 
            lineFunction: null, 
            coords:       coords.map(c => [...c]), 
            xRange:       null, 
            y2:           !!options.y2Axis, 
            style:        style, 
            interpolate:  options.interpolation || d3.curveLinear, 
            _bind:        {coords: coords}
        });
        return this;
    };

    SimpleGraph.prototype.addLineDataAsFunction = function(name, lineFunction, xRange, options) {
        if(!lineFunction || typeof lineFunction !== "function" || typeof lineFunction(0) !== "number") {
            return this;
        }
        this.lines = this.lines || [];
        // defaults
        options = options || {};
        var style = options.style || {};
        if(!style['stroke-width'] || typeof style['stroke-width'] !== "number") {
            style['stroke-width'] = 1.5;
        }
        var interpolation = interpolation || d3.curveLinear;
        this.lines.push({
            series:       name, 
            lineFunction: lineFunction, 
            coords:       null, 
            xRange:       xRange ? [...xRange] : null, 
            y2:           !!options.y2Axis, 
            style:        style, 
            interpolate:  options.interpolation || d3.curveLinear, 
            _bind:        {xRange: xRange}
        });
        return this;
    };

    SimpleGraph.prototype.addLinesDataFromPoints = function(forSeries, options) {
        if(!this.points || this.points.length === 0) return this;

        options = options || {};
        var handleOverlap = !options.handleOverlap ? 'average' : options.handleOverlap.toLowerCase();
        // default styles
        var style = options.style || {};
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
                    series:      series, 
                    coords:      lineCoords, 
                    y2:          pointsBySeries[series].y2, 
                    style:       style, 
                    interpolate: options.interpolation || d3.curveLinear
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
        if(!series) {
            this.lines = null;
        } else {
            this.lines = this.lines.filter(d => d.series !== series);
        }
        return this;
    };
    
    SimpleGraph.prototype.clearPointLinesData = function(series) {
        if(!series) {
            this.pointLines = null;
        } else {
            this.pointLines = pointLines.lines.filter(d => d.series !== series);
        }
        return this;
    };

    SimpleGraph.prototype.getLinesDataBySeries = function(series) {
        if(!this.lines) return [];
        return this.lines
            .filter(d => d.series === series)
            .map(d => ({
                series:       d.series, 
                lineFunction: d.lineFunction, 
                coords:       d.coords ? d.coords.map(c => [...c]) : null, 
                xRange:       d.xRange ? [...d.xRange] : null, 
                y2:           d.y2, 
                style:        d.style, 
                interpolate:  d.interpolate
            }));
    };

    SimpleGraph.prototype.updateLineInterpolation = function(series, interpolation) {
        if(!this.lines) return this;
        interpolation = interpolation || d3.curveLinear;
        this.lines.forEach(d => {
            if(d.series === series) d.interpolate = interpolation;
        });
        return this;
    };

    SimpleGraph.prototype.updateLinesData = function() {
        if(!this.lines) return this;
        this.lines.forEach(d => {
            if(d._bind.xRange) {
                d.xRange = [...d._bind.xRange];
            }
            if(d._bind.coords) {
                d.coords = d._bind.coords.map(c => [...c]);
            }
        });
        return this;
    };

}