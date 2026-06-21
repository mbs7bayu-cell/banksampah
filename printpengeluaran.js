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


// ================= PRINT PENGELUARAN =================

// format rupiah
function formatRupiah(angka){
  return new Intl.NumberFormat("id-ID").format(
    Number(angka || 0)
  );
}

// =====================================================
// PRINT PENGELUARAN PER TANGGAL
// =====================================================
document.addEventListener("click", function(e){

  // ===================================================
  // PRINT SIMPLE
  // ===================================================
  if(e.target.classList.contains("btnPrintKhusus")){

    const tgl = e.target.dataset.tgl;

    // filter data sesuai tanggal
    const dataTanggal = dataPengeluaran.filter(
      item => item.tgl === tgl
    );

    // total
    const totalPengeluaran = dataTanggal.reduce((sum, item) => {

      return sum + Number(item.nominalPengeluaran || 0);

    }, 0);

    // html list
    const html = dataTanggal.map((item, index) => {

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.namaPengeluaran || "-"}</td>
          <td>
            Rp ${formatRupiah(item.nominalPengeluaran)}
          </td>
        </tr>
      `;

    }).join("");


    const namaKetua = window.dataProfil[0]?.namaKetua || "................................";


    // buka window print
    const w = window.open("", "_blank");

    w.document.write(`
      <html>
      <head>
        <title>Print Pengeluaran</title>

        <style>

          body{
            font-family:sans-serif;
            padding:20px;
          }

          h2,h3,p{
            margin:0;
            margin-bottom:10px;
            text-align:center;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          }

          th,td{
            border:1px solid #000;
            padding:8px;
            font-size:14px;
          }

          th{
            background:#f5f5f5;
          }

          .total{
            margin-top:20px;
            text-align:right;
            font-size:16px;
          }

            .ttd-container{
                width:100%;
                margin-top:50px;
                display:flex;
                justify-content:flex-end;
            }

            .ttd-box{
                text-align:center;
                width:250px;
            }

        </style>
      </head>

      <body>

        <h2>DATA PENGELUARAN</h2>
        <h3>BANK SAMPAH</h3>

        <p>Tanggal: ${formatTanggalIndonesia(tgl)}</p>

        <table>

          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pengeluaran</th>
              <th>Nominal</th>
            </tr>
          </thead>

          <tbody>
            ${html}
          </tbody>

        </table>

        <div class="total">
          <b>
            Total Pengeluaran:
            Rp ${formatRupiah(totalPengeluaran)}
          </b>
        </div>

        

        <br><br><br>

        <div class="ttd-container">

            <div class="ttd-box">

            <p>Mengetahui,</p>
            <p><b>Ketua Bank Sampah</b></p>

            <br><br><br><br>

            <p>
                <b>
                ${namaKetua}
                </b>
            </p>

            </div>

        </div>



      </body>
      </html>
    `);

    w.document.close();

    setTimeout(() => {
      w.print();
    }, 500);
  }





  // ===================================================
  // PRINT DETAIL
  // ===================================================
  if(e.target.classList.contains("btnPrint")){

    const tgl = e.target.dataset.tgl;

    // filter tanggal
    const dataTanggal = dataPengeluaran.filter(
      item => item.tgl === tgl
    );

    // grouping nama
    const grupNama = {};

    dataTanggal.forEach(item => {

      const nama =
        item.namaPengeluaran || "Tanpa Nama";

      if(!grupNama[nama]){

        grupNama[nama] = [];

      }

      grupNama[nama].push(item);

    });

    // html detail
    const htmlDetail = Object.keys(grupNama)

      .sort((a,b) => a.localeCompare(b))

      .map(nama => {

        const items = grupNama[nama];

        const totalOrang = items.reduce((sum, item) => {

          return sum +
            Number(item.nominalPengeluaran || 0);

        }, 0);

        return `

          <div class="box">

            <div class="headerNama">

              <b>${nama}</b><br>

              <small>
                Total:
                Rp ${formatRupiah(totalOrang)}
              </small>

            </div>

            <table>

              <thead>
                <tr>
                  <th>No</th>
                  <th>Nominal</th>
                </tr>
              </thead>

              <tbody>

                ${items.map((item,index) => `

                  <tr>
                    <td>${index + 1}</td>

                    <td>
                      Rp ${formatRupiah(item.nominalPengeluaran)}
                    </td>
                  </tr>

                `).join("")}

              </tbody>

            </table>

          </div>

        `;

      }).join("");


    // total semua
    const grandTotal = dataTanggal.reduce((sum, item) => {

      return sum +
        Number(item.nominalPengeluaran || 0);

    }, 0);


    // buka print
    const w = window.open("", "_blank");

    w.document.write(`
      <html>

      <head>

        <title>
          Print Detail Pengeluaran
        </title>

        <style>

          body{
            font-family:sans-serif;
            padding:20px;
          }

          h2,h3,p{
            text-align:center;
            margin:0;
            margin-bottom:10px;
          }

          .box{
            border:1px solid #ccc;
            border-radius:10px;
            margin-bottom:20px;
            overflow:hidden;
          }

          .headerNama{
            color:black;
            padding:10px;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          th,td{
            border:1px solid #ddd;
            padding:8px;
            font-size:14px;
          }

          th{
            background:#f5f5f5;
          }

          .grandTotal{
            margin-top:20px;
            text-align:right;
            font-size:16px;
          }

        </style>

      </head>

      <body>

        <h2>DETAIL PENGELUARAN</h2>
        <h3>BANK SAMPAH</h3>

        <p>Tanggal: ${formatTanggalIndonesia(tgl)}</p>

        ${htmlDetail}

        <div class="grandTotal">

          <b>
            Grand Total:
            Rp ${formatRupiah(grandTotal)}
          </b>

        </div>

      </body>

      </html>
    `);

    w.document.close();

    setTimeout(() => {
      w.print();
    }, 500);

  }

});