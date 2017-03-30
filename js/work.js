
// Variables de entorno
var currentDisplayed = 0,
	currentImages = 0,
	currentInformation = null,
	currentDimensions = {"width": 0, "height": 0},
	currentWindow = {"width": 0},
	currentHeightBackMobile = 0;

// Mostrar siguiente foto
var showNextPicture = function showNextPicture(e)
{
	stopPropagation(e);

	// Buscar posicion a mostrar
	var positions = currentImages.length - 1;
	var positionBack = currentDisplayed;
	var positionIn = (positionBack < positions) ? positionBack + 1 : 0;
	currentDisplayed = positionIn;

	// Cambiar imagen
	var containerPicture = $('#fnWorkPanelValuesPhotoDetail img');
	containerPicture.attr('src', currentImages[currentDisplayed]);

	// Redimensionar foto
	resizeContainerDetail();
};

// Mostrar anterior foto
var showPreviousPicture = function showPreviousPicture(e)
{
	stopPropagation(e);

	// Buscar posicion a mostrar
	var positions = currentImages.length - 1;
	var positionBack = currentDisplayed;
	var positionIn = (positionBack > 0) ? positionBack - 1 : positions;
	currentDisplayed = positionIn;

	// Cambiar imagen
	var containerPicture = $('#fnWorkPanelValuesPhotoDetail img');
	containerPicture.attr('src', currentImages[currentDisplayed]);

	// Redimensionar foto
	resizeContainerDetail();
};

// Destruir panel de fotos del trabajo
var destroyPictures = function destroyPictures(e)
{
	stopPropagation(e);

	// Borrar galeria
	$('#fnWorkContainerDetail').remove();

	// Mostrar trabajo
	$('#fnWorkContainer').show();
};

// Mostrar fotos del trabajo en cuestion
var showPictures = function showPictures(e)
{
	stopPropagation(e);

	// Esconder Trabajo
	$('#fnWorkContainer').hide();

	// Mostrar imagenes
	var fnContainer = $('<div>', {'id': 'fnWorkContainerDetail', 'class': 'fullscreen'});
	var wkContainer = $('<div>', {'class': 'fullscreenPanel'});
	fnContainer.append(wkContainer);
	$('body').append(fnContainer);

	// Anadir capas al background
	var workDisabled = $('<div>', {'class': 'fullscreenPanelDisabled'});
	wkContainer.append(workDisabled);
	workPanel = $('<div>', {'id': 'fnWorkPanelValuesDetail', 'class': 'fullscreenPanelValues'});
	wkContainer.append(workPanel);

	// Generar container según la primera imagen
	var container = $('<div>', {'id': 'fnWorkPanelValuesContainerDetail'});
	var containerArrowLeft = $('<div>', {'class': 'fnWorkPanelValuesArrow'});
	var containerArrowLeftHand = $('<i>', {'class': 'fa fa-chevron-left'});
	containerArrowLeftHand.click(showPreviousPicture);
	containerArrowLeft.append(containerArrowLeftHand);
	container.append(containerArrowLeft);

	var containerPhoto = $('<div>', {'id': 'fnWorkPanelValuesPhotoDetail'});
	containerPhoto.html('<img src="' + currentImages[0] + '" alt="Miniatura de ' + 
		currentInformation['title'] + '"/>');
	container.append(containerPhoto);

	var containerArrowRight = $('<div>', {'class': 'fnWorkPanelValuesArrow'});
	var containerArrowRightHand = $('<i>', {'class': 'fa fa-chevron-right'});
	containerArrowRightHand.click(showNextPicture);
	containerArrowRight.append(containerArrowRightHand);
	container.append(containerArrowRight);
	workPanel.append(container);

	// Generar boton de cerrar
	var buttonClose = $('<div>', {'id': 'fnWorkPanelValuesClose'});
	buttonClose.html('<i class="fa fa-close" aria-hidden="true"</i>');
	buttonClose.click(destroyPictures);
	containerArrowRight.append(buttonClose);

	// Detectar evento de resize en el navegador
	resizeContainerDetail();
};

// Regenerar dimensiones del contenedor - Mobile
var resizeContainerMobile = function resizeContainerMobile()
{

	// Detectar que se ha pasado a Desktop
	if (window.innerWidth > 1023)
	{
		var workPanel = $('#fnWorkPanelValues');
		workPanel.removeClass('fullscreenPanelValuesMobile');
		workPanel.empty();
		thumbnailClick();
		return;
	}

	// Ajustar container a fullscreen
	var container = $('#fnWorkPanelValuesContainer');
	var widthContainer = window.innerWidth - 80;
	if (container.width() !== widthContainer) container.css('width', widthContainer);

	if (currentWindow.width === widthContainer) return;

	// Guardar valores
	if (currentWindow.width !== widthContainer)
		currentWindow.width = widthContainer;

	var heightContainer = 0, containerPhotos = container.children();
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
	var heightInfoText = $('#fnWorkPanelValuesInfo').height();
	$('#fnWorkPanelValues').css('min-height',
		heightContainer + currentHeightBackMobile + heightInfoText
	);

};

// Regenerar alto segun ancho de la foto
var resizePhotoDetailHeight = function resizePhotoDetailWidth(width)
{
	if (width > currentInformation.photos[currentDisplayed].width)
	{
		return (currentInformation.photos[currentDisplayed].width / width) * 
			currentInformation.photos[currentDisplayed].height;
	}
	else
	{
		return (width / currentInformation.photos[currentDisplayed].width) * 
			currentInformation.photos[currentDisplayed].height;	
	}
}

// Regenerar ancho segun alto de la foto
var resizePhotoDetailWidth = function resizePhotoDetailWidth(height)
{
	if (height > currentInformation.photos[currentDisplayed].height)
	{
		return (currentInformation.photos[currentDisplayed].height / height) * 
			currentInformation.photos[currentDisplayed].width;
	}
	else
	{
		return (height / currentInformation.photos[currentDisplayed].height) * 
			currentInformation.photos[currentDisplayed].width;	
	}
}

// Regenerar dimensiones del contenedor - Desktop Detail
var resizeContainerDetail = function resizeContainerDetail()
{

	// Detectar que el detalle esta mostrado
	var workPanelDetail = $('#fnWorkContainerDetail');
	if (workPanelDetail.length === 0) return;

	// Detectar que se ha pasado a Desktop
	if (window.innerWidth < 1024)
	{
		var workPanelDetail = $('#fnWorkContainerDetail');
		if (workPanelDetail.length > 0)
		{
			workPanelDetail.remove();
			$('#fnWorkContainer').show();
		}
		return;
	}

	// Asignar variables
	var heightDiv = 0, widthDiv = 0;
	var widthMaxContainer = (window.innerWidth < 2080) ? window.innerWidth : 2080;

	// Coger dimensiones de la foto mostrada
	if (currentInformation.photos[currentDisplayed].width > 
		currentInformation.photos[currentDisplayed].height)
	{
		widthDiv = widthMaxContainer - 160;
		heightDiv = resizePhotoDetailHeight(widthDiv);

		// Comprobar que no se pasa de altura
		if (heightDiv > window.innerHeight - (window.innerHeight * 0.10))
		{
			heightDiv = window.innerHeight - (window.innerHeight * 0.10);
			widthDiv = resizePhotoDetailWidth(heightDiv); 
		}
	}
	else
	{
		heightDiv = window.innerHeight - (window.innerHeight * 0.10);
		widthDiv = resizePhotoDetailWidth(heightDiv);

		// Comprobar que no se pasa de anchura
		if (widthDiv > widthMaxContainer - 160)
		{
			widthDiv = widthMaxContainer - 160;
			heightDiv = resizePhotoDetailHeight(widthDiv);
		}
	}

	// Asignar dimensiones a la foto
	var containerPhoto = $('#fnWorkPanelValuesPhotoDetail');
	containerPhoto.css('width', widthDiv).css('height', heightDiv);

};

// Regenerar dimensiones del contenedor - Desktop
var resizeContainerDesktop = function resizeContainerDesktop()
{

	// Detectar que se ha pasado a Desktop
	if (window.innerWidth < 1024)
	{
		var workPanelDetail = $('#fnWorkContainerDetail');
		if (workPanelDetail.length > 0)
		{
			workPanelDetail.remove();
			$('#fnWorkContainer').show();
		}
		var workPanel = $('#fnWorkPanelValues');
		workPanel.empty();
		thumbnailClick();
		return;
	}

	if (currentWindow.width === window.innerWidth) return;

	// Guardar valores
	if (currentWindow.width !== window.innerWidth)
		currentWindow.width = window.innerWidth;

	// Coger dimensiones de la primera foto
	var ar = currentInformation.photos[0].width / 
	currentInformation.photos[0].height;

	// Asignar variables
	var heightDiv = 0, widthDiv = 0;
	var widthMaxContainer = (window.innerWidth < 1200) ? window.innerWidth : 1200;

	// Calcular informacion de la foto
	var widthPanelInfo = parseInt((widthMaxContainer - 80) * 0.35);
	var maxHeightPanel = parseInt(window.innerHeight - 180);
	widthDiv = widthMaxContainer - (widthPanelInfo + 80);

	// Calcular altura de los elementos
	heightDiv = widthDiv / ar;

	// Calcular que no se pase del limite de alto
	if (heightDiv > maxHeightPanel)
	{
		heightDiv = maxHeightPanel;
		widthDiv = heightDiv * ar;
	}

	// Asignar dimensiones a los paneles
	var containerTextInfo = $('#fnWorkPanelValuesInfo');
	var containerPhoto = $('#fnWorkPanelValuesPhoto');
	containerTextInfo.css('width', widthPanelInfo);
	containerTextInfo.css('max-height', maxHeightPanel);
	containerTextInfo.css('height', heightDiv);
	$('#fnWorkPanelValuesInfoText').css('height', heightDiv - ($('#fnWorkPanelValuesInfo h3').height() + 77));
	containerPhoto.css('width', widthDiv).css('height', heightDiv);
	$('#fnWorkPanelValues').css('min-height', 800);

	// Ajustar container a fullscreen
	var container = $('#fnWorkPanelValuesContainer');
	if (container.width() !== widthMaxContainer)
		container.css('width', widthMaxContainer);
	if (container.height() !== heightDiv)
		container.css('height', heightDiv);

};

// Esconder trabajo al hacer click sobre X
var destroyContainer = function destroyContainer(e)
{
	stopPropagation(e);
	$(window).off("resize", resizeContainerDesktop);
	$(window).off("resize", resizeContainerDetail);
	$(window).off("resize", resizeContainerMobile);
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
		var fnContainer = $('<div>', {'id': 'fnWorkContainer', 'class': 'fullscreen'});
		var wkContainer = $('<div>', {'class': 'fullscreenPanel'});
		fnContainer.append(wkContainer);
		body.append(fnContainer);

		// Anadir capas al background
		var workDisabled = $('<div>', {'class': 'fullscreenPanelDisabled'});
		wkContainer.append(workDisabled);
		workPanel = $('<div>', {'id': 'fnWorkPanelValues', 'class': 'fullscreenPanelValues'});
		wkContainer.append(workPanel);

	}
	else workPanel = $('#fnWorkPanelValues');
	
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

		// Generar titulo
		var containerTitle = $('<h1>');
		containerTitle.html('<object type="image/svg+xml" data="img/logo_black.svg" alt="Natalia Sanjuán Molinero Logo">' +
			'<!-- Fallback en caso de fallo -->Natalia Sanjuán Molinero Logo </object>');
		containerTitle.click(destroyContainer);
		workPanel.append(containerTitle);

		// Generar container según la primera imagen
		var container = $('<div>', {'id': 'fnWorkPanelValuesContainer'});
		var containerPhoto = $('<div>', {'id': 'fnWorkPanelValuesPhoto'});
		containerPhoto.html('<img src="' + currentImages[0] + '" alt="Miniatura de ' + 
			currentInformation['title'] + '"/>');
		container.append(containerPhoto);
		container.append('<div id="fnWorkPanelValuesInfo"><h3>' + currentInformation['title'] + 
			'</h3><div id="fnWorkPanelValuesInfoText">' + currentInformation['text'] + '</div>');
		workPanel.append(container);

		// Generar handler de fotos
		containerPhoto.click(showPictures);

		// Generar boton de cerrar
		var workButtonCloseDiv = $('<div>', {'id': 'fnContainerBack'});
		var workButtonClose = $('<p>');
		workButtonClose.html('<i class="fa fa-chevron-left" aria-hidden="true"></i> Volver al portfolio');
		workButtonClose.click(destroyContainer);
		workButtonCloseDiv.append(workButtonClose);
		workPanel.append(workButtonCloseDiv);

	}
	else
	{
		// Activar apariencia de movil
		workPanel.addClass('fullscreenPanelValuesMobile');
		
		// Crear panel de informacion
		workPanel.append('<div id="fnWorkPanelValuesInfo"><h3>' + currentInformation['title'] + 
		'</h3><div id="fnWorkPanelValuesInfoText">' + currentInformation['text'] + '</div></div>');

		// Crear imagenes
		var container = $('<div>', {'id': 'fnWorkPanelValuesContainer'});
		var containerHTML = '';
		for (var i = 0; i < currentImages.length; i++)
		{
			if (i === 0 || window.innerWidth < 1024) containerHTML += '<img '; else containerHTML += '<img class="hid" ';
			containerHTML += 'src="' + currentImages[i] + '" alt="Miniatura ' + (i + 1) + ' de ' + 
				currentInformation['title'] + '"/>';
		}
		container.html(containerHTML);
		workPanel.append(container);
		var buttonMobile = $('<div>', {'id': 'fnContainerBackMobile'});
		buttonMobile.html('<i class="fa fa-chevron-left" aria-hidden="true"</i>');
		buttonMobile.click(destroyContainer);
		workPanel.append(buttonMobile);

		currentHeightBackMobile = (($('#fnWorkPanelValuesInfo h3').height() + 50) * 1.3) - 8;
		buttonMobile.css('height', currentHeightBackMobile);

	}

	// Detectar evento de resize en el navegador
	if (window.innerWidth > 1023)
	{

		resizeContainerDesktop();
		$(window).off('resize', resizeContainerMobile);
		$(window).resize(resizeContainerDesktop);
		$(window).resize(resizeContainerDetail);
	}
	else
	{
		resizeContainerMobile();
		$(window).off('resize', resizeContainerDesktop);
		$(window).off('resize', resizeContainerDetail);
		$(window).resize(resizeContainerMobile);
	}
};
