import shapes from "./sg.point.shapes";

export default function(SimpleGraph) {

    SimpleGraph.prototype.addPointData = function(series, xValue, yValue, options) {
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        if(options.shape) this.setPointSeriesShape(series, options.shape);

        var p = {
            series: series, 
            x: parseFloat(xValue), 
            y: parseFloat(yValue), 
            y2: options.y2Axis, 
            size: options.size, 
            _bind: null, 
            _keys: null
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

    SimpleGraph.prototype.addPointsData = function(data, seriesName, xValueName, yValueName, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        options.additionalDataKeys = options.additionalDataKeys || null;

        // first we gotta comb through the data and organize it nicely
        var self = this;
        data.forEach((datum, i) => {
            // get data series name, if it exists, otherwise assume seriesName is series name
            var series = !seriesName ? i : (datum[seriesName] ? datum[seriesName] : seriesName), 
                xValue = datum[xValueName], 
                yValue = datum[yValueName];
            // add shape if provided as constant string
            if(options.shape) self.ptSeriesShapes[series] = options.shape;
            // nicely organize data
            var point = {
                series: series, 
                x: xValue, 
                y: parseFloat(yValue), 
                y2: options.y2Axis, 
                size: options.size, 
                _bind: datum, 
                _keys: {
                    x: xValueName, 
                    y: yValueName, 
                    additional: null
                }
            };
            // check for nulls
            if(isNaN(point.y) || (!point.y && point.y !== 0)) {
                if(!showNulls) return;
                point.y = 0;
                point.wasNull = true;
            }
            // additonal keys
            if(options.additionalDataKeys && Array.isArray(options.additionalDataKeys)) {
                var addKeys = [];
                options.additionalDataKeys.forEach((key) => {
                    let name = key, 
                        t = 1;
                    // if key exists (name, x, y are reserved), adjust key name
                    while(name in point) {
                        name = key + String(++t);
                    }
                    addKeys.push({key: key, name: name})
                    point[name] = datum[key];
                });
                point._keys.additional = addKeys;
            }
            this.points.push(point);
        });
        
        return this;
    };

    SimpleGraph.prototype.addPointsDataAsArray = function(series, data, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!options.y2Axis;
        options.showNulls = !!options.showNulls;
        if(options.shape) this.setPointSeriesShape(series, options.shape);

        var self = this;
        data.forEach(datum => {
            var p = {
                series: series, 
                x: parseFloat(datum[0]),
                y: parseFloat(datum[1]), 
                y2: options.y2Axis, 
                size: options.size, 
                _bind: datum, 
                _keys: {
                    x: 0, 
                    y: 1, 
                    additional: null
                }
            };
            if(isNaN(p.y) || (!p.y && p.y !== 0)) {
                if(!showNulls) return;
                p.y = 0;
                p.wasNull = true;
            }
            self.points.push(p);
        });
        
        return this;
    };

    SimpleGraph.prototype.clearPointsData = function(series) {
        if(!series) {
            this.points = null;
        } else {
            this.points = this.points.filter(d => d.series !== series);
        }
        return this;
    };

    SimpleGraph.prototype.getPointsDataBySeries = function(series) {
        if(!this.points) return [];
        return this.points
            .filter(c => c.series === series)
            .map(d => ({
                x: d.x, 
                y: d.y, 
                y2: d.y2, 
                size: d.size
            }));
    };

    SimpleGraph.prototype.getPointCoordinatesBySeries = function(series) {
        if(!this.points) return [];
        return this.points
            .filter(c => c.series === series)
            .map(c => [c.x, c.y || c.y === 0 ? c.y : c.y2]);
    };

    SimpleGraph.prototype.getPointSeriesShape = function(series) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        return this.ptSeriesShapes[series];
    };

    SimpleGraph.prototype.setPointSeriesShape = function(series, shape) {
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        this.ptSeriesShapes[series] = ~shapes.indexOf(shape) ? shape : null;
        return this;
    };

    SimpleGraph.prototype.updatePointsData = function() {
        if(!this.points) return this;
        this.points.forEach(d => {
            if(!d._bind || !d._keys) return;
            d.x = parseFloat(d._bind[d._keys.x]);
            d.y = parseFloat(d._bind[d._keys.y]);
            if(!d._keys.a) return;
            d._keys.additional.forEach(a => d[a.name] = d._bind[a.key]);
        });

        if(!this.pointLines) return this;
        // first organize points by data series
        var pointsBySeries = {};
        for(var i = 0; i < this.points.length; i++) {
            var series = this.points[i].series;
            if(series in pointsBySeries) {
                pointsBySeries[series].push(this.points[i]);
            } else {
                pointsBySeries[series] = [this.points[i]];
            }
        }
        // update existing point-line data
        var self = this;
        this.pointLines = this.pointLines.filter(d => {
            if(!(d.series in pointsBySeries)) return false;
            d.coords = self._getPointLine(pointsBySeries[d.series]);
            return true;
        });

        return this;
    };

}