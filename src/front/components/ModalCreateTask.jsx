import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import GoogleMaps from "../components/GoogleMaps";

function ModalCreateTask({ setShowTaskModal }) {
    const { dispatch } = useGlobalReducer();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [direccion, setDireccion] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [msg, setMsg] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch({ type: 'ADD_USER_TASK', payload: { title: newTaskTitle } });

        setTitulo("");
        setDescripcion("");
        setDireccion("");
        setLat("");
        setLng("");
        setMsg("Tarea creada (mock)");

    };

    const handleInvitadosChange = (e) => {
        let value = e.target.value;

        const emails = value.split(',').map(i => i.trim()).filter(i => i);
        if (emails.length > 1 && !value.trim().endsWith(',')) {
            value = value + ', ';
        }
        setInvitados(value);
    };

    return (
        <div className="modal" tabIndex="-1" style={{ display: "block" }}>
            <form className="Form modal-dialog modal-dialog-centered" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h5 className="modal-title">
                        Añadir Tarea de Clan
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
                </div>
                <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10, minHeight: 60 }} />
                <input placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                <GoogleMaps lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
                <button type="submit" className="button" style={{ width: "100%", marginTop: 16, fontWeight: 600, fontSize: 18 }}>Crear tarea</button>
                <div style={{ color: "#7f00b2", marginTop: 16, textAlign: "center" }}>{msg}</div>
            </form>
        </div>

    );
}

export default ModalCreateTask;

/* 

<div className="modal" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content modal-content-dark">
                            <form onSubmit={handleAddTask}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Añadir Tarea de Clan
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="taskTitle" className="form-label">Título de la Tarea</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="taskTitle"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-custom-blue">Añadir Tarea</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
*/