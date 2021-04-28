import React, {useEffect, useRef, memo, useMemo} from 'react';
import Td from './Td';

const Tr = memo( ( {rowData, rowIndex, dispatch} ) => {
    console.log('tr rendered');

    const ref = useRef([]);
    useEffect( () => {
        console.log(rowData === ref.current[0], rowIndex === ref.current[1], dispatch === ref.current[2]);
        ref.current = [rowData, rowIndex, dispatch];
    }, [rowData, rowIndex, dispatch]);

    return (
        <tr>
            {Array(rowData.length).fill().map((td, i) => (
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useMemo( () => (
                <Td key={i}
                    rowIndex={rowIndex}
                    cellIndex={i}
                    cellData={rowData[i]}
                    dispatch={dispatch}>{''}</Td>),
                    [rowData[i]])
            ))}
        </tr>
    );
});

export default Tr;