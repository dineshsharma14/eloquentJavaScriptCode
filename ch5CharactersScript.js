// Write a program which can find the Script the random text passed belong to.

// Code for finding the script when a random text is provided!
// Let's break the problem and think if we are passed the Unicode under usage!

function characterScript(code) {
    for (let script of SCRIPTS){
        if (script.ranges.some(([from, to]) => {
            return code >= from && code < to;
        })){
            return script;
        }
    }
    return null;
}

console.log(characterScript(34768));

// Use for/of loop to iterate over characters using 2 code units!

// Now let's write a fx that counts characters belong to particular script.
function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
        let name = groupName(item);
        let known = counts.findIndex(c => c.name == name);
        if (known == -1){
            counts.push({name, count: 1});
        }
        else {
            counts[known].count++;
        }
    }
    return counts;
}

// testing countBy
console.log(countBy([1,2,3,4,5], n => n > 2 ));

// Finally after doing basic abstractions and breaking the problem in parts
// functionally let's write the fx which actually parse on text passed!

function textScripts(text) {
    
    let scripts = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.name : "none";
    }).filter(({name}) => name != "none");

    let total = scripts.reduce((n, {count}) => n + count, 0);
    if (total == 0) return "No scripts found.";

    return scripts.map(({name, count}) => {
        return `${Math.round(count * 100 / total)}% ${name}`;
    }).join(", ");
    
}

console.log(textScripts('英国的狗说"woof woof", 俄罗斯的狗说"тяв"'+
'देश में बिजली की समस्या भी होगी दूर'));