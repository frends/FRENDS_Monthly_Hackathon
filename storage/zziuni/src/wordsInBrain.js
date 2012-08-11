/**
 * Created by JetBrains WebStorm.
 * User: luigi.byun(@zziuni)
 * Date: 12. 8. 8.
 * Time: 오후 7:12
 */

var wib = function( specifiedOpt ){

    var webDb = {},
        defaultOpt = {
            type: 'sql'
        };
    var option = {};
    option = (specifiedOpt) ? specifiedOpt : defaultOpt;

    var outputMessage = function( tx, e ){
        console.error( 'Error : ' + e.message );
    };

    var indexedWebDb = {
        openDb: function(){},
        createScheme: function(){}
    };

    var sqlWebDb = {
        openDb: function(){
            var dbName = 'wordInBrain',
                dbVersion = '0.1',
                dbDescript = '...',
                dbSize = 10 * 1024 * 1025;
            this.db = openDatabase( dbName, dbVersion, dbDescript, dbSize );
        },
        createScheme: function(){
            var db = this.db;
            var scheme = {
                keyword: 'Create Table if not exists keyword (ID INTEGER PRIMARY KEY ASC, keyword text , createDate datetime)',
                report: 'Create Table if not exists report ( keyword text, count intiger )',
                dropKeyword: 'Drop table keyword',
                dropReport: 'Drop table report'
            };
            if( !db ){ return false; }
            db.transaction( function( tx ){
                if( option.resetDb ){
                    tx.executeSql( scheme.dropKeyword, [] );
                    tx.executeSql( scheme.dropReport, [] );
                    dom.addMessage( ' DB Tables reset;' )
                }
                tx.executeSql( scheme.keyword, [] );
                tx.executeSql( scheme.report, [] );
            } )
        },

        sql: {
            insertKeyword: 'Insert into keyword (keyword, createDate) values (?,?)',
            insertReport: 'Insert into report (keyword, count) values (?,?)',
            insertcomputedKeyword: 'Insert into report Select keyword, count(keyword) from keyword group by keyword',
            selectKeywordByAsc: 'Select keyword, createDate from keyword order by ? asc',
            selectKeywordByDesc: 'Select keyword, createDate from keyword order by ? desc',
            selectReportByAsc: 'Select keyword, count from report order by ? asc',
            selectReportByDesc: 'Select keyword, count from report order by ? desc',
            deleteAllKeyword: 'Delete from keyword',
            deleteAllReport: 'Delete from report'
        },
        insertKeyword: function( data, successFn ){
            data.push( new Date() );
            this.executeSql( webDb.sql.insertKeyword, data, successFn );
        },
        insertReport: function( data, successFn ){
            this.executeSql( webDb.sql.insertReport, data, successFn );
        },
        deleteAllKeyword: function(){
            this.executeSql( webDb.sql.deleteAllKeyword, [], function(){} );
        },
        deleteAllReport: function(){
            this.executeSql( webDb.sql.deleteAllReport, [], function(){} );
        },
        selectKeywords: function( callback ){
            this.executeSql( webDb.sql.selectKeywordByAsc, ['keyword'], callback );
        },
        selectReport: function( callback ){
            this.executeSql( webDb.sql.selectReportByAsc, ['keyword'], callback );
        },
        insertComputedKeyword: function( callback ){
//            this.executeSql( webDb.sql.insertcomputedKeyword, [], callback )
            var db = this.db;
            var successFn = (callback) ? callback : function(){};
            db.transaction( function( tx ){
                tx.executeSql( webDb.sql.deleteAllReport, [], successFn, outputMessage );
                tx.executeSql( webDb.sql.insertcomputedKeyword, [], successFn, outputMessage );
            } )
        },
        executeSql: function( sqlString, data, callback ){
            var db = this.db;
            var successFn = (callback) ? callback : function(){};
            db.transaction( function( tx ){
                console.log( 'sql : ' + sqlString );
                tx.executeSql( sqlString, data, successFn, outputMessage );
            } )
        }
    };

    if( option.type=='sql' ){
        webDb = sqlWebDb;
    }else if( option.type=='indexedDb' ){
        webDb = indexedWebDb;
    }else{
        //sql default.
        webDb = sqlWebDb;
    }

    var inputBtn = document.getElementById( 'submitBtn' );
    var deleteBtn = document.getElementById( 'deleteBtn' );
    var text = document.getElementById( 'inputKeyword' );

    var dom = {
        addKeywordEvent: function( evt ){
            var input = document.getElementById( 'inputKeyword' );
            var value = input.value;
            if( !value ){return;}
            var dom = wib.dom;
            var webDb = wib.webDb;
            if( evt.type=='click' || evt.keyIdentifier=='Enter' ){
                var input = document.getElementById( 'inputKeyword' );
                var value = input.value;
                webDb.insertKeyword( [value], dom.callbackInsertKeyword );
                wib.dom.addMessage( 'insert "' + value + '"' );
                input.value = '';
            }
        },
        deleteAllEvent: function(){
            wib.webDb.deleteAllKeyword();
            wib.webDb.deleteAllReport();
            wib.dom.renderResult();
            wib.dom.addMessage( 'Delete keywords and report ' );
        },
        addMessage: function( message ){
//            console.log( message );
            var msgContainer = document.getElementById( 'msg' );
            msgContainer.innerHTML = message;

        },
        callbackInsertKeyword: function(){
            var webDb = wib.webDb;
            var dom = wib.dom;
            webDb.insertComputedKeyword( dom.renderResult );
        },
        renderResult: function(){
            var dom = wib.dom;
            dom.renderKeywords();
            dom.renderReport();
        },
        renderKeywords: function(){
//            console.log( ' call renderKeywords' );
            var webDb = wib.webDb;
            var dom = wib.dom;
            var callback = function( tx, rs ){
//                console.log( 'call select callback' );
                var result = '';
                for( var i = 0; i<rs.rows.length; i++ ){
                    var row = dom.renderKeywordForList( rs.rows.item( i ) );
                    result = row + result;
                }

//                var container = document.getElementById( 'keywords' );
                var container = document.querySelectorAll( '.result #keywords .data' )[0];
                container.innerHTML = result;
            };
            webDb.selectKeywords( callback );
        },
        renderKeywordForList: function( row ){
            return row.keyword + ', ';
        },
        renderKeywordForReport: function( row ){
            return '<span style="font-size:' + ( row.count + 12) + 'px;">' + row.keyword + ' (' + row.count + ')</span>, ';
        },
        renderReport: function(){
            var webDb = wib.webDb;
            var dom = wib.dom;
            var callback = function( tx, rs ){
//                console.log( 'call select callback' );
                var result = '';
                for( var i = 0; i<rs.rows.length; i++ ){
                    var row = dom.renderKeywordForReport( rs.rows.item( i ) );
                    result += row;
                }

//                var container = document.getElementById( 'report' );
                var container = document.querySelectorAll( '.result #report .data' )[0];
                container.innerHTML = result;
            };
            webDb.selectReport( callback );
        }
    };

    inputBtn.addEventListener( 'click', dom.addKeywordEvent );
    deleteBtn.addEventListener( 'click', dom.deleteAllEvent );
    text.addEventListener( 'keydown', dom.addKeywordEvent );

    return {
        webDb: webDb,
        dom: dom,
        init: function(){
            webDb.openDb();
            webDb.createScheme();
            dom.renderResult();
        }
    };
}( {type: 'sql', resetDb: false} );

wib.init();
//wib.webDb.insertReport( ['zziuni', 1], function(){} );



