app.controller("chapterController",function(e,t,r){function a(){console.log(e.chapters[e.chapterID].correctPercent)}function n(){var t=0;for(var r in e.chapters[e.chapterID].answered){var n=e.chapters[e.chapterID].answered[r];e.questions[e.chapterID].questions[r].answers[n].correct&&t++}e.chapters[e.chapterID].correctCount=t,e.chapters[e.chapterID].correctPercent=Math.floor(e.chapters[e.chapterID].correctCount/e.questions[e.chapterID].questions.length*100),a(),window.localStorage[c]=JSON.stringify(e.chapters)}function s(t){function r(){$("#search").val("").trigger("keyup"),$("figure").each(function(){var e=$(this).attr("data-id");$(this).prepend("<span>Figure "+e+"</span> &mdash; "),$(this).wrapInner("<figcaption></figcaption>");var t="media/"+e+".jpg",r=$('<img src="'+t+'">');$(this).prepend(r)}),$(".alert-note").each(function(){$(this).prepend("<h5>NOTE</h5>")}),$(".alert-warning").each(function(){$(this).prepend('<h5><i class="icon mdi mdi-warning"></i>WARNING<i class="icon mdi mdi-warning"></i></h5>')}),$(".alert-caution").each(function(){$(this).prepend('<h5><i class="icon mdi mdi-warning"></i>CAUTION<i class="icon mdi mdi-warning"></i></h5>')})}e.chapters=t,n(),e.bookmarkToggle=function(){1==e.chapters[e.chapterID].bookmarked?e.chapters[e.chapterID].bookmarked=!1:e.chapters[e.chapterID].bookmarked=!0,$(".bookmark-toggle-btn").toggleClass("bookmarked"),n()},e.openChapter=function(t){e.chapterID=t,e.chapterQuestions=e.questions[t].questions,$(".portal").empty().load(t+".html",function(){for(var t in e.chapters[e.chapterID].answered)$(".quiz").eq(parseInt(t)).find(".quiz-answer").eq(e.chapters[e.chapterID].answered[t]).addClass("selected");r(),a()})},e.selectAnswer=function(t){var r=$(t.target);r.addClass("selected").siblings().removeClass("selected");var a=r.parent().children().index(r),s=r.closest(".quiz").index(".quiz");return e.chapters[e.chapterID].answered||(e.chapters[e.chapterID].answered={}),e.chapters[e.chapterID].answered[s]=a,n(),!1},e.openChapter(e.chapterID)}e.version="0.6",e.numbersToLetters={0:"A",1:"B",2:"C",3:"D"},e.startChapter=1,e.chapterID=e.startChapter;var c="NETCtoolsAlphaChaptersB";r.get("chapterQuestions.json").then(function(t){e.questions=t.data,window.localStorage[c]?s(JSON.parse(window.localStorage[c])):r.get("chapters.json").then(function(e){s(e.data)})}),e.resetData=function(){confirm("This will reset all bookmarks and saved progress, do you want to continue?")&&r.get("chapters.json").then(function(e){$(".quiz-answer").removeClass("selected"),s(e.data)})}});