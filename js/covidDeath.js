// const width = 960
// const height = 500

// const svg = d3.select('#root').append('svg')  
//   .attr('width', width)
//   .attr('height', height)
//   .append('g')

// const proj = d3.geoMercator()
//   .scale(width / 2 / Math.PI)
//   .translate([width / 2, height / 2])
//   .rotate([width/2, 0, 0]) 

// const path = d3.geoPath(proj)

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
  console.log(data)
}