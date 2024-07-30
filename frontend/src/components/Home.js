import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import { FaWarehouse, FaTruck, FaArrowDown, FaArrowUp } from 'react-icons/fa'; // Importing icons
import './Home.css'; // Import custom CSS for 3D effects

const Home = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [expire, setExpire] = useState('');
  const [transaksiMasuk, setTransaksiMasuk] = useState([]);
  const [transaksiKeluar, setTransaksiKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      const newToken = response.data.accessToken;
      setToken(newToken);
      const decoded = jwtDecode(newToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      //localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate('/');
    }
  }, [navigate]);

  const getTransaksiMasuk = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/transaksi`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransaksiMasuk(response.data);
    } catch (error) {
      console.error('Error fetching incoming transactions:', error);
      setError('Failed to fetch incoming transactions.');
    }
  }, [token]);

  const getTransaksiKeluar = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/transaksi-keluar`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransaksiKeluar(response.data);
    } catch (error) {
      console.error('Error fetching outgoing transactions:', error);
      setError('Failed to fetch outgoing transactions.');
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshToken();
        if (token) {
          await Promise.all([getTransaksiMasuk(), getTransaksiKeluar()]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshToken, token, getTransaksiMasuk, getTransaksiKeluar]);

  useEffect(() => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      refreshToken();
    }
  }, [expire, refreshToken]);

  // Count unique sources and total quantity
  const countUniqueSourcesMasuk = new Set(transaksiMasuk.map(item => item.sumber_barang)).size;
  const countUniqueSourcesKeluar = new Set(transaksiKeluar.map(item => item.sumber_barang)).size;

  const totalQtyMasuk = transaksiMasuk.reduce((acc, item) => acc + item.qty, 0);
  const totalQtyKeluar = transaksiKeluar.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Inventory</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="summary-card bg-blue-500 text-white p-6 rounded-lg shadow-lg">
              <FaWarehouse className="icon" />
              <h2 className="text-lg font-semibold">Barang Masuk</h2>
              <p className="text-2xl font-bold mt-2">{countUniqueSourcesMasuk}</p>
              <p className="mt-2">Total Qty: {totalQtyMasuk}</p>
            </div>
            <div className="summary-card bg-green-500 text-white p-6 rounded-lg shadow-lg">
              <FaTruck className="icon" />
              <h2 className="text-lg font-semibold">Barang Keluar</h2>
              <p className="text-2xl font-bold mt-2">{countUniqueSourcesKeluar}</p>
              <p className="mt-2">Total Qty: {totalQtyKeluar}</p>
            </div>
            <div className="summary-card bg-red-500 text-white p-6 rounded-lg shadow-lg">
              <FaArrowDown className="icon" />
              <h2 className="text-lg font-semibold">Transaksi Masuk</h2>
              <p className="text-2xl font-bold mt-2">{transaksiMasuk.length}</p>
              <p className="mt-2">Total Qty: {totalQtyMasuk}</p>
            </div>
            <div className="summary-card bg-purple-500 text-white p-6 rounded-lg shadow-lg">
              <FaArrowUp className="icon" />
              <h2 className="text-lg font-semibold">Transaksi Keluar</h2>
              <p className="text-2xl font-bold mt-2">{transaksiKeluar.length}</p>
              <p className="mt-2">Total Qty: {totalQtyKeluar}</p>
            </div>
          </div>

          {/* Comparison Boxes */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Qty Masuk vs Qty Keluar</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="comparison-card flex-1 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
                <FaArrowDown className="icon" />
                <h3 className="text-lg font-semibold">Total Qty Masuk</h3>
                <div className="mt-4 bg-blue-700 h-24 flex items-center justify-center text-2xl font-bold">
                  {totalQtyMasuk}
                </div>
              </div>
              <div className="comparison-card flex-1 bg-red-500 text-white p-4 rounded-lg shadow-lg">
                <FaArrowUp className="icon" />
                <h3 className="text-lg font-semibold">Total Qty Keluar</h3>
                <div className="mt-4 bg-red-700 h-24 flex items-center justify-center text-2xl font-bold">
                  {totalQtyKeluar}
                </div>
              </div>
            </div>
          </div>
          
        </>
      )}
    </div>
  );
};

export default Home;
