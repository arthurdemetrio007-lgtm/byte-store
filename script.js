/* =========================================
   BYTE STORE — JavaScript
   1. Dados
   2. Catálogo
   3. Carrinho
   4. Checkout
   ========================================= */


/* =========================================
   1. DADOS
   ========================================= */

const categorias = ["Todos", "Notebooks", "Celulares", "Fones", "Acessórios"];

const produtos = [
  { id: 1,  nome: "Notebook Vega 14",       categoria: "Notebooks",  preco: 3499.00, imagem: "img/notebook-vega-14.svg", descricao: "Ryzen 5, 16GB RAM, SSD 512GB, tela de 14 polegadas." },
  { id: 2,  nome: "Notebook Vega Pro 16",   categoria: "Notebooks",  preco: 6299.00, imagem: "img/notebook-vega-pro.svg", descricao: "Core i7, 32GB RAM, SSD 1TB, placa de vídeo dedicada." },
  { id: 3,  nome: "Ultrabook Air 13",       categoria: "Notebooks",  preco: 4799.00, imagem: "img/ultrabook-air.svg", descricao: "1,1 kg, 12 horas de bateria, ideal para faculdade." },
  { id: 4,  nome: "Smartphone Nova 5",      categoria: "Celulares",  preco: 1899.00, imagem: "img/celular-nova-5.svg", descricao: "128GB, câmera de 50MP e bateria de 5000mAh." },
  { id: 5,  nome: "Smartphone Nova 5 Pro",  categoria: "Celulares",  preco: 2899.00, imagem: "img/celular-nova-5-pro.svg", descricao: "256GB, tela AMOLED 120Hz e carregamento rápido." },
  { id: 6,  nome: "Smartphone Base 3",      categoria: "Celulares",  preco: 999.00,  imagem: "img/celular-base-3.svg", descricao: "64GB, bom para quem quer o básico funcionando bem." },
  { id: 7,  nome: "Fone Bluetooth Air Pod", categoria: "Fones",      preco: 349.00,  imagem: "img/fone-bluetooth.svg", descricao: "Sem fio, cancelamento de ruído e 6 horas de bateria." },
  { id: 8,  nome: "Headset Gamer X1",       categoria: "Fones",      preco: 459.00,  imagem: "img/headset-gamer.svg", descricao: "Som surround 7.1, microfone removível e almofadas macias." },
  { id: 9,  nome: "Fone com fio Studio",    categoria: "Fones",      preco: 189.00,  imagem: "img/fone-com-fio.svg", descricao: "Conector P2, ótimo para estudar e ouvir música." },
  { id: 10, nome: "Teclado mecânico RGB",   categoria: "Acessórios", preco: 429.00,  imagem: "img/teclado-mecanico.svg", descricao: "Switch azul, iluminação RGB e apoio de pulso." },
  { id: 11, nome: "Mouse sem fio 1600DPI",  categoria: "Acessórios", preco: 129.00,  imagem: "img/mouse-sem-fio.svg", descricao: "Seis botões, receptor USB e bateria de longa duração." },
  { id: 12, nome: "Smartwatch Fit 2",       categoria: "Acessórios", preco: 599.00,  imagem: "img/smartwatch-fit.svg", descricao: "Monitor de batimentos, GPS e resistente à água." }
];

const VALOR_FRETE = 29.90;

/* transforma 1899 em "R$ 1.899,00" */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}


/* =========================================
   2. CATÁLOGO
   ========================================= */

let categoriaAtual = "Todos";

/* cria os botões de categoria a partir do array */
function mostrarCategorias() {
  const area = document.getElementById("categorias");
  area.innerHTML = "";

  categorias.forEach(function (categoria) {
    const botao = document.createElement("button");
    botao.className = "categoria";
    if (categoria === categoriaAtual) {
      botao.classList.add("categoria--ativa");
    }
    botao.textContent = categoria;

    botao.addEventListener("click", function () {
      categoriaAtual = categoria;
      mostrarCategorias();
      mostrarProdutos();
    });

    area.appendChild(botao);
  });
}

/* cria os cards de produto a partir do array */
function mostrarProdutos() {
  const grade = document.getElementById("grade");

  // filtra os produtos pela categoria escolhida
  let lista = produtos;
  if (categoriaAtual !== "Todos") {
    lista = produtos.filter(function (produto) {
      return produto.categoria === categoriaAtual;
    });
  }

  // monta o HTML de cada card
  grade.innerHTML = lista.map(function (produto) {
    return '<div class="card">' +
             '<img class="card__imagem" src="' + produto.imagem + '" alt="' + produto.nome + '">' +
             '<h3 class="card__nome">' + produto.nome + '</h3>' +
             '<p class="card__descricao">' + produto.descricao + '</p>' +
             '<span class="card__preco">' + formatarPreco(produto.preco) + '</span>' +
             '<button class="botao" onclick="adicionar(' + produto.id + ')">Adicionar</button>' +
           '</div>';
  }).join("");
}


/* =========================================
   3. CARRINHO
   ========================================= */

/* o carrinho guarda o id do produto e a quantidade */
let carrinho = [];

function adicionar(id) {
  const item = carrinho.find(function (i) { return i.id === id; });

  if (item) {
    item.quantidade = item.quantidade + 1;
  } else {
    carrinho.push({ id: id, quantidade: 1 });
  }

  mostrarCarrinho();
  abrirCarrinho();
}

function alterarQuantidade(id, valor) {
  const item = carrinho.find(function (i) { return i.id === id; });
  item.quantidade = item.quantidade + valor;

  if (item.quantidade === 0) {
    remover(id);
  } else {
    mostrarCarrinho();
  }
}

function remover(id) {
  carrinho = carrinho.filter(function (item) { return item.id !== id; });
  mostrarCarrinho();
}

/* soma o preço de todos os itens */
function calcularSubtotal() {
  return carrinho.reduce(function (soma, item) {
    const produto = produtos.find(function (p) { return p.id === item.id; });
    return soma + produto.preco * item.quantidade;
  }, 0);
}

function calcularTotal() {
  return calcularSubtotal() + VALOR_FRETE;
}

/* soma a quantidade de itens, para o número no cabeçalho */
function contarItens() {
  return carrinho.reduce(function (soma, item) {
    return soma + item.quantidade;
  }, 0);
}

function mostrarCarrinho() {
  const area = document.getElementById("itens");

  area.innerHTML = carrinho.map(function (item) {
    const produto = produtos.find(function (p) { return p.id === item.id; });
    return '<div class="item">' +
             '<img class="item__imagem" src="' + produto.imagem + '" alt="">' +
             '<div class="item__info">' +
               '<span class="item__nome">' + produto.nome + '</span>' +
               '<span class="item__preco">' + formatarPreco(produto.preco * item.quantidade) + '</span>' +
             '</div>' +
             '<button class="item__botao" onclick="alterarQuantidade(' + produto.id + ', -1)">-</button>' +
             '<span class="item__qtd">' + item.quantidade + '</span>' +
             '<button class="item__botao" onclick="alterarQuantidade(' + produto.id + ', 1)">+</button>' +
           '</div>';
  }).join("");

  const vazio = carrinho.length === 0;
  document.getElementById("vazio").hidden = !vazio;
  document.getElementById("resumo").hidden = vazio;

  document.getElementById("contador").textContent = contarItens();
  document.getElementById("subtotal").textContent = formatarPreco(calcularSubtotal());
  document.getElementById("frete").textContent = formatarPreco(VALOR_FRETE);
  document.getElementById("total").textContent = formatarPreco(calcularTotal());
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("carrinho--aberto");
  document.getElementById("fundo").hidden = false;
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("carrinho--aberto");
  document.getElementById("fundo").hidden = true;
}


/* =========================================
   4. CHECKOUT
   ========================================= */

function abrirCheckout() {
  if (carrinho.length === 0) return;

  // monta o resumo do pedido
  const linhas = carrinho.map(function (item) {
    const produto = produtos.find(function (p) { return p.id === item.id; });
    return '<div class="checkout__linha">' +
             '<span>' + item.quantidade + 'x ' + produto.nome + '</span>' +
             '<span>' + formatarPreco(produto.preco * item.quantidade) + '</span>' +
           '</div>';
  }).join("");

  document.getElementById("checkout-resumo").innerHTML = linhas +
    '<div class="checkout__linha"><span>Frete</span><span>' + formatarPreco(VALOR_FRETE) + '</span></div>' +
    '<div class="checkout__linha checkout__linha--total"><span>Total</span><span>' + formatarPreco(calcularTotal()) + '</span></div>';

  document.getElementById("erro").textContent = "";
  fecharCarrinho();
  document.getElementById("modal-checkout").classList.add("modal--aberto");
}

function fecharCheckout() {
  document.getElementById("modal-checkout").classList.remove("modal--aberto");
}

function confirmarPedido() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const pagamento = document.getElementById("pagamento").value;
  const erro = document.getElementById("erro");

  // validação simples, um campo de cada vez
  if (nome.length < 3) {
    erro.textContent = "Digite seu nome completo.";
    return;
  }
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    erro.textContent = "Digite um e-mail válido.";
    return;
  }
  if (cep.replace("-", "").length !== 8) {
    erro.textContent = "O CEP precisa ter 8 números.";
    return;
  }
  if (pagamento === "") {
    erro.textContent = "Escolha uma forma de pagamento.";
    return;
  }

  const total = calcularTotal();
  const quantidade = contarItens();

  fecharCheckout();

  document.getElementById("numero-pedido").textContent =
    "#" + Math.floor(Math.random() * 9000 + 1000);

  document.getElementById("texto-confirmacao").textContent =
    "Obrigado, " + nome + "! Seu pedido de " + quantidade + " item(ns) no valor de " +
    formatarPreco(total) + " foi registrado. Pagamento: " + pagamento + ".";

  document.getElementById("modal-confirmacao").classList.add("modal--aberto");

  // esvazia o carrinho e limpa o formulário
  carrinho = [];
  mostrarCarrinho();
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("cep").value = "";
  document.getElementById("pagamento").value = "";
}

function fecharConfirmacao() {
  document.getElementById("modal-confirmacao").classList.remove("modal--aberto");
  document.getElementById("fundo").hidden = true;
}


/* =========================================
   BOTÕES DA PÁGINA
   ========================================= */

document.getElementById("btn-abrir-carrinho").addEventListener("click", abrirCarrinho);
document.getElementById("btn-fechar-carrinho").addEventListener("click", fecharCarrinho);
document.getElementById("fundo").addEventListener("click", fecharCarrinho);
document.getElementById("btn-finalizar").addEventListener("click", abrirCheckout);
document.getElementById("btn-fechar-checkout").addEventListener("click", fecharCheckout);
document.getElementById("btn-confirmar").addEventListener("click", confirmarPedido);
document.getElementById("btn-voltar").addEventListener("click", fecharConfirmacao);


/* ===== inicia a loja ===== */
mostrarCategorias();
mostrarProdutos();
mostrarCarrinho();
