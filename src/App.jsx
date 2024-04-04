import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Error from "./components/Error";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Appointment from "./components/Appointment";
import Contact from "./components/Contact";
import Tracker from "./components/Tracker";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Account from "./components/Account";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Pblogs from "./components/Dashboard/Pblogs";
import { Appointments } from "./components/Dashboard/Appointments";
import Hospital from "./components/Dashboard/Hospital";
import Settings from "./components/Dashboard/Settings";
import AddBlogs from "./components/Dashboard/Addblogs";
import { Profile } from "./components/Dashboard/Profile";
import Chatbot from "./components/Dashboard/chatbot";
import Blogs from "./components/Blogs";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // While loading, return a loading indicator or null
  if (loading) {
    return null; // Or return a loading spinner or any other UI element
  }

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route
            path="/login"
            element={
              !user ? <Login setUser={setUser} /> : <Navigate to="/account" />
            }
          />
          <Route
            path="/signup"
            element={
              !user ? <SignUp setUser={setUser} /> : <Navigate to="/account" />
            }
          />
          <Route
            path="/account"
            element={user ? <Account /> : <Navigate to="/login" />}
          />
          <Route
            path="/pblogs"
            element={user ? <Pblogs /> : <Navigate to="*" />}
          />
          <Route
            path="/pblogs/addblogs"
            element={user ? <AddBlogs /> : <Navigate to="*" />}
          />
          <Route
            path="/appointments"
            element={user ? <Appointments /> : <Navigate to="*" />}
          />
          <Route
            path="/hospital"
            element={user ? <Hospital /> : <Navigate to="*" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="*" />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="*" />}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
      <Footer />
      <Chatbot />
    </>
  );
}

export default App;
