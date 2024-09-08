import React, { useCallback, useContext, useEffect, useState } from "react";
import { Editor } from 'react-draft-wysiwyg';
import { Container, Image, Row, Button, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import draftToHtml from "draftjs-to-html"
import "./styles.css";
import { editPost, getPostData, deletePost } from "../../data/PostCRUDs";
import { LoginContext } from "../../components/login/LoginContextProvider";
import SingleBlogComment from "../../components/blog/blog-comment/SingleBlogComment";
import { getPostComments } from "../../data/CommentCRUDs";
import { jwtDecode } from "jwt-decode";
import AddComment from "../../components/blog/blog-comment/AddComment";

const Blog = props => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [addCommentMode, setAddCommentMode] = useState(false)
  const [reloadComments, setReloadComments] = useState(false)

  // stato per i commenti
  const [comments, setComments] = useState([])
  // per recuperare l'id dal queryString
  const params = useParams();
  const { id } = params;
  const {token} = useContext(LoginContext)
  // id utente loggato
  const userId = jwtDecode(token)["userId"]
  // se l'utente è lo stesso del post, faccio comparire i pulsanti edit e delete
  const userCanEdit = blog.authorId === userId ? true : false
  
  const navigate = useNavigate();
  
  // funzione per recuperare i dati del post dall'id
  const fetchPostData = async function (){
    const postData = await getPostData(id,token)
    if(postData) {
      setBlog(postData)
      setLoading(false)
    }
    else{
      navigate('/404')
    }
  }
  // funzione per recuperare i commenti del post
  const fetchPostComments = async function(){
    const commentsList = await getPostComments(id, token)
    if(commentsList){
      setComments(commentsList)
    }
  }

  useEffect(() => {fetchPostData()}, [])
  useEffect(() => {fetchPostComments()}, [reloadComments])


  // GESTIONE EDIT DEL POST
  // stato per il form
  const [formData, setFormData] = useState(null)
  // stato per la cover
  const [cover, setCover] = useState("")
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

  /**
   *    GESTIONE MODALE EDIT POST
   */
  // funzione di show del modale
  const showModal = function(){
    // recupero i dati dal blog e compilo il modale
    setFormData({
      category: blog.category,
      title: blog.title,
      readTime: {
        value: blog.readTime.value,
        unit: blog.readTime.unit
      },
      authorId: blog.authorId,
      content: blog.content
    })

    console.log(formData)
    setEditMode(!editMode)
  }
  
  // funzione di update del post
  const fetchEditPost = async () => {
    if(!cover) {
      alert("Compilare tutti i campi obbligatori!")
      return
    } 

    console.log(formData)
    const editedPost = await editPost(id, formData, token, cover)
    console.log(editedPost)
    navigate('/')
    
  }

  // funzione per eliminare un post
  const fetchDeletePost = async () => {
    const text = "Sei sicuro/a di voler eliminare il post?";
    if (window.confirm(text) == true) {
      const resp = await deletePost(id, token)
      console.log(resp)
      navigate('/')
    } else {
      return
    }
  }
  
  /**
   *    GESTIONE MODALE NEW COMMENT
  */
  const addNewComment = function () {
    setAddCommentMode(true)
  }
  

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <>
        <div className="blog-details-root">
          <Container>
            <Image className="blog-details-cover" src={blog.cover} fluid />
            <h1 className="blog-details-title">{blog.title}</h1>
  
            <div className="blog-details-container">
              <div className="blog-details-author">
                <BlogAuthor authorId={blog.authorId} />
              </div>
              <div className="blog-details-info">
                <div>{blog.createdAt}</div>
                <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
                <div
                  style={{
                    marginTop: 20,
                  }}
                >
                  <BlogLike defaultLikes={["123"]} onChange={console.log} />
                </div>
              </div>
            </div>
  
            <div
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
            ></div>
            {userCanEdit && <div className="postButtonContainer">
            <Button variant="warning" onClick={showModal}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
            </Button>
            <Button variant="danger" onClick={() => fetchDeletePost()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </Button>
            </div>}
          </Container>
          <Container>
            <hr></hr>
            <Row>
              <div id="addCommentsWrapper">
                <h6>Commenti</h6>
                <Button variant="dark"
                  onClick={addNewComment}>
                  Add Comment
                </Button>
              </div>
            </Row>
              {comments.map((comment) => (
                <Row key={comment._id} className="commentRow">
                  <SingleBlogComment comm={comment} reloadComments={reloadComments} 
                    setReloadComments={setReloadComments}></SingleBlogComment>
                </Row>
              ))}
          </Container>
        </div>

        {/* Edit Post Modal */}
        {editMode && <Modal show={editMode} onHide={() => setEditMode(false)}>
          <Modal.Header closeButton>
              <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="mt-5">
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
                <Button
                  size="lg"
                  variant="dark"
                  style={{
                    marginLeft: "1em",
                  }}
                  onClick={() => fetchEditPost()}
                >
                  Invia
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>}
        
        {/* Add Comment Modal */}
        {
          addCommentMode && 
          <Modal show={addCommentMode} onHide={() => {setAddCommentMode(false)}}>
            <Modal.Header closeButton>
              <Modal.Title>Add Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddComment reloadComments={reloadComments} setReloadComments={setReloadComments}
                          addCommentMode={addCommentMode} setAddCommentMode={setAddCommentMode} />
            </Modal.Body>
          </Modal>
        }
      </>
    );
  }
};

export default Blog;
