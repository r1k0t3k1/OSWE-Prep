angular.module('openITCOCKPIT').controller('AcknowledgementsHostController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'AcknowledgedHost.entry_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Acknowledgement: {
                state: {
                    ok: !1,
                    warning: !1,
                    critical: !1,
                    unknown: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                comment: '',
                author: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/acknowledgements/host/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[AcknowledgedHost.comment_data]': $scope.filter.Acknowledgement.comment,
                'filter[AcknowledgedHost.state][]': $rootScope.currentStateForApi($scope.filter.Acknowledgement.state),
                'filter[AcknowledgedHost.author_name]': $scope.filter.Acknowledgement.author,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.acknowledgements = result.data.all_acknowledgements;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ContainersShowDetailsController', function($scope, $http, $timeout, QueryStringService) {
    $scope.init = !0;
    $scope.post = {
        Container: {
            id: null
        }
    };
    $scope.post.Container.id = QueryStringService.getCakeId();
    $scope.loadContainerDetails = function() {
        $http.get('/containers/showDetails/' + $scope.post.Container.id + '.json', {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containerDetails = result.data.containerDetails
        })
    };
    $scope.loadContainerDetails()
});
angular.module('openITCOCKPIT').controller('UsersAddFromLdapController', function($scope, $http) {
    $scope.init = !0;
    $scope.isPhp7Dot1 = !1;
    $scope.selectedSamAccountName = '';
    $scope.errors = !1;
    $scope.loadUsers = function(searchString) {
        $http.get("/users/addFromLdap.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.users = result.data.usersForSelect;
            $scope.isPhp7Dot1 = result.data.isPhp7Dot1
        })
    };
    $scope.loadUsersByString = function(searchString) {
        $http.get("/users/loadLdapUserByString.json", {
            params: {
                'angular': !0,
                'samaccountname': searchString
            }
        }).then(function(result) {
            $scope.users = result.data.usersForSelect
        })
    };
    $scope.submit = function() {
        if ($scope.selectedSamAccountName.length === 0) {
            $scope.errors = ['Please select one user'];
            return !1
        }
        window.location.href = '/users/add/ldap:1/samaccountname:' + encodeURI($scope.selectedSamAccountName) + '/fix:1'
    };
    $scope.loadUsers()
});
angular.module('openITCOCKPIT').controller('StatehistoriesHostController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'StatehistoryHost.state_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    $scope.useScroll = !0;
    var now = new Date();
    var defaultFilter = function() {
        $scope.filter = {
            StatehistoryHost: {
                state: {
                    recovery: !1,
                    dowm: !1,
                    unreachable: !1,
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var state_type = '';
        if ($scope.filter.StatehistoryHost.state_types.soft ^ $scope.filter.StatehistoryHost.state_types.hard) {
            state_type = 0;
            if ($scope.filter.StatehistoryHost.state_types.hard === !0) {
                state_type = 1
            }
        }
        $http.get("/statehistories/host/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[StatehistoryHost.output]': $scope.filter.StatehistoryHost.output,
                'filter[StatehistoryHost.state][]': $rootScope.currentStateForApi($scope.filter.StatehistoryHost.state),
                'filter[StatehistoryHost.state_type]': state_type,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.statehistories = result.data.all_statehistories;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('HostsNotMonitoredController', function($scope, $http, $httpParamSerializer, SortService, MassChangeService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Host.name'));
    SortService.setDirection(QueryStringService.getValue('direction', 'asc'));
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            Host: {
                name: QueryStringService.getValue('filter[Host.name]', ''),
                description: QueryStringService.getValue('filter[Host.description]', ''),
                address: '',
                satellite_id: []
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/hosts/delete/';
    $scope.deactivateUrl = '/hosts/deactivate/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Host.description]': $scope.filter.Host.description,
            'filter[Host.address]': $scope.filter.Host.address,
            'filter[Host.satellite_id][]': $scope.filter.Host.satellite_id
        };
        $http.get("/hosts/notMonitored.json", {
            params: params
        }).then(function(result) {
            $scope.hosts = result.data.all_hosts;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.selectAll = function() {
        if ($scope.hosts) {
            for (var key in $scope.hosts) {
                if ($scope.hosts[key].Host.allow_edit) {
                    var id = $scope.hosts[key].Host.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host) {
        var object = {};
        object[host.Host.id] = host.Host.hostname;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.hosts) {
            for (var id in selectedObjects) {
                if (id == $scope.hosts[key].Host.id) {
                    objects[id] = $scope.hosts[key].Host.hostname
                }
            }
        }
        return objects
    };
    $scope.linkForCopy = function() {
        var baseUrl = '/hosts/copy/';
        return buildUrl(baseUrl)
    };
    $scope.linkForEditDetails = function() {
        var baseUrl = '/hosts/edit_details/';
        return buildUrl(baseUrl)
    };
    $scope.linkForAddToHostgroup = function() {
        var baseUrl = '/hostgroups/mass_add/';
        return buildUrl(baseUrl)
    };
    var buildUrl = function(baseUrl) {
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('HostsIndexController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, MassChangeService, QueryStringService) {
    $rootScope.lastObjectName = null;
    SortService.setSort(QueryStringService.getValue('sort', 'Hoststatus.current_state'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Hoststatus: {
                current_state: QueryStringService.hoststate(),
                acknowledged: QueryStringService.getValue('has_been_acknowledged', !1) === '1',
                not_acknowledged: QueryStringService.getValue('has_not_been_acknowledged', !1) === '1',
                in_downtime: QueryStringService.getValue('in_downtime', !1) === '1',
                not_in_downtime: QueryStringService.getValue('not_in_downtime', !1) === '1',
                output: ''
            },
            Host: {
                id: QueryStringService.getIds('filter[Host.id][]', []),
                name: QueryStringService.getValue('filter[Host.name]', ''),
                description: '',
                keywords: '',
                not_keywords: '',
                address: QueryStringService.getValue('filter[Host.address]', ''),
                satellite_id: []
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/hosts/delete/';
    $scope.deactivateUrl = '/hosts/deactivate/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        lastHostUuid = null;
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
            'scroll': $scope.useScroll,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id][]': $scope.filter.Host.id,
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Host.description]': $scope.filter.Host.description,
            'filter[Hoststatus.output]': $scope.filter.Hoststatus.output,
            'filter[Hoststatus.current_state][]': $rootScope.currentStateForApi($scope.filter.Hoststatus.current_state),
            'filter[Host.keywords][]': $scope.filter.Host.keywords.split(','),
            'filter[Host.not_keywords][]': $scope.filter.Host.not_keywords.split(','),
            'filter[Hoststatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Hoststatus.scheduled_downtime_depth]': inDowntime,
            'filter[Host.address]': $scope.filter.Host.address,
            'filter[Host.satellite_id][]': $scope.filter.Host.satellite_id
        };
        if (QueryStringService.hasValue('BrowserContainerId')) {
            params.BrowserContainerId = QueryStringService.getValue('BrowserContainerId')
        }
        $http.get("/hosts/index.json", {
            params: params
        }).then(function(result) {
            $scope.hosts = result.data.all_hosts;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.selectAll = function() {
        if ($scope.hosts) {
            for (var key in $scope.hosts) {
                if ($scope.hosts[key].Host.allow_edit) {
                    var id = $scope.hosts[key].Host.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host) {
        var object = {};
        object[host.Host.id] = host.Host.hostname;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.hosts) {
            for (var id in selectedObjects) {
                if (id == $scope.hosts[key].Host.id) {
                    objects[id] = $scope.hosts[key].Host.hostname
                }
            }
        }
        return objects
    };
    $scope.getObjectsForExternalCommand = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.hosts) {
            for (var id in selectedObjects) {
                if (id == $scope.hosts[key].Host.id) {
                    objects[id] = $scope.hosts[key]
                }
            }
        }
        return objects
    };
    $scope.linkForCopy = function() {
        var baseUrl = '/hosts/copy/';
        return buildUrl(baseUrl)
    };
    $scope.linkForEditDetails = function() {
        var baseUrl = '/hosts/edit_details/';
        return buildUrl(baseUrl)
    };
    $scope.linkForAddToHostgroup = function() {
        var baseUrl = '/hostgroups/mass_add/';
        return buildUrl(baseUrl)
    };
    var buildUrl = function(baseUrl) {
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.linkForPdf = function() {
        var baseUrl = '/hosts/listToPdf.pdf?';
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
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Host.description]': $scope.filter.Host.description,
            'filter[Hoststatus.output]': $scope.filter.Hoststatus.output,
            'filter[Hoststatus.current_state][]': $rootScope.currentStateForApi($scope.filter.Hoststatus.current_state),
            'filter[Host.keywords][]': $scope.filter.Host.keywords.split(','),
            'filter[Host.not_keywords][]': $scope.filter.Host.not_keywords.split(','),
            'filter[Hoststatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Hoststatus.scheduled_downtime_depth]': inDowntime,
            'filter[Host.address]': $scope.filter.Host.address,
            'filter[Host.satellite_id][]': $scope.filter.Host.satellite_id
        };
        if (QueryStringService.hasValue('BrowserContainerId')) {
            params.BrowserContainerId = QueryStringService.getValue('BrowserContainerId')
        }
        return baseUrl + $httpParamSerializer(params)
    };
    $scope.problemsOnly = function() {
        defaultFilter();
        $scope.filter.Hoststatus.not_in_downtime = !0;
        $scope.filter.Hoststatus.not_acknowledged = !0;
        $scope.filter.Hoststatus.current_state = {
            up: !1,
            down: !0,
            unreachable: !0
        };
        SortService.setSort('Hoststatus.last_state_change');
        SortService.setDirection('desc')
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('HosttemplatesUsedByController', function($scope, $http, QueryStringService, MassChangeService) {
    $scope.id = QueryStringService.getCakeId();
    $scope.total = 0;
    $scope.hosttemplate = null;
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/hosts/delete/';
    $scope.load = function() {
        $http.get("/hosttemplates/usedBy/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.allHosts = result.data.all_hosts;
            $scope.hosttemplate = result.data.hosttemplate;
            $scope.total = result.data.all_hosts.length
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.selectAll = function() {
        if ($scope.allHosts) {
            for (var key in $scope.allHosts) {
                if ($scope.allHosts[key].Host.allow_edit) {
                    var id = $scope.allHosts[key].Host.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.allHosts) {
            for (var id in selectedObjects) {
                if (id == $scope.allHosts[key].Host.id) {
                    objects[id] = $scope.allHosts[key].Host.name
                }
            }
        }
        return objects
    };
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0);
    $scope.load()
});
angular.module('openITCOCKPIT').controller('Deleted_hostsIndexController', function($scope, $http, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'DeletedHost.created'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            DeletedHost: {
                name: QueryStringService.getValue('filter[DeletedHost.name]', '')
            }
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[DeletedHost.name]': $scope.filter.DeletedHost.name
        };
        $http.get("/deleted_hosts/index.json", {
            params: params
        }).then(function(result) {
            $scope.hosts = result.data.deletedHosts;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('HostsBrowserController', function($scope, $rootScope, $http, QueryStringService, SortService, $interval) {
    $scope.id = QueryStringService.getCakeId();
    $scope.activeTab = 'active';
    SortService.setSort('Servicestatus.current_state');
    SortService.setDirection('desc');
    $scope.currentPage = 1;
    $scope.deleteUrl = '/services/delete/';
    $scope.deactivateUrl = '/services/deactivate/';
    $scope.activateUrl = '/services/enable/';
    $scope.parentHostProblems = {};
    $scope.hasParentHostProblems = !1;
    $scope.showFlashSuccess = !1;
    $scope.canSubmitExternalCommands = !1;
    $scope.tags = [];
    $scope.pingResult = [];
    $scope.fakeServicestatus = {
        Servicestatus: {
            currentState: 5
        }
    };
    $scope.activeServiceFilter = {
        Servicestatus: {
            current_state: {
                ok: !1,
                warning: !1,
                critical: !1,
                unknown: !1
            },
            output: ''
        },
        Service: {
            name: QueryStringService.getValue('filter[Service.servicename]', '')
        }
    };
    $scope.init = !0;
    $scope.hostStatusTextClass = 'txt-primary';
    $scope.visTimeline = null;
    $scope.visTimelineInit = !0;
    $scope.visTimelineStart = -1;
    $scope.visTimelineEnd = -1;
    $scope.visTimeout = null;
    $scope.visChangeTimeout = null;
    $scope.showTimelineTab = !1;
    $scope.timelineIsLoading = !1;
    $scope.failureDurationInPercent = null;
    $scope.lastLoadDate = Date.now();
    $scope.selectedGrafanaTimerange = 'now-3h';
    $scope.selectedGrafanaAutorefresh = '60s';
    var flappingInterval;
    var graphStart = 0;
    var graphEnd = 0;
    $scope.showFlashMsg = function() {
        $scope.showFlashSuccess = !0;
        $scope.autoRefreshCounter = 5;
        var interval = $interval(function() {
            $scope.autoRefreshCounter--;
            if ($scope.autoRefreshCounter === 0) {
                $scope.loadHost();
                $interval.cancel(interval);
                $scope.showFlashSuccess = !1
            }
        }, 1000)
    };
    $scope.loadHost = function() {
        $scope.lastLoadDate = Date.now();
        $http.get("/hosts/browser/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.mergedHost = result.data.mergedHost;
            $scope.mergedHost.Host.disabled = parseInt($scope.mergedHost.Host.disabled, 10);
            $scope.tags = $scope.mergedHost.Host.tags.split(',');
            $scope.hoststatus = result.data.hoststatus;
            $scope.hoststateForIcon = {
                Hoststatus: $scope.hoststatus
            };
            $scope.mainContainer = result.data.mainContainer;
            $scope.sharedContainers = result.data.sharedContainers;
            $scope.hostStatusTextClass = getHoststatusTextColor();
            $scope.parenthosts = result.data.parenthosts;
            $scope.parentHoststatus = result.data.parentHostStatus;
            buildParentHostProblems();
            $scope.acknowledgement = result.data.acknowledgement;
            $scope.downtime = result.data.downtime;
            $scope.canSubmitExternalCommands = result.data.canSubmitExternalCommands;
            $scope.priorities = {
                1: !1,
                2: !1,
                3: !1,
                4: !1,
                5: !1
            };
            var priority = parseInt($scope.mergedHost.Host.priority, 10);
            for (var i = 1; i <= priority; i++) {
                $scope.priorities[i] = !0
            }
            $scope.load();
            $scope.loadGrafanaIframeUrl();
            $scope.init = !1
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
    $scope.changeTab = function(tab) {
        if (tab !== $scope.activeTab) {
            $scope.services = [];
            $scope.activeTab = tab;
            SortService.setSort('Service.servicename');
            SortService.setDirection('asc');
            $scope.currentPage = 1;
            $scope.load()
        }
    };
    $scope.load = function() {
        switch ($scope.activeTab) {
            case 'active':
                $scope.loadActiveServices();
                break;
            case 'notMonitored':
                $scope.loadNotMonitoredServices();
                break;
            case 'disabled':
                $scope.loadDisabledServices();
                break
        }
    };
    $scope.loadActiveServices = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.id,
            'filter[Service.servicename]': $scope.activeServiceFilter.Service.name,
            'filter[Servicestatus.output]': $scope.activeServiceFilter.Servicestatus.output,
            'filter[Servicestatus.current_state][]': $rootScope.currentStateForApi($scope.activeServiceFilter.Servicestatus.current_state),
            'filter[Service.disabled]': !1
        };
        $http.get("/services/index.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.services = result.data.all_services;
            $scope.paging = result.data.paging
        })
    };
    $scope.loadNotMonitoredServices = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.id
        };
        $http.get("/services/notMonitored.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.services = result.data.all_services;
            $scope.paging = result.data.paging
        })
    };
    $scope.loadDisabledServices = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.id
        };
        $http.get("/services/disabled.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.services = result.data.all_services;
            $scope.paging = result.data.paging
        })
    };
    $scope.getObjectForDelete = function(hostname, service) {
        var object = {};
        object[service.Service.id] = hostname + '/' + service.Service.servicename;
        return object
    };
    $scope.getObjectForDowntimeDelete = function() {
        var object = {};
        object[$scope.downtime.internalDowntimeId] = $scope.mergedHost.Host.name;
        return object
    };
    $scope.getObjectsForExternalCommand = function() {
        return [$scope.mergedHost]
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.mouseenter = function($event, hostUuid, service) {
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
        loadGraph(hostUuid, service)
    };
    $scope.mouseleave = function() {
        $('#serviceGraphContainer').hide();
        $('#serviceGraphFlot').html('')
    };
    var loadGraph = function(hostUuid, service) {
        var serverTime = new Date($scope.timezone.server_time);
        graphEnd = Math.floor(serverTime.getTime() / 1000);
        graphStart = graphEnd - (3600 * 4);
        $http.get('/Graphgenerators/getPerfdataByUuid.json', {
            params: {
                angular: !0,
                host_uuid: hostUuid,
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
    $scope.stateIsUp = function() {
        return parseInt($scope.hoststatus.currentState, 10) === 0
    };
    $scope.stateIsDown = function() {
        return parseInt($scope.hoststatus.currentState, 10) === 1
    };
    $scope.stateIsUnreachable = function() {
        return parseInt($scope.hoststatus.currentState, 10) === 2
    };
    $scope.stateIsNotInMonitoring = function() {
        return !$scope.hoststatus.isInMonitoring
    };
    $scope.startFlapping = function() {
        $scope.stopFlapping();
        flappingInterval = $interval(function() {
            if ($scope.flappingState === 0) {
                $scope.flappingState = 1
            } else {
                $scope.flappingState = 0
            }
        }, 750)
    };
    $scope.stopFlapping = function() {
        if (flappingInterval) {
            $interval.cancel(flappingInterval)
        }
        flappingInterval = null
    };
    $scope.ping = function() {
        $scope.pingResult = [];
        $scope.isPinging = !0;
        $http.get("/hosts/ping.json", {
            params: {
                'angular': !0,
                'id': $scope.id
            }
        }).then(function(result) {
            $scope.pingResult = result.data.output;
            $scope.isPinging = !1
        })
    };
    var getHoststatusTextColor = function() {
        switch ($scope.hoststatus.currentState) {
            case 0:
            case '0':
                return 'txt-color-green';
            case 1:
            case '1':
                return 'txt-color-red';
            case 2:
            case '2':
                return 'txt-color-blueLight'
        }
        return 'txt-primary'
    };
    var buildParentHostProblems = function() {
        $scope.hasParentHostProblems = !1;
        for (var key in $scope.parenthosts) {
            var parentHostUuid = $scope.parenthosts[key].uuid;
            if ($scope.parentHoststatus.hasOwnProperty(parentHostUuid)) {
                if ($scope.parentHoststatus[parentHostUuid].currentState > 0) {
                    $scope.parentHostProblems[parentHostUuid] = {
                        id: $scope.parenthosts[key].id,
                        name: $scope.parenthosts[key].name,
                        state: $scope.parentHoststatus[parentHostUuid].currentState
                    };
                    $scope.hasParentHostProblems = !0
                }
            }
        }
    };
    $scope.loadTimelineData = function(_properties) {
        var properties = _properties || {};
        var start = properties.start || -1;
        var end = properties.end || -1;
        $scope.timelineIsLoading = !0;
        if (start > $scope.visTimelineStart && end < $scope.visTimelineEnd) {
            $scope.timelineIsLoading = !1;
            return
        }
        $http.get("/hosts/timeline/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                start: start,
                end: end
            }
        }).then(function(result) {
            var timelinedata = {
                items: new vis.DataSet(result.data.statehistory),
                groups: new vis.DataSet(result.data.groups)
            };
            timelinedata.items.add(result.data.downtimes);
            timelinedata.items.add(result.data.notifications);
            timelinedata.items.add(result.data.acknowledgements);
            timelinedata.items.add(result.data.timeranges);
            $scope.visTimelineStart = result.data.start;
            $scope.visTimelineEnd = result.data.end;
            var options = {
                orientation: "both",
                start: new Date(result.data.start * 1000),
                end: new Date(result.data.end * 1000),
                min: new Date(new Date(result.data.start * 1000).setFullYear(new Date(result.data.start * 1000).getFullYear() - 1)),
                max: new Date(result.data.end * 1000),
                zoomMin: 1000 * 10 * 60 * 5,
                format: {
                    minorLabels: {
                        millisecond: 'SSS',
                        second: 's',
                        minute: 'H:mm',
                        hour: 'H:mm',
                        weekday: 'ddd D',
                        day: 'D',
                        week: 'w',
                        month: 'MMM',
                        year: 'YYYY'
                    },
                    majorLabels: {
                        millisecond: 'H:mm:ss',
                        second: 'D MMMM H:mm',
                        minute: 'DD.MM.YYYY',
                        hour: 'DD.MM.YYYY',
                        weekday: 'MMMM YYYY',
                        day: 'MMMM YYYY',
                        week: 'MMMM YYYY',
                        month: 'YYYY',
                        year: ''
                    }
                }
            };
            renderTimeline(timelinedata, options);
            $scope.timelineIsLoading = !1
        })
    };
    var renderTimeline = function(timelinedata, options) {
        var container = document.getElementById('visualization');
        if ($scope.visTimeline === null) {
            $scope.visTimeline = new vis.Timeline(container, timelinedata.items, timelinedata.groups, options);
            $scope.visTimeline.on('rangechanged', function(properties) {
                if ($scope.visTimelineInit) {
                    $scope.visTimelineInit = !1;
                    return
                }
                if ($scope.timelineIsLoading) {
                    console.warn('Timeline already loading date. Waiting for server result before sending next request.');
                    return
                }
                if ($scope.visTimeout) {
                    clearTimeout($scope.visTimeout)
                }
                $scope.visTimeout = setTimeout(function() {
                    $scope.visTimeout = null;
                    $scope.loadTimelineData({
                        start: parseInt(properties.start.getTime() / 1000, 10),
                        end: parseInt(properties.end.getTime() / 1000, 10)
                    })
                }, 500)
            })
        } else {
            $scope.visTimeline.setItems(timelinedata.items)
        }
        $scope.visTimeline.on('changed', function() {
            if ($scope.visTimelineInit) {
                return
            }
            if ($scope.visChangeTimeout) {
                clearTimeout($scope.visChangeTimeout)
            }
            $scope.visChangeTimeout = setTimeout(function() {
                $scope.visChangeTimeout = null;
                var timeRange = $scope.visTimeline.getWindow();
                var visTimelineStartAsTimestamp = new Date(timeRange.start).getTime();
                var visTimelineEndAsTimestamp = new Date(timeRange.end).getTime();
                var criticalItems = $scope.visTimeline.itemsData.get({
                    fields: ['start', 'end', 'className', 'group'],
                    type: {
                        start: 'Date',
                        end: 'Date'
                    },
                    filter: function(item) {
                        return (item.group == 5 && (item.className === 'bg-down' || item.className === 'bg-down-soft') && $scope.CheckIfItemInRange(visTimelineStartAsTimestamp, visTimelineEndAsTimestamp, item))
                    }
                });
                $scope.failureDurationInPercent = $scope.calculateFailures((visTimelineEndAsTimestamp - visTimelineStartAsTimestamp), criticalItems, visTimelineStartAsTimestamp, visTimelineEndAsTimestamp);
                $scope.$apply()
            }, 500)
        })
    };
    $scope.showTimeline = function() {
        $scope.showTimelineTab = !0;
        $scope.loadTimelineData()
    };
    $scope.hideTimeline = function() {
        $scope.showTimelineTab = !1
    };
    $scope.CheckIfItemInRange = function(start, end, item) {
        var itemStart = item.start.getTime();
        var itemEnd = item.end.getTime();
        if (itemEnd < start) {
            return !1
        } else if (itemStart > end) {
            return !1
        } else if (itemStart >= start && itemEnd <= end) {
            return !0
        } else if (itemStart >= start && itemEnd > end) {
            return !0
        } else if (itemStart < start && itemEnd > start && itemEnd < end) {
            return !0
        } else if (itemStart < start && itemEnd >= end) {
            return !0
        }
        return !1
    }
    $scope.calculateFailures = function(totalTime, criticalItems, start, end) {
        var failuresDuration = 0;
        criticalItems.forEach(function(criticalItem) {
            var itemStart = criticalItem.start.getTime();
            var itemEnd = criticalItem.end.getTime();
            failuresDuration += ((itemEnd > end) ? end : itemEnd) - ((itemStart < start) ? start : itemStart)
        });
        return (failuresDuration / totalTime * 100).toFixed(3)
    };
    $scope.loadGrafanaIframeUrl = function() {
        $http.get("/hosts/getGrafanaIframeUrlForDatepicker/.json", {
            params: {
                'uuid': $scope.mergedHost.Host.uuid,
                'angular': !0,
                'from': $scope.selectedGrafanaTimerange,
                'refresh': $scope.selectedGrafanaAutorefresh
            }
        }).then(function(result) {
            $scope.GrafanaDashboardExists = result.data.GrafanaDashboardExists;
            $scope.GrafanaIframeUrl = result.data.iframeUrl
        })
    };
    $scope.grafanaTimepickerCallback = function(selectedTimerange, selectedAutorefresh) {
        $scope.selectedGrafanaTimerange = selectedTimerange;
        $scope.selectedGrafanaAutorefresh = selectedAutorefresh;
        $scope.loadGrafanaIframeUrl()
    };
    $scope.loadHost();
    $scope.loadTimezone();
    SortService.setCallback($scope.load);
    $scope.$watch('activeServiceFilter', function() {
        if ($scope.init) {
            return
        }
        $scope.currentPage = 1;
        $scope.load()
    }, !0);
    $scope.$watch('hoststatus.isFlapping', function() {
        if ($scope.hoststatus) {
            if ($scope.hoststatus.hasOwnProperty('isFlapping')) {
                if ($scope.hoststatus.isFlapping === !0) {
                    $scope.startFlapping()
                }
                if ($scope.hoststatus.isFlapping === !1) {
                    $scope.stopFlapping()
                }
            }
        }
    })
});
angular.module('openITCOCKPIT').controller('ServicesNotMonitoredController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, MassChangeService, QueryStringService) {
    $rootScope.lastObjectName = null;
    SortService.setSort(QueryStringService.getValue('sort', 'Host.name'));
    SortService.setDirection(QueryStringService.getValue('direction', 'asc'));
    $scope.currentPage = 1;
    $scope.fakeServicestatus = {
        Servicestatus: {
            currentState: 5
        }
    };
    var defaultFilter = function() {
        $scope.filter = {
            Host: {
                name: ''
            },
            Service: {
                name: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/services/delete/';
    $scope.deactivateUrl = '/services/deactivate/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.serverResult = [];
    var lastHostUuid = null;
    var forTemplate = function(serverResponse) {
        var services = [];
        var hosts = [];
        var hostsstatusArr = [];
        var saved_hostuuids = [];
        var result = [];
        var lastendhost = "";
        var tmp_hostservicegroup = null;
        serverResponse.forEach(function(record) {
            services.push(record.Service);
            if (saved_hostuuids.indexOf(record.Host.uuid) < 0) {
                hosts.push(record.Host);
                hostsstatusArr.push({
                    host_id: record.Host.id,
                    Hoststatus: record.Hoststatus
                });
                saved_hostuuids.push(record.Host.uuid)
            }
        });
        services.forEach(function(service) {
            if (lastendhost != service.host_id) {
                if (tmp_hostservicegroup !== null) {
                    result.push(tmp_hostservicegroup)
                }
                tmp_hostservicegroup = {};
                var host = null;
                var hoststatus = null;
                hosts.forEach(function(hostelem) {
                    if (hostelem.id == service.host_id) {
                        host = hostelem
                    }
                });
                hostsstatusArr.forEach(function(hoststatelem) {
                    if (hoststatelem.host_id == service.host_id) {
                        hoststatus = hoststatelem.Hoststatus
                    }
                });
                tmp_hostservicegroup = {
                    Host: host,
                    Hoststatus: hoststatus,
                    Services: []
                };
                lastendhost = service.host_id
            }
            tmp_hostservicegroup.Services.push({
                Service: service
            })
        });
        if (tmp_hostservicegroup !== null) {
            result.push(tmp_hostservicegroup)
        }
        return result
    };
    $scope.load = function() {
        lastHostUuid = null;
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Service.servicename]': $scope.filter.Service.name
        };
        $http.get("/services/notMonitored.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.serverResult = result.data.all_services;
            $scope.services = forTemplate(result.data.all_services);
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.isNextHost = function(service) {
        if (service.Host.uuid !== lastHostUuid) {
            lastHostUuid = service.Host.uuid;
            return !0
        }
        return !1
    };
    $scope.selectAll = function() {
        if ($scope.services) {
            for (var key in $scope.serverResult) {
                if ($scope.serverResult[key].Service.allow_edit) {
                    var id = $scope.serverResult[key].Service.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host, service) {
        var object = {};
        object[service.Service.id] = host.Host.hostname + '/' + service.Service.servicename;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.serverResult) {
            for (var id in selectedObjects) {
                if (id == $scope.serverResult[key].Service.id) {
                    objects[id] = $scope.serverResult[key].Host.hostname + '/' + $scope.serverResult[key].Service.servicename
                }
            }
        }
        return objects
    };
    $scope.linkForCopy = function() {
        var baseUrl = '/services/copy/';
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('SatellitesIndexController', function($scope, $http, SortService, MassChangeService) {
    SortService.setSort('Satellite.name');
    SortService.setDirection('asc');
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            Satellite: {
                name: '',
                address: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/distribute_module/satellites/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/distribute_module/satellites/index.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Satellite.name]': $scope.filter.Satellite.name,
                'filter[Satellite.address]': $scope.filter.Satellite.address
            }
        }).then(function(result) {
            $scope.satellites = result.data.satellites;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.selectAll = function() {
        if ($scope.satellites) {
            for (var key in $scope.satellites) {
                var id = $scope.satellites[key].Satellite.id;
                $scope.massChange[id] = !0
            }
        }
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.satellites) {
            for (var id in selectedObjects) {
                if (id == $scope.satellites[key].Satellite.id) {
                    objects[id] = $scope.satellites[key].Satellite.name
                }
            }
        }
        return objects
    };
    $scope.getObjectForDelete = function(satellite) {
        var object = {};
        object[satellite.Satellite.id] = satellite.Satellite.name;
        return object
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.getObjectForDelete = function(satellite) {
        var object = {};
        object[satellite.Satellite.id] = satellite.Satellite.name;
        return object
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('HostgroupsEditController', function($scope, $http, QueryStringService) {
    $scope.post = {
        Container: {
            name: '',
            parent_id: 0
        },
        Hostgroup: {
            description: '',
            hostgroup_url: '',
            Host: [],
            Hosttemplate: []
        }
    };
    $scope.id = QueryStringService.getCakeId();
    $scope.deleteUrl = "/hostgroups/delete/" + $scope.id + ".json?angular=true";
    $scope.sucessUrl = '/hostgroups/index';
    $scope.init = !0;
    $scope.load = function() {
        $http.get("/hostgroups/edit/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.hostgroup = result.data.hostgroup;
            var selectedHosts = [];
            var selectedHosttemplates = [];
            var key;
            for (key in $scope.hostgroup.Host) {
                selectedHosts.push(parseInt($scope.hostgroup.Host[key].id, 10))
            }
            for (key in $scope.hostgroup.Hosttemplate) {
                selectedHosttemplates.push(parseInt($scope.hostgroup.Hosttemplate[key].id, 10))
            }
            $scope.post.Hostgroup.Host = selectedHosts;
            $scope.post.Hostgroup.Hosttemplate = selectedHosttemplates;
            $scope.post.Container.name = $scope.hostgroup.Container.name;
            $scope.post.Container.parent_id = parseInt($scope.hostgroup.Container.parent_id, 10);
            $scope.post.Hostgroup.description = $scope.hostgroup.Hostgroup.description;
            $scope.post.Hostgroup.hostgroup_url = $scope.hostgroup.Hostgroup.hostgroup_url;
            $scope.init = !1
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.loadContainers = function() {
        $http.get("/hostgroups/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.load()
        })
    };
    $scope.loadHosts = function(searchString) {
        $http.get("/hostgroups/loadHosts.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Container.parent_id,
                'filter[Host.name]': searchString,
                'selected[]': $scope.post.Hostgroup.Host
            }
        }).then(function(result) {
            $scope.hosts = result.data.hosts
        })
    };
    $scope.loadHosttemplates = function(searchString) {
        $http.get("/hostgroups/loadHosttemplates.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Container.parent_id,
                'filter[Hosttemplate.name]': searchString,
                'selected[]': $scope.post.Hostgroup.Hosttemplate
            }
        }).then(function(result) {
            $scope.hosttemplates = result.data.hosttemplates
        })
    };
    $scope.submit = function() {
        $http.post("/hostgroups/edit/" + $scope.id + ".json?angular=true", $scope.post).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/hostgroups/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.$watch('post.Container.parent_id', function() {
        if ($scope.init) {
            return
        }
        $scope.loadHosts('');
        $scope.loadHosttemplates('')
    }, !0);
    $scope.loadContainers()
});
angular.module('openITCOCKPIT').controller('ConfigurationFilesIndexController', function() {});
angular.module('openITCOCKPIT').controller('ServicechecksIndexController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Servicecheck.start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Servicecheck: {
                state: {
                    ok: !1,
                    warning: !1,
                    critical: !1,
                    unknown: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: '',
                perfdata: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var state_type = '';
        if ($scope.filter.Servicecheck.state_types.soft ^ $scope.filter.Servicecheck.state_types.hard) {
            state_type = 0;
            if ($scope.filter.Servicecheck.state_types.hard === !0) {
                state_type = 1
            }
        }
        $http.get("/servicechecks/index/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Servicecheck.output]': $scope.filter.Servicecheck.output,
                'filter[Servicecheck.state][]': $rootScope.currentStateForApi($scope.filter.Servicecheck.state),
                'filter[Servicecheck.state_type]': state_type,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.servicechecks = result.data.all_servicechecks;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ServicesServiceListController', function($scope, $http, SortService, MassChangeService, QueryStringService) {
    SortService.setSort('Servicestatus.current_state');
    SortService.setDirection('desc');
    $scope.currentPage = 1;
    $scope.hostId = QueryStringService.getCakeId();
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/services/delete/';
    $scope.deactivateUrl = '/services/deactivate/';
    $scope.activateUrl = '/services/enable/';
    $scope.activeTab = 'active';
    $scope.fakeServicestatus = {
        Servicestatus: {
            currentState: 5
        }
    };
    var graphStart = 0;
    var graphEnd = 0;
    $scope.changeTab = function(tab) {
        if (tab !== $scope.activeTab) {
            $scope.services = [];
            $scope.activeTab = tab;
            $scope.undoSelection();
            SortService.setSort('Service.servicename');
            SortService.setDirection('asc');
            $scope.currentPage = 1;
            if ($scope.activeTab === 'deleted') {
                SortService.setSort('DeletedService.name')
            }
            $scope.load()
        }
    };
    $scope.load = function() {
        switch ($scope.activeTab) {
            case 'active':
                $scope.loadActiveServices();
                break;
            case 'notMonitored':
                $scope.loadNotMonitoredServices();
                break;
            case 'disabled':
                $scope.loadDisabledServices();
                break;
            case 'deleted':
                $scope.loadDeletedServices();
                break
        }
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
    $scope.loadHost = function() {
        $http.get("/hosts/loadHostById/" + $scope.hostId + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.host = result.data.host
        })
    };
    $scope.loadActiveServices = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.hostId
        };
        $http.get("/services/index.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.services = result.data.all_services;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.loadNotMonitoredServices = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.hostId
        };
        $http.get("/services/notMonitored.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.services = result.data.all_services;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.loadDisabledServices = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.hostId
        };
        $http.get("/services/disabled.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.services = result.data.all_services;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.loadDeletedServices = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[DeletedService.host_id]': $scope.hostId
        };
        $http.get("/services/deleted.json", {
            params: params
        }).then(function(result) {
            $scope.deletedServices = [];
            $scope.deletedServices = result.data.all_services;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.loadHosts = function(searchString) {
        $http.get("/hosts/loadHostsByString.json", {
            params: {
                'angular': !0,
                'filter[Host.name]': searchString,
                'selected[]': $scope.hostId
            }
        }).then(function(result) {
            $scope.hosts = result.data.hosts
        })
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.selectAll = function() {
        if ($scope.services) {
            for (var key in $scope.services) {
                if ($scope.services[key].Service.allow_edit) {
                    var id = $scope.services[key].Service.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host, service) {
        var object = {};
        object[service.Service.id] = host.Host.name + '/' + service.Service.servicename;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.services) {
            for (var id in selectedObjects) {
                if (id == $scope.services[key].Service.id) {
                    objects[id] = $scope.services[key].Host.hostname + '/' + $scope.services[key].Service.servicename
                }
            }
        }
        return objects
    };
    $scope.getObjectsForExternalCommand = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.services) {
            for (var id in selectedObjects) {
                if (id == $scope.services[key].Service.id) {
                    objects[id] = $scope.services[key]
                }
            }
        }
        return objects
    };
    $scope.linkForCopy = function() {
        var baseUrl = '/services/copy/';
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.linkForAddToServicegroup = function() {
        var baseUrl = '/servicegroups/mass_add/';
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
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
                host_uuid: host.Host.uuid,
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
    $scope.$watch('hostId', function() {
        $scope.loadHost();
        $scope.load()
    });
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0);
    $scope.loadTimezone();
    SortService.setCallback($scope.load);
    $scope.loadHosts('')
});
angular.module('openITCOCKPIT').controller('NotificationsIndexController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'NotificationHost.start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Notification: {
                state: {
                    recovery: !1,
                    down: !1,
                    unreachable: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: '',
                contactname: '',
                hostname: '',
                commandname: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/notifications/index.json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[NotificationHost.output]': $scope.filter.Notification.output,
                'filter[NotificationHost.state][]': $rootScope.currentStateForApi($scope.filter.Notification.state),
                'filter[Contact.name]': $scope.filter.Notification.contactname,
                'filter[Command.name]': $scope.filter.Notification.commandname,
                'filter[Host.name]': $scope.filter.Notification.hostname,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.notifications = result.data.all_notifications;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('NotificationsHostNotificationController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'NotificationHost.start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    $scope.useScroll = !0;
    var now = new Date();
    var defaultFilter = function() {
        $scope.filter = {
            Notification: {
                state: {
                    recovery: !1,
                    down: !1,
                    unreachable: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: '',
                author: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/notifications/hostNotification/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[NotificationHost.output]': $scope.filter.Notification.output,
                'filter[NotificationHost.state][]': $rootScope.currentStateForApi($scope.filter.Notification.state),
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.notifications = result.data.all_notifications;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ContainersIndexController', function($scope, $http, $timeout) {
    $scope.init = !0;
    $scope.selectedTenant = null;
    $scope.selectedTenantForNode = null;
    $scope.errors = null;
    $scope.isDeleting = !1;
    $scope.resetAddEditFields = function() {
        $scope.edit = {
            Container: {
                id: null,
                containertype_id: 5,
                name: null,
                parent_id: null
            }
        };
        $scope.add = {
            Container: {
                parent_id: null,
                name: null,
                containertype_id: '5'
            }
        }
    };
    $scope.load = function() {
        $scope.resetAddEditFields();
        $scope.loadContainers()
    };
    $scope.saveNewNode = function() {
        $http.post("/containers/add.json?angular=true", $scope.add).then(function(result) {
            $('#angularAddNodeModal').modal('hide');
            $scope.load();
            $scope.errors = null
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadTenants = function() {
        $http.get("/tenants/index.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.tenants = result.data.all_tenants;
            $scope.init = !1
        })
    };
    $scope.loadContainers = function() {
        $http.get('/containers/byTenant/' + $scope.selectedTenant + '.json', {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.nest;
            $('#nestable').nestable({
                noDragClass: 'dd-nodrag'
            })
        })
    };
    $scope.updateNode = function() {
        $http.post("/containers/edit.json?angular=true", $scope.edit).then(function(result) {
            $scope.load();
            $('#angularEditNodeModal').modal('hide')
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.deleteNode = function() {
        $scope.isDeleting = !0;
        $http.post('/containers/delete/' + $scope.edit.Container.id).then(function(result) {
            $scope.load();
            $('#angularEditNodeModal').modal('hide');
            $scope.isDeleting = !1
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
            $scope.isDeleting = !1
        })
    };
    $scope.openEditNode = function(container) {
        $scope.edit.Container.id = parseInt(container.id);
        $scope.edit.Container.parent_id = parseInt(container.parent_id);
        $scope.edit.Container.name = container.name;
        $('#angularEditNodeModal').modal('show')
    };
    $scope.openAddNode = function(parent_id) {
        $scope.add.Container.parent_id = parseInt(parent_id);
        $('#angularAddNodeModal').modal('show')
    };
    $scope.loadTenants();
    $scope.$watch('selectedTenant', function() {
        if ($scope.selectedTenant !== null) {
            for (var key in $scope.tenants) {
                if ($scope.tenants[key].Tenant.container_id == $scope.selectedTenant) {
                    $scope.tenant = $scope.tenants[key]
                }
            }
            $scope.load()
        }
    })
});
angular.module('openITCOCKPIT').controller('ServicegroupsIndexController', function($scope, $http, SortService, MassChangeService) {
    SortService.setSort('Container.name');
    SortService.setDirection('asc');
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            container: {
                name: ''
            },
            servicegroup: {
                description: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/servicegroups/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/servicegroups/index.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Container.name]': $scope.filter.container.name,
                'filter[Servicegroup.description]': $scope.filter.servicegroup.description
            }
        }).then(function(result) {
            $scope.servicegroups = result.data.all_servicegroups;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.selectAll = function() {
        if ($scope.servicegroups) {
            for (var key in $scope.servicegroups) {
                if ($scope.servicegroups[key].Servicegroup.allowEdit) {
                    var id = $scope.servicegroups[key].Servicegroup.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.servicegroups) {
            for (var id in selectedObjects) {
                if (id == $scope.servicegroups[key].Servicegroup.id) {
                    objects[id] = $scope.servicegroups[key].Container.name
                }
            }
        }
        return objects
    };
    $scope.linkForPdf = function() {
        var baseUrl = '/servicegroups/listToPdf.pdf';
        baseUrl += '?filter[Container.name]=' + encodeURI($scope.filter.container.name);
        baseUrl += '&filter[Servicegroup.description]=' + encodeURI($scope.filter.servicegroup.description);
        return baseUrl
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.deleteSelected = function() {
        console.log('Delete');
        console.log()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('SystemdowntimesAddServicedowntimeController', function($scope, $http, QueryStringService) {
    $scope.init = !0;
    $scope.errors = null;
    $scope.serviceIds = [];
    $scope.serviceIds.push(QueryStringService.getCakeId().toString());
    $scope.Downtime = {
        is_recurring: !1
    };
    $scope.post = {
        params: {
            'angular': !0
        },
        Systemdowntime: {
            is_recurring: !1,
            weekdays: {},
            day_of_month: null,
            from_date: null,
            from_time: null,
            to_date: null,
            to_time: null,
            duration: null,
            downtimetype: 'service',
            objecttype_id: 2048,
            object_id: null,
            comment: null
        }
    };
    $scope.loadRefillData = function() {
        $http.get("/angular/getDowntimeData.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.Systemdowntime.from_date = result.data.refill.from_date;
            $scope.post.Systemdowntime.from_time = result.data.refill.from_time;
            $scope.post.Systemdowntime.to_date = result.data.refill.to_date;
            $scope.post.Systemdowntime.to_time = result.data.refill.to_time;
            $scope.post.Systemdowntime.comment = result.data.refill.comment;
            $scope.post.Systemdowntime.duration = result.data.refill.duration;
            $scope.errors = null
        }, function errorCallback(result) {
            console.error(result);
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadRefillData();
    $scope.saveNewServiceDowntime = function() {
        $scope.post.Systemdowntime.object_id = $scope.serviceIds;
        if ($scope.post.Systemdowntime.is_recurring) {
            $scope.post.Systemdowntime.to_time = null;
            $scope.post.Systemdowntime.to_date = null;
            $scope.post.Systemdowntime.from_date = null
        }
        $http.post("/systemdowntimes/addServicedowntime.json?angular=true", $scope.post).then(function(result) {
            $scope.errors = null;
            if ($scope.post.Systemdowntime.is_recurring) {
                window.location.href = '/systemdowntimes/service'
            } else {
                window.location.href = '/downtimes/service'
            }
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error[0]
            }
        })
    };
    $scope.loadServices = function(searchString) {
        $http.get("/services/loadServicesByString.json", {
            params: {
                'angular': !0,
                'filter[Host.name]': searchString,
                'filter[Service.servicename]': searchString,
                'selected[]': $scope.serviceIds
            }
        }).then(function(result) {
            $scope.services = [];
            result.data.services.forEach(function(obj, index) {
                var serviceName = obj.value.Service.name;
                if (serviceName === null) {
                    serviceName = obj.value.Servicetemplate.name
                }
                $scope.services[index] = {
                    id: obj.value.Service.id,
                    group: obj.value.Host.name,
                    label: obj.value.Host.name + "/" + serviceName
                }
            })
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadServices('');
    $scope.$watch('Downtime.is_recurring', function() {
        if ($scope.Downtime.is_recurring === !0) {
            $scope.post.Systemdowntime.is_recurring = 1;
            if ($scope.errors && $scope.errors.from_time) {
                delete $scope.errors.from_time
            }
        }
        if ($scope.Downtime.is_recurring === !1) {
            $scope.post.Systemdowntime.is_recurring = 0
        }
    })
});
angular.module('openITCOCKPIT').controller('DowntimesServiceController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService, MassChangeService, $interval) {
    SortService.setSort(QueryStringService.getValue('sort', 'DowntimeService.scheduled_start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            DowntimeService: {
                author_name: '',
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
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2)),
            isRunning: !1,
            hideExpired: !0
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/downtimes/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var wasCancelled = '';
        if ($scope.filter.DowntimeService.was_cancelled ^ $scope.filter.DowntimeService.was_not_cancelled) {
            wasCancelled = $scope.filter.DowntimeService.was_cancelled === !0
        }
        $http.get("/downtimes/service.json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[DowntimeService.author_name]': $scope.filter.DowntimeService.author_name,
                'filter[DowntimeService.comment_data]': $scope.filter.DowntimeService.comment_data,
                'filter[DowntimeService.was_cancelled]': wasCancelled,
                'filter[Host.name]': $scope.filter.Host.name,
                'filter[Service.name]': $scope.filter.Service.name,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to,
                'filter[hideExpired]': $scope.filter.hideExpired,
                'filter[isRunning]': $scope.filter.isRunning
            }
        }).then(function(result) {
            $scope.downtimes = result.data.all_service_downtimes;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    $scope.selectAll = function() {
        if ($scope.downtimes) {
            for (var key in $scope.downtimes) {
                if ($scope.downtimes[key].DowntimeService.allowEdit && $scope.downtimes[key].DowntimeService.isCancellable) {
                    var id = $scope.downtimes[key].DowntimeService.internalDowntimeId;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(downtime) {
        var object = {};
        object[downtime.DowntimeService.internalDowntimeId] = downtime.Service.name;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.downtimes) {
            for (var id in selectedObjects) {
                if (id == $scope.downtimes[key].DowntimeService.internalDowntimeId) {
                    objects[id] = $scope.downtimes[key].Service.name
                }
            }
        }
        return objects
    };
    $scope.showServiceDowntimeFlashMsg = function() {
        $scope.showFlashSuccess = !0;
        $scope.autoRefreshCounter = 5;
        var interval = $interval(function() {
            $scope.autoRefreshCounter--;
            if ($scope.autoRefreshCounter === 0) {
                $scope.load();
                $interval.cancel(interval);
                $scope.showFlashSuccess = !1
            }
        }, 1000)
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ServicegroupsExtendedController', function($scope, $http, $interval, QueryStringService) {
    $scope.init = !0;
    $scope.servicegroupsStateFilter = {};
    $scope.deleteUrl = '/services/delete/';
    $scope.deactivateUrl = '/services/deactivate/';
    $scope.activateUrl = '/services/enable/';
    $scope.post = {
        Servicegroup: {
            id: null
        }
    };
    $scope.post.Servicegroup.id = QueryStringService.getCakeId().toString();
    var graphStart = 0;
    var graphEnd = 0;
    $scope.load = function() {
        $http.get("/servicegroups/extended.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.servicegroups = result.data.servicegroups;
            if (isNaN($scope.post.Servicegroup.id)) {
                if ($scope.servicegroups.length > 0) {
                    $scope.post.Servicegroup.id = $scope.servicegroups[0].Servicegroup.id
                }
            } else {
                $scope.loadServicesWithStatus()
            }
            $scope.init = !1
        })
    };
    $scope.loadServicesWithStatus = function() {
        if ($scope.post.Servicegroup.id) {
            $http.get("/servicegroups/loadServicegroupWithServicesById/" + $scope.post.Servicegroup.id + ".json", {
                params: {
                    'angular': !0
                }
            }).then(function(result) {
                $scope.servicegroup = result.data.servicegroup;
                $scope.servicegroupsStateFilter = {
                    0: !0,
                    1: !0,
                    2: !0,
                    3: !0
                }
            })
        }
    };
    $scope.getObjectForDelete = function(host, service) {
        var object = {};
        object[service.Service.id] = host.hostname + '/' + service.Service.servicename;
        return object
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
    $scope.loadTimezone = function() {
        $http.get("/angular/user_timezone.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.timezone = result.data.timezone
        })
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
    $scope.getObjectsForExternalCommand = function() {
        var objects = {};
        if ($scope.post.Servicegroup.id) {
            for (var key in $scope.servicegroup.Services) {
                if ($scope.servicegroup.Services[key].Service.allow_edit) {
                    objects[$scope.servicegroup.Services[key].Service.id] = $scope.servicegroup.Services[key]
                }
            }
        }
        return objects
    };
    $scope.getNotOkObjectsForExternalCommand = function() {
        var objects = {};
        if ($scope.post.Servicegroup.id) {
            for (var key in $scope.servicegroup.Services) {
                if ($scope.servicegroup.Services[key].Service.allow_edit && $scope.servicegroup.Services[key].Servicestatus.currentState > 0) {
                    objects[$scope.servicegroup.Services[key].Service.id] = $scope.servicegroup.Services[key]
                }
            }
        }
        return objects
    };
    $scope.getObjectsForNotificationsExternalCommand = function(notificationsEnabled) {
        var objects = {};
        if ($scope.post.Servicegroup.id) {
            for (var key in $scope.servicegroup.Services) {
                if ($scope.servicegroup.Services[key].Service.allow_edit && $scope.servicegroup.Services[key].Servicestatus.notifications_enabled === notificationsEnabled) {
                    objects[$scope.servicegroup.Services[key].Service.id] = $scope.servicegroup.Services[key]
                }
            }
        }
        return objects
    };
    $scope.showFlashMsg = function() {
        $scope.showFlashSuccess = !0;
        $scope.autoRefreshCounter = 5;
        var interval = $interval(function() {
            $scope.autoRefreshCounter--;
            if ($scope.autoRefreshCounter === 0) {
                $scope.loadServicesWithStatus('');
                $interval.cancel(interval);
                $scope.showFlashSuccess = !1
            }
        }, 1000)
    };
    $scope.loadTimezone();
    $scope.load();
    $scope.$watch('post.Servicegroup.id', function() {
        if ($scope.init) {
            return
        }
        $scope.loadServicesWithStatus('')
    }, !0)
});
angular.module('openITCOCKPIT').controller('LayoutController', function($scope, $http) {});
angular.module('openITCOCKPIT').controller('BrowsersIndexController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, MassChangeService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Hoststatus.current_state'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.containerId = parseInt(QueryStringService.getValue('containerId', 1), 10);
    $scope.containers = [];
    $scope.containerFilter = '';
    $scope.recursiveBrowser = !1;
    var defaultFilter = function() {
        $scope.filter = {
            Hoststatus: {
                current_state: QueryStringService.hoststate(),
                acknowledged: QueryStringService.getValue('has_been_acknowledged', !1) === '1',
                not_acknowledged: QueryStringService.getValue('has_not_been_acknowledged', !1) === '1',
                in_downtime: QueryStringService.getValue('in_downtime', !1) === '1',
                not_in_downtime: QueryStringService.getValue('not_in_downtime', !1) === '1',
                output: ''
            },
            Host: {
                name: QueryStringService.getValue('filter[Host.name]', ''),
                keywords: '',
                address: QueryStringService.getValue('filter[Host.address]', ''),
                satellite_id: []
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/hosts/delete/';
    $scope.deactivateUrl = '/hosts/deactivate/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/browsers/index/" + $scope.containerId + ".json", {
            params: {
                angular: !0
            }
        }).then(function(result) {
            $scope.init = !1;
            $scope.containersFromApi = result.data.containers;
            $scope.containers = $scope.containersFromApi;
            $scope.recursiveBrowser = result.data.recursiveBrowser;
            $scope.breadcrumbs = result.data.breadcrumbs;
            $scope.loadHosts();
            $scope.loadStatusCounts()
        })
    };
    $scope.loadHosts = function() {
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
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Hoststatus.output]': $scope.filter.Hoststatus.output,
            'filter[Hoststatus.current_state][]': $rootScope.currentStateForApi($scope.filter.Hoststatus.current_state),
            'filter[Host.keywords][]': $scope.filter.Host.keywords.split(','),
            'filter[Hoststatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Hoststatus.scheduled_downtime_depth]': inDowntime,
            'filter[Host.address]': $scope.filter.Host.address,
            'filter[Host.satellite_id][]': $scope.filter.Host.satellite_id,
            'BrowserContainerId': $scope.containerId
        };
        $http.get("/hosts/index.json", {
            params: params
        }).then(function(result) {
            $scope.hosts = result.data.all_hosts;
            $scope.paging = result.data.paging
        }, function errorCallback(result) {
            console.log(result);
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
            if (result.status === 403) {
                window.location.href = '/angular/forbidden'
            }
        })
    };
    $scope.loadStatusCounts = function() {
        $http.get("/angular/statuscount.json", {
            params: {
                angular: !0,
                'containerIds[]': $scope.containerId,
                'recursive': $scope.recursiveBrowser
            }
        }).then(function(result) {
            $scope.hoststatusCountHash = result.data.hoststatusCount;
            $scope.servicestatusCountHash = result.data.servicestatusCount;
            $scope.hoststatusSum = result.data.hoststatusSum;
            $scope.servicestatusSum = result.data.servicestatusSum;
            $scope.hoststatusCountPercentage = result.data.hoststatusCountPercentage;
            $scope.servicestatusCountPercentage = result.data.servicestatusCountPercentage
        })
    };
    $scope.changeContainerId = function(containerId) {
        $scope.containerId = containerId;
        $scope.load()
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.selectAll = function() {
        if ($scope.hosts) {
            for (var key in $scope.hosts) {
                if ($scope.hosts[key].Host.allow_edit) {
                    var id = $scope.hosts[key].Host.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host) {
        var object = {};
        object[host.Host.id] = host.Host.hostname;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.hosts) {
            for (var id in selectedObjects) {
                if (id == $scope.hosts[key].Host.id) {
                    objects[id] = $scope.hosts[key].Host.hostname
                }
            }
        }
        return objects
    };
    $scope.getObjectsForExternalCommand = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.hosts) {
            for (var id in selectedObjects) {
                if (id == $scope.hosts[key].Host.id) {
                    objects[id] = $scope.hosts[key]
                }
            }
        }
        return objects
    };
    $scope.linkForCopy = function() {
        var baseUrl = '/hosts/copy/';
        return buildUrl(baseUrl)
    };
    $scope.linkForEditDetails = function() {
        var baseUrl = '/hosts/edit_details/';
        return buildUrl(baseUrl)
    };
    $scope.linkForAddToHostgroup = function() {
        var baseUrl = '/hostgroups/mass_add/';
        return buildUrl(baseUrl)
    };
    var buildUrl = function(baseUrl) {
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0);
    $scope.$watch('containerFilter', function() {
        var searchString = $scope.containerFilter.toLowerCase();
        if (searchString === '') {
            $scope.containers = $scope.containersFromApi;
            return !0
        }
        $scope.containers = [];
        for (var key in $scope.containersFromApi) {
            var containerName = $scope.containersFromApi[key].value.toLowerCase();
            if (containerName.match(searchString)) {
                $scope.containers.push($scope.containersFromApi[key])
            }
        }
    }, !0)
});
angular.module('openITCOCKPIT').controller('ServicesDisabledController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, MassChangeService, QueryStringService) {
    $rootScope.lastObjectName = null;
    SortService.setSort(QueryStringService.getValue('sort', 'Host.name'));
    SortService.setDirection(QueryStringService.getValue('direction', 'asc'));
    $scope.currentPage = 1;
    $scope.fakeServicestatus = {
        Servicestatus: {
            currentState: 5
        }
    };
    var defaultFilter = function() {
        $scope.filter = {
            Host: {
                name: ''
            },
            Service: {
                name: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/services/delete/';
    $scope.activateUrl = '/services/enable/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.serverResult = [];
    var lastHostUuid = null;
    var forTemplate = function(serverResponse) {
        var services = [];
        var hosts = [];
        var hostsstatusArr = [];
        var saved_hostuuids = [];
        var result = [];
        var lastendhost = "";
        var tmp_hostservicegroup = null;
        serverResponse.forEach(function(record) {
            services.push(record.Service);
            if (saved_hostuuids.indexOf(record.Host.uuid) < 0) {
                hosts.push(record.Host);
                hostsstatusArr.push({
                    host_id: record.Host.id,
                    Hoststatus: record.Hoststatus
                });
                saved_hostuuids.push(record.Host.uuid)
            }
        });
        services.forEach(function(service) {
            if (lastendhost != service.host_id) {
                if (tmp_hostservicegroup !== null) {
                    result.push(tmp_hostservicegroup)
                }
                tmp_hostservicegroup = {};
                var host = null;
                var hoststatus = null;
                hosts.forEach(function(hostelem) {
                    if (hostelem.id == service.host_id) {
                        host = hostelem
                    }
                });
                hostsstatusArr.forEach(function(hoststatelem) {
                    if (hoststatelem.host_id == service.host_id) {
                        hoststatus = hoststatelem.Hoststatus
                    }
                });
                tmp_hostservicegroup = {
                    Host: host,
                    Hoststatus: hoststatus,
                    Services: []
                };
                lastendhost = service.host_id
            }
            tmp_hostservicegroup.Services.push({
                Service: service
            })
        });
        if (tmp_hostservicegroup !== null) {
            result.push(tmp_hostservicegroup)
        }
        return result
    };
    $scope.load = function() {
        lastHostUuid = null;
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Service.servicename]': $scope.filter.Service.name
        };
        $http.get("/services/disabled.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.serverResult = result.data.all_services;
            $scope.services = forTemplate(result.data.all_services);
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.isNextHost = function(service) {
        if (service.Host.uuid !== lastHostUuid) {
            lastHostUuid = service.Host.uuid;
            return !0
        }
        return !1
    };
    $scope.selectAll = function() {
        if ($scope.services) {
            for (var key in $scope.serverResult) {
                if ($scope.serverResult[key].Service.allow_edit) {
                    var id = $scope.serverResult[key].Service.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host, service) {
        var object = {};
        object[service.Service.id] = host.Host.hostname + '/' + service.Service.servicename;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.serverResult) {
            for (var id in selectedObjects) {
                if (id == $scope.serverResult[key].Service.id) {
                    objects[id] = $scope.serverResult[key].Host.hostname + '/' + $scope.serverResult[key].Service.servicename
                }
            }
        }
        return objects
    };
    $scope.linkForCopy = function() {
        var baseUrl = '/services/copy/';
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('TenantsAddController', function($scope, $http) {
    $scope.post = {
        Tenant: {
            id: '',
            description: '',
            is_active: '',
            firstname: '',
            lastname: '',
            street: '',
            zipcode: '',
            city: '',
            max_users: 0,
        },
        Container: {
            name: '',
            containertype_id: '',
            parent_id: []
        }
    };
    $scope.submit = function() {
        $http.post("/tenants/add.json?angular=true", $scope.post).then(function(result) {
            window.location.href = '/tenants/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    }
});
angular.module('openITCOCKPIT').controller('HostgroupsExtendedController', function($scope, $http, $interval, QueryStringService) {
    $scope.init = !0;
    $scope.servicegroupsStateFilter = {};
    $scope.deleteUrl = '/hosts/delete/';
    $scope.deactivateUrl = '/hosts/deactivate/';
    $scope.post = {
        Hostgroup: {
            id: null
        }
    };
    $scope.post.Hostgroup.id = QueryStringService.getCakeId();
    $scope.showServices = {};
    var defaultFilter = function() {
        $scope.filter = {
            Host: {
                name: ''
            }
        }
    };
    $scope.load = function() {
        $http.get("/hostgroups/loadHostgroupsByString.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.hostgroups = result.data.hostgroups;
            if (isNaN($scope.post.Hostgroup.id)) {
                if ($scope.hostgroups.length > 0) {
                    $scope.post.Hostgroup.id = $scope.hostgroups[0].key
                }
            } else {
                $scope.loadHostsWithStatus()
            }
            $scope.init = !1
        })
    };
    $scope.loadHostgroupsCallback = function(searchString) {
        $http.get("/hostgroups/loadHostgroupsByString.json", {
            params: {
                'angular': !0,
                'filter[Container.name]': searchString,
            }
        }).then(function(result) {
            $scope.hostgroups = result.data.hostgroups
        })
    };
    $scope.loadHostsWithStatus = function() {
        if ($scope.post.Hostgroup.id) {
            $http.get("/hostgroups/loadHostgroupWithHostsById/" + $scope.post.Hostgroup.id + ".json", {
                params: {
                    'angular': !0,
                    'selected': $scope.post.Hostgroup.id,
                    'filter[Host.name]': $scope.filter.Host.name
                }
            }).then(function(result) {
                $scope.hostgroup = result.data.hostgroup;
                for (var host in $scope.hostgroup.Hosts) {
                    $scope.showServices[$scope.hostgroup.Hosts[host].Host.id] = !1
                }
                $scope.hostgroupsStateFilter = {
                    0: !0,
                    1: !0,
                    2: !0
                }
            })
        }
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
    $scope.getObjectForDelete = function(host) {
        var object = {};
        object[host.Host.id] = host.Host.hostname;
        return object
    };
    $scope.getObjectsForExternalCommand = function() {
        var object = {};
        for (var host in $scope.hostgroup.Hosts) {
            object[$scope.hostgroup.Hosts[host].Host.id] = $scope.hostgroup.Hosts[host]
        }
        return object
    };
    $scope.showFlashMsg = function() {
        $scope.showFlashSuccess = !0;
        $scope.autoRefreshCounter = 5;
        var interval = $interval(function() {
            $scope.autoRefreshCounter--;
            if ($scope.autoRefreshCounter === 0) {
                $interval.cancel(interval);
                $scope.showFlashSuccess = !1
            }
        }, 1000)
    };
    $scope.showServicesCallback = function(hostId) {
        if ($scope.showServices[hostId] === !1) {
            $scope.showServices[hostId] = !0
        } else {
            $scope.showServices[hostId] = !1
        }
    };
    $scope.loadTimezone();
    $scope.load();
    defaultFilter();
    $scope.$watch('post.Hostgroup.id', function() {
        if ($scope.init) {
            return
        }
        defaultFilter();
        $scope.loadHostsWithStatus('')
    }, !0);
    $scope.$watch('filter', function() {
        if ($scope.init) {
            return
        }
        $scope.loadHostsWithStatus()
    }, !0)
});
angular.module('openITCOCKPIT').controller('StatusmapsIndexController', function($scope, $q, $http, $timeout, QueryStringService) {
    $scope.filter = {
        Host: {
            name: QueryStringService.getValue('filter[Host.name]', ''),
            address: QueryStringService.getValue('filter[Host.address]', ''),
            satellite_id: '0'
        },
        showAll: !1
    };
    $scope.init = !0;
    $scope.mutex = !1;
    $scope.nodes = new vis.DataSet();
    $scope.edges = new vis.DataSet();
    $scope.nodesCount = 0;
    $scope.isEmpty = !1;
    $scope.timer = null;
    $scope.hasBrowserRight = !1;
    $scope.container = document.getElementById('statusmap');
    var offset = $($scope.container).offset();
    var height = (window.innerHeight - offset.top);
    $($($scope.container)).css({
        'height': height
    });
    $scope.load = function() {
        $scope.mutex = !0;
        $scope.isEmpty = !1;
        var params = {
            'angular': !0,
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Host.address]': $scope.filter.Host.address,
            'filter[Host.satellite_id]': $scope.filter.Host.satellite_id,
            'showAll': $scope.filter.showAll
        };
        $http.get("/statusmaps/index.json", {
            params: params
        }).then(function(result) {
            var nodesData = result.data.statusMap.nodes;
            var edgesData = result.data.statusMap.edges;
            $scope.hasBrowserRight = result.data.hasBrowserRight;
            $scope.init = !1;
            $scope.nodesCount = nodesData.length;
            if (nodesData.length > 0) {
                $('#statusmap-progress-icon').show();
                $scope.loadVisMap(nodesData, edgesData)
            } else {
                $scope.isEmpty = !0
            }
            $scope.mutex = !1
        }, function errorCallback(result) {
            console.log('Invalid JSON')
        })
    };
    $scope.resetVis = function() {
        if (!$scope.init) {
            $('#statusmap-progress-icon .progress:first').attr('data-progress', 0);
            $($scope.container).html('')
        }
    };
    $scope.loadVisMap = function(nodesData, edgesData) {
        $scope.nodes.clear();
        $scope.edges.clear();
        var network = null;
        var colorUp = '#449D44';
        var colorDown = '#C9302C';
        var colorUnreachable = '#92A2A8';
        var colorNotMonitored = '#428bca';
        var options = {
            clickToUse: !1,
            groups: {
                satellite: {
                    shape: 'ellipse',
                    margin: {
                        top: 10,
                        bottom: 20,
                        left: 5,
                        right: 5
                    }
                },
                notMonitored: {
                    shape: 'icon',
                    color: colorNotMonitored,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf070',
                        color: colorNotMonitored
                    }
                },
                disabled: {
                    shape: 'icon',
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf1e6'
                    }
                },
                hostUp: {
                    shape: 'icon',
                    color: colorUp,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf058',
                        color: colorUp
                    }
                },
                hostDown: {
                    shape: 'icon',
                    color: colorDown,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf06a',
                        color: colorDown
                    }
                },
                hostUnreachable: {
                    shape: 'icon',
                    color: colorUnreachable,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf059',
                        color: colorUnreachable
                    }
                },
                isInDowntimeUp: {
                    shape: 'icon',
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf011',
                        color: colorUp
                    }
                },
                isInDowntimeDown: {
                    shape: 'icon',
                    color: colorDown,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf011',
                        color: colorDown
                    }
                },
                isInDowntimeUnreachable: {
                    shape: 'icon',
                    color: colorUnreachable,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf011',
                        color: colorUnreachable
                    }
                },
                isAcknowledgedUp: {
                    shape: 'icon',
                    color: colorUp,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf007',
                        color: colorUp
                    }
                },
                isAcknowledgedDown: {
                    shape: 'icon',
                    color: colorDown,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf007',
                        color: colorDown
                    }
                },
                isAcknowledgedUnreachable: {
                    shape: 'icon',
                    color: colorUnreachable,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf007',
                        color: colorUnreachable
                    }
                },
                isAcknowledgedAndIsInDowntimeUp: {
                    shape: 'icon',
                    color: colorUp,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf0f0',
                        color: colorUp
                    }
                },
                isAcknowledgedAndIsInDowntimeDown: {
                    shape: 'icon',
                    color: colorDown,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf0f0',
                        color: colorDown
                    }
                },
                isAcknowledgedAndIsInDowntimeUnreachable: {
                    shape: 'icon',
                    color: colorUnreachable,
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf0f0',
                        color: colorUnreachable
                    }
                }
            },
            nodes: {
                borderWidth: 0.5,
            },
            edges: {
                width: 0.2,
                smooth: {
                    enabled: !1
                }
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -138,
                    centralGravity: 0.02,
                    springLength: 100
                },
                minVelocity: 0.75,
                solver: "forceAtlas2Based",
            },
            interaction: {
                hover: !0,
                dragNodes: !1,
                keyboard: {
                    enabled: !1
                },
                hideEdgesOnDrag: !0
            },
            layout: {
                randomSeed: 1000,
                improvedLayout: !1
            }
        };
        $scope.nodes.add(nodesData);
        $scope.edges.add(edgesData);
        var data = {
            nodes: $scope.nodes,
            edges: $scope.edges
        }
        network = new vis.Network($scope.container, data, options);
        network.fit({
            locked: !1,
            animation: {
                duration: 500,
                easingFunction: 'linear'
            }
        });
        network.on('stabilizationProgress', function(params) {
            var currentPercentage = Math.round(params.iterations / params.total * 100);
            $('#statusmap-progress-icon .progress:first').attr('data-progress', currentPercentage)
        });
        network.once('stabilizationIterationsDone', function() {
            $('#statusmap-progress-icon').hide();
            network.setOptions({
                physics: !1
            })
        });
        network.on('click', function(properties) {
            if (properties.nodes.length === 0) {
                network.fit({
                    locked: !1,
                    animation: {
                        duration: 500,
                        easingFunction: 'linear'
                    }
                });
                return
            }
            var nodeId = properties.nodes[0];
            if (nodeId === 0) {
                return !1
            }
            var node = data.nodes.get(nodeId);
            $q.all([$http.get("/hosts/hoststatus/" + node.uuid + ".json", {
                params: {
                    'angular': !0
                }
            }), $http.get("/statusmaps/hostAndServicesSummaryStatus/" + node.hostId, {
                params: {
                    'angular': !0
                }
            })]).then(function(results) {
                var bigBoxIcon = $scope.getIconForHoststatus(results[0].data.hoststatus.Hoststatus);
                var title = node.title;
                if ($scope.hasBrowserRight) {
                    title = '<a href="/hosts/browser/' + node.hostId + '" target="_blank" class="txt-color-white">' + node.title + '</a>'
                }
                $.bigBox({
                    title: title,
                    content: results[1].data,
                    icon: 'fa ' + bigBoxIcon + ' flash animated',
                    timeout: 10000
                });
                return
            })
        })
    };
    $scope.$watch('filter', function() {
        if ($scope.mutex) {
            return
        }
        $scope.resetVis();
        $scope.load()
    }, !0);
    $scope.getIconForHoststatus = function(hoststatus) {
        var statusIcon = 'fa-check-circle';
        if (typeof hoststatus.current_state === 'undefined') {
            return 'fa-eye-slash'
        }
        if (hoststatus.current_state > 0) {
            statusIcon = 'fa-exclamation-circle'
        }
        if (hoststatus.scheduled_downtime_depth > 0) {
            statusIcon = 'fa-power-off'
        } else if (hoststatus.scheduled_downtime_depth > 0 && hoststatus.problem_has_been_acknowledged == 1) {
            statusIcon = 'fa-user-md'
        } else if (hoststatus.scheduled_downtime_depth > 0 && hoststatus.problem_has_been_acknowledged == 0) {
            statusIcon = 'fa-user'
        }
        return statusIcon
    }
});
angular.module('openITCOCKPIT').controller('CurrentstatereportsIndexController', function($scope, $http, $timeout) {
    $scope.init = !0;
    $scope.errors = null;
    $scope.services = {};
    $scope.InitialListLoaded = null;
    $scope.service_id = null;
    $scope.reportformat = "1";
    $scope.current_state = {
        ok: !0,
        warning: !0,
        critical: !0,
        unknown: !0
    };
    $scope.post = {
        Currentstatereport: {
            Service: null,
            current_state: [],
            report_format: 'pdf'
        }
    };
    $scope.createCurrentStateReport = function() {
        $scope.generatingReport = !0;
        $scope.noDataFound = !1;
        $scope.post.Currentstatereport.report_format = 'pdf'
        $scope.post.Currentstatereport.current_state = [];
        if ($scope.reportformat == "2") {
            $scope.post.Currentstatereport.report_format = 'html'
        }
        if ($scope.current_state.ok) {
            $scope.post.Currentstatereport.current_state.push(0)
        }
        if ($scope.current_state.warning) {
            $scope.post.Currentstatereport.current_state.push(1)
        }
        if ($scope.current_state.critical) {
            $scope.post.Currentstatereport.current_state.push(2)
        }
        if ($scope.current_state.unknown) {
            $scope.post.Currentstatereport.current_state.push(3)
        }
        $http.post("/currentstatereports/index.json?angular=true", $scope.post).then(function(result) {
            $scope.generatingReport = !1;
            if (result.status === 200) {
                $scope.noDataFoundMessage = result.data.response.message;
                $scope.noDataFound = !0;
                return
            }
            if ($scope.post.Currentstatereport.report_format === 'pdf') {
                window.location = '/currentstatereports/createPdfReport.pdf'
            }
            if ($scope.post.Currentstatereport.report_format === 'html') {
                window.location = '/currentstatereports/createHtmlReport'
            }
            $scope.errors = null
        }, function errorCallback(result) {
            $scope.generatingReport = !1;
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadServices = function(searchString) {
        $http.get("/services/loadServicesByString.json", {
            params: {
                'angular': !0,
                'filter[Host.name]': searchString,
                'filter[Service.servicename]': searchString,
                'selected[]': $scope.post.Currentstatereport.Service
            }
        }).then(function(result) {
            $scope.services = result.data.services
        })
    };
    $scope.loadServices()
});
angular.module('openITCOCKPIT').controller('ServicetemplatesUsedByController', function($scope, $http, QueryStringService, MassChangeService) {
    $scope.id = QueryStringService.getCakeId();
    $scope.total = 0;
    $scope.servicetemplate = null;
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/services/delete/';
    $scope.serverResult = [];
    var forTemplate = function(serverResponse) {
        var services = [];
        var hosts = [];
        var saved_hostuuids = [];
        var result = [];
        var lastendhost = "";
        var tmp_hostservicegroup = null;
        serverResponse.forEach(function(record) {
            services.push(record.Service);
            if (saved_hostuuids.indexOf(record.Host.uuid) < 0) {
                hosts.push(record.Host);
                saved_hostuuids.push(record.Host.uuid)
            }
        });
        services.forEach(function(service) {
            if (lastendhost != service.host_id) {
                if (tmp_hostservicegroup !== null) {
                    result.push(tmp_hostservicegroup)
                }
                tmp_hostservicegroup = {};
                var host = null;
                hosts.forEach(function(hostelem) {
                    if (hostelem.id == service.host_id) {
                        host = hostelem
                    }
                });
                tmp_hostservicegroup = {
                    Host: host,
                    Services: []
                };
                lastendhost = service.host_id
            }
            tmp_hostservicegroup.Services.push({
                Service: service
            })
        });
        if (tmp_hostservicegroup !== null) {
            result.push(tmp_hostservicegroup)
        }
        return result
    };
    $scope.load = function() {
        $http.get("/servicetemplates/usedBy/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.serverResult = result.data.all_services;
            if ($scope.serverResult) {
                $scope.services = forTemplate(result.data.all_services);
                $scope.total = result.data.all_services.length
            }
            $scope.servicetemplate = result.data.servicetemplate
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.selectAll = function() {
        if ($scope.services) {
            for (var key in $scope.serverResult) {
                if ($scope.serverResult[key].Service.allow_edit) {
                    var id = $scope.serverResult[key].Service.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.serverResult) {
            for (var id in selectedObjects) {
                if (id == $scope.serverResult[key].Service.id) {
                    objects[id] = $scope.serverResult[key].Host.hostname + '/' + $scope.serverResult[key].Service.servicename
                }
            }
        }
        return objects
    };
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0);
    $scope.load()
});
angular.module('openITCOCKPIT').controller('LogentriesIndexController', function($scope, $http, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Logentry.entry_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Logentry: {
                logentry_data: '',
                logentry_type: ''
            },
            Host: {
                id: []
            }
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var params = {
            'angular': !0,
            'scroll': $scope.useScroll,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Logentry.logentry_data]': $scope.filter.Logentry.logentry_data,
            'filter[Host.id][]': $scope.filter.Host.id
        };
        if ($scope.filter.Logentry.logentry_type.length > 0) {
            params['filter[Logentry.logentry_type][]'] = $scope.filter.Logentry.logentry_type
        }
        $http.get("/logentries/index.json", {
            params: params
        }).then(function(result) {
            $scope.logentries = result.data.all_logentries;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.loadHosts = function(searchString) {
        $http.get("/hosts/loadHostsByString.json", {
            params: {
                'angular': !0,
                'filter[Host.name]': searchString,
                'selected[]': $scope.filter.Host.id
            }
        }).then(function(result) {
            $scope.hosts = result.data.hosts
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.loadHosts('');
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('TenantsIndexController', function($scope, $http, SortService, MassChangeService) {
    SortService.setSort('Container.name');
    SortService.setDirection('asc');
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            container: {
                name: ''
            },
            tenant: {
                description: '',
                is_active: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/tenants/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/tenants/index.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Container.name]': $scope.filter.container.name,
                'filter[Tenant.description]': $scope.filter.tenant.description
            }
        }).then(function(result) {
            $scope.tenants = result.data.all_tenants;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.selectAll = function() {
        if ($scope.tenants) {
            for (var key in $scope.tenants) {
                if ($scope.tenants[key].Tenant.allowEdit) {
                    var id = $scope.tenants[key].Tenant.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.tenants) {
            for (var id in selectedObjects) {
                if (id == $scope.tenants[key].Tenant.id) {
                    objects[id] = $scope.tenants[key].Container.name
                }
            }
        }
        return objects
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('HostsDisabledController', function($scope, $http, $httpParamSerializer, SortService, MassChangeService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Host.name'));
    SortService.setDirection(QueryStringService.getValue('direction', 'asc'));
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            Host: {
                name: QueryStringService.getValue('filter[Host.name]', ''),
                description: QueryStringService.getValue('filter[Host.description]', ''),
                address: '',
                satellite_id: []
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/hosts/delete/';
    $scope.activateUrl = '/hosts/enable/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Host.description]': $scope.filter.Host.description,
            'filter[Host.address]': $scope.filter.Host.address,
            'filter[Host.satellite_id][]': $scope.filter.Host.satellite_id
        };
        $http.get("/hosts/disabled.json", {
            params: params
        }).then(function(result) {
            $scope.hosts = result.data.all_hosts;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.selectAll = function() {
        if ($scope.hosts) {
            for (var key in $scope.hosts) {
                if ($scope.hosts[key].Host.allow_edit) {
                    var id = $scope.hosts[key].Host.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host) {
        var object = {};
        object[host.Host.id] = host.Host.hostname;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.hosts) {
            for (var id in selectedObjects) {
                if (id == $scope.hosts[key].Host.id) {
                    objects[id] = $scope.hosts[key].Host.hostname
                }
            }
        }
        return objects
    };
    var buildUrl = function(baseUrl) {
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('SystemdowntimesHostController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService, MassChangeService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Systemdowntime.from_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            Host: {
                name: ''
            },
            Systemdowntime: {
                author: '',
                comment: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/systemdowntimes/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/systemdowntimes/host.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Host.name]': $scope.filter.Host.name,
                'filter[Systemdowntime.author]': $scope.filter.Systemdowntime.author,
                'filter[Systemdowntime.comment]': $scope.filter.Systemdowntime.comment
            }
        }).then(function(result) {
            $scope.systemdowntimes = result.data.all_host_recurring_downtimes;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.selectAll = function() {
        if ($scope.systemdowntimes) {
            for (var key in $scope.systemdowntimes) {
                if ($scope.systemdowntimes[key].Host.allow_edit) {
                    var id = $scope.systemdowntimes[key].Systemdowntime.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(downtime) {
        var object = {};
        object[downtime.Systemdowntime.id] = downtime.Host.hostname;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.systemdowntimes) {
            for (var id in selectedObjects) {
                if (id == $scope.systemdowntimes[key].Systemdowntime.id) {
                    objects[id] = $scope.systemdowntimes[key].Host.hostname
                }
            }
        }
        return objects
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ServicesBrowserController', function($scope, $http, $q, QueryStringService, $interval) {
    $scope.id = QueryStringService.getCakeId();
    $scope.showFlashSuccess = !1;
    $scope.canSubmitExternalCommands = !1;
    $scope.tags = [];
    $scope.init = !0;
    $scope.serviceStatusTextClass = 'txt-primary';
    $scope.isLoadingGraph = !1;
    $scope.dataSources = [];
    $scope.currentDataSource = null;
    $scope.serverTimeDateObject = null;
    $scope.availableTimeranges = {
        1: '1 hour',
        2: '2 hours',
        3: '3 hours',
        4: '4 hours',
        8: '8 hours',
        24: '1 day',
        48: '2 days',
        120: '5 days',
        168: '7 days',
        720: '30 days',
        2160: '90 days',
        4464: '6 months',
        8760: '1 year'
    };
    $scope.currentSelectedTimerange = 3;
    $scope.visTimeline = null;
    $scope.visTimelineInit = !0;
    $scope.visTimelineStart = -1;
    $scope.visTimelineEnd = -1;
    $scope.visTimeout = null;
    $scope.visChangeTimeout = null;
    $scope.showTimelineTab = !1;
    $scope.timelineIsLoading = !1;
    $scope.failureDurationInPercent = null;
    $scope.lastLoadDate = Date.now();
    $scope.graphAutoRefresh = !0;
    $scope.graphAutoRefreshInterval = 0;
    $scope.showDatapoints = !1;
    var flappingInterval;
    var zoomCallbackWasBind = !1;
    var graphAutoRefreshIntervalId = null;
    var lastGraphStart = 0;
    var lastGraphEnd = 0;
    var graphRenderEnd = 0;
    $scope.showFlashMsg = function() {
        $scope.showFlashSuccess = !0;
        $scope.autoRefreshCounter = 5;
        var interval = $interval(function() {
            $scope.autoRefreshCounter--;
            if ($scope.autoRefreshCounter === 0) {
                $scope.load();
                $interval.cancel(interval);
                $scope.showFlashSuccess = !1
            }
        }, 1000)
    };
    $scope.load = function() {
        $scope.lastLoadDate = Date.now();
        $q.all([$http.get("/services/browser/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }), $http.get("/angular/user_timezone.json", {
            params: {
                'angular': !0
            }
        })]).then(function(results) {
            $scope.mergedService = results[0].data.mergedService;
            $scope.mergedService.Service.disabled = parseInt($scope.mergedService.Service.disabled, 10);
            $scope.contacts = results[0].data.contacts;
            $scope.contactgroups = results[0].data.contactgroups;
            $scope.host = results[0].data.host;
            $scope.tags = $scope.mergedService.Service.tags.split(',');
            $scope.hoststatus = results[0].data.hoststatus;
            $scope.servicestatus = results[0].data.servicestatus;
            $scope.servicestatusForIcon = {
                Servicestatus: $scope.servicestatus
            };
            $scope.serviceStatusTextClass = getServicestatusTextColor();
            $scope.acknowledgement = results[0].data.acknowledgement;
            $scope.downtime = results[0].data.downtime;
            $scope.hostAcknowledgement = results[0].data.hostAcknowledgement;
            $scope.hostDowntime = results[0].data.hostDowntime;
            $scope.canSubmitExternalCommands = results[0].data.canSubmitExternalCommands;
            $scope.priorities = {
                1: !1,
                2: !1,
                3: !1,
                4: !1,
                5: !1
            };
            var priority = parseInt($scope.mergedService.Service.priority, 10);
            for (var i = 1; i <= priority; i++) {
                $scope.priorities[i] = !0
            }
            $scope.graphAutoRefreshInterval = parseInt($scope.mergedService.Service.check_interval, 10) * 1000;
            $scope.timezone = results[1].data.timezone;
            $scope.serverTimeDateObject = new Date($scope.timezone.server_time);
            var graphStart = (parseInt($scope.serverTimeDateObject.getTime() / 1000, 10) - (3 * 3600));
            var graphEnd = parseInt($scope.serverTimeDateObject.getTime() / 1000, 10);
            $scope.dataSources = [];
            for (var dsName in results[0].data.mergedService.Perfdata) {
                $scope.dataSources.push(dsName)
            }
            if ($scope.dataSources.length > 0) {
                $scope.currentDataSource = $scope.dataSources[0]
            }
            if ($scope.mergedService.Service.has_graph) {
                loadGraph($scope.host.Host.uuid, $scope.mergedService.Service.uuid, !1, graphStart, graphEnd, !0)
            }
            $scope.init = !1
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
    $scope.getObjectForDowntimeDelete = function() {
        var object = {};
        object[$scope.downtime.internalDowntimeId] = $scope.host.Host.name + ' / ' + $scope.mergedService.Service.name;
        return object
    };
    $scope.getObjectForHostDowntimeDelete = function() {
        var object = {};
        object[$scope.hostDowntime.internalDowntimeId] = $scope.host.Host.name;
        return object
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
    $scope.startFlapping = function() {
        $scope.stopFlapping();
        flappingInterval = $interval(function() {
            if ($scope.flappingState === 0) {
                $scope.flappingState = 1
            } else {
                $scope.flappingState = 0
            }
        }, 750)
    };
    $scope.stopFlapping = function() {
        if (flappingInterval) {
            $interval.cancel(flappingInterval)
        }
        flappingInterval = null
    };
    $scope.changeGraphTimespan = function(timespan) {
        $scope.currentSelectedTimerange = timespan;
        var start = (parseInt(new Date($scope.timezone.server_time).getTime() / 1000, 10) - (timespan * 3600));
        var end = parseInt(new Date($scope.timezone.server_time).getTime() / 1000, 10);
        loadGraph($scope.host.Host.uuid, $scope.mergedService.Service.uuid, !1, start, end, !0)
    };
    $scope.changeDataSource = function(gaugeName) {
        $scope.currentDataSource = gaugeName;
        loadGraph($scope.host.Host.uuid, $scope.mergedService.Service.uuid, !1, lastGraphStart, lastGraphEnd, !1)
    };
    var getServicestatusTextColor = function() {
        switch ($scope.servicestatus.currentState) {
            case 0:
            case '0':
                return 'txt-color-green';
            case 1:
            case '1':
                return 'warning';
            case 2:
            case '2':
                return 'txt-color-red';
            case 3:
            case '3':
                return 'txt-color-blueLight'
        }
        return 'txt-primary'
    };
    var loadGraph = function(hostUuid, serviceuuid, appendData, start, end, saveStartAndEnd) {
        if (saveStartAndEnd) {
            lastGraphStart = start;
            lastGraphEnd = end
        }
        graphRenderEnd = end;
        if ($scope.dataSources.length > 0) {
            $scope.isLoadingGraph = !0;
            $http.get('/Graphgenerators/getPerfdataByUuid.json', {
                params: {
                    angular: !0,
                    host_uuid: hostUuid,
                    service_uuid: serviceuuid,
                    start: start,
                    end: end,
                    jsTimestamp: 1,
                    gauge: $scope.currentDataSource
                }
            }).then(function(result) {
                $scope.isLoadingGraph = !1;
                if (appendData === !1) {
                    if (result.data.performance_data.length > 0) {
                        $scope.perfdata = result.data.performance_data[0]
                    } else {
                        $scope.perfdata = {
                            data: {},
                            datasource: {
                                ds: null,
                                name: null,
                                label: null,
                                unit: null,
                                act: null,
                                warn: null,
                                crit: null,
                                min: null,
                                max: null
                            }
                        }
                    }
                }
                if (appendData === !0) {
                    if (result.data.performance_data.length > 0) {
                        for (var timestamp in result.data.performance_data[0].data) {
                            var frontEndTimestamp = (parseInt(timestamp, 10) + ($scope.timezone.user_offset * 1000));
                            $scope.perfdata.data[frontEndTimestamp] = result.data.performance_data[0].data[timestamp]
                        }
                    }
                }
                if ($scope.graphAutoRefresh === !0 && $scope.graphAutoRefreshInterval > 1000) {
                    enableGraphAutorefresh()
                }
                renderGraph($scope.perfdata)
            })
        }
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
            transition: 'all 1s'
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
        var thresholdLines = [];
        var thresholdAreas = [];
        var GraphDefaultsObj = new GraphDefaults();
        var defaultColor = GraphDefaultsObj.defaultFillColor;
        if (performance_data.datasource.warn !== "" && performance_data.datasource.crit !== "" && performance_data.datasource.warn !== null && performance_data.datasource.crit !== null) {
            var warn = parseFloat(performance_data.datasource.warn);
            var crit = parseFloat(performance_data.datasource.crit);
            thresholdLines.push({
                color: GraphDefaultsObj.warningBorderColor,
                yaxis: {
                    from: warn,
                    to: warn
                }
            });
            thresholdLines.push({
                color: GraphDefaultsObj.criticalBorderColor,
                yaxis: {
                    from: crit,
                    to: crit
                }
            });
            if (warn > crit) {
                thresholdAreas.push({
                    below: warn,
                    color: GraphDefaultsObj.warningFillColor
                });
                thresholdAreas.push({
                    below: crit,
                    color: GraphDefaultsObj.criticalFillColor
                })
            } else {
                defaultColor = GraphDefaultsObj.criticalFillColor;
                thresholdAreas.push({
                    below: crit,
                    color: GraphDefaultsObj.warningFillColor
                });
                thresholdAreas.push({
                    below: warn,
                    color: GraphDefaultsObj.okFillColor
                })
            }
        }
        var graph_data = [];
        for (var timestamp in performance_data.data) {
            var frontEndTimestamp = (parseInt(timestamp, 10) + ($scope.timezone.user_time_to_server_offset * 1000));
            graph_data.push([frontEndTimestamp, performance_data.data[timestamp]])
        }
        var options = GraphDefaultsObj.getDefaultOptions();
        options.height = '300';
        options.colors = defaultColor;
        options.tooltip = !0;
        options.tooltipOpts = {
            defaultTheme: !1
        };
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
        options.series.color = defaultColor;
        options.series.threshold = thresholdAreas;
        options.lines.fillColor.colors = [{
            opacity: 0.3
        }, {
            brightness: 1,
            opacity: 0.6
        }];
        options.points = {
            show: $scope.showDatapoints,
            radius: 1
        };
        options.xaxis.min = (lastGraphStart + $scope.timezone.user_time_to_server_offset) * 1000;
        options.xaxis.max = (graphRenderEnd + $scope.timezone.user_time_to_server_offset) * 1000;
        options.yaxis = {
            axisLabel: performance_data.datasource.unit
        };
        plot = $.plot('#graphCanvas', [graph_data], options);
        if (zoomCallbackWasBind === !1) {
            $("#graphCanvas").bind("plotselected", function(event, ranges) {
                var start = parseInt(ranges.xaxis.from / 1000, 10);
                var end = parseInt(ranges.xaxis.to / 1000, 10);
                start -= $scope.timezone.user_time_to_server_offset;
                end -= $scope.timezone.user_time_to_server_offset;
                if (start > end) {
                    var tmpStart = end;
                    end = start;
                    start = tmpStart
                }
                var currentTimestamp = Math.floor($scope.serverTimeDateObject.getTime() / 1000);
                var graphAutoRefreshIntervalInSeconds = $scope.graphAutoRefreshInterval / 1000;
                if ((end + graphAutoRefreshIntervalInSeconds + 120) < currentTimestamp) {
                    disableGraphAutorefresh()
                }
                loadGraph($scope.host.Host.uuid, $scope.mergedService.Service.uuid, !1, start, end, !0)
            })
        }
        zoomCallbackWasBind = !0
    };
    $scope.loadTimelineData = function(_properties) {
        var properties = _properties || {};
        var start = properties.start || -1;
        var end = properties.end || -1;
        $scope.timelineIsLoading = !0;
        if (start > $scope.visTimelineStart && end < $scope.visTimelineEnd) {
            $scope.timelineIsLoading = !1;
            return
        }
        $http.get("/services/timeline/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                start: start,
                end: end
            }
        }).then(function(result) {
            var timelinedata = {
                items: new vis.DataSet(result.data.servicestatehistory),
                groups: new vis.DataSet(result.data.groups)
            };
            timelinedata.items.add(result.data.statehistory);
            timelinedata.items.add(result.data.downtimes);
            timelinedata.items.add(result.data.notifications);
            timelinedata.items.add(result.data.acknowledgements);
            timelinedata.items.add(result.data.timeranges);
            $scope.visTimelineStart = result.data.start;
            $scope.visTimelineEnd = result.data.end;
            var options = {
                orientation: "both",
                start: new Date(result.data.start * 1000),
                end: new Date(result.data.end * 1000),
                min: new Date(new Date(result.data.start * 1000).setFullYear(new Date(result.data.start * 1000).getFullYear() - 1)),
                max: new Date(result.data.end * 1000),
                zoomMin: 1000 * 10 * 60 * 5,
                format: {
                    minorLabels: {
                        millisecond: 'SSS',
                        second: 's',
                        minute: 'H:mm',
                        hour: 'H:mm',
                        weekday: 'ddd D',
                        day: 'D',
                        week: 'w',
                        month: 'MMM',
                        year: 'YYYY'
                    },
                    majorLabels: {
                        millisecond: 'H:mm:ss',
                        second: 'D MMMM H:mm',
                        minute: 'DD.MM.YYYY',
                        hour: 'DD.MM.YYYY',
                        weekday: 'MMMM YYYY',
                        day: 'MMMM YYYY',
                        week: 'MMMM YYYY',
                        month: 'YYYY',
                        year: ''
                    }
                }
            };
            renderTimeline(timelinedata, options);
            $scope.timelineIsLoading = !1
        })
    };
    var renderTimeline = function(timelinedata, options) {
        var container = document.getElementById('visualization');
        if ($scope.visTimeline === null) {
            $scope.visTimeline = new vis.Timeline(container, timelinedata.items, timelinedata.groups, options);
            $scope.visTimeline.on('rangechanged', function(properties) {
                if ($scope.visTimelineInit) {
                    $scope.visTimelineInit = !1;
                    return
                }
                if ($scope.timelineIsLoading) {
                    return
                }
                if ($scope.visTimeout) {
                    clearTimeout($scope.visTimeout)
                }
                $scope.visTimeout = setTimeout(function() {
                    $scope.visTimeout = null;
                    $scope.loadTimelineData({
                        start: parseInt(properties.start.getTime() / 1000, 10),
                        end: parseInt(properties.end.getTime() / 1000, 10)
                    })
                }, 500)
            })
        } else {
            $scope.visTimeline.setItems(timelinedata.items)
        }
        $scope.visTimeline.on('changed', function() {
            if ($scope.visTimelineInit) {
                return
            }
            if ($scope.visChangeTimeout) {
                clearTimeout($scope.visChangeTimeout)
            }
            $scope.visChangeTimeout = setTimeout(function() {
                $scope.visChangeTimeout = null;
                var timeRange = $scope.visTimeline.getWindow();
                var visTimelineStartAsTimestamp = new Date(timeRange.start).getTime();
                var visTimelineEndAsTimestamp = new Date(timeRange.end).getTime();
                var criticalItems = $scope.visTimeline.itemsData.get({
                    fields: ['start', 'end', 'className', 'group'],
                    type: {
                        start: 'Date',
                        end: 'Date'
                    },
                    filter: function(item) {
                        return (item.group == 4 && (item.className === 'bg-critical' || item.className === 'bg-critical-soft') && $scope.CheckIfItemInRange(visTimelineStartAsTimestamp, visTimelineEndAsTimestamp, item))
                    }
                });
                $scope.failureDurationInPercent = $scope.calculateFailures((visTimelineEndAsTimestamp - visTimelineStartAsTimestamp), criticalItems, visTimelineStartAsTimestamp, visTimelineEndAsTimestamp);
                $scope.$apply()
            }, 500)
        })
    };
    $scope.showTimeline = function() {
        $scope.showTimelineTab = !0;
        $scope.loadTimelineData()
    };
    $scope.hideTimeline = function() {
        $scope.showTimelineTab = !1
    };
    $scope.CheckIfItemInRange = function(start, end, item) {
        var itemStart = item.start.getTime();
        var itemEnd = item.end.getTime();
        if (itemEnd < start) {
            return !1
        } else if (itemStart > end) {
            return !1
        } else if (itemStart >= start && itemEnd <= end) {
            return !0
        } else if (itemStart >= start && itemEnd > end) {
            return !0
        } else if (itemStart < start && itemEnd > start && itemEnd < end) {
            return !0
        } else if (itemStart < start && itemEnd >= end) {
            return !0
        }
        return !1
    };
    $scope.calculateFailures = function(totalTime, criticalItems, start, end) {
        var failuresDuration = 0;
        criticalItems.forEach(function(criticalItem) {
            var itemStart = criticalItem.start.getTime();
            var itemEnd = criticalItem.end.getTime();
            failuresDuration += ((itemEnd > end) ? end : itemEnd) - ((itemStart < start) ? start : itemStart)
        });
        return (failuresDuration / totalTime * 100).toFixed(3)
    };
    var enableGraphAutorefresh = function() {
        $scope.graphAutoRefresh = !0;
        if (graphAutoRefreshIntervalId === null) {
            graphAutoRefreshIntervalId = $interval(function() {
                var lastTimestampInCurrentData = 0;
                for (var timestamp in $scope.perfdata.data) {
                    timestamp = parseInt(timestamp, 10);
                    if (timestamp > lastTimestampInCurrentData) {
                        lastTimestampInCurrentData = timestamp
                    }
                }
                lastTimestampInCurrentData = lastTimestampInCurrentData / 1000;
                var start = lastTimestampInCurrentData;
                $scope.serverTimeDateObject = new Date($scope.serverTimeDateObject.getTime() + $scope.graphAutoRefreshInterval);
                var end = Math.floor($scope.serverTimeDateObject.getTime() / 1000);
                if (start > 0) {
                    loadGraph($scope.host.Host.uuid, $scope.mergedService.Service.uuid, !0, start, end, !1)
                }
            }, $scope.graphAutoRefreshInterval)
        }
    };
    var disableGraphAutorefresh = function() {
        $scope.graphAutoRefresh = !1;
        if (graphAutoRefreshIntervalId !== null) {
            $interval.cancel(graphAutoRefreshIntervalId)
        }
        graphAutoRefreshIntervalId = null
    };
    $scope.load();
    $scope.$watch('servicestatus.isFlapping', function() {
        if ($scope.servicestatus) {
            if ($scope.servicestatus.hasOwnProperty('isFlapping')) {
                if ($scope.servicestatus.isFlapping === !0) {
                    $scope.startFlapping()
                }
                if ($scope.servicestatus.isFlapping === !1) {
                    $scope.stopFlapping()
                }
            }
        }
    });
    $scope.$watch('graphAutoRefresh', function() {
        if ($scope.init) {
            return
        }
        if ($scope.graphAutoRefresh === !0) {
            enableGraphAutorefresh()
        } else {
            disableGraphAutorefresh()
        }
    });
    $scope.$watch('showDatapoints', function() {
        if ($scope.init) {
            return
        }
        loadGraph($scope.host.Host.uuid, $scope.mergedService.Service.uuid, !0, lastGraphStart, lastGraphEnd, !1)
    })
});
angular.module('openITCOCKPIT').controller('TenantsEditController', function($scope, $http, QueryStringService) {
    $scope.post = {
        Tenant: {
            description: '',
            is_active: '',
            firstname: '',
            lastname: '',
            street: '',
            zipcode: '',
            city: '',
            max_users: 0
        },
        Container: {
            name: '',
            containertype_id: '',
            parent_id: ''
        }
    };
    $scope.id = QueryStringService.getCakeId();
    $scope.deleteUrl = "/tenants/delete/" + $scope.id + ".json?angular=true";
    $scope.sucessUrl = '/tenants/index';
    $scope.load = function() {
        $http.get("/tenants/edit/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.tenant = result.data.tenant;
            $scope.post.Container.name = $scope.tenant.Container.name;
            $scope.post.Container.containertype_id = $scope.tenant.Container.containertype_id;
            $scope.post.Container.parent_id = $scope.tenant.Container.parent_id;
            $scope.post.Tenant.description = $scope.tenant.Tenant.description;
            $scope.post.Tenant.is_active = parseInt($scope.tenant.Tenant.is_active, 10) === 1;
            $scope.post.Tenant.firstname = $scope.tenant.Tenant.firstname;
            $scope.post.Tenant.lastname = $scope.tenant.Tenant.lastname;
            $scope.post.Tenant.street = $scope.tenant.Tenant.street;
            $scope.post.Tenant.zipcode = $scope.tenant.Tenant.zipcode;
            $scope.post.Tenant.city = $scope.tenant.Tenant.city;
            $scope.post.Tenant.max_users = $scope.tenant.Tenant.max_users;
            $scope.init = !1
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.submit = function() {
        $http.post("/tenants/edit/" + $scope.id + ".json?angular=true", $scope.post).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/tenants/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.load()
});
angular.module('openITCOCKPIT').controller('NotificationsServiceNotificationController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'NotificationService.start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Notification: {
                state: {
                    ok: !1,
                    warning: !1,
                    critical: !1,
                    unknown: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: '',
                author: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/notifications/serviceNotification/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[NotificationService.output]': $scope.filter.Notification.output,
                'filter[NotificationService.state][]': $rootScope.currentStateForApi($scope.filter.Notification.state),
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.notifications = result.data.all_notifications;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('AcknowledgementsServiceController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'AcknowledgedService.entry_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    $scope.useScroll = !0;
    var now = new Date();
    var defaultFilter = function() {
        $scope.filter = {
            Acknowledgement: {
                state: {
                    warning: !1,
                    critical: !1,
                    unknown: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                comment: '',
                author: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/acknowledgements/service/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[AcknowledgedService.comment_data]': $scope.filter.Acknowledgement.comment,
                'filter[AcknowledgedService.state][]': $rootScope.currentStateForApi($scope.filter.Acknowledgement.state),
                'filter[AcknowledgedService.author_name]': $scope.filter.Acknowledgement.author,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.acknowledgements = result.data.all_acknowledgements;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('InstantreportsEditController', function($scope, $http, QueryStringService) {
    $scope.types = {
        TYPE_HOSTGROUPS: '1',
        TYPE_HOSTS: '2',
        TYPE_SERVICEGROUPS: '3',
        TYPE_SERVICES: '4'
    };
    $scope.post = {
        Instantreport: {
            container_id: null,
            name: '',
            type: $scope.types.TYPE_HOSTGROUPS,
            timeperiod_id: '0',
            reflection: '1',
            summary: !1,
            downtimes: !1,
            send_email: !1,
            send_interval: '1',
            evaluation: '2',
            Hostgroup: [],
            Host: [],
            Servicegroup: [],
            Service: [],
            User: []
        }
    };
    $scope.id = QueryStringService.getCakeId();
    $scope.init = !0;
    $scope.sucessUrl = '/instantreports/index';
    $scope.load = function() {
        $http.get("/instantreports/edit/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            var instantreport = result.data.instantreport;
            var selectedHostgroups = [];
            var selectedServicegroups = [];
            var selectedHosts = [];
            var selectedServices = [];
            var selectedUsers = [];
            var key;
            for (key in instantreport.Hostgroup) {
                selectedHostgroups.push(parseInt(instantreport.Hostgroup[key].id, 10))
            }
            for (key in instantreport.Servicegroup) {
                selectedServicegroups.push(parseInt(instantreport.Servicegroup[key].id, 10))
            }
            for (key in instantreport.Host) {
                selectedHosts.push(parseInt(instantreport.Host[key].id, 10))
            }
            for (key in instantreport.Service) {
                selectedServices.push(instantreport.Service[key].id)
            }
            for (key in instantreport.User) {
                selectedUsers.push(parseInt(instantreport.User[key].id, 10))
            }
            $scope.post.Instantreport.Hostgroup = selectedHostgroups;
            $scope.post.Instantreport.Servicegroup = selectedServicegroups;
            $scope.post.Instantreport.Host = selectedHosts;
            $scope.post.Instantreport.Service = selectedServices;
            $scope.post.Instantreport.User = selectedUsers;
            $scope.post.Instantreport.container_id = parseInt(instantreport.Instantreport.container_id, 10);
            $scope.post.Instantreport.name = instantreport.Instantreport.name;
            $scope.post.Instantreport.type = instantreport.Instantreport.type;
            $scope.post.Instantreport.timeperiod_id = parseInt(instantreport.Instantreport.timeperiod_id, 10);
            $scope.post.Instantreport.reflection = instantreport.Instantreport.reflection;
            $scope.post.Instantreport.summary = parseInt(instantreport.Instantreport.summary, 10) === 1;
            $scope.post.Instantreport.downtimes = parseInt(instantreport.Instantreport.downtimes, 10) === 1;
            $scope.post.Instantreport.send_email = parseInt(instantreport.Instantreport.send_email, 10) === 1;
            $scope.post.Instantreport.send_interval = instantreport.Instantreport.send_interval;
            $scope.post.Instantreport.evaluation = instantreport.Instantreport.evaluation;
            $scope.init = !1
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.loadContainers = function() {
        $http.get("/instantreports/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.load()
        })
    };
    $scope.loadTimeperiods = function() {
        $http.get("/timeperiods/loadTimeperiodsByContainerId.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Instantreport.container_id
            }
        }).then(function(result) {
            $scope.timeperiods = result.data.timeperiods
        })
    };
    $scope.loadHostgroups = function() {
        if ($scope.init) {
            return
        }
        if ($scope.post.Instantreport.container_id) {
            $http.get("/hostgroups/loadHosgroupsByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id,
                    'selected[]': $scope.post.Instantreport.Hostgroup
                }
            }).then(function(result) {
                $scope.hostgroups = result.data.hostgroups
            })
        }
    };
    $scope.loadHosts = function(searchString) {
        if ($scope.post.Instantreport.container_id) {
            $http.get("/hosts/loadHostsByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id,
                    'filter[Host.name]': searchString,
                    'selected[]': $scope.post.Instantreport.Host
                }
            }).then(function(result) {
                $scope.hosts = result.data.hosts
            })
        }
    };
    $scope.loadServicegroups = function() {
        if ($scope.init) {
            return
        }
        if ($scope.post.Instantreport.container_id) {
            $http.get("/servicegroups/loadServicegroupsByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id,
                    'selected[]': $scope.post.Instantreport.Servicegroup
                }
            }).then(function(result) {
                $scope.servicegroups = result.data.servicegroups
            })
        }
    };
    $scope.loadServices = function(searchString) {
        if ($scope.post.Instantreport.container_id) {
            $http.get("/services/loadServicesByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id,
                    'filter[Host.name]': searchString,
                    'filter[Service.servicename]': searchString,
                    'selected[]': $scope.post.Instantreport.Service
                }
            }).then(function(result) {
                $scope.services = result.data.services
            })
        }
    };
    $scope.loadUsers = function() {
        $http.get("/users/loadUsersByContainerId.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Instantreport.container_id
            }
        }).then(function(result) {
            $scope.users = result.data.users
        })
    };
    $scope.submit = function() {
        console.log($scope.post);
        $http.post("/instantreports/edit/" + $scope.id + ".json?angular=true", $scope.post).then(function(result) {
            window.location.href = '/instantreports/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.resetOnTypeChange = function() {
        $scope.post.Instantreport.Hostgroup = [];
        $scope.post.Instantreport.Host = [];
        $scope.post.Instantreport.Servicegroup = [];
        $scope.post.Instantreport.Service = []
    };
    $scope.$watch('post.Instantreport.container_id', function() {
        if ($scope.init) {
            return
        }
        switch ($scope.post.Instantreport.type) {
            case $scope.types.TYPE_HOSTGROUPS:
                $scope.loadHostgroups('');
                break;
            case $scope.types.TYPE_HOSTS:
                $scope.loadHosts('');
                break;
            case $scope.types.TYPE_SERVICEGROUPS:
                $scope.loadServicegroups('');
                break;
            case $scope.types.TYPE_SERVICES:
                $scope.loadServices('');
                break
        }
        $scope.loadTimeperiods('');
        $scope.loadUsers('')
    }, !0);
    $scope.changeType = function() {
        if ($scope.init) {
            return
        }
        $scope.resetOnTypeChange();
        switch ($scope.post.Instantreport.type) {
            case $scope.types.TYPE_HOSTGROUPS:
                $scope.loadHostgroups('');
                break;
            case $scope.types.TYPE_HOSTS:
                $scope.loadHosts('');
                break;
            case $scope.types.TYPE_SERVICEGROUPS:
                $scope.loadServicegroups('');
                break;
            case $scope.types.TYPE_SERVICES:
                $scope.loadServices('');
                break
        }
    };
    $scope.$watch('post.Instantreport.send_email', function() {
        if ($scope.init) {
            return
        }
        if (!$scope.post.Instantreport.send_email) {
            $scope.post.Instantreport.send_interval = '0';
            $scope.post.Instantreport.User = []
        }
    }, !0);
    $scope.loadContainers()
});
angular.module('openITCOCKPIT').controller('StatehistoriesServiceController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'StatehistoryService.state_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            StatehistoryService: {
                state: {
                    ok: !1,
                    warning: !1,
                    critical: !1,
                    unknown: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var state_type = '';
        if ($scope.filter.StatehistoryService.state_types.soft ^ $scope.filter.StatehistoryService.state_types.hard) {
            state_type = 0;
            if ($scope.filter.StatehistoryService.state_types.hard === !0) {
                state_type = 1
            }
        }
        $http.get("/statehistories/service/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[StatehistoryService.output]': $scope.filter.StatehistoryService.output,
                'filter[StatehistoryService.state][]': $rootScope.currentStateForApi($scope.filter.StatehistoryService.state),
                'filter[StatehistoryService.state_type]': state_type,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.statehistories = result.data.all_statehistories;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('InstantreportsIndexController', function($scope, $http, SortService, MassChangeService) {
    SortService.setSort('Instantreport.name');
    SortService.setDirection('asc');
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            instantreport: {
                name: '',
                evaluation: {
                    hosts: !1,
                    hostsandservices: !1,
                    services: !1
                },
                type: {
                    hostgroups: !1,
                    hosts: !1,
                    servicegroups: !1,
                    services: !1
                }
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/instantreports/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var evaluationTypes = [];
        for (var key in $scope.filter.instantreport.evaluation) {
            if ($scope.filter.instantreport.evaluation[key] !== !1) {
                evaluationTypes.push($scope.filter.instantreport.evaluation[key])
            }
        }
        var objectTypes = [];
        for (var key in $scope.filter.instantreport.type) {
            if ($scope.filter.instantreport.type[key] !== !1) {
                objectTypes.push($scope.filter.instantreport.type[key])
            }
        }
        $http.get("/instantreports/index.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Instantreport.name]': $scope.filter.instantreport.name,
                'filter[Instantreport.evaluation][]': evaluationTypes,
                'filter[Instantreport.type][]': objectTypes
            }
        }).then(function(result) {
            $scope.instantreports = result.data.instantreports;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.selectAll = function() {
        if ($scope.instantreports) {
            for (var key in $scope.instantreports) {
                var id = $scope.instantreports[key].Instantreport.id;
                $scope.massChange[id] = !0
            }
        }
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.instantreports) {
            for (var id in selectedObjects) {
                if (id == $scope.instantreports[key].Instantreport.id) {
                    objects[id] = $scope.instantreports[key].Instantreport.name
                }
            }
        }
        return objects
    };
    $scope.getObjectForDelete = function(instantreport) {
        var object = {};
        object[instantreport.Instantreport.id] = instantreport.Instantreport.name;
        return object
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.getObjectForDelete = function(instantreport) {
        var object = {};
        object[instantreport.Instantreport.id] = instantreport.Instantreport.name;
        return object
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ServicesIndexController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, MassChangeService, QueryStringService) {
    $rootScope.lastObjectName = null;
    SortService.setSort(QueryStringService.getValue('sort', ''));
    SortService.setDirection(QueryStringService.getValue('direction', ''));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Servicestatus: {
                current_state: QueryStringService.servicestate(),
                acknowledged: QueryStringService.getValue('has_been_acknowledged', !1) === '1',
                not_acknowledged: QueryStringService.getValue('has_not_been_acknowledged', !1) === '1',
                in_downtime: QueryStringService.getValue('in_downtime', !1) === '1',
                not_in_downtime: QueryStringService.getValue('not_in_downtime', !1) === '1',
                passive: QueryStringService.getValue('passive', !1) === '1',
                active: QueryStringService.getValue('active', !1) === '1',
                output: ''
            },
            Service: {
                id: QueryStringService.getIds('filter[Service.id][]', []),
                name: QueryStringService.getValue('filter[Service.servicename]', ''),
                keywords: '',
                not_keywords: ''
            },
            Host: {
                id: QueryStringService.getValue('filter[Host.id]', ''),
                name: QueryStringService.getValue('filter[Host.name]', '')
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/services/delete/';
    $scope.deactivateUrl = '/services/deactivate/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.serverResult = [];
    $scope.isLoadingGraph = !0;
    var lastHostUuid = null;
    var forTemplate = function(serverResponse) {
        var services = [];
        var servicesstatus = [];
        var hosts = [];
        var hostsstatusArr = [];
        var saved_hostuuids = [];
        var result = [];
        var lastendhost = "";
        var tmp_hostservicegroup = null;
        var graphStart = 0;
        var graphEnd = 0;
        serverResponse.forEach(function(record) {
            services.push(record.Service);
            servicesstatus.push([record.Service.id, record.Servicestatus]);
            if (saved_hostuuids.indexOf(record.Host.uuid) < 0) {
                hosts.push(record.Host);
                hostsstatusArr.push({
                    host_id: record.Host.id,
                    Hoststatus: record.Hoststatus
                });
                saved_hostuuids.push(record.Host.uuid)
            }
        });
        services.forEach(function(service) {
            if (lastendhost != service.host_id) {
                if (tmp_hostservicegroup !== null) {
                    result.push(tmp_hostservicegroup)
                }
                tmp_hostservicegroup = {};
                var host = null;
                var hoststatus = null;
                hosts.forEach(function(hostelem) {
                    if (hostelem.id == service.host_id) {
                        host = hostelem
                    }
                });
                hostsstatusArr.forEach(function(hoststatelem) {
                    if (hoststatelem.host_id == service.host_id) {
                        hoststatus = hoststatelem.Hoststatus
                    }
                });
                tmp_hostservicegroup = {
                    Host: host,
                    Hoststatus: hoststatus,
                    Services: []
                };
                lastendhost = service.host_id
            }
            var servicestatus = null;
            servicesstatus.forEach(function(servstatelem) {
                if (servstatelem[0] === service.id) {
                    servicestatus = servstatelem[1]
                }
            });
            tmp_hostservicegroup.Services.push({
                Service: service,
                Servicestatus: servicestatus
            })
        });
        if (tmp_hostservicegroup !== null) {
            result.push(tmp_hostservicegroup)
        }
        return result
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
    $scope.load = function() {
        lastHostUuid = null;
        var hasBeenAcknowledged = '';
        var inDowntime = '';
        if ($scope.filter.Servicestatus.acknowledged ^ $scope.filter.Servicestatus.not_acknowledged) {
            hasBeenAcknowledged = $scope.filter.Servicestatus.acknowledged === !0
        }
        if ($scope.filter.Servicestatus.in_downtime ^ $scope.filter.Servicestatus.not_in_downtime) {
            inDowntime = $scope.filter.Servicestatus.in_downtime === !0
        }
        var passive = '';
        if ($scope.filter.Servicestatus.passive ^ $scope.filter.Servicestatus.active) {
            passive = !$scope.filter.Servicestatus.passive
        }
        var params = {
            'angular': !0,
            'scroll': $scope.useScroll,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.filter.Host.id,
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Service.id][]': $scope.filter.Service.id,
            'filter[Service.servicename]': $scope.filter.Service.name,
            'filter[Servicestatus.output]': $scope.filter.Servicestatus.output,
            'filter[Servicestatus.current_state][]': $rootScope.currentStateForApi($scope.filter.Servicestatus.current_state),
            'filter[Service.keywords][]': $scope.filter.Service.keywords.split(','),
            'filter[Service.not_keywords][]': $scope.filter.Service.not_keywords.split(','),
            'filter[Servicestatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Servicestatus.scheduled_downtime_depth]': inDowntime,
            'filter[Servicestatus.active_checks_enabled]': passive
        };
        if (QueryStringService.hasValue('BrowserContainerId')) {
            params.BrowserContainerId = QueryStringService.getValue('BrowserContainerId')
        }
        $http.get("/services/index.json", {
            params: params
        }).then(function(result) {
            $scope.services = [];
            $scope.serverResult = result.data.all_services;
            $scope.services = forTemplate(result.data.all_services);
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.isNextHost = function(service) {
        if (service.Host.uuid !== lastHostUuid) {
            lastHostUuid = service.Host.uuid;
            return !0
        }
        return !1
    };
    $scope.selectAll = function() {
        if ($scope.services) {
            for (var key in $scope.serverResult) {
                if ($scope.serverResult[key].Service.allow_edit) {
                    var id = $scope.serverResult[key].Service.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(host, service) {
        var object = {};
        object[service.Service.id] = host.Host.hostname + '/' + service.Service.servicename;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.serverResult) {
            for (var id in selectedObjects) {
                if (id == $scope.serverResult[key].Service.id) {
                    objects[id] = $scope.serverResult[key].Host.hostname + '/' + $scope.serverResult[key].Service.servicename
                }
            }
        }
        return objects
    };
    $scope.getObjectsForExternalCommand = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.serverResult) {
            for (var id in selectedObjects) {
                if (id == $scope.serverResult[key].Service.id) {
                    objects[id] = $scope.serverResult[key]
                }
            }
        }
        return objects
    };
    $scope.linkForCopy = function() {
        var baseUrl = '/services/copy/';
        var ids = Object.keys(MassChangeService.getSelected());
        return baseUrl + ids.join('/')
    };
    $scope.linkForPdf = function() {
        var baseUrl = '/services/listToPdf.pdf?';
        var hasBeenAcknowledged = '';
        var inDowntime = '';
        if ($scope.filter.Servicestatus.acknowledged ^ $scope.filter.Servicestatus.not_acknowledged) {
            hasBeenAcknowledged = $scope.filter.Servicestatus.acknowledged === !0
        }
        if ($scope.filter.Servicestatus.in_downtime ^ $scope.filter.Servicestatus.not_in_downtime) {
            inDowntime = $scope.filter.Servicestatus.in_downtime === !0
        }
        var passive = '';
        if ($scope.filter.Servicestatus.passive) {
            passive = !$scope.filter.Servicestatus.passive
        }
        var params = {
            'angular': !0,
            'sort': SortService.getSort(),
            'page': $scope.currentPage,
            'direction': SortService.getDirection(),
            'filter[Host.id]': $scope.filter.Host.id,
            'filter[Host.name]': $scope.filter.Host.name,
            'filter[Service.id]': $scope.filter.Service.id,
            'filter[Service.servicename]': $scope.filter.Service.name,
            'filter[Servicestatus.output]': $scope.filter.Servicestatus.output,
            'filter[Servicestatus.current_state][]': $rootScope.currentStateForApi($scope.filter.Servicestatus.current_state),
            'filter[Service.keywords][]': $scope.filter.Service.keywords.split(','),
            'filter[Service.not_keywords][]': $scope.filter.Service.not_keywords.split(','),
            'filter[Servicestatus.problem_has_been_acknowledged]': hasBeenAcknowledged,
            'filter[Servicestatus.scheduled_downtime_depth]': inDowntime,
            'filter[Servicestatus.active_checks_enabled]': passive
        };
        if (QueryStringService.hasValue('BrowserContainerId')) {
            params.BrowserContainerId = QueryStringService.getValue('BrowserContainerId')
        }
        return baseUrl + $httpParamSerializer(params)
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
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
    $scope.problemsOnly = function() {
        defaultFilter();
        $scope.filter.Servicestatus.not_in_downtime = !0;
        $scope.filter.Servicestatus.not_acknowledged = !0;
        $scope.filter.Servicestatus.current_state = {
            ok: !1,
            warning: !0,
            critical: !0,
            unknown: !0
        };
        SortService.setSort('Servicestatus.last_state_change');
        SortService.setDirection('desc')
    };
    var loadGraph = function(host, service) {
        var serverTime = new Date($scope.timezone.server_time);
        graphEnd = Math.floor(serverTime.getTime() / 1000);
        graphStart = graphEnd - (3600 * 4);
        $http.get('/Graphgenerators/getPerfdataByUuid.json', {
            params: {
                angular: !0,
                host_uuid: host.Host.uuid,
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
        var color_amount = performance_data.length < 3 ? 3 : performance_data.length;
        var GraphDefaultsObj = new GraphDefaults();
        var colors = GraphDefaultsObj.getColors(color_amount);
        var options = GraphDefaultsObj.getDefaultOptions();
        options.height = '500px';
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
        options.xaxis.mode = 'time';
        options.xaxis.timeBase = 'milliseconds';
        options.xaxis.min = (graphStart + $scope.timezone.user_time_to_server_offset) * 1000;
        options.xaxis.max = (graphEnd + $scope.timezone.user_time_to_server_offset) * 1000;
        self.plot = $.plot('#serviceGraphFlot', graph_data, options)
    };
    defaultFilter();
    $scope.loadTimezone();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('AutomapsViewController', function($scope, $http, QueryStringService) {
    $scope.id = QueryStringService.getCakeId();
    $scope.init = !0;
    $scope.load = function() {
        var params = {
            'angular': !0
        };
        $http.get("/automaps/view/" + $scope.id + ".json", {
            params: params
        }).then(function(result) {
            $scope.automap = result.data.automap.Automap;
            $scope.hostAndServices = result.data.hostAndServices;
            $scope.init = !1
        })
    };
    $scope.load()
});
angular.module('openITCOCKPIT').controller('ContactsAddFromLdapController', function($scope, $http) {
    $scope.init = !0;
    $scope.isPhp7Dot1 = !1;
    $scope.selectedSamAccountName = '';
    $scope.errors = !1;
    $scope.loadUsers = function(searchString) {
        $http.get("/contacts/addFromLdap.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.users = result.data.usersForSelect;
            $scope.isPhp7Dot1 = result.data.isPhp7Dot1
        })
    };
    $scope.loadUsersByString = function(searchString) {
        $http.get("/contacts/loadLdapUserByString.json", {
            params: {
                'angular': !0,
                'samaccountname': searchString
            }
        }).then(function(result) {
            $scope.users = result.data.usersForSelect
        })
    };
    $scope.loadUsers()
});
angular.module('openITCOCKPIT').controller('SystemdowntimesNodeController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService, MassChangeService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Systemdowntime.from_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            Container: {
                name: ''
            },
            Systemdowntime: {
                author: '',
                comment: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/systemdowntimes/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/systemdowntimes/node.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Container.name]': $scope.filter.Container.name,
                'filter[Systemdowntime.author]': $scope.filter.Systemdowntime.author,
                'filter[Systemdowntime.comment]': $scope.filter.Systemdowntime.comment
            }
        }).then(function(result) {
            $scope.systemdowntimes = result.data.all_node_recurring_downtimes;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.selectAll = function() {
        if ($scope.systemdowntimes) {
            for (var key in $scope.systemdowntimes) {
                if ($scope.systemdowntimes[key].Container.allow_edit) {
                    var id = $scope.systemdowntimes[key].Systemdowntime.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(downtime) {
        var object = {};
        object[downtime.Systemdowntime.id] = downtime.Container.name;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.systemdowntimes) {
            for (var id in selectedObjects) {
                if (id == $scope.systemdowntimes[key].Systemdowntime.id) {
                    objects[id] = $scope.systemdowntimes[key].Container.name
                }
            }
        }
        return objects
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('NotificationsServicesController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'NotificationService.start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            Notification: {
                state: {
                    ok: !1,
                    warning: !1,
                    critical: !1,
                    unknown: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: '',
                contactname: '',
                hostname: '',
                commandname: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/notifications/services.json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[NotificationService.output]': $scope.filter.Notification.output,
                'filter[NotificationService.state][]': $rootScope.currentStateForApi($scope.filter.Notification.state),
                'filter[Contact.name]': $scope.filter.Notification.contactname,
                'filter[Command.name]': $scope.filter.Notification.commandname,
                'filter[Host.name]': $scope.filter.Notification.hostname,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.notifications = result.data.all_notifications;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('SystemdowntimesHostgroupController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService, MassChangeService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Systemdowntime.from_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            Container: {
                name: ''
            },
            Systemdowntime: {
                author: '',
                comment: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/systemdowntimes/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/systemdowntimes/hostgroup.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Container.name]': $scope.filter.Container.name,
                'filter[Systemdowntime.author]': $scope.filter.Systemdowntime.author,
                'filter[Systemdowntime.comment]': $scope.filter.Systemdowntime.comment
            }
        }).then(function(result) {
            $scope.systemdowntimes = result.data.all_hostgroup_recurring_downtimes;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.selectAll = function() {
        if ($scope.systemdowntimes) {
            for (var key in $scope.systemdowntimes) {
                if ($scope.systemdowntimes[key].Hostgroup.allow_edit) {
                    var id = $scope.systemdowntimes[key].Systemdowntime.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(downtime) {
        var object = {};
        object[downtime.Systemdowntime.id] = downtime.Container.name;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.systemdowntimes) {
            for (var id in selectedObjects) {
                if (id == $scope.systemdowntimes[key].Systemdowntime.id) {
                    objects[id] = $scope.systemdowntimes[key].Container.name
                }
            }
        }
        return objects
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('SystemdowntimesAddContainerdowntimeController', function($scope, $http) {
    $scope.init = !0;
    $scope.errors = null;
    $scope.Downtime = {
        is_recurring: !1,
        is_inherit: !1
    };
    $scope.post = {
        params: {
            'angular': !0
        },
        Systemdowntime: {
            is_recurring: 0,
            inherit_downtime: 0,
            weekdays: {},
            day_of_month: null,
            from_date: null,
            from_time: null,
            to_date: null,
            to_time: null,
            duration: null,
            downtimetype: 'container',
            downtimetype_id: 0,
            objecttype_id: 4,
            object_id: {},
            comment: null
        }
    };
    $scope.loadRefillData = function() {
        $http.get("/angular/downtime_host.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.Systemdowntime.downtimetype_id = result.data.preselectedDowntimetype
        });
        $http.get("/angular/getDowntimeData.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.Systemdowntime.from_date = result.data.refill.from_date;
            $scope.post.Systemdowntime.from_time = result.data.refill.from_time;
            $scope.post.Systemdowntime.to_date = result.data.refill.to_date;
            $scope.post.Systemdowntime.to_time = result.data.refill.to_time;
            $scope.post.Systemdowntime.comment = result.data.refill.comment;
            $scope.post.Systemdowntime.duration = result.data.refill.duration;
            $scope.errors = null
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadRefillData();
    $scope.saveNewContainerDowntime = function() {
        if ($scope.containerIds) {
            $scope.post.Systemdowntime.object_id = $scope.containerIds
        }
        if ($scope.post.Systemdowntime.is_recurring) {
            $scope.post.Systemdowntime.to_time = null;
            $scope.post.Systemdowntime.to_date = null;
            $scope.post.Systemdowntime.from_date = null
        }
        $http.post("/systemdowntimes/addContainerdowntime.json?angular=true", $scope.post).then(function(result) {
            $scope.errors = null;
            if ($scope.post.Systemdowntime.is_recurring) {
                window.location.href = '/systemdowntimes/node'
            } else {
                window.location.href = '/downtimes/host'
            }
        }, function errorCallback(result) {
            console.error(result.data);
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error[0]
            }
        })
    };
    $scope.loadContainers = function() {
        $http.get("/containers/loadContainersForAngular.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.errors = null
        }, function errorCallback(result) {
            console.error(result);
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadContainers();
    $scope.$watch('Downtime.is_recurring', function() {
        if ($scope.Downtime.is_recurring === !0) {
            $scope.post.Systemdowntime.is_recurring = 1;
            if ($scope.errors && $scope.errors.from_time) {
                delete $scope.errors.from_time
            }
        }
        if ($scope.Downtime.is_recurring === !1) {
            $scope.post.Systemdowntime.is_recurring = 0
        }
    });
    $scope.$watch('Downtime.is_inherit', function() {
        if ($scope.Downtime.is_inherit === !0) {
            $scope.post.Systemdowntime.inherit_downtime = 1
        }
        if ($scope.Downtime.is_inherit === !1) {
            $scope.post.Systemdowntime.inherit_downtime = 0
        }
    })
});
angular.module('openITCOCKPIT').controller('ServicegroupsAddController', function($scope, $http) {
    $scope.post = {
        Container: {
            name: '',
            parent_id: 0
        },
        Servicegroup: {
            description: '',
            servicegroup_url: '',
            Service: [],
            Servicetemplate: []
        }
    };
    $scope.init = !0;
    $scope.load = function() {
        $http.get("/servicegroups/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.init = !1
        })
    };
    $scope.loadServices = function(searchString) {
        if ($scope.post.Container.parent_id) {
            $http.get("/services/loadServicesByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Container.parent_id,
                    'filter[Host.name]': searchString,
                    'filter[Service.servicename]': searchString,
                    'selected[]': $scope.post.Servicegroup.Service
                }
            }).then(function(result) {
                $scope.services = result.data.services
            })
        }
    };
    $scope.loadServicetemplates = function(searchString) {
        $http.get("/servicetemplates/loadServicetemplatesByContainerId.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Container.parent_id,
                'filter[Servicetemplate.name]': searchString,
                'selected[]': $scope.post.Servicegroup.Servicetemplate
            }
        }).then(function(result) {
            $scope.servicetemplates = result.data.servicetemplates
        })
    };
    $scope.submit = function() {
        $http.post("/servicegroups/add.json?angular=true", $scope.post).then(function(result) {
            window.location.href = '/servicegroups/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.$watch('post.Container.parent_id', function() {
        if ($scope.init) {
            return
        }
        $scope.loadServices('');
        $scope.loadServicetemplates('')
    }, !0);
    $scope.load()
});
angular.module('openITCOCKPIT').controller('SystemdowntimesAddHostgroupdowntimeController', function($scope, $http) {
    $scope.init = !0;
    $scope.errors = null;
    $scope.Downtime = {
        is_recurring: !1
    };
    $scope.post = {
        params: {
            'angular': !0
        },
        Systemdowntime: {
            is_recurring: !1,
            weekdays: {},
            day_of_month: null,
            from_date: null,
            from_time: null,
            to_date: null,
            to_time: null,
            duration: null,
            downtimetype: 'hostgroup',
            downtimetype_id: 0,
            objecttype_id: 1024,
            object_id: null,
            comment: null
        }
    };
    $scope.loadRefillData = function() {
        $http.get("/angular/downtime_host.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.Systemdowntime.downtimetype_id = result.data.preselectedDowntimetype
        });
        $http.get("/angular/getDowntimeData.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.Systemdowntime.from_date = result.data.refill.from_date;
            $scope.post.Systemdowntime.from_time = result.data.refill.from_time;
            $scope.post.Systemdowntime.to_date = result.data.refill.to_date;
            $scope.post.Systemdowntime.to_time = result.data.refill.to_time;
            $scope.post.Systemdowntime.comment = result.data.refill.comment;
            $scope.post.Systemdowntime.duration = result.data.refill.duration;
            $scope.errors = null
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadRefillData();
    $scope.saveNewHostgroupDowntime = function() {
        $scope.post.Systemdowntime.object_id = $scope.hostgroupIds;
        if ($scope.post.Systemdowntime.is_recurring) {
            $scope.post.Systemdowntime.to_time = null;
            $scope.post.Systemdowntime.to_date = null;
            $scope.post.Systemdowntime.from_date = null
        }
        $http.post("/systemdowntimes/addHostgroupdowntime.json?angular=true", $scope.post).then(function(result) {
            $scope.errors = null;
            if ($scope.post.Systemdowntime.is_recurring) {
                window.location.href = '/systemdowntimes/hostgroup'
            } else {
                window.location.href = '/downtimes/host'
            }
        }, function errorCallback(result) {
            console.error(result.data);
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error[0]
            }
        })
    };
    $scope.loadHostgroups = function(searchString) {
        $http.get("/hostgroups/loadHostgroupsByString.json", {
            params: {
                'angular': !0,
                'filter[Container.name]': searchString,
                'selected[]': $scope.hostgroupIds
            }
        }).then(function(result) {
            $scope.hostgroups = result.data.hostgroups;
            $scope.errors = null
        }, function errorCallback(result) {
            console.error(result);
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadHostgroups('');
    $scope.$watch('Downtime.is_recurring', function() {
        if ($scope.Downtime.is_recurring === !0) {
            $scope.post.Systemdowntime.is_recurring = 1;
            if ($scope.errors && $scope.errors.from_time) {
                delete $scope.errors.from_time
            }
        }
        if ($scope.Downtime.is_recurring === !1) {
            $scope.post.Systemdowntime.is_recurring = 0
        }
    })
});
angular.module('openITCOCKPIT').controller('AdministratorsQuerylogController', function($scope, $http) {
    $scope.init = !0;
    $scope.connectionError = !1;
    $scope.connected = !1;
    $scope.queryLog = [];
    $scope.onError = function(event) {
        $scope.connectionError = !0;
        console.log(event)
    };
    $scope.onOpen = function(event) {
        $scope.connected = !0
    };
    $scope.onMessage = function(event) {
        $scope.queryLog.unshift(JSON.parse(event.data));
        if ($scope.queryLog.length > 15) {
            $scope.queryLog.pop()
        }
    };
    $scope.truncate = function() {
        $scope.queryLog = []
    };
    $scope.connectToQueryLogServer = function() {
        $http.get("/angular/websocket_configuration.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.websocketConfig = result.data.websocket;
            $scope.connection = new WebSocket($scope.websocketConfig['QUERY_LOG.URL']);
            $scope.connection.onerror = $scope.onError;
            $scope.connection.onopen = $scope.onOpen;
            $scope.connection.onmessage = $scope.onMessage
        })
    };
    $scope.connectToQueryLogServer()
});
angular.module('openITCOCKPIT').controller('ContactsUsedByController', function($scope, $http, QueryStringService) {
    $scope.id = QueryStringService.getCakeId();
    $scope.total = 0;
    $scope.load = function() {
        $http.get("/contacts/usedBy/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.contactWithRelations = result.data.contactWithRelations;
            $scope.total = $scope.getTotal()
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.getTotal = function() {
        var total = 0;
        total += $scope.contactWithRelations.Hosttemplate.length;
        total += $scope.contactWithRelations.Host.length;
        total += $scope.contactWithRelations.Servicetemplate.length;
        total += $scope.contactWithRelations.Service.length;
        total += $scope.contactWithRelations.Hostescalation.length;
        total += $scope.contactWithRelations.Serviceescalation.length;
        total += $scope.contactWithRelations.Contactgroup.length;
        return total
    };
    $scope.load()
});
angular.module('openITCOCKPIT').controller('SystemdowntimesServiceController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService, MassChangeService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Systemdowntime.from_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            Host: {
                name: ''
            },
            Systemdowntime: {
                author: '',
                comment: ''
            },
            servicename: ''
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/systemdowntimes/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/systemdowntimes/service.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Host.name]': $scope.filter.Host.name,
                'filter[servicename]': $scope.filter.servicename,
                'filter[Systemdowntime.author]': $scope.filter.Systemdowntime.author,
                'filter[Systemdowntime.comment]': $scope.filter.Systemdowntime.comment
            }
        }).then(function(result) {
            $scope.systemdowntimes = result.data.all_service_recurring_downtimes;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.selectAll = function() {
        if ($scope.systemdowntimes) {
            for (var key in $scope.systemdowntimes) {
                if ($scope.systemdowntimes[key].Host.allow_edit) {
                    var id = $scope.systemdowntimes[key].Systemdowntime.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(downtime) {
        var object = {};
        object[downtime.Systemdowntime.id] = downtime.Host.hostname;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.systemdowntimes) {
            for (var id in selectedObjects) {
                if (id == $scope.systemdowntimes[key].Systemdowntime.id) {
                    objects[id] = $scope.systemdowntimes[key].Host.hostname
                }
            }
        }
        return objects
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('StatisticsIndexController', function($scope, $http) {
    $scope.post = {
        statistics: {
            decision: 2
        }
    };
    $scope.init = !0;
    $scope.load = function() {
        $http.get("/statistics/index.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.settings = result.data.settings;
            $scope.settings.Systemsetting.value = parseInt($scope.settings.Systemsetting.value, 10);
            $scope.init = !1
        })
    };
    $scope.save = function(value) {
        $scope.post.statistics.decision = value;
        $http.post("/statistics/saveStatisticDecision.json", $scope.post).then(function(result) {
            $scope.load()
        })
    };
    $scope.load()
});
angular.module('openITCOCKPIT').controller('DowntimesHostController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService, MassChangeService, $interval) {
    SortService.setSort(QueryStringService.getValue('sort', 'DowntimeHost.scheduled_start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    var now = new Date();
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            DowntimeHost: {
                author_name: '',
                comment_data: '',
                was_cancelled: !1,
                was_not_cancelled: !1
            },
            Host: {
                name: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2)),
            isRunning: !1,
            hideExpired: !0
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/downtimes/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var wasCancelled = '';
        if ($scope.filter.DowntimeHost.was_cancelled ^ $scope.filter.DowntimeHost.was_not_cancelled) {
            wasCancelled = $scope.filter.DowntimeHost.was_cancelled === !0
        }
        $http.get("/downtimes/host.json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[DowntimeHost.author_name]': $scope.filter.DowntimeHost.author_name,
                'filter[DowntimeHost.comment_data]': $scope.filter.DowntimeHost.comment_data,
                'filter[DowntimeHost.was_cancelled]': wasCancelled,
                'filter[Host.name]': $scope.filter.Host.name,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to,
                'filter[hideExpired]': $scope.filter.hideExpired,
                'filter[isRunning]': $scope.filter.isRunning
            }
        }).then(function(result) {
            $scope.downtimes = result.data.all_host_downtimes;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.selectAll = function() {
        if ($scope.downtimes) {
            for (var key in $scope.downtimes) {
                var id = $scope.downtimes[key].DowntimeHost.internalDowntimeId;
                $scope.massChange[id] = !0
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectForDelete = function(downtime) {
        var object = {};
        object[downtime.DowntimeHost.internalDowntimeId] = downtime.Host.hostname;
        return object
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.downtimes) {
            for (var id in selectedObjects) {
                if ($scope.downtimes[key].DowntimeHost.allowEdit && $scope.downtimes[key].DowntimeHost.isCancellable) {
                    if (id == $scope.downtimes[key].DowntimeHost.internalDowntimeId) {
                        objects[id] = $scope.downtimes[key].Host.hostname
                    }
                }
            }
        }
        return objects
    };
    $scope.showHostDowntimeFlashMsg = function() {
        $scope.showFlashSuccess = !0;
        $scope.autoRefreshCounter = 5;
        var interval = $interval(function() {
            $scope.autoRefreshCounter--;
            if ($scope.autoRefreshCounter === 0) {
                $scope.load();
                $interval.cancel(interval);
                $scope.showFlashSuccess = !1
            }
        }, 1000)
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ProfileEditController', function($scope, $http) {
    $scope.init = !0;
    $scope.apikeys = [];
    $scope.load = function() {
        var params = {
            'angular': !0
        };
        $http.get("/profile/apikey.json", {
            params: params
        }).then(function(result) {
            $scope.apikeys = result.data.apikeys;
            $scope.init = !1
        })
    };
    $scope.load()
});
angular.module('openITCOCKPIT').controller('ContactgroupsUsedByController', function($scope, $http, QueryStringService) {
    $scope.id = QueryStringService.getCakeId();
    $scope.total = 0;
    $scope.load = function() {
        $http.get("/contactgroups/usedBy/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.contactgroupWithRelations = result.data.contactgroupWithRelations;
            $scope.total = $scope.getTotal()
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.getTotal = function() {
        var total = 0;
        total += $scope.contactgroupWithRelations.Hosttemplate.length;
        total += $scope.contactgroupWithRelations.Host.length;
        total += $scope.contactgroupWithRelations.Servicetemplate.length;
        total += $scope.contactgroupWithRelations.Service.length;
        total += $scope.contactgroupWithRelations.Hostescalation.length;
        total += $scope.contactgroupWithRelations.Serviceescalation.length;
        return total
    };
    $scope.load()
});
angular.module('openITCOCKPIT').controller('HostgroupsIndexController', function($scope, $http, SortService, MassChangeService) {
    SortService.setSort('Container.name');
    SortService.setDirection('asc');
    $scope.currentPage = 1;
    var defaultFilter = function() {
        $scope.filter = {
            container: {
                name: ''
            },
            hostgroup: {
                description: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/hostgroups/delete/';
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/hostgroups/index.json", {
            params: {
                'angular': !0,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Container.name]': $scope.filter.container.name,
                'filter[Hostgroup.description]': $scope.filter.hostgroup.description
            }
        }).then(function(result) {
            $scope.hostgroups = result.data.all_hostgroups;
            $scope.paging = result.data.paging;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.selectAll = function() {
        if ($scope.hostgroups) {
            for (var key in $scope.hostgroups) {
                if ($scope.hostgroups[key].Hostgroup.allowEdit) {
                    var id = $scope.hostgroups[key].Hostgroup.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.hostgroups) {
            for (var id in selectedObjects) {
                if (id == $scope.hostgroups[key].Hostgroup.id) {
                    objects[id] = $scope.hostgroups[key].Container.name
                }
            }
        }
        return objects
    };
    $scope.linkForPdf = function() {
        var baseUrl = '/hostgroups/listToPdf.pdf';
        baseUrl += '?filter[Container.name]=' + encodeURI($scope.filter.container.name);
        baseUrl += '&filter[Hostgroup.description]=' + encodeURI($scope.filter.hostgroup.description);
        return baseUrl
    };
    $scope.changepage = function(page) {
        $scope.undoSelection();
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.deleteSelected = function() {
        console.log('Delete');
        console.log()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0)
});
angular.module('openITCOCKPIT').controller('ConfigurationFilesEditController', function($scope, $http) {
    $scope.isRestoring = !1;
    $scope.askRestoreDefault = function() {
        $('#angularConfirmRestoreDefault').modal('show')
    };
    $scope.restoreDefault = function(dbKey) {
        $scope.isRestoring = !0;
        $http.post("/ConfigurationFiles/restorDefault/" + dbKey + ".json?angular=true", {}).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/ConfigurationFiles/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    }
});
angular.module('openITCOCKPIT').controller('HostchecksIndexController', function($scope, $http, $rootScope, $httpParamSerializer, SortService, QueryStringService) {
    SortService.setSort(QueryStringService.getValue('sort', 'Hostcheck.start_time'));
    SortService.setDirection(QueryStringService.getValue('direction', 'desc'));
    $scope.currentPage = 1;
    $scope.id = QueryStringService.getCakeId();
    $scope.useScroll = !0;
    var now = new Date();
    var defaultFilter = function() {
        $scope.filter = {
            Hostcheck: {
                state: {
                    recovery: !1,
                    down: !1,
                    unreachable: !1
                },
                state_types: {
                    soft: !1,
                    hard: !1
                },
                output: ''
            },
            from: date('d.m.Y H:i', now.getTime() / 1000 - (3600 * 24 * 30)),
            to: date('d.m.Y H:i', now.getTime() / 1000 + (3600 * 24 * 30 * 2))
        }
    };
    $scope.init = !0;
    $scope.showFilter = !1;
    $scope.load = function() {
        var state_type = '';
        if ($scope.filter.Hostcheck.state_types.soft ^ $scope.filter.Hostcheck.state_types.hard) {
            state_type = 0;
            if ($scope.filter.Hostcheck.state_types.hard === !0) {
                state_type = 1
            }
        }
        $http.get("/hostchecks/index/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[Hostcheck.output]': $scope.filter.Hostcheck.output,
                'filter[Hostcheck.state][]': $rootScope.currentStateForApi($scope.filter.Hostcheck.state),
                'filter[Hostcheck.state_type]': state_type,
                'filter[from]': $scope.filter.from,
                'filter[to]': $scope.filter.to
            }
        }).then(function(result) {
            $scope.hostchecks = result.data.all_hostchecks;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        })
    };
    $scope.triggerFilter = function() {
        $scope.showFilter = !$scope.showFilter === !0
    };
    $scope.resetFilter = function() {
        defaultFilter()
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    defaultFilter();
    SortService.setCallback($scope.load);
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.load()
    }, !0)
});
angular.module('openITCOCKPIT').controller('HostgroupsAddController', function($scope, $http) {
    $scope.post = {
        Container: {
            name: '',
            parent_id: 0
        },
        Hostgroup: {
            description: '',
            hostgroup_url: '',
            Host: [],
            Hosttemplate: []
        }
    };
    $scope.init = !0;
    $scope.load = function() {
        $http.get("/hostgroups/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.init = !1
        })
    };
    $scope.loadHosts = function(searchString) {
        $http.get("/hostgroups/loadHosts.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Container.parent_id,
                'filter[Host.name]': searchString,
                'selected[]': $scope.post.Hostgroup.Host
            }
        }).then(function(result) {
            $scope.hosts = result.data.hosts
        })
    };
    $scope.loadHosttemplates = function(searchString) {
        $http.get("/hostgroups/loadHosttemplates.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Container.parent_id,
                'filter[Hosttemplate.name]': searchString,
                'selected[]': $scope.post.Hostgroup.Hosttemplate
            }
        }).then(function(result) {
            $scope.hosttemplates = result.data.hosttemplates
        })
    };
    $scope.submit = function() {
        $http.post("/hostgroups/add.json?angular=true", $scope.post).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/hostgroups/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.$watch('post.Container.parent_id', function() {
        if ($scope.init) {
            return
        }
        $scope.loadHosts('');
        $scope.loadHosttemplates('')
    }, !0);
    $scope.load()
});
angular.module('openITCOCKPIT').controller('SystemdowntimesAddHostdowntimeController', function($scope, $http, QueryStringService) {
    $scope.init = !0;
    $scope.errors = null;
    $scope.hostIds = [];
    $scope.hostIds.push(QueryStringService.getCakeId());
    $scope.Downtime = {
        is_recurring: !1
    };
    $scope.post = {
        params: {
            'angular': !0
        },
        Systemdowntime: {
            is_recurring: 0,
            weekdays: {},
            day_of_month: null,
            from_date: null,
            from_time: null,
            to_date: null,
            to_time: null,
            duration: null,
            downtimetype: 'host',
            downtimetype_id: 0,
            objecttype_id: 256,
            object_id: null,
            comment: null
        }
    };
    $scope.loadRefillData = function() {
        $http.get("/angular/downtime_host.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.Systemdowntime.downtimetype_id = result.data.preselectedDowntimetype
        });
        $http.get("/angular/getDowntimeData.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.Systemdowntime.from_date = result.data.refill.from_date;
            $scope.post.Systemdowntime.from_time = result.data.refill.from_time;
            $scope.post.Systemdowntime.to_date = result.data.refill.to_date;
            $scope.post.Systemdowntime.to_time = result.data.refill.to_time;
            $scope.post.Systemdowntime.comment = result.data.refill.comment;
            $scope.post.Systemdowntime.duration = result.data.refill.duration;
            $scope.errors = null
        }, function errorCallback(result) {
            console.error(result);
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadRefillData();
    $scope.saveNewHostDowntime = function() {
        $scope.post.Systemdowntime.object_id = $scope.hostIds;
        if ($scope.post.Systemdowntime.is_recurring) {
            $scope.post.Systemdowntime.to_time = null;
            $scope.post.Systemdowntime.to_date = null;
            $scope.post.Systemdowntime.from_date = null
        }
        console.log($scope.post);
        $http.post("/systemdowntimes/addHostdowntime.json?angular=true", $scope.post).then(function(result) {
            $scope.errors = null;
            if ($scope.post.Systemdowntime.is_recurring) {
                window.location.href = '/systemdowntimes/host'
            } else {
                window.location.href = '/downtimes/host'
            }
        }, function errorCallback(result) {
            console.error(result.data);
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error[0]
            }
        })
    };
    $scope.loadHosts = function(searchString) {
        $http.get("/hosts/loadHostsByString/1.json", {
            params: {
                'angular': !0,
                'filter[Host.name]': searchString,
                'selected[]': $scope.hostIds
            }
        }).then(function(result) {
            $scope.hosts = result.data.hosts
        })
    };
    $scope.loadHosts('');
    $scope.$watch('Downtime.is_recurring', function() {
        if ($scope.Downtime.is_recurring === !0) {
            $scope.post.Systemdowntime.is_recurring = 1;
            if ($scope.errors && $scope.errors.from_time) {
                delete $scope.errors.from_time
            }
        }
        if ($scope.Downtime.is_recurring === !1) {
            $scope.post.Systemdowntime.is_recurring = 0
        }
    })
});
angular.module('openITCOCKPIT').controller('ServicegroupsEditController', function($scope, $http, QueryStringService) {
    $scope.post = {
        Container: {
            name: '',
            parent_id: 0
        },
        Servicegroup: {
            description: '',
            servicegroup_url: '',
            Service: [],
            Servicetemplate: []
        }
    };
    $scope.id = QueryStringService.getCakeId();
    $scope.deleteUrl = "/servicegroups/delete/" + $scope.id + ".json?angular=true";
    $scope.sucessUrl = '/servicegroups/index';
    $scope.init = !0;
    $scope.load = function() {
        $http.get("/servicegroups/edit/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.servicegroup = result.data.servicegroup;
            var selectedServices = [];
            var selectedServicetemplates = [];
            var key;
            for (key in $scope.servicegroup.Service) {
                selectedServices.push(parseInt($scope.servicegroup.Service[key].id, 10))
            }
            for (key in $scope.servicegroup.Servicetemplate) {
                selectedServicetemplates.push(parseInt($scope.servicegroup.Servicetemplate[key].id, 10))
            }
            $scope.post.Servicegroup.Service = selectedServices;
            $scope.post.Servicegroup.Servicetemplate = selectedServicetemplates;
            $scope.post.Container.name = $scope.servicegroup.Container.name;
            $scope.post.Container.parent_id = parseInt($scope.servicegroup.Container.parent_id, 10);
            $scope.post.Servicegroup.description = $scope.servicegroup.Servicegroup.description;
            $scope.post.Servicegroup.servicegroup_url = $scope.servicegroup.Servicegroup.servicegroup_url;
            $scope.init = !1
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.loadContainers = function() {
        $http.get("/servicegroups/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.load()
        })
    };
    $scope.loadServices = function(searchString) {
        if ($scope.post.Container.parent_id) {
            $http.get("/services/loadServicesByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Container.parent_id,
                    'filter[Host.name]': searchString,
                    'filter[Service.servicename]': searchString,
                    'selected[]': $scope.post.Servicegroup.Service
                }
            }).then(function(result) {
                $scope.services = result.data.services
            })
        }
    };
    $scope.loadServicetemplates = function(searchString) {
        $http.get("/servicetemplates/loadServicetemplatesByContainerId.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Container.parent_id,
                'filter[Servicetemplate.name]': searchString,
                'selected[]': $scope.post.Servicegroup.Servicetemplate
            }
        }).then(function(result) {
            $scope.servicetemplates = result.data.servicetemplates
        })
    };
    $scope.submit = function() {
        $http.post("/servicegroups/edit/" + $scope.id + ".json?angular=true", $scope.post).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/servicegroups/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.$watch('post.Container.parent_id', function() {
        if ($scope.init) {
            return
        }
        $scope.loadServices('');
        $scope.loadServicetemplates('')
    }, !0);
    $scope.loadContainers()
});
angular.module('openITCOCKPIT').controller('InstantreportsAddController', function($scope, $http) {
    $scope.types = {
        TYPE_HOSTGROUPS: '1',
        TYPE_HOSTS: '2',
        TYPE_SERVICEGROUPS: '3',
        TYPE_SERVICES: '4'
    }
    $scope.post = {
        Instantreport: {
            container_id: null,
            name: '',
            type: $scope.types.TYPE_HOSTGROUPS,
            timeperiod_id: '0',
            reflection: '1',
            summary: !1,
            downtimes: !1,
            send_email: !1,
            send_interval: '1',
            evaluation: '2',
            Hostgroup: [],
            Host: [],
            Servicegroup: [],
            Service: [],
            User: []
        }
    };
    $scope.init = !0;
    $scope.load = function() {
        $http.get("/instantreports/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.init = !1
        })
    };
    $scope.loadTimeperiods = function() {
        $http.get("/timeperiods/loadTimeperiodsByContainerId.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Instantreport.container_id
            }
        }).then(function(result) {
            $scope.timeperiods = result.data.timeperiods
        })
    };
    $scope.loadHostgroups = function() {
        if ($scope.init) {
            return
        }
        if ($scope.post.Instantreport.container_id) {
            $http.get("/hostgroups/loadHosgroupsByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id
                }
            }).then(function(result) {
                $scope.hostgroups = result.data.hostgroups
            })
        }
    };
    $scope.loadHosts = function(searchString) {
        if ($scope.post.Instantreport.container_id) {
            $http.get("/hosts/loadHostsByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id,
                    'filter[Host.name]': searchString,
                    'selected[]': $scope.post.Instantreport.Host
                }
            }).then(function(result) {
                $scope.hosts = result.data.hosts
            })
        }
    };
    $scope.loadServicegroups = function() {
        if ($scope.init) {
            return
        }
        if ($scope.post.Instantreport.container_id) {
            $http.get("/servicegroups/loadServicegroupsByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id
                }
            }).then(function(result) {
                $scope.servicegroups = result.data.servicegroups
            })
        }
    };
    $scope.loadServices = function(searchString) {
        if ($scope.post.Instantreport.container_id) {
            $http.get("/services/loadServicesByContainerId.json", {
                params: {
                    'angular': !0,
                    'containerId': $scope.post.Instantreport.container_id,
                    'filter[Host.name]': searchString,
                    'filter[Service.servicename]': searchString,
                    'selected[]': $scope.post.Instantreport.Service
                }
            }).then(function(result) {
                $scope.services = result.data.services
            })
        }
    };
    $scope.loadUsers = function() {
        $http.get("/users/loadUsersByContainerId.json", {
            params: {
                'angular': !0,
                'containerId': $scope.post.Instantreport.container_id,
                'selected[]': $scope.post.Instantreport.User
            }
        }).then(function(result) {
            $scope.users = result.data.users
        })
    };
    $scope.submit = function() {
        $http.post("/instantreports/add.json?angular=true", $scope.post).then(function(result) {
            window.location.href = '/instantreports/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.resetOnTypeChange = function() {
        $scope.post.Instantreport.Hostgroup = [];
        $scope.post.Instantreport.Host = [];
        $scope.post.Instantreport.Servicegroup = [];
        $scope.post.Instantreport.Service = []
    }
    $scope.$watch('post.Instantreport.container_id', function() {
        if ($scope.init) {
            return
        }
        switch ($scope.post.Instantreport.type) {
            case $scope.types.TYPE_HOSTGROUPS:
                $scope.loadHostgroups('');
                break;
            case $scope.types.TYPE_HOSTS:
                $scope.loadHosts('');
                break;
            case $scope.types.TYPE_SERVICEGROUPS:
                $scope.loadServicegroups('');
                break;
            case $scope.types.TYPE_SERVICES:
                $scope.loadServices('');
                break
        }
        $scope.loadTimeperiods('');
        $scope.loadUsers('')
    }, !0);
    $scope.$watch('post.Instantreport.type', function() {
        if ($scope.init) {
            return
        }
        $scope.resetOnTypeChange();
        switch ($scope.post.Instantreport.type) {
            case $scope.types.TYPE_HOSTGROUPS:
                $scope.loadHostgroups('');
                break;
            case $scope.types.TYPE_HOSTS:
                $scope.loadHosts('');
                break;
            case $scope.types.TYPE_SERVICEGROUPS:
                $scope.loadServicegroups('');
                break;
            case $scope.types.TYPE_SERVICES:
                $scope.loadServices('');
                break
        }
    }, !0);
    $scope.$watch('post.Instantreport.send_email', function() {
        if ($scope.init) {
            return
        }
        if (!$scope.post.Instantreport.send_email) {
            $scope.post.Instantreport.send_interval = '0';
            $scope.post.Instantreport.User = []
        }
    }, !0);
    $scope.load()
});
angular.module('openITCOCKPIT').controller('DashboardsIndexController', function($scope, $http, $timeout, $interval) {
    $scope.init = !0;
    $scope.activeTab = null;
    $scope.availableWidgets = [];
    $scope.fullscreen = !1;
    $scope.errors = {};
    $scope.viewTabRotateInterval = 0;
    $scope.intervalText = 'disabled';
    $scope.dashboardIsLocked = !1;
    $scope.gridsterOpts = {
        minRows: 2,
        maxRows: 999,
        columns: 12,
        colWidth: 'auto',
        rowHeight: 25,
        margins: [10, 10],
        defaultSizeX: 2,
        defaultSizeY: 1,
        mobileBreakPoint: 600,
        resizable: {
            enabled: !0,
            start: function(event, uiWidget, $element) {},
            resize: function(event, uiWidget, $element) {},
            stop: function(event, uiWidget, $element) {}
        },
        draggable: {
            enabled: !0,
            handle: '.ui-sortable-handle',
            start: function(event, uiWidget, $element) {},
            drag: function(event, uiWidget, $element) {},
            stop: function(event, uiWidget, $element) {}
        }
    };
    var tabSortCreated = !1;
    var intervalId = null;
    var disableWatch = !1;
    var watchTimeout = null;
    var genericError = function() {
        new Noty({
            theme: 'metroui',
            type: 'error',
            text: 'Error while saving data',
            timeout: 3500
        }).show()
    };
    var genericSuccess = function() {
        new Noty({
            theme: 'metroui',
            type: 'success',
            text: 'Data saved successfully',
            timeout: 3500
        }).show()
    };
    $scope.enableWatch = function() {
        setTimeout(function() {
            disableWatch = !1
        }, 500)
    };
    $scope.load = function() {
        $http.get("/dashboards/index.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.tabs = result.data.tabs;
            if ($scope.activeTab === null) {
                $scope.activeTab = $scope.tabs[0].id
            }
            $scope.viewTabRotateInterval = result.data.tabRotationInterval;
            updateInterval();
            $scope.availableWidgets = result.data.widgets;
            createTabSort();
            $scope.loadTabContent($scope.activeTab);
            $scope.init = !1
        })
    };
    $scope.loadTabContent = function(tabId) {
        disableWatch = !0;
        $http.get("/dashboards/getWidgetsForTab/" + tabId + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.activeTab = tabId;
            for (var k in $scope.tabs) {
                if ($scope.tabs[k].id === $scope.activeTab) {
                    if ($scope.tabs[k].locked === !0) {
                        $scope.dashboardIsLocked = !0;
                        $scope.gridsterOpts.resizable.enabled = !1;
                        $scope.gridsterOpts.draggable.enabled = !1
                    } else {
                        $scope.dashboardIsLocked = !1;
                        $scope.gridsterOpts.resizable.enabled = !0;
                        $scope.gridsterOpts.draggable.enabled = !0
                    }
                    break
                }
            }
            var widgets = [];
            for (var i in result.data.widgets.Widget) {
                widgets.push({
                    sizeX: parseInt(result.data.widgets.Widget[i].width, 10),
                    sizeY: parseInt(result.data.widgets.Widget[i].height, 10),
                    col: parseInt(result.data.widgets.Widget[i].col, 10),
                    row: parseInt(result.data.widgets.Widget[i].row, 10),
                    id: parseInt(result.data.widgets.Widget[i].id, 10),
                    icon: result.data.widgets.Widget[i].icon,
                    title: result.data.widgets.Widget[i].title,
                    color: result.data.widgets.Widget[i].color,
                    directive: result.data.widgets.Widget[i].directive
                })
            }
            $scope.activeWidgets = widgets;
            for (var k in $scope.tabs) {
                if ($scope.tabs[k].id === $scope.activeTab && $scope.tabs[k].source_tab_id > 0) {
                    if ($scope.tabs[k].check_for_updates === !0) {
                        checkForUpdates($scope.activeTab)
                    }
                }
            }
        })
    };
    $scope.saveGrid = function() {
        if ($scope.dashboardIsLocked) {
            return
        }
        if ($scope.activeWidgets.length === 0) {
            return
        }
        var postData = [];
        for (var i in $scope.activeWidgets) {
            postData.push({
                Widget: {
                    id: $scope.activeWidgets[i].id,
                    dashboard_tab_id: $scope.activeTab,
                    row: $scope.activeWidgets[i].row,
                    col: $scope.activeWidgets[i].col,
                    width: $scope.activeWidgets[i].sizeX,
                    height: $scope.activeWidgets[i].sizeY,
                    title: $scope.activeWidgets[i].title,
                    color: $scope.activeWidgets[i].color
                }
            })
        }
        $http.post("/dashboards/saveGrid/.json?angular=true", postData).then(function(result) {
            genericSuccess();
            return !0
        }, function errorCallback(result) {
            genericError()
        })
    };
    $scope.addWidgetToTab = function(typeId) {
        if ($scope.dashboardIsLocked) {
            return
        }
        postData = {
            Widget: {
                dashboard_tab_id: $scope.activeTab,
                typeId: typeId
            }
        };
        $http.post("/dashboards/addWidgetToTab/.json?angular=true", postData).then(function(result) {
            $scope.activeWidgets.push({
                sizeX: parseInt(result.data.widget.Widget.width, 10),
                sizeY: parseInt(result.data.widget.Widget.height, 10),
                col: parseInt(result.data.widget.Widget.col, 10),
                row: parseInt(result.data.widget.Widget.row, 10),
                id: parseInt(result.data.widget.Widget.id, 10),
                icon: result.data.widget.Widget.icon,
                title: result.data.widget.Widget.title,
                directive: result.data.widget.Widget.directive,
                color: result.data.widget.Widget.color
            });
            return !0
        }, function errorCallback(result) {
            genericError()
        })
    };
    $scope.removeWidgetFromTab = function(id) {
        if ($scope.dashboardIsLocked) {
            return
        }
        postData = {
            Widget: {
                id: id,
                dashboard_tab_id: $scope.activeTab
            }
        };
        $http.post("/dashboards/removeWidgetFromTab/.json?angular=true", postData).then(function(result) {
            var currentWidgets = [];
            for (var i in $scope.activeWidgets) {
                if ($scope.activeWidgets[i].id == id) {
                    $scope.activeWidgets.splice(i, 1);
                    break
                }
            }
        }, function errorCallback(result) {
            genericError()
        })
    };
    $scope.refresh = function() {
        $scope.load()
    };
    $scope.toggleFullscreenMode = function() {
        var elem = document.getElementById('widget-container');
        if ($scope.fullscreen === !0) {
            $scope.fullscreen = !1;
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen()
            }
        } else {
            if (elem.requestFullscreen) {
                elem.requestFullscreen()
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen()
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen()
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen()
            }
            $('#widget-container').css({
                'width': $(window).width(),
                'height': $(window).height()
            });
            $scope.fullscreen = !0
        }
    };
    $scope.addNewTab = function() {
        $http.post("/dashboards/addNewTab.json?angular=true", {
            DashboardTab: {
                name: $scope.newTabName
            }
        }).then(function(result) {
            genericSuccess();
            $scope.activeTab = parseInt(result.data.DashboardTab.DashboardTab.id, 10);
            $scope.load();
            $('#addNewTabModal').modal('hide')
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.addFromSharedTab = function() {
        $http.post("/dashboards/createFromSharedTab.json?angular=true", {
            DashboardTab: {
                id: $scope.createTabFromSharedTabId
            }
        }).then(function(result) {
            genericSuccess();
            $scope.activeTab = parseInt(result.data.DashboardTab.DashboardTab.id, 10);
            $scope.load();
            $('#addNewTabModal').modal('hide')
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.triggerRenameTabModal = function(currentTabName) {
        if ($scope.dashboardIsLocked) {
            return
        }
        $('#renameTabModal').modal('show');
        $scope.renameTabName = currentTabName
    };
    $scope.renameTab = function() {
        $http.post("/dashboards/renameDashboardTab.json?angular=true", {
            DashboardTab: {
                id: $scope.activeTab,
                name: $scope.renameTabName
            }
        }).then(function(result) {
            $scope.errors = {};
            for (var i in $scope.tabs) {
                if ($scope.tabs[i].id === $scope.activeTab) {
                    $scope.tabs[i].name = $scope.renameTabName
                }
            }
            genericSuccess();
            $('#renameTabModal').modal('hide')
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.deleteTab = function(tabId) {
        $http.post("/dashboards/deleteDashboardTab.json?angular=true", {
            DashboardTab: {
                id: tabId
            }
        }).then(function(result) {
            genericSuccess();
            for (var i in $scope.tabs) {
                if ($scope.tabs[i].id === $scope.activeTab) {
                    $scope.tabs.splice(i, 1);
                    break
                }
            }
            if (typeof $scope.tabs[0] !== 'undefined') {
                $scope.loadTabContent($scope.tabs[0].id)
            } else {
                window.location.href = '/'
            }
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.startSharing = function(tabId) {
        $http.post("/dashboards/startSharing.json?angular=true", {
            DashboardTab: {
                id: tabId
            }
        }).then(function(result) {
            new Noty({
                theme: 'metroui',
                type: 'info',
                layout: 'topCenter',
                text: 'Your dashboard is now shared. Other users of the system can use your shared dashboard tab as an template.',
                timeout: 3500
            }).show();
            for (var i in $scope.tabs) {
                if ($scope.tabs[i].id === $scope.activeTab) {
                    $scope.tabs[i].shared = !0
                }
            }
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.stopSharing = function(tabId) {
        $http.post("/dashboards/stopSharing.json?angular=true", {
            DashboardTab: {
                id: tabId
            }
        }).then(function(result) {
            genericSuccess();
            for (var i in $scope.tabs) {
                if ($scope.tabs[i].id === $scope.activeTab) {
                    $scope.tabs[i].shared = !1
                }
            }
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.loadSharedTabs = function() {
        $http.get("/dashboards/getSharedTabs.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.sharedTabs = result.data.tabs
        })
    };
    $scope.saveTabRotateInterval = function() {
        $http.post("/dashboards/saveTabRotateInterval.json?angular=true", {
            User: {
                dashboard_tab_rotation: $scope.viewTabRotateInterval
            }
        }).then(function(result) {
            $scope.errors = {};
            genericSuccess();
            updateInterval()
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.neverPerformUpdates = function() {
        $http.post("/dashboards/neverPerformUpdates.json?angular=true", {
            DashboardTab: {
                id: $scope.activeTab
            }
        }).then(function(result) {
            for (var k in $scope.tabs) {
                if ($scope.tabs[k].id === $scope.activeTab && $scope.tabs[k].source_tab_id > 0) {
                    $scope.tabs[k].check_for_updates = !1;
                    break
                }
            }
            genericSuccess();
            $('#updateAvailableModal').modal('hide')
        }, function errorCallback(result) {
            genericError()
        })
    };
    $scope.performUpdate = function() {
        $http.post("/dashboards/updateSharedTab.json?angular=true", {
            DashboardTab: {
                id: $scope.activeTab
            }
        }).then(function(result) {
            for (var k in $scope.tabs) {
                if ($scope.tabs[k].id === $scope.activeTab) {
                    $scope.tabs[k].locked = result.data.DashboardTab.DashboardTab.locked;
                    $scope.dashboardIsLocked = result.data.DashboardTab.DashboardTab.locked;
                    $scope.gridsterOpts.resizable.enabled = !$scope.dashboardIsLocked;
                    $scope.gridsterOpts.draggable.enabled = !$scope.dashboardIsLocked;
                    break
                }
            }
            genericSuccess();
            $('#updateAvailableModal').modal('hide');
            $scope.loadTabContent($scope.activeTab)
        }, function errorCallback(result) {
            genericError()
        })
    };
    $scope.triggerRenameWidgetModal = function(widgetId) {
        if ($scope.dashboardIsLocked) {
            return
        }
        $scope.renameWidgetTitle = '';
        for (var i in $scope.activeWidgets) {
            if ($scope.activeWidgets[i].id === widgetId) {
                $scope.currentWidgetId = widgetId;
                $scope.renameWidgetTitle = $scope.activeWidgets[i].title;
                break
            }
        }
        $('#renameWidgetModal').modal('show')
    };
    $scope.renameWidget = function() {
        if (typeof $scope.currentWidgetId === 'undefined' || $scope.currentWidgetId === null) {
            genericError();
            return
        }
        $http.post("/dashboards/renameWidget.json?angular=true", {
            Widget: {
                id: $scope.currentWidgetId,
                name: $scope.renameWidgetTitle
            }
        }).then(function(result) {
            $scope.errors = {};
            for (var i in $scope.activeWidgets) {
                if ($scope.activeWidgets[i].id === $scope.currentWidgetId) {
                    $scope.activeWidgets[i].title = $scope.renameWidgetTitle
                }
            }
            $scope.currentWidgetId = null;
            genericSuccess();
            $('#renameWidgetModal').modal('hide')
        }, function errorCallback(result) {
            $scope.errors = result.data.error;
            genericError()
        })
    };
    $scope.restoreDefault = function() {
        $http.post("/dashboards/restoreDefault.json?angular=true", {
            DashboardTab: {
                id: $scope.activeTab
            }
        }).then(function(result) {
            genericSuccess();
            $scope.loadTabContent($scope.activeTab)
        }, function errorCallback(result) {
            genericError()
        })
    };
    if (document.addEventListener) {
        document.addEventListener('webkitfullscreenchange', fullscreenExitHandler, !1);
        document.addEventListener('mozfullscreenchange', fullscreenExitHandler, !1);
        document.addEventListener('fullscreenchange', fullscreenExitHandler, !1);
        document.addEventListener('MSFullscreenChange', fullscreenExitHandler, !1)
    }

    function fullscreenExitHandler() {
        if (document.webkitIsFullScreen === !1 || document.mozFullScreen === !1 || document.msFullscreenElement === !1) {
            $scope.fullscreen = !1;
            $('#widget-container').css({
                'width': '100%',
                'height': '100%'
            })
        }
    }
    var createTabSort = function() {
        if (tabSortCreated === !0) {
            return
        }
        tabSortCreated = !0;
        $('.nav-tabs').sortable({
            update: function() {
                var $tabbar = $(this);
                var $tabs = $tabbar.children();
                var tabIdsOrdered = [];
                $tabs.each(function(key, tab) {
                    var $tab = $(tab);
                    var tabId = parseInt($tab.data('tab-id'), 10);
                    tabIdsOrdered.push(tabId)
                });
                $http.post("/dashboards/saveTabOrder.json?angular=true", {
                    order: tabIdsOrdered
                }).then(function(result) {
                    genericSuccess()
                }, function errorCallback(result) {
                    genericError()
                })
            },
            placeholder: 'tabTargetDestination'
        })
    };
    var rotateTab = function() {
        if ($scope.tabs.length === 0) {
            return
        }
        var nextTabId = $scope.tabs[0].id;
        var index = 0;
        for (var i in $scope.tabs) {
            if ($scope.tabs[i].id === $scope.activeTab) {
                var nextIndex = index + 1;
                if (typeof $scope.tabs[nextIndex] !== 'undefined') {
                    nextTabId = $scope.tabs[nextIndex].id;
                    break
                }
            }
            index++
        }
        disableWatch = !0;
        $('#updateAvailableModal').modal('hide');
        $scope.loadTabContent(nextTabId)
    };
    var updateInterval = function() {
        if (intervalId !== null) {
            $interval.cancel(intervalId)
        }
        if ($scope.viewTabRotateInterval > 0) {
            intervalId = $interval(rotateTab, ($scope.viewTabRotateInterval * 1000))
        }
    };
    var checkForUpdates = function(tabId) {
        $http.get("/dashboards/checkForUpdates.json", {
            params: {
                'angular': !0,
                'tabId': tabId
            }
        }).then(function(result) {
            if (result.data.updateAvailable === !0) {
                $('#updateAvailableModal').modal('show')
            }
        })
    };
    $scope.lockOrUnlockDashboard = function() {
        $scope.dashboardIsLocked = $scope.dashboardIsLocked !== !0;
        $scope.gridsterOpts.resizable.enabled = !$scope.dashboardIsLocked;
        $scope.gridsterOpts.draggable.enabled = !$scope.dashboardIsLocked;
        for (var k in $scope.tabs) {
            if ($scope.tabs[k].id === $scope.activeTab) {
                $scope.tabs[k].locked = $scope.dashboardIsLocked;
                break
            }
        }
        $http.post("/dashboards/lockOrUnlockTab.json?angular=true", {
            DashboardTab: {
                id: $scope.activeTab,
                locked: $scope.dashboardIsLocked.toString()
            }
        }).then(function(result) {
            genericSuccess()
        }, function errorCallback(result) {
            genericError()
        })
    };
    $scope.$watch('viewTabRotateInterval', function() {
        if ($scope.init) {
            return
        }
        if ($scope.viewTabRotateInterval === 0) {
            $scope.intervalText = 'disabled'
        } else {
            var min = parseInt($scope.viewTabRotateInterval / 60, 10);
            var sec = parseInt($scope.viewTabRotateInterval % 60, 10);
            if (min > 0) {
                $scope.intervalText = min + ' minutes, ' + sec + ' seconds';
                return
            }
            $scope.intervalText = sec + ' seconds'
        }
    });
    $scope.$watch('activeWidgets', function() {
        if ($scope.init === !0 || disableWatch === !0) {
            return
        }
        if (watchTimeout !== null) {
            $timeout.cancel(watchTimeout)
        }
        watchTimeout = $timeout(function() {
            $scope.saveGrid()
        }, 1500)
    }, !0);
    $scope.load()
});
angular.module('openITCOCKPIT').controller('Grafana_userdashboardsIndexController', function($scope, $http, SortService, MassChangeService) {
    SortService.setSort('GrafanaUserdashboard.name');
    SortService.setDirection('asc');
    $scope.currentPage = 1;
    $scope.useScroll = !0;
    var defaultFilter = function() {
        $scope.filter = {
            GrafanaUserdashboard: {
                name: ''
            }
        }
    };
    $scope.massChange = {};
    $scope.selectedElements = 0;
    $scope.deleteUrl = '/grafana_module/grafana_userdashboards/delete/';
    $scope.showFilter = !1;
    $scope.load = function() {
        $http.get("/grafana_module/grafana_userdashboards/index.json", {
            params: {
                'angular': !0,
                'scroll': $scope.useScroll,
                'sort': SortService.getSort(),
                'page': $scope.currentPage,
                'direction': SortService.getDirection(),
                'filter[GrafanaUserdashboard.name]': $scope.filter.GrafanaUserdashboard.name
            }
        }).then(function(result) {
            $scope.allUserdashboards = result.data.all_userdashboards;
            $scope.paging = result.data.paging;
            $scope.scroll = result.data.scroll;
            $scope.init = !1
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.triggerFilter = function() {
        if ($scope.showFilter === !0) {
            $scope.showFilter = !1
        } else {
            $scope.showFilter = !0
        }
    };
    $scope.resetFilter = function() {
        defaultFilter();
        $scope.undoSelection()
    };
    $scope.undoSelection = function() {
        MassChangeService.clearSelection();
        $scope.massChange = MassChangeService.getSelected();
        $scope.selectedElements = MassChangeService.getCount()
    };
    $scope.selectAll = function() {
        if ($scope.allUserdashboards) {
            for (var key in $scope.allUserdashboards) {
                if ($scope.allUserdashboards[key].GrafanaUserdashboard.allowEdit) {
                    var id = $scope.allUserdashboards[key].GrafanaUserdashboard.id;
                    $scope.massChange[id] = !0
                }
            }
        }
    };
    $scope.getObjectsForDelete = function() {
        var objects = {};
        var selectedObjects = MassChangeService.getSelected();
        for (var key in $scope.allUserdashboards) {
            for (var id in selectedObjects) {
                if (id == $scope.allUserdashboards[key].GrafanaUserdashboard.id) {
                    objects[id] = $scope.allUserdashboards[key].GrafanaUserdashboard.name
                }
            }
        }
        return objects
    };
    $scope.getObjectForDelete = function(GrafanaUserdashboard) {
        var object = {};
        object[GrafanaUserdashboard.GrafanaUserdashboard.id] = GrafanaUserdashboard.GrafanaUserdashboard.name;
        return object
    };
    $scope.changepage = function(page) {
        if (page !== $scope.currentPage) {
            $scope.currentPage = page;
            $scope.load()
        }
    };
    $scope.changeMode = function(val) {
        $scope.useScroll = val;
        $scope.load()
    };
    $scope.$watch('filter', function() {
        $scope.currentPage = 1;
        $scope.undoSelection();
        $scope.load()
    }, !0);
    $scope.$watch('massChange', function() {
        MassChangeService.setSelected($scope.massChange);
        $scope.selectedElements = MassChangeService.getCount()
    }, !0);
    defaultFilter();
    SortService.setCallback($scope.load)
});
angular.module('openITCOCKPIT').controller('Grafana_userdashboardsViewController', function($scope, $http, QueryStringService) {
    $scope.id = QueryStringService.getCakeId();
    $scope.selectedTimerange = 'now-3h';
    $scope.selectedAutorefresh = '60s';
    $scope.dashboardFoundInGrafana = !1;
    $scope.loadIframeUrl = function() {
        $http.get("/grafana_module/grafana_userdashboards/getViewIframeUrl/" + $scope.id + ".json", {
            params: {
                'angular': !0,
                'from': $scope.selectedTimerange,
                'refresh': $scope.selectedAutorefresh
            }
        }).then(function(result) {
            $scope.dashboardFoundInGrafana = result.data.dashboardFoundInGrafana;
            $scope.iframeUrl = result.data.iframeUrl
        })
    };
    $scope.grafanaTimepickerCallback = function(selectedTimerange, selectedAutorefresh) {
        $scope.selectedTimerange = selectedTimerange;
        $scope.selectedAutorefresh = selectedAutorefresh;
        $scope.loadIframeUrl()
    };
    $scope.loadIframeUrl()
});
angular.module('openITCOCKPIT').controller('Grafana_configurationIndexController', function($scope, $http, QueryStringService) {
    $scope.post = {
        GrafanaConfiguration: {
            id: 1,
            api_url: '',
            api_key: '',
            graphite_prefix: '',
            use_https: !1,
            use_proxy: !0,
            ignore_ssl_certificate: !1,
            dashboard_style: '',
            Hostgroup: [],
            Hostgroup_excluded: []
        }
    };
    $scope.hasError = null;
    $scope.load = function() {
        $http.get("/grafana_module/grafana_configuration/index.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.config = result.data.grafanaConfiguration;
            var selectedHostgroups = [];
            var selectedHostgroupsExcluded = [];
            for (var key in $scope.config.GrafanaConfiguration.Hostgroup) {
                selectedHostgroups.push(parseInt($scope.config.GrafanaConfiguration.Hostgroup[key], 10))
            }
            for (var key in $scope.config.GrafanaConfiguration.Hostgroup_excluded) {
                selectedHostgroupsExcluded.push(parseInt($scope.config.GrafanaConfiguration.Hostgroup_excluded[key], 10))
            }
            $scope.post.GrafanaConfiguration.api_url = $scope.config.GrafanaConfiguration.api_url;
            $scope.post.GrafanaConfiguration.api_key = $scope.config.GrafanaConfiguration.api_key;
            $scope.post.GrafanaConfiguration.graphite_prefix = $scope.config.GrafanaConfiguration.graphite_prefix;
            $scope.post.GrafanaConfiguration.use_https = parseInt($scope.config.GrafanaConfiguration.use_https, 10) === 1;
            $scope.post.GrafanaConfiguration.use_proxy = parseInt($scope.config.GrafanaConfiguration.use_proxy, 10) === 1;
            $scope.post.GrafanaConfiguration.ignore_ssl_certificate = parseInt($scope.config.GrafanaConfiguration.ignore_ssl_certificate, 10) === 1;
            $scope.post.GrafanaConfiguration.dashboard_style = $scope.config.GrafanaConfiguration.dashboard_style;
            $scope.post.GrafanaConfiguration.Hostgroup = selectedHostgroups;
            $scope.post.GrafanaConfiguration.Hostgroup_excluded = selectedHostgroupsExcluded
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.loadHostgroups = function() {
        $http.get("/grafana_module/grafana_configuration/loadHostgroups.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.hostgroups = result.data.hostgroups
        })
    };
    $scope.checkGrafanaConnection = function() {
        $http.post("/grafana_module/grafana_configuration/testGrafanaConnection.json?angular=true", $scope.post).then(function(result) {
            $scope.hasError = !1;
            console.log(result);
            if (result.data.status.status === !1) {
                $scope.hasError = !0;
                $scope.grafanaErrors = {
                    status: 400,
                    statusText: 'Bad Request',
                    message: result.data.status.msg.message
                }
            }
        }, function errorCallback(result) {
            $scope.hasError = !0;
            $scope.grafanaErrors = {
                status: result.status,
                statusText: result.statusText,
                message: result.data.message
            }
        })
    };
    $scope.submit = function() {
        $http.post("/grafana_module/grafana_configuration/index.json?angular=true", $scope.post).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/grafana_module/grafana_configuration/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.load();
    $scope.loadHostgroups()
});
angular.module('openITCOCKPIT').controller('Grafana_userdashboardsAddController', function($scope, $http) {
    $scope.post = {
        GrafanaUserdashboard: {
            container_id: null,
            name: ''
        }
    };
    $scope.loadContainers = function() {
        $http.get("/grafana_module/grafana_userdashboards/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.submit = function() {
        $http.post("/grafana_module/grafana_userdashboards/add.json?angular=true", $scope.post).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/grafana_module/grafana_userdashboards/editor/' + result.data.id
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadContainers()
});
angular.module('openITCOCKPIT').controller('Grafana_userdashboardsEditController', function($scope, $http, QueryStringService) {
    $scope.id = $scope.post = {
        GrafanaUserdashboard: {
            id: null,
            container_id: null,
            name: '',
            configuration_id: null
        }
    };
    $scope.id = QueryStringService.getCakeId();
    $scope.deleteUrl = "/grafana_module/grafana_userdashboards/delete/" + $scope.id + ".json?angular=true";
    $scope.sucessUrl = '/grafana_module/grafana_userdashboards/index';
    $scope.load = function() {
        $http.get("/grafana_module/grafana_userdashboards/edit/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.post.GrafanaUserdashboard.id = result.data.dashboard.GrafanaUserdashboard.id;
            $scope.post.GrafanaUserdashboard.container_id = result.data.dashboard.GrafanaUserdashboard.container_id;
            $scope.post.GrafanaUserdashboard.name = result.data.dashboard.GrafanaUserdashboard.name;
            $scope.post.GrafanaUserdashboard.configuration_id = result.data.dashboard.GrafanaUserdashboard.configuration_id
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.loadContainers = function() {
        $http.get("/grafana_module/grafana_userdashboards/loadContainers.json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            $scope.containers = result.data.containers;
            $scope.load()
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.submit = function() {
        $http.post("/grafana_module/grafana_userdashboards/edit/" + $scope.id + ".json?angular=true", $scope.post).then(function(result) {
            console.log('Data saved successfully');
            window.location.href = '/grafana_module/grafana_userdashboards/index'
        }, function errorCallback(result) {
            if (result.data.hasOwnProperty('error')) {
                $scope.errors = result.data.error
            }
        })
    };
    $scope.loadContainers()
});
angular.module('openITCOCKPIT').controller('Grafana_userdashboardsEditorController', function($scope, $http, QueryStringService) {
    $scope.id = QueryStringService.getCakeId();
    $scope.name = '';
    $scope.load = function() {
        $http.get("/grafana_module/grafana_userdashboards/editor/" + $scope.id + ".json", {
            params: {
                'angular': !0
            }
        }).then(function(result) {
            var data = [];
            for (var i in result.data.userdashboardData.rows) {
                if (!Array.isArray(result.data.userdashboardData.rows[i])) {
                    data.push(Object.values(result.data.userdashboardData.rows[i]))
                } else {
                    data.push(result.data.userdashboardData.rows[i])
                }
            }
            $scope.data = data;
            $scope.containerId = parseInt(result.data.userdashboardData.GrafanaUserdashboard.container_id, 10);
            $scope.name = result.data.userdashboardData.GrafanaUserdashboard.name;
            $scope.grafanaUnits = result.data.grafanaUnits
        }, function errorCallback(result) {
            if (result.status === 404) {
                window.location.href = '/angular/not_found'
            }
        })
    };
    $scope.addRow = function() {
        var data = {
            id: $scope.id
        };
        $http.post("/grafana_module/grafana_userdashboards/addRow.json?angular=true", data).then(function(result) {
            if (result.data.hasOwnProperty('success')) {
                new Noty({
                    theme: 'metroui',
                    type: 'success',
                    text: 'Row added successfully',
                    timeout: 3500
                }).show();
                $scope.load()
            }
        }, function errorCallback(result) {
            new Noty({
                theme: 'metroui',
                type: 'error',
                text: 'Error while adding row',
                timeout: 3500
            }).show()
        })
    };
    $scope.synchronizeWithGrafana = function() {
        $('#synchronizeWithGrafanaModal').modal('show');
        $scope.syncError = !1;
        var data = {
            id: $scope.id
        };
        $http.post("/grafana_module/grafana_userdashboards/synchronizeWithGrafana.json?angular=true", data).then(function(result) {
            if (result.data.success) {
                new Noty({
                    theme: 'metroui',
                    type: 'success',
                    text: 'Synchronization successfully',
                    timeout: 3500
                }).show();
                $('#synchronizeWithGrafanaModal').modal('hide');
                return
            }
            $scope.syncError = result.data.message
        }, function errorCallback(result) {
            $scope.syncError = result.data.message
        })
    };
    $scope.removeRowCallback = function() {
        $scope.load()
    };
    $scope.load()
})