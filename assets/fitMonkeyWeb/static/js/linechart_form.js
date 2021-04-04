// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 60, left: 50},
    width = 550 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var parse_date = d3.timeParse("%m/%d/%y");

// set the ranges
var x1 = d3.scaleTime().range([0, width]);
var y1= d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline4 = d3.line()
    .x(function(d) { return x1(d.time1); })
    .y(function(d) { return y1(d.pushup1); });

// define the 2nd line
var valueline5 = d3.line()
    .x(function(d) { return x1(d.time1); })
    .y(function(d) { return y1(d.pullup1); });

// define the 3rd line
var valueline6 = d3.line()
  .x(function(d) { return x1(d.time1); })
  .y(function(d) { return y1(d.squat1); });

// append the svg1 obgect to the body of the page
var svg1 = d3.select("#form").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data1
d3.csv("static/data/output_form.csv", function(data1) {

  // format the data1
  data1.forEach(function(d)
    {
      d.time1 = parse_date(d.time1);
      d.pushup1 = +d.pushup1;
      d.pullup1 = +d.pullup1;
      d.squat1 = +d.squat1;
      return d;
    });

    console.log(data1);

    // Scale the range of the data1
    x1.domain(d3.extent(data1, function(d) { return d.time1; }));
    y1.domain([0, 100]);

      // Add the valueline path.
    svg1.append("path")
        .data([data1])
        .attr("class", "line")
        .style("stroke", "steelblue")
        .attr("d", valueline4);

    // Add the valueline2 path.
    svg1.append("path")
        .data([data1])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline5);

    // Add the valueline3 path.
    svg1.append("path")
        .data([data1])
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline6);

    // Add the X Axis
    svg1.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x1));

    // Add the Y Axis
    svg1.append("g")
        .call(d3.axisLeft(y1));

    svg1.append("text")
    	.attr("transform", "translate(" + (10) + "," + y1(data1[8].pushup1) + ")")
    	.attr("dy", ".35em")
    	.attr("text-anchor", "start")
    	.style("fill", "steelblue")
    	.text("pushup1");

    svg1.append("text")
    	.attr("transform", "translate(" + (315) + "," + y1(data1[7].pullup1+3) + ")")
    	.attr("dy", ".35em")
    	.attr("text-anchor", "start")
    	.style("fill", "red")
    	.text("pullup1");

    svg1.append("text")
      .attr("transform", "translate(" + (width-25) + "," + y1(data1[8].squat1+3) + ")")
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "green")
      .text("squat1");

})
