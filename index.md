---
title: "Slogan descriptivo"
layout: splash
header:
  overlay_image: /assets/images/service.jpg
  overlay_filter: rgba(102,153,255,0.5)
  #overlay_color: "#6699ff"
  #overlay_filter: "0.5"
  actions:
     #- label: "Descargar" 
       #url: "/assets/downloads/CarpetaApp.zip"  # Reemplaza con la ruta correcta de tu archivo zip
       #download: "CarpetaApp.zip"  # Nombre de archivo para la descarga
       #btn_label: "Descargar"
       #btn_class: "btn--primary"  # Apply the same class used for the "Read More" button
     - label: "Comenzar" 
       btn_label: "Comenzar"
       btn_class: "btn--primary"  # Apply the same class used for the "Read More" button
excerpt: "Descripción corta"
intro: 
  - excerpt: 'Nullam suscipit et nam, tellus velit pellentesque at malesuada, enim eaque. Quis nulla, netus tempor in diam gravida tincidunt, *proin faucibus* voluptate felis id sollicitudin. Centered with `type="center"`'
feature_row:
  - image_path: assets/images/unsplash-gallery-image-1-th.jpg
    alt: "placeholder image 1"
    title: "Placeholder 1"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
  - image_path: /assets/images/unsplash-gallery-image-2-th.jpg
    alt: "placeholder image 2"
    title: "Placeholder 2"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
    url: "#test-link"
    btn_label: "Read More"
    btn_class: "btn--primary"
  - image_path: /assets/images/unsplash-gallery-image-3-th.jpg
    title: "Placeholder 3"
    excerpt: "This is some sample content that goes here with **Markdown** formatting."
---

# Bienvenido a mi sitio

Esto es el contenido principal de mi página de inicio.

{% include feature_row id="intro" type="center" %}

{% include feature_row %}
