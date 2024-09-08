import React, { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import { convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import {LoginContext} from '../../components/login/LoginContextProvider'
import { jwtDecode } from "jwt-decode";
import { createNewPost } from "../../data/PostCRUDs";


const NewBlogPost = props => {
  const navigate = useNavigate()
  const {token} = useContext(LoginContext)

  const BLANK_FORM = {
    category: 'Categoria 1',
    title: '',
    cover: '',
    readTime: {
      value: 1,
      unit: 'min'
    },
    authorId: jwtDecode(token)["userId"],
    content: ''
  }

  // stato per il form
  const [formData, setFormData] = useState(BLANK_FORM)

  // stato per la cover
  const [cover, setCover] = useState()

  // satato per rte
  const [text, setText] = useState("");
  const handleChange = useCallback(value => {
    setText(draftToHtml(value));
    setFormData({ ...formData, content: draftToHtml(value) })
  });

  // funzione per gestione cambio valori nel form
  const handleInputChange = (event) => {
    const target = event.target
    // se il target è uno dei sotto elementi dell'oggetto
    if (target.name == 'value' || target.name == 'unit'){
      // spread oggetto base poi gli dico che readtime è lo spread di formData.readTime, e gli cambio
      // il value in corrispondenza del name
      setFormData({...formData, readTime:{
        ...formData.readTime, [target.name]: target.value
      }})
    }
    else {
      setFormData({ ...formData, [target.name]: target.value })
    }
  }

  // funzione per gestire il cambio di cover
  const handleCoverChange = (event) => {
    setCover(event.target.files[0])
  }

  // funzione per salvare il post
  const savePost = async (event) => {
    event.preventDefault()

    const savedPost = await createNewPost(formData, token, cover)
    // se è a posto il salvataggio, sbianco
    if(savedPost){
      navigate('/')
    }
  }

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={savePost}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control required size="lg" placeholder="Title" name="title" onChange={handleInputChange} value={formData.title} />
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control size="lg" as="select" name="category" onChange={handleInputChange} value={formData.category}>
            <option value="Categoria 1">Categoria 1</option>
            <option value="Categoria 2">Categoria 2</option>
            <option value="Categoria 3">Categoria 3</option>
            <option value="Categoria 4">Categoria 4</option>
            <option value="Categoria 5">Categoria 5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cover</Form.Label>
          <Form.Control type="file"
            name="cover"
            required
            onChange={handleCoverChange}
          />
        </Form.Group>
        <Form.Group>
        <Form.Label>Durata</Form.Label>
          <Form.Control type="number"
            name="value"
            value={formData.readTime.value}
            onChange={handleInputChange}
          />
          <Form.Control as="select" name="unit" onChange={handleInputChange} 
            value={formData.readTime.unit}>
            <option value="min">min</option>
            <option value="hours">ore</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>

          <Editor required value={text} onChange={handleChange} className="new-blog-content" name="content" />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
