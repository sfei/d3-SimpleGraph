## Misc. Functions ##

<a name="api-sg-getSvgElement"></a>
**`SimpleGraph.getSvgElement()`** : Returns D3 wrapper for SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `SimpleGraph.svg`

<a name="api-sg-getSvgGraphic"></a>
**`SimpleGraph.getSvgGraphic()`** : Returns D3 wrapper for graphic node in SVG node.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** `SimpleGraph.svgGraph`

<a name="api-sg-remove"></a>
**`SimpleGraph.remove()`** : Removes SVG node from container.

&nbsp; &nbsp; &nbsp; &nbsp;**Returns:** Self, for chaining functions.

<a name="api-sg-destory"></a>
**`SimpleGraph.destroy()`** : Removes and destroys SVG and this object. Irreversible.

<a name="api-sg-functions-save-graph"></a>

<a name="sg-save-as-png" href="#sg-save-as-png">#</a> *sg*.**saveAsPng**(*pngName*)

Save graph as a PNG. Note, in non-Edge Internet Explorer, the [canvg library](https://github.com/canvg/canvg) is required due to security error. This library is not  packaged with SimpleGraph and simply assumed loaded into global space. If canvg object is not found, function will simply error on IE.

* `pngName` (*string*) Default name to save png (".png" automatically appended if not already).

&nbsp; &nbsp;**Returns:** Self, for chaining functions.