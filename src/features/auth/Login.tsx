import styles from './Login.module.css'
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../store/store.ts";
import {loginStart , loginSuccess} from "./authSlice.ts";


export default function Login() {
    const dispatch = useDispatch();
    const {user , loading , error} = useSelector((state : RootState) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const [email , setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from = (location.state as any)?.from || '/dashboard';

    useEffect(() => {
        if(user) navigate(from);
    } , [user , navigate , location , from])

    async function handleSubmit(e : React.FormEvent) {
        e.preventDefault();
        dispatch(loginStart());
        try{
            const res = await fetch(`http://localhost:4000/users?email=${email}`)
            const users = await res.json();
            if(users.length === 0 || users[0].password !== password) {
                dispatch({type : 'LOGIN_FAILURE' , payload : 'Bad credentials'})
                return;
            }
            const {password : _, ...user} = users[0];
            const fakeToken = btoa(JSON.stringify({
                userId: user.id,
                email: user.email,
                role: 'admin',
                exp: Date.now() + 3600000 // expire dans 1h
            }));
            dispatch(loginSuccess({ user, token: fakeToken }));
        }catch {
            dispatch({type : 'LOGIN_FAILURE' , payload : 'Internal Server Error'})
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>TaskFlow</h1>
                <p className={styles.subtitle}>Connectez-vous pour continuer</p>
                {error && <div className={styles.error}>{error}</div>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}