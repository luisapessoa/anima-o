(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cfg=window.NOOMI_CONFIG||{};

  // Links do regulamento e da privacidade (definidos em js/config.js)
  document.querySelectorAll('[data-link]').forEach(function(a){
    var url=cfg[a.dataset.link+'Url'];
    if(url)a.href=url;else{a.removeAttribute('target');a.addEventListener('click',function(e){e.preventDefault()})}
  });

  // Header
  var header=document.querySelector('.header');
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>30)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  // Contador do "R$ 500"
  function countUp(el){
    var to=+el.dataset.count,start=null,dur=1400;
    function step(t){if(!start)start=t;var p=Math.min((t-start)/dur,1),e=1-Math.pow(1-p,3);el.textContent='R$ '+Math.round(to*e);if(p<1)requestAnimationFrame(step)}
    requestAnimationFrame(step);
  }

  // Passo a passo no celular: a linha vertical termina no centro do círculo 4
  var steps=document.querySelector('.steps');
  function fitLine(){
    var nums=steps.querySelectorAll('.n'),last=nums[nums.length-1];
    var end=steps.getBoundingClientRect().bottom-(last.getBoundingClientRect().top+last.offsetHeight/2);
    steps.style.setProperty('--line-end',end+'px');
  }
  if(steps){fitLine();window.addEventListener('resize',fitLine);if(document.fonts)document.fonts.ready.then(fitLine)}

  // Animações de entrada ao rolar
  var els=document.querySelectorAll('.reveal,.seq');
  function show(el){el.classList.add('in');var c=el.querySelector('[data-count]');if(c&&!reduce)countUp(c)}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{threshold:.18});
    els.forEach(function(el){io.observe(el)});
  }else{els.forEach(show)}

  // Máscaras
  function digits(v){return v.replace(/\D/g,'')}
  function maskPhone(v){v=digits(v).slice(0,11);if(v.length<=2)return v?'('+v:'';if(v.length<=6)return '('+v.slice(0,2)+') '+v.slice(2);if(v.length<=10)return '('+v.slice(0,2)+') '+v.slice(2,6)+'-'+v.slice(6);return '('+v.slice(0,2)+') '+v.slice(2,7)+'-'+v.slice(7)}
  function maskCPF(v){v=digits(v).slice(0,11);return v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2')}
  document.querySelectorAll('[data-mask]').forEach(function(el){
    el.addEventListener('input',function(){el.value=el.dataset.mask==='cpf'?maskCPF(el.value):maskPhone(el.value)});
  });
  function validCPF(c){c=digits(c);if(c.length!==11||/^(\d)\1+$/.test(c))return false;for(var t=9;t<11;t++){var s=0;for(var i=0;i<t;i++)s+=c[i]*(t+1-i);if(((10*s)%11)%10!=c[t])return false}return true}

  // Pessoa física x Empresa
  var fs=document.getElementById('indicado'),lbl=document.getElementById('l-ind-nome');
  document.querySelectorAll('input[name="tipo_indicado"]').forEach(function(r){
    r.addEventListener('change',function(){
      var emp=r.value==='empresa'&&r.checked;
      fs.classList.toggle('is-company',emp);
      lbl.innerHTML=(emp?'Razão social da empresa':'Nome da pessoa indicada')+' <span class="req">*</span>';
    });
  });

  // Validação e envio
  var form=document.getElementById('ref-form'),errBox=form.querySelector('.form-error');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true,first=null;
    function check(id,test){var el=document.getElementById(id),f=el.closest('.field'),good=test(el.value.trim());f.classList.toggle('invalid',!good);if(!good){ok=false;first=first||el}}
    check('f-nome',function(v){return v.split(/\s+/).length>=2});
    check('f-wpp',function(v){return digits(v).length>=10});
    check('f-email',function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)});
    check('f-cpf',validCPF);
    check('f-ind-nome',function(v){return v.length>=2});
    check('f-ind-wpp',function(v){return digits(v).length>=10});
    ['c1','c2'].forEach(function(id){var w=document.getElementById(id),c=w.querySelector('input');w.classList.toggle('invalid',!c.checked);if(!c.checked){ok=false;first=first||c}});
    if(!ok){first.focus();return}
    if(!cfg.formEndpoint){done();return}
    var data=new FormData(form),body=data,headers={};
    if(cfg.formFormat==='json'){var o={};data.forEach(function(v,k){o[k]=v});body=JSON.stringify(o);headers['Content-Type']='application/json'}
    form.classList.add('sending');errBox.hidden=true;
    fetch(cfg.formEndpoint,{method:'POST',body:body,headers:headers})
      .then(function(r){if(!r.ok)throw new Error(r.status);done()})
      .catch(function(){errBox.hidden=false})
      .then(function(){form.classList.remove('sending')});
  });
  function done(){
    if(cfg.redirectUrl){window.location.href=cfg.redirectUrl;return}
    form.classList.add('sent');
    form.scrollIntoView({behavior:'smooth',block:'center'});
  }
})();
