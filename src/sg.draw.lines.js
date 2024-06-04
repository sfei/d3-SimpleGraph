import shapes from "./sg.point.shapes.js";

export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.removeAllLines = function(series) {
        return this.removeLines(series).removePointLines(series);
    };

    SimpleGraph.prototype.removeLines = function(series) {
        let removed;
        if(series === null || typeof series === "undefined") {
            removed = this.svgGraph.selectAll(".sg-line").remove();
        } else {
            removed = Array.isArray(series) ? series : [series];
            this.svgGraph.selectAll(".sg-line")
                .filter(d => ~series.indexOf(d.series))
                .remove();
        }
        removed.each(d => {
            d._segments = null;
            d._d3s = null;
        });
        return this;
    };

    SimpleGraph.prototype.removePointLines = function(series) {
        let removed;
        if(series === null || typeof series === "undefined") {
            removed = this.svgGraph.selectAll(".sg-point-line").remove();
        } else {
            removed = Array.isArray(series) ? series : [series];
            this.svgGraph.selectAll(".sg-point-line")
                .filter(d => ~series.indexOf(d.series))
                .remove();
        }
        removed.each(d => {
            d._segments = null;
            d._d3s = null;
        });
        return this;
    };

    SimpleGraph.prototype.drawAllLines = function(resolution, transition) {
        return this.drawPointLines().drawLines(resolution, transition);
    };

    SimpleGraph.prototype.drawLines = function(resolution, transition) {
        this.removeLines();
        // default and enforced minimum resolution for resolving from function
        if(!resolution && resolution !== 0) {
            resolution = 20;
        } else if(resolution <= 2) {
            resolution = 2;
        }
        if(!this.lines) return this;

        var self = this;
        this.lines.forEach(line => {
            if(line.lineFunction) {
                line._segments = self._getLineSegmentsFromFunction(
                    line.lineFunction, 
                    resolution, 
                    line.xRange, 
                    line.y2Axis, 
                    !self.allowDrawBeyondGraph
                );
            } else if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        this._drawLines(this.lines, "sg-line");

        return this;
    };

    SimpleGraph.prototype.drawPointLines = function(transition) {
        this.removePointLines();
        if(!this.pointLines) return this;

        var self = this;
        this.pointLines.forEach(line => {
            if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        this._drawLines(this.pointLines, "sg-point-line", transition);

        return this;
    };

    SimpleGraph.prototype.drawUpdateAllLines = function(resolution, transition) {
        return this.drawUpdateLines(resolution, transition).drawUpdatePointLines(transition);
    };

    SimpleGraph.prototype.drawUpdateLines = function(resolution, transition) {
        // defaults
        if(!resolution && resolution !== 0) {
            resolution = 20;
        } else if(resolution <= 2) {
            resolution = 2;
        }
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
        }

        var self = this;
        this.lines.forEach(line => {
            if(line.lineFunction) {
                line._segments = self._getLineSegmentsFromFunction(
                    line.lineFunction, 
                    resolution, 
                    line.xRange, 
                    line.y2Axis, 
                    !self.allowDrawBeyondGraph
                );
            } else if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        self._updateLines(this.lines, "sg-line", transition);

        return this;
    };

    SimpleGraph.prototype.drawUpdatePointLines = function(transition) {
        // defaults
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
        }

        var self = this;
        this.pointLines.forEach(line => {
            if(self.allowDrawBeyondGraph) {
                line._segments = [line.coords];
            } else {
                line._segments = self._getLineSegmentsFromCoordinates(line.coords, line.y2);
            }
            if(line._segments) line._segments = line._segments.filter(s => s && s.length >= 2);
        });
        self._updateLines(this.pointLines, "sg-point-line", transition);

        return this;
    };

    SimpleGraph.prototype._drawLines = function(lines, className, transition) {
        var self = this, 
            addedLines = this.svgGraph.selectAll(".sg-temporary-line")
                .data(lines)
              .enter().append("path")
                .attr("series", d => d.series)
                .attr("class", className)
                .style("opacity", transition ? 0 : 1)
                .style("fill", 'none')
                .attr("d", d => {
                    let yAxis = d.y2 ? this.y2 : this.y, 
                        d3line = d3.line()
                            .x(c => this.x.scale(c[0]))
                            .y(c => yAxis.scale(c[1]))
                            .curve(d.interpolate);
                    return d._segments.reduce(
                        (path, segment) => (path || "") + (segment.length < 2 ? "" : " " + d3line(segment)), 
                        ""
                    );
                })
                .each(function(d) {
                    // add styles
                    let nLine = d3.select(this), 
                        styles = d.style || {};
                    for(let key in styles) {
                        if(!transition || (key && key.toLowerCase() != "opacity")) {
                            nLine.style(key, styles[key]);
                        }
                    }
                    // add color if not specified
                    if(!('stroke' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        nLine.style('stroke', typeof color === "function" ? color(d) : color);
                    }
                    // attach
                    d._d3s = nLine;
                });
        // animate
        if(transition) {
            if(Object.getPrototypeOf(transition) !== Object.prototype) {
                transition = {};
            }
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            addedLines.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

    SimpleGraph.prototype._updateLines = function(lines, className, transition) {
        if(!lines) return this;

        // remove, while also filter for new lines
        var newLines = lines.filter(line => {
            if(!line._segments || !line._segments.length || line._segments.filter(c => c.length < 2).length) {
                if(segments._d3s) {
                    line._d3s.remove();
                    line._d3s = null;
                }
                return false;
            }
            return !line._d3s;
        });
        
        // modify existing lines, transition if necessary
        var sel = this.svgGraph.selectAll("."+className);
        if(transition) {
            sel = sel.transition().duration(transition.duration).ease(transition.ease);
        }
        var self = this;
        sel.attr("d", d => {
                var yAxis = d.y2 ? this.y2 : this.y, 
                    d3line = d3.line()
                        .x(c => this.x.scale(c[0]))
                        .y(c => yAxis.scale(c[1]))
                        .curve(d.interpolate);
                return d._segments.reduce(
                    (path, segment) => (path || "") + (segment.length < 2 ? "" : " " + d3line(segment)), 
                    ""
                )
            })
            .each(function(d) {
                // update styles
                var nLine = d3.select(this), 
                    styles = d.style || {};
                for(var key in styles) {
                    nLine.style(key, styles[key]);
                }
                // add color if not specified
                if(!('stroke' in styles)) {
                    let color = self.getColorBySeriesName(d.series, true);
                    nLine.style('stroke', typeof color === "function" ? color(d) : color);
                }
            });

        // add new lines
        var addedLines = this.svgGraph.selectAll(".sg-temporary-line")
                .data(newLines)
              .enter().append("path")
                .attr("series", d => d.series)
                .attr("class", className)
                .style("opacity", transition ? 0 : 1)
                .style("fill", 'none')
                .attr("d", d => {
                    var yAxis = d.y2 ? self.y2 : self.y, 
                        d3line = d3.line()
                            .x(c => self.x.scale(c[0]))
                            .y(c => yAxis.scale(c[1]))
                            .curve(d.interpolate);
                    return d._segments.reduce(
                        (path, segment) => (path || "") + (segment.length < 2 ? "" : " " + d3line(segment)), 
                        ""
                    );
                })
                .each(function(d) {
                    // add styles
                    var nLine = d3.select(this), 
                        styles = d.style || {};
                    for(var key in styles) {
                        if(!transition || (key && key.toLowerCase() != "opacity")) {
                            nLine.style(key, styles[key]);
                        }
                    }
                    // add color if not specified
                    if(!('stroke' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        nLine.style('stroke', typeof color === "function" ? color(d) : color);
                    }
                    // attach
                    d._d3s = nLine;
                });
        // animate
        if(transition) {
            transition.duration = transition.duration || 200;
            transition.ease = transition.ease || d3.easePolyOut;
            addedLines.transition().duration(transition.duration).ease(transition.ease)
                .style("opacity", d => {
                    return d.style && ('opacity' in d.style) ? d.style.opacity : 1;
                });
        }
    };

}