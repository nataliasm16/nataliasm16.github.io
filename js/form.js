
// Frenar propagación del evento
var stopPropagation = function stopPropagation(e)
{
    if (typeof e.stopPropagation == "function") e.stopPropagation();
    else e.cancelBubble = true;
};

// Generar border para input
var animateInFocus = function animateInFocus(e)
{
	stopPropagation(e);
	$('#input-group-' + e.currentTarget.name).addClass('focused');
};

// Destruir border para input
var animateOutFocus = function animateOutFocus(e)
{
	stopPropagation(e);
	$('#input-group-' + e.currentTarget.name).removeClass('focused');
};

// Generar reglas para los focus de contacto
var asignFormFocus = function asignFormFocus()
{
	$('input').focusin(animateInFocus);
	$('input').focusout(animateOutFocus);
	$('textarea').focusin(animateInFocus);
	$('textarea').focusout(animateOutFocus);
};

// Generar reglas para los input de contacto
var asignFormRules = function asignFormRules()
{
	$("#contact-form").validate({
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            message: "required",
        },
        messages: {
            name: "* Por favor, introduce un nombre",
            email: "* Por favor, introduce un e-mail válido",
            message: "* Por favor, introduce un mensaje",
        },
        errorPlacement: function(error, element) {
        	var idInput = (element.attr('name') === 'name') ? 'email' : 'message';
        	if (element.attr('name') === 'message')
        		$('#input-group-' + idInput).after(error);
        	else $('#input-group-' + idInput).before(error);
  		},
        submitHandler: function(form) {
          //form.submit();
           $("#contact-confirmed").show();
           $("#contact-confirmed").fadeOut(4500);
        }
    });
};