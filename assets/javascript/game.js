/*
 *	GLOBAL VARIABLES
 */


//CONSTANTS
var IMG_DIR = "assets/images/";
var AUDIO_DIR = "assets/audio/";
var AUDIO_LIST = ["kirk.mp3","picard.mp3","sisko.mp3","janeway.mp3"];

//Avatar object
var AVATAR_STATS = {
		0: {
			NAME: "James T. Kirk",
			HP: 1100,
			ATTACK: 40,
			DEFENSE: 50,
			IMG: "kirk.jpg"
		},

		1: {
			NAME: "Jean Luc Picard",
			HP: 800,
			ATTACK: 60,
			DEFENSE: 75,
			IMG: "picard.jpg"
		},

		2: {
			NAME: "Benjamin Sisko",
			HP: 1000,
			ATTACK: 25,
			DEFENSE: 120,
			IMG: "sisko.jpg"
		},

		3: {
			NAME: "Katherine Janeway",
			HP: 900,
			ATTACK: 50,
			DEFENSE: 80,
			IMG: "janeway.jpg"
		}
};

var gameStart = true;
var newEnemy=true;
var canAttack = false;
var gameOver = false;
var playerPower=0;


var enemyNum=[];
//var currentEnemy;
var currentPlayerHP;
var currentEnemyHP;
var wins=0;
var losses=0;




//Start game and get the values from the button (avatar) clicks
$(document).ready(function(){
		startGame();

		//Get avatar selected from click
		$(".avatarClick").click(function(){
			selectChar($(this).attr('value'));
		});

		//Get enemy selected from click
		$(".enemyClick").click(function(){
			selectEnemy($(this).attr('value'));
		});

		//Run game logic for attack clicks
		$("#attackClick").click(function(){
			attack();
		});

		$("#restart").click(function(){
			restart();
		});
});

//Start the game
function startGame() {

		//Initialize all stats for each avatar in the character select area
		for(var i = 0; i<Object.keys(AVATAR_STATS).length;++i){
			$("#avatar_HP_"+i).html("HP: "+AVATAR_STATS[i]["HP"]);
			$("#avatar_NAME_"+i).html(AVATAR_STATS[i]["NAME"]);
			$("#avatar_IMG_"+i).attr("src", IMG_DIR+AVATAR_STATS[i]["IMG"]);
			$("#avatarContainer_"+i).css({"display":"inline-block"});
			$("#avatarContainer_"+i).attr("value", i);
			$("#avatarContainer_"+i).addClass("avatarHover");
		}

}

/*
 *	After a character is selected move it to the "0" position and copy its stats to those tags
 *	Make all other characters display :none 
 *  Move enemies to next position
 */
function selectChar(idNum){

	if(gameStart){

		//Clear all characters in character select screen
		for(var i = 0; i<Object.keys(AVATAR_STATS).length;++i){

			$("#avatarContainer_"+i).css({"display":"none"});
			$("#avatarContainer_"+i).removeClass("avatarHover");

		}

		//Add Hover class back to enemy row
		for(var i = 0; i<Object.keys(AVATAR_STATS).length-1;++i){
					$("#enemyContainer_"+i).addClass("enemyHover");
				}

		//Only show selected character
		$("#avatar_HP_0").html("HP: "+AVATAR_STATS[idNum]["HP"]);
		$("#avatar_NAME_0").html(AVATAR_STATS[idNum]["NAME"]);
		$("#avatarContainer_0").css({"display":"inline-block"});
		$("#avatar_IMG_0").attr("src", IMG_DIR+AVATAR_STATS[idNum]["IMG"]);
		$("#avatar_IMG_0").attr("alt", AVATAR_STATS[idNum]["NAME"]);
		$("#avatarContainer_0").attr('value', idNum);

		$("#audioPlayer").attr("src", AUDIO_DIR+AUDIO_LIST[idNum]);

		//Set the HP for the character selected
		currentPlayerHP = AVATAR_STATS[idNum]["HP"];
		
		gameStart = false;

		//Resets dialog box
		$("#playerText").css({"text-align":"left"});
		$("#playerText").html("");
		$("#cpuText").css({"text-align":"left"});
		$("#cpuText").html("");
		moveEnemies(idNum);


	}
}

/*
 *	Add enemies to an array to keep count of enemies left
 *	Set enemy tag placeholders to selectable enemies
 */
function moveEnemies(idNum){

	var counter = 0;
	for(var i = 0; i<Object.keys(AVATAR_STATS).length;++i){
		if(idNum!=i){
			enemyNum.push(i);
			$("#enemy_NAME_"+counter).html(AVATAR_STATS[i]["NAME"]);
			$("#enemy_IMG_"+counter).attr("src", IMG_DIR+AVATAR_STATS[i]["IMG"]);
			$("#enemy_IMG_"+counter).attr("alt", AVATAR_STATS[i]["NAME"]);
			$("#enemy_HP_"+counter).html("HP: "+AVATAR_STATS[i]["HP"]);
			$("#enemyContainer_"+counter).attr("value", i);
			$("#enemyContainer_"+counter).css({"display":"inline-block"});
			counter+=1;
		}
	}
}


/*
 *	From enemy list move the enemy to the battle area
 *	Remove selected enemy from the select enemy area and move existing ones over
 *	Setup conditions that allow enemy to be attacked in battle area
 */
function selectEnemy(idNum){

	if(newEnemy){

		//Move enemy to battle area
		$("#currentEnemy_NAME").html(AVATAR_STATS[idNum]["NAME"]);
		$("#currentEnemy_IMG").attr("src", IMG_DIR+AVATAR_STATS[idNum]["IMG"]);
		$("#currentEnemy_IMG").attr("alt", AVATAR_STATS[idNum]["NAME"]);
		$("#currentEnemy_HP").html("HP: "+AVATAR_STATS[idNum]["HP"]);
		$("#currentEnemyContainer").css({"display":"inline-block"});
		$("#currentEnemyContainer").attr("value", idNum);

		//Set the HP for the enemy selected
		currentEnemyHP = AVATAR_STATS[idNum]["HP"];

		//currentEnemy = idNum;
		canAttack = true;
		
		//Clear possible enemy tags/containers
		for(var i = 0; i<enemyNum.length;++i){
			$("#enemyContainer_"+i).css({"display":"none"});
			$("#enemyContainer_"+i).removeClass("enemyHover");
		}

		//Remove enemy from possible enemy list
		var elementRemove = enemyNum.indexOf(parseInt(idNum));
		if (elementRemove> -1){
	    	enemyNum.splice(elementRemove, 1);
		}

		//Show/Move enemies not selected 
		for(var i = 0; i<enemyNum.length;++i){
			$("#enemyContainer_"+i).css({"display":"inline-block"});
			$("#enemy_NAME_"+i).html(AVATAR_STATS[enemyNum[i]]["NAME"]);
			$("#enemy_IMG_"+i).attr("src", IMG_DIR+AVATAR_STATS[enemyNum[i]]["IMG"]);
			$("#enemy_IMG_"+i).attr("alt", AVATAR_STATS[enemyNum[i]]["NAME"]);
			$("#enemy_HP_"+i).html("HP: "+AVATAR_STATS[enemyNum[i]]["HP"]);
			$("#enemyContainer_"+i).attr("value", enemyNum[i]);
		}
		newEnemy=false;

		$("#playerText").html("");
		$("#cpuText").html("");
	}

}

/*
 *	Restart game, reset all variables
 */
function restart(){
	startGame();
	gameStart = true;
	newEnemy=true;
	canAttack = false;
	gameOver = false;
	playerPower=0;

	enemyNum=[];
	currentEnemy="";
	for(var i = 0 ;i< 4;++i){
		$("#enemyContainer_"+i).css({"display":"none"});
	}
	$("#currentEnemyContainer").css({"display":"none"});
	$("#playerText").html("");
	$("#cpuText").html("");

	//return images to normal after deaths in previous game
	$("#avatar_IMG_0").removeClass("dead");
	$("#currentEnemy_IMG").removeClass("dead");

}

/*
 *	Get all stats for the player and the "computer"
 *	Peform simple math for each attack and display result
 *	Check for win/lose/draw conditions or else allow another enemy be selected
 */
function attack(){
	if(canAttack){

		//Player stats
		//var playerHP = parseInt($("#avatar_HP_0").html());
		var playerName = $("#avatar_NAME_0").html();
		var playerNum = $("#avatarContainer_0").attr('value');
		var playerAttack = AVATAR_STATS[playerNum]["ATTACK"];
		var totalPlayerAttack = playerAttack+playerPower;

		//CPU stats
		var cpuName = $("#currentEnemy_NAME").html();
		//var cpuHP = parseInt($("#currentEnemy_HP").html());
		var cpuNum = $("#currentEnemyContainer").attr('value');
		var cpuAttack = AVATAR_STATS[cpuNum]["DEFENSE"];

		//Game logic/math
		currentEnemyHP -= totalPlayerAttack;
		currentPlayerHP -= cpuAttack;
		$("#currentEnemy_HP").html("HP: "+currentEnemyHP);
		$("#avatar_HP_0").html("HP: "+currentPlayerHP);
		playerPower+=playerAttack;

		//Message box results
		$("#playerText").html("You  hit "+cpuName+" for "+totalPlayerAttack+" damage!");
		$("#cpuText").html(cpuName+" hit you for "+cpuAttack+" damage!");

		if(!gameOver){

			//Tie condition
			if (currentPlayerHP<= 0 && currentEnemyHP <=0){
				//$("#currentEnemyContainer").css({"display":"none"});
				$("#avatar_IMG_0").addClass("dead");
				$("#avatar_HP_0").html("DEFEATED");
				$("#currentEnemy_IMG").addClass("dead");
				$("#currentEnemy_HP").html("DEFEATED");

				canAttack=false;
				gameOver=true;
				$("#playerText").html("There was a tie! You and "+cpuName+" have both been defeated");
				$("#cpuText").html("Press Start a new game to play again!");
			}

			//Lose condition
			else if(currentPlayerHP <= 0){
				//$("#currentEnemyContainer").css({"display":"none"});
				$("#avatar_IMG_0").addClass("dead");
				$("#avatar_HP_0").html("DEFEATED");
				canAttack=false;
				gameOver=true;
				newEnemy=false;
				$("#playerText").html("You have been defeated by "+cpuName+" !!");
				$("#cpuText").html("Press Start a new game to play again!");
				losses+=1;
				$("#losses").html(losses);
			}

			//Win condition
			else if(currentEnemyHP <= 0 && enemyNum.length<1  && currentPlayerHP >0 ){
				//$("#currentEnemyContainer").css({"display":"none"});
				$("#currentEnemy_IMG").addClass("dead");
				$("#currentEnemy_HP").html("DEFEATED");
				canAttack=false;
				gameOver=true;
				$("#playerText").html("You have defeated all enemies. Congratulations!!");
				$("#cpuText").html("Press Start a new game to play again!");
				wins+=1;
				$("#wins").html(wins);

			}

			//Enemy defeated, select another enemy
			else if(currentEnemyHP <= 0 && enemyNum.length>0){
				canAttack=false;
				$("#currentEnemyContainer").css({"display":"none"});
				$("#playerText").html("You  have defeated "+cpuName+"!!");
				$("#cpuText").html("Select another enemy to defeat..");

				newEnemy=true;
				

			}
		}
	}
}

function changeAudio(audioFile){
	$("#audioPlayer").attr("src", AUDIO_DIR+AUDIO_LIST[audioFile]);

}




