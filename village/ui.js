function showPopup(html){
const p = document.createElement('div'); p.className='popup'; p.innerHTML=html;
document.body.appendChild(p);
return p;
}
function closePopup(p){ if(p && p.parentNode) p.parentNode.removeChild(p); }
function toast(msg, time=2000){
const t = document.createElement('div'); t.className='popup'; t.style.padding='8px 12px'; t.style.borderRadius='8px'; t.style.transform='translate(-50%,-50%)'; t.style.top='20px'; t.innerText=msg;
document.body.appendChild(t); setTimeout(()=>t.remove(),time);
}
