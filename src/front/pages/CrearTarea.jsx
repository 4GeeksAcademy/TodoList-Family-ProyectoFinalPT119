import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import GoogleMaps from "../components/GoogleMaps";

function CrearTarea({ onTareaCreada }) {
    const { dispatch } = useGlobalReducer();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [direccion, setDireccion] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [invitados, setInvitados] = useState("");
    const [msg, setMsg] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const invitadosArr = invitados.split(",").map(i => i.trim()).filter(i => i);
        dispatch({
            type: "add_tarea",
            payload: {
                titulo,
                descripcion,
                fecha,
                hora,
                direccion,
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                invitados: invitadosArr
            }
        });
        setMsg("Tarea creada (mock)");
        setTitulo("");
        setDescripcion("");
        setFecha("");
        setHora("");
        setDireccion("");
        setLat("");
        setLng("");
        setInvitados("");
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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 60 }}>
            <form className="Form" onSubmit={handleSubmit}>
                <h2 style={{ color: "#7f00b2", textAlign: "center", marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>Crear tarea</h2>
                <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10, minHeight: 60 }} />
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ flex: 1, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                    <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{ flex: 1, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                </div>
                <input placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                <GoogleMaps lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
                <input placeholder="Invitados" value={invitados} onChange={handleInvitadosChange} style={{ width: "100%", marginBottom: 12, border: "1px solid #1e91ed", borderRadius: 8, padding: 10 }} />
                <button type="submit" className="button" style={{ width: "100%", marginTop: 16, fontWeight: 600, fontSize: 18 }}>Crear tarea</button>
                <div style={{ color: "#7f00b2", marginTop: 16, textAlign: "center" }}>{msg}</div>
            </form>
        </div>
    );
}

export default CrearTarea;