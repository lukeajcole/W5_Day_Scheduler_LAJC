var mainContainer = $('#schedContainer');
var currTime = $('#currentDay');
var startEl = $('#startHour');
var endEl = $('#endHour');
var startHour;
var endHour;
var currHour = moment().format("HH");
var i;

//get the data from the local storage or make it
var noteStore = initializeStorage();

//pull the start and end times from the stored object
startHour = noteStore['startHr'];
endHour = noteStore['endHr'];

//put the start and end values on the screen
startEl.val(startHour);
endEl.val(endHour);

//Update the sotrage object when the user changes the value in the input box AND clicks away from it
startEl.on('change',function(){
    noteStore['startHr'] = startEl.val();
    localStorage.setItem('noteStore', JSON.stringify(noteStore));
})

endEl.on('change',function(){
    noteStore['endHr'] = endEl.val();
    localStorage.setItem('noteStore', JSON.stringify(noteStore));
})


// Make the hour blocks of the cheduler
var scheduleEl = makeScheduleEl(noteStore);
// Append the schedule
mainContainer.append(scheduleEl);

//Set Today's date
var today = moment().format("[Today is] LL")
currTime.text(today);

noteStore['date'] = moment().format("YYYYMMDD");

//Call the function to set the style that indicates past, present, future
setItemState();
//Start the interval to check for the current hour
startTimer();

//Look for a click anywhere in the main container, but only do something when the target is the save button
mainContainer.on('click', saveInput);


/////////////////////FUNCTIONS////////////////////

function saveInput (event) {
    var target = $(event.target);

    if (target.is("i")) {
        itemNote = target.parent().siblings('#noteEl').children().children().val();
        console.log(itemNote);
        itemHour = 'h' + target.parents('td').siblings('#hourLbl').text();
        noteStore[itemHour] = itemNote;
        localStorage.setItem('noteStore', JSON.stringify(noteStore));
    } else if (target.is("button")) {
        itemNote = target.parent().siblings('#noteEl').children().children().val();
        console.log(itemNote);
        itemHour = 'h' + target.parent().siblings('#hourLbl').text();
        noteStore[itemHour] = itemNote;
        localStorage.setItem('noteStore', JSON.stringify(noteStore));
    }
}

function makeScheduleEl (noteStore) {
    var scheduleEl = $("<div>");
    var headRow = $("<tr>");
    headRow.addClass('row border-top border-bottom  headRow')
    headRow.append("<td class='col-sm-1 text-center m-auto'>HOUR</td>");
    headRow.append("<td class='col-sm-10 text-center m-auto'>SCHEDULE NOTES</td>");
    headRow.append("<td class='col-sm-1 text-center m-auto'>SAVE BUTTON</td>");
    scheduleEl.append(headRow);
    startHour = parseInt(startHour);
    endHour = parseInt(endHour);
    for (i=startHour; i < endHour; i++){
        console.log("row " + i);
        //create the row element
        var itemEl = $('<tr>');
        itemEl.attr('id','h' + i);
        itemEl.addClass('row border-top border-bottom');
        //create and append hour label
        var hourEl = $('<td>');
        hourEl.text(i);
        hourEl.addClass('col-sm-1 text-center m-auto text-dark');
        hourEl.attr('id','hourLbl');
        //create and append note element
        var noteEl = $('<td>');
        noteEl.attr('id','noteEl');
            //create and append form element
            var noteForm = $('<div>');
            noteForm.addClass('form-group align-items-center');
            var noteInput = $('<textarea>');
            noteInput.addClass('form-control m-2');
            noteInput.text(noteStore['h' + i]);
            noteForm.append(noteInput);
            noteEl.append(noteForm);
        
        noteEl.addClass('col-sm-10 border-left');
        //create and append save button
        var btnEl = $('<td>');
        btnEl.addClass('col-sm-1 border-left text-center');
        var saveBtn = $("<button>");
        saveBtn.type = "button";
        saveBtn.addClass("btn btn-primary saveBtn m-auto text-dark");
        var iEl = $('<i>');
        iEl.addClass('fas fa-save');
        saveBtn.append(iEl);
        btnEl.append(saveBtn);

        itemEl.append(hourEl, noteEl, btnEl);
        scheduleEl.append(itemEl);
    }
    
    return scheduleEl;
}


function initializeStorage() {
    var i;
    var storeChk = localStorage.getItem('noteStore');
    if (storeChk === null){
        var noteStore = {date:"20210711", startHr: 0, endHr:24};
        for (i=0; i < 24; i++){
            noteStore["h" + i] = '';
        }
        localStorage.setItem('noteStore', JSON.stringify(noteStore));
    } else {
        var noteStore = JSON.parse(localStorage.getItem('noteStore'));
    }

    return noteStore;
}

function startTimer (){
    interval = setInterval(function(){
        currHour = moment().format("HH");
        setItemState();
    }, 10000)
}

function setItemState (){
    for (i=startHour; i < endHour; i++){
        var currEl = $('#h' + i);
        if (i < currHour) {
            // set class = past
            currEl.addClass('past');
            currEl.removeClass('present future')
        } else if (i == currHour) {
            //set class = present
            console.log(i);
            currEl.addClass('present');
            currEl.removeClass('past future')
        } else if (i > currHour) {
            //set class = future
            currEl.addClass('future');
            currEl.removeClass('present past')
        }

    }

}