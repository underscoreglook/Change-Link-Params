// Because I'm too lazy to have the view dynamically update an internal model structure,
// the view holds the most up to date data, as the user changes it.
// We don't update any data until the user hits "Save".

$( document ).ready(function() {

/****************
 * View methods *
 ****************/
function AddRow(name="New Item", additions=[], deletions=[]) {
	var newRow = $("<tr></tr>")
	
	// Name
	var nameCol = $("<td></td>");
	nameCol.append("<input class='name' type='text' value='" + name + "'>");
	newRow.append(nameCol);
	
	// Additions
	var addCol = $("<td></td>");
	additions.forEach(function(pair){
		if (pair) {
			addCol.append(CreateAddition(pair[0], pair[1]));
		}
	});
	var newAddButton = $("<button type='button'>New</button>");
	newAddButton.click(AddAddition);
	addCol.append(newAddButton);
	newRow.append(addCol);
	
	// Deletions
	var deleteCol = $("<td></td>");
	deletions.forEach(function(deletion) {
		if (deletion) {
			deleteCol.append(CreateDeletion(deletion));
		}
	});
	var newDelButton = $("<button type='button'>New</button>");
	newDelButton.click(AddDeletion);
	deleteCol.append(newDelButton);
	newRow.append(deleteCol);
	
	// Remove me button
	var removeCol = $("<td></td>");
	var removeButton = $("<button type='button'>Remove</button>");
	removeButton.click(RemoveRow);
	removeCol.append(removeButton);
	newRow.append(removeCol);
	
	$("#allItems").append(newRow);
}

// We assume that this is called when the "Remove" button is clicked on a row, so "this" is the button element
function RemoveRow() {
	$(this).closest("tr").remove();
}


// We assume the parent of this button contains is the container of all the data we want
function RemoveAdditionOrDeletion() {
	$(this).parent().remove();
}

// Function for the button to add a new addition or replacement.
// The assumption is to add it before the button.
function AddAddition() {
	$(this).before(CreateAddition());
}

// Returns a new element for the div containing addition/replacement inputs & data
function CreateAddition(param = 'param', replacement = 'replace') {
	var newAddition = $("<div class='addition'></div>");
	newAddition.append($("<input type='text' class='param' value='"+param+"'>"));
	newAddition.append(" = ");
	newAddition.append($("<input type='text' class='replace' value='"+replacement+"'>"));
	
	var removeButton = $("<button>X</button>");
	removeButton.click(RemoveAdditionOrDeletion);
	newAddition.append(removeButton);
	
	return newAddition;
}

// Function for the button to add a new parameter deletion.
// The assumption is to add it before the button.
function AddDeletion() {
	$(this).before(CreateDeletion());
}

// Returns a new element for the div containing a deletion's input and data
function CreateDeletion(param = 'param') {
	var newDeletion = $("<div class='deletion'></div>");
	newDeletion.append($("<input type='text' class='param' value='"+param+"'>"));
	
	var removeButton = $("<button>X</button>");
	removeButton.click(RemoveAdditionOrDeletion);
	newDeletion.append(removeButton);
	
	return newDeletion;
}



/*********************
 * Save Data Methods *
 *********************/
 const kGroupSep = String.fromCharCode(29);
 const kRecordSep = String.fromCharCode(30);
 const kUnitSep = String.fromCharCode(31);
 var gIsInitialized = false;
 
// Based on the DOM, save data to the browser storage
function SaveOptions() {
	var saveStrings = [];
	
	$("#allItems tr").each(function(index) {
		var $this = $(this);
		
		var name = $this.find(".name").val();
		
		var additions = [];
		$this.find(".addition").each(function(index) {
			var $this = $(this);
			var param = $this.find(".param").val();
			var replace = $this.find(".replace").val();
			additions.push(param + "=" + replace);
		});
		
		var deletions = [];
		$this.find(".deletion").each(function(index) {
			deletions.push($(this).find(".param").val());
		});
		
		saveStrings.push(name + kRecordSep + additions.join(kUnitSep) + kRecordSep + deletions.join(kUnitSep) );
	});
	
	browser.storage.sync.set({
		linkChanger: saveStrings.join(kGroupSep)
	});
	
	browser.runtime.reload();
	RestoreOptions();
}

function RestoreOptions() {
	/*var storageItem = browser.storage.local.get('linkChanger');
	storageItem.then((res) => {
		UpdateFromData(res.linkChanger);
	});*/

	var gettingItem = browser.storage.sync.get('linkChanger');
	gettingItem.then((res) => {
		UpdateFromData(res.linkChanger);
	});
}

function UpdateFromData(stringData) {
	if (!stringData || gIsInitialized) {
		return;
	}
	
	gIsInitialized = true;
	stringData.split(kGroupSep).forEach(function(saveString){
		var elements = saveString.split(kRecordSep);
		if(elements.length == 3) {
			var additions = [];
			elements[1].split(kUnitSep).forEach(function(additionStr){
				var additionPair = additionStr.split('=');
				if (additionPair.length == 2) {
					additions.push(additionPair);
				}
			});
			
			var deletions = elements[2].split(kUnitSep);
			
			AddRow(elements[0], additions, deletions);
		}
	});
}


/*********************
 * Hook into the DOM *
 *********************/
$("#Add").click(function() { AddRow(); });
$("#Save").click(SaveOptions);
RestoreOptions();




/******* NOTES ***********
TODO:
- Additions/Replacements should also be able to come from other existing parameters
- Additions/Replacements should also be able to get data from other info (like webpage info, metadata, time, url, etc)
- Potentially only show menu items under certain urls (may need better browser.menus api support, or just refresh runtime)

remember about:debugging
*/


}); // Document onready