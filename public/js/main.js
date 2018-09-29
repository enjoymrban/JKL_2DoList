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
    }


    function updateTask(value) {
        $.ajax({
            url: 'api/tasks/' + value.id,
            dataType: 'json',
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify({ "discription": value.discription, "isDone": !value.isDone }),
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

    // Actionlistener to creat a new Task
    $('#createTaskF').submit(() => {
        $.ajax({
            url: 'api/tasks',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ "discription": $('#taskDescription').val(), "isDone": false }),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                let newTask = taskTemplate(data);
                appendToDo(newTask, data);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });


    $('#showDoneC').change(() => {
        if ($('#showDoneC').is(":checked")) {
            console.log("showDone");
            $('#doneContainer').show();
        } else {
            $('#doneContainer').hide();
        }

    });


    function taskTemplate(value){
        let newTask = "<div class='form-check' id='taskDiv" + value.id + "'><input class='form-check-input' type='checkbox' id='task" + value.id + "'><label class='form-check-label' for='task" + value.id + "' id='taskLabel" + value.id + "'>" + value.discription + "</label></div>";
        return newTask;
    }



});