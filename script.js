const app = {
    MAX_ELEMENTS: 80,
    currentPage: "body",
    currentHeadPage: 0,
    currentBodyPage: 0,
    currentTotalPages: 0
}




let heads = []
let bodys = []
let matches = []

function main() {
    goto_head(0)

}


function update_pagination(totalpages, selected) {
    app.currentTotalPages = totalpages
    let html = ""
    for (let index = 0; index < totalpages; index++) {
        if (selected == index) {
            html = html + `<div onclick="" style="background-color: #00000099; color: white">${index + 1}</div>`
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
let open_alert = () => { }
let download_alert = () => { }
let close_alert = () => { }
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

        let open_alert_l = (link, type) => {

            if (type == "body") {
                aoutbody.style.display = "flex"
                const body = aoutbody.querySelector("#body")

                body.setAttribute("src", link)
            } else if (type == "head") {
                set_sprite(2)

                aout.style.display = "flex"
                const head = aout.querySelector("#head")



                head.setAttribute("src", link)

                aout.querySelector("#head-preview").setAttribute("src", link)
            }

        }
        close_alert = (type) => {
            if (type == "head") {
                aout.style.display = "none"
            } if (type == "body") {
                aoutbody.style.display = "none"
            }
        }

        download_alert = () => {
            let url = undefined;
            if (app.currentPage == "head") {
                url = head.getAttribute("src")
            }

            if (app.currentPage == "body") {
                url = body.getAttribute("src")
            }


            if (!url) {
                alert("No image")
                return
            }

            downloadFIle(url, btoa(Math.random()))
        }


        open_alert = (link, type) => {
            setTimeout(() => {
                open_alert_l(link, type)
            }, 80)
        }
    })

}


function set_aba(page) {
    if (page == "head") {
        update_pagination(Math.ceil(heads.length / app.MAX_ELEMENTS), app.currentHeadPage)
    }
    if (page == "body") {
        update_pagination(Math.ceil(bodys.length / app.MAX_ELEMENTS), app.currentBodyPage)
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

     <button style="padding: 12px; display: block; margin-left: auto; " onclick="app.currentPage='head';set_aba('head');goto_page(0)" class="agree-tos-button"> AGREE</button>

     </div>


     </div>
    `
}


function goto_page(page) {
    let selectedCOlor = " rgb(116, 135, 255)"

    document.getElementById("button-head").style.background = " rgb(91, 125, 191)"
    document.getElementById("button-body").style.background = " rgb(91, 125, 191)"
    document.getElementById("button-match").style.background = "rgb(91, 125, 191)"
    document.getElementById("button-terms_of_service").style.color = "#AAAAAA"
    update_pagination(app.currentTotalPages, page)
    if (app.currentPage == "body") {
        goto_body(page)

        document.getElementById("button-body").style.background = selectedCOlor
    }
    if (app.currentPage == "head") {
        goto_head(page)


        document.getElementById("button-head").style.background = selectedCOlor
    }
    if (app.currentPage == "match") {
        macth_tab()
        update_pagination(0)
        document.getElementById("button-match").style.background = selectedCOlor
    }

    if (app.currentPage == "terms_of_service") {
        tos_tab()
        update_pagination(0)

        document.getElementById("button-terms_of_service").style.color = "white"
    }


    document.querySelector("#uplist").scrollTop = 0
}

function send_to_tester_directly(url, type) {
    if (type == "body") {
        document.querySelector("#upload-view").querySelector("#body").setAttribute("src", url)
    } else if (type == "head") {
        document.querySelector("#upload-view").querySelector("#head").setAttribute("src", url)
    }
}





function send_to_tester(type) {
    if (type == "body") {
        const alert = document.querySelector("#alert-out-body")
        const body_url = alert.querySelector("#body").getAttribute("src")
        if (body_url) {
            document.querySelector("#upload-view").querySelector("#body").setAttribute("src", body_url)
        } else {
            console.error("Could not get src attr  to send to tester")
        }
    } else if (type == "head") {
        const alert = document.querySelector("#alert-out")
        const body_url = alert.querySelector("#head").getAttribute("src")
        if (body_url) {
            document.querySelector("#upload-view").querySelector("#head").setAttribute("src", body_url)
        } else {
            console.error("Could not get src attr  to send to tester")
        }
    }

    show_test_upload_container()

}

function goto_body(page) {
    app.currentBodyPage = page
    let uplist = document.getElementById("uplist")

    let html = ""

    let bodys_n = bodys.slice(page * app.MAX_ELEMENTS, (page + 1) * app.MAX_ELEMENTS)
    bodys_n.forEach(element => {
        if (!element) return;
        html = html + `

        <div style=";display: flex; align-items: center; justify-content: center; width:calc(33% - 10px); max-width: 110px">
       

        <div style="height: 80px; cursor:pointer" onclick="open_alert('${element}','body')" class="hoverdark">

        
        <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; " onerror="alert(0)">
        <div id="loading" style="position:absolute; width:32px; height:32px;" class="body-img-loading"> </div>

            <img id="body" alt="" style="position:relative; left: -64px"  src="${element}" draggable="false" cache-control="max-age=604800" onload="this.parentNode.querySelector('#loading').style.display='none'">
        </div>
        <div style="width: 32px; height: 31px; overflow: hidden; margin: 32px; scale: 1.2;position: relative; top: -80px " cache-control="max-age=604800" >
            <img id="head" alt="" style="position:absolute; top: -64px" draggable="false" src="">
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
    app.currentHeadPage = page
    let html = ""
    /*<div class="uploadcard">
    <div style="width: 32px; height: 31px; overflow: hidden; margin: auto;">
    <img id="head" style="position:relative; top: -64px;" src="${element}"  draggable='false' >
    </div>   
    </div>*/



    let heads_sliced = heads.slice(page * app.MAX_ELEMENTS, (page + 1) * app.MAX_ELEMENTS)
    heads_sliced.forEach(element => {
        if (!element) return;

        const gif = isGifFile(extractFileNameFromURL(element))


        html = html + `


            <div style=";display: flex; align-items: center; justify-content: center; width:calc(33% - 10px); max-width: 110px">
       

            <div style="height: 80px; cursor:pointer; position: relative; " onclick="open_alert('${element}','head')" class="hoverdark">
    
            
            <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; ">
                <img id="body" style="position:relative; left: -64px" alt="" draggable="false"  src="https://classiccachecloudcor.quattroplay.com/custom_bodys/classic_personal_body_graal3799034-578.png" cache-control="max-age=604800">
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
    close_alert("head")
    close_alert("body")
    set_aba("head")

    main()

});




async function preload_matches() {
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
    matches = players
}



function domatch_upload_click() {

    preload_matches()

    let url = ""

    if (app.currentPage == "body")
        url = document.querySelector("#alert-out-body").querySelector("#body").getAttribute("src")
    if (app.currentPage == "head")
        url = document.querySelector("#alert-out").querySelector("#head").getAttribute("src")


    update_pagination(0)

    if (domatch_upload(url)
    ) {

        set_aba("match")
    }
}
function domatch_upload(image) {
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
                html += `<div onclick='send_to_tester_directly("${element}", "head")' style="cursor:pointer" class="hoverdark hoverimagematcher"><img src="${element}"/></div>`
                count++;
            });

            player.bodys.forEach(element => {
                html += `<div  onclick='send_to_tester_directly("${element}", "body")' style="cursor:pointer"  class="hoverdark hoverimagematcher"><img src="${element}"/></div>`
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
    bodys = (await data.json()).filter(e => e)


    const hiddens = (await (await fetch("./hiddens.json")).json()).map((e) => e.toLowerCase())
    bodys = bodys.filter((filename) => {
        for (let index = 0; index < hiddens.length; index++) {
            const hidden = hiddens[index];
            if (filename.includes(hidden)) return false;

        }
        return true
    })

    update_pagination(Math.ceil(bodys.length / app.MAX_ELEMENTS))


    const hdata = await fetch("./heads.json")
    heads = (await hdata.json()).filter(e => e)


    heads = heads.filter((filename) => {

        for (let index = 0; index < hiddens.length; index++) {
            const hidden = hiddens[index];
            if (filename.includes(hidden)) return false;

        }
        return true
    })

    set_aba("head")

    goto_page(0)
    document.getElementById("button-terms_of_service").click()



})()







