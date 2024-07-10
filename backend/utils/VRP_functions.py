from ortools.constraint_solver import routing_enums_pb2
from .VRPSolver_class import VRPSolver

def get_routes(G, vehicles):
    routes = []
    for vehicle in vehicles:
        vehicle_routes = []
        for track in zip(vehicle[:-1], vehicle[1:]):
            start = (track[0]['lat'], track[0]['long'])
            end = (track[1]['lat'], track[1]['long'])
            start_node = ox.distance.nearest_nodes(G, start[1], start[0])
            end_node = ox.distance.nearest_nodes(G, end[1], end[0])
            route_nodes = nx.shortest_path(G, start_node, end_node, weight='length')
            route_coords = [(G.nodes[node_id]['y'], G.nodes[node_id]['x']) for node_id in route_nodes]
            vehicle_routes.extend(route_coords)
        routes.append(vehicle_routes)
    return routes

def solve_VRP(G,data):
    solver = VRPSolver(data)
    solver.create_routing_model()
    routes = solver.solve(routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    if routes:
        routes_with_coords = get_routes(G, routes)
        return routes_with_coords
    else:
        return None

def solve_CVRP(G,data):
    solver = VRPSolver(data)
    solver.create_routing_model()
    solver.add_capacity_constraint()
    routes = solver.solve(routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    if routes:
        routes_with_coords = get_routes(G, routes)
        return routes_with_coords
    else:
        return None

def solve_VRPTW(G,data):
    solver = VRPSolver(data)
    solver.create_routing_model()
    solver.add_time_window_constraint()
    routes = solver.solve(routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
    if routes:
        routes_with_coords = get_routes(G, routes)
        return routes_with_coords
    else:
        return None