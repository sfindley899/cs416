// Define the major dates and corresponding counts for annotations
const total_death_annotations = [
    //{ date: "1/25/2020", count: null, label: "January 2020:\nFirst COVID-19 case in the US" },
    //{ date: "2/1/2020", count: null, label: "January 2020:\nPublic health emergency declared" },
    {
        date: "3/14/2020",
        count: null,
        label: "March 2020:\nOn March 13, 2020, the President of the US\ndeclared a national emergency in response to the\nCOVID-19 pandemic.",
    },
    //{ date: "4/3/2020", count: null, label: "April 2020:\nCDC recommends masks" },
    //{ date: "12/12/2020", count: null, label: "December 2020:\nFirst vaccine authorized" },
    //{ date: "1/23/2021", count: null, label: "January 2021:\nNew administration's pandemic response" },
    {
        date: "3/13/2021",
        count: null,
        label: "March 2021:\nOn March 11, 2021, the American Rescue Plan was\nsigned into law, providing $1.9 trillion in\neconomic relief, including funding for vaccines,\nschools, and stimulus payments to individuals.",
    },
    {
        date: "1/15/2022",
        count: null,
        label: "February 2022:\nOn February 25, 2022, the CDC updated its mask\nguidelines to recommend masks based on\nCOVID-19 community levels rather than case count\nalone, considering factors like hospital capacity.",
    },
    //{ date: "7/24/2021", count: null, label: "July 2021:\nCDC updates mask guidance" },
    //{ date: "11/6/2021", count: null, label: "November 2021:\nVaccines for children approved" },
    {
        date: "5/13/2023",
        count: null,
        label: "May 2023:\nOn May 11, 2023, the federal COVID-19 public\nhealth emergency officially ended, transitioning\nthe pandemic response to more traditional public\nhealth measures.",
    },
];

const case_count_annotations = [
    {
        date: "1/23/2020",
        count: null,
        label: "January 2020:\nThe first confirmed case of COVID-19 in the US\nwas reported on January 21, 2020, in a man who\nhad returned from Wuhan, China\nthe outbreak's epicenter.",
    },
    //{ date: "2/1/2020", count: null, label: "January 2020:\nPublic health emergency declared" },
    //{ date: "3/14/2020", count: null, label: "March 2020:\nNational emergency declared" },
    // { date: "4/23/2020", count: null, label: "April 2020:\nCDC recommends masks" },
    {
        date: "12/10/2020",
        count: null,
        label: "December 2020:\nOn December 11, 2020, the FDA issued an\nEmergency Use Authorization for the Pfizer-\nBioNTech vaccine, the first COVID-19 vaccine\napproved in the US.",
    },
    //{ date: "3/13/2021", count: null, label: "March 2021:\nAmerican Rescue Plan signed" },
    { date: "7/22/2021", count: null, label: "July 2021:\nThe CDC updated its mask guidelines to\nrecommend masks based on COVID\nlevels rather than case counts alone,\nconsidering factors like hospital capacity." },
    //{ date: "1/23/2021", count: null, label: "January 2021:\nNew administration's pandemic response" },
    {
        date: "11/25/2021",
        count: null,
        label: "November 2021:\nOmicron variant was reported to the WHO by\nSouth Africa on November 24, 2021, leading to\nglobal concerns due to its high number\nof mutations and increased transmissibility.",
    }, // Added Omicron introduction
    //{ date: "11/6/2021", count: null, label: "November 2021:\nVaccines for children approved" },
    // { date: "5/4/2023", count: null, label: "May 2023:\nPublic health emergency ends" }
];

const death_count_annotations = [
    //  { date: "1/23/2020", count: null, label: "January 2020:\nFirst US COVID-19 case" },
    //  { date: "2/1/2020", count: null, label: "January 2020:\nPublic health emergency declared" },
    {
        date: "3/19/2020",
        count: null,
        label: "March 2020:\nThe United States declared a national\nemergency to free up resources to combat the\nCOVID-19 outbreak.",
    },
    // { date: "4/23/2020", count: null, label: "April 2020:\nCDC recommends " },
    //  { date: "12/14/2020", count: null, label: "December 2020:\nFirst vaccine authorized" },
    {
        date: "9/3/2020",
        count: null,
        label: "September 2020:\nThe Alpha variant, also known as B.1.1.7,\nwas first detected in the UK in September 2020,\nand was noted for its increased transmissibility.",
    },
    //  { date: "5/1/2021", count: null, label: "May 2021:\nBeta variant identified" },
    {
        date: "6/3/2021",
        count: null,
        label: "June 2021:\nThe Delta variant, identified in India in\nOctober 2020, became the dominant strain in\nthe US by June 2021, known for causing\nsevere illness.",
    },
    {
        date: "11/25/2021",
        count: null,
        label: "November 2021:\nOmicron variant was reported to the WHO by\nSouth Africa on November 24, 2021, leading to\nglobal concerns due to its high number\nof mutations and increased transmissibility.",
    },
    //  { date: "5/4/2023", count: null, label: "May 2023:\nPublic health emergency ends" }
];

const body = document.body;
const html = document.documentElement;
const height = Math.max(
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
);

var monthly_deaths_csv = "ages_monthly_deaths.csv";
var demographics_summary_csv = "race_total_outcomes.csv";
var monthly_age_states_deaths_csv = "pages_states_monthly_dates.csv";
var monthly_gender_dates_csv = "gender_monthly_dates.csv";
var weekly_regional_cases_deaths_csv =
    "weekly_cases_and_deaths_per_state_region.csv";
var cumulative_deaths_csv = "cumulative_deaths_us.csv";
var weekly_deaths_csv = "data_table_for_weekly_deaths__the_united_states.csv";

// Function to wrap text within a specified width
function wrapText(text, width) {
    text.each(function () {
        const text = d3.select(this),
            words = text.text().split("\n").reverse(),
            lineHeight = 1.1; // ems
        let line = [],
            lineNumber = 0,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy") || 0),
            tspan = text
                .text(null)
                .append("tspan")
                .attr("x", text.attr("x"))
                .attr("y", y)
                .attr("dy", dy + "em");

        while (words.length) {
            const word = words.pop();
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text
                    .append("tspan")
                    .attr("x", text.attr("x"))
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}

function initializeSlider(data) {
    const parseDate = d3.timeParse("%m/%d/%Y");
    const formatDate = d3.timeFormat("%m/%d/%Y");

    const dates = data.map((d) => parseDate(d.date_updated));

    const sliderWidth = document.querySelector("#slider").clientWidth;
    const slider = d3
        .select("#slider")
        .append("svg")
        .attr("width", sliderWidth)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(30,30)");

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(dates))
        .range([0, sliderWidth - 60])
        .clamp(true);

    slider
        .append("line")
        .attr("class", "track")
        .attr("x1", xScale.range()[0])
        .attr("x2", xScale.range()[1])
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(
            d3
                .drag()
                .on("start.interrupt", function () {
                    slider.interrupt();
                })
                .on("start drag", function () {
                    hue(xScale.invert(d3.event.x));
                }),
        );

    const handle = slider
        .insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    const label = slider
        .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(d3.min(dates)))
        .attr("transform", "translate(0," + -15 + ")");

    function hue(h) {
        handle.attr("cx", xScale(h));
        label.attr("x", xScale(h)).text(formatDate(h));
        d3.select("p#value-range").text(formatDate(h));
    }

    const range = slider.append("g").attr("class", "range");

    return { xScale, handle, label, range };
}

function getDateValue(dateString) {
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

async function createCumulativeDeathsChart() {
    const margin = { top: 30, right: 70, bottom: 70, left: 70 },
        width = document.body.clientWidth - margin.left - margin.right,
        height = 425 - margin.top - margin.bottom;

    const parseDate = d3.timeParse("%m/%d/%Y");

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3
        .select("#total-deaths-chart")
        .append("svg")
        .attr("width", "90%")
        .attr("height", "100%")
        .attr(
            "viewBox",
            `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
        )
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr(
            "transform",
            "translate(" + (margin.left + 20) + "," + margin.top + ")",
        );

    initCovidTotalDeathData().then((data) => {
        data.forEach((d) => {
            d.date_value = parseDate(d.date_value);
            d["Cumulative Deaths"] = +d["Cumulative Deaths"];
        });

        x.domain(d3.extent(data, (d) => d.date_value));
        y.domain([0, d3.max(data, (d) => d["Cumulative Deaths"])]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g").call(d3.axisLeft(y));

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

        const area = d3
            .area()
            .x((d) => x(d.date_value))
            .y0(height)
            .y1((d) => y(d["Cumulative Deaths"]));

        // Function to format dates as strings for comparison
        const formatDateString = (date) => d3.timeFormat("%Y-%m-%d")(date);
        const proximityThreshold = 20; // Adjust this value as needed

        svg.append("path")
            .data([data])
            .attr("class", "area")
            .style("stroke", "#C05241")
            .attr("d", area)
            .on("mousemove", function (event) {
                const [mouseX, mouseY] = d3.mouse(this);
                const date = x.invert(mouseX);
                const dataPoint = data.find((dp) => {
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
                    const textGroup = svg
                        .append("g")
                        .attr("class", "annotation-text-group");

                    textGroup
                        .append("rect")
                        .attr("class", "annotation-rect")
                        .attr("x", annotationValuesX - 55)
                        .attr("y", annotationValuesY - 40) 
                        .attr("width", 175) 
                        .attr("height", 50) 
                        .attr("fill", "white")
                        .attr("stroke", "black");

                    // Add text
                    const textElement = textGroup
                        .append("text")
                        .attr("class", "annotation-text")
                        .attr("x", annotationValuesX - 50)
                        .attr("y", annotationValuesY - 20) // Elevate the text
                        .attr("text-anchor", "start")
                        .style("fill", "black")
                        .style("font-weight", "bold");

                    textElement
                        .selectAll("tspan")
                        .data([
                            "Date: " + dataPoint.date_str,
                            "Total Deaths: " + dataPoint["Cumulative Deaths"],
                        ])
                        .enter()
                        .append("tspan")
                        .attr("x", annotationValuesX - 50)
                        .attr("dy", (d, i) => i * 20) 
                        .text((d) => d);
                }
            })
            .on("mouseout", function () {
                // Remove annotation
                svg.selectAll(".annotation-line").remove();
                svg.selectAll(".annotation-text").remove();
                svg.selectAll(".annotation-rect").remove();
            });

        const line = d3
            .line()
            .x((d) => x(d.date_value))
            .y((d) => y(d["Cumulative Deaths"]));

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#C05241")
            .style("stroke-width", "2px");

        // Add annotations to the chart
        total_death_annotations.forEach((ann) => {
            const dataPoint = data.find(
                (d) =>
                    formatDateString(d.date_value) ===
                    formatDateString(parseDate(ann.date)),
            );
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
                    .attr("y", annotationY - 25)
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
    const formatDateString = (date) => d3.timeFormat("%Y-%m-%d")(date);

    const svg = d3
        .select("#cases-chart")
        .append("svg")
        .attr("width", "90%")
        .attr("height", "100%")
        .attr(
            "viewBox",
            `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
        )
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr(
            "transform",
            "translate(" + (margin.left + 30) + "," + margin.top + ")",
        );

    initCovidRegionalData().then((data) => {
        data.forEach((d) => {
            d.date_updated = parseDate(d.date_updated);
        });

        // Aggregate data by date
        const aggregatedData = d3
            .nest()
            .key((d) => d.start_date)
            .rollup((v) => ({
                total_cases: d3.sum(v, (d) => +d.abs_new_cases),
                first_date: v[0].start_date, 
                legend: v[0].legend, 
            }))
            .entries(data)
            .map((d) => ({
                date: new Date(d.key),
                value: d.value.total_cases,
                current_date: d.value.first_date, // Include the first start_date
                legend: d.value.legend,
            }));

        x.domain(d3.extent(aggregatedData, (d) => d.date));
        y.domain([0, d3.max(aggregatedData, (d) => d.value)]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g").call(d3.axisLeft(y));

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

        const area = d3
            .area()
            .x((d) => x(d.date))
            .y0(height)
            .y1((d) => y(d.value));

        const proximityThreshold = 20; // Adjust this value as needed

        svg.append("path")
            .datum(aggregatedData)
            .attr("class", "area")
            .attr("d", area)
            .on("mousemove", function (event) {
                const [mouseX, mouseY] = d3.mouse(this);
                const date = x.invert(mouseX);
                const dataPoint = aggregatedData.find((dp) => {
                    const annotationValuesX = x(parseDate(dp.current_date));
                    const annotationValuesY = y(dp.value);
                    const distance = Math.abs(mouseX - annotationValuesX);
                    return distance < proximityThreshold;
                });

                if (dataPoint) {
                    const annotationValuesX = x(
                        parseDate(dataPoint.current_date),
                    );
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
                    const textGroup = svg
                        .append("g")
                        .attr("class", "annotation-text-group");

                    textGroup
                        .append("rect")
                        .attr("class", "annotation-rect")
                        .attr("x", annotationValuesX - 55)
                        .attr("y", annotationValuesY - 40) 
                        .attr("width", 185) 
                        .attr("height", 50) 
                        .attr("fill", "white")
                        .attr("stroke", "black");

                    // Add text
                    const textElement = textGroup
                        .append("text")
                        .attr("class", "annotation-text")
                        .attr("x", annotationValuesX - 50)
                        .attr("y", annotationValuesY - 15) // Elevate the text
                        .attr("text-anchor", "start")
                        .style("fill", "black")
                        .style("font-weight", "bold");

                    textElement
                        .selectAll("tspan")
                        .data([
                            "Date: " + dataPoint.legend,
                            "Weekly Cases: " + dataPoint.value,
                        ])
                        .enter()
                        .append("tspan")
                        .attr("x", annotationValuesX - 50)
                        .attr("dy", (d, i) => i * 20) 
                        .text((d) => d);
                }
            })
            .on("mouseout", function () {
                // Remove annotation
                svg.selectAll(".annotation-line").remove();
                svg.selectAll(".annotation-text").remove();
                svg.selectAll(".annotation-rect").remove();
            });

        const line = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.value));

        svg.append("path")
            .datum(aggregatedData)
            .attr("class", "line")
            .attr("d", line);

        // Add annotations to the chart
        case_count_annotations.forEach((ann, index) => {
            const dataPoint = data.find(
                (d) =>
                    formatDateString(d.date_updated) ===
                    formatDateString(parseDate(ann.date)),
            );
            if (dataPoint) {
                const annotationX = x(parseDate(ann.date));
                const annotationY = 250 - 65 * index;

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
                    .attr("x", annotationX + 10)
                    .attr("y", annotationY - 25)
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
    const formatDateString = (date) => d3.timeFormat("%Y-%m-%d")(date);

    const svg = d3
        .select("#deaths-chart")
        .append("svg")
        .attr("width", "90%")
        .attr("height", "100%")
        .attr(
            "viewBox",
            `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
        )
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr(
            "transform",
            "translate(" + (margin.left + 30) + "," + margin.top + ")",
        );

    initCovidRegionalData().then((data) => {
        data.forEach((d) => {
            d.date_updated = parseDate(d.date_updated);
        });

        // Aggregate data by date
        const aggregatedData = d3
            .nest()
            .key((d) => d.start_date)
            .rollup((v) => ({
                new_deaths: d3.sum(v, (d) => +d.new_deaths),
                first_date: v[0].start_date, 
                legend: v[0].legend, 
            }))
            .entries(data)
            .map((d) => ({
                date: new Date(d.key),
                value: d.value.new_deaths,
                current_date: d.value.first_date, 
                legend: d.value.legend,
            }));

        x.domain(d3.extent(aggregatedData, (d) => d.date));
        y.domain([0, d3.max(aggregatedData, (d) => d.value)]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("g").call(d3.axisLeft(y));

        // X Axis label
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
            .attr("y", -margin.left)
            .attr("x", -height / 3)
            .text("New Deaths per Week");

        const area = d3
            .area()
            .x((d) => x(d.date))
            .y0(height)
            .y1((d) => y(d.value));

        const proximityThreshold = 20; 

        svg.append("path")
            .datum(aggregatedData)
            .attr("class", "area")
            .attr("d", area)
            .on("mousemove", function (event) {
                const [mouseX, mouseY] = d3.mouse(this);
                const date = x.invert(mouseX);
                const dataPoint = aggregatedData.find((dp) => {
                    const annotationValuesX = x(parseDate(dp.current_date));
                    const annotationValuesY = y(dp.value);
                    const distance = Math.abs(mouseX - annotationValuesX);
                    return distance < proximityThreshold;
                });

                if (dataPoint) {
                    const annotationValuesX = x(
                        parseDate(dataPoint.current_date),
                    );
                    const annotationValuesY = y(dataPoint.value);

                    svg.selectAll(".annotation-line").remove();
                    svg.selectAll(".annotation-text").remove();
                    svg.selectAll(".annotation-rect").remove();

                    svg.append("line")
                        .attr("class", "annotation-line")
                        .attr("x1", annotationValuesX)
                        .attr("x2", annotationValuesX)
                        .attr("y1", annotationValuesY - 20) 
                        .attr("y2", height) 
                        .attr("stroke", "black")
                        .attr("stroke-dasharray", "4,4");

                    const textGroup = svg
                        .append("g")
                        .attr("class", "annotation-text-group");

                    textGroup
                        .append("rect")
                        .attr("class", "annotation-rect")
                        .attr("x", annotationValuesX - 55)
                        .attr("y", annotationValuesY - 40) 
                        .attr("width", 185) 
                        .attr("height", 50) 
                        .attr("fill", "white")
                        .attr("stroke", "black");

                    const textElement = textGroup
                        .append("text")
                        .attr("class", "annotation-text")
                        .attr("x", annotationValuesX - 50)
                        .attr("y", annotationValuesY - 15)
                        .attr("text-anchor", "start")
                        .style("fill", "black")
                        .style("font-weight", "bold");

                    textElement
                        .selectAll("tspan")
                        .data([
                            "Date: " + dataPoint.legend,
                            "Weekly Deaths: " + dataPoint.value,
                        ])
                        .enter()
                        .append("tspan")
                        .attr("x", annotationValuesX - 50)
                        .attr("dy", (d, i) => i * 20) 
                        .text((d) => d);
                }
            })
            .on("mouseout", function () {
                svg.selectAll(".annotation-line").remove();
                svg.selectAll(".annotation-text").remove();
                svg.selectAll(".annotation-rect").remove();
            });

        const line = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.value));

        svg.append("path")
            .datum(aggregatedData)
            .attr("class", "line")
            .attr("d", line);

        death_count_annotations.forEach((ann, index) => {
            const dataPoint = data.find(
                (d) =>
                    formatDateString(d.date_updated) ===
                    formatDateString(parseDate(ann.date)),
            );
            if (dataPoint) {
                const annotationX = x(parseDate(ann.date));
                const annotationY = 250 - 65 * index;

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
                    .attr("x", annotationX + 10)
                    .attr("y", annotationY - 25)
                    .attr("text-anchor", "start")
                    .attr("class", "annotation")
                    .attr("fill", "white")
                    .style("font-weight", "bold")
                    .text(ann.label)
                    .call(wrapText, 150);
            }
        });
    });
}

async function plotData(svg, x, y, data, startDate, endDate, type) {

    const parseDate = d3.timeParse("%m/%d/%Y");

    chartLabels = {
        deaths: {
            axis: "New Deaths per Week",
            tool_tip: " Weekly Deaths: ",
        },
        cases: {
            axis: "New Cases per Week",
            tool_tip: " Weekly Cases: ",
        },
    };

    svg.selectAll(".line").remove();
    svg.selectAll(".area").remove();
    svg.selectAll(".axis-label").remove();

    const margin = { top: 30, right: 70, bottom: 70, left: 70 },
        width = document.body.clientWidth - margin.left - margin.right,
        height = 425 - margin.top - margin.bottom;

    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();

    const filteredData = data.filter((d) => {
        const dateTimestamp = new Date(d.current_date).getTime();
        return dateTimestamp >= s && dateTimestamp <= e;
    });


    x.domain(d3.extent(filteredData, (d) => d.date));
    y.domain([0, d3.max(filteredData, (d) => d.value)]);

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
        .attr("y", -margin.left)
        .attr("x", -height / 3)
        .text(chartLabels[type].axis);

    svg.selectAll(".y-axis").remove();
    svg.selectAll(".x-axis").remove();
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x-axis")
        .call(d3.axisBottom(x));

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

    const area = d3
        .area()
        .x((d) => x(d.date))
        .y0(height)
        .y1((d) => y(d.value));

    const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

    svg.append("path")
        .datum(filteredData)
        .attr("class", "line")
        .attr("d", line);

    svg.append("path")
        .datum(filteredData)
        .attr("class", "area")
        .attr("d", area);

    svg.append("path")
        .datum(filteredData)
        .attr("class", "line")
        .attr("d", line);

    const proximityThreshold = 20;

    svg.append("path")
        .datum(filteredData)
        .attr("class", "area")
        .attr("d", area)
        .on("mousemove", function (event) {
            const [mouseX, mouseY] = d3.mouse(this);
            const date = x.invert(mouseX);
            const dataPoint = filteredData.find((dp) => {
                const annotationValuesX = x(parseDate(dp.current_date));
                const annotationValuesY = y(dp.value);
                const distance = Math.abs(mouseX - annotationValuesX);
                return distance < proximityThreshold;
            });

            if (dataPoint) {
                const annotationValuesX = x(parseDate(dataPoint.current_date));
                const annotationValuesY = y(dataPoint.value);

                svg.selectAll(".annotation-line").remove();
                svg.selectAll(".annotation-text").remove();
                svg.selectAll(".annotation-rect").remove();

                svg.append("line")
                    .attr("class", "annotation-line")
                    .attr("x1", annotationValuesX)
                    .attr("x2", annotationValuesX)
                    .attr("y1", annotationValuesY - 20) 
                    .attr("y2", height) 
                    .attr("stroke", "black")
                    .attr("stroke-dasharray", "4,4");

                const textGroup = svg
                    .append("g")
                    .attr("class", "annotation-text-group");

                textGroup
                    .append("rect")
                    .attr("class", "annotation-rect")
                    .attr("x", annotationValuesX - 55)
                    .attr("y", annotationValuesY - 40) 
                    .attr("width", 185) 
                    .attr("height", 50) 
                    .attr("fill", "white")
                    .attr("stroke", "black");

                const textElement = textGroup
                    .append("text")
                    .attr("class", "annotation-text")
                    .attr("x", annotationValuesX - 50)
                    .attr("y", annotationValuesY - 15)
                    .attr("text-anchor", "start")
                    .style("fill", "black")
                    .style("font-weight", "bold");

                textElement
                    .selectAll("tspan")
                    .data([
                        "Date: " + dataPoint.legend,
                        chartLabels[type].tool_tip + dataPoint.value,
                    ])
                    .enter()
                    .append("tspan")
                    .attr("x", annotationValuesX - 50)
                    .attr("dy", (d, i) => i * 20)
                    .text((d) => d);
            }
        })
        .on("mouseout", function () {
            svg.selectAll(".annotation-line").remove();
            svg.selectAll(".annotation-text").remove();
            svg.selectAll(".annotation-rect").remove();
        });
}

async function main() {
    const parseDate = d3.timeParse("%m/%d/%Y");
    const formatDateString = (date) => d3.timeFormat("%Y-%m-%d")(date);

    initCovidRegionalData().then((data) => {
        data.forEach((d) => {
            d.date_updated = parseDate(d.date_updated);
        });

        const aggregatedData = d3
            .nest()
            .key((d) => d.start_date)
            .rollup((v) => ({
                total_cases: d3.sum(v, (d) => +d.abs_new_cases),
                new_deaths: d3.sum(v, (d) => +d.new_deaths),
                first_date: v[0].start_date,
                legend: v[0].legend,
            }))
            .entries(data)
            .map((d) => ({
                date: new Date(d.key),
                deaths: d.value.new_deaths,
                cases: d.value.total_cases,
                current_date: d.value.first_date,
                legend: d.value.legend,
            }));

        let keyStr = "cases";

        const slider1 = document.getElementById("slider1");
        const slider2 = document.getElementById("slider2");
        const rangeTrack = document.getElementById("rangeTrack");
        const startDate = document.getElementById("startDateValue");
        const endDate = document.getElementById("endDateValue");
        const casesPath = document.getElementById("cases");
        const deathsPath = document.getElementById("deaths");

        startDate.innerText = aggregatedData[0].current_date;
        endDate.innerText =
            aggregatedData[aggregatedData.length - 1].current_date;

        function updateRadioCaseOutput(svg, x, y, aggregatedData) {
            if (this.checked) {
                keyStr = "cases";

                const transformedData = aggregatedData.map((d) => ({
                    date: new Date(d.date),
                    value: d.cases,
                    current_date: d.current_date,
                    legend: d.legend,
                }));
                plotData(
                    svg,
                    x,
                    y,
                    transformedData,
                    startDate.innerText,
                    endDate.innerText,
                    "cases",
                );
            }
        }

        function updateRadioDeathOutput(svg, x, y, aggregatedData) {
            if (this.checked) {
                keyStr = "deaths";

                const transformedData = aggregatedData.map((d) => ({
                    date: new Date(d.date),
                    value: d.deaths,
                    current_date: d.current_date,
                    legend: d.legend,
                }));
                plotData(
                    svg,
                    x,
                    y,
                    transformedData,
                    startDate.innerText,
                    endDate.innerText,
                    "deaths",
                );
            }
        }

        function updateSliderOutput(svg, x, y, aggregatedData) {
            const minValue = Math.min(slider1.value, slider2.value);
            const maxValue = Math.max(slider1.value, slider2.value);
            endDate.innerText = aggregatedData[maxValue].current_date;
            startDate.innerText = aggregatedData[minValue].current_date;
            rangeTrack.style.background = `linear-gradient(to right, #ddd ${minValue}%, #0abab5 ${minValue}%, #0abab5 ${maxValue}%, #ddd ${maxValue}%)`;

            const transformedData = aggregatedData.map((d) => ({
                date: new Date(d.date),
                value: keyStr === "deaths" ? d.deaths : d.cases,
                current_date: d.current_date,
                legend: d.legend,
            }));
            plotData(
                svg,
                x,
                y,
                transformedData,
                startDate.innerText,
                endDate.innerText,
                keyStr,
            );
        }

        const margin = { top: 30, right: 70, bottom: 70, left: 70 },
            width = document.body.clientWidth - margin.left - margin.right,
            height = 425 - margin.top - margin.bottom;

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height - 50, 0]);

        const svg = d3
            .select("#interactive-chart")
            .append("svg")
            .attr("width", "90%")
            .attr("height", "100%")
            .attr(
                "viewBox",
                `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
            )
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr(
                "transform",
                "translate(" + (margin.left + 30) + "," + margin.top + ")",
            );

        x.domain(d3.extent(aggregatedData, (d) => d.date));

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x-axis")
            .call(d3.axisBottom(x));

        svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

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
            .attr("y", -margin.left)
            .attr("x", -height / 3);

        casesPath.addEventListener("change", function () {
            updateRadioCaseOutput.call(this, svg, x, y, aggregatedData);
        });
        deathsPath.addEventListener("change", function () {
            updateRadioDeathOutput.call(this, svg, x, y, aggregatedData);
        });
        slider1.addEventListener("input", function () {
            updateSliderOutput(svg, x, y, aggregatedData);
        });
        slider2.addEventListener("input", function () {
            updateSliderOutput(svg, x, y, aggregatedData);
        });

        updateSliderOutput(svg, x, y, aggregatedData);
    });
}

async function loadInteractiveD3DeathsChart() {
}

async function loadInteractiveD3CasesChart() {
}

async function loadInteractiveD3Chart() {}

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
