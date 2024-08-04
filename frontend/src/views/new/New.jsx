import React, { useCallback, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import {convertToRaw} from "draft-js"
import draftToHtml from "draftjs-to-html"


const NewBlogPost = props => {

    // stato per il form
    const [formData, setFormData] = useState({
      title: '',
      category: '',
      content: ''
  })


  // satato per rte
  const [text, setText] = useState("");
  const handleChange = useCallback(value => {    
    setText(draftToHtml(value));
    setFormData({...formData, content: draftToHtml(value)})
  });


  const handleInputChange = (event) => {
    const target = event.target
    setFormData({...formData, [target.name]:target.value})
  }


  const savePost = (event) => {
    event.preventDefault()
    console.log(formData)
  }

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={savePost}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control size="lg" placeholder="Title" name="title" onChange={handleInputChange} value={formData.title}/>
        </Form.Group>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control size="lg" as="select" name="category" onChange={handleInputChange} value={formData.category}>
            <option>Categoria 1</option>
            <option>Categoria 2</option>
            <option>Categoria 3</option>
            <option>Categoria 4</option>
            <option>Categoria 5</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>

          <Editor value={text} onChange={handleChange} className="new-blog-content" name="content"/>
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
