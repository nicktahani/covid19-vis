const width = 960
const height = 500

const svg = d3.select('#root').append('svg')  
  .attr('width', width)
  .attr('height', height)
  .append('g')

const proj = d3.geoMercator()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2])
  .rotate([width/2, 0, 0]) 

const path = d3.geoPath(proj)

d3.csv("/data/covid19-5_20.csv", d => {
  return {
    ...d,
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
        coordinates: [+d.Lat, +d.Long_]
      },
      properties: d
    }
  })

  svg.selectAll('circle')
    .data(points)
  .enter().append('circle')
    .attr('cx', d => path.centroid(d)[0])
    .attr('cy', d => path.centroid(d)[1])
    .attr('r', 2.5)
    .style('fill', 'red')
    .style('opacity', 0.5)
  
}