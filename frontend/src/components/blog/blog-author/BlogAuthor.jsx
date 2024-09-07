import React, { useContext, useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { LoginContext } from "../../login/LoginContextProvider";
import { getAuthor } from "../../../data/AuthorCRUDs";

import "./styles.css";

const BlogAuthor = (authorId) => {
  const {token} = useContext(LoginContext)
  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState('')

  // funzione per recuperare i dati dell'autore
  const fetchAuthor = async (authorId, token) => {
    const data = await getAuthor(authorId.authorId, token)
    if(data){
      setAvatar(data.avatar)
      setName(data.name)
    }
  }

  useEffect(() => {fetchAuthor(authorId,token)},[])
  
  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <Image className="blog-author" src={avatar} roundedCircle />
      </Col>
      <Col>
        <div>di</div>
        <h6 id="authorName">{name}</h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;
