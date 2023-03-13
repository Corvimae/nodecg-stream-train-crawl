import React from 'react';
import ReactDOM from 'react-dom/client';
import { TrainCrawl } from './TrainCrawl';

const root = ReactDOM.createRoot(document.querySelector('#app'));

root.render(
  <React.StrictMode>
    <TrainCrawl />
  </React.StrictMode>
);