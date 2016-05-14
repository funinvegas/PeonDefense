#pragma strict
import SimpleJSON;
import System.Collections.Generic;

class TileProperty { 
	var pName:String = "";
	var pValue:String = "";
}
class TilePoint { 
	var x:Number = 0;
	var y:Number = 0;
}
class TileObject {
	 var height:Number = 0;
	 var objectName:String = "";
	 var properties:Array = new Array();
	 var type:String = "";
	 var visible = true;
	 var width:Number = 0;
	 var x:Number = 0;
	 var y:Number = 0;
	 var polygon:Array = new Array();
	 var ellipse = false;
	 var polyline:Array = new Array();
	 function getProperty( propertyName:String ) {
	 	for( var i = 0; i < properties.length; ++i) {
	 		var p:TileProperty = properties[i] as TileProperty;
	 		if(p.pName == propertyName) {
	 			return p.pValue;
	 		}
	 	}
	 	return null;
	 }
	function InitFromJSON( json:JSONNode) {
		height = json['height'].AsInt || 0;
		objectName = json['name'].Value || "";
		type = json['type'].Value || "";
		visible = json['visible'].AsBool || false;
		width = json['width'].AsInt || 0;
		x = json['x'].AsInt || 0;
		y = json['y'].AsInt || 0;
		ellipse = json['ellipse'].AsBool || false;
		
		var jsonProp = json['properties'].AsObject;
		var i:int = 0;
		var point = new TilePoint();
		if(jsonProp) {
			for(var key in jsonProp.m_Dict.Keys) {
				Debug.Log("keyValue:" + key + " , " + jsonProp.m_Dict[key]);
				var prop = new TileProperty();
				prop.pName = key;
				prop.pValue = jsonProp.m_Dict[key];
				properties.Push(prop);
			}
		}
		var jsonPoly = json['polygon'].AsArray;
		if(jsonPoly) {
			for(i = 0; i < jsonPoly.Count; ++i) {
				point = new TilePoint();
				point.x = jsonPoly[i]['x'].AsInt || 0;
				point.y = jsonPoly[i]['y'].AsInt || 0;
				polygon.Push(point);
			}
		}
		var jsonPolyline = json['polyline'].AsArray;
		if(jsonPolyline) {
			for(i = 0; i < jsonPolyline.Count; ++i) {
				point = new TilePoint();
				point.x = jsonPolyline[i]['x'].AsInt || 0;
				point.y = jsonPolyline[i]['y'].AsInt || 0;
				polyline.Push(point);
			}
		}
	}
}

class PathBox {
	var neighbors:Dictionary.<String, PathBox> = new Dictionary.<String, PathBox>();
	var savedBestPath:String = "";
	var testBestPath:String = "";
	var x:int = -1;
	var y:int = -1;
	var walkable:boolean = false;
	function addNeighbor(name:String, neighbor:int, others:List.<PathBox>) {
		if (neighbor >= 0 && neighbor < others.Count) {
			this.neighbors.Add(name, others[neighbor]);
		}
	}
	function getNeighbor(name:String):PathBox {
		var neighbor:PathBox = null;
		neighbors.TryGetValue(name, neighbor);
		return neighbor;
	}
}

class Pathing {
	var startType:int = 0;
	var endType:int = 0;
	var pathType:int = 0;
	var startLocations:List.<int> = new List.<int>();
	var endLocations:List.<int> = new List.<int>();
	var tilesAcross:int = 0;
	var tilesTall:int = 0;
	var pathTiles:List.<PathBox> = new List.<PathBox>();
	function getAt(x:int, y:int):int {
	}
	function initFromTileLayer(tLayer:TileLayer) {
		this.startType = tLayer.data[0];
		this.endType = tLayer.data[1];
		this.pathType = tLayer.data[2];
		this.tilesAcross = tLayer.width;
		this.tilesTall = tLayer.height;
		var tiles:List.<int> = new List.<int>();
		tiles.Add(0); // startType
		tiles.Add(0); // endType
		tiles.Add(0); // pathType
		for ( var i = 3; i < tLayer.data.Count; ++i) {
			if ( tLayer.data[i] == this.startType ) {
				this.startLocations.Add(i);
				tiles.Add(1);
				Debug.Log("ArrayIndex " + i + " is a start location");
			} else if (tLayer.data[i] == this.endType) {
				this.endLocations.Add(i);
				Debug.Log("ArrayIndex " + i + " is an end location");
				tiles.Add(1);
			} else if (tLayer.data[i] == this.pathType) {
				tiles.Add(1);
			} else {
				if (tLayer.data[i] != 0) {
					Debug.Log("Unexpected type in path layer: " + tLayer.data[i] + " at " + i % this.tilesAcross + "," + Mathf.Floor(i / this.tilesAcross));
				}
				tiles.Add(0);
			}
		}
		Debug.Log("Created TilePathing, " + this.startType + ", " + this.endType + ", " + this.pathType + ", s" + this.startLocations.Count);
		var arrayIndex = -1;
		var pathBox:PathBox;
		var walkableTileCounter:int = 0;
		for (var iY = 0; iY < this.tilesTall; ++iY) {
			for (var iX = 0; iX < this.tilesAcross; ++iX) {
				arrayIndex = iY * this.tilesAcross + iX;
				pathBox = new PathBox();
				pathBox.x = iX;
				pathBox.y = iY;
				pathBox.walkable = tiles[arrayIndex] != 0;
				if (pathBox.walkable) {
					//Debug.Log("Tile " + iX + "," + iY + " index:" + arrayIndex + " is walkable");
					walkableTileCounter++;
				}
				/*
				if (pathTiles.Count != arrayIndex) {
					Debug.Log("Expected " + pathTiles.Count + " to match " + arrayIndex);
				}*/
				pathTiles.Add(pathBox);
			}
		}
		/*
		for (var iEnd:int = 0; iEnd < this.endLocations.Count; ++iEnd) {
			if (!pathTiles[this.endLocations[iEnd]].walkable) {
				Debug.Log("Why is endpoint " + this.endLocations[iEnd] + " not walkable;");
			}
		}
		for (var iStart:int = 0; iStart < this.startLocations.Count; ++iStart) {
			if (!pathTiles[this.startLocations[iStart]].walkable) {
				Debug.Log("Why is start " + this.startLocations[iStart] + " not walkable;");
			}
		}*/
		Debug.Log("Path layer has " + walkableTileCounter + " walkable tiles");
		for (iX = 0; iX < this.tilesAcross; ++iX) {
			for (iY = 0; iY < this.tilesTall; ++iY) {
				arrayIndex = iY * this.tilesAcross + iX;
				pathBox = pathTiles[arrayIndex];
				// Add up,down,left,right first so they are checked before diag
				var above:int = (iY-1) * this.tilesAcross + (iX-0);
				var below:int = (iY+1) * this.tilesAcross + (iX-0);
				var left:int = (iY-0) * this.tilesAcross + (iX-1);
				var right:int = (iY-0) * this.tilesAcross + (iX+1);
				// Add diag after so they are checked last.
				var aboveLeft:int = (iY-1) * this.tilesAcross + (iX-1);
				var belowLeft:int = (iY+1) * this.tilesAcross + (iX-1);
				var aboveRight:int = (iY-1) * this.tilesAcross + (iX+1);
				var belowRight:int = (iY+1) * this.tilesAcross + (iX+1);
				pathBox.addNeighbor("above", above, pathTiles);
				pathBox.addNeighbor("below", below, pathTiles);
				pathBox.addNeighbor("left", left, pathTiles);
				pathBox.addNeighbor("right", right, pathTiles);
				pathBox.addNeighbor("aboveLeft", aboveLeft, pathTiles);
				pathBox.addNeighbor("aboveRight", aboveRight, pathTiles);
				pathBox.addNeighbor("belowLeft", belowLeft, pathTiles);
				pathBox.addNeighbor("belowRight", belowRight, pathTiles);
			}
		}
	}
}

class TileLayer {

	var data:List.<int> = new List.<int>();
	var height:Number = 0;
	var layerName:String = "";
	var opacity:Number = 1;
	var type:String = "";
	var visible = true;
	var width:Number = 0;
	var x:Number = 0;
	var y:Number = 0;
	var objects:Array = new Array();
	var pathing:Pathing = new Pathing();

	function InitFromJSON (json:JSONNode) {
		var dataArray:JSONArray = json['data'].AsArray;
		var i = 0;
		for(i = 0; i < dataArray.Count; ++i) {
			data.Add(dataArray[i].AsInt);
		}
		height = json['height'].AsInt || 0;
		layerName = json['name'].Value || "";
		opacity = json['opacity'].AsInt || 0;
		type = json['type'].Value || "";
		visible = json['visible'].AsBool || false;
		width = json['width'].AsInt || 0;
		x = json['x'].AsInt || 0;
		y = json['y'].AsInt || 0;
		var objectArray = json['objects'];
		if (objectArray) {
			for(i = 0; i < objectArray.Count; ++i) {
				var tileObject = new TileObject();
				tileObject.InitFromJSON(objectArray[i]);
				objects.Push(tileObject);
			}
		}	
	}
	
	function InitPathing () {
		this.pathing.initFromTileLayer(this);
	}

	function Start () {

	}

	function Update () {

	}
}