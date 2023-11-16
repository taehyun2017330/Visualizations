import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {colormap } from '../utils/colormap';
import {tnc} from '../utils/tnc';
import rawData from '../data/raw.json';
import { Delaunay } from 'd3-delaunay';
import useStore from './useStore';
import useStore2 from './useStore2';

const ProjectionView = ({ width=640, height=640 }) => {
    const svgRef = useRef();
    const checkViz = useStore2(state => state.checkViz);
const setGlobalCheckViz = useStore2(state => state.setCheckViz);


    const attributes = useStore(state => state.attributes); 
   
    

    const padding = {
      top: height * 0.05,
      right: width * 0.05,
      bottom: height * 0.05,
      left: width * 0.05
  };
  

    

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    
    svg.selectAll("*").remove(); // Clear SVG for new rendering

    // Calculate the projection of the points based on the attributes' vectors
    
    const calculateProjection = (data, attributes) => {
      return data.map(d => {
        let dx = 0, dy = 0;
        attributes.forEach((attr, index) => {
          dx += attr.ax * d[index]; // use ax from the store
          dy += attr.ay * d[index]; // use ay from the store
        });
        return { dx, dy };
      });
    };

    const projectedPoints = calculateProjection(rawData, attributes);

    // Add scaling for the points
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    
    const xScale = d3.scaleLinear()
                     .domain(d3.extent(projectedPoints, d => d.dx))
                     .range([padding.left, innerWidth + padding.left]);
    
    const yScale = d3.scaleLinear()
                     .domain(d3.extent(projectedPoints, d => d.dy))
                     .range([ padding.top,innerHeight + padding.top]);
    
    

    // Draw each data point as a circle with scaled coordinates
    projectedPoints.forEach(point => {
      svg.append('circle')
        .attr('cx', xScale(point.dx))
        .attr('cy', yScale(point.dy))
        .attr('r', 3)
        .attr('fill', 'white')
        .attr('stroke', 'black');
    });

    // If CheckViz is enabled, draw the Voronoi cells
if (checkViz) {
  // Step 1: Calculate Trustworthiness and Continuity values
  const projectedPoints2D = projectedPoints.map(point => [point.dx, point.dy]);

  const { trust, conti } = tnc(rawData, projectedPoints2D);
  

  // Step 2: Apply the Color Map with added transparency or gradient
  const colors = projectedPoints.map((_, i) => {
    // Example of adding transparency to the color
    const color = d3.color(colormap(trust[i], conti[i]));
    return color;
  });

  // Step 3: Render Voronoi Cells
  const delaunay = Delaunay.from(projectedPoints.map(p => [xScale(p.dx), yScale(p.dy)]));
  const voronoi = delaunay.voronoi([0, 0, width, height]);

  

  svg.append("g")
    .selectAll("path")
    .data(projectedPoints.map((_, i) => voronoi.renderCell(i)))
    .join("path")
      .attr("d", d => d)
      .attr("stroke", "none")
      .attr("fill", (d, i) => colors[i]);
    // Use modified colors with transparency
}

// Draw the points after Voronoi cells so they appear on top
projectedPoints.forEach(point => {
  svg.append('circle')
    .attr('cx', xScale(point.dx))
    .attr('cy', yScale(point.dy))
    .attr('r', 3)
    .attr('fill', 'white')
    .attr('stroke', 'black');
});

    
  }, [checkViz, attributes]);

  // Toggle CheckViz visualization
  const toggleCheckViz = () => {
    setGlobalCheckViz(!checkViz);
  };

  return (
    <>
      <svg ref={svgRef} width={width} height={height}></svg>
      <button onClick={toggleCheckViz}>
        {checkViz ? 'Disable CheckViz' : 'Enable CheckViz'}
      </button>
    </>
  );
};

export default ProjectionView;

