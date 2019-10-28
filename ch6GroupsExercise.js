// A beautiful example to understand objects (state and behavior), Symbol.iterator
// and even bonus on special call method of functions which can take a this.
class Group {
    constructor () {
        this.members = [];
    }

    add(value) {
        if(!this.has(value)){
            this.members.push(value);
        }
    }

    delete(value) {
        this.members = this.members.filter(v => v!== value);
    }

    has(value) {
        return this.members.includes(value);
    }
    
    static form(collection) {
        let group = new Group;
        for (let value of collection) {
            group.add(value);
        }
        return group;
    }

    [Symbol.iterator]() {
        return new GroupIterator(this);
    }

}

class GroupIterator {
    constructor(group) {
        this.group = group;
        this.position = 0;
    }

    next() {
        if(this.position >= this.group.members.length){
            return {done: true};
        } else {
            let result = {value: this.group.members[this.position],
                done: false}
            this.position++;
            return result;
        }

    }
}

for (let value of Group.form(["14","03","19"])) {
    console.log(value);
}

// last exercise of the ch6 

map = {one: true, two: true, hasOwnProperty: true};
//console.log(map.hasOwnProperty("one"));
console.log(Object.prototype.hasOwnProperty.call(map, "one"));