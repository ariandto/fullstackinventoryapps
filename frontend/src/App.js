import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login.js";
import Navbar from "./components/Navbar.js";
import Register from "./components/Register.js";
import Home from "./components/Home.js";
import TransaksiMasuk from "./components/TransaksiMasuk.js";
import FormTransaksiMasuk from "./components/FormTransaksiMasuk.js";
import EditDeleteTransaksi from "./components/EditDeleteTransaksi.js";
import TransaksiKeluar from "./components/TransaksiKeluar.js";
import FormTransaksiKeluar from "./components/FormTransaksiKeluar.js";
import EditDeleteTransaksiKeluar from "./components/EditDeleteTransaksiKeluar.js";
import About from "./components/About.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutWithNavbar/>} />
        <Route path="/home" element={<HomeWithNavbar />} />
        <Route path="/listbarangmasuk" element={<TransaksiMasukWithNavbar />} />
        <Route path="/listbarangkeluar" element={<TransaksiKeluarWithNavbar />} />
        <Route path="/formbarangmasuk" element={<FormBarangMasukWithNavbar />} />
        <Route path="/editbarangmasuk" element={<EditBarangMasukWithNavbar />} />
        <Route path="/editbarangkeluar" element={<EditBarangKeluarWithNavbar />} />
        <Route path="/formbarangkeluar" element={<FormBarangInputKeluarWithNavbar />} />
      </Routes>
    </Router>
  );
}



function FormBarangInputKeluarWithNavbar() {
  return (
    <>
      <Navbar />
      <FormTransaksiKeluar />
    </>
  );
}


function AboutWithNavbar() {
  return (
    <>
      <Navbar />
      <About />
    </>
  );
}

function EditBarangKeluarWithNavbar() {
  return (
    <>
      <Navbar />
      <EditDeleteTransaksiKeluar />
    </>
  );
}



function EditBarangMasukWithNavbar() {
  return (
    <>
      <Navbar />
      <EditDeleteTransaksi />
    </>
  );
}

function FormBarangMasukWithNavbar() {
  return (
    <>
      <Navbar />
      <FormTransaksiMasuk />
    </>
  );
}

function TransaksiKeluarWithNavbar() {
  return (
    <>
      <Navbar />
      <TransaksiKeluar />
    </>
  );
}


function HomeWithNavbar() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}


function TransaksiMasukWithNavbar() {
  return (
    <>
      <Navbar />
      <TransaksiMasuk />
    </>
  );
}



export default App;
