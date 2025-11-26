import React from 'react'
import {Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'

import {Line} from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

function Chart() {
    const {incomes, expenses} = useGlobalContext()

    // Aggregate data by date
    const dateMap = new Map();

    incomes.forEach(income => {
        const date = dateFormat(income.date);
        if (!dateMap.has(date)) {
            dateMap.set(date, { income: 0, expense: 0 });
        }
        dateMap.get(date).income += income.amount;
    });

    expenses.forEach(expense => {
        const date = dateFormat(expense.date);
        if (!dateMap.has(date)) {
            dateMap.set(date, { income: 0, expense: 0 });
        }
        dateMap.get(date).expense += expense.amount;
    });

    // Sort dates
    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(a) - new Date(b));

    const data = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Income',
                data: sortedDates.map(date => dateMap.get(date).income),
                backgroundColor: 'green',
                tension: .2
            },
            {
                label: 'Expenses',
                data: sortedDates.map(date => dateMap.get(date).expense),
                backgroundColor: 'red',
                tension: .2
            }
        ]
    }


    return (
        <ChartStyled >
            <Line data={data} />
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

export default Chart