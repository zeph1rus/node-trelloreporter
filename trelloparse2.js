//for util.format (builtin)
const util = require('util');

// for file output
var fs = require('fs');

// array stack for lists
var validlists = [];

// config hardcoded
var configfile = './config.json';
var config = JSON.parse(fs.readFileSync(configfile,'utf8'));

//load data
var obj = JSON.parse(fs.readFileSync(config.inputfile, 'utf8'));

// push valid lists onto list stack
config.lists.forEach(function(listobject) { validlists.push(listobject.id) }); 

//check and remove output file, use sync as we need to be removed before opening.
if (fs.statSync(config.outputfile).isFile()) {
	console.log("output file exists, deleting...")
	fs.unlinkSync(config.outputfile);
} 

// open output file 
var outstream = fs.createWriteStream(config.outputfile)

// write header for HTML stream (mostly css)
outstream.write(config.htmlhead);

// reads names of list given listId
function readlistname (id, callback) {
	obj.lists.forEach(function(listobject) { 
		if(listobject.id === id ){
			callback(null,listobject.name);
			
		}
	}); 
}


console.log("Searching for following ids:");
console.log(validlists)
console.log("------------------------------")

//iterate through list of valid listIds
validlists.forEach(function(listid) { 
	//read list name and output header row with list name in.
	readlistname(listid, function(err,data){ 
		console.log("Processing List:")
		console.log(data);
		outstream.write(config.tableheadrowbegin);
		outstream.write(data);
		outstream.write(config.tableheadrowend);
	});
	// iterate through card objects searching for listIds.
	obj.cards.forEach(function(cardobject){
		if (cardobject.idList === listid) {
			//we don't want to output 'archived' cards
			if(cardobject.closed === false) {
				//output table rows
				outstream.write("<tr>\n");
				outstream.write(config.tablecolbegin);
				outstream.write("<b>");
				outstream.write(cardobject.name);
				outstream.write("</b>");
				outstream.write(config.tablecolend);
				outstream.write(config.tablecolbegin);
				outstream.write(cardobject.desc);
				outstream.write(config.tablecolend);
				outstream.write("</tr>\n")
			}
			
		}
	});
	// spaces between tables
	outstream.write("<br>");
});


