app.controller('chapterController', function($scope,$compile,$http) {

	$scope.startChapter = 1;
	$scope.chapterID=$scope.startChapter;

	$http.get('chapters.json').then(function(response){
		$scope.chapters=response.data;
	});

	function initChapter(){
		$('figure').each(function(){
			var figure=$(this).attr('data-id');

			$(this).prepend('Figure '+figure+' &mdash; ');
			$(this).wrapInner('<figcaption></figcaption>');
			var imageUrl='media/'+figure+'.jpg';
			var img=$('<img src="'+imageUrl+'">');
			$(this).prepend(img);
		});
		

		$('.alert-note').each(function(){
			$(this).prepend('<h5>NOTE</h5>');
		});

		$('.alert-warning').each(function(){
			$(this).prepend('<h5>WARNING</h5>');
		});

		$('.alert-caution').each(function(){
			$(this).prepend('<h5>CAUTION</h5>');
		});


	}

	$scope.openChapter=function(chapterID){
		$('.portal').empty().load(chapterID+'.html',function(){

			$('.portal').append($('<div class="quiz"></div>'));


			$http.get('chapterQuestions.json').then(function(response){
				$scope.questions=response.data[chapterID].questions;
		    });
			initChapter();
		});
	};
	$scope.openChapter($scope.chapterID);


});