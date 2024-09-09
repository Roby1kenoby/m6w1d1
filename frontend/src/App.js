import React, { useContext } from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import del contesto dell'utente loggato
import {LoginContext} from "./components/login/LoginContextProvider";
import NotFound from "./views/404/NotFound";

function App() {
  const {token} = useContext(LoginContext)
  
  return (
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          {token && <Route path="/blog/:id" element={<Blog />} />}
          {token &&<Route path="/new" element={<NewBlogPost />} />}
          <Route path="*" element={<NotFound/>} />
        </Routes>
        <Footer />
      </Router>
  );
}

export default App;
