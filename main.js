"use strict";

function createChart()
{
    var m = [20, 20, 30, 20],
        w = 960 - m[1] - m[3],
        h = 500 - m[0] - m[2];

    var svg = d3.select("body").append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

}

createChart();