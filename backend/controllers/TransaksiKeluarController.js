const TransaksiKeluar = require('../models/TransaksiKeluar.js');
const moment = require('moment'); // Menggunakan moment.js untuk format tanggal
const { Op } = require('sequelize'); // Import Op from Sequelize

// Mengambil semua transaksi keluar
const getAllTransaksiKeluar = async (req, res) => {
  try {
    const transaksi = await TransaksiKeluar.findAll();
    res.status(200).json(transaksi);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Menghasilkan ID transaksi keluar baru
const generateNewTransaksiIdKeluar = async () => {
  try {
    const today = moment().format('DDMMYY');
    const prefix = `CMMOUT${today}`;

    const lastTransaksi = await TransaksiKeluar.findOne({
      where: {
        idtransaksivarchar: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['idtransaksivarchar', 'DESC']]
    });

    if (!lastTransaksi) {
      return `${prefix}0000`; // Default ID jika tidak ada data sebelumnya
    }

    const lastId = lastTransaksi.idtransaksivarchar;
    const lastNumber = parseInt(lastId.slice(-4));
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');

    return prefix + newNumber;
  } catch (error) {
    console.error("Error generating new transaction ID:", error);
    throw new Error("Error generating new transaction ID");
  }
};

// Membuat transaksi keluar baru
const createTransaksiKeluar = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Validasi dasar
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const idtransaksivarchar = await generateNewTransaksiIdKeluar();

    const newTransaksi = await TransaksiKeluar.create({
      idtransaksivarchar,
      tanggal_pickup,
      nopol,
      driver,
      sumber_barang,
      nama_barang,
      uom,
      qty
    });

    res.status(201).json({ message: 'Transaksi Keluar Created', transaksi: newTransaksi });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mengambil ID transaksi keluar terbaru
const getLatestTransaksiIdKeluar = async (req, res) => {
  try {
    const newId = await generateNewTransaksiIdKeluar();
    res.status(200).json({ idtransaksivarchar: newId });
  } catch (error) {
    console.error("Error fetching latest transaction ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mengambil transaksi keluar berdasarkan ID
const getTransaksiKeluarById = async (req, res) => {
  try {
    const transaksi = await TransaksiKeluar.findOne({
      where: { idtransaksivarchar: req.params.id }
    });
    if (transaksi) {
      res.status(200).json(transaksi);
    } else {
      res.status(404).json({ message: 'Transaksi Keluar not found' });
    }
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Memperbarui transaksi keluar berdasarkan ID
const updateTransaksiKeluar = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Validasi dasar
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [updated] = await TransaksiKeluar.update({
      tanggal_pickup,
      nopol,
      driver,
      sumber_barang,
      nama_barang,
      uom,
      qty
    }, {
      where: { idtransaksivarchar: req.params.id }
    });

    if (updated) {
      const updatedTransaksi = await TransaksiKeluar.findOne({ where: { idtransaksivarchar: req.params.id } });
      res.status(200).json(updatedTransaksi);
    } else {
      res.status(404).json({ message: 'Transaksi Keluar not found' });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Menghapus transaksi keluar berdasarkan ID
const deleteTransaksiKeluar = async (req, res) => {
  try {
    const deleted = await TransaksiKeluar.destroy({
      where: { idtransaksivarchar: req.params.id }
    });

    if (deleted) {
      res.status(200).json({ message: 'Transaksi Keluar deleted' });
    } else {
      res.status(404).json({ message: 'Transaksi Keluar not found' });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllTransaksiKeluar,
  createTransaksiKeluar,
  getLatestTransaksiIdKeluar,
  getTransaksiKeluarById,
  updateTransaksiKeluar,
  deleteTransaksiKeluar,
};
