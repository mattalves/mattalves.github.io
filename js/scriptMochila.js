
var C_WEIGHT = 0;
var C_VALUE = 1;
var itens = [];
var capacity = 0;

function addItem() {
  
  var weight = Number($('#valWeight').val());
  var value  = Number($('#valValue').val());
  
  if(weight <= 0)   {
    alert('O peso deve ser maior que Zero!');
    return;
  }

  if(value < 0) {
    alert('O valor deve ser positivo!')
    return;
  }

  var item = [weight, value]; 
  itens[itens.length] = item;

  // Ordena os itens, a função sort ordena pelo peso, e pelo valor em casos de pesos iguais
  itens.sort(function(a,b) {
    if(a[C_WEIGHT] == b[C_WEIGHT])
      return a[C_VALUE] > b[C_VALUE];
    else
      return a[C_WEIGHT] > b[C_WEIGHT];
  });

  $('#valWeight').val('');
  $('#valValue').val('');
  mountTable();
}

function mountTable() {
  var table = document.getElementById('tblItens');

  table.lastElementChild.innerHTML = '';

  // Percorre os itens do array, inserindo-os na tabela
  for(var index = 0; index < itens.length; index++) {  
    var row = table.lastElementChild.insertRow(index);
  
    var btnCell = row.insertCell(0);
    var weightCell = row.insertCell(1);
    var valueCell = row.insertCell(2);

    btnCell.innerHTML = '<button type="button" class="btn btn-primary btn-xs" onclick="deleteItem(' + index + ')"><span class="glyphicon glyphicon-remove"></span></button>';
    weightCell.innerHTML = itens[index][C_WEIGHT];
    valueCell.innerHTML = itens[index][C_VALUE];
  }

  backpack();
}

function deleteItem(index) {
  if(index > -1 && index < itens.length)
    itens.splice(index, 1);
  else
    alert('Index invalido!');  
  mountTable();
}

function backpack() {
    capacity = Number($("#valCapacity").val());
    
    var tblSolution = document.getElementById('tblSolution');

    // CRIA O CABEÇALHO
    var thead = tblSolution.firstElementChild;
    var tbody = tblSolution.lastElementChild;
    thead.innerHTML = '<tr></tr>';
    tbody.innerHTML = '';
    var thead_tr = thead.firstElementChild;    
    var thead_tr = thead.firstElementChild;    
    var itemWCell = thead_tr.appendChild(document.createElement('th'));
    itemWCell.innerHTML = 'Valor';    
    var itemVCell = thead_tr.appendChild(document.createElement('th'));
    itemVCell.innerHTML = 'Peso';
    for(var index=0; index<= capacity; index++) {
      var capacityCell = thead_tr.appendChild(document.createElement('th'));
      capacityCell.innerHTML = index;
    }

   // DEFININDO A PRIMEIRA LINHA COM VALOR 0
   var zRow = tbody.appendChild(document.createElement('tr'));   
   var zwcell = zRow.appendChild(document.createElement('td'));
   zwcell.innerHTML = 0;
   var zvcell = zRow.appendChild(document.createElement('td'));
   zvcell.innerHTML = 0;
   for(var index=0; index <= capacity; index++) {
     var capacityCell = zRow.appendChild(document.createElement('td'));
     capacityCell.innerHTML = 0;
   }

   // Adiciona os itens
   for(var index=0; index < itens.length; index++){    
    var row = tbody.appendChild(document.createElement('tr'));
    var tblSolutionRows = tbody.querySelectorAll('tr');
    var backRow = tblSolutionRows[index].querySelectorAll('td');

    var wcell = row.appendChild(document.createElement('td'));
    wcell.innerHTML = itens[index][C_VALUE];
    var vcell = row.appendChild(document.createElement('td'));
    vcell.innerHTML = itens[index][C_WEIGHT]; 
    for(var cIndex=0; cIndex <= capacity; cIndex++) { 
      var capacityCell = row.appendChild(document.createElement('td'));
      var upLineValue = Number(backRow[2 + cIndex].innerHTML);
      if(itens[index][C_WEIGHT] > cIndex) {
        capacityCell.innerHTML = upLineValue;
      } else {
        var leftWeight = (cIndex - itens[index][C_WEIGHT]) + 2;
        var selectedValue = itens[index][C_VALUE] + Number(backRow[leftWeight].innerHTML)
        var unselectedValue = upLineValue;
        capacityCell.innerHTML = Math.max(selectedValue, unselectedValue);
      }
    }
  }

  // SOLUÇÃO FINAL
  var tblSolutionRows = tbody.querySelectorAll('tr');
  var weight = capacity+2;
  var finalSolution = document.getElementById('finalSolution');
  finalSolution.innerHTML = '';
  for(var index = tblSolutionRows.length - 1; index > 0; index--) {
    var actualRow = tblSolutionRows[index].querySelectorAll('td');
    var upRow = tblSolutionRows[index-1].querySelectorAll('td');

    if(actualRow[weight].innerHTML == upRow[weight].innerHTML) {
      tblSolutionRows[index].className = 'danger';
    } else {
      tblSolutionRows[index].className = 'success';
      weight = weight - Number(actualRow[1].innerHTML);
      var p = document.createElement('p');
      p.innerHTML = ' - ' + actualRow[1].innerHTML + '(' + actualRow[0].innerHTML + ')';
      finalSolution.appendChild(p);
    }
  }
}