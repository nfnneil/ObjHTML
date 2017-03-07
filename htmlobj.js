//start htmlObj
//beta .1       
        
/// :(hover)!(width) for css definitions
/// >for attribute definition
/// _for my definitions
/// /for storage
/// .for function

_ = {
    global: {},
    setTitle: function(title) {
        document.title = title;
    },
    getTitle: function() {
        return document.title;
    },
    htmlObjRegistry: {},
    backend: {
        frequencyOfTetherCheck: 100,
        tetherPool : {},
        init: function() {
            setInterval(function () {
                for (var key in _.backend.tetherPool) {
                    if (_.backend.tetherPool.hasOwnProperty(key)) {
                        for (i = 0; i < _.backend.tetherPool[key].length; i++) {
                            obj = _.backend.tetherPool[key][i];
                            obj.setAttribute("content",_.global[key]);
                        }
                    }
                }
            },_.backend.frequencyOfTetherCheck);
        },
        currentIdPrefix: "_",
        currentId: 0,
        popId: function() {
            this.currentId++;
            return this.currentIdPrefix + (this.currentId - 1);
        }
    },
    htmlObj: class {
        constructor(input) {
            if (typeof input === 'undefined') {
                input = {};
            }
            this.attribute = {
                "_type" : "div",
                "_tether" : "",
                "_content" : "&nbsp;",
                "_parent" : $(document.body)
            }
            this._previousTether = this.attribute["_type"];
            this.storage = {};
            this.$ = $("#" + this.id);
            this.cssAppend = "";
            this.cssBackbone = {};
            this.id = _.backend.popId();
            _.htmlObjRegistry[this.id] = this;
            this.init();    
            this.reInitialize();
            this.setAttribute(input);
        }
        init() {
            this.attribute["_parent"].append("<style id='_css" + this.id + "'></style>");
            this.$css = $("#_css" + this.id);
        }        
        updateCss() {
            var insides = "";
            for (var key in this.cssBackbone) {
                if (this.cssBackbone.hasOwnProperty(key)) {
                    var temp = "";
                    if (key !== "") {
                        temp = ":" + key;
                    }
                    insides += "#" + this.id + temp +  "{";
                    for (var key2 in this.cssBackbone[key]) {
                        if (this.cssBackbone[key].hasOwnProperty(key2)) {
                            insides += key2 + " : " + this.cssBackbone[key][key2] + ";";
                        }
                    }
                    insides += "}";
                }
            }
            this.$css.html(insides + this.cssAppend);
        }
        setCssAppend(css) {
            this.cssAppend = css;
            updateCss();
        }
        getCssAppend() {
            return this.cssAppend;
        }
        update(attr, setting) {
            if (typeof attr === "undefined") {
                for (var key in this.attribute) {
                    if (this.attribute.hasOwnProperty(key)) {
                        this.update(key,this.attribute[key]);
                    }
                }
            } else {
                this.attribute[attr] = setting;
                switch(attr) {
                    case "_parent":
                        if (typeof setting.$ === "undefined") {
                            setting.append(this.$);
                        } else {
                            setting.$.append(this.$);
                        }
                        break;
                    case "_content":
                        this.$.contents().first().replaceWith(this.getAttribute("_content"));
                        break;
                    case "_tether":
                        if (this.getAttribute("_tether") === "") {
                            break;
                        }
                        for (var key in _.backend.tetherPool) {
                            if (_.backend.tetherPool.hasOwnProperty(key)) {
                                for (i = 0; i < _.backend.tetherPool[key].length; i++) {
                                    if (_.backend.tetherPool[key][i] === this) {
                                        _.backend.tetherPool[key].splice(i, 1)
                                    }
                                }
                            }
                        }
                        if (typeof _.backend.tetherPool[this.getAttribute("_tether")] === "undefined") {
                            _.backend.tetherPool[this.getAttribute("_tether")] = [this];
                        } else {
                            _.backend.tetherPool[this.getAttribute("_tether")].push(this);  
                        }
                        break;
                    case "_type":
                        if (this.getAttribute("_type") !== this._previousTether) {
                            this._previousTether = this.getAttribute("_type");
                            this.reInitialize();
                        }
                        break;
                }
            }
        }
        reInitialize() {
            if (typeof this.$ !== "undefined") {
                this.$.remove();
            }
            var readyHTML = "<" + this.getAttribute("_type") + " id='" + this.id + "'>&nbsp;</" + this.getAttribute("_type") + ">";
            this.attribute["_parent"].append(readyHTML);        
            this.$ = $('#' + this.id);
            this.update();
        }  
        setAttribute(attr, setting) {
            if (typeof attr === "object") {
                for (var key in attr) {
                    if (attr.hasOwnProperty(key)) {
                        this.setAttribute(key, attr[key]);
                    }
                }
            } else {
                var strippedAttr = attr.substring(1);
                switch (attr[0]) {
                    case "_":
                        this.update(attr,setting);
                        break;
                    case ":":
                        if (!strippedAttr.includes("!")) {
                            for (var key in setting) {
                                if (setting.hasOwnProperty(key)) {
                                    if (typeof this.cssBackbone[strippedAttr] === "undefined") {
                                        this.cssBackbone[strippedAttr] = {};
                                    }
                                    this.cssBackbone[strippedAttr][key] = setting[key];
                                }
                            }
                        } else {
                            var myAttr = strippedAttr.split("!");
                            if (typeof this.cssBackbone[myAttr[0]] === "undefined") {
                                this.cssBackbone[myAttr[0]] = {};
                            }
                            this.cssBackbone[myAttr[0]][myAttr[1]] = setting;
                        }
                        this.updateCss();
                        break;
                    case "/":
                        this.storage[strippedAttr] = setting;
                        break;
                    case ">":
                        this.$.attr(strippedAttr,setting);
                        break;
                    case ".":
                        var tree = strippedAttr.split(".");
                        var evalMe = "this";
                        for (i = 0; i < tree.length; i++) {
                            evalMe += "[tree[" + i + "]]";
                        }                
                        evalMe += '(';
                        for (var i = 0; i < setting.length; i++) {
                            evalMe += "setting[" + i + "]"
                            if (i+1 != setting.length) {
                                evalMe += ',';
                            }
                        }
                        evalMe += ');';           
                        eval(evalMe);
                        break;
                }
            }
            return this;
        }
        addChildren(children) {
            for (var i = 0; i < children.length; i++) {
                children[i].setAttribute("_parent",this);
            }
        }
        getAttribute(attr) {
            var strippedAttr = attr.substring(1);
            switch (attr[0]) {
                case "_":
                    return this.attribute[attr];
                case ":":
                    if (!strippedAttr.includes("!")) {
                        return this.cssBackbone[strippedAttr];
                    } else {
                        myAttr = strippedAttr.split("!");
                        return this.cssBackbone[myAttr[0]][myAttr[1]];
                    }
                case "/":
                    return this.storage[strippedAttr];
                case ">":
                    return this.$.attr(strippedAttr);
            }
        }  
        
    }
}

_.backend.init();

//end htmlobj