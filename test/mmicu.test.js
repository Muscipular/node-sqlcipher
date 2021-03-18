var sqlite3 = require('..');
var assert = require('assert');

function r(ins, fn, ...args) {
    return new Promise((resolve, reject) => {
        fn.call(ins, ...args, (e, b) => {
            !e ? resolve(b) : reject(e);
        });
    })
}

describe('wcicu', function () {
    var db;
    before(function (done) {
        db = new sqlite3.Database(':memory:', done);
    });

    it('should match', async function () {
        await r(db, db.run, `CREATE VIRTUAL TABLE t1 USING fts5(a, tokenize='wcicu zh_CN');`);
        for (const data of datas) {
            await r(db, db.run, `insert into t1 (a) values (?)`, [data]);
        }

        async function check(s, has, log = false) {
            let res = await r(db, db.all, `select a from t1 where a MATCH ?`, [s]);
            log && console.log(res);
            if (!res) {
                throw 'error: res is null';
            }
            if (has ? res.length <= 0 : res.length > 0) {
                throw `error: res should ${has ? '' : 'not '} has result`;
            }
        }

        // await check('1', true, true);
        // await check('断网', true);
        // await check('邀请', true);
        // await check('载不能取消', true);
        // await check('消息多端同步', true);
        // await check('messages', true);
        // await check('v2 messages delMsg', true, true);
        // await check('12*', false, true);
    });
});


const datas = [
];
