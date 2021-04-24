var leftArrow = 37;
var downArrow = 40;
var rightArrow = 39;
var upArrow = 38;

$( function() {
    $( "#accordion" ).accordion({
        collapsible: true,
        heightStyle: "content"
    });
  } );



$(function () {
$("#datepicker").datepicker();
});


$( function() {
    let handle = $( "#food-custom-handle" );
    $( "#food-slider" ).slider({
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

$( function() {
    let handle = $( "#monster-custom-handle" );
    $( "#monster-slider" ).slider({
        min:1,
        max:4,
        value: 2,
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

function randomizeSettings(){
    //randomize num of monsters
    let randomMonstersNum = Math.floor(Math.random() * 4) + 1;
    $('#monster-slider').slider("option", "value", randomMonstersNum);
    $('#monster-custom-handle').text(randomMonstersNum);
    //monsters speed
    let speedOptions = ['8', '6', '4']; // 8 - Slow, 6 - Medium, 4 - High
    let randomSpeed = Math.floor(Math.random() * 3);
    speed.value = speedOptions[randomSpeed];
    console.log(speed.value);
    //food colors
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    $('#color-picker1').spectrum('set', randomColor);
    randomColor =  Math.floor(Math.random()*16777215).toString(16);
    $('#color-picker2').spectrum('set', randomColor);
    randomColor =  Math.floor(Math.random()*16777215).toString(16);
    $('#color-picker3').spectrum('set', randomColor);
    // game time
    let randomTime = Math.floor(Math.random()*240) + 60;
    gameTime.value = randomTime;
    // food amount
    let randomFoodAmt = Math.floor(Math.random()*40) + 50;
    $('#food-slider').slider("option", "value", randomFoodAmt);
    $('#food-custom-handle').text(randomFoodAmt);
}

function gameTimeValidation(){
    let input = gameTime;
    if(parseInt(input.value) < 60){
        input.value = 60;
    }
    else if(parseInt(input.value) > 300){
        input.value = 300;
    }
}