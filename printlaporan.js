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

// print khusu

// =========================================================
// PRINT REKAP JENIS SAMPAH
// =========================================================

document.addEventListener("click", function(e){

  if(e.target.classList.contains("btnPrint")){

    const tgl = e.target.dataset.tgl;

    // =====================================================
    // FILTER DATA PENIMBANGAN NASABAH
    // =====================================================

    const dataTanggal =
      window.dataPenimbangan.filter(item => {

        return item.tgl === tgl;

      });

    // =====================================================
    // FILTER DATA SORTIR
    // =====================================================

    const dataSortirTanggal =
      window.dataSortir.filter(item => {

        return item.tgl === tgl;

      });

    // =====================================================
    // FILTER DATA PENGELUARAN
    // =====================================================

    const dataPengeluaranTanggal =
      window.dataPengeluaran.filter(item => {

        return item.tgl === tgl;

      });

    // =====================================================
    // GROUPING PENIMBANGAN NASABAH
    // =====================================================

    const grupJenis = {};

    dataTanggal.forEach(item => {

      const jenis =
        item.jenisSampah || "Tanpa Jenis";

      if(!grupJenis[jenis]){

        grupJenis[jenis] = {

          berat: 0,
          total: 0,
          satuan: item.satuan || "Kg"

        };

      }

      grupJenis[jenis].berat +=
        Number(item.beratSampah || 0);

      grupJenis[jenis].total +=
        Number(item.totalNasabah || 0);

    });

    // =====================================================
    // GROUPING SORTIR
    // =====================================================

    const grupSortir = {};

    dataSortirTanggal.forEach(item => {

      const jenis =
        item.jenisSampah || "Tanpa Jenis";

      if(!grupSortir[jenis]){

        grupSortir[jenis] = {

          berat: 0,
          totalJual: 0,
          satuan: item.satuan || "Kg"

        };

      }

      grupSortir[jenis].berat +=
        Number(item.beratSampah || 0);

      grupSortir[jenis].totalJual +=
        Number(item.totalJual || 0);

    });

    // =====================================================
    // TOTAL NASABAH
    // =====================================================

    const grandBerat =
      Object.values(grupJenis)

        .reduce((sum, item) => {

          return Number(
            (sum + item.berat).toFixed(2)
          );

        }, 0);

    const grandTotal =
      Object.values(grupJenis)

        .reduce((sum, item) => {

          return sum + item.total;

        }, 0);

    // =====================================================
    // TOTAL SORTIR
    // =====================================================

    const grandBeratSortir =
      Object.values(grupSortir)

        .reduce((sum, item) => {

          return Number(
            (sum + item.berat).toFixed(2)
          );

        }, 0);

    const grandTotalJual =
      Object.values(grupSortir)

        .reduce((sum, item) => {

          return sum + item.totalJual;

        }, 0);

    // =====================================================
    // TOTAL PENGELUARAN
    // =====================================================

    const totalPengeluaran =
      dataPengeluaranTanggal.reduce((sum, item) => {

        return sum +
          Number(item.nominalPengeluaran || 0);

      }, 0);

    // =====================================================
    // SALDO BERJALAN
    // =====================================================

    const semuaTanggal = [

      ...new Set([

        ...window.dataPenimbangan.map(n => n.tgl),
        ...window.dataPengeluaran.map(n => n.tgl),
        ...window.dataSortir.map(n => n.tgl)

      ])

    ]

    .sort((a, b) => new Date(a) - new Date(b));

    let saldoBerjalan = 0;

    semuaTanggal.forEach(tanggal => {

      if(new Date(tanggal) > new Date(tgl)){
        return;
      }

      // ================= SORTIR =================

      const sortirTanggal =
        window.dataSortir.filter(n => {

          return n.tgl === tanggal;

        });

      const totalSortir =
        sortirTanggal.reduce((sum, item) => {

          return sum +
            Number(item.totalJual || 0);

        }, 0);

      // ================= NASABAH =================

      const pemasukanTanggal =
        window.dataPenimbangan.filter(n => {

          return n.tgl === tanggal;

        });

      const totalNasabah =
        pemasukanTanggal.reduce((sum, item) => {

          return sum +
            Number(item.totalNasabah || 0);

        }, 0);

      // ================= PENGELUARAN =================

      const pengeluaranTanggal =
        window.dataPengeluaran.filter(n => {

          return n.tgl === tanggal;

        });

      const totalKeluar =
        pengeluaranTanggal.reduce((sum, item) => {

          return sum +
            Number(item.nominalPengeluaran || 0);

        }, 0);

      // ================= SALDO =================

      saldoBerjalan +=
        totalSortir -
        totalNasabah -
        totalKeluar;

    });

    const saldo = saldoBerjalan;

    // =====================================================
    // HTML TABLE NASABAH
    // =====================================================

    const htmlTable = `

      <h3>Data Penimbangan Nasabah</h3>

      <table>

        <thead>

          <tr>

            <th>No</th>

            <th>Jenis Sampah</th>

            <th>Total Berat</th>

            <th>Total Harga Nasabah</th>

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

                  <td align="right">

                    Rp ${new Intl.NumberFormat("id-ID")
                      .format(item.total)}

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

            <td align="right">

              Rp ${new Intl.NumberFormat("id-ID")
                .format(grandTotal)}

            </td>

          </tr>

        </tbody>

      </table>

    `;

    // =====================================================
    // HTML TABLE SORTIR
    // =====================================================

    const htmlTableSortir = `

      <h3>Data Penjualan Sortir</h3>

      <table>

        <thead>

          <tr>

            <th>No</th>

            <th>Jenis Sampah</th>

            <th>Total Berat</th>

            <th>Total Penjualan</th>

          </tr>

        </thead>

        <tbody>

          ${Object.keys(grupSortir)

            .sort((a, b) => a.localeCompare(b))

            .map((jenis, index) => {

              const item = grupSortir[jenis];

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
              ${grandBeratSortir} Kg
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
    // HTML TABLE PENGELUARAN
    // =====================================================

    const htmlPengeluaran = `

      <h3>Data Pengeluaran</h3>

      <table>

        <thead>

          <tr>

            <th>No</th>

            <th>Keterangan</th>

            <th>Nominal</th>

          </tr>

        </thead>

        <tbody>

          ${dataPengeluaranTanggal.map((item, index) => `

            <tr>

              <td align="center">
                ${index + 1}
              </td>

              <td>
                ${item.namaPengeluaran}
              </td>

              <td align="right">

                Rp ${new Intl.NumberFormat("id-ID")
                  .format(item.nominalPengeluaran)}

              </td>

            </tr>

          `).join("")}

          <tr style="
            font-weight:bold;
            background:#f0f0f0;
          ">

            <td colspan="2" align="center">
              TOTAL PENGELUARAN
            </td>

            <td align="right">

              Rp ${new Intl.NumberFormat("id-ID")
                .format(totalPengeluaran)}

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
          Rekap Sampah ${tgl}
        </title>

        <style>

          body{
            font-family:sans-serif;
            padding:20px;
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

          .info{
            border-collapse: collapse;
          }

          .info td{
            padding: 4px 0;
            vertical-align: top;
          }

          .info td {
            border: none;
            }

          .info .label{
            width: 180px;
          }

          .info .titik{
            width: 20px;
            text-align: center;
          }

        </style>

      </head>

      <body>

        <h2>
          LAPORAN LENGKAP BANK SAMPAH
        </h2>

        <table class="info">
        <tr>
            <td class="label">Nama Bank Sampah</td>
            <td class="titik">:</td>
            <td><b>${window.dataProfil[0]?.nama}</b></td>
        </tr>

        <tr>
            <td class="label">RW / Kelurahan</td>
            <td class="titik">:</td>
            <td><b>${window.dataProfil[0]?.namaKel}</b></td>
        </tr>

        <tr>
            <td class="label">Kecamatan</td>
            <td class="titik">:</td>
            <td><b>${window.dataProfil[0]?.namaKec}</b></td>
        </tr>

        <tr>
            <td class="label">Tanggal</td>
            <td class="titik">:</td>
            <td><b>${formatTanggalIndonesia(tgl)}</b></td>
        </tr>

        </table>

        ${htmlTable}

        <br>

        ${htmlTableSortir}

        <br>

        ${htmlPengeluaran}

        <div style="
          margin-top:20px;
          border:1px solid #000;
          padding:12px;
        ">

          <p>

            <b>
              Total Penimbangan Nasabah:
              Rp ${new Intl.NumberFormat("id-ID")
                .format(grandTotal)}
            </b>

          </p>

          <p>

            <b>
              Total Penjualan Sortir:
              Rp ${new Intl.NumberFormat("id-ID")
                .format(grandTotalJual)}
            </b>

          </p>

          <p>

            <b>
              Total Pengeluaran:
              Rp ${new Intl.NumberFormat("id-ID")
                .format(totalPengeluaran)}
            </b>

          </p>

          <p>

            <b>
              Selisih:
              Rp ${new Intl.NumberFormat("id-ID")
                .format(
                  grandTotalJual -
                  grandTotal -
                  totalPengeluaran
                )}
            </b>

          </p>

          <p>

            <b>
              Saldo Berjalan:
              Rp ${new Intl.NumberFormat("id-ID")
                .format(saldo)}
            </b>

          </p>

        </div>

        <br>

        <div class="ttd-container">

          <div class="ttd-box">

            <p>Mengetahui,</p>
            <p><b>Ketua Bank Sampah</b></p>

            <br><br><br><br>

            <p>
              <b>
                ${window.dataProfil[0]?.namaKetua}
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