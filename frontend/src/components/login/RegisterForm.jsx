import { React, useState } from "react"
import { Button, Container } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import './RegisterForm.css'
import { NewAuthor } from "../../data/AuthorCRUDs";

function RegisterForm({showForm, setShowForm}) {
    // stato per gestire i dati di login
    const [registerFormData, setRegisterFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        birthDate: '',
        avatar: ''
    })
    // stato per il file
    const [registerFormAvatar, setRegisterFormAvatar] = useState()

    // funzione per gestire le variazioni di stato su digit dell'utente
    const handleFormChange = (event) => {
        const target = event.target
        setRegisterFormData({ ...registerFormData, [target.name]: target.value })
    }

    // funzione per gestire la variazione del file dell'avatar
    const handleAvatarChange = (event) => {
        setRegisterFormAvatar(event.target.files[0])
    }

    // funzione per mostrare il login form
    const showLoginForm = function() {
        setShowForm(!showForm)
    }

    // funzione per creare il nuovo utente
    const createNewAuthor = async function(){
        const createdAuthor = await NewAuthor(registerFormData, registerFormAvatar)
        createdAuthor._id ? showLoginForm() : alert('Errore nella creazione dell\'utente')
    }




    return ( 
        <div id="registerFormContainerWrapper">
            <div id="registerInnerWrapper">
                <h1>Register Form</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Indirizzo Email</Form.Label>
                        <Form.Control type="email"
                            name="email"
                            placeholder="Email" 
                            value={registerFormData.email} 
                            onChange={handleFormChange}
                            required
                            />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                            name="password" 
                            placeholder="Password" 
                            value={registerFormData.password}
                            onChange={handleFormChange}
                            required/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text"
                            name="name"
                            placeholder="Nome" 
                            value={registerFormData.name} 
                            onChange={handleFormChange}
                            />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cognome</Form.Label>
                        <Form.Control type="text"
                            name="surname"
                            placeholder="Cognome" 
                            value={registerFormData.surname} 
                            onChange={handleFormChange}
                            />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Data di nascita</Form.Label>
                        <Form.Control type="date"
                            name="birthDate"
                            value={registerFormData.birthDate} 
                            onChange={handleFormChange}
                            />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Avatar</Form.Label>
                        <Form.Control type="file"
                            name="avatar"
                            onChange={handleAvatarChange}
                            />
                    </Form.Group>
                    <div className="loginButtonGroup">
                        <Button variant="primary" onClick={createNewAuthor}>
                            Submit
                        </Button>
                        <Link variant="secondary" onClick={showLoginForm}
                            as="Button">
                            Already have an account? Click Here!
                        </Link>
                    </div>
                </Form>
            </div>
        </div>

    );
}

export default RegisterForm;