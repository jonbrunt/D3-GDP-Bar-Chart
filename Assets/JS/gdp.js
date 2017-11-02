// returns edited/arranged Quarter/Year/Dollars from dataSet, for tooltip
function boxText(data) {
  let quarter = '';
  const dollars = data[1]; // assigns GDP number
  // temporary constant for obtaining full date and split to isolate year
  const temp = data[0].split('-');
  //  assigns year
  let year = temp[0];
  // assigns quarter based on numerical month of data presentation
  if (temp[1] === '01') {
    // reassigns year to previus year if info presented in Jan
    quarter = '4th'; year = parseInt(year, 10) - 1;
  } else if (temp[1] === '04') {
    quarter = '1st';
  } else if (temp[1] === '07') {
    quarter = '2nd';
  } else quarter = '3rd';
  return `${quarter} Quarter ${year}, $${dollars.toFixed(2)}`;
}
// main function of program, using D3 to create bar chart
function main(dataSet) {
  const width = 1300; // svg width
  const height = 600; // svg height
  const padding = 100; // padding for aesthetics
  const barWidth = (width - (2 * padding)) / dataSet.length;
  // creates x scale based on start and end year of data
  const xScale = d3.scaleLinear()
    // decimals used for precision of bar location verus ticks for years
    .domain([1946.75, 2015.5])
    .range([padding, width - padding]); // accounts for padding
  // creates y scale from 0 to 20,000 based on GDP in billions
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataSet, d => d[1])])
    .range([height - padding, padding]) // accounts for padding
    .nice(); // used for aesthetics of axis labeling
  // sets up x axis, manually entering the tick values for desired effect
  const xAxis = d3.axisBottom(xScale)
    .tickValues([1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995,
      2000, 2005, 2010, 2015])
    .tickFormat(d3.format('d')) // used to prevent commas in numerical labels
    .tickSize(5); // reduces tick size from default
  // sets up y axis
  const yAxis = d3.axisLeft(yScale)
    .tickSize(5); // reduces tick size from default
  // appends svg with predetermined attributes to #main div
  const svg = d3.select('#main')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    // adds responsive negative margin to center svg based on CSS left: 50%
    .style('margin-left', `${-width / 2}px`)
    .classed('svg', true); // see CSS
  // appends svg rectangles for data points to svg
  const rectangles = svg.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    // sets responsive x, y, etc based on standards for unspaced bar chart
    .attr('x', (d, i) => padding + (i * barWidth))
    .attr('y', d => yScale(d[1]))
    .attr('width', barWidth)
    .attr('height', d => ((height - padding) - yScale(d[1])))
    .classed('bars', true);
  // appends tooltip to rectangles, calling boxText for appropriate data
  rectangles.append('title')
    .text(d => boxText(d));
  // calls and appropriately places x axis
  svg.append('g')
    // translation to move axis down
    .attr('transform', `translate(0, ${(height - padding)})`)
    .classed('info', true)
    .call(xAxis);
  // calls and appropriately places y axis
  svg.append('g')
    // translation to move axis to the right
    .attr('transform', `translate(${padding}, 0)`)
    .classed('info', true)
    .call(yAxis);
  // title
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', padding)
    .classed('info', true)
    .style('font-size', '2em')
    .style('text-anchor', 'middle')
    .text('US GROSS DOMESTIC PRODUCT / QUARTER');
  // y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('dy', padding / 3)
    .classed('info', true)
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .text('US Dollars (Billions)');
  // x axis label
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - (padding / 2.2))
    .classed('info', true)
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .text('Year');
  // footer text
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - (padding / 6))
    .classed('info', true)
    .style('font-size', '0.8em')
    .style('letter-spacing', '1px')
    .style('text-anchor', 'middle')
    .text('Design & Development By Jonathan M. Brunt | 2017 | Data Courtesy of Federal Reserve Economic Data');
}
// AJAX
const makeRequest = async () => {
  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  const dataSet = [];
  await $.getJSON(url, (results) => {
    // pushes desired data to dataSet
    for (let i = 0; i < results.data.length; i += 1) {
      dataSet.push(results.data[i]);
    }
  });
  main(dataSet); // calls main function passing in data
};
// initialization on page load
document.addEventListener('DOMContentLoaded', makeRequest());
