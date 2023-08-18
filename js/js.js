$(function () {
    let video = {
        0: "https://www.youtube.com/embed/vqs1je2VDN4?playlist=vqs1je2VDN4&controls=0&loop=1&autoplay=1&mute=1&rel=0",
        1: "https://www.youtube.com/embed/ohtckRs8f7w?playlist=ohtckRs8f7w&controls=0&loop=1&autoplay=1&mute=1&rel=0",
        2: "https://www.youtube.com/embed/T8tNHs1ELDU?playlist=T8tNHs1ELDU&controls=0&loop=1&autoplay=1&mute=1&rel=0",
        3: "https://www.youtube.com/embed/nqUedMm3o3c?playlist=nqUedMm3o3c&controls=0&loop=1&autoplay=1&mute=1&rel=0"
    }
    let random = Math.floor(Math.random() * 4);
    $(".yt").attr("src", video[random]);



    $(document).scroll(function () {
        if (window.scrollY) {
            let tmp = window.scrollY / 100;
            tmp = (tmp > 1) ? 1 : tmp;
            $(".nav").css("background-color", `rgba(230 , 0, 122, ${tmp})`);
            $(".top").css("opacity", "1");
        } else {
            $(".top").css("opacity", "0");
        }
    })


    $.get("./event.json", (res) => {
        let event = res.Infos.Info;
        $.each(event, function (indexInArray, valueOfElement) {
            first = (indexInArray == 0) ? "active" : "";

            tmp = `<div class="carousel-item ${first}">
                    <a href="${valueOfElement.Website}" target="_blank">
                        <img src="${valueOfElement.Image.Src}" class="mx-auto" alt="${valueOfElement.Name}">
                    </a>
            </div>`;
            $(".carousel-inner").append(tmp);
        });
    })
    let data;
    $.get("./addr.json", (res) => {
        data = res.infos;
        let zipcode={};
        let code={
            320:"中壢區",
            324:"平鎮區",
            325:"龍潭區",
            326:"楊梅區",
            327:"新屋區",
            328:"觀音區",
            330:"桃園區",
            333:"龜山區",
            334:"八德區",
            335:"大溪區",
            336:"復興區",
            337:"大園區",
            338:"蘆竹區"
        }
        $.each(res.infos, function (indexInArray, valueOfElement) {
            if(zipcode[code[valueOfElement.Zipcode]]==null){
                zipcode[code[valueOfElement.Zipcode]]=1;
            }else{
                zipcode[code[valueOfElement.Zipcode]]+=1;
            }
            let tmp = `
            <tr data-id="${indexInArray + 1}">
            <td>
                            ${valueOfElement.Name}

                        </td>
                        <td>
                            ${valueOfElement.Add}
                        </td>
                        <td class="mobile">
                            ${valueOfElement.Opentime}
                        </td>
                        <td>
                            ${valueOfElement.Tel}
                        </td>
                     </tr>
                    `
            $("tbody").append(tmp);
        })
        // console.log(zipcode);
        console.log(Object.keys(zipcode));
        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(zipcode),
                datasets: [{
                    label: '# 個景點',
                    data: Object.values(zipcode),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        $("tr").click(function () {
            let tmp = data[$(this).data("id")];
            if ($(this).data("id") != 0) {
                $(".modal-title").text(tmp.Name);
                $(".textbody").html("<h3>景點介紹</h3>&emsp;&emsp;");
                let str = tmp.Toldescribe;
                str = str.split('');
                $.each(str, function (indexInArray, valueOfElement) {
                    $(".textbody").append(valueOfElement);
                    if (valueOfElement == "。") {
                        $(".textbody").append("<br>&emsp;&emsp;");
                    }
                });

                if (tmp.Website == "") {
                    $("#web1").attr("href", "");
                    $("#web1").hide();
                } else {
                    $("#web1").attr("href", tmp.Website);
                    $("#web1").show();
                }

                if (tmp.TYWebsite == "") {
                    $("#web2").attr("href", "");
                    $("#web2").hide();
                } else {
                    $("#web2").attr("href", tmp.TYWebsite);
                    $("#web2").show();
                }

                if (tmp.Py == "" || tmp.Px == "") {
                    $(".map").hide();
                } else {
                    $(".map").attr("src", `https://www.google.com/maps/embed/v1/place?key=AIzaSyDPTBwE6_TjIDq6JBX0RNFZ6eepc_Zvgrk&q=${tmp.Py}, ${tmp.Px}`);
                    $(".map").show();
                }
                myModal.show();
            }
        })
        $("table").dataTable({
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/zh_Hant.json"
            }
        });

    })

    let myModal = new bootstrap.Modal("#myModal");



})