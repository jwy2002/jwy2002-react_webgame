import React, {useEffect, useReducer, useCallback} from "react";
import Table from './Table';

const initialState = {
    winner: '',
    turn: 'O',
    tableData: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ],
    recentCell: [-1, -1]
};

export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

//action dispatch 호출될때 실행
const reducer = (state, action) => {
    console.log(action.type);
    switch( action.type ) {
        case SET_WINNER:
            //state.winner = action.winner; 이렇게 하면 안됨.
            return {
                ...state,   //복사해서 바뀌는 부분만 수정해줌
                winner: action.winner
            };

        case CLICK_CELL:
            const tableData = [...state.tableData];
            tableData[action.row] = [...tableData[action.row]]; // immer라는 라이브러리로 가독성 해결
            tableData[action.row][action.cell] = state.turn;
            return {
                ...state,
                tableData,
                recentCell: [action.row, action.cell]
            };

        case CHANGE_TURN:
            return {
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O'
            };

        case RESET_GAME:
            return {
                ...state,
                turn: 'O',
                tableData: [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', ''],
                ],
                recentCell: [-1, -1]
            };

        default:
            return state;
    }
};

const TicTacToe = () => {
    // const [winner, setWinner] = useState('');
    // const [turn, setTurn] = useState('0');
    // const [tableData, setTableData] = useState([['','',''],['','',''],['','','']]);

    const [state, dispatch] = useReducer(reducer, initialState);    //redux에서 가져온 개념
    const { tableData, turn, winner, recentCell } = state;

    const onClickTable = useCallback(() => {
        console.log('onClickTable');
        dispatch({ type: SET_WINNER, winner: 'O' });
    }, []);

    useEffect( () => {
        const [row, cell] = recentCell;
        if (row < 0) {
            return;
        }

        let win = false;
        //가로줄
        if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
            win = true;
        }
        //세로줄
        if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
            win = true;
        }
        //대각선
        if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
            win = true;
        }
        //대각선
        if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
            win = true;
        }
        console.log(win, row, cell, tableData, turn);

        if ( win ) { // 승리시
            dispatch({ type: SET_WINNER, winner: turn });
            dispatch({ type: RESET_GAME });
        }
        else {
            let all = true; // all이 true면 무승부라는 뜻
            tableData.forEach((row) => { // 무승부 검사
                row.forEach((cell) => {
                    if (!cell) {
                        all = false;
                    }
                });
            });

            if (all) {
                dispatch({ type: SET_WINNER, winner: null });
                dispatch({ type: RESET_GAME });
            } else {
                dispatch({ type: CHANGE_TURN });
            }
        }
    }, [recentCell]);

    return (
        <>
            <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch} />
            {winner && <div>{winner}님의 승리</div>}
        </>
    );
};

export default TicTacToe;