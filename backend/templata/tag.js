const addField = require('./fields').addField
const fs = require('fs')


// Tag-types which don't need a closing-tag:
const selfClosingTagNames = ['!doctype', 'input', 'img', 'link', 'meta']


// Valueless attributes which either exist, or not:
const flagOnlyAttributeNames = ['html', 'checked']



function addTag(parentTag, tagName, attr={}, content=[]) {

    let tag = new Tag(tagName, attr, content)
    tag.parentTag = parentTag
    parentTag.content.push(tag)
    return tag
}


function forEachChild(tag, doSth=null, childs=[]) {
  if(Array.isArray(tag.content)) {
    let children = tag.content
    for(let i in children) {
      tag = children[i]
      childs.push(tag)
      if(doSth !== null) doSth(tag)
      if(Array.isArray(tag.content)) {
        forEachChild(tag, doSth, childs)
      }
    }
  }
  return childs
}


function tagToHtmlFile(tag, filePath) {
  fs.writeFileSync(filePath, tagToHtml(tag))
  console.log('Wrote', filePath)
}


function tagToHtml(tag, currentIndent='', indent='  ') {

    let tagName = tag.tagName
    let attr    = tag.attr
    let content = tag.content


    // Tag BEGIN (opening-tag):

    var html = currentIndent + '<' + tagName
    for(let propName in attr) {
      let value = attr[propName]
      if(flagOnlyAttributeNames.indexOf(propName) == -1) {
        html += ' ' + propName + '="' + value + '"'
      }
      else if(value !== false && value !== true) {
        throw 'Error: Flag-only property expected to be either true or false!'
            + 'Got property " ' + propName + '" with value ' + value
      }
      else if(value === true) {
        html += ' ' + propName
      }
    }
    html += '>\n'

    // Increase indent for all tags but doc:
    if(tagName != '!doctype') {
      currentIndent += indent
    }


    // Tag CONTENT:

    // Content is a function which returns content:
    if(typeof(content) == 'function') {
      content = content()
    }

    // Content is an array (of tag-objects):
    if(Array.isArray(content)) {
      for(let i in content) {
        // Call this function on each item (tag-object) of array:
        html += tagToHtml(content[i], currentIndent)
      }
    }

    // Content is a string: 
    else if(typeof(content) == 'string') {
      // Add text to html:
      html += currentIndent + content + '\n'
    }

    // Content is invalid:
    else {
      throw 'Error: content must be either an array or a string, we got:' 
          + typeof(content) + ':' + content
    }


    // Decrease indent, if any left:
    if(currentIndent.length > 0) {
      currentIndent = currentIndent.slice(indent.length)
    }


    // Tag END (closing-tag):

    if(selfClosingTagNames.indexOf(tagName) == -1) {
      html += currentIndent + '</' + tagName + '>\n'
    }

    return html

}




class Tag {


  constructor(tagName='div', attr={}, content=[]) {

    this.tagName = tagName,     // e.g. 'body', 'div', ect.
    this.attr = attr,           // key-val-pairs of tag-attributes
    this.content = content     // a string for text, or an array of child-tag(s), or a function which returns a string or an array
  }


  addField(tagName, attr={}, content=[]) {
    let tag = addField(this, tagName, attr, content)
    return tag
  }


  addTag(tagName, attr={}, content=[]) {
    let tag = addTag(this, tagName, attr, content)
    return tag
  }


  goDown(pos=0) {
    if(Array.isArray(this.content)) {
      if(this.content.length > pos) {
        return this.content[pos]
      }
    }
    return null
  }


  goUp() {
    if(this.parentTag !== undefined) return this.parentTag
    return null
  }


  goNext(step=1) {
    let pos = this.parentTag.content.indexOf(this) + step

    if(this.parentTag.content.length > pos) {
      return this.parentTag.content[pos]
    }
    return null
  }


  goPrev(step=1) {
    let pos = this.parentTag.content.indexOf(this) - step

    if(pos > -1) {
      return this.parentTag.content[pos]
    }
    return null
  }


  forEachChild(doSth) {
    forEachChild(this, doSth)
  }


  toJson() {
    return JSON.stringify(this)
  }


  toHtml(currentIndent='', indent='  ') {
    return tagToHtml(this, currentIndent, indent)
  }


  writeHtml(filePath) {
    tagToHtmlFile(this, filePath)
  }


  writeJson(path) {
    fs.writeFileSync(path, this.toJson()); console.log('Wrote', path)
  }

}


exports.Tag = Tag
