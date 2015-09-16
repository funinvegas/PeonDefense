
#pragma strict

private var target : Transform;
var smoothTime = 0.3;
private var thisTransform : Transform;
private var velocity : Vector2;
private var pixelsPerUnit:Number = 1;
private var maxDistance:Number = ((32 / pixelsPerUnit) * 3);
private var lockView = false;
function Start()
{
	thisTransform = transform;
	Camera.main.orthographicSize = (32 / pixelsPerUnit) * 10;
}
function hundredRound(num:Number) {
	return Mathf.Round(num * 100) / 100;
}
var UnitsPerPixel:float = 1f;//1f / 100f;
var PixelsPerUnit:float = 1f;//100f / 1f;
function Update()
{
	if (Input.GetButton("Fire1"))// || Input.GetMouseButton(0))
	{
		Debug.Log( "Fire Button Down");
		var hit : RaycastHit;
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	}
}
var lastMousePosition:Vector2 = new Vector2(-1,-1);

function FixedUpdate() 
{
	Camera.main.orthographicSize = Mathf.Round(Screen.height / 2f * UnitsPerPixel);
	
	//Debug.Log( "B0: " + Input.GetButton("Fire0") + ", " + Input.GetButton("Fire1") + ", Pos:" + Input.mousePosition);
	var v:float = 0;
	var h:float = 0;
	if (Input.GetMouseButton(0)) {
//		h = Input.GetAxis ("Mouse Y");
//		v = Input.GetAxis ("Mouse X");
		if (lastMousePosition.x > 0) {
			h = lastMousePosition.x - Input.mousePosition.x;
			v = lastMousePosition.y - Input.mousePosition.y;
		}
		
		Debug.Log("h = " + h + ", v = " + v);
	} else {
		lastMousePosition = new Vector2(-1,-1);
	}
	
/*	if (!target && MainCharector.globalPlayerObject) {
		target = MainCharector.globalPlayerObject.transform;
	}*/
	//if (!target) {
	//	return;
	//}
	//var delta:Vector2 = thisTransform.position - target.position;
	//var mag:Number = delta.magnitude;
	//if (mag > maxDistance) {
		// Actuall pixels is these values * 400.  But multiplyer removed to save
		// math time.
		var screenPixelsTall = Camera.main.orthographicSize;
		var screenPixelsWide = Camera.main.aspect * screenPixelsTall;
		//var newLoc:Vector2 = new Vector2(target.transform.position.x, target.transform.position.y) + (delta.normalized * maxDistance);
		var newLoc:Vector2 = new Vector2(thisTransform.position.x + h, thisTransform.position.y + v);
		if (newLoc.x < LevelLoader.MaxLeftPixel + (screenPixelsWide)) {
			newLoc.x = LevelLoader.MaxLeftPixel + (screenPixelsWide);
			//Debug.Log("Capping X at " + hundredRound(LevelLoader.MaxLeftPixel - (screenPixelsWide)));
		}
		if (newLoc.x > LevelLoader.MaxRightPixel - (screenPixelsWide)) {
			newLoc.x = LevelLoader.MaxRightPixel - (screenPixelsWide);
			//Debug.Log("Capping X at " + hundredRound(LevelLoader.MaxRightPixel - (screenPixelsWide)));
		}
		if (newLoc.y > LevelLoader.MaxTopPixel - (screenPixelsTall)) {
			newLoc.y = LevelLoader.MaxTopPixel - (screenPixelsTall);
		}
		if (newLoc.y < LevelLoader.MaxBottomPixel + (screenPixelsTall)) {
			newLoc.y = LevelLoader.MaxBottomPixel + (screenPixelsTall);
		}
		thisTransform.position.x = Mathf.Round(newLoc.x);
		thisTransform.position.y = Mathf.Round(newLoc.y);
		
		
		if (Input.GetMouseButton(0)) {
  			lastMousePosition = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
		}

		//Debug.Log("Screen.width = " + screenPixelsWide);
/*		Debug.Log("Camera.main.pixelWidth = " + Camera.main.pixelWidth/200);
		Debug.Log("Camera.main.pixelHeight = " + Camera.main.pixelHeight/200);
		Debug.Log("LevelLoader.MaxLeftPixel = " + LevelLoader.MaxLeftPixel);
		Debug.Log("LevelLoader.MaxRightPixel = " + LevelLoader.MaxRightPixel);
		Debug.Log("LevelLoader.MaxTopPixel = " + LevelLoader.MaxTopPixel);
		Debug.Log("LevelLoader.MaxBottomPixel = " + LevelLoader.MaxBottomPixel);
		Debug.Log("newLoc.x = " + newLoc.x);
		Debug.Log("newLoc.y = " + newLoc.y);
		*/
	//}
		/*var delta:Vector2 = thisTransform.position - target.position;
	var newLoc:Vector2;
	/*var t = smoothTime * (maxDistance - delta.magnitude);
	if (t < 0) { t = 0; }
		newLoc = new Vector2(
			Mathf.SmoothDamp( 
				thisTransform.position.x, 
				target.position.x, velocity.x, t),
			Mathf.SmoothDamp( 
				thisTransform.position.y, 
				target.position.y, velocity.y, t)
			);
	Debug.Log("t = " + t);
	* /
	var mag = delta.magnitude;
	if (mag > maxDistance || lockView) {
		newLoc = target.position + (delta.normalized * Mathf.Min(maxDistance, mag));
		if (!lockView) {
			Debug.Log("locking view");
		}
		lockView = true;
	} else {
		newLoc = new Vector2(
			Mathf.SmoothDamp( 
				thisTransform.position.x, 
				target.position.x, velocity.x, smoothTime),
			Mathf.SmoothDamp( 
				thisTransform.position.y, 
				target.position.y, velocity.y, smoothTime)
			);
	}
	if (mag < maxDistance/2) {
		if (lockView) {
			Debug.Log("unlocking view");
		}
		lockView = false;
	}
	if (newLoc.x < LevelLoader.MaxLeftPixel + (Camera.main.pixelWidth/200)) {
		newLoc.x = LevelLoader.MaxLeftPixel + (Camera.main.pixelWidth/200);
	}
	if (newLoc.x > LevelLoader.MaxRightPixel - (Camera.main.pixelWidth/200)) {
		newLoc.x = LevelLoader.MaxRightPixel - (Camera.main.pixelWidth/200);
	}
	if (newLoc.y > LevelLoader.MaxTopPixel - (Camera.main.pixelHeight/200)) {
		newLoc.y = LevelLoader.MaxTopPixel - (Camera.main.pixelHeight/200);
	}
	if (newLoc.y < LevelLoader.MaxBottomPixel + (Camera.main.pixelHeight/200)) {
		newLoc.y = LevelLoader.MaxBottomPixel + (Camera.main.pixelHeight/200);
	}
	thisTransform.position.x = newLoc.x;
	thisTransform.position.y = newLoc.y;
	*/
}