jQuery(document).ready(function () {
  // VARIABLES
  const min = 1;
  const max = 100;
  const attempts = 8;
  let find;
  let lives;
  let guesses = [];
  let nIntervId;
  let playing = true;

  // ELEMENTS
  const livesElem = jQuery("#lives");
  const stateElem = jQuery("#state");
  const lifeElem = jQuery(".life");
  const screenElem = jQuery("#screen");
  const dialogContainerElem = jQuery("#dialog");
  const arrows = jQuery(".arrows");
  const symbol = jQuery("#symbol");

  // TEXTS
  const incorrectInput = `Cet input n'est pas entre ${min} et ${max}.`;
  const moreText = "Il faut plus ! Recap : ";
  const lessText = "Il faut moins ! Recap : ";
  const lostText = "Vous avez perdu... Le nombre etait : ";
  const wonText = "Bien joue, vous avez reussi a craquer le code !";

  // FUNCTIONS

  function setgame() {
    find = Math.floor(Math.random() * (max - min + 1)) + min;
    lives = attempts;
    livesElem.text(lives);
    stateElem.empty();
    lifeElem.css({ filter: "hue-rotate(168deg) contrast(5)" });
    guesses = [];
    playing = true;
    symbol.text("/");
  }

  function play() {
    if (playing) {
      input = parseInt(screenElem.val(), 10);
      if (input >= min && input <= max) {
        guesses.push(input);
        if (input !== find) {
          lives--;
          //Animation de perte de vie et d'indication
          jQuery(`.life:nth-child(${attempts - lives})`).css({
            filter: "grayscale(1)",
          });
          livesElem.text(lives);
          if (input < find) {
            stateElem.text(moreText + guesses.join(", "));
            animateArrows(true);
            symbol.text("+");
          } else {
            stateElem.text(lessText + guesses.join(", "));
            animateArrows(false);
            symbol.text("-");
          }
          if (lives < 1) {
            //Le joueur a perdu
            changeDialog(true, find);
            dialogContainerElem.dialog("open");
            playing = false;
            jQuery(`.life:nth-child(${attempts - lives})`).css({
              filter: "grayscale(1)",
            });
            livesElem.text(lives);
            screenElem.val("");
          }
        } else {
          //Le joueur a gagné
          changeDialog(false, guesses);
          dialogContainerElem.dialog("open");
          playing = false;
          screenElem.val("");
          return 1;
        }
        screenElem.val("");
      } else {
        stateElem.text(incorrectInput);
      }
    } else {
      setgame();
    }
    return 0;
  }

  function animateArrows(isMore) {
    const elem = isMore ? "#more" : "#less";
    if (!nIntervId) {
      nIntervId = setInterval(() => toggle(elem), 100);
    }
    setTimeout(() => {
      clearInterval(nIntervId);
      nIntervId = null;
      arrows.hide();
    }, 1500);
  }

  function toggle(elem) {
    jQuery(elem).toggle();
  }

  function changeDialog(isLost, secret) {
    if (isLost) {
      dialogContainerElem.find("label").text(lostText + secret);
      if (dialogContainerElem.hasClass("wonDialog")) {
        dialogContainerElem.removeClass("wonDialog");
        dialogContainerElem.addClass("lostDialog");
      } else if (
        !dialogContainerElem.hasClass("wonDialog") &&
        !dialogContainerElem.hasClass("lostDialog")
      ) {
        dialogContainerElem.addClass("lostDialog");
      }
    } else {
      dialogContainerElem.find("label").text(wonText);
      if (dialogContainerElem.hasClass("lostDialog")) {
        dialogContainerElem.removeClass("lostDialog");
        dialogContainerElem.addClass("wonDialog");
      } else if (
        !dialogContainerElem.hasClass("wonDialog") &&
        !dialogContainerElem.hasClass("lostDialog")
      ) {
        dialogContainerElem.addClass("wonDialog");
      }
    }
  }

  // ACTIONS

  jQuery(".num").on("click", function () {
    screenElem.val(screenElem.val() + jQuery(this).text());
  });

  jQuery(document).on("keypress", (e) => {
    if (e.which === 13) {
      play();
    }
  });

  jQuery("#reset").on("click", () => screenElem.val(""));

  jQuery("#submit").on("click", (e) => play());

  arrows.hide();

  jQuery(".replayButton").on("click", () => {
    dialogContainerElem.dialog("close");
    setgame();
  });

  const dialogOptions = {
    clickOut: true,
    responsive: false,
    showTitleBar: false,
    autoOpen: false,
    showCloseButton: false,
    modal: true,
    show: {
      effect: "drop",
      duration: 500,
    },
    hide: {
      effect: "drop",
      duration: 500,
    },
  };
  dialogContainerElem.dialog(dialogOptions);

  setgame();
});
