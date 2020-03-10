import { select } from "d3-selection";
import { scaleLog, scaleSqrt, scaleOrdinal, scaleLinear } from "d3-scale";
import { axisLeft, axisBottom } from "d3-axis";
import { transition } from "d3-transition";
import d3Tip from "d3-tip";

export default function scatterplot(data, article) {
  const years = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
  const sizes = ["All", "Large", "Medium", "Small"];

  const height = 700;
  const width = 900;
  const sizeMax = 30;
  const margin = { top: 50, right: 200, bottom: 100, left: 50 };

  const state = {
    xyear: 2018,
    yyear: 2019,
    size: "All"
  };

  var xText = select(".xtext").text(article[state.xyear]);
  var yText = select(".ytext").text(article[state.yyear]);

  var xLabel =
    "Homicides per 100k inhabitants (" + state.xyear.toString() + ")";
  var yLabel =
    "Homicides per 100k inhabitants (" + state.yyear.toString() + ")";
  const sizeLabel = "Population(" + state.yyear.toString() + ")";
  var yhom = "homrate" + state.yyear.toString();
  var xhom = "homrate" + state.xyear.toString();

  if (state.yyear < 2015) {
    var ypop = "pop2010";
  } else {
    var ypop = "pop" + state.yyear.toString();
  }

  function filterData() {
    var newData = data.filter(function(d) {
      if (state.size === "Large") {
        return d[ypop] >= 100000 && d[yhom] > 1 && d[xhom] > 1;
      } else if (state.size === "Medium") {
        return (
          d[ypop] >= 25000 && d[ypop] < 100000 && d[yhom] > 1 && d[xhom] > 1
        );
      } else if (state.size === "Small") {
        return d[ypop] < 25000 && d[yhom] > 1 && d[xhom] > 1;
      } else {
        return d[yhom] > 1 && d[xhom] > 1;
      }
    });
    return newData;
  }

  function update() {
    xLabel = "Homicides per 100k inhabitants (" + state.xyear.toString() + ")";
    yLabel = "Homicides per 100k inhabitants (" + state.yyear.toString() + ")";
    yhom = "homrate" + state.yyear.toString();
    xhom = "homrate" + state.xyear.toString();
    if (state.yyear < 2015) {
      var ypop = "pop2010";
    } else {
      var ypop = "pop" + state.yyear.toString();
    }
  }

  function updateTip() {
    var tip = d3Tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return (
          "<strong>Municipality:</strong> <span style='color:black'>" +
          d.municipality +
          "</br>" +
          "<strong>State:</strong> <span style='color:black'>" +
          d.state +
          "</span>" +
          "</br>" +
          "<strong>" +
          state.xyear.toString() +
          " homicide rate:" +
          "</strong> <span style='color:black'>" +
          Number(d[xhom]).toFixed(2) +
          "</span>" +
          "</br>" +
          "<strong>" +
          state.yyear.toString() +
          " homicide rate:" +
          "</strong> <span style='color:black'>" +
          Number(d[yhom]).toFixed(2) +
          "</span>" +
          "</br>" +
          "<strong>" +
          state.yyear.toString() +
          " population:" +
          "</strong> <span style='color:black'>" +
          d[ypop] +
          "</span>"
        );
      });
  }

  var filteredData = filterData();

  const dropDownTextX = select(".drop-down")
    .append("text")
    .attr("class", "drop-down-label")
    .style("text-anchor", "middle")
    .text("X-axis year");

  const dropDownX = select(".drop-down")
    .append("select")
    .attr("class", "menu")
    .on("change", function dropdownReaction(d) {
      state.xyear = this.value;
      update();
      var filteredData = filterData();

      var xLabels = svg.selectAll(".xlabel").data([xLabel]);
      var xText = select(".xtext").text(article[state.xyear]);

      xLabels
        .enter()
        .append("text")
        .attr("class", "xlabel")
        .style("text-anchor", "middle")
        .merge(xLabels)
        .attr("transform", `translate(${width / 2}, ${height - 30})`)
        .text(d => {
          return d;
        });
      updateTip();

      g.selectAll("circle")
        .data(filteredData, d => d.key)
        .transition()
        .duration(1000)
        .attr("cx", d => xScale(xValue(d)))
        .attr("cy", d => yScale(yValue(d)))
        .attr("r", d => sizeScale(sizeValue(d)))
        .attr("fill", d => colorScale(d.region))
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    });

  dropDownX
    .selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d)
    .property("selected", function(d) {
      return d === state.xyear;
    });

  const dropDownTextY = select(".drop-down")
    .append("text")
    .attr("class", "drop-down-label")
    .style("text-anchor", "middle")
    .text("Y-axis year");

  const dropDownY = select(".drop-down")
    .append("select")
    .attr("class", "menu")
    .on("change", function dropdownReaction(d) {
      state.yyear = this.value;
      update();
      var filteredData = filterData();
      var yText = select(".ytext").text(article[state.yyear]);

      var yLabels = svg.selectAll(".ylabel").data([yLabel]);
      yLabels
        .enter()
        .append("text")
        .attr("class", "xlabel")
        .style("text-anchor", "middle")
        .merge(yLabels)
        .attr(
          "transform",
          `translate(${margin.left - 10}, ${innerHeight / 2 +
            margin.top}) rotate(270)`
        )
        .text(d => {
          return d;
        });
      updateTip();

      g.selectAll("circle")
        .data(filteredData, d => d.key)
        .transition()
        .duration(1000)
        .attr("cx", d => xScale(xValue(d)))
        .attr("cy", d => yScale(yValue(d)))
        .attr("r", d => sizeScale(sizeValue(d)))
        .attr("fill", d => colorScale(d.region))
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    });

  dropDownY
    .selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d)
    .property("selected", function(d) {
      return d === state.yyear;
    });

  const dropDownTextS = select(".drop-down")
    .append("text")
    .attr("class", "drop-down-label")
    .style("text-anchor", "middle")
    .text("Municipality size");

  const dropDownSize = select(".drop-down")
    .append("select")
    .attr("class", "menu")
    .on("change", function dropdownReaction(d) {
      state.size = this.value;

      var filteredData = filterData();
      updateTip();

      var circles = g.selectAll("circle").data(filteredData, d => d.key);
      circles.exit().remove();

      circles
        .enter()
        .append("circle")
        .attr("r", 5)
        .merge(circles)
        .attr("class", "circle")
        .attr("cx", d => xScale(xValue(d)))
        .attr("cy", d => yScale(yValue(d)))
        .attr("r", d => sizeScale(sizeValue(d)))
        .attr("fill", d => colorScale(d.region))
        .attr("opacity", 0.5)
        .attr("transform", `translate(${margin.left}, 0)`)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    });

  dropDownSize
    .selectAll("option")
    .data(sizes)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  const svg = select(".plot-area")
    .append("svg")
    .attr("class", "flex-down")
    .attr("height", height)
    .attr("width", width);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = scaleLog()
    .base(2)
    .range([0, innerWidth]);
  const yScale = scaleLog()
    .base(2)
    .range([innerHeight, 0]);
  const sizeScale = scaleSqrt().range([0, sizeMax]);

  const colorDomain = Array.from(
    data.reduce((acc, row) => acc.add(row.region), new Set())
  );

  const colorRange = ["#88a2b1", "#ca9a4f", "#10868d", "#855191", "#135a90"];
  const colorScale = scaleOrdinal(colorDomain).range(colorRange);

  const xAxis = axisBottom().scale(xScale);

  const yAxis = axisLeft()
    .scale(yScale)
    .tickPadding(10);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const xAxisG = g
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left}, ${innerHeight})`);
  const yAxisG = g
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left}, 0)`);

  const xValue = d => d[xhom];
  const yValue = d => d[yhom];
  var sizeValue = d => d[ypop];

  xScale.domain([1, 256]).nice();
  yScale.domain([1, 256]).nice();
  sizeScale.domain([0, 1848954]);

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
    .attr("transform", `translate(${margin.left}, 0)`);

  var tip = d3Tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {
      return (
        "<strong>Municipality:</strong> <span style='color:black'>" +
        d.municipality +
        "</br>" +
        "<strong>State:</strong> <span style='color:black'>" +
        d.state +
        "</span>" +
        "</br>" +
        "<strong>" +
        state.xyear.toString() +
        " homicide rate:" +
        "</strong> <span style='color:black'>" +
        Number(d[xhom]).toFixed(2) +
        "</span>" +
        "</br>" +
        "<strong>" +
        state.yyear.toString() +
        " homicide rate:" +
        "</strong> <span style='color:black'>" +
        Number(d[yhom]).toFixed(2) +
        "</span>" +
        "</br>" +
        "<strong>" +
        state.yyear.toString() +
        " population:" +
        "</strong> <span style='color:black'>" +
        d[ypop] +
        "</span>"
      );
    });

  var circles = g.selectAll("circle").data(filteredData, d => d.key);
  circles.exit().remove();

  circles
    .enter()
    .append("circle")
    .attr("r", 5)
    .merge(circles)
    .attr("class", "circle")
    .attr("cx", d => xScale(xValue(d)))
    .attr("cy", d => yScale(yValue(d)))
    .attr("r", d => sizeScale(sizeValue(d)))
    .attr("fill", d => colorScale(d.region))
    .attr("opacity", 0.5)
    .attr("transform", `translate(${margin.left}, 0)`)
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  g.call(tip);

  var xLabels = svg.selectAll(".xlabel").data([xLabel]);

  xLabels
    .enter()
    .append("text")
    .attr("class", "xlabel")
    .style("text-anchor", "middle")
    .merge(xLabels)
    .attr("transform", `translate(${width / 2}, ${height - 30})`)
    .text(d => {
      return d;
    });

  var yLabels = svg.selectAll(".ylabel").data([yLabel]);

  yLabels
    .enter()
    .append("text")
    .attr("class", "ylabel")
    .style("text-anchor", "middle")
    .merge(yLabels)
    .attr(
      "transform",
      `translate(${margin.left - 10}, ${innerHeight / 2 +
        margin.top}) rotate(270)`
    )
    .text(d => {
      return d;
    });

  const legendHeight = 120;

  const legendY = scaleLinear()
    .domain([0, colorDomain.length])
    .range([0, legendHeight]);

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${innerWidth + 130}, ${margin.top})`);

  legend
    .append("text")
    .attr("class", "legend-title")
    .attr("transform", `translate(0, 50)`)
    .text("Region");

  // add the rects
  legend
    .selectAll(".legend-circle")
    .data(colorDomain)
    .enter()
    .append("circle")
    .attr("class", "legend-circle")
    .attr("r", d => 10)
    .attr("cx", 0)
    .attr("cy", (_, i) => legendY(i) + 72)
    .attr("fill", d => colorScale(d));

  legend
    .selectAll(".legend-text")
    .data(colorDomain)
    .enter()
    .append("text")
    .attr("class", "legend-text")
    .attr("x", 20)
    .attr("y", (_, i) => legendY(i) + 72)
    .attr("fill", "black")
    .attr("alignment-baseline", "central")
    .text(d => d);

  const legendS = svg
    .append("g")
    .attr("class", "legendS")
    .attr("transform", `translate(${innerWidth + 130}, ${margin.top + 150})`);

  legendS
    .append("text")
    .attr("class", "legend-title")
    .attr("transform", `translate(0, 100)`)
    .text("Population");

  const legendYS = scaleLinear()
    .domain([0, 1, 2])
    .range([0, 40]);

  legendS
    .selectAll(".legend-circle")
    .data([10000, 100000, 1000000])
    .enter()
    .append("circle")
    .attr("class", "legend-circle")
    .attr("r", d => sizeScale(d))
    .attr("cx", 0)
    .attr("cy", (_, i) => legendYS(i) + 120)
    .attr("fill", "black");

  legendS
    .selectAll(".legendS-text")
    .data(["10,000", "100,000", "1,000,000"])
    .enter()
    .append("text")
    .attr("class", "legend-text")
    .attr("x", 35)
    .attr("y", (_, i) => legendYS(i) + 128)
    .attr("fill", "black")
    .text(d => d);
}

// Sources:
// https://bl.ocks.org/curran/ffcf1dac1f301cf7ec7559fa729b647f
//
