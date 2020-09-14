----------

# API #

----------

* [Constructor](#constructor)
* [Properties](#properties)
* [Misc. functions](./misc.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Color category functions](./color.md)
* [Adding and manipulating data](./data.md)
* [Drawing data onto the graph](./draw.md)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)


## Constructor ##

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
