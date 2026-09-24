# Kit Fono Kids — landing page

Site estático em HTML, CSS e JavaScript puros. Não precisa de build.

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Onde editar

| O quê | Onde |
|---|---|
| Textos, preços, bônus, FAQ | `index.html` |
| Cores e fontes | `css/style.css`, no bloco `:root` no topo |
| Link do checkout | `js/main.js`, na variável `CHECKOUT_URL` |
| Imagens | pasta `images/` (nomes em [`images/LEIA-ME.md`](images/LEIA-ME.md)) |
| Pixel / UTMify | `index.html`, no comentário dentro do `<head>` |

## Deploy

Suba a pasta inteira em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages).

Fontes Nunito e Inter hospedadas em `fonts/` (licença SIL Open Font License 1.1).
