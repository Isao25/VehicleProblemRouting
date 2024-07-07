import { createBrowserRouter } from 'react-router-dom';
import { MapPage } from '../Pages/MapPage/MapPage';
import { LandingPage } from '../Pages/LandingPage/LandinPage';

const routes = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path:"/anlize-vrp",
        element:<MapPage />
    }
]);

export default routes;