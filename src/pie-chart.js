import {pie, arc} from 'd3-shape';
import {select} from 'd3-selection';

function processData(data, sex) {
  const counts = data
    .filter(d => {
      return d.sex === sex;
    })
    .reduce((acc, row) => {
      acc[row.survived] = (acc[row.survived] || 0) + 1;
      return acc;
    }, {});
  return Object.entries(counts).map(([survived, count]) => ({
    survived: survived === '1',
    count,
  }));
}

export default function pieChart(data) {
  // declare constants
  const height = 200;
  const width = 200;
  const state = {sex: 'male'};
  //   process data

  //   select container, makes element
  const div = select('.main-area')
    .append('div')
    .attr('class', 'flex-down');
  const dropDown = div
    .append('select')
    .on('change', function dropdownReaction(d) {
      state.sex = this.value;
      render();
    });
  dropDown
    .selectAll('option')
    .data(['male', 'female'])
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d);

  const legend = div.append('div').attr('class', 'legend');

  const rows = legend
    .selectAll('legend-row')
    .data([true, false])
    .enter()
    .append('div')
    .attr('class', 'legend-row flex');
  rows.append('div').attr('class', d => (d ? 'survived' : 'died'));
  rows.append('div').text(d => (d ? 'survived' : 'died big death'));

  const svg = div
    .append('svg')
    .attr('height', height)
    .attr('width', width);
  // centers pie chart
  const g = svg
    .append('g')
    .attr('transform', `translate(${height / 2}, ${width / 2})`);

  function render() {
    // make scale
    const arcs = pie().value(d => d.count)(processData(data, state.sex));
    const arcScale = arc()
      .innerRadius(0)
      .outerRadius(height / 3);

    const colors = ['red', 'green', 'blue'];
    //   actually render
    g.selectAll('.arc')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', d => arcScale(d))
      .attr('fill', (_, idx) => colors[idx]);
  }
  render();
}
