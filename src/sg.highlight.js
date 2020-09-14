export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.highlightPoints = function(series, validationCallback, size, fill, stylesDict) {
        var selectQuery = ".sg-point";
        if(series) { selectQuery += "[series='" + series + "']"; }
        var self = this;
        this.svgGraph.selectAll(selectQuery).each(function(d, i, s) {
            if(validationCallback && !validationCallback(d)) return;
            var xScale = self.x.scale, 
                yScale = d.y2 ? self.y2.scale : self.y.scale;
            if(!size) {
                size = d.wasNull ? 0 : (typeof d.pointsize === "function" ? d.pointsize() : d.pointsize);
            };
            if(!fill) {
                fill = d.wasNull ? "none" : self.getColorBySeriesName(d.series, true);
            };
            var realSize = size ? size : d.pointsize;
            if(typeof realSize === "function") {
                realSize = realSize.call(d);
            }
            var rect = self.svgGraph.append("rect")
                .attr("class", "sg-point-highlight")
                .attr("width", realSize)
                .attr("height", realSize)
                .attr("x", xScale(d.x)-realSize/2.0)
                .attr("y", yScale(d.y)-realSize/2.0)
                .attr("transform", "rotate(45," + xScale(d.x) + "," + yScale(d.y) + ")")
                .style("fill", fill);
            if(stylesDict) {
                for(var sKey in stylesDict) {
                    rect.style(sKey, stylesDict[sKey]);
                }
            }
        });
        return this;
    };

    SimpleGraph.prototype.removeHighlightPoints = function() {
        this.svgGraph.selectAll(".sg-point-highlight").remove();
        return this;
    };

    SimpleGraph.prototype.removeHighlights = function() {
        this.removeHighlightPoints();
        return this;
    };

}