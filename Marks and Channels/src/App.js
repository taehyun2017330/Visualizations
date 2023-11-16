import React from "react";
import Mainplot from "./components/Mainplot";

import movies from "./data/movie.json";

import "./App.css";


function App() {

  const name = "Taehyun Yang";
  const studentNum = "2021-14284";

  const nominal = ["genre", "creative_type", "source"];
  const ordinal = ["release", "rating"];
  const quantitative = ["budget", "us_gross", "worldwide_gross", "rotten_rating", "imdb_rating", "imdb_votes"];

  const defaultXAttribute = "imdb_rating";
  const defaultYAttribute = "us_gross";
  const defaultColorAttribute = "none";
  const defaultSizeAttribute = "none";
  
  const width = 500;
  const height = 350;
  const margin = 35;
  const pointSize = 3;
  const maxPointSize = 10;

  return (
    <div className="App">
      <div className="header">
        <h1 style={{
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0.5em'
        }}>Interactive Movie Data Visualization</h1>
        <p style={{
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
          fontSize: '1rem',
          maxWidth: '800px',
          margin: '1rem auto'
        }}>
          Explore a rich dataset of movies from <em>IMDb</em> and <em>Rotten Tomato</em> in an <strong>interactive visualization system</strong>. This platform allows you to dive into various movie metrics and discover patterns and trends across different genres, ratings, and financial success. <strong>Experiment with different marks and channels</strong> to see how the <strong>effectiveness</strong> of each visualization changes. This exploration highlights the significance of <strong>efficient mark utilization</strong> in the craft of data visualization.
        </p>
      </div>
      <Mainplot
        width={width}
        height={height}
        margin={margin}
        data={movies}
        xAttribute={defaultXAttribute}
        yAttribute={defaultYAttribute}
        colorAttribute={defaultColorAttribute}
        sizeAttribute={defaultSizeAttribute}
        pointSize={pointSize}
        maxPointSize={maxPointSize}
        nominalOptions={nominal}
        ordinalOptions={ordinal}
        quantitativeOptions={quantitative}
      />
    </div>
  );
      }  

export default App;