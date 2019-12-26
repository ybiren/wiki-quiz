import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Wiki } from './components/wiki/wiki';

ReactDOM.render(<Wiki />, document.getElementById('root'));
serviceWorker.unregister();
