---
title: 所有文章
permalink: /all-articles/
layout: default
nav: true
requireJq: true
---

<script type="text/javascript">
// prepare data from jekyll
var $J = {
  baseUrl: "{{ site.baseurl }}/all-articles/?label=",
  staticUrl: "{{ site.static_url }}",
  labels: [
    "显示全部",
    {% for post in site.posts %}
      {% if post.release %}
        {% for label in post.labels %}
          "{{ label }}",
        {% endfor %}
      {% endif %}
    {% endfor %}
  ],
  posts: [
    {% for post in site.posts %}
      {% if post.release %}
      {
        title: "{{ post.title }}",
        date: "{{ post.date | date: "%Y-%m-%d" }}",
        link: "{{ post.url | prepend: site.baseurl }}",
        labels: [
        {% for label in post.labels %}
          "{{ label }}",
        {% endfor %}
        ]
      },
      {% endif %}
    {% endfor %}
  ]
};
</script>

<div id="main"></div>

<!-- concat React JSX -->
