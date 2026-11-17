import {referencePhotos} from './reference-photos.mjs';
import {whiteModels} from './white-model-config.mjs';
export const sources = {
  unesco: {label:'UNESCO · 平遥古城',url:'https://whc.unesco.org/en/list/812/'},
  plan: {label:'平遥古城 Conservation Detailed Plan',url:'https://www.sxghy.cn/detail/index/21?detailId=234'},
};
const hot = (title, body, focus) => ({title,body,focus,source:'plan'});
export const landmarks = [
  {id:'gate',name:'迎薰门城墙',short:'迎薰门',theme:'Defence and Boundaries',tag:'Understand a city through its gates',map:[51,85],featured:true,
    image:'assets/city-wall.jpg',imageLabel:'Reference photo of 平遥 city wall · not necessarily a view of 迎薰门',credit:'Gisling · CC BY 3.0 · Wikimedia Commons',template:'wall',
    question:'How do gates, walls and streets connect?',intro:'Start at the city boundary and see where defence meets everyday movement.',
    hotspots:[hot('More than an entrance','City gates connect the inside and outside. An outer enclosure adds a defensive layer. Look at the relationship between walls and entrances in this teaching model.',[0,0,2.5]),hot('Follow the street into town','Look from the gate towards the streets. Walls define the boundary, while streets connect different spaces of daily life.',[0,-1,-1])],
    discoveries:['A city gate is both an entrance and a defensive node.','Walls and streets work together to organise urban space.'],
    qa:[['Why is there another enclosure outside the gate?','This outer enclosure, known as a barbican, forms part of the gate defences. Entering the city becomes a layered sequence rather than a single doorway.'],['How should I look at this model?','Start with the enclosure, then the entrances and the streets into town. This model explains relationships, not actual building dimensions.']]},
  {id:'tower',name:'市楼',short:'市楼',theme:'Markets and Orientation',tag:'Find your bearings in the streets',map:[51,38],featured:false,
    image:'assets/journey-art-v2/tower.png',imageLabel:'Teaching illustration of 市楼 · not a photograph',credit:'Photo-referenced AI teaching illustration, revised 2026-10-29',template:'tower',
    question:'How can a tower become a street landmark?',intro:'Place the building back in its street and consider its relationship with people passing by.',
    hotspots:[hot('A landmark in the street','市楼 is a major landmark of 平遥古城. Looking at its streets and pedestrian activity helps explain urban life better than viewing an isolated tower.',[0,1,0]),hot('The market beyond the building','Shops, streets and public activity form the marketplace. Imagine activity around this landmark, but do not treat illustrated details as survey evidence.',[2,-1,0])],
    discoveries:['To understand 市楼, look at the surrounding streets too.','Landmarks can help people find their way.'],
    qa:[['Why view 市楼 together with its street?','A landmark gains meaning from its surroundings. Look at the tower, streets and activities together to understand why it is visible and memorable.'],['Can the illustration serve as a real building reference?','No. This imagined teaching illustration guides observation. Exact dimensions, locations and structures require reliable surveys or real-world references.']]},
  {id:'rishengchang',name:'日昇昌',short:'日昇昌',theme:'Remittance and Trust',tag:'See distant connections through a courtyard',map:[32,29],featured:true,personSlot:true,
    image:'assets/user-scenes/ticket-office.jpg',imageLabel:'User-provided remittance-house scene · capture details pending',credit:'Provided and authorised by the user for this project',template:'ticket',
    question:'How did a remittance-house courtyard connect distant businesses?',intro:'Use a visible courtyard to understand invisible networks of remittance and trust.',
    hotspots:[hot('Enter the remittance house','Remittance houses depended on people, ledgers and information. Observe the gatehouse and successive courtyards: why separate reception from internal work?',[0,0,2.5]),hot('An invisible network','The financial and commercial history of 平遥 forms part of its World Heritage value. Remittances linked payments across places, making trust and bookkeeping networks essential.',[-2,0,0])],
    discoveries:['A remittance house connects distant businesses, not just courtyards.','Ledgers and trust are key to understanding remittance houses.'],
    qa:[['Why did remittance houses need trust?','Long-distance remittance required cooperation across places. Accepting and redeeming drafts depended on trust in the institution and its accounting network.'],['What can this layout tell us?','Look at the separation of reception and internal work. The model uses successive courtyards to explain spatial layers, not to reconstruct the actual rooms of 日昇昌.']]},
  {id:'yamen',name:'县衙',short:'县衙',theme:'County Government and Public Life',tag:'Read spatial order in courtyards',map:[25,65],featured:true,
    image:'assets/user-scenes/county-yamen.jpg',imageLabel:'User-provided 县衙 scene',credit:'User-provided; capture and attribution details pending',template:'yamen',
    question:'Why separate front and back, inside and outside?',intro:'Observe the layers between public affairs and internal living spaces.',
    hotspots:[hot('Look along the central axis','县衙 relates to historical county government. Follow gates, courtyards and main halls to consider how a layout organises entry and gathering.',[0,0,0]),hot('Public and internal spaces','Different spaces support different activities. Simplified volumes distinguish front administrative areas from internal areas, not a complete account of actual room functions.',[0,0,-3])],
    discoveries:['Successive courtyards can express different uses.','Understand 县衙 by comparing public and internal spaces.'],
    qa:[['Why observe the central axis?','An axis helps reveal the sequence of entrances, courtyards and main buildings: a clue to spatial order.'],['Can the teaching model be taken as the actual layout?','No. It explains spatial layers. Actual layouts and room functions require reliable references.']]},
  {id:'escort',name:'同兴公镖局',short:'同兴公镖局',theme:'Escorts and Trade Routes',tag:'Safety and cooperation behind commerce',map:[51,56],featured:false,
    image:'assets/user-scenes/escort-agency.jpg',imageLabel:'User-provided escort-agency scene',credit:'User-provided; capture and attribution details pending',template:'escort',
    question:'What does a long journey need besides money and goods?',intro:'Connect trade with transport, safety and cooperation.',
    hotspots:[hot('Inside and outside the gate','Use the escort agency to consider how preparations inside the courtyard related to protection on trade journeys. This is an industry-level teaching interpretation.',[0,0,2]),hot('Cooperation on trade routes','Travel involved routes, people and safety as well as goods. The teaching narrative does not describe a specific historical event.',[2,-1,0])],
    discoveries:['Trade also depends on transport, safety and cooperation.','A courtyard can connect to distant trade routes.'],
    qa:[['Why include an escort agency in this journey?','It reveals another side of trade: moving people and goods requires organisation and safety. Compare this with the remittance-house theme.'],['Are these stories about real historical individuals?','These are industry-level teaching themes, not the biography of a specific escort or invented events presented as facts.']]},
  {id:'temple',name:'文庙',short:'文庙',theme:'Ritual and Education',tag:'Read order between gates and courtyards',map:[78,68],featured:false,
    image:'assets/journey-art-v2/temple.png',imageLabel:'Teaching illustration of 文庙 · not a photograph',credit:'Photo-referenced AI teaching illustration, revised 2026-10-29',template:'temple',
    question:'Can the sequence of gates, courtyards and halls change how a space feels?',intro:'Observe successive architectural layers to explore ritual and educational spaces.',
    hotspots:[hot('From gate to hall','文庙 relates to ritual and education. Gates, courtyards and principal halls offer clues to reading ritual space.',[0,0,2]),hot('A sequence of spaces','Symmetry and progression shape the rhythm of entering a space, not just its appearance. The illustration and model express this observation only.',[0,0,-2])],
    discoveries:['Gates, courtyards and halls create a sequence of experiences.','文庙 relates to ritual and education.'],
    qa:[['Why observe the sequence of courtyards?','The sequence shapes how people enter, pause and approach the main building, helping us understand layers of ritual space.'],['Was 文庙 only for education?','No. It also relates to worship and ritual. Consider these cultural meanings together.']]},
];
for(const landmark of landmarks)Object.assign(landmark,referencePhotos[landmark.id]);
export const ids = landmarks.map(x=>x.id);
export const getLandmark = id => landmarks.find(x=>x.id===id);
export const MAP_IMAGE = 'assets/illustrations/pingyao-handdrawn-map.png';
// The postcard retains its teaching illustration. The route page uses an actual photograph.
export const aerial = {
  image:'assets/pingyao-aerial-2019.jpg',
  title:'平遥古城 Aerial Panorama',
  alt:'Real aerial panorama from south of 平遥古城, with walls and gates in the foreground and streets extending into the city',
  author:'Chensiyuan',date:'2019-10-11',
  source:'https://commons.wikimedia.org/wiki/File:1_pingyao_ancient_city_aerial_pano_2019.jpg',
  license:'https://creativecommons.org/licenses/by-sa/4.0/',
};
export const GUIDE_IMAGE = 'assets/avatar/guide-sprite.png';
export const demoConfig = {version:4, featuredIds:landmarks.filter(x=>x.featured).map(x=>x.id), guide:{mode:'demo', provider:null}, character:{modelUrl:null,landmarkId:null,identity:null}};
export function assetConfig(id) {
  const l=getLandmark(id);
  const config={...whiteModels[id],template:l.template,hotspots:l.hotspots};
  if(config.variants)config.variants=config.variants.map((v,i)=>({...v,photo:referencePhotos[i===1?'courtyard':id]}));
  return config;
}
