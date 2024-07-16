angular.module('openITCOCKPIT').directive('sendHostNotification', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/send_host_notification.html',
        controller: function($scope) {
            var objects = {};
            var author = 'Unknown';
            var callbackName = !1;
            $scope.isSubmittingHostNotification = !1;
            $scope.sendHostNotification = {
                comment: 'Test notification',
                force: !0,
                broadcast: !0
            };
            $scope.setHostNotificationObjects = function(_objects) {
                objects = _objects
            };
            $scope.setHostNotificationAuthor = function(_author) {
                author = _author
            };
            $scope.setHostNotificationCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doSubmitHostNotification = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isSubmittingHostNotification = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    var type = 0;
                    if ($scope.sendHostNotification.force) {
                        type = 1
                    }
                    if ($scope.sendHostNotification.broadcast) {
                        type = 2
                    }
                    if ($scope.sendHostNotification.force && $scope.sendHostNotification.broadcast) {
                        type = 3
                    }
                    SudoService.send(SudoService.toJson('sendCustomHostNotification', [object.Host.uuid, type, author, $scope.sendHostNotification.comment]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isSubmittingHostNotification = !1;
                    $scope.percentage = 0;
                    $('#angularSubmitHostNotificationModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.submitHostNotification = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setHostNotificationCallback(attr.callback)
                }
                $('#angularSubmitHostNotificationModal').modal('show');
                $scope.setHostNotificationObjects(objects);
                $scope.setHostNotificationAuthor(attr.author)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('acknowledgeHost', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/acknowledge_host.html',
        controller: function($scope) {
            $scope.doHostAck = !1;
            $scope.hostAckType = 'hostOnly';
            $scope.ack = {
                comment: '',
                sticky: !1,
                error: !1
            };
            var objects = {};
            var author = '';
            var callbackName = !1;
            $scope.setHostAckObjects = function(_objects) {
                objects = _objects
            };
            $scope.setHostAckAuthor = function(_author) {
                author = _author
            };
            $scope.setHostAckCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doAcknowledgeHost = function() {
                $scope.ack.error = !1;
                if ($scope.ack.comment === '') {
                    $scope.ack.error = !0;
                    return !1
                }
                var sticky = 0;
                if ($scope.ack.sticky === !0) {
                    sticky = 2
                }
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.doHostAck = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitHoststateAck', [object.Host.uuid, $scope.ack.comment, author, sticky, $scope.hostAckType]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.doHostAck = !1;
                    $scope.percentage = 0;
                    $('#angularacknowledgeHostModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.acknowledgeHost = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setHostAckCallback(attr.callback)
                }
                $scope.setHostAckObjects(objects);
                $scope.setHostAckAuthor(attr.author);
                $('#angularacknowledgeHostModal').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('servicecumulatedstatusicon', function() {
    return {
        restrict: 'E',
        templateUrl: '/services/servicecumulatedstatusicon.html',
        scope: {
            'state': '=?'
        },
        controller: function($scope) {
            $scope.setServiceCumulatedStatusColors = function() {
                var currentServiceCumulatedState = -1;
                if (typeof $scope.state === "undefined" && $scope.state === null) {
                    currentServiceCumulatedState = -1
                } else {
                    currentServiceCumulatedState = parseInt($scope.state, 10)
                }
                switch (currentServiceCumulatedState) {
                    case 0:
                        $scope.iconColor = 'text-success';
                        return;
                    case 1:
                        $scope.iconColor = 'text-warning';
                        return;
                    case 2:
                        $scope.iconColor = 'text-danger';
                        return;
                    case 3:
                        $scope.iconColor = 'text-default';
                        return;
                    default:
                        $scope.iconColor = 'text-primary'
                }
            };
            $scope.setServiceCumulatedStatusColors()
        },
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('enableServiceNotifications', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/enable_service_notifications.html',
        controller: function($scope) {
            var objects = {};
            $scope.isEnableingServiceNotifications = !1;
            var callbackName = !1;
            $scope.setEnableServiceNotificationsObjects = function(_objects) {
                objects = _objects
            };
            $scope.setEnableServiceNotificationsCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doEnableServiceNotifications = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isEnableingServiceNotifications = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitEnableServiceNotifications', [object.Host.uuid, object.Service.uuid]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isEnableingServiceNotifications = !1;
                    $scope.percentage = 0;
                    $('#angularEnableServiceNotificationsModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.enableServiceNotifications = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setEnableServiceNotificationsCallback(attr.callback)
                }
                $('#angularEnableServiceNotificationsModal').modal('show');
                $scope.setEnableServiceNotificationsObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('submitHostResult', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/submit_host_result.html',
        controller: function($scope) {
            var objects = {};
            var maxCheckAttempts = 10;
            var callbackName = !1;
            $scope.isSubmittingHostResult = !1;
            $scope.passiveHostState = "0";
            $scope.passiveHostResult = {
                output: 'Test alert',
                hardStateForce: !1
            };
            $scope.hostReschedulingType = 'hostAndServices';
            $scope.setHostResultObjects = function(_objects) {
                objects = _objects
            };
            $scope.setMaxCheckAttemptsHost = function(_maxCheckAttempts) {
                maxCheckAttempts = _maxCheckAttempts
            };
            $scope.setHostResultCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doSubmitHostResult = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isSubmittingHostResult = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    var sendMaxCheckAttempts = 1;
                    if ($scope.passiveHostResult.hardStateForce) {
                        sendMaxCheckAttempts = maxCheckAttempts
                    }
                    SudoService.send(SudoService.toJson('commitPassiveResult', [object.Host.uuid, $scope.passiveHostResult.output, $scope.passiveHostState, $scope.passiveHostResult.hardStateForce, sendMaxCheckAttempts]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isSubmittingHostResult = !1;
                    $scope.percentage = 0;
                    $('#angularSubmitHostResultModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.submitHostResult = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setHostResultCallback(attr.callback)
                }
                $('#angularSubmitHostResultModal').modal('show');
                $scope.setHostResultObjects(objects);
                if (attr.hasOwnProperty('maxCheckAttempts')) {
                    $scope.setMaxCheckAttemptsHost(attr.maxCheckAttempts)
                }
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('massDeleteServiceDowntimes', function($http, $filter, $timeout) {
    return {
        restrict: 'E',
        replace: !0,
        templateUrl: '/angular/mass_delete_service_downtimes.html',
        controller: function($scope) {
            $scope.includeServices = !0;
            $scope.percentage = 0;
            $scope.isDeleting = !1;
            var callbackName = !1;
            var objects = {};
            $scope.myDeleteUrl = $scope.deleteUrl;
            $scope.setObjectsForMassServiceDowntimeDelete = function(_objects) {
                objects = _objects
            };
            $scope.setCallbackForMassServiceDowntimeDelete = function(_callback) {
                callbackName = _callback
            };
            $scope.doDeleteServiceDowntime = function() {
                $scope.isDeleting = !0;
                var count = Object.keys(objects).length;
                var i = 0;
                for (var id in objects) {
                    var data = {
                        type: 'service'
                    };
                    $http.post($scope.myDeleteUrl + id + ".json", data).then(function(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        if (i === count) {
                            $scope.isDeleting = !1;
                            $scope.percentage = 0;
                            if (callbackName) {
                                $scope[callbackName]()
                            } else {
                                $scope.load()
                            }
                            $('#angularMassDeleteServiceDowntimes').modal('hide')
                        }
                    })
                }
            }
        },
        link: function($scope, element, attr) {
            $scope.confirmServiceDowntimeDelete = function(objects) {
                if (attr.hasOwnProperty('deleteUrl')) {
                    $scope.myDeleteUrl = attr.deleteUrl
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setCallbackForMassServiceDowntimeDelete(attr.callback)
                }
                $scope.setObjectsForMassServiceDowntimeDelete(objects);
                $('#angularMassDeleteServiceDowntimes').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('confirmDelete', function($http, $filter, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/confirm_delete.html',
        controller: function($scope) {
            var object;
            $scope.setObject = function(_object) {
                object = _object
            };
            $scope.delete = function() {
                $scope.isDeleting = !0;
                $http.post($scope.deleteUrl).then(function(result) {
                    window.location.href = $scope.sucessUrl
                }, function errorCallback(result) {
                    console.error(result.data)
                })
            }
        },
        link: function($scope, element, attr) {
            $scope.confirmDelete = function(object) {
                $scope.setObject(object);
                $('#angularConfirmDelete').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('sendServiceNotification', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/send_service_notification.html',
        controller: function($scope) {
            var objects = {};
            var author = 'Unknown';
            var callbackName = !1;
            $scope.isSubmittingServiceNotification = !1;
            $scope.sendServiceNotification = {
                comment: 'Test notification',
                force: !0,
                broadcast: !0
            };
            $scope.setServiceNotificationObjects = function(_objects) {
                objects = _objects
            };
            $scope.setServiceNotificationAuthor = function(_author) {
                author = _author
            };
            $scope.setServiceNotificationCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doSubmitServiceNotification = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isSubmittingServiceNotification = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    var type = 0;
                    if ($scope.sendServiceNotification.force) {
                        type = 1
                    }
                    if ($scope.sendServiceNotification.broadcast) {
                        type = 2
                    }
                    if ($scope.sendServiceNotification.force && $scope.sendServiceNotification.broadcast) {
                        type = 3
                    }
                    SudoService.send(SudoService.toJson('sendCustomServiceNotification', [object.Host.uuid, object.Service.uuid, type, author, $scope.sendServiceNotification.comment]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isSubmittingServiceNotification = !1;
                    $scope.percentage = 0;
                    $('#angularSubmitServiceNotificationModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.submitServiceNotification = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setServiceNotificationCallback(attr.callback)
                }
                $('#angularSubmitServiceNotificationModal').modal('show');
                $scope.setServiceNotificationObjects(objects);
                $scope.setServiceNotificationAuthor(attr.author)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('disableNotifications', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/executing.html?id=angularDisableNotificationsModal',
        controller: function($scope) {
            var callbackName = !1;
            $scope.setDisableNotificationsCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doDisableNotifications = function(objects) {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitDisableServiceNotifications', [object.Host.uuid, object.Service.uuid]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.percentage = 0;
                    $('#angularDisableNotificationsModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.disableNotifications = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setDisableNotificationsCallback(attr.callback)
                }
                $('#angularDisableNotificationsModal').modal('show');
                $scope.doDisableNotifications(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('disableHostNotifications', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/disable_host_notifications.html',
        controller: function($scope) {
            var objects = {};
            $scope.isDisableingHostNotifications = !1;
            $scope.disableHostNotificationsType = 'hostOnly';
            var callbackName = !1;
            $scope.setDisableHostNotificationsObjects = function(_objects) {
                objects = _objects
            };
            $scope.setDisableHostNotificationsCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doDisableHostNotifications = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isDisableingHostNotifications = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitDisableHostNotifications', [object.Host.uuid, $scope.disableHostNotificationsType]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isDisableingHostNotifications = !1;
                    $scope.percentage = 0;
                    $('#angularDisableHostNotificationsModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.disableHostNotifications = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setDisableHostNotificationsCallback(attr.callback)
                }
                $('#angularDisableHostNotificationsModal').modal('show');
                $scope.setDisableHostNotificationsObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('chosen', function($http, $filter, $rootScope, $timeout) {
    return {
        restrict: 'A',
        controller: function($scope) {},
        link: function($scope, element, attrs) {
            var oldTimeout = !1;
            var callback = !1;
            if (attrs.callback) {
                callback = attrs.callback
            }
            var unwatchModel = $scope.$watch(attrs.ngModel, function() {
                element.trigger('chosen:updated')
            });
            var unwatchSource = $scope.$watchCollection(attrs.chosen, function() {
                element.trigger('chosen:updated')
            });
            var defaultOptions = {
                placeholder_text_single: 'Please choose',
                placeholder_text_multiple: 'Please choose',
                allow_single_deselect: !0,
                search_contains: !0,
                enable_split_word_search: !0,
                width: '100%',
                search_callback: function(searchString) {
                    if (callback) {
                        if (oldTimeout) {
                            $timeout.cancel(oldTimeout)
                        }
                        oldTimeout = $timeout(function() {
                            $scope[callback](searchString)
                        }, 500)
                    }
                }
            };
            if (attrs.hasOwnProperty('multiple') === !0) {
                defaultOptions.select_all_buttons = !0
            }
            if (callback) {
                defaultOptions.no_results_text = 'Search for '
            }
            element.chosen(defaultOptions);
            $scope.$on('$destroy', function() {
                unwatchModel();
                unwatchSource()
            })
        }
    }
});
angular.module('openITCOCKPIT').directive('disableServiceFlapDetection', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/disable_service_flap_detection.html',
        controller: function($scope) {
            var objects = {};
            var callbackName = !1;
            $scope.isDisableingServiceFlapDetection = !1;
            $scope.setDisableServiceFlapDetectionObjects = function(_objects) {
                objects = _objects
            };
            $scope.setDisableServiceFlapDetectionCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doDisableServiceFlapDetection = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isDisableingServiceFlapDetection = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('enableOrDisableServiceFlapdetection', [object.Host.uuid, object.Service.uuid, 0]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isDisableingServiceFlapDetection = !1;
                    $scope.percentage = 0;
                    $('#angularDisableServiceFalpDetectionModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.disableServiceFlapDetection = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setDisableServiceFlapDetectionCallback(attr.callback)
                }
                $('#angularDisableServiceFalpDetectionModal').modal('show');
                $scope.setDisableServiceFlapDetectionObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('hoststatusicon', function($interval) {
    return {
        restrict: 'E',
        templateUrl: '/hosts/icon.html',
        scope: {
            'host': '=?',
            'state': '=?'
        },
        controller: function($scope) {
            if (typeof $scope.host === "undefined") {
                $scope.host = {
                    Hoststatus: {}
                }
            }
            $scope.isFlapping = $scope.host.Hoststatus.isFlapping;
            $scope.flappingState = 0;
            var interval;
            $scope.setHostStatusColors = function() {
                var currentstate = -1;
                if (typeof $scope.state === "undefined") {
                    currentstate = parseInt($scope.host.Hoststatus.currentState, 10);
                    if ($scope.host.Hoststatus.currentState === null) {
                        currentstate = -1
                    }
                } else {
                    currentstate = parseInt($scope.state, 10)
                }
                switch (currentstate) {
                    case 0:
                        $scope.btnColor = 'success';
                        $scope.flappingColor = 'txt-color-green';
                        return;
                    case 1:
                        $scope.btnColor = 'danger';
                        $scope.flappingColor = 'txt-color-red';
                        return;
                    case 2:
                        $scope.btnColor = 'default';
                        $scope.flappingColor = 'txt-color-blueDark';
                        return;
                    default:
                        $scope.btnColor = 'primary';
                        $scope.flappingColor = 'text-primary'
                }
            };
            $scope.startFlapping = function() {
                $scope.stopFlapping();
                interval = $interval(function() {
                    if ($scope.flappingState === 0) {
                        $scope.flappingState = 1
                    } else {
                        $scope.flappingState = 0
                    }
                }, 750)
            };
            $scope.stopFlapping = function() {
                if (interval) {
                    $interval.cancel(interval)
                }
                interval = null
            };
            $scope.setHostStatusColors();
            if ($scope.isFlapping) {
                $scope.startFlapping()
            } else {
                $scope.stopFlapping()
            }
        },
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('enableServiceFlapDetection', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/enable_service_flap_detection.html',
        controller: function($scope) {
            var objects = {};
            var callbackName = !1;
            $scope.isEnableingServiceFlapDetection = !1;
            $scope.setEnableServiceFlapDetectionObjects = function(_objects) {
                objects = _objects
            };
            $scope.setEnableServiceFlapDetectionCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doEnableServiceFlapDetection = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isEnableingServiceFlapDetection = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('enableOrDisableServiceFlapdetection', [object.Host.uuid, object.Service.uuid, 1]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isEnableingServiceFlapDetection = !1;
                    $scope.percentage = 0;
                    $('#angularEnableServiceFalpDetectionModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.enableServiceFlapDetection = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setEnableServiceFlapDetectionCallback(attr.callback)
                }
                $('#angularEnableServiceFalpDetectionModal').modal('show');
                $scope.setEnableServiceFlapDetectionObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('rescheduleService', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/executing.html?id=angularRescheduleServiceModal',
        controller: function($scope) {
            var callbackName = !1;
            $scope.setServiceRescheduleCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doReschedule = function(objects) {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('rescheduleService', [object.Host.uuid, object.Service.uuid, object.Host.satelliteId]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.percentage = 0;
                    $('#angularRescheduleServiceModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.reschedule = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setServiceRescheduleCallback(attr.callback)
                }
                $('#angularRescheduleServiceModal').modal('show');
                $scope.doReschedule(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('serviceDowntime', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/downtime_service.html',
        controller: function($scope) {
            $scope.doDowntime = !1;
            $scope.downtimeModal = {
                comment: '',
                from_date: '',
                from_time: '',
                to_date: '',
                to_time: ''
            };
            var objects = {};
            var author = '';
            var callbackName = !1;
            $scope.setServiceDowntimeObjects = function(_objects) {
                objects = _objects
            };
            $scope.setServiceDowntimeAuthor = function(_author) {
                author = _author
            };
            $scope.setServiceDowntimeCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doServiceDowntime = function() {
                $http.post("/downtimes/validateDowntimeInputFromAngular.json?angular=true", $scope.downtimeModal).then(function(result) {
                    var count = Object.keys(objects).length;
                    var i = 0;
                    $scope.percentage = 0;
                    $scope.doDowntime = !0;
                    $scope.percentage = Math.round(i / count * 100);
                    for (var id in objects) {
                        var object = objects[id];
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        SudoService.send(SudoService.toJson('submitServiceDowntime', [object.Host.uuid, object.Service.uuid, $scope.downtimeModal.from_date + ' ' + $scope.downtimeModal.from_time, $scope.downtimeModal.to_date + ' ' + $scope.downtimeModal.to_time, $scope.downtimeModal.comment, author]))
                    }
                    if (callbackName) {
                        $scope[callbackName]()
                    }
                    $timeout(function() {
                        $scope.doDowntime = !1;
                        $scope.percentage = 0;
                        $('#angularServiceDowntimeModal').modal('hide')
                    }, 500)
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            }
        },
        link: function($scope, element, attr) {
            $scope.serviceDowntime = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setServiceDowntimeCallback(attr.callback)
                }
                $scope.setServiceDowntimeObjects(objects);
                $scope.setServiceDowntimeAuthor(attr.author);
                $('#angularServiceDowntimeModal').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('paginator', function($http, $filter, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/angular/paginator.html',
        scope: {
            'paging': '=',
            'clickAction': '='
        },
        controller: function($scope) {
            var paginatorLimit = 5;
            var paginatorOffset = 2;
            $scope.changePage = function(page) {
                $scope.clickAction(page)
            };
            $scope.prevPage = function() {
                var page = $scope.paging.page - 1;
                if (page < 1) {
                    page = 1
                }
                $scope.clickAction(page)
            };
            $scope.nextPage = function() {
                var page = $scope.paging.page + 1;
                if (page > $scope.paging.pageCount) {
                    page = $scope.paging.pageCount
                }
                $scope.clickAction(page)
            };
            $scope.pageNumbers = function() {
                if ($scope.paging.hasOwnProperty('pageCount')) {
                    if ($scope.paging.pageCount <= paginatorLimit) {
                        var pages = {};
                        for (i = 1; i <= $scope.paging.pageCount; i++) {
                            pages[i] = i
                        }
                        return pages
                    }
                    if ($scope.paging.pageCount > paginatorLimit) {
                        if (($scope.paging.page + paginatorLimit > $scope.paging.pageCount) || ($scope.paging.page >= paginatorLimit)) {
                            var pages = {};
                            var start = $scope.paging.page - paginatorOffset;
                            var end = $scope.paging.page + paginatorOffset;
                            if (end > $scope.paging.pageCount) {
                                start = $scope.paging.pageCount - paginatorLimit + 1;
                                end = $scope.paging.pageCount
                            }
                            for (var i = start; i <= end; i++) {
                                pages[i] = i
                            }
                            return pages
                        }
                        return {
                            1: 1,
                            2: 2,
                            3: 3,
                            4: 4,
                            5: 5
                        }
                    }
                }
                return {}
            }
        },
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('servicestatusicon', function($interval) {
    return {
        restrict: 'E',
        templateUrl: '/services/icon.html',
        scope: {
            'service': '=?',
            'state': '=?'
        },
        controller: function($scope) {
            if (typeof $scope.service === "undefined") {
                $scope.service = {
                    Servicestatus: {}
                }
            }
            $scope.isFlapping = $scope.service.Servicestatus.isFlapping || !1;
            $scope.flappingState = 0;
            var interval;
            $scope.setServiceStatusColors = function() {
                var currentstate = -1;
                if (typeof $scope.state === "undefined") {
                    currentstate = parseInt($scope.service.Servicestatus.currentState, 10);
                    if ($scope.service.Servicestatus.currentState === null) {
                        currentstate = -1
                    }
                } else {
                    currentstate = parseInt($scope.state, 10)
                }
                switch (currentstate) {
                    case 0:
                        $scope.btnColor = 'success';
                        $scope.flappingColor = 'txt-color-green';
                        return;
                    case 1:
                        $scope.btnColor = 'warning';
                        $scope.flappingColor = 'warning';
                        return;
                    case 2:
                        $scope.btnColor = 'danger';
                        $scope.flappingColor = 'txt-color-red';
                        return;
                    case 3:
                        $scope.btnColor = 'default';
                        $scope.flappingColor = 'txt-color-blueDark';
                        return;
                    default:
                        $scope.btnColor = 'primary';
                        $scope.flappingColor = 'text-primary'
                }
            };
            $scope.startFlapping = function() {
                $scope.stopFlapping();
                interval = $interval(function() {
                    if ($scope.flappingState === 0) {
                        $scope.flappingState = 1
                    } else {
                        $scope.flappingState = 0
                    }
                }, 750)
            };
            $scope.stopFlapping = function() {
                if (interval) {
                    $interval.cancel(interval)
                }
                interval = null
            };
            $scope.setServiceStatusColors();
            if ($scope.isFlapping) {
                $scope.startFlapping()
            } else {
                $scope.stopFlapping()
            }
        },
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('hostDowntime', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/downtime_host.html',
        controller: function($scope) {
            $scope.doDowntime = !1;
            $scope.downtimeModal = {
                comment: '',
                from_date: '',
                from_time: '',
                to_date: '',
                to_time: '',
                hostDowntimeType: "1"
            };
            var objects = {};
            var author = '';
            var callbackName = !1;
            $scope.setHostDowntimeObjects = function(_objects) {
                objects = _objects
            };
            $scope.setHostDowntimeAuthor = function(_author) {
                author = _author
            };
            $scope.setHostDowntimeCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.loadHostdowntimeDefaultSelection = function() {
                $http.get("/angular/downtime_host.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.downtimeModal.hostDowntimeType = String(result.data.preselectedDowntimetype)
                })
            };
            $scope.doHostDowntime = function() {
                $http.post("/downtimes/validateDowntimeInputFromAngular.json?angular=true", $scope.downtimeModal).then(function(result) {
                    var count = Object.keys(objects).length;
                    var i = 0;
                    $scope.percentage = 0;
                    $scope.doDowntime = !0;
                    $scope.percentage = Math.round(i / count * 100);
                    for (var id in objects) {
                        var object = objects[id];
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        SudoService.send(SudoService.toJson('submitHostDowntime', [object.Host.uuid, $scope.downtimeModal.from_date + ' ' + $scope.downtimeModal.from_time, $scope.downtimeModal.to_date + ' ' + $scope.downtimeModal.to_time, $scope.downtimeModal.comment, author, $scope.downtimeModal.hostDowntimeType]))
                    }
                    if (callbackName) {
                        $scope[callbackName]()
                    }
                    $timeout(function() {
                        $scope.doDowntime = !1;
                        $scope.percentage = 0;
                        $('#angularHostDowntimeModal').modal('hide')
                    }, 500)
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            }
        },
        link: function($scope, element, attr) {
            $scope.hostDowntime = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setHostDowntimeCallback(attr.callback)
                }
                $scope.setHostDowntimeObjects(objects);
                $scope.setHostDowntimeAuthor(attr.author);
                $scope.loadHostdowntimeDefaultSelection();
                $('#angularHostDowntimeModal').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('serverTime', function($http, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/user_timezone.html',
        controller: function($scope) {
            $scope.initTime = !0;
            $scope.showClientTime = !1;
            var getCurrentTimeWithOffset = function(offset) {
                return new Date(($scope.timezone.server_time_utc + (offset || 0)) * 1000 + (new Date().getTime() - $scope.pageLoadedTime))
            };
            var getServerTime = function() {
                return getCurrentTimeWithOffset($scope.timezone.server_timezone_offset)
            };
            var getClientTime = function() {
                return getCurrentTimeWithOffset($scope.timezone.user_offset)
            };
            var formatTimeAsString = function(time) {
                return prependZero(time.getUTCHours()) + ':' + prependZero(time.getUTCMinutes())
            };
            var prependZero = function(number) {
                if (number < 10) {
                    return '0' + number
                }
                return number.toString()
            };
            $scope.loadServerTime = function() {
                $http.get("/angular/user_timezone.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.timezone = result.data.timezone;
                    $scope.pageLoadedTime = new Date().getTime();
                    $scope.initTime = !1;
                    if ($scope.timezone.user_offset !== $scope.timezone.server_timezone_offset) {
                        $scope.showClientTime = !0
                    }
                    $scope.runClocks()
                })
            };
            $scope.runClocks = function() {
                $scope.currentServerTime = formatTimeAsString(getServerTime());
                if ($scope.showClientTime === !0) {
                    $scope.currentClientTime = formatTimeAsString(getClientTime())
                }
                $timeout($scope.runClocks, 10000)
            };
            $scope.loadServerTime()
        },
        link: function(scope, element, attr) {
            jQuery(element).find("[rel=tooltip]").tooltip()
        }
    }
});
angular.module('openITCOCKPIT').directive('hostServiceList', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/hosts/hostservicelist.html',
        scope: {
            'hostId': '=',
            'showServices': '=',
            'timezone': '=',
            'host': '='
        },
        controller: function($scope) {
            $scope.deleteUrl = '/services/delete/';
            $scope.deactivateUrl = '/services/deactivate/';
            $scope.init = !0;
            var defaultFilter = function() {
                $scope.filter = {
                    Service: {
                        name: ''
                    }
                }
            };
            var graphStart = 0;
            var graphEnd = 0;
            $scope.loadServicesWithStatus = function() {
                $http.get("/services/index.json", {
                    params: {
                        'angular': !0,
                        'filter[Host.id]': $scope.hostId,
                        'filter[Service.servicename]': $scope.filter.Service.name
                    }
                }).then(function(result) {
                    $scope.services = result.data.all_services;
                    $scope.servicesStateFilter = {
                        0: !0,
                        1: !0,
                        2: !0,
                        3: !0
                    };
                    $scope.init = !1
                })
            };
            $scope.mouseenter = function($event, host, service) {
                $scope.isLoadingGraph = !0;
                var offset = {
                    top: $event.relatedTarget.offsetTop + 40,
                    left: $event.relatedTarget.offsetLeft + 40
                };
                offset.top += $event.relatedTarget.offsetParent.offsetTop;
                var currentScrollPosition = $(window).scrollTop();
                var margin = 15;
                var $popupGraphContainer = $('#serviceGraphContainer');
                if ((offset.top - currentScrollPosition + margin + $popupGraphContainer.height()) > $(window).innerHeight()) {
                    $popupGraphContainer.css({
                        'top': parseInt(offset.top - $popupGraphContainer.height() - margin + 10),
                        'left': parseInt(offset.left + margin),
                        'padding': '6px'
                    })
                } else {
                    $popupGraphContainer.css({
                        'top': parseInt(offset.top + margin),
                        'left': parseInt(offset.left + margin),
                        'padding': '6px'
                    })
                }
                $popupGraphContainer.show();
                loadGraph(host, service)
            };
            $scope.mouseleave = function() {
                $('#serviceGraphContainer').hide();
                $('#serviceGraphFlot').html('')
            };
            var loadGraph = function(host, service) {
                var serverTime = new Date($scope.timezone.server_time);
                graphEnd = Math.floor(serverTime.getTime() / 1000);
                graphStart = graphEnd - (3600 * 4);
                $http.get('/Graphgenerators/getPerfdataByUuid.json', {
                    params: {
                        angular: !0,
                        host_uuid: host.uuid,
                        service_uuid: service.Service.uuid,
                        start: graphStart,
                        end: graphEnd,
                        jsTimestamp: 1
                    }
                }).then(function(result) {
                    $scope.isLoadingGraph = !1;
                    renderGraph(result.data.performance_data)
                })
            };
            var renderGraph = function(performance_data) {
                var graph_data = [];
                for (var dsCount in performance_data) {
                    graph_data[dsCount] = [];
                    for (var timestamp in performance_data[dsCount].data) {
                        var frontEndTimestamp = (parseInt(timestamp, 10) + ($scope.timezone.user_time_to_server_offset * 1000));
                        graph_data[dsCount].push([frontEndTimestamp, performance_data[dsCount].data[timestamp]])
                    }
                }
                var GraphDefaultsObj = new GraphDefaults();
                var color_amount = performance_data.length < 3 ? 3 : performance_data.length;
                var colors = GraphDefaultsObj.getColors(color_amount);
                var options = GraphDefaultsObj.getDefaultOptions();
                options.colors = colors.border;
                options.xaxis.tickFormatter = function(val, axis) {
                    var fooJS = new Date(val);
                    var fixTime = function(value) {
                        if (value < 10) {
                            return '0' + value
                        }
                        return value
                    };
                    return fixTime(fooJS.getDate()) + '.' + fixTime(fooJS.getMonth() + 1) + '.' + fooJS.getFullYear() + ' ' + fixTime(fooJS.getHours()) + ':' + fixTime(fooJS.getMinutes())
                };
                options.xaxis.min = (graphStart + $scope.timezone.user_time_to_server_offset) * 1000;
                options.xaxis.max = (graphEnd + $scope.timezone.user_time_to_server_offset) * 1000;
                self.plot = $.plot('#serviceGraphFlot', graph_data, options)
            };
            defaultFilter();
            $scope.$watch('showServices', function() {
                if ($scope.showServices[$scope.hostId]) {
                    $scope.loadServicesWithStatus()
                }
            }, !0);
            $scope.$watch('filter', function() {
                if ($scope.init) {
                    return
                }
                $scope.loadServicesWithStatus()
            }, !0)
        }
    }
});
angular.module('openITCOCKPIT').directive('confirmDeactivate', function($http, $filter, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/confirm_deactivate.html',
        controller: function($scope) {
            var object;
            $scope.setObjectForDeactivate = function(_object) {
                object = _object
            };
            $scope.deactivate = function() {
                $scope.isDeactivating = !0;
                $http.post($scope.deactivateUrl).then(function(result) {
                    window.location.href = $scope.sucessUrl
                }, function errorCallback(result) {
                    console.error(result.data)
                })
            }
        },
        link: function($scope, element, attr) {
            $scope.confirmDeactivate = function(object) {
                $scope.setObjectForDeactivate(object);
                $('#angularConfirmDeactivate').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('disableServiceNotifications', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/disable_service_notifications.html',
        controller: function($scope) {
            var objects = {};
            $scope.isDisableingServiceNotifications = !1;
            var callbackName = !1;
            $scope.setDisableServiceNotificationsObjects = function(_objects) {
                objects = _objects
            };
            $scope.setDisableServiceNotificationsCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doDisableServiceNotifications = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isDisableingServiceNotifications = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitDisableServiceNotifications', [object.Host.uuid, object.Service.uuid]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isDisableingServiceNotifications = !1;
                    $scope.percentage = 0;
                    $('#angularDisableServiceNotificationsModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.disableServiceNotifications = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setDisableServiceNotificationsCallback(attr.callback)
                }
                $('#angularDisableServiceNotificationsModal').modal('show');
                $scope.setDisableServiceNotificationsObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('submitServiceResult', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/submit_service_result.html',
        controller: function($scope) {
            var objects = {};
            var maxCheckAttempts = 10;
            var callbackName = !1;
            $scope.isSubmittingServiceResult = !1;
            $scope.passiveServiceState = "0";
            $scope.passiveServiceResult = {
                output: 'Test alert',
                hardStateForce: !1
            };
            $scope.setServiceResultObjects = function(_objects) {
                objects = _objects
            };
            $scope.setMaxCheckAttemptsService = function(_maxCheckAttempts) {
                maxCheckAttempts = _maxCheckAttempts
            };
            $scope.setServiceResultCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doSubmitServiceResult = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isSubmittingServiceResult = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    var sendMaxCheckAttempts = 1;
                    if ($scope.passiveServiceResult.hardStateForce) {
                        sendMaxCheckAttempts = maxCheckAttempts
                    }
                    SudoService.send(SudoService.toJson('commitPassiveServiceResult', [object.Host.uuid, object.Service.uuid, $scope.passiveServiceResult.output, $scope.passiveServiceState, $scope.passiveServiceResult.hardStateForce, sendMaxCheckAttempts]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isSubmittingServiceResult = !1;
                    $scope.percentage = 0;
                    $('#angularSubmitServiceResultModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.submitServiceResult = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setServiceResultCallback(attr.callback)
                }
                $('#angularSubmitServiceResultModal').modal('show');
                $scope.setServiceResultObjects(objects);
                if (attr.hasOwnProperty('maxCheckAttempts')) {
                    $scope.setMaxCheckAttemptsService(attr.maxCheckAttempts)
                }
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('servicestatusiconAutomap', function($interval) {
    return {
        restrict: 'E',
        templateUrl: '/automaps/icon.html',
        scope: {
            'servicestatus': '='
        },
        controller: function($scope) {
            $scope.setServiceStatusColors = function() {
                var currentstate = parseInt($scope.servicestatus.currentState, 10);
                $scope.icon = 'fa-square';
                if ($scope.servicestatus.problemHasBeenAcknowledged) {
                    $scope.icon = 'fa-user'
                }
                if ($scope.servicestatus.scheduledDowntimeDepth > 0) {
                    $scope.icon = 'fa-power-off'
                }
                switch (currentstate) {
                    case 0:
                        $scope.iconColor = 'ok';
                        return;
                    case 1:
                        $scope.iconColor = 'warning';
                        return;
                    case 2:
                        $scope.iconColor = 'critical';
                        return;
                    case 3:
                        $scope.iconColor = 'unknown';
                        return;
                    default:
                        $scope.iconColor = 'primary'
                }
            };
            $scope.setServiceStatusColors()
        },
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('exportStatus', function($http, SudoService) {
    return {
        restrict: 'A',
        controller: function($scope) {
            $scope.exportRunning = !1;
            $scope.callback = function(event) {
                var data = JSON.parse(event.data);
                $scope.exportRunning = data.running
            };
            $scope.connectToSudoServer = function() {
                $http.get("/angular/websocket_configuration.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.websocketConfig = result.data.websocket;
                    SudoService.setUrl($scope.websocketConfig['SUDO_SERVER.URL']);
                    SudoService.setApiKey($scope.websocketConfig['SUDO_SERVER.API_KEY']);
                    SudoService.onDispatch($scope.callback);
                    SudoService.connect()
                })
            };
            $scope.connectToSudoServer()
        },
        link: function(scope, element, attr) {
            jQuery(element).find("[rel=tooltip]").tooltip()
        }
    }
});
angular.module('openITCOCKPIT').directive('menustats', function($http, $interval) {
    return {
        restrict: 'E',
        templateUrl: '/angular/menustats.html',
        controller: function($scope) {
            $scope.showstatsinmenu = !1;
            $scope.hoststatusCount = {};
            $scope.servicestatusCount = {};
            $scope.load = function() {
                $http.get("/angular/menustats.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.showstatsinmenu = result.data.showstatsinmenu;
                    $scope.hoststatusCount = result.data.hoststatusCount;
                    $scope.servicestatusCount = result.data.servicestatusCount
                })
            };
            $interval($scope.load, 30000);
            $scope.load()
        },
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('massdeactivate', function($http, $filter, $timeout) {
    return {
        restrict: 'E',
        replace: !0,
        templateUrl: '/angular/mass_deactivate.html',
        controller: function($scope) {
            $scope.objects = {};
            $scope.percentage = 0;
            $scope.isDeactivating = !1;
            $scope.setObjectsForMassDeactivate = function(objects) {
                $scope.objects = objects
            };
            $scope.issueObjects = {};
            $scope.deactivate = function() {
                $scope.isDeactivating = !0;
                var count = Object.keys($scope.objects).length;
                var i = 0;
                var issueCount = 0;
                for (var id in $scope.objects) {
                    $http.post($scope.deactivateUrl + id + ".json").then(function(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        issueCount = Object.keys($scope.issueObjects).length;
                        if (i === count && issueCount === 0) {
                            $scope.isDeactivating = !1;
                            $scope.percentage = 0;
                            $scope.load();
                            $('#angularMassDeactivate').modal('hide')
                        }
                    }, function errorCallback(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        if (result.data.hasOwnProperty('success') && result.data.hasOwnProperty('usedBy')) {
                            var id = result.data.id;
                            $scope.issueObjects[id] = [];
                            for (var key in result.data.usedBy) {
                                $scope.issueObjects[id].push({
                                    message: result.data.usedBy[key].message,
                                    url: result.data.usedBy[key].baseUrl + id
                                })
                            }
                        }
                        issueCount = Object.keys($scope.issueObjects).length;
                        if (i === count && issueCount > 0) {
                            $scope.isDeactivating = !1;
                            $scope.percentage = 0;
                            $scope.load()
                        }
                    })
                }
            }
        },
        link: function($scope, element, attr) {
            $scope.confirmDeactivate = function(objects) {
                $scope.setObjectsForMassDeactivate(objects);
                $('#angularMassDeactivate').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('massDeleteHostDowntimes', function($http, $filter, $timeout) {
    return {
        restrict: 'E',
        replace: !0,
        templateUrl: '/angular/mass_delete_host_downtimes.html',
        controller: function($scope) {
            $scope.includeServices = !0;
            $scope.percentage = 0;
            $scope.isDeleting = !1;
            $scope.myDeleteUrl = $scope.deleteUrl;
            var objects = {};
            var callbackName = !1;
            $scope.setObjectsForMassHostDowntimeDelete = function(_objects) {
                objects = _objects
            };
            $scope.setCallbackForMassHostDowntimeDelete = function(_callback) {
                callbackName = _callback
            };
            $scope.doDeleteHostDowntime = function() {
                $scope.isDeleting = !0;
                var count = Object.keys(objects).length;
                var i = 0;
                for (var id in objects) {
                    var data = {
                        includeServices: $scope.includeServices,
                        type: 'host'
                    };
                    $http.post($scope.myDeleteUrl + id + ".json", data).then(function(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        if (i === count) {
                            $scope.isDeleting = !1;
                            $scope.percentage = 0;
                            $('#angularMassDeleteHostDowntimes').modal('hide');
                            if (callbackName) {
                                $scope[callbackName]()
                            } else {
                                $scope.load()
                            }
                        }
                    })
                }
            }
        },
        link: function($scope, element, attr) {
            $scope.confirmHostDowntimeDelete = function(objects) {
                if (attr.hasOwnProperty('deleteUrl')) {
                    $scope.myDeleteUrl = attr.deleteUrl
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setCallbackForMassHostDowntimeDelete(attr.callback)
                }
                $scope.setObjectsForMassHostDowntimeDelete(objects);
                $('#angularMassDeleteHostDowntimes').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('enableHostNotifications', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/enable_host_notifications.html',
        controller: function($scope) {
            var objects = {};
            $scope.isEnableingHostNotifications = !1;
            $scope.enableHostNotificationsType = 'hostOnly';
            var callbackName = !1;
            $scope.setEnableHostNotificationsObjects = function(_objects) {
                objects = _objects
            };
            $scope.setEnableHostNotificationsCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doEnableHostNotifications = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isEnableingHostNotifications = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitEnableHostNotifications', [object.Host.uuid, $scope.enableHostNotificationsType]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isEnableingHostNotifications = !1;
                    $scope.percentage = 0;
                    $('#angularEnableHostNotificationsModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.enableHostNotifications = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setEnableHostNotificationsCallback(attr.callback)
                }
                $('#angularEnableHostNotificationsModal').modal('show');
                $scope.setEnableHostNotificationsObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('massactivate', function($http, $filter, $timeout) {
    return {
        restrict: 'E',
        replace: !0,
        templateUrl: '/angular/mass_activate.html',
        controller: function($scope) {
            $scope.objects = {};
            $scope.percentage = 0;
            $scope.isActivating = !1;
            $scope.setObjectsForMassActivate = function(objects) {
                $scope.objects = objects
            };
            $scope.issueObjects = {};
            $scope.activate = function() {
                $scope.isActivating = !0;
                var count = Object.keys($scope.objects).length;
                var i = 0;
                var issueCount = 0;
                for (var id in $scope.objects) {
                    $http.post($scope.activateUrl + id + ".json").then(function(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        issueCount = Object.keys($scope.issueObjects).length;
                        if (i === count && issueCount === 0) {
                            $scope.isActivating = !1;
                            $scope.percentage = 0;
                            $scope.load();
                            $('#angularMassAactivate').modal('hide')
                        }
                    }, function errorCallback(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        if (result.data.hasOwnProperty('success')) {
                            var id = result.data.id;
                            $scope.issueObjects[id] = [];
                            $scope.issueObjects[id].push({
                                message: result.data.message
                            })
                        }
                        issueCount = Object.keys($scope.issueObjects).length;
                        if (i === count && issueCount > 0) {
                            $scope.isActivating = !1;
                            $scope.percentage = 0;
                            $scope.load()
                        }
                    })
                }
            }
        },
        link: function($scope, element, attr) {
            $scope.confirmActivate = function(objects) {
                $scope.setObjectsForMassActivate(objects);
                $('#angularMassAactivate').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('menu', function($http, $timeout, $httpParamSerializer) {
    return {
        restrict: 'A',
        templateUrl: '/angular/menu.html',
        scope: {
            phpplugin: '@',
            phpcontroller: '@',
            phpaction: '@'
        },
        controller: function($scope) {
            $scope.menuFilter = '';
            $scope.currentMenu = [];
            $scope.menuMatches = [];
            $scope.menuFilterPosition = -1;
            $scope.load = function() {
                $http.get("/angular/menu.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.menu = result.data.menu
                })
            };
            $scope.isActiveChild = function(childNode) {
                if (childNode.url_array.plugin == $scope.phpplugin) {
                    if (childNode.url_array.controller === $scope.phpcontroller) {
                        if (childNode.url_array.action === $scope.phpaction) {
                            return !0
                        }
                    }
                }
                return !1
            };
            $scope.isActiveParent = function(parentNode) {
                if (parentNode.url_array && parentNode.url_array.plugin == $scope.phpplugin) {
                    if (parentNode.url_array.controller === $scope.phpcontroller) {
                        if (parentNode.url_array.action === $scope.phpaction) {
                            return !0
                        }
                    }
                }
                if (parentNode.children.length > 0) {
                    for (var index in parentNode.children) {
                        if ($scope.isActiveChild(parentNode.children[index])) {
                            return !0
                        }
                    }
                }
                return !1
            };
            $scope.isActiveParentStyle = function(parentNode) {
                if ($scope.isActiveParent(parentNode)) {
                    return 'display:block;'
                }
                return ''
            };
            $scope.parentHref = function(parentNode) {
                if (parentNode.children.length > 0) {
                    return '#'
                }
                return parentNode.url
            };
            $scope.navigate = function($event) {
                const RETURN_KEY = 13;
                const ARROW_KEY_UP = 38;
                const ARROW_KEY_DOWN = 40;
                var keyCode = $event.keyCode;
                if (keyCode === RETURN_KEY && $scope.menuFilterPosition > -1) {
                    window.location.href = $scope.menuMatches[$scope.menuFilterPosition].url;
                    return
                }
                if (keyCode === RETURN_KEY && $scope.menuFilterPosition === -1) {
                    window.location.href = '/hosts/index?filter[Host.name]=' + rawurlencode($scope.menuFilter)
                }
                if (keyCode !== ARROW_KEY_UP && keyCode !== ARROW_KEY_DOWN) {
                    return
                }
                if (keyCode === ARROW_KEY_DOWN && $scope.menuFilterPosition + 1 < $scope.menuMatches.length) {
                    $scope.menuFilterPosition++
                }
                if (keyCode === ARROW_KEY_UP && $scope.menuFilterPosition - 1 >= 0) {
                    $scope.menuFilterPosition--
                }
            };
            $scope.load();
            $scope.$watch('menuFilter', function() {
                var searchString = $scope.menuFilter;
                if (searchString.length === 0) {
                    $scope.menuMatches = [];
                    $scope.menuFilterPosition = -1;
                    return
                }
                $scope.menuMatches = [];
                $scope.menuFilterPosition = -1;
                searchString = searchString.toLowerCase().replace(/ /g, '');
                for (var parentKey in $scope.menu) {
                    if ($scope.menu[parentKey].children.length === 0) {
                        var parentTitle = $scope.menu[parentKey].title.toLowerCase().replace(/ /g, '');
                        if (parentTitle.match(searchString)) {
                            $scope.menuMatches.push($scope.menu[parentKey])
                        }
                    }
                    for (var childKey in $scope.menu[parentKey].children) {
                        var title = $scope.menu[parentKey].children[childKey].title.toLowerCase().replace(/ /g, '');
                        if (title.match(searchString)) {
                            $scope.menuMatches.push($scope.menu[parentKey].children[childKey])
                        }
                    }
                }
            })
        },
        link: function($scope, element, attrs) {
            $scope.menuInit = 0;
            var watch = $scope.$watch(function() {
                return element.children().children().length
            }, function() {
                $scope.$evalAsync(function() {
                    if ($scope.menuInit < 2) {
                        $scope.menuInit++;
                        $(element).jarvismenu({
                            accordion: !0,
                            speed: $.menu_speed,
                            closedSign: '<em class="fa fa-plus-square-o"></em>',
                            openedSign: '<em class="fa fa-minus-square-o"></em>'
                        })
                    }
                })
            })
        }
    }
});
angular.module('openITCOCKPIT').directive('versionCheck', function($http, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/version_check.html',
        controller: function($scope) {
            $scope.newVersionAvailable = !1;
            $scope.load = function() {
                $http.get("/angular/version_check.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.newVersionAvailable = result.data.newVersionAvailable
                })
            };
            $scope.load()
        },
        link: function(scope, element, attr) {
            jQuery(element).find("[rel=tooltip]").tooltip()
        }
    }
});
angular.module('openITCOCKPIT').directive('downtimeicon', function($interval) {
    return {
        restrict: 'E',
        templateUrl: '/downtimes/icon.html',
        scope: {
            'downtime': '='
        },
        controller: function($scope) {},
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('systemHealth', function($http, $interval) {
    return {
        restrict: 'E',
        templateUrl: '/angular/system_health.html',
        controller: function($scope) {
            $scope.systemHealthDefault = {
                state: "unknown",
                update: "n/a"
            };
            $scope.class = 'text-primary';
            $scope.systemHealth = $scope.systemHealthDefault;
            $scope.load = function() {
                $http.get("/angular/system_health.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    if (result.data.status.cache_readable) {
                        $scope.systemHealth = result.data.status
                    } else {
                        $scope.systemHealth = $scope.systemHealthDefault
                    }
                    $scope.class = $scope.getHealthClass()
                })
            };
            $scope.getHealthClass = function() {
                switch ($scope.systemHealth.state) {
                    case 'ok':
                        return 'up';
                    case 'warning':
                        return 'warning';
                    case 'critical':
                        return 'down';
                    default:
                        return 'text-primary'
                }
            };
            $interval($scope.load, 60000);
            $scope.load()
        },
        link: function(scope, element, attr) {
            jQuery(element).find("[rel=tooltip]").tooltip();
            jQuery('#activity').click(function(e) {
                $this = $(this);
                if (!$this.next('.ajax-dropdown').is(':visible')) {
                    $this.next('.ajax-dropdown').fadeIn(150);
                    $this.addClass('active')
                } else {
                    $this.next('.ajax-dropdown').fadeOut(150);
                    $this.removeClass('active')
                }
                e.preventDefault()
            })
        }
    }
});
angular.module('openITCOCKPIT').directive('acknowledgeService', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/acknowledge_service.html',
        controller: function($scope) {
            $scope.doAck = !1;
            $scope.ack = {
                comment: '',
                sticky: !1,
                error: !1
            };
            var objects = {};
            var author = '';
            var callbackName = !1;
            $scope.setServiceAckObjects = function(_objects) {
                objects = _objects
            };
            $scope.setServiceAckAuthor = function(_author) {
                author = _author
            };
            $scope.setServiceAckCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doAcknowledgeService = function() {
                $scope.ack.error = !1;
                if ($scope.ack.comment === '') {
                    $scope.ack.error = !0;
                    return !1
                }
                var sticky = 0;
                if ($scope.ack.sticky === !0) {
                    sticky = 2
                }
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.doAck = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitServicestateAck', [object.Host.uuid, object.Service.uuid, $scope.ack.comment, author, sticky]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.doAck = !1;
                    $scope.percentage = 0;
                    $('#angularacknowledgeServiceModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.acknowledgeService = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setServiceAckCallback(attr.callback)
                }
                $scope.setServiceAckObjects(objects);
                $scope.setServiceAckAuthor(attr.author);
                $('#angularacknowledgeServiceModal').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('createApikeyDirective', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/profile/create_apikey.html',
        controller: function($scope) {
            $scope.post = {
                Apikey: {
                    apikey: '',
                    description: ''
                }
            };
            $scope.saveApiKey = function() {
                $http.post("/profile/create_apikey.json?angular=true", $scope.post).then(function(result) {
                    $scope.post = {
                        Apikey: {
                            apikey: '',
                            description: ''
                        }
                    };
                    $scope.newApiKey = null;
                    $scope.load();
                    $('#angularCreateApiKeyModal').modal('hide')
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.getNewApiKey = function() {
                $http.get("/profile/create_apikey.json?angular=true").then(function(result) {
                    $scope.newApiKey = result.data.apikey;
                    $scope.post.Apikey.apikey = $scope.newApiKey
                })
            }
        },
        link: function($scope, element, attr) {
            $scope.createApiKey = function(apiKeyId) {
                $scope.getNewApiKey();
                $('#angularCreateApiKeyModal').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('iframeDirective', function($sce) {
    return {
        restrict: 'E',
        template: '<iframe src="{{trustedUrl}}" onload="this.height=(screen.height+15);" width="100%" frameborder="0"></iframe>',
        scope: {
            'url': '='
        },
        controller: function($scope) {},
        link: function($scope, element, attr) {
            $scope.$watch('url', function() {
                $scope.trustedUrl = $sce.trustAsResourceUrl($scope.url)
            })
        }
    }
});
angular.module('openITCOCKPIT').directive('enableNotifications', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/executing.html?id=angularEnableNotificationsModal',
        controller: function($scope) {
            var callbackName = !1;
            $scope.setEnableNotificationsCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doEnableNotifications = function(objects) {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('submitEnableServiceNotifications', [object.Host.uuid, object.Service.uuid]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.percentage = 0;
                    $('#angularEnableNotificationsModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.enableNotifications = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setEnableNotificationsCallback(attr.callback)
                }
                $('#angularEnableNotificationsModal').modal('show');
                $scope.doEnableNotifications(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('massdelete', function($http, $filter, $timeout) {
    return {
        restrict: 'E',
        replace: !0,
        templateUrl: '/angular/mass_delete.html',
        controller: function($scope) {
            $scope.objects = {};
            $scope.percentage = 0;
            $scope.isDeleting = !1;
            $scope.setObjectsForMassDelete = function(objects) {
                $scope.objects = objects
            };
            $scope.issueObjects = {};
            $scope.delete = function() {
                $scope.isDeleting = !0;
                var count = Object.keys($scope.objects).length;
                var i = 0;
                var issueCount = 0;
                for (var id in $scope.objects) {
                    $http.post($scope.deleteUrl + id + ".json").then(function(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        issueCount = Object.keys($scope.issueObjects).length;
                        if (i === count && issueCount === 0) {
                            $scope.isDeleting = !1;
                            $scope.percentage = 0;
                            $scope.load();
                            $('#angularMassDelete').modal('hide')
                        }
                    }, function errorCallback(result) {
                        i++;
                        $scope.percentage = Math.round(i / count * 100);
                        if (result.data.hasOwnProperty('success') && result.data.hasOwnProperty('usedBy')) {
                            var id = result.data.id;
                            $scope.issueObjects[id] = [];
                            for (var key in result.data.usedBy) {
                                $scope.issueObjects[id].push({
                                    message: result.data.usedBy[key].message,
                                    url: result.data.usedBy[key].baseUrl + id
                                })
                            }
                        }
                        issueCount = Object.keys($scope.issueObjects).length;
                        if (i === count && issueCount > 0) {
                            $scope.isDeleting = !1;
                            $scope.percentage = 0;
                            $scope.load()
                        }
                    })
                }
            }
        },
        link: function($scope, element, attr) {
            $scope.confirmDelete = function(objects) {
                $scope.setObjectsForMassDelete(objects);
                $('#angularMassDelete').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('sudoServerConnect', function($http, SudoService) {
    return {
        restrict: 'A',
        controller: function($scope) {
            $scope.connectToSudoServer = function() {
                $http.get("/angular/websocket_configuration.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.websocketConfig = result.data.websocket;
                    SudoService.setUrl($scope.websocketConfig['SUDO_SERVER.URL']);
                    SudoService.setApiKey($scope.websocketConfig['SUDO_SERVER.API_KEY']);
                    SudoService.onDispatch(function(event) {});
                    SudoService.connect()
                })
            };
            $scope.connectToSudoServer()
        },
        link: function(scope, element, attr) {
            jQuery(element).find("[rel=tooltip]").tooltip()
        }
    }
});
angular.module('openITCOCKPIT').directive('rescheduleHost', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/reschedule_host.html',
        controller: function($scope) {
            var objects = {};
            var callbackName = !1;
            $scope.isReschedulingHosts = !1;
            $scope.hostReschedulingType = 'hostAndServices';
            $scope.setHostRescheduleObjects = function(_objects) {
                objects = _objects
            };
            $scope.setHostRescheduleCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doHostReschedule = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isReschedulingHosts = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('rescheduleHost', [object.Host.uuid, $scope.hostReschedulingType, object.Host.satelliteId]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isReschedulingHosts = !1;
                    $scope.percentage = 0;
                    $('#angularRescheduleHostModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.rescheduleHost = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setHostRescheduleCallback(attr.callback)
                }
                $('#angularRescheduleHostModal').modal('show');
                $scope.setHostRescheduleObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('scroll', function($http, $filter, $rootScope) {
    return {
        restrict: 'E',
        templateUrl: '/angular/scroll.html',
        scope: {
            'scroll': '=',
            'clickAction': '=',
            'onlyButtons': '=?'
        },
        controller: function($scope) {
            var paginatorLimit = 5;
            var paginatorOffset = 2;
            var onlyButtons = !1;
            if (typeof $scope.onlyButtons !== 'undefined') {
                onlyButtons = !0
            }
            $scope.onlyButtons = onlyButtons;
            $scope.changePage = function(page) {
                $scope.clickAction(page)
            };
            $scope.prevPage = function() {
                var page = $scope.scroll.prevPage;
                if (page < 1) {
                    page = 1
                }
                $scope.clickAction(page)
            };
            $scope.nextPage = function() {
                if ($scope.scroll.hasNextPage) {
                    var page = $scope.scroll.nextPage;
                    $scope.clickAction(page)
                }
            }
        },
        link: function(scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('editApikeyDirective', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/profile/edit_apikey.html',
        controller: function($scope) {
            var editApiKeyId = null;
            $scope.setEditApiKeyId = function(apiKeyId) {
                editApiKeyId = apiKeyId
            };
            $scope.loadApiKeyToEdit = function() {
                $http.get("/profile/apikey.json", {
                    params: {
                        'angular': !0,
                        'id': editApiKeyId
                    }
                }).then(function(result) {
                    $scope.currentApiKey = result.data.apikey
                })
            };
            $scope.updateApiKey = function() {
                $http.post("/profile/apikey.json?angular=true", {
                    Apikey: {
                        id: $scope.currentApiKey.id,
                        description: $scope.currentApiKey.description
                    }
                }).then(function(result) {
                    editApiKeyId = null;
                    $scope.currentApiKey = {};
                    $scope.load();
                    $('#angularEditApiKeyModal').modal('hide')
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.deleteApiKey = function() {
                $http.post("/profile/delete_apikey/" + $scope.currentApiKey.id + "/.json?angular=true").then(function(result) {
                    editApiKeyId = null;
                    $scope.currentApiKey = {};
                    $scope.load();
                    $('#angularEditApiKeyModal').modal('hide')
                })
            }
        },
        link: function($scope, element, attr) {
            $scope.editApiKey = function(apiKeyId) {
                $scope.setEditApiKeyId(apiKeyId);
                $('#angularEditApiKeyModal').modal('show');
                $scope.loadApiKeyToEdit()
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('enableHostFlapDetection', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/enable_host_flap_detection.html',
        controller: function($scope) {
            var objects = {};
            var callbackName = !1;
            $scope.isEnableingHostFlapDetection = !1;
            $scope.setEnableHostFlapDetectionObjects = function(_objects) {
                objects = _objects
            };
            $scope.setEnableHostFlapDetectionCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doEnableHostFlapDetection = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isEnableingHostFlapDetection = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('enableOrDisableHostFlapdetection', [object.Host.uuid, 1]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isEnableingHostFlapDetection = !1;
                    $scope.percentage = 0;
                    $('#angularEnableHostFalpDetectionModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.enableHostFlapDetection = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setEnableHostFlapDetectionCallback(attr.callback)
                }
                $('#angularEnableHostFalpDetectionModal').modal('show');
                $scope.setEnableHostFlapDetectionObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('pushNotifications', function($http, PushNotificationsService) {
    return {
        restrict: 'E',
        controller: function($scope) {
            $scope.userId = null;
            $scope.Notification = null;
            $scope.hasPermission = !1;
            var checkBrowserSupport = function() {
                if (!("Notification" in window)) {
                    console.warn('Browser does not support Notifications');
                    return !1
                }
                return !0
            };
            var checkPermissions = function() {
                if (Notification.permission === "granted") {
                    $scope.hasPermission = !0;
                    return !0
                }
                if (Notification.permission !== 'denied') {
                    Notification.requestPermission(function(permission) {
                        if (permission === "granted") {
                            $scope.hasPermission = !0
                        }
                    })
                }
            };
            $scope.connectToNotificationPushServer = function() {
                $http.get("/angular/push_configuration.json", {
                    params: {
                        'angular': !0,
                        'includeUser': !0
                    }
                }).then(function(result) {
                    $scope.userId = result.data.user.id;
                    $scope.websocketConfig = result.data.websocket;
                    if (result.data.user.hasPushContact) {
                        PushNotificationsService.setUrl($scope.websocketConfig['PUSH_NOTIFICATIONS.URL']);
                        PushNotificationsService.setApiKey($scope.websocketConfig['SUDO_SERVER.API_KEY']);
                        PushNotificationsService.setUserId($scope.userId);
                        PushNotificationsService.onResponse($scope.gotMessage);
                        PushNotificationsService.connect()
                    }
                })
            };
            if (checkBrowserSupport()) {
                checkPermissions()
            }
            $scope.$watch('hasPermission', function() {
                if ($scope.hasPermission === !0) {
                    $scope.connectToNotificationPushServer()
                }
            });
            $scope.gotMessage = function(event) {
                if (typeof event.data !== "undefined") {
                    var data = JSON.parse(event.data);
                    var options = {
                        body: data.message
                    };
                    if (data.data.icon !== null) {
                        options.icon = data.data.icon
                    }
                    var notification = new Notification(data.data.title, options);
                    var url = '/hosts/browser/' + data.data.hostUuid;
                    if (data.data.type === 'service') {
                        url = '/services/browser/' + data.data.serviceUuid
                    }
                    notification.onclick = function(event) {
                        event.preventDefault();
                        window.open(url, '_blank')
                    }
                }
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('askAnonymousStatistics', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/statistics/ask_anonymous_statistics.html',
        scope: {},
        controller: function($scope) {
            $scope.showModal = function() {
                setTimeout(function() {
                    $('#angulWeAskForYourHelpModal').modal('show')
                }, 500)
            };
            $scope.save = function(value) {
                var post = {
                    statistics: {
                        decision: value,
                        cookie: !0
                    }
                };
                $http.post("/statistics/saveStatisticDecision.json", post).then(function(result) {
                    $('#angulWeAskForYourHelpModal').modal('hide');
                    if (parseInt(value, 10) === 1) {
                        $('#manyThanksForYourSupport').show();
                        $('#manyThanksForYourSupport').addClass('animated flipInY');
                        setTimeout(function() {
                            $('#manyThanksForYourSupport').addClass('animated flipOutY')
                        }, 2500)
                    }
                })
            };
            $scope.showModal()
        }
    }
});
angular.module('openITCOCKPIT').directive('serviceStatusDetails', function($http, $interval, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/services/details.html',
        controller: function($scope) {
            var graphStart = 0;
            var graphEnd = 0;
            $scope.showServiceDetailsFlashMsg = function() {
                $scope.showFlashSuccess = !0;
                $scope.autoRefreshCounter = 5;
                var interval = $interval(function() {
                    $scope.autoRefreshCounter--;
                    if ($scope.autoRefreshCounter === 0) {
                        $scope.loadServicestatusDetails($scope.currentServiceDetailsId);
                        $interval.cancel(interval);
                        $scope.showFlashSuccess = !1
                    }
                }, 1000)
            };
            $scope.loadServicestatusDetails = function(serviceId) {
                $scope.isLoading = !0;
                $scope.currentServiceDetailsId = serviceId;
                $http.get("/services/browser/" + serviceId + ".json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.mergedService = result.data.mergedService;
                    $scope.host = result.data.host;
                    $scope.tags = $scope.mergedService.Service.tags.split(',');
                    $scope.hoststatus = result.data.hoststatus;
                    $scope.servicestatus = result.data.servicestatus;
                    $scope.servicestatusForIcon = {
                        Servicestatus: $scope.servicestatus
                    };
                    $scope.acknowledgement = result.data.acknowledgement;
                    $scope.downtime = result.data.downtime;
                    $scope.hostAcknowledgement = result.data.hostAcknowledgement;
                    $scope.hostDowntime = result.data.hostDowntime;
                    $scope.canSubmitExternalCommands = result.data.canSubmitExternalCommands;
                    $scope.loadTimezone();
                    if ($scope.mergedService.Service.has_graph) {
                        loadGraph($scope.host.Host.uuid, $scope.mergedService.Service.uuid)
                    }
                    $timeout(function() {
                        $scope.isLoading = !1
                    }, 500)
                })
            };
            $scope.loadTimezone = function() {
                $http.get("/angular/user_timezone.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.timezone = result.data.timezone
                })
            };
            $scope.stateIsOk = function() {
                return parseInt($scope.servicestatus.currentState, 10) === 0
            };
            $scope.stateIsWarning = function() {
                return parseInt($scope.servicestatus.currentState, 10) === 1
            };
            $scope.stateIsCritical = function() {
                return parseInt($scope.servicestatus.currentState, 10) === 2
            };
            $scope.stateIsUnknown = function() {
                return parseInt($scope.servicestatus.currentState, 10) === 3
            };
            $scope.stateIsNotInMonitoring = function() {
                return !$scope.servicestatus.isInMonitoring
            };
            $scope.getObjectsForExternalCommand = function() {
                return [{
                    Service: {
                        id: $scope.mergedService.Service.id,
                        uuid: $scope.mergedService.Service.uuid,
                        name: $scope.mergedService.Service.name
                    },
                    Host: {
                        id: $scope.host.Host.id,
                        uuid: $scope.host.Host.uuid,
                        name: $scope.host.Host.name,
                        satelliteId: $scope.host.Host.satellite_id
                    }
                }]
            };
            $scope.getObjectForDowntimeDelete = function() {
                var object = {};
                object[$scope.downtime.internalDowntimeId] = $scope.host.Host.name + ' / ' + $scope.mergedService.Service.name;
                return object
            };
            var loadGraph = function(hostUuid, serviceUuid) {
                var serverTime = new Date($scope.timezone.server_time);
                graphEnd = Math.floor(serverTime.getTime() / 1000);
                graphStart = graphEnd - (3600 * 4);
                $http.get('/Graphgenerators/getPerfdataByUuid.json', {
                    params: {
                        angular: !0,
                        host_uuid: hostUuid,
                        service_uuid: serviceUuid,
                        start: graphStart,
                        end: graphEnd,
                        jsTimestamp: 1
                    }
                }).then(function(result) {
                    $scope.isLoadingGraph = !1;
                    renderGraph(result.data.performance_data)
                })
            };
            var initTooltip = function() {
                var previousPoint = null;
                var $graph_data_tooltip = $('#graph_data_tooltip');
                $graph_data_tooltip.css({
                    position: 'absolute',
                    display: 'none',
                    'border-top-left-radius': '5px',
                    'border-top-right-radius': '0',
                    'border-bottom-left-radius': '0',
                    'border-bottom-right-radius': '5px',
                    padding: '2px 4px',
                    'background-color': '#f2f2f2',
                    'border-radius': '5px',
                    opacity: 0.9,
                    'box-shadow': '2px 2px 3px #888',
                    transition: 'all 1s',
                    'z-index': 5040
                });
                $('#graphCanvas').bind('plothover', function(event, pos, item) {
                    $('#x').text(pos.pageX.toFixed(2));
                    $('#y').text(pos.pageY.toFixed(2));
                    if (item) {
                        if (previousPoint != item.dataIndex) {
                            previousPoint = item.dataIndex;
                            $('#graph_data_tooltip').hide();
                            var value = item.datapoint[1];
                            if (!isNaN(value) && isFinite(value)) {
                                value = value.toFixed(4)
                            }
                            var tooltip_text = value;
                            if (item.series.unit) {
                                tooltip_text += ' ' + item.series.unit
                            }
                            showTooltip(item.pageX, item.pageY, tooltip_text, item.datapoint[0])
                        }
                    } else {
                        $("#graph_data_tooltip").hide();
                        previousPoint = null
                    }
                })
            };
            var showTooltip = function(x, y, contents, timestamp) {
                var self = this;
                var $graph_data_tooltip = $('#graph_data_tooltip');
                var fooJS = new Date(timestamp);
                var fixTime = function(value) {
                    if (value < 10) {
                        return '0' + value
                    }
                    return value
                };
                var humanTime = fixTime(fooJS.getDate()) + '.' + fixTime(fooJS.getMonth() + 1) + '.' + fooJS.getFullYear() + ' ' + fixTime(fooJS.getHours()) + ':' + fixTime(fooJS.getMinutes());
                $graph_data_tooltip.html('<i class="fa fa-clock-o"></i> ' + humanTime + '<br /><strong>' + contents + '</strong>').css({
                    top: y,
                    left: x + 10
                }).appendTo('body').fadeIn(200)
            };
            var renderGraph = function(performance_data) {
                initTooltip();
                var graph_data = [];
                for (var dsCount in performance_data) {
                    var gaugeData = [];
                    for (var timestamp in performance_data[dsCount].data) {
                        var frontEndTimestamp = (parseInt(timestamp, 10) + ($scope.timezone.user_time_to_server_offset * 1000));
                        gaugeData.push([frontEndTimestamp, performance_data[dsCount].data[timestamp]])
                    }
                    graph_data.push({
                        label: performance_data[dsCount].datasource.label,
                        data: gaugeData,
                        unit: performance_data[dsCount].datasource.unit
                    })
                }
                var GraphDefaultsObj = new GraphDefaults();
                var color_amount = performance_data.length < 3 ? 3 : performance_data.length;
                var colors = GraphDefaultsObj.getColors(color_amount);
                var options = GraphDefaultsObj.getDefaultOptions();
                options.colors = colors.border;
                options.xaxis.tickFormatter = function(val, axis) {
                    var fooJS = new Date(val);
                    var fixTime = function(value) {
                        if (value < 10) {
                            return '0' + value
                        }
                        return value
                    };
                    return fixTime(fooJS.getDate()) + '.' + fixTime(fooJS.getMonth() + 1) + '.' + fooJS.getFullYear() + ' ' + fixTime(fooJS.getHours()) + ':' + fixTime(fooJS.getMinutes())
                };
                options.legend = {
                    show: !0,
                    noColumns: 3,
                    container: $('#graph_legend')
                };
                options.tooltip = !0;
                options.tooltipOpts = {
                    defaultTheme: !1
                };
                options.points = {
                    show: !1,
                    radius: 1
                };
                options.xaxis.min = (graphStart + $scope.timezone.user_time_to_server_offset) * 1000;
                options.xaxis.max = (graphEnd + $scope.timezone.user_time_to_server_offset) * 1000;
                self.plot = $.plot('#graphCanvas', graph_data, options)
            }
        },
        link: function($scope, element, attr) {
            $scope.showServiceStatusDetails = function(serviceId) {
                $scope.loadServicestatusDetails(serviceId);
                $('#angularServiceStatusDetailsModal').modal('show')
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('disableHostFlapDetection', function($http, SudoService, $timeout) {
    return {
        restrict: 'E',
        templateUrl: '/angular/disable_host_flap_detection.html',
        controller: function($scope) {
            var objects = {};
            var callbackName = !1;
            $scope.isDisableingHostFlapDetection = !1;
            $scope.setDisableHostFlapDetectionObjects = function(_objects) {
                objects = _objects
            };
            $scope.setDisableHostFlapDetectionCallback = function(_callback) {
                callbackName = _callback
            };
            $scope.doDisableHostFlapDetection = function() {
                var count = Object.keys(objects).length;
                var i = 0;
                $scope.percentage = 0;
                $scope.isDisableingHostFlapDetection = !0;
                $scope.percentage = Math.round(i / count * 100);
                for (var id in objects) {
                    var object = objects[id];
                    i++;
                    $scope.percentage = Math.round(i / count * 100);
                    SudoService.send(SudoService.toJson('enableOrDisableHostFlapdetection', [object.Host.uuid, 0]))
                }
                if (callbackName) {
                    $scope[callbackName]()
                }
                $timeout(function() {
                    $scope.isDisableingHostFlapDetection = !1;
                    $scope.percentage = 0;
                    $('#angularDisableHostFalpDetectionModal').modal('hide')
                }, 500)
            }
        },
        link: function($scope, element, attr) {
            $scope.disableHostFlapDetection = function(objects) {
                if (Object.keys(objects).length === 0) {
                    return
                }
                if (attr.hasOwnProperty('callback')) {
                    $scope.setDisableHostFlapDetectionCallback(attr.callback)
                }
                $('#angularDisableHostFalpDetectionModal').modal('show');
                $scope.setDisableHostFlapDetectionObjects(objects)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('trafficlightWidget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/trafficLightWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.init = !0;
            $scope.trafficlightTimeout = null;
            $scope.trafficlight = {
                service_id: null,
                show_label: !1
            };
            var $widget = $('#widget-' + $scope.widget.id);
            var $widgetContent = $('#widget-content-' + $scope.widget.id);
            var timer = {
                red: null,
                yellow: null,
                green: null
            };
            var offset = 50;
            $scope.height = $widgetContent.height() - offset;
            $scope.width = $scope.height / 2.5;
            $scope.load = function() {
                $http.get("/dashboards/trafficLightWidget.json", {
                    params: {
                        'angular': !0,
                        'widgetId': $scope.widget.id
                    }
                }).then(function(result) {
                    if (Object.keys(result.data.service.Service).length > 0) {
                        $scope.Service = result.data.service.Service;
                        $scope.Host = result.data.service.Host;
                        $scope.ACL = result.data.ACL;
                        $scope.trafficlight.show_label = result.data.config.show_label;
                        $scope.trafficlight.service_id = result.data.service.Service.id;
                        $scope.current_state = result.data.service.Servicestatus.currentState;
                        $scope.is_flapping = result.data.service.Servicestatus.isFlapping;
                        $scope.showGreen = !1;
                        $scope.showYellow = !1;
                        $scope.showRed = !1;
                        $scope.showBlue = !1;
                        $scope.blink = !1;
                        stopBlinking();
                        switch ($scope.current_state) {
                            case 0:
                                $scope.showGreen = !0;
                                break;
                            case 1:
                                $scope.showYellow = !0;
                                break;
                            case 2:
                                $scope.showRed = !0;
                                break;
                            case 3:
                                $scope.showGreen = !0;
                                $scope.showYellow = !0;
                                $scope.showRed = !0;
                                break;
                            default:
                                $scope.showBlue = !0;
                                break
                        }
                        if ($scope.is_flapping) {
                            $scope.blink = !0
                        }
                        $scope.trafficlightHref = getHref();
                        renderTrafficlight()
                    } else {
                        $scope.Service = {
                            hostname: 'Unknown host',
                            servicename: 'Unknown service'
                        }
                    }
                    setTimeout(function() {
                        $scope.init = !1
                    }, 250)
                })
            };
            $scope.loadServices = function(searchString) {
                $http.get("/services/loadServicesByString.json", {
                    params: {
                        'angular': !0,
                        'filter[Host.name]': searchString,
                        'filter[Service.servicename]': searchString,
                        'selected[]': $scope.trafficlight.service_id
                    }
                }).then(function(result) {
                    $scope.services = result.data.services
                })
            };
            $scope.hideConfig = function() {
                $scope.$broadcast('FLIP_EVENT_IN');
                renderTrafficlight()
            };
            $scope.showConfig = function() {
                $scope.$broadcast('FLIP_EVENT_OUT');
                $scope.loadServices('')
            };
            $scope.saveTrafficlight = function() {
                $http.post("/dashboards/trafficLightWidget.json?angular=true", {
                    Widget: {
                        id: $scope.widget.id,
                        service_id: $scope.trafficlight.service_id
                    },
                    show_label: $scope.trafficlight.show_label
                }).then(function(result) {
                    $scope.load();
                    $scope.hideConfig()
                })
            };
            var getHref = function() {
                var url = 'javascript:void(0);';
                if ($scope.Service.isEVCService) {
                    if ($scope.ACL.evc.view) {
                        return '/eventcorrelation_module/eventcorrelations/view/' + $scope.Host.id
                    }
                    if ($scope.ACL.services.index) {
                        return '/services/browser/' + $scope.Service.id
                    }
                } else {
                    if ($scope.ACL.services.index) {
                        return '/services/browser/' + $scope.Service.id
                    }
                }
                return url
            };
            var stopBlinking = function() {
                for (var i in timer) {
                    if (timer[i] !== null) {
                        clearInterval(timer[i]);
                        timer[i] = null
                    }
                }
            };
            var renderTrafficlight = function() {
                var $trafficlight = $('#trafficlight-' + $scope.widget.id);
                $trafficlight.svg('destroy');
                $trafficlight.svg({
                    settings: {
                        width: $scope.width,
                        height: $scope.height
                    }
                });
                var svg = $trafficlight.svg('get');
                var lightRadius = parseInt(($scope.width * (17 / 60)));
                var lightDiameter = (lightRadius * 2) + 2;
                var lightPadding = Math.ceil(($scope.height - lightDiameter * 3) / 4);
                var x = parseInt(($scope.width / 2), 10);
                var trafficLight = svg.group('trafficLight_' + $scope.widget.id);
                var tLBackground = svg.group(trafficLight, 'trafficLightBackground');
                var defs = svg.defs();
                svg.linearGradient(defs, 'tlBg', [
                    [0.02, '#323232'],
                    [0.02, '#323232'],
                    [0.03, '#333'],
                    [0.3, '#323232']
                ], 0, 0, 0, 1);
                svg.linearGradient(defs, 'protectorGradient', [
                    [0, '#555'],
                    [0.03, '#444'],
                    [0.07, '#333'],
                    [0.12, '#222']
                ], 0, 0, 0, 1);
                svg.radialGradient(defs, 'redLight', [
                    ['0%', 'brown'],
                    ['25%', 'transparent']
                ], 1, 1, 4, 0, 0, {
                    gradientUnits: 'userSpaceOnUse'
                });
                svg.radialGradient(defs, 'yellowLight', [
                    ['0%', 'orange'],
                    ['25%', 'transparent']
                ], 1, 1, 4, 0, 0, {
                    gradientUnits: 'userSpaceOnUse'
                });
                svg.radialGradient(defs, 'greenLight', [
                    ['0%', 'lime'],
                    ['25%', 'transparent']
                ], 1, 1, 4, 0, 0, {
                    gradientUnits: 'userSpaceOnUse'
                });
                svg.rect(tLBackground, 0, 0, $scope.width, $scope.height, 10, 10, {
                    fill: 'url(#tlBg)',
                    stroke: '#444',
                    strokeWidth: 2
                });
                if ($scope.trafficlight.show_label) {
                    var rotateX = parseInt(($scope.height - 10 - ($scope.width / 8)), 10);
                    svg.text(tLBackground, 0, $scope.height - 10, ($scope.Service.hostname + '/' + $scope.Service.servicename), {
                        fontSize: ($scope.width / 8),
                        fontFamily: 'Verdana',
                        fill: '#FFF',
                        transform: 'rotate(-90, 0, ' + rotateX + ')'
                    })
                }
                var redPattern;
                redPattern = svg.pattern(defs, 'redLightPattern', 0, 0, 3, 3, {
                    patternUnits: 'userSpaceOnUse'
                });
                svg.circle(redPattern, 1, 1, 3, {
                    fill: 'url(#redLight)'
                });
                redPattern = svg.pattern(defs, 'yellowLightPattern', 0, 0, 3, 3, {
                    patternUnits: 'userSpaceOnUse'
                });
                svg.circle(redPattern, 1, 1, 3, {
                    fill: 'url(#yellowLight)'
                });
                redPattern = svg.pattern(defs, 'greenLightPattern', 0, 0, 3, 3, {
                    patternUnits: 'userSpaceOnUse'
                });
                svg.circle(redPattern, 1, 1, 3, {
                    fill: 'url(#greenLight)'
                });
                var lights = svg.group(trafficLight, 'lights');
                var redLightGroup = svg.group(lights, 'redLightGroup');
                if ($scope.showRed) {
                    var redLight = svg.circle(redLightGroup, x, lightPadding + lightRadius, lightRadius, {
                        fill: '#f00'
                    });
                    if ($scope.blink) {
                        blinking(redLight, 'red')
                    }
                }
                svg.circle(redLightGroup, x, lightPadding + lightRadius, lightRadius, {
                    fill: 'url(#redLightPattern)',
                    stroke: '#444',
                    strokeWidth: 2
                });
                var yellowLightGroup = svg.group(lights, 'yellowLightGroup');
                if ($scope.showYellow) {
                    var yellowLight = svg.circle(yellowLightGroup, x, lightDiameter + lightPadding * 2 + lightRadius, lightRadius, {
                        fill: '#FFFF00'
                    });
                    if ($scope.blink) {
                        blinking(yellowLight, 'yellow')
                    }
                }
                svg.circle(yellowLightGroup, x, lightDiameter + lightPadding * 2 + lightRadius, lightRadius, {
                    fill: 'url(#yellowLightPattern)',
                    stroke: '#444',
                    strokeWidth: 2
                });
                var blueLightGroup = svg.group(lights, 'blueLightGroup');
                if ($scope.showBlue) {
                    var blueLight = svg.circle(blueLightGroup, x, lightDiameter + lightPadding * 2 + lightRadius, lightRadius, {
                        fill: '#6e99ff'
                    })
                }
                var greenLightGroup = svg.group(lights, 'greenLightGroup');
                if ($scope.showGreen) {
                    var greenLight = svg.circle(greenLightGroup, x, lightDiameter * 2 + lightPadding * 3 + lightRadius, lightRadius, {
                        fill: '#0F0'
                    });
                    if ($scope.blink) {
                        blinking(greenLight, 'green')
                    }
                }
                svg.circle(greenLightGroup, x, lightDiameter * 2 + lightPadding * 3 + lightRadius, lightRadius, {
                    fill: 'url(#greenLightPattern)',
                    stroke: '#444',
                    strokeWidth: 2
                })
            };
            var hasResize = function() {
                if ($scope.init) {
                    return
                }
                if ($scope.trafficlightTimeout) {
                    clearTimeout($scope.trafficlightTimeout)
                }
                $scope.trafficlightTimeout = setTimeout(function() {
                    $scope.trafficlightTimeout = null
                }, 500);
                $scope.height = $widgetContent.height() - offset;
                $scope.width = $scope.height / 2.5;
                renderTrafficlight()
            };
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('hostsPiechart180Widget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/hostsPiechart180Widget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.load = function() {
                $http.get("/angular/statuscount.json", {
                    params: {
                        'angular': !0,
                        'recursive': !0
                    }
                }).then(function(result) {
                    $scope.hoststatusCount = result.data.hoststatusCount;
                    $scope.hoststatusCountPercentage = result.data.hoststatusCountPercentage;
                    $scope.init = !1
                })
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('hostsPiechartWidget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/hostsPiechartWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.load = function() {
                $http.get("/angular/statuscount.json", {
                    params: {
                        'angular': !0,
                        'recursive': !0
                    }
                }).then(function(result) {
                    $scope.hoststatusCount = result.data.hoststatusCount;
                    $scope.hoststatusCountPercentage = result.data.hoststatusCountPercentage;
                    $scope.init = !1
                })
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('hostsStatusWidget', function($http, $rootScope, $interval) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/hostsStatusListWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.interval = null;
            $scope.init = !0;
            $scope.useScroll = !0;
            $scope.scroll_interval = 30000;
            var $widget = $('#widget-' + $scope.widget.id);
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.hostListTimeout = null;
            $scope.sort = 'Hoststatus.current_state';
            $scope.direction = 'desc';
            $scope.currentPage = 1;
            $scope.filter = {
                Hoststatus: {
                    current_state: {
                        up: !1,
                        down: !1,
                        unreachable: !1
                    },
                    acknowledged: !1,
                    not_acknowledged: !1,
                    in_downtime: !1,
                    not_in_downtime: !1,
                    output: ''
                },
                Host: {
                    name: ''
                }
            };
            var loadWidgetConfig = function() {
                $http.get("/dashboards/hostsStatusListWidget.json?angular=true&widgetId=" + $scope.widget.id, $scope.filter).then(function(result) {
                    $scope.filter.Host = result.data.config.Host;
                    $scope.filter.Hoststatus = result.data.config.Hoststatus;
                    $scope.direction = result.data.config.direction;
                    $scope.sort = result.data.config.sort;
                    $scope.useScroll = result.data.config.useScroll;
                    var scrollInterval = parseInt(result.data.config.scroll_interval);
                    if (scrollInterval < 5000) {
                        scrollInterval = 5000
                    }
                    $scope.scroll_interval = scrollInterval;
                    if ($scope.useScroll) {
                        $scope.startScroll()
                    }
                    $scope.load()
                })
            };
            $scope.$on('$destroy', function() {
                $scope.pauseScroll()
            });
            $scope.load = function(options) {
                options = options || {};
                options.save = options.save || !1;
                var hasBeenAcknowledged = '';
                var inDowntime = '';
                if ($scope.filter.Hoststatus.acknowledged ^ $scope.filter.Hoststatus.not_acknowledged) {
                    hasBeenAcknowledged = $scope.filter.Hoststatus.acknowledged === !0
                }
                if ($scope.filter.Hoststatus.in_downtime ^ $scope.filter.Hoststatus.not_in_downtime) {
                    inDowntime = $scope.filter.Hoststatus.in_downtime === !0
                }
                var params = {
                    'angular': !0,
                    'scroll': !0,
                    'sort': $scope.sort,
                    'page': $scope.currentPage,
                    'direction': $scope.direction,
                    'filter[Host.name]': $scope.filter.Host.name,
                    'filter[Hoststatus.output]': $scope.filter.Hoststatus.output,
                    'filter[Hoststatus.current_state][]': $rootScope.currentStateForApi($scope.filter.Hoststatus.current_state),
                    'filter[Hoststatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
                    'filter[Hoststatus.scheduled_downtime_depth]': inDowntime,
                    'limit': $scope.limit
                };
                $http.get("/hosts/index.json", {
                    params: params
                }).then(function(result) {
                    $scope.hosts = result.data.all_hosts;
                    $scope.scroll = result.data.scroll;
                    if (options.save === !0) {
                        saveSettings(params)
                    }
                    $scope.init = !1
                })
            };
            $scope.getSortClass = function(field) {
                if (field === $scope.sort) {
                    if ($scope.direction === 'asc') {
                        return 'fa-sort-asc'
                    }
                    return 'fa-sort-desc'
                }
                return 'fa-sort'
            };
            $scope.orderBy = function(field) {
                if (field !== $scope.sort) {
                    $scope.direction = 'asc';
                    $scope.sort = field;
                    $scope.load();
                    return
                }
                if ($scope.direction === 'asc') {
                    $scope.direction = 'desc'
                } else {
                    $scope.direction = 'asc'
                }
                $scope.load()
            };
            var hasResize = function() {
                if ($scope.hostListTimeout) {
                    clearTimeout($scope.hostListTimeout)
                }
                $scope.hostListTimeout = setTimeout(function() {
                    $scope.hostListTimeout = null;
                    $scope.limit = getLimit($widget.height());
                    if ($scope.limit <= 0) {
                        $scope.limit = 1
                    }
                    $scope.load()
                }, 500)
            };
            $scope.startScroll = function() {
                $scope.pauseScroll();
                $scope.useScroll = !0;
                $scope.interval = $interval(function() {
                    var page = $scope.currentPage;
                    if ($scope.scroll.hasNextPage) {
                        page++
                    } else {
                        page = 1
                    }
                    $scope.changepage(page)
                }, $scope.scroll_interval)
            };
            $scope.pauseScroll = function() {
                if ($scope.interval !== null) {
                    $interval.cancel($scope.interval);
                    $scope.interval = null
                }
                $scope.useScroll = !1
            };
            var getLimit = function(height) {
                height = height - 34 - 128 - 61 - 10 - 37;
                var limit = Math.floor(height / 36);
                if (limit <= 0) {
                    limit = 1
                }
                return limit
            };
            var saveSettings = function() {
                var settings = $scope.filter;
                settings.scroll_interval = $scope.scroll_interval;
                settings.useScroll = $scope.useScroll;
                $http.post("/dashboards/hostsStatusListWidget.json?angular=true&widgetId=" + $scope.widget.id, settings).then(function(result) {
                    return !0
                })
            };
            var getTimeString = function() {
                return (new Date($scope.scroll_interval * 60)).toUTCString().match(/(\d\d:\d\d)/)[0] + " minutes"
            };
            $scope.changepage = function(page) {
                if (page !== $scope.currentPage) {
                    $scope.currentPage = page;
                    $scope.load()
                }
            };
            $scope.limit = getLimit($widget.height());
            loadWidgetConfig();
            $scope.$watch('filter', function() {
                $scope.currentPage = 1;
                if ($scope.init === !0) {
                    return !0
                }
                $scope.load({
                    save: !0
                })
            }, !0);
            $scope.$watch('scroll_interval', function() {
                $scope.pagingTimeString = getTimeString();
                if ($scope.init === !0) {
                    return !0
                }
                $scope.pauseScroll();
                $scope.startScroll();
                $scope.load({
                    save: !0
                })
            })
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('noticeWidget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/noticeWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            var $widget = $('#widget-' + $scope.widget.id);
            $scope.ready = !1;
            $scope.noticeTimeout = null;
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.load = function(options) {
                options = options || {};
                options.save = options.save || !1;
                $http.get("/dashboards/noticeWidget.json", {
                    params: {
                        'angular': !0,
                        'recursive': !0,
                        'widgetId': $scope.widget.id
                    }
                }).then(function(result) {
                    resizeTextarea();
                    $scope.widget.WidgetNotice = {
                        note: result.data.config.note,
                        htmlContent: result.data.htmlContent
                    };
                    $scope.init = !1;
                    setTimeout(function() {
                        $scope.ready = !0
                    }, 500)
                })
            };
            $scope.load();
            $scope.showConfig = function() {
                $scope.$broadcast('FLIP_EVENT_IN')
            };
            $scope.hideConfig = function() {
                $scope.$broadcast('FLIP_EVENT_OUT')
            };
            $scope.saveSettings = function() {
                var settings = {
                    'note': $scope.widget.WidgetNotice.note
                };
                $http.post("/dashboards/noticeWidget.json?angular=true&widgetId=" + $scope.widget.id, settings).then(function(result) {
                    $scope.load();
                    return !0
                })
            };
            $scope.$watch('widget.WidgetNotice.note', function() {
                if ($scope.ready === !0) {
                    $scope.saveSettings()
                }
            });
            var hasResize = function() {
                if ($scope.noticeTimeout) {
                    clearTimeout($scope.noticeTimeout)
                }
                $scope.noticeTimeout = setTimeout(function() {
                    $scope.noticeTimeout = null;
                    resizeTextarea()
                }, 500)
            };
            var resizeTextarea = function() {
                var height = $widget.height() - 34 - 13 - 26 - 13 - 10;
                $widget.find('textarea').css({
                    height: height + 'px'
                })
            }
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('servicesPiechart180Widget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/servicesPiechart180Widget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.load = function() {
                $http.get("/angular/statuscount.json", {
                    params: {
                        'angular': !0,
                        'recursive': !0
                    }
                }).then(function(result) {
                    $scope.servicestatusCount = result.data.servicestatusCount;
                    $scope.servicestatusCountPercentage = result.data.servicestatusCountPercentage;
                    $scope.init = !1
                })
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('servicesPiechartWidget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/servicesPiechartWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.load = function() {
                $http.get("/angular/statuscount.json", {
                    params: {
                        'angular': !0,
                        'recursive': !0
                    }
                }).then(function(result) {
                    $scope.servicestatusCount = result.data.servicestatusCount;
                    $scope.servicestatusCountPercentage = result.data.servicestatusCountPercentage;
                    $scope.init = !1
                })
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('serviceStatusOverviewWidget', function($http, $rootScope, $interval, $httpParamSerializer) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/serviceStatusOverviewWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.init = !0;
            var $widget = $('#widget-' + $scope.widget.id);
            $scope.frontWidgetHeight = parseInt(($widget.height() - 30), 10);
            $scope.fontSize = $scope.frontWidgetHeight / 2;
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.serviceStatusOverviewTimeout = null;
            $scope.filter = {
                Servicestatus: {
                    current_state: null,
                    not_acknowledged: !0,
                    not_in_downtime: !0
                },
                Host: {
                    name: ''
                },
                Service: {
                    name: ''
                }
            };
            $scope.statusCount = null;
            $scope.load = function() {
                $http.get("/dashboards/serviceStatusOverviewWidget.json?angular=true&widgetId=" + $scope.widget.id, $scope.filter).then(function(result) {
                    $scope.filter.Host = result.data.config.Host;
                    $scope.filter.Service = result.data.config.Service;
                    $scope.filter.Servicestatus.current_state = result.data.config.Servicestatus.current_state;
                    $scope.filter.Servicestatus.not_acknowledged = !result.data.config.Servicestatus.problem_has_been_acknowledged;
                    $scope.filter.Servicestatus.not_in_downtime = !result.data.config.Servicestatus.scheduled_downtime_depth;
                    $scope.statusCount = result.data.statusCount;
                    $scope.init = !1;
                    $scope.widgetHref = $scope.linkForServiceList()
                })
            };
            $scope.hideConfig = function() {
                $scope.$broadcast('FLIP_EVENT_IN')
            };
            $scope.showConfig = function() {
                $scope.$broadcast('FLIP_EVENT_OUT')
            };
            var hasResize = function() {
                if ($scope.init) {
                    return
                }
                $scope.frontWidgetHeight = parseInt(($widget.height() - 30), 10);
                $scope.fontSize = $scope.frontWidgetHeight / 2;
                if ($scope.serviceStatusOverviewTimeout) {
                    clearTimeout($scope.serviceStatusOverviewTimeout)
                }
                $scope.serviceStatusOverviewTimeout = setTimeout(function() {
                    $scope.load()
                }, 500)
            };
            $scope.load();
            $scope.saveServicestatusOverview = function() {
                if ($scope.init) {
                    return
                }
                $http.post("/dashboards/serviceStatusOverviewWidget.json?angular=true", {
                    Widget: {
                        id: $scope.widget.id
                    },
                    Servicestatus: {
                        current_state: $scope.filter.Servicestatus.current_state,
                        problem_has_been_acknowledged: !$scope.filter.Servicestatus.not_acknowledged,
                        scheduled_downtime_depth: !$scope.filter.Servicestatus.not_in_downtime
                    },
                    Host: {
                        name: $scope.filter.Host.name
                    },
                    Service: {
                        name: $scope.filter.Service.name
                    }
                }).then(function(result) {
                    $scope.load();
                    $scope.hideConfig()
                })
            };
            $scope.linkForServiceList = function() {
                if ($scope.init) {
                    return
                }
                var options = {
                    'angular': !0,
                    'filter[Host.name]': $scope.filter.Host.name,
                    'filter[Service.servicename]': $scope.filter.Service.name,
                    'has_not_been_acknowledged': ($scope.filter.Servicestatus.not_acknowledged) ? '1' : '0',
                    'not_in_downtime': ($scope.filter.Servicestatus.not_in_downtime) ? '1' : '0'
                };
                var currentState = 'filter[Servicestatus.current_state][' + $scope.filter.Servicestatus.current_state + ']';
                options[currentState] = 1;
                return '/services/index/?' + $httpParamSerializer(options)
            }
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('tachometerWidget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/tachoWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.init = !0;
            $scope.tacho = {
                service_id: null,
                show_label: !1
            };
            var $widget = $('#widget-' + $scope.widget.id);
            var $widgetContent = $('#widget-content-' + $scope.widget.id);
            var offset = 50;
            $scope.height = $widgetContent.height() - offset;
            $scope.width = $scope.height;
            $scope.load = function() {
                $http.get("/dashboards/tachoWidget.json", {
                    params: {
                        'angular': !0,
                        'widgetId': $scope.widget.id
                    }
                }).then(function(result) {
                    if (Object.keys(result.data.service.Service).length > 0) {
                        $scope.Service = result.data.service.Service;
                        $scope.Host = result.data.service.Host;
                        $scope.ACL = result.data.ACL;
                        $scope.responsePerfdata = result.data.service.Perfdata;
                        $scope.tacho.show_label = result.data.config.show_label;
                        $scope.tacho.service_id = result.data.service.Service.id;
                        $scope.tacho.metric = result.data.config.metric;
                        $scope.tachoHref = getHref();
                        processPerfdata();
                        renderGauge($scope.perfdataName, $scope.perfdata)
                    } else {
                        $scope.Service = {
                            hostname: 'Unknown host',
                            servicename: 'Unknown service'
                        }
                    }
                    setTimeout(function() {
                        $scope.init = !1
                    }, 250)
                })
            };
            $scope.loadServices = function(searchString) {
                $http.get("/services/loadServicesByString.json", {
                    params: {
                        'angular': !0,
                        'filter[Host.name]': searchString,
                        'filter[Service.servicename]': searchString,
                        'selected[]': $scope.tacho.service_id
                    }
                }).then(function(result) {
                    $scope.services = result.data.services;
                    if ($scope.tacho.service_id) {
                        loadMetrics()
                    }
                })
            };
            $scope.hideConfig = function() {
                $scope.$broadcast('FLIP_EVENT_IN');
                renderGauge($scope.perfdataName, $scope.perfdata)
            };
            $scope.showConfig = function() {
                $scope.$broadcast('FLIP_EVENT_OUT');
                $scope.loadServices('')
            };
            $scope.saveTacho = function() {
                $http.post("/dashboards/tachoWidget.json?angular=true", {
                    Widget: {
                        id: $scope.widget.id,
                        service_id: $scope.tacho.service_id
                    },
                    show_label: $scope.tacho.show_label,
                    metric: $scope.tacho.metric
                }).then(function(result) {
                    $scope.load();
                    $scope.hideConfig()
                })
            };
            var getHref = function() {
                var url = 'javascript:void(0);';
                if ($scope.Service.isEVCService) {
                    if ($scope.ACL.evc.view) {
                        return '/eventcorrelation_module/eventcorrelations/view/' + $scope.Host.id
                    }
                    if ($scope.ACL.services.index) {
                        return '/services/browser/' + $scope.Service.id
                    }
                } else {
                    if ($scope.ACL.services.index) {
                        return '/services/browser/' + $scope.Service.id
                    }
                }
                return url
            };
            var renderGauge = function(perfdataName, perfdata) {
                if (typeof perfdata === 'undefined') {
                    return
                }
                var units = perfdata.unit;
                var label = perfdataName;
                if (label.length > 20) {
                    label = label.substr(0, 20);
                    label += '...'
                }
                if ($scope.tacho.show_label === !0) {
                    if (units === null) {
                        units = label
                    } else {
                        units = label + ' in ' + units
                    }
                    label = $scope.Service.hostname + '/' + $scope.Service.servicename;
                    if (label.length > 20) {
                        label = label.substr(0, 20);
                        label += '...'
                    }
                }
                if (isNaN(perfdata.warning) || isNaN(perfdata.critical)) {
                    perfdata.warning = null;
                    perfdata.critical = null
                }
                if (isNaN(perfdata.max) && isNaN(perfdata.critical) === !1) {
                    perfdata.max = perfdata.critical
                }
                if (isNaN(perfdata.min) || isNaN(perfdata.max) || perfdata.min === null || perfdata.max === null) {
                    perfdata.min = 0;
                    perfdata.max = 100
                }
                var thresholds = [];
                if (perfdata.warning !== null && perfdata.critical !== null) {
                    thresholds = [{
                        from: perfdata.min,
                        to: perfdata.warning,
                        color: '#449D44'
                    }, {
                        from: perfdata.warning,
                        to: perfdata.critical,
                        color: '#DF8F1D'
                    }, {
                        from: perfdata.critical,
                        to: perfdata.max,
                        color: '#C9302C'
                    }];
                    if (perfdata.warning > perfdata.critical) {
                        thresholds = [{
                            from: perfdata.min,
                            to: perfdata.critical,
                            color: '#C9302C'
                        }, {
                            from: perfdata.critical,
                            to: perfdata.warning,
                            color: '#DF8F1D'
                        }, {
                            from: perfdata.warning,
                            to: perfdata.max,
                            color: '#449D44'
                        }]
                    }
                }
                var maxDecimalDigits = 3;
                var currentValueAsString = perfdata.current.toString();
                var intergetDigits = currentValueAsString.length;
                var decimalDigits = 0;
                if (currentValueAsString.indexOf('.') > 0) {
                    var splited = currentValueAsString.split('.');
                    intergetDigits = splited[0].length;
                    decimalDigits = splited[1].length;
                    if (decimalDigits > maxDecimalDigits) {
                        decimalDigits = maxDecimalDigits
                    }
                }
                var showDecimalDigitsGauge = 0;
                if (decimalDigits > 0 || (perfdata.max - perfdata.min < 10)) {
                    showDecimalDigitsGauge = 1
                }
                var gauge = new RadialGauge({
                    renderTo: 'tacho-' + $scope.widget.id,
                    height: $scope.height,
                    width: $scope.width,
                    value: perfdata.current,
                    minValue: perfdata.min,
                    maxValue: perfdata.max,
                    units: units,
                    strokeTicks: !0,
                    title: label,
                    valueInt: intergetDigits,
                    valueDec: decimalDigits,
                    majorTicksDec: showDecimalDigitsGauge,
                    highlights: thresholds,
                    animationDuration: 700,
                    animationRule: 'elastic',
                    majorTicks: getMajorTicks(perfdata.max, 5)
                });
                gauge.draw()
            };
            var getMajorTicks = function(perfdataMax, numberOfTicks) {
                var tickSize = Math.ceil((perfdataMax / numberOfTicks));
                if (perfdataMax < numberOfTicks) {
                    numberOfTicks = perfdataMax
                }
                var tickArr = [];
                for (var i = 0; i < numberOfTicks; i++) {
                    tickArr.push((i * tickSize))
                }
                tickArr.push(perfdataMax);
                return tickArr
            };
            var processPerfdata = function() {
                $scope.perfdata = {
                    current: 0,
                    warning: 80,
                    critical: 90,
                    min: 0,
                    max: 100,
                    unit: 'n/a'
                };
                $scope.perfdataName = 'No data available';
                if ($scope.responsePerfdata !== null) {
                    if ($scope.tacho.metric !== null && $scope.responsePerfdata.hasOwnProperty($scope.tacho.metric)) {
                        $scope.perfdataName = $scope.tacho.metric;
                        $scope.perfdata = $scope.responsePerfdata[$scope.tacho.metric]
                    } else {
                        for (var metricName in $scope.responsePerfdata) {
                            $scope.perfdataName = metricName;
                            $scope.perfdata = $scope.responsePerfdata[metricName];
                            break
                        }
                    }
                }
                $scope.perfdata.current = parseFloat($scope.perfdata.current);
                $scope.perfdata.warning = parseFloat($scope.perfdata.warning);
                $scope.perfdata.critical = parseFloat($scope.perfdata.critical);
                $scope.perfdata.min = parseFloat($scope.perfdata.min);
                $scope.perfdata.max = parseFloat($scope.perfdata.max)
            };
            var hasResize = function() {
                if ($scope.init) {
                    return
                }
                $scope.height = $widgetContent.height() - offset;
                $scope.width = $scope.height;
                renderGauge($scope.perfdataName, $scope.perfdata)
            };
            var loadMetrics = function() {
                $http.get("/map_module/mapeditors/getPerformanceDataMetrics/" + $scope.tacho.service_id + ".json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    var metrics = {};
                    var firstMetric = null;
                    for (var metricName in result.data.perfdata) {
                        if (firstMetric === null) {
                            firstMetric = metricName
                        }
                        metrics[metricName] = metricName
                    }
                    if ($scope.tacho.metric === null) {
                        $scope.tacho.metric = firstMetric
                    }
                    $scope.metrics = metrics
                })
            };
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.load();
            $scope.$watch('tacho.service_id', function() {
                if ($scope.init) {
                    return
                }
                loadMetrics()
            }, !0)
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('welcomeWidget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/welcomeWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.load = function() {
                $http.get("/angular/statuscount.json", {
                    params: {
                        'angular': !0,
                        'recursive': !0
                    }
                }).then(function(result) {
                    $scope.hostCount = result.data.hoststatusSum;
                    $scope.serviceCount = result.data.servicestatusSum;
                    $scope.init = !1
                })
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('flippy', function($http, $interval) {
    return {
        restrict: 'E',
        scope: {
            flip: '=',
            flipBack: '=',
            duration: '@',
            timingFunction: '@'
        },
        link: function($scope, $elem, $attrs) {
            const CUSTOM_PREFIX = 'custom:';
            const state = {
                flipped: !1
            };
            const options = {
                duration: 400,
                timingFunction: 'ease-in-out'
            };
            angular.forEach(['duration', 'timingFunction'], function(item) {
                options[item] = ($scope[item]) ? $scope[item] : options[item]
            });
            angular.forEach({
                flip: flip,
                flipBack: flipBack
            }, function(flipFunc, evt) {
                angular.forEach($scope[evt], function(eventName) {
                    if (eventName.indexOf(CUSTOM_PREFIX) === -1) {
                        angular.element($elem)[0].addEventListener(eventName, flipFunc)
                    } else {
                        $scope.$on(eventName.substr(CUSTOM_PREFIX.length), flipFunc)
                    }
                })
            });
            angular.forEach(['flippy-front', 'flippy-back'], function(name) {
                const el = $elem.find(name);
                if (el.length == 1) {
                    angular.forEach(['', '-ms-', '-webkit-'], function(prefix) {
                        angular.element(el[0]).css(prefix + 'transition', 'all ' + options.duration / 1000 + 's ' + options.timingFunction)
                    })
                }
            });

            function _flip(isBack) {
                this.isBack = isBack || !1;
                if ((!this.isBack && !state.flipped) || (this.isBack && state.flipped)) {
                    setTimeout(function() {
                        $elem.toggleClass('flipped');
                        state.flipped = !state.flipped
                    }, 0)
                }
            }

            function flip() {
                _flip()
            }

            function flipBack() {
                _flip(!0)
            }
        }
    }
});
angular.module('openITCOCKPIT').directive('parentOutagesWidget', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/parentOutagesWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.filter = {
                Host: {
                    name: ''
                }
            };
            $scope.load = function() {
                $http.get("/dashboards/parentOutagesWidget.json", {
                    params: {
                        'angular': !0,
                        'filter[Host.name]': $scope.filter.Host.name
                    }
                }).then(function(result) {
                    $scope.parentOutages = result.data.parent_outages;
                    $scope.init = !1
                })
            };
            $scope.load();
            $scope.$watch('filter', function() {
                $scope.load()
            }, !0)
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('hostsDowntimeWidget', function($http, $interval) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/hostsDowntimeWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.interval = null;
            $scope.init = !0;
            $scope.useScroll = !0;
            $scope.scroll_interval = 30000;
            var $widget = $('#widget-' + $scope.widget.id);
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.hostListTimeout = null;
            $scope.sort = 'DowntimeHost.scheduled_start_time';
            $scope.direction = 'desc';
            $scope.currentPage = 1;
            $scope.filter = {
                DowntimeHost: {
                    comment_data: '',
                    was_cancelled: !1,
                    was_not_cancelled: !1
                },
                Host: {
                    name: ''
                },
                isRunning: !1,
                hideExpired: !0
            };
            var loadWidgetConfig = function() {
                $http.get("/dashboards/hostsDowntimeWidget.json?angular=true&widgetId=" + $scope.widget.id, $scope.filter).then(function(result) {
                    $scope.filter.Host = result.data.config.Host;
                    $scope.filter.DowntimeHost = result.data.config.DowntimeHost;
                    $scope.filter.isRunning = result.data.config.isRunning;
                    $scope.filter.hideExpired = result.data.config.hideExpired;
                    $scope.direction = result.data.config.direction;
                    $scope.sort = result.data.config.sort;
                    $scope.useScroll = result.data.config.useScroll;
                    var scrollInterval = parseInt(result.data.config.scroll_interval);
                    if (scrollInterval < 5000) {
                        scrollInterval = 5000
                    }
                    $scope.scroll_interval = scrollInterval;
                    $scope.load()
                })
            };
            $scope.$on('$destroy', function() {
                $scope.pauseScroll()
            });
            $scope.load = function(options) {
                options = options || {};
                options.save = options.save || !1;
                var wasCancelled = '';
                if ($scope.filter.DowntimeHost.was_cancelled ^ $scope.filter.DowntimeHost.was_not_cancelled) {
                    wasCancelled = $scope.filter.DowntimeHost.was_cancelled === !0
                }
                var params = {
                    'angular': !0,
                    'scroll': $scope.useScroll,
                    'sort': $scope.sort,
                    'page': $scope.currentPage,
                    'direction': $scope.direction,
                    'filter[DowntimeHost.comment_data]': $scope.filter.DowntimeHost.comment_data,
                    'filter[DowntimeHost.was_cancelled]': wasCancelled,
                    'filter[Host.name]': $scope.filter.Host.name,
                    'filter[hideExpired]': $scope.filter.hideExpired,
                    'filter[isRunning]': $scope.filter.isRunning
                };
                $http.get("/downtimes/host.json", {
                    params: params
                }).then(function(result) {
                    $scope.downtimes = result.data.all_host_downtimes;
                    $scope.paging = result.data.paging;
                    $scope.scroll = result.data.scroll;
                    if (options.save === !0) {
                        saveSettings(params)
                    }
                    if ($scope.useScroll) {
                        $scope.startScroll()
                    }
                    $scope.init = !1
                })
            };
            $scope.getSortClass = function(field) {
                if (field === $scope.sort) {
                    if ($scope.direction === 'asc') {
                        return 'fa-sort-asc'
                    }
                    return 'fa-sort-desc'
                }
                return 'fa-sort'
            };
            $scope.orderBy = function(field) {
                if (field !== $scope.sort) {
                    $scope.direction = 'asc';
                    $scope.sort = field;
                    $scope.load();
                    return
                }
                if ($scope.direction === 'asc') {
                    $scope.direction = 'desc'
                } else {
                    $scope.direction = 'asc'
                }
                $scope.load()
            };
            var hasResize = function() {
                if ($scope.hostListTimeout) {
                    clearTimeout($scope.hostListTimeout)
                }
                $scope.hostListTimeout = setTimeout(function() {
                    $scope.hostListTimeout = null;
                    $scope.limit = getLimit($widget.height());
                    if ($scope.limit <= 0) {
                        $scope.limit = 1
                    }
                    $scope.load()
                }, 500)
            };
            $scope.startScroll = function() {
                $scope.pauseScroll();
                $scope.useScroll = !0;
                $scope.interval = $interval(function() {
                    var page = $scope.currentPage;
                    if ($scope.scroll.hasNextPage) {
                        page++
                    } else {
                        page = 1
                    }
                    $scope.changepage(page)
                }, $scope.scroll_interval)
            };
            $scope.pauseScroll = function() {
                if ($scope.interval !== null) {
                    $interval.cancel($scope.interval);
                    $scope.interval = null
                }
                $scope.useScroll = !1
            };
            var getLimit = function(height) {
                height = height - 34 - 128 - 61 - 10 - 37;
                var limit = Math.floor(height / 36);
                if (limit <= 0) {
                    limit = 1
                }
                return limit
            };
            var saveSettings = function() {
                var settings = $scope.filter;
                settings.scroll_interval = $scope.scroll_interval;
                settings.useScroll = $scope.useScroll;
                $http.post("/dashboards/hostsDowntimeWidget.json?angular=true&widgetId=" + $scope.widget.id, settings).then(function(result) {
                    return !0
                })
            };
            var getTimeString = function() {
                return (new Date($scope.scroll_interval * 60)).toUTCString().match(/(\d\d:\d\d)/)[0] + " minutes"
            };
            $scope.changepage = function(page) {
                if (page !== $scope.currentPage) {
                    $scope.currentPage = page;
                    $scope.load()
                }
            };
            $scope.limit = getLimit($widget.height());
            loadWidgetConfig();
            $scope.$watch('filter', function() {
                $scope.currentPage = 1;
                if ($scope.init === !0) {
                    return !0
                }
                $scope.load({
                    save: !0
                })
            }, !0);
            $scope.$watch('scroll_interval', function() {
                $scope.pagingTimeString = getTimeString();
                if ($scope.init === !0) {
                    return !0
                }
                $scope.pauseScroll();
                $scope.startScroll();
                $scope.load({
                    save: !0
                })
            })
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('servicesDowntimeWidget', function($http, $interval) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/servicesDowntimeWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.interval = null;
            $scope.init = !0;
            $scope.useScroll = !0;
            $scope.scroll_interval = 30000;
            var $widget = $('#widget-' + $scope.widget.id);
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.serviceListTimeout = null;
            $scope.sort = 'DowntimeService.scheduled_start_time';
            $scope.direction = 'desc';
            $scope.currentPage = 1;
            $scope.filter = {
                DowntimeService: {
                    comment_data: '',
                    was_cancelled: !1,
                    was_not_cancelled: !1
                },
                Host: {
                    name: ''
                },
                Service: {
                    name: ''
                },
                isRunning: !1,
                hideExpired: !0
            };
            var loadWidgetConfig = function() {
                $http.get("/dashboards/servicesDowntimeWidget.json?angular=true&widgetId=" + $scope.widget.id, $scope.filter).then(function(result) {
                    $scope.filter.Host = result.data.config.Host;
                    $scope.filter.Service = result.data.config.Service;
                    $scope.filter.DowntimeService = result.data.config.DowntimeService;
                    $scope.filter.isRunning = result.data.config.isRunning;
                    $scope.filter.hideExpired = result.data.config.hideExpired;
                    $scope.direction = result.data.config.direction;
                    $scope.sort = result.data.config.sort;
                    $scope.useScroll = result.data.config.useScroll;
                    var scrollInterval = parseInt(result.data.config.scroll_interval);
                    if (scrollInterval < 5000) {
                        scrollInterval = 5000
                    }
                    $scope.scroll_interval = scrollInterval;
                    $scope.load()
                })
            };
            $scope.$on('$destroy', function() {
                $scope.pauseScroll()
            });
            $scope.load = function(options) {
                options = options || {};
                options.save = options.save || !1;
                var wasCancelled = '';
                if ($scope.filter.DowntimeService.was_cancelled ^ $scope.filter.DowntimeService.was_not_cancelled) {
                    wasCancelled = $scope.filter.DowntimeService.was_cancelled === !0
                }
                var params = {
                    'angular': !0,
                    'scroll': $scope.useScroll,
                    'sort': $scope.sort,
                    'page': $scope.currentPage,
                    'direction': $scope.direction,
                    'filter[DowntimeService.comment_data]': $scope.filter.DowntimeService.comment_data,
                    'filter[DowntimeService.was_cancelled]': wasCancelled,
                    'filter[Host.name]': $scope.filter.Host.name,
                    'filter[Service.name]': $scope.filter.Service.name,
                    'filter[hideExpired]': $scope.filter.hideExpired,
                    'filter[isRunning]': $scope.filter.isRunning
                };
                $http.get("/downtimes/service.json", {
                    params: params
                }).then(function(result) {
                    $scope.downtimes = result.data.all_service_downtimes;
                    $scope.paging = result.data.paging;
                    $scope.scroll = result.data.scroll;
                    if (options.save === !0) {
                        saveSettings(params)
                    }
                    if ($scope.useScroll) {
                        $scope.startScroll()
                    }
                    $scope.init = !1
                })
            };
            $scope.getSortClass = function(field) {
                if (field === $scope.sort) {
                    if ($scope.direction === 'asc') {
                        return 'fa-sort-asc'
                    }
                    return 'fa-sort-desc'
                }
                return 'fa-sort'
            };
            $scope.orderBy = function(field) {
                if (field !== $scope.sort) {
                    $scope.direction = 'asc';
                    $scope.sort = field;
                    $scope.load();
                    return
                }
                if ($scope.direction === 'asc') {
                    $scope.direction = 'desc'
                } else {
                    $scope.direction = 'asc'
                }
                $scope.load()
            };
            var hasResize = function() {
                if ($scope.serviceListTimeout) {
                    clearTimeout($scope.serviceListTimeout)
                }
                $scope.serviceListTimeout = setTimeout(function() {
                    $scope.serviceListTimeout = null;
                    $scope.limit = getLimit($widget.height());
                    if ($scope.limit <= 0) {
                        $scope.limit = 1
                    }
                    $scope.load()
                }, 500)
            };
            $scope.startScroll = function() {
                $scope.pauseScroll();
                $scope.useScroll = !0;
                $scope.interval = $interval(function() {
                    var page = $scope.currentPage;
                    if ($scope.scroll.hasNextPage) {
                        page++
                    } else {
                        page = 1
                    }
                    $scope.changepage(page)
                }, $scope.scroll_interval)
            };
            $scope.pauseScroll = function() {
                if ($scope.interval !== null) {
                    $interval.cancel($scope.interval);
                    $scope.interval = null
                }
                $scope.useScroll = !1
            };
            var getLimit = function(height) {
                height = height - 34 - 128 - 61 - 10 - 37;
                var limit = Math.floor(height / 36);
                if (limit <= 0) {
                    limit = 1
                }
                return limit
            };
            var saveSettings = function() {
                var settings = $scope.filter;
                settings.scroll_interval = $scope.scroll_interval;
                settings.useScroll = $scope.useScroll;
                $http.post("/dashboards/servicesDowntimeWidget.json?angular=true&widgetId=" + $scope.widget.id, settings).then(function(result) {
                    return !0
                })
            };
            var getTimeString = function() {
                return (new Date($scope.scroll_interval * 60)).toUTCString().match(/(\d\d:\d\d)/)[0] + " minutes"
            };
            $scope.changepage = function(page) {
                if (page !== $scope.currentPage) {
                    $scope.currentPage = page;
                    $scope.load()
                }
            };
            $scope.limit = getLimit($widget.height());
            loadWidgetConfig();
            $scope.$watch('filter', function() {
                $scope.currentPage = 1;
                if ($scope.init === !0) {
                    return !0
                }
                $scope.load({
                    save: !0
                })
            }, !0);
            $scope.$watch('scroll_interval', function() {
                $scope.pagingTimeString = getTimeString();
                if ($scope.init === !0) {
                    return !0
                }
                $scope.pauseScroll();
                $scope.startScroll();
                $scope.load({
                    save: !0
                })
            })
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('hostStatusOverviewWidget', function($http, $rootScope, $interval, $httpParamSerializer) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/hostStatusOverviewWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.init = !0;
            var $widget = $('#widget-' + $scope.widget.id);
            $scope.frontWidgetHeight = parseInt(($widget.height() - 30), 10);
            $scope.fontSize = $scope.frontWidgetHeight / 2;
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.hostsStatusOverviewTimeout = null;
            $scope.filter = {
                Hoststatus: {
                    current_state: null,
                    not_acknowledged: !0,
                    not_in_downtime: !0
                },
                Host: {
                    name: ''
                }
            };
            $scope.statusCount = null;
            $scope.load = function() {
                $http.get("/dashboards/hostStatusOverviewWidget.json?angular=true&widgetId=" + $scope.widget.id, $scope.filter).then(function(result) {
                    $scope.filter.Host = result.data.config.Host;
                    $scope.filter.Hoststatus.current_state = result.data.config.Hoststatus.current_state;
                    $scope.filter.Hoststatus.not_acknowledged = !result.data.config.Hoststatus.problem_has_been_acknowledged;
                    $scope.filter.Hoststatus.not_in_downtime = !result.data.config.Hoststatus.scheduled_downtime_depth;
                    $scope.statusCount = result.data.statusCount;
                    $scope.init = !1;
                    $scope.widgetHref = $scope.linkForHostList()
                })
            };
            $scope.hideConfig = function() {
                $scope.$broadcast('FLIP_EVENT_IN')
            };
            $scope.showConfig = function() {
                $scope.$broadcast('FLIP_EVENT_OUT')
            };
            var hasResize = function() {
                if ($scope.init) {
                    return
                }
                $scope.frontWidgetHeight = parseInt(($widget.height() - 30), 10);
                $scope.fontSize = $scope.frontWidgetHeight / 2;
                if ($scope.hostsStatusOverviewTimeout) {
                    clearTimeout($scope.hostsStatusOverviewTimeout)
                }
                $scope.hostsStatusOverviewTimeout = setTimeout(function() {
                    $scope.load()
                }, 500)
            };
            $scope.load();
            $scope.saveHoststatusOverview = function() {
                if ($scope.init) {
                    return
                }
                $http.post("/dashboards/hostStatusOverviewWidget.json?angular=true", {
                    Widget: {
                        id: $scope.widget.id
                    },
                    Hoststatus: {
                        current_state: $scope.filter.Hoststatus.current_state,
                        problem_has_been_acknowledged: !$scope.filter.Hoststatus.not_acknowledged,
                        scheduled_downtime_depth: !$scope.filter.Hoststatus.not_in_downtime
                    },
                    Host: {
                        name: $scope.filter.Host.name
                    }
                }).then(function(result) {
                    $scope.load();
                    $scope.hideConfig()
                })
            };
            $scope.linkForHostList = function() {
                if ($scope.init) {
                    return
                }
                var options = {
                    'angular': !0,
                    'filter[Host.name]': $scope.filter.Host.name,
                    'has_not_been_acknowledged': ($scope.filter.Hoststatus.not_acknowledged) ? '1' : '0',
                    'not_in_downtime': ($scope.filter.Hoststatus.not_in_downtime) ? '1' : '0'
                };
                var currentState = 'filter[Hoststatus.current_state][' + $scope.filter.Hoststatus.current_state + ']';
                options[currentState] = 1;
                return '/hosts/index/?' + $httpParamSerializer(options)
            }
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('servicesStatusWidget', function($http, $rootScope, $interval) {
    return {
        restrict: 'E',
        templateUrl: '/dashboards/servicesStatusListWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.interval = null;
            $scope.init = !0;
            $scope.useScroll = !0;
            $scope.scroll_interval = 30000;
            var $widget = $('#widget-' + $scope.widget.id);
            $widget.on('resize', function(event, items) {
                hasResize()
            });
            $scope.serviceListTimeout = null;
            $scope.sort = 'Servicestatus.current_state';
            $scope.direction = 'desc';
            $scope.currentPage = 1;
            $scope.filter = {
                Servicestatus: {
                    current_state: {
                        ok: !1,
                        warning: !1,
                        critical: !1,
                        unknown: !1
                    },
                    acknowledged: !1,
                    not_acknowledged: !1,
                    in_downtime: !1,
                    not_in_downtime: !1,
                    output: ''
                },
                Host: {
                    name: ''
                },
                Service: {
                    name: ''
                }
            };
            var loadWidgetConfig = function() {
                $http.get("/dashboards/servicesStatusListWidget.json?angular=true&widgetId=" + $scope.widget.id, $scope.filter).then(function(result) {
                    $scope.filter.Host = result.data.config.Host;
                    $scope.filter.Service = result.data.config.Service;
                    $scope.filter.Servicestatus = result.data.config.Servicestatus;
                    $scope.direction = result.data.config.direction;
                    $scope.sort = result.data.config.sort;
                    $scope.useScroll = result.data.config.useScroll;
                    var scrollInterval = parseInt(result.data.config.scroll_interval);
                    if (scrollInterval < 5000) {
                        scrollInterval = 5000
                    }
                    $scope.scroll_interval = scrollInterval;
                    if ($scope.useScroll) {
                        $scope.startScroll()
                    }
                    $scope.load()
                })
            };
            $scope.$on('$destroy', function() {
                $scope.pauseScroll()
            });
            $scope.load = function(options) {
                options = options || {};
                options.save = options.save || !1;
                var hasBeenAcknowledged = '';
                var inDowntime = '';
                if ($scope.filter.Servicestatus.acknowledged ^ $scope.filter.Servicestatus.not_acknowledged) {
                    hasBeenAcknowledged = $scope.filter.Servicestatus.acknowledged === !0
                }
                if ($scope.filter.Servicestatus.in_downtime ^ $scope.filter.Servicestatus.not_in_downtime) {
                    inDowntime = $scope.filter.Servicestatus.in_downtime === !0
                }
                var params = {
                    'angular': !0,
                    'scroll': !0,
                    'sort': $scope.sort,
                    'page': $scope.currentPage,
                    'direction': $scope.direction,
                    'filter[Host.name]': $scope.filter.Host.name,
                    'filter[Service.servicename]': $scope.filter.Service.name,
                    'filter[Servicestatus.output]': $scope.filter.Servicestatus.output,
                    'filter[Servicestatus.current_state][]': $rootScope.currentStateForApi($scope.filter.Servicestatus.current_state),
                    'filter[Servicestatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
                    'filter[Servicestatus.scheduled_downtime_depth]': inDowntime,
                    'limit': $scope.limit
                };
                $http.get("/services/index.json", {
                    params: params
                }).then(function(result) {
                    $scope.services = result.data.all_services;
                    $scope.scroll = result.data.scroll;
                    if (options.save === !0) {
                        saveSettings(params)
                    }
                    $scope.init = !1
                })
            };
            $scope.getSortClass = function(field) {
                if (field === $scope.sort) {
                    if ($scope.direction === 'asc') {
                        return 'fa-sort-asc'
                    }
                    return 'fa-sort-desc'
                }
                return 'fa-sort'
            };
            $scope.orderBy = function(field) {
                if (field !== $scope.sort) {
                    $scope.direction = 'asc';
                    $scope.sort = field;
                    $scope.load();
                    return
                }
                if ($scope.direction === 'asc') {
                    $scope.direction = 'desc'
                } else {
                    $scope.direction = 'asc'
                }
                $scope.load()
            };
            var hasResize = function() {
                if ($scope.serviceListTimeout) {
                    clearTimeout($scope.serviceListTimeout)
                }
                $scope.serviceListTimeout = setTimeout(function() {
                    $scope.serviceListTimeout = null;
                    $scope.limit = getLimit($widget.height());
                    if ($scope.limit <= 0) {
                        $scope.limit = 1
                    }
                    $scope.load()
                }, 500)
            };
            $scope.startScroll = function() {
                $scope.pauseScroll();
                $scope.useScroll = !0;
                $scope.interval = $interval(function() {
                    var page = $scope.currentPage;
                    if ($scope.scroll.hasNextPage) {
                        page++
                    } else {
                        page = 1
                    }
                    $scope.changepage(page)
                }, $scope.scroll_interval)
            };
            $scope.pauseScroll = function() {
                if ($scope.interval !== null) {
                    $interval.cancel($scope.interval);
                    $scope.interval = null
                }
                $scope.useScroll = !1
            };
            var getLimit = function(height) {
                height = height - 34 - 180 - 61 - 10 - 37;
                var limit = Math.floor(height / 36);
                if (limit <= 0) {
                    limit = 1
                }
                return limit
            };
            var saveSettings = function() {
                var settings = $scope.filter;
                settings.scroll_interval = $scope.scroll_interval;
                settings.useScroll = $scope.useScroll;
                $http.post("/dashboards/servicesStatusListWidget.json?angular=true&widgetId=" + $scope.widget.id, settings).then(function(result) {
                    return !0
                })
            };
            var getTimeString = function() {
                return (new Date($scope.scroll_interval * 60)).toUTCString().match(/(\d\d:\d\d)/)[0] + " minutes"
            };
            $scope.changepage = function(page) {
                if (page !== $scope.currentPage) {
                    $scope.currentPage = page;
                    $scope.load()
                }
            };
            $scope.limit = getLimit($widget.height());
            loadWidgetConfig();
            $scope.$watch('filter', function() {
                $scope.currentPage = 1;
                if ($scope.init === !0) {
                    return !0
                }
                $scope.load({
                    save: !0
                })
            }, !0);
            $scope.$watch('scroll_interval', function() {
                $scope.pagingTimeString = getTimeString();
                if ($scope.init === !0) {
                    return !0
                }
                $scope.pauseScroll();
                $scope.startScroll();
                $scope.load({
                    save: !0
                })
            })
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('phpnstaMasterCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/phpNSTAMaster.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/phpNSTAMaster.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/phpNSTAMaster.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('nagiosModuleConfig', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/NagiosModuleConfig.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/NagiosModuleConfig.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/NagiosModuleConfig.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('statusengineCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/StatusengineCfg.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/StatusengineCfg.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/StatusengineCfg.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('afterExportCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/AfterExport.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/AfterExport.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/AfterExport.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('dbBackendCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/DbBackend.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/DbBackend.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/DbBackend.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('graphiteWebCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/GraphiteWeb.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/GraphiteWeb.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/GraphiteWeb.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('graphingDockerCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/GraphingDocker.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/GraphingDocker.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/GraphingDocker.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('perfdataBackendCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/PerfdataBackend.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/PerfdataBackend.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/PerfdataBackend.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('nagiosCfg', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/ConfigurationFiles/NagiosCfg.html',
        scope: {},
        controller: function($scope) {
            $scope.post = {};
            $scope.init = !0;
            $scope.load = function() {
                $http.get('/ConfigurationFiles/NagiosCfg.json', {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.post = result.data.config;
                    $scope.init = !1
                }, function errorCallback(result) {
                    if (result.status === 404) {
                        window.location.href = '/angular/not_found'
                    }
                })
            };
            $scope.submit = function() {
                $http.post('/ConfigurationFiles/NagiosCfg.json?angular=true', $scope.post).then(function(result) {
                    console.log('Data saved successfully');
                    window.location.href = '/ConfigurationFiles/index'
                }, function errorCallback(result) {
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.load()
        }
    }
});
angular.module('openITCOCKPIT').directive('grafanaRow', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/grafana_module/grafana_userdashboards/grafanaRow.html',
        scope: {
            'id': '=',
            'row': '=',
            'rowId': '=',
            'removeRowCallback': '=',
            'grafanaUnits': '=',
            'containerId': '='
        },
        controller: function($scope) {
            $scope.addPanel = function() {
                var data = {
                    GrafanaUserdashboardPanel: {
                        row: parseInt($scope.rowId, 10),
                        userdashboard_id: $scope.id
                    }
                };
                $http.post("/grafana_module/grafana_userdashboards/addPanel.json?angular=true", data).then(function(result) {
                    if (result.data.hasOwnProperty('panel')) {
                        new Noty({
                            theme: 'metroui',
                            type: 'success',
                            text: 'Panel added successfully',
                            timeout: 3500
                        }).show();
                        $scope.row.push(result.data.panel);
                        setPanelClass()
                    }
                }, function errorCallback(result) {
                    new Noty({
                        theme: 'metroui',
                        type: 'error',
                        text: 'Error while adding panel',
                        timeout: 3500
                    }).show()
                })
            };
            $scope.removePanel = function(panelId) {
                $http.post("/grafana_module/grafana_userdashboards/removePanel.json?angular=true", {
                    id: parseInt(panelId, 10)
                }).then(function(result) {
                    if (result.data.success) {
                        new Noty({
                            theme: 'metroui',
                            type: 'success',
                            text: 'Panel removed successfully',
                            timeout: 3500
                        }).show();
                        removePanelFromRow(panelId);
                        setPanelClass()
                    } else {
                        new Noty({
                            theme: 'metroui',
                            type: 'error',
                            text: 'Error while removing panel',
                            timeout: 3500
                        }).show()
                    }
                }, function errorCallback(result) {
                    new Noty({
                        theme: 'metroui',
                        type: 'error',
                        text: 'Error while removing panel',
                        timeout: 3500
                    }).show()
                })
            };
            $scope.removeRow = function() {
                var panelIds = [];
                for (var i in $scope.row) {
                    var id = parseInt($scope.row[i].id);
                    if (isNaN(id) === !1) {
                        panelIds.push($scope.row[i].id)
                    }
                }
                $http.post("/grafana_module/grafana_userdashboards/removeRow.json?angular=true", {
                    'ids': panelIds
                }).then(function(result) {
                    if (result.data.success) {
                        new Noty({
                            theme: 'metroui',
                            type: 'success',
                            text: 'Row removed successfully',
                            timeout: 3500
                        }).show();
                        $scope.removeRowCallback()
                    } else {
                        new Noty({
                            theme: 'metroui',
                            type: 'error',
                            text: 'Error while removing row',
                            timeout: 3500
                        }).show()
                    }
                }, function errorCallback(result) {
                    new Noty({
                        theme: 'metroui',
                        type: 'error',
                        text: 'Error while removing row',
                        timeout: 3500
                    }).show()
                })
            };
            var setPanelClass = function() {
                $scope.panelClass = 'col-lg-' + (12 / $scope.row.length)
            };
            var removePanelFromRow = function(panelId) {
                panelId = parseInt(panelId, 10);
                for (var i in $scope.row) {
                    var rowId = parseInt($scope.row[i].id, 10);
                    if (rowId === panelId) {
                        $scope.row.splice(i, 1)
                    }
                }
            };
            $scope.panelClass = 'col-md-3';
            $scope.$watch('row', function() {
                setPanelClass()
            })
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('grafanaWidgetUserdefined', function($http, $sce) {
    return {
        restrict: 'E',
        templateUrl: '/grafana_module/grafana_userdashboards/grafanaWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.init = !0;
            $scope.grafana = {
                dashboard_id: null,
                iframe_url: ''
            };
            $scope.load = function() {
                $http.get("/grafana_module/grafana_userdashboards/grafanaWidget.json", {
                    params: {
                        'angular': !0,
                        'widgetId': $scope.widget.id
                    }
                }).then(function(result) {
                    $sce.trustAsResourceUrl(result.data.iframe_url);
                    $scope.grafana.dashboard_id = result.data.grafana_userdashboard_id;
                    if ($scope.grafana.dashboard_id !== null) {
                        $scope.grafana.dashboard_id = parseInt($scope.grafana.dashboard_id, 10)
                    }
                    $scope.grafana.iframe_url = result.data.iframe_url;
                    setTimeout(function() {
                        $scope.init = !1
                    }, 250)
                })
            };
            $scope.loadGrafanaUserDashboards = function() {
                $http.get("/grafana_module/grafana_userdashboards/index.json", {
                    params: {
                        'angular': !0,
                        'skipUnsyncDashboards': !0
                    }
                }).then(function(result) {
                    var availableGrafanaUserdefeinedDashboards = [];
                    for (var i in result.data.all_userdashboards) {
                        availableGrafanaUserdefeinedDashboards.push({
                            id: parseInt(result.data.all_userdashboards[i].GrafanaUserdashboard.id, 10),
                            name: result.data.all_userdashboards[i].GrafanaUserdashboard.name
                        })
                    }
                    $scope.availableGrafanaUserdefeinedDashboards = availableGrafanaUserdefeinedDashboards
                })
            };
            $scope.hideConfig = function() {
                $scope.$broadcast('FLIP_EVENT_IN');
                $scope.load()
            };
            $scope.showConfig = function() {
                $scope.$broadcast('FLIP_EVENT_OUT');
                $scope.loadGrafanaUserDashboards()
            };
            $scope.saveGrafana = function() {
                $http.post("/grafana_module/grafana_userdashboards/grafanaWidget.json?angular=true", {
                    Widget: {
                        id: $scope.widget.id
                    },
                    dashboard_id: $scope.grafana.dashboard_id
                }).then(function(result) {
                    $scope.hideConfig()
                })
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('grafanaWidget', function($http, $sce) {
    return {
        restrict: 'E',
        templateUrl: '/grafana_module/grafana_configuration/grafanaWidget.html',
        scope: {
            'widget': '='
        },
        controller: function($scope) {
            $scope.init = !0;
            $scope.grafana = {
                host_id: null,
                iframe_url: ''
            };
            $scope.load = function() {
                $http.get("/grafana_module/grafana_configuration/grafanaWidget.json", {
                    params: {
                        'angular': !0,
                        'widgetId': $scope.widget.id
                    }
                }).then(function(result) {
                    $sce.trustAsResourceUrl(result.data.iframe_url);
                    $scope.grafana.host_id = result.data.host_id;
                    $scope.grafana.iframe_url = result.data.iframe_url;
                    setTimeout(function() {
                        $scope.init = !1
                    }, 250)
                })
            };
            $scope.loadGrafanaDashboards = function() {
                $http.get("/grafana_module/grafana_configuration/getGrafanaDashboards.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.availableGrafanaDashboards = result.data.grafana_dashboards
                })
            };
            $scope.hideConfig = function() {
                $scope.$broadcast('FLIP_EVENT_IN');
                $scope.load()
            };
            $scope.showConfig = function() {
                $scope.$broadcast('FLIP_EVENT_OUT');
                $scope.loadGrafanaDashboards()
            };
            $scope.saveGrafana = function() {
                $http.post("/grafana_module/grafana_configuration/grafanaWidget.json?angular=true", {
                    Widget: {
                        id: $scope.widget.id
                    },
                    host_id: $scope.grafana.host_id
                }).then(function(result) {
                    $scope.hideConfig()
                })
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('grafanaPanel', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/grafana_module/grafana_userdashboards/grafanaPanel.html',
        scope: {
            'id': '=',
            'panel': '=',
            'panelId': '=',
            'removeCallback': '=',
            'grafanaUnits': '=',
            'containerId': '='
        },
        controller: function($scope) {
            $scope.currentServiceId = null;
            $scope.currentServiceMetric = null;
            $scope.rowId = parseInt($scope.panel.row, 10);
            $scope.init = !0;
            $scope.humanUnit = '';
            $scope.addMetric = function() {
                $scope.currentServiceId = null;
                $scope.currentServiceMetric = null;
                loadServices('')
            };
            $scope.loadMoreServices = function(searchString) {
                loadServices(searchString)
            };
            $scope.saveMetric = function() {
                var data = {
                    GrafanaUserdashboardMetric: {
                        row: parseInt($scope.rowId, 10),
                        panel_id: parseInt($scope.panelId, 10),
                        service_id: $scope.currentServiceId,
                        metric: $scope.currentServiceMetric,
                        userdashboard_id: $scope.id
                    }
                };
                $http.post("/grafana_module/grafana_userdashboards/addMetricToPanel.json?angular=true", data).then(function(result) {
                    $scope.errors = {};
                    if (result.data.hasOwnProperty('metric')) {
                        new Noty({
                            theme: 'metroui',
                            type: 'success',
                            text: 'Metric added successfully',
                            timeout: 3500
                        }).show();
                        $scope.panel.metrics.push(result.data.metric);
                        $('#addMetricToPanelModal_' + $scope.rowId + '_' + $scope.panelId).modal('hide')
                    }
                }, function errorCallback(result) {
                    new Noty({
                        theme: 'metroui',
                        type: 'error',
                        text: 'Error while adding metric',
                        timeout: 3500
                    }).show();
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            $scope.removeMetric = function(metric) {
                $http.post("/grafana_module/grafana_userdashboards/removeMetricFromPanel.json?angular=true", {
                    id: parseInt(metric.id, 10)
                }).then(function(result) {
                    $scope.errors = {};
                    if (result.data.success) {
                        new Noty({
                            theme: 'metroui',
                            type: 'success',
                            text: 'Metric removed successfully',
                            timeout: 3500
                        }).show();
                        removeMetricFromPanel(metric.id)
                    } else {
                        new Noty({
                            theme: 'metroui',
                            type: 'error',
                            text: 'Error while removing metric',
                            timeout: 3500
                        }).show()
                    }
                }, function errorCallback(result) {
                    new Noty({
                        theme: 'metroui',
                        type: 'error',
                        text: 'Error while removing metric',
                        timeout: 3500
                    }).show();
                    if (result.data.hasOwnProperty('error')) {
                        $scope.errors = result.data.error
                    }
                })
            };
            var loadServices = function(searchString, selected) {
                if (typeof selected === "undefined") {
                    selected = []
                }
                $http.get("/services/loadServicesByContainerId.json", {
                    params: {
                        'angular': !0,
                        'filter[Host.name]': searchString,
                        'filter[Service.servicename]': searchString,
                        'selected[]': selected,
                        'containerId': $scope.containerId
                    }
                }).then(function(result) {
                    var tmpServices = [];
                    for (var i in result.data.services) {
                        var tmpService = result.data.services[i];
                        var serviceName = tmpService.value.Service.name;
                        if (serviceName === null || serviceName === '') {
                            serviceName = tmpService.value.Servicetemplate.name
                        }
                        tmpServices.push({
                            key: tmpService.key,
                            value: tmpService.value.Host.name + '/' + serviceName
                        })
                    }
                    $scope.services = tmpServices;
                    $('#addMetricToPanelModal_' + $scope.rowId + '_' + $scope.panelId).modal('show')
                })
            };
            var loadMetrics = function() {
                if ($scope.currentServiceId === null) {
                    return
                }
                $http.get("/grafana_module/grafana_userdashboards/getPerformanceDataMetrics/" + $scope.currentServiceId + ".json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    var metrics = {};
                    var firstMetric = null;
                    for (var metricName in result.data.perfdata) {
                        if (firstMetric === null) {
                            firstMetric = metricName
                        }
                        metrics[metricName] = metricName
                    }
                    if ($scope.metric === null) {
                        $scope.metric = firstMetric
                    }
                    $scope.metrics = metrics
                })
            };
            $scope.removePanel = function() {
                $scope.removeCallback($scope.panelId)
            };
            $scope.openPanelOptions = function() {
                $('#panelOptionsModal_' + $scope.rowId + '_' + $scope.panelId).modal('show')
            };
            var removeMetricFromPanel = function(metricId) {
                var metrics = [];
                metricId = parseInt(metricId, 10);
                for (var i in $scope.panel.metrics) {
                    if (parseInt($scope.panel.metrics[i].id, 10) !== metricId) {
                        metrics.push($scope.panel.metrics[i])
                    }
                }
                $scope.panel.metrics = metrics
            };
            var savePanelOptions = function() {
                $http.post("/grafana_module/grafana_userdashboards/savePanelUnit.json?angular=true", {
                    id: parseInt($scope.panel.id, 10),
                    unit: $scope.panel.unit,
                    title: $scope.panel.title
                }).then(function(result) {
                    if (result.data.success) {
                        new Noty({
                            theme: 'metroui',
                            type: 'success',
                            text: 'Panel unit saved successfully',
                            timeout: 3500
                        }).show()
                    } else {
                        new Noty({
                            theme: 'metroui',
                            type: 'error',
                            text: 'Error while saving panel unit',
                            timeout: 3500
                        }).show()
                    }
                }, function errorCallback(result) {
                    new Noty({
                        theme: 'metroui',
                        type: 'error',
                        text: 'Error while saving panel unit',
                        timeout: 3500
                    }).show()
                })
            };
            $scope.$watch('currentServiceId', function() {
                loadMetrics()
            });
            $scope.$watchGroup(['panel.unit', 'panel.title'], function() {
                for (var i in $scope.grafanaUnits) {
                    if ($scope.grafanaUnits[i].hasOwnProperty($scope.panel.unit)) {
                        $scope.humanUnit = $scope.grafanaUnits[i][$scope.panel.unit];
                        if ($scope.humanUnit === 'None') {
                            $scope.humanUnit = ''
                        }
                    }
                }
                if ($scope.init) {
                    $scope.init = !1;
                    return
                }
                savePanelOptions()
            })
        },
        link: function($scope, element, attr) {}
    }
});
angular.module('openITCOCKPIT').directive('grafanaTimepicker', function($http) {
    return {
        restrict: 'E',
        templateUrl: '/grafana_module/grafana_userdashboards/grafanaTimepicker.html',
        scope: {
            'callback': '='
        },
        controller: function($scope) {
            var defaultTimerange = 'now-3h';
            var defaultAutoRefresh = '1m';
            $scope.selectedTimerange = defaultTimerange;
            $scope.selectedAutoRefresh = defaultAutoRefresh;
            $scope.humanTimerange = 'Last 3 hours';
            $scope.humanAutoRefresh = 'Refresh every 1m';
            $scope.init = !0;
            $scope.load = function() {
                $http.get("/grafana_module/grafana_userdashboards/grafanaTimepicker.json", {
                    params: {
                        'angular': !0
                    }
                }).then(function(result) {
                    $scope.timeranges = result.data.timeranges;
                    $scope.init = !1
                })
            };
            $scope.changeAutoRefresh = function(urlKey, name) {
                $scope.selectedAutoRefresh = urlKey;
                if (urlKey === 0 || urlKey === '0') {
                    $scope.humanAutoRefresh = !1
                } else {
                    $scope.humanAutoRefresh = name
                }
                $scope.callback($scope.selectedTimerange, $scope.selectedAutoRefresh)
            };
            $scope.changeTimerange = function(urlKey, name) {
                $scope.selectedTimerange = urlKey;
                $scope.humanTimerange = name;
                $scope.callback($scope.selectedTimerange, $scope.selectedAutoRefresh)
            };
            $scope.load()
        },
        link: function($scope, element, attr) {}
    }
})