test('class define', function() {
    qbe.class.define({
        "$package" : "com.qbigstudio.test/ds/stack",
        "data" : [],
        "capacity" : 0,
        "setCapacity" : function(capacity) {
            return ( this.capacity = Number( capacity ) );
        },
        "getCapacity" : function() {
            return this.capacity;
        },
        "size" : 0,
        "getSize" : function() {
            return this.size;
        },
        "init" : function(capacity) {
            if (!qbe.util.type.isNumeric(capacity)) {
                capacity = 5;
            }
            this.setCapacity(parseInt(capacity, 10));
        },
        "isOver" : function() {
            return this.getSize() + 1 > this.getCapacity();
        },
        "isUnder" : function() {
          return this.getSize() < 1;
        },
        "push" : function(value) {
            if (this.isOver()) {
                throw new Error("stack overflow");
            }
            this.data[this.size++] = value;
            return true;
        },
        "pop" : function() {
            if (this.isUnder()) {
                throw new Error("stack underflow");
            }
            return this.data[--this.size];
        }
    });

    var stackSize = 3;
    var stack = qbe.class.create("com.qbigstudio.test/ds/stack", [ stackSize ]);

    strictEqual(stackSize, stack.getCapacity(), "capacity 3");

    strictEqual(true, stack.push(1), "push 1");
    strictEqual(1, stack.getSize(), "size 1");
    
    strictEqual(true, stack.push(2), "push 2");
    strictEqual(2, stack.getSize(), "size 2");

    strictEqual(true, stack.push(3), "push 3");
    strictEqual(3, stack.getSize(), "size 3");

    raises(function() {
        stack.push(4);
    }, 'test stack max size is 3 @ overflow');

    strictEqual(3, stack.pop(), "pop 3");
    strictEqual(2, stack.getSize(), "size 2");

    strictEqual(2, stack.pop(), "pop 2");
    strictEqual(1, stack.getSize(), "size 1");

    strictEqual(1, stack.pop(), "pop 1");
    strictEqual(0, stack.getSize(), "size 0");
    
    raises(function() {
        stack.pop();
    }, 'test stack min size is 0 @ underflow');

    strictEqual(true, stack.hasOwnProperty("data"), "variable scope is own : property @ data");
    strictEqual(true, stack.hasOwnProperty("capacity"), "variable scope is own : property @ capacity");
    strictEqual(true, stack.hasOwnProperty("size"), "variable scope is own : property @ size");

    strictEqual(false, stack.hasOwnProperty("getCapacity"), "function scope is not own @ getCapacity");
    strictEqual(false, stack.hasOwnProperty("setCapacity"), "function scope is not own @ setCapacity");
    strictEqual(false, stack.hasOwnProperty("getSize"), "function scope is not own @ getSize");
    strictEqual(false, stack.hasOwnProperty("isOver"), "function scope is not own @ isOver");
    strictEqual(false, stack.hasOwnProperty("isUnder"), "function scope is not own @ isUnder");
    strictEqual(false, stack.hasOwnProperty("push"), "function scope is not own @ push");
    strictEqual(false, stack.hasOwnProperty("pop"), "function scope is not own @ pop");

    strictEqual(true, stack['__proto__'].hasOwnProperty("getCapacity"), "function scope is prototype @ getCapacity");
    strictEqual(true, stack['__proto__'].hasOwnProperty("setCapacity"), "function scope is prototype @ setCapacity");
    strictEqual(true, stack['__proto__'].hasOwnProperty("getSize"), "function scope is prototype @ getSize");
    strictEqual(true, stack['__proto__'].hasOwnProperty("isOver"), "function scope is prototype @ isOver");
    strictEqual(true, stack['__proto__'].hasOwnProperty("isUnder"), "function scope is prototype @ isUnder");
    strictEqual(true, stack['__proto__'].hasOwnProperty("push"), "function scope is prototype @ push");
    strictEqual(true, stack['__proto__'].hasOwnProperty("pop"), "function scope is prototype @ pop");
});

test('class extends', function() {
    equal(true, true);
});