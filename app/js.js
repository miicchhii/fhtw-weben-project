function showPage(page) {
  switch (page) {
    case "home":
      document.getElementsByTagName("body");

      break;
    default:
      break;
  }
}

document.getElementById("body").innerHTML = `
    <div class="d-flex flex-column" style="height: 100vh">
      <div
        id="nav"
        class="border d-flex align-items-center flex-shrink-0"
        style="height: 80px"
      >
        
      </div>
      <div class="d-flex flex-grow-1">
        <div
          id="sidebar"
          class="border d-none d-md-flex flex-column flex-shrink-0"
          style="width: 16.666%"
        >
          
        </div>
        <div id="content" class="border d-flex flex-column flex-grow-1">
          
        </div>
      </div>
    </div>}    `;

document.getElementById("nav").innerHTML = "Navbar-Code";

document.getElementById("sidebar").innerHTML = "Sidebar-Code";

document.getElementById("content").innerHTML = "Content-Code";
