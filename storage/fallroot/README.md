# Local Database

저장소의 방식에 관계없이 자바스크립트 모델을 저장할 수 있다. 현재까지 가능한 저장소인 `LocalStorage`, `SessionStorage`, `WebSQL`, `IndexedDB` 모두 지원하고 싶었으나 시간 관계상. -ㅅ-;; 차후 나머지 저장소를 지원한다.

## Usage

``` js
var db = new Database({
    name: 'user',
    storage: 'LocalStorage'
});

var user = db.createModel({
    name: 'user'
});

user.save({
    name : 'fallroot',
    email: 'fallroot@gmail.com'
});
```