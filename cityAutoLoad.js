
	onerror= function(message,url, line){
		out ="Error :"+message+"\n";
		out +="Url :"+url+"\n";	
		out +="Line :"+line;	
		alert(out);
	}
		
	function isset(variable_name){
		if ((variable_name!=null && typeof variable_name != 'undefined')){
			return true;
		}
		return false;
	}
	function empty(variable_name){
		if (isset(variable_name) && (variable_name==null || variable_name=="" || variable_name==0)){
			return true;
		}
		return false;
	}
	
	 
	function stateLoad(){
		if (isset(state) && !empty(state.val())){
			//city.disabled = false;update.html('');update.css('position','absolute');
			cityLink="cities.xml.php?state="+state.val()+(J_true?"&json=1":"");
			request.open('GET', cityLink,true);
		}
		else{
			//update.css('position','inherit');
			//city.disabled = true;
			//update.html("<ul><span class='ERROR'>Select A State First!<span></ul>");
			state.trigger("focus");
		}
	}
	
	function loadCities(){
			if (isset(state) && !empty(state.val()) && isset(cityLink) && !empty(cityLink)){
				request.onreadystatechange = function() {
					if ((request.readyState===4) && (request.status===200)) {
						//console.log(request.responseXML.getElementsByTagName("name")[1].firstChild.nodeValue);
						//document.writeln(request.responseText);//request.responseXML;//responseText;
						searchCities();
					}
				}
				if ((request.readyState===1)) {request.send();}
			}
		}
	
	function searchCities(e){//firefox to load the key pressed
			ev = (e || window.event);//must use different var because of ie
			if (ev && ev.keyCode!=38 && ev.keyCode!=40 && ((request.readyState===4) && (request.status===200))){
				myExp = new RegExp(city.value,"i");
				cities = J_true? JSON.parse(request.responseText):request.responseXML.getElementsByTagName("name");//cities array by ether rss or json
				elemsNum=-1;citiesCounter=0;output="<ul>";same=false;	
				for (var i=0; i< cities.length; i++){
					if ((J_true ? cities[i].name.search(myExp):cities[i].firstChild.nodeValue.search(myExp)) > -1){
						cityname = J_true ? cities[i].name:cities[i].firstChild.nodeValue;//city name srting by ether rss or json
						output += "<li class='cityname' id='"+cityname+"'>"+cityname+"</li>";
						citiesCounter++;
						if (cityname.toUpperCase()==city.value.toUpperCase()){same=true;}
					}
				}
				if (!empty(citiesCounter)){output+="</ul>";}else{output="<ul><span class='ERROR'>Non Found!<span></ul>";}
				if (same){output="";}
				update.html(output);
			
				elems = $("li.cityname").each(function(){
					$(this).click(function(){
						city.value=$(this).attr('id');
						update.html('');
					});
					//$(this).mouseover(function(){elemsNum=$("li.cityname").index($(this));})
				});				
			}
		}
	
	function selectKeyCity(e){//firefox to load the key pressed
			ev =(e || window.event);
			if (ev.keyCode==13)
			{return false;}
			switch(ev.keyCode){
				case 38://up key
					elemKey(--elemsNum);
				break;
				case 40://down key
					elemKey(++elemsNum);
				break;
			}
			function elemKey(key){
				if (elemsNum>=elems.length){elemsNum=0;}
				else if (elemsNum<0){elemsNum=elems.length-1;}
				for(var i=0; i < elems.length; i++){
					elems[i].className="cityname";
				}
				city.value=elems[elemsNum].id;
				elems[elemsNum].className="citynamekey"
			}
		}

	try{
		var request = new ajaxRequest();
		var state = $('#state:first');
		var city = document.getElementById("city");//city input field
		var update = $('#update:first');;//update is a DIV where the conent is loaded

		
		var JSON;
		if (JSON && typeof JSON.parse === 'function'){
			J_true = true;
		}else{J_true = false;}
		
		stateLoad();
		state.change(stateLoad);
		city.onfocus=loadCities;
		city.onkeyup=searchCities;//to search for the city that is being typed
		city.onkeydown=selectKeyCity;
		city.onblur=function(){if (empty(city.value)){update.html("");}}
		
	}
	catch(e1){
		update.html(e1);
		//to load to the origonal form when the user clicks submit
		document.getElementById('mainform').action="index.php?content=form&form=YardSale&p=2";
	}


	function ajaxRequest(){
		try{//other browsers
			request = new XMLHttpRequest();
		}
		catch(e1){
			try{//EI 6 +
				request = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e2){
				try{//EI 5
					request = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(e3){
					request = false;
				}
			}
		}
		return request;
	}
