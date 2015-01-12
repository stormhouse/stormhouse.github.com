/**
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-9-12
 * Time: 下午2:03
 * To change this template use File | Settings | File Templates.
 */
//global variables
var svgSVGObj;
var svgDoc;
var buttonGroup;
var ulXCorner;
var ulYCorner;
var origPixSize;
var pixSize;
var offsetX;
var offsetY;
var refCoordRect;
var ratioY;
var pixHeight;
var animState = "true";
var toggleAnimText;
var speedUpText;
var speedDownText;
var textCurrentSpeed;
var curSpeed = 10;
var animMotionZurGenRef;
var animTransZurGenRef;
var textAnimZurRef;
var textAnimBerRef;
var textAnimGenRef;

function initMap(evt) {
  // Retrieve the SVG document object:
  var directTarget = evt.getTarget();
  if( directTarget.getNodeType() != 9 ) // if not DOCUMENT_NODE
    svgDoc = directTarget.getOwnerDocument();
  else
    svgDoc = directTarget;

  //reference to coordinate box (for later scaling and translating) and text-elements
  svgSVGObj = svgDoc.getDocumentElement();
  buttonGroup = svgDoc.getElementById("buttonGroup");
  toggleAnimText = svgDoc.getElementById("toggleAnimText");
  toggleAnimText = toggleAnimText.getFirstChild();
  speedUpText = svgDoc.getElementById("speedUpText");
  speedUpText = speedUpText.getFirstChild();
  speedDownText = svgDoc.getElementById("speedDownText");
  speedDownText = speedDownText.getFirstChild();
  textCurrentSpeed = svgDoc.getElementById("textCurrentSpeed");
  textCurrentSpeed = textCurrentSpeed.getFirstChild();

  //get references to animation objects
  animMotionZurGenRef = svgDoc.getElementById("animMotionZurGen");
  animTransZurGenRef = svgDoc.getElementById("animTransZurGen");
  textAnimZurRef = svgDoc.getElementById("textAnimZur");
  textAnimBerRef = svgDoc.getElementById("textAnimBer");
  textAnimGenRef = svgDoc.getElementById("textAnimGen");

  //initialize coordinates, pixsize etc.
  var viewbox = new String(svgSVGObj.getAttribute("viewBox"));
  var viewboxes = viewbox.split(' ');
  ulXCorner = viewboxes[0];
  ulYCorner = viewboxes[1];
  var width = viewboxes[2];
  var height = viewboxes[3];
  var pixWidth = svgSVGObj.getAttribute("width");
  pixHeight = svgSVGObj.getAttribute("height");
  origPixSize = width / pixWidth;

  //determine ratio for coordinate box placement y
  translateY = getTranslate("buttonGroup","y");
  ratioY = translateY / height;

  //call resetCoords();
  resetCoords();
}

function resetCoords() {
  //get current zoom and pan values
  var scale = svgSVGObj.getCurrentScale();
  var trans = svgSVGObj.getCurrentTranslate();
  var transx = trans.getX();
  var transy = trans.getY();
  //reset offset-values and pixSize according to current scale and translate
  pixSize = origPixSize / scale;
  offsetX = parseFloat(ulXCorner) - transx * pixSize;
  offsetY = parseFloat(ulYCorner) - transy * pixSize;

  //to determine y-position, x-position is always the same ...
  var height = pixHeight * pixSize;
  var newScale = 1 / parseFloat(scale);
  var newTranslateX = offsetX;
  var newTranslateY = offsetY + height * ratioY; //position always relative to bottom of viewBox
  newtransform = "translate(" + newTranslateX + " " + newTranslateY + ") " + "scale(" + newScale + ")";

  //reset position and scale for the showCoordsgroup so it always stays at the same place
  buttonGroup.setAttribute('transform', newtransform);
}

function getTranslate(myElement,xOrY) {
  //get reference to element
  element = svgDoc.getElementById(myElement);

  //first get transform value of coordinate box
  var curTransform = element.getAttribute("transform");
  curTransform = new String(curTransform); //Wert in ein String umwandeln
  //no fear from Regular expressions ... just copy it, I copied it either ...
  var translateRegExp=/translate\(([-+]?\d+)(\s*[\s,]\s*)([-+]?\d+)\)\s*/;
  //This part extracts the translation-part from the overall transform-string
  if (curTransform.length != 0)
  {
    var result = curTransform.match(translateRegExp);
    if (result == null || result.index == -1)
    {
      var oldTranslateX = 0;
      var oldTranslateY = 0;
    }
    else
    {
      var oldTranslateX = result[1];
      var oldTranslateY = result[3];
    }
  }
  if (xOrY == "x") {
    return oldTranslateX;
  }
  if (xOrY == "y") {
    return oldTranslateY;
  }
}

function toggleButton(butName,status) {
  //alert(butName);
  var myButDark = svgDoc.getElementById(butName + "Dark");
  var myButWhite = svgDoc.getElementById(butName + "White");

  var myButDarkStyle = myButDark.getStyle();
  var myButWhiteStyle = myButWhite.getStyle();

  if (status == "down") {
    myButDarkStyle.setProperty("fill","white");
    myButWhiteStyle.setProperty("fill","darkgray");
  }
  if (status == "up") {
    myButDarkStyle.setProperty("fill","darkgray");
    myButWhiteStyle.setProperty("fill","white");
  }
}

function toggleAnimation() {
  if (animState == "true") {
    svgSVGObj.pauseAnimations();
    animState = "false";
    toggleAnimText.setData("Start Animation");
  }
  else {
    svgSVGObj.unpauseAnimations();
    animState = "true";
    toggleAnimText.setData("Stop Animation");
  }
}

function speedChange(whatToChange) {
  switch (whatToChange) {
    case "up" :
      curSpeed = curSpeed - 2;
      break;
    case "down" :
      curSpeed = curSpeed + 2;
      break;
  }
  if (curSpeed < 2) {
    alert("You have reached maximum speed!\nYou cannot go any faster!\nSetting default duration to 10 seconds!");
    curSpeed = 10;
  }
  var curSpeedString = String(curSpeed);
  textCurrentSpeed.setData(curSpeedString);
  animMotionZurGenRef.setAttribute('dur',curSpeedString);
  animTransZurGenRef.setAttribute('dur',curSpeedString);
  textAnimZurRef.setAttribute('dur',curSpeedString);
  textAnimBerRef.setAttribute('dur',curSpeedString);
  textAnimGenRef.setAttribute('dur',curSpeedString);
}