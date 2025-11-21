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

    // --- DATOS DINÁMICOS PARA LA BARRA SUPERIOR ---
    const tasksCompleted = store.userTasks.filter(t => t.completed).length + store.clanTasks.filter(t => t.completed).length;
    const tasksPending = store.userTasks.filter(t => !t.completed).length + store.clanTasks.filter(t => !t.completed).length;
    const clanCount = store.clans.length;

    // --- LÓGICA DE GASTOS DEL MES (NUEVO) ---
    // Sumamos gastos personales + gastos de todos los clanes
    const totalPersonalExpenses = store.personalExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalClanExpenses = store.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = totalPersonalExpenses + totalClanExpenses;

    return (
        <div className="container page-container">

            {/* --- MODAL PARA EDITAR PERFIL --- */}
            {showModal && (
                <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                                            step="1"
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

            {/* --- CONTENIDO DE LA PÁGINA --- */}
            <div className="main-box">
                <div className="row">
                    {/* --- COLUMNA IZQUIERDA (Perfil + Amigos) --- */}
                    <div className="col-lg-4 profile-column-left">
                        <div className="text-center">
                            <img
                                src={store.profile.avatar}
                                alt="Foto de perfil"
                                className="img-fluid rounded-circle mb-3"
                                style={{ width: "120px", height: "120px", objectFit: "cover", border: "3px solid #6366F1" }}
                            />
                            <h3>{store.profile.name}</h3>
                            <p className="text-muted">{store.profile.email}</p>
                            <button className="btn btn-custom-blue btn-sm" onClick={() => setShowModal(true)}>
                                Editar Perfil
                            </button>
                        </div>
                        <input type="text" className="form-control my-4" placeholder="Buscar amigos..." style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "#333", borderColor: "rgba(0,0,0,0.1)" }} />
                        <div className="friend-list">
                            <h5 className="mb-3">Amigos activos</h5>
                            {store.friends.map(friend => (
                                <FriendListItem key={friend.id} friend={friend} />
                            ))}
                        </div>
                    </div>

                    {/* --- COLUMNA DERECHA --- */}
                    <div className="col-lg-8">
                        {/* BARRA DE RESUMEN */}
                        <div className="d-flex justify-content-around text-center mb-4 p-2 rounded" style={{ backgroundColor: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)" }}>
                            <div><strong>{tasksCompleted}</strong><br />Tareas completadas</div>
                            <div><strong>{tasksPending}</strong><br />Tareas sin hacer</div>
                            <div><strong>{clanCount}</strong><br />Clan</div>
                        </div>

                        {/* --- CUADRÍCULA 2x2 --- */}
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
                            
                            {/* --- NUEVA TARJETA: GASTOS DEL MES --- */}
                            <div className="col-md-6 profile-grid-item">
                                <div className="detail-box text-center d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
                                    <h4 className="text-muted mb-3">Gastos del Mes</h4>
                                    <i className="fas fa-chart-line fa-3x mb-2 text-danger"></i>
                                    <h2 className="display-5 fw-bold text-danger">{totalExpenses.toFixed(2)}€</h2>
                                    <Link to="/finances" className="btn btn-sm btn-outline-danger mt-2">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* --- BOTE PERSONAL --- */}
                        <div className="col-12 mt-4">
                            <div className="detail-box text-center">
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <h4 className="mb-0 me-3">Saldo del Bote Personal</h4>
                                    <button
                                        className="btn btn-sm btn-icon-only"
                                        onClick={() => setShowBoteModal(true)}
                                        title="Editar saldo"
                                    >
                                        <i className="fas fa-pencil-alt text-info"></i>
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