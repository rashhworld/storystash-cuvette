import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-modal/styles.css";

import Homepage from "./pages/Homepage";
import Bookmark from "./pages/Bookmark";

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" closeButton={false} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/bookmark" element={<Bookmark />} />
      </Routes>
    </Router>
  );
}

export default App;
