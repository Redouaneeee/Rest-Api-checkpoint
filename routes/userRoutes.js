const express = require('express');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createUser);

router.use(protect);
router.get('/', getAllUsers);

router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;