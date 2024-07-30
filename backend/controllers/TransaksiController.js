const Transaksi = require('../models/Transaksi.js');
const moment = require('moment'); // Menggunakan moment.js untuk format tanggal
const { Op } = require('sequelize'); // Import Op from Sequelize

const getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll();
    res.status(200).json(transaksi);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const generateNewTransaksiId = async () => {
  try {
    const today = moment().format('DDMMYY');
    const prefix = `CMMIN${today}`;

    const lastTransaksi = await Transaksi.findOne({
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

const createTransaksi = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Basic validation
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const idtransaksivarchar = await generateNewTransaksiId();

    // Create transaction with auto-increment for idtransaksi
    const newTransaksi = await Transaksi.create({
      idtransaksivarchar,
      tanggal_pickup,
      nopol,
      driver,
      sumber_barang,
      nama_barang,
      uom,
      qty
    });

    res.status(201).json({ message: 'Transaksi Created', transaksi: newTransaksi });
  } catch (error) {
    console.error("Error creating transaction:", error.message, error.stack);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getLatestTransaksiId = async (req, res) => {
  try {
    const newId = await generateNewTransaksiId();
    res.status(200).json({ idtransaksivarchar: newId });
  } catch (error) {
    console.error("Error fetching latest transaction ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findOne({
      where: { idtransaksivarchar: req.params.id }
    });
    if (transaksi) {
      res.status(200).json(transaksi);
    } else {
      res.status(404).json({ message: 'Transaksi not found' });
    }
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTransaksi = async (req, res) => {
  const { tanggal_pickup, nopol, driver, sumber_barang, nama_barang, uom, qty } = req.body;

  // Basic validation
  if (!tanggal_pickup || !nopol || !driver || !sumber_barang || !nama_barang || !uom || !qty) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [updated] = await Transaksi.update({
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
      const updatedTransaksi = await Transaksi.findOne({ where: { idtransaksivarchar: req.params.id } });
      res.status(200).json(updatedTransaksi);
    } else {
      res.status(404).json({ message: 'Transaksi not found' });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTransaksi = async (req, res) => {
  try {
    const deleted = await Transaksi.destroy({
      where: { idtransaksivarchar: req.params.id }
    });

    if (deleted) {
      res.status(200).json({ message: 'Transaksi deleted' });
    } else {
      res.status(404).json({ message: 'Transaksi not found' });
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllTransaksi,
  createTransaksi,
  getLatestTransaksiId,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi,
};
