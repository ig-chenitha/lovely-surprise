(() => {
"use strict";
const SUPABASE_URL = "https://jdandkmbnkeubxmzmjef.supabase.co";
const SUPABASE_KEY = "sb_publishable_ei8L_sMkm65kNoNNQ7vpcg_lEL6vQOU";
const ALLOWED = ["raveenagunawardana2007@gmail.com","chenithakodithuwakku000@gmail.com"];
const gallery = document.querySelector(".gallery");
if (!window.supabase || typeof window.supabase.createClient !== "function") {
  const status = document.getElementById("memoryAuthStatus");
  if (status) status.textContent = "The secure gallery service did not load. Check your connection and refresh this page.";
  if (gallery) gallery.setAttribute("aria-busy", "false");
  return;
}
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const authBox = document.getElementById("memoryAuth");
const uploader = document.getElementById("memoryUploader");
const loginForm = document.getElementById("memoryLoginForm");
const authStatus = document.getElementById("memoryAuthStatus");
const uploadStatus = document.getElementById("memoryUploadStatus");
const filesInput = document.getElementById("memoryFiles");
const preview = document.getElementById("memoryPreview");
const captionInput = document.getElementById("memoryCaption");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const photoCount = document.getElementById("photoCount");
let allPhotos = [];
let current = 0;
let selectedFiles = [];

const say = (el, msg) => { if (el) el.textContent = msg; };
function protectImage(img) {
  img.draggable = false;
  img.addEventListener("contextmenu", e => e.preventDefault());
  img.addEventListener("dragstart", e => e.preventDefault());
}
/* Keep ordinary image saving available; use the Download photo link in the viewer. */
document.addEventListener("dragstart", e => {
  if (e.target.closest(".gallery, .lightbox") && e.target.tagName === "IMG") e.preventDefault();
});
function openLightbox(index) {
  current = index;
  const photo = allPhotos[current];
  if (!photo) return;
  lightboxImage.src = photo.url;
  lightboxImage.alt = photo.caption || "Our memory";
  let download=document.getElementById("memoryDownload");
  if(!download){
    download=document.createElement("a");download.id="memoryDownload";download.className="memory-download";
    download.textContent="Download photo ↓";download.setAttribute("download","");
    document.querySelector(".lightbox-content").append(download);
  }
  download.href=photo.url;
  download.download=(photo.caption||"lovely-memory").replace(/[^a-z0-9-_]+/gi,"-")+".jpg";
  photoCount.textContent = (current + 1) + " / " + allPhotos.length;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}
const originalPhotos = Array.from(gallery.querySelectorAll(".photo-card")).map(card => ({
  url: card.querySelector("img")?.getAttribute("src"),
  caption: card.querySelector("h2")?.textContent || "",
  label: card.querySelector("span")?.textContent || "MEMORY"
})).filter(x => x.url);
function renderGallery(uploaded) {
  allPhotos = [...uploaded.map(x => ({...x, label:"NEW MEMORY"})), ...originalPhotos];
  gallery.innerHTML = "";
  allPhotos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.dataset.index = index;
    const img = document.createElement("img");
    img.src = photo.url; img.alt = photo.caption || "Our memory";
    img.loading = "lazy"; img.decoding = "async"; protectImage(img);
    const cap = document.createElement("div"); cap.className = "photo-caption";
    const label = document.createElement("span"); label.textContent = photo.label || "MEMORY";
    const title = document.createElement("h2"); title.textContent = photo.caption || "A Beautiful Moment ♡";
    cap.append(label,title);
    if (photo.id) {
      const removeBtn=document.createElement("button");
      removeBtn.type="button"; removeBtn.className="memory-delete";
      removeBtn.textContent="Remove photo";
      removeBtn.addEventListener("click",async event=>{
        event.stopPropagation();
        if(!confirm("Remove this memory from the shared gallery?")) return;
        const {data:{session}}=await client.auth.getSession();
        if(!session || !ALLOWED.includes(session.user.email.toLowerCase())) return;
        const {error:storageError}=await client.storage.from("lovely-memories").remove([photo.object_path]);
        if(storageError){alert("Could not remove photo: "+storageError.message);return;}
        const {error:rowError}=await client.from("memories_uploads").delete().eq("id",photo.id);
        if(rowError){alert("Could not remove photo record: "+rowError.message);return;}
        await loadMemories();
      });
      cap.append(removeBtn);
    }
    card.append(img,cap);
    card.tabIndex = 0; card.setAttribute("role","button");
    card.addEventListener("click",()=>openLightbox(index));
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openLightbox(index);}});
    gallery.append(card);
  });
}
async function loadMemories() {
  if (gallery) gallery.setAttribute("aria-busy", "true");
  const {data,error}=await client.from("memories_uploads").select("*").order("created_at",{ascending:false});
  if(error){
    console.error("Could not load shared memories:", error);
    let notice=document.getElementById("memoryLoadStatus");
    if(!notice){notice=document.createElement("p");notice.id="memoryLoadStatus";notice.className="memory-status";gallery?.before(notice);}
    notice.textContent="Shared memories could not be loaded right now. Please refresh and try again.";
    if (gallery) gallery.setAttribute("aria-busy", "false");
    return;
  }
  const oldNotice=document.getElementById("memoryLoadStatus"); if(oldNotice) oldNotice.remove();
  const uploaded=(data||[]).map(row=>({
    url:client.storage.from("lovely-memories").getPublicUrl(row.object_path).data.publicUrl,
    caption:row.caption, label:"SHARED MEMORY", id:row.id, object_path:row.object_path
  }));
  renderGallery(uploaded);
  if (gallery) gallery.setAttribute("aria-busy", "false");
}
function setSession(session) {
  const email=session?.user?.email?.toLowerCase();
  const allowed=!!email && ALLOWED.includes(email);
  authBox.hidden=allowed;
  uploader.hidden=!allowed;
  if(allowed) say(document.getElementById("memorySignedIn"),"Signed in as "+email+" · Your shared gallery");
}
client.auth.onAuthStateChange((_event,session)=>setSession(session));
client.auth.getSession().then(({data})=>setSession(data.session));
loginForm.addEventListener("submit",async e=>{
 e.preventDefault(); say(authStatus,"Signing in...");
 const email=document.getElementById("memoryEmail").value.trim().toLowerCase();
 if(!ALLOWED.includes(email)){say(authStatus,"This email is not approved for uploads.");return;}
 const password=document.getElementById("memoryPassword").value;
 const {error}=await client.auth.signInWithPassword({email,password});
 say(authStatus,error?error.message:"Signed in successfully ♡");
});
document.getElementById("memorySignup").addEventListener("click",async()=>{
 const email=document.getElementById("memoryEmail").value.trim().toLowerCase();
 const password=document.getElementById("memoryPassword").value;
 if(!ALLOWED.includes(email)){say(authStatus,"Use one of the two partner email addresses.");return;}
 if(password.length<8){say(authStatus,"Choose a password with at least 8 characters.");return;}
 say(authStatus,"Creating account...");
 const {error}=await client.auth.signUp({email,password});
 say(authStatus,error?error.message:"Check your email to confirm the account, then log in here. ♡");
});
document.getElementById("memoryLogout").addEventListener("click",async()=>{await client.auth.signOut();try{localStorage.removeItem("chenithaRaveenaSurpriseUnlocked");}catch(e){}window.location.replace("../index.html");});
filesInput.addEventListener("change",()=>{
 selectedFiles=Array.from(filesInput.files||[]);
 preview.innerHTML="";
 selectedFiles.forEach(file=>{
  const url=URL.createObjectURL(file);const img=document.createElement("img");img.src=url;img.alt=file.name;protectImage(img);preview.append(img);
 });
});
document.getElementById("memoryUploadBtn").addEventListener("click",async()=>{
 const {data:{session}}=await client.auth.getSession();
 if(!session||!ALLOWED.includes(session.user.email.toLowerCase())){say(uploadStatus,"Please sign in with an approved partner account.");return;}
 if(!selectedFiles.length){say(uploadStatus,"Choose at least one photo first.");return;}
 const button=document.getElementById("memoryUploadBtn");button.disabled=true;
 let done=0;
 for(const file of selectedFiles){
  if(!/^image\/(jpeg|png|webp|gif)$/.test(file.type)||file.size>10*1024*1024){say(uploadStatus,"Skipped "+file.name+" (use JPG, PNG, WEBP or GIF under 10 MB).");continue;}
  const path=session.user.id+"/"+Date.now()+"-"+crypto.randomUUID()+"-"+file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
  const {error:upErr}=await client.storage.from("lovely-memories").upload(path,file,{contentType:file.type,upsert:false});
  if(upErr){say(uploadStatus,"Upload failed: "+upErr.message);continue;}
  const {error:dbErr}=await client.from("memories_uploads").insert({object_path:path,caption:captionInput.value.trim(),uploaded_by:session.user.email.toLowerCase()});
  if(dbErr){await client.storage.from("lovely-memories").remove([path]);say(uploadStatus,"Could not save photo details: "+dbErr.message);continue;}
  done++;
 }
 say(uploadStatus,done+" photo(s) added to your shared memories ♡");
 selectedFiles=[];filesInput.value="";preview.innerHTML="";captionInput.value="";
 button.disabled=false;await loadMemories();
});
document.getElementById("nextBtn").addEventListener("click",()=>openLightbox((current+1)%allPhotos.length));
document.getElementById("prevBtn").addEventListener("click",()=>openLightbox((current-1+allPhotos.length)%allPhotos.length));
document.getElementById("closeBtn").addEventListener("click",closeLightbox);
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener("keydown",e=>{if(!lightbox.classList.contains("active"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowRight")openLightbox((current+1)%allPhotos.length);if(e.key==="ArrowLeft")openLightbox((current-1+allPhotos.length)%allPhotos.length);});
loadMemories().catch(error => { console.error(error); if (gallery) gallery.setAttribute("aria-busy", "false"); const s=document.getElementById("memoryLoadStatus"); if(s) s.textContent="Could not connect to shared memories. Please refresh and try again."; });
})();