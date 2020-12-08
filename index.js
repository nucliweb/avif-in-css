const DEFAULT_OTIONS = {
  modules: false,
  noAvifClass: 'no-avif',
  avifClass: 'avif',
  rename: oldName => oldName.replace(/\.(jpe?g|png)/gi, '.avif')
}

module.exports = (opts = {}) => {
  const {modules, noAvifClass, avifClass, rename} = {...DEFAULT_OTIONS, ...opts}

  function addClass(selector, className) {
    className = modules ? `:global(.${className})` : `.${className}`

    return selector.includes('html')
      ? selector.replace(/html[^ ]*/, `$& body${className}`)
      : `body${className} ` + selector
  }

  return {
    postcssPlugin: 'avif-in-css',
    Declaration(decl) {
      if (/\.(jpe?g|png)(?!(\.avif|.*[&?]format=avif))/i.test(decl.value)) {
        const rule = decl.parent
        if (rule.selector.includes(`.${noAvifClass}`)) return
        const avif = rule.cloneAfter()
        avif.each(i => {
          if (i.prop !== decl.prop && i.value !== decl.value) i.remove()
        })
        avif.selectors = avif.selectors.map(i => addClass(i, avifClass))
        avif.each(i => {
          if (
            rename &&
            Object.prototype.toString.call(rename) === '[object Function]'
          ) {
            i.value = rename(i.value)
          }
        })
        const noAvif = rule.cloneAfter()
        noAvif.each(i => {
          if (i.prop !== decl.prop && i.value !== decl.value) i.remove()
        })
        noAvif.selectors = noAvif.selectors.map(i => addClass(i, noAvifClass))
        decl.remove()
        if (rule.nodes.length === 0) rule.remove()
      }
    }
  }
}

module.exports.postcss = true
