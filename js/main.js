const start = () => {
    //fetchin json file and returning the respons.
    fetch("Texts.json").then(respons => {
        return respons.json();
    }).then(obj => {
        // then we call jsonObj and selectItems funtions with the json object
        // as argument.
        jsonObject(obj);
        selectItems(obj);
    }).catch(error => {
        // if error we print the error.
        console.error(error);
    });
    // calling inputPlaceholder.
    inputPlaceholder();

};
// funtion that plays quick beep sound
const beep = () => {
    // new audio obj
    let snd = new Audio("audio/audio.mp3");
    // play the sound.
    snd.play();
}


const jsonObject = (obj) => {
    // takes json object as argument, select the html element select
    let titles = document.getElementById("text");
    // Selecting radio Buttons.
    const eng = document.getElementById("english");
    const swe = document.getElementById("swedish");
    // add eventlistener on radio button english.
    eng.addEventListener("click", () => {
        // save it in session storage and refresh the page
        sessionStorage.setItem("language", "english");
        window.location.reload();
    });
    swe.addEventListener("click", () => {
        // same process for swedish
        sessionStorage.setItem("language", "swedish");
        window.location.reload();
    });
    // check the radio button based on session item.
    sessionStorage.getItem("language") === "english" ?
        eng.checked = true : swe.checked = true;

    if (eng.checked) {
        // if english call jsonobjhelper function
        jsonObjHelper(obj, "english", titles);
    } else if (swe.checked) {
        // same for swedish
        jsonObjHelper(obj, "swedish", titles);
    }
    // remove the item at the end.
    sessionStorage.removeItem("language");
}

const jsonObjHelper = (obj, lang, el) => {
    // loops through language in Texts.json, checked if its english/swedish
    // and create option element with value of title array.
    obj.texts.language.forEach(function (val, i) {
        if (val === lang) {
            let opt = document.createElement("option");
            // write value
            opt.text = obj.texts.title[i];
            opt.value = obj.texts.title[i];
            // lastly append the option as child in the select.
            el.appendChild(opt);
        }
    });
}
const selectItems = (obj) => {
    let index;
    // select radio button english.
    const eng = document.getElementById("english");
    // select the select element.
    const selectElement = document.querySelector("select");
    // add eventlistener on the parent select.
    selectElement.addEventListener("change", (e) => {
        // get the index of the chosen option.
        if (eng.checked) {
            // we add 4 to index if english because there is 4
            // swedish texts.
            index = e.target.selectedIndex + 4;
        } else {
            // else normal.
            index = e.target.selectedIndex;

        }
        const createObject = {
            // get the values using the index, because they are ordered,
            //inside the arrays.
            title: obj.texts.title[index],
            language: obj.texts.language[index],
            author: obj.texts.author[index],
            text: obj.texts.text[index]

        };
        // call updateDiv to update the div(text).
        updateDiv(createObject);
    })
};

const updateDiv = (obj) => {
    let content = "";
    let words, chars;
    // count the words and chars of the text.
    words = obj.text.split(" ").length;
    chars = obj.text.length;
    // string to hold the html.
    let textCon = "";
    // allign text left
    textCon += "<p style='text-align: left'>";
    // put every char in a span.
    for (let i = 0; i < obj.text.length; i++) {
        textCon += `<span class="text-p">${obj.text[i]}</span>`;
    }
    textCon += "</p>";
    // the title is center aligned but author, word count and chars are centered.
    content += `<h3 style="text-align: center">${obj.title}</h3>
    <p style="color: #5995DA; text-align: center">${obj.author}(${words} words, ${chars} chars)</p>`;
    content += textCon;
    // select the div and append html string to it.
    const div = document.querySelector("#div-content");
    div.innerHTML = content;

    // you have to click play button to play.
    document.getElementById("state-button")
        .addEventListener("click", (inputMatch));

};

const inputMatch = () => {
    // get the spans by className.
    const text = document.getElementsByClassName("text-p");
    // get inputField.
    const input = document.getElementById("text-type");
    // reset input field value.
    input.value = "";
    // variables for the statistics also create a Date obj for start time.
    let marker = 0, error = 0, correct = 0;
    let gameDate = new Date();
    let timeStart = gameDate.getTime();
    // obj so i can pass value by reference.
    const obj = {
        "m": marker,
        "t": text,
        "choice": [correct, error]
    };

    // change the first span's(highlighter) background color.
    text[marker].style.backgroundColor = "#5995da";
    // ignore casting checkbox.
    const casting = document.getElementById("casting");
    // addeventlistener, and listen for input.
    input.addEventListener("input", (e) => {
        // last char.
        let lastChar = e.target.value[e.target.value.length - 1];
        // getting the values from the object.
        marker = obj.m;
        error = obj.choice[1];
        correct = obj.choice[0];

        // clear background color up to the marker(highlighter).
        if (marker !== text.length) {
            for (let i = 0; i <= marker; i++) {
                text[i].style.backgroundColor = "#fff";
            }

            // if the span char matches the last char input, call inputMatchHelper.
            // and if the checkbox ignore casting is checked.
            if (casting.checked) {
                // check in uppercase.
                if (text[marker].textContent.toString().toUpperCase()
                    === lastChar.toString().toUpperCase()) {

                    inputMatchHelper(obj, "green", 0);

                    // same process if its not matching.
                } else if (text[marker].textContent.toString().toUpperCase()
                    !== lastChar.toString().toUpperCase()) {
                    // if wrong input play sound.
                    beep();
                    inputMatchHelper(obj, "red", 1);
                }
            } else {
                if (text[marker].textContent === lastChar) {

                    inputMatchHelper(obj, "green", 0);

                    // same process if its not matching.
                } else if (text[marker].textContent !== lastChar) {
                    // if wrong input play sound.
                    beep();
                    inputMatchHelper(obj, "red", 1);
                }
            }

            // if input is a space then clear the input field.
            if (lastChar === " ") {
                input.value = "";
            }

        } else {
            // alert when the game ends, u can observe the results.
            alert("Game ended, check your stats and \n" +
                "Press stop to reset and play again");
            input.value = "";
            return;
        }
        // call displayGameStats function.
        displayGameStats(error, correct, text, timeStart);

    });
}


const inputMatchHelper = (obj, col, index) => {
    // helper funtion, to see if marker is at the last char(text).
    if (obj.m === obj.t.length - 1) {
        // if it is we change color, green or red and
        // and increment error or correct variable, depending on index.
        obj.t[obj.m].style.color = col;
        obj.choice[index]++;
        // change the marker, to the same lenghd as the text.
        // so next time the else statement in inputMatch gets executed.
        obj.m = obj.t.length;
    } else {
        // else we increment the marker, change background color
        // for next character to be typed and increment error or correct.
        obj.t[obj.m].style.color = col;
        obj.m++;
        obj.t[obj.m].style.backgroundColor = "#5995da";
        obj.choice[index]++;
    }

}

const displayGameStats = (error, correct, text, timeStart) => {
    // create a new Date for timeEnd.
    let t = new Date();
    let timeEnd = t.getTime();
    // when the user start typing, change the start img to stop image.
    document.getElementById("state").src = "img/stop.jpg";
    // select stats html.
    const buttonImage = document.getElementById("state-button");
    const gross = document.getElementById("gross-wpm");
    const net = document.getElementById("net-wpm");
    const acc = document.getElementById("acc");
    const errors = document.getElementById("errors");

    // error and accuracy.
    errors.textContent = error;
    let accuracy = (correct / text.length) * 100;
    // rounding the results.
    accuracy = Math.round(accuracy);
    acc.textContent = accuracy + "%";

    // calculate elapsed time, and convert it to seconds.
    let elapsedMin = (timeEnd - timeStart) / 60000;
    // calculate gross WPM and write to html.
    let grossWpm = Math.round(((error + correct) / 5) / elapsedMin);
    gross.textContent = grossWpm;

    // calculate netWPM, round the result and dont show if the
    // result is less than 0.
    let netWpm = grossWpm - Math.round((error / (elapsedMin)));
    netWpm <= 0 ? net.textContent = "0" : net.textContent = netWpm;

    // if the game is being played and the stop
    // button is clicked, reload the page.
    buttonImage.addEventListener("click", () => {
        window.location.reload();

    });
}

const inputPlaceholder = () => {
    // if the input is focused in, the placeholder is empty.
    const input = document.getElementById("text-type");
    input.addEventListener("focusin", (e) => {
        e.target.placeholder = "";
    });
    // if it is focused out then we show a text as placeholder.
    input.addEventListener("focusout", (e) => {
        e.target.placeholder = "Type here.";
    });
};


// when the page loads
window.addEventListener("load", start, false);