ZoneBot Ultra — Deploy Guide (Render + Netlify)

BACKEND (Render)
1) Create a new GitHub repo for /server and push these files.
2) On Render.com → New → Web Service → pick your repo.
3) Environment: Node | Build: npm install | Start: npm start
4) Add Environment Variable: OPENAI_API_KEY = sk-... (from OpenAI dashboard)
5) Deploy. Copy the URL, e.g. https://zonebot-ultra.onrender.com

FRONTEND (Netlify)
1) Create a new GitHub repo for /client and push.
2) Netlify → Add new site → Import from Git → pick /client repo.
3) Update client/script.js API_BASE to your Render URL (not localhost).
4) Redeploy. Share the Netlify URL as your website.

Local dev
- In /server: npm install && npm start
- In /client: open index.html in browser
