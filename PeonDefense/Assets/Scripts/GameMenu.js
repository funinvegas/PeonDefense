#pragma strict

private var ReturnToMain:Transform = null;
private var RestartLevel:Transform = null;
private var Resume:Transform = null;
public var MenuCanvas:GameObject = null;
private var MenuActive:boolean = false;
private var sceneSwitcher:SceneSwitcher = null;

function Start () {
	if (!MenuCanvas) {
		MenuCanvas = GameObject.Find("Game Menu Canvas");
	}
	MenuCanvas.gameObject.SetActive(false);
	sceneSwitcher = GameObject.Find("SceneSwitcher").GetComponent.<SceneSwitcher>();
	initButtonStates();
	updateButtonLabels();
}

function initButtonStates() {
	ReturnToMain = MenuCanvas.transform.Find("ReturnToMainMenu");
	RestartLevel = MenuCanvas.transform.Find("RestartLevel");
	Resume = MenuCanvas.transform.Find("Resume");
	ReturnToMain.GetComponent.<UI.Button>().onClick.AddListener(function () { this.returnToMainClick(); });
	RestartLevel.GetComponent.<UI.Button>().onClick.AddListener(function () { this.restartLevelClick(); });
	Resume.GetComponent.<UI.Button>().onClick.AddListener(function () { this.resumeClick(); });

}

function updateButtonLabels() {
	//NG1.Find("Text").GetComponent.<UI.Text>().text = saveGame.GetGlobal("NewGame1", "Empty Slot");
	//NG2.Find("Text").GetComponent.<UI.Text>().text = saveGame.GetGlobal("NewGame2", "Empty Slot");
	//NG3.Find("Text").GetComponent.<UI.Text>().text = saveGame.GetGlobal("NewGame3", "Empty Slot");
}
function returnToMainClick() {
	sceneSwitcher.SwitchToStartMenu();
	toggleVisible();
}
function restartLevelClick() {
	if (sceneSwitcher.isGameMainActive()) {
		sceneSwitcher.SwitchToGameMain();
	}
	toggleVisible();
}
function resumeClick() {
	toggleVisible();
}

function deleteGameClick(num:Number) {
/*	Debug.Log("Delete Game Click " + num);
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
	this.updateButtonLabels();*/
}

function newGameClick(num:Number) {
/*
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
	*/
}

function exitPeonDefense() {
//	Application.Quit();
}
function toggleVisible() {
 	MenuActive = !MenuActive;
 	MenuCanvas.SetActive(MenuActive);
 	
 	if (MenuActive) {
		RestartLevel.gameObject.SetActive(sceneSwitcher.isGameMainActive());
 	}
}
function Update () {
	Debug.Log("Update Game Menu");
	if (Input.GetButtonDown("Cancel")) {
		toggleVisible();
	}
}