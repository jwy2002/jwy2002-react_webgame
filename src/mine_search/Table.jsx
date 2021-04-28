import React, {useContext} from 'react';
import Tr from './Tr';
import {TableContext} from "./MineSearch";

const Table = () => {

    console.log('table rendered');
    const { tableData } = useContext(TableContext);
    return (
        <table>
            <tbody>
            {Array(tableData.length).fill().map((tr, i) => <Tr rowIndex={i} key={i} />)}
            </tbody>
        </table>
    );
};

export default Table;