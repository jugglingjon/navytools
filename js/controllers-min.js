app.controller("chapterController",function(e,t,r){function a(){console.log(e.chapters[e.chapterID].correctPercent)}function n(){var t=0;for(var r in e.chapters[e.chapterID].answered){var n=e.chapters[e.chapterID].answered[r];e.questions[e.chapterID].questions[r].answers[n].correct&&t++}e.chapters[e.chapterID].correctCount=t,e.chapters[e.chapterID].correctPercent=Math.floor(e.chapters[e.chapterID].correctCount/e.questions[e.chapterID].questions.length*100),a(),window.localStorage[s]=JSON.stringify(e.chapters)}function c(t){function r(){$("figure").each(function(){var e=$(this).attr("data-id");$(this).prepend("<span>Figure "+e+"</span> &mdash; "),$(this).wrapInner("<figcaption></figcaption>");var t="media/"+e+".jpg",r=$('<img src="'+t+'">');$(this).prepend(r)}),$(".alert-note").each(function(){$(this).prepend("<h5>NOTE</h5>")}),$(".alert-warning").each(function(){$(this).prepend("<h5>WARNING</h5>")}),$(".alert-caution").each(function(){$(this).prepend("<h5>CAUTION</h5>")})}e.chapters=t,e.bookmarkToggle=function(){1==e.chapters[e.chapterID].bookmarked?e.chapters[e.chapterID].bookmarked=!1:e.chapters[e.chapterID].bookmarked=!0,$(".bookmark-toggle-btn").toggleClass("bookmarked"),n()},e.openChapter=function(t){e.chapterID=t,e.chapterQuestions=e.questions[t].questions,$(".portal").empty().load(t+".html",function(){for(var t in e.chapters[e.chapterID].answered)$(".quiz").eq(parseInt(t)).find(".quiz-answer").eq(e.chapters[e.chapterID].answered[t]).addClass("selected");r(),a()})},e.selectAnswer=function(t){var r=$(t.target);r.addClass("selected").siblings().removeClass("selected");var a=r.parent().children().index(r),c=r.closest(".quiz").index(".quiz");return e.chapters[e.chapterID].answered||(e.chapters[e.chapterID].answered={}),e.chapters[e.chapterID].answered[c]=a,n(),!1},$("body").on("click",".quiz-answer",function(){return!1}),e.openChapter(e.chapterID)}e.startChapter=1,e.chapterID=e.startChapter;var s="NETCtoolsAlphaChaptersB";r.get("chapterQuestions.json").then(function(t){e.questions=t.data,window.localStorage[s]?c(JSON.parse(window.localStorage[s])):r.get("chapters.json").then(function(e){c(e.data)})})});