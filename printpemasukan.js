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


//print



document.addEventListener("click", (e) => {

  if (!e.target.classList.contains("btnPrint")) return;

  const tgl = e.target.dataset.tgl;



  // =========================
  // DATA
  // =========================

  const dataPenimbanganTanggal =

    (window.dataPenimbangan || [])

      .filter(n => n.tgl === tgl);



  const dataSortirTanggal =

    (window.dataSortir || [])

      .filter(n => n.tgl === tgl);




  // =========================
  // TOTAL
  // =========================

  const totalNasabah =

    dataPenimbanganTanggal.reduce((sum, item) => {

      return sum +
        Number(item.totalNasabah || 0);

    }, 0);




  const totalJual =

    dataSortirTanggal.reduce((sum, item) => {

      return sum +
        Number(item.totalJual || 0);

    }, 0);




  const totalPemasukan =

    totalJual - totalNasabah;




  // =========================
  // TOTAL BERAT
  // =========================

  const totalBeratPenimbangan =

    dataPenimbanganTanggal.reduce((sum, item) => {

      return Number(
        (sum + (item.beratSampah || 0)).toFixed(2)
      );

    }, 0);




  const totalBeratSortir =

    dataSortirTanggal.reduce((sum, item) => {

      return Number(
        (sum + (item.beratSampah || 0)).toFixed(2)
      );

    }, 0);




  // =========================
  // WINDOW PRINT
  // =========================

  const win =
    window.open("", "", "width=900,height=700");




  let isi = `

  <html>

  <head>

    <title>
      LAPORAN DATA PEMASUKAN
    </title>

    <style>

      body{
        font-family:sans-serif;
        padding:20px;
      }

      h2,h3{
        margin-bottom:5px;
      }

      table{
        width:100%;
        border-collapse:collapse;
        margin-bottom:20px;
      }

      th,td{
        border:1px solid #ccc;
        padding:8px;
        text-align:left;
      }

      th{
        background:#f5f5f5;
      }

      .box{
        margin-bottom:30px;
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

    <h2>
      LAPORAN DATA PEMASUKAN BANK SAMPAH
    </h2>

    <p>
      Nama:
      <b>${window.dataProfil[0]?.nama}</b>
    </p>

    <p>
      RW / Kelurahan:
      <b>${window.dataProfil[0]?.namaKel}</b>
    </p>

    <p>
      Kecamatan:
      <b>${window.dataProfil[0]?.namaKec}</b>
    </p>

    <p>
      Tanggal:
      <b>${formatTanggalIndonesia(tgl)}</b>
    </p>

  `;




  // =========================
  // PENIMBANGAN
  // =========================

  isi += `

    <div class="box">

      <h3>Data Penimbangan Nasabah</h3>

      <table>

        <thead>

          <tr>
            <th>No</th>
            <th>Jenis Sampah</th>
            <th>Berat</th>
            <th>Total Nasabah</th>
          </tr>

        </thead>

        <tbody>

  `;




  dataPenimbanganTanggal.forEach((item, i) => {

    isi += `

      <tr>

        <td>${i + 1}</td>

        <td>
          ${item.jenisSampah}
        </td>

        <td>
          ${item.beratSampah}
          ${item.satuan}
        </td>

        <td>
          Rp ${new Intl.NumberFormat("id-ID")
            .format(item.totalNasabah || 0)}
        </td>

      </tr>

    `;

  });




  isi += `

        <tr>

          <td colspan="2">
            <b>Total</b>
          </td>

          <td>
            <b>
              ${totalBeratPenimbangan} Kg
            </b>
          </td>

          <td>
            <b>
              Rp ${new Intl.NumberFormat("id-ID")
                .format(totalNasabah)}
            </b>
          </td>

        </tr>

        </tbody>

      </table>

    </div>

  `;




  // =========================
  // SORTIR
  // =========================

  isi += `

    <div class="box">

      <h3>Data Sortir</h3>

      <table>

        <thead>

          <tr>
            <th>No</th>
            <th>Jenis Sampah</th>
            <th>Berat</th>
            <th>Total Jual</th>
          </tr>

        </thead>

        <tbody>

  `;




  dataSortirTanggal.forEach((item, i) => {

    isi += `

      <tr>

        <td>${i + 1}</td>

        <td>
          ${item.jenisSampah}
        </td>

        <td>
          ${item.beratSampah}
          ${item.satuan}
        </td>

        <td>
          Rp ${new Intl.NumberFormat("id-ID")
            .format(item.totalJual || 0)}
        </td>

      </tr>

    `;

  });




  isi += `

        <tr>

          <td colspan="2">
            <b>Total</b>
          </td>

          <td>
            <b>
              ${totalBeratSortir} Kg
            </b>
          </td>

          <td>
            <b>
              Rp ${new Intl.NumberFormat("id-ID")
                .format(totalJual)}
            </b>
          </td>

        </tr>

        </tbody>

      </table>

    </div>

  `;




  // =========================
  // PEMASUKAN
  // =========================

  isi += `

    <hr>

    <h3>
      Total Pemasukan
    </h3>

    <p>
      Total Jual:
      <b>
        Rp ${new Intl.NumberFormat("id-ID")
          .format(totalJual)}
      </b>
    </p>

    <p>
      Total Nasabah:
      <b>
        Rp ${new Intl.NumberFormat("id-ID")
          .format(totalNasabah)}
      </b>
    </p>

    <p>
      Pemasukan:
      <b>
        Rp ${new Intl.NumberFormat("id-ID")
          .format(totalPemasukan)}
      </b>
    </p>

  `;




  // =========================
  // TTD
  // =========================

  isi += `

    <br>

    <div class="ttd-container">

      <div class="ttd-box">

        <p>Mengetahui,</p>

        <p>
          <b>Ketua Bank Sampah</b>
        </p>

        <br><br><br><br>

        <p>
          <b>
            ${window.dataProfil[0]?.namaKetua}
          </b>
        </p>

      </div>

    </div>

  `;




  isi += `

    </body>

    </html>

  `;




  // =========================
  // PRINT
  // =========================

  win.document.open();

  win.document.write(isi);

  win.document.close();

  setTimeout(() => {

    win.print();

  }, 500);

});