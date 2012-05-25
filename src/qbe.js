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
        classBlueprintStore = {},
        classPackageREGEXP = /^[a-zA-Z]{1}[a-zA-Z0-9]*(\.{1}[a-zA-Z]{1}[a-zA-Z0-9]*)*$/;
    var Class = function() { /* ANONYMOUS FUNCTION */ },
        isClass = function( obj ) { return obj instanceof Class; };
    var isValidClassPackageFormat = function( name ) {
        return classPackageREGEXP.test( name );
    };
    var isExistClassPackage = function( packageName ) {
        return !isUndefined( classBlueprintStore[ packageName ] )
    };
    var setClassBlueprint = function( packageName, obj ) {
        if ( !isValidClassPackageFormat( packageName ) ) {
            throw new Error( 'invalid class package name format @ ' + packageName );
        } else if ( isExistClassPackage( packageName ) ) {
            throw new Error( 'class package are exist @ ' + packageName );
        }
        classBlueprintStore[ packageName ] = obj;
        return packageName;
    };
    var getClassBlueprint = function( packageName ) {
        if ( !isValidClassPackageFormat( packageName ) ) {
            throw new Error( 'invalid class package name format @ ' + packageName );
        } else if ( !isExistClassPackage( packageName ) ) {
            throw new Error( 'class package not exist @ ' + packageName );
        }
        return classBlueprintStore[ packageName ];
    };
    var makeClassBlueprint = function( classPackageName, parentsPackageNameArr, classBlueprint ) {
        var blueprint = {
            "$properties" : {},
            "$classes" : {},
            "$methods" : {}
        };

        if ( isArray( parentsPackageNameArr ) ) {
            each( parentsPackageNameArr, function( idx, parentsPackageName ) {
                var classBlueprint = getClassBlueprint( parentsPackageName );
                unify( blueprint.$properties, classBlueprint.$properties );
                unify( blueprint.$classes, classBlueprint.$classes );
                unify( blueprint.$methods, classBlueprint.$methods );
            } );
        }

        each( classBlueprint, function( key, value ) {
            if ( classBlueprint.hasOwnProperty( key ) ) {
                if ( isFunction( value ) ) {
                    blueprint.$methods[ key ] = value;
                } else if ( isClass( value ) ) {
                    blueprint.$classes[ key ] = value;
                } else {
                    blueprint.$properties[ key ] = value;
                }
            }
        } );

        setClassBlueprint( classPackageName, blueprint );
        return classPackageName;
    };
    var makeClassInstance = function( classPackageName ) {
        var blueprint = getClassBlueprint( classPackageName );
        
        var child = function() {
            ( function( self ) {
                unify( self, blueprint.$properties );
                each( blueprint.$classes, function( key, blueprintTag ) {
                    if ( isClassBlueprint( blueprintTag ) ) {
                        self[ key ] = blueprintTag.get();
                    }
                } );
            } )( this );
        };

        child.prototype = new Class();
        unify( child.prototype, blueprint.$methods );
        child.prototype.constructor = child;
        child.prototype.$package = classPackageName;

        return child;
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

        return makeClassBlueprint( classPackageName, parentsPackageNameArr, classDefinition );
    };
    var applyClassMethod = function( instance, classPackageName, classMethodName, argumentsArr ) {
        var classDefinition = getClassBlueprint( classPackageName ),
            method = classDefinition.$methods[ classMethodName ];
        if ( !isFunction( method ) ) {
            throw new Error( 'not exist method in class definition @ ' + classPackageName );
        }
        return method.apply( instance, argumentsArr );
    };
    var createClassInstance = function( classPackageName, constructorArgv ) {
        var blueprint = getClassBlueprint( classPackageName ),
            instantce = new ( makeClassInstance( classPackageName ) );
        constructorArgv = isArray( constructorArgv ) ? constructorArgv : [];
        if ( isFunction( blueprint.$methods[ classConstructorName ] ) ) {
            applyClassMethod( instantce, classPackageName, classConstructorName, constructorArgv );
        }
        return instantce;
    };
    var blueprintTag = function( classPackageName, constructorArgv ) {
        this.packagename = classPackageName;
        this.constructorArgv = constructorArgv;
        this.get = function( ) {
            return createClassInstance( this.classPackageName, this.constructorArgv );
        };
    };
    var isClassBlueprint = function( obj ) {
        return obj instanceof blueprintTag;
    };
    var makeBlueprintTag = function( classPackageName, constructorArgv ) {
        return new blueprintTag( classPackageName, constructorArgv );
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
                "isPlainObject" : isPlainObject,
                "isClass" : isClass
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
            "create" : createClassInstance,
            "tagging" : makeBlueprintTag
        }
    };
    global.qbe = QbigEngine;
} )();