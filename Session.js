window.onload=init;
function init(){


	var addButton = document.getElementById("addButton");
	addButton.onclick =addItem;
	var removeButton = document.getElementById("removeButton");
	removeButton.onclick = removeItem;
	var clearButton = document.getElementById("clearButton");
	clearButton.onclick = clearItem;
	updateDOMItems();

}

function addItem(event){
	var key = document.getElementById("key").value;
	var valu = document.getElementById("valu").value;
// Add Item To The  Session Storage
window.sessionStorage.setItem(key,valu);
updateDOMItems();
}
function removeItem(event){
	var key = document.getElementById("key").value;
// Remove Item From Session Storage
window.sessionStorage.removeItem(key);
updateDOMItems();
}
function clearItem(){
	window.sessionStorage.clear();
	updateDOMItems();

}
function updateDOMItems(){
	var itemList = document.getElementById("items");
// Clear Shown List	
	itemList.innerHTML = "";
// Add Current Items to the List
for(key in window.sessionStorage){
addItemToDOM(key,sessionStorage[key]);	
}	

}
function addItemToDOM(key,valu){
	var items = document.getElementById("items");
// create a line of item and add to the end of the list
var item = document.createElement("li");
item.innerHTML = key +" : " + valu;
items.appendChild(item);
}
