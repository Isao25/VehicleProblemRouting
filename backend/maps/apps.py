from django.apps import AppConfig



class MapsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'maps'
    graph = None

    def ready(self):
        import osmnx as ox  
        if not MapsConfig.graph:
            ox.config(log_console=True, use_cache=True)
            center_point = (-12.047209, -77.069313)
            G = ox.graph_from_point(center_point=center_point, dist=45000, simplify=True, retain_all=False)
            G = ox.add_edge_speeds(G)
            G = ox.add_edge_travel_times(G)
            MapsConfig.graph = G

