app.controller('chapterController', function($scope,$compile,$http) {

	//initialize chapter at 1
	$scope.startChapter = 1;
	$scope.chapterID=$scope.startChapter;

	var namespace='NETCtoolsAlphaChapters';

	//check local storage, init with that data if available, otherwise JSON file
	if(window.localStorage[namespace]){
		init(JSON.parse(window.localStorage[namespace]));
	}
	else{
		$http.get('chapters.json').then(function(response){
			init(response.data);
		});

	}

	//save data to localstorage
	function saveData(){
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
			$('.portal').empty().load(chapterID+'.html',function(){

				$('.portal').append($('<div class="quiz"></div>'));

				$http.get('chapterQuestions.json').then(function(response){
					$scope.questions=response.data[chapterID].questions;
			    });
				initChapter();
			});
		};

		//open starting chapter
		$scope.openChapter($scope.chapterID);
	};

});