import React, { PureComponent } from 'react';

class Try extends PureComponent {
    constructor(props) {
        super(props);
        // 다른동작
        // const filtered = this.props.filter()

        this.state = {
            result: this.props.result,
            try: this.props.try
        };
    }

    render() {
        const { tryInfo } = this.props; //부모에서 넘겨줌
        //props 자식에서 수정하면 안됨
        return (
            <li>
                <div>{tryInfo.try}</div>
                <div>{tryInfo.result}</div>
            </li>
        );
    }
}

export default Try;