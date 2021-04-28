import React, {useEffect, useRef} from 'react';
import Tr from './Tr';

const Table = ( {tableData, dispatch} ) => {

    console.log('table rendered');

    const ref = useRef([]);
    useEffect( () => {
        console.log(tableData === ref.current[0], dispatch === ref.current[1]);
        ref.current = [tableData, dispatch];
    }, [tableData, dispatch]);

    return (
        <table>
            <tbody>
                {Array(tableData.length).fill().map((tr, i) => (
                    <Tr key={i} rowIndex={i} rowData={tableData[i]} dispatch={dispatch} />
                ))}
            </tbody>
        </table>
    );
};

export default Table;