(function() {
  var $, App, Backbone, MD5, app, jQuery, randomFromTo, showNotification, socket, webkitNotifications, _;

  webkitNotifications = window.webkitNotifications || null;

  jQuery = window.jQuery;

  $ = window.$;

  Backbone = window.Backbone;

  _ = window._;

  MD5 = window.MD5;

  App = {
    views: {},
    models: {},
    collections: {}
  };

  randomFromTo = function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  };

  if (webkitNotifications && webkitNotifications.checkPermission() !== 0) {
    $(document.body).click(function() {
      webkitNotifications.requestPermission();
      return $(document.body).unbind();
    });
  }

  showNotification = function(_arg) {
    var avatar, content, notification, timer, title;
    title = _arg.title, content = _arg.content, avatar = _arg.avatar;
    if (webkitNotifications && webkitNotifications.checkPermission() === 0) {
      avatar || (avatar = "");
      title || (title = "New message");
      content || (content = "");
      timer = null;
      notification = webkitNotifications.createNotification(avatar, title, content);
      notification.ondisplay = function() {
        return timer = setTimeout(function() {
          return notification.cancel();
        }, 5000);
      };
      notification.onclose = function() {
        if (timer) {
          clearTimeout(timer);
          return timer = null;
        }
      };
      return notification.show();
    }
  };

  App.models.Base = Backbone.Model.extend({});

  App.models.App = App.models.Base.extend({
    defaults: {
      user: null,
      users: null,
      messages: null
    }
  });

  App.models.User = App.models.Base.extend({
    url: 'user',
    defaults: {
      email: null,
      displayname: null,
      avatar: null
    },
    initialize: function() {
      var cid, color, displayname, hue, lightness, saturation;
      cid = this.cid;
      color = this.get('color');
      displayname = this.get('displayname');
      if (!displayname) {
        displayname = 'unknown';
        this.set({
          displayname: displayname
        });
      }
      this.bind('change:id', (function(_this) {
        return function(model, id) {
          displayname = _this.get('displayname');
          if (displayname === 'unknown' || !displayname) {
            return _this.set({
              displayname: "User " + id
            });
          }
        };
      })(this));
      if (!color) {
        hue = randomFromTo(0, 360);
        saturation = randomFromTo(30, 80) + '%';
        lightness = randomFromTo(40, 47) + '%';
        color = "hsl(" + hue + ", " + saturation + ", " + lightness + ")";
        this.set({
          color: color
        });
      }
      this.bind('change:email', (function(_this) {
        return function(model, email) {
          var avatarHash, avatarSize, avatarUrl;
          if (email) {
            avatarSize = 32;
            avatarHash = MD5(email);
            avatarUrl = "http://www.gravatar.com/avatar/" + avatarHash + ".jpg?s=" + avatarSize;
          } else {
            avatarUrl = null;
          }
          return _this.set({
            avatar: avatarUrl
          });
        };
      })(this));
      return this;
    }
  });

  App.models.Message = App.models.Base.extend({
    url: 'message',
    defaults: {
      posted: null,
      content: null,
      author: null,
      color: null
    },
    initialize: function() {
      var posted;
      posted = this.get('posted');
      this.bind('change:author', function(model, author) {
        if (author) {
          if (!(author instanceof App.models.User)) {
            return this.set({
              author: new App.models.User(author)
            });
          }
        }
      });
      this.bind('change:posted', function(model, posted) {
        if (posted) {
          if (!(posted instanceof Date)) {
            return this.set({
              posted: new Date(posted)
            });
          }
        }
      });
      if (!posted) {
        this.set({
          posted: new Date()
        });
      }
      return this;
    }
  });

  App.collections.Base = Backbone.Collection.extend({});

  App.collections.Users = App.collections.Base.extend({
    model: App.models.User
  });

  App.collections.Messages = App.collections.Base.extend({
    model: App.models.Message
  });

  App.views.Base = Backbone.View.extend({
    _initialize: function() {
      this.views = {};
      if (this.el && this.options.container) {
        this.el.appendTo(this.options.container);
      }
      return this;
    },
    initialize: function() {
      return this._initialize();
    }
  });

  App.views.UserForm = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views > .userForm.view').clone().data('view', this);
      this.model.bind('change', (function(_this) {
        return function() {
          return _this.populate();
        };
      })(this));
      return this._initialize();
    },
    populate: function() {
      var $displayname, $email, $id, displayname, email, id;
      id = this.model.get('id');
      displayname = this.model.get('displayname');
      email = this.model.get('email');
      $id = this.$('.id').val(id);
      $displayname = this.$('.displayname').val(displayname);
      return $email = this.$('.email').val(email);
    },
    render: function() {
      var $cancelButton, $closeButton, $displayname, $email, $id, $submitButton;
      this.populate();
      $id = this.$('.id');
      $displayname = this.$('.displayname');
      $email = this.$('.email');
      $submitButton = this.$('.submitButton');
      $cancelButton = this.$('.cancelButton');
      $closeButton = this.$('.close');
      $displayname.add($email).keypress((function(_this) {
        return function(event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            return $submitButton.trigger('click');
          }
        };
      })(this));
      $submitButton.click((function(_this) {
        return function() {
          _this.model.set({
            displayname: $displayname.val(),
            email: $email.val()
          });
          _this.hide();
          return _this.trigger('update', _this.model);
        };
      })(this));
      $cancelButton.add($closeButton).click((function(_this) {
        return function() {
          _this.hide();
          return _this.populate();
        };
      })(this));
      return this;
    },
    hide: function() {
      this.el.hide();
      return this;
    },
    show: function() {
      var $displayname;
      this.el.show();
      $displayname = this.$('.displayname');
      $displayname.focus();
      return this;
    }
  });

  App.views.Users = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views > .users.view').clone().data('view', this);
      this.model.bind('add', (function(_this) {
        return function(user) {
          return _this.addUser(user);
        };
      })(this));
      this.model.bind('remove', (function(_this) {
        return function(user) {
          return _this.removeUser(user);
        };
      })(this));
      return this._initialize();
    },
    addUser: function(user) {
      var $userList, userId, userKey;
      $userList = this.$('.userList');
      userId = user.get('id');
      userKey = "user-" + userId;
      this.views[userKey] = new App.views.User({
        model: user,
        container: $('<tr><td class="user wrapper"></tr>').appendTo($userList).find('.user.wrapper')
      }).render();
      return this;
    },
    removeUser: function(user) {
      var $userList, userId, userKey;
      $userList = this.$('.userList');
      userId = user.get('id');
      userKey = "user-" + userId;
      this.views[userKey].el.parent().parent().remove();
      this.views[userKey].remove();
      return this;
    },
    populate: function() {
      var $userList, users;
      this.views = {};
      users = this.model;
      $userList = this.$('.userList').empty();
      users.each((function(_this) {
        return function(user) {
          return _this.addUser(user);
        };
      })(this));
      return this;
    },
    render: function() {
      this.populate();
      return this;
    }
  });

  App.views.User = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views > .user.view').clone().data('view', this);
      this.model.bind('change', (function(_this) {
        return function() {
          return _this.populate();
        };
      })(this));
      return this._initialize();
    },
    populate: function() {
      var $avatar, $displayname, $email, $id, avatar, color, displayname, email, id;
      id = this.model.get('id');
      displayname = this.model.get('displayname');
      email = this.model.get('email');
      avatar = this.model.get('avatar');
      color = this.model.get('color');
      $id = this.$('.id');
      $email = this.$('.email');
      $displayname = this.$('.displayname');
      $avatar = this.$('.avatar');
      $id.text(id || '');
      $displayname.text(displayname || '');
      $email.text(email || '');
      $avatar.empty();
      if (avatar) {
        $('<img>').appendTo($avatar).attr('src', avatar).addClass('avatarImage');
      }
      this.el.css('color', color);
      return this;
    },
    render: function() {
      this.populate();
      return this;
    }
  });

  App.views.Messages = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views > .messages.view').clone().data('view', this);
      this.model.bind('add', (function(_this) {
        return function(message) {
          return _this.addMessage(message);
        };
      })(this));
      return this._initialize();
    },
    addMessage: function(message) {
      var $messageList, messageId, messageKey;
      $messageList = this.$('.messageList');
      messageId = message.get('id');
      messageKey = "message-" + messageId;
      this.views[messageKey] = new App.views.Message({
        model: message,
        container: $messageList
      }).render();
      return this;
    },
    populate: function() {
      var $messageList, messages;
      this.views = {};
      messages = this.model;
      $messageList = this.$('.messageList').empty();
      messages.each((function(_this) {
        return function(message) {
          return _this.addMessage(message);
        };
      })(this));
      return this;
    },
    render: function() {
      this.populate();
      return this;
    }
  });

  App.views.Message = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views .message.view').clone().data('view', this);
      return this._initialize();
    },
    populate: function() {
      var $author, $content, $id, $posted, $time, author, content, id, posted;
      $id = this.$('.id');
      $content = this.$('.content');
      $posted = this.$('.posted');
      $author = this.$('.author.wrapper');
      id = this.model.get('id');
      posted = this.model.get('posted');
      author = this.model.get('author');
      content = this.model.get('content');
      $id.text(id);
      if (author.get('id') === 'system') {
        $content.html(content);
      } else {
        this.markdown || (this.markdown = new Showdown.converter());
        content = this.markdown.makeHtml(content);
        content = window.html_sanitize(content);
        $content.html(content);
      }
      $time = $("<time>").attr('datetime', posted.toUTCString()).appendTo($posted.empty()).timeago(posted);
      this.views.author = new App.views.User({
        model: author,
        container: $author
      }).render();
      return this;
    },
    render: function() {
      this.populate();
      return this;
    }
  });

  App.views.Modal = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views > .modal.view').clone().data('view', this);
      return this._initialize();
    },
    populate: function() {
      var $button, $content, $footer, $primary, $title, button, buttons, content, title, _i, _len;
      title = this.options.title;
      content = this.options.content;
      buttons = this.options.buttons || [];
      $title = this.$('.title');
      $content = this.$('.content');
      $primary = this.$('.primary');
      $footer = this.$('.footer');
      $title.text(title || '').toggle(!!title);
      $content.text(content || '').toggle(!!content);
      $footer.empty();
      for (_i = 0, _len = buttons.length; _i < _len; _i++) {
        button = buttons[_i];
        $button = $('<button>').addClass('btn').text(button.text || 'Ok');
        if (button.primary) {
          $button.addClass('primary');
        }
        $button.click(button.click || (function(_this) {
          return function() {
            return _this.remove();
          };
        })(this));
        $button.appendTo($footer);
      }
      return this;
    },
    render: function() {
      this.populate();
      return this;
    }
  });

  App.views.Notification = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views > .notification.view').clone().data('view', this);
      return this._initialize();
    },
    populate: function() {
      var $content, $title, content, title;
      title = this.options.title;
      content = this.options.content;
      $title = this.$('.title');
      $content = this.$('.content');
      $title.text(title || '').toggle(!!title);
      $content.text(content || '').toggle(!!content);
      return this;
    },
    render: function() {
      this.populate();
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
      this.el.stop(true, true).hide().fadeIn(200, (function(_this) {
        return function() {
          return _this._timeout = setTimeout(function() {
            return _this.el.fadeOut(200, function() {
              if (!((_this.options.destroy != null) && _this.options.destroy === false)) {
                return _this.remove();
              }
            });
          }, 2000);
        };
      })(this));
      return this;
    }
  });

  App.views.App = App.views.Base.extend({
    initialize: function() {
      this.el = $('#views > .app.view').clone().data('view', this);
      _.bindAll(this, 'onKeyPress', 'onNameChange', 'onResize', 'onUserClick');
      return this._initialize();
    },
    start: function($container) {
      var connectedOnce, disconnectedModal, me, messages, socket, system, user, users;
      me = this;
      socket = this.options.socket;
      disconnectedModal = null;
      connectedOnce = false;
      users = new App.collections.Users();
      messages = new App.collections.Messages();
      this.model.set({
        users: users,
        messages: messages
      });
      users.bind('add', (function(_this) {
        return function(user) {
          return _this.user('add', user, false);
        };
      })(this)).bind('remove', (function(_this) {
        return function(message) {
          return _this.user('remove', user, false);
        };
      })(this));
      messages.bind('add', (function(_this) {
        return function(message) {
          return _this.message('add', message, false);
        };
      })(this)).bind('remove', (function(_this) {
        return function(message) {
          return _this.message('remove', message, false);
        };
      })(this));
      system = this.user('create', {
        id: 'system',
        displayname: 'system',
        color: '#DAA520'
      });
      user = this.user('create', {});
      this.model.set({
        system: system,
        user: user
      });
      socket.on('connect', (function(_this) {
        return function() {
          if (disconnectedModal) {
            disconnectedModal.remove();
            disconnectedModal = null;
          }
          return socket.emit('handshake', function(err, _ourUserId, _ourUser, _users) {
            var _user, _userId;
            if (err) {
              throw err;
            }
            if (_ourUser) {
              user.set(_ourUser);
            } else {
              user.set({
                id: _ourUserId
              });
            }
            user.save();
            if (connectedOnce === true) {
              _this.systemMessage('reconnected', {
                user: user
              });
            } else {
              connectedOnce = true;
              _this.systemMessage('welcome', {
                user: user
              });
            }
            users.reset([system, user]);
            for (_userId in _users) {
              _user = _users[_userId];
              _this.user('add', _user);
            }
            return $(function() {
              return _this.render();
            });
          });
        };
      })(this));
      socket.on('disconnect', (function(_this) {
        return function() {
          return disconnectedModal = new App.views.Modal({
            title: 'You have been disconnected',
            content: 'Try refreshing your browser',
            container: _this.el,
            buttons: [
              {
                text: 'Refresh',
                primary: true,
                click: function() {
                  return window.location.reload();
                }
              }
            ]
          }).render();
        };
      })(this));
      socket.on('user', (function(_this) {
        return function(method, data) {
          return _this.user(method, data);
        };
      })(this));
      socket.on('message', (function(_this) {
        return function(method, data) {
          return _this.message(method, data);
        };
      })(this));
      return this;
    },
    render: function() {
      var $editUserButton, $messageInput, $messages, $notificationList, $userForm, $users, messages, user, users;
      user = this.model.get('user');
      users = this.model.get('users');
      messages = this.model.get('messages');
      $editUserButton = this.$('.editUserButton');
      $messages = this.$('.messages.wrapper');
      $userForm = this.$('.userForm.wrapper');
      $users = this.$('.users.wrapper');
      $messageInput = this.$('.messageInput');
      $notificationList = this.$('.notificationList');
      this.views = {};
      if (this.views.messages) {
        this.views.messages.remove();
      }
      this.views.messages = new App.views.Messages({
        model: messages,
        container: $messages.empty()
      }).render();
      if (this.views.users) {
        this.views.users.remove();
      }
      this.views.users = new App.views.Users({
        model: users,
        container: $users.empty()
      }).render();
      if (this.views.userForm) {
        this.views.userForm.remove();
      }
      this.views.userForm = new App.views.UserForm({
        model: user,
        container: $userForm.empty()
      }).render().hide().bind('update', function(user) {
        var notification;
        user.save();
        return notification = new App.views.Notification({
          title: 'Changes saved successfully',
          container: $notificationList
        }).render();
      });
      $editUserButton.unbind().click((function(_this) {
        return function() {
          return _this.views.userForm.show();
        };
      })(this));
      $messageInput.unbind('keypress', this.onKeyPress).bind('keypress', this.onKeyPress);
      $messageInput.focus();
      $users.add($messages).off('click', '.user.view', this.onUserClick).on('click', '.user.view', this.onUserClick);
      $(window).unbind('resize', this.onResize).bind('resize', this.onResize);
      this.resize();
      return this;
    },
    resize: function() {
      var $header, $messageForm, $messagesView, $messagesWrapper, $usersWrapper, $window;
      $window = $(window);
      $header = this.$('.header.topbar');
      $messagesWrapper = this.$('.messages.wrapper');
      $messagesView = $messagesWrapper.find('.messages.view');
      $usersWrapper = this.$('.users.wrapper');
      $messageForm = this.$('.messageForm');
      $usersWrapper.height($window.height());
      $messagesWrapper.width($window.width() - $usersWrapper.outerWidth());
      $messageForm.width($window.width() - $usersWrapper.outerWidth());
      $messagesWrapper.height($window.height() - $messageForm.outerHeight() - $header.outerHeight());
      return setTimeout((function(_this) {
        return function() {
          return $messagesWrapper.prop('scrollTop', $messagesView.outerHeight());
        };
      })(this), 100);
    },
    onUserClick: function(event) {
      var $messageInput, $user, messageContent, user, userDisplayname, view;
      $user = $(event.target);
      if (!$user.is('.user.view')) {
        $user = $user.parents('.user.view:first');
      }
      if ($user.length === 0) {
        return;
      }
      $messageInput = this.$('.messageInput');
      view = $user.data('view');
      user = view.model;
      userDisplayname = user.get('displayname');
      messageContent = $messageInput.val();
      return $messageInput.focus().val(("" + messageContent + " @" + userDisplayname + " ").replace(/^\s+/, ''));
    },
    onKeyPress: function(event) {
      var $messageInput, message, messageContent;
      $messageInput = $(event.target);
      if (event.keyCode === 13) {
        event.preventDefault();
        messageContent = $messageInput.val();
        $messageInput.val('');
        message = this.message('create', {
          author: this.model.get('user'),
          content: messageContent
        });
        return message.save();
      }
    },
    onResize: function(event) {
      return this.resize();
    },
    onNameChange: function(model, userDisplayNameNew) {
      var user, userDisplayNameOld;
      user = model;
      userDisplayNameOld = user.previous('displayname');
      return this.systemMessage('nameChange', {
        user: user,
        userDisplayNameOld: userDisplayNameOld,
        userDisplayNameNew: userDisplayNameNew
      });
    },
    user: function(method, data, applyToCollection) {
      var me, user, users;
      me = this;
      data || (data = {});
      users = this.model.get('users');
      user = users.get(data.id);
      if (applyToCollection == null) {
        applyToCollection = true;
      }
      switch (method) {
        case 'get':
          break;
        case 'delete':
        case 'remove':
          if (user) {
            this.systemMessage('disconnected', {
              user: user
            });
            if (applyToCollection) {
              users.remove(user.id);
            }
            user = null;
          }
          break;
        case 'create':
        case 'update':
        case 'add':
          if (user) {
            if (!(data instanceof App.models.User)) {
              user.set(data);
            }
          } else {
            if (data instanceof App.models.User) {
              user = data;
            } else {
              user = new App.models.User();
            }
            if (data) {
              user.set(data);
            }
            if (applyToCollection) {
              users.add(user);
            }
            user.unbind('change:displayname', this.onNameChange).bind('change:displayname', this.onNameChange);
            this.systemMessage('connected', {
              user: user
            });
          }
      }
      return user;
    },
    message: function(method, data, applyToCollection) {
      var mentionString, message, messageContent, messageContentEnhanced, messages, ourUserDisplayName;
      messages = this.model.get('messages');
      message = messages.get(data.id);
      if (applyToCollection == null) {
        applyToCollection = true;
      }
      switch (method) {
        case 'get':
          break;
        case 'delete':
        case 'remove':
          if (message) {
            if (applyToCollection) {
              messages.remove(data.id);
            }
            message = null;
          }
          break;
        case 'create':
        case 'update':
        case 'add':
          if (message) {
            if (!(data instanceof App.models.Message)) {
              message.set(data);
            }
          } else {
            if (data instanceof App.models.Message) {
              message = data;
            } else {
              message = new App.models.Message();
            }
            if (data) {
              message.set(data);
            }
            if (applyToCollection) {
              messages.add(message);
            }
          }
          messageContent = message.get('content') || '';
          ourUserDisplayName = this.model.get('user').get('displayname');
          mentionString = "@" + ourUserDisplayName;
          messageContentEnhanced = messageContent.replace(mentionString, "**" + mentionString + "**");
          if (messageContentEnhanced !== messageContent) {
            message.set({
              content: messageContentEnhanced
            });
          }
          if (method === 'add') {
            this.resize();
            this.systemMessage('newMessage', {
              message: message
            });
          }
      }
      return message;
    },
    systemMessage: function(code, data) {
      var message, messageAuthor, ourUser, user, userColor, userDisplayName, userDisplayNameNew, userDisplayNameOld, _ref, _ref1, _ref2;
      switch (code) {
        case 'newMessage':
          message = data.message;
          messageAuthor = message.get('author');
          ourUser = this.model.get('user');
          if ((_ref = messageAuthor.get('id')) !== 'system' && _ref !== ourUser.get('id')) {
            showNotification({
              title: messageAuthor.get('displayname') + ' says:',
              avatar: messageAuthor.get('avatar'),
              content: message.get('content')
            });
          }
          break;
        case 'reconnected':
          user = data.user;
          userColor = user.get('color');
          userDisplayName = user.get('displayname');
          ourUser = this.model.get('user');
          this.message('create', {
            author: this.model.get('system'),
            content: "Welcome back <span style='color:" + userColor + "'>" + userDisplayName + "</span>"
          });
          break;
        case 'welcome':
          user = data.user;
          userColor = user.get('color');
          userDisplayName = user.get('displayname');
          ourUser = this.model.get('user');
          this.message('create', {
            author: this.model.get('system'),
            content: "Welcome <span style='color:" + userColor + "'>" + userDisplayName + "</span>"
          });
          break;
        case 'disconnected':
          user = data.user;
          userColor = user.get('color');
          userDisplayName = user.get('displayname');
          ourUser = this.model.get('user') || {};
          if ((_ref1 = user.id) !== 'system' && _ref1 !== ourUser.id) {
            this.message('create', {
              author: this.model.get('system'),
              content: "<span style='color:" + userColor + "'>" + userDisplayName + "</span> has disconnected"
            });
          }
          break;
        case 'nameChange':
          user = data.user;
          userColor = user.get('color');
          userDisplayNameOld = data.userDisplayNameOld;
          userDisplayNameNew = data.userDisplayNameNew;
          if (userDisplayNameOld !== 'unknown') {
            this.message('create', {
              author: this.model.get('system'),
              content: "<span style='color:" + userColor + "'>" + userDisplayNameOld + "</span> has changed their name to <span style='color:" + userColor + "'>" + userDisplayNameNew + "</span>"
            });
          }
          break;
        case 'connected':
          user = data.user;
          userColor = user.get('color');
          userDisplayName = user.get('displayname');
          ourUser = this.model.get('user') || {};
          if ((_ref2 = user.id) !== 'system' && _ref2 !== ourUser.id) {
            this.message('create', {
              author: this.model.get('system'),
              content: "<span style='color:" + userColor + "'>" + userDisplayName + "</span> has joined"
            });
          }
      }
      return this;
    }
  });

  $.timeago.settings.strings.seconds = "moments";

  socket = io.connect(document.location.protocol + '//' + document.location.host);

  Backbone.sync = function(method, model, options) {
    var data;
    data = model.toJSON();
    return socket.emit(model.url, method, data, function(err, data) {
      if (err) {
        throw err;
      }
      return typeof options.success === "function" ? options.success(data) : void 0;
    });
  };

  app = new App.views.App({
    socket: socket,
    container: $('#app'),
    model: new App.models.App()
  });

  app.start();

  window.app = app;

  window.App = App;

}).call(this);
