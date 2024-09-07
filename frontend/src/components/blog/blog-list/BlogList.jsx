import React, { useContext, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import posts from "../../../data/posts.json";
import BlogItem from "../blog-item/BlogItem";
import { LoginContext } from "../../login/LoginContextProvider";
import './BlogList.css'

// inserire serach bar nella bloglist, e gestire uno stato searchString che cambia 
// ad ogni digit dell'utente e fa partire la fetch (usando l'hook useEffect)
// magari mettere un timer per far partire la fetch in modo da dare tempo all'utente di digitare
// qualche carattere

const BlogList = props => {
  // stato per la lista dei post
  const [postsList, setPostsList] = useState([])
  const [searchString, setSearchString] = useState('')
  const {token} = useContext(LoginContext)

  // funzione fetch per recuperare i post dal backend + evenutale ricerca da searchbar
  const getPosts = async (ss) => {
    const urlBase = 'http://localhost:3001/blogPosts'
    // se c'è la searchString allora la aggiungo all'url
    const urlSearch = ss && `?title=${ss}`
    const requestUrl =  urlBase + urlSearch

    const request = await fetch(requestUrl,{
      headers:{
        Authorization: 'Bearer ' + token
      }
    })

    const data = await request.json()
    setPostsList(data.postsList)
  }

  useEffect(() => {getPosts(searchString)}, [searchString])



  return (
    <>
      <Form className="searchForm">
        <Form.Control type="text"
          name="search"
          placeholder="Search for posts!" 
          value={searchString} 
          onChange={(e) => setSearchString(e.target.value)}
          required
        />
      </Form>
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
    </>
  );
};

export default BlogList;
