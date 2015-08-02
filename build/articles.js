(function($) {
    /* prepare for the data
     =====================================*/
    var i, tags = {
        "显示全部": 999999
    };
    for (i = 0; i < $J.labels.length; i++) {
        var t = tags[$J.labels[i]];
        tags[$J.labels[i]] = t ? t+1 : 1;
    }

    $J.labels = [];
    for (var tag in tags) {
        $J.labels.push({
            name: tag,
            value: tags[tag]
        });
    }
    $J.labels.sort(function(a, b){
        return b.value - a.value;
    });

    // usage: get param from url
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        } else{
            return results[1] || 0;
        }
    };
    $J.currentLabel = decodeURI($.urlParam("label"));
    if ($J.currentLabel === 'null') {
        $J.currentLabel = null;
    }

    function simpleClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /* define Components...
     =====================================*/

    var LabelList = React.createClass({displayName: "LabelList",
        getInitialState: function() {
            return {
                labels: simpleClone($J.labels)
            };
        },
        handleClick: function(i, app, e) {
            e.preventDefault();
            var nextSelected = this.state.labels[i].name;
            app.setState({
                selected: nextSelected
            });
            window.history.replaceState({}, '', $J.baseUrl + nextSelected);
        },
        render: function() {
            var list = this,
                selected = this.props.selected,
                createLabel = function(label, i) {
                    var classStr = 'post-label',
                        count = label.value;
                    if (label.name === selected) {
                        classStr += ' select';
                    }
                    if (count > 50000 || count === 1) {
                        count = '';
                    }
                    return (
                        React.createElement("span", {onClick: list.handleClick.bind(list, i, list.props.app), className: classStr, key: i}, 
                            label.name, " ", React.createElement("sup", null, count)
                        )
                    );
                };

            return (
                React.createElement("section", {className: "label-section"}, 
                    React.createElement("h2", null, "标签列表"), 
                    React.createElement("hr", null), 
                    React.createElement("div", null, this.state.labels.map(createLabel))
                )
            );
        }
    });

    var Post = React.createClass({displayName: "Post",
        render: function() {
            var post = this.props.post;
            return (
                React.createElement("li", {className: "article"}, 
                    React.createElement("span", {className: "article-date"}, post.date.substr(5)), 
                    React.createElement("a", {className: "article-title", href: post.link}, post.title)
                )
            );
        }
    });

    var YearHeader = React.createClass({displayName: "YearHeader",
        render: function() {
            var year = this.props.date.substr(0,4);
            return (React.createElement("li", null, React.createElement("h3", null, year, "年")));
        }
    });

    var PostList = React.createClass({displayName: "PostList",
        getInitialState: function() {
            return {
                posts: simpleClone($J.posts),
                searchContent: ''
            };
        },
        searchHandler: function(e) {
            var searchContent = e.target.value;
            this.setState({
                posts: this.state.posts,
                searchContent: searchContent
            });
        },
        render: function() {
            var previousDate = '9999-99-99',
                selected = this.props.selected,
                sContent = this.state.searchContent.toLowerCase(),
                createPost = function(post) {
                    if ((selected === "显示全部" || post.labels.indexOf(selected) >= 0) &&
                        (sContent === '' || post.title.toLowerCase().search(sContent) >= 0)) {
                        var postDOM = [];
                        if (post.date.substr(0,4) < previousDate.substr(0,4)) {
                            postDOM.push(React.createElement(YearHeader, {date: post.date}));
                            previousDate = post.date;
                        }
                        postDOM.push(React.createElement(Post, {post: post}));
                        return postDOM;
                    }
                };

            return (
                React.createElement("section", {className: "articles-section"}, 
                    React.createElement("h2", null, "文章列表"), 
                    React.createElement("input", {onChange: this.searchHandler, className: "search-box", type: "text", placeholder: "搜索包含在标题中的关键词"}), 
                    React.createElement("div", {className: "search-icon"}, 
                        React.createElement("img", {src: $J.staticUrl + "/search_icon.png"})
                    ), 
                    React.createElement("hr", null), 
                    React.createElement("ul", {className: "articles"}, this.state.posts.map(createPost))
                )
            );
        }
    });

    var ArticlesApp = React.createClass({displayName: "ArticlesApp",
        getInitialState: function() {
            return {
                selected: $J.currentLabel || '显示全部'
            };
        },
        render: function() {
            return (
                React.createElement("div", null, 
                    React.createElement(LabelList, {app: this, selected: this.state.selected}), 
                    React.createElement(PostList, {selected: this.state.selected})
                )
            );
        }
    });

    /* Rendering begin...
     =====================================*/

    React.render(React.createElement(ArticlesApp, null), document.getElementById('main'));

}(jQuery));