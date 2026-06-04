# GitHub profile setup (adab-tech)

Checklist to keep your GitHub presence aligned with [adamu.tech](https://adamu.tech).

## 1. Profile README

Repository: **[adab-tech/adab-tech](https://github.com/adab-tech/adab-tech)**  
This README renders at the top of https://github.com/adab-tech

Edit `README.md` in that repo to update your public developer landing page.

## 2. Pin six repositories

GitHub → your profile → **Customize your pins** → select:

1. `adab-tech.github.io`
2. `OpportunityFinder`
3. `adamsy-free-tv`
4. `bama-pickme`
5. `battery-life-helper`
6. `mapping`

Do **not** pin archived experiments, forks (`iptv`), or repos you are retiring (e.g. `dissertation-and-radio-toolkit`).

## 3. Profile fields

GitHub → **Settings → Profile**

| Field | Suggested value |
|-------|-----------------|
| Name | Adamu Abubakar |
| Bio | Computational linguist & African language AI · NLP for Hausa and low-resource languages |
| URL | https://adamu.tech |
| Company | (optional) Independent / Open to collaborations |
| Location | United States |

## 4. Repo README standards

Each public project should have:

- One-line description (also set in repo **About** sidebar)
- Badges: license, stack, link to live demo if any
- **Quick start** with clone + install + run
- Link back to portfolio

Templates live in `.github/README_TEMPLATE.md`.

## 5. Retiring a repository

To remove `dissertation-and-radio-toolkit`:

```bash
gh auth refresh -h github.com -s delete_repo
gh repo delete adab-tech/dissertation-and-radio-toolkit --yes
```

Or delete from the repo **Settings → Danger zone** (requires admin).

## 6. Private work

Keep `hausa-ai`, `gwarzo-ai`, and similar repos private until ready for public launch; add a portfolio card on adamu.tech when you ship.
