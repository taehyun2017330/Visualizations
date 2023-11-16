import React, { useState, useEffect } from 'react';
import AxisView from './components/AxisView';
import ProjectionView from './components/ProjectionView';
import LegendView from './components/LegendView';
import attrData from './data/attr.json';
import './App.css'; // Importing the CSS file

function App() {
  const [axisConfig, setAxisConfig] = useState([]);
  const [checkViz, setCheckViz] = useState(true); // State to control CheckViz

  useEffect(() => {
    setAxisConfig(attrData);
  }, []);

 // In App.js
const handleAxisInteraction = () => {
  setCheckViz(false); // Turn off CheckViz whenever AxisView is interacted with
};

  
  const radius = 130;

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '2rem 0' }}>
        Star Coordinates & CheckViz
      </h1>
      <p style={{ fontSize: '1rem', maxWidth: '800px', margin: '1rem auto' }}>
        Explore multidimensional data visualization through <strong>Star Coordinates</strong>. 
        Utilize <em>CheckViz</em> to uncover the intricacies of projection and the distortions that may arise.
        This interactive system invites you to manipulate and observe the effects of different axis configurations 
        on your data, providing a deeper understanding of the impact of projection choices. You can mess with the Axis control to see the neighbor relationship changes with with the attribution changes
      </p>
      <div className="visualization-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'start', paddingTop: '1rem' }}>
        <div className="projection-view" style={{ flex: 3 }}>
          <ProjectionView 
            checkViz={checkViz} // Assume checkViz state is defined elsewhere
            // ...pass other necessary props...
          />
        </div>
        <div className="side-views" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AxisView 
            attributes={axisConfig} // Assume axisConfig is defined elsewhere
            radius={radius} // Assume radius is defined elsewhere
            onInteraction={handleAxisInteraction} // Assume handleAxisInteraction is defined elsewhere
          />
          <LegendView />
        </div>
      </div>
    </div>
  );
}
  

export default App;
