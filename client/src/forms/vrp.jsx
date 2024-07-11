import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { solveVRP } from '../api/maps.api';
import { PointsDraw } from '@components'

const limaBounds = [
    [-12.3012, -77.1635], // Suroeste de Lima
    [-11.8858, -76.6157]  // Noreste de Lima
];

const MapEvents = ({ setSelectedPosition }) => {
    useMapEvents({
        click(e) {
            setSelectedPosition(e.latlng);
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
        }).on('markgeocode', function (e) {
            const { center } = e.geocode;
            map.setView(center, 17);
        }).addTo(map);

        return () => {
            geocoder.remove();
        };
    }, [map, limaBounds, setSelectedPosition]);

    return null;
};

// Define el esquema de validación con yup
const schema = yup.object().shape({
    distributionCenter: yup.object().shape({
        name: yup.string().required('El nombre del centro de distribución es obligatorio'),
        coordinates: yup.object().shape({
            lat: yup.number().required('Las coordenadas deben estar completas'),
            lng: yup.number().required('Las coordenadas deben estar completas'),
        }).required('Las coordenadas del centro de distribución son obligatorias')
    }),
    destinations: yup.array().of(
        yup.object().shape({
            name: yup.string().required('El nombre del destino es obligatorio'),
            coordinates: yup.object().shape({
                lat: yup.number().required('Las coordenadas deben estar completas'),
                lng: yup.number().required('Las coordenadas deben estar completas'),
            }).required('Las coordenadas del destino son obligatorias')
        })
    ).min(1, 'Debe haber al menos un destino'),
    vehicles: yup.number().min(1, 'Debe haber al menos un vehículo').required('La cantidad de vehículos es obligatoria')
});

export const VRP = () => {
    const [markers, setMarkers] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedField, setSelectedField] = useState(null);

    const mapRef = useRef();

    const { control, handleSubmit, setValue, getValues, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            distributionCenter: { name: '', coordinates: { lat: null, lng: null } },
            destinations: [{ name: '', coordinates: { lat: null, lng: null } }],
            vehicles: 1
        }
    });

    const formValues = watch();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                const map = mapRef.current;
                if (map) {
                    map.setView([latitude, longitude], 15);
                    toast.info('Ubicación redirigida.');
                }
            });
        }
    }, []);

    const handleSaveMarker = () => {
        if (selectedPosition && selectedField) {
            let markerName = '';
            if (selectedField === 'distributionCenter') {
                markerName = getValues('distributionCenter.name');
            } else if (selectedField.includes('destinations')) {
                const index = parseInt(selectedField.split('.')[1]);
                markerName = getValues(`destinations.${index}.name`);
            }

            if (!markerName) {
                toast.error('Por favor, proporciona un nombre para el marcador.');
                return;
            }

            const newMarker = { position: selectedPosition, name: markerName };
            setMarkers([...markers, newMarker]);

            if (selectedField === 'distributionCenter') {
                setValue('distributionCenter.coordinates', { lat: selectedPosition.lat, lng: selectedPosition.lng });
            } else if (selectedField.includes('destinations')) {
                const index = parseInt(selectedField.split('.')[1]);
                setValue(`destinations.${index}.coordinates`, { lat: selectedPosition.lat, lng: selectedPosition.lng });
            }

            setSelectedPosition(null);
            toast.success(`Marcador '${markerName}' agregado.`);
        } else {
            toast.error('Por favor, selecciona una posición y proporciona un nombre para el marcador.');
        }
    };

    const handleAddDestination = () => {
        const destinations = getValues('destinations');
        setValue('destinations', [...destinations, { name: '', coordinates: { lat: null, lng: null } }]);
    };

    const onSubmit = async (data) => {
        const formattedData = {
            num_vehicles: data.vehicles,
            nodes: [
                {
                    index: 0,
                    lat: data.distributionCenter.coordinates.lat,
                    long: data.distributionCenter.coordinates.lng
                },
                ...data.destinations.map((destination, index) => ({
                    index: index + 1,
                    lat: destination.coordinates.lat,
                    long: destination.coordinates.lng
                }))
            ]
        };
        console.log(formattedData)
        try {
            const response = await solveVRP(formattedData)

            if (response.status === 200) {
                toast.success('Datos enviados correctamente.');
                console.log('Response:', response.data);
                const map = mapRef.current;
                PointsDraw(response.data.routes, map);
            } else {
                toast.error('Error al enviar los datos.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al enviar los datos.');
        }
    };

    return (
        <div className="flex sm:flex-col lg:flex-row items-center justify-center py-12 px-16 mx-auto ">
            <div className="w-[600px] h-[400px] p-4 mx-4 bg-white rounded-lg shadow-xl dark:bg-darkSecundaryBg ">
                <MapContainer
                    center={[-12.0464, -77.0428]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', margin: '0' }}
                    ref={mapRef}
                    maxBounds={limaBounds}
                    maxBoundsViscosity={1.0}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Geocoder limaBounds={limaBounds} setSelectedPosition={setSelectedPosition} />
                    <MapEvents setSelectedPosition={setSelectedPosition} />
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.position}>
                            <Popup>{marker.name}</Popup>
                        </Marker>
                    ))}
                    {selectedPosition && (
                        <Marker position={selectedPosition}></Marker>
                    )}
                </MapContainer>
                <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={handleSaveMarker}
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                            disabled={!selectedPosition}
                        >
                            +
                        </button>
                    </div>
            </div>
            <div className="mx-8 sm:my-16 px-5 py-4 w-[350px] max-h-[400px] bg-white rounded-lg shadow-xl items-center justify-center dark:bg-darkSecundaryBg overflow-y-scroll">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Centro de Distribución</label>
                    <div>
                        <Controller
                            name="distributionCenter.name"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    onClick={() => setSelectedField('distributionCenter')}
                                    className="mt-1 block w-72 border border-gray-300 rounded-md shadow-sm"
                                    placeholder="Nombre del centro de distribución"
                                />
                            )}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Coordenadas: {getValues('distributionCenter.coordinates.lat') && getValues('distributionCenter.coordinates.lng')
                                ? `${getValues('distributionCenter.coordinates.lat')}, ${getValues('distributionCenter.coordinates.lng')}`
                                : 'No asignadas'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destinos</label>
                        {getValues('destinations').map((destination, index) => (
                        <div key={index}>
                            
                            <Controller
                                name={`destinations.${index}.name`}
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        onClick={() => setSelectedField(`destinations.${index}`)}
                                        className="mt-1 block w-72 border border-gray-300 rounded-md shadow-sm"
                                        placeholder={`Destino ${index + 1}`}
                                    />
                                )}
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Coordenadas: {destination.coordinates.lat && destination.coordinates.lng
                                    ? `${destination.coordinates.lat}, ${destination.coordinates.lng}`
                                    : 'No asignadas'}
                            </p>
                            <hr className='my-3'/>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddDestination}
                        className="mt-2 text-blue-500"
                    >
                        Agregar Destino
                    </button>
                    </div>
                    
                    
                    <div className='flex' >
                        <label className="block text-sm font-medium text-gray-700">Vehículos: </label>
                        <Controller
                            name="vehicles"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="number"
                                    {...field}
                                    className="ml-2 block border w-16 border-gray-300 rounded-md shadow-sm"
                                />
                            )}
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Enviar
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};