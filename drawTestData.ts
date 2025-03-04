import {TestData} from "./loadData";
import * as d3 from 'd3';
import {statusColor} from "./statusColor";

export function drawTestData(testData: Record<string, TestData>, elementId: string) {
    console.log("drawTestData", testData);

    Object.entries(testData).forEach(([testName, data]) => {
        const {builds, durations, steps} = data;

        const width = 800, height = 400;
        const margin = {top: 30, right: 30, bottom: 50, left: 60};

        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "#fff")
            .style("border", "1px solid #ccc")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("visibility", "hidden")
            .style("box-shadow", "2px 2px 5px rgba(0,0,0,0.3)")
            .style("font-size", "14px");

        const svg = d3.select("#" + elementId)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleBand()
            .domain(builds)
            .range([margin.left, width - margin.right])
            .padding(0.4);

        const maxDuration = d3.max(durations) ?? 0;
        const yScale = d3.scaleLinear()
            .domain([0, maxDuration])
            .range([height - margin.bottom, margin.top])
            .nice();

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d => formatDuration(Number(d)));

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis)
            .selectAll("text")
            .style("text-anchor", "middle");

        svg.selectAll("g.bar")
            .data(builds)
            .enter()
            .append("g")
            .attr("transform", d => `translate(${xScale(d)}, 0)`)
            .each((_build, i, nodes) => {
                const group = d3.select(nodes[i]);
                let currentHeight = 0;

                steps[i].forEach(step => {
                    const {status, duration} = step;
                    const rectHeight = yScale(0) - yScale(duration);

                    group.append("rect")
                        .attr("x", 0)
                        .attr("y", yScale(currentHeight + duration))
                        .attr("width", xScale.bandwidth())
                        .attr("height", rectHeight)
                        .attr("fill", statusColor(status))
                        .style("cursor", "pointer")
                        .on("mouseover", function (event) {
                            tooltip.style("visibility", "visible")
                                .text(`${status}: ${formatDuration(duration)}`)
                                .style("top", `${event.pageY - 30}px`)
                                .style("left", `${event.pageX + 10}px`);
                        })
                        .on("mousemove", function (event) {
                            tooltip.style("top", `${event.pageY - 30}px`)
                                .style("left", `${event.pageX + 10}px`);
                        })
                        .on("mouseout", function () {
                            tooltip.style("visibility", "hidden");
                        });

                    currentHeight += duration;
                });
            });

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text(testName);
    });
}


function formatDuration(ms: number) {
    if (ms < 1000) return `${ms} ms`;

    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 60000) % 60;
    const hours = Math.floor(ms / 3600000);
    const result = [];
    if (hours > 0) result.push(`${hours} h`);
    if (minutes > 0) result.push(`${minutes} min`);
    if (seconds > 0 || result.length === 0) result.push(`${seconds} sec`);

    return result.join(" ");
}

