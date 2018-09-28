$(function () {    

    for (let s = 0; s < 2; s++) {
        $.ajax({
            url: "api/tasks?status=" + s,
            type: "GET",
            dataType: "json"
        }).done((json) => {
            $.each(json, (key, value) => {
                // let newTask = "<div class='task border-left'><p>" + value.discription + "</p></div>";
                // $('div#' + s + 'TaskContainer').append(newTask);

                console.log(value);
            });

        });
    }

    
});