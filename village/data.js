// 데이터: 나물, 건물, 주민
const DATA = {
plants: [
{ id:'minari', name:{ko:'미나리',en:'Minari'}, baseProduction:1, sell:1, description:{ko:'초보 나물','en':'Starter plant'} },
{ id:'durup', name:{ko:'두릅',en:'Durup'}, baseProduction:5, sell:6, description:{ko:'힘이 나는 나물','en':'Powerful spring plant'} },
{ id:'gosari', name:{ko:'고사리',en:'Gosari'}, baseProduction:12, sell:18, description:{ko:'고급 나물','en':'Premium fern'} },
{ id:'ddeodeok', name:{ko:'더덕',en:'Ddeodeok'}, baseProduction:30, sell:50, description:{ko:'희귀한 나물','en':'Rare root'} }
],
buildings: [
{ id:'market', name:{ko:'시장',en:'Market'}, effect:{sellMultiplier:1.2}, price:100 },
{ id:'warehouse', name:{ko:'창고',en:'Warehouse'}, effect:{capacityBonus:100}, price:200 },
{ id:'research', name:{ko:'연구소',en:'Research Lab'}, effect:{prodMultiplier:1.15}, price:500 }
],
residents: [
{ id:'farmer', name:{ko:'농부',en:'Farmer'}, bonus:{prodAdd:2}, price:50},
{ id:'gardener', name:{ko:'정원사',en:'Gardener'}, bonus:{prodMul:1.1}, price:150}
],
events: [
{ id:'rain', name:{ko:'비',en:'Rain'}, desc:{ko:'비가 내려 성장속도 증가','en':'Rain boosts growth'}}
]
};
