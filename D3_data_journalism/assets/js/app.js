// Chart Params
var svgWidth = 1000;
var svgHeight = 600;

var margin = { top: 20, right: 40, bottom: 80, left: 130 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// *********** Why aren't we selecting ("scatter") instead?************
var svg = d3
  .select("body") 
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
    .domain(d3.extent(demoData, d=> d.age))
    .range([0, width]);

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


  // Add x1-axis to bottom of the display
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisIncome);

  // Add x2-axis 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisPoverty);

  // Add x3-axis 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisAge);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text   ******THIS IS NOT CHANGING THE COLOR************
    .classed("green", true)                             
    .call(leftAxisObesity);

  // Add y2-axis to left side of the display
  chartGroup.append("g")
    .classed("green", true)                             
    .call(leftAxisHealth);

  // Add y3-axis to left side of the display
  chartGroup.append("g")
    .classed("green", true)                             
    .call(leftAxisSmokes);


  // Append x axis titles
  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("income-text text", true)
    .text("Household Income(median)"); 

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("poverty-text text", true)
    .text("Poverty Rate(%)");

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 54})`)
    .classed("age-text text", true)
    .text("Age(median)");

  // Append y axis titles
  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-38, ${height/2})rotate(-90)`)
    .classed("obesity-text text", true)
    .text("Obesity Rate(%)");

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-57, ${height/2})rotate(-90)`)
    .classed("healthcare-text text", true)
    .text("Lacks Healthcare(%)");

  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-76, ${height/2})rotate(-90)`)
    .classed("smokes-text text", true)
    .text("Smokes(%)");
  
// ******To change which x or y chart, would you change xIncome/yObesity to a variable that**** 
// ******holds all 3 for each? And set that variable to mouseclick.change? What would you ****
// ******set d.income/d.obesity to?             ****

// Plot data points onto chart, save into a variable
  var circlesGroup = chartGroup.selectAll("circle")
  .data(demoData)
  .enter()
  .append("circle")
  .attr("cx", (d, i) => xIncome(d.income, i))
  .attr("cy", d => yObesity(d.obesity))
  .attr("r", "8")
  .attr("stroke", "white")
  .attr("fill", "lightblue");


 var toolTip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

  function onClick(d,i) {
    toolTip.style("display", "block");
    toolTip.html(`Poverty Rate: <strong>${d.poverty[i]}</strong>`)
  }


// Expand radius of plot data points on mouseover
  circlesGroup.on("mouseover", function() {
    d3.select(this)
    .transition()
    .duration(500)
    .attr("r", 20)
    .on("click", onClick);

  })
    .on("mouseout", function() {
      d3.select(this)
      .transition()
      .duration(500)
      .attr("r", 8);
    })



// style.css dynamic function isn't working?
// onClick isn't working
// Can't figure out how to put abbr into circles







}
, function(error) {
console.log(error);
});




// // append circles to data points
// // Note that I've saved these into a new variable - now I
// // can reference these elements and their bound data when needed!


// // part a: append a div to the body. This is empty at time
// // of creation.
// var toolTip = d3.select("body")
//  .append("div")
//  .attr("class", "tooltip");

// // part b: create handlers
// function onMouseover(d, i) {
//  toolTip.style("display", "block");
//  toolTip.html(`Pizzas eaten: <strong>${pizzasEatenByMonth[i]}</strong>`)
//    .style("left", d3.event.pageX + "px")
//    .style("top", d3.event.pageY + "px");
// }

// function onMouseout(d, i) {
//  toolTip.style("display", "none");
// }

// // part c: add event listener
// circlesGroup.on("mouseover", onMouseover).on("mouseout", onMouseout);


// //You can put multiple functionality on a single element!
// function onClick(d, i) {
//  alert(`Hey! I already told you, ${pizzasEatenByMonth[i]} pizzas!`)
// }
// circlesGroup.on("mouseover", onMouseover)
//  .on("mouseout", onMouseout)
//  .on("click", onClick);
