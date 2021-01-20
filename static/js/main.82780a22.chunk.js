(this["webpackJsonpwebstac-to-cal"]=this["webpackJsonpwebstac-to-cal"]||[]).push([[0],{18:function(e,t,s){},23:function(e,t,s){},24:function(e,t,s){},25:function(e,t,s){},26:function(e,t,s){},27:function(e,t,s){"use strict";s.r(t);var n=s(0),a=s(1),r=s(6);class i extends a.Component{constructor(e){super(e),this.button=void 0,this.button=null}componentDidMount(){this.initTooltip()}componentDidUpdate(e){this.props.tooltip!==e.tooltip&&this.initTooltip()}componentWillUnmount(){this.button&&$(this.button).tooltip("dispose")}render(){return Object(n.jsxs)("button",{onClick:this.props.onClick,className:"btn btn-danger",ref:e=>this.button=e,"data-toggle":this.props.tooltip&&"tooltip","data-placement":this.props.tooltip&&"top",title:this.props.tooltip,children:[Object(n.jsx)("i",{className:"fa fa-times","aria-hidden":"true"}),this.props.children]})}initTooltip(){this.button&&this.props.tooltip&&$(this.button).tooltip()}}var o=i;const l=["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];class c{constructor(){}static getInstance(){if(null===c.instancePromise){if(!gapi.client)throw new Error("Google client library is required in global scope.  Be sure it has loaded and executed completely.");c.instancePromise=new Promise(((e,t)=>{gapi.client.init({apiKey:"AIzaSyDEiPoOLx-XZvaPSJCRwBi9hwebeo_d4fA",clientId:"958398529813-fd454skqr0ergbl6ee922pcia76tm1ej.apps.googleusercontent.com",scope:"https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",discoveryDocs:l}).then((()=>e(new c)),(e=>t(h.tryToConvert(e)||e)))}))}return c.instancePromise}getIsSignedIn(){return gapi.auth2.getAuthInstance().currentUser.get().isSignedIn()}signIn(){return new Promise(((e,t)=>{gapi.auth2.getAuthInstance().signIn().then((t=>e()),(e=>t(h.tryToConvert(e)||e)))}))}signOut(){return new Promise(((e,t)=>{gapi.auth2.getAuthInstance().signOut().then(e,(e=>t(h.tryToConvert(e)||e)))}))}getCalendarList(){return new Promise(((e,t)=>{gapi.client.calendar.calendarList.list({minAccessRole:"writer"}).then(e,(e=>t(h.tryToConvert(e)||e)))})).then((e=>e.result.items))}createEvent(e,t){try{let s=gapi.client.calendar.events.insert({calendarId:e,resource:t.generateEventObject()});return new Promise(((e,t)=>{s.then((t=>e(t.result.htmlLink)),(e=>t(h.tryToConvert(e)||e)))}))}catch(s){return Promise.reject(s)}}}c.instancePromise=null;var d=c;class h extends Error{constructor(e,t){super("".concat(null!=t?"HTTP "+t:"No response -- check connection",": ").concat(e)),Object.setPrototypeOf(this,h.prototype),this.name="ApiHttpError"}static tryToConvert(e){return e instanceof h?e:function(e){if("object"===typeof e&&"result"in e){let t=e.result||{};if("error"in t){let e=t.error;return"number"===typeof e.code&&"string"===typeof e.message}}return!1}(e)?new h(e.result.error.message,e.status):null}}class u extends a.Component{constructor(e){super(e),this.state={isLoading:!1,isError:!1,errorTooltip:""},this.buttonClicked=this.buttonClicked.bind(this)}buttonClicked(){this.props.onClick&&(this.setState({isLoading:!0}),this.props.onClick().then((e=>{this.props.onPromiseResolved&&this.props.onPromiseResolved(e),this.setState({isLoading:!1})})).catch((e=>{window.console.error(e),this.setState({isLoading:!1,isError:!0,errorTooltip:e instanceof h?e.message:""})})))}render(){return this.state.isLoading?Object(n.jsx)("button",{className:"btn btn-light",disabled:!0,children:"Working..."}):this.state.isError?Object(n.jsx)(o,{tooltip:this.state.errorTooltip,onClick:this.buttonClicked,children:this.props.errorContent}):Object(n.jsx)("button",{className:this.props.className,onClick:this.buttonClicked,children:this.props.children})}}u.defaultProps={errorContent:"Error - retry?"};var p=u;class b extends p{}var g=function(e){return e.isSignedIn?Object(n.jsxs)("div",{children:[Object(n.jsx)("p",{children:"You have granted access to your calendar."}),Object(n.jsx)(b,{className:"btn btn-light",onClick:e.onSignOutRequested,onPromiseResolved:e.onAuthChangeComplete,errorContent:"End session failed - retry?",children:"End session"})]}):Object(n.jsxs)("div",{children:[Object(n.jsx)("p",{children:"Click the button to grant access to your Google calendar."}),Object(n.jsx)(b,{className:"btn btn-primary",onClick:e.onSignInRequested,onPromiseResolved:e.onAuthChangeComplete,errorContent:"Permission failed - retry?",children:"Grant permission"})]})};s(18);function j(e){return Object(n.jsxs)("div",{className:"alert alert-success ScheduleInput-notice",role:"alert",children:[e.numEvents," events found!  Scroll down to confirm additions to calendar.",Object(n.jsx)("br",{}),Object(n.jsx)("i",{className:"fa fa-arrow-down ScheduleInput-arrow","aria-hidden":"true"})]})}const m=Object(n.jsxs)("div",{className:"alert alert-danger ScheduleInput-notice ScheduleInput-parse-failed",role:"alert",children:[Object(n.jsx)("p",{children:"We weren't able to detect any of your classes or finals."}),Object(n.jsxs)("ul",{children:[Object(n.jsx)("li",{children:"Be sure you're pasting your entire class schedule, including Course IDs."}),Object(n.jsx)("li",{children:"You could be using an unsupported browser.  Try copying WebSTAC from the desktop version of Chrome, Firefox, Safari, Opera, or Edge."})]})]});var v=function(e){let t="ScheduleInput-input-box",s=null;if(e.value){const a=e.numEventsParsed||0;a>0?(t+=" ScheduleInput-success-border",s=Object(n.jsx)(j,{numEvents:a})):(t+=" ScheduleInput-failed-border",s=m)}return Object(n.jsxs)("div",{children:[Object(n.jsxs)("p",{children:[Object(n.jsx)("a",{href:"https://acadinfo.wustl.edu/apps/ClassSchedule/",target:"_blank",rel:"noreferrer",children:"Click here to go to your WebSTAC class schedule."})," Then, SELECT ALL and copy and paste everything into this text box."]}),Object(n.jsx)("p",{children:Object(n.jsx)("button",{className:"btn btn-secondary","data-toggle":"modal","data-target":"#help-modal",children:"More help"})}),Object(n.jsx)("textarea",{className:t,placeholder:"Go to WebSTAC >> Courses & Registration >> Class Schedule.\nThen, SELECT ALL the text, including finals schedule, and copy and paste it into this box.",value:e.value,onChange:e.onChange}),s]})},x=s(4);class C{constructor(){C.isInitialized||(x.b("UA-58192647-1"),x.d({anonymizeIp:!0}))}sendPageView(e){x.c(e)}sendEvent(e){x.a(e)}}C.isInitialized=!1;var O=C,E=s(11),f=s(2),S=s.n(f);const y={name:"SP21",startDate:S()("2021-01-25","YYYY-MM-DD",!0),endDate:S()("2021-05-05","YYYY-MM-DD",!0)};if(!y.startDate.isValid()||!y.endDate.isValid()||y.endDate.isBefore(y.startDate))throw new Error("Semester dates are invalid");var w=y;let A;!function(e){e.PERMISSION_DENIED="Scroll up to step 1 and grant permission first.",e.NO_CALENDAR_SELECTED="Select a calendar first.",e.DATE="Enter a date in a supported format, like YYYY-MM-DD.",e.TIME="Enter a valid time (HH:MM[am/pm]).",e.END_BEFORE_START="End time must be AFTER start time.",e.REPEAT_REQUIRED="Select at least one day of the week."}(A||(A={}));class T extends Error{constructor(e){super(e),Object.setPrototypeOf(this,T.prototype),this.name="ValidationError"}}var I=T;const P=["MMM D YYYY","YYYY-MM-DD"],D="h:mmA",R=["MO","TU","WE","TH","FR","SA","SU"],N="America/Chicago",k={overrides:[],useDefault:!1};let L;!function(e){e[e.normal=0]="normal",e[e.loading=1]="loading",e[e.success=2]="success",e[e.error=3]="error"}(L||(L={}));class M{constructor(){this.name="",this.location="",this.date="",this.startTime="",this.endTime="",this.isCourse=!0,this.repeatingDays=Array(M.DAYS_PER_WEEK).fill(!1),this.buttonState=L.normal,this.successUrl=null,this.error=null,this.isCustom=!1}getIsRepeating(){return this.repeatingDays.some((e=>e))}getIsReadyToAdd(){return this.buttonState===L.normal||this.buttonState===L.error}getDate(){let e=this.isCourse?y.startDate.clone():S()(this.date,P,!0),t=e.isoWeekday()-1,s=this.daysUntilNextRepeatingDay(t);return s>0&&e.add(s,"days"),e}generateEventObject(){let e=this.generateStartEndTimes(),t=e.startDateTime,s=e.endDateTime;return{summary:this.name,location:this.location,start:{dateTime:t,timeZone:N},end:{dateTime:s,timeZone:N},recurrence:this.generateRecurrence(),description:"Created by WebSTAC to Calendar",reminders:k}}generateStartEndTimes(){const e=this.getDate();if(!e.isValid())throw new T(A.DATE);const t=S.a.utc(this.startTime,D,!0),s=S.a.utc(this.endTime,D,!0);if(!t.isValid()||!s.isValid())throw new T(A.TIME);if(s.isBefore(t))throw new T(A.END_BEFORE_START);const n=e.toISOString().substring(0,11);return{startDateTime:n+t.toISOString().substr(11,8),endDateTime:n+s.toISOString().substr(11,8)}}generateRecurrence(){if(this.isCourse&&!this.getIsRepeating())throw new T(A.REPEAT_REQUIRED);let e=[];for(let t=0;t<this.repeatingDays.length;t++)this.repeatingDays[t]&&e.push(R[t]);if(e.length>0){const t=y.endDate.format("YYYYMMDD");return["RRULE:FREQ=WEEKLY;UNTIL=".concat(t,";BYDAY=").concat(e.join(","))]}return[]}daysUntilNextRepeatingDay(e){let t=e;for(let s=0;s<M.DAYS_PER_WEEK;s++){if(this.repeatingDays[t])return s;t=(t+1)%7}return-1}}M.DAYS_PER_WEEK=7;var Y=M;const B=/[A-Z]\d\d.+/g,_=/([\w-]+) (\d\d?:\d\d[ap])-(\d\d?:\d\d[ap])/,W=Y.DAYS_PER_WEEK,U=5,F=1,z=4,q=5,V=1,K=2,G=3;var H=class{parseCourses(e){let t=e.match(B);if(!t)return[];let s=[];var n,a=Object(E.a)(t);try{for(a.s();!(n=a.n()).done;){let e=n.value.split("\t");if(e.length<U)continue;let t=e[z].match(_)||[],a=new Y;a.isCourse=!0,a.name=e[F].trim()||"",a.location=e[q]||"",a.repeatingDays=this.parseCourseDays(t[V]||""),a.startTime=t[K]||"",a.endTime=t[G]||"",s.push(a)}}catch(r){a.e(r)}finally{a.f()}return s}parseCourseDays(e){let t=Array(W).fill(!1);if(e.length===W)for(let s=0;s<W;s++)"-"!==e.charAt(s)&&(t[s]=!0);return t}};const J=new RegExp(/((Apr|May|Jun|Jul|Aug|Dec) \d\d? \d\d\d\d) (\d\d?:\d\d[AP]M) - (\d\d?:\d\d[AP]M)\t/.source+/.+\t(.+)/.source+/\n(?:\t\n)?/.source+/Exam Building \/ Room:\t(.+)/.source,"g"),Z=1,Q=3,X=4,ee=5,te=6;var se=class{parseExams(e,t=[]){let s=t.reduce(((e,t)=>(e[t.name]=t.location,e)),{}),n=[],a=J.exec(e);for(;null!==a;){let t=new Y;t.isCourse=!1;let r=a[ee];t.name=r+" Final";let i=a[te];t.location="Same / Same"===i&&s[r]||i,t.date=a[Z],t.startTime=a[Q],t.endTime=a[X],n.push(t),a=J.exec(e)}return n}},ne=s(7),ae=s.n(ne),re=s(9),ie=s(10);s(23);class oe extends p{}class le extends a.Component{constructor(e){super(e),this.state={calendars:[]},this.getIsLoggedIn=this.getIsLoggedIn.bind(this),this.fetchCalendars=this.fetchCalendars.bind(this),this.setCalendarList=this.setCalendarList.bind(this),this.calendarSelectChanged=this.calendarSelectChanged.bind(this),this.getIsLoggedIn()&&this.fetchCalendars().then(this.setCalendarList)}componentWillReceiveProps(e){let t=this.getIsLoggedIn(e.calendarApi);0===this.state.calendars.length&&t?this.fetchCalendars(e.calendarApi).then(this.setCalendarList):this.state.calendars.length>0&&!t&&this.setState({calendars:[]})}getIsLoggedIn(e=this.props.calendarApi){return!!e&&e.getIsSignedIn()}fetchCalendars(e=this.props.calendarApi){return e?e.getCalendarList():Promise.resolve([])}setCalendarList(e){this.getIsLoggedIn()&&this.setState({calendars:e})}calendarSelectChanged(e){if(this.props.onCalendarSelected){let t=this.state.calendars.find((t=>t.id===e.target.value));this.props.onCalendarSelected(t||null)}}render(){let e=this.props.selectedCalendar?this.props.selectedCalendar.id:"",t=this.state.calendars.map((e=>Object(n.jsx)("option",{value:e.id,children:e.summary},e.id)));return Object(n.jsxs)("div",{className:"EventTableOptions",children:[Object(n.jsxs)("div",{className:"EventTableOptions-row",children:[Object(n.jsx)("label",{children:"Select semester:"}),Object(n.jsx)("select",{children:Object(n.jsx)("option",{value:w.name,children:w.name},w.name)})]}),Object(n.jsxs)("div",{className:"EventTableOptions-row",children:[Object(n.jsx)("label",{children:"Select calendar:"}),Object(n.jsxs)("select",{value:e,onChange:this.calendarSelectChanged,children:[Object(n.jsx)("option",{value:"",children:"Select a calendar..."}),t]}),Object(n.jsx)("span",{className:"EventTableOptions-refresh-list-button",children:this.getIsLoggedIn()?Object(n.jsx)(oe,{className:"btn btn-secondary",onClick:this.fetchCalendars,onPromiseResolved:this.setCalendarList,children:"Refresh list"}):null})]})]})}}var ce=le,de=s(12);s(24);const he=12,ue=6,pe=35,be=30;function ge(e){switch(e.model.buttonState){case L.loading:return Object(n.jsx)("button",{className:"btn btn-light",disabled:!0,children:"Working..."});case L.success:return Object(n.jsxs)("a",{className:"btn btn-success",href:e.model.successUrl||void 0,target:"_blank",rel:"noopener noreferrer",children:[Object(n.jsx)("i",{className:"fa fa-check","aria-hidden":"true"}),"Added!"]});case L.error:const t=e.model.error;let s;return t instanceof I||t instanceof h?s="Couldn't post event: "+t.message:(s="Unexpected error (bug?) -- Check developers' console for technical details.",null==t&&window.console.error("Button state was set to error, but model.error is empty.  Are you setting state correctly?")),Object(n.jsx)(o,{tooltip:s,onClick:e.onAddButtonPressed,children:"Failed - retry?"});case L.normal:default:return Object(n.jsxs)("button",{className:"btn btn-light",onClick:e.onAddButtonPressed,children:[Object(n.jsx)("i",{className:"fa fa-plus-circle","aria-hidden":"true"}),"Add"]})}}var je=function(e){const t=e.model,s=e.onModelChangeRequested||(()=>{});let a="EventTableRow";return t.isCourse||(a+=" EventTableRow-final"),Object(n.jsxs)("tr",{className:a,children:[Object(n.jsxs)("td",{children:[" ",Object(n.jsx)("input",{type:"text",className:"EventTableRow-full-width",value:t.name,size:pe,onChange:e=>s({name:e.target.value})})]}),Object(n.jsx)("td",{children:e.model.isCourse?t.repeatingDays.map(((t,a)=>Object(n.jsx)("input",{type:"checkbox",checked:t,onChange:t=>function(t,n){let a=e.model.repeatingDays.slice();a[t]=n,s({repeatingDays:a})}(a,t.target.checked)},a))):Object(n.jsx)("input",{type:"text",value:t.date,size:he,onChange:e=>s({date:e.target.value})})}),Object(n.jsxs)("td",{children:[" ",Object(n.jsx)("input",{type:"text",value:t.startTime,size:ue,onChange:e=>s({startTime:e.target.value})}),"-",Object(n.jsx)("input",{type:"text",value:t.endTime,size:ue,onChange:e=>s({endTime:e.target.value})})]}),Object(n.jsxs)("td",{children:[" ",Object(n.jsx)("input",{type:"text",className:"EventTableRow-full-width",value:t.location,size:be,onChange:e=>s({location:e.target.value})})]}),Object(n.jsx)("td",{children:Object(n.jsx)(ge,Object(de.a)({},e))})]})};s(25);class me extends a.Component{constructor(e){super(e),this.analytics=void 0,this.state={events:e.events,selectedCalendar:null,isAddingAll:!1},this.analytics=new O,this.addCustomEvent=this.addCustomEvent.bind(this),this.updateOneEvent=this.updateOneEvent.bind(this),this.validateOptions=this.validateOptions.bind(this),this.addButtonPressed=this.addButtonPressed.bind(this),this.addAllButtonPressed=this.addAllButtonPressed.bind(this),this.addModelToCalendar=this.addModelToCalendar.bind(this),this.renderEventTableRows=this.renderEventTableRows.bind(this)}componentWillReceiveProps(e){if(this.props.events!==e.events){let t=this.state.events.filter((e=>e.isCustom)),s=e.events.concat(t);this.setState({events:s})}}addCustomEvent(){const e=new M;e.isCustom=!0;const t=this.state.events.slice();t.push(e),this.analytics.sendEvent({category:"Buttons",action:"Custom event"}),this.setState({events:t})}updateOneEvent(e,t){const s=ie.cloneDeep(this.state.events[t]);if(!s)return;const n=this.state.events.slice();n[t]=Object.assign(s,e),this.setState({events:n})}validateOptions(){return this.props.calendarApi&&this.props.calendarApi.getIsSignedIn()?this.state.selectedCalendar?null:new T(A.NO_CALENDAR_SELECTED):new T(A.PERMISSION_DENIED)}addButtonPressed(e){const t=this.state.events[e];if(!t||!t.getIsReadyToAdd())return Promise.resolve();const s=this.validateOptions();return s?(this.updateOneEvent({buttonState:L.error,error:s},e),Promise.resolve()):this.addModelToCalendar(e)}addAllButtonPressed(){var e=this;return Object(re.a)(ae.a.mark((function t(){var s;return ae.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({isAddingAll:!0}),s=0;case 2:if(!(s<e.state.events.length)){t.next=8;break}return t.next=5,e.addButtonPressed(s);case 5:s++,t.next=2;break;case 8:e.setState({isAddingAll:!1});case 9:case"end":return t.stop()}}),t)})))()}addModelToCalendar(e){if(!this.props.calendarApi||!this.state.selectedCalendar)return window.console.warn("Cannot add event to calendar: API not loaded or no selected calendar."),Promise.resolve();const t=this.state.events[e];return t?(this.updateOneEvent({buttonState:L.loading,error:null},e),this.props.calendarApi.createEvent(this.state.selectedCalendar.id,t).then((s=>{this.analytics.sendEvent({category:"Calendar",action:"Event added"}),t.isCourse?this.analytics.sendEvent({category:"Calendar",action:"Course added"}):this.analytics.sendEvent({category:"Calendar",action:"Exam added"}),this.updateOneEvent({buttonState:L.success,successUrl:s},e)})).catch((t=>{t instanceof T||window.console.error(t),this.updateOneEvent({buttonState:L.error,error:t},e)}))):(console.warn("Cannot add invalid event at index ".concat(e," to calendar.")),Promise.resolve())}renderEventTableRows(){return this.state.events.map(((e,t)=>Object(n.jsx)(je,{model:e,onModelChangeRequested:e=>this.updateOneEvent(e,t),onAddButtonPressed:()=>this.addButtonPressed(t)},t)))}render(){let e;return e=this.state.isAddingAll?Object(n.jsx)("button",{className:"btn btn-light",disabled:!0,children:"Working..."}):this.state.events.length>0?Object(n.jsx)("button",{className:"btn btn-primary",onClick:this.addAllButtonPressed,children:"Add all to calendar"}):Object(n.jsx)("button",{className:"btn btn-primary",disabled:!0,children:"Nothing detected"}),Object(n.jsxs)("div",{className:"EventTable",children:[Object(n.jsxs)("div",{className:"EventTable-options-container",children:[Object(n.jsxs)("p",{children:["Tip: you can go to ",Object(n.jsx)("a",{href:"https://www.google.com/calendar/",target:"_blank",rel:"noopener noreferrer",children:"www.google.com/calendar"}),', create a new calendar there, and then press "Refresh list"']}),Object(n.jsx)(ce,{calendarApi:this.props.calendarApi,selectedCalendar:this.state.selectedCalendar,onCalendarSelected:e=>this.setState({selectedCalendar:e})}),Object(n.jsx)("p",{children:e})]}),Object(n.jsx)("div",{className:"table-responsive",children:Object(n.jsxs)("table",{className:"table table-hover table-sm",children:[Object(n.jsx)("thead",{children:Object(n.jsxs)("tr",{children:[Object(n.jsx)("td",{children:"Class or final name"}),Object(n.jsx)("td",{children:"Days (MTWTFSS)"}),Object(n.jsx)("td",{children:"Time (start - end)"}),Object(n.jsx)("td",{children:"Location"}),Object(n.jsx)("td",{children:"Add to calendar"})]})}),Object(n.jsxs)("tbody",{children:[this.renderEventTableRows(),Object(n.jsx)("tr",{onClick:this.addCustomEvent,children:Object(n.jsx)("td",{colSpan:5,children:Object(n.jsx)("i",{className:"fa fa-plus-circle EventTable-add-custom-event","aria-hidden":"true"})})})]})]})})]})}}var ve=me;s(26);class xe extends a.Component{constructor(e){super(e),this.analytics=void 0,this.courseParser=void 0,this.examParser=void 0,this.parsedEvents=void 0,this.state={calendarApi:null,isApiLoadError:!1,rawInputSchedule:""},this.analytics=new O,this.courseParser=new H,this.examParser=new se,this.parsedEvents=[],d.getInstance().then((e=>this.setState({calendarApi:e}))).catch((e=>{window.console.error(e),this.setState({isApiLoadError:!0})})),this.authStatusChanged=this.authStatusChanged.bind(this),this.inputScheduleChanged=this.inputScheduleChanged.bind(this)}componentDidMount(){this.analytics.sendPageView("/")}authStatusChanged(){this.setState({})}inputScheduleChanged(e){let t=this.courseParser.parseCourses(e.target.value),s=this.examParser.parseExams(e.target.value,t);this.parsedEvents=t.concat(s),this.parsedEvents.length>0?(this.analytics.sendEvent({category:"Schedule Parse",action:"Success"}),this.analytics.sendEvent({category:"Schedule Parse",action:"Courses parsed",value:t.length}),this.analytics.sendEvent({category:"Schedule Parse",action:"Exams parsed",value:s.length})):this.analytics.sendEvent({category:"Schedule Parse",action:"Failure"}),this.setState({rawInputSchedule:e.target.value})}render(){const e="App-step",t="App-step App-step-active";let s;s=this.state.calendarApi&&this.state.calendarApi.getIsSignedIn()?0===this.parsedEvents.length?2:3:1;let a=null;return a=this.state.isApiLoadError?Object(n.jsxs)("div",{className:"alert alert-danger App-api-load-failed",children:[Object(n.jsx)("h4",{children:"Failed to load Calendar API."}),"Try ",Object(n.jsx)("a",{href:"",children:"reloading the page"}),".  If that doesn't work, either Google is down (very bad), or there is a serious bug within this app (also very bad)."]}):this.state.calendarApi?Object(n.jsx)(g,{isSignedIn:this.state.calendarApi.getIsSignedIn(),onSignInRequested:this.state.calendarApi.signIn,onSignOutRequested:this.state.calendarApi.signOut,onAuthChangeComplete:this.authStatusChanged}):Object(n.jsx)("p",{children:"Loading..."}),Object(n.jsxs)("div",{className:"App",children:[Object(n.jsxs)("div",{className:1===s?t:e,children:[Object(n.jsx)("h3",{className:"App-heading",children:"\u2460 Permission"}),a]}),Object(n.jsxs)("div",{className:2===s?t:e,children:[Object(n.jsx)("h3",{className:"App-heading",children:"\u2461 CopyPaste"}),Object(n.jsx)(v,{value:this.state.rawInputSchedule,onChange:this.inputScheduleChanged,numEventsParsed:this.parsedEvents.length})]}),Object(n.jsxs)("div",{className:3===s?t:e,children:[Object(n.jsx)("h3",{className:"App-heading",children:"\u2462 Confirm"}),Object(n.jsx)(ve,{calendarApi:this.state.calendarApi||void 0,events:this.parsedEvents})]})]})}}var Ce=xe;function Oe(){return Object(n.jsx)("span",{role:"img","aria-label":"Frown",children:"\ud83d\ude41"})}window.onload=()=>{const e=document.getElementById("root");if(function(){var e=window.navigator.userAgent,t=e.indexOf("MSIE "),s=e.indexOf("Trident/");return t>0||s>0}()){const t=Object(n.jsx)("div",{style:{textAlign:"center"},children:Object(n.jsxs)("div",{className:"alert alert-danger",style:{display:"inline-block"},children:[Object(n.jsxs)("h4",{children:[Object(n.jsx)(Oe,{})," Internet Explorer not supported. ",Object(n.jsx)(Oe,{})]}),"You appear to be using Internet Explorer.  WebSTAC to Calendar does not support IE.  Sorry about that."]})});r.render(t,e)}else r.render(Object(n.jsx)(Ce,{}),e)}}},[[27,1,2]]]);
//# sourceMappingURL=main.82780a22.chunk.js.map