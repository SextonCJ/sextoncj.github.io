

function d3linecharts(data){

        // dataset contains data

        // set the dimensions and margins of the graph
        var margin = {top: 30, right: 30, bottom: 60, left: 50},
            width = 550 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        // select chart_1
        var svg_rep = d3.select("#chart_1")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // select chart_2
        var svg_form = d3.select("#chart_2")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        // List of exercises. adding "Exercise" to front of list as the "all" option
        var allGroup = d3.map(data, function(d){return(d.exercise)}).keys()
        const all_option = ["Exercise"];
        var allGroup = all_option.concat(allGroup)
        var total_groups = allGroup.length;

        // add the options to the button
        d3.select("#selectButton")
          .selectAll('myOptions')
          .data(allGroup)
          .enter()
          .append("option")
          .text(function (d) { return d; }) // text showed in the menu
          .attr("value", function (d) { return d; }) // corresponding value returned by the button

        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
          .domain(allGroup)
          .range(d3.schemeSet2);

        //turn time into datetime object to get into d3.scaletime()
        var parse_date = d3.timeParse("%Y-%m-%d");

        // Add X axis --> it is a date format, for both rep and form charts
        var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return parse_date(d.exercise_ts); }))
              .range([ 0, width ]);
            svg_rep.append("g")
              .attr("transform", "translate(0," + height + ")")
              .attr("class", "x-axis")
              .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m-%d")));
            svg_form.append("g")
              .attr("transform", "translate(0," + height + ")")
              .attr("class", "x-axis")
              .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m-%d")));

        var min_rep = d3.min(data, function(d) { return +d.rep_counter; });
        var max_rep = d3.max(data, function(d) { return +d.rep_counter; });
        var min_form = d3.min(data, function(d) { return +d.good_form_pct; });
        var max_form = d3.max(data, function(d) { return +d.good_form_pct; });

        // Add Y axis for rep
        var y_rep = d3.scaleLinear()
          .domain([min_rep-(max_rep-min_rep)*0.2, max_rep+(max_rep-min_rep)*0.2]) // padding domain so that chart looks better
          .range([ height, 0 ]);
        svg_rep.append("g")
          .attr("class", "y-axis")
          .call(d3.axisLeft(y_rep));

        // Add Y axis for form
        var y_form = d3.scaleLinear()
          .domain([min_form-(max_form-min_form)*0.2, max_form+(max_form-min_form)*0.2]) // padding domain so that chart looks better
          .range([ height, 0 ]);
        svg_form.append("g")
          .call(d3.axisLeft(y_form));

        // default chart is all exercises
        for (var g = 1; g < total_groups; g++){
          //rep line and circles
          // draw line
          svg_rep
            .append('g')
            .append("path")
              .datum(data.filter(function(d){return d.exercise==allGroup[g]}))
              .attr("d", d3.line()
                .x(function(d) { return x(parse_date(d.exercise_ts)); })
                .y(function(d) { return y_rep(+d.rep_counter) })
              )
              .attr("id", allGroup[g].concat("_rep_line"))
              .attr("stroke", function(d){ return myColor(allGroup[g]) })
              .style("stroke-width", 4)
              .style("fill", "none");
          
          // draw circles
          svg_rep.selectAll("line-circle")
            .data(data.filter(function(d){return d.exercise==allGroup[g]}))
            .enter().append("circle")
              .attr("id", allGroup[g].concat("_rep_dots"))
              .attr("stroke", function(d){ return myColor(allGroup[g]) })
              .attr("fill", function(d){ return myColor(allGroup[g]) })
              .attr("class", "data-circle")
              .attr("r", 5)
              .attr("cx", function(d) { return x(parse_date(d.exercise_ts)); })
              .attr("cy", function(d) { return y_rep(+d.rep_counter); });

          //form line and circles
          // draw line
          svg_form
            .append('g')
            .append("path")
              .datum(data.filter(function(d){return d.exercise==allGroup[g]}))
              .attr("d", d3.line()
                .x(function(d) { return x(parse_date(d.exercise_ts)) })
                .y(function(d) { return y_form(+d.good_form_pct) })
              )
              .attr("id", allGroup[g].concat("_form_line"))
              .attr("stroke", function(d){ return myColor(allGroup[g]) })
              .style("stroke-width", 4)
              .style("fill", "none")
          
          // draw circles
            svg_form.selectAll("line-circle")
            .data(data.filter(function(d){return d.exercise==allGroup[g]}))
            .enter().append("circle")
              .attr("id", allGroup[g].concat("_form_dots"))
              .attr("stroke", function(d){ return myColor(allGroup[g]) })
              .attr("fill", function(d){ return myColor(allGroup[g]) })
              .attr("class", "data-circle")
              .attr("r", 5)
              .attr("cx", function(d) { return x(parse_date(d.exercise_ts)); })
              .attr("cy", function(d) { return y_form(+d.good_form_pct); });    
        };

        // A function that update the chart
        function update(selectedGroup) {
          // Create new data with the selection?
          var dataFilter = data.filter(function(d){return d.exercise==selectedGroup})


          for (var g = 1; g < total_groups; g++){
            var hash = "#";
            var id_rep_line = allGroup[g].concat("_rep_line");
            var id_rep_line = hash.concat(id_rep_line);
            var id_rep_circles = allGroup[g].concat("_rep_dots");
            var id_rep_circles = hash.concat(id_rep_circles);
            var id_form_line = allGroup[g].concat("_form_line");
            var id_form_line = hash.concat(id_form_line);
            var id_form_circles = allGroup[g].concat("_form_dots");
            var id_form_circles = hash.concat(id_form_circles);
            
              
            if (selectedGroup == "Exercise") {
              //default rep chart
              d3.select(id_rep_line)
                .datum(data.filter(function(d){return d.exercise==allGroup[g]}))
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                .x(function(d) { return x(parse_date(d.exercise_ts)); })
                .y(function(d) { return y_rep(+d.rep_counter) }))
                .attr("stroke", function(d){ return myColor(allGroup[g]) })
                .style("stroke-width", 4)
                .style("fill", "none");

              d3.selectAll(id_rep_circles)
                .data(data.filter(function(d){return d.exercise==allGroup[g]}))
                .transition()
                .duration(1000)
                .attr("stroke", function(d){ return myColor(allGroup[g]) })
                .attr("fill", function(d){ return myColor(allGroup[g]) })
                .attr("class", "data-circle")
                .attr("r", 5)
                .attr("cx", function(d) { return x(parse_date(d.exercise_ts)); })
                .attr("cy", function(d) { return y_rep(+d.rep_counter); });

              //default form chart
              d3.select(id_form_line)
                .datum(data.filter(function(d){return d.exercise==allGroup[g]}))
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                .x(function(d) { return x(parse_date(d.exercise_ts)); })
                .y(function(d) { return y_form(+d.good_form_pct) }))
                .attr("stroke", function(d){ return myColor(allGroup[g]) })
                .style("stroke-width", 4)
                .style("fill", "none");

              d3.selectAll(id_form_circles)
                .data(data.filter(function(d){return d.exercise==allGroup[g]}))
                .transition()
                .duration(1000)
                .attr("stroke", function(d){ return myColor(allGroup[g]) })
                .attr("fill", function(d){ return myColor(allGroup[g]) })
                .attr("class", "data-circle")
                .attr("r", 5)
                .attr("cx", function(d) { return x(parse_date(d.exercise_ts)); })
                .attr("cy", function(d) { return y_form(+d.good_form_pct); });

            }
            else {
              // update rep line and circles
              d3.select(id_rep_line)
                .datum(dataFilter)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                  .x(function(d) { return x(parse_date(d.exercise_ts)) })
                  .y(function(d) { return y_rep(+d.rep_counter) })
                )
                .attr("stroke", function(d){ return myColor(selectedGroup) });

              d3.selectAll(id_rep_circles)
                .data(dataFilter)
                .transition()
                .duration(1000)
                .attr("stroke", function(d){ return myColor(selectedGroup )})
                .attr("fill", function(d){ return myColor(selectedGroup )})
                .attr("class", "data-circle")
                .attr("r", 5)
                .attr("cx", function(d) { return x(parse_date(d.exercise_ts)); })
                .attr("cy", function(d) { return y_rep(+d.rep_counter); });

              // update form line and circles
              d3.select(id_form_line)
                .datum(dataFilter)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                  .x(function(d) { return x(parse_date(d.exercise_ts)) })
                  .y(function(d) { return y_form(+d.good_form_pct) })
                )
                .attr("stroke", function(d){ return myColor(selectedGroup) });

              d3.selectAll(id_form_circles)
                .data(dataFilter)
                .transition()
                .duration(1000)
                .attr("stroke", function(d){ return myColor(selectedGroup )})
                .attr("fill", function(d){ return myColor(selectedGroup )})
                .attr("class", "data-circle")
                .attr("r", 5)
                .attr("cx", function(d) { return x(parse_date(d.exercise_ts)); })
                .attr("cy", function(d) { return y_form(+d.good_form_pct); });

            }

          }

          // Give these new data to update line
          

        };

        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {

            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value");

            // run the updateChart function with this selected option
            update(selectedOption);
        })


  };


  //change x axis
  //add axis details
  //add other data 
  //get drop down to work -- connect it to data
  //add background
  //get hover if possible
  