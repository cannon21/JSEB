/**
 * @author QbigStudio.trazy
 * @version 0.01a DEV
 */
( function() {
    var global = this;
    // TYPE VALIDATE FUNCTION
    var isInstanceOf = function( target, obj ) { return target instanceof obj; },
        isTypeOf = function( target, type ) {
            if ( typeof type !== 'string' ) {
                throw new Error();
            }
            return typeof target === type;
        },
        isFunction = function( target ) { return isInstanceOf( target, Function ); },
        isObject = function( target ) { return isInstanceOf( target, Object ); },
        isArray = function( target ) { return isInstanceOf( target, Array ); },
        isBool = function( target ) { return isTypeOf( target, 'boolean' ); },
        isNumber = function( target ) { return isTypeOf( target, 'number' ); },
        isString = function( target ) { return isTypeOf( target, 'string' ); },
        isNull = function( target ) { return target === null; },
        isUndefined = function( target ) { return target === undefined; },
        isNumeric = function( target ) { return !isNaN( parseFloat( target ) ) && isFinite( target ); };

    // BASE UTILITY FUNCTION
    var each = function( object, callback ) {
        var name,
            i = 0,
            length = object.length,
            isObject = isUndefined( length ) || isFunction( object );
        if ( isObject ) {
            for ( name in object ) {
                if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                    break;
                }
            }
        }

        return object;
    };
    var isPlainObject = function( obj ) {
        if ( !obj || typeof obj !== 'object' || obj.nodeType || obj === window ) {
            return false;
        }

        try {
            var hasOwn = Object.prototype.hasOwnProperty;
            if ( obj.constructor && !hasOwn.call( obj, "constructor" ) && !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
        } catch ( e ) {
            return false;
        }

        var key;
        for ( key in obj ) {
        }

        return key === undefined || hasOwn.call( obj, key );
    };
    var unify = function() { // only deep copy
        var argv = Array.prototype.slice.call( arguments ),
            i = 1,
            length = argv.length,
            target = argv[ 0 ],
            fixture,
            name,
            src,
            dst,
            clone;

        if ( typeof target !== 'object' && !isFunction( target ) ) {
            target = {};
        }

        while ( i < length ) {
            if ( ( fixture = argv[ i ] ) ) {
                for ( name in fixture ) {
                    src = target[ name ];
                    dst = fixture[ name ];

                    if ( target === dst ) {
                        continue;
                    }

                    if ( isPlainObject( dst ) || isArray( dst ) ) {
                        if ( isArray( dst ) ) {
                            clone = src && isArray( src ) ? src : [];
                        } else {
                            clone = src && isPlainObject( src ) ? src : {};
                        }

                        target[ name ] = arguments.callee( clone, dst );
                    } else if ( dst !== undefined ) {
                        target[ name ] = dst;
                    }
                }
            }
            i++;
        }

        return target;
    };

    // NAME SPACE
    var nameSpaceCache = {};
    var nameSpaceREGEXP = /^[a-zA-Z]{1}[a-zA-Z0-9]*(\.{1}[a-zA-Z]{1}[a-zA-Z0-9]*)*$/;
    var isValidNameSpaceFormat = function( name ) {
        return nameSpaceREGEXP.test( name );
    };

    // NAME SPACE @ CACHE
    var isExistNameSpaceInCache = function( name ) {
        return !isUndefined( nameSpaceCache[ name ] );
    };
    var setNameSpaceInCache = function( name, obj ) {
        if ( !isValidNameSpaceFormat( name ) ) {
            throw new Error( 'invalid namespace format @ ' + name );
        } else if ( isExistNameSpaceInCache( name ) ) {
            throw new Error( 'namespace are exist @ ' + name );
        } else {
            return ( nameSpaceCache[ name ] = obj );
        }
    };
    var getNameSpaceInCache = function( name ) {
        if ( !isValidNameSpaceFormat( name ) ) {
            throw new Error( 'invalid namespace format @ ' + name );
        } else if ( isExistNameSpaceInCache( name ) ) {
            throw new Error( 'namespace not exist @ ' + name );
        } else {
            return nameSpaceCache[ name ];
        }
    };

    var setNameSpace = function( name, obj ) {
        return setNameSpaceInCache( name, obj );
    };
    var getNameSpace = function( name ) {
        return getNameSpaceInCache( name );
    };

    // CLASS INHERITANCE
    var classConstructorName = "init",
        classPackageDefinitionKey = "$package",
        emptyFunction = function() {},
        classDefinitionStore = {};
    var classPackageREGEXP = /^[a-zA-Z]{1}[a-zA-Z0-9]*(\.{1}[a-zA-Z]{1}[a-zA-Z0-9]*)*$/;
    var isValidClassPackageFormat = function( name ) {
        return classPackageREGEXP.test( name );
    };
    var isExistClassPackage = function( packageName ) {
        return !isUndefined( classDefinitionStore[ classPackage ] )
    };
    var setClassPackage = function( packageName, obj ) {
        if ( !isValidClassPackageFormat( packageName ) ) {
            throw new Error( 'invalid class package name format @ ' + packageName );
        } else if ( isExistClassPackage( packageName ) ) {
            throw new Error( 'class package are exist @ ' + packageName );
        } else {
            return ( classDefinitionStore[ packageName ] = obj );
        }
    };
    var getClassPackage = function( packageName ) {
        if ( !isValidClassPackageFormat( packageName ) ) {
            throw new Error( 'invalid class package name format @ ' + packageName );
        } else if ( isExistClassPackage( packageName ) ) {
            throw new Error( 'class package not exist @ ' + packageName );
        } else {
            return classDefinitionStore[ packageName ];
        }
    };
    var classDefine = function( parent, prop ) {
        if ( arguments.length < 2 ) {
            prop = parent;
            parent = {};
        }
        parent = parent || {};

        var $properties = {},
            $methods = {};

        each( prop, function( key, value ) {
            if ( prop.hasOwnProperty( key ) ) {
                if ( isFunction( value ) ) {
                    $methods[ key ] = value;
                } else {
                    $properties[ key ] = value;
                }
            }
        } );

        var child = function() {
            ( function( self ) {
                unify( self, ( child.prototype && child.prototype.$properties ) || {} );

                if ( child.prototype.hasOwnProperty( classConstructorName ) ) {
                    child.prototype.init.apply( self, arguments );
                } else if ( child.prototype.$super && child.prototype.$super.hasOwnProperty( classConstructorName ) ) {
                    child.prototype.$super.init.apply( self, arguments );
                }
            } )( this );
        };
        var Class = function() { /* ANONYMOUS FUNCTION */ };

        child.prototype = new Class();
        unify( child.prototype, ( ( parent.prototype && parent.prototype.$methods ) || {} ), $methods );

        child.prototype.$properties = unify( {}, ( ( parent.prototype && parent.prototype.$properties ) || {} ), $properties );
        child.prototype.$methods = unify( {}, ( ( parent.prototype && parent.prototype.$methods ) || {} ), $methods );
        child.prototype.$super = ( parent.prototype && parent.prototype.$methods ) || {};

        child.prototype.constructor = child;
        return child;
    };
    var classExtend = function() {
        //
    };
    var getClassMethod = function( classPackageName, classMethodName ) {
        //
    };
    var createClassInstance = function( namespace ) {
        //
    };

    var QbigEngine = {
        "each" : each,
        "util" : {
            "type" : {
                "isInstanceOf" : isInstanceOf,
                "isTypeOf" : isTypeOf,
                "isFunction" : isFunction,
                "isObject" : isObject,
                "isArray" : isArray,
                "isBool" : isBool,
                "isNumber" : isNumber,
                "isString" : isString,
                "isNull" : isNull,
                "isUndefined" : isUndefined,
                "isNumeric" : isNumeric,
                "isPlainObject" : isPlainObject
            },
            "unify" : unify,
            "each" : each
        },
        "ns" : {
            "isValidFormat" : isValidNameSpaceFormat,
            "isExist" : isExistNameSpaceInCache,
            "set" : setNameSpace,
            "get" : getNameSpace
        },
        "class" : {
            "define" : classDefine,
            "extend" : classExtend,
            "getMethod" : getClassMethod,
            "create" : createClassInstance
        }
    };
    global.qbe = QbigEngine;
} )();