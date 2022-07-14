import shapes from "./sg.point.shapes";

export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.removePoints = function() {
        this.svgGraph.selectAll(".sg-point").remove();
        return this;
    };

    SimpleGraph.prototype.drawPoints = function(showNulls, transition) {
        this.removePoints();

        if(!this.points || this.points.length === 0) return this;

        var drawPointsData = this.points;
        // if necessary, remove points that extend beyond graph
        if(!this.allowDrawBeyondGraph) {
            drawPointsData = drawPointsData.filter(d => {
                if((!d.x && d.x !== 0) || Number.isNaN(d.x)) return false;
                if(d.x < this.x.min || d.x > this.x.max) return false;
                if(this.x.break && d.x > this.x.break.domain[0] && d.x < this.x.break.domain[1]) return false;
                if(!showNulls && isNaN(d.y)) return false;
                let yAxis = d.y2 ? this.y2 : this.y;
                if(d.y < yAxis.min || d.y > yAxis.max) return false;
                if(yAxis.break && d.y > yAxis.break.domain[0] && d.y < yAxis.break.domain[1]) return false;
                return true;
            });
        }
        if(!drawPointsData.length) return this;

        var pointsDataBySeries = {};
        drawPointsData.forEach(d => {
            if(!(d.series in pointsDataBySeries)) {
                pointsDataBySeries[d.series] = [d];
            } else {
                pointsDataBySeries[d.series].push(d);
            }
        });

        for(let series in pointsDataBySeries) {
            this._drawPoints(
                this.svgGraph.selectAll(".sg-temporary-point").data(pointsDataBySeries[series]).enter(), 
                this.ptSeriesShapes[series], 
                transition
            );
        }

        return this;
    };

    SimpleGraph.prototype.drawUpdatePoints = function(showNulls, transition) {
        if(!this.points || this.points.length === 0) {
            this.removePoints();
            this.removePointLines();
            return this;
        }

        if(transition) {
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
        }
        
        var drawPointsData = this.points;
        // if necessary, remove points that extend beyond graph
        if(!this.allowDrawBeyondGraph) {
            drawPointsData = drawPointsData.filter(d => {
                if((!d.x && d.x !== 0) || Number.isNaN(d.x)) return false;
                if(d.x < this.x.min || d.x > this.x.max) return false;
                if(this.x.break && d.x > this.x.break.domain[0] && d.x < this.x.break.domain[1]) return false;
                if(!showNulls && isNaN(d.y)) return false;
                let yAxis = d.y2 ? this.y2 : this.y;
                if(d.y < yAxis.min || d.y > yAxis.max) return false;
                if(yAxis.break && d.y > yAxis.break.domain[0] && d.y < yAxis.break.domain[1]) return false;
                return true;
            });
        }

        var pointsDataBySeries = {};
        drawPointsData.forEach(d => {
            if(!(d.series in pointsDataBySeries)) {
                pointsDataBySeries[d.series] = [d];
            } else {
                pointsDataBySeries[d.series].push(d);
            }
        });

        for(let series in pointsDataBySeries) {
            var data = pointsDataBySeries[series], 
                shape = this.ptSeriesShapes[series], 
                selection = this.svgGraph.selectAll(".sg-point")
                    .filter(d => d.series === series);

            // remove points that no longer exist and reselect (for those that will need modifying)
            selection.filter(d => !~data.indexOf(d)).remove();
            selection = selection.filter(d => ~data.indexOf(d));

            // add new points
            var newData = [...data];
            selection.each(d => {
                let exists = newData.indexOf(d);
                if(~exists) newData.splice(exists, 1);
            });
            this._drawPoints(
                this.svgGraph.selectAll(".sg-temporary-point").data(newData).enter(), 
                shape, 
                transition
            );

            // update existing points
            this._updatePoints(selection, shape, transition);
        }

        return this;
    };

    SimpleGraph.prototype._drawPoints = function(selection, shape, transition) {
        if(!selection.size()) return;
        var items;
        switch(shape) {
            case "triangle":
            case "triangle-up":
            case "triangle-down":
                items = selection.append("polygon");
                break;
            case "square":
            case "diamond":
                items = selection.append("rect");
                break;
            default:
            case "circle":
                items = selection.append("circle");
                break;
        }
        items = this._formatPoint(items, shape, transition);
        if(transition) {
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            items.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

    SimpleGraph.prototype._updatePoints = function(selection, shape, transition) {
        if(!selection.size()) return;
        if(transition) {
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            selection = selection.transition().duration(transition.duration).ease(transition.ease);
        }
        this._formatPoint(selection, shape);
    };

    SimpleGraph.prototype._formatPoint = function(selc, shape, fadeIn) {
        switch(shape) {
            case "triangle-down":
                selc.attr("series", d => d.series)
                    .style("opacity", fadeIn ? 0 : 1)
                    .attr("class", "sg-point sg-point-td")
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size() : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = this.x.scale(d.x), 
                            y = isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? this.y2.scale : this.y.scale)(y);
                        return `${x-hl},${y+hh} ${x},${y-hh} ${x+hl},${y+hh}`;
                    })
                    .style("fill", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            case "triangle":
            case "triangle-up":
                selc.attr("series", d => d.series)
                    .style("opacity", fadeIn ? 0 : 1)
                    .attr("class", "sg-point sg-point-tu")
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size(d, d._bind) : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = this.x.scale(d.x), 
                            y = isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? this.y2.scale : this.y.scale)(y);
                        return `${x-hl},${y-hh} ${x},${y+hh} ${x+hl},${y-hh}`;
                    })
                    .style("fill", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            case "square":
            case "diamond":
                selc.attr("series", d => d.series)
                    .style("opacity", fadeIn ? 0 : 1)
                    .attr("class", "sg-point sg-point-sd")
                    .attr("width", d => (typeof d.size === "function") ? d.size() : d.size)
                    .attr("height", d => (typeof d.size === "function") ? d.size() : d.size)
                    .attr("x", d => {
                        let size = (typeof d.size === "function") ? d.size() : d.size;
                        return this.x.scale(d.x)-size/2.0;
                    })
                    .attr("y", d => {
                        let y = isNaN(d.y) ? 0 : d.y, 
                            size = (typeof d.size === "function") ? d.size() : d.size;
                        return (d.y2 ? this.y2.scale : this.y.scale)(d.y)-size/2.0;
                    })
                    .attr("transform", d => {
                        if(shape !== "diamond") return "";
                        let y = isNaN(d.y) ? 0 : d.y;
                        return `rotate(45,${this.x.scale(d.x)},${(d.y2 ? this.y2.scale : this.y.scale)(y)})`
                    })
                    .style("fill", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            default:
            case "circle":
                selc.style("opacity", fadeIn ? 0 : 1)
                    .attr("series", d => d.series)
                    .attr("class", "sg-point sg-point-cr")
                    .attr("r", d => (
                        0.5*(typeof d.size === "function" ? d.size(d, d._bind) : d.size)
                    ))
                    .attr("cx", d => this.x.scale(d.x))
                    .attr("cy", d => {
                        let y = isNaN(d.y) ? 0 : d.y;
                        return (d.y2 ? this.y2.scale : this.y.scale)(y);
                    })
                    .style("fill", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = this.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;
        }
        return selc;
    };

}