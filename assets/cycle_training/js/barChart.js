var my_viz_lib = my_viz_lib || {};

my_viz_lib.barWeeklyPlot = function() {

	var plot

	var margin = {top: 100, right: 180, bottom: 80, left: 80},
		width = 1060 - margin.left - margin.right,
		height = 550 - margin.top - margin.bottom;

	//For converting Dates to strings
	var formatTime = d3.timeFormat("%b-%d");

	var data = [];
	var data_ = function(_) {
		var that = this;
		if (!arguments.length) return data;
		data = _;
	return that;
	}

	var plot_ = function() {

		// Chart Colors
		var ATLColor = "red"
		var CTLColor = "#08abce"
		var annotationLineColor = "#80ef96"
		var annotationTextColor = "green"
		var barColor = "#ffa64d"

		//get start and end dates in data
		var startDate = d3.min(data, function(d) { return d.date; });
		var endDate = d3.max(data, function(d) { return d.date; });

		//Create scale functions
		var xBarScale = d3.scaleBand()
			.domain(data.map(function(d) { return d.date; }))
			.range([0, width])
			.paddingInner(0.1);;

		var xScale = d3.scaleTime()
			.domain([d3.timeDay.offset(startDate, -1),
			d3.timeDay.offset(endDate, +5)	])
			.range([0, width]);

		var y2Scale = d3.scaleLinear()
			.domain([ 0 , d3.max(data, function(d) { return d.sumDistance; }) ])
			.range([height, 0]);

		var yScale = d3.scaleLinear()
			.domain([ 0, d3.max(data, function(d) { return d.ATLEOW; })])
			.range([height, 0]);

		var cScale = d3.scaleThreshold()
			.domain([55, 65, 75, 85])
			.range(d3.schemeGreys[5]);

		var xAxis = d3.axisBottom()
			.scale(xBarScale)
			.ticks(34)
			.tickFormat(formatTime);

		var yAxis = d3.axisLeft()
			.scale(y2Scale)
			.ticks(10);

		var yRAxis = d3.axisRight()
			.scale(yScale)
			.ticks(10);

		// define the ATL and CTL lines
		var CTLLine = d3.line()
			.x(function (d) { return xScale(d.date) + 10; })
			.y(function (d) { return yScale(d.CTLEOW);});

		var ATLLine = d3.line()
			.x(function (d) { return xScale(d.date) + 10; })
			.y(function (d) { return yScale(d.ATLEOW); });

		//Create SVG element
		var svg = d3.select("body")
			.append("svg")
			.attr("id", "SVG1")
			.attr("width",	width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Generate Bars
		var barChart = svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", function(d) { return xBarScale(d.date); })
			.attr("y", function(d) { return y2Scale(d.sumDistance); } )
			.attr("width",	xBarScale.bandwidth())
			.attr("height", function(d) { return height - y2Scale(d.sumDistance); })
			.attr("fill", function(d) { return cScale(d.avgIF); })
			.on("mouseover", function(d, i) {
				updateBarChartDOW(d.id) // update Day of week bar chart
				d3.select(this).attr("fill", barColor)
					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = parseFloat(d3.select(this).attr("x"));
					var yPosition = parseFloat(d3.select(this).attr("y"))	+ height / 1.5;
				//Update the tooltip position and value
				d3.select("#tooltip")
					.style("left", xPosition + "px")
					.style("top", yPosition + "px")
					.html(
						"<table style='font-size: 10px; font-family: sans-serif;' >"+
						"<tr><td>Distance: </td><td>" + d.sumDistance + " km" + "</td></tr>"+
						"<tr><td>ATL: </td><td>" + d.ATLEOW + "</td></tr>"+
						"<tr><td>CTL: </td><td>" + d.CTLEOW + "</td></tr>"+
						"<tr><td>Intensity: </td><td>" + d.avgIF + "</td></tr>"+
						"<tr><td>Number of Rides: </td><td>" + d.countRides + "</td></tr>"+
						"</table>");
				//Show the tooltip
				d3.select("#tooltip").classed("hidden", false);
			}) // close on mouseover
			.on("mouseout", function() {
				//Hide the tooltip
				d3.select(this).attr("fill", function(d) { return cScale(d.avgIF); })
				d3.select("#tooltip").classed("hidden", true)
				updateBarChartDOW(0) // update Day of week bar chart so that shows empty values when not highlighted
			})

		// create lines in the bars as count of rides
		var lineChart = svg.selectAll("line")
			.data(data)
			.enter()
			.append("line")
			.attr("x1", function(d) { return xBarScale(d.date)+10; })
			.attr("x2", function(d) { return xBarScale(d.date)+10; })
			.attr("y1", height - 5)
			.attr("y2", function(d) { return yScale(d.countRides); } )
			.style("stroke", "black")
			.attr('stroke-width', 2);

		// Add the ATL path.
		svg.append("path")
			.data([data])
			.attr("class", "line")
			.attr("id", "ATLLine")
			.attr("d", ATLLine)
			.style("stroke", ATLColor)

		// toggle ATL Line
		svg.append("text")
			.attr("x", 0)
			.attr("y", -margin.top/3 )
			.style("fill", ATLColor)
			.attr("class", "lineText")
			.on("click", function(){
				var ATLActive	 = ATLLine.active ? false : true,
				newATLOpacity = ATLActive ? 1 : 0;
				d3.select("#ATLLine").style("opacity", newATLOpacity);
				ATLLine.active = ATLActive; })
			.text("Show Fatigue (ATL)");

		// Add the CTL path.
		svg.append("path")
			.data([data])
			.attr("class", "line")
			.attr("id", "CTLLine")
			.attr("d", CTLLine)
			.style("stroke", CTLColor)

		// toggle CTL Line
			svg.append("text")
			.attr("class", "lineText")
			.attr("x", 160)
			.attr("y", -margin.top/3 )
			.style("fill", CTLColor)
			.on("click", function(){
				var CTLActive	 = CTLLine.active ? false : true,
				newCTLOpacity = CTLActive ? 1 : 0;
				d3.select("#CTLLine").style("opacity", newCTLOpacity);
				CTLLine.active = CTLActive; })
			.text("Show Fitness (CTL)");

		//Create X axis
		svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + height + ")")
			.attr("id", "xAxis")
			.call(xAxis)
			.selectAll("text")
			.attr("dx", ".8em")
			.attr("dy", "-.55em")
			.attr("transform", "rotate(65)")
			.style("text-anchor", "start");

		// Create Left Y axis
		svg.append("g")
			.attr("class", "axis")
			.call(yAxis);

		// Left Y axis title
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0	-margin.left / 2)
			.attr("x",0 - (height / 2))
			.style("font-family", "arial, helvetica, sans-serif")
			.style("fill", "black")
			.style("font-size", "16px")
			.style("text-anchor", "middle")
			.text("Distance");

		//Create Right Y axis
			svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate( " + (width + 2)	+ ", 0 )")
			.call(yRAxis);

		svg.append("text")
			.attr("transform", "rotate(-270)")
			.attr("y", - (width + margin.right / 4) )
			.attr("x",0 + (height / 2))
			.style("font-family", "arial, helvetica, sans-serif")
			.style("fill", "black")
			.style("font-size", "16px")
			.style("text-anchor", "middle")
			.text("ATL / CTL");

		// Legend
		var g = svg.append("g")
				.attr("class", "legendThreshold")
				.attr("transform", "translate(20,20)");
		g.append("text")
				.attr("class", "legendCaption")
				.attr("x", 0)
				.attr("y", -6)
				.text("Intensity");
		var labels = ['0-54', '55-64', '65-74', '75-84', '85+'];
		var legend = d3.legendColor()
				.labels(function (d) { return labels[d.i]; })
				.shapePadding(0)
				.scale(cScale);
		svg.select(".legendThreshold")
				.call(legend);

		// Features of the annotation
		const annotations = [{
		note: {
			label: "Race Week",
			title: "",
			align: "left",
			wrap: 200, },
		connector: {
			end: "dot",
			lineType : "horizontal" },
		color: [annotationTextColor],
		x: 870,	y: 145, dy: -0, dx: 100 } ]
		// Add annotation to the chart
		const makeAnnotations = d3.annotation().annotations(annotations)
		d3.select("#SVG1").append("g").call(makeAnnotations)

		const annotations2 = [{
		note: {
			label: "Sickness from Overtraining",
			title: "",
			align: "left",
			wrap: 50, },
		connector: {
			end: "dot",
			lineType : "horizontal" },
		color: [annotationTextColor],
		x: 515,	y: 430, dy: -0, dx: 450 }]
		// Add annotation to the chart
		const makeAnnotations2 = d3.annotation().annotations(annotations2)
		d3.select("#SVG1").append("g").call(makeAnnotations2)

		const annotations3 = [{
		note: {
			label: "Sprint Training",
			title: "",
			align: "left",
			wrap: 50, },
		connector: {
		 end: "dot",
		 lineType : "horizontal" },
		color: [annotationTextColor],
		x: 680,	y: 290, dy: -0, dx: 310 }]
		// Add annotation to the chart
		const makeAnnotations3 = d3.annotation().annotations(annotations3)
		d3.select("#SVG1").append("g").call(makeAnnotations3)

		// Change style of annotations
		d3.select("#SVG1").selectAll(".connector")
			.attr('stroke', annotationLineColor)
			.style("stroke-dasharray", ("3, 3"))
		d3.select("#SVG1").selectAll(".connector-end")
			.attr('stroke', annotationLineColor)
			.attr('fill', annotationLineColor)

		// Chart Title
		 svg.append("text")
			.attr("x", margin.left)
			.attr("y", -margin.top /1.5)
			.attr("class","chartTitle")
			.attr("text-anchor", "middle")
			.text("Ride Distance (Km) by Week")

		// ***************** DOW WEEK CHART	*****************

		// transpose data for to get dow duration into rows
		var transposedData = [];
		const keep = ['id','sumDisMon', 'sumDisTue','sumDisWed','sumDisThu','sumDisFri','sumDisSat','sumDisSun'];
		const sliced = data.map(row => ['type', ...keep].reduce((acc, v) => ({ ...acc, [v]: row[v] }), {}));
		sliced.forEach(function(d) {
			for (var key in d) {
				var obj = {};
				if (key !== "id") {
					obj.day = key;
					obj.measure = d[key];
					obj.id = d.id;
					transposedData.push(obj)
				}
			}
		});

		// get max distance for axis scale
		var maxMeasure = d3.max(transposedData, function(d) { return d.measure; });

		// function to get the data based on passed in id
		function datasetBarChosen(id) {
			var ds = [];
			for (i in transposedData) {
				 if(transposedData[i].id==id){
					ds.push(transposedData[i]);
				 }
				}
			return ds.slice(1,8);
		}

    // second chart sizing
    var margin2 = {top: 40, right: 40, bottom: 80, left: 80},
      width2 = 720 - margin2.left - margin2.right,
      height2 = 350 - margin2.top - margin2.bottom;

		// initialize data to all zeros so chart shows empty when not selected
		function initializeDOWBarChartData() {
			initial_data = [ { "id": "1", "day": "SumDisSun", "measure": 0 },
											 { "id": "1", "day": "SumDisSat", "measure": 0 },
											 { "id": "1", "day": "SumDisFri", "measure": 0 },
											 { "id": "1", "day": "SumDisThu", "measure": 0 },
											 { "id": "1", "day": "SumDisWed", "measure": 0 },
											 { "id": "1", "day": "SumDisTue", "measure": 0 },
											 { "id": "1", "day": "SumDisMon", "measure": 0 } ];
			return initial_data }

		// function to create the DOW bar chart
		function	DOWBarChart() {

			var currentDatasetBarChart = initializeDOWBarChartData()

			var xScale = d3.scaleLinear()
				.domain([ 0 , maxMeasure ])
				.range([0, width2 / 3]);

			var yScale = d3.scaleBand()
					.domain(currentDatasetBarChart.map(function(d) { return d.day; }))
					.range([height2, 0])
					.padding(0.1);

			var yAxis = d3.axisLeft().scale(yScale)
					.tickFormat(d => (d.substr(6,9)));	//parse so that label shows day (e.g. Mon)

			var svg2 = d3.select("body")
				.append("svg")
				.attr("id", "SVG2")
				.attr("width",	width2 / 2.0)
				.attr("height", height2 + margin2.top + margin2.bottom)
				.append("g")
				.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

			var barChartDOW = svg2.selectAll("rect")
					.data(currentDatasetBarChart)
					.enter()
					.append("rect")
					.attr("width", function(d) { return xScale(d.measure); })
					.attr("y", function(d) { return yScale(d.day); } )
					.attr("height", yScale.bandwidth())
					.attr("fill", barColor)

			var barChartDOWText = svg2.selectAll("text")
				.data(currentDatasetBarChart)
				.enter()
				.append("text")
				.text(function(d){ return (d.measure); })
				.attr("x", function(d) {	return xScale(d.measure) + 2;})
				.attr("y", function(d) { return yScale(d.day) + margin2.right / 2; })
				.attr("class","axis")
				.style("fill", function(d) {return d.measure > 0 ? barColor : "white";});

			// Create Left Y axis
			svg2.append("g")
				.attr("class", "axis")
				.call(yAxis);

			// Title
			 svg2.append("text")
		 		.attr("x", (width2 /6))
		 		.attr("y", -margin2.top/2)
		 		.attr("class","chartTitle")
		 		.attr("text-anchor", "middle")
		 		.text("Ride Distance (Km) by Day")

		} // close DOW BarChart

		DOWBarChart(); // Run DOW bar Chart

// ****************************** UPDATE CHART *******************************************

		function updateBarChartDOW(id) {

			if (id == 0) {
				var currentDatasetBarChart = initializeDOWBarChartData()
			} else {
				var currentDatasetBarChart = datasetBarChosen(id).reverse() };

			var xScale = d3.scaleLinear()
				.domain([ 0 , maxMeasure ])
				.range([0, width2 / 3]);

			var yScale = d3.scaleBand()
					.domain(currentDatasetBarChart.map(function(d) { return d.day; }))
					.range([height2, 0])
					.padding(0.1);

			var yAxis = d3.axisLeft().scale(yScale)
				.tickFormat(d => (d.substr(6,9)));

			var svg2 = d3.select("#SVG2");

			var barChartDOW = svg2.selectAll("rect")
				 .data(currentDatasetBarChart)
				 .transition()
				 .duration(750)
				 .attr("width", function(d) { return xScale(d.measure); })
				 .attr("y", function(d) { return yScale(d.day); } )
				 .attr("height", yScale.bandwidth())
				 .attr("fill", barColor)

			 // bar labels
			 var barChartDOWText = svg2.selectAll("text")
				.data(currentDatasetBarChart)
				.transition().duration(750)
				.text(function(d){ return (d.measure); })
				.attr("x", function(d) {	return xScale(d.measure) + 2;})
				.attr("y", function(d) { return yScale(d.day) + margin2.right / 2; })
				.attr("class","axis")
				.style("fill", function(d) {return d.measure > 0 ? barColor : "white";});

		} // close updateBarChartDOW

	} // closing var _plot

	var public = {
		"plot": plot_,
		"data": data_,
	};

	return public;

}; // close my_viz_lib.barWeeklyPlot

//Load in the data
d3.csv("/assets/cycle_training/data/cycling_training_week.csv", function(error, data) {

	//For converting strings to Dates
	var parseTime = d3.timeParse("%m/%d/%Y");

	if (error) throw error;
	data.forEach(function(d) {
		d.id = parseInt(d.id);
		d.date = parseTime(d.date);
		d.CTLEOW = parseInt(d.CTLEOW);
		d.sumDistance = parseInt(d.sumDistance);
		d.avgIF = parseInt(d.avgIF);
		d.ATLEOW = parseInt(d.ATLEOW);
		d.cumDistance = parseInt(d.cumDistance);
		d.countRides = parseInt(d.countRides);
		d.sumDisMon = parseInt(d.sumDisMon);
		d.sumDisTue = parseInt(d.sumDisTue);
		d.sumDisWed = parseInt(d.sumDisWed);
		d.sumDisThu = parseInt(d.sumDisThu);
		d.sumDisFri = parseInt(d.sumDisFri);
		d.sumDisSat = parseInt(d.sumDisSat);
		d.sumDisSun = parseInt(d.sumDisSun);
	});

	var barWeeklyPlot1 = my_viz_lib.barWeeklyPlot();
	barWeeklyPlot1.data(data);
	barWeeklyPlot1.plot();

}); // close data function
