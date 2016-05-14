#pragma strict
import System.IO;
import SimpleJSON;

//var mapFile:String = "";
var assetPath:String = "";
var mapAsset:TextAsset = null;
//var test:List.<String> = null;

private static var spriteTemplate:GameObject = null;
//var physicsTemplate:Transform = null;
private var tileIDToSpriteMap: Array = new Array();
private var tileLayers:Array = new Array();
static var MaxLeftPixel:Number = 0;
static var MaxRightPixel:Number = 1;
static var MaxTopPixel:Number = 0;
static var MaxBottomPixel:Number = 1;

static var PixelsPerUnit:Number = 1;
static var TileDrawOffset:Number = 16 / PixelsPerUnit;

function Start () {
}

function theStart () {
	if (!spriteTemplate) {
		spriteTemplate = new GameObject();
		spriteTemplate.AddComponent.<SpriteRenderer>();
		spriteTemplate.transform.parent = null;
		spriteTemplate.name = "Sprite Template";
	}
	if (mapAsset) {
		//var fileName = Application.dataPath + mapFile;
		//Debug.Log("Reading Map File: " + fileName);
		//var fileText = ReadFile(fileName);
		var fileText = mapAsset.text;
		var fileData = JSON.Parse(fileText);
		Debug.Log(fileData);
		//var pathToMap = mapFile.Substring(0, Mathf.Max(mapFile.LastIndexOf('\\'), mapFile.LastIndexOf('/')) + 1);
		LoadTileSets(fileData['tilesets'].AsArray, assetPath);
		LoadTileLayers(fileData['layers'].AsArray);
	    LoadPaths();

		DrawTileLayers();
		
		MaxLeftPixel = transform.position.x - TileDrawOffset;
		MaxRightPixel = transform.position.x + fileData['width'].AsInt * fileData['tilewidth'].AsInt / PixelsPerUnit - TileDrawOffset;
		MaxTopPixel = transform.position.y + TileDrawOffset;
	  	MaxBottomPixel = transform.position.y - ((fileData['height'].AsInt * fileData['tileheight'].AsInt / PixelsPerUnit) - TileDrawOffset);


	
//	LoadPhysics();
	
//	LoadPlayerCharector();

//	LoadMonsters();
	 
	 	Debug.Log(" Screen width = " + Screen.width);
	 	Debug.Log(" Screen height = " + Screen.height);
	 // set the camera to the correct orthographic size (so scene pixels are 1:1)
	
	// if the resoltuion is 1900x1024.... a 32x 32 is taller than wide.
	
//	var s_baseOrthographicSize = Camera.main.pixelHeight / 32.0d / 2;//(Screen.width / Screen.height);
//	Camera.main.orthographicSize = s_baseOrthographicSize;
//	Camera.main.aspect = 2;
//	Camera.main.orthographicSize = 3;
	} else {
		Debug.Log("Missing Map File Name");
	}

}
//var lastOrthHeight = 0d;
function Update () {
	DrawPathLayers();
	/*var pixelHeight = Camera.main.pixelHeight;
	var tilesHeight = Mathf.Floor(pixelHeight / 32d);
	var goalTileHeight = 20;
	var nearestFactorToGoal = Mathf.Round(goalTileHeight/tilesHeight);
	var orthForTiles = tilesHeight * (0.32d * nearestFactorToGoal);
	if (orthForTiles != lastOrthHeight) {
		Debug.Log("Pixel Height = " + pixelHeight);
		Debug.Log("tielsHeight = " + tilesHeight);
		Debug.Log("goalTileHeight = " + goalTileHeight);
		Debug.Log("nearestFactorToGoal = " + nearestFactorToGoal);
		Debug.Log("orthForTiles = " + orthForTiles);
		lastOrthHeight = orthForTiles;
		var s_baseOrthographicSize = orthForTiles;//Camera.main.pixelHeight / 32.0d / 2;//(Screen.width / Screen.height);
		Camera.main.orthographicSize = s_baseOrthographicSize;
	}*/
}
var pathZLevels:Dictionary.<String,float> = new Dictionary.<String,float> ();
function LoadPaths () {
	Debug.Log("LoadPaths start " + tileLayers.length);
	var c:String = "Path";
	for( var i = 0; i < tileLayers.length; ++i) {
		var layer = tileLayers[i] as TileLayer;
		var sub:Number = layer.layerName.IndexOf("Paths");
		var pathType = "";
		if (sub < 0) {
			continue;
		} else {
			pathType = layer.layerName.Substring(0, sub);
			pathZLevels[pathType] = transform.position.z + (10 * PixelsPerUnit) - (i * 10/PixelsPerUnit);
		}
		Debug.Log("LoadPaths: pathType = " + pathType );
		(tileLayers[i] as TileLayer).InitPathing();
	}
	Debug.Log("LoadPaths end " + tileLayers.length);
}

/*function WriteFile(filepathIncludingFileName : String, content: String)
{
    var sw : StreamWriter = new StreamWriter(filepathIncludingFileName);
    sw.WriteLine("Line to write");
    sw.WriteLine("Another Line");
    sw.Flush();
    sw.Close();
}*/

/*function ReadFile(filepathIncludingFileName : String) {
    var sr = new File.OpenText(filepathIncludingFileName);
    var returnVal = ""; 
    var input = "";
    while (true) {
        input = sr.ReadLine();
        if (input == null) { break; }
        returnVal += input;
        //Debug.Log(input);
    }
    sr.Close();
    return returnVal;
}*/

function FilePathToResourcePath(filePath:String) {
	var resourceExtensionStart = filePath.LastIndexOf('.');
	var resourcesString = "Resources";
	var resourcePathStart = filePath.IndexOf(resourcesString) + resourcesString.Length + 1;
	return filePath.Substring(resourcePathStart, resourceExtensionStart - resourcePathStart);
}

function LoadTileSets(tileSets: JSONArray, referencePath: String) {
	for (var i = 0; i < tileSets.Count; ++i) {
		var expectedOffset = tileSets[i]['firstgid'].AsInt;
		
		var tilesAcross:Number = tileSets[i]['imagewidth'].AsInt / tileSets[i]['tilewidth'].AsInt;
		var tilesTall:Number = tileSets[i]['imageheight'].AsInt / tileSets[i]['tileheight'].AsInt;
		var image:String = tileSets[i]['image'].Value;
		var resourceName = FilePathToResourcePath(image);
		Debug.Log(resourceName);
		Debug.Log(image);
		//var resourceName = "PublicDomain/tiles_12";
		var textures:Array = Resources.LoadAll(resourceName, Sprite);
		for(var texIndex = 0; texIndex < textures.length; ++texIndex) {
			var sp:Sprite = textures[texIndex] as Sprite;
			while( tileIDToSpriteMap.length < expectedOffset + texIndex ) {
				Debug.Log("Pushing null for " + tileIDToSpriteMap.length);
				tileIDToSpriteMap.Push(null);
			}
			tileIDToSpriteMap[expectedOffset + texIndex] = sp;
		}
	}
}

function LoadTileLayers(jsonLayers: JSONArray) {
	for( var i = 0; i < jsonLayers.Count; ++i) {
		var layer:TileLayer = new TileLayer();
		layer.InitFromJSON(jsonLayers[i]);
		tileLayers.Push(layer);
		
	}
}

function DrawPathingLayer(layer:TileLayer, layerIndex:Number) {
	var sub:Number = layer.layerName.IndexOf("Paths");
	if (sub < 0) {
		return;
	}
	var i:int = 0;
	/*var pathingData:List.<PathBox> = layer.pathing.pathTiles;
	if (pathingData.Count > 0 ) {
		var width = layer.width;
		//Debug.Log("Drawing " + tileData.length + " tiles");
		for( i = 0; i < pathingData.Count; ++i) {
			var path:PathBox = pathingData[i];
			if (path.walkable) {
				var startVec = new Vector3(transform.position.x + path.x * (2*TileDrawOffset), 
										   transform.position.y + path.y * (-2*TileDrawOffset), 
										   transform.position.z + (10 * PixelsPerUnit) - (layerIndex * 10/PixelsPerUnit));
				for (var neighbor:PathBox in path.neighbors.Values) {
					if (neighbor.walkable) {
						var stopVec = new Vector3(transform.position.x + neighbor.x * (2*TileDrawOffset), 
											   transform.position.y + neighbor.y * (-2*TileDrawOffset), 
											   transform.position.z + (10 * PixelsPerUnit) - (layerIndex * 10/PixelsPerUnit));
						Debug.DrawLine(startVec, stopVec);
					}

				}
			}
		}
		
	}*/
	var pathingData:List.<PathBox> = layer.pathing.pathTiles;
	if (pathingData.Count > 0 ) {
		var width = layer.width;
		//Debug.Log("Drawing " + tileData.length + " tiles");
		for( i = 0; i < pathingData.Count; ++i) {
			var path:PathBox = pathingData[i];
			if (path.walkable) {
				var neighbor:PathBox = path.getNeighbor(path.savedBestPath);
				if (neighbor) {
					var startVec = new Vector3(transform.position.x + path.x * (2*TileDrawOffset), 
										   transform.position.y + path.y * (-2*TileDrawOffset), 
										   transform.position.z + (10 * PixelsPerUnit) - (layerIndex * 10/PixelsPerUnit));
					var stopVec = new Vector3(transform.position.x + neighbor.x * (2*TileDrawOffset), 
										   transform.position.y + neighbor.y * (-2*TileDrawOffset), 
										   transform.position.z + (10 * PixelsPerUnit) - (layerIndex * 10/PixelsPerUnit));
					Debug.DrawLine(startVec, stopVec, Color.red);
				}
			}
		}
	}

}
function DrawTileLayer(layer:TileLayer, layerIndex:Number) {
	var sub:Number = layer.layerName.IndexOf("Paths");
	if (sub >= 0) {
		DrawPathingLayer(layer, layerIndex);
		return;
	}
	var tileData:List.<int> = layer.data;
	if (tileData.Count > 0 ) {
		var width = layer.width;
		//Debug.Log("Drawing " + tileData.length + " tiles");
		for( var i = 0d; i < tileData.Count; ++i) {
			var tileID:int = System.Convert.ToInt32(tileData[i]);
			if (tileID > 0 ) {
				var sp:Sprite = tileIDToSpriteMap[tileID] as Sprite;
				if (sp) {
					var vec:Vector3 = Vector3(transform.position.x + i%width * (2*TileDrawOffset), 
										      transform.position.y + Mathf.Floor(i/width) * (-2*TileDrawOffset), 
										      transform.position.z + (10 * PixelsPerUnit) - (layerIndex * 10/PixelsPerUnit));
					//Debug.Log("Drawing " + sp.name + " at " + vec.x + "," + vec.y );
					//var obj = Instantiate (sp, vec, Quaternion.identity);
					//var t = Instantiate( spriteTemplate, vec, Quaternion.identity);
					//var go = new GameObject();
				    var t = Instantiate( spriteTemplate, vec, Quaternion.identity);
				    t.name = "LayerName " + i%width + " " + Mathf.Floor(i/width);
					//t.AddComponent.<SpriteRenderer>();
				    var spriteRenderer:SpriteRenderer = t.GetComponent(SpriteRenderer);
				    spriteRenderer.sprite = sp;
				    t.transform.parent = transform;
				    t.transform.localPosition = vec;
				    t.transform.localScale = new Vector3(1,1,1);
				    //Debug.Log("Bounds = x:" + sp.bounds.size.x + " y:" + sp.bounds.size.y);
				} else {
					Debug.Log("Missing Sprite " + tileID);
				}
			}
		}
	}
}
function DrawTileLayers() {
	for( var i = 0; i < tileLayers.length; ++i) {
		DrawTileLayer(tileLayers[i] as TileLayer, i);
	}
}
function DrawPathLayers() {
	for( var i = 0; i < tileLayers.length; ++i) {
		DrawPathingLayer(tileLayers[i] as TileLayer, i);
	}
}


function solvePathing() {
	SolvePathingLayers();
}
function SolvePathingLayers() {
	for( var i = 0; i < tileLayers.length; ++i) {
		SolvePathingLayer(tileLayers[i] as TileLayer, i);
	}
}
function invertDirection(direction:String):String {
	var returnVal = "UNRECOGNIZED DIRECTION: " + direction;
	switch (direction) {
		case "above": 
			returnVal = "below";
			break;
		case "below":
			returnVal = "above";
			break;
		case "left": 
			returnVal = "right";
			break;
		case "right": 
			returnVal = "left";
			break;
		case "aboveLeft": 
			returnVal = "belowRight";
			break;
		case "belowRight": 
			returnVal = "aboveLeft";
			break;
		case "aboveRight": 
			returnVal = "belowLeft";
			break;
		case "belowLeft": 
			returnVal = "aboveRight";
			break;
	}
	return returnVal;
}
function PathTestNautical( tile:PathBox, direction:String, nextCycleList:List.<PathBox> ) {
	var tileInDirection:PathBox = tile.getNeighbor(direction);
	if (isPathableTile(tileInDirection)) {
		tileInDirection.testBestPath = invertDirection(direction);
		nextCycleList.Add(tileInDirection);
	}
}
function isPathableTile(tile:PathBox) {
	if (tile && tile.walkable && tile.testBestPath == "") {
		return true;
	}
	return false;
}
function isWalkableTile(tile:PathBox) {
	if (tile && tile.walkable) {
		return true;
	}
	return false;
}
function PathTestDiagnal( tile:PathBox, direction:String, ifClear1:String, ifClear2:String, nextCycleList:List.<PathBox> ) {
	if (isWalkableTile( tile.getNeighbor(ifClear1)) && isWalkableTile( tile.getNeighbor(ifClear2))) {
		PathTestNautical(tile, direction, nextCycleList);
	}
}
function SolvePathingLayer(layer:TileLayer, layerIndex:Number):boolean {
	var sub:Number = layer.layerName.IndexOf("Paths");
	if (sub < 0) {
		return;
	}
	// Setup initial test state
	var i:int = 0;
	var activePathingBoxes:List.<PathBox> = new List.<PathBox>();
	for( i in layer.pathing.endLocations) {
		activePathingBoxes.Add(layer.pathing.pathTiles[i]);
		Debug.Log("End Location " + i + " is " + (layer.pathing.pathTiles[i].walkable ? "Walkable":"Not Walkable"));
	}
	var tile:PathBox = null;
	// TODO the testBestPath should always be left in a clear state, so maybe this isn't needed?
	for (tile in layer.pathing.pathTiles) {
		tile.testBestPath = "";
	} 
	
	//for each current path point, 
	// check neighbors
	// if neighbor has not been visited, is clear, (and nautical are clear if diagnal) 
	// 	mark neigbbor visit path twards from box
	//  push neighbor onto nextRound list
	// 
	var nextCyclePathingBoxes:List.<PathBox> = new List.<PathBox>();
	while(activePathingBoxes.Count > 0) {
	
		for( tile in activePathingBoxes) {
			PathTestNautical( tile, "left", nextCyclePathingBoxes);
			PathTestNautical( tile, "right", nextCyclePathingBoxes);
			PathTestNautical( tile, "above", nextCyclePathingBoxes);
			PathTestNautical( tile, "below", nextCyclePathingBoxes);
			PathTestDiagnal( tile, "aboveLeft", "above", "left", nextCyclePathingBoxes);
			PathTestDiagnal( tile, "aboveRight", "above", "right", nextCyclePathingBoxes);
			PathTestDiagnal( tile, "belowLeft", "below", "left", nextCyclePathingBoxes);
			PathTestDiagnal( tile, "belowRight", "below", "right", nextCyclePathingBoxes);
		}
		
		activePathingBoxes = nextCyclePathingBoxes;
		nextCyclePathingBoxes = new List.<PathBox>();
	}
	var validPathing:boolean = true;
	for (tile in layer.pathing.pathTiles) {
		if (tile.testBestPath == "" && tile.walkable) {
			validPathing = false;
			Debug.Log("**************** ABORTING PATHING ATTEMPT");
			break;
		}
	} 
	// if the new pathing is good, save it.
	if (validPathing) {
		for (tile in layer.pathing.pathTiles) {
			tile.savedBestPath = tile.testBestPath;
		} 
	}
	// delete temp best path in prep for next wave.
	for (tile in layer.pathing.pathTiles) {
		tile.testBestPath = "";
	} 
	return validPathing;
	/*
	var pathingData:List.<PathBox> = layer.pathing.pathTiles;
	if (pathingData.Count > 0 ) {
		var width = layer.width;
		//Debug.Log("Drawing " + tileData.length + " tiles");
		for( i = 0; i < pathingData.Count; ++i) {
			var path:PathBox = pathingData[i];
			if (path.walkable) {
				var startVec = new Vector3(transform.position.x + path.x * (2*TileDrawOffset), 
										   transform.position.y + path.y * (-2*TileDrawOffset), 
										   transform.position.z + (10 * PixelsPerUnit) - (layerIndex * 10/PixelsPerUnit));
				var neighbor:PathBox = path.getNeighbor(path.testBestPath);
				if (neighbor) {
					var stopVec = new Vector3(transform.position.x + neighbor.x * (2*TileDrawOffset), 
										   transform.position.y + neighbor.y * (-2*TileDrawOffset), 
										   transform.position.z + (10 * PixelsPerUnit) - (layerIndex * 10/PixelsPerUnit));
					Debug.DrawLine(startVec, stopVec);
				}
			}
		}
	}
	*/
}



/*
function DrawEllipse(obj:TileObject) {
	var elip:Transform = Instantiate(physicsTemplate, Vector3(0.16 + transform.position.x + obj.x / PixelsPerUnit, -0.16 + transform.position.y - obj.y / TileDrawOffset, 5), Quaternion.identity);
	var colider:CircleCollider2D = elip.gameObject.AddComponent.<CircleCollider2D>() as CircleCollider2D;
	colider.transform.parent = transform;
	colider.radius = (obj.width + obj.height)/400;
}

function DrawPolygon(obj:TileObject) {
	var poly:Transform = Instantiate(physicsTemplate, Vector3(-0.16 + transform.position.x + obj.x / TileDrawOffset, 0.16 + transform.position.y - obj.y / PixelsPerUnit, 5), Quaternion.identity);
	var colider:PolygonCollider2D = poly.gameObject.AddComponent.<PolygonCollider2D>() as PolygonCollider2D;
	colider.transform.parent = transform;
	var points:Vector2[] = new Vector2[obj.polygon.length];
	for( var i = 0; i < obj.polygon.length; ++i) {
		points[i] = new Vector2((obj.polygon[i] as TilePoint).x / PixelsPerUnit, (obj.polygon[i] as TilePoint).y / (-1  * PixelsPerUnit));
	}
	colider.SetPath(0, points);
	
}

function DrawPolyLine(obj:TileObject) {
	Debug.Log("DrawPolyLine not implemented");
}

function DrawMapBorders() {
	var pushPoint = function(array:Array, x:Number, y:Number) {
		var tp:TilePoint = new TilePoint();
		tp.x = x * PixelsPerUnit;
		tp.y = y * -1 * PixelsPerUnit;
		array.Push(tp);
	};
	
	var leftObj = new TileObject();
	pushPoint(leftObj.polygon, MaxLeftPixel - 1, MaxTopPixel);
	pushPoint(leftObj.polygon, MaxLeftPixel + 0.24, MaxTopPixel);
	pushPoint(leftObj.polygon, MaxLeftPixel + 0.24, MaxBottomPixel);
	pushPoint(leftObj.polygon, MaxLeftPixel - 1, MaxBottomPixel);
	DrawPolygon(leftObj);

	var rightObj = new TileObject();
	pushPoint(rightObj.polygon, MaxRightPixel + 1, MaxTopPixel);
	pushPoint(rightObj.polygon, MaxRightPixel + 0.08, MaxTopPixel);
	pushPoint(rightObj.polygon, MaxRightPixel + 0.08, MaxBottomPixel );
	pushPoint(rightObj.polygon, MaxRightPixel + 1, MaxBottomPixel);
	DrawPolygon(rightObj);

	var topObj = new TileObject();
	pushPoint(topObj.polygon, MaxLeftPixel - 1, MaxTopPixel + 1);
	pushPoint(topObj.polygon, MaxRightPixel + 1, MaxTopPixel + 1);
	pushPoint(topObj.polygon, MaxRightPixel + 1, MaxTopPixel - 0.48);
	pushPoint(topObj.polygon, MaxLeftPixel - 1, MaxTopPixel - 0.48);
	DrawPolygon(topObj);

	var bottomObj = new TileObject();
	pushPoint(bottomObj.polygon, MaxLeftPixel - 1, MaxBottomPixel - 1);
	pushPoint(bottomObj.polygon, MaxRightPixel + 1, MaxBottomPixel - 1);
	pushPoint(bottomObj.polygon, MaxRightPixel + 1, MaxBottomPixel - 0.08);
	pushPoint(bottomObj.polygon, MaxLeftPixel - 1, MaxBottomPixel - 0.08);
	DrawPolygon(bottomObj);

}
function DrawRectangle(obj:TileObject) {
	var poly:Transform = Instantiate(physicsTemplate, Vector3(-0.16 + transform.position.x + obj.x / PixelsPerUnit + obj.width/(2*PixelsPerUnit), 0.16 + transform.position.y - obj.y / PixelsPerUnit - obj.height/(2*PixelsPerUnit), 5), Quaternion.identity);
	var colider:BoxCollider2D = poly.gameObject.AddComponent.<BoxCollider2D>() as BoxCollider2D;
	colider.transform.parent = transform;
	colider.size.x = obj.width / PixelsPerUnit;
	colider.size.y = obj.height / PixelsPerUnit;
}*/
/*
function DrawPhysics(objects:Array) {
	for( var i = 0; i < objects.length; ++i) {
		var obj = objects[i] as TileObject;
		if (obj.ellipse) {
			DrawEllipse(obj);
		} else if (obj.polygon.length > 0) {
			Debug.Log("polygon = "  + obj.polygon.length);
			DrawPolygon(obj);
		} else if (obj.polyline.length > 0) {
			Debug.Log("polyline = "  + obj.polyline.length);
			DrawPolyLine(obj);
		} else {
			DrawRectangle(obj);
		}
	}
}*/
/*
function LoadPhysics() {
	Debug.Log("LoadPhysics start " + tileLayers.length);
	DrawMapBorders();
	var c:String = "Collision_";
	for( var i = 0; i < tileLayers.length; ++i) {
		var layer = tileLayers[i] as TileLayer;
		if (layer.layerName.Length >= c.Length) {
			var sub:String = layer.layerName.Substring(0, c.Length);
			if( sub == c) {
				Debug.Log(layer.layerName + " matches");
				DrawPhysics(layer.objects);
			} else {
				Debug.Log(sub + " != " + c);
			}
		}
	}
	Debug.Log("LoadPhysics end " + tileLayers.length);
}*/
/*var typePlayer:Transform;
function FindLoadPoint(objects:Array) {
	for( var i = 0; i < objects.length; ++i) {
		var obj:TileObject = objects[i] as TileObject;
		if (obj.type == "startPoint" && obj.getProperty("playerLoadPoint")) {
			Instantiate(typePlayer, Vector3 (obj.x / PixelsPerUnit, obj.y / (-1*PixelsPerUnit), 5), Quaternion.identity);
			return true;
		}
	}
	return false;
}
function LoadPlayerCharector() {
	var c:String = "Objects_";
	for( var i = 0; i < tileLayers.length; ++i) {
		var layer = tileLayers[i] as TileLayer;
		if (layer.layerName.Length >= c.Length) {
			var sub:String = layer.layerName.Substring(0, c.Length);
			if( sub == c) {
				Debug.Log(layer.layerName + " matches");
				if (FindLoadPoint(layer.objects)) {
					return;
				}
			} else {
				Debug.Log(sub + " != " + c);
			}
		}
	}
}*/
//var typeWolf:Transform;

/*function MobFactory(mobType:String, mobX:float, mobY:float) {
	var type:Transform = typeWolf; // default type
	switch (mobType) {
		case "wolf":
			type = typeWolf;
			break;
	}
	if (type) {
		Instantiate(type, Vector3 (mobX / PixelsPerUnit, mobY / (-1 * PixelsPerUnit), 5), Quaternion.identity);
	}
}
function SpawnMonsters(objects:Array) {
	for( var i = 0; i < objects.length; ++i) {
		var obj:TileObject = objects[i] as TileObject;
		if (obj.type == "mobPoint" && obj.getProperty("mobType")) {
			MobFactory(obj.getProperty("mobType"), obj.x, obj.y);
		}
	}
}
function LoadMonsters() {
	var c:String = "Objects_";
	for( var i = 0; i < tileLayers.length; ++i) {
		var layer = tileLayers[i] as TileLayer;
		if (layer.layerName.Length >= c.Length) {
			var sub:String = layer.layerName.Substring(0, c.Length);
			if( sub == c) {
				Debug.Log(layer.layerName + " matches");
				SpawnMonsters(layer.objects);
			} else {
				Debug.Log(sub + " != " + c);
			}
		}
	}
}*/
