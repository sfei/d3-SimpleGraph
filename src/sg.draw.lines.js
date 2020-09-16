import shapes from "./sg.point.shapes";

export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.removeAllLines = function() {
        return this.removeLines().removePointLines();
    };

    SimpleGraph.prototype.removeLines = function() {
        this.svgGraph.selectAll(".sg-line").remove();
        if(this.lines) this.lines.forEach(d => d._d3s = null);
        return this;
    };

    SimpleGraph.prototype.removePointLines = function() {
        this.svgGraph.selectAll(".sg-point-line").remove();
        if(this.pointLines) this.pointLines.forEach(d => d._d3s = null);
        return this;
    };

    SimpleGraph.prototype.drawAllLines = function(resolution) {
        return this.drawPointLines().drawLines(resolution);
    };

    SimpleGraph.prototype.drawLines = function(resolution) {
        this.removeLines();
        // default and enforced minimum resolution for resolving from function
        if(!resolution && resolution !== 0) resolution = 20;
        if(resolution == 0 || resolution < 2) resolution = 2;
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

    SimpleGraph.prototype.drawPointLines = function() {
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
        this._drawLines(this.pointLines, "sg-point-line");

        return this;
    };

    SimpleGraph.prototype.updateAllLines = function(resolution, transition) {
        return this.updateLines(resolution, transition).updatePointLines(transition);
    };

    SimpleGraph.prototype.updateLines = function(resolution, transition) {
        // defaults
        if(!resolution && resolution !== 0) resolution = 20;
        if(resolution == 0 || resolution < 2) resolution = 2;
        if(transition) {
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

    SimpleGraph.prototype.updatePointLines = function(transition) {
        // defaults
        if(transition) {
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
                .attr("opacity", transition ? 0 : 1)
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
                        nLine.style(key, styles[key]);
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
            addedLines.transition().duration(transition.duration).ease(transition.ease)
                .attr("opacity", 1.0);
        }
    };

    SimpleGraph.prototype._updateLines = function(lines, className, transition) {
        if(!lines) return this;

        // remove, while also filter for new lines
        lines = lines.filter(line => {
            if(!line._segments || !line._segments.length) {
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
                var yAxis = d.y2 ? self.y2 : self.y, 
                    d3line = d3.line()
                        .x(c => self.x.scale(c[0]))
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
        this._drawLines(lines, className, transition);
    };

}