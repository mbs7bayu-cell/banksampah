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

// print btnPrint


document.addEventListener("click", (e) => {

  if (!e.target.classList.contains("btnPrint")) return;

  // ambil tanggal dari tombol
  const tgl = e.target.dataset.tgl;

  // ambil semua data
  const semuaData = window.dataPenimbangan || [];

  // filter sesuai tanggal
  const data = semuaData.filter(n => n.tgl === tgl);



  // =========================
  // GROUP BERDASARKAN NAMA
  // =========================
  const grupNama = {};

  data.forEach(item => {

    const nama = item.nama || "Tanpa Nama";

    if (!grupNama[nama]) {
      grupNama[nama] = [];
    }

    grupNama[nama].push(item);

  });



  // =========================
  // TOTAL BERAT
  // =========================
  const totalBerat = data.reduce((sum, item) => {
    return Number(
      (
        sum + Number(item.beratSampah || 0)
      ).toFixed(2)
    );
  }, 0);



  // =========================
  // WINDOW PRINT
  // =========================
  const win = window.open("", "", "width=900,height=700");



  let isi = `
  <html>

  <head>

    <title>
      Print Penimbangan
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

      .nama-box{
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
      LAPORAN PENIMBANGAN BANK SAMPAH
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

      <tr>
        <td class="label">Total Berat</td>
        <td class="titik">:</td>
        <td><b>${totalBerat} kg</b></td>
      </tr>

    </table>


    </table>

    

  `;



  // =========================
  // LOOP PER NAMA
  // =========================
  Object.keys(grupNama)

    .sort((a, b) => a.localeCompare(b))

    .forEach(nama => {

      const items = grupNama[nama];



      // total per orang
      const totalOrang = items.reduce((sum, item) => {

        return sum + Number(item.beratSampah || 0);

      }, 0);



      isi += `

        <div class="nama-box">

          <h3>
            ${nama}
          </h3>

          <p>
            Total:
            <b>${totalOrang} kg</b>
          </p>

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>Jenis Sampah</th>
                <th>Berat</th>
                <th>Harga/satuan</th>
                <th>Harga</th>
              </tr>
            </thead>

            <tbody>

      `;



      items.forEach((item, i) => {

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
                .format(item.hargaNasabah)}
            </td>

            <td>
              Rp
              ${new Intl.NumberFormat("id-ID")
                .format(item.totalNasabah)}
            </td>

          </tr>

        `;

      });


      // ======================
      // TOTAL HARGA PER ORANG
      // ======================
      const totalHarga = items.reduce((sum, item) => {

        return sum + Number(item.totalNasabah || 0);

      }, 0);



      // ======================
      // BARIS TOTAL
      // ======================
      isi += `

        <tr>

          <td colspan="2">
            <b>Total</b>
          </td>

          <td>
            <b>${totalOrang} kg</b>
          </td>

          <td></td>

          <td>
            <b>
              Rp
              ${new Intl.NumberFormat("id-ID")
                .format(totalHarga)}
            </b>
          </td>

        </tr>

      `;



      isi += `

            </tbody>

          </table>

        </div>

      `;

    });

    isi += `

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

`;



  isi += `
    </body>
    </html>
  `;

  win.document.open();
  win.document.write(isi);
  win.document.close();

  setTimeout(() => {
    win.print();
  }, 500);

});


// Print khusus

document.addEventListener("click", (e) => {

  // =========================
  // PRINT KHUSUS JENIS SAMPAH
  // =========================
  if (!e.target.classList.contains("btnPrintKhusus")) return;



  // ambil tanggal
  const tgl = e.target.dataset.tgl;



  // semua data
  const semuaData = window.dataPenimbangan || [];



  // filter sesuai tanggal
  const data = semuaData.filter(n => n.tgl === tgl);




  // =========================
  // GROUP JENIS SAMPAH
  // =========================
  const grupJenis = {};



  data.forEach(item => {

    const jenis =
      item.jenisSampah || "Tanpa Jenis";



    // kalau belum ada
    if (!grupJenis[jenis]) {

      grupJenis[jenis] = {

        totalBerat: 0,
        totalPemasukan: 0,
        satuan: item.satuan || "Kg",
        hargaNasabah: item.hargaNasabah

      };

    }



    // tambah berat
    grupJenis[jenis].totalBerat +=
      Number(item.beratSampah || 0);

    // tambah pemasukan
    grupJenis[jenis].totalPemasukan +=
      Number(item.totalNasabah || 0);

  });





  // =========================
  // GRAND TOTAL
  // =========================
  const grandTotalBerat = data.reduce((sum, item) => {

    return Number(
    
      (
        sum + Number(item.beratSampah || 0)
      ).toFixed(2)
    
    );

  }, 0);




  const grandTotalPemasukan = data.reduce((sum, item) => {

    return sum +
      Number(item.totalNasabah || 0);

  }, 0);




  // =========================
  // WINDOW PRINT
  // =========================
  const win = window.open("", "", "width=900,height=700");



  let isi = `

  <html>

  <head>

    <title>
      LAPORAN PENIMBANGAN BANK SAMPAH
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

      th,td{
        border:1px solid #ccc;
        padding:8px;
        text-align:left;
      }

      th{
        background:#f5f5f5;
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
      LAPORAN PENIMBANGAN BANK SAMPAH
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

    <table>

      <thead>

        <tr>
          <th>No</th>
          <th>Jenis Sampah</th>
          <th>Berat</th>
          <th>Harga/satuan</th>
          <th>Total Harga</th>
        </tr>

      </thead>

      <tbody>

  `;




  // =========================
  // LOOP JENIS SAMPAH
  // =========================
  Object.keys(grupJenis)

    .sort((a, b) => a.localeCompare(b))

    .forEach((jenis, i) => {

      const item = grupJenis[jenis];



      isi += `

        <tr>

          <td>${i + 1}</td>

          <td>
            ${jenis}
          </td>

          <td>
            ${item.totalBerat}
            ${item.satuan}
          </td>

          <td>
            Rp ${new Intl.NumberFormat("id-ID")
              .format(item.hargaNasabah)}
          </td>

          <td>
            Rp ${new Intl.NumberFormat("id-ID")
              .format(item.totalPemasukan)}
          </td>

        </tr>

      `;

    });




  // =========================
  // TOTAL BAWAH
  // =========================
  isi += `

      <tr>

        <td colspan="2">
          <b>Grand Total</b>
        </td>

        <td>
          <b>
            ${grandTotalBerat} Kg
          </b>
        </td>

        <td></td>

        <td>
          <b>
            Rp ${new Intl.NumberFormat("id-ID")
              .format(grandTotalPemasukan)}
          </b>
        </td>

      </tr>

      </tbody>

    </table>

  </body>

  </html>

  `;

  isi += `

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