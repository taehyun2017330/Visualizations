import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { colormap } from '../utils/colormap';

const LegendView = () => {
  const svgRef = useRef();
  const size = 200; // Size of the square
  const margin = 20; // Margin for text

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const numSteps = 145; // For a smoother gradient

    // Adjusted loop to correct the inversion on x-axis
    // Adjusted loop for the desired color mapping
// Adjusted loop with slight overlap for each rectangle
for (let i = 0; i < numSteps; i++) {
    for (let j = 0; j < numSteps; j++) {
      const trust = 1 - (i / numSteps);
      const conti = j / numSteps;
      const color = colormap(trust, conti);
  
      svg.append('rect')
        .attr('x', i * size / numSteps)
        .attr('y', j * size / numSteps)
        .attr('width', (size / numSteps) + 0.5)  // Slight overlap
        .attr('height', (size / numSteps) + 0.5) // Slight overlap
        .attr('fill', color);
    }
  }
  
  

    // Adjust text positioning to align with corners
    const addCornerText = (text, x, y, color, anchor) => {
        svg.append("text")
          .attr("x", x)
          .attr("y", y)
          .text(text)
          .attr("fill", color)
          .attr("text-anchor", anchor) // Left or right alignment
          .attr("alignment-baseline", "middle")
          .attr("font-size", "10px"); // Smaller text size
      };
      

    addCornerText("No Distortions", margin, size - margin, "black", "start");
    addCornerText("Missing Neighbors", margin, margin, "white", "start");
    addCornerText("False Neighbors", size - margin, size - margin, "white", "end");
    addCornerText("Both", size - margin, margin, "white", "end");

  }, []);

  return <svg ref={svgRef} width={size + margin * 2} height={size + margin * 2}></svg>;
};

export default LegendView;
