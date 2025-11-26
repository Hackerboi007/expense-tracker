const router = require('express').Router();
const { listUsers, updateUser, deleteUser, getUserTransactions } = require('../controllers/admin');
const { isAdmin } = require('../middleware/auth');

router.get('/admin/users', isAdmin, listUsers);
router.put('/admin/users/:id', isAdmin, updateUser);
router.delete('/admin/users/:id', isAdmin, deleteUser);
router.get('/admin/users/:id/transactions', isAdmin, getUserTransactions);

module.exports = router;
