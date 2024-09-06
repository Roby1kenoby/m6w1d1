import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import posts from "../../../data/posts.json";
import BlogItem from "../blog-item/BlogItem";
import { LoginContext } from "../../login/LoginContextProvider";

const BlogList = props => {
  // stato per la lista dei post
  const [postsList, setPostsList] = useState([])

  const {token} = useContext(LoginContext)

  // funzione fetch per recuperare i post dal backend
  const getPosts = async () => {
    const request = await fetch('http://localhost:3001/blogPosts',{
      headers:{
        Authorization: 'Bearer ' + token
      }
    })

    const data = await request.json()
    setPostsList(data.postsList)
  }

  useEffect(() =>{getPosts()}, [])

  return (
    <Row>
      {postsList.map((post, i) => (
        <Col
          key={`item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={post.title} {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
