import shapes from "./sg.point.shapes";

export default function(SimpleGraph) {
    /** 
     * @typedef PointData
     * @type Object
     * @property {string} series - The series name this point belongs to.
     * @property {number|Date} x - The x-value.
     * @property {number} y - The y-value.
     * @property {boolean} y2 - If true, the y-value correlates to the y2 axis.
     * @property {number|callback} size - The symbol size. May be a number, a callback function, or null.
     * @memberof SimpleGraph 
     */

    /**
     * Add a datapoint to the given set of data.
     * @param {string} name - The name of the data point or data series.
     * @param {string} xValue - The x-value.
     * @param {string} yValue - The y-value.
     * @param {object} [options]
     * @param {number|callback} [options.size=10] - The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data, if supplied).
     * @param {string} [options.shape='diamond'] - Point shape to apply to data series. Currently supports "diamond", "circle", "square", "triangle", "triangle-up", "triangle-down". Will overwrite for all in series if was previously set.
     * @param {boolean} [options.y2Axis=false] - Whether coordinates are for 2nd y-axis.
     * @param {boolean} [options.showNulls=false] - If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addPointData = function(name, xValue, yValue, options) {
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || typeof options.size == "function" || options.size <= 0 ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        if(options.shape) {
            if(typeof options.shape == "string" && ~shapes.indexOf(options.shape)) {
                this.ptSeriesShapes[name] = options.shape
            }
        }
        var p = {
            series: name, 
            x: parseFloat(xValue), 
            y: parseFloat(yValue), 
            y2: options.y2Axis, 
            size: options.size
        };
        if(isNaN(p.y) || (!p.y && p.y !== 0)) {
            if(showNulls) {
                p.y = 0;
                p.wasNull = true;
            } else {
                return this;
            }
        }
        this.points.push(p);
        
        return this;
    };

    /**
     * Add points data with an array of objects.
     * @param {Object[]} data - The plot data as an array of objects. Use the dataPointName, xValueName, and 
     *        yValueName parameters to tell the function how to parse the data.
     * @param {string} dataPointName - The key name in each data object to retrieve the data point or data series
     *        name and label. If it cannot find the given key in the data object, assumes the given string is the 
     *        series name for all points. If it is null or undefined, uses the index position (thus all points 
     *        will be of unique series).
     * @param {string} xValueName - The key name in each data object to retrieve the x-value.
     * @param {string} yValueName - The key name in each data object to retrieve the y-value.
     * @param {object} [options]
     * @param {number|callback} [options.size=10] - The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data, if supplied).
     * @param {string|object} [options.shape='diamond'] - Point shape(s) to apply to series. Currently supports "diamond", "circle", "square", "triangle", "triangle-up", "triangle-down". If a string, any series data found will be changed to this shape (including those added previously). If an object, will only remap for series found as keys to values as shape.
     * @param {boolean} [options.y2Axis=false] - Whether coordinates are for 2nd y-axis.
     * @param {boolean} [options.showNulls=false] - If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.
     * @param {string[]} [options.additionalDataKeys] - Additional keys for data you want to store for each point.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addPointsData = function(data, dataPointName, xValueName, yValueName, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || typeof options.size == "function" || options.size <= 0 ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        options.additionalDataKeys = options.additionalDataKeys || null;
        // validate shape, if object type, map to local dict, otherwise save for loop as we get series names
        if(options.shape) {
            if(typeof options.shape !== "string" || !~shapes.indexOf(options.shape)) {
                for(let series in options.shape) {
                    if(~shapes.indexOf(options.shape[series])) {
                        this.ptSeriesShapes[series] = options.shape[series];
                    }
                }
                option.shape = false;
            }
        } else {
            options.shape = false;
        }
        // first we gotta comb through the data and organize it nicely
        for(var i = 0; i < data.length; i++) {
            // get data series name, if it exists, otherwise assume dataPointName is series name
            var seriesName = !dataPointName ? i : (data[i][dataPointName] ? data[i][dataPointName] : dataPointName), 
                xValue = data[i][xValueName], 
                yValue = data[i][yValueName];
            // add shape if provided as constant string
            if(options.shape) this.ptSeriesShapes[seriesName] = options.shape;
            // if any null x-values, skip
            if(xValue === undefined || xValue === null) continue;
            // nicely organize data
            var point = {
                series: seriesName, 
                x: xValue, 
                y: parseFloat(yValue), 
                y2: options.y2Axis, 
                size: options.size
            };
            // check for nulls
            if(isNaN(point.y) || (!point.y && point.y !== 0)) {
                if(!showNulls) continue;
                point.y = 0;
                point.wasNull = true;
            }
            // check for NaN 
            if(isNaN(point.y)) {
                point.y = 0;
                point.wasNull = true;
            }
            // additonal keys
            if(options.additionalDataKeys && Array.isArray(options.additionalDataKeys)) {
                options.additionalDataKeys.forEach((key) => {
                    let asKey = key, 
                        t = 1;
                    // if key exists (name, x, y are reserved), adjust key name
                    while(asKey in point) {
                        asKey = key + String(++t);
                    }
                    point[asKey] = data[i][key];
                });
            }
            this.points.push(point);
        }
        
        return this;
    };

    /**
     * Add points data with an array of arrays.
     * @param {string} name - The name of the data data series.
     * @param {Array[]} data - The plot data as an array of [x,y] arrays.
     * @param {object} [options]
     * @param {number|callback} [options.size=10] - The size of the points when drawn. May also be a callback function where the 'this' scope would be the data point object (with keys series, x, y, and additional data, if supplied).
     * @param {string} [options.shape='diamond'] - Point shape to apply to data series. Currently supports "diamond", "circle", "square", "triangle", "triangle-up", "triangle-down". Will overwrite for all in series if was previously set.
     * @param {boolean} [options.y2Axis=false] - Whether coordinates are for 2nd y-axis.
     * @param {boolean} [options.showNulls=false] - If true, converts undefined/null y-values to 0. If false, undefined/null y-values are not added.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addPointsDataAsArray = function(name, data, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || typeof options.size == "function" || options.size <= 0 ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        if(options.shape) {
            if(typeof options.shape == "string" && ~shapes.indexOf(options.shape)) {
                this.ptSeriesShapes[name] = options.shape
            }
        }
        for(var i = 0; i < data.length; i++) {
            if(data[i][0] === undefined || data[i][0] === null || data[i][1] === undefined || data[i][1] === null) {
                continue;
            }
            var p = {
                series: name, 
                x: parseFloat(data[i][0]),
                y: parseFloat(data[i][1]), 
                y2: options.y2Axis, 
                size: options.size
            };
            if(isNaN(p.y) || (!p.y && p.y !== 0)) {
                if(showNulls) {
                    p.y = 0;
                    p.wasNull = true;
                } else {
                    continue;
                }
            }
            this.points.push(p);
        }
        
        return this;
    };

    /**
     * Set point series shape.
     * @param {string|object} [shape='diamond'] - Point shape(s) to apply to series.. Currently supports "diamond", "circle", "square", "triangle", "triangle-up", "triangle-down". If a string, any series data found will be changed to this shape (including thoes added previously). If an object, will only remap for series found as keys to values as shape.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.setPointSeriesShape = function(name, shape) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        if(!shape) return null;
        if(typeof shape == "string" && ~shapes.indexOf(shape)) {
            this.ptSeriesShapes[name] = shape
        }
    };

    /**
     * Get point series shape.
     * @returns shape information as string.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.getPointSeriesShape = function(name) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        return this.ptSeriesShapes[name];
    };

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
     * Clear all points data.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.clearPointsData = function() {
        this.points = null;
        return this;
    };

}