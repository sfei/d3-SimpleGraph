/*************************************************************************************************************
 * D3-Simple-Graph
 * @version v3.0.0
 * @author Lawrence Sim
 * @copyright 2022 - San Francisco Estuary Institute
 * @license This project is licensed under the GNU Lesser General Public License.
 ************************************************************************************************************/
import * as d3 from 'd3';

function SimpleGraph(options) {
    // default options
    if(!options)             { options = {}; }
    if(!options.container)   { options.container = "body"; }
    if(!options.margins)     { options.margins = {}; }
    if(!options.axis)        { options.axis = {}; }
    if(!options.styles)      { options.styles = {}; }
    
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
SimpleGraph.prototype.getSvgElement = function() {
    return this.svg;
};

SimpleGraph.prototype.getSvgGraphic = function() {
    return this.svgGraph;
};

SimpleGraph.prototype.remove = function() {
    this.svg.remove();
    return this;
};

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
    this.points = null;
    this.ptSeriesShapes = null;
    this.lines = null;
    this.pointLines = null;
    this.areas = null;
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
import sgDrawPoints from "./sg.draw.points";
import sgDrawLines from "./sg.draw.lines";
import sgDrawAreas from "./sg.draw.areas";
sgDrawLib(SimpleGraph, d3);
sgDrawPoints(SimpleGraph, d3);
sgDrawLines(SimpleGraph, d3);
sgDrawAreas(SimpleGraph, d3);
// Interactivity functions
import sgTooltip from "./sg.tooltip";
import sgHighlight from "./sg.highlight";
sgTooltip(SimpleGraph, d3);
sgHighlight(SimpleGraph, d3);

//************************************************************************************************************
// Misc Functions
//************************************************************************************************************
SimpleGraph.prototype.clearAllData = function(series) {
    this.clearPointsData(series);
    this.clearLinesData(series);
    this.clearAreasData(series);
    return this;
};

SimpleGraph.prototype.removeAll = function() {
    this.removePoints().removeAllLines().removeAreas();
    return this;
};

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