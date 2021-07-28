

$("input:checkbox").on('click',function(){
    $("input:checkbox").not(this).prop('checked', false);
})

// $(".partial-check, .fully-check").on('click', function(){
//     $(".form-block").slideToggle(500);
// })

// $(document).ready(function(){
//     if($(".partial-check").is(":checked",false) && $(".fully-check").is(":checked",false)){
//         $(".form-block").hide();
//     }
// });


function valueChanged(){

    if($('.partial-check').is(":checked"))   {
        $(".form-floating").show(700);
        $("#next-date").html(function(){
            return "Next due date";
        })
    }
    else if ($(".fully-check").is(":checked")) {
        $(".form-floating").show(700);
        $("#next-date").html(function(){
            return "Date of second dose";
        })
    }
    else{ 
        $('.form-floating').hide(500);
    }
}

$(function(){
    var requiredCheckboxes = $('.checkbox[required]');
    requiredCheckboxes.change(function(){
        if(requiredCheckboxes.is(':checked')) {
            requiredCheckboxes.removeAttr('required');
        } else {
            requiredCheckboxes.attr('required', 'required');
        }
    });
});

// function valueChanged(){

//     if($('.partial-check').is(":checked"))   {
//         $(".form-block").show(700);
//         $("#next-date").html(function(){
//             return "Next due date";
//         })
//     }
//     else if ($(".fully-check").is(":checked")) {
//         $(".form-block").show(700);
//         $("#next-date").html(function(){
//             return "Date of second dose";
//         })
//     }
//     else{ 
//         $('.form-block').hide(500);
//     }
// }



