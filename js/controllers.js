app.controller('chapterController', function($scope,$compile,$http) {

	$scope.startChapter = 1;
	$scope.chapterID=$scope.startChapter;

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

	$scope.openChapter=function(){
		console.log($scope.chapterID);
		$('.portal').load($scope.chapterID+'.html',function(){

			$('.portal').append($('<div class="quiz"></div>'));


			$http.get('chapterQuestions.json').then(function(response){
				$scope.questions=response.data[$scope.chapterID].questions;
				// var quiz=$('<div>').load('template-quiz.html');
				// var compiled=$compile(quiz[0])($scope);
				// $('.portal .quiz').append(compiled);

		    	// console.log(response.data[$scope.chapterID].questions);
		    	// $.each(response.data[$scope.chapterID].questions,function(){
		    	// 	var newQuestion=$(`<div class="questionWrapper">


		    	// 		</div>`);
		    	// 	$('.portal .quiz').append(this.question+'<br>');
		    	// });

		    });
			initChapter();
		});
	};
	$scope.openChapter();


});