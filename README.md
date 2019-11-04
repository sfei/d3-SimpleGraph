----------

# D3-SimpleGraph #

----------

D3-SimpleGraph is an abstraction of the D3 library for quickly creating and adding functionality of basic, 2-dimensional plots.

**Lawrence Sim** -- lawrences@sfei.org  
**San Francisco Estuary Institute** -- 2019

## License ##

This project is licensed under the GNU Lesser General Public License. See [LICENSE](LICENSE) for full details.

## Usage ##

D3 v4.0 or greater is required for this library to work. [https://d3js.org](https://d3js.org)

Simply import `d3.simplegraph.min.js` to your application.

Library is configured for import via CommonJS based API (e.g. NodeJS), AMD-based API (e.g. RequireJS), or simply regular instantiation.

## API ##

**[Constructor](#constructor)**  
**[Properties](#properties)**  
**[Misc. Functions](#misc-functions)**  
&nbsp; &nbsp; *[getSvgElement](#sg-get-svg-element)*  
&nbsp; &nbsp; *[getSvgGraphic](#sg-get-svg-graphic)*  
&nbsp; &nbsp; *[remove](#sg-remove)*  
&nbsp; &nbsp; *[destroy](#sg-destroy)*  
**[Axis, Grid, and Legend Functions](axis-grid-and-legend-functions)**  
&nbsp; &nbsp; *[resetAxisOptions](#sg-reset-axis-options)*  
&nbsp; &nbsp; *[drawAxes](#sg-draw-axes)*  
&nbsp; &nbsp; *[drawGrid](#sg-draw-grid)*  
&nbsp; &nbsp; *[removeGrid](#sg-remove-grid)*  
&nbsp; &nbsp; *[drawLegend](#sg-draw-legend)*  
**[Color and Category Functions](#color-and-category-functions)**  
&nbsp; &nbsp; *[getColorBySeriesName](#sg-get-color-series-by-name)*  
&nbsp; &nbsp; *[resetColorScale](#sg-reset-color-scale)*  
&nbsp; &nbsp; *[setSeriesColor](#sg-set-series-color)*  
&nbsp; &nbsp; *[removeSeriesColor](#sg-remove-series-color)*  
**[Add Data Functions](#add-data-functions)**  
&nbsp; &nbsp; *[addPointData](#sg-add-point-data)*  
&nbsp; &nbsp; *[addPointsData](#sg-add-points-data)*  
&nbsp; &nbsp; *[addPointsDataAsArray](#sg-add-points-data-as-array)*  
&nbsp; &nbsp; *[addLineDataAsCoordinates](#sg-add-line-data-as-coordinates)*  
&nbsp; &nbsp; *[addLineDataAsFunction](#sg-add-line-data-as-function)*  
&nbsp; &nbsp; *[addLinesDataFromPoints](#sg-add-line-data-from-points)*  
&nbsp; &nbsp; *[addAreaBetweenTwoLines](#sg-add-area-between-two-lines)*  
&nbsp; &nbsp; *[addAreaAsCoordinates](#sg-area-as-coordinates)*  
**[Remove Data Functions]("#remove-data-functions)**  
&nbsp; &nbsp; *[clearPointsData](#sg-clear-points-data)*  
&nbsp; &nbsp; *[clearLinesData](#sg-clear-lines-data)*  
&nbsp; &nbsp; *[clearAreasData](#sg-clear-areas-data)*  
&nbsp; &nbsp; *[clearAllData](#sg-clear-all-data)*  
**[Additional Data Functions](#additional-data-functions)**  
&nbsp; &nbsp; *[getPointsDataBySeries](#sg-get-points-data-by-series)*  
&nbsp; &nbsp; *[getPointCoordinatesBySeries](#sg-get-point-coordinates-by-series)*  
&nbsp; &nbsp; *[getLinesDataBySeries](#sg-get-line-data-by-series)*  
&nbsp; &nbsp; *[getAreasDataBySeries](#sg-get-area-data-by-series)*  
**[Draw Data Functions](#draw-data-functions)**  
&nbsp; &nbsp; *[drawPoints](#sg-draw-points)*  
&nbsp; &nbsp; *[drawLines](#sg-draw-lines)*  
&nbsp; &nbsp; *[drawAreas](#sg-draw-areas)*  
**[Remove From Graph Functions](#remove-from-graph-functions)**  
&nbsp; &nbsp; *[removePoints](#sg-remove-points)*  
&nbsp; &nbsp; *[removeLines](#sg-remove-lines)*  
&nbsp; &nbsp; *[removeAreas](#sg-remove-areas)*  
&nbsp; &nbsp; *[removeAll](#sg-remove-all)*  
**[Tooltip Functions](#tooltip-functions)**  
&nbsp; &nbsp; *[addTooltipToPoints](#sg-add-tooltip-to-points)*  
&nbsp; &nbsp; *[addTooltipToLines](#sg-add-tooltip-to-lines)*  
&nbsp; &nbsp; *[addTooltipToAreas](#sg-add-tooltip-to-areas)*  
**[Highlight Functions](#highlight-functions)**  
&nbsp; &nbsp; *[highlightPoints](#sg-highlight-points)*  
&nbsp; &nbsp; *[removeHighlightPoints](#sg-remove-highlights-points)*  
&nbsp; &nbsp; *[removeHighlights](#sg-remove-highlights)*  
**[Save Graph Functions](#save-graph-functions)**  
&nbsp; &nbsp; *[saveAsPng](#sg-save-as-png)*   
**[Definitions](#definitions)**  
&nbsp; &nbsp; [Axis options](#axis-options)  
&nbsp; &nbsp; [Point data](#point-data)  
&nbsp; &nbsp; [Line data](#line-data)  
&nbsp; &nbsp; [Area data](#area-data)  
&nbsp; &nbsp; [Tooltip text function](#tooltip-text-function)  

## Tutorials ##

Tutorials are provided as HTML pages where one can following along by copying the code into the browser's dev console for a live demonstration.

Clone/download copy of repo for tutorials as these will not work as is viewed on GitHub.

1. [Basic usage and introduction](tutorials/simplegraph-1.html). [*tutorials/simplegraph-1.html*]
2. [Advanced functionality](tutorials/simplegraph-2.html). [*tutorials/simplegraph-2.html*]
