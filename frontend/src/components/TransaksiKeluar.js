import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import {AiOutlineSearch} from 'react-icons/ai';
import { apiurl } from './api/config';

const TransaksiKeluar = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const axiosJWT = axios.create();

    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.get(`${apiurl}/token`);
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            console.error('Error refreshing token:', error);
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    useEffect(() => {
        if (token) {
            axiosJWT.interceptors.request.use(async (config) => {
                const currentDate = new Date();
                if (expire * 1000 < currentDate.getTime()) {
                    try {
                        const response = await axios.get(`${apiurl}/token`);
                        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
                        setToken(response.data.accessToken);
                        const decoded = jwtDecode(response.data.accessToken);
                        setName(decoded.name);
                        setExpire(decoded.exp);
                    } catch (error) {
                        console.error('Error refreshing token in interceptor:', error);
                        navigate('/');
                    }
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            }, (error) => {
                return Promise.reject(error);
            });

            getTransaksi();
        }
    }, [token, expire, axiosJWT, navigate]);

    const getTransaksi = useCallback(async (retryCount = 3) => {
        try {
            const response = await axiosJWT.get(`${apiurl}/transaksi-keluar`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransaksi(response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching transactions:', error);
            if (retryCount > 0) {
                console.log(`Retrying... Attempts left: ${retryCount}`);
                setTimeout(() => getTransaksi(retryCount - 1), 3000); // Retry after 3 seconds
            } else {
                setError('Failed to fetch transactions. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }, [token, axiosJWT]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                getTransaksi();
            }
        }, 30000); // Cek setiap 30 detik

        return () => clearInterval(interval);
    }, [token, getTransaksi]);

    const filteredTransaksi = transaksi.filter(item => {
        const itemDate = new Date(item.tanggal_pickup).toLocaleDateString();
        const formattedStartDate = new Date(startDate).toLocaleDateString();
        const formattedEndDate = new Date(endDate).toLocaleDateString();
        const isInDateRange = (!startDate || !endDate || (new Date(item.tanggal_pickup) >= new Date(startDate) && new Date(item.tanggal_pickup) <= new Date(endDate))) ||
                              (startDate === endDate && itemDate === formattedStartDate);
        return (
            (item.nopol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.idtransaksivarchar.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sumber_barang.toLowerCase().includes(searchTerm.toLowerCase())) &&
            isInDateRange
        );
    })

    const sortedTransaksi = [...filteredTransaksi].sort((a, b) => {
        if (sortConfig.key) {
            const isAscending = sortConfig.direction === 'asc';
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return isAscending ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return isAscending ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedTransaksi.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Data Barang Keluar</h1>
            <div className="flex flex-col md:flex-row items-center mb-4 gap-2">
                <input 
                    className="p-2 border rounded-lg focus:outline-none flex-grow "
                    type="text" 
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <input
                    className="p-2 border rounded-lg focus:outline-none flex-grow"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="mx-2 text-gray-600">to</span>
                <input
                    className="p-2 border rounded-lg focus:outline-none flex-grow"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('idtransaksivarchar')}
                                    >
                                        ID Transaksi {getSortIcon('idtransaksivarchar')}
                                    </th>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('tanggal_pickup')}
                                    >
                                        Tanggal Pickup {getSortIcon('tanggal_pickup')}
                                    </th>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('nopol')}
                                    >
                                        Plat Nomor {getSortIcon('nopol')}
                                    </th>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('driver')}
                                    >
                                        Driver {getSortIcon('driver')}
                                    </th>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('sumber_barang')}
                                    >
                                        Supplier {getSortIcon('sumber_barang')}
                                    </th>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('nama_barang')}
                                    >
                                        Nama Barang {getSortIcon('nama_barang')}
                                    </th>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('uom')}
                                    >
                                        Satuan {getSortIcon('uom')}
                                    </th>
                                    <th 
                                        className="p-3 border border-gray-300 cursor-pointer text-center" 
                                        onClick={() => requestSort('qty')}
                                    >
                                        Qty {getSortIcon('qty')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.idtransaksivarchar} className="hover:bg-gray-50">
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{item.idtransaksivarchar}</td>
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{new Date(item.tanggal_pickup).toLocaleDateString()}</td>
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{item.nopol}</td>
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{item.driver}</td>
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{item.sumber_barang}</td>
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{item.nama_barang}</td>
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{item.uom}</td>
                                            <td className="p-3 border border-gray-300 truncate max-w-[150px]">{item.qty}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-3 text-center">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-sm">
                            Page {currentPage} of {Math.ceil(filteredTransaksi.length / itemsPerPage)}
                        </div>
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.ceil(filteredTransaksi.length / itemsPerPage) }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default TransaksiKeluar;
