# Landing page — Programa de Indicação Noomi

Uma página responsiva (desktop, tablet e celular no mesmo arquivo), em HTML, CSS e JavaScript puros.
Não precisa de build, framework nem bibliotecas externas.

## Estrutura

```
noomi-indicacao/
├── index.html          → a página
├── css/styles.css      → todo o visual (cores, layout, animações, responsivo)
├── js/config.js        → ⚙️ CONFIGURAÇÃO: links e destino do formulário (único arquivo a editar)
├── js/main.js          → animações, máscaras, validação e envio do formulário
├── assets/fonts/       → fonte Outfit (400, 500, 600, 700)
├── assets/img/         → logos, selo (símbolo infinito) e notas de R$ 100
└── previa/             → prints de referência (desktop, tablet, celular), não vão para o ar
```

Para publicar, suba a pasta inteira (menos `previa/`) em qualquer hospedagem estática:
Netlify, Vercel, GitHub Pages, S3, servidor próprio etc. Os caminhos são relativos.

## O que falta configurar (tudo em `js/config.js`)

| Campo            | O que é                                                                  |
|------------------|--------------------------------------------------------------------------|
| `regulamentoUrl` | Link do regulamento / termos da campanha (checkbox do formulário + rodapé) |
| `privacidadeUrl` | Link da Política de Privacidade (texto do formulário + rodapé)           |
| `formEndpoint`   | URL que recebe os dados do formulário via `POST`                         |
| `formFormat`     | `'form'` (multipart/FormData) ou `'json'` (application/json)             |
| `redirectUrl`    | Opcional: página para onde levar a pessoa depois do envio (ex.: "obrigado") |

Comportamento enquanto não configurado:
- Links vazios não levam a lugar nenhum (o clique é ignorado).
- Sem `formEndpoint`, o formulário valida e mostra "Indicação registrada!", **mas não envia nada**.

Com `formEndpoint` preenchido, se o servidor responder com erro (status fora de 2xx) ou a
requisição falhar, aparece uma mensagem de erro acima do botão e a pessoa pode tentar de novo.
Se o endpoint estiver em outro domínio, ele precisa liberar CORS para o domínio da página.

## Campos enviados pelo formulário

| Campo (`name`)          | Conteúdo                                   | Obrigatório |
|-------------------------|--------------------------------------------|-------------|
| `indicador_nome`        | Nome completo de quem indica               | sim         |
| `indicador_whatsapp`    | WhatsApp com DDD, ex.: `(31) 99999-8888`   | sim         |
| `indicador_email`       | E-mail                                     | sim         |
| `indicador_cpf`         | CPF com máscara, ex.: `529.982.247-25` (dígito verificador validado) | sim |
| `tipo_indicado`         | `pessoa_fisica` ou `empresa`               | sim         |
| `indicado_nome`         | Nome da pessoa indicada ou razão social    | sim         |
| `indicado_responsavel`  | Nome do responsável (só quando empresa)    | não         |
| `indicado_whatsapp`     | WhatsApp do indicado com DDD               | sim         |
| `indicado_cidade_uf`    | Cidade / UF do indicado                    | não         |
| `aceite_regulamento`    | `on` quando marcado                        | sim         |
| `aceite_autorizacao`    | `on` quando marcado                        | sim         |

## Outros dados
- CNPJ no rodapé: 61.433.648/0001-46 (`index.html`, rodapé).
- Paleta: azul `#02319E`, ciano `#09DDE0`, branco. Fonte: Outfit.

## Pontos de quebra
- Desktop: acima de 1024px · Tablet: 721px a 1024px · Celular: até 720px (ajustes extras até 480px).
- Respeita `prefers-reduced-motion` (desliga as animações para quem pede menos movimento).
