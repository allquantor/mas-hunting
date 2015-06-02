/** Controller for GUI event handler and text field update functions. */
function GuiController(cameraController, connectionController) {

  /** UI controller constructor. */
  function constr() {
    setEventHandler();

    addEventListener("Camera_PositionChanged", function(e) {
      document.getElementById("position").innerHTML = "(" + e.posX.toFixed(1) + ", " + e.posY.toFixed(1) + ", " + e.posZ.toFixed(1) + ")";
      document.getElementById("input_position").value = "(" + e.posX.toFixed(1) + ", " + e.posY.toFixed(1) + ", " + e.posZ.toFixed(1) + ")";
    });


  } constr();



  /** Sets event handlers for several DOM input elements. */
  function setEventHandler() {

    // Show and hide the settings div.
    document.getElementById("link_showSettings").onclick = function() {
      document.getElementById("settings").style.display = "block";
      this.style.display = "none";
      return false;
    };
    document.getElementById("link_hideSettings").onclick = function () {
      document.getElementById("settings").style.display = "none";
      document.getElementById("link_showSettings").style.display = "block";
      return false;
    };

    // Add event handler to the input fields. 
    addInputListener("input_fps", function() {alert("FPS settings not enabled yet!");}, checkInput0100);
    addInputListener("input_speed",          cameraController.SetCameraSpeed, checkInput0100);
    addInputListener("input_lockAxes",       cameraController.LockAxesFor2D);
    addInputListener("input_connectionType", connectionController.SetConnectionMode);
    addInputListener("input_position", function(input) {
      var arr = input.replace("(", "").replace(")", "").replace(/\s/g, "").split(",");
      cameraController.SetPosition(parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]));
    }, checkPosition);
  };



  /** Adds a listener and processing function to an input field. 
   * @param id Input element ID. 
   * @param process Value processing function.
   * @param eval Evaluation function (for text field inputs). */
  function addInputListener(id, process, eval) {
    var field = document.getElementById(id);
    switch (field.type) {
      case "text": {
        field.onkeydown = function (event) {
          if (event.keyCode == 13) this.blur();
        };
        field.onblur = function () {
          if (eval !== undefined) { // Input check first.
            if (eval(this.value)) {
              field.style.color = "";
              process(this.value);
            }
            else field.style.color = "red";             
          }
          else process(this.value); 
        };
        break;
      }
      case "checkbox": {
        field.onclick = function () {
          process(this.checked);
        }
        break;
      }
      default: {
        if (field.type.indexOf("select") > -1) {
          field.onchange = function () {
            process(this.value);
          }
        }
        break;
      }
    }
  }
  


  function checkPosition(input) {
    input = input.replace("(", "");
    input = input.replace(")", "");
    input = input.replace(" ", "");
    var arr = input.split(",");
    if (arr.length == 3 && isNumeric(arr[0]) && isNumeric(arr[1]) && isNumeric(arr[2])) return true;
    return false;
  }


  function checkInput0100(input) {
    if (isNumeric(input) && input > 0 && input < 100) return true;
    return false;
  }


  function isNumeric(input) {
    return (input - 0) == input && ('' + input).trim().length > 0;
  }
}