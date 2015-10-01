#pragma strict

private var currentLevel:LevelLoader = null;

function LoadLevel(levelName:String) {
	if (currentLevel) {
		Destroy(currentLevel);
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
}
function Update () {
	if (levelToLoad) {
		LoadLevel(levelToLoad);
		levelToLoad = null;
	}

}