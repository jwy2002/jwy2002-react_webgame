import React, { useState, useRef } from "react";
//useState render 호출
//useRef render 호출 안됨 current 로 접근

const ResponseCheck = () => {
    const [state, setState] = useState('waiting');
    const [message, setMessage] = useState('클릭해서 시작하세요.');
    const [result, setResult] = useState([]);
    const timeout = useRef(null);
    const startTime = useRef();
    const endTime = useRef();

    const onClickScreen = () => {
        if( state === 'waiting' ) { //대기
            setState('ready');
            setMessage('초록색이 되면 클릭하세요.');
            timeout.current = setTimeout( () => {
                setState('now');
                setMessage('지금 클릭');
                startTime.current = new Date();
            }, Math.floor(Math.random() * 1000) + 2000);    //2~3초 랜덤
        }
        else if( state === 'ready' ) {  //성급하게 클릭
            clearTimeout(timeout.current);
            setState('waiting');
            setMessage('너무 성급하시군요! 초록색이 된 이후에 클릭하세요.');
        }
        else if( state === 'now' ) {    //화면속도 체크
            endTime.current = new Date();
            setState('waiting');
            setMessage('클릭해서 시작하세요.');
            setResult((prevResult) => {
                return [...prevResult, endTime.current - startTime.current];
            });
        }
    };

    const onReset = () => {
        setResult([]);
    };

    const renderAverage = () => {
        return result.length === 0 ?    //React 조건문
            null : <>
                <div>평균 시간: {result.reduce((a,c) => a + c) / result.length} ms</div>
                <button onClick={onReset}>리셋</button>
            </>
    };

    return (
        <>
            <div
                id="screen"
                className={state}    //CSS
                onClick={onClickScreen}
            >{message}
            </div>
            {(() => {   //즉시실행함수 생성 :   {(() => {})()}
                if( result.length === 0 ) {
                    return null;
                }
                else {
                    return <>
                        <div>평균 시간: {result.reduce((a,c) => a + c) / result.length} ms</div>
                        <button onClick={onReset}>리셋</button>
                    </>
                }
            })()}
            {/*{renderAverage()}*/}
        </>
    );
}

export default ResponseCheck;