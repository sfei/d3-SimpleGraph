/*************************************************************************************************************
 * D3-Simple-Graph
 * @author Lawrence Sim
 * @copyright 2020 - San Francisco Estuary Institute
 * @license This project is licensed under the GNU Lesser General Public License.
 ************************************************************************************************************/
import * as d3 from 'd3';

/**
 * Create a SimpleGraph instance and draw an empty graph.
 * @param {Object} [options] - Object literal of options (all optional).
 * @param {string} [options.container='body'] - The DOM element query/selector to the element to append the 
 *        graph to.
 * @param {number} [options.width=600] - Width value.
 * @param {number} [options.height=600] - Height value).
 * @param {Object} [options.margins={top:20,right:20,bottom:40,left:40}] - Margins for graph within 
 *        overarching SVG (e.g. with all default values, the width of the actual graph will be 540px in a 
 *        600px wide SVG element).
 * @param {d3.scale} [options.colorScale=d3.scaleOrdinal(d3.schemeCategory10)] - Optional color scale to use 
 *        with data. If data series will have non-numeric identifiers, it should be a categorical or ordinal 
 *        scale.
 * @param {boolean} [allowDrawBeyondGraph=false] - Allow drawing beyond graph. If true, all data will be drawn 
 *        as supplied. If false, points beyond the x/y-axis range will not be drawn and lines/areas will be 
 *        cut off where they extend past the x/y-axis ranges.
 * @param {Object} [options.axis] - Optional dictionary of axis options. See resetAxisOptions() for details.
 * @param {Object} [options.styles] - Optional styles applied to SVG element.
 * @constructor
 */
function SimpleGraph(options) {
    // default options
    if(!options)             { options = {}; }
    if(!options.container)   { options.container = "body"; }
    if(!options.margins)     { options.margins = {}; }
    if(!options.axis)        { options.axis = {}; }
    if(!options.styles)      { options.styles = {}; }
    if(!options.styles["font-size"]) { options.styles["font-size"] = "1.0em"; }
    
    // Option to allow drawing outside graph range.
    this.allowDrawBeyondGraph = options.allowDrawBeyondGraph;

    // adjust width and height by margins
    this.margins = {
        left: (!options.margins.left && options.margins.left !== 0) ? 40 : options.margins.left, 
        right: (!options.margins.right && options.margins.right !== 0) ? 20 : options.margins.right, 
        top: (!options.margins.top && options.margins.top !== 0) ? 20 : options.margins.top, 
        bottom: (!options.margins.bottom && options.margins.bottom !== 0) ? 40 : options.margins.bottom
    };
    this.containerWidth = ((options.width) ?  options.width : 600);
    this.containerHeight = ((options.height) ?  options.height : 400);
    this.width = this.containerWidth - this.margins.left - this.margins.right;
    this.height = this.containerHeight - this.margins.top - this.margins.bottom;
    
    // category color scale
    this.color = (options.colorScale) ? options.colorScale : d3.scaleOrdinal(d3.schemeCategory10);
    this.customColors = {};
    
    // create the SVG
    this.svg = d3.select(options.container).append("svg")
        .attr("width", this.containerWidth)
        .attr("height", this.containerHeight)
        .style('font-family', "'Century Gothic', CenturyGothic, Geneva, AppleGothic, sans-serif")
        .style('overflow', 'visible');
    this.svgGraph = this.svg.append("g")
        .attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");
    
    // append styles, save to instance the default text-size
    for(var style in options.styles) {
        this.svg.style(style, options.styles[style]);
    }
    
    this.resetAxisOptions(options.axis);
    
    return this;
};

//************************************************************************************************************
// Basic Functions
//************************************************************************************************************
/**
 * Get the SVG element
 * @returns {object} the D3 SVG element
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.getSvgElement = function() {    
    return this.svg;
};

/**
 * Get the SVG 'g' (graphic) element
 * @returns {object} the D3 SVG element
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.getSvgGraphic = function() {    
    return this.svgGraph;
};

/**
 * Remove the SVG graph from its container, but preserve the object.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.remove = function() {
    this.svg.remove();
    return this;
};

/**
 * Remove and destroy this object.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.destroy = function() {
    this.svg.remove();
    this.svg = null;
    this.svgGraph = null;
    this.clearAllData();
    this.color = null;
    this.customColors = null;
    this.x = null;
    this.y = null;
    this.minMax = null;
    this.xScale = null;
    this.yScale = null;
    this.yAxis = null;
    this.xAxis = null;
    this.yGridAxis = null;
    this.xGridAxis = null;
};

//************************************************************************************************************
// Add modules
//************************************************************************************************************
// Axis functions
import sgAxis from "./sg.axis";
sgAxis(SimpleGraph, d3);
// Color/category functions
import sgColor from "./sg.color";
sgColor(SimpleGraph, d3);
// Grid and legend
import sgGridLegend from "./sg.grid.legend";
sgGridLegend(SimpleGraph, d3);
// Data functions
import sgDataPoint from "./sg.data.point";
import sgDataArea from "./sg.data.area";
import sgDataLine from "./sg.data.line";
sgDataPoint(SimpleGraph, d3);
sgDataArea(SimpleGraph, d3);
sgDataLine(SimpleGraph, d3);
// Draw functions
import sgDrawLib from "./sg.draw.lib";
import sgDraw from "./sg.draw";
sgDrawLib(SimpleGraph, d3);
sgDraw(SimpleGraph, d3);
// Tooltip functions
import sgTooltip from "./sg.tooltip";
sgTooltip(SimpleGraph, d3);

//************************************************************************************************************
// Misc Functions
//************************************************************************************************************
/**
 * Clear all data.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.clearAllData = function() {
    this.clearPointsData();
    this.clearLinesData();
    this.clearAreasData();
    return this;
};

// Highlight functions (Currently only implemented for points)
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

/**
 * Save graph as a PNG. Note, in IE, canvg library is required due to security error. This library is not 
 * packaged with SimpleGraph and simply assumed loaded into global space. If canvg object is not found, 
 * function will simply error on IE.
 * @param {string} [pngName] - Default name to save png.
 * @memberof SimpleGraph 
 */
SimpleGraph.prototype.saveAsPng = function(pngName) {
    if(!pngName) { pngName = "graph.png"; }
    if(!pngName.toLowerCase().endsWith(".png")) { pngName += ".png"; }
    
    var svgNode = this.svg
        .attr("version", "1.1")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .node();
    var serializer = new XMLSerializer();
    var svgHtml = serializer.serializeToString(svgNode);
    
    var canvas = document.createElement("canvas");
    canvas.style.display = "none";
    canvas.width = this.containerWidth;
    canvas.height = this.containerHeight;
    
    // because internet explorer, this is only way around the security error (requires canvg library which is 
    // not explicitly required, assumed loaded somewhere on the page globally)
    if(navigator.msSaveBlob && canvg) {
        // have to manually replace the width/height in cases of bottom-buffer IE hack for resizable graphs
        svgHtml = svgHtml.replace("style=\"width: 100%; height: 1px;", "style=\"width:" + this.containerWidth + "px; height:" + this.containerHeight + "px;");
        // draw via canvg, which is totally redudant if not for the fact this is only way to bypass security error
        canvg(canvas, svgHtml);
        navigator.msSaveBlob(
            new Blob([canvas.msToBlob()], {type:"image/png"}), 
            pngName
        );
        return this;
    }
    
    var a = document.createElement("a");
    a.style.display = "none";
    a.download = pngName;
    this.svg.node().parentNode.appendChild(a);
    
    var img = new Image();
    img.onload = function() {
        canvas.getContext("2d").drawImage(img, 0, 0);
        // freaking internet explorer..
        if(navigator.msSaveBlob) {
            try {
                navigator.msSaveBlob(
                    new Blob([canvas.msToBlob()], {type:"image/png"}), 
                    pngName
                );
            } catch(e) {
                // still doesn't work because of overly strict security restrictions in IE
                alert("Sorry, SVG to PNG downloads are restricted in Internet Explorer, please try with another browser.");
            }
        } else {
            a.href = canvas.toDataURL("image/png");
            a.click();
        }
        a.parentElement.removeChild(a);
        canvas.remove();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgHtml)));
};

export default SimpleGraph;