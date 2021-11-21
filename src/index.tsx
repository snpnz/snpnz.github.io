import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import App from './components/App';
import store from "./store";
import { Provider } from 'react-redux';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
