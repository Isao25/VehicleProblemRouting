import { polyline } from "leaflet";

export const PointsDraw = (arrayPoints, map) => {
    const drawPoints = (points) => {
        const coordinates = points.map(point => [point[0], point[1]]);
        polyline(coordinates).addTo(map);
        map.fitBounds(coordinates)
    };

    arrayPoints.forEach((ruta) => drawPoints(ruta));
};