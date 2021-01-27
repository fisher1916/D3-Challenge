// Chart Params
var svgWidth = 800;
var svgHeight = 550;

var margin = { top: 20, right: 40, bottom: 80, left: 60 };

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

  var yObesity = d3.scaleLinear()
    .domain(d3.extent(demoData, d => d.obesity))
    .range([height, 0]);

  // Create x-axis functions
  var bottomAxisIncome = d3.axisBottom(xIncome);

  // Create y-axis functions
  var leftAxisObesity = d3.axisLeft(yObesity);

  // Add x-axes to bottom of the display
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisIncome);

  // Add y-axes to the left side of the display
  chartGroup.append("g")                        
    .call(leftAxisObesity);

  // Append x-axes titles
  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("axis-text text", true)
    .text("Household Income(median)"); 

  // Append y-axes titles
  chartGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-38, ${height/2})rotate(-90)`)
    .classed("axis-text text", true)
    .text("Obesity Rate(%)");

    // Create tooltip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
        return `<strong>${(d.state)}<br>Median 
        Income: ${d.income}<br>Obesity Rate: ${(d.obesity)}</strong>`;
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
    .attr("r", "15")
    .attr("stroke", "steelblue")
    .attr("fill", "lightblue")    

  // Add state abbreviation text to the center of each circle
  var circleLabel = chartGroup
    .selectAll(null)
    .data(demoData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr('x', (d) => xIncome(d.income))
    .attr('y', (d) => yObesity(d.obesity))
    .attr('dy', '0.4em')
    .text((d) => d.abbr);

  // Display tooltip and expand radius on mouseover
  circleLabel.on("mouseover", function(d) {
    d3.select(this)
    .attr("r", 25)
    toolTip.show(d, this);
    })
  .on("mouseout", function(d) {
      d3.select(this)
      .attr("r", 15);
      toolTip.hide(d)
    });

  circlesGroup.on("mouseover", function(d) {
    d3.select(this)
    .attr("r", 25)
    toolTip.show(d, this);
    })
    .on("mouseout", function(d) {
      d3.select(this)
      .attr("r", 15);
      toolTip.hide(d)
    }); 

    }
, function(error) {
console.log(error);
});

