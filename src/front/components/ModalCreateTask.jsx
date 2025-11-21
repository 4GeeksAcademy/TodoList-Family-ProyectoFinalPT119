import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import GoogleMaps from "../components/GoogleMaps";

function ModalCreateTask({ setShowTaskModal, taskType, taskToEdit = null }) {
    const { store, dispatch } = useGlobalReducer();
    const activeClanId = store.activeClanId;

    const isEditing = !!taskToEdit;
    const modalTitle = isEditing 
        ? (taskType === 'user' ? "Editar Tarea Personal" : "Editar Tarea de Clan")
        : (taskType === 'user' ? "Nueva Tarea Personal" : "Nueva Tarea de Clan");

    const buttonColor = taskType === 'user' ? "btn-custom-blue" : "btn-custom-purple";
    const buttonText = isEditing ? "Guardar Cambios" : "Crear Tarea";

    // Estados
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [direccion, setDireccion] = useState("");
    const [lat, setLat] = useState(20);
    const [lng, setLng] = useState(-99);
    const [msg, setMsg] = useState("");

    // EFECTO: Rellena el formulario si estamos editando
    useEffect(() => {
        if (taskToEdit) {
            setTitulo(taskToEdit.title || "");
            setDescripcion(taskToEdit.description || "");
            setDireccion(taskToEdit.address || "");
            setLat(taskToEdit.latitude || 20);
            setLng(taskToEdit.longitude || -99);
        } else {
            // Limpiar si es creación nueva
            setTitulo("");
            setDescripcion("");
            setDireccion("");
        }
    }, [taskToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMsg("");

        if (!titulo.trim()) { 
            setMsg("El título es obligatorio.");
            return;
        }

        const payloadData = {
            id: taskToEdit ? taskToEdit.id : undefined, // Importante para editar
            title: titulo,
            description: descripcion,
            address: direccion,
            latitude: lat,
            longitude: lng,
        };

        if (taskType === 'clan') {
            if (!isEditing && !activeClanId) {
                setMsg("Error: No hay clan activo.");
                return;
            }
            // Dispatch específico para CLAN (Crear o Editar)
            dispatch({ 
                type: isEditing ? 'UPDATE_CLAN_TASK' : 'ADD_TASK_TO_CLAN', 
                payload: { ...payloadData, clanId: activeClanId } 
            });
        } else {
            // Dispatch específico para USER (Crear o Editar)
            dispatch({ 
                type: isEditing ? 'UPDATE_USER_TASK' : 'ADD_USER_TASK', 
                payload: payloadData 
            });
        }

        setShowTaskModal(false); 
    };

    return (
        <div className="modal" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <form className="modal-content modal-content-dark" onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                            {modalTitle}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowTaskModal(false)}></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Título</label>
                            <input 
                                type="text"
                                placeholder="Ej: Comprar leche" 
                                value={titulo} 
                                onChange={e => setTitulo(e.target.value)} 
                                className="form-control" 
                                required 
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <textarea 
                                placeholder="Detalles adicionales..." 
                                value={descripcion} 
                                onChange={e => setDescripcion(e.target.value)} 
                                className="form-control" 
                                rows="3" 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Ubicación (Opcional)</label>
                            <GoogleMaps lat={lat} lng={lng} setLat={setLat} setLng={setLng} /> 
                            <input 
                                type="text"
                                placeholder="Dirección escrita" 
                                value={direccion} 
                                onChange={e => setDireccion(e.target.value)} 
                                className="form-control mt-2" 
                            />
                        </div>

                        {msg && <div className="alert alert-warning text-center">{msg}</div>}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancelar</button>
                        <button type="submit" className={`btn ${buttonColor}`}>{buttonText}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCreateTask;