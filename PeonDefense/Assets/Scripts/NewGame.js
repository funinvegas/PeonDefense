#pragma strict

private var currentLevel:LevelLoader = null;
private var SpawnMob:Transform = null;

function LoadLevel(levelName:String) {
	if (currentLevel) {
		Destroy(currentLevel.gameObject);
		currentLevel = null;
	}
	var levelToLoad:TextAsset = Resources.Load(levelName, TextAsset);
	if (levelToLoad) {
		Debug.Log("Loading Level Resource " + levelName);
		var go:GameObject = new GameObject();
		//Instantiate(go);
		go.name ="Level Loader Gen";
		var levelLoader:LevelLoader = go.AddComponent.<LevelLoader>();
		levelLoader.mapAsset = levelToLoad;
		levelLoader.assetPath = "/LevelData/";
		go.transform.parent = transform;
		go.transform.localScale = new Vector3(1,1,1);
		currentLevel = levelLoader;
		levelLoader.theStart();
		levelLoader.solvePathing();
	} else {
		Debug.Log("WARNING: Resource " + levelName + " Not found");
	}
}

function Start () {
	//LoadLevel("OneOfEverything");
}
private var saveGame:SaveGame = null;
private var firstRun = true;
private var levelToLoad:String = null;
function SceneStart () {
	saveGame = new SaveGame();
	levelToLoad = saveGame.GetValue("LastSelectedLevel.File", "Missing Level File");
	SpawnMob = GameObject.Find("SendMob").transform;
	SpawnMob.GetComponent.<UI.Button>().onClick.AddListener(this.SendMobClick);
}
function SceneStop() {
	if (currentLevel) {
		Destroy(currentLevel.gameObject);
		currentLevel = null;
	}
}
function Update () {
	if (levelToLoad) {
		LoadLevel(levelToLoad);
		levelToLoad = null;
	}

}
/*
class GameMob {


}*/
private var cloneCount:int = 0;
private function createMob( type:String ):GameMob {
	var cloneTarget:GameObject = GameObject.Find(type);
	var clone:GameObject = Instantiate(cloneTarget);
	clone.name = type + "_clone_" + (++cloneCount);
	return clone.GetComponent.<GameMob>();
}

private var activeMobs:List.<GameObject> = new List.<GameObject>();
function SendMobClick() {
	Debug.Log("Sending Mob");
	createMob("WolfMob");
}

function BuildTowerClick() {
}