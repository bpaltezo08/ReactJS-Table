import React from 'react';
import { MDBCol, MDBIcon } from 'mdbreact'
import { CSVLink } from "react-csv";

export default function Table(props) {

  let storage = "";
  let range = 5;
  let page = 0;
  let limit = 0;
  let colspan = 1;
  let columns =
    [
      { title: 'Name', field: 'name' },
      { title: 'Quarantine Days', field: 'days' },
      { title: 'Town', field: 'town_city' },
      { title: 'Gender', field: 'gender' },
      { title: 'Age', field: 'age' },
      { title: 'Nationality', field: 'nationality' },
    ];
  let buttons = [];
  let initialData = [];
  let id = "";
  let title = "";
  let toSearch = "";
  let loading = false;

  let onSearchEmpty = null;

  id = props.id != undefined ? props.id : 'customdatatable'
  title = props.title || "Custom Table"
  range = props.offset || 5;
  limit = props.data.length;
  columns = props.useDefaultColumn ? columns : props.columns;
  buttons = props.buttons;
  initialData = props.data;
  onSearchEmpty = props.onSearchEmpty ? props.onSearchEmpty : null;
  columns.push({
    title: 'Action',
    field: 'Action'
  });
  colspan = props.useDefaultColumn ? columns.length : props.columns.length;

  let headers = columns.map(function (val, index) {
    return (<th>{val.title}</th>);
  })

  let rows = renderRows(props.data, columns, buttons);

  //CHECK IF EMPTY APPLY DELAY
  if (rows.length == 0) {
    rows = Loading();
  }

  return (
    <MDBCol md="12" className='mt-5 mb-5'>
      <div class='row'>
        <div class='col-md-12'>
          <h4>{props.title || 'Custom DataTable'}</h4>
          {/* <center><small class='text-center'>{props.subtitle || 'Subtitle'}</small></center> */}
        </div>
      </div>
      <button id={id + "loading"} className='hidden' onClick={handleWillLoad}></button>
      <button id={id + "reload"} className='hidden' onClick={handleReload}></button>
      <br></br>
      <div class='row'>
        <div class='col-md-4' style={{ display: 'block' }}>
          <div class="input-group mb-3">
            <input type="text" placeholder="Search" class='form-control' aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={handleOnSearchChange}></input>
            <div class="input-group-append">
              <button id={id + 'searchBtn'} onClick={handleOnSearch} className="btn-sm" ><i class='fa fa-search'></i></button>
            </div>
          </div>
        </div>
        <div class='col-md-6'></div>
        <div class='col-md-2'>
          <select class='form-control' style={{ fontSize: '10pt' }} onChange={onExportChange}>
            <option selected>Export Data</option>
            <option>CSV</option>
            <option>Print</option>
          </select>
        </div>
      </div>
      <table class='table table-bordered hover table-striped' id={'main' + id}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody id={id}>
          {rows}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={colspan}>
              <div class='row'>
                <div className='col-lg-3'>
                  Showing&nbsp;
                    <span id={id + 'pageStart'}>1</span> - &nbsp;
                    <span id={id + 'pageEnd'}>{range}</span> of&nbsp;
                    <span id={id + 'pageTotal'}>{limit}</span>
                </div>
                <div className='col-lg-6 text-center text-black-50' >
                  <i type='button' class='fa fa-angle-double-left' id={id + 'pagePrev'} style={{ marginRight: '10%' }} onClick={Prev}></i>
                  <a type='button' class='' disabled data-dir='-' onClick={handleOnChangeBatch}>Previous Batch</a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <a type='button' class='' disabled id={id + 'pageNextBatch'} data-dir='+' onClick={handleOnChangeBatch}>Next Batch</a>
                  <i type='button' class='fa fa-angle-double-right' id={id + 'pageNext'} style={{ marginLeft: '10%' }} onClick={Next}></i>
                </div>
                <div className='col-lg-3 text-right text-black-50'>
                  <select className='' onChange={onRangeChange}>
                    <option value='5' selected>5 Rows</option>
                    <option value='10'>10 Rows</option>
                    <option value='20'>20 Rows</option>
                  </select>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </MDBCol>
  );

  function renderRows(data, columns, buttons, stringed = false) {
    return data.map(function (rowval, x) {
      let cols = columns.map(function (colval, y) {
        if (colval.field == 'Action' && buttons.length > 0) {
          let btns = buttons.map(function (btn, z) {
            if (stringed) {
              let li = document.createElement("li");
              let xbtn = document.createElement("a");
              let icon = document.createElement('i');
              li.className = "page-item";
              xbtn.onclick = btn.onClick;
              xbtn.title = btn.tooltip;
              xbtn.className = "btn btn-sm " + btn.color;
              xbtn.setAttribute("data-metadata", JSON.stringify(rowval));
              icon.className = "fa " + btn.icon;
              // icon.style = "font-size: 14px";
              xbtn.appendChild(icon);
              li.appendChild(xbtn);
              return li;
            } else {
              return (<li class="page-item"><a class={"page-link btn btn-sm " + btn.color} title={btn.tooltip} data-metadata={JSON.stringify(rowval)} onClick={btn.onClick} href="javascrip:void(0)">
                <i class={"fa " + btn.icon}></i>
              </a></li>)
            }
          })
          if (stringed) {
            let td = document.createElement("td");
            let nav = document.createElement("nav");
            let ul = document.createElement("ul");
            td.style = `width: ${btns.length > 1 ? (9 + btns.length) : 6.5}vw`;
            nav.setAttribute("aria-label", "...")
            ul.className = "pagination pagination-sm text-center"
            for (var t = 0; t < btns.length; t++) {
              ul.appendChild(btns[t]);
            }
            nav.appendChild(ul);
            td.appendChild(nav);
            return td;
          } else {

            return (<td style={{ width: `${btns.length > 1 ? (9 + btns.length) : 6.5}vw` }}>
              <nav aria-label="...">
                <ul class="pagination pagination-sm">{btns}</ul>
              </nav></td>)
          }
        } else {
          if (stringed) {
            let td = document.createElement("td");
            let coldata = Object.values(rowval)[Object.keys(rowval).indexOf(colval.field)]
            if (typeof coldata == "object" && coldata != null) {
              let el = document.createElement(coldata.type);
              let keys = Object.keys(coldata.props);
              let vals = Object.values(coldata.props);
              for (var e = 0; e < keys.length; e++) {
                if (keys[e] == "children") el.innerText = vals[e];
                else el[keys[e].toLowerCase()] = vals[e];
              }
              td.appendChild(el);
            } else {
              td.innerText = coldata;
            }
            return td;
          } else {
            return (<td>{Object.values(rowval)[Object.keys(rowval).indexOf(colval.field)]}</td>)
          }
        }
      })
      //PAGINATION
      if (x >= page && x <= range) {
        if (stringed) {
          let tr = document.createElement("tr");
          tr.style.display = '';
          for (var t = 0; t < cols.length; t++) {
            tr.appendChild(cols[t]);
          }
          return tr;
        } else {
          return (<tr style={{ display: '' }}>{cols}</tr>)
        }
      } else {
        if (stringed) {
          let tr = document.createElement("tr");
          tr.style.display = 'none';
          for (var t = 0; t < cols.length; t++) {
            tr.appendChild(cols[t]);
          }
          return tr;
        } else {
          return (<tr style={{ display: 'none' }}>{cols}</tr>)
        }
      }
    })
  }

  function onExportChange(e) {
    if (limit > 0) {
      if (e.target.value == "CSV") {
        export2csv();
      } else if (e.target.value == "Print") {
        PrintElem("main" + id, title);
      }
    }
  }

  function onRangeChange(e) {
    if (limit > 0) {
      range = e.target.value;
      page = 0;
      let htmlrows = $("#" + id).childNodes;
      let offset;
      for (var x = 0; x < htmlrows.length; x++) {
        htmlrows[x].style.display = 'none';
      }
      for (var x = 0; x < range; x++) {
        offset = page * range + x;
        if (offset < htmlrows.length) {
          htmlrows[offset].style.display = '';
        }
      }
      $("#" + id + "pageStart").innerText = page * range + 1;
      $("#" + id + "pageEnd").innerText = offset + 1;
    }
  }

  function handleOnSearchChange(e) {
    toSearch = e.target.value;
    $("#" + id + "searchBtn").setAttribute('data-term', toSearch);
    if (toSearch == "") {
      let rows = renderRows(initialData, columns, buttons, true);
      $("#" + id).innerHTML = "";
      for (var x = 0; x < rows.length; x++) {
        $("#" + id).appendChild(rows[x]);
      }
    }
  }

  function handleOnSearch() {
    $("#" + id + "loading").click();
    props.onSearch(toSearch, $("#" + id + "reload"));
  }

  function handleOnChangeBatch(e) {
    console.log("No function on load next batch")
    $("#" + id + "loading").click();
    props.onChangeBatch(e.currentTarget.dataset.dir, $("#" + id + "reload"));
  }

  function handleWillLoad() {
    storage = $("#" + id).innerHTML;
    $("#" + id).innerHTML = Loading(true)
  }

  function handleReload(e) {
    loading = false;
    let data = JSON.parse(e.currentTarget.dataset.result);
    if (data.length > 0) {
      page = 0;
      range = 5;
      limit = data.length;
      UpdateTableRows(data);
      $("#" + id + "pageStart").innerText = 1;
      $("#" + id + "pageEnd").innerText = data.length > range ? 5 : data.length;
      $("#" + id + "pageTotal").innerText = limit;
    } else {
      $("#" + id).innerHTML = EmptyData(true)
    }
  }

  function UpdateTableRows(data) {
    let rows = renderRows(data, columns, buttons, true);
    $("#" + id).innerHTML = "";
    for (var x = 0; x < rows.length; x++) {
      $("#" + id).appendChild(rows[x]);
    }
  }

  function Next() {
    if (limit > 0 && limit > range) {
      if (page * range < limit) {
        Paginate(page++, "+")
        if (page * range == limit) {
          onPaginationEnd();
        }
      }
    }
  }

  function Prev() {
    if (limit > 0 && limit > range) {
      if (page > 0) {
        if (page * range == limit) {
          Paginate(page -= 1, "-")
        } else {
          Paginate(page--, "-")
        }
      }
    }
  }

  function Paginate(page, pos) {
    let htmlrows = $("#" + id).childNodes;
    let offset;
    for (var x = 0; x < htmlrows.length; x++) {
      htmlrows[x].style.display = 'none';
    }
    for (var x = 0; x < range; x++) {
      offset = pos == "+" ? (page * range) + x : (page * range) - (x + 1);
      if (offset < htmlrows.length) {
        htmlrows[offset].style.display = '';
      }
    }
    $("#" + id + "pageStart").innerText = pos == "+" ? page * range + 1 : offset + 1;
    $("#" + id + "pageEnd").innerText = pos == "+" ? offset + 1 : page * range;
  }

  function onPaginationEnd() {
    $("#" + id + "pageNext").disabled = true;
    $("#" + id + "pageNextBatch").disabled = false;
    $("#" + id + "pageNextBatch").classList.remove('text-black-50');
  }

  function EmptyData(stringed = false) {
    if (stringed) {
      return `<tr rowSpan="5">
      <td colSpan=${colspan} rowSpan="5" style="height: 40vh">
        <center style="margin-top:15vh">No records found</center>
      </td>
    </tr>`;
    } else {
      return (<tr rowSpan="5">
        <td colSpan={colspan} rowSpan="5" style={{ height: '40vh' }}>
          <center style={{ marginTop: '15vh' }}>No records found</center>
        </td>
      </tr>)
    }
  }

  function Loading(strined = false) {
    if (strined) {
      return `<tr rowSpan="5">
      <td colSpan=${colspan} rowSpan="5" style="height: 40vh">
        <center style="margin-top: 15vh">
          <div class="spinner-border text-black-50" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </center>
      </td>
    </tr>`
    } else {
      return (<tr rowSpan="5">
        <td colSpan={colspan} rowSpan="5" style={{ height: '40vh' }}>
          <center style={{ marginTop: '15vh' }}>
            <div className="spinner-border text-black-50" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </center>
        </td>
      </tr>)
    }
  }

  function export2csv() {
    let headers = Object.keys(initialData[0]).join(";");
    let content = initialData.map((data) => {
      return Object.values(data).join(";")
    }).join("\n")
    let data2 = [headers, content].join("\n")
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data2], { type: "text/csv" }));
    a.setAttribute("download", "data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function RemoveButtons(rows) {
    for (var x = 0; x < rows.length; x++) {
      let cols = rows[x].childNodes;
      for (var y = 0; y < cols.length; y++) {
        if (cols[y].childElementCount > 0) {
          rows[x].removeChild(cols[y]);
        }
      }
    }
    return rows;
  }

  function PrintElem(elem, title) {

    let mytableheadrow = document.createElement("tr");
    let head = Object.keys(initialData[0]).map((key) => {
      let th = document.createElement("th");
      th.innerText = key;
      mytableheadrow.appendChild(th)
      return th;
    })
    let mytablebody = document.createElement("tbody");
    let body = initialData.map((data) => {
      let row = document.createElement("tr");
      let cols = Object.values(data).map((val) => {
        let td = document.createElement("td");
        td.innerText = val;
        row.appendChild(td)
        return td;
      })
      mytablebody.appendChild(row)
      return row;
    })
    let mytable = document.createElement("table");
    let mytablehead = document.createElement("thead");
    mytablehead.innerHTML = mytableheadrow.innerHTML;
    mytable.innerHTML = mytablehead.outerHTML + mytablebody.outerHTML;
    var mywindow = window.open('', 'PRINT', 'height=500,width=720');
    mywindow.document.write('<html><head><title>' + title + '</title>');
    mywindow.document.write(`<style>
      *{
        font-style: 'Open Sans'
      }
      table {
        width:100vw;
        border-spacing: 5px;
      }
      table, th, td {
        border: 0.3px solid black;
      }
      table, th, td {
        border: 0.3px solid black;
        border-collapse: collapse;
      }
      th {
        text-align: left;
      }
      th, td {
        padding: 15px;
      }
      table#t01 tr:nth-child(even) {
        background-color: #eee;
      }
      table#t01 tr:nth-child(odd) {
        background-color: #fff;
      }
      table#t01 th {
        color: white;
        background-color: black;
      }
      @media print {
        table {width: '700px'; font-size: '8pt';}
      }
      
    </style>`)
    mywindow.document.write('</head><body><h1>' + title + '</h1>');
    mywindow.document.write(mytable.outerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();
    return true;
  }

}

function delay(data) {
  var promise = new Promise(function (resolve, reject) {
    window.setTimeout(function () {
      resolve('done!', data);
    });
  });
  return promise;
}

const $ = function (el) {
  if (el.includes("#")) return document.getElementById(el.replace("#", ""));
  if (el.includes(".")) return document.getElementById(el.replace(".", ""));
}
