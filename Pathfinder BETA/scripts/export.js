const saveBoard = () => {
    if (disable_btns) return;
    const file_name = prompt("Please enter a file name", "File Name");
    if (file_name != null) {
      const grid = gridToArray();
      var csvRows = [];
      for (var i = 0; i < grid.length; ++i) {
        csvRows.push(grid[i].join(","));
      }
  
      var csvString = csvRows.join("\r\n");
      var a = document.createElement("a");
      a.href = "data:attachment/csv," + csvString;
      a.target = "_blank";
      a.download = file_name + ".csv";
  
      document.body.appendChild(a);
      a.click();
    }
  };