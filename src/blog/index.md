---
title: Blog
layout: null
permalink: /blog/index.html
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blog — Adamu Abubakar</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <nav class="navbar" id="navbar" aria-label="Main navigation">
      <div class="nav-container">
        <a href="/" class="nav-brand">
          <span class="brand-name">Adamu Abubakar</span>
        </a>
        <div class="nav-menu">
          <a href="/">Home</a>
        </div>
      </div>
    </nav>

    <main id="main-content" tabindex="-1">
      <section style="padding-top:6rem;" class="section-header">
        <div class="container">
          <span class="section-label">Writing</span>
          <h1 class="section-title">Blog — Thoughts & Writing</h1>
          <p class="section-description">A go-to place for write-ups, essays, op-eds, opportunities, and creative writing.</p>
        </div>
      </section>

      <section class="projects">
        <div class="container">
          <div class="projects-grid">
            {% for post in collections.posts %}
              <article class="project-card">
                <div class="project-content">
                  <h3 class="project-title"><a class="project-link" href="{{ post.url }}">{{ post.data.title }}</a></h3>
                  <p class="project-description">{{ post.data.excerpt }}</p>
                </div>
              </article>
            {% endfor %}
          </div>
        </div>
      </section>
    </main>

  </body>
</html>
