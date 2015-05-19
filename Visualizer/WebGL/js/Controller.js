/** Controller class. It is responsible for server queries and input delegation.
 * @param engine WebGL engine reference.*/
function Controller(engine) {


  /** Requests new data from a server via AJAX POST.
   * @param url The server address to send POST request to. 
   * @param params POST parameters. 
   * @param process Function delegate to process the updates. */
  var queryData = function(url, params, process) {
    var request = new XMLHttpRequest();
    params = "type=XHR-LP-Data";
    request.open("POST", url, true); // Open POST request.
    request.timeout = 45000;         // A half minute until timeout.

    // Send the proper header information along with the request
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", params.length);

    // Answer received. Process it and send new request.
    request.onload = function() {
      process(request.responseText);
      queryData(url, params, process);
    }

    // If timeout occurs, send new request.
    request.ontimeout = function () {
      process("<p style='color:red'>[Keine Serverantwort]</p>");
      queryData(url, params, process);
    }
    request.send(params);
  }



  function serverReachable(url) {
    var x = new XMLHttpRequest(), s;
    try {
      x.open("HEAD", url, false);
      x.send();
      s = x.status;
      return (s >= 200 && s < 300 || s === 304);
    } catch (ex) {
      return false;
    }
  }



  function process(response) {
    var json = JSON.parse(response);

    var accY = (json.HeightAxisY)? 2 : 1;
    var accZ = (json.HeightAxisY)? 1 : 2;

    document.getElementById("output").innerHTML =
      "<table>" +
      "  <tr><td>Simulationsschritt:</td><td>" + json.Tick + "</td></tr>" +
      "  <tr><td>Agentenanzahl:</td><td>" + json.AgentCount + "</td></tr>" +
      "  <tr><td>Umweltdimension:</td><td>("+json.Extents[0]+", "+json.Extents[accY]+")</td></tr>" +
      "</table>";
    for (var i = 0; i < json.Agents.length; i++) {
      var agent = json.Agents[i];
      if (world.ContainsObject(agent.Id)) world.UpdateObject(agent.Id, agent.Pos[0], agent.Pos[accY], agent.Pos[accZ], agent.Yaw, agent.Pitch);
      else world.AddObject(agent.Id, agent.Pos[0], agent.Pos[accY], agent.Pos[accZ], agent.Yaw, agent.Pitch);
    }
  }



  /** Controller constructor. */
  function constr() {

    var url = "index.html";
    var params = "fname=Indiana&lname=Jones&hates=snakes";
    //var proc = function (response) {
    //  document.getElementById("output").innerHTML = response;
    //}
    if (serverReachable(url)) queryData(url, params, process);
  }; constr();


  this.SetConnectionMode = function(mode) {
  }


}