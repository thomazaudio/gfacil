// Copyright 2016 Google Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'CeasaPlus2.3';
var cacheName = 'CeasaPlus2.3';
var filesToCache = [
  'css/style.css',
  'global/lib/spin.js',
  'js/base.js',
   'js/app.js',
  'index.html',
  "global/st-app/st-modal/template-module/modalContent.html",
  "global/st-app/app-autocomplete/template-module/buscaAutoCompleteObject.html",
  "global/st-app/app-autocomplete/template-module/autoCompleteObject.html",
  "global/st-app/app-pdv/template-module/modalPosVenda.html",
  "global/st-app/app-pdv/template-module/pdv-ficha.html",
  "global/st-app/app-filial/template/alertFilial.html",
  "global/st-app/app-filial/template/filialList.html",
  "global/st-app/app-pedido/template-module/appSimplePedido.html",
  "global/st-app/app-pedido/template-module/appListSimplePedido.html",
  "global/st-app/app-estoque/template-module/buttonEstoque.html",
  "global/st-app/st-util/template-module/stToggle.html",
  "global/st-app/app-pedido/template-module/itensPedido.html",
  "global/st-app/app-mov/template-module/parcelaMov.html",
  "global/st-app/app-mov/template-module/buttonBaixaMov.html",
  "global/st-app/st-modal/template-module/stModal.html",
  'global/st-app/st-modal/template-module/modalContent.html',
  "global/st-app/app-pdv/template-route/vendas.html",
  "global/st-app/app-estoque/template-route/entradaMercadoria.html",
  "global/st-app/app-mov/template-module/modalBaixaMov.html"
 
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
    	  
    	  console.log("key = "+key);
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  if (e.request.url.indexOf(".html") > -1 || e.request.url.indexOf(".jpg") > -1 || e.request.url.indexOf(".png") > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
