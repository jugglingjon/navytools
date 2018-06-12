app.controller('chapterController', function($scope,$compile,$http) {

	//initialize chapter at 1
	$scope.startChapter = 1;
	$scope.chapterID=$scope.startChapter;

	var namespace='NETCtoolsAlphaChaptersB';

	//load questions data file
	$http.get('chapterQuestions.json').then(function(response){
		$scope.questions=response.data;

		//check local storage, init with that data if available, otherwise JSON file
		if(window.localStorage[namespace]){
			init(JSON.parse(window.localStorage[namespace]));
		}
		else{
			$http.get('chapters.json').then(function(response){
				init(response.data);
			});

		}

	});

	//reports current % correct	
	function reportScores(){
		console.log($scope.chapters[$scope.chapterID].correctPercent);
	}

	//save data to localstorage
	function saveData(){
		var correctCount=0;

		//see if answer is correct
		for(var answer in $scope.chapters[$scope.chapterID].answered){
			var chosenAnswer=$scope.chapters[$scope.chapterID].answered[answer];

			if($scope.questions[$scope.chapterID].questions[answer].answers[chosenAnswer].correct){
				correctCount++;
			}
		}
		$scope.chapters[$scope.chapterID].correctCount=correctCount;
		$scope.chapters[$scope.chapterID].correctPercent=Math.floor(($scope.chapters[$scope.chapterID].correctCount/$scope.questions[$scope.chapterID].questions.length)*100);
		reportScores();
		
		window.localStorage[namespace]=JSON.stringify($scope.chapters);
	}

	//initialize app with data
	function init(data){
		$scope.chapters=data;
	
		//toggle bookmark state for chapter in object
		$scope.bookmarkToggle= function(){
			if($scope.chapters[$scope.chapterID].bookmarked==true){
				$scope.chapters[$scope.chapterID].bookmarked=false
			}
			else{
				$scope.chapters[$scope.chapterID].bookmarked=true
			}
			$('.bookmark-toggle-btn').toggleClass('bookmarked');
			saveData();

		}

		//initialize current chapter (bookmark button, figures, alerts)
		function initChapter(){
			var bookmarked=($scope.chapters[$scope.chapterID].bookmarked===true)?'bookmarked':'';
			var elementToBeAdded = $(`<a href="#" class="bookmark-toggle-btn ${bookmarked}" ng-click="bookmarkToggle()"><span class="bookmark-toggle-icon"></span> Bookmark</a>`);
			var elementToBeAddedCompiled = $compile(elementToBeAdded)($scope);
			$('.portal').prepend(elementToBeAddedCompiled);

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

		//open chapter with argument ID
		$scope.openChapter=function(chapterID){
			$scope.chapterID=chapterID;
			$scope.chapterQuestions=$scope.questions[chapterID].questions;

			$('.portal').empty().load(chapterID+'.html',function(){

				for (var answer in $scope.chapters[$scope.chapterID].answered){

					$('.quiz').eq(parseInt(answer)).find('.quiz-answer').eq($scope.chapters[$scope.chapterID].answered[answer]).addClass('selected');
					
				}
				initChapter();
				reportScores();


		    });
		};

		$scope.selectAnswer = function(event){
			var el=$(event.target);
			el.addClass('selected').siblings().removeClass('selected');
			var answer=el.parent().children().index(el);
			var question=el.closest('.quiz').index('.quiz');
			if(!$scope.chapters[$scope.chapterID].answered){
				$scope.chapters[$scope.chapterID].answered={};
			}
			$scope.chapters[$scope.chapterID].answered[question]=answer;
			saveData();
			return false;
		};

		$('body').on('click','.quiz-answer',function(){
			return false;
		});


		//open starting chapter
		$scope.openChapter($scope.chapterID);
	};

});