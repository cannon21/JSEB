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
        isNumeric = function( target ) { return !isNaN( parseFloat( target ) ) && isFinite( target ); },
        isPlainObject = function( obj ) {
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

    var unify = function() {
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
        }
        nameSpaceCache[ name ] = obj;
        return name;
    };
    var getNameSpaceInCache = function( name ) {
        if ( !isValidNameSpaceFormat( name ) ) {
            throw new Error( 'invalid namespace format @ ' + name );
        } else if ( isExistNameSpaceInCache( name ) ) {
            throw new Error( 'namespace not exist @ ' + name );
        }
        return nameSpaceCache[ name ];
    };

    var setNameSpace = function( name, obj ) {
        return setNameSpaceInCache( name, obj );
    };
    var getNameSpace = function( name ) {
        return getNameSpaceInCache( name );
    };

    // CLASS INHERITANCE
    var classConstructorName = "init",
        classDefinitionStore = {},
        classPackageREGEXP = /^[a-zA-Z]{1}[a-zA-Z0-9]*(\.{1}[a-zA-Z]{1}[a-zA-Z0-9]*)*(\/{1}[a-zA-Z]{1}[a-zA-Z0-9]*)*$/;
    var isValidClassPackageFormat = function( name ) {
        return classPackageREGEXP.test( name );
    };
    var isExistClassPackage = function( packageName ) {
        return !isUndefined( classDefinitionStore[ packageName ] )
    };
    var setClassDefinition = function( packageName, obj ) {
        if ( !isValidClassPackageFormat( packageName ) ) {
            throw new Error( 'invalid class package name format @ ' + packageName );
        } else if ( isExistClassPackage( packageName ) ) {
            throw new Error( 'class package are exist @ ' + packageName );
        }
        classDefinitionStore[ packageName ] = obj;
        return packageName;
    };
    var getClassDefinition = function( packageName ) {
        if ( !isValidClassPackageFormat( packageName ) ) {
            throw new Error( 'invalid class package name format @ ' + packageName );
        } else if ( !isExistClassPackage( packageName ) ) {
            throw new Error( 'class package not exist @ ' + packageName );
        }
        return classDefinitionStore[ packageName ];
    };
    var makeClass = function( classPackageName, parentsPackageNameArr, classDefinition ) {
        var definitionObj = {
            "$properties" : {},
            "$methods" : {},
            "$constructor" : false,
            "$class" : false
        };

        if ( isArray( parentsPackageNameArr ) ) {
            each( parentsPackageNameArr, function( idx, parentsPackageName ) {
                var classDefinition = getClassDefinition( parentsPackageName );
                unify( definitionObj.$properties, classDefinition.$properties );
                unify( definitionObj.$methods, classDefinition.$methods );
            } );
        }

        each( classDefinition, function( key, value ) {
            if ( classDefinition.hasOwnProperty( key ) ) {
                if ( isFunction( value ) ) {
                    if ( key === classConstructorName ) {
                        definitionObj.$constructor = value;
                    } else {
                        definitionObj.$methods[ key ] = value;
                    }
                } else {
                    definitionObj.$properties[ key ] = value;
                }
            }
        } );

        var child = function() {
            var argv = Array.prototype.slice.call( arguments );
            ( function( self, argv ) {
                unify( self, definitionObj.$properties );
                if ( isFunction( definitionObj.$constructor ) ) {
                    definitionObj.$constructor.apply( self, argv );
                }
            } )( this, argv );
        };
        var Class = function() { /* ANONYMOUS FUNCTION */ };

        child.prototype = new Class();
        unify( child.prototype, definitionObj.$methods );
        child.prototype.constructor = child;

        definitionObj.$class = child;
        setClassDefinition( classPackageName, definitionObj );
        return classPackageName;
    };
    var defineClass = function( classDefinition ) {
        var classPackageName = false,
            parentsPackageNameArr = false;

        if ( isUndefined( classDefinition.$package ) || !isString( classDefinition.$package ) ) {
            throw new Error( 'class package name must be string' );
        }
        classPackageName = classDefinition.$package;
        delete classDefinition.$package;

        if ( isArray( classDefinition.$parents ) ) {
            var is_valid = true;
            each( classDefinition.$parents, function( idx, parentsPackageName ) {
                if ( !isString( parentsPackageName ) ) {
                    is_valid = false;
                    return false;
                }
            } );
            if ( !is_valid ) {
                throw new Error( 'parent class package name must be string' );
            }
            parentsPackageNameArr = classDefinition.$parents;
            delete classDefinition.$parents;
        } else if ( !isUndefined( classDefinition.$parents ) ) {
            throw new Error( 'parent class package name must be array passed' );
        }

        return makeClass( classPackageName, parentsPackageNameArr, classDefinition );
    };
    var applyClassMethod = function( classPackageName, classMethodName, argumentsArr ) {
        var classDefinition = getClassDefinition( classPackageName ),
            method = classDefinition.$methods[ classMethodName ];
        if ( !isFunction( method ) ) {
            throw new Error( 'not exist method in class definition @ ' + classPackageName );
        }
        return method.apply( arguments.caller, argumentsArr );
    };
    var createClassInstance = function( classPackageName ) {
        return new ( getClassDefinition( classPackageName ).$class );
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
            "define" : defineClass,
            "applyMethod" : applyClassMethod,
            "create" : createClassInstance
        }
    };
    global.qbe = QbigEngine;
} )();