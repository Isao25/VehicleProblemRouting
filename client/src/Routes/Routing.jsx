import { createBrowserRouter } from 'react-router-dom';
import { MapPage } from '../Pages/MapPage/MapPage';

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MapPage />
    },
]);

export default routes;