import React, { PureComponent } from 'react';

class Try extends PureComponent {
    render() {
        const { tryInfo } = this.props; //부모에서 넘겨줌
        return (
            <li>
                <div>{tryInfo.try}</div>
                <div>{tryInfo.result}</div>
            </li>
        );
    }
}

export default Try;