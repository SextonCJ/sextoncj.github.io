

/////////////////////////////////////////////////////////////////////////
///  GDI PARALLEL AXES CHART WITH SELECTABLE LINES AND COUNTRIES
///  With thanks to shashank2104 for the example of how to handle the 
///  brushes:
///  https://bl.ocks.org/shashank2104/92bed39893773d085794be54b73c233e/56b1c0df3fa1579c6a6f60ef9f660e99901af935
/////////////////////////////////////////////////////////////////////////


// Create namespace for GDI chart:
var gdi =  gdi || {};

// Constants for the svg and bars
gdi.height = 500; // maximum height of the plotting area for bars
gdi.width = 800;   // maximum width  of the plotting area for chart
// gdi.visibleWidth = 400; //width of visible chart 
// gdi.axisWidth = 50;
// gdi.brushWidth = 16;

// set margins around the plot area.
gdi.margin = { top: 20, bottom: 50, left: 40, right: 10};





gdi.years = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
			 "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019" ];

// console.log(Continents)
gdi.continentColours = d3.scaleOrdinal(d3.schemeSet1).domain(Continents);
gdi.countryColours = {};

// Data Ranges and Scales
gdi.minYear = 2000;
gdi.maxYear = 2019;
// var yearRange = maxYear - minYear
gdi.minDisparity = -105;
gdi.maxDisparity = 105;

// create an array with the values of the tickmarks
// on the chart so we can add the horizontal reference
// lines to the svg that contains the bars

gdi.x = d3.scaleLinear()
		.domain([2000, 2019])
		.range([0, gdi.width - gdi.margin.right]);

gdi.y = d3.scaleLinear()
		.domain([gdi.minDisparity, gdi.maxDisparity])
		.range([gdi.height, 0]);

gdi.centerPos = gdi.y(0);

gdi.axis = d3.axisLeft();

// Set up the tooltip object as an HTML div 
gdi.tooltip = d3.select("#gdiArea").append("div")	
	.attr("class", "tooltip")
	.style("width", "110px")
	.style("height", "60px")
	.style("padding", "2px")		
	.style("font", "14px sans-serif")
	.style("text-align", "center")
	.style("color", "white")
	.style("background", "darkblue")
	.style("border-radius", "8px")
	.style("visibility", "hidden")
	.style("position", "absolute")
	;



gdi.chart = d3.select("#gdiArea")
	.append("svg")
	.attr("class", "gdi.chart")
	.attr("width", gdi.width + gdi.margin.left + gdi.margin.right)
	.attr("height", gdi.height + gdi.margin.top + gdi.margin.bottom)
	.append("g")
	.attr("float", "left")
	// avoids having to add the margins to the svg coordinates
	.attr("transform", "translate(" + gdi.margin.left + "," + gdi.margin.top + ")");
  ;

// Add the y axis and labels

gdi.yAxis = d3.axisLeft(gdi.y)
	.tickFormat(d3.format("d")) // removes commas and decimals
	.tickSize(-gdi.width)
	;

gdi.chart.append("g")
	.attr("class", "gdi.leftAxis")
	.call(gdi.yAxis)
	;

gdi.chart.append("text")
	.attr("class","axisLabel")
	.attr("transform",
		"translate( -26 ," + (gdi.height /2) + ") rotate(-90)")
	.attr("text-anchor", "middle")
	.text("GDI")
	;

// Add heavier horizontal line at GDI=0
gdi.chart.append("line")
    .style("stroke", "black") 
    .attr("x1", 0)
    .attr("y1", gdi.centerPos)
    .attr("x2", gdi.width)
    .attr("y2", gdi.centerPos)
    ;


// Add the x axis and labels

gdi.xAxis = d3.axisBottom(gdi.x)
	.ticks(gdi.years.length)
	.tickFormat(d3.format("d"))  // removes commas and decimals
	;

gdi.chart.append("g")
	.attr("class", "gdi.bottomAxis")
	.attr("transform",
		"translate( 0, " + (gdi.height) + ")")
	.call(gdi.xAxis)
	;

gdi.chart.append("text")
	.attr("class","axisLabel")
	.attr("transform",
		"translate(" + (gdi.width / 2) + "," + (gdi.height + 40) + ")")
	.attr("text-anchor", "middle")
	.text("Year")
	;

gdi.buttons = d3.select("#gdiButtonContainer")
				.append("div")
				.attr("id", "gdiButtons")
				;

gdi.messageContainer = d3.select("#gdiMessageContainer");

gdi.path_by_country = {};


// Called from d3.csv in SDGWorld.js to initialize the GDI portions
gdi.init = function(data) {	

	// console.log(data);

	for(i=0; i<data.length; i++) {
		if (!(data[i]["Country"] in gdi.path_by_country) ) {
			// the country is not in the dictionary
			// Add entry with empty dictionary with only
			// the country name in it
			gdi.path_by_country[data[i]["Country"]] = { "country": data[i]["Country"],
														 "continent": data[i]["Continent"],
														 "region": data[i]["Region"],
														 "points": [] };
		}


		// Add data point only if there is information to show
		if( validNumber( data[i]["Gender Disparity Index (Calculated)"] )) {
			gdi.path_by_country[data[i]["Country"]]["points"]
				.push(  [data[i]["Year"],
						 data[i]["Gender Disparity Index (Calculated)"] ]);
		}
	};

	// console.log(gdi.path_by_country)
	
	// Fill the chart and initialize the button list
	gdi.render(Object.values(gdi.path_by_country));
	gdi.listInitialize(Object.values(gdi.path_by_country));



};

// Functions to replace spaces with underscores
// and remove any other invalid characters
gdi.cssId = function(string, suffix) {
	return string.replace(/ /g,"_").replace(/[^_0-9a-zA-Z]/g,"") + suffix
}

// Functions to get the IDs of the buttons, and various versions of the lines
// from the country names
gdi.buttonId					= function(string) { return gdi.cssId(string,"-BTN");};
gdi.continentButtonId			= function(string) { return gdi.cssId(string,"-CB"); };
gdi.backgroundLineId			= function(string) { return gdi.cssId(string,"-BL"); };
gdi.hoverLineId					= function(string) { return gdi.cssId(string,"-HL"); };
gdi.glowLineId					= function(string) { return gdi.cssId(string,"-GL"); };
gdi.mouseOverSelectedLineId		= function(string) { return gdi.cssId(string,"-SL"); };


// Function to show the selected line for the passed country
gdi.mouseOverSelect = function(country)  {

	// Show the selected line
	d3.select("#" + gdi.mouseOverSelectedLineId(country))
		.style("opacity", 1)
		;

	// Highlight the button selected by filling it in, and
	// setting the text to white and bold
	d3.select("#" + gdi.buttonId(country))
		.style("background-color", gdi.continentColours(d["continent"]) )
		.style("color", "white")
		;
}

// Function to hide the selected line for the passed country
gdi.mouseOffDeSelect = function(country) {
	
	d3.select("#" + gdi.mouseOverSelectedLineId(country))
		.style("opacity", 0)
		;

	// Return the button to its original pale grey with coloured border
	d3.select("#" + gdi.buttonId(country))
		.style("background-color", "#eee")
		.style("color", "black")
		;
}


// Funtion that returns true if the country is already click-selected

gdi.isClickSelected = function(country) {
	return d3.select("#" + gdi.mouseOverSelectedLineId(country))
				.classed("gdiSelected");
}

gdi.mouseReset = function() {
	
	// reset country buttons and lines
	for (i=0; i < gdi.allCountries.length; i++) {
		country = gdi.allCountries[i];
		d3.select("#" + gdi.mouseOverSelectedLineId(country))
			.classed("gdiSelected", false);
		gdi.mouseOffDeSelect( country );
	}

	// reset the continent buttons
	for (i=0; i < Object.keys(gdi.countriesByContinent).length; i++) {
		continent = Object.keys(gdi.countriesByContinent)[i];
		d3.select("#" + gdi.continentButtonId(continent))
			.classed("gdiSelected", false)
			.style("background-color", "white")
			.style("color", "black")
		;

	}
}

// Function used on-click to toggle the "switch on" of a particular
// country so the line does not disappear on mouseoff.
// The class "gdiSelected" on the path object indicates the on/off state
gdi.mouseClickSelect = function(country) {

	// Get the selected line for the country to check selection state:

	// First determine if the country in question is already selected
	if (gdi.isClickSelected(country)) {
		// console.log( country + " is already selected - deselecting" );
		d3.select("#" + gdi.mouseOverSelectedLineId(country))
			.classed("gdiSelected", false);
		gdi.mouseOffDeSelect( country );
	}
	else {
		// console.log( country + " is not already selected - selecting" );
		d3.select("#" + gdi.mouseOverSelectedLineId(country))
			.classed("gdiSelected", true);
		gdi.mouseOverSelect( country );		
	}

}

gdi.continentClickSelect = function(continent) {

	// First determine if the continent in question is already selected
	if (d3.select("#" + gdi.continentButtonId(continent)).classed("gdiSelected")) {
		// console.log( continent + " is already selected - deselecting" );

		// Deselect each country in the continent
		for ( i=0; i < gdi.countriesByContinent[continent].length; i++){
			country = gdi.countriesByContinent[continent][i];
			d3.select("#" + gdi.mouseOverSelectedLineId(country))
				.classed("gdiSelected", false);
			gdi.mouseOffDeSelect( country );
		}

		// Deselect the continent and reset background and font colours
		d3.select("#" + gdi.continentButtonId(continent))
			.classed("gdiSelected", false)
			.style("background-color", "white")
			.style("color", "black")
		;
	}
	else {
		
		// select each country in the continent
		for ( i=0; i < gdi.countriesByContinent[continent].length; i++){
			country = gdi.countriesByContinent[continent][i];
			d3.select("#" + gdi.mouseOverSelectedLineId(country))
				.classed("gdiSelected", false);
			gdi.mouseOverSelect( country );
		}

		// Select the continent and update backtround and font colours
		d3.select("#" + gdi.continentButtonId(continent))
			.classed("gdiSelected", true)
			.style("background-color", gdi.continentColours(d["continent"]) )
			.style("color", "white")
		;
	}
}

// Set the message in the message div
gdi.setMessage = function(country) {
	
	// Show message if there is no data for the country
	noData = (gdi.path_by_country[country]["points"].length == 0) ? " (No Data)": "";
	htmlString = '<p>' + country + '<span class="msgNoData">' + noData + '</span></p>';
	// console.log(htmlString);

	gdi.messageContainer.html(htmlString);

}

gdi.clearMessage = function() {
	// console.log("in clearMessage");
	gdi.messageContainer.html("");
}

gdi.allCountries = [];
gdi.countriesByContinent = { Asia: [], Europe: [], Africa: [], Americas: [], Oceana: [] }

gdi.listInitialize = function(data) {
	data.sort(function(a, b) {return (a["country"] >  b["country"]) ? 1 : -1; });

	// // set up list of all countries for use when displaying
	// // the buttons under the charts
	for (i = 0;  i < data.length; i++) {
		gdi.allCountries.push(data[i]["country"]);
		gdi.countriesByContinent[data[i]["continent"]]
			.push(data[i]["country"]);
	}

	// console.log(Object.keys(gdi.countriesByContinent));
	// console.log(gdi.allCountries);
	// Set up the reset button
	gdi.resetButton = d3.select("#gdiResetContainer")
			.append("div")
			.attr("id", "gdiResetDiv")
			.append("div")
				.attr("class", "gdiButton")
				.attr("id", "resetButton")
				.style("height", "30px")
				.style("border", "4px solid black")
				.style("margin", "4px")
				.style("background-color", "white")
				.style("font", "16px sans-serif")
				.style("color", "black")
				.text( "RESET CHART")
				.on("mouseover", function(d,i) { d3.select(this).style("cursor", "pointer"); })
				.on("click", function() { gdi.mouseReset(); return 0 })
				;


	gdi.continentButtons = d3.select("#gdiContinentContainer");

	gdi.continentButtons.selectAll("gdiButton")
			.data(Object.keys(gdi.countriesByContinent))
			.enter()
			.append("div")
			.attr("class", "gdiButton")
			.attr("id", function(d) { return gdi.continentButtonId(d) })
			.style("height", "30px")
			.style("border", function(d) {return "4px solid " +
								gdi.continentColours(d)})
			.style("font", "16px sans-serif")
			.style("color", "black")
			.text( function(d) { return d })
			.on("mouseover", function(d,i) { d3.select(this).style("cursor", "pointer"); })
			.on("click", function(d,i) {gdi.continentClickSelect(d) })
			;
						

	gdi.buttons.selectAll(".gdiButton")
			.data(data)
			.enter()
			.append("div")
			.attr("class", "gdiButton")
			.attr("id", function(d) { return gdi.buttonId(d["country"]) })
			.style("border", function(d) {return "4px solid " +
											gdi.continentColours(d["continent"])})
			.style("background-color", "#eee")
			.text( function(d) { return d["country"]; })
			.on("mouseover", function(d,i) {
				d3.select(this).style("cursor", "pointer");
				gdi.mouseOverSelect(d["country"]);
				gdi.setMessage(d["country"]);
			})
			.on("mouseout", function(d,i) {
				if ( !gdi.isClickSelected(d["country"]) ) gdi.mouseOffDeSelect(d["country"]);
				gdi.clearMessage();
			})
			.on("click", function(d,i) {
				gdi.mouseClickSelect(d["country"]);
			})
			;
			

}


// function to create the  chart
gdi.render = function(data, continent = "World", country = "") {

   // Add grey unselected "background" lines
  	gdi.greyLines = gdi.chart.append("g")
		.attr("class", "unselected")
		.selectAll(".unselectedPath")
		.data(data)
		.enter()
		.append("path")
		.attr("class", "unselectedPath")
		.attr("id", function(d) { return gdi.backgroundLineId(d["country"])} )
		.attr("d", gdi.path)
		;

	// Add heavier horizontal line at GDI=0 - here to ensure
	// the line appears over the greyLines
	gdi.chart.append("line")
	    .style("stroke", "black") 
	    .attr("x1", 0)
	    .attr("y1", gdi.centerPos)
	    .attr("x2", gdi.width)
	    .attr("y2", gdi.centerPos)
	    ;



   // Add steel blue lines for the hover-over highlight in the chart
  	gdi.blueLines = gdi.chart.append("g")
		.attr("class", "hover")
		.selectAll(".hoverPath")
		.data(data)
		.enter()
		.append("path")
		.attr("class", "hoverPath")
		.attr("id", function(d) { return gdi.hoverLineId(d["country"])} )
		.style("opacity", 0) // Start with these not visible
		.attr("d", gdi.path)
		;

	// Add the "glow" lines that appear briefly when selected, or
	// when the Active line is moused over.
  	gdi.glowLines = gdi.chart.append("g")
		.attr("class", "glow")
		.selectAll(".glowPath")
		.data(data)
		.enter()
		.append("path")
		.attr("class", "glowPath")
		.attr("id", function(d) { return gdi.glowLineId(d["country"])} )
		.style("opacity", 0) // Start with these not visible
		.attr("d", gdi.path)
		;


   // Active Lines that appear when selected
  	gdi.selectedLines = gdi.chart.append("g")
		.attr("class", "selected")
		.selectAll(".selectedPath")
		.data(data)
		.enter()
		.append("path")
		.attr("class", "selectedPath")
		.attr("id", function(d) { return gdi.mouseOverSelectedLineId(d["country"])} )
		.style("opacity", 0) // Start with these not visible
		.style("stroke", function(d) { return gdi.continentColours(d["continent"])} )
		.style("stroke-width", "4px")
		.style("stroke-linecap", "round")
		.attr("d", gdi.path)
		.on("mouseover", function(d,i) {
			gdi.setMessage(d["country"]);
			d3.select( "#" + gdi.hoverLineId(d["country"]) )
				.style("opacity", 1)
				;
		})
		.on("mouseout", function(d,i) {
			gdi.clearMessage();
			d3.select( "#" + gdi.hoverLineId(d["country"]) )
				.style("opacity", 0)
				;
		})
		.on("click", function(d,i) {
			gdi.mouseClickSelect(d["country"]);
		})
		;
}


gdi.path = function(d) {

	return d3.line().curve(d3.curveMonotoneX)(d.points.map( function(d) { return [gdi.x(d[0]), gdi.y(d[1]) ]  }) ); 
}
