import React from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import del contesto dell'utente loggato
import { LoginContextProvider } from "./components/login/LoginContextProvider";

function App() {
  return (
    <LoginContextProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/new" element={<NewBlogPost />} />
        </Routes>
        <Footer />
      </Router>
    </LoginContextProvider>
  );
}

export default App;
