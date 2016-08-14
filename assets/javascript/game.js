/*
 *	GLOBAL VARIABLES
 */


//CONSTANTS
var IMG_DIR = "assets/images/";

var AVATAR_STATS = {
		0: {
			NAME: "James T. Kirk",
			HP: 1200,
			ATTACK: 25,
			DEFENSE: 50,
			IMG: "kirk.jpg"
		},

		1: {
			NAME: "Jean Luc Picard",
			HP: 800,
			ATTACK: 50,
			DEFENSE: 75,
			IMG: "picard.jpg"
		},

		2: {
			NAME: "Benjamin Sisko",
			HP: 1000,
			ATTACK: 50,
			DEFENSE: 100,
			IMG: "sisko.jpg"
		},

		3: {
			NAME: "Katherine Janeway",
			HP: 900,
			ATTACK: 50,
			DEFENSE: 75,
			IMG: "janeway.jpg"
		}
};

var gameStart = true;
var newEnemy=true;
var canAttack = false;
var gameOver = false;
var playerPower=0;


var enemyNum=[];
var currentEnemy;





$(document).ready(function(){
		startGame();
		$(".avatarClick").click(function(){
			selectChar($(this).attr('value'));
		});
		$(".enemyClick").click(function(){
			selectEnemy($(this).attr('value'));
		});
		$("#attackClick").click(function(){
			attack();
		});

		$("#restart").click(function(){
			restart();
		});
});

function startGame() {
		//Initialize HP for each avatar
		for(var i = 0; i<Object.keys(AVATAR_STATS).length;++i){
			$("#avatar_HP_"+i).html(AVATAR_STATS[i]["HP"]);
			$("#avatar_NAME_"+i).html(AVATAR_STATS[i]["NAME"]);
			$("#avatar_IMG_"+i).attr("src", IMG_DIR+AVATAR_STATS[i]["IMG"]);
			$("#avatarContainer_"+i).css({"display":"inline-block"});
			$("#avatarContainer_"+i).attr("value", i);
		}

}
function selectChar(idNum){

	if(gameStart){
		for(var i = 0; i<Object.keys(AVATAR_STATS).length;++i){

			$("#avatarContainer_"+i).css({"display":"none"});
		}

		$("#avatar_HP_0").html(AVATAR_STATS[idNum]["HP"]);
		$("#avatar_NAME_0").html(AVATAR_STATS[idNum]["NAME"]);
		$("#avatarContainer_0").css({"display":"inline-block"});
		$("#avatar_IMG_0").attr("src", IMG_DIR+AVATAR_STATS[idNum]["IMG"]);
		$("#avatar_IMG_0").attr("alt", AVATAR_STATS[idNum]["NAME"]);
		$("#avatarContainer_0").attr('value', idNum);

		gameStart = false;
		moveEnemies(idNum);

	}
}

function moveEnemies(idNum){

	var counter = 0;
	for(var i = 0; i<Object.keys(AVATAR_STATS).length;++i){
		if(idNum!=i){
			enemyNum.push(i);
			$("#enemy_NAME_"+counter).html(AVATAR_STATS[i]["NAME"]);
			$("#enemy_IMG_"+counter).attr("src", IMG_DIR+AVATAR_STATS[i]["IMG"]);
			$("#enemy_IMG_"+counter).attr("alt", AVATAR_STATS[i]["NAME"]);
			$("#enemy_HP_"+counter).html(AVATAR_STATS[i]["HP"]);
			$("#enemyContainer_"+counter).attr("value", i);
			$("#enemyContainer_"+counter).css({"display":"inline-block"});
			counter+=1;
		}
	}
}
function selectEnemy(idNum){
	if(newEnemy){
		$("#currentEnemy_NAME").html(AVATAR_STATS[idNum]["NAME"]);
		$("#currentEnemy_IMG").attr("src", IMG_DIR+AVATAR_STATS[idNum]["IMG"]);
		$("#currentEnemy_IMG").attr("alt", AVATAR_STATS[idNum]["NAME"]);
		$("#currentEnemy_HP").html(AVATAR_STATS[idNum]["HP"]);
		$("#currentEnemyContainer").css({"display":"inline-block"});
		$("#currentEnemyContainer").attr("value", idNum);

		currentEnemy = idNum;
		canAttack = true;
		
		for(var i = 0; i<enemyNum.length;++i){
			$("#enemyContainer_"+i).css({"display":"none"});
		}
		var elementRemove = enemyNum.indexOf(parseInt(idNum));
		if (elementRemove> -1){
	    	enemyNum.splice(elementRemove, 1);
		}
		for(var i = 0; i<enemyNum.length;++i){
			$("#enemyContainer_"+i).css({"display":"inline-block"});
			$("#enemy_NAME_"+i).html(AVATAR_STATS[enemyNum[i]]["NAME"]);
			$("#enemy_IMG_"+i).attr("src", IMG_DIR+AVATAR_STATS[enemyNum[i]]["IMG"]);
			$("#enemy_IMG_"+i).attr("alt", AVATAR_STATS[enemyNum[i]]["NAME"]);
			$("#enemy_HP_"+i).html(AVATAR_STATS[enemyNum[i]]["HP"]);
			$("#enemyContainer_"+i).attr("value", enemyNum[i]);
		}
		newEnemy=false;

		$("#playerText").html("");
		$("#cpuText").html("");
	}

}
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

}

function attack(){
	if(canAttack){
		
		newEnemy=true;

		var playerHP = parseInt($("#avatar_HP_0").html());
		var playerName = $("#avatar_NAME_0").html();
		var playerNum = $("#avatarContainer_0").attr('value');
		var playerAttack = AVATAR_STATS[playerNum]["ATTACK"];
		var totalPlayerAttack = playerAttack+playerPower;


		var cpuName = $("#currentEnemy_NAME").html();
		var cpuHP = parseInt($("#currentEnemy_HP").html());
		var cpuNum = $("#currentEnemyContainer").attr('value');
		var cpuAttack = AVATAR_STATS[cpuNum]["DEFENSE"];

		cpuHP -= totalPlayerAttack;
		playerHP -= cpuAttack;

		$("#currentEnemy_HP").html(cpuHP);
		$("#avatar_HP_0").html(playerHP);
		playerPower+=playerAttack;

		$("#playerText").html("You  hit "+cpuName+" for "+totalPlayerAttack+" damage!");
		$("#cpuText").html(cpuName+" hit you for "+cpuAttack+" damage!");

		if(!gameOver){
			console.log(playerHP, cpuHP);

			
			if (playerHP<= 0 && cpuHP <=0){
				$("#currentEnemyContainer").css({"display":"none"});
				canAttack=false;
				gameOver=true;
				$("#playerText").html("There was a tie! You and "+cpuName+" have both been defeated");
				$("#cpuText").html("Press restart to play again!");
			}
			else if(playerHP <= 0){
				$("#currentEnemyContainer").css({"display":"none"});
				canAttack=false;
				gameOver=true;
				newEnemy=false;
				$("#playerText").html("You have been defeated by "+cpuName+" !!");
				$("#cpuText").html("Press restart to play again!");
			}
			else if(cpuHP <= 0 && enemyNum.length<1  && playerHP >0 ){
				$("#currentEnemyContainer").css({"display":"none"});
				canAttack=false;
				gameOver=true;
				$("#playerText").html("You have defeated all enemies. Congratulations!!");
				$("#cpuText").html("Press restart to play again!");

			}
			else if(cpuHP <= 0 && enemyNum.length>0){
				$("#currentEnemyContainer").css({"display":"none"});
				canAttack=false;
				$("#playerText").html("You  have defeated "+cpuName+"!!");
				$("#cpuText").html("Select another enemy to defeat..");

			}
			
		}

	}
}





