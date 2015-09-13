#pragma strict
import System.IO;
import SimpleJSON;

//var mapFile:String = "";
var assetPath:String = "";
var mapAsset:TextAsset = null;

var spriteTemplate:Transform = null;
var physicsTemplate:Transform = null;
private var tileIDToSpriteMap: Array = new Array();
private var tileLayers:Array = new Array();
static var MaxLeftPixel:Number = 0;
static var MaxRightPixel:Number = 1;
static var MaxTopPixel:Number = 0;
static var MaxBottomPixel:Number = 1;

function Start () {
	if (mapAsset) {
		//var fileName = Application.dataPath + mapFile;
		//Debug.Log("Reading Map File: " + fileName);
//		var fileText = ReadFile(fileName);
		var fileText = mapAsset.text;
		var fileData = JSON.Parse(fileText);
		Debug.Log(fileData);
//		var pathToMap = mapFile.Substring(0, Mathf.Max(mapFile.LastIndexOf('\\'), mapFile.LastIndexOf('/')) + 1);
		LoadTileSets(fileData['tilesets'].AsArray, assetPath);
		LoadTileLayers(fileData['layers'].AsArray);
	} else {
		Debug.Log("Missing Map File Name");
	}
	DrawTileLayers();
	
	MaxLeftPixel = transform.position.x - 0.16;
	MaxRightPixel = transform.position.x + fileData['width'].AsInt * fileData['tilewidth'].AsInt / 100 - 0.16;
	MaxTopPixel = transform.position.y + 0.16;
  	MaxBottomPixel = transform.position.y - ((fileData['height'].AsInt * fileData['tileheight'].AsInt / 100) - 0.16);

	LoadPhysics();
	
	LoadPlayerCharector();

 	LoadMonsters();
 
 	Debug.Log(" Screen width = " + Screen.width);
 	Debug.Log(" Screen height = " + Screen.height);
	 // set the camera to the correct orthographic size (so scene pixels are 1:1)
	
	// if the resoltuion is 1900x1024.... a 32x 32 is taller than wide.
	
//	var s_baseOrthographicSize = Camera.main.pixelHeight / 32.0d / 2;//(Screen.width / Screen.height);
//	Camera.main.orthographicSize = s_baseOrthographicSize;
//	Camera.main.aspect = 2;
//	Camera.main.orthographicSize = 3;
}
var lastOrthHeight = 0d;
function Update () {
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

function WriteFile(filepathIncludingFileName : String, content: String)
{
    var sw : StreamWriter = new StreamWriter(filepathIncludingFileName);
    sw.WriteLine("Line to write");
    sw.WriteLine("Another Line");
    sw.Flush();
    sw.Close();
}

function ReadFile(filepathIncludingFileName : String) {
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
}

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
function Nearest100th(num:Number) {
	return Mathf.Round(num * 100) / 100;
}
function DrawTileLayer(layer:TileLayer, layerIndex:Number) {
	var tileData:Array = layer.data;
	if (tileData.length > 0 ) {
		var width = layer.width;
		//Debug.Log("Drawing " + tileData.length + " tiles");
		for( var i = 0d; i < tileData.length; ++i) {
			var tileID:int = System.Convert.ToInt32(tileData[i]);
			if (tileID > 0 ) {
				var sp:Sprite = tileIDToSpriteMap[tileID] as Sprite;
				if (sp) {
					var vec:Vector3 = Vector3(transform.position.x + i%width * 0.320000d, 
										      transform.position.y + Mathf.Floor(i/width) * -0.320000d, 
										      transform.position.z + 50 - layerIndex);
					//Debug.Log("Drawing " + sp.name + " at " + vec.x + "," + vec.y );
					//var obj = Instantiate (sp, vec, Quaternion.identity);
					var t = Instantiate( spriteTemplate, vec, Quaternion.identity);
				    var spriteRenderer:SpriteRenderer = t.GetComponent(SpriteRenderer);
				    spriteRenderer.sprite = sp;
				    t.transform.parent = transform;
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

function DrawEllipse(obj:TileObject) {
	var elip:Transform = Instantiate(physicsTemplate, Vector3(0.16 + transform.position.x + obj.x / 100, -0.16 + transform.position.y - obj.y / 100, 5), Quaternion.identity);
	var colider:CircleCollider2D = elip.gameObject.AddComponent.<CircleCollider2D>() as CircleCollider2D;
	colider.transform.parent = transform;
	colider.radius = (obj.width + obj.height)/400;
}

function DrawPolygon(obj:TileObject) {
	var poly:Transform = Instantiate(physicsTemplate, Vector3(-0.16 + transform.position.x + obj.x / 100, 0.16 + transform.position.y - obj.y / 100, 5), Quaternion.identity);
	var colider:PolygonCollider2D = poly.gameObject.AddComponent.<PolygonCollider2D>() as PolygonCollider2D;
	colider.transform.parent = transform;
	var points:Vector2[] = new Vector2[obj.polygon.length];
	for( var i = 0; i < obj.polygon.length; ++i) {
		points[i] = new Vector2((obj.polygon[i] as TilePoint).x / 100, (obj.polygon[i] as TilePoint).y / -100);
	}
	colider.SetPath(0, points);
	
}

function DrawPolyLine(obj:TileObject) {
	Debug.Log("DrawPolyLine not implemented");
}

function DrawMapBorders() {
	var pushPoint = function(array:Array, x:Number, y:Number) {
		var tp:TilePoint = new TilePoint();
		tp.x = x * 100;
		tp.y = y * -100;
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
	var poly:Transform = Instantiate(physicsTemplate, Vector3(-0.16 + transform.position.x + obj.x / 100 + obj.width/200, 0.16 + transform.position.y - obj.y / 100 - obj.height/200, 5), Quaternion.identity);
	var colider:BoxCollider2D = poly.gameObject.AddComponent.<BoxCollider2D>() as BoxCollider2D;
	colider.transform.parent = transform;
	colider.size.x = obj.width / 100;
	colider.size.y = obj.height / 100;
}

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
}
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
}
var typePlayer:Transform;
function FindLoadPoint(objects:Array) {
	for( var i = 0; i < objects.length; ++i) {
		var obj:TileObject = objects[i] as TileObject;
		if (obj.type == "startPoint" && obj.getProperty("playerLoadPoint")) {
			Instantiate(typePlayer, Vector3 (obj.x / 100, obj.y / -100, 5), Quaternion.identity);
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
}
var typeWolf:Transform;

function MobFactory(mobType:String, mobX:float, mobY:float) {
	var type:Transform = typeWolf; // default type
	switch (mobType) {
		case "wolf":
			type = typeWolf;
			break;
	}
	if (type) {
		Instantiate(type, Vector3 (mobX / 100, mobY / -100, 5), Quaternion.identity);
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
}
