App.Components.StatusComponent = Frontend.Component.extend({
    hostStatusColor: function(state) {
        if (state !== undefined) {
            state = parseInt(state, 10);
            switch (state) {
                case 0:
                    return {
                        'human_state': 'Ok', 'class': 'btn-success', 'hexColor': '#5CB85C'
                    };
                    break;
                case 1:
                    return {
                        'human_state': 'Down', 'class': 'btn-danger', 'hexColor': '#d9534f'
                    };
                    break;
                case 2:
                    return {
                        'human_state': 'Unreachable', 'class': 'btn-unknown', 'hexColor': '#4C4F53'
                    };
                    break;
                default:
                    return {
                        'human_state': 'Not Found', 'class': 'btn-primary', 'hexColor': '#337ab7'
                    };
                    break
            }
        }
        return
    },
    serviceStatusColor: function(state) {
        if (state !== undefined) {
            state = parseInt(state, 10);
            switch (state) {
                case 0:
                    return {
                        'human_state': 'Ok', 'class': 'btn-success', 'hexColor': '#5CB85C'
                    };
                    break;
                case 1:
                    return {
                        'human_state': 'Warning', 'class': 'btn-warning', 'hexColor': '#f0ad4e'
                    };
                    break;
                case 2:
                    return {
                        'human_state': 'Critical', 'class': 'btn-danger', 'hexColor': '#d9534f'
                    };
                    break;
                case 3:
                    return {
                        'human_state': 'Unknown', 'class': 'btn-unknown', 'hexColor': '#4C4F53'
                    };
                    break;
                default:
                    return {
                        'human_state': 'Not Found', 'class': 'btn-primary', 'hexColor': '#337ab7'
                    };
                    break
            }
        }
        return
    },
});
App.Components.BootstrapModalComponent = Frontend.Component.extend({
    bootstrap_template: '\
		<div class="modal fade" id="bs-modal-component-window" tabindex="-1" role="dialog" \
			aria-labelledby="myModalLabel" aria-hidden="true">\
			<div class="modal-dialog">\
				<div class="modal-content">\
					<div class="modal-header">\
						<button type="button" class="close" data-dismiss="modal">\
							<span aria-hidden="true">&times;</span>\
							<span class="sr-only">Close</span>\
						</button>\
						<h4 class="modal-title" id="myModalLabel"></h4>\
					</div>\
					\
					<div class="modal-body"></div>\
					\
					<div class="modal-footer">\
						<button type="button" class="btn btn-default" data-dismiss="modal">OK</button>\
					</div>\
				</div>\
			</div>\
		</div>',
    content: {},
    on_close: function() {},
    setup: function(settings) {
        var self = this;
        if (settings != null) {
            self.content = typeof settings.content === 'object' ? settings.content : [];
            self.on_close = typeof settings.on_close === 'function' ? settings.on_close : function() {}
        }
        self.$modal = $('#bs-modal-component-window');
        if (self.$modal.length == 0) {
            $('body').prepend(self.bootstrap_template);
            self.$modal = $('#bs-modal-component-window')
        }
        self.$modal.on('hidden.bs.modal', function() {
            self.on_close.call(this)
        })
    },
    show: function(modal_name, wrap_with_paragraphs) {
        wrap_with_paragraphs = typeof wrap_with_paragraphs != null ? wrap_with_paragraphs : !1;
        if (modal_name == '' || Object.keys(this.content).length == 0) {
            return !1
        }
        this.$modal.find('.modal-title').html(this.content[modal_name].title);
        var body = this.content[modal_name].body;
        if ($.isArray(body)) {
            if (wrap_with_paragraphs) {
                body = '<p>' + body.join('<p></p>') + '</p>'
            } else {
                body = body.join(' ')
            }
        }
        this.$modal.find('.modal-body').html(body);
        this.$modal.modal();
        return !0
    },
    setContent: function(content) {
        this.content = content
    },
    getContent: function() {
        return this.content
    }
});
App.Components.FileChooserComponent = Frontend.Component.extend({
    setup: function($dom) {
        $dom.find('.file-chooser-input a.choose-image').click(this._onChooseImage.bind(this));
        $dom.find('.file-chooser-input a.remove-image').click(this._onRemoveImage.bind(this))
    },
    _onChooseImage: function(e) {
        var finder = new CKFinder();
        finder.selectActionFunction = this._onSelectFile.bind(this);
        finder.selectActionData = {
            imageChooser: $(e.currentTarget).parents('.file-chooser-input'),
            finder: finder
        }
        finder.popup(600, 400)
    },
    _onRemoveImage: function(e) {
        $('.file-chooser-input .image-name').html(__('forms.no_image_chosen'));
        $('.file-chooser-input .image-name-input').val('');
        $('.file-chooser-input .image-name').html(__('none'));
        $('.file-chooser-input a.remove-image').hide();
        $('.file-chooser-input .selected-file').text('')
    },
    _onSelectFile: function(file, params, all) {
        params.selectActionData.imageChooser.find('.image-name').html(urldecode(file));
        params.selectActionData.imageChooser.find('.image-name-input').val(urldecode(file));
        params.selectActionData.imageChooser.find('.selected-file').text(file);
        params.selectActionData.finder.api.closePopup();
        removeLink = '<a class="btn btn-xs btn-default remove-image">Remove File</a>';
        $(removeLink).insertAfter('.file-chooser-input a.choose-image').click(this._onRemoveImage.bind(this))
    }
});
App.Components.QrComponent = Frontend.Component.extend({
    $scancodeContainer: null,
    setup: function() {
        var self = this;
        this.$scancodeContainer = $('#scancodeContainer');
        $('#QRPrint').click(function() {
            self._print()
        }.bind(self));
        $('#QRSize').slider({
            tooltip: 'hide'
        });
        $('#QRSize').slider().on('slideStop', function(ev) {
            this.$scancodeContainer.html('');
            this.$scancodeContainer.qrcode({
                render: 'canvas',
                width: $('#QRSize').slider('getValue'),
                height: $('#QRSize').slider('getValue'),
                text: document.location.href
            })
        }.bind(this));
        $('#qrmodal').on('shown.bs.modal', function() {
            self.show()
        }.bind(self))
    },
    show: function() {
        this.$scancodeContainer.html('');
        this.$scancodeContainer.qrcode({
            render: 'canvas',
            width: 150,
            height: 150,
            text: document.location.href
        })
    },
    _print: function() {
        var size = $('#QRSize').slider('getValue');
        window.open('/qr/index/?url=' + encodeURIComponent(document.location.href) + '&width=' + size + '&height=' + size, '', 'width=' + size + ', height=' + size)
    },
    _printPage: function(url, width, height) {
        $('#QrContainer').qrcode({
            render: 'canvas',
            width: width,
            height: height,
            text: url
        });
        window.print()
    }
});
App.Components.RrdComponent = Frontend.Component.extend({
    last_fetched_graph_data: {},
    last_given_service_rules: [],
    plot: null,
    $selector: null,
    host_names: {},
    service_names: {},
    timeout_id: 0,
    color: null,
    $ajax_loader: null,
    timezoneOffset: 0,
    isUpdate: !1,
    setup: function(conf) {
        var self = this;
        conf = conf || {};
        self.url = conf.url || '/';
        self.width = conf.width || '100%';
        self.height = conf.height || '500px';
        self.host_and_service_uuids = conf.host_and_service_uuids || {};
        self.selector = conf.selector || null;
        self.color = conf.color || ['#57889c'];
        self.units = [];
        self.dateformat = conf.dateformat || 'd.m.y H:i:s';
        self.displayTooltip = conf.displayTooltip || !0;
        self.display_threshold_lines = conf.display_threshold_lines || !1;
        self.error_callback = conf.error_callback || function(response, status) {};
        self.$selector = $(self.selector);
        self.start = conf.start || null;
        self.end = conf.end || null;
        self.async = conf.async != null ? conf.async : !0;
        self.timeout_in_ms = conf.timeout_in_ms || 200;
        self.max_drawing_point_threshold = conf.max_drawing_point_threshold || 500;
        self.$ajax_loader = $('#global_ajax_loader');
        self.timezoneOffset = conf.timezoneOffset || self.timezoneOffset;
        self.update_plot = typeof conf.update_plot == 'function' ? conf.update_plot : function(event, plot, action) {
            var axes = plot.getAxes(),
                min = axes.xaxis.min.toFixed(2),
                max = axes.xaxis.max.toFixed(2),
                time_range = {
                    start: parseInt(min),
                    end: parseInt(max),
                    isUpdate: !0
                };
            if (self.timeout_id > 0) {
                clearTimeout(self.timeout_id)
            }
            self.timeout_id = setTimeout(function() {
                self.update(time_range)
            }, self.timeout_in_ms)
        };
        self.flot_options = conf.flot_options == null ? {} : conf.flot_options;
        self.threshold_lines = [];
        self.threshold_values = [];
        self.dsNames = []
    },
    fetchRrdData: function(conf, on_success) {
        var self = this;
        on_success = typeof on_success === 'function' ? on_success : function() {};
        conf = conf || {};
        self.start = conf.start || self.start;
        self.end = conf.end || self.end;
        var post_data = {
            'host_and_service_uuids': self.host_and_service_uuids
        };
        post_data.isUpdate = conf.isUpdate || self.isUpdate;
        if (self.start !== null && self.end !== null) {
            post_data.start = self.start;
            post_data.end = self.end
        }
        this.xhr = $.ajax({
            type: 'post',
            url: self.url,
            dataType: 'json',
            data: JSON.stringify(post_data),
            contentType: 'application/json',
            cache: !1,
            async: self.async,
            success: function(response, status) {
                var max_length = 1000,
                    rrd_data_length = 0,
                    service_uuid, host_uuid, service, host, rule;
                for (host_uuid in response.rrd_data) {
                    host = response.rrd_data[host_uuid];
                    for (service_uuid in host) {
                        service = host[service_uuid];
                        for (rule in service.data) {
                            rrd_data_length += Object.keys(service.data[rule]).length
                        }
                    }
                }
                var console_message = 'The length of all points is ' + rrd_data_length + ' !';
                if (typeof console.warn === 'function' && rrd_data_length > max_length) {
                    console.warn(console_message)
                } else if (typeof console.info === 'function') {}
                self.last_fetched_graph_data = {};
                for (host_uuid in response.rrd_data) {
                    host = response.rrd_data[host_uuid];
                    for (service_uuid in host) {
                        service = host[service_uuid];
                        var ds;
                        $.each(service.xml_data, function(i, xml_object) {
                            ds = service.xml_data[i].ds;
                            var dataObj = service.data[xml_object.ds];
                            if (typeof self.last_fetched_graph_data[host_uuid] !== 'object') {
                                self.last_fetched_graph_data[host_uuid] = {}
                            }
                            if (typeof self.last_fetched_graph_data[host_uuid][service_uuid] !== 'object') {
                                self.last_fetched_graph_data[host_uuid][service_uuid] = {}
                            }
                            self.last_fetched_graph_data[host_uuid][service_uuid][ds] = [];
                            if (typeof self.threshold_values[host_uuid] !== 'object') {
                                self.threshold_values[host_uuid] = {}
                            }
                            if (typeof self.threshold_values[host_uuid][service_uuid] !== 'object') {
                                self.threshold_values[host_uuid][service_uuid] = {}
                            }
                            self.threshold_values[host_uuid][service_uuid][ds] = [];
                            self.threshold_values[host_uuid][service_uuid][ds].warn = xml_object.warn;
                            self.threshold_values[host_uuid][service_uuid][ds].crit = xml_object.crit;
                            self.threshold_values[host_uuid][service_uuid][ds].label = service.xml_data[i].label;
                            if (typeof self.units[host_uuid] !== 'object') {
                                self.units[host_uuid] = {}
                            }
                            $.each(dataObj, function(timestamp, RRDValue) {
                                self.last_fetched_graph_data[host_uuid][service_uuid][ds].push([timestamp, RRDValue]);
                                if (typeof self.units[host_uuid][service_uuid] !== 'object') {
                                    self.units[host_uuid][service_uuid] = {}
                                }
                                self.units[host_uuid][service_uuid][ds] = service.xml_data[i].unit
                            })
                        });
                        self.host_names[host_uuid] = htmlspecialchars(service.hostname);
                        self.service_names[service_uuid] = htmlspecialchars(service.servicename);
                        if (self.display_threshold_lines === !0) {
                            self.addThreshold(host_uuid, service_uuid, ds)
                        }
                    }
                }
                on_success(self.last_fetched_graph_data)
            },
            error: self.error_callback
        })
    },
    renderGraph: function(graph_data, on_success) {
        var self = this;
        on_success = typeof on_success == 'function' ? on_success : function() {};
        if (!graph_data) {
            graph_data = [];
            for (var host_uuid in self.last_fetched_graph_data) {
                var services = self.last_fetched_graph_data[host_uuid];
                for (var service_uuid in services) {
                    var current_data = services[service_uuid],
                        host_name = self.host_names[host_uuid],
                        service_name = self.service_names[service_uuid],
                        units = self.units[host_uuid][service_uuid];
                    for (var ds_number in current_data) {
                        graph_data.push({
                            label: host_name + '/' + service_name + '/' + self.threshold_values[host_uuid][service_uuid][ds_number].label,
                            data: current_data[ds_number],
                            unit: units[ds_number]
                        })
                    }
                }
            }
        }
        self.$selector.css({
            'width': self.width,
            'height': self.height
        });
        var color_amount = graph_data.length < 3 ? 3 : graph_data.length,
            color_generator = new ColorGenerator(),
            options = {
                colors: color_generator.generate(color_amount, 90, 120),
                legend: {
                    show: !0,
                    noColumns: 3,
                    container: $(self.selector).parent().find('.graph_legend'),
                },
                grid: {
                    hoverable: !0,
                    markings: self.threshold_lines,
                    borderWidth: {
                        top: 1,
                        right: 1,
                        bottom: 1,
                        left: 1
                    },
                    borderColor: {
                        top: '#CCCCCC'
                    }
                },
                tooltip: !0,
                tooltipOpts: {
                    defaultTheme: !1
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%d.%m.%y %H:%M:%S',
                    tickFormatter: function(val, axis) {
                        var fooJS = new Date((val + self.timezoneOffset) * 1000);
                        var fixTime = function(value) {
                            if (value < 10) {
                                return '0' + value
                            }
                            return value
                        };
                        return fixTime(fooJS.getUTCDate()) + '.' + fixTime(fooJS.getUTCMonth() + 1) + '.' + fooJS.getUTCFullYear() + ' ' + fixTime(fooJS.getUTCHours()) + ':' + fixTime(fooJS.getUTCMinutes())
                    }
                },
                lines: {
                    show: !0,
                    lineWidth: 1,
                    fill: !0,
                    steps: 0,
                    fillColor: {
                        colors: [{
                            opacity: 0.5
                        }, {
                            opacity: 0.3
                        }]
                    }
                },
                points: {
                    show: !1,
                    radius: 1
                },
                series: {
                    show: !0,
                    labelFormatter: function(label, series) {
                        return '<a href="#' + label + '">' + label + '</a>'
                    },
                },
                selection: {
                    mode: "x"
                },
            };
        $.extend(!0, options, self.flot_options);
        var $container = self.$selector,
            plot_actions = ['plotpan', 'plotzoom'];
        $.each(plot_actions, function(i, action) {
            $container.off(action).off('contextmenu');
            $container.on(action, function(event, plot) {
                console.info('test');
                self.update_plot(event, plot, action)
            }).on('contextmenu', function(event) {
                event.preventDefault();
                self.plot.zoomOut();
                return !1
            })
        });
        self.plot = $.plot($container, graph_data, options);
        on_success();
        $('#graph').bind('plotselected', function(event, ranges) {
            $.each(self.plot.getXAxes(), function(_, axis) {
                var opts = axis.options;
                opts.min = ranges.xaxis.from;
                opts.max = ranges.xaxis.to
            });
            self.plot.setupGrid();
            self.plot.draw();
            self.plot.clearSelection()
        });
        if (self.displayTooltip) {
            self.initTooltip()
        }
    },
    renderGraphForBrowser: function(graph_data, on_success) {
        var self = this;
        on_success = typeof on_success == 'function' ? on_success : function() {};
        var thresholdWarnValue = null;
        var thresholdCriticalValue = null;
        if (!graph_data) {
            graph_data = [];
            for (var host_uuid in self.last_fetched_graph_data) {
                var services = self.last_fetched_graph_data[host_uuid];
                for (var service_uuid in services) {
                    var current_data = services[service_uuid],
                        host_name = self.host_names[host_uuid],
                        service_name = self.service_names[service_uuid],
                        units = self.units[host_uuid][service_uuid];
                    for (var ds_number in current_data) {
                        graph_data.push({
                            label: host_name + ' / ' + service_name + ' / ' + self.threshold_values[host_uuid][service_uuid][ds_number].label,
                            data: current_data[ds_number],
                            unit: units[ds_number]
                        });
                        if (self.threshold_values[host_uuid][service_uuid][ds_number].warn) {
                            thresholdWarnValue = self.threshold_values[host_uuid][service_uuid][ds_number].warn
                        }
                        if (self.threshold_values[host_uuid][service_uuid][ds_number].crit) {
                            thresholdCriticalValue = self.threshold_values[host_uuid][service_uuid][ds_number].crit
                        }
                    }
                }
            }
        }
        self.$selector.css({
            'width': self.width,
            'height': self.height
        });
        var thresholdArray = [];
        var invertedWarnAndCriticalValues = !1;
        if ((thresholdWarnValue !== null && thresholdCriticalValue !== null) && Number(thresholdWarnValue) > Number(thresholdCriticalValue)) {
            invertedWarnAndCriticalValues = !0
        }
        var defaultColor = 'green';
        if (invertedWarnAndCriticalValues) {
            if (thresholdWarnValue !== null) {
                thresholdArray.push({
                    below: thresholdWarnValue,
                    color: '#FFFF00'
                })
            }
            if (thresholdCriticalValue !== null) {
                thresholdArray.push({
                    below: thresholdCriticalValue,
                    color: '#FF0000'
                })
            }
        } else {
            defaultColor = '#FF0000';
            if (thresholdCriticalValue !== null) {
                thresholdArray.push({
                    below: thresholdCriticalValue,
                    color: '#FFFF00'
                })
            }
            if (thresholdWarnValue !== null) {
                thresholdArray.push({
                    below: thresholdWarnValue,
                    color: 'green'
                })
            }
        }
        var options = {
            legend: {
                show: !1,
            },
            grid: {
                hoverable: !0,
                markings: self.threshold_lines,
                borderWidth: {
                    top: 1,
                    right: 1,
                    bottom: 1,
                    left: 1
                },
                borderColor: {
                    top: '#CCCCCC'
                }
            },
            tooltip: !0,
            tooltipOpts: {
                defaultTheme: !1
            },
            xaxis: {
                mode: 'time',
                timeformat: '%d.%m.%y %H:%M:%S',
                tickFormatter: function(val, axis) {
                    var fooJS = new Date((val + self.timezoneOffset) * 1000);
                    var fixTime = function(value) {
                        if (value < 10) {
                            return '0' + value
                        }
                        return value
                    };
                    return fixTime(fooJS.getUTCDate()) + '.' + fixTime(fooJS.getUTCMonth() + 1) + '.' + fooJS.getUTCFullYear() + ' ' + fixTime(fooJS.getUTCHours()) + ':' + fixTime(fooJS.getUTCMinutes())
                }
            },
            lines: {
                show: !0,
                lineWidth: 1,
                fill: !0,
                fillColor: {
                    colors: [{
                        opacity: 0.4
                    }, {
                        opacity: 0.3
                    }, {
                        opacity: 0.9
                    }]
                }
            },
            points: {
                show: !1,
                radius: 1
            },
            series: {
                color: defaultColor,
                threshold: thresholdArray,
            },
            selection: {
                mode: "x"
            },
        };
        $.extend(!0, options, self.flot_options);
        var $container = self.$selector,
            plot_actions = ['plotpan', 'plotzoom'];
        $.each(plot_actions, function(i, action) {
            $container.off(action).off('contextmenu');
            $container.on(action, function(event, plot) {
                self.update_plot(event, plot, action)
            }).on('contextmenu', function(event) {
                event.preventDefault();
                self.plot.zoomOut();
                return !1
            })
        });
        self.plot = $.plot($container, graph_data, options);
        on_success();
        $('#graph').bind('plotselected', function(event, ranges) {
            $.each(self.plot.getXAxes(), function(_, axis) {
                var opts = axis.options;
                opts.min = ranges.xaxis.from;
                opts.max = ranges.xaxis.to
            });
            self.plot.setupGrid();
            self.plot.draw();
            self.plot.clearSelection()
        });
        if (self.displayTooltip) {
            self.initTooltip()
        }
    },
    renderGraphForPopup: function(graph_data, on_success) {
        var self = this;
        on_success = typeof on_success == 'function' ? on_success : function() {};
        if (!graph_data) {
            graph_data = [];
            for (var host_uuid in self.last_fetched_graph_data) {
                var services = self.last_fetched_graph_data[host_uuid];
                for (var service_uuid in services) {
                    var current_data = services[service_uuid],
                        host_name = self.host_names[host_uuid],
                        service_name = self.service_names[service_uuid],
                        units = self.units[host_uuid][service_uuid];
                    for (var ds_number in current_data) {
                        graph_data.push({
                            label: host_name + '/' + service_name + '/' + self.threshold_values[host_uuid][service_uuid][ds_number].label,
                            data: current_data[ds_number],
                            unit: units[ds_number]
                        })
                    }
                }
            }
        }
        self.$selector.css({
            'width': self.width,
            'height': self.height
        });
        var color_amount = graph_data.length < 3 ? 3 : graph_data.length,
            color_generator = new ColorGenerator(),
            options = {
                colors: color_generator.generate(color_amount, 90, 90),
                legend: {
                    show: !1,
                },
                grid: {
                    hoverable: !0,
                    markings: self.threshold_lines,
                    borderWidth: {
                        top: 1,
                        right: 1,
                        bottom: 1,
                        left: 1
                    },
                    borderColor: {
                        top: '#CCCCCC'
                    }
                },
                tooltip: !0,
                tooltipOpts: {
                    defaultTheme: !1
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%d.%m.%y %H:%M:%S',
                    tickFormatter: function(val, axis) {
                        var fooJS = new Date((val + self.timezoneOffset) * 1000);
                        var fixTime = function(value) {
                            if (value < 10) {
                                return '0' + value
                            }
                            return value
                        };
                        return fixTime(fooJS.getUTCDate()) + '.' + fixTime(fooJS.getUTCMonth() + 1) + '.' + fooJS.getUTCFullYear() + ' ' + fixTime(fooJS.getUTCHours()) + ':' + fixTime(fooJS.getUTCMinutes())
                    }
                },
                yaxes: {
                    tickFormatter: function(val, axis) {
                        return '$' + val
                    },
                    max: 1200
                },
                series: {
                    lines: {
                        lineWidth: 1,
                        fill: !0,
                        fillColor: {
                            colors: [{
                                opacity: 0.5
                            }, {
                                opacity: 0.2
                            }]
                        },
                        steps: !1
                    }
                },
                points: {
                    show: !1,
                    radius: 1
                },
            };
        $.extend(!0, options, self.flot_options);
        var $container = self.$selector,
            plot_actions = ['plotpan', 'plotzoom'];
        $.each(plot_actions, function(i, action) {
            $container.off(action).off('contextmenu');
            $container.on(action, function(event, plot) {
                self.update_plot(event, plot, action)
            }).on('contextmenu', function(event) {
                event.preventDefault();
                self.plot.zoomOut();
                return !1
            })
        });
        self.plot = $.plot($container, graph_data, options);
        on_success();
        if (self.displayTooltip) {
            self.initTooltip()
        }
    },
    update: function(config, before_fetch, after_render) {
        var self = this;
        before_fetch = typeof before_fetch == 'function' ? before_fetch : function() {};
        after_render = typeof after_render == 'function' ? after_render : function() {};
        config = config || {};
        before_fetch();
        self.fetchRrdData(config, function() {
            var data = [],
                service_rules = self.last_given_service_rules,
                host_name, service_name, service_rule_name, ds_number, host_uuid, service_uuid;
            if (Object.keys(service_rules).length) {
                for (host_uuid in service_rules) {
                    for (service_uuid in service_rules[host_uuid]) {
                        for (ds_number in service_rules[host_uuid][service_uuid]) {
                            var service_rule = service_rules[host_uuid][service_uuid][ds_number];
                            host_name = service_rule.host_name;
                            service_name = service_rule.service_name;
                            service_rule_name = service_rule.service_rule_name;
                            var label = host_name + '/' + service_name + '/' + service_rule_name,
                                tmp_data = self.last_fetched_graph_data[host_uuid][service_uuid][ds_number],
                                unit = self.units[host_uuid][service_uuid][ds_number];
                            data.push({
                                label: label,
                                data: tmp_data,
                                unit: unit
                            })
                        }
                    }
                }
            } else {
                for (host_uuid in self.last_fetched_graph_data) {
                    var services = self.last_fetched_graph_data[host_uuid];
                    for (service_uuid in services) {
                        var current_data = services[service_uuid];
                        host_name = self.host_names[host_uuid];
                        service_name = self.service_names[service_uuid];
                        for (ds_number in current_data) {
                            data.push({
                                label: host_name + '/' + service_name + '/' + ds_number,
                                data: current_data[ds_number],
                                unit: self.units[host_uuid][service_uuid][ds_number]
                            })
                        }
                    }
                }
            }
            self.plot.setData(data);
            self.plot.setupGrid();
            self.plot.draw();
            after_render()
        })
    },
    drawServiceRules: function(service_rules, timerange, on_success) {
        var self = this;
        on_success = typeof on_success == 'function' ? on_success : function() {};
        if (Object.keys(service_rules).length == 0) {
            return
        }
        self.last_given_service_rules = service_rules;
        self.fetchRrdData(timerange, function() {
            self.resetGraph();
            if (Object.keys(self.last_fetched_graph_data).length == 0) {
                return
            }
            var plot_graph_data = [];
            for (var host_uuid in service_rules) {
                for (var service_uuid in service_rules[host_uuid]) {
                    for (var ds_number in service_rules[host_uuid][service_uuid]) {
                        var service_rule = service_rules[host_uuid][service_uuid][ds_number],
                            host_name = service_rule.host_name,
                            service_name = service_rule.service_name,
                            service_rule_name = service_rule.service_rule_name,
                            label = host_name + '/' + service_name + '/' + service_rule_name,
                            temp_data = self.last_fetched_graph_data[host_uuid][service_uuid][ds_number],
                            unit = self.units[host_uuid][service_uuid][ds_number];
                        plot_graph_data.push({
                            label: label,
                            data: temp_data,
                            unit: unit
                        })
                    }
                }
            }
            self.renderGraph(plot_graph_data, function() {
                on_success()
            })
        })
    },
    initTooltip: function() {
        var self = this,
            previousPoint = null,
            $graph_data_tooltip = $('#graph_data_tooltip');
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
        $(this.selector).bind('plothover', function(event, pos, item) {
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
                    self.showTooltip(item.pageX, item.pageY, tooltip_text, item.datapoint[0])
                }
            } else {
                $("#graph_data_tooltip").hide();
                previousPoint = null
            }
        })
    },
    showTooltip: function(x, y, contents, timestamp) {
        var self = this,
            $graph_data_tooltip = $('#graph_data_tooltip');
        var fooJS = new Date((timestamp + self.timezoneOffset) * 1000);
        var fixTime = function(value) {
            if (value < 10) {
                return '0' + value
            }
            return value
        };
        var humanTime = fixTime(fooJS.getUTCDate()) + '.' + fixTime(fooJS.getUTCMonth() + 1) + '.' + fooJS.getUTCFullYear() + ' ' + fixTime(fooJS.getUTCHours()) + ':' + fixTime(fooJS.getUTCMinutes());
        $graph_data_tooltip.html('<i class="fa fa-clock-o"></i> ' + humanTime + '<br /><strong>' + contents + '</strong>').css({
            top: y,
            left: x + 10
        }).appendTo('body').fadeIn(200)
    },
    addThreshold: function(host_uuid, service_uuid, ds) {
        this.threshold_lines = [];
        this.ds = ds;
        if ($.isNumeric(this.ds) && this.threshold_values[host_uuid][service_uuid][this.ds].warn !== '' && this.threshold_values[host_uuid][service_uuid][this.ds].crit !== '') {
            this.threshold_lines.push({
                color: '#FFFF00',
                yaxis: {
                    from: this.threshold_values[host_uuid][service_uuid][this.ds].warn,
                    to: this.threshold_values[host_uuid][service_uuid][this.ds].warn
                }
            });
            this.threshold_lines.push({
                color: '#FF0000',
                yaxis: {
                    from: this.threshold_values[host_uuid][service_uuid][this.ds].crit,
                    to: this.threshold_values[host_uuid][service_uuid][this.ds].crit
                }
            })
        } else if ($.isArray(this.ds)) {
            for (var ds_key in this.ds) {
                var ds_value = this.ds[ds_key];
                this.threshold_lines.push({
                    color: '#FFFF00',
                    yaxis: {
                        from: this.threshold_values[ds_value].warn,
                        to: this.threshold_values[ds_value].warn
                    }
                });
                this.threshold_lines.push({
                    color: '#FF0000',
                    yaxis: {
                        from: this.threshold_values[ds_value].crit,
                        to: this.threshold_values[ds_value].crit
                    }
                })
            }
        }
    },
    removeThreshold: function() {
        this.threshold_lines = []
    },
    resetGraph: function() {
        if (this.$selector && this.$selector.length) {
            this.$selector.html('');
            this.$selector.css({
                'width': '0px',
                'height': '0px'
            })
        }
    },
    randomRgbColor: function() {
        var r = this.getRandomInt(0, 200);
        var g = this.getRandomInt(0, 200);
        var b = this.getRandomInt(0, 200);
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    randomHexColor: function() {
        var r = this.getRandomInt(0, 200).toString(16);
        var g = this.getRandomInt(0, 200).toString(16);
        var b = this.getRandomInt(0, 200).toString(16);
        return '#' + r + g + b
    },
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    },
    getTimeoutId: function() {
        return self.timeout_id
    },
    setTimeoutId: function(timeout_id) {
        self.timeout_id = timeout_id
    },
    bindPopup: function(conf) {
        var conf = conf || {};
        this.Time = conf.Time || null;
        if (this.Time === null) {
            return alert('ERROR: TimeComponent is missing!')
        }
        this.timezoneOffset = this.Time.timezoneOffset;
        this.windowHeight = $(window).innerHeight();
        var _this = this;
        $('.popupGraph').mouseover(function(e) {
            var $this = $(this);
            var offset = $this.offset();
            _this.popupGraph($this.attr('host-uuid'), $this.attr('service-uuid'), offset)
        });
        $('.popupGraph').mouseleave(function() {
            $('#popupGraphContainer').hide();
            $('#popupGraphContainer').html('<div id="graph_legend"></div><div id="popupGraph"><center><br /><i class="fa fa-cog fa-4x fa-spin"></i><br /><br /></div></center>');
            this.xhr.abort()
        }.bind(this));
        $('body').append('<div id="popupGraphContainer" class="popup-graph-container"><div id="graph_legend"></div><div id="popupGraph"><center><br /><i class="fa fa-cog fa-4x fa-spin"></i><br /><br /></div></center></div>')
    },
    popupGraph: function(hostUuid, serviceUuid, offset) {
        var $popupGraphContainer = $('#popupGraphContainer');
        var margin = 15;
        var currentScrollPosition = $(window).scrollTop();
        if ((offset.top - currentScrollPosition + margin + $popupGraphContainer.height()) > this.windowHeight) {
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
        var host_and_service_uuids = {};
        host_and_service_uuids[hostUuid] = [serviceUuid];
        this.url = '/Graphgenerators/fetchGraphData.json';
        this.host_and_service_uuids = host_and_service_uuids;
        this.selector = '#graph';
        this.display_threshold_lines = !1;
        this.width = $popupGraphContainer.innerWidth();
        this.height = '250px';
        this.$selector = $('#popupGraph');
        this.threshold_values = [];
        this.units = [];
        this.dsNames = [];
        var current_time = parseInt(this.Time.getCurrentTimeWithOffset(0).getTime() / 1000, 10),
            time_period = {
                start: current_time - (60 * 60 * 2),
                end: current_time
            };
        this.fetchRrdData(time_period, function() {
            this.renderGraphForPopup();
            var margin = 15;
            var currentScrollPosition = $(window).scrollTop();
            if ((offset.top - currentScrollPosition + margin + $popupGraphContainer.height()) > this.windowHeight) {
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
        }.bind(this));
        $popupGraphContainer.show()
    }
});
App.Components.MasschangeComponent = Frontend.Component.extend({
    massCount: 0,
    controller: '',
    group: '',
    checkboxattr: 'hostname',
    useDeleteMessage: !0,
    extendUrl: '',
    storeUuidsAsArray: !1,
    uuidsArray: [],
    selectedIds: [],
    selectedUuids: [],
    setup: function(conf) {
        conf = conf || {};
        conf.controller = conf.controller || '';
        conf.group = conf.group || '';
        this.useDeleteMessage = conf.useDeleteMessage || this.useDeleteMessage;
        this.controller = conf.controller;
        this.group = conf.group;
        this.checkboxattr = conf.checkboxattr || this.checkboxattr;
        this.extendUrl = conf.extendUrl || this.extendUrl;
        this.storeUuidsAsArray = conf.storeUuidsAsArray || this.storeUuidsAsArray;
        var self = this;
        $('#selectAll').click(function() {
            self.selectedIds = [];
            self.selectedUuids = [];
            self.uuidsArray = [];
            $('.massChange').each(function(intIndex, checkboxObject) {
                $(checkboxObject).prop('checked', !0);
                self.addSelection($(checkboxObject).val(), $(checkboxObject).attr('uuid'));
                if (self.storeUuidsAsArray == !0) {
                    self.uuidsArray[$(checkboxObject).attr('uuid')] = $(checkboxObject).attr('host-uuid')
                }
            });
            self.showCount()
        });
        $('#untickAll').click(function() {
            $('.massChange').prop('checked', null);
            self.selectedIds = [];
            self.selectedUuids = [];
            self.uuidsArray = [];
            self.showCount()
        });
        $('.massChange').each(function(intIndex, checkboxObject) {
            if ($(checkboxObject).prop('checked') == !0) {
                self.addSelection($(checkboxObject).val(), $(checkboxObject).attr('uuid'));
                if (self.storeUuidsAsArray == !0) {
                    self.uuidsArray[$(checkboxObject).attr('uuid')] = $(checkboxObject).attr('host-uuid')
                }
            }
        });
        self.showCount();
        $('.massChange').change(function() {
            var $clickedObject = $(this);
            if ($clickedObject.prop('checked') == !0) {
                self.addSelection($clickedObject.val(), $clickedObject.attr('uuid'));
                if (self.storeUuidsAsArray == !0) {
                    self.uuidsArray[$clickedObject.attr('uuid')] = $clickedObject.attr('host-uuid')
                }
            } else {
                self.removeSelection($clickedObject.val(), $clickedObject.attr('uuid'))
            }
            self.showCount()
        })
    },
    addSelection: function(id, uuid) {
        this.selectedIds.push(id);
        this.selectedUuids.push(uuid)
    },
    removeSelection: function(id, uuid) {
        var index = this.selectedIds.indexOf(id);
        if (index != -1) {
            this.selectedIds.splice(index, 1)
        }
        var index = this.selectedUuids.indexOf(uuid);
        if (index != -1) {
            this.selectedUuids.splice(index, 1)
        }
        if (this.storeUuidsAsArray == !0) {
            if (typeof this.uuidsArray[uuid] != 'undefined') {
                delete this.uuidsArray[uuid]
            }
        }
    },
    showCount: function() {
        if (this.selectedIds.length > 0) {
            $('#selectionCount').html('(' + this.selectedIds.length + ')')
        } else {
            $('#selectionCount').html('')
        }
        this.createDeleteAllHref();
        this.createEditDetailAllHref();
        this.createCopyAllHref();
        this.createDisableAllHref();
        this.createAppendGroupAllHref()
    },
    createDeleteAllHref: function() {
        if (this.selectedIds.length > 0) {
            if (this.useDeleteMessage === !0) {
                var hostnames = this.fetchHostnames();
                var $yes = $('#message_yes');
                var $no = $('#message_no');
                $('#deleteAll').off('click').on('click', function(e) {
                    SmartMSGboxCount = 0;
                    $.SmartMessageBox({
                        title: "<span class='text-danger'>" + $('#delete_message_h1').val() + "</span>",
                        sound: !1,
                        sound_on: !1,
                        content: $('#delete_message_h2').val() + hostnames,
                        buttons: '[' + $no.val() + '][' + $yes.val() + ']'
                    }, function(ButtonPressed) {
                        if (ButtonPressed === $yes.val()) {
                            window.location = '/' + this.controller + '/mass_delete/' + this.selectedIds.join('/') + this.extendUrl
                        } else {
                            $('#MsgBoxBack').fadeOut()
                        }
                    }.bind(this))
                }.bind(this))
            } else {
                $('#deleteAll').attr('href', '/' + this.controller + '/mass_delete/' + this.selectedIds.join('/') + this.extendUrl)
            }
        } else {
            $('#deleteAll').attr('href', 'javascript:void(0);');
            $('#deleteAll').unbind('click')
        }
    },
    createDisableAllHref: function() {
        if (this.selectedIds.length > 0) {
            var hostnames = this.fetchHostnames();
            var $yes = $('#message_yes');
            var $no = $('#message_no');
            $('#disableAll').click(function(e) {
                $.SmartMessageBox({
                    title: "<span class='text-info'>" + $('#disable_message_h1').val() + "</span>",
                    sound: !1,
                    sound_on: !1,
                    content: $('#disable_message_h2').val() + hostnames,
                    buttons: '[' + $no.val() + '][' + $yes.val() + ']'
                }, function(ButtonPressed) {
                    if (ButtonPressed === $yes.val()) {
                        window.location = '/' + this.controller + '/mass_deactivate/' + this.selectedIds.join('/') + this.extendUrl
                    } else {
                        $('#MsgBoxBack').fadeOut()
                    }
                }.bind(this))
            }.bind(this))
        } else {
            $('#disableAll').attr('href', 'javascript:void(0);');
            $('#disableAll').unbind('click')
        }
    },
    createCopyAllHref: function() {
        if (this.selectedIds.length > 0) {
            $('#copyAll').attr('href', '/' + this.controller + '/copy/' + this.selectedIds.join('/') + this.extendUrl);
            var mySelectedIds = this.selectedIds;
            var myController = this.controller;
            var myExtendUrl = this.extendUrl;
            $('.copyAll-too').each(function() {
                var myObj = $(this);
                myObj.attr('href', '/' + myController + '/' + myObj.attr('data-action') + '/' + mySelectedIds.join('/') + myExtendUrl)
            })
        } else {
            $('#copyAll').attr('href', 'javascript:void(0);');
            $('.copyAll-too').each(function() {
                var myObj = $(this);
                myObj.attr('href', 'javascript:void(0);')
            })
        }
    },
    createAppendGroupAllHref: function() {
        if (this.selectedIds.length > 0) {
            $('#addToGroupAll').attr('href', '/' + this.group + '/mass_add/' + this.selectedIds.join('/') + this.extendUrl)
        } else {
            $('#addToGroupAll').attr('href', 'javascript:void(0);')
        }
    },
    createEditDetailAllHref: function() {
        if (this.selectedIds.length > 0) {
            $('#editDetailAll').attr('href', '/' + this.controller + '/edit_details/' + this.selectedIds.join('/') + this.extendUrl)
        } else {
            $('#editDetailAll').attr('href', 'javascript:void(0);')
        }
    },
    fetchHostnames: function() {
        var html = '<br />';
        $('.massChange').each(function(intIndex, checkboxObject) {
            if (this.selectedIds.indexOf($(checkboxObject).val()) != -1) {
                html += ' - ' + $(checkboxObject).attr(this.checkboxattr) + '<br />'
            }
        }.bind(this));
        return html
    }
});
App.Components.AjaxloaderComponent = Frontend.Component.extend({
    $ajaxloader: null,
    $bigAjaxLoader: null,
    runningAjaxCalls: 0,
    setup: function() {
        this.$ajaxloader = $('#global_ajax_loader');
        this.$bigAjaxLoader = $('#global-loading')
    },
    show: function() {
        this.$ajaxloader.show();
        this.$bigAjaxLoader.show();
        if (this.runningAjaxCalls < 0) {
            this.runningAjaxCalls = 0
        }
        this.runningAjaxCalls++
    },
    hide: function() {
        this.runningAjaxCalls--;
        if (this.runningAjaxCalls < 0) {
            this.runningAjaxCalls = 0
        }
        if (this.runningAjaxCalls === 0) {
            this.$ajaxloader.fadeOut('slow');
            this.$bigAjaxLoader.fadeOut('slow')
        }
    }
});
App.Components.WebsocketSudoComponent = Frontend.Component.extend({
    _wsUrl: null,
    _key: null,
    _connection: null,
    _callback: function(e) {},
    _errorCallback: function() {},
    _success: function(e) {},
    _dispatcher: function(transmitted) {},
    _event: function(transmitted) {},
    _uniqid: null,
    _keepAliveIntervalObject: null,
    _keepAliveInterval: 30000,
    setup: function(wsURL, key) {
        this._wsUrl = wsURL;
        this._key = key
    },
    connect: function() {
        if (this._connection === null) {
            this._connection = new WebSocket(this._wsUrl)
        }
        this._connection.onopen = this._onConnectionOpen.bind(this);
        this._connection.onmessage = this._onResponse.bind(this);
        this._connection.onerror = this._onError.bind(this);
        return this._connection
    },
    send: function(json, connection) {
        connection = connection || this._connection;
        connection.send(json)
    },
    _onConnectionOpen: function(e) {
        this.requestUniqId()
    },
    _onError: function() {
        this._errorCallback()
    },
    _onResponse: function(e) {
        var transmitted = JSON.parse(e.data);
        switch (transmitted.type) {
            case 'connection':
                this._uniqid = transmitted.uniqid;
                this.__success(e);
                break;
            case 'response':
                if (this._uniqid === transmitted.uniqid) {
                    this._callback(transmitted)
                }
                break;
            case 'dispatcher':
                this._dispatcher(transmitted);
                break;
            case 'event':
                if (this._uniqid === transmitted.uniqid) {
                    this._event(transmitted)
                }
                break;
            case 'keepAlive':
                break
        }
    },
    requestUniqId: function() {
        this.send(this.toJson('requestUniqId', ''))
    },
    toJson: function(task, data) {
        var jsonArr = [];
        jsonArr = JSON.stringify({
            task: task,
            data: data,
            uniqid: this._uniqid,
            key: this._key
        });
        return jsonArr
    },
    keepAlive: function() {
        if (this._keepAliveIntervalObject == null) {
            this._keepAliveIntervalObject = setInterval(function() {
                this.send(this.toJson('keepAlive', ''))
            }.bind(this), this._keepAliveInterval)
        }
    },
    __success: function(e) {
        this.keepAlive();
        this._success(e)
    }
});
App.Components.SearchComponent = Frontend.Component.extend({
    $nodeListSearch: null,
    nodeSearch: function() {
        var self = this;
        this.$nodeListSearch = $('#node-list-search');
        this.$nodeListSearch.on('keyup', function(e) {
            var value = self.$nodeListSearch.val();
            if (value == '') {
                $('.searchContainer').show()
            } else {
                $('.searchMe').each(function(intKey, object) {
                    var $object = $(object);
                    if (!$object.html().toLowerCase().match(value)) {
                        $object.parent().hide()
                    }
                })
            }
        })
    }
});
App.Components.CustomVariablesComponent = Frontend.Component.extend({
    $customVariablesContainer: null,
    $ajaxloader: null,
    setup: function(conf) {
        conf = conf || {};
        this.ajaxUrl = conf.ajaxUrl || '/Hosttemplates/addCustomMacro';
        this.controller = conf.controller || 'Hosttemplates';
        this.macrotype = conf.macrotype || 'HOST';
        this.macroPrefix = conf.macroPrefix || '$_';
        this.macroSuffix = conf.macroSuffix || '$';
        this.illegalCharacters = conf.illegalCharacters || /[^\d\w\_]/g;
        this.onClick = conf.onClick || function() {};
        this.ajaxUrl = '/' + this.controller + '/addCustomMacro';
        $customVariablesContainer = $('#customVariablesContainer');
        this.$ajaxloader = $('#global_ajax_loader');
        var self = this;
        $(document).on("click", ".deleteMacro", function(e) {
            $this = $(this);
            $this.parent().parent().remove()
        });
        $(document).on("change", ".macroName", function(e) {
            $this = $(this);
            var clearName = $this.val().toUpperCase().replace(self.illegalCharacters, '');
            $this.parent().parent().find('span').html(self.macroPrefix + self.macrotype + clearName + self.macroSuffix);
            $this.val(clearName)
        });
        $('.addCustomMacro').on('click', function() {
            self.addCustomMacroSkeleton(self.onClick)
        })
    },
    addCustomMacroSkeleton: function(onSuccess) {
        this.$button = $(this);
        this.$button.prop('disabled', !0);
        this.$ajaxloader.show();
        ret = $.ajax({
            url: this.ajaxUrl + "/" + this.getNextId(),
            type: "GET",
            error: function() {},
            success: function() {},
            complete: function(response) {
                $customVariablesContainer.append(response.responseText);
                this.$ajaxloader.fadeOut('slow');
                this.$button.prop('disabled', null);
                onSuccess()
            }.bind(this)
        })
    },
    getNextId: function() {
        var currentHighestValue = 1;
        var $custmVariableInputs = $('#customVariablesContainer').find('.macroName');
        $custmVariableInputs.each(function(key, currentInputField) {
            var $currentInputField = $(currentInputField);
            var counterAttr = $currentInputField.attr('counter');
            if (typeof counterAttr !== typeof undefined && counterAttr !== !1) {
                var currentValue = parseInt(counterAttr, 10);
                if (currentValue > currentHighestValue) {
                    currentHighestValue = currentValue
                }
            }
        });
        console.log(currentHighestValue + 1);
        return currentHighestValue + 1
    },
    loadMacroFromTemplate: function(template_id, onComplete) {
        onComplete = typeof onComplete === 'function' ? onComplete : function() {};
        this.$button = $('.addCustomMacro');
        this.$button.prop('disabled', !0);
        this.$ajaxloader.show();
        ret = $.ajax({
            url: "/" + this.controller + "/loadTemplateMacros/" + encodeURIComponent(template_id),
            type: "GET",
            dataType: "json",
            error: function() {},
            success: function() {},
            complete: function(response) {
                $customVariablesContainer.html(response.responseJSON.html);
                onComplete.call($customVariablesContainer, response);
                this.$ajaxloader.fadeOut('slow');
                this.$button.prop('disabled', null)
            }.bind(this)
        })
    }
});
App.Components.AttachmentsComponent = Frontend.Component.extend({
    _element: null,
    setup: function($element, options) {
        this._element = $element;
        options = options || {};
        var defaultOptions = {
            model: this._element.data('model'),
            foreignKey: this._element.data('foreign-key'),
            endpoint: '/attachments/handle_upload'
        };
        this.options = $.extend({}, defaultOptions, options);
        this.refreshList();
        this._element.find('.uploader').fineUploader({
            request: {
                endpoint: this.options.endpoint,
                params: {
                    model: this.options.model,
                    foreignKey: this.options.foreignKey
                }
            },
            template: this._element.parent().find('#fine-uploader-template').html(),
            failedUploadTextDisplay: {
                mode: 'custom',
                maxChars: 100,
                responseProperty: 'error',
                enableTooltip: !0
            }
        }).on('complete', this._onUploadCompleted.bind(this))
    },
    _onUploadCompleted: function() {
        this.refreshList()
    },
    refreshList: function() {
        var url = {
            controller: 'attachments',
            action: 'get_list',
            pass: [this.options.model, this.options.foreignKey]
        };
        App.Main.loadWidget(url, {
            target: this._element.find('.list'),
            onComplete: function() {}
        })
    }
});
App.Components.UtilsComponent = Frontend.Component.extend({
    flappingIntervalObject: null,
    flappingInterval: 750,
    $flappingContainer: null,
    flapping: function() {
        this.$flappingContainer = $('.flapping_airport');
        if (this.$flappingContainer.length > 0) {
            var i = 0;
            if (this.flappingIntervalObject != null) {
                clearInterval(this.flappingIntervalObject)
            }
            this.flappingIntervalObject = setInterval(function() {
                if (i == 0) {
                    this.$flappingContainer.html('<i class="fa fa-circle"></i> <i class="fa fa-circle-o"></i>');
                    i = 1
                } else {
                    this.$flappingContainer.html('<i class="fa fa-circle-o"></i> <i class="fa fa-circle"></i>');
                    i = 0
                }
            }.bind(this), this.flappingInterval)
        }
    },
    browserDatatables: function() {
        $('#host-list-datatables').dataTable({
            "bPaginate": !1,
            "bFilter": !1,
            "bInfo": !1,
            "bStateSave": !0
        });
        $('div.dataTables_filter').attr('style', 'width: 100% !important;padding-right: 20px;').children('.input-group').attr('style', 'width: 100% !important;')
    }
});
App.Components.ContainerSelectboxComponent = Frontend.Component.extend({
    Ajaxloader: null,
    callback: function(containerId) {},
    setup: function(Ajaxloader) {
        this.Ajaxloader = Ajaxloader
    },
    setCallback: function(callback) {
        this.callback = callback
    },
    addContainerEventListener: function(options) {
        var self = this;
        var defaults = {
            event: 'change',
            optionGroupFieldTypes: {}
        };
        options = $.extend({}, defaults, options);
        $(options.selectBoxSelector).on(options.event, function() {
            var containerId = parseInt($(this).val(), 10),
                ajaxUrl;
            if (isNaN(containerId) || containerId <= 0) {
                return
            }
            ajaxUrl = options.ajaxUrl.replace(':selectBoxValue:', containerId);
            self.Ajaxloader.show();
            $.ajax({
                url: ajaxUrl,
                type: 'post',
                dataType: 'json',
                error: function() {},
                success: function() {},
                complete: function(response) {
                    var fieldType, key, $querySelect;
                    if (Object.keys(options.optionGroupFieldTypes).length > 0) {
                        for (fieldType in response.responseJSON) {
                            $querySelect = $(options.optionGroupFieldTypes[fieldType]);
                            var oldValues = ($querySelect.val()) ? $querySelect.val() : [];
                            $querySelect.html('');
                            $querySelect.attr('data-placeholder', options.dataPlaceholder);
                            if (Object.keys(response.responseJSON[fieldType]).length > 0) {
                                $querySelect.attr('data-placeholder', options.dataPlaceholder)
                            }
                            self.getFilteredSelectionsForOptionGroup($querySelect, oldValues, response.responseJSON[fieldType], fieldType);
                            $querySelect.trigger('chosen:updated')
                        }
                    }
                    for (fieldType in response.responseJSON) {
                        $querySelect = $(options.fieldTypes[fieldType]);
                        var oldValues = ($querySelect.val()) ? $querySelect.val() : [];
                        $querySelect.html('');
                        $querySelect.attr('data-placeholder', options.dataPlaceholder);
                        self.getFilteredSelections($querySelect, oldValues, response.responseJSON[fieldType]);
                        $querySelect.trigger("chosen:updated")
                    }
                    self.Ajaxloader.hide();
                    self.callback(containerId)
                }
            })
        })
    },
    getFilteredSelections: function($querySelect, values, newData) {
        values = (values instanceof Array) ? values : [values];
        for (var key in newData) {
            var selected = !1;
            if (in_array(newData[key].key, values)) {
                selected = !0
            }
            this.addOptionsForInputField($querySelect, newData[key].key, newData[key].value, selected)
        }
    },
    getFilteredSelectionsForOptionGroup: function($querySelect, values, newData, typeKey) {
        var optgroupLabel = null;
        var $optGroupObject = null;
        values = (values instanceof Array) ? values : [values];
        for (var key in newData) {
            for (var subKey in newData[key].value) {
                if (optgroupLabel != subKey) {
                    optgroupLabel = subKey;
                    this.addOptionGroupForInputField($querySelect, typeKey + '_' + newData[key].key, optgroupLabel);
                    $optGroupObject = $('#' + typeKey + '_' + newData[key].key)
                }
                for (var k in newData[key].value[subKey]) {
                    var selected = !1;
                    if (in_array(k, values)) {
                        selected = !0
                    }
                    this.addOptionsForInputField($optGroupObject, k, newData[key].value[subKey][k], selected)
                }
            }
        }
    },
    addOptionsForInputField: function($querySelect, optionKey, optionValue, selected) {
        if (this.Controller.name === 'services' && this.Controller.action === 'add') {
            if ($querySelect.selector === '#ServiceServicetemplateId') {
                $querySelect.append($('<option>'))
            }
        }
        $querySelect.append($('<option>', {
            value: optionKey,
            text: optionValue,
            selected: selected
        }))
    },
    addOptionGroupForInputField: function($querySelect, id, optionGroupLabel) {
        $querySelect.append($('<optgroup>', {
            id: id,
            label: optionGroupLabel
        }))
    }
});
App.Components.FullcalendarComponent = Frontend.Component.extend({
    setup: function($calendar, events) {
        var self = this;
        self.$calendar = $calendar;
        self.events = [];
        $.each(events, function(i, elem) {
            var className = (elem.default_holiday === '1') ? 'defaultHoliday' : '';
            self.events.push({
                title: elem.name,
                start: i,
                allDay: !0,
                durationEditable: !1,
                overlap: !1,
                className: className
            });
            self.createHiddenFieldsForEvent(elem.name, i, className)
        });
        self.originalDate = null;
        self.$calendar.fullCalendar({
            header: {
                left: !1,
                center: 'title',
                right: 'prev, next',
            },
            firstDay: 1,
            weekNumbers: !0,
            editable: !0,
            disableResizing: !0,
            allDayDefault: !0,
            slotEventOverlap: !1,
            events: self.events,
            eventOverlap: function(stillEvent, movingEvent) {
                return stillEvent.allDay && movingEvent.allDay
            },
            viewRender: function(view, element) {
                var $addButton = $('<button>').html('<i class="fa fa-plus-circle txt-color-green"></i>').attr({
                    title: 'add',
                    class: 'btn btn-xs btn-default calendar-button calendar-button-add'
                }).click(function() {
                    var title = prompt('Holiday Name:');
                    if (title) {
                        $calendar.fullCalendar('renderEvent', {
                            title: title,
                            start: $(this).closest('td').attr('data-date'),
                            allDay: !0,
                            durationEditable: !1,
                            overlap: !1
                        }, !0)
                    }
                    return !1
                });
                $(".fc-day-number").css('text-align', 'left').append($addButton)
            },
            eventAfterRender: function(event, element, view) {
                var $selectedElement = $('.fc-day-number[data-date="' + $.fullCalendar.moment(event.start).format() + '"]');
                var $editButton = $('<button>').html('<i class="fa fa-pencil txt-color-blue"></i>').attr({
                    title: 'edit',
                    class: "btn btn-xs btn-default calendar-button calendar-button-edit"
                }).click(function() {
                    var title = prompt('Holiday Name:', event.title);
                    if (title) {
                        if (title) {
                            event.title = title;
                            event.className = '';
                            self.$calendar.fullCalendar('updateEvent', event)
                        }
                    }
                    return !1
                });
                var $deleteButton = $('<button>').html('<i class="fa fa-trash txt-color-red"></i>').attr({
                    title: 'delete',
                    class: 'btn btn-xs btn-default calendar-button calendar-button-delete'
                }).click(function() {
                    self.$calendar.fullCalendar('removeEvents', event._id);
                    $("input[name^='data[CalendarHoliday][" + $.fullCalendar.moment(event.start).format() + "]']").remove()
                });
                $selectedElement.has('button.calendar-button-add').each(function() {
                    $selectedElement.find('.calendar-button-add').remove()
                });
                $selectedElement.not(':has(button.calendar-button-delete)').each(function() {
                    $selectedElement.append($deleteButton)
                });
                $selectedElement.not(':has(button.calendar-button-edit)').each(function() {
                    $selectedElement.append($editButton)
                });
                self.createHiddenFieldsForEvent(event.title, $.fullCalendar.moment(event.start).format(), event.className)
            },
            eventDestroy: function(event, element, view) {
                var $selectedElement = $('.fc-day-number[data-date="' + $.fullCalendar.moment(event.start).format() + '"]');
                $selectedElement.find("button[class$='-edit'],button[class$='-delete']").remove();
                var $addButton = $('<button>').html('<i class="fa fa-plus-circle txt-color-green"></i>').attr({
                    title: 'add',
                    class: 'btn btn-xs btn-default calendar-button calendar-button-add'
                }).click(function() {
                    var title = prompt('Holiday Name:');
                    if (title) {
                        self.$calendar.fullCalendar('renderEvent', {
                            title: title,
                            start: $(this).closest('td').attr('data-date'),
                            allDay: !0,
                            durationEditable: !1,
                            overlap: !1
                        }, !0)
                    }
                    return !1
                });
                $selectedElement.append($addButton)
            },
            eventDragStart: function(event) {
                self.originalDate = $.fullCalendar.moment(event.start).format()
            },
            eventDragStop: function(event) {
                event.className = '';
                self.createHiddenFieldsForEvent(event.title, $.fullCalendar.moment(event.start).format(), event.className);
                self.$calendar.fullCalendar('updateEvent', event)
            },
            eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
                var $selectedElement = $('.fc-day-number[data-date="' + self.originalDate + '"]');
                $selectedElement.find("button[class$='-edit'],button[class$='-delete']").remove();
                $("input[name^='data[CalendarHoliday][" + self.originalDate + "]']").remove();
                var addButton = $('<button class="btn btn-xs btn-default calendar-button ' + 'calendar-button-add" title="add" type="button">' + '<i class="fa fa-plus-circle txt-color-green"></i></button>').click(function() {
                    var eventTitle = prompt('Holiday Name:');
                    if (eventTitle) {
                        $calendar.fullCalendar('renderEvent', {
                            title: eventTitle,
                            start: $(this).closest('td').attr('data-date'),
                            allDay: !0,
                            durationEditable: !1,
                            overlap: !1,
                            className: ''
                        }, !0)
                    }
                });
                $selectedElement.append(addButton)
            }
        });
        $('.fc-left').append($('#calendar-buttons').removeClass('hidden'));
        $('#btn-delete-all-events').click(function() {
            $calendar.fullCalendar('removeEvents');
            $("input[name^='data[CalendarHoliday]']").remove();
            return !1
        });
        $('#btn-delete-month-events').click(function() {
            var currentViewStart = $.fullCalendar.moment($calendar.fullCalendar('getView').intervalStart).format();
            var currentViewEnd = $.fullCalendar.moment($calendar.fullCalendar('getView').intervalEnd).format()
            var events = $calendar.fullCalendar('clientEvents', function(event) {
                var eventDate = $.fullCalendar.moment(event.start).format();
                if (eventDate >= currentViewStart && eventDate < currentViewEnd) {
                    $calendar.fullCalendar('removeEvents', event._id);
                    $("input[name^='data[CalendarHoliday][" + eventDate + "]']").remove()
                }
            });
            return !1
        });
        $("ul.dropdown-menu").delegate("a", "click", function() {
            $calendar.fullCalendar('removeEvents', function(event) {
                $("input[name^='data[CalendarHoliday][" + $.fullCalendar.moment(event.start).format() + "]']").remove();
                return event.className == "defaultHoliday"
            });
            if ($(this).attr('id') != 'removeDefaultHolidays') {
                $.ajax({
                    url: '/calendars/loadHolidays/' + $(this).attr('id') + '.json',
                    type: 'POST',
                    dataType: 'json',
                    success: function(response) {
                        var currentEventDates = [];
                        var events = [];
                        $calendar.fullCalendar('clientEvents', function(event) {
                            currentEventDates.push($.fullCalendar.moment(event.start).format())
                        });
                        $.each(response.holidays, function(eventStart, eventTitle) {
                            if ($.inArray(eventStart, currentEventDates) === -1) {
                                var event = {
                                    title: eventTitle,
                                    start: eventStart,
                                    allDay: !0,
                                    durationEditable: !1,
                                    overlap: !1,
                                    className: 'defaultHoliday'
                                };
                                events.push(event);
                                self.createHiddenFieldsForEvent(eventTitle, eventStart, event.className)
                            }
                        });
                        $calendar.fullCalendar('addEventSource', events)
                    }
                })
            }
        })
    },
    createHiddenFieldsForEvent: function(eventTitle, eventStart, className) {
        var $hiddenFieldElementTitle = $("input[name^='data[CalendarHoliday][" + eventStart + "][name]']");
        var $hiddenFieldElementDefaultHoliday = $("input[name^='data[CalendarHoliday][" + eventStart + "][default_holiday]']");
        if ($hiddenFieldElementTitle.length && $hiddenFieldElementDefaultHoliday.length) {
            $hiddenFieldElementTitle.val(eventTitle);
            $hiddenFieldElementDefaultHoliday.val((className == 'defaultHoliday') ? 1 : 0)
            return !0
        }
        $('[id^=Calendar]').append($('<input/>', {
            type: 'hidden',
            name: 'data[CalendarHoliday][' + eventStart + '][name]',
            value: eventTitle
        }), $('<input/>', {
            type: 'hidden',
            name: 'data[CalendarHoliday][' + eventStart + '][default_holiday]',
            value: ((className == 'defaultHoliday') ? 1 : 0)
        }))
    }
});
App.Components.ImageChooserComponent = Frontend.Component.extend({
    setup: function($dom) {
        $dom.find('.image-chooser-input a.choose-image').click(this._onChooseImage.bind(this));
        $dom.find('.image-chooser-input a.remove-image').click(this._onRemoveImage.bind(this))
    },
    _onChooseImage: function(e) {
        var finder = new CKFinder();
        finder.selectActionFunction = this._onSelectFile.bind(this);
        finder.selectActionData = {
            imageChooser: $(e.currentTarget).parents('.image-chooser-input'),
            finder: finder
        }
        finder.popup(600, 400)
    },
    _onRemoveImage: function(e) {
        $('.image-chooser-input .image-name').html(__('forms.no_image_chosen'));
        $('.image-chooser-input .image-name-input').val('');
        $('.image-chooser-input .image-name').html(__('none'));
        $('.image-chooser-input .thumb img').hide();
        $('.image-chooser-input a.remove-image').hide()
    },
    _onSelectFile: function(file, params, all) {
        params.selectActionData.imageChooser.find('.image-name').html(urldecode(file));
        params.selectActionData.imageChooser.find('.image-name-input').val(urldecode(file));
        params.selectActionData.imageChooser.find('.thumb img').attr({
            src: file
        }).show();
        params.selectActionData.finder.api.closePopup();
        removeLink = '<a class="btn btn-xs btn-default remove-image">Remove Image</a>';
        $(removeLink).insertAfter('.image-chooser-input a.choose-image').click(this._onRemoveImage.bind(this))
    }
});
App.Components.AcoComponent = Frontend.Component.extend({
    setup: function() {
        var self = this;
        $('.tree > ul').attr('role', 'tree').find('ul').attr('role', 'group');
        $('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').click(function(e) {
            var children = $(this).parent('li.parent_li').find(' > ul > li');
            if (children.is(':visible')) {
                children.hide('fast');
                $(this).attr('title', 'Expand this branch').find(' > i').toggleClass('fa-folder-open fa-folder')
            } else {
                children.show('fast');
                $(this).attr('title', 'Collapse this branch').find(' > i').toggleClass('fa-folder fa-folder-open')
            }
        });
        $('#expandAll').click(function() {
            self.expandTree()
        });
        $('#collapseAll').click(function() {
            self.collapseTree()
        });
        $("i[data-action]").each(function() {
            $(this).click(function() {
                var className = $(this).data('action');
                if ($(this).attr('click-action') === 'on') {
                    self.setChecked(className)
                } else {
                    self.unsetChecked(className)
                }
            })
        })
    },
    collapseTree: function() {
        $('.tree li ul li ul> li').hide();
        $('#tree .fa-folder-open').toggleClass('fa-folder-open fa-folder')
    },
    expandTree: function() {
        $('.tree li ul > li').show();
        $('#tree .fa-folder').toggleClass('fa-folder fa-folder-open')
    },
    setChecked: function(className) {
        var classNameFilter = '';
        if (className !== 'all') {
            classNameFilter = '[class*=' + className + ']'
        }
        $('#tree input:checkbox' + classNameFilter + ':not(:checked)').prop('checked', !0)
    },
    unsetChecked: function(className) {
        var classNameFilter = '';
        if (className !== 'all') {
            classNameFilter = '[class*=' + className + ']'
        }
        $('#tree input:checkbox' + classNameFilter + ':checked').prop('checked', !1)
    }
});
App.Components.UuidComponent = Frontend.Component.extend({
    v4: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16)
        })
    }
});
App.Components.ExternalcommandComponent = Frontend.Component.extend({
    $flashSuccess: null,
    $autoRefreshCounter: null,
    delay: 5,
    intervalObject: null,
    setup: function() {
        this.$flashSuccess = $('#flashSuccess');
        this.$autoRefreshCounter = $('#autoRefreshCounter')
    },
    refresh: function() {
        this.show();
        this.$autoRefreshCounter.html(this.delay);
        this.intervalObject = setInterval(function() {
            this.delay--;
            this.$autoRefreshCounter.html(this.delay);
            if (this.delay == 0) {
                document.location = document.location
            }
        }.bind(this), 1000)
    },
    show: function() {
        this.$flashSuccess.show()
    },
    hide: function() {
        this.$flashSuccess.hide()
    }
});
App.Components.TimeComponent = Frontend.Component.extend({
    serverRenderTime: null,
    serverDate: {},
    serverOffset: 0,
    displayClientTime: !1,
    initialized: !1,
    serverUTC: 0,
    timezoneOffset: 0,
    server_time_utc: 0,
    setup: function() {
        $.ajax({
            url: '/angular/user_timezone.json',
            type: 'GET',
            cache: !1,
            error: function() {},
            success: function(response) {
                this.timezoneOffset = response.timezone.user_offset;
                this.serverOffset = response.timezone.server_timezone_offset;
                this.server_time_utc = response.timezone.server_time_utc
            }.bind(this),
            complete: function(response) {}
        });
        this.pageLoaded = new Date().getTime();
        if (this.timezoneOffset != this.serverOffset) {
            this.displayClientTime = !0
        }
        this.initialized = !0
    },
    _prependNumber: function(number) {
        if (number < 10) {
            return '0' + number
        }
        return number.toString()
    },
    _isInitialized: function() {
        if (!this.initialized) {
            if (typeof console.warn === 'function') {
                console.warn('TimeComponent isn\'t initialized. Please call the setup() method first, ' + 'before using this functions.')
            }
            return !1
        }
        return !0
    },
    getCurrentTimeWithOffset: function(offset) {
        if (typeof(this.pageLoaded) === 'undefined') {
            this.pageLoaded = new Date().getTime()
        }
        return new Date((this.getServerUTC() + (offset || 0)) * 1000 + (new Date().getTime() - this.pageLoaded))
    },
    getServerTime: function() {
        this._isInitialized();
        return this.getCurrentTimeWithOffset(this.serverOffset)
    },
    getServerTimeAsText: function() {
        return this.formatTimeAsText(this.getServerTime())
    },
    getClientTime: function() {
        this._isInitialized();
        return this.getCurrentTimeWithOffset(this.timezoneOffset)
    },
    getServerUTC: function() {
        return this.server_time_utc
    },
    getClientTimeAsText: function() {
        return this.formatTimeAsText(this.getClientTime())
    },
    formatTimeAsText: function(time) {
        return this._prependNumber(time.getUTCHours()) + ':' + this._prependNumber(time.getUTCMinutes())
    }
});
App.Components.OverlayComponent = Frontend.Component.extend({
    setup: function(conf) {
        conf = conf == null ? {} : conf;
        var defaults = {
            $overlay: $('.overlay'),
            $ui: $('#ui-widget'),
            on_activate: function() {},
            on_deactivate: function() {}
        };
        $.extend(this, defaults, conf)
    },
    activateUi: function() {
        var self = this;
        self.$overlay.animate({
            opacity: 0
        }, 250, function() {
            self.$overlay.css({
                display: 'none'
            }).width(0).height(0)
        });
        this.activateFields()
    },
    deactivateUi: function() {
        this.$overlay.css({
            display: 'block',
            position: 'absolute',
            'background-color': '#000',
            'z-index': 10,
            opacity: 0
        }).width(this.$ui.width()).height(this.$ui.height()).animate({
            opacity: 0.5
        }, 250);
        this.deactivateFields()
    },
    deactivateFields: function() {
        this.$ui.find('input').prop('disabled', !0);
        this.$ui.find('select').prop('disabled', !0).trigger('chosen:updated');
        this.on_deactivate()
    },
    activateFields: function() {
        this.$ui.find('input').prop('disabled', !1);
        this.$ui.find('select').prop('disabled', !1).trigger('chosen:updated');
        this.on_activate()
    }
});
App.Components.HighlightComponent = Frontend.Component.extend({
    $selector: null,
    highlight: function($selector, conf) {
        conf = conf || {};
        conf.speed = conf.speed || 600;
        conf.html = conf.html || '';
        this.$selector = $selector;
        $div = $('<div class="highlight">' + conf.html + '</div>');
        $div.css({
            'width': this.$selector.width() + 'px',
            'height': this.$selector.height() + 'px',
            'left': this.$selector.css('padding-left')
        });
        this.$selector.append($div);
        $div.fadeOut(conf.speed, function() {
            $div.remove()
        })
    }
});
App.Components.ListFilterComponent = Frontend.Component.extend({
    render: function() {
        $('.list-filter a.toggle').click(this._onToggleClick.bind(this));
        $('.oitc-list-filter').click(this._onOitcToggleClick.bind(this));
        if ($('.oitc-list-filter').attr('hide-on-render') == 'true') {
            $('.list-filter').removeClass('opened').hide()
        }
    },
    _onToggleClick: function(e) {
        var $a = $(e.currentTarget);
        var $filter = $a.parent().parent();
        var $content = $filter.find('> .content');
        if ($filter.hasClass('opened')) {
            $a.text('open');
            $content.hide();
            $filter.removeClass('opened').addClass('closed')
        } else {
            $content.show();
            $filter.addClass('opened').removeClass('closed');
            $a.text('close')
        }
    },
    _onOitcToggleClick: function(event) {
        var $filter = $('.list-filter');
        if ($filter.hasClass('opened')) {
            $filter.removeClass('opened').addClass('closed');
            $filter.hide()
        } else {
            $filter.addClass('opened').removeClass('closed');
            $filter.show()
        }
    }
});
App.Components.WebsocketChatComponent = Frontend.Component.extend({
    $container: null,
    _wsUrl: null,
    _connection: null,
    _keepAliveIntervalObject: null,
    _keepAliveInterval: 30000,
    _titleFlapIntervalObject: null,
    _titleFlapIntervalFunction: function() {
        return !0
    },
    _errorCallback: function() {
        return !0
    },
    _orginalTitle: document.title,
    new_message: 'new message',
    setup: function($el, wsURL) {
        this.$container = $el;
        this._wsUrl = wsURL;
        this.username = null;
        this.user_id = null;
        $(window).focus(function() {
            window.clearInterval(this._titleFlapIntervalObject);
            this._titleFlapIntervalObject = null;
            document.title = this._orginalTitle;
            this._titleFlapIntervalFunction = function() {
                return !0
            }
        }.bind(this));
        $(window).blur(function() {
            this._titleFlapIntervalFunction = function() {
                this._titleFlapIntervalObject = setInterval(function() {
                    if (document.title == this._orginalTitle) {
                        document.title = this.new_message
                    } else {
                        document.title = this._orginalTitle
                    }
                }.bind(this), 1500)
            }.bind(this)
        }.bind(this));
        this.$container.find('.textarea-controls button').click(function() {
            this._onMessageFormSend('message')
        }.bind(this));
        this.$container.find('textarea').keyup(function(e) {
            if (e.keyCode === 13 && this.$container.find('input[type=checkbox]#subscription').is(':checked')) {
                this._onMessageFormSend('message')
            }
        }.bind(this))
    },
    connect: function() {
        this._connection = new WebSocket(this._wsUrl);
        this._connection.onopen = this._onConnectionOpen.bind(this);
        this._connection.onmessage = this._onConnectionMessage.bind(this);
        this._connection.onerror = this._onError.bind(this)
    },
    _onMessageFormSend: function(type) {
        var $textarea = this.$container.find('textarea');
        var jsonArr = [];
        jsonArr = JSON.stringify({
            message: $textarea.val(),
            user_id: this.user_id,
            type: type
        });
        this._connection.send(jsonArr);
        $textarea.val('')
    },
    _onError: function() {
        this._errorCallback()
    },
    _onConnectionOpen: function(e) {
        this.addMessage(null, 'Chat Client', 'You have been connected.', 'server_message');
        this._onMessageFormSend('connection');
        this.keepAlive()
    },
    _onConnectionMessage: function(e) {
        var messageData = JSON.parse(e.data);
        switch (messageData.type) {
            case 'message':
            case 'server_message':
                this.addMessage(messageData.time, messageData.user, messageData.message, messageData.type, messageData.image);
                break
        }
    },
    addMessage: function(time, username, message, type, userimage) {
        if (type == 'keepAlive') {
            return
        }
        if (type == 'server_message') {
            var $message = $('<li/>');
            $message.addClass('message');
            var $text = $('<div class="alert alert-info fade in"><button class="close" data-dismiss="alert"> × </button><i class="fa-fw fa fa-info"></i></div>');
            $text.css('margin-left', '0px');
            var $username = $('<a/>');
            $text.append(username + ' <i class="fa-fw fa fa-arrow-right "></i> ' + message)
        } else {
            this.flapTitle();
            var $message = $('<li/>');
            $message.addClass('message');
            $message.append('<img src="' + userimage + '" style="height:50px;" class="online" alt="">');
            var $text = $('<div class="message-text" style="min-height: 35px;"></div>');
            if (time) {
                $text.append('<time>' + time + '</time>')
            }
            var $username = $('<a/>');
            $text.append($username);
            $text.append(message)
        }
        $username.addClass('username').text(username);
        $message.append($text);
        this.$container.find('.chat-body > ul').append($message);
        this.$container.find('#chat-body').animate({
            scrollTop: this.$container.find('#chat-body')[0].scrollHeight
        }, 500)
    },
    setUsername: function(username) {
        this.username = username
    },
    setUserId: function(user_id) {
        this.user_id = user_id
    },
    keepAlive: function() {
        if (this._keepAliveIntervalObject == null) {
            this._keepAliveIntervalObject = setInterval(function() {
                this._onMessageFormSend('keepAlive')
            }.bind(this), this._keepAliveInterval)
        }
    },
    flapTitle: function() {
        if (this._titleFlapIntervalObject === null) {
            this._titleFlapIntervalFunction()
        }
    }
})