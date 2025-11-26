import React, { useEffect, useState } from "react";
import axios from "axios";
import { dateFormat } from '../../utils/dateFormat';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState(null);
  const [txData, setTxData] = useState({ incomes: [], expenses: [], totals: { incomeTotal: 0, expenseTotal: 0, balance: 0 } });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/v1/admin/users");
      // handle different response shapes defensively
      const data = res.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (data && data.length === 0) {
        setUsers([]);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading users:", err);
      const msg = err?.response?.data?.message || err.message || 'Failed to load users';
      setError(msg);
    }
    setLoading(false);
  };

  // Make Admin
  const makeAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/admin/users/${id}`, { role: 'admin' });
      fetchUsers();
    } catch (err) {
      console.error('Error making admin', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update role');
    }
  };

  // Revoke Admin Role
  const revokeAdmin = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/admin/users/${id}`, { role: 'user' });
      fetchUsers();
    } catch (err) {
      console.error('Error revoking admin', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update role');
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/admin/users/${id}`);
      if (selected?._id === id) setSelected(null);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
      setError(err?.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // when a user is selected, fetch their transactions and totals
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selected) return;
      setTxLoading(true);
      setTxError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/admin/users/${selected._id}/transactions`);
        const data = res.data || {};
        const incomes = Array.isArray(data.incomes) ? data.incomes : [];
        const expenses = Array.isArray(data.expenses) ? data.expenses : [];
        const totals = data.totals || { incomeTotal: 0, expenseTotal: 0, balance: 0 };
        setTxData({ incomes, expenses, totals });
      } catch (err) {
        console.error('Error loading transactions', err);
        setTxError(err?.response?.data?.message || err.message || 'Failed to load transactions');
        setTxData({ incomes: [], expenses: [], totals: { incomeTotal: 0, expenseTotal: 0, balance: 0 } });
      }
      setTxLoading(false);
    }

    fetchTransactions();
  }, [selected]);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Users</h2>

      <div style={styles.layout}>
        {/* LEFT PANEL — USERS TABLE */}
        <div style={styles.leftPanel}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    style={{
                      ...styles.tr,
                      background:
                        selected?._id === u._id ? "rgba(180,170,255,0.15)" : "",
                    }}
                    onClick={() => setSelected(u)}
                  >
                    <td style={styles.td}>{u.username}</td>
                    <td style={styles.td}>{u.role}</td>

                    <td style={styles.actionsCell}>
                        <button
                          style={styles.viewBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(u);
                          }}
                        >
                          View
                        </button>
                        {u.role === "admin" ? (
                          <button
                            style={styles.revokeBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              revokeAdmin(u._id);
                            }}
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            style={styles.makeBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              makeAdmin(u._id);
                            }}
                          >
                            Make Admin
                          </button>
                        )}

                        <button
                          style={styles.deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteUser(u._id);
                          }}
                        >
                          Delete
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL — USER DETAILS */}
        <div style={styles.rightPanel}>
          {error ? (
            <div style={styles.errorBox}>
              <p style={{margin:0}}>{error}</p>
              <button style={styles.retryBtn} onClick={fetchUsers}>Retry</button>
            </div>
          ) : loading ? (
            <p style={styles.noSelect}>Loading users...</p>
          ) : selected ? (
            <>
              <h3 style={styles.detailsTitle}>User Details</h3>

              <div style={styles.detailsBox}>
                <p style={styles.detailLabel}>Username:</p>
                <p style={styles.detailValue}>{selected.username}</p>

                <p style={styles.detailLabel}>Role:</p>
                <p style={styles.detailValue}>{selected.role}</p>

                <p style={styles.detailLabel}>User ID:</p>
                <p style={styles.detailValue}>{selected._id}</p>
              </div>
              {/* Totals */}
              <div style={styles.totalsRow}>
                <div style={styles.totalCard}>
                  <div style={styles.totalLabel}>Total Income</div>
                  <div style={styles.totalValue}>₹{txData.totals.incomeTotal?.toFixed(2)}</div>
                </div>
                <div style={styles.totalCard}>
                  <div style={styles.totalLabel}>Total Expense</div>
                  <div style={styles.totalValue}>₹{txData.totals.expenseTotal?.toFixed(2)}</div>
                </div>
                <div style={{...styles.totalCard, background: '#f7fff5'}}>
                  <div style={styles.totalLabel}>Balance</div>
                  <div style={styles.totalValue}>₹{txData.totals.balance?.toFixed(2)}</div>
                </div>
              </div>

              {/* Recent transactions */}
              <div style={{marginTop: 16}}>
                <h4 style={{margin: '8px 0'}}>Recent Transactions</h4>
                {txLoading ? (
                  <p style={styles.noSelect}>Loading transactions...</p>
                ) : txError ? (
                  <div style={styles.errorBox}>{txError}</div>
                ) : (
                  <div style={styles.txList}>
                    {(() => {
                      const combined = [
                        ...txData.incomes.map(i => ({...i, kind: 'income'})),
                        ...txData.expenses.map(e => ({...e, kind: 'expense'}))
                      ];
                      combined.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                      const recent = combined.slice(0,6);
                      if (recent.length === 0) return <p style={styles.noSelect}>No recent transactions</p>;
                      return recent.map(tx => (
                        <div key={tx._id} style={styles.txItem}>
                          <div>
                            <div style={styles.txTitle}>{tx.title || tx.description || tx.category}</div>
                            <div style={styles.txMeta}>{dateFormat(tx.createdAt || tx.date)}</div>
                          </div>
                          <div style={{textAlign: 'right'}}>
                            <div style={{color: tx.kind === 'income' ? '#1a8f3a' : '#c43a3a', fontWeight: 700}}>
                              {tx.kind === 'income' ? '+' : '-'}₹{(tx.amount || 0).toFixed(2)}
                            </div>
                            <div style={styles.txMeta}>{tx.kind}</div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p style={styles.noSelect}>{users.length === 0 ? 'No users found or you lack permission.' : 'Select a user to view details'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

//
// ----------------- STYLES -----------------
//

const styles = {
  page: {
    minHeight: "100vh",
    padding: "25px",
    background: "linear-gradient(135deg, #f0e8ff, #e9d9ff)",
    fontFamily: "Inter, sans-serif",
  },

  heading: {
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#333",
  },

  layout: {
    display: "flex",
    gap: "20px",
    height: "80vh",
  },

  //
  // LEFT PANEL
  //
  leftPanel: {
    flex: 2,
    background: "rgba(255, 255, 255, 0.9)",
    padding: "16px",
    borderRadius: "14px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  tableWrapper: {
    height: "100%",
    overflowY: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    fontWeight: "600",
    fontSize: "15px",
    color: "#5a4fcf",
    borderBottom: "2px solid #eee",
  },

  tr: {
    borderBottom: "1px solid #eee",
  },

  td: {
    padding: "12px",
    fontSize: "14px",
    color: "#333",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  actionsCell: {
    display: "flex",
    gap: "8px",
  },

  makeBtn: {
    padding: "7px 12px",
    background: "#ebe6ff",
    border: "1px solid #c8bfff",
    color: "#4a3acb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },

  viewBtn: {
    padding: "7px 12px",
    background: "#f0f4ff",
    border: "1px solid #d7e0ff",
    color: "#2d3bb8",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },

  revokeBtn: {
    padding: "7px 12px",
    background: "#e4e0ff",
    border: "1px solid #b9afff",
    color: "#3a2aaf",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },

  deleteBtn: {
    padding: "7px 12px",
    background: "#ffe5e5",
    border: "1px solid #ffcccc",
    color: "#d44747",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },

  //
  // RIGHT PANEL
  //
  rightPanel: {
    flex: 1,
    background: "rgba(255, 255, 255, 0.92)",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },

  detailsTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#4f3ad6",
  },

  detailsBox: {
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    rowGap: "10px",
    columnGap: "10px",
  },

  detailLabel: {
    fontWeight: "600",
    color: "#555",
  },

  detailValue: {
    color: "#333",
  },

  noSelect: {
    marginTop: "30px",
    textAlign: "center",
    color: "#666",
  },
  totalsRow: {
    display: 'flex',
    gap: 10,
    marginTop: 16,
  },
  totalCard: {
    flex: 1,
    background: '#fff',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #f0f0f5'
  },
  totalLabel: {
    fontSize: 12,
    color: '#666'
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 6
  },
  txList: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxHeight: 200,
    overflowY: 'auto'
  },
  txItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    background: '#fafafa',
    borderRadius: 8,
    border: '1px solid #f0eff8'
  },
  txTitle: {
    fontSize: 14,
    fontWeight: 600
  },
  txMeta: {
    fontSize: 12,
    color: '#888'
  },
  errorBox: {
    padding: '12px',
    background: '#ffecec',
    border: '1px solid #f5c2c2',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  retryBtn: {
    marginLeft: '12px',
    padding: '6px 10px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
