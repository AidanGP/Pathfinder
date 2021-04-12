const csvToArr = (csv) => {
  const rows = csv.split("\n");
  let arr = [];
  for (let i = 0; i < rows.length; i++) {
    arr.push([]);
    const row = rows[i].split(",");
    for (let j = 0; j < row.length; j++) {
      arr[i].push(parseInt(row[j]));
    }
  }
  return arr;
};

const importToBoard = () => {
  if (disable_btns) return;
  var file_in = document.getElementById("file-input");

  file_in.onchange = (e) => {
    const file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    // Check that the file is a csv
    if (!file.name.includes(".csv")) {
      alert("Sorry, that doesn't look like a csv file.");
      return;
    }

    reader.onload = (readerEvent) => {
      const content = readerEvent.target.result;
      const arr = csvToArr(content);

      setGrid(arr);
      setMouseListeners();
    };
  };
  file_in.click();
};
