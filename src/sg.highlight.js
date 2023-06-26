export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.removeHighlights = function() {
        return this.removeHighlightPoints()
                   .removeHighlightLines()
                   .removeHighlightAreas();
    };

    SimpleGraph.prototype.removeHighlightPoints = function() {
        this.svgGraph.selectAll(".sg-point-highlight").remove();
        this.svgGraph.selectAll(".sg-point.sg-highlight-hide")
                     .style("opacity", "")
                     .classed("sg-highlight-hide", false);
        return this;
    };

    SimpleGraph.prototype.removeHighlightLines = function() {
        this.svgGraph.selectAll(".sg-line-highlight").remove();
        this.svgGraph.selectAll(".sg-line.sg-highlight-hide")
                     .style("opacity", "")
                     .classed("sg-highlight-hide", false);
        return this;
    };

    SimpleGraph.prototype.removeHighlightAreas = function() {
        this.svgGraph.selectAll(".sg-area-highlight").remove();
        this.svgGraph.selectAll(".sg-area.sg-highlight-hide")
                     .style("opacity", "")
                     .classed("sg-highlight-hide", false);
        return this;
    };

    SimpleGraph.prototype._addBlurDefn = function() {
        if(!this.svgDefs.select("#sg-effect-blur").empty()) return;
        this.svgDefs
          .append("filter")
            .attr("id", "sg-effect-blur")
          .append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", 6);
    };

    SimpleGraph.prototype.highlightPoints = function(options) {
        options = options || {};
        if(options.series) {
            options.series = Array.isArray(options.series) ? options.series : [options.series];
        }
        this.svgGraph.selectAll(".sg-point").each((d, i, s) => {
            if(options.series && !~options.series.indexOf(d.series)) return;
            if(options.filter && !options.filter(this._clonePointData(d), s[i])) return;
            let highlight = d3.select(s[i].cloneNode(true)).attr("class", "sg-point-highlight"), 
                xScale    = this.x.scale, 
                yScale    = d.y2 ? this.y2.scale : this.y.scale, 
                x         = xScale(d.x), 
                y         = yScale(isNaN(d.y) ? 0 : d.y), 
                size      = options.size || d.size;
            if(typeof size === "function") size = size.call(d);
            switch(this.ptSeriesShapes[d.series]) {
                case "triangle":
                case "triangle-up":
                    size *= 2.0;
                    highlight.attr("points", d => {
                        let length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length;
                        return `${x-hl},${y-hh} ${x},${y+hh} ${x+hl},${y-hh}`;
                    });
                    break;
                case "triangle-down":
                    size *= 2.0;
                    highlight.attr("points", d => {
                        let length = size*1.519676,   // side length of equilateral trangle of same area of square
                            height = length*0.86602,  // ratio of equilateral triangle
                            hh = 0.5*height, 
                            hl = 0.5*length;
                        return `${x-hl},${y+hh} ${x},${y-hh} ${x+hl},${y+hh}`;
                    });
                    break;
                case "square":
                case "diamond":
                    highlight
                        .attr("width", size)
                        .attr("height", size)
                        .attr("x", x-size/2.0)
                        .attr("y", y-size/2.0);
                    break;
                default:
                case "circle":
                    highlight.attr("r", size);
                    break;
            }
            if(options.style) {
                for(let sk in options.style) {
                    highlight.style(sk, options.style[sk]);
                }
            }
            this.svgGraph.node().append(highlight.node());
            d3.select(s[i]).classed("sg-highlight-hide", true)
                .style("opacity", "0");
        });
        return this;
    };

    SimpleGraph.prototype.highlightLines = function(options) {
        options = options || {};
        if(options.series) {
            options.series = Array.isArray(options.series) ? options.series : [options.series];
        }
        this._addBlurDefn();
        this.svgGraph.selectAll(".sg-line").each((d, i, s) => {
            if(options.series && !~options.series.indexOf(d.series)) return;
            if(options.filter && !options.filter(this._cloneLineData(d), s[i])) return;
            let front = d3.select(s[i].cloneNode(true)).attr("class", "sg-point-highlight"), 
                behind = null;
            if(!options.noblur) {
                behind = d3.select(s[i].cloneNode(true))
                    .attr("class", "sg-line-highlight")
                    .attr("filter", "url('#sg-effect-blur')")
                    .style("fill", 'none')
                    .style("filter", 'brightness(135%)')
                    .style("opacity", "0.7");
                if(options.noblur && options.blurstyle) {
                    for(let sk in options.blurstyle) {
                        behind.style(sk, options.blurstyle[sk]);
                    }
                }
                this.svgGraph.node().append(behind.node());
            }
            if(options.style) {
                for(let sk in options.style) {
                    front.style(sk, options.style[sk]);
                }
            }
            this.svgGraph.node().append(front.node());
            d3.select(s[i]).classed("sg-highlight-hide", true)
                .style("opacity", "0");
        });
        return this;
    };

    SimpleGraph.prototype.highlightAreas = function(options) {
        options = options || {};
        if(options.series) {
            options.series = Array.isArray(options.series) ? options.series : [options.series];
        }
        this.svgGraph.selectAll(".sg-area").each((d, i, s) => {
            if(options.series && !~options.series.indexOf(d.series)) return;
            if(options.filter && !options.filter(this._cloneAreaData(d), s[i])) return;
            let highlight = d3.select(s[i].cloneNode(true))
                .attr("class", "sg-point-highlight")
                .style("opacity", "1");
            if(!options.nooutline) {
                highlight.style("stroke", "#000");
                highlight.style("stroke-width", "1.5")
            }
            if(options.style) {
                for(let sk in options.style) {
                    highlight.style(sk, options.style[sk]);
                }
            }
            this.svgGraph.node().append(highlight.node());
            d3.select(s[i]).classed("sg-highlight-hide", true)
                .style("opacity", "0");
        });
        return this;
    };

}