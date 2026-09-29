import { chromium, devices } from '@playwright/test'
const S='/tmp/claude-0/-home-user-Fish/7e49a532-3fc3-5c3b-8d9d-fa191f94b6c0/scratchpad'
const B=process.env.BASE_URL||'http://127.0.0.1:3320'
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const [path='/',out='cap',mode='',dev='']=process.argv.slice(2)
const mobile=dev==='mobile', full=mode==='full'
const ctx=await b.newContext(mobile?{...devices['Pixel 5']}:{viewport:{width:1440,height:900}})
await ctx.addCookies([{name:'finquiry_consent',value:encodeURIComponent(JSON.stringify({analytics:false,ts:Date.now()})),url:B}])
const p=await ctx.newPage()
await p.goto(B+path,{waitUntil:'networkidle'})
await p.evaluate(async()=>{const s=innerHeight*0.8;for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,110))}scrollTo(0,0)})
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(900)
if(full){const h=await p.evaluate(()=>document.documentElement.scrollHeight); if(h<=16000) await p.setViewportSize({width:mobile?393:1440,height:h}); await p.waitForTimeout(500)}
await p.screenshot({path:`${S}/${out}.png`})
console.log('saved',out)
await b.close()
