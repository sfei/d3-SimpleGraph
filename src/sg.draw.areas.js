import shapes from "./sg.point.shapes";

export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.removeAreas = function() {
        this.svgGraph.selectAll(".sg-area").remove();
        return this;
    };

    SimpleGraph.prototype.drawAreas = function(resolution) {
        this.removeAreas();
        // default and enforced minimum resolution for resolving from function
        if(!resolution && resolution !== 0) resolution = 20;
        if(resolution == 0 || resolution < 2) resolution = 2;
        if(!this.areas) return this;

        var self = this;
        this.areas.forEach(area => {
            if(area.areaFunctions) {
                area._parts = this._getAreasPolysFromFunctions(
                    area.areaFunctions[0], 
                    area.areaFunctions[1], 
                    area.resolution, 
                    area.xRange, 
                    area.y2, 
                    !this.allowDrawBeyondGraph
                );
            } else if(this.allowDrawBeyondGraph) {
                area._parts = [area.coords];
            } else {
                area._parts = this._getAreaPolysFromCoordinates(area.coords, area.y2);
            }
            if(area._parts) area._parts = area._parts.filter(s => s && s.length >= 2);
        });
        this._drawAreas(resolution);

        return this;
    };

    SimpleGraph.prototype._drawAreas = function(resolution, transition) {
        if(!this.areas) return;
        var self = this, 
            addedAreas = this.svgGraph.selectAll(".sg-temporary-area")
                .data(this.areas)
              .enter().append("path")
                .attr("series", d => d.series)
                .attr("class", "sg-area")
                .attr("opacity", transition ? 0 : 1)
                .attr("d", d => {
                    let yAxis = d.y2 ? this.y2 : this.y, 
                        d3Area = d3.area()
                            .x(c => this.x.scale(c[0]))
                            .y0(c => yAxis.scale(c[1]))
                            .y1(c => yAxis.scale(c[2]))
                            .curve(d.interpolate);
                    return d._parts.reduce(
                        (path, area) => area.length < 2 ? path : path + " " + d3Area(area), 
                        ""
                    );
                })
                .each(function(d) {
                    // update styles
                    var nArea = d3.select(this), 
                        styles = d.style || {};
                    for(let key in styles) {
                        nArea.style(key, styles[key]);
                    }
                    // add color if not specified
                    if(!('fill' in styles)) {
                        let color = self.getColorBySeriesName(d.series, true);
                        nArea.style('fill', typeof color === "function" ? color(d) : color);
                    }
                    // attach
                    d._d3s = nArea;
                });
        // animate
        if(transition) {
            addedAreas.transition().duration(transition.duration).ease(transition.ease)
                .attr("opacity", 1.0);
        }
    };

    SimpleGraph.prototype._updateAreas = function(transition) {
        if(!this.areas) return;

        // remove, while also filter for new areas
        var areas = this.areas.filter(area => {
            if(!area._parts || !area._parts.length || area._parts.filter(c => c.length < 2).length) {
                if(segments._d3s) {
                    area._d3s.remove();
                    area._d3s = null;
                }
                return false;
            }
            return !area._d3s;
        });
        
        // modify existing areas, transition if necessary
        var sel = this.svgGraph.selectAll(".sg-area");
        if(transition) {
            sel = sel.transition().duration(transition.duration).ease(transition.ease);
        }
        var self = this;
        sel.attr("d", d => {
                let yAxis = d.y2 ? this.y2 : this.y, 
                    d3Area = d3.area()
                        .x(c => this.x.scale(c[0]))
                        .y0(c => yAxis.scale(c[1]))
                        .y1(c => yAxis.scale(c[2]))
                        .curve(d.interpolate);
                return d._parts.reduce(
                    (path, area) => area.length < 2 ? path : path + " " + d3Area(area), 
                    ""
                );
            })
            .each(function(d) {
                // update styles
                var nArea = d3.select(this), 
                    styles = d.style || {};
                for(let key in styles) {
                    nArea.style(key, styles[key]);
                }
                // add color if not specified
                if(!('fill' in styles)) {
                    let color = self.getColorBySeriesName(d.series, true);
                    nArea.style('fill', typeof color === "function" ? color(d) : color);
                }
            });

        // add new areas
        this._drawAreas(areas, transition);
    };

}