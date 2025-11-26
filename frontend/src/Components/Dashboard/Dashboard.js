import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';

function Dashboard() {
    const { totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [getIncomes, getExpenses])

    return (
        <DashboardStyled>
            <InnerLayout>

            <div className="top-row">
                <h1>All Transactions</h1>
            </div>

            <div className="stats-con">

                <div className="chart-con">
                    <Chart />

                        <div className="amount-con">

                            <div className="row-two">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p style={{ color: 'green' }}>₹{totalIncome()}</p>
                            </div>

                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p style={{ color: 'red' }}>₹{totalExpenses()}</p>
                            </div>
                        </div>

                        <div className="balance">
                            <h2>Total Balance</h2>
                            <p style={{ color: totalBalance() >= 0 ? 'green' : 'red' }}>₹{totalBalance()}</p>
                        </div>

                        </div>
                    </div>

            <div className="history-con">

                <History />

                <div className="minmax-wrapper">

                            <div className="salary-item">
                                <p><strong>Min:</strong> <span style={{ color: 'green' }}>₹{Math.min(...incomes.map(item => item.amount))}</span></p>
                                <p><strong>Income</strong></p>
                                <p><strong>Max:</strong> <span style={{ color: 'green' }}>₹{Math.max(...incomes.map(item => item.amount))}</span></p>
                            </div>

                            <div className="salary-item">
                                <p><strong>Min:</strong> <span style={{ color: 'red' }}>₹{Math.min(...expenses.map(item => item.amount))}</span></p>
                                <p><strong>Expense</strong></p>
                                <p><strong>Max:</strong> <span style={{ color: 'red' }}>₹{Math.max(...expenses.map(item => item.amount))}</span></p>
                            </div>

                        </div>

                    </div>
                </div>

            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    min-height: 80vh;
    padding-bottom: 1rem;

    .top-row {
        display: grid;
        grid-template-columns: 3fr 2fr;
        align-items: center;
        margin-bottom: 1rem;
    }

    .stats-con {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 1rem;

        .chart-con {
            height: 280px;

            .amount-con {
                margin-top: 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;

                .row-two {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .income,
                .expense {
                    flex: 1;
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0,0,0,0.06);
                    border-radius: 15px;
                    padding: 0.7rem;
                    text-align: center;

                    h2 {
                        font-size: 1.2rem;
                    }
                    p {
                        font-size: 2rem;
                        font-weight: 700;
                    }
                }

                .balance {
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0,0,0,0.06);
                    border-radius: 15px;
                    padding: 0.8rem;
                    width: 60%;
                    text-align: center;

                    p {
                        color: var(--color-green);
                        font-size: 2.4rem;
                        font-weight: 700;
                    }
                }
            }
        }

    .history-con {

        display: flex;
        flex-direction: column;

        .minmax-wrapper {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }

        .salary-item {
            display: flex;
            justify-content: space-between;
            padding: 0.8rem;
            background: #FCF6F9;
            border: 2px solid #FFF;
            border-radius: 15px;

            p {
                font-size: 1.3rem;
            }
        }
    }
    }
`;

export default Dashboard;
