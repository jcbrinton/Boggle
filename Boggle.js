var down = false;
var word =""; ;
var wordlist ={};
var myvar;
var selectedArr=[];
var TIME = 10;
var total = 0;
var iid;

//Sets up board and begins game
function buildGame(){

  	for(var key in wordlist){

		delete wordlist[key];
  
	}

	setLists();
    document.getElementById('input').style="display:none";
    document.getElementById('input1').style="display:none"
    document.getElementById('result').style="display:none";
	document.getElementById('board').style="display:initial";
	window.clearInterval(iid);

	TIME = 180;

	iid = interval();

	var dice =[['A','A','E','E','G','N'],['A','B','B','J','O','O'],['A','C','H','O','P','S'],['A','F','F','K','P','S'],['A','O','O','T','T','W'],['C','I','M','O','T','U'],['D','E','I','L','R','X'],['D','E','L','R','V','Y'],['D','I','S','T','T','Y'],['E','E','G','H','N','W'],['E','E','I','N','S','U'],['E','H','R','T','V','W'],['E','I','O','S','S','T'],['E','L','R','T','T','Y'],['H','I','M','N','U','QU'],['H','L','N','N','R','Z']];
	
	shuffle(dice);
	
	var cell = document.getElementsByClassName('gameboard')[0].getElementsByTagName('td');

	for(var i = 0 ;i<dice.length ;i++ ){

		var roll = Math.floor(Math.random() * 6);

		var letter = dice[i][roll];

		cell[i].innerHTML = letter;

	}

}
// interval for timer
function interval (){

return setInterval(tick, 1000);

};

//calculates time left in game
function tick() {
	TIME--;

	var min = Math.floor(TIME/60);
 
	var sec =TIME%60;

	var time = min+ ":"+ ('0' + sec).slice(-2);

	document.getElementById('timer').innerHTML=time;
	
	if(TIME<1){
		gameOver();
		window.clearInterval(iid);
	}

}

//functions to run when a word is started
function openCell(ele){

	if(down==false){

		down = true;
		ele.className = "btn btn-info";
		word+= ele.innerHTML;
	
		document.getElementById('worddisplay').innerHTML=word;
		selectedArr.push(ele);
	
		activateNeighbors(ele);
	}

}
//functions to run when a word is continued
function makeWord(ele){
	if(down==true){
		if(ele.className=="btn btn-info") {
		
            
            var index = selectedArr.indexOf(ele)+1;
            
            for(var i=index;i<selectedArr.length;i++){
            
            	selectedArr[i].className="btn";
            	
            }
            var qcheck =word.slice(0, index);
            
            if(qcheck.indexOf("Q")!=-1){
            word = word.slice(0, index+1);
            }
            else{
            word = word.slice(0, index);
            }
            selectedArr = selectedArr.slice(0,index);
			
			document.getElementById('worddisplay').innerHTML=word;
			
			deactivateNeighbors();
			
			activateNeighbors(selectedArr[index-1]);


		}
		if(ele.className=="btn btn-warning"){
			deactivateNeighbors();
			ele.className = "btn btn-info";

			activateNeighbors(ele);
			selectedArr.push(ele);

			word+= ele.innerHTML;
			document.getElementById('worddisplay').innerHTML=word;
		} 

	}

}

//functions to run when a word is ended
function checkWord(ele){
	selectedArr=[];

	deactivateNeighbors();
	down = false;

	if(word.length>2){

		var words = DICTIONARY.words;

		wordsarr = words.split(',');

		var a = wordsarr.indexOf(word);

		if(a>0){
			calculateScore();
			setLists();
			document.getElementById('worddisplay').className="alert alert-success";
			
		}
		else {
		
			document.getElementById('worddisplay').className="alert alert-error";
		
		}
		
	}
	setTimeout(function() {document.getElementById('worddisplay').className="well well-small"; document.getElementById('worddisplay').innerHTML=word;},1500 );

	word="";
	
	var cells = document.getElementsByClassName('btn');

	for(var i=0;i<cells.length;i++){
		cells[i].className="btn";

	}
}
//Calculates point value for a word
function calculateScore(){

	var length = word.length;

	var score;
	if(length<5){
		score=1;
	}
	else if(length==5){
		score=2;
	}
	else if(length==6){
		score=3;
	}
	else if(length==7){
		score=5;
	}
	else{
		score=11;
	}
	wordlist[word]= score;
}

//Randomizer for dice
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  
  while (0 !== currentIndex) {

    
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Activates neighboring letters of current letter to allow them to be selected
function activateNeighbors(ele){

	var string = ele.id ; 
						
	var stringarr = string.match(/[a-zA-Z]+|[0-9]+/g);

	var i = parseInt(stringarr[1]);
	var j = parseInt(stringarr[3]);
	


	for(var k = -1 ;k<2 ;k++ ){ 

		for(var l = -1 ;l<2 ;l++ ){ 
						
			var neighbor = document.getElementById('row'+(i+k)+'col'+(j+l));			
							 
				if(neighbor != null && neighbor.className =="btn" && (k!=0 ||l!=0 )){
					neighbor.className = 'btn btn-warning';			
							
				}
		}
	}


}

//Deactivates neighboring letters of previous letter to not allow them to be selected
function deactivateNeighbors (){

	var actives = document.getElementsByTagName('td');

	for(var i = 0 ;i<actives.length ;i++ ){
		
		if(actives[i].className=='btn btn-warning'){
			actives[i].className = 'btn';
		}

	}

}

//Updates word list
function setLists(){

	var list = document.getElementById("wordlist");
	var scores =document.getElementById("wordscore");

	list.innerHTML = '';
	scores.innerHTML = '';
			
	total =0;

	for(var key in wordlist){

		var ul = document.getElementById("wordlist");
 		var li = document.createElement("li");
  		li.appendChild(document.createTextNode(key));
  		ul.appendChild(li);
  
  		var ul = document.getElementById("wordscore");
  		var li = document.createElement("li");
  		li.appendChild(document.createTextNode(wordlist[key]));
  		ul.appendChild(li);
  
  		total+=wordlist[key];

}

	document.getElementById('totalscore').innerHTML=total;

}


//When score is submitted this function records the data using Web Storage and displays the scores.
function submitScore(){

	document.getElementById('result').style="display:inherit";
	document.getElementById('input').style="display:none";
	document.getElementById('input1').style="display:none";
	document.getElementById("column1").innerHTML ='';
	document.getElementById("column2").innerHTML ='';
	


	var name = document.getElementById('name').value;

	if (typeof(Storage) !== "undefined") {

		var lis = localStorage.getItem("scores");
		var arr = [];
	
		if(lis!=null){
			arr  = lis.split(",");
		}
			arr.push(name+"||"+ total);
			
			console.log(arr.toString());

			localStorage.setItem("scores", arr.toString());
		

 		lis = localStorage.getItem("scores");

		if(lis!=null){
			var arr1 = [];
			arr1  = lis.split(",");

    		for(var i=0;i<arr1.length;i++){
    
    
    			var c1 = arr1[i].split("||")[0];
    			var c2 = arr1[i].split("||")[1];
    
    				if(c1!=null){
    
    					var ul1 = document.getElementById("column1");
 						var li1 = document.createElement("li");
  						li1.appendChild(document.createTextNode(c1));
  						ul1.appendChild(li1);
  					}
  		
  					if(c2!=null){
  
  						var ul2 = document.getElementById("column2");
  						var li2 = document.createElement("li");
  						li2.appendChild(document.createTextNode(c2));
  						ul2.appendChild(li2);
  		
   					}
    
    		}
    		
		} 
		}
		else {
			
  		  document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
		
		}

	}
	



//Triggers when time is up. Changes board to submit name.
function gameOver() {

document.getElementById('input1').innerHTML="Congratulations you scored "+total+" points!";
document.getElementById('input').style="display:initial";
document.getElementById('input1').style="display:initial";
document.getElementById('board').style="display:none";

}