test('name space set/get', function() {
    var expect = 1;
    qbe.ns.set('TEST', expect);
    strictEqual(1, qbe.ns.get('TEST'));

    // pass reference
    expect = {
        "a" : 1
    };
    qbe.ns.set('TEST', expect);
    strictEqual(1, qbe.ns.get('TEST').a);
    expect.a = 2;
    strictEqual(2, qbe.ns.get('TEST').a);
});

test('illegal use case', function() {
    raises(function() {
        qbe.ns.get('NotExist');
    });
});

test('namespace format', function() {
    strictEqual(true, qbe.ns.isValidFormat('TEST'));
    strictEqual(true, qbe.ns.isValidFormat('TEST.TEST'));
    strictEqual(true, qbe.ns.isValidFormat('TEST1.TEST2.TEST3'));

    strictEqual(false, qbe.ns.isValidFormat('1TEST'));
    strictEqual(false, qbe.ns.isValidFormat('TEST.1TEST'));
    strictEqual(false, qbe.ns.isValidFormat('T%$@EST'));
    strictEqual(false, qbe.ns.isValidFormat('TEST.@^@#$'));
    strictEqual(false, qbe.ns.isValidFormat('TEST.THIS_IS'));
});