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
	const margin = { top: 30, right: 20, bottom: 70, left: 50 },
		width = 600 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%Y-%m");

	const x = d3.scaleBand().range([0, width]).padding(0.1);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#gender-chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	initCovidGenderData().then(data => {
		data.forEach(d => {
			d.date = parseDate(d.Year + "-" + d.Month);
			d["COVID-19 Deaths"] = +d["COVID-19 Deaths"];
		});

		x.domain(data.map(d => d.date));
		y.domain([0, d3.max(data, d => d["COVID-19 Deaths"])]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")))
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", "-.55em")
			.attr("transform", "rotate(-90)");

		svg.append("g")
			.call(d3.axisLeft(y));

		svg.selectAll("bar")
			.data(data)
			.enter().append("rect")
			.style("fill", "steelblue")
			.attr("x", d => x(d.date))
			.attr("width", x.bandwidth())
			.attr("y", d => y(d["COVID-19 Deaths"]))
			.attr("height", d => height - y(d["COVID-19 Deaths"]));
	});
}

async function createDeathsWeeklyChart() {
	const margin = { top: 30, right: 20, bottom: 70, left: 50 },
		width = 400 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#deaths-chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	initCovidRegionalData().then(data => {
		data.forEach(d => {
			d.start_date = parseDate(d.start_date);
			d.new_deaths = +d.new_deaths;
		});

		x.domain(d3.extent(data, d => d.start_date));
		y.domain([0, d3.max(data, d => d.new_deaths)]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		svg.append("g")
			.call(d3.axisLeft(y));

		const line = d3.line()
			.x(d => x(d.start_date))
			.y(d => y(d.new_deaths));

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
	const margin = { top: 30, right: 20, bottom: 70, left: 50 },
		width = 400 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	const parseDate = d3.timeParse("%m/%d/%Y");

	const x = d3.scaleTime().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	const svg = d3.select("#cases-chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	initCovidRegionalData().then(data => {
		data.forEach(d => {
			d.date_updated = parseDate(d.date_updated);
			d.new_cases = +d.new_cases;
		});

		x.domain(d3.extent(data, d => d.date_updated));
		y.domain([0, d3.max(data, d => d.new_cases)]);

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		svg.append("g")
			.call(d3.axisLeft(y));

		const line = d3.line()
			.x(d => x(d.date_updated))
			.y(d => y(d.new_cases));

		svg.append("path")
			.data([data])
			.attr("class", "line")
			.attr("d", line)
			.style("fill", "none")
			.style("stroke", "steelblue")
			.style("stroke-width", "2px");
	});
}

async function createCumulativeDeathsChart() {
	const margin = { top: 30, right: 70, bottom: 70, left: 70 },
		width = document.body.clientWidth - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

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

		// Adding annotations
		const annotations = [
			{date: "1/11/2020", value: getDateValue("1/11/2020"), text: "First Death"},
			{date: "1/25/2020", value: getDateValue("1/25/2020"), text: "6 Deaths"},
			{date: "2/8/2020", value: getDateValue("2/8/2020"), text: "10 Deaths"},
			{date: "2/15/2020", value: getDateValue("2/15/2020"), text: "16 Deaths"},
			{date: "2/15/2020", value: getDateValue("2/15/2020"), text: "22 Deaths"}
		];

		annotations.forEach(ann => {
			const date = parseDate(ann.date);
			svg.append("line")
				.attr("x1", x(date))
				.attr("x2", x(date))
				.attr("y1", y(ann.value))
				.attr("y2", height)
				.attr("stroke", "red")
				.attr("stroke-dasharray", "2,2");

			svg.append("text")
				.attr("x", x(date))
				.attr("y", y(ann.value) - 10)
				.attr("text-anchor", "middle")
				.attr("class", "annotation")
				.text(ann.text);
		});
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
