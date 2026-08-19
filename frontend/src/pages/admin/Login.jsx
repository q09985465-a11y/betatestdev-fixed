import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";

export default function Login() {

    const navigate = useNavigate();

    const {
        login,
        isAuthenticated
    } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = await authService.login(
                username,
                password
            );

            login(data);

            navigate("/admin", {
                replace: true
            });

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >

            <form

                onSubmit={handleSubmit}

                style={{

                    width: 360,

                    background: "#fff",

                    padding: 30,

                    borderRadius: 10,

                    boxShadow: "0 2px 10px rgba(0,0,0,.15)"

                }}

            >

                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: 25
                    }}
                >
                    Panel Administrativo
                </h2>

                <input

                    type="text"

                    placeholder="Usuario"

                    value={username}

                    onChange={(e) =>
                        setUsername(e.target.value)
                    }

                    style={{

                        width: "100%",

                        padding: 10,

                        marginBottom: 15

                    }}

                />

                <input

                    type="password"

                    placeholder="Contraseña"

                    value={password}

                    onChange={(e) =>
                        setPassword(e.target.value)
                    }

                    style={{

                        width: "100%",

                        padding: 10,

                        marginBottom: 15

                    }}

                />

                {

                    error &&

                    <div
                        style={{
                            color: "red",
                            marginBottom: 15
                        }}
                    >
                        {error}
                    </div>

                }

                <button

                    type="submit"

                    disabled={loading}

                    style={{

                        width: "100%",

                        padding: 12,

                        cursor: "pointer"

                    }}

                >

                    {

                        loading

                            ? "Ingresando..."

                            : "Ingresar"

                    }

                </button>

            </form>

        </div>

    );

}
