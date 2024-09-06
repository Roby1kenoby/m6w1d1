import { useContext, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Form } from "react-bootstrap";
import './LoginForm.css'
import { Link } from "react-router-dom";
import { Login } from "../../data/LoginCRUDs";
import { LoginContext } from "./LoginContextProvider";


function LoginForm({showForm, setShowForm}) {
    // login Context
    const {loggedUser, setLoggedUser, token, setToken} = useContext(LoginContext)

    // stato per gestire i dati di login
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    })

    // funzione per gestire le variazioni di stato su digit dell'utente
    const handleFormChange = (event) => {
        const target = event.target
        setLoginFormData({ ...loginFormData, [target.name]: target.value })
    }

    // funzione per mostrare il form di registrazione
    const showRegisterForm = function() {
        setShowForm(!showForm)
    }

    // funzione per effettuare il login
    const login = async function() {
        const token = await Login(loginFormData)
        // setto il contesto con il token dell'utente loggato 
        setToken(token.jwtToken)
    }

    return ( 
        <div id="loginFormContainerWrapper">
            <div id="innerWrapper">
                <h1>Login </h1>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email"
                            name="email"
                            placeholder="Enter email" 
                            value={loginFormData.email} 
                            onChange={handleFormChange}
                            required
                            />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                            name="password" 
                            placeholder="Password" 
                            value={loginFormData.password}
                            onChange={handleFormChange}
                            required/>
                    </Form.Group>
                    <div className="loginButtonGroup">
                        <Button variant="primary" onClick={login}>
                            Submit
                        </Button>
                        <Link variant="secondary" onClick={showRegisterForm}
                            as="Button">
                            Don't have an account? Register here!
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginForm;