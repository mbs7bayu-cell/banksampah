btnPrint.addEventListener("click", () => {

  const data = window.dataSampah || [];

  const win = window.open("", "", "width=800,height=600");

  let isi = `
  <html>
  <head>
  <title>Print Data Sampah</title>
  <style>
    body{font-family:sans-serif;padding:20px;}
    table{width:100%;border-collapse:collapse;}
    th,td{border:1px solid #ccc;padding:8px;text-align:left;}
    h2{text-align:center;margin-bottom:20px;}
  </style>
  </head>
  <body>

  <h2>Data Sampah</h2>

  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Jenis Sampah</th>
        <th>Satuan</th>
        <th>Harga Nasabah</th>
        <th>Harga Jual</th>
      </tr>
    </thead>
    <tbody>
  `;

  data.forEach((n, i) => {
    isi += `
      <tr>
        <td>${i + 1}</td>
        <td>${n.jenisSampah}</td>
        <td>${n.satuan}</td>
        <td>${new Intl.NumberFormat("id-ID").format(n.hargaNasabah)}</td>
        <td>${new Intl.NumberFormat("id-ID").format(n.hargaJual)}</td>
      </tr>
    `;
  });

  isi += `
    </tbody>
  </table>

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