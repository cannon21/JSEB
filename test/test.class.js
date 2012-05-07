test('class define', function() {
    qbe.class.define({
        "$package" : "com.qbigstudio.test/ds/stack",
        "data" : [],
        "limit" : 3,
        "curr" : 0,
        "getLength" : function() {
          return this.curr;
        },
        "getAvailLength" : function() {
          return (this.limit - this.curr);
        },
        "isOver" : function() {
            return this.curr + 1 > this.limit;
        },
        "isUnder" : function() {
          return this.curr < 1;
        },
        "push" : function(value) {
            if (this.isOver()) {
                throw new Error("stack overflow");
            }
            this.data[this.curr++] = value;
            return true;
        },
        "pop" : function() {
            if (this.isUnder()) {
                throw new Error("stack underflow");
            }
            return this.data[--this.curr];
        }
    });

    var stack = qbe.class.create("com.qbigstudio.test/ds/stack");

    strictEqual(true, stack.push(1), "push 1");
    strictEqual(1, stack.getLength(), "length 1");
    strictEqual(2, stack.getAvailLength(), "avail length 2");
    
    strictEqual(true, stack.push(2), "push 2");
    strictEqual(2, stack.getLength(), "length 2");
    strictEqual(1, stack.getAvailLength(), "avail length 1");

    strictEqual(true, stack.push(3), "push 3");
    strictEqual(3, stack.getLength(), "length 3");
    strictEqual(0, stack.getAvailLength(), "avail length 0");

    raises(function() {
        stack.push(4);
    }, 'test stack max length is 3 @ overflow');

    strictEqual(3, stack.pop(), "pop 3");
    strictEqual(2, stack.getLength(), "length 2");
    strictEqual(1, stack.getAvailLength(), "avail length 1");

    strictEqual(2, stack.pop(), "pop 2");
    strictEqual(1, stack.getLength(), "length 1");
    strictEqual(2, stack.getAvailLength(), "avail length 2");

    strictEqual(1, stack.pop(), "pop 1");
    strictEqual(0, stack.getLength(), "length 0");
    strictEqual(3, stack.getAvailLength(), "avail length 3");
    
    raises(function() {
        stack.pop();
    }, 'test stack min length is 0 @ underflow');

    strictEqual(true, stack.hasOwnProperty("data"));
    strictEqual(true, stack.hasOwnProperty("limit"));
    strictEqual(true, stack.hasOwnProperty("curr"));

    strictEqual(false, stack.hasOwnProperty("getLength"));
    strictEqual(false, stack.hasOwnProperty("getAvailLength"));
    strictEqual(false, stack.hasOwnProperty("isOver"));
    strictEqual(false, stack.hasOwnProperty("isUnder"));
    strictEqual(false, stack.hasOwnProperty("push"));
    strictEqual(false, stack.hasOwnProperty("pop"));

    strictEqual(true, stack['__proto__'].hasOwnProperty("getLength"));
    strictEqual(true, stack['__proto__'].hasOwnProperty("getAvailLength"));
    strictEqual(true, stack['__proto__'].hasOwnProperty("isOver"));
    strictEqual(true, stack['__proto__'].hasOwnProperty("isUnder"));
    strictEqual(true, stack['__proto__'].hasOwnProperty("push"));
    strictEqual(true, stack['__proto__'].hasOwnProperty("pop"));
});