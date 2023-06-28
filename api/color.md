# API & Guide #

* [Constructor, properties, and misc. functions](./README.md)
* [Axis, grid, and legend](./axis-grid-legend.md)
* [Adding and getting data](./add-data.md)
* [Removing and updating data](./mod-data.md)
* [Drawing data onto the graph](./draw.md)
* **Color and point shape**
  * [getColorBySeriesName](#a-getcolorseriesbyname)
  * [resetColorScale](#a-resetcolorscale)
  * [setSeriesColor](#a-setseriescolor)
  * [removeSeriesColor](#a-removeseriescolor)
  * [setPointSeriesShape](#a-setpointseriesshape)
  * [getPointSeriesShape](#a-getpointseriesshape)
* [Adding interactive features](./interactivity.md)
* [Definitions](./defs.md)

## Color category functions ##

Color handling is handled at two levels. At the bottom (the default) is the a [D3 color scale](https://github.com/d3/d3-scale-chromatic) (created in constructor, defaulting to `d3.scaleOrdinal(d3.schemeCategory10)`). You can manipulate this directly via the member variable `sg.color` or [`resetColorScale()`](#a-resetcolorscale). Above this, is a simple dictionary mapping of manually set color matchings by series names, which can be added and removed via [`setSeriesColor()`](#a-setseriescolor) and [`removeSeriesColor()`](#a-removeseriescolor). These levels never interact directly, SimpleGraph simply checks the dictionary mapping first, then if no match is found, defaults to the underlying D3 color scale.

Colors are based on series names, which must be provided with all data added to the SimpleGraph instance (see [adding and manipulating data](./add-data.md)).

<a name="a-getcolorbyseriesname" href="#a-getcolorbyseriesname">#</a> *SimpleGraph*.**getColorBySeriesName**(*name*, *create*)

Get the color or style related to a data series. Attempts to return the style first, but failing that will return the color string. Note that colors will not be assigned to a data series until drawn, thus data series that do exist but haven't been drawn yet may not return a color.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name.</td>
    </tr>
    <tr>
      <td>create</td><td>boolean</td><td>If true, creates color in colorScale if color is not yet assigned. If false or left undefined, color is only returned if one has been assigned to the data series name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Color value, or null.

<a name="a-resetcolorscale" href="#a-resetcolorscale">#</a> *SimpleGraph*.**resetColorScale**(*colorScale*)

Reset domain on color scale, or replace with provided.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>colorScale</td><td>d3.colorScale</td><td>Color scale to replace with or null.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-setseriescolor" href="#a-setseriescolor">#</a> *SimpleGraph*.**setSeriesColor**(*series*, *color*)

Sets a custom color (overriding the color scale) for a given series name.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name.</td>
    </tr>
    <tr>
      <td>color</td><td>string|function</td><td>The color value or callback function that returns a color value as string. Function will be provided the data object. However, for the legend, this parameter will be null, so be sure the callback returns a valid value if null parameter.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="a-removeseriescolor" href="#a-removeseriescolor">#</a> *SimpleGraph*.**removeSeriesColor**(*series*)

Remove custom color for series name.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The series name.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

## Point shapes ##

By default, points will be drawn as circles, but other shapes may be provided. As the legend needs to be consistent by data series, shapes must be set for the entire data series. Setting a shape in the options when adding point data (using any of the functions from the previous subsection), will override any existing shape specified for the entire data series.

<a name="a-setpointseriesshape" href="#a-setpointseriesshape">#</a> *SimpleGraph*.**setPointSeriesShape**(*series*, *shape*)

Get the shape assigned to a data series.

Supported shapes are:

* **circle**
* **diamond**
* **square**
* **triangle**
* **triangle-up** (same as triangle)
* **triangle-down**

Point shape changes will have to be redrawn to propagate changes. 

Point shape changes may not work well with draw-updates. It is recommended to change the shapes first with an instant draw, then proceed with updates and draw-update calls, if required, to animation their positional changes.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
      <td>shape</td><td>string</td><td>The shape of the data series.</td>
    </tr>
  </tbody>
</table>

<a name="a-getpointseriesshape" href="#a-getpointseriesshape">#</a> *SimpleGraph*.**getPointSeriesShape**(*series*)

Get the shape assigned to a data series.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>series</td><td>string</td><td>The name of the data series.</td>
    </tr>
  </tbody>
</table>