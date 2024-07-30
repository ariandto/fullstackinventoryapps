import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';

function FormTransaksiKeluar() {
  const [formData, setFormData] = useState({
    idtransaksikeluar: '',
    idtransaksivarchar: '',
    nopol: '',
    driver: '',
    sumber_barang: '',
    nama_barang: '',
    uom: 'Kg',
    qty: ''
  });
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  // Fetch a new ID for transaksi
  const fetchNewId = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/transaksi-keluar/latest-id`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData((prevData) => ({
        ...prevData,
        idtransaksikeluar: response.data.idtransaksikeluar,
        idtransaksivarchar: response.data.idtransaksivarchar
      }));
    } catch (error) {
      console.error('Error fetching new transaction ID:', error.response ? error.response.data : error.message);
      alert('Failed to fetch new transaction ID: ' + (error.response ? error.response.data.message : error.message));
    }
  }, [token]);

  // Submit the transaction form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const currentTimestamp = new Date().toISOString();
    
    const { idtransaksikeluar, ...restData } = formData; // Exclude idtransaksi if not needed
  
    const dataToSend = {
      ...restData,
      tanggal_pickup: currentTimestamp
    };
    
    try {
      const response = await axios.post(`${apiurl}/transaksi-keluar`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message || 'Transaction created successfully');
      setFormData({
        idtransaksikeluar: '',
        idtransaksivarchar: '',
        nopol: '',
        driver: '',
        sumber_barang: '',
        nama_barang: '',
        uom: '',
        qty: ''
      });
      fetchNewId(); // Fetch a new ID after successful submission
    } catch (error) {
      console.error('Error creating transaction:', error.response ? error.response.data : error.message);
      alert(`Failed to create transaction: ${error.response ? error.response.data.message : error.message}`);
    }
  };
  
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove spaces from the input value if the field is 'nopol'
    const sanitizedValue = name === 'nopol' ? value.replace(/\s+/g, '') : value;

    setFormData({
        ...formData,
        [name]: sanitizedValue,
    });
};
  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/token`);
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.error('Error refreshing token:', error);
      navigate("/"); // Redirect if token refresh fails
    }
  }, [navigate]);

  // Token expiration handling
  useEffect(() => {
    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        try {
          const response = await axios.get(`${apiurl}/token`);
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwtDecode(response.data.accessToken);
          setExpire(decoded.exp);
        } catch (error) {
          console.error('Error refreshing token in interceptor:', error);
          navigate("/"); // Redirect if token refresh fails
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    // Refresh token and fetch new ID on component mount
    const initialize = async () => {
      await refreshToken();
      if (token) {
        fetchNewId();
      }
    };
    initialize();
  }, [expire, token, navigate, refreshToken, fetchNewId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Transaksi Barang Keluar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-lg">ID Transaksi</label>
          <input
            className="p-2 border rounded"
            type="text"
            name="idtransaksivarchar"
            value={formData.idtransaksivarchar}
            onChange={handleChange}
            placeholder="ID Transaksi akan otomatis terisi"
            readOnly
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg">Plat Nomor</label>
          <input
            className="p-2 border rounded"
            type="text"
            name="nopol"
            value={formData.nopol}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-lg">Driver</label>
          <input
            className="p-2 border rounded"
            type="text"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg">Supplier</label>
          <input
            className="p-2 border rounded"
            type="text"
            name="sumber_barang"
            value={formData.sumber_barang}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-lg">Nama Barang</label>
          <input
            className="p-2 border rounded"
            type="text"
            name="nama_barang"
            value={formData.nama_barang}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="flex flex-col">
            <label className="text-lg">Satuan</label>
            <input
            className="p-2 border rounded"
            type="text"
            name="uom"
            value={formData.uom}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-lg">Qty</label>
          <input
            className="p-2 border rounded"
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default FormTransaksiKeluar;
