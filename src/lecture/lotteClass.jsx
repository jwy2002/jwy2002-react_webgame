import React, { Component } from "react";
import Ball from './Ball';

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

class Lotte extends Component {

    state = {
        winNumbers: getWinNumbers(),    //당첨 숫자들
        winBalls: [],
        bonus: null, // 보너스 공
        redo: false
    };

    timeouts = [];

    runTimeout = () => {
        const { winNumbers } = this.state;
        //let를 사용할 경우 close 문제 발생 안함
        for( let i=0;i<this.state.winNumbers.length-1;i++ ) {
            this.timeouts[i] = setTimeout( () => {
                this.setState((prevState) => {
                    return {
                        winBalls: [...prevState.winBalls, winNumbers[i]]
                    };
                });
            }, (i + 1) * 1000);
        }

        this.timeouts[6] = setTimeout( () => {
            this.setState({
                bonus: winNumbers[6],
                redo: true
            });
        }, 7000);
    }

    componentDidMount() {
        console.log('componentDidMount');
        if( this.state.winBalls.length === 0 ) {
            this.runTimeout();
        }
        console.log('로토 숫자를 생성합니다.');
    }

    //setState 될때 호출 됨
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate');
        if( this.state.winBalls.length === 0 ) {
            this.runTimeout();
        }

        if( prevState.winNumbers !== this.state.winNumbers ) {
            console.log('로토 숫자를 생성합니다.');
        }
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
        this.timeouts.forEach((v) => {
            clearTimeout(v);
        });
    }

    onClickRedo = () => {
        this.setState({
            winNumbers: getWinNumbers(),    //당첨 숫자들
            winBalls: [],
            bonus: null, // 보너스 공
            redo: false
        });
        this.timeouts = [];
    };

    render() {
        const { winBalls, bonus, redo } = this.state;
        console.log(winBalls);
        return (
            <>
                <div>당첨 숫자</div>
                <div id="결과창">
                    {winBalls.map((v) => <Ball key={v} number={v} />)}
                </div>
                <div>보너스!</div>
                {bonus && <Ball number={bonus} />}
                {redo && <button onClick={this.onClickRedo}>한 번 더!</button>}
            </>
        );
    }
}

export default Lotte;