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

document.addEventListener("click", (e) => {

  // cek apakah tombol print diklik
  if (!e.target.classList.contains("btnPrint")) return;



  // =========================
  // AMBIL TANGGAL
  // =========================
  const tgl = e.target.dataset.tgl;



  // =========================
  // AMBIL DATA
  // =========================
  const semuaData = window.dataPenarikan || [];



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
  // TOTAL TANGGAL
  // =========================
  const totalPenarikanTanggal = data.reduce((sum, item) => {

    return sum +
      Number(item.nominalPenarikan || 0);

  }, 0);




  // =========================
  // WINDOW PRINT
  // =========================
  const win = window.open("", "", "width=900,height=700");



  let isi = `

  <html>

  <head>

    <title>
      Print Data Penarikan
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

      .header-total{
        margin-bottom:20px;
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
      Data Penarikan
    </h2>

    <div class="header-total">

      <p>
        Nama Bank Sampah:
        <b>${window.dataProfil[0]?.nama}</b>
      </p>

      <p>
        Tanggal:
        <b>${tgl}</b>
      </p>

      <p>
        Total Penarikan:
        <b>
          Rp ${new Intl.NumberFormat("id-ID")
            .format(totalPenarikanTanggal)}
        </b>
      </p>

    </div>

  `;




  // =========================
  // LOOP PER NAMA
  // =========================
  Object.keys(grupNama)

    .sort((a, b) => a.localeCompare(b))

    .forEach(nama => {

      const items = grupNama[nama];

      // total penarikan orang
      const totalPenarikanOrang = items.reduce((sum, item) => {

        return sum +
          Number(item.nominalPenarikan || 0);

      }, 0);




      isi += `

        <div class="nama-box">

          <h3>
            ${nama}
          </h3>

          <p>
            Total Penarikan:
            <b>
              Rp ${new Intl.NumberFormat("id-ID")
                .format(totalPenarikanOrang)}
            </b>
          </p>



          <table>

            <thead>

              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Penarikan</th>
              </tr>

            </thead>

            <tbody>

      `;




      // =========================
      // DETAIL ITEM
      // =========================
      items.forEach((item, i) => {

        isi += `

          <tr>

            <td>${i + 1}</td>

            <td>
              ${item.nama}
            </td>

            <td>
              Rp ${new Intl.NumberFormat("id-ID")
                .format(item.nominalPenarikan)}
            </td>

          </tr>

        `;

      });




      // =========================
      // TOTAL BAWAH TABEL
      // =========================
      isi += `

          <tr>

            <td colspan="2">
              <b>Total</b>
            </td>

            <td>
              <b>
                Rp ${new Intl.NumberFormat("id-ID")
                  .format(totalPenarikanOrang)}
              </b>
            </td>

          </tr>

        </tbody>

      </table>

    </div>

      `;

    });




  // =========================
  // FOOTER TOTAL
  // =========================
  isi += `

    <hr>

    <h3>
      Grand Total Tanggal:
    </h3>

    <p>
      <b>
        Total Penarikan:
        Rp ${new Intl.NumberFormat("id-ID")
          .format(totalPenarikanTanggal)}
      </b>
    </p>

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