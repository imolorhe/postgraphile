/* tslint:disable no-any */
"use strict";
var sql_1 = require("../sql");
test('raw will create a raw Sql item', function () {
    var text = 'abcdefg\'hijk-lmn"op';
    expect(sql_1.default.raw(text)).toEqual({ type: 'RAW', text: text });
});
test('identifier will create an identifier Sql item', function () {
    var name = 'abcdefg\'hijk-lmn"op';
    expect(sql_1.default.identifier(name)).toEqual({ type: 'IDENTIFIER', names: [name] });
});
test('identifier will create an identifier Sql item with multiple names', function () {
    var name1 = 'name1';
    var name2 = 'name2';
    var name3 = 'name3';
    expect(sql_1.default.identifier(name1, name2, name3)).toEqual({ type: 'IDENTIFIER', names: [name1, name2, name3] });
});
test('value will create an eager Sql value', function () {
    var value = Symbol('value');
    expect(sql_1.default.value(value)).toEqual({ type: 'VALUE', value: value });
});
test('join will flatten singly nested arrays', function () {
    var item1 = Symbol('item1');
    var item2 = Symbol('item2');
    var item3 = Symbol('item3');
    var item4 = Symbol('item4');
    var item5 = Symbol('item5');
    expect(sql_1.default.join([item1, [item2, item3], item4, [item5]])).toEqual([item1, item2, item3, item4, item5]);
});
test('join will add raw Sql seperators if supplied a string', function () {
    var seperator = Symbol('seperator');
    var item1 = Symbol('item1');
    var item2 = Symbol('item2');
    var item3 = Symbol('item3');
    expect(sql_1.default.join([item1, item2, item3], seperator))
        .toEqual([item1, sql_1.default.raw(seperator), item2, sql_1.default.raw(seperator), item3]);
});
test('join will not add raw Sql seperators between nested arrays', function () {
    var seperator = Symbol('seperator');
    var item1 = Symbol('item1');
    var item2 = Symbol('item2');
    var item3 = Symbol('item3');
    var item4 = Symbol('item4');
    var item5 = Symbol('item5');
    expect(sql_1.default.join([item1, [item2, item3], item4, [item5]], seperator))
        .toEqual([item1, sql_1.default.raw(seperator), item2, item3, sql_1.default.raw(seperator), item4, sql_1.default.raw(seperator), item5]);
});
test('query will output raw strings', function () {
    expect((_a = ["hello world"], _a.raw = ["hello world"], sql_1.default.query(_a))).toEqual([sql_1.default.raw('hello world')]);
    var _a;
});
test('query will add items to the Sql', function () {
    var item1 = Symbol('item1');
    var item2 = Symbol('item2');
    var item3 = Symbol('item3');
    expect((_a = ["hello ", "", " world ", ""], _a.raw = ["hello ", "", " world ", ""], sql_1.default.query(_a, item1, item2, item3)))
        .toEqual([sql_1.default.raw('hello '), item1, sql_1.default.raw(''), item2, sql_1.default.raw(' world '), item3, sql_1.default.raw('')]);
    var _a;
});
test('query will flatten arrays of items', function () {
    var item1 = Symbol('item1');
    var item2 = Symbol('item2');
    var item3 = Symbol('item3');
    expect((_a = ["", ""], _a.raw = ["", ""], sql_1.default.query(_a, [item1, item2, item3]))).toEqual([sql_1.default.raw(''), item1, item2, item3, sql_1.default.raw('')]);
    var _a;
});
test('compile will return an empty config for no items', function () {
    expect(sql_1.default.compile([])).toEqual({
        text: '',
        values: [],
    });
});
test('compile will turn a raw text only query into a simple config', function () {
    expect(sql_1.default.compile([sql_1.default.raw('hello world')])).toEqual({
        text: 'hello world',
        values: [],
    });
});
test('compile will add raw queries together', function () {
    expect(sql_1.default.compile([sql_1.default.raw('hello'), sql_1.default.raw(' '), sql_1.default.raw('world')])).toEqual({
        text: 'hello world',
        values: [],
    });
});
test('compile will add identifiers as text strings', function () {
    expect(sql_1.default.compile([sql_1.default.identifier('hello')])).toEqual({
        text: '"hello"',
        values: [],
    });
    expect(sql_1.default.compile([sql_1.default.identifier('a', 'b', 'c')])).toEqual({
        text: '"a"."b"."c"',
        values: [],
    });
});
test('compile will remove double quotes in identifiers', function () {
    expect(sql_1.default.compile([sql_1.default.identifier('yo"yo')])).toEqual({
        text: '"yo""yo"',
        values: [],
    });
});
test('compile will throw an error when identifiers are an empty array', function () {
    expect(function () { return sql_1.default.compile([sql_1.default.identifier()]); }).toThrow();
});
test('compile will add identifiers to raw queries', function () {
    expect(sql_1.default.compile([sql_1.default.raw('hello '), sql_1.default.identifier('a', 'b', 'c'), sql_1.default.raw(' world')])).toEqual({
        text: 'hello "a"."b"."c" world',
        values: [],
    });
});
test('compile will add value parameters for eager values', function () {
    var value = Symbol('value');
    expect(sql_1.default.compile([sql_1.default.value(value)])).toEqual({
        text: '$1',
        values: [value],
    });
});
test('compile will add multiple value parameters for eager values', function () {
    var value1 = Symbol('value1');
    var value2 = Symbol('value2');
    var value3 = Symbol('value3');
    var value4 = Symbol('value4');
    expect(sql_1.default.compile([sql_1.default.value(value1), sql_1.default.value(value2), sql_1.default.raw(' '), sql_1.default.value(value3), sql_1.default.raw(' '), sql_1.default.value(value4)])).toEqual({
        text: '$1$2 $3 $4',
        values: [value1, value2, value3, value4],
    });
});
test('compile will create local identifiers for symbols', function () {
    var a = Symbol();
    var b = Symbol();
    expect(sql_1.default.compile([sql_1.default.identifier(a), sql_1.default.raw(' '), sql_1.default.identifier(a, 'hello', b), sql_1.default.raw(' '), sql_1.default.identifier(b), sql_1.default.raw(' '), sql_1.default.identifier(a)])).toEqual({
        text: '__local_0__ __local_0__."hello".__local_1__ __local_1__ __local_0__',
        values: [],
    });
});
test('integration test 1', function () {
    expect(sql_1.default.compile((_a = ["hello ", " world, ", " and ", ""], _a.raw = ["hello ", " world, ", " and ", ""], sql_1.default.query(_a, sql_1.default.value(42), sql_1.default.value('cowabunga'), (_b = ["wow ", ""], _b.raw = ["wow ", ""], sql_1.default.query(_b, sql_1.default.identifier('yo'))))))).toEqual({
        name: undefined,
        text: 'hello $1 world, $2 and wow "yo"',
        values: [42, 'cowabunga'],
    });
    var _a, _b;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvdXRpbHMvX190ZXN0c19fL3NxbC10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDJCQUEyQjs7QUFFM0IsOEJBQXdCO0FBRXhCLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRTtJQUNyQyxJQUFNLElBQUksR0FBRyxzQkFBc0IsQ0FBQTtJQUNuQyxNQUFNLENBQUMsYUFBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxNQUFBLEVBQUUsQ0FBQyxDQUFBO0FBQ3RELENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLCtDQUErQyxFQUFFO0lBQ3BELElBQU0sSUFBSSxHQUFHLHNCQUFzQixDQUFBO0lBQ25DLE1BQU0sQ0FBQyxhQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDN0UsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsbUVBQW1FLEVBQUU7SUFDeEUsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFBO0lBQ3JCLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQTtJQUNyQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUE7SUFDckIsTUFBTSxDQUFDLGFBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDM0csQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENB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