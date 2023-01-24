import './App.css';
import React from 'react';
import Interface from './UI.js';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2 className='title'>
          Welcome to the Distance Calculation Tool!
        </h2>
        <Interface></Interface>
      </header>
    </div>
  );
}

export default App;
