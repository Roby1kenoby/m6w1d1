import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Login() {
    // stato per gestire la visualizzazione dei form
    const [showForm, setShowForm] = useState(true)

    return ( 
    <>
        {showForm && <LoginForm showForm={showForm} setShowForm={setShowForm}/>}
        {!showForm && <RegisterForm showForm={showForm} setShowForm={setShowForm}/>}
    </>
    );
}

export default Login