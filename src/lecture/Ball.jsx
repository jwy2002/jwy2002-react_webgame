import React, { memo } from "react";
//PureComponent vs memo
//state를 사용하지 않는 경우(Hooks 아님) 함수 Component 사용
const Ball = memo(({ number }) => {
    console.log("Sub Ball");
    let background;
    if( number <= 10 ) {
        background = 'red';
    }
    else if( number <= 20 ) {
        background = 'orange';
    }
    else if( number <= 30 ) {
        background = 'yellow';
    }
    else if( number <= 40 ) {
        background = 'blue';
    }
    else {
        background = 'green';
    }

    return (
        <div className="ball" style={{ background }}>{number}</div>
    );
});

export default Ball;