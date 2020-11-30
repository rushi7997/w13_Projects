import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import Header from "./Components/Header";
import Wrapper from "./Components/Wrapper";
// import Discogs from './Components/Discogs';

ReactDOM.render(
  <div>
    <Header />
    <Wrapper />
  </div>,
  document.getElementById('root')
);

reportWebVitals();
