/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description Sa UI.js
 * @Since 16/7/24
 */

if (typeof $ === 'undefined' && typeof jQuery === 'undefined') {
	throw 'SaUI need jQuery';
}
else {
	$(function () {
		console.info('\
		┏━━━┓    ┏┓ ┏┓┏━━┓\n\
		┃┏━┓┃    ┃┃ ┃┃┗┫┣┛\n\
		┃┗━━┓┏━━┓┃┃ ┃┃ ┃┃\n\
		┗━━┓┃┃┏┓┃┃┃ ┃┃ ┃┃\n\
		┃┗━┛┃┃┏┓┃┃┗━┛┃┏┫┣┓\n\
		┗━━━┛┗┛┗┛┗━━━┛┗━━┛');

		$('body')

		/* 下拉菜单 */
			.on('click touchend', '.dropdown:not(.dropdown-open)', function () {
				$('.dropdown[open]').removeClass('dropdown-open');
				$(this).attr('open', true).addClass('dropdown-open');
				return false;
			})
			.on('click touchend', '.dropdown.dropdown-open', function () {
				$(this).removeClass('dropdown-open');
			})
			.on('click touchend', function () {
				$('.dropdown[open]').removeClass('dropdown-open').removeAttr('open');
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
							type: 'alert',
							onClose: sEvent ? window[sEvent] : null,
							closeType: 'dismiss',
							width: aSize[0] || 300,
							height: aSize[1] || 100
						});
						break;
					case 'confirm':
						$('<div>' + sContent + '</div>').dialog({
							type: 'confirm',
							onClose: sEvent ? window[sEvent] : null,
							closeType: 'dismiss',
							width: aSize[0],
							height: aSize[1] || 100
						});
						break;
					default:
						var sCustom = $This.data('custom');
						$(sCustom).dialog({
							close: true,
							animate: true,
							maskClose: true,
							onClose: sEvent ? window[sEvent] : null,
							title: sTitle,
							width: aSize[0],
							height: aSize[1]
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
							top: $This.offset().top - $Next.outerHeight(true),
							left: $This.offset().left + $This.outerWidth() / 2 - $Next.outerWidth() / 2
						});
						break;
					case 'bottom':
						$Next.css({
							top: $This.offset().top + $This.outerHeight(),
							left: $This.offset().left + $This.outerWidth() / 2 - $Next.outerWidth() / 2
						});
						break;
					case 'left':
						$Next.css({
							left: $This.offset().left - $Next.outerWidth(true),
							top: $This.offset().top + $This.outerHeight() / 2 - $Next.outerHeight() / 2
						});
						break;
					case 'right':
						$Next.css({
							left: $This.offset().left + $This.outerWidth(),
							top: $This.offset().top + $This.outerHeight() / 2 - $Next.outerHeight() / 2
						});
						break;
				}
			})
			.on('mouseleave', '[role="tooltip"]', function () {
				$(this).removeAttr('data-active');
			})

			/* 左侧菜单 */
			.on('click touchend', '.nav-menu.nav-mini-menu [role="menu-toggle"]', function () {
				var $Menu = $(this).closest('.nav-menu[role="menu"]');
				if ($Menu.length) {
					$Menu.addClass('open-menu').selfScroll();
				}
				return false;
			})
			.on('click touchend', function (e) {
				var $Menu = $(e.target).closest('.nav-menu.open-menu[role="menu"]');
				if (!$Menu.length) {
					$('.nav-menu.open-menu[role="menu"]').removeClass('open-menu');
				}
			})
			.on('click', '.nav-menu.open-menu[role="menu"] a', function () {
				$('.nav-menu.open-menu[role="menu"]').removeClass('open-menu');
			});

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
	(function ($) {
		$.fn.selfScroll = function () {
			// console.log(this)
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
						show: function () {
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
								left: document.documentElement.clientWidth / 2 - this.outerWidth() / 2,
								top: Math.max(0, document.documentElement.clientHeight / 2 - this.outerHeight() / 2)
							}).show();
							__fEvent.call(_dialog, $mask);
						},
						hide: function () {
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
								oMask && oMask.remove();
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
				jConfig = jQuery.extend({
					modal: true,
					close: false,
					animate: false,
					maskClose: false,
					moveable: false,
					autoShow: true,
					autoClose: 0,
					closeType: 'hide',
					type: '',
					title: '',
					width: 300,
					height: 100
				}, jConfig);

				var bHasDialog = $Dialog && $Dialog.length;
				if (!bHasDialog) {
					var _head = '',
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
								$Foot.append('<a role="cancel" class="btn btn-primary">确定</a>');
								break;
							case 'confirm':
								$Foot.append('<a role="done" class="btn btn-primary">确定</a><a role="cancel" class="btn btn-default">取消</a>');
								break;
						}
					}

					var $dialog = $('<div></div>').addClass('dialog')
						.addClass(jConfig.title ? '' : 'dialog-untitled')
						.addClass(jConfig.animate ? 'dialog-animate' : '')
						.css({
							display: 'none',
							width: jConfig.width
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
	})(jQuery);
}