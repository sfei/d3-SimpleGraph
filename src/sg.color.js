export default function(SimpleGraph) {

    SimpleGraph.prototype.getColorBySeriesName = function(name, create) {
        if(!name) { return null; }
        if(name in this.customColors) {
            return this.customColors[name];
        }
        if(this.points) {
            for(var p in this.points) {
                var point = this.points[p];
                if(name === point.series) {
                    // TODO, no style options yet available for points data
                    if(point.style && point.style.fill) {
                        return point.style.fill;
                    } else {
                        if(create) { return this.color(name); }
                        return (this.color.domain().indexOf(name) >= 0) ? this.color(name) : null;
                    }
                }
            }
        }
        if(this.lines) {
            for(var l in this.lines) {
                var line = this.lines[l];
                if(name === line.series) {
                    if(line.style && line.style.stroke) {
                        return line.style.stroke;
                    } else {
                        if(create) { return this.color(name); }
                        return (this.color.domain().indexOf(name) >= 0) ? this.color(name) : null;
                    }
                }
            }
        }
        if(this.areas) {
            for(var a in this.areas) {
                var area = this.areas[a];
                if(name === area.series) {
                    if(area.style && area.style.fill) {
                        return area.style.fill;
                    } else {
                        if(create) { return this.color(name); }
                        return (this.color.domain().indexOf(name) >= 0) ? this.color(name) : null;
                    }
                }
            }
        }
        if(create) { return this.color(name); }
    };

    SimpleGraph.prototype.resetColorScale = function(colorScale) {
        if(colorScale) {
            this.color = colorScale;
        } else {
            this.color.domain([]);
        }
        return this;
    };

    SimpleGraph.prototype.setSeriesColor = function(series, color) {
        this.customColors[series] = color;
    };

    SimpleGraph.prototype.removeSeriesColor = function(series) {
        if(this.customColors[series]) {
            delete this.customColors[series];
        };
        return this;
    };
}