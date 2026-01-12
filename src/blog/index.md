---
layout: base.njk
title: Blog
permalink: /blog/index.html
---

<section class="container" style="padding:3rem 1.5rem;">
  <h1 class="section-title">Writing & Research</h1>
  <p class="lead">Essays, notes, and research on language technology and AI.</p>
  <div class="posts-grid">
    {% for post in collections.posts %}
      <article class="post-card">
        <h3><a href="{{ post.url }}">{{ post.data.title }}</a></h3>
        <p class="excerpt">{{ post.data.excerpt }}</p>
      </article>
    {% endfor %}
  </div>
</section>
