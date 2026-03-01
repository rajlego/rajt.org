// Build HTML comparison gallery from experiment results
// v1 — 2026-02-20
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const experimentsDir = path.join(__dirname, "../../public/experiments");

const MODELS = ["pulid", "ip-adapter", "instantid", "instant-character", "kontext-pro", "kontext-dev"];
const CATEGORIES = ["sculpture", "art", "fantasy"];

function buildGallery() {
  const allResults = {};
  let totalImages = 0;

  for (const model of MODELS) {
    const resultsFile = path.join(experimentsDir, model, "results.json");
    if (fs.existsSync(resultsFile)) {
      const data = JSON.parse(fs.readFileSync(resultsFile, "utf-8"));
      allResults[model] = data.results || [];
      totalImages += allResults[model].length;
    } else {
      allResults[model] = [];
    }
  }

  // Get all unique style names
  const allStyles = new Set();
  for (const results of Object.values(allResults)) {
    for (const r of results) allStyles.add(r.name);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Experiment Gallery — ${totalImages} Results</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif; }
    h1 { text-align: center; padding: 2rem; font-size: 1.5rem; color: #fff; }
    .stats { text-align: center; color: #888; margin-bottom: 2rem; font-size: 0.9rem; }
    .filters { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; padding: 0 1rem; }
    .filter-btn { background: #1a1a1a; border: 1px solid #333; color: #aaa; padding: 0.4rem 1rem; border-radius: 2rem; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .filter-btn:hover { border-color: #666; color: #fff; }
    .filter-btn.active { background: #fff; color: #000; border-color: #fff; }
    .category-section { margin-bottom: 3rem; }
    .category-title { font-size: 1.1rem; color: #fff; padding: 1rem 2rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #222; }
    .style-row { padding: 1.5rem 1rem; border-bottom: 1px solid #111; }
    .style-name { font-size: 0.9rem; color: #888; margin-bottom: 0.75rem; padding-left: 1rem; text-transform: capitalize; }
    .model-grid { display: flex; gap: 0.75rem; overflow-x: auto; padding: 0 1rem; scroll-snap-type: x mandatory; }
    .model-card { flex: 0 0 280px; scroll-snap-align: start; position: relative; border-radius: 8px; overflow: hidden; background: #111; cursor: pointer; transition: transform 0.2s; }
    .model-card:hover { transform: scale(1.02); }
    .model-card img { width: 100%; height: 280px; object-fit: cover; display: block; }
    .model-card .label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.9)); padding: 2rem 0.75rem 0.5rem; font-size: 0.75rem; color: #ccc; }
    .model-card .model-name { font-weight: 600; color: #fff; }
    .model-card.missing { opacity: 0.3; }
    .model-card.missing img { display: none; }
    .model-card.missing::after { content: "—"; display: flex; align-items: center; justify-content: center; height: 280px; font-size: 2rem; color: #333; }

    /* Lightbox */
    .lightbox { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 100; align-items: center; justify-content: center; cursor: zoom-out; }
    .lightbox.active { display: flex; }
    .lightbox img { max-width: 90vw; max-height: 90vh; border-radius: 8px; }
    .lightbox .info { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #1a1a1a; padding: 0.75rem 1.5rem; border-radius: 2rem; font-size: 0.85rem; color: #fff; }

    /* Star ratings */
    .star-btn { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.6); border: none; color: #555; font-size: 1.5rem; cursor: pointer; padding: 0.25rem; border-radius: 50%; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; z-index: 10; }
    .star-btn.starred { color: #ffd700; }

    /* Export bar */
    .export-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #1a1a1a; border-top: 1px solid #333; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; z-index: 50; }
    .export-bar .count { color: #888; }
    .export-bar button { background: #fff; color: #000; border: none; padding: 0.5rem 1.5rem; border-radius: 2rem; cursor: pointer; font-weight: 600; }
    .export-bar button:hover { background: #ddd; }
  </style>
</head>
<body>
  <h1>Experiment Gallery</h1>
  <div class="stats">${totalImages} images across ${MODELS.length} models and ${allStyles.size} styles</div>

  <div class="filters">
    <button class="filter-btn active" data-filter="all">All</button>
    ${CATEGORIES.map(c => `<button class="filter-btn" data-filter="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</button>`).join("\n    ")}
    <button class="filter-btn" data-filter="starred">Starred</button>
  </div>

  ${CATEGORIES.map(category => {
    const stylesInCategory = [...allStyles].filter(styleName => {
      for (const results of Object.values(allResults)) {
        const found = results.find(r => r.name === styleName && r.category === category);
        if (found) return true;
      }
      return false;
    });

    if (stylesInCategory.length === 0) return "";

    return `<div class="category-section" data-category="${category}">
    <div class="category-title">${category}</div>
    ${stylesInCategory.map(styleName => {
      return `<div class="style-row" data-style="${styleName}">
      <div class="style-name">${styleName.replace(/-/g, " ")}</div>
      <div class="model-grid">
        ${MODELS.map(model => {
          const result = (allResults[model] || []).find(r => r.name === styleName);
          if (result) {
            const imgPath = `/experiments/${model}/${styleName}.png`;
            return `<div class="model-card" data-model="${model}" data-style="${styleName}" onclick="openLightbox(this)">
          <button class="star-btn" onclick="event.stopPropagation(); toggleStar(this)"></button>
          <img src="${imgPath}" alt="${model} ${styleName}" loading="lazy" />
          <div class="label"><span class="model-name">${model}</span></div>
        </div>`;
          } else {
            return `<div class="model-card missing" data-model="${model}" data-style="${styleName}">
          <div class="label"><span class="model-name">${model}</span> (failed)</div>
        </div>`;
          }
        }).join("\n        ")}
      </div>
    </div>`;
    }).join("\n    ")}
  </div>`;
  }).join("\n  ")}

  <div class="lightbox" id="lightbox" onclick="closeLightbox()">
    <img id="lightbox-img" src="" alt="" />
    <div class="info" id="lightbox-info"></div>
  </div>

  <div class="export-bar">
    <div class="count"><span id="star-count">0</span> starred</div>
    <button onclick="exportStarred()">Export Starred List</button>
  </div>

  <script>
    const STAR_EMPTY = String.fromCharCode(9734);
    const STAR_FILLED = String.fromCharCode(9733);
    const starred = new Set(JSON.parse(localStorage.getItem('starred') || '[]'));

    // Restore stars
    document.querySelectorAll('.star-btn').forEach(function(btn) {
      var card = btn.closest('.model-card');
      var key = card.dataset.model + '/' + card.dataset.style;
      if (starred.has(key)) {
        btn.classList.add('starred');
        btn.textContent = STAR_FILLED;
      } else {
        btn.textContent = STAR_EMPTY;
      }
    });
    updateStarCount();

    function toggleStar(btn) {
      var card = btn.closest('.model-card');
      var key = card.dataset.model + '/' + card.dataset.style;
      if (starred.has(key)) {
        starred.delete(key);
        btn.classList.remove('starred');
        btn.textContent = STAR_EMPTY;
      } else {
        starred.add(key);
        btn.classList.add('starred');
        btn.textContent = STAR_FILLED;
      }
      localStorage.setItem('starred', JSON.stringify([...starred]));
      updateStarCount();
    }

    function updateStarCount() {
      document.getElementById('star-count').textContent = starred.size;
    }

    function openLightbox(card) {
      var img = card.querySelector('img');
      if (!img) return;
      document.getElementById('lightbox-img').src = img.src;
      document.getElementById('lightbox-info').textContent = card.dataset.model + ' / ' + card.dataset.style;
      document.getElementById('lightbox').classList.add('active');
    }

    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('active');
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;

        document.querySelectorAll('.category-section').forEach(function(sec) {
          if (filter === 'all' || filter === 'starred') {
            sec.style.display = '';
          } else {
            sec.style.display = sec.dataset.category === filter ? '' : 'none';
          }
        });

        if (filter === 'starred') {
          document.querySelectorAll('.model-card').forEach(function(card) {
            var key = card.dataset.model + '/' + card.dataset.style;
            card.style.display = starred.has(key) ? '' : 'none';
          });
        } else {
          document.querySelectorAll('.model-card').forEach(function(card) {
            card.style.display = '';
          });
        }
      });
    });

    function exportStarred() {
      var list = [...starred].map(function(s) {
        var parts = s.split('/');
        return { model: parts[0], style: parts[1], path: '/experiments/' + parts[0] + '/' + parts[1] + '.png' };
      });
      var json = JSON.stringify(list, null, 2);
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'starred-experiments.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

  const outputPath = path.join(experimentsDir, "gallery.html");
  fs.writeFileSync(outputPath, html);
  console.log(`Gallery written to ${outputPath}`);
  console.log(`Total images: ${totalImages}`);
  console.log(`Open in browser: file://${outputPath}`);
}

buildGallery();
