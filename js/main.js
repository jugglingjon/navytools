

// ====================================
// 				^GLOBALS
// ====================================

var $globalFadeTime=700,
	$currentScreen='screen-home',
	$data;

// ====================================
// 				^UTILITIES
// ====================================

//randomize jquery object children
$.fn.randomize = function(selector){
    (selector ? this.find(selector) : this).parent().each(function(){
        $(this).children(selector).sort(function(){
            return Math.random() - 0.5;
        }).detach().appendTo(this);
    });

    return this;
};


// ====================================
// 				^SCREEN CONTROL
// ====================================



//changes to targeted screen
//callback object: {before:<callback before fadein begins>, after: <callback after faded in>}
function changeScreen(screenClass, callbackObj){
	
	//manage current and last screen variables
	$lastScreen=$currentScreen;
	$currentScreen=screenClass;

	var elementsToFade=$('.screen:not(.'+screenClass+')');
	var fadeCount=elementsToFade.length;

	elementsToFade.fadeOut($globalFadeTime, function(){
		if(--fadeCount>0) return;

		if(callbackObj&&callbackObj.before){
			callbackObj.before();
		}
		
		$('.'+screenClass).fadeIn($globalFadeTime,function(){
			if(callbackObj&&callbackObj.after){
				callbackObj.after();
			}
		});
	});
}


//generic link type to change between screens
$('[data-to]').on('click',function(){
	changeScreen($(this).attr('data-to'));
	return false;
});



// ====================================
// 				^EVENTS
// ====================================

$(document).ready(function(){
	
	//implement fastclick
	FastClick.attach(document.body);



});