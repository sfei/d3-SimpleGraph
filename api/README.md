----------

# API & Guide #

----------

* **Constructor, properties, and misc. functions**
&nbsp; &nbsp; * [Constructor](#constructor)
&nbsp; &nbsp; * [Properties](#properties)
&nbsp; &nbsp; * [getSvgElement](#a-getsvgelement)
&nbsp; &nbsp; * [getSvgGraphic](#a-getsvggraphic) 
&nbsp; &nbsp; * [remove](#a-remove)
&nbsp; &nbsp; * [destroy](#a-destroy)
&nbsp; &nbsp; * [saveAsPng](#a-savegraphaspng) 
* [Axis, grid, and legend](./axis-grid-legend.md)
&nbsp; &nbsp; *[resetAxisOptions](./axis-grid-legend.md#a-resetaxisoptions)*  
&nbsp; &nbsp; *[drawAxes](./axis-grid-legend.md#a-drawaxes)*  
&nbsp; &nbsp; *[drawGrid](./axis-grid-legend.md#a-drawgrid)*  
&nbsp; &nbsp; *[removeGrid](./axis-grid-legend.md#a-removegrid)*  
&nbsp; &nbsp; *[drawLegend](./axis-grid-legend.md#a-drawlegend)*  
&nbsp; &nbsp; *[removeLegend](./axis-grid-legend.md#a-removelegend)*  
* [Color category functions](./color.md)
&nbsp; &nbsp; *[getColorBySeriesName](./color.md#a-getcolorseriesbyname)*  
&nbsp; &nbsp; *[resetColorScale](./color.md#a-resetcolorscale)*  
&nbsp; &nbsp; *[setSeriesColor](./color.md#a-setseriescolor)*  
&nbsp; &nbsp; *[removeSeriesColor](./color.md#a-removeseriescolor)*  
* [Adding data](./add-data.md)
&nbsp; &nbsp; *[addPointData](API.md#sg-add-point-data)*  
&nbsp; &nbsp; *[addPointsData](API.md#sg-add-points-data)*  
&nbsp; &nbsp; *[addPointsDataAsArray](API.md#sg-add-points-data-as-array)*  
&nbsp; &nbsp; *[addLineDataAsCoordinates](API.md#sg-add-line-data-as-coordinates)*  
&nbsp; &nbsp; *[addLineDataAsFunction](API.md#sg-add-line-data-as-function)*  
&nbsp; &nbsp; *[addLinesDataFromPoints](API.md#sg-add-line-data-from-points)*  
&nbsp; &nbsp; *[addAreaBetweenTwoLines](API.md#sg-add-area-between-two-lines)*  
&nbsp; &nbsp; *[addAreaAsCoordinates](API.md#sg-area-as-coordinates)*  
* [Getting data](./get-data.md)
&nbsp; &nbsp; *[getPointsDataBySeries](API.md#sg-get-points-data-by-series)*  
&nbsp; &nbsp; *[getPointCoordinatesBySeries](API.md#sg-get-point-coordinates-by-series)*  
&nbsp; &nbsp; *[getLinesDataBySeries](API.md#sg-get-line-data-by-series)*  
&nbsp; &nbsp; *[getAreasDataBySeries](API.md#sg-get-area-data-by-series)*  
* [Removing and updating data](./mod-data.md)
&nbsp; &nbsp; *[clearPointsData](API.md#sg-clear-points-data)*  
&nbsp; &nbsp; *[clearLinesData](API.md#sg-clear-lines-data)*  
&nbsp; &nbsp; *[clearAreasData](API.md#sg-clear-areas-data)*  
&nbsp; &nbsp; *[clearAllData](API.md#sg-clear-all-data)*  
* [Drawing data onto the graph](./draw.md)
&nbsp; &nbsp; *[drawPoints](API.md#sg-draw-points)*  
&nbsp; &nbsp; *[drawLines](API.md#sg-draw-lines)*  
&nbsp; &nbsp; *[drawAreas](API.md#sg-draw-areas)*  
&nbsp; &nbsp; *[removePoints](API.md#sg-remove-points)*  
&nbsp; &nbsp; *[removeLines](API.md#sg-remove-lines)*  
&nbsp; &nbsp; *[removeAreas](API.md#sg-remove-areas)*  
&nbsp; &nbsp; *[removeAll](API.md#sg-remove-all)*  
* [Adding interactive features](./interactivity.md)
&nbsp; &nbsp; *[addTooltipToPoints](API.md#sg-add-tooltip-to-points)*  
&nbsp; &nbsp; *[addTooltipToLines](API.md#sg-add-tooltip-to-lines)*  
&nbsp; &nbsp; *[addTooltipToAreas](API.md#sg-add-tooltip-to-areas)*  
&nbsp; &nbsp; *[highlightPoints](API.md#sg-highlight-points)*  
&nbsp; &nbsp; *[removeHighlightPoints](API.md#sg-remove-highlights-points)*  
&nbsp; &nbsp; *[removeHighlights](API.md#sg-remove-highlights)*  
* [Definitions](./defs.md)
&nbsp; &nbsp; [Axis options](API.md#axis-options)  
&nbsp; &nbsp; [Point data](API.md#point-data)  
&nbsp; &nbsp; [Line data](API.md#line-data)  
&nbsp; &nbsp; [Area data](API.md#area-data)  
&nbsp; &nbsp; [Tooltip text function](API.md#tooltip-text-function)  

----------


## Constructor ##

Usage begins by constructing an instance of `SimpleGraph`. At the minimum, a container should be provided (or it will simply append the DOM body). Basic graph properties, such as dimensions and margins, are set here and cannot be changed.

<a name="a-simplegraph" href="#a-simplegraph">#</a>
new **SimpleGraph**(*options*)

#### Options ####

<table style="font-size:0.9em;">
  <tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>container</td><td>string</td><td>The DOM element query/selector to the element to append the graph to. Defaults to "body".</td>
    </tr>
    <tr>
      <td>margins</td>
      <td>object</td>
      <td>
        Optional custom margins.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Type</th><th>Description</th>
            </tr>
            <tr>
              <td>left</td><td>number</td><td>Left margin. Defaults to 40.</td>
            </tr>
            <tr>
              <td>right</td><td>number</td><td>Right margin. Defaults to 40.</td>
            </tr>
            <tr>
              <td>top</td><td>number</td><td>Top margin. Defaults to 20.</td>
            </tr>
            <tr>
              <td>bottom</td><td>number</td><td>Bottom margin. Defaults to 20.</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td>width</td><td>number</td><td>Total graph width (including margins). Defaults to 600.</td>
    </tr>
    <tr>
      <td>height</td><td>number</td><td>Total graph height (including margins). Defaults to 400.</td>
    </tr>
    <tr>
      <td>allowDrawBeyondGraph</td><td>boolean</td><td>Allow drawing beyond graph. If true, all data will be drawn as supplied. If false, points beyond the x/y-axis range will not be drawn and lines/areas will be cut off where they extend past the x/y-axis ranges.</td>
    </tr>
    <tr>
      <td>colorScale</td><td>d3.scale</td><td> Optional color scale to use with data. If data series will have non-numeric identifiers, it should be a categorical or ordinal scale. Defaults to `d3.scaleOrdinal(d3.schemeCategory10)`.</td>
    </tr>
    <tr>
      <td>styles</td><td>object</td><td>Key-value pairs of additional CSS styles to apply to SVG.</td>
    </tr>
    <tr>
      <td>axis</td>
      <td>object</td>
      <td>
        Axis properties.
        <h5>Properties</h5>
        <table>
          <tbody>
            <tr>
              <th>Name</th><th>Description</th>
            </tr>
            <tr>
              <td>x</td><td>X-Axis options (see <a href="./defs.md#axis-options">Axis Options</a>).</td>
            </tr>
            <tr>
              <td>y</td><td>Y-Axis options (see <a href="./defs.md#axis-options">Axis Options</a>).</td>
            </tr>
            <tr>
              <td>y2</td><td>Y2-Axis options (see <a href="./defs.md#axis-options">Axis Options</a>).</td>
            </tr>
            <tr>
              <td>styles</td>
              <td>
                Optional key-value object of shared axis styles. Values filled in by default below:
                <table>
                  <tr><th>Property</th><th>Default Value</th></tr>
                  <tr><td>fill</td><td>"none"</td></tr>
                  <tr><td>stroke-width</td><td>0.5</td></tr>
                  <tr><td>stroke</td><td>"black"</td></tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>


## Properties ##

A few (but not comprehensive) list of the important variables in an initialized SimpleGraph object are below:

* `svg` - The D3 wrapper for the SVG node
* `svgGraph` - The D3 wrapper for the \<g\> node wrapping the graph (resized and positions to fit margins) in the SVG
* `x` - The x-axis (See below for details)
* `y` - The y-axis (See below for details)
* `y2` - The second y-axis (See below for details), if it exists
* `color` - The base/default [D3 color scale](https://github.com/d3/d3-scale-chromatic).
* `customColors` - A dictionary for manually specified color mappings by series names.
* `points` - A list of all points data.
* `lines` - A list of all lines data.
* `areas` - A list of all areas data.
* `pointlines` - A list of all point lines data.
* `ptSeriesShapes` - A dictionary of point shapes by series names.

#### Axis ####

* `axis` - The main D3 axis object for this axis
* `axisTwo` - For the x-axis, the D3 axis object in case the x-axis is desired to be drawn on top of the graph
* `break` - The axis breaks, if they exist
* `format` - The D3 format object for this axis's tick values
* `gridAxis` - The D3 axis object for the gridlines (as they may be drawn with different tick intervals than the axis itself)
* `isDate` - True if date values
* `isLog` - True if log-scale 
* `label` - The axis name/label
* `min` - The axis min value
* `max` - The axis max value
* `scale` - The D3 scale object for this axis

## Misc. functions ##

#### Getting elements ####

<a name="a-getsvgelement" href="#a-getsvgelement">#</a> *sg*.**getSvgElement**()

Returns D3 wrapper for SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `sg.svg`

<a name="a-getsvggraphic" href="#a-getsvggraphic">#</a> *sg*.**getSvgGraphic**()

Returns D3 wrapper for graphic node in SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `sg.svgGraph`

#### Remove and destroy ####

<a name="a-remove" href="#a-remove">#</a> *sg*.**remove()**

Removes SVG node from container.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-destory" href="#a-destory">#</a> **`SimpleGraph.destroy()`**

Removes and destroys SVG and this object. Irreversible.

#### Saving the graph ####

<a name="a-saveaspng" href="#a-saveaspng">#</a> *sg*.**saveAsPng**(*pngName*)

Save graph as a PNG. Note, in non-Edge Internet Explorer, the [canvg library](https://github.com/canvg/canvg) is required due to security error. This library is not  packaged with SimpleGraph and simply assumed loaded into global space. If canvg object is not found, function will simply error on IE.

* `pngName` (*string*) Default name to save png (".png" automatically appended if not already).

&nbsp; &nbsp;**Returns:** Self, for chaining functions.
