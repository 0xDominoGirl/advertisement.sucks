import test from 'node:test';
import assert from 'node:assert/strict';
import {RenderQueue} from '../lib/render-queue.js';

test('visible pack gets priority, obsolete work never starts, jobs do not overlap',async()=>{
  const queue=new RenderQueue(),order=[];let active=0,peak=0,current=true;
  const task=name=>async()=>{active++;peak=Math.max(peak,active);order.push(name);await new Promise(r=>setTimeout(r,2));active--;return name;};
  const strip=queue.run(task('strip'),{priority:()=>2});
  const stale=queue.run(task('stale'),{isCurrent:()=>current});
  const rejected=assert.rejects(stale,{name:'AbortError'});
  const main=queue.run(task('main'),{priority:()=>0});current=false;
  assert.deepEqual(await Promise.all([main,strip]),['main','strip']);await rejected;
  assert.equal(peak,1);assert.deepEqual(order,['main','strip']);
});

test('a failed or replaced render does not stop later work',async()=>{
  const queue=new RenderQueue();
  const broken=queue.run(()=>{throw new Error('bad artwork');});
  const rejected=assert.rejects(broken,/bad artwork/);
  assert.equal(await queue.run(()=>42),42);await rejected;
  assert.equal(await queue.run(()=>43),43);
});
