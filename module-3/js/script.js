
// To collapse the menu on blur
$(function(){
  // Select the collapsible menu
  $("#collapsible-menu-button").blur(function (event){
    var screenWidth = window.innerWidth;
    if(screenWidth < 768){
      $("#navbar-collapsible-menu").collapse('hide');
    }
  });
});

// To place the main-content in the place holder dynamically
(function(global){
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json"; 
  var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
  
  // // Get the category object from the URL
  // var categories;
  // var categoryRequest = new XMLHttpRequest();
  // categoryRequest.open('GET', allCategoriesUrl);
  // categoryRequest.onload = function(){
  //   categories = JSON.parse(categoryRequest.responseText);
  // }
  // categoryRequest.send();

  var categoryTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";

  
  // Convenience function for inserting html for a particular selector
  var insertHtml = function (selector, html){
    var targetElement = document.querySelector(selector);
    targetElement.innerHTML = html;
  };

  // Show loading icon
  var showLoading = function(selector){
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif' alt='work in progress'></div>";
    insertHtml(selector, html);
  };

  // Return substitute of {{propName}} with {{propValue}} in given 'string'
  var insertProp = function (string, propName, propValue){
    var propToReplace = "{{" + propName + "}}";
    var string = string.replace(new RegExp(propToReplace, 'g'), propValue);
    //var string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  // On page load before images or CSS
  document.addEventListener("DOMContentLoaded", function (event) {

    // TODO: STEP 0: Look over the code from
    // *** start ***
    // to
    // *** finish ***
    // below.
    // We changed this code to retrieve all categories from the server instead of
    // simply requesting home HTML snippet. We now also have another function
    // called buildAndShowHomeHTML that will receive all the categories from the server
    // and process them: choose random category, retrieve home HTML snippet, insert that
    // random category into the home HTML snippet, and then insert that snippet into our
    // main page (index.html).
    //
    // TODO: STEP 1: Substitute [...] below with the *value* of the function buildAndShowHomeHTML,
    // so it can be called when server responds with the categories data.
    
    // *** start ***
    // On first load, show home view
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowHomeHTML,
      // ***** <---- TODO: STEP 1: Substitute [...] ******
      true); // Explicitly setting the flag to get JSON from server processed into an object literal
    });
    // *** finish **
    
    
    // Builds HTML for the home page based on categories array
    // returned from the server.
    function buildAndShowHomeHTML (categories) {
      
      var categories = JSON.parse(categories);
      
      // Load home snippet page
      $ajaxUtils.sendGetRequest(
        homeHtmlUrl,
        function (homeHtml) {
          console.log("Home Html: " + homeHtml);
          // TODO: STEP 2: Here, call chooseRandomCategory, passing it retrieved 'categories'
          // Pay attention to what type of data that function returns vs what the chosenCategoryShortName
          // variable's name implies it expects.
          var chosenCategoryShortName = chooseRandomCategory(categories).short_name; // eg: categories[7]
          console.log("Chosen category short name: " + chosenCategoryShortName);
    
          // TODO: STEP 3: Substitute {{randomCategoryShortName}} in the home html snippet with the
          // chosen category from STEP 2. Use existing insertProperty function for that purpose.
          // Look through this code for an example of how to do use the insertProperty function.
          // WARNING! You are inserting something that will have to result in a valid Javascript
          // syntax because the substitution of {{randomCategoryShortName}} becomes an argument
          // being passed into the $dc.loadMenuItems function. Think about what that argument needs
          // to look like. For example, a valid call would look something like this:
          // $dc.loadMenuItems('L')
          // Hint: you need to surround the chosen category short name with something before inserting
          // it into the home html snippet.
          //
          var homeHtmlToInsertIntoMainPage = insertProp(homeHtml, "randomCategoryShortName", " '"+chosenCategoryShortName+"'");
          console.log("Home Html to Insert Into main page: " + homeHtmlToInsertIntoMainPage);
    
    
          // TODO: STEP 4: Insert the the produced HTML in STEP 3 into the main page
          // Use the existing insertHtml function for that purpose. Look through this code for an example
          // of how to do that.
          insertHtml("#main-content", homeHtmlToInsertIntoMainPage);
    
        },
        false); // False here because we are getting just regular HTML from the server, so no need to process JSON.
    }
    
    
    // Given array of category objects, returns a random category object.
    function chooseRandomCategory (categories) {
      // Choose a random index into the array (from 0 inclusively until array length (exclusively))
      var randomArrayIndex = Math.floor(Math.random() * categories.length);
    
      // return category object with that randomArrayIndex
      return categories[randomArrayIndex];
    }
    
  // document.addEventListener("DOMContentLoaded", function(event){

  //   // On first load, show home view
  //   showLoading("#main-content");
  //   $ajaxUtils.sendGetRequest(homeHtml, function(response){
  //       document.querySelector("#main-content").innerHTML = response;
  //   }, false);
  // });

  // Load menu categories
  dc.loadMenuCategories = function(){
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHtml);
  };

  // Builds Html for the categories page based on data from the server
 
  function buildAndShowCategoriesHtml(categories){
    $ajaxUtils.sendGetRequest(categoryTitleHtml, function(categoryTitleHtml){
      $ajaxUtils.sendGetRequest(categoryHtml, function(categoryHtml){
        var categoriesViewHtml = buildCategoriesViewHtml(categories, categoryHtml, categoryTitleHtml);
        insertHtml("#main-content", categoriesViewHtml);
      }, false);
    }, false);
    var categories = JSON.parse(categories);
  }

  // Load menu items view
  dc.onloadMenuItems = function (categoryShort){
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuItemsHTML);
  }

  //Build categories View Html
  function buildCategoriesViewHtml(categories, categoryHtml, categoryTitleHtml){
    var finalHtml = categoryTitleHtml;
    finalHtml += "<section class='row'>";
    
    // Loop over the categories
    for(var i=0; i<categories.length; i++){
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      
      var short_name = categories[i].short_name;
      html = insertProp(html, "name", name);
      
      html = insertProp(html, "short_name", short_name);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  // Builds HTML for the single category page based on data from the server
  function buildAndShowMenuItemsHTML(categoryMenuItems){
    var categoryMenuItems = JSON.parse(categoryMenuItems);
    // console.log(categoryMenuItems.menu_items);

    $ajaxUtils.sendGetRequest(menuItemsTitleHtml, function(menuItemsTitleHtml){
        $ajaxUtils.sendGetRequest(menuItemHtml, function(menuItemHtml){
            var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
            insertHtml("#main-content", menuItemsViewHtml);
        }, false);
    }, false);
  }

  // Using category and menu items data, build menu items view html to be inserted into the page
  function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml){
    
    menuItemsTitleHtml = insertProp(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
    menuItemsTitleHtml = insertProp(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

    var finalHtml = menuItemsTitleHtml;
    
    finalHtml += "<section class='row'>";

    // Loop over menu items
    var menuItems = categoryMenuItems.menu_items;
    
    var catShortName = categoryMenuItems.category.short_name;
       
    for(var i=0; i<menuItems.length; i++){
      var html = menuItemHtml;
      html = insertProp(html, "short_name", menuItems[i].short_name);
      html = insertProp(html, "catShortName", catShortName);
      html = insertProp(html, "name", menuItems[i].name);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
      html = insertProp(html, "description", menuItems[i].description);

      // Add clearfix every second menu item
      if(i % 2 != 0){
        html += "<div class='visible'></div>"
      }
      finalHtml += html;
    }
    finalHtml += "</section>"
    return finalHtml;
  }

  // Insert Item price
  function insertItemPrice(html, pricePropName, priceValue){
    // If not specified, replace with empty string
    if(!priceValue){
      return(insertProp(html, pricePropName, ""));
    }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProp(html, pricePropName, priceValue);
    return html;
  }

  // Appends portion name if it exists
  function insertItemPortionName(html, portionPropName, portionValue){
    // if not specified, return original string
    if(!portionValue){
      return(insertProp(html, portionPropName, ""));
    }

    portionValue = "(" + portionValue + ")";
    html = insertProp(html, portionPropName, portionValue);
    return html;
  }

  global.$dc = dc;
})(window);