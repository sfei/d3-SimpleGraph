import shapes from "./sg.point.shapes";

export default function(SimpleGraph, d3) {

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
                )
                .each(function(d) {
                    var styles = d.style ? d.style : {};
                    for(let sey in styles) {
                        addedArea.style(key, styles[key]);
                    }
                    // add color if not specified
                    if(!('fill' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        addedArea.style('fill', typeof color === "function" ? color(d) : color);
                    }
                });
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
                        addArea(area, areaPolys[p], "sg-area");
                    }
                // areas added as coordinates
                } else {
                    if(this.allowDrawBeyondGraph) {
                        addArea(area.coords, "sg-area");
                    } else {
                        var areaPolys = this._getAreaPolysFromCoordinates(area.coords, area.y2);
                        for(var p = 0; p < areaPolys.length; p++) {
                            addArea(area, areaPolys[p], "sg-area");
                        }
                    }
                }
            }
        }
        
        return this;
    };

    SimpleGraph.prototype.removeAreas = function() {
        this.svgGraph.selectAll(".sg-area").remove();
        return this;
    };

}