function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}
function onError(error) {
  console.log(`Error: ${error}`);
}

const kGroupSep = String.fromCharCode(29);
const kRecordSep = String.fromCharCode(30);
const kUnitSep = String.fromCharCode(31);
var items = [];

var gettingItem = browser.storage.sync.get('linkChanger');
gettingItem.then((res) => {
	res.linkChanger.split(kGroupSep).forEach(function(saveString){
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
			
			browser.menus.create({
			  id: "param-changer-" + items.length,
			  title: elements[0],
			  contexts: ["link"]
			}, onCreated);
			items.push([additions, deletions]);
		}
	});
});

// 
browser.menus.onClicked.addListener((info, tab) => {
	var index = info.menuItemId.substring(14);
	var additions = items[index][0];
	var deletions = items[index][1];
	
	var parser = document.createElement('a');
	parser.href = info.linkUrl;
	
	var baseUrl = [parser.protocol, '//', parser.host, parser.pathname].join('');
	
	var params = {};
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	
	deletions.forEach(function(deletion){
		if (deletion) {
			delete params[deletion];
		}
	});
	additions.forEach(function(pair){
		if (pair && Array.isArray(pair) && pair.length == 2) {
			params[pair[0]] = pair[1];
		}
	});
	
	vars = [];
	for (var key in params) {
		vars.push( key + "=" + params[key] );
	}
	var newUrl = baseUrl + "?" + vars.join("&");
	
	var creating = browser.tabs.create({
      url: newUrl
	});
    creating.then(onCreated, onError);
});