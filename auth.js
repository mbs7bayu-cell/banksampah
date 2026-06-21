const user = localStorage.getItem("user");

if(!user){
  window.location.href = "index.html";
}

window.logout = function() {
  localStorage.removeItem("user");
  localStorage.removeItem("lastActivity");
  showToast("Session habis, silakan login lagi");
   setTimeout(() => {
window.location.href = "index.html";  }, 2000); 
}

function showToast(msg) {
  const div = document.createElement("div");
  div.innerText = msg;

  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.left = "50%";
  div.style.transform = "translateX(-50%)";
  div.style.background = "#333";
  div.style.color = "#fff";
  div.style.padding = "10px 20px";
  div.style.borderRadius = "8px";
  div.style.zIndex = "9999";

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
}