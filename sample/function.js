
/**
 * 연산 함수
 * @param {*} p1 
 * @param {*} p2 
 */
function plus(p1, p2) {
    return p1 + p2;
}
function minus(p1, p2) {
    return p1 - p2;
}
function mul(p1, p2) {
    return p1 * p2;
}
function div(p1, p2) {
    return p1 / p2;
}

/**
 * 출력하기
 */
var a = 10;
var b = 20;

console.log("plus= " + plus(a,b));
console.log("minus= " + minus(a,b));
console.log("mul= " + mul(a,b));
console.log("div= " + div(a,b));