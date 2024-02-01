import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DashBoard";
import Projects from "./pages/Projects";
import Header from "./components/Header";

import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
function App() {
  return (
    <>
      <Router>
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* Private Route */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashBoard />} />
          </Route>
          {/* route for only admins */}
          <Route element={<AdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
