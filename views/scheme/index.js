< script src = "http://d3js.org/d3.v3.min.js" > </script>
< script > var width = 700,
  height = 450,
  radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal().range([
  "#255aee",
  "#3a6fff",
  "#4f84ff",
  "rgb(101,154,302)",
  "rgb(122,175,323)",
  "rgb(144,197,345)",
  "rgb(165,218,366)"
]);

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height).append("g")

d3.csv("data.csv", function(error, data) {
  var pyramid = d3.pyramid().size([width, height]).value(function(d) {
    return d.population;
  });

  var line = d3.svg.line().interpolate('linear-closed').x(function(d, i) {
    return d.x;
  }).y(function(d, i) {
    return d.y;
  });

  var g = svg.selectAll(".pyramid-group").data(pyramid(data)).enter().append("g").attr("class", "pyramid-group");

  g.append("path").attr("d", function(d) {
    return line(d.coordinates);
  }).style("fill", function(d) {
    return color(d.region);
  });

  g.append("text").attr({
    "y": function(d, i) {
      if (d.coordinates.length === 4) {
        return (((d.coordinates[0].y - d.coordinates[1].y) / 2) + d.coordinates[1].y) + 5;
      } else {
        return (d.coordinates[0].y + d.coordinates[1].y) / 2 + 10;
      }
    },
    "x": function(d, i) {
      return width / 2;
    }
  }).style("text-anchor", "middle").text(function(d) {
    return d.region;
  });

  d3.select("body").append("table").attr({
    "id": "footer",
    "width": width + "px"
  })

  d3.select("body #footer").append("tr").attr({"class": "PykCharts-credits", "id": "credit-datasource"}).append("td").style("text-align", "left").html("<span style='pointer-events:none;'>Credits: </span><a href='http://pykcharts.com' target='_blank'>" +
    "Pykcharts" +
    "</a>");

});
</script>
