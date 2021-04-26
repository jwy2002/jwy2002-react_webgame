import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Ball from './Ball';

//useMemo 복잡한 계산 결과 값을 저장(함수 return값을 기역)
//useCallback 함수자체를 기역

//7개 숫자 추출
function getWinNumbers() {
    console.log('getWinNumbers');
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
    return [...winNumbers, bonusNumber];
}

const Lotte = () => {
    const lottoNumbers = useMemo( () => getWinNumbers(), []);   //입력 값이 바뀌면 호출
    //return 값을 기억하고 있음
    //hooks는 전체가 reloading 됨
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect( () => {
        console.log('useEffect');
        for( let i=0;i<winNumbers.length-1;i++ ) {
            timeouts.current[i] = setTimeout( () => {
                setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
            }, (i + 1) * 1000);
        }

        timeouts.current[6] = setTimeout( () => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000);

        return () => {
            timeouts.current.forEach( (v) => {
                clearTimeout(v);
            });
        };
    }, [timeouts.current]); //빈 배열이면 componentDidMount와 동일
    // 배열의 요소가 있으면 componentDidMount, componentDidUpdate 둘다 수행

    useEffect( () => {
        console.log('로또 숫자를 생성합니다.');
    }, [winNumbers]);


    // ajax sample
    // useEffect( () => {
    //     // ajax code
    // }, []);
    // const mounted = useRef(false);
    // useEffect(() => {
    //     if( !mounted.current ) {
    //         mounted.current = true;
    //     }
    //     else {
    //         // ajax code
    //     }
    // }, []); //바뀌는 값


    const onClickRedo = useCallback( () => {
        //자식 Component에 함수를 전달할때 useCallback 사용
        //함수가 매번 변경되면 자식 Component가 Rerendering 됨
        console.log('onClickRedo');
        console.log(winNumbers);    //State는 바뀌지 않음
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);

        timeouts.current = [];
    }, [winNumbers]);

    return (
        <>
            <div>당첨 숫자</div>
            <div id="결과창">
                {winBalls.map((v) => <Ball key={v} number={v} />)}
            </div>
            <div>보너스!</div>
            {bonus && <Ball number={bonus} />}
            {redo && <button onClick={onClickRedo}>한 번 더!</button>}
        </>
    );
}

export default Lotte;