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
console.log("The roadGraph DS build using the array of 14 roads.")
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
                if(p.place != this.place) {
                    return p;
                }
                return {place: destination, address: p.address};
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

console.log("##The Automation of mail delivery##");

let first = new VillageState("Post Office", 
    [{place: "Post Office", address: "Alice's House"}]);
console.log(first);

let next = first.move("Alice's House");
console.log(next);
console.log(next.place);
console.log(next.parcels);
console.log(first.place);

// Building the robot to go to random places and hence end up delivering mails.

// Here we are creating the parcel objects as well via code.

// A helper fx to give you a random choice from the array 
// presumably the array of strings. Where strings are places
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}
console.log("Checking the randomPick helper fx.")
console.log(randomPick(["delhi","memphis","kolkata"]));

// Simulation of the robot as a function. As all the robot need to do is: 
// to decide to go to place using villageState.

function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])}
}
console.log("Checking the robot by passing a hardcoded state.")
let myVillageState = new VillageState("Alice's House");
console.log(myVillageState);
console.log(randomRobot(myVillageState));

//Creating initial village-state with some parcels
VillageState.random = function(parcelCount = 5) {
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
myNewVillageState = new VillageState("Fire Lane");
console.log(myNewVillageState);

// Helper fx to the main robot fx to actually move.
function runRobot(state, robot, memory) {
    for (let turn = 0;  ; turn++) {
        if(state.parcels.length == 0){
            console.log(`Done in ${turn} turns.`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(state);
        console.log(`Moved to ${action.direction}`);
    }
}

// Issuing command to run the robot.
console.log("The robot at work!");
runRobot(VillageState.random(), randomRobot);