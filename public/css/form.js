

$("input:checkbox").on('click',function(){
    $("input:checkbox").not(this).prop('checked', false);
})

// $(".partial-check, .fully-check").on('click', function(){
//     $(".form-block").slideToggle(500);
// })

function valueChanged(){
    if($('.partial-check').is(":checked"))   {
        $(".form-block").show(500);
        $("#next-date").html(function(){
            return "Next due date";
        })
    }
    else if ($(".fully-check").is(":checked")) {
        $(".form-block").show(2000);
        $("#next-date").html(function(){
            return "Date of second dose";
        })
    }
    else{ 
        $('.form-block').hide(500);
    }
}



if($(".fully-check").is(":checked")){
    $("#next-date").html(function(){
        return "Bhosdike";
    })
}