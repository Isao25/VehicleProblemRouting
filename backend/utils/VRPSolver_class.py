from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

class VRPSolver:
    def __init__(self, data):
        self.data = data
        self.manager = None
        self.routing = None

    def distance_callback(from_index, to_index):
        from_node = self.manager.IndexToNode(from_index)
        to_node = self.manager.IndexToNode(to_index)
        return round(((self.data['nodes'][from_node]['lat'] - self.data['nodes'][to_node]['lat'])**2 + (self.data['nodes'][from_node]['long'] - self.data['nodes'][to_node]['long'])**2)**0.5, 3) * 100

    def demand_callback(self, from_index):
        from_node = self.manager.IndexToNode(from_index)
        return self.data['nodes'][from_node]['demand']

    def time_callback(self, from_index):
        from_node = self.manager.IndexToNode(from_index)
        return self.data['nodes'][from_node]['serv_time']

    def create_routing_model(self):
        self.manager = pywrapcp.RoutingIndexManager(len(self.data['nodes']), self.data['num_vehicles'], self.data['nodes'][0]['index'])
        self.routing = pywrapcp.RoutingModel(self.manager)
        transit_callback_index = self.routing.RegisterTransitCallback(self.distance_callback)
        self.routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    def add_capacity_constraint(self):
        demand_callback_index = self.routing.RegisterUnaryTransitCallback(self.demand_callback)
        self.routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,  
            self.data['vehicle_capacities'],  
            True,  
            'Capacity'
        )

    def add_time_window_constraint(self):
        time_callback_index = self.routing.RegisterUnaryTransitCallback(self.time_callback)
        self.routing.AddDimension(
            time_callback_index,
            999999,      
            999999,      
            False,       
            'Time'       
        )
        time_dimension = self.routing.GetDimensionOrDie('Time')
        for node in self.data['nodes']:
            index = self.manager.NodeToIndex(node['index'])
            time_dimension.CumulVar(index).SetRange(node['time_window'][0], node['time_window'][1])

    def solve(self, solution_strategy):
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = solution_strategy
        solution = self.routing.SolveWithParameters(search_parameters)

        if solution:
            return self.extract_routes(solution)
        else:
            return None

    def extract_routes(self, solution):
        routes = []
        for vehicle_id in range(self.data['num_vehicles']):
            index = self.routing.Start(vehicle_id)
            route = []
            while not self.routing.IsEnd(index):
                node_index = self.manager.IndexToNode(index)
                route.append(self.data['nodes'][node_index])
                index = solution.Value(self.routing.NextVar(index))
            node_index = self.manager.IndexToNode(index)
            route.append(self.data['nodes'][node_index])
            routes.append(route)
        return routes