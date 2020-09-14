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
    
    SimpleGraph.prototype.clearAreasData = function() {
        this.areas = null;
        return this;
    };
}