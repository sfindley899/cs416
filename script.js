var monthly_deaths_csv = "ages_monthly_deaths.csv";
var demographics_summary_csv = "race_total_outcomes.csv";
var monthly_age_states_deaths_csv = "pages_states_monthly_dates.csv";
var monthly_gender_dates_csv = "gender_monthly_dates.csv";
var weekly_regional_cases_deaths_csv = "weekly_cases_and_deaths_per_state_region.csv";

// Test
function pageLoadTest()
{
	alert("Page has been loaded!");
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

async function loadGenderD3Chart() {
	createGenderD3Chart();
}
