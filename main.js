let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let winnerName = document.getElementById("winnName");
let nextBtn = document.getElementById("next-game");

let turnO = true;//Player X , Player O

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

boxes.forEach((box) => {
    box.addEventListener("click", () =>{
        console.log("Box was clicked !");
        if (turnO) {
            box.innerText = "O"; //Player O
            turnO = false;
        }else{
            box.innerText = "X"; //Player x
            turnO = true;
        }
        box.disabled = true;
        checkWinner();
    })
})

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
}

const enableBoxes = () =>{
    for(let box of boxes){
        box.disabled = false ;
        box.innerText = "";
        winnerName.innerText = "Winner is : not defind";
    }
}

resetBtn.addEventListener("click", enableBoxes);
nextBtn.addEventListener("click", enableBoxes);

const checkWinner = () => {
    for(pattern of winPatterns) {
        
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != ""&& pos2Val != ""&& pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                console.log("WINNER", pos3Val);
                winnerName.innerText = "Winner is : "+ pos3Val;
                disableBoxes();
            }
        }
    }
    
}

