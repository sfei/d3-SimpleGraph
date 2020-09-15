export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.addAreaBetweenTwoLines = function(name, lineFunctionBottom, lineFunctionTop, style, resolution, interpolation, xRange, y2Axis) {
        if(!lineFunctionTop || typeof lineFunctionTop !== "function") {
            return this;
        }
        if(!lineFunctionBottom || typeof lineFunctionBottom !== "function") {
            return this;
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
        
        return this;
    };

    SimpleGraph.prototype.addAreaAsCoordinates = function(name, areaCoordinates, style, interpolation, y2Axis) {
        if(!areaCoordinates || !Array.isArray(areaCoordinates) || areaCoordinates.length < 2) {
            return this;
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
            resolution: null, 
            xRange: null, 
            y2: y2Axis ? true : false, 
            style: style, 
            interpolate: interpolation
        });
        
        return this;
    };

    SimpleGraph.prototype.getAreasDataBySeries = function(series) {
        if(!this.areas) return [];
        return this.areas
            .filter(d => d.series === series)
            .map(d => ({
                series:        d.series, 
                areaFunctions: d.areaFunctions, 
                coords:        d.coords.map(c => [...c]), 
                resolution:    d.resolution, 
                xRange:        [...d.xRange], 
                y2:            d.y2, 
                style:         d.style, 
                interpolate:   d.interpolation
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
}