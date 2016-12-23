// node js boop
//for util.format (builtin)
const util = require('util');

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./board.json', 'utf8'));

console.log(obj.lists);

obj.lists.forEach(function(listobject) {
//	console.log(listobject.name);
	console.log(util.format('name: %s \n id: %s',listobject.name, listobject.id))
    });
