import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { editPostComment } from "../../../data/CommentCRUDs";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../login/LoginContextProvider";

function EditComment({comm, reloadComments, setReloadComments, editCommentMode, setEditCommentMode}) {
    const params = useParams();
    const { id } = params;


    const {token} = useContext(LoginContext)

    const [formData, setFormData] = useState(comm)
    
    // funzione per gestire la variazione del commento
    const handleInputChange = (event) => {
        const target = event.target
        setFormData({ ...formData, [target.name]: target.value })
    }

    // funzione per salvare il commento
    const fetchEditComment = async function() {
        await editPostComment(id,formData,token)
        setReloadComments(!reloadComments)
        setEditCommentMode(!editCommentMode)
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
                    onClick={() => fetchEditComment()}
                >
                    Invia
                </Button>
            </Form.Group>
        </Form>
    );
}

export default EditComment;