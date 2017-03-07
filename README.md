# ObjHTML
Objective HTML.  It uses a JavaScript PreProcessor to build a webpage based on a series of JavaScript Objects.

This library was born out of the need for a universal language.
Many people use SASS for CSS and CoffeeScript for JavaScript.  I 
think it would be to the benefit of the internet to consolidate
psudeo languages into one.  And, this is my first attempt at it.
ObjHTML is a JavaScript based language which uses an interpretter
to compile and run in browser.

The goal is to no longer have to cross reference id's and class's
across HTML, JavaScript, and CSS by allowing you to write in all
of those attributes in line.

Refer to the following code:

```
<body></body>
<script src="htmlobj.js"></script>
<script>

_.setTitle("Test");

var img = new _.htmlObj ({
    "_type":"img",
    ">src":"test.png",
    ":!width":"100px",
});

var text = new _.htmlObj ({
    "_content":"should change",
    ":hover!color":"red",
    ".addChildren":[[
        new _.htmlObj ({
            "_content":"text me if you can"
        })
    ]],
    ".$.click":[function() {
        _.htmlObjRegistry[$(this).attr("id")].setAttribute("_content","test");
    }]
});

var text2 = new _.htmlObj ({
    "_content":"shouldn't change",
    ":hover!color":"blue"
});

setTimeout(function () {
    img.setAttribute(">src","img/testImage2.png");
    text.setAttribute(":hover!color","yellow");
},1000);

</script>
```

It is a very basic file written in Objective HTML.  You can write in
line hover operations by using ":".  You can use "/" to store information
inside the HTML Object itself.  You can use . to exectute functions upon the code
loading.  Most notably, you can write a .click function directly from
the file to modify the HTML object.

The program comes with a strong jQuery backbone, allowing you to conviently access
many of the core jQuery functions like click, and etc.

The syntax is very simple.  All you have to do is include our library and jquery's:

```
<body></body>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script src="htmlobj.js"></script>
```

Next, you can start defining your own HTML objects like layed out in the above
code example.  What is featured here should be plenty to get you started.
