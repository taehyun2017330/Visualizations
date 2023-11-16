import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import TableView from './TableView';
import ControlPanel from './ControlPanel';


const MainPlot = ({
  data,
  width,
  height,
  margin,
  pointSize,
  maxPointSize,
  nominalOptions,
  ordinalOptions,
  quantitativeOptions,
}) => {
  const [selectedData, setSelectedData] = useState([]);


  const [xAttribute, setXAttribute] = useState('imdb_rating');
  const [yAttribute, setYAttribute] = useState('us_gross');
  const [colorAttribute, setColorAttribute] = useState('none');
  const [opacityAttribute, setOpacityAttribute] = useState('none');
  const [sizeAttribute, setSizeAttribute] = useState('none');

  const handleXAttributeChange = (selectedOption) => {
    setXAttribute(selectedOption.value);
    setSelectedData([]); // Reset selected data
  };

  const handleYAttributeChange = (selectedOption) => {
    setYAttribute(selectedOption.value);
    setSelectedData([]); // Reset selected data
  };

  const handleColorAttributeChange = (selectedOption) => {
    setColorAttribute(selectedOption.value);
    setSelectedData([]); // Reset selected data
  };

  const handleOpacityAttributeChange = (selectedOption) => {
    setOpacityAttribute(selectedOption.value);
    setSelectedData([]); // Reset selected data
  };

  const handleSizeAttributeChange = (selectedOption) => {
    setSizeAttribute(selectedOption.value);
    setSelectedData([]); // Reset selected data
  };

  const svgRef = useRef();
  useEffect(() => {
    
    const parsedData = data.map((d, index) => ({
      ...d,
      id: `id-${index}`,
      budget: +d.budget,
      us_gross: +d.us_gross,
      worldwide_gross: +d.worldwide_gross,
      rotten_rating: +d.rotten_rating,
      imdb_rating: +d.imdb_rating,
      imdb_votes: +d.imdb_votes.replace(/,/g, ''),
    }));

    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(parsedData, d => d[xAttribute]))
      .range([margin+10, width - margin]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(parsedData, d => d[yAttribute]))
      .range([height - margin, margin+10]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    let sizeScale;
    if (sizeAttribute !== 'none') {
      sizeScale = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => +d[sizeAttribute]))
        .range([pointSize, maxPointSize]);
    }

    let opacityScale;
    if (opacityAttribute !== 'none') {
      opacityScale = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => +d[opacityAttribute]))
        .range([0.1, 1]);
    }

    

    const svg = d3.select(svgRef.current);
  
  
    // Create or Update X-Axis
    let xAxisGroup = svg.select('.x-axis');
    if (xAxisGroup.empty()) {
      xAxisGroup = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height - margin})`);
    }
  
    xAxisGroup.transition().duration(1000)
      .call(d3.axisBottom(xScale));
  
    // Create or Update Y-Axis
    let yAxisGroup = svg.select('.y-axis');
    if (yAxisGroup.empty()) {
      yAxisGroup = svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin+10},0)`);
    }
  
    yAxisGroup.transition().duration(1000)
      .call(d3.axisLeft(yScale));
  
    // Circle elements with transitions
    // Bind the data to the circles
const circles = svg.selectAll('circle')
.data(parsedData, d => d.id); // Ensure that the key function correctly identifies each data point

const ids = new Set(parsedData.map(d => d.id));
if(ids.size !== parsedData.length) {
    console.error("Duplicate ids found in data");
}
parsedData.forEach(d => {
  if(isNaN(d.budget) || isNaN(d.us_gross) || isNaN(d.worldwide_gross) || isNaN(d.rotten_rating) || isNaN(d.imdb_rating) || isNaN(d.imdb_votes)) {
      console.error("Inconsistent data formatting found", d);
  }
});

parsedData.forEach(d => {
  if(d.id === undefined || d.id === null) {
      console.error("Missing id in data point", d);
  }
  // Add similar checks for other essential fields if necessary
});
const idCounts = new Map();
parsedData.forEach(d => {
    idCounts.set(d.id, (idCounts.get(d.id) || 0) + 1);
});

const duplicates = Array.from(idCounts).filter(([id, count]) => count > 1);
if (duplicates.length > 0) {
    console.error("Duplicate IDs:", duplicates);
    // You may need to decide how to handle these duplicates
}

// Enter selection
circles.enter()
.append('circle')
.attr('class', 'data-point')
// Set initial positions and attributes
.attr('cx', d => xScale(d[xAttribute]))
.attr('cy', d => yScale(d[yAttribute]))
.attr('r', pointSize)
.attr('fill', 'black')
.attr('opacity', 1)
// Transition for new elements (if needed)
.transition()
.duration(1000)
.attr('r', d => sizeAttribute === 'none' ? pointSize : sizeScale(d[sizeAttribute]))
.attr('fill', d => colorAttribute === 'none' ? 'black' : colorScale(d[colorAttribute]))
.attr('opacity', d => opacityAttribute === 'none' ? 1 : opacityScale(d[opacityAttribute]));

// Update selection
circles.transition() // Apply transition to all existing circles
.duration(1000)
.attr('cx', d => xScale(d[xAttribute]))
.attr('cy', d => yScale(d[yAttribute]))
.attr('r', d => sizeAttribute === 'none' ? pointSize : sizeScale(d[sizeAttribute]))
.attr('fill', d => colorAttribute === 'none' ? 'black' : colorScale(d[colorAttribute]))
.attr('opacity', d => opacityAttribute === 'none' ? 1 : opacityScale(d[opacityAttribute]));

// Exit selection
circles.exit()
.transition()
.duration(1000)
.style('opacity', 0)
.remove();

  // Brush setup
  console.log('Setting up brush');
  const brush = d3.brush()
    .extent([[margin, margin], [width - margin, height - margin]])
    .on("brush", brushed)
    .on("end", brushEnded);
  
    console.log('Brush setup complete');
    svg.select(".brush").call(brush.move, null);
  const brushGroup = svg.select(".brush");
  if (brushGroup.empty()) {
    svg.append("g")
      .attr("class", "brush")
      .call(brush);
  } else {
    brushGroup.call(brush); // Update existing brush
  }

// Brush event handlers
function brushed(event) {
  console.log('Brushed event triggered');
  const selection = event.selection;
  if (!selection) {
    svg.selectAll('.data-point').attr('stroke', null);
    return;
  }

  const [[x0, y0], [x1, y1]] = selection;
  svg.selectAll('.data-point').each(function(d) {
    const point = d3.select(this);
    const isInside = xScale(d[xAttribute]) >= x0 && xScale(d[xAttribute]) <= x1 &&
                     yScale(d[yAttribute]) >= y0 && yScale(d[yAttribute]) <= y1;
    point.attr('stroke', isInside ? 'red' : null)
         .attr('stroke-width', isInside ? 2 : null);
  });
}
function brushEnded(event) {
  // Extracting the selection from the event object
  const selection = event.selection;

  if (!selection) {
    // Reset the stroke for all points if no selection is made
    svg.selectAll('.data-point')
       .attr('stroke', null)
       .attr('stroke-width', null);
    setSelectedData([]); // Also clear the selected data
    return;
  }

  const [[x0, y0], [x1, y1]] = selection;

  const selected = parsedData.filter(d =>
    xScale(d[xAttribute]) >= x0 && xScale(d[xAttribute]) <= x1 &&
    yScale(d[yAttribute]) >= y0 && yScale(d[yAttribute]) <= y1
  );

  setSelectedData(selected);
}

}, [data, xAttribute, yAttribute, colorAttribute, sizeAttribute, opacityAttribute, width, height, margin,pointSize,maxPointSize]);


return (
  <div>
    <ControlPanel
      quantitativeOptions={quantitativeOptions}
      nominalOptions={nominalOptions}
      ordinalOptions={ordinalOptions}
      selectedX={{ value: xAttribute, label: xAttribute }}
      selectedY={{ value: yAttribute, label: yAttribute }}
      selectedColor={{ value: colorAttribute, label: colorAttribute }}
      selectedOpacity={{ value: opacityAttribute, label: opacityAttribute }}
      selectedSize={{ value: sizeAttribute, label: sizeAttribute }}
      handleXChange={handleXAttributeChange}
      handleYChange={handleYAttributeChange}
      handleColorChange={handleColorAttributeChange}
      handleOpacityChange={handleOpacityAttributeChange}
      handleSizeChange={handleSizeAttributeChange}
    />
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flexGrow: 1 }}>
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
      <div style={{ flexGrow: 1 }}>
        <TableView data={selectedData} />
      </div>
    </div>
  </div>
);
};

export default MainPlot;
