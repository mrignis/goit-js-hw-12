import{a as p,n as a,S as y}from"./assets/vendor-35d90966.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function t(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(e){if(e.ep)return;e.ep=!0;const o=t(e);fetch(e.href,o)}})();const h="https://pixabay.com/api/",g="42103820-367af78541649bbd92098b568",b=document.querySelector(".search-form"),u=document.querySelector(".gallery"),i=document.querySelector(".load-more"),d=document.querySelector(".end-collection-text");let c=1,f="";b.addEventListener("submit",L);i.addEventListener("click",v);i.classList.add("is-hidden");async function L(r){r.preventDefault(),c=1,f=r.currentTarget.elements.searchQuery.value.trim(),u.innerHTML="",await m()}async function m(){try{const r=await p.get(h,{params:{key:g,q:f,image_type:"photo",orientation:"horizontal",safesearch:"true",per_page:15,page:c}}),{hits:s,totalHits:t}=r.data;s.length===0?a.Notify.failure("Sorry, there are no images matching your search query. Please try again."):(w(s),a.Notify.success(`Hooray! We found ${t} images.`),s.length<15?(i.classList.add("is-hidden"),d.classList.remove("is-hidden")):(i.classList.remove("is-hidden"),d.classList.add("is-hidden")))}catch(r){console.error("Error fetching images:",r),a.Notify.failure("We're sorry, but there was an error fetching images.")}}async function v(){c++,await m()}function w(r){const s=r.map(t=>`
                <a href="${t.largeImageURL}" class="photo-card" data-lightbox="gallery">
                    <div class="thumb">
                        <img src="${t.webformatURL}" alt="${t.tags}" loading="lazy" />
                    </div>
                    <div class="info">
                        <p class="info-item"><b>Likes:</b> ${t.likes}</p>
                        <p class="info-item"><b>Views:</b> ${t.views}</p>
                        <p class="info-item"><b>Comments:</b> ${t.comments}</p>
                        <p class="info-item"><b>Downloads:</b> ${t.downloads}</p>
                    </div>
                </a>
            `).join("");u.insertAdjacentHTML("beforeend",s),new y(".gallery a",{captionsData:"alt",captionPosition:"bottom",captionDelay:250}),i.classList.remove("is-hidden")}
//# sourceMappingURL=commonHelpers.js.map
