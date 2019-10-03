app.controller('chapterController', function($scope,$compile,$http) {
	$scope.version="1.5"
	$scope.numbersToLetters={
		"0": "A",
		"1": "B",
		"2": "C",
		"3": "D"
	}

	//initialize chapter at 1
	$scope.startChapter = 1;
	$scope.chapterID=$scope.startChapter;

	var namespace='NETCtoolsAlphaChaptersD';

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

	$scope.initTest = function(){
		$scope.testing=true;
		$http.get('testSHORT.json').then(function(response){
			

			$scope.allTestData=response.data;

			$scope.testMapping=[];
			for(key in $scope.allTestData){
				$scope.testMapping.push(key);
			}
			console.log($scope.testMapping);

			$scope.currentTestIndex=0;
			$scope.currentTestData=$scope.allTestData[$scope.testMapping[$scope.currentTestIndex]];
		});
	}

	$scope.modalAlert = function(title,message){
		$('#alertModal .modal-title').text(title);
		$('#alertModal .modal-body').text(message);
		$('#alertModal').modal();
	}

	$scope.loadTest = function(toIndex){
		if($('.test-area .quiz').length === $('.test-area .quiz a.selected').length || toIndex < $scope.currentTestIndex){
			$scope.currentTestIndex=toIndex;
			$scope.currentTestData=$scope.allTestData[$scope.testMapping[$scope.currentTestIndex]];
		}
		else{
			$scope.modalAlert('Missing Answers','Answer all questions before proceeding.');
		}

	}

	$scope.answerClass = function(questionIndex,answerIndex){
		var outputClass='';

		if($scope.currentTestData.questions[questionIndex].answers[answerIndex].correct){
			outputClass+='test-correct ';
		}
		else{
			outputClass+='test-incorrect ';
		}

		if($scope.currentTestData.questions[questionIndex].selected >= 0){
			if($scope.currentTestData.questions[questionIndex].selected===answerIndex){
				outputClass+='selected ';
			}
		}

		return outputClass;
	}

	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	$scope.sendCert = function(){
		// if(device==null){
		// 	var device={
		// 		manufacturer: 'Apple',
		// 		model: 'iphone',
		// 		platform: 'iOS',
		// 		version: '11.1'
		// 	};
		// }
		var guid=uuidv4();
		var deviceType=($(window).width()>500)?'Tablet':'Phone';
		var txt=`<?xml version="1.0" encoding="utf-8"?>
<course_completion>
	<Course_Completion_ID>${guid}</Course_Completion_ID>
	<DODID>${$scope.dodid}</DODID>
	<Course_Number>NRTC-NAVEDTRA-14256A-TEST</Course_Number>
	<Pre_Test_Score>0</Pre_Test_Score>
	<Post_Test_Score>${$scope.score}</Post_Test_Score>
	<Completion_Date>${moment().format()}</Completion_Date>
	<Device_Information>
		<Device_Manufacturer>${device.manufacturer}</Device_Manufacturer>
		<Device_Model>${device.model}</Device_Model>
		<Device_Type>${deviceType}</Device_Type>
		<Device_OS_Name>${device.platform}</Device_OS_Name>
		<Device_OS_Version>${device.version}</Device_OS_Version>
	</Device_Information>
</course_completion>`;
// 		var txt=`<?xml version="1.0" encoding="utf-8"?>
// <course_completion>
// 	<Course_Completion_ID>${guid}</Course_Completion_ID>
// 	<DODID>1234567890</DODID>
// 	<Course_Number>NRTC-NAVEDTRA-14256A-TEST</Course_Number>
// 	<Pre_Test_Score>0</Pre_Test_Score>
// 	<Post_Test_Score>${$scope.score}</Post_Test_Score>
// 	<Completion_Date>${moment().format()}</Completion_Date>
// 	<Device_Information>
// 		<Device_Manufacturer>${device.manufacturer}</Device_Manufacturer>
// 		<Device_Model>${device.model}</Device_Model>
// 		<Device_Type>${deviceType}</Device_Type>
// 		<Device_OS_Name>${device.platform}</Device_OS_Name>
// 		<Device_OS_Version>${device.version}</Device_OS_Version>
// 	</Device_Information>
// </course_completion>`;
		console.log(txt);



		var base64 = Base64.encode(txt);
		var blobx = b64toBlob(base64, 'text/xml');

		var zip = new JSZip();
		zip.file(guid+'.xml',blobx);

		zip.generateAsync({type:"blob"}).then(function (blob) {
			var reader = new FileReader();
			reader.readAsDataURL(blob); 
			reader.onloadend = function() {
				base64data = reader.result;                
				//console.log(base64data);
				console.log( base64data.substr(base64data.indexOf(',')+1) );
				var b64string = 'base64:'+guid+'.idk//'+ base64data.substr(base64data.indexOf(',')+1);

				cordova.plugins.email.open({
				    to:      'NTMPS.Mobile.Support@navy.mil',
				    subject: 'Completion Certificate',
				    body:    'NRTC-NAVEDTRA-14256A-TEST\n\nDo not change the subject line of this email. Changing the subject line may prevent credit for completing this course.',
				    attachments: [b64string]
				});
			}
			
		});
		return false;

	}

	$scope.gradeTest = function(){
		var fullset=[];
		for(key in $scope.allTestData){
			$.each($scope.allTestData[key].questions,function(){
				fullset.push(this);
			});
		}

		var correct=0;
		var total=fullset.length;

		for(var i=0;i<fullset.length;i++){
			if(fullset[i].selected>=0){
				if(fullset[i].answers[fullset[i].selected].correct){
					correct++;
				}
			}
			
		}
		console.log(correct,total,correct/total);
		$scope.score=correct/total;
		$scope.passed = ($scope.score>=.8)?true:false;
		$scope.score=Math.floor($scope.score*100);
		$('#gradeModal').modal({backdrop: 'static'});

	}

	$scope.xgradeTest = function(){
		var fullset=[];

		$.each($scope.allTestData[$scope.currentTestIndex].questions,function(){
			fullset.push(this);
		});
		console.log(fullset);

		var correct=0;
		var total=fullset.length;

		for(var i=0;i<fullset.length;i++){
			if(fullset[i].selected>=0){
				if(fullset[i].answers[fullset[i].selected].correct){
					correct++;
				}
			}
			
		}
		console.log(correct,total,correct/total);
		// $scope.score=correct/total;
		// $scope.passed = ($scope.score>=.8)?true:false;
		// $scope.score=Math.floor($scope.score*100);
		// $('#gradeModal').modal({backdrop: 'static'});

	}

	//resets bookmark and progress data
	$scope.resetData = function(){
		if(confirm("This will reset all bookmarks and saved progress, do you want to continue?")){
			$http.get('chapters.json').then(function(response){
				$('.quiz-answer').removeClass('selected');
				init(response.data);
			});
		}		
	}

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
		saveData();
	
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

			$('#search').val('').trigger('keyup');
			
			$('figure').each(function(){
				var figure=$(this).attr('data-id');
				if($(this).hasClass('video')){
					$(this).prepend('<span>Figure '+figure+'</span> &mdash; ');
					$(this).wrapInner('<figcaption></figcaption>');
					var videoUrl='media/'+figure+'.mp4';
					var video=$('<video controls src="'+videoUrl+'">');
					$(this).prepend(video);
				}
				else{
					if($(this).attr('data-frames')){
						figure=figure+$(this).attr('data-frames').split(',')[0];
					}

					$(this).prepend('<span>Figure '+figure+'</span> &mdash; ');
					$(this).wrapInner('<figcaption></figcaption>');
					var imageUrl='media/'+figure+'.jpg';
					var img=$('<img src="'+imageUrl+'">');
					$(this).prepend(img);
				}
				
			});
			

			$('.alert-note').each(function(){
				$(this).prepend('<h5>NOTE</h5>');
			});

			$('.alert-warning').each(function(){
				$(this).prepend('<h5><i class="icon mdi mdi-warning"></i>WARNING<i class="icon mdi mdi-warning"></i></h5>');
			});

			$('.alert-caution').each(function(){
				$(this).prepend('<h5><i class="icon mdi mdi-warning"></i>CAUTION<i class="icon mdi mdi-warning"></i></h5>');
			});


		}

		//open chapter with argument ID
		$scope.openChapter=function(chapterID){
			$scope.chapterID=chapterID;
			if($scope.chapterID===23){
				$scope.translatedChapterID="A1";
			}
			else{
				$scope.translatedChapterID="A2";
			}
			
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

		$scope.testSelectAnswer = function(event,questionIndex,answerIndex){
			var el=$(event.target);
			el.addClass('selected').siblings().removeClass('selected');

			$scope.currentTestData.questions[questionIndex].selected=answerIndex;
			console.log($scope.currentTestData);

			// var answer=el.parent().children().index(el);
			// var question=el.closest('.quiz').index('.quiz');
			// if(!$scope.chapters[$scope.chapterID].answered){
			// 	$scope.chapters[$scope.chapterID].answered={};
			// }
			// $scope.chapters[$scope.chapterID].answered[question]=answer;
			// saveData();
			return false;
		};

		


		//open starting chapter
		$scope.openChapter($scope.chapterID);
	};

});