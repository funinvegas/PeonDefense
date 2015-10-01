#pragma strict
import System.Collections.Generic;

class SaveGame {	
	private var saveTable:Dictionary.<String,String> = new Dictionary.<String,String>();
	private var fileName : String = "";
	private var fileOpened:boolean = false;

	private function CheckOpen () {
		Debug.Log("CheckOpen currentKeys = " + this.saveTable.Keys.Count);
		Debug.Log("CheckOpen fileOpened = " + this.fileOpened);
		Debug.Log("CheckOpen fileName = " + this.fileName);
		if (!fileOpened) {
			Debug.Log("Not fileOpened");
			try {
				fileName = Application.persistentDataPath + "/RollerSaveData.dat";
				Debug.Log(fileName);
				fileOpened = true;
				OpenSave();
			} catch (e) {
				fileOpened = false;
			}
			Debug.Log("Init = " + fileOpened);
		}
	}

	// Constructor
	function SaveGame () {
		//CheckOpen();
	}

	private function OpenSave () {
		Debug.Log("OpenSave");
		var fileRef:System.IO.StreamReader;
		if (System.IO.File.Exists(fileName)) {
			fileRef = System.IO.File.OpenText(fileName);
			var fileContents:String = "";
			do {
				fileContents = fileRef.ReadLine();
				if (fileContents) {
					var equalIndex = fileContents.IndexOf('=');
					if (equalIndex != -1) {
						var key = fileContents.Substring(0, equalIndex);
						var val = fileContents.Substring(equalIndex + 1);
						Debug.Log("Read key: " + key);
						Debug.Log("Read val: " + val);
						saveTable.Add(key, val);
					}
				}
			} while (fileContents);
			fileRef.Close();		
		}
	//	SetGlobal("Test2", "First");
	//	SetGlobal("Test3", "First");
	//	SetGlobal("Test2", "Second");
		this.Save();
	}

	function Save () {
		CheckOpen();
		Debug.Log("Saving file " + fileName);
		var fileRef:System.IO.StreamWriter = new System.IO.StreamWriter(fileName);
		var keyCount = this.saveTable.Count;
		Debug.Log("SAVE currentKeys = " + this.saveTable.Keys.Count);
		for (var item:KeyValuePair.<String,String> in this.saveTable) {
			var writeString = item.Key + "=" + item.Value;
			Debug.Log("Writing " + writeString);
			fileRef.WriteLine(writeString);
		}
		fileRef.Flush();
		fileRef.Close();		
	}

	private static var currentPrefix:String = "PrefixNotSet.";

	function SetGlobal( key:String, val:String ) {
		CheckOpen();
		Debug.Log("SetGlobal " + key + "=" +val);
		if (saveTable.ContainsKey(key)) {
			Debug.Log("removing old " + key + "=" +val);
			saveTable.Remove(key);
		}
		Debug.Log("adding new " + key + "=" +val);
		saveTable.Add(key, val);
	}

	function GetGlobal( key:String, defaultVal:String ):String {
		this.CheckOpen();
		Debug.Log("GetGlobal " + key);
		if (saveTable.ContainsKey(key)) {
			/*for (var item:KeyValuePair.<String,String> in saveTable) {
				if (item.Key == key) {
					Debug.Log("Returning key value " + item.Value);
					return item.Value;
				}
			}*/
			var valueToReturn:String = null;
			saveTable.TryGetValue(key, valueToReturn);
			return valueToReturn;
			//return defaultVal;
		} else {
			Debug.Log("Returning default value " + defaultVal);
			return defaultVal;
		}
	}

	function GetValue( key:String, val:String ):String {
		Debug.Log("Loading Prefix:" + currentPrefix);
		return GetGlobal( currentPrefix + key, val);
	}

	function SetValue( key:String, val:String ) {
		SetGlobal( currentPrefix + key, val);
	}

	function SetPrefix( prefix ) {
		this.currentPrefix = prefix + ".";
	}
	
	function DeleteAllPrefix( prefix ) {
		var fullPrefix = prefix + ".";
		var keysToDelete:List.<String> = new List.<String>();
		// Build array of keys to delete then delete them. If it is done in one step
		// it can put the dictionary and its iterator in a bad state.
		for (var item:KeyValuePair.<String,String> in saveTable) {
			if (item.Key.IndexOf(fullPrefix) == 0) {
				keysToDelete.Add(item.Key);
			}
		}
		
		for (var itemKey:String in keysToDelete) {
			
			Debug.Log("Removing key (" + itemKey + ")");
			saveTable.Remove(itemKey);
		}
	}

}

