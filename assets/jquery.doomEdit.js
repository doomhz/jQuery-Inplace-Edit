/**
* Doom EditInPlace jQuery Plugin
*
* @author Dumitru Glavan
* @link http://dumitruglavan.com
* @version 1.0
* @requires jQuery v1.3.2 or later
*
* @example $('.dedit-simple').doomEdit({ajaxSubmit:false, afterFormSubmit: function (data, form, el) {el.text(data);}}); - Simple inline edit
* @example $('.dedit-textarea').doomEdit({ajaxSubmit:false, editField: '<textarea name="myEditTextarea" rows="10" cols="70"></textarea>', afterFormSubmit: function (data, form, el) {el.text(data);}}); - Inline edit with textarea
* @example $('.dedit-remote').doomEdit({editForm:{method:'post', action:'remote.html', id:'myeditformid'}, afterFormSubmit: function (data, form, el) {el.text($('input', form).val());alert(data);}}); - Inline edit and remote save with ajax
* @example $('.dedit-remote-json').doomEdit({editForm:{method:'post', action:'remote_json.html', id:'myeditformid'}, afterFormSubmit: function (data, form, el) {data = $.parseJSON(data);el.text(data.message);alert(data.message);}}); - Inline edit and remote save with ajax with JSON response
*
* Examples and documentation at: http://dumitruglavan.com/jquery-doom-inplace-edit-plugin/
* Find source on GitHub: https://github.com/doomhz/jQuery-Inplace-Edit
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/
(function ($) {
	$.fn.doomEdit = function (options) {
		this.config = {
						editForm: {
							method:'post',
							action:'/',
							id:'doomEditForm'
						},
						ajaxSubmit: true,
						editField: '<input name="doomEditElement" type="text" />',
						submitBtn: '<button type="submit" class="save-btn">Save</button>',
						cancelBtn: '<button type="button" class="cancel-btn">Cancel</button>',
						afterFormSubmit: function (data, form, el) {
							$('button', form).removeAttr('disabled').fadeTo(0, 1);
						},
						beforeFormSubmit: function (data, form, el) {
							$('button', form).attr('disabled', 'disabled').fadeTo(0, 0.2);
						},
						onCancel: null,
						onStartEdit: null
					 };
		$.extend(this.config, options);

		var $self = $(this);
		var self = this;

		$self.click(function () {

			self.initialValue = $self.text();
			var editForm = $('<form></form>').attr(self.config.editForm);
			var editElement = $(self.config.editField).val(self.initialValue).text(self.initialValue).addClass('text');

			editForm.append(editElement);
			var submitButton = $(self.config.submitBtn).attr({disabled:'disabled'}).addClass('button');
			var cancelButton = $(self.config.cancelBtn).addClass('button inactive');
			cancelButton.click(function () {
				editForm.remove();
				$self.show();
				$.isFunction(self.config.onCancel) && self.config.onCancel(editForm, $self);
			});
			editElement.keyup(function () {
				var value = editElement.val() || editElement.text();
				if (value === '' || value === self.initialVal) {
					submitButton.attr('disabled', 'disabled');
				} else {
					submitButton.attr('disabled', '');
				}
			});
			editForm.append(submitButton);
			editForm.append(cancelButton);
			editForm.submit(function () {
				if (self.config.ajaxSubmit) {
					$.ajax({
						url: editForm.attr('action'),
						type: editForm.attr('method'),
						data: editForm.serialize(),
						beforeSend: function(data){
							$.isFunction(self.config.beforeFormSubmit) && self.config.beforeFormSubmit(data, editForm, $self);
						},
						success: function(data){
							$.isFunction(self.config.afterFormSubmit) && self.config.afterFormSubmit(data, editForm, $self);
							editForm.remove();
							$(self).show();
						}
					});
				} else {
					var newVal = editElement.val() || editElement.text();
					$.isFunction(self.config.afterFormSubmit) && self.config.afterFormSubmit(newVal, editForm, $self);
					editForm.remove();
					$(self).show();
				}
				return false;
			});

			$self.hide().after(editForm);
			editElement.focus();

			$.isFunction(self.config.onStartEdit) && self.config.onStartEdit(editForm, $self);
		});

		return this;
	}
})(jQuery);
