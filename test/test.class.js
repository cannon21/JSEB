test('class define', function() {
  strictEqual('function', typeof qbe.class.define);
  var mock = qbe.class.define({
    "_type_" : qbe.class.constant.TYPE.CLASS,
    "_public_" : {
      
    }
  })
});