import React, { PureComponent } from 'react';

//PureComponent 는 참조, 배열이 있으면 변경으로 판단

class Test extends PureComponent {
    state = {
        counter: 0,
        string: 'hello',
        number: 1,
        boolean: true,
        object: {},
        array: []
    };

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     if( this.state.counter !== nextState.counter ) {
    //         return true;
    //     }
    //     return false;
    // }

    onClick = () => {
        // const array = this.state.array;
        // array.push(1);
        this.setState({
            // array: array
            array: [...this.state.array, 1] // 배열을 Copy해서 사용
        });
    };

    render() {
        console.log('렌더링', this.state);
        return (
            <di>
                <button onClick={this.onClick}>클릭</button>
            </di>
        );
    }
}

export default Test;