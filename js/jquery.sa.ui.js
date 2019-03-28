/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description Sa.UI.js for jQuery
 * @Since 16/7/24
 */


(function (root, name, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	}
	else if (typeof module != 'undefined') {
		module.exports = factory(require('$'));
	}
	else {
		root[name] = factory(root['$']);
	}
})(this, 'saui', function ($) {
	if (typeof $ === 'undefined') {
		throw 'SaUI need jQuery';
	}
	else {
		$(function () {
			console.info('\
		┏━━━┓    ┏┓ ┏┓┏━━┓\n\
		┃┏━┓┃    ┃┃ ┃┃┗┫┣┛\n\
		┃┗━━┓┏━━┓┃┃ ┃┃ ┃┃ \n\
		┗━━┓┃┃┏┓┃┃┃ ┃┃ ┃┃ \n\
		┃┗━┛┃┃┏┓┃┃┗━┛┃┏┫┣┓\n\
		┗━━━┛┗┛┗┛┗━━━┛┗━━┛');

			$('body')
				.off('ready')

				/* 下拉菜单 */
				.on('tap', '.dropdown', function (e, isOpen) {
					if (isOpen) {
						$('.dropdown[open]').removeClass('dropdown-open').removeAttr('open');
						$(this).attr('open', true).addClass('dropdown-open');
					}
					else {
						$(this).removeClass('dropdown-open');
					}
				})
				.on('touchstart', '.dropdown:not(.dropdown-open)', function () {
					$(this).data('touchTime', new Date().getTime());
				})
				.on('touchend', '.dropdown:not(.dropdown-open)', function () {
					if (new Date().getTime() - $(this).data('touchTime') < 300) {
						$(this).trigger('tap', [true]);
						return false;
					}
				})
				.on('click', '.dropdown:not(.dropdown-open)', function () {
					$(this).trigger('tap', [true]);
					return false;
				})
				.on('click touchend', '.dropdown.dropdown-open', function () {
					$(this).trigger('tap');
				})
				.on('click touchend',
					'.dropdown.dropdown-open .dropdown-head,.dropdown.dropdown-open .dropdown-disabled,.dropdown.dropdown-open .dropdown-divider',
					function () {
						return false;
					})
				.on('click touchend', function (e) {
					// 关闭下拉菜单
					$('.dropdown[open]').removeClass('dropdown-open').removeAttr('open');
					// 关闭日历
					var $ca = $(e.target).closest('[role="calendar"]');
					var $el = $('[role="calendar"][open]').not($ca);
					var oProto = $el.data('op');
					oProto && oProto.dismiss();
				})

				/* 弹框 */
				.on('click', '[role="dialog"]', function () {
					var $This = $(this);
					var sType = $This.data('type') || '';
					var sTitle = $This.data('title') || '';
					var sContent = $This.data('content') || '';
					var sEvent = $This.data('event') || '';
					var aSize = ($This.data('size') || ',').split(',');
					switch (sType.toLowerCase()) {
						case 'alert':
							$('<div>' + sContent + '</div>').dialog({
								type     : 'alert',
								onClose  : sEvent ? window[sEvent] : null,
								closeType: 'dismiss',
								width    : aSize[0] || 300,
								height   : aSize[1] || 100
							});
							break;
						case 'confirm':
							$('<div>' + sContent + '</div>').dialog({
								type     : 'confirm',
								onClose  : sEvent ? window[sEvent] : null,
								closeType: 'dismiss',
								width    : aSize[0],
								height   : aSize[1] || 100
							});
							break;
						default:
							var sCustom = $This.data('custom');
							$(sCustom).dialog({
								close    : true,
								animate  : true,
								maskClose: true,
								onClose  : sEvent ? window[sEvent] : null,
								title    : sTitle,
								width    : aSize[0],
								height   : aSize[1]
							});
					}
				})

				/* 信息提示 */
				.on('mouseenter', '[role="tooltip"]', function () {
					var $This = $(this);
					$This.attr('data-active', true);
					var $Next = $This.next('.tooltip');
					switch ($This.data('placement')) {
						case 'top':
							$Next.css({
								top : $This.offset().top - $Next.outerHeight(true),
								left: $This.offset().left + $This.outerWidth() / 2 - $Next.outerWidth() / 2
							});
							break;
						case 'bottom':
							$Next.css({
								top : $This.offset().top + $This.outerHeight(),
								left: $This.offset().left + $This.outerWidth() / 2 - $Next.outerWidth() / 2
							});
							break;
						case 'left':
							$Next.css({
								left: $This.offset().left - $Next.outerWidth(true),
								top : $This.offset().top + $This.outerHeight() / 2 - $Next.outerHeight() / 2
							});
							break;
						case 'right':
							$Next.css({
								left: $This.offset().left + $This.outerWidth(),
								top : $This.offset().top + $This.outerHeight() / 2 - $Next.outerHeight() / 2
							});
							break;
					}
				})
				.on('mouseleave', '[role="tooltip"]', function () {
					$(this).removeAttr('data-active');
				})

				/* 左侧菜单 */
				.on('touchend', '.nav-menu.nav-mini-menu [role="menu-toggle"]', function () {
					var $Menu = $(this).closest('.nav-menu[role="menu"]');
					if ($Menu.length) {
						$Menu.addClass('open-menu').selfScroll();
					}
					return false;
				})
				.on('touchstart', function (e) {
					var $Menu = $(e.target).closest('.nav-menu.open-menu[role="menu"]');
					if (!$Menu.length) {
						$('.nav-menu.open-menu[role="menu"]').removeClass('open-menu');
					}
				})
				.on('click', '.nav-menu.open-menu[role="menu"] a', function () {
					$('.nav-menu.open-menu[role="menu"]').removeClass('open-menu');
				})

				/* 日历控件 */
				.on('click', '[role="calendar"]:not([open])', function () {
					new Calendar(this);
				})
			;

			/* 左侧菜单 */
			function fResponsiveMenu() {
				var $Menu = $('.nav[role="menu"]').eq(0);
				var nMaxWidth = $Menu.data('width');
				var nClientWidth = document.documentElement.clientWidth;

				if (nClientWidth < nMaxWidth) {
					$Menu.addClass('nav-mini-menu');
				}
				else {
					$Menu.removeClass('nav-mini-menu');
				}
				$(window).off('resize.menu').on('resize.menu', fResponsiveMenu);
			}

			fResponsiveMenu();

		});

		/* jQuery 插件 */
		$.fn.selfScroll = function () {
			var $This = this;
			var nX, nY;
			$This.off('touchstart touchend touchmove')
				.on('touchstart touchend', function (ev) {
					if (ev.touches.length) {
						nX = ev.touches[0].clientX;
						nY = ev.touches[0].clientY;
					}
				})
				.on('touchmove', function (ev) {
					var oTouch = ev.touches[0];
					// 往上
					if (oTouch.clientY - nY > 0) {
						if (this.scrollTop === 0) {
							ev.preventDefault();
						}
					}
					//	往下
					else {
						if (this.scrollTop + this.offsetHeight === this.scrollHeight) {
							ev.preventDefault();
						}
					}
				});

			return $This;
		};
		$.fn.dialog = function (jConfig) {
			var $Source = this;
			if (!$Source.length) {
				throw new Error('Dialog is dismissed');
			}
			var $Dialog = $Source.data('dialog');

			if (typeof jConfig === 'string') {
				if ($Dialog && $Dialog.length) {
					// 指令
					var __call = {
						show   : function () {
							var $mask;
							var _dialog = this;
							if (_dialog.data('config').modal) {
								$mask = $('.dialog-mask');
								if (!$mask.length) {
									$mask = $('<div class="dialog-mask"></div>').appendTo('body');
								}
							}
							_dialog.css({
								position: 'fixed',
								left    : document.documentElement.clientWidth / 2 - this.outerWidth() / 2,
								top     : Math.max(0, document.documentElement.clientHeight / 2 - this.outerHeight() / 2)
							}).show();
							__fEvent.call(_dialog, $mask);
						},
						hide   : function () {
							var _dialog = this;
							if (_dialog.hasClass('dialog-animate')) {
								_dialog.addClass('dialog-close');
								setTimeout(function () {
									_dialog.removeClass('dialog-close').hide();
								}, 600);
							}
							else {
								_dialog.hide();
							}
							if (_dialog.data('config').modal) {
								$('.dialog-mask').remove();
							}
						},
						dismiss: function () {
							var _dialog = this;
							if (_dialog.hasClass('dialog-animate')) {
								_dialog.addClass('dialog-close');
								setTimeout(function () {
									_dialog.removeClass('dialog-close').remove();
								}, 600);
							}
							else {
								_dialog.remove();
							}
						}
					};
					// 事件绑定
					var __fEvent = function (oMask) {
						var _dialog = this;
						var _config = _dialog.data('config');
						_dialog.off('click close.dialog')
							.on('close.dialog', function (e, sTrigger) {
								// oMask && oMask.remove();
								$Source.dialog(_config.closeType);
								if (_config.onClose && typeof _config.onClose === 'function') {
									_config.onClose(sTrigger);
								}
							})
							.on('click', '.close', function () {
								_dialog.trigger('close.dialog', ['close']);
							})
							.on('click', 'a.btn[role="done"]', function () {
								_dialog.trigger('close.dialog', ['done']);
							})
							.on('click', 'a.btn[role="cancel"]', function () {
								_dialog.trigger('close.dialog', ['cancel']);
							})
						;
						if (_config.maskClose) {
							oMask.on('click', function () {
								_dialog.trigger('close.dialog', ['mask']);
							});
						}
						if (_config.autoClose) {
							setTimeout(function () {
								_dialog.trigger('close.dialog', ['auto']);
							}, _config.autoClose);
						}
					};

					if (typeof __call[jConfig] === 'function') {
						__call[jConfig].call($Dialog);
					}
				}
			}
			else if (typeof jConfig === 'object') {
				// 默认配置
				jConfig = $.extend({
					modal     : true,
					close     : false,
					animate   : false,
					maskClose : false,
					moveable  : false,
					autoShow  : true,
					autoClose : 0,
					closeType : 'hide',
					type      : '',
					title     : '',
					doneText  : '确定',
					cancelText: '取消',
					width     : 300,
					height    : 100
				}, jConfig);

				var bHasDialog = $Dialog && $Dialog.length;
				if (!bHasDialog) {
					var _head    = '',
					    $Content = $('<div class="dialog-content"></div>'),
					    $Foot;
					if (jConfig.title || jConfig.close) {
						_head = '<div class="dialog-head">' +
							(jConfig.close ? '<a aria-label="Close" class="close"><i aria-hidden="true">&times;</i></a>' : '') +
							(jConfig.title ? '<h3>' + jConfig.title + '</h3>' : '')
							+ '</div>';
					}

					$Content.append($Source);

					if (jConfig.type) {
						$Foot = $('<div class="dialog-foot"></div>');
						switch (jConfig.type) {
							case 'alert':
								$Foot.append('<a role="cancel" class="btn btn-primary">' + jConfig.doneText + '</a>');
								break;
							case 'confirm':
								$Foot.append('<a role="done" class="btn btn-primary">' + jConfig.doneText + '</a><a role="cancel" class="btn btn-default">' + jConfig.cancelText + '</a>');
								break;
						}
					}

					var $dialog = $('<div></div>').addClass('dialog')
						.addClass(jConfig.title ? '' : 'dialog-untitled')
						.addClass(jConfig.animate ? 'dialog-animate' : '')
						.css({
							display: 'none',
							width  : jConfig.width
						})
						.data('config', jConfig)
						.append(_head)
						.append($Content.css({
							height: Math.min(jConfig.height, document.documentElement.clientHeight * .9)
						}))
						.append($Foot)
						.appendTo('body');
					$Source.data('dialog', $dialog);
				}

				jConfig.autoShow && $Source.dialog('show');
			}

			return $Source;
		};

		/* 日历控件 */
		function Calendar(oTrigger) {
			this.id = Math.random().toString().substr(2);
			this.$el = $(oTrigger);
			this.options = this.getOption();
			// console.log(this.options);
			this.resetDate();

			var $panel = this.$parent = $(
				'<div class="date-panel card">' +
				'  <div class="pull-left">' +
				'     <a href="#" title="上一年" role-action="prevYear"><i class="sa-icon sa-icon-fw sa-icon-angle-double-left"></i></a>' +
				'     <a href="#" title="上一月" role-action="prevMonth"><i class="sa-icon sa-icon-fw sa-icon-angle-left"></i></a>' +
				'  </div>' +
				'  <div class="pull-right">' +
				'     <a href="#" title="下一月" role-action="nextMonth"><i class="sa-icon sa-icon-fw sa-icon-angle-right"></i></a>' +
				'     <a href="#" title="下一年" role-action="nextYear"><i class="sa-icon sa-icon-fw sa-icon-angle-double-right"></i></a>' +
				'  </div>' +
				'</div>');
			this.$container = $('<div class="calendar card-body"></div>');
			this.$container.appendTo($panel);

			if (!this.options.autoClose) {
				var _html = '<form class="form card-foot">' +
					(this.options.allowEdit ?
							(this.options.isRange ?
									(
										'<div class="pull-left">' +
										(this.options.showTime ?
												(
													'  <input type="datetime-local"'
													+ (this.options.showSecond ? ' step="1"' : '')
													+ (this.options.min ? ' min="' + this.options.min + '"' : '')
													+ (this.options.max ? ' max="' + this.options.max + '"' : '')
													+
													' value="' + this.startDate + 'T' + this.selectStartTime + '">' +
													'-' +
													'  <input type="datetime-local"'
													+ (this.options.showSecond ? ' step="1"' : '')
													+ (this.options.min ? ' min="' + this.options.min + '"' : '')
													+ (this.options.max ? ' max="' + this.options.max + '"' : '')
													+
													' value="' + this.endDate + 'T' + this.selectEndTime + '">'
												)
												: (
													'  <input type="date"'
													+ (this.options.min ? ' min="' + this.options.min + '"' : '')
													+ (this.options.max ? ' max="' + this.options.max + '"' : '')
													+
													' value="' + this.startDate + '">' +
													'-' +
													'  <input type="date"'
													+ (this.options.min ? ' min="' + this.options.min + '"' : '')
													+ (this.options.max ? ' max="' + this.options.max + '"' : '')
													+
													' value="' + this.endDate + '">'
												)
										) +
										'  <span class="bg-error">日期格式填写错误</span>' +
										'</div>'
									)
									: (this.options.showTime ?
											(
												'<div class="pull-left">' +
												'  <input type="time"' + (this.options.showSecond ? ' step="1"' : '') + ' value="' + this.selectStartTime + '">' +
												'</div>'
											) : ''
									)
							)
							: ''
					) +
					'  <div class="pull-right">' +
					(
						this.options.todayBtn ?
							'<button type="button" role-action="today">今天</button>'
							: ''
					) +
					'     <button type="button" class="btn btn-primary" role-action="update">确定</button>' +
					'  </div>' +
					'</form>';

				$panel.append(_html);
			}

			this.init();
		}

		Calendar.prototype = {
			start          : true,
			startDate      : '2000-01-01',
			endDate        : '2000-01-01',
			selectStartTime: '08:00:00',
			selectEndTime  : '08:00:00',
			cenMonth       : 0,
			preMonth       : 0,
			__check_version: function () {
				var _ua = navigator.userAgent.toLowerCase();
				if (_ua.indexOf('firefox') > -1) {
					return 'Firefox';
				}
				else if (_ua.indexOf('chrome') > -1) {
					return 'Chrome';
				}
				else if (_ua.indexOf('safari') > -1) {
					return 'Safari';
				}
				else {
					return 'Other';
				}
			},
			__date_string  : function (sDate, sType) {
				var _date = new Date(sDate);
				switch (sType) {
					case 'D':
						return _date.toLocaleString('nu', {
							hour12: false,
							year  : 'numeric',
							month : '2-digit',
							day   : '2-digit'
						}).replace(/\//g, '-');
					case 'T':
						return _date.toLocaleString('nu', {
							hour12: false,
							hour  : '2-digit',
							minute: '2-digit',
							second: '2-digit'
						});
				}
			},
			__format_string: function (sTime, sNormal) {
				// 将一个合法日期转换为完整的 yyyy-MM-ddThh:mm:ss 格式
				return sTime.replace(
					/^\d{4}-[01]\d-[0123]\d(T[012][0123]:[0-5]\d:[0-5]\d)?$/,
					function (sMatch, $1) {
						var _result, _date;
						_date = new Date(sMatch);
						_result = _date.getFullYear() + '-' + ('0' + (_date.getMonth() + 1)).slice(-2) + '-' + ('0' + _date.getDate()).slice(-2) + 'T';
						if ($1) {
							_result += ('0' + _date.getHours()).slice(-2) + ':' + ('0' + _date.getMinutes()).slice(-2) + ':' + ('0' + _date.getSeconds()).slice(-2);
						}
						else {
							_result += (sNormal || '00:00:00')
						}
						return _result;
					}
				);
			},
			__prefix       : function (sString) {
				if (!sString) {
					return '';
				}
				if (sString.indexOf(' ') > 0) {
					sString = sString.split(' ').join('T');
					if (sString.length < 16) {
						sString += ':00';
					}
					// 为 Safari 加上当前时区
					if (this.__check_version() === 'Safari') {
						// 时差，标准时间-本地时间 得出，单位分钟
						var nDiffHour = Math.round(new Date().getTimezoneOffset() / 60);
						if (nDiffHour > 0) {
							sString += '-' + ('0' + nDiffHour).slice(-2) + ':00';
						}
						else {
							sString += '+' + ('0' + Math.abs(nDiffHour)).slice(-2) + ':00';
						}
					}
				}
				return sString;
			},
			init           : function () {
				this.refresh();
				this.$el.data('op', this).attr('open', true).blur();
				// 如果不允许手动输入，将触发对象设为只读
				if (!this.options.allowEdit) {
					if (this.options.rangeEl && this.options.rangeEl.length) {
						if ($(this.options.rangeEl[0]).is('input')) {
							$(this.options.rangeEl[0]).prop('readonly', true);
							$(this.options.rangeEl[1]).prop('readonly', true);
						}
					}
					else {
						this.$el.prop('readonly', true);
					}
				}
				this.$parent.appendTo(document.body).css({
					left: this.$el.offset().left,
					top : this.$el.offset().top + this.$el.outerHeight()
				}).fadeOut(0).fadeIn();
				this.bindEvent();
			},
			resetDate      : function () {
				var xDate = this.options.date;
				if (xDate instanceof Array) {
					this.startDate = this.__date_string(xDate[0], 'D');
					this.endDate = this.__date_string(xDate[1], 'D');
				}
				else {
					this.startDate = this.__date_string(xDate, 'D');
				}
				if (this.options.showTime) {
					if (this.options.isRange) {
						this.selectStartTime = this.__date_string(xDate[0], 'T');
						this.selectEndTime = this.__date_string(xDate[1], 'T');
					}
					else {
						this.selectStartTime = this.selectEndTime = this.__date_string(xDate, 'T');
					}

					if (!this.options.showSecond) {
						this.selectStartTime = this.selectStartTime.split(':').slice(0, 2).join(':');
						this.selectEndTime = this.selectEndTime.split(':').slice(0, 2).join(':');
					}
				}

				// console.log('--->>>>', xDate, this.startDate, this.endDate, this.selectStartTime);

				if (this.options.isRange) {
					this.cenMonth = new Date(this.endDate).setDate(1);
				}
				else {
					this.cenMonth = new Date(this.startDate).setDate(1);
				}
			},
			getOption      : function () {
				var _option = {
					weekStart: 0,
					allowEdit: false,
					autoClose: false,
					todayBtn : false,
					date     : new Date().setHours(8, 0, 0, 0)
				};
				// 判断是单选还是范围选择
				if (this.$el.data('range')) {
					_option.isRange = true;
				}
				// 判断是否显示时间
				if (
					this.$el.is('[type="datetime-local"]')
					||
					this.$el.data('show-time')
					||
					this.$el.find('input[type="datetime-local"]').length === 2
				) {
					_option.showTime = true;
				}
				// 判断是否最小单位到秒，影响时间输入框的展示
				if (
					_option.showTime
					&&
					this.$el.prop('step') && this.$el.prop('step') < 60
					||
					this.$el.find('input[type="datetime-local"][step]').length === 2
				) {
					_option.showSecond = true;
				}
				// 判断是否有最小值限制
				var sMin = this.$el.prop('min') ? this.$el.prop('min') : this.$el.data('min');
				if (sMin) {
					_option.min = this.__format_string(sMin);
				}
				// 判断是否有最大值限制
				var sMax = this.$el.prop('max') ? this.$el.prop('max') : this.$el.data('max');
				if (sMax) {
					_option.max = this.__format_string(sMax, '23:59:59');
				}
				// 是否允许编辑
				_option.allowEdit = !!this.$el.data('editable');
				// 判断是否选择完自动关闭，仅在单选日期并且不提供手动输入时生效
				if (!_option.isRange && !_option.allowEdit && this.$el.data('auto-close')) {
					_option.autoClose = true;
				}
				// 获取默认的值
				if (_option.isRange) {
					var _input = this.$el.find('input');
					if (_input.length) {
						_option.rangeEl = $.map(_input, function (oItem) {
							$(oItem).attr('min', _option.min).attr('max', _option.max);
							return oItem;
						});
					}
					else {
						_option.rangeEl = $.map(this.$el.find('[role="range"]'), function (oItem) {
							return oItem;
						});
					}
					var _start = new Date(this.__prefix(_option.rangeEl[0].value || _option.rangeEl[0].innerText)).getTime() || new Date().getTime(),
					    _end   = new Date(this.__prefix(_option.rangeEl[1].value || _option.rangeEl[1].innerText)).getTime() || new Date().getTime();

					_option.date = [_start, _end];
				}
				else {
					_option.date = new Date(this.__prefix(this.$el.val() || this.$el.text())).getTime() || new Date().getTime();
				}
				// 获取周起始值
				if (this.$el.data('week-start')) {
					_option.weekStart = this.$el.data('week-start');
					if (_option.weekStart > 7) {
						_option.weekStart = 0;
					}
				}
				// 将配置的周起始值转换为符合程序算法的 0-6
				_option.weekStart = _option.weekStart % 7;
				// 是否显示跳转到今天按钮
				_option.todayBtn = !!this.$el.data('today');

				return _option;
			},
			bindEvent      : function () {
				var _this = this;
				// 触发对象的操作
				this.$el.off('change').on('change', function (e) {
					var _that = e.target;
					if (_this.options.isRange) {
						if (_that === _this.options.rangeEl[0]) {
							_this.options.date[0] = new Date(_this.__prefix(_that.value)).getTime();
						}
						else if (_that === _this.options.rangeEl[1]) {
							_this.options.date[1] = new Date(_this.__prefix(_that.value)).getTime();
						}
					}
					else {
						_this.options.date = new Date(_this.__prefix(_that.value)).getTime();
					}
					_this.resetDate();
					_this.refresh();
				});
				// 弹出面板的操作
				this.$parent
					.on('click', function () {
						return false;
					})
					.on('change', 'input[type*="date"]', function () {
						if ($(this).is(':first-of-type')) {
							_this.startDate = _this.__date_string(this.value, 'D');
							_this.selectStartTime = _this.__date_string(this.value, 'T');
						}
						else if ($(this).is(':last-of-type')) {
							_this.endDate = _this.__date_string(this.value, 'D');
							_this.selectEndTime = _this.__date_string(this.value, 'T');
						}
						_this.refresh();
					})
					.on('change', '[type="time"]', function () {
						_this.selectStartTime = this.value;
					})
					.on('click', '[role-action]', function () {
						var _action = $(this).attr('role-action');
						if (typeof _this[_action] === 'function') {
							_this[_action]();
						}
					})
					.on('click', 'ul>li', function () {
						var _dataDate = $(this).data('date');
						if (!_dataDate) {
							return;
						}
						var _select = _this.__date_string(_dataDate, 'D');
						if (_this.start || !_this.options.isRange) {
							_this.startDate = _this.endDate = _select;
							_this.start = false;
						}
						else {
							_this.endDate = _select;
							_this.start = true;
						}
						// 日期反转
						if (new Date(_this.endDate) < new Date(_this.startDate)) {
							var _end = _this.startDate;
							_this.startDate = _this.endDate;
							_this.endDate = _end;
						}
						if (_this.options.autoClose) {
							_this.update();
						}
						else {
							_this.refresh();
						}
					});
			},
			dismiss        : function () {
				this.$el.removeAttr('open').removeData('op');
				this.$parent.fadeOut(function () {
					$(this).remove();
				});
			},
			update         : function () {
				// 输出结果
				var _start = this.startDate,
				    _end   = this.endDate;

				if (this.options.showTime) {
					_start += 'T' + this.selectStartTime;
					_end += 'T' + this.selectEndTime;
				}

				if (this.options.isRange) {
					if ($(this.options.rangeEl[0]).is('input')) {
						this.options.rangeEl[0].value = _start;
						this.options.rangeEl[1].value = _end;
					}
					else {
						this.options.rangeEl[0].innerHTML = _start.replace('T', ' ');
						this.options.rangeEl[1].innerHTML = _end.replace('T', ' ');
					}
				}
				else {
					if (this.$el.is('input')) {
						if (this.$el.is('[type*="date"]')) {
							this.$el.val(_start);
						}
						else {
							this.$el.val(_start.replace('T', ' '));
						}
					}
					else {
						this.$el.html(_start.replace('T', ' '));
					}
				}
				this.$el[0].dispatchEvent(new CustomEvent('change', {detail: {start: _start, end: _end}}));

				// console.log('update', this.startDate, this.endDate, this.selectStartTime);
				this.dismiss();
			},
			prevYear       : function () {
				var _date = new Date(this.cenMonth);
				this.cenMonth = _date.setFullYear(_date.getFullYear() - 1);
				this.refresh();
			},
			prevMonth      : function () {
				var _date = new Date(this.cenMonth);
				this.cenMonth = _date.setMonth(_date.getMonth() - 1);
				this.refresh();
			},
			nextYear       : function () {
				var _date = new Date(this.cenMonth);
				this.cenMonth = _date.setFullYear(_date.getFullYear() + 1);
				this.refresh();
			},
			nextMonth      : function () {
				var _date = new Date(this.cenMonth);
				this.cenMonth = _date.setMonth(_date.getMonth() + 1);
				this.refresh();
			},
			today          : function () {
				this.cenMonth = new Date().setDate(1);
				this.refresh();
			},
			refresh        : function () {
				// 刷新日历列表
				var sBuild = '';
				var _range = this.options.isRange
					? [this.startDate, this.endDate]
					: [this.startDate, this.startDate];
				if (this.options.isRange) {
					this.preMonth = new Date(new Date(this.cenMonth).setDate(0)).setDate(1);
					sBuild += '\
							<dl>\
								<dt>' + new Date(this.preMonth).toLocaleString('nu', {year: 'numeric', month: 'long'}) + '</dt>\
								<dd>' + this.write(this.preMonth, _range) + '</dd>\
							</dl>';
				}
				sBuild += '\
						<dl>\
							<dt>' + new Date(this.cenMonth).toLocaleString('nu', {year: 'numeric', month: 'long'}) + '</dt>\
							<dd>' + this.write(this.cenMonth, _range) + '</dd>\
						</dl>';

				this.$container.html(sBuild);
				// 刷新输入框值
				if (!this.options.autoClose && this.options.allowEdit) {
					if (this.options.isRange) {
						var $input = this.$parent.find('form input');
						if (this.options.showTime) {
							$input.eq(0).val(this.startDate + 'T' + this.selectStartTime);
							$input.eq(1).val(this.endDate + 'T' + this.selectEndTime);
						}
						else {
							$input.eq(0).val(this.startDate);
							$input.eq(1).val(this.endDate);
						}
					}
					else {
						this.$parent.find('form input').val(this.selectStartTime);
					}
				}
			},
			write          : function (nOriginFirstDay, aRangeDate) {
				aRangeDate[0] = new Date(aRangeDate[0]).setHours(0, 0, 0, 0);
				aRangeDate[1] = new Date(aRangeDate[1]).setHours(0, 0, 0, 0);
				var nMin = new Date(this.options.min).getTime() || 0,
				    nMax = new Date(this.options.max).getTime() || 63630460800000;
				var dOriginDate = new Date(nOriginFirstDay);
				var nYear  = dOriginDate.getFullYear(),
				    nMonth = dOriginDate.getMonth();
				var aWeekNumeric = [1243814400000, 1243900800000, 1243987200000, 1244073600000, 1244160000000, 1244246400000, 1244332800000];
				var aWeekOrder = [2, 3, 4, 5, 6, 7, 1];
				aWeekOrder = [].concat(aWeekOrder.slice(-this.options.weekStart), aWeekOrder.slice(0, aWeekOrder.length - (this.options.weekStart || 7)));
				// 获取周几用来计算第一天在数组的第几个位置开始
				var nStartPosition = aWeekOrder[(dOriginDate.getDay() || 7) - 1] - 1;
				// 获取当月最后一天的数字来计算循环次数
				var nLastDay = new Date(nYear, nMonth + 1, 0).getDate();
				// 造当月日历数组
				var aMonth = [];
				var i;
				for (i = 0; i < nLastDay; i++) {
					aMonth[nStartPosition + i] = i + 1;
				}
				// 定义日历表头
				var aHead = [];
				$.each(aWeekOrder, function (nIndex, nPosition) {
					aHead[nPosition - 1] = new Date(aWeekNumeric[nIndex]).toLocaleString('nu', {weekday: 'short'});
				});
				var nLen = aHead[0].replace(/\w{2}/g, '@').length * 7 + 2;
				var sCalendar = '<ol style="width:' + nLen + 'em;"><li>' + aHead.join('</li><li>') + '</li></ol>';
				// 对数组前面的空项进行构造，并在下面 reduce 开始时补上空 DOM 结构
				sCalendar += '<ul style="width:' + nLen + 'em;">';
				for (i = 0; i < aMonth.length; i++) {
					var nItemDay = aMonth[i];
					if (!nItemDay) {
						sCalendar += '<li></li>';
					}
					else {
						var dIndexDate = new Date(nYear, nMonth, nItemDay);
						var _class = [],
						    _title = '',
						    _data  = ' data-date="' + dIndexDate.getTime() + '"';
						if (new Date().setHours(0, 0, 0, 0) === dIndexDate.getTime()) {
							_class.push('today');
						}

						if (dIndexDate.getTime() >= aRangeDate[0] && dIndexDate.getTime() <= aRangeDate[1]) {
							_class.push('selected');

							if (dIndexDate.getTime() === aRangeDate[1]) {
								_class.push('last-of');
							}
							else if (dIndexDate.getTime() === aRangeDate[0]) {
								_class.push('first-of');
							}
						}

						if (nMax
							&& new Date(nMax).setHours(0, 0, 0, 0) < dIndexDate.getTime()
							|| nMin
							&& new Date(nMin).setHours(0, 0, 0, 0) > dIndexDate.getTime()
						) {
							_class.push('disabled');
							_data = '';
						}

						_class = _class.length ? ' class="' + _class.join(' ') + '"' : '';
						_title = dIndexDate.toLocaleString('nu', {
							year : 'numeric',
							month: 'long',
							day  : 'numeric'
						});

						sCalendar += '<li title="' + _title + '"' + _data + _class + '>' + nItemDay + '</li>';
					}
				}
				sCalendar += '</ul>';

				return sCalendar;
			}
		};
	}
});
