#pragma strict

class LevelDescription {
	private var name:String = null;
	private var enabled:boolean = false;
	private var transform:Transform = null;
	private var mapResourceName:String = null;
	public function getName():String {
		return this.name;
	}
	public function getMap():String {
		return this.mapResourceName;
	}
	public function LevelDescription(n:String, e:boolean, t:GameObject, m:String) {
		this.name = n;
		this.enabled = e;
		this.transform = t.transform;
		this.transform.GetComponent.<UI.Button>().interactable = enabled;
		this.mapResourceName = m;
	}
}
private var allLevels:Dictionary.<String, LevelDescription> = new Dictionary.<String, LevelDescription>();
private var saveGame:SaveGame = null;

/*private var Zone1:Transform = null;
private var NG2:Transform = null;
private var NG3:Transform = null;

private var DG1:Transform = null;
private var DG2:Transform = null;
private var DG3:Transform = null;
*/

function Start () {
	//updateButtonLabels();
}
private function _defineLevel(levelName:String, mapResource:String):void {
	this.allLevels.Add( levelName, 
		new LevelDescription( levelName, // Name of level
			saveGame.GetValue("Level_" + levelName + "_Enabled", "false") == "true", // Level Enabled
			GameObject.Find("Button_" + levelName), // on screen button representing level
			mapResource // resource name
			));
}
private var firstRun = true;
function SceneStart () {
	

	// Only init buttons on first run.
	if (saveGame == null) {
	}
	saveGame = new SaveGame();

	allLevelNames.Clear();
	allLevels.Clear();
	_defineLevel("Forest", "");
	_defineLevel("Mountain", "OneOfEverything");
	_defineLevel("River", "");
	for (var levelName in allLevels.Keys) {
		allLevelNames.Add(levelName);
	}
	if (firstRun) {
		initButtonStates();
		firstRun = false;
	}

}
private static var allLevelNames:List.<String> = new List.<String>();
function levelButtonClick(levelName:String) {
	Debug.Log(" Level " + levelName + " Clicked");
	saveGame.SetValue("LastSelectedLevel", levelName);
	var levelDev:LevelDescription = null;
	allLevels.TryGetValue(levelName, levelDev);
	saveGame.SetValue("LastSelectedLevel.File", levelDev.getMap());
	saveGame.Save();
	GameObject.Find("SceneSwitcher").GetComponent.<SceneSwitcher>().SwitchToGameMain();
}
function initButtonStates() {
	// TODO: Figure out UnityScriptDelegates 
	/*
	for (var i = 0; i < allLevelNames.Count; ++i) {
		var levelName = allLevelNames[i];
		transform.Find("Button_" + allLevelNames[i]).GetComponent.<UI.Button>().onClick.AddListener(function () { this.levelButtonClick(levelName);});
	}*/
	transform.Find("Button_" + "Forest").GetComponent.<UI.Button>().onClick.AddListener(function () { this.levelButtonClick("Forest");});
	transform.Find("Button_" + "Mountain").GetComponent.<UI.Button>().onClick.AddListener(function () { this.levelButtonClick("Mountain");});
	transform.Find("Button_" + "River").GetComponent.<UI.Button>().onClick.AddListener(function () { this.levelButtonClick("River");});
	
	/*
	var zoneN
	NG1 = transform.Find("NewGame1");
	NG2 = transform.Find("NewGame2");
	NG3 = transform.Find("NewGame3");
	NG1.GetComponent.<UI.Button>().onClick.AddListener(function () { this.newGameClick(1); });
	NG2.GetComponent.<UI.Button>().onClick.AddListener(function () { this.newGameClick(2); });
	NG3.GetComponent.<UI.Button>().onClick.AddListener(function () { this.newGameClick(3); });

	DG1 = transform.Find("DeleteGame1");
	DG2 = transform.Find("DeleteGame2");
	DG3 = transform.Find("DeleteGame3");
	DG1.GetComponent.<UI.Button>().onClick.AddListener(function () { this.deleteGameClick(1); });
	DG2.GetComponent.<UI.Button>().onClick.AddListener(function () { this.deleteGameClick(2); });
	DG3.GetComponent.<UI.Button>().onClick.AddListener(function () { this.deleteGameClick(3); });
*/
}





/*function updateButtonLabels() {
	NG1.Find("Text").GetComponent.<UI.Text>().text = saveGame.GetGlobal("NewGame1", "Empty Slot");
	NG2.Find("Text").GetComponent.<UI.Text>().text = saveGame.GetGlobal("NewGame2", "Empty Slot");
	NG3.Find("Text").GetComponent.<UI.Text>().text = saveGame.GetGlobal("NewGame3", "Empty Slot");
	DG1.Find("Text").GetComponent.<UI.Text>().text = (saveGame.GetGlobal("NewGame1", "Empty Slot") != "Empty Slot") ? "Delete":
		(saveGame.GetGlobal("NewGameRecover1", "Empty Slot") != "Empty Slot")?"Undo":"";
	DG1.Find("Text").GetComponent.<UI.Text>().text = (saveGame.GetGlobal("NewGame2", "Empty Slot") != "Empty Slot") ? "Delete":
		(saveGame.GetGlobal("NewGameRecover2", "Empty Slot") != "Empty Slot")?"Undo":"";
	DG1.Find("Text").GetComponent.<UI.Text>().text = (saveGame.GetGlobal("NewGame3", "Empty Slot") != "Empty Slot") ? "Delete":
		(saveGame.GetGlobal("NewGameRecover3", "Empty Slot") != "Empty Slot")?"Undo":"";
}

function deleteGameClick(num:Number) {
	Debug.Log("Delete Game Click " + num);
	var gameToDelete:String = saveGame.GetGlobal("NewGame" + num, "Empty Slot");
	if (gameToDelete == "Empty Slot") {
		var gameToRecover:String = saveGame.GetGlobal("NewGameRecover" + num, "Empty Slot");
		if (gameToRecover != "Empty Slot") {
			saveGame.SetGlobal("NewGame" + num, gameToRecover);
		}
	} else {
		saveGame.SetGlobal("NewGameRecover" + num, gameToDelete);
		saveGame.SetGlobal("NewGame" + num, "Empty Slot");
	}
	this.updateButtonLabels();
}

function newGameClick(num:Number) {
	Debug.Log("New Game Click " + num);
	var currentSave = saveGame.GetGlobal("NewGame" + num, "Empty Slot");
	saveGame.SetPrefix("NewGame" + num);
	if (currentSave == "Empty Slot") {
		saveGame.DeleteAllPrefix("NewGame" + num);
		saveGame.SetValue("Progress", "0");		
		saveGame.SetGlobal("NewGame" + num, "Progress (" + saveGame.GetValue("Progress", "BAD_SAVE") + "/100)");
		saveGame.Save();
	}
	GameObject.Find("SceneSwitcher").GetComponent.<SceneSwitcher>().SwitchToLevelSelection();
	this.updateButtonLabels();
}
*/
function Update () {
}



