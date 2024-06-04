 import shapes from "./sg.point.shapes.js";

 export default function(SimpleGraph) {

    SimpleGraph.prototype.drawGrid = function(style) {
        this.svgGraph.selectAll(".sg-grid").remove();
        // default styles
        let opacity = (style && style.opacity) ? parseFloat(style.opacity) : 0.4, 
            stroke = (style && style.stroke) ? style.stroke : "#555", 
            strokeWidth = (style && style['stroke-width']) ? parseFloat(style['stroke-width']) : 0.3;
        
        this.svgGraph.append("g")
            .attr("class", "sg-grid")
            .attr("transform", "translate(0," + this.height + ")")
            .style("opacity", opacity)
            .style("stroke", stroke)
            .style("stroke-width", strokeWidth)
            .call(this.x.gridAxis.tickSize(-this.height).tickFormat(""));
        this.svgGraph.append("g")
            .attr("class", "sg-grid")
            .style("opacity", opacity)
            .style("stroke", stroke)
            .style("stroke-width", strokeWidth)
            .call(this.y.gridAxis.tickSize(-this.width).tickFormat(""));
        
        return this;
    };

    SimpleGraph.prototype.removeGrid = function() {
        this.svgGraph.selectAll(".sg-grid").remove();
        return this;
    };
    
    SimpleGraph.prototype.removeLegend = function() {
        this.svg.selectAll(".sg-legend").remove();
        return this;
    };
    
    SimpleGraph.prototype.drawLegend = function(position, options) {
        this.removeLegend();
        
        if(!position) {
            position = { x: 0, y: 0 };
        } else if(!position.x || !position.y) {
            if(!position.x && position.x !== 0) {
                position.x = (position[0] !== undefined && typeof position[0] === "number") ? position[0] : this.width+5;
            }
            if(!position.y && position.y !== 0) {
                position.y = (position[1] !== undefined && typeof position[1] === "number") ? position[1] : 0;
            }
        }

        options = options || {};
        let anchor = options.anchor || "left", 
            bgstyle = options.bgstyle || {}, 
            exclude = options.exclude || [];

        // exclude formatting
        if(!exclude) { exclude = []; }
        if(typeof exclude === "string") { exclude = exclude.trim().split(/\s+/); }
        let excludeObj = {
            "all":    [], 
            "points": [], 
            "lines":  [], 
            "areas":  []
        };
        exclude.forEach(seriesname => {
            let excludeSub = excludeObj.all, 
                nameparts = seriesname.split("::").map(s => s.trim());
            if(nameparts.length > 1) {
                switch(nameparts[1].toLowerCase()) {
                    case "point":
                    case "points":
                        if(!nameparts[0]) excludeObj.points = true;
                        excludeSub = excludeObj.points;
                        break;
                    case "line":
                    case "lines":
                        if(!nameparts[0]) excludeObj.lines = true;
                        excludeSub = excludeObj.lines;
                        break;
                    case "area":
                    case "areas":
                        if(!nameparts[0]) excludeObj.areas = true;
                        excludeSub = excludeObj.areas;
                        break;
                    default:
                        return;
                }
            }
            if(excludeSub === true) return;
            excludeSub.push(nameparts[0]);
        });
        let checkExclude = (seriesname, seriesshape) => (
            excludeObj[seriesshape] === true
            || ~excludeObj[seriesshape].indexOf(seriesname)
            || !excludeObj.all.indexOf(seriesname)
        );
        
        // default styles for legend container (padding is set via explicit sides)
        if(bgstyle.padding) {
            let pads = (typeof bgstyle.padding === "string") ? bgstyle.padding.split(" ") : [bgstyle.padding];
            if(pads.length === 1) {
                bgstyle['padding-left'] = pads[0];
                bgstyle['padding-right'] = pads[0];
                bgstyle['padding-top'] = pads[0];
                bgstyle['padding-bottom'] = pads[0];
            } else if(pads.length === 2) {
                bgstyle['padding-left'] = pads[1];
                bgstyle['padding-right'] = pads[1];
                bgstyle['padding-top'] = pads[0];
                bgstyle['padding-bottom'] = pads[0];
            } else {
                if(pads.length > 3) { bgstyle['padding-left'] = pads[3]; }
                bgstyle['padding-right'] = pads[1];
                bgstyle['padding-top'] = pads[0];
                bgstyle['padding-bottom'] = pads[2];
            }
            delete bgstyle.padding;
        } else {
            if(!bgstyle['padding-left']) { bgstyle['padding-left'] = 0; }
            if(!bgstyle['padding-right']) { bgstyle['padding-right'] = 0; }
            if(!bgstyle['padding-top']) { bgstyle['padding-top'] = 0; }
            if(!bgstyle['padding-bottom']) { bgstyle['padding-bottom'] = 0; }
        }
        if(!bgstyle.fill) {
            bgstyle.fill = "#fff";
            bgstyle.opacity = 0;
        }
        // ensure int type
        bgstyle['padding-left'] = parseInt(bgstyle['padding-left']);
        bgstyle['padding-right'] = parseInt(bgstyle['padding-right']);
        bgstyle['padding-top'] = parseInt(bgstyle['padding-top']);
        bgstyle['padding-bottom'] = parseInt(bgstyle['padding-bottom']);
        
        // create legend graphic and background (note, added to top SVG not svgGraph)
        var legend = this.svg.append("g")
                .attr("class", "sg-legend")
                .attr("transform", "translate(" + position.x + "," + position.y + ")"), 
            legendBg = legend.append("rect")
                .attr("class", "sg-legend-bg")
                .attr("x", 0)
                .attr("y", 0);
        for(let skey in bgstyle) {
            if(!skey.startsWith('padding')) {
                legendBg.style(skey, bgstyle[skey]);
            }
        }
        
            // column parameters
        let itemsPerColumn  = options.itemsPerColumn || 0, 
            rowHeight       = options.rowHeight || 24, 
            columnNumber    = 0,
            columnItemCount = 0, 
            // running position for next item
            yOffset = bgstyle['padding-top'], 
            xOffset = bgstyle['padding-left'];
        
        // local function checks for new column and adjusts position if so
        function addAndCheckColumn() {
            columnItemCount++;
            if(itemsPerColumn > 0 && columnItemCount >= itemsPerColumn) {
                columnNumber++;
                columnItemCount = 0;
                yOffset = bgstyle['padding-top'];
                xOffset = legend.node().getBBox().width + 12;
            } else {
                yOffset += rowHeight;
            }
        }
        
        // local functions for adding items to legend by data type (not needed yet but will make custom item order
        // easier for future)
        var self = this;
        function addPointItem(data, shape, color, drawPointLine) {
            if(drawPointLine) {
                let lineOffset = yOffset + 10,
                    path = legend.append("path")
                        .attr("x", xOffset)
                        .attr("y", yOffset)
                        .attr("d", 
                            "M" + xOffset + " " + lineOffset + " " + 
                            "L" + (18+xOffset) + " " + lineOffset
                        );
                // remember styles are only stored in first since they're shared
                for(let style in self.pointLines[0].style) {
                    path.style(style, self.pointLines[0].style[style]);
                }
                path.style("stroke", self.getColorBySeriesName(data.series));
            }

            let size = (typeof data.size === "function") ? data.size() : data.size;
            if(size > 14) { size = 14; }
            let ioffx = xOffset+2, 
                ioffy = yOffset+3;
            if(shape && shape.startsWith("triangle")) {
                let length = size*1.519676,  // side length of equilateral trangle of same area of square
                    hl = length/2.0, 
                    hlDiff = 7-hl, 
                    height = length*0.86602,  // ratio of equilateral triangle
                    hh = height*0.5, 
                    hhDiff = 7-hh;
                ioffx += hlDiff;
                ioffy += hhDiff;
                switch(shape) {
                    case "triangle-down":
                        legend.append("polygon")
                            .attr("points", (
                                `${ioffx},${ioffy+height} `
                                + `${ioffx+hl},${ioffy} `
                                + `${ioffx+length},${ioffy+height}`
                            ))
                            .style("fill", color);
                        break;
                    case "triangle":
                    case "triangle-up":
                        legend.append("polygon")
                            .attr("points", (
                                `${ioffx},${ioffy} `
                                + `${ioffx+hl},${ioffy+height} `
                                + `${ioffx+length},${ioffy}`
                            ))
                            .style("fill", color);
                        break;
                }
            } else {
                let hs = size/2.0, 
                    hsDiff = 7-hs;
                ioffx += hsDiff;
                ioffy += hsDiff;
                switch(shape) {
                    case "circle":
                        legend.append("circle")
                            .attr("cx", ioffx+hs)
                            .attr("cy", ioffy+hs)
                            .attr("r", hs)
                            .style("fill", color);
                        break;
                    case "square":
                    case "diamond":
                    default:
                        legend.append("rect")
                            .attr("x", ioffx)
                            .attr("y", ioffy)
                            .attr("width", size)
                            .attr("height", size)
                            .attr("transform", shape == "square" ? "" : `rotate(45,${ioffx+hs},${ioffy+hs})`)
                            .style("fill", color);
                        break;
                }
            }

            legend.append("text")
                .attr("x", xOffset+23)
                .attr("y", yOffset+9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(data.series);

            addAndCheckColumn();
        }
        function addLineItem(data, color) {
            let lineOffset = yOffset + 10, 
                path = legend.append("path")
                    .attr("x", xOffset)
                    .attr("y", yOffset)
                    .attr("d", 
                        "M" + xOffset + " " + lineOffset + " " + 
                        "L" + (18+xOffset) + " " + lineOffset
                    );
            for(let style in data.style) {
                path.style(style, data.style[style]);
            }
            if(!("stroke" in data.style)) {
                path.style("stroke", color);
            }
            legend.append("text")
                .attr("x", xOffset+23)
                .attr("y", yOffset+9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(data.series);
            addAndCheckColumn();
        }
        function addAreaItem(data, color) {
            let symbol = legend.append("rect")
                .attr("x", xOffset)
                .attr("y", yOffset)
                .attr("width", 18)
                .attr("height", 18);
            for(let style in data.style) {
                symbol.style(style, data.style[style]);
            }
            if(!("fill" in data.style)) {
                symbol.style("fill", color);
            }
            legend.append("text")
                .attr("x", xOffset+23)
                .attr("y", yOffset+9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(data.series);
            addAndCheckColumn();
        }
        
        // start with areas data
        if(this.areas && excludeObj.areas !== true) {
            let areaSeries = [];
            for(let i = 0; i < this.areas.length; i++) {
                let name = this.areas[i].series;
                if(!checkExclude(name, 'areas') && !~areaSeries.indexOf(name)) {
                    areaSeries.push(name);
                    let color = this.getColorBySeriesName(name);
                    addAreaItem(this.areas[i], typeof color === "function" ? color(this.areas[i]) : color);
                }
            }
        }
        // then lines
        if(this.lines && excludeObj.lines !== true) {
            let lineSeries = [];
            for(let i = 0; i < this.lines.length; i++) {
                let name = this.lines[i].series;
                if(!checkExclude(name, 'lines') && !~lineSeries.indexOf(name)) {
                    lineSeries.push(name);
                    let color = this.getColorBySeriesName(name);
                    addLineItem(this.lines[i], typeof color === "function" ? color(this.lines[i]) : color);
                }
            }
        }
        // finally points
        if(this.points && excludeObj.points !== true) {
            let pointSeries = [];
            for(let i = 0; i < this.points.length; i++) {
                let name = this.points[i].series;
                if(!checkExclude(name, 'points') && !~pointSeries.indexOf(name)) {
                    pointSeries.push(name);
                    // find connected point line series, if it exists
                    let drawPointLine = false;
                    if(this.pointLines) {
                        let j = this.pointLines.length;
                        while(j--) {
                            if(this.pointLines[j].series === name) {
                                drawPointLine = true;
                                break;
                            }
                        }
                    }
                    let color = this.getColorBySeriesName(name);
                    color = typeof color === "function" ? color(this.points[i]) : color;
                    addPointItem(this.points[i], this.getPointSeriesShape(name), color, drawPointLine);
                }
            }
        }
        
        // finish up legend bg after completing elements inside
        let legendBox = legend.node().getBBox();
        legendBg
            .attr("width", legendBox.width + bgstyle['padding-left'] + bgstyle['padding-right'])
            .attr("height", legendBox.height + bgstyle['padding-top'] + bgstyle['padding-bottom']);
            
        // adjust legend position if necessary
        anchor = anchor.trim().toLowerCase();
        if(anchor === "middle") {
            position.x -= 0.5*legendBox.width;
        } else if(anchor === "right") {
            position.x -= legendBox.width;
        }
        legend.attr("transform", "translate(" + position.x + "," + position.y + ")");
        
        return this;
    };
}