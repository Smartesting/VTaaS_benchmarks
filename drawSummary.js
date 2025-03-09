import * as d3 from 'd3';
import { statusColor } from "./statusColor";
export function drawSummary(summary, elementId) {
    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
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
    const testNames = Object.keys(summary);
    const statusCounts = Object.values(summary);
    const xScale = d3.scaleBand()
        .domain(testNames)
        .range([margin.left, width - margin.right])
        .padding(0.4);
    const maxCount = d3.max(statusCounts, sc => d3.sum(Object.values(sc))) ?? 0;
    const yScale = d3.scaleLinear()
        .domain([0, maxCount])
        .range([height - margin.bottom, margin.top])
        .nice();
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format("d")).ticks(maxCount);
    const xAxis = d3.axisBottom(xScale).tickFormat(d => d.split(" :: ")[0]);
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end");
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);
    svg.selectAll("g.bar")
        .data(testNames)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${xScale(d)}, 0)`)
        .each(function (d) {
        const group = d3.select(this);
        let currentCount = 0;
        Object.entries(summary[d]).forEach(([status, count]) => {
            currentCount += count;
            group.append("rect")
                .attr("x", 0)
                .attr("y", yScale(currentCount))
                .attr("width", xScale.bandwidth())
                .attr("height", yScale(0) - yScale(count))
                .attr("fill", statusColor(status))
                .style("cursor", "pointer")
                .on("mouseover", function (event) {
                d3.select(this).attr("fill", statusColor(status, true));
                tooltip.style("visibility", "visible")
                    .text(`${count} ${status}`)
                    .style("top", `${event.pageY - 30}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
                .on("mousemove", function (event) {
                tooltip.style("top", `${event.pageY - 30}px`)
                    .style("left", `${event.pageX + 10}px`);
            })
                .on("mouseout", function () {
                d3.select(this).attr("fill", statusColor(status));
                tooltip.style("visibility", "hidden");
            });
        });
    });
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Test results");
}
