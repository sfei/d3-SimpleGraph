export default function(SimpleGraph) {
    /**
     * Set axes. As calling this will invalidate anything drawn on the graph, all data is cleared from the graph
     * on calling this.
     * @param {Object} [axisOptions] -Dictionary of axis options per axes (keys being x, y, and optionally, y2).
     * @param {Object} [axisOptions.style={fill:"none",'stroke-width':0.5,stroke:'black'}] - Shared styles for 
     *        both axes stored as key-value pairs where each key is the name of an appropriate style.
     * @param {Object} [axisOptions.x] - X-axis options object (further expanded below).
     * @param {Object} [axisOptions.y] - Y-axis options object (same as expanded x-axis options below, so not 
     *        duplicated).
     * @param {Object} [axisOptions.y2] - Second y-axis options object (same as expanded x-axis options below, so 
     *        not duplicated).
     * @param {string} [axisOptions.x.format=".0f"] - Number format for tick labels.
     * @param {number} [axisOptions.x.min=0] - Minimum value on axis 
     * @param {number} [axisOptions.x.max=100] - Maximum value on axis.
     * @param {string} [axisOptions.x.label="x-value"] - Axis label.
     * @param {Object} [axisOptions.x.scale=d3.scaleLinear] - Optional class for scale type. Must be d3 scale.
     * @param {Object} [axisOptions.x.logBase=10] - Optional base number if using logarithmic scale.
     * @param {number[]} [axisOptions.x.tickValues] - Specific values on x-axis to create tick marks on (this 
     *        will take priority over axisOptions.x.ticks if both are supplied).
     * @param {number} [axisOptions.x.ticks] - Number of evenly spaced tick intervals on x-axis to create (due 
     *        to nature of axis, may not always create exactly this amount but will attempt to).
     * @param {Object} [axisOptions.x.grid] - Optional dictionary of axis-grid options.
     * @param {number[]} [axisOptions.x.grid.tickValues] - Specific values on x-axis grid to create tick marks on
     *        (this will take priority over axisOptions.x.grid.ticks if both are supplied).
     * @param {number} [axisOptions.x.grid.ticks] - Number of evenly spaced tick intervals on x-axis grid to 
     *        create (due to nature of axis, may not always create exactly this amount but will attempt to).
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.resetAxisOptions = function(axisOptions) {
        if(!axisOptions)        { axisOptions = {}; }
        if(!axisOptions.x)      { axisOptions.x = {}; }
        if(!axisOptions.y)      { axisOptions.y = {}; }
        if(!axisOptions.styles) { axisOptions.styles = {}; }
        
        // default axis styles
        this.axisStyles = axisOptions.style;
        if(!this.axisStyles) {
            this.axisStyles = {};
        }
        if(!this.axisStyles.fill) {
            this.axisStyles.fill = "none";
        }
        if(!this.axisStyles["stroke-width"]) {
            this.axisStyles["stroke-width"] = 0.5;
        }
        if(!this.axisStyles.stroke) {
            this.axisStyles.stroke = "black";
        }
        
        // loop per axis to remove redundancies
        var axes = ["x", "y", "y2"];
        for(var i = 0; i < axes.length; i++) {
            // specific axis options
            var a = axes[i];
            if(!axisOptions[a]) {
                // if no second y-axis, just skip
                if(a === "y2") { continue; }
                axisOptions[a] = {};
            }
            if(!axisOptions[a].scale) {
                axisOptions[a].scale = d3.scaleLinear;
            }
            var scaleIsTime = axisOptions[a].scale === d3.scaleTime || axisOptions[a].scale === d3.scaleUtc;
            var scaleIsLog = !scaleIsTime && axisOptions[a].scale === d3.scaleLog;
            if(!axisOptions[a].format) {
                if(scaleIsTime) {
                    axisOptions[a].format = "%Y-%m-%d";
                } else {
                    axisOptions[a].format = ".0f";
                }
            }
            if(!axisOptions[a].grid) { axisOptions[a].grid = {}; }
            if(scaleIsLog && !axisOptions[a].logBase) { axisOptions[a].logBase = 10; }
            
            this[a] = {
                label: (axisOptions[a].label === null) ? (a === "x" ? "x-value" : "y-value") : axisOptions[a].label, 
                isDate: scaleIsTime, 
                isLog: scaleIsLog
            };
            if(scaleIsTime) {
                if(axisOptions[a].scale === d3.scaleUtc) {
                    this[a].format = d3.utcFormat(axisOptions[a].format);
                } else {
                    this[a].format = d3.timeFormat(axisOptions[a].format);
                }
            } else {
                this[a].format = d3.format(axisOptions[a].format);
            }
            
            this[a].min = axisOptions[a].min ? axisOptions[a].min : 0;
            this[a].max = axisOptions[a].max ? axisOptions[a].max : 100;
            
            // create scale
            this[a].scale = axisOptions[a].scale();
            if(scaleIsLog) {
                this[a].scale.base(axisOptions[a].logBase);
            }
            var domain, range;
            if(axisOptions[a].break) {
                this[a].break = axisOptions[a].break;
                domain = [
                    this[a].min, 
                    this[a].break.domain[0], 
                    this[a].break.domain[1], 
                    this[a].max
                ];
                var domain2 = !scaleIsTime ? domain : domain.map(function(x) { return x.getTime(); });
                var span = a === "x" ? this.width : this.height;
                range = a === "x" ? [0, 0, 0, span] : [span, 0, 0, 0];
                var validspan = span - this[a].break.rangegap;
                var rangePerDomain = validspan / (domain2[1] - domain2[0] + domain2[3] - domain2[2]);
                range[1] = rangePerDomain*(domain2[1] - domain2[0]);
                range[2] = range[1] + this[a].break.rangegap;
            } else {
                domain = [this[a].min, this[a].max];
                range = a === "x" ? [0, this.width] : [this.height, 0];
            }
            this[a].scale.domain(domain).range(range);
        
            // create axes
            var applySecondAxes = false;
            if(a === "x") {
                // create both versions of the axes as we need to apply tick formatting to both here
                applySecondAxes = true;
                this[a].axis = d3.axisBottom(this[a].scale);
                this[a].axisTwo = d3.axisTop(this[a].scale);
                this[a].gridAxis = d3.axisBottom(this[a].scale);
            } else {
                if(a === "y2") {
                    this[a].axis = d3.axisRight(this[a].scale);
                    this[a].gridAxis = d3.axisRight(this[a].scale);
                } else {
                    this[a].axis = d3.axisLeft(this[a].scale);
                    this[a].gridAxis = d3.axisLeft(this[a].scale);
                }
            }
            
            // log scale handles ticks differently
            if(scaleIsLog) {
                this[a].axis.tickFormat(this[a].format);
                if(axisOptions[a].ticks) {
                    this[a].axis.ticks(axisOptions[a].ticks, this[a].format);
                } else {
                    this[a].axis.ticks(this[a].format);
                    if(axisOptions[a].tickValues) {
                        this[a].axis.tickValues(axisOptions[a].tickValues);
                    }
                }
                // repeat on second axis if needed
                if(applySecondAxes) {
                    this[a].axisTwo.tickFormat(this[a].format);
                    if(axisOptions[a].ticks) {
                        this[a].axisTwo.ticks(axisOptions[a].ticks, this[a].format);
                    } else {
                        this[a].axisTwo.ticks(this[a].format);
                        if(axisOptions[a].tickValues) {
                            this[a].axisTwo.tickValues(axisOptions[a].tickValues);
                        }
                    }
                }
            } else {
                // add ticks
                this[a].axis.tickFormat(this[a].format);
                if(axisOptions[a].tickValues) {
                    this[a].axis.tickValues(axisOptions[a].tickValues);
                    this[a].gridAxis.tickValues(axisOptions[a].tickValues);
                } else if(axisOptions[a].ticks || axisOptions[a].ticks === 0) {
                    if(Array.isArray(axisOptions[a].ticks)) {
                        this[a].axis.ticks(axisOptions[a].ticks[0], axisOptions[a].ticks[1]);
                        this[a].gridAxis.ticks(axisOptions[a].ticks[0], axisOptions[a].ticks[1]);
                    } else {
                        this[a].axis.ticks(axisOptions[a].ticks);
                        this[a].gridAxis.ticks(axisOptions[a].ticks);
                    }
                }
                // add sub-grid-ticks
                this[a].gridAxis.tickFormat(this[a].format);
                if(axisOptions[a].grid.tickValues) {
                    this[a].gridAxis.tickValues(axisOptions[a].grid.tickValues);
                } else if(axisOptions[a].grid.ticks || axisOptions[a].grid.ticks === 0) {
                    if(Array.isArray(axisOptions[a].grid.ticks)) {
                        this[a].gridAxis.ticks(axisOptions[a].grid.ticks[0], axisOptions[a].grid.ticks[1]);
                    } else {
                        this[a].gridAxis.ticks(axisOptions[a].grid.ticks);
                    }
                }
                // repeat on second axis if needed
                if(applySecondAxes) {
                    this[a].axisTwo.tickFormat(this[a].format);
                    if(axisOptions[a].tickValues) {
                        this[a].axisTwo.tickValues(axisOptions[a].tickValues);
                    } else if(axisOptions[a].ticks || axisOptions[a].ticks === 0) {
                        if(Array.isArray(axisOptions[a].ticks)) {
                            this[a].axisTwo.ticks(axisOptions[a].ticks[0], axisOptions[a].ticks[1]);
                        } else {
                            this[a].axisTwo.ticks(axisOptions[a].ticks);
                        }
                    }
                }
            }
        }
        
        // for backwards compatibility
        this.minMax = {
            x: [this.x.min, this.x.max],
            y: [this.y.min, this.y.max]
        };
        this.xScale = this.x.scale;
        this.xAxis = this.x.axis;
        this.xGridAxis = this.x.gridAxes;
        this.yScale = this.y.scale;
        this.yAxis = this.y.axis;
        this.yGridAxis = this.y.gridAxes;
        
        // draw axes but also clear any drawn lines/points/areas as they'd now be off
        this.removeAll();
        this.drawAxes();
        
        return this;
    };

    /**
     * (Re)draw axes on graph.
     * @param {string} [labelPosition="outside center"] - Keywords for the label positions on each axis. Keywords 
     *        include 'inside' or 'outside' for the position of both axis labels either inside or outside of the 
     *        axis lines; 'center' to center both axis labels along parallel of respective axis; 'left' or 'right'
     *        to determine placement of x-axis label along axis parallel; 'top' or 'bottom' to determine placement
     *        of y-axis label along axis parallel. Keywords are assigned in the order they are read. Thus a call 
     *        of "center top" would first center both labels, then move the y-axis label to the top.
     * @param {string} [xAxisPosition="bottom"] - Placement option of the x-axis, allowing you to draw the x-axis 
     *        line and labels on top or bottom.
     * @param {number} [axisLabelMargin=0] - Labels are automatically placed at a margin determined not to overlap
     *        with the tick marks. However you may specify and additional margin here.
     * @memberof SimpleGraph 
     */
    SimpleGraph.prototype.drawAxes = function(labelPosition, xAxisPosition, axisLabelMargin) {
        if(!xAxisPosition) { 
            xAxisPosition = "bottom"; 
        } else {
            xAxisPosition = xAxisPosition.toLowerCase().trim();
            if(xAxisPosition !== "top") { xAxisPosition = "bottom"; }
        }
        var xAxis;
        var xAxisPosY = 0;
        if(xAxisPosition !== "top") {
            xAxis = this.x.axis;
            xAxisPosY = this.height;
        } else {
            xAxis = this.x.axisTwo;
        }
        if(!axisLabelMargin) { axisLabelMargin = 0; }
        
        // draw axes first without labels
        this.svg.selectAll(".sg-xaxis, .sg-yaxis, .sg-y2axis, .sg-axis-label").remove();
        var xAxisG = this.svgGraph.append("g")
            .attr("class", "sg-xaxis")
            .attr("transform", "translate(0," + xAxisPosY + ")")
            .call(xAxis)
            // annoyingly d3 adds these after axis call so remove so they don't override svg style
            .attr("font-size", null)
            .attr("font-family", null);
        var yAxisG = this.svgGraph.append("g")
            .attr("class", "sg-yaxis")
            .call(this.y.axis)
            .attr("font-size", null)
            .attr("font-family", null);
        var y2AxisG = !this.y2 ? null : this.svgGraph.append("g")
            .attr("class", "sg-y2axis")
            .attr("transform", "translate(" + this.width + ",0)")
            .call(this.y2.axis)
            .attr("font-size", null)
            .attr("font-family", null);
        // for some reason ticks are by default invisible
        this.svgGraph.selectAll(".tick line").style("stroke", "#000");
        // add styles
        var axes = this.svgGraph.selectAll(".sg-xaxis .domain, .sg-yaxis .domain, .sg-y2axis .domain");
        for(var style in this.axisStyles) {
            axes.style(style, this.axisStyles[style]);
        }
        
        // get size of ticks to know margin to place labels away if outside
        var tickMargin = { x: 0, y: 0, y2: 0 };
        this.svgGraph.selectAll(".sg-xaxis .tick").each(function() {
            if(this.getBBox().height > tickMargin.x) {
                tickMargin.x = this.getBBox().height;
            }
        });
        this.svgGraph.selectAll(".sg-yaxis .tick").each(function() {
            if(this.getBBox().width > tickMargin.y) {
                tickMargin.y = this.getBBox().width;
            }
        });
        this.svgGraph.selectAll(".sg-y2axis .tick").each(function() {
            if(this.getBBox().width > tickMargin.y2) {
                tickMargin.y2 = this.getBBox().width;
            }
        });
        
        // default position on center-outside
        var xLabelPos = {
            a: 'middle', 
            x: 0.5*this.width,
            y: (xAxisPosition === "top") ? -(tickMargin.x + axisLabelMargin) : (tickMargin.x + 10 + axisLabelMargin)
        };
        var yLabelPos = {
            a: 'middle', 
            x: -0.5*this.height,
            y: -(tickMargin.y + 10 + axisLabelMargin)
        };
        var y2LabelPos = {
            a: 'middle', 
            x: 0.5*this.height,
            y: -(tickMargin.y2 + 10 + axisLabelMargin)
        };
        // determine label position
        if(labelPosition) {
            // split by keys
            var lpKeys = labelPosition.toLowerCase().split(/[ ,]+/);
            var xparallel = "center", yparallel = "center", perpendicular = "outside";
            for(var i = 0; i < lpKeys.length; i++) {
                if(lpKeys[i] === "outside") {
                    xLabelPos.y =(xAxisPosition === "top") ? -(tickMargin.x + axisLabelMargin) : (tickMargin.x + 10 + axisLabelMargin);
                    yLabelPos.y = -(tickMargin.y + 10 + axisLabelMargin);
                    y2LabelPos.y = -(tickMargin.y2 + 10 + axisLabelMargin);
                    perpendicular = "outside";
                } else if(lpKeys[i] === "inside") {
                    xLabelPos.y = (xAxisPosition === "top") ? (14 + axisLabelMargin) : -(6 + axisLabelMargin);
                    yLabelPos.y = 6 + axisLabelMargin;
                    y2LabelPos.y = yLabelPos.y;
                    perpendicular = "inside";
                } else if(lpKeys[i] === "center") {
                    xLabelPos.a = 'middle';
                    xLabelPos.x = 0.5*this.width;
                    yLabelPos.a = 'middle';
                    yLabelPos.x = -0.5*this.height;
                    y2LabelPos.a = 'middle';
                    y2LabelPos.x = -yLabelPos.x;
                    xparallel = "center";
                    yparallel = "center";
                } else if(lpKeys[i] === "left") {
                    xLabelPos.a = 'start';
                    xLabelPos.x = 0;
                    xparallel = "left";
                } else if(lpKeys[i] === "right") {
                    xLabelPos.a = 'end';
                    xLabelPos.x = this.width;
                    xparallel = "right";
                } else if(lpKeys[i] === "top") {
                    yLabelPos.a = 'end';
                    yLabelPos.x = 0;
                    y2LabelPos.a = 'start';
                    y2LabelPos.x = -yLabelPos.x;
                    yparallel = "top";
                } else if(lpKeys[i] === "bottom") {
                    yLabelPos.a = 'start';
                    yLabelPos.x = -this.height;
                    y2LabelPos.a = 'end';
                    y2LabelPos.x = -yLabelPos.x;
                    yparallel = "bottom";
                }
            }
            // if near axis crossing, needs some extra padding
            if(perpendicular === "inside") {
                if(xparallel === "left") {
                    xLabelPos.x += 10;
                } else if(xparallel === "right" && this.y2) {
                    xLabelPos.x -= 10;
                }
                if(xAxisPosition === "bottom") {
                    if(yparallel === "bottom") {
                        yLabelPos.x += 10;
                        y2LabelPos.x -= 10;
                        if(xparallel === "left") {
                            xLabelPos.x += 10;
                            yLabelPos.x += 10;
                        } else if(xparallel === "right" && this.y2) {
                            xLabelPos.x -= 10;
                            y2LabelPos.x -= 10;
                        }
                    } else {
                        yLabelPos.x -= 10;
                        y2LabelPos.x += 10;
                    }
                } else {
                    if(yparallel === "top") {
                        yLabelPos.x -= 10;
                        y2LabelPos.x += 10;
                        if(xparallel === "left") {
                            xLabelPos.x += 10;
                            yLabelPos.x -= 10;
                        } else if(xparallel === "right" && this.y2) {
                            xLabelPos.x -= 10;
                            y2LabelPos.x += 10;
                        }
                    } else {
                        yLabelPos.x += 10;
                        y2LabelPos.x -= 10;
                    }
                }
            }
        }
        
        // add labels
        xAxisG.append("text")
            .attr("class", "sg-axis-label sg-xaxis")
            .attr("x", xLabelPos.x)
            .attr("y", xLabelPos.y)
            .attr("fill", "#000")
            .style("text-anchor", xLabelPos.a)
            .style("font-weight", "bolder")
            .text(this.x.label);
        yAxisG.append("text")
            .attr("class", "sg-axis-label sg-yaxis")
            .attr("transform", "rotate(-90)")
            .attr("x", yLabelPos.x)
            .attr("y", yLabelPos.y)
            .attr("dy", ".71em")
            .attr("fill", "#000")
            .style("text-anchor", yLabelPos.a)
            .style("font-weight", "bolder")
            .text(this.y.label);
        if(y2AxisG) {
            y2AxisG.append("text")
                .attr("class", "sg-axis-label sg-y2axis")
                .attr("transform", "rotate(90)")
                .attr("x", y2LabelPos.x)
                .attr("y", y2LabelPos.y)
                .attr("dy", ".71em")
                .attr("fill", "#000")
                .style("text-anchor", y2LabelPos.a)
                .style("font-weight", "bolder")
                .text(this.y2.label);
        }
        
        return this;
    };
}