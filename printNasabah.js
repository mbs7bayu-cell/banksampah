// ================= PRINT DATA =================

btnPrint.addEventListener("click", () => {

  const win = window.open("", "", "width=800,height=600");

  let isi = "";

  isi += "<html>";
  isi += "<head>";
  isi += "<title>Print Data Nasabah</title>";

  isi += "<style>";
  isi += "body{font-family:sans-serif;padding:20px;}";
  isi += "table{width:100%;border-collapse:collapse;}";
  isi += "th,td{border:1px solid #ccc;padding:8px;text-align:left;text-align:center;}";
  isi += "h2{text-align:center;margin-bottom:20px;}";
  isi += "</style>";

  isi += "</head>";
  isi += "<body>";

  isi += "<h2>Data Nasabah</h2>";

  isi += "<table>";

  isi += "<thead>";
  isi += "<tr>";
  isi += "<th>No</th>";
  isi += "<th>Nama</th>";
  isi += "<th>No HP</th>";
  isi += "<th>Alamat</th>";
  isi += "</tr>";
  isi += "</thead>";

  isi += "<tbody>";

  dataNasabah.forEach((n, i) => {

    isi += "<tr>";
    isi += "<td>" + (i + 1) + "</td>";
    isi += "<td>" + n.nama.toUpperCase() + "</td>";
    isi += "<td>" + n.noHp + "</td>";
    isi += "<td>" + n.alamat.toUpperCase() + "</td>";
    isi += "</tr>";

  });

  isi += "</tbody>";
  isi += "</table>";

  isi += "</body>";
  isi += "</html>";

  win.document.open();
  win.document.write(isi);
  win.document.close();

  setTimeout(() => {
    win.print();
  }, 500);

});