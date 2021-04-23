import React, { PureComponent, memo, useState } from 'react';

// const Try = ({ props }) => {
const Try = memo(({ tryInfo }) => {  //구조분해
    const [result, setResult] = useState(tryInfo.result);

    const onClick = () => {
        setResult('1');
    };

    return (
        <li>
            <div>{tryInfo.try}</div>
            <div onClick={onClick}>{tryInfo.result}</div>
        </li>
    )
});

export default Try;