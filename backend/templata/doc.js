const Tag = require('./tag').Tag


class Doc extends Tag {

  constructor(renderPath='untitled', stylePaths=[], scriptPaths=[]) {

    super('!doctype', { html: true })

    this.name = renderPath
    this.renderPath = renderPath
    this.stylePaths = stylePaths
    this.scriptPaths = scriptPaths


    let tag = this.addTag('html', { lang: 'en-gb'})

		    tag = tag.addTag('head')

          tag.addTag('title', {}, this.name[0].toUpperCase() + this.name.slice(1) )

          tag.addTag('meta', { charset: 'utf-8'})

        tag = this.content[0]

		    this.body = tag.addTag('body')


		for(let i in this.stylePaths) {
			this.addStyleSheet( this.scriptPaths[i] + '.css' )
		}

		for(let i in this.scriptPaths) {
			this.addScriptFile( this.scriptPaths[i] + '.js' )
		}

	}


  addScriptFile(path) {
    this.content[0].content[0].addTag('script', { src: path })
  }


  addStyleSheet(path) {
    this.content[0].content[0].addTag('link', { href: path,
                                        type: 'text/css',
                                        rel: 'stylesheet'
    })
  }

  writeRenderedHtml() {
    this.writeHtml(this.renderPath)
  }
}


exports.Doc = Doc
