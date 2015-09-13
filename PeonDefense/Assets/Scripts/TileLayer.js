#pragma strict
import SimpleJSON;
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

class TileLayer {

	var data:Array = new Array();
	var height:Number = 0;
	var layerName:String = "";
	var opacity:Number = 1;
	var type:String = "";
	var visible = true;
	var width:Number = 0;
	var x:Number = 0;
	var y:Number = 0;
	var objects:Array = new Array();

	function InitFromJSON (json:JSONNode) {
		var dataArray:JSONArray = json['data'].AsArray;
		var i = 0;
		for(i = 0; i < dataArray.Count; ++i) {
			data.Push(dataArray[i].AsInt);
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

	function Start () {

	}

	function Update () {

	}
}