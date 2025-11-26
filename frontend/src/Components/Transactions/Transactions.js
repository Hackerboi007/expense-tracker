import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { InnerLayout } from '../../styles/Layouts'
import { dateFormat } from '../../utils/dateFormat'
import { bitcoin, book, card, circle, clothing, food, freelance, medical, money, stocks, takeaway, tv, users, yt } from '../../utils/Icons'

function Transactions() {
    const { incomes, expenses } = useGlobalContext()

    const transactions = [...incomes, ...expenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const categoryIcon = (category, type) => {
        switch(category) {
            case 'salary':
                return money;
            case 'freelancing':
                return freelance
            case 'investments':
                return stocks;
            case 'stocks':
                return users;
            case 'bitcoin':
                return bitcoin;
            case 'bank':
                return card;
            case 'youtube':
                return yt;
            case 'education':
                return book;
            case 'groceries':
                return food;
            case 'health':
                return medical;
            case 'subscriptions':
                return tv;
            case 'takeaways':
                return takeaway;
            case 'clothing':
                return clothing;
            case 'travelling':
                return freelance;
            case 'other':
                return circle;
            default:
                return ''
        }
    }

    return (
        <TransactionsStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="transactions-list">
                    {transactions.length === 0 && <p>No transactions found.</p>}
                    {transactions.map((tx) => (
                        <div key={tx._id} className={`transaction-item ${tx.type}`}>
                            <div className="icon">{categoryIcon(tx.category, tx.type)}</div>
                            <div className="content">
                                <h4>{tx.title}</h4>
                                <p>{dateFormat(tx.createdAt)}</p>
                            </div>
                            <div className="amount">₹{tx.amount}</div>
                        </div>
                    ))}
                </div>
            </InnerLayout>
        </TransactionsStyled>
    )
}

const TransactionsStyled = styled.div`
    min-height: 80vh;
    padding-bottom: 1rem;

    h1 {
        margin-bottom: 1rem;
        font-weight: 700;
        color: var(--color-primary, #222260);
    }

    .transactions-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .transaction-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 10px;
            padding: 1rem 1.5rem;
            color: #222260;

            &.income {
                border-left: 8px solid var(--color-green, #4caf50);
            }
            &.expense {
                border-left: 8px solid var(--color-red, #f44336);
            }
            
            .icon {
                font-size: 1.5rem;
                margin-right: 1rem;
                display: flex;
                align-items: center;
            }

            .content {
                flex: 1;
                h4 {
                    margin: 0 0 0.3rem 0;
                }
                p {
                    margin: 0;
                    color: rgba(34, 34, 96, 0.6);
                    font-size: 0.9rem;
                }
            }

            .amount {
                font-weight: 700;
                font-size: 1.2rem;
            }
        }
    }
`;

export default Transactions
