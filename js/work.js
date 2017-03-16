
// Variables de entorno
var currentDisplayed = 0;
var currentImages = 0;
var currentInformation = null; var timerWork = null;
var currentDimensions = {"width": 0, "height": 0};
var currentWindow = {"width": 0, "height": 0};

// Ejecutar animacion para cambiar a imagen
var changePhoto = function changePhoto(e)
{
	// Frenar timer
	animateWorkStop();
	stopPropagation(e);

	// Conseguir posicion
	var p = $(e.currentTarget).data('position');

	// No hacer nada si ya esta visible
	if (p === currentDisplayed) return;

	// Ejecutar animacion
	animateWork(p);
};

// Ejecutar animacion de las imagenes
var animateWork = function animateWork(position)
{
  	// Frenar timer antes de tiempo
  	if (currentInformation === null) return;

  	// Escoger container
	var ch = $('#workContainerPhoto').children();

	// Buscar posicion mostrada / escondida
	var positions = currentImages - 1;
	var positionBack = currentDisplayed;
	var positionIn;
	if (typeof position !== 'undefined') positionIn = position;
	else positionIn = (positionBack < positions) ? positionBack + 1 : 0;

	// Cambiar bubbles
	var prevBubble = $('[data-position="' + currentDisplayed + '"]');
	prevBubble.removeClass('containerBubbleSelected');
	prevBubble.empty();
	var nextBubble = $('[data-position="' + positionIn + '"]');
	nextBubble.addClass('containerBubbleSelected');
	nextBubble.html('<div class="containerBubbleFill"></div>');

	// Guardar posiciones
	currentDisplayed = positionIn;
	
	// Calcular dimensiones
	if (window.innerWidth > 1023) resizeContainerDesktop();
	else resizeContainerMobile();

	// Animar posiciones
	$(ch[positionBack]).hide();
	$(ch[positionIn]).fadeIn();

	// Comenzar timer
  	timerWork = setTimeout(animateWork, 10000);
};

// Crear timer para animateWork
var animateWorkStart = function animateWorkStart()
{
	timerWork = setTimeout(animateWork, 10000);
};

// Destruir timer para animateWork
var animateWorkStop = function animateWorkStop()
{
	if (timerWork !== null)
	{
		clearTimeout(timerWork);
  		timerWork = null;	
	}
}

// Destruir informacion del trabajo
var destroyInformation = function destroyInformation(e)
{
	// Comenzar timer
	if (currentImages > 1) animateWorkStart();
	stopPropagation(e);

	// Cambiar icono del boton
	var button = $(e.currentTarget);
	var buttonI = $(button.children()[0]);
	buttonI.removeClass('fa-eye-slash');
	buttonI.addClass('fa-eye');

	// Asignar handlers
	var bubbles = $('.containerBubble');
	bubbles.removeClass('buttonDisabled');
	bubbles.click(changePhoto);
	button.off('click', destroyInformation);
	button.click(showInformation);

	// Destruir panel
	$('#workContainerInfo').remove();

	// Mostrar fotos
	$('#workContainerPhoto').show();

	// Calcular dimensiones
	if (window.innerWidth > 1023) resizeContainerDesktop();
	else resizeContainerMobile();

};

// Mostrar informacion del trabajo
var showInformation = function showInformation(e)
{
	// Frenar timer
	if (currentImages > 1) animateWorkStop();
	stopPropagation(e);

	// Cambiar icono del boton
	var button = $(e.currentTarget);
	var buttonI = $(button.children()[0]);
	buttonI.removeClass('fa-eye');
	buttonI.addClass('fa-eye-slash');

	// Asignar handlers
	var bubbles = $('.containerBubble');
	bubbles.off('click', changePhoto);
	bubbles.addClass('buttonDisabled');
	button.off('click', showInformation);
	button.click(destroyInformation);

	// Esconder fotos
	$('#workContainerPhoto').hide();

	// Crear panel de informacion
	$('#workContainer').append('<div id="workContainerInfo"><h3>' + currentInformation['title'] + 
		'</h3><div id="workContainerText">' + currentInformation['text'] + '</div></div>');

	// Regenerar dimensiones
	resizeInformation();

};

// Atribuir dimensiones a la informacion
var resizeInformation = function resizeInformation()
{
	if (window.innerWidth > 1023)
	{
		$('#workContainerInfo').css('width', (window.innerWidth - 84)/3).css('height', parseInt(window.innerHeight/2));
		var heightText = parseInt(window.innerHeight/2) - ($('#workContainerInfo h3').height() + 40);
		$('#workContainerText').css('height', heightText);	
	}
};

// Regenerar dimensiones del contenedor - Mobile
var resizeContainerMobile = function resizeContainerMobile()
{

	// Detectar que se ha pasado a Desktop
	if (window.innerWidth > 1023)
	{
		var workPanel = $('#workContainerPanel');
		workPanel.removeClass('workContainerPanelMobile');
		workPanel.empty();
		thumbnailClick();
		return;
	}

	// Ajustar container a fullscreen
	var container = $('#workContainer');
	var widthContainer = window.innerWidth - 80;
	if (container.width() !== widthContainer) container.css('width', widthContainer);

	var change = (currentWindow.width !== window.innerWidth || currentWindow.height !== window.innerHeight);

	if (change)
	{

		// Guardar dimensiones actuales
		currentWindow.width = window.innerWidth;
		currentWindow.height = window.innerHeight;

		var heightContainer = 0;
		var containerPhotos = container.children();
		for (var i = 0; i < containerPhotos.length; i++)
		{
			var ar = currentInformation.photos[i].height / 
				currentInformation.photos[i].width;
			if (i !== 0) heightContainer += 60;
			var heightPhoto = parseInt(ar * widthContainer);
			$(containerPhotos[i]).css('width', widthContainer).css('height', heightPhoto);
			heightContainer += heightPhoto;
		}
		container.css('height', heightContainer);
	}
};

// Regenerar dimensiones del contenedor - Desktop
var resizeContainerDesktop = function resizeContainerDesktop()
{

	// Detectar que se ha pasado a Desktop
	if (window.innerWidth < 1024)
	{
		var workPanel = $('#workContainerPanel');
		workPanel.empty();
		thumbnailClick();
		return;
	}

	// Ajustar container a fullscreen
	var container = $('#workContainer');
	if (container.width() !== window.innerWidth - 80)
		container.css('width', window.innerWidth - 80);
	if (container.height() !== window.innerHeight)
		container.css('height', window.innerHeight);

	var panelButtons = $('#workContainerButtons');
	if (panelButtons.height() !== window.innerHeight)
		panelButtons.css('height', window.innerHeight);

	var panelSelections = $('#workContainerSelections');
	if (panelSelections.height() !== window.innerHeight)
		panelSelections.css('height', window.innerHeight - 84);

	var containerBubbles = $('#workContainerBubbles');
	var prevHeight = containerBubbles.height();
	if (prevHeight >= window.innerHeight - 84) containerBubbles.css('margin-top', 0);
	else containerBubbles.css('margin-top', ((window.innerHeight - 84) - (prevHeight + 80))/2);

	var ar = currentInformation.photos[currentDisplayed].width / 
		currentInformation.photos[currentDisplayed].height;

	var change = (currentInformation.photos[currentDisplayed].width !== currentDimensions.width ||
		currentInformation.photos[currentDisplayed].height !== currentDimensions.height ||
		currentWindow.width !== window.innerWidth || currentWindow.height !== window.innerHeight);
	
	if (change)
	{

		// Guardar nuevas dimensiones
		currentDimensions.width = currentInformation.photos[currentDisplayed].width;
		currentDimensions.height = currentInformation.photos[currentDisplayed].height;

		// Altura sin boton de cerrar
		var heightDiv = window.innerHeight - 160;
		var widthDiv = 0;
			
		// Foto es más alta que ancha
		if (ar < 1) widthDiv = parseInt(ar * heightDiv);
		else
		{
			if (parseInt(ar * heightDiv) > (window.innerWidth - 80))
			{
				widthDiv = window.innerWidth - 180;
				heightDiv = parseInt(widthDiv / ar);
			}
			else widthDiv = parseInt(ar * heightDiv);
		}

		// El container es más ancho o alto que la foto y se distorsiona
		if (widthDiv > currentDimensions.width || heightDiv > currentDimensions.height)
		{
			widthDiv = currentDimensions.width;
			heightDiv = currentDimensions.height;
		}

		$('#workContainerPhoto').css('width', widthDiv).css('height', heightDiv);
		
	}

	// Reasignar dimensiones a informacion
	if ($('#workContainerInfo').length > 0) resizeInformation();
};

// Esconder trabajo al hacer click sobre X
var destroyContainer = function destroyContainer(e)
{
	stopPropagation(e);
	$(window).off("resize", resizeContainerDesktop);
	$(window).off("resize", resizeContainerMobile);
	animateWorkStop();
	animateThumbnailsStart();

	// Reiniciar valores
	currentDisplayed = 0;
	currentInformation = null;
	currentDimensions = {"width": 0, "height": 0};
	currentWindow = {"width": 0, "height": 0};

	// Habilitar el Scroll
	var body = $('body');
	var currentScroll = Math.abs(
		parseInt(body.css('top').replace('px', ''))
	);
	body.removeClass('disabledScroll');
	body.css('top', 'auto');
	$(window).scrollTop(currentScroll);

	// Borrar background
	$('.fullscreen').remove();
};

// Mostrar trabajo al hacer click sobre thumbnail
var thumbnailClick = function thumbnailClick(e)
{
	var workPanel;
	if (typeof e !== 'undefined')
	{
		stopPropagation(e);
		animateThumbnailsStop();

		// Deshabilitar el Scroll
		var currentScroll = $(window).scrollTop();
		var body = $('body');
		body.addClass('disabledScroll');
		body.css('top', '-' + currentScroll + 'px');
		
		// Anadir background fullscreen
		var fullContainer = $('<div>', {'class': 'fullscreen'});
		var workContainer = $('<div>', {'id': 'workContainerBig'});
		fullContainer.append(workContainer);
		body.append(fullContainer);

		// Anadir capas al background
		var workDisabled = $('<div>', {'id': 'workContainerDisabled'});
		workContainer.append(workDisabled);
		workPanel = $('<div>', {'id': 'workContainerPanel'});
		workContainer.append(workPanel);

	}
	else workPanel = $('#workContainerPanel');
	
	// Generar información del trabajo
	if (currentInformation === null)
	{
		var target = $(e.currentTarget);
		var targetImg = 'img/' + target.data('category') + '/' + 
			target.data('folder') + '/' + target.data('folder') + '_';
		currentInformation = info_works[target.data('folder')];
		var targetImages = [];
		for (var i = 1; i <= currentInformation.photos.length; i++)
			targetImages.push(targetImg + i + '.jpg');
		currentImages = targetImages;	
	}

	if (window.innerWidth > 1023)
	{
		// Generar container según la primera imagen
		var container = $('<div>', {'id': 'workContainer'});
		var containerHTML = '<div id="workContainerPhoto">';
		for (var i = 0; i < currentImages.length; i++)
		{
			if (i === 0) containerHTML += '<img '; else containerHTML += '<img class="hid" ';
			containerHTML += 'src="' + currentImages[i] + '" alt="Miniatura ' + (i + 1) + ' de ' + 
				currentInformation['title'] + '"/>';
		}
		containerHTML += '</div>';
		container.html(containerHTML);
		workPanel.append(container);

		// Generar panel de botones
		var panelButtons = $('<div>', {'id': 'workContainerButtons'});
		var workButton = $('<div>', {'id': 'workContainerCloseButton', 'class': 'workContainerButton'});
		workButton.html('<i class="fa fa-times" aria-hidden="true"></i>');
		workButton.click(destroyContainer);
		panelButtons.append(workButton);
		var workInfoButton = $('<div>', {'id': 'workContainerInfoButton', 'class': 'workContainerButton'});
		workInfoButton.html('<i class="fa fa-eye" aria-hidden="true"></i>');
		workInfoButton.click(showInformation);
		panelButtons.append(workInfoButton);

		// Generar panel de bubbles
		if (currentImages.length > 1)
		{
			var panelSelections = $('<div>', {'id': 'workContainerSelections'});
			var panelBubbles = $('<div>', {'id': 'workContainerBubbles'});
			var heightPanel = 0;
			for (var i = 0; i < currentImages.length; i++)
			{
				var classBubble = (i === 0) ? 'containerBubble containerBubbleSelected' : 'containerBubble';
				var bubble = $('<div>', {'class': classBubble, 'data-position': i});
				if (i === 0) bubble.append('<div class="containerBubbleFill"></div>');
				else heightPanel += 15;
				bubble.click(changePhoto);
				panelBubbles.append(bubble);
				heightPanel += 30;
			}
			panelBubbles.css('height', heightPanel);
			panelSelections.append(panelBubbles);
		}
		panelButtons.append(panelSelections);
		workPanel.append(panelButtons);
	}
	else
	{
		// Activar apariencia de movil
		workPanel.addClass('workContainerPanelMobile');
		
		// Crear panel de informacion
		workPanel.append('<div id="workContainerInfo"><h3>' + currentInformation['title'] + 
		'</h3><div id="workContainerText">' + currentInformation['text'] + '</div></div>');

		// Crear imagenes
		var container = $('<div>', {'id': 'workContainer'});
		var containerHTML = '';
		for (var i = 0; i < currentImages.length; i++)
		{
			if (i === 0 || window.innerWidth < 1024) containerHTML += '<img '; else containerHTML += '<img class="hid" ';
			containerHTML += 'src="' + currentImages[i] + '" alt="Miniatura ' + (i + 1) + ' de ' + 
				currentInformation['title'] + '"/>';
		}
		container.html(containerHTML);
		workPanel.append(container);
		var buttonMobile = $('<div>', {'id': 'workContainerCloseMobile'});
		buttonMobile.html('<p>CERRAR PANEL</p>');
		buttonMobile.click(destroyContainer);
		workPanel.append(buttonMobile);

	}

	// Detectar evento de resize en el navegador
	if (window.innerWidth > 1023)
	{
		// Guardar dimensiones actuales
		currentWindow.width = window.innerWidth;
		currentWindow.height = window.innerHeight;

		resizeContainerDesktop();
		$(window).off('resize', resizeContainerMobile);
		$(window).resize(resizeContainerDesktop);	
		if (currentImages > 1) animateWorkStart();
	}
	else
	{
		resizeContainerMobile();
		$(window).off('resize', resizeContainerDesktop);
		$(window).resize(resizeContainerMobile);
	}
};
