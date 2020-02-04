
/**
 * 펑션 선언
 */
var cars = [];
var car01 = {
    name: "sonata",
    ph: "500ph",
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    }
}
var car02 = {
    name: "BMW",
    ph: "600ph",
    start: function () {
        console.log("engine is starting");
    },
    stop: function () {
        console.log("engine is stoped");
    }
}

cars[0] = car01;
cars[1] = car02;

/**
 * 반복문 예시 20200204 ksj
 */
for(var i=0; i<cars.length; i++) {
    var element = cars[i];
    if(element.name == "BMW") {
        console.log(i);
    }
}