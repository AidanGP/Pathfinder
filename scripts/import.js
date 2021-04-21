// csv -> 2d array
const csvToArr = (csv) => {
  /* 
  
  */
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
  /* 
  
  */
  // Check if the buttons are disabled
  if (is_disabled) return;
  var file_in = document.getElementById("file-input");

  // Check when the contents of the file input is changed
  file_in.onchange = (e) => {
    // Get the file
    const file = e.target.files[0];
    var reader = new FileReader();
    // Read the file
    reader.readAsText(file, "UTF-8");

    // Check that the file is a csv
    if (!file.name.includes(".csv")) {
      alert("Sorry, that doesn't look like a csv file.");
      return;
    }

    // When the file is loaded
    reader.onload = (readerEvent) => {
      // Get content of file
      const content = readerEvent.target.result;
      // convert the csv to a 2d array
      const arr = csvToArr(content);
      // Set the grid to said array
      setGrid(arr);
      setMouseListeners();
    };
  };
  file_in.click();
};
