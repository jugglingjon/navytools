

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
// 				^TOPIC NAV
// ====================================

//topic search/filter
$('#topicNav-search').keyup(function(){

	if($('#topicNav-search').val()!=''){
		$('#topicNav li').hide();
		//$('#topicNav li a span').css('display','block');
		$('#topicNav li a:containsIN("'+$(this).val()+'")').parent().show();
		$('#topicNav-search-clear').show().siblings('.icon').hide();
		$('#topicNav li:visible:even').addClass('even');
		$('#topicNav li:visible:odd').removeClass('even');
	}
	else{
		$('#topicNav li').show();
		//$('#topicNav li a span').css('display','none');
		$('#topicNav-search-clear').hide().siblings('.icon').show();
		resetTopicNav();
	}

});

//maintain clicks to search wrapper
$('.topicNav-search-wrapper').click(function(event){
	var targ=$(event.target);

	//if click to search clear button, clear search box
	if(targ.is('#topicNav-search-clear')){
		resetTopicNav();
		$('#topicNav-search-clear').hide().siblings('.icon').show();
	}

	event.stopPropagation();
});

//reset topic nav textbox value and list items
function resetTopicNav(){
	$('#topicNav-search').val('');
	$('#topicNav li').show().removeClass('even');
	$('#topicNav li:even').addClass('even');

	$('.topicNav-bookmarks-btn').removeClass('filter-selected');
	$('#topicNav-search').removeAttr('disabled');
}

// ====================================
// 				^BOOKMARKS
// ====================================

//bookmark filter{
$('.topicNav-bookmarks-btn').click(function(){
	$(this).toggleClass('filter-selected');

	if($(this).hasClass('filter-selected')){
		$('#topicNav-search').attr('disabled','disabled');
		$('#topicNav li').hide();
		$('#topicNav li a.bookmarked').parent().show();
	}
	else{
		$('#topicNav-search').removeAttr('disabled');
		$('#topicNav li').show();
	}

	

	return false;
});

// ====================================
// 				^EVENTS
// ====================================

$(document).ready(function(){
	
	//implement fastclick
	FastClick.attach(document.body);

	resetTopicNav();

	

	//topicNav button
	$('.topicNav-button').click(function(){
		$('.topicNav-wrapper, .shroud').toggle();
		resetTopicNav();
		return false;
	});

	//figure zoom
	$('body').on('click','figure',function(){
		$('#figureModal .modal-title').text($(this).find('figcaption').text());
		$('#figureModal .modal-body').empty().append($(this).find('img').clone());
		$('#figureModal').modal();
	});
	//clicks to window clear nav dropdowns
	$(window).click(function() {
		$('#sectionNav, .topicNav-wrapper').hide();
		$('.shroud').hide();
		resetTopicNav();
	});
});