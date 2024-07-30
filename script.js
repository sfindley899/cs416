// Define the major dates and corresponding counts for annotations
const total_death_annotations = [
//{ date: "1/25/2020", count: null, label: "January 2020:\nFirst COVID-19 case in the US" },
//{ date: "2/1/2020", count: null, label: "January 2020:\nPublic health emergency declared" },
{ date: "3/14/2020", count: null, label: "March 2020:\nNational emergency declared" },
//{ date: "4/3/2020", count: null, label: "April 2020:\nCDC recommends masks" },
//{ date: "12/12/2020", count: null, label: "December 2020:\nFirst vaccine authorized" },
//{ date: "1/23/2021", count: null, label: "January 2021:\nNew administration's pandemic response" },
{ date: "3/13/2021", count: null, label: "March 2021:\nAmerican Rescue Plan signed" },
{ date: "1/15/2022", count: null, label: "February 2022:\nCDC updates mask guidance" },
//{ date: "7/24/2021", count: null, label: "July 2021:\nCDC updates mask guidance" },
//{ date: "11/6/2021", count: null, label: "November 2021:\nVaccines for children approved" },
{ date: "5/13/2023", count: null, label: "May 2023:\nPublic health emergency ends" }
];

const case_count_annotations = [
{ date: "1/23/2020", count: null, label: "January 2020:\nFirst US COVID-19 case" },
//{ date: "2/1/2020", count: null, label: "January 2020:\nPublic health emergency declared" },
//{ date: "3/14/2020", count: null, label: "March 2020:\nNational emergency declared" },
// { date: "4/23/2020", count: null, label: "April 2020:\nCDC recommends masks" },
{ date: "12/10/2020", count: null, label: "December 2020:\nFirst vaccine authorized" },
//{ date: "1/23/2021", count: null, label: "January 2021:\nNew administration's pandemic response" },
//{ date: "3/13/2021", count: null, label: "March 2021:\nAmerican Rescue Plan signed" },
{ date: "7/22/2021", count: null, label: "July 2021:\nCDC mask guidance" },
{ date: "11/25/2021", count: null, label: "November 2021:\nOmicron variant reported" }, // Added Omicron introduction
//{ date: "11/6/2021", count: null, label: "November 2021:\nVaccines for children approved" },
// { date: "5/4/2023", count: null, label: "May 2023:\nPublic health emergency ends" }
];

const death_count_annotations = [
//  { date: "1/23/2020", count: null, label: "January 2020:\nFirst US COVID-19 case" },
//  { date: "2/1/2020", count: null, label: "January 2020:\nPublic health emergency declared" },
  { date: "3/19/2020", count: null, label: "March 2020:\nNational emergency declared" },
 // { date: "4/23/2020", count: null, label: "April 2020:\nCDC recommends " },
//  { date: "12/14/2020", count: null, label: "December 2020:\nFirst vaccine authorized" },
  { date: "9/3/2020", count: null, label: "September 2020:\nAlpha variant identified" },
//  { date: "5/1/2021", count: null, label: "May 2021:\nBeta variant identified" },
  { date: "6/3/2021", count: null, label: "June 2021:\nDelta variant identified" },
  { date: "11/25/2021", count: null, label: "November 2021:\nOmicron variant reported" },
//  { date: "5/4/2023", count: null, label: "May 2023:\nPublic health emergency ends" }
];

const body = document.body;
const html = document.documentElement;
const height = Math.max(
	html.clientHeight,
	html.scrollHeight,
	html.offsetHeight
);

var monthly_deaths_csv = "ages_monthly_deaths.csv";
var demographics_summary_csv = "race_total_outcomes.csv";
var monthly_age_states_deaths_csv = "pages_states_monthly_dates.csv";
var monthly_gender_dates_csv = "gender_monthly_dates.csv";
var weekly_regional_cases_deaths_csv = "weekly_cases_and_deaths_per_state_region.csv";
var cumulative_deaths_csv = "cumulative_deaths_us.csv";
var weekly_deaths_csv = "data_table_for_weekly_deaths__the_united_states.csv";

// Function to wrap text within a specified width
function wrapText(text, width) {
    text.each(function() {
        const text = d3.select(this),
            words = text.text().split("\n").reverse(),
            lineHeight = 1.1; // ems
        let line = [],
            lineNumber = 0,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy") || 0),
            tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em");

        while (words.length) {
            const word = words.pop();
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

function initializeSlider(data) {
	const parseDate = d3.timeParse("%m/%d/%Y");
	const formatDate = d3.timeFormat("%m/%d/%Y");

	const dates = data.map(d => parseDate(d.date_updated));

	const sliderWidth = document.querySelector("#slider").clientWidth;
	const slider = d3.select("#slider")
		.append("svg")
		.attr("width", sliderWidth)
		.attr("height", 100)
		.append("g")
		.attr("transform", "translate(30,30)");

	const xScale = d3.scaleTime()
		.domain(d3.extent(dates))
		.range([0, sliderWidth - 60])
		.clamp(true);

	slider.append("line")
		.attr("class", "track")
		.attr("x1", xScale.range()[0])
		.attr("x2", xScale.range()[1])
		.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr("class", "track-inset")
		.select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
		.attr("class", "track-overlay")
		.call(d3.drag()
			.on("start.interrupt", function () { slider.interrupt(); })
			.on("start drag", function () {
				hue(xScale.invert(d3.event.x));
			}));

	const handle = slider.insert("circle", ".track-overlay")
		.attr("class", "handle")
		.attr("r", 9);

	const label = slider.append("text")
		.attr("class", "label")
		.attr("text-anchor", "middle")
		.text(formatDate(d3.min(dates)))
		.attr("transform", "translate(0," + (-15) + ")");

	function hue(h) {
		handle.attr("cx", xScale(h));
		label.attr("x", xScale(h))
			.text(formatDate(h));
		d3.select('p#value-range').text(formatDate(h));
	}

	const range = slider.append("g")
		.attr("class", "range");

	return { xScale, handle, label, range };
}

function getDateValue(dateString)
{
	var dateParse = d3.timeParse("%m/%d/%Y");
	return dateParse(dateString);
}

async function initCovidDemographicData() {
	return d3.csv(demographics_summary_csv);
}

async function initCovidMonthlyDeathsData() {
	return d3.csv(monthly_deaths_csv);
}

async function initCovidAgeData() {
	return d3.csv(monthly_age_states_deaths_csv);
}

async function initCovidGenderData() {
	return d3.csv(monthly_gender_dates_csv);
}

async function initCovidWeeklyDeathData() {
	return d3.csv(weekly_deaths_csv);
}

async function initCovidRegionalData() {
	return d3.csv(weekly_regional_cases_deaths_csv);
}

async function initCovidTotalDeathData() {
	return d3.csv(cumulative_deaths_csv);
}

function renderCurrentTrendsGraph() {
    // D3 code to render the current trends graph in the element with id 'current-trends-graph'
}

async function createGenderD3Chart() {
}

async function createCumulativeDeathsChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#total-deaths-chart").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + (margin.left + 20)+ "," + margin.top + ")");

	initCovidTotalDeathData().then(data => {
		data.forEach(d => {
			d.date_value = parseDate(d.date_value);
			d["Cumulative Deaths"] = +d["Cumulative Deaths"];
		});

		x.domain(d3.extent(data, d => d.date_value));
		y.domain([0, d3.max(data, d => d["Cumulative Deaths"])]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		svg.append("g")
			.call(d3.axisLeft(y));

		// X Axis label
		svg.append("text")
			.attr("class", "axis-label")
			.attr("text-anchor", "end")
			.attr("x", width / 2 + margin.left)
			.attr("y", height + margin.top + 40)
			.text("Date");

		// Y Axis label
		svg.append("text")
		    .attr("class", "axis-label")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left)
			.attr("x", -height / 3)
			.text("Cumulative Deaths");

		const area = d3.area()
			.x(d => x(d.date_value))
			.y0(height)
			.y1(d => y(d["Cumulative Deaths"]));

		// Function to format dates as strings for comparison
		const formatDateString = date => d3.timeFormat("%Y-%m-%d")(date);
		const proximityThreshold = 20; // Adjust this value as needed


		svg.append("path")
			.data([data])
			.attr("class", "area")
			.style("stroke", "steelblue")
			.attr("d", area)
		    .on("mousemove", function(event) {
			   const [mouseX, mouseY] = d3.mouse(this);
			   const date = x.invert(mouseX);
			   const dataPoint = data.find(dp => {
				   const annotationValuesX = x(dp.date_value);
				   const annotationValuesY = y(dp["Cumulative Deaths"]);
				   const distanceX = Math.abs(mouseX - annotationValuesX);
				   const distanceY = Math.abs(mouseY - annotationValuesY);
				   return distanceX < proximityThreshold;
			   });

			   if (dataPoint) {
				   const annotationValuesX = x(dataPoint.date_value);
				   const annotationValuesY = y(dataPoint["Cumulative Deaths"]);

				   // Remove existing annotations
				   svg.selectAll(".annotation-line").remove();
				   svg.selectAll(".annotation-text").remove();
				   svg.selectAll(".annotation-rect").remove();

				   // Add dotted line below the point
				   svg.append("line")
					  .attr("class", "annotation-line")
					  .attr("x1", annotationValuesX)
					  .attr("x2", annotationValuesX)
					  .attr("y1", annotationValuesY - 20) // Adjust this value to make the line higher
					  .attr("y2", height) // Extend to the bottom of the SVG
					  .attr("stroke", "black")
					  .attr("stroke-dasharray", "4,4");

				   // Add background rectangle
				   const textGroup = svg.append("g")
										.attr("class", "annotation-text-group");

				   textGroup.append("rect")
							.attr("class", "annotation-rect")
							.attr("x", annotationValuesX - 55)
							.attr("y", annotationValuesY - 40) // Adjust as needed
							.attr("width", 175) // Adjust as needed
							.attr("height", 50) // Adjust as needed
							.attr("fill", "white")
							.attr("stroke", "black");

				// Add text
				const textElement = textGroup.append("text")
											.attr("class", "annotation-text")
											.attr("x", annotationValuesX - 50)
											.attr("y", annotationValuesY - 20) // Elevate the text
											.attr("text-anchor", "start")
											.style("fill", "black")
											.style("font-weight", "bold");

           textElement.selectAll("tspan")
                      .data(["Date: " + dataPoint.date_str, "Total Deaths: " + dataPoint["Cumulative Deaths"]])
                      .enter()
                      .append("tspan")
                      .attr("x", annotationValuesX - 50)
                      .attr("dy", (d, i) => i * 20) // Adjust line spacing as needed
                      .text(d => d);
			   }
		   })
		   .on("mouseout", function() {
			   // Remove annotation
			   svg.selectAll(".annotation-line").remove();
			   svg.selectAll(".annotation-text").remove();
			   svg.selectAll(".annotation-rect").remove();
		   });


		const line = d3.line()
			.x(d => x(d.date_value))
			.y(d => y(d["Cumulative Deaths"]));

		svg.append("path")
		   .data([data])
		   .attr("class", "line")
		   .attr("d", line)
		   .style("fill", "none")
		   .style("stroke", "steelblue")
		   .style("stroke-width", "2px");

		// Add annotations to the chart
		total_death_annotations.forEach(ann => {
			console.log(parseDate(ann.date))
			const dataPoint = data.find(d => formatDateString(d.date_value) === formatDateString(parseDate(ann.date)));
			if (dataPoint) {
			const annotationX = x(parseDate(ann.date));
			const annotationY = y(dataPoint["Cumulative Deaths"]) - 15;

			svg.append("line")
				.attr("x1", annotationX)
				.attr("x2", annotationX + 50)
				.attr("y1", height)
				.attr("y2", annotationY)
				.attr("stroke", "black")
				.attr("stroke-dasharray", "2,2");

			svg.append("rect")
				.attr("x", annotationX + 5)
				.attr("y", annotationY - 40)
				.attr("width", 240)
				.attr("height", 60)
				.attr("fill", "black")
				.attr("opacity", 0.7);

			svg.append("text")
				.attr("x", annotationX + 10)
				.attr("y", annotationY - 15)
				.attr("text-anchor", "start")
				.attr("class", "annotation")
				.attr("fill", "white")
				.style("font-weight", "bold")
				.text(ann.label)
				.call(wrapText, 150); // Function to wrap text within the specified width	
			}
		});
	});
}

async function createCasesWeeklyChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height - 50, 0]);
	const formatDateString = date => d3.timeFormat("%Y-%m-%d")(date);

	const svg = d3.select("#cases-chart").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform",
			"translate(" + (margin.left + 30) + "," + margin.top + ")");

     initCovidRegionalData().then(data => {
		data.forEach(d => {
			d.date_updated = parseDate(d.date_updated)			
		});

		// Aggregate data by date
		const aggregatedData = d3.nest()
			.key(d => d.start_date)
			.rollup(v => ({
				total_cases: d3.sum(v, d => +d.abs_new_cases),
				first_date: v[0].start_date, // Use the first start_date
				legend: v[0].legend, // Use the first start_date
			}))
			.entries(data)
			.map(d => ({
				date: new Date(d.key),
				value: d.value.total_cases,
				current_date: d.value.first_date, // Include the first start_date
				legend: d.value.legend
			}));

		x.domain(d3.extent(aggregatedData, d => d.date));
		y.domain([0, d3.max(aggregatedData, d => d.value)]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		svg.append("g")
			.call(d3.axisLeft(y));

		// X Axis label
		svg.append("text")
		    .attr("class", "axis-label")
			.attr("text-anchor", "end")
			.attr("x", width / 2 + margin.left)
			.attr("y", height + margin.top + 40)
			.text("Date");

		// Y Axis label
		svg.append("text")
		    .attr("class", "axis-label")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left)
			.attr("x", -height / 3)
			.text("New Cases per Week");

		const area = d3.area()
			.x(d => x(d.date))
			.y0(height)
			.y1(d => y(d.value));

		const proximityThreshold = 20; // Adjust this value as needed

		svg.append("path")
			.datum(aggregatedData)
			.attr("class", "area")
			.attr("d", area)
		    .on("mousemove", function(event) {
			   const [mouseX, mouseY] = d3.mouse(this);
			   const date = x.invert(mouseX);
			   const dataPoint = aggregatedData.find(dp => {
				   
				   console.log(dp)
				   const annotationValuesX = x( parseDate(dp.current_date));
				   const annotationValuesY = y(dp.value);
					console.log(annotationValuesY)
				   const distance = Math.abs(mouseX - annotationValuesX);
				   return distance < proximityThreshold;
			   });

			   if (dataPoint) {
				   const annotationValuesX = x(parseDate(dataPoint.current_date));
				   const annotationValuesY = y(dataPoint.value);

				   // Remove existing annotations
				   svg.selectAll(".annotation-line").remove();
				   svg.selectAll(".annotation-text").remove();
				   svg.selectAll(".annotation-rect").remove();

				   // Add dotted line below the point
				   svg.append("line")
					  .attr("class", "annotation-line")
					  .attr("x1", annotationValuesX)
					  .attr("x2", annotationValuesX)
					  .attr("y1", annotationValuesY - 20) // Adjust this value to make the line higher
					  .attr("y2", height) // Extend to the bottom of the SVG
					  .attr("stroke", "black")
					  .attr("stroke-dasharray", "4,4");

					
					// Add background rectangle
				   const textGroup = svg.append("g")
										.attr("class", "annotation-text-group");

				   textGroup.append("rect")
							.attr("class", "annotation-rect")
							.attr("x", annotationValuesX - 55)
							.attr("y", annotationValuesY - 40) // Adjust as needed
							.attr("width", 185) // Adjust as needed
							.attr("height", 50) // Adjust as needed
							.attr("fill", "white")
							.attr("stroke", "black");

				// Add text
				const textElement = textGroup.append("text")
											.attr("class", "annotation-text")
											.attr("x", annotationValuesX - 50)
											.attr("y", annotationValuesY - 15) // Elevate the text
											.attr("text-anchor", "start")
											.style("fill", "black")
											.style("font-weight", "bold");

           textElement.selectAll("tspan")
                      .data(["Date: " + dataPoint.legend, "Weekly Cases: " + dataPoint.value])
                      .enter()
                      .append("tspan")
                      .attr("x", annotationValuesX - 50)
                      .attr("dy", (d, i) => i * 20) // Adjust line spacing as needed
                      .text(d => d);
			   }
		   })
		   .on("mouseout", function() {
			   // Remove annotation
			   svg.selectAll(".annotation-line").remove();
			   svg.selectAll(".annotation-text").remove();
			   svg.selectAll(".annotation-rect").remove();
		   });


		const line = d3.line()
			.x(d => x(d.date))
			.y(d => y(d.value));

		svg.append("path")
			.datum(aggregatedData)
			.attr("class", "line")
			.attr("d", line);

		// Add annotations to the chart
		case_count_annotations.forEach((ann, index) => {
			console.log(parseDate(ann.date))
			const dataPoint = data.find(d => formatDateString(d.date_updated) === formatDateString(parseDate(ann.date)));
			if (dataPoint) {
			console.log("found data point")
			const annotationX = x(parseDate(ann.date));
			const annotationY = 250 - 65  * index;

			svg.append("line")
				.attr("x2", annotationX + 40)
				.attr("x1", annotationX)
				.attr("y1", height)
				.attr("y2", annotationY)
				.attr("stroke", "black")
				.attr("stroke-dasharray", "2,2");

			svg.append("rect")
				.attr("x", annotationX + 5)
				.attr("y", annotationY - 40)
				.attr("width", 230)
				.attr("height", 60)
				.attr("fill", "black")
				.attr("opacity", 0.7);

			svg.append("text")
				.attr("x", annotationX + 30)
				.attr("y", annotationY - 15)
				.attr("text-anchor", "start")
				.attr("class", "annotation")
				.attr("fill", "white")
				.style("font-weight", "bold")
				.text(ann.label)
				.call(wrapText, 150); // Function to wrap text within the specified width	
			}
		});
	});
}

async function createDeathsWeeklyChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height - 50, 0]);
	const formatDateString = date => d3.timeFormat("%Y-%m-%d")(date);

	const svg = d3.select("#deaths-chart").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform",
			"translate(" + (margin.left + 30) + "," + margin.top + ")");

     initCovidRegionalData().then(data => {
		data.forEach(d => {
			d.date_updated = parseDate(d.date_updated)			
		});

		// Aggregate data by date
		const aggregatedData = d3.nest()
			.key(d => d.start_date)
			.rollup(v => ({
				new_deaths: d3.sum(v, d => +d.new_deaths),
				first_date: v[0].start_date, // Use the first start_date
				legend: v[0].legend, // Use the first start_date
			}))
			.entries(data)
			.map(d => ({
				date: new Date(d.key),
				value: d.value.new_deaths,
				current_date: d.value.first_date, // Include the first start_date
				legend: d.value.legend
			}));

		x.domain(d3.extent(aggregatedData, d => d.date));
		y.domain([0, d3.max(aggregatedData, d => d.value)]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		svg.append("g")
			.call(d3.axisLeft(y));

		// X Axis label
		svg.append("text")
		    .attr("class", "axis-label")
			.attr("text-anchor", "end")
			.attr("x", width / 2 + margin.left)
			.attr("y", height + margin.top + 40)
			.text("Date");

		// Y Axis label
		svg.append("text")
		    .attr("class", "axis-label")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left)
			.attr("x", -height / 3)
			.text("New Deaths per Week");

		const area = d3.area()
			.x(d => x(d.date))
			.y0(height)
			.y1(d => y(d.value));

		const proximityThreshold = 20; // Adjust this value as needed

		svg.append("path")
			.datum(aggregatedData)
			.attr("class", "area")
			.attr("d", area)
		    .on("mousemove", function(event) {
			   const [mouseX, mouseY] = d3.mouse(this);
			   const date = x.invert(mouseX);
			   const dataPoint = aggregatedData.find(dp => {
				   
				   console.log(dp)
				   const annotationValuesX = x( parseDate(dp.current_date));
				   const annotationValuesY = y(dp.value);
					console.log(annotationValuesY)
				   const distance = Math.abs(mouseX - annotationValuesX);
				   return distance < proximityThreshold;
			   });

			   if (dataPoint) {
				   const annotationValuesX = x(parseDate(dataPoint.current_date));
				   const annotationValuesY = y(dataPoint.value);

				   // Remove existing annotations
				   svg.selectAll(".annotation-line").remove();
				   svg.selectAll(".annotation-text").remove();
				   svg.selectAll(".annotation-rect").remove();

				   // Add dotted line below the point
				   svg.append("line")
					  .attr("class", "annotation-line")
					  .attr("x1", annotationValuesX)
					  .attr("x2", annotationValuesX)
					  .attr("y1", annotationValuesY - 20) // Adjust this value to make the line higher
					  .attr("y2", height) // Extend to the bottom of the SVG
					  .attr("stroke", "black")
					  .attr("stroke-dasharray", "4,4");

					
					// Add background rectangle
				   const textGroup = svg.append("g")
										.attr("class", "annotation-text-group");

				   textGroup.append("rect")
							.attr("class", "annotation-rect")
							.attr("x", annotationValuesX - 55)
							.attr("y", annotationValuesY - 40) // Adjust as needed
							.attr("width", 185) // Adjust as needed
							.attr("height", 50) // Adjust as needed
							.attr("fill", "white")
							.attr("stroke", "black");

				// Add text
				const textElement = textGroup.append("text")
											.attr("class", "annotation-text")
											.attr("x", annotationValuesX - 50)
											.attr("y", annotationValuesY - 15) // Elevate the text
											.attr("text-anchor", "start")
											.style("fill", "black")
											.style("font-weight", "bold");

           textElement.selectAll("tspan")
                      .data(["Date: " + dataPoint.legend, "Weekly Deaths: " + dataPoint.value])
                      .enter()
                      .append("tspan")
                      .attr("x", annotationValuesX - 50)
                      .attr("dy", (d, i) => i * 20) // Adjust line spacing as needed
                      .text(d => d);
			   }
		   })
		   .on("mouseout", function() {
			   // Remove annotation
			   svg.selectAll(".annotation-line").remove();
			   svg.selectAll(".annotation-text").remove();
			   svg.selectAll(".annotation-rect").remove();
		   });


		const line = d3.line()
			.x(d => x(d.date))
			.y(d => y(d.value));

		svg.append("path")
			.datum(aggregatedData)
			.attr("class", "line")
			.attr("d", line);

		// Add annotations to the chart
		death_count_annotations.forEach((ann, index) => {
			console.log(parseDate(ann.date))
			const dataPoint = data.find(d => formatDateString(d.date_updated) === formatDateString(parseDate(ann.date)));
			if (dataPoint) {
			console.log("found data point")
			const annotationX = x(parseDate(ann.date));
			const annotationY = 250 - 65  * index;

			svg.append("line")
				.attr("x2", annotationX + 40)
				.attr("x1", annotationX)
				.attr("y1", height)
				.attr("y2", annotationY)
				.attr("stroke", "black")
				.attr("stroke-dasharray", "2,2");
	
			svg.append("line")
				.attr("x2", annotationX + 40)
				.attr("x1", annotationX)
				.attr("y1", height)
				.attr("y2", annotationY)
				.attr("stroke", "black")
				.attr("stroke-dasharray", "2,2");

			svg.append("rect")
				.attr("x", annotationX + 5)
				.attr("y", annotationY - 40)
				.attr("width", 230)
				.attr("height", 60)
				.attr("fill", "black")
				.attr("opacity", 0.7);

			svg.append("text")
				.attr("x", annotationX + 30)
				.attr("y", annotationY - 15)
				.attr("text-anchor", "start")
				.attr("class", "annotation")
				.attr("fill", "white")
				.style("font-weight", "bold")
				.text(ann.label)
				.call(wrapText, 150); // Function to wrap text within the specified width	
			}
		});
	});
}

function createDropdownOptions(data) {
	const uniqueStates = [...new Set(data.map(d => d.state_full))];
	const select = d3.select("#state-select");
	uniqueStates.forEach(state => {
		select.append("option").attr("value", state).text(state);
	});
}

function updateRegionalChart(data, selectedStates, startDate, endDate) {

	const parseDate = d3.timeParse("%m/%d/%Y");
	const formatDate = d3.timeFormat("%m/%d/%Y");

	const margin = { top: 30, right: 220, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	// Clear existing SVG
	d3.select("#interactive-chart").selectAll("*").remove();

	const svg = d3.select("#interactive-chart").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Filter data based on selected states and date range
	const filteredData = data.filter(d => 
		selectedStates.includes(d.state_full) &&
		d.date_updated >= parseDate(startDate) &&
		d.date_updated <= parseDate(endDate)
	);

	// Parse dates and convert new cases to numbers
	filteredData.forEach(d => {
		d.date_updated = parseDate(d.date_updated);
		d.new_deaths = +d.new_deaths;
	});

	// Group data by state
	const groupedData = d3.nest()
		.key(d => d.state_full)
		.entries(filteredData);

	x.domain(d3.extent(filteredData, d => d.date_updated));
	y.domain([0, d3.max(filteredData, d => d.new_deaths)]);

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	svg.append("g")
		.call(d3.axisLeft(y));

	// Define a color scale
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// Plot each state's data with a different color
	groupedData.forEach((stateData, i) => {
		const line = d3.line()
			.x(d => x(d.date_updated))
			.y(d => y(d.new_deaths));

		svg.append("path")
			.datum(stateData.values)
			.attr("class", "line")
			.attr("d", line)
			.attr("stroke", color(i));

//		// Add a random annotation for each state using modulo
//		const randomIndex = i % stateData.values.length;
//		const randomDataPoint = stateData.values[randomIndex];
//
//		const annotationX = x(randomDataPoint.date_updated) + 55;
//		const annotationY = y(randomDataPoint.new_deaths) - 55;
//		const randomYOffset = Math.random() * (height - y(randomDataPoint.new_deaths) - 20);
//
//		svg.append("line")
//			.attr("x1", x(randomDataPoint.date_updated))
//			.attr("x2", annotationX)
//			.attr("y1", y(randomDataPoint.new_deaths))
//			.attr("y2", y(randomDataPoint.new_deaths) + randomYOffset)
//			.attr("stroke", color(i))
//			.attr("stroke-dasharray", "2,2");
//
//		svg.append("text")
//			.attr("x", annotationX + 5)  // Adding extra space for clarity
//			.attr("y", y(randomDataPoint.new_deaths) + randomYOffset)
//			.attr("text-anchor", "start")
//			.attr("class", "legend")
//			.style("fill", color(i))
//			.text(stateData.key);
	});

	// Add axis labels
	svg.append("text")
	    .attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("x", width / 2 + margin.left)
		.attr("y", height + margin.top + 40)
		.text("Date");

	svg.append("text")
	    .attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left + 20)
		.attr("x", -height / 3)
		.text("New Deaths per Week");

	// Create legend
	const legend = svg.append("g")
		.attr("class", "legend-container")
		.attr("transform", `translate(${width + 20}, ${margin.top})`);

	// Add background and border for legend
	const legendWidth = 150;
	const legendHeight = groupedData.length * 20 + 60; // Adjusted for margin


	legend.append("rect")
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("class", "legend-bg");

	// Add legend title
	legend.append("text")
		.attr("x", legendWidth / 2)
		.attr("y", 20)
		.attr("class", "legend-title")
		.attr("text-anchor", "middle")
		.text("States");


	// Plot each state's data with a different color
	groupedData.forEach((stateData, i) => {
		const line = d3.line()
			.x(d => x(d.date_updated))
			.y(d => y(d.new_deaths));

		svg.append("path")
			.datum(stateData.values)
			.attr("class", "line")
			.attr("d", line)
			.attr("stroke", color(i));

		// Add a random annotation for each state using modulo
		const randomIndex = 10 + (i * 25) % (stateData.values.length - 10);
		const randomDataPoint = stateData.values[randomIndex];

		const annotationX = x(randomDataPoint.date_updated) + 55;
		const annotationY = y(randomDataPoint.new_deaths) - 55;

		svg.append("line")
			.attr("x1", x(randomDataPoint.date_updated))
			.attr("x2", annotationX)
			.attr("y1", y(randomDataPoint.new_deaths))
			.attr("y2", annotationY)
			.attr("stroke", color(i))
			.attr("stroke-dasharray", "2,2");

		svg.append("text")
			.attr("x", annotationX + 5)  // Adding extra space for clarity
			.attr("y", annotationY)
			.attr("text-anchor", "start")
			.attr("class", "legend")
			.style("fill", color(i))
			.text(stateData.key);

		// Legend
		const legendRow = legend.append("g")
		      .attr("class", "legend-row")
              .attr("transform", `translate(15, ${i * 20 + 40})`); // Adjusted for margin


		legendRow.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("class", "legend-box")
			.attr("fill", color(i));


		legendRow.append("text")
			.attr("x", 20)
			.attr("y", 10)
			.attr("class", "legend")
			.text(stateData.key);
	});
}

async function initializeRegionalChart(data) {
	
    const parseDate = d3.timeParse("%m/%d/%Y");
	const margin = { top: 30, right: 220, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#interactive-chart").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Parse dates and convert new cases to numbers
	data.forEach(d => {
		d.date_updated = parseDate(d.date_updated);
		d.new_deaths = +d.new_deaths;
	});

	// Group data by state
	const groupedData = d3.nest()
		.key(d => d.state_full)
		.entries(data);

	x.domain(d3.extent(data, d => d.date_updated));
	y.domain([0, d3.max(data, d => d.new_deaths)]);

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	svg.append("g")
		.call(d3.axisLeft(y));

	// Define a color scale
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// Plot each state's data with a different color
	groupedData.forEach((stateData, i) => {
		const line = d3.line()
			.x(d => x(d.date_updated))
			.y(d => y(d.new_deaths));

		svg.append("path")
			.datum(stateData.values)
			.attr("class", "line")
			.attr("d", line)
			.attr("stroke", color(i));
	});

	// Add axis labels
	svg.append("text")
	    .attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("x", width / 2 + margin.left)
		.attr("y", height + margin.top + 40)
		.text("Date");

	svg.append("text")
	    .attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-90)")
		.attr("y", -margin.left + 20)
		.attr("x", -height / 3)
		.text("New Deaths per Week");

	// Create legend
	const legend = svg.append("g")
	    .attr("class", "legend-container")
		.attr("transform", `translate(${width + 20}, ${margin.top})`);

	// Add background and border for legend
	const legendWidth = 150;
	const legendHeight = groupedData.length * 3 + 40; // Adjusted for margin


	legend.append("rect")
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("class", "legend-bg");

	// Add legend title
	legend.append("text")
		.attr("x", legendWidth / 2)
		.attr("y", 20)
		.attr("class", "legend-title")
		.attr("text-anchor", "middle")
		.text("States");


	// Plot each state's data with a different color
	groupedData.forEach((stateData, i) => {
		const line = d3.line()
			.x(d => x(d.date_updated))
			.y(d => y(d.new_deaths));

		svg.append("path")
			.datum(stateData.values)
			.attr("class", "line")
			.attr("d", line)
			.attr("stroke", color(i));

	    const column = i % 7;
		const row = Math.floor(i / 7);
		const legendRow = legend.append("g")
			.attr("class", "legend-row")
			.attr("transform", `translate(${column * 50 + 15}, ${row * 20 + 40})`); // Adjusted for margin and columns
		
		// Add a random annotation for each state using modulo
		const randomIndex = 10 + (i * 25) % (stateData.values.length - 10);
		const randomDataPoint = stateData.values[randomIndex];

		const annotationX = x(randomDataPoint.date_updated) + 55;
		const annotationY = y(randomDataPoint.new_deaths) - 55;

		svg.append("line")
			.attr("x1", x(randomDataPoint.date_updated))
			.attr("x2", annotationX)
			.attr("y1", y(randomDataPoint.new_deaths))
			.attr("y2", annotationY)
			.attr("stroke", color(i))
			.attr("stroke-dasharray", "2,2");

		svg.append("text")
			.attr("x", annotationX + 5)  // Adding extra space for clarity
			.attr("y", annotationY)
			.attr("text-anchor", "start")
			.attr("class", "legend")
			.style("fill", color(i))
			.text(stateData.key);

		legendRow.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("class", "legend-box")
			.attr("fill", color(i));


		legendRow.append("text")
			.attr("x", 20)
			.attr("y", 10)
			.attr("class", "legend")
			.text(stateData.key);
	});
}

async function updateChartEntryFunc() {
	const data = await initCovidRegionalData();
	createDropdownOptions(data);

	// Initialize the chart with the full dataset
	initializeRegionalChart(data);

	// Initialize the date range slider
	const slider = initializeSlider(data);

	d3.select("#interactive-chart").on("click", () => {
		const selectedStates = Array.from(document.getElementById("state-select").selectedOptions).map(option => option.value);
        const dateRange = slider.value();
		updateRegionalChart(data, selectedStates, startDate, endDate);
	});
}

async function loadInteractiveD3Chart() {
}

async function loadGenderD3Chart() {
	createGenderD3Chart();
}

async function loadDeathsWeeklyD3Chart() {
	createDeathsWeeklyChart();
}

async function loadCasesWeeklyD3Chart() {
	createCasesWeeklyChart();
}

async function totalDeathsD3Chart() {
	createCumulativeDeathsChart();
}

async function loadCasesWeeklyMidwestD3Chart() {
	createCasesWeeklyMidwestChart();
}

async function loadCasesWeeklyWestD3Chart() {
	createCasesWeeklyWestChart();
}

async function loadCasesWeeklyNortheastD3Chart() {
	createCasesWeeklyNortheastChart();
}

async function loadCasesWeeklySouthD3Chart() {
	createCasesWeeklySouthChart();
}
