import React, {useReducer, createContext, useMemo, useEffect} from 'react';
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
    data: {
        row: 0,
        cell: 0,
        mine: 0
    },
    timer: 0,
    result: '',
    halted: true,
    openedCount: 0
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
                data: {
                    row: action.row,
                    cell: action.cell,
                    mine: action.mine
                },
                openedCount: 0,
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false,
                timer: 0
            };

        case OPEN_CELL: {

            const tableData = [...state.tableData];
            //모든칸을 신규로 만듬
            tableData.forEach((row, i) => {
                tableData[i] = [...row];
            });
            //tableData[action.row] = [...state.tableData[action.row]];
            //tableData[action.row][action.cell] = CODE.OPENED;

            const checked = [];
            let openedCount = 0;
            console.log(tableData.length, tableData[0].length);

            //내주변으로 검사
            const checkAround = (row, cell) => {

                console.log(row, cell);
                //닫힌 칸만 열기
                if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])) {
                    return;
                }
                //상하좌우 칸이 아닌 경우 필터링
                if( row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
                    return;
                }
                if( checked.includes(row + ',' + cell) ) {
                    return;
                }
                else {
                    checked.push(row + ',' + cell);
                }
                openedCount += 1;
                //주변지뢰갯수
                // let around = [];
                // if( tableData[row - 1] ) {
                //     around = around.concat(
                //         tableData[row - 1][cell - 1],
                //         tableData[row - 1][cell],
                //         tableData[row - 1][cell + 1]
                //     );
                // }
                // around = around.concat(
                //     tableData[row][cell - 1],
                //     tableData[row][cell + 1]
                // )
                // if( tableData[row + 1] ) {
                //     around = around.concat(
                //         tableData[row + 1][cell - 1],
                //         tableData[row + 1][cell],
                //         tableData[row + 1][cell + 1]
                //     );
                // }
                let around = [
                    tableData[row][cell - 1], tableData[row][cell + 1],
                ];
                if (tableData[row - 1]) {
                    around = around.concat([tableData[row - 1][cell - 1], tableData[row - 1][cell], tableData[row - 1][cell + 1]]);
                }
                if (tableData[row + 1]) {
                    around = around.concat([tableData[row + 1][cell - 1], tableData[row + 1][cell], tableData[row + 1][cell + 1]]);
                }
                const count = around.filter((v) => [
                    CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE
                ].includes(v)).length;

                if( count === 0 ) {
                    if (row > -1) {
                        const near = [];
                        if (row - 1 > -1) {
                            near.push([row -1, cell - 1]);
                            near.push([row -1, cell]);
                            near.push([row -1, cell + 1]);
                        }
                        near.push([row, cell - 1]);
                        near.push([row, cell + 1]);
                        if (row + 1 < tableData.length) {
                            near.push([row + 1, cell - 1]);
                            near.push([row + 1, cell]);
                            near.push([row + 1, cell + 1]);
                        }
                        near.forEach((n) => {
                            if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                                checkAround(n[0], n[1]);
                            }
                        })
                    }
                }

                if (tableData[row][cell] === CODE.NORMAL) { // 내 칸이 닫힌 칸이면 카운트 증가
                    openedCount += 1;
                }

                tableData[row][cell] = count;
            };

            checkAround(action.row, action.cell);

            let halted = false;
            let result = '';
            console.log('====>',state.data.row * state.data.cell - state.data.mine, state.openedCount, openedCount);
            if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) { // 승리
                halted = true;
                result = `${state.timer}초만에 승리하셨습니다`;
            }

            return {
                ...state,
                tableData,
                openedCount: state.openedCount + openedCount,
                halted,
                result
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

        case INCREMENT_TIMER: {
            return {
                ...state,
                timer: state.timer + 1,
            }
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

    useEffect(() => {
        let timer;
        if (halted === false) {
            timer = setInterval(() => {
                dispatch({ type: INCREMENT_TIMER });
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        }
    }, [halted]);

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