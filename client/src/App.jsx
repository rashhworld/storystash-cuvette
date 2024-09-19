import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Homepage from "./pages/Homepage";
import "./App.css";

import "react-responsive-modal/styles.css";

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" closeButton={false} />
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
