$(function () {


    $.ajax({
        url: "api/tasks",
        type: "GET",
        dataType: "json"
    }).done((json) => {
        $.each(json, (key, value) => {
            let newTask = "<div class='form-check'><input class='form-check-input' type='checkbox' id='task" + value.id + "'><label class='form-check-label' for='task" + value.id + "'>" + value.discription + "</label></div>";
            if (value.isDone) {
                $('.done').append(newTask);
                $('#task'+value.id).attr("checked", true);
                $('#task' + value.id).change(() => {
                    if(!$('#task' + value.id).is(":checked")){
                       updateTask(value);
                    }

                });
            } else {
                $('.todo').append(newTask);
                $('#task' + value.id).change(() => {
                    if($('#task' + value.id).is(":checked")){
                       updateTask(value);
                    }

                });
            }
            console.log(value);
        });
    });


    function updateTask(value){
        $.ajax({
            url: 'api/tasks/'+value.id,
            dataType: 'json',
            type: 'put',
            contentType: 'application/json',
            data: JSON.stringify({ "discription": value.discription, "isDone": !value.isDone }),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                location.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });

    }

    // Actionlistener to creat a new Task
    $('#createTaskB').click(()=>{
        $.ajax({
            url: 'api/tasks',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({ "discription": $('#taskDescription').val(), "isDone": false }),
            processData: false,
            success: function (data, textStatus, jQxhr) {
                location.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });




});