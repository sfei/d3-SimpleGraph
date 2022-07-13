----------

# D3-SimpleGraph #

----------

D3-SimpleGraph is an abstraction of the D3 library for quickly creating and adding functionality of basic, 2-dimensional plots.

**Lawrence Sim** -- lawrences@sfei.org  
**San Francisco Estuary Institute** -- 2022

## License ##

This project is licensed under the GNU Lesser General Public License. See [LICENSE](LICENSE) for full details.

## Usage ##

D3 v4.0 or greater is required for this library to work. [https://d3js.org](https://d3js.org)

Simply import `d3.simplegraph.min.js` to your application.

Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation.

## API ##

**[Constructor](API.md#constructor)**  
**[Properties](API.md#properties)**  
**[Misc. Functions](API.md#misc-functions)**  
&nbsp; &nbsp; *[getSvgElement](API.md#sg-get-svg-element)*  
&nbsp; &nbsp; *[getSvgGraphic](API.md#sg-get-svg-graphic)*  
&nbsp; &nbsp; *[remove](API.md#sg-remove)*  
&nbsp; &nbsp; *[destroy](API.md#sg-destroy)*  
**[Axis, Grid, and Legend Functions](axis-grid-and-legend-functions)**  
&nbsp; &nbsp; *[resetAxisOptions](API.md#sg-reset-axis-options)*  
&nbsp; &nbsp; *[drawAxes](API.md#sg-draw-axes)*  
&nbsp; &nbsp; *[drawGrid](API.md#sg-draw-grid)*  
&nbsp; &nbsp; *[removeGrid](API.md#sg-remove-grid)*  
&nbsp; &nbsp; *[drawLegend](API.md#sg-draw-legend)*  
**[Color and Category Functions](API.md#color-and-category-functions)**  
&nbsp; &nbsp; *[getColorBySeriesName](API.md#sg-get-color-series-by-name)*  
&nbsp; &nbsp; *[resetColorScale](API.md#sg-reset-color-scale)*  
&nbsp; &nbsp; *[setSeriesColor](API.md#sg-set-series-color)*  
&nbsp; &nbsp; *[removeSeriesColor](API.md#sg-remove-series-color)*  
**[Add Data Functions](API.md#add-data-functions)**  
&nbsp; &nbsp; *[addPointData](API.md#sg-add-point-data)*  
&nbsp; &nbsp; *[addPointsData](API.md#sg-add-points-data)*  
&nbsp; &nbsp; *[addPointsDataAsArray](API.md#sg-add-points-data-as-array)*  
&nbsp; &nbsp; *[addLineDataAsCoordinates](API.md#sg-add-line-data-as-coordinates)*  
&nbsp; &nbsp; *[addLineDataAsFunction](API.md#sg-add-line-data-as-function)*  
&nbsp; &nbsp; *[addLinesDataFromPoints](API.md#sg-add-line-data-from-points)*  
&nbsp; &nbsp; *[addAreaBetweenTwoLines](API.md#sg-add-area-between-two-lines)*  
&nbsp; &nbsp; *[addAreaAsCoordinates](API.md#sg-area-as-coordinates)*  
**[Remove Data Functions]("#remove-data-functions)**  
&nbsp; &nbsp; *[clearPointsData](API.md#sg-clear-points-data)*  
&nbsp; &nbsp; *[clearLinesData](API.md#sg-clear-lines-data)*  
&nbsp; &nbsp; *[clearAreasData](API.md#sg-clear-areas-data)*  
&nbsp; &nbsp; *[clearAllData](API.md#sg-clear-all-data)*  
**[Additional Data Functions](API.md#additional-data-functions)**  
&nbsp; &nbsp; *[getPointsDataBySeries](API.md#sg-get-points-data-by-series)*  
&nbsp; &nbsp; *[getPointCoordinatesBySeries](API.md#sg-get-point-coordinates-by-series)*  
&nbsp; &nbsp; *[getLinesDataBySeries](API.md#sg-get-line-data-by-series)*  
&nbsp; &nbsp; *[getAreasDataBySeries](API.md#sg-get-area-data-by-series)*  
**[Draw Data Functions](API.md#draw-data-functions)**  
&nbsp; &nbsp; *[drawPoints](API.md#sg-draw-points)*  
&nbsp; &nbsp; *[drawLines](API.md#sg-draw-lines)*  
&nbsp; &nbsp; *[drawAreas](API.md#sg-draw-areas)*  
**[Remove From Graph Functions](API.md#remove-from-graph-functions)**  
&nbsp; &nbsp; *[removePoints](API.md#sg-remove-points)*  
&nbsp; &nbsp; *[removeLines](API.md#sg-remove-lines)*  
&nbsp; &nbsp; *[removeAreas](API.md#sg-remove-areas)*  
&nbsp; &nbsp; *[removeAll](API.md#sg-remove-all)*  
**[Tooltip Functions](API.md#tooltip-functions)**  
&nbsp; &nbsp; *[addTooltipToPoints](API.md#sg-add-tooltip-to-points)*  
&nbsp; &nbsp; *[addTooltipToLines](API.md#sg-add-tooltip-to-lines)*  
&nbsp; &nbsp; *[addTooltipToAreas](API.md#sg-add-tooltip-to-areas)*  
**[Highlight Functions](API.md#highlight-functions)**  
&nbsp; &nbsp; *[highlightPoints](API.md#sg-highlight-points)*  
&nbsp; &nbsp; *[removeHighlightPoints](API.md#sg-remove-highlights-points)*  
&nbsp; &nbsp; *[removeHighlights](API.md#sg-remove-highlights)*  
**[Save Graph Functions](API.md#save-graph-functions)**  
&nbsp; &nbsp; *[saveAsPng](API.md#sg-save-as-png)*   
**[Definitions](API.md#definitions)**  
&nbsp; &nbsp; [Axis options](API.md#axis-options)  
&nbsp; &nbsp; [Point data](API.md#point-data)  
&nbsp; &nbsp; [Line data](API.md#line-data)  
&nbsp; &nbsp; [Area data](API.md#area-data)  
&nbsp; &nbsp; [Tooltip text function](API.md#tooltip-text-function)  

## Tutorials ##

Tutorials are provided as HTML pages where one can following along by copying the code into the browser's dev console for a live demonstration.

Clone/download copy of repo for tutorials as these will not work as is viewed on GitHub.

1. [Basic usage and introduction](tutorials/simplegraph-1.html). [*tutorials/simplegraph-1.html*]
2. [Advanced functionality](tutorials/simplegraph-2.html). [*tutorials/simplegraph-2.html*]
