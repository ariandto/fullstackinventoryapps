const express = require('express');
const { getUsers, register, login, logout } = require('../controllers/Users.js');
const { verifyToken } = require('../middleware/VerifyToken.js');
const { authorizeRole } = require('../middleware/authorizeRole.js');
const { refreshToken } = require('../controllers/RefreshToken.js');
const { getAllTransaksi, createTransaksi, getLatestTransaksiId, getTransaksiById, updateTransaksi, deleteTransaksi } = require('../controllers/TransaksiController.js');
const { getAllTransaksiKeluar, createTransaksiKeluar, getLatestTransaksiIdKeluar, getTransaksiKeluarById, updateTransaksiKeluar, deleteTransaksiKeluar } = require('../controllers/TransaksiKeluarController.js');

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', register);
router.post('/login', login);
router.get('/token', refreshToken);
router.delete('/logout', logout);

// Rute untuk transaksi masuk
router.get('/transaksi', verifyToken, getAllTransaksi);
router.post('/transaksi', verifyToken, authorizeRole('Admin', 'Manager'), createTransaksi); // Hanya Admin dan Manager yang dapat membuat transaksi
router.get('/transaksi/latest-id', verifyToken, authorizeRole('Admin', 'Manager'), getLatestTransaksiId); // Hanya Admin dan Manager yang dapat mendapatkan ID transaksi terbaru
router.get('/transaksi/:id', verifyToken, getTransaksiById); // Semua pengguna dapat melihat transaksi berdasarkan ID
router.put('/transaksi/:id', verifyToken, authorizeRole('Admin', 'Manager'), updateTransaksi); // Hanya Admin dan Manager yang dapat memperbarui transaksi
router.delete('/transaksi/:id', verifyToken, authorizeRole('Admin', 'Manager'), deleteTransaksi); // Hanya Admin dan Manager yang dapat menghapus transaksi

// Rute untuk transaksi keluar
router.get('/transaksi-keluar', verifyToken, getAllTransaksiKeluar);
router.post('/transaksi-keluar', verifyToken, authorizeRole('Admin', 'Manager'), createTransaksiKeluar); // Hanya Admin dan Manager yang dapat membuat transaksi keluar
router.get('/transaksi-keluar/latest-id', verifyToken, authorizeRole('Admin', 'Manager'), getLatestTransaksiIdKeluar); // Hanya Admin dan Manager yang dapat mendapatkan ID transaksi keluar terbaru
router.get('/transaksi-keluar/:id', verifyToken, getTransaksiKeluarById); // Semua pengguna dapat melihat transaksi keluar berdasarkan ID
router.put('/transaksi-keluar/:id', verifyToken, authorizeRole('Admin', 'Manager'), updateTransaksiKeluar); // Hanya Admin dan Manager yang dapat memperbarui transaksi keluar
router.delete('/transaksi-keluar/:id', verifyToken, authorizeRole('Admin', 'Manager'), deleteTransaksiKeluar); // Hanya Admin dan Manager yang dapat menghapus transaksi keluar

router.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = router;
