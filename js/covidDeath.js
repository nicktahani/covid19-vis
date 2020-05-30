const width = 980
const height = 700

const svg = d3.select('#root').append('svg')  
  .attr('width', width)
  .attr('height', height)
  .append('g')

const proj = d3.geoMercator()
  .scale(155)
  .center([0,40]) 
  .translate([width/2,height/3])

const path = d3.geoPath(proj)

const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')

d3.csv("/data/covid19-5_20.csv", d => {
  return {
    ...d,
    county: d.Admin2,
    region: d.Combined_Key,
    lat : +d.Lat,
    lng: +d.Long_,
  };
})
  .then(go)
  .catch(e => console.error(e))

function go(data) {
  const points = data.map(d => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [d.lng, d.lat]
      },
      properties: d
    }
  })

  const radius = d3.scaleSqrt()
    .domain([0, d3.max(points, d => d.properties.Deaths)])
    .range([5, 10])

  svg.selectAll('circle')
    .data(points)
  .enter().append('circle')
    .attr('cx', d => path.centroid(d)[0])
    .attr('cy', d => path.centroid(d)[1])
    .attr('r', d => radius(d.properties.Deaths))
    .style('fill', 'red')
    .style('opacity', 0.5)
    .on('mouseover', mouseover)
    .on('mouseout', mouseout)
  
}

function mouseover(d) {
  //TODO: styling for tooltips
  tooltip
    .style('position', 'absolute')
    .style('left', `${d3.event.pageX + 10}px`)
    .style('top', `${d3.event.pageY + 20}px`) 
    .style('display', 'inline')
    .style('background-color', '#fff')
    .style('color', '#000')
    .style('font-size', '0.75em')
    .html(`region (or county if US): ${d.properties.region} <br>
          deaths: ${d.properties.Deaths}`) //check data for other attributes to display
    // console.log(d.properties.region)
}

// function mouseout() {
//   tooltip
//     .style('display', 'none')
// }