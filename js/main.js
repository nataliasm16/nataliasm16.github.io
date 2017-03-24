
// Variables de entorno
var heightPadding = 0, currentWindowHeight = 0, numberPortfolio = 0;

// Generar animación lenta de scroll
var scrollSlower = function scrollSlower(e)
{
	stopPropagation(e);
	$('html, body').animate({
        scrollTop: $($.attr(this, 'href') ).offset().top
    }, 500);
};

// Frenar propagación del evento
var stopPropagation = function stopPropagation(e)
{
	if (typeof e.preventDefault == "function") e.preventDefault();
    if (typeof e.stopPropagation == "function") e.stopPropagation();
    else e.cancelBubble = true;
};

// Generar botones de navegacion / filtros
var createNavigation = function createNavigation()
{
	var categories = info_list['categories'];
	var container = $('#portfolio-items');

	for (var i = 0; i < categories.length; i++)
	{
		// Crear boton y asignar handler
		var li = $("<li>", {"class": "title", "data-folder": categories[i]['folder']});
		li.html('<span>' + categories[i]['label'] + '</span>');
		li.click(generateFilter);
		container.append(li);

		// Añadir bola si es necesario
		if (i < (categories.length - 1))
		{
			container.append('<li class="circle"><i class="fa fa-circle" aria-hidden="true"></i></li>');
		}
	}
};

// Cargar contenido de la web
var loadContent = function loadContent()
{
	// Conseguir containers con hidden
	$('.hidden').removeClass('hidden');

	// Generar barra de navegación
	createNavigation();

	// Generar thumbnails
	createThumbnails(numberPortfolio);

	// Asignar animación de carrousel a containers con más de un thumbnail
	animateThumbnailsStart();

	// Borrar Spinner
	$('#loader-container').addClass('hidden');
};

// Calcula el numero de fotos segun el ancho
var calculatePortfolio = function calculatePortfolio(currentWidth)
{
	if (currentWidth > 0 && currentWidth < 600)
	{
		numberPortfolio = 1;
	}
	else if (currentWidth >= 600 && currentWidth <= 768)
	{
		numberPortfolio = 2;
	}
	else numberPortfolio = 3;
};

// Auto-ajustar tamano del header
var resizeBackground = function resizeBackground(currentHeight)
{
	// Actualizar altura del background
	var headerHeight = ((currentHeight - heightPadding) > 1080) ? 1080 :
		currentHeight - heightPadding;
	$('.header-container').css('height', headerHeight);
};

// Auto-ajustar dimensiones segun ventana
var resizeWindow = function resizeWindow(e)
{
	// Calcular altura/anchura del navegador
	var heightNav = window.innerHeight;
	var widthNav = window.innerWidth;

	// Comprobar que la altura ha cambiado
	if (currentWindowHeight !== heightNav)
	{
		// Actualizar altura del navegador
		currentWindowHeight = heightNav;

		// Ejecutar resize del background
  		resizeBackground(currentWindowHeight);
	}

	// Generar valor de portfolio desde anchura
	var newNumberPortfolio = 0;
	if (numberPortfolio === 1 && widthNav >= 600 && widthNav <= 768)
	{
		newNumberPortfolio = 2;
	}
	else if (numberPortfolio === 1 && widthNav > 768)
	{
		newNumberPortfolio = 3;
	}
	else if (numberPortfolio === 2 && widthNav > 768)
	{
		newNumberPortfolio = 3;
	}
	else if (numberPortfolio === 2 && widthNav < 600)
	{
		newNumberPortfolio = 1;
	}
	else if (numberPortfolio === 3 && widthNav >= 600 && widthNav <= 768)
	{
		newNumberPortfolio = 2;
	}
	else if (numberPortfolio === 3 && widthNav < 600)
	{
		newNumberPortfolio = 1;
	}

	// Cambiar portfolio si realmente ha cambiado
	if (newNumberPortfolio !== 0 && newNumberPortfolio !== numberPortfolio)
	{
		numberPortfolio = newNumberPortfolio;
		createThumbnails(numberPortfolio);
	}
};

// Ejecutar funciones cuando DOM está cargado
$(document).ready(function()
{	
	// Calcular altura de la barra superior
	if ($('.browserupgrade').length > 0)
	{
		heightPadding += ($('.browserupgrade').height() + 30);
	}

	// Activar scroll
	$(document).on('click', 'a', scrollSlower);

	// Ejecutar resize del background
	resizeBackground(window.innerHeight);

	// Calcular numero de fotos del portofolio
	calculatePortfolio(window.innerWidth);

	// Borrar loader y cargar DOM
	loadContent();
	
	// Detectar evento de resize en el navegador
	$(window).resize(resizeWindow);

});


