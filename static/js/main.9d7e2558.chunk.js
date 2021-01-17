(window["webpackJsonpwebstac-to-cal"]=window["webpackJsonpwebstac-to-cal"]||[]).push([[0],{16:function(e,t,n){e.exports=n(29)},21:function(e,t,n){},25:function(e,t,n){},26:function(e,t,n){},27:function(e,t,n){},28:function(e,t,n){},29:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n(12),s=n(1),i=n(3),o=n(6),l=n(4),c=n(2),d=n(5),u=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).button=void 0,n.button=null,n}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.initTooltip()}},{key:"componentDidUpdate",value:function(e){this.props.tooltip!==e.tooltip&&this.initTooltip()}},{key:"componentWillUnmount",value:function(){this.button&&$(this.button).tooltip("dispose")}},{key:"render",value:function(){var e=this;return a.createElement("button",{onClick:this.props.onClick,className:"btn btn-danger",ref:function(t){return e.button=t},"data-toggle":this.props.tooltip&&"tooltip","data-placement":this.props.tooltip&&"top",title:this.props.tooltip},a.createElement("i",{className:"fa fa-times","aria-hidden":"true"}),this.props.children)}},{key:"initTooltip",value:function(){this.button&&this.props.tooltip&&$(this.button).tooltip()}}]),t}(a.Component),h=n(10),p=["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],m=function(){function e(){Object(s.a)(this,e)}return Object(i.a)(e,[{key:"getIsSignedIn",value:function(){return gapi.auth2.getAuthInstance().currentUser.get().isSignedIn()}},{key:"signIn",value:function(){return new Promise(function(e,t){gapi.auth2.getAuthInstance().signIn().then(e,function(e){return t(g.tryToConvert(e)||e)})})}},{key:"signOut",value:function(){return new Promise(function(e,t){gapi.auth2.getAuthInstance().signOut().then(e,function(e){return t(g.tryToConvert(e)||e)})})}},{key:"getCalendarList",value:function(){return new Promise(function(e,t){gapi.client.calendar.calendarList.list({minAccessRole:"writer"}).then(e,function(e){return t(g.tryToConvert(e)||e)})}).then(function(e){return e.result.items})}},{key:"createEvent",value:function(e,t){try{var n=gapi.client.calendar.events.insert({calendarId:e,resource:t.generateEventObject()});return new Promise(function(e,t){n.then(function(t){return e(t.result.htmlLink)},function(e){return t(g.tryToConvert(e)||e)})})}catch(a){return Promise.reject(a)}}}],[{key:"getInstance",value:function(){if(null===e.instancePromise){if(!gapi.client)throw new Error("Google client library is required in global scope.  Be sure it has loaded and executed completely.");e.instancePromise=new Promise(function(t,n){gapi.client.init({apiKey:"AIzaSyDEiPoOLx-XZvaPSJCRwBi9hwebeo_d4fA",clientId:"958398529813-fd454skqr0ergbl6ee922pcia76tm1ej.apps.googleusercontent.com",scope:"https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",discoveryDocs:p}).then(function(){return t(new e)},function(e){return n(g.tryToConvert(e)||e)})})}return e.instancePromise}}]),e}();m.instancePromise=null;var v=m;var g=function(e){function t(e,n){var a;Object(s.a)(this,t);var r=null!=n?"HTTP "+n:"No response -- check connection";return a=Object(o.a)(this,Object(l.a)(t).call(this,"".concat(r,": ").concat(e))),Object.setPrototypeOf(Object(c.a)(a),t.prototype),a.name="ApiHttpError",a}return Object(d.a)(t,e),Object(i.a)(t,null,[{key:"tryToConvert",value:function(e){return e instanceof t?e:function(e){if("object"===typeof e&&"result"in e){var t=e.result||{};if("error"in t){var n=t.error;return"number"===typeof n.code&&"string"===typeof n.message}}return!1}(e)?new t(e.result.error.message,e.status):null}}]),t}(Object(h.a)(Error)),E=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).state={isLoading:!1,isError:!1,errorTooltip:""},n.buttonClicked=n.buttonClicked.bind(Object(c.a)(n)),n}return Object(d.a)(t,e),Object(i.a)(t,[{key:"buttonClicked",value:function(){var e=this;this.props.onClick&&(this.setState({isLoading:!0}),this.props.onClick().then(function(t){e.props.onPromiseResolved&&e.props.onPromiseResolved(t),e.setState({isLoading:!1})}).catch(function(t){window.console.error(t),e.setState({isLoading:!1,isError:!0,errorTooltip:t instanceof g?t.message:""})}))}},{key:"render",value:function(){return this.state.isLoading?a.createElement("button",{className:"btn btn-light",disabled:!0},"Working..."):this.state.isError?a.createElement(u,{tooltip:this.state.errorTooltip,onClick:this.buttonClicked},this.props.errorContent):a.createElement("button",{className:this.props.className,onClick:this.buttonClicked},this.props.children)}}]),t}(a.Component);E.defaultProps={errorContent:"Error - retry?"};var f=E,b=function(e){function t(){return Object(s.a)(this,t),Object(o.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(d.a)(t,e),t}(f);var y=function(e){return e.isSignedIn?a.createElement("div",null,a.createElement("p",null,"You have granted access to your calendar."),a.createElement(b,{className:"btn btn-light",onClick:e.onSignOutRequested,onPromiseResolved:e.onAuthChangeComplete,errorContent:"End session failed - retry?"},"End session")):a.createElement("div",null,a.createElement("p",null,"Click the button to grant access to your Google calendar."),a.createElement(b,{className:"btn btn-primary",onClick:e.onSignInRequested,onPromiseResolved:e.onAuthChangeComplete,errorContent:"Permission failed - retry?"},"Grant permission"))},C=(n(21),"Go to WebSTAC >> Courses & Registration >> Class Schedule.\nThen, SELECT ALL the text, including finals schedule, and copy and paste it into this box."),A='\n<p>\n  <a href="https://acadinfo.wustl.edu/apps/ClassSchedule/" target="_blank">\n    Click here to go to your WebSTAC class schedule.\n  </a> Then, SELECT ALL and copy and paste everything into this text box.\n</p>\n<div class="modal fade" id="help-modal" >\n  <div class="modal-dialog modal-lg" role="document">\n    <div class="modal-content">\n\n      <div class="modal-header">\n        <h3 class="modal-title" id="helpModalLabel">\u2461 COPYPASTE</h3>\n       <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n          <span aria-hidden="true">&times;</span>\n        </button>\n        </div>\n\n      <div class="modal-body">\n        <div>\n          <p>\n            2a. Once you\'ve logged into <a href="https://acadinfo.wustl.edu/" target="_blank">WebSTAC</a>, select\n            Courses &amp; Registration >> Class Schedule.\n          </p>\n          <img src="img/help1.JPG" class="img-fluid" alt="Select Courses and Registration >> Class Schedule"/>\n        </div>\n        <div style="margin-top: 30px">\n          <p>2b. <b>Easy way</b>: select all (CTRL+A), and copy.  Close this dialogue and paste into the text box.</p>\n          <p><b>Important:</b> make sure you copied your schedule in LIST view, not grid view.</p>\n          <img src="img/help2.gif" class="img-fluid" alt="Copy the entire table"/>\n        </div>\n      </div>\n\n      <div class="modal-footer">\n        <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n<p><button class="btn btn-secondary" data-toggle="modal" data-target="#help-modal">More help</button></p>\n';function S(e){return a.createElement("div",{className:"alert alert-success ScheduleInput-notice",role:"alert"},e.numEvents," events found!  Scroll down to confirm additions to calendar.",a.createElement("br",null),a.createElement("i",{className:"fa fa-arrow-down ScheduleInput-arrow","aria-hidden":"true"}))}var O=a.createElement("div",{className:"alert alert-danger ScheduleInput-notice ScheduleInput-parse-failed",role:"alert"},a.createElement("p",null,"We weren't able to detect any of your classes or finals."),a.createElement("ul",null,a.createElement("li",null,"Be sure you're pasting your entire class schedule, including Course IDs."),a.createElement("li",null,"You could be using an unsupported browser.  Try copying WebSTAC from the desktop version of Chrome, Firefox, Safari, Opera, or Edge."))),w=function(e){var t="ScheduleInput-input-box",n=null;if(e.value){var r=e.numEventsParsed||0;r>0?(t+=" ScheduleInput-success-border",n=a.createElement(S,{numEvents:r})):(t+=" ScheduleInput-failed-border",n=O)}return a.createElement("div",null,a.createElement("div",{dangerouslySetInnerHTML:{__html:A}}),a.createElement("textarea",{className:t,placeholder:C,value:e.value,onChange:e.onChange}),n)},T=n(9),k="UA-58192647-1",I=!0,j=function(){function e(){Object(s.a)(this,e),!e.isInitialized&&I&&(T.initialize(k),T.set({anonymizeIp:!0}))}return Object(i.a)(e,[{key:"sendPageView",value:function(e){I&&T.pageview(e)}},{key:"sendEvent",value:function(e){I&&T.event(e)}}]),e}();j.isInitialized=!1;var P=j,D=n(7),R=n.n(D),N={name:"SP20",startDate:R()("2020-01-13","YYYY-MM-DD",!0),endDate:R()("2020-04-25","YYYY-MM-DD",!0)};if(!N.startDate.isValid()||!N.endDate.isValid()||N.endDate.isBefore(N.startDate))throw new Error("Semester dates are invalid");var L,M=N;!function(e){e.PERMISSION_DENIED="Scroll up to step 1 and grant permission first.",e.NO_CALENDAR_SELECTED="Select a calendar first.",e.DATE="Enter a date in a supported format, like YYYY-MM-DD.",e.TIME="Enter a valid time (HH:MM[am/pm]).",e.END_BEFORE_START="End time must be AFTER start time.",e.REPEAT_REQUIRED="Select at least one day of the week."}(L||(L={}));var x,Y=function(e){function t(e){var n;return Object(s.a)(this,t),n=Object(o.a)(this,Object(l.a)(t).call(this,e)),Object.setPrototypeOf(Object(c.a)(n),t.prototype),n.name="ValidationError",n}return Object(d.a)(t,e),t}(Object(h.a)(Error)),_=Y,B=["MMM D YYYY","YYYY-MM-DD"],W=["MO","TU","WE","TH","FR","SA","SU"],U={overrides:[],useDefault:!1};!function(e){e[e.normal=0]="normal",e[e.loading=1]="loading",e[e.success=2]="success",e[e.error=3]="error"}(x||(x={}));var F=function(){function e(){Object(s.a)(this,e),this.name="",this.location="",this.date="",this.startTime="",this.endTime="",this.isCourse=!0,this.repeatingDays=Array(e.DAYS_PER_WEEK).fill(!1),this.buttonState=x.normal,this.successUrl=null,this.error=null,this.isCustom=!1}return Object(i.a)(e,[{key:"getIsRepeating",value:function(){return this.repeatingDays.some(function(e){return e})}},{key:"getIsReadyToAdd",value:function(){return this.buttonState===x.normal||this.buttonState===x.error}},{key:"getDate",value:function(){var e=this.isCourse?N.startDate.clone():R()(this.date,B,!0),t=e.isoWeekday()-1,n=this.daysUntilNextRepeatingDay(t);return n>0&&e.add(n,"days"),e}},{key:"generateEventObject",value:function(){var e=this.generateStartEndTimes(),t=e.startDateTime,n=e.endDateTime;return{summary:this.name,location:this.location,start:{dateTime:t,timeZone:"America/Chicago"},end:{dateTime:n,timeZone:"America/Chicago"},recurrence:this.generateRecurrence(),description:"Created by WebSTAC to Calendar",reminders:U}}},{key:"generateStartEndTimes",value:function(){var e=this.getDate();if(!e.isValid())throw new Y(L.DATE);var t=R.a.utc(this.startTime,"h:mmA",!0),n=R.a.utc(this.endTime,"h:mmA",!0);if(!t.isValid()||!n.isValid())throw new Y(L.TIME);if(n.isBefore(t))throw new Y(L.END_BEFORE_START);var a=e.toISOString().substring(0,11);return{startDateTime:a+t.toISOString().substr(11,8),endDateTime:a+n.toISOString().substr(11,8)}}},{key:"generateRecurrence",value:function(){if(this.isCourse&&!this.getIsRepeating())throw new Y(L.REPEAT_REQUIRED);for(var e=[],t=0;t<this.repeatingDays.length;t++)this.repeatingDays[t]&&e.push(W[t]);if(e.length>0){var n=N.endDate.format("YYYYMMDD");return["RRULE:FREQ=WEEKLY;UNTIL=".concat(n,";BYDAY=").concat(e.join(","))]}return[]}},{key:"daysUntilNextRepeatingDay",value:function(t){for(var n=t,a=0;a<e.DAYS_PER_WEEK;a++){if(this.repeatingDays[n])return a;n=(n+1)%7}return-1}}]),e}();F.DAYS_PER_WEEK=7;var z=F,q=/[A-Z]\d\d.+/g,V=/([\w-]+) (\d\d?:\d\d[ap])-(\d\d?:\d\d[ap])/,G=z.DAYS_PER_WEEK,K=5,H=1,J=4,Z=5,Q=1,X=2,ee=3,te=function(){function e(){Object(s.a)(this,e)}return Object(i.a)(e,[{key:"parseCourses",value:function(e){var t=e.match(q);if(!t)return[];var n=[],a=!0,r=!1,s=void 0;try{for(var i,o=t[Symbol.iterator]();!(a=(i=o.next()).done);a=!0){var l=i.value.split("\t");if(!(l.length<K)){var c=l[J].match(V)||[],d=new z;d.isCourse=!0,d.name=l[H].trim()||"",d.location=l[Z]||"",d.repeatingDays=this.parseCourseDays(c[Q]||""),d.startTime=c[X]||"",d.endTime=c[ee]||"",n.push(d)}}}catch(u){r=!0,s=u}finally{try{a||null==o.return||o.return()}finally{if(r)throw s}}return n}},{key:"parseCourseDays",value:function(e){var t=Array(G).fill(!1);if(e.length===G)for(var n=0;n<G;n++)"-"!==e.charAt(n)&&(t[n]=!0);return t}}]),e}(),ne=new RegExp(/((Apr|May|Jun|Jul|Aug|Dec) \d\d? \d\d\d\d) (\d\d?:\d\d[AP]M) - (\d\d?:\d\d[AP]M)\t/.source+/.+\t(.+)/.source+/\n(?:\t\n)?/.source+/Exam Building \/ Room:\t(.+)/.source,"g"),ae=1,re=3,se=4,ie=5,oe=6,le=function(){function e(){Object(s.a)(this,e)}return Object(i.a)(e,[{key:"parseExams",value:function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=t.reduce(function(e,t){return e[t.name]=t.location,e},{}),a=[],r=ne.exec(e);null!==r;){var s=new z;s.isCourse=!1;var i=r[ie];s.name=i+" Final";var o=r[oe];s.location="Same / Same"===o&&n[i]||o,s.date=r[ae],s.startTime=r[re],s.endTime=r[se],a.push(s),r=ne.exec(e)}return a}}]),e}(),ce=n(13),de=(n(25),function(e){function t(){return Object(s.a)(this,t),Object(o.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(d.a)(t,e),t}(f)),ue=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).state={calendars:[]},n.getIsLoggedIn=n.getIsLoggedIn.bind(Object(c.a)(n)),n.fetchCalendars=n.fetchCalendars.bind(Object(c.a)(n)),n.setCalendarList=n.setCalendarList.bind(Object(c.a)(n)),n.calendarSelectChanged=n.calendarSelectChanged.bind(Object(c.a)(n)),n.getIsLoggedIn()&&n.fetchCalendars().then(n.setCalendarList),n}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentWillReceiveProps",value:function(e){var t=this.getIsLoggedIn(e.calendarApi);0===this.state.calendars.length&&t?this.fetchCalendars(e.calendarApi).then(this.setCalendarList):this.state.calendars.length>0&&!t&&this.setState({calendars:[]})}},{key:"getIsLoggedIn",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.props.calendarApi;return!!e&&e.getIsSignedIn()}},{key:"fetchCalendars",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.props.calendarApi;return e?e.getCalendarList():Promise.resolve([])}},{key:"setCalendarList",value:function(e){this.getIsLoggedIn()&&this.setState({calendars:e})}},{key:"calendarSelectChanged",value:function(e){if(this.props.onCalendarSelected){var t=this.state.calendars.find(function(t){return t.id===e.target.value});this.props.onCalendarSelected(t||null)}}},{key:"render",value:function(){var e=this.props.selectedCalendar?this.props.selectedCalendar.id:"",t=this.state.calendars.map(function(e){return a.createElement("option",{key:e.id,value:e.id},e.summary)});return a.createElement("div",{className:"EventTableOptions"},a.createElement("div",{className:"EventTableOptions-row"},a.createElement("label",null,"Select semester:"),a.createElement("select",null,a.createElement("option",{key:M.name,value:M.name},M.name))),a.createElement("div",{className:"EventTableOptions-row"},a.createElement("label",null,"Select calendar:"),a.createElement("select",{value:e,onChange:this.calendarSelectChanged},a.createElement("option",{value:""},"Select a calendar..."),t),a.createElement("span",{className:"EventTableOptions-refresh-list-button"},this.getIsLoggedIn()?a.createElement(de,{className:"btn btn-secondary",onClick:this.fetchCalendars,onPromiseResolved:this.setCalendarList},"Refresh list"):null)))}}]),t}(a.Component),he=(n(26),{DATE:9,TIME:5,NAME:35,LOCATION:30});function pe(e){switch(e.model.buttonState){case x.loading:return a.createElement("button",{className:"btn btn-light",disabled:!0},"Working...");case x.success:return a.createElement("a",{className:"btn btn-success",href:e.model.successUrl||void 0,target:"_blank",rel:"noopener noreferrer"},a.createElement("i",{className:"fa fa-check","aria-hidden":"true"}),"Added!");case x.error:var t,n=e.model.error;return n instanceof _||n instanceof g?t="Couldn't post event: "+n.message:(t="Unexpected error (bug?) -- Check developers' console for technical details.",null==n&&window.console.error("Button state was set to error, but model.error is empty.  Are you setting state correctly?")),a.createElement(u,{tooltip:t,onClick:e.onAddButtonPressed},"Failed - retry?");case x.normal:default:return a.createElement("button",{onClick:e.onAddButtonPressed},a.createElement("img",{src:"img/gcbutton.gif",alt:"Add to Google Calendar"}))}}var me=function(e){var t=e.model,n=e.onModelChangeRequested||function(){},r="EventTableRow";return t.isCourse||(r+=" EventTableRow-final"),a.createElement("tr",{className:r},a.createElement("td",null," ",a.createElement("input",{type:"text",className:"EventTableRow-full-width",value:t.name,size:he.NAME,onChange:function(e){return n({name:e.target.value})}})),a.createElement("td",null,e.model.isCourse?t.repeatingDays.map(function(t,r){return a.createElement("input",{type:"checkbox",key:r,checked:t,onChange:function(t){return function(t,a){var r=e.model.repeatingDays.slice();r[t]=a,n({repeatingDays:r})}(r,t.target.checked)}})}):a.createElement("input",{type:"text",value:t.date,size:he.DATE,onChange:function(e){return n({date:e.target.value})}})),a.createElement("td",null," ",a.createElement("input",{type:"text",value:t.startTime,size:he.TIME,onChange:function(e){return n({startTime:e.target.value})}}),"-",a.createElement("input",{type:"text",value:t.endTime,size:he.TIME,onChange:function(e){return n({endTime:e.target.value})}})),a.createElement("td",null," ",a.createElement("input",{type:"text",className:"EventTableRow-full-width",value:t.location,size:he.LOCATION,onChange:function(e){return n({location:e.target.value})}})),a.createElement("td",null,a.createElement(pe,e)))},ve=(n(27),function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).analytics=void 0,n.state={events:e.events,selectedCalendar:null,isAddingAll:!1},n.analytics=new P,n.addCustomEvent=n.addCustomEvent.bind(Object(c.a)(n)),n.updateOneEvent=n.updateOneEvent.bind(Object(c.a)(n)),n.updateAllEvents=n.updateAllEvents.bind(Object(c.a)(n)),n.validateOptions=n.validateOptions.bind(Object(c.a)(n)),n.addButtonPressed=n.addButtonPressed.bind(Object(c.a)(n)),n.addAllButtonPressed=n.addAllButtonPressed.bind(Object(c.a)(n)),n.addModelToCalendar=n.addModelToCalendar.bind(Object(c.a)(n)),n.renderEventTableRows=n.renderEventTableRows.bind(Object(c.a)(n)),n}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentWillReceiveProps",value:function(e){if(this.props.events!==e.events){var t=this.state.events.filter(function(e){return e.isCustom}),n=e.events.concat(t);this.setState({events:n})}}},{key:"addCustomEvent",value:function(){var e=new F;e.isCustom=!0;var t=this.state.events.slice();t.push(e),this.analytics.sendEvent({category:"Buttons",action:"Custom event"}),this.setState({events:t})}},{key:"updateOneEvent",value:function(e,t){var n=ce.cloneDeep(this.state.events[t]);if(n){var a=this.state.events.slice();a[t]=Object.assign(n,e),this.setState({events:a})}}},{key:"updateAllEvents",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(e){return!0},n=this.state.events.map(function(n){if(t(n)){var a=ce.cloneDeep(n);return Object.assign(a,e)}return n});this.setState({events:n})}},{key:"validateOptions",value:function(){return this.props.calendarApi&&this.props.calendarApi.getIsSignedIn()?this.state.selectedCalendar?null:new Y(L.NO_CALENDAR_SELECTED):new Y(L.PERMISSION_DENIED)}},{key:"addButtonPressed",value:function(e){var t=this.state.events[e];if(t&&t.getIsReadyToAdd()){var n=this.validateOptions();n?this.updateOneEvent({buttonState:x.error,error:n},e):(this.updateOneEvent({buttonState:x.loading,error:null},e),this.addModelToCalendar(e))}}},{key:"addAllButtonPressed",value:function(){var e=this,t=this.validateOptions();t?this.updateAllEvents({buttonState:x.error,error:t},function(e){return e.getIsReadyToAdd()}):(this.setState({isAddingAll:!0}),this.updateAllEvents({buttonState:x.loading,error:null},function(e){return e.getIsReadyToAdd()}),Promise.all(this.state.events.map(function(t,n){return e.addModelToCalendar(n)})).then(function(){return e.setState({isAddingAll:!1})}))}},{key:"addModelToCalendar",value:function(e){var t=this;if(!this.props.calendarApi||!this.state.selectedCalendar)return window.console.warn("Cannot add event to calendar: API not loaded or no selected calendar."),Promise.resolve();var n=this.state.events[e];return n?n.getIsReadyToAdd()?this.props.calendarApi.createEvent(this.state.selectedCalendar.id,n).then(function(a){t.analytics.sendEvent({category:"Calendar",action:"Event added"}),n.isCourse?t.analytics.sendEvent({category:"Calendar",action:"Course added"}):t.analytics.sendEvent({category:"Calendar",action:"Exam added"}),t.updateOneEvent({buttonState:x.success,successUrl:a},e)}).catch(function(n){n instanceof Y||window.console.error(n),t.updateOneEvent({buttonState:x.error,error:n},e)}):Promise.resolve():(console.warn("Cannot add invalid event at index ".concat(e," to calendar.")),Promise.resolve())}},{key:"renderEventTableRows",value:function(){var e=this;return this.state.events.map(function(t,n){return a.createElement(me,{key:n,model:t,onModelChangeRequested:function(t){return e.updateOneEvent(t,n)},onAddButtonPressed:function(){return e.addButtonPressed(n)}})})}},{key:"render",value:function(){var e,t=this;return e=this.state.isAddingAll?a.createElement("button",{className:"btn btn-light",disabled:!0},"Working..."):this.state.events.length>0?a.createElement("button",{className:"btn btn-primary",onClick:this.addAllButtonPressed},"Add all to calendar"):a.createElement("button",{className:"btn btn-primary",disabled:!0},"Nothing detected"),a.createElement("div",{className:"EventTable"},a.createElement("div",{className:"EventTable-options-container"},a.createElement("p",null,"Tip: you can go to ",a.createElement("a",{href:"https://www.google.com/calendar/",target:"_blank",rel:"noopener noreferrer"},"www.google.com/calendar"),', create a new calendar there, and then press "Refresh list"'),a.createElement(ue,{calendarApi:this.props.calendarApi,selectedCalendar:this.state.selectedCalendar,onCalendarSelected:function(e){return t.setState({selectedCalendar:e})}}),a.createElement("p",null,e)),a.createElement("table",{className:"table table-hover table-sm table-responsive"},a.createElement("thead",null,a.createElement("tr",null,a.createElement("td",null,"Class or final name"),a.createElement("td",null,"Days (MTWTFSS)"),a.createElement("td",null,"Time (start - end)"),a.createElement("td",null,"Location"),a.createElement("td",null,"Add to calendar"))),a.createElement("tbody",null,this.renderEventTableRows(),a.createElement("tr",{onClick:this.addCustomEvent},a.createElement("td",{colSpan:5},a.createElement("i",{className:"fa fa-plus-circle EventTable-add-custom-event","aria-hidden":"true"}))))))}}]),t}(a.Component)),ge=(n(28),function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(o.a)(this,Object(l.a)(t).call(this,e))).analytics=void 0,n.courseParser=void 0,n.examParser=void 0,n.parsedEvents=void 0,n.state={calendarApi:null,isApiLoadError:!1,rawInputSchedule:""},n.analytics=new P,n.courseParser=new te,n.examParser=new le,n.parsedEvents=[],v.getInstance().then(function(e){return n.setState({calendarApi:e})}).catch(function(e){window.console.error(e),n.setState({isApiLoadError:!0})}),n.authStatusChanged=n.authStatusChanged.bind(Object(c.a)(n)),n.inputScheduleChanged=n.inputScheduleChanged.bind(Object(c.a)(n)),n}return Object(d.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.analytics.sendPageView("/")}},{key:"authStatusChanged",value:function(){this.setState({})}},{key:"inputScheduleChanged",value:function(e){var t=this.courseParser.parseCourses(e.target.value),n=this.examParser.parseExams(e.target.value,t);this.parsedEvents=t.concat(n),this.parsedEvents.length>0?(this.analytics.sendEvent({category:"Schedule Parse",action:"Success"}),this.analytics.sendEvent({category:"Schedule Parse",action:"Courses parsed",value:t.length}),this.analytics.sendEvent({category:"Schedule Parse",action:"Exams parsed",value:n.length})):this.analytics.sendEvent({category:"Schedule Parse",action:"Failure"}),this.setState({rawInputSchedule:e.target.value})}},{key:"render",value:function(){var e;e=this.state.calendarApi&&this.state.calendarApi.getIsSignedIn()?0===this.parsedEvents.length?2:3:1;var t=null;return t=this.state.isApiLoadError?a.createElement("div",{className:"alert alert-danger App-api-load-failed"},a.createElement("h4",null,"Failed to load Calendar API."),"Try ",a.createElement("a",{href:""},"reloading the page"),".  If that doesn't work, either Google is down (very bad), or there is a serious bug within this app (also very bad)."):this.state.calendarApi?a.createElement(y,{isSignedIn:this.state.calendarApi.getIsSignedIn(),onSignInRequested:this.state.calendarApi.signIn,onSignOutRequested:this.state.calendarApi.signOut,onAuthChangeComplete:this.authStatusChanged}):a.createElement("p",null,"Loading..."),a.createElement("div",{className:"App"},a.createElement("div",{className:1===e?"App-step App-step-active":"App-step"},a.createElement("h3",{className:"App-heading"},"\u2460 Permission"),t),a.createElement("div",{className:2===e?"App-step App-step-active":"App-step"},a.createElement("h3",{className:"App-heading"},"\u2461 CopyPaste"),a.createElement(w,{value:this.state.rawInputSchedule,onChange:this.inputScheduleChanged,numEventsParsed:this.parsedEvents.length})),a.createElement("div",{className:3===e?"App-step App-step-active":"App-step"},a.createElement("h3",{className:"App-heading"},"\u2462 Confirm"),a.createElement(ve,{calendarApi:this.state.calendarApi||void 0,events:this.parsedEvents})))}}]),t}(a.Component));function Ee(){return a.createElement("span",{role:"img","aria-label":"Frown"},"\ud83d\ude41")}window.onload=function(){var e=document.getElementById("root");if(function(){var e=window.navigator.userAgent,t=e.indexOf("MSIE "),n=e.indexOf("Trident/");return t>0||n>0}()){var t=a.createElement("div",{style:{textAlign:"center"}},a.createElement("div",{className:"alert alert-danger",style:{display:"inline-block"}},a.createElement("h4",null,a.createElement(Ee,null)," Internet Explorer not supported. ",a.createElement(Ee,null)),"You appear to be using Internet Explorer.  WebSTAC to Calendar does not support IE.  Sorry about that."));r.render(t,e)}else r.render(a.createElement(ge,null),e)}}},[[16,1,2]]]);
//# sourceMappingURL=main.9d7e2558.chunk.js.map