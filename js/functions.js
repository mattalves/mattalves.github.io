// Posições constantes dos valores dos itens
const I_WEIGHT = 0;
const I_VALUE = 1;

// Itens
var itens = [];

// Capacidade da mochila
var capacity = 0;

// Adiciona um item na tabela
function addTableItem() {
  // Pega os campos de peso e valor
  var txtWeight = document.getElementById('txtWeight');
  var txtValue  = document.getElementById('txtValue');

  // Pega os valores numéricos de peso e valor
  var weight = Number(txtWeight.value);
  var value  = Number(txtValue.value);

  // Não permite adição de item com peso zero
  if(weight <= 0)
  {
    alert('O peso deve ser um valor válido, maior que zero!');
    return;
  }

  // Não permite itens com valor negativo
  if(value < 0)
  {
    alert('O valor deve ser positivo!')
    return;
  }

  // Cria o item que será adicionado
  var item = [weight, value];

  // Adiciona o item na lista
  var itensLength = itens.length;
  itens[itensLength] = item;

  // Ordena os itens, a função sort ordena pelo peso,
  // e pelo valor em casos de pesos iguais
  itens.sort(function(a,b) {
    if(a[I_WEIGHT] == b[I_WEIGHT])
      return a[I_VALUE] > b[I_VALUE];
    else
      return a[I_WEIGHT] > b[I_WEIGHT];
  });

  // Limpa os campos de peso e valor para o novo item
  txtWeight.value = 0;
  txtValue.value = 0;

  // Imprime a tabela
  printTable();
}

// Apaga um item da tabela
function delTableItem(index)
{
  // Verifica se o index é válido
  if((Number(index) > -1) && (Number(index) < itens.length))
    itens.splice(index, 1);
  else
    alert('Erro inesperado, index inválido: ' + index + '. A tabela foi atualizada, tente novamente!');

  // Printa a tabela atualizada
  printTable();
}

// Imprime a tabela
function printTable()
{
  // Tabela
  var table = document.getElementById('tblItens');

  // Limpa os valores, caso tenha algum valor exibindo
  table.lastElementChild.innerHTML = '';

  // Percorre os itens do array, inserindo-os na tabela
  for(var index = 0; index < itens.length; index++)
  {
    // Insere uma linha na tabela
    var row = table.lastElementChild.insertRow(index);

    // Insere as colunas
    var btnCell = row.insertCell(0);
    var weightCell = row.insertCell(1);
    var valueCell = row.insertCell(2);

    btnCell.innerHTML = '<button type="button" class="btn btn-primary btn-xs" onclick="delTableItem(' + index + ')"><span class="glyphicon glyphicon-remove"></span></button>';
    weightCell.innerHTML = itens[index][I_WEIGHT];
    valueCell.innerHTML = itens[index][I_VALUE];
  }

  // Sempre que se chama o método de imprimir a tabela,
  // consideramos uma atualização dos itens existentes,
  // portanto, precisamos recalcular a solução
  setCapacity();
}

// Define a capacidade da mochila
function setCapacity()
{
  // Input de capacidade
  var txtCapacity = document.getElementById('txtCapacity');
  // define o valor
  capacity = Number(txtCapacity.value);
  // calcula a solução
  knapsack();
}
