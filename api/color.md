## Color category functions ##

Color handling is handled via two layers. At the bottom (the default), the a [D3 color scale](https://github.com/d3/d3-scale-chromatic) (created in constructor, defaulting to `d3.scaleOrdinal(d3.schemeCategory10)`). You can manipulate this directly via the member variable `sg.color`. Above this, you may set overriding values via [setSeriesColor](#setSeriesColor)().

Colors are based on series names, which must be provided with all data added to the SimpleGraph instance (see [adding and manipulating data](./data.md)).

<a name="getColorBySeriesName">#</a> *sg*.**getColorBySeriesName**(*name*, *create*)

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

<a name="resetColorScale">#</a> *sg*.**resetColorScale**(*colorScale*)

Reset domain on color scale, or replace with provided.

<table style="font-size:0.9em;">
  </tbody>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
    <tr>
      <td>colorScale</td><td>d3.colorScale</td><td>olor scale to replace with or null.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="setSeriesColor">#</a> *sg*.**setSeriesColor**(*series*, *color*)

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
      <td>color</td><td>string</td><td>The color value.</td>
    </tr>
  </tbody>
</table>

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="removeSeriesColor">#</a> *sg*.**removeSeriesColor**(*series*)

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