// Chart Params
var svgWidth = 900;
var svgHeight = 550;

var margin = { top: 20, right: 40, bottom: 80, left: 90 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter") 
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("assets/data/data.csv").then(function(demoData) {
  console.log(demoData);
  console.log([demoData]);


  // Format the data
  demoData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.smokes = +data.smokes;
  });


  // Create scaling functions
  var xIncome = d3.scaleLinear()
    .domain(d3.extent(demoData, d => d.income))
    .range([0, width]);

  var xPoverty = d3.scaleLinear()
    .domain(d3.extent(demoData, d => d.poverty))
    .range([0,width]);
  
  var xAge = d3.scaleLinear()
    .domain(d3.extent(demoData, d => d.age))
    .range([0, width]);

  // function newYScale('Obesity'){
  //   var newScale = d3.scaleLinear()
  //   return newScale
  // }

  // var chosenYDemo =  
  // var yObesity = d3.scaleLinear()
  //   .domain(d3.extent(demoData, d => d[`${chosenYDemo}`]))
  //   .range([height, 0]);

  var yObesity = d3.scaleLinear()
    .domain(d3.extent(demoData, d => d.obesity))
    .range([height, 0]);

  var yHealthcare = d3.scaleLinear()
    .domain(d3.extent(demoData, d => d.healthcare))
    .range([height, 0]);

  var ySmokes = d3.scaleLinear()
    .domain(d3.extent(demoData, d => d.smokes))
    .range([height, 0]);


  // Create x-axis functions
  var bottomAxisIncome = d3.axisBottom(xIncome);
  var bottomAxisPoverty = d3.axisBottom(xPoverty);
  var bottomAxisAge = d3.axisBottom(xAge);

  // Create y-axis functions
  var leftAxisObesity = d3.axisLeft(yObesity);
  var leftAxisHealth = d3.axisLeft(yHealthcare);
  var leftAxisSmokes = d3.axisLeft(ySmokes);


  // Add x-axes to bottom of the display
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisIncome);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisPoverty);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisAge);

  // Add y-axes to the left side of the display
  chartGroup.append("g")                        
    .call(leftAxisObesity);

  chartGroup.append("g")                           
    .call(leftAxisHealth);

  chartGroup.append("g")                            
    .call(leftAxisSmokes);

  // Append x-axes titles
  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("axis-text text", true)
    .text("Household Income(median)"); 

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("axis-text text", true)
    .text("Poverty Rate(%)");

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 54})`)
    .classed("axis-text text", true)
    .text("Age(median)");

  // Append y-axes titles
  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-38, ${height/2})rotate(-90)`)
    .classed("axis-text text", true)
    .text("Obesity Rate(%)");

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-57, ${height/2})rotate(-90)`)
    .classed("axis-text text", true)
    .text("Lacks Healthcare(%)");

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-76, ${height/2})rotate(-90)`)
    .classed("axis-text text", true)
    .text("Smokes(%)");
  
// ******To change which x or y chart, would you change xIncome/yObesity to a variable that**** 
// ******holds all 3 for each? And set that variable to mouseclick.change? What would you ****
// ******set d.income/d.obesity to?             ****
// create dict/object to text set for each. Then when the text is clicked, it calls the function for that data
// 1. Define Axis
//    -Creating Scale based on new X, Y ranges
//    -Draw the Axis based on Scale
// 2. Calculate X, Y location for each Circle
// 3. Event Handler
//    -When X-Axis or Y-Axis is clicked, rescale X or Y and replot


// Create tooltip
var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`<strong>Poverty Rate: ${(d.poverty)}<br>Median 
    Income: ${d.income}</strong>`);
});

// Call the tooltip
chartGroup.call(toolTip);

// Plot data points onto chart, save into a variable
  var circlesGroup = chartGroup.selectAll("circle")
  .data(demoData)
  .enter()
  .append("circle")
  .attr("cx", (d, i) => xIncome(d.income, i))
  .attr("cy", d => yObesity(d.obesity))
  .attr("r", "12")
  .attr("stroke", "steelblue")
  .attr("fill", "lightblue")
  .style('opacity', .5);

  // Append text in plot circles            ******NOT WORKING*****
  // circlesGroup.append("text")
  //   .attr("dx", function(d){return d.income})
  //   .text(function(d){return d.abbr});
  
  // circlesGroup.insert("text")
  //   .text(function(d){return d.abbr});

  // ***!! DO I NEED TO USE: 'D3.SELECT' TO APPEND THE TEXT?*****

  circlesGroup.append('text')
    .attr('dx', function(d){
      return xIncome(d.income);
    })
    .attr('dy', function(d){
      return yObesity(d.obesity);
    })
    .text(function(d){
      return d.abbr;
    });
  

// Set function to expand radius on mouseover    ******NOT WORKING****
  circlesGroup.on("mouseover", function() {
    d3.select(this)
    .transition()
    .duration(500)
    .attr("r", 25)

  })
    .on("mouseout", function(d) {
      d3.select(this)
      .attr("r", 12);
    })

  // Set tooltip display on mouseover
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
    })
    .on("mouseout", function(d) {
      toolTip.hide(d)
    });
  

// style.css dynamic function isn't working? Not working b/c we set the size of the chart, so that overrides what bootstrap is trying to do.
// Can't figure out how to put abbr into circles


// function onClick(d, i) {
//  alert(`Hey! I already told you, ${pizzasEatenByMonth[i]} pizzas!`)
// }
// circlesGroup.on("mouseover", onMouseover)
//  .on("mouseout", onMouseout)
//  .on("click", onClick);




}
, function(error) {
console.log(error);
});



    // toolTip.style("display", "block");
    // // toolTip.html(`Poverty Rate: <strong>${d['put variable string in here']}</strong>`)
    //   .style("left", d3.event.pageX + "px")
    //   .style("top", d3.event.pageY + "px");

// d3.json("data.json", function(json) {
//   /* Define the data for the circles */
//   var elem = svg.selectAll("g myCircleText")
//       .data(json.nodes)
// /*Create and place the "blocks" containing the circle and the text */  
// var elemEnter = elem.enter()
// .append("g")
// .attr("transform", function(d){return "translate("+d.x+",80)"})

// /*Create the circle for each block */
// var circle = elemEnter.append("circle")
// .attr("r", function(d){return d.r} )
// .attr("stroke","black")
// .attr("fill", "black")

// /* Create the text for each block */
// elemEnter.append("text")
// .attr("dx", function(d){return -20})
// .text(function(d){return d.label})
// })





// //You can put multiple functionality on a single element!
// function onClick(d, i) {
//  alert(`Hey! I already told you, ${pizzasEatenByMonth[i]} pizzas!`)
// }
// circlesGroup.on("mouseover", onMouseover)
//  .on("mouseout", onMouseout)
//  .on("click", onClick);
