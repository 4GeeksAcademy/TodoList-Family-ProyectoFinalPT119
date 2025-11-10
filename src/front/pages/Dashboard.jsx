import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css"; 

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate(); 
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [projectLink, setProjectLink] = useState("https://taskflowapp.com/project/12345"); 

    
    const mockMembers = [
        { id: 1, name: "Upashna Gurung", email: "upashygrg332@gmail.com", role: "Can edit", avatar: "https://i.pravatar.cc/150?img=31" },
        { id: 2, name: "Jeremy Lee", email: "jerrylee1990@gmail.com", role: "Can edit", avatar: "https://i.pravatar.cc/150?img=32" },
        { id: 3, name: "Thomas Park", email: "parktho123@gmail.com", role: "Owner", avatar: "https://i.pravatar.cc/150?img=33" },
        { id: 4, name: "Rachel Takahashi", email: "takahasirae32@gmail.com", role: "Can edit", avatar: "https://i.pravatar.cc/150?img=34" },
    ];


    const pendingTasks = store.todos.slice(0, 3); 
    const completedTasksCount = store.todos.filter(todo => todo.background !== null).length; 
    const activeClanTasks = store.activeClanId ? store.tasks.filter(task => task.clanId === store.activeClanId && !task.completed) : [];

 
    const handleSendInvite = (e) => {
        e.preventDefault();
        console.log("Invitación enviada a:", inviteEmail);
        setInviteEmail(""); 
    };

    const handleCopyProjectLink = () => {
        navigator.clipboard.writeText(projectLink);
        alert("¡Enlace copiado al portapapeles!");
    };

    return (
        <div className="dashboard-container">
           
            {showInviteModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content invite-modal-content">
                            <div className="modal-header invite-modal-header">
                                <h5 className="modal-title">Send an invite to a new member</h5>
                                <button type="button" className="btn-go-back" onClick={() => setShowInviteModal(false)}>
                                    Go Back
                                </button>
                            </div>
                            <div className="modal-body invite-modal-body">
                                {/* Sección de Email */}
                                <form onSubmit={handleSendInvite} className="mb-4">
                                    <label htmlFor="inviteEmail" className="form-label invite-label">Email</label>
                                    <div className="input-group">
                                        <input 
                                            type="email" 
                                            className="form-control invite-input" 
                                            id="inviteEmail" 
                                            value={inviteEmail} 
                                            onChange={(e) => setInviteEmail(e.target.value)} 
                                            placeholder="Enter email address"
                                            required 
                                        />
                                        <button type="submit" className="btn btn-send-invite">Send Invite</button>
                                    </div>
                                </form>

                               
                                <div className="mb-4">
                                    <label className="form-label invite-label">Members</label>
                                    <div className="member-list">
                                        {mockMembers.map(member => (
                                            <div key={member.id} className="member-item">
                                                <img src={member.avatar} alt={member.name} className="member-avatar" />
                                                <div className="member-info">
                                                    <strong>{member.name}</strong>
                                                    <span>{member.email}</span>
                                                </div>
                                                <div className="dropdown">
                                                    <button 
                                                        className="btn btn-sm btn-member-role dropdown-toggle" 
                                                        type="button" 
                                                        id={`dropdownRole-${member.id}`} 
                                                        data-bs-toggle="dropdown" 
                                                        aria-expanded="false"
                                                    >
                                                        {member.role}
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby={`dropdownRole-${member.id}`}>
                                                        <li><a className="dropdown-item" href="#">Can edit</a></li>
                                                        <li><a className="dropdown-item" href="#">View only</a></li>
                                                        <li><a className="dropdown-item" href="#">Owner</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                              
                                <div>
                                    <label htmlFor="projectLink" className="form-label invite-label">Project Link</label>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            className="form-control invite-input" 
                                            id="projectLink" 
                                            value={projectLink} 
                                            readOnly 
                                        />
                                        <button type="button" className="btn btn-copy-link" onClick={handleCopyProjectLink}>Copy Link</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showInviteModal && <div className="modal-backdrop fade show"></div>}


            
            <div className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">TASKFLOW</h1>
                </div>
                <div className="user-profile-summary">
                    <img 
                        src={store.profile.avatar} 
                        alt="User Avatar" 
                        className="user-avatar" 
                        onClick={() => navigate("/profile")}
                        style={{ cursor: "pointer" }}
                    />
                    <span className="username">{store.profile.name}</span>
                    <span className="user-email">{store.profile.email}</span>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><Link to="/dashboard" className="active"><i className="fas fa-desktop me-2"></i>Escritorio</Link></li>
                        <li><Link to="/tus-tareas"><i className="fas fa-tasks me-2"></i>Tus Tareas</Link></li>
                        <li><Link to="/groups"><i className="fas fa-users me-2"></i>Tus Clanes</Link></li>
                        <li><Link to="/tareas-compartidas"><i className="fas fa-share-alt me-2"></i>Tareas Compartidas</Link></li>
                        <li><Link to="/finanzas"><i className="fas fa-wallet me-2"></i>Finanzas</Link></li>
                        <li><Link to="/profile"><i className="fas fa-user-circle me-2"></i>Tu Perfil</Link></li>
                        <li><Link to="/configuracion"><i className="fas fa-cog me-2"></i>Configuración</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="dashboard-main-content">
                <header className="dashboard-navbar">
                    <div className="search-bar">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Buscar entre lista de tareas..." />
                    </div>
                    <div className="navbar-icons">
                        <i className="fas fa-bell"></i>
                        <i className="fas fa-envelope"></i>
                        <i className="fas fa-calendar-alt" onClick={() => navigate("/calendar")} style={{ cursor: "pointer" }}></i>
                        <i className="fas fa-question-circle"></i>
                    </div>
                </header>

                <div className="dashboard-content-area">
                    <div className="welcome-section">
                        <h2>Bienvenido de nuevo '{store.profile.name}'</h2>
                        <button className="btn btn-invite-user" onClick={() => setShowInviteModal(true)}>
                            <i className="fas fa-user-plus me-2"></i>Invitar
                        </button>
                    </div>

                    <div className="row g-4 dashboard-cards">
                       
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tus Tareas Pendientes</h3>
                                    <div>
                                        <button className="btn btn-sm btn-icon-only me-2"><i className="fas fa-plus"></i></button>
                                        <button className="btn btn-sm btn-icon-only"><i className="fas fa-pencil-alt"></i></button>
                                    </div>
                                </div>
                                <ul className="task-list">
                                    {pendingTasks.length > 0 ? (
                                        pendingTasks.map((todo, index) => (
                                            <li key={index} className="d-flex justify-content-between align-items-center">
                                                <span>{todo.title}</span>
                                                <div>
                                                    <i className="fas fa-check-square text-success me-2"></i>
                                                    <i className="fas fa-times-circle text-danger"></i>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">No hay tareas pendientes.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                       
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <h3>Resumen Financiero</h3>
                                <div className="text-center my-4">
                                    {/* Un placeholder visual para el gráfico */}
                                    <div style={{
                                        width: '100%',
                                        height: '120px',
                                        backgroundColor: 'rgba(30, 145, 237, 0.2)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(30, 145, 237, 0.8)',
                                        fontSize: '1.2rem'
                                    }}>
                                        <i className="fas fa-chart-line fa-2x me-2"></i>
                                        Gráfico Financiero (Placeholder)
                                    </div>
                                </div>
                            </div>
                        </div>

                       
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card text-center">
                                <h3>Saldo del Bote</h3>
                                <div className="d-flex justify-content-center align-items-center my-4">
                                    <h1 className="display-4 me-3" style={{ color: '#1e91ed', fontWeight: 'bold' }}>
                                        {store.personalBote.toFixed(2)}€
                                    </h1>
                                    <i className="fas fa-coins fa-3x" style={{ color: '#FFD700' }}></i>
                                </div>
                            </div>
                        </div>

                      
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <div className="card-header-actions">
                                    <h3>Tareas de Clanes</h3>
                                    <button className="btn btn-sm btn-icon-only"><i className="fas fa-plus"></i></button>
                                </div>
                                <ul className="task-list">
                                    {activeClanTasks.length > 0 ? (
                                        activeClanTasks.map(task => (
                                            <li key={task.id} className="d-flex justify-content-between align-items-center">
                                                <span>{task.title}</span>
                                                <i className="fas fa-check-square text-success"></i>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center mt-3">No hay tareas de clan pendientes.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <h3>Tareas Completadas</h3>
                                <div className="text-center my-4">
                                    <h1 className="display-3" style={{ color: '#28a745', fontWeight: 'bold' }}>
                                        {completedTasksCount}
                                    </h1>
                                    <p className="text-muted">¡Sigue así!</p>
                                </div>
                            </div>
                        </div>

                        
                        <div className="col-lg-4 col-md-6">
                            <div className="dashboard-card">
                                <h3>Próximos Eventos</h3>
                                <p className="text-muted text-center mt-4">No hay eventos próximos.</p>
                            </div>
                        </div>
                        
                       
                        <div className="col-12">
                            <div className="dashboard-card text-center">
                                <h3>Mensajes</h3>
                                <h1 className="display-1 my-4 text-info"><i className="fas fa-comment-dots"></i></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};