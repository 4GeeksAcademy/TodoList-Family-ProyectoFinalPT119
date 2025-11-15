import React, { useState, useRef, useEffect } from "react";

function GoogleMaps({ lat, lng, setLat, setLng }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {

        function safeInitMap() {
            if (window.google && window.google.maps && typeof window.google.maps.Map === "function") {
                const center = { lat: lat ? parseFloat(lat) : 20, lng: lng ? parseFloat(lng) : -99 };
                const map = new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom: 5,
                    mapId: "12fb4a783b70dc8349a13bb3"
                });
                if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
                    markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
                        position: center,
                        map,
                        draggable: true,
                    });
                    map.addListener("click", (e) => {
                        markerRef.current.position = e.latLng;
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                    });
                    markerRef.current.addListener("dragend", (e) => {
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                    });
                } else {
                    markerRef.current = new window.google.maps.Marker({
                        position: center,
                        map,
                        draggable: true,
                    });
                    map.addListener("click", (e) => {
                        markerRef.current.setPosition(e.latLng);
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                    });
                    markerRef.current.addListener("dragend", (e) => {
                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                    });
                }
            } else {
                setTimeout(safeInitMap, 100);
            }
        }

        
        const key = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';
        const scriptId = "google-maps-script";
        const existingScript = document.getElementById(scriptId);
        if (!window.google) {
            if (!existingScript) {
                const script = document.createElement("script");
                script.id = scriptId;
                script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=marker&loading=async`;
                script.async = true;
                script.defer = true;
                script.onload = safeInitMap;
                script.onerror = function () {
                    if (mapRef.current) {
                        mapRef.current.innerHTML = '<div style="color:red;text-align:center;padding:20px;">No se pudo cargar el mapa. Verifica tu conexión o la clave de Google Maps.</div>';
                    }
                };
                document.body.appendChild(script);
            } else {
                existingScript.onload = safeInitMap;
                existingScript.onerror = function () {
                    if (mapRef.current) {
                        mapRef.current.innerHTML = '<div style="color:red;text-align:center;padding:20px;">No se pudo cargar el mapa. Verifica tu conexión o la clave de Google Maps.</div>';
                    }
                };
            }
        } else {
            safeInitMap();
        }
       
    }, []);
    return <div ref={mapRef} style={{ width: "100%", height: 250, marginBottom: 8, borderRadius: 8 }} />;
}

export default GoogleMaps;
