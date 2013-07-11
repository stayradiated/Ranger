
Base = require 'base'

Items = require '../controllers/items.coffee'

class Panes extends Base.Controller

  tagName: 'section'
  className: 'pane'
  template: new Base.View $('#pane-template').html(), true

  constructor: ->
    super
    @el = $("<#{@tagName} class=\"#{@className}\">")
    @active = null
    @pane.on 'remove', @remove
    @pane.on 'move:up', @up
    @pane.on 'move:down', @down
    @pane.on 'move:right', @right
    @pane.contents.on 'click:item', @select

  remove: =>
    @el.remove()

  select: (item) =>
    vent.trigger 'select:pane', @pane 
    @active = @pane.contents.indexOf(item)
    @el.addClass 'active'
    @el.find('.active').removeClass('active')
    item.trigger 'select'
    vent.trigger 'select:item', item, @pane

  render: =>
    @el.html @template.render @pane.toJSON()
    @items = @el.find('.items')
    @pane.contents.forEach(@addOne)
    return this
  
  addOne: (item) =>
    itemView = new Items(item: item)
    @items.append itemView.render().el

  move: (direction) =>
    active = @active
    contents = @pane.contents
    active += direction
    max = contents.length - 1
    if active < 0 then active = 0
    else if active > max then active = max
    return if active is @active
    @active = active
    item = contents.get(@active)
    @select(item)

  up: =>
    @move(-1)

  down: =>
    @move(1)

  right: =>
    current = @pane.contents.get(@active)
    return unless current.child
    child = current.child.contents
    item = child.get(0)
    child.trigger 'click:item', item

module.exports = Panes

