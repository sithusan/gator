

# Gator CLI  
**RSS feeds but make it multiplayer… in your terminal.**  

Keep up with blogs, news sites, and podcasts — straight from your CLI. Add feeds, follow others, and browse aggregated posts like it’s 2010 LAN party vibes, but with Postgres.  

---

## ✨ What’s this?  
- **Collect RSS feeds** from across the internet.  
- **Store them in PostgreSQL** — no servers, no cloud magic, just good old SQL.  
- **Follow / unfollow feeds** other users added (yes, it’s multi-user).  
- **Browse posts in your terminal** with summaries and links.  

> ⚠ **Heads up:** No user-based authentication.  
> You register or log in (no passwords, it’s vibes-based trust).
> Treat this like the wild west of local apps.  

---

## 🛠 Installation  
```bash
git clone https://github.com/sithusan/gator.git
cd gator-cli
npm install
npm run generate
npm run migrate
npm run start <command> [args...]
