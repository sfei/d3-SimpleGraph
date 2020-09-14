export default function(SimpleGraph) {
    SimpleGraph.prototype._findIntercept = function(f, x1, x2, y2Axis) {
        var y1 = f(x1), y2 = f(x2);
        var breakValue, increasing;
        var yAxis = y2Axis ? this.y2 : this.y;
        if(y1 < yAxis.min !== y2 < yAxis.min) {
            breakValue = yAxis.min;
        } else if(y1 > yAxis.max !== y2 > yAxis.max) {
            breakValue = yAxis.max;
        } else {
            return null;
        }
        var x = x1 + 0.5*(x2 - x1);          // start halfway
        var search = 0.25*Math.abs(x2 - x1); // search distance
        var lasty = y1, lastx = x1;          // store last x,y values
        var y, diff, goHigher;               // vars scoped only in interation but to avoid redeclaring var
        var lastDiff, lastGoHigher;          // some other memory items
        x1 -= 0.00001;                       // add tolerances to min/max bounds as binary arithmetic can cause 
        x2 += 0.00001;                       // minor discrepancies when converted to decimal values
        var i = 0;                           // increment for fail-safe stop condition
        while(i++ < 100) {
            y = f(x);
            diff = Math.abs(y - breakValue);
            if(x >= this.x.min && x <= this.x.max && diff < 0.000001) {
                return [x, breakValue];
            }
            if(i > 0 && lastDiff < diff) {
                // last search point was closer
                x = lastx;
                y = lasty;
                search *= 0.5;
            } else {
                // new search point is closer (determine whether to try higher/lower x by comparing whether the y 
                // is over the break value against whether the line is upsloped).
                goHigher = (y > breakValue) !== ((x > lastx) === (y > lasty));
                if(goHigher !== lastGoHigher) {
                    search *= 0.5;
                }
                lastx = x;
                lasty = y;
                lastGoHigher = goHigher;
                lastDiff = diff;
            }
            x += (lastGoHigher) ? search : -search;
            if(x < x1 || x > x2) {
                return null;
            }
        }
        return null;
    };

    SimpleGraph.prototype._getLineSegmentsFromCoordinates = function(lineCoords, y2Axis) {
        var yAxis = y2Axis ? this.y2 : this.y;
        var lineSegments = [];
        var segment = [];
        var lastCoords = null;
        var crossedXMin = false;
        var crossedXMax = false;

        for(var c = 0; c < lineCoords.length; c++) {
            var coords = lineCoords[c];
            // null means a break in the line
            if(coords[1] === undefined || coords[1] === null) {
                if(segment.length > 1) {
                    lineSegments.push(segment);
                }
                segment = [];
                lastCoords = null;
                continue;
            }
            // note, if date, this will become y per milliseconds
            var slope = (!lastCoords) ? 0 : (lineCoords[c][1] - lastCoords[1]) / (lineCoords[c][0] - lastCoords[0]);

            if(!crossedXMin) {
                if(coords[0] >= this.x.min) {
                    crossedXMin = true;
                    if(coords[0] > this.x.min && lastCoords) {
                        // get intercept on y=x-min, add if within range
                        var intercept = [
                            this.x.min, 
                            lastCoords[0] + slope*(coords[1] - lastCoords[1])
                        ];
                        if(intercept[1] >= yAxis.min && intercept[1] <= yAxis.max) {
                            segment.push(intercept);
                        }
                    }
                    // add if within y-range
                    if(coords[1] >= yAxis.min && coords[1] <= yAxis.max) {
                        segment.push(coords);
                    }
                }
                // skip rest of loop until crossing x-min or because we just added segment start
                lastCoords = coords;
                continue;
            }

            if(!crossedXMax && coords[0] >= this.x.max) {
                crossedXMax = true;
                if(coords[0] > this.x.max) {
                    // if no last coords, this is just a point outside
                    if(!lastCoords) {
                        break;
                    }
                    // interpolate back to x-max
                    coords = [
                        this.x.max, 
                        lastCoords[0] + slope*(coords[1] - lastCoords[1])
                    ];
                }
            }

            // check within y-range
            if(coords[1] >= yAxis.min && coords[1] <= yAxis.max) {
                // case: first point of new segment
                if(segment.length === 0 && lastCoords) {
                    if(slope !== 0) {
                        // get y-intercept
                        var yTarget = slope > 0 ? yAxis.min : yAxis.max;
                        var lastX = this.x.isDate ? lastCoords[0].getTime() : lastCoords[0];
                        coords = [
                            lastX + (yTarget - lastCoords[1])/slope, 
                            yTarget
                        ];
                        if(this.x.isDate) {
                            coords[0] = new Date(coords[0]);
                        }
                        // force repeat of the coords that original came in for this loop (intercept will become last)
                        c--;
                    }
                }
                // add to segment
                segment.push(coords);
            } else {
                // case: ending segment with last point outside of range
                if(segment.length > 0) {
                    // yet y-intercept
                    var yTarget = slope > 0 ? yAxis.max : yAxis.min;
                    var lastX = this.x.isDate ? lastCoords[0].getTime() : lastCoords[0];
                    coords = [
                        lastX + (yTarget - lastCoords[1])/slope, 
                        yTarget
                    ];
                    if(this.x.isDate) {
                        coords[0] = new Date(coords[0]);
                    }
                    // add to segment
                    segment.push(coords);
                }
                // finish segment
                if(segment.length > 1) {
                    lineSegments.push(segment);
                    segment = [];
                }
            }
            // if crossed x-max we can break
            if(crossedXMax) { break; }
            // save last coordinates
            lastCoords = coords;
        }

        // always attempt to add last segment
        if(segment.length > 1) {
            lineSegments.push(segment);
        }

        return lineSegments;
    };

    SimpleGraph.prototype._getLineSegmentsFromFunction = function(lineFunction, resolution, xRange, y2Axis, limitToGraphRange) {
        var yAxis = y2Axis ? this.y2 : this.y;

        if(!xRange) {
            xRange = [this.x.min, this.x.max];
        } else {
            if(xRange[0] < this.x.min) { xRange[0] = this.x.min; }
            if(xRange[1] > this.x.max) { xRange[0] = this.x.max; }
        }
        if(!resolution || typeof resolution !== "number") {
            resolution = Math.floor((this.width - this.margins.left - this.margins.right) / 10);
        }
        if(resolution < 2) {
            resolution = 2;
        }

        // how increments are handled and needed variables
        var incrementFunc;
        if(!this.x.isLog) {
            // if not log-scale, standard increment (this works for dates too)
            var increment = (xRange[1] - xRange[0])/(resolution-1);
            var isDate = this.x.isDate;
            // standard increment function
            incrementFunc = function(n) {
                if(isDate) {
                    return new DateUTC(n.getTime() + increment);
                }
                return n += increment;
            };
        } else {
            // increment in exponential scale fit to range and resolution
            var base = Math.pow(xRange[1]/xRange[0], 1-resolution);
            incrementFunc = function(n) {
                n *= base;
                return (n > xRange[1]) ? xRange[1] : n;
            };
        }

        var lineSegments = [], 
            segment = [], 
            x = xRange[0], 
            lastX = x;

        while(true) {
            var markForBreak = false;
            if(x >= xRange[1]) {
                x = xRange[1];
                markForBreak = true;
            }

            var y = lineFunction(x);

            if(!limitToGraphRange) {
                segment.push([x, y]);
                continue;
            }

            if(y >= yAxis.min && y <= yAxis.max) {
                // case: first point of new segment
                if(segment.length === 0 && x > xRange[0]) {
                    // get y-intercept
                    var intercept = this._findIntercept(lineFunction, lastX, x, y2Axis);
                    if(intercept) {
                        segment.push(intercept);
                    }
                }
                // add to segment
                segment.push([x, y]);
            } else {
                // case: ending segment with last point outside of range
                if(segment.length > 0) {
                    // yet y-intercept
                    var intercept = this._findIntercept(lineFunction, lastX, x, y2Axis);
                    if(intercept) {
                        segment.push(intercept);
                    }
                }
                // finish segment
                if(segment.length > 1) {
                    lineSegments.push(segment);
                    segment = [];
                }
            }

            lastX = x;
            x = incrementFunc(x);
            if(markForBreak) break;
        }
        
        // always attempt to add last segment
        if(segment.length > 1) lineSegments.push(segment);

        return lineSegments;
    };

    SimpleGraph.prototype._getAreaPolysFromCoordinates = function(areaCoordinates, y2Axis) {
        var lineA = [];
        var lineB = [];
        for(var i = 0; i < areaCoordinates.length; i++) {
            lineA.push([areaCoordinates[i][0], areaCoordinates[i][1]]);
            lineB.push([areaCoordinates[i][0], areaCoordinates[i][2]]);
        }
        return this._getAreaPolysFromLineCrosswalk(
            this._getLineSegmentsFromCoordinates(lineA, y2Axis), 
            this._getLineSegmentsFromCoordinates(lineB, y2Axis), 
            y2Axis
        );
    };

    SimpleGraph.prototype._getAreasPolysFromFunctions = function(funcA, funcB, resolution, xRange, y2Axis, limitToGraphRange) {
        var lines = [
            this._getLineSegmentsFromFunction(funcA, resolution, xRange, y2Axis, limitToGraphRange), 
            this._getLineSegmentsFromFunction(funcB, resolution, xRange, y2Axis, limitToGraphRange)
        ];
        return this._getAreaPolysFromLineCrosswalk(
            this._getLineSegmentsFromFunction(funcA, resolution, xRange, y2Axis, limitToGraphRange), 
            this._getLineSegmentsFromFunction(funcB, resolution, xRange, y2Axis, limitToGraphRange), 
            y2Axis
        );
    };

    SimpleGraph.prototype._getAreaPolysFromLineCrosswalk = function(lineA, lineB, y2Axis) {
        var areas = [], 
            areaCoords = [], 
            li = [0, 0], 
            ci = [0, 0], 
            endOfLines = [false, false], 
            endOfCoords = [false, false], 
            coordA, coordB;

        while(true) {
            // grab coords
            coordA = endOfLines[0] ? null : lineA[li[0]][ci[0]];
            coordB = endOfLines[1] ? null : lineB[li[1]][ci[1]];
            // whether to progress each line
            var moveCoords = [false, false];
            
            if(!coordA && !coordB) {
                break;
            } else if(!coordA || !coordB) {
                // if null value in either coordinate or odd situation if inconsistent number of coordinates, 
                // pinch off area and move
                moveCoords = [true, true];
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                areaCoords = [];
            } else if(coordA[0] === coordB[0]) {
                // matching, just add
                areaCoords.push([coordA[0], coordA[1], coordB[1]]);
                // both coords moved
                moveCoords[0] = moveCoords[1] = true;
            } else {
                // if one set of coords needs to catch up, don't add the coord (assume no area), pinch existing 
                // coords to areas if available
                if(coordA[0] < coordB[0]) {
                    moveCoords[0] = true;
                } else {
                    moveCoords[1] = true;
                }
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                areaCoords = [];
            }
            
            var newLines = [false, false];
            for(var i = 0; i < 2; i++) {
                if(endOfLines[i]) { continue; }
                var line = i === 0 ? lineA : lineB;
                // move coords as necessary
                if(moveCoords[i]) { ci[i] += 1; }
                // check end of coordinates
                endOfCoords[i] = ci[i] >= line[li[i]].length;
                // increment lines when needed
                if(endOfCoords[i]) {
                    li[i] += 1;
                    ci[i] = 0;
                    newLines[i] = true;
                    // check end of line
                    endOfLines[i] = li[i] >= line.length;
                }
            }
            // if both moved to new lines, we can pinch off this area and start a new one
            if(newLines[0] && newLines[1]) {
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                areaCoords = [];
            }
            // break condition
            if(endOfLines[0] && endOfLines[1]) {
                if(areaCoords.length >= 2) {
                    areas.push(areaCoords);
                }
                break;
            }
        }
        return areas;
    };
}