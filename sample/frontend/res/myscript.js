// Use strict mode
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";


// on ready function (called when DOM is loaded)
$(function() { 

    console.log("Ready ... DOM loaded!");

    let divResult = $("#result");
    let apiPath = "../backend/api.php"

    $("#txtCreateUser").text(JSON.stringify({
        email: "john.doe@localhost",
        first_name: "John",
        last_name: "Doe" }, undefined, 2));


    /** btnAllUsers clicked ... load all users */
    $("#btnAllUsers").on("click", function() {
        divResult.empty();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: apiPath + "?users",
            success: function(response) {
                divResult.text(JSON.stringify(response, undefined, 2));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                divResult.text("Error:\n" + JSON.stringify(xhr, undefined, 2));
            }
        });
    });


    /** btn clicked ... load user by ID */
    $("#btnUserById").on("click", function() {
        divResult.empty();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: apiPath + "?user=" + $("#inputUserId").val(),
            success: function(response) {
                divResult.text(JSON.stringify(response, undefined, 2));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                divResult.text("Error:\n" + JSON.stringify(xhr, undefined, 2));
            }
        });
    });


    /** btn create user 
     */
    $("#btnCreateUser").on("click", function() {
        divResult.empty();
        $.ajax({
            type: "post",
            dataType: "json",
            url: apiPath + "?user",
            data: $("#txtCreateUser").val(),
            success: function(response) {
                divResult.text(JSON.stringify(response, undefined, 2));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                divResult.text("Error:\n" + JSON.stringify(xhr, undefined, 2));
            }
        });
    });


    /** btn delete user 
     */
     $("#btnDelete").on("click", function() {
        divResult.empty();
        $.ajax({
            type: "delete", 
            dataType: "json",
            url: apiPath + "?user=" + $("#inputDelId").val(),
            success: function(response, status, xhr) {
                divResult.text(JSON.stringify(xhr, undefined, 2));
            },
            error: function (xhr, ajaxOptions, thrownError) {
                divResult.text("Error:\n" + JSON.stringify(xhr, undefined, 2));
            }
        });
    });


});


