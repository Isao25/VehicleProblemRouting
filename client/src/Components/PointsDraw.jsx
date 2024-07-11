import { polyline } from "leaflet";

export const PointsDraw = (arrayPoints, map) => {
    const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'cyan', 'magenta']; 

    const drawPoints = (points, color) => {
        const coordinates = points.map(point => [point[0], point[1]]);
        polyline(coordinates, { color }).addTo(map); 
        map.fitBounds(coordinates);
    };

    arrayPoints.forEach((ruta, index) => {
        const color = colors[index % colors.length]; 
        drawPoints(ruta, color);
    });
};