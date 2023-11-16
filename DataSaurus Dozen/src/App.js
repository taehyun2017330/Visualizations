import React from "react";
import Scatterplot from "./components/Scatterplot";
import Mainplot from "./components/Mainplot";
import datasaurus from "./data/datasaurus.json";
import "./App.css";

function App() {
  const mainWidth = 200;
  const subWidth = 150;
  const margin = 20;
  const radius = 1.5;
  const barPadding = 0.3;

  let keys = Object.keys(datasaurus);
  keys = keys.filter(d => d !== "dino");

  return (
    <div className="App">
      <div className="content" style={{ width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', display: 'block' }}>
          The Datasaurus Dozen: A Tale of Statistical Paradox
        </h1>
        <p style={{ fontFamily: 'Georgia, serif', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 'normal', maxWidth: '800px', margin: '1rem auto' }}>
          Welcome to a playful exploration of the <strong>Datasaurus Dozen</strong>, where <strong>statistics</strong> and <strong>dinosaurs</strong> come together! This visualization showcases how <strong>Justin Matejka</strong> and <strong>George Fitzmaurice</strong> brilliantly created a series of datasets that are statistically similar yet visually distinct. Have fun interacting with the scatterplots and discovering the quirky resemblance of these graphs to a dinosaur – a comical yet insightful demonstration of why <strong>data visualization</strong> matters as much as statistical analysis.
        </p>
        <div className="splotContainer">
          <Mainplot
            size={mainWidth}
            data={datasaurus.dino}
            margin={margin}
            radius={radius}
            barPadding={barPadding}
          />
        </div>
        <div className="splotContainer">
          {keys.slice(0, 4).map(key => (
            <Scatterplot
              key={key}
              size={subWidth}
              data={datasaurus[key]}
              margin={margin}
              radius={radius}
            />
          ))}
        </div>
        <div className="splotContainer">
          {keys.slice(4, 8).map(key => (
            <Scatterplot
              key={key}
              size={subWidth}
              data={datasaurus[key]}
              margin={margin}
              radius={radius}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
