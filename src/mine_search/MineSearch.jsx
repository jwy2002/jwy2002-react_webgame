import React, {useReducer, createContext, useMemo} from 'react';
import Table from "./Table";
import Form from "./Form";

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

export const CODE = {
    MINE: -7,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0   // 0이상이면 Openend
}

export const TableContext = createContext( {
    tableData: [],
    halted: true,
    dispatch: () => {}
});

const initialState = {
    tableData: [],
    timer: 0,
    result: '',
    halted: true
};

const plantMine = (row, cell, mine) => {
    console.log(row, cell, mine);
    const candidate = Array( row * cell ).fill().map((arr, i) => {
        return i;
    });
    console.log('candidate==', candidate);
    const shuffle = [];
    while( candidate.length > row * cell - mine ) {
        const chosen = candidate.splice(Math.floor(Math.random()*candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    console.log('shuffle==', shuffle);
    const data = [];
    for( let i=0;i<row;i++ ) {
        const rowData = [];
        data.push(rowData);
        for( let j=0;j<cell;j++ ) {
            rowData.push(CODE.NORMAL);
        }
    }

    for( let k=0;k<shuffle.length;k++ ) {
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }

    console.log(data);
    return data;
};

const reducer = (state, action) => {
    console.log('reducer', action.type);

    switch( action.type ) {
        case START_GAME:
            return {
                ...state,
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false
            };

        case OPEN_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.OPENED;
            return {
                ...state,
                tableData
            };
        }

        case CLICK_MINE: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.CLICKED_MINE;
            return {
                ...state,
                tableData,
                halted: true
            };
        }

        case FLAG_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if( tableData[action.row][action.cell] === CODE.MINE ) {
                tableData[action.row][action.cell] = CODE.FLAG_MINE;
            }
            else {
                tableData[action.row][action.cell] = CODE.FLAG;
            }
            return {
                ...state,
                tableData
            };
        }

        case QUESTION_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if( tableData[action.row][action.cell] === CODE.FLAG_MINE ) {
                tableData[action.row][action.cell] = CODE.QUESTION_MINE;
            }
            else {
                tableData[action.row][action.cell] = CODE.QUESTION;
            }
            return {
                ...state,
                tableData
            };
        }

        case NORMALIZE_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if( tableData[action.row][action.cell] === CODE.QUESTION_MINE ) {
                tableData[action.row][action.cell] = CODE.MINE;
            }
            else {
                tableData[action.row][action.cell] = CODE.NORMAL;
            }
            return {
                ...state,
                tableData
            };
        }

        default:
            return state;
    }
};

const MineSearch = () => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, halted, timer, result } = state;

    //useMemo 를 사용하여 Caching, dispatch를 갱신되지 않음
    const value = useMemo(()=>({ tableData: tableData, halted: halted, dispatch }), [tableData, halted]);

    return (
        <TableContext.Provider value={value}>
            <Form />
            <div>타이머:{timer}</div>
            <Table />
            <div>{result}</div>
        </TableContext.Provider>
    );
};

export default MineSearch;