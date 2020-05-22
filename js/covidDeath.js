const width = 980
const height = 700

const svg = d3.select('#root').append('svg')  
  .attr('width', width)
  .attr('height', height)
  .append('g')

const proj = d3.geoMercator()
  .scale(155)
  .center([0,40]) 
  .translate([width/2,height/2])

const path = d3.geoPath(proj)

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

const tooltip = d3.select('#tooltip').append('div') 
function mouseover(d) {
  tooltip
    .style('display', 'inline')
    .html(`region (or county if US): ${d.properties.region} <br>
          hi`)
    console.log(d.properties.region)
}

// function mouseout() {
//   tooltip
//     .style('display', 'none')
// }