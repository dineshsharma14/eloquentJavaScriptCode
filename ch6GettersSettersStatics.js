let varyingSize = {
    get size() {
        return Math.floor(Math.random()*100);
    }
};

console.log(varyingSize.size);
console.log(varyingSize.size);

// A typical Temperature program

class Temperature {
    constructor(celsius) {
        this.celsius = celsius;
    }

    get fahrenheit() {
        return this.celsius * 1.8 + 32;
    }

    set fahrenheit(value) {
        this.celsius = (value - 32) / 1.8;
    }

    static fromFahrenheit(value) {
        return new Temperature((value - 32)/1.8);
    }
}

let temp = new Temperature(23);
console.log(temp.fahrenheit);
temp.fahrenheit = 70;
console.log(temp.celsius);
console.log(Temperature.fromFahrenheit(100));