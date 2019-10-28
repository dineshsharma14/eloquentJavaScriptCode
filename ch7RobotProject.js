// A robot delivering mails!
// Village of Medowfield has 14 roads and 11 places
const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
  ];

// let's build a graph of 11 points and 14 lines!

function buildGraph(edges) {
    let graph = Object.create(null);

    // helper function to build graph
    function addEdge(from, to) {
        if(graph[from] == undefined) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }

    for (let [from, to] of edges.map(road => road.split("-"))){
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

roadGraph = buildGraph(roads);
console.log(roadGraph);

// instead of writing objects for every concept involved, we are making the class
// for village state

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if(!roadGraph[this.place].includes(destination)){
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if(p.place != this.place) return p;
                return {place: destination, address: p.address};
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

let first = new VillageState("Post Office", 
    [{place: "Post Office", address: "Alice's House"}]);
console.log(first);

let next = first.move("Alice's House");
console.log(next);
console.log(next.place);
console.log(next.parcels);
console.log(first.place);

