#pragma strict

public var StartMenu:Transform = null;
public var LevelSelectionMenu:Transform = null;
public var GameMain:Transform = null;
private var activeScene:String = null;

private var AllScenes:List.<Transform> = new List.<Transform>();

function Start () {
	AllScenes.Add(StartMenu);
	AllScenes.Add(LevelSelectionMenu);
	AllScenes.Add(GameMain);
	
	this.SwitchToStartMenu();
}

function Update () {

}

function DeactivateAllScenes() {
	for( var i = 0; i < AllScenes.Count; ++i) {
		if (AllScenes[i].gameObject.activeInHierarchy) {
			AllScenes[i].gameObject.SendMessage("SceneStop");
		}
		AllScenes[i].gameObject.SetActive(false);
	}
}

function SwitchToStartMenu() {
	DeactivateAllScenes();
	StartMenu.gameObject.SetActive(true);
	StartMenu.gameObject.SendMessage("SceneStart");
	activeScene = "StartMenu";
}
function SwitchToLevelSelection() {
	DeactivateAllScenes();
	LevelSelectionMenu.gameObject.SetActive(true);
	LevelSelectionMenu.SendMessage("SceneStart");
	activeScene = "LevelSelectionMenu";
}
function SwitchToGameMain() {
	DeactivateAllScenes();
	GameMain.gameObject.SetActive(true);
	GameMain.gameObject.SendMessage("SceneStart");
	activeScene = "GameMain";
}
function isStartMenuActive() { return activeScene == "StartMenu"; }
function isLevelSelectionActive() { return activeScene == "LevelSelection"; }
function isGameMainActive() { return activeScene == "GameMain"; }