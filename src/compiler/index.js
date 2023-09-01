const ncname = `[a-zA-Z][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ ncname }\\:)?${ncname})`;

const startTagOpen = new RegExp(`^<${ qnameCapture }`); // 匹配到的分组是一个 标签名 或者说是开始标签

const endTag = new RegExp(`^<\\/${ qnameCapture }[^>]*>`); // 匹配到的是关闭标签
const attribute = /^\s*(^\s"'<>\/-]+)(?:\s*(-)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'-<>`]+)))?/; // 属性标签
const startTagClose = /^\s*(\/?)>/; // 自闭合标签
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // 匹配双大括号及其之间的内容

// vue3采用的不是使用正则
// 对模板进行编译处理
function parseHTML(html) { // html最开始肯定是一个<

  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3
  const stack = []; // 用于存放元素的
  let currentParent; // 指向的是栈中的最后一个
  let root;

  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  // 最终需要转换成一个抽象语法树
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs); // 创造一个ast节点
    if(!root) {  // 看一下是否是空树
      root = node   // 如果为空则当前是树的根节点
    }

    if(currentParent) {
      node.parent = currentParent;
      currentParent.children.push(node);
    }


    stack.push(node);
    currentParent = node; // currentParent为栈中的最后一个
  }

  function charts(text) { // 文本直接放到当前指向的节点
    text = text.replace(/\s/g, '')
    currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    })
  }

  function end(tag) {
    let node =  stack.pop(); // 弹出最后一个 可以在这里校验标签是否合法
    currentParent = stack[stack.length-1]
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if( start ) {
      const match = {
        tagName: start[1], // 标签名
        attrs: []
      }
      advance(start[0].length);
      // 如果不是开始标签的结束> 就一直匹配
      let attr, end;
      while( !(end = html.match(startTagClose)) && (attr = html.match(attribute)) ) {
        advance(attr[0].length)
        match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5] })
      }

      if(end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }


  while(html) {
    // 如果textend为0，说明是一个开始标签，或者结束标签
    // 如果textend > 0 说明就是文本结束的位置
    let textEnd = html.indexOf('<'); // 如果indexOf的索引是0，则说明是个标签

    if( textEnd == 0 ) {
      const statrTagMatch = parseStartTag(); // 开始标签的匹配结果

      if( statrTagMatch ) { // 解析到的开始标签
        start(statrTagMatch.tagName, statrTagMatch.attrs)
        continue;
      }

      let endTagMatch = html.match(endTag);

      if ( endTagMatch ) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1])
        continue;
      }

    }

    if( textEnd > 0 ) {
      let text = html.substring(0, textEnd); // 文本内容

      if( text ) {
        charts(text)
        advance(text.length) // 解析到的文本
      }

      break;

    }


  }
}

//  对模板进行编译处理
export function compileToFunction(template) {
  // 1.将template转化成ast
  let ast = parseHTML(template)

  // 2.生成render方法，render方法执行后返回的就是虚拟Dom

}