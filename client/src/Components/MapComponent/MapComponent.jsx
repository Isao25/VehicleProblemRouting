import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Container, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { addLocation } from '../../api/maps.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const limaBounds = [
    [-12.3012, -77.1635], // Suroeste de Lima
    [-11.8858, -76.6157]  // Noreste de Lima
];

const MapEvents = ({ allowAddMarker, setSelectedPosition, setAllowAddMarker }) => {
    useMapEvents({
        click(e) {
            if (allowAddMarker) {
                setSelectedPosition(e.latlng);
                setAllowAddMarker(false);
            }
        },
    });
    return null;
};

const Geocoder = ({ limaBounds, setSelectedPosition }) => {
    const map = useMap();

    useEffect(() => {
        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
            geocoder: L.Control.Geocoder.nominatim({
                bounds: limaBounds,
                countrycodes: 'PE'
            })
        }).on('markgeocode', function(e) {
            const { center } = e.geocode;
            map.setView(center, 17);
            // Actualiza la posición seleccionada yle pone un marcador
            //setSelectedPosition(center); 
        }).addTo(map);

        return () => {
            geocoder.remove();
        };
    }, [map, limaBounds, setSelectedosition]);

    return null;
};

export const MapComponent = () => {
    const [markers, setMarkers] = useState([]);
    const [name, setName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [allowAddMarker, setAllowAddMarker] = useState(false);
    const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
    const mapRef = useRef();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const map = mapRef.current;
                if (map) {
                    map.setView([latitude, longitude], 15);
                    setIsGeolocationEnabled(true);
                    toast.info('Location redirected.');
                }
            });
        }
    }, []);

    const handleAddMarker = () => {
        setAllowAddMarker(true);
    };

    const handleSaveMarker = () => {
        if (selectedPosition && name) {
            const newMarker = { name, position: selectedPosition };
            setMarkers([...markers, newMarker]);
            setName('');
            saveLocation(name, selectedPosition);
            setSelectedPosition(null);
            toast.success(`Marker '${name}' added.`);
        } else {
            toast.error('Please select a position and provide a name for the marker.');
        }
    };

    const saveLocation = (name, position) => {
        addLocation({ name, latitude: position.lat, longitude: position.lng })
            .then(response => {
                console.log('Location saved', response.data);
                toast.success('Location saved successfully!');
            })
            .catch(error => {
                console.error('Error saving location', error);
                toast.error('Failed to save location. Please try again.');
            });
    };

    return (
        <Container>
            <MapContainer
                center={[-12.0464, -77.0428]}
                zoom={13}
                style={{ height: '500px', width: '60vw', margin: '0 -16px' }}
                ref={mapRef}
                maxBounds={limaBounds}
                maxBoundsViscosity={1.0}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Geocoder limaBounds={limaBounds} setSelectedPosition={setSelectedPosition} />
                <MapEvents allowAddMarker={allowAddMarker} setSelectedPosition={setSelectedPosition} setAllowAddMarker={setAllowAddMarker} />
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>{marker.name}</Popup>
                    </Marker>
                ))}
                {isGeolocationEnabled && (
                    <Marker position={mapRef.current?.getCenter()}>
                        <Popup>Location redirected</Popup>
                    </Marker>
                )}
                {selectedPosition && (
                    <Marker position={selectedPosition}></Marker>
                )}
            </MapContainer>
            <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginTop: '10px' }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSaveMarker}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddMarker}
                style={{ marginTop: '10px' }}
            >
                Añadir nodo
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveMarker}
                style={{ marginTop: '10px', marginLeft: '10px' }}
                disabled={!selectedPosition || !name}
            >
                Guardar nodo
            </Button>
            <ToastContainer />
        </Container>
    );
};
