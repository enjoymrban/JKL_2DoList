$(function () {

    // Fetches all task and sorts them into Todo and Done
    $.ajax({
        url: "api/tasks",
        type: "GET",
        dataType: "json"
    }).done((json) => {
        // Prints a table with all tasks to the console
        console.table(json);
        $.each(json, (key, value) => {
            const {isDone} = value;
            let newTask = taskTemplate(value);
            if (isDone) {
                appendDone(newTask, value);
            } else {
                appendToDo(newTask, value);
            }

        });
    });

    

});

// Appends all sorted ToDos to the .todo Div
function appendToDo(newTask, value) {
    const {id} = value;
    $('.todo').append(newTask);

    // Checks when the checkbox is changed and updates the task --> sends it to Done
    $('#task' + id).change(() => {
        if ($('#task' + id).is(":checked")) {
            updateTask(value);
        }
    });

    //  Functions of the deleteIcon
    $('#deleteIcon' + id).click(() => {
        deleteTask(id);
    });
}

// Appends all sorted ToDos to the .todo Div
function appendDone(newTask, value) {
    const {id} = value;
    $('.done').append(newTask);
    $('#taskLabel' + id).css("text-decoration", "line-through");
    $('#task' + id).attr("checked", true);

    // Checks when the checkbox is changed and updates the task --> sends it to ToDo
    $('#task' + id).change(() => {
        if (!$('#task' + id).is(":checked")) {
            updateTask(value);
        }
    });

    //  Functions of the deleteIcon
    $('#deleteIcon' + id).click(() => {
        deleteTask(id);
    });
}


// Updates the task, removes it from its current list and appends it to the new list
function updateTask(value) {
    const {id, description, isDone} = value;
    $.ajax({
        url: 'api/tasks/' + id,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify({ "description": description, "isDone": !isDone }), //isDone gets inverted in every update, maybe change this!
        processData: false,
        success: function (data, textStatus, jQxhr) {
            const {id, isDone} = data;
            let newTask = taskTemplate(data);
            $('#taskDiv' + id).remove();
            if (isDone) {
                appendDone(newTask, data);
            } else {
                appendToDo(newTask, data);
            }
            // location.reload();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

// Delete a Task request
function deleteTask(id) {
    $.ajax({
        url: "api/tasks/" + id,
        type: "DELETE",
        dataType: "json",
        success: function (data) {
            const {id} = data;
            $('#taskDiv' + id).remove();
        },
        error: function (errorThrown) {
            console.log(errorThrown);
        }

    });
}

// Actionlistener to creat a new Task
$('#createTaskF').submit(() => {
    $.ajax({
        url: 'api/tasks',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({ "description": $('#taskDescription').val(), "isDone": false }),
        processData: false,
        success: function (data, textStatus, jQxhr) {
            let newTask = taskTemplate(data);
            appendToDo(newTask, data);
        },
        error: function (request, textStatus, error) {
            console.log(request.responseText);
        }
    });
    // Empties the input field!
    $('#taskDescription').val('');
});

// Showes and hids the done DIV when switching the slider in the nav
$('#showDoneC').change(() => {
    if ($('#showDoneC').is(":checked")) {
        console.log("showDone");
        $('#doneContainer').show();
    } else {
        $('#doneContainer').hide();
    }

});

// Templeta to create a new Task including text and icons
function taskTemplate(value) {
    const {id, description} =value;
    let newTask =
        `<div class="task form-check" id="taskDiv${id}">
            <div class="pretty p-icon p-jelly p-round maginFix">
                <input type="checkbox" id="task${id}">
                <div class="state p-info taskSettings">
                    <i class="icon material-icons">done</i>
                    <label id="taskLabel${id}">${description}</label>
                </div>
            </div>
            <div class="taskSettings">
                <i id="deleteIcon${id}" class='material-icons'>delete</i>
            </div>
        </div>`;
    return newTask;
}