#pragma strict

private var NG1:Transform = null;
private var NG2:Transform = null;
private var NG3:Transform = null;

private var DG1:Transform = null;
private var DG2:Transform = null;
private var DG3:Transform = null;

private var saveGame:SaveGame = null;

function Start () {
	if (saveGame == null) {
		saveGame = new SaveGame();
		initButtonStates();
	}
	updateButtonLabels();
}

function initButtonStates() {
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

}

function updateButtonLabels() {
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
		var levelName = "Mountain";
		var levelEnabled = "Level_" + levelName + "_Enabled";
		saveGame.SetValue(levelEnabled, "true");		
		saveGame.SetGlobal("NewGame" + num, "Progress (" + saveGame.GetValue("Progress", "BAD_SAVE") + "/100)");
		saveGame.Save();
	}
	GameObject.Find("SceneSwitcher").GetComponent.<SceneSwitcher>().SwitchToLevelSelection();
	this.updateButtonLabels();
}

function Update () {
}