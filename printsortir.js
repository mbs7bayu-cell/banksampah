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

// =========================================================
// LOAD PROFIL
// =========================================================

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


// =========================================================
// PRINT SORTIR
// =========================================================

document.addEventListener("click", function(e){

  if(e.target.classList.contains("btnPrint")){

    const tgl = e.target.dataset.tgl;

    // =====================================================
    // FILTER DATA SORTIR
    // =====================================================

    const dataTanggal =
      window.dataSortir.filter(item => {

        return item.tgl === tgl;

      });

    // =====================================================
    // GROUPING JENIS SAMPAH
    // =====================================================

    const grupJenis = {};

    dataTanggal.forEach(item => {

      const jenis =
        item.jenisSampah || "Tanpa Jenis";

      if(!grupJenis[jenis]){

        grupJenis[jenis] = {

          berat: 0,
          totalJual: 0,
          hargaJual: 0,
          satuan: item.satuan || "Kg"

        };

      }

      grupJenis[jenis].hargaJual =
        Number(item.hargaJual || 0);

      grupJenis[jenis].berat = Number(
        (
          grupJenis[jenis].berat +
          Number(item.beratSampah || 0)
        ).toFixed(2)
      );

      grupJenis[jenis].totalJual +=
        Number(item.totalJual || 0);

    });

    // =====================================================
    // GRAND TOTAL
    // =====================================================

    const grandBerat =
      Object.values(grupJenis)

        .reduce((sum, item) => {

          return Number(
            (sum + item.berat).toFixed(2)
          );

        }, 0);

    const grandTotalJual =
      Object.values(grupJenis)

        .reduce((sum, item) => {

          return sum + item.totalJual;

        }, 0);

    // =====================================================
    // HTML TABLE
    // =====================================================

    const htmlTable = `

      <table>

        <thead>

          <tr>

            <th>No</th>

            <th>Jenis Sampah</th>

            <th>Total Berat</th>

            <th>Harga/satuan</th>

            <th>Total Harga Jual</th>

          </tr>

        </thead>

        <tbody>

          ${Object.keys(grupJenis)

            .sort((a, b) => a.localeCompare(b))

            .map((jenis, index) => {

              const item = grupJenis[jenis];

              return `

                <tr>

                  <td align="center">
                    ${index + 1}
                  </td>

                  <td>
                    ${jenis}
                  </td>

                  <td align="center">

                    ${item.berat}
                    ${item.satuan}

                  </td>

                  <td align="center">

                    Rp ${new Intl.NumberFormat("id-ID")
                       .format(item.hargaJual)}

                  </td>

                  <td align="right">

                    Rp ${new Intl.NumberFormat("id-ID")
                      .format(item.totalJual)}

                  </td>

                </tr>

              `;

            }).join("")}

          <tr style="
            font-weight:bold;
            background:#f0f0f0;
          ">

            <td colspan="2" align="center">
              GRAND TOTAL
            </td>

            <td align="center">

              ${grandBerat} Kg

            </td>

            <td align="center">

              

            </td>

            <td align="right">

              Rp ${new Intl.NumberFormat("id-ID")
                .format(grandTotalJual)}

            </td>

          </tr>

        </tbody>

      </table>

    `;

    // =====================================================
    // WINDOW PRINT
    // =====================================================

    const win = window.open("", "_blank");

    win.document.write(`

      <html>

      <head>

        <title>
          Print Sortir ${tgl}
        </title>

        <style>

          body{
            font-family:sans-serif;
            padding:20px;
            color:#000;
          }

          h2{
            text-align:center;
            margin-bottom:20px;
          }

          table{
            width:100%;
            border-collapse:collapse;
            margin-top:20px;
          }

          th, td{
            border:1px solid #000;
            padding:8px;
          }

          th{
            background:#f0f0f0;
          }

          .info{
            border-collapse: collapse;
            margin-bottom:20px;
          }

          .info td{
            border:none;
            padding:4px 0;
          }

          .info .label{
            width:180px;
          }

          .info .titik{
            width:20px;
            text-align:center;
          }

          .ttd-container{
            width:100%;
            margin-top:60px;
            display:flex;
            justify-content:flex-end;
          }

          .ttd-box{
            width:250px;
            text-align:center;
          }

          @media print{

            body{
              margin:0;
            }

            button{
              display:none;
            }

          }

        </style>

      </head>

      <body>

        <h2>
          LAPORAN SORTIR BANK SAMPAH
        </h2>

        <table class="info">

          <tr>

            <td class="label">
              Nama Bank Sampah
            </td>

            <td class="titik">
              :
            </td>

            <td>

              <b>
                ${window.dataProfil[0]?.nama || "-"}
              </b>

            </td>

          </tr>

          <tr>

            <td class="label">
              RW / Kelurahan
            </td>

            <td class="titik">
              :
            </td>

            <td>

              <b>
                ${window.dataProfil[0]?.namaKel || "-"}
              </b>

            </td>

          </tr>

          <tr>

            <td class="label">
              Kecamatan
            </td>

            <td class="titik">
              :
            </td>

            <td>

              <b>
                ${window.dataProfil[0]?.namaKec || "-"}
              </b>

            </td>

          </tr>

          <tr>

            <td class="label">
              Tanggal
            </td>

            <td class="titik">
              :
            </td>

            <td>

              <b>
                ${formatTanggalIndonesia(tgl)}
              </b>

            </td>

          </tr>

        </table>

        ${htmlTable}

        <div style="
          margin-top:20px;
          border:1px solid #000;
          padding:12px;
        ">

          <p>

            <b>
              Total Berat:
              ${grandBerat} Kg
            </b>

          </p>

          <p>

            <b>
              Total Penjualan:
              Rp ${new Intl.NumberFormat("id-ID")
                .format(grandTotalJual)}
            </b>

          </p>

        </div>

        <div class="ttd-container">

          <div class="ttd-box">

            <p>Mengetahui,</p>

            <p>
              <b>
                Ketua Bank Sampah
              </b>
            </p>

            <br><br><br><br>

            <p>

              <b>
                ${window.dataProfil[0]?.namaKetua || "-"}
              </b>

            </p>

          </div>

        </div>

      </body>

      </html>

    `);

    win.document.close();

    setTimeout(() => {

      win.print();

    }, 1000);

  }

});