import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Container, TextField, Typography } from '@mui/material';
import { addLocation } from '../../api/maps.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Límites para la zona de Lima
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

export const MapPage = () => {
    const [markers, setMarkers] = useState([]);
    const [name, setName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleSearchLocation = async () => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=PE`);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            const map = mapRef.current;
            if (map) {
                map.setView([lat, lon], 17); // Al realizar una búsqueda se hace zoom en el lugar
            }
            toast.success('Location found!');
        } else {
            toast.error('Location not found. Please try another search query.');
        }
    };

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
            <Typography variant="h4">Map with Leaflet.js</Typography>
            <TextField
                label="Search Location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginTop: '10px', width: '100%' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearchLocation}
                style={{ marginTop: '10px' }}
            >
                Search Location
            </Button>
            <MapContainer
                center={[-12.0464, -77.0428]}
                zoom={13}
                style={{ height: '500px', width: '60vw', margin: '0 -16px' }}
                ref={mapRef}
                maxBounds={limaBounds}
                maxBoundsViscosity={1.0}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginTop: '10px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddMarker}
                style={{ marginTop: '10px' }}
            >
                Add Marker
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveMarker}
                style={{ marginTop: '10px', marginLeft: '10px' }}
                disabled={!selectedPosition || !name}
            >
                Save Marker
            </Button>
            <ToastContainer />
        </Container>
    );
};
