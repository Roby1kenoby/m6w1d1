import { Button, Modal } from "react-bootstrap";
import BlogAuthor from "../blog-author/BlogAuthor";
import './SingleBlogComment.css'
import EditComment from "./EditComment";
import { useContext, useState } from "react";
import { LoginContext } from "../../login/LoginContextProvider";
import { jwtDecode } from "jwt-decode";
import { deletePostComment } from "../../../data/CommentCRUDs";

function SingleBlogComment({ comm, reloadComments, setReloadComments }) {
    const commentDate = new Date(comm.createdAt)
    const [editCommentMode, setEditCommentMode] = useState(false)
    const { token } = useContext(LoginContext)
    const userId = jwtDecode(token)["userId"]
    // se l'user nel token è uguale a quello nel commento allora può editare
    const userCanEdit = comm.authorId === userId ? true : false

    const enterEditMode = function () {
        setEditCommentMode(!editCommentMode)
    }

    const deleteComment = async function () {

        // const fetchDeletdComment = deletePostComment(comm.postId, comm._id, token)
        const text = "Sei sicuro/a di voler eliminare il commento?";
        if (window.confirm(text) == true) {
            const resp = await deletePostComment(comm.postId, comm._id, token)
            console.log(resp)
            setReloadComments(!reloadComments)

        } else {
            return
        }
    }

    return (
        <>
            <div className="commentWrapper">
                <div className="commentBox">
                    <p>{comm.comment}</p>
                    <p className="commentDate">{commentDate.toLocaleDateString("it-IT")}</p>
                </div>
                <BlogAuthor authorId={comm.authorId}></BlogAuthor>
                {userCanEdit && <div className="buttonContainer">
                    <Button variant="warning"
                        onClick={enterEditMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </Button>
                    <Button variant="danger"
                        onClick={() => deleteComment()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                    </Button>
                </div>}
                <hr></hr>
            </div>
            {/* Add Comment Modal */}
            {
                editCommentMode &&
                <Modal show={editCommentMode} onHide={() => { setEditCommentMode(false) }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Comment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EditComment comm={comm} reloadComments={reloadComments} setReloadComments={setReloadComments}
                            editCommentMode={editCommentMode} setEditCommentMode={setEditCommentMode} />
                    </Modal.Body>
                </Modal>
            }
        </>
    );
}

export default SingleBlogComment;