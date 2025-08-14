let fuelVisible = null; // Guarda el estado anterior de visibilidad de la gasolina

function show_hud() { $("body").fadeIn(300); }
function hide_hud() { $("body").fadeOut(300); }
function show_speedometer(status) {
    status
        ? $(".speedometer").fadeIn(300).find(".speed-items").animate({ opacity: 1 }, 300)
        : $(".speedometer").fadeOut(300).find(".speed-items").animate({ opacity: 0 }, 300);
}
function health(num) { $(".health .fill").css("width", num + "%"); }
function food(num) { $(".food .fill").css("width", num + "%"); }
function water(num) { $(".water .fill").css("width", num + "%"); }
function armour(num) {
    $(".armour .fill").css("width", num + "%");
    num <= 0 ? $(".armour").hide() : $(".armour").show();
}
function speed(num) {
    $({ numberValue: $(".speed p").text() }).animate(
        { numberValue: num },
        { duration: 200, easing: 'swing', step: function () { $(".speed p").text(Math.ceil(this.numberValue)); } }
    );
}
function fuel(num) {
    $(".fuel .fill").css("height", num + "L");
    $(".fuel p.px").text(num + "L");
}

window.addEventListener('message', (event) => {
    const { status, data } = event.data;

    if (status === "info") {
        if (typeof data.health === "number") health(parseInt(data.health.toFixed(0)));
        if (typeof data.armour === "number") armour(parseInt(data.armour.toFixed(0)));
        if (typeof data.food === "number") food(parseInt(data.food.toFixed(0)));
        if (typeof data.water === "number") water(parseInt(data.water.toFixed(0)));
    }

    if (status === "visible") {
        data ? show_hud() : hide_hud();
    }

    if (status === "speedometer") {
        if (!data.visible) { // Si no está en un vehículo, ocultar todo
            show_speedometer(false);
            $(".fuel").fadeOut(300);
            fuelVisible = false;
            return;
        }

        show_speedometer(true);

        const speed_num = typeof data.speed === "number" ? parseInt(data.speed.toFixed(0)) : 0;
        const fuel_num  = typeof data.fuel  === "number" ? parseInt(data.fuel.toFixed(0))  : 0;

        if (data.mph) $(".speed span").text("mph");

        speed(speed_num);
        fuel(fuel_num);

        if (speed_num <= 1) {
            $(".speedometer").fadeOut(300);
            $(".fuel").fadeOut(300);
            fuelVisible = false;
        } else {
            $(".speedometer").fadeIn(300);

            let shouldShowFuel = fuel_num < 41; 
            if (shouldShowFuel !== fuelVisible) {
                fuelVisible = shouldShowFuel;
                shouldShowFuel ? $(".fuel").fadeIn(300) : $(".fuel").fadeOut(300);
            }
        }
    }
});

window.addEventListener('message', function (event) {
    if (event.data.action === 'showTalkingImage') {
        document.getElementById('talkingImage').classList.add('show');
    } else if (event.data.action === 'hideTalkingImage') {
        document.getElementById('talkingImage').classList.remove('show');
    }
});


$(document).ready(function () {
    $(".speedometer").hide();
    $(".fuel").hide();
});