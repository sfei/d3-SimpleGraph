export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.addTooltipToPoints = function(textFunction, forSeries, options) {
        forSeries = forSeries && !Array.isArray(forSeries) ? [forSeries] : forSeries;
        this.svgGraph.selectAll(".sg-point")
            .filter(d => !forSeries || ~forSeries.indexOf(d.series))
            .call(this._constructTooltipFunctionality(textFunction, options));
        return this;
    };

    SimpleGraph.prototype.addTooltipToLines = function(textFunction, forSeries, options) {
        forSeries = forSeries && !Array.isArray(forSeries) ? [forSeries] : forSeries;
        this.svgGraph.selectAll(".sg-line")
            .filter(d => !forSeries || ~forSeries.indexOf(d.series))
            .call(this._constructTooltipFunctionality(textFunction, options));
        return this;
    };

    SimpleGraph.prototype.addTooltipToAreas = function(textFunction, forSeries, options) {
        forSeries = forSeries && !Array.isArray(forSeries) ? [forSeries] : forSeries;
        this.svgGraph.selectAll(".sg-area")
            .filter(d => !forSeries || ~forSeries.indexOf(d.series))
            .call(this._constructTooltipFunctionality(textFunction, options));
        return this;
    };

    SimpleGraph.prototype._constructTooltipFunctionality = function(textFunction, options) {
        var gNode = this.svgGraph.node();

        return function(selection) {
            if(!selection) return null;
            if(!options) options = {};

            var d3Body = d3.select('body'), 
                tooltipOffset = options.offset || [15, 15], 
                // TODO: selection is no longer array-like, hides it in _groups var
                // this seems less than ideal, update/change when able
                selGroup = selection._groups[0], 
                tooltipDiv;

            selection.on("mouseover.sg-tooltip", function(evt, d) {
                // set relative position of tool-tip
                let absMousePos = d3.pointer(evt, d3Body.node()), 
                    styles;
                // Check if tooltip div already exists
                if(!tooltipDiv) {
                    // Clean up lost tooltips
                    d3Body.selectAll('.sg-tooltip').remove();
                    // Append tooltip 
                    tooltipDiv = d3Body.append('div');
                    tooltipDiv.attr('class', 'sg-tooltip');
                    // full styles
                    styles = {
                        'position': 'absolute', 
                        'left': (absMousePos[0] + tooltipOffset[0])+'px', 
                        'top': (absMousePos[1] + tooltipOffset[1])+'px', 
                        'z-index': 1001, 
                        'background-color': '#fff', 
                        'border': '1px solid #777', 
                        'border-radius': '4px', 
                        'padding': '4px 6px', 
                        'font-family': "'Century Gothic', CenturyGothic, Geneva, AppleGothic, sans-serif", 
                        'font-size': '12px'
                    };
                } else {
                    // just update position
                    styles = {
                        'left': (absMousePos[0] + tooltipOffset[0])+'px', 
                        'top': (absMousePos[1] + tooltipOffset[1])+'px'
                    };
                }
                for(let styleKey in styles) {
                    tooltipDiv.style(styleKey, styles[styleKey]);
                }
                // add custom styles if provided
                if(options.style) {
                    for(let styleKey in options.style) {
                        tooltipDiv.style(styleKey, options.style[styleKey]);
                    }
                }
                // additional trigger
                if(options.mouseover) options.mouseover(d, d3.pointer(evt, gNode), selGroup, i);
            })

            .on('mousemove.sg-tooltip', function(evt, d, i) {
                if(tooltipDiv) {
                    // Move tooltip
                    let absMousePos = d3.pointer(evt, d3Body.node());
                    tooltipDiv
                        .style('left', (absMousePos[0] + tooltipOffset[0])+'px')
                        .style('top', (absMousePos[1] + tooltipOffset[1])+'px');
                    let tooltipText = null;
                    if(textFunction) {
                        tooltipText = textFunction(d, d3.pointer(evt, gNode), selGroup, i);
                    }
                    // If no text, remove tooltip
                    if(!tooltipText) {
                        tooltipDiv.remove();
                        tooltipDiv = null;
                    } else {
                        tooltipDiv.html(tooltipText);
                    }
                }
            })

            .on("mouseout.sg-tooltip", function(evt, d) {
                // additional trigger
                if(options.mouseout) options.mouseout(d, d3.pointer(evt, gNode), selGroup, i);
                // Remove tooltip
                if(tooltipDiv) {
                    tooltipDiv.remove();
                    tooltipDiv = null;
                }
            });
        };
    };

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