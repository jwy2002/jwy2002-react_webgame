import React from 'react';
import Hello from './Hello';

const App = () => {

    Hello.defaultProps = {
        name: 'Noname'
    };

    return (
        <>
            <Hello name='react' color='red' />
            <Hello color='pink' />
        </>
    );
}

export default App;