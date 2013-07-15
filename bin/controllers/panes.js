// Generated by CoffeeScript 1.6.3
(function() {
  var Base, Items, Panes, template, vent,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Base = require('base');

  Items = require('../controllers/items.coffee')();

  vent = null;

  template = null;

  module.exports = function(vnt, tmpl) {
    if (vent == null) {
      vent = vnt;
    }
    if (template == null) {
      template = tmpl;
    }
    return Panes;
  };

  Panes = (function(_super) {
    __extends(Panes, _super);

    Panes.prototype.tagName = 'section';

    Panes.prototype.className = 'pane';

    function Panes() {
      this.right = __bind(this.right, this);
      this.down = __bind(this.down, this);
      this.up = __bind(this.up, this);
      this.move = __bind(this.move, this);
      this.addOne = __bind(this.addOne, this);
      this.render = __bind(this.render, this);
      this.select = __bind(this.select, this);
      this.updateScrollbar = __bind(this.updateScrollbar, this);
      this.remove = __bind(this.remove, this);
      Panes.__super__.constructor.apply(this, arguments);
      this.el = $("<" + this.tagName + " class=\"" + this.className + "\">");
      this.active = null;
      this.listen(this.pane, {
        'remove': this.remove,
        'move:up': this.up,
        'move:down': this.down,
        'move:right': this.right
      });
      this.listen(this.pane.contents, {
        'click:item': this.select
      });
    }

    Panes.prototype.remove = function() {
      this.pane.contents.trigger('remove');
      this.unbind();
      this.el.remove();
      delete this.el;
      delete this.items;
      return this.unlisten();
    };

    Panes.prototype.updateScrollbar = function() {
      var item, offset, parent, pos, scroll;
      item = this.el.find('.active').get(0);
      parent = this.items.get(0);
      pos = item.offsetTop;
      scroll = parent.scrollTop;
      offset = 200;
      return parent.scrollTop = pos - offset;
    };

    Panes.prototype.select = function(item) {
      vent.trigger('select:pane', this.pane);
      this.active = this.pane.contents.indexOf(item);
      this.el.addClass('active');
      this.el.find('.active').removeClass('active');
      item.trigger('select');
      vent.trigger('select:item', item, this.pane);
      return this.updateScrollbar();
    };

    Panes.prototype.render = function() {
      this.el.html(template.render(this.pane.toJSON()));
      this.items = this.el.find('.items');
      this.pane.contents.forEach(this.addOne);
      return this;
    };

    Panes.prototype.addOne = function(item) {
      var itemView;
      itemView = new Items({
        item: item
      });
      return this.items.append(itemView.render().el);
    };

    Panes.prototype.move = function(direction) {
      var active, contents, item, max;
      active = this.active;
      contents = this.pane.contents;
      active += direction;
      max = contents.length - 1;
      if (active < 0) {
        active = 0;
      } else if (active > max) {
        active = max;
      }
      if (active === this.active) {
        return;
      }
      this.active = active;
      item = contents.get(this.active);
      return this.select(item);
    };

    Panes.prototype.up = function() {
      return this.move(-1);
    };

    Panes.prototype.down = function() {
      return this.move(1);
    };

    Panes.prototype.right = function() {
      var child, current, item;
      current = this.pane.contents.get(this.active);
      if (!current.child) {
        return;
      }
      child = current.child.contents;
      item = child.get(0);
      return child.trigger('click:item', item);
    };

    return Panes;

  })(Base.Controller);

}).call(this);
