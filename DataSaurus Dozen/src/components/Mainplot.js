import React, { useRef, useEffect } from "react";

import * as d3 from "d3";
import create from 'zustand';

export const useStore = create((set) => ({
	selectedIndices: [],
	setSelectedIndices: (indices) => set({ selectedIndices: indices })
  }));

  

const Mainplot = (props) => {
  const splotSvg = useRef(null);
  const barplotSvg = useRef(null);
  const setSelectedIndices = useStore((state) => state.setSelectedIndices);
  
  

  
  const svgSize = props.margin * 2 + props.size;

  useEffect(() => {
	
    const svg = d3.select(splotSvg.current);
    const barSvg = d3.select(barplotSvg.current);
    const axisSize = svgSize - 2 * props.margin;
 
    const minX = d3.min(props.data, d => d[0]);
    const maxX = d3.max(props.data, d => d[0]);
	const sortedData = props.data.slice().sort((a, b) => a[1] - b[1]);
    const minY = sortedData[0][1];
    const maxY = sortedData[sortedData.length - 1][1];


	const yScale = d3.scaleLinear().domain([minY, maxY]).range([props.margin + axisSize, props.margin]);
	

    const xScale = d3.scaleLinear().domain([minX, maxX]).range([props.margin, props.margin + axisSize]);
    
// Calculate the range of values for both x and y axes
const xRange = maxX - minX;
const yRange = maxY - minY;

// Determine the number of ticks based on the range and desired tick interval
const xTicks = Math.ceil(xRange / 10);
const yTicks = Math.ceil(yRange / 10);

// Create the x and y axis generators with ticks at intervals of 10
const xAxis = d3.axisBottom(xScale).ticks(xTicks).tickFormat(d => d.toFixed(0));
const yAxis = d3.axisLeft(yScale).ticks(yTicks).tickFormat(d => d.toFixed(0));

    const brush = d3.brush()
    .extent([[props.margin, props.margin], [svgSize - props.margin, svgSize - props.margin]])
    .on("brush", brushed) // Listen to brush event
    .on("end", brushEnded); // Separate end event handler


    svg.append("g").call(brush);
	// Create the x and y axis generators without grid lines


    // Append the x-axis to the SVG
   // Append the x-axis to the SVG
svg.append("g")
    .attr("transform", `translate(0, ${svgSize-props.margin})`)
    .call(xAxis)
    .selectAll("text")
    .attr("dy", "0.3em");

// Append the y-axis to the SVG
svg.append("g")
    .attr("transform", `translate(${props.margin}, 0)`)
    .call(yAxis)
    .selectAll("text")
    .attr("dx", "0em");


    svg.selectAll("circle")
   .data(props.data)
   .enter()
   .append("circle")
   .attr("class", (d, idx) => `point-${idx}`)
   .attr("cx", d => xScale(d[0]))
   .attr("cy", d => yScale(d[1]))
   .attr("r", props.radius)
   .attr("fill", "blue");


	  function brushed(event) {
		if (!event.selection) {
			// If no selection, reset the colors of all dots and update the bar plot with the entire dataset
			svg.selectAll("circle")
				.classed("highlighted", false)
				.classed("hovered", false);
			updateBarPlot(props.data);
			return;
		}

		
		const selectedIndices = [];
		const [[x0, y0], [x1, y1]] = event.selection;
		
		props.data.forEach((d, idx) => {
			const isSelected = xScale(d[0]) >= x0 && xScale(d[0]) <= x1 && yScale(d[1]) >= y0 && yScale(d[1]) <= y1;
			if (isSelected) {
				selectedIndices.push(idx);
			}
			svg.select(`.point-${idx}`)
			   .classed("highlighted", isSelected)
			   .classed("hovered", isSelected);
			   
		});
		setSelectedIndices(selectedIndices);
		const selectedData = props.data.filter(d => xScale(d[0]) >= x0 && xScale(d[0]) <= x1 && yScale(d[1]) >= y0 && yScale(d[1]) <= y1);
	
		if (selectedData.length <= 1) {
			updateBarPlot(props.data);
		} else {
			updateBarPlot(selectedData);
		}
	}
	
	function brushEnded(event) {
		if (!event.selection) {
			// If no selection, reset the colors of all dots and update the bar plot with the entire dataset
			svg.selectAll("circle")
				.classed("highlighted", false)
				.classed("hovered", false);
			updateBarPlot(props.data);
			setSelectedIndices([]);
		} else {
			const selectedData = svg.selectAll(".highlighted").data();
			if (selectedData.length <= 1) {
				updateBarPlot(props.data);
			} else {
				updateBarPlot(selectedData);
			}
		}
		svg.select(".brush").call(brush.move, null); // Clear the brush selection
	}
	
	
	function updateBarPlot(data) {
		// Clear previous bars and error bars
		barSvg.selectAll("*").remove();
	
		const meanX = d3.mean(data, d => d[0]);
		const meanY = d3.mean(data, d => d[1]);
		const stdDevX = d3.deviation(data, d => d[0]);
		const stdDevY = d3.deviation(data, d => d[1]);
	
		const maxMean = d3.max([meanX, meanY]);
		const maxStdDev = d3.max([stdDevX, stdDevY]);
	
		const barHeightScale = d3.scaleLinear().domain([0, maxMean + maxStdDev]).range([props.margin + axisSize, props.margin]);
		const barScale = d3.scaleBand().domain(['Mean (x)', 'Stdev(y)']).range([props.margin, props.margin + axisSize]).align(0.5).padding(props.barPadding);
	
		// Bars for mean values
				// Bars for mean values
		barSvg.selectAll("rect").data([meanX, meanY]).enter().append("rect")
		.attr("x", (d, i) => barScale(['Mean (x)', 'Stdev(y)'][i]))
		.attr("y", d => barHeightScale(d))
		.attr("width", barScale.bandwidth())
		.attr("height", d => svgSize - props.margin - barHeightScale(d))
		.attr("fill", (d, i) => i === 0 ? "steelblue" : "orange"); // Different colors for the bars

	
		// Error bars for standard deviation
		barSvg.selectAll("line").data([stdDevX, stdDevY]).enter().append("line")
			.attr("x1", (d, i) => barScale(['Mean (x)', 'Stdev(y)'][i]) + barScale.bandwidth() / 2)
			.attr("x2", (d, i) => barScale(['Mean (x)', 'Stdev(y)'][i]) + barScale.bandwidth() / 2)
			.attr("y1", (d, i) => barHeightScale([meanX, meanY][i] + d))
			.attr("y2", (d, i) => barHeightScale([meanX, meanY][i] - d))
			.attr("stroke", "black")
			.attr("stroke-width", 2);
	
		// Vertical axis for the bar graph
		const barYAxis = d3.axisLeft(barHeightScale).ticks(10).tickFormat(d => d.toFixed(0));
		barSvg.append("g")
		.attr("transform", `translate(${props.margin}, 0)`)
		.call(barYAxis)
		.selectAll("text")
		.attr("dx", "3px"); // Adjust this value as needed
	
    
    // Horizontal axis for the bar graph
    const barXAxis = d3.axisBottom(barScale);
    barSvg.append("g")
        .attr("transform", `translate(0, ${svgSize - props.margin})`)
        .call(barXAxis);
    }

    updateBarPlot(props.data);

  }, [props.data, props.margin, props.size, props.radius, props.barPadding]);

  return (
        <div>
            <svg ref={splotSvg} width={svgSize} height={svgSize}></svg>
            <svg ref={barplotSvg} width={svgSize} height={svgSize}></svg>
        </div>
);

};

export default Mainplot;
