;(function () {
  var script = document.currentScript
  var blogUrl = (script && script.getAttribute('data-blog-url')) ||
    (script && new URL(script.src).origin) ||
    ''
  var containerId = (script && script.getAttribute('data-container')) || 'doc-team-blog'
  var limit = parseInt((script && script.getAttribute('data-limit')) || '5', 10)
  var theme = (script && script.getAttribute('data-theme')) || 'light'
  var showExcerpt = (script && script.getAttribute('data-excerpt')) !== 'false'

  var container = document.getElementById(containerId)
  if (!container) return

  var isDark = theme === 'dark'

  var styles = `
    #${containerId} * { box-sizing: border-box; margin: 0; padding: 0; }
    #${containerId} { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .dtb-widget { background: ${isDark ? '#1e293b' : '#ffffff'}; border: 1px solid ${isDark ? '#334155' : '#e2e8f0'}; border-radius: 12px; overflow: hidden; }
    .dtb-header { background: ${isDark ? '#0f172a' : '#1e3a8a'}; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; }
    .dtb-header-title { color: #ffffff; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
    .dtb-header-dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; display: inline-block; }
    .dtb-header-link { color: #93c5fd; font-size: 12px; text-decoration: none; }
    .dtb-header-link:hover { color: #fff; }
    .dtb-list { list-style: none; }
    .dtb-item { border-bottom: 1px solid ${isDark ? '#1e293b' : '#f1f5f9'}; }
    .dtb-item:last-child { border-bottom: none; }
    .dtb-item a { display: block; padding: 14px 18px; text-decoration: none; transition: background 0.15s; }
    .dtb-item a:hover { background: ${isDark ? '#0f172a' : '#f8fafc'}; }
    .dtb-title { color: ${isDark ? '#f1f5f9' : '#0f172a'}; font-size: 14px; font-weight: 600; line-height: 1.4; margin-bottom: 4px; }
    .dtb-meta { color: ${isDark ? '#64748b' : '#94a3b8'}; font-size: 12px; margin-bottom: 5px; }
    .dtb-excerpt { color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 12px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .dtb-footer { padding: 10px 18px; text-align: center; border-top: 1px solid ${isDark ? '#334155' : '#f1f5f9'}; }
    .dtb-footer a { color: ${isDark ? '#60a5fa' : '#1d4ed8'}; font-size: 12px; text-decoration: none; font-weight: 500; }
    .dtb-footer a:hover { text-decoration: underline; }
    .dtb-loading { padding: 24px; text-align: center; color: ${isDark ? '#64748b' : '#94a3b8'}; font-size: 13px; }
  `

  var styleEl = document.createElement('style')
  styleEl.textContent = styles
  document.head.appendChild(styleEl)

  function formatDate(dateStr) {
    var d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  container.innerHTML = '<div class="dtb-widget"><div class="dtb-loading">Loading posts…</div></div>'

  fetch(blogUrl + '/api/posts?limit=' + limit)
    .then(function (r) { return r.json() })
    .then(function (posts) {
      if (!posts || !posts.length) {
        container.querySelector('.dtb-loading').textContent = 'No posts available.'
        return
      }

      var html = '<div class="dtb-widget">'
      html += '<div class="dtb-header">'
      html += '<span class="dtb-header-title"><span class="dtb-header-dot"></span>Doc Team Blog</span>'
      html += '<a class="dtb-header-link" href="' + blogUrl + '" target="_blank">View all →</a>'
      html += '</div>'
      html += '<ul class="dtb-list">'

      posts.forEach(function (post) {
        var tags = post.tags ? post.tags.split(',').slice(0, 2).map(function(t){ return t.trim() }).join(' · ') : ''
        html += '<li class="dtb-item">'
        html += '<a href="' + blogUrl + '/' + post.slug + '" target="_blank">'
        html += '<div class="dtb-title">' + escHtml(post.title) + '</div>'
        html += '<div class="dtb-meta">' + escHtml(post.author) + (tags ? ' &middot; ' + escHtml(tags) : '') + ' &middot; ' + formatDate(post.createdAt) + '</div>'
        if (showExcerpt && post.excerpt) {
          html += '<div class="dtb-excerpt">' + escHtml(post.excerpt) + '</div>'
        }
        html += '</a></li>'
      })

      html += '</ul>'
      html += '<div class="dtb-footer"><a href="' + blogUrl + '" target="_blank">Read more on the Doc Team Blog →</a></div>'
      html += '</div>'

      container.innerHTML = html
    })
    .catch(function () {
      container.innerHTML = '<div class="dtb-widget"><div class="dtb-loading">Could not load posts.</div></div>'
    })

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }
})()
