/* Enhance the existing, accessible resume dialog without touching the intro. */
(()=>{'use strict';
 const layer=document.querySelector('.resume-overlay');if(!layer)return;
 const agents=[...layer.querySelectorAll('.resume-agent')];
 agents.slice(2).forEach(a=>a.remove());
 const [editor,layout]=agents; if(!editor||!layout)return;
 editor.classList.add('resume-editor');layout.classList.add('resume-layout');
 editor.querySelector('span').textContent='editor';layout.querySelector('span').textContent='layout';
 const shapes={
  pointer:'<path d="M2 1v17l4.2-4 3.3 7 3-1.4-3.4-7H16z" fill="currentColor" stroke="#161616" stroke-width="1.2"/>',
  text:'<path d="M5 2h10M10 2v18M5 20h10" fill="none" stroke="#161616" stroke-width="4" stroke-linecap="round"/><path d="M5 2h10M10 2v18M5 20h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  grab:'<path d="M5 11V5a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v6c0 4-2 7-6 7H9c-2 0-3-1-4-3L2 13c-.8-1.4 1-2.8 2-1.6z" fill="currentColor" stroke="#161616" stroke-width="1.2"/>'
 };
 function mode(agent,name){agent.dataset.mode=name;agent.querySelector('svg').innerHTML=shapes[name]}
 let timers=[];function reset(){timers.forEach(clearTimeout);timers=[];mode(editor,'pointer');mode(layout,'pointer')}
 function at(ms,agent,name){timers.push(setTimeout(()=>mode(agent,name),ms))}
 function run(){reset();[[1580,'text'],[2850,'pointer'],[4000,'text'],[4850,'pointer'],[5100,'text'],[5850,'pointer'],[6150,'text'],[7200,'pointer'],[7350,'text'],[8100,'pointer']].forEach(([t,m])=>at(t,editor,m));at(3000,layout,'grab');at(3750,layout,'pointer')}
 new MutationObserver(()=>{if(layer.classList.contains('resume-running'))run();else reset()}).observe(layer,{attributes:true,attributeFilter:['class']});
 layer.addEventListener('click',e=>{if(e.target===layer){e.stopImmediatePropagation();layer.querySelector('.resume-close').click()}},true);
 reset();
})();
