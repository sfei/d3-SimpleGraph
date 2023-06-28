import shapes from "./sg.point.shapes";

export default function(SimpleGraph) {

    SimpleGraph.prototype.addPointData = function(series, xValue, yValue, options) {
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        series = (series === null) ? "" : String(series);
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!(options.y2Axis || options.y2);
        if(options.shape) this.setPointSeriesShape(series, options.shape);

        let p = {
            series: series, 
            x: xValue, 
            y: parseFloat(yValue), 
            y2: options.y2Axis, 
            size: options.size, 
            _bind: null, 
            _keys: null
        };

        this.points.push(p);
        
        return this;
    };

    SimpleGraph.prototype.addPointsData = function(data, seriesName, xValueName, yValueName, options) {
        if(!data || data.length === 0) return this;
        this.points = this.points || [];
        this.ptSeriesShapes = this.ptSeriesShapes || {};
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!(options.y2Axis || options.y2);
        options.additionalDataKeys = options.additionalDataKeys || null;

        // first we gotta comb through the data and organize it nicely
        data.forEach((d, i) => {
            // get data series name, if it exists, otherwise assume seriesName is series name
            let snIsIn = !options.forceSeriesName && !options.forceSeries && (seriesName in d) && d[seriesName], 
                series = snIsIn ? d[seriesName] : ((!seriesName && seriesName !== 0) ? i : seriesName), 
                xValue = d[xValueName], 
                yValue = d[yValueName];
            series = (series === null) ? "" : String(series);
            // add shape if provided as constant string
            if(options.shape) this.ptSeriesShapes[series] = options.shape;
            // nicely organize data
            let point = {
                series: series, 
                x: xValue, 
                y: parseFloat(yValue), 
                y2: options.y2Axis, 
                size: options.size, 
                _bind: d, 
                _keys: {
                    x: xValueName, 
                    y: yValueName, 
                    additional: null
                }
            };
            if(snIsIn) point._keys.series = seriesName;
            // additonal keys
            if(options.additionalDataKeys && Array.isArray(options.additionalDataKeys)) {
                let addKeys = [];
                options.additionalDataKeys.forEach((key) => {
                    let name = key, 
                        t = 1;
                    // if key exists (name, x, y are reserved), adjust key name
                    while(name in point) {
                        name = key + String(++t);
                    }
                    addKeys.push({key: key, name: name})
                    point[name] = d[key];
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
        series = (series === null) ? "" : String(series);
        options = options || {};
        options.size = !options.size || (typeof options.size !== "function" && options.size <= 0) ? options.size = 10 : options.size;
        options.y2Axis = !!(options.y2Axis || options.y2);
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
        if(series === null || typeof series === "undefined") {
            this.points = null;
        } else if(Array.isArray(series)) {
            this.points = this.points.filter(d => ~series.indexOf(d.series));
        } else {
            this.points = this.points.filter(d => d.series !== series);
        }
        return this;
    };

    SimpleGraph.prototype._getPointData = function(series, index) {
        if(!this.points) return [];
        var points = this.points.filter(d => d.series === series)
        if(!points || !points.length) return this;
        if(index || index === 0) {
            while(index < 0) { index = points.length + index; }
            points = [points[index]];
        }
        return points;
    };

    SimpleGraph.prototype._clonePointData = function(d) {
        let data = {
            series: d.series, 
            x: d.x, 
            y: d.y, 
            y2: d.y2, 
            size: d.size
        };
        if(d._keys) {
            if(d._keys.x) data[d._keys.x] = d.x;
            if(d._keys.y) data[d._keys.y] = d.y;
            d._keys.additional && d._keys.additional.forEach(a => {
                data[a.name] = d[a.name];
            });
        }
        return data;
    };

    SimpleGraph.prototype.getPointsDataBySeries = function(series) {
        return this._getPointData(series).map(d => this._clonePointData(d));
    };

    SimpleGraph.prototype.getPointCoordinatesBySeries = function(series) {
        return this._getPointData.map(c => [c.x, c.y || c.y === 0 ? c.y : c.y2]);
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

    SimpleGraph.prototype.updatePointsData = function(series, index, update) {
        this._getPointData(series, index).forEach(point => {
            ['x', 'y', 'y2', 'size'].forEach(k => {
                if((k in update) && update[k] !== null && typeof update[k] !== undefined) {
                    point[k] = update[k];
                    if(point._keys) delete point._keys[k];
                }
            });
        });
        this._syncPointLinesData();
        return this;
    };

    SimpleGraph.prototype.syncPointsData = function() {
        if(!this.points) return this;
        this.points.forEach(d => {
            if(!d._bind || !d._keys) return;
            if('series' in d._keys) d._bind[d._keys.series];
            if('x' in d._keys) d.x = parseFloat(d._bind[d._keys.x]);
            if('y' in d._keys) d.y = parseFloat(d._bind[d._keys.y]);
            if(!d._keys.additional) return;
            d._keys.additional.forEach(a => d[a.name] = d._bind[a.key]);
        });
        this._syncPointLines();
        return this;
    };

}