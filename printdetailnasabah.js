function formatTanggalIndonesia(tanggal) {

  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  const date = new Date(tanggal);

  const hari = date.getDate();

  const namaBulan = bulan[date.getMonth()];

  const tahun = date.getFullYear();

  return `${hari} ${namaBulan} ${tahun}`;

}


// loadProfil
window.dataProfil = [];

async function loadProfil(){

  try{

    const res = await fetch(CONFIG.API_URL,{
      method:"POST",
      body:JSON.stringify({
        mode:"getProfil"
      })
    });

    const r = await res.json();

    if(r.ok){
      window.dataProfil = r.data;
    }

  }catch(err){
    console.log(err);
  }

}

loadProfil();


// =====================================================
// PRINT DETAIL NASABAH
// =====================================================

document.addEventListener("click", function(e){

  // cek tombol print
  if(e.target.classList.contains("btnPrint")){

    const tgl = e.target.dataset.tgl;

    // ambil detail
    const detail =
      document.getElementById(`detail-${tgl}`);

    if(!detail) return;

    // ambil nama nasabah
    const namaNasabah =
      document.querySelector("h3")?.innerText ||
      "Nasabah";

    // window print baru
    const win = window.open("", "_blank");

    // isi html print
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>
          Print Detail Nasabah
        </title>

        <style>

          body{
            font-family:sans-serif;
            padding:20px;
            color:#000;
          }

          h2{
            text-align:center;
            margin-bottom:5px;
          }

          p{
            margin:4px 0;
          }

          .header{
            margin-bottom:20px;
            border-bottom:2px solid #000;
            padding-bottom:10px;
          }

          .box{
            border:1px solid #ccc;
            border-radius:10px;
            padding:10px;
            margin-bottom:15px;
          }

          .title{
            background:white;
            color:black;
            padding:8px;
            border-radius:6px;
            margin-bottom:10px;
          }

          .item{
            border-bottom:1px dashed #ccc;
            padding:8px 0;
          }

          .total{
            margin-top:15px;
            font-weight:bold;
          }

          @media print{

            body{
              padding:0;
            }

            button{
              display:none;
            }

          }

        </style>
      </head>

      <body>

        <div class="header">

          <h2>
            Detail Tabungan Nasabah
          </h2>

          <p>
            <b>Nama:</b>
            ${namaNasabah}
          </p>

          <p>
            <b>Tanggal:</b>
            ${tgl}
          </p>

        </div>

        ${detail.innerHTML}

      </body>
      </html>
    `);

   // =========================
    // PRINT
    // =========================

    win.document.close();

    setTimeout(() => {

      win.print();

    }, 1000);

  }

});