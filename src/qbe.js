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

    // NAME SPACE
    var nameSpaceCache = {};
    var NameSpaceREGEXP = /^[a-zA-Z]{1}[a-zA-Z0-9]*(\.{1}[a-zA-Z]{1}[a-zA-Z0-9]*)*$/;
    var isValidNameSpaceFormat = function( name ) {
        return NameSpaceREGEXP.test( name );
    };
    var parseNameSpace = function( name ) {
        if ( !isString( name ) ) {
            throw new Error( 'namespace must be string.' );
        } else if ( !isValidNameSpaceFormat( name ) ) {
            throw new Error( 'illegal namespace format' );
        }
        return name.split( '.' );
    };

    // NAME SPACE @ CACHE
    var isExistNameSpaceInCache = function( name ) {
        return !isUndefined( nameSpaceCache[ name ] );
    };
    var setNameSpaceInCache = function( name, obj ) {
        if ( isValidNameSpaceFormat( name ) )
            return ( nameSpaceCache[ name ] = obj );
        else
            return false;
    };
    var getNameSpaceInCache = function( name ) {
        if ( isValidNameSpaceFormat( name ) && isExistNameSpaceInCache( name ) ) {
            return nameSpaceCache[ name ];
        } else {
            throw new Error( 'not exist namespace at cache' );
        }
    };

    var setNameSpace = function( name, obj ) {
        return setNameSpaceInCache( name, obj );
    };
    var getNameSpace = function( name ) {
        if ( isExistNameSpaceInCache( name ) ) {
            return getNameSpaceInCache( name );
        } else {
            throw new Error( name + ' is not exist in namespace cache' )
        }
    };

    // CLASS INHERITANCE
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
    var classConstructorName = "init",
        emptyFunction = function() {},
        classDefinitionStore = {};
    var extend = function( parent, prop ) {
        if ( arguments.length < 2 ) {
            prop = parent;
            parent = {};
        }
        parent = parent || {};

        var fpMap = {}; // field @ property
        var fmMap = {}; // field @ method

        each( prop, function( key, value ) {
            if ( prop.hasOwnProperty( key ) ) {
                if ( isFunction( value ) ) {
                    fmMap[ key ] = value;
                } else {
                    fpMap[ key ] = value;
                }
            }
        } );

        var child = function() {
            ( function( self ) {
                unify( self, ( child.prototype && child.prototype.$fpMap ) || {} );

                if ( child.prototype.hasOwnProperty( classConstructorName ) ) {
                    child.prototype.init.apply( self, arguments );
                } else if ( child.prototype.$super && child.prototype.$super.hasOwnProperty( classConstructorName ) ) {
                    child.prototype.$super.init.apply( self, arguments );
                }
            } )( this );
        };
        var Class = function() { /* ANONYMOUS FUNCTION */ };
        // Class.prototype = unify( {}, ( parent.prototype || {} ));

        child.prototype = new Class();
        unify( child.prototype, ( ( parent.prototype && parent.prototype.$fmMap ) || {} ), fmMap );

        child.prototype.$fpMap = unify( {}, ( ( parent.prototype && parent.prototype.$fpMap ) || {} ), fpMap );
        child.prototype.$fmMap = unify( {}, ( ( parent.prototype && parent.prototype.$fmMap ) || {} ), fmMap );
        child.prototype.$super = ( parent.prototype && parent.prototype.$fmMap ) || {};

        child.prototype.constructor = child;
        return child;
    };
    var classDefine = function() {

    };

    var QbigEngine = {
        "each" : each,
        "ns" : {
            "isValidFormat" : isValidNameSpaceFormat,
            "isExist" : isExistNameSpaceInCache,
            "set" : setNameSpace,
            "get" : getNameSpace
        },
        "class" : {
            "define" : classDefine,
            "extend" : extend
        }
    };
    global.qbe = QbigEngine;
} )();