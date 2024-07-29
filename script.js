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

// Test
function pageLoadTest()
{
	alert("Page has been loaded!");
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
		.attr("width", '100%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

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
			.attr("text-anchor", "end")
			.attr("x", width / 2 + margin.left)
			.attr("y", height + margin.top + 40)
			.text("Date");

		// Y Axis label
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left + 20)
			.attr("x", -height / 2 + margin.top)
			.text("New Cases");

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
			.style("stroke", "red")
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
		.attr("width", '100%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

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
			.attr("text-anchor", "end")
			.attr("x", width / 2 + margin.left)
			.attr("y", height + margin.top + 40)
			.text("Date");

		// Y Axis label
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left + 20)
			.attr("x", -height / 2 + margin.top)
			.text("New Cases");

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
		.attr("width", '100%')
		.attr("height", '100%')
		.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
		.attr("preserveAspectRatio", "xMidYMid meet")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
			.attr("text-anchor", "end")
			.attr("x", width / 2 + margin.left)
			.attr("y", height + margin.top + 40)
			.text("Date");

		// Y Axis label
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left + 20)
			.attr("x", -height / 2 + margin.top)
			.text("New Cases");

		const area = d3.area()
			.x(d => x(d.date_value))
			.y0(height)
			.y1(d => y(d["Cumulative Deaths"]));

		svg.append("path")
			.data([data])
			.attr("class", "area")
			.attr("d", area);


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
