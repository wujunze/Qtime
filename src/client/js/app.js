$(document).ready(function(){

	var FF = !(window.mozInnerScreenX == null);
	if(FF) {
		$('#entryGrid').css('outline','none');
		$('#entryGrid').css('border','1px solid');
	} 
	$("#entryGrid").on("mouseover","tr",function() {
		$(this).addClass("highlight");
	});

	$("#entryGrid").on("mouseout","tr",function() {
		$(this).removeClass("highlight");
	});


	//TODO: below can be done in vue.js style
	$("#entryGrid").on("mouseover","td",function() {
		// only show tooltip for content that's cut off
		if ($(this)[0].scrollWidth > $(this).innerWidth()) 
			$(this).children(".contentTooltip").show();
	});
	$("#entryGrid").on("mouseout","td",function() {
		$(this).children(".contentTooltip").hide();
	});

	placeFooter();
	$(window).on('resize', function(){
		placeFooter();
	});

	// try to login if cookies are there, 
	// if login fail, fetch public data

	username = Cookies.get('username')
	token = Cookies.get('token')

	if (username && token) {

		var msg = 'Logging in...';
		if (Cookies.get('lang')==='cn')
			msg = '登录中';

		qRequest(msg, 'GET', 'token-login', null, 
			function() {qtime.$emit('login success')},
			function() {
				qtime.getPublicData(); 		
				qtime.showTip = true;
				Cookies.remove('token');
			}
		)

	}else {
		qtime.getPublicData();
		qtime.showTip = true;
	}

});





