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

// let's build a graph of 11 points and 14 lines! the Graph DS
// which will tell us where and all we can reach from a particular place.

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
console.log("The roadGraph DS built using the array of 14 roads.")
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
                // if parcel is not at robot's place, it should not be 
                // picked or delivered.
                if(p.place != this.place) {
                    return p;
                }
                // otherwise the parcel need to be carried and thus location
                // need to be changed.
                return {place: destination, address: p.address};
                // filtering out or dropping the ones which are addressed to
                // place where robot is at.
            }).filter(p => p.place != p.address);

            return new VillageState(destination, parcels);
        }
    }
}

console.log("##The Automation of mail pickup & delivery##");

let first = new VillageState("Post Office", 
    [{place: "Shop", address: "Alice's House"}]);
console.log(first);

let next = first.move("Alice's House");
console.log(next);
console.log(next.place);
console.log(next.parcels);
console.log(first.place);

// Building the robot to go to random places and hence end up 
// picking and delivering all the parcels.

// Here we are creating the parcel objects as well via code.

// A helper fx to give you a random choice from the array 
// presumably the array of strings. Where strings are places.
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}
console.log("Checking the randomPick helper fx.")
console.log(randomPick(["detroit", "memphis", "delhi", "chicago"]));

// Simulation of the robot as a function. As all the robot need to do is: 
// to decide to go to place using current VillageState.

function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])}
}
console.log("Checking the robot by passing a hardcoded state.")
let myVillageState = new VillageState("Alice's House");
console.log(myVillageState);
console.log(randomRobot(myVillageState));

//Creating initial village-state with some parcels, adding a static to the class
VillageState.random = function(parcelCount = 1) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        }while(place == address);
        parcels.push({place, address})
    }
    console.log("Hey parcels are build for you!")
    console.log(parcels);
    return new VillageState("Post Office", parcels);
};
console.log("Checking creation of a state and parcels in there.")
myNewVillageState = new VillageState("Fire Lane", 
    [{place:"Bob's House", address: "Cabin"}]);
console.log(myNewVillageState);

// Helper fx to the main robot fx to actually move.
// One can imagine this fx as the user interface
function runRobot(state, robot, memory) {
    for (let turn = 0;  ; turn++) {
        if(state.parcels.length == 0){
            console.log(`Done in ${turn} turns.`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

// Issuing command to run the robot.
console.log("The randomRobot at work!");
//let myVillagesRandomState = VillageState.random();
let myVillagesRandomState = new VillageState("Post Office",
    [{place: "Ernie's House", address: "Marketplace"},
     {place: "Alice's House", address: "Marketplace"}]);
console.log(myVillagesRandomState); 
//runRobot(myVillagesRandomState, randomRobot);

const mailRoute = [ "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"];

// Building a route following robot
function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}
console.log("Now let's see how many steps routeRobot takes")
//runRobot(myVillagesRandomState, routeRobot, []);

// pathfinding "grow" routes from start point and exploring the
// shortest route from A to B.
function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++) {
        let {at, route} = work[i]; // MH way of defining varibales
        for (let place of graph[at]) {
            if (place == to){
                let retRoute = route.concat(place);
                console.log(retRoute);
                return retRoute;
            } 
            if (!work.some(w => w.at == place)) {
                let temp = {at: place, route: route.concat(place)}
                work.push(temp);
            }
        }
    }
}

// fx accepting argument in the form {prop1, prop2} will pick those exact
// properties from the passed object.
function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        // doing the picking thing first!
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
            console.log("Parcel picking route");
            console.log(route);
        // else if already picked do for a drop!!
        } else {
            route = findRoute(roadGraph, place, parcel.address)
            console.log("Parcel delivery route");
            console.log(route);
        }
    }
    return {direction: route[0], memory: route.slice(1)}
}

// invoking the pathfinding robot
console.log("Goal oriented robot!")
runRobot(myVillagesRandomState, goalOrientedRobot, []);