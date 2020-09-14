export default function(SimpleGraph, d3) {
    /**
     * Add an area data series using two lines to calculate the top and bottom bounds.
     * @param {string} name - series name
     * @callback lineFunctionBottom - callback function for bottom border of area such that function(x) returns y0.
     * @callback lineFunctionTop - callback function for top border of area such that function(x) returns y1.
     * @param {Object} [style={fill:"#ccc"}] - Object literal of key-value pairs that will be applied as 
     *        the resulting SVG element's CSS style.
     * @param {number} [resolution] - How many coordinates to calculate when drawing the line (defaults to every 
     *        20 pixels of width if not provided and if provided enforces minimum of 2).
     * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
     * @param {number[]} [xRange] - The x-range of the line. Defaults to the min-max of the graph. If supplied 
     *        will still be truncated to the min-max of the graph if it extends past.
     * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
     * @memberof SimpleGraph 
     */
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

    /**
     * Add an area data series a given set of coordinates.
     * @param {string} name - series name
     * @param {number[][]} areaCoordinates - array of area coordinate triplets [x, y0, y1]
     * @param {Object} [style] - Object literal of key-value pairs that will be applied as the resulting SVG 
     *        element's CSS style.
     * @param {string} [interpolation=d3.curveLinear] - Type of interpolation (now curve factory) to draw line with.
     * @param {boolean} [y2Axis=false] - Whether coordinates are for 2nd y-axis.
     * @memberof SimpleGraph 
     */
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

    /**
     * Clear areas data.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.clearAreasData = function() {
        this.areas = null;
        return this;
    };
}