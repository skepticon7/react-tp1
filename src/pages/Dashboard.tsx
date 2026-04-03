import {useState, memo, useCallback} from 'react';
import Header from '../components/Header.tsx';
import Sidebar from '../components/Sidebar.tsx';
import MainContent from '../components/MainContent.tsx';
import ProjectForm from '../components/ProjectForm';
import styles from '../components/Dashboard.module.css';
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {logout} from "../features/auth/authSlice.ts";
import useProjects, {type Project} from "../hooks/useProjects.ts";
export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving , setSaving] = useState<boolean>(false);

    const dispatch = useDispatch()
    const {user } = useSelector((state : RootState) => state.auth)


    const { projects, columns, loading, error, addProject, renameProject, deleteProject }
        = useProjects();


    const MemorizedSideBar = memo(Sidebar);

    const handleRename = useCallback((project : Project) => {
        renameProject(project)
    } , [])

    const handleDelete = useCallback((id : string) => {
        deleteProject(id)
    }, [])

    if (loading) return <div className={styles.loading}>Chargement...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    return (
        <div className={styles.layout}>

            <Header
                title="TaskFlow"
                onMenuClick={() => setSidebarOpen(p => !p)}
                userName={user?.name}
                onLogout={() =>dispatch(logout())}
            />
            <div className={styles.body}>
                <MemorizedSideBar projects={projects} isOpen={sidebarOpen} onDelete={handleDelete} onEdit={handleRename}/>
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