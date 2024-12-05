//The URIs of the REST endpoint
RAAURI = "";
CIAURI = "";

DIAURI0 = "";
DIAURI1 = "";


//Handlers for button clicks
$(document).ready(function() {

 
  $("#retAssets").click(function(){

      //Run the get asset list function
      getAssetList();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  
  //Construct JSON Object for new item


  //Convert to a JSON String


  //Post the JSON string to the endpoint, note the need to set the content type header

}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getAssetList(){

  //Replace the current HTML in that div with a loading message
  $('#AssetList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');

  //Get the JSON from the RAA API 
  $.getJSON(RAAURI, function( data ) {

    //Create an array to hold all the retrieved assets
    var items = [];
      
    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    

      //Clear the assetlist div 
      $('#AssetList').empty();

      //Append the contents of the items array to the AssetList Div
      
    });
}

//A function to delete an asset with a specific ID.
//The id paramater is provided to the function as defined in the relevant onclick handler
function deleteAsset(id){

}
