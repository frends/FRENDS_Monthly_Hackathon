describe('LocalStorage', function() {
    var db,
        options,
        user;

    db = new Database({
        name: 'local-database',
        storage: 'LocalStorage'
    });

    options = {
        name: 'user'
    };

    before(function() {
        user = db.model(options);
    });

    it('기존 모델이 없으면 새 모델을 만든다.', function() {
        expect(localStorage.user).to.be.exist;
    });

    it('새 데이터를 추가한다.', function() {
        user.append({
            name : 'fallroot',
            email: 'fallroot@gmail.com'
        });

        expect(localStorage.user).to.be.exist;
    });

    it('저장된 데이터를 가져온다.', function() {
        var users = user.all();

        expect(users).to.be.exist;
    });
});

xdescribe('IndexedDB', function() {
    var options = {
        name: 'user',
        storage: 'IndexedDB'
    };

    var db = new Database(options);

    it('#model', function() {
        var options = {
            name: 'user'
        };

        var user = db.createModel(options);
        user.save({
            name : 'fallroot',
            email: 'fallroot@gmail.com'
        });

        // expect(localStorage[options.name]).to.be.exist;
    });

    // it('', function() {

    // });
});
