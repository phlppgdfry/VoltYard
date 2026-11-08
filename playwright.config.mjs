import {defineConfig} from '@playwright/test';
const live=process.env.VOLTYARD_BASE_URL;
export default defineConfig({
 testDir:'tests/e2e', timeout:60000, fullyParallel:true,
 retries:process.env.CI?1:0, workers:1,
 reporter:[['list'],['html',{open:'never'}]],
 use:{baseURL:live||'http://127.0.0.1:5180/',browserName:'chromium',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}],
 webServer:live?undefined:{command:'python3 -m http.server 5180 --bind 127.0.0.1 --directory _site',url:'http://127.0.0.1:5180',reuseExistingServer:false}
});
