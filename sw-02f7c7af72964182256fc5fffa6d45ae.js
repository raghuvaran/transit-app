self.addEventListener("install",async function(s){return(await caches.open("v1.2")).addAll(["/transit-app/assets/252025-1ce32dd7486f4be1638d28053df51b78.svg","/transit-app/assets/all-buses-4afb0160bc7e29b2fd61ee84e44d928c.json","assets/favicon.ico","/transit-app/assets/favicon-0d4084b77d7577bf4da1b9263d07cae6.png","/transit-app/assets/transit-app-d4a9930b6b1cea407e51a3cb4039dc84.css","/transit-app/assets/transit-app-85408f6ddd909cad559276abc416cf94.js","/transit-app/assets/vendor-d41d8cd98f00b204e9800998ecf8427e.css","/transit-app/assets/vendor-3754640604a1afc292be56b56821e38c.js"])}),self.addEventListener("fetch",function(s){s.respondWith(caches.match(s.request).then(function(e){return void 0!==e?e:fetch(s.request).then(function(e){let t=e.clone()
return s.request.url.match(/assets/)&&caches.open("v1.2").then(function(e){e.put(s.request,t)}),e}).catch(function(){return console.error("failed to fetch ",s.request,s)})}))})
