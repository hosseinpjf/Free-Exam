import { useState } from "react";

import AuthForm from "components/templates/AuthForm";

function AuthPage() {
    const [step, setStep] = useState(1);

    const inputs = () => {
        if (step === 1) return ['name', 'email', 'password']
        else if (step === 2) return ['email', 'password']
    }

    return (
        <div className="loginPage">
            <h2 className="title">Auth Page</h2>
            <AuthForm inputs={inputs()} />
            <button onClick={() => setStep(prevStep => prevStep === 1 ? 2 : 1)}>
                {step === 1 ? "Login" : "Register"}
            </button>
        </div>
    )
}

export default AuthPage