var canvas;  
var ctx;
var WIDTH, HEIGHT, centerX, centerY;
var lArmRad = 100;
var rArmRad = 100;
var lPoiRad = 75;
var rPoiRad = 75;
var lArmSpd = -3; // in deg/update
var rArmSpd = 3; 
var lPoiSpd = 9; // in deg/update
var rPoiSpd = -9;
var lTailLen = 100;
var rTailLen = 100;
var updateInterval = 50; // in ms
var shoulderSpacing = 70;
var lArmTh = -90; // in deg
var rArmTh = -90; // in deg
var lPoiTh = -90; // in deg
var rPoiTh = -90; // in deg
var cSize = 2;
var hSize = 2;
var pSize = 2;
var lTailArray = new Array();
var rTailArray = new Array();
var lPause = 0;
var rPause = 0;
var lColor = 0;
var rColor = 4;
var lHandDir;
var lPoiDir;
var lMode;
var plane;
var rHandDir;
var rPoiDir;
var rMode;

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  //ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function tailCircle(x,y,r,i,num) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  //ctx.fill();
  ctx.lineWidth = 2;
  //ctx.strokeStyle = "black";
  grayValue = Math.round(255 * (1 - i / num))
  grayStr = "rgb(" + grayValue + "," + grayValue + "," + grayValue + ")"
  ctx.strokeStyle = grayStr;
  ctx.stroke();
}

function colorTailCircle(x,y,r,i,num,color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  //ctx.fill();
  ctx.lineWidth = 2;
  //ctx.strokeStyle = "black";
  colorValue = Math.round(255 * (1 - i / num))
  if (color & 1)
  {
    rVal = 255
  }
  else
  {
    rVal = colorValue
  }
  if (color & 2)
  {
    gVal = 255
  }
  else
  {
    gVal = colorValue
  }
  if (color & 4)
  {
    bVal = 255
  }
  else
  {
    bVal = colorValue
  }
  colorStr = "rgb(" + rVal + "," + gVal + "," + bVal + ")"
  ctx.strokeStyle = colorStr;
  ctx.stroke();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function twoLines(x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init() {
  canvas = document.getElementById("canvas");
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  ctx = canvas.getContext("2d");
  
  // everything after the ?
  urlArgs = window.location.search.substring(1);
  if (urlArgs != "")
  {
    // Override the defaults with values from URL
    args = urlArgs.split(":");
    //alert(args.toString());
    lArmRad = parseInt  (args[0]);
    rArmRad = parseInt  (args[1]);
    lPoiRad = parseInt  (args[2]);
    rPoiRad = parseInt  (args[3]);
    lArmSpd = parseFloat(args[4]);
    rArmSpd = parseFloat(args[5]);
    lPoiSpd = parseFloat(args[6]);
    rPoiSpd = parseFloat(args[7]);
    lArmTh = parseFloat (args[8]);
    rArmTh = parseFloat (args[9]);
    lPoiTh = parseFloat (args[10]);
    rPoiTh = parseFloat (args[11]);
    lTailLen = parseInt (args[12]);
    rTailLen = parseInt (args[13]);
    updateInterval = parseInt(args[14]);
    shoulderSpacing = parseInt(args[15]);
  }
  
  // Initialize form values
  document.flowerArgs.lArmRad.value = lArmRad.toString();
  document.flowerArgs.rArmRad.value = rArmRad.toString();
  document.flowerArgs.lPoiRad.value = lPoiRad.toString();
  document.flowerArgs.rPoiRad.value = rPoiRad.toString();
  document.flowerArgs.lArmSpd.value = lArmSpd.toString();
  document.flowerArgs.rArmSpd.value = rArmSpd.toString();
  document.flowerArgs.lPoiSpd.value = lPoiSpd.toString();
  document.flowerArgs.rPoiSpd.value = rPoiSpd.toString();
  document.flowerArgs.lArmTh.value = lArmTh.toString();
  document.flowerArgs.rArmTh.value = rArmTh.toString();
  document.flowerArgs.lPoiTh.value = lPoiTh.toString();
  document.flowerArgs.rPoiTh.value = rPoiTh.toString();
  document.flowerArgs.lTailLen.value = lTailLen.toString();
  document.flowerArgs.rTailLen.value = rTailLen.toString();
  document.flowerArgs.updateInterval.value = updateInterval.toString();
  document.flowerArgs.shoulderSpacing.value = shoulderSpacing.toString();
  // Initialize mode menus
  lHandDir = document.flowerModes.lHandDir;
  lPoiDir = document.flowerModes.lPoiDir;
  lMode = document.flowerModes.lMode;
  plane = document.flowerModes.plane;
  rHandDir = document.flowerModes.rHandDir;
  rPoiDir = document.flowerModes.rPoiDir;
  rMode = document.flowerModes.rMode;
  syncModeMenus();
  return setInterval(draw, updateInterval);
}

function syncModeMenus() {
  if (lArmSpd > 0)
  {
    lHandDir.value = "1";
  }
  else
  {
    lHandDir.value = "0";
  }

  if (lArmSpd * lPoiSpd > 0)
  {
    lPoiDir.value = "0";
  }
  else
  {
    lPoiDir.value = "1";
  }

  if (lPoiDir.value == "0")
  {
    // inspin
    switch(lPoiSpd / lArmSpd)
    {
      case 1:
        // extension
	lMode.value = "0";
        break;
	
      case 2:
        // 1-petal
	lMode.value = "1";
        break;

      case 3:
        // 2-petal
	lMode.value = "2";
        break;

      case 4:
        // 3-petal
	lMode.value = "3";
        break;
	
      case 5:
        // 4-petal
	lMode.value = "4";
        break;

      case 6:
        // 5-petal
	lMode.value = "5";
        break;
	
      case 7:
        // 6-petal
	lMode.value = "6";
        break;
	
      default:
        // Unknown
	lMode.value = "-1";
        break;
    }
  }
  else
  {
    // antispin
    switch(lPoiSpd / lArmSpd)
    {
      case -1:
        // 1-petal
	lMode.value = "1";
        break;

      case -2:
        // 3-petal
	lMode.value = "3";
        break;
	
      case -3:
        // 4-petal
	lMode.value = "4";
        break;

      case -4:
        // 5-petal
	lMode.value = "5";
        break;
	
      case -5:
        // 6-petal
	lMode.value = "6";
        break;
	
      default:
        // Unknown
	lMode.value = "-1";
        break;
     }
  }
  
  if (rArmSpd > 0)
  {
    rHandDir.value = "1";
  }
  else
  {
    rHandDir.value = "0";
  }
  
  if (rArmSpd * rPoiSpd > 0)
  {
    rPoiDir.value = "0";
  }
  else
  {
    rPoiDir.value = "1";
  }

  if (rPoiDir.value == "0")
  {
    // inspin
    switch(rPoiSpd / rArmSpd)
    {
      case 1:
        // extension
	rMode.value = "0";
        break;
	
      case 2:
        // 1-petal
	rMode.value = "1";
        break;

      case 3:
        // 2-petal
	rMode.value = "2";
        break;

      case 4:
        // 3-petal
	rMode.value = "3";
        break;
	
      case 5:
        // 4-petal
	rMode.value = "4";
        break;

      case 6:
        // 5-petal
	rMode.value = "5";
        break;
	
      case 7:
        // 6-petal
	rMode.value = "6";
        break;
	
      default:
        // Unknown
	rMode.value = "-1";
        break;
    }
  }
  else
  {
    // antispin
    switch(rPoiSpd / rArmSpd)
    {
      case -1:
        // 1-petal
	rMode.value = "1";
        break;

      case -2:
        // 3-petal
	rMode.value = "3";
        break;
	
      case -3:
        // 4-petal
	rMode.value = "4";
        break;

      case -4:
        // 5-petal
	rMode.value = "5";
        break;
	
      case -5:
        // 6-petal
	rMode.value = "6";
        break;
	
      default:
        // Unknown
	rMode.value = "-1";
        break;
     }
  }
  
  if (shoulderSpacing != 0)
  {
    plane.value = "1";
  }
  else
  {
    plane.value = "0";
  }
  
}

function pauseLeft(form) {
  if (lPause == 0)
  {
    lPause = 1;
    form.lPauseButton.value = "Resume Left";
  }
  else
  {
    lPause = 0;
    form.lPauseButton.value = "Pause Left";
  }  
}

function pauseRight(form) {
  if (rPause == 0)
  {
    rPause = 1;
    form.rPauseButton.value = "Resume Right";
  }
  else
  {
    rPause = 0;
    form.rPauseButton.value = "Pause Right";
  }  
}

function lColorChange(color) {
  lColor = Number(color);
}

function rColorChange(color) {
  rColor = Number(color);
}

function updateValues(form) {
  lArmRad = parseInt(form.lArmRad.value);
  lPoiRad = parseInt(form.lPoiRad.value);
  lArmSpd = parseFloat(form.lArmSpd.value);
  lPoiSpd = parseFloat(form.lPoiSpd.value);
  rArmRad = parseInt(form.rArmRad.value);
  rPoiRad = parseInt(form.rPoiRad.value);
  rArmSpd = parseFloat(form.rArmSpd.value);
  rPoiSpd = parseFloat(form.rPoiSpd.value);
  lTailLen = parseInt(form.lTailLen.value);
  rTailLen = parseInt(form.rTailLen.value);
  updateInterval = parseInt(form.updateInterval.value);
  //shoulderSpacing = form.shoulderSpacing.value;
  syncModeMenus();
}

function restart(form) {
  //updateValues(form);
  shoulderSpacing = parseInt(form.shoulderSpacing.value);
  lArmTh = parseFloat(form.lArmTh.value);
  lPoiTh = parseFloat(form.lPoiTh.value);
  lTailArray = new Array();
  rArmTh = parseFloat(form.rArmTh.value);
  rPoiTh = parseFloat(form.rPoiTh.value);
  rTailArray = new Array();
}

function exportAddr(form) {
  //webAddr = window.location.protocol + "://" + window.location.host + window.location.pathname;
  webAddr = window.location.protocol + "//" + window.location.host + window.location.pathname + "?";
  webAddr += form.lArmRad.value + ":" + form.rArmRad.value + ":" + form.lPoiRad.value + ":" + form.rPoiRad.value + ":";
  webAddr += form.lArmSpd.value + ":" + form.rArmSpd.value + ":" + form.lPoiSpd.value + ":" + form.rPoiSpd.value + ":";
  webAddr += form.lArmTh.value + ":" + form.rArmTh.value + ":" + form.lPoiTh.value + ":" + form.rPoiTh.value + ":";
  webAddr += form.lTailLen.value + ":" + form.rTailLen.value + ":" + form.updateInterval.value + ":" + form.shoulderSpacing.value;
  //alert(webAddr);
  copyToClipboard(webAddr);
}

function draw() {
  clear();
  //ctx.fillStyle = "#FAF7F8";
  //rect(0,0,WIDTH,HEIGHT);
  
  lShoulderX = centerX - (shoulderSpacing / 2.0);
  rShoulderX = centerX + (shoulderSpacing / 2.0);
  lShoulderY = centerY;
  rShoulderY = centerY;
  //
  lhPosX = lShoulderX + lArmRad * Math.cos(lArmTh * (Math.PI / 180.0));
  lhPosY = lShoulderY - lArmRad * Math.sin(lArmTh * (Math.PI / 180.0));
  lpPosX = lhPosX + lPoiRad * Math.cos(lPoiTh * (Math.PI / 180.0));
  lpPosY = lhPosY - lPoiRad * Math.sin(lPoiTh * (Math.PI / 180.0));
  rhPosX = rShoulderX + rArmRad * Math.cos(rArmTh * (Math.PI / 180.0));
  rhPosY = rShoulderY - rArmRad * Math.sin(rArmTh * (Math.PI / 180.0));
  rpPosX = rhPosX + rPoiRad * Math.cos(rPoiTh * (Math.PI / 180.0));
  rpPosY = rhPosY - rPoiRad * Math.sin(rPoiTh * (Math.PI / 180.0));
  //
  circle(lShoulderX, lShoulderY, cSize)
  circle(rShoulderX, rShoulderY, cSize)
  twoLines(lShoulderX, lShoulderY, lhPosX, lhPosY, lpPosX, lpPosY);
  twoLines(rShoulderX, rShoulderY, rhPosX, rhPosY, rpPosX, rpPosY);
  circle(lhPosX, lhPosY, hSize);
  circle(rhPosX, rhPosY, hSize);
  circle(lpPosX, lpPosY, pSize);
  circle(rpPosX, rpPosY, pSize);

  var maxLength;
  if (lTailArray.length < rTailArray.length)
  {
    maxLength = rTailArray.length;
  }
  else
  {
    maxLength = lTailArray.length;
  }

  var i;
  // decrementing is better for seeing a short tail that overlaps with a long one
  //for (i=maxLength-1; i>=0; i--)
  // incrementing is better for long, overlapping tails  
  for (i=0; i<maxLength; i++)
  {
    // 0 = black
    // 1 = red
    // 2 = green
    // 3 = yellow
    // 4 = blue
    // 5 = magenta
    // 6 = teal
    // 7 = white (invisible)
    if (i < rTailArray.length)
    {
      colorTailCircle(rTailArray[i].x, rTailArray[i].y, pSize, i, rTailArray.length, rColor);
    }
    
    if (i < lTailArray.length)
    {
      colorTailCircle(lTailArray[i].x, lTailArray[i].y, pSize, i, lTailArray.length, lColor);
    }
  }

  if (lPause == 0)
  {
    lArmTh = lArmTh + lArmSpd;  // deg
    lPoiTh = lPoiTh + lPoiSpd;  // deg
  }
  if (rPause == 0)
  {
    rArmTh = rArmTh + rArmSpd;  // deg
    rPoiTh = rPoiTh + rPoiSpd;  // deg
  }
  
  coordObj = new Object()
  coordObj.x = lpPosX
  coordObj.y = lpPosY
  lTailArray.push(coordObj)

  coordObj = new Object()
  coordObj.x = rpPosX
  coordObj.y = rpPosY
  rTailArray.push(coordObj)

  if (lTailArray.length > lTailLen)
    lTailArray.shift();
  if (lTailArray.length > lTailLen)
    lTailArray.shift();

  if (rTailArray.length > rTailLen)
    rTailArray.shift();
  if (rTailArray.length > rTailLen)
    rTailArray.shift();

}

function copyToClipboard (text) {
	  window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
}

init();
