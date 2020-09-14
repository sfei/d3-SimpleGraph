<a name="api-sg-functions-color-category"></a>
## Color/Category Functions ##

<a name="api-sg-getColorBySeriesName"></a>
**`SimpleGraph.getColorBySeriesName(name, create)`** : Get the color or style related to a data series. Attempts to return the style first, but failing that will return the color string. Note that colors will not be assigned to a data series until drawn, thus data series that do exist but haven't been drawn yet may not return a color.

<table>
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

<a name="api-sg-resetColorScale"></a>
**`SimpleGraph.resetColorScale(colorScale)`** : Reset domain on color scale, or replace with provided.

<table>
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

<a name="api-sg-setSeriesColor"></a>
**`SimpleGraph.setSeriesColor(series, color)`** : Sets a custom color (overriding the color scale) for a given series name.

<table>
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

<a name="api-sg-removeSeriesColor"></a>
**`SimpleGraph.removeSeriesColor(series)`** : Remove custom color for series name.

<table>
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