# Task: Make user transactions private and user-specific

## Backend

- [ ] Add 'userId' field (ObjectId, ref 'User', required) to ExpenseModel.js
- [ ] Update addExpense controller:
      - Set 'userId' from req.user to expense document
- [ ] Update getExpense controller:
      - Filter expenses to return only those with 'userId' = req.user
- [ ] Update deleteExpense controller:
      - Verify expense belongs to req.user before deleting
- [ ] Fix income controller (income.js):
      - Use req.user instead of req.userId in addIncome and getIncomes
      - Verify ownership before deleteIncome
- [ ] Test all backend changes

## Frontend

- [ ] Verify that globalContext.js sends Authorization token (already implemented)
- [ ] Verify that Dashboard and transaction components fetch and show current user's data only (already implemented)
- [ ] Test user-specific data fetching and displaying on different user logins

## Testing and Verification

- [ ] Register / login with multiple users
- [ ] Verify each user sees only their own transactions
- [ ] Verify users can add/edit/delete only their own data
- [ ] Verify no cross-user data leakage in dashboard and history
