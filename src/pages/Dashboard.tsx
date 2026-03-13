import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext.tsx';
import api from '../api/axios.ts';
import Header from '../components/Header.tsx';
import Sidebar from '../components/Sidebar.tsx';
import MainContent from '../components/MainContent.tsx';
import ProjectForm from '../components/ProjectForm';
import styles from '../components/Dashboard.module.css';
import axios from "axios";
interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }
export default function Dashboard() {
    const { state: authState, dispatch } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error , setError] = useState<string | null>(null);
    const [saving , setSaving] = useState<boolean>(false);

    // GET — charger les données au montage
    useEffect(() => {
        async function fetchData() {
            try {
                const [projRes, colRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/columns'),
                ]);
                setProjects(projRes.data);
                setColumns(colRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        fetchData();
    }, []);


    // POST — ajouter un projet
    async function addProject(name: string, color: string) {
        setSaving(true);
        setError(null);
        try {
            const { data } = await api.post('/projects', { name, color });
            setProjects(prev => [...prev, data]);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
            } else {
                setError('Erreur inconnue');
            }
        } finally {
            setSaving(false);
        }
    }

    // PUT — renommer un projet
    async function renameProject(project : Project) {
        setError(null);
        setSaving(true);
        const newName = prompt('Nouveau nom : ' , project.name);
        try {
            if(newName && newName.trim() !== "" && newName.trim() !== project.name) {
                project.name = newName;
                setProjects(prev => prev.filter(proj => proj.id !== project.id));
                const {data} = await api.put(`/projects/${project.id}` , project);
                setProjects((prev) => [...prev , data]);
            }else{
                throw new Error();
            }
        }catch (e) {
            if(axios.isAxiosError(e)) {
                setError(e?.response?.data?.message || `Erreur ${e.response?.status}`);
            }else{
                setError('Erreur dans le renommage')
            }
        }finally {
            setSaving(false)
        }
    }

    async function deleteProject(id : string) {
        setError(null);
        setSaving(true);
        try{
            await api.delete(`projects/${id}`);
            setProjects(prev => prev.filter(p => p.id !== id))
        }catch (e) {
            if(axios.isAxiosError(e)) {
                setError(e?.response?.data?.message || `Erreur ${e.response?.status}`);
            }else{
                setError('Erreur dans la supression')
            }
        }finally {
            setSaving(false)
        }
    }

    if (loading) return <div className={styles.loading}>Chargement...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    return (
        <div className={styles.layout}>
            <Header
                title="TaskFlow"
                onMenuClick={() => setSidebarOpen(p => !p)}
                userName={authState.user?.name}
                onLogout={() => dispatch({ type: 'LOGOUT' })}
            />
            <div className={styles.body}>
                <Sidebar projects={projects} isOpen={sidebarOpen} onDelete={deleteProject} onEdit={renameProject}/>
                <div className={styles.content}>
                    <div className={styles.toolbar}>
                        {!showForm ? (
                            <button disabled={saving} className={styles.addBtn}
                                    onClick={() => setShowForm(true)}>
                                + Nouveau projet
                            </button>
                        ) : (
                            <ProjectForm
                                submitLabel="Créer"
                                onSubmit={(name, color) => {
                                    addProject(name, color);
                                    setShowForm(false);
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        )}
                    </div>
                    <MainContent columns={columns} />
                </div>
            </div>
        </div>
    );
}