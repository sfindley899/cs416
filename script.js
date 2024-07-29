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

async function createDeathsWeeklyChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#deaths-chart").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform",
			"translate(" + (margin.left + 20) + "," + margin.top + ")");

	initCovidWeeklyDeathData().then(data => {
		data.forEach(d => {
			d.date = parseDate(d.date);
			d.weekly_deaths = +d.weekly_deaths;
		});

		x.domain(d3.extent(data, d => d.date));
		y.domain([0, d3.max(data, d => d.weekly_deaths)]);

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
			.attr("y", -margin.left + 20)
			.attr("x", -height / 3)
			.text("New Deaths per Week");

		const area = d3.area()
			.x(d => x(d.date))
			.y0(height)
			.y1(d => y(d.weekly_deaths));

		svg.append("path")
			.data([data])
			.attr("class", "area")
			.attr("d", area);

		const line = d3.line()
			.x(d => x(d.date))
			.y(d => y(d.weekly_deaths));

		svg.append("path")
			.data([data])
			.attr("class", "line")
			.attr("d", line)
			.style("fill", "none")
			.style("stroke", "steelblue")
			.style("stroke-width", "2px");
	});
}

async function createCasesWeeklyChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;


	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

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
			d.date_updated = parseDate(d.date_updated);
			d.new_cases = +d.new_cases;
		});

		// Aggregate data by date
		const aggregatedData = d3.nest()
			.key(d => d.date_updated)
			.rollup(v => d3.sum(v, d => d.new_cases))
			.entries(data)
			.map(d => ({ date: new Date(d.key), value: d.value }));

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

		svg.append("path")
			.datum(aggregatedData)
			.attr("class", "area")
			.attr("d", area);

		const line = d3.line()
			.x(d => x(d.date))
			.y(d => y(d.value));

		svg.append("path")
			.datum(aggregatedData)
			.attr("class", "line")
			.attr("d", line);

		// Adding annotations using d3-annotation library
		const annotations = [
			{ note: { label: "Significant Drop", bgPadding: 5 }, x: x(parseDate("1/11/2020")), y: y(100000), dy: -30, dx: 0 },
			{ note: { label: "Peak", bgPadding: 5 }, x: x(parseDate("1/25/2022")), y: y(700000), dy: -30, dx: 0 },
		];

		const makeAnnotations = d3.annotation()
			.annotations(annotations);

		svg.append("g")
			.call(makeAnnotations);
	});
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
			.text("New Deaths per Week");

		const area = d3.area()
			.x(d => x(d.date_value))
			.y0(height)
			.y1(d => y(d["Cumulative Deaths"]));

		svg.append("path")
			.data([data])
			.attr("class", "area")
			.style("stroke", "steelblue")
			.attr("d", area);


		const line = d3.line()
			.x(d => x(d.date_value))
			.y(d => y(d["Cumulative Deaths"]));

		svg.append("path")
			.data([data])
			.attr("class", "line")
			.attr("d", line)
			.style("fill", "steelblue")
			.style("stroke", "steelblue")
			.style("stroke-width", "2px");

		// Adding annotations using d3-annotation library
		const annotations = [
			{ note: { label: "Significant Drop", bgPadding: 5 }, x: x(parseDate("1/11/2020")), y: y(100000), dy: -30, dx: 0 },
			{ note: { label: "Peak", bgPadding: 5 }, x: x(parseDate("1/25/2022")), y: y(700000), dy: -30, dx: 0 },
		];

		const makeAnnotations = d3.annotation()
			.annotations(annotations);

		svg.append("g")
			.call(makeAnnotations);
	});
}

async function createCasesWeeklyNortheastChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#cases-chart-northeast").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	initCovidRegionalData().then(data => {

	// Filter data for the Northeast region
	const filteredData = data.filter(d => d.region === "Northeast");

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

	// Create legend
	const legend = svg.append("g")
	    .attr("class", "legend-container")
		.attr("transform", `translate(${width + margin.right - 200}, ${-20})`);

	// Add background and border for legend
	const legendWidth = 150;
    const legendHeight = groupedData.length * 20 + 45; // Adjusted for margin

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
		.text("Northeast States");

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
//		const randomIndex = 10 + (i * 25) % (stateData.values.length - 10);
//		const randomDataPoint = stateData.values[randomIndex];
//
//		const annotationX = x(randomDataPoint.date_updated) + 55;
//		const annotationY = y(randomDataPoint.new_deaths) - 55;
//
//		svg.append("line")
//			.attr("x1", x(randomDataPoint.date_updated))
//			.attr("x2", annotationX)
//			.attr("y1", y(randomDataPoint.new_deaths))
//			.attr("y2", annotationY)
//			.attr("stroke", color(i))
//			.attr("stroke-dasharray", "2,2");
//
//		svg.append("text")
//			.attr("x", annotationX + 5)  // Adding extra space for clarity
//			.attr("y", annotationY)
//			.attr("text-anchor", "start")
//			.attr("class", "legend")
//			.style("fill", color(i))
//			.text(stateData.key);
//
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

	});
}

async function createCasesWeeklySouthChart() {
	const chartMargin = { top: 30, right: 140, bottom: 70, left: 10 };
	const chartMargin2 = { top: 30, right: 140, bottom: 70, left: 10 };
	const margin = { top: 30, right: 30, bottom: 70, left: -30 },
		width = document.body.clientWidth - chartMargin.left - chartMargin.right - 300,
		height = 425 - margin.top - margin.bottom;

	console.log(width);

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#cases-chart-south").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", `0 0 ${width + chartMargin.left + chartMargin.right} ${height + chartMargin.top + chartMargin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

	initCovidRegionalData().then(data => {

	// Filter data for the South region
	const filteredData = data.filter(d => d.region === "South");

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

	// Create legend
	const legend = svg.append("g")
	    .attr("class", "legend-container")
		.attr("transform", `translate(${width + margin.right}, ${-50})`);

	// Add background and border for legend
	const legendWidth = 150;
    const legendHeight = groupedData.length * 20 + 65; // Adjusted for margin

	legend.append("rect")
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("class", "legend-bg");

	// Add legend title
	legend.append("text")
		.attr("x", legendWidth / 2)
		.attr("y", 45)
		.attr("class", "legend-title")
		.attr("text-anchor", "middle")
		.text("Southern States");

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
//		const randomIndex = 10 + (i * 25) % (stateData.values.length - 10);
//		const randomDataPoint = stateData.values[randomIndex];
//
//		const annotationX = x(randomDataPoint.date_updated) - 35;
//		const annotationY = y(randomDataPoint.new_deaths) - 55;
//
//		svg.append("line")
//			.attr("x1", x(randomDataPoint.date_updated))
//			.attr("x2", annotationX)
//			.attr("y1", y(randomDataPoint.new_deaths))
//			.attr("y2", annotationY)
//			.attr("stroke", color(i))
//			.attr("stroke-dasharray", "2,2");
//
//		svg.append("text")
//			.attr("x", annotationX + 5)  // Adding extra space for clarity
//			.attr("y", annotationY)
//			.attr("text-anchor", "start")
//			.attr("class", "legend")
//			.style("fill", color(i))
//			.text(stateData.key);

		// Legend
		const legendRow = legend.append("g")
				.attr("class", "legend-row")
				.attr("transform", `translate(15, ${i * 20 + 60})`); // Adjusted for margin

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

	// Add axis labels
	svg.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("x", width / 2 + margin.left + 30)
		.attr("y", height + margin.top + 30)
		.text("Date");

	svg.append("text")
		.attr("class", "axis-label")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("x", -height / 3)
		.text("New Deaths per Week");

	});
}

async function createCasesWeeklyMidwestChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#cases-chart-midwest").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	initCovidRegionalData().then(data => {

	// Filter data for the South region
	const filteredData = data.filter(d => d.region === "Midwest");

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

	// Create legend
	const legend = svg.append("g")
	    .attr("class", "legend-container")
		.attr("transform", `translate(${width + margin.right - 200}, ${-30})`);

	// Add background and border for legend
	const legendWidth = 150;
    const legendHeight = groupedData.length * 20 + 45; // Adjusted for margin

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
		.text("Midwest States");

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
//		const randomIndex = 10 + (i * 25) % (stateData.values.length - 10);
//		const randomDataPoint = stateData.values[randomIndex];
//
//		const annotationX = x(randomDataPoint.date_updated) + 55;
//		const annotationY = y(randomDataPoint.new_deaths) - 55;
//
//		svg.append("line")
//			.attr("x1", x(randomDataPoint.date_updated))
//			.attr("x2", annotationX)
//			.attr("y1", y(randomDataPoint.new_deaths))
//			.attr("y2", annotationY)
//			.attr("stroke", color(i))
//			.attr("stroke-dasharray", "2,2");
//
//		svg.append("text")
//			.attr("x", annotationX + 5)  // Adding extra space for clarity
//			.attr("y", annotationY)
//			.attr("text-anchor", "start")
//			.attr("class", "legend")
//			.style("fill", color(i))
//			.text(stateData.key);

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

	});
}

async function createCasesWeeklyWestChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 425 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#cases-chart-west").append("svg")
		.attr("width", '90%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	initCovidRegionalData().then(data => {

	// Filter data for the South region
	const filteredData = data.filter(d => d.region === "West");

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

	// Create legend
	const legend = svg.append("g")
		.attr("class", "legend-container")
		.attr("transform", `translate(${width + margin.right - 200}, ${-30})`);

	// Add background and border for legend
	const legendWidth = 150;
    const legendHeight = groupedData.length * 20 + 45; // Adjusted for margin

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
		.text("Western States");

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
//		const randomIndex = 10 + (i * 25) % (stateData.values.length - 10);
//		const randomDataPoint = stateData.values[randomIndex];
//
//		const annotationX = x(randomDataPoint.date_updated) + 55;
//		const annotationY = y(randomDataPoint.new_deaths) - 55;
//
//		svg.append("line")
//			.attr("x1", x(randomDataPoint.date_updated))
//			.attr("x2", annotationX)
//			.attr("y1", y(randomDataPoint.new_deaths))
//			.attr("y2", annotationY)
//			.attr("stroke", color(i))
//			.attr("stroke-dasharray", "2,2");
//
//		svg.append("text")
//			.attr("x", annotationX + 5)  // Adding extra space for clarity
//			.attr("y", annotationY)
//			.attr("text-anchor", "start")
//			.attr("class", "legend")
//			.style("fill", color(i))
//			.text(stateData.key);
//
		// Legend
		const legendRow = legend.append("g")
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

	console.log('Filtered data:', filteredData); // Debug message

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
