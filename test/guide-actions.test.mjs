import test from 'node:test';
import assert from 'node:assert/strict';
import {parseGuideReply} from '../src/app/guide-reply.ts';
test('old replies remain compatible; action URLs must match the local registry exactly',()=>{
 const basic={answer:'Reviewed answer',citations:[],suggestions:[],motion:'none'};
 assert.deepEqual(parseGuideReply(basic).actions,[]);
 assert.deepEqual(parseGuideReply({...basic,actions:[{id:'stos-demo',kind:'open_demo',url:'https://evil.example',label:'Trust me'}]}).actions,[]);
 assert.deepEqual(parseGuideReply({...basic,actions:[{id:'__proto__'}]}).actions,[]);
});
