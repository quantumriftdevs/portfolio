(()=>{
  const title=document.querySelector('.contact-title');
  if(!title||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const text=title.firstChild, right=title.querySelector('span');
  if(!text||text.nodeType!==3||!right||title.getBoundingClientRect().top<innerHeight)return;
  const left=document.createElement('span');
  left.className='cta-left'; left.textContent=text.textContent;
  title.replaceChild(left,text); right.classList.add('cta-right');
  title.classList.add('cta-wait');
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
      title.classList.remove('cta-wait'); title.classList.add('cta-arrived'); observer.disconnect();
    }
  },{threshold:.1});
  observer.observe(title);
})();
