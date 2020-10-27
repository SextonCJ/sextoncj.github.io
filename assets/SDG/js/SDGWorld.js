
function show(elementId) {
  document.getElementById("mapDashboard").style.display="none";
  document.getElementById("lineDashboard").style.display="none";
  document.getElementById("GDIDashboard").style.display="none";
  document.getElementById("information").style.display="none";
  document.getElementById(elementId).style.display="block";
 reset()
}

var active;
var jsonOutside;
var vGDI =  "Gender Disparity Index (Calculated)"
var vYear = "2015"
var vCountry
var vContinent = "Americas"
var headerNames
var SVGName

var years = ["2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010",
			       "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000" ]

var indicatorGroup = ['GDI_Indicators', 'Education', 'Employment', 'Healthcare', 'Economy', 'Poverty']

var GDI_Indicators = [
	"Gender Disparity Index (Calculated)",
	"Aid as % of GDP"
]

var Education = [
	// "Adolescents out of school (% of lower secondary school age)",
	"Compulsory education, duration (years)",
	"Lower secondary completion rate, female (% of relevant age group)",
	"Lower secondary completion rate, male (% of relevant age group)",
	"Lower secondary completion rate, total (% of relevant age group)",
	"Primary completion rate, female (% of relevant age group)",
	"Primary completion rate, male (% of relevant age group)",
	"Primary completion rate, total (% of relevant age group)",
	"Proportion of seats held by women in national parliaments (%)",
	"School enrollment, primary and secondary (gross), gender parity index (GPI)",
	"School enrollment, tertiary (% gross)",
	"School enrollment, tertiary (gross), gender parity index (GPI)",
	"School enrollment, tertiary, female (% gross)",
	"School enrollment, tertiary, male (% gross)"
]

var Employment = [
	"Contributing family workers, female (% of female employment) (modeled ILO estimate)",
	"Contributing family workers, male (% of male employment) (modeled ILO estimate)",
	"Employment in agriculture (% of total employment) (modeled ILO estimate)",
	"Employment in agriculture, female (% of female employment) (modeled ILO estimate)",
	"Employment in agriculture, male (% of male employment) (modeled ILO estimate)",
	"Employment in industry (% of total employment) (modeled ILO estimate)",
	"Employment in industry, female (% of female employment) (modeled ILO estimate)",
	"Employment in industry, male (% of male employment) (modeled ILO estimate)",
	"Employment in services (% of total employment) (modeled ILO estimate)",
	"Employment in services, female (% of female employment) (modeled ILO estimate)",
	"Employment in services, male (% of male employment) (modeled ILO estimate)",
	"Wage and salaried workers, female (% of female employment) (modeled ILO estimate)",
	"Wage and salaried workers, male (% of male employment) (modeled ILO estimate)",
	"Wage and salaried workers, total (% of total employment) (modeled ILO estimate)",
	"Unemployment, female (% of female labor force) (modeled ILO estimate)",
	"Unemployment, male (% of male labor force) (modeled ILO estimate)",
	"Unemployment, total (% of total labor force) (modeled ILO estimate)",
	"Unemployment, youth female (% of female labor force ages 15-24) (modeled ILO estimate)",
	"Unemployment, youth male (% of male labor force ages 15-24) (modeled ILO estimate)",
	"Unemployment, youth total (% of total labor force ages 15-24) (modeled ILO estimate)"
]

var Healthcare = [
	"Immunization, DPT (% of children ages 12-23 months)",
	"Immunization, HepB3 (% of one-year-old children)",
	"Immunization, measles (% of children ages 12-23 months)",
	"Incidence of HIV (per 1,000 uninfected population ages 15-49)",
	"Incidence of tuberculosis (per 100,000 people)",
	"Maternal mortality ratio (modeled estimate, per 100,000 live births)",
	"Mortality rate, neonatal (per 1,000 live births)",
	"Mortality rate, under-5 (per 1,000 live births)",
	"Net official development assistance received (current US$10m)",
	"Prevalence of HIV, female (% ages 15-24)",
	"Prevalence of HIV, male (% ages 15-24)",
	"Prevalence of HIV, total (% of population ages 15-49)"
]

var Economy = [
	"Access to electricity (% of population)",
	"Access to electricity, rural (% of rural population)",
	"Access to electricity, urban (% of urban population)",
	"Commercial bank branches (per 100,000 adults)",
	"Exports of goods and services (% of GDP)",
	"GDP (current US$100m)",
	"GDP per person employed (constant 2011 PPP $)",
	"Renewable electricity output (% of total electricity output)",
	"Renewable energy consumption (% of total final energy consumption)",
	"Urban population (100k)",
	"Urban population (% of total population)",
	"Urban population growth (annual %)"
]

var Poverty = [
	"People practicing open defecation (% of population)",
	"People using at least basic drinking water services (% of population)",
	"People using at least basic drinking water services, rural (% of rural population)",
	"People using at least basic drinking water services, urban (% of urban population)",
	"People using at least basic sanitation services (% of population)",
	"People using at least basic sanitation services, rural (% of rural population)",
	"People using at least basic sanitation services, urban (% of urban population)",
	"Prevalence of undernourishment (% of population)"
]

var Regions = [
  "Sub-Saharan Africa",
  "Middle East & North Africa",
  "Latin America & Caribbean",
  "East Asia & Pacific",
  "Europe & Central Asia",
  "North America",
  "South Asia"
];

var Continents = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceana",
  "World"
];

var headerNames = GDI_Indicators

// Setup Line Chart

// define default controls
var selected_country = 'United States';
// var selected_region = 'North America';
var selected_continent = 'Americas';
var selected_group = 'GDI_Indicators';

var selected_country1 = 'Afghanistan';
var selected_country2 = 'United States';
var selected_continent1 = 'Asia';
var selected_continent2 = 'Americas';
var selected_region1 = 'Asia';
var selected_region2 = 'Americas';
var selected_group1 = 'GDI_Indicators';
var selected_group2 = 'GDI_Indicators';
var selected_firstMeasure = 'Gender Disparity Index (Calculated)';
var selected_secondMeasure = 'Gender Disparity Index (Calculated)';

var selected_regionalData1;
var selected_regionalData2;

// define year format
var year_format = d3.format(".0f");

// define line chart margin, width, height
var margin = {top: 20, right: 100, bottom: 30, left: 100}
  , width = 1060 - margin.left - margin.right // Use the window's width
  , height = 240 - margin.top - margin.bottom; // Use the window's height

// Set up Map
var w =960;
var h = w  / 1.62 // golden rectangle

//Define map projection
//var projection = d3.geoMercator()
		var projection = d3.geoWinkel3()
    .center([+25, 8])
    .scale(200)
    .translate([w/2 , h/2 ]);

var path = d3.geoPath().projection(projection);

//Define quantize scale to sort data values into buckets of color

col_range = 7
var color = d3.scaleQuantize()
              .range(d3.schemeBlues	[col_range]);

//Create SVG element
var svg = d3.select("#chartArea")
      .append("svg")
      .attr('width', w)
      .attr('height', h);

//Create a new, invisible background rect to catch zoom events
svg.append("rect")
    .attr("width", w)
    .attr("height", h)
    .style("fill", "none")
    .style("stroke", "white")
    .style("stroke-width", "1")
    .on("click", reset);


var map = svg.append("g");

var tooltip = d3.select("div.tooltip");

// function for use in d3.line().defined() to filter out
// data items with invalid values. returns FALSE for
// non-float values or values that equal 0.0 which is
// used here as a plug number.
function validNumber(n) {return ( n != 0.0 && !isNaN(parseFloat(n))); }
// function validNumber(n) {return ( !isNaN(parseFloat(n))); }

// Load in SDG data
d3.csv("/assets/SDG/data/SDG_data_flat.csv", function(data) {


  gdi.init(data);

// Controls Code

	// get groups from 'Country'
	var allGroup_Country = d3.map(data, function(d){return(d.Country)}).keys().sort()

	// get groups from 'Year'
	var allGroup_Year = d3.map(data, function(d){return(d.Year)}).keys()

  // get groups from 'Region'
  var allGroup_Region = d3.map(data, function(d){return(d.Region)}).keys()

  // get groups from 'Continent'
  var allGroup_Continent = d3.map(data, function(d){return(d.Continent)}).keys()

	// get initial number of selected years
	var numSelectedYears = allGroup_Year.length; // count of years between min and max year


  // MAP CONTROLS
  // Year DropDown
 	d3.select("#yrdropdown")
 		 .selectAll('option')
 		 .data(years)
 		 .enter()
 		 .append('option')
 	   .attr("value", function (d) { return d; }) // corresponding value returned by the button
   	 .text(function (d) { return d; }) // text showed in the menu

 d3.select("#yrdropdown").property('value', vYear);

  d3.select("#yrdropdown").on('change', function(d) {
       var yearSelected = d3.select(this).property("value");
       window.vYear = yearSelected
       map.selectAll("path").remove()
       d3.selectAll("table").remove()
       d3.selectAll("g.legendEntry").remove()
       initialGraph(vGDI, yearSelected);
    });

	// Country DropDown
	d3.select("#countryDropdown")
		 .selectAll('myOptions')
		 .data(allGroup_Country)
		 .enter()
		 .append('option')
	   .attr("value", function (d) { return d; }) // corresponding value returned by the button
  	 .text(function (d) { return d; }) // text showed in the menu

  d3.select("#countryDropdown").property('value', selected_country);

   d3.select("#countryDropdown").on("change", function(d) {
     var selectedOption_country = d3.select(this).property("value")
     window.selected_country = selectedOption_country
     tableRowClicked(selected_country)
   })

   // Group DropDown
   var indicatorGroupMenu = d3.select("#indicatorGroupdropdown").append("select")
   indicatorGroupMenu.selectAll("option")
      .data(indicatorGroup)
      .enter()
      .append("option")
      .attr("value", (d) => {return d;})
      .text((d) => {return d;})

   indicatorGroupMenu.on('change', function() {
     vHeaderNames = d3.select(this).property("value");
     vHeaderNames = eval(vHeaderNames)
     unitMenu.selectAll("option").remove()
     d3.selectAll("g.legendEntry").remove()

     unitMenu.selectAll("option")
       .data(vHeaderNames)
       .enter()
       .append("option")
       .attr("value", (da) => {return da;})
       .text((da) => {return da;})

     window.indicatorSelected = vHeaderNames[0]
     map.selectAll("path").remove()
     d3.selectAll("table").remove()
     initialGraph(indicatorSelected, vYear);
   }); // Close indicatorGroupdropdown on change

   // World Bank Indicator DropDown
   var unitMenu = d3.select("#dropdown").append("select")
   unitMenu.selectAll("option")
      .data(headerNames)
      .enter()
      .append("option")
      .attr("value", (d) => {return d;})
      .text((d) => {return d;})

    unitMenu.on('change', function() {
      var indicatorSelected = d3.select(this).property("value");
      window.selected_firstMeasure = indicatorSelected
      //console.log(vGDI)
      map.selectAll("path").remove()
      d3.selectAll("table").remove()
      d3.selectAll("g.legendEntry").remove()
      initialGraph(indicatorSelected, vYear);
    }); // Close UnitMenu on change



    // LINE CHART CONTROLS
    // console.log(selected_firstMeasure)
    // console.log(selected_secondMeasure)

    // Set the initial values for the control with default values
    d3.select("#countryDropdown1").property('value', selected_country1);
    d3.select('#indicatorGroupdropdown1').property('value', selected_group1);
    d3.select('#dropdown1').property('value', selected_firstMeasure);
    d3.select("#countryDropdown2").property('value', selected_country2);
    d3.select('#indicatorGroupdropdown2').property('value', selected_group2);
    d3.select('#dropdown2').property('value', selected_secondMeasure);
    d3.select('#dropdown2').property("selected", function(d){ return d === selected_secondMeasure; })

    // function to format average measures for the selected region
    // format data for average for selected region
    function getNestedData (region, measure1, measure2) {
      var dataToNest = data;
      // // filter data whose country or region is null
      // var dataToNest = dataToNest.filter(function(d) { return d.Country !== ''; });
      // var dataToNest = dataToNest.filter(function(d) { return d.Region !== ''; });

      nestedData = d3.nest()
        .key(function(el) {return el.Year})
        // .key(function(el) { if (el.Region == region) {console.log(el.Region); return el.Region; } }) // filter data by selected region
        .key(function(el) { if (el.Region == region) { return el.Region; } }) // filter data by selected region
        .rollup(function(leaves) {
          // return {measure1:  d3.mean(leaves, function(d) { console.log(d.Region) ; return +d[measure1]}),
          //         measure2:  d3.mean(leaves, function(d) { console.log(d.Region) ; return +d[measure2]})
          // return {measure1:  d3.mean(leaves, function(d) { return validNumber(d[measure1]) }),
          //         measure2:  d3.mean(leaves, function(d) { return validNumber(d[measure2]) })
          return {measure1:  d3.mean(leaves, function(d) { return +d[measure1] }),
                  measure2:  d3.mean(leaves, function(d) { return +d[measure2] })
                }
        })
        .entries(dataToNest);

        // Sort by date
        nestedData.sort(function (a,b) {
          return a.key - b.key;
        });

        function addDays(date, days) {
          var result = new Date(date);
          result.setDate(result.getDate() + days);
          return result;
        }

        // Format date as JS object
        nestedData.forEach(function (el) {
          d = addDays(el.key,1)
          el.key = d.getFullYear();
        });

        return nestedData;

      } //end function get nestedData

    function setSelectedCountryRegion(){
      // Get regional data of the selected country 1
      selectedRegion1 = gdi.path_by_country[selected_country1]["region"]
      window.selected_region1 = selectedRegion1 // update selected region 1
      var regionalData1 = getNestedData(selectedRegion1, selected_firstMeasure, selected_secondMeasure)
      window.selected_regionalData1 = regionalData1;
      // console.log(selectedRegion1)

      // Get regional data of the selected country 2
      selectedRegion2 = gdi.path_by_country[selected_country2]["region"]
      window.selected_region2 = selectedRegion2 // update selected region 2
      var regionalData2 = getNestedData(selectedRegion2, selected_firstMeasure, selected_secondMeasure)
      window.selected_regionalData2 = regionalData2;
     // console.log(selectedRegion2)

    }
    setSelectedCountryRegion();

    // Country DropDown1
  	d3.select("#countryDropdown1")
  		 .selectAll('myOptions')
  		 .data(allGroup_Country)
  		 .enter()
  		 .append('option')
  	   .attr("value", function (d) { return d; }) // corresponding value returned by the button
    	 .text(function (d) { return d; }) // text showed in the menu

    d3.select("#countryDropdown1").property('value', selected_country1);

     d3.select("#countryDropdown1").on("change", function(d) {
       var selectedOption_country1 = d3.select(this).property("value")
       window.selected_country1 = selectedOption_country1

       // Get regional data of the selected country 1
       selectedRegion1 = gdi.path_by_country[selectedOption_country1]["region"]
       window.selected_region1 = selectedRegion1 // update selected region 1
       // console.log(selectedRegion1)

       regionalData1 = getNestedData(selectedRegion1, selected_firstMeasure, selected_secondMeasure)
       window.selected_regionalData1 = regionalData1

       setSelectedCountryRegion();
       console.log(selected_country1)
       console.log(selectedRegion1)
       console.log(selected_firstMeasure)
       console.log(selected_secondMeasure)
       console.log(selected_regionalData1)
       update1(selected_country1, selected_group1, selected_firstMeasure, selected_regionalData1, "SVGLine1")
     })

    // Country DropDown2
  	d3.select("#countryDropdown2")
  		 .selectAll('myOptions')
  		 .data(allGroup_Country)
  		 .enter()
  		 .append('option')
  	   .attr("value", function (d) { return d; }) // corresponding value returned by the button
    	 .text(function (d) { return d; }) // text showed in the menu

    d3.select("#countryDropdown2").property('value', selected_country2);

     d3.select("#countryDropdown2").on("change", function(d) {
       var selectedOption_country2 = d3.select(this).property("value")
       window.selected_country2 = selectedOption_country2

       // Get regional data of the selected country 1
       selectedRegion2 = gdi.path_by_country[selectedOption_country2]["region"]
       window.selected_region2 = selectedRegion2 // update selected region 2
       // console.log(selectedRegion2)

       regionalData2 = getNestedData(selectedRegion2, selected_firstMeasure, selected_secondMeasure)
       window.selected_regionalData2 = regionalData2

       setSelectedCountryRegion();
       update2(selected_country2, selected_group2, selected_secondMeasure, selected_regionalData2, "SVGLine2")
     })


   // Group DropDown1
   var indicatorGroupMenu1 = d3.select("#indicatorGroupdropdown1").append("select")
   indicatorGroupMenu1.selectAll("option")
      .data(indicatorGroup)
      .enter()
      .append("option")
      .attr("value", (d) => {return d;})
      .text((d) => {return d;})

   indicatorGroupMenu1.on('change', function() {
     vHeaderNames = d3.select(this).property("value");
     vHeaderNames = eval(vHeaderNames)
     unitMenu1.selectAll("option").remove()

    unitMenu1.selectAll("option")
       .data(vHeaderNames)
       .enter()
       .append("option")
       .attr("value", (da) => {return da;})
       .text((da) => {return da;})

    // update line chart with the default measure of the selected group
    var indicatorSelected1 = vHeaderNames[0]
    window.selected_firstMeasure = indicatorSelected1;

    setSelectedCountryRegion();
    update1(selected_country1, selected_group1, selected_firstMeasure, selected_regionalData1, "SVGLine1")

   }); // Close indicatorGroupdropdown on change

   // Group DropDown2
   var indicatorGroupMenu2 = d3.select("#indicatorGroupdropdown2").append("select")
   indicatorGroupMenu2.selectAll("option")
      .data(indicatorGroup)
      .enter()
      .append("option")
      .attr("value", (d) => {return d;})
      .text((d) => {return d;})

 	indicatorGroupMenu2.on('change', function() {
     vHeaderNames = d3.select(this).property("value");
   	vHeaderNames = eval(vHeaderNames)
 		unitMenu2.selectAll("option").remove()

 		unitMenu2.selectAll("option")
 			.data(vHeaderNames)
 			.enter()
 			.append("option")
 			.attr("value", (da) => {return da;})
 			.text((da) => {return da;})

    // udpate line chart with the selected default measure
    var indicatorSelected2 = vHeaderNames[0]
    window.selected_secondMeasure = indicatorSelected2

    setSelectedCountryRegion();
    update2(selected_country2, selected_group2, selected_secondMeasure, selected_regionalData2, "SVGLine2")

   }); // Close indicatorGroupdropdown on change

    // World Bank Indicator DropDown1
    var unitMenu1= d3.select("#dropdown1").append("select")
    unitMenu1.selectAll("option")
       .data(headerNames)
       .enter()
       .append("option")
       .attr("value", (d) => {return d;})
       .text((d) => {return d;})

     unitMenu1.on('change', function() {
       var indicatorSelected1 = d3.select(this).property("value");
       window.selected_firstMeasure = indicatorSelected1

       setSelectedCountryRegion();
       update1(selected_country1, selected_group1, selected_firstMeasure, selected_regionalData1, "SVGLine1")
     }); // Close UnitMenu on change


    // World Bank Indicator DropDown2
    var unitMenu2= d3.select("#dropdown2").append("select")
    unitMenu2.selectAll("option")
       .data(headerNames)
       .enter()
       .append("option")
       .attr("value", (d) => {return d;})
       .text((d) => {return d;})

     unitMenu2.on('change', function() {
       var indicatorSelected2 = d3.select(this).property("value");
       window.selected_secondMeasure = indicatorSelected2

       setSelectedCountryRegion();
       // update2(selected_country2, selected_group2, selected_secondMeasure, regionalData2, "SVGLine2")
       update2(selected_country2, selected_group2, window.selected_secondMeasure, selected_regionalData2, "SVGLine2")
     }); // Close UnitMenu on change

   //Continent DropDowns
   // d3.select("#Africa").on("click", function() {window.vContinet = "Africa"});
   // d3.select("#Americas").on("click", function() {window.vContinet = "Americas"});
   // d3.select("#Asia").on("click", function() {window.vContinet = "Asia"});
   // d3.select("#Europe").on("click", function() {window.vContinet = "Europe"});
   // d3.select("#Oceana").on("click", function() {window.vContinet = "Oceana"});
   // d3.select("#World").on("click", function() {window.vContinet = "World"});

// End of Controls Code



// Line Chart Code

	// Scales
  // color scale
	var myColor_Country = d3.scaleOrdinal()
	 .domain(allGroup_Country)
	 .range(d3.schemeSet2);

	// X Scale
  var x = d3.scaleLinear()
	 .domain(d3.extent(data, function(d) { return d.Year; }))
	 .range([ 0, width]);

  // Scale
  var y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d[selected_firstMeasure] || 0; }),
             d3.max(data, function(d) { return +d[selected_firstMeasure] || 0; })])
    .range([ height, 0 ]);

  var y2 = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d[selected_secondMeasure] || 0; }),
              d3.max(data, function(d) { return +d[selected_secondMeasure] || 0; })])
    .range([ height, 0 ]);

  // Add the SVG to the page
  var SVGLine1 = d3.select("#lineChartArea").append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
   .append("g")
   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   var SVGLine2 = d3.select("#lineChartArea2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 // Call the x axis in a group tag
 // gridlines in x axis function
 function make_x_gridlines() {
     return d3.axisBottom(x)
         .tickFormat(year_format)
         .ticks(20) }

 SVGLine1.append("g")
   .attr("class", "x axis lineaxis grid")
   .attr("transform", "translate(0," + height + ")")
   .call(make_x_gridlines()
       .tickSize(-height)
       .tickFormat(""))
   .selectAll("text")
   .attr("dx", ".8em")
   .attr("dy", "-.55em")
   .attr("transform", "rotate(65)")
   .style("text-anchor", "start");

  SVGLine1.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).tickFormat(year_format));

  SVGLine2.append("g")
    .attr("class", "x axis lineaxis grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat(""))
    .selectAll("text")
    .attr("dx", ".8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(65)")
    .style("text-anchor", "start");

  SVGLine2.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x).tickFormat(year_format));

  // Call the y axis in a group tag
  SVGLine1.append("g")
    .attr("class", "y axis lineaxis")
    .attr("transform", "translate(" + (0 - 25) + " ,0)")
    .call(d3.axisLeft(y).ticks(5));

  SVGLine2.append("g")
  .attr("class", "y axis lineaxis")
  .attr("transform", "translate(" + (0 - 25) + " ,0)")
  .call(d3.axisLeft(y2).ticks(5));


	// Initialize  GDI line with selected country
  // First plot a dashed version of the line that
  // will show up where the filtered solid line is not
  // defined (i.e. where there are gaps in the data)
  var line1dashed = SVGLine1
    .append('g')
    .append("path")
    .attr("class", "line1dashed")
    .style("stroke-dasharray", ("3, 3"))
    .datum(data.filter(function(d){return d.Country==selected_country1 &&
                                          validNumber(d[selected_firstMeasure])}))
    .attr("d", d3.line()
      .x(function(d) { return x(d.Year) })
      .y(function(d) { return y(+d[selected_firstMeasure]) })
      .curve(d3.curveMonotoneX));

	var line1 = SVGLine1
		.append('g')
		.append("path")
    .attr("class", "line1")
		.datum(data.filter(function(d){return d.Country==selected_country1}))
		.attr("d", d3.line()
      .defined(function(d) { return validNumber( d[selected_firstMeasure] ) })
			.x(function(d) { return x(d.Year) })
      .y(function(d) { return y(+d[selected_firstMeasure]) })
      .curve(d3.curveMonotoneX));

  var line2dashed = SVGLine2
    .append('g')
    .append("path")
    .attr("class", "line2dashed")
    .style("stroke-dasharray", ("3, 3"))
    .datum(data.filter(function(d){return d.Country==selected_country2 &&
                                          validNumber(d[selected_firstMeasure])}))
    .attr("d", d3.line()
    	.x(function(d) { return x(d.Year) })
      .y(function(d) { return y2(+d[selected_secondMeasure]) })
      .curve(d3.curveMonotoneX));

  var line2 = SVGLine2
    .append('g')
    .append("path")
    .attr("class", "line2")
    .datum(data.filter(function(d){return d.Country==selected_country2}))
    .attr("d", d3.line()
      .defined(function(d) { return validNumber( d[selected_secondMeasure] ) })
      .x(function(d) { return x(d.Year) })
      .y(function(d) { return y2(+d[selected_secondMeasure]) })
      .curve(d3.curveMonotoneX));

  // Add average line for the line chart 1
  line1_avg = SVGLine1
    .append('g')
    .append("path")
    .attr("class", "line3")
    .datum(selected_regionalData1)
    .attr("d", d3.line()
      .defined(function(d) { return validNumber(d.values[0].value['measure1']) })
      .x(function(d) {
        return x(d.key) })
      .y(function(d) {
        return y(d.values[0].value['measure1']) })
      .curve(d3.curveMonotoneX));

    // Add average line for the line chart 2
    line2_avg = SVGLine2
      .append('g')
      .append("path")
      .attr("class", "line3")
      .datum(selected_regionalData2)
      .attr("d", d3.line()
        .defined(function(d) { return validNumber(d.values[0].value['measure2']) })
        .x(function(d) {
          return x(d.key) })
        .y(function(d) {
          return y(d.values[0].value['measure2']) })
        .curve(d3.curveMonotoneX));

  // Add some dots to y line
  var dot1 = SVGLine1.selectAll(".dot1")
    .data(data.filter(function(d){return d.Country==selected_country1}))
    .enter().append("circle")
    .attr("class", "dot1")
    .attr("cx", function(d) { return x(d.Year) })
    .attr("cy", function(d) { return y(+d[selected_firstMeasure]) })
    .attr("r", 5)
    .style("opacity", function(d) { return validNumber(d[selected_firstMeasure]) ? 1 : 0})
    ;

  var dot2 = SVGLine2.selectAll(".dot2")
    .data(data.filter(function(d){return d.Country==selected_country2}))
    .enter().append("circle")
    .attr("class", "dot2")
    .attr("cx", function(d) { return x(d.Year) })
    .attr("cy", function(d) { return y2(+d[selected_secondMeasure]) })
    .attr("r", 5)
    .style("opacity", function(d) { return validNumber(d[selected_secondMeasure]) ? 1 : 0})
    ;

  //Create labels by the y1 dots
  var text1 = SVGLine1.selectAll(".text1")
    .data(data.filter(function(d){return d.Country==selected_country1}))
     .enter().append("text")
     .attr("class", "text1")
     .text(function(d) {return validNumber(d[selected_firstMeasure]) ?
                                           d[selected_firstMeasure] : "" ;})
     .attr("x", function(d) {return x(d.Year)})
     .attr("y", function(d) {return y(+d[selected_firstMeasure])-10})
     ;


   var text2 = SVGLine2.selectAll(".text2")
     .data(data.filter(function(d){return d.Country==selected_country2}))
      .enter().append("text")
      .attr("class", "text2")
      .text(function(d) {return validNumber(d[selected_secondMeasure]) ?
                                            d[selected_secondMeasure] : "" ;})
      .attr("x", function(d) {return x(d.Year)})
      .attr("y", function(d) {return y2(+d[selected_secondMeasure])-10})
      ;
      // end of  initiontialLineChart

// A function that update the line chart
function update1(selectedGroup_Country1, selected_group1, selected_firstMeasure, regionalData1) {

  // update y scale
  var y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d[selected_firstMeasure] || 0; }),
             d3.max(data, function(d) { return +d[selected_firstMeasure] || 0; })])
    .range([ height, 0 ]);

  // update y axis
  SVGLine1.select(".y.axis").transition().duration(1000).call(d3.axisLeft(y).ticks(5));

  // Create new data with the country selection
  var dataFilter = data.filter(function(d){return d.Country==selectedGroup_Country1});
  var dataFilter2 = dataFilter.filter(function(d){return validNumber(d[selected_firstMeasure])});

  // update lines and dots with selected data
  line1dashed
      .datum(dataFilter2)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(+d[selected_firstMeasure]) })
        .curve(d3.curveMonotoneX) )

  line1
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .defined(function(d) { return validNumber( d[selected_firstMeasure] ) })
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(+d[selected_firstMeasure]) })
        .curve(d3.curveMonotoneX) )


  SVGLine1.selectAll(".dot1")
    .data(dataFilter)
    .transition()
    .duration(1000)
    .attr("cx", function(d) { return x(d.Year) })
    .attr("cy", function(d) { return y(+d[selected_firstMeasure]) })
    .attr("r", 5)
    .style("opacity", function(d) { return validNumber(d[selected_firstMeasure]) ? 1 : 0})
    ;

  SVGLine1.selectAll(".text1")
     .data(dataFilter)
     .transition()
     .duration(1000)
     .text(function(d) {return validNumber(d[selected_firstMeasure]) ? d[selected_firstMeasure] : "" ;})
     .attr("x", function(d) {return x(d.Year)})
     .attr("y", function(d) {return y(+d[selected_firstMeasure] )-10})
     ;


  // Add average line for the line chart 1
  // remove existing average line
  SVGLine1.select(".line3").remove()

  // add new average line
  line1_avg = SVGLine1
    .append('g')
    .append("path")
    .attr("class", "line3")
    .datum(regionalData1)
    .attr("d", d3.line()
      .defined(function(d) { return validNumber( d.values[0].value['measure1'] ) })
      .x(function(d) {
        return x(d.key) })
      .y(function(d) {
        // select the correct region key if "undefined"  region key exists (exclude 'undefined' region)
        var regionKey = d.values[0]
        for(var i=0; i<d.values.length; i++) {
          if (regionKey = "undefined") {
            regionKey = d.values[1]
          }
        }

        // return y(d.values[0].value['measure1']) })
        // return y(d.values[1].value['measure1']) })
        return y(regionKey.value['measure1']) })
      .curve(d3.curveMonotoneX));
}

// A function that update the y2 line chart
function update2(selectedGroup_Country2, selected_group2, selected_secondMeasure, regionalData2) {

  // update y2 scale
  var y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d[selected_secondMeasure] || 0; }),
             d3.max(data, function(d) { return +d[selected_secondMeasure] || 0; })])
    .range([ height, 0 ]);

  // update y2 axis
  SVGLine2.select(".y.axis").transition().duration(1000).call(d3.axisLeft(y).ticks(5));

  // Create new data with the selection
  var dataFilter = data.filter(function(d){return d.Country==selectedGroup_Country2})
  var dataFilter2 = dataFilter.filter(function(d) { return validNumber( d[selected_secondMeasure] ) })

  // update lines and dots with selected data
  SVGLine2.selectAll(".line2dashed")
      .datum(dataFilter2)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(+d[selected_secondMeasure]) })
        .curve(d3.curveMonotoneX) )

  SVGLine2.selectAll(".line2")
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .defined(function(d) { return validNumber( d[selected_secondMeasure] ) })
        .x(function(d) { return x(d.Year) })
        .y(function(d) { return y(+d[selected_secondMeasure]) })
        .curve(d3.curveMonotoneX) )

  SVGLine2.selectAll(".dot2")
    .data(dataFilter)
    .transition()
    .duration(1000)
    .attr("cx", function(d) { return x(d.Year) })
    .attr("cy", function(d) { return y(+d[selected_secondMeasure]) })
    .attr("r", 5)
    .style("opacity", function(d) { return validNumber( d[selected_secondMeasure] ) ? 1 : 0});

  SVGLine2.selectAll(".text2")
     .data(dataFilter)
     .transition()
     .duration(1000)
     .text(function(d) {return validNumber(d[selected_secondMeasure]) ?
                                          d[selected_secondMeasure] : "" ;})
     .attr("x", function(d) {return x(d.Year)})
     .attr("y", function(d) {return y(+d[selected_secondMeasure] )-10});

  // Add average line for the line chart 2
  // remove existing average line
  SVGLine2.select(".line3").remove()

  // add new average line
  line2_avg = SVGLine2
    .append('g')
    .append("path")
    .attr("class", "line3")
    .datum(regionalData2)
    .attr("d", d3.line()
      .defined(function(d) { return validNumber( d.values[0].value['measure2'] ) })
      .x(function(d) {
        return x(d.key) })
      .y(function(d) {
        // select the correct region key if "undefined"  region key exists (exclude 'undefined' region)
        var regionKey = d.values[0]
        for(var i=0; i<d.values.length; i++) {
          if (regionKey = "undefined") {
            regionKey = d.values[1]
          }
        }

        // return y(d.values[0].value['measure2']) })
        return y(regionKey.value['measure2']) })
      .curve(d3.curveMonotoneX));
} // End of Line Chart Code

///////////////////////////// Line chart test ///////////////////////////////
//console.log(selected_firstMeasure)
//console.log(selected_secondMeasure)

// Map Chart Code

  var initialGraph = function(indicatorSelected, yearSelected) {

    window.vYear = yearSelected
    window.vGDI = indicatorSelected

    // Update the GDI chart
    // gdi.update(yearSelected);

    mapData = data.filter(function(row) { return row['Year'] == vYear; })
    var GDI = indicatorSelected;  // From the dropdown - from now on this is our filter

    //console.log(mapData)

    min_dom = d3.min(mapData, function(d) { return parseInt(d[GDI]); })
    max_dom = d3.max(mapData, function(d) { return parseInt(d[GDI]); })

    //Set input domain for color scale on the map
    color.domain([min_dom, max_dom]);

    var legend = svg.selectAll('g.legendEntry')
        .data(color.range().reverse())
        .enter()
        .append('g').attr('class', 'legendEntry');

    legend
        .append('rect')
        .attr("x", width - 80)
        .attr("y", function(d, i) {
           return i * 20;
        })
       .attr("width", 12)
       .attr("height", 12)
       //.style("stroke", "black")
       //.style("stroke-width", 1)
       .style("fill", function(d){return d;});
           //the data objects are the fill colors

    legend
        .append('text')
        .attr("class", "legendThreshold")
        .attr("x", width - 65) //leave 5 pixel space after the <rect>
        .attr("y", function(d, i) {
           return i * 20;})
        .attr("dy", "0.8em") //place text one line *below* the x,y point
        .text(function(d,i) {
            var extent = color.invertExtent(d);
            //extent will be a two-element array
            var format = d3.format("0.0f");
            return format(+extent[0]) + " to " + format(+extent[1]);
        })


    //Load in GeoJSON data
    d3.json("/assets/SDG/geodata/world-110m.geojson", function(json) {

    //Merge the ag. data and GeoJSON
    //Loop through once for each ag. data value

    var GDI = indicatorSelected
      for (var i = 0; i < mapData.length; i++) {
        var dataCountry = mapData[i].Country;				//Grab country name
        //Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          var jsonCountry = json.features[j].properties.name;
          if (dataCountry == jsonCountry) {
            //Copy the data value into the JSON
            json.features[j].properties.GDI = numberWithCommas(mapData[i][GDI])
            json.features[j].properties.Aid = mapData[i]['Aid as % of GDP']
            json.features[j].properties.UrbanPop = mapData[i]['Urban population (100k)']
            json.features[j].properties.UrbanPopGrowth = mapData[i]['Urban population growth (annual %)']
            json.features[j].properties.RealGDI = mapData[i]['Gender Disparity Index (Calculated)']
            break;
          }
        }
      }

      jsonOutside = json; // pass json to a global so Top 10 and Bottom 10 Country table have access (tableRowClicked)

      // Build The top 10 table - should be a function really because I repeat all the code for Bottom 10 Country
      sData = []
      sData = mapData.sort(function(a, b) {return a[GDI] - b[GDI];});   // Sort indicator values
      sData = sData.slice(-10,).reverse(); // Just get the top 10

      // Build the Top 10 Table
      var columns = ["Country", GDI];
       var table = d3.select("#table_container").append("table"),
             thead = table.append("thead"),
             tbody = table.append("tbody")

      // create a row for each object in the data
      var rows = tbody.selectAll("tr")
             .data(sData)
             .enter()
             .append("tr")
             .style('opacity',0);

      rows.transition().duration(500).style('opacity',1)

      // create a cell in each row for each column
      var cells = rows.selectAll("td")
           .data(function (row) {
               return columns.map(function (column) {
                   return { column: column, value: row[column] };
               });
           })
           .enter()
           .append("td")
           .text(function (d) { return numberWithCommas(d.value); }
         )
         .on("click", function (d) { tableRowClicked(d.value); },); // zoom map on click


       // Get bottom 10
       // sort by removing empty strings (NULLS) - we don't want these in the bottom 10
       sData = []
         sData = mapData.sort(function(a, b) {
         var va = (parseInt(a[GDI], 10) === null) ? -1 : 0 + parseInt(a[GDI], 10);
           var vb = (parseInt(b[GDI], 10) === null) ? -1 : 0 + parseInt(b[GDI], 10);
           return va > vb ? 1 : ( va === vb ? 0 : -1 );
         });

        sData = sData.slice(0,10).reverse();

       var columns = ["Country", GDI];
       var table = d3.select("#table_container2").append("table"),
              thead = table.append("thead"),
              tbody = table.append("tbody")

        // create a row for each object in the data
       var rows = tbody.selectAll("tr")
            .data(sData)
            .enter()
            .append("tr")
            .style('opacity',0);

       rows.transition().duration(500).style('opacity',1)

        // create a cell in each row for each column
       var cells = rows.selectAll("td")
            .data(function (row) {
                return columns.map(function (column) {
                    return { column: column, value: row[column] };
                });
            })
            .enter()
            .append("td")
            .text(function (d) { return d.value; }
          )
          .on("click", function (d) { tableRowClicked(d.value); }); // added on click eventto td         element NB you need to click on the cell with the conuty name


      //Bind csv data to map and create one path per GeoJSON feature
      var mappy = map.selectAll("path")
         .data(json.features)
         .enter()
         .append("path")
         .attr("d", path)
         .style("fill", function(d) {
            //Get data value
            var value = d.properties.GDI;
            if (value) {
              //If value exists…
              return color(value);
            } else {
              //If value is undefined…
              return "#ccc";
            }
         })    // close on style fill
         .style('opacity', 0)
         .style('cursor', 'pointer')

         mappy.transition().duration(1000).style('opacity',1);

         mappy.on("click", function (d) {
					 window.vCountry = d.properties.name
					 click(d); })

         mappy.on("mouseover",function(d){
                   d3.select(this).style("fill","grey").attr("stroke-width",2);
                   return tooltip.style("hidden", false).html(d.properties.name);
               }) // close on mouse over

               .on("mousemove",function(d){
                   tooltip.classed("hidden", false)
                          .style("top", (d3.event.pageY) + "px")
                          .style("left", (d3.event.pageX + 10) + "px")
                          .html(
                            "<table style='font-size: 10px; font-family: sans-serif;' >"+
                            "<tr><td>Country: </td><td>" + d.properties.name + "</td></tr>"+
                            "<tr><td>" + GDI + "</td><td>" + d.properties.GDI + "</td></tr>"+
                            "<tr><td>Gender Disparity Index (Calculated): </td><td>" + d.properties.RealGDI + "</td></tr>"+
                            "<tr><td>GDP (current US$100m): </td><td>" + numberWithCommas(d.properties.GDP) + "</td></tr>"+
                            "<tr><td>Aid as % of GDP: </td><td>" + d.properties.Aid + "%" + "</td></tr>"+
                            "<tr><td>Development Assistance (US$10m)): </td><td>" + numberWithCommas(d.properties.NetAssist) + "</td></tr>"+
                            "<tr><td>Urban Population (100k): </td><td>" + numberWithCommas(d.properties.UrbanPop) + "</td></tr>"+
                            "<tr><td>Urban Population Growth: </td><td>" + d.properties.UrbanPopGrowth + "</td></tr>"+
                            "</table>");

               }) // close on mousemove

               .on("mouseout",function(d){
                   d3.select(this)
                   .style("fill", function(d) {
                      var value = d.properties.GDI; //Get data value
                      if (value) {                       //If value exists…
                        return color(value);
                      } else {                       //If value is undefined…
                        return "#ccc";
                      }
                   }) // close on style fill

                   tooltip.classed("hidden", true);
               }); // close on mouseout






    }); // close load json map data
  }; // close function initial graph

  initialGraph('Gender Disparity Index (Calculated)', vYear)  // Call the initial graph

}); // close csv data

// Function to zoom on map from map
function click(d) {
   if (active === d) return reset();
   map.selectAll(".active").classed("active", false);
   d3.select("#"+d.properties.name).classed("active", window.active = d); // changed selection to id
   var b = path.bounds(d);
   map.transition().duration(750).attr("transform",
       "translate(" + projection.translate() + ")"
       + "scale(" + .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h) + ")"
       + "translate(" + -(b[1][0] + b[0][0]) / 2 + "," + -(b[1][1] + b[0][1]) / 2 + ")");
}

// Function to reset the map
function reset() {
    map.selectAll(".active").classed("active", window.active = false);
    map.transition().duration(750).attr("transform", "");}

// Function to zoom on map from table
function tableRowClicked(x) {
	  window.vCountry = x
    jsonOutside.features.forEach(function (d) { // loop through json data to match td entry
        if (x === d.properties.name) {
            var Country = d;
            click(d); // pass json element that matches td data to click
        };
    })
}

// Create the Map Reset Button
var home = svg.append("g")
  .attr("class", "home")
  .attr("id", "home")
  .attr("transform", "translate(" + (40) + "," + (h - 590) + ")")
  .on("click", function (d) { reset(); })

home.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 35)
  .attr("height", 35)
  .style('cursor', 'pointer');

home.append("text")
  .attr('font-family', 'FontAwesome')
  .attr("x", 17)
  .attr("y", 26)
  .attr("class", "fa")
  .attr('font-size', function (d) { return '40px' })
  .text(function (d) { return '\uf015' })
  .style('cursor', 'pointer');;

// Helper function to format large nunmbers with commas, e.g. 10,000,000
function numberWithCommas(x) {
  if(x) // check it is not undefined
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
