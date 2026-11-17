(() => {
"use strict";
const URL="https://jdandkmbnkeubxmzmjef.supabase.co", KEY="sb_publishable_ei8L_sMkm65kNoNNQ7vpcg_lEL6vQOU";
const ALLOWED=["chenithakodithuwakku000@gmail.com","raveenagunawardhana2007@gmail.com"];
const root=document.documentElement;
let client = (window.supabase && typeof window.supabase.createClient === "function")
  ? window.supabase.createClient(URL,KEY) : null;
root.classList.add("site-auth-active");
const style=document.createElement("style");
style.textContent="html.site-auth-active body>*:not(#siteAuthOverlay):not(#surpriseLoader){visibility:hidden!important}#siteAuthOverlay{visibility:visible!important}html.site-auth-active #surpriseLoader.is-visible{visibility:visible!important;opacity:1!important;pointer-events:auto!important}";
document.head.append(style);
const overlay=document.createElement("section");
overlay.id="siteAuthOverlay";overlay.className="site-auth-overlay";
overlay.innerHTML=`
 <div class="site-auth-card">
  <div class="site-auth-mark">♡</div>
  <p class="site-auth-kicker">CHENITHA ♡ RAVEENA</p>
  <h1 id="siteAuthTitle">Welcome to Our Little Universe</h1>
  <p id="siteAuthIntro">Sign in to enter your special little world.</p>
  <form id="siteAuthForm">
   <div id="siteNameField" hidden><label for="siteDisplayName">Your name</label><input id="siteDisplayName" autocomplete="name" placeholder="Your display name"></div>
   <label for="siteEmail">Email address</label><input id="siteEmail" type="email" autocomplete="username" required placeholder="you@example.com">
   <label for="sitePassword">Password</label><input id="sitePassword" type="password" autocomplete="current-password" minlength="8" required placeholder="Your password">
   <button id="siteAuthSubmit" type="submit">Log in ♡</button>
  </form>
  <div class="site-auth-actions" id="siteAuthActions">
   <button type="button" class="site-auth-secondary" id="siteCreate">Create account</button>
  </div>
  <p class="site-auth-status" id="siteAuthStatus" role="status"></p>
  <div id="siteProfile" hidden>
   <div class="site-profile-avatar" id="siteProfileAvatar">♡</div>
   <input id="siteAvatarFile" type="file" accept="image/png,image/jpeg,image/webp" hidden>
   <button id="siteChooseAvatar" type="button" class="site-auth-secondary">Change profile photo</button>
   <p class="site-auth-status" id="siteAvatarStatus" role="status"></p>
   <h2 id="siteProfileName"></h2><p id="siteProfileEmail"></p>
   <button id="siteEnter" type="button">Enter Our Website ♡</button>
   <button id="siteLogout" type="button" class="site-auth-secondary">Log out</button>
  </div>
 </div>`;
document.body.prepend(overlay);
root.classList.remove("site-entry-loading");
const $=id=>document.getElementById(id);
let mode="login";
function status(t){$("siteAuthStatus").textContent=t||"";}
function partnerName(user){
 const email=(user.email||"").toLowerCase();
 if(email==="raveenagunawardhana2007@gmail.com") return "THRA BBA";
 if(email==="chenithakodithuwakku000@gmail.com") return "BUNO";
 return user.user_metadata?.display_name || "Friend";
}
function showProfile(user){
 $("siteAuthForm").hidden=true;$("siteAuthActions").hidden=true;$("siteProfile").hidden=false;
 const name=partnerName(user);
 $("siteAuthTitle").textContent="Hey "+name+"! ♡";
 $("siteAuthIntro").textContent="Are you ready for the surprise? ♡";
 $("siteProfileName").textContent=name;
 $("siteProfileEmail").textContent=user.email;
 const avatar=user.user_metadata?.avatar_url;
 $("siteProfileAvatar").textContent=avatar?"":name[0].toUpperCase();
 $("siteProfileAvatar").style.backgroundImage=avatar?'url("'+avatar+'")':"";
 $("siteProfileAvatar").style.backgroundSize="cover";
 $("siteProfileAvatar").style.backgroundPosition="center";
 $("siteEnter").textContent="ENTER OUR WEBSITE ♡";
}
function showForm(){
 $("siteAuthForm").hidden=false;$("siteAuthActions").hidden=false;$("siteProfile").hidden=true;
}
async function enter(user, showLoader=true){
 const loader=document.getElementById("surpriseLoader");
 enterNavChip(user);
 overlay.classList.add("site-auth-exit");
 const finish=()=>{
  root.classList.remove("site-auth-active");
  overlay.remove();
  if(loader){loader.classList.remove("is-visible");loader.setAttribute("aria-hidden","true");}
 };
 if(showLoader && loader){
  loader.classList.add("is-visible");
  loader.setAttribute("aria-hidden","false");
 }
 if(showLoader) setTimeout(finish,1300);
 else finish();
}
$("siteCreate").addEventListener("click",()=>{
 if(mode==="login"){
  mode="signup";$("siteNameField").hidden=false;$("siteAuthTitle").textContent="Create Your Profile";
  $("siteAuthIntro").textContent="Make a little profile for your place in our universe.";
  $("siteAuthSubmit").textContent="Create my account ♡";$("siteCreate").textContent="Back to login";status("");
 }else{
  mode="login";$("siteNameField").hidden=true;$("siteAuthTitle").textContent="Welcome to Our Little Universe";
  $("siteAuthIntro").textContent="Sign in to enter your special little world.";
  $("siteAuthSubmit").textContent="Log in ♡";$("siteCreate").textContent="Create account";status("");
 }
});
$("siteAuthForm").addEventListener("submit",async e=>{
 e.preventDefault();const email=$("siteEmail").value.trim().toLowerCase(),password=$("sitePassword").value;
 if(!ALLOWED.includes(email)){status("Only Chenitha and Raveena's approved email accounts can access this website.");return;}
 if(!client){status("Connecting securely... Please try again in a moment.");return;}
 $("siteAuthSubmit").disabled=true;status(mode==="signup"?"Creating your profile...":"Signing in...");
 let result;
 if(mode==="signup"){
  const display_name=$("siteDisplayName").value.trim();
  if(!display_name){status("Please enter your name.");$("siteAuthSubmit").disabled=false;return;}
  result=await client.auth.signUp({email,password,options:{data:{display_name}}});
  if(!result.error&&!result.data.session){status("Account created! Check your email to confirm, then come back and log in.");}
 }else{result=await client.auth.signInWithPassword({email,password});}
 $("siteAuthSubmit").disabled=false;
 if(result.error){status(result.error.message);return;}
 if(result.data.session){showProfile(result.data.user);}
});

$("siteChooseAvatar").addEventListener("click",()=>$("siteAvatarFile").click());
$("siteAvatarFile").addEventListener("change",async()=>{
 const file=$("siteAvatarFile").files?.[0];if(!file)return;
 if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){$("siteAvatarStatus").textContent="Choose a JPG, PNG or WEBP photo under 5 MB.";return;}
 if(!client){$("siteAvatarStatus").textContent="Login connection unavailable.";return;}
 $("siteAvatarStatus").textContent="Uploading your profile photo...";
 const {data:{user},error:getErr}=await client.auth.getUser();
 if(getErr||!user){$("siteAvatarStatus").textContent="Please log in again.";return;}
 const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
 const path=user.id+"/avatar."+ext;
 const {error:upErr}=await client.storage.from("partner-profiles").upload(path,file,{upsert:true,contentType:file.type});
 if(upErr){$("siteAvatarStatus").textContent=upErr.message;return;}
 const {data}=client.storage.from("partner-profiles").getPublicUrl(path);
 const avatar_url=data.publicUrl+"?v="+Date.now();
 const {error:saveErr}=await client.auth.updateUser({data:{avatar_url}});
 if(saveErr){$("siteAvatarStatus").textContent=saveErr.message;return;}
 $("siteAvatarStatus").textContent="Profile photo updated ♡";
 const updated=(await client.auth.getUser()).data.user;showProfile(updated);enterNavChip(updated);
});
function enterNavChip(user){
 const name=partnerName(user),avatar=user.user_metadata?.avatar_url;
 document.querySelectorAll(".site-nav").forEach(nav=>{
  let p=nav.querySelector(".site-profile-chip");
  if(!p){p=document.createElement("button");p.type="button";p.className="site-profile-chip";nav.append(p);}
  p.innerHTML=avatar?'<img class="site-profile-chip-photo" alt=""> <span></span>':'♡ <span></span>';
  if(avatar)p.querySelector("img").src=avatar;
  p.querySelector("span").textContent=name;
  p.onclick=()=>{showProfile(user);overlay.classList.remove("site-auth-exit");if(!overlay.isConnected)document.body.prepend(overlay);root.classList.add("site-auth-active");};
 });
}
$("siteEnter").addEventListener("click",async()=>{
 const {data}=await client.auth.getUser();if(data.user)enter(data.user);
});
$("siteLogout").addEventListener("click",async()=>{await client.auth.signOut();try{localStorage.removeItem("chenithaRaveenaSurpriseUnlocked");}catch(e){}window.location.replace(location.pathname.includes("/pages/")?"../index.html":"index.html");});
function startAuth(){
 if(!client){status("Unable to connect securely. Please refresh this page.");return;}
 Promise.race([client.auth.getSession(),new Promise(resolve=>setTimeout(()=>resolve({data:{session:null},timeout:true}),7000))]).then(({data,timeout})=>{
  if(timeout){status("Connection is taking too long. Please try logging in again.");return;}
  if(data.session&&ALLOWED.includes(data.session.user.email.toLowerCase())){
   const isHomePage=!location.pathname.includes("/pages/") && (location.pathname.endsWith("/") || location.pathname.endsWith("/index.html"));
   if(isHomePage) showForm();
   else enter(data.session.user,false);
  } else if(data.session)client.auth.signOut();
 });
}
if(client){startAuth();}
else{
 const loader=document.createElement("script");
 loader.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
 loader.onload=()=>{
  if(window.supabase&&typeof window.supabase.createClient==="function"){
   client=window.supabase.createClient(URL,KEY);
   startAuth();
  }else{status("Secure login could not start. Please refresh.");}
 };
 loader.onerror=()=>status("Secure login service did not load. Check your connection and refresh.");
 document.head.append(loader);
}
})();