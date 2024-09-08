import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { savePostComment } from "../../../data/CommentCRUDs";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../login/LoginContextProvider";

function AddComment({reloadComments, setReloadComments, addCommentMode, setAddCommentMode}) {
    const params = useParams();
    const { id } = params;


    const {token} = useContext(LoginContext)

    const BLANK_FORM = {
        authorId: '',
        comment: '',
        postId:''
    }
    const [formData, setFormData] = useState(BLANK_FORM)
    
    // funzione per gestire la variazione del commento
    const handleInputChange = (event) => {
        const target = event.target
        setFormData({ ...formData, [target.name]: target.value })
    }

    // funzione per salvare il commento
    const fetchAddComment = function() {
        savePostComment(id,formData,token)
        setReloadComments(!reloadComments)
        setAddCommentMode(!addCommentMode)
    }

    return (
        <Form className="mt-5">
            <Form.Group controlId="blog-form" className="mt-3">
                <Form.Label>Commento</Form.Label>
                <Form.Control required size="lg" placeholder="Commento" name="comment" onChange={handleInputChange} value={formData.comment} />
            </Form.Group>
            <Form.Group className="d-flex mt-3 justify-content-end">
                <Button
                    size="lg"
                    variant="dark"
                    style={{
                        marginLeft: "1em",
                    }}
                    onClick={() => fetchAddComment()}
                >
                    Invia
                </Button>
            </Form.Group>
        </Form>
    );
}

export default AddComment;