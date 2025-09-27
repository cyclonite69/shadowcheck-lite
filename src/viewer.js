// --- utils.js ---
    const MAPBOX_ACCESS_TOKEN = window.CONFIG?.MAPBOX_ACCESS_TOKEN || 'YOUR_TOKEN_HERE';
    const ch2freq = (c) => c === 1 ? 2412 : c === 2 ? 2417 : c === 3 ? 2422 : c === 4 ? 2427 : c === 5 ? 2432 : c === 6 ? 2437 : c === 7 ? 2442 : c === 8 ? 2447 : c === 9 ? 2452 : c === 10 ? 2457 : c === 11 ? 2462 : c === 12 ? 2467 : c === 13 ? 2472 : c === 14 ? 2484 : c === 36 ? 5180 : c === 40 ? 5200 : c === 44 ? 5220 : c === 48 ? 5240 : c === 52 ? 5260 : c === 56 ? 5280 : c === 60 ? 5300 : c === 64 ? 5320 : c === 100 ? 5500 : c === 104 ? 5520 : c === 108 ? 5540 : c === 112 ? 5560 : c === 116 ? 5580 : c === 120 ? 5600 : c === 124 ? 5620 : c === 128 ? 5640 : c === 132 ? 5660 : c === 136 ? 5680 : c === 140 ? 5700 : c === 144 ? 5720 : c === 149 ? 5745 : c === 153 ? 5765 : c === 157 ? 5785 : c === 161 ? 5805 : c === 165 ? 5825 : c === 169 ? 5845 : c === 173 ? 5865 : c === 177 ? 5885 : 0;
    const toGHz = (f) => {if (!f || f <= 0) return ''; const ghz = f / 1000; return ghz.toFixed(3).replace(/\.000$/, '') + ' GHz';};
    const normMac = (m) => m ? m.toUpperCase().replace(/[^0-9A-F]/g, '').match(/.{1,2}/g)?.join(':') || m : '';
    const toDMS = (coord, isLat) => { const absCoord = Math.abs(coord); const deg = Math.floor(absCoord); const minFloat = (absCoord - deg) * 60; const min = Math.floor(minFloat); const sec = ((minFloat - min) * 60).toFixed(2); const dir = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W'); return `${deg}°${min}'${sec}" ${dir}`; };
    const toFeet = (m) => { const ft = m * 3.28084; return ft.toFixed(2); };
    const signalClass = (signal) => { if (signal >= -50) return 'signal-strong'; if (signal >= -70) return 'signal-medium'; return 'signal-weak'; };
    const calculateSignalRange = (signalDbm, frequencyMhz, zoom) => {
        if (!signalDbm || signalDbm === null) return 50;

        // Create cache key
        const cacheKey = `${signalDbm}_${frequencyMhz}_${Math.round(zoom * 10)}`;
        if (radiusCache.has(cacheKey)) {
            return radiusCache.get(cacheKey);
        }

        // Convert frequency string to number if needed
        let freq = frequencyMhz;
        if (typeof freq === 'string') {
            freq = parseFloat(freq.replace(' GHz', '')) * 1000;
        }
        if (!freq || freq <= 0) freq = 2437; // Default to channel 6 (2.4GHz)

        // Simplified calculation for better performance
        let distanceM;
        if (signalDbm >= -30) distanceM = 10;
        else if (signalDbm >= -50) distanceM = 50;
        else if (signalDbm >= -70) distanceM = 150;
        else if (signalDbm >= -80) distanceM = 300;
        else distanceM = 500;

        // Frequency adjustment (simplified)
        if (freq > 5000) distanceM *= 0.6;
        else distanceM *= 0.8;

        // Fast pixel conversion
        const pixelsPerMeter = Math.pow(2, zoom - 12) * 0.1;
        let radiusPixels = distanceM * pixelsPerMeter;

        // Zoom scaling
        const zoomScale = Math.pow(1.15, zoom - 10);
        radiusPixels *= Math.min(zoomScale, 4);

        // Clamp radius
        radiusPixels = Math.max(3, Math.min(radiusPixels, 250));

        // Cache result
        radiusCache.set(cacheKey, radiusPixels);
        if (radiusCache.size > 1000) {
            radiusCache.clear(); // Prevent memory leaks
        }

        return radiusPixels;
    };
    const wifiIcon = (color) => `<svg class="protocol-icon" viewBox="0 0 24 24" fill="${color}" stroke="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>`;
    const formatDisplayTime = (isoString) => { if (!isoString) return ''; try { const date = new Date(isoString); if (isNaN(date.getTime())) { const parts = isoString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/); if (parts) { const customDate = new Date(parts[1], parseInt(parts[2], 10) - 1, parts[3], parts[4], parts[5], parts[6]); if (!isNaN(customDate.getTime())) return customDate.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }); } return ''; } return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }); } catch (e) { console.error("Error formatting date:", e, isoString); return ''; } };
    const BASE_HUES = [0, 60, 120, 180, 240, 270, 300, 330];
    const stringToHash = (str) => { let hash = 0; for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); hash |= 0; } return Math.abs(hash); };
    const macColor = (mac) => { if (!mac || mac.length < 6) return '#999999'; const cleanedMac = mac.replace(/[^0-9A-F]/gi, ''); if (cleanedMac.length < 6) return '#999999'; const oui = cleanedMac.substring(0, 6); const devicePart = cleanedMac.substring(6); const hue = BASE_HUES[stringToHash(oui) % BASE_HUES.length]; let saturation = 50 + (stringToHash(devicePart) % 41); let lightness = 40 + (stringToHash(devicePart) % 31); return `hsl(${hue}, ${saturation}%, ${lightness}%)`; };

    // --- map.js ---
    let map;
    let uid = 0;
    const rawFeatures = [];
    const hiddenKeys = new Set();
    const groupData = {};
    let orderedGroupKeys = [];
    const uniqueKeys = new Set();
    const lastFreqByMac = {};
    let show3dBuildings = false;
    let jitterEnabled = true;
    let allNetsHidden = false;
    let debounceTimer = null;
    let lastZoom = 3;
    let radiusCache = new Map();
    const MAP_STYLES = [ { id: 'dawn', label: 'Dawn', style: 'mapbox://styles/mapbox/standard', lightPreset: 'dawn' }, { id: 'day', label: 'Day', style: 'mapbox://styles/mapbox/standard', lightPreset: 'day' }, { id: 'dusk', label: 'Dusk', style: 'mapbox://styles/mapbox/standard', lightPreset: 'dusk' }, { id: 'night', label: 'Night', style: 'mapbox://styles/mapbox/standard', lightPreset: 'night' } ];
    let styleIndex = 0;
    const CLUSTER_MAX_ZOOM = 14;

    function pushSight(d, parent) {
        const lat = d.trilat || d.latitude, lon = d.trilong || d.longitude;
        if (typeof lat !== 'number' || typeof lon !== 'number') return;
        const mac = parent ? normMac(parent) : normMac(d.netid || d.netId || d.networkId);
        const ssid = d.ssid ?? '(hidden)';
        const deKey = `${mac}|${ssid}|${lat}|${lon}|${d.time || d.lastupd || d.lastdate}`;
        if (uniqueKeys.has(deKey)) return;
        uniqueKeys.add(deKey);
        let f = d.frequency > 0 ? d.frequency : 0;
        if (!f && d.channel) f = ch2freq(d.channel);
        if (!f && lastFreqByMac[mac]) f = lastFreqByMac[mac];
        if (f) lastFreqByMac[mac] = f;
        rawFeatures.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [lon, lat] }, properties: { uid: uid++, mac, ssid, freq: f ? toGHz(f) : '', colour: macColor(mac), signal: d.signal !== undefined ? +d.signal : null, alt: d.alt, encryptionValue: d.encryptionValue || d.encryption || '', lastdate: d.lastdate || d.lastupd || '', time: d.time, lastupd: d.lastupd, lat: lat, lon: lon, key: `${mac}_${ssid}` } });
    }
    function harvest(obj,parent=null){ if(!obj)return; if(Array.isArray(obj)){obj.forEach(o=>harvest(o,parent));return;} if(obj.results){obj.results.forEach(r=>harvest(r,parent));return;} if(obj.locationClusters){const m=normMac(obj.networkId||obj.netid||obj.netId||parent);obj.locationClusters.forEach(c=>harvest(c.locations,m));return;} if(obj.locationData){obj.locationData.forEach(ld=>pushSight(ld,parent));return;} pushSight(obj,parent); }
    
    function regroup() {
        Object.keys(groupData).forEach(k => delete groupData[k]);
        orderedGroupKeys = [];
        rawFeatures.forEach(f => {
            const k = f.properties.key;
            if (!groupData[k]) {
                groupData[k] = { ...f.properties, seen: 0 };
                orderedGroupKeys.push(k);
            }
            groupData[k].seen++;
        });
        orderedGroupKeys.sort((a, b) => {
            const macA = groupData[a].mac;
            const macB = groupData[b].mac;
            return macA.localeCompare(macB);
        });
    }

    function drawLegend(){ const lg=document.getElementById('legend'); lg.querySelectorAll('.legend-item').forEach(n=>n.remove()); for(const k of orderedGroupKeys){ const g=groupData[k]; const row=document.createElement('div');row.className='legend-item'; row.innerHTML=`<span class="mac" style="color:${g.colour}">${g.mac}</span><span class="wifi-name">${g.ssid}</span><span class="frequency">${g.freq}</span><span class="seen">${g.seen}</span>`; row.onclick=()=>{hiddenKeys.has(k)?hiddenKeys.delete(k):hiddenKeys.add(k);row.style.opacity=hiddenKeys.has(k)?.3:1;applyFilter();setTimeout(autoFitBounds,200);}; row.style.opacity=hiddenKeys.has(k)?.3:1; lg.appendChild(row); } }
    function flyToVisible(){ const vis=rawFeatures.filter(f=>!hiddenKeys.has(f.properties.key)); if(!vis.length){map.flyTo({center:[-83.6875,43.0125],zoom:10});return;} const coords=vis.map(f=>f.geometry.coordinates); const bounds=coords.reduce((b,c)=>b.extend(c),new mapboxgl.LngLatBounds(coords[0],coords[0])); map.fitBounds(bounds,{padding:100,duration:1000,maxZoom:16}); }

    function autoFitBounds(){ if(!rawFeatures.length)return; const vis=rawFeatures.filter(f=>!hiddenKeys.has(f.properties.key)); if(!vis.length)return; const coords=vis.map(f=>f.geometry.coordinates); if(coords.length===1){map.flyTo({center:coords[0],zoom:15,duration:800});return;} const bounds=coords.reduce((b,c)=>b.extend(c),new mapboxgl.LngLatBounds(coords[0],coords[0])); map.fitBounds(bounds,{padding:80,duration:600,maxZoom:17}); }
    
    function getJitteredData(features) {
        if (!jitterEnabled) {
            return features;
        }
        const jitteredFeatures = [];
        const pointGroups = new Map();
        const zoom = map.getZoom();

        if (zoom <= CLUSTER_MAX_ZOOM) {
            return features;
        }

        features.forEach(feature => {
            const key = feature.geometry.coordinates.join(',');
            if (!pointGroups.has(key)) {
                pointGroups.set(key, []);
            }
            pointGroups.get(key).push(feature);
        });

        pointGroups.forEach(group => {
            if (group.length > 1) {
                const centerCoords = group[0].geometry.coordinates;
                const centerPoint = map.project(centerCoords);
                const count = group.length;
                const radius = 2 + (count * 0.5) * (20 / zoom);
                const angleStep = (2 * Math.PI) / count;

                group.forEach((feature, i) => {
                    const angle = i * angleStep;
                    const newPoint = {
                        x: centerPoint.x + radius * Math.cos(angle),
                        y: centerPoint.y + radius * Math.sin(angle)
                    };
                    const newLngLat = map.unproject(newPoint);
                    
                    const newFeature = JSON.parse(JSON.stringify(feature));
                    newFeature.geometry.coordinates = [newLngLat.lng, newLngLat.lat];
                    jitteredFeatures.push(newFeature);
                });
            } else {
                jitteredFeatures.push(group[0]);
            }
        });

        return jitteredFeatures;
    }

    function applyFilter() {
        let visibleFeatures = rawFeatures.filter(f => !hiddenKeys.has(f.properties.key));
        let processedFeatures = getJitteredData(visibleFeatures);

        // Only recalculate radius if zoom changed significantly
        if (map) {
            const zoom = map.getZoom();
            const zoomDiff = Math.abs(zoom - lastZoom);

            if (zoomDiff > 0.5 || !processedFeatures[0]?.properties.calculatedRadius) {
                processedFeatures = processedFeatures.map(f => {
                    const radius = calculateSignalRange(f.properties.signal, f.properties.freq, zoom);
                    f.properties.calculatedRadius = radius;
                    return f;
                });
                lastZoom = zoom;
            }
        }

        const collection = { type: 'FeatureCollection', features: processedFeatures };
        if (map && map.getSource('wifi')) {
            map.getSource('wifi').setData(collection);
        }
    }

    const debouncedApplyFilter = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyFilter, 100);
    };

    function toggleAllNets() {
        allNetsHidden = !allNetsHidden;
        if (allNetsHidden) {
            orderedGroupKeys.forEach(key => hiddenKeys.add(key));
        } else {
            hiddenKeys.clear();
        }
        document.getElementById('toggle-all-nets-btn').classList.toggle('all-hidden', allNetsHidden);
        drawLegend();
        applyFilter();
        setTimeout(autoFitBounds, 300);
    }

    function add3dBuildings(){ if(!map.getLayer('3d-buildings')){ const firstSymbolLayer = map.getStyle().layers.find(layer => layer.type === 'symbol'); map.addLayer({'id':'3d-buildings','source':'composite','source-layer':'building','filter':['==','extrude','true'],'type':'fill-extrusion','minzoom':15,'paint':{'fill-extrusion-color':'#aaa','fill-extrusion-height':['interpolate',['linear'],['zoom'],15,0,15.05,['get','height']],'fill-extrusion-base':['interpolate',['linear'],['zoom'],15,0,15.05,['get','min_height']],'fill-extrusion-opacity':0.6}},firstSymbolLayer ? firstSymbolLayer.id : undefined); } }
    function remove3dBuildings(){if(map.getLayer('3d-buildings')){map.removeLayer('3d-buildings');}}
    function toggle3dBuildings(buttonElement){ show3dBuildings=!show3dBuildings; if(show3dBuildings){add3dBuildings();map.setTerrain({'source':'mapbox-dem','exaggeration':1.5});buttonElement.classList.add('active');} else{remove3dBuildings();map.setTerrain(null);buttonElement.classList.remove('active');} }
    function toggleJitter(buttonElement){ jitterEnabled=!jitterEnabled; buttonElement.classList.toggle('active', jitterEnabled); applyFilter(); }

    function addWifiLayers(){ if(map.getLayer('clust'))map.removeLayer('clust'); if(map.getLayer('clust-count'))map.removeLayer('clust-count'); if(map.getLayer('pts'))map.removeLayer('pts'); if(map.getLayer('hover'))map.removeLayer('hover'); if(map.getSource('wifi'))map.removeSource('wifi'); map.addSource('wifi',{type:'geojson',data:{type:'FeatureCollection',features:[]},cluster:true,clusterRadius:35,clusterMaxZoom: CLUSTER_MAX_ZOOM}); map.addLayer({id:'clust',type:'circle',source:'wifi',filter:['has','point_count'],paint:{'circle-color':['step',['get','point_count'],'#444',10,'#2081ff',25,'#e5533d'],'circle-radius':['step',['get','point_count'],12,10,18,25,24]}}); map.addLayer({id:'clust-count',type:'symbol',source:'wifi',filter:['has','point_count'],layout:{'text-field':'{point_count_abbreviated}','text-size':11},paint:{'text-color':'white'}}); map.addLayer({id:'pts',type:'circle',source:'wifi',filter:['!',['has','point_count']],paint:{'circle-radius':5,'circle-color':['get','colour'],'circle-stroke-color':'#111','circle-stroke-width':1}}); map.addSource('wifi',{type:'geojson',data:{type:'FeatureCollection',features:[]},cluster:true,clusterRadius:35,clusterMaxZoom: CLUSTER_MAX_ZOOM}); map.addLayer({id:'clust',type:'circle',source:'wifi',filter:['has','point_count'],paint:{'circle-color':['step',['get','point_count'],'#444',10,'#2081ff',25,'#e5533d'],'circle-radius':['step',['get','point_count'],12,10,18,25,24]}}); map.addLayer({id:'clust-count',type:'symbol',source:'wifi',filter:['has','point_count'],layout:{'text-field':'{point_count_abbreviated}','text-size':11},paint:{'text-color':'white'}}); map.addLayer({id:'pts',type:'circle',source:'wifi',filter:['!',['has','point_count']],paint:{'circle-radius':5,'circle-color':['get','colour'],'circle-stroke-color':'#111','circle-stroke-width':1}}); map.addLayer({id:'hover',type:'circle',source:'wifi',filter:['==','uid',-1],paint:{'circle-radius':['case',['!=',['get','signal'],null],['get','calculatedRadius'],20],'circle-color':['get','colour'],'circle-opacity':.15,'circle-stroke-color':['get','colour'],'circle-stroke-width':2,'circle-stroke-opacity':0.4}}); if(show3dBuildings){add3dBuildings();} 
        map.on('click', 'clust', (e) => { const features = map.queryRenderedFeatures(e.point, { layers: ['clust'] }); const clusterId = features[0].properties.cluster_id; map.getSource('wifi').getClusterExpansionZoom(clusterId, (err, zoom) => { if (err) return; map.easeTo({ center: features[0].geometry.coordinates, zoom: zoom }); }); });
        map.on('click','pts',e=>{ const p=e.features[0].properties,c=e.features[0].geometry.coordinates;let html=`<div class="tooltip"><div class="ssid"><span style="color:${p.colour}">${p.ssid||'(hidden)'}</span>${wifiIcon(p.colour)}</div>`;if(p.mac&&typeof p.mac==='string'&&p.mac.trim()){html+=`<div class="tech-data"><span class="label">MAC:</span><span class="value">${p.mac}</span></div>`;}if(p.freq&&typeof p.freq==='string'&&p.freq.trim()){html+=`<div class="tech-data"><span class="label">Frequency:</span><span class="value">${p.freq}</span></div>`;}if(typeof p.signal==='number'&&!isNaN(p.signal)){html+=`<div class="tech-data"><span class="label">Signal:</span><span class="value ${signalClass(p.signal)}">${p.signal} dBm</span></div>`;}if(p.encryptionValue&&typeof p.encryptionValue==='string'&&p.encryptionValue.trim()){html+=`<div class="tech-data"><span class="label">Encryption:</span><span class="value">${p.encryptionValue.toUpperCase()}</span></div>`;}if((typeof p.lat==='number'&&isFinite(p.lat))||(typeof p.lon==='number'&&isFinite(p.lon))||(typeof p.alt==='number'&&isFinite(p.alt))){html+=`<div class="location-block">`;if(typeof p.lat==='number'&&isFinite(p.lat))html+=`<div class="tech-data"><span class="label">Lat:</span><span class="value">${toDMS(p.lat,true)}</span></div>`;if(typeof p.lon==='number'&&isFinite(p.lon))html+=`<div class="tech-data"><span class="label">Lon:</span><span class="value">${toDMS(p.lon,false)}</span></div>`;if(typeof p.alt==='number'&&isFinite(p.alt)){const altFeet=toFeet(p.alt);if(altFeet!==null)html+=`<div class="tech-data"><span class="label">Altitude:</span><span class="value">${altFeet} ft MSL</span></div>`;}html+=`</div>`;}let seenTime=p.time||p.lastupd;if(seenTime){const formattedTime=formatDisplayTime(seenTime);if(formattedTime){html+=`<div class="seen"><span class="seen-label">Seen:</span> ${formattedTime}</div>`;}}html+=`</div>`;new mapboxgl.Popup({closeButton:false}).setLngLat(c).setHTML(html).addTo(map);map.setFilter('hover',['==','uid',p.uid]);}); 
        map.on('mousemove','pts',e=>{const feature=e.features[0];const props=feature.properties;map.setFilter('hover',['==','uid',props.uid]);}); 
        map.on('mouseleave','pts',()=>map.setFilter('hover',['==','uid',-1])); 
    }
    class StyleSwitcherControl{onAdd(map){this._map=map;this._container=document.createElement('div');this._container.className='mapboxgl-ctrl mapboxgl-ctrl-group';this._button=document.createElement('button');this._button.className='time-icon';this._button.type='button';this._button.title='Change Time of Day';this._container.appendChild(this._button);this._button.addEventListener('click',()=>{styleIndex=(styleIndex+1)%MAP_STYLES.length;const currentStyle=MAP_STYLES[styleIndex];map.setStyle(currentStyle.style);map.once('style.load',()=>{if(currentStyle.lightPreset){map.setConfigProperty('basemap','lightPreset',currentStyle.lightPreset);}addWifiLayers();applyFilter();});});return this._container;}onRemove(){this._container.parentNode.removeChild(this._container);this._map=undefined;}}
    class JitterToggleControl{constructor(cb){this._toggleCallback=cb;this._button=null;}onAdd(map){this._map=map;this._container=document.createElement('div');this._container.className='mapboxgl-ctrl mapboxgl-ctrl-group';this._button=document.createElement('button');this._button.className='jitter-icon';this._button.type='button';this._button.title='Toggle Point Jitter';this._container.appendChild(this._button);if(jitterEnabled){this._button.classList.add('active');}this._button.addEventListener('click',()=>{this._toggleCallback(this._button);});return this._container;}onRemove(){this._container.parentNode.removeChild(this._container);this._map=undefined;this._button=null;}}
    class ThreeDToggleControl{constructor(cb){this._toggleCallback=cb;this._button=null;}onAdd(map){this._map=map;this._container=document.createElement('div');this._container.className='mapboxgl-ctrl mapboxgl-ctrl-group';this._button=document.createElement('button');this._button.className='threed-icon';this._button.type='button';this._button.title='Toggle 3D Buildings & Terrain';this._container.appendChild(this._button);if(show3dBuildings){this._button.classList.add('active');}this._button.addEventListener('click',()=>{this._toggleCallback(this._button);});return this._container;}onRemove(){this._container.parentNode.removeChild(this._container);this._map=undefined;this._button=null;}}
    function initMap(){ mapboxgl.accessToken=MAPBOX_ACCESS_TOKEN; map=new mapboxgl.Map({container:'map',style:MAP_STYLES[styleIndex].style,center:[-83.6875,43.0125],zoom:3, maxZoom: 20}); map.on('error', (e) => {console.error("Mapbox Error: " + e.error.message);}); map.on('style.load',()=>{map.setProjection('globe');map.setFog({});if(MAP_STYLES[styleIndex].lightPreset){map.setConfigProperty('basemap','lightPreset',MAP_STYLES[styleIndex].lightPreset);}addWifiLayers();applyFilter();if(show3dBuildings){add3dBuildings();map.setTerrain({'source':'mapbox-dem','exaggeration':1.5});}else{map.setTerrain(null);}map.resize();}); map.on('load',()=>{map.addSource('mapbox-dem',{'type':'raster-dem','url':'mapbox://mapbox.mapbox-terrain-dem-v1','tileSize':512,'maxzoom':14});const geocoder=new MapboxGeocoder({accessToken:MAPBOX_ACCESS_TOKEN,mapboxgl:mapboxgl,marker:true,container:'geocoder'});document.getElementById('geocoder').appendChild(geocoder.onAdd(map));map.addControl(new mapboxgl.NavigationControl(),'top-left');map.addControl(new StyleSwitcherControl(),'bottom-left');map.addControl(new JitterToggleControl(toggleJitter),'bottom-left');map.addControl(new ThreeDToggleControl(toggle3dBuildings),'bottom-left');setTimeout(()=>map.resize(),250);}); map.on('zoomend', applyFilter); map.on('zoom', debouncedApplyFilter); }

    // --- main.js ---
    document.addEventListener('DOMContentLoaded', () => {
        initMap();
        const sidebar=document.getElementById('sidebar'); const sidebarTab=document.getElementById('sidebar-tab');
        const toggleSidebar=()=>{sidebar.classList.toggle('open');sidebar.classList.toggle('stay-open');if(map){setTimeout(()=>map.resize(),300);}};
        sidebarTab.addEventListener('click',(e)=>{e.stopPropagation();toggleSidebar();});
        if(window.matchMedia("(min-width: 768px)").matches){sidebar.addEventListener('mouseenter',()=>{if(!sidebar.classList.contains('stay-open')){sidebar.classList.add('open');if(map)map.resize();}});sidebar.addEventListener('mouseleave',()=>{if(!sidebar.classList.contains('stay-open')){sidebar.classList.remove('open');if(map)map.resize();}});}
        const fileInput=document.getElementById('fileInput'); const fileStatus=document.getElementById('fileStatus');
        document.getElementById('toggle-all-nets-btn').addEventListener('click', toggleAllNets);
        fileInput.addEventListener('change',async(event)=>{ const files=event.target.files; if(files.length===0){fileStatus.textContent='No files selected.';return;} fileStatus.textContent=`Processing ${files.length} file(s)...`; rawFeatures.length=0;uniqueKeys.clear();hiddenKeys.clear();allNetsHidden=false;document.getElementById('toggle-all-nets-btn').classList.remove('all-hidden');uid=0; let newSightingsCount=0; const initialRawFeaturesLength=rawFeatures.length; for(const file of files){ try{ const text=await file.text(); const parsedData=JSON.parse(text); let featuresToProcess=[]; if(parsedData.type==='FeatureCollection'&&Array.isArray(parsedData.features)){featuresToProcess=parsedData.features;}else if(parsedData.type==='Feature'&&parsedData.geometry){featuresToProcess=[parsedData];}else{harvest(parsedData);} featuresToProcess.forEach(geoJsonFeature=>{ if(geoJsonFeature.geometry&&geoJsonFeature.geometry.type==='Point'&&geoJsonFeature.geometry.coordinates){ const[lon,lat,geoJsonAlt]=geoJsonFeature.geometry.coordinates; const props=geoJsonFeature.properties||{}; const mac=normMac(props.bssid||'UNKNOWN'); const ssid=props.ssid||'(hidden)'; let f=props.frequency_mhz; if(!(f&&typeof f==='number')){if(props.channel)f=ch2freq(props.channel);} if(!f&&lastFreqByMac[mac])f=lastFreqByMac[mac]; if(f)lastFreqByMac[mac]=f; const timestampValue=props.timestamp; let formattedTimestamp=''; if(timestampValue){if(typeof timestampValue==='number'){formattedTimestamp=new Date(timestampValue).toISOString();}else{formattedTimestamp=timestampValue;}} let altitude=null; if(typeof geoJsonAlt==='number'&&isFinite(geoJsonAlt)){altitude=geoJsonAlt;}else if(typeof props.altitude==='number'&&isFinite(props.altitude)){altitude=props.altitude;} const encryptionValue=props.encryption||''; const deKey=`${mac}|${ssid}|${lat}|${lon}|${formattedTimestamp}`; if(uniqueKeys.has(deKey))return; uniqueKeys.add(deKey); rawFeatures.push({type:'Feature',geometry:{type:'Point',coordinates:[lon,lat]},properties:{uid:uid++,mac:mac,ssid:ssid,freq:f?toGHz(f):'',colour:macColor(mac),signal:typeof props.signal_dbm==='number'?props.signal_dbm:null,alt:altitude,encryptionValue:encryptionValue,lastdate:formattedTimestamp,time:formattedTimestamp,lastupd:formattedTimestamp,lat:lat,lon:lon,key:`${mac}_${ssid}`}}); } }); }catch(error){console.error(`Error processing file ${file.name}:`,error);fileStatus.textContent=`Error processing ${file.name}.`;continue;} } newSightingsCount=rawFeatures.length-initialRawFeaturesLength; regroup();drawLegend();applyFilter();flyToVisible(); if(newSightingsCount>0){fileStatus.textContent=`Loaded ${newSightingsCount} new sighting(s). Total: ${rawFeatures.length}.`;}else{fileStatus.textContent=`No new sightings added. Total: ${rawFeatures.length}.`;} event.target.value=''; });
    });
  </script>
</body>
</html>
