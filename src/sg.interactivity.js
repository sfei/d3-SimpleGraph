export default function(SimpleGraph, d3) {

    SimpleGraph.prototype.addTooltipToPoints = function(tooltipFunction, options) {
        this.svgGraph.selectAll(".sg-point")
            .call(this._constructTooltipFunctionality(tooltipFunction, options));
        return this;
    };

    SimpleGraph.prototype.addTooltipToLines = function(tooltipFunction, options) {
        this.svgGraph.selectAll(".sg-line, .sg-plotted-line")
            .call(this._constructTooltipFunctionality(tooltipFunction, options));
        return this;
    };

    SimpleGraph.prototype.addTooltipToAreas = function(tooltipFunction, options) {
        this.svgGraph.selectAll(".sg-plotted-area")
            .call(this._constructTooltipFunctionality(tooltipFunction, options));
        return this;
    };

    SimpleGraph.prototype._constructTooltipFunctionality = function(textFunction, options) {
        var svgNode = this.svg.node();

        return function(selection) {
            if(!selection) return null;
            if(!options) options = {};

            var d3Body = d3.select('body'), 
                tooltipDiv;

            selection.on("mouseover.sg-tooltip", function(evt, d) {
                // set relative position of tool-tip
                let absMousePos = d3.pointer(evt, d3Body.node()), 
                    tooltipOffset = options.offset || [10, -15], 
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
            })

            .on('mousemove.sg-tooltip', function(evt, d, i) {
                if(tooltipDiv) {
                    // Move tooltip
                    let absMousePos = d3.pointer(evt, d3Body.node()), 
                        tooltipOffset = (options.offset) ? options.offset : [10, -15];
                    tooltipDiv
                        .style('left', (absMousePos[0] + tooltipOffset[0])+'px')
                        .style('top', (absMousePos[1] + tooltipOffset[1])+'px');
                    let tooltipText = null;
                    if(textFunction) {
                        // TODO: selection is no longer array-like, hides it in _groups var
                        // this seems less than ideal, update/change when able
                        tooltipText = textFunction(d, d3.pointer(evt, svgNode), selection._groups[0], i);
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
                // Remove tooltip
                if(tooltipDiv) {
                    tooltipDiv.remove();
                    tooltipDiv = null;
                }
            });
        };
    };
    
}