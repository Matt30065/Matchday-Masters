/* Matchday Masters v1.7.1: local-first snapshots with revision-checked cloud saves. */
const SUPABASE_URL='https://nfnhxryoxlwhupnftycc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_x956uwqL74BdFE2RpjNMlA_81Xn09iK';
const cloud={structuredMode:true,mirror:null,mirrorBusy:false,client:null,user:null,clubId:null,revision:0,busy:false,dirty:false,timer:null,loading:true,conflict:false,status:"🟡 CONNECTING…",lastSyncedAt:null};
const localKey=()=>`mdm-v16-${cloud.user?.id||'anonymous'}`;
function cloudStatus(message){
  cloud.status=message;
  if(message.startsWith('🟢 CLOUD SYNCED')) cloud.lastSyncedAt=Date.now();
  refreshCloudStatus();
}
function refreshCloudStatus(){
  const el=document.getElementById('cloud-status');
  if(!el)return;
  const message=cloud.status||'🟡 CONNECTING…';
  const time=cloud.lastSyncedAt&&message.startsWith('🟢 CLOUD SYNCED')
    ?' · '+new Date(cloud.lastSyncedAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) : '';
  el.textContent=message+time;
  el.setAttribute('aria-label',message+time);
  if(typeof updateCloudHealth==='function')updateCloudHealth();
  el.title=cloud.lastSyncedAt?'Last successful cloud sync: '+new Date(cloud.lastSyncedAt).toLocaleString('en-GB'):message;
}
function storeLocal(){if(!cloud.user)return false;try{localStorage.setItem(localKey(),JSON.stringify({clubId:cloud.clubId,revision:cloud.revision,dirty:cloud.dirty,db,at:Date.now()}));return true}catch(e){cloudStatus('⚠ DEVICE STORAGE FULL — EXPORT BACKUP');return false}}
function cachedLocal(){try{return JSON.parse(localStorage.getItem(localKey())||'null')}catch{return null}}
function authView(){return `<div class="splash"><div class="auth-box"><img class="logo" src="icon.svg" alt=""><div class="eyebrow">PRIVATE CLUB ACCOUNT</div><h1>MATCHDAY<br><span style="color:var(--lime)">MASTERS</span></h1><p>Sign in to your secure club workspace.</p><div class="panel"><form id="cloud-auth-form" class="form"><label class="field">Email<input name="email" type="email" autocomplete="email" required></label><label class="field">Password<input name="password" type="password" minlength="6" autocomplete="current-password" required></label><div class="row"><button class="button" type="submit">SIGN IN</button><button class="ghost" type="button" id="cloud-signup">CREATE ACCOUNT</button></div></form><p class="hint" id="cloud-auth-message">Email confirmation is required for new accounts. Sign in online before using offline mode.</p></div></div></div>`}
function renderAuth(){document.getElementById('app').innerHTML=authView();const form=document.getElementById('cloud-auth-form'),msg=document.getElementById('cloud-auth-message');form.onsubmit=async e=>{e.preventDefault();const f=new FormData(form);msg.textContent='Signing in…';try{const {data,error}=await cloud.client.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});if(error)msg.textContent=error.message;else if(data.user)await cloudLoad()}catch(e){msg.textContent='Network unavailable. Reconnect to sign in.'}};document.getElementById('cloud-signup').onclick=async()=>{if(!form.reportValidity())return;const f=new FormData(form);msg.textContent='Creating account…';try{const {data,error}=await cloud.client.auth.signUp({email:f.get('email'),password:f.get('password'),options:{emailRedirectTo:location.origin+location.pathname}});msg.textContent=error?error.message:data.session?'Account created. Loading…':'Check your email, confirm your account, then sign in.';if(data.session)await cloudLoad()}catch(e){msg.textContent='Network unavailable. Reconnect and try again.'}}}
function showCloudError(message){document.getElementById('app').innerHTML=`<main class="shell"><h2>Cloud connection issue</h2><p>${esc(message)}</p><button class="button" id="retry-cloud">RETRY</button></main>`;document.getElementById('retry-cloud').onclick=cloudLoad}
async function cloudLoad(){
 cloud.loading=true;let user;
 try{const s=await cloud.client.auth.getSession();user=s.data?.session?.user;if(!user)user=(await cloud.client.auth.getUser()).data?.user}catch(e){}
 if(!user){cloud.user=null;cloud.clubId=null;cloud.loading=false;renderAuth();return}
 cloud.user=user;
 const cached=cachedLocal();
 if(cached?.dirty){cloud.clubId=cached.clubId;cloud.revision=cached.revision||0;cloud.dirty=true;db=cached.db;cloud.loading=false;page='home';matchId=null;render();cloudStatus(navigator.onLine?'🟠 LOCAL CHANGES — SYNC PENDING':'🔴 OFFLINE — SAVED ON DEVICE');if(navigator.onLine)cloudFlush();return}
 try{
  const {data:rows,error:readError}=await cloud.client.from('clubs').select('id').eq('owner_id',user.id).order('created_at',{ascending:true}).limit(1);
  if(readError)throw readError;
  cloud.clubId=rows?.[0]?.id||null;
  let stored=null;
  if(cloud.clubId){const {data,error}=await cloud.client.from('mdm_primary_state').select('state,revision').eq('club_id',cloud.clubId).maybeSingle();if(error)throw error;stored=data}
  cloud.revision=stored?.revision||0;
  db=stored?.state||initial();if(!db.season)db.season=seasonNow();
  cloud.dirty=false;storeLocal();cloud.loading=false;page='home';matchId=null;render();cloudStatus('🟢 CLOUD SYNCED');
 }catch(e){if(cached?.db){cloud.clubId=cached.clubId;cloud.revision=cached.revision||0;db=cached.db;cloud.loading=false;page='home';matchId=null;render();cloudStatus('🔴 CLOUD UNAVAILABLE — LOCAL COPY LOADED')}else{cloud.loading=false;showCloudError(e.message||'Connect online to load your club for the first time.')}}
}
async function cloudFlush(){
 if(!cloud.user||cloud.loading||!cloud.dirty||cloud.conflict||cloud.busy||!navigator.onLine)return;
 cloud.busy=true;const snapshot=JSON.parse(JSON.stringify(db));const revision=cloud.revision;cloudStatus('🟡 SAVING…');
 try{
  if(!cloud.clubId){if(!snapshot.club)return;const r=await cloud.client.from('clubs').insert({owner_id:cloud.user.id,name:snapshot.club.name,settings:{},sync_revision:0}).select('id').single();if(r.error)throw r.error;cloud.clubId=r.data.id}
  const res=await cloud.client.rpc('mdm_save_primary_state',{p_club_id:cloud.clubId,p_expected_revision:revision,p_state:snapshot});
  if(res.error)throw res.error;
  if(res.data?.conflict){cloud.conflict=true;cloudStatus('⚠ CLOUD CONFLICT — EXPORT BACKUP');alert('Another device updated this club. Export a backup before reloading.');return}
  if(!Number.isFinite(Number(res.data?.revision)))throw Error('Save was not confirmed');
  cloud.revision=Number(res.data.revision);
  cloud.mirror={ok:true,revision:cloud.revision,players:res.data.players,matches:res.data.matches,events:res.data.events};
  cloud.dirty=JSON.stringify(snapshot)!==JSON.stringify(db);
  storeLocal();cloudStatus(cloud.dirty?'🟡 MORE CHANGES TO SYNC':'🟢 CLOUD SYNCED');
 }catch(e){cloud.dirty=true;storeLocal();cloudStatus('🔴 NOT SYNCED — SAVED ON DEVICE');console.error('Structured cloud save failed:',e)}
 finally{cloud.busy=false;if(cloud.dirty&&!cloud.conflict&&navigator.onLine){clearTimeout(cloud.timer);cloud.timer=setTimeout(cloudFlush,5000)}}
}
function queueCloudSave(){cloud.dirty=true;if(!storeLocal())return;cloudStatus(navigator.onLine?'🟡 SAVING…':'🔴 OFFLINE — SAVED ON DEVICE');clearTimeout(cloud.timer);cloud.timer=setTimeout(cloudFlush,700)}
async function cloudSignOut(){if(cloud.dirty){if(navigator.onLine)await cloudFlush();if(cloud.dirty){alert('Unsynced changes remain on this device. Please reconnect and wait for CLOUD SYNCED before signing out.');return}}await cloud.client.auth.signOut();cloud.user=null;cloud.clubId=null;cloud.revision=0;cloud.dirty=false;db=initial();renderAuth()}
async function initCloud(){if(!window.supabase){showCloudError('Connection library unavailable. Connect to the internet and reload to sign in.');return}cloud.client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});cloud.client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){cloud.user=null;cloud.clubId=null;renderAuth()}});await cloudLoad();window.addEventListener('online',()=>{if(cloud.dirty)cloudFlush();else if(!cloud.conflict){cloudStatus('🟡 CONNECTING…');checkCloudHealth().catch(()=>{});}else cloudStatus('⚠ CLOUD CONFLICT — EXPORT BACKUP')});window.addEventListener('offline',()=>cloudStatus(cloud.dirty?'🔴 OFFLINE — SAVED ON DEVICE':'🔴 OFFLINE — LAST CLOUD SAVE RETAINED'));document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cloud.dirty)cloudFlush()})}

// V1.9: read-only cloud verification. Never claim sync solely from navigator.onLine.
function updateCloudHealth(extra=''){
  const el=document.getElementById('cloud-health-detail');if(!el)return;
  const when=cloud.lastSyncedAt?new Date(cloud.lastSyncedAt).toLocaleString('en-GB'):'Not confirmed this session';
  const mirror=cloud.mirror?.ok?`Structured records: revision ${cloud.mirror.revision} · ${cloud.mirror.players} players · ${cloud.mirror.matches} matches · ${cloud.mirror.events} events.`:cloud.mirror?.message?`Structured mirror: needs attention (${cloud.mirror.message}).`:'Structured records: ready for new test data.';
  el.textContent=`Last confirmed upload: ${when}. Local edits pending: ${cloud.dirty?'YES':'NO'}. Conflict: ${cloud.conflict?'YES':'NO'}. ${mirror} ${extra}`;
}
async function checkCloudHealth(){
  const el=document.getElementById('cloud-health-detail');if(!el)return;
  if(!navigator.onLine){updateCloudHealth('Offline: cloud cannot be checked.');return}
  if(!cloud.user||!cloud.clubId){updateCloudHealth('No cloud club loaded.');return}
  el.textContent='Checking the stored cloud revision…';
  try{
    const {data,error}=await cloud.client.from('mdm_primary_state').select('revision').eq('club_id',cloud.clubId).single();
    if(error)throw error;
    const remote=Number(data.revision),local=Number(cloud.revision);
    updateCloudHealth(remote===local?`Cloud revision ${remote} matches this device.`:`Cloud revision ${remote}, device revision ${local}. Another device may have newer changes. Do not overwrite; export a backup before reloading.`);
  }catch(e){updateCloudHealth('Cloud check failed: '+(e.message||'Unknown error'))}
}
// Warn only while changes are not uploaded; browsers may suppress the message.
window.addEventListener('beforeunload',e=>{if(cloud.user&&cloud.dirty){e.preventDefault();e.returnValue=''}});

// V1.9.1: non-destructive structured mirror. Snapshot remains the source of truth.
// RPC rebuilds tables atomically from the SAVED cloud snapshot, never from pending local edits.
let mirrorTimer=null;
function scheduleMirrorRefresh(){
  if(!cloud.user||!cloud.clubId||cloud.dirty||cloud.conflict||!navigator.onLine)return;
  clearTimeout(mirrorTimer);
  mirrorTimer=setTimeout(refreshStructuredMirror,1200);
}
async function refreshStructuredMirror(){
  updateCloudHealth('Structured records are written automatically with each successful save.');return;
  if(cloud.mirrorBusy||cloud.dirty||cloud.busy||cloud.conflict||!navigator.onLine||!cloud.clubId)return;
  cloud.mirrorBusy=true;
  try{
    const {data,error}=await cloud.client.rpc('mdm_refresh_structured_mirror',{p_club_id:cloud.clubId});
    if(error)throw error;
    cloud.mirror={ok:true,...data};
  }catch(error){
    cloud.mirror={ok:false,message:error.message||'Mirror not available'};
    console.warn('Structured mirror not refreshed:',error);
  }finally{cloud.mirrorBusy=false;updateCloudHealth()}
}

// V1.9.3: preserve the latest in-memory snapshot on page closure or backgrounding.
window.addEventListener('pagehide',()=>{if(cloud.user)storeLocal()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&cloud.user)storeLocal()});
