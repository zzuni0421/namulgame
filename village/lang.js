const LANG = {
ko: {
welcome:'나물마을에 오신 것을 환영합니다!'
},
en: {
welcome:'Welcome to Namul Village!'
}
};
let CURRENT_LANG = 'ko';
function t(key){ return (LANG[CURRENT_LANG] && LANG[CURRENT_LANG][key]) || key; }
