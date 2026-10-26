/*
  CONFIGURAÇÃO DA LANDING PAGE — Programa de Indicação Noomi
  Este é o ÚNICO arquivo que precisa ser editado para colocar a página no ar.
*/
window.NOOMI_CONFIG = {

  // Links abertos pelo formulário e pelo rodapé (abrem em nova aba).
  regulamentoUrl: '',   // ex.: 'https://noomi.com.br/regulamento-indicacao.pdf'
  privacidadeUrl: '',   // ex.: 'https://noomi.com.br/politica-de-privacidade'

  // Para onde os dados do formulário são enviados (API, CRM, webhook, Google Apps Script, Zapier, Make...).
  // Enquanto estiver vazio, o formulário só valida e mostra a mensagem de sucesso (nada é enviado).
  formEndpoint: '',

  // 'form' envia como multipart/form-data (FormData); 'json' envia como application/json.
  formFormat: 'form',

  // Opcional: página para onde a pessoa é levada depois do envio com sucesso (ex.: página de obrigado).
  // Vazio = mostra a mensagem "Indicação registrada!" na própria página.
  redirectUrl: ''
};
