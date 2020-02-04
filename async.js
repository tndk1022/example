var fs = require('fs');

/**
 * 읽어오는 순서 출력
 */
console.log('첫번째 기능');
fs.readFile('test.txt', 'utf8', function(err, result) {
    if(err) {
        console.error(err);
        throw err;
    } else {
        console.error("두번째 기능, 파일 시간 걸림");
        console.log(result);
    }
});
console.log("마지막 기능");

/**
 * 파일 읽어와서 내용 출력
 */
var result = fs.readFileSync('test.txt', 'utf-8');

console.log(result);
console.log('C');