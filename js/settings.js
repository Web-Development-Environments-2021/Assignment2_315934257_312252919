var leftArrow = 37;
var downArrow = 40;
var rightArrow = 39;
var upArrow = 38;

$( function() {
    $( "#accordion" ).accordion();
  } );



$(function () {
$("#datepicker").datepicker();
});


$( function() {
    var handle = $( "#custom-handle" );
    $( "#slider" ).slider({
        min:50,
        max:90,
        value: 50,
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
        }
    });
  } );
$(function() {
    $('#color-picker1').spectrum({
        type: "text",
        showButtons: false,
        allowEmpty: false
      });
    $('#color-picker2').spectrum({
        type: "text",
        showButtons: false,
        allowEmpty: false
    });
    $('#color-picker3').spectrum({
        type: "text",
        showButtons: false,
        allowEmpty: false
    });
})


function rightMove(e){
    rightArrow = e.which;
    rightMoveInput.value = e.key;
    console.log(rightArrow);
}

function downMove(e){
    downArrow = e.which;
    downMoveInput.value = e.key;
}

function leftMove(e){
    leftArrow = e.which;
    leftMoveInput.value = e.key;
}

function upMove(e){
    upArrow = e.which;
    upMoveInput.value = e.key;
}