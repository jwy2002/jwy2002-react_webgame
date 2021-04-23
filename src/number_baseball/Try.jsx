import React, { PureComponent, memo } from 'react';

// const Try = ({ props }) => {
const Try = memo(({ tryInfo }) => {  //구조분해
    return (
        <li>
            <div>{tryInfo.try}</div>
            <div>{tryInfo.result}</div>
        </li>
    )
});

export default Try;