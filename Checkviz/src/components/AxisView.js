import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import useStore from './useStore';
import useStore2 from './useStore2';

const AxisView = ({ attributes, radius, onInteraction }) => { // Add onInteraction prop
  const svgRef = useRef();
  const circleRadius = 10;
  const margin = 80;

  const setAttributes = useStore(state => state.setAttributes);

  useEffect(() => {
    if (!attributes || attributes.length === 0) return;

    const angleStep = (2 * Math.PI) / attributes.length;
    const centerX = radius + margin;
    const centerY = radius + margin;

    const initialVectors = attributes.map((attr, index) => {
      const name = typeof attr === 'object' ? attr.name : attr;
      return {
        name: name,
        ax: Math.cos(angleStep * index),
        ay: Math.sin(angleStep * index),
      };
    });

    setAttributes(initialVectors);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-dasharray', '3, 3');

    const axisGroups = svg.selectAll(".axis")
      .data(attributes)
      .enter()
      .append("g")
      .attr("class", "axis");

    axisGroups.append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", (d, i) => centerX + Math.cos(angleStep * i) * radius)
      .attr("y2", (d, i) => centerY + Math.sin(angleStep * i) * radius)
      .attr("stroke", "black");

      axisGroups.append("circle")
      .attr("cx", (d, i) => centerX + Math.cos(angleStep * i) * radius)
      .attr("cy", (d, i) => centerY + Math.sin(angleStep * i) * radius)
      .attr("r", circleRadius)
      .attr("fill", "blue")
      .on("mouseenter", function(event, d) {
        const axisGroup = d3.select(this.parentNode);
        axisGroup.select("circle").attr("fill", "red");
        axisGroup.select("line").attr("stroke", "red");
        axisGroup.select("text").attr("fill", "red");
      })
      .on("mouseleave", function(event, d) {
        const axisGroup = d3.select(this.parentNode);
        axisGroup.select("circle").attr("fill", "blue");
        axisGroup.select("line").attr("stroke", "black");
        axisGroup.select("text").attr("fill", "black");
      })
      .call(d3.drag()
        .on("drag", dragged));

    axisGroups.append("text")
      .attr("x", (d, i) => centerX + Math.cos(angleStep * i) * (radius + circleRadius + 30))
      .attr("y", (d, i) => centerY + Math.sin(angleStep * i) * (radius + circleRadius + 30))
      .text(d => d)
      .attr("text-anchor", "middle");

    function dragged(event, d) {
      const x = event.x - centerX;
      const y = event.y - centerY;
      const angle = Math.atan2(y, x);

      const line = d3.select(this.parentNode).select("line");
      const circle = d3.select(this);
      const text = d3.select(this.parentNode).select("text");

      line.attr("x2", centerX + Math.cos(angle) * radius)
          .attr("y2", centerY + Math.sin(angle) * radius);

      circle.attr("cx", centerX + Math.cos(angle) * radius)
            .attr("cy", centerY + Math.sin(angle) * radius);

      text.attr("x", centerX + Math.cos(angle) * (radius + circleRadius + 30))
          .attr("y", centerY + Math.sin(angle) * (radius + circleRadius + 30));

      updateAttributes(d, angle);
      
      
    
      
    }

    function updateAttributes(attrName, angle) {
      
      
      
      
      const newVector = { ax: Math.cos(angle), ay: Math.sin(angle) };
    
      // Fetch the current state of the attributes from the store
      const currentAttributes = useStore.getState().attributes;
    
      const updatedAttributes = currentAttributes.map(attr => {
        if (attr.name === attrName) {
          return { ...attr, ...newVector };
        }
        return attr;
      });
    
      setAttributes(updatedAttributes);
    }
    
  }, [attributes, radius, setAttributes, onInteraction]);

  return <svg ref={svgRef} width={(radius + margin) * 2} height={(radius + margin) * 2}></svg>;
};

export default AxisView;
