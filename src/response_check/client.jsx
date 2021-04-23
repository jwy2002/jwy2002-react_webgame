import React from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';    //구조분해문법

import ResponseCheck from "./ResponseCheck";

const Hot = hot(ResponseCheck);

ReactDom.render(<Hot />, document.querySelector('#root'));