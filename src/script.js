// This source code was written in 2023 and its maintaned at GitHub.com
// Last update in 2023

const COMMITS_ENDPOINT =
  "https://api.github.com/repos/gustavocodigo/graalcustoms/commits?per_page=20";

const CUSTOM_TAB_TYPE = {
  HEAD: "tab_head",
  BODY: "tab_body",
  MATCH: "tab_match",
  TERMS_OF_SERVICE: "tab_terms_of_service",
  UPDATES_CHANGELOGS: "tab_updates_changelogs",
};

const FILE_DOWNLOAD_TYPE = {
  HEAD: "filetype_head",
  BODY: "filetype_body",
};

const FILE_DOWNLOAD_TYPES_PREFIX = {
  HEAD: "head-",
  BODY: "body-",
  UNKNOWN: "unknown-",
};

const ALERT_TYPE = {
  HEAD: "alert_head",
  BODY: "alert_body",
};

const UP_TESTER_FILE_TYPE = {
  HEAD: "tester_head",
  BODY: "tester_body",
};

const NPC_TESTER_DEFAULT_BODY ="https://cdn.discordapp.com/attachments/1171693403654865007/1171707612207783996/olwest_personal_body_graal4937867-248.png?ex=655da8c0&is=654b33c0&hm=d8f18a506bccb564a74911a8f33ecaa1051d2ca4260670cc82ac287a3d3c8dcc&";
const NPC_TESTER_DEFAULT_HEAD = "";

const npc_tester_infor = {
  head: NPC_TESTER_DEFAULT_HEAD,
  body: NPC_TESTER_DEFAULT_BODY,
};

const MATCH_TYPE = {
  HEAD: "match_head",
  BODY: "match_body",
};

const cached_images = {
  heads: [],
  bodys: [],
  matches: [],
};


const cached_data = {
    commits_data: []
}

const runtime = {
  NORMAL_BROWSER: "runtime_normal",
  ANDROID_WEBVIEW: "runtime_android_webview",
};

const app = {
  VERSION: "0.0.2",
  MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD: 27,
  currentPage: CUSTOM_TAB_TYPE.HEAD,
  currentHeadPage: 0,
  currentBodyPage: 0,
  currentTotalPages: 0,
  displayTesterHeadInPreview: false,
  displayTesterBodyInPreview: false,
  runtime: runtime.NORMAL_BROWSER,
};

function put_version_on_dom() {
  const version_element = document.getElementById("version");
  if (version_element) version_element.innerText = `version ${app.VERSION}`;
  else console.error("Cannot find any element that store id version.");
}

function main() {
  put_version_on_dom();
  close_alert(ALERT_TYPE.HEAD);
  close_alert(ALERT_TYPE.BODY);
  set_aba(CUSTOM_TAB_TYPE.TERMS_OF_SERVICE);
}

function update_pagination(totalpages, selected) {
  app.currentTotalPages = totalpages;
  const divs = [];
  for (let index = 0; index < totalpages; index++) {
    if (selected == index) {
      divs.push(
        `<div id="selected-div" onclick="" style="background-color: #00000099; color: white; border-radius: 12px">${
          index + 1
        }</div>`
      );
    } else
      divs.push(
        `<div class="waves-effect waves-light" onclick="goto_page(${index}); update_pagination(${totalpages}, ${index})">${
          index + 1
        }</div>`
      );
  }
  const pagination_div = document.querySelector("#pagination-div");
  pagination_div.innerHTML = divs.join("");
  const selected_div = pagination_div.querySelector("#selected-div");
  if (selected_div) {
    selected_div.scrollIntoView({ behavior: "smooth" });
  } else {
    console.log("Could not get page");
  }

  //selected_div.scrollIntoView({ behavior: 'smooth' });
}

function extractFileNameFromURL(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname
      .substring(pathname.lastIndexOf("/") + 1)
      .split("?")[0];
    return fileName;
  } catch (error) {
    console.error("Erro ao analisar a URL: " + error);
    return null;
  }
}

function extractFileExtension(fileName) {
  try {
    const extension = fileName.split(".").pop();
    return extension.toLowerCase(); // Retorna a extensão em minúsculas, opcional
  } catch (error) {
    console.error("Erro ao extrair a extensão do arquivo: " + error);
    return null;
  }
}

function downloadFIle(url, nomeDoArquivo) {
  if (app.runtime == runtime.ANDROID_WEBVIEW) {
    if (typeof Android !== "undefined") {
      download_from_android_webview(url, nomeDoArquivo);
    } else {
      window.alert("Error android instance is not defined");
    }
    return;
  }
  if (nomeDoArquivo == null) {
    nomeDoArquivo = extractFileNameFromURL(url);
  }
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const urlBlob = URL.createObjectURL(blob);

      const linkTemporario = document.createElement("a");
      linkTemporario.href = urlBlob;
      linkTemporario.download = nomeDoArquivo || "download"; // Define o nome do arquivo para download, padrão é "download"

      // Simula um clique no link temporário para iniciar o download
      linkTemporario.click();
    })
    .catch((error) => {
      console.error("Ocorreu um erro ao baixar o arquivo:", error);
    });
}

function download_from_android_webview(url, name) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64Content = reader.result.split(",")[1];
        if (app.runtime == runtime.ANDROID_WEBVIEW) {
          Android.save_base64(
            base64Content,
            name + "." + extractFileExtension(extractFileNameFromURL(url))
          );
        }

        callback(base64Content);
      };
      reader.readAsDataURL(blob, name);
    })
    .catch((error) => {
      console.error("Xiii, deu ruim ao pegar o conteúdo em base64:", error);
    });
}

function show_test_upload_container() {
  document.querySelector("#upload-view").style.display = "flex";
  document.querySelector("#toggle-upload-tester-view").style.scale = "1";
}

function hide_test_upload_container() {
  document.querySelector("#upload-view").style.display = "none";
  document.querySelector("#toggle-upload-tester-view").style.scale = "-1";
}

function toggle_upload_button_click() {
  let show = document.querySelector("#upload-view").style.display != "none";

  if (show) {
    hide_test_upload_container();
  } else {
    show_test_upload_container();
  }
}

const IMAGE_DIMENSIONS = {
  HEAD: {
    width: 32,
    height: 560,
  },
  BODY: {
    width: 128,
    height: 720,
  },
};

function choose_window_file(event) {
  const fileInput = event.target;
  const files = fileInput.files;
  file_dropped(files);
}

function file_dropped(files) {
  if (files.length > 0) {
    const imagem = files[0];
    console.log(imagem);
    const imageUrl = URL.createObjectURL(imagem);

    var img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      if (
        width == IMAGE_DIMENSIONS.HEAD.width &&
        height == IMAGE_DIMENSIONS.HEAD.height
      ) {
        send_to_tester_directly(imageUrl, UP_TESTER_FILE_TYPE.HEAD);
        show_test_upload_container();
      } else if (
        width == IMAGE_DIMENSIONS.BODY.width &&
        height == IMAGE_DIMENSIONS.BODY.height
      ) {
        send_to_tester_directly(imageUrl, UP_TESTER_FILE_TYPE.BODY);
        show_test_upload_container();
      } else {
        alert("Invalid image dimensions: " + width + "x" + height + ".");
      }

      setTimeout(() => {}, 1000);
    };

    img.src = imageUrl;
  }
}

function drop_file(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
}

function drag_handler(event) {
  event.preventDefault();
}

// alert
let open_alert = (image_link, alert_type) => {};
let download_alert_click = (file_type) => {};
let open_alert_l = (image_link, alert_type) => {};
{
  document.addEventListener("DOMContentLoaded", () => {
    const aout = document.querySelector("#alert-out");
    const aoutbody = document.querySelector("#alert-out-body");

    aout.style.display = "none";
    let sprite = 0;

    let set_sprite = (spritep) => {
      sprite = spritep;
      if (sprite >= 4) sprite = 0;
      let stp = "-" + sprite * 32 + "px";
      head.style.top = stp;
    };
    const head = aout.querySelector("#head");
    const body = aoutbody.querySelector("#body");

    head.addEventListener("click", () => {
      sprite += 1;
      set_sprite(sprite);
    });

    let open_alert_l = (image_link, alert_type) => {
      if (alert_type == ALERT_TYPE.BODY) {
        aoutbody.style.display = "flex";
        const body = aoutbody.querySelector("#body");
        body.setAttribute("src", image_link);
      } else if (alert_type == ALERT_TYPE.HEAD) {
        set_sprite(2);
        aout.style.display = "flex";
        const head = aout.querySelector("#head");
        head.setAttribute("src", image_link);
        aout.querySelector("#head-preview").setAttribute("src", image_link);
      }
    };
    close_alert = (alert_type) => {
      if (alert_type == ALERT_TYPE.HEAD) {
        aout.style.display = "none";
      }
      if (alert_type == ALERT_TYPE.BODY) {
        aoutbody.style.display = "none";
      }
    };

    download_alert_click = (file_type) => {
      let url = undefined;
      let prefix = FILE_DOWNLOAD_TYPES_PREFIX.UNKNOWN;

      if (file_type == FILE_DOWNLOAD_TYPE.HEAD) {
        url = head.getAttribute("src");
        prefix = FILE_DOWNLOAD_TYPES_PREFIX.HEAD;
      }

      if (file_type == FILE_DOWNLOAD_TYPE.BODY) {
        url = body.getAttribute("src");
        prefix = FILE_DOWNLOAD_TYPES_PREFIX.BODY;
      }

      if (!url) {
        alert("No image");
        return;
      }

      downloadFIle(url, prefix + btoa(Math.random()));
    };

    open_alert = (link, type) => {
      console.log(link, type);
      setTimeout(() => {
        open_alert_l(link, type);
      }, 80);
    };
  });
}

function set_aba(page) {
  const heads = cached_images.heads;
  const bodys = cached_images.bodys;
  if (page == CUSTOM_TAB_TYPE.HEAD) {
    update_pagination(
      Math.ceil(heads.length / app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD),
      app.currentHeadPage
    );
  }
  if (page == CUSTOM_TAB_TYPE.BODY) {
    update_pagination(
      Math.ceil(bodys.length / app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD),
      app.currentBodyPage
    );
  }

  app.currentPage = page;
}

const macth_tab_element = () => `
    <div>
        <h2 class="flow-text">Choose an body or head then click in MATCH</h1>
        the potentially matches for the custom should appears here.
        <b>To download matched files long press on it or right click on desktop.
    </div>
    `;

const tos_tab_element = () => `
    <div>
    <div style="line-height: 1.5; padding: 7px">
        <h1 class="flow-text">Terms of services</h1>
        <p>This site aims to centralize hundreds of customizations into a single-page application</p>
        <br>
        <p style="word-wrap: break-word;">
        <b style="color:red">Attention</b> This website offers skins for download. Please be aware that some of these skins could be personal, potentially leading to conflicts if used without the owners' permission. It's advisable to only download skins widely used and recognized by numerous players to avoid direct conflicts with others.
        <br></br>
        <b>Please note</b> that the uploads are added automatically from the web, and distinguishing between personal and non-personal skins might be challenging."
        </p>

        <b>Tips to choose the Ideal upload</b>
        <div>
            <b>1</b> - choose uploads without watermark<br>
            <b>2</b> - if the water mark is a link then you can pick it :) this means was downloaded from a public website<br>
            <b>3</b> - have you seen atleast 4 players using it ? its probably public.<br>
        </div>

        <b>We are not responsable for any internal conflicts in game. choose graphics at you own risk</b>
        <p>If you <b>agree</b> you can continue using this aplication if not feel free to leave.</p>
        <br>
    </div>
    <div class="margin-left: auto; width: 100%">

     
    <button style="padding: 12px; display: block; margin-left: auto; " onclick="app.currentPage='head';set_aba(CUSTOM_TAB_TYPE.HEAD);goto_page(0)" class="agree-tos-button"> AGREE</button>

    </div>
    </div>`;

const updates_tab = async () => {
  try {
    let commits =[]
    if (cached_data.commits_data.length>0) {
        commits = cached_data.commits_data
    }else{
        // only will run 1 time
        commits = await (await fetch(COMMITS_ENDPOINT)).json();
        cached_data.commits_data = commits
    } 
    const cards = commits.map((commit) => {
      return `<div style="border: 1px solid gray; border-radius: 1px; padding: 8px; display: flex; align-items: center;"><img src="https://github.com/${commit.author.login}.png" width=64 height=64 alt="${commit.author.login}">
            <div>

            <a href="https://github.com/${commit.author.login}" target="_blank"><h4 class="flow-text"> ${commit.author.login}</h4></a>
            
         
            <div><b>commit:</b> ${commit.commit.message}</div>
            <p style="color: #101010; font-size: 0.6em;">${commit.commit.author.date}</p>
            
            </div>
            </div>`;
    });
    return `
        <div style="width: 100%;">
        <div><h1 style="margin-bottom: 10px;font-size: 0.7em;">UPDATES CHANGELOGS:</h1></div>
        <div style="display: flex; flex-direction: column; ">${cards.join(
          "\n"
        )}</div>
        </div>
        `;
  } catch (e) {
    console.log(e);
    return `<div>Could not load the updates page.</div>`;
  }
};

async function goto_page(page) {
  const selectedCOlor = "#d77a14";

  document.getElementById("button-head").style.border =
    "4px solid transparent";
  document.getElementById("button-body").style.border =
    "4px solid transparent";
  document.getElementById("button-match").style.border =
    "4px solid transparent";
  document.getElementById("button-terms_of_service").style.color = "#AAAAAA";
  document.getElementById("button-updates-tab").style.color = "#AAAAAA";

  update_pagination(app.currentTotalPages, page);
  if (app.currentPage == CUSTOM_TAB_TYPE.BODY) {
    goto_body(page);

    document.getElementById("button-body").style.borderBottom = "4px solid "+selectedCOlor;
  }
  if (app.currentPage == CUSTOM_TAB_TYPE.HEAD) {
    goto_head(page);

    document.getElementById("button-head").style.borderBottom = "4px solid "+selectedCOlor;
  }
  if (app.currentPage == CUSTOM_TAB_TYPE.MATCH) {
    document.querySelector("#uplist").innerHTML = macth_tab_element();
    update_pagination(0);
    document.getElementById("button-match").style.borderBottom = "4px solid "+selectedCOlor;
  }

  if (app.currentPage == CUSTOM_TAB_TYPE.TERMS_OF_SERVICE) {
    document.querySelector("#uplist").innerHTML = tos_tab_element();
    update_pagination(0);

    document.getElementById("button-terms_of_service").style.color = "white";
  }

  if (app.currentPage == CUSTOM_TAB_TYPE.UPDATES_CHANGELOGS) {
    document.getElementById("button-updates-tab").style.color = "white";
    document.querySelector("#uplist").innerHTML = await updates_tab();
    update_pagination(0);
  }

  document.querySelector("#uplist").scrollTop = 0;
}

function send_to_tester_directly(url, type) {
  if (type == UP_TESTER_FILE_TYPE.BODY) {
    document
      .querySelector("#upload-view")
      .querySelector("#body")
      .setAttribute("src", url);
    npc_tester_infor.body = url;
  } else if (type == UP_TESTER_FILE_TYPE.HEAD) {
    document
      .querySelector("#upload-view")
      .querySelector("#head")
      .setAttribute("src", url);
    npc_tester_infor.head = url;
  }
}

function send_to_tester(type) {
  if (type == UP_TESTER_FILE_TYPE.BODY) {
    const alert = document.querySelector("#alert-out-body");
    const body_url = alert.querySelector("#body").getAttribute("src");
    if (body_url) {
      send_to_tester_directly(body_url, type);
    } else {
      console.error("Could not get src attr  to send to tester");
    }
  } else if (type == UP_TESTER_FILE_TYPE.HEAD) {
    const alert = document.querySelector("#alert-out");
    const head_url = alert.querySelector("#head").getAttribute("src");
    if (head_url) {
      send_to_tester_directly(head_url, type);
    } else {
      console.error("Could not get src attr  to send to tester");
    }
  }

  show_test_upload_container();
}

function goto_body(page) {
  const bodys = cached_images.bodys;
  app.currentBodyPage = page;
  let uplist = document.getElementById("uplist");

  let html = "";

  const starting_page = page * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD;

  let bodys_n = bodys.slice(
    starting_page,
    (page + 1) * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD
  );

  html += bodys_n
    .map((element, index) => {
      return product_element_body(element, starting_page + index);
    })
    .join("");
  if (page + 1 < app.currentTotalPages) {
    html += `
        <div style="display: flex;height: 20px;margin-left: auto; margin-top: auto;margin-bottom: auto; cursor:pointer; position: relative; justify-content: center; align-items:center; color: white; background-color: var(--main-button-bgcolor);padding: 12px; font-size: 0.7em" onclick="goto_page(${
          app.currentBodyPage + 1
        })">
            NEXT
        </div>
        `;
  }

  uplist.innerHTML = html;
}

function isGifFile(fileName) {
  if (fileName.toLowerCase().endsWith(".gif")) {
    return true;
  }
  return false;
}

const product_element_head = (image_url, index_in_cache, is_gif) => `
    <div style=";display: flex; align-items: center; justify-content: center; width:calc(var(--elements-persent) - 10px);">
        <div style="height: 80px; cursor:pointer; position: relative; " onclick="open_alert(cached_images.heads[${index_in_cache}], ALERT_TYPE.HEAD )" class="hoverdark waves-effect waves-light">
        
       
            <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; ">
                <img id="body" style="position:relative; left: -64px" alt="" draggable="false"  src="${
                  app.displayTesterHeadInPreview
                    ? npc_tester_infor.head
                    : NPC_TESTER_DEFAULT_BODY
                }" cache-control="max-age=604800">
            </div>
            <div style="width: 32px; height: 31px; overflow: hidden; margin: 32px; scale: 1.2;position: relative; top: -80px;">
                <div id="loading" style="position:absolute; width:32px; height:32px;" class="head-img-loading"> </div>
                <img id="head" style="position:absolute; top: -64px" alt="" src="${image_url}" draggable="false" cache-control="max-age=604800" onload="this.parentNode.querySelector('#loading').style.display='none'">
            </div>

            <div>
        <h1 style="position:absolute; top: 0; left: 0; font-size: 12px; margin: 4px;">${
          is_gif ? "GIF" : "PNG"
        }</h1>
        </div>
           
        </div>
    </div>
`;

const product_element_body = (image_url, index_in_cache) => `
<div style=";display: flex; align-items: center; justify-content: center; width:calc(var(--elements-persent) - 10px);">
    <div style="height: 80px; cursor:pointer" onclick="open_alert(cached_images.bodys[${index_in_cache}], ALERT_TYPE.BODY)" class="hoverdark waves-effect waves-light">
        <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; " onerror="alert(0)">
            <div id="loading" style="position:absolute; width:32px; height:32px;" class="body-img-loading"> </div>
            <img id="body" alt="" style="position:relative; left: -64px"  src="${image_url}" draggable="false" cache-control="max-age=604800" onload="this.parentNode.querySelector('#loading').style.display='none'">
        </div>
        <div style="width: 32px; height: 31px; overflow: hidden; margin: 32px; scale: 1.2;position: relative; top: -80px " cache-control="max-age=604800" >
            <img id="head" alt="" style="position:absolute; top: -64px" draggable="false" src="${
              app.displayTesterHeadInPreview ? npc_tester_infor.head : ""
            }">
        </div>
    </div>
</div>
`;

function goto_head(page) {
  const heads = cached_images.heads;

  app.currentHeadPage = page;
  let html = "";
  const starting_page = page * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD;
  let heads_sliced = heads.slice(
    starting_page,
    (page + 1) * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD
  );
  html += heads_sliced
    .map((element, index) => {
      if (!element) return;
      const gif = isGifFile(extractFileNameFromURL(element));
      return product_element_head(element, starting_page + index, gif);
    })
    .join("");

  if (page + 1 < app.currentTotalPages) {
    html += `
    <div style="display: flex;height: 20px;margin-left: auto; margin-top: auto;margin-bottom: auto; cursor:pointer; position: relative; justify-content: center; align-items:center; color: white; background-color: var(--main-button-bgcolor); padding: 12px; font-size: 0.7em" onclick="goto_page(${
      app.currentHeadPage + 1
    })" class="waves-effect waves-light btn">
        NEXT
    </div>
    `;
  }

  document.getElementById("uplist").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

async function preload_matches() {
  const heads = cached_images.heads;
  const bodys = cached_images.bodys;
  if (document.is_uploads_matched) return;

  document.is_uploads_matched = true;
  let html = document.body.style.innerHTML;
  document.body.style.innerHTML = "loading..";
  const bodys_id = bodys
    .map((e) => {
      // extract id
      let m = e.match(/graal[^.]+/);
      return m == null ? false : m[0];
    })
    .filter((e) => e);

  const heads_id = heads
    .map((e) => {
      if (!e) return;
      // extract id
      let m = e.match(/graal[^.]+/);
      return m == null ? false : m[0];
    })
    .filter((e) => e);

  let players = {};

  bodys_id.forEach((e) => {
    if (!e) return;
    let id = "";
    try {
      id = e.split("-")[0];
    } catch (err) {
      console.log(e, err);
    }

    if (!players[id]) {
      players[id] = {};
    }
  });

  heads_id.forEach((e) => {
    if (!e) return;
    let id = e.split("-")[0];
    if (!players[id]) {
      players[id] = {};
    }
  });

  for (const id in players) {
    e = players[id];
    if (!e) return;
    e.bodys = [];
    e.heads = [];

    bodys.forEach((body) => {
      if (!body) return;
      if (body.includes(id)) {
        e.bodys.push(body);
      }
    });

    heads.forEach((head) => {
      if (!head) return;
      if (head.includes(id)) {
        e.heads.push(head);
      }
    });
  }

  document.body.style.innerHTML = html;
  cached_images.matches = players;
}

function domatch_upload_click(match_type) {
  preload_matches();

  let url = "";

  if (match_type == MATCH_TYPE.BODY)
    url = document
      .querySelector("#alert-out-body")
      .querySelector("#body")
      .getAttribute("src");
  if (match_type == MATCH_TYPE.HEAD)
    url = document
      .querySelector("#alert-out")
      .querySelector("#head")
      .getAttribute("src");

  update_pagination(0);

  if (domatch_upload(url)) {
    set_aba(CUSTOM_TAB_TYPE.MATCH);
  }
}
function domatch_upload(image) {
  if (!image) return;
  const matches = cached_images.matches;

  // extract id
  let m = image.match(/graal[^.]+/);
  const id = m == null ? false : m[0].split("-")[0];

  let count = 0;

  if (id) {
    if (matches[id]) {
      let html = `
            
           
            <div style="width:100%">
            <h2 class="flow-text">Choose an body or head then click in MATCH</h1>
            the potentially matches for the custom should appears here.
            </br><b>To download matched files long press on it or right click on desktop.<br>
            <b style="color:red">Warning</b><b> the matche uses detuction on filename so look if it combine with the requested file</b>
            </div>
            <div style='display: flex; flex-wrap:wrap;'>
            
            
            `;
      let player = matches[id];

      player.heads.forEach((element) => {
        const encodedElement = encodeURIComponent(element);
        html += `<div onclick="send_to_tester_directly(decodeURIComponent('${encodedElement}'), '${UP_TESTER_FILE_TYPE.HEAD}'); show_test_upload_container()" style="cursor:pointer" class="hoverdark hoverimagematcher"><img src="${element}" height=590/></div>`;
        count++;
      });

      player.bodys.forEach((element) => {
        const encodedElement = encodeURIComponent(element);
        html += `<div  onclick="send_to_tester_directly(decodeURIComponent('${encodedElement}'), '${UP_TESTER_FILE_TYPE.BODY}'); show_test_upload_container()" style="cursor:pointer"  class="hoverdark hoverimagematcher"><img src="${element}" height=590/></div>`;
        count++;
      });

      html += "</div>";

      document.querySelector("#uplist").innerHTML = html;
    }
  } else {
    console.log("No matches for this custom.");
  }

  return count > 1;
}

(async function () {
  hide_test_upload_container();
  const data = await fetch("./src/bodys.json");
  let bodys = (await data.json()).filter((e) => e);

  const hiddens = (await (await fetch("./src/hiddens.json")).json()).map((e) =>
    e.toLowerCase()
  );
  bodys = bodys.filter((filename) => {
    for (let index = 0; index < hiddens.length; index++) {
      const hidden = hiddens[index];
      if (filename.includes(hidden)) return false;
    }
    return true;
  });

  update_pagination(
    Math.ceil(bodys.length / app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD)
  );

  const hdata = await fetch("./src/heads.json");
  let heads = (await hdata.json()).filter((e) => e);

  heads = heads.filter((filename) => {
    for (let index = 0; index < hiddens.length; index++) {
      const hidden = hiddens[index];
      if (filename.includes(hidden)) return false;
    }
    return true;
  });

  cached_images.bodys = bodys;
  cached_images.heads = heads;

  set_aba("head");

  goto_page(0);
  document.getElementById("button-terms_of_service").click();
})();



// called by the webview apk to make initial setups
document.android_webview_preload_call = ()=>{
    app.runtime = runtime.ANDROID_WEBVIEW;
}