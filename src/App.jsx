import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import EventDetails from "./pages/EventDetails";
import FilterResults from "./pages/FilterResults";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover/:filterSlug" element={<FilterResults />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
      </Router>
  );
}

export default App;
