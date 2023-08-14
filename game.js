const letters = document.querySelectorAll('.box');
const LoadingDiv = document.querySelector('.info-bar')
const ANSWEAR_LENTH = 5
const ROUNDS = 6;


async function init() {
    let currentGuess ='';
    let currentRow = 0;
    let done = (false);
    let isLoading = true;


    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    setLoading(false);
    isLoading = false;



    function addLetter(letter) {
        if (currentGuess.length<ANSWEAR_LENTH) {
            currentGuess += letter;
        } else {
            current  = currentGuess.substring(0, currentGuess.length -1) + letter;
        }

        letters[ ANSWEAR_LENTH * currentRow + currentGuess.length-1].innerText = letter;
    }

async function commit() {
    if (currentGuess.length!== ANSWEAR_LENTH)  {
        return;
    }
    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method : "POST",
        body: JSON.stringify({word: currentGuess})
    });
    const resObj = await res.json();
    const validWord = resObj.validWord;


    isLoading = false;
    setLoading(false);

    if (!validWord) {
        markInValidWord();
        return;
    }
    const GuessParts = currentGuess.split("");
    const map = makeMap(wordParts);

    for (let i=0; i<ANSWEAR_LENTH;i++) {
        if (GuessParts[i] === wordParts[i]) {
            letters[currentRow * ANSWEAR_LENTH + i].classList.add("correct");
            map[GuessParts[i]]--;    
        }
    }
    for (let i = 0; i<ANSWEAR_LENTH; i++) {
        if (GuessParts[i] === wordParts[i]) {
        //
        
        } else if (wordParts.includes(GuessParts[i]) && map[GuessParts[i]]> 0 ) {

            letters[currentRow * ANSWEAR_LENTH + i].classList.add("close");
            map[GuessParts[i]]--;
    } else {
        letters[currentRow * ANSWEAR_LENTH + i].classList.add("wrong");
    }


}
    currentRow++;

    if (currentRow === ROUNDS) {
        alert(`you lose, the word was ${word}`);
        done= true;
        } else if (currentGuess === word) {
            alert('you win');
            document.querySelector('.brand').classList.add("winner");
            done = true;
            return;
        }
        currentGuess = '';
    }

    function backspace() {
        currentGuess  = currentGuess.substring(0, currentGuess.length -1);
        letters[ ANSWEAR_LENTH * currentRow + currentGuess.length].innerText = "";
    }
    function markInValidWord() {
        //alert('Not a valid word');
        for (let i = 0; i < ANSWEAR_LENTH; i++) {
            letters[currentRow * ANSWEAR_LENTH + i].classList.remove("invalid");
            
            setTimeout(function () {
                letters[currentRow * ANSWEAR_LENTH + i].classList.add("invalid");
            },20)
        }
    }
    document.addEventListener('keydown', function handleKeyPress (event) {
        if (done || isLoading) {
            return;
        } 
        const action = event.key;

        if (action === "Enter") {
            commit();
        } else if (action === "Backspace") {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
          // do nothing
        }
        });

}
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
    }

    function setLoading(isLoading) {
        LoadingDiv.classList.toggle("hidden", !isLoading);
    }

    function makeMap(array) {
        const obj = {};
        for (let i = 0; i < array.length; i++) {
            if (obj[array[i]]) {
            obj[array[i]]++;
            } else {
            obj[array[i]] = 1;
            }
        }
        return obj;
        }
init();