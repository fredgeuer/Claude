# Kit de Atividades para Fonoaudiologia Infantil — landing page

Site estático em HTML, CSS e JavaScript puros. Não precisa de build.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Onde editar

| O quê | Onde |
|---|---|
| Nº de atividades, nome do método, nome da oferta, valor do kit, preços e links de checkout | `js/main.js`, no bloco `CONFIG` no topo |
| Demais textos, bônus e respostas do FAQ | `index.html` |
| Cores e fontes | `css/style.css`, no bloco `:root` no topo |
| Imagens | pasta `images/` (nomes em [`images/LEIA-ME.md`](images/LEIA-ME.md)) |
| Pixel / UTMify | `index.html`, no comentário dentro do `<head>` |

## Deploy

Suba a pasta inteira em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages).

Fontes Nunito e Inter hospedadas em `fonts/` (licença SIL Open Font License 1.1).

## Checklist antes de publicar

Campos vazios no `CONFIG` e respostas marcadas com `[AJUSTAR]` aparecem destacados em amarelo na página.

- [ ] Preencher `atividades`, `metodo`, `oferta` e `valorKit` no `CONFIG` (a soma "Você pagaria" é calculada sozinha)
- [ ] Colocar os links de checkout do plano completo e do básico
- [ ] Substituir as imagens da galeria por 6 a 8 pranchas reais
- [ ] Responder os 4 itens `[AJUSTAR]` do FAQ
- [ ] Confirmar os valores "De R$" dos bônus (texto e `data-valor` no `index.html`)
- [ ] Não incluir depoimentos nem número de clientes até ter dado real
