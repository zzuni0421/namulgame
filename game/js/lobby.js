const API_URL = "https://script.google.com/macros/s/AKfycbyedTR5QJOGJJDycqd-Z2uB6Ql-3pwSY8tFq0r9PXYz8JDrJAstLbBbT9pklP5tTAa-Mw/exec";

async function register(username, password) {
  const res = await fetch(API_URL, {
    method:"POST",
    body: JSON.stringify({action:"register", username, password})
  });
  return res.json();
}

async function login(username, password) {
  const res = await fetch(API_URL, {
    method:"POST",
    body: JSON.stringify({action:"login", username, password})
  });
  return res.json();
}

async function checkSecret(username, code){
  const res = await fetch(API_URL,{
    method:"POST",
    body: JSON.stringify({action:"checkSecret", username, code})
  });
  return res.json();
}

async function saveScore(username, score){
  await fetch(API_URL,{
    method:"POST",
    body: JSON.stringify({action:"saveScore", username, score})
  });
}

async function saveMemory(username, memory){
  await fetch(API_URL,{
    method:"POST",
    body: JSON.stringify({action:"saveMemory", username, memory})
  });
}
