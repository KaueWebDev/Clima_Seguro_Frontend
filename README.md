🌤️ Descrição do Projeto
O ClimaSeguro é uma plataforma web que permite ao usuário buscar cidades do mundo inteiro e visualizar:

- Temperatura atual
- Condições do tempo (descritas e com ícones)
- Velocidade do vento
- Umidade do ar
- Bandeira do país
- Previsão detalhada para os próximos dias

Além disso, o sistema inclui:

- Mapa interativo com Leaflet
- Autocompletar inteligente com dados do Nominatim
- Histórico de pesquisas usando estruturas de dados (Fila, Pilha, Lista Ligada e Tabela Hash)
- Backend em Flask que integra APIs externas e fornece endpoints organizados

O projeto foi desenvolvido seguindo boas práticas de arquitetura, engloba front-end e back-end e cumpre requisitos de estruturas de dados e consumo de APIs.

🚀 Como Instalar e Executar.
🔧 Requisitos:

- Python 3.10+
- Node.js (opcional, apenas se quiser rodar localmente o frontend com servidor)
- Navegador moderno

▶️ 1. Rodando o Backend
Clone o repositório
git clone https://github.com/SEU-REPOSITORIO/clima-seguro.git
cd clima-seguro/backend

Crie um ambiente virtual:
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate      # Windows

Instale as dependências:
pip install -r requirements.txt

Execute o servidor:
python app.py

O backend estará em:
http://localhost:5000


🌐 2. Rodando o Frontend.
Basta abrir o arquivo:
frontend/index.html

Ou usar um servidor leve:
npx http-server ./frontend


🧪 Como Testar:

- Abra o site
- Pesquise uma cidade
- Veja o autocompletar funcionar
- Clique em algum resultado
- Veja o clima atual, previsão e marcador no mapa
- O histórico será salvo automaticamente
- A mesma cidade pesquisada novamente será carregada do cache


Para testar o backend manualmente:
/api/autocomplete?q=rio
/api/weather?lat=-22.9&lon=-43.2
/api/forecast?lat=-22.9&lon=-43.2
/debug/queue
/debug/stack
/debug/list
/debug/cache


🛠 Tecnologias Utilizadas

Frontend:
- HTML5
- CSS3
- JavaScript ES6
- Leaflet.js (mapa)

Backend:
- Python
- Flask
- Flask-CORS
- Requests
- Gunicorn (deploy)
- APIs Externas
- Nominatim (OpenStreetMap) → autocompletar e geocodificação
- Open-Meteo → dados climáticos
- FlagCDN → bandeiras dos países

Estruturas de Dados:
Implementadas manualmente, tanto no frontend quanto no backend:
- LinkedList
- Queue
- Stack
- HashTable

📸 Prints da Plataforma

- Barra de pesquisa com autocomplete
- Cards de clima e previsão
- Bandeira do país
- Mapa interativo
- Histórico 

![princ1](https://github.com/user-attachments/assets/7d6ab558-c8be-425c-ab0e-0c3e10120911)
![princ2](https://github.com/user-attachments/assets/fbb9d2d1-ef33-469c-b567-38d71f45f3dd)

🛠 Como o contribuinte vê o projeto

Estrutura de pastas organizada
- Código modular
- README explicativo
- Backend organizado em /utils
- Estruturas de dados separadas




🔗 Links Importantes
🌐 Site publicado:
https://clima-seguro-frontend.onrender.com

📘 Documentação API
A API possui endpoints:
GET /api/autocomplete?q=
GET /api/weather?lat=&lon=&name=&country=
GET /api/forecast?lat=&lon=
GET /debug/queue
GET /debug/stack
GET /debug/list
GET /debug/cache
