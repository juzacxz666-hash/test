/* ---------- preloader ---------- */
(function(){
  const fill=document.getElementById('loadFill'),loader=document.getElementById('loader');
  let p=0;const t=setInterval(()=>{p+=Math.random()*22;if(p>=100){p=100;clearInterval(t);
    setTimeout(()=>{loader.classList.add('done');startHero();},350);}fill.style.width=p+'%';},130);
})();

/* ---------- hero intro ---------- */
function startHero(){
  const letters=document.querySelectorAll('#heroTitle .l');
  letters.forEach((l,i)=>{l.style.transition='transform .9s cubic-bezier(.2,.8,.2,1),opacity .9s';
    setTimeout(()=>{l.style.transform='translateY(0)';l.style.opacity='1';},120+i*90);});
  const sub=document.getElementById('heroSub'),cta=document.getElementById('heroCta'),fl=document.getElementById('heroFloat');
  setTimeout(()=>{[sub,cta].forEach(e=>{e.style.transition='opacity .9s,transform .9s';e.style.opacity='1';e.style.transform='none';});},650);
  setTimeout(()=>{fl.style.transition='opacity 1s,transform 1s';fl.style.opacity='.7';fl.style.transform='none';},1000);
}

/* ---------- custom cursor ---------- */
(function(){
  const cur=document.getElementById('cur'),ring=document.getElementById('curRing');
  if(!cur)return;let x=0,y=0,rx=0,ry=0;
  window.addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;cur.style.left=x+'px';cur.style.top=y+'px';});
  (function loop(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,[data-magnetic],input,textarea').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('grow'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('grow'));
  });
})();

/* ---------- aurora follows mouse ---------- */
window.addEventListener('mousemove',e=>{
  const a=document.getElementById('aurora');
  if(!a)return;
  a.style.setProperty('--mx',(e.clientX/innerWidth*100)+'%');
  a.style.setProperty('--my',(e.clientY/innerHeight*100)+'%');
});

/* ---------- magnetic buttons ---------- */
document.querySelectorAll('[data-magnetic]').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();
    const mx=e.clientX-r.left-r.width/2,my=e.clientY-r.top-r.height/2;
    btn.style.transform=`translate(${mx*.25}px,${my*.35}px)`;});
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});

/* ---------- services spotlight ---------- */
document.querySelectorAll('[data-spot]').forEach(c=>{
  c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();
    c.style.setProperty('--sx',(e.clientX-r.left)+'px');
    c.style.setProperty('--sy',(e.clientY-r.top)+'px');});
});

/* ---------- 3D tilt cards ---------- */
document.querySelectorAll('[data-tilt]').forEach(c=>{
  c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`perspective(900px) rotateY(${px*7}deg) rotateX(${-py*7}deg) translateZ(0)`;});
  c.addEventListener('mouseleave',()=>c.style.transform='');
});

/* ---------- scroll reveal ---------- */
const io=new IntersectionObserver((es)=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');
  const c=en.target.querySelector('[data-count]');if(c&&!c.dataset.done)countUp(c);io.unobserve(en.target);}});},{threshold:.18});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- count up ---------- */
function countUp(el){el.dataset.done=1;const target=+el.dataset.count,suf=target===100?'%':(target===24?'h':'');
  let n=0;const step=target/40;const t=setInterval(()=>{n+=step;if(n>=target){n=target;clearInterval(t);}
  el.textContent=Math.round(n)+suf;},22);}

/* ---------- rail active state ---------- */
const secs=document.querySelectorAll('section[id]'),links=document.querySelectorAll('.rail a');
const io2=new IntersectionObserver((es)=>{es.forEach(en=>{if(en.isIntersecting){
  links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+en.target.id));}});},{threshold:.5});
secs.forEach(s=>io2.observe(s));

/* ---------- discord copy-to-clipboard ---------- */
(function(){
  const card=document.getElementById('discordCard');if(!card)return;
  const handle=document.getElementById('discordHandle'),go=card.querySelector('.cc-go');
  const original=go.textContent,name=card.dataset.copy;
  card.addEventListener('click',()=>{
    const done=()=>{card.classList.add('copied');go.textContent='Copied!';
      setTimeout(()=>{card.classList.remove('copied');go.textContent=original;},1600);};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(name).then(done).catch(done);}
    else{const t=document.createElement('textarea');t.value=name;document.body.appendChild(t);t.select();
      try{document.execCommand('copy');}catch(e){}t.remove();done();}
  });
})();

document.getElementById('yr').textContent=new Date().getFullYear();
