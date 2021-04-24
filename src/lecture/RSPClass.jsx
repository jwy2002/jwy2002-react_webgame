import React, { Component } from "react";

const rspCoords = {
    바위: '0',
    가위: '-142px',
    보: '-284px',
};

const scores = {
    가위: 1,
    바위: 0,
    보: -1,
};

const computerChoice = (imgCoord) => {
    return Object.entries(rspCoords).find(
        function(v) {
            return v[1] === imgCoord;
        }
    )[0];
};

// Class 경우: constructor => render => ref => componentDidMount
//              => (setState/props 변경될떄 -> shoundCOmponentUpdate(true) -> render -> componentDidUpdate)
// 부모가 나를 제거 했을때 => componentWillUnmount => 소멸
class RSP extends Component {

    state = {
        result: '',
        imgCoord: rspCoords.바위,
        score: 0
    };

    interval;


    //onClick의 함수 호출 부분
    //onClickBtn = (choice) => {
    onClickBtn = (choice) => () => {
        const {imgCoord} = this.state;
        clearInterval(this.interval);
        const myScore = scores[choice];
        const cpuScore = scores[computerChoice(imgCoord)];
        const diff = myScore - cpuScore;
        if( diff === 0 ) {
            this.setState({
                result: '비겼습니다.!'
            });
        }
        else if( [-1, 2].includes(diff) ) {
            this.setState( (prevState) => {
                return {
                    result: '이겼습니다.',
                    score: prevState.score + 1
                };
            });
        }
        else {
            this.setState((prevState) => {
                return {
                    result: '졌습니다.',
                    score: prevState.score - 1
                };
            });
        }

        setTimeout(() => {
            this.interval = setInterval(this.changeHand, 1000);
        }, 2000);
    };

    changeHand = () => {
        const {imgCoord} = this.state;
        if (imgCoord === rspCoords.바위) {
            this.setState({
                imgCoord: rspCoords.가위,
            });
        } else if (imgCoord === rspCoords.가위) {
            this.setState({
                imgCoord: rspCoords.보,
            });
        } else if (imgCoord === rspCoords.보) {
            this.setState({
                imgCoord: rspCoords.바위,
            });
        }
    };

    //Component Life Cycle
    //rendering 생행후 호출, renrendering할떄는 호출 안됨
    componentDidMount() {       //컴포넌트가 첫 랜더링된 후, 비동기 요청
                                //비동기 요청
                                //Close 문제 발생, 비동기에서 외부 참조 불가
                                //render 에는 setState 들어가면 안됨
        this.interval = setInterval(this.changeHand, 1000);
    }

    // 리렌더링 후
    //componentDidUpdate(prevProps, prevState, snapshot) { }

    componentWillUnmount() {    //컴포넌트가 제거되기 직전, 비종기 요청 정리
        //비동기 종료
        clearInterval(this.interval);
    }

    render() {
        const { result, score, imgCoord } = this.state;
        return (
            <>
                <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
                <div>
                    <button id="rock" className="btn" onClick={this.onClickBtn('바위')}>바위</button>
                    <button id="scissor" className="btn" onClick={this.onClickBtn('가위')}>가위</button>
                    <button id="paper" className="btn" onClick={this.onClickBtn('보')}>보</button>
                </div>
                <div>{result}</div>
                <div>현재 {score}점</div>
            </>
        );
    }
}

export default RSP;