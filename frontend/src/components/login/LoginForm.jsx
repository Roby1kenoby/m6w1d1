import { useContext, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Form } from "react-bootstrap";
import './LoginForm.css'
import { Link } from "react-router-dom";
import { Login, LoginWithGoogle } from "../../data/LoginCRUDs";
import { LoginContext } from "./LoginContextProvider";


function LoginForm({ showForm, setShowForm }) {
    // login Context
    const { loggedUser, setLoggedUser, token, setToken } = useContext(LoginContext)

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
    const showRegisterForm = function () {
        setShowForm(!showForm)
    }

    // funzione per effettuare il login
    const login = async function () {
        const token = await Login(loginFormData)
        // setto il contesto con il token dell'utente loggato 
        setToken(token.jwtToken)
    }

    const loginWithGoogle = async function() {
        await LoginWithGoogle()
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
                            required />
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
                <div id="googleLoginWrapper">
                    <Button
                    variant="success"
                    onClick={() => loginWithGoogle()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                        </svg>
                        <p>Login con Google</p>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;