const app = {
    MAX_ELEMENTS: 35,
    currentPage: "body"
}




let heads = []
let bodys = []
let matches =[]

function main() {
  goto_head(0)
}


function update_pagination(totalpages, selected){
    let html = ""
    for (let index = 0; index < totalpages; index++) {
        if ( selected == index ) {
            html = html + `<div onclick="" style="background-color: black; color: white">${index+1}</div>`
        }else
        html = html + `<div onclick="goto_page(${index}); update_pagination(${totalpages}, ${index})">${index+1}</div>`
    }
    document.querySelector("#pagination-div").innerHTML= html
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
  

// alert
let open_alert = () => {}
let download_alert =() => {}
let close_alert = () => {}
{
    document.addEventListener("DOMContentLoaded", ()=> {
        const aout = document.querySelector("#alert-out")
        const aoutbody = document.querySelector("#alert-out-body")

        aout.style.display = "none"
        let sprite = 0

        let set_sprite = (spritep)=> {
            sprite = spritep
            if( sprite >= 4) sprite = 0
            let stp = "-"+(sprite*32)+"px"
            head.style.top=stp
        }
        const head =  aout.querySelector("#head")
        const body =  aoutbody.querySelector("#body")

        head.addEventListener("click", ()=> {
            sprite += 1
            set_sprite(sprite)
        })

        let open_alert_l = (link, type) => {

            if ( type == "body") {
                aoutbody.style.display = "flex"
                const body = aoutbody.querySelector("#body")
               
                body.setAttribute("src",link)
            }else if (type == "head"){
                set_sprite(2)

                aout.style.display = "flex"
                const head =  aout.querySelector("#head")


           
                head.setAttribute("src",link)

                aout.querySelector("#head-preview").setAttribute("src", link)
            }
         
        }
        close_alert = (type) => {
            if ( type == "head") {
                aout.style.display = "none"
            }if ( type == "body"){
                aoutbody.style.display = "none"
            }
        }

        download_alert = ()=> {
            let url = undefined;
            if (app.currentPage == "head"){
                url = head.getAttribute("src")
            }

            if (app.currentPage == "body"){
                url = body.getAttribute("src")
            }
            
            
            if ( ! url ) {
                alert("No image")
                return
            }

            downloadFIle(url, null)
        }
        

        open_alert = (link, type)=>{
            setTimeout(()=>{
                open_alert_l(link, type)
            },80)
        }
    })
    
}


function set_aba(page) {
    if (page == "head"){
        update_pagination(Math.ceil(heads.length/app.MAX_ELEMENTS),0)
    }
    if (page == "body"){
        update_pagination(Math.ceil(bodys.length/app.MAX_ELEMENTS),0)
    }
    app.currentPage = page
}



function macth_tab() {
    document.querySelector("#uplist").innerHTML=`
        <h2>Choose an body or head then click in MATCH</h1>
        the potentially matches for the custom should appears here.
        <b>To download matched files long press on it or right click on desktop.
    `
}


function goto_page(page) {
    let selectedCOlor = "gray"
    
    document.getElementById("button-head").style.background ="#333333ff"
    document.getElementById("button-body").style.background ="#333333ff"
    document.getElementById("button-match").style.background ="#333333ff"

    if (app.currentPage == "body") {
        goto_body(page)
        document.getElementById("button-body").style.background =selectedCOlor
    }
    if (app.currentPage == "head"){
        goto_head(page)
        document.getElementById("button-head").style.background =selectedCOlor
    }
    if (app.currentPage == "match"){
        macth_tab()
        update_pagination(0)
        document.getElementById("button-match").style.background =selectedCOlor
    }


    document.querySelector("#uplist").scrollTop = 0
}

function goto_body(page) {
    let uplist = document.getElementById("uplist")
    
    let html = ""

    let bodys_n = bodys.slice(page*app.MAX_ELEMENTS, (page+1)*app.MAX_ELEMENTS)
    bodys_n.forEach(element => {
        if (!element)return;
        html = html + `
       

        <div style="height: 80px; cursor:pointer" onclick="open_alert('${element}','body')" class="hoverdark">

        
        <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; ">
            <img id="body" alt="" style="position:relative; left: -64px"  src="${element}" draggable="false" cache-control="max-age=604800">
        </div>
        <div style="width: 32px; height: 31px; overflow: hidden; margin: 32px; scale: 1.2;position: relative; top: -80px " cache-control="max-age=604800" >
            <img id="head" alt="" style="position:absolute; top: -64px" draggable="false" src="">
        </div>
    </div>
        `
    })

    uplist.innerHTML = html
}



function goto_head(page) {
    let html = ""
    /*<div class="uploadcard">
    <div style="width: 32px; height: 31px; overflow: hidden; margin: auto;">
    <img id="head" style="position:relative; top: -64px;" src="${element}"  draggable='false' >
    </div>   
    </div>*/

  

    let heads_sliced = heads.slice(page*app.MAX_ELEMENTS, (page+1)*app.MAX_ELEMENTS)
    heads_sliced.forEach(element => {
        if (!element)return;
        html = html + `
       

        <div style="height: 80px; cursor:pointer" onclick="open_alert('${element}','head')" class="hoverdark">

        
        <div style="width: 32px; height: 32px; overflow: hidden; margin: 32px; scale: 1.2; position: relative; ">
            <img id="body" style="position:relative; left: -64px" alt="" draggable="false"  src="https://classiccachecloudcor.quattroplay.com/custom_bodys/classic_personal_body_graal3799034-578.png" cache-control="max-age=604800">
        </div>
        <div style="width: 32px; height: 31px; overflow: hidden; margin: 32px; scale: 1.2;position: relative; top: -80px ">
            <img id="head" style="position:absolute; top: -64px" alt="" src="${element}" draggable="false" cache-control="max-age=604800">
        </div>
    </div>
        `
    });

    document.getElementById("uplist").innerHTML = html
}


document.addEventListener("DOMContentLoaded", ()=> {
    close_alert("head")
    close_alert("body")
    set_aba("head")
   
    main()

});




async function preload_matches() {
    const bodys_id = bodys.map((e)=>{
        // extract id
        let m = e.match(/graal[^.]+/) 
        return m == null ? false : m[0]
    }).filter((e)=>e)

    const heads_id = heads.map((e)=>{
        if (!e)return;
        // extract id
        let m = e.match(/graal[^.]+/) 
        return m == null ? false : m[0]
    }).filter((e)=>e)


    let players = {}

    bodys_id.forEach((e)=>{
        if (!e) return;
        let id = ""
        try {
            id = e.split("-")[0]
        }catch(err){
            console.log(e, err)
        }
       
        if (! players[id]){
            players[id] = {}
        }
    })


  

    heads_id.forEach((e)=>{
        if (!e) return;
        let id = e.split("-")[0]
        if (! players[id]) {
            players[id] = {}
        }
    })

    for(const id in players){
        e = players[id]
        if (!e) return;
        e.bodys = []
        e.heads = []

        bodys.forEach((body)=>{
            if (!body) return;
            if ( body.includes(id)) {
                e.bodys.push(body)
            }
        })

        heads.forEach((head)=>{
            if (!head) return;
            if ( head.includes(id)) {
                e.heads.push(head)
            }
        })
    }


    matches = players
}



function domatch_upload_click() {

    let url = ""

    if (app.currentPage == "body")
        url = document.querySelector("#alert-out-body").querySelector("#body").getAttribute("src")
    if (app.currentPage == "head")
        url = document.querySelector("#alert-out").querySelector("#head").getAttribute("src")
 
   
    goto_page("match")
    update_pagination(0)

    if(domatch_upload(url)
    ){

        set_aba("match")
    }
}
function domatch_upload(image) {
     // extract id
     let m = image.match(/graal[^.]+/) 
     const id =  m == null ? false : m[0].split("-")[0]

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
                html += `<div><img src="${element}"/></div>`
                count++;
            });

            player.bodys.forEach(element => {
                html += `<div><img src="${element}"/></div>`
                count++;
            });

            html+="</div>"

            if ( count > 1)
                document.querySelector("#uplist").innerHTML = html
            else
                console.log("No matches for this custom")
        }
     }else{
        console.log("No matches for this custom.")
     }

     return count > 1
}



(async function (){
    const data = await fetch("./bodys.json")
    bodys =  (await data.json()).filter(e=>e)
   

    update_pagination(Math.ceil(bodys.length/app.MAX_ELEMENTS))

    
    const hdata =  await fetch("./heads.json")
    heads = (await hdata.json()).filter(e=>e)
    set_aba("head")

    goto_page(0)

    preload_matches()
})()







