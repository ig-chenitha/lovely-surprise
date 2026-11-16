(() => {
"use strict";
const URL="https://qenobhmetbarxepggocx.supabase.co", KEY="sb_publishable_U3jXC6vggzC_bqHJxmAoEA_riJcQh29";
const ALLOWED=["chenithakodithuwakku000@gmail.com","raveenagunawardhana2007@gmail.com"];
const client=window.supabase.createClient(URL,KEY);
const root=document.documentElement;
root.classList.add("site-auth-active");
const style=document.createElement("style");
style.textContent="html.site-auth-active body>*:not(#siteAuthOverlay){visibility:hidden!important}#siteAuthOverlay{visibility:visible!important}";
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
   <h2 id="siteProfileName"></h2><p id="siteProfileEmail"></p>
   <button id="siteEnter" type="button">Enter Our Website ♡</button>
   <button id="siteLogout" type="button" class="site-auth-secondary">Log out</button>
  </div>
 </div>`;
document.body.prepend(overlay);
const $=id=>document.getElementById(id);
let mode="login";
function status(t){$("siteAuthStatus").textContent=t||"";}
function showProfile(user){
 $("siteAuthForm").hidden=true;$("siteAuthActions").hidden=true;$("siteProfile").hidden=false;
 const name=user.user_metadata?.display_name||user.email.split("@")[0];
 $("siteAuthTitle").textContent="Welcome back ♡";
 $("siteAuthIntro").textContent="Your little universe is ready.";
 $("siteProfileName").textContent=name;$("siteProfileEmail").textContent=user.email;
 $("siteProfileAvatar").textContent=(name.trim()[0]||"♡").toUpperCase();
}
function showForm(){
 $("siteAuthForm").hidden=false;$("siteAuthActions").hidden=false;$("siteProfile").hidden=true;
}
async function enter(user){
 const name=user.user_metadata?.display_name||user.email.split("@")[0];
 document.querySelectorAll(".site-nav").forEach(nav=>{
  let p=nav.querySelector(".site-profile-chip");
  if(!p){p=document.createElement("button");p.type="button";p.className="site-profile-chip";nav.append(p);}
  p.textContent="♡ "+name;
  p.addEventListener("click",()=>{showProfile(user);overlay.classList.remove("site-auth-exit");if(!overlay.isConnected)document.body.prepend(overlay);root.classList.add("site-auth-active");});
 });
 overlay.classList.add("site-auth-exit");
 setTimeout(()=>{root.classList.remove("site-auth-active");overlay.remove();},400);
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
$("siteEnter").addEventListener("click",async()=>{
 const {data}=await client.auth.getUser();if(data.user)enter(data.user);
});
$("siteLogout").addEventListener("click",async()=>{await client.auth.signOut();mode="login";showForm();status("You have been logged out.");});
client.auth.getSession().then(({data})=>{
 if(data.session&&ALLOWED.includes(data.session.user.email.toLowerCase()))showProfile(data.session.user);
 else if(data.session)client.auth.signOut();
});
})();