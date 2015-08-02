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
    var yearly_data = [];
    _.each(data_month, function(year_data)
    {
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        _.each(months, function(monthName, i)
        {
            var monthData = {
                year:      year_data.Year,
                month:     i+1,
                tempDelta: year_data[ monthName ] / 10.0
            }
            monthData.label = monthData.year + "-" + zpad(monthData.month);

            if( _.isNumber(monthData.tempDelta) )
                monthlySeries.push(monthData);
        });

        var areaForYear = _.find(data_area, {Year: year_data.Year}) || {};

        var yearData = {
            label:     year_data.Year,
            year:      year_data.Year,
            tempDelta: year_data['J-D'] / 10.0,

            "Glob": areaForYear["Glob"] / 10.0,
            "NHem": areaForYear["NHem"] / 10.0,
            "SHem": areaForYear["SHem"] / 10.0,
            "24N-90N": areaForYear["24N-90N"] / 10.0,
            "24S-24N": areaForYear["24S-24N"] / 10.0,
            "90S-24S": areaForYear["90S-24S"] / 10.0,
        };
        if( _.isNumber(yearData.tempDelta))
            yearly_data.push( yearData );
    });

    // console.log(data_area);
    return {
        monthly: monthlySeries,
        yearly: yearly_data
    }; //.slice(0,100);
}

function createChart(id, yearly_data, series)
{
    var m = [20, 20, 40, 40],   // trbl
        w = 960 - m[1] - m[3],
        h = 400 - m[0] - m[2];

    var svg = d3.select(id).append("svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
      .append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
        ;

    var bars = svg.append('g').attr('class','bars');

    var key   = function(d) { return d.label;  };
    var value = function(d) { return d.tempDelta; };

    var labels = _.pluck(yearly_data, 'label' );

    var x = d3.scale.ordinal()
        .domain( labels )
        .rangePoints([0,w]) //, .1)
        ;


    var maxValue = d3.max( [Math.abs(d3.min(yearly_data,value)), Math.abs(d3.max(yearly_data,value)) ]);
    console.log(maxValue);

    var y = d3.scale.linear()
        .domain([ -maxValue, maxValue ])
        .range([0,h])
        ;    

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickValues(_.filter(labels, function(y) { return y % 10 == 0; }))

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat(d3.format(".1f"))
        .orient('left');

    svg.append('g')
        .attr('class','axis')
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    svg.append('g')
        .attr('class','axis')
        .call(yAxis);

    svg.append('g')
        .attr('class','axis')
        .append('line')
        .attr('class','zero-line')
        .attr('x1', 0)
        .attr('y1', h-y(0))
        .attr('x2', w)
        .attr('y2', h-y(0))
        .attr("stroke-dasharray","2,2");


    var yearlyLine = function(serie)
    {
        return d3.svg.line()
            .x(function(d) { return x(key(d)); })
            .y(function(d) { return h-y(d[serie]);})
            ;
    };
    
    svg.selectAll('path.serie')
        .data(series)
    .enter().append('path')
        .attr('class', function(serie) { return 'serie ' + serie; })
        .attr('d', function(serie) { return yearlyLine(serie.name)(yearly_data); })
        .attr('fill', 'none')
        .attr('stroke-width', '1.5px')
        .attr('stroke', function(serie) { return serie.color; })

    // bars.selectAll('rect')
    //     .data(yearly_data, key)
    // .enter().append('line')
    //     .attr('x1', function(d) { return x(key(d)); })
    //     .attr('y1', function(d) { return h-y(value(d)); })
    //     .attr('x2', function(d) { return x(key(d)); })
    //     .attr('y2', function(d) { return h-y(0); })
    //     // .attr('width', x.rangeBand() )
    //     // .attr('height', "1px")
    //     ;
}

function main()
{   
    var series = prepareData();
    createChart('#chart1', series.yearly, [{name:'tempDelta', color: '#6b6ecf'}]);
    createChart('#chart2', series.yearly, [
        { name:'Glob', color: "#9467bd"},
        { name:'NHem', color: "#ff7f0e"},
        { name:'SHem', color: "#1f77b4"}
    ]);
}

main();
