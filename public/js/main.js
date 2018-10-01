$(function () {

    $.ajax({
        url: "api/tasks",
        type: "GET",
        dataType: "json"
    }).done((json) => {
        $.each(json, (key, value) => {
            let newTask = taskTemplate(value);
            if (value.isDone) {
                appendDone(newTask, value);
            } else {
                appendToDo(newTask, value);
            }
            console.log(value);
        });
    });

    function appendToDo(newTask, value) {
        $('.todo').append(newTask);
        $('#task' + value.id).change(() => {
            if ($('#task' + value.id).is(":checked")) {
                updateTask(value);
            }

        });
        $('#deleteIcon' + value.id).click(() => {
            deleteTask(value.id);
        });
    }

    function appendDone(newTask, value) {
        $('.done').append(newTask);
        $('#taskLabel' + value.id).css("text-decoration", "line-through");
        $('#task' + value.id).attr("checked", true);
        $('#task' + value.id).change(() => {
            if (!$('#task' + value.id).is(":checked")) {
                updateTask(value);
            }

        });
        $('#deleteIcon' + value.id).click(() => {
            deleteTask(value.id);
        });
    }


    function updateTask(value) {
        $.ajax({
            url: 'api/tasks/' + value.id,
            dataType: 'json',
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify({ "description": value.description, "isDone": !value.isDone }),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                let newTask = taskTemplate(data);
                $('#taskDiv' + data.id).remove();
                if (data.isDone) {
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

    function deleteTask(id) {
        $.ajax({
            url: "api/tasks/" + id,
            type: "DELETE",
            dataType: "json",
            success: function (data) {
                $('#taskDiv' + data.id).remove();
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
        $('#taskDescription').val('');
    });

    $('#showDoneC').change(() => {
        if ($('#showDoneC').is(":checked")) {
            console.log("showDone");
            $('#doneContainer').show();
        } else {
            $('#doneContainer').hide();
        }

    });


    function taskTemplate(value) {
        let newTask =
            `<div class="task form-check" id="taskDiv${value.id}">
                <div class="pretty p-icon p-jelly p-round">
                    <input type="checkbox" id="task${value.id}">
                        <div class="state p-info taskSettings">
                            <i class="icon material-icons">done</i>
                            <label id="taskLabel${value.id}">${value.description}</label>            
                        </div>
                </div> 
                <div class="taskSettings">
                    <i id="deleteIcon${value.id}" class='material-icons'>delete</i>
                </div>
            </div>`;
        return newTask;
    }

});

