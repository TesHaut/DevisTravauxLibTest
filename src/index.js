import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Devis from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Devis />, document.getElementById('root'));
serviceWorker.register();
