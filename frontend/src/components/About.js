import React from 'react';

const currentYear = new Date().getFullYear();

function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Tentang Aplikasi</h1>
      <p>
        Aplikasi inventory ini dibuat untuk mempermudah pengelolaan barang masuk dan barang keluar,
        memberikan kemudahan dalam melacak stok barang, serta memastikan kelancaran operasional
        perdagangan. Dengan aplikasi ini, pengguna dapat memantau transaksi secara real-time,
        memastikan akurasi data, dan meningkatkan efisiensi pengelolaan inventory.
      </p>
      <footer>
      <p className='mt-5'>&copy; Copyright {currentYear}. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default About;
