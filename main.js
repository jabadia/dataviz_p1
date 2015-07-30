"use strict";

function zpad(m)
{
    if( m < 10 )
        return "0" + m;
    else
        return m;
}

function prepareData()
{
    // prepare data
    var monthlySeries = [];
    _.each(data_month, function(year_data)
    {
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        _.each(months, function(monthName, i)
        {
            var monthData = {
                year:      year_data.Year,
                month:     i+1,
                tempDelta: year_data[ monthName ]
            }
            monthData.label = monthData.year + "-" + zpad(monthData.month);

            if( _.isNumber(monthData.tempDelta) )
                monthlySeries.push(monthData);
        })

    });

    // console.log(data_area);
    return monthlySeries; //.slice(0,100);
}

function createChart(monthlySeries)
{
    var m = [20, 20, 30, 20],
        w = 960 - m[1] - m[3],
        h = 500 - m[0] - m[2];

    var svg = d3.select("#chart").append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
        ;

    var bars = svg.append('g').attr('class','bars');

    var key   = function(d) { return d.label;  };
    var value = function(d) { return d.tempDelta; };

    var labels = _.pluck(monthlySeries, 'label' );

    var x = d3.scale.ordinal()
        .domain( labels )
        .rangePoints([0,w]) //, .1)
        ;

    var y = d3.scale.linear()
        .domain([ d3.min(monthlySeries,value), d3.max(monthlySeries,value)])
        .range([0,h])
        ;    

    bars.selectAll('rect')
        .data(monthlySeries, key)
    .enter().append('line')
        .attr('x1', function(d) { return x(key(d)); })
        .attr('y1', function(d) { return h-y(value(d)); })
        .attr('x2', function(d) { return x(key(d)); })
        .attr('y2', function(d) { return h-y(0); })
        // .attr('width', x.rangeBand() )
        // .attr('height', "1px")
        ;
}

function main()
{   
    var monthlySeries = prepareData();
    createChart(monthlySeries);
}

main();
