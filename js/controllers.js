app.controller('chapterController', function($scope,$http) {

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
			initChapter();
		});
	};
	$scope.openChapter();


});