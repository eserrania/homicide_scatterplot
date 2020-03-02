import {circle} from 'd3-shape';
import {select} from 'd3-selection';
import {scaleLog, scaleSqrt} from 'd3-scale';
import {axisLeft, axisBottom} from 'd3-axis';
import {extent, max} from 'd3-array';
import {format} from 'd3-format';

export default function scatterplot(data, xyear, yyear) {
    console.log(data)
    const yhom = 'homrate' +  yyear.toString();
    const xhom = 'homrate' +  xyear.toString();

    if (yyear < 2015) {
        var ypop = 'pop2010';
    } else {
        var ypop = 'pop' + yyear.toString();
    }

    const filteredData = data.filter(function(d) {
        return d[ypop] > 0 && d[yhom] > 0 && d[xhom] > 0;
    });

    const xValue = d => d.homrate2018;
    const yValue = d => d.homrate2019;
    const sizeValue = d => d.pop2018;
    const height = 700;
    const width = 1000;
    const sizeMax = 8;
    const xLabel = "Homicides per 100k inhabitants (" + xyear.toString() + ')';
    const yLabel = "Homicides per 100k inhabitants (" + yyear.toString() + ')';
    const sizeLabel = "Population("  + yyear.toString() + ')';

    const margin = {top: 30, right: 30, bottom: 100, left: 100};
    
    const svg = select('.plot-area')
    .append('svg')
    .attr('class', 'flex-down')
    .attr('height', height)
    .attr('width', width);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = scaleLog().range([0, innerWidth]);
    const yScale = scaleLog().range([innerHeight,0]);
    const sizeScale = scaleSqrt()
      .range([0, sizeMax]);
    
    const xAxis = axisBottom()
      .scale(xScale)

    const yAxis = axisLeft()
      .scale(yScale)
      .tickSizeInner(-innerWidth)
      .tickPadding(10);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const xAxisG = g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`);
    const yAxisG = g.append("g")
      .attr("class", "axis");

    function render(){
        xScale
            .domain([1, 300])
            .nice();
        yScale
            .domain([1, 300])
            .nice();
        sizeScale
            .domain([0, max(filteredData, sizeValue)]);
        
        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
        
        const circles = g.selectAll("circle").data(filteredData);
        circles.exit().remove();
        circles
            .enter().append("circle")
            .attr("r", 5)
            .merge(circles)
            .attr("cx", d => xScale(xValue(d)))
            .attr("cy", d => yScale(yValue(d)))
            .attr("r", d => sizeScale(sizeValue(d)))
            .attr('opacity', 0.7)       
            .classed('west',  d => d.region === 'West')
            .classed('nw', d => d.region === 'Northwest')
            .classed('ne', d => d.region === 'Northeast')
            .classed('central', d => d.region === 'Central')
            .classed('se', d => d.region === 'Southeast');
        
        
        const axisLabelOffset = 30;
        circles
            .append("g")
            .call(axisBottom(xScale))
            .append("text")
            .attr("transform", `translate(${width / 2}, ${-axisLabelOffset})`)
            .attr("fill", "black")
            .text(xLabel);
        
        circles
            .append("g")
            .attr("transform", `translate(${innerWidth})`)
            .call(axisLeft(yScale))
            //   axis label
            .append("text")
            .attr(
                "transform",
                `translate(${axisLabelOffset}, ${innerHeight / 2}) rotate(90) `
            )
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .text(yLabel);
    }

    render();
}

// Sources: 
// https://bl.ocks.org/curran/ffcf1dac1f301cf7ec7559fa729b647f
//