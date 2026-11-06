/* Two collaborators assemble the skills-led paper resume. */
(()=>{'use strict';
 const layer=document.querySelector('.resume-overlay');
 if(!layer||!window.resumeV3Markup)return;
 const paper=layer.querySelector('.resume-paper'),sheet=layer.querySelector('.resume-sheet');
 const photo=sheet.querySelector('.resume-photo');if(!paper||!sheet||!photo)return;
 photo.classList.add('v3-photo');photo.querySelector('.resume-flipper').style.animation='none';
 sheet.innerHTML=window.resumeV3Markup;sheet.append(photo);
 const agents=[...paper.querySelectorAll('.resume-agent')];agents.slice(2).forEach(a=>a.remove());
 const [editor,layout]=agents;if(!editor||!layout)return;
 editor.querySelector('span').textContent='editor';layout.querySelector('span').textContent='layout';
 const shapes={
  pointer:'<path d="M2 1v17l4.2-4 3.3 7 3-1.4-3.4-7H16z" fill="currentColor" stroke="#161616" stroke-width="1.2"/>',
  text:'<path d="M5 2h10M10 2v18M5 20h10" fill="none" stroke="#161616" stroke-width="4" stroke-linecap="round"/><path d="M5 2h10M10 2v18M5 20h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  grab:'<path d="M5 11V5a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v6c0 4-2 7-6 7H9c-2 0-3-1-4-3L2 13c-.8-1.4 1-2.8 2-1.6z" fill="currentColor" stroke="#161616" stroke-width="1.2"/>'
 };
 function mode(a,m){if(a.dataset.mode!==m){a.dataset.mode=m;a.querySelector('svg').innerHTML=shapes[m]}}
 function move(a,x,y){const m=a.dataset.mode,dx=m==='pointer'?2:10,dy=m==='pointer'?1:2;a.style.transform=`translate3d(${x-dx}px,${y-dy}px,0)`}
 const mark=document.createElement('div');mark.className='v3-selection';paper.append(mark);
 const entries=[...sheet.querySelectorAll('[data-type]')].map(el=>({el,full:el.textContent,node:el.firstChild}));
 let frame=0,start=0,last=-1,from={x:0,y:0},pos={x:0,y:0};
 function clear(){cancelAnimationFrame(frame);photo.classList.remove('flipped');photo.style.opacity='0';mark.style.display='none';entries.forEach(e=>{e.node.data='';e.el.classList.remove('typing')});mode(editor,'pointer');mode(layout,'pointer');last=-1;pos={x:0,y:0};layout.querySelector('svg').style.transform=''}
 function complete(){cancelAnimationFrame(frame);mark.style.display='none';photo.style.opacity='1';photo.classList.add('flipped');entries.forEach(e=>{e.node.data=e.full;e.el.classList.remove('typing')});mode(editor,'pointer');mode(layout,'pointer')}
 const mix=(a,b,t)=>a+(b-a)*Math.max(0,Math.min(1,t));
 function tick(now){
  if(!layer.classList.contains('resume-running'))return;
  const t=(now-start)/1000,p=paper.getBoundingClientRect(),r=photo.getBoundingClientRect();
  const x=r.left-p.left,y=r.top-p.top,w=r.width,h=r.height;
  if(t<2.5){
   mode(editor,'pointer');move(editor,p.width*.1,p.height*.82);
   if(t<.55){mode(layout,'pointer');move(layout,mix(p.width*.55,x,t/.55),mix(p.height*.25,y,t/.55))}
   else if(t<1.65){
    mode(layout,'grab');mark.style.display='block';mark.style.left=x+'px';mark.style.top=y+'px';
    const dw=t<1.1?mix(0,w,(t-.55)/.55):w,dh=t<1.1?1:mix(1,h,(t-1.1)/.55);
    mark.style.width=Math.max(1,dw)+'px';mark.style.height=Math.max(1,dh)+'px';move(layout,x+dw,y+(t<1.1?0:dh));
   }else{
    mark.style.display='none';photo.style.opacity='1';mode(layout,'pointer');
    if(t<1.95)move(layout,mix(x+w,x+w*1.4,(t-1.65)/.3),mix(y+h,y+h*1.3,(t-1.65)/.3));
    else move(layout,mix(x+w*1.4,x+w*.5,(t-1.95)/.35),mix(y+h*1.3,y+h*.5,(t-1.95)/.35));
    if(t>=2.3){layout.querySelector('svg').style.transform=t<2.42?'scale(.8)':'';photo.classList.add('flipped')}
   }
  }else{
   const duration=7.25/entries.length,idx=Math.min(entries.length-1,Math.floor((t-2.5)/duration));
   const phase=Math.min(1,((t-2.5)-idx*duration)/duration),entry=entries[idx];
   entries.forEach((e,i)=>{const n=i<idx?e.full.length:i>idx?0:Math.floor(e.full.length*Math.max(0,Math.min(1,(phase-.18)/.7)));if(e.node.data.length!==n)e.node.data=e.full.slice(0,n);e.el.classList.toggle('typing',i===idx&&phase>=.18&&phase<.88)});
   const range=document.createRange();range.setStart(entry.node,entry.node.data.length);range.collapse(true);
   let box=range.getBoundingClientRect();if(!box.height)box=entry.el.getBoundingClientRect();
   const target={x:box.left-p.left,y:box.top-p.top};
   if(last!==idx){from={...pos};last=idx}
   if(phase<.18){mode(editor,'pointer');pos={x:mix(from.x,target.x,phase/.18),y:mix(from.y,target.y,phase/.18)}}
   else{mode(editor,phase<.88?'text':'pointer');pos=target}
   move(editor,pos.x,pos.y);
   const section=entry.el.closest('section,header').getBoundingClientRect();mode(layout,'pointer');move(layout,section.left-p.left-7,section.top-p.top);
  }
  frame=requestAnimationFrame(tick);
 }
 function run(){clear();start=performance.now();frame=requestAnimationFrame(tick)}
 new MutationObserver(()=>{if(layer.classList.contains('resume-done'))complete();else if(layer.classList.contains('resume-running'))run();else clear()}).observe(layer,{attributes:true,attributeFilter:['class']});
 layer.addEventListener('click',e=>{if(e.target===layer){e.stopImmediatePropagation();layer.querySelector('.resume-close').click()}},true);
 clear();
})();
