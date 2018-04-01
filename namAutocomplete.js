function NamAutocomplete(id, dataOrUrl) {
    this.id = id;
    this.activeIndex = -1;
    this.inputEle = document.querySelector('#' + id);
    this.ele = this.inputEle.parentNode;
    this.data = dataOrUrl;
    this.listEle = document.createElement('ul')
    this.init();

}

NamAutocomplete.prototype = {
    // 样式
    ulStyle: {
        'position': 'absolute',
        'border': '1px solid rgba(0,0,0,.15)',
        'border-radius': '4px',
        'box-shadow': '0 6px 12px rgba(0,0,0,.175)',
        'background': 'white',
        'display': 'none',
        'min-width': '100px',
        'padding': '0'
    },
    liStyle: {
        'color': '#333',
        'list-style': 'none',
        'min-width': '100px',
        'padding': '4px 10px'
    },
    liActiveStyle: {
        'background': 'lightblue',
        'color': 'white'
    },


    // 批量设置CSS代码
    css(ele, styles) {
        for (let style in styles) {
            ele.style[style] = styles[style]
        }
    },

    // 初始化
    init() {
        this.css(this.listEle, this.ulStyle);
        this.render()
        this.addEvent()
    },

    render(renderData) {
        if (renderData) {
            this.listEle.innerHTML = '';
            if (renderData.length > 0) {
                renderData.map((item) => {
                    let itemEle = document.createElement('li');
                    this.css(itemEle, this.liStyle);
                    itemEle.innerHTML = item;
                    this.listEle.appendChild(itemEle)
                })
            } else {
                let itemEle = document.createElement('li');
                this.css(itemEle, this.liStyle);
                itemEle.innerHTML = '没有找到匹配项...';
                this.listEle.appendChild(itemEle)
            }
        }
        this.listEle.style.left = this.inputEle.offsetLeft + 'px';
        this.listEle.style.top = this.inputEle.offsetTop + this.inputEle.height + (this.inputEle.clientTop * 2) + 4 + 'px';
        this.ele.appendChild(this.listEle);
    },

    // 获取数据
    getData(dataOrUrl) {
        let that = this;
        if (Object.prototype.toString.call(dataOrUrl) === "[object Array]") {
            this.data = dataOrUrl;
        } else if (Object.prototype.toString.call(dataOrUrl) === "[object String]") {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    that.data = Array.from(JSON.parse(this.responseText));
                } else {
                    xhr.abort()
                }
            }
            xhr.open('get', dataOrUrl, true);
            xhr.send();
        }
    },
    // 显示autocomplete框
    showUl() {
        this.listEle.style.display = 'block';
    },
    // 隐藏autocomplete框
    closeUl() {
        this.listEle.style.display = 'none';
    },

    // 键盘上下键改变样式
    changeStyle(isDown) {
        if (isDown) {
            if (this.listEle.childNodes[this.activeIndex]) {
                this.listEle.childNodes[this.activeIndex].style.background = 'white';
                this.listEle.childNodes[this.activeIndex].style.color = '#333';
            }
            this.activeIndex += 1;
            if (this.listEle.childNodes[this.activeIndex]) {
                this.listEle.childNodes[this.activeIndex].style.background = 'lightblue';
                this.listEle.childNodes[this.activeIndex].style.color = 'white';
            }
        } else {
            if (this.listEle.childNodes[this.activeIndex]) {
                this.listEle.childNodes[this.activeIndex].style.background = 'white';
                this.listEle.childNodes[this.activeIndex].style.color = '#333';
            }
            this.activeIndex -= 1;
            if (this.listEle.childNodes[this.activeIndex]) {
                this.listEle.childNodes[this.activeIndex].style.background = 'lightblue';
                this.listEle.childNodes[this.activeIndex].style.color = 'white';
            }
        }
    },

    // 清除activeStyle
    removeStyle() {
        this.listEle.childNodes[this.activeIndex].style.background = 'white';
        this.listEle.childNodes[this.activeIndex].style.color = '#333';
        this.activeIndex = -1;
    },

    // input事件
    addEvent() {
        this.inputEle.addEventListener('keyup', (e) => {
            console.log(e.keyCode)
            this.showUl();
            let key = e.target.value;
            this.render(this.data.filter((item) => item.includes(key)));
            switch (e.keyCode) {
                case 40:
                    this.changeStyle(true)
                    break;
                case 38:
                    this.changeStyle(false)
                    break;
                case 13:
                    this.inputEle.value = this.listEle.childNodes[this.activeIndex].innerText;
                    this.closeUl()
                    break;
                default:
                    return;
            }
        }, false)
        this.inputEle.addEventListener('blur', (e) => {
            this.closeUl();
        })
        this.inputEle.addEventListener('focus', (e) => {
            this.showUl();
            this.render(this.data.filter((item) => item.includes(e.target.value)));
        })
        this.listEle.addEventListener('mouseover', (e) => {
            if (this.activeIndex >= 0) {
                this.removeStyle();
            }
            if (e.target.tagName === 'LI') {
                e.target.style.background = 'lightblue';
                e.target.style.color = 'white';
                this.inputEle.value = e.target.innerText;
            }
        })
        this.listEle.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'LI') {
                e.target.style.background = 'white';
                e.target.style.color = '#333';
            }
        })
    }

}