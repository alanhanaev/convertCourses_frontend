import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from './store/configureStore'
import CoursesListCnt from "./CoursesList/CoursesList";
import CoursesConverterCnt from "./CoursesConverter/CoursesConverter";
import Header from "./Header/Header";


const store = configureStore()

ReactDOM.render(
    <Provider store={store}>
        <Router >
            <MuiThemeProvider>
                <div>
                    <Header></Header>
                    <Route exact path="/" component={CoursesListCnt} />
                    <Route path="/courseslist" component={CoursesListCnt} />
                    <Route path="/coursesconverter" component={CoursesConverterCnt} />
                </div>
            </MuiThemeProvider>
        </Router>
    </Provider>

    , document.getElementById('root'));

registerServiceWorker();
