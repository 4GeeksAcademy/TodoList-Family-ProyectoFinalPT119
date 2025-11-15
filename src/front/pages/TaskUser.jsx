import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const TaskUser = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="container mt-5">
			<h1 className="display-4 text-center mb-4">Tareas</h1>
			<div className="row justify-content-center">
				{store.tareas && store.tareas.length > 0 ? (
					store.tareas.map(tarea => (
						<div key={tarea.id} className="col-md-5 mb-4">
							<div className="card shadow-sm" style={{ borderLeft: "6px solid #1e91ed" }}>
								<div className="card-body">
									<h5 className="card-title" style={{ color: "#7f00b2" }}>{tarea.titulo}</h5>
									<p className="card-text">{tarea.descripcion}</p>
									<p className="mb-1"><strong>Fecha:</strong> {tarea.fecha} <strong>Hora:</strong> {tarea.hora}</p>
									<p className="mb-1"><strong>Dirección:</strong> {tarea.direccion}</p>
									<p className="mb-1"><strong>Invitados:</strong> {tarea.invitados && tarea.invitados.join(', ')}</p>
									{tarea.lat && tarea.lng && (
										<p className="mb-1"><strong>Ubicación:</strong> {tarea.lat}, {tarea.lng}</p>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<div className="col-12 text-center">
						<span className="text-danger">No hay tareas</span>
					</div>
				)}
			</div>
		</div>
	);
}; 