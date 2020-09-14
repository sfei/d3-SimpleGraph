## Misc. functions ##

#### Get functions ####

<a name="getSvgElement">#</a> *sg*.**getSvgElement**()

Returns D3 wrapper for SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `sg.svg`

<a name="getSvgGraphic">#</a> *sg*.**getSvgGraphic**()

Returns D3 wrapper for graphic node in SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `sg.svgGraph`

#### Remove and destroy ####

<a name="remove">#</a> *sg*.**remove()**

Removes SVG node from container.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="destory">#</a> **`SimpleGraph.destroy()`**

Removes and destroys SVG and this object. Irreversible.

#### Saving the graph ####

<a name="saveAsPng">#</a> *sg*.**saveAsPng**(*pngName*)

Save graph as a PNG. Note, in non-Edge Internet Explorer, the [canvg library](https://github.com/canvg/canvg) is required due to security error. This library is not  packaged with SimpleGraph and simply assumed loaded into global space. If canvg object is not found, function will simply error on IE.

* `pngName` (*string*) Default name to save png (".png" automatically appended if not already).

&nbsp; &nbsp;**Returns:** Self, for chaining functions.
