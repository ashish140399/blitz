// Global object
var global = {
     userAddress:'',
     userAddressHex:'',
	 userName:'',
	 userEmail:'',
	 userPhone:'',
	 userImagePath:'',
     loggedIn : false,	 
 };

//shasta net currently
var blitzContractInstance;
const blitzContractAddress = 'TBh5J6MPc4nvTR2Ut2rKAReRD9SYCDBQTS';
var blitzContractInfo;
var backClock = 0;
var currentPot = 0;
document.cookie = "tronlinkLoginTracker=0";

$(document).ready(async function() 
{
	//tronlink login checked
	setTimeout(tronLoginCheck, 2000);
    async function tronLoginCheck()
	{
        
        try
		{
            if (!(window.tronWeb && window.tronWeb.ready) ) 
			{ 
				// Ask to install/login to tronlink and set UI object accordingly(show/hide etc)
				$("#popup-zero").modal('show');
                setTimeout(function() 
				{
					$("#popup-zero").modal('hide');
                }, 10000);
                global.userAddress = '';
				document.cookie = "tronlinkLoginTracker=1";
				console.log("tronlinkLoginTracker=1");				
            }
            else 
			{
				// when logged to tronlink get the user name and set the screen accordingly
                global.userAddress = await window.tronWeb.defaultAddress.base58;
                global.userAddressHex = await window.tronWeb.defaultAddress.hex;
                global.loggedIn = true;
				//update profile top right of the screen
				updateUserInfo(global.userAddress,0);

				blitzContractInfo = await tronWeb.trx.getContract(blitzContractAddress);
				blitzContractInstance = await tronWeb.contract(blitzContractInfo.abi.entrys, blitzContractInfo.contract_address);						
				updateBalance();
				var wheelData = await blitzContractInstance.getlastWheelData().call();
				
				//update wheel board with player information
				var d = new Date();
				var n = Date.parse(d);
				n = n/1000;			
				n = n - wheelData['startTime'];
				if (n<wheelData['wheelLife'])
				{
					backClock = n;
				}
				else
				{
					backClock = 0;
				}
				var total=0;
				var i=0;
				while (wheelData['betOfEach'][i] > 0)
				{
					total = total + parseInt(wheelData['betOfEach'][i]);		
					i++;
				}
				currentPot = total;
				var tmp;
				i=0;
				document.getElementById("playersUL").innerHTML = ""; 
				while (wheelData['betOfEach'][i] > 0)
				{
					updateUserInfo(wheelData['playerOnWheel'][i],1,i,wheelData['betOfEach'][i]);
					tmp = wheelData['betOfEach'][i] *100 / total;
					updateUserInfo(wheelData['playerOnWheel'][i],2,i,wheelData['betOfEach'][i],tmp);
					i++;
				}
				document.getElementById("player_count").innerHTML = i;
				//update player list with player information
				
				//update winner panel top left of the screen
				
				//update left bottom stastistics
				setCollictiveStat();
            }

        } catch (e) {
            console.log("Stop", e, tronLoginCheck);
        }
    }	
	
/*	setTimeout(init,5000);
	
	async function init()
	{
		blitzContractInfo = await tronWeb.trx.getContract(blitzContractAddress);
		blitzContractInstance = await tronWeb.contract(blitzContractInfo.abi.entrys, blitzContractInfo.contract_address);	
		resetUIData();			
	}*/
	
    //Capture if address changed by user check after every 2sec, if changed reload page new user address will synced automatically.
    let intervalID = setInterval(async function() {
        if (typeof window.tronWeb == "object") {
            var userAddress = await window.tronWeb.defaultAddress.base58; 
            if(global.userAddress!=userAddress ){ 
                location.reload();
            }
        }
    }, 2000);	
	
});

/*//Reset UI data
async function resetUIData()
{
	var newLiObject = "";
	//reset left pane of user information
	var maxParticipant  = await blitzContractInstance.maxParticipant().call();
	var nextUser = "";
	for (i=1;i<=maxParticipant;i++)
	{
		nextUser = getPlayerLiContent(i,"Empty Slot","images/user.jpg","00.00","0");
		$('#playersUL').append(nextUser);
	}

	//other ui elements already reset in intex.html under respective tag block
	
}*/

//Set players information by the given array object
function setPlayerSection(usersOnWheel)
{
	for(i=0;i<usersOnwheel.length;i++)
	{
		
	}
}	

//Set winner section of the top left pane
function setWinnerSection()
{
	
}


//Set global statistics of the UI
async function setCollictiveStat()
{
	blitzContractInfo = await tronWeb.trx.getContract(blitzContractAddress);
	blitzContractInstance = await tronWeb.contract(blitzContractInfo.abi.entrys, blitzContractInfo.contract_address);		
	var d = new Date();
	d.setHours(0,0,0,0);
	var n = Date.parse(d);
	n = n/1000;
	var retData = await blitzContractInstance.getDataSince(n).call();
	document.getElementById("BiggestDayWinValue").innerHTML = retData['biggestWin'] + " TRX";
	document.getElementById("TotalOnlinePlayers").innerHTML = retData['playerCount'];
	document.getElementById("TotalTRXPlayedToday").innerHTML = retData['playedTRX'] + " TRX";
	document.getElementById("TotalPlayedToday").innerHTML = retData['playCount'];
}


function setWheel()
{
	
}

function setChatWindow()
{
	
}



function timer() {
    if (backClock >= 0)
    {
        $(".rangeslider__handle").text(backClock);
        backClock--;
    }
}
setInterval(timer, 1000);

function getPlayerLiContent(userIndex,name,imageName, trx, sharePercent,linkText)
{
	//var newChildContent = $('#playersUL').html();
	sharePercent = sharePercent.toFixed(2);
	var newChildContent = '<li class="side-ply"><a id="userLink-1" href="#"><div class="palyer-min"><div class="row"><div class="col-sm-2 col-xs-3"><div class="ply-img"><img id="userImg-1" src="images/user.jpg" alt=""></div></div><div class="col-sm-8 col-xs-7"><div class="player-data"><h4 id="userName-1" >No Player</h4><p>Joins with <strong id="userTRX-1">00.00 TRX</strong></p></div></div><div class="col-sm-2 col-xs-2"><div class="progres-x"><h6 id="userBetPercent-1" >0%</h6></div></div></div></div></a></li>';
	newChildContent = newChildContent.replace(/-1/g,"-"+userIndex);
	newChildContent = newChildContent.replace("No Player",name);
	newChildContent = newChildContent.replace("images/user.jpg",imageName);
	newChildContent = newChildContent.replace("00.00",trx);
	newChildContent = newChildContent.replace("0%",sharePercent+"%");
	newChildContent = newChildContent.replace("#",linkText);
	return newChildContent;
}



function getChatLiContent(userIndex,name,imageName, msgTtime, message)
{
	//var newChildContent = $('#playersUL').html();
	var newChildContent = '<li><div class="chet-bxx"><div class="user-cht"><img id="chatSenderImage" src="images/user.jpg" alt=""></div><div class="user-detct"><h6 id="chatSenderName">No User<small id="chatSendingTime"> 0:00</small></h6><p id="ChatMessages">Chat Message</p></div></div></li>';
	newChildContent = newChildContent.replace("No User",name);
	newChildContent = newChildContent.replace("images/user.jpg",imageName);
	newChildContent = newChildContent.replace("0:00"," "+ msgTtime);
	newChildContent = newChildContent.replace("Chat Message",message);
	return newChildContent;
}

function setImageAndBetOnWheel(userIndex, imageName, betAmount)
{
	
	document.getElementById("pImage" + userIndex).style.backgroundImage = "url('" + imageName + "')";
	document.getElementById("p" + userIndex + "p").value = betAmount;
	setval();
}

function shortAddress(fulladdress)
{
	return(fulladdress.substring(0,3)+"..."+fulladdress.substring(fulladdress.length - 3, fulladdress.length));
}


// updatePoint 0=profile corner, 1= on wheel, 2=left player pane , 3= left top winner pane
function updateUserInfo(usrAddress, updatePoint,userIndex=0, betAmount=0,betPercent=0)
{
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = async function() 
	{

		if (this.readyState == 4 && this.status == 200)
		{
			//console.log(this.responseText);
			var data = JSON.parse(this.responseText);
			switch (updatePoint)
			{
				case 0: // profile corner
					if (data.length > 0 )
					{			
						document.getElementById("loggedInUser").innerHTML = data[0]['name'];
						document.getElementById("profile_img").src = data[0]['image_path'];
					}
					else
					{
						document.getElementById("loggedInUser").innerHTML = shortAddress(global.userAddress);
					}

					break;
				case 1: // on wheel
					if (data.length > 0 )
					{
						setImageAndBetOnWheel(userIndex+1, data[0]['image_path'], betAmount);
					}
					else
					{
						setImageAndBetOnWheel(userIndex+1, "images/user.jpg", betAmount);
					}				
					break;
				case 2: //left player pane
					if (data.length > 0 )
					{
						nextUser = getPlayerLiContent(userIndex+1,data[0]['name'],data[0]['image_path'],betAmount,betPercent);
						$('#playersUL').append(nextUser);
						$('#playersUL').nth-child(nextUser);
					}
					else
					{	var useradd = await tronWeb.address.fromHex(usrAddress);
						$.getJSON( "https://api.shasta.tronscan.org/api/account?address="+useradd, function( data ) {
							if(data.name==""){
								useradd = shortAddress(useradd);
							}else{
								useradd = data.name;
							}
						});
						setTimeout(function(){
							nextUser = getPlayerLiContent(userIndex+1,useradd,"images/user.jpg",betAmount,betPercent);
							$('#playersUL').append(nextUser);
						},1000);						
					}					
					break;
				case 3: //left top winner pane
					
					break;
					
				default:
					console.log("wrong case");
			}
		}
	};
	xhttp.open("POST", "php/assist.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//xhttp.send("button=getUserInfo&address="+global.userAddress);
	xhttp.send("button=getUserInfo&address="+usrAddress);
}

async function pushBetOnWheel()
{
	setTimeout(function(){},3000);		
	var minAmount = await blitzContractInstance.minBetAmount().call();
	minAmount = tronWeb.toDecimal(minAmount);
	var betAmount = document.getElementById("AmountToBet").value;
	var referrer = '0x0000000000000000000000000000000000000000';

	if (betAmount < minAmount)
	{
		alert("please bet minimum " + minAmount + " amount");
	}
	else
	{
		betAmount = parseInt(betAmount);
		 var callValue = betAmount * 1000000;
		 
        try {
				blitzContractInfo = await tronWeb.trx.getContract(blitzContractAddress);
				blitzContractInstance = await tronWeb.contract(blitzContractInfo.abi.entrys, blitzContractInfo.contract_address);
				
                let txRes = await blitzContractInstance.placeSeriesBet(0,betAmount,referrer).send({
                        feeLimit: 10000000,
                        callValue: callValue,
                        shouldPollResponse: false
                    });
                
                location.reload();
                //generating output


                
            } catch (err) {
                console.log("Error:", err);
            }		
	}
}

async function updateBalance(){
	blitzContractInfo = await tronWeb.trx.getContract(blitzContractAddress);
	blitzContractInstance = await tronWeb.contract(blitzContractInfo.abi.entrys, blitzContractInfo.contract_address);
	
	//get wallet balance and display 
	var walletBalance = await tronWeb.trx.getBalance(global.userAddress);
	walletBalance = tronWeb.fromSun(walletBalance);
	$('#walletBalance').html(walletBalance);

	//get contract balance and display
	var contractBalance = await blitzContractInstance.remainingBalance(global.userAddress).call();
	var val = Object.values(contractBalance);
	contractBalance = window.tronWeb.toDecimal(val[0]);
    contractBalance = contractBalance / 1000000;
    $('#contractBalance').html(contractBalance);
}

$('#btnDeposit').click(async function(){
	var trx = $('#trxDeposit').val();
	if(trx==''){
		alert('Please Enter Value');
		return false;
	}
   	if(isNaN(trx)){
   		alert('Please Enter Value');
        $(this).val('');
        return false;
    }
    if(trx < 0){
        alert('Value must be Positive');
        $(this).val('');
        return false;
    }
    trx = tronWeb.toSun(trx);
    
    let txRes = await blitzContractInstance.trxDeposit().send({
                feeLimit: 10000000,
                callValue: trx,
                shouldPollResponse: false
             });
    updateBalance();
});

$('#btnWithdraw').click(async function(){
	var trx = $('#trxWithdraw').val();
	if(trx==''){
		alert('Please Enter Value');
		return false;
	}
   	if(isNaN(trx)){
   		alert('Please Enter Value');
        $(this).val('');
        return false;
    }
    if(trx < 0){
        alert('Value must be Positive');
        $(this).val('');
        return false;
    }
    trx = tronWeb.toSun(trx);
    
    let txRes = await blitzContractInstance.trxWithdraw(trx).send({
                feeLimit: 10000000,
                callValue: 0,
                shouldPollResponse: false
             });
    updateBalance();
});

$('#AmountToBet').keyup(async function(){
      var minAmount = await blitzContractInstance.minBetAmount().call();
	  minAmount = tronWeb.toDecimal(minAmount);
      var betAmt = $("#AmountToBet").val();
      var totalPot   = parseFloat(currentPot) + parseFloat(betAmt);
      var winChance  = betAmt/totalPot*100;
      $('#winChancePercent').html(winChance.toFixed(2) + '%');
    });
$('#AmountToBet').blur(async function(){
      var minAmount = await blitzContractInstance.minBetAmount().call();
	  minAmount = tronWeb.toDecimal(minAmount);
      var betAmt = $("#AmountToBet").val();
        if(betAmt<minAmount){
           betAmt = minAmount;
           $(this).val(betAmt);
      }
      var totalPot   = parseFloat(currentPot) + parseFloat(betAmt);
      var winChance  = betAmt/totalPot*100;
      $('#winChancePercent').html(winChance.toFixed(2) + '%');
    });