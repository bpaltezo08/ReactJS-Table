# ReactJS-Table

# REQUIRED MODULES

import { CSVLink } from "react-csv";


# ADDING TO PROJECT

import Table from 'table.js';


# USAGE

Table({
  id: 'table id',
  title: 'Header Title',
  columns: [{title, field}],
  data: [array of data],
  buttons: [{tooltip, icon, color, onClick: function()}],
  onSearch: function(term, tabledata),
  onChangeBatch: function(direction ("prev", "next"), tabledata)
});
