import shapes from "./sg.point.shapes";

export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.removePoints = function() {
        this.svgGraph.selectAll(".sg-point").remove();
        return this;
    };

    SimpleGraph.prototype.drawPoints = function(showNulls, transition) {
        this.removePoints();

        if(!this.points || this.points.length === 0) return this;

        var self = this, 
            drawPointsData = this.points;
        // if necessary, remove points that extend beyond graph
        if(!this.allowDrawBeyondGraph) {
            drawPointsData = drawPointsData.filter(d => {
                if((!d.x && d.x !== 0) || Number.isNaN(d.x)) return false;
                if(d.x < self.x.min || d.x > self.x.max) return false;
                if(self.x.break && d.x > self.x.break.domain[0] && d.x < self.x.break.domain[1]) return false;
                if((!d.y && d.y !== 0) || Number.isNaN(d.y) && !showNulls) return false;
                let yAxis = d.y2 ? self.y2 : self.y;
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

    SimpleGraph.prototype.updatePoints = function(showNulls, transition) {
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
                if(d.x < self.x.min || d.x > self.x.max) return false;
                if(self.x.break && d.x > self.x.break.domain[0] && d.x < self.x.break.domain[1]) return false;
                if((!d.y && d.y !== 0) || Number.isNaN(d.y) && !showNulls) return false;
                let yAxis = d.y2 ? self.y2 : self.y;
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

            // update existing points
            this._updatePoints(selection, shape, transition);

            // add new points
            var newData = [...data];
            selection.forEach(d => {
                let exists = newData.indexOf(d);
                if(~exists) newData.splice(exists, 1);
            });
            this._drawPoints(
                this.svgGraph.selectAll(".sg-temporary-point").data(newData).enter(), 
                shape, 
                transition
            );
        }

        return this;
    };

    SimpleGraph.prototype._drawPoints = function(selection, shape, transition) {
        if(!selection.size()) return;
        var self = this, items;
        switch(shape) {
            case "triangle-down":
                items = selection.append("polygon")
                    .attr("series", d => d.series)
                    .style("opacity", transition ? 0 : 1)
                    .attr("class", "sg-point sg-point-td")
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size() : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = self.x.scale(d.x), 
                            y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? self.y2.scale : self.y.scale)(y);
                        return `${x-hl},${y+hh} ${x},${y-hh} ${x+hl},${y+hh}`;
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            case "triangle":
            case "triangle-up":
                items = selection.append("polygon")
                    .attr("series", d => d.series)
                    .style("opacity", transition ? 0 : 1)
                    .attr("class", "sg-point sg-point-tu")
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size(d, d._bind) : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = self.x.scale(d.x), 
                            y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? self.y2.scale : self.y.scale)(y);
                        return `${x-hl},${y-hh} ${x},${y+hh} ${x+hl},${y-hh}`;
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            case "square":
            case "diamond":
                items = selection.append("rect")
                    .attr("series", d => d.series)
                    .style("opacity", transition ? 0 : 1)
                    .attr("class", "sg-point sg-point-sd")
                    .attr("width", d => (typeof d.size === "function") ? d.size() : d.size)
                    .attr("height", d => (typeof d.size === "function") ? d.size() : d.size)
                    .attr("x", d => {
                        let size = (typeof d.size === "function") ? d.size() : d.size;
                        return self.x.scale(d.x)-size/2.0;
                    })
                    .attr("y", d => {
                        let y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y, 
                            size = (typeof d.size === "function") ? d.size() : d.size;
                        return (d.y2 ? self.y2.scale : self.y.scale)(d.y)-size/2.0;
                    })
                    .attr("transform", d => {
                        if(shape !== "diamond") return "";
                        let y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        return `rotate(45,${self.x.scale(d.x)},${(d.y2 ? self.y2.scale : self.y.scale)(y)})`
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            default:
            case "circle":
                items = selection.append("circle")
                    .style("opacity", transition ? 0 : 1)
                    .attr("series", d => d.series)
                    .attr("class", "sg-point sg-point-cr")
                    .attr("r", d => (
                        0.5*(typeof d.size === "function" ? d.size(d, d._bind) : d.size)
                    ))
                    .attr("cx", d => self.x.scale(d.x))
                    .attr("cy", d => {
                        let y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        return (d.y2 ? self.y2.scale : self.y.scale)(y);
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;
        }
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
            selection = selection.transition().duration(transition.duration).ease(transition.ease);
        }
        var self = this;
        switch(shape) {
            case "triangle-down":
                selection
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size(d, d._bind) : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = self.x.scale(d.x), 
                            y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? self.y2.scale : self.y.scale)(y);
                        return `${x-hl},${y+hh} ${x},${y-hh} ${x+hl},${y+hh}`;
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            case "triangle":
            case "triangle-up":
                selection
                    .attr("points", d => {
                        let size = size = typeof d.size === "function" ? d.size(d, d._bind) : d.size, 
                            length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length, 
                            x = self.x.scale(d.x), 
                            y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        y = (d.y2 ? self.y2.scale : self.y.scale)(y);
                        return `${x-hl},${y-hh} ${x},${y+hh} ${x+hl},${y-hh}`;
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            case "square":
            case "diamond":
                selection
                    .attr("width", d => typeof d.size === "function" ? d.size(d, d._bind) : d.size)
                    .attr("height", d => typeof d.size === "function" ? d.size(d, d._bind) : d.size)
                    .attr("x", d => {
                        let size = typeof d.size === "function" ? d.size(d, d._bind) : d.size;
                        return self.x.scale(d.x)-size/2.0;
                    })
                    .attr("y", d => {
                        let y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y, 
                            size = typeof d.size === "function" ? d.size(d, d._bind) : d.size;
                        return (d.y2 ? self.y2.scale : self.y.scale)(d.y)-size/2.0;
                    })
                    .attr("transform", d => {
                        if(shape !== "diamond") return "";
                        let y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        return `rotate(45,${self.x.scale(d.x)},${(d.y2 ? self.y2.scale : self.y.scale)(y)})`
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;

            default:
            case "circle":
                selection
                    .attr("r", d => (
                        0.5*(typeof d.size === "function" ? d.size(d, d._bind) : d.size)
                    ))
                    .attr("cx", d => self.x.scale(d.x))
                    .attr("cy", d => {
                        let y = (!d.y && d.y !== 0 ) || Number.isNaN(d.y) ? 0 : d.y;
                        return (d.y2 ? self.y2.scale : self.y.scale)(y);
                    })
                    .style("fill", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    })
                    .style("stroke", d => {
                        let color = self.getColorBySeriesName(d.series, true);
                        return typeof color === "function" ? color(d) : color;
                    });
                break;
        }
    };

}