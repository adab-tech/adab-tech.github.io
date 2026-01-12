---
title: Tags
layout: null
permalink: /blog/tags/index.html
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Tags — Blog</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <div class="container" style="padding-top:6rem;">
      <h1 class="section-title">Tags</h1>
      <ul>
        {% for tag in collections.tagList %}
          <li><a href="/blog/tags/{{ tag | slug }}/">{{ tag }}</a></li>
        {% endfor %}
      </ul>
    </div>
  </body>
</html>
