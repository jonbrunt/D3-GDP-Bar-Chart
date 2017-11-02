function boxText(d) {
  let quarter = '';
  const dollars = d[1];
  const temp = d[0].split('-');
  let year = temp[0];
  if (temp[1] === '01') {
    quarter = '4th'; year = parseInt(year, 10) - 1;
  } else if (temp[1] === '04') {
    quarter = '1st';
  } else if (temp[1] === '07') {
    quarter = '2nd';
  } else quarter = '3rd';
  return `${quarter} Quarter ${year}, $${dollars.toFixed(2)}`;
}

function main(dataSet) {
  const width = 1300;
  const height = 600;
  const padding = 100;
  const barWidth = (width - (2 * padding)) / dataSet.length;

  const xScale = d3.scaleLinear()
    .domain([1946.75, 2015.5])
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataSet, d => d[1])])
    .range([height - padding, padding])
    .nice();

  const xAxis = d3.axisBottom(xScale)
    .tickValues([1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015])
    .tickFormat(d3.format('d'))
    .tickSize(5);

  const yAxis = d3.axisLeft(yScale)
    .tickSize(5);

  const svg = d3.select('#main')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .style('margin-left', `${-width / 2}px`)
    .classed('svg', true);

  const rectangles = svg.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', (d, i) => padding + (i * barWidth))
    .attr('y', d => yScale(d[1]))
    .attr('width', barWidth)
    .attr('height', d => ((height - padding) - yScale(d[1])))
    .classed('bars', true);

  rectangles.append('title')
    .text(d => boxText(d));

  svg.append('g')
    .attr('transform', `translate(0, ${(height - padding)})`)
    .classed('info', true)
    .call(xAxis);

  svg.append('g')
    .attr('transform', `translate(${padding}, 0)`)
    .classed('info', true)
    .call(yAxis);

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', padding)
    .classed('info', true)
    .style('font-size', '2em')
    .style('text-anchor', 'middle')
    .text('US GROSS DOMESTIC PRODUCT / QUARTER');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('dy', padding / 3)
    .classed('info', true)
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .text('US Dollars (Billions)');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - (padding / 2.2))
    .classed('info', true)
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .text('Year');

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - (padding / 6))
    .classed('info', true)
    .style('font-size', '0.8em')
    .style('letter-spacing', '1px')
    .style('text-anchor', 'middle')
    .text('Design & Development By Jonathan M. Brunt | 2017 | Data Courtesy of Federal Reserve Economic Data');
}

const makeRequest = async () => {
  const dataSet = [];
  await $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', (results) => {
    for (let i = 0; i < results.data.length; i += 1) {
      dataSet.push(results.data[i]);
    }
  });
  main(dataSet);
};

document.addEventListener('DOMContentLoaded', makeRequest());
