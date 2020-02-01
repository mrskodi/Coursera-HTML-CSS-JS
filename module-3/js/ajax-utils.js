(function (global){
  // Set up a namespace for our utility
  var ajaxUtils = {};

  // Returns an HTTP Request Object
  function getRequestObject(){
    if(window.XMLHttpRequest){
      return(new XMLHttpRequest());
    }
    else{
      global.alert("Ajax not supported");
      return(null);
    }
  }

  // Makes an Ajax GET request to 'requestURL'
  ajaxUtils.sendGetRequest = 
    function(requestURL, responseHandler){   // responseHandler = function(responseText){document.querySelector("#main-content")                                                                                            .innerHTML = responseText;}
      var request = getRequestObject();
      //request.onreadystatechange = responseHandler(request.response);
        request.onreadystatechange = function(){
          handleResponse(request, responseHandler)
        };
      request.open('GET', requestURL, true);
      
      request.send(null);
    };

    function handleResponse(request, responseHandler){
      if((request.readyState==4) && (request.status==200)){
        responseHandler(request.response);         // responseHandler(response) = document.querySelector("#main-content").innerHTML = response;
      }
    }
  global.$ajaxUtils = ajaxUtils;
})(window);