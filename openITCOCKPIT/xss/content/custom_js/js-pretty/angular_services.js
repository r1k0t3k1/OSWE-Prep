angular.module('openITCOCKPIT').service('PushNotificationsService', function($interval) {
    var _connection = null;
    var _url = '';
    var _key = '';
    var _userId = 0;
    var _uuid = null;
    var _success = !1;
    var _onSuccess = function(event) {
        _success = !0;
        var data = JSON.parse(event.data);
        console.info('Connection to push notification service established successfully');
        _uuid = data.data.uuid;
        var browserUuid = localStorage.getItem('browserUuid');
        if (browserUuid === null) {
            browserUuid = UUID.generate();
            localStorage.setItem('browserUuid', browserUuid)
        }
        _send(JSON.stringify({
            task: 'register',
            key: _key,
            uuid: _uuid,
            data: {
                userId: _userId,
                browserUuid: browserUuid
            }
        }))
    };
    var _onError = function(event) {
        _success = !1;
        console.error(event)
    };
    var _onResponse = function(event) {};
    var _onDispatch = function(event) {};
    var keepAlive = function() {
        _send(JSON.stringify({
            task: 'keepAlive',
            key: _key,
            uuid: _uuid
        }))
    };
    var _connect = function() {
        _connection = new WebSocket(_url);
        _connection.onopen = _onResponse;
        _connection.onmessage = _parseResponse;
        _connection.onerror = _onError;
        var keepAliveInterval = $interval(function() {
            if (_success) {
                keepAlive()
            }
        }, 30000)
    };
    var _send = function(json) {
        _connection.send(json)
    };
    var _parseResponse = function(event) {
        var transmitted = JSON.parse(event.data);
        switch (transmitted.type) {
            case 'connection':
                _onSuccess(event);
                break;
            case 'message':
                _onResponse(event);
                break;
            case 'keepAlive':
                break
        }
    };
    return {
        toJson: function(task, data) {
            var jsonArr = [];
            jsonArr = JSON.stringify({
                task: task,
                data: data,
                uniqid: _uniqid,
                key: _key
            });
            return jsonArr
        },
        setUserId: function(userId) {
            _userId = userId
        },
        setApiKey: function(key) {
            _key = key
        },
        setUrl: function(url) {
            _url = url
        },
        connect: function() {
            _connect()
        },
        onSuccess: function(callback) {
            _onSuccess = callback
        },
        onError: function(callback) {
            _onError = callback
        },
        onResponse: function(callback) {
            _onResponse = callback
        },
        onDispatch: function(callback) {
            _onDispatch = callback
        },
        send: function(json) {
            _send(json)
        }
    }
});
angular.module('openITCOCKPIT').service('SudoService', function($interval) {
    var _connection = null;
    var _uniqid = null;
    var _url = '';
    var _key = '';
    var _onSuccess = function(event) {
        console.info(event)
    };
    var _onError = function(event) {
        console.error(event)
    };
    var _onResponse = function(event) {};
    var _onDispatch = function(event) {};
    var keepAlive = function() {
        _send(JSON.stringify({
            task: 'keepAlive',
            data: '',
            uniqid: _uniqid,
            key: _key
        }))
    };
    var _connect = function() {
        _connection = new WebSocket(_url);
        _connection.onopen = _onResponse;
        _connection.onmessage = _parseResponse;
        _connection.onerror = _onError;
        var keepAliveInterval = $interval(function() {
            keepAlive()
        }, 30000)
    };
    var _send = function(json) {
        _connection.send(json)
    };
    var _parseResponse = function(event) {
        var transmitted = JSON.parse(event.data);
        switch (transmitted.type) {
            case 'connection':
                _uniqid = transmitted.uniqid;
                _onSuccess(event);
                break;
            case 'response':
                if (_uniqid === transmitted.uniqid) {
                    _onResponse(event)
                }
                break;
            case 'dispatcher':
                _onDispatch(event);
                break;
            case 'keepAlive':
                break
        }
    };
    return {
        toJson: function(task, data) {
            var jsonArr = [];
            jsonArr = JSON.stringify({
                task: task,
                data: data,
                uniqid: _uniqid,
                key: _key
            });
            return jsonArr
        },
        setApiKey: function(key) {
            _key = key
        },
        setUrl: function(url) {
            _url = url
        },
        connect: function() {
            _connect()
        },
        onSuccess: function(callback) {
            _onSuccess = callback
        },
        onError: function(callback) {
            _onError = callback
        },
        onResponse: function(callback) {
            _onResponse = callback
        },
        onDispatch: function(callback) {
            _onDispatch = callback
        },
        send: function(json) {
            _send(json)
        }
    }
});
angular.module('openITCOCKPIT').service('QueryStringService', function() {
    return {
        getCakeId: function() {
            var url = window.location.href;
            url = url.split('/');
            var id = url[url.length - 1];
            id = parseInt(id, 10);
            return id
        },
        getValue: function(varName, defaultReturn) {
            defaultReturn = (typeof defaultReturn === 'undefined') ? null : defaultReturn;
            var query = parseUri(decodeURIComponent(window.location.href)).queryKey;
            if (query.hasOwnProperty(varName)) {
                return query[varName]
            }
            return defaultReturn
        },
        getIds: function(varName, defaultReturn) {
            defaultReturn = (typeof defaultReturn === 'undefined') ? null : defaultReturn;
            try {
                var url = new URL(window.location.href);
                var serviceIds = url.searchParams.getAll(varName);
                if (serviceIds.length > 0) {
                    return serviceIds
                }
                return defaultReturn
            } catch (e) {
                var urlString = window.location.href;
                var peaces = urlString.split(varName);
                var ids = [];
                for (var i = 0; i < peaces.length; i++) {
                    if (peaces[i].charAt(0) === '=') {
                        var currentId = '';
                        for (var k = 0; k < peaces[i].length; k++) {
                            var currentChar = peaces[i].charAt(k);
                            if (currentChar !== '=') {
                                if (currentChar === '&') {
                                    break
                                }
                                currentId = currentId + currentChar
                            }
                        }
                        ids.push(currentId)
                    }
                }
                if (ids.length > 0) {
                    return ids
                }
                return defaultReturn
            }
        },
        hasValue: function(varName) {
            var query = parseUri(decodeURIComponent(window.location.href)).queryKey;
            return query.hasOwnProperty(varName)
        },
        hoststate: function() {
            var query = parseUri(decodeURIComponent(window.location.href)).queryKey;
            var states = {
                up: !1,
                down: !1,
                unreachable: !1
            };
            for (var key in query) {
                if (key === 'filter[Hoststatus.current_state][0]') {
                    states.up = !0
                }
                if (key === 'filter[Hoststatus.current_state][1]') {
                    states.down = !0
                }
                if (key === 'filter[Hoststatus.current_state][2]') {
                    states.unreachable = !0
                }
            }
            return states
        },
        servicestate: function() {
            var query = parseUri(decodeURIComponent(window.location.href)).queryKey;
            var states = {
                ok: !1,
                warning: !1,
                critical: !1,
                unknown: !1
            };
            for (var key in query) {
                if (key === 'filter[Servicestatus.current_state][0]') {
                    states.ok = !0
                }
                if (key === 'filter[Servicestatus.current_state][1]') {
                    states.warning = !0
                }
                if (key === 'filter[Servicestatus.current_state][2]') {
                    states.critical = !0
                }
                if (key === 'filter[Servicestatus.current_state][3]') {
                    states.unknown = !0
                }
            }
            return states
        }
    }
});
angular.module('openITCOCKPIT').service('UuidService', function() {
    return {
        v4: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16)
            })
        }
    }
});
angular.module('openITCOCKPIT').service('MassChangeService', function() {
    var selected = {};
    var selectedCounter = 0;
    return {
        setSelected: function(_selected) {
            selected = {};
            for (var id in _selected) {
                if (_selected[id]) {
                    selected[id] = id
                }
            }
            selectedCounter = Object.keys(selected).length
        },
        getSelected: function() {
            return selected
        },
        clearSelection: function() {
            selected = {};
            selectedCounter = 0
        },
        getCount: function() {
            return selectedCounter
        }
    }
});
angular.module('openITCOCKPIT').service('SortService', function() {
    var _callback = null;
    var sort = null;
    var direction = null;
    var initialize = !0;
    var triggerCallback = function() {
        if (_callback !== null) {
            _callback()
        }
    };
    return {
        setCallback: function(callback) {
            _callback = callback
        },
        triggerReload: triggerCallback,
        getDirection: function() {
            return direction
        },
        getSort: function() {
            return sort
        },
        setDirection: function(value) {
            direction = value
        },
        setSort: function(value) {
            sort = value
        },
        setInitialize: function(value) {
            initialize = value
        }
    }
})