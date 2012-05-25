test('class define', function() {
    qbe.class.define({
        "$package" : "com.qbigstudio.test.ds.stack",
        "data" : [],
        "capacity" : 0,
        "setCapacity" : function( capacity ) {
            return ( this.capacity = Number( capacity ) );
        },
        "getCapacity" : function() {
            return this.capacity;
        },
        "size" : 0,
        "getSize" : function() {
            return this.size;
        },
        "init" : function( capacity ) {
            if (!qbe.util.type.isNumeric( capacity )) {
                capacity = 5;
            }
            this.setCapacity( parseInt( capacity, 10 ) );
        },
        "isOver" : function() {
            return this.getSize() + 1 > this.getCapacity();
        },
        "isUnder" : function() {
          return this.getSize() < 1;
        },
        "push" : function( value ) {
            if ( this.isOver() ) {
                throw new Error( "stack overflow" );
            }
            this.data[ this.size++ ] = value;
            return true;
        },
        "pop" : function() {
            if ( this.isUnder() ) {
                throw new Error( "stack underflow" );
            }
            return this.data[ --this.size ];
        }
    });

    var stackSize = 3;
    var stack = qbe.class.create("com.qbigstudio.test.ds.stack", [ stackSize ]);

    strictEqual( stack.getCapacity(), stackSize, "capacity 3" );

    strictEqual( stack.push(1), true, "push 1" );
    strictEqual( stack.getSize(), 1, "size 1" );
    
    strictEqual( stack.push(2), true, "push 2" );
    strictEqual( stack.getSize(), 2, "size 2" );

    strictEqual( stack.push(3), true, "push 3" );
    strictEqual( stack.getSize(), 3, "size 3" );

    raises( function() {
        stack.push( 4 );
    }, 'test stack max size is 3 @ overflow' );

    strictEqual( stack.pop(), 3, "pop 3" );
    strictEqual( stack.getSize(), 2, "size 2" );

    strictEqual( stack.pop(), 2, "pop 2" );
    strictEqual( stack.getSize(), 1, "size 1" );

    strictEqual( stack.pop(), 1, "pop 1" );
    strictEqual( stack.getSize(), 0, "size 0" );
    
    raises( function() {
        stack.pop();
    }, 'test stack min size is 0 @ underflow' );

    strictEqual( stack.hasOwnProperty( "data" ), true, "variable scope is own : property @ data" );
    strictEqual( stack.hasOwnProperty( "capacity" ), true, "variable scope is own : property @ capacity" );
    strictEqual( stack.hasOwnProperty( "size" ), true, "variable scope is own : property @ size" );

    strictEqual( stack.hasOwnProperty( "getCapacity" ), false, "function scope is not own @ getCapacity" );
    strictEqual( stack.hasOwnProperty( "setCapacity" ), false, "function scope is not own @ setCapacity" );
    strictEqual( stack.hasOwnProperty( "getSize" ), false, "function scope is not own @ getSize" );
    strictEqual( stack.hasOwnProperty( "isOver" ), false, "function scope is not own @ isOver" );
    strictEqual( stack.hasOwnProperty( "isUnder" ), false, "function scope is not own @ isUnder" );
    strictEqual( stack.hasOwnProperty( "push" ), false, "function scope is not own @ push" );
    strictEqual( stack.hasOwnProperty( "pop" ), false, "function scope is not own @ pop" );

    strictEqual( stack.__proto__.hasOwnProperty( "getCapacity" ), true, "function scope is prototype @ getCapacity" );
    strictEqual( stack.__proto__.hasOwnProperty( "setCapacity" ), true, "function scope is prototype @ setCapacity" );
    strictEqual( stack.__proto__.hasOwnProperty( "getSize" ), true, "function scope is prototype @ getSize" );
    strictEqual( stack.__proto__.hasOwnProperty( "isOver" ), true, "function scope is prototype @ isOver" );
    strictEqual( stack.__proto__.hasOwnProperty( "isUnder" ), true, "function scope is prototype @ isUnder" );
    strictEqual( stack.__proto__.hasOwnProperty( "push" ), true, "function scope is prototype @ push" );
    strictEqual( stack.__proto__.hasOwnProperty( "pop" ), true, "function scope is prototype @ pop" );
});

test('class extends', function() {
    qbe.class.define( {
        "$package" : "com.qbigstudio.test.extend.parentClass",
        "name" : "parent",
        "getName" : function() {
            return this.name;
        },
        "setName" : function( name ) {
            return ( this.name = name );
        }
    } );

    var parent = qbe.class.create( "com.qbigstudio.test.extend.parentClass" );
    strictEqual( parent.getName(), "parent", "parent # getName > parent" );
    strictEqual( parent.setName( "parent set" ), "parent set", "parent # setName > parent set" );

    qbe.class.define( {
        "$package" : "com.qbigstudio.test.extend.childClass",
        "$parents" : [ "com.qbigstudio.test.extend.parentClass" ],
        "name" : "child",
        "getName" : function() {
            return "[ " + this.name + " ]";
        },
        "setName" : function( name ) {
            return ( qbe.class.applyMethod( this, "com.qbigstudio.test.extend.parentClass", "setName", [ "{ " + name + " }" ] ) );
        }
    } );

    var child = qbe.class.create( "com.qbigstudio.test.extend.childClass" );
    strictEqual( child.getName(), "[ child ]", "child # getName > [ child ]" );
    strictEqual( child.setName( "child" ), "{ child }", "child # setName > { child }" );
    strictEqual( child.getName(), "[ { child } ]", "child # getName > [ { child } ]" );
    
});