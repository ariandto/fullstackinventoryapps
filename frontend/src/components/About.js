import React from 'react';

const currentYear = new Date().getFullYear();

function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">About PT. CMM</h1>
      <p>
        Aplikasi inventory ini dibuat untuk mempermudah pengelolaan barang masuk dan barang keluar,
        memberikan kemudahan dalam melacak stok barang, serta memastikan kelancaran operasional
        perdagangan. Dengan aplikasi ini, pengguna dapat memantau transaksi secara real-time,
        memastikan akurasi data, dan meningkatkan efisiensi pengelolaan inventory.
      </p>
      <footer>
      <p className='mt-5'>&copy; Copyright Budi Ariyanto WA 0895340710827{currentYear}. All rights reserved.</p>
    </footer>
    </div>
  );
}

export default About;
