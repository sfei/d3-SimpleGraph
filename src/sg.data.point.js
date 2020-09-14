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

    SimpleGraph.prototype.addPointData = function(name, xValue, yValue, options) {
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || typeof options.size == "function" || options.size <= 0 ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        if(options.shape) this.setPointSeriesShape(name, options.shape);

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

    SimpleGraph.prototype.addPointsData = function(data, dataPointName, xValueName, yValueName, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || typeof options.size == "function" || options.size <= 0 ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        options.additionalDataKeys = options.additionalDataKeys || null;

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

    SimpleGraph.prototype.addPointsDataAsArray = function(name, data, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || typeof options.size == "function" || options.size <= 0 ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        if(options.shape) this.setPointSeriesShape(name, options.shape);

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

    SimpleGraph.prototype.setPointSeriesShape = function(name, shape) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        if(!shape) return null;
        if(typeof shape == "string" && ~shapes.indexOf(shape)) {
            this.ptSeriesShapes[name] = shape
        }
        return this;
    };

    SimpleGraph.prototype.getPointSeriesShape = function(name) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        return this.ptSeriesShapes[name];
    };

    SimpleGraph.prototype.getPointsDataBySeries = function(seriesName) {
        if(!this.points) retunr [];
        return this.points.filter(c => c.series === seriesName);
    };

    SimpleGraph.prototype.getPointCoordinatesBySeries = function(seriesName) {
        if(!this.points) return [];
        return this.points
            .filter(c => c.series === seriesName)
            .map(c => [c.x, c.y || c.y === 0 ? c.y : c.y2]);
    };

    SimpleGraph.prototype.clearPointsData = function() {
        this.points = null;
        return this;
    };

}