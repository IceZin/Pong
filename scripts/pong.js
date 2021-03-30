function showGame(cb) {
    var menu = document.querySelector(".menu");
    var scoreboard = document.querySelector(".scoreboard");

    menu.style.top = "-600px";
    scoreboard.style.bottom = "10px";
}

function showMenu() {
    var menu = document.querySelector(".menu");
    var scoreboard = document.querySelector(".scoreboard");

    menu.style.top = "calc(50% - 250px)";
    scoreboard.style.bottom = "-180px";
}

window.onload = () => {
    var start = document.querySelector("#start");
    var canvas = document.querySelector("canvas");
    var gameUpdate;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var game;

    document.addEventListener("keydown", (e) => {
        if (e.key == "Escape") {
            if (game == undefined) return;

            clearInterval(gameUpdate);
            game.stop();
            showMenu();

            game = undefined;
        }
    });

    start.onclick = () => {
        game = new Game(canvas.getContext("2d"));

        showGame();

        game.render();

        gameUpdate = setInterval(() => {
            game.process();
        }, 1000 / 240);
    };
}