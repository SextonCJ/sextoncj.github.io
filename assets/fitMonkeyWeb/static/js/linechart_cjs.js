// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 60, left: 50},
    width = 550 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var parse_date = d3.timeParse("%m/%d/%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline1 = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.pushup); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.pullup); });

// define the 3rd line
var valueline3 = d3.line()
  .x(function(d) { return x(d.time); })
  .y(function(d) { return y(d.squat); });

// append the svg obgect to the body of the page
var svg = d3.select("#reps").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("static/data/output_reps.csv", function(data) {

  // format the data
  data.forEach(function(d)
    {
      d.time = parse_date(d.time);
      d.pushup = +d.pushup;
      d.pullup = +d.pullup;
      d.squat = +d.squat;
      return d;
    });

    console.log(data);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([0, d3.max(data, function(d) {
  	  return Math.max(d.pushup, d.pullup, d.squat); })]);

      // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "steelblue")
        .attr("d", valueline1);

    // Add the valueline2 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2);

    // Add the valueline3 path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline3);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
    	.attr("transform", "translate(" + (width-25) + "," + y(data[8].pushup) + ")")
    	.attr("dy", ".35em")
    	.attr("text-anchor", "start")
    	.style("fill", "steelblue")
    	.text("pushup");

    svg.append("text")
    	.attr("transform", "translate(" + (width-25) + "," + y(data[8].pullup+1.0) + ")")
    	.attr("dy", ".35em")
    	.attr("text-anchor", "start")
    	.style("fill", "red")
    	.text("pullup");

    svg.append("text")
      .attr("transform", "translate(" + (width-25) + "," + y(data[8].squat) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "green")
      .text("squat");

})
