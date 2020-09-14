export default function(SimpleGraph, d3) {
    /**
     * Add tooltip function to the points on the graph. Does not add tooltips to the lines connecting points, if 
     * they were added. That is handled by addTooltipToLines(). You can check the series name in the callback's 
     * returned SVG element or the class to determine type, regular lines are ".sg-plotted-line" and lines drawn 
     * from connecting points are ".sg-line".
     * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
     *        the tooltip.
     * @param {Object} [options] - Optional parameters.
     * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places
     *        the tooltip to the bottom right of the cursor).
     * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
     *        div's CSS style (optional).
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addTooltipToPoints = function(tooltipFunction, options) {
        this.svgGraph.selectAll(".sg-point")
            .call(this._constructTooltipFunctionality(tooltipFunction, options));
        return this;
    };

    /**
     * Add tooltip function to the lines on the graph.
     * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
     *        the tooltip.
     * @param {Object} [options] - Optional parameters.
     * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
     *        the tooltip to the bottom right of the cursor).
     * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
     *        div's CSS style (optional).
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addTooltipToLines = function(tooltipFunction, options) {
        this.svgGraph.selectAll(".sg-line, .sg-plotted-line")
            .call(this._constructTooltipFunctionality(tooltipFunction, options));
        return this;
    };

    /**
     * Add tooltip function to the areas on the graph.
     * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
     *        the tooltip.
     * @param {Object} [options] - Optional parameters.
     * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
     *        the tooltip to the bottom right of the cursor).
     * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
     *        div's CSS style (optional).
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.addTooltipToAreas = function(tooltipFunction, options) {
        this.svgGraph.selectAll(".sg-plotted-area")
            .call(this._constructTooltipFunctionality(tooltipFunction, options));
        return this;
    };

    /**
     * Tooltip functionality for SVG objects (modified from <http://bl.ocks.org/rveciana/5181105>). Should not be
     * called explicitly, it is added to D3 SVG elements via call(). Use the 
     * addTooltipTo[Points|Lines|Areas]() functions instead.
     * @param {tooltipTextFunction} textFunction - Callback function that handles the dynamic text appearing in 
     *        the tooltip.
     * @param {Object} [options] - Optional parameters.
     * @param {number[]} [options.offset=[10,-15]] - The x,y offset of the tooltip from the cursor (default places 
     *        the tooltip to the bottom right of the cursor).
     * @param {Object} [options.style] - Object literal of key-value pairs that will be applied as the tooltip 
     *        div's CSS style (optional).
     * @memberof SimpleGraph 
     */
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


    /**
     * Handles the text appearing in the tooltip. Several parameters are provided to pull relevant data from.
     * @callback tooltipTextFunction
     * @param {Object} d - The data object bound to the hovered SVG element. For points, keys included are 
     *        'series', 'x', 'y', and any additional data keys specified. For lines and areas, only the raw 
     *         coordinates are  stored.
     * @param {number[]} p - The x,y relative mouse position on the parent SVG.
     * @param {Object[]} s - Array of the SVG elements in the layer selected(or null).
     * @param {number} i - Index of selected element in array above such that s[i] gives the specific SVG element.
     */
}