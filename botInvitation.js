const qrcode = require("qrcode-terminal"); // Importa a biblioteca qrcode-terminal
const { Client, MessageMedia } = require("whatsapp-web.js"); // Importa a biblioteca whatsapp-web.js
const fs = require("fs"); // Importa a biblioteca fs

function loadContactList() { // Função para carregar a lista de contatos
  const data = fs.readFileSync("contacts.json"); // Lê o arquivo contacts.json
  const contactList = JSON.parse(data); // Converte o arquivo lido para JSON
  return contactList; // Retorna a lista de contatos
}

const client = new Client(); // Cria uma instância do cliente

client.on("qr", (qr) => { // Evento que é disparado quando o QR Code é gerado
  qrcode.generate(qr, { small: true }); // Gera o QR Code
  console.log("QR Code gerado!"); // Exibe a mensagem de que o QR Code foi gerado
});

client.on("ready", () => { // Evento que é disparado quando o cliente está pronto
  console.log("Conexão estabelecida com sucesso!"); // Exibe a mensagem de que a conexão foi estabelecida
  manageInvitations(); // Chama a função manageInvitations
});

client.initialize(); // Inicializa o cliente

async function manageInvitations() { // Função para gerenciar os convites
  const contactList = loadContactList(); // Carrega a lista de contatos

  for (const contact of contactList) { // Para cada contato na lista de contatos
    const message = generateMessage(contact); // Gera a mensagem
    await sendInvitation( // Envia o convite
      contact.contato,
      contact.numero,
      message,
      "assets/invitation.png"
    );
  }

  setTimeout(async () => { // Define um tempo para desconectar
    await client.logout(); // Desconecta do WhatsApp
    console.log("Desconectado do WhatsApp!"); // Exibe a mensagem de que foi desconectado
  }, 10000); // Tempo de 10 segundos
}

function generateMessage(contact) { // Função para gerar a mensagem
  const name = contact.contato; // Obtém o nome do contato
  const family = contact.familiares; // Obtém a lista de familiares

  let message; // Declara a variável message
  if (family.length > 0) { // Se a lista de familiares for maior que 0
    message = `Olá *${name}*, vamos comemorar o aniversário do Bob Esponja no dia 14 de Julho às 16 horas no Siri Cascudo! Contamos com a sua presença, junto com *${family}*.
        
        https://maps.app.goo.gl/7bJQ7n9TK14upJ2N7
        `;
  } else { // Senão
    message = `Olá *${name}*, vamos comemorar o aniversário do Bob Esponja no dia 14 de Julho às 16 horas no Siri Cascudo! Contamos com a sua presença!
        
        https://maps.app.goo.gl/7bJQ7n9TK14upJ2N7
        `;
  }

  return message; // Retorna a mensagem
}

async function sendInvitation(name, number, message, imagePath) { // Função para enviar o convite
  try { 
    const media = MessageMedia.fromFilePath(imagePath); // Cria uma instância de MessageMedia com a imagem
    await client.sendMessage(number, message, { media }); // Envia a mensagem com a imagem
    console.log(`Convite enviado para ${name}`); // Exibe a mensagem de que o convite foi enviado
  } catch (error) { 
    console.error(`Erro ao enviar convite para ${name} : ${error}`); // Exibe a mensagem de erro
  }
}
