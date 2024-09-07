import React, { useContext, useEffect, useState } from "react";
import { Container, Image, Row, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";
import { getPostData } from "../../data/PostCRUDs";
import { LoginContext } from "../../components/login/LoginContextProvider";
import SingleBlogComment from "../../components/blog/blog-comment/SingleBlogComment";
import { getPostComments } from "../../data/CommentCRUDs";


const Blog = props => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  // stato per i commenti
  const [comments, setComments] = useState([])
  // per recuperare l'id dal queryString
  const params = useParams();
  const { id } = params;
  const {token} = useContext(LoginContext)
  
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
      console.log(commentsList)
    }
  }
  useEffect(() => {fetchPostData()}, [])
  useEffect(() => {fetchPostComments()}, [])

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
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
        </Container>
        <Container>
          <hr></hr>
          <Row>
            <div id="addCommentsWrapper">
              <h6>Commenti</h6>
              <Button variant="dark">
                Add Comments
              </Button>
            </div>
          </Row>
            {comments.map((comment) => (
              <Row key={comment._id} className="commentRow">
                <SingleBlogComment comm={comment}></SingleBlogComment>
              </Row>
            ))}
        </Container>
      </div>
    );
  }
};

export default Blog;
