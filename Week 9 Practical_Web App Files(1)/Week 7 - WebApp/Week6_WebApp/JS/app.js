//The URIs of the REST endpoint
IUPS = "https://prod-13.centralus.logic.azure.com:443/workflows/83fc1353a740461d8d7c0efcdbfca417/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=thGzX4JSsBzH2M4-ctyw3-3a-wkSSpTdEgrZH2FuSXw";
RAI = "https://prod-23.northcentralus.logic.azure.com:443/workflows/f094b174e2c64359b5fcacf267fac354/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=iksL1unUcJd5F4xpJqIwn_Q4r2r1vN8sU5GkSqo-xxI";

BLOB_ACCOUNT = "cosmosdbgoscroll";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  
  //Create a form data object
  submitData = new FormData();

  //Get form variables and append them to the form data object
  submitData.append('FileName', $('#FileName').val());
  submitData.append('userID', $('#userID').val());
  submitData.append('userName', $('#userName').val());
  submitData.append('File', $("#UpFile")[0].files[0]);

  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){
    }
  });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages() {

  // Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span></div>');

  $.getJSON(RAI, function(data) {
    // Create an array to hold all the retrieved assets
    var items = [];

    // Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function(key, val) {
      items.push("<hr />");
      items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "' width='400'/> <br />");
      items.push("File : " + val["fileName"] + "<br />");
      items.push("Uploaded by: " + val["userName"] + " (user id: " + val["userID"] + ")<br />");
      items.push("<hr />");
    });

    // Clear the assetlist div
    $('#ImageList').empty();

    // Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#ImageList");
  });
}

