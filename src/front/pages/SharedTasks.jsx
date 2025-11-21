import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const SharedTasks = () => {
    const { store, dispatch } = useGlobalReducer();
    
    // ESTADO PARA EL MODAL DE UNIRSE
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState("");

    // OBTENER DATOS
    // 1. Buscamos el clan activo para mostrar su nombre
    const activeClan = store.clans.find(c => c.id === store.activeClanId);
    
    // 2. Filtramos las tareas para mostrar SOLO las de ese clan
    // (Si quieres ver todas las de todos los clanes, quita el .filter)
    const clanTasks = store.clanTasks.filter(task => task.clanId === store.activeClanId);

    // HANDLER PARA UNIRSE
    const handleJoinClan = (e) => {
        e.preventDefault();
        dispatch({ type: "JOIN_CLAN", payload: { code: joinCode } });
        setJoinCode("");
        setShowJoinModal(false);
        alert(`Solicitud enviada para el código: ${joinCode}`);
    };

    return (
        <div className="container mt-5 page-container">
            
            {/* --- MODAL UNIRSE A UN CLAN (Reutilizado) --- */}
            {showJoinModal && (
                <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-content-dark">
                            <form onSubmit={handleJoinClan}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Unirse a un Clan existente</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowJoinModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-muted mb-3">Introduce el código que te ha pasado el administrador del grupo.</p>
                                    <div className="mb-3">
                                        <label className="form-label">Código de Invitación</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={joinCode} 
                                            onChange={(e) => setJoinCode(e.target.value)} 
                                            placeholder="Ej: X7Y2Z"
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-custom-purple">Unirse</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}


            {/* --- ENCABEZADO --- */}
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h1 className="text-white display-4 fw-bold">Tareas de Clanes</h1>
                    {activeClan ? (
                        <p className="text-white-50">Viendo tareas de: <strong className="text-info">{activeClan.name}</strong></p>
                    ) : (
                        <p className="text-warning">Selecciona un clan en "Tus Clanes" para ver sus tareas</p>
                    )}
                </div>
            </div>

            {/* --- GRID DE TAREAS --- */}
            <div className="row">
                {clanTasks && clanTasks.length > 0 ? (
                    clanTasks.map((task) => (
                        <div key={task.id} className="col-md-6 mb-4">
                            {/* Tarjeta idéntica a TaskUser pero con borde Azul para diferenciar */}
                            <div 
                                className="card h-100 shadow-sm" 
                                style={{ 
                                    borderRadius: "20px", 
                                    backgroundColor: "#E3E8EF",
                                    borderLeft: "6px solid #0D6EFD", // Borde azul para indicar CLAN
                                    padding: "20px"
                                }}
                            >
                                <div className="card-body">
                                    <h3 className="card-title fw-bold mb-4" style={{ color: "#2c3e50" }}>
                                        {task.title}
                                    </h3>

                                    <div className="card-text" style={{ fontSize: "1.1rem", color: "#4a5568" }}>
                                        
                                        <p className="mb-2">
                                            <strong>Fecha:</strong> {task.date || "Pendiente"} 
                                            <span className="mx-3">|</span>
                                            <strong>Hora:</strong> {task.time || "--:--"}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Dirección:</strong> {task.address || "Sin ubicación"}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Invitados:</strong> {task.guests ? task.guests.join(", ") : "Todo el clan"}
                                        </p>

                                        {task.description && (
                                            <div className="mt-3 p-3 bg-white rounded text-muted small">
                                                <em>"{task.description}"</em>
                                            </div>
                                        )}

                                        {/* Badge de estado */}
                                        <div className="mt-3 text-end">
                                            <span className={`badge ${task.completed ? "bg-success" : "bg-warning text-dark"}`}>
                                                {task.completed ? "Completada" : "En Progreso"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center mt-5">
                        <div className="alert alert-dark d-inline-block p-4 rounded-3">
                            <h4><i className="fas fa-search me-2"></i> No hay tareas activas</h4>
                            <p className="mb-0">Este clan no tiene misiones pendientes por ahora.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* --- BOTÓN INFERIOR (REQUERIDO EN LA IMAGEN) --- */}
            <div className="row mt-5">
                <div className="col-12 text-center">
                    <button 
                        className="btn btn-custom-purple btn-lg px-5 py-3"
                        onClick={() => setShowJoinModal(true)}
                        style={{ borderRadius: "50px", fontSize: "1.2rem" }}
                    >
                        <i className="fas fa-user-plus me-2"></i> Unirse a otro Clan
                    </button>
                </div>
            </div>

        </div>
    );
};