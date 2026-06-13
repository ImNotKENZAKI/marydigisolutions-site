const body=document.body;
const hamburger=document.querySelector('.hamburger');
const nav=document.querySelector('.nav-menu');
const navPill=document.querySelector('.nav-pill');
const links=[...document.querySelectorAll('.nav-menu a')];
const theme=document.querySelector('.theme-toggle');
const pageTransition=document.querySelector('.page-transition');

// Default is LIGHT mode. Dark mode only loads when the user explicitly saved it.
if(localStorage.getItem('md-theme')==='dark') body.classList.add('dark'); else body.classList.remove('dark');
theme?.addEventListener('click',()=>{body.classList.toggle('dark');localStorage.setItem('md-theme',body.classList.contains('dark')?'dark':'light')});
hamburger?.addEventListener('click',()=>{hamburger.classList.toggle('active');nav.classList.toggle('open')});
links.forEach(a=>a.addEventListener('click',e=>{hamburger?.classList.remove('active');nav?.classList.remove('open');const href=a.getAttribute('href');if(href&&href.endsWith('.html')&&!location.pathname.endsWith(href)){e.preventDefault();pageTransition?.classList.add('active');setTimeout(()=>location.href=href,360)}}));
function movePill(el){if(!navPill||!el||innerWidth<980)return;const n=nav.getBoundingClientRect(),r=el.getBoundingClientRect();navPill.style.width=r.width+'px';navPill.style.transform=`translateX(${r.left-n.left}px)`}
const active=document.querySelector('.nav-menu a.active')||links[0];setTimeout(()=>movePill(active),120);links.forEach(l=>l.addEventListener('mouseenter',()=>movePill(l)));nav?.addEventListener('mouseleave',()=>movePill(active));window.addEventListener('resize',()=>movePill(active));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.16});document.querySelectorAll('.reveal,.stagger').forEach(el=>io.observe(el));
// counters
const counters=document.querySelectorAll('[data-count]');const co=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count);let v=0,step=Math.max(1,Math.ceil(target/55));const timer=setInterval(()=>{v+=step;if(v>=target){v=target;clearInterval(timer)}el.textContent=target===24?`${v}/7`:`${v}+`},24);co.unobserve(el)})},{threshold:.7});counters.forEach(c=>co.observe(c));
// tilt
Array.from(document.querySelectorAll('.card,.founder-card,.case')).forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-6px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
// tech canvas
const canvas=document.getElementById('techCanvas');if(canvas){const ctx=canvas.getContext('2d');let w,h,p=[];function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';const count=Math.min(76,Math.floor(innerWidth/20));p=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22*devicePixelRatio,vy:(Math.random()-.5)*.22*devicePixelRatio,r:(Math.random()*1.6+.7)*devicePixelRatio}))}function draw(){ctx.clearRect(0,0,w,h);const dark=body.classList.contains('dark');ctx.fillStyle=dark?'rgba(125,211,252,.55)':'rgba(14,165,233,.34)';ctx.strokeStyle=dark?'rgba(125,211,252,.13)':'rgba(14,165,233,.11)';for(const a of p){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill()}for(let i=0;i<p.length;i++){for(let j=i+1;j<p.length;j++){const a=p[i],b=p[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<132*devicePixelRatio){ctx.globalAlpha=1-d/(132*devicePixelRatio);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}ctx.globalAlpha=1;requestAnimationFrame(draw)}addEventListener('resize',resize);resize();draw()}


/* Founder card mouse-follow glow */
document.querySelectorAll('.founder-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  });
});

/* Founder grayscale-to-color cursor reveal */
document.querySelectorAll('.founder-card').forEach(card=>{
  const img = card.querySelector('img');
  if(img){ card.style.setProperty('--founder-img', `url("${img.getAttribute('src')}")`); }
  card.addEventListener('mousemove', e=>{
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.setProperty('--mx','50%');
    card.style.setProperty('--my','32%');
  });
});


/* Mary Digi V4.2 polish: gradient title accents + stronger founder color reveal */
(function(){
  const targets = document.querySelectorAll('.page-hero h1, .section-heading h2');
  targets.forEach(title => {
    if (title.querySelector('.title-gradient,.gradient-text')) return;
    const text = title.textContent.trim();
    const words = text.split(/\s+/);
    if (words.length < 3) return;
    const lastCount = Math.min(2, words.length - 1);
    const normal = words.slice(0, -lastCount).join(' ');
    const accent = words.slice(-lastCount).join(' ');
    title.innerHTML = `${normal} <span class="title-gradient">${accent}</span>`;
  });

  document.querySelectorAll('.founder-card').forEach(card=>{
    const img = card.querySelector('img');
    if(img){
      card.style.setProperty('--founder-img', `url("${img.getAttribute('src')}")`);
    }
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.setProperty('--mx','50%');
      card.style.setProperty('--my','34%');
    });
  });
})();


/* V4.3 Founder spotlight: keeps B&W default and reveals vivid color/scale on hover */
document.querySelectorAll('.founder-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '34%');
  });
});


/* V4.4 Founder profile spotlight + grayscale-to-color reveal tracking */
document.querySelectorAll('.founder-profile').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '28%');
  });
});


/* V4.6 pointer tracking for premium founder and infographic cards */
document.querySelectorAll('.founder-profile, .founder-infographic div').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '22%');
  });
});

/* V4.7 cinematic title/paragraph motion */
(function(){
  const titleTargets = document.querySelectorAll('.section-heading h2, .page-hero h1');
  titleTargets.forEach(title => {
    if(title.dataset.mdMotion === 'ready') return;
    const raw = title.textContent.replace(/\s+/g,' ').trim();
    if(!raw) return;
    const words = raw.split(' ');
    const accentStart = Math.max(words.length - Math.min(2, Math.max(1, words.length - 1)), 0);
    title.innerHTML = words.map((word, index) => {
      const safe = word.replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const accent = index >= accentStart ? ' md-accent' : '';
      return `<span class="md-word${accent}" style="--d:${index}">${safe}</span>`;
    }).join(' ');
    title.classList.add('md-motion-title');
    title.dataset.mdMotion = 'ready';
  });

  document.querySelectorAll('.section-heading p, .page-hero p').forEach(p => {
    p.classList.add('md-text-fade');
  });

  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('md-text-visible');
        textObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.22});

  document.querySelectorAll('.md-motion-title, .md-text-fade').forEach(el => textObserver.observe(el));
})();

/* Final stability pass: founder pointer tracking for the clean card design */
document.querySelectorAll('.founder-profile, .founder-infographic div').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '22%');
  });
});


/* V47.1 title + premium polish safety */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('no-js');

  // Add a clean class to major headings without changing content/layout.
  document.querySelectorAll('.section-heading h2, .page-hero h1, .cta h2').forEach((title) => {
    title.classList.add('premium-heading');
  });

  // Smooth reveal for impact cards if they are added after base observers.
  const impactCards = document.querySelectorAll('.impact-card');
  if (impactCards.length) {
    const impactObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          impactObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.2});
    impactCards.forEach(card => impactObserver.observe(card));
  }
});


/* Mary Digi V48 founder hierarchy pointer tracking + clean title reveal safety */
document.querySelectorAll('.founder-hierarchy-grid .founder-profile, .founder-system-map div').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '24%');
  });
});


/* === Meeting Revision Patch: appointment modal + service learn more === */
(function(){
  const appointmentModal = document.getElementById('appointmentModal');
  const serviceModal = document.getElementById('serviceModal');
  const serviceTitle = document.getElementById('serviceModalTitle');
  const serviceText = document.getElementById('serviceModalText');
  const openModal = (modal) => { if(!modal) return; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
  const closeModals = () => { document.querySelectorAll('.md-modal.open').forEach(m=>{m.classList.remove('open'); m.setAttribute('aria-hidden','true');}); document.body.style.overflow=''; };
  document.querySelectorAll('.js-appointment').forEach(btn => btn.addEventListener('click', () => openModal(appointmentModal)));
  document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeModals));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModals(); });
  document.querySelectorAll('.service-card .learn-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.service-card');
      if(serviceTitle && card) serviceTitle.textContent = card.dataset.serviceTitle || card.querySelector('h3')?.textContent || 'Service';
      if(serviceText && card) serviceText.textContent = card.dataset.serviceDescription || card.querySelector('p')?.textContent || '';
      openModal(serviceModal);
    });
  });
})();


/* === V53 Portfolio project modal + testimonial fade === */
(function(){
  const videoModal = document.getElementById('videoModal');
  const videoTitle = document.getElementById('videoModalTitle');
  const videoLink = document.getElementById('videoExternalLink');
  const openModal = (modal) => { 
    if(!modal) return; 
    modal.classList.add('open'); 
    modal.setAttribute('aria-hidden','false'); 
    document.body.style.overflow='hidden'; 
  };
  const closeVideo = () => { 
    if(videoModal){ 
      videoModal.classList.remove('open'); 
      videoModal.setAttribute('aria-hidden','true'); 
      document.body.style.overflow=''; 
    } 
  };
  document.querySelectorAll('.work-card').forEach(card => {
    const open = () => {
      const url = card.dataset.url || card.dataset.video;
      if(!url || !videoLink) return;
      const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Project Preview';
      const platform = card.dataset.platform || (url.includes('loom') ? 'Loom' : 'YouTube');
      if(videoTitle) videoTitle.textContent = title;
      videoLink.href = url;
      videoLink.textContent = platform === 'Loom' ? 'Open Loom Walkthrough' : 'Watch on YouTube';
      openModal(videoModal);
    };
    card.querySelectorAll('.play-btn,.video-open').forEach(btn => btn.addEventListener('click', open));
  });
  videoModal?.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeVideo));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeVideo(); });

  const testimonials = [...document.querySelectorAll('.testimonial-card')];
  if(testimonials.length > 1){
    let i = 0;
    setInterval(() => {
      testimonials[i].classList.remove('active');
      i = (i + 1) % testimonials.length;
      testimonials[i].classList.add('active');
    }, 4200);
  }
})();
