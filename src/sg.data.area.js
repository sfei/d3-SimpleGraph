export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.addAreaBetweenTwoLines = function(name, lineFunctionBottom, lineFunctionTop, xRange, options) {
        if(!lineFunctionTop || typeof lineFunctionTop !== "function") return this;
        if(!lineFunctionBottom || typeof lineFunctionBottom !== "function") return this;
        options = options || {};
        this.areas = this.areas || [];
        this.areas.push({
            series:      name, 
            functions:   [lineFunctionBottom, lineFunctionTop], 
            coords:      null, 
            xRange:      xRange ? [...xRange] : null, 
            y2:          !!options.y2Axis, 
            style:       options.style || {}, 
            interpolate: options.interpolation || d3.curveLinear, 
            _bind:       {xRange: xRange}
        });
        return this;
    };

    SimpleGraph.prototype.addAreaAsCoordinates = function(name, areaCoordinates, options) {
        if(!areaCoordinates || !Array.isArray(areaCoordinates) || areaCoordinates.length < 2) return this;
        options = options || {};
        this.areas = this.areas || [];
        this.areas.push({
            series:      name, 
            functions:   null, 
            coords:      areaCoordinates, 
            xRange:      null, 
            y2:          !!options.y2Axis, 
            style:       options.style || {}, 
            interpolate: options.interpolation || d3.curveLinear, 
            _bind:       {coords: areaCoordinates}
        });
        return this;
    };

    SimpleGraph.prototype.getAreasDataBySeries = function(series) {
        if(!this.areas) return [];
        return this.areas
            .filter(d => d.series === series)
            .map(d => ({
                series:      d.series, 
                functions:   d.functions ? [...d.functions] : null, 
                coords:      d.coords ? d.coords.map(c => [...c]) : null, 
                xRange:      d.xRange ? [...d.xRange] : null, 
                y2:          d.y2, 
                style:       d.style, 
                interpolate: d.interpolate
            }));
    };
    
    SimpleGraph.prototype.clearAreasData = function(series) {
        if(!series) {
            this.areas = null;
        } else {
            this.areas = this.areas.filter(d => d.series !== series);
        }
        return this;
    };

    SimpleGraph.prototype.updateAreaInterpolation = function(series, interpolation) {
        if(!this.areas) return this;
        interpolation = interpolation || d3.curveLinear;
        this.areas.forEach(d => {
            if(d.series === series) d.interpolate = interpolation;
        });
        return this;
    };

    SimpleGraph.prototype.updateAreasData = function() {
        if(!this.areas) return this;
        this.areas.forEach(d => {
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