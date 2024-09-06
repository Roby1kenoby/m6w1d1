import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";
import {LoginContext} from "../../components/login/LoginContextProvider"
import Login from "../../components/login/Login";

const Home = props => {
  const {token} = useContext(LoginContext)
  
  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
      {/* Nascondere bloglist e mostrare pulsanti login\registrazione se non auth */}
      {token && <BlogList />}
      {!token && <Login />}
    </Container>
  );
};

export default Home;
