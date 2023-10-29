import React, { useRef, useEffect } from "react";
import { useStore } from './Mainplot';

import * as d3 from "d3";

const Scatterplot = (props) => {
  const scatterRef = useRef(null);
  
  const selectedIndices = useStore((state) => state.selectedIndices);

  useEffect(() => {
	
	
	
    const svg = d3.select(scatterRef.current);
	svg.selectAll("*").remove();

	
    const axisSize = props.size - 2 * props.margin;

    const minX = d3.min(props.data, d => d[0]);
    const maxX = d3.max(props.data, d => d[0]);
	const sortedData = props.data.slice().sort((a, b) => a[1] - b[1]);
  const minY = sortedData[0][1];
    const maxY = sortedData[sortedData.length - 1][1];

    const xScale = d3.scaleLinear().domain([minX, maxX]).range([props.margin, props.margin + axisSize]);
    const yScale = d3.scaleLinear().domain([minY, maxY]).range([props.margin + axisSize, props.margin]);

    // Calculate the range of values for both x and y axes
    const xRange = maxX - minX;
    const yRange = maxY - minY;

    // Determine the number of ticks based on the range and desired tick interval
    const xTicks = Math.ceil(xRange / 10);
    const yTicks = Math.ceil(yRange / 10);

    // Create the x and y axis generators
    const xAxis = d3.axisBottom(xScale).ticks(xTicks).tickFormat(d => d.toFixed(0));
    const yAxis = d3.axisLeft(yScale).ticks(yTicks).tickFormat(d => d.toFixed(0));

    // Append the x-axis to the SVG
    svg.append("g")
      .attr("transform", `translate(0, ${props.size - props.margin})`)
      .call(xAxis)
      .selectAll("text")
      .attr("dy", "0.3em");
	
	console.log(selectedIndices);

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
   .attr("cx", d => xScale(d[0]))
   .attr("cy", d => yScale(d[1]))
   .attr("r", props.radius)
   .attr("fill", "blue")
   .attr("class", (d, idx) => {
       return selectedIndices.includes(idx) ? `point-${idx} hovered` : `point-${idx}`;
   });



    // You can call this function whenever the Dino plot is brushed with the indices of the brushed points
    // highlightPoints([2, 5, 7]); // Example usage

  }, [props.data, props.margin, props.size, props.radius,selectedIndices]);

  return (
    <svg ref={scatterRef} width={props.size} height={props.size}></svg>
  );
};

export default Scatterplot;
