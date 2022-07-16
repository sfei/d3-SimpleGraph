export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.addAreaAsCoordinates = function(series, areaCoordinates, options) {
        if(!areaCoordinates || !Array.isArray(areaCoordinates) || areaCoordinates.length < 2) return this;
        options = options || {};
        var style = {};
        if(options.style) {
            for(let k in options.style) {
                style[k] = options.style;
            }
        }
        this.areas = this.areas || [];
        this.areas.push({
            series:      (series === null) ? "" : String(series), 
            functions:   null, 
            coords:      areaCoordinates, 
            resolution:  null, 
            xRange:      null, 
            y2:          !!options.y2Axis, 
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
                style[k] = options.style;
            }
        }
        this.areas = this.areas || [];
        this.areas.push({
            series:      (series === null) ? "" : String(series), 
            functions:   [lineFunctionBottom, lineFunctionTop], 
            coords:      null, 
            xRange:      xRange ? [...xRange] : null, 
            y2:          !!options.y2Axis, 
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