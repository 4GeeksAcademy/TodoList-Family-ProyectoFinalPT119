import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/ProfileGroups.css";

// --- Componente Amigos (sin cambios) ---
const FriendListItem = ({ friend }) => (
    <div className="friend-list-item">
        <img src={friend.avatar} alt={friend.name} />
        <div className="friend-info">
            <strong>{friend.name}</strong>
            <span className={`status ${friend.status}`}>
                {friend.status === 'online' ? 'Activado' : 'Desactivado'}
            </span>
        </div>
        <button className="btn btn-sm btn-icon-only">
            <i className="fas fa-paper-plane"></i>
        </button>
    </div>
);

// --- NUEVO: Componente Calendario Placeholder ---
const CalendarPlaceholder = () => (
    <div className="calendar-placeholder">
        <div className="calendar-header">
            <button className="btn btn-sm btn-custom-blue">Previous</button>
            <span>Noviembre 2025</span>
            <button className="btn btn-sm btn-custom-blue">Next</button>
        </div>
        <div className="calendar-grid">
            {/* Días de la semana */}
            <div className="day-name">L</div><div className="day-name">M</div><div className="day-name">X</div>
            <div className="day-name">J</div><div className="day-name">V</div><div className="day-name">S</div><div className="day-name">D</div>
            {/* Días (ejemplo) */}
            <div className="day other-month">27</div><div className="day other-month">28</div><div className="day other-month">29</div>
            <div className="day other-month">30</div><div className="day other-month">31</div><div className="day">1</div><div className="day">2</div>
            <div className="day">3</div><div className="day">4</div><div className="day">5</div><div className="day">6</div><div className="day">7</div>
            <div className="day">8</div><div className="day">9</div><div className="day">10</div><div className="day">11</div><div className="day">12</div>
            <div className="day">13</div><div className="day">14</div><div className="day">15</div><div className="day">16</div><div className="day">17</div>
            <div className="day">18</div><div className="day">19</div><div className="day">20</div><div className="day">21</div><div className="day">22</div>
            <div className="day">23</div><div className="day">24</div><div className="day">25</div><div className="day">26</div><div className="day">27</div>
            <div className="day">28</div><div className="day">29</div><div className="day">30</div>
        </div>
    </div>
);


export const Profile = () => {
    const { store, dispatch } = useGlobalReducer();

    // Estados de Modales
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(store.profile);
    const [showBoteModal, setShowBoteModal] = useState(false);
    const [boteAmount, setBoteAmount] = useState(store.personalBote);

    // Sincronización con el store
    useEffect(() => { setFormData(store.profile); }, [store.profile]);
    useEffect(() => { setBoteAmount(store.personalBote); }, [store.personalBote]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("social.")) {
            const socialNetwork = name.split(".")[1];
            setFormData(prev => ({ ...prev, social: { ...prev.social, [socialNetwork]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({ type: "UPDATE_PROFILE", payload: formData });
        setShowModal(false);
    };
    const handleBoteSubmit = (e) => {
        e.preventDefault();
        if (parseFloat(boteAmount) <= 0 || !boteAmount) return alert("Introduce un importe positivo.");
        dispatch({ type: "UPDATE_PERSONAL_BOTE", payload: { newBote: boteAmount } });
        setShowBoteModal(false);
    };

    // --- DATOS DINÁMICOS PARA LA BARRA SUPERIOR (CONECTADOS) ---
    // Total tareas = Tareas de usuario + Tareas de clan
    const tasksCompleted = store.userTasks.filter(t => t.completed).length + store.clanTasks.filter(t => t.completed).length;
    const tasksPending = store.userTasks.filter(t => !t.completed).length + store.clanTasks.filter(t => !t.completed).length;
    const clanCount = store.clans.length;

    return (
        <div className="container page-container">

            {/* --- MODAL PARA EDITAR PERFIL --- */}
            {showModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content modal-content-dark">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Perfil</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3"><label className="form-label">Editar Foto de Perfil (URL)</label><input type="text" name="avatar" className="form-control" value={formData.avatar} onChange={handleChange} /></div>
                                            <div className="mb-3"><label className="form-label">Editar Nombre</label><input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} /></div>
                                            <div className="mb-3"><label className="form-label">Editar Presentación</label><textarea name="presentation" className="form-control" rows="3" value={formData.presentation} onChange={handleChange}></textarea></div>
                                            <div className="mb-3"><label className="form-label">Editar Dónde Vives</label><input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} /></div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3"><label className="form-label">Editar Edad</label><input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} /></div>
                                            <div className="mb-3"><label className="form-label">Editar Número</label><input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} /></div>
                                            <div className="mb-3"><label className="form-label">Editar Género</label><input type="text" name="gender" className="form-control" value={formData.gender} onChange={handleChange} /></div>
                                            <hr />
                                            <h6 className="mb-3">Redes</h6>
                                            <div className="mb-3"><label className="form-label">Instagram</label><input type="text" name="social.instagram" className="form-control" value={formData.social.instagram} onChange={handleChange} /></div>
                                            <div className="mb-3"><label className="form-label">Twitter</label><input type="text" name="social.twitter" className="form-control" value={formData.social.twitter} onChange={handleChange} /></div>
                                            <div className="mb-3"><label className="form-label">Facebook</label><input type="text" name="social.facebook" className="form-control" value={formData.social.facebook} onChange={handleChange} /></div>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-custom-blue">Guardar Cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL PARA EDITAR BOTE --- */}
            {showBoteModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-content-dark">
                            <form onSubmit={handleBoteSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Saldo del Bote Personal</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowBoteModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="boteAmount" className="form-label">Nuevo Saldo (€)</label>
                                        <input
                                            type="number"
                                            step="1" // <-- CAMBIO A NÚMEROS ENTEROS
                                            className="form-control"
                                            id="boteAmount"
                                            value={boteAmount}
                                            onChange={(e) => setBoteAmount(e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowBoteModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-custom-blue">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {(showModal || showBoteModal) && <div className="modal-backdrop fade show"></div>}

            {/* --- CONTENIDO DE LA PÁGINA (NUEVO LAYOUT) --- */}
            <div className="main-box">
                <div className="row">
                    {/* --- COLUMNA IZQUIERDA (Perfil + Amigos) --- */}
                    <div className="col-lg-4 profile-column-left">
                        {/* Info Perfil */}
                        <div className="text-center">
                            <img
                                src={store.profile.avatar}
                                alt="Foto de perfil"
                                className="img-fluid rounded-circle mb-3"
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                    border: "3px solid #6366F1"
                                }}
                            />
                            <h3>{store.profile.name}</h3>
                            <p className="text-muted">{store.profile.email}</p>
                            <button className="btn btn-custom-blue btn-sm" onClick={() => setShowModal(true)}>
                                Editar Perfil
                            </button>
                        </div>
                        {/* Barra de Búsqueda Amigos (Placeholder) */}
                        <input type="text" className="form-control my-4" placeholder="Buscar amigos..." style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "#333", borderColor: "rgba(0,0,0,0.1)" }} />
                        {/* Lista de Amigos */}
                        <div className="friend-list">
                            <h5 className="mb-3">Amigos activos</h5>
                            {store.friends.map(friend => (
                                <FriendListItem key={friend.id} friend={friend} />
                            ))}
                        </div>
                    </div>

                    {/* --- COLUMNA DERECHA (Cuadrícula 2x2 + Bote) --- */}
                    <div className="col-lg-8">
                        {/* --- BARRA DE RESUMEN (ACTUALIZADA) --- */}
                        <div className="d-flex justify-content-around text-center mb-4 p-2 rounded" style={{ backgroundColor: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)" }}>
                            <div><strong>{tasksCompleted}</strong><br />Tareas completadas</div>
                            <div><strong>{tasksPending}</strong><br />Tareas sin hacer</div>
                            {/* "Logros" eliminado */}
                            <div><strong>{clanCount}</strong><br />Clan</div>
                        </div>

                        {/* --- INICIO CUADRÍCULA 2x2 (Responsive) --- */}
                        <div className="row g-3 profile-grid">
                            {/* Detalles */}
                            <div className="col-md-6 profile-grid-item">
                                <div className="detail-box">
                                    <h4>Detalles</h4>
                                    <p>{store.profile.presentation}</p>
                                    <hr style={{ borderColor: "rgba(0,0,0,0.1)" }} />
                                    <p><i className="fas fa-map-marker-alt me-2 text-info"></i> {store.profile.location}</p>
                                    <p><i className="fas fa-birthday-cake me-2 text-info"></i> {store.profile.age} años</p>
                                    <p><i className="fas fa-phone me-2 text-info"></i> {store.profile.phone}</p>
                                    <p><i className="fas fa-venus-mars me-2 text-info"></i> {store.profile.gender}</p>
                                </div>
                            </div>
                            {/* Mensajes */}
                            <div className="col-md-6 profile-grid-item">
                                <div className="detail-box">
                                    <h4>Mensajes</h4>
                                    <p className="text-center text-muted fst-italic mt-4">No hay mensajes nuevos.</p>
                                </div>
                            </div>
                            {/* Otras Redes */}
                            <div className="col-md-6 profile-grid-item">
                                <div className="detail-box">
                                    <h4>Otras redes</h4>
                                    <p><i className="fab fa-instagram me-2 text-info"></i> {store.profile.social.instagram}</p>
                                    <p><i className="fab fa-twitter me-2 text-info"></i> {store.profile.social.twitter}</p>
                                    <p><i className="fab fa-facebook me-2 text-info"></i> {store.profile.social.facebook}</p>
                                </div>
                            </div>
                            {/* <div className="col-md-6 profile-grid-item">
                                <div className="detail-box">
                                    <h4 className="mb-0">Calendario</h4>
                                    <CalendarPlaceholder />
                                </div>
                            </div> */}
                        </div>
                        {/* --- FIN CUADRÍCULA 2x2 --- */}

                        {/* --- BOTE PERSONAL --- */}
                        <div className="col-12 mt-4">
                            <div className="detail-box text-center">
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <h4 className="mb-0 me-3">Saldo del Bote Personal</h4>
                                    {/* --- BOTÓN EDITAR BOTE (ARREGLADO) --- */}
                                    <button
                                        className="btn btn-sm btn-icon-only"
                                        onClick={() => setShowBoteModal(true)}
                                        title="Editar saldo"
                                    >
                                        <i className="fas fa-pencil-alt text-info"></i> {/* <-- CLASE 'text-info' AÑADIDA */}
                                    </button>
                                </div>
                                <h2 className="display-4 text-info" style={{ fontWeight: "bold" }}>
                                    {store.personalBote.toFixed(2)} €
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};