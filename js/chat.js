(()=>{"use strict";
const SUPABASE_URL="https://jdandkmbnkeubxmzmjef.supabase.co",SUPABASE_KEY="sb_publishable_ei8L_Smkm65kNoNNQ7vpcg_lEL6vQOU",ALLOWED=["raveenagunawardhana2007@gmail.com","chenithakodithuwakku000@gmail.com"];
const name=email=>email.toLowerCase()==="raveenagunawardhana2007@gmail.com"?"Raveena":"Chenitha";
function build(){
 if(document.getElementById("lovelyChatWidget"))return;
 const root=document.createElement("div");root.id="lovelyChatWidget";root.innerHTML=`
 <button class="lc-launcher" id="lcOpen" type="button" aria-label="Open our chat" aria-expanded="false"><span class="lc-launcher-heart">♡</span><span class="lc-launcher-pulse"></span></button>
 <section class="lc-panel" id="lcPanel" aria-label="Our private chat" aria-hidden="true">
 <header class="lc-head"><div><span class="lc-eyebrow">JUST THE TWO OF US</span><h2>Our Little Chat <i>♡</i></h2><p id="lcStatus">Connecting securely…</p></div><button class="lc-close" id="lcClose" type="button" aria-label="Close chat">×</button></header>
 <div class="lc-sparkle lc-sparkle-one"></div><div class="lc-sparkle lc-sparkle-two"></div>
 <div class="lc-messages" id="lcMessages" aria-live="polite"><p class="lc-empty">Loading our conversation… ♡</p></div>
 <form class="lc-compose" id="lcForm"><textarea id="lcInput" rows="1" maxlength="2000" placeholder="Write something lovely…" aria-label="Message" required></textarea><button id="lcSend" type="submit" aria-label="Send message">↑</button></form>
 </section>`;document.body.append(root);
 const open=root.querySelector("#lcOpen"),panel=root.querySelector("#lcPanel"),close=root.querySelector("#lcClose");
 function setOpen(value){panel.classList.toggle("is-open",value);panel.setAttribute("aria-hidden",String(!value));open.setAttribute("aria-expanded",String(value));if(value)root.querySelector("#lcInput").focus();}
 open.addEventListener("click",()=>setOpen(!panel.classList.contains("is-open")));close.addEventListener("click",()=>setOpen(false));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false);});
 if(!window.supabase){root.querySelector("#lcStatus").textContent="Chat service unavailable.";return;}
 const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY),list=root.querySelector("#lcMessages"),status=root.querySelector("#lcStatus"),form=root.querySelector("#lcForm"),input=root.querySelector("#lcInput"),send=root.querySelector("#lcSend");let me=null,channel=null;const seen=new Set();
 function append(row){if(seen.has(row.id))return;seen.add(row.id);list.querySelector(".lc-empty")?.remove();const mine=row.sender_email.toLowerCase()===me.email.toLowerCase(),b=document.createElement("article"),who=document.createElement("span"),p=document.createElement("p"),t=document.createElement("time");b.className="lc-bubble "+(mine?"mine":"theirs");who.className="lc-sender";who.textContent=mine?"You":name(row.sender_email);p.textContent=row.message;t.textContent=new Date(row.created_at).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});b.append(who,p,t);list.append(b);list.scrollTop=list.scrollHeight;}
 async function init(){const {data:{session},error}=await db.auth.getSession();if(error||!session||!ALLOWED.includes((session.user.email||"").toLowerCase())){status.textContent="Please sign in to use our private chat.";return;}me=session.user;const {data,error:e}=await db.from("lovely_chat_messages").select("*").order("created_at",{ascending:true}).limit(200);if(e){status.textContent="Couldn't load messages. Please try again.";console.error(e);return;}(data||[]).forEach(append);status.textContent="Private chat connected";channel=db.channel("lovely-couple-chat-widget").on("postgres_changes",{event:"INSERT",schema:"public",table:"lovely_chat_messages"},payload=>append(payload.new)).subscribe(s=>{if(s==="SUBSCRIBED")status.textContent="Live • just the two of us";});}
 form.addEventListener("submit",async e=>{e.preventDefault();const message=input.value.trim();if(!message||!me)return;send.disabled=true;const {error}=await db.from("lovely_chat_messages").insert({sender_email:me.email,sender_name:name(me.email),message});send.disabled=false;if(error){status.textContent="Message could not send. Check your connection.";console.error(error);return;}input.value="";input.focus();});
 input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
 init().catch(e=>{console.error(e);status.textContent="Chat could not connect.";});window.addEventListener("beforeunload",()=>{if(channel)db.removeChannel(channel);});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",build);else build();
})();