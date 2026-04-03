import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.ts';
import Header from '../components/Header.tsx';
import styles from '../components/ProjectDetail.module.css';
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {logout} from "../features/auth/authSlice.ts";
interface Project { id: string; name: string; color: string; }
export default function ProjectDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const {user} = useSelector((state : RootState) => state.auth)
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get(`/projects/${id}`)
            .then(res => setProject(res.data))
            .catch(() => navigate('/dashboard'))
            .finally(() => setLoading(false));
    }, []); // BUG 1
    if (loading) return <div className={styles.loading}>Chargement...</div>;
    if (!project) return null;
    return (
        <div className={styles.layout}>
            <Header
                title="TaskFlow"
                onMenuClick={() => navigate('/dashboard')}
                userName={user?.name}
                onLogout={() => dispatch(logout())}
            />
            <main className={styles.main}>
                <div className={styles.header}>
                    <span className={styles.dot} style={{ background: project.color }} />
                    <h2>{project.name}</h2>
                </div>
                <p className={styles.info}>Projet ID: {project.id}</p>
            </main>
        </div>
    );
}
