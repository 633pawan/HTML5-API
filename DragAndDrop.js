window.onload = init;

var senators = {};

function init() {
	var temp = window.localStorage.getItem("values");
	
	if(temp==null)
	{	doXHR(); }
	else
	{
		senators = JSON.parse(temp);
		putVals();
	}
	
}

function doXHR()
{
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
	  var sens = xhr.responseXML.getElementsByTagName("senator");
	  
	  var mem = document.getElementById("members");
	  for(i=0;i<sens.length;i++) {

		//mem.innerHTML += '<li draggable="true" >' + sens[i].childNodes[1].innerHTML + '</li>';
		senators[sens[i].childNodes[1].innerHTML] = {};
		senators[sens[i].childNodes[1].innerHTML].party = sens[i].childNodes[3].innerHTML;
		senators[sens[i].childNodes[1].innerHTML].voted = false;
	}
	
	putVals();
		
	};
	xhr.onerror = function() {
	  console.log("Error while getting XML.");
	};
	xhr.open("GET", "partyList.xml");
	xhr.responseType = "document";
	xhr.send();
}

function putVals()
{
	var mem = document.getElementById("members");
	var dem = document.getElementById("democrats");
	var rep = document.getElementById("republicans");
	for (var name in senators) {
	  if (senators.hasOwnProperty(name)) {
		  if(senators[name].voted == false)
		  {
			mem.innerHTML += '<li draggable="true" >' + name + '</li>';
		}
		else if(senators[name].party == "Democrat")
		{
			dem.innerHTML += '<li>' + name + '</li>';
		}
		else
		{
			rep.innerHTML += '<li>' + name + '</li>';
		}
		
	  }
	}
	
	loadDemo();
}

    var democrats = [];
    var republicans = [];

    
    var democratsList;
    var republicansList;

    // called at the beginning of any drag
    function handleDragStart(evt) {

        // our drag only allows copy operations
        evt.effectAllowed = "copy";

        // the target of a drag start is one of our members
        // the data for a member is either their name or age
        evt.dataTransfer.setData("text/plain", evt.target.textContent);
        

        // highlight the potential drop targets
        democratsList.className = "validtarget";
        republicansList.className = "validtarget";

        return true;
    }

    // stop propagation and prevent default drag behavior
    // to show that our target lists are valid drop targets
    function handleDragEnter(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        return false;
    }

    function handleDragLeave(evt) {
        return false;
    }

    // for better drop feedback, we use an event for dragging
    // over the surrounding control as a flag to turn off
    // drop highlighting
    function handleDragOverOuter(evt) {

        // due to Mozilla firing drag over events to
        // parents from nested children, we check the id
        // before handling
        if (evt.target.id == "democratsField")
          democratsList.className = "validtarget";

        else if (evt.target.id == "republicansField")
          republicansList.className = "validtarget";

        evt.stopPropagation();
        return false;
    }

    // if the user drags over our list, show
    // that it allows copy and highlight for better feedback
    function handleDragOverDemocrats(evt) {
        evt.dataTransfer.dropEffect = "copy";
        evt.stopPropagation();
        evt.preventDefault();
		if(senators[evt.dataTransfer.getData("text/plain")].party == "Democrat")
			democratsList.className = "highlightedDemocrats";
        return false;
    }

    function handleDragOverRepublicans(evt) {
        evt.dataTransfer.dropEffect = "copy";
        evt.stopPropagation();
        evt.preventDefault();
		
		if(senators[evt.dataTransfer.getData("text/plain")].party == "Republican")
			republicansList.className = "highlightedRepublicans";
        return false;
    }


    // when the user drops on a target list, transfer the data
    function handleDrop(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        var dropTarget = evt.target;

        // use the text flavor to get the name of the dragged item
        var text  = evt.dataTransfer.getData("text/plain");

        var group = democrats;
        var list  = democratsList;


        // if the drop target list was the racer list, grab an extra
        // flavor of data representing the member age and prepend it
        if ((dropTarget.id != "democrats") &&
            (dropTarget.parentNode.id != "democrats")) {
            
            group = republicans;
            list  = republicansList;
        }
        
        var incorrectDrop = false;
        
        if( (dropTarget.id == "democrats") && (senators[text].party!="Democrat") )
			incorrectDrop = true;
		if( (dropTarget.id == "republicans") && (senators[text].party!="Republican") )
			incorrectDrop = true;

		if(!incorrectDrop)
		{
			senators[text].voted = true;
			window.localStorage.setItem("values",JSON.stringify(senators));
			

			// for simplicity, fully clear the old list and reset it
			if (group.indexOf(text) == -1) {
				group.push(text);
				group.sort();

				// remove all old children
				while (list.hasChildNodes()) {
					list.removeChild(list.lastChild);
				}

				// push in all new children
				[].forEach.call(group, function(person) {
					var newChild = document.createElement("li");
					newChild.textContent = person;
					list.appendChild(newChild);
				});
			}
		}

        return false;
    }

    // make sure to clean up any drag operation
    function handleDragEnd(evt) {

        // restore the potential drop target styles
        democratsList.className = null;
        republicansList.className = null;

        return false;
    }

    function loadDemo() {

       democratsList = document.getElementById("democrats");
       republicansList = document.getElementById("republicans");

       // our target lists get handlers for drag enter, leave, and drop
       var lists = [democratsList, republicansList];
       [].forEach.call(lists, function(list) {
           list.addEventListener("dragenter", handleDragEnter, false);
           list.addEventListener("dragleave", handleDragLeave, false);
           list.addEventListener("drop", handleDrop, false);
       });

       // each target list gets a particular dragover handler
       democratsList.addEventListener("dragover", handleDragOverDemocrats, false);
       republicansList.addEventListener("dragover", handleDragOverRepublicans, false);

       // the fieldsets around our lists serve as buffers for resetting
       // the style during drag over
       var fieldsets = document.querySelectorAll("#democratsField, #republicansField");
       [].forEach.call(fieldsets, function(fieldset) {
           fieldset.addEventListener("dragover", handleDragOverOuter, false);
       });

       // each draggable member gets a handler for drag start and end
       var members = document.querySelectorAll("#members li");
       [].forEach.call(members, function(member) {
           member.addEventListener("dragstart", handleDragStart, false);
           member.addEventListener("dragend", handleDragEnd, false);
       });

    }
