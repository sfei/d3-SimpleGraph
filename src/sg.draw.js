import shapes from "./sg.point.shapes";

export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.drawPoints = function() {
        this.removePoints();

        if(!this.points || this.points.length === 0) return this;

        // for 'this' references
        var self = this, 
            color = this.color;

        // if necessary, remove points that extend beyond graph
        var drawPointsData;
        if(this.allowDrawBeyondGraph) {
            drawPointsData = this.points;
        } else {
            drawPointsData = [];
            for(var i = 0; i < this.points.length; i++) {
                var yAxis = this.points[i].y2 ? this.y2 : this.y;
                var addPoint = this.points[i].x >= this.x.min;
                addPoint = addPoint && this.points[i].x <= this.x.max;
                addPoint = addPoint && this.points[i].y >= yAxis.min;
                addPoint = addPoint && this.points[i].y <= yAxis.max;
                if(this.x.break) {
                    addPoint = addPoint && (
                        this.points[i].x <= this.x.break.domain[0]
                        || this.points[i].x >= this.x.break.domain[0]
                    );
                }
                if(yAxis.break) {
                    addPoint = addPoint && (
                        this.points[i].y <= yAxis.break.domain[0]
                        || this.points[i].y >= yAxis.break.domain[0]
                    );
                }
                if(addPoint) { drawPointsData.push(this.points[i]); }
            }
        }
        if(!this.points.length) return this;

        var pointsDataBySeries = {};
        drawPointsData.forEach(d => {
            if(!(d.series in pointsDataBySeries)) {
                pointsDataBySeries[d.series] = [d];
            } else {
                pointsDataBySeries[d.series].push(d);
            }
        });

        for(let series in pointsDataBySeries) {
            let shape = this.ptSeriesShapes[series], 
                data = pointsDataBySeries[series];
            switch(shape) {
                case "triangle-down":
                    this._drawTriangleDown(shape, data);
                    break;
                case "triangle":
                case "triangle-up":
                    this._drawTriangleUp(shape, data);
                    break;
                case "circle":
                    this._drawCircle(shape, data);
                    break;
                case "square":
                case "diamond":
                default:
                    this._drawSquareDiamond(shape, data);
                    break;
            }
        }

        return this;
    };

    SimpleGraph.prototype._drawSquareDiamond = function(shape, data) {
        var self = this;
        this.svgGraph.selectAll(".sg-point.sg-point-sd")
            .data(data)
          .enter().append("rect")
            .attr("series", d => d.series)
            .attr("class", "sg-point sg-point-sd")
            .attr("width", d => (typeof d.size === "function") ? d.size() : d.size)
            .attr("height", d => (typeof d.size === "function") ? d.size() : d.size)
            .attr("x", d => {
                var size = (typeof d.size === "function") ? d.size() : d.size;
                return self.x.scale(d.x)-size/2.0;
            })
            .attr("y", d => {
                var size = (typeof d.size === "function") ? d.size() : d.size;
                return (d.y2 ? self.y2.scale : self.y.scale)(d.y)-size/2.0;
            })
            .attr("transform", d => (
                shape == "square" ? "" : `rotate(45,${self.x.scale(d.x)},${(d.y2 ? self.y2.scale : self.y.scale)(d.y)})`
            ))
            .style("fill", d => (
                d.wasNull ? "none" : self.getColorBySeriesName(d.series, true)
            ))
            .style("stroke", d => (
                !d.wasNull ? null : self.getColorBySeriesName(d.series, true)
            ));
    };

    SimpleGraph.prototype._drawCircle = function(shape, data) {
        var self = this;
        this.svgGraph.selectAll(".sg-point.sg-point-cr")
            .data(data)
          .enter().append("circle")
            .attr("series", d => d.series)
            .attr("class", "sg-point sg-point-cr")
            .attr("r", d => 0.5*((typeof d.size === "function") ? d.size() : d.size))
            .attr("cx", d => self.x.scale(d.x))
            .attr("cy", d => (d.y2 ? self.y2.scale : self.y.scale)(d.y))
            .style("fill", d => (
                d.wasNull ? "none" : self.getColorBySeriesName(d.series, true)
            ))
            .style("stroke", d => (
                !d.wasNull ? null : self.getColorBySeriesName(d.series, true)
            ));
    };

    SimpleGraph.prototype._drawTriangleUp = function(shape, data) {
        var self = this;
        this.svgGraph.selectAll(".sg-point.sg-point-tu")
            .data(data)
          .enter().append("polygon")
            .attr("series", d => d.series)
            .attr("class", "sg-point sg-point-tu")
            .attr("points", d => {
                let size = size = (typeof d.size === "function") ? d.size() : d.size, 
                    length = size*1.519676,   // side length of equilateral trangle of same area of square
                    height = length*0.86602,  // ratio of equilateral triangle
                    hh = 0.5*height, 
                    hl = 0.5*length, 
                    x = self.x.scale(d.x), 
                    y = (d.y2 ? self.y2.scale : self.y.scale)(d.y);
                return `${x-hl},${y-hh} ${x},${y+hh} ${x+hl},${y-hh}`;
            })
            .style("fill", d => (
                d.wasNull ? "none" : self.getColorBySeriesName(d.series, true)
            ))
            .style("stroke", d => (
                !d.wasNull ? null : self.getColorBySeriesName(d.series, true)
            ));
    };

    SimpleGraph.prototype._drawTriangleDown = function(shape, data) {
        var self = this;
        this.svgGraph.selectAll(".sg-point.sg-point-td")
            .data(data)
          .enter().append("polygon")
            .attr("series", d => d.series)
            .attr("class", "sg-point sg-point-td")
            .attr("points", d => {
                let size = size = (typeof d.size === "function") ? d.size() : d.size, 
                    length = size*1.519676,   // side length of equilateral trangle of same area of square
                    height = length*0.86602,  // ratio of equilateral triangle
                    hh = 0.5*height, 
                    hl = 0.5*length, 
                    x = self.x.scale(d.x), 
                    y = (d.y2 ? self.y2.scale : self.y.scale)(d.y);
                return `${x-hl},${y+hh} ${x},${y-hh} ${x+hl},${y+hh}`;
            })
            .style("fill", d => (
                d.wasNull ? "none" : self.getColorBySeriesName(d.series, true)
            ))
            .style("stroke", d => (
                !d.wasNull ? null : self.getColorBySeriesName(d.series, true)
            ));
    };

    SimpleGraph.prototype.drawLines = function() {
        this.removeLines();
        // for this references
        var self = this;
        var color = this.color;
        var svgGraph = this.svgGraph;
        
        // local function for adding lines to graph as it may be used multiple times per loop
        function addLine(lineData, lineCoords, className) {
            var yAxis = lineData.y2 ? self.y2 : self.y;
            if(lineCoords.length < 2) {
                return this;
            }
            var addedLine = svgGraph.selectAll(".sg-temporary-line")
                .data([lineCoords])
              .enter().append("path")
                .attr("series", lineData.series)
                .attr("class", className)
                .style("fill", 'none')
                .attr("d",
                    d3.line()
                        .x(function(c) { return self.x.scale(c[0]); })
                        .y(function(c) { return yAxis.scale(c[1]); })
                        .curve(lineData.interpolate)
                );
            // add styles
            var styles = lineData.style ? lineData.style : {};
            for(var skey in styles) {
                addedLine.style(skey, styles[skey]);
            }
            // add color if not specified
            if(!('stroke' in styles)) {
                addedLine.style('stroke', self.getColorBySeriesName(lineData.series, true));
            }
        }
        
        // lines interpolated from points
        if(this.pointLines) {
            for(var l = 0; l < this.pointLines.length; l++) {
                var line = this.pointLines[l];
                if(this.allowDrawBeyondGraph) {
                    addLine(line, line.coords, "sg-line");
                } else {
                    var lineSegments = this._getLineSegmentsFromCoordinates(line.coords, line.y2);
                    for(var s = 0; s < lineSegments.length; s++) {
                        addLine(line, lineSegments[s], "sg-line");
                    }
                }
            }
        }
        
        // lines added as lines
        if(this.lines) {
            for(var l = 0; l < this.lines.length; l++) {
                var line = this.lines[l];
                // lines added as functions
                if(line.lineFunction) {
                    var lineSegments = this._getLineSegmentsFromFunction(
                        line.lineFunction, 
                        line.resolution, 
                        line.xRange, 
                        line.y2Axis, 
                        !this.allowDrawBeyondGraph
                    );
                    for(var s = 0; s < lineSegments.length; s++) {
                        addLine(line, lineSegments[s], "sg-plotted-line");
                    }
                // lines added as coordinates
                } else {
                    if(this.allowDrawBeyondGraph) {
                        addLine(line.coords, "sg-plotted-line");
                    } else {
                        var lineSegments = this._getLineSegmentsFromCoordinates(line.coords, line.y2);
                        for(var s = 0; s < lineSegments.length; s++) {
                            addLine(line, lineSegments[s], "sg-plotted-line");
                        }
                    }
                }
            }
        }
        
        return this;
    };

    SimpleGraph.prototype.drawAreas = function() {
        this.removeAreas();
        // for this references
        var self = this;
        var color = this.color;
        
        // local function for adding areas to graph as it may be used multiple times per loop
        function addArea(areaData, areaCoords, className) {
            if(areaCoords.length < 2 || areaCoords[0].length < 2 || areaCoords[1].length < 2) {
                return this;
            }
            var yScale = areaData.y2 ? self.y2.scale : self.y.scale;
            var addedArea = self.svgGraph.selectAll(".sg-temporary-area")
                .data([areaCoords])
              .enter().append("path")
                .attr("series", areaData.series)
                .attr("class", className)
                .attr("d",
                    d3.area()
                        .x(function(c) { return self.x.scale(c[0]); })
                        .y0(function(c) { return yScale(c[1]); })
                        .y1(function(c) { return yScale(c[2]); })
                        .curve(areaData.interpolate)
                );
            var styles = areaData.style ? areaData.style : {};
            for(var skey in styles) {
                addedArea.style(skey, styles[skey]);
            }
            // add color if not specified
            if(!('fill' in styles)) {
                addedArea.style("fill", self.getColorBySeriesName(areaData.series, true));
            }
        }

        if(this.areas) {
            for(var a = 0; a < this.areas.length; a++) {
                var area = this.areas[a];
                // areas added as functions
                if(area.areaFunctions) {
                    var areaPolys = this._getAreasPolysFromFunctions(
                        area.areaFunctions[0], 
                        area.areaFunctions[1], 
                        area.resolution, 
                        area.xRange, 
                        area.y2, 
                        !this.allowDrawBeyondGraph
                    );
                    for(var p = 0; p < areaPolys.length; p++) {
                        addArea(area, areaPolys[p], "sg-plotted-area");
                    }
                // areas added as coordinates
                } else {
                    if(this.allowDrawBeyondGraph) {
                        addArea(area.coords, "sg-plotted-area");
                    } else {
                        var areaPolys = this._getAreaPolysFromCoordinates(area.coords, area.y2);
                        for(var p = 0; p < areaPolys.length; p++) {
                            addArea(area, areaPolys[p], "sg-plotted-area");
                        }
                    }
                }
            }
        }
        
        return this;
    };

    SimpleGraph.prototype.removePoints = function() {
        this.svgGraph.selectAll(".sg-dot, .sg-point").remove();
        return this;
    };

    SimpleGraph.prototype.removeLines = function() {
        this.svgGraph.selectAll(".sg-line, .sg-plotted-line").remove();
        return this;
    };

    SimpleGraph.prototype.removeAreas = function() {
        this.svgGraph.selectAll(".sg-plotted-area").remove();
        return this;
    };

    SimpleGraph.prototype.removeAll = function() {
        this.removePoints().removeLines().removeAreas();
        return this;
    };
    
}