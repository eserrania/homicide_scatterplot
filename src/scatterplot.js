import {circle} from 'd3-shape';
import {select} from 'd3-selection';
import {scaleLog, scaleSqrt, scaleOrdinal, scaleLinear} from 'd3-scale';
import {axisLeft, axisBottom} from 'd3-axis';
import {format} from 'd3-format'

export default function scatterplot(data) {

    const state = {
        xyear: 2018,
        yyear: 2019,
        size: 'Large'
    };

    const years = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];

   
    const height = 700;
    const width = 900;
    const sizeMax = 30;

    const margin = {top: 50, right: 200, bottom: 100, left: 50};
    
    const svg = select('.plot-area')
        .append('svg')
        .attr('class', 'flex-down')
        .attr('height', height)
        .attr('width', width);
    

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = scaleLog().base(2).range([0, innerWidth]);
    const yScale = scaleLog().base(2).range([innerHeight,0]);
    const sizeScale = scaleSqrt()
        .range([0, sizeMax]);

    const colorDomain = Array.from(
        data.reduce((acc, row) => acc.add(row.region), new Set())
    );

    const colorRange = ['#88a2b1', '#ca9a4f', '#10868d', '#855191', '#135a90']
    const colorScale = scaleOrdinal(colorDomain).range(colorRange);

    const xAxis = axisBottom()
      .scale(xScale)

    const yAxis = axisLeft()
      .scale(yScale)
      .tickPadding(10);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xAxisG = g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left}, ${innerHeight})`);
    const yAxisG = g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left}, 0)`);
      ;

    function render(){
        const xLabel = "Homicides per 100k inhabitants (" + state.xyear.toString() + ')';
        const yLabel = "Homicides per 100k inhabitants (" + state.yyear.toString() + ')';
        const sizeLabel = "Population("  + state.yyear.toString() + ')';
        const yhom = 'homrate' +  state.yyear.toString();
        const xhom = 'homrate' +  state.xyear.toString();

        if (state.yyear < 2015) {
            var ypop = 'pop2010';
        } else {
            var ypop = 'pop' + state.yyear.toString();
        }
    
        var filteredData = data.filter(function(d) {
            return d[ypop] > 100000 && d[yhom] > 1 && d[xhom] > 1;
        });
    
        const xValue = d => d[xhom];
        const yValue = d => d[yhom];
        const sizeValue = d => d[ypop];

        xScale
            .domain([1, 256])
            .nice();
        yScale
            .domain([1, 256])
            .nice();
        sizeScale
            .domain([0,1848954]);
        
        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        g.append("line")
        .attr("x1", xScale(1))
        .attr("y1", yScale(1))
        .attr("x2", xScale(256))
        .attr("y2", yScale(256))
        .attr("stroke-width", 2.5)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5")
        .attr("transform", `translate(${margin.left}, 0)`)       
        ;
        
        const circles = g.selectAll("circle").data(filteredData);
        circles.exit().remove();
        circles.enter().append("circle")
            .attr("r", 5)
            .merge(circles)
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
            .attr("r", d => sizeScale(sizeValue(d)))
            .attr("fill", d => colorScale(d.region))
            .attr('opacity', 0.7)
            .attr("transform", `translate(${margin.left}, 0)`)       
            .classed('west',  d => d.region === 'West')
            .classed('nw', d => d.region === 'Northwest')
            .classed('ne', d => d.region === 'Northeast')
            .classed('central', d => d.region === 'Central')
            .classed('se', d => d.region === 'Southeast');
       
        svg.append("text")
            .style("text-anchor", "middle")
            .attr("transform", `translate(${width/2}, ${height - 30})`)
            .text(xLabel)
            .attr('class', 'xlabel');
        svg.append("text")
            .style("text-anchor", "middle")
            .attr("transform", `translate(${margin.left - 10}, ${innerHeight/2 + margin.top}) rotate(270)`)
            .text(yLabel)
            .attr('class', 'ylabel');

        const legendHeight = 120;
        const boxHeight = 20;
        const boxWidth = 20;
        const legendY = scaleLinear()
            .domain([0, colorDomain.length])
            .range([0, legendHeight]);
        const legend = svg
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${innerWidth + 130}, ${margin.top})`);

        // add the rects
        legend
            .selectAll(".legend-box")
            .data(colorDomain)
            .enter()
            .append("rect")
            .attr("class", "legend-box")
            .attr("x", 0)
            .attr("y", (_, i) => legendY(i))
            .attr("height", boxHeight)
            .attr("width", boxWidth)
            .attr("fill", d => colorScale(d));

        legend
            .selectAll(".legend-text")
            .data(colorDomain)
            .enter()
            .append("text")
            .attr("class", "legend-text")
            .attr("x", boxWidth * 1.5)
            .attr("y", (_, i) => legendY(i) + boxHeight / 2)
            .attr("fill", "black")
            .attr("alignment-baseline", "central")
            .text(d => d);
    
        const legendS = svg
            .selectAll(".legend-size")
            .append("g")
            .attr("class", 'legendS')
            .attr("transform", `translate(${innerWidth + 130}, ${margin.top + 50})`);
        
        const  legendYS = scaleLinear()
            .domain([10000, 100000, 1000000])
            .range([0, legendHeight]);

        legendS
            .selectAll(".legend-circle")
            .data([10000, 100000, 1000000])
            .enter()
            .append("circle")
            .attr("class", "legend-circle")
            .attr("r", d => sizeScale(d))
            .attr("cx", boxWidth * 1.5)
            .attr("cy", (_, i) => legendYS(i) + boxHeight / 2)
            .attr("fill", 'black');
        
        legendS
            .selectAll(".legendS-text")
            .data([10000, 100000, 1000000])
            .enter()
            .append("text")
            .attr("class", "legendS-text")
            .attr("x", 10)
            .attr("y", (_, i) => legendYS(i) + boxHeight / 2)
            .attr("fill", "black")
            .text(d => d);
                    
    }

    render();

    const dropDown = svg
        .append('select')
        .on('change', function dropdownReaction(d) {
        state.xyear = this.value;
        render();
        });

    dropDown
        .selectAll('option')
        .data(years)
        .enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d);
}


// Sources: 
// https://bl.ocks.org/curran/ffcf1dac1f301cf7ec7559fa729b647f
//