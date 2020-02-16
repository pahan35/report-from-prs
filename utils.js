function prsToString(prs, template) {
  return prs
    .map(pr =>
      template
        .replace(/\[title]/g, pr.title)
        .replace(/\[htmlUrl]/g, pr.html_url),
    )
    .join('\n')
}

module.exports = {
  prsToString,
}
