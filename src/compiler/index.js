import { parseHTML } from './parse'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // 匹配双大括号及其之间的内容

function genProps(attrs) {
  let str = ''; // ｛name, value｝
  for( let i = 0; i< attrs.length; i++ ) {
    let attr = attrs[i];

    if(attr.name === 'style') { // 也可用第三方qs库
      // color: red; background: red => {color: 'red'}
      let obj = {};

      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value;
      });
      attr.value = obj
    }

    str = `${ attr.name }: ${ JSON.stringify(attr.value) },`; // a:b, c:d
  }
  return `{${ str.slice(0, -1) }}`
}

function gen(node) {
  if( node.type === 1 ) {
    return codegen()
  }else {
    // 文本
    let text = node.text;
    if( !defaultTagRE.test( text ) ) {
      return `_v(${ JSON.stringify(text) })`
    }else {
      // _v(_s(name) + 'hello' + _s(name))
      let tokens = [];
      let match;
      defaultTagRE.lastIndex = 0
      let lastIndex = 0; // hello {{ name }} {{ age }}
      // split
      while(defaultTagRE.exec(text)) {
        let index = match.index; // 匹配的位置 {{ name }} hello {{ name }}
        if(index > lastIndex) {
          tokens.push(JSON.stringify( text.slice(lastIndex, index) ))
        }
        tokens.push(`_s(${ match[1].trim() })`);
        lastIndex = index + match[0].length
      }
      if( lastIndex < text.length ) {
        tokens.push( JSON.stringify(text.slice(lastIndex)) )
      }
      return `_v(${ tokens.join('+') })`
    }

  }
}

function genChildren(children) {
    return children.map(child => gen(child).join(','));
}

function codegen(ast) {
  let children = genChildren(ast);
  let code = `_c('${ ast.tag }', ${ 
    ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
  }${
    ast.children.length ? `,${ children }` : ''
  }
  
  )`;

  return code
}



//  对模板进行编译处理
export function compileToFunction(template) {
  // 1.将template转化成ast
  let ast = parseHTML(template)

  // 2.生成render方法，render方法执行后返回的就是虚拟Dom

  codegen(ast)

}