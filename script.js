// This source code was written in 2023 and its maintaned at GitHub.com
// Last update in 2023


const CUSTOM_TAB_TYPE = {
    HEAD: "tab_head",
    BODY: "tab_body",
    MATCH: "tab_match",
    TERMS_OF_SERVICE: "tab_terms_of_service"
}


const FILE_DOWNLOAD_TYPE = {
    HEAD: "filetype_head",
    BODY: "filetype_body"
}

const FILE_DOWNLOAD_TYPES_PREFIX = {
    HEAD: "head-",
    BODY: "body-",
    UNKNOWN: "unknown-"
}

const ALERT_TYPE = {
    HEAD: "alert_head",
    BODY: "alert_body"
}


const UP_TESTER_FILE_TYPE = {
    HEAD: "tester_head",
    BODY: "tester_body"
}


const NPC_TESTER_DEFAULT_BODY = "https://cdn.discordapp.com/attachments/1171693403654865007/1171707654234714133/olwest_personal_body_graal4967387-148.png?ex=655da8ca&is=654b33ca&hm=89862e741473a80287085119165322b17c3278d777462a4a7485f525cef360c7&"
const NPC_TESTER_DEFAULT_HEAD = ""


const npc_tester_infor = {
    head: NPC_TESTER_DEFAULT_HEAD,
    body: NPC_TESTER_DEFAULT_BODY
}


const MATCH_TYPE = {
    HEAD: "match_head",
    BODY: "match_body"
}



const cached_images = {
    heads: [],
    bodys: [],
    matches: []
}

const app = {
    VERSION: "0.0.2",
    MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD: 54,
    currentPage: CUSTOM_TAB_TYPE.HEAD,
    currentHeadPage: 0,
    currentBodyPage: 0,
    currentTotalPages: 0,
    displayTesterHeadInPreview: false,
    displayTesterBodyInPreview: false
}



function put_version_on_dom(){
    const version_element = document.getElementById("version")
    if (version_element)
        version_element.innerText = `version ${app.VERSION}`
    else
        console.error("Cannot find any element that store id version.")
}


function main() {
    put_version_on_dom()
    close_alert(ALERT_TYPE.HEAD)
    close_alert(ALERT_TYPE.BODY)
    set_aba(CUSTOM_TAB_TYPE.TERMS_OF_SERVICE)
}


function update_pagination(totalpages, selected) {
    app.currentTotalPages = totalpages
    let html = ""
    for (let index = 0; index < totalpages; index++) {
        if (selected == index) {
            html = html + `<div onclick="" style="background-color: #00000099; color: white; border-radius: 12px">${index + 1}</div>`
        } else
            html = html + `<div onclick="goto_page(${index}); update_pagination(${totalpages}, ${index})">${index + 1}</div>`
    }
    document.querySelector("#pagination-div").innerHTML = html
}





function extractFileNameFromURL(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const fileName = pathname.substring(pathname.lastIndexOf('/') + 1).split("?")[0];
        return fileName;
    } catch (error) {
        console.error("Erro ao analisar a URL: " + error);
        return null;
    }
}

function downloadFIle(url, nomeDoArquivo) {
    if (nomeDoArquivo == null) {
        nomeDoArquivo = extractFileNameFromURL(url)
    }
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const urlBlob = URL.createObjectURL(blob);

            const linkTemporario = document.createElement("a");
            linkTemporario.href = urlBlob;
            linkTemporario.download = nomeDoArquivo || "download"; // Define o nome do arquivo para download, padrão é "download"

            // Simula um clique no link temporário para iniciar o download
            linkTemporario.click();
        })
        .catch(error => {
            console.error("Ocorreu um erro ao baixar o arquivo:", error);
        });
}



function show_test_upload_container() {
    document.querySelector("#upload-view").style.display = "flex"
    document.querySelector("#toggle-upload-tester-view").style.scale = "1"


}



function hide_test_upload_container() {
    document.querySelector("#upload-view").style.display = "none"
    document.querySelector("#toggle-upload-tester-view").style.scale = "-1"

}


function toggle_upload_button_click() {
    let show = document.querySelector("#upload-view").style.display != "none"

    if (show) {
        hide_test_upload_container()
    } else {
        show_test_upload_container()

    }


}


// alert
let open_alert = (image_link, alert_type) => { }
let download_alert_click = (file_type) => { }
let open_alert_l = (image_link, alert_type) => { }
{
    document.addEventListener("DOMContentLoaded", () => {
        const aout = document.querySelector("#alert-out")
        const aoutbody = document.querySelector("#alert-out-body")

        aout.style.display = "none"
        let sprite = 0

        let set_sprite = (spritep) => {
            sprite = spritep
            if (sprite >= 4) sprite = 0
            let stp = "-" + (sprite * 32) + "px"
            head.style.top = stp
        }
        const head = aout.querySelector("#head")
        const body = aoutbody.querySelector("#body")

        head.addEventListener("click", () => {
            sprite += 1
            set_sprite(sprite)
        })

        let open_alert_l = (image_link, alert_type) => {

            if (alert_type == ALERT_TYPE.BODY) {
                aoutbody.style.display = "flex"
                const body = aoutbody.querySelector("#body")
                body.setAttribute("src", image_link)
            } else if (alert_type == ALERT_TYPE.HEAD) {
                set_sprite(2)
                aout.style.display = "flex"
                const head = aout.querySelector("#head")
                head.setAttribute("src", image_link)
                aout.querySelector("#head-preview").setAttribute("src", image_link)
            }

        }
        close_alert = (alert_type) => {
            if (alert_type == ALERT_TYPE.HEAD) {
                aout.style.display = "none"
            } if (alert_type == ALERT_TYPE.BODY) {
                aoutbody.style.display = "none"
            }
        }

        download_alert_click = (file_type) => {
            let url = undefined;
            let prefix = FILE_DOWNLOAD_TYPES_PREFIX.UNKNOWN;

            if (file_type == FILE_DOWNLOAD_TYPE.HEAD) {
                url = head.getAttribute("src")
                prefix = FILE_DOWNLOAD_TYPES_PREFIX.HEAD
            }

            if (file_type == FILE_DOWNLOAD_TYPE.BODY) {
                url = body.getAttribute("src")
                prefix = FILE_DOWNLOAD_TYPES_PREFIX.BODY
            }


            if (!url) {
                alert("No image")
                return
            }

            downloadFIle(url, prefix + btoa(Math.random()))
        }


        open_alert = (link, type) => {
            console.log(link, type)
            setTimeout(() => {
                open_alert_l(link, type)
            }, 80)
        }
    })

}


function set_aba(page) {
    const heads = cached_images.heads
    const bodys = cached_images.bodys
    if (page == CUSTOM_TAB_TYPE.HEAD) {
        update_pagination(Math.ceil(heads.length / app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD), app.currentHeadPage)
    }
    if (page == CUSTOM_TAB_TYPE.BODY) {
        update_pagination(Math.ceil(bodys.length / app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD), app.currentBodyPage)
    }
    app.currentPage = page
}



function macth_tab() {
    document.querySelector("#uplist").innerHTML = `
    <div>
        <h2>Choose an body or head then click in MATCH</h1>
        the potentially matches for the custom should appears here.
        <b>To download matched files long press on it or right click on desktop.
    </div>
    `
}



function tos_tab() {
    document.querySelector("#uplist").innerHTML = `

    <div>


    <div style="line-height: 1.5; padding: 7px">
    
   
        <h1>Terms of services</h1>
        
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


     </div>
    `
}


function goto_page(page) {
    
    const selectedCOlor = "var(--tab-selected-bgcolor)"

    document.getElementById("button-head").style.background = " var(--main-button-bgcolor)"
    document.getElementById("button-body").style.background = "var(--main-button-bgcolor)"
    document.getElementById("button-match").style.background = "var(--main-button-bgcolor)"
    document.getElementById("button-terms_of_service").style.color = "#AAAAAA"

    update_pagination(app.currentTotalPages, page)
    if (app.currentPage == CUSTOM_TAB_TYPE.BODY) {
        goto_body(page)

        document.getElementById("button-body").style.background = selectedCOlor
    }
    if (app.currentPage == CUSTOM_TAB_TYPE.HEAD) {
        goto_head(page)


        document.getElementById("button-head").style.background = selectedCOlor
    }
    if (app.currentPage == CUSTOM_TAB_TYPE.MATCH) {
        macth_tab()
        update_pagination(0)
        document.getElementById("button-match").style.background = selectedCOlor
    }

    if (app.currentPage == CUSTOM_TAB_TYPE.TERMS_OF_SERVICE) {
        tos_tab()
        update_pagination(0)

        document.getElementById("button-terms_of_service").style.color = "white"
    }


    document.querySelector("#uplist").scrollTop = 0
}

function send_to_tester_directly(url, type) {
    
    if (type == UP_TESTER_FILE_TYPE.BODY) {
        document.querySelector("#upload-view").querySelector("#body").setAttribute("src", url)
        npc_tester_infor.body = url

    } else if (type == UP_TESTER_FILE_TYPE.HEAD) {
        document.querySelector("#upload-view").querySelector("#head").setAttribute("src", url)
        npc_tester_infor.head = url

    }
}





function send_to_tester(type) {
    if (type == UP_TESTER_FILE_TYPE.BODY) {
        const alert = document.querySelector("#alert-out-body")
        const body_url = alert.querySelector("#body").getAttribute("src")
        if (body_url) {
            send_to_tester_directly(body_url, type)
        } else {
            console.error("Could not get src attr  to send to tester")
        }
    } else if (type == UP_TESTER_FILE_TYPE.HEAD) {
        
        const alert = document.querySelector("#alert-out")
        const head_url = alert.querySelector("#head").getAttribute("src")
        if (head_url) {
            send_to_tester_directly(head_url, type)

        } else {
            console.error("Could not get src attr  to send to tester")
        }

    }

    show_test_upload_container()

}

function goto_body(page) {
    const bodys = cached_images.bodys
    app.currentBodyPage = page
    let uplist = document.getElementById("uplist")

    let html = ""

    const starting_page = page * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD

    let bodys_n = bodys.slice(starting_page, (page + 1) * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD)
   
    bodys_n.forEach((element,index) => {
        if (!element) return;
        html = html + `

        <div style=";display: flex; align-items: center; justify-content: center; width:calc(33% - 4px); max-width: 110px">
       

        <div style="height: 80px; cursor:pointer" onclick="open_alert(cached_images.bodys[${starting_page+index}], ALERT_TYPE.BODY)" class="hoverdark">

        
        <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; " onerror="alert(0)">
        <div id="loading" style="position:absolute; width:32px; height:32px;" class="body-img-loading"> </div>

            <img id="body" alt="" style="position:relative; left: -64px"  src="${element}" draggable="false" cache-control="max-age=604800" onload="this.parentNode.querySelector('#loading').style.display='none'">
        </div>
        <div style="width: 32px; height: 31px; overflow: hidden; margin: 32px; scale: 1.2;position: relative; top: -80px " cache-control="max-age=604800" >
            <img id="head" alt="" style="position:absolute; top: -64px" draggable="false" src="${app.displayTesterHeadInPreview?npc_tester_infor.head:""}">
        </div>
    </div>

    </div>
        `
    })
    if (page + 1 < app.currentTotalPages) {

        html += `
        <div style="display: flex;height: 20px;margin-left: auto; margin-top: auto;margin-bottom: auto; cursor:pointer; position: relative; justify-content: center; align-items:center; color: white; background-color: black;padding: 12px; font-size: 0.7em" onclick="goto_page(${app.currentBodyPage + 1})">
            NEXT
        </div>
        `
    }



    uplist.innerHTML = html
}




function isGifFile(fileName) {
    if (fileName.toLowerCase().endsWith(".gif")) {
        return true;
    }
    return false;
}



function goto_head(page) {
    const heads = cached_images.heads

    app.currentHeadPage = page
    let html = ""
    const starting_page = page * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD
    let heads_sliced = heads.slice(starting_page, (page + 1) * app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD)
    heads_sliced.forEach((element, index) => {
        if (!element) return;

        const gif = isGifFile(extractFileNameFromURL(element))
        

        html = html + `


            <div style=";display: flex; align-items: center; justify-content: center; width:calc(33% - 10px); max-width: 110px">
       

            <div style="height: 80px; cursor:pointer; position: relative; " onclick="open_alert(cached_images.heads[${starting_page+index}], ALERT_TYPE.HEAD )" class="hoverdark">
    
            
            <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; ">
                <img id="body" style="position:relative; left: -64px" alt="" draggable="false"  src="${app.displayTesterHeadInPreview?npc_tester_infor.head:NPC_TESTER_DEFAULT_BODY}" cache-control="max-age=604800">
            </div>
            <div style="width: 32px; height: 31px; overflow: hidden; margin: 32px; scale: 1.2;position: relative; top: -80px;">
                <div id="loading" style="position:absolute; width:32px; height:32px;" class="head-img-loading"> </div>
                <img id="head" style="position:absolute; top: -64px" alt="" src="${element}" draggable="false" cache-control="max-age=604800" onload="this.parentNode.querySelector('#loading').style.display='none'">
            </div>
            <h1 style="position:absolute; top: 0; left: 0; font-size: 12px;">${gif ? "GIF" : "PNG"}</h1>
        </div>
        </div>
            `

    });

    if (page + 1 < app.currentTotalPages) {
        html += `
    <div style="display: flex;height: 20px;margin-left: auto; margin-top: auto;margin-bottom: auto; cursor:pointer; position: relative; justify-content: center; align-items:center; color: white; background-color: black;padding: 12px; font-size: 0.7em" onclick="goto_page(${app.currentHeadPage + 1})">
        NEXT
    </div>
    `
    }

    document.getElementById("uplist").innerHTML = html
}


document.addEventListener("DOMContentLoaded", () => {
 

    main()

});




async function preload_matches() {
    const heads = cached_images.heads
    const bodys = cached_images.bodys
    if (document.is_uploads_matched) return;

    document.is_uploads_matched = true
    let html = document.body.style.innerHTML
    document.body.style.innerHTML = "loading.."
    const bodys_id = bodys.map((e) => {
        // extract id
        let m = e.match(/graal[^.]+/)
        return m == null ? false : m[0]
    }).filter((e) => e)

    const heads_id = heads.map((e) => {
        if (!e) return;
        // extract id
        let m = e.match(/graal[^.]+/)
        return m == null ? false : m[0]
    }).filter((e) => e)


    let players = {}

    bodys_id.forEach((e) => {
        if (!e) return;
        let id = ""
        try {
            id = e.split("-")[0]
        } catch (err) {
            console.log(e, err)
        }

        if (!players[id]) {
            players[id] = {}
        }
    })




    heads_id.forEach((e) => {
        if (!e) return;
        let id = e.split("-")[0]
        if (!players[id]) {
            players[id] = {}
        }
    })

    for (const id in players) {
        e = players[id]
        if (!e) return;
        e.bodys = []
        e.heads = []

        bodys.forEach((body) => {
            if (!body) return;
            if (body.includes(id)) {
                e.bodys.push(body)
            }
        })

        heads.forEach((head) => {
            if (!head) return;
            if (head.includes(id)) {
                e.heads.push(head)
            }
        })
    }

    document.body.style.innerHTML = html
    cached_images.matches = players
}



function domatch_upload_click(match_type) {

    preload_matches()


    let url = ""

    if (match_type == MATCH_TYPE.BODY)
        url = document.querySelector("#alert-out-body").querySelector("#body").getAttribute("src")
    if (match_type == MATCH_TYPE.HEAD)
        url = document.querySelector("#alert-out").querySelector("#head").getAttribute("src")



    update_pagination(0)
    

    if (domatch_upload(url)
    ) {

        set_aba(CUSTOM_TAB_TYPE.MATCH)
    }
}
function domatch_upload(image) {
    const matches = cached_images.matches
  
    
    // extract id
    let m = image.match(/graal[^.]+/)
    const id = m == null ? false : m[0].split("-")[0]

    let count = 0

    if (id) {

        if (matches[id]) {
            let html = `
            
           
            <div style="width:100%">
            <h2>Choose an body or head then click in MATCH</h1>
            the potentially matches for the custom should appears here.
            </br><b>To download matched files long press on it or right click on desktop.<br>
            <b style="color:red">Warning</b><b> the matche uses detuction on filename so look if it combine with the requested file</b>
            </div>
            <div style='display: flex; flex-wrap:wrap;'>
            
            
            `
            let player = matches[id]



            player.heads.forEach(element => {
                const encodedElement = encodeURIComponent(element);
                html += `<div onclick="send_to_tester_directly(decodeURIComponent('${encodedElement}'), '${UP_TESTER_FILE_TYPE.HEAD}'); show_test_upload_container()" style="cursor:pointer" class="hoverdark hoverimagematcher"><img src="${element}" height=590/></div>`
                count++;
            });

            player.bodys.forEach(element => {
                const encodedElement = encodeURIComponent(element);
                html += `<div  onclick="send_to_tester_directly(decodeURIComponent('${encodedElement}'), '${UP_TESTER_FILE_TYPE.BODY}'); show_test_upload_container()" style="cursor:pointer"  class="hoverdark hoverimagematcher"><img src="${element}" height=590/></div>`
                count++;
            });

            html += "</div>"


            document.querySelector("#uplist").innerHTML = html

        }
    } else {
        console.log("No matches for this custom.")
    }

    return count > 1
}



(async function () {
    hide_test_upload_container()
    const data = await fetch("./bodys.json")
    let bodys = (await data.json()).filter(e => e)


    const hiddens = (await (await fetch("./hiddens.json")).json()).map((e) => e.toLowerCase())
    bodys = bodys.filter((filename) => {
        for (let index = 0; index < hiddens.length; index++) {
            const hidden = hiddens[index];
            if (filename.includes(hidden)) return false;

        }
        return true
    })

    update_pagination(Math.ceil(bodys.length / app.MAX_ELEMENTS_PER_PAGE_BODY_AND_HEAD))


    const hdata = await fetch("./heads.json")
    let heads = (await hdata.json()).filter(e => e)


    heads = heads.filter((filename) => {

        for (let index = 0; index < hiddens.length; index++) {
            const hidden = hiddens[index];
            if (filename.includes(hidden)) return false;

        }
        return true
    })

    cached_images.bodys = bodys
    cached_images.heads = heads

    set_aba("head")

    goto_page(0)
    document.getElementById("button-terms_of_service").click()

   



})()







