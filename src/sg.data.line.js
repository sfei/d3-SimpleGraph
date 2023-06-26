export default function(SimpleGraph, d3) {

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