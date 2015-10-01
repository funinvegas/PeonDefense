#pragma strict

public var StartMenu:Transform = null;
public var LevelSelectionMenu:Transform = null;
public var GameMain:Transform = null;

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
		AllScenes[i].gameObject.SetActive(false);
	}
}

function SwitchToStartMenu() {
	DeactivateAllScenes();
	StartMenu.gameObject.SetActive(true);
	StartMenu.gameObject.SendMessage("SceneStart");
}
function SwitchToLevelSelection() {
	DeactivateAllScenes();
	LevelSelectionMenu.gameObject.SetActive(true);
	LevelSelectionMenu.SendMessage("SceneStart");
}
function SwitchToGameMain() {
	DeactivateAllScenes();
	GameMain.gameObject.SetActive(true);
	GameMain.gameObject.SendMessage("SceneStart");
}