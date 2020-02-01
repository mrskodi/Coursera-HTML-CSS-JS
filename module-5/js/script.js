window.document.addEventListener("DOMContentLoaded", function(event){

  // Unobstrusive event binding
  window.document.querySelector("#button").addEventListener("click", function(){
      
      $ajaxUtil.sendGetRequest("data/info.txt",   
      function(request){

            console.log("In Response Handler function");
            var name = request.responseText;
            console.log(name);
            document.querySelector("#content").innerHTML = "<h2>Hello " + name + "!.";
      });
    
  });
});